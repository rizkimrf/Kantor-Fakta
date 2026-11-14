"""Agent Editor - visual: gambar kartun (model gambar Gemini) & klip animasi (Veo) per adegan.

Pemakaian:
  python scripts/visual.py antrean/<folder>     -> visual/adegan_N.png|mp4 + visual/thumbnail_dasar.png
  python scripts/visual.py --karakter           -> aset/karakter/tebe_lembar_N.png (sekali, untuk disetujui pemilik)
Butuh: pip install google-genai pillow
Model diatur di .env (nama model bisa berubah sesuai rilis Google; cek di Google AI Studio).
File yang sudah ada dilewati (tidak bayar dua kali). STATUS: BELUM DIUJI - diuji bersama di Fase 4.
"""
import os, sys, time
from pathlib import Path
from _umum import ROOT, muat_env, wajib, baca_naskah, set_status

muat_env()
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client(api_key=wajib("GEMINI_API_KEY"))
MODEL_GAMBAR = wajib("MODEL_GAMBAR")      # model gambar Gemini yang menerima gambar referensi
MODEL_VIDEO = os.environ.get("MODEL_VIDEO", "")   # kosong = tanpa klip video (hanya gambar bergerak, lebih hemat)
PANDUAN = ROOT / "panduan"
GAYA = (PANDUAN / "gaya-visual.md").read_text(encoding="utf-8").split("PROMPT GAYA:")[-1].strip()
TEBE = (PANDUAN / "karakter.md").read_text(encoding="utf-8").split("**Deskripsi tetap (jangan diubah):**")[1] \
    .split("**Ekspresi")[0].strip()
REF_KARAKTER = sorted((ROOT / "aset" / "karakter").glob("*.png"))


def buat_gambar(prompt, keluar, rasio, pakai_ref):
    isi = []
    if pakai_ref:
        if not REF_KARAKTER:
            raise SystemExit("Lembar karakter belum ada. Jalankan dulu: python scripts/visual.py --karakter")
        isi += [Image.open(p) for p in REF_KARAKTER[:3]]
        prompt = ("Use the attached character sheet as the exact reference for Tebe: same face, hair, "
                  "outfit, colors and proportions. " + prompt)
    isi.append(prompt)
    try:   # format konfigurasi terbaru (response_format)
        cfg = types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"],
                                          response_format={"image": {"aspect_ratio": rasio, "image_size": "2K"}})
    except Exception:   # versi SDK lama
        cfg = types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"],
                                          image_config=types.ImageConfig(aspect_ratio=rasio))
    r = client.models.generate_content(model=MODEL_GAMBAR, contents=isi, config=cfg)
    for bagian in r.candidates[0].content.parts:
        if getattr(bagian, "inline_data", None) and bagian.inline_data.data:
            Path(keluar).write_bytes(bagian.inline_data.data)
            return
    raise RuntimeError("Model tidak mengembalikan gambar")


def buat_klip(prompt, gambar_awal, keluar, rasio):
    op = client.models.generate_videos(
        model=MODEL_VIDEO, prompt=prompt,
        image=types.Image.from_file(location=str(gambar_awal)) if gambar_awal else None,
        config=types.GenerateVideosConfig(aspect_ratio=rasio))
    while not op.done:
        time.sleep(15)
        op = client.operations.get(op)
    vid = op.response.generated_videos[0].video
    client.files.download(file=vid)
    vid.save(str(keluar))


def mode_karakter():
    tujuan = ROOT / "aset" / "karakter"
    tujuan.mkdir(parents=True, exist_ok=True)
    pose = ["full-body character turnaround sheet: front view, three-quarter view, side view, back view, "
            "standing neutral, plain cream background",
            "expression sheet: six head close-ups showing curious (hand on chin), shocked (mouth O), explaining "
            "(pointing), laughing, confused (scratching head), proud; plain cream background"]
    for i, p in enumerate(pose, 1):
        keluar = tujuan / f"tebe_lembar_{i}.png"
        if not keluar.exists():
            buat_gambar(f"{TEBE} {p}. {GAYA}", keluar, "16:9", pakai_ref=False)
            print(f"Dibuat: {keluar.name}")
    print("Periksa aset/karakter/. Hapus yang tidak disukai lalu jalankan lagi. Setelah cocok, jangan diubah lagi.")


def mode_video(folder):
    naskah = baca_naskah(folder)
    rasio = "16:9" if naskah.get("format") == "panjang" else "9:16"
    (folder / "visual").mkdir(exist_ok=True)
    tugas = [(a["no"], a["visual"], a.get("maskot", False), a.get("jenis_visual", "gambar"))
             for a in naskah["adegan"]]
    tugas.append(("thumbnail_dasar", naskah.get("thumbnail_visual", naskah["adegan"][0]["visual"]), True, "gambar"))
    for no, deskripsi, maskot, jenis in tugas:
        nama = f"adegan_{no}" if no != "thumbnail_dasar" else no
        png, mp4 = folder / "visual" / f"{nama}.png", folder / "visual" / f"{nama}.mp4"
        if png.exists() and (jenis != "klip" or mp4.exists() or not MODEL_VIDEO):
            continue
        tambahan = f" Tebe looks like this: {TEBE}" if maskot else ""
        if no == "thumbnail_dasar":
            tambahan += " YouTube thumbnail composition: big expressive Tebe, one bold main object, high contrast, empty space at the top for a title."
        if not png.exists():
            buat_gambar(f"{deskripsi}.{tambahan} {GAYA}", png, rasio, pakai_ref=maskot)
            print(f"{nama}: gambar OK")
        if jenis == "klip" and MODEL_VIDEO and not mp4.exists():
            buat_klip(f"Animate this cartoon scene with gentle, natural motion: {deskripsi}. Keep the exact "
                      f"cartoon style and characters. No text. Quiet ambience only, no music, no voices.",
                      png, mp4, rasio)
            print(f"{nama}: klip OK")
    set_status(folder, masalah=None)
    print("Visual selesai.")


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "--karakter":
        mode_karakter()
    elif len(sys.argv) == 2:
        mode_video(Path(sys.argv[1]))
    else:
        raise SystemExit(__doc__)
