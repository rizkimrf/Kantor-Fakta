"""Kantor Visual "Ternyata Begitu": lihat tim bekerja DAN beri perintah langsung dari browser.

Pemakaian: klik dua kali Buka-Kantor.bat  (atau: python scripts/kantor_visual.py)
Browser terbuka di http://localhost:8765. Tutup jendela "Kantor Visual" untuk berhenti.

- Menonton tim: hanya membaca folder antrean/ (gratis).
- Tombol perintah & kotak pesan: menjalankan Claude Code di latar belakang (`claude -p`),
  sama seperti mengetik di PowerShell. Hanya satu perintah berjalan pada satu waktu.
- Persetujuan video: Setujui / Tolak + pilihan perbaikan langsung mengubah status.json.
Server hanya bisa diakses dari laptop ini (127.0.0.1) dan memakai token per-sesi.
"""
import datetime
import json
import mimetypes
import secrets
import shutil
import subprocess
import sys
import threading
import time
import uuid
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
ANTREAN = ROOT / "antrean"
PORT = 8765
AKTIF_DETIK = 180
TOKEN = secrets.token_hex(16)
SESI_FILE = ROOT / ".kantor_sesi.json"

AGEN_TAHAP = {"ide": "riset", "pilih": "marketing", "naskah": "copywriting", "cek_fakta": "manajer",
              "produksi": "editor", "review": "manajer", "disetujui": "marketing", "tayang": "marketing"}
LABEL_TAHAP = {"ide": "Riset fakta", "pilih": "Menilai potensi views", "naskah": "Menulis naskah",
               "cek_fakta": "Cek fakta", "produksi": "Produksi video", "review": "Review akhir",
               "menunggu_persetujuan": "Menunggu persetujuan Anda", "disetujui": "Upload & jadwal",
               "terjadwal": "Terjadwal tayang", "tayang": "Sudah tayang", "ditunda": "Ditunda"}
FILE_LOG = [("riset.md", "riset", "menyelesaikan riset & sumber"),
            ("rencana_marketing.md", "marketing", "menilai ide & menyiapkan sudut judul"),
            ("naskah.json", "copywriting", "menulis naskah, judul & caption"),
            ("cek_fakta.md", "manajer", "mengecek fakta naskah"),
            ("final.mp4", "editor", "merakit video final"),
            ("thumbnail.png", "editor", "membuat thumbnail"),
            ("review.md", "manajer", "mereview video")]
# Tombol perintah -> file di .claude/commands (isinya dikirim ke Claude Code sebagai tugas)
PERINTAH = {"kerjakan-antrean", "video-baru", "produksi", "isi-bank-ide", "laporan-minggu", "buat-karakter", "status"}
# Pilihan "Tolak": tahap tujuan + file yang dihapus supaya dibuat ulang
TOLAK = {
    "naskah": ("naskah", ["audio", "visual", "final.mp4", "thumbnail.png", "review.md", "cek_fakta.md"], "Perbaiki naskah / hook"),
    "visual": ("produksi", ["visual", "final.mp4", "thumbnail.png", "review.md"], "Ganti gambar / visual"),
    "suara": ("produksi", ["audio", "final.mp4", "review.md"], "Perbaiki suara narasi"),
    "rakit": ("produksi", ["final.mp4", "thumbnail.png", "review.md"], "Rakit ulang (subtitle, musik, tempo)"),
    "thumbnail": ("produksi", ["thumbnail.png", "visual/thumbnail_dasar.png", "review.md"], "Ganti thumbnail saja"),
    "tunda": ("ditunda", [], "Tunda / buang topik ini"),
}


def baca_json(p):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return {}


def folder_aman(nama):
    p = (ANTREAN / nama).resolve()
    if p.parent != ANTREAN.resolve() or not (p / "status.json").exists():
        raise ValueError("folder tidak dikenal")
    return p


