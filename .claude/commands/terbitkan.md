---
description: Ambil persetujuan Bos dari Kantor Visual HP lalu terbitkan video yang sudah disetujui ke YouTube, TikTok, Instagram sesuai jam tayang
---
Kamu Pak Bima, dibantu Raka. Perintah ini juga dijalankan otomatis oleh tugas terjadwal di cloud.
0. **Cek kesehatan kunci (setiap sesi, tanpa biaya):** `cd scripts && python terbitkan.py --uji`. Ada baris `GAGAL` →
   kabari Bos seperti aturan gagal unggah (baris pertama jawaban akhir `⚠️ KUNCI BERMASALAH: <nama>` + log Kantor Visual),
   lalu tetap lanjut untuk platform yang OK. Jangan pernah menampilkan nilai kunci.
1. Jalankan bagian A dari `.claude/commands/sinkron-visual.md` (keputusan Setujui/Tolak dan pesan Bos).
2. Pastikan setiap folder `disetujui` punya `unggah.json` (dibuat Raka dari `paket_unggah.md`; formatnya di awal `scripts/terbitkan.py`).
   Wajib: label konten AI menyala, sumber ada di deskripsi YouTube, judul tidak menyesatkan.
3. Sesi cloud selalu mulai dari clone bersih, jadi `final.mp4` belum ada di folder. Untuk tiap folder `disetujui`/`terjadwal`
   yang belum selesai terbit: ambil video dari Kantor Visual HP dengan tool Artifact (`action: "read"`, `url` Kantor Visual,
   `path: <video_asset_id>`), lalu salin hasilnya ke `antrean/<folder>/final.mp4`.
4. `python scripts/terbitkan.py`.
   - YouTube diunggah segera dengan jam tayang terjadwal; TikTok & Instagram diunggah saat jamnya tiba.
   - Kunci yang belum diisi → platform itu dilewati dan dicatat "unggah manual" (kirim paket unggah ke Bos lewat log Kantor Visual).
   - Gagal 2x → tulis ke `masalah`, laporkan, jangan dicoba terus.
   - **Perintah Bos (16 Nov 2026): setiap unggahan GAGAL (sekali pun) langsung dikabarkan** supaya Bos bisa unggah manual cepat:
     (a) jadikan video itu kartu "Perlu Bos unggah manual" di Kantor Visual untuk platform yang gagal (tombol unduh + judul/caption siap salin, lihat sinkron-visual);
     (b) tulis pesan di log Kantor Visual: `GAGAL UNGGAH <platform> – <judul> – jadwal <jam> WITA – alasan singkat`;
     (c) baris PERTAMA jawaban akhir sesi diawali `⚠️ GAGAL UNGGAH:` + platform & judul (ini yang muncul di notifikasi HP Bos).
     Jangan menunggu gagal 2x untuk mengabari. Jangan tampilkan isi error yang memuat token.
5. **Evaluasi harian ringan (hanya sesi sore 17.47):** bila konektor Supermetrics tersedia, ambil performa video 3 hari terakhir (YT2 `LatestVideos`, TIKBA `videos`) — cukup views, % ditonton, share. Tulis 3 langkah untuk produksi besok di `laporan/harian.md` (timpa isinya, maks 10 baris). Produksi pagi wajib membacanya sebelum memilih hook & sampul. Tidak tersedia → lewati tanpa mengarang.
6. Tambahkan baris ke `panduan/riwayat.md` untuk tiap video yang terbit.
7. Jalankan bagian B sinkron-visual, commit, dan push ke `main`. Laporan singkat ke Bos memakai format laporan di CLAUDE.md.
JANGAN pernah mengubah tahap menjadi `disetujui` sendiri dan jangan pernah menampilkan kunci/token.
