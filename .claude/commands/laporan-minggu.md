---
description: Laporan performa mingguan (data Supermetrics YouTube/TikTok/Instagram) + rencana minggu depan
---
Kamu Pak Bima. Data diambil SENDIRI oleh kamu (sesi utama punya konektor Supermetrics), lalu Raka menganalisa.
1. **Ambil data (Supermetrics MCP)** untuk 7 hari terakhir dan 28 hari terakhir. Selalu pakai `data_source_discovery` → `accounts_discovery` → `field_discovery` dulu, jangan menebak ID field.
   - YouTube `YT2`: report `ChannelTotals` (views, watch time, subscribers gained) dan `LatestVideos` (per video: views, rata-rata durasi tonton, % ditonton, likes, komentar, share).
   - TikTok `TIKBA`: `profile` (followers, views profil) dan `videos` (views, rata-rata waktu tonton, % selesai ditonton, likes, komentar, share, save).
   - Instagram `IGI`: reels (plays, reach, rata-rata waktu tonton, saves, shares) — bila akun sudah tersambung.
   - Sumber yang belum tersambung / masa uji coba habis (setelah 29 Nov 2026 Bos tidak berlangganan) → catat "tidak tersedia", jangan mengarang angka, dan pakai tangkapan layar statistik yang dikirim Bos (folder `laporan/<tanggal>/` atau lampiran di sesi). Bila belum ada, minta Bos lewat log Kantor Visual.
   Simpan hasil mentah ringkas ke `laporan/<tanggal>/data.json`.
2. **Delegasikan ke Raka** (skill `seo-distribusi`, bagian Analisa) dengan path data.json. Raka menulis `laporan/<tanggal>/laporan.md` (maks 40 baris):
   - Angka utama + perubahan vs minggu lalu: subscriber, jam tonton 365 hari (jalur ke 8.000), views Shorts 90 hari.
   - **3 konten terbaik & 3 terlemah** per platform beserta alasan yang bisa diuji (pola hook, konsep sampul, durasi, topik/pilar, jam tayang) — cocokkan dengan `panduan/riwayat.md`.
   - **5 langkah minggu depan** yang konkret (mis. "ulangi pola hook X", "kurangi pilar Y", "uji jam tayang 19.00", "topik video panjang = Z").
   - Usulan frasa baru untuk `panduan/bahasa-populer.md` dari komentar terbanyak.
3. Kamu tulis 3 keputusan arah konten di bagian akhir laporan, perbarui `bank-ide.md` & `panduan/riwayat.md`, lalu kirim ringkasan 5 baris ke Kantor Visual HP (log) untuk persetujuan Bos.

## Target Shorts (Bos 19 Nov 2026)
Selalu laporkan per Shorts dan rata-rata minggu: **% tetap menonton** (target 75–85%), **% rata-rata ditonton** (target 90–120%+), share, komentar.
Bandingkan video ≤ 60 dtk tanpa intro (aturan baru) vs video lama. Bila angka tidak tersedia di Supermetrics, minta Bos tangkapan layar YouTube Studio → Analytics → Konten → Shorts.
