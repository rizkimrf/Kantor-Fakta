# Kemulusan — penyebab video "nyendat" dan cara mencegahnya
Temuan dari video bau hujan (15 Nov 2026), jangan diulang:
| Gejala | Penyebab | Aturan |
|---|---|---|
| Suara seperti terpotong (37,3 · 42,6 · 61,3 dtk) | Hening disisipkan di tengah rekaman tanpa fade | JEDA hanya di titik "." naskah; skrip menjepret ke celah kata + fade 25 ms. Jangan potong narasi manual. |
| Wipe sekejap (3 frame) dengan layar biru polos | Transisi terlalu cepat | Transisi 12–18 frame, easing in-out, tanpa frame warna polos. |
| Kembali sekejap ke set lama setelah intro, lalu potong keras | Intro tidak menyambung ke babak berikut | Saat intro menutup layar, ganti set di balik intro; buka langsung ke set baru. |
| Teks 1 kata berkedip ganti-ganti | Teks per kata | Kelompok 2–4 kata dari waktu_kata.json, bertahan sampai kelompok berikut. |
| Musik "memompa" | Ducking terlalu cepat | Ducking attack 80 ms, release 900 ms (sudah di render_html.py). |

| "Patah/nyendat" saat masuk outro (durian 64,0 dtk; 99.900 61,6 dtk) | Lingkaran & Tebe muncul dengan efek pantul (overshoot) di tengah transisi + jambul "?"→"!" berganti dalam 1 frame | Tidak ada efek pantul untuk benda besar (>25% layar); jambul berganti silang-pudar 0,28 dtk (sudah di tebe-rig.js & kerangka-shorts.js). `cek_mulus.py` kini mendeteksi "frame dobel"/gerak berbalik arah. |

Aturan gerak: benda besar/kamera memakai easing in-out tanpa pantul; pantul hanya untuk benda kecil (ikon, teks pendek) dan maks 10%. Jangan menumpuk dua gerak berlawanan arah dalam satu transisi (mis. set lama zoom-in sementara benda baru mengecil).

Pilihan transisi yang terasa profesional: dorong kamera (zoom in ke objek → set baru zoom out), geser kamera searah (whip pan + motion blur 6–8 frame), cocokkan bentuk (match cut: tetes air → bulan), crossfade 10 frame untuk perubahan waktu.
SFX transisi (whoosh) dimulai 3 frame sebelum gerak dan puncaknya di tengah transisi.
