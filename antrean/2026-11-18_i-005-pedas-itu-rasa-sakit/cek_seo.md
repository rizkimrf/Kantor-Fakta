# Cek SEO I-005 Pedas (Raka, 17 Nov 2026)
Dicek: naskah.json, naskah_suara.txt, unggah.json, paket_unggah.md terhadap seo.md + laporan/harian.md (17 Nov). Data volume pencarian: tanpa data (Semrush tidak tersedia). Aturan: tidak mengubah fakta, judul tidak menyesatkan.

## Sudah lolos (tidak perlu diubah)
- Kata kunci utama "pedas itu rasa apa" terucap di hook (mulai ±3 dtk, selesai ±4,8 dtk) dan tertulis di teks layar pertama "PEDAS = RASA APA?".
- Judul 51 huruf, kata kunci di depan, tidak membocorkan jawaban. Deskripsi: 2 kalimat pertama memuat kata kunci + turunan, ada sumber, 3 hashtag, ada "bukan nasihat kesehatan".
- Caption "Jawaban 90% orang salah" tidak dipakai: BENAR, jangan dikembalikan (angka tanpa sumber).
- Caption TikTok 124 huruf (<=150), IG 212 huruf. Hook sengaja bukan "tebak dulu" (keputusan Pak Bima); semangat tebak-dulu hidup di caption, sesuai harian langkah 1.
- Sampul (merah cabai + arang, Tebe tengah frontal) beda dari ketchup (ungu-plum + kuning, kiri bawah) dan micin (teal + pink, kanan bawah). Judul dan sampul mengulang kata "pedas rasa apa": diterima, karena itu kata kunci utama dan judul Shorts tampil terpisah dari frame 0.
- Share identitas ada di narasi ("kirim ke temanmu yang bilang belum pedas kalau belum keringetan") sesuai harian langkah 2.

## WAJIB (3)
1. **Kejutan burung mendarat terlalu lambat.** Harian langkah 3 dan lembar_tim menargetkan burung <=35 dtk. Hitung dari durasi adegan: adegan 1-6 = 35,8 dtk + intro 2,4 dtk, jadi kata "BURUNG" terucap di ±37-38 dtk (peta_retensi sendiri menaruh adegan 6 di 33,2-38,2; "33 dtk" di riwayat adalah awal kalimat, bukan kata kejutannya). Minta Nadia (satu kali kembali ke `naskah`) merapatkan durasi/peta tanpa mengubah fakta: adegan 4 berdurasi 9,4 dtk untuk ±21 kata (cukup ±7,5), adegan 3 dan 5 bisa dipangkas ±0,5-1 dtk. Target kata "BURUNG" <=35 dtk; ukur ulang pada audio asli saat produksi.
2. **Label sumber S3 tidak jujur.** Deskripsi menulis klaim "Nature, 1997" tetapi tautan "PubMed 9768840" menurut riset.md S3 adalah abstrak makalah sejawat 1998, bukan makalah Caterina 1997. Ganti label menjadi apa adanya (mis. "Tominaga dkk., Neuron 1998" bila Laras memastikan) atau ganti tautan ke makalah 1997. Raka tidak bisa memverifikasi sendiri (pubmed.ncbi.nlm.nih.gov tidak terjangkau dari sesi ini); serahkan ke Laras (cek_riset) lalu samakan di `unggah.json`, `naskah.json`, `paket_unggah.md`.
3. **Komentar tersemat membuat janji yang belum ada.** (a) "video panjang Minggu 19.00": folder video panjang I-020 belum ada di antrean; ganti jadi "video panjangnya menyusul di channel ini" sampai ada jadwal pasti. (b) "pendatang dari Amerika" ada di bank-ide I-020 tetapi belum menjadi klaim terverifikasi di riset.md I-005 (baris 32 hanya petunjuk); minta Laras konfirmasi dua sumber, kalau belum tulis "ternyata pendatang" saja. (c) `scripts/terbitkan.py` tidak membaca `komentar_tersemat`: komentar harus disematkan manual setelah tayang, catat di tugas Bos/Raka.

## SARAN (7)
1. Tag: tambahkan ejaan yang dipakai orang dan suara kita ("keringetan"): "sambal bikin keringetan", "kenapa keringetan makan pedas", plus "TRPV1", "Nobel 2021" (ada di seo.md, belum masuk tag).
2. Komentar & share: pemicu komentar skor 1 (naskah sendiri mengakuinya). Tambahkan pertanyaan dua kubu di komentar tersemat, mis. "Kamu tim keringetan atau tim kuat tanpa keringat?". Samakan ajakan IG dengan frasa narasi: "Kirim ke temanmu yang bilang 'belum pedas kalau belum keringetan'" (sekarang IG: "paling kuat makan sambal"). IG memakai 5 hashtag (batas bawah): tambah #cabai #kapsaisin.
3. Teks layar adegan 3 "LAPOR KE SARAF NYERI" muncul ±11,6 dtk, padahal "saraf nyeri" baru terucap ±16-17 dtk. Harian langkah 1: jawaban dibuka setelah detik 15, jadi tunda munculnya teks sampai kalimatnya terucap (catatan untuk Yoga).
4. Retensi: titik risiko ditinggal = adegan 8 Nobel (±47-57 dtk, datar setelah twist burung) dan adegan 9 yang 17 dtk. Pangkas Nobel ±1 dtk dan jaga tanpa ekor kosong setelah "pendatang" (keduanya sudah dicatat Nadia; pastikan terlaksana di final.mp4).
5. Suara: "Julius" ditulis polos sementara "David" ditulis fonetik ("Dei-vid"); tulis juga fonetik sesuai daftar pelafalan ("Ju-li-us") dan hapus koma pada "yang bilang, belum pedas kalau belum keringetan" supaya kutipan tidak terputus.
6. Kutipan layak potong/viral (untuk teks pin, quote, potongan): "Mulutmu nggak kebakar. Otakmu yang ketipu." · "Kebakarannya bohongan." · "Cabainya kayak milih sendiri siapa yang boleh makan."
7. Hook: kata kunci selesai di ±4,8 dtk, hampir menyentuh batas 5 dtk; jangan tambahkan jeda atau SFX "kres" yang menggeser kalimat "Jadi, pedas itu rasa apa?". Jam tayang 19 Nov 18.00 tetap dugaan; ukur share (>5?) dan rata-rata tonton (>30 dtk) sesuai target harian.

Status: WAJIB 1-3 dikembalikan ke Nadia (butir 1, 3) dan Laras (butir 2, 3b) satu kali; setelah itu lanjut ke `cek_fakta` (Pak Bima).
