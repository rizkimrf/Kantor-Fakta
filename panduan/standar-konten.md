# STANDAR KONTEN "TERNYATA BEGITU" — dibaca SEMUA agent sebelum menyentuh video apa pun
Perintah Bos (15 Nov 2026): **setiap konten dikerjakan oleh seluruh tim, bukan estafet.**
Riset, naskah, marketing/SEO, suara, visual, sampai caption harus saling menguatkan dalam SATU konten.

## 1. Apa arti "konten yang menjual" di channel ini
Konten yang **ditonton sampai habis, dibagikan, dan diingat** — karena itu yang membuat YouTube, TikTok, dan Instagram
menyebarkannya, dan itu yang membawa channel ke monetisasi (target: 8.000 jam tonton). Urutan nilai: **benar → jelas → menarik → mudah ditemukan.**
Kita tidak pernah "menjual" dengan judul bohong, fakta dilebihkan, atau candaan yang merendahkan.

## 2. Cara berpikir (dipakai semua orang)
**Seth Godin**
- *Penonton terkecil yang layak:* kita bicara ke orang Indonesia 17–35 tahun yang suka merasa "wah, baru tahu". Bukan ke semua orang.
- *Tension:* orang bergerak karena ada jarak antara yang mereka kira dan yang sebenarnya. Setiap konten harus punya jarak itu.
- *Remarkable (Purple Cow):* layak diceritakan ulang. Uji: "Apakah penonton akan bilang ke temannya: eh, tahu nggak…?"
- *Orang seperti kita tahu hal seperti ini:* penonton membagikan konten yang membuat mereka terlihat pintar/seru.
- *Kepercayaan:* jujur soal ketidakpastian ("ilmuwan masih berdebat") justru menambah daya tarik.
**Curiosity gap**
- Buka celah di 3 detik pertama (pertanyaan atau klaim yang terasa mustahil), tutup celahnya di akhir, dan **selalu bayar janji hook.**
- Buka celah kecil baru tiap ±10 detik (*open loop*): "tapi ada satu masalah…", "dan anehnya…".
- Spesifik mengalahkan umum: angka, nama tempat, tahun, perbandingan dengan hal sehari-hari orang Indonesia.

## 3. Referensi yang sudah disepakati Bos (jangan diganti tanpa izin)
| Bagian | Acuan | File |
|---|---|---|
| Penonton | 17–35 tahun, tidak boleh kekanakan | `katalog-aset.md` |
| Karakter | **Tebe versi asli** (chibi, jambul "?", hoodie mustard), digerakkan dengan kerangka gerak | `karakter.md`, `studio-aset/tebe.js`, `tebe-rig.js` |
| Intro & outro | Khas: jambul "?" tergambar → "Ternyata Begitu!"; outro jambul jadi "!" | `cetak-biru-remotion.md` §8 |
| Visual isi | Teknik seperti Kok Bisa: set datar tanpa garis hitam, set berbeda tiap klip, kamera bergerak, Tebe di dalam set, siang/senja/malam | `katalog-aset.md`, `studio-aset/aset-set.js`, `studio-aset/contoh-v5/` |
| Suara | Gaya ngobrol santai, bercanda, tidak menggurui (referensi video bendungan) | `gaya-suara.md` |
| Musik & efek suara | Lihat §6 di bawah | — |
| Riset | Jarak Kejutan, skor Faktor Ternyata ≥ 7, minimal 2 sumber | `playbook-riset.md`, `sumber-terpercaya.md` |
| Naskah | Peta retensi, 10 kandidat hook, rubrik ≥ 8/9 | `playbook-naskah.md` |
| SEO & distribusi | Brief kata kunci, cek SEO, paket unggah YouTube/TikTok/Instagram | `.claude/agents/marketing.md`, `strategi-marketing.md` |
| Sumber fakta | Tidak tampil di video, ditulis di deskripsi | — |

## 4. Rapat konten — `lembar_tim.md` (WAJIB ada di setiap folder video)
Sebelum naskah ditulis, Pak Bima mengumpulkan satu baris dari tiap orang. Tanpa lembar ini lengkap, naskah tidak boleh dimulai.
```
# Lembar Tim — <judul kerja>
Janji konten (1 kalimat, apa yang penonton dapat):
Rasa yang dikejar (kagum / kaget / geli / haru):
- Laras (riset)     : fakta inti + bagian paling mengejutkan + 2 sumber + hal yang TIDAK boleh diklaim
- Raka (marketing)  : kata kunci utama + celah dari pesaing + sudut judul + alasan orang akan membagikan
- Nadia (naskah)    : 3 kandidat hook terbaik + letak canda + kalimat penutup yang memancing komentar
- Yoga (editor)     : set tiap babak (siang/senja/malam) + 1 momen visual "wah" + aset baru yang perlu dibuat + ide efek suara
- Pak Bima (manajer): keputusan hook & sudut + risiko mutu yang harus dijaga
```
Setelah produksi, tiap orang menambahkan **paraf** di bawah lembar yang sama: `- Laras: fakta di video sesuai riset ✔` dst.
Paraf hanya boleh diberikan setelah benar-benar memeriksa hasil akhirnya (naskah final, video, caption).

