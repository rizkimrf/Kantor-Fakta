/* ===== SET LAGU NYANGKUT (Yoga, 24 Nov 2026, video B3-09 "lagu nyangkut di kepala") =====
 * Muat SETELAH aset-set.js. Gaya datar tanpa garis hitam; palet KREM + BIRU LANGIT pagi dengan aksen JINGGA (gelembung/kaset) + pink permen karet.
 * Beda dari A3-01 (kasir merah-putih), A3-02 (pintu minimarket oranye-krem + hijau), B3-04 (kamar berry-magenta), A3-06 (indigo x-ray).
 * Semua fungsi murni (fungsi waktu kontinu t) dan mengembalikan string SVG. Tanpa tulisan/merek/nomor trayek; satu-satunya teks = lencana "1 STUDI".
 *  langitPagi(w,h,t,o) · kotaJauh(w,y,t,o) · jalanPagi(w,h,t,o)  latar pinggir jalan pagi (o.horizon, o.geser = parallax)
 *  halte(x,y,s) · angkot(x,y,s,t,o) · warung(x,y,s,t,o) · bangku(x,y,s)
 *  dalamAngkot(w,h,t,o)        interior angkot pagi: jendela + pemandangan lewat, dua bangku berhadapan
 *  orang(x,y,s,t,o)            orang generik tampak depan; o.duduk, o.ekspresi 'biasa'|'senang'|'tidur'|'bengong'|'galau'|'ngobrol'|'nyengir', o.rambut, o.baju, o.kulit
 *  gelembung(x,y,r,t,o)        gelembung pikiran (o.nyala 0..1, o.redup 0..1, o.ekor [x,y], o.isi svg di pusat)
 *  kaset(x,y,s,t,o)            pemutar kaset mini generik (o.rot sudut gulungan, o.tekan 0..1, o.dj, o.debu, o.redup, o.wajah)
 *  pitaLoop(cx,cy,rx,ry,rot,t,o) → {belakang, depan} pita kaset melingkari kepala + bentuk nada generik · untai(titik,t,o)
 *  nada(x,y,s,warna,rot) · glitch(x,y,s,t,k) · jari(x,y,s,t,o) · ikon(jenis,x,y,s) · tombolPlay(x,y,s,tekan)
 *  permen(x,y,s,o) · tanya(x,y,s,a,warna) · lencanaStudi(x,y,s,k) · labelKaset(x,y,s,t,o) · kalender(x,y,s,t)
 *  kotakRequest(x,y,s,t) · lampuPesta(cx,cy,t,a) · ikonSurvei(x,y,s,t,k) · mulutKecil(x,y,s,t,o) · hp(x,y,s,rot) · daun(x,y,s,rot)
 *  kamarSubuh(w,h,t)          sisipan kamar subuh (latar untuk kilas balik bangun tidur)
 */
