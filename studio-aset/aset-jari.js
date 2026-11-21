/* ASET JARI KERIPUT & KAMAR MANDI AIR (Yoga, 22 Nov 2026; dipakai B-02 "Kenapa jari keriput kalau kena air?"). Muat SETELAH aset-set.js.
 * Gaya: datar tanpa garis hitam, maks 2–3 nada per benda, teks hanya lewat kode. Semua fungsi → potongan SVG (string).
 *  airBak(w,h,t,{muka}) — air bak mandi aqua (kaustik bergerak), muka = y permukaan · dindingKeramik(w,h,{warna,ubin,redup})
 *  ujungJari(x,y,s,rot,t,{keriput 0..1, bengkak 0..1, kedut, glow}) — jari raksasa sisi telapak, pangkal (x,y), ujung ke -y (panjang 560)
 *  titikJari(x,y,s,rot,lx,ly) → [X,Y] titik lokal jari di koordinat layar · tetesMengalir(...) — tetes air MENGALIR turun di kulit (tidak memantul)
 *  benangDalang(x0,y0,x1,y1,{lengkung,glow,a}) — benang kuning bercahaya · palangDalang(x,y,s,t,{tarik}) — tangan bayangan tanpa wajah + palang kayu
 *  gayung(x,y,s,rot,{warna}) · spons(x,y,s,t,{kembung,mata}) · capX(x,y,s,k) · emberCucian(x,y,s,t)
 *  orangHanduk(x,y,s,t,{raih}) — siluet orang berhanduk tanpa wajah, lengan meraih ke air · jalurSaraf(titik[],t,{k,pulsa,putus,redup})
 *  tanganRendam(x,y,s,t,{keriput,saraf:1 utuh|0 putus}) — telapak + 4 jari + jempol, garis saraf kuning (netral: tanpa perban/pucat/ikon medis)
 *  penampangJari(x,y,w,h,t,{sinyal,sempit,kempes,lipat,tarik}) — x-ray kulit: kulit luar (panjang tetap) · bantalan · pembuluh merah · saraf kuning
 *  sarungBantal(x,y,s,t,{isi 0..1, mata}) · kapas(x,y,s,t) · banMotor(x,y,r,t,{putar,cipratan}) · ubinBasah(w,y,h,t)
 *  kelereng(x,y,r,warna,{basah}) · mangkuk(x,y,s,{depan}) · stopwatchPolos(x,y,s,t,{laju}) · balokKayu(x,y,s,rot) · ikonJari(x,y,s,keriput)
 *  siluetJasLab(x,y,s,t,{arah,bicara}) · gelembungCoret(x,y,s,t,k) · kartuPilihan(x,y,s,teks,isi,{warna,k})
 *  sungaiKampung(x,y,s,t) (mini panel) · lorongRumah(w,h,t,{pintuX,buka}) · jamDinding(x,y,s,t,laju) · uap(x,y,s,t,k) · orangAntre(x,y,s,t,o) */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let _n = 0; const uid = (p) => `${p}j${++_n}`;
  const acak = (b) => { let s = b; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;
  const KUL = "#EDB58D", KULG = "#D99A72", KULS = "#F8CFAE", KERUT = "#C07E5A";

  // ---------- air bak mandi ----------
  function airBak(w, h, t = 0, o = {}) {
    const id = uid("ab"), mk = o.muka ?? 0;
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FD9D6"/><stop offset=".45" stop-color="#2BA6B4"/><stop offset="1" stop-color="#0F5E72"/></linearGradient></defs>
      <rect x="-40" y="${mk}" width="${w + 80}" height="${h - mk + 40}" fill="url(#${id})"/>`;
    const r = acak(o.benih || 71);
    for (let i = 0; i < 16; i++) { const cx = r() * w, cy = mk + 60 + r() * (h - mk - 60), rr = 50 + r() * 90, dx = Math.sin(t * 0.8 + i) * 22, dy = Math.cos(t * 0.6 + i * 1.3) * 14;
      s += `<path d="M${f1(cx - rr + dx)} ${f1(cy + dy)} q${f1(rr * 0.5)} ${f1(-rr * 0.35)} ${f1(rr)} 0 t${f1(rr)} 0" stroke="#BFF6F0" stroke-width="${f1(5 + r() * 5)}" fill="none" stroke-linecap="round" opacity="${f2(0.18 + 0.12 * Math.sin(t * 1.7 + i))}"/>`; }
    if (o.muka != null) s += `<path d="M-40 ${mk} ${[...Array(12)].map((_, i) => `Q${f1(i * w / 11 + w / 22)} ${f1(mk + 10 * Math.sin(t * 2.2 + i))} ${f1((i + 1) * w / 11)} ${mk}`).join(" ")} L${w + 40} ${mk + 8} L-40 ${mk + 8}Z" fill="#A8EEEA" opacity=".55"/><rect x="-40" y="${mk - 3}" width="${w + 80}" height="7" fill="#DFFBF8" opacity=".6"/>`;
    return s;
  }
  function dindingKeramik(w, h, o = {}) {
    const c = o.warna || "#1E6F7A", u = o.ubin || 120, ln = o.garis || "#17585F";
    let s = `<rect x="-40" y="-40" width="${w + 80}" height="${h + 80}" fill="${c}"/>`;
    for (let x = 0; x < w + 40; x += u) s += `<rect x="${x}" y="-40" width="4" height="${h + 80}" fill="${ln}"/>`;
    for (let y = 0; y < h + 40; y += u) s += `<rect x="-40" y="${y}" width="${w + 80}" height="4" fill="${ln}"/>`;
    return s;
  }
  // tepi bak mandi berkeramik (horizontal) di y, tebal 90
  function tepiBak(w, y, o = {}) {
    let s = `<rect x="-40" y="${y}" width="${w + 80}" height="96" fill="${o.warna || "#E8F4F2"}"/><rect x="-40" y="${y + 70}" width="${w + 80}" height="26" fill="#B9D6D4"/>`;
    for (let x = 0; x < w + 40; x += 110) s += `<rect x="${x}" y="${y}" width="4" height="96" fill="#C7DEDC"/>`;
    return s;
  }

  // ---------- ujung jari raksasa (sisi telapak) ----------
  const L = 560, HW = 100;
  function titikJari(x, y, s, rot, lx, ly) { const a = (rot * Math.PI) / 180; return [x + s * (lx * Math.cos(a) - ly * Math.sin(a)), y + s * (lx * Math.sin(a) + ly * Math.cos(a))]; }
  function kerutJari(k, t, ox = 0, oy = 0, sk = 1) {
    if (k <= 0.01) return "";
    let s = "";
    const n = 7;
    for (let i = 0; i < n; i++) { // kerutan memanjang yang berkelok di bantalan ujung jari
      const x0 = -70 + i * 23, y0 = -L + 46 + Math.abs(i - 3) * 10, y1 = -L + 236 - Math.abs(i - 3) * 8, amp = 9 * k;
      let d = `M${f1(x0)} ${f1(y0)}`; for (let j = 1; j <= 6; j++) { const yy = y0 + (y1 - y0) * j / 6; d += ` Q${f1(x0 + (j % 2 ? amp : -amp) * 1.6)} ${f1(yy - (y1 - y0) / 12)} ${f1(x0 + Math.sin(i * 2.1 + j) * 4 * k)} ${f1(yy)}`; }
      s += `<path d="${d}" stroke="${KERUT}" stroke-width="${f1(4 + 5 * k)}" fill="none" stroke-linecap="round" opacity="${f2(0.25 + 0.6 * k)}"/><path d="${d}" transform="translate(4 -2)" stroke="${KULS}" stroke-width="${f1(2 + 2 * k)}" fill="none" stroke-linecap="round" opacity="${f2(0.5 * k)}"/>`;
    }
    for (let i = 0; i < 3; i++) { const yy = -L + 270 + i * 120; s += `<path d="M-84 ${yy} Q0 ${yy + 10 + 6 * k} 84 ${yy}" stroke="${KERUT}" stroke-width="${f1(3 + 3 * k)}" fill="none" opacity="${f2(0.2 + 0.4 * k)}"/>`; }
    return s;
  }
  function ujungJari(x, y, s, rot = 0, t = 0, o = {}) {
    const k = cl(o.keriput ?? 1), b = cl(o.bengkak || 0), kd = o.kedut || 0, id = uid("uj"), gl = o.glow ?? 0;
    const getar = b > 0.5 ? Math.sin(t * 46) * 4 * (b - 0.5) * 2 : 0;
    const bentuk = `M${-HW} 40 L${-HW} ${-L + HW} Q${-HW} ${-L} 0 ${-L} Q${HW} ${-L} ${HW} ${-L + HW} L${HW} 40Z`;
    let v = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${KULS}"/><stop offset=".55" stop-color="${KUL}"/><stop offset="1" stop-color="${KULG}"/></linearGradient>
      <radialGradient id="${id}g"><stop offset="0" stop-color="#FFE7A0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient></defs>`;
    if (gl > 0) v += `<ellipse cx="0" cy="${-L * 0.5}" rx="${HW * 2.6}" ry="${L * 0.85}" fill="url(#${id}g)" opacity="${f2(gl)}"/>`;
    v += `<path d="${bentuk}" fill="url(#${id})"/>`;
    v += `<path d="M${HW - 24} ${-L + 90} L${HW - 24} 40" stroke="${KULG}" stroke-width="30" opacity=".5"/>`; // bayangan sisi
    v += `<path d="M${-HW + 26} ${-L + 120} Q${-HW + 20} ${-L * 0.5} ${-HW + 30} 0" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round" opacity=".28"/>`; // rim light
    v += kerutJari(k * (1 - b), t);
    if (k * (1 - b) <= 0.01) for (let i = 0; i < 2; i++) { const yy = -L + 300 + i * 150; v += `<path d="M-84 ${yy} Q0 ${yy + 12} 84 ${yy}" stroke="${KERUT}" stroke-width="5" fill="none" opacity=".35"/>`; }
    if (b > 0) { // menggembung seperti balon (canda: tidak meletus)
      const rx = HW + 120 * b, ry = 150 + 170 * b, cy = -L + 150 - 90 * b;
      v += `<g transform="translate(${f1(getar)} 0)"><ellipse cx="0" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#${id})"/><ellipse cx="${f1(-rx * 0.4)}" cy="${f1(cy - ry * 0.4)}" rx="${f1(rx * 0.22)}" ry="${f1(ry * 0.14)}" fill="#FFFFFF" opacity=".55" transform="rotate(-30 ${f1(-rx * 0.4)} ${f1(cy - ry * 0.4)})"/>
        ${[0, 1, 2].map((q) => `<path d="M${f1(-rx * 0.55 + q * rx * 0.55)} ${f1(cy - ry * 0.75)} Q${f1(-rx * 0.5 + q * rx * 0.55)} ${f1(cy)} ${f1(-rx * 0.55 + q * rx * 0.55)} ${f1(cy + ry * 0.75)}" stroke="${KULS}" stroke-width="6" fill="none" opacity=".45"/>`).join("")}</g>`;
    }
    return g(x, y, s, v, rot + kd);
  }
  // tetes air yang mengalir TURUN di kulit (fase u 0..1, posisi lokal lx) — bukan memantul
  function tetesMengalir(x, y, s, rot, lx, u, o = {}) {
    if (u <= 0 || u >= 1) return "";
    const ly = -L + 70 + u * (L - 40), [X, Y] = titikJari(x, y, s, rot, lx, ly), [X0, Y0] = titikJari(x, y, s, rot, lx, Math.max(-L + 70, ly - 160 * s / s));
    const r = (o.r || 16) * s, a = Math.sin(Math.PI * u);
    return `<path d="M${f1(X0)} ${f1(Y0)} L${f1(X)} ${f1(Y)}" stroke="#DFFBF8" stroke-width="${f1(r * 0.5)}" stroke-linecap="round" opacity="${f2(0.45 * a)}"/>
      <g transform="translate(${f1(X)} ${f1(Y)}) rotate(${f1(rot)})" opacity="${f2(0.95 * Math.min(1, a * 3))}"><path d="M0 ${f1(-r * 1.6)} C${f1(r * 0.4)} ${f1(-r)} ${f1(r)} ${f1(-r * 0.4)} ${f1(r)} 0 A${f1(r)} ${f1(r)} 0 0 1 ${f1(-r)} 0 C${f1(-r)} ${f1(-r * 0.4)} ${f1(-r * 0.4)} ${f1(-r)} 0 ${f1(-r * 1.6)}Z" fill="#CFF8F4" opacity=".9"/><ellipse cx="${f1(-r * 0.35)}" cy="${f1(-r * 0.2)}" rx="${f1(r * 0.22)}" ry="${f1(r * 0.38)}" fill="#FFFFFF" opacity=".85"/></g>`;
  }

  // ---------- benang dalang & tangan bayangan ----------
  function benangDalang(x0, y0, x1, y1, o = {}) {
    const lk = o.lengkung ?? 30, a = o.a ?? 1, gl = o.glow ?? 1, mx = (x0 + x1) / 2 + lk, my = (y0 + y1) / 2;
    if (a <= 0) return "";
    const d = `M${f1(x0)} ${f1(y0)} Q${f1(mx)} ${f1(my)} ${f1(x1)} ${f1(y1)}`;
    return `<g opacity="${f2(a)}"><path d="${d}" stroke="#FFD34A" stroke-width="${f1(22 * gl)}" fill="none" opacity=".22" stroke-linecap="round"/><path d="${d}" stroke="#FFE27A" stroke-width="${f1(o.tebal || 6)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#FFFBE0" stroke-width="2" fill="none" opacity=".8"/></g>`;
  }
  // palang kayu dalang + tangan bayangan (x,y = pusat palang). Ujung tali: titik [-170,0],[0,-10],[170,0] (lokal, ×s). tarik 0..1 menyentak naik.
  function palangDalang(x, y, s, t = 0, o = {}) {
    const tr = o.tarik || 0, gy = -tr * 36, sw = Math.sin(t * 1.6) * 3;
    return g(x, y + gy, s, `<rect x="-190" y="-14" width="380" height="28" rx="12" fill="#8A5A34"/><rect x="-14" y="-120" width="28" height="200" rx="12" fill="#734A2A"/><rect x="-190" y="-14" width="380" height="9" rx="4" fill="#B07A4A"/>
      <path d="M-20 -560 L-40 -330 Q-110 -320 -112 -250 Q-114 -200 -70 -186 L80 -186 Q120 -200 118 -250 Q114 -320 60 -330 L60 -560Z" fill="#0E2A36" opacity=".94"/>
      ${[-66, -22, 22, 66].map((fx, i) => `<rect x="${fx - 19}" y="-200" width="38" height="${92 - Math.abs(i - 1.5) * 10}" rx="19" fill="#0E2A36" opacity=".94"/>`).join("")}<path d="M-108 -250 Q-150 -220 -120 -176 Q-96 -150 -66 -170" fill="#0E2A36" opacity=".94"/><path d="M-60 -300 Q0 -320 70 -300" stroke="#2E5A6A" stroke-width="6" fill="none" opacity=".6"/>`, sw);
  }

  // ---------- benda kamar mandi ----------
  function gayung(x, y, s, rot = 0, o = {}) {
    const c = o.warna || "#F06B5A", cg = o.warnaG || "#C9503F";
    return g(x, y, s, `<ellipse cx="0" cy="8" rx="120" ry="20" fill="#000" opacity=".15"/><path d="M-110 -120 L110 -120 L90 0 Q0 20 -90 0Z" fill="${c}"/><ellipse cx="0" cy="-120" rx="110" ry="26" fill="${cg}"/><ellipse cx="0" cy="-118" rx="94" ry="18" fill="#8FE0DC" opacity=".8"/>
      <path d="M100 -100 L250 -150 Q270 -150 268 -130 L112 -64Z" fill="${c}"/><path d="M-80 -100 L-66 -14" stroke="#FFFFFF" stroke-width="12" opacity=".3" stroke-linecap="round"/>`, rot);
  }
  function spons(x, y, s, t = 0, o = {}) {
    const k = cl(o.kembung || 0), w = 120 + 70 * k, h = 70 + 70 * k, r = acak(13);
    let pori = ""; for (let i = 0; i < 14; i++) pori += `<ellipse cx="${f1((r() - 0.5) * w * 1.6)}" cy="${f1(-h * 0.2 - r() * h * 1.5)}" rx="${f1(6 + r() * 8)}" ry="${f1(5 + r() * 6)}" fill="#D9A21C" opacity=".75"/>`;
    const tts = k > 0.05 ? [0, 1, 2].map((i) => { const q = (t * 1.3 + i / 3) % 1; return `<circle cx="${f1(-w * 0.5 + i * w * 0.5)}" cy="${f1(-h * 2 - 40 + q * 120)}" r="7" fill="#CFF8F4" opacity="${f2(Math.sin(Math.PI * q) * 0.9 * k)}"/>`; }).join("") : "";
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="${f1(w + 20)}" ry="16" fill="#000" opacity=".18"/><rect x="${f1(-w)}" y="${f1(-h * 2)}" width="${f1(w * 2)}" height="${f1(h * 2)}" rx="${f1(30 + 40 * k)}" fill="#FFC93C"/>
      <rect x="${f1(-w)}" y="${f1(-h * 2)}" width="${f1(w * 2)}" height="${f1(h * 0.5)}" rx="20" fill="#3FA86A"/>${pori}${tts}${o.mata ? A.mata(0, -h * 0.9, 0.9, o.mata, o.lihat || 0) : ""}`, o.rot || 0);
  }
  function capX(x, y, s, k) {
    if (k <= 0) return "";
    const sk = 1.6 - 0.6 * Math.min(1, k * 1.4);
    return g(x, y, s * sk, `<g opacity="${f2(Math.min(1, k * 2))}"><path d="M-130 -130 L130 130 M130 -130 L-130 130" stroke="#E2232E" stroke-width="54" stroke-linecap="round"/><path d="M-130 -130 L130 130 M130 -130 L-130 130" stroke="#FF6A6A" stroke-width="14" stroke-linecap="round" opacity=".5"/></g>`, -6);
  }
  function emberCucian(x, y, s, t = 0) {
    const b = Math.sin(t * 2) * 3;
    return g(x, y, s, `<ellipse cx="0" cy="6" rx="150" ry="20" fill="#000" opacity=".15"/><path d="M-140 -200 L140 -200 L112 0 L-112 0Z" fill="#3E8FD0"/><ellipse cx="0" cy="-200" rx="140" ry="30" fill="#2E70A8"/>
      <path d="M-120 -206 Q-60 ${-250 + b} 0 -214 Q60 ${-256 - b} 120 -206 Q60 -186 0 -190 Q-60 -186 -120 -206Z" fill="#F4EEDC"/><path d="M-70 -228 Q-30 -260 20 -232" fill="#E86A5A"/><path d="M30 -226 Q70 -250 100 -216" fill="#5FB37A"/>
      ${[0, 1, 2, 3].map((i) => `<circle cx="${-80 + i * 50}" cy="${-236 - (i % 2) * 14 + Math.sin(t * 3 + i) * 4}" r="${12 + (i % 2) * 5}" fill="#FFFFFF" opacity=".9"/>`).join("")}<path d="M-120 -170 L-100 -20" stroke="#FFFFFF" stroke-width="12" opacity=".25"/>`);
  }

  // ---------- orang berhanduk (tanpa wajah) + jalur saraf ----------
  // x,y = pinggul (duduk menghadap kiri). raih 0..1 = lengan turun ke air. Kembalikan juga titik jalur saraf lewat orangHanduk.saraf(x,y,s)
  function orangHanduk(x, y, s, t = 0, o = {}) {
    const ay = Math.sin(t * 1.8) * 4;
    return g(x, y, s, `<ellipse cx="0" cy="20" rx="200" ry="26" fill="#000" opacity=".18"/>
      <path d="M-80 0 Q-120 -260 -60 -420 Q0 -470 70 -430 Q140 -280 110 0Z" fill="#3A5A6E"/>
      <path d="M-100 -360 Q0 -440 100 -380 Q110 -300 60 -280 Q0 -320 -70 -270 Q-120 -300 -100 -360Z" fill="#FFF4DC"/><path d="M60 -380 Q90 -330 60 -280" stroke="#E2D8C0" stroke-width="16" fill="none"/>
      <rect x="-26" y="-500" width="52" height="70" rx="20" fill="${KUL}"/><ellipse cx="-6" cy="${-570 + ay}" rx="78" ry="86" fill="${KUL}"/><ellipse cx="62" cy="${-566 + ay}" rx="16" ry="24" fill="${KULG}"/>
      <path d="M-84 ${-560 + ay} Q-90 ${-672 + ay} -6 ${-668 + ay} Q76 ${-672 + ay} 70 ${-560 + ay} Q56 ${-520 + ay} 30 ${-506 + ay} Q-10 ${-512 + ay} -40 ${-506 + ay} Q-80 ${-516 + ay} -84 ${-560 + ay}Z" fill="#2A2020"/>
      <path d="M-70 -400 Q-260 -330 -330 -120" stroke="${KUL}" stroke-width="64" fill="none" stroke-linecap="round"/><path d="M-200 0 L60 0 L40 -40 L-180 -40Z" fill="#2E4A5A"/>`);
  }
  orangHanduk.saraf = (x, y, s) => [[-330, -100], [-300, -220], [-200, -350], [-60, -410], [10, -440], [0, -300], [10, -120]].map(([a, b]) => [x + a * s, y + b * s]);
  function jalurSaraf(tt, t = 0, o = {}) {
    const k = cl(o.k ?? 1), red = o.redup || 0;
    if (k <= 0 || tt.length < 2) return "";
    let d = `M${f1(tt[0][0])} ${f1(tt[0][1])}`; for (let i = 1; i < tt.length; i++) { const p = tt[i - 1], q = tt[i]; d += ` Q${f1(p[0])} ${f1(p[1])} ${f1((p[0] + q[0]) / 2)} ${f1((p[1] + q[1]) / 2)}`; } d += ` L${f1(tt[tt.length - 1][0])} ${f1(tt[tt.length - 1][1])}`;
    let pj = 0; for (let i = 1; i < tt.length; i++) pj += Math.hypot(tt[i][0] - tt[i - 1][0], tt[i][1] - tt[i - 1][1]);
    const warna = red ? "#9A8C5A" : "#FFE27A", gw = red ? 0 : 1;
    const dash = o.putus ? `stroke-dasharray="${f1(pj * 0.36)} ${f1(pj * 0.14)} ${f1(pj)}"` : `stroke-dasharray="${f1(pj)}" stroke-dashoffset="${f1(pj * (1 - k))}"`;
    let s = `<path d="${d}" stroke="#FFD34A" stroke-width="${f1((o.tebal || 10) * 3)}" fill="none" opacity="${f2(0.25 * gw)}" stroke-linecap="round" ${dash}/><path d="${d}" stroke="${warna}" stroke-width="${o.tebal || 10}" fill="none" stroke-linecap="round" ${dash}/>`;
    if (o.pulsa != null && !o.putus && !red) { const q = ((o.pulsa % 1) + 1) % 1; s += `<path d="${d}" stroke="#FFFFFF" stroke-width="${f1((o.tebal || 10) * 1.6)}" fill="none" stroke-linecap="round" stroke-dasharray="${f1(pj * 0.08)} ${f1(pj * 2)}" stroke-dashoffset="${f1(-pj * q)}" opacity=".9"/>`; }
    return s;
  }
  // ---------- tangan direndam (telapak menghadap kamera) ----------
  function tanganRendam(x, y, s, t = 0, o = {}) {
    const k = cl(o.keriput || 0), sr = o.saraf ?? 1, id = uid("tr");
    const jari = [[-96, -360, 46, 230], [-32, -410, 48, 280], [34, -400, 48, 270], [96, -350, 44, 220]];
    let v = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${KULS}"/><stop offset=".6" stop-color="${KUL}"/><stop offset="1" stop-color="${KULG}"/></linearGradient></defs>`;
    v += `<path d="M-90 400 L-110 -60 Q-120 -150 -40 -170 L60 -170 Q130 -150 126 -60 L100 400Z" fill="url(#${id})"/>`;
    v += `<path d="M-108 -70 Q-200 -130 -220 -220 Q-226 -260 -190 -262 Q-150 -250 -120 -170Z" fill="url(#${id})"/>`; // jempol
    jari.forEach(([cx, top, w, len]) => {
      v += `<rect x="${cx - w / 2}" y="${top}" width="${w}" height="${len}" rx="${w / 2}" fill="url(#${id})"/>`;
      if (k > 0.02) for (let i = 0; i < 4; i++) { const xx = cx - 14 + i * 9; v += `<path d="M${xx} ${top + 14} q${f1(6 * k)} 14 0 26 q${f1(-6 * k)} 14 0 26 q${f1(6 * k)} 14 0 26" stroke="#A8603E" stroke-width="${f1(3 + 3.5 * k)}" fill="none" stroke-linecap="round" opacity="${f2(0.2 + 0.8 * k)}"/>`; }
      v += `<path d="M${cx - w / 2 + 8} ${top + len * 0.55} q${w / 2 - 8} 8 ${w - 16} 0" stroke="${KULG}" stroke-width="4" fill="none" opacity=".6"/>`;
    });
    v += `<path d="M-60 -120 Q-10 -60 70 -110" stroke="${KULG}" stroke-width="6" fill="none" opacity=".5"/>`;
    // saraf kuning dari pergelangan ke tiap ujung jari
    const tt = jari.map(([cx, top]) => [[0, 380], [0, 60], [cx * 0.7, -150], [cx, top + 30]]);
    tt.forEach((p) => { v += sr ? jalurSaraf(p, t, { tebal: 6, pulsa: o.pulsa }) : jalurSaraf(p, t, { tebal: 6, putus: 1, redup: 1 }); });
    return g(x, y, s, v, o.rot || 0);
  }

  // ---------- penampang ujung jari (x-ray) ----------
  // x,y = pojok kiri atas, w×h. sempit/kempes/lipat 0..1; sinyal = fase pulsa (0..1) atau null; tarik = panah turun 0..1
  function penampangJari(x, y, w, h, t = 0, o = {}) {
    const sp = cl(o.sempit || 0), kp = cl(o.kempes || 0), lp = cl(o.lipat || 0), id = uid("pj");
    const muka0 = y + 210 + kp * 70, amp = 46 * lp, dasar = y + h - 120;
    const permukaan = (xx) => muka0 + amp * (0.5 - 0.5 * Math.cos(((xx - x) / w) * Math.PI * 2 * 4));
    let atas = `M${x} ${f1(permukaan(x))}`; for (let i = 1; i <= 64; i++) { const xx = x + (w * i) / 64; atas += ` L${f1(xx)} ${f1(permukaan(xx))}`; }
    let s = `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="40"/></clipPath><linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7B3A8"/><stop offset="1" stop-color="#E58A86"/></linearGradient></defs><g clip-path="url(#${id})">`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#5FD0D0"/>` + airBak(w, 400, t, { benih: 9 }).replace(/<rect x="-40" y="0"/, `<rect x="-40" y="0"`).replace(/^/, `<g transform="translate(${x} ${y})" opacity=".85">`) + `</g>`;
    s += `${atas} `.replace(/^M/, '<path d="M') + ` L${x + w} ${dasar + 60} L${x} ${dasar + 60}Z" fill="url(#${id}b)"/>`;
    // kulit luar (tebal tetap) mengikuti permukaan
    let bawah = ""; for (let i = 64; i >= 0; i--) { const xx = x + (w * i) / 64; bawah += ` L${f1(xx)} ${f1(permukaan(xx) + 44)}`; }
    s += `<path d="${atas}${bawah}Z" fill="#F6D2B0"/><path d="${atas}" stroke="#FFF1DE" stroke-width="8" fill="none"/>`;
    // pembuluh darah (merah) — diameter mengecil saat menyempit
    const vy = (muka0 + 44 + dasar) / 2 + 10, r0 = 40, r = r0 * (1 - 0.6 * sp);
    s += `<rect x="${x - 10}" y="${f1(vy - r)}" width="${w + 20}" height="${f1(r * 2)}" rx="${f1(r)}" fill="#C8303A"/><rect x="${x - 10}" y="${f1(vy - r * 0.55)}" width="${w + 20}" height="${f1(r * 0.4)}" rx="${f1(r * 0.2)}" fill="#E85A60" opacity=".7"/>`;
    for (let i = 0; i < 7; i++) { const q = ((t * 0.5 + i / 7) % 1), cx = x + q * w; s += `<ellipse cx="${f1(cx)}" cy="${f1(vy)}" rx="${f1(14 * (1 - 0.4 * sp))}" ry="${f1(10 * (1 - 0.55 * sp))}" fill="#FF8A8A" opacity=".8"/>`; }
    // cabang kapiler ke atas
    for (let i = 0; i < 5; i++) { const cx = x + w * (0.12 + i * 0.19); s += `<path d="M${f1(cx)} ${f1(vy - r)} Q${f1(cx + 20)} ${f1((vy + muka0) / 2)} ${f1(cx + 8)} ${f1(permukaan(cx + 8) + 60)}" stroke="#C8303A" stroke-width="${f1(10 * (1 - 0.55 * sp))}" fill="none" stroke-linecap="round"/>`; }
    // saraf kuning sejajar di bawah pembuluh
    const ny = vy + r0 + 60;
    s += jalurSaraf([[x - 20, ny + 40], [x + w * 0.3, ny], [x + w * 0.6, ny + 20], [x + w + 20, ny - 10]], t, { tebal: 14, pulsa: o.sinyal });
    for (let i = 0; i < 3; i++) { const cx = x + w * (0.25 + i * 0.25); s += jalurSaraf([[cx, ny + 8], [cx + 10, (ny + vy) / 2], [cx + 4, vy + r + 4]], t, { tebal: 6, pulsa: o.sinyal }); }
    // tulang di dasar
    s += `<rect x="${x}" y="${dasar + 20}" width="${w}" height="${h}" fill="#F4EEDC"/><path d="M${x} ${dasar + 20} Q${x + w / 2} ${dasar - 10} ${x + w} ${dasar + 20}" fill="#F4EEDC"/>`;
    // panah: menyempit (atas-bawah ke pembuluh), tarik (kulit ke bawah)
    if (o.panahSempit > 0) { const a = o.panahSempit; [x + w * 0.3, x + w * 0.7].forEach((cx) => { s += `<g opacity="${f2(a)}"><path d="M${f1(cx)} ${f1(vy - r - 80)} L${f1(cx)} ${f1(vy - r - 18)} M${f1(cx - 16)} ${f1(vy - r - 36)} L${f1(cx)} ${f1(vy - r - 16)} L${f1(cx + 16)} ${f1(vy - r - 36)}" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${f1(cx)} ${f1(vy + r + 80)} L${f1(cx)} ${f1(vy + r + 18)} M${f1(cx - 16)} ${f1(vy + r + 36)} L${f1(cx)} ${f1(vy + r + 16)} L${f1(cx + 16)} ${f1(vy + r + 36)}" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round"/></g>`; }); }
    if (o.tarik > 0) { const a = o.tarik; for (let i = 0; i < 4; i++) { const cx = x + w * (0.125 + i * 0.25), yy = permukaan(cx) + 60; s += `<g opacity="${f2(a)}"><path d="M${f1(cx)} ${f1(yy)} L${f1(cx)} ${f1(yy + 70)} M${f1(cx - 18)} ${f1(yy + 48)} L${f1(cx)} ${f1(yy + 72)} L${f1(cx + 18)} ${f1(yy + 48)}" stroke="#7A3A2A" stroke-width="10" fill="none" stroke-linecap="round"/></g>`; } }
    s += `</g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="40" fill="none" stroke="#DFFBF8" stroke-width="10" opacity=".8"/>`;
    return s;
  }

  // ---------- sarung bantal (motif kawung sederhana) ----------
  function sarungBantal(x, y, s, t = 0, o = {}) {
    const k = cl(o.isi ?? 1), id = uid("sb"), hh = 110 + 90 * k, ww = 300 - 20 * (1 - k), sag = (1 - k) * 40;
    const badan = `M${-ww} ${-hh + 20} Q${-ww} ${-hh - 30 * k} ${-ww + 60} ${-hh - 20 * k} Q0 ${-hh - 70 * k + sag} ${ww - 60} ${-hh - 20 * k} Q${ww} ${-hh - 30 * k} ${ww} ${-hh + 20} L${ww} ${hh - 20} Q${ww} ${hh + 30 * k} ${ww - 60} ${hh + 20 * k} Q0 ${hh + 50 * k} ${-ww + 60} ${hh + 20 * k} Q${-ww} ${hh + 30 * k} ${-ww} ${hh - 20}Z`;
    let mot = ""; for (let i = -3; i <= 3; i++) for (let j = -2; j <= 2; j++) { const cx = i * 90 + (j % 2) * 45, cy = j * 80 * (0.6 + 0.4 * k); mot += `<g transform="translate(${cx} ${f1(cy)})"><ellipse cx="-14" cy="0" rx="14" ry="22" fill="#7A3A2A" opacity=".55"/><ellipse cx="14" cy="0" rx="14" ry="22" fill="#7A3A2A" opacity=".55"/><ellipse cx="0" cy="-14" rx="22" ry="14" fill="#7A3A2A" opacity=".55"/><ellipse cx="0" cy="14" rx="22" ry="14" fill="#7A3A2A" opacity=".55"/></g>`; }
    let kerut = ""; const kk = 1 - k; if (kk > 0.05) for (let i = 0; i < 7; i++) { const xx = -ww + 60 + i * ((ww * 2 - 120) / 6); kerut += `<path d="M${f1(xx)} ${-hh + 30} q${f1(16 * kk)} ${f1(hh * 0.5)} 0 ${f1(hh)} q${f1(-16 * kk)} ${f1(hh * 0.5)} 0 ${f1(hh * 0.9)}" stroke="#8A4A2E" stroke-width="${f1(5 + 6 * kk)}" fill="none" opacity="${f2(0.6 * kk)}" stroke-linecap="round"/>`; }
    return g(x, y, s, `<defs><clipPath id="${id}"><path d="${badan}"/></clipPath></defs><ellipse cx="0" cy="${f1(hh + 30)}" rx="${ww + 30}" ry="24" fill="#000" opacity=".2"/><path d="${badan}" fill="#E8B062"/><g clip-path="url(#${id})">${mot}${kerut}<rect x="${-ww - 10}" y="${f1(hh * 0.2)}" width="${ww * 2 + 20}" height="${hh}" fill="#B87A3A" opacity=".25"/></g>${o.mata ? A.mata(-40, -10, 0.9, o.mata, o.lihat || 0) : ""}`, o.rot || 0);
  }
  function kapas(x, y, s, t = 0) {
    return g(x, y, s, [[-30, 0, 34], [10, -14, 40], [44, 6, 30], [0, 22, 30], [-46, 18, 22]].map(([a, b, r], i) => `<circle cx="${a}" cy="${f1(b + Math.sin(t * 3 + i) * 3)}" r="${r}" fill="#FFFFFF"/><circle cx="${a - 6}" cy="${b - 8}" r="${f1(r * 0.4)}" fill="#F2F6FA"/>`).join(""));
  }

  // ---------- ban motor (generik, tanpa merek) ----------
  function banMotor(x, y, R, t = 0, o = {}) {
    const pt = o.putar ?? t * 220;
    let tapak = ""; const n = 26;
    for (let i = 0; i < n; i++) { const a = (i / n) * 360; tapak += `<g transform="rotate(${f1(a)})"><path d="M-14 ${-R} L14 ${-R} L22 ${-R + 46} L-22 ${-R + 46}Z" fill="#2A2A30" transform="rotate(${i % 2 ? 14 : -14} 0 ${-R + 22})"/></g>`; }
    let s = `<ellipse cx="0" cy="${R + 6}" rx="${R * 0.9}" ry="18" fill="#000" opacity=".25"/><circle r="${R}" fill="#3A3A42"/><g transform="rotate(${f1(pt)})">${tapak}${[0, 60, 120, 180, 240, 300].map((a) => `<rect x="-8" y="${-R * 0.58}" width="16" height="${R * 0.58}" fill="#B9C0C8" transform="rotate(${a})"/>`).join("")}</g>
      <circle r="${R * 0.62}" fill="none" stroke="#9AA2AC" stroke-width="20"/><circle r="${R * 0.16}" fill="#C9D0D6"/><circle r="${R * 0.07}" fill="#5A626C"/><path d="M${-R * 0.8} ${-R * 0.55} A${R} ${R} 0 0 1 ${-R * 0.2} ${-R * 0.95}" stroke="#FFFFFF" stroke-width="8" fill="none" opacity=".18" stroke-linecap="round"/>`;
    if (o.spakbor !== 0) s += `<path d="M${-R * 1.1} ${-R * 0.2} Q${-R * 1.05} ${-R * 1.25} 0 ${-R * 1.22} Q${R * 1.05} ${-R * 1.25} ${R * 1.1} ${-R * 0.2} L${R * 0.95} ${-R * 0.2} Q${R * 0.9} ${-R * 1.06} 0 ${-R * 1.06} Q${-R * 0.9} ${-R * 1.06} ${-R * 0.95} ${-R * 0.2}Z" fill="#1F8A8A"/>`;
    if (o.cipratan > 0) { const c = o.cipratan; for (let i = 0; i < 12; i++) { const q = (t * 2.2 + i / 12) % 1, ax = -R * 0.6 - q * R * 1.2, ay = R * 0.9 - Math.sin(Math.PI * q) * R * 0.7 - q * 30; s += `<ellipse cx="${f1(ax - i * 6)}" cy="${f1(ay)}" rx="${f1(10 - q * 5)}" ry="${f1(14 - q * 6)}" fill="#DFF3FA" opacity="${f2(c * (1 - q) * 0.9)}"/>`; } }
    return `<g transform="translate(${f1(x)} ${f1(y)})">${s}</g>`;
  }
  function ubinBasah(w, y, h, t = 0) {
    let s = `<rect x="-40" y="${y}" width="${w + 80}" height="${h}" fill="#7FB8C0"/>`;
    for (let x = 0; x < w + 40; x += 160) s += `<rect x="${x}" y="${y}" width="5" height="${h}" fill="#5E98A2"/>`;
    for (let yy = y; yy < y + h; yy += 160) s += `<rect x="-40" y="${yy}" width="${w + 80}" height="5" fill="#5E98A2"/>`;
    for (let i = 0; i < 8; i++) s += `<ellipse cx="${f1(80 + i * 140 + Math.sin(i * 3) * 30)}" cy="${f1(y + 60 + (i % 3) * 110)}" rx="${40 + (i % 3) * 16}" ry="12" fill="#DFF8FA" opacity="${f2(0.35 + 0.15 * Math.sin(t * 2 + i))}"/>`;
    return s;
  }

  // ---------- meja percobaan ----------
  function kelereng(x, y, r, warna = "#3E8FD0", o = {}) {
    const id = uid("kl");
    return `<defs><radialGradient id="${id}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset=".25" stop-color="${warna}"/><stop offset="1" stop-color="#1E2A40"/></radialGradient></defs><circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="url(#${id})"/>
      <path d="M${f1(x - r * 0.5)} ${f1(y + r * 0.1)} q${f1(r * 0.5)} ${f1(-r * 0.6)} ${f1(r)} 0" stroke="#FFFFFF" stroke-width="${f1(r * 0.16)}" fill="none" opacity=".5"/>${o.basah ? `<ellipse cx="${f1(x + r * 0.35)}" cy="${f1(y + r * 0.45)}" rx="${f1(r * 0.18)}" ry="${f1(r * 0.24)}" fill="#E6FBFF" opacity=".95"/><circle cx="${f1(x - r * 0.45)}" cy="${f1(y + r * 0.5)}" r="${f1(r * 0.12)}" fill="#E6FBFF" opacity=".9"/>` : ""}`;
  }
  function mangkuk(x, y, s, o = {}) {
    const c = o.warna || "#F4EEDC", cg = o.warnaG || "#D9CDB2";
    if (o.depan) return g(x, y, s, `<path d="M-160 -60 Q-150 60 0 70 Q150 60 160 -60Z" fill="${c}"/><path d="M-160 -60 Q0 -30 160 -60" stroke="${cg}" stroke-width="10" fill="none"/><path d="M-120 -30 Q-100 30 -40 50" stroke="#FFFFFF" stroke-width="10" opacity=".4" fill="none" stroke-linecap="round"/>`);
    return g(x, y, s, `<ellipse cx="0" cy="76" rx="170" ry="20" fill="#000" opacity=".18"/><ellipse cx="0" cy="-60" rx="160" ry="34" fill="${cg}"/><ellipse cx="0" cy="-56" rx="140" ry="24" fill="${o.isi || "#9AD8E0"}" opacity="${o.isi ? 1 : 0.7}"/>`);
  }
  function stopwatchPolos(x, y, s, t = 0, o = {}) {
    const a = (o.sudut ?? t * (o.laju || 360)) * Math.PI / 180;
    return g(x, y, s, `<ellipse cx="0" cy="120" rx="90" ry="14" fill="#000" opacity=".15"/><rect x="-22" y="-150" width="44" height="34" rx="8" fill="#5A626C"/><rect x="-36" y="-170" width="72" height="22" rx="10" fill="#8A929C"/><circle r="120" fill="#E2E8EC"/><circle r="100" fill="#FFFFFF"/>
      ${[...Array(12)].map((_, i) => `<rect x="-4" y="-94" width="8" height="${i % 3 ? 12 : 22}" rx="4" fill="#9AA2AC" transform="rotate(${i * 30})"/>`).join("")}<path d="M0 0 L${f1(Math.sin(a) * 82)} ${f1(-Math.cos(a) * 82)}" stroke="#E2232E" stroke-width="9" stroke-linecap="round"/><circle r="10" fill="#1E1E1E"/>`);
  }
  function balokKayu(x, y, s, rot = 0, warna = "#D9A35E") { return g(x, y, s, `<rect x="-34" y="-34" width="68" height="68" rx="8" fill="${warna}"/><rect x="-34" y="-34" width="68" height="16" rx="6" fill="#FFFFFF" opacity=".25"/><rect x="14" y="-34" width="20" height="68" rx="6" fill="#000" opacity=".12"/>`, rot); }
  // ikon ujung jari kecil (untuk piring timbangan / lencana)
  function ikonJari(x, y, s, keriput = 1, o = {}) {
    let k = ""; if (keriput) for (let i = 0; i < 4; i++) k += `<path d="M${-27 + i * 18} -96 q8 16 0 30 q-8 16 0 30" stroke="${KERUT}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    return g(x, y, s, `${o.lencana ? `<circle cx="0" cy="-40" r="112" fill="#FFF4DC"/><circle cx="0" cy="-40" r="112" fill="none" stroke="${o.lencana}" stroke-width="12"/>` : ""}<rect x="-50" y="-120" width="100" height="160" rx="50" fill="${KUL}"/><rect x="20" y="-100" width="22" height="130" rx="11" fill="${KULG}" opacity=".6"/>${k}`);
  }
  function siluetJasLab(x, y, s, t = 0, o = {}) {
    const ar = o.arah ?? 1, bc = o.bicara ? Math.sin(t * 9) * 8 : 0;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s * ar)} ${f2(s)})"><ellipse cx="0" cy="8" rx="130" ry="18" fill="#000" opacity=".2"/>
      <path d="M-110 0 L-96 -420 Q0 -470 96 -420 L110 0Z" fill="#F4F4F0"/><path d="M0 -460 L-30 -300 L0 -250 L30 -300Z" fill="#3E6A8A"/><path d="M0 -440 L0 0" stroke="#D9DCD6" stroke-width="6"/>
      <path d="M90 -410 Q170 ${-330 - bc} 190 ${-460 - bc * 2}" stroke="#F4F4F0" stroke-width="44" fill="none" stroke-linecap="round"/><circle cx="192" cy="${f1(-474 - bc * 2)}" r="24" fill="${KULG}"/>
      <rect x="-24" y="-510" width="48" height="56" rx="16" fill="${KULG}"/><ellipse cx="0" cy="-580" rx="70" ry="78" fill="${KULG}"/><path d="M-72 -590 Q-70 -670 0 -664 Q70 -670 72 -590 Q40 -630 0 -626 Q-40 -630 -72 -590Z" fill="#2A2A34"/></g>`;
  }
  function gelembungCoret(x, y, s, t = 0, k = 1) {
    if (k <= 0) return "";
    let c = ""; for (let i = 0; i < 3; i++) { const yy = -40 + i * 34; c += `<path d="M-90 ${yy} ${[...Array(8)].map((_, j) => `q11 ${f1(-14 - 6 * Math.sin(t * 8 + j + i))} 22 0`).join(" ")}" stroke="#3E4A5A" stroke-width="7" fill="none" stroke-linecap="round"/>`; }
    return g(x, y, s * (0.7 + 0.3 * k), `<g opacity="${f2(Math.min(1, k * 2))}"><path d="M-130 -90 Q-130 -120 -100 -120 L100 -120 Q130 -120 130 -90 L130 50 Q130 80 100 80 L10 80 L-30 130 L-30 80 L-100 80 Q-130 80 -130 50Z" fill="#FFFFFF"/>${c}</g>`);
  }

  // ---------- kartu pilihan (kubu) ----------
  function kartuPilihan(x, y, s, teks, isi, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    const c = o.warna || "#1F8A8A";
    return `<g transform="translate(${f1(x)} ${f1(y + (1 - k) * 220)}) rotate(${f1((o.rot || 0) * k)}) scale(${f2(s * (0.7 + 0.3 * k))})" opacity="${f2(Math.min(1, k * 2))}"><rect x="-140" y="-200" width="280" height="380" rx="30" fill="#000" opacity=".25" transform="translate(10 14)"/><rect x="-140" y="-200" width="280" height="380" rx="30" fill="#FFF4DC"/>
      <rect x="-120" y="-180" width="240" height="240" rx="20" fill="${c}"/><g transform="translate(0 -60)">${isi}</g><text y="140" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${teks.length > 5 ? 50 : 56}" fill="#1E1E1E">${teks}</text></g>`;
  }
  function sungaiKampung(x, y, s, t = 0) {
    let s2 = `<rect x="-120" y="-120" width="240" height="240" fill="#8FD0A8"/><path d="M-120 -40 Q-40 -60 0 -20 Q60 30 120 10 L120 120 L-120 120Z" fill="#3E9AB8"/>`;
    for (let i = 0; i < 4; i++) { const q = (t * 0.6 + i / 4) % 1; s2 += `<path d="M${f1(-100 + q * 200)} ${f1(40 + i * 18)} q14 -6 28 0" stroke="#CFF4FA" stroke-width="5" fill="none" opacity="${f2(Math.sin(Math.PI * q))}"/>`; }
    s2 += `<ellipse cx="-70" cy="-60" rx="40" ry="24" fill="#5E8A5A"/><ellipse cx="80" cy="-80" rx="50" ry="30" fill="#4E7A4A"/><ellipse cx="40" cy="70" rx="24" ry="10" fill="#7D7068"/>`;
    for (let i = 0; i < 2; i++) { const by = Math.abs(Math.sin(t * 5 + i * 2)) * 10, bx = -30 + i * 60; s2 += `<circle cx="${bx}" cy="${f1(10 - by)}" r="16" fill="#7A4A30"/><path d="M${bx - 18} ${f1(26 - by)} Q${bx} ${f1(14 - by)} ${bx + 18} ${f1(26 - by)}" fill="#7A4A30"/>${[0, 1, 2].map((j) => `<circle cx="${bx - 20 + j * 20}" cy="${f1(-6 - by - j * 4 - Math.abs(Math.sin(t * 7 + j)) * 14)}" r="5" fill="#E6FBFF"/>`).join("")}`; }
    return g(x, y, s, s2);
  }
  function miniBak(x, y, s, t = 0) {
    return g(x, y, s, `<rect x="-120" y="-120" width="240" height="240" fill="#7FC9C6"/>${[0, 60, 120, 180].map((a) => `<rect x="${-120 + a}" y="-120" width="3" height="240" fill="#6AB0AE"/>`).join("")}<rect x="-120" y="0" width="240" height="120" fill="#E8F4F2"/><rect x="-100" y="10" width="200" height="30" fill="#4ABAC4"/>${gayung(30, -10, 0.45, -8)}`);
  }
  function miniEmber(x, y, s, t = 0) { return g(x, y, s, `<rect x="-120" y="-120" width="240" height="240" fill="#F2C76A"/>${emberCucian(0, 90, 0.62, t)}`); }

  // ---------- lorong rumah + pintu kamar mandi ----------
  function lorongRumah(w, h, t = 0, o = {}) {
    const px = o.pintuX ?? 260, bk = cl(o.buka || 0), lt = o.lantai ?? 1380;
    let s = `<rect x="-40" y="-40" width="${w + 80}" height="${h + 80}" fill="#E9D6B4"/><rect x="-40" y="${lt - 260}" width="${w + 80}" height="260" fill="#C9A77A"/><rect x="-40" y="${lt - 270}" width="${w + 80}" height="14" fill="#A8855A"/>`;
    s += `<rect x="-40" y="${lt}" width="${w + 80}" height="${h - lt + 40}" fill="#B98A5A"/>${[...Array(10)].map((_, i) => `<rect x="${i * 160}" y="${lt}" width="6" height="${h - lt}" fill="#000" opacity=".1"/>`).join("")}`;
    // bingkai foto keluarga polos
    s += `<rect x="${w - 330}" y="${lt - 900}" width="200" height="150" rx="10" fill="#8A5A34"/><rect x="${w - 316}" y="${lt - 886}" width="172" height="122" rx="6" fill="#BFD8D0"/><circle cx="${w - 260}" cy="${lt - 836}" r="22" fill="#E8B88A"/><circle cx="${w - 200}" cy="${lt - 830}" r="18" fill="#E8B88A"/>`;
    // pintu kamar mandi
    const dw = 330, dh = 760, dx = px - dw / 2, dy = lt - dh;
    s += `<rect x="${dx - 22}" y="${dy - 22}" width="${dw + 44}" height="${dh + 22}" fill="#8A5A34"/><rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" fill="#F4FFFE"/>`;
    s += `<rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" fill="#DFF4F2"/>`;
    const ww = dw * (1 - 0.8 * bk);
    s += `<rect x="${dx}" y="${dy}" width="${f1(ww)}" height="${dh}" fill="#3E7A8A"/><rect x="${dx + 30 * (1 - bk)}" y="${dy + 40}" width="${f1(ww - 60 * (1 - bk))}" height="300" rx="10" fill="#357080" opacity="${f2(1 - bk)}"/><rect x="${dx + 30 * (1 - bk)}" y="${dy + 400}" width="${f1(ww - 60 * (1 - bk))}" height="300" rx="10" fill="#357080" opacity="${f2(1 - bk)}"/><circle cx="${f1(dx + ww - 40)}" cy="${dy + 400}" r="16" fill="#E8C65A" opacity="${f2(1 - bk)}"/>`;
    s += `<rect x="${dx + 60}" y="${dy - 120}" width="210" height="70" rx="12" fill="#FFF4DC"/>${gayung(px, dy - 70, 0.22, 0)}`;
    return s;
  }
  function jamDinding(x, y, s, t = 0, laju = 1) {
    const am = t * 360 * laju * 0.25 * Math.PI / 180, aj = am / 12;
    return g(x, y, s, `<circle r="90" fill="#8A5A34"/><circle r="76" fill="#FFF4DC"/>${[...Array(12)].map((_, i) => `<rect x="-3" y="-70" width="6" height="12" fill="#8A5A34" transform="rotate(${i * 30})"/>`).join("")}<path d="M0 0 L${f1(Math.sin(am) * 60)} ${f1(-Math.cos(am) * 60)}" stroke="#1E1E1E" stroke-width="7" stroke-linecap="round"/><path d="M0 0 L${f1(Math.sin(aj) * 40)} ${f1(-Math.cos(aj) * 40)}" stroke="#1E1E1E" stroke-width="10" stroke-linecap="round"/><circle r="8" fill="#E2232E"/>`);
  }
  function uap(x, y, s, t = 0, k = 1) {
    if (k <= 0) return "";
    let o = ""; for (let i = 0; i < 10; i++) { const q = (t * 0.35 + i / 10) % 1, cx = Math.sin(i * 2.3) * 140 + q * 60, cy = -q * 500, r = 60 + q * 120; o += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="#FFFFFF" opacity="${f2(k * 0.45 * Math.sin(Math.PI * q))}"/>`; }
    return g(x, y, s, o);
  }
  function orangAntre(x, y, s, t = 0, o = {}) {
    const ket = Math.max(0, Math.sin(t * 8 + (o.fase || 0))) * 10;
    let s2 = A.orang(0, -ket * 0, 1, A.PALET.siang, t, { baju: o.baju || "#5FB37A", bajuG: o.bajuG || "#4E9A68", celana: o.celana || "#7A3A5A", kulit: o.kulit, rambut: o.rambut, kebaya: o.sarung, tangan: o.tangan || "turun", pegang: o.pegang });
    s2 += `<path d="M-84 -470 Q-30 -440 0 -500 Q30 -440 84 -470 L76 -380 Q40 -410 0 -360 Q-40 -410 -76 -380Z" fill="${o.handuk || "#FFF4DC"}"/>`;
    s2 += `<ellipse cx="${o.kaki || 40}" cy="${f1(-4 - ket)}" rx="34" ry="12" fill="#3A2A2A"/>`;
    return g(x, y, s, s2);
  }

  Object.assign(A, { airBak, dindingKeramik, tepiBak, ujungJari, titikJari, tetesMengalir, benangDalang, palangDalang, gayung, spons, capX, emberCucian, orangHanduk, jalurSaraf, tanganRendam,
    penampangJari, sarungBantal, kapas, banMotor, ubinBasah, kelereng, mangkuk, stopwatchPolos, balokKayu, ikonJari, siluetJasLab, gelembungCoret, kartuPilihan, sungaiKampung, miniBak, miniEmber,
    lorongRumah, jamDinding, uap, orangAntre, JARI_L: L });
})(typeof window !== "undefined" ? window : globalThis);
