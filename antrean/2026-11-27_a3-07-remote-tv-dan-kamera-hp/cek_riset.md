# Cek riset naskah A3-07 Remote TV & kamera HP · Laras, 26 Nov 2026
Hasil: LULUS. WAJIB = 0. Saran = 4.

## Klaim per adegan (naskah_suara.txt, teks layar, judul, deskripsi)
| Klaim | Status | Dasar |
|---|---|---|
| Ujung remote gelap tapi di kamera HP ada yang berkedip (hook) | Didukung (dihedge di adegan 6 + deskripsi) | Fakta 2, Sony, Edmund Optics |
| "Remote TV umumnya nembak cahaya, matamu nggak bisa lihat" | Didukung ("umumnya" sesuai riset) | UCL, Adafruit |
| "HP bisa, gara-gara ada yang bocor" | Didukung ("bisa", bukan "pasti") | UCL, Sony, Edmund Optics |
| Tombol -> kode, kedip cepat dari lampu di ujung; cahayanya inframerah | Didukung | HowStuffWorks, UCL |
| Tiap tombol polanya beda | Didukung | UCL, HowStuffWorks |
| Sensor TV baca kedipnya, lalu nurut | Didukung | Rantai 4 (Adafruit, SparkFun) |
| "Sandi Morse" | Didukung sebagai perumpamaan ("kayak") | UCL |
| Sensor kamera HP peka inframerah, dikasih filter biar warna wajar | Didukung | Sony, Edmund Optics, Naked Scientists |
| Filter nggak selalu sempurna, kedip lolos ungu/putih | Didukung | Sony, Edmund Optics |
| Tiap HP beda; kamera depan SERING lebih jelas | Didukung dengan hedge | Sony (tertulis di riset), Carolina, Instructables; ada panduan yang bertentangan, "sering" sudah benar |
| Deskripsi: remote pintar sering pakai radio; ruangan redup membantu | Didukung | Riset (nuansa kamera HP) |
| Judul 3 opsi, thumbnail "KOK KELIHATAN?" | Tidak menyesatkan | Video memang menampilkan kedip + hedge |
Tidak ada angka nm/kHz, "semua HP", Bluetooth/WiFi, tips servis di narasi. Sesuai daftar larangan riset.

## WAJIB
Tidak ada.

## Saran (tidak wajib)
1. Caption TikTok ("di kamera HP ada yang kedip") dan IG ("remote ngobrol sama TV pakai kedip cahaya") tanpa "umumnya/sering". Kalau muat, tambah "remote TV yang umum" atau "sering". Deskripsi YouTube sudah memuat hedge.
2. Adegan 5: kaca filter digambar kuning-hijau. Warna itu tidak ada di riset. Pakai kaca tipis netral supaya tidak jadi klaim warna.
3. Adegan 6: HP kedua dengan titik redup sudah bagus. Pertahankan, karena itu hedge visual "tiap HP beda".
4. Sumber Sony (lihat uji buka di bawah): kalau Bos tidak mau ada tautan yang kutipannya belum terbaca, pertahankan hanya klaim "sering" untuk kamera depan, jangan "Sony bilang".

## Fakta cadangan untuk komentar tersemat
Kedipnya dibawa "pembawa" cepat (umumnya sekitar 38 kHz pada protokol NEC) supaya sensor tidak tertipu lampu atau matahari. Sumber: Adafruit, SparkFun. Tulis "umumnya", bukan "semua remote". (Alternatif: beda merek remote = kode berbeda, UCL, 1 sumber.)

## Uji buka ulang sumber (26 Nov)
- Sony MY (00223964): TIDAK terbuka. Host www.sony.com.my tidak ada di daftar domain yang diizinkan sesi ini (WebFetch gagal ENOTFOUND).
- Lewat pencarian, ringkasan artikel Sony (sony.ca 00025283) terbaca. Isinya: kamera digital/camcorder/sebagian kamera HP bisa menampakkan IR; banyak HP punya filter IR yang mencegah tampilan meski remote normal; uji hanya andal bila sudah dicek dengan remote lain; beberapa remote Bluetooth hanya mengirim IR dari tombol power. Soal kamera depan vs belakang: TIDAK ditemukan di ringkasan ini. Jadi klaim "kamera depan sering lebih jelas" belum terkonfirmasi ulang dari Sony. Dasarnya tetap Carolina + Instructables (dari riset). Hedge "sering" sudah pas.