def ubah_status(folder, tahap, **lain):
    p = folder / "status.json"
    s = baca_json(p)
    s.setdefault("riwayat", []).append({"dari": s.get("tahap"), "ke": tahap, "oleh": "Bos (kantor visual)",
                                        "waktu": datetime.datetime.now().isoformat(timespec="minutes")})
    s["tahap"] = tahap
    s.update(lain)
    p.write_text(json.dumps(s, indent=2, ensure_ascii=False), encoding="utf-8")


def kumpulkan():
    sekarang = time.time()
    videos, log = [], []
    if ANTREAN.exists():
        for d in sorted(ANTREAN.iterdir()):
            if not d.is_dir() or not (d / "status.json").exists():
                continue
            st = baca_json(d / "status.json")
            nk = baca_json(d / "naskah.json")
            semua = [p for p in d.rglob("*") if p.is_file()]
            terakhir = max((p.stat().st_mtime for p in semua), default=0)
            tahap = st.get("tahap", "?")
            judul = nk.get("judul") or st.get("topik") or d.name.split("_", 1)[-1].replace("-", " ")
            audio = len(list((d / "audio").glob("*.mp3"))) if (d / "audio").exists() else 0
            visual = len([p for p in (d / "visual").glob("*") if p.suffix in (".png", ".jpg", ".mp4")]) \
                if (d / "visual").exists() else 0
            v = {"folder": d.name, "judul": judul, "tahap": tahap,
                 "label": LABEL_TAHAP.get(tahap, tahap), "agen": AGEN_TAHAP.get(tahap),
                 "aktif": (sekarang - terakhir) < AKTIF_DETIK and tahap in AGEN_TAHAP,
                 "masalah": st.get("masalah"), "jadwal": st.get("jadwal_tayang"), "catatan_bos": st.get("catatan_bos"),
                 "format": nk.get("format", "shorts"), "terakhir": terakhir,
                 "adegan": len(nk.get("adegan", [])), "audio": audio, "visual": visual,
                 "ada_video": (d / "final.mp4").exists(), "ada_thumb": (d / "thumbnail.png").exists()}
            if tahap in ("menunggu_persetujuan", "produksi", "naskah", "cek_fakta", "review"):
                v["naskah"] = [a.get("narasi", "") for a in nk.get("adegan", [])]
                v["deskripsi"] = nk.get("deskripsi", "")
                v["caption_komentar"] = nk.get("caption_komentar", "")
            videos.append(v)
            for nama, agen, teks in FILE_LOG:
                f = d / nama
                if f.exists():
                    log.append({"t": f.stat().st_mtime, "agen": agen, "teks": f"{teks}: {judul}"})
            for r in st.get("riwayat", []):
                try:
                    t = time.mktime(time.strptime(r["waktu"][:16], "%Y-%m-%dT%H:%M"))
                    siapa = "bos" if "Bos" in str(r.get("oleh", "")) else "manajer"
                    log.append({"t": t, "agen": siapa, "teks": f"memindahkan '{judul}' ke tahap {LABEL_TAHAP.get(r['ke'], r['ke'])}"})
                except Exception:
                    pass
    ide = 0
    bank = ROOT / "panduan" / "bank-ide.md"
    if bank.exists():
        ide = sum(1 for b in bank.read_text(encoding="utf-8").splitlines()
                  if b.count("|") >= 3 and not b.lstrip().startswith(("(", "#", "|---", "| Pilar")))
    log.sort(key=lambda x: -x["t"])
    return {"sekarang": sekarang, "videos": videos, "log": log[:25], "bank_ide": ide, "job": JOB.ringkas()}


