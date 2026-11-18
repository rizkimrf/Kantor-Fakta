"""Efek suara tambahan video pedas (Yoga, 18 Nov 2026) — sintesis sendiri, tanpa unduhan/lisensi pihak lain.
Pemakaian: python scripts/buat_sfx_pedas.py   → aset/sfx/{kres,fwoosh,alarm,kicau}.wav (file yang sudah ada tidak ditimpa)."""
import wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(18)


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


def kres():  # gigitan renyah: 3 letupan derau pendek berpita tinggi
    x = np.zeros(int(0.28 * SR))
    for k, (t0, g) in enumerate([(0.0, 1), (0.05, .7), (0.11, .5)]):
        n = int(0.05 * SR); i = int(t0 * SR); e = np.exp(-np.arange(n) / SR * 70)
        d = rng.standard_normal(n); d = d - lp(d, 1800)
        x[i:i + n] += d * e * g
    return x


def fwoosh():  # semburan api: derau lowpass naik-turun + gemuruh
    t = t_(0.75); env = np.sin(np.pi * np.clip(t / 0.75, 0, 1)) ** 1.5 * np.exp(-t * 1.2)
    d = rng.standard_normal(len(t)); a = lp(d, 900) * 3 + lp(d, 3500) * .6
    rum = np.sin(2 * np.pi * (70 + 40 * t) * t) * .25
    return (a + rum) * env


def alarm():  # "tiut-tiut" kecil, lembut (sinus 2 nada, 2 kali)
    t = t_(0.9); f = np.where((t % 0.45) < 0.225, 1180, 880)
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.minimum(1, (t % 0.225) / 0.01) * np.minimum(1, (0.225 - t % 0.225) / 0.02) * np.exp(-t * 1.0)
    return (np.sin(ph) + .25 * np.sin(2 * ph)) * env * .7


def kicau():  # kicau burung pendek: 3 sapuan frekuensi cepat
    x = np.zeros(int(0.55 * SR))
    for t0, f0, f1 in [(0.0, 3200, 4600), (0.14, 3600, 5200), (0.3, 4200, 3000)]:
        n = int(0.09 * SR); tt = np.arange(n) / SR; f = f0 + (f1 - f0) * tt / 0.09
        ph = 2 * np.pi * np.cumsum(f) / SR; e = np.sin(np.pi * tt / 0.09) ** 2
        i = int(t0 * SR); x[i:i + n] += np.sin(ph) * e
    return x


if __name__ == "__main__":
    d = ROOT / "aset/sfx"
    for nama, fn in [("kres", kres), ("fwoosh", fwoosh), ("alarm", alarm), ("kicau", kicau)]:
        simpan(d / f"{nama}.wav", fn())
