"""Cek teknis final.mp4 (dipakai manajer saat review). Pemakaian: python scripts/cek_video.py antrean/<folder>"""
import json, subprocess, sys
from pathlib import Path

folder = Path(sys.argv[1]); f = folder / "final.mp4"
if not f.exists():
    raise SystemExit("final.mp4 belum ada")
panjang = json.loads((folder / "naskah.json").read_text(encoding="utf-8")).get("format") == "panjang"
info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries",
    "format=duration,size:stream=codec_type,width,height", "-of", "json", str(f)],
    capture_output=True, text=True).stdout)
dur = float(info["format"]["duration"]); mb = int(info["format"]["size"]) / 1e6
video = [s for s in info["streams"] if s["codec_type"] == "video"]
audio = [s for s in info["streams"] if s["codec_type"] == "audio"]
target = (1920, 1080) if panjang else (1080, 1920)
batas = (180, 720) if panjang else (15, 59)
masalah = []
if not video or (video[0]["width"], video[0]["height"]) != target: masalah.append(f"resolusi bukan {target[0]}x{target[1]}")
if not audio: masalah.append("tidak ada audio")
if not batas[0] <= dur <= batas[1]: masalah.append(f"durasi {dur:.0f} dtk di luar {batas[0]}-{batas[1]} dtk")
if not (folder / "thumbnail.png").exists(): masalah.append("thumbnail.png belum ada")
print(f"{'Video panjang' if panjang else 'Shorts'} | {dur:.1f} dtk | {mb:.1f} MB | audio: {'ada' if audio else 'TIDAK ADA'}")
print("LULUS" if not masalah else "MASALAH: " + "; ".join(masalah))
