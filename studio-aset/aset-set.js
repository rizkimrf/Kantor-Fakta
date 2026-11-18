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


  // =====================================================================
  // TAMBAHAN 15 Nov 2026 (Yoga) — set HUJAN / TANAH / MIKRO / KAMPUNG (video I-007 bau hujan)
  // Semua warna dari palet. Benda berwarna "asli" (makanan, kulit) diredupkan lewat filter P.redup.
  // =====================================================================
  Object.assign(PALET.siang, { mendung: ["#93A6AE", "#D3DCD8"], awanH: "#C6CECE", awanHB: "#9FACAF", hujan: "#F2F7F8",
    air: "#86B7C0", airKilau: "#E3F2F2", airKolam: "#7E9E7A", tanahBasah: "#8C7352", tanahRetak: "#8A7046",
    bakteri: "#8FCDB6", bakteriB: "#62A892", spora: "#F3E2A6", springtail: "#7488B5", springtailB: "#56699A",
    lele: "#6B665A", leleB: "#C8BFA6", jalan: "#A3A39B", jalanB: "#8C8C84", aroma: "#F4DF8E", redup: [1, 1, 1] });
  Object.assign(PALET.senja, { mendung: ["#525873", "#D4A58A"], awanH: "#938698", awanHB: "#71667A", hujan: "#FBE3CF",
    air: "#C9A08A", airKilau: "#FFE0BC", airKolam: "#9C8F6C", tanahBasah: "#77583D", tanahRetak: "#775837",
    bakteri: "#A9C8A0", bakteriB: "#84A57C", spora: "#F7D9A0", springtail: "#72729A", springtailB: "#57577A",
    lele: "#5E584A", leleB: "#C2A98A", jalan: "#857876", jalanB: "#6E6362", aroma: "#FFE2A0", redup: [0.96, 0.86, 0.78] });
  Object.assign(PALET.malam, { mendung: ["#1B2740", "#33445E"], awanH: "#3F4D67", awanHB: "#313E56", hujan: "#B4C8DF",
    air: "#3D5875", airKilau: "#A9C0DA", airKolam: "#3B5257", tanahBasah: "#363C46", tanahRetak: "#2A3139",
    bakteri: "#86BAB0", bakteriB: "#5E918A", spora: "#EAD9A2", springtail: "#93A7CC", springtailB: "#7084AA",
    lele: "#4F5863", leleB: "#8E99A6", jalan: "#3F4753", jalanB: "#353C47", aroma: "#FFE2A0", redup: [0.64, 0.7, 0.86] });

  const f0 = (v) => (+v).toFixed(0), f1 = (v) => (+v).toFixed(1), f2 = (v) => (+v).toFixed(2);
  const kl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const MATA = "#1E2A2A";
  // filter peredup untuk benda berwarna asli (makanan, kulit) supaya ikut suasana senja/malam
  function redup(P) {
    const id = uid("rd"), [r, g, b] = P.redup || [1, 1, 1];
    return { id, defs: `<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${r} 0 0 0 0 0 ${g} 0 0 0 0 0 ${b} 0 0 0 0 0 1 0"/></filter>` };
  }

  // ---------- langit mendung & awan hujan ----------
  function langitMendung(P, w, h, t = 0, o = {}) {
    const g = uid("lm"), hl = uid("lmh"), r = acakDari(o.benih || 21);
    const sx = o.suryaX ?? w * 0.7, sy = o.suryaY ?? h * 0.42, kuat = P.nama === "siang" ? 0.22 : P.nama === "senja" ? 0.6 : 0.2;
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.mendung[0]}"/><stop offset="1" stop-color="${P.mendung[1]}"/></linearGradient>
      <radialGradient id="${hl}"><stop offset="0" stop-color="${P.suryaHalo}" stop-opacity="${kuat}"/><stop offset="1" stop-color="${P.suryaHalo}" stop-opacity="0"/></radialGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#${g})"/><ellipse cx="${f0(sx)}" cy="${f0(sy)}" rx="${f0(w * 0.5)}" ry="${f0(h * 0.24)}" fill="url(#${hl})"/>`;
    const lapis = [[h * 0.3, P.awanH, 0.5, 5], [h * 0.2, P.awanH, 0.85, 9], [h * 0.11, P.awanHB, 1, 14]], span = w + 800;
    for (const [yb, c, op, v] of lapis) {
      let e = `<rect x="-300" y="-60" width="${w + 600}" height="${f0(yb + 60)}" fill="${c}"/>`;
      for (let i = 0; i < Math.ceil(span / 150); i++) {
        const x0 = i * 150 + r() * 60, rx = 90 + r() * 90, ry = 36 + r() * 46;
        const x = ((x0 + t * v) % span) - 400;
        e += `<ellipse cx="${f0(x)}" cy="${f0(yb)}" rx="${f0(rx)}" ry="${f0(ry)}" fill="${c}"/>`;
      }
      s += `<g opacity="${op}">${e}</g>`;
    }
    return s;
  }
  function awanHujan(x, y, s, P, t = 0, o = 1) {
    const d = Math.sin(t * 0.4 + x * 0.01) * 10;
    return `<g transform="translate(${f1(x + d)} ${y}) scale(${s})" opacity="${o}">
      <rect x="-270" y="-40" width="540" height="84" rx="42" fill="${P.awanHB}"/>
      <ellipse cx="-190" cy="-14" rx="80" ry="50" fill="${P.awanH}"/><ellipse cx="-90" cy="-50" rx="110" ry="80" fill="${P.awanH}"/>
      <ellipse cx="40" cy="-86" rx="130" ry="105" fill="${P.awanH}"/><ellipse cx="165" cy="-38" rx="100" ry="70" fill="${P.awanH}"/>
      <rect x="-250" y="-30" width="500" height="34" rx="17" fill="${P.awanH}"/><ellipse cx="10" cy="-150" rx="70" ry="30" fill="#fff" opacity=".07"/></g>`;
  }
  // garis hujan bergerak. o: {deras 0..1, sudut derajat, y0, y1 (tanah), benih}
  function hujan(w, h, t, P, o = {}) {
    const deras = o.deras ?? 0.7, tn = Math.tan(((o.sudut ?? 8) * Math.PI) / 180), r = acakDari(o.benih || 31);
    const y0 = o.y0 ?? 0, y1 = o.y1 ?? h, span = y1 - y0, n = Math.round(((30 + deras * 150) * w) / 1080);
    let s = "";
    for (let i = 0; i < n; i++) {
      const jauh = r() < 0.45, len = (jauh ? 0.55 : 1) * (22 + deras * 70) * (0.7 + r() * 0.6);
      const v = (jauh ? 0.7 : 1) * (1100 + deras * 1100) * (0.85 + r() * 0.3), x0 = r() * (w + 300) - 150 - span * tn * 0.5, ph = r(), op = 0.7 + r() * 0.3;
      const yy = ((ph * span + t * v) % span) + y0 - len * 0.5, x = x0 + (yy - y0) * tn;
      s += `<line x1="${f0(x)}" y1="${f0(yy)}" x2="${f0(x + len * tn)}" y2="${f0(yy + len)}" stroke="${P.hujan}" stroke-width="${f1((jauh ? 1.4 : 2.4) + deras * 1.2)}" stroke-linecap="round" opacity="${f2((jauh ? 0.28 : 0.55) * op)}"/>`;
    }
    return `<g>${s}</g>`;
  }
  const gerimis = (w, h, t, P, o = {}) => hujan(w, h, t, P, Object.assign({ deras: 0.18, benih: 37 }, o));
  // cincin riak di genangan
  function riakHujan(x0, x1, y0, y1, t, P, n = 14, benih = 41) {
    const r = acakDari(benih); let s = "";
    for (let i = 0; i < n; i++) {
      const per = 0.8 + r() * 0.7, ph = r() * per, siklus = Math.floor((t + ph) / per), k = ((t + ph) % per) / per;
      const rr = acakDari(benih * 31 + i * 7 + siklus * 13);
      const x = x0 + rr() * (x1 - x0), y = y0 + rr() * (y1 - y0), sk = 0.5 + ((y - y0) / Math.max(1, y1 - y0)) * 0.7, R = (6 + k * 46) * sk;
      s += `<ellipse cx="${f0(x)}" cy="${f0(y)}" rx="${f1(R)}" ry="${f1(R * 0.28)}" fill="none" stroke="${P.airKilau}" stroke-width="${f1(3 * sk)}" opacity="${f2((1 - k) * 0.7)}"/>`;
      if (k < 0.25) s += `<circle cx="${f0(x)}" cy="${f1(y - 4 * sk - k * 30 * sk)}" r="${f1(3 * sk)}" fill="${P.airKilau}" opacity="${f2(1 - k * 4)}"/>`;
    }
    return s;
  }
  // tetes jatuh dari tepi genteng/talang
  function tetesAtap(x0, x1, y, t, P, o = {}) {
    const r = acakDari(o.benih || 47), n = o.n || 6, jatuh = o.jatuh || 260; let s = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + ((i + 0.5 + (r() - 0.5) * 0.6) * (x1 - x0)) / n, per = 1.1 + r() * 0.9, ph = r() * per, u = (t + ph) % per;
      const tumbuh = kl(u / 0.45), tj = u - 0.45, yy = tj > 0 ? y + 900 * tj * tj : y;
      if (tj <= 0) s += `<ellipse cx="${f0(x)}" cy="${f1(y + 4 + tumbuh * 5)}" rx="${f1(3 + tumbuh * 3)}" ry="${f1(3 + tumbuh * 5)}" fill="${P.airKilau}" opacity=".85"/>`;
      else if (yy < y + jatuh) s += `<ellipse cx="${f0(x)}" cy="${f1(yy)}" rx="5" ry="9" fill="${P.airKilau}" opacity=".85"/>`;
      else { const k = kl((yy - y - jatuh) / 260); if (k < 1) s += `<ellipse cx="${f0(x)}" cy="${y + jatuh}" rx="${f1(6 + k * 26)}" ry="${f1(2 + k * 6)}" fill="none" stroke="${P.airKilau}" stroke-width="2.5" opacity="${f2(0.8 * (1 - k))}"/>`; }
    }
    return s;
  }

  // ---------- tanah kering (kemarau) & tanah basah ----------
  function tanahKering(w, y, P, o = {}) {
    const r = acakDari(o.benih || 61), bawah = o.bawah ?? 1920, cx = o.pusat ?? w / 2;
    let s = `<rect x="-200" y="${f0(y)}" width="${w + 400}" height="${f0(bawah - y + 600)}" fill="${P.tanahRetak}"/>`;
    const baris = []; let yy = y, hb = o.awal || 20;
    while (yy < bawah + hb) { baris.push([yy, hb]); yy += hb; hb *= 1.3; }
    baris.push([yy, hb]);
    const K = 40, titik = baris.map(([by, bh], i) => { const sp = bh * 3.1; return Array.from({ length: K + 1 }, (_, k) => [cx + (k - K / 2) * sp + (i && i < baris.length - 1 ? (r() - 0.5) * sp * 0.55 : 0), by + (i ? (r() - 0.5) * bh * 0.45 : 0)]); });
    for (let i = 0; i < baris.length - 1; i++) for (let k = 0; k < K; k++) {
      const q = [titik[i][k], titik[i][k + 1], titik[i + 1][k + 1], titik[i + 1][k]];
      if (q[1][0] < -250 || q[0][0] > w + 250) { r(); r(); continue; }
      const mx = q.reduce((a, v) => a + v[0], 0) / 4, my = q.reduce((a, v) => a + v[1], 0) / 4, gap = 0.1 + r() * 0.05, tone = r();
      const ciut = (pt) => [pt[0] + (mx - pt[0]) * gap, pt[1] + (my - pt[1]) * gap * 1.4];
      const fill = tone < 0.6 ? P.tanah : tone < 0.92 ? P.tanahB : P.tanahG, bh = baris[i][1];
      const d = (dy) => "M" + q.map(ciut).map((v) => `${f0(v[0])} ${f0(v[1] + dy)}`).join(" L") + "Z";
      s += `<path d="${d(bh * 0.1)}" fill="${P.tanahG}" opacity=".55"/><path d="${d(0)}" fill="${fill}"/>`;
    }
    return s;
  }
  // bercak basah yang muncul satu per satu saat tetes pertama jatuh (k: 0 kering → 1 basah)
  function bercakBasah(x0, x1, y0, y1, P, k = 1, benih = 51, n = 90) {
    const r = acakDari(benih); let s = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), muncul = r() * 0.95, sk = 0.4 + ((y - y0) / Math.max(1, y1 - y0)) * 0.9, R = (10 + r() * 22) * sk;
      if (muncul > k) continue; const g = Math.min(1, (k - muncul) * 6);
      s += `<ellipse cx="${f0(x)}" cy="${f0(y)}" rx="${f1(R * (0.6 + g * 0.4))}" ry="${f1(R * 0.38 * (0.6 + g * 0.4))}" fill="${P.tanahBasah}" opacity="${f2(0.8 * g)}"/>`;
    }
    return s;
  }
  // pantulan lampu di permukaan air: tumpukan garis mendatar yang mengecil ke bawah
  function pantulanCahaya(x, y, tinggi, P, t = 0, lebar = 40) {
    if (!P.jendelaNyala) return ""; let s = "";
    for (let i = 0; i < 6; i++) { const lw = lebar * (1 - i * 0.13) * (0.8 + 0.2 * Math.sin(t * 3 + i)), yy = y + (i * tinggi) / 6;
      s += `<rect x="${f1(x - lw / 2)}" y="${f1(yy)}" width="${f1(lw)}" height="${f1(Math.max(2, tinggi / 14))}" rx="2" fill="${P.cahaya}" opacity="${f2(0.5 * P.jendelaNyala * (1 - i * 0.14))}"/>`; }
    return s;
  }
  function tanahBasah(w, y, P, t = 0, o = {}) {
    const r = acakDari(o.benih || 71), bawah = o.bawah ?? 1920, tg = Math.max(200, bawah - y);
    let s = `<path d="M-200 ${y + 14} Q${f0(w * 0.35)} ${y - 22} ${f0(w * 0.65)} ${y + 8} T${w + 200} ${y} V${bawah + 600} H-200Z" fill="${P.tanahBasah}"/>
      <path d="M-200 ${y + 170} Q${f0(w * 0.4)} ${y + 130} ${w + 200} ${y + 180} V${bawah + 600} H-200Z" fill="${P.tanahRetak}" opacity=".35"/>`;
    for (let i = 0; i < 30; i++) { const x = r() * w, yy = y + 30 + r() * tg, sk = 0.4 + (yy - y) / tg, rx = (6 + r() * 10) * sk;
      s += `<ellipse cx="${f0(x)}" cy="${f0(yy)}" rx="${f1(rx)}" ry="${f1(rx * 0.55)}" fill="${P.tanahG}" opacity=".55"/><ellipse cx="${f0(x - rx * 0.2)}" cy="${f0(yy - rx * 0.2)}" rx="${f1(rx * 0.4)}" ry="${f1(rx * 0.2)}" fill="${P.airKilau}" opacity=".25"/>`; }
    const gen = o.genangan ?? 4;
    for (let i = 0; i < gen; i++) {
      const x = ((i + 0.3 + r() * 0.4) * w) / gen, yy = y + 90 + r() * (tg - 220), sk = 0.5 + (yy - y) / tg, rx = (90 + r() * 110) * sk, ry = rx * 0.22;
      s += `<ellipse cx="${f0(x)}" cy="${f0(yy)}" rx="${f0(rx)}" ry="${f0(ry)}" fill="${P.air}"/><ellipse cx="${f0(x - rx * 0.2)}" cy="${f0(yy - ry * 0.25)}" rx="${f0(rx * 0.55)}" ry="${f0(ry * 0.35)}" fill="${P.airKilau}" opacity=".35"/>`;
      s += pantulanCahaya(x + rx * 0.25, yy - ry * 0.55, ry * 1.1, P, t, rx * 0.22);
      if (o.hujan) s += riakHujan(x - rx * 0.75, x + rx * 0.75, yy - ry * 0.5, yy + ry * 0.5, t, P, 3, 200 + i);
    }
    return s;
  }

  // ---------- tetes hujan, gelembung, aerosol (momen "wah") ----------
  function tetes(x, y, s, P, o = {}) {
    const rg = o.regang ?? 0;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s * (1 - rg * 0.15))} ${f2(s * (1 + rg * 0.35))})">
      <path d="M0 -74 C14 -48 46 -16 46 14 A46 46 0 0 1 -46 14 C-46 -16 -14 -48 0 -74Z" fill="${P.airKilau}" opacity=".95"/>
      <path d="M46 14 A46 46 0 0 1 -30 48 Q22 46 34 -10 Q44 2 46 14Z" fill="${P.air}" opacity=".55"/>
      <ellipse cx="-18" cy="-2" rx="9" ry="16" transform="rotate(20 -18 -2)" fill="#fff" opacity=".75"/></g>`;
  }
  function gelembung(x, y, R, P, o = {}) {
    const pc = o.pecah || 0;
    if (pc <= 0) return `<g><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R)}" fill="${P.airKilau}" opacity=".22"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R * 0.92)}" fill="none" stroke="${P.airKilau}" stroke-width="${f1(Math.max(1.5, R * 0.13))}" opacity=".85"/>
      <path d="M${f1(x - R * 0.55)} ${f1(y - R * 0.15)} A${f1(R * 0.6)} ${f1(R * 0.6)} 0 0 1 ${f1(x - R * 0.1)} ${f1(y - R * 0.58)}" fill="none" stroke="#fff" stroke-width="${f1(Math.max(1.2, R * 0.14))}" stroke-linecap="round" opacity=".8"/></g>`;
    if (pc >= 1) return "";
    const n = o.n || 9; let s = `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R * (1 + pc * 0.6))}" fill="none" stroke="${P.airKilau}" stroke-width="${f1(R * 0.08)}" opacity="${f2((1 - pc) * 0.6)}" stroke-dasharray="${f1(R * 0.5)} ${f1(R * 0.4)}"/>`;
    for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i / (n - 1) - 0.5) * Math.PI * 1.5, d = R * (1 + pc * 2.6), rr = Math.max(1.2, R * 0.16 * (1 - pc * 0.6));
      s += `<circle cx="${f1(x + Math.cos(a) * d)}" cy="${f1(y + Math.sin(a) * d - pc * R * 0.8)}" r="${f1(rr)}" fill="${P.airKilau}" opacity="${f2(1 - pc)}"/>`; }
    return s;
  }
  // kabut butir halus yang naik (k: umur 0..1). o: {lebar, tinggi, aroma (porsi butir berwarna aroma), t, benih, n}
  function aerosol(x, y, P, k, o = {}) {
    if (k <= 0) return "";
    const r = acakDari(o.benih || 81), n = o.n || 46, L = o.lebar || 220, H = o.tinggi || 520, ar = o.aroma ?? 0.3, t = o.t || 0, g = uid("ae");
    const e = 1 - Math.pow(1 - kl(k), 2);
    let s = `<defs><radialGradient id="${g}"><stop offset="0" stop-color="${P.airKilau}" stop-opacity=".4"/><stop offset="1" stop-color="${P.airKilau}" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="${f0(x)}" cy="${f0(y - H * e * 0.45)}" rx="${f0(L * (0.4 + e * 0.8))}" ry="${f0(H * (0.15 + e * 0.35))}" fill="url(#${g})" opacity="${f2(kl(k * 3) * (1 - kl((k - 0.75) * 2.5)))}"/>`;
    for (let i = 0; i < n; i++) {
      const sx = (r() - 0.5) * L * 1.6, v = 0.5 + r() * 0.8, ph = r() * 0.25, rad = 2 + r() * 4, aroma = r() < ar;
      const kk = kl((k - ph) / (1 - ph)); if (kk <= 0) continue;
      const ee = 1 - Math.pow(1 - kk, 2), px = x + sx * ee + Math.sin(t * 1.3 + i) * 10 * kk, py = y - H * v * ee;
      s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(rad)}" fill="${aroma ? P.aroma : P.airKilau}" opacity="${f2((1 - kk * 0.8) * (aroma ? 0.95 : 0.75))}"/>`;
    }
    return s;
  }
  // rangkaian slow-motion lengkap (fase 0..1): jatuh → menghantam → gelembung naik → pecah jadi kabut. Tanah di y lokal 0.
  function tetesSlowmo(x, y, s, P, fase, o = {}) {
    const R = 90, t = o.t || 0, lin = (a, b) => kl((fase - a) / (b - a)), eIn = (v) => v * v, eOut = (v) => 1 - (1 - v) * (1 - v);
    let g = "";
    if (o.tanah !== false) {
      const r = acakDari(91);
      g += `<rect x="-560" y="0" width="1120" height="560" fill="${P.tanahB}"/>`;
      for (let i = 0; i < 70; i++) { const px = -540 + r() * 1080, py = 30 + r() * 520, pr = 8 + r() * 22, pori = r() < 0.45;
        g += `<ellipse cx="${f0(px)}" cy="${f0(py)}" rx="${f0(pr)}" ry="${f0(pr * 0.72)}" fill="${pori ? P.tanahRetak : P.tanah}" opacity="${pori ? 0.85 : 0.7}"/>`; }
      g += `<rect x="-560" y="0" width="1120" height="14" fill="${P.tanahBasah}"/>`;
    }
    const a = lin(0, 0.3);
    if (fase < 0.31) g += tetes(0, -900 + eIn(a) * (900 - R * 0.95), 1.9, P, { regang: 0.5 * (1 - lin(0.27, 0.31)) });
    const b = lin(0.3, 0.4), c = lin(0.86, 1);
    if (fase >= 0.3) {
      const rx = R * (0.95 + eOut(b) * 1.25) * (1 + c * 0.3), ry = R * (1.2 - eOut(b) * 0.32) * (1 - c * 0.8);
      g += `<path d="M${f1(-rx)} 0 A${f1(rx)} ${f1(ry)} 0 0 1 ${f1(rx)} 0Z" fill="${P.airKilau}" opacity="${f2(0.55 * (1 - c * 0.6))}"/>
        <path d="M${f1(-rx)} 0 A${f1(rx)} ${f1(ry)} 0 0 1 ${f1(rx)} 0 Q0 ${f1(-ry * 0.35)} ${f1(-rx)} 0Z" fill="${P.air}" opacity="${f2(0.35 * (1 - c))}"/>
        <path d="M${f1(-rx * 0.6)} ${f1(-ry * 0.55)} A${f1(rx * 0.7)} ${f1(ry * 0.7)} 0 0 1 ${f1(-rx * 0.1)} ${f1(-ry * 0.88)}" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="${f2(0.7 * (1 - c))}"/>`;
      if (b > 0 && b < 1) for (let i = 0; i < 10; i++) { const sisi = i % 2 ? 1 : -1, j = (i >> 1) / 5, dx = sisi * R * (1 + j) * (0.6 + b * 2.2), dy = -R * (1.4 - j * 0.6) * Math.sin(Math.PI * b);
        g += `<circle cx="${f1(dx)}" cy="${f1(dy)}" r="${f1(7 - j * 4)}" fill="${P.airKilau}" opacity="${f2(1 - b * 0.7)}"/>`; }
      const atas = (px) => ry * Math.sqrt(Math.max(0, 1 - (px / rx) * (px / rx)));
      for (let i = 0; i < 6; i++) {
        const ts = 0.4 + i * 0.045, u = lin(ts, ts + 0.22), pc = lin(ts + 0.22, ts + 0.3), px = (i - 2.5) * R * 0.36, br = 12 + (i % 3) * 6 + u * 8;
        if (u <= 0) continue;
        const top = atas(px) - br - 4;
        g += gelembung(px + Math.sin(u * 7 + i) * 4, -6 - eIn(u) * Math.max(0, top - 6), br, P, { pecah: pc });
        g += aerosol(px, -atas(px) - 6, P, lin(ts + 0.24, 1), { lebar: 60, tinggi: 420, n: 12, benih: 300 + i, t, aroma: o.aroma ?? 0.35 });
      }
      g += aerosol(0, -ry, P, lin(0.62, 1.05), { lebar: R * 2.6, tinggi: R * 8, n: 40, benih: 88, t, aroma: o.aroma ?? 0.35 });
    }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
  }
  // gelas soda (pembanding: gelembung naik lalu pecah memercik)
  function gelasSoda(x, y, s, P, t = 0) {
    const r = acakDari(121); let b = "";
    for (let i = 0; i < 16; i++) { const bx = -70 + r() * 140, per = 1.2 + r() * 1.2, ph = r() * per, u = ((t + ph) % per) / per, rr = 4 + r() * 6;
      b += u < 0.9 ? gelembung(bx + Math.sin(u * 9 + i) * 4, 150 - u * 250, rr * (0.6 + u * 0.5), P) : gelembung(bx, -105, rr, P, { pecah: (u - 0.9) * 10, n: 6 }); }
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="190" rx="120" ry="16" fill="${P.bayang}"/>
      <path d="M-100 -150 L100 -150 L82 180 Q0 196 -82 180Z" fill="${P.airKilau}" opacity=".28"/>
      <path d="M-96 -96 L96 -96 L82 176 Q0 190 -82 176Z" fill="${P.air}" opacity=".75"/><ellipse cx="0" cy="-96" rx="96" ry="12" fill="${P.airKilau}" opacity=".7"/>
      <g>${b}</g><path d="M-80 -140 L-66 160" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".35"/></g>`;
  }

  // ---------- dunia mikro: bakteri Streptomyces, spora, springtail, penampang tanah ----------
  function streptomyces(x, y, s, P, t = 0, o = {}) {
    const r = acakDari(o.benih || 101), sp = o.spora ?? 1, tb = o.tumbuh ?? 1;
    let benang = "", manik = "";
    const cabang = (x0, y0, a, L, w, d, id) => {
      const bend = (r() - 0.5) * 0.9, jml = d < 3 ? (r() < 0.25 ? 1 : 2) : 0, sudut = [r(), r()];
      const aa = a + Math.sin(t * 1.6 + id * 1.7) * 0.05 * (d + 1), L2 = L * tb;
      const x1 = x0 + Math.cos(aa) * L2, y1 = y0 + Math.sin(aa) * L2, mx = x0 + Math.cos(aa + bend) * L2 * 0.55, my = y0 + Math.sin(aa + bend) * L2 * 0.55;
      benang += `<path d="M${f1(x0)} ${f1(y0)} Q${f1(mx)} ${f1(my)} ${f1(x1)} ${f1(y1)}" fill="none" stroke="${d % 2 ? P.bakteriB : P.bakteri}" stroke-width="${f1(w)}" stroke-linecap="round"/>`;
      if (jml === 0) {
        for (let k = 0; k < 6; k++) { if (k >= sp * 6) break;
          const q = (k + 1) * w * 1.3, px = x1 + Math.cos(aa) * q + Math.sin(k * 1.3 + t * 2 + id) * w * 0.45, py = y1 + Math.sin(aa) * q + Math.cos(k * 1.3 + t * 2 + id) * w * 0.3, ks = kl(sp * 6 - k);
          manik += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(w * 0.78 * ks)}" fill="${P.spora}"/><circle cx="${f1(px - w * 0.22)}" cy="${f1(py - w * 0.22)}" r="${f1(w * 0.25 * ks)}" fill="#fff" opacity=".45"/>`; }
      } else for (let j = 0; j < jml; j++) cabang(x1, y1, aa + (j ? 0.55 : -0.5) + (sudut[j] - 0.5) * 0.4, L * 0.72, w * 0.8, d + 1, id * 3 + j + 1);
    };
    const nAkar = o.cabang || 5;
    for (let i = 0; i < nAkar; i++) cabang(0, -20, -Math.PI * (0.88 - (0.76 * i) / (nAkar - 1)), 120, 14, 0, i + 1);
    let badan = `<ellipse cx="0" cy="6" rx="86" ry="14" fill="${P.bayang}"/><ellipse cx="0" cy="-16" rx="74" ry="44" fill="${P.bakteriB}"/><ellipse cx="-6" cy="-26" rx="58" ry="30" fill="${P.bakteri}"/><ellipse cx="-24" cy="-40" rx="18" ry="8" fill="#fff" opacity=".25"/>`;
    if (o.wajah !== false) {
      const kd = (t % 3.7) < 0.12 ? 0.15 : 1;
      badan += `<ellipse cx="-20" cy="-22" rx="6" ry="${f1(7 * kd)}" fill="${MATA}"/><ellipse cx="20" cy="-22" rx="6" ry="${f1(7 * kd)}" fill="${MATA}"/>
        <path d="M-9 -8 Q0 -1 9 -8" fill="none" stroke="${MATA}" stroke-width="4" stroke-linecap="round"/>`;
    }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${benang}${badan}${manik}</g>`;
  }
  function spora(x0, y0, w, h, t, P, n = 20, benih = 131) {
    const r = acakDari(benih); let s = "";
    for (let i = 0; i < n; i++) { const bx = r() * w, by = r() * h, rr = 4 + r() * 6, kc = 0.3 + r() * 0.6;
      const x = x0 + ((bx + Math.sin(t * kc + i) * 30 + t * 8) % w), y = y0 + ((by - t * 14 * kc + h * 10) % h);
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${P.spora}" opacity=".85"/><circle cx="${f1(x - rr * 0.3)}" cy="${f1(y - rr * 0.3)}" r="${f1(rr * 0.3)}" fill="#fff" opacity=".4"/>`; }
    return s;
  }
  // springtail: hewan tanah mungil (kerabat serangga). o: {arah 1|-1, loncat 0..1, jalan}
  function springtail(x, y, s, P, t = 0, o = {}) {
    const ar = o.arah ?? 1, lc = o.loncat || 0, udara = lc > 0 && lc < 1, naik = Math.sin(Math.PI * lc) * 170, putar = udara ? lc * 360 : 0;
    const k = o.jalan ? Math.sin(t * 16) : 0, an = Math.sin(t * 3) * 5, fx = udara ? "M-44 -14 Q-70 0 -82 16" : "M-44 -14 Q-26 -2 -6 -6";
    const kaki = [-4, 12, 28].map((kx, i) => `<path d="M${kx} -16 Q${kx + 4} -6 ${f1(kx + 8 + k * (i % 2 ? 4 : -4))} 0" fill="none" stroke="${P.springtailB}" stroke-width="5" stroke-linecap="round"/>`).join("");
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s * ar)} ${s})"><ellipse cx="0" cy="2" rx="${f1(56 * (1 - naik / 400))}" ry="6" fill="${P.bayang}"/>
      <g transform="translate(0 ${f1(-naik)}) rotate(${f1(putar)} 0 -24)">${kaki}<path d="${fx}" fill="none" stroke="${P.springtailB}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="-38" cy="-22" rx="22" ry="14" fill="${P.springtailB}"/><ellipse cx="-17" cy="-25" rx="20" ry="16" fill="${P.springtail}"/><ellipse cx="4" cy="-27" rx="18" ry="16" fill="${P.springtail}"/>
      <ellipse cx="-38" cy="-26" rx="18" ry="9" fill="${P.springtail}"/><path d="M-50 -34 Q-10 -46 20 -38" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".22"/>
      <ellipse cx="27" cy="-27" rx="17" ry="15" fill="${P.springtail}"/><circle cx="35" cy="-31" r="4" fill="${MATA}"/>
      <path d="M38 -38 Q52 ${f1(-62 + an)} ${f1(72 + an)} ${f1(-70 + an)}" fill="none" stroke="${P.springtailB}" stroke-width="4" stroke-linecap="round"/>
      <path d="M34 -40 Q42 ${f1(-68 - an)} ${f1(58 - an)} ${f1(-84 - an)}" fill="none" stroke="${P.springtailB}" stroke-width="4" stroke-linecap="round"/></g></g>`;
  }
  // penampang tanah sangat dekat (set dunia mikro): butir pasir besar, akar, bilah rumput raksasa
  function tanahDekat(w, h, P, t = 0, o = {}) {
    const r = acakDari(o.benih || 111), y0 = o.permukaan ?? h * 0.36, g = uid("td"), gu = uid("tu");
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.tanahB}"/><stop offset="1" stop-color="${P.tanahRetak}"/></linearGradient>
      <linearGradient id="${gu}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${(P.mendung || P.langit)[0]}"/><stop offset="1" stop-color="${(P.mendung || P.langit)[1]}"/></linearGradient></defs>
      <rect width="${w}" height="${f0(y0 + 20)}" fill="url(#${gu})"/>`;
    for (let i = 0; i < 9; i++) { const bx = r() * w, lb = 60 + r() * 70, tg = 300 + r() * 500, mg = (r() - 0.5) * 120 + Math.sin(t * 0.8 + i) * 10;
      s += `<path d="M${f0(bx - lb / 2)} ${f0(y0 + 10)} Q${f0(bx + mg * 0.4)} ${f0(y0 - tg * 0.6)} ${f0(bx + mg)} ${f0(y0 - tg)} Q${f0(bx + mg * 0.4 + lb * 0.2)} ${f0(y0 - tg * 0.5)} ${f0(bx + lb / 2)} ${f0(y0 + 10)}Z" fill="${i % 2 ? P.daun : P.daunB}" opacity="${i < 4 ? 0.45 : 0.9}"/>`; }
    s += `<rect y="${f0(y0)}" width="${w}" height="${f0(h - y0 + 200)}" fill="url(#${g})"/>`;
    for (let i = 0; i < 5; i++) { const ax = r() * w, aw = 6 + r() * 6;
      s += `<path d="M${f0(ax)} ${f0(y0)} q${f0((r() - 0.5) * 160)} ${f0(200 + r() * 200)} ${f0((r() - 0.5) * 260)} ${f0(500 + r() * 600)}" fill="none" stroke="${P.batang}" stroke-width="${f1(aw)}" stroke-linecap="round" opacity=".6"/>`; }
    const butir = o.butir ?? 150;
    for (let i = 0; i < butir; i++) {
      const bx = r() * w, by = y0 + 14 + Math.pow(r(), 0.85) * (h - y0), br = 12 + r() * 36, tone = r(), rot = r() * 180, c = tone < 0.4 ? P.tanah : tone < 0.75 ? P.tanahG : P.batu;
      s += `<g transform="translate(${f0(bx)} ${f0(by)}) rotate(${f0(rot)})"><path d="M${f1(-br)} 0 Q${f1(-br)} ${f1(-br * 0.8)} 0 ${f1(-br * 0.75)} Q${f1(br)} ${f1(-br * 0.7)} ${f1(br)} 0 Q${f1(br * 0.9)} ${f1(br * 0.7)} 0 ${f1(br * 0.7)} Q${f1(-br * 0.95)} ${f1(br * 0.65)} ${f1(-br)} 0Z" fill="${c}"/>
        <ellipse cx="${f1(-br * 0.3)}" cy="${f1(-br * 0.35)}" rx="${f1(br * 0.35)}" ry="${f1(br * 0.16)}" fill="#fff" opacity=".12"/></g>`;
    }
    for (let x = -30; x < w + 30; x += 46 + r() * 30) { const br = 18 + r() * 22;
      s += `<ellipse cx="${f0(x)}" cy="${f0(y0 + 4)}" rx="${f0(br * 1.1)}" ry="${f0(br * 0.7)}" fill="${r() < 0.5 ? P.tanah : P.tanahB}"/><ellipse cx="${f0(x - br * 0.3)}" cy="${f0(y0 - br * 0.25)}" rx="${f0(br * 0.4)}" ry="${f0(br * 0.15)}" fill="#fff" opacity=".14"/>`; }
    return s;
  }
  // gumpalan aroma (pita bergelombang mengalir dari sumber ke tujuan, mis. tanah → hidung)
  function aroma(x0, y0, x1, y1, t, P, o = {}) {
    const n = o.n || 3, amp = o.amp || 40, lb = o.lebar || 10, k = o.k ?? 1; let s = "";
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    for (let i = 0; i < n; i++) {
      let d = ""; const off = (i - (n - 1) / 2) * amp * 0.9;
      for (let j = 0; j <= 28; j++) { const u = (j / 28) * k, wob = Math.sin(u * Math.PI * 3 - t * 3 + i * 2) * amp * Math.sin(Math.PI * Math.min(1, u)) + off * (1 - u);
        d += `${j ? "L" : "M"}${f1(x0 + dx * u + nx * wob)} ${f1(y0 + dy * u + ny * wob)}`; }
      s += `<path d="${d}" fill="none" stroke="${P.aroma}" stroke-width="${lb}" stroke-linecap="round" stroke-dasharray="${lb * 4} ${lb * 2.6}" stroke-dashoffset="${f1(-t * 90)}" opacity=".6"/>`;
    }
    return s;
  }
  // molekul geosmin bergaya datar (dua cincin enam menyatu + gugus OH & metil), berputar pelan
  function molekulGeosmin(x, y, s, P, t = 0) {
    const L = 60, h = L * 0.866, pt = (cx, a) => [cx + L * Math.cos((a * Math.PI) / 180), L * Math.sin((a * Math.PI) / 180)];
    const angs = [-90, -30, 30, 90, 150, 210], c1 = angs.map((a) => pt(-h, a)), c2 = angs.map((a) => pt(h, a));
    const garis = (a, b) => `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${P.airKilau}" stroke-width="12" stroke-linecap="round"/>`;
    let b = ""; for (const c of [c1, c2]) for (let i = 0; i < 6; i++) b += garis(c[i], c[(i + 1) % 6]);
    const O = [0, -L * 1.5], M1 = [0, L * 1.5], M2 = [c2[2][0] + L * 0.8, c2[2][1] + L * 0.45];
    b += garis([0, -L / 2], O) + garis([0, L / 2], M1) + garis(c2[2], M2);
    let at = [...c1, ...c2].map((p) => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="12" fill="${P.airKilau}"/>`).join("");
    at += `<circle cx="0" cy="${f1(O[1])}" r="22" fill="${P.atap}"/><circle cx="18" cy="${f1(O[1] - 18)}" r="11" fill="${P.airKilau}"/>
      <circle cx="0" cy="${f1(M1[1])}" r="18" fill="${P.aroma}"/><circle cx="${f1(M2[0])}" cy="${f1(M2[1])}" r="18" fill="${P.aroma}"/>`;
    return `<g transform="translate(${x} ${f1(y + Math.sin(t * 1.2) * 8)}) scale(${s}) rotate(${f1(Math.sin(t * 0.5) * 12)})">${b}${at}</g>`;
  }

  // ---------- kolam & lele ----------
  function lele(x, y, s, P, t = 0, o = {}) {
    const ar = o.arah ?? 1, ek = Math.sin(t * 5 + x * 0.01) * (o.diam ? 3 : 10), km = Math.sin(t * 3 + x * 0.02) * 6;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s * ar)} ${s})"><g transform="rotate(${f1(ek)} -110 0)"><path d="M-130 -4 L-205 -36 Q-190 0 -205 34Z" fill="${P.lele}"/></g>
      <path d="M-120 -16 Q-30 -40 60 -30 L60 -24 Q-30 -30 -120 -10Z" fill="${P.lele}" opacity=".85"/>
      <path d="M120 -14 C100 -36 40 -30 -20 -24 C-80 -20 -125 -12 -145 -4 C-125 8 -80 14 -20 18 C40 22 110 24 126 8Z" fill="${P.lele}"/>
      <path d="M-120 6 C-60 16 30 22 116 14 C100 24 40 24 -20 20 C-70 18 -110 12 -120 6Z" fill="${P.leleB}" opacity=".8"/>
      <ellipse cx="112" cy="-2" rx="40" ry="22" fill="${P.lele}"/><ellipse cx="104" cy="-14" rx="22" ry="6" fill="#fff" opacity=".12"/>
      <circle cx="128" cy="-10" r="4" fill="${MATA}"/><circle cx="129" cy="-11.5" r="1.3" fill="#fff"/>
      <path d="M148 -2 Q190 ${f1(-24 + km)} ${f1(222 + km)} ${f1(-6 + km)}" fill="none" stroke="${P.lele}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M148 4 Q188 ${f1(26 - km)} ${f1(214 - km)} ${f1(30 - km)}" fill="none" stroke="${P.lele}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M144 10 Q160 ${f1(34 + km * 0.5)} 170 46" fill="none" stroke="${P.lele}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M40 18 Q30 36 10 40 Q20 28 18 18Z" fill="${P.lele}"/></g>`;
  }
  // kolam tanah (lele berenang di bawah permukaan). o: {lele: jumlah, hujan: riak, muncul: 0..1 lele menyembul}
  function kolam(x, y, w, h, P, t = 0, o = {}) {
    const cp = uid("kl"), g = uid("kg"), r = acakDari(o.benih || 141), rx = w / 2, ry = h / 2;
    let s = `<defs><clipPath id="${cp}"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/></clipPath>
      <linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.airKolam}"/><stop offset="1" stop-color="${P.tanahRetak}"/></linearGradient></defs>
      <ellipse cx="${x}" cy="${y + 10}" rx="${rx + 46}" ry="${ry + 28}" fill="${P.tanahB}"/><ellipse cx="${x}" cy="${y}" rx="${rx + 14}" ry="${ry + 8}" fill="${P.tanahG}"/>
      <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${g})"/><g clip-path="url(#${cp})">`;
    const nl = o.lele ?? 3;
    for (let i = 0; i < nl; i++) { const ar = i % 2 ? -1 : 1, v = 40 + i * 14, sp = w + 500, px = ((t * v + i * 380) % sp) - sp / 2;
      s += `<g opacity=".55">${lele(x + px * ar, y - ry * 0.3 + (i * ry * 0.9) / Math.max(1, nl - 1) * 0.9, 0.7 + i * 0.08, P, t + i, { arah: ar })}</g>`; }
    s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${P.airKolam}" opacity=".35"/>`;
    for (let i = 0; i < 8; i++) { const kx = x - rx * 0.8 + r() * rx * 1.6 + Math.sin(t * 0.6 + i) * 12, ky = y - ry * 0.7 + r() * ry * 1.4, kw = 30 + r() * 70;
      s += `<rect x="${f0(kx)}" y="${f0(ky)}" width="${f0(kw)}" height="4" rx="2" fill="${P.airKilau}" opacity=".4"/>`; }
    s += pantulanCahaya(x + rx * 0.35, y - ry * 0.5, ry * 0.9, P, t, rx * 0.12);
    if (o.hujan) s += riakHujan(x - rx * 0.85, x + rx * 0.85, y - ry * 0.7, y + ry * 0.7, t, P, o.riak || 10, 151);
    s += `</g>`;
    const m = o.muncul || 0;
    if (m > 0) { const nk = Math.sin(Math.PI * kl(m)), mx = x + rx * 0.1;
      for (let j = 0; j < 3; j++) { const q = (m * 1.6 + j * 0.33) % 1; s += `<ellipse cx="${f0(mx)}" cy="${f0(y + 6)}" rx="${f1(30 + q * 150)}" ry="${f1(8 + q * 40)}" fill="none" stroke="${P.airKilau}" stroke-width="4" opacity="${f2((1 - q) * 0.7 * nk)}"/>`; }
      s += leleMuncul(mx, y + 10, 0.9, P, t, nk, Math.sin(t * 6) > 0 ? 1 : 0.3); }
    return s;
  }
  // kepala lele menyembul dari air (tampak depan), k: 0 tenggelam → 1 penuh, mangap: 0..1
  function leleMuncul(x, y, s, P, t = 0, k = 1, mangap = 0.5) {
    if (k <= 0) return ""; const cp = uid("lm"), km = Math.sin(t * 3) * 6, naik = (1 - k) * 170;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><defs><clipPath id="${cp}"><rect x="-300" y="-400" width="600" height="400"/></clipPath></defs><g clip-path="url(#${cp})"><g transform="translate(0 ${f1(naik)})">
      <path d="M-80 0 C-90 -80 -60 -150 0 -158 C60 -150 90 -80 80 0Z" fill="${P.lele}"/><path d="M-50 -20 C-56 -80 -30 -130 0 -136 C-20 -110 -30 -70 -24 -20Z" fill="#fff" opacity=".08"/>
      <circle cx="-42" cy="-112" r="7" fill="${MATA}"/><circle cx="42" cy="-112" r="7" fill="${MATA}"/><circle cx="-40" cy="-114" r="2.2" fill="#fff"/><circle cx="44" cy="-114" r="2.2" fill="#fff"/>
      <ellipse cx="0" cy="-58" rx="${f1(40 + mangap * 6)}" ry="${f1(6 + mangap * 22)}" fill="${P.leleB}"/><ellipse cx="0" cy="-56" rx="${f1(30 + mangap * 4)}" ry="${f1(2 + mangap * 16)}" fill="${MATA}" opacity=".55"/>
      <path d="M-40 -70 Q-110 ${f1(-90 + km)} ${f1(-150 + km)} ${f1(-40 + km)} M40 -70 Q110 ${f1(-90 - km)} ${f1(150 - km)} ${f1(-40 - km)}" fill="none" stroke="${P.lele}" stroke-width="5" stroke-linecap="round"/>
      <path d="M-30 -46 Q-70 -20 -86 10 M30 -46 Q70 -20 86 10" fill="none" stroke="${P.lele}" stroke-width="4" stroke-linecap="round"/></g></g>
      <ellipse cx="0" cy="0" rx="${f1(96 * k)}" ry="${f1(14 * k)}" fill="${P.airKilau}" opacity="${f2(0.5 * k)}"/></g>`;
  }
  // pecel lele di piring (momen "bau lumpur"); warna makanan diredupkan otomatis lewat P.redup
  function piringPecelLele(x, y, s, P) {
    const rd = redup(P);
    return `<g transform="translate(${x} ${y}) scale(${s})"><defs>${rd.defs}</defs><ellipse cx="0" cy="40" rx="300" ry="50" fill="${P.bayang}"/><g filter="url(#${rd.id})">
      <ellipse cx="0" cy="0" rx="290" ry="110" fill="#EDE6DA"/><ellipse cx="0" cy="-6" rx="230" ry="80" fill="#F7F2EA"/>
      <path d="M-170 -10 C-120 -60 60 -70 150 -30 L200 -60 Q196 -20 214 10 L150 -4 C60 30 -110 34 -170 -10Z" fill="#A8682F"/>
      <path d="M-150 -16 C-80 -48 60 -54 140 -26" fill="none" stroke="#7E4A1E" stroke-width="10" stroke-linecap="round"/><circle cx="-140" cy="-18" r="7" fill="#3A2412"/>
      <path d="M-160 -4 q-36 -20 -60 -10 M-162 2 q-30 10 -52 26" stroke="#7E4A1E" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="120" cy="40" rx="60" ry="22" fill="#C8452E"/><ellipse cx="108" cy="34" rx="20" ry="7" fill="#E46A4E"/>
      <ellipse cx="-110" cy="46" rx="42" ry="14" fill="#8DBE6A"/><ellipse cx="-110" cy="46" rx="30" ry="9" fill="#E9F2D0"/><ellipse cx="-50" cy="56" rx="38" ry="13" fill="#8DBE6A"/><ellipse cx="-50" cy="56" rx="27" ry="8" fill="#E9F2D0"/>
      <path d="M190 20 q30 -26 60 -6 q-26 20 -60 6Z M200 36 q36 -8 54 14 q-34 6 -54 -14Z" fill="#5E9A6A"/></g></g>`;
  }

  // ---------- kampung Indonesia saat gerimis ----------
  function rumahKampung(x, y, s, P, o = {}) {
    const n = P.jendelaNyala, g = uid("rk"), gt = uid("gt"), gs = uid("gs");
    const jendela = (jx) => `<rect x="${jx - 8}" y="-238" width="166" height="166" rx="4" fill="${P.batang}"/><rect x="${jx}" y="-230" width="150" height="150" fill="${P.jendela}"/>
      ${n ? `<rect x="${jx}" y="-230" width="150" height="150" fill="${P.cahaya}" opacity="${f2(0.45 * n)}"/>` : `<path d="M${jx + 14} -224 l40 0 l-50 140 l-0 -0z" fill="#fff" opacity=".22"/>`}
      <path d="M${jx} -230 q34 50 18 150 h-18z M${jx + 150} -230 q-34 50 -18 150 h18z" fill="${P.atap}" opacity=".45"/>
      <rect x="${jx + 71}" y="-230" width="8" height="150" fill="${P.batang}"/><rect x="${jx}" y="-160" width="150" height="7" fill="${P.batang}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${jx + 8 + i * 29}" y="-266" width="20" height="14" rx="3" fill="${P.dindingB}"/>`).join("")}`;
    return `<g transform="translate(${x} ${y}) scale(${s})"><defs>
      <radialGradient id="${g}"><stop offset="0" stop-color="${P.cahaya}" stop-opacity=".55"/><stop offset="1" stop-color="${P.cahaya}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${gs}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.cahaya}" stop-opacity=".35"/><stop offset="1" stop-color="${P.cahaya}" stop-opacity="0"/></linearGradient>
      <pattern id="${gt}" width="34" height="26" patternUnits="userSpaceOnUse"><rect width="34" height="26" fill="${P.atap}"/><path d="M0 19 Q8.5 27 17 19 Q25.5 27 34 19 V26 H0Z" fill="${P.atapB}"/><rect x="16" y="0" width="2" height="20" fill="${P.atapB}" opacity=".35"/></pattern></defs>
      <ellipse cx="0" cy="30" rx="520" ry="34" fill="${P.bayang}"/>${n ? `<ellipse cx="0" cy="-150" rx="560" ry="300" fill="url(#${g})" opacity="${f2(0.8 * n)}"/>` : ""}
      <rect x="-340" y="-310" width="680" height="310" fill="${P.dinding}"/><rect x="200" y="-310" width="140" height="310" fill="${P.dindingB}" opacity=".55"/><rect x="-340" y="-56" width="680" height="56" fill="${P.dindingB}"/>
      ${jendela(-270)}${jendela(120)}
      <rect x="-70" y="-240" width="130" height="240" fill="${P.batang}"/><rect x="-58" y="-228" width="106" height="40" fill="${P.jendela}" opacity=".8"/>${n ? `<rect x="-58" y="-228" width="106" height="40" fill="${P.cahaya}" opacity="${f2(0.5 * n)}"/>` : ""}<circle cx="38" cy="-110" r="6" fill="${P.dinding}"/>
      <path d="M-430 -300 L430 -300 L300 -470 L-300 -470Z" fill="url(#${gt})"/><path d="M-430 -300 L-300 -470 L-330 -300Z" fill="${P.atapB}" opacity=".5"/><path d="M430 -300 L300 -470 L330 -300Z" fill="${P.atapB}" opacity=".5"/>
      <rect x="-312" y="-484" width="624" height="22" rx="11" fill="${P.atapB}"/><path d="M-320 -480 q-20 -30 -4 -52 M320 -480 q20 -30 4 -52" stroke="${P.atapB}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M-440 -304 L440 -304 L490 -236 L-490 -236Z" fill="url(#${gt})"/><rect x="-494" y="-240" width="988" height="10" fill="${P.atapB}"/>
      <rect x="-340" y="-230" width="680" height="26" fill="${P.bayang}"/>
      ${[-460, -170, 170, 460].map((px) => `<rect x="${px - 9}" y="-232" width="18" height="232" fill="${P.batang}"/>`).join("")}
      ${n ? `<path d="M-270 -80 L-120 -80 L-60 26 L-330 26Z M120 -80 L270 -80 L330 26 L60 26Z" fill="url(#${gs})" opacity="${f2(n)}"/>` : ""}
      <rect x="-500" y="0" width="1000" height="26" fill="${P.batuB}"/><rect x="-500" y="-4" width="1000" height="8" fill="${P.dindingB}"/>
      ${n ? `<circle cx="0" cy="-212" r="60" fill="url(#${g})"/>` : ""}<rect x="-2" y="-232" width="4" height="12" fill="${P.batang}"/><circle cx="0" cy="-212" r="10" fill="${n ? P.cahaya : P.dindingB}"/></g>`;
  }
  function potTanaman(x, y, s, P, t = 0) {
    const g = Math.sin(t * 1.5 + x) * 3;
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="2" rx="50" ry="8" fill="${P.bayang}"/>
      <g transform="rotate(${f1(g)} 0 -60)"><path d="M0 -60 Q-60 -110 -70 -170 Q-20 -130 0 -60Z M0 -60 Q40 -140 20 -200 Q50 -130 0 -60Z M0 -60 Q60 -100 90 -140 Q60 -80 0 -60Z" fill="${P.daun}"/><path d="M0 -60 Q-20 -120 -40 -150 Q-6 -110 0 -60Z" fill="${P.daunB}"/></g>
      <path d="M-40 -64 L40 -64 L30 0 L-30 0Z" fill="${P.atap}"/><rect x="-44" y="-70" width="88" height="14" rx="4" fill="${P.atapB}"/></g>`;
  }
  function tiangListrik(x, y, s, P) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="2" rx="40" ry="6" fill="${P.bayang}"/><rect x="-9" y="-640" width="18" height="640" fill="${P.batuB}"/>
      <rect x="-70" y="-600" width="140" height="10" fill="${P.batuB}"/><circle cx="-56" cy="-606" r="7" fill="${P.batu}"/><circle cx="56" cy="-606" r="7" fill="${P.batu}"/><rect x="-14" y="-470" width="28" height="44" rx="4" fill="${P.batu}"/></g>`;
  }
  function kabel(x0, y0, x1, y1, P, kendur = 60) {
    return `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${Math.max(y0, y1) + kendur} ${x1} ${y1}" fill="none" stroke="${P.batuB}" stroke-width="3"/>`;
  }
  // jalan/gang kampung basah (genangan memantulkan lampu)
  function jalanKampung(w, y, P, t = 0, o = {}) {
    const r = acakDari(o.benih || 161), bawah = o.bawah ?? 1920;
    let s = `<rect x="-200" y="${y - 30}" width="${w + 400}" height="30" fill="${P.tanahRetak}"/><rect x="-200" y="${y - 8}" width="${w + 400}" height="12" fill="${P.batu}"/>
      <rect x="-200" y="${y}" width="${w + 400}" height="${bawah - y + 600}" fill="${P.jalan}"/>`;
    for (let i = 0; i < 6; i++) { const px = r() * w, py = y + 40 + r() * (bawah - y - 80); s += `<rect x="${f0(px)}" y="${f0(py)}" width="${f0(80 + r() * 160)}" height="${f0(30 + r() * 50)}" rx="10" fill="${P.jalanB}"/>`; }
    const gen = o.genangan ?? 3;
    for (let i = 0; i < gen; i++) { const gx = ((i + 0.25 + r() * 0.5) * w) / gen, gy = y + 80 + r() * (bawah - y - 200), sk = 0.6 + (gy - y) / (bawah - y), grx = (120 + r() * 120) * sk, gry = grx * 0.2;
      s += `<ellipse cx="${f0(gx)}" cy="${f0(gy)}" rx="${f0(grx)}" ry="${f0(gry)}" fill="${P.air}" opacity=".9"/><ellipse cx="${f0(gx - grx * 0.25)}" cy="${f0(gy - gry * 0.2)}" rx="${f0(grx * 0.5)}" ry="${f0(gry * 0.3)}" fill="${P.airKilau}" opacity=".3"/>`;
      s += pantulanCahaya(gx + grx * 0.15, gy - gry * 0.6, gry * 1.2, P, t, grx * 0.2);
      if (o.hujan) s += riakHujan(gx - grx * 0.8, gx + grx * 0.8, gy - gry * 0.5, gy + gry * 0.5, t, P, 4, 170 + i); }
    if (o.hujan) for (let i = 0; i < 10; i++) s += `<rect x="${f0(r() * w)}" y="${f0(y + 20 + r() * (bawah - y))}" width="${f0(60 + r() * 140)}" height="3" rx="1.5" fill="${P.airKilau}" opacity=".22"/>`;
    return s;
  }
  // kepala manusia tampak samping, close-up hidung yang mengendus (bukan Tebe). o: {endus 0..1, arah 1 = menghadap kanan}
  function kepalaProfil(x, y, s, P, t = 0, o = {}) {
    const rd = redup(P), e = o.endus || 0, nf = 1 + e * 0.12 * (0.5 + 0.5 * Math.sin(t * 9)), ar = o.arah ?? 1;
    return `<g transform="translate(${x} ${y}) scale(${f2(s * ar)} ${s})"><defs>${rd.defs}</defs><g filter="url(#${rd.id})">
      <path d="M-60 120 Q-50 220 -80 300 L120 300 Q90 220 100 130Z" fill="#D9A27A"/>
      <path d="M-170 -40 C-180 -200 -40 -270 70 -230 C150 -200 190 -130 186 -60 L210 10 Q216 22 200 26 L186 30 C190 60 180 70 170 76 Q178 92 160 100 C150 140 110 150 60 146 C0 140 -40 130 -80 110 C-150 80 -168 20 -170 -40Z" fill="#EDBB92"/>
      <path d="M186 -6 C200 6 212 12 210 22 C206 34 192 34 178 30" fill="#E3AA7E"/><ellipse cx="${f1(188)}" cy="22" rx="${f1(9 * nf)}" ry="${f1(5 * nf)}" fill="#B9765A"/>
      <path d="M-176 -30 C-190 -210 -30 -300 90 -236 C140 -210 160 -170 150 -150 C100 -180 40 -170 10 -140 C-20 -100 -70 -120 -90 -70 C-100 -40 -120 -20 -150 20Z" fill="#3B2A20"/>
      <ellipse cx="-40" cy="-20" rx="34" ry="42" fill="#E3AA7E"/><path d="M-50 -30 q12 -14 22 4" fill="none" stroke="#B9765A" stroke-width="6" stroke-linecap="round"/>
      <path d="M96 -64 q22 12 44 0" fill="none" stroke="#3B2A20" stroke-width="7" stroke-linecap="round"/><path d="M96 -98 q24 -14 50 -4" fill="none" stroke="#3B2A20" stroke-width="9" stroke-linecap="round"/>
      <path d="M150 74 q16 6 28 0" fill="none" stroke="#B9765A" stroke-width="6" stroke-linecap="round"/><ellipse cx="110" cy="40" rx="26" ry="14" fill="#F58A7A" opacity=".35"/></g></g>`;
  }

  const api = { PALET, langit, awan, burung, bukit, kabut, laut, tanah, lontar, pohon, semak, rumput, batu, pagar, lampuTaman, rumahReptil, kunangKunang, debuCahaya, komodo, telur, kromosom, studio,
    // tambahan set hujan (I-007)
    langitMendung, awanHujan, hujan, gerimis, riakHujan, tetesAtap, tanahKering, bercakBasah, tanahBasah, tetes, gelembung, aerosol, tetesSlowmo, gelasSoda,
    streptomyces, spora, springtail, tanahDekat, aroma, molekulGeosmin, lele, leleMuncul, kolam, pantulanCahaya, piringPecelLele, rumahKampung, potTanaman, tiangListrik, kabel, jalanKampung, kepalaProfil, redup };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ASET = api;
})(typeof window !== "undefined" ? window : globalThis);

