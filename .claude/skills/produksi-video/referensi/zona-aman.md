# Zona aman Shorts / TikTok / Reels (1080×1920)
```
y 0–220      : TERTUTUP (status bar, tab Following/For You, tombol cari)
y 220–900    : aman (judul hook, label babak, watermark atas)
y 900–1480   : aman kecuali kanan x 900–1080 (tombol like/komentar/bagikan)
y 1480–1920  : TERTUTUP (nama akun, caption, musik, bilah progres)
```
- Teks layar: pita y 900–1400, x 80–880. Maks 2 baris, 64–80 px, kontur/bayangan gelap.
- Wajah Tebe: pusat wajah di x 160–820, y 380–1350.
- `cek_mulus.py` membuat `_kerja/cek_zona_aman.jpg` dengan area merah = tertutup UI. Tidak boleh ada teks atau wajah di area merah.
- Sampul (frame 0) mengikuti grid profil 3:4: semua inti di y 260–1660.
