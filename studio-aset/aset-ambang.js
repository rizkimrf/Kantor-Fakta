/* ===== SET AMBANG PINTU RUMAH (Yoga, 25 Nov 2026, video B3-03 "lupa di ambang pintu") =====
 * Muat SETELAH aset-set.js (aset-lagu.js opsional untuk orang generik). Gaya datar tanpa garis hitam.
 * Palet HIJAU BOTOL TUA + SALMON + PUTIH TULANG (beda dari A3-02 pintu kaca minimarket oranye-krem, B3-09 biru langit-jingga).
 * Semua fungsi murni (fungsi waktu kontinu t) → string SVG. Tanpa merek/angka/tahun; satu-satunya teks = label papan (o.label).
 *  ruangAmbang(t,o)            rumah hangat di koordinat 1080×1920 (+ margin 400 px): dinding hijau botol, kusen kayu + gorden, kamar salmon di balik pintu,
 *                              sofa, jam dinding, karpet, lampu lantai. o.redup 0..1 (mode detektif), o.garisTinggi 0..1, o.kilat 0..1
 *  PINTU = {x0,x1,y0,y1}       bukaan pintu pada ruangAmbang
 *  gelembung(x,y,r,t,o)        gelembung pikiran putih tulang (o.ekor [x,y], o.isi svg, o.tanya 0..1, o.a, o.redup)
 *  tanya(x,y,s,a,warna) · charger(x,y,s,o) (o.putus garis putus-putus, o.a) · cangkir(x,y,s,o) · catatanNiat(x,y,s,o)
 *  pecah(x,y,k,warna)          serpih gelembung pecah · sorot(x,y,r,a) overlay gelap dengan lingkaran terang · kacaPembesar(x,y,s,rot)
 *  denah(t,o)                  denah tampak atas dua lajur (o.lajurA, o.lajurB, o.meteran 0..1, o.ox/oy/s)
 *  orangAtas(x,y,s,rot,t,o)    orang tampak atas membawa kotak · meteran(x0,y,len,k)
 *  papan(x,y,s,o)              papan kertas (o.centang 0..1, o.silang 0..1, o.titik 0..1, o.label teks kecil, o.garis)
 *  vr(x,y,s,t) · layarVideo(x,y,s,t) · jejakPintu(x,y,s,t,k) · capKecil(x,y,s,k)
 *  pusaranHitung(x,y,s,t,k)    manik sempoa + turus (tanpa angka) berputar
 *  dapur(t,o)                  dapur rumah salmon: kulkas generik (o.buka 0..1), meja, jendela · hp(x,y,s,rot) · chat(x,y,s,k)
 *  pitaFilm(x,y,t,o)           pita film garis PUTUS-PUTUS 3 bingkai (ruang tamu, kamar, dapur) disekat kusen kecil (o.geser, o.pudar)
 *  timbangan(x,y,s,miring,isiK,isiN) · lorong(t,o) lorong 3 pintu (o.buka [k1,k2,k3]) · panah(x0,y0,x1,y1,a)
 */
