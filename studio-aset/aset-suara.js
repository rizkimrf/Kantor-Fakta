/* ===== SET SUARA REKAMAN (Yoga, 23 Nov 2026, video B3-04 "suara sendiri di rekaman") =====
 * Muat SETELAH aset-set.js. Gaya datar tanpa garis hitam; palet berry-magenta + mint (jalur udara) + amber (jalur tulang).
 * Semua fungsi murni (fungsi waktu kontinu t) dan mengembalikan string SVG. Tidak ada merek/logo aplikasi, tidak ada tulisan kecuali yang diminta (kartu).
 *  kamarMalam(w,h,t,o)        kamar tidur malam berry: jendela kota, lampu tidur, kasur + bantal
 *  hpKecil(x,y,s,t,o)         HP generik + gelembung voice note (o.main 0..1, o.mata 'biasa'|'sipit'|0, o.raba 0..1 tangan meraba "kepala", o.rot)
 *  gelombang(titik,t,o)       gelombang suara di sepanjang polyline (o.k panjang tergambar 0..1, o.amp, o.lambda, o.warna, o.tebal, o.laju, o.goyang)
 *  riakTulang(titik,t,o)      riak getar amber merambat di sepanjang polyline (o.k, o.n, o.warna)
 *  kepala(x,y,s,t,o)          kepala manusia generik tampak samping, menghadap kanan; o.mode 'hantu' | 'xray'; o.bicara; titik penting di kepala.titik(...)
 *  gangSenja(w,h,t) · siluetTanya(x,y,s,t,o) · sorot(x,y,r,a)
 *  orang(x,y,s,t,o)           orang generik (tampak depan, wajah sederhana), o: baju, kulit, rambut 'pendek'|'panjang'|'peci'|'handuk', daster, telinga 0..1 (menyala mint), angguk
 *  bangkuKampus(w,h,t) · dapurRumah(w,h,t) · gerobakBakso(x,y,s,t,o)
 *  lencanaKira(x,y,s,k)       lencana "≈" (mirip, bukan sama)
 *  otakSofa(x,y,s,t,o) · pintuKetuk(x,y,s,t,o) · bingkaiGelombang(x,y,s,t)
 *  ruangUji(w,h,t) · orangUji(x,y,s,t,o) · ikonOrangAsing(x,y,s,o) · centangCahaya(x,y,s,k)
 *  kartuReaksi(x,y,s,jenis,teks,t,o) · layarChat(x,y,s,t,o)
 */
