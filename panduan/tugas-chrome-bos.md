# Tugas lewat Chrome laptop Bos (perintah Bos 28 Nov 2026: "besok ketika saya buka laptop kerjakan semua yang belum dikerjakan")
Dikerjakan Ken lewat Claude in Chrome di laptop Bos (bukan sesi terjadwal). Urutan = yang paling berdampak dulu.
Aturan keamanan yang TIDAK berubah: Ken tidak mengetik kata sandi, kode verifikasi, token, atau kunci API ke kolom mana pun (termasuk pengaturan environment claude.ai/code);
Bos yang menempelnya. Ken tidak menjalankan skrip di terminal laptop. Unggah video & perubahan pengaturan akun dikonfirmasi di chat satu per satu sebelum diklik.

| No | Tugas | Yang dikerjakan Ken di Chrome | Bagian Bos |
|---|---|---|---|
| 1 | YouTube Analytics API | Google Cloud Console → project kantor → Library → YouTube Analytics API → Enable; OAuth consent screen: cek status Testing → Publish app | jalankan `python scripts/login_youtube.py` di laptop, tempel token ke YT_REFRESH_TOKEN |
| 2 | TikTok Display API | developers.tiktok.com → aplikasi kantor → Add products → Display API; centang user.info.stats & video.list | jalankan `python scripts/login_tiktok.py`, tempel token ke TIKTOK_REFRESH_TOKEN |
| 3 | Instagram insights + perbaiki unggah IG | Graph API Explorer: pilih aplikasi & Halaman TEBE, centang 5 izin (lihat `panduan/akses-data.md`) | klik Generate, tukar ke token jangka panjang/Halaman, tempel ke IG_ACCESS_TOKEN |
| 4 | Suara Nadia | ElevenLabs Voice Library: cari 4–6 suara perempuan muda bahasa Indonesia, ceria & natural; uji 1 kalimat contoh per suara (hemat kredit) | dengarkan & pilih 1; tempel voice ID ke ELEVENLABS_VOICE_ID_NADIA |
| 5 | Unggah manual YouTube: Panci Presto & Cicak (audit YouTube belum lolos) | unduh final.mp4 + paket_unggah dari Kantor Visual, isi judul/deskripsi/label AI di YouTube Studio, jadwalkan | konfirmasi di chat sebelum Ken menekan Jadwalkan/Publikasikan |
| 6 | Data "ditonton vs digeser" | YouTube Studio → Analytics per video: catat % tetap menonton + rata-rata ditonton semua Shorts 7 hari terakhir ke `data/snapshot_youtube.csv` (B4-01 kedutan dibaca ≥ 24 jam setelah tayang 28 Nov 18.30) | — |
| 7 | Supermetrics (uji coba habis 29 Nov) | tarik data terakhir sebelum berakhir bila konektor masih aktif | Bos sudah memutuskan tidak berlangganan |

Status tiap tugas ditulis di laporan Kantor Visual (bagian `sudah`).
