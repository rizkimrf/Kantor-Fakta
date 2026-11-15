"""Yoga - suara narasi SATU KALI BACA via ElevenLabs (suara resmi: Dakocan, model Eleven v4).
Pemakaian: python scripts/suara.py antrean/<folder>
Masukan : antrean/<folder>/naskah_suara.txt (teks + tag emosi v4, angka ditulis seperti diucapkan; lihat panduan/gaya-suara.md)
Keluaran: audio/narasi.mp3 + audio/waktu_kata.json (detik mulai/selesai tiap kata -> teks layar & mulut Tebe pas dengan suara)
Narasi yang sudah ada tidak dibuat ulang (hemat kredit). Hapus audio/narasi.mp3 untuk membuat versi baru."""
import base64, json, os, re, sys, urllib.request, urllib.error
from pathlib import Path
from _umum import muat_env, wajib, set_status

muat_env()
kunci, suara_id = wajib("ELEVENLABS_API_KEY"), wajib("ELEVENLABS_VOICE_ID")
folder = Path(sys.argv[1])
(folder / "audio").mkdir(exist_ok=True)
keluar, waktu = folder / "audio" / "narasi.mp3", folder / "audio" / "waktu_kata.json"
if keluar.exists():
    raise SystemExit("Narasi sudah ada - dilewati.")


def api(path, data=None):
    req = urllib.request.Request(f"https://api.elevenlabs.io{path}", data=json.dumps(data).encode() if data else None,
                                 method="POST" if data else "GET",
                                 headers={"xi-api-key": kunci, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.loads(r.read())


# Model: pakai ELEVENLABS_MODEL bila diisi; kalau kosong pilih model "eleven_v4..." terbaru yang tersedia di akun.
model = os.environ.get("ELEVENLABS_MODEL", "").strip()
if not model:
    ids = [m["model_id"] for m in api("/v1/models") if m.get("can_do_text_to_speech")]
    model = next((i for i in ids if i.startswith("eleven_v4")), next((i for i in ids if i.startswith("eleven_v3")), ids[0]))

teks = (folder / "naskah_suara.txt").read_text(encoding="utf-8").strip()
try:
    hasil = api(f"/v1/text-to-speech/{suara_id}/with-timestamps",
                {"text": teks, "model_id": model, "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}})
except urllib.error.URLError as e:
    set_status(folder, masalah=f"suara ElevenLabs: {e}")
    raise SystemExit(f"Gagal membuat suara: {e}")

keluar.write_bytes(base64.b64decode(hasil["audio_base64"]))
al = hasil.get("alignment") or hasil.get("normalized_alignment")
kata = []
if al:  # gabungkan huruf menjadi kata; tag [excited] dll tidak ikut
    buf, mulai, dalam_tag = "", None, False
    for c, a, b in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if c == "[": dalam_tag = True
        if dalam_tag:
            if c == "]": dalam_tag = False
            continue
        if c.isspace():
            if buf: kata.append({"kata": buf, "mulai": round(mulai, 3), "selesai": round(akhir, 3)})
            buf, mulai = "", None
        else:
            buf += c; mulai = a if mulai is None else mulai; akhir = b
    if buf: kata.append({"kata": buf, "mulai": round(mulai, 3), "selesai": round(akhir, 3)})
waktu.write_text(json.dumps({"model": model, "kata": kata}, ensure_ascii=False, indent=1), encoding="utf-8")
set_status(folder, masalah=None)
print(f"Suara selesai ({model}), {len(kata)} kata bertanda waktu.")
