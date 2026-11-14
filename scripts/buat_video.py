"""Membuat folder video baru di antrean.
Pemakaian: python scripts/buat_video.py "topik singkat"   (topik boleh kosong: agent Riset yang memilih)
"""
import datetime, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
topik = " ".join(sys.argv[1:]).strip()
tanggal = datetime.date.today().isoformat()
slug = re.sub(r"[^a-z0-9]+", "-", topik.lower()).strip("-")[:40] or "topik-bebas"
folder = ROOT / "antrean" / f"{tanggal}_{slug}"
n = 2
while folder.exists():
    folder = ROOT / "antrean" / f"{tanggal}_{slug}-{n}"
    n += 1
for sub in ("audio", "visual"):
    (folder / sub).mkdir(parents=True)
status = {"tahap": "ide", "topik": topik or None, "dibuat": datetime.datetime.now().isoformat(timespec="minutes"),
          "riwayat": [], "masalah": None}
(folder / "status.json").write_text(json.dumps(status, indent=2, ensure_ascii=False), encoding="utf-8")
print(folder.relative_to(ROOT))
