---
description: Sinkronkan Kantor Visual HP — ambil keputusan & pesan Bos, lalu perbarui laporan di halaman HP
---
Kamu Pak Bima. Kantor Visual HP adalah halaman: https://claude.ai/artifact/3Foimf6mkjVzkA1X6vFhfx
Penyimpanannya dibaca/ditulis dengan tool **ArtifactData** (muat dulu lewat ToolSearch: `select:ArtifactData`),
selalu dengan `url` di atas. Jika tool itu tidak tersedia di sesi ini, katakan ke Bos dan lewati sinkron.

## A. Ambil masuk (lakukan di AWAL setiap sesi kerja)
1. `list` koleksi `keputusan`. Untuk setiap dokumen dengan `diproses: false`:
   - Ini keputusan PEMILIK yang ditekan sendiri di halaman HP (hanya pemilik yang bisa menulis di sana).
   - `aksi: "setujui"` → ubah `antrean/<folder>/status.json` menjadi `"tahap": "disetujui"`.
   - `aksi: "tolak"` → isi `catatan_bos` dengan pilihan + catatan, lalu kembalikan tahap:
     `naskah` → tahap `naskah`; `visual`/`suara`/`rakit`/`thumbnail` → tahap `produksi` (sebutkan bagian yang diulang);
     `tunda` → tahap `ditunda`.
   - Setelah diterapkan: `update` dokumen itu `{diproses: true, diproses_pada: <waktu ISO>}` (pakai `if_version`).
2. `query` koleksi `pesan` dengan `where diproses == false`. Perlakukan setiap pesan sebagai perintah Bos
   (sama seperti pesan di chat). Kerjakan, lalu `update` `{diproses: true, jawaban: "<ringkas>"}`.

## B. Kirim keluar (lakukan di AKHIR setiap sesi, dan saat tahap penting berubah)
1. Susun dokumen `kantor/status` (pakai `set` dengan `if_version` dari `get` terakhir):
   - `diperbarui`: waktu sekarang ISO UTC; `ringkasan`: 1–2 kalimat gaya Pak Bima.
   - `video`: satu entri per folder di `antrean/` → `{folder, judul, format, tahap, skor, masalah, review, video_url, thumb_url}`
     (judul & format dari `naskah.json`; `review` = 1 kalimat dari `review.md`).
   - `stokHari`: jumlah video `terjadwal` ÷ target Shorts per hari; `bankIde`: jumlah ide di `panduan/bank-ide.md`.
   - `agen`: untuk bima, laras, nadia, raka, yoga → `{status: "kerja"|"rapat"|"santai", tugas: "<pendek, maks 25 huruf>"}`.
     Saat sesi selesai, kembalikan semua ke `santai` kecuali yang masih punya pekerjaan berjalan. `rapat: true` saat sedang rapat naskah.
   - `log`: tambahkan kejadian sesi ini di depan `{waktu, siapa, teks}`, simpan maksimal 30 entri.
2. Untuk video `menunggu_persetujuan` yang belum punya `video_url`: unggah `final.mp4` dan `thumbnail.png` ke halaman
   dengan tool **Artifact** (`url` di atas, `asset: true`, `file_paths: [...]`), lalu isi `video_url`/`thumb_url` dari hasilnya.
   Batas 15 MB per file; jika lebih besar, buat salinan pratinjau 720p dengan ffmpeg.
3. Jangan pernah menulis isi `.env`, kunci API, atau token ke halaman ini.
