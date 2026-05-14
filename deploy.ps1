# VibeTape Windows Deploy Script
Write-Host "🚀 Memulai proses persiapan deploy..." -ForegroundColor Cyan

# 1. Build Frontend
Write-Host "`n📦 [1/3] Building frontend (React)..." -ForegroundColor Yellow
cd client
npm install
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build Frontend Gagal!"; exit }
cd ..

# 2. Bersihkan & Siapkan Folder Deploy
Write-Host "`n📂 [2/3] Menyiapkan folder deploy_ready..." -ForegroundColor Yellow
if (Test-Path "deploy_ready") { Remove-Item -Recurse -Force "deploy_ready" }
New-Item -ItemType Directory -Path "deploy_ready\client\dist" -Force

# 3. Copy File
Write-Host "`n🚚 [3/3] Menyalin file..." -ForegroundColor Yellow
Copy-Item -Path "server\*" -Destination "deploy_ready\" -Recurse -Exclude "node_modules", ".env", "database.sqlite"
Copy-Item -Path "client\dist\*" -Destination "deploy_ready\client\dist\" -Recurse
Copy-Item -Path ".htaccess" -Destination "deploy_ready\"

Write-Host "`n✅ SELESAI!" -ForegroundColor Green
Write-Host "Sekarang upload SEMUA ISI di dalam folder 'deploy_ready' ke Hostinger."
Write-Host "Lalu jangan lupa set Environment Variables di hPanel Hostinger."
