# Koordinasi kerja & kontrak agent (audit blueprint 28 Nov 2026)
Pak Bima = orkestrator (sesi terjadwal). Satu video = satu folder (Content ID). Setiap pindah tahap dicatat di `status.json` → `riwayat`:
`{"dari": "...", "ke": "...", "oleh": "<nama>", "waktu": "<ISO WITA>", "catatan": "1 kalimat"}`. Git menyimpan versi setiap file.

## Aturan serah-terima
1. **Hanya pemilik yang mengubah file miliknya** (tabel di bawah). Agent lain memberi masukan lewat `lembar_tim.md` dengan format
   `- [Nama → Pemilik] masukan konkret (detik/kalimat + usul)`; pemilik menjawab "dipakai" atau "tidak, karena …".
2. **Tahap hanya maju bila input wajib tahap berikutnya lengkap.** Penerima yang menemukan input kurang → kembalikan dengan catatan, jangan menebak.
3. **Gerbang tidak bisa dilewati:** cek_standar.py (naskah) · cek_fakta (Pak Bima) · cek_mulus + review (Pak Bima) · qc.md PASS (Dimas) · persetujuan Bos.
4. **Eskalasi:** tahap yang sama gagal 2x → isi `masalah`, lewati video, laporkan. QC REVISI 3x → `ESKALASI KE BOS`. Fakta tak terverifikasi → berhenti, jangan diakali.
5. **Sumber kebenaran:** angka performa hanya dari `data/snapshot_youtube.csv` / tangkapan layar Bos; keputusan strategi hanya dari `laporan/eksperimen.md` + `panduan/pola-terbukti.md`.

## Kontrak per agent
| Agent | Input wajib | Hasil (file miliknya) | Boleh mengubah | KPI (dicatat di laporan Senin) | Eskalasi bila |
|---|---|---|---|---|---|
| **Laras** (riset) | ide dari bank / pilihan Raka | `riset.md` (setiap mata rantai & istilah ≥ 2 sumber independen, URL + kutipan bagian yang mendukung), entri `panduan/bank-ide.md` | riset.md, bank-ide.md | % klaim lolos Dimas tanpa koreksi · ide gugur di cek_fakta | sumber < 2 untuk klaim inti |
| **Raka** (marketing) | riset.md | `rencana_marketing.md`, `seo.md`, `cek_seo.md` (uji banding R1), `unggah.json`, `paket_unggah.md`, evaluasi & laporan Senin | file tsb, `laporan/eksperimen.md` | "tetap menonton" & views 72 jam vs median format · ketepatan prediksi R1 | data tidak tersedia (minta tangkapan layar Bos) |
| **Penulis naskah** | riset.md + seo.md | `naskah.json` (format_resep), `naskah_baca.txt`, `naskah_suara.txt`, 3 opsi judul | file tsb | `cek_standar.py` lulus pada percobaan pertama · jumlah revisi dari Dimas | resep tidak bisa dipenuhi topik ini → usul ganti topik |
| **Yoga** (editor) | naskah.json lulus cek_fakta | `audio/`, `visual/`, `final.mp4`, `thumbnail.png`, aset baru di `studio-aset/` | file tsb | cek_mulus lulus percobaan pertama · revisi visual dari Dimas · kredit ElevenLabs per video | render gagal 2x |
| **Pak Bima** | semua di atas | `cek_fakta.md`, `review.md`, laporan ke Bos, Kantor Visual | status.json (pindah tahap), CLAUDE.md & skill (hanya dari L3+/keputusan Bos) | video tayang tepat waktu · slot kosong · biaya | keputusan yang hanya boleh diambil Bos |
| **Dimas** (QC) | final.mp4 + semua file video | `qc.md` (PASS/REVISI/TOLAK) | hanya qc.md | temuan yang kemudian terbukti (video PASS tapi < 75% tetap menonton → evaluasi QC) | REVISI 3x, kegagalan kritis |

## Tinjauan agent mingguan (bagian dari laporan Senin)
Tabel per agent: jumlah tugas, revisi diterima, gagal gerbang, waktu sesi, kredit ElevenLabs per video. Satu perbaikan untuk agent dengan revisi terbanyak.
