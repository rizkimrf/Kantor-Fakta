---
name: naskah-viral
description: Cara Nadia menulis naskah Shorts/video panjang Ternyata Begitu yang berpotensi viral - resep viral (format "Kamu yang bikin" & "Katanya vs Ternyata"), bahasa lisan, naskah suara ElevenLabs, dan cek otomatis.
---
# Naskah Viral (Nadia)
**WAJIB: `referensi/resep-viral.md` (keputusan Bos 28 Nov 2026).** Resep itu mengalahkan semua aturan lama (batas 60 dtk, skor 1–10, loop,
ajakan komentar 1 kata, format A/B lama, STANDAR 80). Analisa dasarnya: `laporan/2026-11-28/bedah-3-video-viral.md`.
1 Shorts per hari, tayang 18.30 WITA → setiap naskah harus yang terbaik, bukan yang tercepat.

## Urutan kerja
1. Baca `riset.md` (Laras sudah mengunci rantai & istilah) dan `seo.md` (Raka).
2. Pilih format di `naskah.json` → `"format_resep"`:
   - `"kamu-yang-bikin"` — cara kerja benda: "Kalau kamu [aksi kecil], kamu udah [bikin versi kecilnya]" → 4–7 × "Tapi … → Jadi …" → "Makanya kalau kamu …" → "Selamat, kamu baru aja nemuin [nama]. Berikutnya mau kita rakit apa?" (70–120 dtk).
   - `"katanya-ternyata"` — mitos/pengalaman tubuh & rumah: "Kenapa …?" → "Itu bukan [mitos]. Itu [jawaban]." (≤ 6 dtk) → penampang → "Terus, kenapa …?" → batas aman → "Terus, … ? Itu besok." (45–75 dtk).
3. Tulis 3 versi 3 detik pertama, pilih yang paling cepat dipahami tanpa suara (Raka ikut memilih — uji banding R1).
4. Setiap adegan yang berisi fakta wajib punya `"klaim": ["K1", …]` (ID dari tabel klaim di riset.md, status VERIFIED atau PARTIALLY_SUPPORTED dengan kalimat aman). Kalimat tanpa dukungan klaim = bukan fakta (candaan/peragaan saja) atau dihapus. Riset belum `READY` → kembalikan ke Laras, jangan mengarang.
5. Tulis seluruh narasi sebagai SATU cerita. Setiap kalimat punya `aksi` (apa yang terlihat PERSIS saat kalimat itu diucapkan) dan, bila perlu, `teks_layar` = chip bab ("MASALAH: …", "SOLUSI: …", "KATANYA: …", "TERNYATA: …").
6. Jalankan `python scripts/cek_standar.py antrean/<folder>` → harus LULUS sebelum diserahkan. GAGAL = tulis ulang bagian itu, jangan serahkan.

## Bahasa (tetap berlaku)
- **Bahasa masyarakat dulu:** kalimat yang SUDAH diucapkan orang Indonesia ("katanya masuk angin", "kalo", "nancep", "gedein", "ambrol", "kelar-kelar"). Cek `panduan/bahasa-populer.md`.
- Sapaan "kamu", kalimat ≤ 14 kata, istilah teknis hanya setelah bendanya terlihat ("Ini namanya …").
- Detail ahli (nama peneliti, tahun) bukan di 3 detik pertama; boleh di isi bila membantu cerita.
- Candaan lahir dari kegagalan yang diperagakan (runtuh, kebanjiran, amblas), bukan lelucon tempelan.
- Tokoh pendamping "sok tau" (setelah disetujui Bos): `"pembicara": "pendamping"`, maks 3 kalimat ≤ 8 kata, ditutup "Ooh… ternyata begitu."

## naskah_suara.txt (ElevenLabs v4)
Tag emosi di depan kalimat: `[excited]` 3 dtk pertama & "Selamat…", `[curious]` "Tapi…/Terus kenapa…", `[laughs]` setelah kegagalan lucu, `[whispers]` bocoran. Maks 6 tag.
Tulis seperti diucapkan: "2006" → "dua ribu enam". Jeda pakai "...". Titik di setiap akhir kalimat (tempat jeda aman untuk editor).
Kecepatan: format A ±2,4 kata/dtk (lancar, nyaris tanpa jeda); format B ±1,9 kata/dtk (jeda 0,4–0,6 dtk antar kalimat, biar teks besar terbaca).

## Hasil
`naskah.json` (format_resep, adegan: narasi, pembicara, aksi, teks_layar, durasi), `naskah_baca.txt`, `naskah_suara.txt`, judul (3 opsi), caption dasar.
Referensi lama (hanya bila perlu ide kata): `referensi/hook-26.md`. `referensi/format-gabungan.md` dan `referensi/standar-80.md` SUDAH DIGANTI resep viral.
