/* ASET BARCODE KASIR (Yoga, 23 Nov 2026; dipakai A3-01 "Barcode kasir: harganya di mana?"). Muat SETELAH aset-set.js.
 * Gaya: datar tanpa garis hitam, dunia putih-krem + aksen merah, teks/angka hanya lewat kode. SEMUA FIKTIF: pola garis acak (bukan
 * pengodean EAN), deret angka dengan digit cek SALAH → tidak bisa dipindai sebagai produk nyata. Tanpa merek, tanpa logo, tanpa "Rp".
 *  polaBar(benih,n) → {w:[lebar modul…], total} (indeks genap = garis hitam) · posBar(pola,i,W) → x tengah garis ke-i (0..W)
 *  barcodeFiktif(x,y,W,H,{benih,angka,kedip,leleh,sorot,label,t}) — label putih + garis; x,y = pojok kiri atas area garis
 *  bungkusMie(x,y,s,t,{rot,wajah:{k,senyum,kaget},bc:{…opsi barcode},lengan:k}) — bungkus polos tanpa tulisan; MIE_BC = posisi barcode lokal
 *  scannerGenggam(x,y,s,rot,t,{sinar,panjang,nyala,tangan}) — scanner genggam generik; (x,y) = jendela depan, sinar ke +x lokal
 *  layarKasir(x,y,s,t,{harga,hargaBaru,flip,k,nama}) — monitor kasir; angka kartun tanpa mata uang
 *  mejaKasirSiang(w,h,t,{meja,rakA}) — dinding krem, pita merah, rak buram tanpa tulisan, meja kasir merah-putih, ban berjalan
 *  komputerToko(x,y,s,t,{cari,senang,nyala}) — komputer toko ramah (wajah sederhana) · lemariDaftar(x,y,s,t,{buka:{i,k},sorot:{i,k},label:{i,teks},cari,kolom,baris})
 *  posLaci(x,y,s,i,{kolom,baris}) → [x,y] tengah laci · kartuNomor(x,y,s,d,{k,glow,rot}) · ktpBarang(x,y,s,{k}) (fiktif: foto kosong + titik-titik)
 *  gelembungPikir(x,y,s,isi,{k}) · kantongUang(s) · capSilang(x,y,s,k) · ledakanDiskon(x,y,s,t,k) · labelGanti(x,y,s,t,{flip,lama,baru})
 *  petaDunia(x,y,s,t,{pabrik}) (benua bulat tanpa batas negara) · ikonPabrik(x,y,s,k,t) · kartuKubu(x,y,s,teks,ikon,{k,rot,warna})
 *  hpPolos(x,y,s,t,{kirim}) · orangKasir(x,y,s,t,{k}) (tanpa wajah, celemek) */
