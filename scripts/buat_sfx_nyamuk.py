"""Audio B3-10 nyamuk pilih-pilih (Kiki, 25 Nov 2026) — 100% sintesis sendiri (numpy), tanpa sampel unduhan / rekaman.
Pemakaian: /usr/bin/python3.13 scripts/buat_sfx_nyamuk.py   (file yang sudah ada tidak ditimpa; benih acak tetap → hasil identik)
Keluaran:
  aset/sfx/nging.wav        dengung nyamuk kartun 1,3 dtk (sayap ±560 Hz + harmonik, getar AM, Doppler lewat) — pelan, untuk frame 0
  aset/sfx/nging_akhir.wav  dengung yang SAMA mendekat 1,2 dtk ke frame terakhir → menyambung ke nging frame 0 (loop)
  aset/sfx/tepuk.wav        tepukan telapak ke betis (derau pita-lebar + "tap" rendah) 0,25 dtk
  aset/sfx/klang.wav        magnet jatuh di meja: denting logam inharmonik pendek 0,9 dtk
  aset/musik/teras-malam.wav latar malam: pad lembut Dm–Bb–F–C + pluk pizzicato + jangkrik halus, 1 putaran, loop mulus
Tempo dipilih agar video (DURASI_VIDEO) = tepat 6 putaran musik → loop akhir→awal menyambung.
"""
import wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(10)
DURASI_VIDEO = 54.64
SIKLUS = DURASI_VIDEO / 6
KETUK = SIKLUS / 16
D3 = 146.832
AKOR = [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]]   # Dm, Bb, F, C (semitone dari D3)


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


def dengung(lama, f0=560, geser=(1.0, 1.0), env_titik=((0, 0), (.25, 1), (.75, 1), (1, 0)), pan=(-.6, .6)):
    n = int(lama * SR); t = np.arange(n) / SR; u = t / lama
    f = f0 * np.interp(u, [0, 1], geser) * (1 + .012 * np.sin(2 * np.pi * 7.3 * t))
    fase = 2 * np.pi * np.cumsum(f) / SR
    y = sum((1 / k ** 1.1) * np.sin(k * fase) for k in range(1, 9))
    y *= .75 + .25 * np.sin(2 * np.pi * 23 * t)          # getar kepakan
    e = np.interp(u, [a for a, _ in env_titik], [b for _, b in env_titik])
    y *= e
    p = np.interp(u, [0, 1], pan)
    return np.stack([y * (1 - p) / 2, y * (1 + p) / 2], 1)


def tepuk():
    n = int(.25 * SR); t = np.arange(n) / SR
    d = rng.standard_normal(n); d = d - lowpass(d, 900)
    y = d * np.exp(-t * 38) + .8 * np.sin(2 * np.pi * 140 * t) * np.exp(-t * 30)
    return y * np.clip(t / .002, 0, 1)


def klang():
    n = int(.9 * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for f, a, dk in ((820, 1, 6), (1310, .6, 8), (2050, .45, 10), (2890, .3, 13), (3770, .2, 16)):
        y += a * np.sin(2 * np.pi * f * t) * np.exp(-t * dk)
    y += .6 * np.sin(2 * np.pi * 95 * t) * np.exp(-t * 22)   # "duk" meja
    return y * np.clip(t / .001, 0, 1)


def latar():
    N = int(SIKLUS * SR); ekor = int(2.5 * SR); y = np.zeros(N + ekor); t = np.arange(N + ekor) / SR
    bar = SIKLUS / 4
    for bi, ak in enumerate(AKOR):
        a = int(bi * bar * SR); m = int((bar + 1.2) * SR); tt = t[:m]
        e = np.clip(tt / 0.5, 0, 1) * np.clip((bar + 1.2 - tt) / 1.2, 0, 1)
        for st in ak:
            f = D3 * 2 ** (st / 12)
            y[a:a + m] += .09 * e * (np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * f * 1.004 * tt))
        for kb in (0, 2.5):  # bas
            a2 = a + int(kb * KETUK * SR); tt2 = t[: int(1.0 * SR)]; f = D3 / 2 * 2 ** (ak[0] / 12)
            y[a2:a2 + len(tt2)] += .4 * np.sin(2 * np.pi * f * tt2) * np.exp(-tt2 * 4.5) * np.clip(tt2 / .006, 0, 1)
        for j, kb in enumerate((1, 1.5, 3, 3.5)):  # pizzicato jenaka
            a3 = a + int(kb * KETUK * SR); tt3 = t[: int(.4 * SR)]; st = ak[j % 3] + 12
            f = D3 * 2 ** (st / 12)
            y[a3:a3 + len(tt3)] += .07 * (np.sin(2 * np.pi * f * tt3) + .3 * np.sin(4 * np.pi * f * tt3)) * np.exp(-tt3 * 14)
    for i in range(8):  # jangkrik: 3 kerikan cepat ±4,6 kHz tiap 2 ketukan
        for k in range(3):
            a = int((i * 2 * KETUK + k * .06) * SR); tt = t[: int(.04 * SR)]
            y[a:a + len(tt)] += .012 * np.sin(2 * np.pi * 4600 * tt) * np.sin(np.pi * tt / .04)
    out = y[:N].copy(); out[:ekor] += y[N:N + ekor]
    return out


if __name__ == "__main__":
    s, m = ROOT / "aset/sfx", ROOT / "aset/musik"
    simpan(s / "nging.wav", dengung(1.3, 560, (1.04, .97), ((0, 0), (.15, 1), (.55, .8), (1, 0)), (.7, -.2)), .5)
    simpan(s / "nging_akhir.wav", dengung(1.2, 560, (.98, 1.04), ((0, 0), (.6, .8), (.9, 1), (1, .9)), (-.6, .7)), .5)
    simpan(s / "tepuk.wav", tepuk(), .7)
    simpan(s / "klang.wav", klang(), .6)
    simpan(m / "teras-malam.wav", latar(), .5)
