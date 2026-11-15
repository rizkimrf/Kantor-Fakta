"""Render video HTML (gaya v8) menjadi final.mp4 + thumbnail.png.

Pemakaian:
  python scripts/render_html.py antrean/<folder>                      # render penuh → final.mp4 + thumbnail.png
  python scripts/render_html.py antrean/<folder> --mulai 20 --durasi 4 --skala 0.5   # uji cepat → visual/uji.mp4
Opsi lain: --html <file> (bawaan visual/video.html) · --pekerja N (bawaan 4) · --fps 30 · --musik <nama|tanpa>
           --musik-vol 0.14 · --tanpa-sfx

Kontrak HTML (lihat studio-aset/contoh-1menit/v8-final.html):
  window.render(T)  wajib — menggambar keadaan detik T (dipanggil tiap frame, 30 fps, viewport 1080x1920)
  window.DURASI     opsional — panjang video (detik). Tanpa ini: durasi narasi + 1,5 dtk
  window.EFEK       opsional — [{t: 5.15, sfx: "jingle", vol: 0.5}, ...]  (file aset/sfx/<sfx>.wav)
  window.JEDA      opsional — [{t: detik_di_rekaman_narasi, d: lama_hening}] → hening disisipkan ke narasi (intro, napas antar babak)
  window.WAKTU_KATA  diisi otomatis dari audio/waktu_kata.json (daftar {kata, mulai, selesai}) sebelum skrip halaman jalan
  window.MUSIK      opsional — nama file di aset/musik/ tanpa .wav (bawaan: tenang-hujan bila ada, lalu file pertama)
  visual/efek.json  opsional — menggantikan window.EFEK bila ada.
Script <script src> yang menunjuk .../studio-aset/... atau .../aset/... (termasuk path file:/// mesin lain) otomatis
diarahkan ke folder repo ini. Font: Poppins dari aset/font/; Lora tidak terpasang → diganti Liberation Serif Italic.
Audio: narasi (audio/narasi.mp3) + musik (diredam otomatis saat narasi) + efek → loudnorm −14 LUFS, AAC 48 kHz.
Video: H.264 yuv420p, -crf 23 -maxrate 3M -bufsize 6M, faststart. Bila > 18 MB dikompres ulang (crf 26, lalu 28).
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS = ["700 40px Poppins", "600 40px Poppins", "500 40px Inter", "600 40px Inter", "700 40px Inter", "800 40px Inter",
         "900 40px 'Inter Display'", "700 40px 'Inter Display'", "italic 600 40px Lora"]
BATAS_MB = 18


def jalan(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        raise SystemExit(f"Perintah gagal: {' '.join(map(str, cmd[:6]))} …\n{r.stderr[-1500:]}")
    return r


def durasi_media(p):
    r = jalan(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(p)])
    return float(r.stdout.strip())


def siapkan_html(html: Path) -> Path:
    """Salin HTML ke file sementara di folder yang sama: perbaiki path skrip & tambahkan font cadangan."""
    teks = html.read_text(encoding="utf-8")

    def ganti(m):
        attr, path = m.group(1), m.group(2)
        hit = re.search(r"(?:^|/)((?:studio-aset|aset)/[^\"']+)$", path.replace("file://", ""))
        if hit and (ROOT / hit.group(1)).exists():
            return f'{attr}="{(ROOT / hit.group(1)).as_uri()}"'
        return m.group(0)

    teks = re.sub(r'(src|href)="([^"]+)"', ganti, teks)
    css = f"""<style id="font-cadangan">
