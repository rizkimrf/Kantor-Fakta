/* TEBE RIG — kerangka gerak Tebe (tampilan identik dengan tebe.js, tapi semua bagian bisa digerakkan mulus).
 *
 * Dua lapis:
 *  1) tebeRigSVG(p)  : menggambar Tebe dari parameter angka (wajah, tangan, kepala, badan, kaki).
 *  2) tebeAnimasi(kunci, opsi) -> fungsi(t) yang menghasilkan parameter di detik t:
 *       - perpindahan pose dihaluskan (easing) — tidak ada lompatan
 *       - kedip otomatis, napas, goyang badan halus
 *       - mulut bicara alami saat interval "bicara"
 *       - jambul "?" mengikuti gerak kepala dengan pegas (memantul lalu tenang)
 *
 * Contoh:
 *   const anim = tebeAnimasi([
 *     { t: 0,   pose: "penasaran" },
 *     { t: 1.2, pose: "kaget", loncat: true },
 *     { t: 3,   pose: "menjelaskan", bicara: [3.1, 5.0] },
 *   ]);
 *   svg = tebeRigSVG(anim(2.4));
 *
 * Pose bawaan: netral, penasaran, kaget, menjelaskan, tertawa, bingung, bangga, melambai, berpikir, menghitung, sedih
 * viewBox 0 0 400 520 (sama dengan tebe.js).
 */
