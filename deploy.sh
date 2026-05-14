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
DEPLOY_PATH=~/domains/yourdomain.com/public_html

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
CORS_ORIGINS=https://yourdomain.com
EOF
  echo "   🔴 IMPORTANT: Edit server/.env and set JWT_SECRET to a random value!"
  echo "   🔴 IMPORTANT: Set CORS_ORIGINS to your actual domain!"
else
  echo ""
  echo "✅ [3/4] server/.env already exists"
fi

# --- 4. Copy to Hostinger public_html ---
echo ""
echo "📂 [4/4] Copying files to $DEPLOY_PATH..."
mkdir -p $DEPLOY_PATH
cp -r client/dist $DEPLOY_PATH/client/
cp -r server $DEPLOY_PATH/server/
cp package.json $DEPLOY_PATH/

echo ""
echo "✅ Done! Files copied to $DEPLOY_PATH"
echo ""
echo "📋 Next steps:"
echo "   1. SSH ke Hostinger dan pastiin Node.js udah aktif via Node.js Selector"
echo "   2. Masuk ke folder: cd $DEPLOY_PATH/server"
echo "   3. Jalankan: npm start"
echo ""
echo "   Atau kalo pake PM2: pm2 start server/index.js --name vibetape"
