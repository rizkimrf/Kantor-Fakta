# Katalog Aset & Keputusan Gaya — Ternyata Begitu
Disepakati Bos pada 15 Nov 2026. Baca ini SEBELUM membuat aset atau video baru.

## A. Keputusan gaya (jangan diubah tanpa izin Bos)
| Hal | Keputusan |
|---|---|
| Target penonton | 17–35 tahun → isi video tidak boleh kekanakan |
| Maskot | **Tebe versi asli** (chibi, jambul "?", hoodie mustard, celana teal, sepatu putih, garis hitam). Versi "dewasa" sudah DITOLAK. |
| Intro | Setelah hook (±detik 2,7): lingkaran kuning-teal, jambul "?" tergambar, "Ternyata Begitu!" + jingle naik + "ding" |
| Outro | Tebe pose bangga di lingkaran kuning, latar sinar teal, jambul "?" → "!", "Ternyata Begitu!" + "ding" ganda + "Ikuti untuk fakta berikutnya" |
| Isi video | Gaya datar seperti referensi Kok Bisa: set tanpa garis hitam, bayangan lembut, kedalaman lewat lapisan & kabut |
| Waktu | Tiap set punya versi siang / senja / malam; malam = biru tua lembut (bukan hitam) + cahaya hangat |
| Kamera | Set lebih lebar dari layar; tiap adegan minimal satu gerak kamera (sapu, dorong, mundur, masuk lewat jendela) |
| Tebe di set | Tebe berada DI DALAM set: berjalan, bereaksi, menjelaskan. Di malam hari diredupkan sedikit |
| Teks | Label kecil kapital + judul Inter Display tebal. Siang: teks gelap + stabilo kuning. Malam: teks terang + aksen Lora miring kuning |
| Sumber | Tidak tampil di video — tulis di deskripsi |
| Warna brand | Kuning #FFC93C · Teal #1F8A8A · Krem #FFF4DC · Hitam #1E1E1E |

## B. File aset (di `studio-aset/`)
| File | Isi | Cara pakai singkat |
|---|---|---|
| `tebe.js` | Bentuk resmi Tebe (6 ekspresi statis) | `tebeSVG({ekspresi})` — untuk gambar diam/thumbnail |
| `tebe-rig.js` | Kerangka gerak Tebe | `tebeAnimasi([{t, pose, transisi, bicara:[a,b], jalan:[a,b], loncat:true, tanda:"!"}])` lalu `tebeRigSVG(anim(t))` |
| `aset-set.js` | Pustaka set + palet | `ASET.PALET.siang/senja/malam`, lalu panggil aset di bawah |
| `contoh-v5/v5.html` | Contoh video lengkap (komodo, 17 dtk) | Salin strukturnya untuk video baru |
| `contoh-v5/pratinjau-*.png` | Lembar pose Tebe & set siang/senja/malam | Acuan visual |
| `contoh-hujan/pratinjau.html` + `pratinjau-*.png` | Uji aset hujan di 3 palet + urutan slow-motion | `?adegan=1..7` |
| `kerangka-shorts.js` | Mesin bersama Shorts (intro/outro, teks, transisi, peta waktu) | muat setelah tebe-rig.js & aset-set.js |
| `aset-geologi.js` | Geologi & peta (Yoga, 17 Nov 2026, I-013 Toba): `duniaToba` (danau + mangkuk kaldera bawah air, opsi `samosir` 0..1 & `glow`), `penampangMagma` (letus/kosong/runtuh/air), `petaDunia` + `petaXY(bujur,lintang)` + `jejakAbu` + `titikPeta` (peta datar Afrika–Asia tanpa label), `guaPesisir` + `bekasApi` + `alatBatu` + `serpihanKaca` + `manusiaPurba`, `danauLuas` + `intiSedimen` + `mejaLapangan`, `perahuKecil`, `banRenang`, `kardus`, `kepingSalju`, `apiKecil` | muat setelah aset-set.js; contoh: `antrean/2026-11-17_i-013-danau-toba-letusan-super/visual/video.html` |
| `aset-uang.js` | Uang & 1950 (Yoga, 18 Nov 2026, I-016 Gunting): `uangFiktif` (DESAIN FIKTIF berpita CONTOH, tanpa wajah/lambang/nama bank/nomor seri; `potong`, `sisi`, `lipat`, `garis`, warna zaitun/bata/lembayung), `gunting` (merah, `buka`), `dompetKulit`, `suratObligasi` (polos, tanpa angka), `radioTabung`, `lampuTeplok`, `kamarPagi`, `rumah1950Malam` + `siluetDuduk`, `siluetPeci` (tokoh nyata tanpa wajah), `gedungBankKolonial` (generik), `jalan1950`, `kantor1950`, `lemariArsip`, `karungBeras`/`botolMinyak`/`telurRak`, `piringGorengan`, `tanganRaih`, `konfeti`, `kilauBintang`, `mejaModern` | muat setelah aset-set.js; contoh: `antrean/2026-11-18_i-016-gunting-sjafruddin/visual/video.html` |

