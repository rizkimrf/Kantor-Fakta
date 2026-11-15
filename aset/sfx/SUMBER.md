# Sumber musik & efek suara — "Ternyata Begitu"
Semua file di `aset/sfx/` dan `aset/musik/` **disintesis sendiri** oleh Yoga (15 Nov 2026) dengan `scripts/buat_audio_aset.py`
(numpy, gelombang sinus/derau + amplop). Tidak ada sampel unduhan, tidak ada lisensi pihak ketiga → aman untuk monetisasi.
Buat ulang: `/usr/bin/python3 scripts/buat_audio_aset.py` (hasil identik, benih acak tetap).

| File | Isi | Pakai di |
|---|---|---|
| `musik/tenang-hujan.wav` | Instrumental tenang 90 BPM (Fmaj7–G7–Em7–Am7, e-piano, bas, pluk pentatonik, shaker, desir hujan tipis), loop mulus 72 dtk | musik latar; `render_html.py` memasang volume 0,14 + diredam otomatis saat narasi |
| `jingle.wav` | arpeggio naik C–E–G–C + "ding" | intro khas |
| `ding.wav` / `ding_ganda.wav` | lonceng tunggal / dua lonceng naik | penanda / outro khas |
| `whoosh.wav` | desir derau tersapu kiri→kanan | perpindahan set |
| `pop.wav` | pop pendek | teks/benda muncul |
| `boing.wav` | boing kecil | Tebe kaget/meloncat |
| `langkah.wav`, `langkah1.wav` | 4 langkah lembut / 1 langkah | Tebe berjalan |
| `tetes.wav` | "plink" tetes air | tetes hujan jatuh |
| `gelembung.wav` | gelembung naik lalu desis pecah (seperti soda) | momen tetes → kabut |
| `hujan.wav`, `gerimis.wav` | suasana hujan / gerimis, loop 19,5 dtk | latar adegan hujan |
