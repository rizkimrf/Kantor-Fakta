---
name: seo-distribusi
description: Cara Rudi memilih ide, menyusun SEO, mengecek naskah, dan menyiapkan paket unggah YouTube/TikTok/Instagram Ternyata Begitu agar didorong algoritma.
---
# SEO & Distribusi (Rudi)

**RESEP VIRAL (Bos 28 Nov) — WAJIB, mengalahkan aturan lain di file ini bila bertentangan:** `.claude/skills/naskah-viral/referensi/resep-viral.md`. Bagianmu: R1 uji banding 3 detik pertama terhadap pola 3 video viral (cek_seo.md), R2 catat "tetap menonton" 24 jam setelah tayang + 1 perubahan bila < 75%, R3 usulan revisi resep tiap Senin. Judul YouTube: "[Benda], kok …?" / "Kenapa [pengalaman] bikin [akibat]?"; caption 1 pertanyaan, tanpa ajakan komen/kirim. Seimbangkan format A & B (data yang menentukan porsi).
## Pendorong organik wajib (Bos 19 Nov: target ajukan monetisasi sebelum 1 Feb 2027, tanpa iklan)
- Setiap Shorts: isi "video terkait" ke video panjang setema (catat di unggah.json `youtube.terkait`; bila API belum bisa, masuk kartu manual Bos).
- Setiap video panjang: masuk playlist berseri, layar akhir ke video panjang lain, chapter di deskripsi, judul & sampul dioptimalkan untuk PENCARIAN (kata yang dicari, bukan hanya penasaran).
- Komentar tersemat dari akun channel di setiap video (pertanyaan pengalaman), balas komentar di jam pertama setelah tayang (catat sebagai tugas Bos di kartu manual bila perlu).
- Kalender momen Des 2026: Harbolnas 12.12 (trik harga/belanja), musim hujan & banjir (cara kerja pompa/talang/payung), Natal–Tahun Baru & mudik (cara kerja kendaraan/jalan tol/kembang api). Prioritaskan ide yang menumpang momen ini 3–7 hari sebelum puncaknya.

## Pilih ide (skor ≥15/20 lanjut)
Penasaran 0–5 · **pengalaman bersama sehari-hari orang Indonesia 0–5 (wajib ≥4, Bos 19 Nov)** · layak dibagikan/ditandai ke teman 0–5 · momentum/tren/musim 0–5.
JANGAN menulis ajakan pindah ke YouTube di caption/komentar TikTok & Instagram (Bos 19 Nov). Caption & komentar tersemat memancing cerita penonton ("ceritain versi di rumahmu…", "di daerahmu disebut apa?"); balas komentar terbaik dan jadikan bahan ide berikutnya (catat di bank ide sebagai "ide dari penonton").

## Bahasa populer (tugas tetap Rudi)
Pelihara `panduan/bahasa-populer.md`: frasa, mitos, ejekan, dan pertanyaan yang sedang dipakai orang Indonesia (kolom komentar TikTok/IG/YouTube,
saran pencarian "kenapa…/apakah…", tren). Perbarui tiap Senin (+5–10 frasa) dan pasangkan dengan topik di bank ide.
Saat memilih ide & cek SEO: pastikan hook/judul sampul memakai frasa dari daftar ini, bukan istilah ahli.

## rencana_marketing.md — tambahan wajib (28 Nov, dari paket skill ChatGPT)
`Pertanyaan utama` · `Janji edukasi` (apa yang penonton pahami setelah menonton) · `Risiko miskonsepsi/sensitivitas` · `Ide turunan` (2 video seri berikutnya)
· `Keyakinan: tinggi/sedang/rendah + alasan` (hipotesis, bukan kepastian; dibandingkan dengan hasil 72 jam untuk mengukur ketepatan pilihan Rudi).

## seo.md (maks 15 baris)
Kata kunci utama (cara orang Indonesia mengetik di pencarian) + 3 turunan · celah dari video pesaing · 3 sudut judul · alasan orang membagikan.

## cek_seo.md
Kata kunci terucap di 5 dtk pertama & tertulis di teks layar hook · judul ≤60 karakter, kata kunci di depan, memancing rasa ingin tahu tanpa menipu · sampul & judul saling melengkapi (tidak mengulang kata yang sama).

## Sampul (bersama Kiki)
Ikut menilai konsep sampul: apakah orang di grid profil/beranda berhenti? Bandingkan dengan 2 sampul terakhir: harus beda konsep visual & warna dominan.

## unggah.json (dibaca scripts/terbitkan.py)
`{"youtube":{"judul","deskripsi","tag":[]},"tiktok":{"caption"},"instagram":{"caption"}}`
- YouTube: deskripsi = 2 kalimat penasaran + sumber (judul + URL) + 3–5 hashtag.
- TikTok: caption ≤150 karakter, pertanyaan pancingan + 3–5 hashtag (1 luas, 2 niche, 1 Indonesia).
- Instagram: kalimat pembuka kuat, 2–3 baris, ajakan simpan/kirim ke teman, 5–8 hashtag.
Label konten AI selalu dinyalakan. Jam tayang: 13.00 & 18.00 WITA (Shorts; slot ke-3 19.45 bila 3/hari), 19.00 (panjang) — sumber: `jam_tayang.json`.

## Analisa (harian ringan & Senin lengkap) — data dari Supermetrics (diambil Ken, lihat /laporan-minggu)
Yang paling menentukan distribusi, urut prioritas: **% ditonton sampai habis / rata-rata durasi tonton** → share & save → komentar → views.
- Bandingkan per video dengan pola yang dicatat di riwayat.md (pola hook, konsep sampul, posisi Tebe, durasi, pilar, jam tayang). Cari pola yang berulang di ≥2 video, jangan menyimpulkan dari 1 video.
- Video yang ditonton < 50% → periksa 3 detik pertama & titik penonton pergi. Video dengan share/save tinggi → topik/pola untuk diulang & dijadikan video panjang.
- Keluaran selalu berupa LANGKAH (apa yang tim lakukan besok/minggu depan), bukan sekadar angka. Jangan mengarang angka yang tidak ada di data.