**Pose Tebe (tebe-rig):** netral, penasaran, kaget, menjelaskan, tertawa, bingung, bangga, melambai, berpikir, menghitung, sedih.
Otomatis: kedip, napas, goyang badan, pegas jambul, mulut bicara.

**Aset set (aset-set.js):** langit (matahari/bulan/bintang), awan, burung, bukit, kabut, laut, tanah, lontar, pohon, semak, rumput, batu, pagar, lampuTaman, rumahReptil, kunangKunang, debuCahaya, komodo, telur, kromosom, studio (latar penjelasan).

**Aset set HUJAN / TANAH / MIKRO / KAMPUNG (Yoga, 15 Nov 2026, video I-007; pratinjau 3 palet di `studio-aset/contoh-hujan/`):**
| Fungsi | Isi | Cara pakai singkat |
|---|---|---|
| `langitMendung(P,w,h,t,o)` · `awanHujan(x,y,s,P,t,op)` | langit berawan berlapis bergeser · awan hujan gelap | ganti `langit` saat mendung |
| `hujan(w,h,t,P,{deras,sudut,y0,y1})` · `gerimis(...)` · `riakHujan(x0,x1,y0,y1,t,P,n)` · `tetesAtap(x0,x1,y,t,P,{n,jatuh})` | garis hujan bergerak, gerimis, riak genangan, tetes dari tepi genteng | taruh paling depan |
| `tanahKering(w,y,P,o)` · `bercakBasah(x0,x1,y0,y1,P,k)` · `tanahBasah(w,y,P,t,{genangan,hujan})` | tanah retak kemarau (perspektif) · bercak basah muncul (k 0→1) · tanah basah + genangan | kemarau → tetes pertama |
| `tetes(x,y,s,P,{regang})` · `gelembung(x,y,r,P,{pecah})` · `aerosol(x,y,P,k,o)` · `tetesSlowmo(x,y,s,P,fase,{t})` · `gelasSoda(x,y,s,P,t)` | MOMEN WAH: tetes jatuh → menghantam → gelembung naik → pecah jadi kabut (fase 0..1); gelas soda pembanding | `tetesSlowmo` skala ±1,9 untuk close-up |
| `streptomyces(x,y,s,P,t,{tumbuh,spora,wajah,benih})` · `spora(...)` · `molekulGeosmin(x,y,s,P,t)` · `aroma(x0,y0,x1,y1,t,P,{n,amp,k})` | bakteri benang bercabang (wajah kecil opsional) + rantai spora · spora melayang · molekul geosmin · pita aroma mengalir | dunia mikro |
| `springtail(x,y,s,P,t,{arah,loncat,jalan})` · `tanahDekat(w,h,P,t,{permukaan,butir})` | springtail mungil (seukuran butir pasir di set mikro, bisa salto) · penampang tanah close-up | skala springtail ±0,6 |
| `lele(...)` · `leleMuncul(x,y,s,P,t,k,mangap)` · `kolam(x,y,w,h,P,t,{lele,hujan,muncul})` · `piringPecelLele(x,y,s,P)` | lele berenang, kepala lele menyembul, kolam tanah, pecel lele (warna diredupkan otomatis) | momen "bau lumpur" |
| `rumahKampung(x,y,s,P)` · `potTanaman` · `tiangListrik` · `kabel` · `jalanKampung(w,y,P,t,{hujan,genangan})` · `pantulanCahaya` | rumah genteng Indonesia + teras, jendela menyala otomatis malam, gang basah memantulkan lampu | set kampung senja/malam |
| `kepalaProfil(x,y,s,P,t,{endus})` · `redup(P)` | kepala manusia tampak samping mengendus (bukan Tebe) · filter peredup benda berwarna asli | close-up hidung |
Kunci palet baru: `mendung, awanH, awanHB, hujan, air, airKilau, airKolam, tanahBasah, tanahRetak, bakteri, bakteriB, spora, springtail, springtailB, lele, leleB, jalan, jalanB, aroma, redup`.