/* ===== PERLUASAN: SET DURIAN (Yoga, 15 Nov 2026, video I-009) =====
 * Gaya sama: datar tanpa garis hitam, maks 2–3 nada per benda, warna asli benda diredupkan otomatis lewat redup(P).
 */
(function (root) {
  const A = (typeof module !== "undefined" && module.exports && module.exports.PALET) ? module.exports : root.ASET;
  let _n = 0; const uid = (p) => `${p}x${++_n}`;
  const f0 = (v) => Math.round(v), f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const DUR = { kulit: "#8E9B3C", kulitG: "#6F7C2C", kulitT: "#B3BE5C", daging: "#F6D66C", dagingG: "#E2B648", dagingT: "#FFF0A8", biji: "#8A5A30", tangkai: "#7A5A38" };
  const BAU = { a: "#C6E05A", b: "#93C247", c: "#E8F59A" };
  const bungkus = (P, isi) => { const r = A.redup(P); return `<g><defs>${r.defs}</defs><g filter="url(#${r.id})">${isi}</g></g>`; };

  // durian utuh/terbelah. o: {belah 0..1 (celah atas memperlihatkan daging), goyang (derajat), benih}
  function durian(x, y, s, P, o = {}) {
    const r = acak(o.benih || 5), b = cl(o.belah || 0), rx = 150, ry = 172;
    let duri = "";
    const n = 30;
    for (let i = 0; i < n; i++) { // duri tepi (menonjol keluar)
      const a = (i / n) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a), px = c * rx * 0.97, py = sn * ry * 0.97, tp = 1.17 + r() * 0.06;
      const qa = a - 0.11, qb = a + 0.11;
      duri += `<path d="M${f1(Math.cos(qa) * rx * 0.94)} ${f1(Math.sin(qa) * ry * 0.94)} L${f1(c * rx * tp)} ${f1(sn * ry * tp)} L${f1(Math.cos(qb) * rx * 0.94)} ${f1(Math.sin(qb) * ry * 0.94)}Z" fill="${i % 3 ? DUR.kulitG : DUR.kulit}"/>`;
      void px; void py;
    }
    let dalam = "";
    for (let j = 0; j < 7; j++) for (let i = 0; i < 7; i++) { // duri permukaan (piramida kecil 2 nada)
      const u = (i - 3) / 3.4 + (j % 2) * 0.07, v = (j - 3) / 3.4;
      if (u * u + v * v > 0.86) continue;
      const cx = u * rx, cy = v * ry, k = 15 * (1 - (u * u + v * v) * 0.35);
      dalam += `<path d="M${f1(cx)} ${f1(cy - k)} L${f1(cx + k)} ${f1(cy + k * 0.7)} L${f1(cx - k)} ${f1(cy + k * 0.7)}Z" fill="${DUR.kulitT}" opacity=".75"/><path d="M${f1(cx)} ${f1(cy - k)} L${f1(cx + k)} ${f1(cy + k * 0.7)} L${f1(cx)} ${f1(cy + k * 0.3)}Z" fill="${DUR.kulitG}" opacity=".7"/>`;
    }
    let celah = "";
    if (b > 0) {
      const lw = 118 * b, top = -ry * 0.92, bot = -ry * 0.92 + 250 * Math.min(1, b * 1.2);
      celah = `<path d="M${f1(-lw)} ${f1(top + 30)} Q0 ${f1(top - 30 * b)} ${f1(lw)} ${f1(top + 30)} Q${f1(lw * 0.7)} ${f1(bot)} 0 ${f1(bot + 10)} Q${f1(-lw * 0.7)} ${f1(bot)} ${f1(-lw)} ${f1(top + 30)}Z" fill="#EFDC98"/>
        <ellipse cx="${f1(-lw * 0.5)}" cy="${f1(top + 80 * b + 20)}" rx="${f1(lw * 0.4)}" ry="${f1(84 * b + 10)}" fill="${DUR.dagingG}"/><ellipse cx="${f1(lw * 0.5)}" cy="${f1(top + 84 * b + 20)}" rx="${f1(lw * 0.38)}" ry="${f1(82 * b + 10)}" fill="${DUR.dagingG}"/>
        <ellipse cx="0" cy="${f1(top + 96 * b + 20)}" rx="${f1(lw * 0.44)}" ry="${f1(100 * b + 10)}" fill="${DUR.daging}"/><ellipse cx="${f1(-lw * 0.12)}" cy="${f1(top + 70 * b + 20)}" rx="${f1(lw * 0.14)}" ry="${f1(24 * b + 4)}" fill="${DUR.dagingT}" opacity=".85"/>
        <ellipse cx="${f1(-lw * 0.58)}" cy="${f1(top + 66 * b + 20)}" rx="${f1(lw * 0.1)}" ry="${f1(16 * b + 3)}" fill="${DUR.dagingT}" opacity=".7"/><ellipse cx="${f1(lw * 0.42)}" cy="${f1(top + 68 * b + 20)}" rx="${f1(lw * 0.1)}" ry="${f1(16 * b + 3)}" fill="${DUR.dagingT}" opacity=".7"/>
        <path d="M${f1(-lw)} ${f1(top + 30)} q-26 10 -40 40 M${f1(lw)} ${f1(top + 30)} q26 10 40 40" stroke="${DUR.kulitG}" stroke-width="18" stroke-linecap="round" fill="none"/>`;
    }
    const isi = `<ellipse cx="0" cy="${ry + 10}" rx="${rx * 0.9}" ry="20" fill="${P.bayang}"/>${duri}<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${DUR.kulit}"/>
      <ellipse cx="${-rx * 0.28}" cy="${-ry * 0.3}" rx="${rx * 0.5}" ry="${ry * 0.5}" fill="${DUR.kulitT}" opacity=".28"/><path d="M${rx * 0.55} ${-ry * 0.75} A${rx} ${ry} 0 0 1 ${rx * 0.3} ${ry * 0.95} A${rx * 1.1} ${ry} 0 0 0 ${rx * 0.55} ${-ry * 0.75}Z" fill="${DUR.kulitG}" opacity=".45"/>
      ${dalam}${celah}${b > 0.3 ? "" : `<path d="M0 ${-ry + 8} C-4 ${-ry - 30} 10 ${-ry - 50} 22 ${-ry - 60}" stroke="${DUR.tangkai}" stroke-width="20" stroke-linecap="round" fill="none"/>`}`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f2(o.goyang || 0)}) scale(${f2(s)})">${bungkus(P, isi)}</g>`;
  }
  // durian terbuka lebar (tampak dari atas-depan): ruang-ruang daging. o: {matang 0..1 → kuning makin pekat}
  function durianBelah(x, y, s, P, o = {}) {
    const m = cl(o.matang ?? 1), d = m > 0.5 ? DUR.daging : "#EFE3A6", dg = m > 0.5 ? DUR.dagingG : "#D9C886";
    let pod = "";
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.55, px = Math.cos(a) * 92, py = Math.sin(a) * 60 + 40;
      pod += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="58" ry="40" fill="${i % 2 ? dg : d}"/><ellipse cx="${f1(px - 16)}" cy="${f1(py - 12)}" rx="18" ry="10" fill="${DUR.dagingT}" opacity=".75"/>`; }
    const isi = `<ellipse cx="0" cy="150" rx="230" ry="26" fill="${P.bayang}"/><path d="M-230 20 Q-240 160 0 170 Q240 160 230 20 Q120 70 0 70 Q-120 70 -230 20Z" fill="${DUR.kulit}"/>
      <path d="M-230 20 Q-120 -30 0 -32 Q120 -30 230 20 Q120 70 0 70 Q-120 70 -230 20Z" fill="#F4ECD2"/>${pod}
      ${[-180, -110, -40, 40, 110, 180].map((px, i) => `<path d="M${px - 18} ${70 + Math.abs(px) * -0.28 + 60} l18 34 l18 -34Z" fill="${i % 2 ? DUR.kulitG : DUR.kulitT}"/>`).join("")}`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${bungkus(P, isi)}</g>`;
  }
  // gumpalan asap bau naik terus (fungsi waktu kontinu). k = kekuatan 0..1, o: {n, lebar, tinggi, benih, warna:[a,b]}
  function asapBau(x, y, s, t, k = 1, o = {}) {
    if (k <= 0) return "";
    const r = acak(o.benih || 3), n = o.n || 7, tg = o.tinggi || 420, lb = o.lebar || 60, w = o.warna || [BAU.a, BAU.b];
    let g = "";
    for (let i = 0; i < n; i++) { const per = 1.6 + r() * 0.8, ph = r() * per, u = ((t + ph) % per) / per, rr = (18 + u * 46) * (0.7 + r() * 0.5);
      const px = Math.sin(u * 5 + i) * lb * u + (r() - 0.5) * 20, py = -u * tg;
      g += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(rr)}" fill="${i % 2 ? w[0] : w[1]}" opacity="${f2(Math.sin(Math.PI * u) * 0.78 * k)}"/>`; }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${g}</g>`;
  }
  // cerobong mungil "pabrik bau". o: {tumbuh 0..1, nyala 0..1, asap 0..1}
  function cerobongMini(x, y, s, P, t, o = {}) {
    const tb = o.tumbuh ?? 1; if (tb <= 0) return "";
    const ny = cl(o.nyala || 0), getar = (o.asap || 0) * Math.sin(t * 40) * 1.2;
    const isi = `<ellipse cx="0" cy="4" rx="70" ry="14" fill="${P.bayang}"/><path d="M-46 0 L-36 -230 L36 -230 L46 0Z" fill="#C8734E"/><path d="M8 0 L12 -230 L36 -230 L46 0Z" fill="#A95C3D"/>
      <rect x="-50" y="-262" width="100" height="40" rx="10" fill="#B7654A"/><rect x="-50" y="-262" width="100" height="12" rx="6" fill="#D88A62"/>
      <rect x="-40" y="-150" width="80" height="12" fill="#A95C3D" opacity=".7"/><rect x="-43" y="-80" width="86" height="12" fill="#A95C3D" opacity=".7"/>
      <circle cx="0" cy="-185" r="17" fill="#5E3A2A"/><circle cx="0" cy="-185" r="13" fill="${BAU.c}" opacity="${f2(ny)}"/><circle cx="0" cy="-185" r="34" fill="${BAU.a}" opacity="${f2(ny * 0.35)}"/>`;
    return `<g transform="translate(${f1(x + getar)} ${f1(y)}) scale(${f2(s)} ${f2(s * tb)})">${isi}</g>${asapBau(x, y - 262 * s * tb, s * 1.1, t, (o.asap || 0) * tb, { benih: Math.round(x) % 97 + 1, tinggi: 460 })}`;
  }
  // garis bau bergelombang (kartun): dari (x0,y0) ke (x1,y1). k 0..1 = panjang tampil
  function gelombangBau(x0, y0, x1, y1, t, k = 1, o = {}) {
    if (k <= 0) return "";
    const n = o.n || 3, warna = o.warna || BAU.a; let s = "";
    const L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
    for (let i = 0; i < n; i++) { let d = ""; const off = (i - (n - 1) / 2) * (o.jarak || 34);
      for (let j = 0; j <= 30; j++) { const u = (j / 30) * k, gl = off + Math.sin(u * 14 - t * 5 + i) * (o.amp || 16), px = x0 + (x1 - x0) * u + nx * gl, py = y0 + (y1 - y0) * u + ny * gl;
        d += (j ? " L" : "M") + f1(px) + " " + f1(py); }
      s += `<path d="${d}" fill="none" stroke="${warna}" stroke-width="${o.tebal || 10}" stroke-linecap="round" opacity="${f2(0.75 - i * 0.12)}"/>`; }
    return s;
  }
  // lapak durian pinggir jalan (terpal, meja kayu, durian bertumpuk & bergantung, bohlam menyala di malam/senja)
  function lapakDurian(x, y, s, P, t = 0, o = {}) {
    const ny = P.jendelaNyala, kayu = P.nama === "malam" ? "#5E4636" : P.nama === "senja" ? "#8A6040" : "#A6774C", kayuG = P.nama === "malam" ? "#4A372B" : "#6E4A30";
    const terpal = P.nama === "malam" ? "#2F5579" : P.nama === "senja" ? "#3C6B95" : "#3F7FB8", terpalG = P.nama === "malam" ? "#25466A" : "#2F5F8C";
    let s2 = `<ellipse cx="0" cy="8" rx="520" ry="26" fill="${P.bayang}"/>
      <rect x="-470" y="-560" width="22" height="560" fill="${kayuG}"/><rect x="448" y="-560" width="22" height="560" fill="${kayuG}"/>
      <path d="M-540 -560 L540 -560 L500 -470 L-500 -470Z" fill="${terpal}"/>${[...Array(9)].map((_, i) => `<path d="M${-500 + i * 125} -470 q31 34 62 0 q31 34 63 0" fill="${i % 2 ? terpal : terpalG}"/>`).join("")}
      <path d="M-540 -560 L540 -560 L540 -544 L-540 -544Z" fill="${terpalG}"/>`;
    // tali gantung + durian bergantung
    for (const gx of [-340, -150, 170, 360]) s2 += `<path d="M${gx} -470 L${gx} ${-400 + (gx % 3) * 4}" stroke="${kayuG}" stroke-width="4"/>${durian(gx, -330 + Math.sin(t * 1.4 + gx) * 3, 0.38, P, { goyang: Math.sin(t * 1.4 + gx) * 4, benih: Math.abs(gx) % 11 + 1 })}`;
    // bohlam
    let kabel = "M-520 -455"; for (let i = 0; i <= 10; i++) kabel += ` Q${-520 + i * 104 - 52} -425 ${-520 + i * 104} -455`;
    s2 += `<path d="${kabel}" fill="none" stroke="${kayuG}" stroke-width="3"/>`;
    for (let i = 0; i <= 10; i++) { const bx = -520 + i * 104, kd = 0.85 + 0.15 * Math.sin(t * 2.3 + i * 1.7);
      s2 += `<circle cx="${bx}" cy="-445" r="${f1(40 * ny * kd)}" fill="#FFD38A" opacity="${f2(0.28 * ny)}"/><circle cx="${bx}" cy="-445" r="9" fill="${ny ? "#FFE7AE" : "#F1E9D6"}"/>`; }
    // meja + tumpukan durian
    s2 += `<rect x="-500" y="-210" width="1000" height="30" rx="6" fill="${kayu}"/><rect x="-480" y="-180" width="24" height="180" fill="${kayuG}"/><rect x="456" y="-180" width="24" height="180" fill="${kayuG}"/><rect x="-480" y="-90" width="960" height="16" fill="${kayuG}" opacity=".8"/>`;
    const tumpuk = o.tumpuk ?? [[-380, -290, 0.5], [-250, -290, 0.52], [-315, -380, 0.48], [250, -290, 0.5], [380, -290, 0.52], [315, -380, 0.5], [-120, -285, 0.48], [130, -285, 0.48]];
    for (const [dx, dy, ds] of tumpuk) s2 += durian(dx, dy, ds, P, { benih: Math.abs(dx) % 13 + 2, goyang: dx % 20 });
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${s2}</g>`;
  }
  // kabin pesawat penumpang generik (tanpa logo), perspektif satu titik. o: {vx, vy, lampu}
  function kabinPesawat(w, h, P, t = 0, o = {}) {
    const vx = o.vx ?? w / 2, vy = o.vy ?? 800, gelap = P.nama === "malam";
    const din = gelap ? "#55627A" : "#D9DDE2", dinG = gelap ? "#465269" : "#BFC5CC", atap = gelap ? "#606E86" : "#E8EBEE", lantai = gelap ? "#2E3A55" : "#4A5878", jendela = gelap ? "#1B2742" : "#9FC9E6";
    const g = uid("kb");
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${atap}"/><stop offset="1" stop-color="${din}"/></linearGradient></defs>
      <rect x="0" y="0" width="${w}" height="${h}" fill="url(#${g})"/>
      <path d="M0 0 L${vx - 150} ${vy - 190} L${vx + 150} ${vy - 190} L${w} 0Z" fill="${atap}"/>
      <path d="M0 0 L${vx - 150} ${vy - 190} L${vx - 150} ${vy - 120} L0 360Z" fill="${dinG}"/><path d="M${w} 0 L${vx + 150} ${vy - 190} L${vx + 150} ${vy - 120} L${w} 360Z" fill="${dinG}"/>
      <path d="M0 ${h} L${vx - 70} ${vy + 60} L${vx + 70} ${vy + 60} L${w} ${h}Z" fill="${lantai}"/>
      <path d="M${vx - 150} ${vy - 190} L${vx + 150} ${vy - 190} L${vx + 150} ${vy + 60} L${vx - 150} ${vy + 60}Z" fill="${dinG}"/><rect x="${vx - 40}" y="${vy - 150}" width="80" height="200" rx="10" fill="${din}"/>`;
    // jendela samping
    for (let i = 0; i < 6; i++) { const k = Math.pow(0.72, i), xl = vx - (vx - 40) * k - 150 * (1 - k), yy = vy - 40 - 360 * k, ww = 60 * k + 8, hh = 90 * k + 10;
      s += `<rect x="${f1(xl)}" y="${f1(yy)}" width="${f1(ww)}" height="${f1(hh)}" rx="${f1(ww * 0.45)}" fill="${jendela}"/>`;
      const xr = w - xl - ww; s += `<rect x="${f1(xr)}" y="${f1(yy)}" width="${f1(ww)}" height="${f1(hh)}" rx="${f1(ww * 0.45)}" fill="${jendela}"/>`;
      if (gelap) s += `<circle cx="${f1(xl + ww * 0.4)}" cy="${f1(yy + hh * 0.3)}" r="${f1(2 * k + 1)}" fill="#F2EAD0" opacity=".8"/>`; }
    // lampu lorong
    for (let i = 0; i < 8; i++) { const k = Math.pow(0.75, i); s += `<rect x="${f1(vx - 8 * k - 2)}" y="${f1(vy + 60 + (h - vy - 60) * k * 0.98 - 6)}" width="${f1(16 * k + 4)}" height="${f1(6 * k + 2)}" rx="2" fill="#FFD38A" opacity="${f2(0.5 + 0.3 * Math.sin(t * 2 + i))}"/>`; }
    // bagasi kabin
    s += `<path d="M0 120 L${vx - 150} ${vy - 175} L${vx - 150} ${vy - 135} L0 300Z" fill="${din}"/><path d="M${w} 120 L${vx + 150} ${vy - 175} L${vx + 150} ${vy - 135} L${w} 300Z" fill="${din}"/>`;
    return s;
  }
  // sandaran kursi pesawat + penumpang siluet tanpa wajah. o: {penumpang, kipas (0..1 tangan mengipas), arah}
  function kursiPesawat(x, y, s, P, t = 0, o = {}) {
    const gelap = P.nama === "malam", kain = o.warna || (gelap ? "#3D5C8A" : "#4C76B0"), kainG = gelap ? "#30496F" : "#3B5F92", silu = gelap ? "#1D2638" : "#2D3648";
    let p = "";
    if (o.penumpang !== false) {
      const kip = o.kipas || 0, ay = Math.sin(t * 11 + x) * 18 * kip;
      p = `<ellipse cx="${o.arah || 0}" cy="-250" rx="52" ry="60" fill="${silu}"/><path d="M-70 -190 Q0 -215 70 -190 L70 -150 L-70 -150Z" fill="${silu}"/>`;
      if (kip > 0) p += `<g transform="rotate(${f1(ay - 20)} 50 -200)"><path d="M40 -200 L70 -300" stroke="${silu}" stroke-width="22" stroke-linecap="round"/><ellipse cx="74" cy="-318" rx="20" ry="26" fill="${silu}"/></g>`;
    }
    const isi = `${p}<path d="M-90 -200 Q-92 -260 -60 -270 L60 -270 Q92 -260 90 -200 L84 30 L-84 30Z" fill="${kain}"/><path d="M-90 -200 Q-92 -260 -60 -270 L-20 -270 L-40 30 L-84 30Z" fill="${kainG}" opacity=".55"/>
      <rect x="-62" y="-262" width="124" height="44" rx="12" fill="${gelap ? "#C9D2DE" : "#EEF2F6"}" opacity=".9"/><rect x="-60" y="-80" width="120" height="70" rx="8" fill="${kainG}"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${isi}</g>`;
  }
  // keranjang anyaman berisi durian
  function keranjangDurian(x, y, s, P, t = 0) {
    const r = A.redup(P);
    let anyam = ""; for (let i = 0; i < 9; i++) anyam += `<path d="M${-150 + i * 37} -150 L${-130 + i * 32} 0" stroke="#8C6234" stroke-width="5" opacity=".6"/>`;
    for (let j = 0; j < 4; j++) anyam += `<path d="M${-150 + j * 6} ${-120 + j * 34} L${150 - j * 6} ${-120 + j * 34}" stroke="#8C6234" stroke-width="6" opacity=".55"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${durian(-70, -170, 0.5, P, { benih: 3 })}${durian(60, -180, 0.52, P, { benih: 8, goyang: 10 })}${durian(0, -230, 0.46, P, { benih: 6 })}
      <defs>${r.defs}</defs><g filter="url(#${r.id})"><ellipse cx="0" cy="6" rx="170" ry="18" fill="${P.bayang}"/><path d="M-160 -150 L160 -150 L130 0 L-130 0Z" fill="#B8864E"/>${anyam}<rect x="-170" y="-166" width="340" height="24" rx="12" fill="#9C6E3C"/></g></g>`;
  }
  // lab genetika: dinding, jendela kota (gedung berjendela menyala), meja panjang
  function labGenetika(w, h, P, t = 0, o = {}) {
    const gelap = P.nama === "malam", din = gelap ? "#2C4152" : "#DCE6E8", dinG = gelap ? "#253847" : "#C5D3D6", meja = gelap ? "#3D5566" : "#B9C9CF", langitK = gelap ? ["#16233C", "#2E4768"] : ["#8FC6D8", "#DCEFEA"];
    const g = uid("lb"), r = acak(o.benih || 17), jx = o.jx ?? 120, jw = o.jw ?? (w - 240), jy = 260, jh = 760;
    let kota = "";
    for (let i = 0; i < 16; i++) { const bw = 70 + r() * 90, bx = jx - 30 + i * (jw / 14), bh = 220 + r() * 420, by = jy + jh - bh;
      kota += `<rect x="${f1(bx)}" y="${f1(by)}" width="${f1(bw)}" height="${f1(bh)}" fill="${gelap ? (i % 2 ? "#22324C" : "#1D2B43") : (i % 2 ? "#A9C2CC" : "#9AB4C0")}"/>`;
      for (let a = 0; a < 3; a++) for (let b = 0; b < bh / 46 - 1; b++) if (r() < 0.45) kota += `<rect x="${f1(bx + 12 + a * (bw - 24) / 3)}" y="${f1(by + 16 + b * 46)}" width="${f1((bw - 36) / 3)}" height="20" fill="${gelap ? "#FFD38A" : "#DCEFF2"}" opacity="${f2(gelap ? 0.5 + 0.3 * Math.sin(t + a + b) : 0.6)}"/>`; }
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${langitK[0]}"/><stop offset="1" stop-color="${langitK[1]}"/></linearGradient><clipPath id="${g}c"><rect x="${jx}" y="${jy}" width="${jw}" height="${jh}" rx="16"/></clipPath></defs>
      <rect width="${w}" height="${h}" fill="${din}"/><rect x="${jx - 22}" y="${jy - 22}" width="${jw + 44}" height="${jh + 44}" rx="24" fill="${dinG}"/>
      <g clip-path="url(#${g}c)"><rect x="${jx}" y="${jy}" width="${jw}" height="${jh}" fill="url(#${g})"/>${gelap ? `<circle cx="${jx + jw * 0.78}" cy="${jy + 150}" r="46" fill="#F2EAD0" opacity=".9"/>` : ""}${kota}</g>
      ${[1, 2, 3].map((i) => `<rect x="${f1(jx + (jw * i) / 4 - 8)}" y="${jy}" width="16" height="${jh}" fill="${dinG}"/>`).join("")}<rect x="${jx}" y="${jy + jh * 0.55}" width="${jw}" height="14" fill="${dinG}"/>
      <rect x="0" y="1140" width="${w}" height="${h - 1140}" fill="${dinG}"/><rect x="-20" y="1120" width="${w + 40}" height="44" rx="8" fill="${meja}"/><rect x="0" y="1164" width="${w}" height="30" fill="#000" opacity=".12"/>`;
  }
  // mesin pembaca DNA (kotak + layar pita warna, lampu berkedip; tanpa tulisan)
  function mesinSekuensing(x, y, s, P, t = 0) {
    const gelap = P.nama === "malam", kot = gelap ? "#C9D3DC" : "#EEF2F4", kotG = gelap ? "#A7B3BE" : "#CFD8DD";
    let pita = ""; const war = ["#5FC28A", "#F26B5B", "#4E8FE0", "#FFC93C"];
    for (let i = 0; i < 22; i++) { const hh = 20 + 50 * Math.abs(Math.sin(i * 1.7 + Math.floor(t * 4) * 0.3)); pita += `<rect x="${-150 + i * 13.5}" y="${-150 - hh}" width="9" height="${f1(hh)}" fill="${war[i % 4]}"/>`; }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})"><ellipse cx="0" cy="6" rx="230" ry="20" fill="${P.bayang}"/><rect x="-210" y="-380" width="420" height="380" rx="26" fill="${kot}"/><rect x="40" y="-380" width="170" height="380" rx="26" fill="${kotG}"/>
      <rect x="-170" y="-330" width="300" height="200" rx="14" fill="#1C2A3A"/>${pita}<rect x="-170" y="-100" width="140" height="70" rx="10" fill="${kotG}"/><circle cx="160" cy="-320" r="12" fill="#5FC28A" opacity="${f2(0.5 + 0.5 * Math.sin(t * 6))}"/>
      <rect x="70" y="-120" width="110" height="80" rx="10" fill="#9FB0BC"/></g>`;
  }
  // ilmuwan (sosok tanpa wajah, jas lab) — o: {peluk: durian di pelukan, kulit, rambut}
  function ilmuwan(x, y, s, P, t = 0, o = {}) {
    const kulit = o.kulit || "#D9A27A", rambut = o.rambut || "#2E2522", jas = P.nama === "malam" ? "#DCE3EA" : "#F7F8F8", jasG = P.nama === "malam" ? "#BAC4CF" : "#DDE3E6", ay = Math.sin(t * 2 + x) * 3;
    const isi = `<ellipse cx="0" cy="6" rx="110" ry="16" fill="${P.bayang}"/><rect x="-60" y="-200" width="44" height="200" rx="18" fill="#3C4A5C"/><rect x="16" y="-200" width="44" height="200" rx="18" fill="#34404F"/>
      <path d="M-95 -520 Q0 -560 95 -520 L110 -170 L-110 -170Z" fill="${jas}"/><path d="M0 -540 L28 -170 L110 -170 L95 -520Z" fill="${jasG}"/><path d="M-26 -540 L0 -470 L26 -540Z" fill="#7FA6C2"/>
      <rect x="-26" y="-600" width="52" height="70" rx="20" fill="${kulit}"/><ellipse cx="0" cy="${-660 + ay}" rx="70" ry="80" fill="${kulit}"/><path d="M-72 ${-660 + ay} Q-76 ${-760 + ay} 0 ${-748 + ay} Q76 ${-760 + ay} 72 ${-660 + ay} Q50 ${-720 + ay} 0 ${-716 + ay} Q-50 ${-720 + ay} -72 ${-660 + ay}Z" fill="${rambut}"/><circle cx="-24" cy="${-650 + ay}" r="7" fill="#2E2522"/><circle cx="24" cy="${-650 + ay}" r="7" fill="#2E2522"/><path d="M-18 ${-622 + ay} Q0 ${-606 + ay} 18 ${-622 + ay}" stroke="#2E2522" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${o.peluk ? `<path d="M-90 -470 Q-150 -360 -40 -330 M90 -470 Q150 -360 40 -330" stroke="${jas}" stroke-width="46" stroke-linecap="round" fill="none"/>` : `<path d="M-90 -470 Q-130 -330 -100 -220 M90 -470 Q130 -330 100 -220" stroke="${jas}" stroke-width="46" stroke-linecap="round" fill="none"/>`}`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${isi}${o.peluk ? durian(0, -370, 0.56, P, { benih: 9, goyang: Math.sin(t * 2) * 4 }) + `<path d="M-120 -400 Q-60 -300 0 -330 M120 -400 Q60 -300 0 -330" stroke="${jas}" stroke-width="40" stroke-linecap="round" fill="none"/>` : ""}</g>`;
  }
  // latar dalam sel tumbuhan (dinding sel hijau, kloroplas melayang)
  function selTumbuhan(w, h, t = 0, o = {}) {
    const r = acak(o.benih || 23), g = uid("sl");
    let k = "";
    for (let i = 0; i < 16; i++) { const cx = r() * w, cy = r() * h, a = r() * 180 + t * 4 * (r() - 0.5), rx = 50 + r() * 50;
      k += `<g transform="translate(${f1(cx + Math.sin(t * 0.5 + i) * 16)} ${f1(cy + Math.cos(t * 0.4 + i) * 12)}) rotate(${f1(a)})"><ellipse rx="${f1(rx)}" ry="${f1(rx * 0.5)}" fill="#5C9B5A" opacity=".55"/><path d="M${f1(-rx * 0.6)} 0 Q0 ${f1(-rx * 0.25)} ${f1(rx * 0.6)} 0 M${f1(-rx * 0.5)} ${f1(rx * 0.15)} Q0 ${f1(-rx * 0.05)} ${f1(rx * 0.5)} ${f1(rx * 0.15)}" stroke="#7DB872" stroke-width="5" fill="none" opacity=".6"/></g>`; }
    return `<defs><radialGradient id="${g}" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#2F5E57"/><stop offset="1" stop-color="#1D3D3E"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#${g})"/>
      <rect x="18" y="18" width="${w - 36}" height="${h - 36}" rx="80" fill="none" stroke="#4E8C64" stroke-width="30" opacity=".5"/>${k}<circle cx="${w * 0.82}" cy="${h * 0.2}" r="150" fill="#3F7A6A" opacity=".5"/><circle cx="${w * 0.82}" cy="${h * 0.2}" r="90" fill="#4C8A74" opacity=".5"/>`;
  }
  // untai DNA ganda horizontal. o: {segmen:[[u0,u1,k]] (0..1 sepanjang untai, k nyala), warna, redup, puting:[...] asap}
  function untaiDNA(x, y, panjang, t = 0, o = {}) {
    const n = 64, amp = o.amp || 90, putar = t * (o.laju ?? 1.2), war = o.warna || ["#9FD3E6", "#F2ECE1"], seg = o.segmen || [];
    let belakang = "", depan = "", anak = "";
    const nyala = (u) => { let k = 0; for (const [a, b, kk] of seg) if (u >= a && u <= b) k = Math.max(k, kk); return k; };
    for (let i = 0; i < n; i++) { const u = i / (n - 1), px = x + u * panjang, a = u * Math.PI * 6 + putar, y1 = y + Math.sin(a) * amp, y2 = y - Math.sin(a) * amp, z = Math.cos(a), k = nyala(u);
      if (i % 2 === 0) { const c = k > 0 ? `#FFC93C` : (o.redup ? "#6F8A94" : "#C6D9E0"); anak += `<path d="M${f1(px)} ${f1(y1)} L${f1(px)} ${f1(y2)}" stroke="${c}" stroke-width="${k > 0 ? 12 : 8}" stroke-linecap="round" opacity="${f2(k > 0 ? 0.6 + 0.4 * k : 0.6)}"/>`;
        if (k > 0) anak += `<circle cx="${f1(px)}" cy="${y}" r="${f1(26 * k)}" fill="#FFE27A" opacity="${f2(0.25 * k)}"/>`; }
      const b1 = `<circle cx="${f1(px)}" cy="${f1(y1)}" r="${f1(14 + z * 4)}" fill="${o.redup ? "#7C9AA6" : war[0]}"/>`, b2 = `<circle cx="${f1(px)}" cy="${f1(y2)}" r="${f1(14 - z * 4)}" fill="${o.redup ? "#94A6AE" : war[1]}"/>`;
      if (z > 0) { depan += b1; belakang += b2; } else { depan += b2; belakang += b1; } }
    return belakang + anak + depan;
  }
  // koki gumpal (tokoh pendukung sederhana, bukan Tebe): badan bulat, topi koki, pisau mencincang. o: {laju, fase}
  function kokiBlob(x, y, s, t = 0, o = {}) {
    const laju = o.laju || 1, ph = t * 6 * laju + (o.fase || 0), cincang = Math.max(0, Math.sin(ph)) ** 2, bob = Math.abs(Math.sin(ph)) * 6;
    const kerut = laju > 1.6 ? `<path d="M-30 -96 l14 6 M30 -96 l-14 6" stroke="#5A4630" stroke-width="5" stroke-linecap="round"/>` : "";
    return `<g transform="translate(${f1(x)} ${f1(y - bob)}) scale(${f2(s)})"><ellipse cx="0" cy="${f1(bob + 4)}" rx="70" ry="12" fill="rgba(80,50,10,.18)"/>
      <ellipse cx="0" cy="-60" rx="68" ry="64" fill="#FFF8EC"/><ellipse cx="18" cy="-52" rx="40" ry="50" fill="#EFE4D2"/>
      <path d="M-44 -116 Q-60 -170 -24 -168 Q-14 -196 14 -186 Q46 -196 46 -160 Q66 -150 44 -116Z" fill="#FFFFFF"/><rect x="-44" y="-124" width="88" height="18" rx="6" fill="#F0ECE4"/>
      <circle cx="-20" cy="-74" r="7" fill="#3A2E24"/><circle cx="20" cy="-74" r="7" fill="#3A2E24"/>${kerut}<path d="M-12 -52 Q0 -42 12 -52" stroke="#3A2E24" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g transform="rotate(${f1(-50 + cincang * 70)} 50 -60)"><path d="M50 -60 L98 -78" stroke="#FFF8EC" stroke-width="22" stroke-linecap="round"/><path d="M96 -80 L150 -96 L148 -70 L100 -66Z" fill="#C9D3DC"/><rect x="84" y="-86" width="20" height="16" rx="4" fill="#7A5A38"/></g></g>`;
  }
  // tetes zat belerang (kuning bercahaya) → bila k>0 jadi kepulan gas hijau
  function tetesBelerang(x, y, s, t = 0, k = 0) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})"><circle r="${f1(30 * (1 - k * 0.6))}" fill="#FFE04A" opacity="${f2(1 - k)}"/><circle r="${f1(48 * (1 - k * 0.6))}" fill="#FFE04A" opacity="${f2(0.25 * (1 - k))}"/>
      ${k > 0 ? [0, 1, 2].map((i) => `<circle cx="${f1(Math.cos(i * 2.1 + t) * 30 * k)}" cy="${f1(-k * 60 - i * 14)}" r="${f1(16 + k * 22)}" fill="${i % 2 ? BAU.a : BAU.b}" opacity="${f2((1 - k) * 0.6 + 0.2)}"/>`).join("") : ""}</g>`;
  }
  // taman pastel (sisi "surga")
  function tamanPastel(w, h, t = 0, o = {}) {
    const r = acak(o.benih || 41), g = uid("tp");
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBD9E4"/><stop offset="1" stop-color="#FFF1D6"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#${g})"/>
      <path d="M-50 1180 Q${w * 0.3} 1080 ${w + 50} 1160 V${h} H-50Z" fill="#BFE3C0"/><path d="M-50 1320 Q${w * 0.5} 1250 ${w + 50} 1330 V${h} H-50Z" fill="#A6D6A9"/>`;
    for (let i = 0; i < 14; i++) { const fx = r() * w, fy = 1200 + r() * 600, c = ["#F59CB8", "#FFD36E", "#C9A7F2", "#FFFFFF"][i % 4];
      s += `<g transform="translate(${f1(fx)} ${f1(fy)})"><path d="M0 0 L0 60" stroke="#7FBF7F" stroke-width="6"/>${[0, 1, 2, 3, 4].map((j) => `<circle cx="${f1(Math.cos(j * 1.256) * 18)}" cy="${f1(Math.sin(j * 1.256) * 18)}" r="14" fill="${c}"/>`).join("")}<circle r="10" fill="#FFE9A0"/></g>`; }
    for (let i = 0; i < 22; i++) { const kx = r() * w, ky = 300 + r() * 900, k = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.9);
      s += `<path d="M${f1(kx)} ${f1(ky - 14 * k)} L${f1(kx + 4)} ${f1(ky - 4)} L${f1(kx + 14 * k)} ${f1(ky)} L${f1(kx + 4)} ${f1(ky + 4)} L${f1(kx)} ${f1(ky + 14 * k)} L${f1(kx - 4)} ${f1(ky + 4)} L${f1(kx - 14 * k)} ${f1(ky)} L${f1(kx - 4)} ${f1(ky - 4)}Z" fill="#FFFFFF" opacity="${f2(0.4 + 0.5 * k)}"/>`; }
    return s;
  }
  // selokan/got (sisi "bau") dengan lalat beterbangan
  function got(w, h, t = 0, o = {}) {
    const r = acak(o.benih || 43), g = uid("gt");
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E7468"/><stop offset="1" stop-color="#4C5248"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#${g})"/>
      <rect x="0" y="1080" width="${w}" height="120" fill="#8A8C80"/>${[...Array(8)].map((_, i) => `<rect x="${i * 150}" y="1080" width="146" height="60" fill="#9A9C90"/>`).join("")}
      <rect x="0" y="1200" width="${w}" height="${h - 1200}" fill="#4B5A44"/><path d="M0 1260 Q${w * 0.25} ${1240 + Math.sin(t) * 8} ${w * 0.5} 1262 T${w} 1258 V${h} H0Z" fill="#5E6E46"/>`;
    for (let i = 0; i < 8; i++) { const bx = r() * w, by = 1300 + r() * 500, u = ((t * 0.5 + r()) % 1); s += `<circle cx="${f1(bx)}" cy="${f1(by - u * 40)}" r="${f1(6 + u * 10)}" fill="none" stroke="#8C9A68" stroke-width="3" opacity="${f2(1 - u)}"/>`; }
    for (let i = 0; i < 9; i++) { const cx = r() * w, cy = 700 + r() * 500, fx = cx + Math.sin(t * (3 + r() * 2) + i) * 60, fy = cy + Math.cos(t * (4 + r() * 2) + i * 2) * 40, sy = Math.sin(t * 60 + i) * 6;
      s += `<g transform="translate(${f1(fx)} ${f1(fy)})"><ellipse rx="9" ry="7" fill="#2A2E2A"/><ellipse cx="-6" cy="${f1(-8 - sy)}" rx="9" ry="5" fill="#D9E2E2" opacity=".7"/><ellipse cx="6" cy="${f1(-8 + sy)}" rx="9" ry="5" fill="#D9E2E2" opacity=".7"/></g>`; }
    return s;
  }
  // hutan hujan malam: batang tinggi, pakis, durian jatuh terbelah bercahaya
  function pakis(x, y, s, P, t = 0, o = {}) {
    const g = Math.sin(t * 1.1 + x * 0.02) * 3, warna = o.warna || P.daun, warnaB = o.warnaB || P.daunB; let d = "";
    for (let i = 0; i < 7; i++) { const a = -150 + i * 20 + g, L = 220 - Math.abs(i - 3) * 22;
      d += `<g transform="rotate(${f1(a + 90)})"><path d="M0 0 Q${f1(L * 0.5)} -30 ${L} 0" stroke="${i % 2 ? warna : warnaB}" stroke-width="10" fill="none" stroke-linecap="round"/>${[...Array(7)].map((_, j) => `<ellipse cx="${f1(26 + j * (L - 30) / 7)}" cy="${f1(-12 - Math.sin((j / 7) * Math.PI) * 14)}" rx="18" ry="7" transform="rotate(-30 ${f1(26 + j * (L - 30) / 7)} ${f1(-12 - Math.sin((j / 7) * Math.PI) * 14)})" fill="${i % 2 ? warna : warnaB}"/>`).join("")}</g>`; }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${d}</g>`;
  }
  function mataGelap(x, y, s, t = 0, k = 1, o = {}) {
    if (k <= 0) return ""; const kd = (o.benih || 1) * 1.37, buka = Math.abs(Math.cos(Math.max(0, Math.sin(t * 0.9 + kd) - 0.96) * 40)), c = o.warna || "#F6E27A";
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})" opacity="${f2(k)}"><ellipse cx="-24" cy="0" rx="14" ry="${f1(10 * buka)}" fill="${c}"/><ellipse cx="24" cy="0" rx="14" ry="${f1(10 * buka)}" fill="${c}"/><circle cx="0" cy="0" r="70" fill="${c}" opacity=".06"/></g>`;
  }
  function hutanMalam(w, h, P, t = 0, o = {}) {
    const r = acak(o.benih || 51); let s = `<rect width="${w}" height="${h}" fill="${P.langit[0]}"/>`;
    for (let i = 0; i < 9; i++) { const bx = r() * w, bw = 50 + r() * 70; s += `<rect x="${f1(bx)}" y="0" width="${f1(bw)}" height="${h}" fill="${P.jauh}" opacity=".7"/>`; }
    s += `<path d="M-50 ${h * 0.25} Q${w * 0.5} ${h * 0.1} ${w + 50} ${h * 0.22} V0 H-50Z" fill="${P.daunB}" opacity=".8"/>`;
    for (let i = 0; i < 5; i++) { const bx = r() * w, bw = 90 + r() * 80; s += `<rect x="${f1(bx)}" y="0" width="${f1(bw)}" height="${h}" fill="${P.tengah}"/><rect x="${f1(bx + bw * 0.6)}" y="0" width="${f1(bw * 0.4)}" height="${h}" fill="${P.dekat}" opacity=".6"/>`; }
    s += A.kabut(w, h * 0.55, 300, P) + `<path d="M-50 ${h * 0.66} Q${w * 0.4} ${h * 0.62} ${w + 50} ${h * 0.67} V${h} H-50Z" fill="${P.tanah}"/><path d="M-50 ${h * 0.75} Q${w * 0.6} ${h * 0.71} ${w + 50} ${h * 0.76} V${h} H-50Z" fill="${P.tanahB}"/>`;
    return s;
  }
  // pohon keluarga (filogeni sederhana) yang tumbuh: k 0..1. Cabang kiri → kakao, garpu kanan → durian & kapas (paling dekat).
  function pohonKeluarga(x, y, s, P, t = 0, k = 1, o = {}) {
    const batang = P.batang, tumbuh = (a, b) => cl((k - a) / (b - a)), gr = (d, kk, lebar) => kk <= 0 ? "" : `<path d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${f2(1 - kk)}" stroke="${batang}" stroke-width="${lebar}" stroke-linecap="round" fill="none"/>`;
    const k0 = tumbuh(0, 0.3), k1 = tumbuh(0.25, 0.55), k2 = tumbuh(0.45, 0.75), k3 = tumbuh(0.6, 0.9);
    let s2 = `<ellipse cx="0" cy="10" rx="260" ry="30" fill="${P.bayang}"/>` + gr("M0 0 C0 -120 -10 -240 0 -360", k0, 70) + gr("M0 -340 C-60 -420 -200 -470 -300 -600", k1, 44) + gr("M0 -340 C40 -440 130 -500 170 -560", k1, 44)
      + gr("M170 -560 C130 -640 70 -700 20 -800", k2, 30) + gr("M170 -560 C230 -650 300 -700 340 -800", k2, 30);
    const daun = (cx, cy, rr, kk) => kk <= 0 ? "" : `<g transform="translate(${cx} ${cy}) scale(${f2(kk)})"><circle cx="-40" cy="10" r="${rr * 0.7}" fill="${P.daunB}"/><circle cx="40" cy="0" r="${rr * 0.75}" fill="${P.daunB}"/><circle cx="0" cy="-30" r="${rr}" fill="${P.daun}"/></g>`;
    s2 += daun(-300, -640, 110, k3) + daun(20, -850, 100, k3) + daun(340, -850, 100, k3);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${s2}</g>`;
  }
  function buahKakao(x, y, s, P, o = {}) {
    const isi = `<g transform="rotate(${o.putar ?? 20})"><path d="M0 -150 C70 -130 90 -20 70 60 C50 130 20 160 0 165 C-20 160 -50 130 -70 60 C-90 -20 -70 -130 0 -150Z" fill="#D9822B"/><path d="M0 -150 C40 -130 50 -20 40 60 C30 130 14 160 0 165 C30 140 70 90 70 20 C70 -70 40 -130 0 -150Z" fill="#B45F1E"/>
      ${[-44, -16, 14, 42].map((dx) => `<path d="M${dx} -128 Q${dx * 1.35} 0 ${dx * 0.6} 150" stroke="#B45F1E" stroke-width="6" fill="none" opacity=".7"/>`).join("")}<path d="M0 -150 L0 -190" stroke="#6E4A2A" stroke-width="12" stroke-linecap="round"/><ellipse cx="-30" cy="-70" rx="16" ry="34" fill="#F2A64A" opacity=".55"/></g>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${bungkus(P, isi)}</g>`;
  }
  function kapasMekar(x, y, s, P, o = {}) {
    const isi = `<path d="M-90 40 Q-60 110 0 110 Q60 110 90 40 Q40 70 0 60 Q-40 70 -90 40Z" fill="#7A5A3A"/><path d="M0 60 L-30 120 M0 60 L30 120" stroke="#5E4430" stroke-width="10" stroke-linecap="round"/>
      <circle cx="-50" cy="0" r="62" fill="#F7F5EE"/><circle cx="50" cy="0" r="62" fill="#F7F5EE"/><circle cx="0" cy="-40" r="66" fill="#FFFFFF"/><circle cx="0" cy="30" r="56" fill="#EDEAE0"/><circle cx="-20" cy="-60" r="22" fill="#FFFFFF"/><path d="M0 110 L0 160" stroke="#6E4A2A" stroke-width="12" stroke-linecap="round"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${bungkus(P, isi)}</g>`;
  }
  // gelas cokelat panas & kaus katun terlipat (benda meja penutup)
  function mugKakao(x, y, s, P, t = 0) {
    const isi = `<ellipse cx="0" cy="4" rx="80" ry="12" fill="${P.bayang}"/><path d="M-60 -130 L60 -130 L52 0 L-52 0Z" fill="#E9E2D2"/><path d="M60 -100 Q110 -96 104 -56 Q98 -24 56 -30" stroke="#E9E2D2" stroke-width="16" fill="none"/><ellipse cx="0" cy="-130" rx="60" ry="14" fill="#6B3E22"/><path d="M20 -130 L52 0 L-0 0Z" fill="#D3CBB8" opacity=".6"/>`;
    const uap = [0, 1, 2].map((i) => { const u = ((t * 0.4 + i / 3) % 1); return `<path d="M${-24 + i * 24} ${f1(-150 - u * 120)} q-14 -30 0 -60 q14 -30 0 -60" stroke="#FFF4DC" stroke-width="8" fill="none" stroke-linecap="round" opacity="${f2(Math.sin(Math.PI * u) * 0.5)}"/>`; }).join("");
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${bungkus(P, isi)}${uap}</g>`;
  }
  function kausLipat(x, y, s, P, o = {}) {
    const c = o.warna || "#5C8FC9", cg = o.warnaG || "#4A79AE";
    const isi = `<ellipse cx="0" cy="4" rx="150" ry="14" fill="${P.bayang}"/><rect x="-140" y="-70" width="280" height="70" rx="12" fill="${cg}"/><rect x="-140" y="-90" width="280" height="64" rx="12" fill="${c}"/><path d="M-40 -90 Q0 -60 40 -90" stroke="${cg}" stroke-width="10" fill="none"/><path d="M-130 -60 L130 -60" stroke="${cg}" stroke-width="4" opacity=".6"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${bungkus(P, isi)}</g>`;
  }
  // pohon durian (batang tinggi + buah menggantung di dahan)
  function pohonDurian(x, y, s, P, t = 0) {
    const g = Math.sin(t * 0.8) * 2;
    let s2 = `<path d="M-50 0 L-34 -1300 L34 -1300 L50 0Z" fill="${P.batang}"/><path d="M10 0 L14 -1300 L34 -1300 L50 0Z" fill="#000" opacity=".12"/><path d="M-30 -900 Q-200 -960 -360 -940 M30 -1100 Q220 -1160 380 -1120 M-20 -1250 Q-180 -1320 -300 -1300" stroke="${P.batang}" stroke-width="30" stroke-linecap="round" fill="none"/>`;
    s2 += `<g transform="rotate(${f2(g)} 0 -1300)"><circle cx="-260" cy="-1360" r="200" fill="${P.daunB}"/><circle cx="240" cy="-1300" r="220" fill="${P.daunB}"/><circle cx="0" cy="-1460" r="240" fill="${P.daun}"/></g>`;
    for (const [dx, dy] of [[-260, -900], [-140, -930], [260, -1090], [150, -1110]]) s2 += `<path d="M${dx} ${dy - 40} L${dx} ${dy}" stroke="${P.batang}" stroke-width="6"/>` + durian(dx, dy + 50, 0.32, P, { goyang: Math.sin(t + dx) * 5, benih: Math.abs(dx) % 9 + 1 });
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s)})">${s2}</g>`;
  }
  // gua daging durian (latar "dunia di dalam durian"), matang 0..1 menguatkan kuning
  function dalamDurian(w, h, t = 0, o = {}) {
    const m = cl(o.matang ?? 1), g = uid("dd"), atas = m > 0.5 ? "#F9DE7C" : "#F2E6B0", bawah = m > 0.5 ? "#E8B847" : "#DCCB8C", r = acak(o.benih || 61);
    let s = `<defs><radialGradient id="${g}" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="${atas}"/><stop offset="1" stop-color="${bawah}"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#${g})"/>`;
    for (let i = 0; i < 14; i++) { const x0 = r() * w, sw = 30 + r() * 60; s += `<path d="M${f1(x0)} -20 Q${f1(x0 + (r() - 0.5) * 300)} ${h * 0.4} ${f1(x0 + (r() - 0.5) * 200)} ${h * 0.75}" stroke="#FFF2B8" stroke-width="${f1(sw)}" fill="none" opacity=".18" stroke-linecap="round"/>`; }
    s += `<path d="M-50 ${h * 0.66} Q${w * 0.3} ${h * 0.6} ${w * 0.6} ${h * 0.65} T${w + 50} ${h * 0.64} V${h} H-50Z" fill="#E9B94A"/><path d="M-50 ${h * 0.76} Q${w * 0.4} ${h * 0.72} ${w + 50} ${h * 0.77} V${h} H-50Z" fill="#D9A43C"/>`;
    for (let i = 0; i < 20; i++) { const px = r() * w, py = h * 0.68 + r() * h * 0.3; s += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(30 + r() * 50)}" ry="${f1(8 + r() * 10)}" fill="#FFF0A8" opacity=".3"/>`; }
    return s;
  }

  Object.assign(A, { DUR, BAU, durian, durianBelah, asapBau, cerobongMini, gelombangBau, lapakDurian, kabinPesawat, kursiPesawat, keranjangDurian, labGenetika, mesinSekuensing, ilmuwan,
    selTumbuhan, untaiDNA, kokiBlob, tetesBelerang, tamanPastel, got, pakis, mataGelap, hutanMalam, pohonKeluarga, buahKakao, kapasMekar, mugKakao, kausLipat, pohonDurian, dalamDurian });
})(typeof window !== "undefined" ? window : globalThis);

