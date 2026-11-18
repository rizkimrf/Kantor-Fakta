# Bank Ide v2 — format A/B (diperbarui Pak Bima atas perintah Bos, 19 Nov 2026)
Gaya lama (dibuka dari tokoh/tahun, trivia jauh dari keseharian) TIDAK dipakai lagi. Arsip fakta lama: `panduan/arsip/bank-ide-lama-15nov.md`
(boleh diambil faktanya/sumbernya, bukan sudut/hooknya). Aturan format: `.claude/skills/naskah-viral/referensi/format-gabungan.md`.

**Syarat setiap ide (wajib, dicek Raka sebelum lolos):**
1. Lolos uji **"pernah ngalamin"** (penonton jawab "pernah!" dalam 1 detik).
2. Jalur jelas: **A "Kok Bisa Jalan?"** (cara kerja, rantai "tapi…", ≤ 90 dtk, slot 13.00) atau **B "Ternyata Begitu"** (fakta/mitos sehari-hari, 1 inti kejutan, ≤ 60 dtk, slot 18.00).
3. Hook skenario "kamu" (tipe dari `hook-26.md`), ajakan komentar 1 kata berkubu, penutup loop ke adegan awal.
4. Fakta dikunci Laras dengan ≥ 2 sumber di tahap `ide` (kolom sumber di sini = titik awal). Mekanisme jalur A dicek ke sumber teknik/produsen/SNI.

Format baris: ID | Jalur | Pengalaman bersama | Hook awal (skenario "kamu") | Inti / rantai | Ajakan komentar 1 kata | Status & sumber awal

