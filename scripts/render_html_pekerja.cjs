/* Pekerja tangkap frame untuk scripts/render_html.py (jangan dipanggil langsung).
 * Membuka HTML video dengan Chromium (Playwright Node), memanggil window.render(T) tiap frame,
 * mengirim tangkapan JPEG ke ffmpeg → potongan video perantara (mutu tinggi, dikompres ulang oleh render_html.py).
 * Argumen: path file konfigurasi JSON.
 */
const fs = require("fs");
const { spawn } = require("child_process");
const { chromium } = require("playwright");

const K = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const W = 1080, H = 1920;

async function bukaHalaman(browser) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: K.skala });
  const galat = [];
  page.on("pageerror", (e) => galat.push(e.message));
  await page.goto(K.url, { waitUntil: "load" });
  await page.evaluate(async (fonts) => { await Promise.all(fonts.map((f) => document.fonts.load(f).catch(() => null))); await document.fonts.ready; }, K.fonts);
  const ada = await page.evaluate(() => typeof window.render === "function");
  if (!ada) throw new Error("window.render(T) tidak ditemukan di HTML" + (galat.length ? " | galat halaman: " + galat.join(" ; ") : ""));
  return { page, galat };
}

async function tangkap(page, T, opsi = { type: "jpeg", quality: 92 }) {
  await page.evaluate((t) => window.render(t), T);
  return page.screenshot(opsi);
}

async function pekerja(browser, idx, f0, f1) {
  const { page, galat } = await bukaHalaman(browser);
  const out = K.potongan[idx];
  const w = Math.round(W * K.skala / 2) * 2, h = Math.round(H * K.skala / 2) * 2;
  const ff = spawn(K.ffmpeg, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(K.fps), "-c:v", "mjpeg", "-i", "-",
    "-vf", `scale=${w}:${h}:flags=lanczos,format=yuv420p`, "-c:v", "libx264", "-preset", "veryfast", "-crf", "12", "-r", String(K.fps), out], { stdio: ["pipe", "inherit", "inherit"] });
  const selesai = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg potongan gagal, kode " + c)))));
  for (let f = f0; f < f1; f++) {
    const T = K.mulai + f / K.fps;
    const buf = await tangkap(page, T);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (idx === 0 && (f - f0) % 30 === 0) process.stdout.write(`  pekerja 0: frame ${f - f0}/${f1 - f0}\n`);
  }
  ff.stdin.end();
  await selesai;
  await page.close();
  return galat;
}

(async () => {
  const t0 = Date.now();
  const browser = await chromium.launch();
  const info = {};
  try {
    const { page } = await bukaHalaman(browser);
    Object.assign(info, await page.evaluate(() => ({ durasi: window.DURASI ?? null, efek: window.EFEK ?? null, musik: window.MUSIK ?? null })));
    if (K.thumbnail) { // sampul = frame 0, ukuran penuh PNG
      const p2 = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
      await p2.goto(K.url, { waitUntil: "load" });
      await p2.evaluate(async (fonts) => { await Promise.all(fonts.map((f) => document.fonts.load(f).catch(() => null))); await document.fonts.ready; }, K.fonts);
      fs.writeFileSync(K.thumbnail, await tangkap(p2, 0, { type: "png" }));
      await p2.close();
    }
    await page.close();
    if (K.hanyaInfo) { fs.writeFileSync(K.info, JSON.stringify(info)); return; }
    const n = K.potongan.length, total = K.frame, per = Math.ceil(total / n), tugas = [];
    for (let i = 0; i < n; i++) tugas.push(pekerja(browser, i, i * per, Math.min(total, (i + 1) * per)));
    const galat = (await Promise.all(tugas)).flat();
    info.galat = [...new Set(galat)];
    info.detik_render = (Date.now() - t0) / 1000;
    fs.writeFileSync(K.info, JSON.stringify(info));
  } finally {
    await browser.close();
  }
})().catch((e) => { console.error("GAGAL:", e.message); process.exit(1); });