@font-face{{font-family:Poppins;font-weight:100 900;src:url("{(ROOT / 'aset/font/Poppins-Bold.ttf').as_uri()}")}}
@font-face{{font-family:Lora;font-style:italic;font-weight:100 900;src:local("Lora Italic"),url("file:///usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf")}}
@font-face{{font-family:Lora;font-style:normal;font-weight:100 900;src:local("Lora"),url("file:///usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf")}}
</style>"""
    wk = html.parent.parent / "audio/waktu_kata.json"
    if wk.exists():
        css += "<script>window.WAKTU_KATA=" + json.dumps(json.loads(wk.read_text(encoding="utf-8")).get("kata", []), ensure_ascii=False) + ";</script>"
    teks = teks.replace("<head>", "<head>" + css, 1) if "<head>" in teks else css + teks
    tmp = html.parent / f".render_{html.stem}.html"
    tmp.write_text(teks, encoding="utf-8")
    return tmp


def jalankan_pekerja(cfg: dict, kerja: Path):
    p = kerja / "cfg.json"
    p.write_text(json.dumps(cfg), encoding="utf-8")
    env = dict(os.environ)
    npm_root = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
    env["NODE_PATH"] = os.pathsep.join(x for x in [env.get("NODE_PATH", ""), npm_root, "/opt/node-tools/node_modules"] if x)
    r = subprocess.run(["node", str(ROOT / "scripts/render_html_pekerja.cjs"), str(p)], env=env)
    if r.returncode != 0:
        raise SystemExit("Pekerja render gagal (lihat pesan di atas).")
    return json.loads(Path(cfg["info"]).read_text(encoding="utf-8"))


def pilih_musik(nama):
    folder = ROOT / "aset/musik"
    if nama == "tanpa":
        return None
    if nama:
        for ext in (".wav", ".mp3", ".m4a"):
            if (folder / f"{nama}{ext}").exists():
                return folder / f"{nama}{ext}"
        print(f"  ! musik '{nama}' tidak ada, memakai bawaan")
    semua = sorted(p for p in folder.glob("*") if p.suffix in (".wav", ".mp3", ".m4a")) if folder.exists() else []
    bawaan = [p for p in semua if p.stem.startswith("tenang")]
    return (bawaan or semua or [None])[0]


def rakit_audio(folder: Path, kerja: Path, D: float, mulai: float, efek, musik, musik_vol: float, jeda=None) -> Path:
    narasi = folder / "audio/narasi.mp3"
    inp, fil, lbl = [], [], []
    if narasi.exists():
        inp += ["-i", str(narasi)]
    else:
        print("  ! audio/narasi.mp3 belum ada → narasi hening (hanya untuk uji)")
        inp += ["-f", "lavfi", "-t", f"{D + mulai:.3f}", "-i", "anullsrc=r=48000:cl=stereo"]
    rantai = "[0:a]aresample=48000,aformat=channel_layouts=stereo"
    jd = sorted((float(j["t"]), float(j["d"])) for j in (jeda or []) if float(j["d"]) > 0)
    if jd:  # sisipkan hening ke rekaman narasi (intro & napas antar babak)
        titik = [0.0] + [t for t, _ in jd]
        fil.append(f"{rantai},asplit={len(titik)}" + "".join(f"[s{i}]" for i in range(len(titik))))
        bag = []
        for i, a in enumerate(titik):
            b = f":end={titik[i + 1]:.3f}" if i + 1 < len(titik) else ""
            fil.append(f"[s{i}]atrim=start={a:.3f}{b},asetpts=PTS-STARTPTS[p{i}]"); bag.append(f"[p{i}]")
            if i < len(jd):
                fil.append(f"aevalsrc=0|0:s=48000:d={jd[i][1]:.3f},aformat=channel_layouts=stereo[h{i}]"); bag.append(f"[h{i}]")
        fil.append(f"{''.join(bag)}concat=n={len(bag)}:v=0:a=1[narj]")
        rantai = "[narj]anull"
    fil.append(f"{rantai},atrim=start={mulai:.3f},asetpts=PTS-STARTPTS,apad,atrim=0:{D:.3f},asplit=2[nar][sc]")
    lbl.append("[nar]")
    n = 1
    if musik:
        inp += ["-stream_loop", "-1", "-i", str(musik)]
        fade0 = max(0.0, D - 1.5)
        fil.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim={mulai:.3f}:{mulai + D:.3f},asetpts=PTS-STARTPTS,"
                   f"volume={musik_vol},afade=t=in:d=0.6,afade=t=out:st={fade0:.3f}:d=1.5[m0]")
        fil.append("[m0][sc]sidechaincompress=threshold=0.02:ratio=3:attack=30:release=500:makeup=1[mus]")
        lbl.append("[mus]")
        n += 1
    else:
        fil.append("[sc]anullsink")
    for e in efek or []:
        f = ROOT / "aset/sfx" / f"{e['sfx']}.wav"
        t = float(e["t"]) - mulai
        if not f.exists():
            print(f"  ! efek '{e['sfx']}' tidak ada, dilewati"); continue
        if t < 0 or t > D:
            continue
        ms = int(t * 1000)
        if e.get("durasi"):  # efek latar (mis. hujan) diulang selama 'durasi' detik, masuk/keluar halus
            dd = float(e["durasi"])
            inp += ["-stream_loop", "-1", "-i", str(f)]
            fil.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{dd:.3f},afade=t=in:d=0.5,afade=t=out:st={max(0, dd - 0.8):.3f}:d=0.8,"
                       f"volume={float(e.get('vol', 0.3))},adelay={ms}|{ms}[e{n}]")
        else:
            inp += ["-i", str(f)]
            fil.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,volume={float(e.get('vol', 0.5))},adelay={ms}|{ms}[e{n}]")
        lbl.append(f"[e{n}]")
        n += 1
    fil.append(f"{''.join(lbl)}amix=inputs={len(lbl)}:normalize=0:duration=first,atrim=0:{D:.3f}[mix]")
    campur = kerja / "campur.wav"
    jalan(["ffmpeg", "-y", "-loglevel", "error", *inp, "-filter_complex", ";".join(fil), "-map", "[mix]", "-ar", "48000", str(campur)])
    # loudnorm 2 lintasan → −14 LUFS, puncak −1,5 dBTP
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(campur), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    hasil = kerja / "audio.m4a"
    try:
        m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
        if float(m["input_i"]) < -60:
            raise ValueError("hening")
        af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
              f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
    except (ValueError, KeyError):
        af = "anull"
        print("  ! audio hening/terlalu pelan → loudnorm dilewati")
    jalan(["ffmpeg", "-y", "-loglevel", "error", "-i", str(campur), "-af", af, "-c:a", "aac", "-b:a", "160k", "-ar", "48000", str(hasil)])
    return hasil


def kode_video(antara: Path, audio: Path, out: Path, crf: int, maxrate: str, bufsize: str):
    jalan(["ffmpeg", "-y", "-loglevel", "error", "-i", str(antara), "-i", str(audio), "-map", "0:v", "-map", "1:a",
           "-c:v", "libx264", "-preset", "medium", "-profile:v", "high", "-pix_fmt", "yuv420p", "-crf", str(crf),
           "-maxrate", maxrate, "-bufsize", bufsize, "-g", "60", "-c:a", "copy", "-shortest", "-movflags", "+faststart", str(out)])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("folder")
    ap.add_argument("--html", default=None)
    ap.add_argument("--mulai", type=float, default=0.0)
    ap.add_argument("--durasi", type=float, default=None)
    ap.add_argument("--skala", type=float, default=1.0)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--pekerja", type=int, default=4)
    ap.add_argument("--musik", default=None)
    ap.add_argument("--musik-vol", type=float, default=0.14)
    ap.add_argument("--tanpa-sfx", action="store_true")
    a = ap.parse_args()

    folder = Path(a.folder).resolve()
    html = Path(a.html).resolve() if a.html else folder / "visual/video.html"
    if not html.exists():
        raise SystemExit(f"HTML tidak ditemukan: {html}")
    uji = a.mulai > 0 or a.durasi is not None or a.skala != 1.0
    out = folder / ("visual/uji.mp4" if uji else "final.mp4")
    out.parent.mkdir(parents=True, exist_ok=True)
    kerja = Path(tempfile.mkdtemp(prefix="render_", dir=str(folder / "visual") if (folder / "visual").exists() else None))
    t_awal = time.time()
    tmp_html = siapkan_html(html)
    try:
        base = {"url": tmp_html.as_uri(), "fps": a.fps, "skala": a.skala, "mulai": a.mulai, "fonts": FONTS,
                "ffmpeg": shutil.which("ffmpeg"), "info": str(kerja / "info.json")}
        # 1) baca info halaman (DURASI, EFEK, MUSIK) + sampul frame 0
        thumb = None if uji else str(folder / "thumbnail.png")
        info = jalankan_pekerja({**base, "hanyaInfo": True, "thumbnail": thumb, "potongan": [], "frame": 0}, kerja)
        narasi = folder / "audio/narasi.mp3"
        if a.durasi is not None:
            D = a.durasi
        elif info.get("durasi"):
            D = float(info["durasi"]) - a.mulai
        elif narasi.exists():
            D = durasi_media(narasi) + 1.5 - a.mulai
        else:
            raise SystemExit("Durasi tidak diketahui: isi window.DURASI di HTML, siapkan audio/narasi.mp3, atau pakai --durasi")
        frame = max(1, round(D * a.fps))
        D = frame / a.fps
        n = max(1, min(a.pekerja, frame // 15 or 1))
        print(f"Render {html.name}: {D:.2f} dtk, {frame} frame, {n} pekerja, skala {a.skala}")
        # 2) tangkap frame paralel → potongan perantara → gabung
        potongan = [str(kerja / f"pot_{i}.mp4") for i in range(n)]
        info2 = jalankan_pekerja({**base, "thumbnail": None, "potongan": potongan, "frame": frame}, kerja)
        if info2.get("galat"):
            print("  ! galat JavaScript di halaman:", "; ".join(info2["galat"])[:600])
        daftar = kerja / "daftar.txt"
        daftar.write_text("".join(f"file '{p}'\n" for p in potongan), encoding="utf-8")
        antara = kerja / "antara.mp4"
        jalan(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(daftar), "-c", "copy", str(antara)])
        t_tangkap = time.time() - t_awal
        # 3) audio
        efek = None if a.tanpa_sfx else info.get("efek")
        if not a.tanpa_sfx and (folder / "visual/efek.json").exists():
            efek = json.loads((folder / "visual/efek.json").read_text(encoding="utf-8"))
        musik = pilih_musik(a.musik or info.get("musik"))
        audio = rakit_audio(folder, kerja, D, a.mulai, efek, musik, a.musik_vol, info.get("jeda"))
        # 4) kode akhir (+ kompres ulang bila terlalu besar)
        for crf, mx, bf in ((23, "3M", "6M"), (26, "2.2M", "4.4M"), (28, "1.6M", "3.2M")):
            kode_video(antara, audio, out, crf, mx, bf)
            mb = out.stat().st_size / 1e6
            if mb <= BATAS_MB or uji:
                break
            print(f"  ! {mb:.1f} MB > {BATAS_MB} MB → kompres ulang (crf {crf} terlalu besar)")
        total = time.time() - t_awal
        print(f"Selesai: {out.relative_to(ROOT) if out.is_relative_to(ROOT) else out} | {D:.1f} dtk | {out.stat().st_size / 1e6:.1f} MB | "
              f"musik: {musik.name if musik else '-'} | efek: {len(efek or [])}")
        print(f"Waktu: tangkap frame {t_tangkap:.0f} dtk ({t_tangkap / D:.1f} dtk per dtk video), total {total:.0f} dtk")
        if not uji:
            print(f"Sampul: {folder / 'thumbnail.png'}")
    finally:
        tmp_html.unlink(missing_ok=True)
        shutil.rmtree(kerja, ignore_errors=True)


if __name__ == "__main__":
    main()
