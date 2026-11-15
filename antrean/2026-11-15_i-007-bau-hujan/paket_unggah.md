# Paket Unggah — I-007 Bau hujan (FINAL, dicek ulang terhadap `final.mp4`)
Oleh: Raka (marketing) · 15 Nov 2026, dicek ulang 19.30 WITA · Mengikuti `cek_seo.md` dan `naskah.json` final. Judul, deskripsi, tag, caption, dan komentar tersemat sama persis dengan `naskah.json` dan `unggah.json`.

## YouTube Shorts
Judul (50 huruf): Bau Hujan Ternyata "Dibuat" Bakteri, Ini Alasannya
Deskripsi:
Bau hujan pertama itu bukan bau air. Salah satu bahan utamanya, geosmin, dibuat bakteri tanah Streptomyces, dan baunya memanggil springtail, hewan mungil yang ikut menyebarkan spora bakteri.
Tetes hujan menjebak gelembung udara yang pecah jadi kabut halus, dan peneliti MIT menduga kabut itulah pembawa aromanya. Bonus: geosmin juga salah satu biang bau lumpur di lele kolam.

Sumber:
- Bear & Thomas (CSIRO), Nature 1964 (petrichor): https://doi.org/10.1038/201993a0
- Smithsonian Magazine: https://www.smithsonianmag.com/science-nature/what-makes-rain-smell-so-good-13806085/
- Gerber & Lechevalier, Applied Microbiology 1965 (geosmin): https://pmc.ncbi.nlm.nih.gov/articles/PMC1058374
- John Innes Centre, Meet the Molecules: Geosmin: https://www.jic.ac.uk/blog/meet-the-molecules-geosmin/
- Becher dkk., Nature Microbiology 2020 (springtail): https://doi.org/10.1038/s41564-020-0697-x · Smithsonian 2020: https://www.smithsonianmag.com/smart-news/smell-rain-explained-180974692/
- Joung & Buie (MIT), Nature Communications 2015 (gelembung tetes hujan): https://dspace.mit.edu/handle/1721.1/107381 · MIT News: https://news.mit.edu/2015/rainfall-can-release-aerosols-0114
- Ikan bau lumpur: Jurnal Ilmu-ilmu Perikanan & Budidaya Perairan: https://jurnal.univpgri-palembang.ac.id/index.php/ikan/article/view/1670 · SRAC 192 (lele kolam): https://srac.tamu.edu/fact-sheets/serve/33
- Stensmyr dkk., Cell 2012 (lalat buah & geosmin): https://www.mpg.de/6656708/odour-activation-geosmin-fly

#Shorts #BauHujan #Petrichor

Tag: bau hujan, kenapa hujan bau tanah, petrichor, geosmin, bau tanah setelah hujan, bau tanah basah, aroma hujan, fakta sains, ternyata begitu
Komentar tersemat: Bonus fakta: lalat buah punya jalur saraf khusus cuma buat KABUR dari bau geosmin (Stensmyr dkk., Cell 2012). Kita kangen, mereka kabur. Hujan pertama di daerahmu turun bulan apa?

## TikTok
Caption: Bau hujan yang kamu kangenin itu bukan bau air. Salah satu bahan utamanya dibuat bakteri tanah, dan bakterinya lagi pasang iklan. Tonton sampai bagian lele, itu plot twist-nya. Hujan pertama di daerahmu turun bulan apa?
Hashtag: #faktasains #bauhujan #petrichor #geosmin #TernyataBegitu
Teks sampul (= frame pertama video): BAU HUJAN · DIBUAT BAKTERI?!

## Instagram Reels
Caption: Bau hujan pertama ternyata ada "iklannya". Salah satu bahan utamanya, geosmin, dibuat bakteri tanah untuk memanggil hewan mungil penyebar spora. Dan geosmin juga salah satu biang bau lumpur di lele kolam.
Simpan buat bahan ngobrol pas hujan turun, kirim ke teman yang paling suka bau hujan. Hujan pertama di daerahmu turun bulan apa?
Hashtag: #bauhujan #petrichor #faktaunik #sains #TernyataBegitu
Teks sampul (= frame pertama video): BAU HUJAN · DIBUAT BAKTERI?!

