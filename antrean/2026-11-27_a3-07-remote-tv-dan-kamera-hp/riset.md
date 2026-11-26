# Riset A3-07 — Remote TV & kamera HP (jalur A, slot Sab 28 Nov 13.00)
Pilar: Benda & kebiasaan sehari-hari (Cara kerja) · Laras, 26 Nov 2026
Catatan metode: WebFetch ke situs sumber diblokir jaringan sesi; isi diverifikasi lewat ringkasan hasil pencarian (judul + URL asli dicatat). Teks penuh BELUM dibuka, jadi kutipan persis tidak dipakai.

## Skor Faktor Ternyata: 9/10
Kejutan 2/3 (cahayanya ada tapi mata tak bisa lihat; kamera bisa) · Kedekatan 3/3 (semua orang punya remote + HP) · Bukti 2/2 (UCL, Sony support, Adafruit/SparkFun, HowStuffWorks) · Visual 2/2 (LED ujung remote, pulsa, sensor TV, layar HP).

## Uji 5 pertanyaan
1. Anggapan: remote "ngirim sinyal" gaib; kalau nggak ada cahaya yang kelihatan, berarti bukan cahaya. (Atau: remote mati = rusak.)
2. Fakta: remote TV mengirim KEDIP CAHAYA inframerah (tak terlihat mata); HP sering bisa menampakkannya di layar.
3. Kenapa: tiap tombol = pola kedip (kode) → LED inframerah di ujung remote → sensor TV mengubah kedip jadi sinyal listrik → prosesor TV menjalankan perintah.
4. Hubungan: remote mati? Arahkan ke kamera HP dulu — pengalaman nyata tiap rumah.
5. Kejutan kedua: kamera HP dibuat MEMBLOKIR inframerah (filter IR-cut) demi warna wajar, tapi bocor; kamera depan sering lebih lemah filternya.

pengalaman bersama: Remote TV ditekan tapi TV tak nyala, dan LED-nya tak kelihatan menyala apa-apa.
pertanyaan pengalaman (1 kata): "Remote TV kamu rebutan siapa? RAJA / ANAK / TAMU"; atau pilihan aksi: "Remote mati, kamu cek pakai: HP / GANTI BATERAI". Rekomendasi: UDAH TAHU vs BARU TAHU (sudah ada di bank ide).

## Rantai mekanisme (tiap mata rantai ≥ 2 sumber)
1. Tekan tombol → rangkaian tertutup, chip tahu tombol mana → mengirim kode biner ke LED. [HowStuffWorks "Infrared Remote Controls: Inside/Process"; UCL (via ringkasan: "LED yang berkedip sangat cepat... seperti kode Morse")]
2. LED memancarkan cahaya inframerah dekat; mata tak bisa lihat. Umumnya ±940 nm (Adafruit; SparkFun; angka "tipikal", bukan semua remote). [UCL: "IR, tak terlihat mata"; Adafruit]
3. Setiap tombol punya pola sendiri; merek berbeda memakai kode berbeda. Selain perintah, ada kode alamat perangkat agar tidak menyalakan alat lain. [UCL; HowStuffWorks; SparkFun/Adafruit (kode 32-bit di protokol NEC, hanya contoh satu protokol)]
4. Kedip dibawa pada "pembawa" ±38 kHz (NEC; RC5 36 kHz — protokol berbeda) supaya sensor mengabaikan cahaya lampu/matahari yang tetap. Sensor TV menyaring & menerjemahkan jadi sinyal listrik. [Adafruit; SparkFun; DigiKey Maker.io]. Visual cukup "kedip sangat cepat", jangan sebut angka kHz di narasi.
5. TAPI/kejutan: sensor kamera HP peka inframerah dekat; HP memasang filter IR-cut agar warna tidak melenceng, tetapi tidak selalu sempurna → kedip tampak di layar sebagai titik ungu/putih. [UCL ("kamera HP bisa menangkapnya"); Sony Support (Article 00159898 / 00223964); Edmund Optics (iPhone: ungu redup); Naked Scientists]

## Nuansa kamera HP (WAJIB di narasi)
- Hasil BEDA tiap HP: Sony support: "tergantung model smartphone (mis. iPhone), sinyal inframerah bisa tidak terlihat lewat kamera belakang, bisa terlihat lewat kamera depan"; sebagian kamera punya filter IR bawaan yang mencegah deteksi. Pakai kalimat "bisa", bukan "pasti".
- Kamera DEPAN sering lebih jelas: didukung Sony support (resmi), panduan kelas (Carolina), tes Instructables (iPhone 4 depan = putih terang). Ada panduan yang bertentangan (belakang lebih peka) → hanya tulis "sering", bukan "selalu".
- Kamar redup membantu (Sony/MakeTechEasier). Warna tampil ungu/putih/pucat, bukan "warna asli inframerah" (inframerah tak punya warna bagi mata; layar menampilkan respons sensor).
- Remote LED lemah / baterai lemah → titik makin redup; tapi JANGAN klaim ini sebagai alat uji pasti atau tips servis (tidak ada saran perbaikan).

## Sudut Indonesia
Remote TV tabung/LED di tiap rumah; "remote rebutan" + "remote dibungkus plastik" (jangan klaim hal bungkus plastik; hanya perumpamaan visual bila perlu). Tidak ada fakta khas Indonesia yang perlu dikunci. Tulis "tidak ada" secara sumber.

## Yang TIDAK boleh diklaim
- "Semua HP bisa melihat inframerah" / "pasti ungu" / "kamera depan selalu lebih jelas".
- Angka 940 nm / 38 kHz sebagai berlaku untuk semua remote (protokol beda; Sony bisa lain).
- "Remote pakai Bluetooth/WiFi" — banyak remote pintar memang RF, tapi remote TV umum IR; jangan campur (tulis "remote TV yang umum").
- Tips tes remote untuk diagnosis rusak/tidak sebagai nasihat teknis pasti; boleh sebagai "kamu bisa lihat kedipnya".
- Inframerah berbahaya/menyehatkan; "kamera tembus baju" dan sejenis (mitos viral inframerah) — jangan sentuh.
- Angka "jarak 10 m" tanpa sumber.

## Fakta cadangan (komentar tersemat)
Kedip dibuat "pembawa" ±38 kHz supaya sensor tak tertipu lampu/matahari (Adafruit/SparkFun). Atau: remote berbeda merek = kode berbeda (UCL).

## Sumber
- UCL, "How does a remote control work (TV)": https://www.ucl.ac.uk/engage/case-studies/2022/sep/how-does-remote-control-work-tv
- HowStuffWorks, Infrared Remote Controls: Inside / The Process: https://electronics.howstuffworks.com/remote-control1.htm · https://electronics.howstuffworks.com/remote-control2.htm
- Adafruit, IR Sensor: https://learn.adafruit.com/ir-sensor/overview
- SparkFun, IR Communication / IR Control Kit: https://learn.sparkfun.com/tutorials/ir-communication/all?print=1
- Sony Support (cek remote dengan kamera HP): https://www.sony.com.my/electronics/support/articles/00223964 · https://www.sony.co.in/electronics/support/televisions-projectors/kv-sz25m50/articles/00025283
- Edmund Optics, Infrared Light (transkrip): https://www.edmundoptics.com/knowledge-center/video/tutorials/infrared-light/
- The Naked Scientists, Seeing Remotes: https://thenakedscientists.com/get-naked/experiments/seeing-remotes
- Instructables (tes kamera depan iPhone 4): https://www.instructables.com/See-Infrared-LED-Light-with-an-iPhone-4
