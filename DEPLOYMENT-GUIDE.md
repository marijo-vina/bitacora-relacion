# 🚀 Guía de Despliegue a Producción
## Vercel + Render + Aiven

### Stack de Despliegue
- **Frontend:** Vercel (Angular)
- **Backend:** Render (Laravel)
- **Base de datos:** Aiven (MySQL)

---

## 📅 Fase 1: Base de Datos en Aiven

### Paso 1: Crear cuenta en Aiven
1. Ve a https://aiven.io
2. Haz clic en "Start Free"
3. Regístrate con tu email (puedes usar GitHub)
4. Verifica tu email

### Paso 2: Crear servicio MySQL
1. En el dashboard, haz clic en **"Create Service"**
2. Selecciona **MySQL**
3. Configura:
   - **Cloud:** AWS (o el que prefieras)
   - **Region:** Elige uno cercano (ej: us-east-1)
   - **Plan:** Selecciona **Hobbyist - Free** (gratis para siempre)
   - **Service name:** `bitacora-relacion-db` (o el nombre que prefieras)
4. Haz clic en **"Create service"**
5. Espera 3-5 minutos mientras se aprovisiona ⏳

### Paso 3: Obtener credenciales
Una vez que el servicio esté **RUNNING** (indicador verde):

1. Haz clic en el servicio creado
2. Ve a la pestaña **"Overview"**
3. Encontrarás los datos de conexión:
   ```
   Service URI: mysql://user:password@host:port/defaultdb?ssl-mode=REQUIRED
   Host: xxxxx.aivencloud.com
   Port: xxxxx
   User: avnadmin
   Password: [contraseña generada]
   Database: defaultdb
   ```

### Paso 4: Descargar certificado SSL (importante)
1. En la misma pestaña "Overview", busca **"Connection information"**
2. Haz clic en **"Download CA Certificate"**
3. Guarda el archivo `ca.pem` - lo necesitaremos para el backend

### Paso 5: Crear base de datos (opcional)
Aiven viene con `defaultdb`, pero puedes crear una personalizada:

1. En el dashboard del servicio, ve a **"Databases"**
2. Haz clic en **"Add database"**
3. Nombre: `bitacora_relacion`
4. Haz clic en **"Add"**

### ✅ Checklist Aiven Completado
- [ ] Servicio MySQL creado y RUNNING
- [ ] Credenciales anotadas (host, port, user, password, database)
- [ ] Certificado SSL descargado (ca.pem)
- [ ] Base de datos creada

---

## 🔧 Fase 2: Backend en Render

### Paso 1: Preparar repositorio
Antes de desplegar, necesitamos preparar algunos archivos:

1. **Verificar que `.env` no está en Git:**
   ```bash
   # Debe estar en .gitignore
   git status
   ```

2. **Crear archivo de configuración para Render:**
   - Crear `render.yaml` en la raíz del proyecto (lo crearemos después)

### Paso 2: Subir código a GitHub
Si aún no lo has hecho:

```bash
cd c:\bitacora-relacion
git init
git add .
git commit -m "Initial commit for production deployment"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/bitacora-relacion.git
git push -u origin main
```

### Paso 3: Crear cuenta en Render
1. Ve a https://render.com
2. Haz clic en **"Get Started"**
3. Regístrate con GitHub (más fácil para conectar repos)

### Paso 4: Crear Web Service para Backend
1. En el dashboard de Render, haz clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name:** `bitacora-relacion-backend`
   - **Region:** Elige uno cercano
   - **Branch:** `main`
   - **Root Directory:** `bitacora-relacion-backend`
   - **Runtime:** `PHP`
   - **Build Command:**
     ```bash
     composer install --optimize-autoloader --no-dev && php artisan config:cache && php artisan route:cache && php artisan view:cache
     ```
   - **Start Command:**
     ```bash
     php artisan serve --host=0.0.0.0 --port=$PORT
     ```
   - **Plan:** Free

### Paso 5: Configurar Variables de Entorno en Render
En la sección **"Environment Variables"**, agrega:

