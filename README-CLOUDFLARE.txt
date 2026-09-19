CLOUDFLARE WORKERS - VERSI FIX

Struktur:
- public/index.html     -> landing + admin + shortlink
- worker.js             -> API upload Videy + static asset serving
- wrangler.jsonc        -> konfigurasi Worker + SPA fallback

DI CLOUDFLARE WORKERS BUILDS:
Build command: exit 0
Deploy command: npx wrangler deploy
Root directory: kosong / root repository

JANGAN gunakan _redirects lama.
Versi ini sengaja tidak memakai _redirects untuk /admin dan /f/*. SPA fallback ditangani oleh assets.not_found_handling.

ENDPOINT:
/api/upload-video -> proxy upload ke Videy
/admin -> admin panel
/f/<alias> -> shortlink redirect
/ -> landing page

Firebase Firestore tetap menjadi database dari index.html.