(function (root) {
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, f3 = (v) => Math.round(v * 1000) / 1000;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const halus = (x) => { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  let _n = 0; const uid = (p) => `${p}L${++_n}`;
  const g = (x, y, s, isi, rot = 0, sy) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)} ${f3(sy ?? s)})">${isi}</g>`;
  const C = {
    KREM: "#FFF3DE", KREM2: "#F7E3C1", KREM3: "#EBCB9A", KREM4: "#D9AE74",
    LANGIT0: "#7FC6EC", LANGIT: "#A9DBF4", LANGIT2: "#D3EEFA", BIRU: "#4FA3D6", BIRU2: "#2F79A8", BIRUT: "#1D4B6C", BIRUM: "#16354D",
    JINGGA: "#FF8A3D", JINGGA2: "#F2691C", JINGGAL: "#FFC48C", JINGGAP: "#FFE2C2",
    PINK: "#FF8FB8", PINK2: "#E5639A", PINKL: "#FFD0E2", PITA: "#5B3B2A", PITA2: "#8A5A3C",
    ASPAL: "#8D9BAB", ASPAL2: "#7A8899", KUL: "#E9B48C", KULG: "#C98E68", KULS: "#F6CDAA", KULT: "#B77B55",
    INK: "#22303E", ABU: "#A7B4C0", ABU2: "#C9D3DB",
  };

  // ---------- langit & kota ----------
  function langitPagi(w, h, t = 0, o = {}) {
    const id = uid("lp"), hz = o.horizon || h * 0.55, gs = o.geser || 0;
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.LANGIT0}"/><stop offset="${f2(hz / h * 0.7)}" stop-color="${C.LANGIT}"/><stop offset="${f2(hz / h)}" stop-color="${C.KREM}"/><stop offset="1" stop-color="${C.KREM}"/></linearGradient>
<radialGradient id="${id}m"><stop offset="0" stop-color="#FFF8E6" stop-opacity=".95"/><stop offset=".35" stop-color="#FFE7B8" stop-opacity=".55"/><stop offset="1" stop-color="#FFE7B8" stop-opacity="0"/></radialGradient></defs>
<rect width="${w}" height="${h}" fill="url(#${id})"/>`;
    const mx = (o.mx ?? w * 0.78) - gs * 0.1, my = o.my ?? hz * 0.38;
    s += `<circle cx="${f1(mx)}" cy="${f1(my)}" r="300" fill="url(#${id}m)"/><circle cx="${f1(mx)}" cy="${f1(my)}" r="78" fill="#FFF6DC"/>`;
    for (let i = 0; i < 5; i++) {
      const x = ((i * 410 + t * (10 + i * 3) - gs * 0.2) % (w + 600)) - 300, y = hz * (0.16 + 0.13 * (i % 3));
      s += g(x, y, 0.8 + (i % 2) * 0.4, `<ellipse cx="0" cy="0" rx="120" ry="34" fill="#FFFFFF" opacity=".75"/><ellipse cx="-40" cy="-22" rx="60" ry="36" fill="#FFFFFF" opacity=".75"/><ellipse cx="40" cy="-14" rx="50" ry="30" fill="#FFFFFF" opacity=".75"/>`);
    }
    return s;
  }
  function kotaJauh(w, y, t = 0, o = {}) {
    const gs = o.geser || 0; let s = "";
    for (let i = -2; i < Math.ceil(w / 150) + 3; i++) {
      const bx = i * 150 - (gs * 0.35) % 150, hh = 160 + (Math.abs(i * 7919) % 5) * 60 + (Math.abs(i * 31) % 3) * 30;
      s += `<rect x="${f1(bx)}" y="${f1(y - hh)}" width="128" height="${hh}" fill="${i % 2 ? "#BCDDEE" : "#CBE5F1"}"/>`;
      for (let r = 0; r < hh / 60 - 1; r++) s += `<rect x="${f1(bx + 22)}" y="${f1(y - hh + 30 + r * 60)}" width="28" height="22" fill="#E6F4FA"/><rect x="${f1(bx + 76)}" y="${f1(y - hh + 30 + r * 60)}" width="28" height="22" fill="#E6F4FA"/>`;
    }
    return s;
  }
  function pohon(x, y, s) { return g(x, y, s, `<rect x="-14" y="-160" width="28" height="160" fill="#B98A5E"/><circle cx="0" cy="-200" r="92" fill="#8FC7B5"/><circle cx="-60" cy="-160" r="62" fill="#7DBBA8"/><circle cx="62" cy="-170" r="66" fill="#9CD1BF"/>`); }
  function jalanPagi(w, h, t = 0, o = {}) {
    const hz = o.horizon || 1150, gs = o.geser || 0;
    let s = langitPagi(w, h, t, { horizon: hz, geser: gs, mx: o.mx, my: o.my });
    s += kotaJauh(w, hz, t, { geser: gs });
    for (let i = -1; i < w / 380 + 2; i++) s += pohon(i * 380 + 120 - (gs * 0.6) % 380, hz + 10, 0.9);
    s += `<rect y="${hz}" width="${w}" height="120" fill="${C.KREM2}"/><rect y="${hz + 120}" width="${w}" height="18" fill="${C.KREM4}"/>`;
    for (let i = -1; i < w / 120 + 2; i++) s += `<rect x="${f1(i * 120 - gs % 120)}" y="${hz}" width="4" height="120" fill="${C.KREM3}"/>`;
    s += `<rect y="${hz + 138}" width="${w}" height="${h - hz - 138}" fill="${C.ASPAL}"/>`;
    for (let i = -1; i < w / 260 + 2; i++) s += `<rect x="${f1(i * 260 - gs % 260)}" y="${hz + 330}" width="140" height="16" rx="8" fill="#E9EEF2" opacity=".8"/>`;
    return s;
  }

  // ---------- halte, angkot, warung, bangku ----------
  function halte(x, y, s) {
    return g(x, y, s, `<rect x="-300" y="-430" width="600" height="40" rx="14" fill="${C.BIRU2}"/><rect x="-310" y="-446" width="620" height="22" rx="10" fill="${C.BIRU}"/>
<rect x="-270" y="-390" width="18" height="390" fill="${C.BIRUT}"/><rect x="252" y="-390" width="18" height="390" fill="${C.BIRUT}"/>
<rect x="-250" y="-380" width="500" height="250" fill="#FFFFFF" opacity=".28"/><rect x="-230" y="-120" width="460" height="26" rx="8" fill="${C.KREM4}"/><rect x="-210" y="-94" width="14" height="94" fill="${C.BIRUT}"/><rect x="196" y="-94" width="14" height="94" fill="${C.BIRUT}"/>`);
  }
  function angkot(x, y, s, t = 0, o = {}) {
    const wr = (o.roda || 0) * 57.3, bd = o.warna || C.BIRU, bd2 = o.warna2 || C.BIRU2;
    const roda = (cx) => `<g transform="translate(${cx} 0) rotate(${f1(wr)})"><circle r="62" fill="${C.INK}"/><circle r="30" fill="${C.ABU2}"/><rect x="-6" y="-30" width="12" height="60" fill="${C.ABU}"/></g>`;
    return g(x, y, s, `<ellipse cx="0" cy="10" rx="360" ry="24" fill="#000" opacity=".16"/>
<path d="M-340 -40 L-340 -250 Q-338 -300 -280 -300 L170 -300 Q230 -300 260 -250 L330 -150 Q350 -120 350 -80 L350 -40 Q350 -10 320 -10 L-310 -10 Q-340 -10 -340 -40Z" fill="${bd}"/>
<rect x="-340" y="-130" width="690" height="34" fill="${C.KREM}"/><rect x="-340" y="-96" width="690" height="10" fill="${C.JINGGA}"/>
<rect x="-300" y="-270" width="130" height="110" rx="14" fill="${C.LANGIT2}"/><rect x="-150" y="-270" width="130" height="110" rx="14" fill="${C.LANGIT2}"/><rect x="0" y="-270" width="130" height="110" rx="14" fill="${C.LANGIT2}"/>
<path d="M150 -270 L220 -270 Q240 -270 252 -250 L300 -170 Q304 -160 292 -160 L150 -160Z" fill="${C.LANGIT2}"/>
<path d="M-290 -262 L-250 -262 L-292 -200Z M-140 -262 L-100 -262 L-142 -200Z M10 -262 L50 -262 L8 -200Z" fill="#FFFFFF" opacity=".55"/>
<rect x="-340" y="-40" width="690" height="30" fill="${bd2}"/><circle cx="330" cy="-60" r="14" fill="#FFF1B8"/>${roda(-200)}${roda(200)}`);
  }
  function warung(x, y, s, t = 0, o = {}) {
    const ny = cl(o.nyala || 0);
    let q = `<ellipse cx="0" cy="6" rx="330" ry="22" fill="#000" opacity=".14"/><rect x="-300" y="-520" width="600" height="520" fill="${C.KREM2}"/><rect x="-300" y="-520" width="600" height="20" fill="${C.KREM4}"/>`;
    q += `<rect x="-260" y="-470" width="520" height="210" fill="#E3C79C"/>`;
    for (let i = 0; i < 5; i++) q += `<rect x="${-240 + i * 100}" y="-460" width="70" height="${80 + (i % 2) * 30}" rx="8" fill="${["#FFB0C8", "#8FD3F0", "#FFC48C", "#BFE3C9", "#FFE08A"][i]}"/>`;
    for (let i = 0; i < 4; i++) q += `<ellipse cx="${-210 + i * 140}" cy="-300" rx="40" ry="46" fill="#FFFFFF" opacity=".55"/><rect x="${-232 + i * 140}" y="-352" width="44" height="14" rx="6" fill="${C.JINGGA2}"/>`;
    q += `<rect x="-300" y="-250" width="600" height="250" fill="${C.BIRU2}"/><rect x="-300" y="-250" width="600" height="26" fill="${C.BIRUT}"/>`;
    // atap belang (menyala saat jadi pemicu)
    if (ny > 0) { const id = uid("wg"); q += `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${C.JINGGAL}" stop-opacity=".9"/><stop offset="1" stop-color="${C.JINGGAL}" stop-opacity="0"/></radialGradient></defs><ellipse cx="0" cy="-540" rx="${f1(460 + 30 * Math.sin(t * 6))}" ry="200" fill="url(#${id})" opacity="${f2(ny)}"/>`; }
    for (let i = 0; i < 8; i++) q += `<path d="M${-340 + i * 85} -560 L${-255 + i * 85} -560 L${-255 + i * 85} -500 Q${-297 + i * 85} -470 ${-340 + i * 85} -500Z" fill="${i % 2 ? C.KREM : C.JINGGA}"/>`;
    q += `<rect x="-350" y="-580" width="700" height="24" rx="10" fill="${C.JINGGA2}"/>`;
    return g(x, y, s, q);
  }
  function bangku(x, y, s) { return g(x, y, s, `<rect x="-200" y="-110" width="400" height="26" rx="10" fill="${C.KREM4}"/><rect x="-200" y="-190" width="400" height="20" rx="8" fill="${C.KREM3}"/><rect x="-180" y="-84" width="16" height="84" fill="${C.BIRUT}"/><rect x="164" y="-84" width="16" height="84" fill="${C.BIRUT}"/>`); }

  // ---------- interior angkot ----------
  function dalamAngkot(w, h, t = 0, o = {}) {
    const lewat = o.lewat ?? t * 260;
    let s = `<rect width="${w}" height="${h}" fill="${C.KREM2}"/>`;
    // jendela samping + pemandangan lewat
    const jy = 300, jh = 360;
    s += `<rect x="0" y="${jy - 30}" width="${w}" height="${jh + 60}" fill="${C.BIRU2}"/>`;
    const id = uid("jd");
    s += `<defs><clipPath id="${id}"><rect x="40" y="${jy}" width="${w - 80}" height="${jh}" rx="30"/></clipPath></defs><g clip-path="url(#${id})"><rect x="0" y="${jy}" width="${w}" height="${jh}" fill="${C.LANGIT}"/>`;
    for (let i = -1; i < w / 160 + 3; i++) { const bx = i * 160 - (lewat % 160), hh = 120 + (Math.abs((i + Math.floor(lewat / 160)) * 7) % 4) * 50; s += `<rect x="${f1(bx)}" y="${jy + jh - hh}" width="140" height="${hh}" fill="${Math.abs(i + Math.floor(lewat / 160)) % 2 ? "#CBE5F1" : "#BCDDEE"}"/>`; }
    for (let i = -1; i < w / 420 + 3; i++) { const bx = i * 420 - ((lewat * 1.6) % 420); s += pohon(bx + 100, jy + jh + 40, 0.75); }
    s += `<rect x="0" y="${jy}" width="${w}" height="${jh}" fill="#FFFFFF" opacity=".12"/><path d="M60 ${jy} L180 ${jy} L60 ${jy + 200}Z" fill="#FFFFFF" opacity=".25"/></g>`;
    for (let i = 1; i < 4; i++) s += `<rect x="${i * w / 4 - 12}" y="${jy}" width="24" height="${jh}" fill="${C.BIRU2}"/>`;
    // cahaya pagi menyorot
    s += `<path d="M120 ${jy + jh} L520 ${jy + jh} L760 ${h} L-120 ${h}Z" fill="#FFF4D6" opacity=".25"/>`;
    // bangku belakang & depan (berhadapan)
    s += `<rect x="0" y="${o.bangku1 || 1020}" width="${w}" height="70" fill="${C.KREM4}"/><rect x="0" y="${(o.bangku1 || 1020) + 70}" width="${w}" height="40" fill="${C.KREM3}"/>`;
    s += `<rect x="0" y="${o.lantai || 1560}" width="${w}" height="${h}" fill="${C.ASPAL2}"/>`;
    // pegangan atas
    s += `<rect x="0" y="250" width="${w}" height="14" fill="${C.ABU}"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M${90 + i * 180} 264 l0 30 m-20 0 a20 20 0 1 0 40 0" stroke="${C.ABU}" stroke-width="8" fill="none"/>`;
    return s;
  }

  // ---------- orang generik ----------
  function orang(x, y, s, t = 0, o = {}) {
    const kul = o.kulit || C.KUL, baju = o.baju || C.BIRU, rmb = o.warnaRambut || "#3A2A20", ek = o.ekspresi || "biasa";
    const duduk = !!o.duduk, ang = (o.angguk || 0) * Math.sin(t * 2.2) * 4, nafas = Math.sin(t * 2 + (o.fase || 0)) * 3;
    let q = `<ellipse cx="0" cy="0" rx="${duduk ? 120 : 100}" ry="18" fill="#000" opacity=".14"/>`;
    if (duduk) q += `<rect x="-78" y="-150" width="66" height="150" rx="22" fill="${o.celana || "#3D4E66"}"/><rect x="12" y="-150" width="66" height="150" rx="22" fill="${o.celana || "#3D4E66"}"/><rect x="-96" y="-190" width="192" height="70" rx="30" fill="${o.celana || "#3D4E66"}"/>`;
    else q += `<rect x="-70" y="-250" width="60" height="250" rx="22" fill="${o.celana || "#3D4E66"}"/><rect x="10" y="-250" width="60" height="250" rx="22" fill="${o.celana || "#3D4E66"}"/><rect x="-80" y="-14" width="74" height="22" rx="10" fill="${C.INK}"/><rect x="6" y="-14" width="74" height="22" rx="10" fill="${C.INK}"/>`;
    const by = duduk ? -150 : -230; // dasar badan
    q += `<path d="M-104 ${by} Q-114 ${by - 170 + nafas} -76 ${by - 220 + nafas} Q0 ${by - 246 + nafas} 76 ${by - 220 + nafas} Q114 ${by - 170 + nafas} 104 ${by}Z" fill="${baju}"/>`;
    // lengan
    const lk = o.lengan || "turun";
    if (lk === "turun") q += `<rect x="-132" y="${by - 200}" width="44" height="${duduk ? 170 : 200}" rx="22" fill="${baju}"/><rect x="88" y="${by - 200}" width="44" height="${duduk ? 170 : 200}" rx="22" fill="${baju}"/><circle cx="-110" cy="${by - 30 + (duduk ? 0 : 30)}" r="24" fill="${kul}"/><circle cx="110" cy="${by - 30 + (duduk ? 0 : 30)}" r="24" fill="${kul}"/>`;
    else if (lk === "ngobrol") { const ay = Math.sin(t * 5 + (o.fase || 0)) * 14; q += `<rect x="-132" y="${by - 200}" width="44" height="170" rx="22" fill="${baju}"/><circle cx="-110" cy="${by - 30}" r="24" fill="${kul}"/><path d="M110 ${by - 190} Q190 ${by - 160} 170 ${by - 260 + ay}" stroke="${baju}" stroke-width="44" fill="none" stroke-linecap="round"/><circle cx="170" cy="${by - 266 + ay}" r="26" fill="${kul}"/>`; }
    q += `<g transform="rotate(${f1(ang + (o.miring || 0))} 0 ${by - 230})">`;
    q += `<rect x="-24" y="${by - 262}" width="48" height="40" fill="${o.kulitG || C.KULG}"/>`;
    const hy = by - 350; // pusat kepala
    if (o.rambut === "kerudung") q += `<path d="M-112 ${hy + 10} Q-120 ${hy - 120} 0 ${hy - 122} Q120 ${hy - 120} 112 ${hy + 10} L120 ${hy + 120} Q0 ${hy + 160} -120 ${hy + 120}Z" fill="${o.warnaKerudung || "#F2A0B8"}"/>`;
    q += `<ellipse cx="-90" cy="${hy + 6}" rx="18" ry="26" fill="${kul}"/><ellipse cx="90" cy="${hy + 6}" rx="18" ry="26" fill="${kul}"/>`;
    q += `<ellipse cx="0" cy="${hy}" rx="88" ry="98" fill="${kul}"/>`;
    if (o.rambut === "panjang") q += `<path d="M-94 ${hy - 4} Q-100 ${hy - 120} 0 ${hy - 114} Q100 ${hy - 120} 94 ${hy - 4} Q96 ${hy + 70} 90 ${hy + 100} L78 ${hy - 10} Q24 ${hy - 64} -78 ${hy - 10} L-90 ${hy + 100} Q-96 ${hy + 70} -94 ${hy - 4}Z" fill="${rmb}"/>`;
    else if (o.rambut === "topi") q += `<path d="M-92 ${hy - 30} Q-90 ${hy - 120} 0 ${hy - 118} Q90 ${hy - 120} 92 ${hy - 30}Z" fill="${o.warnaTopi || C.JINGGA}"/><rect x="-10" y="${hy - 44}" width="140" height="22" rx="11" fill="${o.warnaTopi || C.JINGGA2}"/>`;
    else if (o.rambut === "ikat") q += `<path d="M-90 ${hy - 10} Q-100 ${hy - 116} 0 ${hy - 112} Q96 ${hy - 116} 90 ${hy - 14} Q60 ${hy - 70} -10 ${hy - 62} Q-60 ${hy - 62} -90 ${hy - 10}Z" fill="${rmb}"/><circle cx="0" cy="${hy - 118}" r="34" fill="${rmb}"/>`;
    else if (o.rambut === "botak") q += `<path d="M-90 ${hy - 2} Q-92 ${hy - 40} -80 ${hy - 50} L-74 ${hy - 2}Z M90 ${hy - 2} Q92 ${hy - 40} 80 ${hy - 50} L74 ${hy - 2}Z" fill="#B8B0A8"/>`;
    else if (o.rambut !== "kerudung") q += `<path d="M-90 ${hy - 10} Q-100 ${hy - 118} 0 ${hy - 116} Q96 ${hy - 120} 90 ${hy - 18} Q60 ${hy - 70} -10 ${hy - 60} Q-60 ${hy - 60} -90 ${hy - 10}Z" fill="${rmb}"/>`;
    // wajah
    const kd = (t * 1.3 + (o.fase || 0)) % 4 < 0.12; // kedip
    const mata = (ex) => {
      if (ek === "tidur") return `<path d="M${ex - 16} ${hy + 4} q16 10 32 0" stroke="#2A1A14" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      if (ek === "senang" || ek === "nyengir") return `<path d="M${ex - 15} ${hy + 4} q15 -14 30 0" stroke="#2A1A14" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      if (ek === "bengong") return `<ellipse cx="${ex}" cy="${hy + 2}" rx="12" ry="12" fill="#FFFFFF"/><circle cx="${ex + 2}" cy="${hy + 4}" r="5" fill="#2A1A14"/><path d="M${ex - 14} ${hy - 6} l28 0" stroke="${o.kulitG || C.KULG}" stroke-width="7" stroke-linecap="round"/>`;
      if (kd) return `<path d="M${ex - 10} ${hy + 2} l20 0" stroke="#2A1A14" stroke-width="6" stroke-linecap="round"/>`;
      return `<ellipse cx="${ex + (o.lihatX || 0)}" cy="${hy}" rx="9" ry="12" fill="#2A1A14"/>`;
    };
    q += mata(-32) + mata(32);
    if (ek === "galau") q += `<path d="M-48 ${hy - 26} l26 10 M48 ${hy - 26} l-26 10" stroke="#2A1A14" stroke-width="6" stroke-linecap="round"/>`;
    q += `<ellipse cx="-54" cy="${hy + 40}" rx="15" ry="8" fill="#F58A7A" opacity=".4"/><ellipse cx="54" cy="${hy + 40}" rx="15" ry="8" fill="#F58A7A" opacity=".4"/>`;
    if (ek === "tidur") { const m = 10 + 5 * Math.sin(t * 2.4); q += `<ellipse cx="0" cy="${hy + 52}" rx="16" ry="${f1(m)}" fill="#7A2B2B"/>`; }
    else if (ek === "bengong") q += `<ellipse cx="0" cy="${hy + 52}" rx="12" ry="9" fill="#7A2B2B"/>`;
    else if (ek === "galau") q += `<path d="M-22 ${hy + 58} Q0 ${hy + 42} 22 ${hy + 58}" stroke="#7A2B2B" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    else if (ek === "ngobrol") { const m = Math.abs(Math.sin(t * 9 + (o.fase || 0))) * 14 + 3; q += `<ellipse cx="0" cy="${hy + 52}" rx="18" ry="${f1(m)}" fill="#7A2B2B"/>`; }
    else if (ek === "nyengir") q += `<path d="M-30 ${hy + 42} Q0 ${hy + 76} 30 ${hy + 42}Z" fill="#7A2B2B"/>`;
    else q += `<path d="M-24 ${hy + 46} Q0 ${hy + (ek === "senang" ? 66 : 56)} 24 ${hy + 46}" stroke="#7A2B2B" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    q += `</g>`;
    if (o.isi) q += o.isi;
    return g(x, y, s, q);
  }
  orang.kepala = (x, y, s, o = {}) => { const by = o.duduk ? -150 : -230; return [x, y + (by - 350) * s]; };

  // ---------- gelembung pikiran ----------
  function gelembung(x, y, r, t = 0, o = {}) {
    const ny = cl(o.nyala ?? 1), rd = cl(o.redup || 0), a = o.a ?? 1;
    if (a <= 0.001) return "";
    const warna = o.warna || "#FFD09C", gelap = "#C9D3DB";
    const isiW = ny > 0.5 ? warna : gelap;
    const n = 9, bump = [];
    for (let i = 0; i < n; i++) { const an = (i / n) * Math.PI * 2 + 0.3, rr = r * (0.84 + 0.05 * Math.sin(t * 1.6 + i * 2)); bump.push([x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.86, r * 0.36]); }
    let s = `<g opacity="${f3(a * (1 - 0.45 * rd))}">`;
    if (ny > 0) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.5)}" fill="#FFF1D8" opacity="${f3(0.35 * ny * (1 - rd))}"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.22)}" fill="#FFE0B5" opacity="${f3(0.45 * ny * (1 - rd))}"/>`;
    if (o.ekor) { const [tx, ty] = o.ekor; [0.28, 0.16, 0.09].forEach((rr, i) => { const k = 1.05 + i * 0.32, px = lerp(x, tx, 0.62 + i * 0.16), py = lerp(y + r * 0.7, ty, 0.62 + i * 0.16); s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r * rr * (1 - i * 0.12))}" fill="${isiW}"/>`; void k; }); }
    s += bump.map(([bx, by, br]) => `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(br + Math.max(3, r * 0.035))}" fill="${ny > 0.5 ? C.JINGGA : C.ABU}"/>`).join("") + bump.map(([bx, by, br]) => `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(br)}" fill="${isiW}"/>`).join("") + `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 0.9)}" ry="${f1(r * 0.78)}" fill="${isiW}"/>`;
    if (ny > 0 && ny < 1) s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 0.9)}" ry="${f1(r * 0.78)}" fill="${warna}" opacity="${f3(ny)}"/>`;
    s += `<ellipse cx="${f1(x - r * 0.35)}" cy="${f1(y - r * 0.42)}" rx="${f1(r * 0.28)}" ry="${f1(r * 0.12)}" fill="#FFFFFF" opacity=".6" transform="rotate(-20 ${f1(x - r * 0.35)} ${f1(y - r * 0.42)})"/>`;
    if (o.isi) s += o.isi;
    if (rd > 0) s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.02)}" ry="${f1(r * 0.92)}" fill="#8796A6" opacity="${f3(0.35 * rd)}"/>`;
    return s + `</g>`;
  }

  // ---------- kaset ----------
  function gulung(cx, cy, r, rot, isiPita) {
    let s = `<circle cx="${cx}" cy="${cy}" r="${f1(r * isiPita)}" fill="${C.PITA}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="#FFFFFF"/>`;
    for (let i = 0; i < 6; i++) { const a = (rot + i * 60) * Math.PI / 180; s += `<rect x="${f1(cx + Math.cos(a) * r * 0.26 - 5)}" y="${f1(cy + Math.sin(a) * r * 0.26 - 5)}" width="10" height="10" rx="2" fill="${C.BIRUT}" transform="rotate(${f1(rot + i * 60)} ${f1(cx + Math.cos(a) * r * 0.26)} ${f1(cy + Math.sin(a) * r * 0.26)})"/>`; }
    return s + `<circle cx="${cx}" cy="${cy}" r="9" fill="${C.BIRUT}"/>`;
  }
  function kaset(x, y, s, t = 0, o = {}) {
    const rot = o.rot ?? t * 140, tk = cl(o.tekan || 0), rd = cl(o.redup || 0);
    let q = `<ellipse cx="0" cy="96" rx="140" ry="14" fill="#000" opacity=".15"/>`;
    // tombol atas
    [-90, -30, 30, 90].forEach((bx, i) => { const pl = i === 1, dy = pl ? 14 * tk : 0; q += `<rect x="${bx - 24}" y="${-104 + dy}" width="48" height="30" rx="8" fill="${pl ? C.JINGGA : C.KREM3}"/>${pl ? `<path d="M${bx - 7} ${-96 + dy} l16 8 l-16 8Z" fill="#FFFFFF"/>` : ""}`; });
    q += `<rect x="-150" y="-84" width="300" height="180" rx="30" fill="${C.KREM}"/><rect x="-150" y="-84" width="300" height="40" rx="20" fill="${C.BIRU}"/><rect x="-150" y="-60" width="300" height="16" fill="${C.BIRU}"/>`;
    q += `<rect x="-112" y="-30" width="224" height="104" rx="22" fill="${C.BIRUM}"/>`;
    q += `<rect x="-60" y="30" width="120" height="10" fill="${C.PITA2}"/>`;
    q += gulung(-56, 22, 40, rot, o.pitaK ?? 0.9) + gulung(56, 22, 40, rot * 1.05, o.pitaN ?? 0.75);
    q += `<path d="M-100 -20 L-40 -20 L-100 40Z" fill="#FFFFFF" opacity=".12"/>`;
    q += `<circle cx="-118" cy="-62" r="7" fill="${C.KREM}" opacity=".9"/><circle cx="118" cy="-62" r="7" fill="${o.lampu ? "#FF5A4A" : C.KREM}" opacity=".9"/>`;
    if (o.dj) { const k = cl(o.dj);
      q += `<g opacity="${f3(k)}"><path d="M-160 -10 Q-170 -180 0 -186 Q170 -180 160 -10" stroke="${C.INK}" stroke-width="18" fill="none"/><rect x="-190" y="-40" width="46" height="90" rx="20" fill="${C.INK}"/><rect x="144" y="-40" width="46" height="90" rx="20" fill="${C.INK}"/><rect x="-184" y="-26" width="16" height="60" rx="8" fill="${C.JINGGA}"/><rect x="168" y="-26" width="16" height="60" rx="8" fill="${C.JINGGA}"/>
<g transform="translate(0 ${f1((1 - k) * -40)})"><rect x="-108" y="-6" width="96" height="58" rx="22" fill="${C.INK}"/><rect x="12" y="-6" width="96" height="58" rx="22" fill="${C.INK}"/><rect x="-14" y="8" width="28" height="10" fill="${C.INK}"/><path d="M-96 4 L-60 4 L-96 30Z M24 4 L60 4 L24 30Z" fill="#FFFFFF" opacity=".35"/></g></g>`; }
    if (o.debu) { const k = cl(o.debu); q += `<g opacity="${f3(k)}"><rect x="-150" y="-104" width="300" height="200" rx="30" fill="#9E9384" opacity=".5"/><path d="M-150 -60 Q-110 -70 -100 -104 M-150 -30 Q-80 -50 -64 -104 M-150 -60 L-64 -104 M-120 -40 Q-90 -80 -82 -104" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".8"/><path d="M150 96 Q120 60 70 96 M150 60 Q100 40 40 96 M150 96 L60 50" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".8"/>${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${-120 + i * 48}" cy="${-70 + (i % 3) * 50}" r="${4 + (i % 2) * 3}" fill="#D8CFC2" opacity=".8"/>`).join("")}</g>`; }
    if (rd > 0) q += `<rect x="-150" y="-104" width="300" height="200" rx="30" fill="#8796A6" opacity="${f3(0.45 * rd)}"/>`;
    return g(x, y, s, q, o.miring || 0);
  }

  // ---------- pita melingkar & nada ----------
  function nada(x, y, s, warna = C.JINGGA2, rot = 0) {
    return g(x, y, s, `<ellipse cx="0" cy="0" rx="20" ry="15" fill="${warna}" transform="rotate(-20)"/><rect x="14" y="-62" width="8" height="62" rx="3" fill="${warna}"/><path d="M18 -62 Q44 -52 40 -26 Q34 -44 18 -44Z" fill="${warna}"/>`, rot);
  }
  function pitaLoop(cx, cy, rx, ry, rot, t = 0, o = {}) {
    const laju = o.laju ?? 1, fase = o.fase ?? t * laju, tebal = o.tebal || 16, a = o.a ?? 1;
    const ra = rot * Math.PI / 180, P = (th) => [cx + Math.cos(th) * rx * Math.cos(ra) - Math.sin(th) * ry * Math.sin(ra), cy + Math.cos(th) * rx * Math.sin(ra) + Math.sin(th) * ry * Math.cos(ra)];
    const busur = (a0, a1) => { let d = ""; for (let i = 0; i <= 40; i++) { const p = P(lerp(a0, a1, i / 40)); d += (i ? "L" : "M") + f1(p[0]) + " " + f1(p[1]); } return d; };
    const garis = (d) => `<path d="${d}" stroke="${C.PITA}" stroke-width="${tebal}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C.PITA2}" stroke-width="${f1(tebal * 0.3)}" fill="none" stroke-dasharray="40 30" stroke-dashoffset="${f1(-fase * 260)}" stroke-linecap="round"/>`;
    let bel = `<g opacity="${f3(a)}">` + garis(busur(Math.PI, Math.PI * 2)) + `</g>`, dep = `<g opacity="${f3(a)}">` + garis(busur(0, Math.PI));
    const nn = o.nada ?? 5, wn = [C.JINGGA2, C.BIRU2, C.PINK2, C.JINGGA, C.BIRU];
    for (let i = 0; i < nn; i++) {
      const th = ((fase * 0.9 + i / nn) % 1) * Math.PI * 2, p = P(th), dpn = Math.sin(th) > 0, ka = (o.nadaA ?? 1) * (0.55 + 0.45 * Math.abs(Math.sin(th)));
      const nd = `<g opacity="${f3(ka)}">${nada(p[0], p[1] - tebal - 22, (o.nadaS || 0.9) * (dpn ? 1 : 0.8), wn[i % wn.length], Math.sin(t * 3 + i) * 12)}</g>`;
      if (dpn) dep += nd; else bel += `<g opacity="${f3(a)}">${nd}</g>`;
    }
    return { belakang: bel, depan: dep + `</g>`, titik: P };
  }
  function untai(titik, t = 0, o = {}) {
    let d = `M${f1(titik[0][0])} ${f1(titik[0][1])}`;
    for (let i = 1; i < titik.length - 1; i++) { const m = [(titik[i][0] + titik[i + 1][0]) / 2, (titik[i][1] + titik[i + 1][1]) / 2]; d += ` Q${f1(titik[i][0])} ${f1(titik[i][1])} ${f1(m[0])} ${f1(m[1])}`; }
    const L = titik[titik.length - 1]; d += ` L${f1(L[0])} ${f1(L[1])}`;
    const tb = o.tebal || 14;
    return `<g opacity="${f3(o.a ?? 1)}"><path d="${d}" stroke="${C.PITA}" stroke-width="${tb}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C.PITA2}" stroke-width="${f1(tb * 0.3)}" fill="none" stroke-dasharray="40 30" stroke-dashoffset="${f1(-(o.fase ?? t) * 260)}"/></g>`;
  }

  // ---------- ikon kecil ----------
  function glitch(x, y, s, t = 0, k = 1) {
    if (k <= 0.001) return "";
    const jt = Math.sin(t * 47) * 6, sh = `<path d="M0 -80 L80 60 L-80 60Z" stroke-linejoin="round"/>`;
    return g(x, y, s * (0.7 + 0.3 * k), `<g opacity="${f3(k)}"><g transform="translate(${f1(jt)} 0)" fill="#5FD6F2" opacity=".7">${sh}</g><g transform="translate(${f1(-jt)} 3)" fill="#FF7AB0" opacity=".7">${sh}</g><path d="M0 -80 L80 60 L-80 60Z" fill="#FFC93C" stroke="#FFC93C" stroke-width="18" stroke-linejoin="round"/>
