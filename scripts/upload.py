"""Agent Marketing - upload: upload video yang SUDAH DISETUJUI dengan jadwal tayang.
Pemakaian: python scripts/upload.py antrean/<folder>
Butuh: pip install google-api-python-client google-auth-oauthlib
       client_secret.json (OAuth Desktop app) di folder utama. Login pertama membuka browser."""
import datetime, json, os, sys
from pathlib import Path
from _umum import ROOT, muat_env, baca_naskah, set_status
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

muat_env()
folder = Path(sys.argv[1])
status = json.loads((folder / "status.json").read_text(encoding="utf-8"))
if status["tahap"] != "disetujui":
    raise SystemExit("Ditolak: video ini belum disetujui pemilik.")

SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"]
token = ROOT / "token.json"
cred = Credentials.from_authorized_user_file(str(token), SCOPES) if token.exists() else None
if not cred or not cred.valid:
    if cred and cred.expired and cred.refresh_token:
        cred.refresh(Request())
    else:
        cred = InstalledAppFlow.from_client_secrets_file(str(ROOT / "client_secret.json"), SCOPES).run_local_server(port=0)
    token.write_text(cred.to_json(), encoding="utf-8")

n = baca_naskah(folder)
panjang = n.get("format") == "panjang"
# Slot tayang: slot kosong berikutnya (WITA, UTC+8). Shorts bisa beberapa jam per hari.
jam_list = [int(j) for j in os.environ.get("JAM_TAYANG_PANJANG" if panjang else "JAM_TAYANG_SHORTS",
                                           "19" if panjang else "12,18").split(",")]
terpakai = {json.loads(p.read_text(encoding="utf-8")).get("jadwal_tayang")
            for p in (ROOT / "antrean").glob("*/status.json")}
wita = datetime.timezone(datetime.timedelta(hours=8))
sekarang = datetime.datetime.now(wita)
hari, slot = sekarang.date(), None
while slot is None:
    for jam in sorted(jam_list):
        kandidat = datetime.datetime.combine(hari, datetime.time(jam), wita)
        if kandidat > sekarang + datetime.timedelta(hours=2) and kandidat.isoformat() not in terpakai:
            slot = kandidat.isoformat()
            break
    hari += datetime.timedelta(days=1)

body = {"snippet": {"title": n["judul"], "description": n["deskripsi"] + ("" if panjang else "\n#Shorts"), "tags": n["tag"], "categoryId": "27"},
        "status": {"privacyStatus": "private", "publishAt": slot,
                   "selfDeclaredMadeForKids": False, "containsSyntheticMedia": True}}
yt = build("youtube", "v3", credentials=cred)
req = yt.videos().insert(part="snippet,status", body=body,
                         media_body=MediaFileUpload(str(folder / "final.mp4"), chunksize=-1, resumable=True))
resp = None
while resp is None:
    _, resp = req.next_chunk()
if panjang and (folder / "thumbnail.png").exists():
    try:  # butuh channel yang sudah verifikasi nomor HP
        yt.thumbnails().set(videoId=resp["id"], media_body=MediaFileUpload(str(folder / "thumbnail.png"))).execute()
    except Exception as e:
        print(f"Thumbnail belum terpasang ({e}); pasang manual di YouTube Studio.")
set_status(folder, "terjadwal", video_id=resp["id"], jadwal_tayang=slot)
print(f"Terjadwal: https://youtu.be/{resp['id']} tayang {slot}")
