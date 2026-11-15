/* Sampul (thumbnail) Ternyata Begitu — 6 gaya, frame 0 video 1080x1920.
 * Pakai: sampulHTML(gaya, data) -> string HTML (div 1080x1920). Butuh tebe-rig.js (+ aset-set.js bila memakai objek ASET).
 * Aturan tata letak (WAJIB, lihat skill produksi-video/referensi/sampul.md):
 *  - Semua yang penting di "zona grid" y 260–1660 (TikTok/IG memotong sampul jadi 3:4 di profil).
 *  - Tebe BESAR (lebar 620–860 px) dengan ekspresi jelas — wajah Tebe adalah merek, bukan stiker kecil di pojok.
 *  - Teks maks 4–6 kata, 2–3 baris, satu kata kunci disorot. Terbaca di layar 3 cm.
 *  - Satu "objek pahlawan" besar (benda/hewan dari topik). Latar sederhana & kontras, bukan salinan set video.
 * data: {baris:["KOMODO","HAMIL","TANPA PEJANTAN?!"], sorot:0 (indeks baris disorot), objek:"<svg-inner g>", objekKotak:[x,y,s],
 *        angka:"2006", warna:"kuning|teal|oranye|malam|ungu|hijau", ekspresi:"kaget|penasaran|bingung|tertawa|berpikir|bangga|menjelaskan",
 *        kiri:"MITOS", kanan:"FAKTA" (gaya duel), bisik:"SSST..." (gaya rahasia)}
 */
