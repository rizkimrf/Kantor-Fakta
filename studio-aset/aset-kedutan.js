/* ===== SET KEDUTAN — KAMAR BEGADANG UNGU, PENAMPANG KELOPAK, PAPAN 15 WAJAH (Kiki, 28 Nov 2026, video B4-01 "kedutan mata") =====
 * Muat SETELAH tebe-rig.js. Gaya datar tanpa garis hitam di set; palet UNGU-MAGENTA malam + cahaya kuning HP/lampu
 * (beda dari B3-11 cicak tosca-fuchsia & A3-04 presto merah bata). Fungsi murni (fungsi waktu kontinu t) → string SVG.
 * Tanpa tulisan/angka/logo/merek di dalam gambar (simbol "?", palang hijau generik boleh).
 *  KED.C                                  palet
 *  tebeSVG(p,cx,cy,w,o)                   Tebe (tebe-rig) sebagai <svg> bersarang di dunia SVG; o.kedut 0..1 (kelopak bawah mata kiri-layar
 *                                         naik-turun + busur getar), o.jendela 0..1 (jendela tembus pandang serat magenta), o.denyut 0..1,
 *                                         o.cermin (dibalik), o.tutupMulut 0..1, o.mataRapat 0..1 (kelopak menutup rapat), o.pipiNyala 0..1
 *  titikTebe(px,py,cx,cy,w)               konversi titik rig (400x520) → dunia
 *  kedutPola(t,kuat)                      pola kedutan kontinu: semburan 3 getar tiap ±1,4 dtk (0..1)
 *  (o.satuSerat: hanya serat tengah menyala kuning — sampul)
 *  kamar(t,o)                             dunia kamar malam 2600x1920 (x −300..2600): jendela bintang, jam dinding tanpa angka (o.jarum jam),
 *                                         cermin dinding, pintu klinik palang hijau, lampu meja; o.terang (0..1 lebih terang-serius)
 *  meja(t,o)                              meja depan (digambar di atas Tebe): o.kertas 0..1 tumpukan, o.mug2 0..1, o.uap
 *  hp(x,y,s,rot,o) · koin(x,y,s,t,o) · silang(x,y,s,k) · tanya(x,y,s,a) · garisPutus(x0,y0,x1,y1,k,t)
 *  penampang(t,o)                         close-up wajah Tebe dengan potongan kelopak: cincin otot magenta (orbicularis); o.cincin 0..1,
 *                                         o.karet 0..1 (karet gelang kuning berubah jadi cincin), o.getarBawah 0..1, o.serat 0..1, o.tembak(i,t)
 *                                         o.perintah 0..1 (kabel perintah dari otak, redup/putus-putus), o.tanya 0..1, o.buram
 *  SERAT                                  daftar serat (arc) bagian bawah cincin {i, a0, a1, r} untuk tembak acak
 *  panciPopkorn(x,y,s,t,o)                panci generik + jagung meletup satu-satu (o.mulai detik, o.k 0..1)
 *  papan15(t,o)                           papan 15 ikon wajah netral; o.nyala 0..15 (bertahap), o.kedip, o.sapu 0..1 (otak menyapu cahaya tenang)
 *  kalender(x,y,s,t,o)                    kalender dinding tanpa angka, o.balik (jumlah halaman terbalik, kontinu)
 *  otak(x,y,s,o)                          ikon otak kuning sederhana
 *  panelTanda(i,t,o)                      3 panel batas aman: 0 kalender+kedut, 1 kelopak menutup rapat, 2 cahaya merambat ke pipi
 *  efekKata(teks,x,y,s,k,warna)           kata efek komik (TIK! TIK!, POP!, HIK!) bergaya stiker
 */