<path d="M-6 -36 L14 -4 L-6 4 L10 40" stroke="${C.INK}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="-90" y="${f1(-10 + Math.sin(t * 31) * 30)}" width="180" height="8" fill="#FFFFFF" opacity=".6"/></g>`);
  }
  function ikon(jenis, x, y, s = 1) {
    let q = `<circle r="46" fill="#FFFFFF"/>`;
    if (jenis === "bicara") q += `<path d="M-28 -20 Q-28 -30 -18 -30 L22 -30 Q32 -30 32 -20 L32 6 Q32 16 22 16 L-4 16 L-18 30 L-16 16 L-18 16 Q-28 16 -28 6Z" fill="${C.BIRU}"/><circle cx="-10" cy="-7" r="5" fill="#FFF"/><circle cx="4" cy="-7" r="5" fill="#FFF"/><circle cx="18" cy="-7" r="5" fill="#FFF"/>`;
    else if (jenis === "warung") { q += `<rect x="-26" y="-6" width="52" height="32" fill="${C.BIRU2}"/>`; for (let i = 0; i < 4; i++) q += `<path d="M${-32 + i * 16} -26 l16 0 l0 16 q-8 8 -16 0Z" fill="${i % 2 ? C.KREM3 : C.JINGGA}"/>`; }
    else if (jenis === "mood") q += `<circle cx="-12" cy="-6" r="18" fill="#FFC93C"/><path d="M-12 -34 l0 -6 M-38 -6 l-6 0 M-30 -26 l-4 -4" stroke="#FFC93C" stroke-width="5" stroke-linecap="round"/><ellipse cx="14" cy="8" rx="22" ry="13" fill="${C.ABU}"/><circle cx="4" cy="2" r="11" fill="${C.ABU}"/><path d="M6 24 l-3 8 M16 24 l-3 8 M26 24 l-3 8" stroke="${C.BIRU}" stroke-width="4" stroke-linecap="round"/>`;
    else if (jenis === "lamun") q += `<ellipse cx="0" cy="4" rx="28" ry="16" fill="${C.LANGIT}"/><circle cx="-12" cy="-6" r="14" fill="${C.LANGIT}"/><circle cx="10" cy="-8" r="16" fill="${C.LANGIT}"/><path d="M-14 4 q8 -10 16 0 t16 0" stroke="${C.BIRU2}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    return g(x, y, s, q);
  }
  function jari(x, y, s, t = 0, o = {}) {
    const tk = cl(o.tekan || 0), dy = 34 * Math.sin(Math.PI * tk), kul = o.kulit || C.KUL;
    let q = `<g transform="translate(0 ${f1(dy)})"><rect x="-26" y="-180" width="52" height="70" rx="14" fill="${o.lengan || C.BIRU}"/><ellipse cx="0" cy="-90" rx="40" ry="34" fill="${kul}"/><rect x="-12" y="-80" width="24" height="76" rx="12" fill="${kul}"/><ellipse cx="0" cy="-12" rx="9" ry="6" fill="${C.KULS}"/>
<path d="M-36 -100 q-12 14 0 26 M36 -104 q10 14 -2 26" stroke="${o.kulitG || C.KULG}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
    if (o.ikon) q += ikon(o.ikon, 0, -250, 0.9);
    if (tk > 0 && tk < 1) q += `<circle cx="0" cy="0" r="${f1(20 + 60 * tk)}" fill="none" stroke="${C.JINGGA}" stroke-width="${f1(8 * (1 - tk))}" opacity="${f3(1 - tk)}"/>`;
    return g(x, y, s, q);
  }
  function tombolPlay(x, y, s, tekan = 0) {
    const tk = Math.sin(Math.PI * cl(tekan)), sy = 1 - 0.1 * tk;
    return g(x, y, s, `<ellipse cx="0" cy="40" rx="190" ry="40" fill="#000" opacity=".15"/><ellipse cx="0" cy="24" rx="180" ry="60" fill="${C.JINGGA2}"/><g transform="translate(0 ${f1(26 * tk)}) scale(1 ${f3(sy)})"><rect x="-180" y="-60" width="360" height="84" fill="${C.JINGGA2}"/><ellipse cx="0" cy="-60" rx="180" ry="60" fill="${C.JINGGA}"/><path d="M-36 -96 L52 -60 L-36 -24Z" fill="#FFFFFF"/></g>`);
  }
  function permen(x, y, s, o = {}) {
    const sx = o.sx || 1, sy = o.sy || 1;
    return g(x, y, s, `<g transform="scale(${f3(sx)} ${f3(sy)})"><path d="M-70 -20 Q-80 -60 -30 -62 Q10 -80 46 -56 Q82 -40 72 0 Q80 44 34 54 Q-10 70 -44 50 Q-84 34 -70 -20Z" fill="${C.PINK}"/><path d="M-40 -30 Q-10 -50 30 -36" stroke="${C.PINKL}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-30 28 Q10 40 40 22" stroke="${C.PINK2}" stroke-width="8" fill="none" stroke-linecap="round"/></g>`, o.rot || 0);
  }
  function tanya(x, y, s, a = 1, warna = C.JINGGA2) { if (a <= 0.001) return ""; return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${f1(120 * s)}" fill="${warna}" opacity="${f3(a)}" stroke="#FFFFFF" stroke-width="${f1(10 * s)}" paint-order="stroke">?</text>`; }
  function lencanaStudi(x, y, s, k = 1) {
    if (k <= 0.001) return "";
    const e = halus(k);
    return g(x, y, s * (0.7 + 0.3 * e), `<g opacity="${f3(e)}"><rect x="-150" y="-46" width="300" height="92" rx="46" fill="#FFFFFF"/><rect x="-150" y="-46" width="300" height="92" rx="46" fill="none" stroke="${C.BIRU2}" stroke-width="6"/>
<g transform="translate(-100 0)"><path d="M-22 -30 L12 -30 L24 -18 L24 30 L-22 30Z" fill="${C.LANGIT}"/><path d="M12 -30 L12 -18 L24 -18Z" fill="${C.BIRU}"/><rect x="-14" y="-12" width="28" height="5" rx="2" fill="${C.BIRU2}"/><rect x="-14" y="0" width="28" height="5" rx="2" fill="${C.BIRU2}"/><rect x="-14" y="12" width="18" height="5" rx="2" fill="${C.BIRU2}"/></g>
<text x="30" y="16" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="44" fill="${C.BIRUT}">1 STUDI</text></g>`);
  }
  function labelKaset(x, y, s, t = 0, o = {}) {
    const cr = cl(o.coret || 0), rot = o.rot ?? t * 120;
    let q = `<ellipse cx="0" cy="190" rx="330" ry="30" fill="#000" opacity=".15"/><rect x="-340" y="-210" width="680" height="400" rx="34" fill="${C.BIRU}"/><rect x="-300" y="-180" width="600" height="190" rx="18" fill="#FFFFFF"/>
<rect x="-300" y="-180" width="600" height="34" rx="16" fill="${C.JINGGA}"/><rect x="-300" y="-160" width="600" height="14" fill="${C.JINGGA}"/>`;
    for (let i = 0; i < 3; i++) q += `<rect x="-270" y="${-110 + i * 42}" width="540" height="4" fill="${C.ABU2}"/>`;
    q += `<rect x="-200" y="30" width="400" height="120" rx="30" fill="${C.BIRUM}"/>` + gulung(-110, 90, 46, rot, 0.85) + gulung(110, 90, 46, rot, 0.7);
    q += `<path d="M-250 160 L-300 190 L300 190 L250 160Z" fill="${C.BIRU2}"/>`;
    // coretan bergelombang (tanpa huruf terbaca)
    if (cr > 0) { let d = "", n = 60; for (let i = 0; i <= n * cr; i++) { const u = i / n, xx = -240 + u * 480, yy = -60 + Math.sin(u * 38) * 16 + Math.sin(u * 11) * 6; d += (i ? "L" : "M") + f1(xx) + " " + f1(yy); } q += `<path d="${d}" stroke="${C.BIRUT}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      const u = cr, px = -240 + u * 480, py = -60 + Math.sin(u * 38) * 16 + Math.sin(u * 11) * 6;
      if (cr < 1 || o.pena) q += g(px, py, 1, `<rect x="-12" y="-200" width="24" height="170" rx="10" fill="${C.JINGGA2}" transform="rotate(30)"/><path d="M-12 -30 L0 0 L12 -30Z" fill="${C.INK}" transform="rotate(30)"/>`); }
    return g(x, y, s, q, o.miring || 0);
  }
  function kalender(x, y, s, t = 0) {
    const bl = (t * 2.2) % 1, kk = Math.cos(Math.PI * bl);
    let q = `<rect x="-90" y="-100" width="180" height="200" rx="16" fill="#FFFFFF"/><rect x="-90" y="-100" width="180" height="46" rx="16" fill="${C.JINGGA2}"/><rect x="-90" y="-70" width="180" height="16" fill="${C.JINGGA2}"/>`;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) q += `<rect x="${-72 + c * 38}" y="${-38 + r * 40}" width="28" height="28" rx="5" fill="${C.ABU2}"/>`;
    q += `<g transform="translate(0 -54) scale(1 ${f3(kk)})"><rect x="-90" y="${kk > 0 ? 0 : -154}" width="180" height="154" fill="${kk > 0 ? "#FFFFFF" : "#F3EDE4"}" opacity=".95"/></g>`;
    q += `<rect x="-60" y="-114" width="10" height="30" rx="5" fill="${C.INK}"/><rect x="50" y="-114" width="10" height="30" rx="5" fill="${C.INK}"/>`;
    return g(x, y, s, q);
  }
  function kotakRequest(x, y, s, t = 0) {
    return g(x, y, s, `<rect x="-80" y="-70" width="160" height="140" rx="12" fill="${C.KREM3}"/><rect x="-50" y="-60" width="100" height="14" rx="7" fill="${C.INK}"/><rect x="-80" y="-70" width="160" height="140" rx="12" fill="#9E9384" opacity=".35"/>
<path d="M-80 -70 L-10 -10 M-80 -20 Q-40 -30 -30 -70 M-80 20 Q-30 0 10 -70 M-80 -70 L-40 70" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".85"/><path d="M80 -70 Q50 -30 80 0 M80 -70 Q30 -50 20 -70" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".85"/>
<g transform="translate(${f1(-40 + Math.sin(t * 2) * 4)} ${f1(-20 + Math.sin(t * 3) * 3)})"><circle r="6" fill="${C.INK}"/><path d="M-12 -6 L12 6 M-12 6 L12 -6 M0 -12 L0 12" stroke="${C.INK}" stroke-width="2"/></g>`);
  }
  function lampuPesta(cx, cy, t = 0, a = 1) {
    if (a <= 0.001) return "";
    const W = ["#FF8FB8", "#5FD6F2", "#FFC93C", "#FF8A3D", "#A98BFF"];
    let s = "";
    for (let i = 0; i < 5; i++) { const an = -Math.PI / 2 + Math.sin(t * 3 + i * 1.4) * 1.1, L = 900; s += `<path d="M${cx} ${cy} L${f1(cx + Math.cos(an - 0.09) * L)} ${f1(cy + Math.sin(an - 0.09) * L)} L${f1(cx + Math.cos(an + 0.09) * L)} ${f1(cy + Math.sin(an + 0.09) * L)}Z" fill="${W[i]}" opacity="${f3(0.22 * a)}"/>`; }
    return s;
  }
  const FINLANDIA = "M10 -120 L34 -112 L30 -80 L48 -52 L44 -16 L60 20 L52 60 L20 96 L-24 110 L-40 92 L-30 60 L-44 30 L-30 0 L-38 -30 L-14 -56 L-12 -92 L-30 -116Z";
  function ikonSurvei(x, y, s, t = 0, k = 1) {
    if (k <= 0.001) return "";
    const e = halus(k);
    return g(x, y + Math.sin(t * 2) * 6, s * (0.8 + 0.2 * e), `<g opacity="${f3(e)}"><rect x="-100" y="-120" width="150" height="200" rx="16" fill="${C.KREM4}"/><rect x="-86" y="-100" width="122" height="168" rx="8" fill="#FFFFFF"/><rect x="-50" y="-132" width="50" height="28" rx="8" fill="${C.BIRUT}"/>
${[0, 1, 2, 3].map((i) => `<rect x="-70" y="${-74 + i * 36}" width="20" height="20" rx="4" fill="none" stroke="${C.BIRU}" stroke-width="4"/>${i < 3 ? `<path d="M-68 ${-64 + i * 36} l7 7 l12 -14" stroke="${C.JINGGA2}" stroke-width="5" fill="none" stroke-linecap="round"/>` : ""}<rect x="-40" y="${-68 + i * 36}" width="60" height="8" rx="4" fill="${C.ABU2}"/>`).join("")}
<g transform="translate(110 -10) scale(.9)"><path d="${FINLANDIA}" fill="${C.LANGIT0}"/><path d="${FINLANDIA}" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round"/></g></g>`);
  }
  function mulutKecil(x, y, s, t = 0, o = {}) {
    const a = o.a ?? 1; if (a <= 0.001) return "";
    const kun = cl(o.kunyah || 0), ny = Math.abs(Math.sin(t * 7)) * (1 - kun), ch = (0.5 + 0.5 * Math.sin(t * 10)) * kun;
    const hb = 14 + 34 * ny, lb = 70 - 14 * ny + 20 * ch;
    return g(x, y, s, `<g opacity="${f3(a)}"><ellipse cx="0" cy="0" rx="${f1(lb / 2 + 14)}" ry="${f1(hb / 2 + 12 + 6 * ch)}" fill="${C.KULS}"/><ellipse cx="0" cy="0" rx="${f1(lb / 2)}" ry="${f1(kun > 0.5 ? 6 + 6 * ch : hb / 2)}" fill="#7A2B2B"/>${kun > 0.4 ? `<ellipse cx="${f1(10 * Math.sin(t * 10))}" cy="2" rx="12" ry="7" fill="${C.PINK}" opacity="${f3(kun)}"/>` : `<ellipse cx="0" cy="${f1(hb / 4)}" rx="${f1(lb / 4)}" ry="${f1(hb / 6)}" fill="#E8615A"/>`}</g>`);
  }
  function hp(x, y, s, rot = 0) { return g(x, y, s, `<rect x="-34" y="-62" width="68" height="124" rx="14" fill="${C.INK}"/><rect x="-26" y="-50" width="52" height="96" rx="6" fill="${C.LANGIT}"/><path d="M-10 -10 L14 0 L-10 10Z" fill="${C.JINGGA2}"/>`, rot); }
  function daun(x, y, s, rot = 0) { return g(x, y, s, `<path d="M0 -26 Q26 -10 0 26 Q-26 -10 0 -26Z" fill="#8CC7A0"/><path d="M0 -20 L0 22" stroke="#6AA37E" stroke-width="3"/>`, rot); }
  function kamarSubuh(w, h, t = 0) {
    const id = uid("ks");
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD2A6"/><stop offset="1" stop-color="#FFF0DC"/></linearGradient></defs><rect width="${w}" height="${h}" fill="${C.LANGIT2}"/>
<rect x="${w * 0.58}" y="${h * 0.1}" width="${w * 0.32}" height="${h * 0.4}" rx="12" fill="url(#${id})"/><circle cx="${w * 0.74}" cy="${h * 0.46}" r="${h * 0.12}" fill="#FFB877"/><rect x="${w * 0.58}" y="${h * 0.44}" width="${w * 0.32}" height="${h * 0.06}" fill="#9CC9DE"/>
<rect x="0" y="${h * 0.68}" width="${w}" height="${h * 0.32}" fill="${C.KREM3}"/><rect x="${w * 0.04}" y="${h * 0.56}" width="${w * 0.92}" height="${h * 0.24}" rx="24" fill="#FFFFFF"/><rect x="${w * 0.04}" y="${h * 0.7}" width="${w * 0.92}" height="${h * 0.16}" rx="20" fill="${C.BIRU}"/>`;
  }

  root.ASET = root.ASET || {};
  root.ASET.LAGU = { C, langitPagi, kotaJauh, jalanPagi, pohon, halte, angkot, warung, bangku, dalamAngkot, orang, gelembung, kaset, pitaLoop, untai, nada,
    glitch, ikon, jari, tombolPlay, permen, tanya, lencanaStudi, labelKaset, kalender, kotakRequest, lampuPesta, ikonSurvei, mulutKecil, hp, daun, kamarSubuh };
})(typeof window !== "undefined" ? window : globalThis);
