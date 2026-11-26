/* ===== SET CICAK — KAMAR TOSCA, MIKRO RAMBUT, PANGGUNG KUPAS (Yoga, 26 Nov 2026, video B3-11 "cicak nggak jatuh") =====
 * Muat SETELAH tebe-rig.js. Gaya datar tanpa garis hitam; palet TOSCA dominan + aksen FUCHSIA + kuning kata kunci
 * (beda dari B3-10 nyamuk dongker-limau & B3-05 tersentak jingga-kuning). Fungsi murni (fungsi waktu kontinu t) → string SVG.
 * Tanpa tulisan/angka/logo/merek di dalam gambar (simbol "?" & ikon labu lab boleh).
 *  kamar(t,o)                     kamar malam dilihat dari kasur: langit-langit tosca, dinding, jendela malam, lampu tidur fuchsia, ranjang
 *  selimut(t,o)                   selimut fuchsia (o.tepi x tepi kiri, o.cy pusat badan, o.angkat px, o.fase)
 *  cicak(x,y,s,t,o)               cicak rumah kartun (lokal: kepala ke −y). o.rot, o.liuk, o.ekor, o.angkat[4], o.lambai, o.lihat[x,y], o.angguk,
 *                                 o.tokek=1 → tokek Tokay (gemuk, biru-abu, totol jingga, mata kuning), o.lencana 0..1 (lencana lab tanpa huruf)
 *  CICAK.kaki(i,s,rot)            posisi telapak kaki i (0 depan-kiri,1 depan-kanan,2 belakang-kiri,3 belakang-kanan) relatif pusat
 *  tabungLem(x,y,s,rot,a) · mangkokKaret(x,y,s,rot,a) · silang(x,y,s,k) · panahMerah(x0,y0,x1,y1,a) · tanya(x,y,s,a)
 *  kakiBesar(x,y,s,t,o)           telapak cicak dilihat dari bawah: 5 jari berlamela; o.bulu 0..1 karpet rambut halus, o.gulung[5] 0..1
 *  mikroRambut(t,o)               panggung mikroskop: deretan rambut dari kulit; o.sorot 0..1 (satu rambut), o.cabang 0..3 (bertingkat),
 *                                 o.semua 0..1 (semua rambut bercabang), o.kilau 0..1
 *  penampang(t,o)                 penampang mikro: permukaan bergelombang di atas + ujung pipih dari bawah; o.naik, o.rapat, o.molekul, o.tarik
 *  mejaKoin(t,o)                  meja tosca + 1 koin generik + hujan koin + karung (o.koin1, o.hujan, o.karung, o.bruk)
 *  panggungKupas(t,o)             satu rambut + ujung pipih di bawah permukaan; o.tali 0..1, o.geser 0..1, o.miring 0..1, o.copot 0..1
 *  kupasJari(x,y,s,t,o) · kupasStiker(x,y,s,t,o)   layar terbelah: jari cicak menggulung dari ujung / stiker bulat dikelupas (o.k 0..1)
 *  rumah(t,o)                     rumah terbelah 3 ruang: kamar, dapur, ruang lampu (+ngengat), masing-masing 1 cicak
 *  hp(x,y,s,rot,o)                ponsel generik (o.tag 0..1 ikon tandai tanpa huruf)
 */