(function (root) {
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const halus = (x) => { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const C = {
    UNGU0: "#7A3FA8", UNGU1: "#5E2E8C", UNGU2: "#4A2272", UNGU3: "#361955", UNGU4: "#24103C", UNGU5: "#170A28",
    MAGENTA: "#F24FC4", MAGENTA2: "#C9309F", MAGENTA3: "#8E1F73", PINK: "#FFA3E0",
    KUNING: "#FFC93C", KUNING2: "#FFE38A", KUNING3: "#FFF3C4", TEAL: "#2EC4B6", TEAL2: "#1B8F86", KREM: "#FFF4DC",
    KAYU: "#8A5A3C", KAYU2: "#6B4430", KAYU3: "#4E3022", HIJAU: "#3DBE6E", MERAH: "#E2232E", PUTIH: "#FFFFFF",
    KULIT: "#F4C9A1", KULIT2: "#E3AE82", RAMBUT: "#4A2E1A", GARIS: "#1E1E1E",
  };
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };

  // ---------- kedutan kontinu ----------
  function kedutPola(t, kuat = 1) {
    const per = 1.45, u = ((t % per) + per) % per;           // semburan 3 getar 0..0,42 dtk, lalu tenang
    const env = Math.pow(Math.sin(Math.PI * cl(u / 0.42)), 0.7);
    return kuat * env * Math.abs(Math.sin(u * Math.PI * 7.2));
  }

  // ---------- Tebe di dunia SVG ----------
  function titikTebe(px, py, cx, cy, w) { return [cx - w / 2 + px * w / 400, cy - w * 0.65 + py * w / 400]; }
  function kelopak(p, o) {
    // koordinat kepala Tebe (viewBox 400x520), mata kiri-layar cx 158 cy 194
    const s = 1 + (p.mataBesar || 0) * 0.25, cx = 158, bawah = 194 + (p.mataBesar > 0.5 ? 25 : 21 * s);
    const k = cl(o.kedut || 0), j = cl(o.jendela || 0), rap = cl(o.mataRapat || 0);
    let g = "";
    if (rap > 0) { // kelopak menutup rapat (batas aman): kulit menutup kedua mata dari atas & bawah + kerut
      for (const ex of [158, 242]) {
        const h = 26 * rap;
        g += `<path d="M${ex - 26} ${170} Q${ex} ${164} ${ex + 26} ${170} L${ex + 26} ${194 - 22 + h} Q${ex} ${194 - 14 + h} ${ex - 26} ${194 - 22 + h} Z" fill="${C.KULIT}"/>`
          + `<path d="M${ex - 26} ${222} Q${ex} ${226} ${ex + 26} ${222} L${ex + 26} ${218 - h * .55} Q${ex} ${210 - h * .55} ${ex - 26} ${218 - h * .55} Z" fill="${C.KULIT}"/>`
          + `<path d="M${ex - 20} ${194 + 2 - (1 - rap) * 6} Q${ex} ${200 + 2} ${ex + 20} ${194 + 2 - (1 - rap) * 6}" fill="none" stroke="${C.GARIS}" stroke-width="6" stroke-linecap="round" opacity="${rap.toFixed(3)}"/>`
          + `<path d="M${ex - 24} 214 q8 5 16 0 M${ex + 4} 216 q8 5 16 0" fill="none" stroke="${C.KULIT2}" stroke-width="4" stroke-linecap="round" opacity="${rap.toFixed(3)}"/>`;
      }
    }
    if (k > 0.001 && rap < 0.9) {
      const naik = 4 + 13 * k, y0 = bawah + 3;
      g += `<path d="M${cx - 22} ${y0 + 4} Q${cx} ${y0 - naik} ${cx + 22} ${y0 + 4} L${cx + 22} ${y0 + 14} L${cx - 22} ${y0 + 14} Z" fill="${C.KULIT}"/>`
        + `<path d="M${cx - 17} ${y0 + 1} Q${cx} ${y0 - naik + 2} ${cx + 17} ${y0 + 1}" fill="none" stroke="${C.KULIT2}" stroke-width="6" stroke-linecap="round"/>`;
      // busur getar kecil
      const a = cl(k * 1.4);
      g += `<g opacity="${a.toFixed(3)}" stroke="${o.warnaGetar || C.MAGENTA}" stroke-width="4.5" fill="none" stroke-linecap="round">`
        + `<path d="M${cx - 34} ${y0 - 6} q-7 9 0 18"/><path d="M${cx - 44} ${y0 - 10} q-9 13 0 26"/>`
        + `</g>`;
    }
    if (j > 0.001) { // jendela tembus pandang: serat otot magenta melengkung di bawah mata
      const R = 30 * (o.jendelaSkala || 1) * halus(j), d = cl(o.denyut || 0), y = bawah + 18 * (o.jendelaSkala || 1);
      g += `<defs><clipPath id="jkel"><ellipse cx="${cx}" cy="${y}" rx="${R * 1.25}" ry="${R * .78}"/></clipPath></defs>`
        + `<ellipse cx="${cx}" cy="${y}" rx="${R * 1.25 + 3}" ry="${R * .78 + 3}" fill="${C.KUNING2}" opacity=".9"/>`
        + `<g clip-path="url(#jkel)"><rect x="${cx - 120}" y="${y - 80}" width="240" height="160" fill="${C.UNGU3}"/>`;
      for (let i = 0; i < 5; i++) {
        const yy = y - 14 + i * 7, nyala = o.satuSerat ? (i === 2 ? 1 : 0) : cl(d * (i === 2 ? 1 : 0.55 + 0.45 * Math.sin(i * 2.1)));
        const sk = o.jendelaSkala || 1, yy2 = y + (yy - y) * sk;
        g += `<path d="M${cx - 44 * sk} ${yy2 - 6 * sk} Q${cx} ${yy2 + 6 * sk} ${cx + 44 * sk} ${yy2 - 6 * sk}" fill="none" stroke="${nyala > 0.5 ? C.KUNING : C.MAGENTA}" stroke-width="${(5.5 * sk).toFixed(1)}" stroke-linecap="round" opacity="${(0.75 + 0.25 * nyala).toFixed(3)}"/>`;
      }
      g += `</g>`;
    }
    if ((o.pipiNyala || 0) > 0.001) { // cahaya magenta merambat dari kelopak ke pipi
      const r = 18 + 52 * o.pipiNyala;
      g += `<defs><radialGradient id="pnyl"><stop offset="0" stop-color="${C.MAGENTA}" stop-opacity=".75"/><stop offset="1" stop-color="${C.MAGENTA}" stop-opacity="0"/></radialGradient></defs>`
        + `<ellipse cx="${cx - 6}" cy="${bawah + 14 + 14 * o.pipiNyala}" rx="${r}" ry="${r * .8}" fill="url(#pnyl)"/>`;
    }
    if ((o.tutupMulut || 0) > 0.001) { // telapak menutup mulut (cegukan)
      const k2 = o.tutupMulut;
      g += `<g opacity="${cl(k2 * 2).toFixed(3)}" transform="translate(0 ${((1 - k2) * 60).toFixed(1)})"><ellipse cx="200" cy="252" rx="38" ry="26" fill="${C.KULIT}" stroke="${C.GARIS}" stroke-width="6"/>`
        + `<path d="M176 236 l0 -10 M192 232 l0 -12 M208 232 l0 -12 M224 236 l0 -10" stroke="${C.GARIS}" stroke-width="5" stroke-linecap="round"/></g>`;
    }
    return g;
  }
  function tebeSVG(p, cx, cy, w, o = {}) {
    let s = root.tebeRigSVG(p);
    if (o.tanpaBayang) s = s.replace(/<ellipse cx="200" cy="502"[^>]*\/>/, "");
    const tambah = kelopak(p, o);
    if (tambah) { // sisip di koordinat kepala (ikut miring/angguk kepala)
      const gk = `<g transform="translate(0 ${(-(p.nafas || 0) * 2 + (p.kepalaAngguk || 0)).toFixed(2)}) rotate(${(p.kepalaMiring || 0).toFixed(2)} 200 300)">${tambah}</g>`;
      const i = s.lastIndexOf(" </g>\n</g></svg>");
      if (i > 0) s = s.slice(0, i) + gk + s.slice(i);
    }
    const h = w * 1.3, x = cx - w / 2, y = cy - h / 2;
    s = s.replace(/<svg [^>]*>/, `<svg x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" viewBox="0 0 400 520" overflow="visible">`);
    if (o.cermin) s = `<g transform="translate(${f1(2 * cx)} 0) scale(-1 1)">${s}</g>`;
    return s;
  }

  // ---------- benda kecil ----------
  function hp(x, y, s, rot = 0, o = {}) {
    const lay = o.layar ? `<rect x="-40" y="-74" width="80" height="140" rx="10" fill="${C.KUNING3}"/><rect x="-30" y="-56" width="60" height="8" rx="4" fill="${C.KUNING}" opacity=".7"/><rect x="-30" y="-40" width="44" height="8" rx="4" fill="${C.KUNING}" opacity=".5"/>` : `<circle cx="-24" cy="-60" r="7" fill="${C.UNGU3}"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><rect x="-48" y="-84" width="96" height="168" rx="16" fill="${o.layar ? C.UNGU5 : "#2B2340"}"/>${lay}</g>`;
  }
  function koin(x, y, s, t, o = {}) {
    const putar = Math.cos(t * (o.laju ?? 4)), lebar = Math.max(0.12, Math.abs(putar));
    const kilau = 0.5 + 0.5 * Math.sin(t * 6);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})" opacity="${(o.a ?? 1).toFixed(3)}">
<circle r="${(90 + 30 * kilau).toFixed(1)}" fill="${C.KUNING2}" opacity=".18"/>
<g transform="scale(${lebar.toFixed(3)} 1)"><circle r="70" fill="#E5A91A"/><circle r="62" fill="${C.KUNING}"/><circle r="44" fill="none" stroke="#E5A91A" stroke-width="8"/>
<path d="M-26 -30 Q-6 -44 18 -34" stroke="${C.KUNING3}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/></g>
<path d="M58 -64 l6 -16 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 Z" fill="${C.KUNING3}" opacity="${kilau.toFixed(3)}"/></g>`;
  }
  function silang(x, y, s, k) {
    if (k <= 0.001) return "";
    const a = halus(cl(k * 2)), b = halus(cl(k * 2 - 1));
    const L = 120 * s;
    return `<g stroke="${C.MAGENTA}" stroke-width="${f1(34 * s)}" stroke-linecap="round"><path d="M${f1(x - L)} ${f1(y - L)} L${f1(x - L + 2 * L * a)} ${f1(y - L + 2 * L * a)}"/>${b > 0 ? `<path d="M${f1(x + L)} ${f1(y - L)} L${f1(x + L - 2 * L * b)} ${f1(y - L + 2 * L * b)}"/>` : ""}</g>`;
  }
  function tanya(x, y, s, a) {
    if (a <= 0.001) return "";
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${(s * (0.7 + 0.3 * halus(a))).toFixed(3)})" opacity="${cl(a).toFixed(3)}"><path d="M-40 -50 C-44 -110 60 -114 56 -52 C54 -18 6 -26 4 14" fill="none" stroke="${C.KUNING}" stroke-width="30" stroke-linecap="round"/><circle cx="4" cy="62" r="17" fill="${C.KUNING}"/></g>`;
  }
  function garisPutus(x0, y0, x1, y1, k, t) {
    if (k <= 0.001) return "";
    const x = lerp(x0, x1, halus(k)), y = lerp(y0, y1, halus(k));
    return `<path d="M${f1(x0)} ${f1(y0)} L${f1(x)} ${f1(y)}" stroke="${C.KUNING2}" stroke-width="7" stroke-dasharray="4 18" stroke-linecap="round" stroke-dashoffset="${f1(-t * 40)}" opacity=".85"/>`;
  }
  function jamDinding(x, y, r, jam) {
    let tik = "";
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; tik += `<path d="M${f1(x + Math.cos(a) * r * .78)} ${f1(y + Math.sin(a) * r * .78)} L${f1(x + Math.cos(a) * r * .88)} ${f1(y + Math.sin(a) * r * .88)}" stroke="${C.UNGU2}" stroke-width="${i % 3 ? 4 : 8}" stroke-linecap="round"/>`; }
    const aJ = (jam / 12) * Math.PI * 2 - Math.PI / 2, aM = (jam % 1) * Math.PI * 2 - Math.PI / 2;
    return `<circle cx="${x}" cy="${y + 8}" r="${r}" fill="${C.UNGU5}" opacity=".3"/><circle cx="${x}" cy="${y}" r="${r}" fill="${C.KREM}"/><circle cx="${x}" cy="${y}" r="${r * .93}" fill="none" stroke="${C.MAGENTA2}" stroke-width="${r * .1}"/>${tik}
<path d="M${x} ${y} L${f1(x + Math.cos(aJ) * r * .5)} ${f1(y + Math.sin(aJ) * r * .5)}" stroke="${C.UNGU4}" stroke-width="10" stroke-linecap="round"/>
<path d="M${x} ${y} L${f1(x + Math.cos(aM) * r * .72)} ${f1(y + Math.sin(aM) * r * .72)}" stroke="${C.MAGENTA2}" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="9" fill="${C.UNGU4}"/>`;
  }
  function mug(x, y, s, t, uap = 1) {
    let u = "";
    for (let i = 0; i < 3; i++) { const f = ((t * 0.5 + i / 3) % 1), yy = -70 - f * 120, a = Math.sin(Math.PI * f) * 0.55 * uap;
      u += `<path d="M${f1(-14 + i * 14 + Math.sin(t * 2 + i) * 8)} ${f1(yy + 40)} q14 -20 0 -40 q-14 -20 0 -40" stroke="${C.KREM}" stroke-width="9" fill="none" stroke-linecap="round" opacity="${a.toFixed(3)}"/>`; }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${u}<path d="M38 -46 q34 0 34 26 q0 26 -34 26" fill="none" stroke="${C.TEAL2}" stroke-width="13"/><rect x="-44" y="-70" width="88" height="96" rx="14" fill="${C.TEAL}"/><rect x="-44" y="-70" width="88" height="16" rx="8" fill="${C.TEAL2}"/><rect x="-30" y="-46" width="12" height="52" rx="6" fill="#FFFFFF" opacity=".25"/></g>`;
  }
  function kertas(x, y, s, k) {
    let g = ""; const n = Math.round(1 + 9 * cl(k)), r = acak(7);
    for (let i = 0; i < 10; i++) { const off = (r() - 0.5) * 18, rot = (r() - 0.5) * 6; if (i >= n) continue;
      const muncul = cl(k * 10 - i); g += `<g opacity="${cl(muncul * 2).toFixed(3)}" transform="translate(${f1(off)} ${f1(-i * 22 - (1 - halus(muncul)) * 30)}) rotate(${f1(rot)})"><rect x="-90" y="-18" width="180" height="22" rx="3" fill="${i % 2 ? C.KREM : "#F1E2C4"}"/><rect x="-90" y="2" width="180" height="4" fill="${C.UNGU5}" opacity=".15"/></g>`; }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
  }
  function lampuMeja(x, y, s, nyala = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M80 -172 L260 0 L-60 0 Z" fill="${C.KUNING3}" opacity="${(0.12 * nyala).toFixed(3)}"/>
<ellipse cx="0" cy="0" rx="60" ry="14" fill="${C.KAYU3}"/><path d="M0 0 L-30 -110 L40 -190" stroke="${C.MAGENTA3}" stroke-width="14" fill="none" stroke-linecap="round"/>
<path d="M10 -230 L90 -200 L70 -150 L-6 -176 Z" fill="${C.MAGENTA2}"/><ellipse cx="80" cy="-172" rx="22" ry="12" fill="${C.KUNING2}" opacity="${nyala}"/></g>`;
  }

  // ---------- dunia kamar ----------
  const KAMAR = { lantai: 1560, meja: 1480, cermin: [1560, 1130, 360, 560], pintu: [1930, 640, 330, 920], jam: [200, 800, 90], jendela: [-200, 560, 300, 380] };
  function kamar(t, o = {}) {
    const te = cl(o.terang || 0);
    const dind = te > 0 ? `#${[0x4A, 0x22, 0x72].map((v, i) => Math.round(lerp(v, [0x52, 0x3A, 0x84][i], te)).toString(16).padStart(2, "0")).join("")}` : C.UNGU2;
    let g = `<rect x="-1000" y="-800" width="4000" height="3400" fill="${dind}"/>`;
    for (let i = -6; i < 26; i++) g += `<rect x="${i * 140}" y="-800" width="60" height="${KAMAR.lantai + 800}" fill="${C.UNGU1}" opacity=".22"/>`;
    // jendela malam (kiri)
    const [jx, jy, jw, jh] = KAMAR.jendela;
    g += `<rect x="${jx - 18}" y="${jy - 18}" width="${jw + 36}" height="${jh + 36}" rx="14" fill="${C.UNGU4}"/><rect x="${jx}" y="${jy}" width="${jw}" height="${jh}" rx="8" fill="#1B1E4A"/>`;
    const r = acak(3);
    for (let i = 0; i < 14; i++) { const x = jx + 14 + r() * (jw - 28), y = jy + 14 + r() * (jh - 28), k = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.8 + r()) + i)); g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + r() * 3)}" fill="${C.KUNING3}" opacity="${(k * .8).toFixed(2)}"/>`; }
    g += `<circle cx="${jx + jw * .7}" cy="${jy + 90}" r="40" fill="${C.KUNING3}"/><circle cx="${jx + jw * .7 + 18}" cy="${jy + 80}" r="36" fill="#1B1E4A"/><rect x="${jx + jw / 2 - 6}" y="${jy}" width="12" height="${jh}" fill="${C.UNGU4}"/>`;
    // jam dinding
    const [cx, cy, cr] = KAMAR.jam; g += jamDinding(cx, cy, cr, o.jam ?? 11.2);
    // cermin dinding
    const [mx, my, mw, mh] = KAMAR.cermin;
    g += `<rect x="${mx - mw / 2 - 26}" y="${my - mh / 2 - 26}" width="${mw + 52}" height="${mh + 52}" rx="${mw / 2}" fill="${C.KAYU2}"/><rect x="${mx - mw / 2 - 10}" y="${my - mh / 2 - 10}" width="${mw + 20}" height="${mh + 20}" rx="${mw / 2}" fill="${C.KAYU}"/>`
      + `<rect x="${mx - mw / 2}" y="${my - mh / 2}" width="${mw}" height="${mh}" rx="${mw / 2 - 10}" fill="#8C6FC0"/>`;
    if (o.pantulan) g += `<defs><clipPath id="kcermin"><rect x="${mx - mw / 2}" y="${my - mh / 2}" width="${mw}" height="${mh}" rx="${mw / 2 - 10}"/></clipPath></defs><g clip-path="url(#kcermin)">${o.pantulan}</g>`;
    g += `<path d="M${mx - mw * .3} ${my - mh * .3} L${mx - mw * .05} ${my - mh * .42} M${mx - mw * .32} ${my - mh * .12} L${mx + mw * .05} ${my - mh * .3}" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round" opacity=".22"/>`;
    // pintu klinik (palang hijau generik)
    const [px, py, pw, ph] = KAMAR.pintu;
    g += `<rect x="${px - 20}" y="${py - 20}" width="${pw + 40}" height="${ph + 20}" rx="10" fill="${C.UNGU4}"/><rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="6" fill="#E9E2F2"/><rect x="${px + 30}" y="${py + 40}" width="${pw - 60}" height="${ph * .42}" rx="6" fill="#D6CCE6"/><circle cx="${px + pw - 46}" cy="${py + ph * .55}" r="14" fill="${C.KUNING}"/>`
      + `<g transform="translate(${px + pw / 2} ${py - 110})"><circle r="${66 + 6 * Math.sin(t * 3)}" fill="${C.HIJAU}" opacity=".25"/><rect x="-56" y="-56" width="112" height="112" rx="18" fill="#FFFFFF"/><rect x="-14" y="-40" width="28" height="80" rx="6" fill="${C.HIJAU}"/><rect x="-40" y="-14" width="80" height="28" rx="6" fill="${C.HIJAU}"/></g>`;
    // lantai
    g += `<rect x="-1000" y="${KAMAR.lantai}" width="4000" height="1200" fill="${C.UNGU4}"/><rect x="-1000" y="${KAMAR.lantai}" width="4000" height="14" fill="${C.UNGU3}"/>`;
    // cahaya hangat lampu (halo di dinding)
    g += `<defs><radialGradient id="khalo"><stop offset="0" stop-color="${C.KUNING2}" stop-opacity=".32"/><stop offset="1" stop-color="${C.KUNING2}" stop-opacity="0"/></radialGradient></defs><ellipse cx="380" cy="1250" rx="700" ry="520" fill="url(#khalo)"/>`;
    return g;
  }
  function meja(t, o = {}) { // meja lesehan rendah (Tebe duduk di lantai)
    const y = KAMAR.meja;
    let g = `<rect x="40" y="${y}" width="980" height="34" rx="10" fill="${C.KAYU}"/><rect x="70" y="${y + 34}" width="920" height="170" fill="${C.KAYU2}"/><rect x="70" y="${y + 34}" width="920" height="12" fill="${C.KAYU3}" opacity=".6"/>`;
    g += lampuMeja(130, y, 1, o.lampu ?? 1);
    if ((o.kertas || 0) > 0) g += kertas(290, y - 4, 1, o.kertas);
    g += mug(860, y - 4, 1, t, o.uap ?? 0.6);
    if ((o.mug2 || 0) > 0.001) { const k = halus(o.mug2); g += `<g opacity="${cl(k * 2).toFixed(3)}">${mug(960, y - 4 - (1 - k) * 60, .9, t + 1.3, 1)}</g>`; }
    return g;
  }

  // ---------- penampang kelopak (close-up wajah Tebe) ----------
  const PEN = { cx: 540, cy: 860, rxL: 360, ryL: 300, rxD: 205, ryD: 132 };
  const SERAT = [];
  (function () { const r = acak(19); let i = 0;
    for (let lap = 0; lap < 5; lap++) for (let s = 0; s < 6; s++) { const a0 = 18 + s * 24 + (r() - 0.5) * 4, a1 = a0 + 21 + (r() - 0.5) * 3;
      SERAT.push({ i: i++, lap, a0, a1, per: 0.55 + r() * 0.9, fase: r(), mulai: r() }); } })();
  function busur(cx, cy, rx, ry, a0, a1) {
    const p = (a) => [cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${f1(x0)} ${f1(y0)} A${f1(rx)} ${f1(ry)} 0 0 1 ${f1(x1)} ${f1(y1)}`;
  }
  function penampang(t, o = {}) {
    const { cx, cy, rxL, ryL, rxD, ryD } = PEN;
    const cin = cl(o.cincin ?? 1), gb = cl(o.getarBawah || 0), ser = cl(o.serat || 0);
    let g = `<rect x="-1000" y="-800" width="3200" height="3400" fill="${C.UNGU3}"/>`;
    // wajah Tebe raksasa: kulit, rambut di atas, alis
    g += `<ellipse cx="${cx + 120}" cy="${cy + 120}" rx="1100" ry="1000" fill="${C.KULIT}"/>`
      + `<path d="M-500 ${cy - 600} Q${cx} ${cy - 900} 1700 ${cy - 640} L1700 -900 L-500 -900 Z" fill="${C.RAMBUT}"/>`
      + `<path d="M${cx - 300} ${cy - 400} Q${cx} ${cy - 500} ${cx + 300} ${cy - 410}" stroke="${C.RAMBUT}" stroke-width="44" fill="none" stroke-linecap="round"/>`
      + `<ellipse cx="${cx - 140}" cy="${cy + 460}" rx="150" ry="90" fill="#F58A7A" opacity=".45"/>`;
    // potongan (jendela) di sekitar mata
    g += `<ellipse cx="${cx}" cy="${cy}" rx="${rxL + 46}" ry="${ryL + 46}" fill="${C.KULIT2}"/><ellipse cx="${cx}" cy="${cy}" rx="${rxL + 30}" ry="${ryL + 30}" fill="${C.UNGU4}"/>`;
    // cincin otot (orbicularis): pita tebal magenta + guratan serat konsentris
    const tebal = rxL - rxD;
    if (cin > 0) {
      const dash = 2400, off = dash * (1 - halus(cin));
      g += `<ellipse cx="${cx}" cy="${cy}" rx="${(rxL + rxD) / 2}" ry="${(ryL + ryD) / 2}" fill="none" stroke="${C.MAGENTA2}" stroke-width="${tebal}" stroke-dasharray="${dash}" stroke-dashoffset="${f1(off)}" opacity="${cl(cin * 3).toFixed(3)}"/>`;
      for (let lap = 0; lap < 6; lap++) { const k = (lap + 0.5) / 6, rx = lerp(rxD, rxL, k), ry = lerp(ryD, ryL, k);
        g += `<ellipse cx="${cx}" cy="${cy}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="${C.PINK}" stroke-width="4" opacity="${(0.35 * cl(cin * 2 - 1)).toFixed(3)}" stroke-dasharray="40 26" stroke-dashoffset="${lap * 17}"/>`; }
      const glow = 0.25 + 0.2 * Math.sin(t * 3);
      g += `<ellipse cx="${cx}" cy="${cy}" rx="${rxL + 8}" ry="${ryL + 8}" fill="none" stroke="${C.MAGENTA}" stroke-width="10" opacity="${(glow * cin).toFixed(3)}"/>`;
    }
    // serat bawah yang menembak (berulang, acak, tidak serempak)
    if (ser > 0 || gb > 0) {
      for (const s of SERAT) {
        const k = (s.lap + 0.5) / 5, rx = lerp(rxD + 14, rxL - 14, k), ry = lerp(ryD + 12, ryL - 12, k);
        let nyala = 0;
        if (o.tembak) nyala = o.tembak(s, t);
        const goyang = nyala * 7 + gb * kedutPola(t + s.i * 0.03, 1) * 5 * (s.lap === 1 || s.lap === 2 ? 1 : 0.4);
        g += `<path d="${busur(cx, cy + goyang, rx, ry, s.a0, s.a1)}" fill="none" stroke="${nyala > 0.08 ? C.KUNING : C.MAGENTA}" stroke-width="${f1(tebal / 5 - 8 + nyala * 6)}" stroke-linecap="round" opacity="${Math.max(0.55 * Math.max(ser, gb), nyala > 0.08 ? 0.6 + 0.4 * nyala : 0).toFixed(3)}"/>`;
        if (nyala > 0.05) g += `<path d="${busur(cx, cy + goyang, rx, ry, s.a0, s.a1)}" fill="none" stroke="${C.KUNING3}" stroke-width="${f1(tebal / 5 + 14)}" stroke-linecap="round" opacity="${(0.45 * nyala).toFixed(3)}"/>`;
      }
    }
    // bola mata Tebe (gaya Tebe: hitam + kilau putih) + kelopak kulit
    const buka = o.mataBuka ?? 1;
    g += `<ellipse cx="${cx}" cy="${cy}" rx="${rxD - 6}" ry="${ryD - 6}" fill="${C.KULIT}"/>`
      + `<ellipse cx="${cx}" cy="${cy + 6}" rx="${110}" ry="${f1(124 * buka)}" fill="${C.GARIS}"/>`
      + `<circle cx="${cx - 34}" cy="${f1(cy - 40 * buka)}" r="${f1(36 * buka)}" fill="#FFFFFF"/><circle cx="${cx + 38}" cy="${f1(cy + 46 * buka)}" r="${f1(15 * buka)}" fill="#FFFFFF"/>`;
    // karet gelang (pembanding)
    if ((o.karet || 0) > 0.001) {
      const k = o.karet, m = halus(cl((k - 0.45) / 0.55)), muncul = halus(cl(k / 0.3));
      const x = lerp(cx + 310, cx, m), y = lerp(cy - 470, cy, m), sx = lerp(0.36, (rxL + rxD) / 2 / 150, m), sy = lerp(0.36, (ryL + ryD) / 2 / 150, m);
      const goy = (1 - m) * Math.sin(t * 9) * 8;
      g += `<g opacity="${(muncul * (1 - halus(cl((k - 0.85) / 0.15)))).toFixed(3)}" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(goy)}) scale(${(sx * (0.6 + 0.4 * muncul)).toFixed(3)} ${(sy * (0.6 + 0.4 * muncul)).toFixed(3)})"><ellipse rx="150" ry="150" fill="none" stroke="${C.KUNING}" stroke-width="${f1(lerp(34, 18, m))}"/><ellipse rx="150" ry="150" fill="none" stroke="${C.KUNING3}" stroke-width="6" stroke-dasharray="60 240" opacity=".8"/></g>`;
    }
    // kabel perintah dari otak (atas) → serat: redup & putus-putus (tidak ada perintah)
    if ((o.perintah || 0) > 0.001) { // kabel perintah dari otak: redup & putus-putus (tidak ada perintah)
      const k = halus(o.perintah), jalur = `M230 840 C70 1000 170 1190 ${cx - 90} ${cy + 290}`;
      g += `<g opacity="${k.toFixed(3)}"><circle cx="230" cy="770" r="104" fill="${C.UNGU4}" opacity=".85"/><path d="${jalur}" fill="none" stroke="${C.UNGU4}" stroke-width="26" stroke-linecap="round"/>`
        + `<path d="${jalur}" fill="none" stroke="${C.KUNING2}" stroke-width="9" stroke-dasharray="6 28" stroke-linecap="round" opacity=".3"/>`
        + otak(230, 770, 0.95, { redup: 0.6 }) + `</g>`;
    }
    if ((o.tanya || 0) > 0.001) g += tanya(cx + 10, cy + 40, 2.4, o.tanya);
    return g;
  }

  // ---------- popcorn ----------
  function panciPopkorn(x, y, s, t, o = {}) {
    const r = acak(41); let biji = "", letup = "";
    const u = t - (o.mulai ?? 0);
    for (let i = 0; i < 16; i++) { const bx = -150 + r() * 300, tp = 0.15 + r() * 2.6 + (i % 4) * 0.08, sudah = u > tp;
      if (!sudah) biji += `<ellipse cx="${f1(bx)}" cy="${f1(-20 - r() * 20)}" rx="16" ry="12" fill="${C.KUNING}"/>`;
      else { r(); const v = cl((u - tp) / 0.5), loncat = Math.sin(Math.PI * Math.min(1, v)) * (120 + (i % 3) * 40), bx2 = bx + (i % 2 ? 1 : -1) * v * 30;
        const mekar = 0.6 + 0.4 * halus(cl((u - tp) / 0.12));
        letup += `<g transform="translate(${f1(bx2)} ${f1(-40 - loncat)}) scale(${mekar.toFixed(3)})"><circle r="24" fill="${C.KREM}"/><circle cx="-16" cy="-10" r="18" fill="${C.KREM}"/><circle cx="16" cy="-8" r="17" fill="#FFFFFF"/><circle cx="2" cy="14" r="16" fill="${C.KREM}"/><circle cx="4" cy="2" r="6" fill="${C.KUNING}" opacity=".7"/></g>`;
        const kil = 1 - cl((u - tp) / 0.18); if (kil > 0) letup += `<circle cx="${f1(bx)}" cy="-40" r="${f1(30 + 50 * (1 - kil))}" fill="none" stroke="${C.KUNING3}" stroke-width="6" opacity="${kil.toFixed(3)}"/>`; }
    }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="0" cy="120" rx="260" ry="30" fill="${C.UNGU5}" opacity=".4"/>
<path d="M-300 -10 L-360 -30" stroke="${C.UNGU5}" stroke-width="26" stroke-linecap="round"/><path d="M-220 -40 L220 -40 L190 110 Q0 140 -190 110 Z" fill="${C.TEAL2}"/><rect x="-236" y="-58" width="472" height="34" rx="17" fill="${C.TEAL}"/>${biji}${letup}</g>`;
  }

  // ---------- papan 15 wajah ----------
  function wajahIkon(x, y, r, o = {}) { // o.senyum 0..1 (lengkung mulut), o.datar 1 = mulut lurus netral (tanpa merah/seram)
    const k = o.kedip || 0, n = o.nyala ?? 1, sm = o.datar ? 0 : (o.senyum ?? 0.4);
    const ym = r * .42, lengkung = r * (.04 + .22 * sm);
    return `<g transform="translate(${f1(x)} ${f1(y)})" opacity="${(0.35 + 0.65 * n).toFixed(3)}">${(o.cahaya || 0) > 0.01 ? `<circle r="${f1(r * 1.22)}" fill="${C.KUNING2}" opacity="${(0.28 * o.cahaya).toFixed(3)}"/>` : ""}<circle r="${r}" fill="${n > 0.5 ? C.KULIT : "#C9B3DE"}"/>
<circle cx="${-r * .34}" cy="${-r * .08}" r="${r * .1}" fill="${C.GARIS}"/><circle cx="${r * .34}" cy="${-r * .08}" r="${r * .1}" fill="${C.GARIS}"/>
<path d="M${-r * .5} ${f1(r * .1 - k * r * .08)} q${r * .16} ${f1(-k * r * .06)} ${r * .32} 0" stroke="${C.MAGENTA2}" stroke-width="${f1(r * .07)}" fill="none" stroke-linecap="round" opacity="${cl(k * 3).toFixed(3)}"/>
${o.datar ? `<path d="M${f1(-r * .26)} ${f1(ym)} L${f1(r * .26)} ${f1(ym)}" stroke="${C.GARIS}" stroke-width="${f1(r * .08)}" stroke-linecap="round"/>` : `<path d="M${f1(-r * .3)} ${f1(ym)} Q0 ${f1(ym + lengkung)} ${f1(r * .3)} ${f1(ym)}" stroke="${C.GARIS}" stroke-width="${f1(r * .08)}" fill="none" stroke-linecap="round"/>`}</g>`;
  }
  function papan15(t, o = {}) { // papan ringkas y 560–1060; o.nyala 0..15, o.hasil 0..1 (14 senyum + 1 datar o.datar = indeks)
    let g = `<rect x="80" y="565" width="920" height="500" rx="40" fill="${C.UNGU4}"/><rect x="100" y="585" width="880" height="460" rx="30" fill="${C.UNGU1}"/>`;
    const nyala = o.nyala ?? 15, hasil = cl(o.hasil || 0);
    for (let i = 0; i < 15; i++) {
      const c = i % 5, b = Math.floor(i / 5), x = 220 + c * 160, y = 665 + b * 150;
      const n = cl(nyala - i), kd = n > 0.5 ? kedutPola(t * 1.15 + i * 0.37, 1) * 0.9 * (1 - 0.6 * hasil) : 0, datar = i === o.datar && hasil > 0.5;
      g += wajahIkon(x, y, 54 * (0.85 + 0.15 * halus(n)), { nyala: n, kedip: kd, senyum: 0.25 + 0.75 * (i === o.datar ? 0 : hasil), datar, cahaya: i === o.datar ? 0 : hasil });
    }
    return g;
  }
  function kalender(x, y, s, t, o = {}) {
    const balik = o.balik || 0, n = Math.floor(balik), f = balik - n;
    const hal = (warna) => `<rect x="-110" y="-40" width="220" height="200" rx="16" fill="${warna}"/><g fill="${C.UNGU2}" opacity=".35">${[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect x="${-86 + c * 36}" y="${-6 + r * 38}" width="24" height="22" rx="4"/>`).join("")).join("")}</g>`;
    const sudut = -f * 180;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-120" y="-104" width="240" height="72" rx="16" fill="${C.MAGENTA2}"/><circle cx="-60" cy="-104" r="10" fill="${C.UNGU5}"/><circle cx="60" cy="-104" r="10" fill="${C.UNGU5}"/>
${hal(n % 2 ? "#F1E2C4" : C.KREM)}${f > 0.001 ? `<g transform="translate(0 -40) scale(1 ${Math.cos(sudut * Math.PI / 180).toFixed(3)}) translate(0 40)" opacity="${(1 - f * 0.5).toFixed(3)}">${hal(n % 2 ? C.KREM : "#F1E2C4")}</g>` : ""}</g>`;
  }
  function otak(x, y, s, o = {}) {
    const a = o.redup ? 1 - o.redup * 0.5 : 1;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})" opacity="${a.toFixed(3)}"><path d="M-70 10 C-96 -30 -60 -76 -20 -66 C-6 -96 46 -92 54 -60 C96 -56 100 0 70 18 C72 52 30 64 10 46 C-12 66 -60 56 -58 30 C-74 30 -80 20 -70 10 Z" fill="${C.KUNING}"/>
<path d="M-40 -30 q20 10 10 30 M10 -60 q-10 30 14 44 M40 0 q-20 10 -12 34" stroke="#E5A91A" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
  }

  // ---------- 3 panel batas aman ----------
  function panelTanda(i, t, o = {}) {
    const k = halus(cl(o.k ?? 1)), sorot = cl(o.sorot ?? 0);
    let isi = "";
    if (i === 0) isi = kalender(-40, 10, .78, t, { balik: o.balik || 0 }) + `<g transform="translate(72 -66) scale(.5)">${matakecil(t, { kedut: kedutPola(t, 1) })}</g>`;
    if (i === 1) isi = matakecil(t, { rapat: o.rapat || 0, cincin: 1 });
    if (i === 2) isi = matakecil(t, { kedut: kedutPola(t, .8), pipi: o.pipi || 0 });
    return `<g opacity="${k.toFixed(3)}" transform="scale(${(0.8 + 0.2 * k).toFixed(3)})"><rect x="-150" y="-150" width="300" height="300" rx="34" fill="${C.UNGU4}"/><rect x="-140" y="-140" width="280" height="280" rx="28" fill="${sorot > 0.5 ? C.UNGU0 : C.UNGU1}" stroke="${C.KUNING}" stroke-width="${f1(8 * sorot)}"/>${isi}</g>`;
  }
  function matakecil(t, o = {}) { // mata Tebe kecil + kulit, untuk panel
    const rap = cl(o.rapat || 0), k = cl(o.kedut || 0), pp = cl(o.pipi || 0);
    let g = `<ellipse cx="0" cy="10" rx="120" ry="104" fill="${C.KULIT}"/><path d="M-70 -64 Q0 -96 70 -66" stroke="${C.RAMBUT}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
    if (o.cincin) g += `<ellipse cx="0" cy="6" rx="${f1(92 - rap * 18)}" ry="${f1(70 - rap * 22)}" fill="none" stroke="${C.MAGENTA2}" stroke-width="${f1(26 + rap * 10)}" opacity=".9"/>`;
    g += `<ellipse cx="0" cy="6" rx="40" ry="${f1(Math.max(2, 48 * (1 - rap)))}" fill="${C.GARIS}"/>`;
    if (rap < 0.7) g += `<circle cx="-12" cy="${f1(-8 * (1 - rap))}" r="${f1(12 * (1 - rap))}" fill="#FFFFFF"/>`;
    if (rap > 0.5) g += `<path d="M-48 8 Q0 26 48 8" stroke="${C.GARIS}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-60 40 q14 8 28 0 M30 40 q14 8 28 0" stroke="${C.KULIT2}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    if (k > 0.01) g += `<path d="M-46 ${f1(62 - k * 14)} Q0 ${f1(48 - k * 18)} 46 ${f1(62 - k * 14)} L46 80 L-46 80 Z" fill="${C.KULIT}"/><path d="M-64 30 q-10 16 0 32 M-80 22 q-14 24 0 48" stroke="${C.MAGENTA}" stroke-width="6" fill="none" stroke-linecap="round" opacity="${cl(k * 1.5).toFixed(3)}"/>`;
    if (pp > 0.01) g += `<defs><radialGradient id="ppn"><stop offset="0" stop-color="${C.MAGENTA}" stop-opacity=".8"/><stop offset="1" stop-color="${C.MAGENTA}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${f1(-10 - 20 * pp)}" cy="${f1(66 + 30 * pp)}" rx="${f1(30 + 70 * pp)}" ry="${f1(24 + 50 * pp)}" fill="url(#ppn)"/>`;
    return g;
  }

  // ---------- kata efek komik ----------
  function efekKata(teks, x, y, s, k, warna = C.KUNING, rot = -8) {
    if (k <= 0.001) return "";
    const m = k < 0.25 ? 0.6 + 0.6 * halus(k / 0.25) : 1.2 - 0.2 * halus(cl((k - 0.25) / 0.2)), a = cl(k * 6) * (1 - halus(cl((k - 0.8) / 0.2)));
    return `<div style="position:absolute;left:${f1(x - 300)}px;width:600px;top:${f1(y - 60)}px;text-align:center;opacity:${a.toFixed(3)};transform:rotate(${rot}deg) scale(${(m * s).toFixed(3)});font:700 104px/1 Poppins;letter-spacing:-2px;color:${warna};-webkit-text-stroke:16px ${C.UNGU5};paint-order:stroke fill;text-shadow:0 10px 0 rgba(23,10,40,.55)">${teks}</div>`;
  }

  root.ASET = root.ASET || {};
  root.ASET.KEDUTAN = { C, KAMAR, PEN, SERAT, kedutPola, titikTebe, tebeSVG, hp, koin, silang, tanya, garisPutus, jamDinding, mug, kertas, lampuMeja,
    kamar, meja, penampang, panciPopkorn, wajahIkon, papan15, kalender, otak, panelTanda, matakecil, efekKata };
})(typeof window !== "undefined" ? window : globalThis);
