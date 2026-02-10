# Script de Setup Local para Nuestro Diario de Ruta
# Ejecutar como: .\setup-local.ps1

Write-Host "🚀 Configurando Nuestro Diario de Ruta - Entorno Local" -ForegroundColor Cyan
Write-Host ""

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "bitacora-relacion-backend") -or -not (Test-Path "nuestro-diario-ruta-frontend")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde el directorio raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Backend Setup
Write-Host "📦 Configurando Backend (Laravel)..." -ForegroundColor Yellow
Set-Location bitacora-relacion-backend

# Verificar si composer está instalado
if (-not (Get-Command composer -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Composer no está instalado. Por favor instala Composer primero." -ForegroundColor Red
    exit 1
}

# Instalar dependencias
Write-Host "📥 Instalando dependencias de PHP..." -ForegroundColor Cyan
composer install

# Verificar .env
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
    if (-not (Test-Path ".env")) {
        Write-Host "⚠️  Archivo .env.example no encontrado. Usando valores por defecto." -ForegroundColor Yellow
    }
}

# Generar APP_KEY si no existe
Write-Host "🔑 Generando APP_KEY..." -ForegroundColor Cyan
php artisan key:generate --force

# Verificar credenciales de Cloudinary
Write-Host ""
Write-Host "☁️  Verificando configuración de Cloudinary..." -ForegroundColor Cyan
$envContent = Get-Content ".env" -Raw
if ($envContent -match "CLOUDINARY_CLOUD_NAME=your_cloud_name" -or $envContent -match "CLOUDINARY_CLOUD_NAME=`$") {
    Write-Host "⚠️  Cloudinary no configurado. Necesitas configurar las credenciales en .env:" -ForegroundColor Yellow
    Write-Host "   - CLOUDINARY_CLOUD_NAME" -ForegroundColor White
    Write-Host "   - CLOUDINARY_API_KEY" -ForegroundColor White
    Write-Host "   - CLOUDINARY_API_SECRET" -ForegroundColor White
    Write-Host "   - CLOUDINARY_URL" -ForegroundColor White
    Write-Host ""
    $configure = Read-Host "¿Quieres configurar Cloudinary ahora? (s/n)"
    if ($configure -eq "s" -or $configure -eq "S") {
        $cloudName = Read-Host "Cloud Name"
        $apiKey = Read-Host "API Key"
        $apiSecret = Read-Host "API Secret" -AsSecureString
        $apiSecretPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiSecret))
        
        $envContent = $envContent -replace "CLOUDINARY_CLOUD_NAME=.*", "CLOUDINARY_CLOUD_NAME=$cloudName"
        $envContent = $envContent -replace "CLOUDINARY_API_KEY=.*", "CLOUDINARY_API_KEY=$apiKey"
        $envContent = $envContent -replace "CLOUDINARY_API_SECRET=.*", "CLOUDINARY_API_SECRET=$apiSecretPlain"
        $envContent = $envContent -replace "CLOUDINARY_URL=.*", "CLOUDINARY_URL=cloudinary://${apiKey}:${apiSecretPlain}@${cloudName}"
        
        Set-Content ".env" $envContent
        Write-Host "✅ Credenciales de Cloudinary configuradas" -ForegroundColor Green
    }
}

# Verificar MySQL
Write-Host ""
Write-Host "🗄️  Verificando MySQL..." -ForegroundColor Cyan
$mysqlRunning = Get-Process mysqld -ErrorAction SilentlyContinue
if (-not $mysqlRunning) {
    Write-Host "⚠️  MySQL no parece estar ejecutándose" -ForegroundColor Yellow
    Write-Host "   Por favor inicia MySQL antes de continuar" -ForegroundColor White
    $continue = Read-Host "¿Continuar de todos modos? (s/n)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 0
    }
} else {
    Write-Host "✅ MySQL está ejecutándose" -ForegroundColor Green
}

# Migrar base de datos
Write-Host ""
$migrate = Read-Host "¿Ejecutar migraciones de base de datos? (s/n)"
if ($migrate -eq "s" -or $migrate -eq "S") {
    Write-Host "🔄 Ejecutando migraciones..." -ForegroundColor Cyan
    php artisan migrate
}

# Test Cloudinary
Write-Host ""
$testCloudinary = Read-Host "¿Probar conexión con Cloudinary? (s/n)"
if ($testCloudinary -eq "s" -or $testCloudinary -eq "S") {
    Write-Host "☁️  Probando Cloudinary..." -ForegroundColor Cyan
    php artisan cloudinary:test
}

# Storage link
Write-Host ""
Write-Host "🔗 Creando symlink de storage..." -ForegroundColor Cyan
php artisan storage:link

Set-Location ..

# Frontend Setup
Write-Host ""
Write-Host "🎨 Configurando Frontend (Angular)..." -ForegroundColor Yellow
Set-Location nuestro-diario-ruta-frontend

# Verificar si npm está instalado
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm no está instalado. Por favor instala Node.js primero." -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Instalar dependencias
Write-Host "📥 Instalando dependencias de npm..." -ForegroundColor Cyan
npm install

Set-Location ..

# Resumen
Write-Host ""
Write-Host "✅ ¡Setup completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend (Terminal 1):" -ForegroundColor Yellow
Write-Host "  cd bitacora-relacion-backend" -ForegroundColor White
Write-Host "  php artisan serve" -ForegroundColor White
Write-Host ""
Write-Host "Frontend (Terminal 2):" -ForegroundColor Yellow
Write-Host "  cd nuestro-diario-ruta-frontend" -ForegroundColor White
Write-Host "  ng serve" -ForegroundColor White
Write-Host ""
Write-Host "Luego abre: http://localhost:4200" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentación adicional:" -ForegroundColor Cyan
Write-Host "  - DEPLOYMENT.md: Guía completa de despliegue" -ForegroundColor White
Write-Host "  - CHECKLIST-DEPLOY.md: Checklist de producción" -ForegroundColor White
Write-Host ""
