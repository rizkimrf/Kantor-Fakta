"""Audio B3-05 kaget pas mau tidur (Kiki, 25 Nov 2026) — 100% sintesis sendiri (numpy), tanpa sampel unduhan / rekaman.
Pemakaian: python scripts/buat_sfx_tidur.py   (file yang sudah ada tidak ditimpa; benih acak tetap → hasil identik)
Keluaran:
  aset/sfx/dug.wav          "dug" tumpul kartun: dentum rendah 70→45 Hz + derau kasur teredam + per kasur kecil 0,6 dtk
  aset/sfx/detak.wav        detak jantung pelan 2 ketukan "dug-dug" (lub-dub) 0,9 dtk
  aset/sfx/kring.wav        lonceng alarm kartun kecil (getar 2 nada logam + pemukul cepat) 1,0 dtk
  aset/musik/kamar-malam.wav latar ninabobo jenaka: kotak musik (pluk berkilau) + pad hangat + bas lembut, F–Dm–Bb–C, loop mulus
Tempo dipilih agar video (DURASI_VIDEO) = tepat 5 putaran musik → loop akhir→awal menyambung.
"""
import wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(5)
DURASI_VIDEO = 53.35
SIKLUS = DURASI_VIDEO / 5
KETUK = SIKLUS / 16
F3 = 174.614
AKOR = [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]]   # F, Dm, Bb, C (semitone dari F3)
MELODI = [12, 16, 19, 16, 9, 12, 16, 12, 5, 9, 12, 14, 7, 11, 14, 19]  # 1 nada per ketukan (gubahan sendiri)


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


def dug():
    n = int(.6 * SR); t = np.arange(n) / SR
    f = 45 + 25 * np.exp(-t * 18); fase = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(fase) * np.exp(-t * 7) * 1.0
    d = lowpass(rng.standard_normal(n), 600) * np.exp(-t * 30) * 2.2
    per = .12 * np.sin(2 * np.pi * (300 + 60 * np.sin(2 * np.pi * 9 * t)) * t) * np.exp(-((t - .12) ** 2) / .004) 
    return (y + d + per) * np.clip(t / .003, 0, 1)


def detak():
    n = int(.9 * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for t0, a in ((0.0, 1.0), (0.22, .7)):
        u = np.clip(t - t0, 0, None); on = (t >= t0)
        y += on * a * np.sin(2 * np.pi * (60 + 30 * np.exp(-u * 30)) * u) * np.exp(-u * 16) * np.clip(u / .004, 0, 1)
    return lowpass(y, 300) * 2.5


def kring():
    n = int(1.0 * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for k in range(14):  # pemukul bergantian dua lonceng, 14 Hz
        t0 = k / 14; u = np.clip(t - t0, 0, None); on = t >= t0
        f = 1760 if k % 2 else 2093
        y += on * (np.sin(2 * np.pi * f * u) + .4 * np.sin(2 * np.pi * f * 2.76 * u)) * np.exp(-u * 18) * np.clip(u / .001, 0, 1)
    return y * np.clip((1 - t) / .25, 0, 1)


def latar():
    N = int(SIKLUS * SR); ekor = int(2.5 * SR); y = np.zeros(N + ekor); t = np.arange(N + ekor) / SR
    bar = SIKLUS / 4
    for bi, ak in enumerate(AKOR):
        a = int(bi * bar * SR); m = int((bar + 1.2) * SR); tt = t[:m]
        e = np.clip(tt / 0.6, 0, 1) * np.clip((bar + 1.2 - tt) / 1.2, 0, 1)
        for st in ak:  # pad hangat
            f = F3 * 2 ** (st / 12)
            y[a:a + m] += .07 * e * (np.sin(2 * np.pi * f * tt) + .35 * np.sin(2 * np.pi * f * 1.003 * tt) + .15 * np.sin(4 * np.pi * f * tt))
        tt2 = t[: int(1.4 * SR)]; f = F3 / 2 * 2 ** (ak[0] / 12)  # bas lembut tiap birama
        y[a:a + len(tt2)] += .32 * np.sin(2 * np.pi * f * tt2) * np.exp(-tt2 * 2.2) * np.clip(tt2 / .01, 0, 1)
        a2 = a + int(2 * KETUK * SR)
        y[a2:a2 + len(tt2)] += .2 * np.sin(2 * np.pi * f * 1.5 * tt2) * np.exp(-tt2 * 3) * np.clip(tt2 / .01, 0, 1)
    for i, st in enumerate(MELODI * 1):  # kotak musik: 1 nada/ketukan, sinus + harmonik inharmonik kecil, ekor berkilau
        a3 = int(i * KETUK * SR); tt3 = t[: int(1.1 * SR)]; f = F3 * 2 ** (st / 12) * 2
        y[a3:a3 + len(tt3)] += .06 * (np.sin(2 * np.pi * f * tt3) + .25 * np.sin(2 * np.pi * f * 3.01 * tt3) * np.exp(-tt3 * 6)) * np.exp(-tt3 * 3.2) * np.clip(tt3 / .002, 0, 1)
    out = y[:N].copy(); out[:ekor] += y[N:N + ekor]
    return out


if __name__ == "__main__":
    s, m = ROOT / "aset/sfx", ROOT / "aset/musik"
    simpan(s / "dug.wav", dug(), .8)
    simpan(s / "detak.wav", detak(), .7)
    simpan(s / "kring.wav", kring(), .45)
    simpan(m / "kamar-malam.wav", latar(), .5)
