# Tokoh pendamping: NADIA (dipilih Bos 28 Nov 2026 — suara BELUM dipilih, jangan dipakai di video sebelum suara disetujui)
Permintaan Bos 28 Nov: pendamping Tebe, perempuan cantik, lugu tapi sok tau, yang ternyata salah. Nama "Nadia", rambut terurai, tanpa kerudung.
Kode gambar: `studio-aset/tokoh-nadia.js` → `nadiaSVG({ekspresi, bicara, kedip})` (gaya chibi yang sama dengan Tebe).

## Identitas
- **Sosok:** perempuan dewasa muda (±22 tahun), ceria, percaya diri, cantik dengan cara yang sopan: rambut cokelat tua terurai sebahu,
  kardigan koral, dalaman krem, rok panjang teal, sepatu putih.
- **Ciri tetap:** jepit rambut kuning bertanda **"!"** (Tebe = "?" penasaran, Nadia = "!" sok yakin). Saat dibantah, tandanya berubah jadi **"?"**.
- **Sifat:** cepat menjawab, percaya "katanya", grup WA keluarga, dan solusi gampang. Salahnya lucu dan wajar (salah yang juga dialami penonton), BUKAN bodoh.
  Sesekali (±1 dari 5 video) dia benar dan Tebe yang kaget → komentar "Nadia bener!" ramai.
- **Kalimat khas:** "Gampang, aku tau!" · "Katanya sih…" · penutup "Ooh… ternyata begitu." (nama channel).

## Peran di naskah (resep viral U13)
- Format A "Kamu yang bikin": mengusulkan solusi gampang di 1–2 mata rantai ("Pukul aja pakai palu!") → gagal diperagakan → Tebe/narator memberi solusi benar.
- Format B "Katanya vs Ternyata": mengucapkan mitos di detik 0–2 ("Itu anginnya keluar!") → dibantah ≤ 6 dtk.
- Maks 3 kalimat per video, tiap kalimat ≤ 8 kata. Candaan dari isi mitosnya, bukan dari dirinya sebagai perempuan.
- Di naskah.json: `"pembicara": "pendamping"`.

## Ekspresi tersedia
yakin (sok tau) · katanya… (pegang HP) · kaget (dibantah) · malu · ooh ternyata! · senang.

## Sebelum dipakai
1. Bos memilih 1 suara perempuan Indonesia muda & ceria di ElevenLabs (Voice Library), menambahkannya ke akun, dan mengisi
   `ELEVENLABS_VOICE_ID_NADIA` di pengaturan environment.
2. Yoga membuat rig gerak (`tokoh-nadia-rig.js`, meniru `tebe-rig.js`) dan `scripts/suara.py` membaca suara kedua untuk baris `pendamping`.
