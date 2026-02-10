# 🚀 Guía de Despliegue a Producción
## Vercel + Railway + Aiven

### Stack de Despliegue
- **Frontend:** Vercel (Angular)
- **Backend:** Railway (Laravel)
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

## 🔧 Fase 2: Backend en Railway

### Paso 1: Preparar repositorio
1. **Verificar que `.env` no está en Git** (debe estar en .gitignore)
2. **Subir código a GitHub** (si no lo has hecho):
   ```bash
   cd c:\bitacora-relacion
   git init
   git add .
   git commit -m "Preparado para produccion"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/bitacora-relacion.git
   git push -u origin main
   ```

### Paso 2: Crear cuenta en Railway
1. Ve a https://railway.app
2. Haz clic en **"Start a New Project"**
3. Regístrate con GitHub (recomendado)

### Paso 3: Crear proyecto desde GitHub
1. En el dashboard, haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Conecta tu repositorio: `tu-usuario/bitacora-relacion`
4. Railway detectará automáticamente el proyecto

### Paso 4: Configurar el servicio
1. Una vez creado, haz clic en el servicio
2. Ve a **"Settings"**
3. En **"Root Directory"**, agrega:
   ```
   bitacora-relacion-backend
   ```
4. En **"Public Networking"**, haz clic en **"Generate Domain"**
   - Esto te dará una URL como: `https://bitacora-relacion-backend-production.up.railway.app`

### Paso 5: Configurar Variables de Entorno
1. Ve a la pestaña **"Variables"**
2. Haz clic en **"Raw Editor"** (arriba a la derecha)
3. Pega todas las variables:

```env
APP_NAME=Nuestro Diario de Ruta
APP_ENV=production
APP_KEY=base64:TU_APP_KEY_GENERADA
APP_DEBUG=false
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
DB_CONNECTION=mysql
DB_HOST=tu-host.aivencloud.com
DB_PORT=tu-puerto
DB_DATABASE=defaultdb
DB_USERNAME=avnadmin
DB_PASSWORD=tu-password
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
SANCTUM_STATEFUL_DOMAINS=${{RAILWAY_PUBLIC_DOMAIN}}
FRONTEND_URL=https://tu-frontend.vercel.app
PARTNER1_EMAIL=mvinajera@gmail.com
PARTNER2_EMAIL=514dave.core@gmail.com
LOG_CHANNEL=stderr
LOG_LEVEL=error
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

**Nota:** Railway usa `${{RAILWAY_PUBLIC_DOMAIN}}` para auto-completar tu dominio.

### Paso 6: Ejecutar migraciones
Una vez desplegado exitosamente:

1. Ve a tu servicio en Railway
2. Haz clic en los tres puntos (**...**) → **"Create Terminal"**
3. Ejecuta:
   ```bash
   php artisan migrate --force
   php artisan storage:link
   ```

### ✅ Checklist Railway Backend Completado
- [x] Código subido a GitHub
- [x] Proyecto creado en Railway desde GitHub
- [x] Root Directory configurado
- [x] Dominio público generado
- [x] Variables de entorno configuradas
- [x] Deploy exitoso
- [ ] Migraciones ejecutadas
- [ ] Backend accesible en https://xxx.up.railway.app

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
1. En el dashboard, haz clic en **"Add New..-production.up.railway.app/api'
};
```

**IMPORTANTE:** Reemplaza la URL con tu dominio real de Railway.Configura:
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
Una vez desplegadailway las variables:
   - `FRONTEND_URL=https://tu-proyecto.vercel.app`
   - `SANCTUM_STATEFUL_DOMAINS=tu-proyecto.vercel.app`
2. Railway redeployará automáticamentes://tu-proyecto.vercel.app`
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
ailway):** https://___________________.up.railway.app
- **Frontend (Vercel):** https://___________________.vercel.app
- **Backend (Render):** https://___________________.onrender.com
- **Base de datos (Aiven):** ___________________.aivencloud.com
- **Cloudinary:** https://cloudinary.com/console

---

## 🚨 Troubleshooting
ailway

### Error: "Connection refused" a BD
→ Verificar credenciales de Aiven y que el servicio está RUNNING

### Error: "500 Internal Server Error"
→ Ver logs en Railway: Click en el servicio → Deploy Logs

### Frontend no actualiza
→ En Vercel: Deployments → Redeploy

### Railway: "Deployment failed during build"
→ Ver Build Logs para el error específico
→ Verificar que Root Directory esté configurado

---

## 📝 Notas Importantes

- **Railway Free Tier:** $5 de crédito mensual (suficiente para desarrollo). El backend permanece activo.

- **Render Free Tier:** El backend se dormirá después de 15 min de inactividad. Primera petición será lenta (~30s)
- **Aiven Free Tier:** Ideal para desarrollo, límite de almacenamiento (5GB)
- **Vercel Free Tier:** Despliegues ilimitados, 100GB bandwidth/mes

¡Listo para producción! 🚀
