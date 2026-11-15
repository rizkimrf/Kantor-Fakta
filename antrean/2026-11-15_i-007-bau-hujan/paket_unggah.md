# Paket Unggah — I-007 Bau hujan (DRAF, difinalkan Pak Bima setelah review)
Oleh: Raka (marketing) · 15 Nov 2026 · Mengikuti `cek_seo.md`. Bila naskah berubah setelah cek fakta, caption dicek ulang.

## YouTube Shorts
Judul (50 huruf): Bau Hujan Ternyata "Dibuat" Bakteri, Ini Alasannya
Deskripsi:
Bau hujan pertama itu bukan bau air. Salah satu bahan utamanya, geosmin, dibuat bakteri tanah Streptomyces, dan baunya memanggil springtail, hewan mungil yang ikut menyebarkan spora bakteri.
Tetes hujan menjebak gelembung udara yang pecah jadi kabut halus, dan peneliti MIT menduga kabut itulah pembawa aromanya. Bonus: geosmin juga salah satu biang bau lumpur pada ikan budidaya air tawar seperti lele.

Sumber:
- Bear & Thomas (1964), Nature 201:993, istilah "petrichor": https://doi.org/10.1038/201993a0
- Smithsonian Magazine, What Makes Rain Smell So Good?: https://www.smithsonianmag.com/science-nature/what-makes-rain-smell-so-good-13806085/
- Gerber & Lechevalier (1965), Applied Microbiology 13:935, geosmin: https://pmc.ncbi.nlm.nih.gov/articles/PMC1058374
- John Innes Centre, Meet the Molecules: Geosmin: https://www.jic.ac.uk/blog/meet-the-molecules-geosmin/
- Becher dkk. (2020), Nature Microbiology, springtail & spora: https://doi.org/10.1038/s41564-020-0697-x
- Smithsonian (2020), How Rain Evolved Its Distinct Scent: https://www.smithsonianmag.com/smart-news/smell-rain-explained-180974692/
- Joung & Buie (2015), Nature Communications 6:6083, aerosol tetes hujan: https://dspace.mit.edu/handle/1721.1/107381
- MIT News (2015), Rainfall can release aerosols: https://news.mit.edu/2015/rainfall-can-release-aerosols-0114
- Global Seafood Alliance, off-flavor geosmin & 2-MIB: https://www.globalseafood.org/advocate/off-flavors-in-salmonids-raised-in-ras/
- Univ. Copenhagen (2023), muddy flavors in fish: https://news.ku.dk/all_news/2023/10/pinpointing-the-emergence-of-muddy-flavors-in-your-fish/
- Jurnal Ilmu-ilmu Perikanan & Budidaya Perairan, ikan bercita rasa lumpur: https://jurnal.univpgri-palembang.ac.id/index.php/ikan/article/view/1670

#Shorts #BauHujan #Petrichor

Tag: bau hujan, kenapa hujan bau tanah, petrichor, geosmin, bau tanah setelah hujan, bau tanah basah, aroma hujan, fakta sains, ternyata begitu
Komentar tersemat: Fakta cadangan: lalat buah punya jalur saraf khusus cuma buat KABUR dari bau geosmin (Stensmyr dkk., Cell 2012). Kita kangen, mereka kabur. Hujan pertama di daerahmu turun bulan apa?

## TikTok
Caption: Bau hujan yang kamu kangenin itu bukan bau air. Salah satu bahan utamanya dibuat bakteri tanah, dan bakterinya lagi pasang iklan. Tonton sampai bagian lele, itu plot twist-nya. Hujan pertama di daerahmu turun bulan apa?
Hashtag: #faktasains #bauhujan #petrichor #geosmin #TernyataBegitu
Teks sampul (= frame pertama video): BAU HUJAN · DIBUAT BAKTERI?!

## Instagram Reels
Caption: Bau hujan pertama ternyata ada "iklannya". Salah satu bahan utamanya, geosmin, dibuat bakteri tanah untuk memanggil hewan mungil penyebar spora. Dan geosmin juga salah satu biang bau lumpur di lele kolam.
Simpan buat bahan ngobrol pas hujan turun, kirim ke teman yang paling suka bau hujan. Hujan pertama di daerahmu turun bulan apa?
Hashtag: #bauhujan #petrichor #faktaunik #sains #TernyataBegitu
Teks sampul (= frame pertama video): BAU HUJAN · DIBUAT BAKTERI?!

## Jam tayang usulan: Minggu 15 Nov 2026, **20.00 WITA** (= 19.00 WIB) di ketiga platform
Alasan (dugaan, belum ada data channel sendiri, karena ini video pertama):
- Saat paket ini ditulis sudah 18.48 WITA. 19.00 WITA tidak realistis karena cek fakta, produksi, review, dan persetujuan Bos masih harus jalan.
- 19.00 WIB adalah selepas maghrib/makan malam di zona WIB, tempat mayoritas penonton Indonesia. Minggu malam orang santai di rumah sebelum Senin.
- Topik hujan cocok malam: di banyak daerah hujan turun sore, jadi baunya masih "terasa" saat penonton membuka HP.
- **Cadangan: 21.00 WITA** (= 20.00 WIB) bila `final.mp4` + persetujuan Bos belum ada pukul 19.15 WITA. Lewat dari itu, saya sarankan geser ke slot Senin 12.00 WITA daripada tayang terburu-buru.

**Catatan teknis untuk Pak Bima (penting, supaya benar-benar tayang malam ini):**
1. `terbitkan.py` hanya memilih slot dari `JAM_TAYANG_SHORTS` (bawaan 12 & 18) dan minimal 45 menit dari sekarang. Kalau dibiarkan otomatis, video ini akan jatuh ke **Senin 16 Nov 12.00**. Agar tayang malam ini, isi `jadwal_tayang` di `status.json` saat tahap `disetujui`, mis. `"2026-11-15T20:00:00+08:00"` (script memakai nilai itu bila ada).
2. TikTok & Instagram baru diunggah bila `terbitkan.py` dijalankan paling cepat 15 menit sebelum jadwal. Jadwal cloud hanya 11.47 & 17.47, jadi **`/terbitkan` harus dijalankan manual sekitar 19.45–20.00 WITA**.
3. YouTube: kalau `YT_AUDIT_LOLOS` belum "ya", script tidak mengunggah YouTube (video API akan terkunci privat). Kalau begitu, unggah manual dari YouTube Studio dengan judul/deskripsi/tag di atas, dan jadwalkan 20.00 WITA.

## Wajib sebelum tayang
- **Label konten sintetis/AI WAJIB menyala** di ketiga platform, karena narasi memakai suara AI (ElevenLabs). YouTube: "Konten diubah atau sintetis" = Ya (`containsSyntheticMedia` sudah otomatis di script). TikTok: label "AI-generated". Instagram: label "Dibuat dengan AI". Kalau Bos nanti mengirim rekaman suaranya sendiri, Pak Bima putuskan ulang label berdasarkan cara gambar/klip dibuat (script tetap menyalakan label AI secara bawaan).
- Sampul tidak perlu diatur: frame pertama video sudah berupa sampul.
- `unggah.json` (draf) sudah ditulis dari paket ini; perbarui bila caption difinalkan berbeda.
- Pastikan butir wajib di `cek_seo.md` (adegan 6: "Nah, maksud bakterinya apa?") sudah masuk ke suara final.
