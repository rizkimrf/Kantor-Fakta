"""Membuat musik & efek suara khas channel dengan sintesis (tanpa unduhan, tanpa lisensi pihak lain).
Pemakaian: /usr/bin/python3 scripts/buat_audio_aset.py   (butuh numpy)
Keluaran : aset/musik/tenang-hujan.wav (loop 72 dtk) · aset/sfx/{jingle,ding,ding_ganda,whoosh,pop,boing,langkah,langkah1,
           tetes,gelembung,hujan,gerimis}.wav — 48 kHz, 16-bit stereo."""
import wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(7)


def simpan(path, x, puncak=0.89):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    m = np.max(np.abs(x)) or 1
    x = x / m * puncak
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def t_(d): return np.arange(int(d * SR)) / SR
def hz(n): return 440 * 2 ** ((n - 69) / 12)   # nomor MIDI → Hz


def lowpass(x, fc):  # filter 1 kutub sederhana
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y


def lp_cepat(x, fc):  # lowpass lewat FFT (untuk sinyal panjang)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / np.sqrt(1 + (f / fc) ** 4), len(x))


def bp_cepat(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    g = 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4) / np.sqrt(1 + (f / hi) ** 4)
    return np.fft.irfft(X * g, len(x))


def bel(f, d, kec=6.0):  # nada lonceng/vibrafon lembut
    t = t_(d); e = np.exp(-kec * t) * np.minimum(1, t / 0.004)
    return e * (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-4 * t) + 0.12 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-8 * t))


def ep(f, d):  # electric piano lembut
    t = t_(d); e = np.exp(-2.2 * t) * np.minimum(1, t / 0.01)
    mod = np.sin(2 * np.pi * f * t) * 0.8 * np.exp(-3 * t)
    return e * np.sin(2 * np.pi * f * t + mod) * 0.8


def taruh(buf, x, mulai, gain=1.0, pan=0.0, ulang=False):
    i = int(mulai * SR); n = len(x)
    l, r = gain * (1 - max(0, pan)), gain * (1 + min(0, pan))
    if ulang:  # bungkus ekor ke awal supaya loop mulus
        idx = (np.arange(n) + i) % len(buf)
        np.add.at(buf[:, 0], idx, x * l); np.add.at(buf[:, 1], idx, x * r)
    else:
        j = min(len(buf), i + n); buf[i:j, 0] += x[:j - i] * l; buf[i:j, 1] += x[:j - i] * r


# ---------------- MUSIK: "tenang-hujan" (90 BPM, 27 birama = 72 dtk, loop mulus) ----------------
def musik():
    bpm, birama = 90, 27; ketuk = 60 / bpm; L = birama * 4 * ketuk
    buf = np.zeros((int(L * SR), 2))
    akor = [[53, 57, 60, 64], [55, 59, 62, 65], [52, 55, 59, 62], [57, 60, 64, 67]]  # Fmaj7 G7 Em7 Am7
    bas = [41, 43, 40, 45]
    pent = [72, 74, 76, 79, 81, 84]
    for b in range(birama):
        k = b % 4; t0 = b * 4 * ketuk
        for j, n in enumerate(akor[k]):
            taruh(buf, ep(hz(n), 4 * ketuk + 1.0), t0 + j * 0.012, 0.16, pan=(j - 1.5) * 0.25, ulang=True)
        taruh(buf, ep(hz(n), 1.6), t0 + 2 * ketuk, 0.07, pan=0.3, ulang=True)
        tb = t_(2 * ketuk); sb = np.sin(2 * np.pi * hz(bas[k]) * tb) * np.exp(-1.2 * tb) * np.minimum(1, tb / 0.02)
        taruh(buf, sb, t0, 0.32, ulang=True); taruh(buf, sb * 0.7, t0 + 2.5 * ketuk, 0.22, ulang=True)
        if b % 8 >= 2:  # melodi pluk pelan, jarang
            for s in range(8):
                if rng.random() < 0.38:
                    taruh(buf, bel(hz(pent[rng.integers(len(pent))]), 1.2, 4.5), t0 + s * ketuk / 2, 0.09, pan=rng.uniform(-.5, .5), ulang=True)
        for s in range(8):  # shaker halus
            sh = rng.standard_normal(int(0.05 * SR)) * np.exp(-np.arange(int(0.05 * SR)) / SR * 70)
            taruh(buf, sh, t0 + s * ketuk / 2, 0.012 if s % 2 else 0.02, pan=0.4, ulang=True)
    # hujan tipis di latar
    n = rng.standard_normal(len(buf)); hj = bp_cepat(n, 900, 6000) * 0.02
    buf[:, 0] += hj; buf[:, 1] += np.roll(hj, 4800)
    for c in range(2): buf[:, c] = lp_cepat(buf[:, c], 7000)
    return buf


