# KANTOR "TERNYATA BEGITU" — Pemasangan di Windows 11 (sekali saja)

Buka **Terminal** (klik kanan Start → Terminal), lalu jalankan satu per satu:

1. `winget install Git.Git`
2. `winget install Python.Python.3.12`
3. `winget install Gyan.FFmpeg`
4. Tutup Terminal, buka lagi, lalu cek: `git --version`, `python --version`, `ffmpeg -version`
5. Pasang **Claude Code** sesuai petunjuk resmi: https://docs.claude.com (bagian Claude Code → instalasi Windows),
   lalu login dengan akun Claude Anda.
6. Ekstrak folder `kantor-fakta` ke mis. `C:\kantor-fakta`, lalu di Terminal:
   ```
   cd C:\kantor-fakta
   python -m pip install -r requirements.txt
   copy .env.example .env
   notepad .env
   ```
   Isi kunci API di `.env` (lihat bagian Akun di bawah). Simpan.
7. Taruh 3-5 lagu latar bebas royalti (mis. dari YouTube Audio Library) di `aset\musik\`.
8. Jalankan kantor: `claude` (di dalam folder `C:\kantor-fakta`).

# Sekali di awal
- `/buat-karakter` — buat lembar karakter maskot **Tebe**, lalu Anda setujui (semua gambar memakai ini sebagai acuan)
- `/isi-bank-ide 20` — tim riset mengisi 20 ide, marketing mengurutkan

# Rutinitas harian (cukup 2 perintah + menonton)
1. `/kerjakan-antrean` — tim melanjutkan semua pekerjaan & menyiapkan video baru bila stok < 3 hari
2. Tonton video di `antrean\...\final.mp4` yang statusnya menunggu persetujuan
3. `/setujui semua` (atau nama folder tertentu) — upload dengan jadwal tayang otomatis

# Perintah lain
- `/video-baru 2` atau `/video-baru 1 panjang` — siapkan naskah video baru (belum memakai kredit suara/gambar)
- `/produksi` — produksi video yang naskahnya sudah lolos cek fakta
- `/status` — papan status kantor
- `/laporan-minggu` — analisa performa + rencana minggu depan (tiap Senin)

# Akun & kunci API
- **ElevenLabs** → API key + pilih satu Voice ID (suara tetap channel).
- **Google AI Studio** → API key + aktifkan billing; isi nama model gambar/video yang tersedia di akun Anda.
- **Google Cloud Console** → project baru → aktifkan *YouTube Data API v3* → OAuth consent screen →
  buat OAuth client *Desktop app* → unduh JSON → simpan sebagai `client_secret.json` di folder utama.
  Ajukan **audit API** dari awal: sebelum lolos audit, video yang di-upload lewat API terkunci private.
- Pasang **batas anggaran/notifikasi biaya** di Google Cloud dan ElevenLabs.

Jangan kirim isi `.env`, `client_secret.json`, atau `token.json` ke siapa pun, termasuk ke chat.

# Kantor Visual (menonton + memberi perintah, tanpa PowerShell)
Klik dua kali `Buka-Kantor.bat`. Di panel kiri "Ruang Kendali Bos": tombol perintah, kotak pesan ke Pak Bima,
dan "Tinjau video" untuk Setujui / Tolak. PowerShell hanya dibutuhkan sekali untuk login Claude Code pertama kali.

# (cara lama) Kantor Visual lewat PowerShell
Buka PowerShell KEDUA (biarkan yang pertama menjalankan Claude Code):
```
cd C:\kantor-fakta
python scripts\kantor_visual.py
```
Browser terbuka di http://localhost:8765 dan diperbarui otomatis tiap 3 detik. Tutup dengan Ctrl+C.
