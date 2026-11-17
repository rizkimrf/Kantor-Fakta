/* PUSTAKA ASET GEOLOGI & PETA — "Ternyata Begitu" (Yoga, 17 Nov 2026; dibuat untuk I-013 Danau Toba)
 * Muat SETELAH aset-set.js. Menambah fungsi ke ASET (gaya datar tanpa garis hitam, tanpa tulisan di gambar).
 *  ASET.duniaToba(P, t, o)      → dunia vertikal 2400×3900 (viewBox x -660..1740): langit, tebing kaldera, permukaan danau (y 1150),
 *                                  bawah air berbentuk MANGKUK raksasa; o: {glow 0..1 (cahaya oranye samar di dasar), samosir 0..1 (dasar terdorong naik jadi pulau), sinar 0..1}
 *  ASET.perahuKecil(x,y,s,P,t,o)→ perahu kayu kecil; o.bagian: 'belakang' | 'depan' (Tebe diselipkan di antaranya)
 *  ASET.penampangMagma(w,h,P,t,o)→ penampang bumi malam: dapur magma, letusan, dapur kosong, atap ambles, mangkuk terisi air
 *                                  o: {letus, kosong, runtuh, air} masing-masing 0..1
 *  ASET.petaDunia(o)            → peta datar Afrika–Asia–Sumatra tanpa label (koordinat: ASET.petaXY(bujur, lintang)), o: {darat, laut}
 *  ASET.jejakAbu(dari, ke, k, t, o) → pita abu kelabu melengkung dari titik ke titik, k 0..1 = seberapa jauh sudah terbang
 *  ASET.guaPesisir(w,h,P,t,o)   → mulut gua tebing laut saat senja + penampang lantai gua (garis abu sangat tipis); o: {lantai, garisAbu}
 *  ASET.apiKecil(x,y,s,t,o) · ASET.bekasApi(x,y,s) · ASET.alatBatu(x,y,s,rot) · ASET.serpihanKaca(x,y,s,t) · ASET.manusiaPurba(x,y,s,t,o)
 *  ASET.intiSedimen(x,y,s,o)    → tabung inti sedimen mendatar dengan satu pita abu pucat tipis
 *  ASET.danauLuas(w,h,P,t,o)    → danau luas berlangit cerah (Malawi) + meja lapangan; ASET.kepingSalju(x,y,s,o) · ASET.kardus(x,y,s,o) · ASET.banRenang(x,y,s,o)
 */
