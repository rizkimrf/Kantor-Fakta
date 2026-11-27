---
name: gerbang-mutu
description: Cara Pak Bima mengecek fakta naskah dan meninjau video akhir Ternyata Begitu (kemulusan, zona aman, sampul, potensi viral) sebelum dikirim ke Bos.
---
# Gerbang Mutu (Pak Bima) — "Benar dulu, baru menarik."
## Cek fakta (cek_fakta.md, maks 15 baris)
Setiap kalimat didukung riset.md · judul tidak menyesatkan · tidak ada nasihat berbahaya · **STANDAR 80** (`.claude/skills/naskah-viral/referensi/standar-80.md`): `python scripts/cek_standar.py antrean/<folder>` LULUS + L1–L5 & N1–N7 ditulis satu per satu "ya/tidak + bukti" + uji banding Raka (R1) ada di cek_seo.md. **Tidak ada skor 1–10** (Bos 28 Nov: skor lama selalu 8, tidak membedakan).

## Review video (review.md, maks 12 baris)
1. `python scripts/cek_video.py antrean/<folder>` dan `python scripts/cek_mulus.py antrean/<folder>` → keduanya LULUS.
2. Lihat `_kerja/cek_transisi.jpg`, `_kerja/cek_zona_aman.jpg`, `thumbnail.png`.
3. **STANDAR 80 visual Y1–Y4** (lihat frame 0, 1 dtk, 2 dtk dan frame terakhir; tulis bukti) — semua "ya". Lalu daftar periksa — semua "ya":
   1. Sampul = momen dramatis yang membuat penasaran (= Y1: benda ≥ 50% layar, pertanyaan ≤ 5 kata), konsep & posisi Tebe beda dari 2 video terakhir.
   2. 3 dtk pertama menghentikan scroll: hook dari 26 tipe (`naskah-viral/referensi/hook-26.md`), kalimat pertama ≤ 7 kata = pertanyaan sampul (N1), visual bergerak sejak frame 0, tipe beda dari 5 video terakhir.
   3. Tidak ada suara terpotong, tidak ada kedip/potongan kasar, musik tidak "memompa".
   4. Teks layar & wajah Tebe di zona aman; teks 2–4 kata, terbaca di HP.
   5. Set berbeda tiap babak, kamera bergerak, Tebe beraksi (bukan berdiri diam).
   6. Celah penasaran tiap ±10 dtk; janji hook dibayar.
   7. TANPA intro; narasi mulai ≤ 0,3 dtk; durasi 30–45 dtk (jalur A maks 50); outro ≤ 1,5 dtk menyambung ke awal (loop); watermark berpindah di zona aman; ada pertanyaan terbuka + pemicu share di akhir.
   8. Fakta di layar = riset; sumber di deskripsi.
   9. unggah.json lengkap 3 platform, label AI.
   10. Semua paraf ada di lembar_tim.md.
   11. Format gabungan: visual memperagakan kata, Tebe hanya cameo, subtitle gaya kita tidak menutupi objek yang diperagakan (posisi/ukuran adaptif), ajakan komentar 1 kata berkubu, loop; `seri` terisi.
Satu "tidak" → kembalikan ke orang yang bertanggung jawab dengan catatan spesifik (detik + masalah + perbaikan).
