"""Agent Editor: membuat thumbnail bergaya kartun dengan teks tebal.

Pemakaian: python scripts/thumbnail.py antrean/<folder>
Butuh: pip install pillow
Input : visual/thumbnail_dasar.png (gambar kartun khusus thumbnail, dibuat visual.py)
        atau, jika tidak ada, visual/adegan_1.png
        naskah.json -> "thumbnail_teks" (2-4 kata, mis. "NEGARA TERENAK?")
Output: thumbnail.png (1280x720 untuk video panjang, 1080x1920 untuk Shorts)
"""
import json
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "aset" / "font" / "Poppins-Bold.ttf"
KUNING = (255, 229, 0)


def cover(img, w, h):
    skala = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * skala), round(img.height * skala)), Image.LANCZOS)
    x, y = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((x, y, x + w, y + h))


def pecah_baris(teks, font, lebar_maks, draw):
    kata, baris, sekarang = teks.split(), [], ""
    for k in kata:
        coba = (sekarang + " " + k).strip()
        if draw.textlength(coba, font=font) <= lebar_maks or not sekarang:
            sekarang = coba
        else:
            baris.append(sekarang)
            sekarang = k
    baris.append(sekarang)
    return baris


def main():
    folder = Path(sys.argv[1])
    naskah = json.loads((folder / "naskah.json").read_text(encoding="utf-8"))
    panjang = naskah.get("format") == "panjang"
    W, H = (1280, 720) if panjang else (1080, 1920)

    dasar = folder / "visual" / "thumbnail_dasar.png"
    if not dasar.exists():
        dasar = folder / "visual" / "adegan_1.png"
    img = cover(Image.open(dasar).convert("RGB"), W, H)

    teks = (naskah.get("thumbnail_teks") or naskah["judul"]).upper()
    draw = ImageDraw.Draw(img)
    ukuran = int(H * (0.15 if panjang else 0.075))
    lebar_maks = W * 0.9
    while True:
        font = ImageFont.truetype(str(FONT), ukuran)
        baris = pecah_baris(teks, font, lebar_maks, draw)
        if len(baris) <= 2 and all(draw.textlength(b, font=font) <= lebar_maks for b in baris):
            break
        ukuran -= 4

    # bayangan gelap lembut di atas supaya teks selalu terbaca
    gelap = Image.new("L", (W, H), 0)
    ImageDraw.Draw(gelap).rectangle([0, 0, W, int(H * (0.42 if panjang else 0.3))], fill=150)
    gelap = gelap.filter(ImageFilter.GaussianBlur(H // 12))
    img = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), img, gelap)
    draw = ImageDraw.Draw(img)

    tinggi_baris = int(ukuran * 1.08)
    y = int(H * (0.05 if panjang else 0.1))
    tebal = max(4, ukuran // 9)
    for i, b in enumerate(baris):
        x = (W - draw.textlength(b, font=font)) / 2
        warna = KUNING if (i == len(baris) - 1 and len(baris) > 1) else (255, 255, 255)
        draw.text((x + tebal * 0.6, y + tebal * 0.8), b, font=font, fill=(0, 0, 0),
                  stroke_width=tebal, stroke_fill=(0, 0, 0))
        draw.text((x, y), b, font=font, fill=warna, stroke_width=tebal, stroke_fill=(0, 0, 0))
        y += tinggi_baris

    img.save(folder / "thumbnail.png")
    print(f"thumbnail.png {W}x{H}: {teks}")


if __name__ == "__main__":
    main()
