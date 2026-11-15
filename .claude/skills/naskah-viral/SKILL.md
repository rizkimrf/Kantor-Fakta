---
name: naskah-viral
description: Cara Nadia menulis naskah Shorts/video panjang Ternyata Begitu yang berpotensi viral - hook, retensi, gaya ngobrol, naskah suara ElevenLabs, dan skor potensi viral.
---
# Naskah Viral (Nadia)
Penonton memutuskan dalam 1–2 detik. Tugasmu: membuat mereka TIDAK BISA geser.

## Struktur Shorts (45–90 dtk, ±2,3 kata/dtk)
1. **Hook 0–3 dtk — tugas nomor satu.** Penonton harus berhenti menggulir sebelum detik ke-3. Hook = kalimat + visual pembuka bekerja bersama.
   - Kalimat pertama ≤ 12 kata, kata kunci SEO terucap, langsung ke inti (tanpa "halo", "tahukah kamu", "di video ini").
   - Pakai salah satu pola dan putar terus (catat di `panduan/riwayat.md`, tidak sama dengan 5 video terakhir):
     **Kamu salah** ("Bau hujan yang kamu suka itu bukan bau air.") · **Mustahil tapi nyata** ("Komodo ini hamil tanpa pernah ketemu pejantan.") ·
     **Bahaya/tabu** ("Jangan cium tanah setelah hujan… atau cium?") · **Angka mengejutkan** · **Pertanyaan pribadi** ("Kenapa kamu selalu beli yang 99.900?") ·
     **Rahasia/bocoran** ("Penjual nggak mau kamu tahu ini.") · **Mulai dari akhir** (tunjukkan akibatnya dulu, sebabnya nanti).
   - Visual detik 0–3 harus bergerak dan aneh/menegangkan (bukan Tebe berdiri menyapa). Teks layar hook = 2–4 kata paling memancing.
   - Tulis 10 kandidat, beri nilai 1–10 "apakah saya berhenti menggulir kalau melihat ini di beranda?", pakai yang tertinggi (≥ 8). Raka ikut menilai 3 teratas.
2. **Intro khas** (2,4 dtk, tanpa narasi).
3. **Isi**: 2–3 fakta inti, tiap ±10 dtk buka celah baru ("tapi ada masalah…", "dan anehnya…"). Jawab "kok bisa?" dengan mekanisme sederhana + perbandingan sehari-hari Indonesia.
4. **Bayar janji hook** sebelum detik terakhir, lalu **lingkaran**: kalimat penutup yang membuat ingin menonton ulang atau berkomentar (pertanyaan pilihan, bukan "like & subscribe").

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
