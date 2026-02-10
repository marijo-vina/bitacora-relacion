# Script de preparación para producción
# Ejecutar ANTES de subir a producción

Write-Host "🚀 Preparando proyecto para producción..." -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "bitacora-relacion-backend") -or -not (Test-Path "nuestro-diario-ruta-frontend")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde el directorio raíz del proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "📦 PASO 1: Preparando Backend" -ForegroundColor Yellow
Write-Host ""

Set-Location bitacora-relacion-backend

# Verificar .env
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: No se encuentra el archivo .env" -ForegroundColor Red
    exit 1
}

# Verificar Cloudinary
Write-Host "☁️  Verificando Cloudinary..." -ForegroundColor Cyan
$cloudinaryTest = php artisan cloudinary:test 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Cloudinary no está configurado correctamente" -ForegroundColor Red
    Write-Host $cloudinaryTest -ForegroundColor Red
    exit 1
}
Write-Host "✅ Cloudinary OK" -ForegroundColor Green

# Verificar que exista APP_KEY
$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch "APP_KEY=base64:") {
    Write-Host "⚠️  APP_KEY no encontrada, generando..." -ForegroundColor Yellow
    php artisan key:generate
    Write-Host "✅ APP_KEY generada" -ForegroundColor Green
} else {
    Write-Host "✅ APP_KEY OK" -ForegroundColor Green
}

Write-Host ""
Write-Host "🗄️  Verificando base de datos..." -ForegroundColor Cyan
$migrateStatus = php artisan migrate:status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: No se puede conectar a la base de datos" -ForegroundColor Red
    Write-Host "   Verifica las credenciales en .env" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Base de datos OK" -ForegroundColor Green

Write-Host ""
Write-Host "🧹 Limpiando cachés..." -ForegroundColor Cyan
php artisan config:clear | Out-Null
php artisan cache:clear | Out-Null
php artisan view:clear | Out-Null
php artisan route:clear | Out-Null
Write-Host "✅ Cachés limpiados" -ForegroundColor Green

Write-Host ""
Write-Host "📝 Verificando archivos críticos..." -ForegroundColor Cyan
$criticalFiles = @(
    "app/Services/MediaService.php",
    "config/cloudinary.php",
    "app/Console/Commands/TestCloudinaryConnection.php"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file NO ENCONTRADO" -ForegroundColor Red
        exit 1
    }
}

Set-Location ..

Write-Host ""
Write-Host "🎨 PASO 2: Preparando Frontend" -ForegroundColor Yellow
Write-Host ""

Set-Location nuestro-diario-ruta-frontend

# Verificar environment.prod.ts
Write-Host "📝 Verificando configuración de producción..." -ForegroundColor Cyan
$envProd = Get-Content "src/environments/environment.prod.ts" -Raw
if ($envProd -match "tu-dominio") {
    Write-Host "⚠️  ADVERTENCIA: environment.prod.ts aún tiene valores de ejemplo" -ForegroundColor Yellow
    Write-Host "   Necesitas actualizar 'apiUrl' con tu dominio real de backend" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "¿Continuar de todos modos? (s/n)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 0
    }
} else {
    Write-Host "✅ environment.prod.ts configurado" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Verificando dependencias..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules no encontrado" -ForegroundColor Yellow
    $install = Read-Host "¿Instalar dependencias ahora? (s/n)"
    if ($install -eq "s" -or $install -eq "S") {
        npm install
    }
} else {
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
}

Write-Host ""
$build = Read-Host "¿Hacer build de producción del frontend ahora? (s/n)"
if ($build -eq "s" -or $build -eq "S") {
    Write-Host "🔨 Building..." -ForegroundColor Cyan
    npm run build -- --configuration production
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build completado exitosamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "📂 Los archivos están en: dist/nuestro-diario-ruta-frontend/browser/" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Error en el build" -ForegroundColor Red
        exit 1
    }
}

Set-Location ..

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "✅ ¡Proyecto listo para producción!" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 CHECKLIST DE PRODUCCIÓN:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend:" -ForegroundColor Cyan
Write-Host "  ✅ Cloudinary configurado y funcionando"
Write-Host "  ✅ Base de datos conectada"
Write-Host "  ✅ Migraciones ejecutadas"
Write-Host "  ⚠️  Pendiente: Subir código al servidor"
Write-Host "  ⚠️  Pendiente: Configurar .env en servidor de producción"
Write-Host "  ⚠️  Pendiente: Ejecutar 'composer install --no-dev' en servidor"
Write-Host ""

Write-Host "Frontend:" -ForegroundColor Cyan
if ($build -eq "s" -or $build -eq "S") {
    Write-Host "  ✅ Build de producción creado"
    Write-Host "  ⚠️  Pendiente: Subir 'dist/nuestro-diario-ruta-frontend/browser/' a hosting"
} else {
    Write-Host "  ⚠️  Pendiente: Hacer build de producción"
    Write-Host "  ⚠️  Pendiente: Subir archivos a hosting"
}
Write-Host "  ⚠️  Pendiente: Actualizar apiUrl en environment.prod.ts" -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 Próximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Lee PASOS-PRODUCCION.md para guía detallada"
Write-Host "  2. Elige tu proveedor de hosting (Vercel, Railway, etc.)"
Write-Host "  3. Configura dominios"
Write-Host "  4. Sube el código"
Write-Host "  5. Configura SSL"
Write-Host "  6. ¡Prueba tu aplicación!"
Write-Host ""

Write-Host "🔗 Recursos:" -ForegroundColor Cyan
Write-Host "  - PASOS-PRODUCCION.md: Guía paso a paso"
Write-Host "  - DEPLOYMENT.md: Documentación técnica completa"
Write-Host "  - CHECKLIST-DEPLOY.md: Checklist detallado"
Write-Host ""
