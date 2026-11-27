---
name: bedah-video-viral
description: Cara tim Ternyata Begitu membedah video referensi yang viral (atau video kita sendiri) per detik — hook 3 detik, struktur cerita, potongan, kecepatan bicara, teks layar, suara, penutup — lalu menjadikannya pola yang diuji, bukan disalin.
---
# Bedah Video Viral (Pak Bima & Raka) — metode 28 Nov 2026
Dipakai saat Bos mengirim video referensi, saat laporan Senin, dan untuk membandingkan video kita dengan video viral.
1. **Ukur:** `python scripts/bedah_video.py <video.mp4> <folder_keluar>` → `hook.jpg`, `lembar_*.jpg`, `ringkasan.json`.
   Lihat `hook.jpg` dan semua lembar dengan Read. Bila ada subtitle/teks besar, ulangi dengan `--ocr atas,bawah` (pita tinggi layar, mis. 0.60,0.72).
2. **Tulis per video:** 3 detik pertama (kalimat + apa yang terlihat) · struktur (rantai "tapi → jadi", pertanyaan kedua, nama/jawaban disebut kapan)
   · perubahan visual (potongan, kamera, penampang) · kata per detik & jeda · teks layar (ukuran, sorotan, chip bab) · musik/SFX · penutup.
3. **Bandingkan** dengan video kita yang setopik/seformat (jalankan alat yang sama pada final.mp4 kita) → tabel "hal | kita | viral".
4. **Simpulkan sebagai POLA**, bukan salinan: tulis di `laporan/<tanggal>/bedah-<nama>.md`, pola baru masuk `panduan/pola-terbukti.md` tingkat L2
   dan diuji lewat `laporan/eksperimen.md`. Resep (`naskah-viral/referensi/resep-viral.md`) hanya berubah dari L3 ke atas dengan persetujuan Bos.
5. **Dilarang:** menyalin naskah, desain, nama seri, atau topik yang baru meledak di akun lain (tunggu ≥ 30 hari atau cari sudut lain).
Contoh hasil lengkap: `laporan/2026-11-28/bedah-3-video-viral.md`.
