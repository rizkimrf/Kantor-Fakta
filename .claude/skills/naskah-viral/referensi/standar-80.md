# STANDAR 80 — batas wajib setiap Shorts (perintah Bos, 28 Nov 2026)
Tujuan: **≥ 80% penonton tetap menonton** (YouTube Studio → "Ditonton vs. digeser"). Data kita 28 Nov: hanya Jari keriput (78,4%)
mendapat dorongan kedua dari YouTube; video 63–70% berhenti setelah ±1.000 tayangan uji. Penonton unik ≈ tayangan → loop tidak bekerja.
Skor 1–10 buatan sendiri **TIDAK dipakai lagi sebagai syarat lulus** (semua naskah dapat 8 padahal hasilnya 63–78%).
Yang dipakai: batas terukur di bawah. Satu batas gagal = kembali ke pemiliknya. Tidak ada pengecualian, tidak ada "hampir".
Tidak ada yang bisa menjamin viral; yang dijamin: setiap video memenuhi syarat yang dimiliki video bertahan tinggi, lalu diukur 24 jam setelah tayang.

## Kenapa orang menggeser (dasar semua batas)
Dalam ±1 detik penonton memutuskan dari 3 hal: (1) apakah saya langsung MENGENALI bendanya, (2) apakah ada PERTANYAAN yang saya tidak bisa jawab,
(3) apakah layar BERGERAK. Jari keriput lolos karena: jari keriput terlihat langsung + "Bukan karena air masuk" membantah dugaan. Micin & Layar HP kalah:
kalimat pertama 13–16 kata dengan 2 gagasan, tanya-jawab sebelum penonton paham topiknya.

## Laras — topik (dicek sebelum `pilih`)
- L1 Topik = SATU benda/kejadian yang bisa digambar tanpa teks dan dikenali dalam 0,5 dtk (kapal, eskalator, jari keriput). Bukan konsep abstrak (zona waktu, aturan uang).
- L2 Pertanyaannya muat ≤ 5 kata dan memuat nama bendanya: "[Benda], kok …?" / "[Benda] … kenapa?"
- L3 Lolos dua uji: "pernah lihat sendiri" = YA dan "bisa jelaskan ke teman dalam 1 kalimat" = TIDAK.
- L4 Ada 1 momen visual "wah": potongan bagian dalam, skala raksasa, gerak lambat, atau benda melakukan hal yang tampak mustahil.
- L5 Prioritas jalur A: benda BESAR/mengesankan yang dekat dengan orang Indonesia (KRL/MRT, kapal feri, pesawat, eskalator, lift, jembatan, ATM, tower sinyal, bendungan).

## Nadia — naskah (dicek otomatis `scripts/cek_standar.py` + Pak Bima)
- N1 Kalimat pertama ≤ 7 kata, SAMA dengan pertanyaan di sampul, selesai terucap ≤ 1,5 dtk. Dilarang membuka dengan: "kamu pernah", "tahu nggak", "jadi", "nah", "halo", "tebak", "di video ini".
- N2 Kalimat kedua (≤ 4 dtk) = taruhan atau dugaan yang dibantah ("Padahal beratnya sepuluh ribu ton." / "Bukan karena air masuk.").
- N3 Total narasi **70–100 kata (±30–45 dtk)**. > 100 kata = GAGAL otomatis. Satu video = satu pertanyaan, satu jawaban.
- N4 Setiap kalimat ≤ 12 kata. Maks 3 langkah mekanisme. Maks 1 angka.
- N5 Jawaban lengkap baru terbuka di 70–85% durasi; sebelum itu setiap langkah memunculkan pertanyaan baru ("tapi…", "masalahnya…").
- N6 LOOP: kalimat terakhir menggantung dan menyambung ke kalimat pertama saat diputar ulang (baca: kalimat terakhir + kalimat pertama = satu kalimat utuh).
  Ajakan komentar 1 kata HANYA teks di layar 1,5 dtk terakhir, tidak diucapkan (supaya narasi langsung menyambung ke awal).
- N7 Tanpa salam, tanpa Tebe memperkenalkan diri, tanpa rangkuman di akhir.

## Yoga — visual (dicek `cek_mulus.py` + Pak Bima melihat frame 0, 1, 2 dtk)
- Y1 Frame 0 = sampul: benda utama ≥ 50% layar, teks pertanyaan ≤ 5 kata (≥ 110 px, 2 baris maks), benda sudah bergerak di frame 0. Tebe maks 15% layar atau tidak ada.
- Y2 Suara mulai ≤ 0,2 dtk. Perubahan visual (zoom/panah/potongan/sudut) setiap ≤ 2 dtk.
- Y3 Setiap langkah mekanisme diperagakan: panah, potongan bagian dalam, atau benda bergerak — bukan Tebe berbicara.
- Y4 Frame terakhir menyatu ke frame 0 (sudut kamera & benda sama) supaya pengulangan tidak terasa.

## Raka — uji banding sebelum tayang & ukur sesudah tayang
- R1 Uji banding (sebelum `cek_fakta`): tulis sampul + kalimat pertama video ini di samping 3 pembanding tetap:
  (a) Jari keriput "BUKAN AIR MASUK" (78,4%), (b) "Kapal, kok ngapung?", (c) "Tanpa setir, kok bisa belok?". Pertanyaan: "Mana yang paling cepat dipahami & bikin penasaran?"
  Bila video kita bukan yang terkuat atau setara (a), jelaskan alasannya dalam 1 kalimat dan kembalikan ke Nadia/Yoga. Hasil ditulis di cek_seo.md.
- R2 24 jam setelah tayang: catat "tetap menonton", "rata-rata ditonton", penonton unik vs tayangan di `laporan/harian.md`.
  < 75% → tulis penyebab di detik 0–1 (topik / kalimat pertama / frame 0) + SATU perubahan untuk video berikutnya.
- R3 Setiap Senin: batas mana yang tidak terbukti (video lulus semua batas tapi < 75%) → usulkan revisi standar ke Pak Bima. Standar ini berubah karena data, bukan selera.

## Pak Bima — gerbang
Lulus hanya bila: `python scripts/cek_standar.py antrean/<folder>` LULUS + semua L/N/Y "ya" + R1 tertulis + fakta benar (≥ 2 sumber).
Tulis di cek_fakta.md / review.md: daftar L1–L5, N1–N7, Y1–Y4 dengan "ya/tidak" dan bukti (kata, detik, frame). Tidak ada nilai 1–10.
