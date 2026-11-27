# Audit sistem kerja vs blueprint "AI Content Factory OS" (ChatGPT) — Sab 28 Nov 2026, Pak Bima
Cara audit: setiap syarat blueprint dicek ke bukti di repo/jadwal/data, bukan ke ingatan. Status: TERBUKTI · SEBAGIAN · BELUM ADA · TIDAK DIKETAHUI.

## 1. Diagnosis singkat — 5 risiko terbesar (sebelum perbaikan hari ini)
1. **Performa tidak bisa ditelusuri per video.** Dari 23 video tayang, 0 punya ID video YouTube tercatat (semua "manual") dan 0 punya data performa per video.
   Akibatnya analisa selama ini berdasarkan tangkapan layar & ingatan, bukan data yang terhubung ke naskah/format.
2. **Mutu dinilai sendiri oleh pembuatnya.** Semua naskah diberi skor 8/9 oleh Nadia & disetujui Pak Bima, padahal hasilnya 63–78% tetap menonton — skor tidak membedakan apa-apa.
3. **Aturan berubah lebih cepat daripada bukti.** Format A/B (19 Nov), STANDAR 80 (28 Nov pagi), Resep viral (28 Nov) — tanpa log eksperimen, tanpa patokan median. Risiko belajar dari kebetulan.
4. **Sumber data akan putus.** Supermetrics (coba gratis) berakhir 29 Nov; izin YouTube Analytics sudah ditambahkan ke skrip login (24 Nov) tapi token belum diperbarui.
5. **Publikasi otomatis rapuh.** Instagram gagal setiap hari sejak 23 Nov (token kurang izin `pages_*`); tugas 19.32 (24–27 Nov) berjalan tanpa kunci API → 3 video harus diunggah manual.

## 2. Peta kerja yang berjalan sekarang
Bos (Kantor Visual HP) ⇄ Pak Bima (orkestrator, tugas terjadwal) → Laras riset → Raka pilih & SEO → Nadia naskah → Raka cek SEO → Pak Bima cek fakta →
Yoga produksi (ElevenLabs + animasi SVG + render) → Pak Bima review → **Dimas QC independen (baru)** → Bos Setujui/Tolak → terbit 18.17 (TikTok inbox otomatis, IG gagal, YouTube manual Bos)
→ **statistik_youtube.py (baru)** → evaluasi harian → laporan Senin → bank ide & resep.
"Database" = folder antrean (1 folder = 1 Content ID, `status.json` = state machine + riwayat aktor/waktu) + git (versi & jejak) + DB Kantor Visual (dasbor).

