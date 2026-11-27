"""Rudi - STATISTIK TIKTOK & INSTAGRAM per Content ID (folder antrean) + angka akun. Pasangan scripts/statistik_youtube.py (28 Nov 2026).
Hanya MEMBACA dari API resmi; tidak mengunggah/mengubah apa pun di akun.

TikTok  (Display API, token TIKTOK_REFRESH_TOKEN): butuh izin `video.list` + `user.info.stats`
        → di TikTok for Developers tambahkan produk "Display API"/izin tsb, lalu Bos jalankan ulang scripts/login_tiktok.py.
        Data: views, likes, komentar, share per video; follower & total likes akun. (Rata-rata durasi tonton TIDAK tersedia lewat API ini.)
Instagram (Graph API, token IG_ACCESS_TOKEN + IG_USER_ID): butuh izin `instagram_manage_insights`, `instagram_basic`, `pages_read_engagement`
        → Bos membuat ulang token Halaman dengan izin tsb (sekaligus memperbaiki unggah otomatis IG).
        Data: views/jangkauan, simpan, share, interaksi, rata-rata durasi tonton Reels (bila tersedia), follower akun.
Hasil: data/snapshot_tiktok.csv, data/snapshot_instagram.csv, data/akun_sosial.csv, dan status.json → performa.tiktok / performa.instagram.
Video dicocokkan ke folder lewat kemiripan caption (unggah.json) + tanggal tayang.

Pemakaian: python scripts/statistik_sosial.py              (TikTok + Instagram; platform yang izinnya belum ada dilewati dengan pesan jelas)
           python scripts/statistik_sosial.py --uji-lokal  (uji pencocokan & penulisan CSV dengan data palsu, tanpa internet)
"""
import csv, datetime, difflib, json, os, re, sys, urllib.parse, urllib.request, urllib.error
from pathlib import Path
from _umum import ROOT, muat_env

muat_env()
UJI = "--uji-lokal" in sys.argv
SEKARANG = datetime.datetime.now(datetime.timezone.utc)
DATA = Path(os.environ.get("DATA_UJI", "/tmp/data_uji")) if UJI else ROOT / "data"
GRAPH = "https://graph.facebook.com/v21.0"
KOLOM = ["diambil_utc", "content_id", "platform_id", "umur_jam", "format", "views", "likes", "komentar", "share", "simpan",
         "jangkauan", "interaksi", "rata_tonton_dtk"]
RAHASIA = ("IG_ACCESS_TOKEN", "TIKTOK_REFRESH_TOKEN", "TIKTOK_CLIENT_SECRET")


def bersih(s):
    for k in RAHASIA:
        if os.environ.get(k): s = s.replace(os.environ[k], "[token]")
    return s


def http(url, data=None, headers=None, json_body=None):
    if json_body is not None:
        data = json.dumps(json_body).encode(); headers = {"Content-Type": "application/json", **(headers or {})}
    req = urllib.request.Request(url, data=data, headers=headers or {}, method="POST" if data else "GET")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        raise RuntimeError(bersih(f"{e.code} {url.split('?')[0]}: {e.read()[:300]!r}"))


def norm(t):
    t = re.sub(r"#\w+", " ", (t or "").lower())
    return re.sub(r"\s+", " ", re.sub(r"[^0-9a-zà-ÿ ]", " ", t)).strip()[:120]


def folder_konten(platform):
    hasil = []
    for st in sorted((ROOT / "antrean").glob("*/status.json")):
        s = json.loads(st.read_text(encoding="utf-8"))
        if s.get("tahap") not in ("tayang", "terjadwal", "disetujui"):
            continue
        u = st.parent / "unggah.json"
        cap = (json.loads(u.read_text(encoding="utf-8")).get(platform) or {}).get("caption") if u.exists() else ""
        hasil.append({"folder": st.parent, "status": s, "caption": cap or "", "jadwal": s.get("jadwal_tayang")})
    return hasil


def cocokkan(konten, posting):
    """Folder ↔ posting: caption mirip (≥ 0,6) dan, bila jadwal diketahui, tanggal tayang ±3 hari. Hanya pasangan terbaik yang unik."""
    pasangan, terpakai = {}, set()
    kandidat = []
    for k in konten:
        for p in posting:
            r = difflib.SequenceMatcher(None, norm(k["caption"]), norm(p["teks"])).ratio() if k["caption"] else 0
            if r < 0.6: continue
            if k["jadwal"]:
                j = datetime.datetime.fromisoformat(k["jadwal"]).astimezone(datetime.timezone.utc)
                if abs((p["waktu"] - j).total_seconds()) > 3 * 86400: continue
            kandidat.append((r, k["folder"].name, p["id"], p))
    for r, nama, pid, p in sorted(kandidat, key=lambda x: -x[0]):
        if nama in pasangan or pid in terpakai: continue
        pasangan[nama] = p; terpakai.add(pid)
    return pasangan


