# Guía de Despliegue a Producción - Nuestro Diario de Ruta

## ✅ Cambios Realizados

### 1. Instalación de Cloudinary SDK
- ✅ Instalado `cloudinary/cloudinary_php` v3.1.2
- ✅ Instalado `cloudinary/transformation-builder-sdk` v2.1.3

### 2. Configuración
- ✅ Agregadas variables de entorno en `.env`
- ✅ Creado archivo de configuración `config/cloudinary.php`

### 3. Actualización de MediaService
- ✅ Integración completa con Cloudinary
- ✅ Subida de imágenes y videos a Cloudinary
- ✅ Eliminación de archivos desde Cloudinary
- ✅ Generación de thumbnails y transformaciones dinámicas

### 4. Base de Datos
- ✅ Creada migración para agregar columna `file_url`
- ✅ Actualizado modelo `Media` para soportar Cloudinary

## 📋 Pasos Pendientes

### 1. Configurar Credenciales de Cloudinary

Edita el archivo `.env` y reemplaza los valores:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name_real
CLOUDINARY_API_KEY=tu_api_key_real
CLOUDINARY_API_SECRET=tu_api_secret_real
CLOUDINARY_URL=cloudinary://tu_api_key:tu_api_secret@tu_cloud_name
```

**Dónde encontrar tus credenciales:**
1. Ve a [Cloudinary Dashboard](https://cloudinary.com/console)
2. En la página principal verás:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Ejecutar Migración

```bash
cd bitacora-relacion-backend
php artisan migrate
```

### 3. Verificar Conexión con Cloudinary

Ejecuta el comando de testing para verificar que las credenciales están configuradas correctamente:

```bash
php artisan cloudinary:test
```

Este comando:
- ✅ Verifica que las credenciales estén configuradas
- ✅ Prueba la conexión con Cloudinary
- ✅ Muestra el uso actual de tu cuenta (storage, bandwidth, transformaciones)

Si ves "✅ Successfully connected to Cloudinary!" estás listo para continuar.

### 3. Configurar Cloudinary (Opcional)

En tu dashboard de Cloudinary:
- **Upload Presets:** Configurar presets para optimizar subidas
- **Transformations:** Definir transformaciones predeterminadas
- **Media Library:** Organizar carpetas

### 4. Preparar para Producción

#### Backend (Laravel):

1. **Actualizar variables de entorno:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio-backend.com

# Base de datos de producción
DB_HOST=tu_host_produccion
DB_DATABASE=tu_database_produccion
DB_USERNAME=tu_usuario_produccion
DB_PASSWORD=tu_password_seguro

# URL del frontend en producción
FRONTEND_URL=https://tu-dominio-frontend.com
SANCTUM_STATEFUL_DOMAINS=tu-dominio-frontend.com
```

2. **Optimizaciones:**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer install --optimize-autoloader --no-dev
```

3. **Permisos de carpetas:**
```bash
chmod -R 775 storage bootstrap/cache
```

#### Frontend (Angular):

1. **Actualizar environment.prod.ts:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-dominio-backend.com/api'
};
```

2. **Build de producción:**
```bash
cd nuestro-diario-ruta-frontend
ng build --configuration production
```

## 🔄 Migración de Imágenes Existentes (Si aplica)

Si ya tienes imágenes en almacenamiento local, necesitarás migrarlas a Cloudinary:

1. Crear un comando Artisan para migración
2. Subir cada imagen existente a Cloudinary
3. Actualizar registros en la base de datos

## 🧪 Pruebas

### Probar subida de imágenes:
1. Inicia el backend: `php artisan serve`
2. Inicia el frontend: `ng serve`
3. Crea una nueva entrada con imágenes
4. Verifica en Cloudinary Dashboard que las imágenes se subieron
5. Verifica que las imágenes se muestren correctamente en el frontend

### Probar eliminación:
1. Elimina una entrada con imágenes
2. Verifica en Cloudinary que las imágenes fueron eliminadas

## 📝 Características de Cloudinary Implementadas

### Transformaciones Dinámicas
El servicio incluye transformaciones predefinidas:
- **Thumbnail:** 300x300px
- **Medium:** 800x600px
- **Large:** 1920x1080px

Todas con:
- Calidad automática
- Formato automático (WebP cuando sea soportado)
- Optimización automática

### Organización
Las imágenes se organizan en Cloudinary como:
```
nuestro-diario/
  └── entries/
      ├── 1/
      │   ├── imagen1.jpg
      │   └── imagen2.jpg
      └── 2/
          └── video1.mp4
```

## 🚀 Recomendaciones de Producción

1. **SSL/HTTPS:** Asegúrate de usar HTTPS en producción
2. **CORS:** Verificar configuración de CORS en `config/cors.php`
3. **Rate Limiting:** Configurar límites de subida en producción
4. **Monitoreo:** Monitorear uso de Cloudinary en el dashboard
5. **Backup:** Cloudinary guarda los archivos, pero mantén backups de la BD
6. **CDN:** Cloudinary proporciona CDN automáticamente

## 📊 Límites de Cloudinary (Plan Free)

- **Almacenamiento:** 25 GB
- **Bandwidth:** 25 GB/mes
- **Transformaciones:** 25,000/mes
- **Créditos:** 1,000/mes

Monitorea tu uso en: https://cloudinary.com/console/usage

## ⚠️ Notas Importantes

1. **Retrocompatibilidad:** El código mantiene compatibilidad con archivos locales antiguos
2. **Eliminación:** Al eliminar una entrada, las imágenes se eliminan automáticamente de Cloudinary
3. **file_path:** Ahora almacena el `public_id` de Cloudinary
4. **file_url:** Almacena la URL completa de Cloudinary (con CDN)

## 🔧 Troubleshooting

### Error: "Invalid credentials"
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que no haya espacios extra
- Reinicia el servidor después de cambiar `.env`

### Error: "Upload failed"
- Verifica tu plan de Cloudinary (límites)
- Revisa los logs: `storage/logs/laravel.log`
- Verifica permisos de archivo

### Imágenes no se muestran
- Verifica CORS en Cloudinary Dashboard
- Verifica que `file_url` se esté guardando correctamente
- Revisa la consola del navegador para errores

## 📞 Soporte

- Documentación Cloudinary: https://cloudinary.com/documentation/php_integration
- Documentación Laravel: https://laravel.com/docs
