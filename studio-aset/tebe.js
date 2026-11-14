/* TEBE — maskot resmi channel "Ternyata Begitu" (gambar vektor, digambar dengan kode).
 *
 * Bentuk Tebe DIKUNCI di file ini: semua video memakai fungsi yang sama, jadi wajah, rambut,
 * dan bajunya selalu identik. Jangan mengubah proporsi/warna tanpa persetujuan pemilik.
 *
 * Pemakaian:  tebeSVG({ ekspresi: "kaget", bicara: 0.6, kedip: false, tanda: "?" })
 *   ekspresi : "penasaran" | "kaget" | "menjelaskan" | "tertawa" | "bingung" | "bangga"
 *   bicara   : 0..1  bukaan mulut saat berbicara (untuk animasi mengikuti suara)
 *   kedip    : true  mata tertutup sesaat
 *   tanda    : "?" (bawaan) atau "!" (dipakai di penutup video)
 *   goyang   : -1..1 ayunan jambul rambut (untuk animasi memantul)
 * Hasil: string SVG dengan viewBox 0 0 400 520 (kaki di y≈500, bisa diskalakan bebas).
 */
(function (root) {
  const W = {
    kulit: "#F4C9A1", kulitGelap: "#E3AE82", rambut: "#4A2E1A", rambutTerang: "#6A4426",
    hoodie: "#FFC93C", hoodieGelap: "#E5A91A", celana: "#1F8A8A", celanaGelap: "#176B6B",
    sepatu: "#FFFFFF", garis: "#1E1E1E", pipi: "#F58A7A", putih: "#FFFFFF", lidah: "#E8615A",
  };
  const G = `stroke="${W.garis}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;

  // posisi lengan per ekspresi: [lengan kiri, lengan kanan] sebagai path dari bahu ke tangan
  const LENGAN = {
    penasaran: { kiri: "M148 330 Q118 372 132 408", kanan: "M252 330 Q300 330 262 268", tangan: [[132, 410], [258, 262]] },
    kaget: { kiri: "M148 328 Q96 300 84 248", kanan: "M252 328 Q304 300 316 248", tangan: [[82, 242], [318, 242]] },
    menjelaskan: { kiri: "M148 330 Q118 372 132 408", kanan: "M252 326 Q312 300 330 236", tangan: [[132, 410], [333, 228]], tunjuk: true },
    tertawa: { kiri: "M148 330 Q104 352 120 396", kanan: "M252 330 Q296 352 280 396", tangan: [[122, 398], [278, 398]] },
    bingung: { kiri: "M148 330 Q118 372 132 408", kanan: "M252 326 Q330 300 304 150", tangan: [[132, 410], [298, 138]] },
    bangga: { kiri: "M148 330 Q92 356 142 388", kanan: "M252 330 Q308 356 258 388", tangan: [[144, 388], [256, 388]] },
  };

  function wajah(e, bicara, kedip) {
    const mata = (cx, lebar, tinggi, pupilDx = 0, pupilDy = 0) =>
      kedip
        ? `<path d="M${cx - 17} 196 Q${cx} 208 ${cx + 17} 196" fill="none" ${G}/>`
        : `<ellipse cx="${cx}" cy="194" rx="${lebar}" ry="${tinggi}" fill="${W.garis}"/>
           <circle cx="${cx - 5 + pupilDx}" cy="${186 + pupilDy}" r="${Math.max(4, lebar * 0.36)}" fill="${W.putih}"/>
           <circle cx="${cx + 6 + pupilDx}" cy="${200 + pupilDy}" r="${Math.max(2, lebar * 0.16)}" fill="${W.putih}"/>`;
    const mataSenyum = (cx) => `<path d="M${cx - 18} 198 Q${cx} 176 ${cx + 18} 198" fill="none" ${G}/>`;
    const alis = (d) => `<path d="${d}" fill="none" stroke="${W.rambut}" stroke-width="7" stroke-linecap="round"/>`;
    const b = Math.max(0, Math.min(1, bicara));
    let m = "", a = "", mulut = "";
    if (e === "kaget") {
      m = `<ellipse cx="158" cy="194" rx="21" ry="25" fill="${W.putih}" ${G}/><circle cx="158" cy="196" r="9" fill="${W.garis}"/>
           <ellipse cx="242" cy="194" rx="21" ry="25" fill="${W.putih}" ${G}/><circle cx="242" cy="196" r="9" fill="${W.garis}"/>`;
      a = alis("M134 148 Q156 132 180 144") + alis("M220 144 Q244 132 266 148");
      mulut = `<ellipse cx="200" cy="${252}" rx="${15 + b * 3}" ry="${19 + b * 5}" fill="#7A2B2B" ${G}/>`;
    } else if (e === "tertawa") {
      m = mataSenyum(158) + mataSenyum(242);
      a = alis("M136 160 Q158 148 180 158") + alis("M220 158 Q242 148 264 160");
      mulut = `<path d="M166 236 Q200 ${284 + b * 8} 234 236 Z" fill="#7A2B2B" ${G}/><path d="M184 262 Q200 274 216 262 Q200 254 184 262Z" fill="${W.lidah}"/>`;
    } else if (e === "bingung") {
      m = mata(158, 15, 18, -2, 0) + mata(242, 17, 21, -2, 0);
      a = alis("M136 164 Q158 158 180 168") + alis("M220 150 Q244 136 266 150");
      mulut = `<path d="M176 250 Q188 ${240 - b * 4} 200 250 Q212 ${260 + b * 4} 224 248" fill="none" ${G}/>`;
    } else if (e === "bangga") {
      m = `<path d="M140 196 Q158 180 176 196" fill="none" ${G}/><path d="M224 196 Q242 180 260 196" fill="none" ${G}/>`;
      a = alis("M136 164 Q158 154 180 162") + alis("M220 162 Q242 154 264 164");
      mulut = `<path d="M172 240 Q204 ${268 + b * 8} 232 236" fill="none" ${G}/>`;
    } else if (e === "menjelaskan") {
      m = mata(158, 17, 21) + mata(242, 17, 21);
      a = alis("M136 158 Q158 146 180 156") + alis("M220 156 Q242 146 264 158");
      mulut = `<path d="M172 238 Q200 ${262 + b * 22} 228 238 Z" fill="#7A2B2B" ${G}/>`;
    } else { // penasaran
      m = mata(158, 17, 21, 3, -2) + mata(242, 17, 21, 3, -2);
      a = alis("M136 162 Q158 154 180 164") + alis("M220 148 Q244 134 266 150");
      mulut = b > 0.15
        ? `<ellipse cx="204" cy="248" rx="${10 + b * 4}" ry="${5 + b * 12}" fill="#7A2B2B" ${G}/>`
        : `<path d="M182 246 Q204 260 224 242" fill="none" ${G}/>`;
    }
    return `${a}${m}
      <ellipse cx="124" cy="228" rx="17" ry="11" fill="${W.pipi}" opacity=".55"/><ellipse cx="276" cy="228" rx="17" ry="11" fill="${W.pipi}" opacity=".55"/>
      ${mulut}`;
  }

  function tebeSVG(opsi = {}) {
    const e = LENGAN[opsi.ekspresi] ? opsi.ekspresi : "penasaran";
    const bicara = opsi.bicara || 0, kedip = !!opsi.kedip, tanda = opsi.tanda === "!" ? "!" : "?";
    const goyang = Math.max(-1, Math.min(1, opsi.goyang || 0)) * 10;
    const L = LENGAN[e];
    const lengan = (d) => `<path d="${d}" fill="none" stroke="${W.garis}" stroke-width="40" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${W.hoodie}" stroke-width="29" stroke-linecap="round"/>`;
    const tangan = ([x, y], tunjuk) => `<circle cx="${x}" cy="${y}" r="17" fill="${W.kulit}" ${G}/>` +
      (tunjuk ? `<path d="M${x + 4} ${y - 12} L${x + 16} ${y - 42}" stroke="${W.garis}" stroke-width="19" stroke-linecap="round"/><path d="M${x + 4} ${y - 12} L${x + 16} ${y - 42}" stroke="${W.kulit}" stroke-width="9" stroke-linecap="round"/>` : "");
    // jambul: "?" melengkung (bawaan) atau "!" tegak (penutup)
    const jambul = tanda === "?"
      ? `<g transform="rotate(${goyang} 204 84)"><path d="M172 44 C170 6 246 2 244 42 C243 66 206 58 204 86" fill="none" stroke="${W.garis}" stroke-width="27" stroke-linecap="round"/>
           <path d="M172 44 C170 6 246 2 244 42 C243 66 206 58 204 86" fill="none" stroke="${W.rambut}" stroke-width="16" stroke-linecap="round"/></g>`
      : `<g transform="rotate(${goyang} 204 84)"><path d="M204 84 L210 30" fill="none" stroke="${W.garis}" stroke-width="29" stroke-linecap="round"/>
           <path d="M204 84 L210 30" fill="none" stroke="${W.rambut}" stroke-width="18" stroke-linecap="round"/></g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="400" height="520">
  <ellipse cx="200" cy="502" rx="96" ry="14" fill="#000" opacity=".14"/>
  <!-- kaki & sepatu -->
  <rect x="160" y="424" width="30" height="52" rx="12" fill="${W.kulit}" ${G}/><rect x="210" y="424" width="30" height="52" rx="12" fill="${W.kulit}" ${G}/>
  <path d="M146 500 Q146 470 176 470 L194 470 Q198 500 194 500 Z" fill="${W.sepatu}" ${G}/><path d="M254 500 Q254 470 224 470 L206 470 Q202 500 206 500 Z" fill="${W.sepatu}" ${G}/>
  <path d="M150 492 L194 492" stroke="${W.celana}" stroke-width="5"/><path d="M206 492 L250 492" stroke="${W.celana}" stroke-width="5"/>
  <!-- celana pendek -->
  <path d="M146 396 L254 396 L250 446 L206 446 L200 424 L194 446 L150 446 Z" fill="${W.celana}" ${G}/>
  <!-- lengan di belakang badan untuk pose tertentu -->
  ${e === "bangga" || e === "tertawa" ? "" : lengan(L.kiri)}
  <!-- badan: hoodie -->
  <path d="M142 308 Q200 286 258 308 Q270 362 262 404 Q200 420 138 404 Q130 362 142 308 Z" fill="${W.hoodie}" ${G}/>
  <path d="M166 372 Q200 364 234 372 L230 402 Q200 408 170 402 Z" fill="${W.hoodieGelap}" ${G}/>
  <path d="M186 304 L184 334 M214 304 L216 334" stroke="${W.garis}" stroke-width="5" stroke-linecap="round"/>
  <circle cx="184" cy="338" r="5" fill="${W.putih}" ${G}/><circle cx="216" cy="338" r="5" fill="${W.putih}" ${G}/>
  <!-- tempelan bola lampu -->
  <circle cx="232" cy="332" r="15" fill="${W.putih}" ${G}/><path d="M232 323 a7 7 0 0 1 4 12 v3 h-8 v-3 a7 7 0 0 1 4 -12" fill="${W.hoodie}" stroke="${W.garis}" stroke-width="2.5"/>
  ${lengan(L.kanan)}${e === "bangga" || e === "tertawa" ? lengan(L.kiri) : ""}
  <!-- kepala -->
  <circle cx="92" cy="204" r="19" fill="${W.kulit}" ${G}/><circle cx="308" cy="204" r="19" fill="${W.kulit}" ${G}/>
  <path d="M90 200 q6 -6 10 2" fill="none" stroke="${W.kulitGelap}" stroke-width="4" stroke-linecap="round"/><path d="M310 200 q-6 -6 -10 2" fill="none" stroke="${W.kulitGelap}" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="200" cy="196" rx="112" ry="106" fill="${W.kulit}" ${G}/>
  <!-- rambut -->
  ${jambul}
  <path d="M88 190 Q78 92 176 76 Q262 60 304 126 Q320 156 312 192 Q300 160 276 146 Q268 170 236 134 Q214 168 182 132 Q160 166 136 140 Q104 156 88 190 Z" fill="${W.rambut}" ${G}/>
  <path d="M128 112 Q160 86 204 86" fill="none" stroke="${W.rambutTerang}" stroke-width="7" stroke-linecap="round" opacity=".8"/>
  ${wajah(e, bicara, kedip)}
  ${tangan(L.tangan[0])}${tangan(L.tangan[1], L.tunjuk)}
  ${e === "bingung" ? `<path d="M322 112 q10 -8 4 -18 M338 126 q14 -4 12 -16" fill="none" stroke="${W.garis}" stroke-width="5" stroke-linecap="round"/>` : ""}
  ${e === "kaget" ? `<path d="M52 150 l-22 -12 M48 186 l-26 0 M348 150 l22 -12 M352 186 l26 0" stroke="${W.hoodieGelap}" stroke-width="7" stroke-linecap="round"/>` : ""}
</svg>`;
  }

  const EKSPRESI = Object.keys(LENGAN);
  if (typeof module !== "undefined" && module.exports) module.exports = { tebeSVG, EKSPRESI, WARNA: W };
  else { root.tebeSVG = tebeSVG; root.TEBE_EKSPRESI = EKSPRESI; }
})(typeof window !== "undefined" ? window : globalThis);
