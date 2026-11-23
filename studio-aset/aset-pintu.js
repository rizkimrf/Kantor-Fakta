/* ASET PINTU OTOMATIS (Yoga, 24 Nov 2026; dipakai A3-02 "Pintu minimarket kok tahu kamu mau masuk?"). Muat SETELAH aset-set.js.
 * Gaya: datar tanpa garis hitam, senja oranye-krem + gelombang hijau-mint + berkas infra merah merah-muda. TANPA merek/tulisan/angka toko.
 *  PINTU            — geometri bersama tampak depan: {CX, DW (lebar 1 daun), ATAS, BAWAH, KX, KY (pusat kotak sensor)}
 *  tokoDepan(t,{buka 0..1, kedut, kotak:{nyala,wajah,buangMuka,siul}, cahaya, blurDalam}) — fasad toko senja 1080x1920: kanopi polos,
 *        etalase kaca + rak buram, pintu geser kaca 2 daun (buka = jarak geser), kepala pintu + kotak sensor, trotoar keramik
 *  kotakSensor(x,y,s,t,{nyala,wajah,buangMuka,siul,lensa}) — kotak sensor polos (tanpa logo) + LED mint; opsi wajah kartun (canda)
 *  kerucut(x,y,t,{arah,lebar,panjang,k,jarak,warna}) — busur gelombang mint memancar dari titik (kerucut)
 *  pejalan(x,y,s,t,{hadap:'kanan'|'kiri'|'belakang'|'depan', jalan 0..1, laju, lambai 0..1, goyang 0..1, lega 0..1, lirik, kaku})
 *        — figur penonton GENERIK (bukan Tebe): kaos biru, celana gelap, sandal. Kaki di (x,y), tinggi ±590*s
 *  lebarBadan(dy) — setengah lebar badan figur tampak depan pada ketinggian dy (px di atas kaki, s=1) → tirai infra merah terputus tepat di badan
 *  tirai(t,{k, ys, x0, x1, blok:[xl,xr,yTop], denyut}) — berkas infra merah tipis di celah pintu, putus & berpendar di badan
 *  denah(t,{buka, nyala, percik 0..1, sabuk}) — TAMPAK ATAS x-ray: lantai toko, dinding, rel + 2 daun pintu, motor + sabuk, kotak sensor
 *  orangAtas(x,y,s,t,{rot, jalan}) — figur dari atas (bahu, kepala, kaki melangkah) · gelombangKeluar(t,P,{...}) · gelombangPantul(x,y,P,sp,{...})
 *  ikonJalan(x,y,s,t,k) · ikonDiri(x,y,s,k) · ikonLambai(t) · ikonMundur(t) — ikon panel pilihan/terbelah (tanpa huruf) */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let _n = 0; const uid = (p) => `${p}P${++_n}`;
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;
  const MINT = "#5EF2C0", MINTL = "#C9FFEA", IR = "#FF4F7B", IRL = "#FFB3C6";
  const W = { langit0: "#E58E5A", langit1: "#F7D2A2", dinding: "#F2DDBC", dindingB: "#E2C49B", kanopi: "#E8793A", kanopiB: "#C9612A", kusen: "#9C8C84", kusenG: "#7C6E68",
    dalam0: "#FFF3D6", dalam1: "#FFD18A", kaca: "#D9F2EC", trotoar: "#D7B087", trotoarG: "#C39A70", jalan: "#7A6560", bayang: "rgba(70,40,20,.22)" };
  const PINTU = { CX: 540, DW: 300, ATAS: 720, BAWAH: 1420, KX: 540, KY: 668, GESER: 262 };

  // ---------- kotak sensor ----------
  function kotakSensor(x, y, s, t = 0, o = {}) {
    const ny = cl(o.nyala || 0), wj = cl(o.wajah || 0), bm = o.buangMuka || 0;
    let isi = `<rect x="-78" y="-26" width="156" height="60" rx="14" fill="#000" opacity=".16" transform="translate(6 8)"/>
      <rect x="-78" y="-30" width="156" height="60" rx="14" fill="#B9B3AE"/><rect x="-78" y="-30" width="156" height="16" rx="8" fill="#D2CCC6"/>
      <rect x="-58" y="-6" width="116" height="28" rx="12" fill="#3E3A44"/>
      <ellipse cx="0" cy="8" rx="${f1(48 + 14 * ny)}" ry="${f1(12 + 5 * ny)}" fill="${MINT}" opacity="${f2(0.12 + 0.7 * ny)}"/>
      <circle cx="62" cy="-14" r="6" fill="${ny > 0.08 ? MINT : "#7D8A84"}" opacity="${f2(0.5 + 0.5 * ny)}"/>`;
    if (ny > 0.02) isi += `<circle cx="0" cy="8" r="${f1(70 + 50 * ny)}" fill="${MINT}" opacity="${f2(0.16 * ny)}"/>`;
    if (wj > 0) { // wajah kartun di lensa (canda "buang muka & bersiul")
      const ex = -bm * 20, ey = -bm * 4;
      isi += `<g opacity="${f2(wj)}"><ellipse cx="${f1(-24 + ex)}" cy="${f1(6 + ey)}" rx="11" ry="${f1(12 - 4 * bm)}" fill="#FFFFFF"/><ellipse cx="${f1(24 + ex)}" cy="${f1(6 + ey)}" rx="11" ry="${f1(12 - 4 * bm)}" fill="#FFFFFF"/>
        <circle cx="${f1(-28 + ex * 1.2)}" cy="${f1(6 + ey)}" r="5" fill="#1E1E24"/><circle cx="${f1(20 + ex * 1.2)}" cy="${f1(6 + ey)}" r="5" fill="#1E1E24"/>
        ${o.siul ? `<ellipse cx="${f1(-2 + ex * 1.4)}" cy="28" rx="6" ry="7" fill="#1E1E24"/>` : ""}</g>`;
      if (o.siul) for (let i = 0; i < 2; i++) { const q = (t * 0.8 + i * 0.5) % 1;
        isi += `<g transform="translate(${f1(-70 - q * 90)} ${f1(-10 - q * 120 + Math.sin(q * 9) * 10)}) rotate(${f1(-15 + Math.sin(q * 6) * 15)})" opacity="${f2(o.siul * Math.sin(Math.PI * q))}"><ellipse cx="0" cy="22" rx="13" ry="10" fill="${W.kanopi}"/><path d="M11 22 L11 -18 Q26 -12 30 0" stroke="${W.kanopi}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`; }
    }
    return g(x, y, s, isi);
  }

  // ---------- busur gelombang (kerucut) ----------
  function kerucut(x, y, t, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    const arah = ((o.arah ?? 90) * Math.PI) / 180, lb = ((o.lebar ?? 34) * Math.PI) / 180, pj = o.panjang || 900, jr = o.jarak || 90, c = o.warna || MINT;
    let s = `<path d="M${x} ${y} L${f1(x + pj * Math.cos(arah - lb))} ${f1(y + pj * Math.sin(arah - lb))} A${pj} ${pj} 0 0 1 ${f1(x + pj * Math.cos(arah + lb))} ${f1(y + pj * Math.sin(arah + lb))}Z" fill="${c}" opacity="${f2(0.13 * k)}"/>`;
    const fase = ((t * (o.laju || 160)) / jr) % 1;
    for (let j = 0; j * jr < pj + jr; j++) { const r = (j + fase) * jr; if (r < 24 || r > pj) continue;
      const a = Math.min(1, (pj - r) / 200, r / 80) * k;
      s += `<path d="M${f1(x + r * Math.cos(arah - lb))} ${f1(y + r * Math.sin(arah - lb))} A${f1(r)} ${f1(r)} 0 0 1 ${f1(x + r * Math.cos(arah + lb))} ${f1(y + r * Math.sin(arah + lb))}" stroke="${c}" stroke-width="${f1(o.tebal || 10)}" fill="none" stroke-linecap="round" opacity="${f2(0.85 * a)}"/>`; }
    return s;
  }

  // ---------- figur penonton generik ----------
  const KUL = "#C98F6A", KULG = "#B07A58", RAMB = "#2A2020", BAJU = "#4F78B5", BAJUG = "#3F659E", CEL = "#3A3F55", SND = "#2E3440";
  function lebarBadan(dy) { if (dy < 0) return 0; if (dy < 250) return 58; if (dy < 470) return 104; if (dy < 500) return 26; if (dy < 600) return 60; return 0; }
  function pejalan(x, y, s, t = 0, o = {}) {
    const hd = o.hadap || "kanan", jl = cl(o.jalan || 0), ph = t * (o.laju || 8.5), ay = Math.sin(ph) * jl, bob = Math.abs(Math.cos(ph)) * 10 * jl + Math.sin(t * 2.1) * 2;
    let s2 = `<ellipse cx="0" cy="6" rx="${hd === "kanan" || hd === "kiri" ? 96 : 110}" ry="16" fill="${W.bayang}"/>`;
    const kepalaY = -540 - bob;
    if (hd === "kanan" || hd === "kiri") {
      const sx = hd === "kanan" ? 1 : -1, kaki = (a, w) => { const r = a * 30 * jl, rr = (r * Math.PI) / 180, kx = Math.sin(rr) * 250, ky = -250 + Math.cos(rr) * 250 - bob;
        return `<path d="M0 ${f1(-250 - bob)} L${f1(kx)} ${f1(ky)}" stroke="${w}" stroke-width="50" stroke-linecap="round"/><path d="M${f1(kx - 14)} ${f1(ky + 10)} L${f1(kx + 40)} ${f1(ky + 10)}" stroke="${SND}" stroke-width="20" stroke-linecap="round"/>`; };
      const tangan = (a, w) => { const r = (-a * 26 * jl * Math.PI) / 180, hx = Math.sin(r) * 210, hy = -460 - bob + Math.cos(r) * 210;
        return `<path d="M0 ${f1(-450 - bob)} L${f1(hx)} ${f1(hy)}" stroke="${w}" stroke-width="40" stroke-linecap="round"/><circle cx="${f1(hx)}" cy="${f1(hy + 6)}" r="22" fill="${KUL}"/>`; };
      let b = kaki(-ay, "#2E3346") + tangan(-ay, BAJUG);
      b += `<path d="M-52 ${f1(-480 - bob)} Q0 ${f1(-500 - bob)} 52 ${f1(-480 - bob)} L58 ${f1(-238 - bob)} L-58 ${f1(-238 - bob)}Z" fill="${BAJU}"/>`;
      b += kaki(ay, CEL);
      b += `<rect x="-18" y="${f1(-512 - bob)}" width="36" height="40" rx="12" fill="${KULG}"/><ellipse cx="6" cy="${f1(kepalaY)}" rx="62" ry="70" fill="${KUL}"/><circle cx="62" cy="${f1(kepalaY + 8)}" r="10" fill="${KUL}"/>
        <path d="M-58 ${f1(kepalaY - 4)} Q-64 ${f1(kepalaY - 84)} 10 ${f1(kepalaY - 76)} Q70 ${f1(kepalaY - 74)} 66 ${f1(kepalaY - 26)} Q30 ${f1(kepalaY - 46)} -10 ${f1(kepalaY - 30)} Q-30 ${f1(kepalaY + 10)} -58 ${f1(kepalaY - 4)}Z" fill="${RAMB}"/>
        <circle cx="38" cy="${f1(kepalaY - 2)}" r="7" fill="#2A2020"/><path d="M30 ${f1(kepalaY + 30)} Q44 ${f1(kepalaY + 36)} 54 ${f1(kepalaY + 26)}" stroke="#2A2020" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      b += tangan(ay, BAJU);
      return g(x, y, s, `<g transform="scale(${sx} 1)">${s2}${b}</g>`);
    }
    // tampak depan / belakang
    const dep = hd === "depan", kaku = o.kaku || 0, lb = cl(o.lambai || 0), gy = cl(o.goyang || 0), lg = cl(o.lega || 0);
    const angkat = (i) => Math.max(0, Math.sin(ph + i * Math.PI)) * 34 * jl;
    s2 += [-1, 1].map((sx, i) => `<rect x="${sx < 0 ? -56 : 10}" y="${f1(-252 - bob)}" width="46" height="${f1(252 + bob - angkat(i))}" rx="20" fill="${CEL}"/><ellipse cx="${sx * 33}" cy="${f1(-6 - angkat(i))}" rx="30" ry="14" fill="${SND}"/>`).join("");
    s2 += `<path d="M-84 ${f1(-478 - bob)} Q0 ${f1(-506 - bob)} 84 ${f1(-478 - bob)} L96 ${f1(-236 - bob)} L-96 ${f1(-236 - bob)}Z" fill="${dep ? BAJU : BAJUG}"/><path d="M0 ${f1(-490 - bob)} L18 ${f1(-236 - bob)} L96 ${f1(-236 - bob)} L84 ${f1(-478 - bob)}Z" fill="${dep ? BAJUG : BAJU}" opacity=".7"/>`;
    const lengan = (sx) => {
      let ex, ey, cx, cy; const ay2 = Math.sin(ph + (sx > 0 ? 0 : Math.PI)) * 18 * jl;
      ex = sx * 90 + ay2 * 0.3; ey = -232 - bob; cx = sx * 108; cy = -340 - bob;
      const kanan = dep ? sx < 0 : sx > 0; // tangan kanan figur
      if (kanan && lb > 0) { const w = Math.sin(t * 11) * 26 * lb; ex = lerp(ex, sx * 150 + w, lb); ey = lerp(ey, -720 - bob, lb); cx = lerp(cx, sx * 170, lb); cy = lerp(cy, -520 - bob, lb); }
      if (gy > 0) { const w = Math.sin(t * 13 + sx * 1.3) * 60 * gy; ex = lerp(ex, sx * (190 + w * 0.4), gy); ey = lerp(ey, -560 - bob + w, gy); cx = lerp(cx, sx * 170, gy); cy = lerp(cy, -470 - bob, gy); }
      if (!kanan && lg > 0) { ex = lerp(ex, sx * 30, lg); ey = lerp(ey, -600 - bob, lg); cx = lerp(cx, sx * 150, lg); cy = lerp(cy, -470 - bob, lg); }
      if (kaku > 0) { ex = lerp(ex, sx * 84, kaku); ey = lerp(ey, -226 - bob, kaku); cx = lerp(cx, sx * 96, kaku); cy = lerp(cy, -330 - bob, kaku); }
      return `<path d="M${sx * 70} ${f1(-452 - bob)} Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}" stroke="${dep ? BAJU : BAJUG}" stroke-width="40" stroke-linecap="round" fill="none"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="23" fill="${KUL}"/>`;
    };
    const lirik = o.lirik || 0;
    const kepala = `<rect x="-22" y="${f1(-530 - bob)}" width="44" height="56" rx="16" fill="${KULG}"/><ellipse cx="0" cy="${f1(kepalaY)}" rx="62" ry="72" fill="${KUL}"/>` + (dep
      ? `<path d="M-64 ${f1(kepalaY - 10)} Q-70 ${f1(kepalaY - 92)} 0 ${f1(kepalaY - 84)} Q70 ${f1(kepalaY - 92)} 64 ${f1(kepalaY - 10)} Q44 ${f1(kepalaY - 58)} 0 ${f1(kepalaY - 54)} Q-44 ${f1(kepalaY - 58)} -64 ${f1(kepalaY - 10)}Z" fill="${RAMB}"/>
        <ellipse cx="-22" cy="${f1(kepalaY + 2)}" rx="11" ry="${f1(12 + 3 * kaku)}" fill="#FFFFFF"/><ellipse cx="22" cy="${f1(kepalaY + 2)}" rx="11" ry="${f1(12 + 3 * kaku)}" fill="#FFFFFF"/>
        <circle cx="${f1(-22 + lirik * 6)}" cy="${f1(kepalaY + 3)}" r="6" fill="#2A2020"/><circle cx="${f1(22 + lirik * 6)}" cy="${f1(kepalaY + 3)}" r="6" fill="#2A2020"/>
        ${kaku > 0.5 ? `<path d="M-16 ${f1(kepalaY + 36)} Q-8 ${f1(kepalaY + 30)} 0 ${f1(kepalaY + 36)} Q8 ${f1(kepalaY + 42)} 16 ${f1(kepalaY + 36)}" stroke="#2A2020" stroke-width="5" fill="none" stroke-linecap="round"/>`
          : `<path d="M-16 ${f1(kepalaY + 30)} Q0 ${f1(kepalaY + 42 + 6 * lg)} 16 ${f1(kepalaY + 30)}" stroke="#2A2020" stroke-width="5" fill="none" stroke-linecap="round"/>`}
        ${kaku > 0.5 ? `<path d="M60 ${f1(kepalaY - 30)} q10 18 0 28 q-10 -10 0 -28Z" fill="#8FD8F0" opacity="${f2(kaku)}"/>` : ""}`
      : `<path d="M-66 ${f1(kepalaY + 20)} Q-74 ${f1(kepalaY - 92)} 0 ${f1(kepalaY - 84)} Q74 ${f1(kepalaY - 92)} 66 ${f1(kepalaY + 20)} Q40 ${f1(kepalaY + 40)} 0 ${f1(kepalaY + 38)} Q-40 ${f1(kepalaY + 40)} -66 ${f1(kepalaY + 20)}Z" fill="${RAMB}"/>`);
    return g(x, y, s, `${s2}${lengan(-1)}${lengan(1)}${kepala}`);
  }
  const lerp = (a, b, k) => a + (b - a) * k;

  // ---------- fasad toko senja (tampak depan) ----------
  function tokoDepan(t = 0, o = {}) {
    const P = PINTU, bk = cl(o.buka || 0), kd = o.kedut || 0, gs = P.GESER * bk + kd, idL = uid("lg"), idD = uid("dl"), idK = uid("kc"), idB = uid("bl"), idC = uid("cp");
    const x0 = P.CX - P.DW, x1 = P.CX + P.DW;
    let s = `<defs><linearGradient id="${idL}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${W.langit0}"/><stop offset="1" stop-color="${W.langit1}"/></linearGradient>
      <linearGradient id="${idD}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${W.dalam0}"/><stop offset="1" stop-color="${W.dalam1}"/></linearGradient>
      <linearGradient id="${idK}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".34"/><stop offset=".5" stop-color="${W.kaca}" stop-opacity=".1"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".22"/></linearGradient>
      <filter id="${idB}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${o.blurDalam ?? 7}"/></filter>
      <clipPath id="${idC}"><rect x="40" y="590" width="1000" height="${P.BAWAH - 590}"/></clipPath></defs>`;
    s += `<rect x="-400" y="-400" width="1880" height="1000" fill="url(#${idL})"/><circle cx="880" cy="250" r="120" fill="#FFE7B8" opacity=".55"/><circle cx="880" cy="250" r="240" fill="#FFE7B8" opacity=".18"/>`;
    s += `<rect x="-400" y="380" width="1880" height="${P.BAWAH - 380}" fill="${W.dinding}"/><rect x="-400" y="380" width="1880" height="24" fill="${W.dindingB}"/>`;
    // kanopi polos tanpa tulisan
    s += `<rect x="-400" y="430" width="1880" height="110" fill="${W.kanopi}"/><rect x="-400" y="520" width="1880" height="20" fill="${W.kanopiB}"/>`;
    for (let i = -4; i < 18; i++) s += `<path d="M${i * 90} 540 q45 34 90 0Z" fill="${i % 2 ? W.kanopi : "#F7E6C8"}"/>`;
    // etalase & interior hangat
    s += `<rect x="40" y="590" width="1000" height="${P.BAWAH - 590}" fill="url(#${idD})"/>`;
    s += `<g filter="url(#${idB})" opacity=".92">${A.rakMinimarket(70, 760, 300, 560, A.PALET.siang, { benih: 5 })}${A.rakMinimarket(710, 760, 300, 560, A.PALET.siang, { benih: 8 })}${A.rakMinimarket(390, 860, 300, 460, A.PALET.siang, { benih: 11, tingkat: 4 })}
      <rect x="40" y="610" width="1000" height="40" fill="#FFFFFF" opacity=".5"/>${[0, 1, 2, 3].map((i) => `<rect x="${110 + i * 240}" y="620" width="140" height="18" rx="9" fill="#FFFFFF" opacity=".9"/>`).join("")}</g>`;
    s += `<rect x="40" y="590" width="1000" height="${P.BAWAH - 590}" fill="#FFB060" opacity="${f2(0.08 + 0.1 * (o.cahaya || 0))}"/>`;
    // kaca tetap kiri-kanan
    s += `<rect x="40" y="590" width="${x0 - 40}" height="${P.BAWAH - 590}" fill="url(#${idK})"/><rect x="${x1}" y="590" width="${1040 - x1}" height="${P.BAWAH - 590}" fill="url(#${idK})"/>`;
    // daun pintu geser
    const daun = (xa, w) => `<rect x="${f1(xa)}" y="${P.ATAS}" width="${w}" height="${P.BAWAH - P.ATAS}" fill="${W.kaca}" opacity=".22"/><rect x="${f1(xa)}" y="${P.ATAS}" width="${w}" height="${P.BAWAH - P.ATAS}" fill="url(#${idK})"/>
      <rect x="${f1(xa)}" y="${P.ATAS}" width="${w}" height="${P.BAWAH - P.ATAS}" fill="none" stroke="${W.kusen}" stroke-width="18"/><path d="M${f1(xa + 40)} ${P.ATAS + 120} L${f1(xa + 110)} ${P.ATAS + 40} M${f1(xa + 40)} ${P.ATAS + 210} L${f1(xa + 190)} ${P.ATAS + 60}" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity=".45"/>`;
    s += `<g clip-path="url(#${idC})">${daun(x0 - gs, P.DW)}${daun(P.CX + gs, P.DW)}</g>`;
    if (o.garisGerak > 0) { const k = o.garisGerak; for (let i = 0; i < 3; i++) { const yy = 900 + i * 160; s += `<path d="M${f1(x0 - gs - 30)} ${yy} l${f1(-90 * k)} 0 M${f1(x1 + gs + 30)} ${yy} l${f1(90 * k)} 0" stroke="#FFF6DA" stroke-width="10" stroke-linecap="round" opacity="${f2(0.8 * k)}"/>`; } }
    // kusen & kepala pintu
    s += `<rect x="30" y="580" width="1020" height="20" fill="${W.kusen}"/><rect x="30" y="${P.BAWAH - 10}" width="1020" height="20" fill="${W.kusenG}"/><rect x="30" y="580" width="20" height="${P.BAWAH - 580}" fill="${W.kusen}"/><rect x="1030" y="580" width="20" height="${P.BAWAH - 580}" fill="${W.kusen}"/>
      <rect x="${x0 - 30}" y="600" width="${2 * P.DW + 60}" height="${P.ATAS - 600}" fill="${W.kusen}"/><rect x="${x0 - 30}" y="${P.ATAS - 16}" width="${2 * P.DW + 60}" height="16" fill="${W.kusenG}"/>
      <rect x="${x0 - 22}" y="${P.ATAS}" width="22" height="${P.BAWAH - P.ATAS}" fill="${W.kusenG}"/><rect x="${x1}" y="${P.ATAS}" width="22" height="${P.BAWAH - P.ATAS}" fill="${W.kusenG}"/>`;
    s += kotakSensor(P.KX, P.KY, 1, t, o.kotak || {});
    // trotoar keramik dengan perspektif + tumpahan cahaya
    s += `<rect x="-400" y="${P.BAWAH + 10}" width="1880" height="900" fill="${W.trotoar}"/>`;
    for (let i = -8; i <= 8; i++) s += `<path d="M${540 + i * 150} ${P.BAWAH + 10} L${540 + i * 420} 2400" stroke="${W.trotoarG}" stroke-width="5" opacity=".7"/>`;
    for (const yy of [1490, 1590, 1730, 1920, 2180]) s += `<rect x="-400" y="${yy}" width="1880" height="5" fill="${W.trotoarG}" opacity=".7"/>`;
    s += `<path d="M${x0 - gs * 0.2} ${P.BAWAH + 10} L${x1 + gs * 0.2} ${P.BAWAH + 10} L${x1 + 260} 2100 L${x0 - 260} 2100Z" fill="#FFE2A6" opacity="${f2(0.16 + 0.2 * bk)}"/>`;
    // tanaman pot kiri-kanan (kedalaman)
    for (const [px, sk] of [[-10, 1], [1090, -1]]) s += `<g transform="translate(${px} ${P.BAWAH + 40}) scale(${sk} 1)"><path d="M-10 -10 L120 -10 L100 120 L10 120Z" fill="#B5654A"/><ellipse cx="60" cy="-120" rx="70" ry="110" fill="#5E9A6A"/><ellipse cx="20" cy="-60" rx="50" ry="70" fill="#4C8458"/><ellipse cx="100" cy="-50" rx="40" ry="60" fill="#6EAA78"/></g>`;
    return s;
  }

  // ---------- tirai berkas infra merah (tampak depan) ----------
  function tirai(t, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    const ys = o.ys || [800, 900, 1020, 1140, 1260, 1370], xa = o.x0 ?? PINTU.CX - PINTU.DW + 4, xb = o.x1 ?? PINTU.CX + PINTU.DW - 4, bl = o.blok, dn = o.denyut || 0;
    let s = "";
    ys.forEach((y, i) => {
      const muncul = cl(k * 1.6 - i * 0.12);
      if (muncul <= 0) return;
      let ujung = lerp(xa, xb, muncul), putus = false;
      if (bl && y > bl[2]) { const xl = bl[0](y); if (xl < ujung) { ujung = xl; putus = true; } }
      const fl = 0.75 + 0.25 * Math.sin(t * 9 + i * 1.7);
      s += `<line x1="${xa}" y1="${y}" x2="${f1(ujung)}" y2="${y}" stroke="${IR}" stroke-width="18" opacity="${f2(0.22 * fl)}" stroke-linecap="round"/><line x1="${xa}" y1="${y}" x2="${f1(ujung)}" y2="${y}" stroke="${IRL}" stroke-width="5" opacity="${f2(0.9 * fl)}" stroke-linecap="round"/>`;
      s += `<rect x="${xa - 18}" y="${y - 12}" width="20" height="24" rx="6" fill="#5A4048"/><circle cx="${xa}" cy="${y}" r="6" fill="${IR}"/>`;
      s += `<rect x="${xb - 2}" y="${y - 12}" width="20" height="24" rx="6" fill="#5A4048"/><circle cx="${xb}" cy="${y}" r="6" fill="${putus ? "#6E5A60" : IR}" opacity="${putus ? 1 : f2(fl)}"/>`;
      if (putus) { const p = 1 + 0.6 * dn * Math.abs(Math.sin(t * 8 + i)); s += `<circle cx="${f1(ujung)}" cy="${y}" r="${f1(16 * p)}" fill="${IR}" opacity=".35"/><circle cx="${f1(ujung)}" cy="${y}" r="${f1(8 * p)}" fill="#FFFFFF" opacity=".9"/>`; }
    });
    return s;
  }

  // ---------- denah tampak atas (x-ray) ----------
  const DN = { dinding: 580, kx: 540, ky: 640, motorX: 190 };
  function denah(t, o = {}) {
    const bk = cl(o.buka || 0), ny = cl(o.nyala || 0), x0 = PINTU.CX - PINTU.DW, x1 = PINTU.CX + PINTU.DW, gs = PINTU.GESER * bk, id = uid("dn");
    let s = `<defs><pattern id="${id}" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="${W.trotoar}"/><path d="M0 0 H120 M0 0 V120" stroke="${W.trotoarG}" stroke-width="5"/></pattern></defs>`;
    s += `<rect x="-400" y="-400" width="1880" height="${DN.dinding + 400}" fill="#F5E2BF"/>`;
    for (let i = 0; i < 4; i++) s += `<rect x="${60 + i * 260}" y="70" width="200" height="380" rx="16" fill="#E7CDA2"/><rect x="${76 + i * 260}" y="86" width="168" height="348" rx="10" fill="${A.PRODUK[i * 2 % 8]}" opacity=".35"/>`;
    s += `<rect x="-400" y="${DN.dinding + 30}" width="1880" height="1800" fill="url(#${id})"/>`;
    s += `<rect x="-400" y="${DN.dinding - 20}" width="${x0 + 400}" height="50" fill="${W.dindingB}"/><rect x="${x1}" y="${DN.dinding - 20}" width="${1480 - x1}" height="50" fill="${W.dindingB}"/>`;
    // rel + daun pintu (garis kaca tebal)
    s += `<rect x="${x0 - 300}" y="${DN.dinding - 4}" width="${2 * PINTU.DW + 600}" height="12" rx="6" fill="#8C7E78" opacity=".55"/>`;
    s += `<rect x="${f1(x0 - gs)}" y="${DN.dinding - 10}" width="${PINTU.DW}" height="24" rx="10" fill="#BFE8E0" stroke="${W.kusen}" stroke-width="6"/><rect x="${f1(PINTU.CX + gs)}" y="${DN.dinding - 10}" width="${PINTU.DW}" height="24" rx="10" fill="#BFE8E0" stroke="${W.kusen}" stroke-width="6"/>`;
    // motor + sabuk (x-ray, garis putus bergerak)
    const sb = o.sabuk || 0;
    s += `<rect x="${DN.motorX - 60}" y="${DN.dinding - 58}" width="${x1 + 60 - DN.motorX}" height="30" rx="15" fill="none" stroke="#6B5E5A" stroke-width="8" stroke-dasharray="26 18" stroke-dashoffset="${f1(-sb * 400)}" opacity=".8"/>`;
    s += `<circle cx="${DN.motorX - 40}" cy="${DN.dinding - 43}" r="44" fill="#6B5E5A"/><circle cx="${DN.motorX - 40}" cy="${DN.dinding - 43}" r="24" fill="#8C7E78"/><path d="M${DN.motorX - 40} ${DN.dinding - 43} l${f1(20 * Math.cos(sb * 20))} ${f1(20 * Math.sin(sb * 20))}" stroke="#F2DDBC" stroke-width="8" stroke-linecap="round"/>`;
    // kabel kotak → motor + percik
    const kab = `M${DN.kx - 60} ${DN.ky - 10} Q${(DN.kx + DN.motorX) / 2} ${DN.dinding - 110} ${DN.motorX} ${DN.dinding - 70}`;
    s += `<path d="${kab}" stroke="#6B5E5A" stroke-width="6" fill="none" stroke-dasharray="4 10" opacity=".9"/>`;
    const pc = o.percik || 0;
    if (pc > 0 && pc < 1) { const q = pc, x = lerp(DN.kx - 60, DN.motorX, q), yA = lerp(DN.ky - 10, DN.dinding - 70, q) - Math.sin(Math.PI * q) * 70;
      s += `<circle cx="${f1(x)}" cy="${f1(yA)}" r="26" fill="${MINT}" opacity=".35"/><circle cx="${f1(x)}" cy="${f1(yA)}" r="12" fill="#FFFFFF"/>`; }
    if (o.motorNyala > 0) s += `<circle cx="${DN.motorX - 40}" cy="${DN.dinding - 43}" r="${f1(60 + 10 * Math.sin(t * 20))}" fill="${MINT}" opacity="${f2(0.3 * o.motorNyala)}"/>`;
    // kotak sensor (tampak atas, di kepala pintu)
    s += `<rect x="${DN.kx - 70}" y="${DN.ky - 30}" width="140" height="56" rx="14" fill="#B9B3AE"/><rect x="${DN.kx - 50}" y="${DN.ky - 4}" width="100" height="24" rx="10" fill="#3E3A44"/><ellipse cx="${DN.kx}" cy="${DN.ky + 8}" rx="${f1(40 + 14 * ny)}" ry="10" fill="${MINT}" opacity="${f2(0.15 + 0.75 * ny)}"/>`;
    if (ny > 0.02) s += `<circle cx="${DN.kx}" cy="${DN.ky}" r="${f1(90 + 40 * ny)}" fill="${MINT}" opacity="${f2(0.2 * ny)}"/>`;
    return s;
  }
  function orangAtas(x, y, s, t, o = {}) {
    const jl = cl(o.jalan || 0), ph = t * 8.5, a = Math.sin(ph) * 34 * jl;
    const isi = `<ellipse cx="0" cy="8" rx="84" ry="54" fill="${W.bayang}"/>
      <ellipse cx="-24" cy="${f1(-a)}" rx="17" ry="30" fill="${SND}"/><ellipse cx="24" cy="${f1(a)}" rx="17" ry="30" fill="${SND}"/>
      <ellipse cx="-74" cy="${f1(a * 0.6)}" rx="20" ry="30" fill="${BAJUG}"/><ellipse cx="74" cy="${f1(-a * 0.6)}" rx="20" ry="30" fill="${BAJUG}"/>
      <ellipse cx="0" cy="6" rx="70" ry="38" fill="${BAJU}"/><circle cx="0" cy="-2" r="38" fill="${RAMB}"/><ellipse cx="0" cy="-36" rx="14" ry="8" fill="${KUL}"/>`;
    return g(x, y, s, isi, o.rot || 0);
  }
  // gelombang keluar dari kotak (setengah lingkaran ke bawah). P = fase kumulatif (jumlah muka gelombang), sp = jarak antar busur
  function gelombangKeluar(t, P, o = {}) {
    const sp = o.sp || 110, mx = o.maks || 1250, k = o.k ?? 1; let s = "";
    if (k <= 0) return "";
    const fr = P % 1;
    s += `<path d="M${DN.kx} ${DN.ky} L${DN.kx - mx} ${DN.ky + mx * 0.7} A${mx} ${mx} 0 0 0 ${DN.kx + mx} ${DN.ky + mx * 0.7}Z" fill="${MINT}" opacity="${f2(0.07 * k)}"/>`;
    for (let j = 0; (j + fr) * sp < mx; j++) { const r = (j + fr) * sp; if (r < 40) continue;
      const a = Math.min(1, (mx - r) / 260, (r - 40) / 60) * k, a0 = (20 * Math.PI) / 180, a1 = (160 * Math.PI) / 180;
      s += `<path d="M${f1(DN.kx + r * Math.cos(a0))} ${f1(DN.ky + r * Math.sin(a0))} A${f1(r)} ${f1(r)} 0 0 1 ${f1(DN.kx + r * Math.cos(a1))} ${f1(DN.ky + r * Math.sin(a1))}" stroke="${MINT}" stroke-width="9" fill="none" stroke-linecap="round" opacity="${f2(0.55 * a)}"/>`; }
    return s;
  }
  // pantulan dari figur kembali ke kotak: busur pendek berpusat di figur, menghadap kotak. kuat 0..1 = terang/tebal
  function gelombangPantul(x, y, P, sp, o = {}) {
    const k = o.k ?? 1; if (k <= 0) return "";
    const dx = DN.kx - x, dy = DN.ky + 20 - y, dist = Math.hypot(dx, dy), th = Math.atan2(dy, dx), lb = (26 * Math.PI) / 180, kt = cl(o.kuat || 0);
    const warna = kt > 0.05 ? `rgb(${Math.round(lerp(201, 255, kt))},${Math.round(lerp(255, 236, kt))},${Math.round(lerp(234, 120, kt))})` : MINTL;
    let s = ""; const fr = P % 1;
    for (let j = 0; (j + fr) * sp < dist - 30; j++) { const r = (j + fr) * sp; if (r < 70) continue;
      const a = Math.min(1, (r - 70) / 50, (dist - 30 - r) / 80) * k;
      s += `<path d="M${f1(x + r * Math.cos(th - lb))} ${f1(y + r * Math.sin(th - lb))} A${f1(r)} ${f1(r)} 0 0 1 ${f1(x + r * Math.cos(th + lb))} ${f1(y + r * Math.sin(th + lb))}" stroke="${warna}" stroke-width="${f1(10 + 6 * kt)}" fill="none" stroke-linecap="round" opacity="${f2(0.9 * a)}"/>`; }
    return s;
  }

  // ---------- ikon (tanpa huruf) ----------
  function ikonJalan(x, y, s, t, k = 1) { return `<g opacity="${f2(0.35 + 0.65 * k)}">${pejalan(x, y, s, t, { hadap: "kanan", jalan: 1 })}</g>`; }
  function ikonDiri(x, y, s, k = 1) { return `<g opacity="${f2(0.35 + 0.65 * k)}">${pejalan(x, y, s, 0, { hadap: "depan", jalan: 0 })}</g>`; }
  function ikonLambai(t) { // tangan melambai + garis gerak
    const w = Math.sin(t * 9) * 16;
    return `<g transform="rotate(${f1(w)} 0 80)"><rect x="-44" y="-40" width="88" height="120" rx="40" fill="#C98F6A"/>${[-33, -11, 11, 33].map((fx, i) => `<rect x="${fx - 10}" y="${-96 + Math.abs(i - 1.5) * 12}" width="20" height="80" rx="10" fill="#C98F6A"/>`).join("")}<rect x="34" y="-10" width="52" height="22" rx="11" fill="#C98F6A" transform="rotate(-35 34 0)"/><rect x="-40" y="70" width="80" height="60" rx="14" fill="#4F78B5"/></g>
      <path d="M-86 -60 q-20 30 0 60 M-110 -76 q-28 46 0 92" stroke="#FFF4DC" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M86 -60 q20 30 0 60 M110 -76 q28 46 0 92" stroke="#FFF4DC" stroke-width="8" fill="none" stroke-linecap="round"/>`; }
  function ikonMundur(t) { const m = (Math.sin(t * 3) * 0.5 + 0.5) * 30;
    return `<g transform="translate(${f1(20 - m)} 0)">${pejalan(0, 100, 0.33, t, { hadap: "kanan", jalan: 0.4, laju: 5 })}</g><path d="M${f1(-20 - m)} -60 L-100 -60" stroke="#FFF4DC" stroke-width="16" stroke-linecap="round"/><path d="M-118 -60 L-88 -84 L-88 -36Z" fill="#FFF4DC"/>`; }

  Object.assign(A, { PINTU, DN, WARNA_PINTU: W, MINT, MINTL, IR, IRL, kotakSensor, kerucut, pejalan, lebarBadan, tokoDepan, tirai, denah, orangAtas, gelombangKeluar, gelombangPantul, ikonJalan, ikonDiri, ikonLambai, ikonMundur });
})(typeof window !== "undefined" ? window : globalThis);
