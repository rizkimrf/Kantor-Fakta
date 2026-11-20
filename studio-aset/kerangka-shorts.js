/* KERANGKA SHORTS — mesin bersama video Shorts "Ternyata Begitu" (Yoga, 15 Nov 2026; dipakai I-009 durian & I-015 harga 99.900)
 * Muat SETELAH tebe-rig.js dan aset-set.js. Semua fungsi murni (fungsi waktu kontinu), cocok untuk kontrak window.render(T).
 *
 *  KS.waktu(WAKTU_KATA, [{t, d}])   → peta waktu narasi ↔ video. JEDA dijepret ke celah kata (sama dengan render_html.py).
 *       .JEDA (pasang ke window.JEDA) · .vt(detikNarasi) · .nt(detikVideo) · .kata[i] = {kata, m, s} (detik VIDEO) · .cari("kata", ke)
 *  KS.teks(W, {gabung, ganti, tekan, maks})  → kelompok teks layar 2–4 kata dari waktu kata; KS.teksLayar(T, kelompok)
 *  KS.komposisi(T, BABAK)          → set per babak + transisi 0,6 dtk (dorong kamera / geser kamera) dengan easing sinus
 *  KS.intro(T, t0)                  → intro khas 2,4 dtk (lingkaran kuning-teal, jambul "?", "Ternyata Begitu!")
 *  KS.outro(T, t0, {anim, cta, sub, subMulai, ctaMulai}) → outro khas (Tebe bangga, jambul ? → !, sinar teal, ajakan di zona aman; sub = baris kecil, bawaan "Tulis jawabanmu di komentar")
 *  KS.label(teks, T, a, b)          → label kecil babak (y ±300) · KS.watermark(T, sembunyi) · KS.tebe(param, lebar, gelap)
 * Zona aman: teks layar di y 1250–1390, x 80–880; label y 300; watermark (40,236) → (40,1400) → (kanan 200, 236).
 */
