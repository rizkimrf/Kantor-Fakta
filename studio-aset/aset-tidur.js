/* ===== SET TIDUR & HUTAN MALAM (Yoga, 25 Nov 2026, video B3-05 "kaget pas mau tidur") =====
 * Muat SETELAH tebe-rig.js. Gaya datar tanpa garis hitam; palet JINGGA-KUNING lampu tidur + KREM + KORAL (TANPA biru/ungu/hijau,
 * beda dari B3-10 nyamuk dongker-limau & A3-05 sabun ungu). Fungsi murni (fungsi waktu kontinu t), mengembalikan string SVG.
 * Tanpa tulisan/angka/logo di dalam gambar (simbol "?" boleh). Tanpa hantu/sosok gelap/gambar medis.
 *  kamar(t,o)                 kamar tidur malam hangat (koordinat 1080x1920 + margin): dinding krem, jendela malam amber + bulan, jam dinding
 *                             tanpa angka, meja + lampu tidur (glow), lantai kayu, ranjang kayu + kasur + seprai koral. o.redup 0..1, o.lampu 0..1
 *  KASUR                      geometri ranjang {x0,x1,atas} untuk menaruh Tebe/selimut
 *  selimut(t,o)               selimut krem di atas kasur (o.x0 tepi kiri, o.gelombang 0..1, o.angkat px, o.fase)
 *  bantal(x,y,s,rot,o)        bantal krem bergaris koral (o.kilau 0..1 = berkilau seperti barang pameran)
 *  tanggaIlusi(x,y,s,a,hilang) anak tangga garis pucat (perumpamaan), anak tangga terakhir memudar (hilang 0..1)
 *  hati(x,y,s,k)              hati koral (k = denyut 0..1) · garisGerak(x,y,s,a,t) garis gerak melingkar + kepulan
 *  panahMerah(x0,y0,x1,y1,a)  satu panah merah lengkung (sampul)
 *  ruangPeneliti(t,o)         meja kerja peneliti generik krem-jingga · peneliti(x,y,s,t,o) jas lab polos tanpa logo/nama (o.kulit,o.rambut,o.aksi)
 *  mapKasus(x,y,s,o)          map kardus bersimbol "?" (o.buka 0..1, o.balik 0..1) · bulu(x,y,s,rot)
 *  perumahan(t,o)             perumahan malam (rumah + rusun kecil, jendela hangat); o.sentak = [{i, t0}] selimut di jendela i tersentak
 *  papanGabus(x,y,s,t,o)      papan gabus 4 kartu: o.kartu[i] = {buka 0..1, isi:'otot'|'pohon'|'', stempel 0..1, goyang 0..1}
 *  ikonOtot(x,y,s,k) · ikonPohon(x,y,s)  isi kartu dugaan (tanpa huruf)
 *  ruangKepala(t,o)           dalam kepala: latar hangat + dasbor jarum + ikon orang jatuh + tombol merah (o.jarum 0..1, o.tekan 0..1)
 *  otak(x,y,s,t,o)            otak kartun lucu koral-merah muda (o.mata 0..1 membesar, o.topi 0..1 topi satpam, o.senter 0..1, o.kaget 0..1)
 *  lorong(t,o)                lorong malam hangat + sorot senter + bayangan otak di dinding (o.sorot 0..1, o.bayang 0..1)
 *  hutanPurba(t,o)            hutan purba malam: bulan amber, pohon raksasa + dahan tebal, daun krem, buah koral (o.redup)
 *  DAHAN                      geometri dahan utama tempat Tebe tidur · manusiaPurba(x,y,s,t,o) siluet manusia meringkuk (BUKAN kera)
 *  lonceng(x,y,s,t,o)         lonceng alarm kartun kuningan (o.dering 0..1, o.jejak [[x,y],...] jejak cahaya)
 *  sorotPanggung(x,y,a,t) · taliBeludru(x,y,s,a)   lampu sorot pameran + tiang tali beludru
 *  lencanaPose(x,y,s,jenis,a) lencana pose tidur tanpa huruf: 'miring'|'telentang'|'tengkurap' · hp(x,y,s,rot) ponsel generik
 *  sliderTegang(x,y,s,k)      penggeser "tegang" vertikal (k 1 atas tegang koral → 0 bawah santai krem)
 */
