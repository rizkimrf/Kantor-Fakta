"""SEKALI SAJA, dijalankan Bos di LAPTOP: membuat izin unggah TikTok (mode Sandbox) untuk kantor cloud.
Tanpa paket tambahan (hanya Python bawaan).

1. python scripts/login_tiktok.py
2. Tempel Client key & Client secret (developers.tiktok.com -> Ternyata Begitu Uploader -> Sandbox "Kantor Uploader"
   -> Credentials, klik ikon mata). Ketikan secret tidak ditampilkan.
3. Browser terbuka -> login @ternyatabegitu_official -> Izinkan.
4. Skrip menulis tiktok_refresh_token.txt. Salin isinya ke pengaturan environment claude.ai/code:
   TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REFRESH_TOKEN (dan TIKTOK_MODE=inbox).
   Lalu HAPUS file tersebut. Jangan kirim isinya lewat chat."""
import getpass, hashlib, http.server, json, secrets, urllib.parse, urllib.request, webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REDIRECT = "http://localhost:8765/callback/"
key = input("Client key   : ").strip()
secret = getpass.getpass("Client secret: ").strip()
verifier = secrets.token_urlsafe(48)
challenge = hashlib.sha256(verifier.encode()).hexdigest()  # TikTok desktop: SHA256 dalam heksadesimal
state = secrets.token_urlsafe(16)
url = "https://www.tiktok.com/v2/auth/authorize/?" + urllib.parse.urlencode({
    "client_key": key, "scope": "user.info.basic,video.upload", "response_type": "code",
    "redirect_uri": REDIRECT, "state": state, "code_challenge": challenge, "code_challenge_method": "S256"})
hasil = {}


class Penangkap(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        hasil.update({k: v[0] for k, v in q.items()})
        self.send_response(200); self.send_header("Content-Type", "text/html; charset=utf-8"); self.end_headers()
        self.wfile.write("<h2>Selesai. Tutup tab ini dan kembali ke jendela PowerShell.</h2>".encode())

    def log_message(self, *a): pass


print("Membuka browser untuk login TikTok...")
webbrowser.open(url)
srv = http.server.HTTPServer(("localhost", 8765), Penangkap)
while "code" not in hasil and "error" not in hasil:
    srv.handle_request()
if "error" in hasil or hasil.get("state") != state:
    raise SystemExit(f"Login dibatalkan/gagal: {hasil.get('error_description') or hasil.get('error') or 'state tidak cocok'}")

data = urllib.parse.urlencode({"client_key": key, "client_secret": secret, "code": hasil["code"],
                               "grant_type": "authorization_code", "redirect_uri": REDIRECT,
                               "code_verifier": verifier}).encode()
req = urllib.request.Request("https://open.tiktokapis.com/v2/oauth/token/", data=data,
                             headers={"Content-Type": "application/x-www-form-urlencoded"})
tok = json.loads(urllib.request.urlopen(req, timeout=60).read())
if "refresh_token" not in tok:
    raise SystemExit(f"Gagal menukar kode: {tok.get('error_description') or tok}")
(ROOT / "tiktok_refresh_token.txt").write_text(tok["refresh_token"], encoding="utf-8")
print(f"Selesai. Berlaku {tok.get('refresh_expires_in', 0) // 86400} hari.")
print("Salin isi tiktok_refresh_token.txt ke TIKTOK_REFRESH_TOKEN (pengaturan environment), lalu hapus filenya.")