(function (root) {
  const WARNA = {
    kuning: ["#FFD34D", "#FFB21E", "#1E1E1E"], teal: ["#2AA3A3", "#136B6B", "#FFFFFF"], oranye: ["#FF8A3D", "#E2531F", "#FFFFFF"],
    malam: ["#24305E", "#0E1530", "#FFFFFF"], ungu: ["#7B5CD6", "#40278F", "#FFFFFF"], hijau: ["#4FBF7A", "#1F7A4A", "#FFFFFF"],
  };
  const POSE = {
    kaget: { alisK: 1, alisN: 1, mataBesar: 1, mulutBuka: 0.9, mulutLebar: 0.45, senyum: 0, tanganK: [86, 246], tanganN: [314, 246], bentukK: "buka", bentukN: "buka", tekukK: -1, tekukN: 1, efek: "kaget" },
    penasaran: { alisK: -0.2, alisN: 0.8, lihatX: 4, lihatY: -2, senyum: 0.3, mulutLebar: 0.4, kepalaMiring: -6, tanganN: [244, 268], bentukN: "kepal", tekukN: 1 },
    bingung: { alisK: -0.5, alisN: 0.9, alisMiringK: -0.6, lihatX: -3, senyum: -0.3, mulutLebar: 0.45, kepalaMiring: 8, tanganN: [300, 150], bentukN: "garuk", tekukN: 1, efek: "bingung" },
    tertawa: { mataSenyum: 1, alisK: 0.4, alisN: 0.4, mulutBuka: 0.8, senyum: 1, mulutLebar: 0.85, pipi: 0.9, tanganK: [128, 396], tanganN: [272, 396], kepalaMiring: 4 },
    berpikir: { alisK: -0.3, alisN: 0.5, lihatX: -4, lihatY: -5, senyum: 0.1, mulutLebar: 0.3, kepalaMiring: -6, tanganN: [236, 288], bentukN: "tunjuk", tekukN: 1 },
    bangga: { mataSenyum: 1, alisK: 0.3, alisN: 0.3, senyum: 1, mulutLebar: 0.7, pipi: 0.85, tanganK: [140, 392], tanganN: [260, 392] },
    menjelaskan: { alisK: 0.4, alisN: 0.6, senyum: 0.6, mulutBuka: 0.35, mulutLebar: 0.5, tanganN: [340, 200], bentukN: "tunjuk", tekukN: 1, kepalaMiring: 4 },
    bisik: { alisK: 0.2, alisN: 0.9, lihatX: 5, senyum: 0.2, mulutLebar: 0.3, kepalaMiring: 6, tanganK: [150, 236], bentukK: "buka", tekukK: -1 },
  };
  const tebe = (ekspresi, lebar, cermin = false) =>
    `<div style="width:${lebar}px;${cermin ? "transform:scaleX(-1);" : ""}filter:drop-shadow(0 18px 24px rgba(0,0,0,.35))">${root.tebeRigSVG(POSE[ekspresi] || POSE.kaget).replace('width="400" height="520"', 'width="100%" height="auto"')}</div>`;
  const abs = (css, isi) => `<div style="position:absolute;${css}">${isi}</div>`;
  const teks = (d, ukuran, warnaTeks = "#fff", rata = "center") => (d.baris || []).map((b, i) =>
    i === (d.sorot ?? -1)
      ? `<div style="display:inline-block;background:#FFC93C;color:#1E1E1E;padding:2px 26px 8px;border-radius:22px;transform:rotate(-2deg);margin:6px 0;box-shadow:0 10px 0 rgba(0,0,0,.25)">${b}</div>`
      : `<div style="color:${warnaTeks};-webkit-text-stroke:${Math.round(ukuran * 0.09)}px #1E1E1E;paint-order:stroke fill">${b}</div>`).join("")
    .replace(/^/, `<div style="font:900 ${ukuran}px/1.02 Poppins,'Inter Display',sans-serif;letter-spacing:-2px;text-align:${rata};text-shadow:0 8px 0 rgba(0,0,0,.25)">`) + "</div>";
  const sinar = (cx, cy, warna, n = 18, op = 0.18) => `<svg width="1080" height="1920" style="position:absolute;left:0;top:0">${Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, b = a + Math.PI / n;
    return `<path d="M${cx} ${cy} L${cx + Math.cos(a) * 2400} ${cy + Math.sin(a) * 2400} L${cx + Math.cos(b) * 2400} ${cy + Math.sin(b) * 2400}Z" fill="${warna}" opacity="${op}"/>`; }).join("")}</svg>`;
  const objek = (d, x, y, s) => d.objek ? `<svg width="1080" height="1920" style="position:absolute;left:0;top:0;overflow:visible"><g transform="translate(${x} ${y}) scale(${s})">${d.objek}</g></svg>` : "";
  const merek = abs("left:60px;top:1560px;display:flex;align-items:center;gap:12px;font:800 34px Poppins,sans-serif;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.6)",
    `<svg width="46" height="46" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#FFC93C" stroke="#1E1E1E" stroke-width="2.5"/><path d="M14 15 C14 8 27 8 26 15 C25.5 19 20 18.5 20 23" fill="none" stroke="#1E1E1E" stroke-width="3.6" stroke-linecap="round"/><circle cx="20" cy="29" r="2.3" fill="#1E1E1E"/></svg>TernyataBegitu`);

  const GAYA = {
    // 1. Reaksi besar: latar warna + sinar, objek pahlawan kiri, Tebe raksasa kanan bawah
    reaksi(d) { const [a, b] = WARNA[d.warna || "kuning"];
      return `<div style="position:absolute;inset:0;background:radial-gradient(circle at 60% 55%,${a},${b})"></div>${sinar(640, 1080, "#fff", 20, 0.16)}
        ${objek(d, ...(d.objekKotak || [300, 1080, 1.6]))}
        ${abs("left:330px;top:760px", tebe(d.ekspresi || "kaget", 820))}
        ${abs("left:40px;right:40px;top:280px", teks(d, d.ukuran || 128))}${merek}`; },
    // 2. Duel: belah diagonal mitos vs fakta, Tebe di tengah
    duel(d) {
      return `<div style="position:absolute;inset:0;background:#E2531F"></div><div style="position:absolute;inset:0;background:#1F8A8A;clip-path:polygon(62% 0,100% 0,100% 100%,38% 100%)"></div>
        ${abs("left:40px;top:300px;transform:rotate(-6deg)", `<div style="font:900 110px Poppins,sans-serif;color:#fff;-webkit-text-stroke:10px #1E1E1E;paint-order:stroke fill">${d.kiri || "MITOS?"}</div>`)}
        ${abs("right:40px;top:420px;transform:rotate(5deg)", `<div style="font:900 110px Poppins,sans-serif;color:#FFC93C;-webkit-text-stroke:10px #1E1E1E;paint-order:stroke fill">${d.kanan || "FAKTA!"}</div>`)}
        ${objek(d, ...(d.objekKotak || [540, 820, 1.2]))}
        ${abs("left:170px;top:880px", tebe(d.ekspresi || "bingung", 740))}
        ${abs("left:40px;right:40px;top:1420px", teks(d, d.ukuran || 96))}`; },
    // 3. Zoom objek: objek raksasa dalam lingkaran sorot + panah merah, Tebe mengintip dari kiri bawah
    zoom(d) { const [a, b] = WARNA[d.warna || "malam"];
      return `<div style="position:absolute;inset:0;background:radial-gradient(circle at 58% 48%,${a},${b} 70%)"></div>
        <svg width="1080" height="1920" style="position:absolute;left:0;top:0"><circle cx="620" cy="900" r="330" fill="#FFF4DC" opacity=".12"/><circle cx="620" cy="900" r="330" fill="none" stroke="#FF3B30" stroke-width="22" stroke-dasharray="40 0"/>
        <path d="M250 560 Q330 640 360 720" fill="none" stroke="#FF3B30" stroke-width="26" stroke-linecap="round"/><path d="M318 690 L366 734 L384 668" fill="none" stroke="#FF3B30" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/></svg>
        ${objek(d, ...(d.objekKotak || [620, 900, 2.2]))}
        ${abs("left:-60px;top:1080px", tebe(d.ekspresi || "penasaran", 680))}
        ${abs("left:40px;right:40px;top:270px", teks(d, d.ukuran || 112))}${merek}`; },
    // 4. Rahasia: lampu sorot gelap, Tebe berbisik besar di tengah, teks seperti bocoran
    rahasia(d) {
      return `<div style="position:absolute;inset:0;background:#0E1530"></div><div style="position:absolute;inset:0;background:radial-gradient(ellipse 520px 760px at 540px 1040px,rgba(255,231,160,.55),rgba(14,21,48,0) 70%)"></div>
        ${objek(d, ...(d.objekKotak || [820, 760, 1.2]))}
        ${abs("left:150px;top:820px", tebe(d.ekspresi || "bisik", 800))}
        ${abs("left:60px;top:300px", `<div style="font:italic 700 64px Lora,Georgia,serif;color:#FFC93C">${d.bisik || "Ssst…"}</div>`)}
        ${abs("left:40px;right:40px;top:400px", teks(d, d.ukuran || 112))}${merek}`; },
    // 5. Angka: angka raksasa sebagai hook, Tebe menunjuk
    angka(d) { const [a, b] = WARNA[d.warna || "teal"];
      return `<div style="position:absolute;inset:0;background:linear-gradient(160deg,${a},${b})"></div>${sinar(360, 760, "#fff", 16, 0.1)}
        ${abs("left:30px;top:420px;transform:rotate(-4deg)", `<div style="font:900 330px/1 Poppins,sans-serif;color:#FFC93C;-webkit-text-stroke:16px #1E1E1E;paint-order:stroke fill;text-shadow:0 18px 0 rgba(0,0,0,.3)">${d.angka || "?"}</div>`)}
        ${objek(d, ...(d.objekKotak || [800, 560, 1]))}
        ${abs("left:360px;top:860px", tebe(d.ekspresi || "menjelaskan", 760, true))}
        ${abs("left:40px;right:40px;top:270px", teks(d, d.ukuran || 96))}${merek}`; },
    // 6. Tanya besar: tanda tanya raksasa (jambul Tebe) di belakang, Tebe bingung di depan
    tanya(d) { const [a, b] = WARNA[d.warna || "ungu"];
      return `<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,${a},${b})"></div>
        <svg width="1080" height="1920" style="position:absolute;left:0;top:0"><g transform="translate(540 760) scale(7)" opacity=".9"><path d="M-30 -40 C-32 -78 44 -82 42 -42 C41 -18 4 -26 2 2" fill="none" stroke="#FFC93C" stroke-width="16" stroke-linecap="round"/><circle cx="2" cy="30" r="10" fill="#FFC93C"/></g></svg>
        ${objek(d, ...(d.objekKotak || [800, 1060, 1.1]))}
        ${abs("left:160px;top:900px", tebe(d.ekspresi || "bingung", 760))}
        ${abs("left:40px;right:40px;top:270px", teks(d, d.ukuran || 120))}${merek}`; },
  };
  function sampulHTML(gaya, data) {
    return `<div style="position:relative;width:1080px;height:1920px;overflow:hidden">${(GAYA[gaya] || GAYA.reaksi)(data || {})}</div>`;
  }
  const api = { sampulHTML, GAYA_SAMPUL: Object.keys(GAYA), POSE_SAMPUL: POSE };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else Object.assign(root, api);
})(typeof window !== "undefined" ? window : globalThis);
