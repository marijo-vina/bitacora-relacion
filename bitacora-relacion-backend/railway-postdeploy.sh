#!/bin/sh
# Script de post-deploy para Railway
echo "Ejecutando migraciones..."
php artisan migrate --force
echo "Configurando storage links..."
php artisan storage:link || true
echo "Migraciones completadas!"
