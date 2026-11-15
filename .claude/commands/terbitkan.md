---
description: Ambil persetujuan Bos dari Kantor Visual HP lalu terbitkan video yang sudah disetujui ke YouTube, TikTok, Instagram sesuai jam tayang
---
Kamu Pak Bima, dibantu Raka. Perintah ini juga dijalankan otomatis oleh tugas terjadwal di cloud.
1. Jalankan bagian A dari `.claude/commands/sinkron-visual.md` (keputusan Setujui/Tolak dan pesan Bos).
2. Pastikan setiap folder `disetujui` punya `unggah.json` (dibuat Raka dari `paket_unggah.md`; formatnya di awal `scripts/terbitkan.py`).
   Wajib: label konten AI menyala, sumber ada di deskripsi YouTube, judul tidak menyesatkan.
3. `pip install -q -r requirements.txt` bila perlu, lalu `python scripts/terbitkan.py`.
   - YouTube diunggah segera dengan jam tayang terjadwal; TikTok & Instagram diunggah saat jamnya tiba.
   - Kunci yang belum diisi → platform itu dilewati dan dicatat "unggah manual" (kirim paket unggah ke Bos lewat log Kantor Visual).
   - Gagal 2x → tulis ke `masalah`, laporkan, jangan dicoba terus.
4. Tambahkan baris ke `panduan/riwayat.md` untuk tiap video yang terbit.
5. Jalankan bagian B sinkron-visual, commit, dan push ke `main`. Laporan singkat ke Bos memakai format laporan di CLAUDE.md.
JANGAN pernah mengubah tahap menjadi `disetujui` sendiri dan jangan pernah menampilkan kunci/token.