(function (root) {
  const A = root.ASET || (root.ASET = {});
  let _id = 0; const uid = (p) => `${p}g${++_id}`;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const f0 = (v) => (+v).toFixed(0), f1 = (v) => (+v).toFixed(1), f2 = (v) => (+v).toFixed(2);
  const acakDari = (benih) => { let s = benih; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;
  const malam = (P) => P.nama === "malam", senja = (P) => P.nama === "senja";

  // ---------- warna danau per palet ----------
  const AIR = {
    siang: { atas: "#4FB3BF", tengah: "#2A7F9A", bawah: "#123E5E", dalam: "#0B2440", kilau: "#BFEDEA", batu: "#2C3F52", batuB: "#243546", batuS: "#36506A" },
    senja: { atas: "#3E7FA0", tengah: "#24557A", bawah: "#132E52", dalam: "#0A1A36", kilau: "#FFD9A0", batu: "#2A3248", batuB: "#20283C", batuS: "#3A4460" },
    malam: { atas: "#2A5577", tengah: "#1B3C5C", bawah: "#102844", dalam: "#081830", kilau: "#8FA9C6", batu: "#222C40", batuB: "#1A2234", batuS: "#2E3A52" },
  };
  const airDari = (P) => AIR[P.nama] || AIR.siang;

  // ---------- dunia Toba (vertikal) ----------
  // permukaan y=1150; mangkuk: dinding dari (-560,1150) & (1640,1150) melengkung ke dasar (540, 3480)
  function duniaToba(P, t = 0, o = {}) {
    const C = airDari(P), Y = 1150, gl = cl(o.glow ?? 0.6), sm = cl(o.samosir ?? 0), sn = cl(o.sinar ?? 1);
    const ls = uid("tl"), la = uid("ta"), lg = uid("tg"), lc = uid("tc"), lr = uid("tr"), lh = uid("th");
    let s = `<defs><linearGradient id="${ls}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.langit[0]}"/><stop offset="1" stop-color="${P.langit[1]}"/></linearGradient>
      <linearGradient id="${la}" x1="0" y1="${Y}" x2="0" y2="3600" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.atas}"/><stop offset=".25" stop-color="${C.tengah}"/><stop offset=".7" stop-color="${C.bawah}"/><stop offset="1" stop-color="${C.dalam}"/></linearGradient>
      <radialGradient id="${lg}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF8A2A" stop-opacity=".85"/><stop offset=".45" stop-color="#E8562A" stop-opacity=".35"/><stop offset="1" stop-color="#E8562A" stop-opacity="0"/></radialGradient>
      <linearGradient id="${lr}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".22"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
      <radialGradient id="${lh}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${P.suryaHalo}" stop-opacity=".75"/><stop offset="1" stop-color="${P.suryaHalo}" stop-opacity="0"/></radialGradient>
      <clipPath id="${lc}"><path d="M-560 ${Y} C-520 2500 -40 3470 540 3480 C1120 3470 1600 2500 1640 ${Y} Z"/></clipPath></defs>`;
    // langit + matahari
    const sx = o.suryaX ?? 860, sy = o.suryaY ?? (senja(P) ? 900 : 380);
    s += `<rect x="-660" y="0" width="2400" height="${Y + 10}" fill="url(#${ls})"/><circle cx="${sx}" cy="${sy}" r="320" fill="url(#${lh})"/><circle cx="${sx}" cy="${sy}" r="70" fill="${P.surya}"/>`;
    if (P.bintang) { const r = acakDari(5); for (let i = 0; i < 50; i++) s += `<circle cx="${f0(-660 + r() * 2400)}" cy="${f0(r() * 700)}" r="${f1(1 + r() * 2)}" fill="#F4EEDC" opacity="${f2(P.bintang * (0.4 + 0.5 * Math.abs(Math.sin(t + i))))}"/>`; }
    for (const [x, y, sk] of [[-300, 420, 1.1], [300, 300, 0.8], [1150, 520, 1.0], [1500, 260, 0.7]]) if (A.awan) s += A.awan(x + Math.sin(t * 0.05 + x) * 30, y, sk, P, 0.9);
    // tepi jauh kaldera (bukit rendah memanjang) + pulau jauh
    s += A.bukit ? A.bukit(2400, Y - 40, 120, 7, P.jauh, Y + 4).replace(/M-200/, "M-860").replace(/H-200/, "H-860") : "";
    s += `<path d="M260 ${Y + 2} Q330 ${Y - 58} 460 ${Y - 64} Q600 ${Y - 70} 700 ${Y - 40} Q760 ${Y - 20} 800 ${Y + 2} Z" fill="${P.tengah}" opacity=".9"/>`;
    // tebing kaldera curam kiri & kanan (dekat)
    s += `<path d="M-660 ${Y + 4} L-660 520 Q-260 470 -20 700 Q90 880 150 ${Y + 4} Z" fill="${P.tengah}"/><path d="M-660 600 Q-260 560 -60 760 Q40 920 90 ${Y + 4} L150 ${Y + 4} Q90 880 -20 700 Q-260 470 -660 520Z" fill="${P.dekat}" opacity=".8"/>`;
    s += `<path d="M1740 ${Y + 4} L1740 560 Q1330 500 1080 740 Q960 900 920 ${Y + 4} Z" fill="${P.tengah}"/><path d="M1740 640 Q1340 600 1120 800 Q1010 930 980 ${Y + 4} L920 ${Y + 4} Q960 900 1080 740 Q1330 500 1740 560Z" fill="${P.dekat}" opacity=".8"/>`;
    for (const [x, y, k] of [[-420, 560, 1], [-200, 560, 0.8], [1300, 600, 0.9], [1520, 580, 1.1]]) s += A.pohon ? A.pohon(x, y + 30, 0.55 * k, P, t) : "";
    // batuan di luar mangkuk
    s += `<rect x="-660" y="${Y}" width="2400" height="2800" fill="${C.batu}"/>`;
    const rb = acakDari(31);
    for (let i = 0; i < 9; i++) { const yy = Y + 200 + i * 300; s += `<path d="M-660 ${yy} Q0 ${yy + 60 * (rb() - 0.5)} 540 ${yy + 40} T1740 ${yy}" stroke="${i % 2 ? C.batuB : C.batuS}" stroke-width="${f0(26 + rb() * 30)}" fill="none" opacity=".7"/>`; }
    // cahaya magma samar jauh di bawah dasar (petunjuk, bukan letusan)
    if (gl > 0) s += `<ellipse cx="540" cy="3640" rx="${f0(1000)}" ry="420" fill="url(#${lg})" opacity="${f2(gl)}"/>` +
      [[-200, 3560, 300, 3700], [300, 3520, 160, 3780], [820, 3520, 980, 3760], [1220, 3480, 1100, 3720]].map(([a, b, c, d], i) => `<path d="M${a} ${b} L${(a + c) / 2 + 30} ${(b + d) / 2} L${c} ${d}" stroke="#FF9A3C" stroke-width="${10 - i}" fill="none" stroke-linecap="round" opacity="${f2(gl * (0.45 + 0.25 * Math.sin(t * 2 + i)))}"/>`).join("");
    // isi mangkuk: air
    s += `<g clip-path="url(#${lc})"><rect x="-660" y="${Y}" width="2400" height="2500" fill="url(#${la})"/>`;
    // sinar matahari menembus air
    if (sn > 0) for (let i = 0; i < 7; i++) { const x0 = -200 + i * 300 + Math.sin(t * 0.4 + i) * 40; s += `<path d="M${f0(x0)} ${Y} L${f0(x0 + 90)} ${Y} L${f0(x0 + 380)} ${Y + 1700} L${f0(x0 + 160)} ${Y + 1700}Z" fill="url(#${lr})" opacity="${f2(sn * 0.8)}"/>`; }
    // gelembung naik
    for (let i = 0; i < 14; i++) { const u = ((t * 0.12 + i * 0.071) % 1), x = -300 + ((i * 397) % 1700) + Math.sin(t * 2 + i) * 10, y = 3300 - u * 2100; s += `<circle cx="${f0(x)}" cy="${f0(y)}" r="${f1(6 + (i % 4) * 4)}" fill="${C.kilau}" opacity="${f2(0.35 * Math.sin(Math.PI * u))}"/>`; }
    // pinggir dasar mangkuk (endapan gelap) + cahaya dari bawah
    s += `<path d="M-560 ${Y} C-520 2500 -40 3470 540 3480 C1120 3470 1600 2500 1640 ${Y}" stroke="${C.batuS}" stroke-width="70" fill="none" opacity=".85"/>`;
    if (gl > 0) s += `<ellipse cx="540" cy="3480" rx="760" ry="200" fill="url(#${lg})" opacity="${f2(gl * 0.8)}"/>`;
    s += `</g>`;
    // SAMOSIR: dasar mangkuk terdorong naik jadi kubah, puncaknya muncul di atas air
    if (sm > 0) {
      const top = lerp(3460, Y - 190, sm), w1 = lerp(420, 640, sm);
      const kub = `M${540 - w1 - 260} 3480 C${540 - w1} ${f0(lerp(3470, 2200, sm))} ${540 - w1 * 0.55} ${f0(top + 40)} 540 ${f0(top)} C${540 + w1 * 0.55} ${f0(top + 40)} ${540 + w1} ${f0(lerp(3470, 2200, sm))} ${540 + w1 + 260} 3480 Z`;
      const ck = uid("tk"), cb = uid("tb");
      s += `<defs><clipPath id="${ck}"><path d="${kub}"/></clipPath><clipPath id="${cb}"><path d="M-560 ${Y} C-520 2500 -40 3470 540 3480 C1120 3470 1600 2500 1640 ${Y} L1740 0 L-660 0Z"/></clipPath></defs><g clip-path="url(#${cb})">`;
      s += `<path d="${kub}" fill="${C.batuS}"/><g clip-path="url(#${ck})">`;
      for (let i = 0; i < 6; i++) { const yy = top + 60 + i * 46; s += `<path d="M-200 ${f0(yy)} Q540 ${f0(yy - 50)} 1300 ${f0(yy)}" stroke="${i % 2 ? "#D9C9A0" : "#BFAE86"}" stroke-width="22" fill="none" opacity="${f2(0.85 - i * 0.1)}"/>`; }
      s += `<rect x="-660" y="${f0(top + 330)}" width="2400" height="3000" fill="${C.batu}" opacity=".55"/><rect x="-660" y="0" width="2400" height="${Y - 2}" fill="${P.daun}"/><rect x="-660" y="${f0(top)}" width="2400" height="${f0(Math.max(0, Y - top - 80))}" fill="${P.daunB}" opacity=".5"/></g>`;
      if (top < Y) for (const [dx, k] of [[-120, 0.7], [60, 0.9], [200, 0.6]]) s += A.pohon ? A.pohon(540 + dx, top + 22 + Math.abs(dx) * 0.18, 0.32 * k * cl((Y - top) / 200), P, t) : "";
      s += `</g>`;
    }
    // permukaan air: garis kilau + riak
    let kl = ""; for (let i = 0; i < 16; i++) { const x = ((i * 233 + t * 26) % 2600) - 760; kl += `<rect x="${f0(x)}" y="${Y + 6 + (i % 3) * 12}" width="${50 + (i % 5) * 16}" height="4" rx="2" fill="${C.kilau}" opacity=".6"/>`; }
    s += `<rect x="-660" y="${Y - 3}" width="2400" height="10" fill="${C.kilau}" opacity=".45"/>${kl}`;
    return s;
  }

  // ---------- perahu kayu kecil ----------
  function perahuKecil(x, y, s, P, t = 0, o = {}) {
    const goy = o.goyang ?? 1, rot = Math.sin(t * 1.6) * 3 * goy + (o.miring || 0), bob = Math.sin(t * 1.6 + 0.6) * 6 * goy;
    const kayu = malam(P) ? "#5A3E2E" : senja(P) ? "#8A5A3A" : "#A8663E", kayuG = malam(P) ? "#43301F" : senja(P) ? "#6E4630" : "#844C2C", sorot = "#E0A066";
    if (o.bagian === "belakang") return g(x, y + bob, s, `<path d="M-200 -30 Q0 -60 200 -30 L180 -10 L-180 -10Z" fill="${kayuG}"/>`, rot);
    return g(x, y + bob, s, `<ellipse cx="0" cy="40" rx="250" ry="22" fill="#000" opacity=".14"/><path d="M-230 -40 L230 -40 Q200 40 120 50 L-120 50 Q-200 40 -230 -40Z" fill="${kayu}"/><path d="M-230 -40 L230 -40 L224 -24 L-224 -24Z" fill="${sorot}" opacity=".7"/><path d="M-160 0 L160 0" stroke="${kayuG}" stroke-width="8"/>${o.dayung ? `<path d="M150 -30 L330 90" stroke="${kayuG}" stroke-width="12" stroke-linecap="round"/><ellipse cx="340" cy="100" rx="34" ry="14" fill="${kayuG}" transform="rotate(34 340 100)"/>` : ""}`, rot);
  }

  // ---------- penampang magma (malam bergaris lava) ----------
  // permukaan y=o.permukaan (760); dapur magma (cx, cy=1380, rx 430, ry 230); gunung di tengah
  function penampangMagma(w, h, P, t = 0, o = {}) {
    const ys = o.permukaan ?? 760, cx = w / 2, cy = o.dapurY ?? 1400, rx = 430, ry = 230;
    const le = cl(o.letus || 0), ko = cl(o.kosong || 0), ru = cl(o.runtuh || 0), ai = cl(o.air || 0);
    const id = uid("pm"), il = uid("pl"), ig = uid("pg"), ia = uid("pa"), ib = uid("pb");
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141C34"/><stop offset="1" stop-color="#2A2440"/></linearGradient>
      <radialGradient id="${il}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD36A"/><stop offset=".45" stop-color="#FF8A2A"/><stop offset="1" stop-color="#C8381E"/></radialGradient>
      <radialGradient id="${ig}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF7A2A" stop-opacity=".55"/><stop offset="1" stop-color="#FF7A2A" stop-opacity="0"/></radialGradient>
      <linearGradient id="${ia}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FA3C0"/><stop offset="1" stop-color="#1D4E78"/></linearGradient>
      <linearGradient id="${ib}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E5A6A"/><stop offset="1" stop-color="#3A3048"/></linearGradient></defs>`;
    s += `<rect width="${w}" height="${ys + 20}" fill="url(#${id})"/>`;
    { const r = acakDari(9); for (let i = 0; i < 40; i++) s += `<circle cx="${f0(r() * w)}" cy="${f0(r() * ys * 0.8)}" r="${f1(1 + r() * 2)}" fill="#F4EEDC" opacity="${f2(0.5 * (1 - le * 0.8))}"/>`; }
    // garis lava di langit (pita jingga tipis miring)
    for (let i = 0; i < 6; i++) { const yy = 120 + i * 95, xx = ((i * 260 + t * 40) % (w + 400)) - 200; s += `<path d="M${f0(xx)} ${yy} l260 -40" stroke="#FF8A3A" stroke-width="5" stroke-linecap="round" opacity="${f2(0.18 + le * 0.4)}"/>`; }
    // pegunungan jauh
    s += `<path d="M0 ${ys} L${w * 0.12} ${ys - 120} L${w * 0.24} ${ys - 40} L${w * 0.32} ${ys - 150} L${w * 0.4} ${ys - 30} L${w * 0.62} ${ys - 30} L${w * 0.72} ${ys - 140} L${w * 0.84} ${ys - 50} L${w} ${ys - 130} L${w} ${ys} Z" fill="#2C2E4A"/>`;
    // gunung tengah (hilang saat runtuh)
    const gt = 300 * (1 - ru) * (1 - le * 0.25);
    // lapisan batuan
    s += `<rect y="${ys}" width="${w}" height="${h - ys + 400}" fill="#4A3A4E"/>`;
    const warna = ["#5A4658", "#4E3E52", "#625064", "#463A50", "#584A60"];
    for (let i = 0; i < 9; i++) { const yy = ys + 60 + i * 150; s += `<path d="M0 ${yy} Q${w * 0.3} ${yy - 30} ${w * 0.5} ${yy + 10} T${w} ${yy - 10} V${yy + 150} H0Z" fill="${warna[i % 5]}" opacity=".9"/>`; }
    // cahaya di sekitar dapur
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 1.8}" ry="${ry * 2}" fill="url(#${ig})" opacity="${f2(1 - ko * 0.85)}"/>`;
    // dapur magma: penuh → kosong (rongga gelap)
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1A1424"/>`;
    const tinggiMagma = 1 - ko;
    if (tinggiMagma > 0) { const cm = uid("pc"); s += `<defs><clipPath id="${cm}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath></defs><g clip-path="url(#${cm})"><rect x="${cx - rx}" y="${f1(cy + ry - 2 * ry * tinggiMagma)}" width="${rx * 2}" height="${f1(2 * ry * tinggiMagma + 4)}" fill="url(#${il})"/>` +
      [0, 1, 2, 3].map((i) => `<circle cx="${f0(cx - 240 + i * 160 + Math.sin(t * 1.5 + i) * 30)}" cy="${f0(cy + ry - 2 * ry * tinggiMagma + 60 + (i % 2) * 70)}" r="${18 + i * 4}" fill="#FFE08A" opacity=".5"/>`).join("") + `</g>`; }
    // celah magma ke puncak (saat letus)
    if (le > 0 && ko < 1) { const k = cl(le * 1.4) * (1 - ko); s += [-60, 0, 70].map((dx, i) => `<path d="M${cx + dx * 2} ${cy - ry + 20} Q${cx + dx + Math.sin(t * 3 + i) * 10} ${(cy + ys) / 2} ${cx + dx * 0.3} ${ys - gt + 30}" stroke="#FF9A3C" stroke-width="${16 - i * 3}" fill="none" stroke-linecap="round" opacity="${f2(k)}"/>`).join(""); }
    // atap (blok di atas dapur) yang ambles + gunung di atasnya
    const turun = ru * (ry * 1.25), kiri = cx - rx * 0.95, kanan = cx + rx * 0.95;
    s += `<path d="M${kiri} ${f1(ys + turun)} L${kanan} ${f1(ys + turun)} L${kanan - 40} ${f1(cy - ry * 0.4 + turun)} L${kiri + 40} ${f1(cy - ry * 0.4 + turun)} Z" fill="url(#${ib})"/>`;
    if (ru > 0) s += [0.3, 0.5, 0.7].map((u, i) => `<path d="M${f0(lerp(kiri, kanan, u))} ${f1(ys + turun)} l${i % 2 ? 20 : -24} ${f0(90 + i * 30)} l${i % 2 ? -14 : 18} 80" stroke="#2A2234" stroke-width="7" fill="none" opacity="${f2(ru)}"/>`).join("") +
      `<path d="M${kiri} ${ys} L${kiri} ${f1(ys + turun + 6)}" stroke="#2A2234" stroke-width="12"/><path d="M${kanan} ${ys} L${kanan} ${f1(ys + turun + 6)}" stroke="#2A2234" stroke-width="12"/>`;
    if (gt > 2) s += `<path d="M${kiri + 30} ${f1(ys + turun)} L${cx - 70} ${f1(ys + turun - gt)} L${cx + 70} ${f1(ys + turun - gt)} L${kanan - 30} ${f1(ys + turun)} Z" fill="#3E3450"/><path d="M${cx - 70} ${f1(ys + turun - gt)} L${cx + 70} ${f1(ys + turun - gt)} L${cx + 40} ${f1(ys + turun - gt + 40)} L${cx - 40} ${f1(ys + turun - gt + 40)}Z" fill="${le > 0 && ko < 1 ? "#FF8A3A" : "#2E2640"}"/>`;
    // air mengisi mangkuk (dari bawah ke bibir)
    if (ai > 0) { const dasar = ys + turun, puncak = lerp(dasar, ys + 6, ai); s += `<rect x="${kiri}" y="${f1(puncak)}" width="${kanan - kiri}" height="${f1(Math.max(0, dasar - puncak))}" fill="url(#${ia})" opacity=".95"/><rect x="${kiri}" y="${f1(puncak - 3)}" width="${kanan - kiri}" height="8" fill="#BFEDEA" opacity=".6"/>`; }
    // kolom letusan (abu + lava)
    if (le > 0) {
      const top = ys - gt - le * (ys - gt + 200), alpha = 1 - ko * 0.9;
      s += `<path d="M${cx - 60} ${ys - gt + 10} Q${cx - 120} ${(top + ys) / 2} ${cx - 200} ${f0(top)} L${cx + 200} ${f0(top)} Q${cx + 120} ${(top + ys) / 2} ${cx + 60} ${ys - gt + 10}Z" fill="#6A6070" opacity="${f2(alpha * 0.9)}"/>`;
      for (let i = 0; i < 7; i++) { const u = i / 6, yy = lerp(ys - gt, top, u); s += `<circle cx="${f0(cx + Math.sin(i * 2.3 + t * 0.8) * 120 * u)}" cy="${f0(yy)}" r="${f0(90 + u * 160)}" fill="${i % 2 ? "#7A6E7E" : "#5E5466"}" opacity="${f2(alpha * 0.85)}"/>`; }
      for (let i = 0; i < 10; i++) { const u = ((t * 0.9 + i * 0.1) % 1), an = -Math.PI / 2 + (i - 4.5) * 0.18; s += `<circle cx="${f0(cx + Math.cos(an) * u * 520)}" cy="${f0(ys - gt + Math.sin(an) * u * 620 + u * u * 400)}" r="${f0(10 + (i % 3) * 5)}" fill="#FFB04A" opacity="${f2(alpha * (1 - u))}"/>`; }
    }
    return s;
  }

  // ---------- peta dunia datar (bujur -20..125, lintang 38..-40) ----------
  const petaXY = (lon, lat) => [(lon + 20) * 16, (38 - lat) * 16 + 420];
  const BENUA = {
    afrika: [[-17, 21], [-16, 12], [-12, 7], [-5, 5], [5, 5], [9, 4], [10, -2], [13, -10], [12, -17], [15, -27], [18, -34], [20, -35], [26, -34], [32, -28], [35, -23], [40, -15], [40, -10], [39, -5], [42, 0], [48, 5], [51, 11], [44, 11], [43, 13], [38, 18], [34, 27], [32, 31], [25, 32], [20, 31], [11, 33], [10, 37], [-1, 36], [-6, 35], [-10, 30]],
    madagaskar: [[44, -25], [43, -22], [44, -17], [47, -14], [50, -15], [49, -20], [47, -25]],
    arab: [[34, 28], [39, 22], [43, 13], [45, 13], [52, 16], [56, 18], [59, 22], [56, 26], [52, 24], [50, 26], [48, 30], [44, 34], [36, 34]],
    asia: [[26, 38], [36, 37], [40, 37], [48, 37], [52, 36], [57, 27], [62, 25], [67, 24], [70, 21], [73, 17], [75, 12], [77, 8], [80, 10], [80, 15], [82, 17], [87, 21], [90, 22], [92, 21], [94, 17], [97, 16], [98, 10], [100, 7], [101, 3], [103, 1.5], [104, 1.3], [103.5, 4], [103, 6], [101, 12], [105, 9], [107, 11], [109, 13], [109, 17], [107, 21], [110, 21], [117, 24], [121, 31], [122, 38]],
    srilanka: [[80, 10], [82, 8], [81.5, 6], [80, 6.5]],
    sumatra: [[95.3, 5.6], [98, 4], [100.5, 2], [103.5, -1], [106, -3], [105.8, -5.9], [104.5, -5.5], [102, -4], [100, -1], [98.5, 1.5], [96, 3.8]],
    jawa: [[105.2, -6.8], [108, -6.3], [111, -6.5], [114.5, -7.7], [114.4, -8.7], [110, -8.2], [106, -7.4]],
    kalimantan: [[109, 1.5], [109.6, -1], [111, -3], [114.5, -4], [116.5, -2.5], [118, 1], [119, 5], [117, 7], [115.5, 5], [113, 3], [111, 1.6]],
    australia: [[114, -22], [114, -26], [115, -34], [118, -35], [123, -34], [125, -32], [125, -15], [123, -16], [122, -18], [118, -20]],
  };
  const jalur = (pts) => { const p = pts.map(([a, b]) => petaXY(a, b)); let d = `M${f0(p[0][0])} ${f0(p[0][1])}`; for (let i = 1; i <= p.length; i++) { const q = p[i % p.length], m = p[(i - 1) % p.length]; d += ` Q${f0(m[0])} ${f0(m[1])} ${f0((m[0] + q[0]) / 2)} ${f0((m[1] + q[1]) / 2)}`; } return d + "Z"; };
  const PETA = Object.fromEntries(Object.entries(BENUA).map(([k, v]) => [k, jalur(v)]));
  function petaDunia(o = {}) {
    const darat = o.darat || "#8FAE7A", daratB = o.daratB || "#7A9A68", laut = o.laut || "#2F5E7E", w = 2400, h = 1920, il = uid("pd");
    let s = `<defs><radialGradient id="${il}" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="${laut}"/><stop offset="1" stop-color="#1E4058"/></radialGradient></defs><rect x="-200" y="0" width="${w + 400}" height="${h}" fill="url(#${il})"/>`;
    for (let i = 0; i < 10; i++) s += `<path d="M-200 ${300 + i * 150} H${w + 200}" stroke="#FFFFFF" stroke-width="2" opacity=".05"/>`;
    for (let i = 0; i < 14; i++) s += `<path d="M${i * 200} 0 V${h}" stroke="#FFFFFF" stroke-width="2" opacity=".04"/>`;
    for (const k in PETA) s += `<path d="${PETA[k]}" fill="#000" opacity=".18" transform="translate(8 12)"/>`;
    for (const k in PETA) s += `<path d="${PETA[k]}" fill="${k === "sumatra" && o.sorotSumatra ? "#C9D98A" : darat}"/>`;
    s += `<path d="${PETA.afrika}" fill="${daratB}" opacity=".35" transform="translate(0 30) scale(1 .98)"/>`;
    return s;
  }
  function jejakAbu(dari, ke, k, t = 0, o = {}) {
    k = cl(k); if (k <= 0) return "";
    const [x0, y0] = petaXY(...dari), [x1, y1] = petaXY(...ke), mx = (x0 + x1) / 2 + (o.lengkung?.[0] || 0), my = (y0 + y1) / 2 + (o.lengkung?.[1] ?? -120);
    const d = `M${f0(x0)} ${f0(y0)} Q${f0(mx)} ${f0(my)} ${f0(x1)} ${f0(y1)}`, L = 3000, id = uid("ja");
    let s = `<defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter></defs>`;
    s += `<path d="${d}" stroke="#C9C4C0" stroke-width="${o.lebar || 70}" fill="none" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${f1(L * (1 - k))}" opacity=".55" filter="url(#${id})"/>`;
    s += `<path d="${d}" stroke="#E6E2DC" stroke-width="${(o.lebar || 70) * 0.35}" fill="none" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${f1(L * (1 - k))}" opacity=".5"/>`;
    // butiran abu di ujung
    const u = k, bx = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * mx + u * u * x1, by = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * my + u * u * y1;
    if (k < 1) for (let i = 0; i < 8; i++) s += `<circle cx="${f0(bx + Math.sin(t * 3 + i * 2) * 40)}" cy="${f0(by + Math.cos(t * 2.4 + i) * 40)}" r="${8 + (i % 3) * 5}" fill="#E6E2DC" opacity=".6"/>`;
    return s;
  }
  function titikPeta(lon, lat, t = 0, o = {}) { const [x, y] = petaXY(lon, lat), p = 0.5 + 0.5 * Math.sin(t * 4); return `<circle cx="${f0(x)}" cy="${f0(y)}" r="${f0(30 + p * 16)}" fill="${o.warna || "#FFC93C"}" opacity="${f2(0.25 * (o.a ?? 1))}"/><circle cx="${f0(x)}" cy="${f0(y)}" r="16" fill="${o.warna || "#FFC93C"}" opacity="${f2(o.a ?? 1)}"/>`; }

  // ---------- gua tebing laut (senja) + penampang lantai ----------
  function guaPesisir(w, h, P, t = 0, o = {}) {
    const lt = o.lantai ?? 1060, ga = o.garisAbu ?? 1330, id = uid("gp"), im = uid("gm");
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A4A7A"/><stop offset=".55" stop-color="#F08A5A"/><stop offset="1" stop-color="#FFD08A"/></linearGradient>
      <clipPath id="${im}"><path d="M${w * 0.18} ${lt} Q${w * 0.2} 420 ${w * 0.5} 380 Q${w * 0.82} 420 ${w * 0.84} ${lt} Z"/></clipPath></defs>`;
    // batu tebing (dinding gua)
    s += `<rect width="${w}" height="${lt + 10}" fill="#4A3A3A"/>`;
    // pemandangan di mulut gua: langit senja + laut + matahari
    s += `<g clip-path="url(#${im})"><rect width="${w}" height="${lt}" fill="url(#${id})"/><circle cx="${w * 0.6}" cy="${lt - 260}" r="80" fill="#FFE6A6"/><circle cx="${w * 0.6}" cy="${lt - 260}" r="180" fill="#FFE6A6" opacity=".25"/>
      <rect y="${lt - 230}" width="${w}" height="240" fill="#4E5F8A"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${f0(((i * 170 + t * 18) % (w * 0.7)) + w * 0.2)}" y="${lt - 210 + (i % 3) * 40}" width="${70 + (i % 3) * 30}" height="5" rx="2" fill="#FFD9A0" opacity=".7"/>`).join("")}
      <path d="M${w * 0.18} ${lt - 140} Q${w * 0.3} ${lt - 200} ${w * 0.38} ${lt - 90} L${w * 0.38} ${lt} L${w * 0.18} ${lt}Z" fill="#3A2E34"/></g>`;
    // tekstur dinding gua (bongkah) & bayangan tepi mulut
    s += `<path d="M${w * 0.18} ${lt} Q${w * 0.2} 420 ${w * 0.5} 380 Q${w * 0.82} 420 ${w * 0.84} ${lt}" stroke="#3A2C2E" stroke-width="60" fill="none"/>`;
    for (const [x, y, r] of [[120, 300, 90], [260, 160, 70], [980, 220, 110], [1180, 520, 90], [80, 760, 80], [1220, 860, 70], [560, 160, 80]]) s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.6}" fill="#56443F" opacity=".7"/>`;
    // lantai gua (permukaan) — cahaya api hangat
    s += `<rect y="${lt}" width="${w}" height="${h - lt + 200}" fill="#6E5440"/>`;
    // lapisan tanah penampang
    const lap = ["#7A5E46", "#6A503C", "#846A50", "#5E4836", "#76604A"];
    for (let i = 0; i < 6; i++) { const yy = lt + 60 + i * 140; s += `<path d="M0 ${yy} Q${w * 0.3} ${yy + 16} ${w * 0.6} ${yy - 10} T${w} ${yy + 6} V${yy + 140} H0Z" fill="${lap[i % 5]}"/>`; }
    // garis abu Toba: SANGAT TIPIS (serpihan kaca mikroskopis), bukan lapisan tebal
    s += `<path d="M0 ${ga} Q${w * 0.3} ${ga + 8} ${w * 0.6} ${ga - 4} T${w} ${ga + 4}" stroke="#E8E4DA" stroke-width="5" fill="none" stroke-dasharray="14 8" opacity="${f2(o.sorotAbu ?? 0.85)}"/>`;
    if (o.sorotAbu) s += `<path d="M0 ${ga} Q${w * 0.3} ${ga + 8} ${w * 0.6} ${ga - 4} T${w} ${ga + 4}" stroke="#FFF4C8" stroke-width="16" fill="none" opacity="${f2(0.25 * o.sorotAbu)}"/>`;
    // permukaan lantai
    s += `<rect y="${lt - 6}" width="${w}" height="16" fill="#8A6A4E"/>`;
    return s;
  }
  function apiKecil(x, y, s, t = 0, o = {}) {
    const k = cl(o.nyala ?? 1), f = (i) => Math.sin(t * 11 + i * 1.7) * 0.12 + Math.sin(t * 6.3 + i) * 0.08, id = uid("ak");
    return g(x, y, s, `<defs><radialGradient id="${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFB24A" stop-opacity=".6"/><stop offset="1" stop-color="#FFB24A" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="0" cy="-40" rx="${f0(260 * k)}" ry="${f0(200 * k)}" fill="url(#${id})"/>
      <path d="M-70 10 L60 -14 M-60 -16 L70 10" stroke="#5A3A24" stroke-width="18" stroke-linecap="round"/>
      ${k > 0 ? `<path d="M-46 0 Q${f0(-50 - f(1) * 60)} -70 ${f0(-6 + f(2) * 40)} ${f0(-150 * k * (1 + f(3)))} Q${f0(18 + f(4) * 30)} -80 46 0Z" fill="#FF8A2A"/><path d="M-26 0 Q${f0(-24 - f(5) * 40)} -50 ${f0(2 + f(6) * 30)} ${f0(-100 * k * (1 + f(7)))} Q${f0(14 + f(8) * 20)} -50 26 0Z" fill="#FFD36A"/>` : ""}
      <ellipse cx="0" cy="8" rx="80" ry="12" fill="#3A2A20" opacity=".5"/>`);
  }
  function bekasApi(x, y, s, o = {}) { // lensa arang dalam penampang tanah
    return g(x, y, s, `<ellipse cx="0" cy="0" rx="90" ry="18" fill="#2A1E1A"/><ellipse cx="-10" cy="-3" rx="54" ry="9" fill="#5A2E1E"/><ellipse cx="0" cy="0" rx="110" ry="30" fill="#FF8A3A" opacity="${f2(o.nyala || 0)}"/>${[-50, -10, 30, 60].map((dx, i) => `<circle cx="${dx}" cy="${-4 + (i % 2) * 6}" r="${4 + (i % 2) * 2}" fill="#E2683A" opacity=".8"/>`).join("")}`);
  }
  function alatBatu(x, y, s, rot = 0, o = {}) {
    const c = o.warna || "#B8AFA0", c2 = o.warnaB || "#958C7E";
    return g(x, y, s, `<path d="M0 -50 L26 -14 L20 30 L0 50 L-20 30 L-26 -14Z" fill="${c}"/><path d="M0 -50 L26 -14 L4 0Z M-26 -14 L-4 6 L-20 30Z M4 0 L20 30 L0 50Z" fill="${c2}"/><path d="M-6 -30 L6 -26 M-10 10 L8 16" stroke="#FFFFFF" stroke-width="3" opacity=".35"/>`, rot);
  }
  function serpihanKaca(x, y, s, t = 0, o = {}) { // isi lingkaran mikroskop: serpihan kaca vulkanik tajam bening
    const r = acakDari(o.benih || 17); let q = `<circle r="200" fill="#EEF2EC"/>`;
    for (let i = 0; i < 13; i++) { const cx = (r() - 0.5) * 300, cy = (r() - 0.5) * 300, sz = 22 + r() * 34, a = r() * 360 + t * 4;
      q += `<g transform="translate(${f0(cx)} ${f0(cy)}) rotate(${f0(a)})"><path d="M0 ${-sz} L${f0(sz * 0.32)} ${f0(-sz * 0.1)} L${f0(sz * 0.18)} ${f0(sz * 0.9)} L${f0(-sz * 0.12)} ${f0(sz * 0.4)} L${f0(-sz * 0.36)} ${f0(-sz * 0.3)}Z" fill="#BFE6F0" opacity=".85"/><path d="M0 ${-sz} L${f0(sz * 0.32)} ${f0(-sz * 0.1)} L0 0Z" fill="#FFFFFF" opacity=".7"/></g>`; }
    for (let i = 0; i < 12; i++) q += `<circle cx="${f0((r() - 0.5) * 320)}" cy="${f0((r() - 0.5) * 320)}" r="${f1(6 + r() * 10)}" fill="#C9B894" opacity=".6"/>`;
    const id = uid("sk");
    return g(x, y, s, `<defs><clipPath id="${id}"><circle r="200"/></clipPath></defs><circle r="222" fill="#2A3440"/><g clip-path="url(#${id})">${q}</g><circle r="200" fill="none" stroke="#5A6878" stroke-width="12"/><path d="M-130 -110 A180 180 0 0 1 -40 -170" stroke="#FFFFFF" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/>`);
  }
  function manusiaPurba(x, y, s, t = 0, o = {}) { // siluet sederhana tanpa wajah, sedang memukul batu / duduk
    const w = o.warna || "#3A2A24", pk = o.ketuk ? Math.abs(Math.sin(t * (o.laju || 5) + x)) : 0, duduk = o.duduk;
    const badan = duduk ? `<path d="M-40 -150 Q0 -170 40 -150 L46 -40 L-46 -40Z" fill="${w}"/><path d="M-50 -40 L60 -40 L70 0 L-60 0Z" fill="${w}"/>` : `<path d="M-40 -230 Q0 -250 40 -230 L50 -110 L-50 -110Z" fill="${w}"/><rect x="-40" y="-112" width="30" height="112" rx="12" fill="${w}"/><rect x="10" y="-112" width="30" height="112" rx="12" fill="${w}"/>`;
    const yk = duduk ? -190 : -270, yl = duduk ? -140 : -220;
    return g(x, y, s, `<ellipse cx="0" cy="4" rx="70" ry="10" fill="#000" opacity=".2"/>${badan}<circle cx="0" cy="${yk}" r="38" fill="${w}"/><path d="M30 ${yl} Q80 ${f0(yl + 20 - pk * 40)} ${f0(96)} ${f0(yl + 70 - pk * 50)}" stroke="${w}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-30 ${yl} Q-60 ${yl + 50} -40 ${yl + 100}" stroke="${w}" stroke-width="22" fill="none" stroke-linecap="round"/>`, 0) ;
  }

  // ---------- danau luas (Malawi) + inti sedimen ----------
  function danauLuas(w, h, P, t = 0, o = {}) {
    const ya = o.air ?? 820, id = uid("dl");
    let s = (A.langit ? A.langit(P, w, ya + 10, t, { suryaX: w * 0.8, suryaY: 300 }) : "") + (A.awan ? A.awan(300, 360, 1, P, 0.9) + A.awan(1100, 260, 0.8, P, 0.8) : "");
    s += `<path d="M0 ${ya} L${w * 0.1} ${ya - 120} L${w * 0.25} ${ya - 70} L${w * 0.4} ${ya - 150} L${w * 0.55} ${ya - 60} L${w * 0.7} ${ya - 130} L${w * 0.9} ${ya - 50} L${w} ${ya - 100} L${w} ${ya}Z" fill="${P.jauh}"/>`;
    s += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC4CF"/><stop offset="1" stop-color="#3F8FA8"/></linearGradient></defs><rect y="${ya}" width="${w}" height="${h}" fill="url(#${id})"/>`;
    for (let i = 0; i < 12; i++) s += `<rect x="${f0(((i * 197 + t * 20) % (w + 200)) - 100)}" y="${ya + 16 + (i % 4) * 26}" width="${60 + (i % 3) * 30}" height="4" rx="2" fill="#E6F6F4" opacity=".6"/>`;
    // pantai pasir + rumput
    s += `<path d="M0 ${ya + 160} Q${w * 0.4} ${ya + 120} ${w} ${ya + 190} V${h} H0Z" fill="#E2CC94"/><path d="M0 ${ya + 230} Q${w * 0.5} ${ya + 200} ${w} ${ya + 250} V${h} H0Z" fill="#D2B97E"/>`;
    for (let i = 0; i < 14; i++) if (A.rumput) s += A.rumput(40 + i * 95, ya + 200 + (i % 3) * 10, 1.2, P, t);
    return s;
  }
  function intiSedimen(x, y, s, o = {}) { // tabung mendatar panjang 1100
    const L = o.panjang || 1100, warna = ["#8A6E52", "#9C8060", "#7A604A", "#A88E6C", "#866A50", "#947A5C", "#7E644C"], pa = o.pitaAbu ?? 0.58, sor = cl(o.sorot || 0);
    let q = `<rect x="0" y="-60" width="${L}" height="120" rx="60" fill="#C9CED3" opacity=".9"/>`;
    let x0 = 30; warna.forEach((c, i) => { const lw = (L - 60) / warna.length; q += `<rect x="${f0(x0)}" y="-46" width="${f0(lw + 1)}" height="92" fill="${c}"/>`; x0 += lw; });
    q += `<rect x="${f0(L * pa)}" y="-46" width="9" height="92" fill="#F2EEE4"/>`;
    if (sor) q += `<rect x="${f0(L * pa - 14)}" y="-60" width="37" height="120" rx="8" fill="#FFF4C8" opacity="${f2(sor * 0.45)}"/>`;
    q += `<rect x="0" y="-60" width="${L}" height="26" rx="13" fill="#FFFFFF" opacity=".28"/><ellipse cx="${L / 2}" cy="80" rx="${L / 2}" ry="16" fill="#000" opacity=".15"/>`;
    return g(x, y, s, q);
  }
  function mejaLapangan(x, y, s, o = {}) { return g(x, y, s, `<rect x="-640" y="0" width="1280" height="34" rx="8" fill="#B88A5A"/><rect x="-640" y="30" width="1280" height="14" fill="#8E6640"/><rect x="-560" y="40" width="30" height="260" fill="#8E6640"/><rect x="530" y="40" width="30" height="260" fill="#8E6640"/>`); }
  function kepingSalju(x, y, s, o = {}) { const a = cl(o.a ?? 1); let q = ""; for (let i = 0; i < 6; i++) q += `<g transform="rotate(${i * 60})"><path d="M0 0 L0 -70 M0 -40 L-18 -58 M0 -40 L18 -58" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/></g>`;
    return g(x, y, s, `<circle r="96" fill="#9FD6F0" opacity="${f2(0.35 * a)}"/><g opacity="${f2(a)}">${q}</g>`, o.rot || 0); }
  function kardus(x, y, s, o = {}) { // kardus ambles: k 0 (utuh) → 1 (penyok rata)
    const k = cl(o.k || 0), hh = lerp(150, 50, k), lk = k * 40;
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="150" ry="14" fill="#000" opacity=".18"/><path d="M-130 0 L130 0 L${130 + lk} ${f0(-hh)} L${f0(60 + lk * 0.5)} ${f0(-hh + 30 * k)} L0 ${f0(-hh + 60 * k)} L${f0(-60 - lk * 0.5)} ${f0(-hh + 30 * k)} L${-130 - lk} ${f0(-hh)}Z" fill="#C9965A"/><path d="M-130 0 L-40 0 L${f0(-60 - lk * 0.5)} ${f0(-hh + 30 * k)} L${-130 - lk} ${f0(-hh)}Z" fill="#B07E48"/><path d="M-20 ${f0(-hh + 50 * k)} L20 ${f0(-hh + 54 * k)}" stroke="#8E6236" stroke-width="10" stroke-linecap="round"/>`); }
  function banRenang(x, y, s, o = {}) { // cincin pelampung belang (tampak depan, dipasang di pinggang)
    const id = uid("br");
    return g(x, y, s, `<defs><clipPath id="${id}"><ellipse cx="0" cy="0" rx="180" ry="62"/></clipPath></defs><ellipse cx="0" cy="0" rx="180" ry="62" fill="#F4EEDC"/><g clip-path="url(#${id})">${[-140, -40, 60, 160].map((xx) => `<rect x="${xx}" y="-70" width="50" height="140" fill="#E2483E" transform="skewX(-14)"/>`).join("")}</g><ellipse cx="0" cy="-22" rx="150" ry="20" fill="#FFFFFF" opacity=".35"/>`); }

  Object.assign(A, { duniaToba, perahuKecil, penampangMagma, petaXY, petaDunia, jejakAbu, titikPeta, guaPesisir, apiKecil, bekasApi, alatBatu, serpihanKaca, manusiaPurba,
    danauLuas, intiSedimen, mejaLapangan, kepingSalju, kardus, banRenang, AIR_TOBA: AIR });
})(typeof window !== "undefined" ? window : globalThis);