# ---------------- EFEK SUARA ----------------
def jingle():
    d = 1.6; b = np.zeros((int(d * SR), 2))
    for i, n in enumerate([72, 76, 79, 84]): taruh(b, bel(hz(n), 0.6, 9), i * 0.09, 0.5, pan=(i - 1.5) * .2)
    taruh(b, bel(hz(88), 1.2, 3.5), 0.42, 0.9); taruh(b, bel(hz(100), 1.0, 5), 0.42, 0.25)
    return b


def ding(): return bel(hz(88), 1.2, 3.5) + 0.25 * bel(hz(100), 1.2, 5)


def ding_ganda():
    b = np.zeros((int(1.6 * SR), 2)); taruh(b, ding(), 0, 0.8); taruh(b, bel(hz(91), 1.2, 3.5) + 0.25 * bel(hz(103), 1.2, 5), 0.2, 0.8); return b


def whoosh():
    d = 0.6; t = t_(d); n = rng.standard_normal(len(t)); y = np.zeros_like(n)
    for k in range(6):  # sapuan pita frekuensi naik lalu turun
        a, z = int(k * len(t) / 6), int((k + 1) * len(t) / 6); fc = 500 + 2500 * np.sin(np.pi * (k + .5) / 6)
        y[a:z] = bp_cepat(n, fc * 0.6, fc * 1.6)[a:z]
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    b = np.zeros((len(t), 2)); b[:, 0] = y * e * (1 - t / d * .6); b[:, 1] = y * e * (0.4 + t / d * .6); return b


def pop():
    t = t_(0.09); f = 900 * np.exp(-t * 30) + 280; ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 45) * np.minimum(1, t / 0.002)


def boing():
    t = t_(0.55); f = 220 + 140 * np.sin(2 * np.pi * 11 * t) * np.exp(-5 * t) + 120 * np.exp(-8 * t); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-4.5 * t) * np.minimum(1, t / 0.005)


def langkah1():
    t = t_(0.16); n = lowpass(rng.standard_normal(len(t)), 900)
    return (n * 2 + np.sin(2 * np.pi * 95 * t)) * np.exp(-t * 32)


def langkah():
    b = np.zeros((int(1.7 * SR), 2))
    for i in range(4): taruh(b, langkah1(), i * 0.4, 0.8 if i % 2 else 0.65, pan=-.15 if i % 2 else .15)
    return b


def tetes():
    t = t_(0.28); f = 520 + 1300 * (1 - np.exp(-t * 28)); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 18) * np.minimum(1, t / 0.002)


def gelembung():  # gelembung naik lalu pecah berdesis (seperti soda)
    d = 2.2; b = np.zeros((int(d * SR), 2))
    for i in range(26):
        tt = t_(0.07); f0 = rng.uniform(700, 1800); f = f0 * (1 + 1.5 * tt / 0.07); ph = 2 * np.pi * np.cumsum(f) / SR
        taruh(b, np.sin(ph) * np.exp(-tt * 50), rng.uniform(0, 1.6), rng.uniform(.15, .35), pan=rng.uniform(-.6, .6))
    t = t_(d); dz = bp_cepat(rng.standard_normal(len(t)), 3000, 12000) * np.clip((t - 0.6) / 0.5, 0, 1) * np.exp(-np.clip(t - 1.2, 0, None) * 2.5) * 0.25
    b[:, 0] += dz; b[:, 1] += np.roll(dz, 300); return b


def hujan(deras, d=20.0):
    t = t_(d); b = np.zeros((len(t), 2))
    for c in range(2):
        n = rng.standard_normal(len(t)); b[:, c] = bp_cepat(n, 400, 7000) * (0.25 + 0.6 * deras) + lp_cepat(rng.standard_normal(len(t)), 250) * 0.3 * deras
    for _ in range(int(d * (8 + 40 * deras))):
        taruh(b, tetes() * rng.uniform(.04, .15), rng.uniform(0, d - .3), 1, pan=rng.uniform(-.8, .8), ulang=True)
    fade = int(0.5 * SR); w = np.linspace(0, 1, fade)[:, None]   # sambung ujung → loop mulus
    b[:fade] = b[:fade] * w + b[-fade:] * (1 - w); return b[:-fade]


if __name__ == "__main__":
    s = ROOT / "aset/sfx"
    simpan(ROOT / "aset/musik/tenang-hujan.wav", musik(), 0.7)
    for nama, f in [("jingle", jingle), ("ding", ding), ("ding_ganda", ding_ganda), ("whoosh", whoosh), ("pop", pop), ("boing", boing),
                    ("langkah", langkah), ("langkah1", langkah1), ("tetes", tetes), ("gelembung", gelembung)]:
        simpan(s / f"{nama}.wav", f())
    simpan(s / "hujan.wav", hujan(0.8), 0.6); simpan(s / "gerimis.wav", hujan(0.25), 0.45)
    print("selesai")