**Aset set DURIAN (Yoga, 15 Nov 2026, video I-009) — di `aset-set.js` (blok perluasan):**
| Fungsi | Isi | Cara pakai singkat |
|---|---|---|
| `durian(x,y,s,P,{belah,goyang})` · `durianBelah(x,y,s,P,{matang})` · `pohonDurian` | durian berduri (belah 0..1 memperlihatkan daging) · durian terbuka · pohon tinggi berbuah | warna asli diredupkan otomatis per palet |
| `cerobongMini(x,y,s,P,t,{tumbuh,nyala,asap})` · `asapBau(x,y,s,t,k)` · `gelombangBau(x0,y0,x1,y1,t,k)` | "pabrik bau" mungil + kepulan hijau + garis bau bergelombang | metafora gen/zat berbau |
| `lapakDurian(x,y,s,P,t)` · `keranjangDurian` · `mugKakao` · `kausLipat` | lapak pinggir jalan (terpal, bohlam menyala malam), keranjang, cokelat panas, kaus katun | set pasar/kuliner |
| `kabinPesawat(w,h,P,t)` · `kursiPesawat(x,y,s,P,t,{kipas,penumpang})` | kabin generik tanpa logo, penumpang siluet tanpa wajah | adegan transportasi |
| `labGenetika(w,h,P,t)` · `mesinSekuensing` · `ilmuwan(x,y,s,P,t,{peluk})` · `selTumbuhan` · `untaiDNA(x,y,panjang,t,{segmen})` | lab dengan jendela kota, mesin pembaca DNA tanpa tulisan, ilmuwan sederhana, dalam sel, DNA dengan segmen menyala | set sains |
| `kokiBlob(x,y,s,t,{laju})` · `tetesBelerang` · `dalamDurian(w,h,t,{matang})` | koki gumpal mencincang (laju = kecepatan), gua daging buah | metafora proses kimia |
| `tamanPastel` · `got` · `hutanMalam` · `pakis` · `mataGelap` · `pohonKeluarga(x,y,s,P,t,k)` · `buahKakao` · `kapasMekar` | "surga vs got", hutan malam + mata hewan tanpa spesies, pohon kekerabatan yang tumbuh | perbandingan & kekerabatan |

**Aset set BELANJA & HARGA (Yoga, 15 Nov 2026, video I-015):**
| Fungsi | Isi | Cara pakai singkat |
|---|---|---|
| `labelHarga(x,y,s,"99.900",{redupKanan,kiriBesar,tali,putar,rp})` | label harga, angka ditulis kode (selalu rapi); digit kanan bisa diredupkan tapi tetap terbaca | jangan menggambar angka dengan gambar |
| `rakMinimarket` · `mejaKasir` · `koin(x,y,s,t)` · `tokoMalam` · `kantongBelanja` · `hpRaksasa` | minimarket tanpa merek, kasir, koin berputar, depan toko malam, layar aplikasi belanja kosong | set belanja |
| `kacaPembesar(x,y,s,{r,isi})` | lensa yang memperbesar isi SVG apa pun | sampul & penekanan |
| `ruangSortir` · `banBerjalan` · `keranjang` · `lenganRobot` | "pabrik di dalam kepala" | metafora cara otak memilah |
| `mobil` · `panggungLelang` · `dasbor` · `odometer(x,y,s,nilai,{digit})` · `panahTurun` | lelang mobil, odometer menggulir mulus (nilai pecahan) | angka yang berubah |
| `perpustakaan` · `tumpukanJurnal(x,y,s,k,{n})` · `timbangan(x,y,s,{miring,kiri,kanan})` · `awanMerahMuda` · `kerikil` | riset/meta-analisis, timbangan perbandingan | penjelasan "efeknya kecil" |