## Jalur A — "Kok Bisa Jalan?" (cara kerja benda sehari-hari)
| ID | Jalur | Pengalaman bersama | Hook awal | Rantai mekanisme (dikunci Laras) | Ajakan komentar | Status & sumber awal |
|---|---|---|---|---|---|---|
| A-01 | A | Isi bensin di SPBU, nozzle "klik" berhenti sendiri | "Pernah merhatiin nozzle bensin berhenti sendiri pas tangki penuh?" | lubang kecil di ujung nozzle → udara tersedot → bensin menutup lubang → tekanan turun → katup pegas jepret. **Catatan: topik ini sama dengan akun pembanding — pakai hanya bila sudut kita beda (mis. "kenapa jangan diisi sampai tumpah": uap & kanister arang).** | Udah tahu: MONTIR · Baru tahu: MAGANG | Perlu sumber (HowStuffWorks/produsen nozzle) · prioritas rendah (mirip pembanding) |
| A-02 | A | Rice cooker pindah sendiri ke "warm" | "Kalau rice cooker kamu nggak ada komputernya, kok tahu nasinya matang?" | magnet di bawah panci menempel ke pelat → air habis, suhu lewat ±100 °C → magnet kehilangan daya tarik (titik Curie) → pegas melepas → saklar pindah ke warm | Udah tahu: CHEF · Baru tahu: ANAK KOS | Perlu sumber (fisika titik Curie + manual produsen) · **prioritas 1** |
| A-03 | A | Pasang regulator gas LPG 3 kg | "Isi tabung gas kamu itu bertekanan tinggi, kok kompor nggak meledak?" | gas cair bertekanan → regulator: diafragma + pegas menurunkan tekanan → aliran stabil ke kompor → katup pengaman bila bocor/lepas | Udah tahu: TUKANG · Baru tahu: MASIH NYALAIN PAKE KOREK | Perlu sumber (SNI regulator, Pertamina) · hati-hati: jangan beri tips memperbaiki regulator · prioritas 2 |
| A-04 | A | Galon dispenser bunyi "blub-blub" | "Kenapa galon di dispenser kamu bunyi blub tiap ngambil air?" | air keluar → ruang dalam galon jadi bertekanan rendah → udara luar masuk lewat leher → gelembung naik → air turun lagi → berhenti saat permukaan air menutup leher | Udah tahu: SUHU · Baru tahu: MURID | Perlu sumber (prinsip tekanan udara, cara kerja dispenser) · prioritas 1 |
| A-05 | A | Menunggu di palang pintu kereta | "Palang kereta itu nutup sendiri. Siapa yang ngasih tahu keretanya mau lewat?" | sensor/rangkaian di rel mendeteksi kereta dari jauh → sinyal ke pos/alat otomatis → lampu & bel menyala → palang turun → kereta lewat → sensor setelah perlintasan → palang naik | Udah tahu: MASINIS · Baru tahu: PENUMPANG | Perlu sumber (KAI/DJKA, sistem perlintasan) · hati-hati: jangan ajarkan menerobos · prioritas 2 |
| A-06 | A | Rem motor, tarik tuas rem | "Tangan kamu cuma narik tuas kecil, kok motor seberat itu bisa berhenti?" | tuas → piston master menekan minyak rem → tekanan diteruskan (hukum Pascal) → kaliper menjepit cakram → gesekan jadi panas → motor melambat | Udah tahu: ANAK BENGKEL · Baru tahu: PEMBONCENG | Perlu sumber (manual servis, fisika hidrolik) · prioritas 1 |
| A-07 | A | Kulkas dingin padahal mesinnya panas di belakang | "Kulkas kamu itu sebenarnya mesin pemindah panas, bukan pembuat dingin." | kompresor menekan refrigeran → panas dibuang di kisi belakang → refrigeran mengembang lewat pipa kapiler → menguap & menyerap panas di dalam → kembali ke kompresor | Udah tahu: TEKNISI · Baru tahu: CUMA BUKA TUTUP | Perlu sumber (DOE/HowStuffWorks) · prioritas 2 |
| A-08 | A | Pompa air rumah nyala-mati sendiri | "Pompa air di rumahmu nyala sendiri pas kamu buka keran. Siapa yang nyalain?" | buka keran → tekanan tangki tekan turun → saklar otomatis (pressure switch) menyambung → pompa menyedot → tekanan naik → saklar memutus | Udah tahu: TUKANG LEDENG · Baru tahu: ANAK RUMAHAN | Perlu sumber (manual produsen pompa) · prioritas 2 |
| A-09 | A | Setrika "tik" mati-nyala sendiri | "Setrikamu bunyi 'tik' sendiri. Itu bukan rusak." | elemen panas → lempeng bimetal melengkung saat panas → kontak putus → dingin → lurus lagi → kontak nyambung; tombol suhu = atur jarak kontak | Udah tahu: PENJAHIT · Baru tahu: DISETRIKAIN IBU | Perlu sumber (prinsip bimetal) · prioritas 1 |
| A-10 | A | Kloset duduk disiram, air kembali penuh sendiri | "Pernah ngintip isi tangki kloset? Ada 'otak' kecil di situ." | tombol → katup bawah terangkat → air turun mendorong kotoran → pelampung turun → katup isi terbuka → air naik → pelampung naik menutup katup | Udah tahu: TUKANG · Baru tahu: CUMA PENCET | Perlu sumber (cara kerja flush valve) · prioritas 2 |
| A-11 | A | Kecap/saos sachet gampang disobek di garis | "Kenapa sachet kecap kamu cuma gampang sobek dari satu sisi?" | lapisan plastik kuat ke segala arah → produsen membuat takik/garis lemah (notch) → gaya sobek terpusat di ujung takik → sobekan mengikuti arah serat | Udah tahu: PENJUAL BAKSO · Baru tahu: PAKAI GIGI | Perlu sumber (desain kemasan, tear notch) · prioritas 2 |
| A-12 | A | Helm SNI, kenapa ada busa keras di dalam | "Helm kamu yang keras itu bukan bagian paling penting." | cangkang keras menyebar benturan → busa EPS di dalam remuk menyerap energi → kepala melambat lebih lama → cedera berkurang → itu sebabnya helm bekas jatuh harus diganti | Udah tahu: ANAK TOURING · Baru tahu: HELM BUAT RAZIA | Perlu sumber (SNI helm, studi EPS) · hati-hati: tanpa klaim keselamatan berlebihan · prioritas 1 |

