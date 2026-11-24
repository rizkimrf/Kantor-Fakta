/* ===== SET NYAMUK PILIH-PILIH (Yoga, 25 Nov 2026, video B3-10) — teras malam + lab generik =====
 * Muat SETELAH aset-set.js. Gaya datar tanpa garis hitam; palet BIRU DONGKER malam + HIJAU LIMAU neon + MERAH bentol (TANPA ungu,
 * beda dari A3-05 sabun & 2 sampul terakhir). Semua fungsi murni (fungsi waktu kontinu t), mengembalikan string SVG.
 * Tanpa tulisan/logo/merek/nama lembaga/angka di dalam gambar. Nyamuk kartun lucu, tanpa darah/jarum; bentol = bulatan merah muda.
 *  terasMalam(x0,y0,w,h,t,o)   langit malam + bintang + taman gelap + dinding rumah + lantai ubin (o.lantai = y lantai)
 *  bohlam(x,y,s,t,o)            bohlam gantung + glow hangat (o.kedip 0..1 meredup, o.tali panjang tali)
 *  kursi(x,y,s,warna,o)        kursi plastik generik · mejaKecil(x,y,s) · gelasTeh(x,y,s,t)
 *  nyamuk(x,y,s,t,o)            nyamuk kartun bermata besar; o.arah (1 kanan / -1 kiri), o.ekspresi 'biasa'|'senang'|'seringai'|'menguap'|'cuek',
 *                               o.kacamata 0..1, o.piring 0..1, o.glow 0..1, o.lihat [dx,dy], o.kepala (derajat), o.sayap (fase), o.kaki (ayun)
 *  pita(titik,t,o)              pita kabut napas biru muda bergelombang melalui titik-titik [[x,y],...] (o.a, o.k = panjang tergambar 0..1)
 *  titikBau(x,y,t,o)            titik-titik aroma naik (o.warna, o.n, o.tinggi, o.a, o.pola 'bulat'|'cincin'|'bintang'|'campur', o.lebar)
 *  bentol(x,y,s,k)              bentol bulat merah muda (k 0..1 tumbuh)
 *  kakiDuduk(x,y,s,o)           kaki orang duduk tampak depan (lutut ke bawah + celana/sarung), o.kulit, o.celana, o.sandal
 *  awanSial(x,y,s,t,a)          awan abu "sial" kecil berhujan · tanya(x,y,s,a,warna) · ikonMagnet(x,y,s,rot,a)
 *  labLatar(x0,y0,w,h,t,o)      dinding lab mint + jendela malam + rak botol polos + meja (o.meja = y permukaan meja)
 *  kotakBening(x,y,s,o)         kotak kasa bening generik · lengan(x,y,s,t,o) lengan bawah horizontal + sarung nilon polos (o.nilon 0..1, o.manset warna, o.tetes 0..1, o.nTetes)
 *  nilonGantung(x,y,s,t,o)      sarung nilon polos tergantung (o.tetes, o.nTetes, o.tag warna label tanpa huruf, o.kilau)
 *  tetes(x,y,s,warna,a)         tetes "zat" generik tanpa rumus · meteran(x,y,s,isi,t) tabung kecil tetes hijau tanpa angka
 *  kalenderKosong(x,y,s,balik)  kalender dinding polos, lembar membalik (balik = jumlah lembar, kontinu) · tanaman(x,y,s,tumbuh) · sarang(x,y,s,k)
 *  lencana(x,y,s,jenis,a)       lencana pilih kubu tanpa huruf: 'kamu' (limau, wajah Tebe) | 'dia' (putih, siluet orang) · hp(x,y,s,rot)
 */
