/* ASET REM MOTOR — rem cakram hidrolik generik (Yoga, 22 Nov 2026; dipakai A-06 "Rem motor kok bisa berhenti dengan satu jari?"). Muat SETELAH aset-set.js.
 * Datar tanpa garis hitam, generik TANPA merek/logo/tulisan/angka. Semua fungsi → potongan SVG (string), koordinat kanvas 1080×1920.
 *  penampangRem(t,{tuas,gelombang,panas,air,gelembung,putar,gaya,empuk,sorot:{jari,selang,piston},latar,cairanHangat}) — X-ray tuas → master silinder (piston kecil)
 *        → selang cairan amber → kaliper (piston besar) → cakram (wajah). Panas = oranye HANGAT (bukan merah membara).
 *  titikSelang(u) → [x,y,sudut] titik di sepanjang selang (u 0..1) · panahTekanan(u0,t,a,{n,uk}) chevron tekanan berukuran SAMA
 *  makroKaliper(t,{tekan,tuasSudut,gelombang,gaya,panahKecil,putar,panas,lintasan,latar,empuk,gelembung}) — diagram belah: piston kecil (tuas panjang) ↔ pipa ↔ piston BESAR menjepit cakram (tampak tepi)
 *  motorMatic(x,y,s,t,{roda,tembus,tarik,pengendara,penumpang,warna,arah}) — skuter matik generik tampak samping, depan di kanan; (x,y)=titik tanah tengah
 *  tanganMotor(x,y,s,{tarik}) — tangan bersarung + satu jari di tuas (medium shot) · simpangLampuMerah(w,h,P,t,{lampu,hujan}) — perempatan kota + lampu lalu lintas
 *  tanganRaksasa(x,y,s,t,{remas,gemetar}) + gumpalCairan(x,y,s,t,{susut,gelembung}) · tongkatCair(x,y,s,t,{tuang,lentur,cipratan})
 *  bilikKostum(x,y,s,t,{fase}) — bilik ganti: "si Gerak" masuk (garis laju bermata) → keluar berkostum api · papanTulis(x,y,s,{k}) — tabung U kapur, tanpa tulisan
 *  tabungMinyak(x,y,s,t,{level,serap}) — tabung minyak rem bening di setang · tetesUdara(x0,y0,x1,y1,t,{n,k}) · jariKurus(x,y,s,t) (gag lengan mie) */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  let _n = 0; const uid = (p) => `${p}r${++_n}`;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;
  const mix = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16)); const A1 = p(a), B1 = p(b); k = cl(k); return "#" + A1.map((v, i) => Math.round(v + (B1[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
  const BAJA = "#B9C2CB", BAJA2 = "#8D97A2", BAJA3 = "#DDE3E8", GELAP = "#4A525C", AMBER = "#F2B33D", AMBER2 = "#FFD27A", AMBERT = "#E0962A";
  const HANGAT = "#FF9A4A", KAMPAS = "#7A5A44", KULIT = "#F4C9A1";

  // ---------- selang: 2 kurva kubik + tabel panjang busur ----------
  const SEG = [[[640, 530], [900, 560], [940, 860], [720, 960]], [[720, 960], [500, 1060], [400, 1050], [400, 1170]]];
  const bz = (p, u) => { const v = 1 - u; return [0, 1].map((i) => v * v * v * p[0][i] + 3 * v * v * u * p[1][i] + 3 * v * u * u * p[2][i] + u * u * u * p[3][i]); };
  const LUT = []; (() => { let L = 0, prev = bz(SEG[0], 0); for (let si = 0; si < 2; si++) for (let i = 0; i <= 60; i++) { const q = bz(SEG[si], i / 60); L += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; LUT.push([L, q]); } LUT.forEach((e) => (e[0] /= L)); })();
  function titikSelang(u) {
    u = cl(u); let i = LUT.findIndex((e) => e[0] >= u); if (i <= 0) i = 1;
    const a = LUT[i - 1], b = LUT[i], k = (u - a[0]) / Math.max(1e-6, b[0] - a[0]);
    return [lerp(a[1][0], b[1][0], k), lerp(a[1][1], b[1][1], k), Math.atan2(b[1][1] - a[1][1], b[1][0] - a[1][0]) * 180 / Math.PI];
  }
  const D_SELANG = `M640 530 C900 560 940 860 720 960 C500 1060 400 1050 400 1170`;
  function panahTekanan(u0, t, a = 1, o = {}) { // chevron berukuran sama di sepanjang selang; u0 = posisi depan gelombang
    if (a <= 0) return ""; let s = ""; const n = o.n || 7, uk = o.uk || 1;
    for (let i = 0; i < n; i++) { const u = u0 - i * 0.07; if (u < 0 || u > 1) continue; const [x, y, r] = titikSelang(u);
      s += g(x, y, uk, `<path d="M-10 -16 L8 0 L-10 16" stroke="#FFFFFF" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, r).replace("<g ", `<g opacity="${f2(a * (1 - i / n * 0.35))}" `); }
    return s;
  }
  function titikAir(t, k, gelembung = 0) { // titik air (biru) & gelembung gas (putih) di dalam selang
    let s = ""; const r = acak(77);
    for (let i = 0; i < 26; i++) { const u = (r() + t * 0.01) % 1, [x, y] = titikSelang(u), dx = (r() - 0.5) * 14, dy = (r() - 0.5) * 14;
      if (k > 0 && i < 18) s += `<circle cx="${f1(x + dx)}" cy="${f1(y + dy)}" r="${f1(4.5 * k)}" fill="#4FA8E8" opacity="${f2(0.9 * k)}"/>`;
      if (gelembung > 0 && i % 2 === 0) { const rr = 5 + 8 * gelembung * (0.6 + 0.4 * Math.sin(t * 5 + i)); s += `<circle cx="${f1(x - dx)}" cy="${f1(y - dy)}" r="${f1(rr)}" fill="#FFFFFF" opacity="${f2(0.92 * gelembung)}" stroke="#C9E6F7" stroke-width="2"/>`; } }
    return s;
  }
  function gelombangPanas(x, y, s, t, k, n = 4) {
    if (k <= 0) return ""; let o = "";
    for (let i = 0; i < n; i++) { const u = (t * 0.8 + i / n) % 1, xx = x + (i - (n - 1) / 2) * 70 * s;
      o += `<path d="M${f1(xx)} ${f1(y - u * 120 * s)} q${f1(16 * s)} ${f1(-22 * s)} 0 ${f1(-44 * s)} q${f1(-16 * s)} ${f1(-22 * s)} 0 ${f1(-44 * s)}" stroke="${HANGAT}" stroke-width="${f1(10 * s)}" fill="none" stroke-linecap="round" opacity="${f2(k * 0.85 * Math.sin(Math.PI * u))}"/>`; }
    return o;
  }
  function latarBengkel(t, o = {}) { // dinding bengkel abu baja terang + papan perkakas buram (tanpa tulisan)
    const id = uid("lb");
    let s = `<defs><radialGradient id="${id}" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#F4F7F9"/><stop offset=".45" stop-color="#D3DAE0"/><stop offset="1" stop-color="#9AA5AF"/></radialGradient></defs><rect x="-900" y="-900" width="2880" height="3720" fill="#9AA5AF"/><rect x="-500" y="-500" width="2080" height="2920" fill="url(#${id})"/>`;
    s += `<g opacity=".35" style="filter:blur(5px)">`;
    for (let i = 0; i < 9; i++) s += `<rect x="${i * 130 - 20}" y="160" width="10" height="1500" fill="#B4BEC7"/>`;
    s += `<rect x="40" y="250" width="300" height="180" rx="10" fill="#C3CCD4"/><circle cx="110" cy="330" r="34" fill="#A7B1BA"/><rect x="170" y="300" width="130" height="18" rx="9" fill="#A7B1BA"/><rect x="760" y="230" width="270" height="220" rx="10" fill="#C3CCD4"/><path d="M800 300 l60 0 l0 90 M900 290 l0 110 M960 300 l30 80" stroke="#A7B1BA" stroke-width="14" stroke-linecap="round"/></g>`;
    // kisi x-ray halus
    if (o.kisi !== 0) { s += `<g opacity="${f2(0.18 * (o.kisi ?? 1))}">`; for (let x = -900; x <= 1980; x += 60) s += `<rect x="${x}" y="-900" width="2" height="3720" fill="#6E8FA8"/>`; for (let y = -900; y <= 2820; y += 60) s += `<rect x="-900" y="${y}" width="2880" height="2" fill="#6E8FA8"/>`; s += `</g>`; }
    return s;
  }

  // ---------- penampang rem (wajah cakram) ----------
  function penampangRem(t, o = {}) {
    const tu = cl(o.tuas || 0), pn = cl(o.panas || 0), ge = cl(o.gelembung || 0), em = cl(o.empuk || 0), so = o.sorot || {};
    const putar = o.putar || 0, gaya = o.gaya ?? 0;
    let s = o.latar === false ? "" : latarBengkel(t, o);
    // --- cakram
    const cx = 690, cy = 1330, R = 280, warmA = pn * 0.75, warna = mix(BAJA, HANGAT, warmA * 0.85);
    let lubang = ""; for (let i = 0; i < 12; i++) { const a = (i * 30 + putar) * Math.PI / 180; lubang += `<circle cx="${f1(cx + Math.cos(a) * 230)}" cy="${f1(cy + Math.sin(a) * 230)}" r="15" fill="${mix(GELAP, "#7A4A2A", warmA * 0.5)}"/>`;
      const b = (i * 30 + 15 + putar) * Math.PI / 180; lubang += `<path d="M${f1(cx + Math.cos(b) * 120)} ${f1(cy + Math.sin(b) * 120)} L${f1(cx + Math.cos(b + 0.25) * 190)} ${f1(cy + Math.sin(b + 0.25) * 190)}" stroke="${mix(BAJA2, "#C07040", warmA * 0.5)}" stroke-width="18" stroke-linecap="round"/>`; }
    s += `<ellipse cx="${cx}" cy="${cy + R + 20}" rx="${R}" ry="30" fill="#000" opacity=".13"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="${warna}"/><circle cx="${cx}" cy="${cy}" r="${R - 14}" fill="${mix(BAJA3, "#FFB870", warmA * 0.8)}" opacity=".55"/>${lubang}
      <circle cx="${cx}" cy="${cy}" r="100" fill="${GELAP}"/><circle cx="${cx}" cy="${cy}" r="62" fill="#6B747E"/>`;
    for (let i = 0; i < 5; i++) { const a = (i * 72 + putar) * Math.PI / 180; s += `<circle cx="${f1(cx + Math.cos(a) * 80)}" cy="${f1(cy + Math.sin(a) * 80)}" r="10" fill="${BAJA3}"/>`; }
    if (pn > 0) s += `<circle cx="${cx}" cy="${cy}" r="${R + 30}" fill="none" stroke="${HANGAT}" stroke-width="40" opacity="${f2(pn * 0.22)}"/>` + gelombangPanas(cx, cy - R - 10, 1.1, t, pn, 4);
    // --- kaliper (di tepi kiri cakram) — tembus pandang: piston BESAR (lingkaran) + kampas
    const kx = 410, ky = 1330, sp = so.piston ? 0.5 + 0.5 * Math.sin(t * 8) : 0;
    s += `<rect x="${kx - 120}" y="${ky - 175}" width="220" height="350" rx="60" fill="#6E7883" opacity=".72"/><rect x="${kx - 104}" y="${ky - 160}" width="188" height="320" rx="48" fill="#E9EEF2" opacity=".35"/>
      <path d="M${kx + 60} ${ky - 150} A ${R} ${R} 0 0 0 ${kx + 60} ${ky + 150}" stroke="${KAMPAS}" stroke-width="40" fill="none" opacity=".9"/>
      <circle cx="${kx - 10}" cy="${ky}" r="96" fill="${AMBER}" opacity=".9"/><circle cx="${kx - 10}" cy="${ky}" r="76" fill="${mix(BAJA3, HANGAT, pn * 0.25)}"/><circle cx="${kx - 10}" cy="${ky}" r="54" fill="none" stroke="${BAJA2}" stroke-width="10"/>`;
    if (sp > 0 || so.piston) s += `<circle cx="${kx - 10}" cy="${ky}" r="${f1(112 + sp * 10)}" fill="none" stroke="#FFE27A" stroke-width="12" opacity="${f2(0.5 + 0.5 * sp)}"/>`;
    if (gaya > 0) { const L = 40 + 120 * gaya, w = 14 + 26 * gaya, x0 = kx - 150 - L - w * 1.3; s += `<path d="M${f1(x0)} ${ky} l${f1(L)} 0" stroke="#E2232E" stroke-width="${f1(w)}" stroke-linecap="round"/><path d="M${f1(x0 + L + w * 1.3)} ${ky} l${f1(-w * 1.8)} ${f1(-w * 1.3)} l0 ${f1(w * 2.6)}Z" fill="#E2232E"/>`; }
    // --- selang (bening berisi cairan amber)
    const ca = mix(AMBER, AMBERT, pn * 0.5 + (o.cairanHangat || 0) * 0.5);
    const ss = so.selang ? 0.5 + 0.5 * Math.sin(t * 8) : 0;
    s += `<path d="${D_SELANG}" stroke="#E8F3FA" stroke-width="60" fill="none" opacity=".75" stroke-linecap="round"/><path d="${D_SELANG}" stroke="${ca}" stroke-width="38" fill="none" stroke-linecap="round"/><path d="${D_SELANG}" stroke="${AMBER2}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7" transform="translate(-6 -6)"/>`;
    if (so.selang) s += `<path d="${D_SELANG}" stroke="#FFE27A" stroke-width="84" fill="none" stroke-linecap="round" opacity="${f2(0.25 + 0.25 * ss)}"/>`;
    s += titikAir(t, cl(o.air || 0), ge);
    if (o.gelombang != null && o.gelombang >= 0) s += panahTekanan(o.gelombang, t, o.gelA ?? 1);
    // --- setang, master silinder, tabung minyak, tuas
    const goy = em * Math.sin(t * 9) * 4;
    const sudut = -tu * (11 + em * 9) + goy; // tuas berputar mendekati grip
    const push = tu * (1 + em * 0.8);
    s += `<rect x="20" y="512" width="720" height="36" rx="18" fill="${BAJA2}"/><rect x="60" y="490" width="360" height="80" rx="34" fill="#3E4650"/>`;
    for (let i = 0; i < 9; i++) s += `<rect x="${86 + i * 36}" y="496" width="12" height="68" rx="6" fill="#323940"/>`;
    s += `<rect x="470" y="380" width="140" height="100" rx="16" fill="#E8F3FA" opacity=".7"/><rect x="478" y="${f1(420 - (o.levelTabung ?? 0.6) * 30)}" width="124" height="${f1(52 + (o.levelTabung ?? 0.6) * 30)}" rx="10" fill="${ca}" opacity=".9"/><rect x="460" y="366" width="160" height="22" rx="8" fill="${GELAP}"/>`;
    s += `<rect x="430" y="470" width="220" height="130" rx="30" fill="#DDE6EE" opacity=".6"/><rect x="452" y="503" width="176" height="54" rx="10" fill="${ca}"/>
      <rect x="${f1(456 + push * 44)}" y="499" width="40" height="62" rx="8" fill="${BAJA3}" stroke="${BAJA2}" stroke-width="5"/><rect x="${f1(400 + push * 44)}" y="522" width="${60}" height="16" rx="8" fill="${BAJA2}"/>`;
    // tuas (pivot 640,610)
    const lJ = so.jari ? 0.5 + 0.5 * Math.sin(t * 8) : 0;
    s += `<g transform="rotate(${f2(sudut)} 640 610)"><path d="M640 610 Q470 640 120 650" stroke="#A9B3BD" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M630 600 Q470 628 130 638" stroke="${BAJA3}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="640" cy="610" r="26" fill="${GELAP}"/><circle cx="640" cy="610" r="10" fill="${BAJA3}"/>`;
    if (o.jari) s += jariTuas(250, 650, 1, lJ);
    s += `</g>`;
    if (em > 0) s += `<path d="M150 700 q30 20 60 0 q30 -20 60 0 q30 20 60 0" stroke="#FFFFFF" stroke-width="8" fill="none" stroke-linecap="round" opacity="${f2(em * 0.8)}"/>`;
    return s;
  }
  function jariTuas(x, y, s, sorot = 0) { // satu jari telunjuk menarik tuas (bagian tangan bersarung tampak dari atas grip)
    return g(x, y, s, `${sorot > 0 ? `<circle cx="0" cy="0" r="${f1(70 + sorot * 10)}" fill="#FFE27A" opacity="${f2(0.25 + 0.3 * sorot)}"/>` : ""}<path d="M-80 -150 Q-70 -60 -40 -10 Q-20 26 20 26 Q52 24 50 -6 Q46 -40 10 -50 Q-20 -90 -10 -150Z" fill="#2E3640"/><rect x="-60" y="6" width="150" height="40" rx="20" fill="#2E3640"/><circle cx="84" cy="26" r="20" fill="#3B4550"/>`);
  }

  // ---------- makro kaliper (diagram belah tampak tepi) ----------
  function makroKaliper(t, o = {}) {
    const tk = cl(o.tekan || 0), pn = cl(o.panas || 0), gaya = o.gaya ?? 0, ge = cl(o.gelembung || 0), em = cl(o.empuk || 0);
    const id = uid("mk");
    let s = o.latar === false ? "" : `<defs><radialGradient id="${id}" cx=".5" cy=".5" r=".8"><stop offset="0" stop-color="#3C4855"/><stop offset="1" stop-color="#1F262E"/></radialGradient></defs><rect x="-900" y="-900" width="2880" height="3720" fill="#1F262E"/><rect x="-300" y="-300" width="1680" height="2520" fill="url(#${id})"/>` + (() => { let k = `<g opacity=".12">`; for (let x = -900; x <= 1980; x += 60) k += `<rect x="${x}" y="-900" width="2" height="3720" fill="#9FC4E0"/>`; for (let y = -900; y <= 2820; y += 60) k += `<rect x="-900" y="${y}" width="2880" height="2" fill="#9FC4E0"/>`; return k + `</g>`; })();
    const ca = mix(AMBER, AMBERT, pn * 0.5);
    // silinder kecil (vertikal) x 150..290, y 780..1110; piston kecil turun 60*tk
    const pk = 800 + tk * 70;
    s += `<rect x="140" y="760" width="160" height="360" rx="20" fill="#DDE6EE" opacity=".55"/><rect x="160" y="${f1(pk + 34)}" width="120" height="${f1(1100 - pk - 34)}" fill="${ca}"/>
      <rect x="156" y="${f1(pk)}" width="128" height="40" rx="8" fill="${BAJA3}" stroke="${BAJA2}" stroke-width="5"/><rect x="210" y="${f1(pk - 120)}" width="20" height="124" fill="${BAJA2}"/>`;
    // tuas panjang: pivot (110, 640), ujung kanan jauh; tekan → berputar turun
    const sud = (o.tuasSudut ?? tk * 16);
    s += `<g transform="rotate(${f2(sud)} 120 660)"><path d="M120 660 L880 660" stroke="#A9B3BD" stroke-width="34" stroke-linecap="round"/><circle cx="120" cy="660" r="26" fill="${GELAP}"/><circle cx="880" cy="660" r="30" fill="#C8CFD6"/></g>`;
    // pipa ke silinder besar
    s += `<path d="M220 1100 L220 1260 Q220 1300 260 1300 L520 1300" stroke="#E8F3FA" stroke-width="64" fill="none" opacity=".7"/><path d="M220 1100 L220 1260 Q220 1300 260 1300 L520 1300" stroke="${ca}" stroke-width="42" fill="none"/>`;
    // silinder besar horizontal x 500..760, y 1120..1480; piston besar geser 10*tk
    const pb = 700 + tk * 12;
    s += `<rect x="480" y="1110" width="300" height="380" rx="26" fill="#DDE6EE" opacity=".55"/><rect x="500" y="1130" width="${f1(pb - 500)}" height="340" fill="${ca}"/>
      <rect x="${f1(pb)}" y="1126" width="56" height="348" rx="10" fill="${mix(BAJA3, HANGAT, pn * 0.2)}" stroke="${BAJA2}" stroke-width="6"/>
      <rect x="${f1(pb + 56)}" y="1170" width="34" height="260" rx="8" fill="${KAMPAS}"/>`;
    // cakram (tepi) x 850..900 — garis gerak berputar ke bawah
    const dx = pb + 90 + 2;
    const off = ((o.putar || 0) % 80 + 80) % 80;
    const dw = mix(BAJA, HANGAT, pn * 0.45);
    s += `<rect x="${f1(dx)}" y="900" width="56" height="820" rx="10" fill="${dw}"/>`;
    for (let y = 900 - 80 + off; y < 1690; y += 80) if (y > 902) s += `<rect x="${f1(dx + 8)}" y="${f1(y)}" width="40" height="26" rx="6" fill="${mix(BAJA2, "#C07040", pn * 0.4)}" opacity=".7"/>`;
    // kampas kanan (diam) + badan kaliper C
    s += `<rect x="${f1(dx + 58)}" y="1170" width="34" height="260" rx="8" fill="${KAMPAS}"/><path d="M${f1(dx + 92)} 1120 L1010 1120 L1010 1480 L${f1(dx + 92)} 1480" stroke="#6E7883" stroke-width="30" fill="none" opacity=".9"/>`;
    if (pn > 0) s += gelombangPanas(dx + 28, 900, 1, t, pn, 3);
    // gelembung / titik air di cairan
    if (ge > 0) { const r = acak(5); for (let i = 0; i < 14; i++) { const x = 520 + r() * (pb - 530), y = 1150 + r() * 300; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1((8 + r() * 14) * ge * (1 - tk * 0.5))}" fill="#FFFFFF" opacity=".9" stroke="#C9E6F7" stroke-width="2"/>`; } }
    // chevron tekanan berukuran sama di pipa
    if (o.gelombang != null && o.gelombang >= 0) { const titik = (u) => u < 0.5 ? [220, 1100 + u / 0.5 * 190, 90] : [230 + (u - 0.5) / 0.5 * 280, 1300, 0];
      for (let i = 0; i < 6; i++) { const u = o.gelombang - i * 0.12; if (u < 0 || u > 1) continue; const [x, y, r] = titik(u); s += g(x, y, 1, `<path d="M-10 -16 L8 0 L-10 16" stroke="#FFFFFF" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, r); } }
    // panah gaya: kecil di piston kecil, besar di piston besar
    const pk1 = cl(o.panahKecil || 0);
    if (pk1 > 0) s += `<g opacity="${f2(pk1)}"><path d="M330 ${f1(pk - 120)} l0 110" stroke="#FF6A5A" stroke-width="12" stroke-linecap="round"/><path d="M314 ${f1(pk - 18)} l16 24 l16 -24Z" fill="#FF6A5A"/></g>`;
    if (gaya > 0) { const L = 40 + 70 * gaya, w = 12 + 36 * gaya, y = 1300; s += `<path d="M${f1(pb + 10)} ${y} l${f1(-L)} 0" stroke="#E2232E" stroke-width="0"/><g transform="translate(${f1(dx - 230)} ${y - 360})"><path d="M0 0 l${f1(L)} 0" stroke="#E2232E" stroke-width="${f1(w)}" stroke-linecap="round"/><path d="M${f1(L + w * 1.3)} 0 l${f1(-w * 1.8)} ${f1(-w * 1.3)} l0 ${f1(w * 2.6)}Z" fill="#E2232E"/></g>`; }
    // lintasan (B5): busur titik-titik panjang di ujung tuas vs garis titik pendek di kampas
    const li = cl(o.lintasan || 0);
    if (li > 0) { const R = 760, a1 = 0, a2 = 16 * Math.PI / 180; let d = ""; for (let i = 0; i <= 16; i++) { const a = a1 + (a2 - a1) * i / 16 * li; d += (i ? "L" : "M") + f1(120 + Math.cos(a) * R) + " " + f1(660 + Math.sin(a) * R); }
      s += `<path d="${d}" stroke="#FFE27A" stroke-width="16" fill="none" stroke-dasharray="4 26" stroke-linecap="round"/><path d="M${f1(700 + 56)} 1510 l${f1(14 * li)} 0" stroke="#FFE27A" stroke-width="16" stroke-dasharray="2 10" stroke-linecap="round"/>`; }
    return s;
  }

  // ---------- motor matik generik (tampak samping, depan di kanan) ----------
  function roda(x, y, r, putar, o = {}) {
    let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="#2B3036"/><circle cx="${x}" cy="${y}" r="${f1(r * 0.62)}" fill="#9AA3AC"/><circle cx="${x}" cy="${y}" r="${f1(r * 0.2)}" fill="#4A525C"/>`;
    for (let i = 0; i < 5; i++) { const a = (i * 72 + putar) * Math.PI / 180; s += `<path d="M${x} ${y} L${f1(x + Math.cos(a) * r * 0.6)} ${f1(y + Math.sin(a) * r * 0.6)}" stroke="#6B747E" stroke-width="${f1(r * 0.14)}" stroke-linecap="round"/>`; }
    if (o.cakram) s += `<circle cx="${x}" cy="${y}" r="${f1(r * 0.5)}" fill="none" stroke="${mix("#C9D0D6", HANGAT, o.panas || 0)}" stroke-width="${f1(r * 0.1)}" opacity=".95"/>`;
    return s;
  }
  function pengendara(x, y, s, o = {}) { // orang generik tanpa wajah rinci: helm + visor, jaket
    const jk = o.jaket || "#C8553D", hl = o.helm || "#F4EEE2";
    return g(x, y, s, `<path d="M-30 0 L-40 -150 Q-38 -190 0 -196 Q40 -190 44 -150 L40 0Z" fill="${jk}"/><path d="M30 -150 Q120 -130 ${o.tanganX ?? 150} ${o.tanganY ?? -120}" stroke="${jk}" stroke-width="34" fill="none" stroke-linecap="round"/>
      <circle cx="${o.tanganX ?? 150}" cy="${o.tanganY ?? -120}" r="18" fill="#2E3640"/><circle cx="0" cy="-236" r="56" fill="${hl}"/><path d="M14 -262 Q60 -256 58 -222 L18 -218Z" fill="#3E5878" opacity=".85"/><rect x="-60" y="-196" width="116" height="16" rx="8" fill="${hl}" opacity=".6"/>
      <path d="M-30 -10 L60 -10 L80 90" stroke="#3C4552" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  function motorMatic(x, y, s, t = 0, o = {}) {
    const rd = o.roda || 0, tb = cl(o.tembus || 0), bw = o.warna || "#2F7F86", bw2 = mix(bw, "#000000", 0.25);
    let b = `<ellipse cx="0" cy="6" rx="380" ry="26" fill="#000" opacity=".2"/>`;
    b += roda(-250, -96, 96, rd) + roda(250, -96, 96, rd, { cakram: 1, panas: o.panas || 0 });
    // badan
    b += `<path d="M-330 -150 Q-340 -300 -200 -320 L-40 -330 Q20 -330 40 -270 L60 -170 L190 -170 Q230 -170 240 -230 L210 -430 L250 -440 L300 -220 Q300 -150 240 -120 L-230 -120 Q-320 -120 -330 -150Z" fill="${bw}" opacity="${f2(1 - tb * 0.55)}"/>
      <path d="M-300 -330 Q-200 -370 -20 -350 L-30 -320 L-280 -310Z" fill="#2A2F35" opacity="${f2(1 - tb * 0.4)}"/><path d="M60 -175 L200 -175 L190 -150 L70 -150Z" fill="${bw2}" opacity="${f2(1 - tb * 0.5)}"/>
      <path d="M230 -440 L300 -470 Q330 -470 320 -440 L280 -380Z" fill="${bw2}"/><ellipse cx="318" cy="-400" rx="24" ry="34" fill="#FFF4D0"/>
      <path d="M260 -110 L240 -330" stroke="#6B747E" stroke-width="20" stroke-linecap="round"/><path d="M-250 -96 L-120 -160" stroke="#4A525C" stroke-width="24" stroke-linecap="round"/>`;
    // setang + tuas di kanan atas (pivot 250,-470)
    const tr = cl(o.tarik || 0);
    b += `<path d="M190 -480 L300 -470" stroke="#4A525C" stroke-width="22" stroke-linecap="round"/><rect x="150" y="-494" width="70" height="28" rx="12" fill="#2A2F35"/>
      <g transform="rotate(${f2(-tr * 10)} 236 -470)"><path d="M236 -470 L150 -452" stroke="#A9B3BD" stroke-width="12" stroke-linecap="round"/></g>`;
    // selang rem bercahaya (x-ray) dari setang ke cakram depan
    if (tb > 0 || o.sorotSelang) { const a = Math.max(tb, o.sorotSelang || 0), gl = 0.6 + 0.4 * Math.sin(t * 6);
      b += `<path d="M240 -470 Q300 -380 262 -300 Q240 -200 250 -120 L262 -110" stroke="${AMBER}" stroke-width="16" fill="none" stroke-linecap="round" opacity="${f2(a)}"/><path d="M240 -470 Q300 -380 262 -300 Q240 -200 250 -120" stroke="#FFE27A" stroke-width="40" fill="none" stroke-linecap="round" opacity="${f2(a * 0.25 * gl)}"/><rect x="222" y="-130" width="40" height="56" rx="12" fill="${AMBER}" opacity="${f2(a)}"/>`; }
    // pengendara & penumpang
    if (o.penumpang !== false) b += pengendara(-230, -330, 0.9, { jaket: "#6E5AA8", helm: "#FFC93C", tanganX: 160, tanganY: -150 });
    if (o.pengendara !== false) b += pengendara(-60, -330, 1, { jaket: "#C8553D", helm: "#F4EEE2", tanganX: 210, tanganY: -150 });
    return g(x, y, s * (o.arah === -1 ? -1 : 1) , b).replace(`scale(${f2(s * (o.arah === -1 ? -1 : 1))})`, `scale(${f2(o.arah === -1 ? -s : s)} ${f2(s)})`);
  }
  function tanganMotor(x, y, s, o = {}) { // medium shot dari samping: grip setang, kepalan sarung tangan, SATU jari telunjuk di tuas (tuas & jari berputar bersama)
    const tr = cl(o.tarik || 0), sr = o.sorot || 0, rot = -tr * 12;
    const SR = "#3A4450", SR2 = "#56616E";
    return g(x, y, s, `<rect x="-460" y="-36" width="980" height="72" rx="36" fill="#8D97A2"/><rect x="-200" y="-56" width="420" height="112" rx="50" fill="#2A2F35"/>
      <path d="M-520 -260 Q-360 -150 -230 -70" stroke="#C8553D" stroke-width="150" fill="none" stroke-linecap="round"/>
      <path d="M-250 -120 Q-60 -170 140 -110 Q210 -80 200 -10 Q190 50 120 60 L-200 60 Q-280 40 -270 -40Z" fill="${SR}"/>
      ${[0, 1, 2].map((i) => `<rect x="${-150 + i * 95}" y="-20" width="86" height="96" rx="40" fill="${SR}"/><rect x="${-140 + i * 95}" y="-8" width="66" height="20" rx="10" fill="${SR2}"/>`).join("")}
      <g transform="rotate(${f2(rot)} 360 40)">
        <path d="M360 40 Q160 120 -240 150" stroke="#C9D0D6" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M350 30 Q160 106 -230 136" stroke="#EEF2F5" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="360" cy="40" r="30" fill="#4A525C"/>
        ${sr > 0 ? `<circle cx="150" cy="150" r="${f1(80 + sr * 10)}" fill="#FFE27A" opacity="${f2(0.4 * sr)}"/>` : ""}
        <path d="M150 -40 Q240 40 200 120 Q170 170 110 150" stroke="${SR}" stroke-width="58" fill="none" stroke-linecap="round"/><path d="M186 30 Q214 80 196 110" stroke="${SR2}" stroke-width="12" fill="none" stroke-linecap="round"/>
      </g>`);
  }
  function simpangLampuMerah(w, h, P, t = 0, o = {}) {
    const jy = o.jalan ?? 1400, lp = o.lampu ?? 1, hj = o.hujan || 0;
    let s = A.langit(P, w, jy - 300, t, { suryaX: w * 0.8, suryaY: 330 });
    if (hj > 0) s += `<rect width="${w}" height="${jy}" fill="#8A97A4" opacity="${f2(hj * 0.7)}"/>`;
    // deret ruko generik tanpa tulisan
    const r = acak(19); let x = -40;
    const warna = ["#E9DFCB", "#D7E3E6", "#F1D9B5", "#DCD3E6", "#E6E1D3"];
    while (x < w) { const bw = 230 + r() * 120, bh = 520 + r() * 320, c = warna[Math.floor(r() * warna.length)];
      s += `<rect x="${f1(x)}" y="${f1(jy - 140 - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="${hj ? mix(c, "#8A97A4", 0.35) : c}"/><rect x="${f1(x)}" y="${f1(jy - 140 - bh)}" width="${f1(bw)}" height="22" fill="${P.atap}"/>`;
      for (let yy = jy - 140 - bh + 70; yy < jy - 340; yy += 150) for (let xx = x + 30; xx < x + bw - 70; xx += 90) s += `<rect x="${f1(xx)}" y="${f1(yy)}" width="56" height="80" rx="6" fill="${P.jendela}" opacity=".85"/>`;
      s += `<rect x="${f1(x + 20)}" y="${f1(jy - 330)}" width="${f1(bw - 40)}" height="190" fill="${hj ? "#5E6A76" : "#7E8A96"}" opacity=".6"/><path d="M${f1(x + 10)} ${f1(jy - 340)} L${f1(x + bw - 10)} ${f1(jy - 340)} L${f1(x + bw + 10)} ${f1(jy - 300)} L${f1(x - 10)} ${f1(jy - 300)}Z" fill="${["#C8553D", "#1F8A8A", "#E0A33A"][Math.floor(r() * 3)]}" opacity=".85"/>`;
      x += bw + 10; }
    // trotoar + jalan + marka + zebra
    s += `<rect x="0" y="${jy - 140}" width="${w}" height="70" fill="${hj ? "#9AA2A8" : "#C9C3B6"}"/><rect x="0" y="${jy - 76}" width="${w}" height="16" fill="#8A847A"/><rect x="0" y="${jy - 60}" width="${w}" height="${h - jy + 60}" fill="${hj ? "#3E464E" : "#5A6068"}"/>`;
    for (let xx = 0; xx < w; xx += 220) s += `<rect x="${xx}" y="${jy + 150}" width="120" height="16" rx="8" fill="#E8E4D8" opacity=".8"/>`;
    const zx = o.zebraX ?? w * 0.78;
    for (let i = 0; i < 6; i++) s += `<path d="M${f1(zx + i * 60)} ${jy - 40} l50 0 l60 ${h - jy + 40} l-50 0Z" fill="#EDE9DD" opacity=".85"/>`;
    s += `<rect x="${f1(zx - 30)}" y="${jy - 40}" width="14" height="${h - jy + 40}" fill="#EDE9DD"/>`;
    if (hj > 0) s += `<g opacity="${f2(hj * 0.5)}">` + [0.2, 0.45, 0.7].map((k) => `<ellipse cx="${f1(w * k)}" cy="${jy + 260}" rx="160" ry="20" fill="#8FB4CC"/>`).join("") + `</g>`;
    // tiang lampu lalu lintas
    const tx = o.tiangX ?? w * 0.74;
    s += `<rect x="${f1(tx - 12)}" y="${jy - 760}" width="24" height="640" fill="#3E464E"/><rect x="${f1(tx - 12)}" y="${jy - 760}" width="200" height="22" fill="#3E464E"/><rect x="${f1(tx + 120)}" y="${jy - 780}" width="96" height="260" rx="18" fill="#2A2F35"/>
      <circle cx="${f1(tx + 168)}" cy="${jy - 730}" r="32" fill="${lp > 0.5 ? "#FF3B30" : "#5A2A2A"}"/>${lp > 0.5 ? `<circle cx="${f1(tx + 168)}" cy="${jy - 730}" r="70" fill="#FF3B30" opacity=".22"/>` : ""}<circle cx="${f1(tx + 168)}" cy="${jy - 650}" r="32" fill="#5A4A2A"/><circle cx="${f1(tx + 168)}" cy="${jy - 570}" r="32" fill="${lp > 0.5 ? "#2A4A34" : "#3FD46A"}"/>`;
    if (hj > 0) s += A.gerimis ? A.gerimis(w, h, t, P, {}) : "";
    return s;
  }

  // ---------- gag ----------
  function gumpalCairan(x, y, s, t = 0, o = {}) { const su = cl(o.susut || 0), ge = cl(o.gelembung || 0);
    let b = `<ellipse cx="0" cy="0" rx="${f1(120 * (1 - su * 0.55))}" ry="${f1(95 * (1 - su * 0.3))}" fill="${AMBER}"/><ellipse cx="-30" cy="-34" rx="${f1(40 * (1 - su * 0.5))}" ry="16" fill="${AMBER2}" opacity=".8"/>`;
    if (ge > 0) { const r = acak(9); for (let i = 0; i < 7; i++) { const bx = (r() - 0.5) * 160 * (1 - su * 0.5), by = (r() - 0.5) * 110, rr = (12 + r() * 14) * (1 - su * 0.6); b += `<ellipse cx="${f1(bx)}" cy="${f1(by)}" rx="${f1(rr * (1 + su * 0.6))}" ry="${f1(rr * (1 - su * 0.55))}" fill="#FFFFFF" opacity="${f2(ge)}" stroke="#C9E6F7" stroke-width="2"/>`; } }
    return g(x, y, s, b); }
  function tanganRaksasa(x, y, s, t = 0, o = {}) { // tangan kartun menggenggam dari kiri: ibu jari di atas, jari di bawah; celah = (1-remas)
    const rm = cl(o.remas || 0), ge = o.gemetar ? Math.sin(t * 40) * 3 * o.gemetar : 0, gap = lerp(150, o.celahMin ?? 96, rm);
    const kul = KULIT, kulB = "#E3AE84";
    return g(x + ge, y, s, `<rect x="-420" y="-90" width="260" height="180" rx="80" fill="#2F7F86"/><path d="M-200 -110 Q-120 -150 -60 -110 L-40 110 Q-120 150 -200 110Z" fill="${kul}"/>
      <path d="M-80 ${f1(-gap)} Q40 ${f1(-gap - 40)} 120 ${f1(-gap + 6)}" stroke="${kul}" stroke-width="64" fill="none" stroke-linecap="round"/>
      ${[0, 1, 2].map((i) => `<path d="M-80 ${f1(gap - 20 + i * 36)} Q50 ${f1(gap + 20 + i * 36)} 130 ${f1(gap - 14 + i * 30)}" stroke="${i % 2 ? kulB : kul}" stroke-width="44" fill="none" stroke-linecap="round"/>`).join("")}
      ${o.keringat ? A.tetesKeringat ? A.tetesKeringat(-120, -200, 0.9, o.keringat) + A.tetesKeringat(150, -170, 0.7, o.keringat) : "" : ""}`); }
  function tongkatCair(x, y, s, t = 0, o = {}) { // gelas dimiringkan, cairan amber keluar sebagai TONGKAT kaku; lentur → melentur seperti mie
    const tg = cl(o.tuang || 0), le = cl(o.lentur || 0), cp = cl(o.cipratan || 0);
    const rot = -70 * Math.min(1, tg * 1.6), keluar = cl((tg - 0.3) / 0.5);
    let b = g(0, 0, 1, `<path d="M-70 -110 L70 -110 L56 110 L-56 110Z" fill="#E6F4F8" opacity=".85" stroke="#9FB6C8" stroke-width="8"/><rect x="-60" y="${f1(-20 + keluar * 80)}" width="120" height="${f1(126 - keluar * 80)}" fill="${AMBER}" opacity=".9"/><path d="M-70 -110 L70 -110" stroke="#FFFFFF" stroke-width="8" opacity=".8"/>`, rot);
    if (keluar > 0) { const L = 380 * keluar; let d = `M-100 -40`; for (let i = 1; i <= 10; i++) { const u = i / 10; d += ` L${f1(-100 - u * L * 0.15 + Math.sin(u * 7 + t * 4) * 40 * le * u)} ${f1(-40 + u * L)}`; }
      b += `<path d="${d}" stroke="${AMBERT}" stroke-width="84" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${AMBER}" stroke-width="66" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${AMBER2}" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7" transform="translate(-10 0)"/>`; }
    if (cp > 0) { for (let i = 0; i < 8; i++) { const a = Math.PI + i * Math.PI / 7; b += `<circle cx="${f1(-160 + Math.cos(a) * 120 * cp)}" cy="${f1(360 + Math.sin(a) * 70 * cp)}" r="${f1(16 * (1 - cp * 0.5))}" fill="${AMBER}" opacity="${f2(1 - cp * 0.6)}"/>`; } b += `<ellipse cx="-160" cy="370" rx="${f1(60 + 90 * cp)}" ry="18" fill="${AMBER}" opacity=".8"/>`; }
    return g(x, y, s, b); }
  function siGerak(x, y, s, t, o = {}) { // garis laju bermata (energi gerak); api = kostum api
    const api = cl(o.api || 0);
    let b = "";
    if (api < 1) b += `<g opacity="${f2(1 - api)}">${[0, 1, 2].map((i) => `<path d="M${-120 + i * 10} ${-50 + i * 50} L${60 + i * 20} ${-50 + i * 50}" stroke="#9FD8FF" stroke-width="22" stroke-linecap="round"/>`).join("")}</g>`;
    if (api > 0) b += `<g opacity="${f2(api)}" transform="scale(${f2(0.7 + 0.3 * api)})"><path d="M0 -150 Q60 -80 70 -10 Q80 80 0 100 Q-80 80 -70 -10 Q-60 -60 -20 -90 Q-10 -40 10 -50 Q20 -100 0 -150Z" fill="${HANGAT}"/><path d="M0 -60 Q40 -10 34 40 Q20 80 0 80 Q-20 80 -34 40 Q-30 0 0 -60Z" fill="#FFD27A"/></g>`;
    b += `<circle cx="70" cy="-30" r="20" fill="#FFF"/><circle cx="110" cy="-30" r="20" fill="#FFF"/><circle cx="76" cy="-28" r="9" fill="#1E1E1E"/><circle cx="116" cy="-28" r="9" fill="#1E1E1E"/>`;
    return g(x, y, s, b); }
  function bilikKostum(x, y, s, t, o = {}) { // fase 0..1: 0-.35 si Gerak meluncur masuk, .35-.6 di balik bilik (bilik goyang), .6-1 keluar berkostum api
    const f = cl(o.fase || 0), goy = (f > 0.35 && f < 0.62) ? Math.sin(t * 22) * 4 : 0;
    let b = "";
    const gx = f < 0.35 ? lerp(-520, -40, f / 0.35) : f < 0.6 ? -40 : lerp(-40, 300, (f - 0.6) / 0.4), api = f < 0.6 ? 0 : cl((f - 0.6) / 0.12);
    const di = f > 0.3 && f < 0.64;
    if (!di && f < 0.6) b += siGerak(gx, -40, 1, t, { api });
    b += g(goy, 0, 1, [-160, 0, 160].map((xx, i) => `<path d="M${xx - 76} -260 L${xx + 76} ${-260 + (i - 1) * 6} L${xx + 76} 160 L${xx - 76} ${160 + (i - 1) * 6}Z" fill="${["#C8A87A", "#D8BC8E", "#C8A87A"][i]}"/>`).join("") + `<rect x="-240" y="160" width="480" height="18" rx="9" fill="#8A6A4A"/>`);
    if (!di && f >= 0.6) b += siGerak(gx, -40, 1, t, { api });
    if (di && f > 0.4) b += `<path d="M-60 -300 q20 -40 40 0 q20 -40 40 0" stroke="#FFFFFF" stroke-width="8" fill="none" opacity=".7"/>`;
    return g(x, y, s, b); }
  function papanTulis(x, y, s, o = {}) { const k = cl(o.k ?? 1);
    return g(x, y, s * (0.7 + 0.3 * k), `<rect x="-300" y="-190" width="600" height="380" rx="18" fill="#7A5A3A"/><rect x="-276" y="-166" width="552" height="332" rx="8" fill="#2F4A3E"/>
      <path d="M-170 -110 L-170 90 Q-170 120 -140 120 L140 120 Q170 120 170 90 L170 -110" stroke="#F4F1E6" stroke-width="7" fill="none" opacity=".9" stroke-dasharray="${f1(900 * k)} 900"/>
      <path d="M-150 -110 L-150 90 L150 90 L150 -110" stroke="#F4F1E6" stroke-width="0" fill="none"/>
      <rect x="-196" y="-60" width="52" height="16" fill="#F4F1E6" opacity="${f2(k)}"/><rect x="100" y="-40" width="140" height="22" fill="#F4F1E6" opacity="${f2(k)}"/>
      <path d="M-170 -120 l0 -50 M-182 -136 l12 16 l12 -16" stroke="#F4F1E6" stroke-width="6" fill="none" opacity="${f2(k)}"/><path d="M170 -60 l0 -90 M150 -120 l20 -30 l20 30" stroke="#F4F1E6" stroke-width="12" fill="none" opacity="${f2(k)}"/>`).replace(`scale(${f2(s * (0.7 + 0.3 * k))})`, `scale(${f2(s * (0.7 + 0.3 * k))}) `).replace("<g ", `<g opacity="${f2(Math.min(1, k * 2))}" `); }
  function tabungMinyak(x, y, s, t = 0, o = {}) { // close-up tabung minyak rem bening di setang (tanpa tulisan); serap 0..1 = titik air di dalam
    const lv = o.level ?? 0.6, sr = cl(o.serap || 0);
    let b = `<rect x="-420" y="150" width="900" height="70" rx="35" fill="#8D97A2"/><rect x="-170" y="120" width="340" height="140" rx="40" fill="#DDE6EE" opacity=".6"/>
      <rect x="-170" y="-180" width="340" height="300" rx="34" fill="#E8F3FA" opacity=".75"/><rect x="-150" y="${f1(-160 + (1 - lv) * 260)}" width="300" height="${f1(lv * 260 + 10)}" rx="22" fill="${AMBER}" opacity=".92"/>
      <rect x="-140" y="${f1(-150 + (1 - lv) * 260)}" width="280" height="12" rx="6" fill="${AMBER2}"/><rect x="-196" y="-216" width="392" height="50" rx="16" fill="#4A525C"/><rect x="-60" y="-236" width="120" height="30" rx="10" fill="#6B747E"/>
      <path d="M-150 -40 l300 0 M-150 40 l300 0" stroke="#FFFFFF" stroke-width="5" opacity=".35"/>`;
    if (sr > 0) { const r = acak(23); for (let i = 0; i < 16; i++) { const bx = -130 + r() * 260, by = -150 + (1 - lv) * 260 + 30 + r() * (lv * 230); if (r() > sr) continue; b += `<circle cx="${f1(bx)}" cy="${f1(by + Math.sin(t * 2 + i) * 4)}" r="7" fill="#4FA8E8" opacity=".9"/>`; } }
    return g(x, y, s, b); }
  function tetesUdara(x0, y0, x1, y1, t, o = {}) { // tetes air kecil melayang pelan dari kabut ke titik tujuan, satu-satu
    const n = o.n || 6, k = cl(o.k ?? 1); if (k <= 0) return ""; let s = "";
    for (let i = 0; i < n; i++) { const u = ((t * (o.laju || 0.35)) + i / n) % 1, x = lerp(x0 + (i - n / 2) * 80, x1, u * u) + Math.sin(u * 8 + i) * 30 * (1 - u), y = lerp(y0 - (i % 3) * 60, y1, u);
      const z = o.uk || 1; s += `<path d="M${f1(x)} ${f1(y - 22 * z)} Q${f1(x + 16 * z)} ${f1(y)} ${f1(x)} ${f1(y + 12 * z)} Q${f1(x - 16 * z)} ${f1(y)} ${f1(x)} ${f1(y - 22 * z)}Z" fill="#6EC3E8" opacity="${f2(k * Math.min(1, u * 6) * (1 - Math.max(0, (u - 0.92) / 0.08)))}"/>`; }
    return s; }
  function jariKurus(x, y, s, t = 0) { // gag: jari kecil dengan "lengan mie" kurus yang pamer otot (wajah kecil, bukan Tebe)
    const f = Math.sin(t * 6) * 6;
    return g(x, y, s, `<path d="M0 0 Q-40 -80 -10 -150 Q10 -180 30 -150" stroke="${KULIT}" stroke-width="16" fill="none" stroke-linecap="round" transform="rotate(${f2(f)} 0 0)"/><circle cx="-12" cy="-140" r="16" fill="${KULIT}"/>
      <rect x="-24" y="-10" width="48" height="140" rx="24" fill="${KULIT}"/><rect x="-18" y="-6" width="36" height="34" rx="14" fill="#FBE3CF"/><circle cx="-8" cy="60" r="5" fill="#1E1E1E"/><circle cx="10" cy="60" r="5" fill="#1E1E1E"/><path d="M-8 80 q9 8 18 0" stroke="#1E1E1E" stroke-width="4" fill="none" stroke-linecap="round"/>`); }

  Object.assign(A, { penampangRem, titikSelang, panahTekanan, makroKaliper, motorMatic, tanganMotor, simpangLampuMerah, gumpalCairan, tanganRaksasa, tongkatCair, siGerak, bilikKostum, papanTulis, tabungMinyak, tetesUdara, jariKurus, latarBengkel, gelombangPanas, jariTuas, REM_WARNA: { BAJA, BAJA2, BAJA3, GELAP, AMBER, AMBER2, HANGAT, KAMPAS } });
})(typeof window !== "undefined" ? window : globalThis);
