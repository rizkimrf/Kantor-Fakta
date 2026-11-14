"""Agent Editor: merakit satu video Shorts dari folder antrean.

Pemakaian:  python scripts/rakit.py antrean/2026-11-15_contoh

Butuh: ffmpeg & ffprobe di PATH. Hanya pakai pustaka standar Python.
Input di folder video:
  naskah.json                 (dari agent Naskah)
  audio/adegan_N.mp3          (dari agent Suara)
  visual/adegan_N.png|jpg|mp4 (dari agent Visual)
Output:
  final.mp4  (Shorts 1080x1920 atau "format": "panjang" 1920x1080, 30 fps, subtitle tertanam, -14 LUFS)
(thumbnail dibuat terpisah oleh scripts/thumbnail.py)
"""
import json
import os
import random
import shutil
import subprocess
import sys
from pathlib import Path

W, H, FPS = 1080, 1920, 30
JEDA = 0.25  # detik hening di akhir tiap adegan
ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / "aset" / "font"
MUSIK_DIR = ROOT / "aset" / "musik"


def jalankan(cmd, cwd=None):
    hasil = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if hasil.returncode != 0:
        print(hasil.stderr[-2000:])
        raise SystemExit(f"ffmpeg gagal: {' '.join(map(str, cmd[:6]))} ...")
    return hasil.stdout


def durasi(path):
    out = jalankan(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                    "-of", "csv=p=0", str(path)])
    return float(out.strip())


def cari_visual(folder, no):
    for ext in (".mp4", ".mov", ".png", ".jpg", ".jpeg", ".webp"):
        p = folder / "visual" / f"adegan_{no}{ext}"
        if p.exists():
            return p
    return None


def waktu_ass(t):
    jam, sisa = divmod(t, 3600)
    menit, detik = divmod(sisa, 60)
    return f"{int(jam)}:{int(menit):02d}:{detik:05.2f}"


def bersihkan(teks):
    return teks.replace("\\", "").replace("{", "(").replace("}", ")").replace("\n", " ")


def tulis_subtitle(adegan_list, durasi_list, path):
    """Subtitle 3-4 kata per potong, dibagi proporsional jumlah kata."""
    if W > H:   # video panjang 16:9
        uk_narasi, uk_judul, mv_narasi, mv_judul = 72, 72, 80, 60
    else:       # Shorts 9:16 (subtitle di atas area tombol Shorts)
        uk_narasi, uk_judul, mv_narasi, mv_judul = 100, 96, 560, 300
    kepala = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Narasi,Poppins,{uk_narasi},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,5,2,2,90,90,{mv_narasi},1
Style: Judul,Poppins,{uk_judul},&H0000E5FF,&H0000E5FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,5,2,8,80,80,{mv_judul},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    baris = []
    t0 = 0.0
    for adegan, dur in zip(adegan_list, durasi_list):
        bicara = max(dur - JEDA, 0.5)
        kata = adegan["narasi"].split()
        potong = [kata[i:i + 4] for i in range(0, len(kata), 4)] or [[""]]
        total_kata = sum(len(p) for p in potong)
        t = t0
        for p in potong:
            d = bicara * len(p) / total_kata
            baris.append(f"Dialogue: 0,{waktu_ass(t)},{waktu_ass(t + d)},Narasi,,0,0,0,,"
                         f"{{\\fad(60,0)}}{bersihkan(' '.join(p))}")
            t += d
        if adegan.get("teks_layar"):
            baris.append(f"Dialogue: 1,{waktu_ass(t0)},{waktu_ass(t0 + dur)},Judul,,0,0,0,,"
                         f"{{\\fad(150,150)}}{bersihkan(adegan['teks_layar']).upper()}")
        t0 += dur
    path.write_text(kepala + "\n".join(baris) + "\n", encoding="utf-8")


