# Analisa "Claude Skills Pack — AI Content Factory" (ChatGPT) — Sab 28 Nov 2026, Pak Bima
Isi paket: 10 SKILL.md (±27 KB) — tata kelola per peran: Central Manager, Marketing, Riset, Copywriter, Editor, QC, Publishing, Analytics, Learning Engine, Monetization.
Kesimpulan: paket ini kuat di **tata kelola & kejujuran data**, lemah di **keahlian kreatif** (hook, alur, tempo, visual) — padahal yang menentukan viral adalah bagian kreatif.
Sebagian besar isinya sudah kita jalankan sejak audit blueprint pagi ini. Yang lebih rinci dari punya kita sudah DIAMBIL ke skill tim (bukan dipasang mentah).

| Skill paket | Sudah ada di kita? | Yang diambil (dan di mana) | Tidak diambil & alasannya |
|---|---|---|---|
| 00 Central Manager | Ya (Pak Bima, Content ID = folder, tahap + riwayat, gerbang, persetujuan Bos) | label `UNKNOWN` bila data tidak ada (prompt 18.17) | format laporan panjang per video → boros kuota |
| 01 Marketing | Sebagian (rencana_marketing, seo.md) | Pertanyaan utama, janji edukasi, risiko miskonsepsi, ide turunan, **keyakinan + alasan** (diukur vs hasil 72 jam) → `seo-distribusi` | — |
| 02 Riset & Fact Checker | Sebagian (≥ 2 sumber, cek_fakta) | **Tabel klaim berstatus** (VERIFIED/PARTIALLY/CONFLICTING/UNVERIFIED/FALSE) + kalimat aman + miskonsepsi + `Status riset: READY` → `riset-fakta`; dicek otomatis | — |
| 03 Copywriter | Ya, versi kita lebih tajam (resep viral) | **ID klaim per adegan** → `naskah-viral` + `cek_standar.py` (K0–K3) | struktur "hook → konteks → … → kesimpulan → CTA": bertentangan dengan data video viral (tanpa rangkuman, tanpa perintah) |
| 04 Editor | Sebagian (cek_mulus, zona aman, katalog aset) | **`aset_manifest.md` per video** + penanda "ilustrasi" + larangan visual mengubah makna → `produksi-video` | — |
| 05 QC independen | Ya (Dimas, dibuat pagi ini) | **SHA256 versi render** (terbitkan.py menolak render yang berubah setelah QC), status kepatuhan, `UNKNOWN`, CQS **sebagai diagnostik** | CQS ≥ 85 sebagai syarat lulus: skor belum terbukti memprediksi hasil; diuji dulu setelah ≥ 20 video |
| 06 Publishing | Ya (terbitkan.py: gerbang disetujui, cek ID sebelum unggah, log error tanpa token) | cek versi render sama dengan yang lolos QC | agent publishing terpisah → digabung di Raka (hemat kuota) |
| 07 Analytics | Ya sejak pagi ini (statistik_youtube.py, snapshot) | snapshot **30 hari**, pisahkan fakta vs tafsiran, faktor pengganggu → prompt 18.17 | snapshot 6 jam: data YouTube sering belum stabil, cukup 24 jam |
| 08 Learning Engine | Ya sejak pagi ini (eksperimen.md, pola L1–L4) | **metrik penjaga, kriteria gagal, eksperimen gagal tetap dicatat, bukti yang bertentangan**, riwayat versi resep (`panduan/versi-resep.md`) | — |
| 09 Monetization | Sebagian (label AI, aset buatan sendiri, cek template berulang oleh Dimas) | catatan kebijakan bertanggal (`panduan/kebijakan-youtube.md`), status CLEAR/REVISI/BLOCKED, `NEEDS_CURRENT_POLICY_CHECK` bila > 30 hari | — |

## Rekomendasi
- **Jangan memasang 10 skill ini ke akun Claude apa adanya.** Isinya akan bertabrakan dengan resep viral kita (mis. "kesimpulan + CTA", CQS 85 sebagai gerbang) dan setiap
  agent membaca dua aturan berbeda → hasil tidak konsisten & kuota boros. Satu sumber kebenaran: skill tim di repo (`.claude/skills/`), yang sekarang sudah memuat bagian terbaik paket ini.
- Untuk keahlian kreatif, yang dipakai adalah resep viral (dari bedah video viral) + skill akun social-media-skills (`panduan/skill-tim.md`) + bedah referensi mingguan (`bedah-video-viral`).
