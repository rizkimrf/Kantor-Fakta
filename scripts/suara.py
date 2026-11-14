"""Agent Suara: narasi per adegan via ElevenLabs. Pemakaian: python scripts/suara.py antrean/<folder>
Adegan yang audionya sudah ada dilewati (tidak bayar dua kali)."""
import json, sys, urllib.request, urllib.error
from pathlib import Path
from _umum import muat_env, wajib, baca_naskah, set_status

muat_env()
kunci, suara_id = wajib("ELEVENLABS_API_KEY"), wajib("ELEVENLABS_VOICE_ID")
model = __import__("os").environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")
folder = Path(sys.argv[1])
(folder / "audio").mkdir(exist_ok=True)

import re
naskah = baca_naskah(folder)
LAFAL = naskah.get("pelafalan", {})


def siapkan_teks(teks):
    """Kata KAPITAL (penekanan) dibuat huruf biasa supaya tidak dieja; nama sulit diganti cara bacanya."""
    teks = re.sub(r"\b([A-Z]{2,})\b", lambda m: m.group(1).lower() if len(m.group(1)) > 3 else m.group(1), teks)
    for tulis, baca in LAFAL.items():
        teks = teks.replace(tulis, baca)
    return teks


for a in naskah["adegan"]:
    keluar = folder / "audio" / f"adegan_{a['no']}.mp3"
    if keluar.exists():
        continue
    data = json.dumps({"text": siapkan_teks(a["narasi"]), "model_id": model,
                       "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}}).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{suara_id}", data=data, method="POST",
        headers={"xi-api-key": kunci, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            keluar.write_bytes(r.read())
        print(f"Adegan {a['no']}: OK")
    except urllib.error.URLError as e:
        set_status(folder, masalah=f"suara adegan {a['no']}: {e}")
        raise SystemExit(f"Gagal di adegan {a['no']}: {e}")

set_status(folder, masalah=None)
print("Suara selesai.")