## 3. Tabel celah
| # | Syarat blueprint | Status sebelum | Bukti | Prioritas | Tindakan |
|---|---|---|---|---|---|
| 1 | Content ID menghubungkan ide → performa | SEBAGIAN | folder = ID, tapi 0/23 ID YouTube, 0 performa | P0 | **Diperbaiki hari ini:** `scripts/statistik_youtube.py` mengisi ID dari judul + snapshot `data/snapshot_youtube.csv`; jalan otomatis 18.17. Diuji tanpa internet: 25/25 folder cocok. Uji nyata pertama: 18.17 hari ini |
| 2 | QC independen memeriksa video final | SEBAGIAN | review.md + cek_mulus memeriksa video, tapi oleh pembuat sendiri | P0 | **Diperbaiki:** agent `qc` (Dimas) PASS/REVISI/TOLAK + daftar kegagalan kritis; skor 1–10 dihapus, diganti `cek_standar.py` terukur |
| 3 | Klaim → sumber yang benar-benar mendukung | SEBAGIAN | riset.md bersumber ≥ 2, cek_fakta per kalimat; belum ada tabel klaim↔kutipan | P1 | Dimas memeriksa ulang klaim vs riset.md; tabel klaim terstruktur → minggu depan |
| 4 | Metrik pasca-tayang 24 jam / 72 jam / 7 hari | BELUM ADA | hanya laporan harian & Senin tanpa umur video | P1 | **Diperbaiki:** snapshot mencatat umur video; sesi 18.17 menilai 24 jam/72 jam/7 hari |
| 5 | Patokan adil (median per format, bukan satu target) | BELUM ADA | — | P1 | **Diperbaiki (aturan):** bandingkan dengan median format yang sama; angka mulai terkumpul dari snapshot |
| 6 | Eksperimen & memori belajar L1–L4 | BELUM ADA | uji A/B ada di teks, tanpa log | P1 | **Diperbaiki:** `laporan/eksperimen.md` (E1 resep vs lama, E2 format A vs B, E3 iklan) + `panduan/pola-terbukti.md` |
| 7 | Data YouTube lewat API resmi | SEBAGIAN | upload API siap (audit belum lolos); statistik via Supermetrics s.d. 29 Nov | P0 | Data API (views/likes/komentar) bisa dengan token sekarang. **Bos:** jalankan ulang `login_youtube.py` agar izin Analytics (durasi tonton, subscriber per video) aktif |
| 8 | Publikasi andal & tanpa duplikat | SEBAGIAN | cek ID sebelum unggah ada; IG gagal izin; sesi 19.32 tanpa kunci | P0 | Tugas 19.32 dimatikan. **Bos:** perbarui token Instagram (izin `pages_show_list`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`) |
| 9 | State machine + jejak aktor/waktu | TERBUKTI | `status.json` tahap + riwayat (oleh, waktu) | — | Ditambah tahap QC |
| 10 | Versi naskah/render tidak tertimpa | TERBUKTI (teks) / SEBAGIAN (render) | git menyimpan semua versi teks; render tersimpan di aset Kantor Visual | P3 | Cukup |
| 11 | Persetujuan manusia sebelum tayang | TERBUKTI | status `disetujui` hanya dari Bos | — | — |
| 12 | Kepatuhan monetisasi (orisinal, tidak repetitif, label AI, hak aset) | SEBAGIAN | label AI, aset buatan sendiri, sumber; belum ada cek "template berulang" | P1 | **Diperbaiki:** cek 10 video terakhir di gerbang mutu & Dimas |
| 13 | KPI per agent (tingkat revisi, lulus QC, biaya per video) | BELUM ADA | hanya kredit ElevenLabs di `aset/log_kredit.csv` | P2 | Mulai minggu depan: Dimas mencatat hasil QC per agent; laporan Senin merangkum. Kuota Claude tidak bisa dibaca otomatis → tangkapan layar mingguan Bos |
| 14 | Pipeline & patokan Shorts vs video panjang terpisah | SEBAGIAN | aturan video panjang terpisah; belum ada data video panjang | P2 | Snapshot mencatat format; patokan panjang dibuat setelah 3 video |
| 15 | Pelacakan syarat YPP (subscriber, jam tonton panjang, views Shorts) | SEBAGIAN | laporan Senin | P2 | Tambah ke dasbor setelah data Analytics API tersedia |

## 4. Bagian blueprint yang TIDAK saya sarankan diikuti apa adanya
1. **n8n + PostgreSQL + Redis + S3.** Untuk 1 channel dan 1 video/hari, membangun ulang semua itu memakan minggu kerja & kuota tanpa menambah views.
   Padanannya sudah ada: tugas terjadwal = orkestrator, folder + status.json + git = database & log versi, DB Kantor Visual = dasbor, CSV snapshot = tabel analytics.
   Blueprint sendiri menulis: jangan rewrite total bila perbaikan bertahap lebih aman & ekonomis.
2. **Skor mutu 100 poin (CQS ≥ 85) sebagai syarat tayang.** Data kita membuktikan skor yang diberi pembuat sendiri tidak membedakan apa-apa (semua 8/9).
   Dipakai sekarang: batas terukur + auditor independen + kegagalan kritis. Skor angka baru masuk akal setelah dikalibrasi dengan hasil pasca-tayang (≥ 20 video).
3. **"Jangan optimalkan agar viral".** Prinsipnya benar (viral tidak bisa dijamin), tapi tujuan Bos memang views & monetisasi. Jalan tengah: optimalkan hal yang bisa dikendalikan
   (resep dari video yang terbukti viral, detik pertama, mutu, kecepatan belajar) dan ukur hasilnya per video.

## 5. Rencana 2 minggu (kriteria selesai)
| Kapan | Pekerjaan | Selesai bila |
|---|---|---|
| Sab 28 Nov 18.17 | Uji nyata `statistik_youtube.py` | ≥ 20 dari 23 video tayang punya ID YouTube & baris snapshot |
| Minggu ini (Bos) | Perbarui token YouTube (izin Analytics) & token Instagram | Snapshot berisi % ditonton & subscriber; IG terunggah otomatis 1x tanpa error |
| s.d. 4 Des | 5–7 video resep viral + QC Dimas | Setiap video punya qc.md PASS sebelum ke Bos |
| Senin 7 Des | Keputusan E1 & E2 dari median | Hasil ditulis di eksperimen.md; pola naik ke L3 hanya bila median lebih baik |
| s.d. 11 Des | KPI per agent + biaya per video di laporan Senin | Tabel revisi/QC/kredit per video tersedia |
