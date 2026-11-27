"""Efek suara tambahan A-02 rice cooker & B-01 sambal (Kiki, 21 Nov 2026) — sintesis sendiri, tanpa unduhan/lisensi pihak lain.
Pemakaian: python scripts/buat_sfx_dapur.py → aset/sfx/{klik,desis,derit}.wav (file yang sudah ada tidak ditimpa)."""
import wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(21)


def simpan(path, x, puncak=0.85):
    if path.exists():
        print("lewati (sudah ada):", path.name); return
    x = np.asarray(x, float); x = np.stack([x, x], 1) if x.ndim == 1 else x
    x = x / (np.max(np.abs(x)) or 1) * puncak
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype("<i2").tobytes())
    print("dibuat:", path.name)


def t_(d): return np.arange(int(d * SR)) / SR


def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y


def klik():  # saklar mekanis plastik: ketukan tajam + dentang pegas pendek + "tok" kedua
    x = np.zeros(int(0.32 * SR))
    for t0, g, dec in [(0.0, 1.0, 260), (0.045, 0.55, 180)]:
        n = int(0.03 * SR); i = int(t0 * SR); tt = np.arange(n) / SR
        d = rng.standard_normal(n); d = d - lp(d, 2500)
        x[i:i + n] += (d * 0.8 + np.sin(2 * np.pi * 1900 * tt) * 0.6) * np.exp(-tt * dec) * g
    tt = t_(0.32); x += np.sin(2 * np.pi * 620 * tt) * np.exp(-tt * 28) * 0.12  # sisa getar pegas
    return x


def desis():  # uap keluar dari celah tutup: derau berpita tinggi, naik lalu menipis
    t = t_(1.3); env = np.minimum(1, t / 0.12) * np.exp(-t * 1.6)
    d = rng.standard_normal(len(t)); hi = d - lp(d, 3000)
    return hi * env * (1 + 0.15 * np.sin(2 * np.pi * 7 * t))


def derit():  # derit kayu kapal: sapuan frekuensi rendah bergerigi
    t = t_(0.9); f = 180 + 70 * np.sin(np.pi * t / 0.9); ph = 2 * np.pi * np.cumsum(f) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1; kasar = 1 + 0.5 * rng.standard_normal(len(t))
    y = lp(saw * kasar, 1400); env = np.sin(np.pi * np.clip(t / 0.9, 0, 1)) ** 1.2
    return y * env


if __name__ == "__main__":
    d = ROOT / "aset/sfx"
    simpan(d / "klik.wav", klik()); simpan(d / "desis.wav", desis(), .6); simpan(d / "derit.wav", derit(), .6)