/* ===== PERLUASAN: SET BELANJA & HARGA (Yoga, 15 Nov 2026, video I-015) =====
 * Semua angka harga/odometer ditulis kode (<text>), bukan gambar → selalu rapi. Tanpa logo/merek toko asli.
 */
(function (root) {
  const A = (typeof module !== "undefined" && module.exports && module.exports.PALET) ? module.exports : root.ASET;
  let _n = 0; const uid = (p) => `${p}y${++_n}`;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const PRODUK = ["#E8604C", "#4E8FE0", "#F2B33D", "#5FB37A", "#C46FD1", "#F28C38", "#57B9C8", "#E7E2D6"];
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f2(rot)}) scale(${f2(s)})">${isi}</g>`;

  // rak minimarket berisi produk warna-warni tanpa tulisan. o: {benih, tingkat}
  function rakMinimarket(x, y, w, h, P, o = {}) {
    const r = acak(o.benih || 3), tk = o.tingkat || 5, rk = P.nama === "malam" ? "#8C97A6" : "#D7DEE4", rkG = P.nama === "malam" ? "#6F7A88" : "#B9C3CC";
    let s = `<rect x="0" y="0" width="${w}" height="${h}" rx="8" fill="${rkG}"/><rect x="12" y="0" width="${w - 24}" height="${h}" fill="${P.nama === "malam" ? "#4E5868" : "#EEF2F4"}"/>`;
    for (let i = 0; i < tk; i++) { const yy = ((i + 1) * h) / tk; let xx = 20;
      while (xx < w - 40) { const bw = 34 + r() * 40, bh = h / tk * (0.5 + r() * 0.35), c = PRODUK[Math.floor(r() * PRODUK.length)], botol = r() < 0.3;
        s += botol ? `<rect x="${f1(xx + bw * 0.3)}" y="${f1(yy - 14 - bh - 14)}" width="${f1(bw * 0.4)}" height="18" rx="5" fill="${c}"/><rect x="${f1(xx)}" y="${f1(yy - 14 - bh)}" width="${f1(bw)}" height="${f1(bh)}" rx="${f1(bw * 0.3)}" fill="${c}"/>`
          : `<rect x="${f1(xx)}" y="${f1(yy - 14 - bh)}" width="${f1(bw)}" height="${f1(bh)}" rx="4" fill="${c}"/><rect x="${f1(xx + 6)}" y="${f1(yy - 14 - bh * 0.65)}" width="${f1(bw - 12)}" height="${f1(bh * 0.25)}" rx="3" fill="#FFFFFF" opacity=".5"/>`;
        xx += bw + 8; }
      s += `<rect x="0" y="${f1(yy - 14)}" width="${w}" height="16" fill="${rk}"/><rect x="0" y="${f1(yy + 2)}" width="${w}" height="6" fill="#000" opacity=".1"/>`; }
    return g(x, y, 1, s);
  }
  // label harga (kode menulis angka). o: {rp (tampil "Rp" kecil), redupKanan 0..1 (digit setelah ribuan diredupkan, tetap terbaca), warna, kiriBesar, putar, tali}
  function labelHarga(x, y, s, teks, o = {}) {
    const lebar = o.lebar || 420, tinggi = o.tinggi || 200, bg = o.warna || "#FFE45C", tinta = o.tinta || "#1E1E1E", aks = o.aksen || "#E8463C";
    const pisah = teks.indexOf("."), kiri = pisah > 0 ? teks.slice(0, pisah) : teks, kanan = pisah > 0 ? teks.slice(pisah) : "";
    const rd = cl(o.redupKanan || 0), kb = o.kiriBesar || 0, uk = o.ukuran || 104;
    const tali = o.tali ? `<path d="M0 ${-tinggi / 2 - o.tali} L0 ${-tinggi / 2 + 6}" stroke="#5A5A5A" stroke-width="4"/><circle cx="0" cy="${-tinggi / 2 + 14}" r="9" fill="#FFFFFF" stroke="#5A5A5A" stroke-width="3"/>` : "";
    const isi = `${tali}<rect x="${-lebar / 2 + 8}" y="${-tinggi / 2 + 10}" width="${lebar}" height="${tinggi}" rx="22" fill="#000" opacity=".18"/><rect x="${-lebar / 2}" y="${-tinggi / 2}" width="${lebar}" height="${tinggi}" rx="22" fill="${bg}"/>
      <rect x="${-lebar / 2}" y="${-tinggi / 2}" width="${lebar}" height="${tinggi * 0.2}" rx="12" fill="${aks}"/><rect x="${-lebar / 2}" y="${-tinggi / 2 + tinggi * 0.12}" width="${lebar}" height="${tinggi * 0.08}" fill="${aks}"/>${o.tali ? `<circle cx="0" cy="${-tinggi / 2 + 14}" r="9" fill="#FFFFFF"/>` : ""}
      <text x="0" y="${f1(tinggi * 0.33)}" text-anchor="middle" font-family="Poppins" font-weight="700" fill="${tinta}" letter-spacing="-2"><tspan font-size="${f1(uk * 0.42)}" dy="${f1(-uk * 0.42)}">${o.rp === false ? "" : "Rp"}</tspan><tspan font-size="${f1(uk * (1 + kb * 0.25))}" dy="${f1(uk * 0.42)}">${kiri}</tspan><tspan font-size="${f1(uk * (1 - rd * 0.22))}" fill-opacity="${f2(1 - rd * 0.45)}">${kanan}</tspan></text>`;
    return g(x, y, s, isi, o.putar || 0);
  }
  // kaca pembesar. o: {isi: svg di dalam lensa (sudah diperbesar), r}
  function kacaPembesar(x, y, s, o = {}) {
    const r = o.r || 150, id = uid("kp");
    return g(x, y, s, `<defs><clipPath id="${id}"><circle r="${r}"/></clipPath></defs><path d="M${r * 0.68} ${r * 0.68} L${r * 1.6} ${r * 1.6}" stroke="#5B3A22" stroke-width="${r * 0.26}" stroke-linecap="round"/><path d="M${r * 0.7} ${r * 0.7} L${r * 0.95} ${r * 0.95}" stroke="#B9BEC6" stroke-width="${r * 0.3}"/>
      <circle r="${r}" fill="#DCEFF4" opacity=".35"/><g clip-path="url(#${id})">${o.isi || ""}</g><circle r="${r}" fill="none" stroke="#C9CED6" stroke-width="${r * 0.13}"/><circle r="${r}" fill="none" stroke="#9CA3AE" stroke-width="${r * 0.04}"/>
      <path d="M${-r * 0.55} ${-r * 0.35} A${r * 0.66} ${r * 0.66} 0 0 1 ${-r * 0.2} ${-r * 0.62}" stroke="#FFFFFF" stroke-width="${r * 0.08}" fill="none" stroke-linecap="round" opacity=".8"/>`, o.putar || 0);
  }
  // koin berputar (lebar mengikuti cos) — t dalam detik
  function koin(x, y, s, t = 0, o = {}) {
    const sp = Math.cos(t * (o.laju || 9)), w = Math.max(0.08, Math.abs(sp)), muka = sp > 0;
    return g(x, y, s, `<ellipse cx="0" cy="${130}" rx="${f1(90 * (0.6 + w * 0.4))}" ry="14" fill="#000" opacity=".18"/><ellipse rx="${f1(110 * w)}" ry="110" fill="#B8862E"/><ellipse rx="${f1(98 * w)}" ry="98" fill="${muka ? "#F0C24E" : "#E2B13F"}"/>
      <ellipse rx="${f1(70 * w)}" ry="70" fill="none" stroke="#C99A35" stroke-width="8"/>${w > 0.45 ? `<text y="22" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="62" fill="#A97A24" transform="scale(${f2(w)} 1)">100</text>` : ""}`);
  }
  // meja kasir (tampak depan-atas) + mesin kasir sederhana tanpa tulisan
  function mejaKasir(w, y, P, t = 0, o = {}) {
    const gl = P.nama === "malam", atas = gl ? "#6E7C8C" : "#E4E9EC", dpn = gl ? "#4E5A68" : "#C3CCD3";
    return `<rect x="-20" y="${y}" width="${w + 40}" height="40" fill="${atas}"/><rect x="-20" y="${y + 40}" width="${w + 40}" height="900" fill="${dpn}"/><rect x="-20" y="${y + 40}" width="${w + 40}" height="16" fill="#000" opacity=".1"/>
      ${o.mesin === false ? "" : `<g transform="translate(${o.mx ?? w * 0.78} ${y})"><rect x="-120" y="-150" width="240" height="150" rx="16" fill="#3B4656"/><rect x="-96" y="-260" width="150" height="100" rx="10" fill="#2A3340"/><rect x="-84" y="-248" width="126" height="76" rx="6" fill="#7FD4A8" opacity="${f2(0.7 + 0.2 * Math.sin(t * 3))}"/>${[0, 1, 2].map((i) => [0, 1, 2].map((j) => `<rect x="${-100 + i * 50}" y="${-130 + j * 40}" width="40" height="30" rx="6" fill="#5C6878"/>`).join("")).join("")}</g>`}`;
  }
  // ban berjalan (sabuk bergerak ke kanan) + keranjang biru kecil / oranye besar
  function banBerjalan(x0, x1, y, t = 0, o = {}) {
    let s = `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="46" rx="23" fill="#4A5566"/><rect x="${x0}" y="${y + 46}" width="${x1 - x0}" height="70" fill="#3A4452"/>`;
    for (let i = 0; i < (x1 - x0) / 60 + 1; i++) { const xx = x0 + ((i * 60 + t * 140) % (x1 - x0)); s += `<rect x="${f1(xx)}" y="${y + 6}" width="8" height="34" rx="4" fill="#606C7E"/>`; }
    for (const xx of [x0 + 40, (x0 + x1) / 2, x1 - 40]) s += `<circle cx="${xx}" cy="${y + 23}" r="30" fill="#5E6A7C"/><circle cx="${xx}" cy="${y + 23}" r="10" fill="#2E3644"/>`;
    return s;
  }
  function keranjang(x, y, s, warna, o = {}) {
    const gw = o.warnaG || "#000";
    let gar = ""; for (let i = 1; i < 6; i++) gar += `<rect x="${-150 + i * 50 - 6}" y="-110" width="12" height="96" rx="6" fill="${gw}" opacity=".18"/>`;
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="170" ry="16" fill="#000" opacity=".15"/><path d="M-170 -150 L170 -150 L140 0 L-140 0Z" fill="${warna}"/>${gar}<rect x="-182" y="-170" width="364" height="34" rx="14" fill="${warna}"/><rect x="-182" y="-170" width="364" height="12" rx="6" fill="#FFFFFF" opacity=".25"/>`);
  }
  function lenganRobot(xBase, yBase, xT, yT, o = {}) {
    const mx = (xBase + xT) / 2 + (o.tekuk || 60), my = Math.min(yBase, yT) - 80;
    return `<path d="M${xBase} ${yBase} L${f1(mx)} ${f1(my)} L${f1(xT)} ${f1(yT)}" stroke="#F2A33C" stroke-width="34" fill="none" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${f1(mx)}" cy="${f1(my)}" r="24" fill="#3B4656"/><circle cx="${xBase}" cy="${yBase}" r="34" fill="#3B4656"/>
      <path d="M${f1(xT - 34)} ${f1(yT + 10)} L${f1(xT - 30)} ${f1(yT + 50)} M${f1(xT + 34)} ${f1(yT + 10)} L${f1(xT + 30)} ${f1(yT + 50)}" stroke="#3B4656" stroke-width="14" stroke-linecap="round"/><rect x="${f1(xT - 44)}" y="${f1(yT - 14)}" width="88" height="30" rx="12" fill="#3B4656"/>`;
  }
  // ruang sortir di dalam kepala (dinding merah muda lembut + pipa)
  function ruangSortir(w, h, t = 0) {
    const id = uid("rs");
    let s = `<defs><radialGradient id="${id}" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#F6D7DA"/><stop offset="1" stop-color="#E3B5BD"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M${-50 + i * 260} 0 Q${80 + i * 250} ${300 + 40 * Math.sin(t + i)} ${-20 + i * 270} 700" stroke="#EFC6CC" stroke-width="60" fill="none" stroke-linecap="round" opacity=".7"/>`;
    s += `<rect x="0" y="${h * 0.66}" width="${w}" height="${h * 0.34}" fill="#C99AA3"/><rect x="0" y="${h * 0.66}" width="${w}" height="14" fill="#B58690"/>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${60 + i * 300}" y="140" width="34" height="${h * 0.5}" rx="17" fill="#D9A9B1"/>`;
    return s;
  }
  // HP raksasa (tegak) dengan layar aplikasi belanja: grid kartu produk kosong
  function hpRaksasa(x, y, s, t = 0, o = {}) {
    const W = 760, H = 1300; let kartu = "";
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const kx = -W / 2 + 70 + j * 320, ky = -H / 2 + 230 + i * 300;
      kartu += `<rect x="${kx}" y="${ky}" width="290" height="270" rx="20" fill="#FFFFFF"/><rect x="${kx + 20}" y="${ky + 20}" width="250" height="150" rx="14" fill="${PRODUK[(i * 2 + j) % PRODUK.length]}" opacity=".55"/><rect x="${kx + 20}" y="${ky + 190}" width="170" height="18" rx="9" fill="#D9DEE4"/><rect x="${kx + 20}" y="${ky + 222}" width="110" height="22" rx="11" fill="#F2A33C" opacity=".7"/>`; }
    return g(x, y, s, `<rect x="${-W / 2 - 30 + 14}" y="${-H / 2 - 30 + 20}" width="${W + 60}" height="${H + 60}" rx="90" fill="#000" opacity=".2"/><rect x="${-W / 2 - 30}" y="${-H / 2 - 30}" width="${W + 60}" height="${H + 60}" rx="90" fill="#2B3240"/>
      <rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" rx="64" fill="#F3F5F8"/><rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="150" rx="64" fill="#F28C38"/><rect x="${-W / 2}" y="${-H / 2 + 90}" width="${W}" height="60" fill="#F28C38"/>
      <rect x="${-W / 2 + 40}" y="${-H / 2 + 60}" width="${W - 80}" height="56" rx="28" fill="#FFFFFF" opacity=".9"/><rect x="-60" y="${-H / 2 - 14}" width="120" height="16" rx="8" fill="#1C222C"/>${kartu}`);
  }
  // mobil sedan sederhana tampak samping. o: {warna, arah}
  function mobil(x, y, s, P, o = {}) {
    const c = o.warna || "#D9534F", cg = o.warnaG || "#B33F3B", kaca = P.nama === "malam" ? "#3A4E6A" : P.nama === "senja" ? "#F4CFA6" : "#BFE0EA";
    const r = A.redup(P);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s * (o.arah || 1))} ${f2(s)})"><defs>${r.defs}</defs><g filter="url(#${r.id})"><ellipse cx="0" cy="8" rx="230" ry="18" fill="${P.bayang}"/>
      <path d="M-220 -40 Q-224 -100 -170 -110 L-110 -114 L-60 -180 Q-40 -196 0 -196 L90 -196 Q120 -196 140 -170 L180 -116 L210 -110 Q236 -100 232 -40 L230 -20 L-220 -20Z" fill="${c}"/><path d="M-220 -60 L232 -60 L230 -20 L-220 -20Z" fill="${cg}"/>
      <path d="M-90 -120 L-48 -172 Q-38 -182 -20 -182 L20 -182 L20 -120Z" fill="${kaca}"/><path d="M36 -182 L86 -182 Q108 -182 122 -164 L160 -120 L36 -120Z" fill="${kaca}"/>
      <circle cx="-130" cy="-22" r="46" fill="#2D3138"/><circle cx="-130" cy="-22" r="20" fill="#AAB2BC"/><circle cx="140" cy="-22" r="46" fill="#2D3138"/><circle cx="140" cy="-22" r="20" fill="#AAB2BC"/><rect x="200" y="-96" width="26" height="16" rx="6" fill="#FFE7A6"/></g></g>`;
  }
  // panggung juru lelang (tanpa tulisan) + lampu sorot
  function panggungLelang(x, y, s, P, t = 0) {
    const kayu = P.nama === "senja" ? "#8A5B3C" : "#9C6B47";
    return g(x, y, s, `<ellipse cx="0" cy="8" rx="200" ry="18" fill="${P.bayang}"/><rect x="-170" y="-260" width="340" height="260" rx="10" fill="${kayu}"/><rect x="-170" y="-260" width="340" height="30" fill="#6E4A30"/><rect x="-190" y="-290" width="380" height="36" rx="8" fill="#6E4A30"/>
      <rect x="-120" y="-200" width="240" height="120" rx="10" fill="#E8463C"/><rect x="-100" y="-180" width="200" height="16" rx="8" fill="#FFFFFF" opacity=".5"/><path d="M60 -290 L60 -360 Q60 -380 80 -380" stroke="#3B4656" stroke-width="8" fill="none"/><circle cx="84" cy="-382" r="12" fill="#3B4656"/>`);
  }
  // odometer: angka bergulir mulus dari a ke b (k 0..1). Angka ditulis kode.
  function odometer(x, y, s, nilai, o = {}) {
    // nilai pecahan → tiap digit menggulir (gaya odometer mekanis)
    const n = o.digit || 5, w = 92, id = uid("od"); let d = "";
    for (let i = 0; i < n; i++) { const p = Math.pow(10, n - 1 - i), v = nilai / p, bawah = Math.floor(v) % 10, frac = i === n - 1 ? v % 1 : Math.max(0, (nilai % p) - (p - 1)) ;
      const geser = (i === n - 1 ? frac : frac) % 1, x0 = -n * w / 2 + i * w;
      d += `<g transform="translate(${x0 + w / 2} 0)"><text y="${f1(36 - geser * 110)}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="96" fill="#F4EEDC">${bawah}</text><text y="${f1(146 - geser * 110)}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="96" fill="#F4EEDC">${(bawah + 1) % 10}</text></g>`; }
    const sep = o.titik ?? 2;
    return g(x, y, s, `<defs><clipPath id="${id}"><rect x="${-n * w / 2}" y="-70" width="${n * w}" height="140" rx="16"/></clipPath></defs><rect x="${-n * w / 2 - 26}" y="-96" width="${n * w + 52}" height="192" rx="34" fill="#20262F"/><rect x="${-n * w / 2}" y="-70" width="${n * w}" height="140" rx="16" fill="#0F1318"/>
      <g clip-path="url(#${id})">${d}${[...Array(n - 1)].map((_, i) => `<rect x="${-n * w / 2 + (i + 1) * w - 2}" y="-70" width="4" height="140" fill="#2A313B"/>`).join("")}</g><rect x="${-n * w / 2}" y="-70" width="${n * w}" height="40" fill="#000" opacity=".25"/>
      ${sep ? `<circle cx="${-n * w / 2 + sep * w}" cy="50" r="7" fill="#F4EEDC"/>` : ""}<text x="${n * w / 2 + 50}" y="20" font-family="Poppins" font-weight="700" font-size="44" fill="#AEB7C2">${o.satuan || "mil"}</text>`);
  }
  // panel dasbor mobil (lingkaran speedometer + bingkai) untuk close-up odometer
  function dasbor(w, h, t = 0) {
    return `<rect width="${w}" height="${h}" fill="#2B313B"/><circle cx="${w / 2}" cy="${h * 0.5}" r="420" fill="#1C2129"/><circle cx="${w / 2}" cy="${h * 0.5}" r="400" fill="none" stroke="#3A424E" stroke-width="16"/>
      ${[...Array(13)].map((_, i) => { const a = Math.PI * (0.8 + i * 0.117); return `<path d="M${f1(w / 2 + Math.cos(a) * 330)} ${f1(h * 0.5 + Math.sin(a) * 330)} L${f1(w / 2 + Math.cos(a) * 380)} ${f1(h * 0.5 + Math.sin(a) * 380)}" stroke="#AEB7C2" stroke-width="10" stroke-linecap="round"/>`; }).join("")}
      <path d="M${w / 2} ${h * 0.5} L${f1(w / 2 + Math.cos(Math.PI * 1.3 + Math.sin(t) * 0.05) * 300)} ${f1(h * 0.5 + Math.sin(Math.PI * 1.3 + Math.sin(t) * 0.05) * 300)}" stroke="#E8463C" stroke-width="14" stroke-linecap="round"/><circle cx="${w / 2}" cy="${h * 0.5}" r="30" fill="#3A424E"/>`;
  }
  // panah harga turun (merah) — k 0..1 turun selangkah
  function panahTurun(x, y, s, k = 1) {
    return g(x, y + k * 120 * s, s, `<path d="M-60 -160 L60 -160 L60 0 L120 0 L0 130 L-120 0 L-60 0Z" fill="#E8463C"/><path d="M-60 -160 L0 -160 L0 130 L-120 0 L-60 0Z" fill="#C93A31"/>`);
  }
  // perpustakaan riset tinggi (rak buku berpanel kayu)
  function perpustakaan(w, h, t = 0, o = {}) {
    const r = acak(o.benih || 71); let s = `<rect width="${w}" height="${h}" fill="#5A3E2B"/>`;
    for (const x0 of [0, w - 300]) { s += `<rect x="${x0}" y="0" width="300" height="${h}" fill="#6E4A32"/>`;
      for (let yy = 80; yy < h; yy += 170) { let xx = x0 + 20; s += `<rect x="${x0}" y="${yy + 130}" width="300" height="20" fill="#4A3122"/>`;
        while (xx < x0 + 280) { const bw = 18 + r() * 22, bh = 90 + r() * 40; s += `<rect x="${f1(xx)}" y="${f1(yy + 130 - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="${["#A8483E", "#3F6E8C", "#C99A45", "#5B7F52", "#8A5A86"][Math.floor(r() * 5)]}"/>`; xx += bw + 3; } } }
    s += `<rect x="300" y="0" width="${w - 600}" height="${h}" fill="#4E3626"/><path d="M${w / 2} 0 L${w / 2 + 380} ${h} L${w / 2 - 380} ${h}Z" fill="#FFD38A" opacity=".08"/>`;
    return s;
  }
  // tumpukan kertas jurnal (n lembar, tinggi tumbuh k 0..1)
  function tumpukanJurnal(x, y, s, k = 1, o = {}) {
    const n = o.n || 69, tg = 14; let d = "";
    const m = Math.round(n * cl(k));
    for (let i = 0; i < m; i++) { const dx = Math.sin(i * 1.7) * 14, c = i % 3 === 0 ? "#F4EEDC" : i % 3 === 1 ? "#E9E1CC" : "#FFFFFF";
      d += `<rect x="${f1(-170 + dx)}" y="${-(i + 1) * tg}" width="340" height="${tg - 1}" rx="3" fill="${c}"/><rect x="${f1(-170 + dx)}" y="${-(i + 1) * tg + tg - 4}" width="340" height="3" fill="#C9BFA6"/>`; }
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="210" ry="20" fill="#000" opacity=".25"/>${d}`);
  }
  // timbangan kuningan. o: {miring (derajat), kiri: svg isi piring kiri, kanan: svg isi piring kanan}
  function timbangan(x, y, s, o = {}) {
    const m = (o.miring || 0) * Math.PI / 180, L = 300, xl = -L * Math.cos(m), yl = -L * Math.sin(m), xr = L * Math.cos(m), yr = L * Math.sin(m);
    const piring = (px, py, isi) => `<path d="M${f1(px)} ${f1(py)} L${f1(px - 110)} ${f1(py + 220)} M${f1(px)} ${f1(py)} L${f1(px + 110)} ${f1(py + 220)}" stroke="#B8862E" stroke-width="5"/><g transform="translate(${f1(px)} ${f1(py + 220)})">${isi || ""}<path d="M-150 0 Q0 60 150 0Z" fill="#D9A93F"/><path d="M-150 0 L150 0" stroke="#F0C866" stroke-width="8"/></g>`;
    return g(x, y, s, `<ellipse cx="0" cy="560" rx="200" ry="22" fill="#000" opacity=".2"/><path d="M-130 560 L130 560 L90 520 L-90 520Z" fill="#B8862E"/><rect x="-16" y="0" width="32" height="520" fill="#C99A35"/>
      <path d="M${f1(xl)} ${f1(yl)} L${f1(xr)} ${f1(yr)}" stroke="#D9A93F" stroke-width="24" stroke-linecap="round"/><circle r="30" fill="#F0C866"/><path d="M-10 -26 L10 -26 L0 -70Z" fill="#D9A93F"/>${piring(xl, yl, o.kiri)}${piring(xr, yr, o.kanan)}`);
  }
  function awanMerahMuda(x, y, s, t = 0) {
    const b = Math.sin(t * 2) * 6;
    return g(x, y + b, s, `<circle cx="-70" cy="-60" r="70" fill="#F7A8C4"/><circle cx="20" cy="-100" r="90" fill="#FBC3D6"/><circle cx="100" cy="-55" r="66" fill="#F7A8C4"/><rect x="-140" y="-70" width="300" height="70" rx="35" fill="#FBC3D6"/><circle cx="-10" cy="-120" r="30" fill="#FFFFFF" opacity=".5"/>`);
  }
  function kerikil(x, y, s) { return g(x, y, s, `<path d="M-26 0 Q-30 -26 -4 -30 Q24 -32 28 -10 Q30 4 0 4Z" fill="#7E7E76"/><path d="M-10 -22 Q4 -26 12 -18" stroke="#A9A9A0" stroke-width="5" fill="none" stroke-linecap="round"/>`); }
  // depan minimarket malam (tanpa logo): kanopi, pintu kaca, cahaya hangat tumpah ke trotoar
  function tokoMalam(w, h, P, t = 0, o = {}) {
    const id = uid("tm");
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1C9"/><stop offset="1" stop-color="#FFD38A"/></linearGradient></defs>
      <rect width="${w}" height="${h}" fill="${P.dinding}"/><rect x="0" y="0" width="${w}" height="${h * 0.24}" fill="${P.langit[0]}"/>
      <rect x="60" y="${h * 0.3}" width="${w - 120}" height="${h * 0.42}" fill="url(#${id})"/>`;
    s += `<g transform="translate(60 ${h * 0.3})">${rakMinimarket(80, 120, 360, 520, A.PALET.siang, { benih: 5 })}${rakMinimarket(w - 600, 120, 360, 520, A.PALET.siang, { benih: 8 })}</g>`;
    s += `<rect x="${w / 2 - 230}" y="${h * 0.34}" width="460" height="${h * 0.38}" fill="#FFF6DA" opacity=".35"/><rect x="${w / 2 - 6}" y="${h * 0.34}" width="12" height="${h * 0.38}" fill="#8C97A6"/><rect x="${w / 2 - 236}" y="${h * 0.34}" width="472" height="12" fill="#8C97A6"/>
      <rect x="40" y="${h * 0.24}" width="${w - 80}" height="${h * 0.06}" fill="#E8463C"/>${[...Array(12)].map((_, i) => `<path d="M${40 + i * (w - 80) / 12} ${h * 0.3} q${(w - 80) / 24} 40 ${(w - 80) / 12} 0" fill="${i % 2 ? "#E8463C" : "#F4EEDC"}"/>`).join("")}
      <rect x="0" y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="${P.jalan || "#3F4753"}"/><path d="M${w / 2 - 300} ${h * 0.72} L${w / 2 + 300} ${h * 0.72} L${w / 2 + 520} ${h} L${w / 2 - 520} ${h}Z" fill="#FFD38A" opacity=".18"/>`;
    return s;
  }
  function kantongBelanja(x, y, s) { return g(x, y, s, `<path d="M-60 -120 Q-60 -170 0 -170 Q60 -170 60 -120" stroke="#E7E2D6" stroke-width="12" fill="none"/><path d="M-90 -120 L90 -120 L80 40 L-80 40Z" fill="#F4EEDC"/><path d="M-90 -120 L-20 -120 L-30 40 L-80 40Z" fill="#E2DBC8"/><rect x="-40" y="-90" width="40" height="70" rx="6" fill="#F2B33D"/><rect x="10" y="-100" width="30" height="80" rx="10" fill="#5FB37A"/>`); }

  Object.assign(A, { PRODUK, rakMinimarket, labelHarga, kacaPembesar, koin, mejaKasir, banBerjalan, keranjang, lenganRobot, ruangSortir, hpRaksasa, mobil, panggungLelang, odometer, dasbor, panahTurun,
    perpustakaan, tumpukanJurnal, timbangan, awanMerahMuda, kerikil, tokoMalam, kantongBelanja });
})(typeof window !== "undefined" ? window : globalThis);

