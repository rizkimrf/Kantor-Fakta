# Riset — A-02 Rice cooker kok tahu nasi matang? (Jalur A "Kok Bisa Jalan?")
Laras, 21 Nov 2026 (tahap `ide`). Catatan batas: host situs tertentu (tdk.com, patents.google.com, zojirushi.com) tidak bisa dibuka langsung dari sesi ini; isi dikutip dari ringkasan hasil pencarian. Pak Bima/Nadia: kutipan di bawah bukan kalimat penuh dari halaman asli.

**Pilar:** Benda & kebiasaan sehari-hari (Cara kerja) · **Skor Faktor Ternyata: 9/10** = Kejutan 2 (dikira ada "komputer"/timer, ternyata magnet + pegas) · Kedekatan 3 · Bukti 2 (mekanisme kuat; angka suhu persis lemah, jadi dikunci "sedikit di atas 100 °C") · Visual 2 (penampang sederhana).
pengalaman bersama: rice cooker model biasa tiba-tiba "klik" pindah dari cook ke warm. · pertanyaan pengalaman: "Kamu tim apa: langsung dibuka pas klik, atau didiamkan dulu?" (jawaban cerita pribadi).

## Uji 5 pertanyaan
1. Anggapan: rice cooker "pintar", ada timer/komputer yang menghitung waktu masak.
2. Fakta: model biasa hanya punya saklar termal: magnet + bahan yang kehilangan magnetnya di suhu sedikit di atas titik didih air + pegas.
3. Kenapa: lihat rantai di bawah.
4. Hubungan: "klik" yang kamu dengar tiap masak nasi = pegas melepas saklar.
5. Kejutan kedua: Toshiba ER-4 (1955) mengajarkan rumah tangga Jepang; 1960 ±separuh rumah tangga Jepang pakai (lihat fakta 5). Kejutan alternatif: model mahal (MICOM/fuzzy) memakai elektronik, bukan magnet.

## Anggapan umum → fakta
Anggapan: "rice cooker tahu nasi matang karena ada timer/komputer." Fakta: model konvensional tanpa mikrokontroler hanya mendeteksi satu hal, panci tidak lagi tertahan di suhu didih air. Zojirushi menyebut model konvensional = termostat sederhana: panaskan, deteksi air habis, ganti mode (blog Zojirushi "Back to Basics: Conventional Rice Cookers", versi MICOM dibedakan).

## Rantai mekanisme (kunci tiap mata rantai)
1. **Panas menaikkan suhu air → mendidih, suhu panci tertahan ±100 °C selama masih ada air bebas.** Energi dipakai mengubah air jadi uap (panas penguapan), bukan menaikkan suhu. Sumber: Zojirushi (blog + dukungan: termostat mendeteksi suhu naik di atas 212 °F), HowStuffWorks "Rice cooker" (kedua: penjelasan umum, air menahan suhu di titik didih).
2. **Nasi menyerap air + sebagian menguap → air bebas habis → suhu dasar panci naik melewati titik didih.** Sumber: Zojirushi, HowStuffWorks. (Yang sama menjawab "kenapa baru lewat 100 °C setelah air habis".)
3. **Di bawah panci ada sensor: bahan feromagnetik (ferit) yang menahan magnet pada saklar melawan tarikan pegas.** TDK Tech Mag (ferit di bawah panci, magnet ditarik pegas begitu ferit kehilangan magnet); paten Hitachi JPS6040176Y2 (magnet penahan melawan pegas oleh anggota magnetik yang permeabilitasnya turun tajam pada suhu tertentu).
4. **Pada suhu Curie ferit kehilangan sifat magnet (feromagnet → paramagnet) → gaya tahan hilang → pegas menarik saklar lepas → pemanas utama putus.** Fisika titik Curie: Britannica "Curie point"; Wikipedia "Curie temperature" hanya petunjuk. Titik Curie ferit bisa diatur lewat komposisi (paten saklar ferit; tabel ferit: 300–675 °C untuk berbagai jenis murni, tapi ferit khusus saklar dibuat lebih rendah).
5. **Mode warm:** setelah saklar utama lepas, pemanas menyala daya kecil lewat jalur lain. Cara persisnya BERBEDA tiap model (paten lama: dua relai, satu besar-satu kecil, kadang bimetal; model lain thermistor/pemanas kecil). Sumber: paten US4241288A (pemanas ganda + bimetal), Zojirushi (keep warm lewat kontrol suhu). **Jangan sebut satu cara untuk semua.**

