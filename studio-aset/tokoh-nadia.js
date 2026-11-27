/* NADIA (tokoh di layar) — pendamping Tebe. Nama & tampilan dipilih Bos 28 Nov 2026: "Nadia", rambut terurai, tanpa kerudung.
 * Suara belum dipilih → jangan dipakai di video sebelum suaranya disetujui Bos.
 * Cewek dewasa muda, cantik, ceria, sok tau: percaya "katanya"/mitos/solusi gampang, lalu terbukti salah dan menutup "Ooh… ternyata begitu."
 * Ciri tetap: jepit rambut kuning bertanda "!" (Tebe = "?" penasaran, Nadia = "!" sok yakin). Saat dibantah tandanya berubah jadi "?".
 * Gaya sama dengan Tebe (chibi, garis hitam 6 px, kepala besar) supaya satu dunia.
 *
 * Pemakaian: nadiaSVG({ ekspresi: "yakin", bicara: 0..1, kedip: false })
 *   ekspresi: "yakin" | "katanya" | "kaget" | "malu" | "paham" | "senang"
 * Hasil: string SVG viewBox 0 0 400 520 (kaki di y≈500), sama dengan tebeSVG.
 */
(function (root) {
  const W = {
    kulit: "#F6CFAE", kulitGelap: "#E6B08A", rambut: "#3A2418", rambutTerang: "#5C3A26",
    kardigan: "#F2836B", kardiganGelap: "#D9654F", dalaman: "#FFF4DC", rok: "#1F8A8A", rokGelap: "#176B6B",
    hijab: "#9AD9CF", hijabGelap: "#6FBDB1", jepit: "#FFC93C", sepatu: "#FFFFFF", garis: "#1E1E1E",
    pipi: "#F58A7A", putih: "#FFFFFF", bibir: "#E0605A", hp: "#2B2F3A", layar: "#9FE3FF",
  };
  const G = `stroke="${W.garis}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;

  const LENGAN = {
    yakin: { kiri: "M150 322 Q108 352 146 384", kanan: "M250 322 Q322 304 330 236", tangan: [[146, 386], [330, 230]], tunjukAtas: 1 },
    katanya: { kiri: "M150 326 Q118 370 134 406", kanan: "M250 324 Q292 366 238 362", tangan: [[134, 408], [234, 358]], hp: 1 },
    kaget: { kiri: "M150 322 Q100 296 90 246", kanan: "M250 322 Q300 296 310 246", tangan: [[88, 240], [312, 240]] },
    malu: { kiri: "M150 326 Q118 370 134 406", kanan: "M250 322 Q334 296 306 156", tangan: [[134, 408], [302, 146]] },
    paham: { kiri: "M150 326 Q140 372 214 360", kanan: "M250 324 Q284 306 236 276", tangan: [[216, 358], [232, 272]], tunjukDagu: 1 },
    senang: { kiri: "M150 322 Q106 302 146 262", kanan: "M250 322 Q294 302 254 262", tangan: [[148, 258], [252, 258]] },
  };

  function wajah(e, bicara, kedip) {
    const b = Math.max(0, Math.min(1, bicara));
    const bulu = (cx, ry, arah) => `<path d="M${cx + arah * 14} ${194 - ry + 6} l${arah * 10} -9 M${cx + arah * 19} ${194 - ry + 13} l${arah * 11} -5" stroke="${W.garis}" stroke-width="5" stroke-linecap="round"/>`;
    const mata = (cx, rx, ry, dx = 0, dy = 0, arah = -1) => kedip
      ? `<path d="M${cx - 17} 198 Q${cx} 210 ${cx + 17} 198" fill="none" ${G}/>`
      : `<ellipse cx="${cx}" cy="194" rx="${rx}" ry="${ry}" fill="${W.garis}"/>
         <circle cx="${cx - 5 + dx}" cy="${185 + dy}" r="${Math.max(4, rx * 0.38)}" fill="${W.putih}"/>
         <circle cx="${cx + 6 + dx}" cy="${201 + dy}" r="${Math.max(2, rx * 0.17)}" fill="${W.putih}"/>${bulu(cx, ry, arah)}`;
    const senyumMata = (cx, arah) => `<path d="M${cx - 18} 200 Q${cx} 178 ${cx + 18} 200" fill="none" ${G}/>${bulu(cx, 12, arah)}`;
    const alis = (d) => `<path d="${d}" fill="none" stroke="${W.rambut}" stroke-width="6" stroke-linecap="round"/>`;
    let m = "", a = "", mulut = "", pipi = 0.55, ekstra = "";
    if (e === "yakin") { // sok tau: mata setengah terpejam puas, alis satu naik, senyum miring
      m = `<path d="M140 196 Q158 186 176 196" fill="none" ${G}/><path d="M146 200 Q158 206 172 200" fill="none" stroke="${W.garis}" stroke-width="4"/>${bulu(158, 12, -1)}
           <path d="M224 196 Q242 186 260 196" fill="none" ${G}/><path d="M230 200 Q242 206 254 200" fill="none" stroke="${W.garis}" stroke-width="4"/>${bulu(242, 12, 1)}`;
      a = alis("M138 164 Q158 158 180 166") + alis("M220 150 Q244 136 266 148");
      mulut = `<path d="M178 244 Q204 ${262 + b * 10} 232 236" fill="${b > 0.2 ? "#7A2B2B" : "none"}" ${G}/>`;
    } else if (e === "katanya") {
      m = mata(158, 16, 20, 4, 4, -1) + mata(242, 16, 20, 4, 4, 1);
      a = alis("M138 156 Q158 144 180 152") + alis("M220 152 Q242 144 262 156");
      mulut = `<ellipse cx="202" cy="248" rx="${11 + b * 4}" ry="${6 + b * 12}" fill="#7A2B2B" ${G}/>`;
    } else if (e === "kaget") {
      m = `<ellipse cx="158" cy="194" rx="21" ry="25" fill="${W.putih}" ${G}/><circle cx="158" cy="197" r="9" fill="${W.garis}"/>${bulu(158, 25, -1)}
           <ellipse cx="242" cy="194" rx="21" ry="25" fill="${W.putih}" ${G}/><circle cx="242" cy="197" r="9" fill="${W.garis}"/>${bulu(242, 25, 1)}`;
      a = alis("M134 146 Q156 130 180 142") + alis("M220 142 Q244 130 266 146");
      mulut = `<ellipse cx="200" cy="252" rx="${13 + b * 3}" ry="${17 + b * 5}" fill="#7A2B2B" ${G}/>`;
      ekstra = `<path d="M54 152 l-22 -12 M50 188 l-26 0 M346 152 l22 -12 M350 188 l26 0" stroke="${W.kardiganGelap}" stroke-width="7" stroke-linecap="round"/>`;
    } else if (e === "malu") { // ketahuan salah: mata > <, pipi merah, keringat
      m = `<path d="M144 184 L170 196 L144 206" fill="none" ${G}/><path d="M256 184 L230 196 L256 206" fill="none" ${G}/>`;
      a = alis("M138 168 Q158 160 180 166") + alis("M220 166 Q242 160 262 168");
      mulut = `<path d="M178 248 Q186 240 194 248 Q202 256 210 248 Q218 240 226 248" fill="none" ${G}/>`;
      pipi = 0.95;
      ekstra = `<path d="M330 170 q-14 22 0 30 q14 -8 0 -30 Z" fill="${W.layar}" ${G}/>
                <path d="M110 232 l10 -8 M124 236 l10 -8 M266 236 l10 -8 M280 232 l10 -8" stroke="${W.kardiganGelap}" stroke-width="4" stroke-linecap="round"/>`;
    } else if (e === "paham") { // "Ooh… ternyata begitu"
      m = mata(158, 18, 22, 0, -2, -1) + mata(242, 18, 22, 0, -2, 1);
      a = alis("M136 152 Q158 140 180 150") + alis("M220 150 Q242 140 264 152");
      mulut = `<ellipse cx="200" cy="250" rx="9" ry="11" fill="#7A2B2B" ${G}/>`;
      ekstra = `<path d="M330 120 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6 Z" fill="${W.jepit}" stroke="${W.garis}" stroke-width="4" stroke-linejoin="round"/>
                <path d="M74 132 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="${W.jepit}" stroke="${W.garis}" stroke-width="4" stroke-linejoin="round"/>`;
    } else { // senang
      m = senyumMata(158, -1) + senyumMata(242, 1);
      a = alis("M138 160 Q158 150 180 158") + alis("M220 158 Q242 150 262 160");
      mulut = `<path d="M170 236 Q200 ${282 + b * 6} 230 236 Z" fill="#7A2B2B" ${G}/><path d="M186 260 Q200 270 214 260 Q200 252 186 260 Z" fill="${W.pipi}"/>`;
    }
    return `${a}${m}
      <ellipse cx="124" cy="230" rx="18" ry="11" fill="${W.pipi}" opacity="${pipi}"/><ellipse cx="276" cy="230" rx="18" ry="11" fill="${W.pipi}" opacity="${pipi}"/>
      ${mulut}${ekstra}`;
  }

  function jepit(x, y, tanda, putar) {
    const isi = tanda === "?"
      ? `<path d="M${x - 6} ${y - 8} q0 -10 8 -10 q8 0 8 8 q0 6 -8 9 v4" fill="none" stroke="${W.garis}" stroke-width="5" stroke-linecap="round"/><circle cx="${x + 2}" cy="${y + 12}" r="3" fill="${W.garis}"/>`
      : `<path d="M${x} ${y - 16} v18" stroke="${W.garis}" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${y + 11}" r="3.5" fill="${W.garis}"/>`;
    return `<g transform="rotate(${putar} ${x} ${y})"><rect x="${x - 17}" y="${y - 25}" width="34" height="50" rx="12" fill="${W.jepit}" ${G}/>${isi}</g>`;
  }

  function nadiaSVG(opsi = {}) {
    const e = LENGAN[opsi.ekspresi] ? opsi.ekspresi : "yakin";
    const hijab = false; // Bos 28 Nov: tanpa kerudung
    const L = LENGAN[e];
    const tanda = e === "kaget" || e === "malu" ? "?" : "!";
    const lengan = (d) => `<path d="${d}" fill="none" stroke="${W.garis}" stroke-width="38" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${W.kardigan}" stroke-width="27" stroke-linecap="round"/>`;
    const tangan = ([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="${W.kulit}" ${G}/>`;
    const jari = L.tunjukAtas ? `<path d="M330 218 L332 184" stroke="${W.garis}" stroke-width="18" stroke-linecap="round"/><path d="M330 218 L332 184" stroke="${W.kulit}" stroke-width="8" stroke-linecap="round"/>
        <path d="M344 166 l8 -12 M354 184 l13 -3 M320 164 l-4 -13" stroke="${W.jepit}" stroke-width="6" stroke-linecap="round"/>`
      : L.tunjukDagu ? `<path d="M226 266 L212 252" stroke="${W.garis}" stroke-width="16" stroke-linecap="round"/><path d="M226 266 L212 252" stroke="${W.kulit}" stroke-width="7" stroke-linecap="round"/>` : "";
    const hp = L.hp ? `<g transform="rotate(-12 222 330)"><rect x="200" y="300" width="44" height="72" rx="9" fill="${W.hp}" ${G}/><rect x="207" y="309" width="30" height="50" rx="4" fill="${W.layar}"/>
        <rect x="211" y="316" width="20" height="7" rx="3" fill="#25D366"/><rect x="211" y="328" width="16" height="6" rx="3" fill="${W.putih}"/><rect x="215" y="339" width="18" height="6" rx="3" fill="#25D366"/></g>` : "";

    const rambutBelakang = hijab ? "" : `<path d="M90 176 Q58 300 108 352 Q132 362 152 340 L156 262 L246 262 L248 340 Q268 362 292 352 Q342 300 310 176 Z" fill="${W.rambut}" ${G}/>`;
    const kepala = hijab
      ? `<!-- hijab -->
         <path d="M200 66 Q330 70 330 206 Q334 300 286 336 Q244 352 200 352 Q156 352 114 336 Q66 300 70 206 Q70 70 200 66 Z" fill="${W.hijab}" ${G}/>
         <ellipse cx="200" cy="204" rx="98" ry="96" fill="${W.kulit}" ${G}/>
         <path d="M104 168 Q200 112 296 168" fill="none" stroke="${W.hijabGelap}" stroke-width="10" stroke-linecap="round"/>
         <path d="M120 318 Q200 344 280 318" fill="none" stroke="${W.hijabGelap}" stroke-width="6" stroke-linecap="round"/>
         ${jepit(286, 300, tanda, 10)}`
      : `<circle cx="92" cy="206" r="18" fill="${W.kulit}" ${G}/><circle cx="308" cy="206" r="18" fill="${W.kulit}" ${G}/>
         <ellipse cx="200" cy="198" rx="112" ry="106" fill="${W.kulit}" ${G}/>
         <path d="M88 200 Q72 84 200 76 Q330 82 312 200 Q304 150 282 126 Q246 168 176 150 Q146 172 122 152 Q100 170 88 200 Z" fill="${W.rambut}" ${G}/>
         <path d="M132 108 Q176 84 232 88" fill="none" stroke="${W.rambutTerang}" stroke-width="7" stroke-linecap="round" opacity=".85"/>
         ${jepit(276, 116, tanda, 18)}`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="400" height="520">
  <ellipse cx="200" cy="504" rx="100" ry="14" fill="#000" opacity=".14"/>
  ${rambutBelakang}
  <!-- kaki & sepatu -->
  <rect x="166" y="452" width="26" height="34" rx="10" fill="${W.kulit}" ${G}/><rect x="208" y="452" width="26" height="34" rx="10" fill="${W.kulit}" ${G}/>
  <path d="M150 502 Q150 476 178 476 L194 476 Q198 502 194 502 Z" fill="${W.sepatu}" ${G}/><path d="M250 502 Q250 476 222 476 L206 476 Q202 502 206 502 Z" fill="${W.sepatu}" ${G}/>
  <!-- rok panjang (A-line) -->
  <path d="M146 384 L254 384 L276 462 Q200 476 124 462 Z" fill="${W.rok}" ${G}/>
  <path d="M176 396 L166 460 M224 396 L234 460" stroke="${W.rokGelap}" stroke-width="5" stroke-linecap="round"/>
  ${e === "senang" || e === "kaget" ? "" : lengan(L.kiri)}
  <!-- badan: dalaman krem + kardigan koral -->
  <path d="M146 306 Q200 288 254 306 Q262 348 256 392 Q200 402 144 392 Q138 348 146 306 Z" fill="${W.kardigan}" ${G}/>
  <path d="M182 300 Q200 296 218 300 L214 394 Q200 396 186 394 Z" fill="${W.dalaman}" ${G}/>
  <circle cx="176" cy="338" r="4" fill="${W.kardiganGelap}"/><circle cx="176" cy="362" r="4" fill="${W.kardiganGelap}"/>
  ${lengan(L.kanan)}${e === "senang" || e === "kaget" ? lengan(L.kiri) : ""}
  ${kepala}
  ${wajah(e, opsi.bicara || 0, !!opsi.kedip)}
  ${hp}
  ${tangan(L.tangan[0])}${tangan(L.tangan[1])}${jari}
</svg>`;
  }

  const EKSPRESI = Object.keys(LENGAN);
  if (typeof module !== "undefined" && module.exports) module.exports = { nadiaSVG, EKSPRESI, WARNA: W };
  else { root.nadiaSVG = nadiaSVG; root.NADIA_EKSPRESI = EKSPRESI; }
})(typeof window !== "undefined" ? window : globalThis);
