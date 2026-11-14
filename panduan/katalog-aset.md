# Katalog Aset & Keputusan Gaya — Ternyata Begitu
Disepakati Bos pada 15 Nov 2026. Baca ini SEBELUM membuat aset atau video baru.

## A. Keputusan gaya (jangan diubah tanpa izin Bos)
| Hal | Keputusan |
|---|---|
| Target penonton | 17–35 tahun → isi video tidak boleh kekanakan |
| Maskot | **Tebe versi asli** (chibi, jambul "?", hoodie mustard, celana teal, sepatu putih, garis hitam). Versi "dewasa" sudah DITOLAK. |
| Intro | Setelah hook (±detik 2,7): lingkaran kuning-teal, jambul "?" tergambar, "Ternyata Begitu!" + jingle naik + "ding" |
| Outro | Tebe pose bangga di lingkaran kuning, latar sinar teal, jambul "?" → "!", "Ternyata Begitu!" + "ding" ganda + "Ikuti untuk fakta berikutnya" |
| Isi video | Gaya datar seperti referensi Kok Bisa: set tanpa garis hitam, bayangan lembut, kedalaman lewat lapisan & kabut |
| Waktu | Tiap set punya versi siang / senja / malam; malam = biru tua lembut (bukan hitam) + cahaya hangat |
| Kamera | Set lebih lebar dari layar; tiap adegan minimal satu gerak kamera (sapu, dorong, mundur, masuk lewat jendela) |
| Tebe di set | Tebe berada DI DALAM set: berjalan, bereaksi, menjelaskan. Di malam hari diredupkan sedikit |
| Teks | Label kecil kapital + judul Inter Display tebal. Siang: teks gelap + stabilo kuning. Malam: teks terang + aksen Lora miring kuning |
| Sumber | Tidak tampil di video — tulis di deskripsi |
| Warna brand | Kuning #FFC93C · Teal #1F8A8A · Krem #FFF4DC · Hitam #1E1E1E |

## B. File aset (di `studio-aset/`)
| File | Isi | Cara pakai singkat |
|---|---|---|
| `tebe.js` | Bentuk resmi Tebe (6 ekspresi statis) | `tebeSVG({ekspresi})` — untuk gambar diam/thumbnail |
| `tebe-rig.js` | Kerangka gerak Tebe | `tebeAnimasi([{t, pose, transisi, bicara:[a,b], jalan:[a,b], loncat:true, tanda:"!"}])` lalu `tebeRigSVG(anim(t))` |
| `aset-set.js` | Pustaka set + palet | `ASET.PALET.siang/senja/malam`, lalu panggil aset di bawah |
| `contoh-v5/v5.html` | Contoh video lengkap (komodo, 17 dtk) | Salin strukturnya untuk video baru |
| `contoh-v5/pratinjau-*.png` | Lembar pose Tebe & set siang/senja/malam | Acuan visual |

**Pose Tebe (tebe-rig):** netral, penasaran, kaget, menjelaskan, tertawa, bingung, bangga, melambai, berpikir, menghitung, sedih.
Otomatis: kedip, napas, goyang badan, pegas jambul, mulut bicara.

**Aset set (aset-set.js):** langit (matahari/bulan/bintang), awan, burung, bukit, kabut, laut, tanah, lontar, pohon, semak, rumput, batu, pagar, lampuTaman, rumahReptil, kunangKunang, debuCahaya, komodo, telur, kromosom, studio (latar penjelasan).

**Aset brand (di `aset/brand/`):** logo-ikon (foto profil), logo horizontal terang/gelap, logo-tulisan, header YouTube 2560×1440, template kolaborasi, 7 pose Tebe PNG/SVG.

## C. Cara menambah aset baru (aturan Yoga)
1. Tambahkan sebagai fungsi baru di `aset-set.js` yang menerima palet `P` — jangan hard-code warna; pakai kunci palet (`P.daun`, `P.dinding`, `P.cahaya`, dll).
2. Gaya: bentuk datar, tanpa garis hitam, maks 2–3 nada per benda (dasar, bayangan, sorot), bayangan lantai `P.bayang`.
3. Benda yang bisa menyala (lampu, jendela, layar) memakai `P.jendelaNyala` agar otomatis menyala di malam hari.
4. Uji di tiga palet (siang, senja, malam) dan simpan pratinjaunya di `contoh-v5/` atau folder contoh baru.
5. Catat aset baru di tabel B file ini (nama + fungsi + satu baris cara pakai).
6. Pose Tebe baru: tambahkan ke objek `POSE` di `tebe-rig.js` (angka saja), jangan mengubah bentuk Tebe.

## D. Ide aset berikutnya (belum dibuat)
Kota & gedung, pasar tradisional, sawah, gunung api, laut dalam & ikan, luar angkasa & planet, ruang kelas, laboratorium detail, peta dunia/Indonesia bergaya datar, uang & koin, tubuh manusia (organ sederhana), rumah adat, kapal, pesawat.
