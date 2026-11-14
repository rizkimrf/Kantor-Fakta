---
description: Siapkan video baru sampai naskah lolos cek fakta (belum memakai kredit suara/gambar). Contoh /video-baru 3 atau /video-baru 1 panjang
---
Argumen: $ARGUMENTS (jumlah, default 2; tambahkan "panjang" untuk video 16:9).
Untuk setiap video:
1. `python scripts/buat_video.py` → folder baru (tahap `ide`).
2. Delegasikan ke **riset** → **marketing** (tahap `pilih`, termasuk `seo.md`). Jika marketing menunda, buat ide pengganti.
3. **Rapat konten:** buat `lembar_tim.md` (format di `panduan/standar-konten.md` §4); minta riset, marketing, copywriting, dan editor mengisi barisnya masing-masing, lalu kamu putuskan hook & sudut.
4. **copywriting** menulis `naskah.json` + `naskah_baca.txt` mengikuti `lembar_tim.md` dan `seo.md`.
5. **marketing** cek SEO (`cek_seo.md`); **riset** memeriksa naskah terhadap `riset.md`. Butir wajib → kembali ke copywriting 1x.
6. Kamu (manajer) cek fakta → lulus: `tahap` = `produksi`; gagal: kembalikan ke copywriting dengan `catatan_manajer` (maks 2x).
Laporkan judul-judul yang siap diproduksi.