/* ===== Aset SEJARAH NAMA (Yoga, 17 Nov 2026, video I-004 asal nama Indonesia) =====
 * Meja tua + lilin, jurnal terbuka (kata ditulis kode, bisa "ditulis" pelan), pena bulu, stempel lilin, peta Nusantara datar
 * (tanpa batas negara), pelabuhan 1850 + kapal layar, siluet bertopi (tokoh sejarah TANPA wajah), gerobak jurnal, ruang peta,
 * halaman Yunani + kepingan puzzle, ruang kerja Victoria + papan easel, jendela kota kanal hujan, orang generik, aula 1928
 * (spanduk polos), tribun stadion malam. Semua teks di benda ditulis kode (<text>) supaya rapi.
 */
(function (root) {
  const A = (typeof module !== "undefined" && module.exports && module.exports.PALET) ? module.exports : root.ASET;
  let _n = 0; const uid = (p) => `${p}z${++_n}`;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f2(rot)}) scale(${f2(s)})">${isi}</g>`;
  const malam = (P) => P.nama === "malam";

  // lilin menyala + cahaya hangat berkedip. o: {glow (radius), padam 0..1}
  function lilin(x, y, s, t = 0, o = {}) {
    const id = uid("ll"), fl = 1 + 0.06 * Math.sin(t * 13) + 0.04 * Math.sin(t * 7.3 + 1), sw = Math.sin(t * 5.1) * 3;
    return g(x, y, s, `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#FFD98A" stop-opacity=".5"/><stop offset=".35" stop-color="#FFB85A" stop-opacity=".16"/><stop offset="1" stop-color="#FFB85A" stop-opacity="0"/></radialGradient></defs>
      <circle cx="0" cy="-200" r="${f1((o.glow || 560) * fl)}" fill="url(#${id})"/><ellipse cx="0" cy="8" rx="80" ry="16" fill="#000" opacity=".3"/>
      <ellipse cx="0" cy="0" rx="70" ry="18" fill="#8A6A3A"/><rect x="-70" y="-12" width="140" height="12" fill="#A5824A"/>
      <rect x="-30" y="-160" width="60" height="150" rx="6" fill="#F1E3C4"/><rect x="8" y="-160" width="22" height="150" fill="#DCC9A2"/><path d="M-30 -160 Q-22 -136 -25 -104 Q-17 -100 -13 -160Z" fill="#FBF1DC"/>
      <path d="M0 -160 L0 -178" stroke="#3A2A1A" stroke-width="4"/>
      <g transform="translate(0 -176) rotate(${f2(sw)}) scale(${f2(fl)})"><path d="M0 -72 Q24 -30 15 -6 Q8 6 0 6 Q-8 6 -15 -6 Q-24 -30 0 -72Z" fill="#FFB347"/><path d="M0 -46 Q11 -22 7 -6 Q4 2 0 2 Q-4 2 -7 -6 Q-11 -22 0 -46Z" fill="#FFF1B8"/></g>`);
  }
  // ruang kerja tua (dinding, rak buku buram kiri, jendela kanan, meja kayu). o: {meja (y permukaan), cx, cy (pusat cahaya), jendelaX, lampu}
  function ruangKerjaTua(w, h, P, t = 0, o = {}) {
    const id = uid("rk"), my = o.meja ?? h * 0.62, cx = o.cx ?? w / 2, cy = o.cy ?? my - 200, r = acak(o.benih || 31), m = malam(P);
    const dinding = m ? "#3A2A20" : P.nama === "senja" ? "#7A5A42" : "#B79A78", kayu = m ? "#5A3A22" : "#8A5A34";
    let s = `<defs><radialGradient id="${id}" cx="${f2(cx / w)}" cy="${f2(cy / h)}" r=".75"><stop offset="0" stop-color="#FFC877" stop-opacity="${m ? .42 : .25}"/><stop offset="1" stop-color="#000" stop-opacity="${m ? .55 : .15}"/></radialGradient></defs>
      <rect width="${w}" height="${h}" fill="${dinding}"/>`;
    // rak buku buram (kiri)
    s += `<g opacity=".8"><rect x="40" y="${my - 1100}" width="380" height="1100" fill="${m ? "#2E2018" : "#6A4A30"}"/>`;
    for (let yy = my - 1060; yy < my - 80; yy += 190) { let xx = 60; s += `<rect x="40" y="${yy + 150}" width="380" height="18" fill="${m ? "#24180F" : "#563A24"}"/>`;
      while (xx < 400) { const bw = 20 + r() * 26, bh = 100 + r() * 44; s += `<rect x="${f1(xx)}" y="${f1(yy + 150 - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="${["#7A3A30", "#2F4E66", "#8E6E30", "#3E5A3A", "#5E3E5A"][Math.floor(r() * 5)]}" opacity="${m ? .7 : .9}"/>`; xx += bw + 4; } }
    s += `</g>`;
    const jx = o.jendelaX ?? w - 420;
    if (jx !== null && jx !== false) {
      const lg = uid("jw");
      s += `<defs><linearGradient id="${lg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.langit[0]}"/><stop offset="1" stop-color="${P.langit[1]}"/></linearGradient></defs>
        <rect x="${jx - 20}" y="${my - 1040}" width="340" height="660" rx="10" fill="${kayu}"/><rect x="${jx}" y="${my - 1020}" width="300" height="620" fill="url(#${lg})"/>
        ${m ? `<circle cx="${jx + 200}" cy="${my - 900}" r="40" fill="${P.surya}" opacity=".9"/>` : `<circle cx="${jx + 210}" cy="${my - 880}" r="50" fill="${P.surya}" opacity=".8"/>`}
        <rect x="${jx + 144}" y="${my - 1020}" width="12" height="620" fill="${kayu}"/><rect x="${jx}" y="${my - 720}" width="300" height="12" fill="${kayu}"/>`;
    }
    s += `<rect x="0" y="${my}" width="${w}" height="${h - my}" fill="${kayu}"/><rect x="0" y="${my}" width="${w}" height="18" fill="${m ? "#7A5232" : "#A87648"}"/>`;
    for (let i = 0; i < 9; i++) s += `<path d="M0 ${f1(my + 60 + i * 70 + r() * 20)} Q${w * 0.4} ${f1(my + 40 + i * 70 + r() * 40)} ${w} ${f1(my + 70 + i * 70)}" stroke="#000" stroke-width="3" opacity=".12" fill="none"/>`;
    return s + `<rect width="${w}" height="${h}" fill="url(#${id})"/>`;
  }
  // jurnal terbuka. o: {kata, tulis 0..1 (kata muncul dari kiri), sinar 0..1, benih, ukuran}
  function jurnalTerbuka(x, y, s, o = {}) {
    const r = acak(o.benih || 7), id = uid("jr"), gd = uid("jg"), kata = o.kata || "", fs = o.ukuran || 68;
    let gar = "";
    for (const sx of [-1, 1]) for (let i = 0; i < 11; i++) { if (sx === 1 && kata && i >= 3 && i <= 5) continue; const w = 170 + r() * 120;
      gar += `<rect x="${sx < 0 ? -335 : 34}" y="${-200 + i * 38}" width="${f1(w)}" height="9" rx="4" fill="#8A6F4A" opacity=".42"/>`; }
    const sinar = cl(o.sinar || 0), tulis = cl(o.tulis ?? 1);
    const teks = kata ? `<defs><clipPath id="${id}"><rect x="20" y="-130" width="${f1(340 * tulis)}" height="140"/></clipPath></defs>
      ${sinar > 0 ? `<text x="40" y="-62" font-family="Lora,serif" font-style="italic" font-weight="600" font-size="${fs}" fill="#FFC93C" opacity="${f2(sinar * 0.9)}" style="filter:blur(10px)" clip-path="url(#${id})">${kata}</text>` : ""}
      <text x="40" y="-62" font-family="Lora,serif" font-style="italic" font-weight="600" font-size="${fs}" fill="${sinar > 0.5 ? "#6A3A0A" : "#3A2412"}" clip-path="url(#${id})">${kata}</text>` : "";
    return g(x, y, s, `<defs><linearGradient id="${gd}" x1="0" y1="0" x2="1" y2="0"><stop offset=".42" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity=".22"/><stop offset=".58" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
      <ellipse cx="0" cy="290" rx="420" ry="40" fill="#000" opacity=".3"/><path d="M0 -250 Q-190 -282 -392 -248 L-392 282 Q-190 254 0 286 Q190 254 392 282 L392 -248 Q190 -282 0 -250Z" fill="#5A2E1A"/>
      <path d="M0 -262 Q-180 -290 -370 -258 L-370 258 Q-180 232 0 262Z" fill="#EADBB8"/><path d="M0 -262 Q180 -290 370 -258 L370 258 Q180 232 0 262Z" fill="#F2E6C8"/>
      <rect x="-370" y="-290" width="740" height="580" fill="url(#${gd})"/>${gar}${teks}`);
  }
  // pena bulu: ujung pena di (x,y)
  function penaBulu(x, y, s, rot = 0) {
    return g(x, y, s, `<path d="M0 0 L10 -46" stroke="#2A1E14" stroke-width="8" stroke-linecap="round"/><path d="M8 -34 Q-60 -170 52 -380 Q86 -220 34 -44Z" fill="#F4EEDC"/><path d="M8 -34 Q-18 -180 52 -380" stroke="#C9BFA6" stroke-width="4" fill="none"/>
      <path d="M22 -130 L-20 -118 M28 -190 L-14 -188 M36 -250 L0 -258 M32 -120 L60 -140 M38 -190 L66 -212" stroke="#D9CFB8" stroke-width="3"/>`, rot);
  }
  // stempel lilin merah. o: {isi (teks), k 0..1 (menempel), kilau}
  function stempelLilin(x, y, s, o = {}) {
    let tetes = ""; for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; tetes += `<circle cx="${f1(Math.cos(a) * 92)}" cy="${f1(Math.sin(a) * 92)}" r="${18 + (i % 3) * 6}" fill="#B3262E"/>`; }
    return g(x, y, s, `<ellipse cx="6" cy="14" rx="110" ry="100" fill="#000" opacity=".25"/>${tetes}<circle r="100" fill="#B3262E"/><circle r="72" fill="#962028"/><circle r="72" fill="none" stroke="#D94A4E" stroke-width="6"/>
      <text y="${o.isi && o.isi.length > 2 ? 14 : 30}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${o.isi && o.isi.length > 2 ? 44 : 90}" fill="#E8767A">${o.isi || "?"}</text><path d="M-60 -50 Q-30 -80 10 -82" stroke="#E8767A" stroke-width="8" fill="none" stroke-linecap="round" opacity=".6"/>`);
  }
  // peta Nusantara datar (tanpa batas negara). Kotak ±1000×420, titik (0,0) kiri atas. o: {warna, sorot (0..1 garis bercahaya), tanpaLaut}
  const PULAU = [
    "M30 62 L84 52 L128 96 L176 148 L222 200 L262 252 L282 300 L262 312 L224 296 L180 244 L128 190 L78 132 L44 96Z", // Sumatra
    "M262 322 L320 322 L390 330 L452 336 L486 346 L480 360 L410 358 L344 352 L282 346 L258 336Z", // Jawa
    "M498 352 L516 348 L520 362 L500 364Z M530 354 L552 352 L554 366 L532 366Z M566 356 L612 352 L616 368 L570 370Z M626 360 L700 356 L704 372 L630 376Z", // Bali–Flores
    "M660 404 L736 380 L748 392 L676 418Z M600 392 L640 388 L644 400 L604 404Z", // Sumba, Timor
    "M346 126 L372 104 L404 98 L432 84 L456 70 L482 52 L500 60 L506 82 L526 98 L538 122 L530 148 L520 176 L512 204 L494 226 L470 252 L440 270 L410 280 L384 270 L366 248 L350 226 L344 196 L330 168 L334 144Z", // Kalimantan
    "M552 150 L566 128 L596 120 L632 112 L660 104 L670 116 L640 128 L606 138 L594 154 L600 166 L630 166 L656 176 L652 194 L622 190 L604 196 L614 222 L636 258 L634 284 L614 282 L598 246 L590 222 L584 244 L582 296 L558 300 L556 254 L552 206 L546 176Z", // Sulawesi
    "M716 140 L736 136 L732 172 L758 180 L752 196 L732 190 L728 236 L712 238 L716 196 L700 176 L716 168Z M690 250 L720 246 L722 262 L692 264Z M748 266 L800 262 L802 276 L752 280Z", // Maluku
    "M806 186 L846 172 L874 196 L906 202 L946 230 L982 262 L1004 296 L1004 340 L962 334 L922 306 L880 280 L846 258 L818 236 L798 216Z", // Papua
  ];
  function petaNusantara(x, y, s, o = {}) {
    const w = o.warna || "#7FA36A", sr = cl(o.sorot || 0);
    const pulau = PULAU.map((d) => `<path d="${d}" fill="${w}"/>`).join("");
    const garis = sr > 0 ? PULAU.map((d) => `<path d="${d}" fill="none" stroke="#FFE08A" stroke-width="${f1(6 / Math.max(0.3, s))}" opacity="${f2(sr)}" stroke-dasharray="1400" stroke-dashoffset="${f1(1400 * (1 - sr))}" stroke-linejoin="round"/>`).join("") : "";
    return g(x, y, s, `${o.bayang !== false ? `<g transform="translate(6 10)" opacity=".25">${PULAU.map((d) => `<path d="${d}" fill="#000"/>`).join("")}</g>` : ""}${pulau}${garis}`);
  }
  // kapal layar tiang tiga. o: {layar 0..1 (terkembang), arah 1|-1}
  function kapalLayar(x, y, s, P, t = 0, o = {}) {
    const bob = Math.sin(t * 1.3 + x * 0.01) * 6, rk = Math.sin(t * 1.1 + x) * 1.2, m = malam(P), ly = cl(o.layar ?? 1);
    const lambung = m ? "#3E2C24" : "#6A4630", sl = m ? "#B9B6A8" : P.nama === "senja" ? "#F2D9B8" : "#F4EEDC", slB = m ? "#9C9A8E" : P.nama === "senja" ? "#D9BC98" : "#DCD3BC";
    let layar = "";
    for (const [mx, tg] of [[-150, 520], [10, 600], [160, 480]]) {
      layar += `<rect x="${mx - 6}" y="${-tg}" width="12" height="${tg}" fill="${lambung}"/>`;
      for (let i = 0; i < 3; i++) { const yy = -tg + 40 + i * (tg * 0.28), lw = 120 - i * 6, hh = tg * 0.24 * ly;
        layar += `<path d="M${mx - lw} ${yy} Q${mx} ${yy - 10} ${mx + lw} ${yy} L${mx + lw - 10} ${f1(yy + hh)} Q${mx} ${f1(yy + hh + 26 * ly)} ${mx - lw + 10} ${f1(yy + hh)}Z" fill="${i % 2 ? slB : sl}"/>`; }
      layar += `<path d="M${mx} ${-tg} l0 -40 l46 14 l-46 14z" fill="#B3262E"/>`;
    }
    return g(x, y + bob, s, `<g transform="rotate(${f2(rk)}) scale(${o.arah || 1} 1)"><ellipse cx="0" cy="40" rx="300" ry="26" fill="#000" opacity=".15"/>${layar}
      <path d="M-300 -40 L300 -40 L250 40 L-240 40Z" fill="${lambung}"/><rect x="-290" y="-40" width="580" height="16" fill="${m ? "#5A4034" : "#8E6444"}"/>
      ${[-200, -130, -60, 10, 80, 150].map((xx) => `<rect x="${xx}" y="-12" width="22" height="16" rx="3" fill="${m ? "#FFD38A" : "#2E2018"}" opacity="${m ? .7 : .6}"/>`).join("")}
      <path d="M300 -40 L380 -90" stroke="${lambung}" stroke-width="10"/></g>`);
  }
  // pelabuhan lama: langit, laut, bukit seberang, deretan gudang putih, dermaga kayu. o: {gudangY, dermagaY}
  function pelabuhanLama(w, h, P, t = 0, o = {}) {
    const ly = o.lautY ?? h * 0.5, dy = o.dermagaY ?? h * 0.72, m = malam(P);
    let s = A.langit(P, w, h, t, { suryaX: o.suryaX ?? w * 0.8, suryaY: o.suryaY ?? h * 0.16 }) + A.awan(w * 0.2, h * 0.14, 1, P, 0.8) + A.awan(w * 0.62, h * 0.22, 0.8, P, 0.7);
    s += A.bukit(w, ly - 10, 120, 5, P.jauh, ly + 40) + A.laut(w, ly, h - ly, P, t);
    // gudang putih beratap merah di kanan
    for (let i = 0; i < 5; i++) { const gx = w * 0.52 + i * 190, gy = ly + 40, tg = 200 + (i % 2) * 60;
      s += `<rect x="${gx}" y="${gy - tg}" width="180" height="${tg}" fill="${m ? "#7C8494" : "#F4EEDC"}"/><path d="M${gx - 10} ${gy - tg} L${gx + 90} ${gy - tg - 70} L${gx + 190} ${gy - tg}Z" fill="${P.atap}"/>
        <rect x="${gx + 20}" y="${gy - tg + 40}" width="40" height="56" fill="${m ? P.jendela : "#9FB8C2"}" opacity="${m ? .8 : 1}"/><rect x="${gx + 110}" y="${gy - tg + 40}" width="40" height="56" fill="${m ? P.jendela : "#9FB8C2"}" opacity="${m ? .8 : 1}"/><rect x="${gx + 60}" y="${gy - 90}" width="60" height="90" fill="${P.batang}"/>`; }
    // dermaga kayu
    s += `<rect x="0" y="${dy}" width="${w}" height="${h - dy}" fill="${m ? "#4A3A30" : "#9C7650"}"/>`;
    for (let i = 0; i < w / 60; i++) s += `<rect x="${i * 60}" y="${dy}" width="4" height="${h - dy}" fill="#000" opacity=".12"/>`;
    s += `<rect x="0" y="${dy}" width="${w}" height="16" fill="${m ? "#5E4A3C" : "#B48A5E"}"/>`;
    for (let i = 0; i < w / 260; i++) s += `<rect x="${40 + i * 260}" y="${dy - 50}" width="26" height="70" rx="6" fill="${m ? "#3A2C24" : "#6A4A30"}"/>`;
    return s;
  }
  // siluet tokoh sejarah bertopi tinggi (tanpa wajah). o: {warna, tarik 0..1 (tangan maju), condong (derajat), arah 1|-1}
  function siluetBertopi(x, y, s, o = {}) {
    const c = o.warna || "#2A2230", k = cl(o.tarik || 0), ar = o.arah || 1;
    return g(x, y, s, `<g transform="scale(${ar} 1) rotate(${f2(o.condong || 0)})"><ellipse cx="0" cy="6" rx="110" ry="16" fill="#000" opacity=".2"/>
      <rect x="-50" y="-260" width="40" height="260" rx="14" fill="${c}"/><rect x="8" y="-260" width="40" height="260" rx="14" fill="${c}"/>
      <path d="M-80 -560 Q0 -590 80 -560 L96 -230 Q60 -200 0 -210 Q-60 -200 -96 -230Z" fill="${c}"/>
      <path d="M70 -520 Q${f1(140 + 60 * k)} ${f1(-420 - 40 * k)} ${f1(120 + 120 * k)} ${f1(-340 - 90 * k)}" stroke="${c}" stroke-width="44" stroke-linecap="round" fill="none"/>
      <rect x="-24" y="-610" width="48" height="60" fill="${c}"/><ellipse cx="0" cy="-660" rx="58" ry="66" fill="${c}"/>
      <rect x="-74" y="-722" width="148" height="18" rx="9" fill="${c}"/><rect x="-48" y="-850" width="96" height="136" rx="8" fill="${c}"/></g>`);
  }
  // gerobak tangan berisi tumpukan jurnal. o: {putar (detik untuk roda), n}
  function gerobakJurnal(x, y, s, P, t = 0, o = {}) {
    const m = malam(P), kayu = m ? "#5A4232" : "#8E6444", rd = (o.putar ?? t) * 160;
    let buku = ""; for (let i = 0; i < (o.n || 7); i++) buku += `<rect x="${-150 + (i % 2) * 8}" y="${-130 - i * 26}" width="230" height="24" rx="3" fill="${["#7A3A30", "#E9DFCB", "#2F4E66", "#E9DFCB"][i % 4]}"/><rect x="${-150 + (i % 2) * 8}" y="${-112 - i * 26}" width="230" height="6" fill="#C9BFA6"/>`;
    const roda = (rx) => `<g transform="translate(${rx} 0) rotate(${f1(rd)})"><circle r="70" fill="none" stroke="${kayu}" stroke-width="16"/>${[0, 45, 90, 135].map((a) => `<rect x="-4" y="-66" width="8" height="132" fill="${kayu}" transform="rotate(${a})"/>`).join("")}<circle r="14" fill="${kayu}"/></g>`;
    return g(x, y, s, `<ellipse cx="0" cy="72" rx="260" ry="20" fill="#000" opacity=".2"/>${buku}<path d="M-200 -110 L200 -110 L180 -10 L-180 -10Z" fill="${kayu}"/><path d="M200 -100 L330 -170" stroke="${kayu}" stroke-width="14" stroke-linecap="round"/>${roda(-120)}${roda(120)}`);
  }
  // ruang peta kuno: dinding hijau tua, peta Nusantara berbingkai, bola dunia, gulungan peta
  function ruangPeta(w, h, P, t = 0, o = {}) {
    const lt = o.lantai ?? h * 0.74, id = uid("rp");
    let s = `<defs><radialGradient id="${id}" cx=".5" cy=".38" r=".8"><stop offset="0" stop-color="#FFE6B0" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>
      <rect width="${w}" height="${h}" fill="#3E5A50"/><rect y="${lt - 260}" width="${w}" height="260" fill="#33493F"/><rect y="${lt - 270}" width="${w}" height="14" fill="#5E7A6A"/>
      <rect y="${lt}" width="${w}" height="${h - lt}" fill="#6A4A30"/>${[...Array(12)].map((_, i) => `<rect x="${i * 160}" y="${lt}" width="6" height="${h - lt}" fill="#000" opacity=".12"/>`).join("")}`;
    const px = o.petaX ?? w / 2 - 520, py = o.petaY ?? lt - 1080;
    s += `<rect x="${px - 30}" y="${py - 30}" width="1100" height="560" rx="10" fill="#8A5A30"/><rect x="${px}" y="${py}" width="1040" height="500" fill="#E9D8B0"/>
      <rect x="${px}" y="${py}" width="1040" height="500" fill="#B9CBBF" opacity=".55"/>${petaNusantara(px + 20, py + 40, 1, { warna: "#9BB07A", bayang: false })}
      ${[...Array(6)].map((_, i) => `<path d="M${px} ${py + 80 * i + 40} H${px + 1040}" stroke="#7A6A50" stroke-width="2" opacity=".25"/>`).join("")}`;
    // bola dunia di kanan bawah + gulungan
    const gx = o.globeX ?? w - 260;
    s += `<rect x="${gx - 8}" y="${lt - 160}" width="16" height="160" fill="#7A5232"/><ellipse cx="${gx}" cy="${lt}" rx="80" ry="16" fill="#5A3A22"/>
      <circle cx="${gx}" cy="${lt - 280}" r="130" fill="#5F8FA8"/><path d="M${gx - 90} ${lt - 330} q40 -40 90 -10 q30 30 -20 60 q-40 10 -70 -50Z M${gx + 20} ${lt - 220} q40 -30 70 0 q-10 40 -60 30Z" fill="#9BB07A"/>
      <path d="M${gx} ${lt - 430} A150 150 0 0 1 ${gx} ${lt - 130}" stroke="#B48A3E" stroke-width="10" fill="none"/>`;
    for (let i = 0; i < 4; i++) s += `<g transform="translate(${120 + i * 60} ${lt + 40}) rotate(${-20 + i * 12})"><rect x="-26" y="-200" width="52" height="200" rx="26" fill="${["#E9D8B0", "#D9C49A", "#EFE2C4", "#CDB78E"][i]}"/><ellipse cx="0" cy="-200" rx="26" ry="10" fill="#B9A27A"/></g>`;
    return s + `<rect width="${w}" height="${h}" fill="url(#${id})"/>`;
  }
  // halaman bergaya Yunani: langit siang, laut jauh, lantai marmer, deret tiang
  function tiangYunani(x, y, s, P) {
    const c = P.nama === "senja" ? "#F2DCC4" : "#F4F1EA", cb = P.nama === "senja" ? "#D8BEA2" : "#D9D4C8";
    let alur = ""; for (let i = 0; i < 5; i++) alur += `<rect x="${-40 + i * 18}" y="-560" width="6" height="520" fill="${cb}"/>`;
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="90" ry="14" fill="${P.bayang}"/><rect x="-74" y="-40" width="148" height="40" fill="${cb}"/><rect x="-56" y="-580" width="112" height="540" fill="${c}"/>${alur}<rect x="-80" y="-616" width="160" height="36" fill="${c}"/><rect x="-92" y="-640" width="184" height="26" rx="6" fill="${cb}"/>`);
  }
  function halamanYunani(w, h, P, t = 0, o = {}) {
    const lt = o.lantai ?? h * 0.7;
    let s = A.langit(P, w, h, t, { suryaX: w * 0.75, suryaY: h * 0.14 }) + A.awan(w * 0.25, h * 0.12, 1, P, 0.85) + A.awan(w * 0.7, h * 0.24, 0.8, P, 0.8);
    s += A.bukit(w, lt - 300, 90, 4, P.jauh) + A.laut(w, lt - 300, 300, P, t);
    s += `<rect x="-100" y="${lt - 760}" width="${w + 200}" height="70" fill="${P.nama === "senja" ? "#E8CDB0" : "#ECE7DC"}"/><path d="M${w * 0.2} ${lt - 760} L${w / 2} ${lt - 900} L${w * 0.8} ${lt - 760}Z" fill="${P.nama === "senja" ? "#E2C5A6" : "#E4DED0"}"/>`;
    for (let i = 0; i < 6; i++) s += tiangYunani(-60 + i * (w + 120) / 5, lt, 1.06, P);
    s += `<rect x="-100" y="${lt}" width="${w + 200}" height="${h - lt}" fill="${P.nama === "senja" ? "#D8C0A6" : "#E7E1D4"}"/>`;
    for (let i = 0; i < 14; i++) s += `<path d="M${w / 2} ${lt} L${w / 2 + (i - 7) * 400} ${h}" stroke="#000" stroke-width="3" opacity=".06"/>`;
    for (let j = 1; j < 6; j++) s += `<rect x="-100" y="${f1(lt + Math.pow(j / 6, 1.6) * (h - lt))}" width="${w + 200}" height="3" fill="#000" opacity=".06"/>`;
    s += A.semak(120, lt + 30, 1.1, P) + A.semak(w - 120, lt + 40, 1.2, P);
    return s;
  }
  // kepingan puzzle. sisi: 'kanan' (tonjolan kanan) | 'kiri' (lekukan kiri). o: {teks, sub, ikon (svg), sinar}
  function kepinganPuzzle(x, y, s, warna, sisi, o = {}) {
    const d = sisi === "kanan"
      ? "M-170 -150 H170 V-40 C220 -70 250 -10 250 0 C250 10 220 70 170 40 V150 H-170Z"
      : "M-170 -150 H170 V150 H-170 V40 C-120 70 -90 10 -90 0 C-90 -10 -120 -70 -170 -40Z";
    return g(x, y, s, `${o.sinar ? `<path d="${d}" fill="#FFE08A" opacity="${f2(o.sinar * 0.7)}" style="filter:blur(18px)"/>` : ""}<path d="${d}" fill="#000" opacity=".2" transform="translate(8 12)"/><path d="${d}" fill="${warna}"/>
      <path d="M-160 -140 H160" stroke="#FFF" stroke-width="10" opacity=".3" stroke-linecap="round"/>${o.ikon || ""}
      <text y="${o.sub ? 70 : 24}" x="${sisi === "kanan" ? 0 : 30}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="58" fill="#1E1E1E">${o.teks || ""}</text>
      ${o.sub ? `<text y="118" x="${sisi === "kanan" ? 0 : 30}" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="34" fill="#1E1E1E" opacity=".75">${o.sub}</text>` : ""}`);
  }
  // ruang kerja era Victoria: kertas dinding bergaris, perapian menyala, jendela senja, karpet
  function ruangVictoria(w, h, P, t = 0, o = {}) {
    const lt = o.lantai ?? h * 0.74, id = uid("rv"), lg = uid("rvj");
    let s = `<rect width="${w}" height="${h}" fill="#5A3A4A"/>`;
    for (let i = 0; i < w / 70; i++) s += `<rect x="${i * 70}" y="0" width="28" height="${lt - 300}" fill="#6A4658" opacity=".6"/>`;
    s += `<rect y="${lt - 300}" width="${w}" height="300" fill="#4A2E26"/><rect y="${lt - 310}" width="${w}" height="16" fill="#7A5232"/>`;
    for (let i = 0; i < w / 220; i++) s += `<rect x="${30 + i * 220}" y="${lt - 260}" width="160" height="210" rx="6" fill="none" stroke="#3A2218" stroke-width="8"/>`;
    const jx = o.jendelaX ?? w * 0.62;
    s += `<defs><linearGradient id="${lg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.langit[0]}"/><stop offset="1" stop-color="${P.langit[1]}"/></linearGradient>
      <radialGradient id="${id}" cx=".2" cy=".7" r=".7"><stop offset="0" stop-color="#FFB060" stop-opacity=".35"/><stop offset="1" stop-color="#FFB060" stop-opacity="0"/></radialGradient></defs>
      <rect x="${jx - 24}" y="${lt - 1220}" width="380" height="760" rx="190" fill="#7A5232"/><rect x="${jx}" y="${lt - 1196}" width="332" height="712" rx="166" fill="url(#${lg})"/>
      <rect x="${jx + 160}" y="${lt - 1196}" width="12" height="712" fill="#7A5232"/><rect x="${jx}" y="${lt - 860}" width="332" height="12" fill="#7A5232"/>
      <path d="M${jx - 60} ${lt - 1240} Q${jx - 20} ${lt - 860} ${jx - 70} ${lt - 440} L${jx - 10} ${lt - 440} Q${jx + 20} ${lt - 860} ${jx + 10} ${lt - 1240}Z" fill="#8E2E3A"/>
      <path d="M${jx + 342} ${lt - 1240} Q${jx + 312} ${lt - 860} ${jx + 344} ${lt - 440} L${jx + 404} ${lt - 440} Q${jx + 362} ${lt - 860} ${jx + 402} ${lt - 1240}Z" fill="#8E2E3A"/>`;
    // perapian kiri
    const fx = o.apiX ?? w * 0.16, fl = 1 + 0.08 * Math.sin(t * 9);
    s += `<rect x="${fx - 170}" y="${lt - 420}" width="340" height="420" fill="#8A7A6A"/><rect x="${fx - 190}" y="${lt - 440}" width="380" height="36" fill="#A89888"/><rect x="${fx - 100}" y="${lt - 280}" width="200" height="280" rx="100" fill="#2A1A14"/>
      <g transform="translate(${fx} ${lt - 30}) scale(${f2(fl)})"><path d="M-60 0 Q-70 -80 -20 -150 Q-10 -90 10 -110 Q40 -160 30 -200 Q90 -120 60 0Z" fill="#F28C38"/><path d="M-30 0 Q-30 -60 0 -100 Q10 -60 30 -70 Q40 -40 30 0Z" fill="#FFD36A"/></g>`;
    s += `<rect y="${lt}" width="${w}" height="${h - lt}" fill="#5A3A26"/><ellipse cx="${w / 2}" cy="${lt + 160}" rx="${w * 0.42}" ry="120" fill="#8E2E3A"/><ellipse cx="${w / 2}" cy="${lt + 160}" rx="${w * 0.36}" ry="92" fill="none" stroke="#C9A24A" stroke-width="8" opacity=".6"/>`;
    return s + `<rect width="${w}" height="${h}" fill="url(#${id})"/>`;
  }
  // papan nama di kuda-kuda kayu. o: {teks, ukuran, coret 0..1, sorot 0..1, warnaPapan}
  function papanEasel(x, y, s, o = {}) {
    const fs = o.ukuran || 64, ct = cl(o.coret || 0), sr = cl(o.sorot || 0);
    return g(x, y, s, `<ellipse cx="0" cy="8" rx="220" ry="20" fill="#000" opacity=".25"/><path d="M-140 0 L-40 -620 M140 0 L40 -620 M0 -600 L0 40" stroke="#7A5232" stroke-width="22" stroke-linecap="round"/>
      ${sr > 0 ? `<rect x="-250" y="-560" width="500" height="300" rx="22" fill="#FFE08A" opacity="${f2(sr * 0.6)}" style="filter:blur(22px)"/>` : ""}
      <rect x="-240" y="-550" width="480" height="280" rx="16" fill="#7A5232"/><rect x="-220" y="-530" width="440" height="240" rx="10" fill="${o.warnaPapan || "#F2E6C8"}"/>
      <text y="${-390 + fs * 0.3}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${fs}" fill="#3A2412" letter-spacing="1">${o.teks || ""}</text>
      ${ct > 0 ? `<path d="M-190 -410 L${f1(-190 + 380 * ct)} ${f1(-410 + 20 * ct)}" stroke="#D63A3A" stroke-width="16" stroke-linecap="round"/>` : ""}
      <rect x="-200" y="-270" width="400" height="20" rx="6" fill="#5E3E22"/>`);
  }
  // lampu meja kuningan (cahaya hangat)
  function lampuMeja(x, y, s, t = 0) {
    const id = uid("lm");
    return g(x, y, s, `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#FFE0A0" stop-opacity=".5"/><stop offset="1" stop-color="#FFE0A0" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="0" cy="-250" rx="420" ry="360" fill="url(#${id})"/><ellipse cx="0" cy="0" rx="90" ry="20" fill="#9A7A3A"/><rect x="-8" y="-240" width="16" height="240" fill="#B8923E"/>
      <path d="M-110 -230 L110 -230 L70 -340 L-70 -340Z" fill="#2E6A4A"/><ellipse cx="0" cy="-230" rx="110" ry="16" fill="#FFE6A8"/>`);
  }
  // lembar cetakan berserakan (tanpa tulisan terbaca)
  function lembarCetak(x, y, s, o = {}) {
    const r = acak(o.benih || 41); let d = "";
    for (let i = 0; i < (o.n || 6); i++) { const dx = (r() - 0.5) * 520, dy = (r() - 0.5) * 120, rt = (r() - 0.5) * 30;
      let gar = ""; for (let j = 0; j < 7; j++) gar += `<rect x="-100" y="${-120 + j * 32}" width="${f1(120 + r() * 70)}" height="8" rx="4" fill="#8A7A60" opacity=".35"/>`;
      d += `<g transform="translate(${f1(dx)} ${f1(dy)}) rotate(${f1(rt)})"><rect x="-130" y="-160" width="260" height="320" fill="${i % 2 ? "#F4EEDC" : "#ECE2C8"}"/>${gar}</g>`; }
    return g(x, y, s, d);
  }
  // jendela kota kanal berhujan (rumah berpuncak tangga, air kanal). Koordinat jendela: (x,y) kiri atas, ukuran w×h
  function jendelaKanal(x, y, w, h, P, t = 0) {
    const id = uid("jk"), lg = uid("jkl"), r = acak(19);
    let isi = `<rect x="0" y="0" width="${w}" height="${h}" fill="url(#${lg})"/>`;
    const warna = ["#7A4A3A", "#5E4A3E", "#8A5A40", "#6A5040", "#4E4A52"];
    for (let i = 0; i < 6; i++) { const rx = -20 + i * (w / 5), rw = w / 5 + 10, rt = h * (0.42 + r() * 0.18), ry = h * 0.72 - rt;
      isi += `<path d="M${f1(rx)} ${f1(h * 0.72)} V${f1(ry + 40)} H${f1(rx + rw * 0.2)} V${f1(ry + 10)} H${f1(rx + rw * 0.35)} V${f1(ry - 20)} H${f1(rx + rw * 0.65)} V${f1(ry + 10)} H${f1(rx + rw * 0.8)} V${f1(ry + 40)} H${f1(rx + rw)} V${f1(h * 0.72)}Z" fill="${warna[i % 5]}" opacity=".85"/>`;
      for (let j = 0; j < 3; j++) isi += `<rect x="${f1(rx + 20 + j * (rw - 40) / 3)}" y="${f1(ry + 70)}" width="${f1((rw - 60) / 3 - 6)}" height="40" fill="#FFD38A" opacity="${f2(0.35 + 0.4 * r())}"/>`; }
    isi += `<rect x="0" y="${f1(h * 0.72)}" width="${w}" height="${f1(h * 0.28)}" fill="#3E5068"/>${[0, 1, 2, 3].map((i) => `<rect x="${f1(((i * 97 + t * 18) % w))}" y="${f1(h * 0.78 + i * 18)}" width="60" height="3" fill="#9FB4CC" opacity=".5"/>`).join("")}`;
    isi += A.hujan(w, h, t, P, { deras: 0.5 });
    return `<defs><clipPath id="${id}"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath><linearGradient id="${lg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E6E86"/><stop offset="1" stop-color="#8A9AAE"/></linearGradient></defs>
      <g transform="translate(${x} ${y})"><rect x="-26" y="-26" width="${w + 52}" height="${h + 52}" rx="8" fill="#4A3426"/><g clip-path="url(#${id})">${isi}</g>
      <rect x="${w / 2 - 6}" y="0" width="12" height="${h}" fill="#4A3426"/><rect x="0" y="${h * 0.45}" width="${w}" height="12" fill="#4A3426"/></g>`;
  }
  // orang generik (bukan tokoh nyata, wajah sederhana). o: {baju, celana, kulit, rambut, peci, kebaya, tangan:'angkat'|'pegang'|'dada'|'turun', ayun, tanpaWajah}
  function orang(x, y, s, P, t = 0, o = {}) {
    const kulit = o.kulit || "#C98F6A", rambut = o.rambut || "#2A2020", baju = o.baju || "#F4EEDC", bajuG = o.bajuG || "#D9D0BC", cel = o.celana || "#3A3A4A", ay = Math.sin(t * 2.2 + x * 0.03) * 3;
    const tg = o.tangan || "turun", ang = o.ayun ?? 0;
    const lengan = (sx) => {
      if (typeof o.angkat === "number") { // 0 = turun, 1 = terangkat; mulus tanpa lompatan
        const k = cl(o.angkat), gy = Math.abs(Math.sin(t * 6 + sx)) * 26 * k, ex = sx * (84 - 4 * k), ey = -222 - 470 * k - gy, cx = sx * (100 + 14 * k), cy = -330 - 230 * k;
        return `<path d="M${sx * 70} -440 Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}" stroke="${baju}" stroke-width="40" stroke-linecap="round" fill="none"/><circle cx="${f1(ex)}" cy="${f1(ey - 8 * k)}" r="22" fill="${kulit}"/>`;
      }
      if (tg === "angkat") return `<path d="M${sx * 70} -440 Q${sx * (110 + 10 * Math.sin(t * 6 + x))} -560 ${sx * (80 + 20 * ang)} ${f1(-680 - 30 * Math.abs(Math.sin(t * 6 + sx)))}" stroke="${baju}" stroke-width="40" stroke-linecap="round" fill="none"/><circle cx="${sx * (80 + 20 * ang)}" cy="${f1(-690 - 30 * Math.abs(Math.sin(t * 6 + sx)))}" r="22" fill="${kulit}"/>`;
      if (tg === "pegang") return `<path d="M${sx * 70} -440 Q${sx * 120} -360 ${sx * 40} -330" stroke="${baju}" stroke-width="40" stroke-linecap="round" fill="none"/>`;
      if (tg === "dada" && sx > 0) return `<path d="M70 -440 Q80 -360 10 -400" stroke="${baju}" stroke-width="40" stroke-linecap="round" fill="none"/><circle cx="6" cy="-404" r="22" fill="${kulit}"/>`;
      return `<path d="M${sx * 70} -440 Q${sx * 100} -330 ${sx * 84} -230" stroke="${baju}" stroke-width="40" stroke-linecap="round" fill="none"/><circle cx="${sx * 84}" cy="-222" r="22" fill="${kulit}"/>`;
    };
    const wajah = o.tanpaWajah ? "" : `<circle cx="-22" cy="${-610 + ay}" r="7" fill="#2A2020"/><circle cx="22" cy="${-610 + ay}" r="7" fill="#2A2020"/><path d="M-14 ${-584 + ay} Q0 ${-574 + ay} 14 ${-584 + ay}" stroke="#2A2020" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    const kepalaAtas = o.peci ? `<path d="M-62 ${-650 + ay} L-56 ${-706 + ay} Q0 ${-716 + ay} 56 ${-706 + ay} L62 ${-650 + ay} Q0 ${-664 + ay} -62 ${-650 + ay}Z" fill="#1E1E24"/>`
      : `<path d="M-64 ${-620 + ay} Q-70 ${-712 + ay} 0 ${-704 + ay} Q70 ${-712 + ay} 64 ${-620 + ay} Q44 ${-668 + ay} 0 ${-664 + ay} Q-44 ${-668 + ay} -64 ${-620 + ay}Z" fill="${rambut}"/>`;
    const badan = o.kebaya ? `<path d="M-80 -470 Q0 -500 80 -470 L100 -230 L-100 -230Z" fill="${baju}"/><path d="M-100 -240 L100 -240 L120 0 L-120 0Z" fill="${cel}"/>`
      : `<rect x="-56" y="-250" width="46" height="250" rx="18" fill="${cel}"/><rect x="10" y="-250" width="46" height="250" rx="18" fill="${cel}"/><path d="M-80 -470 Q0 -500 80 -470 L92 -230 L-92 -230Z" fill="${baju}"/><path d="M0 -480 L20 -230 L92 -230 L80 -470Z" fill="${bajuG}"/>`;
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="110" ry="16" fill="${P.bayang}"/>${badan}${lengan(-1)}${lengan(1)}<rect x="-22" y="-540" width="44" height="60" rx="16" fill="${kulit}"/><ellipse cx="0" cy="${-610 + ay}" rx="62" ry="72" fill="${kulit}"/>${kepalaAtas}${wajah}${o.pegang || ""}`);
  }
  // buku ilmiah polos (sampul tanpa judul). o: {sinar, debu 0..1}
  function bukuPolos(x, y, s, o = {}) {
    const sn = cl(o.sinar || 0), db = cl(o.debu || 0);
    return g(x, y, s, `${sn > 0 ? `<rect x="-120" y="-160" width="240" height="320" rx="20" fill="#FFE08A" opacity="${f2(sn * 0.7)}" style="filter:blur(24px)"/>` : ""}<rect x="-100" y="-140" width="200" height="280" rx="8" fill="#6A3A2A"/><rect x="-100" y="-140" width="26" height="280" rx="6" fill="#4E2A1E"/>
      <rect x="-60" y="-100" width="130" height="6" fill="#C9A24A" opacity=".7"/><rect x="-60" y="94" width="130" height="6" fill="#C9A24A" opacity=".7"/><rect x="-100" y="-140" width="200" height="280" rx="8" fill="#C9C0B0" opacity="${f2(db * 0.6)}"/>`, o.rot || 0);
  }
  // aula pertemuan 1928: jendela tinggi bercahaya hangat, spanduk polos, mimbar, kursi kayu
  function aula1928(w, h, P, t = 0, o = {}) {
    const lt = o.lantai ?? h * 0.76, id = uid("au");
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE6B0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE6B0" stop-opacity="0"/></linearGradient></defs>
      <rect width="${w}" height="${h}" fill="#E2CDA6"/><rect y="${lt - 340}" width="${w}" height="340" fill="#9A6A40"/><rect y="${lt - 350}" width="${w}" height="14" fill="#B8865A"/>`;
    for (let i = 0; i < 4; i++) { const jx = 90 + i * (w - 180) / 3.4; s += `<rect x="${f1(jx)}" y="${lt - 1240}" width="200" height="780" rx="100" fill="#FFF4D8"/><rect x="${f1(jx + 94)}" y="${lt - 1240}" width="12" height="780" fill="#B8865A"/><rect x="${f1(jx)}" y="${lt - 900}" width="200" height="12" fill="#B8865A"/>
      <path d="M${f1(jx)} ${lt - 470} L${f1(jx + 200)} ${lt - 470} L${f1(jx + 420)} ${h} L${f1(jx + 120)} ${h}Z" fill="url(#${id})" opacity="${f2(0.5 + 0.1 * Math.sin(t + i))}"/>`; }
    s += `<path d="M${w * 0.18} ${lt - 1360} L${w * 0.82} ${lt - 1360} L${w * 0.8} ${lt - 1200} Q${w / 2} ${lt - 1170} ${w * 0.2} ${lt - 1200}Z" fill="#B3262E"/><path d="M${w * 0.18} ${lt - 1360} L${w * 0.82} ${lt - 1360} L${w * 0.82} ${lt - 1340} L${w * 0.18} ${lt - 1340}Z" fill="#F4EEDC"/>`;
    s += `<rect y="${lt}" width="${w}" height="${h - lt}" fill="#7A5232"/>${[...Array(10)].map((_, i) => `<rect x="${i * w / 10}" y="${lt}" width="5" height="${h - lt}" fill="#000" opacity=".12"/>`).join("")}`;
    return s;
  }
  // tribun stadion malam: menara lampu, penonton bersorak berbaju merah-putih, syal berayun, kilat kamera
  function tribunStadion(w, h, P, t = 0, o = {}) {
    const r = acak(o.benih || 13), sorak = o.sorak ?? 1, id = uid("st");
    let s = A.langit(P, w, h, t, { suryaX: w * 0.85, suryaY: 300 });
    for (const lx of [w * 0.12, w * 0.88]) s += `<defs><radialGradient id="${id}${lx | 0}"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset=".3" stop-color="#FFF4D0" stop-opacity=".35"/><stop offset="1" stop-color="#FFF4D0" stop-opacity="0"/></radialGradient></defs>
      <rect x="${lx - 10}" y="300" width="20" height="500" fill="#2A3448"/><rect x="${lx - 90}" y="240" width="180" height="80" rx="8" fill="#3A4458"/>${[0, 1, 2, 3].map((i) => `<circle cx="${lx - 66 + i * 44}" cy="280" r="16" fill="#FFFBEA"/>`).join("")}<circle cx="${lx}" cy="280" r="420" fill="url(#${id}${lx | 0})"/>`;
    s += `<path d="M-100 ${h * 0.4} L${w + 100} ${h * 0.36} L${w + 100} ${h} L-100 ${h}Z" fill="#26304A"/>`;
    for (let row = 0; row < 8; row++) {
      const yy = h * 0.42 + row * 150, sc = 0.55 + row * 0.12, n = Math.ceil(w / (110 * sc)) + 2;
      s += `<rect x="-100" y="${f1(yy + 120 * sc)}" width="${w + 200}" height="${f1(30 * sc)}" fill="#1E263A"/>`;
      for (let i = 0; i < n; i++) {
        const x = -60 + i * 110 * sc + (row % 2) * 50 * sc, lomp = Math.max(0, Math.sin(t * 7 + i * 1.7 + row)) * 18 * sorak * sc, merah = r() > 0.28;
        const kulit = ["#C98F6A", "#B47A56", "#D9A27A", "#A86E4C"][Math.floor(r() * 4)], tangan = r() > 0.4;
        s += `<g transform="translate(${f1(x)} ${f1(yy - lomp)}) scale(${f2(sc)})"><path d="M-44 120 Q-44 20 0 20 Q44 20 44 120Z" fill="${merah ? "#C8242C" : "#F4EEDC"}"/><circle cy="-10" r="34" fill="${kulit}"/><path d="M-34 -16 Q-30 -50 0 -46 Q30 -50 34 -16 Q20 -34 0 -32 Q-20 -34 -34 -16Z" fill="#2A2020"/>
          ${tangan ? `<path d="M-30 40 L${f1(-56 - 10 * Math.sin(t * 7 + i))} -60 M30 40 L${f1(56 + 10 * Math.sin(t * 7 + i))} -60" stroke="${merah ? "#C8242C" : "#F4EEDC"}" stroke-width="20" stroke-linecap="round"/>` : ""}
          ${r() > 0.75 ? `<path d="M-60 -70 Q0 ${f1(-110 + 30 * Math.sin(t * 5 + i))} 60 -70 L60 -50 Q0 ${f1(-90 + 30 * Math.sin(t * 5 + i))} -60 -50Z" fill="${(i + row) % 2 ? "#E8343C" : "#F4EEDC"}"/>` : ""}</g>`;
      }
    }
    // kilat kamera acak
    for (let i = 0; i < 6; i++) { const ph = (t * 1.7 + i * 0.37) % 1, x = r() * w, y = h * 0.45 + r() * h * 0.4; if (ph < 0.08) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(30 * (1 - ph / 0.08))}" fill="#FFFFFF" opacity=".8"/>`; }
    return s;
  }

  Object.assign(A, { lilin, ruangKerjaTua, jurnalTerbuka, penaBulu, stempelLilin, petaNusantara, kapalLayar, pelabuhanLama, siluetBertopi, gerobakJurnal, ruangPeta, tiangYunani, halamanYunani,
    kepinganPuzzle, ruangVictoria, papanEasel, lampuMeja, lembarCetak, jendelaKanal, orang, bukuPolos, aula1928, tribunStadion });
})(typeof window !== "undefined" ? window : globalThis);

