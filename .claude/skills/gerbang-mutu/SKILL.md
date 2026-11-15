---
name: gerbang-mutu
description: Cara Pak Bima mengecek fakta naskah dan meninjau video akhir Ternyata Begitu (kemulusan, zona aman, sampul, potensi viral) sebelum dikirim ke Bos.
---
# Gerbang Mutu (Pak Bima) — "Benar dulu, baru menarik."
## Cek fakta (cek_fakta.md, maks 15 baris)
Setiap kalimat didukung riset.md · judul tidak menyesatkan · tidak ada nasihat berbahaya · skor naskah ≥8/9 (`panduan/playbook-naskah.md` bila ragu) · **skor potensi viral ≥8/10** dinilai ulang sendiri, bukan disalin dari Nadia.

## Review video (review.md, maks 12 baris)
1. `python scripts/cek_video.py antrean/<folder>` dan `python scripts/cek_mulus.py antrean/<folder>` → keduanya LULUS.
2. Lihat `_kerja/cek_transisi.jpg`, `_kerja/cek_zona_aman.jpg`, `thumbnail.png`.
3. Daftar periksa 10 butir — semua "ya":
   1. Sampul = momen dramatis yang membuat penasaran (skor uji 3 detik ≥ 8), konsep & posisi Tebe beda dari 2 video terakhir.
   2. 3 dtk pertama menghentikan scroll: kalimat hook ≤ 12 kata dengan kata kunci, visual bergerak & aneh, skor hook ≥ 8.
   3. Tidak ada suara terpotong, tidak ada kedip/potongan kasar, musik tidak "memompa".
   4. Teks layar & wajah Tebe di zona aman; teks 2–4 kata, terbaca di HP.
   5. Set berbeda tiap babak, kamera bergerak, Tebe beraksi (bukan berdiri diam).
   6. Celah penasaran tiap ±10 dtk; janji hook dibayar.
   7. Intro 2,4 dtk, watermark berpindah (di zona aman), outro khas.
   8. Fakta di layar = riset; sumber di deskripsi.
   9. unggah.json lengkap 3 platform, label AI.
   10. Semua paraf ada di lembar_tim.md.
Satu "tidak" → kembalikan ke orang yang bertanggung jawab dengan catatan spesifik (detik + masalah + perbaikan).