def segmen_gambar(gambar, audio, dur, keluar, arah):
    # Gambar dibesarkan 18% lalu digeser pelan (efek Ken Burns), arah bergantian.
    sw, sh = int(W * 1.18), int(H * 1.18)
    dx, dy = sw - W, sh - H
    gerak = {
        0: (f"{dx}/2*(1-t/{dur})", f"{dy}*(1-t/{dur})"),   # naik
        1: (f"{dx}*t/{dur}", f"{dy}/2"),                    # geser kanan
        2: (f"{dx}/2", f"{dy}*t/{dur}"),                    # turun
        3: (f"{dx}*(1-t/{dur})", f"{dy}/2"),                # geser kiri
    }[arah % 4]
    vf = (f"scale={sw}:{sh}:force_original_aspect_ratio=increase,crop={sw}:{sh},"
          f"crop={W}:{H}:x='{gerak[0]}':y='{gerak[1]}',fps={FPS},format=yuv420p,"
          f"fade=t=in:st=0:d=0.2")
    jalankan(["ffmpeg", "-y", "-loop", "1", "-framerate", str(FPS), "-i", str(gambar),
              "-i", str(audio), "-vf", vf, "-af", f"apad=whole_dur={dur}",
              "-t", f"{dur:.3f}", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
              "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", str(keluar)])


def segmen_klip(klip, audio, dur, keluar):
    vf = (f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
          f"fps={FPS},format=yuv420p")
    jalankan(["ffmpeg", "-y", "-stream_loop", "-1", "-i", str(klip), "-i", str(audio),
              "-map", "0:v", "-map", "1:a", "-vf", vf, "-af", f"apad=whole_dur={dur}",
              "-t", f"{dur:.3f}", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
              "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", str(keluar)])


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Pemakaian: python scripts/rakit.py antrean/<folder>")
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg tidak ditemukan. Pasang dulu (lihat SETUP-WINDOWS.md).")

    folder = Path(sys.argv[1]).resolve()
    naskah = json.loads((folder / "naskah.json").read_text(encoding="utf-8"))
    global W, H
    if naskah.get("format") == "panjang":
        W, H = 1920, 1080
    adegan_list = naskah["adegan"]
    kerja = folder / "_kerja"
    kerja.mkdir(exist_ok=True)

    hilang = []
    for a in adegan_list:
        if not (folder / "audio" / f"adegan_{a['no']}.mp3").exists():
            hilang.append(f"audio adegan {a['no']}")
        if not cari_visual(folder, a["no"]):
            hilang.append(f"visual adegan {a['no']}")
    if hilang:
        raise SystemExit("File belum lengkap: " + ", ".join(hilang))

    durasi_list, daftar = [], []
    for i, a in enumerate(adegan_list):
        audio = folder / "audio" / f"adegan_{a['no']}.mp3"
        dur = durasi(audio) + JEDA
        durasi_list.append(dur)
        visual = cari_visual(folder, a["no"])
        seg = kerja / f"seg_{a['no']:02d}.mp4"
        print(f"Adegan {a['no']}: {dur:.1f} dtk ({visual.name})")
        if visual.suffix.lower() in (".mp4", ".mov"):
            segmen_klip(visual, audio, dur, seg)
        else:
            segmen_gambar(visual, audio, dur, seg, i)
        daftar.append(f"file '{seg.name}'")
    (kerja / "daftar.txt").write_text("\n".join(daftar) + "\n", encoding="utf-8")

    jalankan(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", "daftar.txt",
              "-c", "copy", "gabung.mp4"], cwd=kerja)

    tulis_subtitle(adegan_list, durasi_list, kerja / "sub.ass")
    font_rel = os.path.relpath(FONT_DIR, kerja).replace("\\", "/")
    vf = f"subtitles=sub.ass:fontsdir={font_rel}"

    musik = sorted(MUSIK_DIR.glob("*.mp3")) + sorted(MUSIK_DIR.glob("*.m4a"))
    total = sum(durasi_list)
    cmd = ["ffmpeg", "-y", "-i", "gabung.mp4"]
    if musik:
        lagu = random.choice(musik)
        print(f"Musik: {lagu.name}")
        cmd += ["-stream_loop", "-1", "-i", str(lagu),
                "-filter_complex",
                f"[0:v]{vf}[v];[1:a]volume=0.12,afade=t=out:st={max(total - 1.5, 0):.2f}:d=1.5[m];"
                f"[0:a][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]",
                "-map", "[v]", "-map", "[a]"]
    else:
        cmd += ["-vf", vf, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11"]
    cmd += ["-t", f"{total:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "19",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
            "-movflags", "+faststart", str(folder / "final.mp4")]
    jalankan(cmd, cwd=kerja)

    shutil.rmtree(kerja, ignore_errors=True)
    print(f"Selesai: final.mp4 ({total:.1f} detik)")


if __name__ == "__main__":
    main()