(function (root) {
  const f1 = (v) => (Math.round(v * 10) / 10).toString(), f3 = (v) => (Math.round(v * 1000) / 1000).toString();
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const halus = (x) => { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const C = {
    TOSCA1: "#5FD3C4", TOSCA2: "#33B3A6", TOSCA3: "#1C9086", TOSCA4: "#0F6A63", TOSCA5: "#0A4A46", MALAM: "#0B3B3F",
    FUCHSIA: "#FF3EA5", FUCHSIA2: "#D61F84", FUCHSIA3: "#A3155F", PINK: "#FF9ED0", KREM: "#FFF4DC", KREM2: "#F1E2C4",
    KUNING: "#FFC93C", MERAH: "#E2232E", CICAK: "#EADFCB", CICAK2: "#D3C2A6", TOTOL: "#9E8B6E", PAD: "#F8EEDF", LAMELA: "#BFA98A",
    TOKEK: "#7E97B8", TOKEK2: "#62799B", JINGGA: "#FF8A3D", KAYU: "#7C5A3F", KAYU2: "#5F432E", KULIT: "#F1D6B8", KULIT2: "#E2BC98",
  };
  // ---------- bantu: pita (garis tengah → poligon dengan lebar berubah) ----------
  function pita(P, lebar) {
    const L = [], R = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n;
      const w = lebar(i / (P.length - 1)) / 2;
      L.push([P[i][0] - dy * w, P[i][1] + dx * w]); R.push([P[i][0] + dy * w, P[i][1] - dx * w]);
    }
    const pts = L.concat(R.reverse());
    return "M" + pts.map((p) => f1(p[0]) + " " + f1(p[1])).join(" L") + "Z";
  }
  const bez = (p0, p1, p2, n = 18) => { const o = []; for (let i = 0; i <= n; i++) { const q = i / n; o.push([(1 - q) * (1 - q) * p0[0] + 2 * q * (1 - q) * p1[0] + q * q * p2[0], (1 - q) * (1 - q) * p0[1] + 2 * q * (1 - q) * p1[1] + q * q * p2[1]]); } return o; };
  const rotP = (p, deg) => { const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };

  // ---------- kamar malam (koordinat layar 1080x1920 + margin) ----------
  const KAMAR = { plafon: 1010, kasur: 1400, bantal: [190, 1372] };
  function kamar(t = 0, o = {}) {
    let s = `<defs><radialGradient id="ckLampu" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.FUCHSIA}" stop-opacity=".55"/><stop offset="1" stop-color="${C.FUCHSIA}" stop-opacity="0"/></radialGradient>
<radialGradient id="ckPlafon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.TOSCA1}" stop-opacity=".55"/><stop offset="1" stop-color="${C.TOSCA1}" stop-opacity="0"/></radialGradient></defs>`;
    // langit-langit (bidang miring perspektif) + sambungan dinding
    s += `<rect x="-1000" y="-800" width="3600" height="${KAMAR.plafon + 800}" fill="${C.TOSCA2}"/>`;
    s += `<ellipse cx="640" cy="640" rx="760" ry="560" fill="url(#ckPlafon)"/>`;
    for (let i = 0; i < 7; i++) s += `<path d="M${-400 + i * 330} -800 L${f1(120 + i * 160)} ${KAMAR.plafon}" stroke="${C.TOSCA3}" stroke-width="3" opacity=".18"/>`;
    s += `<rect x="-1000" y="${KAMAR.plafon - 26}" width="3600" height="26" fill="${C.TOSCA3}"/><rect x="-1000" y="${KAMAR.plafon}" width="3600" height="12" fill="${C.TOSCA5}" opacity=".5"/>`;
    // lampu plafon (mati) kecil kanan atas
    s += `<ellipse cx="900" cy="250" rx="70" ry="22" fill="${C.TOSCA3}"/><ellipse cx="900" cy="244" rx="52" ry="14" fill="${C.KREM2}" opacity=".55"/>`;
    // dinding
    s += `<rect x="-1000" y="${KAMAR.plafon + 12}" width="3600" height="1800" fill="${C.TOSCA4}"/>`;
    // jendela malam kanan
    s += `<rect x="620" y="1080" width="330" height="250" rx="18" fill="${C.TOSCA5}"/><rect x="636" y="1096" width="298" height="218" rx="10" fill="${C.MALAM}"/>`;
    s += `<path d="M880 1150 a30 30 0 1 0 22 52 a24 24 0 1 1 -22 -52Z" fill="${C.KREM}"/>`;
    [[690, 1130], [760, 1200], [820, 1140], [700, 1260], [900, 1270]].forEach(([x, y], i) => { const k = 0.5 + 0.5 * Math.sin(t * 2 + i * 1.7); s += `<circle cx="${x}" cy="${y}" r="${f1(3 + k * 2)}" fill="${C.KREM}" opacity="${f3(0.4 + 0.5 * k)}"/>`; });
    s += `<rect x="779" y="1096" width="12" height="218" fill="${C.TOSCA5}"/>`;
    s += `<path d="M600 1060 Q650 1200 610 1350 L560 1350 L560 1060Z" fill="${C.FUCHSIA2}"/><path d="M970 1060 Q920 1200 960 1350 L1010 1350 L1010 1060Z" fill="${C.FUCHSIA2}"/>`;
    // lampu tidur fuchsia di meja kiri
    const ny = o.lampu ?? 1;
    s += `<circle cx="80" cy="1230" r="300" fill="url(#ckLampu)" opacity="${f3(ny)}"/>`;
    s += `<rect x="-60" y="1300" width="230" height="40" rx="8" fill="${C.KAYU}"/><rect x="-50" y="1336" width="210" height="300" fill="${C.KAYU2}"/>`;
    s += `<rect x="68" y="1222" width="14" height="80" fill="${C.KREM2}"/><path d="M30 1230 L120 1230 L100 1160 L50 1160Z" fill="${C.FUCHSIA}"/><ellipse cx="75" cy="1300" rx="36" ry="8" fill="${C.KREM2}"/>`;
    // ranjang
    s += `<rect x="-200" y="1170" width="70" height="480" rx="24" fill="${C.KAYU}"/>`;
    s += `<rect x="-160" y="${KAMAR.kasur}" width="1500" height="900" fill="${C.KREM2}"/><rect x="-160" y="${KAMAR.kasur + 140}" width="1500" height="900" fill="${C.TOSCA5}"/>`;
    // bantal
    const [bx, by] = KAMAR.bantal;
    s += `<path d="M${bx - 150} ${by - 70} Q${bx} ${by - 110} ${bx + 150} ${by - 70} Q${bx + 175} ${by} ${bx + 150} ${by + 70} Q${bx} ${by + 110} ${bx - 150} ${by + 70} Q${bx - 175} ${by} ${bx - 150} ${by - 70}Z" fill="${C.KREM}"/>`;
    s += `<path d="M${bx - 120} ${by + 50} Q${bx} ${by + 80} ${bx + 120} ${by + 50}" stroke="${C.PINK}" stroke-width="8" fill="none" opacity=".6"/>`;
    return s;
  }
  function selimut(t, o = {}) {
    const x = o.tepi ?? 360, cy = o.cy ?? 1365, a = o.angkat || 0, f = o.fase || 0, g = Math.sin(f) * 6;
    const top = cy - 165 - a;
    let s = `<path d="M${f1(x)} ${f1(top + 30)} Q${f1(x + 10)} ${f1(top - 8 + g)} ${f1(x + 90)} ${f1(top - 4)} Q${f1(x + 330)} ${f1(top - 30 - g)} ${f1(x + 560)} ${f1(top + 20)} Q${f1(x + 800)} ${f1(top + 50)} 1400 ${f1(top + 40)} L1400 2400 L${f1(x - 30)} 2400 Q${f1(x - 60)} ${f1(cy + 60)} ${f1(x - 30)} ${f1(cy + 170)} Q${f1(x - 40)} ${f1(top + 120)} ${f1(x)} ${f1(top + 30)}Z" fill="${C.FUCHSIA2}"/>`;
    // lipatan atas krem + bayangan lekuk badan
    s += `<path d="M${f1(x - 8)} ${f1(top + 40)} Q${f1(x - 30)} ${f1(cy)} ${f1(x - 20)} ${f1(cy + 170)} L${f1(x + 40)} ${f1(cy + 170)} Q${f1(x + 30)} ${f1(cy)} ${f1(x + 46)} ${f1(top + 30)}Z" fill="${C.PINK}"/>`;
    s += `<path d="M${f1(x + 120)} ${f1(cy + 40)} Q${f1(x + 400)} ${f1(cy + 10 + g)} ${f1(x + 700)} ${f1(cy + 60)}" stroke="${C.FUCHSIA3}" stroke-width="14" fill="none" stroke-linecap="round" opacity=".6"/>`;
    s += `<path d="M${f1(x + 200)} ${f1(cy + 150)} Q${f1(x + 450)} ${f1(cy + 120 - g)} ${f1(x + 760)} ${f1(cy + 170)}" stroke="${C.FUCHSIA}" stroke-width="12" fill="none" stroke-linecap="round" opacity=".45"/>`;
    return s;
  }

  // ---------- cicak / tokek ----------
  const KAKI0 = [[-118, -118, -150], [118, -118, -30], [-112, 150, 160], [112, 150, 20]]; // [x, y, arah jari (derajat)]
  function cicak(x, y, s, t, o = {}) {
    const tk = o.tokek ? 1 : 0, g = tk ? 1.32 : 1;
    const warna = tk ? C.TOKEK : C.CICAK, warna2 = tk ? C.TOKEK2 : C.CICAK2, totol = tk ? C.JINGGA : C.TOTOL;
    const li = o.liuk ?? Math.sin(t * 1.4) * 0.5, ek = o.ekor ?? Math.sin(t * 1.1);
    const ang = o.angguk || 0;
    let out = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f3(s)})">`;
    // ekor (pita meruncing, melengkung)
    const ekorP = bez([0, 100], [60 * ek + 20 * li, 230], [-90 * ek, 330], 22);
    out += `<path d="${pita(ekorP, (u) => lerp(46 * g, 6, Math.pow(u, 0.8)))}" fill="${warna}"/>`;
    // kaki (paha + telapak + 5 jari dengan bantalan)
    let kaki = "";
    KAKI0.forEach(([kx, ky, arah], i) => {
      const angkat = o.angkat ? o.angkat[i] || 0 : 0, lmb = i === (o.lambaiKaki ?? 1) ? o.lambai || 0 : 0;
      const bahu = [Math.sign(kx) * 34 * g, ky < 0 ? -86 : 92];
      const langkah = o.langkah ? Math.sin(t * 6 + i * Math.PI) * 8 * o.langkah : 0;
      let fx = kx * (tk ? 1.12 : 1) + Math.sign(kx) * (angkat * 30 + lmb * 40), fy = ky + langkah - angkat * (ky < 0 ? 30 : -20) - lmb * (ky < 0 ? 40 : 0);
      const siku = [lerp(bahu[0], fx, 0.55) + Math.sign(kx) * 6, lerp(bahu[1], fy, 0.5) + (ky < 0 ? 22 : -22)];
      kaki += `<path d="M${f1(bahu[0])} ${f1(bahu[1])} Q${f1(siku[0])} ${f1(siku[1])} ${f1(fx)} ${f1(fy)}" stroke="${warna2}" stroke-width="${f1(24 * g)}" stroke-linecap="round" fill="none"/>`;
      kaki += `<path d="M${f1(bahu[0])} ${f1(bahu[1])} Q${f1(siku[0])} ${f1(siku[1])} ${f1(fx)} ${f1(fy)}" stroke="${warna}" stroke-width="${f1(17 * g)}" stroke-linecap="round" fill="none"/>`;
      const goy = lmb ? Math.sin(t * 14) * 22 * lmb : 0, gul = Math.max(angkat, lmb * 0.6);
      for (let j = 0; j < 5; j++) {
        const a = ((arah + (j - 2) * 30 + goy) * Math.PI) / 180, L = (34 + (j === 2 ? 6 : 0)) * g * (1 - 0.45 * gul);
        const ex = fx + Math.cos(a) * L, ey = fy + Math.sin(a) * L;
        kaki += `<path d="M${f1(fx)} ${f1(fy)} L${f1(ex)} ${f1(ey)}" stroke="${warna}" stroke-width="${f1(8 * g)}" stroke-linecap="round"/>`;
        const dg = (a * 180) / Math.PI;
        kaki += `<g transform="translate(${f1(ex)} ${f1(ey)}) rotate(${f1(dg)})"><ellipse cx="2" cy="0" rx="${f1(12 * g * (1 - 0.3 * gul))}" ry="${f1(9 * g)}" fill="${tk ? C.TOKEK2 : C.PAD}"/>
<path d="M-4 -6 L-4 6 M2 -7 L2 7 M8 -6 L8 6" stroke="${tk ? C.TOKEK : C.LAMELA}" stroke-width="1.8" stroke-linecap="round"/></g>`;
      }
      kaki += `<circle cx="${f1(fx)} " cy="${f1(fy)}" r="${f1(10 * g)}" fill="${warna}"/>`;
    });
    out += kaki;
    // badan (garis tengah meliuk)
    const badanP = bez([0, -150], [26 * li, -20], [0, 112], 20);
    out += `<path d="${pita(badanP, (u) => g * (u < 0.15 ? lerp(52, 74, u / 0.15) : u < 0.6 ? lerp(74, 92, (u - 0.15) / 0.45) : lerp(92, 50, (u - 0.6) / 0.4)))}" fill="${warna}"/>`;
    out += `<path d="${pita(bez([0, -120], [26 * li * 0.9, -20], [0, 90], 16), (u) => g * lerp(18, 26, Math.sin(Math.PI * u)))}" fill="${warna2}" opacity=".45"/>`;
    // totol
    const TT = tk ? [[-26, -80, 11], [24, -50, 12], [-20, 0, 13], [28, 30, 11], [-12, 60, 10], [14, -110, 9], [0, -30, 8]] : [[-20, -70, 4], [16, -40, 4], [-12, 0, 4], [22, 20, 3.5], [-6, 55, 3.5], [10, -100, 3], [-24, 30, 3]];
    TT.forEach(([a, b, r]) => { out += `<circle cx="${f1(a * g + li * 12 * (b + 150) / 260)}" cy="${f1(b * g)}" r="${f1(r * g)}" fill="${totol}" opacity="${tk ? 0.95 : 0.7}"/>`; });
    // kepala
    out += `<g transform="translate(0 ${f1(-160 * g)}) rotate(${f1(ang * 10)}) translate(0 ${f1(ang * -6)})">`;
    out += `<ellipse cx="0" cy="-4" rx="${f1(56 * g)}" ry="${f1(66 * g)}" fill="${warna}"/>`;
    out += `<path d="M${f1(-40 * g)} ${f1(-40 * g)} Q0 ${f1(-82 * g)} ${f1(40 * g)} ${f1(-40 * g)}" stroke="${warna2}" stroke-width="${f1(6 * g)}" fill="none" stroke-linecap="round" opacity=".6"/>`;
    const lx = o.lihat ? o.lihat[0] : 0, ly = o.lihat ? o.lihat[1] : 0, kd = o.kedip ?? (Math.sin(t * 0.9 + 1.3) > 0.985 ? 0.1 : 1);
    [-1, 1].forEach((sd) => {
      const ex = sd * 40 * g, ey = -2;
      out += `<circle cx="${f1(ex)}" cy="${ey}" r="${f1(27 * g)}" fill="${warna2}"/><ellipse cx="${f1(ex)}" cy="${ey}" rx="${f1(22 * g)}" ry="${f1(22 * g * kd)}" fill="${tk ? "#E4E55A" : "#2C2A28"}"/>`;
      if (kd > 0.3) {
        if (tk) out += `<ellipse cx="${f1(ex + lx * 4)}" cy="${f1(ey + ly * 4)}" rx="${f1(4.5 * g)}" ry="${f1(16 * g)}" fill="#1E1E1E"/>`;
        out += `<circle cx="${f1(ex + lx * 5 - 7)}" cy="${f1(ey + ly * 5 - 8)}" r="${f1(7 * g)}" fill="#FFFFFF"/><circle cx="${f1(ex + lx * 5 + 6)}" cy="${f1(ey + ly * 5 + 6)}" r="${f1(3 * g)}" fill="#FFFFFF" opacity=".8"/>`;
      }
    });
    // mulut mengikuti moncong (terbaca senyum saat kepala menghadap ke bawah)
    const sm = o.senyum ?? 1;
    out += `<path d="M${f1(-24 * g)} ${f1(-46 * g)} Q0 ${f1((-46 - 16 * sm) * g)} ${f1(24 * g)} ${f1(-46 * g)}" stroke="${tk ? "#3B4A63" : "#8A7558"}" stroke-width="${f1(5 * g)}" fill="none" stroke-linecap="round"/>`;
    out += `<circle cx="${f1(-12 * g)}" cy="${f1(-64 * g)}" r="2.5" fill="#8A7558" opacity=".6"/><circle cx="${f1(12 * g)}" cy="${f1(-64 * g)}" r="2.5" fill="#8A7558" opacity=".6"/>`;
    out += `</g>`;
    // lencana lab (tanpa huruf: ikon labu)
    if (o.lencana > 0) {
      const k = o.lencana;
      out += `<g opacity="${f3(cl(k * 2))}" transform="translate(0 ${f1(-70 * g)}) scale(${f3(0.6 + 0.4 * k)})"><path d="M-40 -40 L0 0 L40 -40" stroke="${C.FUCHSIA}" stroke-width="6" fill="none"/>
<rect x="-34" y="0" width="68" height="74" rx="10" fill="#FFFFFF"/><rect x="-34" y="0" width="68" height="16" rx="6" fill="${C.FUCHSIA}"/>
<path d="M-8 26 L-8 40 L-20 62 L20 62 L8 40 L8 26Z" fill="${C.TOSCA2}"/><rect x="-11" y="22" width="22" height="6" rx="3" fill="${C.TOSCA4}"/></g>`;
    }
    return out + `</g>`;
  }
  // posisi pusat telapak kaki i (dunia) untuk cicak di (x,y,s,rot)
  function posKaki(i, x, y, s, rot, tk) { const [kx, ky] = KAKI0[i]; const p = rotP([kx * (tk ? 1.12 : 1) * s, ky * s], rot); return [x + p[0], y + p[1]]; }

  // ---------- benda kecil ----------
  function tabungLem(x, y, s, rot = 0, a = 1) {
    if (a <= 0.001) return "";
    return `<g opacity="${f3(a)}" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)})">
<path d="M-60 -34 L50 -40 Q64 0 50 40 L-60 34 Q-70 0 -60 -34Z" fill="#FFFFFF"/><path d="M-50 -20 L40 -24 L40 24 L-50 20Z" fill="${C.TOSCA2}" opacity=".5"/>
<rect x="-78" y="-30" width="22" height="60" rx="5" fill="#C9D3DA"/><path d="M50 -16 L92 -8 L104 0 L92 8 L50 16Z" fill="#E5ECEF"/><path d="M104 0 L120 0" stroke="#E5ECEF" stroke-width="8" stroke-linecap="round"/>
<ellipse cx="128" cy="4" rx="9" ry="12" fill="#F7F1E6"/></g>`;
  }
  function mangkokKaret(x, y, s, rot = 0, a = 1) {
    if (a <= 0.001) return "";
    return `<g opacity="${f3(a)}" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)})">
<path d="M-62 0 Q-58 -46 0 -50 Q58 -46 62 0 Q0 16 -62 0Z" fill="${C.MERAH}"/><path d="M-40 -14 Q0 -34 40 -14" stroke="#FF7A80" stroke-width="7" fill="none" stroke-linecap="round"/>
<rect x="-12" y="-96" width="24" height="50" rx="10" fill="#B81A24"/></g>`;
  }
  function silang(x, y, s, k) {
    if (k <= 0.001) return "";
    const a = cl(k * 2), b = cl(k * 2 - 1);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s * (1 + 0.25 * (1 - k)))})"><path d="M-60 -60 L${f1(-60 + 120 * a)} ${f1(-60 + 120 * a)}" stroke="${C.FUCHSIA}" stroke-width="26" stroke-linecap="round"/>
