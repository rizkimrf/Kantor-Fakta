"""SEKALI SAJA, dijalankan Bos di LAPTOP (bukan di cloud): membuat izin unggah YouTube untuk kantor cloud.
1. Taruh client_secret.json (OAuth "Desktop app" dari Google Cloud) di folder kantor.
2. pip install google-auth-oauthlib
3. python scripts/login_youtube.py  -> browser terbuka, login akun channel Ternyata Begitu, izinkan.
4. Skrip menulis file youtube_refresh_token.txt. Buka file itu, salin isinya ke pengaturan environment
   claude.ai/code sebagai YT_REFRESH_TOKEN. Lalu HAPUS file tersebut. Jangan kirim isinya lewat chat."""
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow

ROOT = Path(__file__).resolve().parent.parent
SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.force-ssl",
          "https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/yt-analytics.readonly"]  # + baca statistik (Bos 24 Nov)
cred = InstalledAppFlow.from_client_secrets_file(str(ROOT / "client_secret.json"), SCOPES).run_local_server(
    port=0, access_type="offline", prompt="consent")
(ROOT / "youtube_refresh_token.txt").write_text(cred.refresh_token, encoding="utf-8")
print("Selesai. Salin isi youtube_refresh_token.txt ke YT_REFRESH_TOKEN (pengaturan environment), lalu hapus filenya.")
print("YT_CLIENT_ID dan YT_CLIENT_SECRET ada di client_secret.json (client_id, client_secret).")
