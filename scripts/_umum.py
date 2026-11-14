"""Fungsi bersama: membaca .env dan memperbarui status.json."""
import datetime, json, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def muat_env():
    env = ROOT / ".env"
    if not env.exists():
        raise SystemExit("File .env belum ada. Salin .env.example menjadi .env lalu isi kuncinya.")
    for baris in env.read_text(encoding="utf-8").splitlines():
        baris = baris.strip()
        if baris and not baris.startswith("#") and "=" in baris:
            k, v = baris.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"'))


def wajib(nama):
    nilai = os.environ.get(nama)
    if not nilai:
        raise SystemExit(f"{nama} belum diisi di .env")
    return nilai


def baca_naskah(folder):
    return json.loads((Path(folder) / "naskah.json").read_text(encoding="utf-8"))


def set_status(folder, tahap=None, **lain):
    p = Path(folder) / "status.json"
    s = json.loads(p.read_text(encoding="utf-8"))
    if tahap:
        s["riwayat"].append({"dari": s["tahap"], "ke": tahap,
                             "waktu": datetime.datetime.now().isoformat(timespec="minutes")})
        s["tahap"] = tahap
    s.update(lain)
    p.write_text(json.dumps(s, indent=2, ensure_ascii=False), encoding="utf-8")
