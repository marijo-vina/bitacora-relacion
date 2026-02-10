# Script de preparacion para despliegue en Render
# Este script genera un APP_KEY y muestra las variables de entorno necesarias

Write-Host "=== Preparando Backend para Render ===" -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del backend
Set-Location -Path "$PSScriptRoot\bitacora-relacion-backend"

# Verificar que composer existe
if (-not (Get-Command composer -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Composer no esta instalado" -ForegroundColor Red
    exit 1
}

# Verificar que php existe
if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] PHP no esta instalado" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] PHP y Composer detectados" -ForegroundColor Green
Write-Host ""

# Generar APP_KEY
Write-Host "Generando APP_KEY..." -ForegroundColor Yellow
$appKey = php artisan key:generate --show 2>$null

if (-not $appKey) {
    Write-Host "[ERROR] No se pudo generar APP_KEY" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[OK] APP_KEY generado exitosamente" -ForegroundColor Green
Write-Host ""

# Mostrar instrucciones
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "VARIABLES DE ENTORNO PARA RENDER" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Copia estas variables en Render (Dashboard > Environment):" -ForegroundColor Yellow
Write-Host ""

$envVars = @"
APP_NAME=Nuestro Diario de Ruta
APP_ENV=production
APP_KEY=$appKey
APP_DEBUG=false
APP_URL=https://tu-backend.onrender.com

DB_CONNECTION=mysql
DB_HOST=tu-host-aiven.aivencloud.com
DB_PORT=tu-puerto-aiven
DB_DATABASE=bitacora_relacion
DB_USERNAME=avnadmin
DB_PASSWORD=tu-password-aiven
MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

SANCTUM_STATEFUL_DOMAINS=tu-frontend.vercel.app
FRONTEND_URL=https://tu-frontend.vercel.app

PARTNER1_EMAIL=mvinajera@gmail.com
PARTNER2_EMAIL=514dave.core@gmail.com

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

LOG_CHANNEL=stderr
LOG_LEVEL=error
"@

Write-Host $envVars -ForegroundColor White
Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Guardar en archivo
$envVars | Out-File -FilePath "render-env-vars.txt" -Encoding UTF8
Write-Host "[OK] Variables guardadas en: render-env-vars.txt" -ForegroundColor Green
Write-Host ""

Write-Host "PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Crea base de datos en Aiven (https://aiven.io)" -ForegroundColor White
Write-Host "   - Copia credenciales de conexion" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Sube codigo a GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Preparado para produccion'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Crea Web Service en Render (https://render.com)" -ForegroundColor White
Write-Host "   - Conecta tu repo de GitHub" -ForegroundColor Gray
Write-Host "   - Pega las variables de entorno de render-env-vars.txt" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Actualiza environment.prod.ts con URL de Render" -ForegroundColor White
Write-Host ""
Write-Host "5. Despliega frontend en Vercel (https://vercel.com)" -ForegroundColor White
Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ver guia completa: DEPLOYMENT-GUIDE.md" -ForegroundColor Cyan
Write-Host ""
