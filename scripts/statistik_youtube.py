"""Rudi - STATISTIK YOUTUBE per Content ID (folder antrean) — hasil audit blueprint 28 Nov 2026.

Masalah yang ditutup: video diunggah manual oleh Bos sehingga status.json hanya berisi "manual" (tanpa ID video YouTube),
akibatnya performa tidak bisa ditelusuri dari ide → naskah → video → angka.

Yang dilakukan (hanya MEMBACA dari YouTube, tidak mengunggah/mengubah apa pun di channel):
1. Ambil daftar unggahan channel (YouTube Data API v3, token YT_REFRESH_TOKEN yang sudah ada).
2. Cocokkan judul unggahan dengan `unggah.json` → youtube.judul tiap folder; isi `terbit.youtube.id` + url bila masih kosong/"manual".
3. Ambil statistik dasar (views, likes, komentar) untuk semua video yang cocok.
4. Bila izin YouTube Analytics (yt-analytics.readonly) sudah diberikan: rata-rata durasi tonton, % ditonton, menit ditonton,
   subscriber didapat, share. Bila belum: dilewati dengan catatan (Bos perlu menjalankan ulang scripts/login_youtube.py).
5. Simpan snapshot ke `data/snapshot_youtube.csv` (satu baris per video per pengambilan, dengan umur video dalam jam)
   dan ringkasan terbaru ke status.json → "performa.youtube".
Catatan: angka "Ditonton vs digeser" (swipe) TIDAK tersedia lewat API — tetap dari tangkapan layar YouTube Studio.

Pemakaian: python scripts/statistik_youtube.py            (sinkron + snapshot)
           python scripts/statistik_youtube.py --uji-lokal (uji pencocokan & penulisan CSV dengan data palsu, tanpa internet)
"""
import csv, datetime, difflib, json, os, re, sys, urllib.parse, urllib.request, urllib.error
from pathlib import Path
from _umum import ROOT, muat_env

muat_env()
WITA = datetime.timezone(datetime.timedelta(hours=8))
SEKARANG = datetime.datetime.now(datetime.timezone.utc)
CSV = ROOT / "data" / "snapshot_youtube.csv"
KOLOM = ["diambil_utc", "content_id", "video_id", "umur_jam", "format", "views", "likes", "komentar",
         "menit_ditonton", "rata_durasi_dtk", "persen_ditonton", "subscriber_didapat", "share"]
UJI = "--uji-lokal" in sys.argv


def http(url, headers=None, data=None):
    req = urllib.request.Request(url, data=data, headers=headers or {}, method="POST" if data else "GET")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"{e.code} {url.split('?')[0]}: {e.read()[:300]!r}")


def bersih(pesan):
    for k in ("YT_REFRESH_TOKEN", "YT_CLIENT_SECRET"):
        if os.environ.get(k): pesan = pesan.replace(os.environ[k], "[token]")
    return pesan


def norm(judul):
    j = re.sub(r"#\w+", " ", (judul or "").lower())
    return re.sub(r"\s+", " ", re.sub(r"[^0-9a-zà-ÿ ]", " ", j)).strip()


def folder_konten():
    """Semua folder yang sudah/akan tayang beserta judul YouTube rencananya."""
    hasil = []
    for st in sorted((ROOT / "antrean").glob("*/status.json")):
        s = json.loads(st.read_text(encoding="utf-8"))
        if s.get("tahap") not in ("tayang", "terjadwal", "disetujui"):
            continue
        u = st.parent / "unggah.json"
        judul = (json.loads(u.read_text(encoding="utf-8")).get("youtube") or {}).get("judul") if u.exists() else None
        hasil.append({"folder": st.parent, "status": s, "judul": judul or s.get("judul") or ""})
    return hasil


