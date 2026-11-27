---
name: gerbang-mutu
description: Cara Pak Bima mengecek fakta naskah dan meninjau video akhir Ternyata Begitu (kemulusan, zona aman, sampul, potensi viral) sebelum dikirim ke Bos.
---
# Gerbang Mutu (Pak Bima) — "Benar dulu, baru menarik."
## Cek fakta (cek_fakta.md, maks 15 baris)
Setiap kalimat didukung riset.md · judul tidak menyesatkan · tidak ada nasihat berbahaya · **RESEP VIRAL** (`.claude/skills/naskah-viral/referensi/resep-viral.md`): `python scripts/cek_standar.py antrean/<folder>` LULUS + T1–T3, U2–U4, U6, U8, U10–U11 dan butir format (A1–A4 / B1–B6) ditulis satu per satu "ya/tidak + bukti" + uji banding Raka (R1) ada di cek_seo.md. **Tidak ada skor 1–10.**

## Review video (review.md, maks 12 baris)
1. `python scripts/cek_video.py antrean/<folder>` dan `python scripts/cek_mulus.py antrean/<folder>` → keduanya LULUS.
2. Lihat `_kerja/cek_transisi.jpg`, `_kerja/cek_zona_aman.jpg`, `thumbnail.png`.
3. **Resep viral visual U1, U5, U7, U9, U12** (lihat frame 0, 1 dtk, 2 dtk, setiap "tapi", dan penutup; tulis bukti) — semua "ya". Lalu daftar periksa — semua "ya":
   1. Sampul = momen dramatis yang membuat penasaran (thumbnail.png: benda besar + pertanyaan ≤ 4 kata), konsep & posisi Tebe beda dari 2 video terakhir.
   2. 3 dtk pertama menghentikan scroll: hook dari 26 tipe (`naskah-viral/referensi/hook-26.md`), kalimat pertama ≤ 12 kata selesai ≤ 3,5 dtk (U2), frame 0 sudah beraksi (U1), tipe beda dari 5 video terakhir.
   3. Tidak ada suara terpotong, tidak ada kedip/potongan kasar, musik tidak "memompa".
   4. Teks layar & wajah Tebe di zona aman; teks 2–4 kata, terbaca di HP.
   5. Set berbeda tiap babak, kamera bergerak, Tebe beraksi (bukan berdiri diam).
   6. Celah penasaran tiap ±10 dtk; janji hook dibayar.
   7. TANPA intro; narasi mulai ≤ 0,3 dtk; durasi sesuai format (A 70–120 dtk, B 45–75 dtk); penutup 1 kalimat tanya/janji seri + logo ≤ 1,5 dtk; watermark berpindah di zona aman; ada pertanyaan terbuka + pemicu share di akhir.
   8. Fakta di layar = riset; sumber di deskripsi.
   9. unggah.json lengkap 3 platform, label AI.
   10. Semua paraf ada di lembar_tim.md.
   11. Resep viral: satu cerita (tanpa fakta sampingan), celah baru ≤ 18 dtk, Tebe = pelaku, subtitle kecil + chip bab tidak menutupi peragaan, tanpa perintah komen/like/kirim; `format_resep` terisi.
Satu "tidak" → kembalikan ke orang yang bertanggung jawab dengan catatan spesifik (detik + masalah + perbaikan).

## Auditor independen + kegagalan kritis (audit blueprint 28 Nov)
- Setelah review.md LULUS, panggil agent **qc** (Dimas, auditor independen yang tidak ikut membuat video) untuk folder itu.
  Hanya `KEPUTUSAN: PASS` di `qc.md` yang boleh dikirim ke Bos. REVISI → kembalikan ke pemiliknya; 3x REVISI → eskalasi ke Bos.
- **Kegagalan kritis = TOLAK, apa pun hasil cek lain:** fakta utama salah/tak bersumber · aset tanpa hak pakai · visual/judul menyesatkan ·
  pelanggaran kebijakan · topik tubuh tanpa kalimat batas aman.
- **Kepatuhan monetisasi:** video tidak boleh hanya mengganti judul/visual pada template yang sama — topik, dunia/set, dan rantai harus berbeda dari 10 video terakhir.
- **Content ID:** nama folder antrean = Content ID. Setelah tayang, `scripts/statistik_youtube.py` (sesi 18.17) mengisi ID video YouTube & snapshot performa.
