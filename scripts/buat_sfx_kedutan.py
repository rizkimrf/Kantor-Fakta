"""Audio B4-01 kedutan mata (Kiki, 28 Nov 2026) — 100% sintesis sendiri (numpy), tanpa sampel unduhan / rekaman.
Pemakaian: python scripts/buat_sfx_kedutan.py   (file yang sudah ada tidak ditimpa; benih acak tetap → hasil identik)
Keluaran:
  aset/sfx/tiktik.wav            3 ketukan kayu kecil berirama "tik-tik-tik" (kedutan kelopak) 0,45 dtk
  aset/sfx/cring.wav             kilau koin kartun (lonceng inharmonik naik) 0,7 dtk
  aset/sfx/bzzt.wav              dengung "salah" kartun (gergaji turun + desis) 0,4 dtk
  aset/sfx/popkorn.wav           letupan jagung acak satu-satu (makin rapat, tak serempak) 2,2 dtk
  aset/sfx/hik.wav               cegukan kartun "hik!" (denyut glotal + formant naik, BUKAN rekaman orang) 0,24 dtk
  aset/musik/kamar-kedutan.wav   latar jenaka malam: pizzicato + bas petik + pad ungu Em–C–G–D, melodi gubahan Kiki,
                                 1 putaran = 13,95 dtk (4 putaran ≈ 55,8 dtk; ekor dibungkus ke awal → loop mulus)
"""
import wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(28)
SIKLUS = 13.95
KETUK = SIKLUS / 16
E3 = 164.814


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
    r = np.exp(-np.pi * bw / SR); c = 2 * r * np.cos(2 * np.pi * f / SR); y = np.zeros_like(x); y1 = y2 = 0.0
    g = 1 - r
    for i, v in enumerate(x):
        y0 = g * v + c * y1 - r * r * y2; y[i] = y0; y2 = y1; y1 = y0
    return y


def ketuk(f, lama=0.09, keras=1.0):
    n = int(lama * SR); t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 90)) * np.exp(-t * 55)
    d = rng.standard_normal(n) * np.exp(-t * 400) * .4
    return (y + d) * keras * np.clip(t / .001, 0, 1)


def tiktik():
    y = np.zeros(int(.45 * SR))
    for i, (w, f, k) in enumerate(((0, 2100, 1), (.13, 2250, .8), (.25, 2050, .65))):
        a = int(w * SR); s = ketuk(f, .1, k); y[a:a + len(s)] += s
    return y


def cring():
    n = int(.7 * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for i, f in enumerate((2637, 3136, 3951)):
        a = int(i * .06 * SR); tt = t[: n - a]
        s = sum(k * np.sin(2 * np.pi * f * r * tt) for r, k in ((1, 1), (2.4, .35), (3.9, .15))) * np.exp(-tt * 7)
        y[a:] += s * (1 - i * .15)
    return y * np.clip(t / .002, 0, 1)


def bzzt():
    n = int(.4 * SR); t = np.arange(n) / SR
    f = np.interp(t, [0, .4], [190, 120]); fase = np.cumsum(f) / SR
    saw = 2 * (fase % 1) - 1
    d = rng.standard_normal(n) * .25
    y = lowpass(saw + d, 2600)
    return y * np.clip(t / .01, 0, 1) * np.clip((.4 - t) / .08, 0, 1)


def pop1(f=900):
    n = int(.07 * SR); t = np.arange(n) / SR
    d = rng.standard_normal(n)
    y = resonator(d, f, 260) * 6 + np.sin(2 * np.pi * f * .5 * t) * np.exp(-t * 80) * .6
    return y * np.exp(-t * 70) * np.clip(t / .0008, 0, 1)


def popkorn():
    n = int(2.2 * SR); y = np.zeros(n)
    w = np.sort(rng.uniform(0, 1, 16) ** .8 * 2.0)
    for x in w:
        a = int(x * SR); s = pop1(rng.uniform(650, 1300)) * rng.uniform(.5, 1); y[a:a + len(s)] += s[: n - a]
    return y


def hik():
    lama = .22; n = int(lama * SR); t = np.arange(n) / SR
    f = np.interp(t, [0, .05, lama], [280, 420, 360]); fase = np.cumsum(f) / SR
    den = (fase % 1.0 < .2).astype(float) - .2 + .15 * rng.standard_normal(n)
    y = resonator(den, 820, 150) + .7 * resonator(den, 2300, 260) + .2 * resonator(den, 3200, 300)
    e = np.clip(t / .006, 0, 1) * np.exp(-np.clip(t - .05, 0, None) * 22)
    klik = np.zeros(int(.02 * SR)); klik[:60] = rng.standard_normal(60) * .8
    return np.concatenate([klik, y * e])


def pluk(f, lama, terang=1.0, lepas=7):
    n = int(lama * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + .35 * terang * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 40) + .2 * np.sin(2 * np.pi * 2 * f * t)
    return y * np.exp(-t * lepas) * np.clip(t / .002, 0, 1)


def latar():
    N = int(round(SIKLUS * SR)); ekor = int(2.0 * SR); y = np.zeros(N + ekor)
    AKOR = [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]]   # Em, C, G, D (semitone dari E3)
    bar = SIKLUS / 4; t = np.arange(N + ekor) / SR
    for bi, ak in enumerate(AKOR):
        a = int(bi * bar * SR); m = int((bar + 1.0) * SR); tt = t[:m]
        e = np.clip(tt / 0.5, 0, 1) * np.clip((bar + 1.0 - tt) / 1.0, 0, 1)
        for st in ak:
            f = E3 * 2 ** (st / 12)
            y[a:a + m] += .045 * e * (np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 1.004 * tt))
        for kb in (0, 1.5, 2.5):   # bas petik
            b = int((bi * bar + kb * KETUK) * SR); p = pluk(E3 / 2 * 2 ** (ak[0] / 12), 0.6, .3, 6) * .34
            y[b:b + len(p)] += p
    # melodi pizzicato gubahan Kiki (8 langkah per bar, None = diam) — motif "tik-tik" naik-turun
    MEL = [[12, None, 15, 14, 12, None, 7, None], [12, 11, None, 7, 8, None, 7, None],
           [10, None, 14, 15, 17, None, 15, 14], [12, None, 9, None, 14, 12, 9, None]]
    for bi, baris in enumerate(MEL):
        for si, st in enumerate(baris):
            if st is None: continue
            b = int((bi * bar + si * bar / 8) * SR); p = pluk(E3 * 2 ** (st / 12), 0.35, .8, 14) * .2
            y[b:b + len(p)] += p
    for k in range(16):   # detak jam lembut tiap ketuk (cocok tema begadang)
        b = int((k * KETUK + KETUK / 2) * SR); s = ketuk(3200 if k % 2 else 2900, .05, .12)
        y[b:b + len(s)] += s
    out = y[:N].copy(); out[:ekor] += y[N:N + ekor]
    return out


if __name__ == "__main__":
    sfx = ROOT / "aset/sfx"; mus = ROOT / "aset/musik"
    simpan(sfx / "tiktik.wav", tiktik(), .7)
    simpan(sfx / "cring.wav", cring(), .7)
    simpan(sfx / "bzzt.wav", bzzt(), .6)
    simpan(sfx / "popkorn.wav", popkorn(), .75)
    simpan(sfx / "hik.wav", hik(), .8)
    simpan(mus / "kamar-kedutan.wav", latar(), .7)
