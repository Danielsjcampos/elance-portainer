# Script to push everything to the new GitHub repository
# Already configured: remote origin points to elance-portainer.git
# Already configured: .gitignore excludes sensitive .env and large log files

git add .
git commit -m "🚀 Deployment: Base system configuration for Portainer"
git push origin main

Write-Host "✅ Todo o código foi enviado com sucesso para: https://github.com/Danielsjcampos/elance-portainer.git" -ForegroundColor Green
pause
