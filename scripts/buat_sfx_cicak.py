"""Audio B3-11 cicak nggak jatuh (Yoga, 26 Nov 2026) — 100% sintesis sendiri (numpy), tanpa sampel unduhan / rekaman.
Pemakaian: python scripts/buat_sfx_cicak.py   (file yang sudah ada tidak ditimpa; benih acak tetap → hasil identik)
Keluaran:
  aset/sfx/tokek.wav            panggilan "to-KEK!" kartun (denyut glotal + 2 formant, BUKAN rekaman tokek asli) 0,75 dtk
  aset/sfx/receh.wav            hujan koin kartun (denting inharmonik acak makin rapat) + "BRUK" karung di akhir, 1,4 dtk
  aset/musik/langit-langit.wav  latar jenaka malam: pluk marimba + bas petik + pad tosca lembut C–Am–Dm–G, melodi gubahan Yoga,
                                1 putaran = DURASI_VIDEO/5 → video 50,0 dtk = tepat 5 putaran (loop akhir→awal menyambung)
"""
import wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(11)
DURASI_VIDEO = 50.0
SIKLUS = DURASI_VIDEO / 5
KETUK = SIKLUS / 16
C3 = 130.813


def simpan(path, x, puncak=None):
    if path.exists():
        print("lewati (sudah ada):", path.name); return
    x = np.asarray(x, float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    if puncak is not None: x = x / (np.max(np.abs(x)) or 1) * puncak
    x = np.clip(x, -0.99, 0.99)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype("<i2").tobytes())
    print("dibuat:", path.name, f"{len(x) / SR:.2f} dtk")


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y


def resonator(x, f, bw):
    """bandpass 2-kutub sederhana (formant)."""
    r = np.exp(-np.pi * bw / SR); c = 2 * r * np.cos(2 * np.pi * f / SR); y = np.zeros_like(x); y1 = y2 = 0.0
    g = 1 - r
    for i, v in enumerate(x):
        y0 = g * v + c * y1 - r * r * y2; y[i] = y0; y2 = y1; y1 = y0
    return y


def suku(lama, f0, f0_akhir, formant, keras):
    n = int(lama * SR); t = np.arange(n) / SR
    f = np.interp(t, [0, lama], [f0, f0_akhir]); fase = np.cumsum(f) / SR
    denyut = (fase % 1.0 < 0.18).astype(float) - 0.18   # denyut glotal kasar (serak)
    denyut += 0.25 * rng.standard_normal(n) * keras
    y = sum(a * resonator(denyut, ff, bw) for ff, bw, a in formant)
    e = np.clip(t / 0.012, 0, 1) * np.exp(-np.clip(t - lama * 0.55, 0, None) * 18)
    return y * e


def tokek():
    to = suku(0.20, 150, 135, [(520, 120, 1.0), (950, 160, .6)], .5)
    kek = suku(0.36, 210, 165, [(700, 140, 1.0), (1500, 220, .7), (2600, 300, .25)], .9)
    klik = np.zeros(int(0.012 * SR)); klik[:40] = rng.standard_normal(40)
    y = np.concatenate([to, np.zeros(int(0.07 * SR)), klik * .5, kek, np.zeros(int(0.1 * SR))])
    return y


def receh():
    n = int(1.4 * SR); t = np.arange(n) / SR; y = np.zeros(n)
    waktu = np.sort(np.concatenate([rng.uniform(0, 1.0, 34) ** 0.7 * 1.0]))
    for i, w in enumerate(waktu):
        a = int(w * SR); m = min(n - a, int(0.35 * SR)); tt = np.arange(m) / SR
        f = rng.uniform(2600, 5200)
        s = sum(k * np.sin(2 * np.pi * f * r * tt) for r, k in ((1, 1), (1.47, .5), (2.09, .3))) * np.exp(-tt * rng.uniform(14, 24))
        y[a:a + m] += s * rng.uniform(.25, .6)
    a = int(1.02 * SR); m = n - a; tt = np.arange(m) / SR
    d = rng.standard_normal(m); d = lowpass(d, 500)
    bruk = (np.sin(2 * np.pi * 70 * tt) * 1.4 + d * 4) * np.exp(-tt * 16) * np.clip(tt / .003, 0, 1)
    y[a:] += bruk
    return y


def pluk(f, lama, terang=1.0):
    n = int(lama * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + .35 * terang * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 30) + .15 * np.sin(2 * np.pi * 2 * f * t)
    return y * np.exp(-t * 7) * np.clip(t / .003, 0, 1)


def latar():
    N = int(round(SIKLUS * SR)); ekor = int(2.0 * SR); y = np.zeros(N + ekor)
    AKOR = [[0, 4, 7], [-3, 0, 4], [2, 5, 9], [-5, -1, 2]]   # C, Am, Dm, G (semitone dari C3)
    bar = SIKLUS / 4; t = np.arange(N + ekor) / SR
    for bi, ak in enumerate(AKOR):
        a = int(bi * bar * SR); m = int((bar + 1.0) * SR); tt = t[:m]
        e = np.clip(tt / 0.4, 0, 1) * np.clip((bar + 1.0 - tt) / 1.0, 0, 1)
        for st in ak:
            f = 2 * C3 * 2 ** (st / 12)
            y[a:a + m] += .05 * e * (np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 1.003 * tt))
        for kb, st in ((0, ak[0]), (2, ak[2] - 12), (2.5, ak[0])):   # bas petik
            b = int((bi * bar + kb * KETUK) * SR); p = pluk(C3 / 2 * 2 ** (ak[0] / 12) if st == ak[0] else C3 / 2 * 2 ** ((st + 12) / 12), 0.6, .3) * .32
            y[b:b + len(p)] += p
    # melodi marimba gubahan sendiri (16 ketuk per bar x 4 bar = 64 langkah sixteenth? pakai 8 langkah per bar, None = diam)
    MEL = [[7, None, 12, 11, 12, None, 7, None], [9, None, 12, None, 16, 14, 12, None],
           [14, None, 12, 9, 10, None, 9, None], [7, 9, 11, None, 14, None, 11, None]]
    for bi, baris in enumerate(MEL):
        for si, st in enumerate(baris):
            if st is None: continue
            b = int((bi * bar + si * bar / 8) * SR); p = pluk(2 * C3 * 2 ** (st / 12), 0.7) * .2
            y[b:b + len(p)] += p
    # shaker lembut tiap ketuk ganjil
    for k in range(16):
        b = int((k * KETUK + KETUK / 2) * SR); m = int(.07 * SR)
        d = rng.standard_normal(m); d = d - np.convolve(d, np.ones(6) / 6, "same")
        y[b:b + m] += d * np.exp(-np.arange(m) / SR * 60) * .05
    out = y[:N].copy(); out[:ekor] += y[N:N + ekor]   # ekor dibungkus ke awal → loop mulus
    return out


if __name__ == "__main__":
    sfx = ROOT / "aset/sfx"; mus = ROOT / "aset/musik"
    simpan(sfx / "tokek.wav", tokek(), .8)
    simpan(sfx / "receh.wav", receh(), .8)
    simpan(mus / "langit-langit.wav", latar(), .7)
