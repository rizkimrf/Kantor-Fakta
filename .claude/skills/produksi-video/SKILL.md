---
name: produksi-video
description: Cara Yoga memproduksi video Ternyata Begitu yang mulus dan profesional - suara, animasi Tebe, transisi, teks di zona aman, musik/SFX, sampul momen dramatis, render, dan cek kemulusan.
---
# Produksi Video (Yoga) — "Sekali lagi, biar pas."
Contoh acuan: `studio-aset/contoh-1menit/v8-final.html` (struktur) · `studio-aset/contoh-sampul/` (sampul).
Alat: `scripts/suara.py` → `scripts/render_html.py` → `scripts/cek_mulus.py` + `scripts/cek_video.py`.

## Urutan kerja
1. **Suara dulu**: `python scripts/suara.py antrean/<folder>` → `audio/narasi.mp3` + `audio/waktu_kata.json`. Semua waktu visual mengikuti waktu kata, bukan sebaliknya. Simpan kedua file ini (ikut di-commit) supaya revisi tidak membayar kredit lagi.
2. **Rencana adegan** di `visual/video.html` (kontrak `window.render(T)`): tiap babak = set baru + 1 gerak kamera + aksi Tebe.
3. **Uji cepat** tiap transisi: `python scripts/render_html.py antrean/<folder> --mulai <t-1> --durasi 3 --skala 0.5`.
4. Render penuh → `cek_mulus.py` → lihat lembar cek → baru serahkan ke Pak Bima.

## Format gabungan (Bos, 19 Nov) — detail `.claude/skills/naskah-viral/referensi/format-gabungan.md`
- Visual MEMPERAGAKAN tiap kata (panah gaya, retak, aliran, penampang/x-ray). Satu dunia + kamera terus bergerak, sedikit potongan.
- Tebe cameo 1–3 kali (reaksi kecil di zona aman atau tangan yang mengoperasikan benda); subjek memenuhi layar.
- **Subtitle adaptif (Bos, 19 Nov):** gaya subtitle tetap seperti sekarang (2–4 kata per kelompok, mengikuti suara). Per adegan, pilih posisi
  di dalam zona aman yang KOSONG dari objek inti: pita atas (y 260–420), tengah (y 900–1100) atau bawah (y 1250–1400).
  Ukuran menyesuaikan ruang: normal 64–72 px; kecilkan sampai minimal 52 px bila ruang sempit; jangan pernah menutupi bagian yang
  sedang diperagakan (panah, retak, aliran, wajah Tebe). Pindah posisi hanya saat ganti babak dan dengan fade 150 ms (tidak loncat-loncat).
  Wajib kontur/bayangan gelap tipis agar terbaca di atas latar apa pun.
- Detik terakhir: teks besar ajakan komentar 1 kata berkubu, lalu adegan kembali ke pembuka (loop).
- **Outro (Bos 19 Nov):** ±1 dtk logo YouTube kecil (ikon play merah resmi, tidak diubah bentuk/warnanya) + teks "Ternyata Begitu" di zona aman,
  menyatu dengan adegan loop — tanpa kalimat "tonton di YouTube"/"subscribe". Ikon disimpan di `studio-aset/` sebagai SVG.

## Kemulusan (wajib — detail: referensi/kemulusan.md)
- Transisi 12–18 frame (0,4–0,6 dtk) dengan easing in-out, di celah antar-kalimat. Tidak ada frame warna polos, tidak ada wipe < 6 frame.
- **TANPA intro logo (Bos, 19 Nov).** Jangan panggil `KS.intro`; `T_INTRO = 0`. Narasi mulai di 0,0–0,3 dtk, visual hook sudah bergerak di frame ke-2.
- Durasi maks 60 dtk. Perubahan visual tiap 2–3 dtk (zoom, objek masuk, teks baru, sudut baru). Outro ≤ 1,5 dtk dan menyambung ke awal (loop mulus).
- Gerak Tebe & kamera selalu fungsi waktu kontinu (smootherstep), tidak pernah lompat posisi antar-frame.
- Narasi TIDAK dipotong di tengah kata: `window.JEDA` hanya di akhir kalimat (skrip juga menjepret ke celah kata + fade 25 ms).
- Musik: −12 s/d −15 dB di bawah narasi, ducking halus (sudah diatur skrip). SFX maks 4–6, mendarat tepat di aksi visual, tidak menutupi kata.

## Zona aman 1080×1920 (wajib — detail: referensi/zona-aman.md)
- Area tertutup UI: atas 0–220, bawah 1480–1920, kanan 900–1080 pada y 800–1480.
- Teks layar: di pita y 900–1400, x 80–880, 2–4 kata per kelompok, muncul dengan fade/scale 120 ms dan bertahan sampai kelompok berikutnya (bukan kata per kata yang berkedip).
- Wajah Tebe & objek inti selalu di dalam zona aman. Label kecil babak di y 240–300.
- Watermark bergiliran di (40, 236), (40, 1400), (kanan 200, 236) — di dalam zona aman, 70% opasitas.

## Sampul = momen dramatis, bukan template (wajib — detail: referensi/sampul.md)
Gaya acuan seperti channel animasi edukasi besar: satu ADEGAN ilustrasi yang menangkap momen paling menegangkan/aneh dari cerita.
- Tujuan sampul: penonton MERASA HARUS membuka video. Tunjukkan momen paling aneh/menegangkan, tapi jangan beri jawabannya.
- Subjek cerita BESAR & dekat kamera. Tebe opsional: kalau ada, ia beraksi dengan ekspresi kuat; posisinya bervariasi (kiri, kanan, tengah, dari atas/bawah, siluet, hanya tangan/mata, bahkan tidak ada bila subjek cerita lebih kuat sendiri).
- Pencahayaan dramatis (sorot/rim light/glow), 3 lapis kedalaman (latar diburamkan), vinyet.
- Teks atas 2 baris, maks 4–5 kata, huruf putih tebal berkontur gelap, 1 kata berwarna; berbentuk pertanyaan/klaim.
- Maks 1 grafis penunjuk (panah merah / lingkaran).
- Semua inti di y 260–1660 (grid profil memotong jadi 3:4). Beda konsep & warna dominan dari 2 sampul terakhir.
- Frame 0 video = sampul ini DAN sekaligus adegan hook (judul sampul = teks hook), sehingga video langsung jalan tanpa jeda.
  Komposisi sampul (teks besar + objek inti) BERTAHAN ±1 dtk pertama sambil bergerak halus — jangan langsung pindah adegan di frame 1
  (kasus Pedas & Gunting 18 Nov: sampul hanya 1 frame → YouTube memilih gambar tengah video). Selalu unggah `thumbnail.png` ke Kantor Visual (`thumb_url`) agar Bos bisa mengunduhnya.

## Selesai bila
`cek_mulus.py` LULUS, `cek_video.py` LULUS, ukuran ≤ 18 MB, lembar cek sudah dilihat, paraf di lembar_tim.md.
