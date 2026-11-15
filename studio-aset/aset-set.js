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
