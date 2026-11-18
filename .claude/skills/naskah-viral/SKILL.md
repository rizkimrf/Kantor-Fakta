---
name: naskah-viral
description: Cara Nadia menulis naskah Shorts/video panjang Ternyata Begitu yang berpotensi viral - hook, retensi, gaya ngobrol, naskah suara ElevenLabs, dan skor potensi viral.
---
# Naskah Viral (Nadia)
Penonton memutuskan dalam 1–2 detik. Tugasmu: membuat mereka TIDAK BISA geser.

## FORMAT GABUNGAN (Bos, 19 Nov 2026) — baca `referensi/format-gabungan.md` SEBELUM menulis
Dua jalur: **A "Kok Bisa Jalan?"** (cara kerja benda sehari-hari, rantai "masalah → solusi → tapi…", ≤ 90 dtk) dan
**B "Ternyata Begitu"** (fakta/mitos sehari-hari, ≤ 60 dtk). Keduanya: hook skenario "kamu", tiap kata diperagakan visual,
ajakan komentar 1 kata berkubu di akhir, loop ke adegan awal. Isi `"seri"` di status.json.

## Aturan baru dari data YouTube (perintah Bos, 19 Nov 2026) — MENGGANTIKAN aturan durasi sebelumnya
Data channel: tetap menonton 53–70% (target 75–85%), rata-rata ditonton 38–66% (target 90–120%+), penonton turun setelah ±45 dtk.
- **Shorts MAKSIMAL 60 dtk** (target nyaman 40–55 dtk; jalur A "cara kerja" ≤ 90 dtk). Fokus **1 inti kejutan** + "kok bisa" singkat + 1 candaan. Fakta pendukung lain → video lain/video panjang.
  Tetap tidak terburu-buru: tempo bicara normal, kalimat utuh, mudah dipahami — yang dibuang pengantar & pengulangan, bukan kejelasan.
- **TANPA intro logo.** Narasi hook terdengar di detik 0,0–0,3. Tidak ada hening/salam di awal.
- **Hook pakai 26 tipe** di `referensi/hook-26.md` (10 kandidat dari ≥5 tipe, skor ≥ 8, tipe beda dari 5 video terakhir).
- **Loop mulus:** kalimat terakhir menyambung/menjawab kalimat pertama, sehingga saat video berulang terasa lanjut (tanpa outro panjang; outro ≤ 1,5 dtk sambil narasi terakhir).
- **Pancing reaksi:** 1 pertanyaan terbuka/pilih kubu di akhir (bukan rangkuman, bukan "like & subscribe") + 1 pemicu share spesifik bernuansa identitas
  ("kirim ke teman yang …"). Topik relatable (kebiasaan/kata/mitos Indonesia) diprioritaskan.
- Perubahan visual tiap 2–3 dtk (ditulis di kolom aksi naskah.json supaya Yoga tahu).

## Struktur Shorts (±2,3 kata/dtk)
1. **Hook 0–3 dtk — tugas nomor satu.** Penonton harus berhenti menggulir sebelum detik ke-3. Hook = kalimat + visual pembuka bekerja bersama.
   - **Bahasa masyarakat dulu (keputusan Bos):** hook & judul sampul memakai kalimat yang SUDAH diucapkan/dicari orang Indonesia sehari-hari
     — mitos, ejekan, pertanyaan warung, istilah viral ("micin bikin bodoh?", "generasi micin", "kenapa durian bau banget?").
     Detail ahli yang belum dikenal orang (nama peneliti, "1 surat 1968", "4 salinan gen", tahun) TIDAK di hook/sampul — itu bahan kejutan di ISI video.
     Uji: "Apakah teman tongkrongan saya pernah mengucapkan kalimat ini?" Kalau tidak, ganti. Cek daftar `panduan/bahasa-populer.md`.
   - Kalimat pertama ≤ 12 kata, kata kunci SEO terucap, langsung ke inti (tanpa "halo", "tahukah kamu", "di video ini").
   - Pakai 26 tipe di `referensi/hook-26.md`. Pola ringkas lama (masih berlaku sebagai contoh) — putar terus (catat di `panduan/riwayat.md`, tidak sama dengan 5 video terakhir):
     **Kamu salah** ("Bau hujan yang kamu suka itu bukan bau air.") · **Mustahil tapi nyata** ("Komodo ini hamil tanpa pernah ketemu pejantan.") ·
     **Bahaya/tabu** ("Jangan cium tanah setelah hujan… atau cium?") · **Angka mengejutkan** · **Pertanyaan pribadi** ("Kenapa kamu selalu beli yang 99.900?") ·
     **Rahasia/bocoran** ("Penjual nggak mau kamu tahu ini.") · **Mulai dari akhir** (tunjukkan akibatnya dulu, sebabnya nanti).
   - Visual detik 0–3 harus bergerak dan aneh/menegangkan (bukan Tebe berdiri menyapa). Teks layar hook = 2–4 kata paling memancing.
   - Tulis 10 kandidat, beri nilai 1–10 "apakah saya berhenti menggulir kalau melihat ini di beranda?", pakai yang tertinggi (≥ 8). Raka ikut menilai 3 teratas.
2. **(Tanpa intro — langsung isi.)**
3. **Isi**: 1 inti kejutan (+ maks 1 fakta pendukung), tiap ±8 dtk buka celah baru ("tapi ada masalah…", "dan anehnya…"). Jawab "kok bisa?" dengan mekanisme sederhana + perbandingan sehari-hari Indonesia.
4. **Bayar janji hook** sebelum detik terakhir, lalu **loop + reaksi**: kalimat penutup menyambung ke kalimat pertama, berisi pertanyaan terbuka/pilih kubu dan pemicu share.

## Gaya bicara
Ngobrol ke teman: "kamu", kalimat pendek, 1 canda ringan per babak, tidak menggurui, tidak lebay. Angka maks 2 per Shorts.

## naskah_suara.txt (ElevenLabs v4, suara Dakocan)
Tag emosi di depan kalimat: `[excited]` hook & penutup, `[curious]` "kok bisa?", `[laughs]` setelah canda, `[whispers]` bocoran. Maks 5 tag.
Tulis seperti diucapkan: "2006" → "dua ribu enam", "ZZ" → "zet zet". Jeda pakai "...". Titik di setiap akhir kalimat (tempat jeda aman untuk editor).

## Skor Potensi Viral (jujur; ≥8/10 baru lanjut ke Raka)
| Butir | 0–2 |
|---|---|
| Hook menghentikan jempol (tanpa konteks pun penasaran) | |
| Jarak kejutan besar & benar | |
| Retensi: celah baru tiap ±10 dtk, tidak ada bagian datar | |
| Layak dibagikan ("eh tahu nggak…" / membuat penonton terlihat pintar) | |
| Pemicu komentar/tonton ulang di akhir | |
Tulis skor + 1 kalimat alasan per butir di naskah.json (`skor_viral`). Nilai < 8 → perbaiki hook dulu, bukan menambah fakta.

## Hasil
`naskah.json` (adegan: teks, durasi, set, aksi Tebe, teks layar 1–3 kata), `naskah_baca.txt`, `naskah_suara.txt`, judul (3 opsi), caption dasar.
