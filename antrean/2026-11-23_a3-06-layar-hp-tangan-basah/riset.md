# Riset A3-06: Kok layar HP jadi kacau kalau kena air / tangan basah?
Jalur A "Kok Bisa Jalan?" · Pilar: Cara kerja (benda sehari-hari) · Disusun Laras, 22 Nov 2026
Arahan: Shorts maks 60 dtk → 1 mekanisme inti + 1 "tapi". Tanpa merek, tanpa saran perbaikan HP.

pengalaman bersama: Habis cuci piring/wudu/kehujanan, layar HP bergerak sendiri, menggulir sendiri, atau tidak mau diketuk.
pertanyaan pengalaman: "Layar HP-mu paling sering ngadat gara-gara apa: tangan basah, keringat, atau hujan?" (jawab 1 kata)

## Uji 5 pertanyaan
1. Anggapan umum: layar HP merasakan TEKANAN jari, jadi air yang menempel "ikut menekan" dan bikin kacau.
2. Fakta pembalik: layar HP modern tidak merasakan tekanan sama sekali; ia merasakan perubahan LISTRIK (muatan) di kisi kabel transparan di bawah kaca. Air dibaca listrik juga.
3. Kenapa: lihat mekanisme.
4. Hubungan: "jadi itu sebabnya layarmu salah baca setelah cuci tangan/kehujanan."
5. Kejutan kedua: air tetes sendirian sering malah diabaikan; masalah besar muncul saat air menyatu dengan jarimu (jari basah) atau air menetes panjang melintasi banyak kabel.

## Skor Faktor Ternyata: 8/10
Kejutan 2 (anggapan "tekanan" cukup kuat dibalik) · Kedekatan 3 · Bukti 1 (sumber utama paten/dokumen teknis + media sains; teks penuh belum bisa dibuka, lihat catatan) · Visual 2 (kisi, medan listrik, tetes air bisa digambar).

## Klaim inti
Layar sentuh HP adalah sensor listrik (kapasitif), bukan sensor tekan. Air mengubah sinyal listrik di layar mirip jari, jadi layar bisa salah mengira ada sentuhan.

## Mekanisme (rantai Jalur A, 4 langkah, gampang digambar penampang)
1. Di bawah kaca ada kisi kabel transparan (baris dan kolom). Tiap perpotongan menyimpan sedikit muatan listrik, membentuk medan listrik tipis yang menembus kaca.
2. Jari (tubuh kita sebagian besar air dan menghantarkan listrik) menyerap sebagian muatan itu di titik tersentuh. Layar mencari titik di mana sinyal turun = "di situ jarinya".
3. Masalah: tetes air juga mengubah sinyal. Dalam mode baca "antar-perpotongan" (mutual), jari menurunkan kopling, sedangkan tetes air menaikkannya. Dua efek berlawanan ini bisa saling meniadakan sentuhan asli, atau menciptakan titik palsu.
4. TAPI: HP sudah punya siasat. Mode baca lain (self) mengukur tiap kabel terhadap "tanah" dan cenderung mengabaikan air yang tidak terhubung ke tanah. Kelemahan mode ini: bingung bila sentuhan lebih dari satu (muncul titik hantu). Karena itu HP menggabungkan dua mode lewat firmware. Namun jari basah atau tetes yang menyentuh jarimu tersambung ke tubuhmu (tanah), sehingga air ikut terbaca sebagai bagian sentuhan. Itu sebabnya layar tetap bisa kacau.

Fakta pendukung (masing-masing dengan sumber):
- Air menaikkan kopling antar kabel, jari menurunkannya; keduanya berlawanan sehingga bisa saling mengacaukan. (Paten US 9864468 "Multi-touch integrity sensing for capacitive touch screen"; Paten US 12189899 "Touch sensing with water rejection"; juga ringkasan AIP Inside Science.)
- Mode self lebih tahan air, tetapi punya sentuhan hantu saat multitouch dan lokasi kurang presisi. (Paten US 10209828 "Systems and methods for water detection by touchscreen panels"; Paten US 10365764 "Water rejection for capacitive touch screen".)
- Air yang tersambung ke tanah lewat jari bisa tampak sebagai bagian sentuhan; tetes di tepi layar yang menyentuh bodi logam bisa terbaca sebagai ketukan/geseran. (Paten US 12189899.)
- Pola sinyal air punya "tanda tangan" khas (naik-turun berbeda dari jari/telapak), dipakai untuk menolak air; paten Elo Touch (US 20200042154) mencatat tetesan panjang (aliran) di banyak elektroda sebagai kasus sulit. (Paten US 11269455; US 20200042154.)
- Prinsip yang sama dipakai pada tombol sentuh produk lain: elektroda "pelindung" dialirkan sinyal yang sama agar air tidak menghasilkan sentuhan palsu. (Dokumentasi Microchip "Driven Shield" dan Renesas CTSU2.)