# ======================= MENJALANKAN CLAUDE CODE DARI KANTOR =======================
class Job:
    def __init__(self):
        self.kunci = threading.Lock()
        self.proses = None
        self.reset()

    def reset(self):
        self.judul, self.status, self.baris, self.hasil, self.mulai, self.selesai, self.biaya = "", "idle", [], "", 0, 0, None
        self.agen_aktif, self.aksi = {}, ""   # tugas yang sedang dikerjakan tiap agent (dari aliran kerja langsung)

    def ringkas(self):
        return {"judul": self.judul, "status": self.status, "baris": self.baris[-60:], "hasil": self.hasil,
                "mulai": self.mulai, "selesai": self.selesai, "biaya": self.biaya, "aksi": self.aksi,
                "agen_aktif": [{"agen": a["agen"], "tugas": a["tugas"]} for a in self.agen_aktif.values()] if self.status == "jalan" else []}

    def sibuk(self):
        return self.status == "jalan"

    def tambah(self, teks):
        self.baris.append({"t": time.time(), "teks": teks[:600]})

    def jalankan(self, judul, prompt):
        with self.kunci:
            if self.sibuk():
                raise RuntimeError("Pak Bima masih mengerjakan perintah sebelumnya.")
            if not shutil.which("claude"):
                raise RuntimeError("Claude Code (perintah 'claude') tidak ditemukan di PATH laptop ini.")
            self.reset()
            self.judul, self.status, self.mulai = judul, "jalan", time.time()
        threading.Thread(target=self._kerja, args=(prompt,), daemon=True).start()

    def _sesi(self):
        """Satu percakapan per hari, supaya Pak Bima ingat perintah-perintah sebelumnya hari ini."""
        hari = datetime.date.today().isoformat()
        s = baca_json(SESI_FILE)
        if s.get("tanggal") == hari and s.get("id"):
            return ["--resume", s["id"]]
        sid = str(uuid.uuid4())
        SESI_FILE.write_text(json.dumps({"tanggal": hari, "id": sid}), encoding="utf-8")
        return ["--session-id", sid]

    def _kerja(self, prompt):
        cmd = ["claude", "-p", prompt, *self._sesi(), "--permission-mode", "auto", "--permission-prompts", "none",
               "--output-format", "stream-json", "--verbose"]
        self.tambah("📨 Perintah diterima Pak Bima.")
        try:
            self.proses = subprocess.Popen(cmd, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                           text=True, encoding="utf-8", errors="replace",
                                           creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
            for baris in self.proses.stdout:
                self._olah(baris.strip())
            self.proses.wait()
            if self.status == "jalan":
                self.status = "selesai" if self.proses.returncode == 0 else "gagal"
                if self.status == "gagal" and not self.hasil:
                    self.hasil = "Perintah berhenti dengan error. Lihat catatan di atas."
        except Exception as e:
            self.status, self.hasil = "gagal", f"Tidak bisa menjalankan Claude Code: {e}"
        self.selesai = time.time()

    def _olah(self, baris):
        if not baris:
            return
        try:
            d = json.loads(baris)
        except ValueError:
            self.tambah(baris)
            return
        tipe = d.get("type")
        if tipe == "assistant":
            for b in d.get("message", {}).get("content", []):
                if b.get("type") == "text" and b.get("text", "").strip():
                    self.tambah("💬 " + b["text"].strip())
                elif b.get("type") == "tool_use":
                    inp, nama = b.get("input", {}), b.get("name", "")
                    if d.get("parent_tool_use_id"):
                        continue
                    if nama in ("Task", "Agent"):
                        jenis = inp.get("subagent_type", "")
                        siapa = {"riset": "Laras", "copywriting": "Nadia", "marketing": "Raka", "editor": "Yoga"}.get(jenis, jenis or "tim")
                        tugas = inp.get("description", "") or "mengerjakan tugas"
                        if jenis in ("riset", "copywriting", "marketing", "editor"):
                            self.agen_aktif[b.get("id", tugas)] = {"agen": jenis, "tugas": tugas}
                        self.aksi = f"membagi tugas ke {siapa}"
                        self.tambah(f"👥 Pak Bima menugaskan {siapa}: {tugas}")
                    elif nama in ("Bash", "PowerShell"):
                        self.aksi = "menjalankan skrip"
                        self.tambah("⚙️ Menjalankan: " + str(inp.get("command", ""))[:160])
                    elif nama in ("WebSearch", "WebFetch"):
                        self.aksi = "mengecek sumber"
                        self.tambah("🔎 Mencari: " + str(inp.get("query", inp.get("url", ""))))
                    elif nama in ("Write", "Edit"):
                        self.aksi = "menulis " + Path(str(inp.get("file_path", ""))).name
                        self.tambah("✍️ Menulis: " + Path(str(inp.get("file_path", ""))).name)
                    elif nama in ("Read", "Glob", "Grep"):
                        self.aksi = "membaca berkas"
        elif tipe == "user" and not d.get("parent_tool_use_id"):
            for b in d.get("message", {}).get("content", []) if isinstance(d.get("message", {}).get("content"), list) else []:
                if b.get("type") == "tool_result" and b.get("tool_use_id") in self.agen_aktif:
                    a = self.agen_aktif.pop(b["tool_use_id"])
                    nama = {"riset": "Laras", "copywriting": "Nadia", "marketing": "Raka", "editor": "Yoga"}[a["agen"]]
                    self.tambah(f"✅ {nama} selesai: {a['tugas']}")
                    self.aksi = "memeriksa hasil " + nama
        elif tipe == "result":
            self.hasil = d.get("result", "") or self.hasil
            self.biaya = d.get("total_cost_usd")
            if d.get("is_error"):
                self.status = "gagal"

    def hentikan(self):
        if self.proses and self.proses.poll() is None:
            self.proses.terminate()
            self.status, self.hasil = "dihentikan", "Perintah dihentikan oleh Bos. Pekerjaan yang sudah selesai tetap tersimpan."
            self.selesai = time.time()


JOB = Job()


def prompt_perintah(nama, argumen=""):
    f = ROOT / ".claude" / "commands" / f"{nama}.md"
    teks = f.read_text(encoding="utf-8")
    if teks.startswith("---"):
        teks = teks.split("---", 2)[2]
    teks = teks.replace("$ARGUMENTS", argumen or "")
    return (f"[Perintah dari Bos lewat tombol kantor visual: /{nama} {argumen}]\n\n{teks.strip()}\n\n"
            "Akhiri dengan laporan singkat untuk Bos dalam Bahasa Indonesia sesuai format di CLAUDE.md.")


def setujui(folder):
    ubah_status(folder, "disetujui", masalah=None)
    if (ROOT / "client_secret.json").exists() and (ROOT / ".env").exists():
        JOB.jalankan("Upload video yang disetujui",
                     f"Bos menyetujui video di folder antrean/{folder.name}. Delegasikan ke agent marketing (Raka) untuk upload "
                     "terjadwal sesuai .claude/agents/marketing.md (tahap disetujui). Laporkan jadwal tayangnya.")
        return "Disetujui. Raka sedang meng-upload dan menjadwalkan tayang."
    return "Disetujui. Upload otomatis aktif setelah kunci YouTube (client_secret.json) dipasang."


def tolak(folder, pilihan, catatan, langsung):
    tahap, hapus, label = TOLAK[pilihan]
    for nama in hapus:
        p = folder / nama
        if p.is_dir():
            for f in p.iterdir():
                if f.is_file():
                    f.unlink()
        elif p.exists():
            p.unlink()
    catatan_lengkap = f"{label}. {catatan}".strip()
    lain = {"catatan_bos": catatan_lengkap, "masalah": None}
    if tahap == "naskah":
        lain["catatan_manajer"] = "Dari Bos: " + catatan_lengkap
    ubah_status(folder, tahap, **lain)
    if langsung and tahap != "ditunda":
        JOB.jalankan(f"Perbaikan: {label}", prompt_perintah("kerjakan-antrean") +
                     f"\n\nPRIORITAS: video antrean/{folder.name} dikembalikan Bos dengan catatan: \"{catatan_lengkap}\". "
                     "Kerjakan perbaikan itu lebih dulu, lalu lanjutkan antrean lain.")
        return "Dikembalikan ke tim. Pak Bima langsung mengerjakan perbaikannya."
    return "Dikembalikan ke tim dengan catatan Bos." if tahap != "ditunda" else "Video ditunda."


# ======================= SERVER =======================
class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def kirim(self, kode, data, tipe="application/json"):
        if isinstance(data, (dict, list)):
            data = json.dumps(data).encode()
        self.send_response(kode)
        self.send_header("Content-Type", tipe)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path.startswith("/api"):
            return self.kirim(200, kumpulkan())
        if self.path.startswith("/media/"):
            return self.media()
        html = (ROOT / "scripts" / "kantor_visual.html").read_text(encoding="utf-8").replace("__TOKEN__", TOKEN)
        self.kirim(200, html.encode("utf-8"), "text/html; charset=utf-8")

    def media(self):
        try:
            _, _, nama, berkas = unquote(self.path.split("?")[0]).split("/", 3)
            if berkas not in ("final.mp4", "thumbnail.png"):
                raise ValueError
            p = folder_aman(nama) / berkas
            if not p.exists():
                raise ValueError
        except Exception:
            return self.kirim(404, {"error": "tidak ada"})
        ukuran, rentang = p.stat().st_size, self.headers.get("Range")
        awal, akhir = 0, ukuran - 1
        if rentang and rentang.startswith("bytes="):
            a, _, b = rentang[6:].partition("-")
            awal = int(a) if a else 0
            akhir = min(int(b), ukuran - 1) if b else ukuran - 1
        with open(p, "rb") as f:
            f.seek(awal)
            data = f.read(akhir - awal + 1)
        self.send_response(206 if rentang else 200)
        self.send_header("Content-Type", mimetypes.guess_type(p.name)[0] or "application/octet-stream")
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(len(data)))
        if rentang:
            self.send_header("Content-Range", f"bytes {awal}-{akhir}/{ukuran}")
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.headers.get("X-Kantor-Token") != TOKEN:     # tolak permintaan dari situs lain
            return self.kirim(403, {"error": "token salah"})
        try:
            isi = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
            if self.path == "/aksi/perintah":
                nama, arg = isi.get("nama", ""), str(isi.get("argumen", ""))[:80]
                if nama not in PERINTAH:
                    raise ValueError("perintah tidak dikenal")
                JOB.jalankan(f"/{nama} {arg}".strip(), prompt_perintah(nama, arg))
                pesan = "Perintah dikirim ke Pak Bima."
            elif self.path == "/aksi/pesan":
                teks = str(isi.get("teks", "")).strip()[:2000]
                if not teks:
                    raise ValueError("pesan kosong")
                JOB.jalankan("Pesan Bos: " + teks[:60], f"[Pesan dari Bos lewat kantor visual]\n\n{teks}\n\n"
                             "Jawab/laporkan singkat dalam Bahasa Indonesia sesuai CLAUDE.md.")
                pesan = "Pesan terkirim ke Pak Bima."
            elif self.path == "/aksi/setujui":
                pesan = setujui(folder_aman(isi.get("folder", "")))
            elif self.path == "/aksi/tolak":
                if isi.get("pilihan") not in TOLAK:
                    raise ValueError("pilihan tidak dikenal")
                pesan = tolak(folder_aman(isi.get("folder", "")), isi["pilihan"], str(isi.get("catatan", ""))[:1000],
                              bool(isi.get("langsung")))
            elif self.path == "/aksi/hentikan":
                JOB.hentikan()
                pesan = "Perintah dihentikan."
            else:
                return self.kirim(404, {"error": "tidak ada"})
            self.kirim(200, {"ok": True, "pesan": pesan})
        except Exception as e:
            self.kirim(400, {"ok": False, "pesan": str(e)})


if __name__ == "__main__":
    try:
        server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    except OSError:
        print(f"Kantor Visual sudah berjalan. Buka http://localhost:{PORT}")
        raise SystemExit
    print(f"Kantor Visual berjalan di http://localhost:{PORT}  (tutup jendela ini untuk berhenti)")
    if "--tanpa-browser" not in sys.argv:
        threading.Timer(1.0, lambda: webbrowser.open(f"http://localhost:{PORT}")).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Kantor Visual ditutup.")
