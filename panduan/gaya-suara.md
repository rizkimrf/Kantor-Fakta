# Gaya Suara — "teman pintar yang enak didengar"

Target penonton: orang Indonesia 16–40 tahun, menonton di HP, sering sambil melakukan hal lain.
Suara harus jelas di speaker HP murah, tidak melelahkan, dan terasa seperti teman — bukan penyiar berita.

## Karakter suara (dipakai juga untuk memilih suara di ElevenLabs atau suara Windows)
- Hangat, ramah, sedikit tersenyum saat bicara; percaya diri tapi tidak menggurui.
- Nada tengah (tidak terlalu berat, tidak cempreng). Satu suara yang SAMA untuk semua video.
- Logat Indonesia netral (baku-santai), bukan logat daerah yang kental, bukan aksen asing.

## Tempo & artikulasi
- Tempo ±150–165 kata per menit (Shorts), ±140–150 (video panjang).
- Setiap suku kata jelas; akhiran kata tidak ditelan ("ternyata" bukan "ternyat").
- Jeda 0,3–0,5 detik sebelum fakta kejutan; jeda 0,2 detik antar adegan (sudah diatur editor).
- Penekanan pada SATU kata kunci per kalimat (kata yang ditulis kapital di naskah).

## Kosa kata (tanggung jawab Nadia; dicek Pak Bima)
- Pakai kata yang dipahami anak SMA: "gara-gara, ternyata, kira-kira, bayangin, coba pikir".
- Hindari: "dikarenakan, merupakan, adapun, signifikan, fenomena" (kecuali langsung dijelaskan).
- Nama asing ditulis cara bacanya di `pelafalan` (lihat di bawah) supaya pengisi suara tidak salah ucap.

## Kamus pelafalan (agent menambah bila ada nama sulit)
| Ditulis | Dibaca |
|---|---|
| Frankenstein | Frengken-stain |
| Mary Shelley | Meri Syeli |
| Tambora | Tambora |
| Krakatau | Krakatau |


## Pilihan sumber narasi (urutan prioritas, disetujui Bos 15 Nov 2026)
1. **Suara Bos sendiri.** Nadia menyiapkan `naskah_baca.txt` (naskah per adegan, tanda jeda `/`, kata yang ditekan dalam KAPITAL).
   Bos merekam di HP dalam satu kali baca. Yoga memotong per adegan berdasarkan jeda (ffmpeg silencedetect), membersihkan noise ringan, menyamakan volume (-14 LUFS).
2. **Suara AI berkualitas tinggi** (ElevenLabs) bila rekaman Bos tidak ada.
3. Suara bawaan Windows/robot: hanya untuk uji internal, **tidak boleh ditayangkan**.