/* ===== Aset KULINER KECAP & KETCHUP (Yoga, 17 Nov 2026, video I-018) =====
 * Botol saus/kecap (label polos atau teks kode, mata kartun opsional, isi kaca bisa berganti), tong air garam ikan + ekor ikan,
 * ikan/teri, mangkuk bakso, warung bakso, gerobak gorengan, jung Tiongkok + tempayan, rumah panggung, geladak kapal Eropa,
 * dapur pondok Inggris berhujan, jamur/kenari/tiram/tomat, dapur pertanian Amerika, pabrik saus, dapur rumah Indonesia,
 * gerobak nasi goreng + wajan. Tanpa merek/logo asli; aksara Hanzi tidak digambar (ejaan lewat teks layar).
 */
(function (root) {
  const A = (typeof module !== "undefined" && module.exports && module.exports.PALET) ? module.exports : root.ASET;
  let _n = 0; const uid = (p) => `${p}k${++_n}`;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f2(rot)}) scale(${f2(s)})">${isi}</g>`;
  const malam = (P) => P.nama === "malam";

  // mata kartun untuk benda. jenis: 'marah' | 'kaget' | 'senang'
  function mata(x, y, s, jenis = "senang", lihat = 0) {
    const al = jenis === "marah" ? `<path d="M-46 -40 L-12 -24 M46 -40 L12 -24" stroke="#1E1E1E" stroke-width="9" stroke-linecap="round"/>` : jenis === "kaget" ? `<path d="M-44 -44 Q-28 -56 -12 -46 M44 -44 Q28 -56 12 -46" stroke="#1E1E1E" stroke-width="7" fill="none" stroke-linecap="round"/>` : "";
    const r = jenis === "kaget" ? 22 : 18;
    return g(x, y, s, `${al}<circle cx="-28" cy="0" r="${r}" fill="#FFF"/><circle cx="28" cy="0" r="${r}" fill="#FFF"/><circle cx="${-26 + lihat * 6}" cy="2" r="9" fill="#1E1E1E"/><circle cx="${30 + lihat * 6}" cy="2" r="9" fill="#1E1E1E"/>
      ${jenis === "senang" ? `<path d="M-16 34 Q0 46 16 34" stroke="#1E1E1E" stroke-width="6" fill="none" stroke-linecap="round"/>` : jenis === "kaget" ? `<ellipse cx="0" cy="40" rx="10" ry="13" fill="#1E1E1E"/>` : `<path d="M-14 40 L14 38" stroke="#1E1E1E" stroke-width="6" stroke-linecap="round"/>`}`);
  }
  // botol saus tomat (plastik pencet) — dasar di (x,y). o: {label (teks), mata, lihat, sarung (sarung tinju 0..1)}
  function botolSaus(x, y, s, o = {}) {
    const lb = o.label ? `<rect x="-78" y="-250" width="156" height="110" rx="14" fill="#F4EEDC"/><text y="${-182}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${o.label.length > 6 ? 30 : 40}" fill="#B3262E">${o.label}</text>` : `<rect x="-78" y="-250" width="156" height="110" rx="14" fill="#F4EEDC" opacity=".9"/>`;
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="110" ry="18" fill="#000" opacity=".22"/><path d="M-100 0 Q-110 -200 -96 -300 Q-90 -360 -46 -390 L-40 -440 L40 -440 L46 -390 Q90 -360 96 -300 Q110 -200 100 0Z" fill="#D7282F"/>
      <path d="M40 -380 Q80 -350 84 -290 Q96 -180 86 -10 L100 0 Q110 -200 96 -300 Q90 -360 46 -390Z" fill="#B01E24"/><path d="M-70 -320 Q-80 -200 -74 -60" stroke="#FF7A7A" stroke-width="14" fill="none" stroke-linecap="round" opacity=".6"/>
      <rect x="-48" y="-500" width="96" height="66" rx="12" fill="#F4EEDC"/><path d="M-20 -500 L0 -540 L20 -500Z" fill="#F4EEDC"/>${lb}${o.mata ? mata(0, -320, 0.95, o.mata, o.lihat || 0) : ""}`, o.rot || 0);
  }
  // botol kaca kecap. o: {isi warna, kental (botol gemuk), label, mata, tutup warna, tinggi}
  function botolKecap(x, y, s, o = {}) {
    const isi = o.isi || "#2A140C", tp = o.tutup || "#E8B23A", tg = o.tinggi || 1, w = o.kental ? 96 : 76;
    const lb = o.label !== undefined ? `<rect x="${-w + 14}" y="${-250 * tg}" width="${(w - 14) * 2}" height="${110 * tg}" rx="10" fill="#F2E6C8"/>${o.label ? `<text y="${-185 * tg}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${o.label.length > 6 ? 28 : 36}" fill="#3A2412">${o.label}</text>` : ""}` : "";
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="${w + 14}" ry="16" fill="#000" opacity=".22"/><path d="M${-w} 0 L${-w} ${-300 * tg} Q${-w} ${-360 * tg} -30 ${-390 * tg} L-28 ${-500 * tg} L28 ${-500 * tg} L30 ${-390 * tg} Q${w} ${-360 * tg} ${w} ${-300 * tg} L${w} 0Z" fill="${isi}"/>
      <path d="M${w - 26} ${-300 * tg} L${w - 26} -20" stroke="#FFFFFF" stroke-width="10" opacity=".18" stroke-linecap="round"/><path d="M${-w + 18} ${-310 * tg} Q${-w + 18} ${-350 * tg} -20 ${-372 * tg}" stroke="#FFFFFF" stroke-width="10" opacity=".25" fill="none" stroke-linecap="round"/>
      <rect x="-34" y="${-560 * tg}" width="68" height="${66 * tg}" rx="8" fill="${tp}"/>${lb}${o.mata ? mata(0, -330 * tg, 0.85, o.mata, o.lihat || 0) : ""}`, o.rot || 0);
  }
  // botol kaca bening (dapur kuno) berisi konten SVG. o: {konten (svg di area isi), label, isiWarna, tingkat 0..1}
  function botolKaca(x, y, s, o = {}) {
    const id = uid("bk"), tk = cl(o.tingkat ?? 1);
    return g(x, y, s, `<defs><clipPath id="${id}"><path d="M-110 0 L-110 -300 Q-110 -360 -40 -390 L-36 -470 L36 -470 L40 -390 Q110 -360 110 -300 L110 0Z"/></clipPath></defs>
      <ellipse cx="0" cy="8" rx="130" ry="20" fill="#000" opacity=".25"/><path d="M-110 0 L-110 -300 Q-110 -360 -40 -390 L-36 -470 L36 -470 L40 -390 Q110 -360 110 -300 L110 0Z" fill="#CFE3E0" opacity=".45"/>
      <g clip-path="url(#${id})">${o.isiWarna ? `<rect x="-120" y="${f1(-330 * tk)}" width="240" height="${f1(330 * tk + 10)}" fill="${o.isiWarna}" opacity=".85"/>` : ""}${o.konten || ""}</g>
      <path d="M-110 0 L-110 -300 Q-110 -360 -40 -390 L-36 -470 L36 -470 L40 -390 Q110 -360 110 -300 L110 0Z" fill="none" stroke="#E8F4F2" stroke-width="8" opacity=".7"/><path d="M-80 -300 L-80 -40" stroke="#FFF" stroke-width="12" opacity=".35" stroke-linecap="round"/>
      <rect x="-42" y="-500" width="84" height="40" rx="8" fill="#9A6A3A"/>${o.label ? o.label : ""}`, o.rot || 0);
  }
  // tong kayu berisi air garam ikan. o: {ekor 0..1 (ekor ikan mengibas keluar), bau 0..1, t}
  function tongIkan(x, y, s, t = 0, o = {}) {
    const ek = cl(o.ekor ?? 1), kb = Math.sin(t * 8) * 18 * ek, bau = cl(o.bau || 0);
    let garis = ""; for (let i = -2; i <= 2; i++) garis += `<path d="M${i * 44} -230 Q${i * 52} -115 ${i * 44} 0" stroke="#6A4224" stroke-width="5" fill="none" opacity=".5"/>`;
    const ekor = ek > 0 ? `<g transform="translate(30 -236) rotate(${f1(-20 + kb)}) scale(${f2(ek)})"><path d="M0 0 Q10 -50 0 -90 L-40 -150 Q0 -130 10 -110 Q30 -140 60 -150 Q30 -100 20 -80 Q14 -40 18 0Z" fill="#A9B8C4"/><path d="M4 -10 Q12 -50 4 -86" stroke="#D9E4EA" stroke-width="8" fill="none" stroke-linecap="round"/></g>` : "";
    let bs = ""; if (bau > 0) for (let i = 0; i < 3; i++) { const q = (t * 0.5 + i / 3) % 1; bs += `<path d="M${-60 + i * 60} ${f1(-260 - q * 160)} q-20 -30 0 -60 q20 -30 0 -60" stroke="#A9C27A" stroke-width="10" fill="none" stroke-linecap="round" opacity="${f2(bau * Math.sin(Math.PI * q) * 0.8)}"/>`; }
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="140" ry="22" fill="#000" opacity=".25"/><path d="M-120 0 Q-140 -115 -120 -230 L120 -230 Q140 -115 120 0Z" fill="#9A6A3E"/>${garis}
      <rect x="-134" y="-196" width="268" height="18" rx="6" fill="#5A5E66"/><rect x="-134" y="-48" width="268" height="18" rx="6" fill="#5A5E66"/>
      <ellipse cx="0" cy="-230" rx="120" ry="26" fill="#7A5230"/><ellipse cx="0" cy="-230" rx="104" ry="20" fill="#3A2414"/><ellipse cx="-30" cy="-234" rx="40" ry="6" fill="#8A6A4A" opacity=".5"/>${ekor}${bs}`, o.rot || 0);
  }
  // ikan kecil (teri) atau ikan perak. o: {warna, kibas (t)}
  function ikan(x, y, s, rot = 0, o = {}) {
    const w = o.warna || "#B9C6D0", k = Math.sin((o.kibas || 0) * 14) * 10;
    return g(x, y, s, `<path d="M-60 0 Q-20 -26 40 -10 Q60 -4 64 0 Q60 4 40 10 Q-20 26 -60 0Z" fill="${w}"/><path d="M-56 0 L-96 ${f1(-22 + k)} L-90 0 L-96 ${f1(22 + k)}Z" fill="${w}"/><path d="M-40 4 Q0 12 40 4" stroke="#FFFFFF" stroke-width="5" fill="none" opacity=".6"/><circle cx="40" cy="-4" r="5" fill="#1E1E1E"/>`, rot);
  }
  // mangkuk bakso berkuah + uap
  function mangkukBakso(x, y, s, t = 0) {
    const uap = [0, 1, 2].map((i) => { const u = ((t * 0.4 + i / 3) % 1); return `<path d="M${-50 + i * 50} ${f1(-110 - u * 140)} q-16 -34 0 -68 q16 -34 0 -68" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round" opacity="${f2(Math.sin(Math.PI * u) * 0.45)}"/>`; }).join("");
    return g(x, y, s, `<ellipse cx="0" cy="8" rx="190" ry="26" fill="#000" opacity=".2"/><path d="M-190 -90 Q-180 10 0 14 Q180 10 190 -90Z" fill="#F4EEDC"/><path d="M-190 -90 Q-180 10 0 14 Q180 10 190 -90" stroke="#3E8AC2" stroke-width="10" fill="none"/>
      <ellipse cx="0" cy="-90" rx="190" ry="40" fill="#E9DDC0"/><ellipse cx="0" cy="-90" rx="170" ry="32" fill="#C98A4A"/><path d="M-130 -96 Q-60 -70 0 -98 Q60 -70 130 -96" stroke="#F2D38A" stroke-width="10" fill="none"/>
      ${[[-70, -112, 40], [10, -118, 44], [84, -108, 38], [-20, -96, 34]].map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="#9A6A4A"/><circle cx="${a - r * 0.3}" cy="${b - r * 0.3}" r="${r * 0.3}" fill="#B88A64"/>`).join("")}
      ${[-110, -40, 50, 120].map((a) => `<circle cx="${a}" cy="-84" r="7" fill="#5FA05A"/>`).join("")}${uap}`);
  }
  // warung bakso: dinding keramik, rak, meja kayu, lampu untai (menyala senja/malam). o: {meja (y)}
  function warungBakso(w, h, P, t = 0, o = {}) {
    const my = o.meja ?? h * 0.66, m = malam(P), sj = P.nama !== "siang", id = uid("wb");
    let s = `<rect width="${w}" height="${h}" fill="${m ? "#3A4A5A" : sj ? "#C9A88A" : "#EDE6D6"}"/>`;
    // jendela/bukaan ke jalan
    s += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.langit[0]}"/><stop offset="1" stop-color="${P.langit[1]}"/></linearGradient></defs><rect x="${w * 0.08}" y="${my - 1050}" width="${w * 0.84}" height="560" rx="12" fill="url(#${id})"/>`;
    s += A.rumahKampung(w * 0.3, my - 500, 0.7, P) + A.rumahKampung(w * 0.78, my - 500, 0.6, P);
    s += `<rect x="${w * 0.08}" y="${my - 500}" width="${w * 0.84}" height="20" fill="${m ? "#2A3440" : "#8A6A4A"}"/>`;
    for (let i = 0; i < w / 60; i++) for (let j = 0; j < 7; j++) s += `<rect x="${i * 60 + 2}" y="${my - 470 + j * 60 + 2}" width="56" height="56" fill="${(i + j) % 2 ? (m ? "#4A6A7A" : "#DCEBF0") : (m ? "#55788A" : "#F4FAFB")}"/>`;
    // tenda/kanopi atas
    s += `<rect x="0" y="${my - 1180}" width="${w}" height="120" fill="#2E7A5A"/>${[...Array(Math.ceil(w / 120))].map((_, i) => `<path d="M${i * 120} ${my - 1060} q60 50 120 0" fill="${i % 2 ? "#2E7A5A" : "#F4EEDC"}"/>`).join("")}`;
    // lampu untai
    if (sj) { let d = `M0 ${my - 1030}`; for (let i = 0; i <= 10; i++) d += ` Q${i * w / 10 - w / 20} ${my - 990} ${i * w / 10} ${my - 1030}`; s += `<path d="${d}" stroke="#2A2A2A" stroke-width="4" fill="none"/>`;
      for (let i = 0; i < 20; i++) { const lx = i * w / 20 + w / 40, ly = my - 1012 + Math.abs(Math.sin(i * 1.6)) * 4; s += `<circle cx="${f1(lx)}" cy="${f1(ly)}" r="26" fill="#FFD38A" opacity="${f2(0.25 + 0.1 * Math.sin(t * 3 + i))}"/><circle cx="${f1(lx)}" cy="${f1(ly)}" r="10" fill="#FFF1C0"/>`; } }
    // meja kayu
    s += `<rect x="0" y="${my}" width="${w}" height="${h - my}" fill="${m ? "#5A3E2A" : "#B07A46"}"/><rect x="0" y="${my}" width="${w}" height="22" fill="${m ? "#7A5638" : "#C99460"}"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M0 ${my + 70 + i * 90} Q${w / 2} ${my + 50 + i * 90} ${w} ${my + 80 + i * 90}" stroke="#000" stroke-width="3" opacity=".1" fill="none"/>`;
    return s;
  }
  // gerobak gorengan: etalase kaca berisi tahu, tempe, bakwan; atap terpal
  function gerobakGorengan(x, y, s, P, t = 0) {
    const m = malam(P), kayu = m ? "#6A4A34" : "#B5784A";
    let gor = ""; const r = acak(5);
    for (let i = 0; i < 14; i++) { const gx = -240 + (i % 7) * 76, gy = -250 - Math.floor(i / 7) * 46, j = i % 3;
      gor += j === 0 ? `<rect x="${gx}" y="${gy}" width="60" height="38" rx="6" fill="#E2A64A"/>` : j === 1 ? `<rect x="${gx}" y="${gy}" width="62" height="34" rx="4" fill="#C98A3A"/><rect x="${gx + 6}" y="${gy + 6}" width="50" height="6" fill="#F2C060"/>` : `<ellipse cx="${gx + 30}" cy="${gy + 18}" rx="36" ry="22" fill="#D9963A"/><circle cx="${gx + 20}" cy="${gy + 14}" r="6" fill="#7A9A3A"/>`; }
    return g(x, y, s, `<ellipse cx="0" cy="10" rx="360" ry="26" fill="#000" opacity=".22"/><rect x="-320" y="-200" width="640" height="180" rx="10" fill="${kayu}"/><rect x="-300" y="-180" width="600" height="20" fill="#000" opacity=".12"/>
      <rect x="-300" y="-360" width="600" height="160" fill="#CFE3E0" opacity=".35"/>${gor}<rect x="-300" y="-360" width="600" height="160" fill="none" stroke="#E8F4F2" stroke-width="8" opacity=".8"/>
      <rect x="-330" y="-560" width="14" height="560" fill="#7A7A7A"/><rect x="316" y="-560" width="14" height="560" fill="#7A7A7A"/><path d="M-380 -560 L380 -560 L340 -640 L-340 -640Z" fill="#2F7AC2"/><path d="M-380 -560 L380 -560 L380 -530 L-380 -530Z" fill="#1F5A9A"/>
      <circle cx="-220" cy="0" r="52" fill="#3A3A3A"/><circle cx="-220" cy="0" r="18" fill="#9A9A9A"/><circle cx="220" cy="0" r="52" fill="#3A3A3A"/><circle cx="220" cy="0" r="18" fill="#9A9A9A"/>`);
  }
  // jung Tiongkok dengan layar bertulang (tanpa tulisan)
  function jung(x, y, s, P, t = 0, o = {}) {
    const bob = Math.sin(t * 1.2 + x * 0.02) * 6, m = malam(P), lm = m ? "#4A3A30" : "#7A4A2A", ly = P.nama === "senja" || o.pagi ? "#C9603A" : "#B5523A";
    const layar = (mx, tg, lw) => { let d = `<rect x="${mx - 5}" y="${-tg}" width="10" height="${tg}" fill="${lm}"/><path d="M${mx} ${-tg + 10} Q${mx + lw} ${-tg + 20} ${mx + lw * 1.1} ${-tg * 0.25} L${mx} ${-tg * 0.25}Z" fill="${ly}"/>`;
      for (let i = 1; i < 6; i++) { const yy = -tg + 10 + i * (tg * 0.75 - 10) / 6; d += `<path d="M${mx} ${f1(yy)} L${f1(mx + lw * (1 + i * 0.02))} ${f1(yy + 6)}" stroke="#7A2E1A" stroke-width="5"/>`; } return d; };
    return g(x, y + bob, s, `<ellipse cx="0" cy="36" rx="280" ry="22" fill="#000" opacity=".15"/>${layar(-120, 420, 150)}${layar(40, 500, 170)}${layar(170, 300, 110)}
      <path d="M-280 -60 Q-250 40 -200 40 L220 40 Q280 20 300 -90 L240 -40 L-220 -40Z" fill="${lm}"/><rect x="-230" y="-60" width="460" height="20" fill="${m ? "#5A4636" : "#9A6A3A"}"/><circle cx="250" cy="-30" r="14" fill="#F2D38A"/>`, 0);
  }
  // tempayan tanah liat
  function tempayan(x, y, s, o = {}) {
    const w = o.warna || "#B0683E";
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="110" ry="18" fill="#000" opacity=".2"/><path d="M-60 0 Q-130 -80 -100 -170 Q-80 -220 -50 -230 L50 -230 Q80 -220 100 -170 Q130 -80 60 0Z" fill="${w}"/>
      <path d="M40 -220 Q100 -170 96 -90 Q90 -30 50 0 L60 0 Q130 -80 100 -170 Q80 -220 50 -230Z" fill="#000" opacity=".15"/><rect x="-56" y="-252" width="112" height="28" rx="10" fill="${w}"/><path d="M-90 -150 Q0 -130 90 -150" stroke="#E2A07A" stroke-width="8" fill="none" opacity=".6"/>`);
  }
  // rumah panggung Melayu
  function rumahPanggung(x, y, s, P) {
    const m = malam(P);
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="200" ry="20" fill="${P.bayang}"/>${[-150, -50, 50, 150].map((a) => `<rect x="${a - 8}" y="-200" width="16" height="200" fill="${P.batang}"/>`).join("")}
      <rect x="-180" y="-380" width="360" height="190" fill="${m ? "#6A5444" : "#C99A6A"}"/><path d="M-220 -370 L0 -520 L220 -370Z" fill="${m ? "#5A4A3A" : "#9A6A3A"}"/><rect x="-60" y="-330" width="80" height="80" fill="${m ? P.jendela : "#7A5232"}" opacity="${m ? .8 : 1}"/><rect x="60" y="-330" width="70" height="140" fill="#7A5232"/>
      <path d="M100 -190 L160 0" stroke="${P.batang}" stroke-width="10"/>`);
  }
  // geladak kapal Eropa: papan geladak perspektif, pagar, tiang, tali, laut di cakrawala
  function dekKapal(w, h, P, t = 0, o = {}) {
    const hz = o.cakrawala ?? h * 0.42, ay = Math.sin(t * 0.9) * 10;
    let s = A.langit(P, w, h, t, { suryaX: w * 0.7, suryaY: h * 0.12 }) + A.awan(w * 0.25, h * 0.14, 1, P, .85) + A.awan(w * 0.75, h * 0.24, .7, P, .8);
    s += `<g transform="translate(0 ${f1(ay)})">${A.laut(w, hz, h - hz, P, t)}</g>`;
    s += `<path d="M-100 ${hz + 120} L${w + 100} ${hz + 120} L${w + 100} ${h} L-100 ${h}Z" fill="#A27650"/>`;
    for (let i = -6; i <= 6; i++) s += `<path d="M${w / 2 + i * 70} ${hz + 120} L${w / 2 + i * 320} ${h}" stroke="#7A5232" stroke-width="5" opacity=".6"/>`;
    for (let j = 1; j < 8; j++) s += `<rect x="-100" y="${f1(hz + 120 + Math.pow(j / 8, 1.5) * (h - hz - 120))}" width="${w + 200}" height="4" fill="#7A5232" opacity=".35"/>`;
    s += `<rect x="-100" y="${hz + 20}" width="${w + 200}" height="16" fill="#6A4630"/><rect x="-100" y="${hz + 100}" width="${w + 200}" height="24" fill="#6A4630"/>${[...Array(Math.ceil(w / 90) + 2)].map((_, i) => `<rect x="${-60 + i * 90}" y="${hz + 30}" width="12" height="76" fill="#7A5232"/>`).join("")}`;
    const mx = o.tiangX ?? w * 0.7;
    s += `<rect x="${mx - 24}" y="0" width="48" height="${hz + 300}" fill="#6A4630"/><path d="M${mx} 80 L${mx - 600} ${hz + 40} M${mx} 80 L${mx + 500} ${hz + 40} M${mx} 300 L${mx - 400} ${hz + 40}" stroke="#4A3A2A" stroke-width="5"/>
      <path d="M${mx - 300} 120 Q${mx} 90 ${mx + 300} 120 L${mx + 280} 420 Q${mx} 470 ${mx - 280} 420Z" fill="#F4EEDC" opacity=".95"/>`;
    return s;
  }
  // dapur pondok Inggris abad ke-18, hari hujan: dinding batu, perapian + panci tembaga, jendela berhujan, meja kayu
  function dapurPondok(w, h, P, t = 0, o = {}) {
    const my = o.meja ?? h * 0.66, r = acak(29);
    let s = `<rect width="${w}" height="${h}" fill="#8A8278"/>`;
    for (let j = 0; j < 22; j++) for (let i = 0; i < w / 120 + 1; i++) { const bx = i * 120 + (j % 2) * 60 - 60; s += `<rect x="${bx + 3}" y="${j * 60 + 3}" width="114" height="54" rx="10" fill="${["#9A9288", "#8E867C", "#A39B90"][Math.floor(r() * 3)]}"/>`; }
    const jx = o.jendelaX ?? w * 0.58, jy = my - 900;
    s += `<rect x="${jx - 20}" y="${jy - 20}" width="400" height="460" rx="8" fill="#5A4232"/><g>${`<svg x="${jx}" y="${jy}" width="360" height="420"><rect width="360" height="420" fill="#8A98A6"/>${A.bukit(360, 300, 60, 3, "#6E7E78")}${A.hujan(360, 420, t, P, { deras: .7 })}</svg>`}</g>
      <rect x="${jx + 174}" y="${jy}" width="12" height="420" fill="#5A4232"/><rect x="${jx}" y="${jy + 200}" width="360" height="12" fill="#5A4232"/>`;
    const fx = o.apiX ?? w * 0.2, fl = 1 + 0.08 * Math.sin(t * 9);
    s += `<rect x="${fx - 220}" y="${my - 700}" width="440" height="700" fill="#6E665C"/><rect x="${fx - 250}" y="${my - 720}" width="500" height="40" fill="#5A4A3A"/><rect x="${fx - 160}" y="${my - 460}" width="320" height="460" rx="30" fill="#2A1E18"/>
      <g transform="translate(${fx} ${my - 20}) scale(${f2(fl)})"><path d="M-80 0 Q-90 -100 -30 -180 Q-10 -110 14 -130 Q50 -190 40 -240 Q110 -140 80 0Z" fill="#F28C38"/><path d="M-40 0 Q-40 -70 0 -120 Q14 -70 40 -80 Q50 -50 40 0Z" fill="#FFD36A"/></g>
      <path d="M${fx} ${my - 460} L${fx} ${my - 300}" stroke="#3A3A3A" stroke-width="6"/><path d="M${fx - 90} ${my - 300} L${fx + 90} ${my - 300} L${fx + 70} ${my - 180} Q${fx} ${my - 160} ${fx - 70} ${my - 180}Z" fill="#B8703A"/>`;
    for (let i = 0; i < 3; i++) s += `<path d="M${jx - 260 + i * 80} ${my - 980} L${jx - 260 + i * 80} ${my - 900}" stroke="#3A3A3A" stroke-width="4"/><circle cx="${jx - 260 + i * 80}" cy="${my - 860}" r="${36 - i * 4}" fill="#C27A42"/><rect x="${jx - 262 + i * 80}" y="${my - 900}" width="4" height="20" fill="#3A3A3A"/>`;
    s += `<rect x="0" y="${my}" width="${w}" height="${h - my}" fill="#7A5232"/><rect x="0" y="${my}" width="${w}" height="20" fill="#9A6A42"/>`;
    return s + `<rect width="${w}" height="${h}" fill="#4A5A6A" opacity=".12"/>`;
  }
  function jamur(x, y, s) { return g(x, y, s, `<rect x="-14" y="-50" width="28" height="56" rx="12" fill="#EADCC4"/><path d="M-60 -40 Q-60 -100 0 -104 Q60 -100 60 -40Z" fill="#9A6A44"/><circle cx="-20" cy="-70" r="8" fill="#B88A62"/>`); }
  function kenari(x, y, s) { return g(x, y, s, `<ellipse cx="0" cy="0" rx="40" ry="34" fill="#B88A54"/><path d="M0 -34 Q-8 0 0 34 M-30 -14 Q-10 -6 -30 6 M30 -14 Q10 -6 30 6" stroke="#8A5E30" stroke-width="5" fill="none"/>`); }
  function tiram(x, y, s) { return g(x, y, s, `<path d="M-60 0 Q-50 -50 0 -46 Q56 -44 60 0 Q30 30 0 26 Q-34 28 -60 0Z" fill="#9AA0A0"/><path d="M-40 -6 Q0 -30 40 -6 Q0 14 -40 -6Z" fill="#E9E1D4"/><circle cx="4" cy="-6" r="8" fill="#F4EEDC"/>`); }
  function tomat(x, y, s, rot = 0) { return g(x, y, s, `<circle r="60" fill="#E2362E"/><circle cx="-22" cy="-22" r="16" fill="#FF7A6A" opacity=".7"/><path d="M0 -58 L-20 -76 M0 -58 L20 -76 M0 -58 L-30 -54 M0 -58 L30 -54 M0 -58 L0 -84" stroke="#3E8A3A" stroke-width="9" stroke-linecap="round"/>`, rot); }
  // dapur pertanian Amerika awal 1800-an: dinding papan terang, jendela ladang, tungku besi, panci
  function dapurAmerika(w, h, P, t = 0, o = {}) {
    const my = o.meja ?? h * 0.68;
    let s = `<rect width="${w}" height="${h}" fill="#E6D2AE"/>`;
    for (let i = 0; i < w / 80; i++) s += `<rect x="${i * 80}" y="0" width="4" height="${my}" fill="#C9AE84"/>`;
    const jx = o.jendelaX ?? w * 0.1;
    s += `<rect x="${jx - 16}" y="${my - 980}" width="452" height="512" fill="#8A5A34"/><svg x="${jx}" y="${my - 964}" width="420" height="480">${A.langit(P, 420, 480, t, { suryaX: 320, suryaY: 90 })}${A.bukit(420, 300, 60, 6, P.tengah, 480)}<rect y="330" width="420" height="150" fill="#D9C46A"/>${[...Array(9)].map((_, i) => `<path d="M${i * 50} 340 L${i * 50 + 10} 480" stroke="#B8A04A" stroke-width="6"/>`).join("")}</svg>
      <rect x="${jx + 204}" y="${my - 964}" width="12" height="480" fill="#8A5A34"/><rect x="${jx}" y="${my - 730}" width="420" height="12" fill="#8A5A34"/>`;
    const sx = o.tungkuX ?? w * 0.7;
    s += `<rect x="${sx - 30}" y="0" width="60" height="${my - 520}" fill="#3A3A3E"/><rect x="${sx - 200}" y="${my - 520}" width="400" height="520" rx="12" fill="#2E2E34"/><rect x="${sx - 160}" y="${my - 300}" width="320" height="180" rx="10" fill="#1E1E22"/><rect x="${sx - 140}" y="${my - 280}" width="280" height="140" fill="#F28C38" opacity="${f2(0.5 + 0.15 * Math.sin(t * 7))}"/>`;
    s += `<rect x="0" y="${my}" width="${w}" height="${h - my}" fill="#9A6A3E"/><rect x="0" y="${my}" width="${w}" height="20" fill="#B8844E"/>`;
    return s;
  }
  // panci masak berisi saus (warna), uap
  function panci(x, y, s, t = 0, o = {}) {
    const uap = [0, 1, 2].map((i) => { const u = ((t * 0.45 + i / 3) % 1); return `<path d="M${-60 + i * 60} ${f1(-170 - u * 140)} q-16 -34 0 -68 q16 -34 0 -68" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round" opacity="${f2(Math.sin(Math.PI * u) * 0.5)}"/>`; }).join("");
    return g(x, y, s, `<ellipse cx="0" cy="8" rx="200" ry="22" fill="#000" opacity=".22"/><path d="M-170 -160 L170 -160 L150 0 L-150 0Z" fill="#5A5E66"/><path d="M90 -160 L170 -160 L150 0 L80 0Z" fill="#4A4E56"/><rect x="-200" y="-140" width="40" height="16" rx="8" fill="#3A3A3E"/><rect x="160" y="-140" width="40" height="16" rx="8" fill="#3A3A3E"/>
      <ellipse cx="0" cy="-160" rx="170" ry="30" fill="#6A6E76"/><ellipse cx="0" cy="-160" rx="150" ry="22" fill="${o.isi || "#C8332A"}"/>${uap}`);
  }
  // pabrik saus awal 1900-an: dinding bata, ketel tembaga besar, pipa, jendela tinggi
  function pabrikSaus(w, h, P, t = 0, o = {}) {
    const lt = o.lantai ?? h * 0.7, r = acak(33);
    let s = `<rect width="${w}" height="${h}" fill="#9A5A42"/>`;
    for (let j = 0; j < 40; j++) for (let i = 0; i < w / 80 + 1; i++) s += `<rect x="${i * 80 + (j % 2) * 40 - 40 + 2}" y="${j * 40 + 2}" width="76" height="36" fill="${["#A6644A", "#94553E", "#AE6E52"][Math.floor(r() * 3)]}"/>`;
    for (let i = 0; i < 3; i++) s += `<rect x="${120 + i * (w - 240) / 3}" y="${lt - 1200}" width="260" height="520" rx="130" fill="#F4E6C8" opacity=".85"/>`;
    for (let i = 0; i < 3; i++) { const kx = 220 + i * (w - 300) / 3; s += `<ellipse cx="${kx}" cy="${lt - 150}" rx="190" ry="260" fill="#C27A42"/><ellipse cx="${kx - 60}" cy="${lt - 230}" rx="40" ry="140" fill="#E2A06A" opacity=".6"/><rect x="${kx - 14}" y="${lt - 700}" width="28" height="300" fill="#7A7A80"/><rect x="${kx - 120}" y="${lt - 40}" width="240" height="40" fill="#5A5A60"/>`; }
    s += `<path d="M0 ${lt - 760} H${w}" stroke="#6A6A70" stroke-width="30"/><rect x="0" y="${lt}" width="${w}" height="${h - lt}" fill="#6E6A66"/><rect x="0" y="${lt}" width="${w}" height="16" fill="#8A8682"/>`;
    return s;
  }
  // dapur rumah Indonesia malam: dinding keramik, jendela malam, rak kayu, kompor
  function dapurRumah(w, h, P, t = 0, o = {}) {
    const my = o.meja ?? h * 0.68, m = malam(P);
    let s = `<rect width="${w}" height="${h}" fill="${m ? "#7A8A82" : "#D9E2D6"}"/>`;
    for (let i = 0; i < w / 80 + 1; i++) for (let j = 0; j < 6; j++) s += `<rect x="${i * 80 + 2}" y="${my - 480 + j * 80 + 2}" width="76" height="76" fill="${m ? "#8EA096" : "#E9F0E6"}"/>`;
    const jx = o.jendelaX ?? w * 0.62;
    s += `<rect x="${jx - 16}" y="${my - 1000}" width="372" height="432" fill="#6A4A30"/><svg x="${jx}" y="${my - 984}" width="340" height="400">${A.langit(P, 340, 400, t, { suryaX: 260, suryaY: 90 })}${A.rumahKampung(170, 400, 0.45, P)}</svg><rect x="${jx + 164}" y="${my - 984}" width="12" height="400" fill="#6A4A30"/>`;
    s += `<rect x="${o.rakX ?? 80}" y="${my - 640}" width="${o.rakW ?? 640}" height="22" fill="#8A5A34"/><rect x="${o.rakX ?? 80}" y="${my - 620}" width="${o.rakW ?? 640}" height="10" fill="#000" opacity=".15"/>`;
    s += `<rect x="0" y="${my}" width="${w}" height="${h - my}" fill="${m ? "#5E5048" : "#C9B49A"}"/><rect x="0" y="${my}" width="${w}" height="20" fill="${m ? "#7A6A60" : "#E2D2BC"}"/>`;
    s += `<rect width="${w}" height="${h}" fill="#FFB860" opacity="${m ? .08 : 0}"/>`;
    return s;
  }
  // gerobak nasi goreng malam: lampu bohlam gantung, kompor + wajan berapi, etalase
  function gerobakNasgor(x, y, s, P, t = 0, o = {}) {
    const id = uid("gn"), fl = 1 + 0.1 * Math.sin(t * 11);
    return g(x, y, s, `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#FFE6A0" stop-opacity=".6"/><stop offset="1" stop-color="#FFE6A0" stop-opacity="0"/></radialGradient></defs>
      <circle cx="0" cy="-700" r="520" fill="url(#${id})"/><path d="M0 -900 L0 -760" stroke="#2A2A2A" stroke-width="5"/><circle cx="0" cy="-736" r="30" fill="#FFF1C0"/>
      <ellipse cx="0" cy="10" rx="420" ry="26" fill="#000" opacity=".25"/><rect x="-380" y="-260" width="760" height="250" rx="10" fill="#C24A3A"/><rect x="-380" y="-260" width="760" height="30" fill="#E8D2A0"/><rect x="-360" y="-200" width="300" height="150" fill="#CFE3E0" opacity=".3"/>
      <rect x="-400" y="-900" width="16" height="900" fill="#5A5A5A"/><rect x="384" y="-900" width="16" height="900" fill="#5A5A5A"/><path d="M-440 -900 L440 -900 L400 -960 L-400 -960Z" fill="#E8D2A0"/>
      <circle cx="-260" cy="0" r="54" fill="#2E2E2E"/><circle cx="260" cy="0" r="54" fill="#2E2E2E"/>
      <g transform="translate(180 -270) scale(${f2(fl)})"><path d="M-80 0 Q-70 -50 -30 -70 Q-20 -30 0 -50 Q20 -80 40 -60 Q60 -40 80 0Z" fill="#4A8AE8" opacity=".85"/><path d="M-50 0 Q-40 -30 -10 -40 Q0 -20 20 -30 Q40 -20 50 0Z" fill="#F28C38"/></g>`);
  }
  // wajan berisi nasi goreng + uap & percikan (pusat dasar wajan di x,y)
  function wajan(x, y, s, t = 0) {
    const uap = [0, 1, 2, 3].map((i) => { const u = ((t * 0.6 + i / 4) % 1); return `<path d="M${-90 + i * 60} ${f1(-60 - u * 200)} q-16 -34 0 -68 q16 -34 0 -68" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round" opacity="${f2(Math.sin(Math.PI * u) * 0.5)}"/>`; }).join("");
    let nasi = ""; const r = acak(9); for (let i = 0; i < 26; i++) { const a = r() * Math.PI, d = r() * 150; nasi += `<circle cx="${f1(Math.cos(a) * d)}" cy="${f1(-36 - Math.sin(a) * d * 0.25 - Math.abs(Math.sin(t * 9 + i)) * 4)}" r="${f1(9 + r() * 7)}" fill="${["#C9843E", "#B5702E", "#E2A050", "#E86A3A", "#5FA05A"][Math.floor(r() * 5)]}"/>`; }
    return g(x, y, s, `<path d="M-230 -40 Q0 70 230 -40Z" fill="#3A3A3E"/><path d="M230 -40 L360 -90" stroke="#3A3A3E" stroke-width="18" stroke-linecap="round"/><ellipse cx="0" cy="-40" rx="230" ry="36" fill="#4A4A50"/>${nasi}${uap}`);
  }

  Object.assign(A, { mata, botolSaus, botolKecap, botolKaca, tongIkan, ikan, mangkukBakso, warungBakso, gerobakGorengan, jung, tempayan, rumahPanggung, dekKapal, dapurPondok,
    jamur, kenari, tiram, tomat, dapurAmerika, panci, pabrikSaus, dapurRumah, gerobakNasgor, wajan });
})(typeof window !== "undefined" ? window : globalThis);

