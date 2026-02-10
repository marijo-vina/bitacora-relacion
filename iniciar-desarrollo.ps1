# Script para iniciar backend y frontend en desarrollo
# Este script asegura que el proxy esté configurado correctamente

Write-Host "🚀 Iniciando Nuestro Diario de Ruta - Desarrollo Local" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "bitacora-relacion-backend") -or -not (Test-Path "nuestro-diario-ruta-frontend")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde el directorio raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Verificar MySQL (XAMPP)
Write-Host "🗄️  Verificando MySQL..." -ForegroundColor Cyan
$mysqlRunning = Get-Process mysqld -ErrorAction SilentlyContinue
if (-not $mysqlRunning) {
    Write-Host "⚠️  MySQL no está ejecutándose" -ForegroundColor Yellow
    Write-Host "   Por favor inicia XAMPP y arranca MySQL primero" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "¿MySQL está corriendo? (s/n)"
    if ($continue -ne "s" -and $continue -ne "S") {
        Write-Host "❌ Inicia MySQL e intenta nuevamente" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ MySQL está corriendo" -ForegroundColor Green

# Verificar que el puerto 8000 esté libre para el backend
Write-Host ""
Write-Host "🔍 Verificando puerto 8000..." -ForegroundColor Cyan
$port8000 = netstat -ano | Select-String ":8000.*LISTENING"
if ($port8000) {
    Write-Host "⚠️  El puerto 8000 ya está en uso" -ForegroundColor Yellow
    Write-Host "   Probablemente el backend ya está corriendo" -ForegroundColor White
    $restart = Read-Host "¿Quieres reiniciarlo? (s/n)"
    if ($restart -eq "s" -or $restart -eq "S") {
        $pid = ($port8000 | Select-String -Pattern "\s+(\d+)$").Matches.Groups[1].Value
        Write-Host "   Deteniendo proceso $pid..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Verificar que el puerto 4200 esté libre para el frontend
Write-Host "🔍 Verificando puerto 4200..." -ForegroundColor Cyan
$port4200 = netstat -ano | Select-String ":4200.*LISTENING"
if ($port4200) {
    Write-Host "⚠️  El puerto 4200 ya está en uso" -ForegroundColor Yellow
    Write-Host "   Probablemente el frontend ya está corriendo" -ForegroundColor White
    $restart = Read-Host "¿Quieres reiniciarlo? (s/n)"
    if ($restart -eq "s" -or $restart -eq "S") {
        $pid = ($port4200 | Select-String -Pattern "\s+(\d+)$").Matches.Groups[1].Value
        Write-Host "   Deteniendo proceso $pid..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "✅ Todo listo para iniciar" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Abriendo 2 terminales..." -ForegroundColor Yellow
Write-Host ""

# Iniciar Backend
Write-Host "1️⃣  Backend (Laravel) - http://localhost:8000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\bitacora-relacion-backend'; Write-Host '🚀 Iniciando Backend Laravel...' -ForegroundColor Green; php artisan serve"

Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "2️⃣  Frontend (Angular) - http://localhost:4200" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\nuestro-diario-ruta-frontend'; Write-Host '🎨 Iniciando Frontend Angular...' -ForegroundColor Blue; Write-Host 'IMPORTANTE: El proxy está configurado para redirigir /api a localhost:8000' -ForegroundColor Yellow; Write-Host ''; ng serve --proxy-config proxy.conf.json"

Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "✅ Servidores iniciándose..." -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

Write-Host "⏳ Espera unos segundos y luego:" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Abre tu navegador en: http://localhost:4200" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Credenciales:" -ForegroundColor Yellow
Write-Host "   Email: mvinajera@gmail.com o 514dave.core@gmail.com" -ForegroundColor White
Write-Host "   Password: tu contraseña registrada" -ForegroundColor White
Write-Host ""

Write-Host "🧪 Para probar Cloudinary:" -ForegroundColor Cyan
Write-Host "   1. Inicia sesión" -ForegroundColor White
Write-Host "   2. Crea una nueva entrada" -ForegroundColor White
Write-Host "   3. Sube una imagen" -ForegroundColor White
Write-Host "   4. Verifica en https://cloudinary.com/console que se subió" -ForegroundColor White
Write-Host ""

Write-Host "🛑 Para detener los servidores:" -ForegroundColor Red
Write-Host "   Cierra las ventanas de PowerShell que se abrieron" -ForegroundColor White
Write-Host ""
