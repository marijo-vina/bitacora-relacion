# 📖 Nuestro Diario de Ruta

Una aplicación web personal para documentar y compartir el viaje de vida de una pareja. Permite crear entradas con texto, ubicaciones GPS, imágenes y videos, todo almacenado de forma segura y accesible solo para los dos usuarios autorizados.

## 🌟 Características

- ✅ **Autenticación segura** con Laravel Sanctum
- 📝 **Entradas de diario** con título, contenido, fecha y ubicación
- 📍 **Mapa interactivo** con todas las ubicaciones visitadas
- 📸 **Multimedia** - Subida de imágenes y videos a Cloudinary
- 💬 **Comentarios** entre usuarios en cada entrada
- 🎨 **Interfaz moderna** con Angular y TailwindCSS
- 📱 **Responsive** - Funciona en desktop y móviles
- ☁️ **Almacenamiento en la nube** con Cloudinary CDN
- 🔒 **Privado** - Solo accesible para dos usuarios específicos

## 🛠️ Tecnologías

### Backend
- **Laravel 11** - Framework PHP
- **MySQL** - Base de datos
- **Cloudinary** - Almacenamiento de multimedia
- **Laravel Sanctum** - Autenticación API

### Frontend
- **Angular 19** - Framework JavaScript
- **TailwindCSS** - Estilos
- **Leaflet** - Mapas interactivos
- **TypeScript** - Tipado estático

## 📋 Pre-requisitos

- **PHP** >= 8.2
- **Composer**
- **Node.js** >= 18
- **npm** o **yarn**
- **MySQL** >= 8.0
- **Cuenta de Cloudinary** (gratuita)

## 🚀 Instalación Rápida

### Opción 1: Script Automático (Windows)

```powershell
cd bitacora-relacion
.\setup-local.ps1
```

### Opción 2: Manual

#### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd bitacora-relacion
```

#### 2. Configurar Backend

```bash
cd bitacora-relacion-backend

# Instalar dependencias
composer install

# Configurar .env
cp .env.example .env
# Edita .env con tus credenciales

# Generar APP_KEY
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Probar Cloudinary
php artisan cloudinary:test

# Crear symlink de storage
php artisan storage:link
```

#### 3. Configurar Frontend

```bash
cd ../nuestro-diario-ruta-frontend

# Instalar dependencias
npm install
```

#### 4. Configurar Cloudinary

En el archivo `.env` del backend, configura:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_URL=cloudinary://tu_api_key:tu_api_secret@tu_cloud_name
```

Obtén estas credenciales en: https://cloudinary.com/console

## 🏃‍♂️ Ejecutar en Desarrollo

### Terminal 1 - Backend

```bash
cd bitacora-relacion-backend
php artisan serve
```

El backend estará disponible en: http://localhost:8000

### Terminal 2 - Frontend

```bash
cd nuestro-diario-ruta-frontend
ng serve
```

El frontend estará disponible en: http://localhost:4200

## 👥 Usuarios

La aplicación está configurada para **solo dos usuarios** específicos. Configura sus emails en `.env`:

```env
PARTNER1_EMAIL=primer_usuario@email.com
PARTNER2_EMAIL=segundo_usuario@email.com
```

Solo estos emails podrán registrarse y acceder a la aplicación.

## 📁 Estructura del Proyecto

```
bitacora-relacion/
│
├── bitacora-relacion-backend/      # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/       # Controladores de API
│   │   ├── Models/                 # Modelos Eloquent
│   │   ├── Services/               # Lógica de negocio
│   │   └── Policies/               # Autorización
│   ├── database/migrations/        # Migraciones de BD
│   ├── routes/api.php              # Rutas de API
│   └── config/cloudinary.php       # Configuración Cloudinary
│
├── nuestro-diario-ruta-frontend/   # Angular SPA
│   ├── src/app/
│   │   ├── core/                   # Servicios y Guards
│   │   ├── features/               # Módulos de características
│   │   └── shared/                 # Componentes compartidos
│   └── src/environments/           # Configuración de entornos
│
├── DEPLOYMENT.md                   # Guía de despliegue completa
├── CHECKLIST-DEPLOY.md             # Checklist de producción
└── setup-local.ps1                 # Script de setup automático
```

## 📸 Funcionalidades de Multimedia

