/* ASET UANG & 1950 — Yoga, 18 Nov 2026 (video I-016 Gunting Sjafruddin). File BARU; tidak mengubah aset lain.
 * Muat SETELAH aset-set.js. Semua fungsi mengembalikan string SVG (koordinat layar), murni fungsi waktu.
 * ATURAN UANG: semua lembar = DESAIN FIKTIF buatan sendiri (ornamen geometri, hijau-zaitun/krem, pita "CONTOH"),
 *   TANPA wajah tokoh, TANPA lambang negara, TANPA nama bank (DJB/NICA/BI), TANPA nomor seri. Angka nilai ditulis kode.
 * Tokoh nyata selalu SILUET tanpa wajah (siluetPeci). Gedung bank = generik, bukan replika gedung asli.
 *
 *  uangFiktif(x,y,s,{nilai,potong 0..1,garis 0..1,sisi:'utuh'|'kiri'|'kanan',warna:'zaitun'|'bata'|'lembayung',rot,kilau,lipat 0..1})
 *  gunting(x,y,s,{buka 0..1, rot})  — poros di (x,y), mata gunting menghadap +x (sebelum rot)
 *  dompetKulit(x,y,s,{isi:svg lembar, buka}) · suratObligasi(x,y,s,{rot,kilau}) · radioTabung(x,y,s,t,{nyala})
 *  kamarPagi(w,h,t,{lantai}) · rumah1950Malam(w,h,t,{meja}) · siluetPeci(x,y,s,{warna,tangan [dx,dy],langkah,jalan,arah})
 *  gedungBankKolonial(x,y,s,{pintu 0..1, cahaya}) · jalan1950(w,h,t,{tanah}) · kantor1950(w,h,t,{meja})
 *  lemariArsip(x,y,s) · karungBeras/botolMinyak/telurRak(x,y,s) · piringGorengan(x,y,s,t) · tanganRaih(x0,y0,x1,y1,kulit)
 *  konfeti(x,y,k,benih) · kilauBintang(x,y,r,a) · mejaModern(w,h,{meja}) · lampuTeplok(x,y,s,t)
 */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => (+v).toFixed(1), f2 = (v) => (+v).toFixed(2), cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let _n = 0; const uid = (p) => `${p}u${++_n}`;
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f2(rot)}) scale(${f2(s)})">${isi}</g>`;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };

  // ---------- lembar uang FIKTIF ----------
  const WARNA_UANG = {
    zaitun: { dasar: "#EEE5C4", tinta: "#6B7638", muda: "#A8B26A", aksen: "#C9B46A" },
    bata: { dasar: "#F1DCC6", tinta: "#9A5A3C", muda: "#D49A78", aksen: "#C98E5A" },
    lembayung: { dasar: "#E6E2EE", tinta: "#5E5A86", muda: "#9C98C2", aksen: "#B7A6C9" },
  };
  function rosette(cx, cy, r, c) {
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c.tinta}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="${c.muda}" opacity=".55"/>`;
    for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; s += `<ellipse cx="${f1(cx + Math.cos(a) * r * 0.42)}" cy="${f1(cy + Math.sin(a) * r * 0.42)}" rx="${f1(r * 0.34)}" ry="${f1(r * 0.12)}" transform="rotate(${f1((a * 180) / Math.PI)} ${f1(cx + Math.cos(a) * r * 0.42)} ${f1(cy + Math.sin(a) * r * 0.42)})" fill="none" stroke="${c.tinta}" stroke-width="2.5" opacity=".8"/>`; }
    return s + `<circle cx="${cx}" cy="${cy}" r="${r * 0.16}" fill="${c.tinta}"/>`;
  }
  function wajahUang(c, nilai) { // 520 x 260, pusat (0,0)
    let kisi = "";
    for (let i = -5; i <= 5; i++) kisi += `<path d="M${i * 22 - 60} -96 L${i * 22 + 60} 96 M${i * 22 + 60} -96 L${i * 22 - 60} 96" stroke="${c.muda}" stroke-width="2.4" opacity=".7"/>`;
    let gel = ""; for (let j = 0; j < 3; j++) { let d = `M-240 ${-70 + j * 70}`; for (let i = 0; i <= 24; i++) d += ` L${-240 + i * 20} ${f1(-70 + j * 70 + Math.sin(i * 0.9 + j) * 6)}`; gel += `<path d="${d}" fill="none" stroke="${c.aksen}" stroke-width="2" opacity=".6"/>`; }
    const uk = String(nilai).length > 3 ? 46 : 58, ck = uid("ks");
    return `<rect x="-260" y="-130" width="520" height="260" rx="16" fill="${c.dasar}"/>${gel}
      <rect x="-244" y="-114" width="488" height="228" rx="10" fill="none" stroke="${c.tinta}" stroke-width="6"/><rect x="-232" y="-102" width="464" height="204" rx="6" fill="none" stroke="${c.aksen}" stroke-width="3" stroke-dasharray="10 6"/>
      <clipPath id="${ck}"><rect x="-82" y="-96" width="164" height="192"/></clipPath><g clip-path="url(#${ck})">${kisi}</g>
      <path d="M0 -84 L66 0 L0 84 L-66 0Z" fill="${c.dasar}" stroke="${c.tinta}" stroke-width="5"/><path d="M0 -50 L40 0 L0 50 L-40 0Z" fill="${c.muda}"/>
      ${rosette(-158, 0, 70, c)}${rosette(158, 0, 70, c)}
      <text x="-212" y="-62" font-family="Poppins" font-weight="700" font-size="${uk}" fill="${c.tinta}">${nilai}</text>
      <text x="212" y="98" text-anchor="end" font-family="Poppins" font-weight="700" font-size="${uk}" fill="${c.tinta}">${nilai}</text>
      <g transform="translate(-206 92) rotate(-28)"><rect x="-74" y="-17" width="148" height="34" fill="#D8403A"/><text y="11" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="25" letter-spacing="2" fill="#FFF6E6">CONTOH</text></g>`;
  }
  function uangFiktif(x, y, s, o = {}) {
    const c = WARNA_UANG[o.warna || "zaitun"], id = uid("uk"), id2 = uid("un"), pt = cl(o.potong || 0), sisi = o.sisi || "utuh";
    const muka = wajahUang(c, o.nilai ?? 100);
    const bay = `<rect x="-252" y="-118" width="520" height="260" rx="16" fill="#000" opacity=".16"/>`;
    const garis = o.garis ? `<path d="M0 -150 L0 150" stroke="#D8232E" stroke-width="7" stroke-dasharray="20 14" opacity="${f2(o.garis)}" stroke-dashoffset="${f1(o.geserGaris || 0)}"/>` : "";
    const kil = o.kilau ? `<rect x="-260" y="-130" width="520" height="260" rx="16" fill="#FFF3A0" opacity="${f2(o.kilau * 0.35)}"/>` : "";
    let isi;
    if (sisi === "utuh" && pt <= 0) isi = bay + muka + kil + garis;
    else {
      const dx = pt * 70, rotK = -pt * 6, rotN = pt * 6;
      const kiri = sisi === "kanan" ? "" : `<g transform="translate(${f1(-dx)} 0) rotate(${f1(rotK)})"><clipPath id="${id}"><rect x="-280" y="-160" width="280" height="320"/></clipPath><g clip-path="url(#${id})">${bay}${muka}${kil}</g></g>`;
      const lp = cl(o.lipat || 0);
      const kanan = sisi === "kiri" ? "" : `<g transform="translate(${f1(dx)} 0) rotate(${f1(rotN)}) scale(${f2(1 - lp)} ${f2(1 - lp * 0.35)})"><clipPath id="${id2}"><rect x="0" y="-160" width="280" height="320"/></clipPath><g clip-path="url(#${id2})">${bay}${muka}</g></g>`;
      isi = kiri + kanan + (pt < 0.05 ? garis : "");
    }
    return g(x, y, s, isi, o.rot || 0);
  }

  // ---------- gunting merah raksasa ----------
  function gunting(x, y, s, o = {}) {
    const b = cl(o.buka ?? 0.6), a = 4 + b * 26;
    const mata = (sg) => `<g transform="rotate(${f1(sg * a)})"><path d="M-8 ${sg * -2} L330 ${sg * -6} Q352 ${sg * -2} 330 ${sg * 4} L-8 ${sg * 26}Z" fill="#D9DEE3"/><path d="M10 ${sg * 2} L320 ${sg * -2}" stroke="#FFFFFF" stroke-width="5" opacity=".8"/><path d="M-8 ${sg * 26} L330 ${sg * 4}" stroke="#9BA4AE" stroke-width="4"/></g>`;
    const gagang = (sg) => `<g transform="rotate(${f1(-sg * a * 0.9)})"><path d="M0 0 L-70 ${sg * 30}" stroke="#B5161F" stroke-width="30" stroke-linecap="round"/><ellipse cx="-150" cy="${sg * 52}" rx="88" ry="54" fill="none" stroke="#E2232E" stroke-width="30"/><ellipse cx="-150" cy="${sg * 46}" rx="88" ry="54" fill="none" stroke="#FF5A52" stroke-width="7" opacity=".55"/></g>`;
    return g(x, y, s, `<g opacity=".18" transform="translate(16 22)">${mata(1)}${mata(-1)}</g>${gagang(1)}${mata(1)}${gagang(-1)}${mata(-1)}<circle r="22" fill="#8A929C"/><circle r="10" fill="#E6EAEE"/>`, o.rot || 0);
  }

  // ---------- dompet kulit cokelat (lembar diselipkan lewat o.isi) ----------
  function dompetKulit(x, y, s, o = {}) {
    const isi = o.isi || "";
    return g(x, y, s, `<ellipse cx="0" cy="190" rx="300" ry="26" fill="#000" opacity=".16"/>
      <rect x="-280" y="-150" width="560" height="330" rx="34" fill="#6A3E22"/><rect x="-262" y="-134" width="524" height="298" rx="26" fill="none" stroke="#C99A62" stroke-width="5" stroke-dasharray="14 10"/>
      <rect x="-250" y="-126" width="500" height="40" rx="12" fill="#4E2C16"/>
      ${isi}
      <path d="M-280 -10 Q0 30 280 -10 L280 150 Q280 180 250 180 L-250 180 Q-280 180 -280 150Z" fill="#8A5530"/><path d="M-262 6 Q0 44 262 6" fill="none" stroke="#D8AA70" stroke-width="5" stroke-dasharray="14 10"/>
      <path d="M-200 60 Q0 80 200 60" stroke="#A86A3C" stroke-width="10" fill="none" opacity=".6"/><circle cx="0" cy="110" r="16" fill="#C99A62"/><circle cx="0" cy="110" r="7" fill="#7A4A26"/>`, o.rot || 0);
  }

  // ---------- surat utang negara (kertas berbingkai POLOS, tanpa tenor/tahun/angka bunga) ----------
  function suratObligasi(x, y, s, o = {}) {
    let baris = ""; for (let i = 0; i < 5; i++) baris += `<rect x="-150" y="${-40 + i * 30}" width="${i === 4 ? 160 : 300}" height="9" rx="4" fill="#B9A57A" opacity=".75"/>`;
    return g(x, y, s, `<rect x="-206" y="-246" width="420" height="500" rx="12" fill="#000" opacity=".16"/><rect x="-210" y="-250" width="420" height="500" rx="12" fill="#F7EED6"/>
      <rect x="-190" y="-230" width="380" height="460" rx="6" fill="none" stroke="#7A2E3A" stroke-width="8"/><rect x="-176" y="-216" width="352" height="432" rx="4" fill="none" stroke="#C9A050" stroke-width="3" stroke-dasharray="6 6"/>
      <rect x="-120" y="-170" width="240" height="22" rx="8" fill="#7A2E3A" opacity=".85"/><rect x="-80" y="-130" width="160" height="12" rx="6" fill="#C9A050"/>
      ${baris}<circle cx="110" cy="160" r="46" fill="#C23A3A"/><circle cx="110" cy="160" r="34" fill="none" stroke="#F7D9A0" stroke-width="4" stroke-dasharray="7 5"/><path d="M90 196 L80 240 L100 226 L110 246 L118 202Z" fill="#C23A3A"/>
      ${o.kilau ? `<rect x="-210" y="-250" width="420" height="500" rx="12" fill="#FFF6B0" opacity="${f2(o.kilau * 0.4)}"/>` : ""}`, o.rot || 0);
  }

  // ---------- radio tabung kayu (tanpa tulisan/angka) ----------
  function radioTabung(x, y, s, t = 0, o = {}) {
    const ny = o.nyala ?? 1, id = uid("rt");
    let kisi = ""; for (let i = 0; i < 9; i++) kisi += `<path d="M${-150 + i * 37} -210 L${-150 + i * 37} -40" stroke="#4A2E1A" stroke-width="7" opacity=".55"/>`;
    return g(x, y, s, `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#FFC877" stop-opacity="${f2(0.5 * ny)}"/><stop offset="1" stop-color="#FFC877" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="0" cy="-160" rx="330" ry="260" fill="url(#${id})"/><ellipse cx="0" cy="6" rx="230" ry="18" fill="#000" opacity=".25"/>
      <path d="M-210 0 L-210 -230 Q-210 -380 0 -380 Q210 -380 210 -230 L210 0Z" fill="#8A5230"/><path d="M-186 -24 L-186 -226 Q-186 -352 0 -352 Q186 -352 186 -226 L186 -24Z" fill="#A8683C"/>
      <path d="M-166 -40 L-166 -220 Q-166 -326 0 -326 Q166 -326 166 -220 L166 -40Z" fill="#D9B47A"/>${kisi}
      <rect x="-150" y="-18" width="300" height="40" rx="10" fill="#5A3420"/><rect x="-110" y="-12" width="140" height="26" rx="8" fill="#F6D28A" opacity="${f2(0.5 + 0.5 * ny)}"/><path d="M${f1(-80 + Math.sin(t * 0.7) * 30)} -10 L${f1(-80 + Math.sin(t * 0.7) * 30)} 12" stroke="#C23A3A" stroke-width="4"/>
      <circle cx="90" cy="2" r="17" fill="#3A2214"/><circle cx="130" cy="2" r="17" fill="#3A2214"/><rect x="-200" y="20" width="400" height="16" rx="6" fill="#6A3E22"/>`);
  }

  // ---------- lampu teplok ----------
  function lampuTeplok(x, y, s, t = 0) {
    const id = uid("lt"), k = 1 + Math.sin(t * 9) * 0.04 + Math.sin(t * 13.7) * 0.03;
    return g(x, y, s, `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#FFD58A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="0" cy="-130" rx="${f1(340 * k)}" ry="${f1(300 * k)}" fill="url(#${id})"/><ellipse cx="0" cy="0" rx="62" ry="14" fill="#5A4A3A"/><path d="M-50 0 Q-60 -60 0 -70 Q60 -60 50 0Z" fill="#8A7A5A"/>
      <path d="M-30 -70 Q-46 -150 -22 -200 L22 -200 Q46 -150 30 -70Z" fill="#F6EED8" opacity=".55"/><path d="M0 -96 Q${f1(-12 * k)} -126 0 ${f1(-150 * k)} Q${f1(12 * k)} -126 0 -96Z" fill="#FFB648"/><path d="M0 -102 Q-5 -118 0 -132 Q5 -118 0 -102Z" fill="#FFF3C0"/>`);
  }

  // ---------- kamar tidur pagi masa kini ----------
  function kamarPagi(w, h, t = 0, o = {}) {
    const ly = o.lantai ?? h * 0.7, id = uid("kp"), id2 = uid("kq");
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6DA" stop-opacity=".75"/><stop offset="1" stop-color="#FFF6DA" stop-opacity="0"/></linearGradient>
      <linearGradient id="${id2}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE3F0"/><stop offset="1" stop-color="#F6E7C6"/></linearGradient></defs>
      <rect width="${w}" height="${h}" fill="#D9E6EA"/><rect y="${ly - 40}" width="${w}" height="40" fill="#C6D6DC"/>`;
    // jendela kanan dengan langit pagi
    const jx = w * 0.62, jy = ly - 1020;
    s += `<rect x="${jx - 14}" y="${jy - 14}" width="348" height="448" rx="10" fill="#F4F1EA"/><rect x="${jx}" y="${jy}" width="320" height="420" fill="url(#${id2})"/>
      <circle cx="${jx + 240}" cy="${jy + 110}" r="46" fill="#FFF1C9"/><ellipse cx="${jx + 100}" cy="${jy + 160}" rx="80" ry="22" fill="#FFFFFF" opacity=".8"/>
      <path d="M${jx} ${jy + 330} L${jx + 60} ${jy + 270} L${jx + 120} ${jy + 310} L${jx + 200} ${jy + 250} L${jx + 320} ${jy + 320} L${jx + 320} ${jy + 420} L${jx} ${jy + 420}Z" fill="#9DC3B6"/>
      <rect x="${jx + 154}" y="${jy}" width="12" height="420" fill="#F4F1EA"/><rect x="${jx}" y="${jy + 200}" width="320" height="10" fill="#F4F1EA"/>
      <path d="M${jx - 60} ${jy - 40} L${jx + 40} ${jy - 40} L${jx + 10} ${jy + 470} L${jx - 90} ${jy + 470}Z" fill="#F2A65A" opacity=".85"/>
      <path d="M${jx + 300} ${jy - 40} L${jx + 400} ${jy - 40} L${jx + 420} ${jy + 470} L${jx + 330} ${jy + 470}Z" fill="#F2A65A" opacity=".85"/>
      <path d="M${jx} ${jy + 420} L${jx + 320} ${jy + 420} L${jx - 200} ${ly + 300} L${jx - 600} ${ly + 300}Z" fill="url(#${id})" opacity=".55"/>`;
    // rak dinding kiri + tanaman + bingkai polos
    s += `<rect x="${w * 0.08}" y="${ly - 820}" width="300" height="16" rx="6" fill="#B9875A"/>${A.potTanaman ? A.potTanaman(w * 0.08 + 70, ly - 820, 0.5, A.PALET.siang, t) : ""}
      <rect x="${w * 0.08 + 160}" y="${ly - 900}" width="90" height="80" rx="6" fill="#F2B65C"/><rect x="${w * 0.08 + 170}" y="${ly - 890}" width="70" height="60" rx="4" fill="#7FB7B0"/>
      <rect x="${w * 0.12}" y="${ly - 640}" width="220" height="170" rx="8" fill="#F4F1EA"/><rect x="${w * 0.12 + 14}" y="${ly - 626}" width="192" height="142" rx="4" fill="#F28C7A" opacity=".7"/><circle cx="${w * 0.12 + 110}" cy="${ly - 555}" r="38" fill="#FFE08A"/>`;
    // lantai kayu
    s += `<rect y="${ly}" width="${w}" height="${h - ly + 400}" fill="#C99A6A"/>`;
    for (let i = 0; i < 9; i++) s += `<path d="M${-200 + i * 180} ${ly} L${-600 + i * 260} ${h + 200}" stroke="#B5845A" stroke-width="5"/>`;
    // kasur
    s += `<rect x="${w * 0.0 - 60}" y="${ly - 200}" width="${w * 0.66}" height="230" rx="30" fill="#FFFFFF"/><rect x="${w * 0.0 - 60}" y="${ly - 120}" width="${w * 0.66}" height="170" rx="26" fill="#5B8CC9"/>
      <path d="M${w * 0.05} ${ly - 120} q60 -30 120 0 t120 0 t120 0 t120 0" stroke="#7FA6DA" stroke-width="10" fill="none"/><rect x="${w * 0.02}" y="${ly - 290}" width="230" height="110" rx="40" fill="#F4F1EA"/>
      <rect x="${w * 0.66 - 70}" y="${ly - 430}" width="40" height="480" rx="14" fill="#8A5A34"/>`;
    return s;
  }

  // ---------- interior rumah kampung 1950 malam ----------
  function rumah1950Malam(w, h, t = 0, o = {}) {
    const my = o.meja ?? h * 0.68;
    let s = `<rect width="${w}" height="${h}" fill="#5A3E2A"/>`;
    for (let i = 0; i < Math.ceil(w / 120) + 1; i++) s += `<rect x="${i * 120}" y="0" width="114" height="${h}" fill="${i % 2 ? "#664630" : "#6E4C34"}"/><rect x="${i * 120 + 114}" y="0" width="6" height="${h}" fill="#3E2A1C"/>`;
    // jendela malam
    const jx = w * 0.12, jy = my - 980;
    s += `<rect x="${jx - 20}" y="${jy - 20}" width="400" height="480" fill="#3E2A1C"/><svg x="${jx}" y="${jy}" width="360" height="440">${A.langit(A.PALET.malam, 360, 440, t, { suryaX: 270, suryaY: 90 })}${A.rumahKampung(180, 440, 0.42, A.PALET.malam)}</svg>
      <rect x="${jx + 172}" y="${jy}" width="16" height="440" fill="#3E2A1C"/><rect x="${jx}" y="${jy + 210}" width="360" height="14" fill="#3E2A1C"/>`;
    // kalender/jam DILARANG → dinding hanya anyaman tikar
    s += `<g opacity=".5">${[0, 1, 2, 3].map((i) => `<path d="M${w * 0.62} ${my - 900 + i * 40} L${w * 0.92} ${my - 900 + i * 40}" stroke="#A8865A" stroke-width="14"/>`).join("")}</g>`;
    s += `<rect y="${my}" width="${w}" height="${h - my + 400}" fill="#4A3020"/><rect x="${w * 0.08}" y="${my - 30}" width="${w * 0.84}" height="40" rx="10" fill="#8A5A34"/><rect x="${w * 0.08}" y="${my + 10}" width="${w * 0.84}" height="18" fill="#000" opacity=".25"/>
      <rect x="${w * 0.12}" y="${my + 10}" width="30" height="400" fill="#6A4226"/><rect x="${w * 0.88 - 30}" y="${my + 10}" width="30" height="400" fill="#6A4226"/>`;
    return s;
  }
  // keluarga siluet tanpa wajah (duduk di balik meja)
  function siluetDuduk(x, y, s, warna = "#2A1C14", o = {}) {
    const k = o.angguk || 0;
    return g(x, y, s, `<path d="M-90 0 Q-96 -170 0 -180 Q96 -170 90 0Z" fill="${warna}"/><ellipse cx="0" cy="${f1(-240 + k)}" rx="62" ry="70" fill="${warna}"/>${o.peci ? `<rect x="-58" y="${f1(-318 + k)}" width="116" height="40" rx="8" fill="${warna}"/>` : ""}${o.sanggul ? `<circle cx="${50}" cy="${f1(-262 + k)}" r="30" fill="${warna}"/>` : ""}`);
  }

  // ---------- siluet bapak berjas + peci (tokoh nyata: TANPA wajah) ----------
  function siluetPeci(x, y, s, o = {}) {
    const c = o.warna || "#2A2230", ar = o.arah || 1, l = o.langkah || 0, jl = o.jalan || 0, ay = Math.sin(l) * 16 * jl, bob = -Math.abs(Math.sin(l)) * 8 * jl;
    const tg = o.tangan || [150, -380];
    return g(x, y, s, `<g transform="scale(${ar} 1)"><ellipse cx="0" cy="6" rx="110" ry="16" fill="#000" opacity=".2"/><g transform="translate(0 ${f1(bob)})">
      <g transform="rotate(${f1(ay)} -28 -250)"><rect x="-50" y="-260" width="40" height="262" rx="14" fill="${c}"/></g><g transform="rotate(${f1(-ay)} 28 -250)"><rect x="8" y="-260" width="40" height="262" rx="14" fill="${c}"/></g>
      <path d="M-84 -560 Q0 -588 84 -560 L98 -228 Q60 -200 0 -212 Q-60 -200 -98 -228Z" fill="${c}"/>
      <path d="M-70 -520 Q-120 ${f1(-400 + ay * 2)} -96 ${f1(-300 + ay)}" stroke="${c}" stroke-width="42" stroke-linecap="round" fill="none"/>
      <path d="M70 -520 Q${f1(70 + tg[0] * 0.6)} ${f1(-520 + (tg[1] + 520) * 0.3)} ${f1(tg[0])} ${f1(tg[1])}" stroke="${c}" stroke-width="42" stroke-linecap="round" fill="none"/>
      <rect x="-24" y="-610" width="48" height="60" fill="${c}"/><ellipse cx="0" cy="-662" rx="60" ry="68" fill="${c}"/><path d="M-62 -700 L-56 -760 Q0 -772 56 -760 L62 -700 Q0 -714 -62 -700Z" fill="${c}"/></g></g>`);
  }

  // ---------- gedung bank bergaya kolonial GENERIK ----------
  function gedungBankKolonial(x, y, s, o = {}) {
    const p = cl(o.pintu || 0), id = uid("gb");
    let kol = ""; for (let i = 0; i < 6; i++) { const cx = -450 + i * 180; kol += `<rect x="${cx - 34}" y="-620" width="68" height="560" fill="#F4EEDF"/><rect x="${cx - 34}" y="-620" width="18" height="560" fill="#FFFFFF" opacity=".6"/><rect x="${cx - 46}" y="-640" width="92" height="26" fill="#E6DCC6"/><rect x="${cx - 46}" y="-66" width="92" height="20" fill="#E6DCC6"/>`; }
    return g(x, y, s, `<defs><radialGradient id="${id}" cx=".5" cy=".7" r=".7"><stop offset="0" stop-color="#FFF3C0"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient></defs>
      <rect x="-560" y="-700" width="1120" height="660" fill="#E9DFC8"/><path d="M-600 -700 L0 -940 L600 -700Z" fill="#F4EEDF"/><path d="M-520 -716 L0 -900 L520 -716Z" fill="#E0D3B8"/><circle cx="0" cy="-790" r="46" fill="#D8C7A2"/>
      <rect x="-620" y="-720" width="1240" height="28" fill="#D8CBAE"/>
      <rect x="-120" y="-420" width="240" height="380" fill="#4A3426"/><g transform="translate(-120 0) scale(${f2(1 - p * 0.85)} 1)"><rect x="0" y="-420" width="120" height="380" fill="#6A4A30"/><rect x="16" y="-400" width="88" height="160" fill="#7A5638"/></g>
      <g transform="translate(120 0) scale(${f2(-(1 - p * 0.85))} 1)"><rect x="0" y="-420" width="120" height="380" fill="#6A4A30"/><rect x="16" y="-400" width="88" height="160" fill="#7A5638"/></g>
      ${p > 0 ? `<rect x="${f1(-120 + 240 * (1 - p * 0.85) * 0.5 * 0)}" y="-420" width="240" height="380" fill="#FFF0B0" opacity="${f2(p * 0.9)}"/><path d="M-120 -40 L120 -40 L${f1(260 + p * 200)} 120 L${f1(-260 - p * 200)} 120Z" fill="url(#${id})" opacity="${f2(p)}"/>` : ""}
      ${kol}<rect x="-640" y="-46" width="1280" height="30" fill="#D8CBAE"/><rect x="-680" y="-16" width="1360" height="30" fill="#CBBD9E"/><rect x="-720" y="14" width="1440" height="30" fill="#BFB090"/>`);
  }
  function jalan1950(w, h, t = 0, o = {}) {
    const ty = o.tanah ?? h * 0.74, P = A.PALET.senja;
    return `<svg width="${w}" height="${h}">${A.langit(P, w, ty, t, { suryaX: w * 0.2, suryaY: ty * 0.5 })}</svg>
      ${A.pohon ? A.pohon(w * 0.08, ty, 1.1, P, t) + A.pohon(w * 0.94, ty, 1.0, P, t) : ""}
      <rect y="${ty}" width="${w}" height="${h - ty + 400}" fill="#B89A72"/><rect y="${ty}" width="${w}" height="14" fill="#9A7E5A"/>
      <path d="M${w * 0.35} ${ty} L${w * 0.65} ${ty} L${w * 0.9} ${h + 200} L${w * 0.1} ${h + 200}Z" fill="#A88A62"/>`;
  }
  function kantor1950(w, h, t = 0, o = {}) {
    const my = o.meja ?? h * 0.7;
    let s = A.ruangKerjaTua ? A.ruangKerjaTua(w, h, A.PALET.siang, t, { meja: my, jendelaX: w * 0.7 }) : `<rect width="${w}" height="${h}" fill="#B79A78"/>`;
    return s;
  }
  function lemariArsip(x, y, s) {
    let l = ""; for (let i = 0; i < 4; i++) l += `<rect x="-120" y="${-560 + i * 140}" width="240" height="128" rx="8" fill="#6E7A6A"/><rect x="-40" y="${-510 + i * 140}" width="80" height="18" rx="9" fill="#C9CFC2"/>`;
    return g(x, y, s, `<rect x="-136" y="-580" width="272" height="580" rx="10" fill="#525C50"/>${l}`);
  }

  // ---------- barang (tanpa merek) ----------
  const karungBeras = (x, y, s) => g(x, y, s, `<path d="M-90 0 Q-110 -120 -70 -200 L70 -200 Q110 -120 90 0Z" fill="#EFE6CF"/><path d="M-70 -200 Q0 -230 70 -200 Q40 -240 0 -246 Q-40 -240 -70 -200Z" fill="#E0D4B6"/><path d="M-60 -110 L60 -110" stroke="#5B8CC9" stroke-width="12"/><path d="M-60 -84 L60 -84" stroke="#D8403A" stroke-width="8"/>`);
  const botolMinyak = (x, y, s) => g(x, y, s, `<rect x="-44" y="-220" width="88" height="220" rx="24" fill="#F2C94C" opacity=".92"/><rect x="-44" y="-140" width="88" height="70" fill="#FFF4D0" opacity=".8"/><rect x="-20" y="-262" width="40" height="44" rx="6" fill="#3F8A4E"/><rect x="-30" y="-210" width="14" height="190" rx="7" fill="#FFFFFF" opacity=".35"/>`);
  const telurRak = (x, y, s) => g(x, y, s, `<rect x="-110" y="-40" width="220" height="40" rx="8" fill="#C7B08A"/>${[-70, 0, 70].map((dx) => `<ellipse cx="${dx}" cy="-70" rx="30" ry="38" fill="#F4E2C6"/><ellipse cx="${dx - 8}" cy="-82" rx="8" ry="12" fill="#FFF" opacity=".6"/>`).join("")}`);

  // ---------- sepiring gorengan + tangan berebut ----------
  function piringGorengan(x, y, s, t = 0) {
    let uap = ""; for (let i = 0; i < 3; i++) { const q = (t * 0.5 + i / 3) % 1; uap += `<path d="M${-60 + i * 60} ${f1(-110 - q * 160)} q-20 -30 0 -60 q20 -30 0 -60" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round" opacity="${f2(0.5 * Math.sin(Math.PI * q))}"/>`; }
    const bakwan = (bx, by, r) => `<ellipse cx="${bx}" cy="${by}" rx="${r}" ry="${r * 0.55}" fill="#C9862E"/><ellipse cx="${bx - r * 0.2}" cy="${by - r * 0.15}" rx="${r * 0.5}" ry="${r * 0.22}" fill="#E8A940"/><circle cx="${bx + r * 0.3}" cy="${by - 4}" r="6" fill="#6A9A3A"/><circle cx="${bx - r * 0.4}" cy="${by + 6}" r="5" fill="#E26A3A"/>`;
    const tempe = (bx, by) => `<rect x="${bx - 46}" y="${by - 22}" width="92" height="44" rx="12" fill="#B9782A"/><rect x="${bx - 38}" y="${by - 16}" width="76" height="14" rx="6" fill="#E0A048"/>`;
    const pisang = (bx, by) => `<path d="M${bx - 60} ${by} Q${bx} ${by - 50} ${bx + 60} ${by} Q${bx} ${by - 18} ${bx - 60} ${by}Z" fill="#D8963A"/><path d="M${bx - 40} ${by - 12} Q${bx} ${by - 38} ${bx + 40} ${by - 12}" stroke="#F0BE5A" stroke-width="8" fill="none"/>`;
    return g(x, y, s, `${uap}<ellipse cx="0" cy="28" rx="250" ry="40" fill="#000" opacity=".2"/><ellipse cx="0" cy="0" rx="240" ry="62" fill="#F4F1EA"/><ellipse cx="0" cy="-6" rx="190" ry="44" fill="#E3DED2"/>
      ${bakwan(-80, -30, 70)}${tempe(70, -40)}${pisang(0, -60)}${bakwan(60, -80, 56)}${tempe(-50, -96)}`);
  }
  function tanganRaih(x0, y0, x1, y1, kulit = "#E0A878", lengan = "#5A6A7A") {
    return `<path d="M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}" stroke="${lengan}" stroke-width="58" stroke-linecap="round"/><circle cx="${f1(x1)}" cy="${f1(y1)}" r="36" fill="${kulit}"/>
      <g transform="translate(${f1(x1)} ${f1(y1)}) rotate(${f1((Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI)})">${[-24, -8, 8, 24].map((a) => `<path d="M20 ${a * 0.8} L56 ${a * 1.2}" stroke="${kulit}" stroke-width="15" stroke-linecap="round"/>`).join("")}</g>`;
  }

  // ---------- efek kecil ----------
  function konfeti(x, y, k, benih = 3) {
    if (k <= 0 || k >= 1) return ""; const r = acak(benih); let s = "";
    for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.4, v = 260 + r() * 300, px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 520 * k * k, c = ["#FFC93C", "#E2232E", "#1F8A8A", "#5B8CFF", "#F28CB0"][i % 5];
      s += `<rect x="${f1(px)}" y="${f1(py)}" width="18" height="10" rx="2" fill="${c}" transform="rotate(${f1(r() * 360 + k * 600)} ${f1(px)} ${f1(py)})" opacity="${f2(1 - k * k)}"/>`; }
    return s;
  }
  function kilauBintang(x, y, r, a) {
    if (a <= 0) return "";
    return `<path d="M${x} ${f1(y - r)} Q${x} ${y} ${f1(x + r)} ${y} Q${x} ${y} ${x} ${f1(y + r)} Q${x} ${y} ${f1(x - r)} ${y} Q${x} ${y} ${x} ${f1(y - r)}Z" fill="#FFF6B0" opacity="${f2(a)}"/>`;
  }
  function mejaModern(w, h, o = {}) {
    const my = o.meja ?? h * 0.68;
    return `<rect width="${w}" height="${h}" fill="#E8F0EE"/><rect y="${my - 760}" width="${w}" height="8" fill="#D2DEDB"/><rect x="${w * 0.1}" y="${my - 700}" width="${w * 0.8}" height="300" rx="20" fill="#F6FAF9"/>
      <rect y="${my}" width="${w}" height="${h - my + 400}" fill="#BFD6D2"/><rect y="${my - 18}" width="${w}" height="36" rx="8" fill="#F4F1EA"/><rect y="${my + 18}" width="${w}" height="20" fill="#000" opacity=".08"/>`;
  }

  Object.assign(A, { WARNA_UANG, uangFiktif, gunting, dompetKulit, suratObligasi, radioTabung, lampuTeplok, kamarPagi, rumah1950Malam, siluetDuduk, siluetPeci,
    gedungBankKolonial, jalan1950, kantor1950, lemariArsip, karungBeras, botolMinyak, telurRak, piringGorengan, tanganRaih, konfeti, kilauBintang, mejaModern });
})(typeof window !== "undefined" ? window : globalThis);