def cocokkan(konten, unggahan):
    """Pasangkan folder ↔ video. Persis (setelah dinormalkan) dulu, lalu mirip ≥ 0,8 yang unik."""
    pasangan, sisa = {}, {u["id"]: u for u in unggahan}
    for k in konten:
        n = norm(k["judul"])
        persis = [u for u in sisa.values() if norm(u["judul"]) == n and n]
        if len(persis) == 1:
            pasangan[k["folder"].name] = persis[0]; sisa.pop(persis[0]["id"])
    for k in konten:
        if k["folder"].name in pasangan or not k["judul"]:
            continue
        skor = sorted(((difflib.SequenceMatcher(None, norm(k["judul"]), norm(u["judul"])).ratio(), u) for u in sisa.values()),
                      key=lambda x: -x[0])
        if skor and skor[0][0] >= 0.8 and (len(skor) == 1 or skor[0][0] - skor[1][0] >= 0.1):
            pasangan[k["folder"].name] = skor[0][1]; sisa.pop(skor[0][1]["id"])
    return pasangan, list(sisa.values())


def token():
    r = http("https://oauth2.googleapis.com/token", {"Content-Type": "application/x-www-form-urlencoded"},
             urllib.parse.urlencode({"client_id": os.environ["YT_CLIENT_ID"], "client_secret": os.environ["YT_CLIENT_SECRET"],
                                     "refresh_token": os.environ["YT_REFRESH_TOKEN"], "grant_type": "refresh_token"}).encode())
    return {"Authorization": f"Bearer {r['access_token']}"}


