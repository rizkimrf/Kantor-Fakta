/* ASET SABUN & MINYAK (Yoga, 25 Nov 2026; dipakai A3-05 "Cara kerja sabun menghilangkan minyak? Ternyata dibungkus"). Muat SETELAH aset-set.js.
 * Gaya: datar tanpa garis hitam di set; dapur kuning hangat + stainless, dunia x-ray ungu-biru, minyak kuning lemon. TANPA merek/label/angka.
 *  SABUN                 — palet bersama {LEMON, LEMONL, UNGU, UNGUT, AIR, AIRL, KEPALA}
 *  bakCuci(t,{kilap 0..1, keran 0..1, tetes 0..1 (jatuh→mendarat), genang 0..1, busa 0..1, butir 0..1, kesat 0..1, saluran:[{x,y,k,topi}]})
 *        — bak cuci piring 1080x1920 (tampak depan-atas): dinding ubin krem, lampu kuning hangat, rak piring polos, meja, bak stainless,
 *          keran + aliran air, wajan gelap berminyak di dalam bak (pusat WAJAN.X/Y), spons di tepi bak, lubang saluran
 *  WAJAN                 — {X, Y, RX, RY, SX, SY (titik jatuh air keran), DX, DY (lubang saluran)}
 *  wajanAtas(t,{kilap, butir, blur}) — sampul: wajan dari atas di bak stainless, genangan minyak kuning lemon menyala + butir air
 *  tanganTebe(x,y,rot,s,t,{kilap, spons, jari 0..1 (lurus→menekuk)}) — tangan Tebe (kulit + garis Tebe) dengan lengan hoodie mustard;
 *        pangkal lengan di luar layar, ujung jari di (x,y) arah rot (derajat, 0 = ke kiri)
 *  butir(x,y,r,warna,t,{sx,sy,kilau}) — butir cairan datar dengan kilau (tanpa wajah)
 *  penampang(t,{lantai}) — penampang lapisan di permukaan wajan: udara lavender, lantai logam wajan melengkung
 *  arus(t,{k, arah, y0, y1, laju}) — garis arus air bilas · duniaXray(t,{warna}) — latar air ungu-biru berkabut + partikel
 *  kecebong(x,y,s,rot,t,{nyalaK, nyalaE, goyang, minus}) — molekul sabun: kepala bulat putih (suka air), ekor zigzag kuning (betah di minyak)
 *  misel(x,y,R,t,{k 0..1 (kerubung), n, minus 0..1, topi 0..1, pecah, rot, kilau, sx, sy}) — bola kecil: inti minyak + kulit kepala-kepala putih
 *  topiKurir(x,y,s,rot) — topi kurir polos (tanpa logo) · ikonGelas / ikonPiring / ikonWajan (t) — isi kartu pilihan (tanpa huruf) */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let _n = 0; const uid = (p) => `${p}S${++_n}`;
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;
  const SABUN = { LEMON: "#FFE14A", LEMONL: "#FFF4A8", LEMONG: "#F2B81E", UNGU: "#3A2A6E", UNGUT: "#241A4A", AIR: "#A9B4F2", AIRL: "#DDE3FF", AIRG: "#7F8BE0", KEPALA: "#FBF6EC" };
  const S = SABUN;
  const D = { ubin: "#F5E6C4", ubinG: "#E8D3A6", meja: "#E9CFA2", mejaB: "#D3B07A", kabinet: "#B8774C", kabinetB: "#9E623C", baja: "#C3CBD3", bajaG: "#97A1AC", bajaT: "#E3E8EC",
    bajaD: "#7E8893", wajan: "#3B3742", wajanD: "#2A2730", wajanT: "#55505E", gagang: "#8E5B38", piring: ["#F4F1EA", "#BFD9E6", "#F2C9B8", "#CFE5C8"] };
  const WAJAN = { X: 520, Y: 1205, RX: 330, RY: 205, SX: 548, SY: 1150, DX: 805, DY: 1405 };

  // ---------- butir cairan ----------
  function butir(x, y, r, warna, t = 0, o = {}) {
    const sx = o.sx || 1, sy = o.sy || 1, gl = o.kilau ?? 1;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(sx)} ${f2(sy)})"><circle r="${f1(r)}" fill="${warna}"/>
      <ellipse cx="${f1(-r * 0.32)}" cy="${f1(-r * 0.38)}" rx="${f1(r * 0.3)}" ry="${f1(r * 0.18)}" fill="#FFFFFF" opacity="${f2(0.55 * gl)}" transform="rotate(-30 ${f1(-r * 0.32)} ${f1(-r * 0.38)})"/>
      <circle cx="${f1(r * 0.38)}" cy="${f1(r * 0.3)}" r="${f1(r * 0.09)}" fill="#FFFFFF" opacity="${f2(0.35 * gl)}"/></g>`;
  }

  // ---------- genangan minyak (bentuk organik, bergoyang halus) ----------
  function genangan(cx, cy, rx, ry, t, warna, op, benih = 1) {
    let d = ""; const n = 40;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2, w = 1 + 0.07 * Math.sin(a * 3 + benih) + 0.05 * Math.sin(a * 5 + t * 1.3 + benih * 2);
      const x = cx + Math.cos(a) * rx * w, y = cy + Math.sin(a) * ry * w;
      d += (i ? " L" : "M") + f1(x) + " " + f1(y);
    }
    return `<path d="${d}Z" fill="${warna}" opacity="${f2(op)}"/>`;
  }
  function kilapMinyak(cx, cy, rx, ry, t, k, o = {}) {
    if (k <= 0.01) return "";
    const id = uid("km");
    let s = `<defs><radialGradient id="${id}" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="${S.LEMONL}"/><stop offset=".55" stop-color="${S.LEMON}"/><stop offset="1" stop-color="${S.LEMONG}" stop-opacity=".0"/></radialGradient></defs>`;
    s += `<g opacity="${f2(k)}">${genangan(cx, cy, rx * 1.08, ry * 1.08, t, S.LEMONG, 0.35, 3)}${genangan(cx, cy, rx, ry, t, `url(#${id})`, 0.95, 1)}`;
    // garis kilau putih
    s += `<path d="M${f1(cx - rx * 0.55)} ${f1(cy - ry * 0.25)} Q${f1(cx - rx * 0.1)} ${f1(cy - ry * 0.62)} ${f1(cx + rx * 0.42)} ${f1(cy - ry * 0.36)}" stroke="#FFFFFF" stroke-width="${f1(ry * 0.09)}" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M${f1(cx + rx * 0.18)} ${f1(cy + ry * 0.38)} q${f1(rx * 0.2)} ${f1(-ry * 0.06)} ${f1(rx * 0.32)} ${f1(-ry * 0.28)}" stroke="#FFFFFF" stroke-width="${f1(ry * 0.06)}" fill="none" stroke-linecap="round" opacity=".45"/>`;
    // kilau bintang berkedip
    for (let i = 0; i < 3; i++) {
      const q = (t * 0.7 + i / 3) % 1, bx = cx + [-0.4, 0.25, 0.5][i] * rx, by = cy + [-0.45, -0.2, 0.25][i] * ry, sz = (o.bintang || 26) * Math.sin(Math.PI * q);
      s += `<path d="M${f1(bx)} ${f1(by - sz)} Q${f1(bx)} ${f1(by)} ${f1(bx + sz)} ${f1(by)} Q${f1(bx)} ${f1(by)} ${f1(bx)} ${f1(by + sz)} Q${f1(bx)} ${f1(by)} ${f1(bx - sz)} ${f1(by)} Q${f1(bx)} ${f1(by)} ${f1(bx)} ${f1(by - sz)}Z" fill="#FFFFFF" opacity=".85"/>`;
    }
    return s + "</g>";
  }

  // ---------- bak cuci piring ----------
  function bakCuci(t = 0, o = {}) {
    const W0 = WAJAN, id = uid("bk");
    const kilap = cl(o.kilap ?? 1), keran = cl(o.keran || 0);
    let s = `<defs><linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7E2B4"/><stop offset="1" stop-color="${D.ubin}"/></linearGradient>
      <radialGradient id="${id}l" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A6" stop-opacity=".85"/><stop offset="1" stop-color="#FFE9A6" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${D.bajaD}"/><stop offset=".35" stop-color="${D.bajaG}"/><stop offset="1" stop-color="${D.baja}"/></linearGradient>
      <radialGradient id="${id}w" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${D.wajanT}"/><stop offset=".7" stop-color="${D.wajan}"/><stop offset="1" stop-color="${D.wajanD}"/></radialGradient>
      <linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${S.AIRL}" stop-opacity=".55"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset="1" stop-color="${S.AIRL}" stop-opacity=".55"/></linearGradient></defs>`;
    // dinding ubin
    s += `<rect x="-300" y="-300" width="1680" height="1140" fill="url(#${id}d)"/>`;
    for (let x = -300; x < 1400; x += 150) s += `<rect x="${x}" y="-300" width="5" height="1140" fill="${D.ubinG}" opacity=".7"/>`;
    for (let y = -300; y < 840; y += 150) s += `<rect x="-300" y="${y}" width="1680" height="5" fill="${D.ubinG}" opacity=".7"/>`;
    s += `<ellipse cx="420" cy="120" rx="700" ry="560" fill="url(#${id}l)"/>`;
    // lampu gantung polos
    s += `<rect x="413" y="-300" width="14" height="300" fill="#8A6A4A"/><path d="M330 40 Q420 -60 510 40Z" fill="#E8B14A"/><ellipse cx="420" cy="44" rx="70" ry="14" fill="#FFF1C0"/>`;
    // rak piring (kanan) — piring berdiri polos
    s += `<rect x="780" y="520" width="340" height="18" rx="9" fill="#A8B2BC"/><rect x="780" y="690" width="340" height="16" rx="8" fill="#A8B2BC"/>`;
    for (let i = 0; i < 5; i++) { const x = 810 + i * 54, c = D.piring[i % 4]; s += `<ellipse cx="${x}" cy="610" rx="22" ry="100" fill="${c}"/><ellipse cx="${x - 4}" cy="610" rx="10" ry="74" fill="#FFFFFF" opacity=".3"/>`; }
    s += `<rect x="1090" y="380" width="14" height="330" fill="#A8B2BC"/><rect x="790" y="470" width="12" height="236" fill="#A8B2BC"/>`;
    // gelas di rak kiri (polos)
    for (let i = 0; i < 2; i++) { const x = 70 + i * 96; s += `<path d="M${x - 34} 560 L${x + 34} 560 L${x + 26} 700 L${x - 26} 700Z" fill="#CFE9F2" opacity=".85"/><path d="M${x - 22} 576 L${x - 16} 684" stroke="#FFFFFF" stroke-width="8" opacity=".6" stroke-linecap="round"/>`; }
    s += `<rect x="-60" y="700" width="330" height="16" rx="8" fill="#A8B2BC"/>`;
    // meja + kabinet
    s += `<rect x="-300" y="780" width="1680" height="760" fill="${D.meja}"/><rect x="-300" y="780" width="1680" height="26" fill="${D.mejaB}" opacity=".6"/>
      <rect x="-300" y="1540" width="1680" height="700" fill="${D.kabinet}"/><rect x="-300" y="1540" width="1680" height="22" fill="${D.kabinetB}"/>
      <rect x="40" y="1600" width="440" height="560" rx="18" fill="${D.kabinetB}" opacity=".55"/><rect x="600" y="1600" width="440" height="560" rx="18" fill="${D.kabinetB}" opacity=".55"/>`;
    // bak stainless
    s += `<rect x="96" y="866" width="888" height="640" rx="78" fill="${D.bajaT}"/><rect x="128" y="896" width="824" height="580" rx="62" fill="url(#${id}b)"/>
      <rect x="128" y="896" width="824" height="70" rx="40" fill="${D.bajaD}" opacity=".35"/>`;
    s += `<ellipse cx="${W0.DX}" cy="${W0.DY}" rx="46" ry="22" fill="#6F7882"/><ellipse cx="${W0.DX}" cy="${W0.DY}" rx="30" ry="13" fill="#4E565F"/>`;
    for (let i = -2; i <= 2; i++) s += `<rect x="${W0.DX + i * 10 - 2}" y="${W0.DY - 10}" width="4" height="20" fill="#8C959E"/>`;
    // aliran ke saluran (bola-bola bertopi kurir di adegan payoff)
    // spons di tepi bak (kanan atas), polos
    if (!o.tanpaSpons) s += `<g transform="translate(888 872) rotate(-8)"><rect x="-70" y="-34" width="140" height="56" rx="16" fill="#FFC93C"/><rect x="-70" y="-34" width="140" height="18" rx="9" fill="#3FA86A"/><ellipse cx="-20" cy="6" rx="8" ry="6" fill="#D9A21C" opacity=".7"/><ellipse cx="26" cy="0" rx="6" ry="5" fill="#D9A21C" opacity=".7"/></g>`;
    // wajan
    const wx = W0.X, wy = W0.Y;
    s += `<ellipse cx="${wx + 10}" cy="${wy + 30}" rx="${W0.RX + 18}" ry="${W0.RY + 14}" fill="#5D6670" opacity=".45"/>`;
    s += `<path d="M${wx - W0.RX + 20} ${wy - 40} L${wx - W0.RX - 250} ${wy - 160}" stroke="${D.gagang}" stroke-width="44" stroke-linecap="round"/><path d="M${wx - W0.RX + 10} ${wy - 40} L${wx - W0.RX - 60} ${wy - 76}" stroke="${D.wajanD}" stroke-width="40" stroke-linecap="round"/>`;
    s += `<ellipse cx="${wx}" cy="${wy}" rx="${W0.RX}" ry="${W0.RY}" fill="${D.wajanD}"/><ellipse cx="${wx}" cy="${wy + 8}" rx="${W0.RX - 26}" ry="${W0.RY - 22}" fill="url(#${id}w)"/>`;
    s += `<path d="M${wx - W0.RX + 40} ${wy - 60} Q${wx} ${wy - W0.RY - 10} ${wx + W0.RX - 40} ${wy - 60}" stroke="${D.wajanT}" stroke-width="10" fill="none" opacity=".7" stroke-linecap="round"/>`;
    // kesat: kilau logam bersih (matte) + bintang kecil
    const ks = cl(o.kesat || 0);
    if (ks > 0) s += `<g opacity="${f2(ks)}"><ellipse cx="${wx - 60}" cy="${wy - 40}" rx="120" ry="40" fill="#8D8A99" opacity=".35"/>
      ${[0, 1].map((i) => { const q = cl(ks * 1.6 - i * 0.4), bx = wx - 90 + i * 210, by = wy - 60 + i * 70, z = 34 * Math.sin(Math.PI * Math.min(1, q)); return z > 0.5 ? `<path d="M${f1(bx)} ${f1(by - z)} Q${f1(bx)} ${f1(by)} ${f1(bx + z)} ${f1(by)} Q${f1(bx)} ${f1(by)} ${f1(bx)} ${f1(by + z)} Q${f1(bx)} ${f1(by)} ${f1(bx - z)} ${f1(by)} Q${f1(bx)} ${f1(by)} ${f1(bx)} ${f1(by - z)}Z" fill="#FFFFFF" opacity=".9"/>` : ""; }).join("")}</g>`;
    // minyak
    s += kilapMinyak(wx - 10, wy + 10, 190, 112, t, kilap);
    // genangan air keran di wajan
    const gn = cl(o.genang || 0);
    if (gn > 0) s += `<g opacity="${f2(gn * 0.8)}">${genangan(W0.SX, W0.SY + 20, 120 * gn + 40, 50 * gn + 20, t * 2, S.AIRL, 0.45, 7)}</g>`;
    // butir air menggelinding di atas minyak
    const bt = cl(o.butir || 0);
    if (bt > 0) for (let i = 0; i < 7; i++) {
      const q = (t * 0.55 + i / 7) % 1, a = -2.4 + i * 0.75, rr = 40 + q * 150;
      const x = W0.SX + Math.cos(a) * rr * 1.5, y = W0.SY + 20 + Math.sin(a) * rr * 0.7, sz = 12 + (i % 3) * 5;
      s += `<g opacity="${f2(bt * Math.sin(Math.PI * q))}">${butir(x, y, sz, S.AIRL, t, { sy: 0.8 })}</g>`;
    }
    // busa tipis (sedikit, bukan busa melimpah)
    const bs = cl(o.busa || 0);
    if (bs > 0) for (let i = 0; i < 9; i++) { const a = i * 0.7, r = 40 + (i % 4) * 34, x = wx - 10 + Math.cos(a) * r * 1.4, y = wy + 10 + Math.sin(a) * r * 0.6, rr = 10 + (i % 3) * 6 + Math.sin(t * 3 + i) * 2;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr * bs)}" fill="#F3F6FF" opacity=".75"/><circle cx="${f1(x - rr * 0.3)}" cy="${f1(y - rr * 0.3)}" r="${f1(rr * 0.25 * bs)}" fill="#FFFFFF"/>`; }
    // tetes sabun bening (polos) jatuh dari atas
    const tt = o.tetes ?? -1;
    if (tt >= 0 && tt < 1) {
      const y = -260 + (W0.Y - 30 + 260) * Math.min(1, tt * 1.25) ** 2, mendarat = tt > 0.8, x = wx - 10;
      if (!mendarat) s += `<path d="M${x} ${f1(y - 46)} Q${x + 30} ${f1(y)} ${x} ${f1(y + 20)} Q${x - 30} ${f1(y)} ${x} ${f1(y - 46)}Z" fill="#CDEFE6" opacity=".95"/><ellipse cx="${x - 8}" cy="${f1(y - 2)}" rx="5" ry="10" fill="#FFFFFF" opacity=".8"/>`;
      else { const q = (tt - 0.8) / 0.2; s += `<ellipse cx="${x}" cy="${W0.Y - 4}" rx="${f1(24 + 70 * q)}" ry="${f1(10 + 26 * q)}" fill="none" stroke="#E6FFF8" stroke-width="${f1(8 * (1 - q) + 1)}" opacity="${f2(1 - q)}"/>`; }
    }
    if (tt >= 1) s += `<ellipse cx="${wx - 10}" cy="${W0.Y - 4}" rx="70" ry="30" fill="#CDEFE6" opacity="${f2(0.4 * (o.sisaSabun ?? 1))}"/>`;
    // bola-bola (misel) hanyut ke saluran — digambar di atas wajan
    (o.saluran || []).forEach((b) => { if (b.k > 0) s += misel(b.x, b.y, b.r || 30, t, { k: 1, n: 10, topi: b.topi ?? 1, kilau: 0.8, sx: b.sx, sy: b.sy, rot: b.rot || 0, op: b.k }); });
    // keran + aliran air
    s += `<rect x="512" y="790" width="56" height="44" rx="10" fill="${D.bajaG}"/><path d="M540 800 L540 640 Q540 560 620 560 Q690 560 690 640 L690 660" stroke="${D.baja}" stroke-width="40" fill="none" stroke-linecap="round"/>
      <path d="M540 800 L540 640 Q540 580 600 572" stroke="#FFFFFF" stroke-width="10" fill="none" opacity=".45" stroke-linecap="round"/><rect x="668" y="648" width="44" height="26" rx="8" fill="${D.bajaG}"/>
      <rect x="470" y="770" width="50" height="22" rx="10" fill="${D.bajaG}"/>`;
    if (keran > 0.01) {
      const yTop = 676, yBot = W0.SY, len = (yBot - yTop) * Math.min(1, keran * 1.4);
      let pth = `M680 ${yTop}`;
      for (let i = 1; i <= 8; i++) { const y = yTop + (len * i) / 8, x = 680 + (W0.SX - 680) * (i / 8) ** 2 + Math.sin(t * 22 + i) * 3; pth += ` L${f1(x)} ${f1(y)}`; }
      s += `<path d="${pth}" stroke="url(#${id}a)" stroke-width="${f1(30 * keran)}" fill="none" stroke-linecap="round" opacity=".9"/><path d="${pth}" stroke="#FFFFFF" stroke-width="${f1(7 * keran)}" fill="none" opacity=".75" transform="translate(-6 0)"/>`;
      if (keran * 1.4 > 0.95) for (let i = 0; i < 6; i++) { const q = (t * 2.2 + i / 6) % 1, a = -Math.PI + (i / 5) * Math.PI;
        s += `<circle cx="${f1(W0.SX + Math.cos(a) * 70 * q)}" cy="${f1(W0.SY - Math.sin(Math.PI * q) * 46 + 8)}" r="${f1(7 * (1 - q) + 2)}" fill="#FFFFFF" opacity="${f2(0.9 * (1 - q) * keran)}"/>`; }
      s += `<ellipse cx="${W0.SX}" cy="${W0.SY + 10}" rx="${f1(54 + 8 * Math.sin(t * 12))}" ry="18" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="${f2(0.6 * keran)}"/>`;
    }
    return s;
  }

  // ---------- wajan dari atas (sampul) ----------
  function wajanAtas(t = 0, o = {}) {
    const id = uid("wa"), cx = 540, cy = 1010, R = 440;
    let s = `<defs><radialGradient id="${id}" cx=".46" cy=".44" r=".58"><stop offset="0" stop-color="#5A5468"/><stop offset=".75" stop-color="${D.wajan}"/><stop offset="1" stop-color="${D.wajanD}"/></radialGradient>
      <radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${S.LEMON}" stop-opacity=".55"/><stop offset="1" stop-color="${S.LEMON}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8C86A8"/><stop offset="1" stop-color="#4E4870"/></linearGradient></defs>`;
    // bak stainless kebiruan-ungu (tertimpa cahaya ungu)
    s += `<rect x="-200" y="200" width="1480" height="1620" rx="120" fill="url(#${id}b)"/><rect x="-120" y="270" width="1320" height="1480" rx="100" fill="#3E3862" opacity=".55"/>`;
    // gagang
    s += `<path d="M${cx - R + 40} ${cy + 120} L-160 ${cy + 420}" stroke="${D.gagang}" stroke-width="70" stroke-linecap="round"/><path d="M${cx - R + 40} ${cy + 120} L${cx - R - 70} ${cy + 190}" stroke="${D.wajanD}" stroke-width="62" stroke-linecap="round"/>`;
    s += `<circle cx="${cx + 18}" cy="${cy + 26}" r="${R + 10}" fill="#1C1830" opacity=".5"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="${D.wajanD}"/><circle cx="${cx}" cy="${cy}" r="${R - 34}" fill="url(#${id})"/>`;
    s += `<path d="M${cx - R + 60} ${cy - 120} A${R - 50} ${R - 50} 0 0 1 ${cx + 90} ${cy - R + 52}" stroke="#7A7490" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7"/>`;
    // cahaya minyak menyala
    s += `<circle cx="${cx}" cy="${cy + 10}" r="${R * 0.92}" fill="url(#${id}g)" opacity="${f2(o.kilap ?? 1)}"/>`;
    s += kilapMinyak(cx - 10, cy + 20, 290, 250, t, o.kilap ?? 1, { bintang: 40 });
    // butir air putih di atas minyak (menggelinding pelan)
    const bt = o.butir ?? 1;
    const pos = [[-150, -110, 30], [110, -60, 24], [40, 120, 34], [-90, 140, 20], [190, 90, 18], [-40, -10, 16]];
    pos.forEach(([dx, dy, r], i) => { const x = cx + dx + Math.sin(t * 0.9 + i) * 10, y = cy + 20 + dy + Math.cos(t * 0.7 + i * 2) * 8;
      s += `<g opacity="${f2(bt)}"><ellipse cx="${f1(x + 4)}" cy="${f1(y + r * 0.7)}" rx="${f1(r * 0.9)}" ry="${f1(r * 0.3)}" fill="${S.LEMONG}" opacity=".6"/>${butir(x, y, r, "#F2F5FF", t, { sy: 0.86 })}</g>`; });
    return s;
  }

  // ---------- tangan Tebe (lengan hoodie mustard) ----------
  function tanganTebe(x, y, rot, s = 1, t = 0, o = {}) {
    const K = "#F4C9A1", G = `stroke="#1E1E1E" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`, j = cl(o.jari || 0);
    // koordinat lokal: ujung jari di (0,0), lengan memanjang ke +x
    let h = `<path d="M150 -48 L760 -70 L760 70 L150 52Z" fill="#FFC93C" ${G}/><path d="M150 -48 L150 52" stroke="#E5A91A" stroke-width="16"/>
      <rect x="128" y="-58" width="44" height="120" rx="20" fill="#E5A91A" ${G}/>`;
    h += `<path d="M132 -46 Q70 -60 40 -40 L10 -34 Q-6 -30 -2 -14 Q2 -2 18 -4 L40 -6 L8 2 Q-8 8 -2 22 Q4 32 20 28 L44 22 L16 34 Q2 42 10 54 Q18 62 32 56 L58 46 Q70 60 96 58 L132 50Z" fill="${K}" ${G}/>`;
    h += `<path d="M96 -50 Q78 -86 52 -84 Q38 -82 44 -66 L62 -42" fill="${K}" ${G}/>`;
    if (j > 0) h += `<path d="M10 -20 q-10 ${f1(10 * j)} 0 ${f1(16 * j)}" stroke="#1E1E1E" stroke-width="4" fill="none"/>`;
    if (o.spons) h += `<g transform="translate(-10 66)"><rect x="-10" y="-14" width="150" height="70" rx="18" fill="#FFC93C" ${G}/><rect x="-10" y="38" width="150" height="20" rx="8" fill="#3FA86A" stroke="#1E1E1E" stroke-width="5"/></g>`;
    const kl = cl(o.kilap || 0);
    if (kl > 0) {
      h += `<g opacity="${f2(kl)}"><path d="M6 -28 L40 -32 M4 6 L44 0 M14 40 L54 34" stroke="${S.LEMON}" stroke-width="14" stroke-linecap="round" opacity=".85"/><path d="M8 -30 L26 -32 M6 4 L24 1" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>`;
      for (let i = 0; i < 3; i++) { const q = (t * 1.1 + i / 3) % 1, bx = [-26, -36, -16][i], by = [-44, 8, 52][i], z = 18 * Math.sin(Math.PI * q);
        h += `<path d="M${bx} ${f1(by - z)} Q${bx} ${by} ${f1(bx + z)} ${by} Q${bx} ${by} ${bx} ${f1(by + z)} Q${bx} ${by} ${f1(bx - z)} ${by} Q${bx} ${by} ${bx} ${f1(by - z)}Z" fill="#FFFFFF"/>`; }
      const dq = (t * 0.8) % 1; h += `<path d="M30 ${f1(46 + dq * 60)} q10 14 0 22 q-10 -8 0 -22Z" fill="${S.LEMON}" opacity="${f2(1 - dq)}"/></g>`;
    }
    return g(x, y, s, h, rot);
  }

  // ---------- penampang permukaan wajan ----------
  function penampang(t = 0, o = {}) {
    const id = uid("pn"), ly = o.lantai ?? 1380;
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A4C98"/><stop offset="1" stop-color="#C9C2F0"/></linearGradient>
      <linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E5870"/><stop offset=".12" stop-color="${D.wajan}"/><stop offset="1" stop-color="${D.wajanD}"/></linearGradient></defs>`;
    s += `<rect x="-400" y="-300" width="1880" height="2520" fill="url(#${id})"/>`;
    for (let i = 0; i < 14; i++) { const x = ((i * 157 + t * 18) % 1500) - 200, y = 200 + ((i * 263) % 1000); s += `<circle cx="${f1(x)}" cy="${y}" r="${4 + (i % 3) * 3}" fill="#FFFFFF" opacity=".18"/>`; }
    s += `<path d="M-400 ${ly} Q540 ${ly - 70} 1480 ${ly} L1480 2300 L-400 2300Z" fill="url(#${id}m)"/><path d="M-400 ${ly} Q540 ${ly - 70} 1480 ${ly}" stroke="#7D7790" stroke-width="10" fill="none"/>`;
    return s;
  }
  const lantaiY = (x, ly = 1380) => { const u = (x + 400) / 1880; return ly - 70 * 4 * u * (1 - u) * 0.5 * 2 / 2 * 1; };

  // ---------- arus air bilas ----------
  function arus(t, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    let s = ""; const y0 = o.y0 ?? 300, y1 = o.y1 ?? 1500, n = o.n || 12, laju = o.laju || 520;
    for (let i = 0; i < n; i++) {
      const y = y0 + ((i + 0.5) / n) * (y1 - y0), ph = (i * 0.37) % 1, L = 160 + (i % 3) * 80, x = ((t * laju + ph * 1500) % 1700) - 300;
      s += `<path d="M${f1(x)} ${f1(y)} q${f1(L * 0.5)} -14 ${f1(L)} 0" stroke="${o.warna || "#E6EAFF"}" stroke-width="${8 + (i % 2) * 4}" fill="none" stroke-linecap="round" opacity="${f2(0.5 * k)}"/>`;
    }
    return s;
  }
  function duniaXray(t = 0, o = {}) {
    const id = uid("dx");
    let s = `<defs><radialGradient id="${id}" cx=".5" cy=".46" r=".75"><stop offset="0" stop-color="${o.tengah || "#5B54B8"}"/><stop offset="1" stop-color="${o.tepi || S.UNGUT}"/></radialGradient></defs>
      <rect x="-600" y="-600" width="2280" height="3120" fill="url(#${id})"/>`;
    for (let i = 0; i < 26; i++) { const x = ((i * 211 + t * 14 * (1 + (i % 3))) % 1700) - 300, y = ((i * 337 + Math.sin(t * 0.5 + i) * 40) % 2200) - 140, r = 3 + (i % 4) * 3;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${S.AIRL}" opacity="${f2(0.12 + (i % 3) * 0.06)}"/>`; }
    return s;
  }

  // ---------- molekul sabun "kecebong" ----------
  function kecebong(x, y, s = 1, rot = 0, t = 0, o = {}) {
    const nk = cl(o.nyalaK || 0), ne = cl(o.nyalaE || 0), gy = o.goyang ?? 1, L = o.panjang || 120;
    let pts = "M34 0";
    for (let i = 1; i <= 8; i++) { const xx = 34 + (L * i) / 8, yy = (i % 2 ? -1 : 1) * 13 + Math.sin(t * 9 + i * 0.9) * 7 * gy * (i / 8); pts += ` L${f1(xx)} ${f1(yy)}`; }
    let h = "";
    if (ne > 0) h += `<path d="${pts}" stroke="${S.LEMON}" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${f2(0.35 * ne)}"/>`;
    if (nk > 0) h += `<circle r="${f1(56 + 6 * Math.sin(t * 6))}" fill="${S.AIRL}" opacity="${f2(0.45 * nk)}"/>`;
    h += `<path d="${pts}" stroke="${ne > 0.3 ? S.LEMONL : S.LEMON}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    h += `<circle r="34" fill="${S.KEPALA}"/><ellipse cx="-10" cy="-12" rx="12" ry="7" fill="#FFFFFF" transform="rotate(-30 -10 -12)"/><circle r="34" fill="none" stroke="#D8D2F0" stroke-width="5" opacity=".6"/>`;
    const mn = cl(o.minus || 0);
    if (mn > 0) h += `<g transform="rotate(${f1(-rot)}) scale(${f2(0.6 + 0.4 * mn)})" opacity="${f2(mn)}"><rect x="-15" y="-5" width="30" height="10" rx="5" fill="#5B4AB8"/></g>`;
    return g(x, y, s, h, rot);
  }

  // ---------- misel (bola kecil) ----------
  function topiKurir(x, y, s = 1, rot = 0) {
    return g(x, y, s, `<path d="M-46 0 Q-44 -52 0 -54 Q44 -52 46 0Z" fill="#E8793A"/><path d="M-46 0 Q-20 -10 0 -10 L70 -4 Q76 6 60 10 L-46 10Z" fill="#C9612A"/><rect x="-46" y="-14" width="92" height="12" fill="#FFF4DC"/><circle cx="0" cy="-54" r="6" fill="#C9612A"/>`, rot);
  }
  function misel(x, y, R, t = 0, o = {}) {
    const k = cl(o.k ?? 1), n = o.n || 14, rot = o.rot || 0, mn = cl(o.minus || 0), sx = o.sx || 1, sy = o.sy || 1, op = o.op ?? 1;
    const id = uid("ms");
    let h = `<defs><radialGradient id="${id}" cx=".42" cy=".4" r=".6"><stop offset="0" stop-color="${S.LEMONL}"/><stop offset=".6" stop-color="${S.LEMON}"/><stop offset="1" stop-color="${S.LEMONG}"/></radialGradient></defs>`;
    const kil = o.kilau ?? 0;
    if (kil > 0) h += `<circle r="${f1(R * 1.45)}" fill="${S.LEMON}" opacity="${f2(0.18 * kil)}"/>`;
    h += `<circle r="${f1(R * 0.62)}" fill="url(#${id})"/>`;
    const sc = R / 200; // kecebong di cincin R=200 → skala 1
    for (let i = 0; i < n; i++) {
      const q = cl(k * n - i * 0.65), a = (i / n) * Math.PI * 2 + rot * Math.PI / 180;
      if (q <= 0) continue;
      const rr = R * (1 + 2.5 * (1 - q) ** 2), hx = Math.cos(a) * rr, hy = Math.sin(a) * rr, deg = (a * 180) / Math.PI + 180;
      h += `<g opacity="${f2(Math.min(1, q * 3))}">${kecebong(hx, hy, sc * 1.0, deg, t + i, { panjang: 120, goyang: 0.5, minus: mn })}</g>`;
    }
    if (o.topi > 0) h += `<g opacity="${f2(o.topi)}">${topiKurir(0, -R * 1.02, sc * 2.1, -8)}</g>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(sx)} ${f2(sy)})" opacity="${f2(op)}">${h}</g>`;
  }

  // ---------- ikon kartu pilihan (tanpa huruf) ----------
  function ikonGelas(t = 0) { const w = Math.sin(t * 3) * 4;
    return `<path d="M-54 -84 L54 -84 L42 84 L-42 84Z" fill="#E6F6FB"/><path d="M-50 -20 Q0 ${f1(-30 + w)} 50 -20 L42 84 L-42 84Z" fill="#9FD3E6"/><path d="M-34 -70 L-26 70" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity=".8"/>`; }
  function ikonPiring() { return `<ellipse cx="0" cy="10" rx="104" ry="70" fill="#F4F1EA"/><ellipse cx="0" cy="10" rx="66" ry="42" fill="#E4DDD0"/><path d="M-70 -20 Q-40 -50 10 -52" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="30" cy="16" r="10" fill="${S.LEMON}"/>`; }
  function ikonWajan() { return `<path d="M50 -10 L118 -66" stroke="${D.gagang}" stroke-width="22" stroke-linecap="round"/><ellipse cx="-14" cy="10" rx="96" ry="64" fill="${D.wajanD}"/><ellipse cx="-14" cy="14" rx="76" ry="48" fill="${D.wajanT}"/><ellipse cx="-20" cy="18" rx="40" ry="22" fill="${S.LEMON}"/><path d="M-40 10 q14 -8 30 -6" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round"/>`; }

  Object.assign(A, { SABUN, WAJAN, bakCuci, wajanAtas, tanganTebe, butir, genanganMinyak: genangan, kilapMinyak, penampang, lantaiY, arus, duniaXray, kecebong, misel, topiKurir, ikonGelas, ikonPiring, ikonWajan });
})(typeof window !== "undefined" ? window : globalThis);