**Pose Tebe baru (tebe-rig.js):** tutupHidung, mengipas, berbisik, angkatBahu, curiga, menarikTuas.

**Aset set SEJARAH NAMA (Yoga, 17 Nov 2026, video I-004):**
| Fungsi | Isi | Cara pakai singkat |
|---|---|---|
| `ruangKerjaTua(w,h,P,t,{meja,cx,cy,jendelaX})` · `lilin(x,y,s,t,{glow})` · `lampuMeja` · `lembarCetak` | ruang kerja tua (rak buku, jendela opsional, meja kayu, cahaya terpusat), lilin berkedip, lampu kuningan, kertas cetakan | set malam/misteri |
| `jurnalTerbuka(x,y,s,{kata,tulis,sinar,ukuran})` · `penaBulu(x,y,s,rot)` · `stempelLilin(x,y,s,{isi})` · `bukuPolos` | jurnal terbuka (kata ditulis kode, bisa "tertulis" pelan & bersinar), pena bulu (ujung di x,y), stempel lilin merah, buku tanpa judul | sampul misteri & momen "pertama ditulis" |
| `petaNusantara(x,y,s,{warna,sorot,bayang})` | peta Nusantara datar tanpa batas negara (kotak ±1000×420), garis bercahaya menggambar diri (sorot 0..1) | jangan tambah batas/label negara |
| `pelabuhanLama` · `kapalLayar(x,y,s,P,t,{arah,layar})` · `siluetBertopi(x,y,s,{tarik,condong,arah})` · `gerobakJurnal` | pelabuhan abad 19, kapal tiang tiga, tokoh sejarah TANPA wajah, gerobak buku | tokoh nyata selalu siluet |
| `ruangPeta` · `halamanYunani` · `tiangYunani` · `kepinganPuzzle(x,y,s,warna,'kanan'|'kiri',{teks,sub,ikon,sinar})` | ruang peta kuno + bola dunia, halaman bertiang, kepingan puzzle yang pas bila jarak pusat 340×s | perakitan kata (Indos + nesos) |
| `ruangVictoria` · `papanEasel(x,y,s,{teks,coret,sorot})` · `jendelaKanal(x,y,w,h,P,t)` | ruang kerja era Victoria (perapian, jendela lengkung), papan nama di kuda-kuda, jendela kota kanal berhujan | pilihan nama, Eropa |
| `orang(x,y,s,P,t,{baju,celana,kulit,peci,kebaya,angkat 0..1,tanpaWajah})` · `aula1928` · `tribunStadion(w,h,P,t,{sorak})` | orang generik (lengan naik mulus), aula pertemuan (spanduk polos), tribun stadion malam bersorak | kerumunan & sejarah pergerakan |

**Aset set KULINER KECAP & KETCHUP (Yoga, 17 Nov 2026, video I-018):**
| Fungsi | Isi | Cara pakai singkat |
|---|---|---|
| `botolSaus(x,y,s,{label,mata,lihat,rot})` · `botolKecap(x,y,s,{isi,tutup,kental,tinggi,label,mata})` · `botolKaca(x,y,s,{konten,isiWarna})` · `mata(x,y,s,jenis)` | botol saus tomat, botol kecap (manis/asin/ikan lewat warna isi), botol kaca bening berisi SVG apa pun, mata kartun (marah/kaget/senang) | label polos/teks kode, tanpa merek |
| `tongIkan(x,y,s,t,{ekor,bau})` · `ikan(x,y,s,rot,{warna,kibas})` · `tempayan` | tong air garam ikan + ekor mengibas + garis bau, ikan/teri, tempayan tanah liat | "amis" dibuat lucu, bukan menjijikkan |
| `warungBakso(w,h,P,t,{meja})` · `mangkukBakso` · `gerobakGorengan` · `gerobakNasgor` · `wajan` | warung keramik + lampu untai (menyala senja/malam), bakso berasap, gerobak gorengan, gerobak nasi goreng + wajan berapi | kuliner Indonesia |
| `jung(x,y,s,P,t)` · `rumahPanggung` · `dekKapal(w,h,P,t,{cakrawala,tiangX})` | jung bertulang layar, rumah panggung Melayu, geladak kapal Eropa | jalur dagang |
| `dapurPondok` · `jamur` · `kenari` · `tiram` · `dapurAmerika` · `panci` · `tomat` · `pabrikSaus` · `dapurRumah` | dapur Inggris berhujan, bahan isi botol, dapur pertanian + tungku, pabrik bata + ketel tembaga, dapur rumah Indonesia (rak) | sejarah resep |