def daftar_unggahan(auth):
    ch = http("https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true", auth)
    playlist = ch["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    hasil, halaman = [], ""
    while True:
        r = http(f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId={playlist}{halaman}", auth)
        for it in r.get("items", []):
            hasil.append({"id": it["contentDetails"]["videoId"], "judul": it["snippet"]["title"],
                          "terbit": it["contentDetails"].get("videoPublishedAt") or it["snippet"]["publishedAt"]})
        if not r.get("nextPageToken"):
            return hasil
        halaman = f"&pageToken={r['nextPageToken']}"


def statistik_dasar(auth, ids):
    out = {}
    for i in range(0, len(ids), 50):
        r = http("https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" + ",".join(ids[i:i + 50]), auth)
        for it in r.get("items", []):
            s = it.get("statistics", {})
            out[it["id"]] = {"views": int(s.get("viewCount", 0)), "likes": int(s.get("likeCount", 0)), "komentar": int(s.get("commentCount", 0))}
    return out


def statistik_analytics(auth, ids):
    """YouTube Analytics API v2. Butuh izin yt-analytics.readonly; bila belum ada → (None, alasan)."""
    metrik = "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,shares"
    out = {}
    try:
        for i in range(0, len(ids), 200):
            q = urllib.parse.urlencode({"ids": "channel==MINE", "startDate": "2026-11-01", "endDate": SEKARANG.date().isoformat(),
                                        "metrics": metrik, "dimensions": "video", "filters": "video==" + ",".join(ids[i:i + 200]),
                                        "maxResults": 200, "sort": "-views"})
            r = http(f"https://youtubeanalytics.googleapis.com/v2/reports?{q}", auth)
            kol = [h["name"] for h in r.get("columnHeaders", [])]
            for baris in r.get("rows", []):
                d = dict(zip(kol, baris))
                out[d["video"]] = {"menit_ditonton": d.get("estimatedMinutesWatched"), "rata_durasi_dtk": d.get("averageViewDuration"),
                                   "persen_ditonton": d.get("averageViewPercentage"), "subscriber_didapat": d.get("subscribersGained"),
                                   "share": d.get("shares")}
        return out, None
    except RuntimeError as e:
        alasan = bersih(str(e))
        if alasan.startswith("403") or "insufficient" in alasan.lower() or "scope" in alasan.lower():
            alasan = "izin YouTube Analytics belum ada → Bos jalankan ulang scripts/login_youtube.py lalu ganti YT_REFRESH_TOKEN"
        return None, alasan


def simpan(konten, pasangan, dasar, lanjut, unggahan):
    CSV.parent.mkdir(exist_ok=True)
    baru = not CSV.exists()
    terbit_map = {u["id"]: u["terbit"] for u in unggahan}
    with CSV.open("a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=KOLOM)
        if baru: w.writeheader()
        for k in konten:
            v = pasangan.get(k["folder"].name)
            if not v: continue
            s = k["status"]; vid = v["id"]
            t = datetime.datetime.fromisoformat(terbit_map[vid].replace("Z", "+00:00"))
            umur = round((SEKARANG - t).total_seconds() / 3600, 1)
            baris = {"diambil_utc": SEKARANG.isoformat(timespec="minutes"), "content_id": k["folder"].name, "video_id": vid, "umur_jam": umur,
                     "format": s.get("format_resep") or s.get("seri") or s.get("format") or "lama", **dasar.get(vid, {}), **((lanjut or {}).get(vid, {}))}
            w.writerow({c: baris.get(c, "") for c in KOLOM})
            yt = s.setdefault("terbit", {}).setdefault("youtube", {})
            if not yt.get("id") or yt.get("id") == "manual":
                yt.update({"id": vid, "url": f"https://youtube.com/shorts/{vid}", "dicocokkan": "judul (otomatis, statistik_youtube.py)"})
            s["performa"] = {**s.get("performa", {}), "youtube": {k2: baris[k2] for k2 in baris if k2 not in ("content_id", "format")}}
            if not UJI:
                (k["folder"] / "status.json").write_text(json.dumps(s, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    konten = folder_konten()
    if UJI:
        unggahan = [{"id": f"UJI{i:03d}", "judul": (k["judul"] + " #shorts") if i % 2 else k["judul"].upper(),
                     "terbit": (SEKARANG - datetime.timedelta(hours=30 + i)).isoformat()} for i, k in enumerate(konten) if k["judul"]]
        unggahan.append({"id": "UJI999", "judul": "Video lain yang tidak ada di antrean", "terbit": SEKARANG.isoformat()})
        dasar = {u["id"]: {"views": 1000 + i, "likes": 10, "komentar": 2} for i, u in enumerate(unggahan)}
        lanjut, alasan = None, "uji lokal (tanpa internet)"
    else:
        for k in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"):
            if not os.environ.get(k):
                print(f"Kunci {k} kosong di sesi ini → statistik YouTube dilewati (minta Bos cek pengaturan environment)."); return 1
        auth = token()
        unggahan = daftar_unggahan(auth)
    pasangan, tak_dikenal = cocokkan(konten, unggahan)
    if not UJI:
        ids = [v["id"] for v in pasangan.values()]
        dasar = statistik_dasar(auth, ids) if ids else {}
        lanjut, alasan = statistik_analytics(auth, ids) if ids else ({}, None)
    global CSV
    if UJI:
        CSV = Path(os.environ.get("CSV_UJI", "/tmp/snapshot_uji.csv"))
    simpan(konten, pasangan, dasar, lanjut, unggahan)
    print(f"Unggahan di channel: {len(unggahan)} · cocok dengan folder: {len(pasangan)} · folder tanpa pasangan: {len(konten) - len(pasangan)}")
    for k in konten:
        if k["folder"].name not in pasangan and k["status"].get("tahap") == "tayang":
            print(f"  BELUM COCOK: {k['folder'].name} (judul rencana: \"{k['judul'][:60]}\") → judul di YouTube mungkin diubah; isi ID manual")
    for u in tak_dikenal:
        print(f"  Video channel tanpa folder: {u['id']} \"{u['judul'][:60]}\"")
    print("Analytics lanjutan:", "OK" if lanjut else f"dilewati ({alasan})")
    print(f"Snapshot ditulis ke {CSV}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:  # jangan pernah mencetak token
        print("GAGAL statistik YouTube:", bersih(str(e))[:500]); sys.exit(1)
