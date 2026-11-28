"""Kiki & Ken — cek KEMULUSAN video sebelum review. Gagal = render ulang dulu, jangan kirim ke Bos.
Pemakaian: python scripts/cek_mulus.py antrean/<folder>     (memeriksa final.mp4)
Memeriksa:
  1. Audio terpotong kasar (lonjakan/jatuh volume > 25 dB dalam 5 ms) -> suara "nyendat".
  2. Hening mati di tengah video (> 0,6 dtk di bawah -50 dB).
  3. Kilatan/potongan kasar: transisi yang berganti total dalam < 4 frame (wipe terlalu cepat) atau frame warna polos.
  4. Gambar beku > 1,2 dtk saat narasi berjalan.
  5. Menunggu tanpa narasi: jeda antar babak > 0,9 dtk atau suara AI diam > 1,2 dtk.
  7. Kecepatan frame tidak tetap 30 fps, atau layar monoton > 3 dtk tanpa perubahan gambar berarti (28 Nov).
  6. Durasi melebihi batas format resep (A 120 dtk, B 75 dtk; video lama 60/90) atau suara baru mulai setelah 0,5 dtk (tanpa intro).
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
# --- 28 Nov (Bos: "smooth, tidak nyendat, betah ditonton")
# a) kecepatan frame harus tetap 30 fps tanpa frame hilang
_pr = baca(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate,avg_frame_rate,nb_frames", "-of", "default=nw=1", str(v)]).decode()
_kv = dict(x.split("=", 1) for x in _pr.split() if "=" in x)
_rf = lambda s: (lambda a, b: float(a) / float(b) if float(b) else 0)(*s.split("/")) if "/" in s else float(s or 0)
if abs(_rf(_kv.get("r_frame_rate", "30/1")) - 30) > 0.5 or abs(_rf(_kv.get("avg_frame_rate", "30/1")) - 30) > 0.5:
    masalah.append(f"kecepatan frame tidak tetap 30 fps (r={_kv.get('r_frame_rate')}, rata-rata={_kv.get('avg_frame_rate')}) - render ulang dengan --fps 30")
# a2) batas tepi: pinggiran hitam/bingkai menurunkan distribusi Reels Facebook ("Batas tepi video", data Meta 29 Nov)
import re as _re
_cd = subprocess.run(["ffmpeg", "-v", "info", "-i", str(v), "-vf", "fps=2,cropdetect=24:2:0", "-f", "null", "-"], capture_output=True, text=True).stderr
_cr = _re.findall(r"crop=(\d+):(\d+):\d+:\d+", _cd)
_wh = baca(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", str(v)]).decode().strip().split(",")
if _cr and len(_wh) == 2:
    _W, _H = int(_wh[0]), int(_wh[1])
    _sempit = [c for c in _cr if int(c[0]) < 0.97 * _W or int(c[1]) < 0.97 * _H]
    if len(_sempit) > 0.3 * len(_cr):
        _c = max(set(_sempit), key=_sempit.count)
        masalah.append(f"pinggiran hitam/bingkai: isi gambar hanya {_c[0]}x{_c[1]} dari {_W}x{_H} di {100 * len(_sempit) // len(_cr)}% video - isi penuh layar 9:16 tanpa bar/border (Facebook menandai 'Batas tepi video')")
# b) layar monoton: > 3 dtk tanpa perubahan gambar berarti (resep U5: gambar berubah tiap 2-3 dtk)
_jendela = int(3 * fps)
_k = 0
while _k + _jendela < len(d):
    _w = d[_k:_k + _jendela]
    if _w.max() < 1.0 and _w.sum() < 25:
        masalah.append(f"layar monoton > 3 dtk mulai {_k / fps:.1f} dtk (tidak ada zoom/objek baru/panah) - tambah perubahan visual tiap 2-3 dtk")
        _k += _jendela
    else:
        _k += fps // 2
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
        batas = 0.9   # Bos 19 Nov: tanpa intro, semua jeda = napas antar babak
        if j["total"] > batas: masalah.append(f"menunggu tanpa narasi {j['total']:.1f} dtk (narasi detik {j['t']}) - maks {batas} dtk; ganti set/transisi harus jalan sambil narasi")
wk = folder / "audio/waktu_kata.json"
if wk.exists():
    kt = json.loads(wk.read_text(encoding="utf-8")).get("kata", [])
    for a, b in zip(kt, kt[1:]):
        if b["mulai"] - a["selesai"] > 1.2: masalah.append(f"suara AI diam {b['mulai'] - a['selesai']:.1f} dtk setelah kata '{a['kata']}' (narasi detik {a['selesai']:.1f}) - potong/padatkan celahnya")
# --- aturan 28 Nov (RESEP VIRAL): durasi mengikuti format; narasi langsung mulai (tanpa intro)
import json as _j
_st = folder / "status.json"; _nk = folder / "naskah.json"
_s = _j.loads(_st.read_text(encoding="utf-8")) if _st.exists() else {}
_n = _j.loads(_nk.read_text(encoding="utf-8")) if _nk.exists() else {}
_fmt = _n.get("format_resep") or _s.get("format_resep")
_seri = _s.get("seri") or _n.get("seri")
if _fmt == "kamu-yang-bikin": _maks = 120
elif _fmt == "katanya-ternyata": _maks = 75
else: _maks = 90 if _seri in ("cara-kerja", "A") else 60  # video format lama (sebelum 28 Nov)
if (_s.get("format") or _n.get("format")) != "panjang" and D > _maks + 2:
    masalah.append(f"durasi {D:.1f} dtk > {_maks} dtk (format {_fmt or _seri or 'lama'})")
awal = next((i * h / 16000 for i in range(len(db)) if db[i] > -35), None)
if awal is not None and awal > 0.5: masalah.append(f"suara baru terdengar di {awal:.2f} dtk - tanpa intro, narasi harus mulai <= 0,3 dtk")
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