## Soal suhu ±103 °C (diminta Bos/Bank ide)
- **Belum terverifikasi.** Tidak ada sumber yang menyebut 103 °C. Yang ada: "sedikit di atas titik didih" (Kottke, ringkasan), "±220 °F ≈ 104 °C" (satu situs pendukung, lemah), "212 °F" (Zojirushi, ambang deteksi), dan 100 °C (blog). Paten memakai contoh angka lain (130 °C) untuk komponen tertentu.
- Putusan: naskah pakai **"sedikit di atas 100 °C"**. Jangan "103", jangan "100 persis". Alasan alami: ferit harus sedikit di atas titik didih supaya tidak lepas saat air masih mendidih.

## Detail konkret jarang dikutip
- Toshiba ER-4 dirilis 10 Des 1955 (sebagian sumber 1956), rice cooker otomatis rumah tangga pertama; dikembangkan Shogo Yamada (mulai 1951), terobosan dari Yoshitada Minami; desain panci berlapis (pemanasan tidak langsung); sebulan 200.000 unit; 1960 ±separuh rumah tangga Jepang punya. (IEEE Spectrum; Toshiba Science Museum; Japan Times. Nama "Mitsumasa Yamada" TIDAK ditemukan, jangan dipakai.)
- Safety interlock: saklar tak bisa ke "cook" kalau panci tidak duduk di atas pegas (satu sumber tulisan mahasiswa tentang Zojirushi NHS-10, lemah, jangan pakai).

## Diperdebatkan / tidak seragam
- Bagian mana yang ferit: sebagian forum bilang pegas/penarik yang melewati titik Curie, TDK menyebut ferit di bawah panci. Untuk naskah: "sebuah keping magnetik di bawah panci" cukup, tanpa menyebut mana magnet permanen.
- Ketinggian: UMD menyebut termostat 100 °C tidak cocok di dataran tinggi (satu sumber, tidak dikunci). Jangan dipakai.

## Yang TIDAK boleh diklaim
- "103 °C" atau suhu pasti apa pun untuk tiap merek.
- "Semua rice cooker memakai magnet/Curie" (MICOM, fuzzy, induksi memakai elektronik).
- "Warm = bimetal" atau satu mekanisme warm untuk semua model.
- Tips memperbaiki/membongkar/mengakali saklar (listrik).
- "Nasi pasti gosong kalau lewat 100 °C" atau klaim kesehatan nasi hangat berjam-jam.
- Nama "Mitsumasa Yamada"; tahun ER-4 sebut "1955" dengan "sekitar".

## Fakta cadangan (komentar tersemat)
Rice cooker mewah (MICOM) pakai sensor suhu + mikrokontroler yang mengatur tahap masak; yang di rumahmu mungkin cuma pegas dan magnet. (Zojirushi, "Back to Basics: What is MICOM")

## Bahan video panjang
Rantai: dari panci biasa → termostat → MICOM → induksi → ER-4 1955 Jepang → "kenapa Jepang menciptakan rice cooker" (cek sumber lagi). Bab "air jadi alat ukur suhu" (panas penguapan).

## Sumber
- Zojirushi, Back to Basics: Conventional Rice Cookers — https://www.zojirushi.com/blog/back-to-basics-conventional-rice-cookers/
- Zojirushi, Back to Basics: What is MICOM — https://www.zojirushi.com/blog/back-to-basics-what-is-micom-and-what-does-it-do/
- TDK Tech Mag, The Wonders of Electromagnetism (thermal sensors) — https://www.tdk.com/en/tech-mag/inductive/thermal-sensors
- Paten JPS6040176Y2, 電気炊飯器 (Hitachi) — https://patents.google.com/patent/JPS6040176Y2/en
- Paten US4241288A, Electric rice cooker with two heaters — https://patents.google.com/patent/US4241288A/en
- Britannica, Curie point — https://www.britannica.com/science/Curie-point
- HowStuffWorks, How Rice Cookers Work — https://home.howstuffworks.com/rice-cooker.htm
- IEEE Spectrum, Toshiba rice cooker — https://spectrum.ieee.org/toshiba-rice-cooker
- Toshiba Science Museum, Ichigoki: Rice cooker — https://toshiba-mirai-kagakukan.jp/a-guide/en/history-zone/ichigoki/cooker.htm
- Petunjuk (bukan bukti): Kottke — https://also.kottke.org/24/01/the-clever-engineering-trick-that-allows-simple-rice-cookers-to-perfectly-cook-rice · fuzzylogicricecooker.com (±220 °F) · UMD fia.umd.edu/?p=9799
