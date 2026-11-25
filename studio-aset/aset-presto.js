/* ASET PANCI PRESTO & DAPUR MARUN (Yoga, 26 Nov 2026; dipakai A3-04 "Cara kerja panci presto: kenapa daging cepat empuk?"). Muat SETELAH aset-set.js.
 * Gaya: datar tanpa garis hitam di set; palet MERAH BATA / MARUN + KREM + PUTIH UAP (beda dari Tersentak jingga-koral, Sabun ungu-lemon).
 * Semua generik: presto TANPA merek/label/angka, angkot tanpa nomor trayek, penumpang tanpa wajah. Semua fungsi murni → potongan SVG (string).
 *  PRESTO                  — palet {BATA, BATAT, MARUN, MARUNT, MARUNG, KREM, KREM2, UAP, BAJA, BAJAT, BAJAG, GAGANG, AIR, AIRT, API, APIT, PANAH, DAGING, DAGINGM}
 *  DAPUR                   — geometri dunia dapur 2400x1920 {W, MEJA, TALENAN, PANCI (tungku kiri), PRESTO (tungku kanan), PIRING, KENOP}
 *  dapurPresto(t,{apiK, apiN, kenopK, kenopN, panci:{didih,uap,termo}, presto:{kunci,uap,katup,gerak}, daging:{...}|null, piring:{...}|null, garpu:{x,y,rot}|null})
 *        — dapur rumah: dinding krem, backsplash ubin merah bata, rak kayu + toples polos, meja + lemari marun, kompor gas 2 tungku, panci terbuka (kiri) + presto (kanan)
 *  kompor(x,y,s,t,{apiK, apiN 0..1.6 besar api, kenopK, kenopN (derajat)}) · apiBiru(x,y,s,t,k)
 *  presto(x,y,s,t,{kunci 0 (tutup belum pas)..1 (terkunci), uap 0..1, katup 0..1 (pemberat terangkat), gerak}) — (x,y) = dasar tengah
 *  panciTerbuka(x,y,s,t,{didih 0..1, uap 0..1, termo nilai|null, sorotGaris}) · termoTinggi(x,y,s,nilai 0..1,{garis 0..1, sorot, panjang, getar})
 *  daging(x,y,s,t,{matang 0..1, tekan 0..1, belah 0..1, kenyal}) · garpu(x,y,s,rot,{tembus}) · talenan(x,y,s) · piring(x,y,s)
 *  penampangPresto(t,{air, didih, uap, numpuk, panah, katup, semburan, termo, garis, sorot, daging, panas, apiK})
 *        — X-RAY presto memenuhi layar 1080x1920: dinding baja, tutup + katup, air, butir uap memantul di tutup, panah tekanan merah bata, termometer tinggi
 *  PEN                     — geometri penampang {L, R, ATAS (bawah tutup), AIR (permukaan), DASAR, KX/KY (katup), TX (termometer)}
 *  permukaanAir(t,{coba, tekan, lolos}) — close-up permukaan air: gelembung mencoba naik, ditekan panah, lalu 1 gelembung mendorong KUAT dan lolos
 *  angkotSesak(t,{dorong 0..1, lolos 0..1}) — interior angkot generik sesak, penumpang tanpa wajah, satu penumpang dekat pintu mendorong lalu "pop" keluar
 *  panahTekanan(x,y,len,rot,tebal,a) · butirUap(x,y,r,a) · gelombangPanas(x0,y0,x1,y1,t,k)
 *  ikonApi / ikonTekanan / ikonIga / ikonAyam / ikonBandeng (t) — isi kartu pilihan (tanpa huruf; pakai kartuPilihan dari aset-jari.js) */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  let _n = 0; const uid = (p) => `${p}P${++_n}`;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;
  const mix = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16)); const A1 = p(a), B1 = p(b); k = cl(k); return "#" + A1.map((v, i) => Math.round(v + (B1[i] - v) * k).toString(16).padStart(2, "0")).join(""); };

  const P = { BATA: "#B5452F", BATAT: "#C9614A", MARUN: "#6E1F2A", MARUNT: "#8A2E36", MARUNG: "#45121B", KREM: "#F4E6CC", KREM2: "#E6D0AC", UAP: "#FFFFFF",
    BAJA: "#C9CFD6", BAJAT: "#E4E8EC", BAJAG: "#8F99A4", GAGANG: "#3A2624", AIR: "#7CC6DE", AIRT: "#B9E6F2", API: "#4FA3F2", APIT: "#BFE4FF",
    PANAH: "#E8452C", DAGING: "#B8343A", DAGINGM: "#8E5234", KAYU: "#A8703F", KAYUT: "#C28A52" };
  const DAPUR = { W: 2400, MEJA: 1250, TALENAN: [430, 1250], PANCI: [1180, 1112], PRESTO: [1640, 1112], PIRING: [2060, 1250], KENOP: [[1180, 1206], [1640, 1206]] };

  // ---------- butir uap, panah, gelombang panas ----------
  function butirUap(x, y, r, a = 1) {
    if (a <= 0 || r <= 0) return "";
    return `<g opacity="${f2(a)}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${P.UAP}"/><circle cx="${f1(x - r * 0.32)}" cy="${f1(y - r * 0.32)}" r="${f1(r * 0.28)}" fill="#FFFFFF" opacity=".9"/><circle cx="${f1(x + r * 0.2)}" cy="${f1(y + r * 0.25)}" r="${f1(r * 0.62)}" fill="#EEF4F8" opacity=".55"/></g>`;
  }
  function panahTekanan(x, y, len, rot, tebal = 1, a = 1) {
    if (a <= 0 || len <= 4) return "";
    const w = 20 * tebal, h = 34 * tebal + 10;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})" opacity="${f2(a)}"><path d="M0 ${f1(-w / 2)} L${f1(len - h)} ${f1(-w / 2)} L${f1(len - h)} ${f1(-w / 2 - 14 * tebal)} L${f1(len)} 0 L${f1(len - h)} ${f1(w / 2 + 14 * tebal)} L${f1(len - h)} ${f1(w / 2)} L0 ${f1(w / 2)}Z" fill="${P.PANAH}" stroke="#FFF3E0" stroke-width="5" stroke-linejoin="round"/></g>`;
  }
  function gelombangPanas(x0, y0, x1, y1, t, k = 1) {
    if (k <= 0) return ""; let s = "";
    for (let i = 0; i < 4; i++) { const q = (t * 0.9 + i / 4) % 1, x = lerp(x0, x1, q), y = lerp(y0, y1, q);
      s += `<path d="M${f1(x - 40)} ${f1(y)} q20 -24 40 0 q20 24 40 0" stroke="#FFB27A" stroke-width="12" fill="none" stroke-linecap="round" opacity="${f2(k * Math.sin(Math.PI * q) * 0.9)}"/>`; }
    return s;
  }

  // ---------- api biru & kompor gas ----------
  function apiBiru(x, y, s, t, k = 1) {
    if (k <= 0.02) return "";
    let o = "";
    const n = 7;
    for (let i = 0; i < n; i++) { const dx = (i - (n - 1) / 2) * 26, hh = (46 + 12 * Math.sin(t * 13 + i * 1.7)) * k, ww = 15;
      o += `<path d="M${f1(dx - ww)} 0 Q${f1(dx - ww * 0.6)} ${f1(-hh * 0.6)} ${f1(dx + Math.sin(t * 9 + i) * 4)} ${f1(-hh)} Q${f1(dx + ww * 0.6)} ${f1(-hh * 0.6)} ${f1(dx + ww)} 0Z" fill="${P.API}" opacity=".92"/>`;
      o += `<path d="M${f1(dx - ww * 0.5)} 0 Q${f1(dx)} ${f1(-hh * 0.55)} ${f1(dx + ww * 0.5)} 0Z" fill="${P.APIT}"/>`; }
    const glow = `<ellipse cx="0" cy="-20" rx="${f1(130 * Math.min(1.4, k))}" ry="${f1(60 * k)}" fill="${P.API}" opacity="${f2(0.18 * Math.min(1, k))}"/>`;
    return g(x, y, s, glow + o);
  }
  function kenop(x, y, s, rot) {
    return g(x, y, s, `<circle cx="0" cy="0" r="30" fill="#2C2A2E"/><circle cx="0" cy="0" r="22" fill="#4A474E"/><g transform="rotate(${f1(rot)})"><rect x="-7" y="-28" width="14" height="40" rx="6" fill="#E4E8EC"/></g>`);
  }
  function kompor(x, y, s, t = 0, o = {}) {
    // (x,y) = tengah muka atas meja (dasar kompor); tungku di ±230
    let q = `<ellipse cx="0" cy="6" rx="520" ry="20" fill="#000" opacity=".2"/>`;
    q += `<path d="M-500 0 L-480 -120 L480 -120 L500 0Z" fill="#2E2B30"/><rect x="-500" y="-26" width="1000" height="26" fill="#1F1D22"/><path d="M-480 -120 L480 -120 L470 -110 L-470 -110Z" fill="#46424A"/>`;
    q += `<rect x="-470" y="-112" width="940" height="10" fill="#5A5660" opacity=".7"/>`;
    for (const bx of [-230, 230]) {
      q += `<ellipse cx="${bx}" cy="-118" rx="150" ry="18" fill="#1A181C"/><ellipse cx="${bx}" cy="-122" rx="70" ry="10" fill="#6A6670"/>`;
    }
    q += apiBiru(-230, -122, 1, t, o.apiK || 0) + apiBiru(230, -122, 1, t + 1.3, o.apiN || 0);
    for (const bx of [-230, 230]) q += `<rect x="${bx - 150}" y="-140" width="300" height="12" rx="6" fill="#3A373E"/><rect x="${bx - 8}" y="-150" width="16" height="30" fill="#3A373E"/><rect x="${bx - 150}" y="-150" width="14" height="30" fill="#3A373E"/><rect x="${bx + 136}" y="-150" width="14" height="30" fill="#3A373E"/>`;
    q += kenop(-230, -62, 1, o.kenopK || 0) + kenop(230, -62, 1, o.kenopN || 0);
    return g(x, y, s, q);
  }

  // ---------- termometer tinggi (tanpa angka; garis penanda tebal) ----------
  function termoTinggi(x, y, s, nilai, o = {}) {
    const H = o.panjang || 620, n = cl(nilai, 0, 1.08), isi = n * (H - 70), gr = o.garis ?? 0.62, gy = -50 - gr * (H - 70), sor = cl(o.sorot || 0);
    const gt = o.getar ? Math.sin(o.getar * 40) * 2.5 : 0;
    let q = `<g transform="translate(${f1(gt)} 0)">`;
    q += `<rect x="-38" y="${-H - 8}" width="76" height="${H + 8}" rx="38" fill="#000" opacity=".18" transform="translate(10 10)"/>`;
    q += `<rect x="-36" y="${-H}" width="72" height="${H}" rx="36" fill="#FBF6EE"/><circle cx="0" cy="0" r="58" fill="#FBF6EE"/>`;
    q += `<rect x="-15" y="${f1(-50 - isi)}" width="30" height="${f1(isi + 50)}" rx="15" fill="#D8232E"/><circle cx="0" cy="0" r="40" fill="#D8232E"/><circle cx="-12" cy="-12" r="11" fill="#FF8A8E" opacity=".7"/>`;
    for (let i = 0; i < 12; i++) { const yy = -80 - i * (H - 120) / 11; q += `<rect x="16" y="${f1(yy)}" width="${i % 2 ? 10 : 18}" height="5" rx="2" fill="#B8AFA2"/>`; }
    q += `<rect x="-26" y="${-H + 24}" width="10" height="${H - 90}" rx="5" fill="#FFFFFF" opacity=".75"/>`;
    // garis penanda (titik didih biasa) — tebal, menonjol ke kiri-kanan
    if (sor > 0) q += `<rect x="-90" y="${f1(gy - 14)}" width="180" height="28" rx="14" fill="#FFE3B0" opacity="${f2(0.55 * sor)}"/>`;
    q += `<rect x="-64" y="${f1(gy - 6)}" width="128" height="12" rx="6" fill="${o.garisWarna || "#2A1214"}"/>`;
    q += `</g>`;
    return g(x, y, s, q);
  }

  // ---------- daging, garpu, talenan, piring ----------
  function daging(x, y, s, t = 0, o = {}) {
    const m = cl(o.matang || 0), tk = cl(o.tekan || 0), bl = cl(o.belah || 0), kn = o.kenyal || 0;
    const warna = mix(P.DAGING, P.DAGINGM, m), gelap = mix("#8E222A", "#6A3A22", m), lemak = mix("#F7DCD4", "#E8C49A", m);
    const sx = 1 + 0.12 * tk + kn * 0.04 * Math.sin(t * 22), sy = 1 - 0.18 * tk - kn * 0.05 * Math.sin(t * 22);
    const potong = (dx, rot, sisi) => {
      let b = `<path d="M-150 -10 Q-160 -90 -80 -110 Q0 -128 80 -108 Q160 -92 150 -10 Q150 30 80 36 L-80 36 Q-150 30 -150 -10Z" fill="${warna}"/>`;
      b += `<path d="M-150 -10 Q-150 30 -80 36 L80 36 Q150 30 150 -10 Q130 10 80 14 L-80 14 Q-130 10 -150 -10Z" fill="${gelap}" opacity=".55"/>`;
      if (m < 0.95) b += `<path d="M-110 -70 Q-40 -40 20 -80 Q70 -100 120 -60" stroke="${lemak}" stroke-width="12" fill="none" stroke-linecap="round" opacity="${f2(1 - m * 0.6)}"/><path d="M-90 -20 Q-20 -2 60 -30" stroke="${lemak}" stroke-width="9" fill="none" stroke-linecap="round" opacity="${f2(1 - m * 0.6)}"/>`;
      if (m > 0.05) for (let i = 0; i < 5; i++) b += `<path d="M${-110 + i * 50} -96 Q${-100 + i * 50} -40 ${-112 + i * 50} 20" stroke="#5E2E18" stroke-width="5" fill="none" opacity="${f2(m * 0.45)}"/>`;
      b += `<path d="M-120 -82 Q-60 -108 10 -104" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round" opacity="${f2(0.28 + 0.15 * (1 - m))}"/>`;
      if (sisi) b = `<clipPath id="${sisi.id}"><rect x="${sisi.x}" y="-200" width="${sisi.w}" height="400"/></clipPath><g clip-path="url(#${sisi.id})">${b}</g>`;
      return `<g transform="translate(${f1(dx)} 0) rotate(${f1(rot)})">${b}</g>`;
    };
    let q = `<ellipse cx="0" cy="40" rx="${f1(160 * sx)}" ry="16" fill="#000" opacity=".2"/>`;
    if (bl <= 0) q += `<g transform="scale(${f2(sx)} ${f2(sy)}) translate(0 ${f1(36 * (1 - sy) / sy * 0)})">${potong(0, 0)}</g>`;
    else { const id1 = uid("dg"), id2 = uid("dg"); q += potong(-34 * bl, -10 * bl, { id: id1, x: -200, w: 200 }) + potong(34 * bl, 10 * bl, { id: id2, x: 0, w: 200 });
      q += `<path d="M${f1(-6 * bl)} -100 L${f1(6 * bl)} 30" stroke="#F0B890" stroke-width="${f1(10 * bl)}" opacity="${f2(bl)}"/>`; }
    return g(x, y, s, q);
  }
  function garpu(x, y, s, rot = 0, o = {}) {
    // ujung gigi garpu di (0,0), gagang ke atas
    let q = `<path d="M-30 0 L-30 -70 M-10 0 L-10 -70 M10 0 L10 -70 M30 0 L30 -70" stroke="${P.BAJA}" stroke-width="11" stroke-linecap="round"/>`;
    q += `<path d="M-36 -66 Q-36 -110 0 -116 Q36 -110 36 -66Z" fill="${P.BAJA}"/><path d="M-8 -112 L-14 -330 Q0 -346 14 -330 L8 -112Z" fill="${P.BAJA}"/><path d="M-4 -150 L-6 -320" stroke="#FFFFFF" stroke-width="5" opacity=".7"/>`;
    q += `<path d="M-30 -60 L-30 -20" stroke="#FFFFFF" stroke-width="4" opacity=".6"/>`;
    return g(x, y, s, q, rot);
  }
  function talenan(x, y, s) {
    return g(x, y, s, `<ellipse cx="0" cy="8" rx="300" ry="20" fill="#000" opacity=".18"/><rect x="-290" y="-36" width="580" height="44" rx="16" fill="${P.KAYU}"/><rect x="-290" y="-36" width="580" height="16" rx="8" fill="${P.KAYUT}"/><circle cx="250" cy="-14" r="10" fill="#7A4A26"/>`);
  }
  function piring(x, y, s) {
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="240" ry="22" fill="#000" opacity=".18"/><ellipse cx="0" cy="-10" rx="240" ry="40" fill="#F7F1E6"/><ellipse cx="0" cy="-16" rx="170" ry="26" fill="#EAE0D0"/>`);
  }

  // ---------- panci terbuka & presto ----------
  function uapNaik(x, y, s, t, k, n = 4, lebar = 120, tinggi = 420) {
    if (k <= 0) return ""; let o = "";
    for (let i = 0; i < n; i++) { const u = (t * 0.55 + i / n) % 1, xx = x + Math.sin(u * 5 + i * 2) * lebar * 0.4 + (i - (n - 1) / 2) * lebar / n;
      o += `<circle cx="${f1(xx)}" cy="${f1(y - u * tinggi * s)}" r="${f1((26 + u * 70) * s)}" fill="#FFFFFF" opacity="${f2(0.7 * k * Math.sin(Math.PI * u))}"/>`; }
    return o;
  }
  function panciTerbuka(x, y, s, t = 0, o = {}) {
    const dd = cl(o.didih || 0);
    let q = `<path d="M-210 -250 L210 -250 L196 -10 Q194 0 180 0 L-180 0 Q-194 0 -196 -10Z" fill="${P.BAJA}"/><path d="M110 -250 L210 -250 L196 -10 Q194 0 180 0 L100 0Z" fill="${P.BAJAG}" opacity=".55"/>`;
    q += `<rect x="-252" y="-226" width="50" height="22" rx="11" fill="${P.GAGANG}"/><rect x="202" y="-226" width="50" height="22" rx="11" fill="${P.GAGANG}"/>`;
    q += `<ellipse cx="0" cy="-250" rx="212" ry="34" fill="${P.BAJAT}"/><ellipse cx="0" cy="-246" rx="192" ry="26" fill="${P.AIR}"/>`;
    // gelembung didih di permukaan
    if (dd > 0) for (let i = 0; i < 9; i++) { const q2 = (t * 1.8 + i * 0.37) % 1, bx = -150 + i * 37, r = (8 + (i % 3) * 5) * Math.sin(Math.PI * q2) * dd;
      q += `<circle cx="${bx}" cy="${f1(-246 + Math.sin(i * 3) * 10)}" r="${f1(r)}" fill="${P.AIRT}"/>`; }
    q += `<path d="M-200 -230 Q-150 -100 -170 -20" stroke="#FFFFFF" stroke-width="14" fill="none" opacity=".35" stroke-linecap="round"/>`;
    let atas = "";
    if (o.termo != null) atas += termoTinggi(110, -210, 0.62, o.termo, { garis: 0.62, sorot: o.sorotGaris || 0, panjang: 700, getar: o.getar });
    atas += uapNaik(0, -260, 1, t, cl(o.uap || 0), 5, 260, 520 + 200 * cl(o.uap || 0));
    return g(x, y, s, q + atas);
  }
  function presto(x, y, s, t = 0, o = {}) {
    const ku = cl(o.kunci ?? 1), kt = cl(o.katup || 0);
    let q = `<ellipse cx="0" cy="6" rx="250" ry="20" fill="#000" opacity=".22"/>`;
    // badan baja (sedikit menggembung)
    q += `<path d="M-226 -270 Q-236 -140 -222 -24 Q-218 0 -190 0 L190 0 Q218 0 222 -24 Q236 -140 226 -270Z" fill="${P.BAJA}"/>`;
    q += `<path d="M110 -270 L226 -270 Q236 -140 222 -24 Q218 0 190 0 L96 0Z" fill="${P.BAJAG}" opacity=".5"/><path d="M-196 -250 Q-206 -140 -192 -40" stroke="#FFFFFF" stroke-width="16" fill="none" opacity=".45" stroke-linecap="round"/>`;
    q += `<rect x="-230" y="-286" width="460" height="22" rx="8" fill="${P.BAJAT}"/>`;
    // gagang panjang badan (kanan) + gagang pendek (kiri)
    q += `<path d="M226 -270 L470 -262 Q500 -260 500 -244 Q500 -230 470 -230 L226 -238Z" fill="${P.GAGANG}"/><rect x="-268" y="-262" width="44" height="26" rx="12" fill="${P.GAGANG}"/>`;
    // tutup: digeser/berputar sedikit sebelum terkunci
    const geser = (1 - ku) * 60, angkat = (1 - ku) * 8;
    let tt = `<path d="M-236 -286 Q-220 -350 0 -356 Q220 -350 236 -286Z" fill="${P.BAJAT}"/><path d="M-236 -286 L236 -286 L236 -278 L-236 -278Z" fill="${P.BAJAG}"/>`;
    tt += `<path d="M-180 -310 Q-60 -340 60 -340" stroke="#FFFFFF" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/>`;
    tt += `<path d="M200 -306 L470 -300 Q502 -298 502 -282 Q502 -268 470 -268 L200 -276Z" fill="#4A3230"/>`;
    // katup + pemberat
    tt += `<rect x="-14" y="-384" width="28" height="30" rx="6" fill="${P.BAJAG}"/><g transform="translate(0 ${f1(-kt * 22 + Math.sin(t * 40) * 2 * kt)})"><rect x="-30" y="-414" width="60" height="38" rx="12" fill="#3A3A40"/><rect x="-20" y="-410" width="16" height="10" rx="4" fill="#6A6A72"/></g>`;
    q += `<g transform="translate(${f1(geser)} ${f1(-angkat)})">${tt}</g>`;
    if (o.gerak && ku > 0.98) q += `<path d="M300 -330 l30 -26 M330 -306 l40 -10 M300 -356 l14 -36" stroke="#FFF3E0" stroke-width="8" stroke-linecap="round" opacity="${f2(o.gerak)}"/>`;
    // uap dari katup
    q += uapNaik(0, -410, 0.8, t, cl(o.uap || 0), 4, 90, 380);
    return g(x, y, s, q);
  }

  // ---------- dapur (dunia 2400x1920) ----------
  function dapurPresto(t = 0, o = {}) {
    const W = DAPUR.W, my = DAPUR.MEJA, r = acak(17);
    let s = `<rect x="-400" y="-300" width="${W + 800}" height="2520" fill="${P.KREM}"/>`;
    // lampu hangat di dinding atas
    s += `<defs><radialGradient id="dpLm" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#FFF4DC" stop-opacity=".9"/><stop offset="1" stop-color="#FFF4DC" stop-opacity="0"/></radialGradient></defs><ellipse cx="1400" cy="300" rx="1400" ry="700" fill="url(#dpLm)"/>`;
    // jendela kiri (siang lembut) + rak kayu & toples polos
    s += `<rect x="40" y="240" width="520" height="420" rx="18" fill="#8A5A3A"/><rect x="62" y="262" width="476" height="376" rx="10" fill="#BFE0E6"/><path d="M62 520 Q200 460 340 520 T538 500 L538 638 L62 638Z" fill="#9CCBB0"/><rect x="292" y="262" width="16" height="376" fill="#8A5A3A"/><rect x="62" y="442" width="476" height="14" fill="#8A5A3A"/>`;
    s += `<rect x="760" y="520" width="900" height="24" fill="${P.KAYU}"/><rect x="760" y="544" width="900" height="10" fill="#000" opacity=".12"/>`;
    [[820, "#D9A25A"], [930, "#B5452F"], [1040, "#E9D9B6"], [1180, "#8A2E36"], [1300, "#D9A25A"], [1430, "#E9D9B6"], [1560, "#B5452F"]].forEach(([x, c], i) => {
      const h = 90 + (i % 3) * 30; s += `<rect x="${x - 40}" y="${520 - h}" width="80" height="${h}" rx="14" fill="${c}" opacity=".92"/><rect x="${x - 44}" y="${520 - h - 16}" width="88" height="20" rx="8" fill="#5A3A2A"/>`; });
    // gantungan alat masak (siluet polos)
    s += `<rect x="1850" y="380" width="460" height="14" rx="7" fill="#7A5A4A"/>`;
    [[1910, 0], [2040, 1], [2170, 2]].forEach(([x, k]) => { s += `<path d="M${x} 394 L${x} 430" stroke="#7A5A4A" stroke-width="6"/>` + (k === 0 ? `<rect x="${x - 10}" y="430" width="20" height="150" rx="8" fill="#9A6A4A"/><ellipse cx="${x}" cy="600" rx="40" ry="26" fill="#9A6A4A"/>` : k === 1 ? `<rect x="${x - 8}" y="430" width="16" height="170" rx="7" fill="#8A97A2"/><rect x="${x - 40}" y="590" width="80" height="60" rx="10" fill="#8A97A2"/>` : `<rect x="${x - 9}" y="430" width="18" height="120" rx="8" fill="#9A6A4A"/><circle cx="${x}" cy="580" r="44" fill="#8A97A2"/>`); });
    // backsplash ubin merah bata
    s += `<rect x="-400" y="${my - 520}" width="${W + 800}" height="520" fill="#9E3A28"/>`;
    for (let j = 0; j < 7; j++) for (let i = -5; i < W / 100 + 6; i++) { const c = [P.BATA, P.BATAT, "#A83E2B"][Math.floor(r() * 3)];
      s += `<rect x="${i * 100 + (j % 2) * 50 + 4}" y="${my - 520 + j * 75 + 4}" width="92" height="67" rx="6" fill="${c}"/>`; }
    s += `<rect x="-400" y="${my - 520}" width="${W + 800}" height="18" fill="${P.KREM2}"/>`;
    // meja + lemari marun
    s += `<rect x="-400" y="${my}" width="${W + 800}" height="44" fill="${P.KREM2}"/><rect x="-400" y="${my + 44}" width="${W + 800}" height="12" fill="#000" opacity=".12"/>`;
    s += `<rect x="-400" y="${my + 56}" width="${W + 800}" height="${1920 - my + 300}" fill="${P.MARUN}"/>`;
    for (let i = -2; i < W / 380 + 2; i++) s += `<rect x="${i * 380 + 26}" y="${my + 100}" width="330" height="560" rx="18" fill="${P.MARUNT}"/><rect x="${i * 380 + 168}" y="${my + 140}" width="46" height="12" rx="6" fill="${P.KREM2}"/>`;
    // talenan + daging
    s += talenan(DAPUR.TALENAN[0], my, 1);
    if (o.daging) s += daging(DAPUR.TALENAN[0] + (o.daging.dx || 0), my - 40 + (o.daging.dy || 0), o.daging.s || 1, t, o.daging);
    // kompor + panci + presto
    s += kompor(1410, my, 1, t, o);
    s += panciTerbuka(DAPUR.PANCI[0] - 0, DAPUR.PANCI[1], 0.92, t, o.panci || {});
    s += presto(DAPUR.PRESTO[0], DAPUR.PRESTO[1], 0.95, t, o.presto || {});
    // piring + daging empuk
    s += piring(DAPUR.PIRING[0], my, 0.9);
    if (o.piring) s += daging(DAPUR.PIRING[0], my - 44, 0.85, t, Object.assign({ matang: 1 }, o.piring));
    if (o.garpu) s += garpu(o.garpu.x, o.garpu.y, o.garpu.s || 1, o.garpu.rot || 0);
    return s;
  }

  // ---------- PENAMPANG PRESTO (x-ray 1080x1920) ----------
  const PEN = { L: 170, R: 910, ATAS: 640, AIR: 1180, DASAR: 1520, KX: 540, KY: 520, TX: 790 };
  function latarXray(t) {
    const id = uid("xr");
    let s = `<defs><radialGradient id="${id}" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="${P.MARUNT}"/><stop offset="1" stop-color="${P.MARUNG}"/></radialGradient></defs><rect x="-400" y="-400" width="1880" height="2720" fill="url(#${id})"/>`;
    for (let i = -4; i < 16; i++) s += `<path d="M${i * 90} -400 V2320" stroke="#FFE3B0" stroke-width="2" opacity=".07"/>`;
    for (let j = -4; j < 26; j++) s += `<path d="M-400 ${j * 90} H1480" stroke="#FFE3B0" stroke-width="2" opacity=".07"/>`;
    for (let i = 0; i < 16; i++) { const x = ((i * 173 + t * 14) % 1300) - 100, y = ((i * 251 + t * 9) % 1900); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${3 + (i % 3) * 2}" fill="#FFE3B0" opacity=".14"/>`; }
    return s;
  }
  function posUap(i, t, o) {
    // butir uap i: naik dari permukaan, memantul di tutup; numpuk → mengisi ruang & berdesakan
    const r = acak(31 + i * 7), bx = PEN.L + 60 + r() * (PEN.R - PEN.L - 120), fase = r(), sp = 0.55 + r() * 0.5;
    const nm = cl(o.numpuk || 0);
    const H = PEN.AIR - PEN.ATAS - 60;
    let u = (t * sp * 0.6 + fase) % 2; // 0..1 naik, 1..2 turun pantul
    let yy = u < 1 ? PEN.AIR - 30 - H * u : PEN.ATAS + 30 + H * 0.45 * Math.sin((u - 1) * Math.PI);
    // posisi "numpuk": grid rapat
    const gx = PEN.L + 70 + (i % 9) * ((PEN.R - PEN.L - 140) / 8), gy = PEN.ATAS + 60 + Math.floor(i / 9) * 78;
    const jit = 8 * Math.sin(t * 9 + i * 1.7);
    return [lerp(bx + Math.sin(t * 2 + i) * 20, gx + jit, nm), lerp(yy, gy + jit * 0.7, nm)];
  }
  function penampangPresto(t = 0, o = {}) {
    const { L, R, ATAS, AIR, DASAR, KX, KY } = PEN;
    let s = latarXray(t);
    // api di bawah
    s += apiBiru(540, DASAR + 150, 2.0, t, o.apiK ?? 1);
    s += `<rect x="200" y="${DASAR + 150}" width="680" height="30" rx="12" fill="#2E2B30"/>`;
    // dinding baja (tebal) + bagian dalam
    s += `<path d="M${L - 40} ${ATAS - 10} L${L - 40} ${DASAR - 20} Q${L - 40} ${DASAR + 40} ${L + 20} ${DASAR + 40} L${R - 20} ${DASAR + 40} Q${R + 40} ${DASAR + 40} ${R + 40} ${DASAR - 20} L${R + 40} ${ATAS - 10}Z" fill="${P.BAJA}"/>`;
    s += `<path d="M${L} ${ATAS} L${L} ${DASAR - 20} Q${L} ${DASAR} ${L + 20} ${DASAR} L${R - 20} ${DASAR} Q${R} ${DASAR} ${R} ${DASAR - 20} L${R} ${ATAS}Z" fill="#5A2A32"/>`;
    // ruang uap (lebih terang saat uap numpuk)
    const nm = cl(o.numpuk || 0);
    s += `<rect x="${L}" y="${ATAS}" width="${R - L}" height="${AIR - ATAS}" fill="#FFFFFF" opacity="${f2(0.04 + 0.16 * nm)}"/>`;
    // air
    const ombak = (k) => { let d = `M${L} ${AIR}`; for (let x = L; x <= R; x += 40) d += ` L${x} ${f1(AIR + Math.sin(x * 0.03 + t * 3) * 4 * k)}`; return d + ` L${R} ${DASAR - 20} Q${R} ${DASAR} ${R - 20} ${DASAR} L${L + 20} ${DASAR} Q${L} ${DASAR} ${L} ${DASAR - 20}Z`; };
    s += `<path d="${ombak(1 + 3 * cl(o.didih || 0))}" fill="${P.AIR}" opacity=".92"/><rect x="${L}" y="${AIR - 2}" width="${R - L}" height="8" fill="${P.AIRT}"/>`;
    // gelembung halus (didih)
    const dd = cl(o.didih || 0);
    if (dd > 0) { const rr = acak(5); for (let i = 0; i < 26; i++) { const bx = L + 30 + rr() * (R - L - 60), sp = 0.5 + rr(), q = (t * sp + rr()) % 1, r0 = 5 + rr() * 9;
      s += `<circle cx="${f1(bx + Math.sin(q * 8 + i) * 8)}" cy="${f1(DASAR - 30 - q * (DASAR - AIR - 30))}" r="${f1(r0 * (0.6 + 0.4 * q))}" fill="none" stroke="${P.AIRT}" stroke-width="4" opacity="${f2(dd * Math.min(1, (1 - q) * 4))}"/>`; } }
    // daging di dalam (opsional)
    if (o.daging) s += daging(430, DASAR - 70, 0.95, t, o.daging);
    if (o.panas) s += gelombangPanas(260, DASAR - 260, 420, DASAR - 120, t, o.panas) + gelombangPanas(640, DASAR - 260, 470, DASAR - 120, t + 0.4, o.panas);
    // butir uap
    const nu = Math.round(cl(o.uap || 0) * 36);
    for (let i = 0; i < nu; i++) { const [x, y] = posUap(i, t, o); s += butirUap(x, y, 30 - (i % 3) * 4, Math.min(1, (o.uap * 36 - i))); }
    // tutup + gagang + katup (x-ray)
    s += `<path d="M${L - 60} ${ATAS} Q${L - 40} ${ATAS - 110} ${KX} ${ATAS - 120} Q${R + 40} ${ATAS - 110} ${R + 60} ${ATAS}Z" fill="${P.BAJAT}"/><rect x="${L - 60}" y="${ATAS - 12}" width="${R - L + 120}" height="24" rx="10" fill="${P.BAJAG}"/>`;
    s += `<path d="M${L - 20} ${ATAS - 30} Q${KX - 200} ${ATAS - 95} ${KX - 80} ${ATAS - 100}" stroke="#FFFFFF" stroke-width="12" fill="none" opacity=".55" stroke-linecap="round"/>`;
    const kt = cl(o.katup || 0);
    s += `<rect x="${KX - 22}" y="${KY - 10}" width="44" height="40" rx="8" fill="${P.BAJAG}"/><g transform="translate(0 ${f1(-kt * 34 + Math.sin(t * 40) * 3 * kt)})"><rect x="${KX - 50}" y="${KY - 70}" width="100" height="64" rx="18" fill="#3A3A40"/><rect x="${KX - 32}" y="${KY - 62}" width="26" height="16" rx="6" fill="#6A6A72"/></g>`;
    // semburan uap kecil dari katup
    const sb = cl(o.semburan || 0);
    if (sb > 0) for (let i = 0; i < 6; i++) { const q = (t * 1.4 + i / 6) % 1; s += butirUap(KX + Math.sin(q * 6 + i) * 30 + (i % 2 ? 20 : -20), KY - 40 - q * 260, 18 + q * 30, sb * Math.sin(Math.PI * q) * 0.9); }
    // termometer tinggi di dalam (bulb di air)
    if (o.termo != null) s += termoTinggi(PEN.TX, DASAR - 70, 1, o.termo, { garis: o.garis ?? 0.62, sorot: o.sorot || 0, panjang: 760, getar: o.getar });
    // panah tekanan
    const ph = cl(o.panah || 0);
    if (ph > 0) { const tb = 0.6 + 1.0 * ph, len = 70 + 90 * ph, a = Math.min(1, ph * 3);
      for (const x of [300, 540, 780]) s += panahTekanan(x, ATAS + 20, len, 90, tb, a);
      for (const y of [760, 960]) { s += panahTekanan(L + 14, y, len, 0, tb, a); s += panahTekanan(R - 14, y, len, 180, tb, a); } }
    return s;
  }

  // ---------- close-up permukaan air ----------
  function permukaanAir(t = 0, o = {}) {
    const Y = 1080;
    let s = latarXray(t);
    s += `<rect x="-400" y="-400" width="1880" height="${Y + 400}" fill="#FFFFFF" opacity=".1"/>`;
    let d = `M-400 ${Y}`; for (let x = -400; x <= 1480; x += 40) d += ` L${x} ${f1(Y + Math.sin(x * 0.02 + t * 3) * 10)}`; d += ` L1480 2400 L-400 2400Z`;
    s += `<path d="${d}" fill="${P.AIR}"/><path d="${d.replace(/L1480 2400 L-400 2400Z/, "")}" stroke="${P.AIRT}" stroke-width="14" fill="none"/>`;
    // gelembung mencoba naik lalu ditekan
    const tk = cl(o.tekan || 0), co = cl(o.coba ?? 1), lo = cl(o.lolos || 0);
    const BX = [180, 360, 720, 900];
    BX.forEach((bx, i) => { const q = (t * 1.1 + i * 0.27) % 1, naik = Math.sin(Math.PI * q) * 160 * co * (1 - 0.6 * tk), yy = Y + 120 - naik;
      s += `<circle cx="${bx}" cy="${f1(yy)}" r="${34 + (i % 2) * 8}" fill="none" stroke="${P.AIRT}" stroke-width="7"/><circle cx="${bx - 10}" cy="${f1(yy - 10)}" r="8" fill="#FFFFFF" opacity=".8"/>`; });
    // gelembung utama (tengah): mendorong lebih kuat, lolos
    const dor = o.dorong || 0, gy = lerp(Y + 170, Y - 40, cl(dor)) - lo * 620, rr = 64 + 16 * cl(dor) + 10 * Math.sin(t * 18) * cl(dor) * (1 - lo);
    if (lo < 1) s += `<g opacity="${f2(1 - cl((lo - 0.6) / 0.4))}"><circle cx="540" cy="${f1(gy)}" r="${f1(rr)}" fill="${lo > 0.05 ? "#FFFFFF" : "none"}" stroke="${P.AIRT}" stroke-width="9" ${lo > 0.05 ? 'fill-opacity=".85"' : ""}/><circle cx="520" cy="${f1(gy - 20)}" r="14" fill="#FFFFFF"/></g>`;
    if (lo > 0) s += butirUap(540, gy, rr * 0.9, Math.min(1, lo * 3) * (1 - cl((lo - 0.7) / 0.3)));
    // panah menekan dari atas
    const ph = cl(o.panah ?? 1), tb = 0.8 + 0.8 * tk;
    for (const x of [180, 540, 900]) s += panahTekanan(x, 520 + (x === 540 ? lo * -260 : 0), 190 + 90 * tk, 90, tb, ph * (x === 540 ? 1 - lo : 1));
    // percikan saat lolos
    if (lo > 0 && lo < 0.6) for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.4, rr2 = 60 + lo * 260; s += `<circle cx="${f1(540 + Math.cos(a) * rr2)}" cy="${f1(Y + Math.sin(a) * rr2 * 0.6)}" r="10" fill="${P.AIRT}" opacity="${f2(1 - lo / 0.6)}"/>`; }
    return s;
  }

  // ---------- angkot sesak (interior generik, penumpang tanpa wajah) ----------
  function penumpang(x, y, s, warna, rambut, t, o = {}) {
    const sq = o.sq || 0;
    return g(x, y, s, `<g transform="scale(${f2(1 + sq * 0.12)} ${f2(1 - sq * 0.1)})"><path d="M-80 0 Q-90 -150 -60 -210 Q0 -240 60 -210 Q90 -150 80 0Z" fill="${warna}"/><circle cx="0" cy="-280" r="62" fill="#E8B48A"/><path d="M-62 -290 Q-60 -350 0 -352 Q60 -350 62 -290 Q40 -320 0 -322 Q-40 -320 -62 -290Z" fill="${rambut}"/></g>`, o.rot || 0);
  }
  function angkotSesak(t = 0, o = {}) {
    const dor = cl(o.dorong || 0), lo = cl(o.lolos || 0);
    let s = `<rect x="-400" y="-300" width="1880" height="2520" fill="#EAD9BC"/>`;
    // atap & jendela panjang (pemandangan lewat)
    s += `<rect x="-400" y="420" width="1880" height="300" fill="#B9DDE6"/>`;
    for (let i = -2; i < 12; i++) { const bx = i * 200 - ((t * 320) % 200), hh = 120 + (Math.abs(i * 37) % 3) * 50; s += `<rect x="${f1(bx)}" y="${720 - hh}" width="160" height="${hh}" fill="${["#E9C9A4", "#D8A88A", "#C9B8A0"][Math.abs(i) % 3]}" opacity=".9"/>`; }
    s += `<rect x="-400" y="400" width="1880" height="30" fill="#7A2E2A"/><rect x="-400" y="720" width="1880" height="40" fill="#7A2E2A"/>`;
    for (let i = 0; i < 4; i++) s += `<rect x="${60 + i * 250}" y="420" width="22" height="300" fill="#7A2E2A"/>`;
    s += `<rect x="-400" y="330" width="1880" height="14" fill="#8A8F98"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M${80 + i * 170} 344 l0 26 m-18 0 a18 18 0 1 0 36 0" stroke="#8A8F98" stroke-width="7" fill="none"/>`;
    // pintu terang di kanan
    s += `<rect x="900" y="400" width="300" height="1200" fill="#FFF3D6"/><path d="M900 400 L1200 400 L1200 1600 L900 1600Z" fill="#FFE7B0" opacity=".6"/>`;
    // bangku
    s += `<rect x="-400" y="1240" width="1300" height="60" rx="14" fill="${P.MARUNT}"/><rect x="-400" y="1300" width="1300" height="300" fill="${P.MARUN}"/><rect x="-400" y="1600" width="1880" height="800" fill="#5A5048"/>`;
    // penumpang sesak (tanpa wajah)
    const W2 = [["#3F6E8C", "#3A2A20"], ["#C9A13A", "#2A1E18"], ["#6E8A4E", "#3A2A20"], ["#8A4A6E", "#2A1E18"], ["#4E5E8A", "#4A3428"]];
    W2.forEach(([c, h], i) => { const x = 40 + i * 150 + Math.sin(t * 6 + i) * 4 * (1 - lo), dx = dor * (i - 2) * -6; s += penumpang(x + dx, 1280, 1.05, c, h, t, { sq: dor * 0.8 * Math.sin(t * 20 + i) * 0.3 + dor * 0.4, rot: (i - 2) * dor * -2 }); });
    // penumpang dekat pintu: mendorong lalu pop keluar
    const px = lerp(800, 1480, Math.pow(lo, 1.4)), py = 1300 - Math.sin(Math.PI * lo) * 140, sq = dor * (1 - lo) * (0.7 + 0.3 * Math.sin(t * 24));
    s += penumpang(px, py, 1.05, P.BATA, "#2A1E18", t, { sq: -sq * 0.6, rot: -12 * dor * (1 - lo) + 20 * lo });
    // garis usaha
    if (dor > 0.1 && lo < 0.3) for (let i = 0; i < 3; i++) s += `<path d="M${880 + i * 10} ${1000 + i * 70} l60 -10" stroke="#7A2E2A" stroke-width="8" stroke-linecap="round" opacity="${f2(dor * (0.5 + 0.5 * Math.sin(t * 20 + i)))}"/>`;
    return s;
  }

  // ---------- ikon kartu ----------
  const ikonApi = (t) => `<g transform="translate(0 80) scale(1.2)">${apiBiru(0, 0, 1, t, 1.5).replace(/^<g[^>]*>/, "<g>")}</g>`;
  const ikonTekanan = (t) => `<circle cx="0" cy="0" r="58" fill="#FFFFFF" opacity=".92"/>${[0, 90, 180, 270].map((a) => `<g transform="rotate(${a})">${panahTekanan(0, -118, 54, 90, 0.7, 1)}</g>`).join("")}`;
  const ikonIga = () => `<g transform="rotate(-25)"><rect x="-80" y="-14" width="160" height="28" rx="14" fill="#FBF3E4"/><circle cx="-84" cy="-14" r="20" fill="#FBF3E4"/><circle cx="-84" cy="14" r="20" fill="#FBF3E4"/><circle cx="84" cy="-14" r="20" fill="#FBF3E4"/><circle cx="84" cy="14" r="20" fill="#FBF3E4"/><path d="M-40 -14 Q0 -60 40 -14Z" fill="${P.DAGINGM}"/></g>`;
  const ikonAyam = () => `<g transform="rotate(30)"><ellipse cx="-20" cy="0" rx="70" ry="54" fill="#C9783A"/><ellipse cx="-34" cy="-14" rx="26" ry="16" fill="#E4A060" opacity=".8"/><rect x="40" y="-10" width="60" height="20" rx="10" fill="#FBF3E4"/><circle cx="104" cy="-10" r="14" fill="#FBF3E4"/><circle cx="104" cy="10" r="14" fill="#FBF3E4"/></g>`;
  const ikonBandeng = () => `<path d="M-96 0 Q-40 -50 40 -30 Q70 -20 80 0 Q70 20 40 30 Q-40 50 -96 0Z" fill="#9FB4BE"/><path d="M76 0 L116 -36 L110 0 L116 36Z" fill="#8AA0AA"/><circle cx="-62" cy="-6" r="8" fill="#2A2A2A"/><path d="M-30 -24 Q-10 0 -30 24 M0 -28 Q20 0 0 28 M30 -26 Q48 0 30 26" stroke="#7E929C" stroke-width="5" fill="none"/>`;

  Object.assign(A, { PRESTO: P, DAPUR, PEN, butirUap, panahTekanan, gelombangPanas, apiBiru, kompor, termoTinggi, daging, garpu, talenan, piring, panciTerbuka, presto,
    dapurPresto, penampangPresto, permukaanAir, angkotSesak, penumpang, ikonApi, ikonTekanan, ikonIga, ikonAyam, ikonBandeng });
})(typeof window !== "undefined" ? window : globalThis);