/* ---------- Tambahan Yoga, 17 Nov 2026 — video mitos micin (I-008) ----------
 * butir & hujan micin, toples micin TANPA merek, surat 1968 (baris = coretan abstrak), gerobak angkringan malam, mesin tik,
 * papan detektif + botol arak + pengocok garam, lab 1969 (cahaya putih dingin), tikus lab imut (tanpa luka), kandang,
 * jarum suntik kartun (tanpa darah), sendok, otak kartun, ruang uji tersamar + mangkuk sup bertanda ○/△, papan klip,
 * ruang arsip + stempel karet (simbol abstrak, tanpa huruf), map arsip, keju, molekul kembar, dapur terang, panggung sorot.
 */
(function (root) {
  const A = (typeof module !== "undefined" && module.exports && module.exports.PALET) ? module.exports : root.ASET;
  let _n = 0; const uid = (p) => `${p}m${++_n}`;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f2(rot)}) scale(${f2(s)})">${isi}</g>`;
  const malam = (P) => P.nama === "malam";

  // butir kristal micin (jarum heksagonal pendek, berkilau). o: {kilau 0..1}
  function butirMicin(x, y, s, rot = 0, o = {}) {
    const k = o.kilau ?? 0.6;
    return g(x, y, s, `<path d="M-7 -20 L7 -22 L11 18 L-3 22 L-11 16Z" fill="#F4FAFF"/><path d="M7 -22 L11 18 L-3 22Z" fill="#CFE2EE"/><path d="M-7 -20 L-3 -4 L-11 16Z" fill="#FFFFFF" opacity=".9"/>
      ${k > 0 ? `<path d="M0 -34 L3 -24 L13 -21 L3 -18 L0 -8 L-3 -18 L-13 -21 L-3 -24Z" fill="#FFFFFF" opacity="${f2(k)}"/>` : ""}`, rot);
  }
  // hujan micin slow-motion: butir jatuh pelan & berputar di kotak (x0..x0+w, y0..y0+h). o: {n, cepat, benih, skala}
  function hujanMicin(x0, y0, w, h, t = 0, o = {}) {
    const r = acak(o.benih || 41), n = o.n || 40, v = o.cepat ?? 0.12; let s = "";
    for (let i = 0; i < n; i++) {
      const bx = r() * w, fase = r(), sc = (o.skala || 1) * (0.6 + r() * 0.9), rs = (r() - 0.5) * 120, q = (fase + t * v * (0.7 + r() * 0.6)) % 1;
      s += butirMicin(x0 + bx + Math.sin(t * 0.8 + i) * 14, y0 + q * h, sc, rs * t + i * 37, { kilau: 0.3 + 0.7 * Math.abs(Math.sin(t * 2.4 + i)) });
    }
    return s;
  }
  // tumpukan butir micin (di sendok/piring). lebar ~w
  function gunungMicin(x, y, s, w = 120, benih = 5) {
    const r = acak(benih); let q = `<path d="M${-w / 2} 0 Q0 ${-w * 0.55} ${w / 2} 0Z" fill="#EAF3F8"/>`;
    for (let i = 0; i < 30; i++) { const a = r() * 2 - 1, hgt = (1 - a * a) * w * 0.36; q += butirMicin(a * w * 0.42, -r() * hgt, 0.32 + r() * 0.22, r() * 360, { kilau: r() < 0.2 ? 0.7 : 0 }); }
    return g(x, y, s, q);
  }
  // toples micin polos (tanpa merek, label kosong)
  function toplesMicin(x, y, s, o = {}) {
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="110" ry="16" fill="#000" opacity=".18"/><rect x="-96" y="-250" width="192" height="250" rx="34" fill="#DDEEF4" opacity=".55"/>
      <rect x="-84" y="-170" width="168" height="160" rx="26" fill="#F6FBFF"/>${gunungMicin(0, -150, 1, 150, 9)}<rect x="-70" y="-120" width="140" height="70" rx="12" fill="${o.label || "#FFC93C"}" opacity=".9"/>
      <rect x="-104" y="-292" width="208" height="54" rx="18" fill="${o.tutup || "#E2483E"}"/><rect x="-104" y="-292" width="208" height="14" rx="7" fill="#FFFFFF" opacity=".25"/><path d="M-80 -230 L-80 -30" stroke="#FFFFFF" stroke-width="12" opacity=".5" stroke-linecap="round"/>`, o.rot || 0);
  }
  // surat 1968: kertas ketik, baris = coretan abstrak, cap pos merah "1968". o: {rot, cap 0..1, lipat 0..1, gosong 0..1}
  function surat1968(x, y, s, o = {}) {
    const r = acak(o.benih || 19), cap = cl(o.cap ?? 1), gs = cl(o.gosong || 0); let baris = "";
    for (let i = 0; i < 9; i++) { const yy = -140 + i * 34, pj = i === 8 ? 90 : 170 + r() * 60; let d = `M-120 ${yy}`; for (let xx = -120; xx < -120 + pj; xx += 18) d += ` q4 ${f1(-5 - r() * 4)} 9 0 t9 0`; baris += `<path d="${d}" stroke="#4A4A5A" stroke-width="5" fill="none" opacity=".55" stroke-linecap="round"/>`; }
    const sobek = gs > 0 ? `<path d="M150 ${f1(200 - gs * 140)} Q110 ${f1(170 - gs * 120)} 90 200 L150 200Z" fill="#2A1A10" opacity=".85"/><path d="M150 ${f1(196 - gs * 140)} Q112 ${f1(166 - gs * 120)} 94 196" stroke="#FF8A3A" stroke-width="5" fill="none"/>` : "";
    return g(x, y, s, `<rect x="-150" y="-200" width="300" height="400" rx="6" fill="#000" opacity=".18" transform="translate(8 10)"/><rect x="-150" y="-200" width="300" height="400" rx="6" fill="#F6EFDC"/>
      <path d="M-150 ${f1(-20 + (o.lipat || 0) * 0)} L150 -20" stroke="#D9CFB4" stroke-width="3"/>${baris}
      ${cap > 0 ? `<g transform="translate(78 132) rotate(-14) scale(${f2(cap)})" opacity="${f2(cap)}"><circle r="58" fill="none" stroke="#C2333A" stroke-width="7"/><circle r="44" fill="none" stroke="#C2333A" stroke-width="3"/><text y="14" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="34" fill="#C2333A">1968</text></g>` : ""}${sobek}`, o.rot || 0);
  }
  // gerobak angkringan malam: atap terpal, lampu teplok, ceret, nasi bungkus, sate; o: {}
  function gerobakAngkringan(x, y, s, P, t = 0) {
    const id = uid("ak"), fl = 1 + 0.06 * Math.sin(t * 9) + 0.03 * Math.sin(t * 23);
    let sate = ""; for (let i = 0; i < 7; i++) sate += `<path d="M${-250 + i * 26} -300 L${-262 + i * 26} -390" stroke="#C9A46A" stroke-width="5"/><circle cx="${-256 + i * 26}" cy="-366" r="10" fill="#9A4A2A"/><circle cx="${-258 + i * 26}" cy="-344" r="10" fill="#B0602E"/>`;
    let bks = ""; for (let i = 0; i < 6; i++) bks += `<path d="M${40 + (i % 3) * 64} ${-300 - Math.floor(i / 3) * 34} l28 -26 l28 26 l-28 14Z" fill="${i % 2 ? "#C9B07A" : "#8FB07A"}"/>`;
    return g(x, y, s, `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#FFD38A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD38A" stop-opacity="0"/></radialGradient></defs>
      <circle cx="0" cy="-560" r="${f1(560 * fl)}" fill="url(#${id})"/><ellipse cx="0" cy="12" rx="470" ry="30" fill="#000" opacity=".25"/>
      <path d="M-470 -820 L470 -820 L420 -720 L-420 -720Z" fill="#3E7A9A"/><path d="M-470 -820 L470 -820 L470 -800 L-470 -800Z" fill="#5A9AB8"/><path d="M-420 -720 L-420 0 M420 -720 L420 0" stroke="#5A4030" stroke-width="18"/>
      <rect x="-440" y="-300" width="880" height="34" fill="#8A5A34"/><rect x="-420" y="-266" width="840" height="230" fill="#6A4428"/><rect x="-420" y="-266" width="840" height="20" fill="#000" opacity=".15"/>
      <circle cx="-300" cy="0" r="46" fill="#2E2E2E"/><circle cx="300" cy="0" r="46" fill="#2E2E2E"/>${sate}${bks}
      <g transform="translate(300 -300)"><ellipse cx="0" cy="-6" rx="70" ry="16" fill="#2A2A2A"/><path d="M-60 -10 Q-66 -120 0 -126 Q66 -120 60 -10Z" fill="#9AA0A6"/><path d="M58 -70 Q110 -84 120 -130" stroke="#9AA0A6" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M-40 -110 Q0 -150 40 -110" stroke="#6A7076" stroke-width="10" fill="none"/></g>
      <path d="M0 -720 L0 -640" stroke="#3A3A3A" stroke-width="4"/><g transform="translate(0 -600) scale(${f2(fl)})"><ellipse cx="0" cy="0" rx="34" ry="44" fill="#FFE6A0" opacity=".9"/><path d="M-8 6 Q-10 -20 0 -32 Q10 -20 8 6Z" fill="#FF9A3A"/></g><rect x="-26" y="34" width="52" height="30" rx="6" fill="#B08A4A" transform="translate(0 -600)"/>`);
  }
  // mesin tik 1960-an (kertas keluar dari rol). o: {ketik 0..1 (baris tumbuh), warna}
  function mesinTik(x, y, s, t = 0, o = {}) {
    const kt = cl(o.ketik ?? 0.5); let baris = ""; for (let i = 0; i < 6; i++) { const pj = cl(kt * 6 - i) * 200; if (pj > 0) baris += `<path d="M-100 ${-330 + i * 26} h${f1(pj)}" stroke="#5A5A66" stroke-width="5" stroke-dasharray="10 6" opacity=".6"/>`; }
    let tuts = ""; for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { const tk = Math.sin(t * 17 + r * 3 + c * 7) > 0.92 ? 4 : 0; tuts += `<circle cx="${-160 + c * 40 + r * 14}" cy="${-70 + r * 34 + tk}" r="13" fill="#2E2E34"/><circle cx="${-160 + c * 40 + r * 14}" cy="${-72 + r * 34 + tk}" r="9" fill="#E9E2D0"/>`; }
    const geser = (kt * 6 % 1) * 30;
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="260" ry="20" fill="#000" opacity=".22"/><rect x="${-130 + geser}" y="-380" width="260" height="210" fill="#F6EFDC"/>${baris.replace(/M-100/g, `M${-100 + geser}`)}
      <path d="M-230 0 L-200 -150 L200 -150 L230 0Z" fill="${o.warna || "#4E7A6A"}"/><rect x="${-250 + geser}" y="-190" width="500" height="48" rx="22" fill="#2E3A36"/><circle cx="${-262 + geser}" cy="-166" r="20" fill="#C9C2B0"/>
      <path d="M-200 -150 L200 -150 L190 -120 L-190 -120Z" fill="#000" opacity=".15"/>${tuts}`);
  }
  // papan gabus detektif (pusat x,y). o: {w, h}
  function papanDetektif(x, y, s, o = {}) {
    const w = o.w || 820, h = o.h || 620, r = acak(o.benih || 23); let bintik = "";
    for (let i = 0; i < 90; i++) bintik += `<circle cx="${f1(-w / 2 + 30 + r() * (w - 60))}" cy="${f1(-h / 2 + 30 + r() * (h - 60))}" r="${f1(2 + r() * 3)}" fill="#9A6A3A" opacity=".5"/>`;
    return g(x, y, s, `<rect x="${-w / 2 - 26}" y="${-h / 2 - 26}" width="${w + 52}" height="${h + 52}" rx="14" fill="#6A4428"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#C99A62"/>${bintik}`);
  }
  // paku pines + kartu foto kosong di papan
  function kartuPin(x, y, s, isi = "", o = {}) {
    return g(x, y, s, `<rect x="-120" y="-130" width="240" height="260" rx="8" fill="#000" opacity=".18" transform="translate(6 8)"/><rect x="-120" y="-130" width="240" height="260" rx="8" fill="${o.warna || "#F6EFDC"}"/>${isi}<circle cx="0" cy="-118" r="16" fill="#D63A3A"/><circle cx="-5" cy="-123" r="5" fill="#FFFFFF" opacity=".6"/>`, o.rot || 0);
  }
  // botol arak masak polos (tanpa label huruf)
  function botolArak(x, y, s, o = {}) {
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="56" ry="10" fill="#000" opacity=".2"/><path d="M-50 0 L-50 -150 Q-50 -190 -22 -210 L-22 -270 L22 -270 L22 -210 Q50 -190 50 -150 L50 0Z" fill="${o.warna || "#7A4A2A"}"/>
      <rect x="-26" y="-296" width="52" height="30" rx="6" fill="#C2333A"/><rect x="-42" y="-130" width="84" height="80" rx="8" fill="#F2E2B8"/><circle cx="0" cy="-90" r="22" fill="#C2333A" opacity=".8"/><path d="M-34 -170 L-34 -20" stroke="#FFFFFF" stroke-width="10" opacity=".25" stroke-linecap="round"/>`, o.rot || 0);
  }
  // pengocok garam
  function pengocokGaram(x, y, s, o = {}) {
    let lub = ""; for (let i = 0; i < 5; i++) lub += `<circle cx="${-24 + i * 12}" cy="${-206 + (i % 2) * 8}" r="4" fill="#5A5A66"/>`;
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="56" ry="10" fill="#000" opacity=".2"/><path d="M-46 0 L-40 -170 L40 -170 L46 0Z" fill="#E6F0F4" opacity=".8"/><path d="M-42 -10 L-38 -110 L38 -110 L42 -10Z" fill="#FFFFFF"/>
      <path d="M-44 -170 Q-44 -220 0 -224 Q44 -220 44 -170Z" fill="#B8BEC6"/>${lub}<path d="M-28 -150 L-30 -20" stroke="#FFFFFF" stroke-width="10" opacity=".6" stroke-linecap="round"/>`, o.rot || 0);
  }
  // lab riset 1969: dinding putih kebiruan, lampu neon, rak kaca labu; o: {meja (y)}
  function lab1969(w, h, P, t = 0, o = {}) {
    const my = o.meja ?? h * 0.66, id = uid("lb"), r = acak(o.benih || 29);
    let s = `<defs><radialGradient id="${id}" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#F4FBFF" stop-opacity=".5"/><stop offset="1" stop-color="#0A1A2A" stop-opacity=".35"/></radialGradient></defs>
      <rect width="${w}" height="${h}" fill="#C9DCE4"/>`;
    for (let i = 0; i < w / 120 + 1; i++) s += `<rect x="${i * 120}" y="${my - 520}" width="116" height="520" fill="#BCD2DC"/>`;
    for (let i = 0; i < 3; i++) { const lx = w * (0.2 + i * 0.3); s += `<rect x="${f1(lx - 150)}" y="120" width="300" height="26" rx="13" fill="#F4FBFF"/><path d="M${f1(lx - 150)} 146 L${f1(lx - 260)} ${my} L${f1(lx + 260)} ${my} L${f1(lx + 150)} 146Z" fill="#F4FBFF" opacity="${f2(0.08 + 0.02 * Math.sin(t * 40 + i))}"/>`; }
    for (const ry of [my - 860, my - 640]) { s += `<rect x="60" y="${ry}" width="${w - 120}" height="18" fill="#8AA4B2"/>`;
      for (let xx = 100; xx < w - 140; xx += 70 + r() * 60) { const tp = Math.floor(r() * 3), c = ["#7CCFC4", "#F28CB0", "#9AD0F0", "#FFE08A"][Math.floor(r() * 4)];
        s += tp === 0 ? `<path d="M${f1(xx)} ${ry} l-26 0 l8 -60 l0 -40 l36 0 l0 40 l8 60Z" fill="#E6F2F6" opacity=".8"/><path d="M${f1(xx - 20)} ${ry} l40 0 l-6 -40 l-28 0Z" fill="${c}" opacity=".8"/>`
          : tp === 1 ? `<rect x="${f1(xx - 22)}" y="${ry - 90}" width="44" height="90" rx="6" fill="#E6F2F6" opacity=".8"/><rect x="${f1(xx - 22)}" y="${ry - 50}" width="44" height="50" rx="6" fill="${c}" opacity=".75"/>`
          : `<circle cx="${f1(xx)}" cy="${ry - 34}" r="34" fill="#E6F2F6" opacity=".8"/><path d="M${f1(xx - 30)} ${ry - 30} a30 30 0 0 0 60 0Z" fill="${c}" opacity=".8"/><rect x="${f1(xx - 9)}" y="${ry - 100}" width="18" height="40" fill="#E6F2F6" opacity=".8"/>`; } }
    s += `<rect x="0" y="${my}" width="${w}" height="${h - my}" fill="#E8F0F2"/><rect x="0" y="${my}" width="${w}" height="24" fill="#FFFFFF"/><rect x="0" y="${my + 24}" width="${w}" height="16" fill="#000" opacity=".06"/>`;
    return s + `<rect width="${w}" height="${h}" fill="url(#${id})"/>`;
  }
  // labu erlenmeyer berisi cairan (untuk Tebe bersembunyi)
  function labu(x, y, s, o = {}) {
    return g(x, y, s, `<path d="M-30 -260 L30 -260 L30 -170 L120 -10 Q126 0 110 0 L-110 0 Q-126 0 -120 -10 L-30 -170Z" fill="#E6F2F6" opacity=".55"/><path d="M-84 -70 L84 -70 L118 -8 Q120 0 108 0 L-108 0 Q-120 0 -118 -8Z" fill="${o.isi || "#7CCFC4"}" opacity=".85"/>
      <rect x="-38" y="-280" width="76" height="22" rx="8" fill="#E6F2F6"/><path d="M-14 -240 L-14 -170 L-90 -20" stroke="#FFFFFF" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/>`);
  }
  // tikus lab bayi imut (merah muda, tanpa luka). o: {lihat -1..1, kedip, tidur}
  function tikusLab(x, y, s, t = 0, o = {}) {
    const ek = Math.sin(t * 3 + x) * 10, kd = Math.sin(t * 1.7 + x * 0.1) > 0.96 ? 0.15 : 1, lx = (o.lihat || 0) * 4, nap = Math.sin(t * 5 + x) * 2;
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="70" ry="10" fill="#000" opacity=".18"/><path d="M-50 -16 Q-110 ${f1(-10 + ek)} -130 ${f1(-40 + ek)}" stroke="#F2A6B4" stroke-width="7" fill="none" stroke-linecap="round"/>
      <ellipse cx="-6" cy="${f1(-34 - nap * 0.3)}" rx="62" ry="${f1(38 + nap * 0.4)}" fill="#F9C9D2"/><ellipse cx="-14" cy="-22" rx="40" ry="16" fill="#FBDDE3"/>
      <circle cx="44" cy="-54" r="34" fill="#F9C9D2"/><circle cx="30" cy="-86" r="20" fill="#F9C9D2"/><circle cx="30" cy="-86" r="12" fill="#F2A6B4"/><circle cx="62" cy="-82" r="16" fill="#F9C9D2"/><circle cx="62" cy="-82" r="9" fill="#F2A6B4"/>
      <ellipse cx="${f1(52 + lx)}" cy="-56" rx="6" ry="${f1(7 * kd)}" fill="#2A1A24"/><circle cx="${f1(54 + lx)}" cy="-59" r="2" fill="#FFFFFF"/><circle cx="78" cy="-46" r="7" fill="#E27A8E"/>
      <path d="M78 -44 l22 -6 M78 -44 l22 4" stroke="#C98A96" stroke-width="2"/><ellipse cx="-34" cy="-2" rx="12" ry="7" fill="#F2A6B4"/><ellipse cx="30" cy="-2" rx="12" ry="7" fill="#F2A6B4"/>`, o.rot || 0);
  }
  // kandang lab kawat (pusat bawah x,y)
  function kandangLab(x, y, s, isi = "", o = {}) {
    const w = o.w || 460, h = o.h || 260; let kawat = "";
    for (let xx = -w / 2 + 20; xx < w / 2; xx += 24) kawat += `<path d="M${xx} ${-h} L${xx} -20" stroke="#AEB8C0" stroke-width="3" opacity=".8"/>`;
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="${w / 2 + 30}" ry="18" fill="#000" opacity=".18"/><rect x="${-w / 2}" y="-40" width="${w}" height="40" rx="6" fill="#8AA4B2"/><rect x="${-w / 2 + 10}" y="-50" width="${w - 20}" height="16" fill="#E9D7A8"/>
      ${isi}${kawat}<path d="M${-w / 2} -20 L${-w / 2} ${-h} Q0 ${-h - 70} ${w / 2} ${-h} L${w / 2} -20" stroke="#9AA6AE" stroke-width="8" fill="none"/>`);
  }
  // jarum suntik kartun (kaca + plunger biru), mendatar menghadap kanan; tidak ada darah. o: {isi 0..1, warnaIsi, plunger 0..1}
  function jarumSuntik(x, y, s, rot = 0, o = {}) {
    const isi = cl(o.isi ?? 0.7), pl = cl(o.plunger ?? 0) * 90;
    return g(x, y, s, `<ellipse cx="0" cy="70" rx="260" ry="16" fill="#000" opacity="${o.bayang === false ? 0 : 0.15}"/>
      <rect x="${-290 + pl}" y="-14" width="120" height="28" rx="8" fill="#5A9AD0"/><rect x="${-320 + pl}" y="-56" width="30" height="112" rx="10" fill="#3E7AB8"/>
      <rect x="-180" y="-52" width="300" height="104" rx="22" fill="#E8F4FA" opacity=".85"/><rect x="${f1(-170 + pl * 0.6)}" y="-42" width="${f1((280 - pl * 0.6) * isi)}" height="84" rx="16" fill="${o.warnaIsi || "#BFE3F2"}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${-120 + i * 50} -52 L${-120 + i * 50} -26" stroke="#5A7A90" stroke-width="5"/>`).join("")}
      <rect x="-196" y="-70" width="24" height="140" rx="10" fill="#5A9AD0"/><path d="M120 -26 L170 -14 L170 14 L120 26Z" fill="#9ACAE0"/><path d="M170 -5 L320 -1 L320 1 L170 5Z" fill="#B8C4CC"/>
      <path d="M-150 -34 L90 -34" stroke="#FFFFFF" stroke-width="10" opacity=".7" stroke-linecap="round"/>`, rot);
  }
  // sendok makan (cekung menghadap atas, gagang ke kiri-bawah); o: {isi: "micin" | "nasi" | null}
  function sendok(x, y, s, rot = 0, o = {}) {
    let isi = "";
    if (o.isi === "micin") isi = gunungMicin(70, -12, 1.1, 170, 7);
    if (o.isi === "nasi") { const r = acak(3); for (let i = 0; i < 20; i++) isi += `<circle cx="${f1(10 + r() * 120)}" cy="${f1(-14 - r() * 34)}" r="${f1(9 + r() * 6)}" fill="${["#C9843E", "#E2A050", "#B5702E", "#5FA05A"][Math.floor(r() * 4)]}"/>`; }
    return g(x, y, s, `<path d="M-300 30 Q-140 6 -10 -4 L-10 8 Q-140 22 -300 44Z" fill="#B8C4CC"/><path d="M-300 30 Q-140 6 -10 -4" stroke="#E6EEF2" stroke-width="6" fill="none"/>
      <ellipse cx="70" cy="0" rx="110" ry="40" fill="#C9D4DA"/><ellipse cx="70" cy="-6" rx="96" ry="28" fill="#E6EEF2"/>${isi}<path d="M0 -20 Q40 -30 80 -26" stroke="#FFFFFF" stroke-width="7" fill="none" opacity=".7"/>`, rot);
  }
  // otak kartun imut (merah muda). o: {retak 0..1, kedip 0..1 (redup), mata, tanya 0..1}
  function otakKartun(x, y, s, t = 0, o = {}) {
    const rt = cl(o.retak || 0), red = cl(o.kedip || 0), id = uid("ot");
    const retak = rt > 0 ? `<path d="M10 -150 L-6 -100 L22 -70 L-4 -20 L18 20" stroke="#7A2A3A" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="320" stroke-dashoffset="${f1(320 * (1 - rt))}"/>` : "";
    const tn = cl(o.tanya || 0);
    return g(x, y, s, `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#FF9AC0" stop-opacity=".6"/><stop offset="1" stop-color="#FF9AC0" stop-opacity="0"/></radialGradient></defs>
      <circle r="${f1(260 * (1 - red * 0.6))}" fill="url(#${id})" opacity="${f2(1 - red * 0.7)}"/>
      <g opacity="${f2(1 - red * 0.35)}"><path d="M-150 30 Q-200 -40 -150 -100 Q-140 -170 -60 -180 Q0 -220 60 -180 Q140 -170 150 -100 Q200 -40 150 30 Q120 90 40 80 Q0 110 -40 80 Q-120 90 -150 30Z" fill="#F7A9C2"/>
      <path d="M0 -190 Q-10 -60 0 84" stroke="#E07C9C" stroke-width="10" fill="none"/><path d="M-120 -90 Q-80 -110 -60 -70 Q-40 -30 -90 -10 M-110 30 Q-70 0 -40 40 M60 -140 Q100 -120 90 -80 Q80 -40 120 -30 M40 0 Q80 -10 100 30" stroke="#E07C9C" stroke-width="9" fill="none" stroke-linecap="round"/>
      ${o.mata !== false ? `<circle cx="-50" cy="-30" r="16" fill="#2A1A24"/><circle cx="50" cy="-30" r="16" fill="#2A1A24"/><circle cx="-45" cy="-36" r="5" fill="#FFFFFF"/><circle cx="55" cy="-36" r="5" fill="#FFFFFF"/><path d="M-26 14 Q0 ${f1(30 - rt * 34)} 26 14" stroke="#2A1A24" stroke-width="7" fill="none" stroke-linecap="round"/>` : ""}${retak}</g>
      ${tn > 0 ? `<g transform="translate(0 ${f1(-290 - Math.sin(t * 2) * 10)}) scale(${f2(tn)})"><circle r="70" fill="#FFF4DC"/><text y="34" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="100" fill="#B3262E">?</text></g>` : ""}`);
  }
  // ruang uji tersamar modern: dinding biru lembut, panel akustik, meja panjang; o: {meja (y)}
  function ruangUji(w, h, P, t = 0, o = {}) {
    const my = o.meja ?? h * 0.66;
    let s = `<rect width="${w}" height="${h}" fill="#BFD6E6"/>`;
    for (let i = 0; i < w / 220 + 1; i++) s += `<rect x="${i * 220 + 30}" y="${my - 980}" width="160" height="420" rx="18" fill="#AFC9DC"/>`;
    s += `<rect x="0" y="${my - 520}" width="${w}" height="520" fill="#A9C4D8"/><rect x="${w * 0.62}" y="${my - 900}" width="280" height="200" rx="16" fill="#E8F2F8"/><circle cx="${w * 0.62 + 140}" cy="${my - 800}" r="60" fill="#FFFFFF" opacity=".6"/><path d="M${w * 0.62 + 140} ${my - 800} l0 -40 M${w * 0.62 + 140} ${my - 800} l26 10" stroke="#5A7A90" stroke-width="7" stroke-linecap="round" transform="rotate(${f1(t * 6)} ${w * 0.62 + 140} ${my - 800})"/>`;
    s += `<rect x="0" y="${my}" width="${w}" height="${h - my}" fill="#E9EEF0"/><rect x="0" y="${my}" width="${w}" height="26" fill="#FFFFFF"/><rect x="0" y="${my + 26}" width="${w}" height="14" fill="#000" opacity=".06"/>`;
    return s;
  }
  // mangkuk sup polos bertanda ○ / △ (tanpa huruf). o: {tanda: "lingkaran"|"segitiga", uap}
  function mangkukSup(x, y, s, t = 0, o = {}) {
    const tanda = o.tanda === "segitiga" ? `<path d="M0 -76 L22 -38 L-22 -38Z" fill="none" stroke="#2F7AC2" stroke-width="7" stroke-linejoin="round"/>` : `<circle cx="0" cy="-54" r="20" fill="none" stroke="#E2483E" stroke-width="7"/>`;
    const uap = [0, 1].map((i) => { const u = ((t * 0.4 + i / 2) % 1); return `<path d="M${-24 + i * 48} ${f1(-110 - u * 110)} q-12 -26 0 -52 q12 -26 0 -52" stroke="#FFFFFF" stroke-width="8" fill="none" stroke-linecap="round" opacity="${f2(Math.sin(Math.PI * u) * 0.55)}"/>`; }).join("");
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="130" ry="16" fill="#000" opacity=".16"/><path d="M-130 -100 Q-120 10 0 12 Q120 10 130 -100Z" fill="#FFFFFF"/><ellipse cx="0" cy="-100" rx="130" ry="26" fill="#E9EEF0"/><ellipse cx="0" cy="-100" rx="114" ry="19" fill="#E8C27A"/>${tanda}${uap}`);
  }
  // papan klip (dipegang Tebe). o: {centang 0..1}
  function papanKlip(x, y, s, o = {}) {
    const c = cl(o.centang || 0);
    return g(x, y, s, `<rect x="-70" y="-90" width="140" height="180" rx="10" fill="#B07A46"/><rect x="-58" y="-74" width="116" height="152" rx="4" fill="#FFFFFF"/><rect x="-30" y="-100" width="60" height="26" rx="8" fill="#8A9AA6"/>
      ${[0, 1, 2].map((i) => `<rect x="-40" y="${-46 + i * 40}" width="20" height="20" rx="4" fill="none" stroke="#8A9AA6" stroke-width="4"/><rect x="-8" y="${-40 + i * 40}" width="54" height="8" rx="4" fill="#C9D0D6"/>`).join("")}
      ${c > 0 ? `<path d="M-44 -36 L-32 -24 L-12 -56" stroke="#2E9A5A" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="60" stroke-dashoffset="${f1(60 * (1 - c))}"/>` : ""}`, o.rot || 0);
  }
  // ruang arsip sore: rak tinggi berisi map, sinar jendela hangat; o: {meja (y)}
  function ruangArsip(w, h, P, t = 0, o = {}) {
    const my = o.meja ?? h * 0.68, r = acak(o.benih || 37), id = uid("ra");
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".45"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></linearGradient></defs><rect width="${w}" height="${h}" fill="#C9B497"/>`;
    for (let k = 0; k < Math.ceil(w / 360); k++) { const x0 = k * 360 + 20;
      s += `<rect x="${x0}" y="${my - 1260}" width="320" height="1260" fill="#8A6444"/>`;
      for (let yy = my - 1230; yy < my - 60; yy += 160) { s += `<rect x="${x0}" y="${yy + 130}" width="320" height="18" fill="#6A4A30"/>`;
        let xx = x0 + 14; while (xx < x0 + 300) { const bw = 26 + r() * 20, bh = 100 + r() * 26; s += `<rect x="${f1(xx)}" y="${f1(yy + 130 - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="${["#D9B46A", "#C98A5A", "#9AB08A", "#E2CDA0", "#B8A07A"][Math.floor(r() * 5)]}"/><rect x="${f1(xx + bw / 2 - 6)}" y="${f1(yy + 130 - bh + 16)}" width="12" height="24" rx="3" fill="#FFFFFF" opacity=".55"/>`; xx += bw + 4; } } }
    s += `<path d="M${w * 0.15} 0 L${w * 0.55} 0 L${w * 0.95} ${my} L${w * 0.45} ${my}Z" fill="url(#${id})"/>`;
    for (let i = 0; i < 12; i++) { const u = (t * 0.05 + i / 12) % 1; s += `<circle cx="${f1(w * 0.3 + i * 60 + u * 200)}" cy="${f1(200 + ((i * 137) % 900) + Math.sin(t + i) * 20)}" r="4" fill="#FFF1C9" opacity="${f2(0.5 * Math.sin(Math.PI * u))}"/>`; }
    s += `<rect x="0" y="${my}" width="${w}" height="${h - my}" fill="#7A5232"/><rect x="0" y="${my}" width="${w}" height="20" fill="#9A6A42"/>`;
    return s;
  }
  // map arsip (tampak atas sedikit miring). isi = jejak stempel
  function mapArsip(x, y, s, isi = "") {
    return g(x, y, s, `<ellipse cx="0" cy="10" rx="330" ry="40" fill="#000" opacity=".2"/><path d="M-300 -10 L-260 -140 L-100 -140 L-80 -170 L60 -170 L80 -140 L300 -140 L320 -10Z" fill="#D9A94A"/><path d="M-320 0 L-280 -120 L300 -120 L330 0Z" fill="#F2C86A"/>
      <path d="M-260 -100 L270 -100" stroke="#FFFFFF" stroke-width="6" opacity=".35"/>${isi}`);
  }
  // stempel karet bergagang; o: {simbol: "bola"|"bintang"|"perisai", warna}
  function simbolStempel(jenis, warna) {
    if (jenis === "bintang") return `<path d="M0 -40 L11 -12 L40 -12 L17 6 L26 36 L0 18 L-26 36 L-17 6 L-40 -12 L-11 -12Z" fill="${warna}"/>`;
    if (jenis === "perisai") return `<path d="M0 -42 L36 -28 Q34 20 0 42 Q-34 20 -36 -28Z" fill="none" stroke="${warna}" stroke-width="9"/><path d="M-14 0 L-2 12 L18 -14" stroke="${warna}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    return `<circle r="36" fill="none" stroke="${warna}" stroke-width="9"/><path d="M-36 0 L36 0 M0 -36 Q-22 0 0 36 M0 -36 Q22 0 0 36" stroke="${warna}" stroke-width="6" fill="none"/>`;
  }
  function stempelKaret(x, y, s, o = {}) {
    const w = o.warna || "#2F7AC2";
    return g(x, y, s, `<rect x="-90" y="-30" width="180" height="30" rx="6" fill="#3A3A40"/><rect x="-80" y="-4" width="160" height="10" rx="4" fill="${w}"/><path d="M-30 -30 L-22 -120 L22 -120 L30 -30Z" fill="#8A5A34"/><ellipse cx="0" cy="-150" rx="58" ry="42" fill="#A86E40"/><ellipse cx="-14" cy="-162" rx="18" ry="10" fill="#FFFFFF" opacity=".3"/>`, o.rot || 0);
  }
  function jejakStempel(x, y, s, o = {}) {
    const w = o.warna || "#2F7AC2", a = cl(o.tampak ?? 1);
    return g(x, y, s, `<g opacity="${f2(a * 0.85)}"><circle r="72" fill="none" stroke="${w}" stroke-width="8"/>${simbolStempel(o.simbol || "bola", w)}</g>`, o.rot || -8);
  }
  // keju segitiga berlubang
  function keju(x, y, s, rot = 0) {
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="110" ry="14" fill="#000" opacity=".16"/><path d="M-110 0 L-110 -90 L110 -40 L110 0Z" fill="#F2C24A"/><path d="M-110 -90 L60 -150 L110 -40Z" fill="#FFD966"/>
      <circle cx="-60" cy="-40" r="14" fill="#D9A62E"/><circle cx="30" cy="-24" r="10" fill="#D9A62E"/><circle cx="70" cy="-14" r="7" fill="#D9A62E"/><circle cx="-10" cy="-96" r="9" fill="#E8B83A"/>`, rot);
  }
  // molekul sederhana bercahaya (bentuk SAMA untuk semua sumber = "kembar"). o: {warna, cahaya 0..1}
  function molekulKembar(x, y, s, t = 0, o = {}) {
    const w = o.warna || "#7CE0D0", c = cl(o.cahaya ?? 0.6), id = uid("mk"), rt = Math.sin(t * 1.3 + x * 0.01) * 10;
    const at = [[-60, 20, 26], [0, -20, 32], [60, 16, 26], [0, 50, 20], [104, -20, 18]];
    return g(x, y, s, `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${w}" stop-opacity=".7"/><stop offset="1" stop-color="${w}" stop-opacity="0"/></radialGradient></defs><circle r="150" fill="url(#${id})" opacity="${f2(c)}"/>
      <path d="M-60 20 L0 -20 L60 16 L104 -20 M0 -20 L0 50" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>${at.map(([a, b, r], i) => `<circle cx="${a}" cy="${b}" r="${r}" fill="${i === 1 ? w : i % 2 ? "#FFFFFF" : "#F7A9C2"}"/><circle cx="${a - r * 0.3}" cy="${b - r * 0.3}" r="${r * 0.3}" fill="#FFFFFF" opacity=".6"/>`).join("")}`, rt);
  }
  // dapur terang: dinding hijau mint berubin, jendela pagi, gantungan perkakas; o: {meja (y)}
  function dapurTerang(w, h, P, t = 0, o = {}) {
    const my = o.meja ?? h * 0.68, jx = o.jendelaX ?? w * 0.55;
    let s = `<rect width="${w}" height="${h}" fill="#CFEAE0"/>`;
    for (let i = 0; i < w / 70 + 1; i++) for (let j = 0; j < 7; j++) s += `<rect x="${i * 70 + 3}" y="${my - 500 + j * 70 + 3}" width="64" height="64" rx="6" fill="${(i + j) % 2 ? "#E2F4EC" : "#D8EFE6"}"/>`;
    s += `<rect x="${jx - 16}" y="${my - 1100}" width="452" height="460" rx="14" fill="#F4EEDC"/><svg x="${jx}" y="${my - 1084}" width="420" height="428">${A.langit(P, 420, 428, t, { suryaX: 320, suryaY: 100 })}${A.awan ? A.awan(140, 160, 0.5, P, 0.8) : ""}${A.rumahKampung(210, 428, 0.45, P)}</svg><rect x="${jx + 204}" y="${my - 1084}" width="12" height="428" fill="#F4EEDC"/>`;
    s += `<rect x="60" y="${my - 900}" width="380" height="14" rx="7" fill="#8A9AA6"/>${[0, 1, 2, 3].map((i) => `<path d="M${110 + i * 90} ${my - 886} l0 ${60 + (i % 2) * 30}" stroke="#8A9AA6" stroke-width="6"/><circle cx="${110 + i * 90}" cy="${my - 806 + (i % 2) * 30}" r="${22 + (i % 2) * 6}" fill="${["#E2483E", "#F2C24A", "#2F7AC2", "#5FA05A"][i]}"/>`).join("")}`;
    s += `<rect x="0" y="${my}" width="${w}" height="${h - my}" fill="#F2E6CC"/><rect x="0" y="${my}" width="${w}" height="24" fill="#FFFFFF"/><rect x="0" y="${my + 140}" width="${w}" height="${h - my - 140}" fill="#5FA08A"/>`;
    for (let i = 0; i < w / 260; i++) s += `<rect x="${i * 260 + 20}" y="${my + 160}" width="220" height="${h - my - 180}" rx="10" fill="#6AAE96"/><rect x="${i * 260 + 110}" y="${my + 200}" width="40" height="10" rx="5" fill="#F4EEDC"/>`;
    return s;
  }
  // panggung sorot: lantai+latar gradasi gelap, dua lampu sorot. o: {warna1, warna2, kiri, kanan (x sorot)}
  function panggungSorot(w, h, t = 0, o = {}) {
    const id = uid("ps"), sk = uid("sk"), lantai = o.lantai ?? h * 0.7, a = o.kiri ?? w * 0.3, b = o.kanan ?? w * 0.7;
    return `<defs><radialGradient id="${id}" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="${o.warna1 || "#2E6A78"}"/><stop offset="1" stop-color="${o.warna2 || "#0E2630"}"/></radialGradient>
      <linearGradient id="${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6DA" stop-opacity=".0"/><stop offset="1" stop-color="#FFF6DA" stop-opacity=".28"/></linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#${id})"/><rect x="0" y="${lantai}" width="${w}" height="${h - lantai}" fill="#0E2630" opacity=".5"/>
      ${[a, b].map((x, i) => `<path d="M${f1(x + (i ? 1 : -1) * 120 + Math.sin(t * 0.7 + i) * 20)} 0 L${f1(x - 230)} ${lantai + 40} L${f1(x + 230)} ${lantai + 40}Z" fill="url(#${sk})"/><ellipse cx="${f1(x)}" cy="${lantai + 40}" rx="240" ry="46" fill="#FFF6DA" opacity=".22"/>`).join("")}`;
  }

  Object.assign(A, { butirMicin, hujanMicin, gunungMicin, toplesMicin, surat1968, gerobakAngkringan, mesinTik, papanDetektif, kartuPin, botolArak, pengocokGaram,
    lab1969, labu, tikusLab, kandangLab, jarumSuntik, sendok, otakKartun, ruangUji, mangkukSup, papanKlip, ruangArsip, mapArsip, stempelKaret, jejakStempel, simbolStempel,
    keju, molekulKembar, dapurTerang, panggungSorot });
})(typeof window !== "undefined" ? window : globalThis);

