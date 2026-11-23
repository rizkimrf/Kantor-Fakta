# Riset — A3-01 Barcode kasir (jalur A "Kok Bisa Jalan?", Shorts ≤ 60 dtk)
Pilar: Benda & kebiasaan sehari-hari. Tanggal riset: 23 Nov 2026 (Laras).
pengalaman bersama: Kasir minimarket "bip" ke garis-garis di bungkus mie, harga langsung muncul di layar.
pertanyaan pengalaman: Kamu pernah jadi kasir, atau pernah lihat kasir "bip" berkali-kali karena barcode-nya bandel? Ceritain di komentar.

## Skor Faktor Ternyata: 8/10
Kejutan 2/3 (banyak orang kira harga "tertulis" di garis; sebagian sudah curiga) · Kedekatan 3/3 · Bukti 1/2 (lihat catatan akses di bawah) · Visual 2/2 (penampang sinar, garis, database).

## Uji 5 pertanyaan
1. Anggapan umum: garis-garis di bungkus itu menyimpan harga barangnya.
2. Fakta pembalik: barcode hanya membawa NOMOR pengenal produk (GTIN); harga diambil dari database toko saat dipindai.
3. Kenapa bisa: lihat mekanisme.
4. Hubungan: itu sebabnya harga bisa berubah/diskon tanpa stiker baru, dan satu barang bisa beda harga antar toko.
5. Kejutan kedua: 3 angka depan (899 = Indonesia) menunjukkan lembaga GS1 yang membagi nomor, BUKAN negara asal barang; digit paling kanan = digit cek yang menangkap salah baca.

## Rantai mekanisme (jalur A)
1. Scanner menyinari barcode; bar gelap menyerap cahaya, spasi terang memantulkan. Fotodioda menerima lebih/kurang cahaya.
2. Sinyal jadi pola on-off bertimer: lamanya "tidak ada pantulan" = lebar bar, lamanya pantulan = lebar spasi.
3. Pola lebar itu didekode jadi deretan angka. EAN-13: 95 modul sama lebar; tiap digit 7 modul berisi 2 bar + 2 spasi (lebar 1–4 modul); ada pola pelindung di tepi & tengah. Digit pertama tidak digambar sendiri, dikodekan lewat pola paritas 6 digit kiri.
4. TAPI angka itu cuma nomor produk (GTIN-13), bukan harga & bukan nama.
5. Digit terakhir = digit cek (modulo 10, bobot bergantian 1 dan 3) supaya salah baca ditolak, bukan salah harga.
6. Komputer kasir mencari GTIN di database toko, lalu menampilkan nama + harga di sana. Harga diubah di database = semua kasir langsung ikut.