**Pose Tebe baru (17 Nov):** semangat (kepal tangan ke atas), sorak (dua tangan naik), haru (tangan di dada). `KS.outro` kini menerima `sub` & `subMulai` (baris kecil di bawah CTA; bawaan "Tulis jawabanmu di komentar").
**Catatan kemulusan (17 Nov):** loncatan (`loncat:true`) pada Tebe besar (≥ 380 px) terbaca "frame dobel" oleh `cek_mulus.py` di titik puncaknya → untuk Tebe besar cukup ganti pose tanpa loncat. JEDA yang tidak tepat di celah > 0,04 dtk bisa terjepret ke celah lain di tengah frasa: periksa dulu (mis. "George | Earl").

**Mesin bersama Shorts — `studio-aset/kerangka-shorts.js` (`KS`):** peta waktu narasi↔video + JEDA terjepret ke celah kata, teks layar berkelompok dari `waktu_kata.json` (penggantian ejaan: de-en-a → DNA), komposisi babak + transisi 0,6 dtk (dorong/geser/silang, easing sinus), intro & outro khas, label babak, watermark bergiliran, vinyet+butiran. Contoh pakai: `antrean/2026-11-15_i-009-bau-durian/visual/video.html`.

**Musik baru (tanpa desir hujan):** `aset/musik/jenaka-ringan.wav` (98 BPM, marimba jenaka) · `aset/musik/belanja-ceria.wav` (108 BPM). Dibuat `scripts/buat_audio_aset.py --musik-baru`; punya lapisan pad berkelanjutan agar latar tidak pernah hening di sela kata (penyebab "audio terpotong" palsu di cek_mulus). Render dengan `--musik-vol 0.2`.

**Alat produksi:** `scripts/render_html.py` (HTML gaya v8 → `final.mp4` + `thumbnail.png`, lihat docstring) · `scripts/buat_audio_aset.py` (musik & efek disintesis sendiri, daftar di `aset/sfx/SUMBER.md`).

**Aset brand (di `aset/brand/`):** logo-ikon (foto profil), logo horizontal terang/gelap, logo-tulisan, header YouTube 2560×1440, template kolaborasi, 7 pose Tebe PNG/SVG.

## C. Cara menambah aset baru (aturan Yoga)
1. Tambahkan sebagai fungsi baru di `aset-set.js` yang menerima palet `P` — jangan hard-code warna; pakai kunci palet (`P.daun`, `P.dinding`, `P.cahaya`, dll).
2. Gaya: bentuk datar, tanpa garis hitam, maks 2–3 nada per benda (dasar, bayangan, sorot), bayangan lantai `P.bayang`.
3. Benda yang bisa menyala (lampu, jendela, layar) memakai `P.jendelaNyala` agar otomatis menyala di malam hari.
4. Uji di tiga palet (siang, senja, malam) dan simpan pratinjaunya di `contoh-v5/` atau folder contoh baru.
5. Catat aset baru di tabel B file ini (nama + fungsi + satu baris cara pakai).
6. Pose Tebe baru: tambahkan ke objek `POSE` di `tebe-rig.js` (angka saja), jangan mengubah bentuk Tebe.

## D. Ide aset berikutnya (belum dibuat)
Kota & gedung, pasar tradisional, sawah, gunung api, laut dalam & ikan, luar angkasa & planet, ruang kelas, laboratorium detail, peta dunia/Indonesia bergaya datar, uang & koin, tubuh manusia (organ sederhana), rumah adat, kapal, pesawat.

