# 🚀 Checklist de Despliegue a Producción

## ✅ Pre-requisitos

- [ ] Cuenta de Cloudinary creada
- [ ] Credenciales de Cloudinary a mano (Cloud Name, API Key, API Secret)
- [ ] Servidor de producción configurado
- [ ] Base de datos de producción creada
- [ ] Dominio(s) configurado(s) y apuntando a tu servidor

## 📦 Backend (Laravel)

### Configuración
- [ ] Copiar `.env.production.example` a `.env`
- [ ] Configurar `APP_URL` con tu dominio de backend
- [ ] Configurar credenciales de base de datos de producción
- [ ] Configurar credenciales de Cloudinary
- [ ] Configurar `FRONTEND_URL` con tu dominio de frontend
- [ ] Configurar `SANCTUM_STATEFUL_DOMAINS`
- [ ] Generar nueva `APP_KEY`: `php artisan key:generate`
- [ ] Establecer `APP_DEBUG=false` y `APP_ENV=production`

### Verificación
- [ ] Ejecutar `php artisan cloudinary:test` (debe mostrar ✅)
- [ ] Ejecutar `php artisan migrate --force`
- [ ] Ejecutar `php artisan config:cache`
- [ ] Ejecutar `php artisan route:cache`
- [ ] Ejecutar `php artisan view:cache`

### Instalación
- [ ] Ejecutar `composer install --optimize-autoloader --no-dev`
- [ ] Configurar permisos: `chmod -R 775 storage bootstrap/cache`
- [ ] Crear symlink: `php artisan storage:link`

### Seguridad
- [ ] SSL/HTTPS configurado
- [ ] Firewall configurado
- [ ] `.env` no accesible públicamente

## 🎨 Frontend (Angular)

### Configuración
- [ ] Actualizar `environment.prod.ts` con URL de API de producción
- [ ] Verificar que `production: true`

### Build
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `ng build --configuration production`
- [ ] Verificar que se generó la carpeta `dist/`

### Despliegue
- [ ] Subir contenido de `dist/` a servidor web
- [ ] Configurar servidor web (Apache/Nginx) para SPA
- [ ] Configurar SSL/HTTPS

## 🧪 Testing Post-Despliegue

### Backend
- [ ] Verificar que API responde: `https://tu-backend.com/api/health`
- [ ] Verificar CORS: Abrir frontend y verificar que no hay errores CORS
- [ ] Verificar autenticación: Login funciona
- [ ] Verificar Cloudinary: Subir una imagen de prueba

### Frontend
- [ ] Abrir aplicación en navegador
- [ ] Login con credenciales de prueba
- [ ] Crear entrada con imagen
- [ ] Verificar que imagen se muestra correctamente
- [ ] Verificar que imagen está en Cloudinary Dashboard
- [ ] Eliminar entrada y verificar que imagen se eliminó de Cloudinary

### Performance
- [ ] Verificar velocidad de carga de imágenes
- [ ] Verificar que las imágenes usan CDN de Cloudinary
- [ ] Verificar transformaciones automáticas (WebP, auto quality)

## 📊 Monitoreo

- [ ] Configurar logs: `tail -f storage/logs/laravel.log`
- [ ] Monitorear uso de Cloudinary: https://cloudinary.com/console/usage
- [ ] Verificar límites de plan Free no se excedan
- [ ] Configurar alertas de errores

## 🔄 Backup

- [ ] Configurar backup automático de base de datos
- [ ] Documentar proceso de restauración
- [ ] Nota: Cloudinary mantiene respaldo automático de imágenes

## 📞 Información de Contacto y Recursos

- **Cloudinary Dashboard:** https://cloudinary.com/console
- **Documentación:** Ver [DEPLOYMENT.md](./DEPLOYMENT.md)

## ⚠️ Errores Comunes

### "Invalid credentials"
→ Verificar `.env` y ejecutar `php artisan config:clear`

### "CORS error"
→ Verificar `FRONTEND_URL` y `SANCTUM_STATEFUL_DOMAINS` en `.env`

### "Could not connect to database"
→ Verificar credenciales de BD en `.env`

### "Images not showing"
→ Verificar que Cloudinary test pasa: `php artisan cloudinary:test`

---

**Última actualización:** 9 de Febrero, 2026