/* ===== PERLUASAN: KAMAR MANDI & APOTEK 1892 (Yoga, 17 Nov 2026 — video I-019 odol) =====
 * kamarMandi(w,h,P,t,{meja,cerminX}) · wastafel(x,y,s,P) · tubePasta(x,y,s,{warna,aksen,tutup,tanya,rot,penyok}) · sikatGigi(x,y,s,rot,{gagang,busa})
 * gelasKumur(x,y,s,{isi}) · busa(x,y,s,t,k) · botolKumurJadul(x,y,s,{kaca,isi,label,rot,kilau}) · apotekJadul(w,h,P,t,{meja})
 * timbanganKuningan(x,y,s,t) · posterJadul(x,y,s,t,{isi,w,h}) · ruangTamuSepia(w,h,t,{lantai}) · gramofon(x,y,s,t,{main})
 * notBalok(x,y,s,warna,jenis) · lampuMinyakRomawi(x,y,s,t) · ikonGigi(x,y,s,warna) · tetesMinyak(x,y,s,warna)
 * kartuKata(x,y,s,teks,{sub,warna,ikon,rot}) · rakWarungJadul(w,h,P,t,{lantai}) · toplesKue(x,y,s,warna)
 * Semua label KOSONG / tanpa logo merek asli; teks hanya lewat kode (kartuKata). */