## 5. Sumbangan tiap orang di SETIAP konten (bukan hanya di tahapnya sendiri)
| Siapa | Di tahapnya | Di tahap orang lain |
|---|---|---|
| **Laras** | `riset.md`: fakta, konteks Indonesia, sumber | Memeriksa naskah final & caption: tidak ada klaim melebihi riset. Memberi 1 fakta cadangan untuk komentar tersemat. |
| **Raka** | `seo.md`, `cek_seo.md`, `paket_unggah.md` | Ikut memilih hook; menilai thumbnail & 3 detik pertama video jadi; menyarankan potongan untuk dibagikan. |
| **Nadia** | `naskah.json`, `naskah_baca.txt`, caption dasar | Menulis teks layar bersama Yoga; menyesuaikan caption tiap platform bersama Raka; merevisi setelah masukan Laras & Raka. |
| **Yoga** | suara, animasi, musik, efek suara, thumbnail | Memberi masukan ke naskah bila ada kalimat yang sulit divisualkan atau terlalu panjang untuk tempo; mengusulkan set & aset sejak rapat. |
| **Pak Bima** | cek fakta, review akhir | Memimpin rapat konten, memutus bila tim berbeda pendapat, memastikan semua paraf ada sebelum minta persetujuan Bos. |

## 6. Musik & efek suara (acuan Yoga)
- **Musik:** instrumental ringan, mengikuti suasana babak (siang ceria-tenang, malam lembut), ±12–15% di bawah narasi, turun saat Tebe bicara, fade-out 1,5 detik.
- **Efek suara khas channel (konsisten di semua video):**
  jingle naik + "ding" di intro · "ding" ganda di outro · *whoosh* di perpindahan set · *pop* saat teks/benda muncul ·
  langkah kaki saat Tebe berjalan · *boing* kecil saat Tebe kaget/meloncat · bunyi khas benda cerita (air, mesin, hewan) bila ada.
- Maksimal 4–6 efek per Shorts di luar intro/outro; efek harus menandai sesuatu (kejutan, perpindahan, angka penting), bukan hiasan.
- Volume efek di bawah narasi; tidak ada efek yang menutupi kata. Semua audio hasil buatan sendiri atau berlisensi bebas — catat sumbernya.

## 6b. Format wajib setiap video (keputusan Bos, 15 Nov 2026) — contoh: `studio-aset/contoh-1menit/v8-final.html`
- **Sampul di dalam video:** frame pertama (0–0,9 dtk) = sampul: set hook digelapkan, judul hook besar (kata kunci di pil kuning,
  kata kejutan kuning), Tebe berekspresi sesuai hook, logo kecil di kiri bawah. Narasi sudah mulai di 0,15 dtk; sampul lalu
  bergeser naik & memudar. Karena itu sampul tidak perlu diatur saat unggah (TikTok/Instagram/YouTube memakai frame pertama).
  `thumbnail.png` = tangkapan frame 0 (untuk video panjang & arsip).
- **Intro khas lega:** 2,4 detik setelah hook (lingkaran kuning-teal, jambul "?" tergambar, "Ternyata Begitu!" bertahan
  ±1,2 dtk penuh supaya terbaca) + jingle & "ding".
- **Watermark berpindah:** ikon "?" + tulisan TernyataBegitu, putih 70% berbayang, 30 px. Pindah tiap **12 detik** dengan pudar
  halus, bergiliran kiri-atas → kiri-bawah → kanan-atas. Tidak tampil di sampul, intro, dan outro. Tidak menutupi teks layar,
  label, atau wajah Tebe.
- **Durasi mengikuti isi, bukan dipaksa 60 detik.** Shorts boleh 60–90 detik bila perlu agar poin tersampaikan dan tidak
  terburu-buru. Suara tidak boleh dipercepat; beri jeda napas ±0,4 dtk di setiap pergantian babak. Teks layar mengikuti
  waktu kata dari `audio/waktu_kata.json`.

## 7. Gerbang akhir — 12 hal yang harus "ya" sebelum minta persetujuan Bos
1. Fakta benar, ≥ 2 sumber, sumber ada di deskripsi (Laras).
2. Ada jarak kejutan yang jelas dan janji hook dibayar (Nadia, Laras).
3. Tiga detik pertama: kata kunci terucap + visual langsung menarik (Raka, Yoga).
4. Gaya ngobrol, ada canda, tidak menggurui, maksimal 3 fakta inti per Shorts (Nadia).
5. Ada celah penasaran baru tiap ±10 detik (Nadia).
6. Tebe asli, bergerak mulus, ada di dalam set (Yoga).
7. Set berbeda tiap babak, minimal satu gerak kamera per adegan, tidak memakai set yang sama dengan 3 video terakhir tanpa variasi (Yoga).
8. Sampul di frame pertama, intro lega, watermark berpindah, outro khas terpasang; suara, musik, dan efek seimbang (Yoga).
9. Teks layar 1–3 kata mengikuti suara, terbaca di HP (Yoga, Nadia).
10. Judul, deskripsi, tag, thumbnail sesuai `cek_seo.md`; judul tidak menyesatkan (Raka, Pak Bima).
11. `paket_unggah.md` lengkap untuk YouTube, TikTok, Instagram (Raka).
12. Semua paraf ada di `lembar_tim.md`; skor naskah ≥ 8/9 (Pak Bima).
Satu saja "tidak" → kembali ke orang yang bertanggung jawab, bukan diteruskan ke Bos.
