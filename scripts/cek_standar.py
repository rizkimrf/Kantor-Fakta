"""Cek STANDAR 80 pada naskah Shorts (batas terukur, bukan skor buatan sendiri).
Pakai: python scripts/cek_standar.py antrean/<folder>
Aturan lengkap: .claude/skills/naskah-viral/referensi/standar-80.md
"""
import json, re, sys, pathlib

LARANG_AWAL = ("kamu pernah", "tahu nggak", "tahukah", "jadi", "nah", "halo", "hai", "tebak", "di video ini")


def kalimat(teks):
    return [k.strip() for k in re.split(r"(?<=[.?!…])\s+", teks) if k.strip()]


def kata(t):
    return re.findall(r"[\w'’-]+", t)


def main(folder):
    f = pathlib.Path(folder)
    n = json.loads((f / "naskah.json").read_text(encoding="utf-8"))
    status = {}
    try:
        status = json.loads((f / "status.json").read_text(encoding="utf-8"))
    except Exception:
        pass
    if (status.get("format") or n.get("format")) == "panjang":
        print("Video panjang: STANDAR 80 tidak berlaku."); return 0
    adegan = n.get("adegan") or n.get("scenes") or []
    narasi = " ".join((a.get("narasi") or a.get("teks") or "").strip() for a in adegan)
    ks = kalimat(narasi)
    hasil = []

    def cek(kode, ok, bukti):
        hasil.append((kode, ok, bukti))

    total = len(kata(narasi))
    cek("N3 total 70-100 kata", 70 <= total <= 100, f"{total} kata (±{total/2.3:.0f} dtk)")
    k1 = ks[0] if ks else ""
    cek("N1 kalimat pertama <= 7 kata", 0 < len(kata(k1)) <= 7, f"{len(kata(k1))} kata: \"{k1}\"")
    awal = k1.lower()
    cek("N1 tanpa pembuka terlarang", not awal.startswith(LARANG_AWAL), f"\"{k1[:40]}\"")
    panjang = [k for k in ks if len(kata(k)) > 12]
    cek("N4 tiap kalimat <= 12 kata", not panjang, "; ".join(f"{len(kata(k))} kata: \"{k[:50]}\"" for k in panjang[:3]) or "ok")
    angka = re.findall(r"\d+", narasi)
    cek("N4 maks 1 angka", len(angka) <= 1, f"{len(angka)} angka: {angka[:5]}")
    layar0 = (adegan[0].get("teks_layar") or adegan[0].get("teks_besar") or "") if adegan else ""
    cek("Y1 teks sampul <= 5 kata", 0 < len(kata(layar0)) <= 5, f"\"{layar0}\"")
    sama = bool(layar0) and len(set(w.lower() for w in kata(layar0)) & set(w.lower() for w in kata(k1))) >= 1
    cek("N1 kalimat pertama = pertanyaan sampul", sama, f"sampul \"{layar0}\" vs \"{k1}\"")
    k_akhir = ks[-1] if ks else ""
    cek("N6 loop: kalimat terakhir menggantung (bukan tanda tanya/rangkuman)", not re.search(r"(komen|subscribe|like|follow)", k_akhir.lower()),
        f"\"{k_akhir[:60]}\"")

    gagal = [h for h in hasil if not h[1]]
    for kode, ok, bukti in hasil:
        print(f"{'LULUS' if ok else 'GAGAL'}  {kode}  — {bukti}")
    print("\nHASIL:", "LULUS" if not gagal else f"GAGAL ({len(gagal)} batas)")
    print("Cek manual Pak Bima: L1-L5, N2, N5, N6 (sambung ke kalimat pertama), Y1-Y4, R1 di cek_seo.md")
    return 0 if not gagal else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
