"""Efek suara A3-01 barcode kasir (Yoga, 23 Nov 2026) — sintesis sendiri, tanpa unduhan/lisensi pihak lain.
Pemakaian: python scripts/buat_sfx_barcode.py → aset/sfx/{bip,cap}.wav (file yang sudah ada tidak ditimpa).
bip = bunyi scanner kasir generik (nada sinus 2,9 kHz pendek 110 ms, tepi halus)
cap = stempel karet "duk" (tumbukan rendah + derau pendek) untuk cap silang merah"""
import wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(1)


def simpan(path, x, puncak=0.8):
    if path.exists():
        print("lewati (sudah ada):", path.name); return
    x = np.asarray(x, float); x = np.stack([x, x], 1)
    x = x / (np.max(np.abs(x)) or 1) * puncak
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype("<i2").tobytes())
    print("dibuat:", path.name)


def bip():
    t = np.arange(int(0.16 * SR)) / SR
    env = np.clip(t / 0.006, 0, 1) * np.clip((0.115 - t) / 0.02, 0, 1)
    return (np.sin(2 * np.pi * 2900 * t) + 0.18 * np.sin(2 * np.pi * 5800 * t)) * env


def cap():
    t = np.arange(int(0.3 * SR)) / SR
    duk = np.sin(2 * np.pi * (140 - 60 * t) * t) * np.exp(-t * 22)
    der = rng.standard_normal(len(t)) * np.exp(-t * 90) * 0.35
    return duk + der


if __name__ == "__main__":
    d = ROOT / "aset/sfx"
    simpan(d / "bip.wav", bip(), .5); simpan(d / "cap.wav", cap(), .7)