**Aset KAMAR MANDI & APOTEK 1892 (Yoga, 18 Nov 2026, video I-019 odol) — blok akhir `aset-set.js`:** `kamarMandi(w,h,P,t,{meja,cerminX,jendelaX,rakX,handukX})` · `wastafel(x,y,s,P)` · `tubePasta(x,y,s,{warna,aksen,tutup,tanya,rot})` (label kosong; y = pangkal tutup) · `sikatGigi(x,y,s,rot,{busa})` · `gelasKumur` · `busa(x,y,s,t,k)` · `botolKumurJadul(x,y,s,{kaca,kilau})` (generik, tanpa logo) · `timbanganKuningan` · `apotekJadul(w,h,P,t,{meja})` · `posterJadul(x,y,s,t,{isi,w,h})` · `ruangTamuSepia(w,h,t,{lantai})` · `gramofon(x,y,s,t,{main})` · `notBalok` · `lampuMinyakRomawi` · `ikonGigi` · `tetesMinyak` · `kartuKata(x,y,s,teks,{sub,warna,ikon})` (teks via kode) · `toplesKue` · `rakWarungJadul(w,h,P,t,{lantai})`. Pipi gembung/busa di mulut & properti di tangan: lihat `tebeX()` di `antrean/2026-11-17_i-019-odol-merek-jerman/visual/video.html`. Catatan render: gerak kamera pelan (< 1 px/frame) memicu "frame dobel" di cek_mulus → pakai pan linear ≥ 40 px/dtk.

**Aset SAMBAL & CABAI JAWA (Yoga, 21 Nov 2026, B-01) — `studio-aset/aset-sambal.js`** (muat setelah aset-set.js & aset-pedas.js): `cabaiJawa(x,y,s,{rot,kering,mata:'senang'|'kaget'|'marah'|'lesu',lihat,tangan,bangga,glow})` (cabya berbintil, pangkal di atas) · `untaianCabya` (para-para) · `dapurJawaKuno(w,h,P,t,{pintuX,pintuW,pintuH,laut,kapalX,rak,lantai})` (dinding gedek, tiang, pintu ke laut/kebun) · `tungkuTanah(x,y,s,t,{bara})` · `gerabah(x,y,s,{jenis:'periuk'|'kendi'|'cowek'})` · `labelKayu(x,y,s,teks,{rot,tali,uk})` (teks via kode) · `koper` · `mejaMakanMalam(w,h,P,t,{meja,jendelaX,lampuX})` + `lampuGantung`, `piringNasi`, `gelasTeh` · `globeKartun(x,y,r,t,{lon,lat,sorot})` (bola dunia ortografis TANPA batas negara/rute; sorot menyalakan Amerika) · `lontarNaskah(x,y,s,t,{buka,gambar})` (coretan hiasan tak terbaca) · `lapakJamu` + `botolJamu` (polos, tanpa klaim) + `bakul` · `podium` · `tanganPolos(x0,y0,x1,y1,{genggam})`. Contoh: `antrean/2026-11-21_b-01-sambal-pendatang/visual/video.html`.

**Aset DAPUR LISTRIK (Yoga, 21 Nov 2026, A-02) — `studio-aset/aset-dapur-listrik.js`:** `riceCooker(x,y,s,t,{tuas 0 bawah/masak..1 naik/lepas, lampu, uap, xray, air, nasi, panas, didih, gerak})` (generik tanpa merek, x-ray memperlihatkan panci, air, nasi, pelat, termostat) · `makroSaklar(w,h,t,{panas,gelombang,medan,acak,lepas,tegang})` (penampang bawah panci: keping ferit + panah domain, magnet, garis medan biru, pegas tarik, lengan tuas — sesuai mekanisme riset: keping kehilangan magnet → magnet jatuh → tuas TERLEPAS NAIK) · `tetesDetektif(x,y,s,t,{silang,lambai,uap})` · `chipKomputer` · `papanSirkuit` · `riceCookerCanggih(…,{xray})` · `etalaseMalam` · `centong` · `ikonTetes({kosong})`/`ikonPegas`/`ikonMagnet` · `panahPanas` · `uapKepul`.

**Outro YouTube (Bos 19 Nov) — `KS.logoYT(T, a, b, {x,y,uk})`** di `kerangka-shorts.js`: ikon play merah resmi (juga `studio-aset/ikon-youtube.svg`, bentuk/warna tidak diubah) + "Ternyata Begitu" dalam pil gelap, fade 0,25 dtk, tanpa kalimat ajakan. Pakai ±1 dtk terakhir di zona aman (B-01 y 1400; A-02 y 720 agar tidak menutupi tuas sampul).
**SFX baru:** `klik.wav`, `desis.wav`, `derit.wav` (`scripts/buat_sfx_dapur.py`). **Catatan kemulusan (21 Nov):** kamera yang menggeser set (`translate`) bisa menyisakan pita kosong di tepi → saat transisi selesai lapisan lama hilang dan `cek_mulus` membaca "frame dobel"; pasang latar penuh di luar `kamera()` atau jaga cy = 960.