(function (root) {
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lin = (t, a, b) => cl((t - a) / (b - a));
  const oExp = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)), ioS = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const oCub = (x) => 1 - Math.pow(1 - x, 3), oBack = (x, c = 1.7) => { return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const sinIO = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x)), halus = (x) => { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const lerp = (a, b, k) => a + (b - a) * k;
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\-]/g, "");

  function tebe(p, w, gelap = 0, o = {}) {
    const svg = root.tebeRigSVG(p).replace('width="400" height="520"', 'width="100%"');
    return `<div style="width:${w}px;filter:brightness(${(1 - gelap * 0.12).toFixed(3)}) saturate(${(1 - gelap * 0.1).toFixed(3)});${o.cermin ? "transform:scaleX(-1);" : ""}">${svg}</div>`;
  }

  // ---------- peta waktu (narasi ↔ video) ----------
  function waktu(kata, jedaMentah) {
    kata = kata || [];
    const celah = [];
    for (let i = 0; i + 1 < kata.length; i++) if (kata[i + 1].mulai - kata[i].selesai > 0.04) celah.push((kata[i].selesai + kata[i + 1].mulai) / 2);
    const J = (jedaMentah || []).map((j) => {
      const c = celah.filter((x) => Math.abs(x - j.t) <= 0.6);
      const t = c.length ? c.reduce((a, b) => (Math.abs(b - j.t) < Math.abs(a - j.t) ? b : a)) : j.t;
      return { t: +t.toFixed(3), d: j.d };
    }).sort((a, b) => a.t - b.t);
    const vt = (n) => { let o = n; for (const j of J) if (j.t < n) o += j.d; return o; };
    const nt = (T) => { let off = 0; for (const j of J) { if (T < j.t + off) return T - off; if (T < j.t + off + j.d) return j.t; off += j.d; } return T - off; };
    const kv = kata.map((k) => ({ kata: k.kata, m: vt(k.mulai), s: vt(k.selesai) }));
    const cari = (w, ke = 1) => { let n = 0; for (const k of kv) if (norm(k.kata) === norm(w) && ++n === ke) return k; return { m: 0, s: 0, hilang: w }; };
    return { JEDA: J, vt, nt, kata: kv, cari, jedaVideo: (i) => vt(J[i].t) - 0 };
  }

  // ---------- teks layar berkelompok ----------
  function teks(W, o = {}) {
    const kata = W.kata, gab = (o.gabung || []).map(([a, b]) => [a.split(" ").map(norm), b]), ganti = o.ganti || {}, tekan = new Set((o.tekan || []).map(norm));
    const tok = [];
    for (let i = 0; i < kata.length; ) {
      let hit = null;
      for (const [seq, tampil] of gab) if (seq.every((s, j) => kata[i + j] && norm(kata[i + j].kata) === s)) { hit = [seq.length, tampil]; break; }
      if (hit) {
        const akhir = kata[i + hit[0] - 1], tanda = (akhir.kata.match(/[.,?!:]+$/) || [""])[0].replace("...", "…");
        tok.push({ teks: hit[1] + tanda, m: kata[i].m, s: akhir.s, tekan: true }); i += hit[0]; continue;
      }
      const k = kata[i], bersih = k.kata.replace(/\.\.\./g, "…"), dasar = norm(k.kata);
      let tampil = bersih; for (const g in ganti) if (norm(g) === dasar) tampil = ganti[g] + (bersih.match(/[.,?!:…]+$/) || [""])[0];
      tok.push({ teks: tampil, m: k.m, s: k.s, tekan: tekan.has(dasar) }); i++;
    }
    const grup = []; let cur = [];
    const tutup = () => { if (cur.length) grup.push(cur); cur = []; };
    for (const t of tok) {
      const panjang = cur.map((x) => x.teks).join(" ").length + t.teks.length;
      if (cur.length >= (o.maks || 3) || (cur.length && panjang > 22)) tutup();
      cur.push(t);
      if (/[.?!:…]$/.test(t.teks) || (/,$/.test(t.teks) && cur.length >= 2)) tutup();
    }
    tutup();
    return grup.map((g, i) => {
      const a = g[0].m - 0.06, berikut = grup[i + 1] ? grup[i + 1][0].m - 0.06 : 1e9, akhir = g[g.length - 1].s + 0.45;
      return { a, b: Math.min(berikut, Math.max(akhir, Math.min(berikut, g[g.length - 1].s + 0.9))), kata: g };
    });
  }
  function teksLayar(T, grup, o = {}) {
    const g = grup.find((x) => T >= x.a && T < x.b);
    if (!g) return "";
    const k = oBack(lin(T, g.a, g.a + 0.12)), op = lin(T, g.a, g.a + 0.12) * (1 - lin(T, g.b - 0.1, g.b));
    const isi = g.kata.map((w) => w.teks).join(" ");
    const uk = Math.min(o.ukuran || 76, Math.floor(800 / (isi.length * 0.58)));
    const kata = g.kata.map((w) => {
      const sudah = T >= w.m - 0.04, warna = w.tekan ? "#FFC93C" : "#FFFFFF";
      return `<span style="display:inline-block;margin:0 ${Math.round(uk * 0.12)}px;color:${warna};opacity:${sudah ? 1 : 0.92};transform:scale(${sudah && w.tekan ? 1 + 0.06 * (1 - lin(T, w.m, w.m + 0.25)) : 1})">${w.teks.toUpperCase()}</span>`;
    }).join("");
    return `<div style="position:absolute;left:80px;width:800px;top:${o.y || 1262}px;text-align:center;white-space:nowrap;opacity:${op.toFixed(3)};transform:scale(${(0.82 + 0.18 * k).toFixed(3)});transform-origin:400px 50%;font:700 ${uk}px/1.12 Poppins;letter-spacing:-1px;-webkit-text-stroke:${Math.round(uk * 0.15)}px rgba(14,20,34,.86);paint-order:stroke fill;text-shadow:0 6px 14px rgba(0,0,0,.35)">${kata}</div>`;
  }

  // ---------- label babak ----------
  function label(txt, T, a, b, o = {}) {
    if (T < a || T > b) return "";
    const k = oExp(lin(T, a, a + 0.5)) * (1 - sinIO(lin(T, b - 0.35, b)));
    return `<div style="position:absolute;left:${o.x || 80}px;top:${o.y || 300}px;clip-path:inset(0 ${(100 - k * 100).toFixed(1)}% 0 0)"><span style="display:inline-block;font:700 30px Poppins;letter-spacing:4px;padding:10px 20px 8px;border-radius:8px;background:${o.bg || "#FFC93C"};color:${o.warna || "#1E2A2A"};box-shadow:0 6px 0 rgba(0,0,0,.25)">${txt}</span></div>`;
  }

  // ---------- komposisi babak + transisi ----------
  // BABAK: [{a: detikVideo, f: (T) => html, tr: "dorong" | "geser" | "silang" | "tanpa", d: 0.6}]
  function lapis(html, gaya) { return `<div style="position:absolute;inset:0;overflow:hidden;${gaya}">${html}</div>`; }
  function komposisi(T, BABAK) {
    let i = 0; while (i + 1 < BABAK.length && BABAK[i + 1].a <= T) i++;
    const kini = BABAK[i], lanjut = BABAK[i + 1];
    let dari = null, ke = null, u = 0, jenis = "tanpa";
    const dur = (b) => b.d || 0.6;
    if (lanjut && lanjut.tr !== "tanpa" && T > lanjut.a - dur(lanjut) / 2) { dari = kini; ke = lanjut; u = (T - (lanjut.a - dur(lanjut) / 2)) / dur(lanjut); jenis = lanjut.tr; }
    else if (i > 0 && kini.tr !== "tanpa" && T < kini.a + dur(kini) / 2) { dari = BABAK[i - 1]; ke = kini; u = (T - (kini.a - dur(kini) / 2)) / dur(kini); jenis = kini.tr; }
    if (!dari) return lapis(kini.f(T), "");
    const e = sinIO(u);
    if (jenis === "geser") { // whip pan: dua set bergeser searah + blur gerak
      const bl = (Math.sin(Math.PI * cl(u)) * 9).toFixed(1);
      return lapis(dari.f(T), `transform:translateX(${(-e * 1080).toFixed(1)}px);filter:blur(${bl}px)`) + lapis(ke.f(T), `transform:translateX(${((1 - e) * 1080).toFixed(1)}px);filter:blur(${bl}px)`);
    }
    if (jenis === "silang") return lapis(dari.f(T), "") + lapis(ke.f(T), `opacity:${e.toFixed(3)}`);
    // dorong kamera: set lama maju (zoom in + blur), set baru mundur dari dekat ke posisi
    return lapis(dari.f(T), `transform:scale(${(1 + 0.16 * e).toFixed(4)});filter:blur(${(e * 7).toFixed(1)}px)`)
      + lapis(ke.f(T), `opacity:${e.toFixed(3)};transform:scale(${(1.14 - 0.14 * e).toFixed(4)});filter:blur(${((1 - e) * 6).toFixed(1)}px)`);
  }

  // ---------- intro khas lega (2,4 dtk) ----------
  function intro(T, t0) {
    const u = T - t0; if (u < 0 || u > 2.4) return "";
    const R = ioS(lin(u, 0, 0.35)) * 1500 * (1 - ioS(lin(u, 2.05, 2.4))), ds = 1 - lin(u, 0.2, 0.65), lg = oBack(lin(u, 0.5, 0.9), 0.5) * (1 - ioS(lin(u, 1.95, 2.25))), ng = 1 + lin(u, 0.85, 2.0) * 0.04;
    return `<svg width="1080" height="1920" style="position:absolute;left:0;top:0"><circle cx="760" cy="1260" r="${R.toFixed(1)}" fill="#FFC93C"/><circle cx="760" cy="1260" r="${(R * 0.82).toFixed(1)}" fill="#1F8A8A"/>
 <g transform="translate(540 700) scale(${(2.2 * ng).toFixed(3)})" opacity="${R > 300 ? 1 : 0}"><path d="M-30 -40 C-32 -78 44 -82 42 -42 C41 -18 4 -26 2 2" fill="none" stroke="#FFC93C" stroke-width="18" stroke-linecap="round" stroke-dasharray="200" stroke-dashoffset="${(ds * 200).toFixed(1)}"/><circle cx="2" cy="30" r="11" fill="#FFC93C" opacity="${lin(u, 0.6, 0.65)}"/></g></svg>
 <div style="position:absolute;left:0;width:1080px;text-align:center;top:960px;font:700 120px/1.08 Poppins;letter-spacing:-2px;color:#FFF4DC;transform:scale(${(lg * ng).toFixed(3)});opacity:${lg > 0 ? 1 : 0}">Ternyata<br><span style="display:inline-block;background:#FFC93C;color:#1E1E1E;border:7px solid #1E1E1E;border-radius:28px;padding:4px 30px 0;box-shadow:10px 12px 0 rgba(0,0,0,.35);transform:rotate(-2deg);font-size:140px">Begitu!</span></div>`;
  }
  // ---------- outro khas ----------
  function sinar(t) { let s = ""; for (let i = 0; i < 18; i++) { const a = t * 0.15 + (i * Math.PI) / 9, b = a + Math.PI / 18; s += `<path d="M540 820 L${(540 + 2400 * Math.cos(a)).toFixed(0)} ${(820 + 2400 * Math.sin(a)).toFixed(0)} L${(540 + 2400 * Math.cos(b)).toFixed(0)} ${(820 + 2400 * Math.sin(b)).toFixed(0)}Z" fill="#fff" opacity=".06"/>`; } return s; }
  function outro(T, t0, o = {}) {
    // Masuk outro tanpa pantulan (overshoot) & tanpa arah gerak yang berbalik: lingkaran+Tebe tumbuh mulus dari 55%, judul menyusul,
    // kamera terus maju pelan (searah transisi 'dorong'). Pakai transisi masuk 'silang' atau 'dorong' 0,6 dtk.
    const u = T - t0, e = 0.55 + 0.45 * ioS(lin(u, 0, 0.7)), s = ioS(lin(u, 0.45, 1.0)), f = oExp(lin(u, o.ctaMulai ?? 1.9, (o.ctaMulai ?? 1.9) + 0.5));
    return `<div style="position:absolute;inset:0;transform:scale(${(1 + lin(u, 0, 8) * 0.03).toFixed(4)})"><svg width="1080" height="1920" style="position:absolute;left:0;top:0"><rect width="1080" height="1920" fill="#1F8A8A"/>${sinar(T)}<circle cx="490" cy="720" r="${(310 * e).toFixed(1)}" fill="#FFC93C" stroke="#1E1E1E" stroke-width="12"/></svg>
 <div style="position:absolute;left:270px;top:400px;transform:scale(${e.toFixed(3)});transform-origin:220px 320px">${tebe(o.anim(T), 440)}</div>
 <div style="position:absolute;left:0;width:980px;text-align:center;top:1040px;font:700 96px/1.08 Poppins;letter-spacing:-2px;color:#FFF4DC;opacity:${s.toFixed(3)};transform:translateY(${((1 - s) * 40).toFixed(1)}px) scale(${(0.9 + 0.1 * s).toFixed(3)})">Ternyata <span style="display:inline-block;background:#FFC93C;color:#1E1E1E;border:7px solid #1E1E1E;border-radius:26px;padding:2px 24px 0;box-shadow:8px 10px 0 rgba(0,0,0,.35);transform:rotate(-2deg)">Begitu!</span></div>
 <div style="position:absolute;left:90px;width:790px;top:1222px;text-align:center;font:700 50px/1.22 Poppins;color:#FFF4DC;opacity:${f.toFixed(3)};transform:translateY(${((1 - f) * 30).toFixed(1)}px);text-shadow:0 4px 10px rgba(0,0,0,.35)">${o.cta || ""}<div style="font:600 34px Poppins;color:#FFE7A6;margin-top:12px;opacity:${(o.subMulai == null ? 1 : oExp(lin(u, o.subMulai, o.subMulai + 0.4))).toFixed(3)}">${o.sub ?? "Tulis jawabanmu di komentar"}</div></div></div>`;
  }
  // ---------- watermark bergiliran ----------
  const WM = [{ left: 40, top: 236 }, { left: 40, top: 1400 }, { right: 200, top: 236 }];
  const ikon = `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#FFC93C" stroke="#1E1E1E" stroke-width="2.5"/><path d="M14 15 C14 8 27 8 26 15 C25.5 19 20 18.5 20 23" fill="none" stroke="#1E1E1E" stroke-width="3.6" stroke-linecap="round"/><circle cx="20" cy="29" r="2.3" fill="#1E1E1E"/></svg>`;
  function watermark(T, tampil = 1) {
    const i = Math.floor(T / 12), u = T - i * 12, a = Math.min(lin(u, 0, 0.5), 1 - lin(u, 11.5, 12)) * 0.72 * tampil, p = WM[i % WM.length];
    if (a <= 0.001) return "";
    const pos = Object.entries(p).map(([k, v]) => `${k}:${v}px`).join(";");
    return `<div style="position:absolute;${pos};opacity:${a.toFixed(3)};display:flex;align-items:center;gap:10px;font:700 30px Poppins;color:#FFF;text-shadow:0 2px 6px rgba(0,0,0,.55)">${ikon}TernyataBegitu</div>`;
  }
  const logoKecil = `<div style="position:absolute;left:300px;top:1580px;display:flex;align-items:center;gap:12px;font:700 34px Poppins;color:#FFF;text-shadow:0 2px 6px rgba(0,0,0,.6)">${ikon}TernyataBegitu</div>`;

  // vinyet + butiran film (tempel paling atas)
  function vinyet(T, kuat = 0.3) {
    return `<svg width="1080" height="1920" style="position:absolute;left:0;top:0;pointer-events:none"><defs><radialGradient id="ksvg" cx=".5" cy=".5" r=".78"><stop offset=".58" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${kuat}"/></radialGradient>
<filter id="ksgr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${Math.floor(T * 30) % 50}"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="1080" height="1920" fill="url(#ksvg)"/><rect width="1080" height="1920" filter="url(#ksgr)" opacity=".025"/></svg>`;
  }

  // ---------- outro YouTube (Bos 19 Nov): ikon play merah resmi (bentuk & warna tidak diubah) + "Ternyata Begitu", tanpa kalimat ajakan ----------
  // Ikon juga tersimpan di studio-aset/ikon-youtube.svg. a,b = detik mulai/selesai (fade 0,25 dtk). o: {y (pusat), x (pusat), uk}
  const IKON_YT = `<svg width="100%" viewBox="0 0 28.57 20"><path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/><path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="#FFFFFF"/></svg>`;
  function logoYT(T, a, b, o = {}) {
    const k = halus(lin(T, a, a + 0.25)) * (1 - halus(lin(T, b - 0.25, b)));
    if (k <= 0.001) return "";
    const uk = o.uk || 46, y = o.y ?? 1395, x = o.x ?? 540;
    return `<div style="position:absolute;left:${x - 400}px;width:800px;top:${(y - uk * 0.7 + (1 - k) * 14).toFixed(1)}px;display:flex;justify-content:center;align-items:center;gap:${Math.round(uk * 0.35)}px;opacity:${k.toFixed(3)}">
 <div style="padding:${Math.round(uk * 0.22)}px ${Math.round(uk * 0.45)}px;border-radius:${uk}px;background:rgba(12,16,22,.62);display:flex;align-items:center;gap:${Math.round(uk * 0.3)}px"><div style="width:${Math.round(uk * 1.3)}px;line-height:0">${IKON_YT}</div>
 <span style="font:700 ${uk}px/1 Poppins;color:#FFFFFF;letter-spacing:-.5px;white-space:nowrap">Ternyata Begitu</span></div></div>`;
  }

  root.KS = { logoYT, IKON_YT, cl, lin, oExp, ioS, oCub, oBack, sinIO, halus, lerp, norm, tebe, waktu, teks, teksLayar, label, komposisi, intro, outro, watermark, logoKecil, ikon, vinyet };
})(typeof window !== "undefined" ? window : globalThis);