(function (root) {
  const W = {
    kulit: "#F4C9A1", kulitGelap: "#E3AE82", rambut: "#4A2E1A", rambutTerang: "#6A4426",
    hoodie: "#FFC93C", hoodieGelap: "#E5A91A", celana: "#1F8A8A", sepatu: "#FFFFFF",
    garis: "#1E1E1E", pipi: "#F58A7A", putih: "#FFFFFF", lidah: "#E8615A", mulut: "#7A2B2B",
  };
  const G = `stroke="${W.garis}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;
  const BAHU_K = [150, 328], BAHU_N = [250, 328];

  // ---------- pose bawaan (semua angka → bisa diinterpolasi) ----------
  // tanganK/tanganN = posisi target tangan; bentukK/N = kepal|tunjuk|buka|garuk
  const NETRAL = {
    alisK: 0, alisN: 0, alisMiringK: 0, alisMiringN: 0, mataBuka: 1, mataBesar: 0, mataSenyum: 0, lihatX: 0, lihatY: 0,
    mulutLebar: 0.5, mulutBuka: 0, senyum: 0.6, pipi: 0.55, kepalaMiring: 0, kepalaAngguk: 0, condong: 0,
    tanganK: [134, 412], tanganN: [266, 412], bentukK: "kepal", bentukN: "kepal", tekukK: 1, tekukN: -1,
    tanda: 0, efek: "",
  };
  const POSE = {
    netral: {},
    penasaran: { alisK: -0.2, alisN: 0.7, lihatX: 3, lihatY: -2, senyum: 0.3, mulutLebar: 0.4, kepalaMiring: -5, tanganN: [244, 268], bentukN: "kepal", tekukN: 1 },
    kaget: { alisK: 1, alisN: 1, mataBesar: 1, mulutBuka: 0.8, mulutLebar: 0.42, senyum: 0, tanganK: [86, 246], tanganN: [314, 246], bentukK: "buka", bentukN: "buka", tekukK: -1, tekukN: 1, efek: "kaget", condong: -2 },
    menjelaskan: { alisK: 0.3, alisN: 0.3, senyum: 0.5, tanganN: [330, 232], bentukN: "tunjuk", tekukN: 1, kepalaMiring: 3 },
    tertawa: { mataSenyum: 1, alisK: 0.4, alisN: 0.4, mulutBuka: 0.8, senyum: 1, mulutLebar: 0.85, pipi: 0.9, tanganK: [128, 396], tanganN: [272, 396], kepalaMiring: 4 },
    bingung: { alisK: -0.5, alisN: 0.9, alisMiringK: -0.6, lihatX: -3, senyum: -0.3, mulutLebar: 0.45, kepalaMiring: 8, tanganN: [300, 150], bentukN: "garuk", tekukN: 1, efek: "bingung" },
    bangga: { mataSenyum: 1, alisK: 0.3, alisN: 0.3, senyum: 1, mulutLebar: 0.7, pipi: 0.85, tanganK: [140, 392], tanganN: [260, 392], condong: -1 },
    melambai: { senyum: 0.9, mulutBuka: 0.25, mulutLebar: 0.7, alisK: 0.4, alisN: 0.4, tanganN: [322, 220], bentukN: "buka", tekukN: 1, kepalaMiring: -3 },
    berpikir: { alisK: -0.3, alisN: 0.5, lihatX: -4, lihatY: -5, senyum: 0.1, mulutLebar: 0.3, kepalaMiring: -6, tanganN: [236, 288], bentukN: "tunjuk", tekukN: 1 },
    menghitung: { alisK: 0.4, alisN: 0.4, senyum: 0.6, tanganK: [100, 300], bentukK: "buka", tekukK: -1, tanganN: [300, 300], bentukN: "tunjuk", tekukN: 1 },
    sedih: { alisK: 0.5, alisN: 0.5, alisMiringK: 0.8, alisMiringN: 0.8, lihatY: 3, senyum: -0.8, mulutLebar: 0.4, kepalaMiring: 4, kepalaAngguk: 4, pipi: 0.3 },
  };
  const ambilPose = (n) => Object.assign({}, NETRAL, POSE[n] || {});

  // ---------- util ----------
  const lerp = (a, b, k) => a + (b - a) * k;
  const halus = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * x * (x * (x * 6 - 15) + 10)); // smootherstep
  function campur(a, b, k) {
    const o = {};
    for (const key in a) {
      const va = a[key], vb = b[key];
      if (typeof va === "number") o[key] = lerp(va, vb, k);
      else if (Array.isArray(va)) o[key] = [lerp(va[0], vb[0], k), lerp(va[1], vb[1], k)];
      else o[key] = k < 0.5 ? va : vb;
    }
    return o;
  }

  // ---------- gambar bagian ----------
  function lengan(S, H, tekuk) {
    // dua ruas dengan siku (IK) — ruas memanjang lembut bila target jauh (gaya kartun)
    const dx = H[0] - S[0], dy = H[1] - S[1], d = Math.hypot(dx, dy) || 1;
    const L = Math.max(54, d / 2 * 1.04), a = Math.acos(Math.min(1, d / (2 * L))) * tekuk;
    const ang = Math.atan2(dy, dx) + a, E = [S[0] + Math.cos(ang) * L, S[1] + Math.sin(ang) * L];
    const C = [2 * E[0] - (S[0] + H[0]) / 2, 2 * E[1] - (S[1] + H[1]) / 2];
    const d1 = `M${S[0]} ${S[1]} Q${C[0].toFixed(1)} ${C[1].toFixed(1)} ${H[0].toFixed(1)} ${H[1].toFixed(1)}`;
    return { svg: `<path d="${d1}" fill="none" stroke="${W.garis}" stroke-width="40" stroke-linecap="round"/><path d="${d1}" fill="none" stroke="${W.hoodie}" stroke-width="29" stroke-linecap="round"/>`,
      arah: Math.atan2(H[1] - E[1], H[0] - E[0]) * 180 / Math.PI };
  }
  function tangan(H, bentuk, arah, lambai) {
    const [x, y] = H, r = arah + 90;
    if (bentuk === "tunjuk") return `<g transform="rotate(${(r - 20).toFixed(1)} ${x} ${y})"><path d="M${x} ${y - 8} L${x} ${y - 40}" stroke="${W.garis}" stroke-width="19" stroke-linecap="round"/><path d="M${x} ${y - 8} L${x} ${y - 40}" stroke="${W.kulit}" stroke-width="9" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="17" fill="${W.kulit}" ${G}/></g>`;
    if (bentuk === "buka" || bentuk === "garuk") {
      const rr = bentuk === "garuk" ? r + Math.sin(lambai * 3) * 12 : r + lambai;
      const jari = [-26, -9, 9, 26].map((a) => { const t = (a - 90) * Math.PI / 180; return `M${x + Math.cos(t) * 10} ${y + Math.sin(t) * 10} L${x + Math.cos(t) * 30} ${y + Math.sin(t) * 30}`; }).join(" ");
      return `<g transform="rotate(${rr.toFixed(1)} ${x} ${y})"><path d="${jari}" stroke="${W.garis}" stroke-width="15" stroke-linecap="round"/><path d="${jari}" stroke="${W.kulit}" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="18" fill="${W.kulit}" ${G}/></g>`;
    }
    return `<circle cx="${x}" cy="${y}" r="17" fill="${W.kulit}" ${G}/>`;
  }
  function mata(cx, p) {
    const s = 1 + p.mataBesar * 0.25, buka = Math.max(0, Math.min(1, p.mataBuka)), px = p.lihatX, py = p.lihatY;
    const smile = Math.max(0, Math.min(1, p.mataSenyum)), bulat = 1 - smile;
    let o = "";
    if (buka < 0.18) o += `<path d="M${cx - 17} 196 Q${cx} 207 ${cx + 17} 196" fill="none" ${G} opacity="${bulat}"/>`;
    else if (p.mataBesar > 0.5) o += `<g opacity="${bulat}"><ellipse cx="${cx}" cy="194" rx="${21}" ry="${25 * buka}" fill="${W.putih}" ${G}/><circle cx="${cx + px * .6}" cy="${196 + py * .6}" r="${9 * Math.min(1, buka + .2)}" fill="${W.garis}"/></g>`;
    else o += `<g opacity="${bulat}"><ellipse cx="${cx}" cy="194" rx="${17 * s}" ry="${21 * s * buka}" fill="${W.garis}"/>
      <circle cx="${cx - 5 + px}" cy="${186 + py * buka}" r="${6.2 * buka}" fill="${W.putih}"/><circle cx="${cx + 6 + px}" cy="${200 + py * buka}" r="${2.7 * buka}" fill="${W.putih}"/></g>`;
    if (smile > 0) o += `<path d="M${cx - 18} 198 Q${cx} 176 ${cx + 18} 198" fill="none" ${G} opacity="${smile}"/>`;
    return o;
  }
  function alis(x0, x1, naik, miring, kiri) {
    const y = 165 - naik * 11, m = miring * 7 * (kiri ? 1 : -1);
    return `<path d="M${x0} ${y + m} Q${(x0 + x1) / 2} ${y - 9} ${x1} ${y - m}" fill="none" stroke="${W.rambut}" stroke-width="7" stroke-linecap="round"/>`;
  }
  function mulut(p) {
    const w = 12 + p.mulutLebar * 26, o = Math.max(0, p.mulutBuka), s = p.senyum, y0 = 244;
    const ky = y0 - s * 7, atas = y0 + s * 6 - o * 3, bawah = y0 + s * 12 + o * 58;
    if (o < 0.06) return `<path d="M${200 - w} ${ky} Q200 ${y0 + s * 14} ${200 + w} ${ky}" fill="none" ${G}/>`;
    const dasar = (ky + bawah) / 2, lid = o > 0.35 ? `<ellipse cx="200" cy="${dasar - 3 - o * 5}" rx="${w * 0.5}" ry="${3 + o * 4}" fill="${W.lidah}"/>` : "";
    return `<path d="M${200 - w} ${ky} Q200 ${atas} ${200 + w} ${ky} Q200 ${bawah} ${200 - w} ${ky} Z" fill="${W.mulut}" ${G}/>${lid}`;
  }

  function tebeRigSVG(p0 = {}) {
    const p = Object.assign({}, NETRAL, p0);
    const nafas = p.nafas || 0, langkah = p.langkah || 0, jalan = p.jalan || 0, loncat = p.loncat || 0, squash = p.squash || 0;
    const ayun = Math.sin(langkah) * 20 * jalan, bobJalan = -Math.abs(Math.sin(langkah)) * 8 * jalan;
    const naik = -loncat * 60 + bobJalan, sx = 1 + squash * 0.08, sy = 1 - squash * 0.08;
    const LK = lengan(BAHU_K, p.tanganK, p.tekukK), LN = lengan(BAHU_N, p.tanganN, p.tekukN);
    const jg = (p.jambul || 0) + p.kepalaMiring * 0.4;
    const jambul = (p.tanda || 0) < 0.5
      ? `<g transform="rotate(${jg.toFixed(2)} 204 84)"><path d="M172 44 C170 6 246 2 244 42 C243 66 206 58 204 86" fill="none" stroke="${W.garis}" stroke-width="27" stroke-linecap="round"/><path d="M172 44 C170 6 246 2 244 42 C243 66 206 58 204 86" fill="none" stroke="${W.rambut}" stroke-width="16" stroke-linecap="round"/></g>`
      : `<g transform="rotate(${jg.toFixed(2)} 204 84)"><path d="M204 84 L210 30" fill="none" stroke="${W.garis}" stroke-width="29" stroke-linecap="round"/><path d="M204 84 L210 30" fill="none" stroke="${W.rambut}" stroke-width="18" stroke-linecap="round"/></g>`;
    const kaki = (x, rot) => `<g transform="rotate(${rot.toFixed(1)} ${x + 15} 426)"><rect x="${x}" y="424" width="30" height="52" rx="12" fill="${W.kulit}" ${G}/>
      ${x < 200 ? `<path d="M146 500 Q146 470 176 470 L194 470 Q198 500 194 500 Z" fill="${W.sepatu}" ${G}/><path d="M150 492 L194 492" stroke="${W.celana}" stroke-width="5"/>`
                 : `<path d="M254 500 Q254 470 224 470 L206 470 Q202 500 206 500 Z" fill="${W.sepatu}" ${G}/><path d="M206 492 L250 492" stroke="${W.celana}" stroke-width="5"/>`}</g>`;
    const efek = p.efek === "kaget" ? `<g opacity="${p.efekK ?? 1}"><path d="M52 150 l-22 -12 M48 186 l-26 0 M348 150 l22 -12 M352 186 l26 0" stroke="${W.hoodieGelap}" stroke-width="7" stroke-linecap="round"/></g>`
      : p.efek === "bingung" ? `<path d="M322 112 q10 -8 4 -18 M338 126 q14 -4 12 -16" fill="none" stroke="${W.garis}" stroke-width="5" stroke-linecap="round" opacity="${p.efekK ?? 1}"/>` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="400" height="520" style="overflow:visible">
<ellipse cx="200" cy="502" rx="${96 * (1 - loncat * 0.35)}" ry="14" fill="#000" opacity="${0.14 * (1 - loncat * 0.5)}"/>
<g transform="translate(200 500) scale(${sx} ${sy}) translate(-200 -500) translate(0 ${naik.toFixed(1)})">
 ${kaki(160, -ayun)}${kaki(210, ayun)}
 <g transform="rotate(${p.condong.toFixed(2)} 200 430)">
  <path d="M146 396 L254 396 L250 446 L206 446 L200 424 L194 446 L150 446 Z" fill="${W.celana}" ${G}/>
  <g transform="translate(200 410) scale(1 ${1 + nafas * 0.015}) translate(-200 -410)">
   <path d="M142 308 Q200 286 258 308 Q270 362 262 404 Q200 420 138 404 Q130 362 142 308 Z" fill="${W.hoodie}" ${G}/>
   <path d="M166 372 Q200 364 234 372 L230 402 Q200 408 170 402 Z" fill="${W.hoodieGelap}" ${G}/>
   <path d="M186 304 L184 334 M214 304 L216 334" stroke="${W.garis}" stroke-width="5" stroke-linecap="round"/>
   <circle cx="184" cy="338" r="5" fill="${W.putih}" ${G}/><circle cx="216" cy="338" r="5" fill="${W.putih}" ${G}/>
   <circle cx="232" cy="332" r="15" fill="${W.putih}" ${G}/><path d="M232 323 a7 7 0 0 1 4 12 v3 h-8 v-3 a7 7 0 0 1 4 -12" fill="${W.hoodie}" stroke="${W.garis}" stroke-width="2.5"/>
  </g>
  ${LK.svg}${LN.svg}
  <g transform="translate(0 ${(-nafas * 2 + p.kepalaAngguk).toFixed(2)}) rotate(${p.kepalaMiring.toFixed(2)} 200 300)">
   <circle cx="92" cy="204" r="19" fill="${W.kulit}" ${G}/><circle cx="308" cy="204" r="19" fill="${W.kulit}" ${G}/>
   <path d="M90 200 q6 -6 10 2" fill="none" stroke="${W.kulitGelap}" stroke-width="4" stroke-linecap="round"/><path d="M310 200 q-6 -6 -10 2" fill="none" stroke="${W.kulitGelap}" stroke-width="4" stroke-linecap="round"/>
   <ellipse cx="200" cy="196" rx="112" ry="106" fill="${W.kulit}" ${G}/>
   ${jambul}
   <path d="M88 190 Q78 92 176 76 Q262 60 304 126 Q320 156 312 192 Q300 160 276 146 Q268 170 236 134 Q214 168 182 132 Q160 166 136 140 Q104 156 88 190 Z" fill="${W.rambut}" ${G}/>
   <path d="M128 112 Q160 86 204 86" fill="none" stroke="${W.rambutTerang}" stroke-width="7" stroke-linecap="round" opacity=".8"/>
   ${alis(136, 180, p.alisK, p.alisMiringK, true)}${alis(220, 264, p.alisN, p.alisMiringN, false)}
   ${mata(158, p)}${mata(242, p)}
   <ellipse cx="124" cy="228" rx="17" ry="11" fill="${W.pipi}" opacity="${p.pipi.toFixed(2)}"/><ellipse cx="276" cy="228" rx="17" ry="11" fill="${W.pipi}" opacity="${p.pipi.toFixed(2)}"/>
   ${mulut(p)}
   ${efek}
  </g>
  ${tangan(p.tanganK, p.bentukK, LK.arah, p.lambai || 0)}${tangan(p.tanganN, p.bentukN, LN.arah, p.lambai || 0)}
 </g>
</g></svg>`;
  }

  // ---------- pengendali animasi ----------
  // kunci: [{t, pose, transisi?, bicara:[mulai,selesai], loncat:true, jalan:[mulai,selesai], tanda:"!"}]
  function tebeAnimasi(kunci, opsi = {}) {
    kunci = kunci.slice().sort((a, b) => a.t - b.t);
    const bicara = [], jalan = [], loncat = [], tandaT = [];
    for (const k of kunci) {
      if (k.bicara) bicara.push(k.bicara);
      if (k.jalan) jalan.push(k.jalan);
      if (k.loncat) loncat.push(k.t);
      if (k.tanda === "!") tandaT.push(k.t);
    }
    const kedipT = []; let s = opsi.benih || 3;
    const acak = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let x = 0.8 + acak(); x < 120; x += 2.6 + acak() * 1.8) kedipT.push(x);

    function poseMentah(t) {
      let i = 0; while (i + 1 < kunci.length && kunci[i + 1].t <= t) i++;
      const kini = ambilPose(kunci[i].pose), dur = kunci[i].transisi || 0.32;
      if (i === 0 || t < kunci[i].t) return kini;
      const lalu = poseMentahTanpaTransisi(i - 1, kunci[i].t);
      return campur(lalu, kini, halus((t - kunci[i].t) / dur));
    }
    function poseMentahTanpaTransisi(i, tAkhir) { // pose kunci i (termasuk transisinya) dihentikan di tAkhir
      const kini = ambilPose(kunci[i].pose), dur = kunci[i].transisi || 0.32;
      if (i === 0) return kini;
      const k = halus((tAkhir - kunci[i].t) / dur);
      return k >= 1 ? kini : campur(ambilPose(kunci[i - 1].pose), kini, k);
    }
    // pegas jambul: disimulasikan deterministik dari 0 sampai t
    function jambulPegas(t) {
      let ang = 0, vel = 0, prevMiring = poseMentah(0).kepalaMiring, prevY = 0; const dt = 1 / 120;
      for (let x = 0; x <= t; x += dt) {
        const p = poseMentah(x), y = tinggi(x);
        const gaya = -(p.kepalaMiring - prevMiring) * 60 - (y - prevY) * 9;
        prevMiring = p.kepalaMiring; prevY = y;
        vel += (gaya - ang * 140 - vel * 9) * dt; ang += vel * dt;
      }
      return Math.max(-22, Math.min(22, ang));
    }
    function tinggi(t) { // loncatan (detik ke 0..0.5 setelah kunci loncat)
      let h = 0; for (const lt of loncat) { const u = (t - lt) / 0.5; if (u > 0 && u < 1) h = Math.max(h, Math.sin(u * Math.PI)); }
      return h;
    }
    function squash(t) { let q = 0; for (const lt of loncat) { const a = (t - lt) / 0.1, b = (t - lt - 0.5) / 0.14;
      if (a > -1 && a < 0) q = Math.max(q, Math.sin((a + 1) * Math.PI)); if (b > 0 && b < 1) q = Math.max(q, Math.sin(b * Math.PI) * 0.8); } return q; }
    return function (t) {
      const p = poseMentah(t);
      p.nafas = Math.sin(t * 2 * Math.PI / 3.2);
      p.kepalaMiring += Math.sin(t * 1.3) * 1.2; p.condong += Math.sin(t * 0.9 + 1) * 0.6;
      // kedip halus
      let buka = 1; for (const k of kedipT) { const u = (t - k) / 0.16; if (u > 0 && u < 1) buka = Math.min(buka, Math.abs(Math.cos(u * Math.PI))); }
      p.mataBuka = Math.min(p.mataBuka, buka);
      // bicara alami
      for (const [a, b] of bicara) if (t > a && t < b) {
        const n = 0.5 + 0.5 * Math.sin(t * 19) * Math.sin(t * 7.3 + 1) + 0.25 * Math.sin(t * 31);
        const env = Math.min(1, (t - a) / 0.08, (b - t) / 0.08);
        p.mulutBuka = Math.max(p.mulutBuka, Math.max(0, n) * 0.7 * env); p.kepalaAngguk += Math.sin(t * 9) * 1.2 * env;
      }
      // jalan
      for (const [a, b] of jalan) if (t > a && t < b) { const env = Math.min(1, (t - a) / 0.2, (b - t) / 0.2); p.jalan = env; p.langkah = (t - a) * 9.5;
        p.tanganK = [p.tanganK[0] + Math.sin(p.langkah) * 14 * env, p.tanganK[1]]; p.tanganN = [p.tanganN[0] - Math.sin(p.langkah) * 14 * env, p.tanganN[1]]; }
      p.loncat = tinggi(t); p.squash = squash(t);
      p.lambai = p.bentukN === "buka" && p.tanganN[1] < 260 ? Math.sin(t * 12) * 18 : t * 1;
      // jambul berubah "!" dengan kilat kecil
      let tanda = 0; for (const tt of tandaT) if (t >= tt) tanda = 1;
      p.tanda = tanda;
      p.jambul = jambulPegas(t) + (tandaT.some((tt) => t > tt && t < tt + 0.7) ? Math.sin((t - tandaT[0]) * 22) * 14 * (1 - (t - tandaT[0]) / 0.7) : 0);
      p.efekK = 0.6 + 0.4 * Math.sin(t * 10);
      return p;
    };
  }

  const api = { tebeRigSVG, tebeAnimasi, POSE_RIG: Object.keys(POSE), WARNA: W };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof window !== "undefined" ? window : globalThis);