(function (root) {
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k, halus = (x) => { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  let _n = 0; const uid = (p) => `${p}S${++_n}`;
  const g = (x, y, s, isi, rot = 0, sy) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)} ${f2(sy ?? s)})">${isi}</g>`;
  const C = { BERRY0: "#2A0B23", BERRY1: "#4A1238", BERRY2: "#6B1A4F", BERRY3: "#8E2468", MAG: "#C2307E", PINK: "#F07AB0", PINKL: "#FBC4DD",
    MINT: "#5FF2C4", MINTL: "#C8FFEC", AMBER: "#FFB547", AMBERL: "#FFE0A3", TEAL: "#3FB8C9", KUL: "#E9B48C", KULG: "#C98E68", KULS: "#F6CDAA" };

  // ---------- kamar tidur malam ----------
  function kamarMalam(w, h, t = 0, o = {}) {
    const id = uid("km"), jx = o.jx ?? 110, jy = o.jy ?? 470, jw = o.jw ?? 330, jh = o.jh ?? 380, lantai = o.lantai ?? 1500;
    let s = `<defs><linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.BERRY1}"/><stop offset="1" stop-color="${C.BERRY2}"/></linearGradient>
      <linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#172045"/><stop offset="1" stop-color="#40285E"/></linearGradient>
      <radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".55"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient></defs>`;
    s += `<rect width="${w}" height="${h}" fill="url(#${id}d)"/>`;
    for (let i = 0; i < Math.ceil(w / 90); i++) s += `<rect x="${i * 90}" y="0" width="34" height="${lantai}" fill="#FFFFFF" opacity=".025"/>`;
    // jendela + langit kota
    s += `<rect x="${jx - 18}" y="${jy - 18}" width="${jw + 36}" height="${jh + 36}" rx="16" fill="${C.BERRY0}" opacity=".55"/><rect x="${jx}" y="${jy}" width="${jw}" height="${jh}" rx="8" fill="url(#${id}l)"/>`;
    s += `<circle cx="${jx + jw * 0.72}" cy="${jy + jh * 0.26}" r="${jw * 0.09}" fill="#FFF1CF"/><circle cx="${jx + jw * 0.72}" cy="${jy + jh * 0.26}" r="${jw * 0.18}" fill="#FFF1CF" opacity=".12"/>`;
    [[0.05, 0.62, 0.2, 0.38], [0.27, 0.5, 0.16, 0.5], [0.45, 0.7, 0.22, 0.3], [0.7, 0.56, 0.24, 0.44]].forEach(([a, b, c, d], i) => {
      s += `<rect x="${f1(jx + jw * a)}" y="${f1(jy + jh * b)}" width="${f1(jw * c)}" height="${f1(jh * d)}" fill="#1B1638"/>`;
      for (let k = 0; k < 3; k++) s += `<rect x="${f1(jx + jw * (a + 0.03 + k * c * 0.3))}" y="${f1(jy + jh * (b + 0.08))}" width="${f1(jw * 0.03)}" height="${f1(jh * 0.04)}" fill="#FFD27A" opacity="${f2(0.45 + 0.35 * Math.sin(t * 0.7 + i * 2 + k))}"/>`;
    });
    s += `<rect x="${jx + jw / 2 - 5}" y="${jy}" width="10" height="${jh}" fill="${C.BERRY0}" opacity=".6"/><rect x="${jx}" y="${jy + jh * 0.45}" width="${jw}" height="10" fill="${C.BERRY0}" opacity=".6"/>`;
    // tirai
    s += `<path d="M${jx - 60} ${jy - 40} Q${jx + 10} ${jy + jh * 0.5} ${jx - 40} ${jy + jh + 60} L${jx - 90} ${jy + jh + 60} L${jx - 90} ${jy - 40}Z" fill="${C.MAG}" opacity=".75"/>`;
    s += `<path d="M${jx + jw + 60} ${jy - 40} Q${jx + jw - 10} ${jy + jh * 0.5} ${jx + jw + 40} ${jy + jh + 60} L${jx + jw + 90} ${jy + jh + 60} L${jx + jw + 90} ${jy - 40}Z" fill="${C.MAG}" opacity=".75"/>`;
    // rak dinding & poster abstrak (tanpa tulisan)
    if (o.rak !== 0) {
      const rx = o.rakX ?? w - 360, ry = o.rakY ?? 560;
      s += `<rect x="${rx}" y="${ry}" width="260" height="16" rx="8" fill="${C.BERRY0}" opacity=".5"/><rect x="${rx + 20}" y="${ry - 90}" width="36" height="90" rx="6" fill="${C.PINK}" opacity=".7"/><rect x="${rx + 62}" y="${ry - 70}" width="30" height="70" rx="6" fill="${C.TEAL}" opacity=".7"/><circle cx="${rx + 170}" cy="${ry - 40}" r="40" fill="${C.AMBER}" opacity=".55"/>`;
      s += `<rect x="${rx + 30}" y="${ry - 330}" width="190" height="200" rx="12" fill="${C.BERRY3}" opacity=".8"/><path d="M${rx + 50} ${ry - 170} l50 -70 l40 45 l30 -30 l40 55Z" fill="${C.PINKL}" opacity=".55"/>`;
    }
    // lampu tidur
    const lx = o.lampuX ?? w - 150, ly = o.lampuY ?? 1180;
    s += `<circle cx="${lx}" cy="${ly - 150}" r="320" fill="url(#${id}g)"/><path d="M${lx - 70} ${ly - 120} L${lx + 70} ${ly - 120} L${lx + 45} ${ly - 220} L${lx - 45} ${ly - 220}Z" fill="#FFCF7A"/><rect x="${lx - 8}" y="${ly - 120}" width="16" height="110" fill="${C.BERRY0}" opacity=".6"/><rect x="${lx - 110}" y="${ly - 12}" width="220" height="${lantai - ly + 12}" fill="${C.BERRY0}" opacity=".45"/>`;
    // lantai
    s += `<rect x="0" y="${lantai}" width="${w}" height="${h - lantai}" fill="#3A0F2E"/><rect x="0" y="${lantai}" width="${w}" height="12" fill="${C.BERRY0}" opacity=".5"/>`;
    // kasur
    if (o.kasur !== 0) {
      const kx = o.kasurX ?? -40, kw = o.kasurW ?? w - 200, ky = o.kasurY ?? 1250;
      s += `<rect x="${kx}" y="${ky - 330}" width="70" height="${lantai - ky + 330}" rx="20" fill="#5A1844"/>`;
      s += `<rect x="${kx}" y="${ky}" width="${kw}" height="${lantai - ky}" rx="30" fill="#5A1844"/><rect x="${kx}" y="${ky - 60}" width="${kw}" height="110" rx="40" fill="${C.PINKL}"/>`;
      s += `<path d="M${kx + kw * 0.35} ${ky - 70} Q${kx + kw * 0.6} ${ky - 120} ${kx + kw} ${ky - 80} L${kx + kw} ${ky + 120} L${kx + kw * 0.3} ${ky + 120}Z" fill="${C.MAG}"/>`;
      s += `<path d="M${kx + kw * 0.45} ${ky - 40} q60 30 120 0 q60 -30 120 0" stroke="${C.PINK}" stroke-width="10" fill="none" opacity=".6"/>`;
      if (o.bantal !== 0) s += `<rect x="${kx + 90}" y="${ky - 130}" width="300" height="120" rx="56" fill="#FFF0F6"/><path d="M${kx + 120} ${ky - 50} q120 18 240 0" stroke="#F3CFE0" stroke-width="10" fill="none"/>`;
    }
    return s;
  }

  // ---------- HP kecil + voice note ----------
  function hpKecil(x, y, s, t = 0, o = {}) {
    const w = 220, h = 420, id = uid("hk"), main = o.main ?? (t * 0.4) % 1;
    let q = `<defs><clipPath id="${id}"><rect x="${-w / 2 + 12}" y="${-h / 2 + 14}" width="${w - 24}" height="${h - 28}" rx="24"/></clipPath></defs>`;
    if (o.raba) { const r = cl(o.raba), dx = Math.sin(t * 9) * 26 * r; q += `<path d="M${w / 2 + 40} ${-h / 2 + 140} Q${w / 2 + 90} ${-h / 2 - 20} ${f1(20 + dx)} ${-h / 2 - 44}" stroke="${C.KUL}" stroke-width="26" fill="none" stroke-linecap="round" opacity="${f2(r)}"/><circle cx="${f1(20 + dx)}" cy="${-h / 2 - 40}" r="24" fill="${C.KUL}" opacity="${f2(r)}"/>`; }
    q += `<rect x="${-w / 2 + 10}" y="${-h / 2 + 14}" width="${w}" height="${h}" rx="34" fill="#000" opacity=".25"/>`;
    q += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="34" fill="#2B2440"/><rect x="${-w / 2 + 12}" y="${-h / 2 + 14}" width="${w - 24}" height="${h - 28}" rx="24" fill="#191427"/>`;
    q += `<g clip-path="url(#${id})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#241B36"/>`;
    // gelembung chat generik
    q += `<rect x="${-w / 2 + 26}" y="${-h / 2 + 50}" width="110" height="34" rx="17" fill="#3A2F52"/><rect x="${-w / 2 + 70}" y="${-h / 2 + 100}" width="124" height="34" rx="17" fill="#3A2F52" opacity=".8"/>`;
    const by = o.mata ? 70 : 10;
    q += `<rect x="${-w / 2 + 22}" y="${by - 34}" width="${w - 44}" height="70" rx="35" fill="${C.MINT}" opacity=".95"/><path d="M${-w / 2 + 44} ${by - 14} l26 14 l-26 14Z" fill="#1E3A34"/>`;
    for (let i = 0; i < 9; i++) { const hh = 10 + 18 * Math.abs(Math.sin(i * 1.7 + 0.6)) * (0.7 + 0.3 * Math.sin(t * 8 + i)); const xx = -w / 2 + 86 + i * 11; q += `<rect x="${f1(xx)}" y="${f1(by - hh / 2)}" width="6" height="${f1(hh)}" rx="3" fill="#1E3A34" opacity="${(xx - (-w / 2 + 86)) / 99 <= main ? 1 : 0.4}"/>`; }
    if (o.mata) { // wajah HP bermata (adegan mikrofon)
      const lx = (o.lihat || 0) * 6, sip = o.mata === "sipit" ? 0.3 : 1;
      [-40, 40].forEach((ex) => { q += `<ellipse cx="${ex + lx}" cy="${-h / 2 + 120}" rx="22" ry="${f1(26 * sip)}" fill="#FFFFFF"/><circle cx="${ex + lx * 1.6}" cy="${-h / 2 + 124}" r="${f1(11 * Math.min(1, sip + 0.3))}" fill="#1E1E2E"/>`; });
      q += `<path d="M-26 ${-h / 2 + 175} Q0 ${-h / 2 + 175 + (o.senyum ?? 10)} 26 ${-h / 2 + 175}" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    }
    q += `<path d="M${-w / 2} ${-h / 2 + 90} L${w / 2} ${-h / 2 - 20} L${w / 2} ${-h / 2 + 30} L${-w / 2} ${-h / 2 + 140}Z" fill="#FFFFFF" opacity=".07"/></g>`;
    // lubang mic & speaker di sisi bawah
    q += `<circle cx="-40" cy="${h / 2 - 6}" r="5" fill="#120E1C"/><g fill="#120E1C">${[0, 1, 2, 3].map((i) => `<circle cx="${18 + i * 14}" cy="${h / 2 - 6}" r="4"/>`).join("")}</g>`;
    if (o.micGlow) q += `<circle cx="-40" cy="${h / 2 - 6}" r="${f1(14 + 8 * Math.sin(t * 10))}" fill="${C.MINT}" opacity="${f2(0.55 * o.micGlow)}"/>`;
    if (o.spkGlow) q += `<ellipse cx="39" cy="${h / 2 - 6}" rx="${f1(40 + 6 * Math.sin(t * 10))}" ry="14" fill="${C.TEAL}" opacity="${f2(0.6 * o.spkGlow)}"/>`;
    return g(x, y, s, q, o.rot || 0);
  }

  // ---------- gelombang suara di sepanjang polyline ----------
  function sampel(titik, n) {
    const seg = []; let L = 0;
    for (let i = 1; i < titik.length; i++) { const d = Math.hypot(titik[i][0] - titik[i - 1][0], titik[i][1] - titik[i - 1][1]); seg.push(d); L += d; }
    const out = [];
    for (let j = 0; j <= n; j++) {
      let u = (j / n) * L, i = 0; while (i < seg.length - 1 && u > seg[i]) { u -= seg[i]; i++; }
      const a = titik[i], b = titik[i + 1], k = seg[i] ? u / seg[i] : 0, dx = (b[0] - a[0]) / (seg[i] || 1), dy = (b[1] - a[1]) / (seg[i] || 1);
      out.push({ x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, nx: -dy, ny: dx, s: (j / n) * L });
    }
    return { pts: out, L };
  }
  function haluskanTitik(titik, iter = 2) { // Chaikin: sudut polyline menjadi lengkung
    let p = titik;
    for (let k = 0; k < iter; k++) { const q = [p[0]]; for (let i = 0; i < p.length - 1; i++) { const a = p[i], b = p[i + 1]; q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } q.push(p[p.length - 1]); p = q; }
    return p;
  }
  function gelombang(titik, t = 0, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0.001) return "";
    const { pts, L } = sampel(haluskanTitik(titik, o.halus ?? 2), o.n || 120), amp = o.amp ?? 22, lam = o.lambda ?? 70, laju = o.laju ?? 5, goy = o.goyang || 0;
    const ujung = k * L, ekor = o.ekor ? Math.max(0, ujung - o.ekor) : 0;
    let d = "";
    for (const p of pts) {
      if (p.s > ujung || p.s < ekor) continue;
      const env = Math.min(1, (p.s - ekor) / 60, (ujung - p.s) / 60 + (k >= 1 ? 1 : 0)) * (1 + goy * 0.35 * Math.sin(t * 11 + p.s * 0.02));
      const off = amp * env * Math.sin((p.s / lam) * Math.PI * 2 - t * laju);
      d += (d ? " L" : "M") + f1(p.x + p.nx * off) + " " + f1(p.y + p.ny * off);
    }
    if (!d) return "";
    const tb = o.tebal ?? 12, w = o.warna || C.MINT;
    return `<g opacity="${f2(o.a ?? 1)}"><path d="${d}" stroke="${w}" stroke-width="${f1(tb * 2.6)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".18"/><path d="${d}" stroke="${w}" stroke-width="${f1(tb)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${o.inti ? `<path d="${d}" stroke="#FFFFFF" stroke-width="${f1(tb * 0.3)}" fill="none" stroke-linecap="round" opacity=".7"/>` : ""}</g>`;
  }
  function garisJalur(titik, o = {}) { // jalur putus-putus tipis (penanda rute)
    const p = haluskanTitik(titik, 2); let d = "M" + p.map((q) => `${f1(q[0])} ${f1(q[1])}`).join(" L");
    return `<path d="${d}" stroke="${o.warna || C.MINT}" stroke-width="${o.tebal || 6}" fill="none" stroke-linecap="round" stroke-dasharray="${o.putus || "4 18"}" opacity="${f2(o.a ?? 0.6)}"/>`;
  }
  function riakTulang(titik, t = 0, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0.001) return "";
    const { pts, L } = sampel(haluskanTitik(titik, 2), 60), n = o.n || 6, w = o.warna || C.AMBER, ujung = k * L;
    let s = "";
    for (let i = 0; i < n; i++) {
      const u = ((((t * (o.laju ?? 0.55) + i / n) % 1) + 1) % 1) * ujung, j = Math.min(pts.length - 1, Math.round((u / L) * 60)), p = pts[j];
      const ang = Math.atan2(p.ny, p.nx) * 180 / Math.PI + 90, r = (o.r || 30) * (0.8 + 0.4 * Math.sin(t * 6 + i)), a = Math.sin(Math.PI * (u / (ujung || 1)));
      s += `<g transform="translate(${f1(p.x)} ${f1(p.y)}) rotate(${f1(ang)})" opacity="${f2((o.a ?? 1) * a)}"><path d="M${-r} ${-r * 0.5} Q0 ${-r * 1.2} ${r} ${-r * 0.5}" stroke="${w}" stroke-width="${o.tebal || 9}" fill="none" stroke-linecap="round"/><path d="M${-r * 0.6} ${r * 0.1} Q0 ${-r * 0.5} ${r * 0.6} ${r * 0.1}" stroke="${w}" stroke-width="${(o.tebal || 9) * 0.8}" fill="none" stroke-linecap="round" opacity=".7"/></g>`;
    }
    // garis jalur tipis
    const p = pts.filter((q) => q.s <= ujung); if (p.length > 1) s = `<path d="M${p.map((q) => `${f1(q.x)} ${f1(q.y)}`).join(" L")}" stroke="${w}" stroke-width="${o.garis ?? 8}" fill="none" stroke-linecap="round" opacity="${f2(0.55 * (o.a ?? 1))}"/>` + s;
    return s;
  }

  // ---------- kepala manusia generik (samping, menghadap kanan) ----------
  // koordinat lokal: pusat tengkorak (0,0); telinga luar (-40,30); telinga dalam/koklea (-6,10); mulut (196,150); dagu (170,262)
  const KP = { telinga: [-46, 34], koklea: [-4, 6], mulut: [200, 150], rahang: [40, 214], dagu: [168, 262], hidung: [236, 40] };
  const SIL = "M-200 -60 C-214 -230 -60 -330 70 -300 C180 -276 230 -170 226 -60 L262 30 Q270 48 248 52 L228 56 C232 84 222 98 212 104 Q226 120 208 132 Q214 146 204 156 C196 170 200 190 196 210 C190 250 170 270 130 272 C80 274 40 262 18 244 L10 330 L-160 330 L-140 200 C-190 140 -196 60 -200 -60Z";
  function kepala(x, y, s, t = 0, o = {}) {
    const mode = o.mode || "xray", id = uid("kp"), bic = o.bicara ? 0.5 + 0.5 * Math.sin(t * 17) : 0;
    let q = "";
    if (mode === "hantu") {
      q += `<path d="${SIL}" fill="${C.PINKL}" opacity="${f2(0.07 * (o.a ?? 1))}"/><path d="${SIL}" stroke="${C.PINKL}" stroke-width="7" fill="none" opacity="${f2(0.32 * (o.a ?? 1))}"/>`;
      q += `<path d="M-60 0 C-90 0 -96 70 -58 76 C-30 80 -24 40 -40 28" stroke="${C.PINKL}" stroke-width="6" fill="none" opacity="${f2(0.3 * (o.a ?? 1))}"/>`;
      return g(x, y, s, q, o.rot || 0);
    }
    q += `<defs><radialGradient id="${id}k" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="${o.warnaKoklea || C.AMBERL}"/><stop offset="1" stop-color="${o.warnaKoklea || C.AMBER}" stop-opacity="0"/></radialGradient></defs>`;
    q += `<path d="${SIL}" fill="${C.BERRY3}" opacity=".55"/><path d="${SIL}" stroke="${C.PINKL}" stroke-width="6" fill="none" opacity=".7"/>`;
    // tengkorak + rahang (tulang)
    const tl = o.tulangGlow || 0, tw = tl > 0 ? `rgb(${f1(244 + 11 * tl)},${f1(230 - 20 * tl)},${f1(240 - 120 * tl)})` : "#F4E6F0";
    q += `<path d="M-176 -50 C-186 -210 -56 -296 66 -272 C168 -250 208 -160 204 -64 C200 -20 180 10 150 20 L60 30 C20 40 -20 60 -40 90 C-90 110 -150 60 -176 -50Z" fill="${tw}" opacity="${f2(0.34 + 0.3 * tl)}"/>`;
    q += `<path d="M-30 96 C-20 140 0 200 40 226 C80 250 140 250 178 236 C186 218 186 200 176 196 C130 210 80 206 50 186 C24 166 10 130 6 96Z" fill="${tw}" opacity="${f2(0.4 + 0.35 * tl)}"/>`;
    q += `<path d="M150 112 L190 116 M150 196 L184 192" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity=".6"/>`; // gigi
    // mulut terbuka saat bicara
    q += `<path d="M196 ${f1(140 - bic * 6)} Q${f1(176 - bic * 10)} 150 196 ${f1(160 + bic * 10)}" stroke="#2A0B23" stroke-width="${f1(8 + bic * 10)}" fill="none" stroke-linecap="round"/>`;
    // telinga luar + saluran + koklea
    q += `<path d="M-60 -6 C-104 -6 -108 84 -58 90 C-24 94 -18 46 -38 26 C-48 14 -44 0 -60 -6Z" fill="#E9A2C8" opacity=".85"/><path d="M-46 34 L-14 18" stroke="#3A0F2E" stroke-width="16" stroke-linecap="round" opacity=".7"/>`;
    const kg = o.koklea || 0, kr = 34 + 26 * kg + (o.pompa ? 8 * Math.sin(t * 9) * o.pompa : 0);
    q += `<circle cx="${KP.koklea[0]}" cy="${KP.koklea[1]}" r="${f1(kr * 2.2)}" fill="url(#${id}k)" opacity="${f2(0.25 + 0.75 * kg)}"/>`;
    q += `<path d="M-4 6 m-2 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -18 0 a16 16 0 1 1 30 0 a22 22 0 1 1 -42 0" stroke="${kg > 0.2 ? "#FFF6E0" : C.PINKL}" stroke-width="6" fill="none" stroke-linecap="round" transform="rotate(${f1(t * 20 * kg)} -4 6)"/>`;
    return g(x, y, s, q, o.rot || 0);
  }
  kepala.titik = (x, y, s, nama) => { const p = KP[nama]; return [x + p[0] * s, y + p[1] * s]; };
  kepala.lokal = (x, y, s, px, py) => [x + px * s, y + py * s];

  // ---------- gang senja + siluet misteri ----------
  function gangSenja(w, h, t = 0) {
    const id = uid("gs");
    let s = `<defs><linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A2A6E"/><stop offset=".55" stop-color="#E0708A"/><stop offset="1" stop-color="#FFC48A"/></linearGradient></defs>`;
    s += `<rect width="${w}" height="${h}" fill="url(#${id}l)"/>`;
    s += `<path d="M0 0 L${w * 0.3} 360 L${w * 0.3} 1380 L0 ${h}Z" fill="#7A2A5E"/><path d="M${w} 0 L${w * 0.7} 360 L${w * 0.7} 1380 L${w} ${h}Z" fill="#6A2152"/>`;
    s += `<rect x="${w * 0.3}" y="360" width="${w * 0.4}" height="1020" fill="#9A3E6E" opacity=".55"/>`;
    s += `<path d="M0 ${h} L${w * 0.3} 1380 L${w * 0.7} 1380 L${w} ${h}Z" fill="#4A1238"/>`;
    for (let i = 0; i < 6; i++) { const y0 = 1400 + i * 90; s += `<path d="M${f1(w * 0.3 - i * 60)} ${y0} L${f1(w * 0.7 + i * 60)} ${y0}" stroke="#5E1A48" stroke-width="6"/>`; }
    // tali jemuran + kabel
    s += `<path d="M0 560 Q${w / 2} 640 ${w} 540" stroke="#3A0F2E" stroke-width="5" fill="none"/><path d="M0 300 Q${w / 2} 420 ${w} 280" stroke="#3A0F2E" stroke-width="4" fill="none" opacity=".7"/>`;
    [[160, "#F2B33D"], [300, "#5FB3A0"], [860, "#F07AB0"]].forEach(([x, c], i) => { const yy = 575 + Math.sin(x / 200) * 20, sw = Math.sin(t * 1.4 + i) * 4; s += `<path d="M${x - 40} ${yy} L${x + 40} ${yy} L${x + 34 + sw} ${yy + 110} L${x - 34 + sw} ${yy + 110}Z" fill="${c}" opacity=".9"/>`; });
    // lampu gang
    s += `<rect x="${w * 0.7 - 30}" y="700" width="60" height="26" rx="8" fill="#3A0F2E"/><circle cx="${w * 0.7}" cy="740" r="18" fill="#FFE7A6"/><circle cx="${w * 0.7}" cy="740" r="90" fill="#FFE7A6" opacity=".18"/>`;
    // pot tanaman
    [[90, 1500], [990, 1520]].forEach(([x, y]) => { s += `<path d="M${x - 50} ${y} L${x + 50} ${y} L${x + 36} ${y + 90} L${x - 36} ${y + 90}Z" fill="#C2307E"/><path d="M${x} ${y} q-60 -80 -30 -150 M${x} ${y} q10 -120 50 -160 M${x} ${y} q40 -60 80 -70" stroke="#3FA86A" stroke-width="18" fill="none" stroke-linecap="round"/>`; });
    return s;
  }
  function siluetTanya(x, y, s, t = 0, o = {}) {
    const k = cl(o.k ?? 1), lit = cl(o.terang || 0);
    let q = `<g opacity="${f2(k)}"><ellipse cx="0" cy="0" rx="90" ry="18" fill="#000" opacity=".2"/>`;
    q += `<path d="M-90 0 Q-100 -200 -60 -250 Q0 -280 60 -250 Q100 -200 90 0Z" fill="${lit ? `rgba(30,10,30,${f2(0.92 - lit * 0.4)})` : "#2A0B23"}"/><circle cx="0" cy="-330" r="70" fill="${lit ? `rgba(30,10,30,${f2(0.92 - lit * 0.4)})` : "#2A0B23"}"/>`;
    if (o.rambut === "kerudung") q += `<path d="M-80 -330 Q-80 -420 0 -420 Q80 -420 80 -330 Q90 -240 60 -230 L-60 -230 Q-90 -240 -80 -330Z" fill="#2A0B23"/>`;
    if (o.rambut === "topi") q += `<path d="M-110 -370 Q0 -460 110 -370Z" fill="#2A0B23"/>`;
    const bob = Math.sin(t * 3 + (o.fase || 0)) * 8;
    q += `<g transform="translate(0 ${f1(-470 + bob)}) rotate(${f1(Math.sin(t * 4 + (o.fase || 0)) * 10)})"><circle r="56" fill="${C.AMBER}"/><circle r="74" fill="${C.AMBER}" opacity=".25"/><text y="30" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="84" fill="#3A0F2E">?</text></g></g>`;
    return g(x, y, s, q);
  }
  function sorot(x, y, r, a) { if (a <= 0) return ""; const id = uid("sr"); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#FFF3D6" stop-opacity=".55"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient></defs><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${r}" ry="${r * 1.5}" fill="url(#${id})" opacity="${f2(a)}"/>`; }

  // ---------- orang generik (tampak depan) ----------
  function orang(x, y, s, t = 0, o = {}) {
    const kul = o.kulit || C.KUL, baju = o.baju || "#3E8FD0", ang = (o.angguk || 0) * Math.sin(t * 9) * 6, tl = cl(o.telinga || 0);
    let q = `<ellipse cx="0" cy="0" rx="120" ry="20" fill="#000" opacity=".18"/>`;
    // badan
    if (o.daster) q += `<path d="M-120 0 Q-130 -260 -90 -330 Q0 -360 90 -330 Q130 -260 120 0Z" fill="${baju}"/>${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${-70 + (i % 3) * 70}" cy="${-260 + Math.floor(i / 3) * 120}" r="20" fill="#FFFFFF" opacity=".35"/>`).join("")}`;
    else q += `<rect x="-70" y="-150" width="140" height="150" rx="20" fill="${o.celana || "#2E3A5A"}"/><path d="M-110 -130 Q-120 -280 -80 -330 Q0 -356 80 -330 Q120 -280 110 -130Z" fill="${baju}"/>`;
    if (o.celemek) q += `<path d="M-60 -300 L60 -300 L70 -60 L-70 -60Z" fill="#FFFFFF" opacity=".85"/>`;
    // leher + kepala
    q += `<g transform="rotate(${f1(ang)} 0 -340)"><rect x="-26" y="-370" width="52" height="40" fill="${o.kulitG || C.KULG}"/>`;
    q += `<ellipse cx="-92" cy="-450" rx="20" ry="28" fill="${kul}"/><ellipse cx="92" cy="-450" rx="20" ry="28" fill="${kul}"/>`;
    if (tl > 0) [-92, 92].forEach((ex) => { q += `<circle cx="${ex}" cy="-450" r="${f1(30 + 16 * tl + 4 * Math.sin(t * 8))}" fill="${C.MINT}" opacity="${f2(0.45 * tl)}"/><ellipse cx="${ex}" cy="-450" rx="20" ry="28" fill="${C.MINTL}" opacity="${f2(0.8 * tl)}"/>`; });
    q += `<ellipse cx="0" cy="-460" rx="90" ry="100" fill="${kul}"/>`;
    if (o.rambut === "panjang") q += `<path d="M-96 -470 Q-100 -580 0 -575 Q100 -580 96 -470 Q98 -400 92 -380 L80 -470 Q30 -520 -80 -470 L-92 -380 Q-98 -400 -96 -470Z" fill="#3B2A20"/>`;
    else if (o.rambut === "peci") q += `<path d="M-84 -500 Q-86 -560 -70 -580 L70 -580 Q86 -560 84 -500Z" fill="#1E1E2E"/><path d="M-90 -500 Q-60 -520 -20 -500 Q-60 -490 -90 -480Z" fill="#3B2A20"/>`;
    else if (o.rambut === "handuk") q += `<path d="M-96 -480 Q-100 -590 0 -580 Q100 -590 96 -480 Q60 -520 0 -515 Q-60 -520 -96 -480Z" fill="#3B2A20"/><path d="M-110 -330 Q0 -300 110 -330 L104 -300 Q0 -270 -104 -300Z" fill="#FFFFFF" opacity=".9"/>`;
    else q += `<path d="M-92 -470 Q-100 -580 0 -578 Q96 -582 92 -478 Q60 -530 -10 -520 Q-60 -520 -92 -470Z" fill="#2E2018"/>`;
    // wajah sederhana
    const ek = o.mata === "senang" ? 1 : 0;
    [-34, 34].forEach((ex) => { q += ek ? `<path d="M${ex - 14} -460 q14 -14 28 0" stroke="#2A1A14" stroke-width="7" fill="none" stroke-linecap="round"/>` : `<ellipse cx="${ex + (o.lihatX || 0)}" cy="-462" rx="9" ry="12" fill="#2A1A14"/>`; });
    q += `<ellipse cx="-56" cy="-420" rx="16" ry="9" fill="#F58A7A" opacity=".4"/><ellipse cx="56" cy="-420" rx="16" ry="9" fill="#F58A7A" opacity=".4"/>`;
    q += `<path d="M-26 -416 Q0 ${o.senyum === 0 ? -414 : -396} 26 -416" stroke="#7A2B2B" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
    if (o.isiTangan) q += o.isiTangan;
    return g(x, y, s, q, 0, o.cermin ? s : undefined);
  }

  function bangkuKampus(w, h, t = 0) {
    let s = `<rect width="${w}" height="${h}" fill="#F4D7E6"/><rect y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="#C28AAE"/>`;
    s += `<rect x="60" y="360" width="${w - 120}" height="520" rx="20" fill="#E9BFD6"/>${[0, 1, 2, 3].map((i) => `<rect x="${120 + i * 230}" y="420" width="160" height="200" rx="10" fill="#FFFFFF" opacity=".5"/>`).join("")}`;
    s += `<circle cx="${w - 150}" cy="620" r="190" fill="#3FA86A" opacity=".85"/><rect x="${w - 170}" y="700" width="40" height="500" fill="#7A4A3A"/>`;
    s += `<rect x="140" y="1300" width="800" height="40" rx="14" fill="#8E5A3A"/><rect x="180" y="1340" width="30" height="120" fill="#6A3A2A"/><rect x="870" y="1340" width="30" height="120" fill="#6A3A2A"/>`;
    return s;
  }
  function dapurRumah(w, h, t = 0) {
    let s = `<rect width="${w}" height="${h}" fill="#F7E0C8"/>`;
    for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) s += `<rect x="${i * 130 + 4}" y="${500 + j * 110 + 4}" width="122" height="102" fill="#FFF3E4" opacity=".8"/>`;
    s += `<rect y="1180" width="${w}" height="${h - 1180}" fill="#B96A4A"/><rect y="1160" width="${w}" height="40" fill="#8E4A34"/>`;
    s += `<rect x="640" y="1080" width="300" height="80" rx="16" fill="#4A4A5A"/><path d="M700 1060 Q700 980 790 980 L860 980 Q900 980 900 1060Z" fill="#3A3A48"/><rect x="900" y="1000" width="120" height="18" rx="9" fill="#3A3A48"/>`;
    for (let i = 0; i < 3; i++) { const u = (t * 0.5 + i / 3) % 1; s += `<path d="M${780 + i * 30} ${f1(960 - u * 200)} q-20 -30 0 -60" stroke="#FFFFFF" stroke-width="12" fill="none" stroke-linecap="round" opacity="${f2(0.5 * Math.sin(Math.PI * u))}"/>`; }
    s += `<rect x="80" y="300" width="300" height="160" rx="12" fill="#E9BFA6"/><rect x="100" y="320" width="120" height="120" rx="8" fill="#FFFFFF" opacity=".5"/>`;
    return s;
  }
  function gerobakBakso(x, y, s, t = 0, o = {}) {
    let q = `<ellipse cx="0" cy="20" rx="380" ry="30" fill="#000" opacity=".18"/>`;
    q += `<circle cx="-240" cy="-20" r="56" fill="#2A2A36"/><circle cx="-240" cy="-20" r="22" fill="#8A8A9A"/><circle cx="240" cy="-20" r="56" fill="#2A2A36"/><circle cx="240" cy="-20" r="22" fill="#8A8A9A"/>`;
    q += `<rect x="-340" y="-420" width="680" height="380" rx="20" fill="#E23C4A"/><rect x="-340" y="-420" width="680" height="40" rx="14" fill="#B82838"/>`;
    q += `<rect x="-300" y="-370" width="300" height="180" rx="12" fill="#CFF3F0" opacity=".6"/>${[0, 1, 2].map((i) => `<circle cx="${-240 + i * 80}" cy="-250" r="28" fill="#E8C9A0"/>`).join("")}`;
    q += `<rect x="40" y="-560" width="260" height="140" rx="20" fill="#C9CCD6"/><ellipse cx="170" cy="-560" rx="130" ry="28" fill="#E6E8EE"/>`;
    for (let i = 0; i < 3; i++) { const u = (t * 0.6 + i / 3) % 1; q += `<path d="M${120 + i * 50} ${f1(-600 - u * 160)} q-18 -30 0 -60" stroke="#FFFFFF" stroke-width="12" fill="none" stroke-linecap="round" opacity="${f2(0.6 * Math.sin(Math.PI * u))}"/>`; }
    q += `<rect x="-360" y="-720" width="20" height="700" fill="#8E5A3A"/><rect x="340" y="-720" width="20" height="700" fill="#8E5A3A"/><path d="M-400 -720 L400 -720 L360 -660 L-360 -660Z" fill="#F2B33D"/>`;
    return g(x, y, s, q);
  }
  function mangkukSendok(x, y, s, t = 0, ketuk = 0) { // mangkuk di tangan kiri, sendok mengetuk bibir mangkuk
    const a = -20 + 26 * ketuk;
    let q = `<path d="M-90 0 Q-80 70 0 76 Q80 70 90 0Z" fill="#FFFFFF"/><ellipse cx="0" cy="0" rx="90" ry="20" fill="#F3F0E8"/><path d="M-70 26 Q0 46 70 26" stroke="#3E8FD0" stroke-width="8" fill="none"/>`;
    q += `<g transform="translate(80 -10) rotate(${f1(a)})"><rect x="0" y="-8" width="150" height="16" rx="8" fill="#C9CCD6"/><ellipse cx="0" cy="0" rx="28" ry="16" fill="#DADDE6"/><circle cx="160" cy="0" r="24" fill="${C.KUL}"/></g>`;
    if (ketuk > 0.85) q += `<path d="M90 -40 l24 -24 M100 -10 l34 -6 M76 -50 l6 -32" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>`;
    return g(x, y, s, q);
  }

  // ---------- lencana ≈ ----------
  function lencanaKira(x, y, s, k = 1) {
    if (k <= 0) return "";
    const z = 0.7 + 0.3 * halus(cl(k));
    return g(x, y, s * z, `<g opacity="${f2(cl(k * 2))}"><circle r="74" fill="${C.MINT}" opacity=".25"/><circle r="60" fill="#FFF6FA"/><path d="M-32 -12 q16 -16 32 0 t32 0 M-32 18 q16 -16 32 0 t32 0" stroke="${C.BERRY2}" stroke-width="11" fill="none" stroke-linecap="round"/></g>`);
  }

  // ---------- otak di sofa ----------
  function bingkaiGelombang(x, y, s, t = 0) {
    let q = `<rect x="-110" y="-80" width="220" height="160" rx="14" fill="#C98A3A"/><rect x="-92" y="-62" width="184" height="124" rx="8" fill="#4A1238"/>`;
    let d = ""; for (let i = 0; i <= 40; i++) { const xx = -80 + i * 4; d += (i ? " L" : "M") + xx + " " + f1(Math.sin(i * 0.5 - t * 2) * 30 * Math.sin(Math.PI * i / 40)); }
    q += `<path d="${d}" stroke="${C.AMBER}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#FFF1CF" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    q += `<path d="M-30 -100 Q0 -130 30 -100" stroke="#C98A3A" stroke-width="6" fill="none"/>`;
    return g(x, y, s, q);
  }
  function otakSofa(x, y, s, t = 0, o = {}) {
    const sip = o.sipit ? cl(o.sipit) : 0, nap = Math.sin(t * 2) * 4;
    let q = `<ellipse cx="0" cy="190" rx="400" ry="30" fill="#000" opacity=".2"/>`;
    q += `<rect x="-380" y="-60" width="760" height="230" rx="60" fill="#3FB8C9"/><rect x="-420" y="-180" width="120" height="340" rx="56" fill="#2E9AAB"/><rect x="300" y="-180" width="120" height="340" rx="56" fill="#2E9AAB"/><rect x="-330" y="-260" width="660" height="230" rx="70" fill="#52C7D6"/>`;
    // otak (rebahan miring)
    q += `<g transform="translate(-30 ${f1(-110 + nap)}) rotate(-12)">`;
    q += `<path d="M-200 40 C-240 -40 -190 -140 -100 -150 C-60 -210 40 -210 80 -160 C160 -180 230 -110 210 -30 C250 30 200 110 120 100 C80 140 -20 140 -60 100 C-140 130 -220 100 -200 40Z" fill="#F7A6C4"/>`;
    q += `<path d="M-140 -60 q40 -30 70 10 q30 -50 80 -10 q40 -40 90 10 M-150 30 q50 -20 80 20 q40 -40 90 0 q40 -30 80 10" stroke="#E07FA6" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    [-50, 50].forEach((ex) => { q += `<ellipse cx="${ex + (o.lihatX || 0)}" cy="-60" rx="20" ry="${f1(26 * (1 - sip * 0.75))}" fill="#FFFFFF"/><circle cx="${ex + (o.lihatX || 0) * 1.5}" cy="-56" r="${f1(11 * (1 - sip * 0.4))}" fill="#2A0B23"/>`; });
    if (sip > 0.2) [-50, 50].forEach((ex) => { q += `<path d="M${ex - 26} -${f1(80 - sip * 6)} l52 ${ex < 0 ? 8 : -8}" stroke="#C25A86" stroke-width="9" stroke-linecap="round" opacity="${f2(sip)}"/>`; });
    q += `<path d="M-24 0 Q0 ${o.senyum ?? 18} 24 0" stroke="#7A2B4F" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    q += `</g>`;
    q += bingkaiGelombang(-10, 10 + nap, 1.05, t);
    // lengan memeluk bingkai
    q += `<path d="M-200 -60 Q-160 40 -90 60" stroke="#F7A6C4" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M160 -70 Q140 30 70 60" stroke="#F7A6C4" stroke-width="34" fill="none" stroke-linecap="round"/>`;
    if (o.hati) q += `<path d="M130 -250 c-20 -30 -60 -10 -40 20 l40 40 l40 -40 c20 -30 -20 -50 -40 -20Z" fill="${C.PINK}" opacity="${f2(0.6 + 0.4 * Math.sin(t * 4))}" transform="translate(0 ${f1(-((t * 30) % 60))})"/>`;
    return g(x, y, s, q);
  }
  function pintuKetuk(x, y, s, t = 0, o = {}) {
    const k = o.ketuk || 0;
    let q = `<rect x="-150" y="-460" width="300" height="460" rx="20" fill="#5A1844"/><rect x="-126" y="-436" width="252" height="436" rx="12" fill="#8E2468"/><circle cx="90" cy="-220" r="14" fill="${C.AMBER}"/>`;
    q += `<rect x="-96" y="-400" width="192" height="150" rx="10" fill="#A6337A"/><rect x="-96" y="-220" width="192" height="180" rx="10" fill="#A6337A"/>`;
    if (k > 0) { const u = (((t * 3) % 1) + 1) % 1; q += `<g opacity="${f2(k * (1 - u))}"><path d="M-180 -300 l-40 -20 M-180 -260 l-50 0 M-180 -220 l-40 20" stroke="${C.MINTL}" stroke-width="8" stroke-linecap="round"/></g>`; }
    return g(x, y, s, q);
  }
  function tanyaKecil(x, y, s, t = 0, a = 1) {
    if (a <= 0) return "";
    return g(x, y + Math.sin(t * 2 + x) * 10, s, `<g opacity="${f2(a)}"><circle r="40" fill="#FFF6FA" opacity=".9"/><text y="22" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="60" fill="${C.BERRY2}">?</text></g>`);
  }

  // ---------- ruang uji (percobaan dengar lewat tulang) ----------
  function ruangUji(w, h, t = 0) {
    let s = `<rect width="${w}" height="${h}" fill="#EAF3F1"/>`;
    for (let i = 0; i < Math.ceil(w / 160); i++) for (let j = 0; j < 10; j++) s += `<rect x="${i * 160 + 6}" y="${j * 160 + 6}" width="148" height="148" rx="10" fill="#DCEBE8"/>`;
    s += `<rect y="1420" width="${w}" height="${h - 1420}" fill="#C7DCD8"/><rect y="1400" width="${w}" height="24" fill="#B4CDC8"/>`;
    s += `<rect x="${w * 0.08}" y="1160" width="${w * 0.84}" height="40" rx="14" fill="#9FBDB8"/>`;
    return s;
  }
  function orangUji(x, y, s, t = 0, o = {}) { // siluet sederhana tampak samping (menghadap kanan), headphone konduksi tulang di tulang pipi, telinga terbuka
    const vib = cl(o.getar || 0);
    let q = `<path d="M-150 420 Q-170 220 -60 170 L40 170 Q150 220 150 420Z" fill="#5E6E8A"/>`;
    q += `<path d="M-30 120 L-30 180 L40 180 L40 120Z" fill="#B98A6A"/>`;
    q += `<path d="M-120 -60 C-130 -190 -30 -250 60 -230 C140 -210 170 -130 166 -50 L188 10 Q192 24 176 26 L164 28 C168 50 160 62 150 66 Q156 82 146 92 C140 130 110 150 60 146 C10 142 -30 130 -60 110 C-110 70 -118 20 -120 -60Z" fill="#B98A6A"/>`;
    q += `<path d="M-126 -50 C-136 -200 -20 -270 76 -236 C130 -214 150 -180 140 -160 C90 -180 30 -170 0 -140 C-30 -110 -70 -120 -90 -70 C-100 -40 -110 -20 -130 10Z" fill="#3B2A20"/>`;
    q += `<path d="M-40 -30 C-70 -30 -74 30 -42 36 C-20 40 -14 10 -26 -4Z" fill="#A87A5A"/>`; // telinga terbuka
    // headphone konduksi tulang: bantalan di depan telinga (tulang pipi), ikat di belakang kepala
    q += `<path d="M30 -10 C0 -160 -150 -160 -150 -30" stroke="#2E3A4A" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="14" y="-34" width="46" height="60" rx="18" fill="#2E3A4A"/><rect x="22" y="-26" width="30" height="44" rx="12" fill="${C.AMBER}" opacity="${f2(0.4 + 0.6 * vib)}"/>`;
    if (vib > 0) for (let i = 0; i < 3; i++) { const u = (t * 1.6 + i / 3) % 1, r = 30 + u * 70; q += `<path d="M${f1(37 - r * 0.2)} ${f1(-r)} Q${f1(37 - r)} -4 ${f1(37 - r * 0.2)} ${f1(r * 0.9)}" stroke="${C.AMBER}" stroke-width="7" fill="none" stroke-linecap="round" opacity="${f2(vib * (1 - u))}"/>`; }
    return g(x, y, s, q);
  }
  function ikonOrangAsing(x, y, s, o = {}) {
    return g(x, y, s, `<g opacity="${f2(o.a ?? 1)}"><circle r="72" fill="#C9D2D8"/><circle cx="0" cy="-16" r="24" fill="#8A97A2"/><path d="M-40 42 Q-40 10 0 10 Q40 10 40 42Z" fill="#8A97A2"/></g>`);
  }
  function centangCahaya(x, y, s, k = 1) {
    if (k <= 0) return ""; const z = 0.6 + 0.4 * halus(cl(k)), L = 160, d = (1 - cl(k * 1.4)) * L;
    return g(x, y, s * z, `<circle r="80" fill="${C.MINT}" opacity="${f2(0.35 * cl(k))}"/><circle r="56" fill="${C.MINT}" opacity="${f2(cl(k * 2))}"/><path d="M-26 0 L-6 20 L28 -18" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${L}" stroke-dashoffset="${f1(d)}"/>`);
  }

  // ---------- kartu reaksi (NGERI / KAGET / BIASA) ----------
  function kartuReaksi(x, y, s, jenis, teks, t = 0, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0.001) return "";
    const warna = o.warna || "#FFF6FA", z = 0.75 + 0.25 * halus(k), dy = (1 - halus(k)) * 160;
    let wj = "";
    if (jenis === "ngeri") { const gt = Math.sin(t * 40) * 4; wj = `<g transform="translate(${f1(gt)} 0)"><path d="M-70 60 L-70 -20 Q-70 -100 0 -100 Q70 -100 70 -20 L70 60 L46 40 L24 60 L0 40 L-24 60 L-46 40Z" fill="#FFFFFF"/><ellipse cx="-24" cy="-30" rx="12" ry="18" fill="#3A0F2E"/><ellipse cx="24" cy="-30" rx="12" ry="18" fill="#3A0F2E"/><path d="M-20 14 q10 -10 20 0 q10 10 20 0" stroke="#3A0F2E" stroke-width="6" fill="none"/></g><path d="M-100 -60 l-16 -10 M-104 -20 l-20 0 M100 -60 l16 -10 M104 -20 l20 0" stroke="${C.MINT}" stroke-width="7" stroke-linecap="round"/>`; }
    if (jenis === "kaget") wj = `<circle r="86" fill="${C.AMBER}"/><circle cx="-28" cy="-24" r="16" fill="#FFFFFF"/><circle cx="28" cy="-24" r="16" fill="#FFFFFF"/><circle cx="-28" cy="-22" r="7" fill="#3A0F2E"/><circle cx="28" cy="-22" r="7" fill="#3A0F2E"/><ellipse cx="0" cy="${f1(36 + Math.sin(t * 6) * 4)}" rx="22" ry="${f1(32 + Math.sin(t * 6) * 4)}" fill="#7A2B2B"/>`;
    if (jenis === "biasa") wj = `<circle r="86" fill="${C.MINT}"/><path d="M-40 -24 h24 M16 -24 h24" stroke="#3A0F2E" stroke-width="9" stroke-linecap="round"/><path d="M-26 34 h52" stroke="#3A0F2E" stroke-width="9" stroke-linecap="round"/><path d="M-130 30 q20 -40 40 -10 M130 30 q-20 -40 -40 -10" stroke="#FFF6FA" stroke-width="12" fill="none" stroke-linecap="round" transform="translate(0 ${f1(Math.sin(t * 3) * 6)})"/>`;
    const q = `<g opacity="${f2(cl(k * 2))}" transform="translate(0 ${f1(dy)}) scale(${f2(z)})"><rect x="-150" y="-200" width="300" height="400" rx="34" fill="#000" opacity=".25" transform="translate(10 14)"/><rect x="-150" y="-200" width="300" height="400" rx="34" fill="${warna}"/><g transform="translate(0 -40)">${wj}</g><text y="150" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="58" fill="${C.BERRY1}">${teks}</text></g>`;
    return g(x, y, s, q, o.rot || 0);
  }

  // ---------- layar chat generik: voice note direkam lalu dibuang berulang ----------
  function layarChat(x, y, s, t = 0, o = {}) {
    const w = 640, h = 1180, id = uid("lc"), fase = o.fase ?? 0, tumpuk = o.tumpuk || 0;
    let q = `<defs><clipPath id="${id}"><rect x="${-w / 2 + 20}" y="${-h / 2 + 24}" width="${w - 40}" height="${h - 48}" rx="44"/></clipPath></defs>`;
    q += `<rect x="${-w / 2 + 16}" y="${-h / 2 + 22}" width="${w}" height="${h}" rx="70" fill="#000" opacity=".25"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="70" fill="#2B2440"/>`;
    q += `<g clip-path="url(#${id})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#F6E9F1"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="140" fill="${C.BERRY2}"/><circle cx="${-w / 2 + 90}" cy="${-h / 2 + 84}" r="34" fill="${C.PINKL}"/><rect x="${-w / 2 + 140}" y="${-h / 2 + 70}" width="160" height="26" rx="13" fill="${C.PINKL}" opacity=".7"/>`;
    q += `<rect x="${-w / 2 + 40}" y="${-h / 2 + 190}" width="300" height="70" rx="35" fill="#FFFFFF"/><rect x="${w / 2 - 300}" y="${-h / 2 + 290}" width="260" height="70" rx="35" fill="${C.PINKL}"/><rect x="${-w / 2 + 40}" y="${-h / 2 + 390}" width="220" height="70" rx="35" fill="#FFFFFF"/>`;
    // gelembung voice note yang sedang direkam (fase 0..1: 0-.6 merekam, .6-1 terbang ke tong sampah)
    const rek = fase < 0.6, u = rek ? fase / 0.6 : (fase - 0.6) / 0.4;
    const bx = rek ? 0 : lerp(0, -w / 2 + 110, halus(u)), byy = rek ? 300 : lerp(300, h / 2 - 110, halus(u)) - Math.sin(Math.PI * u) * 120, bs = rek ? 1 : 1 - 0.75 * halus(u), br = rek ? 0 : u * 220;
    q += `<g transform="translate(${f1(bx)} ${f1(byy)}) rotate(${f1(br)}) scale(${f2(bs)})"><rect x="-230" y="-46" width="460" height="92" rx="46" fill="${C.MINT}"/><path d="M-200 -18 l30 18 l-30 18Z" fill="#1E3A34"/>`;
    for (let i = 0; i < 16; i++) { const hh = 14 + 34 * Math.abs(Math.sin(i * 1.3 + 0.4)); q += `<rect x="${-150 + i * 22}" y="${f1(-hh / 2)}" width="10" height="${f1(hh)}" rx="5" fill="#1E3A34" opacity="${rek && i / 16 > u ? 0.25 : 1}"/>`; }
    q += `</g>`;
    // tumpukan voice note kusut di pojok bawah kiri
    for (let i = 0; i < tumpuk; i++) { const a = i * 2.4; q += `<g transform="translate(${f1(-w / 2 + 110 + Math.cos(a) * 46)} ${f1(h / 2 - 150 - i * 26)}) rotate(${f1(a * 40)})"><path d="M-50 -20 L-20 -34 L20 -26 L52 -10 L40 22 L0 30 L-40 20Z" fill="${C.MINT}" opacity=".9"/><path d="M-30 -10 L10 4 M-10 -20 L20 10" stroke="#1E3A34" stroke-width="5" opacity=".4"/></g>`; }
    // bilah bawah: ikon mic (merekam) + tong sampah
    q += `<rect x="${-w / 2}" y="${h / 2 - 190}" width="${w}" height="190" fill="#EAD7E3"/>`;
    q += `<g transform="translate(${-w / 2 + 110} ${h / 2 - 96})"><rect x="-34" y="-30" width="68" height="70" rx="10" fill="${u > 0.8 && !rek ? C.MAG : "#8A6A80"}"/><rect x="-44" y="-44" width="88" height="16" rx="8" fill="${u > 0.8 && !rek ? C.MAG : "#8A6A80"}"/><rect x="-14" y="-56" width="28" height="14" rx="6" fill="#8A6A80"/></g>`;
    q += `<g transform="translate(${w / 2 - 110} ${h / 2 - 96})"><circle r="${f1(56 + (rek ? 8 * Math.sin(t * 10) : 0))}" fill="${rek ? C.MAG : C.BERRY3}"/><rect x="-16" y="-34" width="32" height="50" rx="16" fill="#FFFFFF"/><path d="M-26 6 q26 30 52 0 M0 30 v16" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
    q += `</g>`;
    return g(x, y, s, q, o.rot || 0);
  }

  const api = { C, kamarMalam, hpKecil, gelombang, garisJalur, riakTulang, haluskanTitik, kepala, gangSenja, siluetTanya, sorot, orang, bangkuKampus, dapurRumah, gerobakBakso, mangkukSendok,
    lencanaKira, otakSofa, pintuKetuk, bingkaiGelombang, tanyaKecil, ruangUji, orangUji, ikonOrangAsing, centangCahaya, kartuReaksi, layarChat };
  root.ASET = Object.assign(root.ASET || {}, { SUARA: api });
})(typeof window !== "undefined" ? window : globalThis);
