"""Efek suara tambahan B3-04 suara rekaman (Yoga, 23 Nov 2026) — sintesis sendiri, tanpa unduhan/lisensi pihak lain.
Pemakaian: python scripts/buat_sfx_suara.py → aset/sfx/{tok,hapus}.wav (file yang sudah ada tidak ditimpa).
tok   = sendok mengetuk mangkuk bakso keramik dua kali ("tok-tok": nada logam-keramik pendek berparsial tak harmonis)
hapus = voice note dibuang ke tempat sampah (sapuan derau turun pendek + "tup" kecil)"""
import wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(23)


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


def tok():  # dua ketukan sendok di bibir mangkuk keramik
    x = np.zeros(int(0.55 * SR))
    for t0, g in [(0.0, 1.0), (0.17, 0.8)]:
        n = int(0.38 * SR); i = int(t0 * SR); tt = np.arange(n) / SR
        bunyi = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, a, d in [(2350, 1, 26), (3870, .55, 38), (5420, .3, 55), (1180, .25, 18)])
        klik = rng.standard_normal(n) * np.exp(-tt * 900) * 0.5
        x[i:i + n] += (bunyi + klik) * g
    return x


def hapus():  # sapuan "swip" turun + tup lembut
    t = t_(0.42); d = rng.standard_normal(len(t)); env = np.sin(np.pi * np.clip(t / 0.3, 0, 1)) ** 2 * (t < 0.3)
    fc = 3200 - 2600 * np.clip(t / 0.3, 0, 1)
    y = np.zeros_like(d); s = 0.0
    for i, v in enumerate(d):
        a = np.exp(-2 * np.pi * fc[i] / SR); s = (1 - a) * v + a * s; y[i] = s
    tup = np.sin(2 * np.pi * (180 - 80 * t) * t) * np.exp(-np.maximum(0, t - 0.3) * 40) * (t >= 0.3)
    return y * env * 1.4 + tup * 0.5


if __name__ == "__main__":
    d = ROOT / "aset/sfx"
    simpan(d / "tok.wav", tok(), .6); simpan(d / "hapus.wav", hapus(), .55)
