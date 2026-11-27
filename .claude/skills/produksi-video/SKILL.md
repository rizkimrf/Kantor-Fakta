---
name: produksi-video
description: Cara Yoga memproduksi video Ternyata Begitu yang mulus dan profesional - suara, animasi Tebe, transisi, teks di zona aman, musik/SFX, sampul momen dramatis, render, dan cek kemulusan.
---
# Produksi Video (Yoga) — "Sekali lagi, biar pas."

**RESEP VIRAL (Bos 28 Nov) — WAJIB, mengalahkan aturan lain di file ini bila bertentangan:** `.claude/skills/naskah-viral/referensi/resep-viral.md`. Bagianmu: U1 (frame 0 sudah beraksi), U5 (setiap kalimat diperagakan persis, penampang/tembus pandang), U7 (subtitle kecil + sorot kata kunci + chip bab), U9 (efek komik BRUK!/BYUR!), U12 (Tebe = pelaku "kamu"). Contoh pola: `laporan/2026-11-28/bedah-3-video-viral.md`.
Contoh acuan: `studio-aset/contoh-1menit/v8-final.html` (struktur) · `studio-aset/contoh-sampul/` (sampul).
Alat: `scripts/suara.py` → `scripts/render_html.py` → `scripts/cek_mulus.py` + `scripts/cek_video.py`.

## Urutan kerja
1. **Suara dulu**: `python scripts/suara.py antrean/<folder>` → `audio/narasi.mp3` + `audio/waktu_kata.json`. Semua waktu visual mengikuti waktu kata, bukan sebaliknya. Simpan kedua file ini (ikut di-commit) supaya revisi tidak membayar kredit lagi.
2. **Rencana adegan** di `visual/video.html` (kontrak `window.render(T)`): tiap babak = set baru + 1 gerak kamera + aksi Tebe.
3. **Uji cepat** tiap transisi: `python scripts/render_html.py antrean/<folder> --mulai <t-1> --durasi 3 --skala 0.5`.
4. Render penuh → `cek_mulus.py` → lihat lembar cek → baru serahkan ke Pak Bima.

## Gaya resep viral (Bos 28 Nov) — dari bedah 3 video ±13 juta views
- **Satu dunia, satu cerita.** Set dibangun lebih lebar dari layar; kamera dolly/zoom terus di dunia yang sama (V3: satu bidikan 70 dtk). Potong hanya bila pindah skala (kecil → raksasa).
- **Peragaan persis:** setiap kalimat = satu aksi terlihat. Bagian dalam = penampang/tembus pandang (tanah dipotong, tabung transparan, lapisan kulit). Kegagalan diperagakan dramatis + efek kata komik (BRUK!, BYUR!, KREK!) + SFX.
- **Format A "Kamu yang bikin":** Tebe (helm/rompi sesuai topik) = "kamu" yang mengerjakan setiap langkah sejak frame 0. Skala naik: alat kecil → mesin raksasa.
  Chip bab kiri atas (y 240–330): label kecil "MASALAH"/"SOLUSI" + judul pendek dengan 1 kata disorot kotak biru/teal.
- **Format B "Katanya vs Ternyata":** gaya infografis 2D (latar polos gelap/terang), baris kecil putih + KATA KUNCI BESAR berwarna di atas, gambar penampang di tengah, perbandingan berdampingan (pelan/sedang/keras).
- **Subtitle:** kecil 44–56 px, 2–4 kata mengikuti suara, kata kunci/istilah disorot kotak warna; posisi adaptif di zona aman yang kosong dari peragaan; kontur gelap tipis. Emoji maks 3.
- **Tokoh pendamping (setelah disetujui Bos):** muncul hanya saat kalimatnya (`pembicara: pendamping`), ekspresi "yakin" → "kaget/malu" saat dibantah.
- **Penutup:** kalimat terakhir (pertanyaan/janji seri) di atas adegan hasil akhir yang megah (gedung jadi, kereta lewat); lalu ±1 dtk logo YouTube kecil + "Ternyata Begitu" (Bos 19 Nov). Tanpa teks ajakan komentar, tanpa loop paksa.

## Manifest aset & kejujuran visual (28 Nov, dari paket skill ChatGPT)
- Tulis `aset_manifest.md` di folder video: `| ID | Aset (gambar/animasi/musik/SFX/suara/font) | Sumber/lokasi | Lisensi/dasar pakai | Status |`.
  Aset buatan sendiri (kode SVG, SFX sintesis) ditulis "buatan tim". Tanpa dasar pakai yang jelas → jangan dipakai.
- Ilustrasi/rekonstruksi yang bisa disangka rekaman nyata → beri penanda kecil "ilustrasi". Jangan menambah angka/teks fakta di layar yang tidak ada di riset.md.
- Visual tidak boleh mengubah makna fakta (skala, urutan, jumlah). Bila peragaan butuh mengubah makna → berhenti, bicarakan dengan penulis naskah & Laras.

## Kemulusan (wajib — detail: referensi/kemulusan.md)
- Transisi 12–18 frame (0,4–0,6 dtk) dengan easing in-out, di celah antar-kalimat. Tidak ada frame warna polos, tidak ada wipe < 6 frame.
- **TANPA intro logo (Bos, 19 Nov).** Jangan panggil `KS.intro`; `T_INTRO = 0`. Narasi mulai di 0,0–0,3 dtk, visual hook sudah bergerak di frame ke-2.
- Durasi mengikuti naskah (format A 70–120 dtk, format B 45–75 dtk). Perubahan visual tiap 2–3 dtk (zoom, objek masuk, teks baru, sudut baru). Outro logo ≤ 1,5 dtk setelah kalimat penutup.
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
- `thumbnail.png` = sampul terpisah: benda besar + pertanyaan ≤ 4 kata ("[Benda], kok …?"). Frame 0 video = aksi yang SUDAH berjalan + chip bab (U1), bukan gambar diam.
  YouTube sering memilih frame acak sebagai sampul Shorts (kasus Pedas & Gunting 18 Nov) → selalu unggah `thumbnail.png` ke Kantor Visual (`thumb_url`) agar Bos bisa mengunduhnya.

## Selesai bila
`cek_mulus.py` LULUS, `cek_video.py` LULUS, ukuran ≤ 18 MB, lembar cek sudah dilihat, paraf di lembar_tim.md.