def tulis(platform, konten, pasangan, angka):
    DATA.mkdir(parents=True, exist_ok=True)
    f = DATA / f"snapshot_{platform}.csv"; baru = not f.exists()
    with f.open("a", newline="", encoding="utf-8") as h:
        w = csv.DictWriter(h, fieldnames=KOLOM)
        if baru: w.writeheader()
        for k in konten:
            p = pasangan.get(k["folder"].name)
            if not p: continue
            s = k["status"]
            baris = {"diambil_utc": SEKARANG.isoformat(timespec="minutes"), "content_id": k["folder"].name, "platform_id": p["id"],
                     "umur_jam": round((SEKARANG - p["waktu"]).total_seconds() / 3600, 1),
                     "format": s.get("format_resep") or s.get("seri") or s.get("format") or "lama", **angka.get(p["id"], {})}
            w.writerow({c: baris.get(c, "") for c in KOLOM})
            t = s.setdefault("terbit", {}).setdefault(platform, {})
            t.setdefault("video_id" if platform == "tiktok" else "media_id", p["id"])
            if p.get("url"): t.setdefault("url", p["url"])
            s["performa"] = {**s.get("performa", {}), platform: {c: baris[c] for c in baris if c not in ("content_id", "format")}}
            if not UJI:
                (k["folder"] / "status.json").write_text(json.dumps(s, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def akun(platform, nilai):
    DATA.mkdir(parents=True, exist_ok=True)
    f = DATA / "akun_sosial.csv"; baru = not f.exists()
    with f.open("a", newline="", encoding="utf-8") as h:
        w = csv.writer(h)
        if baru: w.writerow(["diambil_utc", "platform", "follower", "total_likes", "jumlah_video"])
        w.writerow([SEKARANG.isoformat(timespec="minutes"), platform, nilai.get("follower", ""), nilai.get("likes", ""), nilai.get("video", "")])


# ---------------- TikTok ----------------
def tiktok():
    if not all(os.environ.get(k) for k in ("TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN")):
        return "dilewati: kunci TikTok kosong di sesi ini"
    tok = http("https://open.tiktokapis.com/v2/oauth/token/", urllib.parse.urlencode({
        "client_key": os.environ["TIKTOK_CLIENT_KEY"], "client_secret": os.environ["TIKTOK_CLIENT_SECRET"],
        "grant_type": "refresh_token", "refresh_token": os.environ["TIKTOK_REFRESH_TOKEN"]}).encode(),
        {"Content-Type": "application/x-www-form-urlencoded"})
    auth = {"Authorization": f"Bearer {tok['access_token']}"}
    izin = tok.get("scope", "")
    if "video.list" not in izin:
        return f"dilewati: token TikTok belum punya izin video.list (izin sekarang: {izin}) → tambah Display API di TikTok for Developers lalu jalankan ulang scripts/login_tiktok.py"
    if "user.info.stats" in izin:
        u = http("https://open.tiktokapis.com/v2/user/info/?fields=follower_count,likes_count,video_count", headers=auth)["data"]["user"]
        akun("tiktok", {"follower": u.get("follower_count"), "likes": u.get("likes_count"), "video": u.get("video_count")})
    posting, cursor = [], None
    for _ in range(10):
        body = {"max_count": 20, **({"cursor": cursor} if cursor else {})}
        r = http("https://open.tiktokapis.com/v2/video/list/?fields=id,create_time,title,video_description,duration,view_count,like_count,comment_count,share_count,share_url",
                 headers=auth, json_body=body)["data"]
        for v in r.get("videos", []):
            posting.append({"id": v["id"], "teks": v.get("video_description") or v.get("title") or "", "url": v.get("share_url"),
                            "waktu": datetime.datetime.fromtimestamp(v["create_time"], datetime.timezone.utc),
                            "angka": {"views": v.get("view_count"), "likes": v.get("like_count"), "komentar": v.get("comment_count"), "share": v.get("share_count")}})
        if not r.get("has_more"): break
        cursor = r.get("cursor")
    konten = folder_konten("tiktok"); pas = cocokkan(konten, posting)
    tulis("tiktok", konten, pas, {p["id"]: p["angka"] for p in posting})
    return f"OK: {len(posting)} video di akun, {len(pas)} cocok dengan folder"


# ---------------- Instagram ----------------
METRIK_IG = [["views", "reach", "saved", "shares", "total_interactions", "ig_reels_avg_watch_time"],
             ["views", "reach", "saved", "shares", "total_interactions"], ["reach", "saved", "shares"], ["reach"]]
NAMA_IG = {"views": "views", "reach": "jangkauan", "saved": "simpan", "shares": "share", "total_interactions": "interaksi"}


def instagram():
    tok, uid = os.environ.get("IG_ACCESS_TOKEN"), os.environ.get("IG_USER_ID")
    if not (tok and uid):
        return "dilewati: kunci Instagram kosong di sesi ini"
    a = http(f"{GRAPH}/{uid}?fields=username,followers_count,media_count&access_token={tok}")
    akun("instagram", {"follower": a.get("followers_count"), "video": a.get("media_count")})
    posting, url = [], f"{GRAPH}/{uid}/media?fields=id,caption,media_product_type,timestamp,permalink,like_count,comments_count&limit=50&access_token={tok}"
    for _ in range(4):
        r = http(url)
        for m in r.get("data", []):
            posting.append({"id": m["id"], "teks": m.get("caption", ""), "url": m.get("permalink"),
                            "waktu": datetime.datetime.fromisoformat(m["timestamp"].replace("+0000", "+00:00")),
                            "angka": {"likes": m.get("like_count"), "komentar": m.get("comments_count")}})
        url = (r.get("paging") or {}).get("next")
        if not url: break
    konten = folder_konten("instagram"); pas = cocokkan(konten, posting)
    catatan, set_ok = [], None
    for p in pas.values():  # insight hanya untuk posting yang cocok dengan folder (hemat panggilan)
        for metrik in ([set_ok] if set_ok else METRIK_IG):
            try:
                r = http(f"{GRAPH}/{p['id']}/insights?metric={','.join(metrik)}&access_token={tok}")
            except RuntimeError as e:
                if "(#10)" in str(e) or "permission" in str(e).lower():
                    return "sebagian: daftar posting terbaca, tapi izin instagram_manage_insights belum ada → buat ulang token Halaman dengan izin itu"
                catatan.append(str(e)[:120]); continue
            for d in r.get("data", []):
                nilai = (d.get("values") or [{}])[0].get("value")
                if d["name"] == "ig_reels_avg_watch_time" and nilai is not None:
                    p["angka"]["rata_tonton_dtk"] = round(nilai / 1000, 1)  # API memberi milidetik
                elif d["name"] in NAMA_IG:
                    p["angka"][NAMA_IG[d["name"]]] = nilai
            set_ok = metrik
            break
    tulis("instagram", konten, pas, {p["id"]: p["angka"] for p in posting})
    return f"OK: {len(posting)} posting, {len(pas)} cocok dengan folder" + (f", metrik dipakai: {set_ok}" if set_ok else "")


def uji_lokal():
    hasil = []
    for platform in ("tiktok", "instagram"):
        konten = folder_konten(platform)
        posting = []
        for i, k in enumerate(konten):
            if not k["caption"]: continue
            w = (datetime.datetime.fromisoformat(k["jadwal"]).astimezone(datetime.timezone.utc) + datetime.timedelta(minutes=20)) if k["jadwal"] else SEKARANG
            posting.append({"id": f"{platform}{i:03d}", "teks": k["caption"] + " #fyp", "url": None, "waktu": w,
                            "angka": {"views": 500 + i, "likes": 20, "komentar": 3, "share": 1}})
        posting.append({"id": "asing", "teks": "video lain tanpa folder", "url": None, "waktu": SEKARANG, "angka": {}})
        pas = cocokkan(konten, posting)
        tulis(platform, konten, pas, {p["id"]: p["angka"] for p in posting})
        akun(platform, {"follower": 123, "likes": 456, "video": len(posting)})
        hasil.append(f"{platform}: {len(posting)} posting palsu, {len(pas)} cocok dari {sum(1 for k in konten if k['caption'])} folder ber-caption")
    return hasil


if __name__ == "__main__":
    if UJI:
        print("\n".join(uji_lokal())); print("CSV uji di", DATA); sys.exit(0)
    kode = 0
    for nama, fungsi in (("TikTok", tiktok), ("Instagram", instagram)):
        try:
            print(f"{nama}: {fungsi()}")
        except Exception as e:  # satu platform gagal tidak menghentikan yang lain; token tidak pernah dicetak
            print(f"{nama}: GAGAL {bersih(str(e))[:400]}"); kode = 1
    sys.exit(kode)
