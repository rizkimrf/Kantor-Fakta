# Cetak Biru Studio Remotion — untuk Kiki (dibangun & diuji di laptop Bos)

Tujuan: membuat video kartun motion-graphic TANPA layanan gambar/video AI berbayar. Semua visual dibuat
dengan kode (Remotion), maskot Tebe dari `studio-aset/tebe.js`, suara dari mesin suara yang dipilih di `.env`.

Catatan lisensi: Remotion gratis untuk perorangan dan tim sampai 3 orang. Channel ini dijalankan atas nama
pribadi Bos. Jika suatu saat dijalankan atas nama perusahaan (4 orang atau lebih), wajib beli lisensi perusahaan.

## 0. Aturan membangun
- Baca dokumentasi resmi (https://www.remotion.dev/docs) sebelum memakai API; jangan menebak nama fungsi.
- Bangun bertahap, uji tiap tahap. Satu tahap gagal 3 kali → berhenti, laporkan ke Bos apa yang gagal dan pilihan jalan keluarnya.
- Jangan mengubah bentuk/warna Tebe. Jangan menaruh kunci API di dalam folder `studio/`.
- Semua teks di layar Bahasa Indonesia. Semua komentar kode Bahasa Indonesia.

## 1. Prasyarat (cek dulu, laporkan jika belum ada)
- Node.js LTS (`node --version`). Belum ada → minta Bos menjalankan: `winget install --id OpenJS.NodeJS.LTS -e --source winget`
- ffmpeg & Python sudah terpasang.

## 2. Struktur
```
studio/                    proyek Remotion (React + TypeScript)
  src/Tebe.tsx             komponen maskot (membungkus studio-aset/tebe.js; props: ekspresi, bicara, kedip, tanda, goyang)
  src/adegan/*.tsx         satu file per jenis adegan (lihat §4)
  src/Video.tsx            menyusun adegan + subtitle + musik dari props
  src/Root.tsx             komposisi "Shorts" 1080x1920 30fps dan "Panjang" 1920x1080 30fps
  render.mjs               pintu masuk: node studio/render.mjs antrean/<folder>
  contoh/                  salinan studio-aset/contoh-naskah.json + hasil uji
```

## 3. Antarmuka (kontrak dengan tim lain — jangan diubah)
`node studio/render.mjs antrean/<folder>`
- Membaca `naskah.json` dan `audio/adegan_N.mp3` (durasi tiap adegan = durasi audionya + 0,25 detik; ukur dengan ffprobe).
- Jika file audio sebuah adegan tidak ada → hentikan dengan pesan jelas (bukan membuat video bisu).
- Menghasilkan `final.mp4` (H.264 + AAC, -14 LUFS, yuv420p) dan `thumbnail.png`
  (Shorts 1080x1920; Panjang 1280x720) di folder video itu.
- Kode keluar 0 jika sukses. Setelah sukses, `python scripts/cek_video.py antrean/<folder>` harus LULUS.

## 4. Jenis adegan (`adegan[].jenis_adegan` + `adegan[].data` di naskah.json)
| jenis_adegan | data | Tampilan |
|---|---|---|
| `hook` | `{teks_besar}` | Tebe di tengah (ekspresi dari `tebe`), teks besar muncul per kata |
| `angka` | `{nilai, satuan, label}` | angka menghitung naik, label di bawah |
| `peta` | `{lokasi:[{nama, lat, lon}], garis}` | peta dunia/Indonesia sederhana, pin jatuh, garis perjalanan |
| `perbandingan` | `{kiri:{label,nilai}, kanan:{label,nilai}}` | dua batang/ikon berdampingan sesuai skala |
| `garis_waktu` | `{titik:[{tahun,label}]}` | garis waktu bergeser, titik menyala berurutan |
| `arsip` | `{berkas, kredit}` | gambar domain publik di `aset/arsip/` dengan efek gerak + kredit kecil |
| `daftar` | `{poin:[...]}` | maksimal 3 poin muncul satu per satu |
| `kutipan` | `{teks, sumber}` | kutipan dengan tanda petik besar |
| `tebe` | `{teks}` | Tebe besar bereaksi + balon kata |
| `penutup` | `{}` | Tebe bangga, jambul "?" berubah "!", kalimat khas channel |
Semua adegan menerima `tebe: {ekspresi}` opsional: Tebe kecil di pojok kanan bawah (sepertiga lebar).
Jenis tidak dikenal → pakai `tebe` dengan `teks_layar`, dan catat peringatan.

## 5. Aturan tampilan (ringkas; lengkapnya di `panduan/gaya-animasi.md`)
- Palet: kuning #FFC93C, teal #1F8A8A, krem #FFF4DC, hitam #1E1E1E. Font Poppins (tebal) — bundel dari `aset/font/`.
- Ganti visual tiap 1,5–3 detik; transisi 0,2–0,4 detik ease-in-out; latar tidak pernah polos-diam (gradasi halus/ornamen bergerak pelan).
- Tebe: mulut mengikuti suara (amplitudo audio; cadangan: gelombang sinus selama audio berbunyi), kedip tiap 3–4 detik,
  jambul memantul saat mulai bicara, masuk dari bawah di adegan `hook`.
- Subtitle: 3–4 kata per potong, sinkron proporsional dengan durasi audio; kata KAPITAL di `narasi` berwarna kuning.
- Area aman Shorts: tidak ada elemen penting di 15% bawah dan 12% kanan.
- Musik: satu lagu acak dari `aset/musik/` bila ada, volume ±12%, fade-out 1,5 detik.
- Efek suara: tidak wajib di versi pertama.

## 6. Mesin suara gratis: `scripts/suara_windows.py`
- Dipakai bila `.env` berisi `MESIN_SUARA=windows` (scripts/suara.py sudah meneruskan ke skrip ini).
- Pakai suara Bahasa Indonesia bawaan Windows. Daftar dulu suara yang terpasang; kalau tidak ada suara id-ID,
  berhenti dan beri tahu Bos cara memasangnya (Settings → Time & language → Language & region → tambah
  Bahasa Indonesia, centang Text-to-speech), jangan diam-diam memakai suara bahasa lain.
- Terapkan `pelafalan` dari naskah.json dan ubah kata KAPITAL jadi huruf kecil sebelum dibacakan (lihat fungsi di scripts/suara.py).
- Keluaran: `audio/adegan_N.mp3` (lewati yang sudah ada). Tempo mengikuti `panduan/gaya-suara.md`.
- Jujur soal mutu: laporkan ke Bos kalau suaranya terdengar kaku; pilihan peningkatan adalah ElevenLabs berbayar.

## 7. Urutan kerja & uji terima
1. Buat proyek `studio/`, pasang dependensi, pastikan `npx remotion --help` jalan.
2. `Tebe.tsx` + satu adegan `hook` → render 3 detik → lihat hasilnya (ambil 1 frame, periksa Tebe utuh & tidak terpotong).
3. Semua jenis adegan + subtitle + musik.
4. `suara_windows.py` → buat audio untuk `studio-aset/contoh-naskah.json` (salin ke `antrean/uji-studio/`).
5. `node studio/render.mjs antrean/uji-studio` → `cek_video.py` LULUS.
6. Simpan 4 frame pratinjau ke `studio/contoh/pratinjau/` dan laporkan ke Bos: durasi render, ukuran file,
   hal yang masih kurang, dan saran perbaikan. Ubah `antrean/uji-studio/status.json` ke `menunggu_persetujuan`
   supaya Bos bisa menonton hasil uji lewat tombol "Tinjau video".
7. Pastikan `.env` berisi `STUDIO=remotion` dan `MESIN_SUARA=windows` (tambahkan baris bila belum ada; jangan sentuh baris lain).

## 8. Standar gaya (disetujui Bos, 15 Nov 2026) — WAJIB
- **Tebe = versi asli** (`studio-aset/tebe.js`), dianimasikan lewat **`studio-aset/tebe-rig.js`** (kerangka gerak):
  `tebeAnimasi([{t, pose, transisi, bicara:[a,b], jalan:[a,b], loncat:true, tanda:"!"}])` → `tebeRigSVG(param)`.
  Pose: netral, penasaran, kaget, menjelaskan, tertawa, bingung, bangga, melambai, berpikir, menghitung, sedih.
  Perpindahan pose selalu dihaluskan; kedip, napas, goyang badan, dan pegas jambul otomatis. Jangan menggambar Tebe dengan cara lain.
- **Intro khas** (setelah hook, ±1 detik): lingkaran kuning-teal, jambul "?" tergambar, "Ternyata Begitu!" + jingle naik & "ding".
- **Outro khas**: Tebe pose bangga di lingkaran kuning, latar sinar teal, jambul "?" → "!", "Ternyata Begitu!" + "ding" ganda.
- **Isi video**: gaya datar tanpa garis hitam untuk SET (Tebe tetap bergaris), aset dari **`studio-aset/aset-set.js`**
  dengan palet `PALET.siang | senja | malam`. Set dibuat lebih lebar dari layar (≥1500 px) lalu kamera menyapu/dorong.
- Tiap adegan: satu set berbeda, minimal satu gerak kamera, Tebe ikut berada DI DALAM set (berjalan/bereaksi), bukan tempelan.
- Teks: label kecil kapital + judul Inter Display tebal; siang = teks gelap + stabilo kuning, malam = teks terang + aksen Lora miring kuning.
- Tebe di adegan malam diredupkan sedikit (brightness 0.88) supaya menyatu dengan cahaya set.
- **Sumber tidak ditampilkan di video** — tulis di deskripsi.
- Referensi implementasi lengkap: `studio-aset/contoh-v5/v5.html` (komodo, 17 detik).