## Detail konkret
- Pembeda tubuh: tubuh manusia "sebagian besar air" yang menghantarkan listrik, jadi jari ibarat tetes air berukuran besar yang tersambung ke tanah (AIP Inside Science; Mental Floss).
- Satu fakta jujur: tetes air yang "mengambang" (tidak tersambung ke tanah) paling mudah diabaikan; jadi tetes tunggal di layar sering tidak bikin masalah, jari basah yang bikin.

## Bagian yang diperdebatkan / tidak seragam
Tiap pabrikan HP memakai firmware penolak-air yang berbeda dan tidak dibuka ke publik; tingkat ketahanan air bervariasi antar HP. Naskah jangan menyebut satu cara "yang dipakai semua HP".

## Kejutan (≤ dtk 20 untuk hook/awal)
"Layar HP-mu sama sekali tidak merasakan tekanan jarimu. Ia merasakan listrik, dan air dianggap jari." (Dasar: AIP Inside Science; paten di atas.)
Kejutan akhir (setelah "tapi"): sentuhan hantu karena HP baca dua cara (self vs mutual) dan harus menggabungkan keduanya.

## Sudut Indonesia
Pengalaman umum: tangan basah habis wudu/cuci piring/kehujanan di motor ojol. Tidak ada klaim khusus Indonesia; jangan mengarang data lokal.

## TIDAK boleh diklaim
- Jangan bilang "air menekan layar" atau "layar merasakan tekanan".
- Jangan bilang semua layar HP kapasitif identik; jangan sebut merek, tipe, atau fitur tahan air tertentu.
- Jangan klaim air murni tidak menghantarkan sehingga aman/ tidak aman; jangan klaim angka (volt, nanofarad) tanpa sumber.
- Jangan beri saran perbaikan HP (mengeringkan, mode sarung tangan, dll.) dan jangan nyatakan HP aman terkena air.
- Jangan menyebut "tetes air selalu dibaca sebagai jari"; yang benar: bisa, tergantung mode baca dan kondisi (tersambung ke tanah/tidak).

## Fakta cadangan (komentar tersemat)
Layar tidak cuma salah baca air: mode self-capacitance yang tahan air justru menghasilkan "titik hantu" bila ada dua jari. HP menggabungkan dua cara baca agar keduanya teratasi.

## Catatan batas verifikasi (jujur)
Host paten (USPTO), AIP, PopSci, Justia tidak bisa dibuka lewat fetch di sesi ini (jaringan dibatasi); isi dikutip dari ringkasan hasil pencarian yang memuat klaim paten dan artikel. Paten adalah klaim penemu, bukan uji lapangan: bahasa naskah cukup "umumnya" / "biasanya". Bila host diizinkan, Laras akan membuka teks penuh US 9864468, US 10209828, dan artikel AIP sebelum cek_fakta.

## Sumber
1. Multi-touch integrity sensing for capacitive touch screen (US 9864468): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9864468
2. Touch sensing with water rejection (US 12189899): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12189899
3. Systems and methods for water detection by touchscreen panels (US 10209828): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10209828
4. Water rejection for capacitive touch screen (US 10365764): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10365764
5. Water immune projected-capacitive (PCAP) touchscreen (Elo Touch, US 20200042154): https://patents.justia.com/patent/20200042154
6. Enhanced mutual capacitance touch screen display with noise compensation (US 11269455): https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11269455
7. Inside Science (AIP): Why Does Water Confuse My Touch Screen? https://www.aip.org/inside-science/why-does-water-confuse-my-touch-screen
8. Popular Science: Why Does A Drop Of Water Confuse My Touchscreen? https://www.popsci.com/why-does-drop-water-confuse-my-touchscreen/
9. Mental Floss: What Happens When Water Comes in Contact With Your Touchscreen: https://www.mentalfloss.com/science/what-happens-when-water-comes-contact-your-touchscreen
10. Microchip, Driven Shield for Touch: https://developerhelp.microchip.com/xwiki/bin/view/applications/touch/driven-shield/
