#!/bin/bash
set -e

echo "🔧 Configurando aplicación..."
php artisan config:cache

echo "📦 Ejecutando migraciones..."
php artisan migrate --force
echo "🌱 Ejecutando seeders..."
php artisan db:seed --force

echo "🔗 Configurando storage..."
php artisan storage:link || true

echo "✅ Iniciando servidor en puerto $PORT..."
exec php artisan serve --host=0.0.0.0 --port=$PORT
