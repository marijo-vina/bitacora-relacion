# 🚀 Pasos para Subir a Producción - Nuestro Diario de Ruta

## ✅ Estado Actual del Proyecto

- ✅ Backend configurado con Laravel 11
- ✅ Frontend Angular 19 listo
- ✅ Cloudinary integrado y funcionando
- ✅ Database migration ejecutada (`file_url` agregado)
- ✅ Conexión con Cloudinary verificada
- ✅ MediaService actualizado para usar Cloudinary

## 📋 Paso 1: Elegir Proveedor de Hosting

### Opciones Recomendadas:

#### Backend (Laravel + MySQL)
1. **DigitalOcean** ($4-6/mes)
   - Droplet con Ubuntu
   - MySQL incluido
   - Panel sencillo

2. **Railway.app** ($5/mes aprox)
   - Deploy automático desde Git
   - MySQL incluido
   - SSL gratis

3. **Hostinger** ($3-8/mes)
   - Hosting compartido con cPanel
   - MySQL incluido
   - SSL gratis

#### Frontend (Angular)
1. **Vercel** (GRATIS)
   - Deploy automático
   - SSL incluido
   - CDN global

2. **Netlify** (GRATIS)
   - Deploy automático
   - SSL incluido
   - Domain personalizado

3. **CloudFlare Pages** (GRATIS)
   - Deploy automático
   - SSL incluido
   - DDoS protection

## 📦 Paso 2: Preparar Backend para Producción

### 2.1 Actualizar archivo .env para producción

```bash
cd bitacora-relacion-backend
```

Crea un archivo `.env.production` con estos valores:

```env
APP_NAME="Nuestro Diario de Ruta"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio-backend.com

# Base de datos de producción (obtenlas de tu hosting)
DB_CONNECTION=mysql
DB_HOST=tu_host_mysql
DB_PORT=3306
DB_DATABASE=nombre_base_datos
DB_USERNAME=usuario_mysql
DB_PASSWORD=password_mysql

# Cloudinary (las que ya tienes configuradas)
CLOUDINARY_CLOUD_NAME=dpny9usfx
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_URL=cloudinary://tu_api_key:tu_api_secret@dpny9usfx

# URL del frontend
FRONTEND_URL=https://tu-dominio-frontend.com
SANCTUM_STATEFUL_DOMAINS=tu-dominio-frontend.com

# Usuarios permitidos
PARTNER1_EMAIL=mvinajera@gmail.com
PARTNER2_EMAIL=514dave.core@gmail.com

# Todo lo demás igual que .env actual
```

### 2.2 Subir código del backend

```bash
# Si usas Git
git init
git add .
git commit -m "Proyecto listo para producción"

# Si tu hosting usa Git (Railway, Heroku, etc)
git remote add production tu-url-git
git push production main

# Si tu hosting usa FTP/cPanel
# - Sube todos los archivos EXCEPTO:
#   * /vendor (se instalará en servidor)
#   * /node_modules
#   * .env (créalo directamente en el servidor)
#   * /storage/logs/* (se crean automáticamente)
```

### 2.3 En el servidor, ejecuta:

```bash
# Instalar dependencias
composer install --optimize-autoloader --no-dev

# Generar APP_KEY nueva
php artisan key:generate

# Ejecutar migraciones
php artisan migrate --force

# Crear symlink de storage
php artisan storage:link

# Cachear configuraciones
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Probar Cloudinary
php artisan cloudinary:test
```

### 2.4 Configurar permisos

```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

## 🎨 Paso 3: Preparar Frontend para Producción

### 3.1 Actualizar environment.prod.ts

Ya está actualizado en:
`nuestro-diario-ruta-frontend/src/environments/environment.prod.ts`

Cambia `apiUrl` por tu dominio real de backend:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-dominio-backend.com/api',
};
```

### 3.2 Hacer build de producción

```powershell
cd nuestro-diario-ruta-frontend

# Instalar dependencias
npm install

# Build de producción
ng build --configuration production
```

Esto generará la carpeta `dist/nuestro-diario-ruta-frontend/browser/`