(function (root) {
  const f1 = (v) => Math.round(v * 10) / 10, f3 = (v) => Math.round(v * 1000) / 1000;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const halus = (x) => { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  let _n = 0; const uid = (p) => `${p}A${++_n}`;
  const g = (x, y, s, isi, rot = 0, sy) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)} ${f3(sy ?? s)})">${isi}</g>`;
  const C = {
    HIJAUT: "#10291F", HIJAU: "#1C4636", HIJAU2: "#275A46", HIJAU3: "#3A7560", HIJAU4: "#5E9580",
    SALMON: "#F29479", SALMON2: "#DC6E58", SALMONL: "#FFC0AC", SALMONP: "#FFE3D8",
    TULANG: "#F5EEE1", TULANG2: "#E7DCC7", TULANG3: "#CDBFA6",
    KAYU: "#9C6440", KAYU2: "#774829", KAYUL: "#BE8659", LANTAI: "#5B3A27", LANTAI2: "#4A2F20",
    INK: "#1A2520", ABU: "#8C9A92", MERAH: "#E2232E", KUL: "#E9B48C", KULG: "#C98E68",
  };
  const PINTU = { x0: 250, x1: 830, y0: 600, y1: 1560 };

  // ---------- tanda tanya (path, bukan huruf) ----------
  function tanya(x, y, s, a = 1, warna = C.HIJAU) {
    if (a <= 0) return "";
    return g(x, y, s, `<g opacity="${f3(a)}"><path d="M-30 -40 C-32 -78 44 -82 42 -42 C41 -18 4 -26 2 2" fill="none" stroke="${warna}" stroke-width="16" stroke-linecap="round"/><circle cx="2" cy="30" r="10" fill="${warna}"/></g>`);
  }

  // ---------- rumah: ruang tamu hijau botol + kusen + kamar salmon ----------
  function ruangAmbang(t = 0, o = {}) {
    const id = uid("ra"), P = PINTU, red = o.redup || 0;
    let s = `<defs><linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.HIJAU}"/><stop offset="1" stop-color="${C.HIJAU2}"/></linearGradient>
<radialGradient id="${id}k" cx=".55" cy=".45" r=".8"><stop offset="0" stop-color="${C.SALMONP}"/><stop offset=".45" stop-color="${C.SALMONL}"/><stop offset="1" stop-color="${C.SALMON}"/></radialGradient>
<radialGradient id="${id}g"><stop offset="0" stop-color="${C.SALMONL}" stop-opacity=".55"/><stop offset="1" stop-color="${C.SALMONL}" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}l"><stop offset="0" stop-color="#FFE9D6" stop-opacity=".7"/><stop offset="1" stop-color="#FFE9D6" stop-opacity="0"/></radialGradient></defs>`;
    // dinding + lis bawah
    s += `<rect x="-400" y="-400" width="1880" height="${P.y1 + 400}" fill="url(#${id}d)"/>`;
    for (let i = -6; i < 22; i++) s += `<rect x="${i * 90 - 20}" y="-400" width="40" height="${P.y1 + 400}" fill="${C.HIJAUT}" opacity=".07"/>`;
    s += `<rect x="-400" y="${P.y1 - 230}" width="1880" height="230" fill="${C.HIJAUT}" opacity=".28"/><rect x="-400" y="${P.y1 - 240}" width="1880" height="14" fill="${C.KAYU2}" opacity=".8"/>`;
    // lantai kayu + karpet
    s += `<rect x="-400" y="${P.y1}" width="1880" height="760" fill="${C.LANTAI}"/>`;
    for (let i = 0; i < 9; i++) s += `<rect x="-400" y="${P.y1 + 30 + i * 80}" width="1880" height="5" fill="${C.LANTAI2}"/>`;
    s += `<ellipse cx="540" cy="${P.y1 + 220}" rx="620" ry="150" fill="${C.TULANG2}"/><ellipse cx="540" cy="${P.y1 + 220}" rx="540" ry="118" fill="none" stroke="${C.SALMON}" stroke-width="16" opacity=".8"/><ellipse cx="540" cy="${P.y1 + 220}" rx="420" ry="82" fill="none" stroke="${C.HIJAU3}" stroke-width="10" stroke-dasharray="30 22" opacity=".7"/>`;
    // cahaya kamar tumpah ke lantai
    s += `<path d="M${P.x0} ${P.y1} L${P.x1} ${P.y1} L${P.x1 + 260} ${P.y1 + 420} L${P.x0 - 260} ${P.y1 + 420}Z" fill="${C.SALMONL}" opacity="${f3(0.28 * (1 - red * 0.4))}"/>`;
    // kamar di balik pintu
    const fy = P.y1 - 170;
    s += `<rect x="${P.x0}" y="${P.y0}" width="${P.x1 - P.x0}" height="${P.y1 - P.y0}" fill="url(#${id}k)"/>`;
    s += `<path d="M${P.x0} ${fy} L${P.x1} ${fy} L${P.x1} ${P.y1} L${P.x0} ${P.y1}Z" fill="${C.SALMON2}" opacity=".55"/>`;
    // lemari (kiri dalam)
    s += `<rect x="${P.x0 + 10}" y="${P.y0 + 120}" width="130" height="${fy - P.y0 - 110}" rx="8" fill="${C.KAYU}"/><rect x="${P.x0 + 20}" y="${P.y0 + 140}" width="52" height="${fy - P.y0 - 160}" rx="5" fill="${C.KAYUL}" opacity=".6"/><rect x="${P.x0 + 78}" y="${P.y0 + 140}" width="52" height="${fy - P.y0 - 160}" rx="5" fill="${C.KAYUL}" opacity=".6"/><circle cx="${P.x0 + 66}" cy="${P.y0 + 400}" r="6" fill="${C.KAYU2}"/><circle cx="${P.x0 + 84}" cy="${P.y0 + 400}" r="6" fill="${C.KAYU2}"/>`;
    // jendela kamar + lampu
    s += `<rect x="${P.x0 + 230}" y="${P.y0 + 120}" width="170" height="210" rx="10" fill="${C.HIJAU3}" opacity=".5"/><rect x="${P.x0 + 312}" y="${P.y0 + 120}" width="6" height="210" fill="${C.TULANG}" opacity=".7"/><circle cx="${P.x0 + 360}" cy="${P.y0 + 170}" r="26" fill="${C.TULANG}" opacity=".7"/>`;
    s += `<circle cx="${P.x0 + 300}" cy="${P.y0 + 500}" r="260" fill="url(#${id}l)"/>`;
    // kasur (kanan dalam)
    s += `<rect x="${P.x0 + 190}" y="${fy - 150}" width="300" height="150" rx="18" fill="${C.KAYU2}"/><rect x="${P.x0 + 200}" y="${fy - 200}" width="290" height="80" rx="24" fill="${C.TULANG}"/><rect x="${P.x0 + 250}" y="${fy - 170}" width="240" height="90" rx="20" fill="${C.SALMON2}"/><rect x="${P.x0 + 210}" y="${fy - 236}" width="90" height="50" rx="20" fill="${C.TULANG}"/>`;
    // ambang (kayu di lantai)
    s += `<rect x="${P.x0 - 10}" y="${P.y1 - 12}" width="${P.x1 - P.x0 + 20}" height="24" rx="6" fill="${C.KAYUL}"/>`;
    // kusen kayu
    s += `<rect x="${P.x0 - 46}" y="${P.y0 - 46}" width="46" height="${P.y1 - P.y0 + 46}" fill="${C.KAYU}"/><rect x="${P.x1}" y="${P.y0 - 46}" width="46" height="${P.y1 - P.y0 + 46}" fill="${C.KAYU}"/><rect x="${P.x0 - 60}" y="${P.y0 - 70}" width="${P.x1 - P.x0 + 120}" height="40" rx="6" fill="${C.KAYU2}"/><rect x="${P.x0 - 46}" y="${P.y0 - 34}" width="${P.x1 - P.x0 + 92}" height="34" fill="${C.KAYU}"/><rect x="${P.x0 - 8}" y="${P.y0}" width="8" height="${P.y1 - P.y0}" fill="${C.KAYU2}" opacity=".6"/><rect x="${P.x1}" y="${P.y0}" width="8" height="${P.y1 - P.y0}" fill="${C.KAYU2}" opacity=".6"/>`;
    // gorden: valance + satu sisi terikat ke kiri, bergoyang halus
    const sw = Math.sin(t * 1.3) * 8;
    let val = `M${P.x0 - 20} ${P.y0 - 2}`;
    for (let i = 0; i <= 8; i++) { const x = P.x0 - 20 + i * ((P.x1 - P.x0 + 40) / 8); val += ` Q${f1(x - 30)} ${f1(P.y0 + 70 + sw * 0.3)} ${f1(x)} ${P.y0 - 2}`; }
    s += `<path d="${val}Z" fill="${C.TULANG}"/>`;
    s += `<path d="M${P.x0} ${P.y0} L${P.x0 + 120 + sw} ${P.y0} Q${P.x0 + 70 + sw} ${P.y0 + 380} ${P.x0 + 40} ${P.y0 + 470} Q${P.x0 + 90 + sw * 0.6} ${P.y0 + 640} ${P.x0 + 70} ${P.y1 - 40} L${P.x0} ${P.y1 - 40}Z" fill="${C.TULANG2}"/><path d="M${P.x0 + 30} ${P.y0} Q${P.x0 + 40 + sw} ${P.y0 + 300} ${P.x0 + 30} ${P.y0 + 470}" stroke="${C.TULANG3}" stroke-width="10" fill="none" opacity=".6"/><rect x="${P.x0 + 14}" y="${P.y0 + 455}" width="60" height="22" rx="10" fill="${C.SALMON2}"/>`;
    // sofa (kiri, ruang tamu)
    s += `<rect x="-330" y="${P.y1 - 330}" width="560" height="200" rx="60" fill="${C.HIJAUT}"/><rect x="-330" y="${P.y1 - 180}" width="600" height="190" rx="40" fill="${C.HIJAUT}"/><rect x="-250" y="${P.y1 - 220}" width="200" height="110" rx="34" fill="${C.SALMON}" opacity=".9"/><rect x="-30" y="${P.y1 - 210}" width="170" height="100" rx="34" fill="${C.TULANG}" opacity=".85"/><rect x="200" y="${P.y1 - 220}" width="70" height="230" rx="30" fill="#0B1F17"/>`;
    // jam dinding (tanpa angka), jarum bergerak terus
    const jx = 930, jy = 520, mn = t * 40, jm = t * 3.3;
    s += `<circle cx="${jx}" cy="${jy + 8}" r="96" fill="#000" opacity=".15"/><circle cx="${jx}" cy="${jy}" r="96" fill="${C.KAYU}"/><circle cx="${jx}" cy="${jy}" r="80" fill="${C.TULANG}"/>`;
    for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; s += `<rect x="${f1(jx - 4)}" y="${f1(jy - 72)}" width="8" height="${i % 3 ? 10 : 18}" rx="3" fill="${C.HIJAU}" transform="rotate(${i * 30} ${jx} ${jy})"/>`; }
    s += `<rect x="${jx - 5}" y="${jy - 44}" width="10" height="48" rx="5" fill="${C.HIJAUT}" transform="rotate(${f1(jm)} ${jx} ${jy})"/><rect x="${jx - 3}" y="${jy - 66}" width="6" height="70" rx="3" fill="${C.SALMON2}" transform="rotate(${f1(mn)} ${jx} ${jy})"/><circle cx="${jx}" cy="${jy}" r="9" fill="${C.HIJAUT}"/>`;
    // lukisan abstrak (kiri atas)
    s += `<rect x="40" y="420" width="200" height="150" rx="8" fill="${C.KAYU2}"/><rect x="54" y="434" width="172" height="122" rx="4" fill="${C.SALMONP}"/><path d="M54 556 L110 480 L150 520 L190 470 L226 556Z" fill="${C.HIJAU3}"/><circle cx="190" cy="470" r="14" fill="${C.SALMON}"/>`;
    // lampu lantai (kanan) + pot tanaman
    s += `<circle cx="960" cy="${P.y1 - 640}" r="${f1(230 * (1 - red * 0.5))}" fill="url(#${id}g)"/><rect x="954" y="${P.y1 - 610}" width="12" height="610" fill="${C.KAYU2}"/><path d="M890 ${P.y1 - 600} L1030 ${P.y1 - 600} L1000 ${P.y1 - 720} L920 ${P.y1 - 720}Z" fill="${C.SALMONL}"/><ellipse cx="960" cy="${P.y1}" rx="70" ry="14" fill="#000" opacity=".2"/>`;
    s += `<path d="M830 ${P.y1} L880 ${P.y1} L890 ${P.y1 - 110} L820 ${P.y1 - 110}Z" fill="${C.SALMON2}"/>`;
    for (let i = 0; i < 5; i++) { const a = -70 + i * 35 + Math.sin(t * 1.5 + i) * 4; s += `<ellipse cx="855" cy="${P.y1 - 190}" rx="22" ry="85" fill="${i % 2 ? C.HIJAU3 : C.HIJAU4}" transform="rotate(${f1(a)} 855 ${P.y1 - 110})"/>`; }
    // garis tinggi tersangka (tanpa angka) di dinding sekitar kusen
    if (o.garisTinggi > 0) { let gt = ""; for (let i = 0; i < 9; i++) { const y = P.y0 - 40 + i * 110; gt += `<rect x="${P.x0 - 230}" y="${y}" width="${i % 2 ? 110 : 170}" height="8" fill="${C.TULANG}"/><rect x="${P.x1 + 60 + (i % 2 ? 60 : 0)}" y="${y}" width="${i % 2 ? 110 : 170}" height="8" fill="${C.TULANG}"/>`; } s += `<g opacity="${f3(o.garisTinggi * 0.55)}">${gt}</g>`; }
    if (red > 0) s += `<rect x="-400" y="-400" width="1880" height="2720" fill="#06140E" opacity="${f3(red * 0.55)}"/>`;
    return s;
  }

  // ---------- gelembung pikiran ----------
  function gelembung(x, y, r, t = 0, o = {}) {
    const a = o.a ?? 1; if (a <= 0) return "";
    const n = 9, bumps = []; for (let i = 0; i < n; i++) { const q = (i / n) * Math.PI * 2 + 0.2; bumps.push([x + Math.cos(q) * r * 0.86, y + Math.sin(q) * r * 0.74, r * (0.34 + 0.05 * Math.sin(i * 2.1 + t * 1.6))]); }
    const warna = o.warna || C.TULANG;
    let s = `<g opacity="${f3(a)}">`;
    const bayang = bumps.map(([bx, by, br]) => `<circle cx="${f1(bx + 8)}" cy="${f1(by + 12)}" r="${f1(br)}"/>`).join("") + `<ellipse cx="${x + 8}" cy="${y + 12}" rx="${f1(r * 0.92)}" ry="${f1(r * 0.8)}"/>`;
    s += `<g fill="#000" opacity=".16">${bayang}</g>`;
    if (o.ekor) { const [ex, ey] = o.ekor; [[0.62, 0.15], [0.8, 0.1], [0.93, 0.065]].forEach(([k, rr]) => { s += `<circle cx="${f1(lerp(x, ex, k))}" cy="${f1(lerp(y, ey, k))}" r="${f1(r * rr)}" fill="${warna}"/>`; }); }
    s += `<g fill="${warna}">${bumps.map(([bx, by, br]) => `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(br)}"/>`).join("")}<ellipse cx="${x}" cy="${y}" rx="${f1(r * 0.92)}" ry="${f1(r * 0.8)}"/></g>`;
    if (o.isi) s += o.isi;
    if (o.tanya > 0) s += tanya(x, y + r * 0.02, r / 95, o.tanya, o.warnaTanya || C.HIJAU);
    if (o.redup > 0) s += `<g fill="${C.HIJAUT}" opacity="${f3(o.redup * 0.45)}">${bumps.map(([bx, by, br]) => `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(br)}"/>`).join("")}<ellipse cx="${x}" cy="${y}" rx="${f1(r * 0.92)}" ry="${f1(r * 0.8)}"/></g>`;
    return s + `</g>`;
  }
  function pecah(x, y, k, warna = C.TULANG, r0 = 60) {
    if (k <= 0 || k >= 1) return "";
    let s = ""; for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2, d = r0 + k * 120; s += `<circle cx="${f1(x + Math.cos(a) * d)}" cy="${f1(y + Math.sin(a) * d)}" r="${f1(12 * (1 - k) + 2)}" fill="${warna}" opacity="${f3(1 - k)}"/>`; }
    return s + `<circle cx="${x}" cy="${y}" r="${f1(r0 + k * 90)}" fill="none" stroke="${warna}" stroke-width="${f1(10 * (1 - k))}" opacity="${f3(1 - k)}"/>`;
  }

  // ---------- benda ----------
  function charger(x, y, s, o = {}) {
    const a = o.a ?? 1; if (a <= 0) return "";
    const st = o.putus ? `fill="none" stroke="${o.warna || C.HIJAU3}" stroke-width="7" stroke-dasharray="14 10"` : null;
    const isi = st
      ? `<rect x="-40" y="-56" width="80" height="92" rx="16" ${st}/><path d="M-16 -56 L-16 -86 M16 -56 L16 -86" ${st} stroke-linecap="round"/><path d="M0 36 Q0 80 -40 84 Q-90 88 -84 50 Q-78 18 -30 30" ${st}/>`
      : `<path d="M-16 -56 L-16 -86 M16 -56 L16 -86" stroke="${C.ABU}" stroke-width="10" stroke-linecap="round"/><rect x="-40" y="-56" width="80" height="92" rx="16" fill="#FFFFFF"/><rect x="-40" y="10" width="80" height="26" rx="10" fill="${C.TULANG2}"/><path d="M0 36 Q0 80 -40 84 Q-90 88 -84 50 Q-78 18 -30 30" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-30 30 L-6 34" stroke="${C.TULANG3}" stroke-width="14" stroke-linecap="round"/>`;
    return g(x, y, s, `<g opacity="${f3(a)}" ${o.buram ? `style="filter:blur(${f1(o.buram)}px)"` : ""}>${isi}</g>`, o.rot || 0);
  }
  function cangkir(x, y, s, o = {}) {
    const a = o.a ?? 1; if (a <= 0) return "";
    const w = o.warna || C.SALMON, w2 = o.warna2 || C.SALMON2, t = o.t || 0;
    let uap = ""; if (o.uap) for (let i = 0; i < 3; i++) { const q = (t * 0.6 + i / 3) % 1; uap += `<path d="M${-24 + i * 24} ${-70 - q * 60} q10 -14 0 -28 q-10 -14 0 -28" stroke="${C.TULANG}" stroke-width="7" fill="none" stroke-linecap="round" opacity="${f3(0.7 * Math.sin(Math.PI * q))}"/>`; }
    return g(x, y, s, `<g opacity="${f3(a)}" ${o.buram ? `style="filter:blur(${f1(o.buram)}px)"` : ""}>${uap}<ellipse cx="0" cy="62" rx="70" ry="12" fill="#000" opacity=".15"/><path d="M52 -20 Q100 -18 96 18 Q92 50 48 42" stroke="${w2}" stroke-width="16" fill="none"/><path d="M-58 -56 L58 -56 L50 54 Q48 64 36 64 L-36 64 Q-48 64 -50 54Z" fill="${w}"/><rect x="-58" y="-62" width="116" height="16" rx="8" fill="${w2}"/><path d="M-36 -36 L-30 40" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity=".4"/>${o.pola ? `<circle cx="6" cy="0" r="16" fill="${C.TULANG}" opacity=".85"/>` : `<rect x="-20" y="-8" width="40" height="10" rx="5" fill="${C.TULANG}" opacity=".85"/>`}</g>`, o.rot || 0);
  }
  function catatanNiat(x, y, s, o = {}) {
    const a = o.a ?? 1; if (a <= 0) return "";
    return g(x, y, s, `<g opacity="${f3(a)}"><rect x="-70" y="-70" width="140" height="140" rx="10" fill="${C.SALMONL}"/><path d="M-70 40 L-40 70 L-70 70Z" fill="${C.SALMON}"/>${[-36, -6, 24].map((yy, i) => `<rect x="-44" y="${yy}" width="20" height="20" rx="5" fill="none" stroke="${C.HIJAU}" stroke-width="6"/><rect x="-14" y="${yy + 6}" width="${[70, 54, 62][i]}" height="9" rx="4" fill="${C.HIJAU3}"/>`).join("")}</g>`, o.rot || 0);
  }
  function kacaPembesar(x, y, s, rot = -30, isi = "") {
    const id = uid("kp");
    return g(x, y, s, `<defs><clipPath id="${id}"><circle cx="0" cy="0" r="86"/></clipPath></defs><rect x="-16" y="96" width="32" height="150" rx="14" fill="${C.KAYU2}" transform="rotate(${-rot} 0 0)"/>${isi ? `<g clip-path="url(#${id})">${isi}</g>` : ""}<circle cx="0" cy="0" r="86" fill="#FFFFFF" opacity=".16"/><circle cx="0" cy="0" r="94" fill="none" stroke="${C.TULANG3}" stroke-width="20"/><path d="M-50 -40 Q-40 -64 -12 -70" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>`, rot);
  }
  function sorot(x, y, r, a = 1) {
    if (a <= 0) return "";
    const id = uid("so");
    return `<defs><radialGradient id="${id}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.35)}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#06140E" stop-opacity="0"/><stop offset=".66" stop-color="#06140E" stop-opacity="0"/><stop offset=".76" stop-color="#06140E" stop-opacity=".55"/><stop offset="1" stop-color="#06140E" stop-opacity=".66"/></radialGradient></defs><rect x="-400" y="-400" width="1880" height="2720" fill="url(#${id})" opacity="${f3(a)}"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.9)}" fill="${C.SALMONP}" opacity="${f3(a * 0.1)}"/>`;
  }
  function panah(x0, y0, x1, y1, a = 1, lengkung = 120) {
    if (a <= 0) return "";
    const mx = (x0 + x1) / 2 - lengkung, my = (y0 + y1) / 2 - lengkung * 0.3, ang = Math.atan2(y1 - my, x1 - mx), hx = x1 + Math.cos(ang) * 10, hy = y1 + Math.sin(ang) * 10;
    const p = (d, r) => [hx + Math.cos(ang + d) * r, hy + Math.sin(ang + d) * r];
    const [ax, ay] = p(Math.PI * 0.82, 70), [bx, by] = p(-Math.PI * 0.82, 70);
    return `<g opacity="${f3(a)}"><path d="M${x0} ${y0} Q${f1(mx)} ${f1(my)} ${f1(x1 - Math.cos(ang) * 30)} ${f1(y1 - Math.sin(ang) * 30)}" stroke="#FFFFFF" stroke-width="40" fill="none" stroke-linecap="round" opacity=".9"/><path d="M${x0} ${y0} Q${f1(mx)} ${f1(my)} ${f1(x1 - Math.cos(ang) * 30)} ${f1(y1 - Math.sin(ang) * 30)}" stroke="${C.MERAH}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M${f1(hx + Math.cos(ang) * 16)} ${f1(hy + Math.sin(ang) * 16)} L${f1(ax)} ${f1(ay)} L${f1(bx)} ${f1(by)}Z" fill="${C.MERAH}" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"/></g>`;
  }

  // ---------- denah percobaan (tampak atas) ----------
  function orangAtas(x, y, s, rot, t = 0, o = {}) {
    const sw = Math.sin(t * 9 + (o.fase || 0)) * 6 * (o.jalan ?? 1), baju = o.baju || C.SALMON, rmb = o.rambut || "#3A2A20";
    const kotak = o.kotak === false ? "" : `<rect x="44" y="-30" width="54" height="60" rx="8" fill="${o.warnaKotak || C.KAYUL}"/><rect x="44" y="-6" width="54" height="10" fill="${C.KAYU}"/>`;
    return g(x, y, s, `<ellipse cx="6" cy="8" rx="52" ry="62" fill="#000" opacity=".14"/><g transform="rotate(${f1(sw)})"><path d="M30 -46 L64 -34 M30 46 L64 34" stroke="${o.kulit || C.KUL}" stroke-width="18" stroke-linecap="round"/>${kotak}<ellipse cx="0" cy="0" rx="34" ry="58" fill="${baju}"/></g><circle cx="4" cy="0" r="30" fill="${o.kulit || C.KUL}"/><path d="M-26 -14 Q4 -38 30 -10 Q10 -24 -10 -4Z" fill="${rmb}"/><circle cx="-4" cy="0" r="26" fill="${rmb}" opacity=".95"/>`, rot);
  }
  function meteran(x0, y, len, k) {
    if (k <= 0) return "";
    const L = len * halus(k);
    let tk = ""; for (let i = 0; i * 40 < L; i++) tk += `<rect x="${f1(x0 + i * 40)}" y="${y - 14}" width="4" height="${i % 5 ? 12 : 22}" fill="${C.HIJAUT}" opacity=".7"/>`;
    return `<rect x="${x0 - 46}" y="${y - 40}" width="72" height="72" rx="16" fill="${C.HIJAU}"/><circle cx="${x0 - 10}" cy="${y - 4}" r="18" fill="${C.HIJAU3}"/><rect x="${x0}" y="${y - 16}" width="${f1(L)}" height="30" rx="4" fill="${C.SALMON}"/>${tk}<rect x="${f1(x0 + L - 4)}" y="${y - 24}" width="12" height="46" rx="3" fill="${C.HIJAUT}"/>`;
  }
  function denah(t = 0, o = {}) {
    const W = C.HIJAU;
    let s = `<rect x="-400" y="-400" width="1880" height="2720" fill="${C.TULANG2}"/>`;
    for (let i = -8; i < 30; i++) s += `<rect x="-400" y="${i * 80}" width="1880" height="3" fill="${C.TULANG3}" opacity=".5"/><rect x="${i * 80}" y="-400" width="3" height="2720" fill="${C.TULANG3}" opacity=".5"/>`;
    const lajur = (y0, h, sekat) => {
      let q = `<rect x="120" y="${y0}" width="840" height="${h}" fill="${C.TULANG}"/>`;
      q += `<rect x="96" y="${y0 - 24}" width="888" height="24" fill="${W}"/><rect x="96" y="${y0 + h}" width="888" height="24" fill="${W}"/>`;
      q += `<rect x="96" y="${y0 - 24}" width="24" height="${h * 0.3 + 24}" fill="${W}"/><rect x="96" y="${y0 + h * 0.7}" width="24" height="${h * 0.3 + 24}" fill="${W}"/><rect x="960" y="${y0 - 24}" width="24" height="${h * 0.3 + 24}" fill="${W}"/><rect x="960" y="${y0 + h * 0.7}" width="24" height="${h * 0.3 + 24}" fill="${W}"/>`;
      // meja-meja kecil
      q += `<rect x="190" y="${y0 + 30}" width="120" height="56" rx="8" fill="${C.KAYUL}" opacity=".7"/><rect x="${sekat ? 640 : 700}" y="${y0 + h - 86}" width="130" height="56" rx="8" fill="${C.KAYUL}" opacity=".7"/><circle cx="${sekat ? 860 : 440}" cy="${y0 + 60}" r="30" fill="${C.HIJAU4}" opacity=".6"/>`;
      if (sekat) {
        const dx = 528, d0 = y0 + h * 0.32, d1 = y0 + h * 0.68, sb = halus(o.ayun ?? 1);
        q += `<rect x="${dx}" y="${y0}" width="24" height="${f1(d0 - y0)}" fill="${W}"/><rect x="${dx}" y="${f1(d1)}" width="24" height="${f1(y0 + h - d1)}" fill="${W}"/>`;
        q += `<path d="M${dx + 24} ${f1(d0)} A${f1(d1 - d0)} ${f1(d1 - d0)} 0 0 1 ${f1(dx + 24 + (d1 - d0))} ${f1(d1)}" stroke="${C.HIJAU3}" stroke-width="5" stroke-dasharray="12 10" fill="none" opacity=".7"/><rect x="${dx + 24}" y="${f1(d0)}" width="10" height="${f1(d1 - d0)}" fill="${C.KAYU}" transform="rotate(${f1(-90 * sb)} ${dx + 24} ${f1(d0)})"/>`;
        q += `<rect x="${dx - 6}" y="${f1(d0 - 10)}" width="36" height="10" fill="${C.SALMON2}"/><rect x="${dx - 6}" y="${f1(d1)}" width="36" height="10" fill="${C.SALMON2}"/>`;
      }
      return q;
    };
    if (o.lajurA !== false) s += lajur(o.yA ?? 470, o.h ?? 300, false);
    if (o.lajurB !== false) s += lajur(o.yB ?? 900, o.h ?? 300, true);
    return s;
  }

  // ---------- papan kertas ----------
  function papan(x, y, s, o = {}) {
    const a = o.a ?? 1; if (a <= 0) return "";
    let q = `<rect x="-150" y="-190" width="300" height="400" rx="20" fill="#000" opacity=".18" transform="translate(10 14)"/><rect x="-150" y="-190" width="300" height="400" rx="20" fill="${C.KAYU}"/><rect x="-128" y="-160" width="256" height="350" rx="8" fill="${C.TULANG}"/>`;
    q += `<rect x="-60" y="-210" width="120" height="50" rx="14" fill="${C.ABU}"/><rect x="-36" y="-222" width="72" height="26" rx="10" fill="${C.ABU}"/>`;
    const gg = o.garis || [180, 150, 200, 120, 170];
    gg.forEach((w, i) => { q += `<rect x="-100" y="${-120 + i * 46}" width="${w}" height="14" rx="7" fill="${C.TULANG3}"/>`; });
    q += `<path d="M-100 130 L-40 130 L-10 96 L20 150 L50 110 L100 110" stroke="${C.TULANG3}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (o.centang > 0) { const k = halus(o.centang); q += `<circle cx="0" cy="10" r="${f1(120 * Math.min(1, k * 1.4))}" fill="${C.HIJAU3}" opacity="${f3(0.18 * k)}"/><path d="M-70 10 L-18 64 L84 -60" stroke="${C.HIJAU}" stroke-width="34" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="260" stroke-dashoffset="${f1(260 * (1 - k))}"/>`; }
    if (o.silang > 0) { const k = cl(o.silang), sc = lerp(1.9, 1, halus(k)); q += `<g transform="rotate(-12) scale(${f3(sc)})" opacity="${f3(cl(k * 2.5))}"><circle cx="0" cy="10" r="122" fill="none" stroke="${C.SALMON2}" stroke-width="14"/><path d="M-62 -52 L62 72 M62 -52 L-62 72" stroke="${C.SALMON2}" stroke-width="32" stroke-linecap="round"/></g>`; }
    if (o.titik > 0) q += `<circle cx="96" cy="-116" r="${f1(22 * halus(o.titik))}" fill="${C.HIJAU3}"/><circle cx="96" cy="-116" r="${f1(36 * halus(o.titik))}" fill="none" stroke="${C.HIJAU3}" stroke-width="5" opacity=".6"/>`;
    if (o.label) { const k = halus(o.labelK ?? 1); q += `<g opacity="${f3(k)}"><rect x="-140" y="${222 + (1 - k) * 12}" width="280" height="58" rx="14" fill="${C.TULANG}"/><text x="0" y="${263 + (1 - k) * 12}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="32" letter-spacing="2" fill="${C.HIJAUT}">${o.label}</text></g>`; }
    return g(x, y, s, `<g opacity="${f3(a)}">${q}</g>`, o.rot || 0);
  }
  function capKecil(x, y, s, k) {
    if (k <= 0) return "";
    const sc = lerp(1.8, 1, halus(cl(k))) * s;
    return g(x, y, sc, `<g opacity="${f3(cl(k * 2.5))}" transform="rotate(-10)"><circle r="60" fill="none" stroke="${C.SALMON2}" stroke-width="10"/><path d="M-30 -30 L30 30 M30 -30 L-30 30" stroke="${C.SALMON2}" stroke-width="18" stroke-linecap="round"/></g>`);
  }

  // ---------- tiga uji: VR, video, jalan nyata ----------
  function vr(x, y, s, t = 0) {
    const id = uid("vr");
    let lor = ""; for (let i = 0; i < 4; i++) { const q = ((t * 0.8 + i / 4) % 1), r = 8 + q * 60; lor += `<rect x="${f1(-r)}" y="${f1(-r * 0.8)}" width="${f1(r * 2)}" height="${f1(r * 1.6)}" fill="none" stroke="${C.SALMONL}" stroke-width="3" opacity="${f3(1 - q)}"/>`; }
    const lensa = (cx) => `<g transform="translate(${cx} 0)"><circle r="70" fill="${C.HIJAUT}"/><g clip-path="url(#${id})">${lor}<rect x="-12" y="-22" width="24" height="44" fill="${C.SALMON}"/></g></g>`;
    return g(x, y, s, `<defs><clipPath id="${id}"><circle r="62"/></clipPath></defs><path d="M-260 -10 Q-300 -150 0 -170 Q300 -150 260 -10" stroke="${C.HIJAU3}" stroke-width="34" fill="none"/><rect x="-250" y="-120" width="500" height="230" rx="80" fill="${C.TULANG}"/><rect x="-250" y="40" width="500" height="70" rx="40" fill="${C.TULANG2}"/>${lensa(-110)}${lensa(110)}<path d="M-40 110 Q0 70 40 110" fill="${C.TULANG2}"/>`);
  }
  function layarVideo(x, y, s, t = 0) {
    const q = (t * 0.6) % 1, px = lerp(-170, 170, q);
    return g(x, y, s, `<rect x="-280" y="-190" width="560" height="360" rx="26" fill="${C.HIJAUT}"/><rect x="-252" y="-162" width="504" height="304" rx="12" fill="${C.SALMONP}"/><rect x="-252" y="60" width="504" height="82" fill="${C.KAYUL}" opacity=".6"/><rect x="-30" y="-120" width="80" height="182" fill="${C.KAYU}"/><rect x="-18" y="-108" width="56" height="170" fill="${C.SALMON}"/>
<g transform="translate(${f1(px)} 40)"><circle cx="0" cy="-86" r="22" fill="${C.HIJAU}"/><rect x="-18" y="-64" width="36" height="70" rx="14" fill="${C.HIJAU3}"/><rect x="-14" y="2" width="10" height="${f1(24 + Math.sin(t * 9) * 6)}" fill="${C.HIJAU}"/><rect x="4" y="2" width="10" height="${f1(24 - Math.sin(t * 9) * 6)}" fill="${C.HIJAU}"/></g>
<rect x="-80" y="180" width="160" height="22" rx="8" fill="${C.HIJAUT}"/><rect x="-140" y="196" width="280" height="16" rx="8" fill="${C.HIJAU}"/><rect x="-252" y="126" width="${f1(504 * q)}" height="10" fill="${C.SALMON2}"/>`);
  }
  function jejakPintu(x, y, s, t = 0, k = 1) {
    let q = `<rect x="-260" y="-260" width="520" height="440" fill="${C.LANTAI}" rx="20"/><rect x="-260" y="-80" width="520" height="40" fill="${C.HIJAU}"/><rect x="-80" y="-84" width="160" height="48" fill="${C.KAYUL}"/>`;
    for (let i = 0; i < 6; i++) { const kk = halus(lin2(k * 6 - i)); if (kk <= 0) continue; const yy = 150 - i * 76, xx = (i % 2 ? 26 : -26); q += `<g opacity="${f3(kk)}" transform="translate(${xx} ${yy})"><ellipse rx="20" ry="30" fill="${C.TULANG}"/><circle cx="-8" cy="-40" r="7" fill="${C.TULANG}"/><circle cx="6" cy="-42" r="7" fill="${C.TULANG}"/></g>`; }
    return g(x, y, s, q);
  }
  const lin2 = (v) => cl(v);
  function pusaranHitung(x, y, s, t = 0, k = 1) {
    if (k <= 0) return "";
    let q = ""; const n = 9;
    for (let i = 0; i < n; i++) {
      const a = t * 2.4 + (i / n) * Math.PI * 2, r = 120 + 20 * Math.sin(t * 3 + i), px = Math.cos(a) * r, py = Math.sin(a) * r * 0.42;
      if (i % 3 === 0) q += `<g transform="translate(${f1(px)} ${f1(py)}) rotate(${f1(a * 30)})"><rect x="-30" y="-2" width="60" height="5" fill="${C.KAYU2}"/>${[-18, 0, 18].map((bx) => `<circle cx="${bx}" cy="0" r="10" fill="${C.SALMON2}"/>`).join("")}</g>`;
      else if (i % 3 === 1) q += `<g transform="translate(${f1(px)} ${f1(py)}) rotate(${f1(-a * 20)})">${[-15, -5, 5, 15].map((bx) => `<rect x="${bx - 2}" y="-18" width="5" height="36" rx="2" fill="${C.HIJAUT}"/>`).join("")}<rect x="-24" y="-3" width="48" height="5" rx="2" fill="${C.HIJAUT}" transform="rotate(-30)"/></g>`;
      else q += `<circle cx="${f1(px)}" cy="${f1(py)}" r="12" fill="${C.HIJAU3}"/>`;
    }
    return g(x, y, s * halus(k), `<g opacity="${f3(halus(k))}"><ellipse rx="150" ry="62" fill="${C.HIJAUT}" opacity=".12"/>${q}</g>`);
  }

  // ---------- dapur ----------
  function dapur(t = 0, o = {}) {
    const id = uid("dp"), bk = halus(o.buka || 0);
    let s = `<defs><radialGradient id="${id}" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="${C.SALMONP}"/><stop offset="1" stop-color="${C.SALMON}"/></radialGradient><radialGradient id="${id}k"><stop offset="0" stop-color="#FFFDF6" stop-opacity=".95"/><stop offset="1" stop-color="#FFFDF6" stop-opacity="0"/></radialGradient></defs>`;
    s += `<rect x="-400" y="-400" width="1880" height="2720" fill="url(#${id})"/>`;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) s += `<rect x="${-300 + c * 120 + (r % 2) * 60}" y="${780 + r * 70}" width="112" height="62" rx="6" fill="${C.TULANG}" opacity=".45"/>`;
    s += `<rect x="-400" y="1560" width="1880" height="760" fill="${C.HIJAU}"/>`;
    for (let i = 0; i < 12; i++) s += `<rect x="${-400 + i * 160}" y="1560" width="6" height="760" fill="${C.HIJAUT}" opacity=".4"/>`;
    // jendela + lemari atas
    s += `<rect x="60" y="360" width="330" height="300" rx="14" fill="${C.HIJAU3}"/><rect x="76" y="376" width="298" height="268" rx="8" fill="${C.SALMONL}"/><circle cx="300" cy="460" r="40" fill="${C.TULANG}"/><rect x="221" y="376" width="8" height="268" fill="${C.HIJAU3}"/>`;
    s += `<rect x="-200" y="200" width="200" height="300" rx="10" fill="${C.HIJAU2}"/>`;
    // meja dapur + kompor generik
    s += `<rect x="-300" y="1180" width="740" height="380" fill="${C.HIJAU2}"/><rect x="-320" y="1150" width="780" height="40" rx="8" fill="${C.TULANG2}"/><rect x="-200" y="1250" width="140" height="200" rx="10" fill="${C.HIJAU3}" opacity=".6"/><rect x="120" y="1250" width="140" height="200" rx="10" fill="${C.HIJAU3}" opacity=".6"/>`;
    s += `<rect x="60" y="1100" width="170" height="54" rx="12" fill="${C.INK}"/><ellipse cx="145" cy="1100" rx="64" ry="12" fill="${C.ABU}"/>`;
    s += `<path d="M300 1150 L300 1080 Q300 1050 330 1050 L390 1050 Q420 1050 420 1080 L420 1150Z" fill="${C.SALMON2}"/>`;
    // kulkas generik (kanan)
    const KX = 640, KY = 560, KW = 330, KH = 1000;
    s += `<rect x="${KX - 10}" y="${KY - 10}" width="${KW + 20}" height="${KH + 10}" rx="34" fill="#000" opacity=".12"/><rect x="${KX}" y="${KY}" width="${KW}" height="${KH}" rx="30" fill="${C.TULANG}"/>`;
    if (bk > 0) {
      s += `<rect x="${KX + 16}" y="${KY + 16}" width="${KW - 32}" height="${KH - 32}" rx="20" fill="#FFFBF2"/>`;
      [300, 560, 780].forEach((yy) => { s += `<rect x="${KX + 16}" y="${KY + yy}" width="${KW - 32}" height="10" fill="${C.TULANG3}"/>`; });
      s += `<rect x="${KX + 50}" y="${KY + 220}" width="70" height="80" rx="10" fill="${C.SALMON}"/><rect x="${KX + 150}" y="${KY + 190}" width="50" height="110" rx="16" fill="${C.HIJAU3}"/><ellipse cx="${KX + 240}" cy="${KY + 530}" rx="50" ry="30" fill="${C.SALMON2}"/><rect x="${KX + 50}" y="${KY + 470}" width="110" height="90" rx="10" fill="${C.TULANG2}"/>`;
      s += `<circle cx="${KX + KW / 2}" cy="${KY + 500}" r="${f1(520 * bk)}" fill="url(#${id}k)" opacity="${f3(0.6 * bk)}"/>`;
      // pintu kulkas terbuka (ke kiri, menyempit)
      const dw = lerp(KW, 70, bk);
      s += `<path d="M${KX} ${KY} L${f1(KX - dw * 0.15 * bk - (KW - dw) * 0.0)} ${KY - 30 * bk} L${f1(KX - dw * 0.15 * bk)} ${KY + KH + 30 * bk} L${KX} ${KY + KH}Z" fill="${C.TULANG2}" opacity="${f3(bk)}"/>`;
      if (bk < 1) s += `<rect x="${KX}" y="${KY}" width="${f1(dw)}" height="${KH}" rx="30" fill="${C.TULANG}" opacity="${f3(1 - bk)}"/>`;
    } else s += `<rect x="${KX + 270}" y="${KY + 120}" width="16" height="200" rx="8" fill="${C.TULANG3}"/><rect x="${KX}" y="${KY + 360}" width="${KW}" height="8" fill="${C.TULANG3}"/><rect x="${KX + 270}" y="${KY + 420}" width="16" height="160" rx="8" fill="${C.TULANG3}"/>`;
    return s;
  }
  function hp(x, y, s, rot = 0, nyala = 1) {
    return g(x, y, s, `<rect x="-36" y="-64" width="72" height="128" rx="14" fill="${C.INK}"/><rect x="-28" y="-54" width="56" height="106" rx="6" fill="${nyala ? C.SALMONP : C.HIJAU}"/>${nyala ? `<rect x="-20" y="-40" width="34" height="14" rx="7" fill="${C.HIJAU3}"/><rect x="-14" y="-18" width="34" height="14" rx="7" fill="${C.SALMON}"/><rect x="-20" y="4" width="28" height="14" rx="7" fill="${C.HIJAU3}"/>` : ""}`, rot);
  }
  function chat(x, y, s, k, kanan = false, t = 0) {
    if (k <= 0) return "";
    const kk = halus(k), w = 220, warna = kanan ? C.HIJAU3 : C.TULANG;
    const titik = [0, 1, 2].map((i) => `<circle cx="${-40 + i * 40}" cy="${f1(Math.sin(t * 8 + i) * 5)}" r="12" fill="${kanan ? C.TULANG : C.HIJAU3}"/>`).join("");
    return g(x, y, s * (0.7 + 0.3 * kk), `<g opacity="${f3(kk)}"><rect x="${-w / 2}" y="-44" width="${w}" height="88" rx="40" fill="${warna}"/><path d="M${kanan ? 70 : -70} 36 L${kanan ? 110 : -110} 66 L${kanan ? 30 : -30} 40Z" fill="${warna}"/>${titik}</g>`);
  }

  // ---------- pita film garis putus-putus (bahasa visual "dugaan") ----------
  function miniRuang(jenis, w, h, t) {
    if (jenis === "tamu") return `<rect width="${w}" height="${h}" fill="${C.HIJAU2}"/><rect y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="${C.LANTAI}"/><rect x="${w * 0.08}" y="${h * 0.48}" width="${w * 0.5}" height="${h * 0.26}" rx="20" fill="${C.HIJAUT}"/><rect x="${w * 0.12}" y="${h * 0.42}" width="${w * 0.18}" height="${h * 0.14}" rx="14" fill="${C.SALMON}"/><circle cx="${w * 0.78}" cy="${h * 0.26}" r="${h * 0.11}" fill="${C.TULANG}"/><rect x="${w * 0.78 - 3}" y="${h * 0.18}" width="6" height="${h * 0.09}" fill="${C.HIJAUT}" transform="rotate(${f1(t * 40)} ${w * 0.78} ${h * 0.26})"/>`;
    if (jenis === "kamar") return `<rect width="${w}" height="${h}" fill="${C.SALMONL}"/><rect y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="${C.SALMON2}" opacity=".6"/><rect x="${w * 0.35}" y="${h * 0.5}" width="${w * 0.56}" height="${h * 0.24}" rx="14" fill="${C.KAYU2}"/><rect x="${w * 0.37}" y="${h * 0.44}" width="${w * 0.54}" height="${h * 0.14}" rx="16" fill="${C.TULANG}"/><rect x="${w * 0.05}" y="${h * 0.18}" width="${w * 0.22}" height="${h * 0.56}" rx="6" fill="${C.KAYU}"/>`;
    return `<rect width="${w}" height="${h}" fill="${C.SALMONP}"/><rect y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="${C.HIJAU}"/><rect x="${w * 0.05}" y="${h * 0.5}" width="${w * 0.5}" height="${h * 0.24}" fill="${C.HIJAU2}"/><rect x="${w * 0.66}" y="${h * 0.12}" width="${w * 0.26}" height="${h * 0.62}" rx="14" fill="${C.TULANG}"/>`;
  }
  function pitaFilm(x, y, t = 0, o = {}) {
    const FW = o.fw || 560, FH = o.fh || 400, GAP = 120, jenis = ["tamu", "kamar", "dapur"], pud = o.pudar || [0, 0, 0];
    let s = "";
    const total = FW * 3 + GAP * 2;
    s += `<rect x="${x - 60}" y="${y - 70}" width="${total + 120}" height="${FH + 140}" rx="18" fill="${C.HIJAUT}" opacity=".85"/>`;
    for (let i = 0; i * 70 < total + 80; i++) s += `<rect x="${x - 40 + i * 70}" y="${y - 52}" width="36" height="28" rx="6" fill="none" stroke="${C.TULANG}" stroke-width="4" stroke-dasharray="8 6"/><rect x="${x - 40 + i * 70}" y="${y + FH + 24}" width="36" height="28" rx="6" fill="none" stroke="${C.TULANG}" stroke-width="4" stroke-dasharray="8 6"/>`;
    jenis.forEach((j, i) => {
      const fx = x + i * (FW + GAP), id = uid("pf");
      s += `<defs><clipPath id="${id}"><rect x="${fx}" y="${y}" width="${FW}" height="${FH}" rx="12"/></clipPath></defs><g clip-path="url(#${id})" opacity="${f3(1 - pud[i] * 0.65)}"><g transform="translate(${fx} ${y})">${miniRuang(j, FW, FH, t)}</g>${o.isiBingkai && o.isiBingkai[i] ? o.isiBingkai[i] : ""}</g>`;
      s += `<rect x="${fx}" y="${y}" width="${FW}" height="${FH}" rx="12" fill="none" stroke="${C.TULANG}" stroke-width="9" stroke-dasharray="26 16" stroke-dashoffset="${f1(-t * 30)}"/>`;
      if (pud[i] > 0) s += `<rect x="${fx}" y="${y}" width="${FW}" height="${FH}" rx="12" fill="${C.HIJAUT}" opacity="${f3(pud[i] * 0.35)}"/>`;
      if (i < 2) { const kx = fx + FW + GAP / 2; s += `<rect x="${kx - 40}" y="${y + 20}" width="80" height="${FH - 20}" fill="none" stroke="${C.KAYUL}" stroke-width="14"/><rect x="${kx - 40}" y="${y + 20}" width="80" height="${FH - 20}" fill="${C.SALMON}" opacity=".35"/>`; }
    });
    return s;
  }

  // ---------- timbangan ----------
  function timbangan(x, y, s, miring, isiK = "", isiN = "") {
    const a = (miring * Math.PI) / 180, L = 330, kx = -L * Math.cos(a), ky = -L * Math.sin(a), nx = L * Math.cos(a), ny = L * Math.sin(a);
    const piring = (px, py, isi) => `<path d="M${f1(px)} ${f1(py)} L${f1(px - 150)} ${f1(py + 300)} M${f1(px)} ${f1(py)} L${f1(px + 150)} ${f1(py + 300)}" stroke="${C.TULANG3}" stroke-width="6"/><path d="M${f1(px - 190)} ${f1(py + 300)} Q${f1(px)} ${f1(py + 380)} ${f1(px + 190)} ${f1(py + 300)}Z" fill="${C.KAYUL}"/>${g(px, py + 300, 1, isi)}`;
    return g(x, y, s, `<path d="M-160 560 L160 560 L90 500 L-90 500Z" fill="${C.KAYU2}"/><rect x="-18" y="-20" width="36" height="530" fill="${C.KAYU}"/><circle cx="0" cy="-20" r="34" fill="${C.KAYU2}"/><g><path d="M${f1(kx)} ${f1(ky)} L${f1(nx)} ${f1(ny)}" stroke="${C.KAYU}" stroke-width="30" stroke-linecap="round"/>${piring(kx, ky, isiK)}${piring(nx, ny, isiN)}</g><circle cx="0" cy="-20" r="16" fill="${C.TULANG}"/>`);
  }

  // ---------- lorong tiga pintu ----------
  function lorong(t = 0, o = {}) {
    const bk = o.buka || [0, 0, 0], X = o.x || [540, 1240, 1940], Y0 = 560, Y1 = 1380, DW = 440;
    let s = `<rect x="-400" y="-400" width="3600" height="${Y1 + 400}" fill="${C.HIJAU}"/>`;
    for (let i = -4; i < 40; i++) s += `<rect x="${i * 90}" y="-400" width="36" height="${Y1 + 400}" fill="${C.HIJAUT}" opacity=".08"/>`;
    s += `<rect x="-400" y="${Y1 - 200}" width="3600" height="200" fill="${C.HIJAUT}" opacity=".28"/><rect x="-400" y="${Y1}" width="3600" height="900" fill="${C.LANTAI}"/>`;
    for (let i = 0; i < 9; i++) s += `<rect x="-400" y="${Y1 + 30 + i * 80}" width="3600" height="5" fill="${C.LANTAI2}"/>`;
    for (let i = 0; i < 4; i++) { const lx = (X[0] + X[1]) / 2 + (i - 0.5) * 700; s += `<circle cx="${lx}" cy="380" r="140" fill="${C.SALMONL}" opacity=".12"/><rect x="${lx - 40}" y="330" width="80" height="40" rx="12" fill="${C.SALMONL}" opacity=".8"/>`; }
    const dalam = [
      `<rect width="${DW}" height="${Y1 - Y0}" fill="${C.SALMONL}"/><rect y="${(Y1 - Y0) * 0.78}" width="${DW}" height="${(Y1 - Y0) * 0.22}" fill="${C.SALMON2}" opacity=".6"/><rect x="${DW * 0.4}" y="${(Y1 - Y0) * 0.6}" width="${DW * 0.6}" height="${(Y1 - Y0) * 0.2}" rx="14" fill="${C.KAYU2}"/><rect x="${DW * 0.42}" y="${(Y1 - Y0) * 0.55}" width="${DW * 0.58}" height="${(Y1 - Y0) * 0.1}" rx="14" fill="${C.TULANG}"/>`,
      `<rect width="${DW}" height="${Y1 - Y0}" fill="${C.SALMONP}"/><rect y="${(Y1 - Y0) * 0.78}" width="${DW}" height="${(Y1 - Y0) * 0.22}" fill="${C.HIJAU2}"/><rect x="${DW * 0.6}" y="${(Y1 - Y0) * 0.18}" width="${DW * 0.34}" height="${(Y1 - Y0) * 0.62}" rx="14" fill="${C.TULANG}"/><rect x="0" y="${(Y1 - Y0) * 0.56}" width="${DW * 0.45}" height="${(Y1 - Y0) * 0.24}" fill="${C.HIJAU3}"/>`,
      `<rect width="${DW}" height="${Y1 - Y0}" fill="${C.SALMON}"/><rect y="${(Y1 - Y0) * 0.78}" width="${DW}" height="${(Y1 - Y0) * 0.22}" fill="${C.KAYU2}"/>${[0.2, 0.42].map((r) => `<rect x="${DW * 0.08}" y="${(Y1 - Y0) * r}" width="${DW * 0.84}" height="12" fill="${C.KAYU2}"/>` + [0, 1, 2, 3, 4].map((i) => `<rect x="${DW * (0.12 + i * 0.16)}" y="${(Y1 - Y0) * r - 70}" width="${DW * 0.1}" height="70" rx="10" fill="${[C.HIJAU3, C.TULANG, C.SALMON2, C.HIJAU4, C.TULANG2][i]}"/>`).join("")).join("")}<rect x="${DW * 0.08}" y="${(Y1 - Y0) * 0.6}" width="${DW * 0.84}" height="${(Y1 - Y0) * 0.18}" fill="${C.KAYU}"/>`,
    ];
    X.forEach((cx, i) => {
      const x0 = cx - DW / 2, k = halus(bk[i]), id = uid("lp");
      s += `<defs><clipPath id="${id}"><rect x="${x0}" y="${Y0}" width="${DW}" height="${Y1 - Y0}"/></clipPath></defs>`;
      s += `<g clip-path="url(#${id})"><g transform="translate(${x0} ${Y0})">${dalam[i]}</g>${o.isi && o.isi[i] ? o.isi[i] : ""}</g>`;
      if (i < 2) {
        // daun pintu kayu membuka (lebar menyempit ke engsel kiri)
        const dw = DW * (1 - 0.86 * k);
        s += `<path d="M${x0} ${Y0} L${f1(x0 + dw)} ${f1(Y0 + 30 * k)} L${f1(x0 + dw)} ${f1(Y1 - 20 * k)} L${x0} ${Y1}Z" fill="${C.KAYU}"/><path d="M${f1(x0 + dw * 0.12)} ${f1(Y0 + 60)} L${f1(x0 + dw * 0.88)} ${f1(Y0 + 60 + 26 * k)} L${f1(x0 + dw * 0.88)} ${f1(Y0 + 360)} L${f1(x0 + dw * 0.12)} ${f1(Y0 + 360)}Z" fill="${C.KAYUL}" opacity=".5"/><circle cx="${f1(x0 + dw * 0.86)}" cy="${(Y0 + Y1) / 2}" r="12" fill="${C.TULANG3}" opacity="${f3(1 - k)}"/>`;
      } else {
        // warung: tirai plastik bergaris menyibak
        for (let j = 0; j < 9; j++) { const bx = x0 + j * (DW / 9), off = (j < 4.5 ? -1 : 1) * k * (DW * 0.42) * (1 - Math.abs(j - 4) / 6), gy = Math.sin(t * 2 + j) * 4; s += `<rect x="${f1(bx + off)}" y="${Y0}" width="${f1(DW / 9 - 4)}" height="${f1(Y1 - Y0 - 120 + gy)}" rx="6" fill="${j % 2 ? C.SALMONL : C.HIJAU4}" opacity=".75"/>`; }
      }
      s += `<rect x="${x0 - 40}" y="${Y0 - 40}" width="40" height="${Y1 - Y0 + 40}" fill="${C.KAYU2}"/><rect x="${x0 + DW}" y="${Y0 - 40}" width="40" height="${Y1 - Y0 + 40}" fill="${C.KAYU2}"/><rect x="${x0 - 50}" y="${Y0 - 70}" width="${DW + 100}" height="40" rx="6" fill="${C.KAYU}"/>`;
      if (i === 2) s += `<rect x="${x0 - 90}" y="${Y0 - 150}" width="${DW + 180}" height="80" rx="10" fill="${C.SALMON2}"/><path d="M${x0 - 90} ${Y0 - 70} ${[...Array(8)].map((_, j) => `Q${f1(x0 - 90 + (j + 0.5) * ((DW + 180) / 8))} ${Y0 - 20} ${f1(x0 - 90 + (j + 1) * ((DW + 180) / 8))} ${Y0 - 70}`).join(" ")}Z" fill="${C.TULANG}"/>`;
    });
    return s;
  }

  root.ASET = root.ASET || {};
  root.ASET.AMBANG = { C, PINTU, tanya, ruangAmbang, gelembung, pecah, charger, cangkir, catatanNiat, kacaPembesar, sorot, panah, orangAtas, meteran, denah, papan, capKecil,
    vr, layarVideo, jejakPintu, pusaranHitung, dapur, hp, chat, pitaFilm, timbangan, lorong };
})(typeof window !== "undefined" ? window : globalThis);
