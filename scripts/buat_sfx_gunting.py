"""Efek suara BARU untuk video Gunting Sjafruddin (Kiki, 18 Nov 2026) — sintesis sendiri, tanpa lisensi pihak lain.
Pemakaian: /usr/bin/python3 scripts/buat_sfx_gunting.py   (butuh numpy; file yang sudah ada tidak ditimpa)
Keluaran : aset/sfx/gunting.wav (gunting memotong kertas: dua klik logam + desis sobek) · aset/sfx/srek.wav (kertas dilipat/digeser)."""
from pathlib import Path
import numpy as np
from buat_audio_aset import SR, simpan, t_, bp_cepat, rng

ROOT = Path(__file__).resolve().parent.parent


def kres():
    d = 0.42; t = t_(d); x = np.zeros_like(t)
    for t0, f, g in ((0.0, 3100, 0.9), (0.2, 2600, 1.0)):  # dua "klik" logam bilah bertemu
        i = int(t0 * SR); tt = t[: len(t) - i]
        x[i:] += g * np.exp(-60 * tt) * (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 1.51 * tt))
    n = bp_cepat(rng.standard_normal(len(t)), 1800, 7000)  # desis kertas terpotong
    e = np.exp(-((t - 0.11) / 0.07) ** 2) * 0.55 + np.exp(-((t - 0.29) / 0.06) ** 2) * 0.4
    return x + n * e * 0.6


def srek():
    d = 0.5; t = t_(d)
    n = bp_cepat(rng.standard_normal(len(t)), 900, 5200)
    e = np.minimum(1, t / 0.04) * np.exp(-((t - 0.22) / 0.16) ** 2) * (0.75 + 0.25 * np.sin(2 * np.pi * 23 * t))
    return n * e


if __name__ == "__main__":
    for nama, f in (("gunting", kres), ("srek", srek)):
        p = ROOT / "aset/sfx" / f"{nama}.wav"
        if p.exists():
            print("sudah ada:", p.name); continue
        simpan(p, f(), puncak=0.8); print("dibuat:", p.name)
