/* ASET DAPUR LISTRIK — rice cooker & saklar magnet (Yoga, 21 Nov 2026; dipakai A-02 "Rice cooker kok bisa mati sendiri?"). Muat SETELAH aset-set.js.
 * Datar tanpa garis hitam, generik tanpa merek/tulisan. Semua fungsi → potongan SVG (string).
 *  riceCooker(x,y,s,t,{tuas 0 bawah=masak..1 atas=lepas, lampu 0 masak(oranye)..1 hangat(kuning), uap, xray, air, nasi, panas, didih, gerak (garis gerak tuas)}) — (x,y)=dasar tengah, tinggi ±430·s
 *  makroSaklar(w,h,t,{panas, gelombang, medan, acak, lepas, tegang, kamera}) — penampang bawah panci: pelat pemanas, keping ferit (panah domain), magnet, pegas tarik, tuas
 *  tetesDetektif(x,y,s,t,{silang,uap,lambai,mata}) · chipKomputer(x,y,s,t,{kedip}) · papanSirkuit(x,y,s,t,{kedip}) · riceCookerCanggih(x,y,s,t,{xray})
 *  etalaseMalam(w,h,t) · centong(x,y,s,rot) · panahPanas(x,y,s,t,a) · ikonPegas(x,y,s) · ikonMagnet(x,y,s) · ikonTetes(x,y,s,{kosong}) */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let _n = 0; const uid = (p) => `${p}d${++_n}`;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;
  const mix = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16)); const A1 = p(a), B1 = p(b); k = cl(k); return "#" + A1.map((v, i) => Math.round(v + (B1[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
  const GRAF = "#34363C", GRAF2 = "#24262B", KRIM = "#F4EEE2", MENTEGA = "#F6E3A1";

  function uapKepul(x, y, s, t, k, n = 4) {
    if (k <= 0) return ""; let o = "";
    for (let i = 0; i < n; i++) { const u = (t * 0.7 + i / n) % 1; o += `<circle cx="${f1(x + Math.sin(u * 5 + i) * 30 * s)}" cy="${f1(y - u * 300 * s)}" r="${f1((22 + u * 50) * s)}" fill="#FFFFFF" opacity="${f2(0.75 * k * Math.sin(Math.PI * u))}"/>`; }
    return o;
  }
  function riceCooker(x, y, s, t = 0, o = {}) {
    const xr = cl(o.xray || 0), tu = cl(o.tuas || 0), lp = cl(o.lampu ?? (tu > 0.5 ? 1 : 0)), air = cl(o.air ?? 0.8), nasi = cl(o.nasi ?? 0), pn = cl(o.panas || 0);
    const cp = uid("rc");
    let s1 = `<ellipse cx="0" cy="8" rx="260" ry="26" fill="#000" opacity=".2"/>`;
    // isi x-ray (digambar dulu, badan transparan di atasnya)
    if (xr > 0) {
      const dasar = -112, atas = -330, tinggiAir = air * 190, nasiT = 70 + nasi * 70;
      let isi = `<path d="M-186 ${atas} L-180 ${dasar + 8} Q-180 ${dasar + 18} -168 ${dasar + 18} L168 ${dasar + 18} Q180 ${dasar + 18} 180 ${dasar + 8} L186 ${atas}Z" fill="#C9CED6"/><path d="M-170 ${atas + 6} L-166 ${dasar + 6} L166 ${dasar + 6} L170 ${atas + 6}Z" fill="#E4E8EE"/>`;
      if (tinggiAir > 2) isi += `<rect x="-166" y="${f1(dasar + 6 - tinggiAir)}" width="332" height="${f1(tinggiAir)}" fill="#6EC3E8" opacity=".85"/><rect x="-166" y="${f1(dasar + 6 - tinggiAir)}" width="332" height="6" fill="#B8E6F8"/>`;
      const r = acak(7); for (let i = 0; i < 70; i++) { const gx = -150 + r() * 300, gy = dasar + 2 - r() * nasiT; isi += `<ellipse cx="${f1(gx)}" cy="${f1(gy)}" rx="${f1(9 + nasi * 4)}" ry="${f1(5 + nasi * 2.5)}" fill="#FFFFFF" transform="rotate(${f1(r() * 180)} ${f1(gx)} ${f1(gy)})" opacity=".95"/>`; }
      const dd = cl(o.didih || 0); if (dd > 0 && tinggiAir > 10) for (let i = 0; i < 12; i++) { const u = (t * 1.2 + i * 0.083) % 1, bx = -140 + ((i * 53) % 280); isi += `<circle cx="${bx}" cy="${f1(dasar - u * tinggiAir)}" r="${f1(5 + u * 7)}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="${f2(dd * (1 - u))}"/>`; }
      // pelat pemanas + termostat
      const pw = mix("#5A5C62", "#FF6A2A", pn);
      isi += `<rect x="-170" y="${dasar + 22}" width="340" height="22" rx="10" fill="${pw}"/>` + (pn > 0 ? `<rect x="-180" y="${dasar + 14}" width="360" height="38" rx="18" fill="#FF8A3A" opacity="${f2(pn * 0.35)}"/>` : "");
      isi += `<rect x="-26" y="${dasar + 20}" width="52" height="30" rx="6" fill="#6A625A"/><path d="M-10 ${dasar + 52} l20 8 l-20 8 l20 8 l-20 8" stroke="#B8BCC4" stroke-width="5" fill="none"/>`;
      s1 += `<g opacity="${f2(xr)}">${isi}</g>`;
    }
    const ob = 1 - xr * 0.82;
    s1 += `<g opacity="${f2(ob)}"><rect x="-226" y="-64" width="452" height="64" rx="18" fill="${GRAF}"/>
      <path d="M-222 -60 L-232 -296 Q-232 -312 -214 -314 L214 -314 Q232 -312 232 -296 L222 -60Z" fill="${KRIM}"/><path d="M120 -314 L214 -314 Q232 -312 232 -296 L222 -60 L150 -60Z" fill="#E2DACB"/>
      <path d="M-240 -306 Q-236 -408 0 -414 Q236 -408 240 -306Z" fill="#EAE3D5"/><path d="M80 -404 Q236 -398 240 -306 L150 -306Z" fill="#D9D0C0"/>
      <rect x="-70" y="-440" width="140" height="34" rx="16" fill="${GRAF}"/><circle cx="110" cy="-380" r="12" fill="${GRAF2}"/></g>`;
    // panel depan selalu tampak (tuas & lampu)
    const ly = -128 - tu * 84, op = f2(1 - xr * 0.8);
    s1 += `<g opacity="${op}"><rect x="-96" y="-276" width="192" height="196" rx="26" fill="${GRAF}"/><rect x="-14" y="-228" width="28" height="120" rx="14" fill="${GRAF2}"/>
      <circle cx="-44" cy="-252" r="13" fill="${mix("#5A4A3A", "#FF8A2A", 1 - lp)}"/><circle cx="44" cy="-252" r="13" fill="${mix("#5A5A3A", "#FFE27A", lp)}"/>
      ${(1 - lp) > 0.05 ? `<circle cx="-44" cy="-252" r="26" fill="#FF8A2A" opacity="${f2((1 - lp) * 0.35)}"/>` : ""}${lp > 0.05 ? `<circle cx="44" cy="-252" r="26" fill="#FFE27A" opacity="${f2(lp * 0.4)}"/>` : ""}
      <rect x="-64" y="${f1(ly - 24)}" width="128" height="48" rx="20" fill="${MENTEGA}"/><rect x="-64" y="${f1(ly + 8)}" width="128" height="16" rx="8" fill="#D8C27A"/></g>`;
    const gm = cl(o.gerak || 0); if (gm > 0) s1 += [-90, 90].map((gx) => `<path d="M${gx} ${f1(ly + 20)} L${gx} ${f1(ly + 90)}" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="${f2(gm * 0.8)}"/>`).join("") + `<path d="M-120 ${f1(ly + 10)} L-120 ${f1(ly + 60)} M120 ${f1(ly + 10)} L120 ${f1(ly + 60)}" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="${f2(gm * 0.5)}"/>`;
    s1 += uapKepul(110, -400, 1, t, cl(o.uap || 0));
    return g(x, y, s, s1);
  }

  // ---------- penampang bawah panci (1080 lebar acuan) ----------
  function panahDomain(x, y, sudut, w) { return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(sudut)})"><path d="M0 -18 L0 14 M-9 6 L0 18 L9 6" stroke="${w}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
  function makroSaklar(w, h, t = 0, o = {}) {
    const pn = cl(o.panas || 0), md = cl(o.medan ?? 1), ac = cl(o.acak || 0), lp = cl(o.lepas || 0), gl = cl(o.gelombang || 0), cx = o.cx ?? w / 2;
    const drop = lp * 130, id = uid("mk");
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A3E48"/><stop offset="1" stop-color="#1C1E24"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>`;
    // dinding rumah bagian dalam
    s += `<rect x="${cx - 470}" y="300" width="40" height="1100" rx="12" fill="#2A2C32"/><rect x="${cx + 430}" y="300" width="40" height="1100" rx="12" fill="#2A2C32"/>`;
    // dasar panci (perak) + nasi samar di atas
    s += `<path d="M${cx - 560} 180 L${cx + 560} 180 L${cx + 560} 360 Q${cx} 470 ${cx - 560} 360Z" fill="#B9BFC8"/><path d="M${cx - 560} 340 Q${cx} 452 ${cx + 560} 340 L${cx + 560} 362 Q${cx} 474 ${cx - 560} 362Z" fill="#8E949E"/>`;
    s += `<path d="M${cx - 560} 180 L${cx + 560} 180 L${cx + 560} 230 Q${cx} 300 ${cx - 560} 230Z" fill="#E9E4D8" opacity=".5"/>`;
    // pelat pemanas kiri-kanan (lubang di tengah untuk termostat)
    const pw = mix("#5A5C62", "#FF5A22", pn);
    s += `<path d="M${cx - 520} 372 Q${cx - 300} 430 ${cx - 140} 440 L${cx - 140} 486 Q${cx - 300} 476 ${cx - 520} 420Z" fill="${pw}"/><path d="M${cx + 520} 372 Q${cx + 300} 430 ${cx + 140} 440 L${cx + 140} 486 Q${cx + 300} 476 ${cx + 520} 420Z" fill="${pw}"/>`;
    if (pn > 0) s += `<ellipse cx="${cx - 320}" cy="430" rx="230" ry="50" fill="#FF7A2A" opacity="${f2(pn * 0.3)}"/><ellipse cx="${cx + 320}" cy="430" rx="230" ry="50" fill="#FF7A2A" opacity="${f2(pn * 0.3)}"/>`;
    // gelombang panas turun ke keping
    if (gl > 0) for (let i = 0; i < 5; i++) { const u = (t * 1.4 + i / 5) % 1, xx = cx - 100 + i * 50; s += `<path d="M${xx} ${f1(400 + u * 60)} q12 14 0 28 q-12 14 0 28" stroke="#FF5A3A" stroke-width="7" fill="none" stroke-linecap="round" opacity="${f2(gl * Math.sin(Math.PI * u))}"/>`; }
    // keping ferit (menempel di dasar panci)
    const kx = cx - 130, ky = 452;
    s += `<rect x="${kx - 10}" y="${ky - 14}" width="280" height="22" rx="8" fill="#7A7068"/><rect x="${kx}" y="${ky}" width="260" height="96" rx="18" fill="#5E5650"/><rect x="${kx}" y="${ky}" width="260" height="18" rx="9" fill="#7A706A"/>`;
    if (pn > 0.5 && gl > 0) s += `<rect x="${kx}" y="${ky}" width="260" height="96" rx="18" fill="#FF5A2A" opacity="${f2(gl * 0.25)}"/>`;
    const r = acak(5);
    for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) { const rr = r(); const sud = ac * (rr * 720 - 360 + Math.sin(t * (3 + rr * 4) + i) * 120 * ac); s += panahDomain(kx + 30 + i * 50, ky + 34 + j * 36, sud, ac > 0.3 ? "#FFB27A" : "#9FD8FF"); }
    // magnet (melekat di bawah keping, jatuh saat lepas)
    const my = ky + 100 + drop;
    s += `<rect x="${kx + 20}" y="${my}" width="220" height="86" rx="14" fill="#C8433A"/><rect x="${kx + 20}" y="${my + 58}" width="220" height="28" rx="12" fill="#8E9AA8"/><rect x="${kx + 34}" y="${my + 8}" width="60" height="12" rx="6" fill="#FFFFFF" opacity=".3"/>`;
    // garis medan biru (keping ↔ magnet)
    if (md > 0) { const fl = md * (0.75 + 0.25 * Math.sin(t * 9)) * (ac > 0.5 ? (Math.sin(t * 31) > 0 ? 1 : 0.35) : 1);
      [[-1, 0], [1, 0]].forEach(([sg]) => { for (let k = 0; k < 3; k++) { const ex = sg < 0 ? kx - 10 - k * 34 : kx + 270 + k * 34, sx = sg < 0 ? kx + 10 : kx + 250;
        s += `<path d="M${sx} ${ky + 50} Q${ex} ${ky + 90 + drop / 2} ${sx} ${my + 50}" stroke="#5FB8FF" stroke-width="${7 - k * 1.5}" fill="none" stroke-linecap="round" opacity="${f2(fl * (0.9 - k * 0.2))}"/>`; } });
      s += `<rect x="${kx + 10}" y="${ky + 40}" width="240" height="${f1(my - ky - 10)}" rx="20" fill="#5FB8FF" opacity="${f2(fl * 0.14)}"/>`; }
    // batang + pegas tarik + tuas
    const rodY0 = my + 86, rodY1 = 900 + drop, anchor = 1250;
    s += `<rect x="${cx - 14}" y="${rodY0}" width="28" height="${f1(rodY1 - rodY0)}" rx="10" fill="#9AA2AE"/>`;
    const n = 12, L = anchor - rodY1 - 30, tg = cl(o.tegang ?? (1 - lp)), get = tg * Math.sin(t * 40) * 3;
    let d = `M${cx} ${rodY1}`; for (let i = 0; i < n; i++) d += ` L${f1(cx + (i % 2 ? -46 : 46) + get)} ${f1(rodY1 + 15 + (i + 0.5) * (L / n))}`; d += ` L${cx} ${anchor - 15}`;
    s += `<path d="${d}" stroke="#D9DEE6" stroke-width="10" fill="none" stroke-linejoin="round"/><rect x="${cx - 90}" y="${anchor - 15}" width="180" height="30" rx="10" fill="#5A5E66"/>`;
    // lengan tuas: poros di (cx-260, 900); ujung kanan ikut batang, ujung kiri (pegangan) naik saat batang turun
    const pv = [cx - 260, 900], ang = Math.atan2(rodY1 - pv[1], cx - pv[0]), ex = pv[0] - Math.cos(ang) * 200, ey = pv[1] - Math.sin(ang) * 200;
    s += `<path d="M${f1(ex)} ${f1(ey)} L${cx} ${f1(rodY1)}" stroke="#7A808A" stroke-width="26" stroke-linecap="round"/><circle cx="${pv[0]}" cy="${pv[1]}" r="20" fill="#2A2C32" stroke="#9AA2AE" stroke-width="6"/>`;
    s += `<rect x="${f1(ex - 70)}" y="${f1(ey - 26)}" width="110" height="52" rx="22" fill="${MENTEGA}" transform="rotate(${f1((ang * 180) / Math.PI)} ${f1(ex)} ${f1(ey)})"/>`;
    return s;
  }

  function tetesDetektif(x, y, s, t = 0, o = {}) {
    const sl = cl(o.silang || 0), up = cl(o.uap || 0), lb = cl(o.lambai || 0), geleng = sl * Math.sin(t * 8) * 6;
    const badan = `<path d="M0 -150 Q60 -60 62 -10 Q62 50 0 52 Q-62 50 -62 -10 Q-60 -60 0 -150Z" fill="#6EC3E8"/><path d="M-30 -60 Q-44 -20 -36 10" stroke="#FFFFFF" stroke-width="8" fill="none" stroke-linecap="round" opacity=".6"/>`;
    const topi = `<path d="M-46 -84 Q0 -130 46 -84 Z" fill="#8A6A44"/><rect x="-56" y="-88" width="112" height="12" rx="6" fill="#6A4E30"/><path d="M40 -86 l26 -6 l-4 12z" fill="#6A4E30"/>`;
    const mt = A.mata(0, -16, 0.42, sl > 0.5 ? "marah" : "senang", geleng / 10);
    const tangan = sl > 0.5 ? `<path d="M-50 22 Q0 0 50 22" stroke="#4FA8D0" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M-50 36 Q0 14 50 36" stroke="#4FA8D0" stroke-width="16" fill="none" stroke-linecap="round"/>`
      : `<path d="M58 0 Q86 ${f1(-10 - lb * 50 + Math.sin(t * 12) * 12 * lb)} 96 ${f1(-30 - lb * 60)}" stroke="#4FA8D0" stroke-width="14" fill="none" stroke-linecap="round"/>${lb < 0.5 ? `<circle cx="112" cy="-52" r="26" fill="none" stroke="#6A4E30" stroke-width="8"/><circle cx="112" cy="-52" r="22" fill="#DFF4FF" opacity=".5"/>` : ""}<path d="M-58 0 Q-80 20 -84 36" stroke="#4FA8D0" stroke-width="14" fill="none" stroke-linecap="round"/>`;
    return `<g opacity="${f2(1 - up)}">` + g(x, y - up * 140, s * (1 - up * 0.5), `<g transform="rotate(${f1(geleng)})">${badan}${topi}${mt}${tangan}</g>`) + (up > 0 ? uapKepul(x, y - 40, s, t, up * 1.4, 3) : "") + `</g>`;
  }
  function chipKomputer(x, y, s, t = 0, o = {}) {
    const kd = o.kedip ? 0.5 + 0.5 * Math.sin(t * 9) : 0;
    let pin = ""; for (let i = 0; i < 4; i++) { const p = -45 + i * 30; pin += `<rect x="${p - 5}" y="-82" width="10" height="20" rx="3" fill="#C9CED6"/><rect x="${p - 5}" y="62" width="10" height="20" rx="3" fill="#C9CED6"/><rect x="-82" y="${p - 5}" width="20" height="10" rx="3" fill="#C9CED6"/><rect x="62" y="${p - 5}" width="20" height="10" rx="3" fill="#C9CED6"/>`; }
    return g(x, y, s, `${pin}<rect x="-64" y="-64" width="128" height="128" rx="14" fill="#2A2C34"/><rect x="-46" y="-46" width="92" height="92" rx="8" fill="#3A3E4A"/><circle cx="30" cy="-30" r="9" fill="#5FFFB0" opacity="${f2(0.4 + 0.6 * kd)}"/><circle cx="30" cy="-30" r="22" fill="#5FFFB0" opacity="${f2(0.25 * kd)}"/><path d="M-30 10 L0 10 L0 30 L24 30" stroke="#6A7080" stroke-width="5" fill="none"/>`);
  }
  function papanSirkuit(x, y, s, t = 0, o = {}) {
    let jalur = ""; const r = acak(9); for (let i = 0; i < 9; i++) { const yy = -110 + i * 26; jalur += `<path d="M-180 ${yy} L${f1(-60 + r() * 40)} ${yy} L${f1(-30 + r() * 40)} ${f1(yy + 14)} L180 ${f1(yy + 14)}" stroke="#7ED8A0" stroke-width="4" fill="none" opacity=".6"/>`; }
    return g(x, y, s, `<rect x="-200" y="-140" width="400" height="280" rx="18" fill="#2E7A52"/>${jalur}${chipKomputer(0, 0, 0.9, t, { kedip: o.kedip })}<rect x="-170" y="70" width="60" height="30" rx="6" fill="#1E2A30"/><rect x="110" y="-120" width="40" height="40" rx="20" fill="#C8A040"/>`);
  }
  function riceCookerCanggih(x, y, s, t = 0, o = {}) {
    const xr = cl(o.xray || 0);
    return g(x, y, s, `<ellipse cx="0" cy="8" rx="250" ry="24" fill="#000" opacity=".25"/>
      <g opacity="${f2(1 - xr * 0.75)}"><path d="M-226 0 Q-246 -200 -220 -330 Q-200 -400 0 -404 Q200 -400 220 -330 Q246 -200 226 0Z" fill="#3A3E48"/><path d="M80 -400 Q200 -396 220 -330 Q246 -200 226 0 L150 0Z" fill="#2A2E36"/><path d="M-220 -320 Q0 -360 220 -320" stroke="#9AA2AE" stroke-width="6" fill="none"/></g>
      <rect x="-120" y="-250" width="240" height="120" rx="20" fill="#1A1E26"/><rect x="-104" y="-236" width="208" height="70" rx="10" fill="#5FD8E8" opacity="${f2(0.55 + 0.15 * Math.sin(t * 3))}"/><circle cx="-60" cy="-148" r="10" fill="#9AA2AE"/><circle cx="0" cy="-148" r="10" fill="#9AA2AE"/><circle cx="60" cy="-148" r="10" fill="#9AA2AE"/>
      ${xr > 0 ? `<g opacity="${f2(xr)}">${papanSirkuit(0, -90, 0.55, t, { kedip: 1 })}</g>` : ""}`);
  }
  function etalaseMalam(w, h, t = 0) {
    let s = `<rect width="${w}" height="${h}" fill="#141C30"/><rect y="${h * 0.66}" width="${w}" height="${h * 0.34}" fill="#0E1424"/>`;
    for (let i = 0; i < 6; i++) { const x = 100 + i * (w - 200) / 5; s += `<path d="M${x} 0 L${x - 160} ${h * 0.66} L${x + 160} ${h * 0.66}Z" fill="#6FA8FF" opacity=".06"/><rect x="${x - 40}" y="0" width="80" height="20" rx="6" fill="#9FC8FF" opacity=".6"/>`; }
    [520, 1020].forEach((yy) => { s += `<rect x="0" y="${yy}" width="${w}" height="26" fill="#2A3450"/><rect x="0" y="${yy + 26}" width="${w}" height="8" fill="#000" opacity=".3"/>`; for (let i = 0; i < w / 220; i++) s += `<rect x="${40 + i * 220}" y="${yy - 150}" width="${130 + (i % 3) * 20}" height="150" rx="10" fill="${["#3A4A6A", "#2E3C5A", "#44506E"][i % 3]}"/>`; });
    s += `<rect x="0" y="${h * 0.66}" width="${w}" height="30" fill="#2A3450"/>`;
    for (let i = 0; i < 3; i++) s += `<path d="M${f1(((t * 40 + i * 600) % (w + 400)) - 200)} 0 l120 0 l-300 ${h} l-120 0Z" fill="#FFFFFF" opacity=".035"/>`;
    return s;
  }
  function centong(x, y, s, rot = 0) { return g(x, y, s, `<rect x="-12" y="-200" width="24" height="170" rx="12" fill="#F4F0E8"/><ellipse cx="0" cy="0" rx="56" ry="70" fill="#F4F0E8"/><ellipse cx="-14" cy="-10" rx="18" ry="30" fill="#FFFFFF" opacity=".7"/><ellipse cx="0" cy="6" rx="48" ry="58" fill="none" stroke="#DDD6C8" stroke-width="4"/>`, rot); }
  function ikonTetes(x, y, s, o = {}) { return g(x, y, s, o.kosong ? `<path d="M0 -70 Q44 -10 44 20 Q44 60 0 60 Q-44 60 -44 20 Q-44 -10 0 -70Z" fill="none" stroke="#6EC3E8" stroke-width="10" stroke-dasharray="14 10"/>` : `<path d="M0 -70 Q44 -10 44 20 Q44 60 0 60 Q-44 60 -44 20 Q-44 -10 0 -70Z" fill="#6EC3E8"/><path d="M-18 0 Q-24 20 -16 36" stroke="#FFF" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>`); }
  function ikonPegas(x, y, s) { let d = "M0 -70"; for (let i = 0; i < 8; i++) d += ` L${i % 2 ? -36 : 36} ${-56 + i * 16}`; d += " L0 70"; return g(x, y, s, `<path d="${d}" stroke="#D9DEE6" stroke-width="12" fill="none" stroke-linejoin="round"/>`); }
  function ikonMagnet(x, y, s) { return g(x, y, s, `<path d="M-50 -60 L-50 10 Q-50 60 0 60 Q50 60 50 10 L50 -60 L22 -60 L22 10 Q22 30 0 30 Q-22 30 -22 10 L-22 -60Z" fill="#C8433A"/><rect x="-50" y="-60" width="28" height="26" fill="#C9CED6"/><rect x="22" y="-60" width="28" height="26" fill="#C9CED6"/>`); }
  function panahPanas(x, y, s, t, a = 1) { const u = (t * 1.5) % 1; return g(x, y - u * 40 * s, s, `<path d="M0 30 L0 -40 M-22 -18 L0 -42 L22 -18" stroke="#FF7A2A" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${f2(a * Math.sin(Math.PI * u))}"/>`); }

  Object.assign(A, { riceCooker, makroSaklar, tetesDetektif, chipKomputer, papanSirkuit, riceCookerCanggih, etalaseMalam, centong, ikonTetes, ikonPegas, ikonMagnet, panahPanas, uapKepul });
})(typeof window !== "undefined" ? window : globalThis);