### 3.3 Subir a hosting frontend

#### Opción A: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desde la carpeta del frontend
cd nuestro-diario-ruta-frontend
vercel

# Responde las preguntas:
# - Project name: nuestro-diario-ruta
# - Directory: ./ (o presiona Enter)
# - Override settings? No

# Deploy a producción
vercel --prod
```

#### Opción B: Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist/nuestro-diario-ruta-frontend/browser
```

#### Opción C: cPanel/FTP
- Sube el contenido de `dist/nuestro-diario-ruta-frontend/browser/` a la carpeta `public_html/`
- Crea un archivo `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 🔒 Paso 4: Configurar SSL/HTTPS

### Si usas cPanel:
1. Ve a "SSL/TLS Status"
2. Click en "Run AutoSSL" (Let's Encrypt gratis)

### Si usas Vercel/Netlify:
- SSL se configura automáticamente ✅

### Si usas DigitalOcean/Railway:
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Generar certificado
sudo certbot --nginx -d tu-dominio.com
```

## ✅ Paso 5: Verificaciones Post-Despliegue

### Backend
```bash
# 1. Verifica que la API responde
curl https://tu-dominio-backend.com/api/health

# 2. Verifica Cloudinary
php artisan cloudinary:test

# 3. Revisa logs
tail -f storage/logs/laravel-*.log
```

### Frontend
1. Abre `https://tu-dominio-frontend.com`
2. Verifica que carga sin errores
3. Abre DevTools (F12) y verifica:
   - No hay errores CORS en Console
   - Las peticiones van a tu backend de producción
   - El login funciona

### Test Completo
1. ✅ Login con uno de los dos usuarios
2. ✅ Crear entrada con título y descripción
3. ✅ Subir una imagen
4. ✅ Verifica en [Cloudinary Dashboard](https://cloudinary.com/console/media_library) que la imagen se subió
5. ✅ Verifica que la imagen se muestra en el frontend
6. ✅ Elimina la entrada
7. ✅ Verifica que la imagen se eliminó de Cloudinary

## 🐛 Troubleshooting Común

### Error: "CORS policy"
→ Verifica en backend `.env`:
```env
FRONTEND_URL=https://tu-dominio-frontend.com
SANCTUM_STATEFUL_DOMAINS=tu-dominio-frontend.com
```
→ Ejecuta: `php artisan config:clear`

### Error: "500 Internal Server Error"
→ Revisa logs: `storage/logs/laravel.log`
→ Verifica permisos: `chmod -R 775 storage`

### Error: "Could not connect to database"
→ Verifica credenciales de BD en `.env`
→ Verifica que MySQL está corriendo

### Imágenes no se suben a Cloudinary
→ Ejecuta: `php artisan cloudinary:test`
→ Verifica credenciales en `.env`

### Frontend página en blanco
→ Verifica que `apiUrl` en `environment.prod.ts` sea correcto
→ Verifica HTTPS (no HTTP)
→ Revisa Console en DevTools (F12)

## 📊 Monitoreo Continuo

### Cloudinary
- Dashboard: https://cloudinary.com/console
- Monitorea uso mensual (25GB gratuitos)
- Verifica que las imágenes se estén subiendo

### Backend
```bash
# Ver logs en tiempo real
tail -f storage/logs/laravel.log
```

### Frontend
- Usa Google Analytics o Vercel Analytics
- Monitorea errores con Sentry (opcional)

## 🎉 ¡Listo para Producción!

Tu aplicación ya está lista. Los próximos pasos son:

1. **Registrar los dos usuarios** (solo pueden registrarse tus emails configurados)
2. **Comenzar a crear entradas** con imágenes
3. **Disfrutar** de tu diario personal en la nube

---

## 📞 Recursos Adicionales

- **Documentación completa:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Checklist detallado:** [CHECKLIST-DEPLOY.md](./CHECKLIST-DEPLOY.md)
- **Cloudinary Dashboard:** https://cloudinary.com/console
- **Laravel Docs:** https://laravel.com/docs

---

**¿Necesitas ayuda?** Revisa los archivos de documentación incluidos en el proyecto.
