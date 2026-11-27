"""Cek RESEP VIRAL pada naskah Shorts (batas terukur, bukan skor buatan sendiri).
Pakai: python scripts/cek_standar.py antrean/<folder>
Aturan lengkap: .claude/skills/naskah-viral/referensi/resep-viral.md (keputusan Bos 28 Nov 2026)
naskah.json wajib punya "format_resep": "kamu-yang-bikin" (format A) atau "katanya-ternyata" (format B).
"""
import json, re, sys, pathlib

KATA_PER_DTK = {"kamu-yang-bikin": 2.4, "katanya-ternyata": 1.9}  # diukur dari 3 video viral: 2,7 / 1,8 / 2,2 kata per dtk
CELAH_MAKS_DTK = 18  # video viral: masalah/celah baru tiap 8-18 dtk
TERLARANG = r"\b(subscribe|like|follow|komen|komentar|kirim ke|share|bagikan)\b"
BELOKAN = ("tapi", "terus", "masalahnya", "padahal", "anehnya", "kenapa", "gimana", "bukan", "ternyata", "makanya", "kok", "lho", "eh", "tiba-tiba")
FORMAT = {
    "kamu-yang-bikin": {"kata": (170, 300), "nama": "A KAMU YANG BIKIN"},
    "katanya-ternyata": {"kata": (95, 175), "nama": "B KATANYA vs TERNYATA"},
}


def kalimat(teks):
    return [k.strip() for k in re.split(r"(?<=[.?!…])\s+", teks) if k.strip()]


def kata(t):
    return re.findall(r"[\w'’-]+", t)


