/* ASET LAYAR SENTUH (Yoga, 23 Nov 2026; dipakai A3-06 "Kenapa layar HP error saat tangan basah?"). Muat SETELAH aset-set.js.
 * Gaya: datar tanpa garis hitam, dunia indigo + kisi cyan, teks hanya lewat kode. HP generik: tanpa merek, tanpa logo, tanpa poni.
 *  proyeksi({cx,cy,rot,tilt,f,jarak,skala}) → p(u,v,h) = [X,Y,k] — proyeksi perspektif bidang layar (u kanan, v ke jauh, h ke kamera)
 *  slabLayar(p,t,{W,H,tebal,kisi,sentuh:[{u,v,r,k}],sedot:[{u,v,r,k}],cincin:[{u,v,k}],target:[{u,v,k,r}],wajah:{u,v,r,k,siul},
 *            kaca,sinar,badan}) — penampang x-ray: badan HP, kisi kabel bening + simpul berpendar (redup di titik sentuh), kaca atas
 *  tetesKaca(x,y,r,t,{goyang,sidik,glow,mata}) — tetes air di atas kaca (kubah) · genangan(x,y,s,t,{n}) — beberapa tetes berdempet
 *  kartuKuis(x,y,s,jenis 'tekanan'|'panas'|'listrik',{k,coret,nyala,redup,rot,teks}) · petir(x,y,s,k)
 *  jariHantu(x,y,s,t,{k}) — ujung jari kartun melayang berekor hantu (lucu, bukan seram)
 *  tanganAkuarium(x,y,s,t,{listrik,k}) — siluet tangan menunjuk berisi air bergoyang + percik cyan mengalir
 *  hpGenerik(x,y,s,t,{rot,gulir,basah,tekan,isi}) — HP polos (UI kartun tanpa huruf) · tanganPegangHP(x,y,s,t,{basah,gulir,hantu})
 *  dapurMalam(w,h,t,{bakX,jendelaX,lampu}) — dapur rumah malam, bak cuci + keran mengalir + rak piring, lampu hangat
 *  manusiaTetes(x,y,s,t,{hp}) — siluet tetes air bertangan memegang HP (canda) · miniWudu(x,y,s,t) · miniHujan(x,y,s,t) (panel kartu pilihan) */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let _n = 0; const uid = (p) => `${p}L${++_n}`;
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;
  const CY = "#3FF0FF", CYL = "#B8FBFF", IND = "#1A1748", IND2 = "#2A2670", KUL = "#EDB58D", KULG = "#D99A72", KULS = "#F8CFAE";
  const C = { CY, CYL, IND, IND2 };

  // ---------- proyeksi perspektif bidang layar ----------
  function proyeksi(o = {}) {
    const a = ((o.rot || 0) * Math.PI) / 180, b = ((o.tilt ?? 50) * Math.PI) / 180, f = o.f || 1700, D = o.jarak || 1700, sk = o.skala || 1, cx = o.cx ?? 540, cy = o.cy ?? 960;
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    return (u, v, h = 0) => {
      const x = u * ca - v * sa, y = u * sa + v * ca, z = D + y * sb - h * cb, k = (f / z) * sk;
      return [cx + x * k, cy - (y * cb + h * sb) * k, k];
    };
  }
  const poli = (p, pts, h) => pts.map(([u, v]) => { const q = p(u, v, h); return `${f1(q[0])},${f1(q[1])}`; }).join(" ");
  const lingkar = (p, u, v, r, h, n = 36) => { const a = []; for (let i = 0; i <= n; i++) { const t = (i / n) * Math.PI * 2; a.push([u + r * Math.cos(t), v + r * Math.sin(t)]); } return poli(p, a, h); };

  // ---------- penampang layar x-ray ----------
  function slabLayar(p, t = 0, o = {}) {
    const W = o.W || 700, H = o.H || 1300, tb = o.tebal || 70, gh = -26, sp = o.kisi || 100, id = uid("sl");
    const sudut = [[-W / 2, -H / 2], [W / 2, -H / 2], [W / 2, H / 2], [-W / 2, H / 2]];
    let s = `<defs><radialGradient id="${id}n"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="${CY}"/><stop offset="1" stop-color="${CY}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}k" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#CFFBFF" stop-opacity=".30"/><stop offset=".5" stop-color="#7FE8FF" stop-opacity=".10"/><stop offset="1" stop-color="#CFFBFF" stop-opacity=".22"/></linearGradient></defs>`;
    // badan HP (bawah + sisi)
    if (o.badan !== 0) {
      s += `<polygon points="${poli(p, sudut, -tb)}" fill="#0C0A2A"/>`;
      for (let i = 0; i < 4; i++) { const a = sudut[i], b = sudut[(i + 1) % 4]; s += `<polygon points="${poli(p, [a, b], -tb)} ${poli(p, [b, a], 0)}" fill="${i % 2 ? "#221E5E" : "#2C2878"}"/>`; }
      s += `<polygon points="${poli(p, sudut, -8)}" fill="#141140"/>`;
    }
    // kisi kabel bening
    const nu = Math.floor(W / sp / 2), nv = Math.floor(H / sp / 2);
    const redup = (u, v) => { let d = 1; for (const q of o.sentuh || []) { const r = q.r || 150, e = Math.exp(-((u - q.u) ** 2 + (v - q.v) ** 2) / (r * r)); d *= 1 - cl(q.k ?? 1) * 0.78 * e; } return d; };
    let garis = "";
    for (let i = -nu; i <= nu; i++) { const a = p(i * sp, -H / 2 + 20, gh), b = p(i * sp, H / 2 - 20, gh); garis += `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`; }
    for (let j = -nv; j <= nv; j++) { const a = p(-W / 2 + 20, j * sp, gh), b = p(W / 2 - 20, j * sp, gh); garis += `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`; }
    const ka = o.kisiA ?? 1;
    s += `<g stroke="${CY}" stroke-width="${f1(3 * p(0, 0, 0)[2] + 1)}" opacity="${f2(0.42 * ka)}">${garis}</g>`;
    // cincin medan (merambat turun dari benda di kaca ke kisi)
    for (const q of o.cincin || []) { const k = cl(q.k ?? 1); if (k <= 0) continue; for (let i = 0; i < 3; i++) { const u = (t * 0.7 + i / 3) % 1, r = 30 + u * (q.r || 190), h = lerpH(0, gh, u); s += `<polygon points="${lingkar(p, q.u, q.v, r, h)}" fill="none" stroke="${CY}" stroke-width="${f1(6 * p(q.u, q.v, 0)[2])}" opacity="${f2(k * 0.75 * (1 - u))}"/>`; } }
    // simpul berpendar
    const wj = o.wajah;
    for (let i = -nu; i <= nu; i++) for (let j = -nv; j <= nv; j++) {
      const u = i * sp, v = j * sp, [X, Y, k] = p(u, v, gh), d = redup(u, v), kel = 0.78 + 0.22 * Math.sin(t * 3 + i * 1.7 + j * 2.3);
      s += `<circle cx="${f1(X)}" cy="${f1(Y)}" r="${f1(30 * k * (0.55 + 0.45 * d))}" fill="url(#${id}n)" opacity="${f2(ka * kel * (0.25 + 0.75 * d))}"/>`;
      if (wj && cl(wj.k ?? 1) > 0) { const dd = Math.hypot(u - wj.u, v - wj.v); if (dd < (wj.r || 260) && dd > 1) { const kk = cl(wj.k ?? 1), ex = ((u - wj.u) / dd) * 5 * kk * k, ey = -((v - wj.v) / dd) * 5 * kk * k; s += `<g opacity="${f2(kk)}"><circle cx="${f1(X - 8 * k)}" cy="${f1(Y - 2 * k)}" r="${f1(6 * k)}" fill="#FFFFFF"/><circle cx="${f1(X + 8 * k)}" cy="${f1(Y - 2 * k)}" r="${f1(6 * k)}" fill="#FFFFFF"/><circle cx="${f1(X - 8 * k + ex)}" cy="${f1(Y - 2 * k + ey)}" r="${f1(3 * k)}" fill="${IND}"/><circle cx="${f1(X + 8 * k + ex)}" cy="${f1(Y - 2 * k + ey)}" r="${f1(3 * k)}" fill="${IND}"/><circle cx="${f1(X)}" cy="${f1(Y + 8 * k)}" r="${f1(2.6 * k)}" fill="${IND}"/></g>`; } }
    }
    // not musik bersiul
    if (wj && wj.siul > 0) for (let i = 0; i < 3; i++) { const u = (t * 0.5 + i / 3) % 1, [X, Y, k] = p(wj.u + 160 + i * 40, wj.v + 60, gh); s += `<g transform="translate(${f1(X + u * 60)} ${f1(Y - u * 160)}) scale(${f2(k * 1.2)})" opacity="${f2(wj.siul * Math.sin(Math.PI * u))}"><ellipse cx="0" cy="0" rx="11" ry="8" fill="#FFF4DC" transform="rotate(-20)"/><rect x="8" y="-42" width="5" height="42" fill="#FFF4DC"/><path d="M13 -42 q16 6 14 22" stroke="#FFF4DC" stroke-width="5" fill="none"/></g>`; }
    // aliran "sedot": butir cahaya naik dari simpul ke benda
    for (const q of o.sedot || []) { const k = cl(q.k ?? 1); if (k <= 0) continue; for (let i = -nu; i <= nu; i++) for (let j = -nv; j <= nv; j++) { const u = i * sp, v = j * sp, dd = Math.hypot(u - q.u, v - q.v); if (dd > (q.r || 160)) continue; for (let n = 0; n < 2; n++) { const w = (t * 1.4 + n / 2 + (i * 7 + j * 3) * 0.13) % 1, P2 = p(lerpH(u, q.u, w), lerpH(v, q.v, w), lerpH(gh, 4, w)); s += `<circle cx="${f1(P2[0])}" cy="${f1(P2[1])}" r="${f1(8 * P2[2])}" fill="${CYL}" opacity="${f2(k * Math.sin(Math.PI * w))}"/>`; } } }
    // kaca atas
    if (o.kaca !== 0) {
      s += `<polygon points="${poli(p, sudut, 0)}" fill="url(#${id}k)" stroke="#A8F4FF" stroke-opacity=".55" stroke-width="${f1(4 * p(0, 0, 0)[2])}"/>`;
      const sn = o.sinar ?? ((t * 0.12) % 1.6) - 0.3; // kilau kaca menyapu
      const su = -W / 2 + sn * W; s += `<polygon points="${poli(p, [[su, -H / 2], [su + 90, -H / 2], [su - 120, H / 2], [su - 210, H / 2]].map(([u, v]) => [cl(u, -W / 2, W / 2), v]), 0)}" fill="#FFFFFF" opacity=".08"/>`;
    }
    // penanda target ("layar tahu: di situ")
    for (const q of o.target || []) { const k = cl(q.k ?? 1); if (k <= 0) continue; const r = (q.r || 70) * (1.6 - 0.6 * k), [X, Y, kk] = p(q.u, q.v, 2);
      s += `<g opacity="${f2(k)}"><polygon points="${lingkar(p, q.u, q.v, r, 2)}" fill="none" stroke="${q.warna || "#FFC93C"}" stroke-width="${f1(10 * kk)}"/><polygon points="${lingkar(p, q.u, q.v, r * 0.45, 2)}" fill="${q.warna || "#FFC93C"}" opacity=".35"/>`;
      for (const [du, dv] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = p(q.u + du * r * 0.75, q.v + dv * r * 0.75, 2), b = p(q.u + du * r * 1.35, q.v + dv * r * 1.35, 2); s += `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${q.warna || "#FFC93C"}" stroke-width="${f1(10 * kk)}" stroke-linecap="round"/>`; }
      s += `</g>`; }
    return s;
  }
  const lerpH = (a, b, k) => a + (b - a) * k;

  // ---------- tetes air di kaca ----------
  function tetesKaca(x, y, r, t = 0, o = {}) {
    const gy = o.goyang || 0, w = Math.sin(t * 9) * 0.08 * gy, id = uid("tk"), rx = r * (1 + w), ry = r * 0.78 * (1 - w);
    let s = `<defs><radialGradient id="${id}" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#F2FEFF"/><stop offset=".5" stop-color="#8FE9F7" stop-opacity=".85"/><stop offset="1" stop-color="#2FB7D6" stop-opacity=".9"/></radialGradient></defs>`;
    if (o.glow) s += `<ellipse cx="0" cy="${f1(ry * 0.1)}" rx="${f1(rx * 1.7)}" ry="${f1(ry * 1.3)}" fill="${CY}" opacity="${f2(0.22 * o.glow)}"/>`;
    s += `<ellipse cx="${f1(rx * 0.1)}" cy="${f1(ry * 0.92)}" rx="${f1(rx * 0.95)}" ry="${f1(ry * 0.18)}" fill="#04021A" opacity=".35"/>`;
    s += `<path d="M${f1(-rx)} ${f1(ry * 0.8)} Q${f1(-rx)} ${f1(-ry)} 0 ${f1(-ry)} Q${f1(rx)} ${f1(-ry)} ${f1(rx)} ${f1(ry * 0.8)}Z" fill="url(#${id})"/>`;
    s += `<ellipse cx="${f1(-rx * 0.38)}" cy="${f1(-ry * 0.38)}" rx="${f1(rx * 0.2)}" ry="${f1(ry * 0.28)}" fill="#FFFFFF" opacity=".9" transform="rotate(-25 ${f1(-rx * 0.38)} ${f1(-ry * 0.38)})"/>`;
    if (o.sidik) { const k = cl(o.sidik); for (let i = 0; i < 6; i++) { const rr = rx * (0.15 + i * 0.12); s += `<path d="M${f1(-rr)} ${f1(ry * 0.25)} Q${f1(-rr)} ${f1(-rr * 0.9)} 0 ${f1(-rr * 0.9 + ry * 0.05)} Q${f1(rr)} ${f1(-rr * 0.9)} ${f1(rr)} ${f1(ry * 0.25)}" stroke="#2A9CC0" stroke-width="${f1(rx * 0.035)}" fill="none" opacity="${f2(0.45 * k)}" transform="translate(${f1(rx * 0.1)} ${f1(ry * 0.1)})"/>`; } }
    if (o.mata) { const m = o.mata; s += `<circle cx="${f1(-rx * 0.25)}" cy="${f1(ry * 0.05)}" r="${f1(rx * 0.09)}" fill="${IND}"/><circle cx="${f1(rx * 0.25)}" cy="${f1(ry * 0.05)}" r="${f1(rx * 0.09)}" fill="${IND}"/>${m === "senang" ? `<path d="M${f1(-rx * 0.16)} ${f1(ry * 0.3)} Q0 ${f1(ry * 0.48)} ${f1(rx * 0.16)} ${f1(ry * 0.3)}" stroke="${IND}" stroke-width="${f1(rx * 0.05)}" fill="none" stroke-linecap="round"/>` : `<ellipse cx="0" cy="${f1(ry * 0.36)}" rx="${f1(rx * 0.07)}" ry="${f1(rx * 0.09)}" fill="${IND}"/>`}`; }
    return g(x, y, 1, s);
  }
  function genangan(x, y, s, t = 0, o = {}) {
    const titik = [[-60, 6, 46], [10, -6, 58], [76, 10, 40], [-20, 34, 34], [40, 38, 30], [118, -14, 26]].slice(0, o.n || 6);
    let q = `<ellipse cx="20" cy="22" rx="150" ry="44" fill="${CY}" opacity=".12"/>`;
    for (const [dx, dy, r] of titik) q += tetesKaca(dx, dy, r, t + dx * 0.01, { goyang: 0.4 });
    return g(x, y, s, q);
  }

  // ---------- kartu kuis ----------
  function petir(x, y, s, k = 1) { return g(x, y, s, `<path d="M18 -96 L-48 10 L-6 10 L-24 96 L52 -20 L8 -20 L30 -96Z" fill="${CY}" opacity="${f2(k)}"/><path d="M18 -96 L-48 10 L-6 10 L-24 96" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round" opacity="${f2(0.6 * k)}"/>`); }
  function kartuKuis(x, y, s, jenis, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    const ny = cl(o.nyala || 0), rd = cl(o.redup || 0), co = cl(o.coret || 0);
    let ik = "";
    if (jenis === "tekanan") ik = `<rect x="-70" y="-40" width="140" height="90" rx="18" fill="#5C5A8A"/><path d="M-40 -40 Q-40 -86 0 -86 Q40 -86 40 -40" stroke="#5C5A8A" stroke-width="18" fill="none"/><rect x="-50" y="-20" width="100" height="14" rx="7" fill="#7C7AAE"/>${[-50, 0, 50].map((dx) => `<path d="M${dx} 62 l0 26 m-14 -12 l14 14 l14 -14" stroke="#FF8A8A" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join("")}`;
    else if (jenis === "panas") ik = `<rect x="-20" y="-90" width="40" height="130" rx="20" fill="#E8EEF8"/><rect x="-9" y="-50" width="18" height="90" rx="9" fill="#FF6B5E"/><circle cx="0" cy="58" r="34" fill="#FF6B5E"/><circle cx="-10" cy="48" r="9" fill="#FFB2A8"/>${[0, 1, 2].map((i) => `<path d="M${50 + i * 0} ${-60 + i * 36} q14 -10 0 -22" stroke="#FFB070" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>`).join("")}`;
    else ik = `${ny > 0 ? `<circle r="${f1(90 + 20 * ny)}" fill="${CY}" opacity="${f2(0.25 * ny)}"/>` : ""}${petir(0, 0, 1, 1)}`;
    const warna = jenis === "listrik" ? (ny > 0 ? "#123E6A" : "#1E2C5E") : jenis === "tekanan" ? "#2B2860" : "#3A2450";
    let q = `<rect x="-150" y="-190" width="300" height="380" rx="34" fill="#000" opacity=".3" transform="translate(10 16)"/>`;
    if (ny > 0) q += `<rect x="-${f1(150 + 18 * ny)}" y="-${f1(190 + 18 * ny)}" width="${f1(300 + 36 * ny)}" height="${f1(380 + 36 * ny)}" rx="44" fill="${CY}" opacity="${f2(0.45 * ny)}"/>`;
    q += `<rect x="-150" y="-190" width="300" height="380" rx="34" fill="${warna}"/><rect x="-150" y="-190" width="300" height="380" rx="34" fill="none" stroke="${ny > 0 ? CY : "#5B57A8"}" stroke-width="8"/>`;
    q += `<g transform="translate(0 -40)">${ik}</g>`;
    if (o.teks) q += `<text y="140" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${o.teks.length > 7 ? 44 : 52}" fill="${ny > 0 ? CYL : "#FFF4DC"}">${o.teks}</text>`;
    if (co > 0) q += `<path d="M-120 -150 L${f1(-120 + 240 * cl(co * 2))} ${f1(-150 + 300 * cl(co * 2))}" stroke="#E2232E" stroke-width="26" stroke-linecap="round"/>${co > 0.5 ? `<path d="M120 -150 L${f1(120 - 240 * cl(co * 2 - 1))} ${f1(-150 + 300 * cl(co * 2 - 1))}" stroke="#E2232E" stroke-width="26" stroke-linecap="round"/>` : ""}`;
    return `<g transform="translate(${f1(x)} ${f1(y + (1 - k) * 260)}) rotate(${f1((o.rot || 0) * k)}) scale(${f2(s * (0.75 + 0.25 * k))})" opacity="${f2(Math.min(1, k * 2) * (1 - 0.65 * rd))}">${q}</g>`;
  }

  // ---------- jari hantu (lucu) ----------
  function jariHantu(x, y, s, t = 0, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    const ek = (i) => Math.sin(t * 6 + i) * 10, id = uid("jh");
    let q = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset="1" stop-color="#BFF6FF" stop-opacity=".6"/></linearGradient></defs>`;
    q += `<ellipse cx="0" cy="40" rx="130" ry="180" fill="#5B57D8" opacity=".35"/>`;
    q += `<path d="M-62 -20 Q-62 -150 0 -150 Q62 -150 62 -20 L62 120 Q48 ${f1(150 + ek(1))} 30 125 Q16 ${f1(160 + ek(2))} 0 128 Q-16 ${f1(160 + ek(3))} -30 125 Q-48 ${f1(150 + ek(4))} -62 120Z" fill="url(#${id})" stroke="#2AA8D8" stroke-width="7"/>`;
    q += `<path d="M-40 -120 Q-30 -136 -6 -138" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"/>`;
    q += `<rect x="-36" y="-128" width="72" height="46" rx="20" fill="#E6FCFF" opacity=".8"/>`; // kuku
    q += `<ellipse cx="-20" cy="-20" rx="9" ry="13" fill="${IND}"/><ellipse cx="20" cy="-20" rx="9" ry="13" fill="${IND}"/><circle cx="-17" cy="-25" r="3" fill="#FFF"/><circle cx="23" cy="-25" r="3" fill="#FFF"/>`;
    q += `<path d="M-14 10 Q0 22 14 10" stroke="${IND}" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="-36" cy="6" rx="10" ry="6" fill="#FF9EB8" opacity=".6"/><ellipse cx="36" cy="6" rx="10" ry="6" fill="#FF9EB8" opacity=".6"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y + Math.sin(t * 3) * 8)}) rotate(${f1(Math.sin(t * 2) * 6 + (o.rot || 0))}) scale(${f2(s * (0.6 + 0.4 * k))})" opacity="${f2(Math.min(1, k * 2))}">${q}</g>`;
  }

  // ---------- tangan akuarium ----------
  function tanganAkuarium(x, y, s, t = 0, o = {}) {
    const id = uid("ta"), li = cl(o.listrik || 0), k = cl(o.k ?? 1);
    const bentuk = `<rect x="-150" y="-60" width="300" height="300" rx="110"/><rect x="-150" y="-420" width="92" height="420" rx="46"/><rect x="-48" y="-120" width="88" height="170" rx="44"/><rect x="44" y="-100" width="84" height="150" rx="42"/><rect x="118" y="-60" width="70" height="140" rx="35" transform="rotate(-25 150 0)"/><rect x="-100" y="200" width="200" height="380" rx="40"/>`;
    let q = `<defs><clipPath id="${id}">${bentuk}</clipPath><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FE6F2"/><stop offset="1" stop-color="#1F6FA8"/></linearGradient></defs>`;
    q += `<g fill="${CY}" opacity=".16" transform="scale(1.06)">${bentuk}</g>`;
    q += `<g fill="#2A2670" opacity=".7">${bentuk}</g>`;
    const muka = -380 + 30 * (1 - k);
    let air = `<rect x="-260" y="${f1(muka)}" width="520" height="1100" fill="url(#${id}a)" opacity=".92"/>`;
    air += `<path d="M-260 ${f1(muka)} ${[...Array(10)].map((_, i) => `Q${f1(-235 + i * 52)} ${f1(muka + 16 * Math.sin(t * 4 + i))} ${f1(-208 + i * 52)} ${f1(muka)}`).join(" ")} L260 ${f1(muka - 40)} L-260 ${f1(muka - 40)}Z" fill="#2A2670"/>`;
    for (let i = 0; i < 12; i++) { const u = (t * 0.35 + i / 12) % 1, bx = -120 + ((i * 53) % 240) + Math.sin(t * 2 + i) * 10, by = 560 - u * 900; air += `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(6 + (i % 3) * 4)}" fill="#E6FCFF" opacity="${f2(0.6 * Math.sin(Math.PI * u))}"/>`; }
    if (li > 0) { // percik listrik mengalir dari lengan ke ujung telunjuk
      const jalur = (u) => u < 0.55 ? [Math.sin(u * 20) * 30, 560 - u / 0.55 * 560] : [-104 + Math.sin(u * 30) * 10, -(u - 0.55) / 0.45 * 380];
      for (let i = 0; i < 9; i++) { const u = (t * 0.5 + i / 9) % 1, [px, py] = jalur(u); air += `<g transform="translate(${f1(px)} ${f1(py)})" opacity="${f2(li * Math.sin(Math.PI * u))}"><circle r="22" fill="${CY}" opacity=".35"/><path d="M-12 -14 L4 -2 L-6 2 L12 16" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
    }
    q += `<g clip-path="url(#${id})">${air}</g>`;
    q += `<g fill="none" stroke="${CYL}" stroke-width="7" opacity=".7">${bentuk}</g>`;
    q += `<path d="M-128 -380 L-128 -60" stroke="#FFFFFF" stroke-width="12" opacity=".35" stroke-linecap="round"/>`;
    return g(x, y, s, q);
  }

  // ---------- HP generik ----------
  function isiLayar(w, h, t, gulir = 0, o = {}) {
    const wa = ["#FFC93C", "#FF8A8A", "#6EE7A8", "#8FB8FF", "#C79BFF", CY];
    let q = `<rect x="0" y="0" width="${w}" height="${h}" fill="#F4F7FF"/>`;
    const tg = 150, off = -((gulir * tg) % (tg * 6));
    for (let i = -1; i < Math.ceil(h / tg) + 7; i++) { const yy = 96 + i * tg + off, c = wa[((i % 6) + 6) % 6]; if (yy < -tg || yy > h) continue;
      q += `<rect x="24" y="${f1(yy)}" width="${w - 48}" height="${tg - 24}" rx="20" fill="#FFFFFF"/><circle cx="76" cy="${f1(yy + (tg - 24) / 2)}" r="34" fill="${c}"/><rect x="128" y="${f1(yy + 30)}" width="${f1((w - 200) * (0.5 + 0.4 * ((i * 37) % 10) / 10))}" height="18" rx="9" fill="#D4DBEA"/><rect x="128" y="${f1(yy + 66)}" width="${f1((w - 200) * 0.45)}" height="14" rx="7" fill="#E4E9F4"/>`; }
    q += `<rect x="0" y="0" width="${w}" height="80" fill="${IND2}"/><circle cx="${w - 52}" cy="40" r="20" fill="#FFFFFF" opacity=".8"/><rect x="28" y="30" width="120" height="20" rx="10" fill="#FFFFFF" opacity=".55"/>`;
    if (o.tekan) for (const [px, py, kk] of o.tekan) if (kk > 0) q += `<circle cx="${f1(px * w)}" cy="${f1(py * h)}" r="${f1(30 + 50 * (1 - kk))}" fill="${CY}" opacity="${f2(0.6 * kk)}"/>`;
    return q;
  }
  function hpGenerik(x, y, s, t = 0, o = {}) {
    const w = 400, h = 820, id = uid("hp");
    let q = `<defs><clipPath id="${id}"><rect x="${-w / 2 + 18}" y="${-h / 2 + 18}" width="${w - 36}" height="${h - 36}" rx="40"/></clipPath></defs>`;
    q += `<rect x="${-w / 2 + 14}" y="${-h / 2 + 22}" width="${w}" height="${h}" rx="58" fill="#000" opacity=".28"/>`;
    q += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="58" fill="#24224A"/><rect x="${-w / 2 + 6}" y="${-h / 2 + 6}" width="${w - 12}" height="${h - 12}" rx="54" fill="#0E0C24"/>`;
    q += `<g clip-path="url(#${id})"><g transform="translate(${-w / 2 + 18} ${-h / 2 + 18})">${o.layar === 0 ? `<rect width="${w - 36}" height="${h - 36}" fill="#141236"/>` : isiLayar(w - 36, h - 36, t, o.gulir || 0, o)}</g>`;
    q += `<path d="M${-w / 2} ${-h / 2 + 160} L${w / 2} ${-h / 2 - 40} L${w / 2} ${-h / 2 + 60} L${-w / 2} ${-h / 2 + 260}Z" fill="#FFFFFF" opacity=".08"/></g>`;
    if (o.basah) { const b = cl(o.basah); [[-90, -150, 22], [60, 40, 28], [110, -260, 16], [-40, 210, 20], [20, -40, 14], [-120, 120, 12]].forEach(([dx, dy, r], i) => { q += `<g opacity="${f2(b)}">${tetesKaca(dx, dy + Math.sin(t * 1.2 + i) * 3, r, t, { goyang: 0.2 })}</g>`; }); }
    return g(x, y, s, q, o.rot || 0);
  }
  function tanganPegangHP(x, y, s, t = 0, o = {}) {
    const bs = cl(o.basah ?? 1);
    let q = "";
    q += `<path d="M-60 300 Q-40 560 -20 900 L240 900 Q240 600 230 330Z" fill="#3E5A9A"/><path d="M-60 300 Q-40 560 -20 900 L40 900 Q20 600 10 320Z" fill="#33508A"/>`; // lengan baju
    q += `<ellipse cx="80" cy="330" rx="190" ry="150" fill="${KUL}"/><ellipse cx="40" cy="360" rx="120" ry="90" fill="${KULG}" opacity=".4"/>`;
    q += hpGenerik(0, 0, 1, t, { gulir: o.gulir || 0, basah: bs, tekan: o.tekan });
    q += `<path d="M-200 250 Q-260 140 -226 40" stroke="${KUL}" stroke-width="64" stroke-linecap="round" fill="none"/><path d="M-212 220 Q-250 150 -232 80" stroke="${KULS}" stroke-width="16" stroke-linecap="round" fill="none" opacity=".6"/>`;
    [[-20, 0], [60, 1], [140, 2], [222, 3]].forEach(([yy, i]) => { q += `<rect x="168" y="${-100 + yy * 0.9}" width="96" height="62" rx="31" fill="${i % 2 ? KULG : KUL}"/>`; });
    if (bs > 0) {
      [[-238, 120], [-210, 60], [210, -60], [236, 40], [200, 140], [120, 380]].forEach(([dx, dy], i) => { q += `<g opacity="${f2(bs)}">${tetesKaca(dx, dy, 13 + (i % 3) * 4, t, {})}</g>`; });
      for (let i = 0; i < 3; i++) { const u = (t * 0.6 + i / 3) % 1; q += `<g opacity="${f2(bs * Math.sin(Math.PI * u))}">${tetesKaca(-230 + i * 220, 300 + u * 520, 14, t, {})}</g>`; }
    }
    return g(x, y, s, q, o.rot || 0);
  }

  // ---------- dapur malam ----------
  function dapurMalam(w, h, t = 0, o = {}) {
    const bx = o.bakX ?? w * 0.5, jx = o.jendelaX ?? w * 0.24, mj = o.meja ?? 1240, lp = o.lampu ?? 1;
    let s = `<rect x="-60" y="-60" width="${w + 120}" height="${h + 120}" fill="#2B2A62"/>`;
    for (let x = 0; x < w + 60; x += 110) for (let y = 300; y < mj; y += 110) s += `<rect x="${x + 6}" y="${y + 6}" width="98" height="98" rx="8" fill="#33327A"/>`;
    // jendela malam
    s += `<rect x="${jx - 190}" y="210" width="380" height="440" rx="14" fill="#5A4A3A"/><rect x="${jx - 170}" y="230" width="340" height="400" fill="#101038"/><circle cx="${jx + 80}" cy="320" r="44" fill="#FFF4DC" opacity=".9"/><circle cx="${jx + 98}" cy="306" r="42" fill="#101038"/>`;
    for (let i = 0; i < 7; i++) s += `<circle cx="${f1(jx - 150 + ((i * 83) % 300))}" cy="${f1(260 + ((i * 59) % 330))}" r="3" fill="#FFF4DC" opacity="${f2(0.5 + 0.5 * Math.sin(t * 2 + i))}"/>`;
    s += `<rect x="${jx - 4}" y="230" width="8" height="400" fill="#5A4A3A"/><rect x="${jx - 170}" y="426" width="340" height="8" fill="#5A4A3A"/>`;
    // rak dinding + toples polos
    s += `<rect x="${w * 0.66}" y="420" width="${w * 0.3}" height="20" rx="6" fill="#6A4E3A"/>`;
    [[0.69, "#E8A85A"], [0.76, "#8FD0A8"], [0.83, "#F7A9C2"], [0.9, "#9AD0F0"]].forEach(([fx, c], i) => { s += `<rect x="${f1(w * fx)}" y="${330 + (i % 2) * 20}" width="70" height="${90 - (i % 2) * 20}" rx="16" fill="${c}" opacity=".85"/>`; });
    // lampu gantung hangat
    if (lp) { s += `<rect x="${bx - 3}" y="-60" width="6" height="200" fill="#1A1A40"/><path d="M${bx - 70} 200 L${bx + 70} 200 L${bx + 40} 140 L${bx - 40} 140Z" fill="#F2C76A"/><ellipse cx="${bx}" cy="560" rx="560" ry="420" fill="#FFD98A" opacity=".10"/><path d="M${bx - 70} 200 L${bx - 320} ${mj} L${bx + 320} ${mj} L${bx + 70} 200Z" fill="#FFE7A6" opacity=".07"/>`; }
    // meja dapur + bak
    s += `<rect x="-60" y="${mj}" width="${w + 120}" height="40" fill="#B8C2D8"/><rect x="-60" y="${mj + 40}" width="${w + 120}" height="${h - mj + 60}" fill="#3A3570"/>`;
    for (let x = 40; x < w; x += 300) s += `<rect x="${x}" y="${mj + 80}" width="260" height="${h - mj - 120}" rx="12" fill="#433E80"/><rect x="${x + 110}" y="${mj + 110}" width="40" height="10" rx="5" fill="#B8C2D8"/>`;
    s += `<path d="M${bx - 300} ${mj} L${bx + 300} ${mj} L${bx + 270} ${mj + 26} L${bx - 270} ${mj + 26}Z" fill="#7C86A8"/>`;
    // keran + air mengalir
    s += `<rect x="${bx + 150}" y="${mj - 260}" width="34" height="260" rx="12" fill="#AEB8CC"/><path d="M${bx + 167} ${mj - 250} Q${bx + 167} ${mj - 330} ${bx + 80} ${mj - 330} L${bx + 40} ${mj - 330} L${bx + 40} ${mj - 296} L${bx + 80} ${mj - 296} Q${bx + 134} ${mj - 296} ${bx + 134} ${mj - 250}Z" fill="#C8D0E0"/>`;
    s += `<rect x="${bx + 44}" y="${mj - 296}" width="${f1(16 + 3 * Math.sin(t * 11))}" height="296" rx="8" fill="#9FE8FA" opacity=".8"/>`;
    for (let i = 0; i < 5; i++) { const u = (t * 1.2 + i / 5) % 1; s += `<rect x="${bx + 48}" y="${f1(mj - 296 + u * 280)}" width="8" height="26" rx="4" fill="#FFFFFF" opacity=".6"/>`; }
    // rak piring
    s += `<rect x="${bx - 520}" y="${mj - 40}" width="220" height="40" rx="8" fill="#8A9AB8"/>`;
    for (let i = 0; i < 5; i++) s += `<ellipse cx="${bx - 500 + i * 42}" cy="${mj - 110}" rx="16" ry="90" fill="${i % 2 ? "#FFFFFF" : "#E2EAF4"}"/>`;
    s += `<g opacity=".9">${[0, 1, 2, 3, 4, 5].map((i) => { const u = (t * 0.4 + i / 6) % 1; return `<circle cx="${f1(bx - 120 + i * 50 + Math.sin(t + i) * 8)}" cy="${f1(mj - 10 - u * 90)}" r="${f1(10 + (i % 3) * 6)}" fill="#FFFFFF" opacity="${f2(0.8 * Math.sin(Math.PI * u))}"/>`; }).join("")}</g>`;
    return s;
  }

  // ---------- manusia tetes (canda) ----------
  function manusiaTetes(x, y, s, t = 0, o = {}) {
    const id = uid("mt"), gy = Math.sin(t * 3) * 0.03;
    let q = `<defs><radialGradient id="${id}" cx=".38" cy=".35" r=".8"><stop offset="0" stop-color="#E6FCFF"/><stop offset=".55" stop-color="#6FD8F0"/><stop offset="1" stop-color="#2390C0"/></radialGradient></defs>`;
    q += `<ellipse cx="0" cy="20" rx="230" ry="34" fill="#000" opacity=".25"/>`;
    q += `<g transform="scale(${f2(1 + gy)} ${f2(1 - gy)})"><path d="M0 -620 C60 -480 230 -330 230 -170 C230 -40 130 20 0 20 C-130 20 -230 -40 -230 -170 C-230 -330 -60 -480 0 -620Z" fill="url(#${id})"/>`;
    q += `<ellipse cx="-90" cy="-300" rx="34" ry="70" fill="#FFFFFF" opacity=".7" transform="rotate(25 -90 -300)"/>`;
    q += `<circle cx="-60" cy="-200" r="16" fill="${IND}"/><circle cx="50" cy="-200" r="16" fill="${IND}"/><circle cx="-55" cy="-206" r="5" fill="#FFF"/><circle cx="55" cy="-206" r="5" fill="#FFF"/><path d="M-34 -150 Q-6 -122 24 -150" stroke="${IND}" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="-104" cy="-160" rx="20" ry="11" fill="#FF9EB8" opacity=".55"/><ellipse cx="96" cy="-160" rx="20" ry="11" fill="#FF9EB8" opacity=".55"/></g>`;
    q += `<path d="M-200 -120 Q-260 -40 -150 -20" stroke="#4FC4E6" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M200 -120 Q250 -60 170 -40" stroke="#4FC4E6" stroke-width="34" fill="none" stroke-linecap="round"/>`;
    if (o.hp !== 0) q += hpGenerik(10, -40, 0.32, t, { gulir: t * 0.8, basah: 1, rot: -8 });
    q += `<circle cx="-150" cy="-20" r="26" fill="#4FC4E6"/><circle cx="170" cy="-40" r="26" fill="#4FC4E6"/>`;
    for (let i = 0; i < 2; i++) { const u = (t * 0.7 + i / 2) % 1; q += `<g opacity="${f2(Math.sin(Math.PI * u))}">${tetesKaca(-160 + i * 320, -10 + u * 120, 10, t, {})}</g>`; }
    return g(x, y, s, q);
  }

  // ---------- panel kartu pilihan ----------
  function miniWudu(x, y, s, t = 0) {
    let q = `<rect x="-120" y="-120" width="240" height="240" fill="#B9E6E0"/><rect x="-120" y="40" width="240" height="80" fill="#7CC4BC"/>`;
    q += `<rect x="-30" y="-110" width="24" height="60" rx="8" fill="#9AA8B4"/><rect x="-40" y="-60" width="70" height="22" rx="10" fill="#B8C4CE"/>`;
    q += `<rect x="-6" y="-40" width="${f1(10 + 2 * Math.sin(t * 10))}" height="80" rx="5" fill="#E6FCFF" opacity=".9"/>`;
    q += `<ellipse cx="-30" cy="40" rx="44" ry="26" fill="${KUL}"/><ellipse cx="34" cy="44" rx="44" ry="26" fill="${KULG}"/>`;
    for (let i = 0; i < 4; i++) { const u = (t * 1.3 + i / 4) % 1; q += `<circle cx="${f1(-40 + i * 26)}" cy="${f1(60 + u * 50)}" r="5" fill="#FFFFFF" opacity="${f2(Math.sin(Math.PI * u))}"/>`; }
    return g(x, y, s, q);
  }
  function miniHujan(x, y, s, t = 0) {
    let q = `<rect x="-120" y="-120" width="240" height="240" fill="#5A6A9A"/>`;
    q += `<ellipse cx="-30" cy="-70" rx="70" ry="40" fill="#C8D0E8"/><ellipse cx="40" cy="-80" rx="60" ry="44" fill="#DDE3F2"/><ellipse cx="10" cy="-50" rx="90" ry="30" fill="#C8D0E8"/>`;
    for (let i = 0; i < 10; i++) { const u = (t * 1.6 + i / 10) % 1; q += `<line x1="${-100 + i * 22}" y1="${f1(-30 + u * 150)}" x2="${-108 + i * 22}" y2="${f1(-6 + u * 150)}" stroke="#E6FCFF" stroke-width="5" stroke-linecap="round" opacity=".8"/>`; }
    q += `<rect x="-120" y="80" width="240" height="40" fill="#3A4A7A"/>`;
    q += `<g transform="translate(-6 60)"><circle cx="-50" cy="24" r="20" fill="#1E1E2A"/><circle cx="50" cy="24" r="20" fill="#1E1E2A"/><path d="M-60 6 L40 6 Q60 6 64 24 L-70 24Z" fill="#E2483E"/><rect x="-30" y="-46" width="40" height="52" rx="16" fill="#3E6A8A"/><circle cx="-10" cy="-62" r="18" fill="#FFC93C"/><rect x="10" y="-40" width="20" height="30" rx="5" fill="#24224A"/></g>`;
    return g(x, y, s, q);
  }

  Object.assign(A, { LAYAR_W: C, proyeksi, slabLayar, tetesKaca, genangan, kartuKuis, petir, jariHantu, tanganAkuarium, hpGenerik, isiLayar, tanganPegangHP, dapurMalam, manusiaTetes, miniWudu, miniHujan });
})(typeof window !== "undefined" ? window : globalThis);
