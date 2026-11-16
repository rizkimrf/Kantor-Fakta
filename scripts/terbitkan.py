"""Raka - TERBITKAN video yang SUDAH DISETUJUI Bos ke YouTube, TikTok, Instagram sesuai jam tayang.
Pemakaian: python scripts/terbitkan.py            (semua folder antrean)
           python scripts/terbitkan.py --cek      (hanya tampilkan rencana, tidak mengunggah)
Dijalankan otomatis oleh tugas terjadwal di cloud (lihat .claude/commands/terbitkan.md).

Aturan:
- Hanya folder dengan tahap "disetujui" atau "terjadwal". Status "disetujui" HANYA dari Bos.
- Jadwal: slot berikutnya dari jam_tayang.json (WITA) bila belum ada `jadwal_tayang`.
- YouTube diunggah segera dengan publishAt = jadwal (YouTube yang menayangkan tepat waktu).
- TikTok & Instagram diunggah saat jadwal sudah tiba (paling cepat 15 menit sebelum).
- Sampul = frame pertama video (video_cover_timestamp_ms=0 / thumb_offset=0). Label AI: YouTube containsSyntheticMedia,
  TikTok is_aigc (mode direct; mode inbox: Bos menyalakan saat Posting). Instagram API TIDAK punya tombol label AI ->
  ingatkan Bos menyalakan "Label AI" di aplikasi setelah Reels terbit.
- Data teks dari antrean/<folder>/unggah.json (ditulis Raka):
  {"youtube":{"judul":"","deskripsi":"","tag":[]}, "tiktok":{"caption":""}, "instagram":{"caption":""}}
- Platform yang kuncinya belum diisi dilewati (dicatat di status.json -> "terbit")."""
import datetime, json, os, sys, time, urllib.parse, urllib.request, urllib.error
from pathlib import Path
from _umum import ROOT, muat_env, set_status

muat_env()
CEK = "--cek" in sys.argv
if "--uji" in sys.argv:  # uji koneksi tanpa mengunggah apa pun; tidak pernah mencetak kunci/token
    def _uji(nama, f):
        try: print(f"{nama}: OK - {f()}")
        except Exception as e: print(f"{nama}: GAGAL - {str(e)[:600]}")
    for k in ["ELEVENLABS_API_KEY", "ELEVENLABS_VOICE_ID", "IG_ACCESS_TOKEN", "IG_USER_ID", "TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN",
              "TIKTOK_MODE", "YT_AUDIT_LOLOS"]:
        print(f"{k}: {'terisi' if os.environ.get(k) else 'KOSONG'}")
    def _ig():
        r = urllib.request.urlopen(f"https://graph.facebook.com/v21.0/{os.environ['IG_USER_ID']}?fields=username"
                                   f"&access_token={os.environ['IG_ACCESS_TOKEN']}", timeout=60)
        return "akun @" + json.loads(r.read())["username"]
    def _ig_unggah():  # host unggahan video Instagram (cukup terjangkau; 4xx = host terbuka)
        try: urllib.request.urlopen("https://rupload.facebook.com/", timeout=30)
        except urllib.error.HTTPError as e: return f"host terjangkau (HTTP {e.code})"
        return "host terjangkau"
    def _tt():
        d = urllib.parse.urlencode({"client_key": os.environ["TIKTOK_CLIENT_KEY"], "client_secret": os.environ["TIKTOK_CLIENT_SECRET"],
                                    "grant_type": "refresh_token", "refresh_token": os.environ["TIKTOK_REFRESH_TOKEN"]}).encode()
        t = json.loads(urllib.request.urlopen(urllib.request.Request("https://open.tiktokapis.com/v2/oauth/token/", d,
                        {"Content-Type": "application/x-www-form-urlencoded"}), timeout=60).read())
        if "access_token" not in t: raise RuntimeError(t.get("error_description") or t.get("error"))
        u = json.loads(urllib.request.urlopen(urllib.request.Request(
            "https://open.tiktokapis.com/v2/user/info/?fields=display_name",
            headers={"Authorization": f"Bearer {t['access_token']}"}), timeout=60).read())
        sama = "refresh token tetap" if t.get("refresh_token") == os.environ["TIKTOK_REFRESH_TOKEN"] else "REFRESH TOKEN BERGANTI"
        return f"akun {u['data']['user']['display_name']}, scope {t.get('scope')}, {sama}"
    def _el():  # cek kunci ElevenLabs tanpa memakai kredit suara
        r = urllib.request.Request("https://api.elevenlabs.io/v1/voices/" + os.environ.get("ELEVENLABS_VOICE_ID", ""),
                                   headers={"xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "")})
        return "suara " + json.loads(urllib.request.urlopen(r, timeout=60).read()).get("name", "?")
    def _ig_coba():  # unggah video uji 3 dtk ke kontainer Reels TANPA diterbitkan (kontainer kedaluwarsa sendiri 24 jam)
        import subprocess, tempfile
        f = Path(tempfile.mkdtemp()) / "uji.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "color=c=0x1E88E5:s=1080x1920:r=30:d=3",
                        "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", "3", "-c:v", "libx264", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-movflags", "+faststart", str(f)], check=True)
        tok, uid = os.environ["IG_ACCESS_TOKEN"], os.environ["IG_USER_ID"]
        c = form(f"https://graph.facebook.com/v21.0/{uid}/media", media_type="REELS", upload_type="resumable",
                 caption="uji", access_token=tok)
        b = f.read_bytes()
        try:
            r = http(c["uri"], b, {"Authorization": f"OAuth {tok}", "offset": "0", "file_size": str(len(b)),
                                   "Content-Type": "application/octet-stream"})
        except RuntimeError as e:
            raise RuntimeError(str(e).replace(tok, "[token]")[:600])
        return f"kontainer {c['id']} diterima: {r}"
    _uji("Instagram", _ig); _uji("Instagram unggah", _ig_unggah); _uji("Instagram unggah video uji", _ig_coba); _uji("TikTok", _tt); _uji("ElevenLabs", _el)
    raise SystemExit(0)
WITA = datetime.timezone(datetime.timedelta(hours=8))
SEKARANG = datetime.datetime.now(WITA)


def http(url, data=None, headers=None, method=None, raw=False):
    if isinstance(data, dict):
        data = json.dumps(data).encode(); headers = {"Content-Type": "application/json", **(headers or {})}
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method or ("POST" if data else "GET"))
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            body = r.read()
            return r if raw else (json.loads(body) if body else {})
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"{e.code} {url.split('?')[0]}: {e.read()[:400]!r}")


