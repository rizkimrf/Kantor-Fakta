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
2. `list` koleksi `unggah_manual` (`diproses: false`): Bos menandai sudah mengunggah sendiri ke satu platform.
   Isi `terbit.<platform> = {id: "manual", waktu}` di `status.json` folder itu, lalu `update` dokumen `{diproses: true}`.
3. `query` koleksi `pesan` dengan `where diproses == false`. Perlakukan setiap pesan sebagai perintah Bos
   (sama seperti pesan di chat). Kerjakan, lalu `update` `{diproses: true, jawaban: "<ringkas>"}`.

## B. Kirim keluar (lakukan di AKHIR setiap sesi, dan saat tahap penting berubah)
1. Susun dokumen `kantor/status` (pakai `set` dengan `if_version` dari `get` terakhir):
   - `diperbarui`: waktu sekarang ISO UTC; `ringkasan`: 1–2 kalimat gaya Pak Bima.
   - `video`: satu entri per folder di `antrean/` yang tahapnya BUKAN `tayang` (video yang sudah tayang tidak ditampilkan lagi) → `{folder, judul, format, tahap, skor, masalah, review, video_url, thumb_url}`
     Untuk folder `disetujui`/`terjadwal` tambahkan juga: `jadwal_teks` (mis. "Sel 17 Nov 13.00 WITA"),
     `manual`: daftar platform yang `terbit.<platform>.catatan`-nya "unggah manual" dan belum punya `id`,
     `paket`: `{youtube:{judul, deskripsi}, tiktok:{caption}, instagram:{caption}}` dari `unggah.json` (deskripsi sudah berisi sumber + hashtag).
     Bos memakai ini di kartu "Perlu Bos unggah manual" (tombol Unduh video, Salin judul/caption, Sudah saya unggah).
     (judul & format dari `naskah.json`; `review` = 1 kalimat dari `review.md`).
   - `stokHari`: jumlah video `terjadwal` ÷ target Shorts per hari; `bankIde`: jumlah ide di `panduan/bank-ide.md`.
   - `agen`: untuk bima, laras, nadia, raka, yoga → `{status: "kerja"|"rapat"|"santai", tugas: "<pendek, maks 25 huruf>"}`.
     Saat sesi selesai, kembalikan semua ke `santai` kecuali yang masih punya pekerjaan berjalan. `rapat: true` saat sedang rapat naskah.
   - `log`: tambahkan kejadian sesi ini di depan `{waktu, siapa, teks}`, simpan maksimal 30 entri.
1b. **Laporan & perbaikan (Bos, 19 Nov)** — dokumen `kantor/laporan` (get dulu, lalu update dengan if_version). Diisi di sesi 17.47 (evaluasi harian)
   dan Senin (laporan mingguan); sesi lain hanya memindahkan item yang selesai. Field:
   `diperbarui`, `ringkasan` (1–2 kalimat), `fokus` [{teks, ukur}] = 3–5 langkah yang dipakai produksi berikutnya,
   `mingguan` {tanggal, poin[]} (Senin), `harus` [{teks, prioritas 1–3, pemilik, alasan, selesai}] = daftar perbaikan yang belum beres,
   `sudah` [{tanggal "21 Nov", teks, hasil}] = perbaikan yang sudah dikerjakan + HASILNYA dari data (isi `hasil` begitu angkanya ada, jangan dikarang),
   `metrik` [{nama, nilai, angka, target, target_teks}] (YouTube dulu), `uji_ab` [{jalur, views, tetap, ditonton, komen, share}].
   Saat item `harus` selesai: tandai `selesai: true` lalu pindahkan ke `sudah`. Simpan maks 30 item `sudah` terbaru.
2. Untuk video `menunggu_persetujuan` yang belum punya `video_url`: unggah `final.mp4` dan `thumbnail.png` ke halaman
   dengan tool **Artifact** (`url` di atas, `asset: true`, `file_paths: [...]`), lalu isi `video_url`/`thumb_url` dari hasilnya.
   Unggah `final.mp4` ASLI (bukan pratinjau) karena file inilah yang dipakai untuk terbit; batas 20 MB, jadi Yoga merender
   Shorts dengan target ≤ 18 MB (`-crf 23 -maxrate 3M -bufsize 6M`). Simpan id asset di `status.json` → `video_asset_id`.
   **Wajib cek sebelum sesi selesai:** setiap video `menunggu_persetujuan` HARUS punya `video_url` di Kantor Visual dan
   `video_asset_id` di `status.json`. Bila belum (mis. sesi kehabisan waktu), unggah sekarang; bila `final.mp4` tidak ada,
   render ulang (`python scripts/render_html.py antrean/<folder>`). Jangan pernah memberi tahu Bos "siap ditonton" untuk video tanpa `video_url`.
3. Jangan pernah menulis isi `.env`, kunci API, atau token ke halaman ini.