(function (root) {
  const A = (typeof module !== "undefined" && module.exports && module.exports.PALET) ? module.exports : root.ASET;
  let _n = 0; const uid = (p) => `${p}o${++_n}`;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f2(rot)}) scale(${f2(s)})">${isi}</g>`;

  // kamar mandi modern terang: dinding keramik, cermin, rak kecil, handuk, tanaman, jendela cahaya
  function kamarMandi(w, h, P, t = 0, o = {}) {
    const mj = o.meja ?? h * 0.66, cx = o.cerminX ?? w * 0.5, mal = P.nama === "malam";
    const dd = mal ? "#5E7486" : "#DCEEEA", ub = mal ? "#526878" : "#C9E2DC", lt = mal ? "#3E4E5C" : "#B9D4CE";
    let s = `<rect width="${w}" height="${h}" fill="${dd}"/>`;
    for (let x = 0; x < w; x += 120) s += `<rect x="${x}" y="0" width="3" height="${mj}" fill="${lt}" opacity=".5"/>`;
    for (let y = 0; y < mj; y += 120) s += `<rect x="0" y="${y}" width="${w}" height="3" fill="${lt}" opacity=".5"/>`;
    s += `<rect x="0" y="${mj - 380}" width="${w}" height="30" fill="${ub}"/>`;
    // jendela kecil (cahaya pagi)
    const jx = o.jendelaX ?? w * 0.12;
    s += `<rect x="${jx - 110}" y="${mj - 1150}" width="220" height="300" rx="20" fill="${mal ? "#FFD38A" : "#FFF6DA"}" opacity=".9"/><rect x="${jx - 4}" y="${mj - 1150}" width="8" height="300" fill="${ub}"/>
      <path d="M${jx - 110} ${mj - 850} L${jx + 260} ${mj} L${jx + 600} ${mj} L${jx + 110} ${mj - 850}Z" fill="#FFF6DA" opacity="${mal ? 0.08 : 0.22}"/>`;
    // cermin
    const id = uid("cm");
    s += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mal ? "#7E98AE" : "#EAF6F8"}"/><stop offset="1" stop-color="${mal ? "#5A7288" : "#B8D8DE"}"/></linearGradient></defs>
      <rect x="${cx - 270}" y="${mj - 1080}" width="540" height="620" rx="60" fill="${ub}"/><rect x="${cx - 250}" y="${mj - 1060}" width="500" height="580" rx="48" fill="url(#${id})"/>
      <path d="M${cx - 180} ${mj - 1000} L${cx - 60} ${mj - 1000} L${cx - 220} ${mj - 600} L${cx - 250} ${mj - 640}Z" fill="#FFFFFF" opacity=".35"/><path d="M${cx - 20} ${mj - 1000} L${cx + 20} ${mj - 1000} L${cx - 140} ${mj - 560} L${cx - 180} ${mj - 560}Z" fill="#FFFFFF" opacity=".25"/>`;
    // rak kaca + botol kecil polos + tanaman
    const rx = o.rakX ?? w * 0.84;
    s += `<rect x="${rx - 140}" y="${mj - 640}" width="280" height="14" rx="7" fill="#FFFFFF" opacity=".7"/>
      <rect x="${rx - 110}" y="${mj - 740}" width="54" height="100" rx="14" fill="#F7A9C2"/><rect x="${rx - 98}" y="${mj - 770}" width="30" height="34" rx="6" fill="#E27A9A"/>
      <rect x="${rx - 30}" y="${mj - 720}" width="60" height="80" rx="24" fill="#9AD0F0"/><path d="M${rx + 60} ${mj - 640} L${rx + 70} ${mj - 700} L${rx + 120} ${mj - 700} L${rx + 130} ${mj - 640}Z" fill="#E9B28A"/>
      <path d="M${rx + 95} ${mj - 700} Q${rx + 60 + Math.sin(t * 1.2) * 4} ${mj - 790} ${rx + 70} ${mj - 820} M${rx + 95} ${mj - 700} Q${rx + 110} ${mj - 800} ${rx + 140 + Math.sin(t * 1.4) * 4} ${mj - 810}" stroke="${P.daun}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
    // handuk tergantung
    const hx = o.handukX ?? w * 0.1;
    s += `<rect x="${hx - 90}" y="${mj - 560}" width="180" height="12" rx="6" fill="#B8C4C8"/><path d="M${hx - 70} ${mj - 552} L${hx + 70} ${mj - 552} L${hx + 76 + Math.sin(t * 0.9) * 3} ${mj - 300} L${hx - 64 + Math.sin(t * 0.9) * 3} ${mj - 300}Z" fill="#FFC93C"/><rect x="${hx - 66}" y="${mj - 360}" width="140" height="18" fill="#E5A91A"/>`;
    // meja wastafel (granit)
    s += `<rect x="0" y="${mj}" width="${w}" height="${h - mj}" fill="${mal ? "#4A5A68" : "#F2F0EA"}"/><rect x="0" y="${mj}" width="${w}" height="24" fill="${mal ? "#5C6E7E" : "#FFFFFF"}"/>
      <rect x="0" y="${mj + 24}" width="${w}" height="${h - mj}" fill="${mal ? "#3A4855" : "#7FB7B0"}" opacity=".9"/>`;
    for (let x = 60; x < w; x += 300) s += `<rect x="${x}" y="${mj + 70}" width="250" height="${h - mj - 110}" rx="16" fill="#000" opacity=".06"/><circle cx="${x + 220}" cy="${mj + 160}" r="10" fill="#FFFFFF" opacity=".5"/>`;
    return s;
  }
  // wastafel keramik putih dengan keran; y = garis atas meja
  function wastafel(x, y, s, P) {
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="250" ry="34" fill="#C9D6D4"/><path d="M-240 0 Q-230 70 0 76 Q230 70 240 0Z" fill="#FFFFFF"/><ellipse cx="0" cy="2" rx="230" ry="26" fill="#DDE8EA"/><ellipse cx="0" cy="6" rx="18" ry="6" fill="#9AAAB0"/>
      <rect x="-14" y="-170" width="28" height="150" rx="10" fill="#C8D2D6"/><path d="M-14 -160 Q-14 -200 30 -200 L110 -200 Q126 -200 126 -184 L126 -164 L104 -164 L104 -176 L30 -176 Q14 -176 14 -160Z" fill="#DCE4E8"/><rect x="-44" y="-60" width="88" height="20" rx="10" fill="#B4C0C6"/>
      <path d="M-200 -10 Q-120 -18 -60 -8" stroke="#FFFFFF" stroke-width="6" opacity=".7" fill="none" stroke-linecap="round"/>`);
  }
  // tube pasta gigi berlabel KOSONG. o: {warna, aksen, tutup, tanya (0..1 tanda ? di lingkaran merah), rot, penyok 0..1}
  function tubePasta(x, y, s, o = {}) {
    const w = o.warna || "#F6F7F4", a = o.aksen || "#2F5FD0", tp = o.tutup || "#E2483E", py = (o.penyok || 0) * 14, q = cl(o.tanya || 0);
    const body = `M-90 ${-300} L90 ${-300} L${80 - py} -40 Q80 0 40 0 L-40 0 Q${-80 + py} 0 ${-80 + py} -40Z`;
    return g(x, y, s, `<path d="M-100 -300 L100 -300 L100 -330 L-100 -330Z" fill="#D8DAD6"/>${[...Array(7)].map((_, i) => `<rect x="${-96 + i * 28}" y="-330" width="12" height="30" fill="#BFC2BE"/>`).join("")}
      <path d="${body}" fill="${w}"/><path d="M-90 -300 L-82 -40 Q-80 -10 -50 -4 L-40 -300Z" fill="#000" opacity=".06"/>
      <path d="M-88 -270 L88 -270 L86 -230 L-86 -230Z" fill="${a}"/><path d="M-82 -80 L82 -80 L80 -50 L-80 -50Z" fill="${a}"/>
      <rect x="-62" y="-210" width="124" height="112" rx="18" fill="#FFFFFF" opacity=".55"/>
      ${q > 0 ? `<g transform="translate(0 -154) scale(${f2(q)})"><circle r="52" fill="#FFFFFF" stroke="#E2232E" stroke-width="12"/><text y="26" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="76" fill="#E2232E">?</text></g>` : ""}
      <path d="M60 -290 L56 -60" stroke="#FFFFFF" stroke-width="14" opacity=".45" stroke-linecap="round"/>
      <rect x="-34" y="0" width="68" height="24" rx="4" fill="#D8DAD6"/><path d="M-46 24 L46 24 L40 92 Q0 104 -40 92Z" fill="${tp}"/>${[...Array(5)].map((_, i) => `<rect x="${-32 + i * 16}" y="34" width="6" height="52" fill="#000" opacity=".12"/>`).join("")}`, o.rot || 0);
  }
  // sikat gigi; titik (x,y) = pangkal kepala sikat; rot derajat. o: {gagang, busa 0..1}
  function sikatGigi(x, y, s, rot = 0, o = {}) {
    const gw = o.gagang || "#1FA8A0", b = cl(o.busa || 0);
    let bu = ""; if (b > 0) for (let i = 0; i < 6; i++) bu += `<circle cx="${-6 + i * 12}" cy="${-30 - (i % 2) * 8}" r="${f1((10 + (i % 3) * 4) * b)}" fill="#FFFFFF"/>`;
    return g(x, y, s, `<path d="M-14 0 L250 -6 Q262 0 250 12 L-14 14 Q-24 7 -14 0Z" fill="${gw}"/><path d="M60 2 L200 -2" stroke="#FFFFFF" stroke-width="5" opacity=".35" stroke-linecap="round"/>
      <rect x="-14" y="-24" width="70" height="24" rx="6" fill="#FFFFFF"/>${[...Array(6)].map((_, i) => `<rect x="${-10 + i * 11}" y="-24" width="4" height="24" fill="#BFE8F0"/>`).join("")}${bu}`, rot);
  }
  function gelasKumur(x, y, s, o = {}) {
    const isi = cl(o.isi ?? 0.6);
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="64" ry="10" fill="#000" opacity=".15"/><path d="M-56 -170 L56 -170 L46 0 L-46 0Z" fill="#D8EEF2" opacity=".55"/>
      <path d="M${f1(-56 + 10 * (1 - isi))} ${f1(-170 * isi)} L${f1(56 - 10 * (1 - isi))} ${f1(-170 * isi)} L46 0 L-46 0Z" fill="#8FD0E0" opacity=".75"/><path d="M-36 -150 L-30 -20" stroke="#FFFFFF" stroke-width="9" opacity=".6" stroke-linecap="round"/>`, o.rot || 0);
  }
  // gumpalan busa (k 0..1 = banyaknya)
  function busa(x, y, s, t = 0, k = 1) {
    k = cl(k); if (k <= 0) return "";
    let o = ""; const B = [[0, 0, 26], [-30, 6, 20], [30, 8, 22], [-14, -18, 16], [18, -16, 15], [-48, -6, 12], [50, -4, 13], [4, 22, 14], [-26, 24, 10], [34, 26, 9]];
    B.forEach(([a, b, r], i) => { const rr = r * k * (1 + 0.06 * Math.sin(t * 5 + i)); if (rr > 0.5) o += `<circle cx="${a}" cy="${b}" r="${f1(rr)}" fill="#FFFFFF"/><circle cx="${f1(a - rr * 0.3)}" cy="${f1(b - rr * 0.35)}" r="${f1(rr * 0.28)}" fill="#E6F6FA"/>`; });
    return g(x, y, s, o);
  }
  // botol obat kumur kuno (generik, label kosong krem). o: {kaca, isi, label, rot, kilau 0..1}
  function botolKumurJadul(x, y, s, o = {}) {
    const kc = o.kaca || "#3E7FB8", isi = o.isi || "#9AD0E8", kl = cl(o.kilau || 0), id = uid("bkj");
    const d = "M-80 0 Q-96 0 -96 -20 L-96 -230 Q-96 -270 -60 -290 Q-34 -304 -30 -330 L-30 -380 L30 -380 L30 -330 Q34 -304 60 -290 Q96 -270 96 -230 L96 -20 Q96 0 80 0Z";
    return g(x, y, s, `${kl > 0 ? `<circle cy="-190" r="230" fill="#FFE8A8" opacity="${f2(kl * 0.45)}" style="filter:blur(24px)"/>` : ""}<ellipse cx="0" cy="6" rx="110" ry="16" fill="#000" opacity=".2"/>
      <defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="${kc}" opacity=".85"/><g clip-path="url(#${id})"><rect x="-100" y="-220" width="200" height="230" fill="${isi}" opacity=".5"/></g>
      <rect x="-70" y="-190" width="140" height="120" rx="12" fill="${o.label || "#F3E6C8"}"/><rect x="-58" y="-178" width="116" height="96" rx="8" fill="none" stroke="#C9A86A" stroke-width="5"/>
      <path d="M-66 -270 Q-80 -150 -70 -30" stroke="#FFFFFF" stroke-width="12" opacity=".35" fill="none" stroke-linecap="round"/>
      <path d="M-36 -380 L36 -380 L32 -430 Q0 -440 -32 -430Z" fill="#B88A5A"/><rect x="-38" y="-392" width="76" height="16" rx="5" fill="#9A6A3A"/>`, o.rot || 0);
  }
  // timbangan kuningan apotek
  function timbanganKuningan(x, y, s, t = 0) {
    const r = Math.sin(t * 1.1) * 4;
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="120" ry="14" fill="#000" opacity=".18"/><path d="M-80 0 L80 0 L50 -30 L-50 -30Z" fill="#B8862E"/><rect x="-8" y="-280" width="16" height="250" fill="#C99A3A"/>
      <g transform="translate(0 -270) rotate(${f2(r)})"><rect x="-150" y="-6" width="300" height="12" rx="6" fill="#D9AA48"/>
      <path d="M-140 0 L-180 90 M-140 0 L-100 90 M140 0 L100 90 M140 0 L180 90" stroke="#B8862E" stroke-width="4"/><path d="M-200 90 Q-140 130 -80 90Z" fill="#D9AA48"/><path d="M80 90 Q140 130 200 90Z" fill="#D9AA48"/></g><circle cx="0" cy="-282" r="16" fill="#E8C060"/>`);
  }
  // apotek/lab 1892 sepia: rak kayu penuh botol polos, meja ramuan, lampu gantung, jendela
  function apotekJadul(w, h, P, t = 0, o = {}) {
    const mj = o.meja ?? h * 0.7;
    let s = `<rect width="${w}" height="${h}" fill="#C9A77A"/><rect width="${w}" height="${mj - 240}" fill="#B8936A"/>`;
    for (let x = 0; x < w; x += 90) s += `<rect x="${x}" y="0" width="40" height="${mj - 240}" fill="#C49F74" opacity=".5"/>`;
    // jendela melengkung + sinar
    const jx = o.jendelaX ?? w * 0.78;
    s += `<rect x="${jx - 150}" y="${mj - 1180}" width="300" height="520" rx="150" fill="#7A5232"/><rect x="${jx - 130}" y="${mj - 1160}" width="260" height="490" rx="130" fill="#F6E2B4"/>
      <rect x="${jx - 4}" y="${mj - 1160}" width="8" height="490" fill="#7A5232"/><rect x="${jx - 130}" y="${mj - 900}" width="260" height="8" fill="#7A5232"/>
      <path d="M${jx - 130} ${mj - 700} L${jx - 520} ${mj} L${jx - 120} ${mj} L${jx + 130} ${mj - 700}Z" fill="#FFF0C8" opacity=".16"/>`;
    // rak dinding
    const rak = (x0, w0, y0, benih) => { let r = `<rect x="${x0}" y="${y0 - 520}" width="${w0}" height="540" fill="#6A4426"/><rect x="${x0 + 14}" y="${y0 - 506}" width="${w0 - 28}" height="512" fill="#7E5434"/>`;
      for (let j = 0; j < 3; j++) { const yy = y0 - 360 + j * 170; r += `<rect x="${x0}" y="${yy}" width="${w0}" height="16" fill="#5A3820"/>`;
        for (let i = 0; i < Math.floor((w0 - 40) / 56); i++) { const hh = 70 + ((i * 7 + j * 3 + benih) % 4) * 14, cc = ["#3E7FB8", "#5E8A5A", "#9A5A3A", "#3E6A8A", "#C9A050"][(i + j + benih) % 5];
          r += `<rect x="${x0 + 26 + i * 56}" y="${yy - hh}" width="40" height="${hh}" rx="8" fill="${cc}" opacity=".9"/><rect x="${x0 + 32 + i * 56}" y="${yy - hh * 0.62}" width="28" height="${hh * 0.32}" rx="3" fill="#F3E6C8" opacity=".85"/><rect x="${x0 + 36 + i * 56}" y="${yy - hh - 12}" width="20" height="14" rx="3" fill="#B88A5A"/>`; } }
      return r; };
    s += rak(40, 560, mj - 260, 1) + rak(w * 0.5 - 60, 520, mj - 260, 4);
    // lampu gantung
    const lx = o.lampuX ?? w * 0.42, ay = Math.sin(t * 1.1) * 6;
    s += `<path d="M${lx} 0 L${lx + ay} ${mj - 1240}" stroke="#4A2E1A" stroke-width="6"/><path d="M${lx + ay - 70} ${mj - 1240} L${lx + ay + 70} ${mj - 1240} L${lx + ay + 40} ${mj - 1300} L${lx + ay - 40} ${mj - 1300}Z" fill="#3E6A5A"/>
      <circle cx="${lx + ay}" cy="${mj - 1226}" r="22" fill="#FFE8A8"/><circle cx="${lx + ay}" cy="${mj - 1200}" r="${f1(260 + Math.sin(t * 7) * 6)}" fill="#FFE8A8" opacity=".14"/>`;
    // meja ramuan
    s += `<rect x="0" y="${mj}" width="${w}" height="${h - mj}" fill="#7A4E2C"/><rect x="0" y="${mj}" width="${w}" height="26" fill="#9A6A3E"/><rect x="0" y="${mj + 26}" width="${w}" height="10" fill="#000" opacity=".12"/>`;
    for (let x = 40; x < w; x += 260) s += `<rect x="${x}" y="${mj + 80}" width="220" height="${h - mj - 120}" rx="10" fill="#000" opacity=".08"/><circle cx="${x + 110}" cy="${mj + 150}" r="10" fill="#C99A3A"/>`;
    // filter sepia hangat
    s += `<rect width="${w}" height="${h}" fill="#8A5A2A" opacity=".08"/>`;
    return s;
  }
  // bingkai poster iklan kuno (ornamen art nouveau), tengah kosong / diisi o.isi (svg). (x,y)=tengah
  function posterJadul(x, y, s, t = 0, o = {}) {
    const W = o.w || 520, H = o.h || 720, kc = o.kertas || "#F3E2BC";
    const sudut = (sx, sy) => `<path d="M${sx * (W / 2 - 20)} ${sy * (H / 2 - 90)} Q${sx * (W / 2 - 20)} ${sy * (H / 2 - 20)} ${sx * (W / 2 - 90)} ${sy * (H / 2 - 20)}" stroke="#2F5FD0" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="${sx * (W / 2 - 46)}" cy="${sy * (H / 2 - 46)}" r="12" fill="#C9A050"/>`;
    return g(x, y, s, `<rect x="${-W / 2 - 34}" y="${-H / 2 - 34}" width="${W + 68}" height="${H + 68}" rx="14" fill="#6A4426"/><rect x="${-W / 2 - 22}" y="${-H / 2 - 22}" width="${W + 44}" height="${H + 44}" rx="8" fill="#C9A050"/>
      <rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" fill="${kc}"/><rect x="${-W / 2 + 34}" y="${-H / 2 + 34}" width="${W - 68}" height="${H - 68}" fill="none" stroke="#C9A86A" stroke-width="5"/>
      ${sudut(-1, -1)}${sudut(1, -1)}${sudut(-1, 1)}${sudut(1, 1)}<path d="M${-W / 2 + 80} ${-H / 2 + 70} Q0 ${-H / 2 + 20} ${W / 2 - 80} ${-H / 2 + 70}" stroke="#2F5FD0" stroke-width="8" fill="none"/>
      <path d="M${-W / 2 + 80} ${H / 2 - 70} Q0 ${H / 2 - 20} ${W / 2 - 80} ${H / 2 - 70}" stroke="#2F5FD0" stroke-width="8" fill="none"/>${o.isi || ""}
      <rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" fill="#8A5A2A" opacity=".08"/>`);
  }
  // ruang tamu sepia akhir 1800-an: kertas dinding bermotif, lis kayu, karpet, jendela tirai
  function ruangTamuSepia(w, h, t = 0, o = {}) {
    const lt = o.lantai ?? h * 0.72;
    let s = `<rect width="${w}" height="${h}" fill="#D9B98A"/>`;
    for (let x = 0; x < w; x += 110) for (let y = 40; y < lt - 300; y += 130) s += `<path d="M${x + 55} ${y} q16 22 0 44 q-16 -22 0 -44" fill="#C9A26E" opacity=".7"/>`;
    s += `<rect y="${lt - 300}" width="${w}" height="300" fill="#8A5A34"/><rect y="${lt - 312}" width="${w}" height="16" fill="#A8743E"/>`;
    for (let x = 30; x < w; x += 240) s += `<rect x="${x}" y="${lt - 260}" width="180" height="210" rx="6" fill="none" stroke="#6A4426" stroke-width="8"/>`;
    const jx = o.jendelaX ?? w * 0.15;
    s += `<rect x="${jx - 140}" y="${lt - 1150}" width="280" height="620" rx="12" fill="#F6E2B4"/><path d="M${jx - 180} ${lt - 1190} Q${jx - 120} ${lt - 820} ${jx - 170} ${lt - 480} L${jx - 90} ${lt - 480} Q${jx - 70} ${lt - 820} ${jx - 60} ${lt - 1190}Z" fill="#9A3A3A"/>
      <path d="M${jx + 180} ${lt - 1190} Q${jx + 120} ${lt - 820} ${jx + 170} ${lt - 480} L${jx + 90} ${lt - 480} Q${jx + 70} ${lt - 820} ${jx + 60} ${lt - 1190}Z" fill="#9A3A3A"/><rect x="${jx - 200}" y="${lt - 1210}" width="400" height="26" rx="10" fill="#6A4426"/>`;
    s += `<rect y="${lt}" width="${w}" height="${h - lt}" fill="#7A4E2C"/><path d="M${w * 0.08} ${lt + 80} L${w * 0.92} ${lt + 80} L${w} ${h} L0 ${h}Z" fill="#8E3A3A" opacity=".85"/><path d="M${w * 0.12} ${lt + 110} L${w * 0.88} ${lt + 110} L${w * 0.96} ${h - 40} L${w * 0.04} ${h - 40}Z" fill="none" stroke="#C9A050" stroke-width="6" opacity=".7"/>`;
    s += `<rect width="${w}" height="${h}" fill="#8A5A2A" opacity=".07"/>`;
    return s;
  }
  // gramofon kuno dengan corong; piringan berputar. o: {main 0..1}
  function gramofon(x, y, s, t = 0, o = {}) {
    const m = cl(o.main ?? 1), rot = t * 200 * m, gt = Math.sin(t * 12) * 1.5 * m;
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="170" ry="20" fill="#000" opacity=".2"/><rect x="-150" y="-130" width="300" height="130" rx="10" fill="#6A3E22"/><rect x="-130" y="-110" width="260" height="90" rx="6" fill="#7E4E2C"/>
      <rect x="-160" y="-150" width="320" height="26" rx="6" fill="#8A5A34"/><g transform="translate(-20 -156) scale(1 .28) rotate(${f1(rot)})"><circle r="130" fill="#2A2420"/><circle r="120" fill="none" stroke="#3E3630" stroke-width="4"/><circle r="90" fill="none" stroke="#3E3630" stroke-width="4"/><circle r="36" fill="#C24A3A"/><rect x="40" y="-6" width="60" height="12" fill="#4A4038"/></g>
      <path d="M110 -160 L110 -230 Q110 -260 90 -280" stroke="#C99A3A" stroke-width="14" fill="none" stroke-linecap="round"/>
      <g transform="translate(90 -280) rotate(${f2(-35 + gt)})"><path d="M0 0 L-40 -60 Q-130 -230 -40 -330 Q60 -300 200 -260 Q150 -170 40 -40Z" fill="#D9AA48"/><path d="M-40 -330 Q60 -300 200 -260 Q140 -330 60 -350 Q0 -360 -40 -330Z" fill="#B8862E"/><path d="M-10 -60 Q-70 -200 -10 -300" stroke="#F2D27A" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/></g>
      <circle cx="160" cy="-70" r="16" fill="#C99A3A"/><path d="M160 -70 L210 -96" stroke="#C99A3A" stroke-width="10" stroke-linecap="round"/>`);
  }
  // not balok melayang. jenis 0 = not tunggal, 1 = not ganda
  function notBalok(x, y, s, warna = "#2F5FD0", jenis = 0, rot = 0) {
    const isi = jenis ? `<ellipse cx="-30" cy="0" rx="22" ry="16" fill="${warna}" transform="rotate(-20 -30 0)"/><ellipse cx="40" cy="-14" rx="22" ry="16" fill="${warna}" transform="rotate(-20 40 -14)"/><rect x="-12" y="-110" width="9" height="110" fill="${warna}"/><rect x="58" y="-124" width="9" height="110" fill="${warna}"/><path d="M-12 -110 L67 -124 L67 -100 L-12 -86Z" fill="${warna}"/>`
      : `<ellipse cx="0" cy="0" rx="24" ry="17" fill="${warna}" transform="rotate(-20)"/><rect x="16" y="-112" width="9" height="108" fill="${warna}"/><path d="M25 -112 Q60 -90 50 -50 Q46 -80 25 -84Z" fill="${warna}"/>`;
    return g(x, y, s, isi, rot);
  }
  function lampuMinyakRomawi(x, y, s, t = 0) {
    const fl = 1 + 0.1 * Math.sin(t * 11) + 0.05 * Math.sin(t * 23);
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="130" ry="14" fill="#000" opacity=".18"/><path d="M-120 -10 Q-130 -70 -40 -80 L80 -80 Q130 -78 150 -60 L190 -70 Q200 -50 170 -34 Q120 -6 40 0 L-90 0 Q-118 0 -120 -10Z" fill="#B8703A"/>
      <path d="M-100 -40 Q-30 -64 70 -60" stroke="#D99A5A" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/><ellipse cx="-10" cy="-82" rx="40" ry="10" fill="#8A4E26"/><path d="M-130 -50 Q-180 -60 -170 -20 Q-160 0 -120 -20" stroke="#B8703A" stroke-width="12" fill="none"/>
      <g transform="translate(184 -76) scale(${f2(fl)})"><circle cy="-30" r="60" fill="#FFD27A" opacity=".3"/><path d="M0 0 Q-24 -30 0 -80 Q24 -30 0 0Z" fill="#FFB347"/><path d="M0 -4 Q-10 -24 0 -50 Q10 -24 0 -4Z" fill="#FFF2B8"/></g>`);
  }
  function ikonGigi(x, y, s, warna = "#FFFFFF") {
    return g(x, y, s, `<path d="M-60 -70 Q-90 -70 -86 -30 Q-82 10 -66 40 Q-56 90 -40 90 Q-26 90 -20 50 Q-14 24 0 24 Q14 24 20 50 Q26 90 40 90 Q56 90 66 40 Q82 10 86 -30 Q90 -70 60 -70 Q30 -70 0 -56 Q-30 -70 -60 -70Z" fill="${warna}"/><path d="M-56 -48 Q-70 -30 -64 0" stroke="#D8EEF2" stroke-width="10" fill="none" stroke-linecap="round"/>`);
  }
  function tetesMinyak(x, y, s, warna = "#E8B84A") {
    return g(x, y, s, `<path d="M0 -90 Q-60 -10 -60 24 Q-60 70 0 70 Q60 70 60 24 Q60 -10 0 -90Z" fill="${warna}"/><path d="M-28 10 Q-34 40 -10 52" stroke="#FFF2C8" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>`);
  }
  // kartu kata (teks via kode). o: {sub, warna, ikon(svg di atas teks), rot, lebar}
  function kartuKata(x, y, s, teks, o = {}) {
    const W = o.lebar || 380, H = o.tinggi || 420, w = o.warna || "#FFF4DC";
    return g(x, y, s, `<rect x="${-W / 2 + 10}" y="${-H / 2 + 14}" width="${W}" height="${H}" rx="34" fill="#000" opacity=".22"/><rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" rx="34" fill="${w}"/>
      <rect x="${-W / 2 + 18}" y="${-H / 2 + 18}" width="${W - 36}" height="${H - 36}" rx="24" fill="none" stroke="#1E1E1E" stroke-width="4" opacity=".15"/>${o.ikon || ""}
      <text y="${H / 2 - 104}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${o.uk || 76}" letter-spacing="1" fill="#1E1E1E">${teks}</text>
      ${o.sub ? `<text y="${H / 2 - 48}" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="38" fill="#1E1E1E" opacity=".7">${o.sub}</text>` : ""}`, o.rot || 0);
  }
  function toplesKue(x, y, s, warna = "#E2483E") {
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="70" ry="10" fill="#000" opacity=".15"/><path d="M-60 0 L-60 -130 Q-60 -150 -40 -150 L40 -150 Q60 -150 60 -130 L60 0Z" fill="#E6F2F2" opacity=".5"/>
      ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${-34 + (i % 3) * 34}" cy="${-24 - Math.floor(i / 3) * 40 - (i % 2) * 10}" r="20" fill="${i % 2 ? warna : "#FFC93C"}"/>`).join("")}<rect x="-50" y="-176" width="100" height="30" rx="8" fill="#C24A3A"/><path d="M-44 -130 L-44 -20" stroke="#FFF" stroke-width="8" opacity=".5" stroke-linecap="round"/>`);
  }
  // warung jadul siang: kayu, rak bertingkat berisi tube aneka warna (label kosong), toples, tirai plastik
  function rakWarungJadul(w, h, P, t = 0, o = {}) {
    const lt = o.lantai ?? h * 0.72, d = "#B07A46", dg = "#8E5E32", dt = "#C99460";
    let s = A.langit(P, w, h, t, { suryaX: w * 0.8, suryaY: h * 0.08 });
    s += `<rect x="0" y="${lt - 1250}" width="${w}" height="${1250}" fill="${dg}"/><path d="M-40 ${lt - 1250} L${w + 40} ${lt - 1250} L${w + 80} ${lt - 1380} L-80 ${lt - 1380}Z" fill="#B5654A"/><path d="M-40 ${lt - 1250} L${w + 40} ${lt - 1250} L${w + 40} ${lt - 1225} L-40 ${lt - 1225}Z" fill="#97503A"/>`;
    for (let i = 0; i < w / 60; i++) s += `<rect x="${i * 60}" y="${lt - 1225}" width="36" height="70" fill="${i % 2 ? "#FFC93C" : "#E2483E"}" opacity=".9"/>`;
    const warna = [["#F6F7F4", "#2F5FD0", "#E2483E"], ["#E2483E", "#FFFFFF", "#FFFFFF"], ["#3FAE6A", "#FFFFFF", "#2E7A4A"], ["#2F5FD0", "#FFFFFF", "#FFC93C"], ["#FFFFFF", "#E2483E", "#2F5FD0"], ["#F28CB0", "#FFFFFF", "#C24A6A"], ["#FFC93C", "#2F5FD0", "#E2483E"]];
    for (let j = 0; j < 3; j++) {
      const yy = lt - 820 + j * 250;
      s += `<rect x="20" y="${yy}" width="${w - 40}" height="22" fill="${dt}"/><rect x="20" y="${yy + 22}" width="${w - 40}" height="8" fill="#000" opacity=".15"/>`;
      for (let i = 0; i < Math.floor((w - 80) / 120); i++) { const c = warna[(i + j * 3) % warna.length]; s += tubePasta(90 + i * 120 + (j % 2) * 30, yy - 40, 0.42, { warna: c[0], aksen: c[1], tutup: c[2] }); }
    }
    s += `<rect x="0" y="${lt}" width="${w}" height="${h - lt}" fill="${d}"/><rect x="0" y="${lt}" width="${w}" height="26" fill="${dt}"/>`;
    s += `<rect x="0" y="${lt - 60}" width="${w}" height="60" fill="#9AAEB4" opacity=".35"/>`;
    for (let i = 0; i < 5; i++) s += toplesKue(140 + i * (w - 280) / 4, lt, 0.95, ["#E2483E", "#3FAE6A", "#2F5FD0", "#F28CB0", "#E28A3A"][i]);
    return s;
  }

  Object.assign(A, { kamarMandi, wastafel, tubePasta, sikatGigi, gelasKumur, busa, botolKumurJadul, timbanganKuningan, apotekJadul, posterJadul, ruangTamuSepia,
    gramofon, notBalok, lampuMinyakRomawi, ikonGigi, tetesMinyak, kartuKata, toplesKue, rakWarungJadul });
})(typeof window !== "undefined" ? window : globalThis);
