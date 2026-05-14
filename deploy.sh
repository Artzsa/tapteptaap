#!/bin/bash
# ============================================================
# VibeTape Deploy Script untuk Hostinger (Shared Hosting / VPS)
# ============================================================
# Cara pakai:
#   1. SSH ke Hostinger: ssh user@domain.com
#   2. Upload script ini: scp deploy.sh user@domain.com:~/
#   3. Jalankan: bash deploy.sh
# ============================================================

echo "🚀 VibeTape Deploy Script"
echo "=========================="

# --- Konfigurasi ---
# Ganti dengan path domain kamu di Hostinger
DEPLOY_PATH=~domains/mediumturquoise-gazelle-966383.hostingersite.com/

# --- 1. Build Frontend ---
echo ""
echo "📦 [1/4] Building frontend..."
cd client
npm install
npm run build
cd ..

# --- 2. Install Server Dependencies ---
echo ""
echo "📦 [2/4] Installing server dependencies..."
cd server
npm install
cd ..

# --- 3. Setup .env jika belum ada ---
if [ ! -f server/.env ]; then
  echo ""
  echo "⚠️  [3/4] server/.env not found! Creating from template..."
  cat > server/.env << 'EOF'
PORT=5000
JWT_SECRET=change-this-to-a-random-string
NODE_ENV=production
CORS_ORIGINS=https://mediumturquoise-gazelle-966383.hostingersite.com
EOF
  echo "   🔴 IMPORTANT: Edit server/.env and set JWT_SECRET to a random value!"
  echo "   🔴 IMPORTANT: Set CORS_ORIGINS to your actual domain!"
else
  echo ""
  echo "✅ [3/4] server/.env already exists"
fi

# --- 4. Copy to Hostinger structure ---
echo ""
echo "📂 [4/4] Preparing deployment folder..."
rm -rf deploy_ready
mkdir -p deploy_ready/client/dist

# Copy backend files to root of deploy_ready
cp -r server/* deploy_ready/
# Copy frontend build to client/dist inside deploy_ready
cp -r client/dist/* deploy_ready/client/dist/

echo ""
echo "✅ Done! Files prepared in ./deploy_ready"
echo "   Silakan upload isi folder 'deploy_ready' ke Hostinger."
echo ""
echo "📋 Next steps (Hostinger hPanel):"
echo "   1. Masuk ke menu 'Node.js'"
echo "   2. Set 'Application Root' ke folder tempat kamu upload (misal: public_html)"
echo "   3. Set 'Application Startup File' ke 'index.js'"
echo "   4. Tambahkan 'Environment Variables':"
echo "      - NODE_ENV = production"
echo "      - JWT_SECRET = (string random)"
echo "      - CORS_ORIGINS = https://yourdomain.com"
echo "   5. Klik 'Run npm install' (jika ada) lalu 'Restart'"