def form(url, **f):
    return http(url, urllib.parse.urlencode(f).encode(), {"Content-Type": "application/x-www-form-urlencoded"})


# ---------- YouTube ----------
def youtube(folder, u, jadwal):
    tok = form("https://oauth2.googleapis.com/token", client_id=os.environ["YT_CLIENT_ID"],
               client_secret=os.environ["YT_CLIENT_SECRET"], refresh_token=os.environ["YT_REFRESH_TOKEN"],
               grant_type="refresh_token")["access_token"]
    auth = {"Authorization": f"Bearer {tok}"}
    y = u["youtube"]
    status = {"privacyStatus": "public", "selfDeclaredMadeForKids": False, "containsSyntheticMedia": True}
    if jadwal > SEKARANG + datetime.timedelta(minutes=20):
        status.update(privacyStatus="private", publishAt=jadwal.isoformat())
    meta = {"snippet": {"title": y["judul"][:100], "description": y["deskripsi"], "tags": y.get("tag", []),
                        "categoryId": "27", "defaultLanguage": "id"}, "status": status}
    r = http("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
             meta, auth, raw=True)
    video = (folder / "final.mp4").read_bytes()
    vid = http(r.headers["Location"], video, {**auth, "Content-Type": "video/mp4"}, "PUT")["id"]
    thumb = folder / "thumbnail.png"
    if thumb.exists():
        try:  # butuh channel terverifikasi HP; untuk Shorts, sampul tetap frame pertama video
            http(f"https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId={vid}", thumb.read_bytes(),
                 {**auth, "Content-Type": "image/png"})
        except RuntimeError as e:
            print("  thumbnail YouTube belum terpasang:", e)
    return vid


# ---------- TikTok ----------
def tiktok(folder, u):
    tok = form("https://open.tiktokapis.com/v2/oauth/token/", client_key=os.environ["TIKTOK_CLIENT_KEY"],
               client_secret=os.environ["TIKTOK_CLIENT_SECRET"], grant_type="refresh_token",
               refresh_token=os.environ["TIKTOK_REFRESH_TOKEN"])["access_token"]
    auth = {"Authorization": f"Bearer {tok}"}
    video = (folder / "final.mp4").read_bytes()
    src = {"source": "FILE_UPLOAD", "video_size": len(video), "chunk_size": len(video), "total_chunk_count": 1}
    if os.environ.get("TIKTOK_MODE", "inbox") == "direct":   # setelah aplikasi TikTok lolos audit
        body = {"post_info": {"title": u["tiktok"]["caption"][:2200], "privacy_level": "PUBLIC_TO_EVERYONE",
                              "video_cover_timestamp_ms": 0, "is_aigc": True}, "source_info": src}
        url = "https://open.tiktokapis.com/v2/post/publish/video/init/"
    else:  # sebelum audit: masuk kotak masuk TikTok, Bos tinggal tekan Posting di aplikasi
        body, url = {"source_info": src}, "https://open.tiktokapis.com/v2/post/publish/inbox/video/init/"
    d = http(url, body, auth)["data"]
    http(d["upload_url"], video, {"Content-Type": "video/mp4",
                                 "Content-Range": f"bytes 0-{len(video) - 1}/{len(video)}"}, "PUT")
    return d["publish_id"]


