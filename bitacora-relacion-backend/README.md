# 🌹 Nuestro Diario de Ruta - Backend API

Backend API desarrollado con Laravel 11 para la plataforma privada "Nuestro Diario de Ruta" - un diario digital para parejas.

## 📋 Características

- ✅ **Autenticación** con Laravel Sanctum
- ✅ **CRUD completo** de entradas (carta, cita, agradecimiento, aniversario, otro)
- ✅ **Estados**: Borrador (solo autor) / Publicado (ambos)
- ✅ **Multimedia**: Imágenes y videos hasta 50MB
- ✅ **Galería**: Orden personalizable con descripciones
- ✅ **Mapa**: Coordenadas lat/lng con nombres de lugares
- ✅ **Comentarios**: Solo en entradas publicadas
- ✅ **Filtros**: Por categoría, rango de fechas, estado
- ✅ **CORS** configurado para frontend Angular

## 🚀 Instalación

### Requisitos

- PHP 8.2+
- Composer
- MySQL/MariaDB
- Node.js (opcional, para desarrollo)

### Pasos

```bash

# 2. Instalar dependencias
composer install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Generar clave de aplicación
php artisan key:generate

# 5. Crear enlace simbólico para storage
php artisan storage:link

# 6. Ejecutar migraciones y seeders
php artisan migrate:fresh --seed

# 7. Iniciar servidor
php artisan serve
```

### Configuración del archivo .env

```env
# Base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bitacora_relacion
DB_USERNAME=root
DB_PASSWORD=

# Sesiones (requerido para Sanctum stateful)
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=
SESSION_SAME_SITE=lax

# Sanctum - Dominios stateful
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:4200,localhost:5173,127.0.0.1,127.0.0.1:8000

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:4200

# Emails de los dos usuarios permitidos
PARTNER1_EMAIL=tu@email.com
PARTNER2_EMAIL=el@email.com

# Tamaño máximo de subida en KB (50MB)
MAX_UPLOAD_SIZE=51200
```

### ⚠️ Importante: Configuración de Sanctum SPA

Este proyecto usa **Laravel Sanctum en modo SPA (stateful)** con autenticación basada en cookies de sesión, NO tokens Bearer.

**Configuración aplicada:**

1. **Tabla sessions creada**: La migración `create_sessions_table` debe ejecutarse
2. **Cookie XSRF-TOKEN sin encriptar**: Configurado en `bootstrap/app.php`
3. **CSRF excluido en rutas API**: Las rutas `/api/*` están excluidas de validación CSRF porque Sanctum maneja su propia autenticación
4. **CORS configurado**: En `config/cors.php` con `supports_credentials: true`
5. **Middleware Sanctum**: `EnsureFrontendRequestsAreStateful` configurado para rutas API

**Archivos clave modificados:**
- `bootstrap/app.php` - Configuración de middleware
- `app/Http/Middleware/EncryptCookies.php` - Excepción para XSRF-TOKEN
- `app/Http/Requests/Auth/LoginRequest.php` - Usa `attempt()` en lugar de `validate()`
- `app/Http/Controllers/Api/AuthController.php` - Login y logout con sesiones

```bash
# Limpiar caché después de cambios
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## 📡 Endpoints API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/login` | Iniciar sesión |
| `POST` | `/api/logout` | Cerrar sesión |
| `GET` | `/api/me` | Usuario autenticado |

### Entradas (Momentos/Cartas)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/entries` | Listar entradas (timeline) |
| `POST` | `/api/entries` | Crear entrada |
| `GET` | `/api/entries/{id}` | Ver entrada detalle |
| `PUT` | `/api/entries/{id}` | Actualizar entrada |
| `DELETE` | `/api/entries/{id}` | Eliminar entrada |
| `POST` | `/api/entries/{id}/publish` | Publicar borrador |
| `GET` | `/api/entries/categories` | Categorías disponibles |

### Multimedia (Galería)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/entries/{id}/media` | Subir archivos |
| `PUT` | `/api/media/{id}/description` | Actualizar descripción |
| `POST` | `/api/entries/{id}/media/reorder` | Reordenar fotos |
| `DELETE` | `/api/media/{id}` | Eliminar archivo |

### Comentarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/entries/{id}/comments` | Ver comentarios |
| `POST` | `/api/entries/{id}/comments` | Agregar comentario |
| `DELETE` | `/api/comments/{id}` | Eliminar comentario |

### Mapa

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/map/markers` | Todos los marcadores |
| `GET` | `/api/map/stats` | Estadísticas del mapa |

## 🔐 Sistema de Autorización

| Acción | Regla |
|--------|-------|
| Ver entrada publicada | ✅ Ambos usuarios |
| Ver borrador | ✅ Solo el autor |
| Editar/eliminar | ✅ Solo el autor |
| Comentar | ✅ Solo el otro usuario |
| Acceso plataforma | ✅ Solo 2 emails configurados |

## 📁 Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/Api/    # Controladores API
│   ├── Requests/           # Validación de datos
│   └── Resources/          # Transformación JSON
├── Models/                 # Eloquent Models
├── Policies/               # Autorización
└── Services/               # Lógica de negocio

database/
├── migrations/             # Migraciones
├── factories/              # Factories para tests
└── seeders/                # Seeders

routes/
└── api.php                 # Rutas API
```

## 🧪 Tests

```bash
# Ejecutar todos los tests
php artisan test

# Ejecutar tests específicos
php artisan test --filter=EntryTest
```

## 🛠️ Comandos Útiles

```bash
# Limpiar cachés
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Optimizar para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ver rutas disponibles
php artisan route:list

# Tinker (consola interactiva)
php artisan tinker
```

## 📦 Dependencias Principales

- `laravel/framework` - Framework Laravel 11
- `laravel/sanctum` - Autenticación API
- `intervention/image-laravel` - Procesamiento de imágenes

## 📄 Licencia

Proyecto privado - Uso exclusivo para la pareja.

---

💕 Creado con amor para "Nuestro Diario de Ruta"
