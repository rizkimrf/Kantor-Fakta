"""Audio B3-09 lagu nyangkut (Yoga, 24 Nov 2026) — 100% gubahan & sintesis sendiri (numpy), tanpa sampel unduhan, tanpa suara AI bernyanyi.
Pemakaian: /usr/bin/python3.13 scripts/buat_sfx_lagu.py   (file yang sudah ada tidak ditimpa; hasil identik, benih acak tetap)

Melodi "senandung pagi" (gubahan Yoga): 4 birama 4/4, nada dasar F, "hmm" bervibrato (sintesis aditif + formant nasal "m").
  B1: F  A C  D. C | B2: A  G A  F— | B3: G  Bes D  C. A | B4: G F  G  A  C  (C mengantar kembali ke F → loop)
  Dicek: kontur & ritme tidak sama dengan lagu populer/anak-anak yang dikenal (bukan "Twinkle", bukan lagu daerah/pop).
Tempo dipilih supaya video (56,64 dtk) = tepat 6 putaran motif → loop akhir→awal menyambung secara musik.
Keluaran:
  aset/sfx/senandung_buka.wav   0–5,7 dtk: motif pelan di bawah narasi (−18 dB relatif suara), naik ±0,4 dtk di sela napas 3,7–4,2, tape-stop kecil di "APA-APA"
  aset/sfx/senandung_akhir.wav  motif yang SAMA (fase sesuai kisi musik) naik dari kata "senandung" sampai frame terakhir
  aset/sfx/kaset_klik.wav       tombol play kaset "klak" · aset/sfx/tek.wav gulungan kaset tersendat · aset/sfx/dj.wav ketukan pesta 1,2 dtk
  aset/musik/pagi-senandung.wav latar 1 putaran (F–Dm–Gm–C, pad lembut + bas petik + pluk + shaker), loop mulus
"""
import wave
from pathlib import Path
import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(9)
DURASI_VIDEO = 56.64
SIKLUS = DURASI_VIDEO / 6          # 9,44 dtk = 4 birama
KETUK = SIKLUS / 16                # ±101,7 BPM
F3 = 174.614
MELODI = [(0, 1), (4, .5), (7, .5), (9, 1.5), (7, .5),
          (4, 1), (2, .5), (4, .5), (0, 2),
          (2, 1), (5, .5), (9, .5), (7, 1.5), (4, .5),
          (2, .5), (0, .5), (2, 1), (4, 1), (7, 1)]
AKOR = [[0, 4, 7], [-3, 0, 4], [-7, -2, 2], [-5, -1, 2, 5]]   # F, Dm, Gm, C7 (semitone dari F3)


def simpan(path, x, puncak=None, rms_db=None):
    if path.exists():
        print("lewati (sudah ada):", path.name); return
    x = np.asarray(x, float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    if rms_db is not None:
        x = x * (10 ** (rms_db / 20) / (np.sqrt((x ** 2).mean()) or 1))
    elif puncak is not None:
        x = x / (np.max(np.abs(x)) or 1) * puncak
    x = np.clip(x, -0.99, 0.99)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype("<i2").tobytes())
    print("dibuat:", path.name, f"{len(x) / SR:.2f} dtk")


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y


def nada_waktu(n_siklus=2):
    """semitone & awal-nada per sampel untuk motif yang diulang n_siklus kali"""
    N = int(SIKLUS * n_siklus * SR); semi = np.zeros(N); onset = np.zeros(N)
    t0 = 0.0
    for _ in range(n_siklus):
        for st, b in MELODI:
            a, z = int(t0 * SR), int((t0 + b * KETUK) * SR)
            semi[a:z] = st; onset[a:z] = (np.arange(z - a)) / SR; t0 += b * KETUK
    return semi, onset


def senandung(mulai, lama, pitch_kali=None):
    """motif "hmm" dari fase `mulai` (dtk, dalam kisi musik) sepanjang `lama` dtk"""
    semi, onset = nada_waktu(3)
    a = int((mulai % SIKLUS) * SR); n = int(lama * SR)
    semi, onset = semi[a:a + n], onset[a:a + n]
    # portamento halus (log-frekuensi diratakan ±35 ms)
    k = int(0.035 * SR); semi_h = np.convolve(np.pad(semi, (k, k), mode="edge"), np.ones(2 * k + 1) / (2 * k + 1), "valid")[:n]
    t = np.arange(n) / SR
    vib = 0.32 * np.clip((onset - 0.16) / 0.25, 0, 1) * np.sin(2 * np.pi * 5.3 * t)
    f0 = F3 * 2 ** ((semi_h + vib) / 12)
    if pitch_kali is not None: f0 = f0 * pitch_kali
    fase = 2 * np.pi * np.cumsum(f0) / SR
    y = np.zeros(n)
    for h in range(1, 15):
        f = h * f0
        A = (np.exp(-((f - 270) / 170) ** 2) + .16 * np.exp(-((f - 1050) / 260) ** 2) + .07 * np.exp(-((f - 2350) / 320) ** 2) + .03) / h ** 0.9
        A = A * (f < 9000)
        y += A * np.sin(h * fase + h * 0.37)
    # artikulasi "hmm-hmm": sedikit turun di tiap awal nada, napas tipis
    art = 1 - 0.35 * np.exp(-onset / 0.045) * (onset < 0.2)
    y = y * art + 0.004 * lowpass(rng.standard_normal(n), 900)
    return y