## Jalur B — "Ternyata Begitu" (fakta/mitos sehari-hari, sudut baru dari bahan lama)
| ID | Jalur | Pengalaman bersama | Hook awal | Inti kejutan | Ajakan komentar | Status & sumber awal |
|---|---|---|---|---|---|---|
| B-01 (eks I-020) | B | Makan apa pun harus pakai sambal | "Kalau kamu nggak bisa makan tanpa sambal, kamu bakal kaget asal cabainya." | cabai baru datang dari benua Amerika setelah 1492; dulu "pedas" Nusantara dari lada, jahe, cabai jawa | Tiap makan pakai sambal: 🌶️ · Nggak kuat pedas: 🥵 | Sumber di arsip I-020 · cabai jawa dicek dulu · **siap diverifikasi** |
| B-02 (eks I-006) | B | Jari keriput setelah mandi/berenang lama | "Jari kamu keriput pas kelamaan mandi. Itu bukan karena air masuk ke kulit." | keriput diatur saraf; jari dengan saraf rusak tidak keriput; fungsi "cengkeraman" masih diperdebatkan | Pernah keriput sampai kaget: ✋ · Nggak pernah sadar: 👀 | Sumber di arsip I-006 · **siap diverifikasi** |
| B-03 (eks I-017) | B | Kembalian diganti permen di toko | "Pernah dikasih kembalian permen? Ternyata ada aturannya." | UU Mata Uang: transaksi di Indonesia wajib rupiah; sajikan sebagai info, bukan ajakan menuntut | Pernah dapet permen: 🍬 · Belum pernah: 🙅 | **TAHAN** sampai pasal & sanksi dicek di teks UU 7/2011 (arsip I-017) |
| B-04 (eks I-014) | B | Telepon keluarga beda pulau, jamnya beda | "Kenapa Bali ikut WITA padahal sebelahan sama Jawa?" | zona waktu = keputusan pemerintah (Keppres 41/1987: Bali pindah ke WITA) | Kamu WIB/WITA/WIT? komen zonamu | **TAHAN** klaim "berubah 9 kali" (arsip I-014); inti Keppres 41/1987 boleh |

Laras: tambah ≥ 6 ide **jalur B** baru yang lolos uji "pernah ngalamin" (mis. mitos orang tua, kebiasaan di warung/jalan/sekolah, kata sehari-hari) — hindari klaim kesehatan yang bisa jadi nasihat.

## Diarsipkan (tidak untuk Shorts; boleh jadi bahan video panjang bila dibuka dari hal sehari-hari)
I-001 Tambora–Frankenstein · I-002 dentum Krakatau · I-003 Pulau Run–Manhattan · I-010 Rafflesia · I-011 cendrawasih · I-012 Garis Wallace · cadangan "jumlah pulau berubah".
Alasan: titik masuknya tokoh/tahun/tempat jauh, gagal uji "pernah ngalamin".

## Urutan uji minggu pertama (Raka mengonfirmasi saat tahap `pilih`)
| Hari | 13.00 jalur A | 18.00 jalur B |
|---|---|---|
| Sab 21 Nov | A-02 rice cooker | B-01 sambal pendatang |
| Min 22 Nov | A-06 rem motor | B-02 jari keriput |
| Sen 23 Nov | A-09 setrika bimetal | (ide B baru dari Laras) |
| Sel 24 Nov | A-04 galon blub | (ide B baru dari Laras) |
| Rab 25 Nov | A-12 helm SNI | (ide B baru dari Laras) |

## Video panjang (1 per minggu, Minggu 19.00, 8–12 menit — keputusan Bos 19 Nov: uji minggu ini 2 Shorts/hari + 1 panjang/minggu)
| Tanggal | Judul kerja | Tema dari Shorts | Bab (≥ 70% isi baru) |
|---|---|---|---|
| Min 22 Nov | "Trik Harga yang Diam-diam Mengatur Isi Dompetmu" | Rp 99.900 (±3.300 views TikTok) | harga 99.900 → harga coret → "beli 2 gratis 1" → letak barang di minimarket → kemasan menyusut (shrinkflation), kejutan terbesar di akhir · semua klaim dikunci Laras ≥ 2 sumber · tanpa nasihat keuangan |
