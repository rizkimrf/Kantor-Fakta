# Cara memberi kantor akses membaca data YouTube, TikTok, Instagram (28 Nov 2026)
Prinsip: kantor membaca lewat **izin resmi (token API)**, bukan dengan login memakai kata sandi. Token bisa dicabut kapan saja dari pengaturan akun,
tidak bisa dipakai untuk mengganti kata sandi, dan tersimpan hanya di pengaturan environment claude.ai/code (bukan di repo/chat).
Setelah izin diberikan, sesi 18.17 otomatis menjalankan `scripts/statistik_youtube.py` + `scripts/statistik_sosial.py` setiap hari.

## 1. YouTube (±10 menit, di laptop)
1. Google Cloud Console, project yang sama dengan `client_secret.json` → APIs & Services → Library → cari **YouTube Analytics API** → **Enable**
   (YouTube Data API v3 sudah aktif sejak setup).
2. OAuth consent screen: bila status aplikasi masih **Testing**, token bisa berhenti setelah 7 hari → pilih **Publish app** (aplikasi pribadi, tidak perlu verifikasi untuk dipakai sendiri; muncul peringatan "belum diverifikasi" → lanjutkan).
3. Di laptop, folder kantor: `python scripts/login_youtube.py` → login akun channel Ternyata Begitu → centang semua izin → salin isi `youtube_refresh_token.txt`
   ke **YT_REFRESH_TOKEN** (pengaturan environment) → hapus file itu.
Hasil: views, menit ditonton, rata-rata durasi & % ditonton, subscriber per video + subscriber channel harian.

## 2. TikTok (±5 menit)
1. developers.tiktok.com → Manage apps → aplikasi kantor → **Add products → Display API**; pastikan izin **user.info.stats** dan **video.list** aktif (mode Sandbox tetap boleh, akun TEBE sudah jadi target user).
2. Di laptop: `python scripts/login_tiktok.py` → izinkan → salin isi `tiktok_refresh_token.txt` ke **TIKTOK_REFRESH_TOKEN** → hapus file itu.
Hasil: views, likes, komentar, share per video + follower & total likes akun. (Rata-rata durasi tonton TikTok tidak tersedia lewat API.)

## 3. Instagram (±10 menit, sekaligus memperbaiki unggah otomatis IG yang gagal sejak 23 Nov)
developers.facebook.com → aplikasi kantor → Graph API Explorer → pilih Halaman Facebook TEBE → centang izin:
`pages_show_list`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights` → Generate token →
tukar ke token jangka panjang → ambil **token Halaman** (cara yang sama seperti 16 Nov) → tempel ke **IG_ACCESS_TOKEN**.
Hasil: views, jangkauan, simpan, share, interaksi, rata-rata durasi tonton Reels per video + follower akun. Token Halaman berlaku sampai ±14 Feb 2027 (perlu diperbarui sebelum itu).

## Yang TIDAK bisa dibaca lewat API mana pun
- **"Ditonton vs digeser"** (YouTube Studio) → tangkapan layar Bos untuk video baru, atau Ken membacanya lewat browser di laptop Bos (Claude in Chrome) saat laptop menyala.
- Retensi per detik TikTok/Instagram → tangkapan layar bila perlu.

## Alternatif berbayar (tanpa urus token, satu konektor untuk 3 platform)
Konektor claude.ai: **Windsor.ai for Social Media**, **Metricool**, atau **Supermetrics** (uji coba berakhir 29 Nov). Cek harga di situs masing-masing.
Saran Ken: pakai jalur gratis di atas dulu; konektor berbayar hanya bila token terus merepotkan.