### Subida de Archivos
- Imágenes: JPG, PNG, GIF, WebP
- Videos: MP4, WebM, MOV
- Tamaño máximo: 50MB por archivo
- Múltiples archivos por entrada

### Transformaciones Automáticas (Cloudinary)
- **Thumbnail**: 300x300px
- **Medium**: 800x600px
- **Large**: 1920x1080px
- Optimización automática de calidad
- Conversión automática a WebP (cuando es soportado)
- CDN global para carga rápida

## 🚀 Despliegue a Producción

### Preparación Rápida

Ejecuta el script de preparación:

```powershell
.\preparar-produccion.ps1
```

Este script verificará:
- ✅ Configuración de Cloudinary
- ✅ Conexión a base de datos
- ✅ Archivos críticos
- ✅ Configuración del frontend

### Guías de Despliegue

- **[PASOS-PRODUCCION.md](./PASOS-PRODUCCION.md)** - Guía paso a paso para subir a producción
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Documentación técnica completa
- **[CHECKLIST-DEPLOY.md](./CHECKLIST-DEPLOY.md)** - Checklist completo

### Resumen rápido:

1. Configurar servidor (Apache/Nginx + PHP + MySQL)
2. Configurar dominios y SSL
3. Actualizar `.env` con credenciales de producción
4. Ejecutar migraciones: `php artisan migrate --force`
5. Optimizar Laravel:
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
6. Build de Angular: `ng build --configuration production`
7. Subir archivos al servidor
8. Verificar con: `php artisan cloudinary:test`

## 🧪 Testing

### Backend

```bash
cd bitacora-relacion-backend

# Ejecutar todos los tests
php artisan test

# Test específico
php artisan test --filter=EntryTest
```

### Frontend

```bash
cd nuestro-diario-ruta-frontend

# Ejecutar tests
ng test

# Tests con cobertura
ng test --code-coverage
```

## 📊 Comandos Artisan Útiles

```bash
# Probar conexión con Cloudinary
php artisan cloudinary:test

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Ver rutas disponibles
php artisan route:list

# Crear nuevo usuario (seeders)
php artisan db:seed --class=UserSeeder
```

## 🔒 Seguridad

- ✅ Autenticación con Laravel Sanctum
- ✅ Políticas de autorización (Policies)
- ✅ Validación de requests
- ✅ CORS configurado
- ✅ Sanitización de inputs
- ✅ Protección CSRF
- ✅ Rate limiting en API
- ✅ Solo usuarios autorizados pueden registrarse

## 📝 API Endpoints

### Autenticación
- `POST /api/register` - Registro de usuario
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/user` - Usuario actual

### Entradas
- `GET /api/entries` - Listar entradas
- `POST /api/entries` - Crear entrada
- `GET /api/entries/{id}` - Ver entrada
- `PUT /api/entries/{id}` - Actualizar entrada
- `DELETE /api/entries/{id}` - Eliminar entrada
- `GET /api/entries/map` - Datos para mapa

### Media
- `POST /api/entries/{id}/media` - Subir archivos
- `DELETE /api/media/{id}` - Eliminar archivo
- `PUT /api/media/reorder` - Reordenar archivos

### Comentarios
- `GET /api/entries/{id}/comments` - Listar comentarios
- `POST /api/entries/{id}/comments` - Crear comentario
- `PUT /api/comments/{id}` - Actualizar comentario
- `DELETE /api/comments/{id}` - Eliminar comentario

## 🐛 Troubleshooting

### Error: "SQLSTATE[HY000] [2002]"
→ MySQL no está ejecutándose. Inicia MySQL primero.

### Error: "Cloudinary credentials not configured"
→ Configura las credenciales en `.env` y ejecuta `php artisan config:clear`

### Error: CORS
→ Verifica `FRONTEND_URL` y `SANCTUM_STATEFUL_DOMAINS` en `.env`

### Imágenes no se muestran
→ Ejecuta `php artisan cloudinary:test` para verificar la conexión

### Frontend no conecta con API
→ Verifica que `apiUrl` en `environment.ts` sea correcto

## 📞 Soporte y Recursos

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Laravel Docs**: https://laravel.com/docs
- **Angular Docs**: https://angular.dev
- **Leaflet Docs**: https://leafletjs.com

## 📄 Licencia

Este es un proyecto personal y privado.

## 👨‍💻 Desarrollo

Desarrollado con ❤️ para documentar nuestro viaje juntos.

---

**Última actualización:** Febrero 2026