**Aset JARI KERIPUT & KAMAR MANDI AIR (Yoga, 22 Nov 2026, B-02) — `studio-aset/aset-jari.js`** (muat setelah aset-set.js; `tanganPolos` dari aset-sambal.js): `ujungJari(x,y,s,rot,t,{keriput,bengkak,kedut,glow})` (jari raksasa sisi telapak, pangkal di (x,y)) + `titikJari` + `tetesMengalir` (tetes MENGALIR turun, bukan memantul) · `benangDalang` + `palangDalang` (tangan bayangan tanpa wajah) · `airBak(w,h,t,{muka})` · `dindingKeramik` · `tepiBak` · `gayung` · `spons({kembung,mata})` · `capX` · `emberCucian` · `orangHanduk` (tampak belakang, tanpa wajah) + `.saraf()` + `jalurSaraf(titik,t,{k,pulsa,putus,redup})` · `tanganRendam({keriput,saraf})` (netral, tanpa ikon medis) · `penampangJari(x,y,w,h,t,{sinyal,sempit,kempes,lipat,panahSempit,tarik})` (x-ray kulit: kulit luar panjang tetap melipat) · `sarungBantal({isi,mata})` + `kapas` · `banMotor(x,y,R,t,{putar,cipratan})` (generik) · `ubinBasah` · `kelereng({basah})` · `mangkuk` · `stopwatchPolos` (tanpa angka) · `balokKayu` · `ikonJari(…,keriput,{lencana})` · `siluetJasLab` · `gelembungCoret` · `kartuPilihan` + `miniBak`/`miniEmber`/`sungaiKampung` · `lorongRumah({pintuX,buka})` · `jamDinding` · `uap` · `orangAntre`. Contoh: `antrean/2026-11-22_b-02-jari-keriput/visual/video.html`. **Catatan kemulusan (22 Nov):** gerak bolak-balik (tangan memindah benda) dengan kecepatan nol di ujung memicu "frame dobel" → pakai lintasan elips kontinu (kecepatan tak pernah nol) dan lengan pendek; pan kamera ≥ 45 px/dtk dengan set selebar 1500.

**Aset SABUN & MINYAK (Yoga, 25 Nov 2026, A3-05) — `studio-aset/aset-sabun.js`** (muat setelah aset-set.js; `kartuPilihan` dari aset-jari.js): `SABUN` (palet lemon/ungu/air) · `WAJAN` (geometri) · `bakCuci(t,{kilap,keran,tetes,genang,busa,butir,kesat,saluran})` (bak cuci stainless dapur kuning hangat, keran mengalir, wajan berminyak, rak piring polos) · `wajanAtas(t,{kilap,butir})` (sampul wajan dari atas) · `tanganTebe(x,y,rot,s,t,{kilap,spons,jari})` (tangan Tebe + lengan hoodie) · `butir` · `genanganMinyak` · `kilapMinyak` · `penampang(t,{lantai})` (tampak samping permukaan wajan) · `arus` (garis arus bilas) · `duniaXray` · `kecebong(x,y,s,rot,t,{nyalaK,nyalaE,minus})` (molekul sabun: kepala putih suka air, ekor zigzag kuning) · `misel(x,y,R,t,{k,n,minus,topi,kilau})` (bola kecil: inti minyak + kulit kepala) · `topiKurir` · `ikonGelas/ikonPiring/ikonWajan`. Contoh: `antrean/2026-11-25_a3-05-sabun-minyak-piring/visual/video.html`.

