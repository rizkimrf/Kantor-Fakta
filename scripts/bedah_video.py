"""BEDAH VIDEO — ukur video referensi (atau video kita) per detik. Metode bedah 3 video viral, 28 Nov 2026.

Pemakaian: python scripts/bedah_video.py <video.mp4> <folder_keluar> [--ocr atas,bawah]
  --ocr 0.60,0.72  : baca subtitle yang tertanam di pita tinggi 60–72% layar (tesseract bahasa Indonesia). Lihat dulu lembar
                     kontak untuk menentukan posisi pita subtitle/teks besar.
Hasil di folder_keluar:
  hook.jpg          — 0–3,2 dtk, 4 frame/dtk (detik pertama penentu "ditonton vs digeser")
  lembar_NN.jpg     — 1 frame/dtk, 24 detik per lembar (lihat dengan Read)
  ringkasan.json    — durasi, resolusi, jumlah potongan & rata-rata panjang adegan, suara mulai, % hening, profil keras suara
  teks_layar.txt    — (bila --ocr) teks per frasa + jumlah kata & kata/dtk
Video referensi adalah DATA untuk dipelajari polanya — jangan menyalin naskah, desain, atau topik terbaru akun lain.
"""
import json, re, subprocess, sys
from pathlib import Path

FONT = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"


def jalan(perintah):
    return subprocess.run(perintah, capture_output=True, text=True)


def main():
    if len(sys.argv) < 3:
        print(__doc__); return 2
    v, out = Path(sys.argv[1]), Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
    info = json.loads(jalan(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height,r_frame_rate",
                             "-of", "json", str(v)]).stdout)
    dur = float(info["format"]["duration"])
    vs = next(s for s in info["streams"] if s["codec_type"] == "video")
    teks = f"drawtext=fontfile={FONT}:text='%{{eif\\:t\\:d}}s':x=4:y=4:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.7"
    jalan(["ffmpeg", "-v", "error", "-y", "-i", str(v), "-vf", f"fps=1,scale=180:320,{teks},tile=6x4:padding=2", "-q:v", "3", str(out / "lembar_%02d.jpg")])
    teks4 = f"drawtext=fontfile={FONT}:text='%{{pts\\:flt}}':x=4:y=4:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.7"
    jalan(["ffmpeg", "-v", "error", "-y", "-i", str(v), "-t", "3.2", "-vf", f"fps=4,scale=216:384,{teks4},tile=7x2:padding=2", "-frames:v", "1", "-q:v", "3", str(out / "hook.jpg")])
    sc = jalan(["ffmpeg", "-hide_banner", "-i", str(v), "-vf", "select='gt(scene,0.22)',showinfo", "-an", "-f", "null", "-"]).stderr
    potong = [float(x) for x in re.findall(r"pts_time:([0-9.]+)", sc)]
    ring = {"berkas": v.name, "durasi_dtk": round(dur, 1), "resolusi": f"{vs['width']}x{vs['height']}", "potongan": len(potong),
            "rata_panjang_adegan_dtk": round(dur / (len(potong) + 1), 2), "potongan_awal": [round(x, 2) for x in potong[:10]]}
    try:
        import numpy as np
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(v), "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
        x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
        n = len(x) // 1600
        if n:
            db = 20 * np.log10(np.sqrt((x[:n * 1600].reshape(n, 1600) ** 2).mean(1) + 1e-12))
            ring.update({"suara_mulai_dtk": round(float(np.argmax(db > -35)) * 0.1, 1), "persen_hening": round(float(np.mean(db < -40)) * 100, 1),
                         "keras_dbfs_p5_median_p90": [round(float(q), 1) for q in np.percentile(db, [5, 50, 90])],
                         "catatan_musik": "ada latar terus (p5 > -35 dB)" if np.percentile(db, 5) > -35 else "ada jeda hening / latar tipis"})
    except Exception as e:
        ring["audio_galat"] = str(e)[:200]
    if "--ocr" in sys.argv:
        atas, bawah = map(float, sys.argv[sys.argv.index("--ocr") + 1].split(","))
        frasa = ocr(v, atas, bawah)
        kata = sum(len(f.split()) for _, f in frasa)
        ring.update({"kata_terbaca": kata, "kata_per_dtk": round(kata / dur, 2)})
        (out / "teks_layar.txt").write_text("\n".join(f"{t:6.1f}  {f}" for t, f in frasa) + "\n", encoding="utf-8")
    (out / "ringkasan.json").write_text(json.dumps(ring, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(ring, ensure_ascii=False, indent=1))
    print(f"Lihat: {out}/hook.jpg lalu {out}/lembar_*.jpg (Read). Tulis temuan dengan pola di laporan/2026-11-28/bedah-3-video-viral.md")
    return 0


def ocr(v, atas, bawah, fps=3):
    import cv2, pytesseract
    cap = cv2.VideoCapture(str(v)); vf = cap.get(cv2.CAP_PROP_FPS) or 30; n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step, mentah = max(1, int(round(vf / fps))), []
    for i in range(0, n, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i); ok, fr = cap.read()
        if not ok: break
        h = fr.shape[0]; g = cv2.cvtColor(fr[int(h * atas):int(h * bawah)], cv2.COLOR_BGR2GRAY)
        g = cv2.resize(g, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        _, th = cv2.threshold(g, 200, 255, cv2.THRESH_BINARY)
        t = pytesseract.image_to_string(255 - th, lang="ind", config="--psm 6")
        mentah.append((i / vf, re.sub(r"\s+", " ", re.sub(r"[^0-9A-Za-zÀ-ÿ%×,.?!'\- ]", " ", t)).strip()))
    frasa, cur, t0 = [], [], 0.0
    for t, s in mentah:  # subtitle karaoke: ambil versi terpanjang tiap frasa
        w = [x for x in re.findall(r"[A-Za-zÀ-ÿ0-9%×'\-]+[.,?!]?", s) if len(x) > 1]
        if not w: continue
        a = [x.lower().strip(".,?!") for x in cur]; b = [x.lower().strip(".,?!") for x in w]
        if cur and b[:len(a)] == a: cur = w
        elif cur and a[:len(b)] == b: pass
        else:
            if cur: frasa.append((t0, " ".join(cur)))
            cur, t0 = w, t
    if cur: frasa.append((t0, " ".join(cur)))
    return frasa


if __name__ == "__main__":
    sys.exit(main())