# ---------- Instagram (lewat Halaman Facebook + Graph API; unggah langsung tanpa link publik) ----------
def instagram(folder, u):
    tok, uid = os.environ["IG_ACCESS_TOKEN"], os.environ["IG_USER_ID"]
    g = "https://graph.facebook.com/v21.0"  # IG_ACCESS_TOKEN = token Halaman Facebook (tidak kedaluwarsa)
    c = form(f"{g}/{uid}/media", media_type="REELS", upload_type="resumable", caption=u["instagram"]["caption"],
             share_to_feed="true", thumb_offset="0", access_token=tok)
    video = (folder / "final.mp4").read_bytes()
    http(c["uri"], video, {"Authorization": f"OAuth {tok}", "offset": "0", "file_size": str(len(video)),
                            "Content-Type": "application/octet-stream"})  # cegah urllib mengirim form-urlencoded default
    for _ in range(60):
        st = http(f"{g}/{c['id']}?fields=status_code&access_token={tok}").get("status_code")
        if st == "FINISHED": break
        if st == "ERROR": raise RuntimeError("Instagram gagal memproses video")
        time.sleep(10)
    return form(f"{g}/{uid}/media_publish", creation_id=c["id"], access_token=tok)["id"]


PLATFORM = {"youtube": (youtube, ["YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"]),
            "tiktok": (tiktok, ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN"]),
            "instagram": (instagram, ["IG_ACCESS_TOKEN", "IG_USER_ID"])}


def slot_berikut(panjang):
    # Jam tayang dari jam_tayang.json di repo (bukan environment), format "HH:MM" WITA.
    cfg = json.loads((ROOT / "jam_tayang.json").read_text(encoding="utf-8"))
    jam = cfg["panjang"] if panjang else cfg["shorts"][:int(cfg.get("shorts_per_hari", 2))]
    jam = [datetime.time(*map(int, j.split(":"))) for j in jam]
    terpakai = {json.loads(p.read_text(encoding="utf-8")).get("jadwal_tayang") for p in (ROOT / "antrean").glob("*/status.json")}
    hari = SEKARANG.date()
    while True:
        for j in sorted(jam):
            k = datetime.datetime.combine(hari, j, WITA)
            if k > SEKARANG + datetime.timedelta(minutes=45) and k.isoformat() not in terpakai:
                return k
        hari += datetime.timedelta(days=1)


laporan = []
for st_path in sorted((ROOT / "antrean").glob("*/status.json")):
    folder, s = st_path.parent, json.loads(st_path.read_text(encoding="utf-8"))
    if s.get("tahap") not in ("disetujui", "terjadwal"):
        continue
    if not (folder / "final.mp4").exists() or not (folder / "unggah.json").exists():
        laporan.append(f"{folder.name}: final.mp4 / unggah.json belum ada"); continue
    u = json.loads((folder / "unggah.json").read_text(encoding="utf-8"))
    if s.get("jadwal_tayang"):
        jadwal = datetime.datetime.fromisoformat(s["jadwal_tayang"])
    else:
        jadwal = slot_berikut(s.get("format") == "panjang")
        if not CEK: set_status(folder, "terjadwal", jadwal_tayang=jadwal.isoformat())
    terbit = s.get("terbit", {})
    for nama, (fungsi, kunci) in PLATFORM.items():
        if terbit.get(nama, {}).get("id") or terbit.get(nama, {}).get("gagal", 0) >= 2:
            continue  # sudah terbit, atau gagal 2x -> dilaporkan ke Bos, tidak dicoba terus
        if not all(os.environ.get(k) for k in kunci):
            terbit[nama] = {"catatan": "kunci belum diisi - unggah manual"}; continue
        if nama == "youtube" and os.environ.get("YT_AUDIT_LOLOS", "").lower() != "ya":
            # Sebelum audit YouTube lolos, video hasil API terkunci privat selamanya -> jangan diunggah otomatis.
            terbit[nama] = {"catatan": "audit YouTube belum lolos - unggah manual dari YouTube Studio"}; continue
        if nama != "youtube" and SEKARANG < jadwal - datetime.timedelta(minutes=15):
            continue  # TikTok & Instagram menunggu jamnya
        if CEK:
            laporan.append(f"{folder.name}: akan unggah {nama} (jadwal {jadwal:%d %b %H:%M} WITA)"); continue
        try:
            terbit[nama] = {"id": fungsi(folder, u), "waktu": datetime.datetime.now(WITA).isoformat(timespec="minutes")}
            laporan.append(f"{folder.name}: {nama} OK")
        except Exception as e:  # satu platform gagal tidak menghentikan yang lain
            gagal = terbit.get(nama, {}).get("gagal", 0) + 1
            pesan = str(e)
            for k in ("IG_ACCESS_TOKEN", "TIKTOK_REFRESH_TOKEN", "YT_REFRESH_TOKEN"):
                if os.environ.get(k): pesan = pesan.replace(os.environ[k], "[token]")
            terbit[nama] = {"gagal": gagal, "error": pesan[:600]}
            laporan.append(f"{folder.name}: {nama} GAGAL ({gagal}x) {e}")
    if CEK:
        continue
    selesai = all(v.get("id") or v.get("catatan") or v.get("gagal", 0) >= 2 for k, v in terbit.items()) and len(terbit) == 3
    set_status(folder, "tayang" if selesai and SEKARANG >= jadwal else None, terbit=terbit)

print("\n".join(laporan) or "Tidak ada video yang perlu diterbitkan sekarang.")
