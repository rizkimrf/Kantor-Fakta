/* PUSTAKA ASET SET — "Ternyata Begitu"
 * Gaya: datar (flat) tanpa garis hitam, bayangan lembut, kedalaman lewat lapisan & kabut.
 * Semua aset menerima palet waktu: PALET.siang | PALET.senja | PALET.malam
 * Prinsip nyaman di mata:
 *   - tidak ada hitam pekat / putih murni di latar; kontras latar rendah, kontras tertinggi hanya untuk teks & Tebe
 *   - malam memakai biru tua yang "diangkat" (bukan hitam), sumber cahaya hangat lembut
 *   - siang memakai warna sedikit diredam (saturasi sedang), tidak menyilaukan
 * Setiap fungsi mengembalikan potongan SVG (string) dalam koordinat dunia; susun di dalam <svg>.
 */
(function (root) {
  const PALET = {
    siang: { nama: "siang", langit: ["#8FC6D8", "#DCEFEA"], surya: "#FFF1C9", suryaHalo: "#FFF6DA", awan: "#F6F4EE", awanB: "#E2E6E4",
      jauh: "#A9C9C3", tengah: "#86B29D", dekat: "#6E9E7F", laut: "#5FA9B5", lautKilau: "#BFE3E3",
      tanah: "#D8C48C", tanahB: "#C2AC72", tanahG: "#A99159", rumput: "#9AA45C", daun: "#5E9A6A", daunB: "#4C8458", batang: "#8A6A4A",
      batu: "#9A9A90", batuB: "#7E7E76", dinding: "#E9DFCB", dindingB: "#D3C7AE", atap: "#B5654A", atapB: "#97503A", jendela: "#9FC9D2", jendelaNyala: 0,
      kabut: "#EEF5F0", kabutO: 0.35, bayang: "rgba(40,50,40,.16)", bintang: 0, cahaya: "#FFF6DA", teks: "#1E2A2A" },
    senja: { nama: "senja", langit: ["#4E6A86", "#F2C79A"], surya: "#FFE2A6", suryaHalo: "#F7C98A", awan: "#F3D6B8", awanB: "#D9AE8C",
      jauh: "#9C8C9A", tengah: "#7C7385", dekat: "#5E5C66", laut: "#C99A7E", lautKilau: "#FFE1B5",
      tanah: "#C9A46A", tanahB: "#AD8755", tanahG: "#8E6D43", rumput: "#9C7E46", daun: "#4E5A4C", daunB: "#3F4A3E", batang: "#5B4636",
      batu: "#7D7068", batuB: "#655A54", dinding: "#D9C2A4", dindingB: "#BBA286", atap: "#8E4E3E", atapB: "#743E31", jendela: "#F6C984", jendelaNyala: 0.5,
      kabut: "#F2C9A0", kabutO: 0.3, bayang: "rgba(50,30,20,.2)", bintang: 0.15, cahaya: "#FFD9A0", teks: "#F4EEE3" },
    malam: { nama: "malam", langit: ["#1F2E4A", "#3E5878"], surya: "#F2EAD0", suryaHalo: "#AFC0D8", awan: "#4A5E7C", awanB: "#3D4F6B",
      jauh: "#3B4D66", tengah: "#31435A", dekat: "#29394C", laut: "#2E4762", lautKilau: "#8FA9C6",
      tanah: "#4A5560", tanahB: "#3E4852", tanahG: "#343D46", rumput: "#46534F", daun: "#2E4A45", daunB: "#263E3A", batang: "#3A3530",
      batu: "#56606A", batuB: "#48515A", dinding: "#5C6676", dindingB: "#4C5564", atap: "#5A3F44", atapB: "#4A3439", jendela: "#FFD38A", jendelaNyala: 1,
      kabut: "#6D82A0", kabutO: 0.22, bayang: "rgba(10,15,30,.28)", bintang: 1, cahaya: "#FFD38A", teks: "#F2ECE1" },
  };
  let _id = 0; const uid = (p) => `${p}${++_id}`;
  const acakDari = (benih) => { let s = benih; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };

  // ---------- langit ----------
  function langit(P, w, h, t = 0, o = {}) {
    const g = uid("lg"), hl = uid("hl"), r = acakDari(o.benih || 11);
    const sx = o.suryaX ?? w * 0.72, sy = o.suryaY ?? h * 0.28, malam = P.nama === "malam";
    let bintang = "";
    if (P.bintang) for (let i = 0; i < 70; i++) { const x = r() * w, y = r() * h * 0.6, k = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.6 + r()) + i));
      bintang += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(0.8 + r() * 2).toFixed(1)}" fill="#F4EEDC" opacity="${(P.bintang * k * 0.8).toFixed(2)}"/>`; }
    const benda = malam
      ? `<circle cx="${sx}" cy="${sy}" r="58" fill="${P.surya}"/><circle cx="${sx + 22}" cy="${sy - 12}" r="50" fill="${P.langit[0]}" opacity=".0"/><circle cx="${sx - 16}" cy="${sy + 10}" r="9" fill="#DCD3B8"/><circle cx="${sx + 18}" cy="${sy - 14}" r="6" fill="#DCD3B8"/>`
      : `<circle cx="${sx}" cy="${sy}" r="64" fill="${P.surya}"/>`;
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.langit[0]}"/><stop offset="1" stop-color="${P.langit[1]}"/></linearGradient>
      <radialGradient id="${hl}"><stop offset="0" stop-color="${P.suryaHalo}" stop-opacity=".7"/><stop offset="1" stop-color="${P.suryaHalo}" stop-opacity="0"/></radialGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#${g})"/>${bintang}<circle cx="${sx}" cy="${sy}" r="${malam ? 220 : 300}" fill="url(#${hl})"/>${benda}`;
  }
  function awan(x, y, s, P, o = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><ellipse cx="0" cy="10" rx="120" ry="34" fill="${P.awanB}"/>
      <ellipse cx="-40" cy="-6" rx="62" ry="40" fill="${P.awan}"/><ellipse cx="30" cy="-22" rx="70" ry="52" fill="${P.awan}"/><ellipse cx="88" cy="0" rx="48" ry="32" fill="${P.awan}"/><rect x="-110" y="0" width="230" height="30" rx="15" fill="${P.awan}"/></g>`;
  }
  function burung(x, y, s, t, warna = "#4A5A5A") {
    const k = Math.sin(t * 9) * 6;
    return `<path transform="translate(${x} ${y}) scale(${s})" d="M-16 ${k} Q-8 -6 0 2 Q8 -6 16 ${k}" fill="none" stroke="${warna}" stroke-width="3.5" stroke-linecap="round"/>`;
  }
  // ---------- bentang alam ----------
  function bukit(w, yDasar, tinggi, benih, warna, bawah = 2400) {
    const r = acakDari(benih); let d = `M-200 ${yDasar}`; const n = 7, seg = (w + 400) / n;
    for (let i = 0; i < n; i++) { const x0 = -200 + i * seg; d += ` Q${(x0 + seg * 0.5).toFixed(0)} ${(yDasar - tinggi * (0.4 + r() * 0.8)).toFixed(0)} ${(x0 + seg).toFixed(0)} ${(yDasar - r() * tinggi * 0.25).toFixed(0)}`; }
    return `<path d="${d} V${bawah} H-200 Z" fill="${warna}"/>`;
  }
  function kabut(w, y, tinggi, P) {
    const g = uid("kb");
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.kabut}" stop-opacity="0"/><stop offset=".6" stop-color="${P.kabut}" stop-opacity="${P.kabutO}"/><stop offset="1" stop-color="${P.kabut}" stop-opacity="0"/></linearGradient></defs><rect x="-200" y="${y}" width="${w + 400}" height="${tinggi}" fill="url(#${g})"/>`;
  }
  function laut(w, y, tinggi, P, t = 0) {
    let kilau = ""; for (let i = 0; i < 9; i++) { const x = ((i * 173 + t * 22) % (w + 200)) - 100; kilau += `<rect x="${x.toFixed(0)}" y="${y + 10 + (i % 3) * 14}" width="${40 + (i % 4) * 18}" height="3" rx="1.5" fill="${P.lautKilau}" opacity=".55"/>`; }
    return `<rect x="-200" y="${y}" width="${w + 400}" height="${tinggi}" fill="${P.laut}"/>${kilau}`;
  }
  function tanah(w, y, P, bawah = 2400) {
    return `<path d="M-200 ${y + 20} Q${w * 0.3} ${y - 30} ${w * 0.6} ${y + 6} T${w + 200} ${y} V${bawah} H-200 Z" fill="${P.tanah}"/>
      <path d="M-200 ${y + 120} Q${w * 0.4} ${y + 80} ${w + 200} ${y + 130} V${bawah} H-200 Z" fill="${P.tanahB}" opacity=".55"/>`;
  }
  // ---------- tumbuhan & benda ----------
  function lontar(x, y, s, P, t = 0) {
    const g = Math.sin(t * 1.4 + x) * 2.5;
    let daun = ""; for (let i = 0; i < 13; i++) { const a = -Math.PI * (i / 12), c = i % 2 ? P.daun : P.daunB;
      daun += `<path d="M0 0 Q${(Math.cos(a) * 70).toFixed(0)} ${(Math.sin(a) * 60 - 22).toFixed(0)} ${(Math.cos(a) * 150).toFixed(0)} ${(Math.sin(a) * 118 + 14).toFixed(0)} Q${(Math.cos(a) * 70).toFixed(0)} ${(Math.sin(a) * 48).toFixed(0)} 0 8Z" fill="${c}"/>`; }
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="46" ry="9" fill="${P.bayang}"/><path d="M-10 0 Q-20 -200 -2 -380 L12 -380 Q-4 -200 10 0Z" fill="${P.batang}"/>
      <g transform="translate(5 -380) rotate(${g.toFixed(2)})">${daun}<circle r="16" fill="${P.batang}"/></g></g>`;
  }
  function pohon(x, y, s, P, t = 0) {
    const g = Math.sin(t * 1.2 + x * 0.01) * 1.6;
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="90" ry="14" fill="${P.bayang}"/><path d="M-14 0 L-8 -150 L-40 -210 M-8 -150 L30 -230 M-8 -120 L14 -260" stroke="${P.batang}" stroke-width="22" stroke-linecap="round" fill="none"/>
      <g transform="rotate(${g.toFixed(2)} 0 -150)"><circle cx="-60" cy="-250" r="80" fill="${P.daunB}"/><circle cx="50" cy="-270" r="92" fill="${P.daunB}"/><circle cx="-10" cy="-320" r="96" fill="${P.daun}"/><circle cx="-70" cy="-280" r="62" fill="${P.daun}"/><circle cx="60" cy="-300" r="66" fill="${P.daun}"/>
      <circle cx="-30" cy="-350" r="40" fill="#fff" opacity=".06"/></g></g>`;
  }
  function semak(x, y, s, P) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="2" rx="80" ry="10" fill="${P.bayang}"/><circle cx="-40" cy="-24" r="36" fill="${P.daunB}"/><circle cx="34" cy="-22" r="40" fill="${P.daunB}"/><circle cx="-4" cy="-44" r="44" fill="${P.daun}"/></g>`;
  }
  function rumput(x, y, s, P, t = 0) {
    const g = Math.sin(t * 2.2 + x * 0.05) * 4;
    return `<path transform="translate(${x} ${y}) scale(${s}) skewX(${g.toFixed(1)})" d="M0 0 q4 -40 10 -58 q2 30 6 50 q6 -36 16 -50 q-4 36 -2 58Z" fill="${P.rumput}"/>`;
  }
  function batu(x, y, s, P) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="2" rx="80" ry="10" fill="${P.bayang}"/><path d="M-70 0 Q-74 -50 -30 -70 Q20 -86 60 -46 Q80 -20 70 0Z" fill="${P.batu}"/><path d="M10 -78 Q60 -60 70 0 L30 0 Q40 -40 10 -78Z" fill="${P.batuB}"/></g>`;
  }
  function pagar(x0, x1, y, P) {
    let s = `<rect x="${x0}" y="${y - 60}" width="${x1 - x0}" height="10" fill="${P.batang}" opacity=".9"/><rect x="${x0}" y="${y - 30}" width="${x1 - x0}" height="10" fill="${P.batang}" opacity=".9"/>`;
    for (let x = x0; x <= x1; x += 70) s += `<rect x="${x}" y="${y - 80}" width="14" height="80" rx="4" fill="${P.batang}"/>`;
    return s;
  }
  function lampuTaman(x, y, s, P) {
    const nyala = P.jendelaNyala, g = uid("lp");
    return `<g transform="translate(${x} ${y}) scale(${s})"><defs><radialGradient id="${g}"><stop offset="0" stop-color="${P.cahaya}" stop-opacity=".55"/><stop offset="1" stop-color="${P.cahaya}" stop-opacity="0"/></radialGradient></defs>
      ${nyala ? `<circle cx="0" cy="-250" r="170" fill="url(#${g})" opacity="${nyala}"/><ellipse cx="0" cy="0" rx="120" ry="24" fill="${P.cahaya}" opacity="${0.12 * nyala}"/>` : ""}
      <rect x="-6" y="-240" width="12" height="240" fill="#3A3F45"/><path d="M-26 -250 h52 l-10 -36 h-32z" fill="#3A3F45"/><rect x="-18" y="-250" width="36" height="22" rx="4" fill="${nyala ? P.cahaya : "#C9CFC8"}"/></g>`;
  }
  // bangunan kebun binatang / rumah reptil (jendela besar, papan nama)
  function rumahReptil(x, y, s, P, papan = "RUMAH REPTIL") {
    const n = P.jendelaNyala, g = uid("rr");
    return `<g transform="translate(${x} ${y}) scale(${s})"><defs><radialGradient id="${g}"><stop offset="0" stop-color="${P.cahaya}" stop-opacity=".5"/><stop offset="1" stop-color="${P.cahaya}" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="0" cy="6" rx="420" ry="24" fill="${P.bayang}"/>${n ? `<ellipse cx="0" cy="-160" rx="420" ry="260" fill="url(#${g})" opacity="${n}"/>` : ""}
      <rect x="-360" y="-360" width="720" height="360" fill="${P.dinding}"/><rect x="180" y="-360" width="180" height="360" fill="${P.dindingB}"/>
      <path d="M-400 -350 L0 -500 L400 -350Z" fill="${P.atap}"/><path d="M0 -500 L400 -350 L300 -350 Z" fill="${P.atapB}"/>
      <rect x="-300" y="-280" width="320" height="200" rx="10" fill="${P.jendela}"/><path d="M-300 -280 h320 v200 h-320z M-140 -280 v200" fill="none" stroke="${P.dindingB}" stroke-width="12"/>
      ${n ? `<rect x="-300" y="-280" width="320" height="200" rx="10" fill="${P.cahaya}" opacity="${0.35 * n}"/>` : `<path d="M-280 -270 l60 0 l-120 180 l-40 0z" fill="#fff" opacity=".25"/>`}
      <rect x="90" y="-230" width="140" height="230" rx="8" fill="${P.atapB}"/><circle cx="210" cy="-110" r="6" fill="${P.dinding}"/>
      <rect x="-170" y="-410" width="340" height="62" rx="10" fill="${P.atapB}"/><text x="0" y="-367" text-anchor="middle" font-family="Inter" font-weight="800" font-size="34" letter-spacing="5" fill="${P.dinding}">${papan}</text></g>`;
  }
  function kunangKunang(w, h, t, P, n = 18, benih = 5) {
    if (!P.bintang) return ""; const r = acakDari(benih); let s = "";
    for (let i = 0; i < n; i++) { const x = r() * w + Math.sin(t * 0.7 + i) * 30, y = h * 0.45 + r() * h * 0.5 + Math.cos(t * 0.9 + i * 2) * 20, k = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.7);
      s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="10" fill="${P.cahaya}" opacity="${(0.12 * k).toFixed(2)}"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="3" fill="${P.cahaya}" opacity="${(0.8 * k).toFixed(2)}"/>`; }
    return s;
  }
  function debuCahaya(w, h, t, n = 24, benih = 9, warna = "#FFF6DA") {
    const r = acakDari(benih); let s = "";
    for (let i = 0; i < n; i++) { const x = (r() * w + t * 12 * (0.5 + r())) % w, y = (r() * h - t * 8 * (0.3 + r()) + h) % h; s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1.5 + r() * 2.5).toFixed(1)}" fill="${warna}" opacity="${(0.15 + r() * 0.25).toFixed(2)}"/>`; }
    return s;
  }
  // ---------- hewan & benda cerita ----------
  function komodo(P, o = {}) {
    const l = o.langkah || 0, a = Math.sin(l) * 18, bob = Math.abs(Math.sin(l)) * -4;
    const m = P.nama === "malam" ? ["#56606A", "#454E57", "#6D7781", "#39414A"] : P.nama === "senja" ? ["#6F6B56", "#57543F", "#8A8670", "#474532"] : ["#7D7B62", "#66644E", "#99967D", "#52503D"];
    const kaki = (x, y, r, w) => `<g transform="rotate(${r.toFixed(1)} ${x} ${y})"><path d="M${x} ${y} q-6 34 -26 56" fill="none" stroke="${w}" stroke-width="30" stroke-linecap="round"/><path d="M${x - 26} ${y + 56} l-22 6 M${x - 26} ${y + 56} l-14 14 M${x - 26} ${y + 56} l2 16" stroke="${w}" stroke-width="7" stroke-linecap="round"/></g>`;
    const lid = o.lidah || 0, ek = (o.ekor || 0) * 14;
    return `<svg viewBox="0 60 900 270" width="100%" style="overflow:visible"><ellipse cx="430" cy="290" rx="380" ry="18" fill="${P.bayang}"/>
      ${kaki(640, 206, -a, m[3])}${kaki(380, 214, a, m[3])}<g transform="translate(0 ${bob.toFixed(1)})">
      <path d="M20 ${232 + ek} C120 ${214 + ek * .6} 220 176 320 168 C420 150 560 140 650 148 C700 130 760 134 800 150 L846 168 C850 176 842 184 830 186 L760 196 C720 206 680 214 640 214 C560 236 420 246 320 228 C220 230 120 ${236 + ek * .6} 20 ${232 + ek} Z" fill="${m[0]}"/>
      <path d="M20 ${232 + ek} C220 226 420 248 560 232 C640 222 700 212 760 196 L830 186 C800 196 760 204 720 210 C640 232 420 254 320 236 C200 238 100 238 20 ${232 + ek}Z" fill="${m[1]}"/>
      <path d="M200 192 C320 166 480 150 640 152 C700 140 740 140 780 150" fill="none" stroke="${m[2]}" stroke-width="10" stroke-linecap="round" opacity=".7"/>
      ${[[300, 196], [360, 186], [430, 180], [500, 176], [560, 174], [250, 204], [460, 200]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="${m[1]}" opacity=".6"/>`).join("")}
      <path d="M770 182 L840 176" stroke="${m[3]}" stroke-width="4" stroke-linecap="round"/>
      ${o.tidur ? `<path d="M772 158 q8 4 16 0" stroke="#1A1410" stroke-width="4" fill="none" stroke-linecap="round"/>` : `<circle cx="780" cy="158" r="6" fill="#1A1410"/><circle cx="782" cy="156" r="1.8" fill="#fff"/>`}
      <circle cx="836" cy="166" r="2.5" fill="#2A281C"/>
      ${lid > 0 ? `<path d="M846 176 l${44 * lid} 4 l12 -8 M${846 + 44 * lid} 180 l12 8" fill="none" stroke="#E2C259" stroke-width="5" stroke-linecap="round"/>` : ""}
      </g>${kaki(600, 214, a * 0.8, m[0])}${kaki(340, 222, -a * 0.8, m[0])}</svg>`;
  }
  function telur(x, y, s, retak = 0) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="56" rx="40" ry="8" fill="rgba(0,0,0,.18)"/><ellipse rx="46" ry="58" fill="#EDE5D3"/><ellipse cx="14" cy="10" rx="30" ry="44" fill="#D3C7AC" opacity=".55"/><ellipse cx="-16" cy="-24" rx="10" ry="16" fill="#fff" opacity=".5"/>
      ${retak ? `<path d="M-42 -6 l16 12 l12 -16 l14 14 l14 -12 l14 8" fill="none" stroke="#6E6450" stroke-width="5" stroke-linejoin="round" opacity="${retak}"/>` : ""}</g>`;
  }
  function kromosom(x, y, huruf, warna, s = 1, o = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><rect x="-44" y="-110" width="88" height="220" rx="44" fill="${warna}"/><rect x="-44" y="-12" width="88" height="24" fill="#000" opacity=".12"/>
      <text x="0" y="28" text-anchor="middle" font-family="Inter Display" font-weight="900" font-size="78" fill="#1E2A2A">${huruf}</text></g>`;
  }
  // ---------- set studio penjelasan (luas, lembut) ----------
  function studio(w, h, P, t = 0) {
    const g = uid("st"), l = uid("sl");
    const bawah = P.nama === "malam" ? ["#24384A", "#1A2A38"] : ["#E7EFEA", "#CFDDD6"];
    return `<defs><radialGradient id="${g}" cx=".5" cy=".38" r=".8"><stop offset="0" stop-color="${bawah[0]}"/><stop offset="1" stop-color="${bawah[1]}"/></radialGradient>
      <radialGradient id="${l}"><stop offset="0" stop-color="${P.cahaya}" stop-opacity=".18"/><stop offset="1" stop-color="${P.cahaya}" stop-opacity="0"/></radialGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#${g})"/><ellipse cx="${w / 2}" cy="${h * 0.45}" rx="${w * 0.6}" ry="${h * 0.3}" fill="url(#${l})"/>
      <ellipse cx="${w / 2}" cy="${h * 0.8}" rx="${w * 0.7}" ry="90" fill="#000" opacity=".12"/>`;
  }

  const api = { PALET, langit, awan, burung, bukit, kabut, laut, tanah, lontar, pohon, semak, rumput, batu, pagar, lampuTaman, rumahReptil, kunangKunang, debuCahaya, komodo, telur, kromosom, studio };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ASET = api;
})(typeof window !== "undefined" ? window : globalThis);
