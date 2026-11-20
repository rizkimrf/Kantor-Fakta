/* ASET SAMBAL & CABAI JAWA — tambahan pustaka (Yoga, 21 Nov 2026; dipakai B-01 "Cabai asli Indonesia atau bukan?"). Muat SETELAH aset-set.js & aset-pedas.js.
 * Gaya sama dengan aset-set.js: datar tanpa garis hitam, bayangan lembut. Semua fungsi → potongan SVG (string). Teks hanya lewat kode (labelKayu).
 *  cabaiJawa(x,y,s,{rot,kering,mata,lihat,tangan,bangga,glow}) — cabya (Piper retrofractum): bulir panjang berbintil, pangkal di (x,y) menggantung ke bawah
 *  untaianCabya(x,y,s,t,{n,jarak,kering}) · dapurJawaKuno(w,h,P,t,{pintuX,laut,rak,lantai}) · tungkuTanah(x,y,s,t,{bara}) · gerabah(x,y,s,{jenis:'periuk'|'kendi'|'cowek'})
 *  labelKayu(x,y,s,teks,{rot,tali,goyang}) — papan nama kayu bergantung (x,y = titik gantung) · koper(x,y,s,{warna}) · siluetPelaut → pakai A.siluetBertopi
 *  mejaMakanMalam(w,h,P,t,{meja}) · piringNasi(x,y,s,t) · gelasTeh(x,y,s,t) · lampuGantung(x,y,s,t)
 *  globeKartun(x,y,r,t,{lon,sorot}) — bola dunia datar tanpa batas negara/rute; sorot 0..1 menyalakan benua Amerika
 *  lontarNaskah(x,y,s,t,{buka,gambar}) — naskah daun lontar, coretan hiasan tak terbaca + gambar cabya kecil menyala
 *  lapakJamu(w,h,P,t,{meja}) · botolJamu(x,y,s,{isi}) · bakul(x,y,s) · podium(x,y,s,{warna,tinggi}) · tanganPolos(x0,y0,x1,y1,{kulit,lengan,genggam}) */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let _n = 0; const uid = (p) => `${p}s${++_n}`;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;
  const malam = (P) => P && P.nama === "malam";

  // ---------- cabya / cabai jawa: bulir panjang ±230 (s=1), berbintil, merah tua; pangkal (0,0), menggantung ke +y ----------
  function cabaiJawa(x, y, s, o = {}) {
    const kr = cl(o.kering || 0), w = kr ? mix("#B3262A", "#6E2A1E", kr) : "#B3262A", wg = kr ? mix("#7E1A1E", "#4E1C14", kr) : "#7E1A1E", bt = kr ? mix("#D2473A", "#8A3E2C", kr) : "#D2473A";
    const bg = cl(o.bangga || 0), L = 230 + bg * 10;
    let bin = ""; for (let j = 0; j < 11; j++) for (let i = -1; i <= 1; i++) { const yy = 34 + j * 17, ww = lebar(yy / L); if (Math.abs(i) * 11 > ww - 6) continue; bin += `<ellipse cx="${f1(i * 11 + (j % 2) * 5 - 2)}" cy="${yy}" rx="6.5" ry="5" fill="${bt}" opacity=".75"/>`; }
    const badan = `<path d="M-6 0 L6 0 L10 22 C26 40 28 ${L * 0.6} 18 ${L * 0.9} C12 ${L} -12 ${L} -18 ${L * 0.9} C-28 ${L * 0.6} -26 40 -10 22Z" fill="${w}"/>
      <path d="M6 30 C20 60 22 ${L * 0.6} 14 ${L * 0.88} C10 ${L * 0.96} 2 ${L} -4 ${L * 0.98} C10 ${L * 0.8} 14 ${L * 0.5} 6 30Z" fill="${wg}" opacity=".6"/>${bin}
      <path d="M-14 50 C-18 90 -18 140 -12 170" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" opacity=".3"/>
      <path d="M-5 -26 Q0 -10 0 4" stroke="#5E5A2A" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="18" rx="16" ry="8" fill="#6A6A30"/>`;
    const gid = uid("cj"), glow = o.glow ? `<defs><radialGradient id="${gid}"><stop offset="0" stop-color="#FFE08A" stop-opacity=".7"/><stop offset=".6" stop-color="#FFE08A" stop-opacity=".25"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></radialGradient></defs><ellipse cx="0" cy="${L * 0.5}" rx="${110}" ry="${L * 0.8}" fill="url(#${gid})" opacity="${f2(o.glow * 0.8)}"/>` : "";
    const tg = cl(o.tangan || 0);
    const tangan = tg > 0 ? `<g opacity="${f2(Math.min(1, tg * 2))}"><path d="M22 ${L * 0.55} Q${f1(46 + tg * 22)} ${f1(L * 0.55 - tg * 6)} ${f1(56 + tg * 30)} ${f1(L * 0.5 - tg * 18)}" stroke="${w}" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="${f1(60 + tg * 30)}" cy="${f1(L * 0.5 - tg * 22)}" rx="14" ry="8" fill="${w}" transform="rotate(-20 ${f1(60 + tg * 30)} ${f1(L * 0.5 - tg * 22)})"/></g>` : "";
    const mt = o.mata === "lesu" ? g(0, L * 0.33, 0.42, `<circle cx="-28" cy="0" r="18" fill="#FFF"/><circle cx="28" cy="0" r="18" fill="#FFF"/><circle cx="-26" cy="6" r="9" fill="#1E1E1E"/><circle cx="30" cy="6" r="9" fill="#1E1E1E"/><path d="M-48 -2 L-8 -2 M8 -2 L48 -2" stroke="${wg}" stroke-width="20"/><path d="M-14 42 Q0 34 14 42" stroke="#1E1E1E" stroke-width="6" fill="none" stroke-linecap="round"/>`)
      : o.mata ? A.mata(0, L * 0.33, 0.42, o.mata, o.lihat || 0) : "";
    return g(x, y, s, `${glow}<g transform="scale(${f2(1 - bg * 0.06)} ${f2(1 + bg * 0.04)})">${badan}${tangan}${mt}</g>`, o.rot || 0);
    function lebar(v) { return 10 + 16 * Math.sin(Math.PI * Math.min(1, v * 1.05)); }
  }
  function mix(a, b, k) { const p = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16)); const A1 = p(a), B1 = p(b); return "#" + A1.map((v, i) => Math.round(v + (B1[i] - v) * k).toString(16).padStart(2, "0")).join(""); }

  function untaianCabya(x, y, s, t = 0, o = {}) {
    const n = o.n || 7, j = o.jarak || 46; let u = `<path d="M${-j * 0.6} 0 L${(n - 0.4) * j} 0" stroke="#8A6A3A" stroke-width="6"/>`;
    for (let i = 0; i < n; i++) { const sw = Math.sin(t * 1.3 + i * 0.9) * 4; u += cabaiJawa(i * j, 4, 0.62 + (i % 3) * 0.06, { rot: sw, kering: o.kering ?? 0.65 }); }
    return g(x, y, s, u);
  }

  // ---------- tungku tanah liat dengan bara ----------
  function tungkuTanah(x, y, s, t = 0, o = {}) {
    const b = o.bara ?? 1, fl = 1 + 0.08 * Math.sin(t * 11) + 0.05 * Math.sin(t * 6.3), id = uid("tk");
    return g(x, y, s, `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#FFB24A" stop-opacity="${f2(0.55 * b)}"/><stop offset="1" stop-color="#FF7A2A" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="0" cy="-60" rx="${f1(300 * fl)}" ry="${f1(220 * fl)}" fill="url(#${id})"/><ellipse cx="0" cy="8" rx="230" ry="26" fill="#000" opacity=".22"/>
      <path d="M-210 0 L-190 -170 Q0 -200 190 -170 L210 0Z" fill="#A65A3A"/><path d="M60 -185 Q150 -180 190 -170 L210 0 L90 0Z" fill="#8A4630" opacity=".7"/><path d="M-190 -170 Q0 -200 190 -170 Q0 -150 -190 -170Z" fill="#C2734E"/>
      <path d="M-120 0 L-120 -80 Q-60 -130 0 -80 L0 0Z" fill="#2A1410"/><path d="M40 0 L40 -70 Q90 -110 140 -70 L140 0Z" fill="#2A1410"/>
      ${[[-60, -20, 26], [-90, -12, 18], [-36, -10, 16], [90, -14, 18], [112, -8, 12]].map(([a, c, r]) => `<circle cx="${a}" cy="${c}" r="${r}" fill="${b > 0.5 ? "#FF7A2A" : "#7A3A2A"}" opacity="${f2(0.6 + 0.4 * b)}"/><circle cx="${a - 4}" cy="${c - 4}" r="${r * 0.5}" fill="#FFD27A" opacity="${f2(b * (0.6 + 0.4 * Math.sin(t * 7 + a)))}"/>`).join("")}
      <g opacity="${f2(b)}" transform="translate(-60 -40) scale(${f2(fl)})"><path d="M0 -70 Q22 -30 14 -6 Q8 6 0 6 Q-8 6 -14 -6 Q-22 -30 0 -70Z" fill="#FF9A3A"/><path d="M0 -40 Q10 -20 7 -6 Q4 2 0 2 Q-4 2 -7 -6 Q-10 -20 0 -40Z" fill="#FFE7A6"/></g>
      <ellipse cx="-60" cy="-196" rx="120" ry="22" fill="#3A2A24"/><path d="M-170 -196 Q-160 -300 -60 -306 Q40 -300 50 -196Z" fill="#5A3A2E"/><path d="M-150 -220 Q-120 -280 -60 -286" stroke="#7A5A4A" stroke-width="10" fill="none" stroke-linecap="round"/>
      ${[0, 1, 2].map((i) => { const u = (t * 0.35 + i / 3) % 1; return `<circle cx="${f1(-60 + Math.sin(u * 6 + i) * 30)}" cy="${f1(-320 - u * 260)}" r="${f1(26 + u * 40)}" fill="#EDE6DA" opacity="${f2(0.28 * (1 - u))}"/>`; }).join("")}`);
  }
  function gerabah(x, y, s, o = {}) {
    const j = o.jenis || "periuk", c = o.warna || "#B5653E", cg = "#8E4A2E";
    if (j === "kendi") return g(x, y, s, `<ellipse cx="0" cy="4" rx="80" ry="12" fill="#000" opacity=".2"/><path d="M-70 -10 Q-90 -120 -26 -160 L-20 -220 L20 -220 L26 -160 Q90 -120 70 -10 Q0 10 -70 -10Z" fill="${c}"/><path d="M30 -150 Q90 -110 70 -10 Q40 0 20 -2 Q60 -80 30 -150Z" fill="${cg}" opacity=".6"/><rect x="-26" y="-232" width="52" height="16" rx="6" fill="${cg}"/><path d="M60 -120 Q130 -140 140 -180" stroke="${c}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M-60 -100 Q0 -86 60 -100" stroke="#D88A5E" stroke-width="6" fill="none" opacity=".6"/>`);
    if (j === "cowek") return g(x, y, s, `<ellipse cx="0" cy="6" rx="170" ry="20" fill="#000" opacity=".22"/><path d="M-160 -40 Q-150 16 -90 22 L90 22 Q150 16 160 -40Z" fill="#5A5254"/><ellipse cx="0" cy="-40" rx="160" ry="32" fill="#6E6668"/><ellipse cx="0" cy="-36" rx="128" ry="22" fill="#8E3A2A"/><ellipse cx="-20" cy="-40" rx="80" ry="12" fill="#B3502E"/>`);
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="120" ry="16" fill="#000" opacity=".2"/><path d="M-110 -60 Q-120 0 -60 6 L60 6 Q120 0 110 -60 Q100 -130 0 -136 Q-100 -130 -110 -60Z" fill="${c}"/><path d="M40 -130 Q110 -110 110 -60 Q118 0 60 6 L30 6 Q90 -50 40 -130Z" fill="${cg}" opacity=".55"/><ellipse cx="0" cy="-136" rx="76" ry="16" fill="${cg}"/><ellipse cx="0" cy="-138" rx="60" ry="10" fill="#3A2218"/><path d="M-96 -70 Q0 -50 96 -70" stroke="#D88A5E" stroke-width="7" fill="none" opacity=".55"/>`);
  }

  // ---------- dapur Jawa kuno: dinding gedek, tiang kayu, para-para bambu + untaian cabya, tungku, gerabah, pintu ke luar ----------
  function dapurJawaKuno(w, h, P, t = 0, o = {}) {
    const lt = o.lantai ?? h * 0.7, r = acak(41), px = o.pintuX ?? w * 0.78, m = malam(P);
    let s = `<rect width="${w}" height="${h}" fill="${m ? "#4A3A2E" : "#8A6A48"}"/>`;
    // dinding gedek (anyaman bambu): petak 48 px bergantian garis datar/tegak
    const c1 = m ? "#5E4A38" : "#A8865A", c2 = m ? "#52402F" : "#967650";
    for (let yy = 0, j = 0; yy < lt; yy += 48, j++) for (let xx = 0, i = 0; xx < w; xx += 48, i++) { const d = (i + j) % 2;
      s += `<rect x="${xx}" y="${yy}" width="47" height="47" fill="${d ? c1 : c2}"/>` + (d ? `<rect x="${xx}" y="${yy + 15}" width="47" height="3" fill="#000" opacity=".12"/><rect x="${xx}" y="${yy + 31}" width="47" height="3" fill="#000" opacity=".12"/>` : `<rect x="${xx + 15}" y="${yy}" width="3" height="47" fill="#000" opacity=".12"/><rect x="${xx + 31}" y="${yy}" width="3" height="47" fill="#000" opacity=".12"/>`); }
    // pintu: luar terang (laut + kapal jauh opsional)
    const pw = o.pintuW ?? 300, ph = o.pintuH ?? 560, py = lt - ph;
    s += `<rect x="${px - 20}" y="${py - 20}" width="${pw + 40}" height="${ph + 20}" fill="#4A3220"/><svg x="${px}" y="${py}" width="${pw}" height="${ph}">${A.langit(P, pw, ph, t, { suryaX: pw * 0.7, suryaY: ph * 0.2 })}`
      + (o.laut ? `${A.laut(pw + 200, ph * 0.55, ph * 0.45, P, t)}${A.kapalKayuSiluet(pw * 0.5 + (o.kapalX || 0), ph * 0.58, 0.22, t, { warna: "#3A3038", layar: "#F2EAD6" })}` : `${A.tanah ? `<rect y="${ph * 0.7}" width="${pw}" height="${ph * 0.3}" fill="${P.tanah || "#9A8A5A"}"/>` : ""}${A.pohon ? A.pohon(pw * 0.4, ph * 0.74, 0.7, P, t) : ""}`)
      + `</svg>`;
    // tiang & balok
    [w * 0.04, w * 0.5, px - 40].forEach((xx) => s += `<rect x="${f1(xx)}" y="0" width="46" height="${lt}" fill="#5A3A24"/><rect x="${f1(xx + 30)}" y="0" width="16" height="${lt}" fill="#000" opacity=".15"/>`);
    s += `<rect x="0" y="${o.rak ?? 260}" width="${w}" height="34" fill="#6A4A2C"/><rect x="0" y="${(o.rak ?? 260) + 34}" width="${w}" height="10" fill="#000" opacity=".18"/>`;
    s += `<rect x="0" y="${lt}" width="${w}" height="${h - lt}" fill="${m ? "#3A2A22" : "#6E5238"}"/><rect x="0" y="${lt}" width="${w}" height="16" fill="#000" opacity=".15"/>`;
    for (let i = 0; i < 16; i++) s += `<ellipse cx="${f1(r() * w)}" cy="${f1(lt + 40 + r() * (h - lt - 60))}" rx="${f1(20 + r() * 40)}" ry="6" fill="#000" opacity=".08"/>`;
    s += `<rect width="${w}" height="${h}" fill="#FF9A4A" opacity="${m ? 0.1 : 0.05}"/>`;
    return s;
  }

  // ---------- papan nama kayu (teks via kode). (x,y) = titik gantung, papan di bawahnya ----------
  function labelKayu(x, y, s, teks, o = {}) {
    const tl = o.tali ?? 60, rot = o.rot || 0, uk = o.uk || 54, lw = Math.max(180, teks.length * uk * 0.62 + 70);
    const tali = tl > 0 ? `<path d="M0 0 L${-lw * 0.3} ${tl} M0 0 L${lw * 0.3} ${tl}" stroke="#5A4A3A" stroke-width="5"/>` : "";
    return g(x, y, s, `${tali}<g transform="translate(0 ${tl}) rotate(${f1(rot)})"><rect x="${f1(-lw / 2)}" y="6" width="${f1(lw)}" height="${uk * 1.7}" rx="16" fill="#000" opacity=".2" transform="translate(6 8)"/>
      <rect x="${f1(-lw / 2)}" y="0" width="${f1(lw)}" height="${uk * 1.7}" rx="16" fill="#C8955A"/><rect x="${f1(-lw / 2)}" y="${uk * 1.2}" width="${f1(lw)}" height="${uk * 0.5}" rx="12" fill="#A87640" opacity=".6"/>
      ${[0.3, 0.62].map((k) => `<path d="M${f1(-lw / 2 + 16)} ${f1(uk * 1.7 * k)} Q0 ${f1(uk * 1.7 * k + 6)} ${f1(lw / 2 - 16)} ${f1(uk * 1.7 * k - 4)}" stroke="#A87640" stroke-width="3" fill="none" opacity=".5"/>`).join("")}
      <circle cx="${f1(-lw * 0.3)}" cy="14" r="7" fill="#5A3A24"/><circle cx="${f1(lw * 0.3)}" cy="14" r="7" fill="#5A3A24"/>
      <text x="0" y="${f1(uk * 1.12)}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${uk}" fill="#3A2412">${teks}</text></g>`);
  }
  function koper(x, y, s, o = {}) {
    const c = o.warna || "#3E7A6A";
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="110" ry="14" fill="#000" opacity=".2"/><path d="M-36 -150 L-36 -176 Q-36 -188 -24 -188 L24 -188 Q36 -188 36 -176 L36 -150" stroke="#3A2A22" stroke-width="12" fill="none"/>
      <rect x="-100" y="-152" width="200" height="152" rx="20" fill="${c}"/><rect x="30" y="-152" width="70" height="152" rx="20" fill="#000" opacity=".15"/><rect x="-100" y="-90" width="200" height="12" fill="#000" opacity=".18"/>
      <rect x="-70" y="-152" width="14" height="152" fill="#C8955A"/><rect x="56" y="-152" width="14" height="152" fill="#C8955A"/><circle cx="-60" cy="-40" r="16" fill="#F2E2B8"/><rect x="10" y="-130" width="40" height="28" rx="6" fill="#E2483E" opacity=".9"/>`);
  }

  // ---------- meja makan rumah malam ----------
  function lampuGantung(x, y, s, t = 0) {
    const id = uid("lp"), sw = Math.sin(t * 0.9) * 1.5;
    return g(x, y, s, `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#FFE2A0" stop-opacity=".55"/><stop offset="1" stop-color="#FFC060" stop-opacity="0"/></radialGradient></defs><g transform="rotate(${f2(sw)})"><path d="M0 -400 L0 0" stroke="#2A2420" stroke-width="5"/><ellipse cx="0" cy="160" rx="520" ry="420" fill="url(#${id})"/><path d="M-90 60 Q-80 0 0 -6 Q80 0 90 60Z" fill="#2F5A48"/><ellipse cx="0" cy="62" rx="40" ry="22" fill="#FFE7A6"/></g>`);
  }
  function piringNasi(x, y, s, t = 0) {
    return g(x, y, s, `<ellipse cx="0" cy="10" rx="170" ry="30" fill="#000" opacity=".2"/><ellipse cx="0" cy="0" rx="170" ry="40" fill="#F4F2EC"/><ellipse cx="0" cy="-4" rx="130" ry="28" fill="#E2DED4"/>
      <path d="M-100 -10 Q-90 -100 0 -110 Q90 -100 100 -10 Q0 10 -100 -10Z" fill="#FFFFFF"/><path d="M20 -100 Q90 -90 100 -10 Q70 0 40 0 Q80 -50 20 -100Z" fill="#E9E6DE"/>
      ${[[-40, -60], [10, -80], [40, -40], [-10, -30], [-60, -26]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="9" ry="5" fill="#F0EDE4"/>`).join("")}
      ${[0, 1].map((i) => { const u = (t * 0.4 + i * 0.5) % 1; return `<path d="M${-20 + i * 40} ${f1(-120 - u * 120)} q-14 -30 0 -60" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round" opacity="${f2(0.35 * Math.sin(Math.PI * u))}"/>`; }).join("")}`);
  }
  function gelasTeh(x, y, s) { return g(x, y, s, `<ellipse cx="0" cy="6" rx="60" ry="10" fill="#000" opacity=".2"/><path d="M-50 -170 L50 -170 L42 0 L-42 0Z" fill="#E9F2F2" opacity=".55"/><path d="M-46 -120 L46 -120 L42 0 L-42 0Z" fill="#B0602A" opacity=".85"/><rect x="-36" y="-160" width="10" height="140" rx="5" fill="#FFF" opacity=".5"/>`); }
  function mejaMakanMalam(w, h, P, t = 0, o = {}) {
    const my = o.meja ?? h * 0.62, m = malam(P);
    let s = `<rect width="${w}" height="${h}" fill="${m ? "#24384A" : "#E8DCC4"}"/>`;
    for (let i = 0; i < w / 120 + 1; i++) s += `<rect x="${i * 120}" y="0" width="60" height="${my}" fill="${m ? "#28405A" : "#EFE4CE"}" opacity=".6"/>`;
    const jx = o.jendelaX ?? w * 0.12;
    s += `<rect x="${jx - 14}" y="${my - 760}" width="388" height="460" fill="#5A3E2A"/><svg x="${jx}" y="${my - 746}" width="360" height="432">${A.langit(P, 360, 432, t, { suryaX: 250, suryaY: 110 })}${A.rumahKampung(180, 432, 0.4, P)}</svg><rect x="${jx + 174}" y="${my - 746}" width="12" height="432" fill="#5A3E2A"/>`;
    s += `<rect x="0" y="${my - 40}" width="${w}" height="40" fill="${m ? "#1E3040" : "#D8CAB0"}"/>`;
    s += `<path d="M-40 ${my} L${w + 40} ${my} L${w + 40} ${h} L-40 ${h}Z" fill="#8A5A36"/><rect x="-40" y="${my}" width="${w + 80}" height="18" fill="#A8744A"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M-40 ${my + 60 + i * 90} L${w + 40} ${my + 70 + i * 90}" stroke="#7A4E2E" stroke-width="4" opacity=".5"/>`;
    if (o.lampu !== false) s += lampuGantung(o.lampuX ?? w * 0.55, my - 640, 1, t);
    s += `<rect width="${w}" height="${h}" fill="#FFB860" opacity="${m ? 0.07 : 0}"/>`;
    return s;
  }

  // ---------- bola dunia kartun (proyeksi ortografis), tanpa batas negara/rute ----------
  const BENUA = {
    amerikaUtara: [[-165, 65], [-140, 70], [-110, 72], [-85, 70], [-65, 60], [-55, 50], [-70, 44], [-76, 35], [-81, 25], [-90, 29], [-97, 26], [-97, 19], [-88, 15], [-83, 9], [-79, 8], [-95, 16], [-106, 22], [-112, 30], [-118, 34], [-124, 41], [-124, 48], [-135, 57], [-150, 60], [-165, 60]],
    amerikaSelatan: [[-80, 9], [-72, 12], [-62, 10], [-50, 0], [-35, -6], [-38, -14], [-41, -22], [-48, -26], [-58, -36], [-66, -45], [-68, -54], [-73, -50], [-73, -38], [-71, -28], [-70, -18], [-76, -14], [-81, -6], [-80, 0]],
    afrika: [[-17, 21], [-10, 30], [-5, 36], [10, 37], [20, 32], [32, 31], [35, 25], [43, 12], [51, 12], [42, -2], [40, -15], [35, -24], [27, -34], [19, -34], [13, -20], [12, -6], [9, 4], [-5, 5], [-15, 11]],
    eurasia: [[-10, 36], [-9, 43], [-2, 48], [-5, 58], [10, 64], [25, 71], [60, 70], [100, 76], [140, 72], [170, 66], [160, 58], [140, 55], [135, 43], [122, 38], [121, 30], [110, 20], [106, 10], [100, 14], [98, 8], [92, 22], [80, 15], [77, 8], [72, 20], [60, 25], [52, 27], [44, 13], [35, 30], [28, 37], [20, 40], [10, 44], [3, 43]],
    nusantara: [[95, 5], [104, 1], [106, -6], [114, -8], [119, -9], [125, -9], [134, -4], [141, -3], [141, -9], [131, -1], [120, -1], [118, 5], [110, 2], [104, -4], [98, 2]],
    australia: [[114, -22], [122, -18], [131, -12], [137, -12], [142, -11], [146, -19], [153, -26], [151, -34], [145, -38], [138, -35], [130, -32], [118, -35], [114, -30]],
  };
  function globeKartun(x, y, r, t = 0, o = {}) {
    const lon0 = o.lon ?? 0, lat0 = o.lat ?? 12, sr = cl(o.sorot || 0), id = uid("gb"), cp = uid("gc");
    const L0 = (lat0 * Math.PI) / 180;
    const proj = ([lo, la]) => { const l = ((lo - lon0) * Math.PI) / 180, p = (la * Math.PI) / 180; const cx = Math.cos(p) * Math.sin(l), cy = Math.cos(L0) * Math.sin(p) - Math.sin(L0) * Math.cos(p) * Math.cos(l), cz = Math.sin(L0) * Math.sin(p) + Math.cos(L0) * Math.cos(p) * Math.cos(l);
      if (cz < 0) { const n = Math.hypot(cx, cy) || 1; return [(cx / n) * r, (-cy / n) * r]; } return [cx * r, -cy * r]; };
    let isi = "";
    for (const [nm, pts] of Object.entries(BENUA)) {
      const am = nm.startsWith("amerika"), vis = pts.some(([lo, la]) => { const l = ((lo - lon0) * Math.PI) / 180, p = (la * Math.PI) / 180; return Math.sin(L0) * Math.sin(p) + Math.cos(L0) * Math.cos(p) * Math.cos(l) > 0; });
      if (!vis) continue;
      const d = "M" + pts.map((q) => proj(q).map(f1).join(" ")).join(" L") + "Z";
      const warna = am && sr > 0 ? mix("#6FA860", "#B8D84A", sr) : "#6FA860";
      isi += `<path d="${d}" fill="${warna}" stroke="${warna}" stroke-width="10" stroke-linejoin="round"/>`;
      if (am && sr > 0) isi += `<path d="${d}" fill="none" stroke="#FFE08A" stroke-width="${f1(4 + sr * 6)}" stroke-linejoin="round" opacity="${f2(sr * 0.8)}"/>`;
    }
    return `<g transform="translate(${f1(x)} ${f1(y)})"><defs><clipPath id="${cp}"><circle r="${r}"/></clipPath><radialGradient id="${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7EC8E8"/><stop offset="1" stop-color="#2E6EA0"/></radialGradient></defs>
      <ellipse cx="0" cy="${f1(r * 1.08)}" rx="${f1(r * 0.8)}" ry="${f1(r * 0.1)}" fill="#000" opacity=".25"/><circle r="${r}" fill="url(#${id})"/><g clip-path="url(#${cp})">${isi}</g>
      <circle r="${r}" fill="none" stroke="#FFFFFF" stroke-width="6" opacity=".25"/><ellipse cx="${f1(-r * 0.35)}" cy="${f1(-r * 0.4)}" rx="${f1(r * 0.28)}" ry="${f1(r * 0.16)}" fill="#FFFFFF" opacity=".22" transform="rotate(-30 ${f1(-r * 0.35)} ${f1(-r * 0.4)})"/></g>`;
  }

  // ---------- naskah daun lontar (coretan hiasan, tak terbaca) ----------
  function lontarNaskah(x, y, s, t = 0, o = {}) {
    const b = cl(o.buka ?? 1), gm = cl(o.gambar || 0), W = 160 + 620 * b;
    let s1 = "";
    for (let i = 0; i < 4; i++) { const yy = -120 + i * 70; s1 += `<rect x="${f1(-W / 2)}" y="${yy}" width="${f1(W)}" height="56" rx="28" fill="${i % 2 ? "#D9B878" : "#E2C488"}"/><rect x="${f1(-W / 2)}" y="${yy + 40}" width="${f1(W)}" height="16" rx="8" fill="#B8945A" opacity=".5"/>`;
      if (b > 0.3) { let d = `M${f1(-W / 2 + 60)} ${yy + 28}`; for (let k = 0; k < Math.floor((W - 200) / 34); k++) d += ` q8 -14 17 0 t17 0`; s1 += `<path d="${d}" stroke="#5A3A1E" stroke-width="4" fill="none" opacity="${f2(0.55 * cl((b - 0.3) / 0.7))}"/>`; } }
    s1 += `<circle cx="${f1(-W * 0.3)}" cy="-30" r="10" fill="#5A3A1E"/><circle cx="${f1(W * 0.3)}" cy="-30" r="10" fill="#5A3A1E"/><path d="M${f1(-W * 0.3)} -30 Q${f1(-W * 0.3 - 40)} 180 ${f1(-W * 0.3 - 10)} 220" stroke="#8A3A2A" stroke-width="6" fill="none"/>`;
    s1 += `<rect x="${f1(-W / 2 - 40)}" y="-140" width="40" height="300" rx="14" fill="#6A4A2A"/><rect x="${f1(W / 2)}" y="-140" width="40" height="300" rx="14" fill="#6A4A2A"/>`;
    if (gm > 0) s1 += `<g opacity="${f2(gm)}"><ellipse cx="${f1(W * 0.12)}" cy="-20" rx="120" ry="110" fill="#FFE08A" opacity="${f2(0.35 + 0.15 * Math.sin(t * 4))}"/><rect x="${f1(W * 0.12 - 70)}" y="-110" width="140" height="190" rx="18" fill="#EED3A0"/>${cabaiJawa(W * 0.12, -96, 0.62, { rot: 18 })}</g>`;
    return g(x, y, s, s1);
  }

  // ---------- lapak jamu pinggir jalan (siang), botol polos ----------
  function botolJamu(x, y, s, o = {}) {
    const c = o.isi || "#E2A82A";
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="42" ry="8" fill="#000" opacity=".18"/><path d="M-36 0 L-36 -120 Q-36 -150 -14 -160 L-14 -190 L14 -190 L14 -160 Q36 -150 36 -120 L36 0Z" fill="#E6F0EA" opacity=".55"/>
      <path d="M-32 -4 L-32 -110 L32 -110 L32 -4Z" fill="${c}"/><rect x="-16" y="-210" width="32" height="24" rx="6" fill="#8A6A4A"/><rect x="-26" y="-100" width="10" height="86" rx="5" fill="#FFF" opacity=".45"/>`);
  }
  function bakul(x, y, s) { let a = ""; for (let i = 0; i < 6; i++) a += `<path d="M-120 ${-20 - i * 18} Q0 ${-10 - i * 18} 120 ${-20 - i * 18}" stroke="#A8844A" stroke-width="6" fill="none"/>`;
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="130" ry="14" fill="#000" opacity=".18"/><path d="M-130 -130 L-100 0 L100 0 L130 -130Z" fill="#C8A060"/>${a}<ellipse cx="0" cy="-130" rx="130" ry="20" fill="#B88E50"/>`); }
  function lapakJamu(w, h, P, t = 0, o = {}) {
    const my = o.meja ?? h * 0.64;
    let s = A.langit(P, w, h, t, { suryaX: w * 0.85, suryaY: h * 0.1 });
    s += `<rect x="0" y="${my - 260}" width="${w}" height="${h}" fill="#CFC3A8"/><rect x="0" y="${my + 220}" width="${w}" height="${h}" fill="#8A8A86"/>`;
    for (let i = 0; i < w / 160 + 1; i++) s += `<rect x="${i * 160}" y="${my - 260}" width="150" height="80" fill="#BFB398"/>`;
    // terpal bergaris hijau-krem
    for (let i = 0; i < w / 120 + 1; i++) s += `<path d="M${i * 120} 300 L${i * 120 + 120} 300 L${i * 120 + 120} 440 Q${i * 120 + 60} 480 ${i * 120} 440Z" fill="${i % 2 ? "#F2E8CF" : "#3E7A5A"}"/>`;
    s += `<rect x="0" y="280" width="${w}" height="24" fill="#2E5A44"/>`;
    [60, w - 90].forEach((xx) => s += `<rect x="${xx}" y="300" width="30" height="${my - 300 + 300}" fill="#7A5A3A"/>`);
    // rak dua tingkat
    s += `<rect x="80" y="${my - 330}" width="${w - 160}" height="20" fill="#8A5A34"/>`;
    s += `<path d="M20 ${my} L${w - 20} ${my} L${w - 40} ${my + 300} L40 ${my + 300}Z" fill="#9A6A3E"/><rect x="20" y="${my}" width="${w - 40}" height="22" fill="#B88050"/>`;
    const isi = ["#E2A82A", "#7A4A2A", "#A8B83A", "#E2C46A", "#5A3A24", "#D8892A"];
    for (let i = 0; i < Math.floor((w - 200) / 110); i++) s += botolJamu(150 + i * 110, my - 330, 0.78, { isi: isi[i % isi.length] });
    s += A.redup ? "" : "";
    return s;
  }
  function podium(x, y, s, o = {}) {
    const c = o.warna || "#2F6A50", tg = o.tinggi || 160;
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="170" ry="20" fill="#000" opacity=".25"/><rect x="-150" y="${-tg}" width="300" height="${tg}" rx="10" fill="${c}"/><rect x="-150" y="${-tg}" width="300" height="22" rx="10" fill="#FFFFFF" opacity=".18"/><rect x="60" y="${-tg}" width="90" height="${tg}" rx="10" fill="#000" opacity=".15"/>`);
  }
  // tangan tanpa wajah (lengan dari tepi layar). genggam: tangan mengepal (memegang sesuatu)
  function tanganPolos(x0, y0, x1, y1, o = {}) {
    const k = o.kulit || "#D9A276", l = o.lengan || "#3E6A5A", a = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
    return `<path d="M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}" stroke="${l}" stroke-width="70" stroke-linecap="round"/><g transform="translate(${f1(x1)} ${f1(y1)}) rotate(${f1(a)})"><ellipse cx="18" cy="0" rx="48" ry="40" fill="${k}"/>${o.genggam ? `<path d="M30 -30 Q60 -26 58 0 Q60 26 30 30" fill="${k}"/>` : [-24, -8, 8, 24].map((q) => `<path d="M40 ${q * 0.8} L78 ${q * 1.2}" stroke="${k}" stroke-width="17" stroke-linecap="round"/>`).join("")}<path d="M10 -36 Q30 -62 52 -48" stroke="${k}" stroke-width="18" fill="none" stroke-linecap="round"/></g>`;
  }

  Object.assign(A, { cabaiJawa, untaianCabya, tungkuTanah, gerabah, dapurJawaKuno, labelKayu, koper, lampuGantung, piringNasi, gelasTeh, mejaMakanMalam, globeKartun, lontarNaskah, botolJamu, bakul, lapakJamu, podium, tanganPolos, warnaCampur: mix });
})(typeof window !== "undefined" ? window : globalThis);