def main(folder):
    f = pathlib.Path(folder)
    n = json.loads((f / "naskah.json").read_text(encoding="utf-8"))
    try:
        status = json.loads((f / "status.json").read_text(encoding="utf-8"))
    except Exception:
        status = {}
    if (status.get("format") or n.get("format")) == "panjang":
        print("Video panjang: resep Shorts tidak berlaku."); return 0
    fmt = n.get("format_resep") or status.get("format_resep")
    hasil = []

    def cek(kode, ok, bukti):
        hasil.append((kode, bool(ok), bukti))

    cek("F0 format_resep diisi", fmt in FORMAT, f"\"{fmt}\" (pilihan: {', '.join(FORMAT)})")
    adegan = n.get("adegan") or n.get("scenes") or []
    narasi_semua = [(a.get("pembicara") or "narator", (a.get("narasi") or a.get("teks") or "").strip()) for a in adegan]
    narasi = " ".join(t for _, t in narasi_semua)
    ks = kalimat(narasi)
    w = kata(narasi)
    total = len(w)

    kpd = KATA_PER_DTK.get(fmt, 2.2)
    if fmt in FORMAT:
        lo, hi = FORMAT[fmt]["kata"]
        cek(f"U10 panjang {lo}-{hi} kata", lo <= total <= hi, f"{total} kata (±{total / kpd:.0f} dtk)")
    k1 = ks[0] if ks else ""
    cek("U2 kalimat pertama <= 12 kata", 0 < len(kata(k1)) <= 12, f"{len(kata(k1))} kata: \"{k1}\"")
    cek("U1 tanpa salam/intro di awal", not re.match(r"(halo|hai|assalam|selamat datang|di video ini|tahukah|jadi,|nah,)", k1.lower()), f"\"{k1[:40]}\"")
    panjang = [k for k in ks if len(kata(k)) > 14]
    cek("U3 tiap kalimat <= 14 kata", not panjang, "; ".join(f"{len(kata(k))} kata: \"{k[:45]}…\"" for k in panjang[:3]) or "ok")
    cek("U8 tanpa perintah like/subscribe/komen/kirim", not re.search(TERLARANG, narasi.lower()), (re.search(TERLARANG, narasi.lower()) or [""])[0] or "ok")
    angka = re.findall(r"\d+(?:[.,]\d+)?", narasi)
    cek("U11 angka maks 3", len(angka) <= 3, f"{len(angka)} angka: {angka[:6]}")
    # U6: celah baru paling lambat tiap 18 dtk (kecepatan bicara per format)
    posisi = [i for i, x in enumerate(w) if x.lower().strip(",") in BELOKAN]
    titik = [0] + posisi + [total]
    jarak = max((b - a for a, b in zip(titik, titik[1:])), default=total)
    cek(f"U6 celah baru tiap <= {CELAH_MAKS_DTK} dtk", jarak / kpd <= CELAH_MAKS_DTK, f"jarak terpanjang {jarak} kata (±{jarak / kpd:.0f} dtk), {len(posisi)} belokan")
    layar0 = (adegan[0].get("teks_layar") or "") if adegan else ""
    cek("U7 chip bab di adegan 1 (<= 6 kata)", 0 < len(kata(layar0)) <= 6, f"\"{layar0}\"")
    akhir = " ".join(ks[-2:]).lower()

    if fmt == "kamu-yang-bikin":
        cek("A1 buka 'kalau kamu … kamu udah …'", re.search(r"\bkal(au|o) kamu\b", k1.lower()) and re.search(r"kamu (udah|baru aja|sudah)", " ".join(ks[:2]).lower()), f"\"{' '.join(ks[:2])[:80]}\"")
        tapi = len(re.findall(r"\btapi\b", narasi.lower())); jadi = len(re.findall(r"\bjadi\b", narasi.lower()))
        cek("A2 rantai >= 4 'tapi' & >= 4 'jadi'", tapi >= 4 and jadi >= 4, f"tapi {tapi}x, jadi {jadi}x")
        cek("A3 sambungan dunia nyata ('makanya …')", "makanya" in narasi.lower(), "ada" if "makanya" in narasi.lower() else "tidak ada kalimat 'makanya'")
        cek("A4 penutup 'selamat …' + pertanyaan", "selamat" in akhir and (ks[-1].endswith("?") if ks else False), f"\"{' '.join(ks[-2:])[:90]}\"")
    elif fmt == "katanya-ternyata":
        awal = " ".join(ks[:3]).lower()
        cek("B1 pertanyaan/katanya di kalimat pertama", k1.endswith("?") or k1.lower().startswith("katanya"), f"\"{k1}\"")
        cek("B2 mitos dibantah & dijawab <= 6 dtk", "bukan" in awal and len(kata(" ".join(ks[:3]))) <= 18, f"{len(kata(' '.join(ks[:3])))} kata: \"{awal[:80]}\"")
        terus = [i for i, x in enumerate(w) if x.lower() in ("terus", "terus,")]
        tengah = [i for i in terus if 0.3 * total <= i <= 0.7 * total]
        cek("B3 pertanyaan kedua 'terus …?' di tengah", bool(tengah), f"posisi 'terus': {[round(i / max(total, 1) * 100) for i in terus]}% ")
        cek("B6 penutup janji seri ('besok' / 'video berikutnya')", re.search(r"(besok|video berikutnya)", akhir), f"\"{akhir[:90]}\"")
        if n.get("topik_tubuh") or status.get("topik_tubuh"):
            cek("B5 kalimat batas aman (topik tubuh)", re.search(r"hati-hati", narasi.lower()), "ada" if "hati-hati" in narasi.lower() else "tidak ada")

    # Klaim: setiap fakta di naskah menunjuk ke tabel klaim riset.md yang terverifikasi (28 Nov, dari paket skill ChatGPT)
    riset = f / "riset.md"
    if riset.exists():
        rt = riset.read_text(encoding="utf-8")
        m = re.search(r"Status riset:\s*`?([A-Z_]+)", rt)
        cek("K0 riset berstatus READY", m and m.group(1) == "READY", m.group(1) if m else "baris 'Status riset:' tidak ada")
        tabel = {}
        for baris in rt.splitlines():
            sel = [s.strip() for s in baris.strip().strip("|").split("|")]
            if len(sel) >= 3 and re.fullmatch(r"K\d+", sel[0]):
                tabel[sel[0]] = sel[2].strip("` ").upper()
        cek("K1 tabel klaim ada di riset.md", bool(tabel), f"{len(tabel)} klaim: " + ", ".join(f"{k}={v}" for k, v in list(tabel.items())[:6]))
        dipakai = [(i + 1, k) for i, a in enumerate(adegan) for k in (a.get("klaim") or [])]
        cek("K2 naskah menyebut ID klaim", bool(dipakai), f"{len(dipakai)} rujukan di {len({i for i, _ in dipakai})} adegan")
        buruk = [f"adegan {i}: {k} ({tabel.get(k, 'tidak ada di tabel')})" for i, k in dipakai if tabel.get(k) not in ("VERIFIED", "PARTIALLY_SUPPORTED")]
        cek("K3 semua klaim yang dipakai VERIFIED/PARTIALLY_SUPPORTED", not buruk, "; ".join(buruk[:4]) or "ok")
    else:
        cek("K0 riset.md ada", False, "riset.md tidak ditemukan")

    pend = [t for p, t in narasi_semua if p == "pendamping"]
    if pend:
        cek("U13 pendamping maks 3 kalimat", len(kalimat(" ".join(pend))) <= 3, f"{len(kalimat(' '.join(pend)))} kalimat")
        cek("U13 kalimat pendamping <= 8 kata", all(len(kata(k)) <= 8 for k in kalimat(" ".join(pend))), " | ".join(pend)[:90])

    gagal = [h for h in hasil if not h[1]]
    for kode, ok, bukti in hasil:
        print(f"{'LULUS' if ok else 'GAGAL'}  {kode}  — {bukti}")
    print("\nHASIL:", "LULUS" if not gagal else f"GAGAL ({len(gagal)} batas)")
    print("Cek manual Pak Bima/Yoga: U1 frame 0 beraksi, U4 satu cerita, U5 peragaan persis, U7 teks tidak menutupi, U9, U12, T1-T3, R1.")
    return 0 if not gagal else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