${b > 0 ? `<path d="M60 -60 L${f1(60 - 120 * b)} ${f1(-60 + 120 * b)}" stroke="${C.FUCHSIA}" stroke-width="26" stroke-linecap="round"/>` : ""}</g>`;
  }
  function panahMerah(x0, y0, x1, y1, a) {
    if (a <= 0.001) return "";
    const mx = (x0 + x1) / 2 + (y1 - y0) * 0.25, my = (y0 + y1) / 2 - (x1 - x0) * 0.25;
    const ang = Math.atan2(y1 - my, x1 - mx), h = 54;
    const p1 = [x1 - Math.cos(ang) * h + Math.sin(ang) * h * 0.62, y1 - Math.sin(ang) * h - Math.cos(ang) * h * 0.62];
    const p2 = [x1 - Math.cos(ang) * h - Math.sin(ang) * h * 0.62, y1 - Math.sin(ang) * h + Math.cos(ang) * h * 0.62];
    const ex = x1 - Math.cos(ang) * 30, ey = y1 - Math.sin(ang) * 30;
    return `<g opacity="${f3(a)}"><path d="M${x0} ${y0} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}" stroke="#FFFFFF" stroke-width="40" fill="none" stroke-linecap="round" opacity=".9"/>
<path d="M${x0} ${y0} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}" stroke="${C.MERAH}" stroke-width="26" fill="none" stroke-linecap="round"/>
<path d="M${f1(x1)} ${f1(y1)} L${f1(p1[0])} ${f1(p1[1])} L${f1(p2[0])} ${f1(p2[1])}Z" fill="${C.MERAH}" stroke="#FFFFFF" stroke-width="7" stroke-linejoin="round" paint-order="stroke"/></g>`;
  }
  function tanya(x, y, s, a) {
    if (a <= 0.001) return "";
    return `<g opacity="${f3(a)}" transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})"><circle r="44" fill="#FFFFFF"/><path d="M-14 -12 C-14 -34 16 -34 16 -12 C16 2 2 2 2 16" stroke="${C.FUCHSIA}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="2" cy="28" r="6" fill="${C.FUCHSIA}"/></g>`;
  }

  // ---------- telapak besar (dari bawah) ----------
  const JARI = [-74, -37, 0, 37, 74];
  function kakiBesar(x, y, s, t, o = {}) {
    const bulu = o.bulu || 0;
    let out = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">`;
    // lengan masuk miring dari kiri bawah
    out += `<path d="M-330 640 Q-200 330 -40 150 L40 190 Q-120 380 -210 640Z" fill="${C.CICAK2}"/><path d="M-300 640 Q-180 340 -30 168 L22 194 Q-130 390 -236 640Z" fill="${C.CICAK}"/>`;
    for (let i = 0; i < 9; i++) out += `<circle cx="${f1(-250 + i * 26 + (i % 2) * 8)}" cy="${f1(560 - i * 46)}" r="5" fill="${C.TOTOL}" opacity=".45"/>`;
    out += `<ellipse cx="0" cy="130" rx="92" ry="78" fill="${C.CICAK}"/>`;
    JARI.forEach((deg, j) => {
      const g = o.gulung ? o.gulung[j] || 0 : 0, panjang = (j === 0 || j === 4 ? 300 : 340) * (1 - 0.5 * g);
      out += `<g transform="translate(0 110) rotate(${deg})">`;
      // batang jari ramping → melebar jadi bantalan
      out += `<path d="M-20 0 L-22 ${f1(-panjang * 0.35)} Q-54 ${f1(-panjang * 0.55)} -50 ${f1(-panjang * 0.86)} Q0 ${f1(-panjang - 34)} 50 ${f1(-panjang * 0.86)} Q54 ${f1(-panjang * 0.55)} 22 ${f1(-panjang * 0.35)} L20 0Z" fill="${C.CICAK}"/>`;
      // lamela (garis melintang berbentuk chevron) pada bantalan
      const n = 8;
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1), yy = -panjang * (0.4 + 0.5 * u), lebar = 40 * Math.sin(Math.PI * (0.15 + 0.75 * u)) + 6, angkat = g > 0 ? cl((u - (1 - g)) * 3) : 0;
        out += `<path d="M${f1(-lebar)} ${f1(yy + 6)} Q0 ${f1(yy - 16)} ${f1(lebar)} ${f1(yy + 6)} Q0 ${f1(yy - 4)} ${f1(-lebar)} ${f1(yy + 6)}Z" fill="${angkat > 0.3 ? C.CICAK2 : C.PAD}" opacity="${f3(1 - 0.4 * angkat)}"/>`;
        out += `<path d="M${f1(-lebar + 4)} ${f1(yy + 4)} Q0 ${f1(yy - 14)} ${f1(lebar - 4)} ${f1(yy + 4)}" stroke="${C.LAMELA}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        if (bulu > 0.01) { // karpet rambut halus seperti sikat
          let d = "";
          for (let q = -5; q <= 5; q++) { const bx = q * lebar * 0.17, by = yy - 6 - (1 - Math.abs(q) / 6) * 8, h = 18 * bulu, w = Math.sin(t * 3 + q + i) * 2; d += `M${f1(bx)} ${f1(by)} q${f1(w)} ${f1(-h * 0.5)} ${f1(w * 1.4)} ${f1(-h)} `; }
          out += `<path d="${d}" stroke="#FFFFFF" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="${f3(0.9 * bulu)}"/>`;
        }
      }
      // cakar kecil di ujung
      out += `<path d="M0 ${f1(-panjang - 22)} l0 -20" stroke="${C.TOTOL}" stroke-width="6" stroke-linecap="round"/>`;
      if (g > 0.02) out += `<ellipse cx="0" cy="${f1(-panjang * 0.9)}" rx="44" ry="${f1(18 + 26 * g)}" fill="${C.CICAK2}" opacity="${f3(0.85 * g)}"/>`;
      out += `</g>`;
    });
    if (bulu > 0.01) out += `<ellipse cx="0" cy="-120" rx="360" ry="290" fill="${C.PINK}" opacity="${f3(0.08 * bulu * (0.7 + 0.3 * Math.sin(t * 4)))}"/>`;
    return out + `</g>`;
  }

  // ---------- mikroskop: deretan rambut bercabang ----------
  const RAMBUT = []; for (let i = 0; i < 26; i++) RAMBUT.push({ x: -380 + i * 72 + ((i * 37) % 23) - 11, tinggi: 560 + ((i * 53) % 90), miring: ((i * 29) % 30) - 15 });
  function pohon(x, y, ang, L, depth, k, lebar, warna, tips) {
    // gambar satu cabang (sebagian bila k<1) lalu anak-anaknya
    const kk = cl(k), ex = x + Math.cos(ang) * L * kk, ey = y + Math.sin(ang) * L * kk;
    let s = `<path d="M${f1(x)} ${f1(y)} L${f1(ex)} ${f1(ey)}" stroke="${warna}" stroke-width="${f1(lebar)}" stroke-linecap="round"/>`;
    if (depth > 0 && k > 1) {
      const n = 3, sebar = 0.5;
      for (let c = 0; c < n; c++) s += pohon(ex, ey, ang + (c - 1) * sebar, L * 0.55, depth - 1, k - 1, lebar * 0.6, warna, tips);
    } else if (depth === 0 && kk > 0.98) tips.push([ex, ey, ang]);
    return s;
  }
  function rambutSatu(r, t, cabang, warna, lebar, kilau, o) {
    const goy = Math.sin(t * 1.3 + r.x * 0.01) * 6, base = [r.x, o.kulit], top = [r.x + r.miring + goy, o.kulit - r.tinggi];
    const ctrl = [r.x + r.miring * 2 + 30, o.kulit - r.tinggi * 0.55];
    let s = `<path d="M${f1(base[0])} ${f1(base[1])} Q${f1(ctrl[0])} ${f1(ctrl[1])} ${f1(top[0])} ${f1(top[1])}" stroke="${warna}" stroke-width="${f1(lebar)}" fill="none" stroke-linecap="round"/>`;
    if (cabang > 0) {
      const tips = [];
      const ang = Math.atan2(top[1] - ctrl[1], top[0] - ctrl[0]);
      s += pohon(top[0], top[1], ang - 0.5, 70, 2, cabang, lebar * 0.7, warna, tips) + pohon(top[0], top[1], ang, 78, 2, cabang, lebar * 0.7, warna, tips) + pohon(top[0], top[1], ang + 0.5, 70, 2, cabang, lebar * 0.7, warna, tips);
      tips.forEach(([x, y, a], i) => {
        s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1((a * 180) / Math.PI + 90)})"><ellipse rx="${f1(lebar * 1.3)}" ry="${f1(lebar * 0.42)}" fill="${C.KREM}"/></g>`;
        if (kilau > 0.01) { const tw = 0.5 + 0.5 * Math.sin(t * 7 + i * 2.1 + r.x); if (tw > 0.55) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(lebar * 1.6 * tw)}" fill="${i % 2 ? C.FUCHSIA : C.TOSCA1}" opacity="${f3(kilau * (tw - 0.5) * 1.6)}"/>`; }
      });
    }
    return s;
  }
  function mikroRambut(t, o = {}) {
    const kulit = o.kulit ?? 1180, sorot = o.sorot || 0, cabang = o.cabang || 0, semua = o.semua || 0, kilau = o.kilau || 0;
    let s = `<defs><radialGradient id="ckLensa" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="${C.TOSCA3}"/><stop offset="1" stop-color="${C.MALAM}"/></radialGradient></defs>`;
    s += `<rect x="-1000" y="-800" width="3600" height="3400" fill="url(#ckLensa)"/>`;
    // partikel mengambang (kesan mikroskop)
    for (let i = 0; i < 18; i++) { const px = ((i * 211) % 1500) - 200, py = ((i * 137 + t * 30) % 1400) + 100; s += `<circle cx="${f1(px)}" cy="${f1(1500 - py)}" r="${3 + (i % 3) * 2}" fill="${C.TOSCA1}" opacity=".18"/>`; }
    const tengah = 13;
    RAMBUT.forEach((r, i) => {
      const fokus = i === tengah;
      const redup = fokus ? 0 : sorot * (1 - semua);
      const cb = fokus ? cabang : semua * 3 * cl(semua * 1.3 - Math.abs(i - tengah) * 0.02);
      s += `<g opacity="${f3(1 - 0.65 * redup)}">${rambutSatu(r, t, cb, fokus && sorot > 0 ? C.KREM : C.CICAK, fokus ? 13 : 11, kilau, { kulit })}</g>`;
    });
    if (sorot > 0.01) { const r = RAMBUT[tengah]; s += `<ellipse cx="${f1(r.x + r.miring)}" cy="${f1(kulit - r.tinggi - 40)}" rx="260" ry="240" fill="${C.KREM}" opacity="${f3(0.08 * sorot * (1 - semua))}"/>`; }
    // kulit telapak
    s += `<path d="M-1000 ${kulit} Q540 ${kulit - 40} 2600 ${kulit} L2600 2600 L-1000 2600Z" fill="${C.CICAK2}"/><path d="M-1000 ${kulit + 26} Q540 ${kulit - 14} 2600 ${kulit + 26} L2600 2600 L-1000 2600Z" fill="${C.CICAK}"/>`;
    return s;
  }
  mikroRambut.RAMBUT = RAMBUT; mikroRambut.TENGAH = 13;

  // ---------- penampang: ujung pipih menempel di permukaan bergelombang ----------
  const permukaan = (x) => 640 + 22 * Math.sin(x / 57) + 12 * Math.sin(x / 23 + 1);
  function penampang(t, o = {}) {
    const naik = o.naik ?? 1, rapat = o.rapat || 0, mol = o.molekul || 0, tarik = o.tarik || 0;
    let s = `<rect x="-1000" y="-800" width="3600" height="3400" fill="${C.TOSCA4}"/>`;
    // permukaan langit-langit (atas) bergelombang
    let d = "M-1000 -800 L-1000 " + f1(permukaan(-1000));
    for (let x = -1000; x <= 2600; x += 12) d += " L" + x + " " + f1(permukaan(x));
    d += " L2600 -800Z";
    s += `<path d="${d}" fill="${C.KREM2}"/>`;
    let d2 = "";
    for (let x = -1000; x <= 2600; x += 12) d2 += (x === -1000 ? "M" : " L") + x + " " + f1(permukaan(x) - 14);
    s += `<path d="${d2}" stroke="#E2CFA8" stroke-width="10" fill="none"/>`;
    // ujung-ujung pipih (dari bawah)
    const UJ = [-260, -60, 140, 340, 540, 740, 940, 1140, 1340];
    UJ.forEach((ux, i) => {
      const lebar = 150, celahDatar = 70 * (1 - naik) + 34, goy = Math.sin(t * 2 + i) * 3 * (1 - rapat);
      // garis bawah pad: datar (kaku) → mengikuti permukaan (rapat)
      let atas = [], bawah = [];
      for (let q = 0; q <= 16; q++) {
        const x = ux - lebar / 2 + (lebar * q) / 16;
        const datar = Math.max(...[0, 4, 8, 12, 16].map((r) => permukaan(ux - lebar / 2 + (lebar * r) / 16))) + celahDatar + goy;
        const ikut = permukaan(x) + 5 - tarik * 2;
        const y = lerp(datar, ikut, rapat);
        atas.push([x, y]); bawah.push([x, y + 22]);
      }
      const stalk = [ux, atas[8][1] + 20];
      s += `<path d="M${f1(stalk[0] - 8)} ${f1(stalk[1])} Q${f1(ux - 40)} ${f1(stalk[1] + 300)} ${f1(ux - 140)} 1700 L${f1(ux - 110)} 1700 Q${f1(ux - 16)} ${f1(stalk[1] + 300)} ${f1(stalk[0] + 8)} ${f1(stalk[1])}Z" fill="${C.CICAK2}"/>`;
      s += `<path d="M${atas.map((p) => f1(p[0]) + " " + f1(p[1])).join(" L")} L${bawah.reverse().map((p) => f1(p[0]) + " " + f1(p[1])).join(" L")}Z" fill="${C.CICAK}"/>`;
      if (mol > 0.01) {
        for (let q = 1; q < 16; q += 2) {
          const x = atas[q][0], yp = atas[q][1] + 4, ys = permukaan(x) - 6;
          s += `<circle cx="${f1(x)}" cy="${f1(yp)}" r="7" fill="${C.TOSCA2}" opacity="${f3(mol)}"/><circle cx="${f1(x)}" cy="${f1(ys)}" r="7" fill="${C.TOSCA3}" opacity="${f3(mol)}"/>`;
          if (tarik > 0.01) {
            const pul = 0.6 + 0.4 * Math.sin(t * 9 + q + i * 2), n = 4, h = yp - ys;
            let z = `M${f1(x)} ${f1(yp - 6)}`; for (let r = 1; r <= n; r++) z += ` L${f1(x + (r % 2 ? 5 : -5) * pul)} ${f1(yp - 6 - ((h - 12) * r) / n)}`;
            s += `<path d="${z}" stroke="${C.FUCHSIA}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${f3(tarik * (0.7 + 0.3 * pul))}"/>`;
            s += `<circle cx="${f1(x)}" cy="${f1((yp + ys) / 2)}" r="${f1(14 * pul)}" fill="${C.FUCHSIA}" opacity="${f3(0.28 * tarik)}"/>`;
          }
        }
      }
    });
    return s;
  }
  penampang.permukaan = permukaan;

  // ---------- meja + koin + karung ----------
  function koin(x, y, s, rot = 0, a = 1) {
    return `<g opacity="${f3(a)}" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)})"><ellipse rx="34" ry="34" fill="#C99A2E"/><ellipse rx="30" ry="30" fill="${C.KUNING}"/><circle r="18" fill="none" stroke="#E0A92A" stroke-width="4"/><path d="M-12 -20 Q-20 -8 -16 6" stroke="#FFF1B8" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  }
  function mejaKoin(t, o = {}) {
    const meja = 1140, sag = o.bruk || 0;
    let s = `<rect x="-1000" y="-800" width="3600" height="3400" fill="${C.TOSCA2}"/>`;
    s += `<circle cx="540" cy="620" r="520" fill="${C.TOSCA1}" opacity=".35"/>`;
    // meja (melengkung saat karung jatuh)
    const m = (x) => meja + sag * 46 * Math.exp(-Math.pow((x - 540) / 360, 2));
    let top = ""; for (let x = -200; x <= 1280; x += 20) top += (x === -200 ? "M" : " L") + x + " " + f1(m(x));
    s += `<path d="${top} L1280 ${meja + 60} L-200 ${meja + 60}Z" fill="${C.TOSCA4}"/><path d="${top} L1280 2600 L-200 2600Z" fill="${C.TOSCA3}" transform="translate(0 40)"/>`;
    s += `<path d="${top}" stroke="${C.TOSCA5}" stroke-width="10" fill="none" transform="translate(0 40)"/>`;
    s += `<rect x="40" y="${meja + 90}" width="40" height="900" fill="${C.TOSCA4}"/><rect x="1000" y="${meja + 90}" width="40" height="900" fill="${C.TOSCA4}"/>`;
    // koin tunggal
    const k1 = o.koin1 || 0;
    if (k1 > 0.01) {
      const gy = Math.sin(t * 3) * 4;
      s += `<ellipse cx="540" cy="${meja + 8}" rx="40" ry="8" fill="${C.TOSCA5}" opacity=".35"/>` + koin(540, meja - 30 + gy, 0.95, Math.sin(t * 2) * 6, k1);
      s += `<g opacity="${f3(k1 * (0.4 + 0.4 * Math.sin(t * 5)))}"><path d="M592 ${meja - 86} l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6Z" fill="${C.KREM}" transform="scale(.8) translate(150 ${meja * 0.25})"/></g>`;
    }
    // hujan koin → tumpukan, lalu karung jatuh menimpa
    const kr = o.karung || 0, hj = o.hujan || 0;
    let karungS = "";
    if (kr > 0.01) { let s = "";
      const sq = o.pentul || 0, w = 300 * (0.5 + 0.5 * kr) * (1 + 0.12 * sq), h = 380 * (0.5 + 0.5 * kr) * (1 - 0.1 * sq), by = m(540) - 6 + (o.karungY || 0);
      s += `<ellipse cx="540" cy="${f1(m(540) + 10)}" rx="${f1(w * 0.9)}" ry="22" fill="${C.TOSCA5}" opacity=".35"/>`;
      s += `<g opacity="${f3(cl(kr * 3))}"><path d="M${f1(540 - w * 0.75)} ${f1(by)} Q${f1(540 - w)} ${f1(by - h * 0.55)} ${f1(540 - w * 0.4)} ${f1(by - h * 0.85)} L${f1(540 - w * 0.3)} ${f1(by - h)} L${f1(540 + w * 0.3)} ${f1(by - h)} L${f1(540 + w * 0.4)} ${f1(by - h * 0.85)} Q${f1(540 + w)} ${f1(by - h * 0.55)} ${f1(540 + w * 0.75)} ${f1(by)}Z" fill="#B88A55"/>`;
      s += `<path d="M${f1(540 - w * 0.5)} ${f1(by - h * 0.3)} Q540 ${f1(by - h * 0.25)} ${f1(540 + w * 0.5)} ${f1(by - h * 0.32)}" stroke="#9B7040" stroke-width="8" fill="none" opacity=".6"/>`;
      s += `<path d="M${f1(540 - w * 0.42)} ${f1(by - h * 0.85)} Q540 ${f1(by - h * 0.8)} ${f1(540 + w * 0.42)} ${f1(by - h * 0.85)}" stroke="#7E5A33" stroke-width="16" fill="none" stroke-linecap="round"/>`;
      for (let i = 0; i < 7; i++) s += koin(540 - w * 0.25 + i * w * 0.085, by - h - 6 - ((i * 7) % 3) * 10, 0.55, i * 20);
      s += `</g>`; karungS = s;
    }
    if (hj > 0) {
      for (let i = 0; i < 46; i++) {
        const mulai = (i / 46) * 0.75, u = cl((hj - mulai) / 0.25);
        if (u <= 0) continue;
        const dx = ((i * 97) % 520) - 260, rx = 540 + dx * 0.75, ry = m(rx) - 22 - 70 * Math.exp(-Math.pow(dx / 200, 2)) * (0.4 + 0.6 * (i / 46)) - (i % 4) * 6;
        if (u >= 1) { if (!(o.sembunyiTumpuk && kr > 0.01 && (o.karungY || 0) > -60)) s += koin(rx, ry, 0.5 + ((i * 13) % 5) * 0.05, i * 47 + 40); continue; }
        const x = lerp(540 + dx, rx, u), y = lerp(-300, ry, u * u);
        s += koin(x, y, 0.5 + ((i * 13) % 5) * 0.05, i * 47 + u * 300);
      }
    }
    s += karungS;
    return s;
  }

  // ---------- panggung kupas (satu rambut + ujung pipih di bawah permukaan) ----------
  const PK = { permukaan: 700, padX: 560, padW: 220 };
  function panggungKupas(t, o = {}) {
    const P = PK.permukaan, tali = o.tali || 0, geser = o.geser || 0, mir = o.miring || 0, cp = o.copot || 0;
    let s = `<rect x="-1000" y="-800" width="3600" height="3400" fill="${C.TOSCA3}"/><circle cx="540" cy="900" r="640" fill="${C.TOSCA2}" opacity=".5"/>`;
    s += `<rect x="-1000" y="-800" width="3600" height="${P + 800}" fill="${C.KREM2}"/><rect x="-1000" y="${P - 16}" width="3600" height="16" fill="#E2CFA8"/>`;
    // rambut: tangkai dari kiri bawah ke pad
    const strain = geser * (0.5 + 0.5 * Math.sin(t * 22)) * 0.4 + geser * 0.6;
    const x0 = PK.padX - PK.padW / 2, L = PK.padW;
    // pad terkelupas: bagian ujung (kanan) terangkat menjauh (ke bawah) dengan sudut makin besar; copot = seluruhnya lepas
    const lepas = cl(mir), sudut = 58 * halus(lepas), d = L * 0.9 * lepas;
    const pFlat = x0 + L - d;
    const rad = (sudut * Math.PI) / 180;
    let pts = [[x0, P], [pFlat, P], [pFlat + Math.cos(rad) * d, P + Math.sin(rad) * d]];
    const fx = geser * 10 * (Math.sin(t * 30) * 0.5);
    pts = pts.map((p, i) => [p[0] + fx, p[1] + halus(cp) * (40 + i * 40)]);
    // tangkai rambut (melengkung lebih saat ditarik ke samping)
    const tipBase = [pts[0][0] + 30, pts[0][1] + 12];
    const ctrl = [lerp(260, 420, strain), lerp(1000, 940, strain)];
    s += `<path d="M120 1500 Q${f1(ctrl[0])} ${f1(ctrl[1])} ${f1(tipBase[0])} ${f1(tipBase[1])}" stroke="${C.CICAK2}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M120 1500 Q${f1(ctrl[0])} ${f1(ctrl[1])} ${f1(tipBase[0])} ${f1(tipBase[1])}" stroke="${C.CICAK}" stroke-width="22" fill="none" stroke-linecap="round"/>`;
    // pad (polyline tebal)
    s += `<path d="M${pts.map((p) => f1(p[0]) + " " + f1(p[1] + 12)).join(" L")}" stroke="${C.CICAK2}" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<path d="M${pts.map((p) => f1(p[0]) + " " + f1(p[1] + 10)).join(" L")}" stroke="${C.PAD}" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    // garis tarik antarmolekul pada bagian yang masih menempel
    const ujungMenempel = cp > 0.01 ? x0 : pFlat;
    for (let x = x0 + 14; x < ujungMenempel + fx - 6; x += 26) { const pul = 0.6 + 0.4 * Math.sin(t * 9 + x); s += `<path d="M${f1(x)} ${P + 2} l4 4 l-4 4" stroke="${C.FUCHSIA}" stroke-width="3" fill="none" opacity="${f3(0.8 * pul)}"/>`; }
    // tali menarik MENYAMPING (sejajar permukaan)
    if (tali > 0.01) {
      const ax = x0 + L + fx, ay = P + 14, panjangTali = 420 * tali;
      s += `<path d="M${f1(ax)} ${ay} L${f1(ax + panjangTali)} ${ay}" stroke="${C.KAYU}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${geser > 0.3 ? "0" : "0"}"/>`;
      s += `<circle cx="${f1(ax)}" cy="${ay}" r="12" fill="${C.KAYU2}"/>`;
      // panah sejajar permukaan
      const ar = 0.8 + 0.2 * Math.sin(t * 8) * geser;
      s += `<g opacity="${f3(cl(tali * 2))}" transform="translate(${f1(ax + 120)} ${ay + 70})"><path d="M0 0 L${f1(220 * ar)} 0" stroke="${C.KUNING}" stroke-width="20" stroke-linecap="round"/><path d="M${f1(220 * ar + 30)} 0 L${f1(220 * ar - 10)} -30 L${f1(220 * ar - 10)} 30Z" fill="${C.KUNING}"/></g>`;
      // garis usaha
      if (geser > 0.1) for (let i = 0; i < 3; i++) s += `<path d="M${f1(ax - 30 - i * 26)} ${P + 70 + i * 16} l-26 0" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="${f3(geser * (0.5 + 0.5 * Math.sin(t * 16 + i)))}"/>`;
    }
    // percikan "tik" saat copot
    if (cp > 0.01 && cp < 1) { const k = cp; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; s += `<path d="M${f1(x0 + L * 0.8 + Math.cos(a) * 40 * (1 + k))} ${f1(P + 40 + Math.sin(a) * 40 * (1 + k))} l${f1(Math.cos(a) * 22)} ${f1(Math.sin(a) * 22)}" stroke="${C.KUNING}" stroke-width="7" stroke-linecap="round" opacity="${f3(1 - k)}"/>`; } }
    return s;
  }

  // ---------- layar terbelah: kupas jari & kupas stiker (pandangan samping) ----------
  function jalurKupas(x0, y0, L, k, arah, n = 20, maks = 70) {
    // strip sepanjang permukaan dari x0 ke x0+L, terkelupas dari UJUNG (x0+L) ke belakang; arah: +1 menjauh ke bawah, −1 ke atas
    const d = L * k, pf = x0 + L - d, sudut = 20 + maks * k, r = (sudut * Math.PI) / 180, pts = [];
    for (let i = 0; i <= n; i++) {
      const s = (L * i) / n, x = x0 + s;
      if (x <= pf) pts.push([x, y0]);
      else { const u = x - pf, fil = Math.min(u, 30), lurus = Math.max(0, u - 30), a = r * (fil / 30); pts.push([pf + Math.sin(a) * 30 * (fil / 30) + Math.cos(r) * lurus, y0 + arah * ((1 - Math.cos(a)) * 30 * (fil / 30) + Math.sin(r) * lurus)]); }
    }
    return pts;
  }
  function kupasJari(x, y, s, t, o = {}) {
    // langit-langit di atas (y); kaki cicak dari bawah, 1 jari menempel ke kanan; o.k 0..1 menggulung dari ujung
    const k = o.k || 0;
    let out = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">`;
    out += `<rect x="-700" y="-700" width="1400" height="700" fill="${C.KREM2}"/><rect x="-700" y="-16" width="1400" height="16" fill="#E2CFA8"/>`;
    out += `<path d="M-420 520 Q-330 200 -250 40 L-170 60 Q-240 230 -300 520Z" fill="${C.CICAK2}"/><ellipse cx="-220" cy="40" rx="70" ry="40" fill="${C.CICAK}"/>`;
    const pts = jalurKupas(-240, 18, 520, k, 1);
    out += `<path d="M${pts.map((p) => f1(p[0]) + " " + f1(p[1])).join(" L")}" stroke="${C.CICAK2}" stroke-width="44" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    out += `<path d="M${pts.map((p) => f1(p[0]) + " " + f1(p[1] - 2)).join(" L")}" stroke="${C.CICAK}" stroke-width="32" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    // lamela pada sisi yang menempel / terlihat
    for (let i = 3; i < pts.length; i += 2) { const p = pts[i], q = pts[i - 1], a = Math.atan2(p[1] - q[1], p[0] - q[0]); out += `<path d="M${f1(p[0] - Math.sin(a) * 14)} ${f1(p[1] - 14 * Math.cos(a) * -1 - 2)} l${f1(-Math.sin(a) * 4)} ${f1(Math.cos(a) * 4)}" stroke="${C.LAMELA}" stroke-width="4" stroke-linecap="round"/>`; }
    // garis tarik kecil pada bagian yang masih menempel
    const pf = -240 + 520 * (1 - k);
    for (let xx = -220; xx < pf - 10; xx += 34) out += `<path d="M${xx} -2 l5 5 l-5 5" stroke="${C.FUCHSIA}" stroke-width="3" fill="none" opacity="${f3(0.5 + 0.4 * Math.sin(t * 9 + xx))}"/>`;
    // bantalan ujung jari
    const e = pts[pts.length - 1];
    out += `<circle cx="${f1(e[0])}" cy="${f1(e[1])}" r="20" fill="${C.PAD}"/>`;
    // panah putar kecil (arah gulung) saat mengelupas
    if (k > 0.05 && k < 0.98) out += `<path d="M${f1(e[0] + 50)} ${f1(e[1] - 40)} a50 50 0 0 1 10 70" stroke="${C.KUNING}" stroke-width="12" fill="none" stroke-linecap="round" opacity="${f3(Math.sin(Math.PI * k))}"/>`;
    return out + `</g>`;
  }
  function kupasStiker(x, y, s, t, o = {}) {
    // sampul buku di bawah (y), stiker bulat dikelupas dari tepi kanan, tangan menjepit ujungnya
    const k = o.k || 0;
    let out = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f3(s)})">`;
    out += `<rect x="-520" y="0" width="1040" height="420" rx="30" fill="${C.FUCHSIA2}"/><rect x="-520" y="0" width="1040" height="30" rx="14" fill="${C.FUCHSIA}"/><rect x="-520" y="380" width="1040" height="40" fill="${C.FUCHSIA3}"/>`;
    const pts = jalurKupas(-150, -12, 300, k * 0.75, -1, 20, 40);
    out += `<path d="M${pts.map((p) => f1(p[0]) + " " + f1(p[1])).join(" L")}" stroke="${C.KUNING}" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    out += `<path d="M${pts.slice(0, 1 + Math.floor(pts.length * (1 - k))).map((p) => f1(p[0]) + " " + f1(p[1] + 4)).join(" L")}" stroke="#E5A91A" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>`;
    const e = pts[pts.length - 1];
    // tangan (jempol + telunjuk) menjepit ujung, datang dari kanan atas
    const ra = -25 - 25 * k;
    out += `<g transform="translate(${f1(e[0])} ${f1(e[1])}) rotate(${f1(ra)})"><path d="M18 -34 Q120 -70 260 -40 L270 50 Q150 70 40 34 Q10 20 18 -34Z" fill="${C.KULIT}"/>
