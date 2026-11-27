# Log eksperimen (audit blueprint 28 Nov 2026)
Aturan: satu eksperimen = satu variabel utama. Bandingkan hanya video sejenis (Shorts dengan Shorts, format dengan format).
Keputusan diambil dari median, bukan satu video. Minimal 5 video per kelompok sebelum menyimpulkan.
Metrik utama: "tetap menonton" (Studio, tangkapan layar), % rata-rata ditonton, views 72 jam, subscriber per 1.000 views, komentar + share per 1.000 views.
Data: `data/snapshot_youtube.csv` (otomatis tiap 18.17) + tangkapan layar Bos untuk "ditonton vs digeser".

Setiap eksperimen juga punya **metrik penjaga** (yang tidak boleh turun) dan **kriteria gagal**. Eksperimen gagal TETAP dicatat (tidak disembunyikan); catat faktor pengganggu (iklan, momen, jam tayang beda).

| ID | Mulai | Hipotesis | Variabel | Kelompok | Metrik sukses | Metrik penjaga | Kriteria gagal | Status / hasil |
|---|---|---|---|---|---|---|---|---|
| E1 | 28 Nov 2026 | Resep viral (satu cerita + frame 0 beraksi + penutup tanpa perintah) menaikkan "tetap menonton" dari median 65,7% ke ≥ 75% | struktur video | format lama (25 video, 15–27 Nov) vs resep viral (video 28 Nov dst.) | median "tetap menonton" ≥ 75% dan median views 72 jam ≥ 2× format lama | subscriber per 1.000 views tidak turun; akurasi fakta (0 koreksi) | median "tetap menonton" < 68% setelah 5 video → tinjau resep | berjalan · keputusan setelah ≥ 5 video resep |
| E2 | 28 Nov 2026 | Format A "Kamu yang bikin" lebih tinggi rata-rata ditonton & share daripada format B "Katanya vs Ternyata" | format | A vs B (bergantian) | median % ditonton & share per 1.000 views | biaya produksi per video | selisih < 5 poin → anggap setara | berjalan · keputusan setelah ≥ 5 video per format |
| E3 | 27 Nov 2026 | Iklan 5 hari menaikkan subscriber organik setelah iklan berhenti | iklan follower | 3 video diiklankan vs tidak | subscriber/1.000 views 7 hari setelah iklan | views organik video lain tidak turun | tidak ada kenaikan subscriber organik | berjalan s.d. 1 Des · angka iklan dipisahkan dari data organik |
| E4 | 30 Nov 2026 | Iklan pada video dengan views & retensi tertinggi menaikkan subscriber organik | iklan | video diiklankan vs tidak | subscriber/1.000 views & subscriber channel 7 hari setelah iklan | views organik video baru tidak turun | subscriber organik tidak naik | dimulai Senin · angka iklan dipisahkan dari data organik |