```bash
APP_NAME="Nuestro Diario de Ruta"
APP_ENV=production
APP_KEY=base64:GENERA_ESTO_LOCALMENTE_CON_php_artisan_key:generate
APP_DEBUG=false
APP_URL=https://bitacora-relacion-backend.onrender.com

# Configuración de Aiven MySQL
DB_CONNECTION=mysql
DB_HOST=[tu-host-de-aiven].aivencloud.com
DB_PORT=xxxxx
DB_DATABASE=bitacora_relacion
DB_USERNAME=avnadmin
DB_PASSWORD=[tu-password-de-aiven]
MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt

# Sesiones y caché
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# Sanctum
SANCTUM_STATEFUL_DOMAINS=tu-frontend.vercel.app

# CORS
FRONTEND_URL=https://tu-frontend.vercel.app

# Usuarios permitidos
PARTNER1_EMAIL=mvinajera@gmail.com
PARTNER2_EMAIL=514dave.core@gmail.com

# Cloudinary (si lo usas)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Paso 6: Ejecutar migraciones
Después del primer deploy:

1. Ve a **"Shell"** en el dashboard de Render
2. Ejecuta:
   ```bash
   php artisan migrate --force
   php artisan storage:link
   ```

### ✅ Checklist Render Backend Completado
- [ ] Código subido a GitHub
- [ ] Web Service creado en Render
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Backend accesible en https://xxx.onrender.com

---

## 🎨 Fase 3: Frontend en Vercel

### Paso 1: Actualizar configuración de producción
Editar `nuestro-diario-ruta-frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://bitacora-relacion-backend.onrender.com/api'
};
```

### Paso 2: Probar build localmente
```bash
cd nuestro-diario-ruta-frontend
npm run build
```

Verifica que no haya errores.

### Paso 3: Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Haz clic en **"Sign Up"**
3. Regístrate con GitHub

### Paso 4: Desplegar proyecto
1. En el dashboard, haz clic en **"Add New..."** → **"Project"**
2. Importa tu repositorio de GitHub
3. Configura:
   - **Framework Preset:** Angular
   - **Root Directory:** `nuestro-diario-ruta-frontend`
   - **Build Command:** `ng build --configuration production`
   - **Output Directory:** `dist/nuestro-diario-ruta-frontend/browser`
   - **Install Command:** `npm install`

### Paso 5: Configurar rewrites para SPA
Crear archivo `vercel.json` en `nuestro-diario-ruta-frontend/`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "https://bitacora-relacion-backend.onrender.com" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-XSRF-TOKEN" }
      ]
    }
  ]
}
```

### Paso 6: Actualizar URL del backend
Una vez desplegado, toma la URL de Vercel (ej: `https://tu-proyecto.vercel.app`) y:

1. Actualiza en Render las variables:
   - `FRONTEND_URL=https://tu-proyecto.vercel.app`
   - `SANCTUM_STATEFUL_DOMAINS=tu-proyecto.vercel.app`
2. Redeploya el backend

### ✅ Checklist Vercel Frontend Completado
- [ ] environment.prod.ts actualizado
- [ ] vercel.json creado
- [ ] Proyecto desplegado en Vercel
- [ ] URLs actualizadas en backend
- [ ] Aplicación accesible y funcional

---

## 🧪 Testing Final

### 1. Probar autenticación
- [ ] Abrir frontend en Vercel
- [ ] Login con tus credenciales
- [ ] Verificar que no hay errores de CORS
- [ ] Verificar que la sesión persiste

### 2. Probar funcionalidad completa
- [ ] Crear nueva entrada
- [ ] Subir imagen (Cloudinary)
- [ ] Ver timeline
- [ ] Editar entrada
- [ ] Eliminar entrada
- [ ] Verificar mapa

### 3. Verificar SSL/HTTPS
- [ ] Backend usa HTTPS
- [ ] Frontend usa HTTPS
- [ ] Conexión a BD es segura (SSL)

---

## 🎯 URLs de Producción

Anota tus URLs aquí:

- **Frontend (Vercel):** https://___________________.vercel.app
- **Backend (Render):** https://___________________.onrender.com
- **Base de datos (Aiven):** ___________________.aivencloud.com
- **Cloudinary:** https://cloudinary.com/console

---

## 🚨 Troubleshooting

### Error: "CORS blocked"
→ Verificar `SANCTUM_STATEFUL_DOMAINS` y `FRONTEND_URL` en Render

### Error: "Connection refused" a BD
→ Verificar credenciales de Aiven y que el servicio está RUNNING

### Error: "500 Internal Server Error"
→ Ver logs en Render: Dashboard → Logs

### Frontend no actualiza
→ En Vercel: Deployments → Redeploy

---

## 📝 Notas Importantes

- **Render Free Tier:** El backend se dormirá después de 15 min de inactividad. Primera petición será lenta (~30s)
- **Aiven Free Tier:** Ideal para desarrollo, límite de almacenamiento (5GB)
- **Vercel Free Tier:** Despliegues ilimitados, 100GB bandwidth/mes

¡Listo para producción! 🚀