(function (root) {
  const f1 = (v) => Math.round(v * 10) / 10, f3 = (v) => Math.round(v * 1000) / 1000;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const halus = (x) => { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  let _n = 0; const uid = (p) => `${p}N${++_n}`;
  const g = (x, y, s, isi, rot = 0, sy) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)} ${f3(sy ?? s)})">${isi}</g>`;
  const C = {
    LANGIT0: "#081229", LANGIT: "#0E1C3E", DONGKER: "#13234A", DONGKER2: "#1C3263", DONGKER3: "#27427A", DONGKER4: "#34528F",
    TAMAN: "#0A2433", TAMAN2: "#0F3140", TAMAN3: "#164152", DINDING: "#1D3360", DINDING2: "#243D70",
    UBIN: "#2B4677", UBIN2: "#35528A", UBIN3: "#22396A",
    LIMAU: "#B8F03C", LIMAU2: "#8ED11F", LIMAUL: "#E4FFA8", MERAH: "#E8394B", BENTOL: "#FF8FA0", BENTOL2: "#F2677E",
    BOHLAM: "#FFE6A0", HANGAT: "#FFC85A", KABUT: "#A9DAFF", KABUT2: "#D7EEFF",
    TEAL: "#2FB3A5", TEAL2: "#23968A", PUTIH: "#F4F7FB", ABU: "#9AA8BF", ABU2: "#C6D1E0",
    NYAMUK: "#3A4566", NYAMUK2: "#4D5A80", BELANG: "#E9EEF8",
    LAB: "#E6F2EE", LAB2: "#D3E6E0", LAB3: "#BCD6CE", MEJA: "#CFE2DC", MEJA2: "#A9C7BF", LOGAM: "#9DB3BF",
    KUL: "#E9B48C", KULG: "#C98E68", KULT: "#B77B55", KULS: "#F3CDAA", KULD: "#8E5B3E",
    MUSTARD: "#FFC93C", MUSTARD2: "#E5A91A", INK: "#18233A",
  };

  // ---------- TERAS MALAM ----------
  function terasMalam(x0, y0, w, h, t = 0, o = {}) {
    const lt = o.lantai ?? 1330, id = uid("tm");
    let s = `<defs><linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.LANGIT0}"/><stop offset="1" stop-color="${C.DONGKER2}"/></linearGradient>
<radialGradient id="${id}u" cx=".5" cy="0" r="1"><stop offset="0" stop-color="${C.UBIN2}"/><stop offset="1" stop-color="${C.UBIN3}"/></radialGradient></defs>`;
    s += `<rect x="${x0}" y="${y0}" width="${w}" height="${lt - y0}" fill="url(#${id}l)"/>`;
    // bintang berkelip (posisi tetap, kelip fungsi waktu)
    for (let i = 0; i < 46; i++) {
      const bx = x0 + ((i * 397) % w), by = y0 + ((i * 211) % Math.max(200, lt - y0 - 420)), k = .35 + .45 * Math.pow(Math.sin(t * (.8 + (i % 5) * .3) + i), 2);
      s += `<circle cx="${bx}" cy="${by}" r="${i % 7 ? 2.4 : 4}" fill="#DCE8FF" opacity="${f3(k)}"/>`;
    }
    // bulan sabit kecil
    if (o.bulan) s += `<circle cx="${o.bulan[0]}" cy="${o.bulan[1]}" r="46" fill="#F3F0D8"/><circle cx="${o.bulan[0] + 22}" cy="${o.bulan[1] - 12}" r="42" fill="${C.LANGIT}"/>`;
    // taman gelap: semak & pohon pisang/palem siluet
    const hz = lt - 120;
    for (let i = 0; i < Math.ceil(w / 160) + 2; i++) {
      const bx = x0 + i * 160 - 40, r = 90 + ((i * 37) % 50), goy = Math.sin(t * .7 + i) * 3;
      s += `<circle cx="${bx}" cy="${hz + 20 + goy}" r="${r}" fill="${i % 2 ? C.TAMAN : C.TAMAN2}"/>`;
    }
    for (let i = 0; i < Math.ceil(w / 520); i++) {
      const px = x0 + 260 + i * 520 + ((i * 131) % 120), py = hz - 40, sw = Math.sin(t * .6 + i * 2) * 3;
      s += `<rect x="${px - 10}" y="${py - 380}" width="20" height="400" rx="8" fill="${C.TAMAN3}"/>`;
      for (let d = 0; d < 5; d++) { const a = -150 + d * 30 + sw; s += `<path d="M${px} ${py - 380} q${f1(Math.cos(a * Math.PI / 180) * 120)} ${f1(Math.sin(a * Math.PI / 180) * 120 - 40)} ${f1(Math.cos(a * Math.PI / 180) * 230)} ${f1(Math.sin(a * Math.PI / 180) * 230 + 40)}" stroke="${C.TAMAN3}" stroke-width="34" fill="none" stroke-linecap="round"/>`; }
    }
    // kunang-kunang limau halus
    for (let i = 0; i < 8; i++) { const q = (t * .07 + i / 8) % 1, fx = x0 + ((i * 263) % w) + Math.sin(t + i) * 30, fy = hz - 60 - q * 260; s += `<circle cx="${f1(fx)}" cy="${f1(fy)}" r="5" fill="${C.LIMAU}" opacity="${f3(.5 * Math.sin(Math.PI * q))}"/>`; }
    // dinding rumah (kiri) + tiang teras
    if (o.dinding !== false) {
      const dw = o.dindingW ?? 520, dx = o.dindingX ?? x0;
      s += `<rect x="${dx}" y="${y0}" width="${dw}" height="${lt - y0}" fill="${C.DINDING}"/><rect x="${dx + dw - 40}" y="${y0}" width="40" height="${lt - y0}" fill="${C.DINDING2}"/>`;
      s += `<rect x="${dx + 80}" y="${lt - 620}" width="250" height="620" rx="10" fill="${C.DONGKER}"/><rect x="${dx + 96}" y="${lt - 604}" width="218" height="604" rx="6" fill="#1A2C57"/><circle cx="${dx + 290}" cy="${lt - 300}" r="10" fill="${C.HANGAT}" opacity=".8"/>`;
      s += `<rect x="${dx + dw + 520}" y="${y0}" width="46" height="${lt - y0}" fill="${C.DINDING2}" opacity=".9"/>`;
    }
    // atap teras
    s += `<rect x="${x0}" y="${y0}" width="${w}" height="${o.atap ?? 120}" fill="#0B1733"/>`;
    // lantai ubin
    s += `<rect x="${x0}" y="${lt}" width="${w}" height="${y0 + h - lt}" fill="url(#${id}u)"/>`;
    let gy = lt, dy = 26; while (gy < y0 + h) { s += `<rect x="${x0}" y="${f1(gy)}" width="${w}" height="3" fill="${C.UBIN3}" opacity=".7"/>`; gy += dy; dy *= 1.35; }
    for (let i = -20; i <= 20; i++) { const xa = 540 + i * 120, xb = 540 + i * 300; s += `<path d="M${xa} ${lt} L${xb} ${y0 + h}" stroke="${C.UBIN3}" stroke-width="3" opacity=".6"/>`; }
    s += `<rect x="${x0}" y="${lt - 6}" width="${w}" height="12" fill="${C.DONGKER3}"/>`;
    return s;
  }
  function bohlam(x, y, s, t = 0, o = {}) {
    const kd = cl(o.kedip || 0), terang = 1 - .75 * kd, id = uid("bh"), tali = o.tali ?? 260, ay = Math.sin(t * 1.1) * 2;
    return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${C.BOHLAM}" stop-opacity="${f3(.55 * terang)}"/><stop offset=".45" stop-color="${C.HANGAT}" stop-opacity="${f3(.18 * terang)}"/><stop offset="1" stop-color="${C.HANGAT}" stop-opacity="0"/></radialGradient></defs>`
      + `<circle cx="${x}" cy="${y}" r="${520 * s}" fill="url(#${id})"/>`
      + g(x, y, s, `<g transform="rotate(${f1(ay)} 0 ${-tali})"><rect x="-3" y="${-tali}" width="6" height="${tali - 40}" fill="#0A1228"/><rect x="-18" y="-50" width="36" height="34" rx="6" fill="#4A5570"/><circle cx="0" cy="0" r="34" fill="${kd > .5 ? "#C9B98A" : C.BOHLAM}"/><circle cx="-10" cy="-8" r="10" fill="#FFFFFF" opacity="${f3(.8 * terang)}"/></g>`);
  }
  function kursi(x, y, s, warna = C.TEAL, o = {}) {
    const w2 = o.gelap || "#1E8C80";
    return g(x, y, s, `<ellipse cx="0" cy="0" rx="130" ry="16" fill="#000" opacity=".2"/>
<path d="M-110 -260 Q-110 -460 0 -470 Q110 -460 110 -260Z" fill="${warna}"/>${[-60, -20, 20, 60].map((xx) => `<rect x="${xx - 8}" y="-430" width="16" height="120" rx="8" fill="${w2}"/>`).join("")}
<path d="M-120 -270 L120 -270 L112 -220 L-112 -220Z" fill="${warna}"/><path d="M-112 -220 L-130 0 L-104 0 L-80 -220Z M112 -220 L130 0 L104 0 L80 -220Z" fill="${w2}"/>`, 0, s * (o.sy || 1));
  }
  function mejaKecil(x, y, s) { return g(x, y, s, `<ellipse cx="0" cy="0" rx="130" ry="14" fill="#000" opacity=".2"/><rect x="-140" y="-230" width="280" height="26" rx="10" fill="#E6E9F0"/><rect x="-120" y="-206" width="20" height="206" fill="#B9C2D3"/><rect x="100" y="-206" width="20" height="206" fill="#B9C2D3"/>`); }
  function gelasTeh(x, y, s, t = 0) {
    let q = `<path d="M-30 -90 L30 -90 L24 0 L-24 0Z" fill="#FFFFFF" opacity=".55"/><path d="M-27 -60 L27 -60 L24 0 L-24 0Z" fill="#C8682A"/><rect x="-30" y="-94" width="60" height="8" rx="4" fill="#FFFFFF" opacity=".7"/>`;
    for (let i = 0; i < 2; i++) { const q2 = (t * .5 + i / 2) % 1; q += `<path d="M${-8 + i * 16} ${-100 - q2 * 70} q12 -14 0 -28" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" opacity="${f3(.5 * Math.sin(Math.PI * q2))}"/>`; }
    return g(x, y, s, q);
  }

  // ---------- NYAMUK kartun ----------
  function nyamuk(x, y, s, t = 0, o = {}) {
    const ar = o.arah ?? 1, ek = o.ekspresi || "biasa", fase = o.sayap ?? t * 2 * Math.PI * 7.5;
    const kp = o.kepala || 0, lh = o.lihat || [0, 0], ayun = o.kaki ?? Math.sin(t * 2.3) * 6;
    let q = "";
    if (o.glow) q += `<circle cx="10" cy="0" r="260" fill="${C.LIMAU}" opacity="${f3(.1 * o.glow)}"/><circle cx="10" cy="0" r="180" fill="${C.LIMAU}" opacity="${f3(.16 * o.glow)}"/><circle cx="20" cy="-10" r="110" fill="${C.LIMAUL}" opacity="${f3(.14 * o.glow)}"/>`;
    // kaki (6, tipis melengkung, tergantung)
    for (let i = 0; i < 6; i++) {
      const bx = -18 + (i % 3) * 18, sisi = i < 3 ? 1 : -1, a = ayun * (i % 2 ? 1 : -1);
      q += `<path d="M${bx} 18 q${-30 + i % 3 * 14} ${50 + a} ${-46 + i % 3 * 30} ${120 + a * 1.2}" stroke="${C.NYAMUK}" stroke-width="7" fill="none" stroke-linecap="round" opacity="${sisi > 0 ? 1 : .75}"/>`;
      q += `<circle cx="${-46 + i % 3 * 30 + bx}" cy="${138 + a * 1.2}" r="5" fill="${C.BELANG}" opacity=".9"/>`;
    }
    // perut belang (belakang, kiri lokal)
    q += `<g transform="rotate(-14 -30 0)"><ellipse cx="-118" cy="8" rx="96" ry="34" fill="${C.NYAMUK}"/>${[-170, -132, -94, -58].map((xx) => `<rect x="${xx}" y="-22" width="12" height="60" rx="6" fill="${C.BELANG}" opacity=".95"/>`).join("")}<ellipse cx="-118" cy="-6" rx="70" ry="10" fill="#FFFFFF" opacity=".12"/></g>`;
    // sayap belakang
    const sb = Math.sin(fase) * 26, sd = Math.sin(fase + .6) * 22;
    q += `<g transform="rotate(${f1(-30 + sb)} -6 -26)"><ellipse cx="-70" cy="-64" rx="92" ry="34" fill="#E6F4FF" opacity=".38"/><ellipse cx="-70" cy="-64" rx="92" ry="34" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".6"/><path d="M-6 -30 Q-70 -60 -150 -70" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".45"/></g>`;
    // dada
    q += `<ellipse cx="0" cy="0" rx="46" ry="42" fill="${C.NYAMUK2}"/><path d="M-20 -30 Q0 -40 20 -30" stroke="${C.BELANG}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".9"/>`;
    // sayap depan
    q += `<g transform="rotate(${f1(-50 + sd)} 4 -30)"><ellipse cx="-56" cy="-78" rx="86" ry="30" fill="#F2FAFF" opacity=".45"/><ellipse cx="-56" cy="-78" rx="86" ry="30" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".7"/></g>`;
    // kepala
    let h = `<circle cx="0" cy="0" r="46" fill="${C.NYAMUK2}"/>`;
    // antena
    h += `<path d="M10 -40 q10 -40 40 -56 M-4 -42 q-2 -44 20 -64" stroke="${C.NYAMUK}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="50" cy="-96" r="6" fill="${C.BELANG}"/><circle cx="16" cy="-106" r="6" fill="${C.BELANG}"/>`;
    // belalai pendek lucu (ujung bulat, tanpa darah)
    h += `<path d="M38 18 Q70 30 96 50" stroke="${C.NYAMUK}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="97" cy="51" r="5" fill="${C.NYAMUK}"/>`;
    // mata besar
    const mata = (ex, ey, r) => {
      if (ek === "menguap" || ek === "cuek") return `<path d="M${ex - r * .7} ${ey + 2} q${r * .7} ${ek === "cuek" ? -12 : 10} ${r * 1.4} 0" stroke="#0C1226" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      if (ek === "senang") return `<path d="M${ex - r * .7} ${ey + 4} q${r * .7} -${r * .9} ${r * 1.4} 0" stroke="#0C1226" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      const kd = (t * 1.1 + (o.benih || 0)) % 3.7 < .1;
      if (kd) return `<path d="M${ex - r * .7} ${ey} l${r * 1.4} 0" stroke="#0C1226" stroke-width="6" stroke-linecap="round"/>`;
      return `<ellipse cx="${ex}" cy="${ey}" rx="${r}" ry="${r * 1.12}" fill="#FFFFFF"/><circle cx="${f1(ex + 4 + lh[0])}" cy="${f1(ey + 3 + lh[1])}" r="${r * .58}" fill="#0C1226"/><circle cx="${f1(ex + lh[0] - 2)}" cy="${f1(ey - 4 + lh[1])}" r="${r * .2}" fill="#FFFFFF"/>`;
    };
    h += mata(6, -6, 20) + mata(34, -2, 16);
    if (ek === "seringai") h += `<path d="M-6 -30 l26 10 M30 -26 l18 6" stroke="#0C1226" stroke-width="5" stroke-linecap="round"/>`;
    // mulut
    if (ek === "menguap") h += `<ellipse cx="22" cy="24" rx="11" ry="${f1(10 + 4 * Math.sin(t * 3))}" fill="#5A1E2A"/>`;
    else if (ek === "seringai") h += `<path d="M6 20 Q24 36 40 18" stroke="#0C1226" stroke-width="5" fill="#FFFFFF" stroke-linecap="round"/>`;
    else h += `<path d="M10 22 Q22 30 32 22" stroke="#0C1226" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    h += `<ellipse cx="-6" cy="16" rx="9" ry="5" fill="${C.BENTOL}" opacity=".5"/>`;
    if (o.kacamata) { const a = f3(cl(o.kacamata)); h += `<g opacity="${a}"><circle cx="6" cy="-6" r="25" fill="#BFE6FF" fill-opacity=".15" stroke="${C.MUSTARD}" stroke-width="6"/><circle cx="36" cy="-2" r="21" fill="#BFE6FF" fill-opacity=".15" stroke="${C.MUSTARD}" stroke-width="6"/><path d="M31 -4 l-0 0" stroke="${C.MUSTARD}" stroke-width="5"/><path d="M-19 -8 l-18 -6" stroke="${C.MUSTARD}" stroke-width="5" stroke-linecap="round"/></g>`; }
    q += `<g transform="translate(44 -22) rotate(${f1(kp)})">${h}</g>`;
    // piring kecil + garpu (prasmanan)
    if (o.piring) q += `<g opacity="${f3(cl(o.piring))}" transform="translate(40 92)"><ellipse cx="0" cy="0" rx="50" ry="13" fill="#FFFFFF"/><ellipse cx="0" cy="-2" rx="34" ry="7" fill="${C.ABU2}"/><path d="M58 -6 l0 -54 M50 -60 l0 14 M58 -60 l0 14 M66 -60 l0 14" stroke="${C.ABU}" stroke-width="5" stroke-linecap="round"/></g>`;
    return g(x, y, s * ar, q, o.rot || 0, s);
  }

  // ---------- pita kabut napas ----------
  function pita(titik, t = 0, o = {}) {
    const a = o.a ?? 1, kk = cl(o.k ?? 1); if (a <= 0.001 || kk <= 0) return "";
    const n = 90, pts = [];
    const titikPada = (u) => { const m = titik.length - 1, i = Math.min(m - 1, Math.floor(u * m)), f = u * m - i, A = titik[i], B = titik[i + 1]; return [lerp(A[0], B[0], f), lerp(A[1], B[1], f)]; };
    for (let i = 0; i <= n * kk; i++) {
      const u = i / n, p = titikPada(u), q = titikPada(Math.min(1, u + .01)), dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
      const w = Math.sin(u * 18 - t * 3) * 26 * (o.gelombang ?? 1);
      pts.push([p[0] - dy / L * w, p[1] + dx / L * w]);
    }
    if (pts.length < 2) return "";
    const d = pts.map((p, i) => (i ? "L" : "M") + f1(p[0]) + " " + f1(p[1])).join("");
    const tb = o.tebal ?? 46;
    return `<g opacity="${f3(a)}"><path d="${d}" stroke="${C.KABUT}" stroke-width="${tb * 1.8}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".18"/><path d="${d}" stroke="${C.KABUT}" stroke-width="${tb}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/><path d="${d}" stroke="${C.KABUT2}" stroke-width="${tb * .3}" fill="none" stroke-linecap="round" stroke-dasharray="30 26" stroke-dashoffset="${f1(-t * 90)}" opacity=".8"/></g>`;
  }
  pita.titik = (titik, u) => { const m = titik.length - 1, uu = cl(u), i = Math.min(m - 1, Math.floor(uu * m)), f = uu * m - i, A = titik[i], B = titik[i + 1]; return [lerp(A[0], B[0], f), lerp(A[1], B[1], f)]; };

  // ---------- titik bau ----------
  function titikBau(x, y, t = 0, o = {}) {
    const a = o.a ?? 1; if (a <= 0.001) return "";
    const n = o.n || 12, H = o.tinggi || 360, W = o.lebar || 60, w = o.warna || C.LIMAU, pola = o.pola || "bulat", v = o.laju || .45;
    let s = "";
    for (let i = 0; i < n; i++) {
      const q = (t * v + i / n) % 1, px = x + Math.sin(q * 7 + i * 1.7) * W * (.4 + q), py = y - q * H, al = a * Math.sin(Math.PI * q), r = (o.r || 10) * (1 - .4 * q);
      const jenis = pola === "campur" ? ["bulat", "cincin", "bintang"][i % 3] : pola;
      if (jenis === "cincin") s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r * 1.2)}" fill="none" stroke="${w}" stroke-width="${f1(r * .5)}" opacity="${f3(al)}"/>`;
      else if (jenis === "bintang") s += g(px, py, r / 10, `<path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3Z" fill="${w}" opacity="${f3(al)}"/>`, q * 90);
      else s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r * 1.9)}" fill="${w}" opacity="${f3(al * .25)}"/><circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r)}" fill="${w}" opacity="${f3(al)}"/>`;
    }
    return s;
  }
  function bentol(x, y, s, k = 1) {
    if (k <= 0.001) return ""; const e = k >= 1 ? 1 : 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2);
    return g(x, y, s * e, `<circle r="15" fill="${C.BENTOL}" opacity=".55"/><circle r="10" fill="${C.BENTOL2}"/><circle cx="-3" cy="-3" r="3.5" fill="#FFFFFF" opacity=".6"/>`);
  }
  function kakiDuduk(x, y, s, o = {}) {
    const kul = o.kulit || C.KUL, kulg = o.kulitG || C.KULG, cel = o.celana || C.DONGKER3;
    let q = `<ellipse cx="0" cy="0" rx="150" ry="18" fill="#000" opacity=".22"/>`;
    for (const sx of [-1, 1]) {
      q += `<rect x="${sx * 62 - 30}" y="-330" width="60" height="320" rx="28" fill="${kul}"/><rect x="${sx * 62 - 30}" y="-330" width="20" height="320" rx="10" fill="${kulg}" opacity=".35"/>`;
      q += `<path d="M${sx * 62 - 40} -10 Q${sx * 62} -34 ${sx * 62 + 46 * sx} -8 L${sx * 62 + 52 * sx} 8 L${sx * 62 - 44} 8Z" fill="${o.sandal || "#3A3F55"}"/>`;
    }
    if (o.sarung) q += `<path d="M-120 -420 L120 -420 L132 -250 Q0 -226 -132 -250Z" fill="${cel}"/>${[0, 1, 2].map((i) => `<rect x="-120" y="${-400 + i * 50}" width="240" height="10" fill="#FFFFFF" opacity=".18"/>`).join("")}`;
    else q += `<path d="M-110 -440 L110 -440 L116 -300 L14 -300 L0 -330 L-14 -300 L-116 -300Z" fill="${cel}"/>`;
    return g(x, y, s, q);
  }
  function awanSial(x, y, s, t = 0, a = 1) {
    if (a <= 0.001) return "";
    let q = `<ellipse cx="0" cy="0" rx="90" ry="44" fill="#8C97AE"/><circle cx="-36" cy="-24" r="40" fill="#8C97AE"/><circle cx="24" cy="-34" r="48" fill="#9AA5BC"/>`;
    for (let i = 0; i < 4; i++) { const q2 = (t * 1.8 + i / 4) % 1; q += `<rect x="${-54 + i * 34}" y="${f1(46 + q2 * 80)}" width="7" height="24" rx="3.5" fill="${C.KABUT}" opacity="${f3(1 - q2)}"/>`; }
    return `<g opacity="${f3(a)}">${g(x, y, s, q)}</g>`;
  }
  function tanya(x, y, s, a = 1, warna = C.LIMAU) { if (a <= 0.001) return ""; return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${f1(120 * s)}" fill="${warna}" opacity="${f3(a)}" stroke="${C.INK}" stroke-width="${f1(10 * s)}" paint-order="stroke">?</text>`; }
  function ikonMagnet(x, y, s, rot = 0, a = 1) {
    if (a <= 0.001) return "";
    return `<g opacity="${f3(a)}">` + g(x, y, s, `<path d="M-70 -10 L-70 40 Q-70 110 0 110 Q70 110 70 40 L70 -10 L30 -10 L30 40 Q30 70 0 70 Q-30 70 -30 40 L-30 -10Z" fill="${C.MERAH}"/><rect x="-70" y="-50" width="40" height="40" fill="${C.ABU2}"/><rect x="30" y="-50" width="40" height="40" fill="${C.ABU2}"/><path d="M-56 30 Q-56 92 0 94" stroke="#FFFFFF" stroke-width="8" fill="none" opacity=".35" stroke-linecap="round"/>
<path d="M-50 -70 l-10 -26 M0 -76 l0 -30 M50 -70 l10 -26" stroke="${C.LIMAU}" stroke-width="8" stroke-linecap="round"/>`, rot) + `</g>`;
  }

  // ---------- LAB GENERIK ----------
  function labLatar(x0, y0, w, h, t = 0, o = {}) {
    const mj = o.meja ?? 1250, id = uid("lb");
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.LAB}"/><stop offset="1" stop-color="${C.LAB2}"/></linearGradient></defs><rect x="${x0}" y="${y0}" width="${w}" height="${mj - y0}" fill="url(#${id})"/>`;
    // panel dinding
    for (let i = 0; i < Math.ceil(w / 360); i++) s += `<rect x="${x0 + i * 360}" y="${y0}" width="6" height="${mj - y0}" fill="${C.LAB3}" opacity=".6"/>`;
    // jendela malam
    const jw = o.jendela || [x0 + 120, y0 + 220, 420, 380];
    if (jw) {
      s += `<rect x="${jw[0] - 16}" y="${jw[1] - 16}" width="${jw[2] + 32}" height="${jw[3] + 32}" rx="18" fill="${C.LAB3}"/><rect x="${jw[0]}" y="${jw[1]}" width="${jw[2]}" height="${jw[3]}" rx="8" fill="${C.DONGKER}"/>`;
      for (let i = 0; i < 9; i++) s += `<circle cx="${jw[0] + 30 + ((i * 97) % (jw[2] - 60))}" cy="${jw[1] + 30 + ((i * 61) % (jw[3] - 120))}" r="3" fill="#DCE8FF" opacity="${f3(.4 + .4 * Math.sin(t + i))}"/>`;
      s += `<circle cx="${jw[0] + jw[2] - 90}" cy="${jw[1] + 90}" r="40" fill="#F3F0D8"/><circle cx="${jw[0] + jw[2] - 70}" cy="${jw[1] + 78}" r="36" fill="${C.DONGKER}"/><rect x="${jw[0] + jw[2] / 2 - 6}" y="${jw[1]}" width="12" height="${jw[3]}" fill="${C.LAB3}"/>`;
    }
    // rak + botol polos (tanpa label)
    if (o.rak !== false) {
      const rx = o.rakX ?? x0 + 640, ry = o.rakY ?? y0 + 470;
      s += `<rect x="${rx}" y="${ry}" width="560" height="18" rx="8" fill="${C.MEJA2}"/>`;
      [[40, 90, C.LIMAU], [130, 120, C.KABUT], [230, 80, C.TEAL], [320, 130, C.LIMAU2], [430, 100, C.KABUT]].forEach(([bx, bh, wr], i) => {
        s += `<path d="M${rx + bx - 26} ${ry} L${rx + bx + 26} ${ry} L${rx + bx + 18} ${ry - bh + 30} L${rx + bx + 10} ${ry - bh} L${rx + bx - 10} ${ry - bh} L${rx + bx - 18} ${ry - bh + 30}Z" fill="#FFFFFF" opacity=".7"/><path d="M${rx + bx - 24} ${ry - 4} L${rx + bx + 24} ${ry - 4} L${rx + bx + 19} ${ry - bh * .5} L${rx + bx - 19} ${ry - bh * .5}Z" fill="${wr}" opacity=".8"/>`;
      });
    }
    // meja
    s += `<rect x="${x0}" y="${mj}" width="${w}" height="${y0 + h - mj}" fill="${C.MEJA2}"/><rect x="${x0}" y="${mj}" width="${w}" height="70" fill="${C.MEJA}"/><rect x="${x0}" y="${mj + 70}" width="${w}" height="10" fill="#8FB1A8"/>`;
    return s;
  }
  function kotakBening(x, y, s, o = {}) {
    const w = o.w || 300, hh = o.h || 340;
    let q = `<ellipse cx="0" cy="6" rx="${w * .55}" ry="16" fill="#000" opacity=".12"/><rect x="${-w / 2}" y="${-hh}" width="${w}" height="${hh}" rx="18" fill="#EAF8FF" opacity=".28"/>`;
    for (let i = 1; i < 6; i++) q += `<rect x="${-w / 2 + i * w / 6 - 1}" y="${-hh}" width="2" height="${hh}" fill="#FFFFFF" opacity=".25"/>`;
    for (let i = 1; i < 6; i++) q += `<rect x="${-w / 2}" y="${-hh + i * hh / 6 - 1}" width="${w}" height="2" fill="#FFFFFF" opacity=".22"/>`;
    q += `<rect x="${-w / 2}" y="${-hh}" width="${w}" height="${hh}" rx="18" fill="none" stroke="#FFFFFF" stroke-width="8" opacity=".75"/><rect x="${-w / 2}" y="-18" width="${w}" height="18" rx="6" fill="${C.LOGAM}"/><path d="M${-w / 2 + 20} ${-hh + 20} l40 0 l-40 80Z" fill="#FFFFFF" opacity=".35"/>`;
    return g(x, y, s, q);
  }
  function tetes(x, y, s, warna = C.LIMAU, a = 1) {
    if (a <= 0.001) return "";
    return g(x, y, s, `<path d="M0 -16 Q12 0 10 6 Q8 16 0 16 Q-8 16 -10 6 Q-12 0 0 -16Z" fill="${warna}" opacity="${f3(a)}"/><circle cx="-3" cy="4" r="3" fill="#FFFFFF" opacity="${f3(.7 * a)}"/>`);
  }
  function polaTetes(x0, y0, w, h, n, t, a, benih = 1, warna = C.LIMAU) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const px = x0 + ((i * 137 + benih * 53) % 1000) / 1000 * w, py = y0 + ((i * 271 + benih * 97) % 1000) / 1000 * h, k = a * (.6 + .4 * Math.sin(t * 3 + i * 1.3));
      s += tetes(px, py, .9 + ((i * 7) % 5) * .12, warna, k);
      if (i % 3 === 0) s += `<path d="M${f1(px + 16)} ${f1(py - 20)} l0 ${f1(-14 * k)} M${f1(px + 9)} ${f1(py - 27)} l${f1(14 * k)} 0" stroke="#FFFFFF" stroke-width="3.5" opacity="${f3(k)}" stroke-linecap="round"/>`;
    }
    return s;
  }
  function lengan(x, y, s, t = 0, o = {}) {
    const kul = o.kulit || C.KUL, kulg = o.kulitG || C.KULG, L = o.panjang || 460, nl = cl(o.nilon ?? 1);
    let q = `<ellipse cx="${L * .5}" cy="58" rx="${L * .55}" ry="16" fill="#000" opacity=".14"/>`;
    q += `<rect x="0" y="-44" width="${L}" height="88" rx="44" fill="${kul}"/><rect x="0" y="14" width="${L}" height="22" rx="11" fill="${kulg}" opacity=".35"/>`;
    // tangan (mitten + jempol)
    q += `<ellipse cx="${L + 40}" cy="4" rx="70" ry="52" fill="${kul}"/><ellipse cx="${L + 20}" cy="-44" rx="22" ry="34" fill="${kul}" transform="rotate(-30 ${L + 20} -44)"/>${[0, 1, 2].map((i) => `<path d="M${L + 72} ${-22 + i * 22} l28 0" stroke="${kulg}" stroke-width="5" stroke-linecap="round" opacity=".5"/>`).join("")}`;
    // sarung nilon polos (menutup dari pangkal sampai pergelangan sesuai nl)
    if (nl > 0) {
      const nw = (L - 10) * nl, id = uid("nl"), x0 = o.dariTangan ? L + 2 - nw : -8;
      q += `<defs><pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="#FFFFFF" opacity=".0"/><rect width="2" height="18" fill="#FFFFFF" opacity=".55"/></pattern></defs>`;
      q += `<rect x="${f1(x0)}" y="-52" width="${f1(nw + 8)}" height="104" rx="48" fill="#F4FAFF" opacity=".42"/><rect x="${f1(x0)}" y="-52" width="${f1(nw + 8)}" height="104" rx="48" fill="url(#${id})"/><rect x="${f1(o.dariTangan ? x0 : nw - 18)}" y="-54" width="22" height="108" rx="10" fill="#FFFFFF" opacity=".75"/>`;
      if (o.tetes) q += polaTetes(x0 + 28, -40, Math.max(10, nw - 50), 80, o.nTetes || 10, t, cl(o.tetes) * nl, o.benih || 1, o.warnaTetes || C.LIMAU);
    }
    if (o.manset) q += `<rect x="-60" y="-62" width="80" height="124" rx="24" fill="${o.manset}"/><rect x="0" y="-62" width="20" height="124" rx="8" fill="${C.MUSTARD2}" opacity=".6"/>`;
    return g(x, y, s, q, o.rot || 0);
  }
  function nilonGantung(x, y, s, t = 0, o = {}) {
    const ay = Math.sin(t * 1.4 + (o.benih || 0)) * 3, id = uid("ng");
    let q = `<rect x="-4" y="-40" width="8" height="40" fill="${C.LOGAM}"/><circle cx="0" cy="-44" r="10" fill="${C.LOGAM}"/>`;
    q += `<defs><pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2" height="16" fill="#FFFFFF" opacity=".6"/></pattern></defs>`;
    const bentuk = `M-50 0 Q-58 120 -52 260 Q-48 320 0 326 Q48 320 52 260 Q58 120 50 0Z`;
    q += `<g transform="rotate(${f1(ay)} 0 0)"><path d="${bentuk}" fill="#F4FAFF" opacity=".5"/><path d="${bentuk}" fill="url(#${id})"/><rect x="-54" y="-4" width="108" height="20" rx="8" fill="#FFFFFF" opacity=".85"/>`;
    if (o.kilau) q += `<path d="${bentuk}" fill="${C.LIMAU}" opacity="${f3(.12 * o.kilau)}"/>`;
    if (o.tetes) q += polaTetes(-40, 30, 80, 270, o.nTetes || 8, t, cl(o.tetes), o.benih || 1);
    if (o.tag) q += `<rect x="-26" y="22" width="52" height="34" rx="8" fill="${o.tag}"/><circle cx="-12" cy="39" r="5" fill="${C.INK}" opacity=".5"/>`;
    q += `</g>`;
    return g(x, y, s, q);
  }
  function meteran(x, y, s, isi = 1, t = 0) {
    const h = 300 * cl(isi);
    let q = `<rect x="-40" y="-320" width="80" height="340" rx="40" fill="#FFFFFF" opacity=".55"/><rect x="-28" y="${-10 - h}" width="56" height="${f1(h + 2)}" rx="26" fill="${C.LIMAU2}"/>`;
    for (let i = 0; i < 5; i++) { const q2 = (t * .5 + i / 5) % 1; q += `<circle cx="${f1(Math.sin(i * 2 + t) * 10)}" cy="${f1(-20 - q2 * h * .9)}" r="6" fill="${C.LIMAUL}" opacity="${f3(.8 * Math.sin(Math.PI * q2))}"/>`; }
    q += `<rect x="-40" y="-320" width="80" height="340" rx="40" fill="none" stroke="#FFFFFF" stroke-width="8"/>`;
    return g(x, y, s, q);
  }
  function kalenderKosong(x, y, s, balik = 0) {
    const n = Math.floor(balik), f = balik - n, kk = Math.cos(Math.PI * f), warnaHal = (i) => (i % 2 ? "#FFFFFF" : "#F6F9FF");
    let q = `<rect x="-130" y="-150" width="260" height="300" rx="20" fill="#FFFFFF"/><rect x="-130" y="-150" width="260" height="70" rx="20" fill="${C.DONGKER2}"/><rect x="-130" y="-100" width="260" height="20" fill="${C.DONGKER2}"/>`;
    const grid = (op) => { let z = ""; for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) z += `<rect x="${-110 + c * 44}" y="${-60 + r * 48}" width="32" height="32" rx="6" fill="${C.ABU2}" opacity="${op}"/>`; return z; };
    q += `<rect x="-130" y="-80" width="260" height="230" fill="${warnaHal(n + 1)}"/>` + grid(1);
    if (f > 0.001) q += `<g transform="translate(0 -80) scale(1 ${f3(Math.abs(kk))})"><rect x="-130" y="${kk > 0 ? 0 : -230}" width="260" height="230" fill="${kk > 0 ? warnaHal(n) : "#DDE5F2"}"/></g>`;
    q += `<rect x="-90" y="-170" width="14" height="44" rx="7" fill="${C.INK}"/><rect x="76" y="-170" width="14" height="44" rx="7" fill="${C.INK}"/>`;
    return g(x, y, s, q);
  }
  function tanaman(x, y, s, tumbuh = 0) {
    const h = 60 + 260 * cl(tumbuh);
    let q = `<path d="M-60 0 L60 0 L48 -90 L-48 -90Z" fill="${C.MUSTARD2}"/><rect x="-66" y="-104" width="132" height="22" rx="8" fill="${C.MUSTARD}"/><rect x="-5" y="${-90 - h}" width="10" height="${h}" rx="5" fill="#5BA34A"/>`;
    const nd = 2 + Math.floor(cl(tumbuh) * 6);
    for (let i = 0; i < nd; i++) { const yy = -110 - (i + 1) * h / (nd + .5), sx = i % 2 ? 1 : -1; q += `<path d="M0 ${f1(yy)} q${sx * 40} -30 ${sx * 80} -6 q${-sx * 40} 30 ${-sx * 80} 6Z" fill="#6FC05A"/>`; }
    return g(x, y, s, q);
  }
  function sarang(x, y, s, k = 0) {
    if (k <= 0.001) return ""; let q = "";
    for (let i = 0; i < 6; i++) { const a = i / 5 * Math.PI / 2; q += `<path d="M0 0 L${f1(Math.cos(a) * 200 * k)} ${f1(Math.sin(a) * 200 * k)}" stroke="#FFFFFF" stroke-width="3" opacity=".7"/>`; }
    for (let r = 1; r <= 4; r++) { if (r / 4 > k + .01) break; const rr = r * 48; let d = ""; for (let i = 0; i <= 5; i++) { const a = i / 5 * Math.PI / 2; d += (i ? "Q" + f1(Math.cos(a - .16) * rr * .86) + " " + f1(Math.sin(a - .16) * rr * .86) + " " : "M") + f1(Math.cos(a) * rr) + " " + f1(Math.sin(a) * rr); } q += `<path d="${d}" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".6"/>`; }
    return g(x, y, s, q);
  }
  function lencana(x, y, s, jenis = "kamu", a = 1) {
    if (a <= 0.001) return "";
    let q = `<path d="M0 -150 L0 -110" stroke="#FFFFFF" stroke-width="8"/><circle cx="0" cy="0" r="110" fill="${jenis === "kamu" ? C.LIMAU : "#FFFFFF"}"/><circle cx="0" cy="0" r="94" fill="none" stroke="${C.INK}" stroke-width="8" opacity=".25"/>`;
    if (jenis === "kamu") q += `<ellipse cx="0" cy="16" rx="56" ry="52" fill="${C.KULS}"/><path d="M-58 4 Q-60 -56 0 -58 Q60 -56 58 4 Q30 -24 0 -22 Q-30 -24 -58 4Z" fill="#4A2E1A"/><path d="M-10 -60 Q-12 -96 18 -94 Q40 -90 30 -70" stroke="#4A2E1A" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="-20" cy="18" r="8" fill="${C.INK}"/><circle cx="20" cy="18" r="8" fill="${C.INK}"/><path d="M-16 40 Q0 52 16 40" stroke="${C.INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    else q += `<circle cx="0" cy="-20" r="40" fill="${C.DONGKER3}"/><path d="M-66 74 Q-60 20 0 20 Q60 20 66 74Z" fill="${C.DONGKER3}"/>`;
    return `<g opacity="${f3(a)}">` + g(x, y, s, q) + `</g>`;
  }
  function hp(x, y, s, rot = 0) { return g(x, y, s, `<rect x="-36" y="-64" width="72" height="128" rx="14" fill="${C.INK}"/><rect x="-28" y="-52" width="56" height="100" rx="6" fill="${C.DONGKER3}"/><circle cx="-6" cy="-14" r="12" fill="${C.LIMAU}"/><rect x="-18" y="8" width="36" height="8" rx="4" fill="#FFFFFF" opacity=".7"/><rect x="-18" y="24" width="24" height="8" rx="4" fill="#FFFFFF" opacity=".5"/>`, rot); }

  root.ASET = root.ASET || {};
  root.ASET.NYAMUK = { C, terasMalam, bohlam, kursi, mejaKecil, gelasTeh, nyamuk, pita, titikBau, bentol, kakiDuduk, awanSial, tanya, ikonMagnet,
    labLatar, kotakBening, tetes, polaTetes, lengan, nilonGantung, meteran, kalenderKosong, tanaman, sarang, lencana, hp };
})(typeof window !== "undefined" ? window : globalThis);
