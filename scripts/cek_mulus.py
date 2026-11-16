"""Yoga & Pak Bima — cek KEMULUSAN video sebelum review. Gagal = render ulang dulu, jangan kirim ke Bos.
Pemakaian: python scripts/cek_mulus.py antrean/<folder>     (memeriksa final.mp4)
Memeriksa:
  1. Audio terpotong kasar (lonjakan/jatuh volume > 25 dB dalam 5 ms) -> suara "nyendat".
  2. Hening mati di tengah video (> 0,6 dtk di bawah -50 dB).
  3. Kilatan/potongan kasar: transisi yang berganti total dalam < 4 frame (wipe terlalu cepat) atau frame warna polos.
  4. Gambar beku > 1,2 dtk saat narasi berjalan.
  5. Menunggu tanpa narasi: jeda antar babak > 0,9 dtk (intro > 2,6 dtk) atau suara AI diam > 1,2 dtk.
Juga membuat lembar cek: _kerja/cek_transisi.jpg (6 frame di setiap transisi) dan _kerja/cek_zona_aman.jpg
(4 frame acak dengan garis zona aman) untuk dilihat dengan mata sebelum review."""
import subprocess, sys
from pathlib import Path
import numpy as np

folder = Path(sys.argv[1]); v = folder / "final.mp4"; kerja = folder / "_kerja"; kerja.mkdir(exist_ok=True)
masalah = []

def baca(cmd):
    return subprocess.run(cmd, capture_output=True).stdout

# --- audio
a = np.frombuffer(baca(["ffmpeg", "-v", "error", "-i", str(v), "-ac", "1", "-ar", "16000", "-f", "s16le", "-"]), np.int16).astype(float) / 32768
h = 80; e = np.sqrt(np.add.reduceat(a[: len(a) // h * h] ** 2, np.arange(0, len(a) // h * h, h)) / h); db = 20 * np.log10(e + 1e-7)
D = len(a) / 16000
for i in range(1, len(db)):
    if (db[i - 1] > -30 and db[i] < db[i - 1] - 25) or (db[i] > -30 and db[i - 1] < db[i] - 25):
        t = i * h / 16000
        if 0.5 < t < D - 2: masalah.append(f"audio terpotong kasar di {t:.2f} dtk")
i = 0
while i < len(db):
    if db[i] < -50:
        j = i
        while j < len(db) and db[j] < -50: j += 1
        if (j - i) * h / 16000 > 0.6 and 1 < i * h / 16000 < D - 2: masalah.append(f"hening mati {(j - i) * h / 16000:.1f} dtk di {i * h / 16000:.2f}")
        i = j
    else: i += 1
# --- video
f = np.frombuffer(baca(["ffmpeg", "-v", "error", "-i", str(v), "-vf", "scale=90:160,format=gray", "-f", "rawvideo", "-"]), np.uint8).reshape(-1, 160, 90).astype(float)
d = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2)); fps = 30
lonjak = [k for k in range(1, len(d)) if d[k] > 8]
grup = []
for k in lonjak:
    if grup and k - grup[-1][-1] <= 2: grup[-1].append(k)
    else: grup.append([k])
for g in grup:
    if len(g) < 4 and sum(d[k] for k in g) > 30 and not (len(g) == 1):
        masalah.append(f"transisi terlalu cepat/kasar di {g[0] / fps:.2f} dtk ({len(g)} frame) - pakai transisi 12-18 frame dengan easing")
# frame "tersendat": di tengah gerakan, satu frame hampir tidak berubah lalu gerak lanjut (frame dobel / animasi patah)
for k in range(2, len(d) - 2):
    kiri, kanan = max(d[k - 2], d[k - 1]), max(d[k + 1], d[k + 2])
    if min(kiri, kanan) > 1.2 and d[k] < 0.35 * min(kiri, kanan):
        masalah.append(f"gerak tersendat (frame dobel) di {k / fps:.2f} dtk")
# gerak berbalik arah tiba-tiba (mis. membesar lalu mengecil = efek pantul) terdeteksi sebagai dua lonjakan beruntun
for k in range(3, len(d) - 3):
    if d[k] > 2 and d[k - 1] > 2 and d[k] > 1.8 * d[k - 1] and d[k - 2] > 1.8 * d[k - 1]:
        masalah.append(f"gerak patah/berbalik arah di {k / fps:.2f} dtk")
polos = [k for k in range(len(f)) if f[k].std() < 3]
if polos: masalah.append(f"{len(polos)} frame warna polos (mis. di {polos[0] / fps:.2f} dtk) - layar kosong terlihat seperti kedip")
diam = 0
for k, x in enumerate(d):
    diam = diam + 1 if x < 0.02 else 0
    if diam == int(1.2 * fps): masalah.append(f"gambar beku > 1,2 dtk di {(k - diam) / fps:.2f} dtk")
# --- menunggu terlalu lama tanpa narasi (keputusan Bos 16 Nov: durasi boleh panjang, tapi tidak boleh ada "nunggu")
import json
jf = kerja / "jeda.json"
if jf.exists():
    for n, j in enumerate(json.loads(jf.read_text(encoding="utf-8"))):
        batas = 2.6 if n == 0 else 0.9   # jeda pertama = intro logo; jeda lain = napas antar babak
        if j["total"] > batas: masalah.append(f"menunggu tanpa narasi {j['total']:.1f} dtk (narasi detik {j['t']}) - maks {batas} dtk; ganti set/transisi harus jalan sambil narasi")
wk = folder / "audio/waktu_kata.json"
if wk.exists():
    kt = json.loads(wk.read_text(encoding="utf-8")).get("kata", [])
    for a, b in zip(kt, kt[1:]):
        if b["mulai"] - a["selesai"] > 1.2: masalah.append(f"suara AI diam {b['mulai'] - a['selesai']:.1f} dtk setelah kata '{a['kata']}' (narasi detik {a['selesai']:.1f}) - potong/padatkan celahnya")
# --- lembar cek
titik = [g[0] for g in grup][:8]
if titik:
    pil = "+".join(f"between(n\\,{t - 2}\\,{t + 3})" for t in titik)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(v), "-vf", f"select='{pil}',scale=150:-1,tile=6x{len(titik)}", "-frames:v", "1", str(kerja / "cek_transisi.jpg")])
zona = "drawbox=x=0:y=0:w=1080:h=220:color=red@0.35:t=fill,drawbox=x=0:y=1480:w=1080:h=440:color=red@0.35:t=fill,drawbox=x=900:y=800:w=180:h=680:color=red@0.35:t=fill"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(v), "-vf", f"select='not(mod(n\\,{max(1, len(f) // 4)}))',{zona},scale=270:-1,tile=4x1", "-frames:v", "1", str(kerja / "cek_zona_aman.jpg")])

print(f"Durasi {D:.1f} dtk · transisi terdeteksi {len(grup)}")
if masalah:
    print("TIDAK LULUS kemulusan:"); [print(" -", m) for m in masalah[:20]]; sys.exit(1)
print("LULUS kemulusan. Tetap lihat _kerja/cek_transisi.jpg dan _kerja/cek_zona_aman.jpg (teks & wajah Tebe tidak boleh di area merah).")
