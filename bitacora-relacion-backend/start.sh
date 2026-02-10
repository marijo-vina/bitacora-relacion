#!/bin/sh
echo "🚀 Iniciando aplicación..."

echo "📦 Ejecutando migraciones..."
php artisan migrate --force

echo "🔗 Configurando storage links..."
php artisan storage:link || true

echo "✅ Iniciando servidor..."
php artisan serve --host=0.0.0.0 --port=$PORT
