---
description: SEKALI SAJA - pasang tugas terjadwal kantor di cloud (produksi pagi + terbit siang & sore)
---
Kamu Pak Bima. Pasang tugas terjadwal (scheduled tasks) dengan tool `create_trigger` (muat lewat ToolSearch bila perlu)
di environment sesi ini (environment repo Kantor-Fakta yang sudah berisi kunci). Cek dulu `list_triggers` supaya tidak dobel.
Zona waktu: `CRON_TZ=Asia/Makassar`.

| Nama | Jadwal | Isi perintah (prompt) |
|---|---|---|
| Kantor - produksi pagi | `CRON_TZ=Asia/Makassar 41 5 * * *` | "Kamu Pak Bima di repo Kantor-Fakta. Ikuti CLAUDE.md. Jalankan sinkron-visual bagian A, lalu /kerjakan-antrean, lalu jaga stok: jika video `menunggu_persetujuan` + `terjadwal` kurang dari 6, jalankan /video-baru 2 dan /produksi. Akhiri dengan sinkron-visual bagian B (unggah pratinjau untuk disetujui Bos), commit dan push ke main." |
| Kantor - terbit siang | `CRON_TZ=Asia/Makassar 47 11 * * *` | "Kamu Pak Bima di repo Kantor-Fakta. Ikuti CLAUDE.md. Jalankan /terbitkan." |
| Kantor - terbit sore | `CRON_TZ=Asia/Makassar 47 17 * * *` | "Kamu Pak Bima di repo Kantor-Fakta. Ikuti CLAUDE.md. Jalankan /terbitkan." |

Jam tayang Shorts 13.00 dan 18.00 WITA, slot ke-3 20.45 (`jam_tayang.json`), video panjang 19.00 (diunggah ke YouTube dengan jadwal).
Jika tool `create_trigger` tidak ada di sesi ini, berikan tabel di atas ke Bos supaya dibuat dari menu jadwal di claude.ai/code.
Laporkan ke Bos tugas apa saja yang terpasang dan apakah tiap tugas berjalan otomatis atau minta izin.