def env(n, titik):
    """amplop gain (dB) dari daftar (detik, dB), interpolasi halus"""
    t = np.arange(n) / SR; xs, ys = zip(*titik)
    return 10 ** (np.interp(t, xs, ys) / 20)


def buka():
    L = 5.75; n = int(L * SR)
    # tape-stop kecil di "APA-APA" (5,0–5,6 dtk): nada turun & melambat
    t = np.arange(n) / SR; ts = np.clip((t - 5.05) / 0.55, 0, 1)
    y = senandung(0.0, L, pitch_kali=1 - 0.55 * ts ** 1.6)
    g = env(n, [(0, -40), (0.12, 0), (3.62, 0), (3.78, 7), (4.2, 7), (4.4, 0), (5.05, 0), (5.6, -30), (5.75, -60)])
    return y * g


def akhir(t_mulai=53.70):
    L = DURASI_VIDEO - t_mulai + 0.05; n = int(L * SR)
    y = senandung(t_mulai, L)
    g = env(n, [(0, -30), (0.5, -6), (1.6, 0), (2.25, 3), (L - 0.12, 3), (L, -4)])
    return y * g


def klik():
    t = np.arange(int(0.25 * SR)) / SR
    a = np.sin(2 * np.pi * (520 - 300 * t) * t) * np.exp(-t * 60)
    b = rng.standard_normal(len(t)) * np.exp(-t * 300) * .5
    d = int(0.045 * SR); c = np.zeros(len(t)); c[d:] = (np.sin(2 * np.pi * 180 * t[:-d]) * np.exp(-t[:-d] * 35) + rng.standard_normal(len(t) - d) * np.exp(-t[:-d] * 220) * .4)
    return a * .6 + b + c


def tek():
    t = np.arange(int(0.32 * SR)) / SR
    x = rng.standard_normal(len(t)) * np.exp(-t * 260)
    x += 0.5 * np.sin(2 * np.pi * 900 * t) * np.exp(-t * 80)
    d = int(0.09 * SR); x[d:] += 0.5 * (rng.standard_normal(len(t) - d) * np.exp(-t[:-d] * 300))
    return x


def dj():
    L = 1.3; n = int(L * SR); t = np.arange(n) / SR; y = np.zeros(n); b = KETUK / 2
    for i in range(int(L / b)):
        a = int(i * b * SR); tt = t[: n - a]
        if i % 2 == 0: y[a:] += np.sin(2 * np.pi * (55 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9)
        else: y[a:] += 0.35 * rng.standard_normal(n - a) * np.exp(-tt * 40)
        y[a:] += 0.12 * np.sign(np.sin(2 * np.pi * 349.2 * 2 ** ([0, 4, 7, 12][i % 4] / 12) * tt)) * np.exp(-tt * 14)
    return y * np.clip((L - t) / 0.25, 0, 1)


def latar():
    N = int(SIKLUS * SR); ekor = int(2.5 * SR); y = np.zeros(N + ekor); t = np.arange(N + ekor) / SR
    bar = SIKLUS / 4
    for bi, ak in enumerate(AKOR):
        a = int(bi * bar * SR); m = int((bar + 1.2) * SR); tt = t[:m]
        e = np.clip(tt / 0.35, 0, 1) * np.clip((bar + 1.2 - tt) / 1.2, 0, 1)
        for st in ak:
            f = F3 * 2 ** (st / 12)
            y[a:a + m] += .10 * e * (np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 1.003 * tt) + .2 * np.sin(4 * np.pi * f * tt))
        for kb in (0, 2):  # bas petik
            a2 = a + int(kb * KETUK * SR); tt2 = t[: int(1.0 * SR)]; f = F3 / 2 * 2 ** (ak[0] / 12)
            y[a2:a2 + len(tt2)] += .45 * np.sin(2 * np.pi * f * tt2) * np.exp(-tt2 * 4) * np.clip(tt2 / .005, 0, 1)
        for kb in (1.5, 3.5):  # pluk akor (marimba lembut)
            a3 = a + int(kb * KETUK * SR); tt3 = t[: int(.6 * SR)]
            for st in ak[:3]:
                f = 2 * F3 * 2 ** (st / 12)
                y[a3:a3 + len(tt3)] += .06 * np.sin(2 * np.pi * f * tt3) * np.exp(-tt3 * 9)
    for i in range(32):  # shaker 8-an
        a = int(i * KETUK / 2 * SR); tt = t[: int(.08 * SR)]
        y[a:a + len(tt)] += (.05 if i % 2 else .025) * lowpass(rng.standard_normal(len(tt)), 6000) * np.exp(-tt * 70)
    out = y[:N].copy(); out[:ekor] += y[N:N + ekor]   # lipat ekor ke awal → loop mulus
    return out


if __name__ == "__main__":
    s, m = ROOT / "aset/sfx", ROOT / "aset/musik"
    # level: narasi ±−17 dB RMS → senandung buka ±−35 dB RMS (−18 dB relatif), puncak sela napas ±−28
    simpan(s / "senandung_buka.wav", buka(), rms_db=-34)
    simpan(s / "senandung_akhir.wav", akhir(), rms_db=-21)
    simpan(s / "kaset_klik.wav", klik(), .7); simpan(s / "tek.wav", tek(), .6); simpan(s / "dj.wav", dj(), .6)
    simpan(m / "pagi-senandung.wav", latar(), .5)
