/* ASET PEDAS — tambahan pustaka (Yoga, 18 Nov 2026; dipakai I-005 "Pedas itu rasa apa?"). Muat SETELAH aset-set.js.
 * Gaya sama dengan aset-set.js: datar tanpa garis hitam, bayangan lembut. Semua fungsi → potongan SVG (string).
 *  cabaiRawit(x,y,s,{rot,warna,belah}) · cobekSambal(x,y,s,t) · tetesKeringat(x,y,s,a) · apiKartun(x,y,s,t,{palsu,a}) · termometer(x,y,s,nilai,{teks,ambang})
 *  dalamMulut(w,h,t) · papilaLidah(x,y,s) · selPengecap(x,y,s,t,{nyala,jenis:'manis'|'asin'}) · sarafNyeri(d,t,{tebal}) · kanalTRPV1(x,y,s,t,{buka,nyala})
 *  molekulKapsaisin(x,y,s,t,{glow}) · sinyalSaraf(titik[],t,{maju,n}) · sirene(x,y,s,t,{nyala}) · ruangKendali(w,h,t,{alarm})
 *  gurunSemak(w,h,P,t,{tanah}) · semakCabaiLiar(x,y,s,P,t,{petik}) · burungParuhLengkung(x,y,s,t,{patuk,kepak,arah}) · biji(x,y,s,{retak})
 *  siluetIlmuwan(x,y,s,{warna,tangan}) · cawanPetri(x,y,s,t,{nyala:0..1, n}) · medaliPolos(x,y,s,t) · kapalKayuSiluet(x,y,s,t,{warna}) */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let _n = 0; const uid = (p) => `${p}p${++_n}`;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;

  // ---------- cabai rawit (panjang ±200 pada s=1, pangkal di 0,0 mengarah ke kanan) ----------
  function cabaiRawit(x, y, s, o = {}) {
    const w = o.warna || "#E2232E", wg = o.gelap || "#B3161F", bel = cl(o.belah || 0);
    const badan = `<path d="M0 -26 C60 -40 150 -30 205 8 C214 14 210 22 200 20 C150 8 70 26 0 26 C-12 14 -12 -14 0 -26Z" fill="${w}"/>
      <path d="M10 12 C70 20 150 6 200 20 C150 14 70 30 4 24Z" fill="${wg}" opacity=".55"/><path d="M24 -16 C80 -26 140 -18 176 2" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" opacity=".45"/>`;
    const isiBelah = bel > 0 ? `<g opacity="${f2(bel)}"><path d="M20 -10 C80 -18 150 -10 190 12 C150 6 80 14 20 10Z" fill="#FFE1C8"/>${[40, 70, 100, 130, 158].map((xx, i) => `<circle cx="${xx}" cy="${i % 2 ? 2 : -2}" r="5.5" fill="#F6D27A"/>`).join("")}</g>` : "";
    const tangkai = `<path d="M2 -20 C-20 -30 -24 0 -6 22 C-2 10 -2 -8 2 -20Z" fill="#3E8E4A"/><path d="M-10 -2 C-40 -6 -58 -24 -66 -44" stroke="#3E8E4A" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    return g(x, y, s, `<ellipse cx="100" cy="34" rx="100" ry="10" fill="#000" opacity="${o.bayang ?? 0.12}"/>${badan}${isiBelah}${tangkai}`, o.rot || 0);
  }
  // ---------- cobek batu + sambal + ulekan ----------
  function cobekSambal(x, y, s, t = 0, o = {}) {
    let cab = ""; [[-120, -78, -18], [40, -84, 12], [-30, -92, -150]].forEach(([a, b, r], i) => { cab += cabaiRawit(a, b, 0.45, { rot: r, bayang: 0 }); });
    const kil = [-90, -40, 20, 70].map((a, i) => `<circle cx="${a}" cy="${-62 + (i % 2) * 6}" r="${7 + (i % 2) * 3}" fill="#FF7A5A" opacity=".7"/>`).join("");
    return g(x, y, s, `<ellipse cx="0" cy="14" rx="250" ry="28" fill="#000" opacity=".22"/><path d="M-240 -70 Q-230 20 -150 30 L150 30 Q230 20 240 -70Z" fill="#4A4A4E"/><path d="M-240 -70 Q-200 0 0 6 Q200 0 240 -70" fill="#3C3C40"/>
      <ellipse cx="0" cy="-70" rx="240" ry="46" fill="#5A5A60"/><ellipse cx="0" cy="-66" rx="200" ry="34" fill="#B3262E"/><ellipse cx="-20" cy="-70" rx="150" ry="22" fill="#D63A2E"/>${kil}
      ${o.tanpaCabai ? "" : cab}<g transform="rotate(${f1(28 + Math.sin(t * 1.5) * 3)} 120 -70)"><rect x="96" y="-300" width="52" height="250" rx="24" fill="#6A6A70"/><rect x="104" y="-290" width="14" height="220" rx="7" fill="#8A8A92" opacity=".6"/></g>`);
  }
  function tetesKeringat(x, y, s, a = 1) {
    if (a <= 0) return "";
    return g(x, y, s, `<g opacity="${f2(cl(a))}"><path d="M0 -34 C12 -14 22 0 22 12 C22 26 12 34 0 34 C-12 34 -22 26 -22 12 C-22 0 -12 -14 0 -34Z" fill="#7EC4E6"/><ellipse cx="-7" cy="10" rx="5" ry="8" fill="#FFFFFF" opacity=".7"/></g>`);
  }
  // ---------- api kartun: lidah api 3 lapis; palsu → tembus pandang + garis putus (alarm palsu) ----------
  function apiKartun(x, y, s, t = 0, o = {}) {
    const a = cl(o.a ?? 1); if (a <= 0) return "";
    const pl = cl(o.palsu || 0), gy = (k) => f1(Math.sin(t * 11 + k) * 10), id = uid("api");
    const lidah = (sx, sy, w1, warna, k) => `<path d="M${-w1} 0 C${-w1} ${-70 * sy} ${-w1 * 0.3 + +gy(k) * 0.5} ${-120 * sy} ${gy(k)} ${-200 * sy} C${w1 * 0.25} ${-140 * sy} ${w1 * 0.7} ${-110 * sy} ${w1 * 0.55} ${-160 * sy} C${w1 * 1.1} ${-90 * sy} ${w1} ${-40 * sy} ${w1} 0 C${w1} ${40 * sx} ${-w1} ${40 * sx} ${-w1} 0Z" fill="${warna}"/>`;
    const padat = `<g opacity="${f2(1 - pl * 0.85)}">${lidah(1, 1.0 + Math.sin(t * 7) * 0.06, 110, "#E2232E", 1)}${lidah(1, 0.78 + Math.sin(t * 9) * 0.05, 78, "#FF8A2A", 2)}${lidah(1, 0.5 + Math.sin(t * 12) * 0.05, 46, "#FFD84A", 3)}</g>`;
    const garis = pl > 0 ? `<g opacity="${f2(pl)}" fill="none" stroke="#FFE7A6" stroke-width="9" stroke-dasharray="22 16" stroke-linecap="round" stroke-dashoffset="${f1(-t * 60)}">${lidah(1, 1.0 + Math.sin(t * 7) * 0.06, 110, "none", 1).replace('fill="none"', "")}</g>` : "";
    return g(x, y, s, `<g opacity="${f2(a)}"><ellipse cx="0" cy="-60" rx="200" ry="190" fill="#FFB347" opacity="${f2(0.18 * (1 - pl))}"/>${padat}${garis}</g>`, o.rot || 0);
  }
  // ---------- termometer (teks angka lewat kode, mis. "37°") ----------
  function termometer(x, y, s, nilai, o = {}) {
    const n = cl(nilai), id = uid("tm"), tinggi = 300, isi = n * (tinggi - 40);
    const amb = o.ambang != null ? `<g transform="translate(0 ${f1(-40 - cl(o.ambang) * (tinggi - 40))})"><path d="M38 0 L70 -14 L70 14Z" fill="${o.ambangWarna || "#FFC93C"}"/><rect x="34" y="-3" width="8" height="6" fill="${o.ambangWarna || "#FFC93C"}"/>${o.ambangTeks ? `<text x="80" y="14" font-family="Poppins" font-weight="700" font-size="40" fill="${o.ambangWarna || "#FFC93C"}">${o.ambangTeks}</text>` : ""}</g>` : "";
    return g(x, y, s, `<ellipse cx="0" cy="40" rx="60" ry="10" fill="#000" opacity=".15"/><rect x="-30" y="${-tinggi}" width="60" height="${tinggi}" rx="30" fill="#F4F2EC"/><circle cx="0" cy="0" r="46" fill="#F4F2EC"/>
      <rect x="-12" y="${f1(-40 - isi)}" width="24" height="${f1(isi + 40)}" rx="12" fill="#E2232E"/><circle cx="0" cy="0" r="32" fill="#E2232E"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="14" y="${-60 - i * 44}" width="14" height="5" rx="2" fill="#B9B4A8"/>`).join("")}<rect x="-20" y="${-tinggi + 18}" width="10" height="${tinggi - 70}" rx="5" fill="#FFFFFF" opacity=".7"/>${amb}
      ${o.teks ? `<text x="${o.teksX ?? 0}" y="${o.teksY ?? -tinggi - 26}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${o.uk || 56}" fill="${o.teksWarna || "#FFFFFF"}" stroke="#2A1214" stroke-width="10" paint-order="stroke">${o.teks}</text>` : ""}`);
  }
  // ---------- dalam mulut: gua merah muda, gigi atas-bawah, lidah berpapila ----------
  function papilaLidah(x, y, s) { return g(x, y, s, `<ellipse cx="0" cy="0" rx="16" ry="10" fill="#F08AA0"/><ellipse cx="-4" cy="-3" rx="6" ry="3.5" fill="#FBC0CC" opacity=".8"/>`); }
  function dalamMulut(w, h, t = 0, o = {}) {
    const id = uid("mu"), r = acak(o.benih || 5), ly = o.lidah ?? h * 0.6;
    let pap = ""; for (let j = 0; j < 9; j++) for (let i = 0; i < w / 90 + 2; i++) { const xx = i * 90 + (j % 2) * 45 - 40 + r() * 20, yy = ly + 40 + j * 58 + r() * 14; pap += papilaLidah(xx, yy, 0.8 + j * 0.12); }
    const gigi = (y0, arah) => { let d = ""; for (let i = -1; i < w / 150 + 1; i++) { const x0 = i * 150 + 20; d += `<path d="M${x0} ${y0} Q${x0 + 4} ${y0 + arah * 150} ${x0 + 65} ${y0 + arah * 165} Q${x0 + 126} ${y0 + arah * 150} ${x0 + 130} ${y0}Z" fill="#FBF6EA"/><path d="M${x0 + 20} ${y0 + arah * 20} Q${x0 + 24} ${y0 + arah * 100} ${x0 + 50} ${y0 + arah * 130}" stroke="#E9DFC8" stroke-width="10" fill="none" stroke-linecap="round"/>`; } return d; };
    return `<defs><radialGradient id="${id}" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#8E2A3A"/><stop offset=".6" stop-color="#6A1E2E"/><stop offset="1" stop-color="#3E1220"/></radialGradient>
      <linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F49AAE"/><stop offset="1" stop-color="#D86A86"/></linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#${id})"/>
      <path d="M0 0 H${w} V260 Q${w / 2} 420 0 260Z" fill="#C2485E"/><path d="M0 0 H${w} V200 Q${w / 2} 340 0 200Z" fill="#D45A70"/>${gigi(150, 1)}
      <path d="M${w / 2 - 50} 330 Q${w / 2} ${f1(470 + Math.sin(t * 2) * 8)} ${w / 2 + 50} 330Z" fill="#B23A52"/>
      <path d="M-100 ${ly + 30} Q${w / 2} ${ly - 90} ${w + 100} ${ly + 30} V${h} H-100Z" fill="url(#${id}l)"/><path d="M${w / 2} ${ly - 50} Q${w / 2 + 14} ${ly + 200} ${w / 2} ${h}" stroke="#C85A78" stroke-width="16" fill="none" opacity=".5"/>${pap}
      <g transform="translate(0 ${h})">${gigi(0, -1)}</g>`;
  }
  // sel pengecap: kuncup bulat di lidah, ikon manis (kubus gula) / asin (butir garam) di atasnya
  function selPengecap(x, y, s, t = 0, o = {}) {
    const n = cl(o.nyala || 0), war = o.jenis === "asin" ? "#9ACAF0" : "#FFC2DA";
    const ikon = o.jenis === "asin" ? [[-26, -8], [0, -22], [24, -6], [-8, 10], [16, 14]].map(([a, b]) => `<rect x="${a - 9}" y="${b - 9}" width="18" height="18" rx="3" fill="#FFFFFF" transform="rotate(${a} ${a} ${b})"/>`).join("")
      : `<path d="M-30 -14 L0 -30 L30 -14 L30 20 L0 36 L-30 20Z" fill="#FFFFFF"/><path d="M-30 -14 L0 2 L30 -14 M0 2 L0 36" stroke="#E9E2D6" stroke-width="5" fill="none"/>`;
    return g(x, y, s, `<circle cx="0" cy="-70" r="${f1(110 + n * 30)}" fill="${war}" opacity="${f2(n * 0.35)}"/><path d="M-60 0 Q-70 -110 0 -130 Q70 -110 60 0Z" fill="#E8798F"/><path d="M-40 -10 Q-46 -90 0 -104 Q46 -90 40 -10Z" fill="${war}" opacity="${f2(0.55 + 0.45 * n)}"/>
      <g transform="translate(0 ${f1(-190 - Math.sin(t * 2.2) * 8)}) scale(${f2(0.7 + 0.3 * n)})" opacity="${f2(0.3 + 0.7 * n)}">${ikon}</g>`);
  }
  // saraf nyeri: kabel kuning berdenyut sepanjang path d
  function sarafNyeri(d, t = 0, o = {}) {
    const tb = o.tebal || 34;
    return `<path d="${d}" stroke="#7A3A2A" stroke-width="${tb + 14}" fill="none" stroke-linecap="round" opacity=".5"/><path d="${d}" stroke="#F6C453" stroke-width="${tb}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#FFE7A6" stroke-width="${f1(tb * 0.28)}" fill="none" stroke-linecap="round" opacity=".8"/>`;
  }
  // gerbang TRPV1 (kanal di saraf): dua pintu bulat; buka 0..1; nyala = cahaya merah
  function kanalTRPV1(x, y, s, t = 0, o = {}) {
    const b = cl(o.buka || 0), ny = cl(o.nyala || 0), gs = b * 46;
    const pintu = (arah) => `<g transform="translate(${f1(arah * gs)} 0)"><path d="M${arah * 6} -110 Q${arah * 80} -110 ${arah * 80} 0 Q${arah * 80} 110 ${arah * 6} 110Z" fill="#F08A3A"/><path d="M${arah * 16} -86 Q${arah * 60} -86 ${arah * 60} 0" stroke="#FFC48A" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
    return g(x, y, s, `<circle r="${f1(150 + ny * 60)}" fill="#FF4A2A" opacity="${f2(ny * 0.35)}"/><ellipse cx="0" cy="0" rx="120" ry="140" fill="#7A2A2A"/>
      <rect x="${f1(-gs)}" y="-90" width="${f1(gs * 2)}" height="180" fill="#FFD84A" opacity="${f2(b * 0.9)}"/>${pintu(-1)}${pintu(1)}`, o.rot || 0);
  }
  // molekul kapsaisin: cincin heksagon + ekor rantai, berpendar jingga (gaya ikon, bukan rumus kimia)
  function molekulKapsaisin(x, y, s, t = 0, o = {}) {
    const hx = [...Array(6)].map((_, i) => `${f1(Math.cos(i * Math.PI / 3) * 46)},${f1(Math.sin(i * Math.PI / 3) * 46)}`).join(" ");
    let ekor = "", px = 46, py = 0; for (let i = 0; i < 6; i++) { const nx = px + 42, ny = (i % 2 ? 0 : 26) + Math.sin(t * 4 + i) * 4; ekor += `<path d="M${f1(px)} ${f1(py)} L${f1(nx)} ${f1(ny)}" stroke="#FFB347" stroke-width="12" stroke-linecap="round"/><circle cx="${f1(nx)}" cy="${f1(ny)}" r="11" fill="#FF8A2A"/>`; px = nx; py = ny; }
    return g(x, y, s, `<circle cx="80" cy="0" r="150" fill="#FF8A2A" opacity="${f2(0.22 * (o.glow ?? 1))}"/><polygon points="${hx}" fill="none" stroke="#FFB347" stroke-width="14" stroke-linejoin="round"/><circle r="18" fill="#FFD84A"/>${ekor}
      ${[0, 2, 4].map((i) => `<circle cx="${f1(Math.cos(i * Math.PI / 3) * 46)}" cy="${f1(Math.sin(i * Math.PI / 3) * 46)}" r="13" fill="#FF8A2A"/>`).join("")}<circle cx="-46" cy="-50" r="14" fill="#E2232E"/><path d="M-30 -40 L-40 -48" stroke="#FFB347" stroke-width="10"/>`, o.rot || 0);
  }
  // denyut cahaya merambat di jalur (titik = [[x,y],...]); maju = 0..1 posisi kepala denyut
  function sinyalSaraf(titik, t = 0, o = {}) {
    const n = o.n || 4, L = []; let tot = 0; for (let i = 1; i < titik.length; i++) { const d = Math.hypot(titik[i][0] - titik[i - 1][0], titik[i][1] - titik[i - 1][1]); L.push(d); tot += d; }
    const di = (u) => { let s = cl(u) * tot; for (let i = 0; i < L.length; i++) { if (s <= L[i]) { const k = s / L[i]; return [titik[i][0] + (titik[i + 1][0] - titik[i][0]) * k, titik[i][1] + (titik[i + 1][1] - titik[i][1]) * k]; } s -= L[i]; } return titik[titik.length - 1]; };
    let s = ""; const m = o.maju ?? ((t * 0.8) % 1);
    for (let i = 0; i < n; i++) { const u = m - i * 0.07; if (u < 0 || u > 1) continue; const [x, y] = di(u), k = 1 - i / n; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(48 * k)}" fill="#FF6A3A" opacity="${f2(0.35 * k)}"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(20 * k)}" fill="#FFF1C0" opacity="${f2(k)}"/>`; }
    return s;
  }
  // sirene/lampu alarm berputar
  function sirene(x, y, s, t = 0, o = {}) {
    const ny = cl(o.nyala ?? 1), a = t * 7, sx = Math.cos(a);
    return g(x, y, s, `<path d="M0 -40 L${f1(700 * sx - 120)} -400 L${f1(700 * sx + 120)} -400Z" fill="#FF3A2A" opacity="${f2(0.18 * ny * Math.abs(sx))}"/><rect x="-70" y="-10" width="140" height="34" rx="8" fill="#4A4A55"/><path d="M-50 -10 Q-50 -100 0 -100 Q50 -100 50 -10Z" fill="${ny > 0.05 ? "#FF4A3A" : "#8A3A3A"}"/>
      <ellipse cx="${f1(sx * 26)}" cy="-56" rx="${f1(10 + 10 * Math.abs(sx))}" ry="34" fill="#FFD0C0" opacity="${f2(0.4 + 0.6 * ny)}"/><circle cx="0" cy="-60" r="${f1(90 * ny)}" fill="#FF4A3A" opacity="${f2(0.3 * ny)}"/>`);
  }
  // ruang kendali (latar otak): dinding ungu tua, panel layar berkedip, pipa ke bawah
  function ruangKendali(w, h, t = 0, o = {}) {
    const al = cl(o.alarm || 0), id = uid("rk"), r = acak(o.benih || 9);
    let pan = ""; for (let i = 0; i < 7; i++) for (let j = 0; j < 3; j++) { const x = 40 + i * (w - 80) / 7, y = 300 + j * 150; pan += `<rect x="${f1(x)}" y="${y}" width="${f1((w - 80) / 7 - 20)}" height="120" rx="12" fill="#3A3256"/><rect x="${f1(x + 14)}" y="${y + 14}" width="${f1((w - 80) / 7 - 48)}" height="${f1(40 + 30 * Math.abs(Math.sin(t * (1 + r()) + i + j)))}" rx="6" fill="${al > 0.5 && (i + j) % 2 ? "#FF6A5A" : ["#5FC2B0", "#8AA8FF", "#FFC93C"][(i + j) % 3]}" opacity=".55"/>`; }
    return `<defs><radialGradient id="${id}" cx=".5" cy=".38" r=".75"><stop offset="0" stop-color="#5A4A7A"/><stop offset="1" stop-color="#2A2440"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>${pan}
      <rect width="${w}" height="${h}" fill="#FF2A2A" opacity="${f2(al * 0.16 * (0.5 + 0.5 * Math.sin(t * 14)))}"/><rect x="0" y="${h * 0.74}" width="${w}" height="${h * 0.26}" fill="#231E36"/><rect x="0" y="${h * 0.74}" width="${w}" height="16" fill="#3E365A"/>`;
  }
  // ---------- gurun semak siang (asal cabai liar, generik) ----------
  function gurunSemak(w, h, P, t = 0, o = {}) {
    const ty = o.tanah ?? h * 0.7;
    let s = A.langit(P, w, h, t, { suryaX: w * 0.78, suryaY: h * 0.16 }) + A.awan(w * 0.22, h * 0.12, 1.1, P, 0.6) + A.awan(w * 0.7, h * 0.24, 0.8, P, 0.5);
    s += A.bukit(w, ty - 220, 160, 4, "#D9A47A", ty + 60) + A.bukit(w, ty - 120, 120, 8, "#C98E62", ty + 60);
    s += `<path d="M-200 ${ty} Q${w * 0.3} ${ty - 40} ${w * 0.6} ${ty + 4} T${w + 200} ${ty - 10} V${h + 400} H-200Z" fill="#E6C48E"/><path d="M-200 ${ty + 160} Q${w * 0.5} ${ty + 110} ${w + 200} ${ty + 170} V${h + 400} H-200Z" fill="#D8B07A"/>`;
    const r = acak(3); for (let i = 0; i < 9; i++) s += A.batu ? A.batu(r() * w, ty + 40 + r() * 300, 0.4 + r() * 0.5, P) : "";
    return s;
  }
  function semakCabaiLiar(x, y, s, P, t = 0, o = {}) {
    const r = acak(o.benih || 12), pk = o.petik || [];
    let daun = "", cab = "";
    for (let i = 0; i < 26; i++) { const a = r() * Math.PI, rr = 120 + r() * 170, xx = Math.cos(a) * rr * 1.25, yy = -Math.sin(a) * rr * 0.95 - 40; daun += `<ellipse cx="${f1(xx)}" cy="${f1(yy)}" rx="${f1(70 + r() * 40)}" ry="${f1(54 + r() * 30)}" fill="${i % 3 ? "#5E8A4E" : "#4C7640"}"/>`; }
    for (let i = 0; i < 16; i++) { const xx = -260 + r() * 520, yy = -330 + r() * 280; if (pk.includes(i)) continue; const rot = 70 + r() * 40 + Math.sin(t * 1.4 + i) * 4; cab += cabaiRawit(xx, yy, 0.36 + r() * 0.1, { rot, bayang: 0 }); }
    return g(x, y, s, `<ellipse cx="0" cy="8" rx="380" ry="34" fill="#000" opacity=".14"/><path d="M-12 0 L-20 -120 M12 0 L30 -110" stroke="#6A4A34" stroke-width="22" stroke-linecap="round"/>${daun}${cab}`);
  }
  // burung generik paruh lengkung (abu-cokelat), bertengger. patuk 0..1 menunduk; kepak 0..1 sayap terbuka
  function burungParuhLengkung(x, y, s, t = 0, o = {}) {
    const pt = cl(o.patuk || 0), kp = cl(o.kepak || 0), ar = o.arah || 1, kep = Math.sin(t * 20) * kp;
    const sayap = kp > 0.02 ? `<path d="M-10 -70 Q-60 ${f1(-170 - kep * 40)} -150 ${f1(-150 - kep * 60)} Q-90 -90 -40 -50Z" fill="#8A7A6A"/>` : `<path d="M-60 -60 Q-10 -110 50 -66 Q10 -30 -60 -40Z" fill="#8A7A6A"/>`;
    const kepala = `<g transform="rotate(${f1(pt * 38)} 40 -80)"><circle cx="60" cy="-104" r="38" fill="#A8968A"/><path d="M92 -110 Q150 -104 160 -60 Q130 -92 92 -94Z" fill="#3A3230"/><circle cx="70" cy="-114" r="9" fill="#2A2220"/><circle cx="73" cy="-117" r="3" fill="#FFFFFF"/><circle cx="70" cy="-114" r="13" fill="none" stroke="#F2C24A" stroke-width="4"/></g>`;
    return g(x, y, s, `<g transform="scale(${ar} 1)"><ellipse cx="0" cy="6" rx="70" ry="8" fill="#000" opacity=".12"/><path d="M-20 -6 L-26 6 M16 -6 L22 6" stroke="#4A3A30" stroke-width="7" stroke-linecap="round"/>
      <path d="M-70 -40 L-170 -10 L-150 -40Z" fill="#6E5E52"/><ellipse cx="0" cy="-54" rx="80" ry="54" fill="#A8968A"/><ellipse cx="14" cy="-38" rx="54" ry="30" fill="#D8C8B4"/>${sayap}${kepala}</g>`);
  }
  function biji(x, y, s, o = {}) {
    const rt = cl(o.retak || 0);
    return g(x, y, s, `<ellipse cx="0" cy="0" rx="26" ry="20" fill="#F6D27A"/><ellipse cx="-8" cy="-6" rx="8" ry="5" fill="#FFF0B8" opacity=".8"/>${rt > 0 ? `<path d="M-14 -16 L-2 -2 L-10 6 L6 18" stroke="#8A5A2A" stroke-width="5" fill="none" stroke-linecap="round" opacity="${f2(rt)}"/>` : ""}`, o.rot || 0);
  }
  // ---------- lab: siluet ilmuwan TANPA wajah, cawan petri, medali polos ----------
  function siluetIlmuwan(x, y, s, o = {}) {
    const w = o.warna || "#1C2A3A", tg = o.tangan ?? 0;
    return g(x, y, s, `<rect x="-58" y="-200" width="46" height="200" rx="18" fill="${w}"/><rect x="12" y="-200" width="46" height="200" rx="18" fill="${w}"/><path d="M-100 -520 Q0 -560 100 -520 L118 -170 L-118 -170Z" fill="${w}"/>
      <rect x="-26" y="-600" width="52" height="70" rx="20" fill="${w}"/><ellipse cx="0" cy="-660" rx="70" ry="80" fill="${w}"/>
      <path d="M-92 -480 Q-130 -340 -104 -230" stroke="${w}" stroke-width="46" stroke-linecap="round" fill="none"/><path d="M92 -480 Q${f1(150 + tg * 40)} ${f1(-380 - tg * 40)} ${f1(170 + tg * 60)} ${f1(-300 - tg * 60)}" stroke="${w}" stroke-width="46" stroke-linecap="round" fill="none"/>`);
  }
  function cawanPetri(x, y, s, t = 0, o = {}) {
    const ny = o.nyala || 0, n = o.n || 12, r = acak(4); let sel = "";
    for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = 30 + r() * 150, xx = Math.cos(a) * d * 1.3, yy = Math.sin(a) * d * 0.42, k = cl(ny * n - i);
      sel += `<circle cx="${f1(xx)}" cy="${f1(yy)}" r="${f1(46 * k)}" fill="#FF8A2A" opacity="${f2(0.3 * k)}"/><ellipse cx="${f1(xx)}" cy="${f1(yy)}" rx="22" ry="12" fill="${k > 0.5 ? "#FFD84A" : "#9FD8C8"}"/>`; }
    return g(x, y, s, `<ellipse cx="0" cy="20" rx="270" ry="40" fill="#000" opacity=".2"/><ellipse cx="0" cy="0" rx="260" ry="86" fill="#CFE6EE" opacity=".55"/><ellipse cx="0" cy="-6" rx="236" ry="72" fill="#E6F4F6" opacity=".55"/>${sel}<path d="M-200 -40 Q-100 -70 20 -66" stroke="#FFFFFF" stroke-width="8" fill="none" opacity=".6" stroke-linecap="round"/>`);
  }
  function medaliPolos(x, y, s, t = 0) {
    const kil = (Math.sin(t * 3) + 1) / 2;
    return g(x, y, s, `<path d="M-60 -260 L-20 -60 L20 -60 L60 -260 L20 -260 L0 -150 L-20 -260Z" fill="#2F5FD0"/><path d="M-20 -260 L0 -150 L20 -260" fill="#E2483E"/>
      <circle cx="0" cy="40" r="118" fill="#C9962E"/><circle cx="0" cy="40" r="100" fill="#F2C24A"/><circle cx="0" cy="40" r="74" fill="none" stroke="#C9962E" stroke-width="8"/>
      <path d="M-60 -10 Q-30 -40 10 -36" stroke="#FFF4C8" stroke-width="12" fill="none" stroke-linecap="round" opacity="${f2(0.5 + 0.5 * kil)}"/>`);
  }
  // ---------- kapal layar kayu generik (siluet; bukan jung — layar kain persegi & segitiga, tanpa rusuk bambu) ----------
  function kapalKayuSiluet(x, y, s, t = 0, o = {}) {
    const w = o.warna || "#2A1A20", bob = Math.sin(t * 1.4) * 6, rk = Math.sin(t * 1.1) * 1.5, ly = o.layar || "#3A2830";
    return g(x, y + bob, s, `<g transform="rotate(${f2(rk)})"><path d="M-300 -30 L300 -30 L240 50 L-230 50Z" fill="${w}"/><path d="M300 -30 L330 -60 L300 -60Z" fill="${w}"/><rect x="-310" y="-46" width="620" height="18" fill="${w}"/>
      <rect x="-96" y="-470" width="14" height="440" fill="${w}"/><rect x="104" y="-400" width="12" height="370" fill="${w}"/>
      <path d="M-200 -430 Q-90 -450 20 -430 Q40 -330 20 -230 Q-90 -210 -200 -230 Q-180 -330 -200 -430Z" fill="${ly}"/><path d="M-200 -210 Q-90 -230 20 -210 Q34 -140 20 -80 Q-90 -64 -200 -80 Q-186 -140 -200 -210Z" fill="${ly}"/>
      <path d="M110 -390 Q220 -230 280 -60 L110 -60Z" fill="${ly}"/><path d="M-89 -470 l0 -40 l52 16 l-52 16z" fill="#B3262E"/></g>`);
  }

  Object.assign(A, { cabaiRawit, cobekSambal, tetesKeringat, apiKartun, termometer, dalamMulut, papilaLidah, selPengecap, sarafNyeri, kanalTRPV1, molekulKapsaisin,
    sinyalSaraf, sirene, ruangKendali, gurunSemak, semakCabaiLiar, burungParuhLengkung, biji, siluetIlmuwan, cawanPetri, medaliPolos, kapalKayuSiluet });
})(typeof window !== "undefined" ? window : globalThis);