<path d="M30 -28 Q0 -30 -6 -4" stroke="${C.KULIT}" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M36 26 Q4 24 -2 6" stroke="${C.KULIT2}" stroke-width="26" fill="none" stroke-linecap="round"/>
<ellipse cx="-6" cy="-8" rx="10" ry="8" fill="#FBE6D2"/><path d="M90 -44 Q110 -10 96 30" stroke="${C.KULIT2}" stroke-width="5" fill="none" opacity=".6"/></g>`;
    return out + `</g>`;
  }

  // ---------- rumah terbelah 3 ruang ----------
  function rumah(t, o = {}) {
    let s = `<rect x="-1000" y="-800" width="3600" height="3400" fill="${C.MALAM}"/>`;
    for (let i = 0; i < 26; i++) { const k = 0.5 + 0.5 * Math.sin(t * 2 + i * 1.3); s += `<circle cx="${((i * 173) % 2400) - 700}" cy="${((i * 97) % 700) - 300}" r="${f1(2 + 2 * k)}" fill="${C.KREM}" opacity="${f3(0.3 + 0.5 * k)}"/>`; }
    // atap
    s += `<path d="M20 640 L540 400 L1060 640Z" fill="${C.FUCHSIA2}"/><path d="M60 640 L540 430 L1020 640" stroke="${C.FUCHSIA}" stroke-width="16" fill="none"/>`;
    s += `<rect x="60" y="640" width="960" height="840" fill="${C.TOSCA5}"/>`;
    // ruang 1 kamar (kiri atas)
    s += `<rect x="80" y="660" width="450" height="380" fill="${C.TOSCA2}"/><rect x="80" y="660" width="450" height="60" fill="${C.TOSCA1}" opacity=".5"/>`;
    s += `<rect x="110" y="930" width="300" height="80" rx="16" fill="${C.KREM2}"/><rect x="110" y="960" width="300" height="70" fill="${C.FUCHSIA}"/><ellipse cx="160" cy="932" rx="44" ry="20" fill="${C.KREM}"/>`;
    // ruang 2 dapur (kanan atas)
    s += `<rect x="550" y="660" width="450" height="380" fill="${C.TOSCA3}"/>`;
    s += `<rect x="590" y="800" width="200" height="18" fill="${C.KAYU}"/><rect x="610" y="760" width="40" height="40" rx="6" fill="${C.KREM2}"/><rect x="670" y="748" width="34" height="52" rx="8" fill="${C.PINK}"/><circle cx="740" cy="780" r="20" fill="${C.KUNING}"/>`;
    s += `<rect x="570" y="930" width="420" height="110" fill="${C.KREM2}"/><rect x="570" y="930" width="420" height="16" fill="#E2CFA8"/><ellipse cx="880" cy="924" rx="56" ry="16" fill="${C.TOSCA5}"/><rect x="838" y="890" width="84" height="36" rx="10" fill="${C.TOSCA5}"/>`;
    // ruang 3 lampu (bawah, lebar)
    s += `<rect x="80" y="1060" width="920" height="400" fill="${C.TOSCA4}"/>`;
    const lk = 0.85 + 0.15 * Math.sin(t * 6);
    s += `<circle cx="540" cy="1150" r="${f1(190 * lk)}" fill="${C.KUNING}" opacity=".18"/><path d="M540 1060 L540 1110" stroke="${C.KREM2}" stroke-width="6"/><path d="M490 1150 L590 1150 L570 1110 L510 1110Z" fill="${C.KREM}"/><ellipse cx="540" cy="1156" rx="30" ry="14" fill="#FFF7C8"/>`;
    for (let i = 0; i < 4; i++) { const a = t * (2.4 + i * 0.5) + i * 1.6, mx = 540 + Math.cos(a) * (70 + i * 14), my = 1170 + Math.sin(a * 1.3) * 40; s += `<g transform="translate(${f1(mx)} ${f1(my)})"><ellipse cx="-7" cy="0" rx="9" ry="6" fill="${C.KREM2}" transform="rotate(${f1(Math.sin(t * 30 + i) * 30)})"/><ellipse cx="7" cy="0" rx="9" ry="6" fill="${C.KREM2}" transform="rotate(${f1(-Math.sin(t * 30 + i) * 30)})"/><ellipse rx="3" ry="6" fill="${C.TOSCA5}"/></g>`; }
    s += `<rect x="160" y="1330" width="260" height="110" rx="24" fill="${C.FUCHSIA2}"/><rect x="700" y="1300" width="180" height="140" rx="10" fill="${C.KAYU}"/>`;
    // dinding pemisah
    s += `<rect x="530" y="660" width="20" height="380" fill="${C.TOSCA5}"/><rect x="80" y="1040" width="920" height="20" fill="${C.TOSCA5}"/>`;
    // cicak di tiap ruang
    s += cicak(330, 740, 0.28, t, { rot: 100 + Math.sin(t) * 8, liuk: Math.sin(t * 1.4) * 0.5 });
    s += cicak(900, 850, 0.28, t + 1, { rot: -20 + Math.sin(t * 0.8) * 10, liuk: Math.sin(t * 1.2 + 1) * 0.5 });
    s += cicak(700, 1110, 0.3, t + 2, { rot: 250 + Math.sin(t * 1.1) * 6, liuk: Math.sin(t * 1.5) * 0.5 });
    return s;
  }
  rumah.RUANG = { kamar: [305, 850], dapur: [775, 850], lampu: [540, 1210] };

  function hp(x, y, s, rot = 0, o = {}) {
    const tg = o.tag || 0;
    let out = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(s)})"><rect x="-44" y="-80" width="88" height="160" rx="16" fill="#26303A"/><rect x="-36" y="-68" width="72" height="132" rx="8" fill="${C.TOSCA1}"/>`;
    if (tg > 0.01) out += `<g opacity="${f3(tg)}" transform="scale(${f3(0.7 + 0.3 * tg)})"><circle cx="-6" cy="-12" r="12" fill="#FFFFFF"/><path d="M-26 22 Q-6 -4 14 22Z" fill="#FFFFFF"/><circle cx="20" cy="-22" r="13" fill="${C.FUCHSIA}"/><path d="M14 -22 L26 -22 M20 -28 L20 -16" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/></g>`;
    return out + `</g>`;
  }

  root.ASET = root.ASET || {};
  root.ASET.CICAK = { C, KAMAR, kamar, selimut, cicak, posKaki, tabungLem, mangkokKaret, silang, panahMerah, tanya, kakiBesar, mikroRambut, penampang, koin, mejaKoin, PK, panggungKupas, kupasJari, kupasStiker, rumah, hp, pita, bez };
})(typeof window !== "undefined" ? window : globalThis);
