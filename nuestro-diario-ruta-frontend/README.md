# 🌹 Nuestro Diario de Ruta - Frontend Angular

Frontend desarrollado con Angular 18+ para la plataforma privada "Nuestro Diario de Ruta".

## ✨ Características

- 🎨 **Diseño romántico** con Tailwind CSS
- 📱 **Mobile-first** - Optimizado para smartphones
- 🔐 **Autenticación** con Laravel Sanctum
- 🗺️ **Mapa interactivo** con Leaflet
- 🖼️ **Galería multimedia** con fotos y videos
- 💭 **Modo nostalgia** - Filtra entradas de "hace un año"
- 🎵 **Reproductor de audio** para música de fondo
- 🚚 **Animación de carga** con el doble remolque

## 🚀 Instalación

### Requisitos

- Node.js 18+
- npm o yarn

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo con proxy
ng serve

# 3. Abrir en navegador
# http://localhost:4200
```

**Nota**: No es necesario editar el archivo `environment.ts` si usas la configuración por defecto. El proxy ya está configurado en `angular.json` y `proxy.conf.json`.

### Configuración del entorno

**Importante**: Este proyecto usa un **proxy de Angular** para comunicarse con el backend Laravel y evitar problemas de CORS y cookies cross-origin.

Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: '/api', // Ruta relativa - el proxy redirige a localhost:8000
};
```

### Configuración del proxy

El archivo `proxy.conf.json` ya está configurado:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": false,
    "logLevel": "debug"
  },
  "/sanctum": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": false,
    "logLevel": "debug"
  }
}
```

### ⚠️ Importante: Autenticación con Sanctum

Este proyecto usa **Laravel Sanctum en modo SPA (stateful)** con cookies de sesión.

**Configuración aplicada:**

1. **Proxy de Angular**: Todas las peticiones `/api` y `/sanctum` se envían a `localhost:8000`
2. **withCredentials**: Las cookies se envían automáticamente con cada petición
3. **CSRF Token**: Se obtiene automáticamente de `/sanctum/csrf-cookie` antes de login
4. **Interceptor personalizado**: Maneja cookies y tokens CSRF en `app.config.ts`

**Flujo de autenticación:**
1. GET `/sanctum/csrf-cookie` - Obtiene cookie XSRF-TOKEN
2. POST `/api/login` - Login con credenciales (envía XSRF token como header)
3. Las siguientes peticiones incluyen cookies de sesión automáticamente

**Archivos clave:**
- `src/app/app.config.ts` - Interceptor HTTP con manejo de CSRF
- `src/app/core/services/auth.service.ts` - Servicio de autenticación
- `proxy.conf.json` - Configuración del proxy
- `angular.json` - Referencia al proxy en serve options

### Iniciar servidor de desarrollo

```bash
# El proxy está configurado en angular.json
ng serve

# El servidor inicia en http://localhost:4200
# Las peticiones a /api se envían a http://localhost:8000/api
# Las peticiones a /sanctum se envían a http://localhost:8000/sanctum
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios, guards, interceptors
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── entry.service.ts
│   │   │   ├── media.service.ts
│   │   │   ├── comment.service.ts
│   │   │   ├── map.service.ts
│   │   │   ├── loading.service.ts
│   │   │   └── audio.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── public.guard.ts
│   │   └── interceptors/
│   │       ├── auth.interceptor.ts
│   │       └── loading.interceptor.ts
│   ├── shared/                  # Componentes compartidos, pipes, models
│   │   ├── components/
│   │   │   ├── loading-animation/
│   │   │   └── audio-player/
│   │   ├── pipes/
│   │   │   ├── nostalgia.pipe.ts
│   │   │   └── date-format.pipe.ts
│   │   └── models/
│   │       ├── user.model.ts
│   │       ├── entry.model.ts
│   │       ├── media.model.ts
│   │       ├── comment.model.ts
│   │       └── map.model.ts
│   ├── features/                # Vistas principales
│   │   ├── auth/
│   │   │   └── login/
│   │   ├── timeline/
│   │   ├── entry-detail/
│   │   ├── entry-editor/
│   │   └── map/
│   ├── app.component.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.module.ts
├── assets/
├── environments/
└── styles/
```

## 🛣️ Rutas

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/login` | Iniciar sesión | No |
| `/timeline` | Feed principal | Sí |
| `/entry/new` | Crear entrada | Sí |
| `/entry/:id` | Ver entrada | Sí |
| `/entry/:id/edit` | Editar entrada | Sí |
| `/map` | Mapa de aventuras | Sí |

## 🎨 Paleta de Colores

- **Romantic**: Rosa para los toques de amor
- **Road**: Azul para la carretera
- **Sunset**: Naranja para los atardeceres

## 📱 Responsive

El diseño es mobile-first:
- **Móvil**: < 640px - Una columna, botones grandes
- **Tablet**: 640px - 1024px - Dos columnas
- **Desktop**: > 1024px - Layout completo

## 🎵 Reproductor de Audio

Para agregar música de Keane:

1. Coloca tu archivo MP3 en `src/assets/audio/`
2. En `app.component.ts`, descomenta:

```typescript
this.audioService.loadTrack('/assets/audio/tu-cancion.mp3', 'Keane - Título');
```

## 🗺️ Mapa con Leaflet

El mapa muestra todos los lugares donde han tenido citas. Los marcadores están personalizados con emojis según la categoría.

## 🔧 Comandos Útiles

```bash
# Servidor de desarrollo
ng serve

# Build para producción
ng build --configuration production

# Tests
ng test

# Lint
ng lint
```

## 📦 Dependencias Principales

- `@angular/core` - Framework Angular 18
- `tailwindcss` - Framework CSS
- `leaflet` - Mapas interactivos
- `rxjs` - Programación reactiva

## 🔗 Conexión con Backend

Este frontend se conecta con el backend Laravel. Asegúrate de:

1. Tener el backend corriendo en `http://localhost:8000`
2. Configurar CORS en el backend
3. Configurar la URL correcta en `environment.ts`

---

💕 Creado con amor para "Nuestro Diario de Ruta"