## Fakta + sumber (tiap klaim utama ≥ 2 sumber)
- **Barcode tidak memuat harga/deskripsi, hanya pengenal unik** — GS1 FAQ resmi "Are the description and price of the item included in the barcode?" (https://support.gs1.org/support/solutions/articles/43000734158-are-the-description-and-price-of-the-item-included-in-the-barcode-); GS1 "How do GS1 GTINs and barcodes work?" (https://support.gs1.org/support/solutions/articles/43000734095-how-do-gs1-gtins-and-barcodes-work-); GS1 Australia FAQ (https://www.gs1au.org/resources/faq/verified-by-gs1); Shopify (https://www.shopify.com/blog/how-do-barcode-scanners-work). Konsisten di semua.
- **Bar menyerap, spasi memantul; fotodioda → pola waktu** — Shopify (url di atas); paten AS 5151580 "Light emitting diode scanner" (https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/5151580); Explain That Stuff (https://www.explainthatstuff.com/barcodescanners.html).
- **Struktur EAN-13 (95 modul, 7 modul/digit, 2 bar+2 spasi, digit cek mod 10 bobot 1/3)** — Wikipedia "International Article Number" (https://en.wikipedia.org/wiki/International_Article_Number); GS1 UK panduan digit cek (https://www.gs1uk.org/sites/default/files/how_to_calculate_your_check_digit.pdf); Seagull Scientific (https://barcodeguide.seagullscientific.com/Content/Symbologies/EAN_JAN_13.htm).
- **899 = prefiks GS1 Indonesia; prefiks BUKAN negara asal produk** — GS1 "Prefixes" (https://gs1.org/prefixes: perusahaan bisa memproduksi di mana saja, prefiks tidak menunjukkan negara asal); Wikipedia "List of GS1 country codes" (https://en.wikipedia.org/wiki/List_of_GS1_country_codes). GS1 Indonesia (gs1id.org) satu-satunya pengalokasi nomor di Indonesia — sumber lokal pihak ketiga, jangan dipakai sebagai klaim utama.

## Nuansa wajib (jangan diklaim mutlak)
- **Kode timbangan/variabel (prefiks 20–29)**: struktur 20–29 ditentukan masing-masing organisasi GS1 negara. Contoh GS1 UK: kode 13 digit bisa memuat referensi item, digit verifikasi harga, dan harga (untuk barang berat/harga bervariasi, mis. daging/buah ditimbang; kode "in-store" khusus satu jaringan ritel). Di Indonesia: belum terverifikasi cara pakainya, jangan sebut. Sumber: GS1 UK (https://gs1uk.org/knowledge-hub/barcodes/how-to-barcode-variable-measure-items); GS1 Summary of Prefixes 20–29 (https://www.gs1.org/docs/barcodes/SummaryOfGS1MOPrefixes20-29.pdf).
- **QR/2D di kasir** bisa memuat data tambahan (GS1 "2D in retail", https://ref.gs1.org/guidelines/2d-in-retail/). Naskah cukup bilang "barcode batang (garis) di kemasan biasa".
- Kalimat aman untuk naskah: "Barcode di kemasan biasa cuma membawa NOMOR produk. Harganya diambil kasir dari database toko." Hindari "barcode TIDAK PERNAH memuat harga".

## Sudut Indonesia
Bungkus mie instan/snack di minimarket; awalan 899 di barcode produk yang dijual di sini (teliti: itu tanda pendaftar nomor di Indonesia, bukan "buatan Indonesia"). Harga bisa beda tiap minimarket padahal barang sama = konsekuensinya.

## Yang TIDAK boleh diklaim
- "Barcode tidak pernah memuat harga" (kode timbangan/variabel & 2D pengecualian).
- "899 = diproduksi di Indonesia" (salah menurut GS1).
- Arti angka pengenal produk dalam digit (kode pabrik vs item) tanpa sumber; jumlah digit nomor perusahaan beragam.
- Cara scanner di Indonesia (laser vs kamera) — tidak ada data; sebut "scanner" saja. Kamera/imager membaca gambar, bukan satu titik laser; gambaran "sinar menyapu" benar untuk laser, sebut "umumnya".
- Estimasi 14 hari pengurusan GS1, biaya, kelebihan "wajib barcode" UMKM = tidak diverifikasi, jangan dipakai.

## Bagian yang diperdebatkan
Tidak ada di inti. Hanya variasi istilah (paritas L/G vs ganjil/genap); tidak untuk naskah.

## Detail konkret / kejutan cadangan
- 95 modul, 7 modul per digit; digit pertama "disembunyikan" di pola paritas (cocok untuk komentar tersemat).
- Contoh hitung digit cek (Wikipedia): 400638133393 + digit cek = 1 (jumlah berbobot 89 → 90 − 89 = 1).
- Bobot digit cek bergantian 1 dan 3 → salah baca satu angka hampir pasti terdeteksi.

## Bahan video panjang
Tema "Dapur/minimarket": barcode, pintu otomatis (A3-02), dsb. Atau "Dari rak sampai kasir": GTIN, database harga, kode timbangan, QR 2D. Perlu riset baru tentang 2D di ritel Indonesia.

## Catatan akses (jujur)
Sesi ini hanya mengizinkan pencarian web; WebFetch ke gs1.org, support.gs1.org, gs1au.org, wikipedia, shopify, explainthatstuff gagal (domain tidak diizinkan). Klaim di atas didukung ringkasan hasil pencarian yang menyebut URL tersebut, TETAPI teks halaman belum dibuka langsung. Skor Bukti diturunkan ke 1/2. Rekomendasi: Pak Bima/Nadia JANGAN mengutip kata-kata persis; Laras cek ulang halaman GS1 FAQ (43000734158) di `cek_riset.md` bila akses jaringan dibuka.

## Daftar sumber
1. GS1 Support — Are the description and price of the item included in the barcode? https://support.gs1.org/support/solutions/articles/43000734158-are-the-description-and-price-of-the-item-included-in-the-barcode-
2. GS1 Support — How do GS1 GTINs and barcodes work? https://support.gs1.org/support/solutions/articles/43000734095-how-do-gs1-gtins-and-barcodes-work-
3. GS1 Australia FAQ https://www.gs1au.org/resources/faq/verified-by-gs1
4. GS1 Prefixes https://gs1.org/prefixes
5. GS1 UK variable measure https://gs1uk.org/knowledge-hub/barcodes/how-to-barcode-variable-measure-items
6. GS1 UK digit cek https://www.gs1uk.org/sites/default/files/how_to_calculate_your_check_digit.pdf
7. Shopify — How do barcode scanners work https://www.shopify.com/blog/how-do-barcode-scanners-work
8. Explain That Stuff https://www.explainthatstuff.com/barcodescanners.html
9. Paten AS 5151580 https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/5151580
10. Wikipedia — International Article Number https://en.wikipedia.org/wiki/International_Article_Number
11. Wikipedia — List of GS1 country codes https://en.wikipedia.org/wiki/List_of_GS1_country_codes