(function (root) {
  const f1 = (v) => Math.round(v * 10) / 10, f3 = (v) => Math.round(v * 1000) / 1000;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const halus = (x) => { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  let _n = 0; const uid = (p) => `${p}T${++_n}`;
  const g = (x, y, s, isi, rot = 0, sy) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)} ${f3(sy ?? s)})">${isi}</g>`;
  const C = {
    DINDING: "#F6E4C2", DINDING2: "#EBCF9F", DINDING3: "#DDB880", LANTAI: "#C27E4C", LANTAI2: "#A96638", LANTAI3: "#8E5430",
    KAYU: "#B36F42", KAYU2: "#8E5330", KAYU3: "#D08C58", KREM: "#FFF3DA", KREM2: "#F4DDB4", KREM3: "#E4C390",
    KORAL: "#F2715A", KORAL2: "#D9553F", KORAL3: "#FF9A82", LAMPU: "#FFC861", LAMPU2: "#FFB040", LAMPUL: "#FFE7A8",
    JINGGA: "#FF9B3D", JINGGA2: "#E77B22", MALAM: "#4A2A1C", MALAM2: "#6E3D22", MALAM3: "#8C5230", BULAN: "#FFEFC8",
    INK: "#3A1E12", MERAH: "#E2232E", OTAK: "#F79A8E", OTAK2: "#E57465", OTAK3: "#FFC2B6", MUSTARD: "#FFC93C",
    KUL1: "#F1C39A", KUL2: "#C98E68", KUL3: "#9A6444", RAMBUT: "#4A2E1A", JAS: "#FFF8EC", JAS2: "#EADBC2",
  };
  const ID = { glow: "tdGlow", glowL: "tdGlowL" };

  // ---------- KAMAR TIDUR MALAM HANGAT ----------
  const KASUR = { x0: 250, x1: 1060, atas: 1196, kepala: 236 };
  function jamDinding(x, y, s, t) {
    const a = t * 6, b = t * 0.5; // jarum bergerak pelan (tanpa angka)
    return g(x, y, s, `<circle r="62" fill="${C.KAYU2}" opacity=".25" cx="5" cy="7"/><circle r="62" fill="${C.KORAL}"/><circle r="50" fill="${C.KREM}"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="-3" y="-46" width="6" height="11" rx="3" fill="${C.KREM3}" transform="rotate(${i * 90})"/>`).join("")}
      <rect x="-3" y="-32" width="6" height="34" rx="3" fill="${C.INK}" transform="rotate(${f1(b)})"/><rect x="-2" y="-42" width="4" height="44" rx="2" fill="${C.KORAL2}" transform="rotate(${f1(a)})"/><circle r="6" fill="${C.INK}"/>`);
  }
  function lampuTidur(x, y, s, t, nyala = 1) {
    const k = nyala * (0.96 + 0.04 * Math.sin(t * 3.1));
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="60" ry="10" fill="${C.INK}" opacity=".18"/><path d="M-34 0 Q-40 -60 0 -70 Q40 -60 34 0Z" fill="${C.KORAL}"/><path d="M-10 -66 L-8 -120 L8 -120 L10 -66Z" fill="${C.KAYU2}"/>
      <path d="M-78 -116 L78 -116 L52 -236 L-52 -236Z" fill="${C.LAMPUL}" opacity="${f3(0.75 + 0.25 * k)}"/><path d="M-78 -116 L78 -116 L72 -128 L-72 -128Z" fill="${C.LAMPU2}" opacity=".8"/>
      <ellipse cx="0" cy="-118" rx="74" ry="12" fill="#FFF8DC" opacity="${f3(0.9 * k)}"/>`);
  }
  function kamar(t = 0, o = {}) {
    const red = o.redup || 0, nyala = o.lampu ?? 1, LT = 1500;
    let s = `<defs><radialGradient id="${ID.glow}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.LAMPUL}" stop-opacity=".95"/><stop offset=".45" stop-color="${C.LAMPU}" stop-opacity=".45"/><stop offset="1" stop-color="${C.LAMPU2}" stop-opacity="0"/></radialGradient>
<linearGradient id="tdJendela" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.MALAM}"/><stop offset="1" stop-color="${C.MALAM3}"/></linearGradient>
<linearGradient id="tdDinding" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.DINDING2}"/><stop offset=".6" stop-color="${C.DINDING}"/><stop offset="1" stop-color="${C.DINDING2}"/></linearGradient></defs>`;
    s += `<rect x="-1000" y="-800" width="3600" height="${LT + 800}" fill="url(#tdDinding)"/>`;
    // pelipit & motif titik dinding (lembut)
    for (let i = 0; i < 26; i++) for (let j = 0; j < 12; j++) s += (i + j) % 2 ? "" : `<circle cx="${-900 + i * 140}" cy="${-600 + j * 170}" r="7" fill="${C.DINDING3}" opacity=".35"/>`;
    s += `<rect x="-1000" y="${LT - 300}" width="3600" height="16" fill="${C.KAYU3}" opacity=".55"/>`;
    // jendela malam (amber gelap, bulan krem, bintang hangat) + gorden koral
    const JX = 640, JY = 640, JW = 340, JH = 400;
    s += `<rect x="${JX - 18}" y="${JY - 18}" width="${JW + 36}" height="${JH + 36}" rx="20" fill="${C.KAYU}"/><rect x="${JX}" y="${JY}" width="${JW}" height="${JH}" rx="10" fill="url(#tdJendela)"/>`;
    s += `<circle cx="${JX + 250}" cy="${JY + 110}" r="46" fill="${C.BULAN}"/><circle cx="${JX + 250}" cy="${JY + 110}" r="80" fill="${C.BULAN}" opacity=".12"/>`;
    for (let i = 0; i < 9; i++) s += `<circle cx="${JX + 30 + ((i * 113) % (JW - 60))}" cy="${JY + 30 + ((i * 71) % 260)}" r="${i % 3 ? 2.6 : 4}" fill="${C.LAMPUL}" opacity="${f3(0.4 + 0.4 * Math.pow(Math.sin(t * 1.3 + i), 2))}"/>`;
    s += `<path d="M${JX} ${JY + JH - 90} q60 -40 120 -10 q70 -50 130 -20 q40 -20 90 0 L${JX + JW} ${JY + JH} L${JX} ${JY + JH}Z" fill="${C.MALAM}" opacity=".9"/>`;
    s += `<rect x="${JX + JW / 2 - 7}" y="${JY}" width="14" height="${JH}" fill="${C.KAYU}"/><rect x="${JX}" y="${JY + JH / 2 - 7}" width="${JW}" height="14" fill="${C.KAYU}"/>`;
    const gg = Math.sin(t * 0.8) * 6;
    s += `<path d="M${JX - 60} ${JY - 50} L${JX + 70} ${JY - 50} Q${JX + 40 + gg} ${JY + 200} ${JX + 60} ${JY + JH + 60} L${JX - 60} ${JY + JH + 60}Z" fill="${C.KORAL}"/><path d="M${JX + JW + 60} ${JY - 50} L${JX + JW - 70} ${JY - 50} Q${JX + JW - 40 - gg} ${JY + 200} ${JX + JW - 60} ${JY + JH + 60} L${JX + JW + 60} ${JY + JH + 60}Z" fill="${C.KORAL}"/>`;
    s += `<rect x="${JX - 90}" y="${JY - 70}" width="${JW + 180}" height="22" rx="11" fill="${C.KAYU2}"/>`;
    // jam dinding tanpa angka
    s += jamDinding(160, 760, 1, t);
    // rak kecil + bingkai polos
    s += `<rect x="-420" y="900" width="300" height="18" rx="6" fill="${C.KAYU}"/><rect x="-380" y="800" width="90" height="100" rx="8" fill="${C.KORAL3}"/><rect x="-270" y="830" width="110" height="70" rx="8" fill="${C.KREM2}"/>`;
    // lantai kayu
    s += `<rect x="-1000" y="${LT}" width="3600" height="1300" fill="${C.LANTAI}"/>`;
    for (let i = 0; i < 6; i++) s += `<rect x="-1000" y="${LT + 40 + i * i * 34}" width="3600" height="5" fill="${C.LANTAI2}" opacity=".7"/>`;
    s += `<ellipse cx="560" cy="${LT + 120}" rx="620" ry="70" fill="${C.KORAL2}" opacity=".35"/><ellipse cx="560" cy="${LT + 110}" rx="560" ry="56" fill="${C.KORAL}" opacity=".5"/>`;
    // meja samping + lampu tidur (kiri)
    s += `<rect x="-40" y="1240" width="250" height="260" rx="14" fill="${C.KAYU2}"/><rect x="-50" y="1226" width="270" height="30" rx="10" fill="${C.KAYU}"/><rect x="-20" y="1300" width="210" height="80" rx="8" fill="${C.KAYU}"/><circle cx="85" cy="1340" r="9" fill="${C.LAMPU}"/>`;
    s += `<circle cx="90" cy="1020" r="${f1(520 + 14 * Math.sin(t * 2))}" fill="url(#${ID.glow})" opacity="${f3(0.85 * nyala)}"/>`;
    s += lampuTidur(90, 1228, 1.05, t, nyala);
    // ranjang kayu: sandaran kepala (kiri), rangka, kasur, seprai koral
    const K = KASUR;
    s += `<rect x="${K.x0 - 40}" y="${K.atas - 330}" width="70" height="${1500 - K.atas + 330}" rx="26" fill="${C.KAYU2}"/><rect x="${K.x0 - 30}" y="${K.atas - 320}" width="50" height="40" rx="16" fill="${C.KAYU3}"/>`;
    s += `<rect x="${K.x0}" y="${K.atas + 120}" width="${K.x1 - K.x0 + 400}" height="150" rx="18" fill="${C.KAYU}"/><rect x="${K.x0}" y="${K.atas + 250}" width="${K.x1 - K.x0 + 400}" height="20" fill="${C.KAYU2}"/>`;
    s += `<rect x="${K.x0 + 30}" y="${K.atas + 260}" width="40" height="${1500 - K.atas - 250}" fill="${C.KAYU2}"/>`;
    s += `<rect x="${K.x0}" y="${K.atas}" width="${K.x1 - K.x0 + 400}" height="140" rx="30" fill="${C.KORAL}"/><rect x="${K.x0}" y="${K.atas + 96}" width="${K.x1 - K.x0 + 400}" height="44" rx="12" fill="${C.KORAL2}"/>`;
    s += `<ellipse cx="640" cy="${K.atas + 330}" rx="520" ry="26" fill="${C.INK}" opacity=".12"/>`;
    if (red > 0) s += `<rect x="-1000" y="-800" width="3600" height="3400" fill="${C.MALAM}" opacity="${f3(red * 0.55)}"/>`;
    return s;
  }
  // selimut krem bergelombang (digambar DI ATAS Tebe)
  function selimut(t, o = {}) {
    const K = KASUR, x0 = o.x0 ?? 560, x1 = K.x1 + 420, y = K.atas + 10 - (o.angkat || 0), gl = o.gelombang || 0, ph = o.fase ?? t * 9;
    let atas = `M${x0} ${y + 40}`;
    for (let x = x0; x <= x1; x += 40) { const k = (x - x0) / (x1 - x0), w = Math.sin(k * 9 - ph) * 26 * gl * (1 - 0.5 * k); atas += ` L${x} ${f1(y - 6 + w - Math.sin(Math.PI * cl((x - x0) / 260)) * 34)}`; }
    const p = `${atas} L${x1} ${K.atas + 132} L${x0 + 30} ${K.atas + 132} Q${x0 - 24} ${K.atas + 70} ${x0} ${y + 40}Z`;
    return `<path d="${p}" fill="${C.KREM}"/><path d="${p}" fill="${C.KREM3}" opacity=".35" transform="translate(0 18)"/>
      <path d="M${x0 + 10} ${K.atas + 96} L${x1} ${K.atas + 96}" stroke="${C.KREM2}" stroke-width="14"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${x0 + 90 + i * 110}" cy="${K.atas + 56 + Math.sin(i * 2 - ph) * 10 * gl}" r="10" fill="${C.KORAL3}" opacity=".7"/>`).join("")}`;
  }
  function bantal(x, y, s, rot = 0, o = {}) {
    const k = o.kilau || 0;
    let isi = `<ellipse cx="6" cy="16" rx="128" ry="30" fill="${C.INK}" opacity=".12"/><path d="M-130 -30 Q-140 -64 -96 -66 L96 -66 Q140 -64 130 -30 Q138 10 96 20 L-96 20 Q-138 10 -130 -30Z" fill="${C.KREM}"/>
      <path d="M-110 -10 L110 -10" stroke="${C.KORAL3}" stroke-width="10" stroke-linecap="round" opacity=".8"/><path d="M-120 -40 Q-60 -54 0 -46" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity=".5" fill="none"/>`;
    if (k > 0) for (let i = 0; i < 5; i++) { const a = i * 1.26, r = 150 + 20 * Math.sin(i * 3), ss = k * (0.6 + 0.4 * Math.sin(o.t * 6 + i * 2));
      isi += `<g transform="translate(${f1(Math.cos(a) * r)} ${f1(Math.sin(a) * r * 0.55 - 30)}) scale(${f3(ss)})"><path d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6Z" fill="#FFF8DC"/></g>`; }
    return g(x, y, s, isi, rot);
  }
  function tanggaIlusi(x, y, s, a, hilang = 0) {
    if (a <= 0) return "";
    let isi = "";
    for (let i = 0; i < 5; i++) { const op = i === 4 ? 1 - hilang : 1, dy = i === 4 ? hilang * 60 : 0;
      isi += `<path d="M${i * 90} ${i * 70 + dy} l90 0 l0 70" fill="none" stroke="${C.KREM}" stroke-width="10" stroke-linecap="round" stroke-dasharray="18 16" opacity="${f3(op)}"/>`; }
    return `<g opacity="${f3(a * 0.85)}">${g(x, y, s, isi)}</g>`;
  }
  function hati(x, y, s, k = 0) {
    const sc = s * (1 + 0.28 * k);
    return g(x, y, sc, `<circle r="44" fill="${C.KORAL3}" opacity="${f3(0.35 * k)}"/><path d="M0 26 C-46 -4 -36 -40 -14 -40 C-4 -40 0 -32 0 -26 C0 -32 4 -40 14 -40 C36 -40 46 -4 0 26Z" fill="${C.KORAL}"/><path d="M-22 -26 Q-14 -34 -6 -28" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>`);
  }
  function garisGerak(x, y, s, a, t) {
    if (a <= 0) return "";
    let isi = "";
    for (let i = 0; i < 7; i++) { const ang = -150 + i * 34 + Math.sin(t * 7 + i) * 4, r0 = 250, r1 = 310 + (i % 2) * 26, rad = ang * Math.PI / 180;
      isi += `<path d="M${f1(Math.cos(rad) * r0)} ${f1(Math.sin(rad) * r0 * 0.7)} L${f1(Math.cos(rad) * r1)} ${f1(Math.sin(rad) * r1 * 0.7)}" stroke="${C.JINGGA2}" stroke-width="14" stroke-linecap="round"/>`; }
    for (let i = 0; i < 4; i++) { const px = -260 + i * 170, q = (t * 1.2 + i * 0.3) % 1;
      isi += `<circle cx="${px}" cy="${f1(200 - q * 30)}" r="${f1(20 + q * 18)}" fill="${C.KREM}" opacity="${f3(0.7 * (1 - q))}"/>`; }
    return `<g opacity="${f3(a)}">${g(x, y, s, isi)}</g>`;
  }
  function panahMerah(x0, y0, x1, y1, a) {
    if (a <= 0) return "";
    const mx = (x0 + x1) / 2 - (y1 - y0) * 0.3, my = (y0 + y1) / 2 + (x1 - x0) * 0.3, ang = Math.atan2(y1 - my, x1 - mx);
    const hx = x1 - Math.cos(ang) * 10, hy = y1 - Math.sin(ang) * 10, p = (d, q) => [hx + Math.cos(ang + q) * d, hy + Math.sin(ang + q) * d];
    const [ax, ay] = p(-70, -0.55), [bx, by] = p(-70, 0.55);
    return `<g opacity="${f3(a)}"><path d="M${x0} ${y0} Q${f1(mx)} ${f1(my)} ${f1(x1 - Math.cos(ang) * 40)} ${f1(y1 - Math.sin(ang) * 40)}" stroke="#FFFFFF" stroke-width="40" fill="none" stroke-linecap="round" opacity=".9"/><path d="M${x0} ${y0} Q${f1(mx)} ${f1(my)} ${f1(x1 - Math.cos(ang) * 40)} ${f1(y1 - Math.sin(ang) * 40)}" stroke="${C.MERAH}" stroke-width="26" fill="none" stroke-linecap="round"/>
      <path d="M${f1(x1)} ${f1(y1)} L${f1(ax)} ${f1(ay)} L${f1(bx)} ${f1(by)}Z" fill="${C.MERAH}" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round" paint-order="stroke"/></g>`;
  }

  // ---------- MEJA PENELITI GENERIK ----------
  function ruangPeneliti(t, o = {}) {
    let s = `<rect x="-1000" y="-800" width="3600" height="3400" fill="${C.DINDING2}"/>`;
    for (let i = 0; i < 20; i++) s += `<rect x="${-900 + i * 180}" y="-800" width="90" height="2300" fill="${C.DINDING}" opacity=".55"/>`;
    // papan tulis polos + rak botol polos
    s += `<rect x="90" y="480" width="560" height="360" rx="18" fill="${C.KAYU}"/><rect x="110" y="500" width="520" height="320" rx="10" fill="#F9EBD0"/><path d="M160 700 q60 -80 120 -10 t120 -20 t120 10" stroke="${C.KREM3}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    s += `<rect x="740" y="560" width="300" height="16" rx="6" fill="${C.KAYU}"/>${[0, 1, 2, 3].map((i) => `<rect x="${760 + i * 70}" y="${470 + (i % 2) * 20}" width="44" height="${90 - (i % 2) * 20}" rx="12" fill="${[C.KORAL3, C.LAMPU, C.KREM, C.JINGGA][i]}"/>`).join("")}`;
    s += `<circle cx="540" cy="300" r="${f1(400 + 10 * Math.sin(t * 2))}" fill="url(#${ID.glow})" opacity=".55"/>`;
    // meja
    s += `<rect x="-1000" y="1280" width="3600" height="1400" fill="${C.KAYU2}"/><rect x="-1000" y="1260" width="3600" height="44" fill="${C.KAYU}"/>`;
    return s;
  }
  function peneliti(x, y, s, t, o = {}) {
    const kul = o.kulit || C.KUL1, rb = o.rambut || C.RAMBUT, ak = o.aksi || "", ph = (o.fase || 0) + t;
    const gar = ak === "garuk" ? Math.sin(ph * 14) * 6 : 0, bahu = ak === "angkat" ? 1 : 0;
    const tgnN = ak === "garuk" ? `<path d="M48 -150 Q100 -230 40 -300" stroke="${C.JAS}" stroke-width="44" fill="none" stroke-linecap="round"/><circle cx="${40 + gar}" cy="-306" r="22" fill="${kul}"/>`
      : ak === "angkat" ? `<path d="M50 -150 Q120 -160 128 -230" stroke="${C.JAS}" stroke-width="44" fill="none" stroke-linecap="round"/><circle cx="130" cy="-240" r="22" fill="${kul}"/>`
      : `<path d="M50 -150 Q90 -80 70 -20" stroke="${C.JAS}" stroke-width="44" fill="none" stroke-linecap="round"/><circle cx="70" cy="-14" r="22" fill="${kul}"/>`;
    const tgnK = ak === "angkat" ? `<path d="M-50 -150 Q-120 -160 -128 -230" stroke="${C.JAS}" stroke-width="44" fill="none" stroke-linecap="round"/><circle cx="-130" cy="-240" r="22" fill="${kul}"/>`
      : ak === "balik" ? `<path d="M-50 -150 Q-30 -60 20 -40" stroke="${C.JAS}" stroke-width="44" fill="none" stroke-linecap="round"/><circle cx="26" cy="-36" r="22" fill="${kul}"/>`
      : `<path d="M-50 -150 Q-90 -80 -70 -20" stroke="${C.JAS}" stroke-width="44" fill="none" stroke-linecap="round"/><circle cx="-70" cy="-14" r="22" fill="${kul}"/>`;
    const kep = ak === "angkat" ? -6 : ak === "garuk" ? 8 : 0;
    return g(x, y + Math.sin(ph * 2) * 3, s, `<ellipse cx="0" cy="6" rx="110" ry="16" fill="${C.INK}" opacity=".15"/>
      <path d="M-70 0 L-62 -170 Q0 -196 62 -170 L70 0Z" fill="${C.JAS}"/><path d="M0 -186 L-26 -120 L0 -60 L26 -120Z" fill="${o.baju || C.KORAL3}"/><path d="M-62 -170 Q-30 -150 -20 -100" stroke="${C.JAS2}" stroke-width="8" fill="none"/>
      ${tgnK}${tgnN}<rect x="-18" y="-206" width="36" height="30" fill="${kul}"/>
      <g transform="rotate(${kep} 0 -250) translate(0 ${-bahu * 6})"><circle cx="0" cy="-262" r="66" fill="${kul}"/><path d="M-66 -270 Q-60 -340 0 -338 Q62 -338 66 -270 Q40 -300 0 -296 Q-40 -300 -66 -270Z" fill="${rb}"/>
      <circle cx="-22" cy="-262" r="8" fill="${C.INK}"/><circle cx="22" cy="-262" r="8" fill="${C.INK}"/>
      ${o.kacamata ? `<circle cx="-22" cy="-262" r="20" fill="none" stroke="${C.INK}" stroke-width="5"/><circle cx="22" cy="-262" r="20" fill="none" stroke="${C.INK}" stroke-width="5"/><path d="M-2 -262 L2 -262" stroke="${C.INK}" stroke-width="5"/>` : ""}
      <path d="${ak === "angkat" ? "M-16 -224 Q0 -232 16 -224" : "M-14 -226 Q0 -218 14 -226"}" stroke="${C.INK}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`);
  }
  function mapKasus(x, y, s, o = {}) {
    const b = cl(o.buka || 0), bl = cl(o.balik || 0);
    const tutup = `<g transform="translate(0 -150) scale(1 ${f3(1 - 1.9 * b)}) translate(0 150)"><path d="M-190 -150 L190 -150 L190 120 L-190 120Z" fill="${C.KREM3}"/><rect x="-190" y="-150" width="380" height="270" rx="12" fill="#D9A066"/>
      <g opacity="${f3(1 - b)}"><path d="M-36 -64 C-38 -120 52 -124 50 -66 C49 -30 6 -38 4 2" fill="none" stroke="${C.KORAL2}" stroke-width="26" stroke-linecap="round"/><circle cx="4" cy="48" r="16" fill="${C.KORAL2}"/></g></g>`;
    const dalam = `<rect x="-190" y="-150" width="380" height="270" rx="12" fill="#C98A50"/><rect x="-170" y="-130" width="340" height="230" rx="8" fill="#B97A42" opacity=".6"/>`;
    return g(x, y, s, `<rect x="-200" y="-150" width="400" height="290" rx="14" fill="${C.INK}" opacity=".12" transform="translate(10 14)"/><path d="M-190 -150 L-120 -176 L-40 -176 L-20 -150Z" fill="#C98A50"/>${dalam}${tutup}`, bl * 160);
  }
  function bulu(x, y, s, rot = 0) {
    return g(x, y, s, `<path d="M0 -60 Q34 -20 4 60 Q-30 10 0 -60Z" fill="${C.KREM}"/><path d="M0 -50 Q6 0 2 70" stroke="${C.KREM3}" stroke-width="4" fill="none"/>`, rot);
  }

  // ---------- PERUMAHAN MALAM ----------
  // jendela berisi selimut; o.sentak = daftar t0 per jendela (null = tenang)
  const JENDELA = [];
  (function () { // tata letak tetap (koordinat dunia)
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) JENDELA.push([700 + c * 130, 520 + r * 170]); // rusun kanan
    for (let h = 0; h < 3; h++) for (let c = 0; c < 2; c++) JENDELA.push([-60 + h * 250 + c * 100, 1090]); // rumah kiri
  })();
  function perumahan(t, o = {}) {
    let s = `<defs><linearGradient id="tdLangit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2016"/><stop offset=".7" stop-color="${C.MALAM2}"/><stop offset="1" stop-color="${C.MALAM3}"/></linearGradient></defs>`;
    s += `<rect x="-1000" y="-800" width="3600" height="3400" fill="url(#tdLangit)"/>`;
    for (let i = 0; i < 40; i++) s += `<circle cx="${-800 + ((i * 337) % 3000)}" cy="${-700 + ((i * 181) % 1100)}" r="${i % 5 ? 3 : 5}" fill="${C.LAMPUL}" opacity="${f3(0.35 + 0.4 * Math.pow(Math.sin(t * 1.1 + i), 2))}"/>`;
    s += `<circle cx="300" cy="260" r="70" fill="${C.BULAN}"/><circle cx="300" cy="260" r="140" fill="${C.BULAN}" opacity=".1"/>`;
    // siluet kota jauh
    for (let i = 0; i < 14; i++) s += `<rect x="${-900 + i * 260}" y="${760 - ((i * 97) % 260)}" width="220" height="1400" fill="#5A3220" opacity=".8"/>`;
    // rusun kecil kanan
    s += `<rect x="640" y="430" width="440" height="1100" fill="${C.MALAM3}"/><rect x="620" y="410" width="480" height="40" fill="#5A3220"/>`;
    for (let r = 0; r < 4; r++) s += `<rect x="640" y="${640 + r * 170}" width="440" height="14" fill="#5A3220"/>`;
    // rumah kiri (atap)
    for (let h = 0; h < 3; h++) { const hx = -110 + h * 250; s += `<rect x="${hx}" y="1010" width="230" height="520" fill="${h % 2 ? C.MALAM3 : "#7A4628"}"/><path d="M${hx - 20} 1010 L${hx + 115} 900 L${hx + 250} 1010Z" fill="#5A3220"/>`; }
    // jendela + selimut
    JENDELA.forEach(([x, y], i) => {
      const t0 = (o.sentak || [])[i];
      const u = t0 == null ? -1 : t - t0, h = u > 0 && u < 0.5 ? Math.sin(Math.PI * u / 0.5) : 0, sq = u > 0.45 && u < 0.7 ? Math.sin(Math.PI * (u - 0.45) / 0.25) : 0;
      s += `<rect x="${x - 4}" y="${y - 4}" width="88" height="108" rx="8" fill="#5A3220"/><rect x="${x}" y="${y}" width="80" height="100" rx="6" fill="${C.LAMPU}" opacity=".95"/><rect x="${x}" y="${y}" width="80" height="100" rx="6" fill="${C.LAMPUL}" opacity="${f3(0.25 + 0.35 * h)}"/>`;
      s += `<g transform="translate(${x + 40} ${f1(y + 84 - h * 30)}) scale(${f3(1 + sq * 0.15)} ${f3(1 - sq * 0.15)})"><path d="M-30 6 Q-32 -24 -6 -26 Q20 -30 30 -10 Q34 6 30 6Z" fill="${C.KREM}"/><circle cx="-18" cy="-20" r="11" fill="${C.KREM2}"/></g>`;
      if (h > 0.2) s += `<g opacity="${f3(h)}"><path d="M${x + 6} ${y + 26} l-16 -10 M${x + 74} ${y + 26} l16 -10" stroke="${C.KREM}" stroke-width="6" stroke-linecap="round"/></g>`;
    });
    s += `<rect x="-1000" y="1530" width="3600" height="1200" fill="#4A2A1C"/>`;
    return s;
  }

  // ---------- PAPAN GABUS + KARTU DUGAAN ----------
  function ikonOtot(x, y, s, k = 1) { // pita otot bulat (k 1 tegang koral → 0 kendor krem)
    const w = lerp(1, 0.4, 1 - k);
    return g(x, y, s, `<rect x="-120" y="${-34 * w}" width="240" height="${68 * w}" rx="${34 * w}" fill="${k > 0.5 ? C.KORAL : C.KREM3}"/><path d="M-90 0 L90 0" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity=".55" stroke-dasharray="${k > 0.5 ? "0" : "16 14"}"/>`);
  }
  function ikonPohon(x, y, s) {
    return g(x, y, s, `<rect x="-16" y="-20" width="32" height="130" rx="10" fill="${C.KAYU2}"/><path d="M0 40 L70 -10" stroke="${C.KAYU2}" stroke-width="20" stroke-linecap="round"/><circle cx="0" cy="-70" r="70" fill="${C.KAYU}"/><circle cx="-56" cy="-30" r="46" fill="${C.KAYU}"/><circle cx="60" cy="-36" r="50" fill="${C.KAYU}"/>`);
  }
  function stempelTanya(x, y, s, k) {
    if (k <= 0) return "";
    const sc = s * lerp(1.6, 1, halus(k)), a = cl(k * 3);
    return `<g opacity="${f3(a)}">${g(x, y, sc, `<circle r="74" fill="none" stroke="${C.MERAH}" stroke-width="12" opacity=".9"/><path d="M-28 -30 C-30 -76 42 -78 40 -34 C39 -8 4 -14 2 16" fill="none" stroke="${C.MERAH}" stroke-width="20" stroke-linecap="round"/><circle cx="2" cy="44" r="12" fill="${C.MERAH}"/>`, -12)}</g>`;
  }
  function papanGabus(x, y, s, t, o = {}) {
    const W = 860, H = 720, kartu = o.kartu || [];
    let isi = `<rect x="${-W / 2 + 16}" y="${-H / 2 + 20}" width="${W}" height="${H}" rx="26" fill="${C.INK}" opacity=".18"/><rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" rx="26" fill="${C.KAYU}"/><rect x="${-W / 2 + 30}" y="${-H / 2 + 30}" width="${W - 60}" height="${H - 60}" rx="12" fill="#D6A066"/>`;
    for (let i = 0; i < 60; i++) isi += `<circle cx="${-W / 2 + 50 + ((i * 131) % (W - 100))}" cy="${-H / 2 + 50 + ((i * 89) % (H - 100))}" r="${3 + (i % 3)}" fill="#B9834C" opacity=".6"/>`;
    // benang merah tipis menghubungkan kartu
    isi += `<path d="M-190 -150 L190 -150 L190 150 L-190 150Z" fill="none" stroke="${C.KORAL2}" stroke-width="5" opacity=".6"/>`;
    [[-190, -150], [190, -150], [-190, 150], [190, 150]].forEach(([cx, cy], i) => {
      const k = kartu[i] || {}, b = cl(k.buka || 0), sx = Math.abs(Math.cos(Math.PI * b)), muka = b > 0.5, gy = (k.goyang || 0) * Math.sin(t * 16 + i * 1.7) * 5;
      let isiK = muka ? `<rect x="-140" y="-110" width="280" height="220" rx="16" fill="${C.KREM}"/>` + (k.isi === "otot" ? ikonOtot(0, 0, 0.8, 0.2) : k.isi === "pohon" ? ikonPohon(0, 6, 0.7) : "")
        : `<rect x="-140" y="-110" width="280" height="220" rx="16" fill="${C.KORAL}"/><rect x="-120" y="-90" width="240" height="180" rx="10" fill="none" stroke="${C.KORAL3}" stroke-width="6"/><circle r="30" fill="${C.KORAL3}" opacity=".7"/>`;
      isi += `<g transform="translate(${cx} ${cy}) rotate(${f1(gy + (i % 2 ? 3 : -3))})"><rect x="-136" y="-100" width="280" height="220" rx="16" fill="${C.INK}" opacity=".18" transform="translate(8 10)"/><g transform="scale(${f3(Math.max(0.02, sx))} 1)">${isiK}</g>${stempelTanya(40, 20, 0.8, k.stempel || 0)}<circle cx="0" cy="-96" r="14" fill="${C.KORAL2}"/><circle cx="-4" cy="-100" r="5" fill="#FFFFFF" opacity=".6"/></g>`;
    });
    return g(x, y, s, isi);
  }

  // ---------- DALAM KEPALA: OTAK + DASBOR ----------
  function ruangKepala(t, o = {}) {
    const j = cl(o.jarum || 0), tk = cl(o.tekan || 0);
    let s = `<defs><radialGradient id="tdKepala" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#8C4A34"/><stop offset="1" stop-color="#4A2418"/></radialGradient></defs><rect x="-1000" y="-800" width="3600" height="3400" fill="url(#tdKepala)"/>`;
    // dinding kepala melengkung (kulit) di tepi
    s += `<path d="M-1000 -800 L2600 -800 L2600 2600 L-1000 2600Z M540 960 m-760 0 a760 900 0 1 0 1520 0 a760 900 0 1 0 -1520 0Z" fill="${C.KUL2}" fill-rule="evenodd" opacity=".55"/>`;
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + t * 0.2; s += `<circle cx="${f1(540 + Math.cos(a) * 640)}" cy="${f1(960 + Math.sin(a) * 760)}" r="10" fill="${C.LAMPUL}" opacity="${f3(0.2 + 0.2 * Math.sin(t * 2 + i))}"/>`; }
    // dasbor (kanan bawah)
    const DX = 700, DY = 1270;
    s += `<rect x="${DX - 260}" y="${DY - 230}" width="520" height="360" rx="40" fill="#5A3020"/><rect x="${DX - 240}" y="${DY - 210}" width="480" height="320" rx="30" fill="${C.KREM2}"/>`;
    s += `<path d="M${DX - 170} ${DY + 40} A170 170 0 0 1 ${DX + 170} ${DY + 40}" stroke="${C.KREM3}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M${DX + 100} ${DY - 98} A170 170 0 0 1 ${DX + 170} ${DY + 40}" stroke="${C.KORAL}" stroke-width="30" fill="none" stroke-linecap="round"/>`;
    // ikon orang jatuh kecil di ujung kanan busur
    s += g(DX + 214, DY - 40, 0.9, `<circle cx="-6" cy="-30" r="12" fill="${C.KORAL2}"/><path d="M-4 -16 L6 10 M6 10 L-10 30 M6 10 L22 26 M0 -6 L-22 -18 M0 -6 L20 -22" stroke="${C.KORAL2}" stroke-width="9" stroke-linecap="round"/>`, 30 + Math.sin(t * 5) * 5);
    const ang = lerp(-150, -12, j) + Math.sin(t * 13) * 2 * j, rr = ang * Math.PI / 180;
    s += `<path d="M${DX} ${DY + 40} L${f1(DX + Math.cos(rr) * 150)} ${f1(DY + 40 + Math.sin(rr) * 150)}" stroke="${C.INK}" stroke-width="12" stroke-linecap="round"/><circle cx="${DX}" cy="${DY + 40}" r="20" fill="${C.INK}"/>`;
    // tombol merah besar (kiri bawah)
    const BX = 260, BY = 1330;
    s += `<rect x="${BX - 120}" y="${BY - 20}" width="240" height="110" rx="24" fill="#5A3020"/><ellipse cx="${BX}" cy="${BY - 14 + tk * 22}" rx="96" ry="40" fill="#A8141C"/><ellipse cx="${BX}" cy="${BY - 30 + tk * 22}" rx="96" ry="42" fill="${C.MERAH}"/><ellipse cx="${BX - 30}" cy="${BY - 44 + tk * 22}" rx="30" ry="10" fill="#FFFFFF" opacity=".45"/>`;
    if (tk > 0.5) s += `<g opacity="${f3((tk - 0.5) * 2)}">${[0, 1, 2, 3, 4].map((i) => { const a = (-160 + i * 35) * Math.PI / 180; return `<path d="M${f1(BX + Math.cos(a) * 130)} ${f1(BY - 30 + Math.sin(a) * 80)} L${f1(BX + Math.cos(a) * 180)} ${f1(BY - 30 + Math.sin(a) * 120)}" stroke="${C.LAMPU}" stroke-width="12" stroke-linecap="round"/>`; }).join("")}</g>`;
    return s;
  }
  function otak(x, y, s, t, o = {}) {
    const m = cl(o.mata || 0), tp = cl(o.topi || 0), kg = cl(o.kaget || 0), bob = Math.sin(t * 3) * 6;
    let isi = `<ellipse cx="0" cy="190" rx="180" ry="24" fill="${C.INK}" opacity=".18"/>
      <path d="M-200 30 C-230 -90 -130 -180 -40 -160 C0 -200 90 -190 120 -140 C210 -140 240 -40 205 30 C230 110 150 170 70 150 C20 180 -60 180 -100 150 C-180 170 -240 100 -200 30Z" fill="${C.OTAK}"/>
      <path d="M-150 -60 q40 -40 80 0 t80 0 M-160 40 q50 -36 100 0 t100 0 M0 -150 q-20 60 10 100 t-10 110 M120 -110 q30 40 0 80" stroke="${C.OTAK2}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <ellipse cx="-110" cy="-90" rx="40" ry="18" fill="${C.OTAK3}" opacity=".7"/>`;
    // wajah lucu
    const er = 22 + 14 * m + 8 * kg;
    isi += `<ellipse cx="-62" cy="10" rx="${f1(er)}" ry="${f1(er * 1.15)}" fill="#FFFFFF"/><ellipse cx="62" cy="10" rx="${f1(er)}" ry="${f1(er * 1.15)}" fill="#FFFFFF"/>
      <circle cx="${f1(-56 + (o.lihat || 0) * 8)}" cy="14" r="${f1(11 + 3 * m - 4 * kg)}" fill="${C.INK}"/><circle cx="${f1(68 + (o.lihat || 0) * 8)}" cy="14" r="${f1(11 + 3 * m - 4 * kg)}" fill="${C.INK}"/>
      <ellipse cx="-96" cy="62" rx="20" ry="11" fill="${C.KORAL}" opacity=".6"/><ellipse cx="96" cy="62" rx="20" ry="11" fill="${C.KORAL}" opacity=".6"/>`;
    isi += kg > 0.3 || m > 0.6 ? `<ellipse cx="0" cy="80" rx="${f1(18 + 6 * kg)}" ry="${f1(14 + 14 * Math.max(kg, m))}" fill="#7A2B2B"/>` : `<path d="M-22 74 Q0 92 22 74" stroke="#7A2B2B" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    // kaki & tangan kecil
    isi += `<path d="M-70 150 L-80 200 M70 150 L80 200" stroke="${C.OTAK2}" stroke-width="18" stroke-linecap="round"/>`;
    if (tp > 0) isi += `<g opacity="${f3(tp)}" transform="translate(0 ${f1(-150 - (1 - tp) * 60)}) rotate(-6)"><path d="M-130 10 Q-130 -80 0 -86 Q130 -80 130 10Z" fill="#5A3020"/><rect x="-150" y="0" width="300" height="30" rx="14" fill="#3E2014"/><path d="M-160 22 Q0 70 160 22 L150 44 Q0 84 -150 44Z" fill="#3E2014"/><path d="M0 -60 l14 26 l28 2 l-22 18 l8 28 l-28 -16 l-28 16 l8 -28 l-22 -18 l28 -2Z" fill="${C.MUSTARD}"/></g>`;
    const sn = cl(o.senter || 0);
    if (sn > 0) { const jt = o.jatuh || 0;
      isi += `<g opacity="${f3(sn)}" transform="scale(-1 1) translate(${f1(200 + jt * 60)} ${f1(40 + jt * 170)}) rotate(${f1(-8 + jt * 120)})"><rect x="-20" y="-24" width="110" height="48" rx="14" fill="${C.INK}"/><rect x="86" y="-34" width="36" height="68" rx="10" fill="#5A3020"/><circle cx="-210" cy="20" r="0"/></g><path d="M196 20 Q180 20 170 30" stroke="${C.OTAK2}" stroke-width="18" stroke-linecap="round"/>`;
      isi += `<path d="M-196 10 L${f1(-220 - jt * 60)} ${f1(40 + jt * 170)}" stroke="${C.OTAK2}" stroke-width="18" stroke-linecap="round" opacity="${f3(1 - jt)}"/>`; }
    if (kg > 0.2) isi += `<g opacity="${f3(kg)}"><path d="M-230 -150 l-40 -30 M230 -150 l40 -30 M0 -230 l0 -50 M-140 -220 l-24 -40 M140 -220 l24 -40" stroke="${C.LAMPU}" stroke-width="14" stroke-linecap="round"/></g>`;
    return g(x, y + bob - kg * 50, s * (1 + 0.06 * kg), isi);
  }
  function lorong(t, o = {}) {
    const sr = cl(o.sorot || 0), by = cl(o.bayang || 0);
    let s = `<rect x="-1000" y="-800" width="3600" height="3400" fill="#3E2216"/>`;
    // dinding lorong perspektif hangat gelap
    s += `<path d="M-1000 -800 L240 520 L240 1340 L-1000 2600Z" fill="#4E2C1C"/><path d="M2600 -800 L840 520 L840 1340 L2600 2600Z" fill="#4E2C1C"/><rect x="240" y="520" width="600" height="820" fill="#5E3622"/>`;
    s += `<path d="M-1000 2600 L240 1340 L840 1340 L2600 2600Z" fill="#6E4028"/>`;
    for (let i = 0; i < 4; i++) s += `<rect x="${360 + i * 110}" y="${900}" width="60" height="120" rx="8" fill="#7A4A2E" opacity=".6"/>`;
    // pintu-pintu samping
    s += `<path d="M-200 300 L60 560 L60 1380 L-200 1650Z" fill="#3A2014"/><path d="M1280 300 L1020 560 L1020 1380 L1280 1650Z" fill="#3A2014"/>`;
    // sorot senter (kerucut krem dari kanan bawah ke dinding)
    if (sr > 0) { const ox = o.dari ? o.dari[0] : 590, oy = o.dari ? o.dari[1] : 1170; s += `<path d="M${ox} ${oy - 14} L${ox} ${oy + 14} L180 1000 Q100 760 300 560Z" fill="${C.LAMPUL}" opacity="${f3(sr * 0.22 * (o.redupSorot ?? 1))}"/><ellipse cx="380" cy="790" rx="${f1(250 + 10 * Math.sin(t * 9))}" ry="260" fill="${C.LAMPUL}" opacity="${f3(sr * 0.3 * (o.redupSorot ?? 1))}"/>`; }
    // bayangan otak raksasa di dinding belakang (bayangan SENDIRI, bukan sosok lain)
    if (by > 0) s += `<g opacity="${f3(by * 0.92)}" transform="translate(400 800) scale(${f3(0.9 + 0.25 * by)})"><path d="M-200 30 C-230 -90 -130 -180 -40 -160 C0 -200 90 -190 120 -140 C210 -140 240 -40 205 30 C230 110 150 170 70 150 C20 180 -60 180 -100 150 C-180 170 -240 100 -200 30Z" fill="#2A140C"/><path d="M-130 -140 Q-130 -230 0 -236 Q130 -230 130 -140Z" fill="#2A140C"/></g>`;
    return s;
  }

  // ---------- HUTAN PURBA MALAM ----------
  const DAHAN = { x0: 120, y0: 1150, x1: 1000, y1: 1110 }; // dahan utama (permukaan atas) tempat Tebe tidur
  function daunGumpal(x, y, r, warna, t, i) { const gy = Math.sin(t * 0.8 + i) * 4; return `<circle cx="${x}" cy="${f1(y + gy)}" r="${r}" fill="${warna}"/><circle cx="${x - r * 0.6}" cy="${f1(y + r * 0.3 + gy)}" r="${r * 0.7}" fill="${warna}"/><circle cx="${x + r * 0.65}" cy="${f1(y + r * 0.25 + gy)}" r="${r * 0.75}" fill="${warna}"/>`; }
  function hutanPurba(t, o = {}) {
    let s = `<defs><linearGradient id="tdHutan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E2012"/><stop offset=".55" stop-color="#7A3E1E"/><stop offset="1" stop-color="#B8662E"/></linearGradient>
<radialGradient id="tdBulan" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.BULAN}" stop-opacity=".55"/><stop offset="1" stop-color="${C.LAMPU}" stop-opacity="0"/></radialGradient></defs>`;
    s += `<rect x="-1000" y="-800" width="3600" height="3400" fill="url(#tdHutan)"/>`;
    for (let i = 0; i < 50; i++) s += `<circle cx="${-900 + ((i * 353) % 3400)}" cy="${-700 + ((i * 197) % 1300)}" r="${i % 6 ? 2.6 : 4.4}" fill="${C.LAMPUL}" opacity="${f3(0.3 + 0.5 * Math.pow(Math.sin(t * 0.9 + i * 1.3), 2))}"/>`;
    s += `<circle cx="800" cy="300" r="320" fill="url(#tdBulan)"/><circle cx="800" cy="300" r="110" fill="${C.BULAN}"/><circle cx="770" cy="280" r="18" fill="#F2DDB0"/><circle cx="836" cy="330" r="12" fill="#F2DDB0"/>`;
    // pohon jauh (siluet berlapis)
    for (let i = 0; i < 12; i++) { const px = -900 + i * 300 + ((i * 71) % 90), py = 1400 - ((i * 53) % 140); s += `<rect x="${px - 20}" y="${py - 500}" width="40" height="1300" fill="#5A2E18"/>` + daunGumpal(px, py - 560, 150, "#6A3820", t, i); }
    for (let i = 0; i < 9; i++) { const px = -800 + i * 420, py = 1700; s += `<rect x="${px - 30}" y="${py - 500}" width="60" height="1300" fill="#4A2412"/>` + daunGumpal(px, py - 560, 190, "#5A2E18", t, i + 5); }
    // pohon raksasa: batang kiri + dahan horizontal tebal
    const D = DAHAN;
    s += `<path d="M-260 2600 L-200 400 Q-180 -200 -120 -800 L160 -800 Q140 -200 170 400 L220 2600Z" fill="${C.KAYU2}"/><path d="M-120 2600 L-90 400 Q-80 -200 -40 -800 L40 -800 Q20 -200 40 400 L60 2600Z" fill="${C.KAYU}" opacity=".6"/>`;
    s += `<path d="M80 ${D.y0 - 20} Q560 ${D.y1 - 70} 1500 ${D.y1 - 120} L1500 ${D.y1 + 30} Q560 ${D.y1 + 90} 100 ${D.y0 + 140}Z" fill="${C.KAYU2}"/><path d="M80 ${D.y0 - 20} Q560 ${D.y1 - 70} 1500 ${D.y1 - 120} L1500 ${D.y1 - 86} Q560 ${D.y1 - 36} 90 ${D.y0 + 20}Z" fill="${C.KAYU3}"/>`;
    s += `<path d="M150 420 Q500 300 1300 220 L1300 300 Q500 380 150 520Z" fill="${C.KAYU2}"/>`;
    s += `<path d="M120 1900 Q600 1820 1500 1760 L1500 1860 Q600 1920 120 2010Z" fill="${C.KAYU2}"/>`;
    // gumpalan daun krem + buah koral
    [[520, 130, 170], [1000, 60, 200], [1350, 150, 150], [1300, 760, 130]].forEach(([x, y, r], i) => {
      s += daunGumpal(x, y, r, i % 2 ? C.KREM2 : C.KREM3, t, i) + daunGumpal(x + 30, y + 20, r * 0.6, C.KREM, t, i + 3);
      for (let j = 0; j < 3; j++) s += `<circle cx="${x - r * 0.5 + j * r * 0.5}" cy="${f1(y + r * 0.55 + Math.sin(t + j + i) * 3)}" r="16" fill="${C.KORAL}"/>`;
    });
    if (o.redup) s += `<rect x="-1000" y="-800" width="3600" height="3400" fill="#2A140C" opacity="${f3(o.redup * 0.5)}"/>`;
    return s;
  }
  // manusia purba generik: siluet manusia bulat meringkuk tidur (BUKAN kera) — kepala bulat, rambut pendek, kain sederhana
  function manusiaPurba(x, y, s, t, o = {}) {
    const n = Math.sin(t * 1.6 + (o.fase || 0)) * 0.025, kul = o.kulit || "#A8673E", kulG = "#8A5232", kain = o.kain || "#D98A4A";
    return g(x, y, s, `<ellipse cx="0" cy="8" rx="140" ry="14" fill="#2A140C" opacity=".35"/>
      <g transform="scale(1 ${f3(1 + n)})">
      <path d="M40 -20 Q90 -60 120 -30 Q130 -10 110 0 L60 0Z" fill="${kulG}"/><path d="M70 -10 Q110 -40 136 -14 Q140 0 128 2 L80 2Z" fill="${kul}"/>
      <path d="M-70 0 Q-80 -66 -10 -70 Q60 -72 80 -20 Q84 0 70 0Z" fill="${kain}"/><path d="M-60 -40 Q0 -60 60 -40" stroke="#B86E34" stroke-width="8" fill="none" opacity=".6"/>
      <circle cx="-104" cy="-46" r="38" fill="${kul}"/><path d="M-142 -50 Q-140 -94 -100 -88 Q-74 -84 -70 -58 Q-90 -76 -112 -70 Q-130 -66 -142 -50Z" fill="#3A2014"/>
      <path d="M-118 -42 q8 6 16 0" stroke="#3A2014" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="-122" cy="-28" rx="8" ry="5" fill="${C.KORAL}" opacity=".5"/>
      <path d="M-60 -20 Q-90 -6 -128 -10" stroke="${kul}" stroke-width="22" stroke-linecap="round" fill="none"/></g>
      <g opacity="${f3(0.5 + 0.5 * Math.sin(t * 1.2 + (o.fase || 0)))}"><path d="M-150 -120 l22 0 l-22 24 l22 0" stroke="${C.KREM}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`, 0, s);
  }
  function lonceng(x, y, s, t, o = {}) {
    const d = cl(o.dering || 0), w = Math.sin(t * 38) * 14 * d;
    let isi = "";
    if (o.jejak && o.jejak.length > 1) isi += "";
    isi += `<g transform="rotate(${f1(w)})"><circle cx="0" cy="0" r="${f1(120 + 30 * d)}" fill="${C.LAMPUL}" opacity="${f3(0.25 * d + 0.1)}"/>
      <path d="M-70 40 Q-80 -70 0 -80 Q80 -70 70 40 L84 60 L-84 60Z" fill="${C.MUSTARD}"/><path d="M-50 20 Q-56 -50 0 -58" stroke="#FFF1B8" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7"/><rect x="-90" y="56" width="180" height="18" rx="9" fill="${C.JINGGA2}"/>
      <circle cx="${f1(-Math.sin(t * 38) * 14 * d)}" cy="84" r="16" fill="${C.KORAL2}"/><circle cx="0" cy="-88" r="14" fill="${C.KORAL2}"/>
      <path d="M-60 -100 l-30 -30 M60 -100 l30 -30" stroke="${C.KORAL2}" stroke-width="12" stroke-linecap="round"/></g>`;
    if (d > 0.1) isi += `<g opacity="${f3(d)}"><path d="M-130 -20 q-24 30 0 60 M-160 -40 q-36 50 0 100 M130 -20 q24 30 0 60 M160 -40 q36 50 0 100" stroke="${C.LAMPUL}" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
    return g(x, y, s, isi);
  }
  function jejakCahaya(titik, a) {
    if (a <= 0 || titik.length < 2) return "";
    const d = "M" + titik.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(" L");
    return `<g opacity="${f3(a)}"><path d="${d}" stroke="${C.LAMPU}" stroke-width="46" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/><path d="${d}" stroke="${C.LAMPUL}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }

  // ---------- PAMERAN KASUR ----------
  function sorotPanggung(x, y, a, t) {
    if (a <= 0) return "";
    return `<g opacity="${f3(a)}"><path d="M${x - 70} -800 L${x + 70} -800 L${x + 460} ${y + 40} L${x - 460} ${y + 40}Z" fill="${C.LAMPUL}" opacity=".28"/><ellipse cx="${x}" cy="${y + 30}" rx="${f1(470 + 8 * Math.sin(t * 3))}" ry="90" fill="${C.LAMPUL}" opacity=".35"/></g>`;
  }
  function taliBeludru(x, y, s, a) {
    if (a <= 0) return "";
    const tiang = (px) => `<rect x="${px - 12}" y="-200" width="24" height="200" rx="10" fill="${C.MUSTARD}"/><ellipse cx="${px}" cy="0" rx="60" ry="16" fill="${C.JINGGA2}"/><circle cx="${px}" cy="-210" r="22" fill="${C.MUSTARD}"/>`;
    return `<g opacity="${f3(a)}">${g(x, y, s, `${tiang(-300)}${tiang(300)}<path d="M-290 -180 Q0 -60 290 -180" stroke="#A8141C" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-290 -186 Q0 -70 290 -186" stroke="${C.KORAL2}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>`)}</g>`;
  }

  // ---------- LENCANA POSE TIDUR (tanpa huruf) ----------
  function lencanaPose(x, y, s, jenis, a = 1) {
    if (a <= 0) return "";
    const warna = { miring: C.KREM, telentang: C.KORAL, tengkurap: C.JINGGA }[jenis], tinta = jenis === "miring" ? C.KAYU2 : "#FFFFFF";
    let ikon = `<rect x="-90" y="40" width="180" height="16" rx="8" fill="${tinta}" opacity=".6"/>`;
    if (jenis === "miring") ikon += `<circle cx="-56" cy="-4" r="22" fill="${tinta}"/><path d="M-30 6 Q0 -40 40 -10 Q60 10 40 30 L20 30 Q30 10 0 10 Q-14 30 -30 30Z" fill="${tinta}"/>`;
    if (jenis === "telentang") ikon += `<circle cx="-62" cy="12" r="22" fill="${tinta}"/><path d="M-62 -12 l0 -12" stroke="${tinta}" stroke-width="8" stroke-linecap="round"/><rect x="-38" y="6" width="120" height="28" rx="14" fill="${tinta}"/>`;
    if (jenis === "tengkurap") ikon += `<circle cx="-62" cy="18" r="22" fill="${tinta}"/><rect x="-38" y="10" width="120" height="28" rx="14" fill="${tinta}"/><path d="M60 10 l12 -18 M78 10 l12 -18" stroke="${tinta}" stroke-width="8" stroke-linecap="round"/>`;
    return `<g opacity="${f3(a)}">${g(x, y, s, `<line x1="0" y1="-240" x2="0" y2="-118" stroke="${C.KREM}" stroke-width="6" opacity=".8"/><circle cx="6" cy="10" r="118" fill="${C.INK}" opacity=".2"/><circle r="118" fill="${warna}"/><circle r="100" fill="none" stroke="#FFFFFF" stroke-width="6" opacity=".55"/>${ikon}`)}</g>`;
  }
  function hp(x, y, s, rot = 0) {
    return g(x, y, s, `<rect x="-44" y="-80" width="88" height="160" rx="16" fill="${C.INK}"/><rect x="-36" y="-68" width="72" height="132" rx="8" fill="${C.LAMPUL}"/><circle cx="-10" cy="-20" r="12" fill="${C.KORAL}"/><circle cx="14" cy="10" r="12" fill="${C.KORAL3}"/>`, rot);
  }
  function sliderTegang(x, y, s, k) {
    const ky = lerp(150, -150, cl(k));
    return g(x, y, s, `<rect x="-24" y="-190" width="48" height="380" rx="24" fill="#5A3020"/><rect x="-12" y="${f1(ky)}" width="24" height="${f1(170 - ky)}" rx="12" fill="${k > 0.5 ? C.KORAL : C.KREM3}"/><circle cy="${f1(ky)}" r="44" fill="${k > 0.5 ? C.KORAL : C.KREM}"/><circle cy="${f1(ky)}" r="20" fill="#FFFFFF" opacity=".6"/>`);
  }

  root.ASET = root.ASET || {};
  root.ASET.TIDUR = { C, KASUR, DAHAN, JENDELA, kamar, selimut, bantal, tanggaIlusi, hati, garisGerak, panahMerah, jamDinding, lampuTidur,
    ruangPeneliti, peneliti, mapKasus, bulu, perumahan, papanGabus, ikonOtot, ikonPohon, stempelTanya, ruangKepala, otak, lorong,
    hutanPurba, manusiaPurba, lonceng, jejakCahaya, sorotPanggung, taliBeludru, lencanaPose, hp, sliderTegang };
})(typeof window !== "undefined" ? window : globalThis);