## Jam tayang usulan (diperbarui 19.30 WITA): Minggu 15 Nov 2026, **21.00 WITA** (= 20.00 WIB) di ketiga platform
Alasan (dugaan, belum ada data channel sendiri karena ini video pertama):
- Bos minta tayang malam ini. Usulan lama 20.00 WITA sudah tidak realistis: sekarang ±19.30 WITA, Bos masih harus menonton dan menekan Setujui di HP, lalu `/terbitkan` dijalankan.
- 20.00 WIB masih jam santai Minggu malam di zona WIB (mayoritas penonton), sesudah makan malam, sebelum orang tidur untuk Senin.
- **Batas waktu:** persetujuan Bos paling lambat **20.30 WITA**, supaya YouTube sempat dijadwalkan (script hanya memakai `publishAt` bila jadwal > 20 menit dari saat unggah; kalau kurang, video langsung publik).
- **Cadangan 1: 22.00 WITA** (= 21.00 WIB) bila persetujuan datang antara 20.30 dan 21.30 WITA.
- **Cadangan 2: Senin 16 Nov, 12.00 WITA** (slot otomatis) bila persetujuan lewat 21.30 WITA. Lebih baik geser daripada tayang terburu-buru larut malam.

**Catatan teknis untuk Pak Bima (supaya benar-benar tayang malam ini):**
1. Tanpa `jadwal_tayang` di `status.json`, `terbitkan.py` memilih slot otomatis (12 & 18 WITA) dan video ini jatuh ke **Senin 16 Nov 12.00**. Saat tahap `disetujui`, isi `"jadwal_tayang": "2026-11-15T21:00:00+08:00"` (atau `...T22:00:00+08:00` untuk cadangan 1). `jadwal_tayang_usulan` di `status.json` (masih 20.00) TIDAK dibaca script; nilai di `unggah.json` juga hanya catatan.
2. TikTok & Instagram baru diunggah bila `terbitkan.py` dijalankan paling cepat 15 menit sebelum jadwal. Jadwal cloud hanya 11.47 & 17.47, jadi **`/terbitkan` dijalankan manual sekitar 20.45–21.00 WITA** (cadangan 1: 21.45–22.00). YouTube boleh lebih awal (langsung dijadwalkan).
3. TikTok mode `inbox` (sebelum audit TikTok): video masuk kotak masuk, **Bos tinggal tekan Posting di aplikasi TikTok** pada jam tayang, dengan caption dari paket ini dan label AI dinyalakan manual.
4. YouTube: kalau `YT_AUDIT_LOLOS` belum "ya", script tidak mengunggah YouTube. Unggah manual dari YouTube Studio dengan judul/deskripsi/tag di atas, jadwalkan 21.00 WITA, dan centang "Konten diubah atau sintetis".
5. Setelah YouTube tayang, sematkan komentar di atas (manual; script tidak memasang komentar tersemat).

## Hasil cek ulang terhadap video jadi (Raka, 19.30 WITA)
- Sampul = frame 0 `final.mp4` (dicek dengan mengambil frame 0): pil kuning "BAU HUJAN" + "DIBUAT BAKTERI?!", Tebe kaget, teks besar dan terbaca di HP. Sama dengan `thumbnail.png`.
- `audio/waktu_kata.json`: "bau hujan" di 0,88–1,52 dtk narasi; ditambah jeda awal 0,15 dtk di video = **±1,0–1,7 dtk** di `final.mp4`. Masuk 3 detik pertama.
- Butir wajib `cek_seo.md` (adegan 6) sudah terucap di suara final: "Nah, maksud bakterinya apa? Ternyata baunya itu... iklan."
- Penutup video dan outro ("Hujan pertama di daerahmu turun bulan apa? Tulis di komentar") sama dengan pertanyaan di caption YouTube/TikTok/IG dan komentar tersemat.
- Durasi 71,6 dtk (dalam batas 45–90 dtk), 1080x1920, 30 fps.

## Wajib sebelum tayang
- **Label konten sintetis/AI WAJIB menyala** di ketiga platform, karena narasi memakai suara AI (ElevenLabs). YouTube: "Konten diubah atau sintetis" = Ya (`containsSyntheticMedia` sudah otomatis di script). TikTok: label "AI-generated". Instagram: label "Dibuat dengan AI". Kalau Bos nanti mengirim rekaman suaranya sendiri, Pak Bima putuskan ulang label berdasarkan cara gambar/klip dibuat (script tetap menyalakan label AI secara bawaan).
- Sampul tidak perlu diatur: frame pertama video sudah berupa sampul.
- `unggah.json` sudah final dan sama dengan paket ini (judul, deskripsi bersumber, tag, caption TikTok/IG, komentar tersemat, jadwal usulan, label AI).
- Butir wajib di `cek_seo.md` (adegan 6) sudah terverifikasi di suara final (lihat bagian cek ulang di atas).
