# Gaya Suara — "teman pintar yang enak didengar"

Target penonton: orang Indonesia 16–40 tahun, menonton di HP, sering sambil melakukan hal lain.
Suara harus jelas di speaker HP murah, tidak melelahkan, dan terasa seperti teman — bukan penyiar berita.

## Karakter suara (dipakai juga untuk memilih suara di ElevenLabs atau suara Windows)
- Hangat, ramah, sedikit tersenyum saat bicara; percaya diri tapi tidak menggurui.
- Nada tengah (tidak terlalu berat, tidak cempreng). Satu suara yang SAMA untuk semua video.
- Logat Indonesia netral (baku-santai), bukan logat daerah yang kental, bukan aksen asing.

## Tempo & artikulasi
- Tempo ±150–165 kata per menit (Shorts), ±140–150 (video panjang).
- Setiap suku kata jelas; akhiran kata tidak ditelan ("ternyata" bukan "ternyat").
- Jeda 0,3–0,5 detik sebelum fakta kejutan; jeda 0,2 detik antar adegan (sudah diatur editor).
- Penekanan pada SATU kata kunci per kalimat (kata yang ditulis kapital di naskah).

## Kosa kata (tanggung jawab Nadia; dicek Pak Bima)
- Pakai kata yang dipahami anak SMA: "gara-gara, ternyata, kira-kira, bayangin, coba pikir".
- Hindari: "dikarenakan, merupakan, adapun, signifikan, fenomena" (kecuali langsung dijelaskan).
- Nama asing ditulis cara bacanya di `pelafalan` (lihat di bawah) supaya pengisi suara tidak salah ucap.

## Kamus pelafalan (agent menambah bila ada nama sulit)
| Ditulis | Dibaca |
|---|---|
| Frankenstein | Frengken-stain |
| Mary Shelley | Meri Syeli |
| Tambora | Tambora |
| Krakatau | Krakatau |
| cabya (cabai jawa) | ca-bya |
| Columbus | Kolumbus |
| rice cooker | rais kuker |
| Curie (titik Curie) | kyu-ri |
| MICOM | mai-kom |
| warm (lampu) | wom |


## Pilihan sumber narasi (urutan prioritas, disetujui Bos 15 Nov 2026)
1. **Suara Bos sendiri.** Nadia menyiapkan `naskah_baca.txt` (naskah per adegan, tanda jeda `/`, kata yang ditekan dalam KAPITAL).
   Bos merekam di HP dalam satu kali baca. Yoga memotong per adegan berdasarkan jeda (ffmpeg silencedetect), membersihkan noise ringan, menyamakan volume (-14 LUFS).
2. **Suara AI berkualitas tinggi** (ElevenLabs) bila rekaman Bos tidak ada.
   **Suara resmi channel (dipilih Bos 15 Nov 2026): "Dakocan - Expressive, Cheerful and Clear"** (Voice Library, bahasa Indonesia),
   model **Eleven v4**, stability 50, similarity 75. Akun ElevenLabs paket Starter (lisensi komersial).
   Cara menulis teks untuk ElevenLabs (`naskah_suara.txt`, turunan dari `naskah_baca.txt`):
   - Tag emosi v4 di depan kalimat: `[excited]` untuk hook & penutup, `[laughs]` setelah candaan, `[whispers]` untuk bocoran kejutan, `[curious]` untuk "Kok bisa?". Maksimal 5 tag per Shorts.
   - Angka & singkatan ditulis seperti diucapkan: "2006" → "dua ribu enam", "ZZ" → "zet zet", "WW" → "we we". DNA boleh tetap "DNA".
   - Jeda pakai "..." (bukan "/"); hapus tanda KAPITAL.
   - Buat 2 versi, Bos/Pak Bima memilih yang terbaik. Suara ditaruh mengikuti waktu asli (jangan dipercepat); visual yang menyesuaikan suara.
   - Wajib centang label "konten sintetis/AI" saat unggah (YouTube, TikTok, Instagram).
3. Suara bawaan Windows/robot: hanya untuk uji internal, **tidak boleh ditayangkan**.

## Gaya narasi acuan — "ngobrol santai, bukan menggurui" (referensi dari Bos, 15 Nov 2026) — WAJIB
Acuan: video penjelasan bendungan yang dikirim Bos. Kesan yang dikejar: **enjoy, ada candanya, penonton merasa
diajak ngobrol teman, tidak digurui, tidak kebanjiran informasi.**

Contoh kalimat acuan (pola, bukan untuk disalin):
> "Kalau kamu tumpuk batu sama tanah di tengah sungai, kamu udah punya bendungan. Tapi sungainya ngalir terus.
> Baru numpuk dikit, tumpukannya kebawa arus. Jadi di samping sungainya kamu gali saluran, biar airnya lewat situ dulu.
> Namanya saluran pengelak."

Aturan turunan:
1. **Sapa "kamu", ajak penonton jadi pelakunya.** "Kalau kamu…", "coba kamu bayangin…". Bukan "manusia melakukan…".
2. **Bahasa sehari-hari:** udah, nggak, dikit, biar, kebawa, ngalir, gitu, ternyata. Bukan bahasa buku pelajaran.
3. **Alur "masalah → tapi → jadi":** tiap ide lahir dari masalah sebelumnya, sehingga penonton merasa menemukan sendiri jawabannya.
4. **Istilah belakangan.** Jelaskan idenya dulu pakai kata biasa, baru sebut namanya ("…namanya partenogenesis").
5. **Satu ide per kalimat, kalimat pendek** (maks ±12 kata). Maksimal **3 fakta inti per Shorts**; sisanya buang atau jadikan video lain.
6. **Mengalir nyaris tanpa jeda** (±150 kata/menit, jeda hanya di pergantian babak). Jangan ada kalimat pembuka kosong ("Halo teman-teman…").
7. **Canda ringan 1–2 kali per Shorts, 1 tiap ±45 detik di video panjang:** perbandingan lucu dengan hal sehari-hari orang Indonesia,
   reaksi jujur ("iya, serius"), atau melebih-lebihkan yang jelas bercanda. **Dilarang:** merendahkan orang/kelompok, SARA, candaan soal musibah.
8. **Jangan menggurui:** hindari "kamu harus tahu", "perlu diketahui", "jadi pelajarannya adalah". Biarkan faktanya yang bikin kagum.
9. **Teks di layar mengikuti suara:** 1–3 kata per potong, muncul bertambah seiring kata diucapkan, di tengah-bawah layar.
10. **Arahan untuk perekam suara (Bos atau AI):** senyum saat membaca, nada naik di pertanyaan, tekan kata KAPITAL, jangan seperti membaca berita.