**Aset REM MOTOR (Yoga, 22 Nov 2026, A-06) — `studio-aset/aset-rem.js`** (muat setelah aset-set.js; aset-pedas.js opsional untuk keringat): `penampangRem(t,{tuas,gelombang,panas,air,gelembung,putar,gaya,empuk,sorot,cairanHangat,jari})` (X-ray tuas → master silinder → selang amber → kaliper → cakram; panas = oranye HANGAT) · `titikSelang(u)` + `panahTekanan` (chevron tekanan berukuran sama) · `makroKaliper(t,{tekan,tuasSudut,gelombang,gaya,panahKecil,putar,panas,lintasan,gelembung})` (diagram belah piston kecil ↔ piston BESAR, cakram tampak tepi) · `motorMatic(x,y,s,t,{roda,tembus,tarik,sorotSelang,pengendara,penumpang,warna})` (skuter generik tanpa merek) · `tanganMotor` (medium shot satu jari di tuas) · `simpangLampuMerah(w,h,P,t,{lampu,hujan,tiangX,zebraX,jalan})` · `tanganRaksasa` + `gumpalCairan` · `tongkatCair({tuang,lentur,cipratan})` · `bilikKostum` + `siGerak` (energi gerak ganti kostum api) · `papanTulis` (tabung U tanpa tulisan) · `tabungMinyak({level,serap})` · `tetesUdara({n,k,laju,uk})` · `jariKurus` · `latarBengkel`. Catatan render: `svgW` dengan `overflow:visible` + latar diperluas supaya tepi set tidak terlihat saat kamera zoom < 1. Contoh: `antrean/2026-11-22_a-06-rem-motor/visual/video.html`.

**Aset LAYAR SENTUH (Yoga, 23 Nov 2026, A3-06) — `studio-aset/aset-layar.js`** (muat setelah aset-set.js; `kartuPilihan`/`bakCuciPiring`/`ujungJari` dari aset-jari.js): dunia indigo + kisi cyan. `proyeksi({cx,cy,rot,tilt,skala})` → p(u,v,h) (perspektif bidang layar; animasikan tilt/rot/skala = kamera 3D mulus) · `slabLayar(p,t,{W,H,kisi,kisiA,sentuh,sedot,cincin,target,wajah:{u,v,r,k,siul},kaca,badan})` (penampang x-ray HP: badan, kisi kabel bening, simpul berpendar yang meredup di titik sentuh, butir "tersedot", cincin medan, penanda target, simpul berwajah buang muka + not siul) · `tetesKaca({goyang,sidik,glow,mata})` · `genangan` (beberapa tetes berdempet) · `kartuKuis(…,'tekanan'|'panas'|'listrik',{coret,nyala,redup,teks})` · `petir` · `jariHantu` (lucu, bukan seram) · `tanganAkuarium({listrik})` (tangan berisi air) · `hpGenerik({gulir,basah,tekan})` (tanpa merek/poni, UI tanpa huruf) · `tanganPegangHP({basah})` · `dapurMalam(w,h,t,{bakX,jendelaX})` · `manusiaTetes` · `miniWudu` · `miniHujan`. Contoh: `antrean/2026-11-23_a3-06-layar-hp-tangan-basah/visual/video.html`.

**Aset BARCODE KASIR (Yoga, 24 Nov 2026, A3-01) — `studio-aset/aset-barcode.js`** (muat setelah aset-set.js): dunia putih-krem + aksen merah, SEMUA fiktif. `polaBar(benih)` + `posBar` (pola garis acak, bukan pengodean EAN) · `barcodeFiktif(x,y,W,H,{pola,angka,kedip,leleh,sorot,label})` (pakai deret angka dengan digit cek SALAH) · `bungkusMie({wajah,lengan,bc})` (polos tanpa tulisan; `MIE_BC` posisi barcode) · `scannerGenggam({sinar,nyala,tangan})` (generik) · `layarKasir({harga,hargaBaru,flip,nama})` (tanpa mata uang) · `mejaKasirSiang(w,h,t,{meja})` · `komputerToko({cari,senang})` · `lemariDaftar({buka,sorot,label,cari})` + `posLaci` · `kartuNomor` · `ktpBarang` (fiktif: foto kosong + titik) · `gelembungPikir` + `kantongUang` · `capSilang` · `ledakanDiskon` (tanpa tulisan/persen) · `labelGanti({lama,baru,flip})` · `petaDunia({pabrik})` (benua bulat tanpa batas negara) + `ikonPabrik` · `kartuKubu` · `hpPolos({kirim})` · `pesawatKertas` · `orangKasir` (tanpa wajah). SFX baru `bip.wav`, `cap.wav` (`scripts/buat_sfx_barcode.py`). Contoh: `antrean/2026-11-24_a3-01-barcode-kasir/visual/video.html`.