(function (root) {
  const A = root.ASET;
  const f1 = (v) => Math.round(v * 10) / 10, f2 = (v) => Math.round(v * 100) / 100, cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const hal = (x) => { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const g = (x, y, s, isi, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})">${isi}</g>`;
  let _n = 0; const uid = (p) => `${p}K${++_n}`;
  const M = "#E2232E", MT = "#B5121D", MM = "#FF7A7A", PU = "#FFFFFF", KR = "#FCEBD5", KRG = "#EED3B0", HT = "#22232B", AB = "#4E5361", ABM = "#7D8392", ABT = "#C9CED6", KUL = "#F4C9A1", KULG = "#E3AE82", TL = "#1F8A8A";
  const C = { M, MT, MM, PU, KR, KRG, HT, AB, ABM, ABT };

  // ---------- pola garis fiktif ----------
  function polaBar(benih = 7, n = 40) {
    let s = benih; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const w = [1, 1, 1];
    for (let i = 0; i < n; i++) { if (i === Math.floor(n / 2)) w.push(1, 1, 1, 1, 1); w.push(1 + Math.floor(r() * 3.3)); }
    if ((w.length + 3) % 2 === 0) w.push(1 + Math.floor(r() * 2));
    w.push(1, 1, 1);
    return { w, total: w.reduce((a, b) => a + b, 0) };
  }
  function posBar(p, i, W) { let x = 0; for (let k = 0; k < i; k++) x += p.w[k]; return ((x + p.w[i] / 2) / p.total) * W; }
  function barcodeFiktif(x, y, W, H, o = {}) {
    const p = o.pola || polaBar(o.benih || 7), u = W / p.total, t = o.t || 0;
    let s = "";
    if (o.label !== false) s += `<rect x="${f1(x - u * 9)}" y="${f1(y - u * 6)}" width="${f1(W + u * 18)}" height="${f1(H + u * (o.angka ? 26 : 12))}" rx="${f1(u * 4)}" fill="${PU}"/>`;
    let cx = x; const lel = o.leleh || 0;
    for (let i = 0; i < p.w.length; i++) {
      const w = p.w[i] * u;
      if (i % 2 === 0) {
        const guard = i < 3 || i >= p.w.length - 3;
        const hh = H + (guard && o.angka ? u * 6 : 0);
        const kd = o.kedip ? 0.55 + 0.45 * Math.abs(Math.sin(t * 9 + i * 1.7)) : 1;
        const jatuh = lel * (H * 0.6 + ((i * 37) % 11) * u * 3), susut = 1 - lel * 0.75;
        s += `<rect x="${f1(cx)}" y="${f1(y + jatuh)}" width="${f1(w)}" height="${f1(hh * susut)}" fill="${o.warna || HT}" opacity="${f2(kd * (1 - lel * 0.9))}"/>`;
        if (o.sorot === i) s += `<rect x="${f1(cx - u)}" y="${f1(y - u)}" width="${f1(w + 2 * u)}" height="${f1(hh + 2 * u)}" fill="none" stroke="${M}" stroke-width="${f1(u * 0.9)}" rx="${f1(u)}"/>`;
      }
      cx += w;
    }
    if (o.angka) {
      const d = o.angka.split(""), fs = u * 9.5;
      const pos = d.map((_, i) => (i === 0 ? x - u * 6 : i <= 6 ? x + u * 3 + (i - 0.5) * (W / 2 - u * 6) / 6 : x + W / 2 + u * 2 + (i - 6.5) * (W / 2 - u * 6) / 6));
      s += d.map((c, i) => `<text x="${f1(pos[i])}" y="${f1(y + H + u * 13)}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="${f1(fs)}" fill="${HT}" opacity="${f2(1 - lel)}">${c}</text>`).join("");
    }
    return s;
  }

  // ---------- bungkus mie polos ----------
  const MIE_BC = { x: 20, y: 18, w: 150, h: 70 };
  function bungkusMie(x, y, s, t, o = {}) {
    let q = `<ellipse cx="0" cy="168" rx="200" ry="22" fill="#000" opacity=".14"/>`;
    q += `<path d="M-210 -142 Q0 -158 210 -142 L218 0 L210 142 Q0 158 -210 142 L-218 0 Z" fill="${PU}"/>`;
    q += `<path d="M-210 -142 Q0 -158 210 -142 L212 -100 L-212 -100Z" fill="${KRG}" opacity=".8"/><path d="M-210 142 Q0 158 210 142 L212 100 L-212 100Z" fill="${KRG}" opacity=".8"/>`;
    for (let i = 0; i < 21; i++) { const xx = -210 + i * 21; q += `<path d="M${xx} -142 l10 -10 l11 10" fill="${PU}"/><path d="M${xx} 142 l10 10 l11 -10" fill="${PU}"/>`; }
    q += `<path d="M-214 -40 Q-60 -90 214 -20 L214 40 Q-40 -20 -214 30 Z" fill="${M}"/><path d="M-214 30 Q-40 -20 214 40 L214 52 Q-40 -6 -214 44Z" fill="${MT}"/>`;
    // ikon mangkuk mie (tanpa tulisan)
    q += `<g transform="translate(-110 50)"><path d="M-62 0 Q-62 52 0 56 Q62 52 62 0Z" fill="#FFC93C"/><path d="M-62 0 L62 0" stroke="#E5A91A" stroke-width="8"/>${[0, 1, 2].map((i) => `<path d="M${-36 + i * 24} -4 q8 -22 0 -40 q-8 -18 2 -36" stroke="#F3D58A" stroke-width="7" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
    q += `<path d="M-180 -120 Q-60 -132 120 -124" stroke="${PU}" stroke-width="14" opacity=".5" fill="none" stroke-linecap="round"/>`;
    // barcode
    q += barcodeFiktif(MIE_BC.x, MIE_BC.y, MIE_BC.w, MIE_BC.h, { benih: 11, t, ...(o.bc || {}) });
    // wajah (canda)
    const wj = o.wajah;
    if (wj && wj.k > 0) {
      const kg = wj.kaget || 0, sn = wj.senyum ?? 1, kd = Math.abs(Math.sin(t * 0.9)) > 0.985 ? 0.15 : 1;
      q += `<g opacity="${f2(wj.k)}" transform="translate(${f1(wj.x ?? 90)} -86)"><ellipse cx="-34" cy="0" rx="${f1(11 + 5 * kg)}" ry="${f1((14 + 6 * kg) * kd)}" fill="${HT}"/><ellipse cx="34" cy="0" rx="${f1(11 + 5 * kg)}" ry="${f1((14 + 6 * kg) * kd)}" fill="${HT}"/><circle cx="-30" cy="-5" r="4" fill="${PU}"/><circle cx="38" cy="-5" r="4" fill="${PU}"/>
       ${kg > 0.5 ? `<ellipse cx="0" cy="34" rx="12" ry="15" fill="${MT}"/>` : `<path d="M-20 26 Q0 ${f1(26 + 18 * sn)} 20 26" stroke="${HT}" stroke-width="7" fill="none" stroke-linecap="round"/>`}
       <ellipse cx="-56" cy="22" rx="12" ry="7" fill="${MM}" opacity=".6"/><ellipse cx="56" cy="22" rx="12" ry="7" fill="${MM}" opacity=".6"/></g>`;
    }
    if (o.lengan > 0) { // lengan kecil kanan mengangkat kartu
      const k = o.lengan; q += `<path d="M200 -30 Q${f1(240 + 30 * k)} ${f1(-60 - 60 * k)} ${f1(250 + 40 * k)} ${f1(-110 - 90 * k)}" stroke="${KRG}" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="${f1(250 + 40 * k)}" cy="${f1(-110 - 90 * k)}" r="16" fill="${KRG}"/>`;
    }
    return g(x, y, s, q, o.rot || 0);
  }

  // ---------- scanner genggam generik ----------
  function scannerGenggam(x, y, s, rot, t, o = {}) {
    const id = uid("sc"), L = o.panjang || 520, sn = cl(o.sinar || 0);
    let q = "";
    if (sn > 0) {
      const lebar = 46 + 16 * Math.sin(t * 30);
      q += `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#FF3B3B" stop-opacity=".75"/><stop offset="1" stop-color="#FF3B3B" stop-opacity=".05"/></linearGradient></defs>
      <path d="M0 -14 L${L} ${f1(-lebar)} L${L} ${f1(lebar)} L0 14Z" fill="url(#${id})" opacity="${f2(sn)}"/><line x1="0" y1="0" x2="${L}" y2="0" stroke="#FF5A5A" stroke-width="5" opacity="${f2(sn)}"/>`;
    }
    if (o.tangan) q += `<path d="M-150 60 Q-170 220 -260 420" stroke="${KUL}" stroke-width="74" fill="none" stroke-linecap="round"/><path d="M-150 60 Q-170 220 -260 420" stroke="${KULG}" stroke-width="20" fill="none" stroke-linecap="round" opacity=".5" transform="translate(22 0)"/>`;
    q += `<path d="M-200 -46 Q-210 -50 -206 40 L-190 52 L-40 48 Q0 46 6 30 L10 -30 Q4 -50 -30 -52Z" fill="${AB}"/>`;
    q += `<path d="M-170 40 L-120 40 L-96 210 Q-100 232 -128 232 L-150 230 Q-172 226 -170 200Z" fill="${AB}"/><path d="M-160 50 L-128 50 L-110 200" stroke="${ABM}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>`;
    q += `<path d="M-190 -36 L-40 -40" stroke="${ABM}" stroke-width="12" stroke-linecap="round" opacity=".7"/><rect x="-6" y="-30" width="16" height="60" rx="6" fill="${o.nyala ? "#FF4D4D" : MT}"/>`;
    if (o.nyala) q += `<circle cx="4" cy="0" r="30" fill="#FF4D4D" opacity="${f2(0.35 * o.nyala)}"/>`;
    q += `<rect x="-120" y="22" width="40" height="18" rx="6" fill="#FFC93C" opacity=".9"/>`;
    if (o.tangan) q += `<path d="M-182 70 Q-200 110 -176 160 Q-150 200 -110 186 Q-90 150 -100 100 Q-120 60 -160 60Z" fill="${KUL}"/><path d="M-110 92 q24 6 26 24 q-2 16 -24 14" fill="${KUL}"/><path d="M-176 160 Q-150 196 -112 184" stroke="${KULG}" stroke-width="8" fill="none" opacity=".7"/>`;
    return g(x, y, s, q, rot);
  }

  // ---------- layar kasir ----------
  function layarKasir(x, y, s, t, o = {}) {
    const k = cl(o.k ?? 1), fl = hal(o.flip || 0), id = uid("lk");
    let q = `<rect x="-26" y="130" width="52" height="120" fill="${ABM}"/><rect x="-110" y="240" width="220" height="26" rx="12" fill="${AB}"/>`;
    q += `<rect x="-200" y="-150" width="400" height="290" rx="28" fill="${AB}"/><rect x="-178" y="-128" width="356" height="246" rx="16" fill="#123238"/>`;
    q += `<defs><clipPath id="${id}"><rect x="-178" y="-128" width="356" height="246" rx="16"/></clipPath></defs><g clip-path="url(#${id})">`;
    q += `<rect x="-178" y="-128" width="356" height="40" fill="#1B4A52"/>${[0, 1, 2].map((i) => `<circle cx="${-150 + i * 26}" cy="-108" r="7" fill="${["#FF7A7A", "#FFC93C", "#6FE3B0"][i]}" opacity=".8"/>`).join("")}`;
    const nm = cl(o.nama || 0);
    if (nm > 0) q += `<g opacity="${f2(nm)}" transform="translate(${f1(-30 * (1 - nm))} 0)"><rect x="-150" y="-70" width="60" height="44" rx="10" fill="#FFC93C"/><rect x="-78" y="-62" width="200" height="12" rx="6" fill="#BFE7EA"/><rect x="-78" y="-42" width="130" height="12" rx="6" fill="#7FB9C0"/></g>`;
    const teks = (h, yy, a) => `<text x="0" y="${f1(yy)}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="92" fill="#FFF4DC" opacity="${f2(a)}" letter-spacing="2">${h}</text>`;
    if (k > 0) {
      const sc = 0.6 + 0.4 * hal(k);
      q += `<g transform="translate(0 70) scale(${f2(sc)}) translate(0 -70)">`;
      if (o.hargaBaru) q += teks(o.harga, 80 - 150 * fl, k * (1 - fl)) + teks(o.hargaBaru, 80 + 150 * (1 - fl), fl);
      else q += teks(o.harga || "", 80, k);
      q += `</g>`;
      if (o.hargaBaru && fl > 0 && fl < 1) q += `<rect x="-178" y="-88" width="356" height="206" fill="#FFF4DC" opacity="${f2(0.25 * Math.sin(Math.PI * fl))}"/>`;
    }
    q += `</g><path d="M-170 -118 L-60 -118 L-150 100 L-170 100Z" fill="#FFFFFF" opacity=".05"/>`;
    return g(x, y, s, q);
  }

  // ---------- set meja kasir siang ----------
  function mejaKasirSiang(w, h, t, o = {}) {
    const my = o.meja || 1180, id = uid("mk");
    let q = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6EA"/><stop offset="1" stop-color="${KR}"/></linearGradient><filter id="${id}b"><feGaussianBlur stdDeviation="7"/></filter></defs>`;
    q += `<rect x="-400" y="-400" width="${w + 800}" height="${h + 800}" fill="url(#${id})"/>`;
    // rak buram (kotak-kotak warna tanpa tulisan)
    let rak = "";
    const warna = ["#F2A7A0", "#FFD98A", "#A8D8C8", "#F7C6A3", "#E2232E", "#FFFFFF", "#9FC3E8"];
    for (let r = 0; r < 3; r++) {
      const yy = 330 + r * 230;
      rak += `<rect x="-200" y="${yy + 150}" width="${w + 400}" height="22" fill="${KRG}"/>`;
      for (let i = 0; i < 26; i++) { const ww = 52 + ((i * 7 + r * 3) % 4) * 14, hh = 90 + ((i * 5 + r) % 3) * 22; rak += `<rect x="${-160 + i * 66 + (r % 2) * 20}" y="${yy + 150 - hh}" width="${ww}" height="${hh}" rx="8" fill="${warna[(i + r * 2) % warna.length]}" opacity=".85"/>`; }
    }
    q += `<g filter="url(#${id}b)" opacity="${o.rakA ?? 0.75}">${rak}</g>`;
    q += `<rect x="-400" y="250" width="${w + 800}" height="34" fill="${M}" opacity=".9"/><rect x="-400" y="284" width="${w + 800}" height="10" fill="${MT}" opacity=".6"/>`;
    for (let i = 0; i < 5; i++) { const xx = 100 + i * 300 + Math.sin(t * 0.3 + i) * 20; q += `<path d="M${xx} -100 L${xx + 140} -100 L${xx + 380} ${my} L${xx + 160} ${my}Z" fill="#FFFFFF" opacity=".12"/>`; }
    // meja kasir
    q += `<rect x="-400" y="${my}" width="${w + 800}" height="70" fill="#F6F1EA"/><rect x="-400" y="${my + 62}" width="${w + 800}" height="14" fill="${KRG}"/>`;
    q += `<rect x="-400" y="${my + 76}" width="${w + 800}" height="${h - my + 400}" fill="${M}"/><rect x="-400" y="${my + 76}" width="${w + 800}" height="26" fill="${MT}" opacity=".7"/>`;
    for (let i = 0; i < 8; i++) q += `<rect x="${-300 + i * 260}" y="${my + 150}" width="150" height="${h}" rx="20" fill="${MT}" opacity=".25"/>`;
    // ban berjalan di kiri
    const bw = o.banW || 560;
    q += `<rect x="-400" y="${my - 10}" width="${bw + 400}" height="48" rx="20" fill="#3A3D47"/>`;
    for (let i = 0; i < 16; i++) { const xx = -380 + ((i * 70 + t * 60) % (bw + 380)); q += `<rect x="${f1(xx)}" y="${my - 2}" width="10" height="32" rx="4" fill="#565A66"/>`; }
    return q;
  }

  // ---------- komputer toko & lemari daftar ----------
  function komputerToko(x, y, s, t, o = {}) {
    const cr = o.cari || 0, sn = o.senang || 0, lx = cr ? Math.sin(t * 6) * 14 * cr : 0;
    let q = `<ellipse cx="0" cy="270" rx="260" ry="26" fill="#000" opacity=".12"/>`;
    q += `<rect x="-40" y="150" width="80" height="90" fill="${ABM}"/><rect x="-150" y="232" width="300" height="34" rx="14" fill="${AB}"/>`;
    q += `<rect x="-250" y="-200" width="500" height="370" rx="40" fill="#EDEFF3"/><rect x="-220" y="-170" width="440" height="300" rx="26" fill="${o.nyala === 0 ? "#2B3340" : "#1D5C63"}"/>`;
    q += `<rect x="-220" y="${f1(-170 + ((t * 120) % 300))}" width="440" height="14" fill="#7FE6E0" opacity="${f2(0.35 * cr)}"/>`;
    const mY = -40;
    q += `<ellipse cx="${f1(-80 + lx)}" cy="${mY}" rx="26" ry="${f1(sn > 0.5 ? 10 : 34)}" fill="#FFF4DC"/><ellipse cx="${f1(80 + lx)}" cy="${mY}" rx="26" ry="${f1(sn > 0.5 ? 10 : 34)}" fill="#FFF4DC"/>`;
    q += `<path d="M-60 60 Q0 ${f1(80 + 40 * sn)} 60 60" stroke="#FFF4DC" stroke-width="14" fill="none" stroke-linecap="round"/>`;
    q += `<rect x="-200" y="290" width="400" height="60" rx="16" fill="#DADDE3"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${-180 + i * 52}" y="302" width="40" height="16" rx="5" fill="#B6BAC4"/><rect x="${-180 + i * 52}" y="324" width="40" height="16" rx="5" fill="#B6BAC4"/>`).join("")}`;
    return g(x, y, s, q);
  }
  function posLaci(x, y, s, i, o = {}) {
    const ko = o.kolom || 3, c = i % ko, r = Math.floor(i / ko), lw = 480 / ko;
    return [x + s * (-240 + lw * (c + 0.5)), y + s * (-420 + 20 + 128 * r + 54)];
  }
  function lemariDaftar(x, y, s, t, o = {}) {
    const ko = o.kolom || 3, ba = o.baris || 6, lw = 480 / ko;
    let q = `<ellipse cx="0" cy="${-420 + 40 + 128 * ba + 26}" rx="300" ry="26" fill="#000" opacity=".12"/>`;
    q += `<rect x="-270" y="-450" width="540" height="${60 + 128 * ba}" rx="24" fill="${MT}"/><rect x="-256" y="-436" width="512" height="${32 + 128 * ba}" rx="16" fill="#8F0E17"/>`;
    const buka = o.buka || {}, sorot = o.sorot || {}, lab = o.label || {};
    let atas = "";
    for (let i = 0; i < ko * ba; i++) {
      const c = i % ko, r = Math.floor(i / ko), xx = -240 + lw * c + 6, yy = -420 + 20 + 128 * r;
      const cari = o.cari != null && Math.abs(((o.cari % (ko * ba)) + ko * ba) % (ko * ba) - i) < 0.6 ? 1 : 0;
      const bk = buka.i === i ? hal(buka.k || 0) : 0, so = sorot.i === i ? cl(sorot.k || 0) : 0;
      let d = `<rect x="${xx}" y="${yy}" width="${lw - 12}" height="108" rx="12" fill="${cari ? "#FFE3A0" : "#F4EDE4"}"/><rect x="${xx}" y="${yy + 84}" width="${lw - 12}" height="24" rx="10" fill="${KRG}" opacity=".7"/>`;
      d += `<rect x="${xx + (lw - 12) / 2 - 34}" y="${yy + 62}" width="68" height="14" rx="7" fill="${ABM}"/>`;
      if (lab.i === i) d += `<rect x="${xx + (lw - 12) / 2 - 62}" y="${yy + 10}" width="124" height="46" rx="8" fill="${PU}"/><text x="${xx + (lw - 12) / 2}" y="${yy + 47}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="40" fill="${HT}">${lab.teks}</text>`;
      else d += `<rect x="${xx + (lw - 12) / 2 - 50}" y="${yy + 18}" width="100" height="30" rx="6" fill="${PU}" opacity=".9"/>${[0, 1, 2, 3].map((j) => `<circle cx="${xx + (lw - 12) / 2 - 30 + j * 20}" cy="${yy + 33}" r="5" fill="${ABT}"/>`).join("")}`;
      if (bk > 0 || so > 0) {
        const cx = xx + (lw - 12) / 2, cy = yy + 54, sc = 1 + 0.35 * bk;
        atas += `${so > 0 ? `<rect x="${xx - 18}" y="${yy - 18}" width="${lw + 24}" height="144" rx="22" fill="#FFC93C" opacity="${f2(0.55 * so * (0.75 + 0.25 * Math.sin(t * 8)))}"/>` : ""}<g transform="translate(${f1(cx)} ${f1(cy + 70 * bk)}) scale(${f2(sc)}) translate(${f1(-cx)} ${f1(-cy)})">${bk > 0 ? `<rect x="${xx + 8}" y="${yy + 100}" width="${lw - 28}" height="${f1(60 * bk)}" fill="#C9B89E"/>` : ""}${d}</g>`;
      } else q += d;
    }
    return g(x, y, s, q + atas);
  }
  function kartuNomor(x, y, s, d, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    const gl = o.glow || 0;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f2(s * (0.6 + 0.4 * hal(k)))})" opacity="${f2(Math.min(1, k * 2))}">${gl > 0 ? `<rect x="-58" y="-74" width="116" height="148" rx="22" fill="#FFC93C" opacity="${f2(0.6 * gl)}"/>` : ""}<rect x="-44" y="-58" width="88" height="116" rx="14" fill="#000" opacity=".15" transform="translate(6 8)"/><rect x="-44" y="-58" width="88" height="116" rx="14" fill="${PU}"/><rect x="-44" y="-58" width="88" height="18" rx="9" fill="${M}"/><text y="38" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="72" fill="${HT}">${d}</text></g>`;
  }
  function ktpBarang(x, y, s, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    const gl = o.glow || 0;
    let q = `<rect x="-130" y="-82" width="260" height="164" rx="18" fill="#000" opacity=".15" transform="translate(8 10)"/><rect x="-130" y="-82" width="260" height="164" rx="18" fill="#BFE3F0"/><rect x="-130" y="-82" width="260" height="30" rx="15" fill="#7CC3DD"/>`;
    q += `<rect x="-110" y="-38" width="74" height="96" rx="10" fill="${PU}"/><circle cx="-73" cy="-6" r="18" fill="${ABT}"/><path d="M-102 50 Q-73 14 -44 50Z" fill="${ABT}"/>`;
    q += `${gl > 0 ? `<rect x="-22" y="-36" width="140" height="34" rx="10" fill="#FFC93C" opacity="${f2(0.7 * gl)}"/>` : ""}${[0, 1, 2, 3, 4, 5].map((j) => `<circle cx="${-8 + j * 22}" cy="-19" r="7" fill="${AB}"/>`).join("")}`;
    q += `<rect x="-20" y="12" width="120" height="12" rx="6" fill="${PU}" opacity=".8"/><rect x="-20" y="36" width="84" height="12" rx="6" fill="${PU}" opacity=".8"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f2(s * (0.6 + 0.4 * hal(k)))})" opacity="${f2(Math.min(1, k * 2))}">${q}</g>`;
  }
  function kantongUang(s = 1) {
    return `<g transform="scale(${s})"><path d="M-30 -60 Q0 -40 30 -60 L18 -34 Q70 -6 66 40 Q60 74 0 76 Q-60 74 -66 40 Q-70 -6 -18 -34Z" fill="#E8B04A"/><path d="M-20 -36 L20 -36" stroke="#B9822A" stroke-width="10" stroke-linecap="round"/><circle cx="0" cy="22" r="26" fill="#FFD98A"/><circle cx="0" cy="22" r="15" fill="none" stroke="#B9822A" stroke-width="6"/></g>`;
  }
  function gelembungPikir(x, y, s, isi, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s * (0.5 + 0.5 * hal(k)))})" opacity="${f2(Math.min(1, k * 2))}"><g transform="translate(8 10)"><circle cx="${o.ekorX ?? 120}" cy="150" r="16" fill="#F2B3AA"/><circle cx="${(o.ekorX ?? 120) * 0.7}" cy="110" r="24" fill="#F2B3AA"/><ellipse cx="0" cy="0" rx="140" ry="110" fill="#F2B3AA"/><circle cx="-90" cy="-60" r="60" fill="#F2B3AA"/><circle cx="80" cy="-64" r="56" fill="#F2B3AA"/></g><circle cx="${o.ekorX ?? 120}" cy="150" r="16" fill="${PU}"/><circle cx="${(o.ekorX ?? 120) * 0.7}" cy="110" r="24" fill="${PU}"/><ellipse cx="0" cy="0" rx="140" ry="110" fill="${PU}"/><circle cx="-90" cy="-60" r="60" fill="${PU}"/><circle cx="80" cy="-64" r="56" fill="${PU}"/>${isi}</g>`;
  }
  function capSilang(x, y, s, k) {
    if (k <= 0) return "";
    const e = hal(k), sc = 1.5 - 0.5 * e;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-8) scale(${f2(s * sc)})" opacity="${f2(Math.min(1, k * 3))}"><path d="M-120 -150 L0 -40 L120 -150 L160 -110 L44 0 L160 110 L120 150 L0 40 L-120 150 L-160 110 L-44 0 L-160 -110Z" fill="${M}"/><path d="M-120 -150 L0 -40 L120 -150 L160 -110 L44 0 L160 110 L120 150 L0 40 L-120 150 L-160 110 L-44 0 L-160 -110Z" fill="none" stroke="${MT}" stroke-width="10" stroke-dasharray="18 14" opacity=".55"/></g>`;
  }
  function ledakanDiskon(x, y, s, t, k) {
    if (k <= 0) return "";
    const e = hal(k); let d = "";
    for (let i = 0; i < 28; i++) { const a = (i * Math.PI) / 14 + t * 0.6, r = i % 2 ? 120 : 190; d += `${i ? "L" : "M"}${f1(Math.cos(a) * r)} ${f1(Math.sin(a) * r)} `; }
    let sp = ""; for (let i = 0; i < 8; i++) { const a = i * 0.8 + t * 1.3, r = 230 + 20 * Math.sin(t * 5 + i); sp += `<circle cx="${f1(Math.cos(a) * r)}" cy="${f1(Math.sin(a) * r)}" r="${10 + (i % 3) * 5}" fill="${i % 2 ? "#FFC93C" : M}"/>`; }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s * (0.4 + 0.6 * e))})" opacity="${f2(Math.min(1, k * 2))}"><path d="${d}Z" fill="#FFC93C"/><path d="${d}Z" fill="${M}" transform="scale(.72)"/><circle r="64" fill="#FFF4DC"/><path d="M-26 -10 L0 -40 L26 -10 M0 -40 L0 34" stroke="${M}" stroke-width="16" fill="none" stroke-linecap="round" transform="rotate(180)"/>${sp}</g>`;
  }
  // kartu daftar (isi laci): strip nama + label harga (angka via kode)
  function labelGanti(x, y, s, t, o = {}) {
    const fl = hal(o.flip || 0), id = uid("lg");
    let q = `<rect x="-230" y="-150" width="460" height="300" rx="28" fill="#000" opacity=".15" transform="translate(10 12)"/><rect x="-230" y="-150" width="460" height="300" rx="28" fill="#F4EDE4"/>`;
    q += `<rect x="-200" y="-122" width="90" height="70" rx="14" fill="#FFC93C"/><rect x="-92" y="-112" width="250" height="18" rx="9" fill="${ABM}"/><rect x="-92" y="-82" width="170" height="18" rx="9" fill="${ABT}"/>`;
    q += `<defs><clipPath id="${id}"><rect x="-200" y="-30" width="400" height="150" rx="20"/></clipPath></defs><rect x="-200" y="-30" width="400" height="150" rx="20" fill="${PU}"/><g clip-path="url(#${id})">`;
    const tx = (h, yy, a, c) => `<text x="0" y="${f1(yy)}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="96" fill="${c}" opacity="${f2(a)}">${h}</text>`;
    q += tx(o.lama || "", 82 - 160 * fl, 1 - fl, HT) + tx(o.baru || "", 82 + 160 * (1 - fl), fl, M) + `</g>`;
    return g(x, y, s, q, o.rot || 0);
  }

  // ---------- peta dunia datar + pabrik ----------
  const BENUA = ["M-560 -230 Q-470 -300 -330 -270 Q-260 -200 -300 -110 Q-340 -60 -300 -20 Q-380 0 -420 -80 Q-520 -110 -560 -230Z",
    "M-300 20 Q-230 10 -200 80 Q-190 170 -250 260 Q-290 230 -300 140 Q-330 70 -300 20Z",
    "M-110 -250 Q-20 -300 60 -250 Q30 -200 -40 -190 Q-100 -200 -110 -250Z",
    "M-100 -150 Q0 -170 40 -110 Q70 0 20 110 Q-20 170 -50 100 Q-90 20 -140 -40 Q-150 -110 -100 -150Z",
    "M60 -260 Q260 -320 470 -240 Q520 -170 440 -110 Q380 -60 300 -40 Q220 -60 160 -110 Q80 -150 60 -260Z",
    "M280 -20 Q340 -30 380 10 Q350 40 300 30Z", "M320 60 Q400 40 470 70 Q440 100 360 100Z",
    "M380 140 Q470 120 520 170 Q500 240 420 230 Q370 200 380 140Z"];
  const TITIK_PABRIK = [[-430, -170], [-250, 150], [-30, -230], [-20, 20], [150, -170], [330, -150], [300, 0], [400, 80], [450, 180], [-360, -60], [230, -230], [40, -110]];
  function ikonPabrik(x, y, s, k, t = 0) {
    if (k <= 0) return "";
    const e = hal(k), kd = 0.85 + 0.15 * Math.sin(t * 6 + x);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s * (0.4 + 0.6 * e))})" opacity="${f2(Math.min(1, k * 2))}"><circle r="64" fill="#FFC93C" opacity="${f2(0.35 * kd)}"/><path d="M-40 30 L-40 -10 L-16 -28 L-16 -10 L8 -28 L8 -10 L32 -28 L32 -40 L44 -40 L44 30Z" fill="${M}"/><rect x="-30" y="4" width="14" height="14" fill="#FFF4DC"/><rect x="-4" y="4" width="14" height="14" fill="#FFF4DC"/><rect x="22" y="4" width="14" height="14" fill="#FFF4DC"/>${[0, 1].map((i) => { const q = (t * 0.7 + i * 0.5) % 1; return `<circle cx="${f1(38 + q * 10)}" cy="${f1(-46 - q * 40)}" r="${f1(6 + q * 8)}" fill="#E8E2DA" opacity="${f2(1 - q)}"/>`; }).join("")}<g transform="translate(-30 -64)"><rect x="-6" y="-4" width="56" height="30" rx="5" fill="${PU}"/>${[0, 6, 10, 18, 22, 30, 36, 40].map((xx, i) => `<rect x="${xx}" y="0" width="${i % 3 ? 3 : 5}" height="22" fill="${HT}"/>`).join("")}</g></g>`;
  }
  function petaDunia(x, y, s, t, o = {}) {
    let q = `<rect x="-640" y="-380" width="1280" height="740" rx="50" fill="#D9EEF5"/>`;
    for (let i = 0; i < 6; i++) q += `<path d="M-640 ${-300 + i * 130} Q-320 ${-320 + i * 130 + Math.sin(t + i) * 10} 0 ${-300 + i * 130} T640 ${-300 + i * 130}" stroke="#FFFFFF" stroke-width="6" fill="none" opacity=".5"/>`;
    q += BENUA.map((d) => `<path d="${d}" fill="#F3B9A8"/><path d="${d}" fill="#E89A86" transform="translate(6 8)" opacity=".5"/>`).join("");
    const pk = o.pabrik || 0;
    q += TITIK_PABRIK.map(([px, py], i) => ikonPabrik(px, py, 0.85, cl(pk * TITIK_PABRIK.length - i), t)).join("");
    return g(x, y, s, q);
  }

  // ---------- kubu, HP, kasir teman ----------
  function kartuKubu(x, y, s, teks, ikon, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    const c = o.warna || M;
    return `<g transform="translate(${f1(x)} ${f1(y + (1 - hal(k)) * 200)}) rotate(${f1((o.rot || 0) * k)}) scale(${f2(s * (0.7 + 0.3 * hal(k)))})" opacity="${f2(Math.min(1, k * 2))}"><rect x="-170" y="-220" width="340" height="420" rx="34" fill="#000" opacity=".22" transform="translate(10 14)"/><rect x="-170" y="-220" width="340" height="420" rx="34" fill="#FFF4DC"/><rect x="-146" y="-196" width="292" height="260" rx="22" fill="${c}"/><g transform="translate(0 -66)">${ikon}</g><text y="158" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="72" fill="${HT}">${teks}</text></g>`;
  }
  function hpPolos(x, y, s, t, o = {}) {
    const kr = cl(o.kirim || 0);
    let q = `<rect x="-150" y="-280" width="300" height="560" rx="44" fill="${HT}"/><rect x="-132" y="-258" width="264" height="516" rx="30" fill="#FFF4DC"/>`;
    q += `<rect x="-132" y="-258" width="264" height="70" rx="30" fill="${M}"/><circle cx="-80" cy="-222" r="20" fill="#FFC93C"/><rect x="-46" y="-232" width="120" height="18" rx="9" fill="#FFF4DC" opacity=".8"/>`;
    q += `<rect x="-110" y="-160" width="170" height="70" rx="22" fill="${PU}"/><rect x="-40" y="-70" width="150" height="60" rx="22" fill="#FFD8D3"/>`;
    q += `<rect x="-110" y="10" width="200" height="130" rx="22" fill="${PU}"/><path d="M-80 120 L-40 60 L-10 96 L20 70 L60 120Z" fill="${ABT}"/>`;
    q += `<rect x="-110" y="190" width="170" height="44" rx="22" fill="${PU}"/><circle cx="96" cy="212" r="26" fill="${M}"/><path d="M84 200 L112 212 L84 224 L90 212Z" fill="${PU}"/>`;
    if (kr > 0) q += `<circle cx="96" cy="212" r="${f1(26 + 40 * kr)}" fill="none" stroke="${M}" stroke-width="${f1(8 * (1 - kr))}" opacity="${f2(1 - kr)}"/>`;
    return g(x, y, s, q, o.rot || 0);
  }
  function pesawatKertas(x, y, s, rot = -20, a = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f2(s)})" opacity="${f2(a)}"><path d="M-60 0 L60 -30 L-14 30Z" fill="${PU}"/><path d="M-14 30 L0 8 L60 -30Z" fill="#E3D8C8"/></g>`;
  }
  function orangKasir(x, y, s, t, o = {}) {
    const k = cl(o.k ?? 1); if (k <= 0) return "";
    const by = Math.sin(t * 2.4) * 4;
    let q = `<ellipse cx="0" cy="250" rx="120" ry="18" fill="#000" opacity=".14"/><path d="M-110 250 Q-120 60 0 50 Q120 60 110 250Z" fill="${TL}"/><path d="M-60 80 L60 80 L70 250 L-70 250Z" fill="${M}"/><rect x="-26" y="130" width="52" height="34" rx="8" fill="#FFF4DC" opacity=".9"/><circle cx="0" cy="${f1(-30 + by)}" r="70" fill="${KUL}"/><path d="M-72 ${f1(-40 + by)} Q-70 ${f1(-112 + by)} 0 ${f1(-110 + by)} Q70 ${f1(-112 + by)} 72 ${f1(-40 + by)} Q40 ${f1(-80 + by)} -72 ${f1(-40 + by)}Z" fill="#4A2E1A"/><path d="M-76 ${f1(-62 + by)} Q0 ${f1(-118 + by)} 76 ${f1(-62 + by)} L80 ${f1(-48 + by)} L-80 ${f1(-48 + by)}Z" fill="${M}"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f2(s * (0.6 + 0.4 * hal(k)))})" opacity="${f2(Math.min(1, k * 2))}">${q}</g>`;
  }

  Object.assign(A, { BARCODE_W: C, MIE_BC, polaBar, posBar, barcodeFiktif, bungkusMie, scannerGenggam, layarKasir, mejaKasirSiang, komputerToko, lemariDaftar, posLaci, kartuNomor, ktpBarang, kantongUang, gelembungPikir, capSilang, ledakanDiskon, labelGanti, petaDunia, ikonPabrik, kartuKubu, hpPolos, pesawatKertas, orangKasir });
})(typeof window !== "undefined" ? window : globalThis);
