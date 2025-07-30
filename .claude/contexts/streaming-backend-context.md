# Contexto del Backend - Streaming App

> **Propósito**: Este contexto proporciona información esencial sobre la arquitectura, patrones y estructura del backend de la aplicación de streaming para Claude Code.
> 
> **Cuándo usar**: Trabajar con servicios backend, APIs, procesamiento de archivos, autenticación, base de datos, o cualquier funcionalidad del lado servidor.

## 🏗️ Arquitectura General

### Patrón de Diseño
- **Arquitectura**: MVC (Model-View-Controller) 
- **Stack tecnológico**: Node.js + Express.js + PostgreSQL + MinIO S3
- **Autenticación**: JWT + Passport.js + Sistema de roles
- **Almacenamiento**: MinIO S3-compatible 
- **Procesamiento multimedia**: FFmpeg pipeline de transcodificación

### Principios de Desarrollo
- **Separación de responsabilidades** (MVC)
- **Reutilización de código** (BaseService Pattern)
- **Validación robusta** (Joi Schemas)  
- **Seguridad primero** (JWT + CORS + validación de entrada)
- **Diseño sin estado** (escalabilidad horizontal)

## 📁 Estructura de Directorios

```
backend/app/
├── 📂 routes/           # 🌐 Controladores (Capa Routes/Controllers)
│   ├── index.js         # Router principal (/api/v1)  
│   ├── authRouter.js    # Endpoints de autenticación
│   ├── moviesRoutes.js  # CRUD de películas
│   ├── seriesRoutes.js  # CRUD de series
│   ├── episodesRouter.js # CRUD de episodios
│   ├── categoriesRoutes.js # CRUD de categorías
│   ├── usersRoutes.js   # CRUD de usuarios
│   └── userPreferencesRoutes.js # Preferencias de usuario
│
├── 📂 services/         # 🔧 Lógica de Negocio (Business Logic)
│   ├── BaseService.js   # Clase base con funcionalidades comunes ✅
│   ├── authService.js   # Autenticación y JWT
│   ├── moviesService.js # CRUD películas + transcodificación
│   ├── seriesService.js # CRUD de series
│   ├── EpisodesService.js # CRUD episodios (separado) ✅
│   ├── categoriesService.js # CRUD de categorías  
│   ├── usersService.js  # CRUD de usuarios
│   └── userPreferencesService.js # Preferencias + progreso
│
├── 📂 middleware/       # 🛡️ Middleware (Interceptors)
│   ├── authHandler.js   # JWT authentication + validación de roles
│   ├── validatorHandler.js # Validación de esquemas Joi
│   ├── errorHandler.js  # Manejo de errores + Boom errors
│   ├── upload.js        # Multer file upload  
│   └── completeInfoUser.js # Inyección de contexto de usuario
│
├── 📂 schemas/          # ✅ Validación de Datos (Data Validation)
│   ├── usersSchemas.js  # Esquemas de validación para usuarios
│   ├── moviesSchemas.js # Esquemas para películas
│   ├── seriesSchemas.js # Esquemas para series
│   ├── episodesSchema.js # Esquemas para episodios
│   ├── categoriesSchemas.js # Esquemas para categorías
│   └── userPreferencesSchemas.js # Esquemas para preferencias
│
├── 📂 utils/            # 🔨 Utilidades (organizadas funcionalmente)
│   ├── auth/            # Estrategias de autenticación
│   │   ├── index.js     # Configuración de estrategias Passport
│   │   └── strategies/  # JWT + Local strategies
│   ├── database/        # Helpers de base de datos
│   │   ├── configureAuditContext.js # Contexto de auditoría
│   │   └── updateAbtraction.js # Query builder para UPDATE
│   ├── errors/          # Sistema de errores centralizado ✅
│   │   └── ErrorFactory.js # Factory de errores estructurados
│   ├── logging/         # Sistema de logging ✅
│   │   └── Logger.js    # Logger estructurado por servicio
│   ├── media/           # Procesamiento de archivos multimedia
│   │   ├── config/      # Configuración de calidades
│   │   ├── image/       # Procesamiento de imágenes (Sharp)
│   │   └── video/       # Transcodificación (FFmpeg)
│   ├── responses/       # Helpers de respuestas HTTP
│   ├── storage/         # Integración con MinIO S3
│   │   ├── aws.js       # Cliente MinIO S3
│   │   ├── fileHelpers.js # Operaciones de archivos
│   │   └── getPresignedUrl.js # URLs firmadas
│   └── streaming/       # Funcionalidades de streaming
│       └── vod-unique-url.js # URLs únicas para VOD
│
├── 📂 config/           # ⚙️ Configuración
│   ├── config.js        # Variables de entorno centralizadas
│   └── swagger.js       # Configuración de documentación API
│
├── 📂 constants/        # 📋 Constantes
│   └── ErrorMessages.js # Mensajes de error centralizados
│
└── 📂 libs/             # 📚 Librerías Externas  
    └── postgresPool.js  # Pool de conexiones PostgreSQL
```

## 🔧 Services Layer - Arquitectura Refactorizada ✅

### BaseService Pattern

**Propósito**: Clase base que elimina código duplicado y proporciona funcionalidades comunes.

```javascript
class BaseService {
  constructor(serviceName) {
    this.pool = pool;
    this.serviceName = serviceName;
    this.logger = logger.child({ service: serviceName }); // Logger específico
  }

  // Métodos comunes heredados por todos los servicios
  async calculateFileHash(filePath)     // SHA256 de archivos
  async checkIfFileExistsInDatabase(hash) // Verificación de duplicados
  async withTransaction(callback, operation) // Wrapper de transacciones
  async executeQuery(query, params, operation) // Ejecución de queries con logging
  parseJsonSafely(jsonData, defaultValue) // Parseo JSON robusto
  handleDatabaseError(error, operation, context) // Manejo de errores de BD
  validateId(id, resourceType)         // Validación de IDs
  validateResourceExists(resource, type, id) // Validación de existencia
}
```

### Servicios Especializados

**Patrón común**: Todos los servicios extienden `BaseService`

```javascript
class MoviesService extends BaseService {
  constructor() {
    super('MoviesService'); // Heredar funcionalidades de BaseService
  }
  
  // CRUD Operations usando métodos heredados
  async create(data, progressCallback) {
    return await this.withTransaction(async (client) => {
      // Lógica de creación + transcodificación
    }, 'create_movie');
  }
  
  // Métodos específicos del servicio
  async findByFileHash(hash) { /* búsqueda por hash */ }
  async searchByYearRange(from, to) { /* búsqueda por años */ }
}
```

### Servicios Disponibles

| Servicio | Herencia | Responsabilidad | Funciones Clave |
|----------|----------|----------------|------------------|
| `BaseService` | N/A | Funcionalidades comunes | Hash, transacciones, JSON parsing, validaciones |
| `authService` | ✅ | Autenticación | `signToken`, `registerUser`, `sendRecoveryLink` |
| `moviesService` | ✅ | Películas | CRUD + transcodificación + búsquedas |
| `seriesService` | ✅ | Series | CRUD + gestión de temporadas |
| `EpisodesService` | ✅ | Episodios | CRUD + vinculación con series (separado) |
| `categoriesService` | ✅ | Categorías | CRUD simple |
| `usersService` | ✅ | Usuarios | CRUD + gestión de roles |
| `userPreferencesService` | ✅ | Preferencias | Configuración + progreso de visualización |

### Beneficios de la Refactorización ✅

- **Eliminación de código duplicado**: -442 líneas removidas
- **Sistema de errores centralizado**: ErrorFactory + Logger estructurado
- **Transacciones automáticas**: `withTransaction()` wrapper
- **Logging contextual**: Logger específico por servicio
- **Single Responsibility**: EpisodesService separado de SeriesService
- **Manejo consistente de errores**: Mapeo de errores PostgreSQL

## 🗃️ Database Layer

### Esquema de Base de Datos

**Tablas principales**:
- `users` - Usuarios del sistema (roles: admin, editor, user)
- `roles` - Roles y permisos  
- `categories` - Categorías de contenido
- `movies` - Películas (título, año, categoría, video_id)
- `series` - Series de TV (título, año, categoría)
- `episodes` - Episodios (serie_id, temporada, número, video_id)
- `videos` - Metadatos de archivos (hash, resoluciones, subtítulos)
- `user_preferences` - Preferencias del reproductor por usuario
- `audit_log` - Auditoría automática de todas las operaciones

### Características Especiales

**🔍 Búsquedas optimizadas**:
- Índices GIN para búsquedas full-text con pg_trgm
- Campos `title_normalized` para búsquedas case-insensitive
- Índices en foreign keys para JOINs rápidos

**📊 Sistema de auditoría**:
- Triggers automáticos en todas las operaciones CRUD
- Contexto de usuario e IP automático
- Campos: `created_at`, `updated_at`, `created_by`, `updated_by`, `ip_address`

**🔄 Integridad referencial**:
- Foreign keys con DELETE CASCADE/RESTRICT apropiados
- Constraints de unicidad para evitar duplicados
- Triggers para `updated_at` automático

## 🛡️ Middleware Stack

### Orden de Ejecución (por prioridad)

1. **Express Middleware Global**
   ```javascript
   app.use(express.json({ limit: '10gb' }))
   app.use(cookieParser())
   app.use(cors(corsOptions))
   ```

2. **Route-Specific Middleware** (en cada endpoint)
   ```javascript
   router.post('/path',
     authenticateJwt,          // 🔐 Validar JWT desde cookies
     checkRoles(['admin']),    // 👥 Validar roles de usuario
     multiUpload,              // 📁 Procesar archivos (Multer)
     completeInfoUser,         // 👤 Inyectar contexto de usuario
     validatorHandler(schema), // ✅ Validar esquema Joi
     async (req, res, next) => { /* handler */ }
   )
   ```

3. **Error Handling Middleware** (al final)
   ```javascript
   app.use(logErrors)         // 📝 Log de errores
   app.use(boomErrorHandler)  // 💥 Formatear errores Boom
   app.use(errorHandler)      // 🚨 Respuesta final de error
   ```

### AuthHandler - Sistema de Autenticación

**JWT + Cookies**:
```javascript
// Token structure
{
  "sub": 1,           // User ID
  "role": "admin",    // User role  
  "iat": 1641234567,  // Issued at
  "exp": 1641320967   // Expires at (24h)
}

// Cookie configuration
{
  httpOnly: true,     // No accesible via JavaScript
  secure: false,      // true en producción (HTTPS only)
  sameSite: 'lax',    // Protección CSRF
  maxAge: 86400000    // 24 horas
}
```

**Funciones de autenticación**:
- `authenticateJwt` - Validar token JWT desde cookies 'access_token'
- `checkRoles(roles)` - Verificar permisos por rol
- `checkApiKey` - Validar API key (opcional)

## ✅ Validation Layer

### Joi Schemas

**Estructura**: Un archivo de esquemas por entidad (`moviesSchemas.js`, `seriesSchemas.js`, etc.)

**Validaciones comunes**:
```javascript
const commonValidations = {
  id: Joi.number().integer().positive(),
  title: Joi.string().required(),
  categoryId: Joi.number().integer().positive().required(),
  releaseYear: Joi.number().integer().min(1900).max(currentYear),
  description: Joi.string().allow(''),
  coverImage: Joi.string().optional(), // Archivo subido
  coverImageUrl: Joi.string().uri().optional() // URL externa (TMDB)
}
```

**Validaciones personalizadas**:
- `coverImageRequired` - Al menos coverImage O coverImageUrl debe estar presente
- `fileHash` - SHA256 de 64 caracteres hexadecimales
- `temporaryFiles` - Campo isTemporaryCoverImage para archivos temporales

### ValidatorHandler Middleware

```javascript
function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property] // 'body', 'params', 'query'
    const { error } = schema.validate(data, { abortEarly: false })
    
    if (error) {
      next(boom.badRequest(error.details))
    } else {
      next()
    }
  }
}
```

## 📁 File Processing Architecture

### Pipeline de Procesamiento de Archivos

```
File Upload → File Validation → Calculate SHA256 → Check Duplicate → 
Store in MinIO → FFmpeg Transcoding → Save to Database → Complete
```

### Componentes de Procesamiento

**🎬 Video Processing** (`/utils/media/video/`):
- `mp4-transcoder.js` - Pipeline completo de transcodificación con FFmpeg
- `videoValidator.js` - Validación de formatos y metadatos
- `transcodeSettings.js` - Configuraciones de calidad (480p, 720p, 1080p, 4K)
- `subtitleProcessor.js` - Extracción y procesamiento de subtítulos
- `ffmpegOptions.js` - Opciones específicas de FFmpeg

**🖼️ Image Processing** (`/utils/media/image/`):
- `imageProcessor.js` - Redimensionado y optimización con Sharp
- `imageDownloader.js` - Descarga de portadas desde TMDB

**☁️ Storage Integration** (`/utils/storage/`):
- `aws.js` - Cliente MinIO S3 y operaciones CRUD
- `fileHelpers.js` - Utilidades de archivos y directorios temporales
- `getPresignedUrl.js` - URLs firmadas para streaming seguro

### Configuración de Calidades

```javascript
// Perfiles de calidad configurables en configMediaQualities.js
const qualityProfiles = {
  'basic': ['480p'],
  'standard': ['480p', '720p'], 
  'premium': ['480p', '720p', '1080p'],
  'ultra': ['480p', '720p', '1080p', '4k']
}
```

### Detección de Duplicados

```javascript
// Sistema de hash SHA256 para evitar duplicados
const fileHash = await this.calculateFileHash(filePath);
const exists = await this.checkIfFileExistsInDatabase(fileHash);
if (exists) {
  throw ErrorFactory.conflict('FILE_ALREADY_EXISTS', { hash: fileHash });
}
```

## 🌐 API Routes Structure

### Base URL: `/api/v1`

**Endpoints principales**:
```javascript
// Autenticación
POST /auth/login     // Login con usuario/contraseña
POST /auth/logout    // Logout y limpieza de cookies
POST /auth/recovery  // Envío de email de recuperación
POST /auth/reset     // Reset de contraseña con token

// Contenido  
GET    /movies       // Listar películas con paginación
POST   /movies       // Crear película + transcodificación
GET    /movies/:id   // Obtener película por ID
PUT    /movies/:id   // Actualizar película
DELETE /movies/:id   // Eliminar película + archivos

GET    /series       // Listar series
POST   /series       // Crear serie
GET    /series/:id   // Obtener serie + episodios

GET    /episodes     // Listar episodios por serie
POST   /episodes     // Crear episodio + transcodificación
GET    /episodes/:id // Obtener episodio
PUT    /episodes/:id // Actualizar episodio  
DELETE /episodes/:id // Eliminar episodio + archivos

// Administración
GET    /users        // Listar usuarios (admin only)
POST   /users        // Crear usuario (admin only) 
GET    /category     // Listar categorías
POST   /category     // Crear categoría (admin only)

// Preferencias
GET    /user-preferences/:userId // Obtener preferencias
PUT    /user-preferences/:userId // Actualizar preferencias
GET    /user-progress/:userId/:videoId // Obtener progreso
PUT    /user-progress/:userId/:videoId // Actualizar progreso
```

### Formato de Respuestas

```javascript
// Respuesta exitosa
{
  "success": true,
  "data": {
    // Datos del recurso
  }
}

// Respuesta de error (Boom.js)
{
  "statusCode": 400,
  "error": "Bad Request", 
  "message": "Descripción específica del error"
}

// Respuesta de procesamiento asíncrono
{
  "success": true,
  "taskId": "task_123456",
  "message": "Procesamiento iniciado"
}
```

## 🔐 Security Architecture

### CORS Configuration

```javascript
const corsOptions = {
  origin: (origin, callback) => {
    const whiteList = [
      'http://localhost:3000',    // Frontend dev
      'https://yourdomain.com'    // Production domain
    ];
    
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: origen no permitido'));
    }
  },
  credentials: true  // Permitir cookies
}
```

### File Upload Security

```javascript
const fileFilter = (req, file, cb) => {
  // Solo archivos de video para campo 'video'
  if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo archivos de video permitidos'));
    }
  }
  // Solo archivos de imagen para campo 'coverImage'
  else if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo archivos de imagen permitidos'));
    }
  }
}
```

## ⚙️ Configuration & Environment

### Variables de Entorno Requeridas

```bash
# Base de Datos
DB_USER=streamingapp
DB_PASSWORD=securepassword
DB_HOST=postgres
DB_PORT=5432
DB_NAME=streamingApp

# JWT Security
JWT_SECRET=your-super-secret-jwt-key

# MinIO Storage
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_BUCKET=streaming-content
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin123
S3_BUCKET_NAME=media

# API Configuration
BACK_PORT=3001
WHITE_LIST=http://localhost:3000,https://yourdomain.com

# Entornos
NODE_ENV=development|production
```

### Docker Services

```yaml
services:
  backend:
    build: ./backend/app
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - minio
  
  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./servers/postgresQl/init.sql:/docker-entrypoint-initdb.d/
  
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
```

## 🚀 Performance & Scalability

### Database Optimizations

**Connection Pooling**:
```javascript
const pool = new Pool({
  user: config.dbUser,
  password: config.dbPassword,
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  max: 20,           // Conexiones máximas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

**Query Optimizations**:
- Prepared statements para consultas frecuentes
- Índices en columnas de búsqueda y foreign keys
- LIMIT y OFFSET para paginación eficiente
- Campos calculados (`title_normalized`) para búsquedas rápidas

### Asynchronous Processing

```javascript
// Tasks con tracking para operaciones largas
const taskId = generateTaskId();
const progressMap = new Map();

// Procesamiento con callback de progreso
await moviesService.create(movieData, (progress) => {
  progressMap.set(taskId, progress);
  // Enviar update via WebSocket (futuro)
});
```

## 📊 Monitoring & Logging

### Error Tracking

```javascript
// Logger estructurado por servicio (BaseService)
const logErrors = (err, req, res, next) => {
  this.logger.error('Error en request', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    user: req.user?.sub || 'Anonymous',
    error: err.message,
    stack: err.stack
  });
  next(err);
}
```

### Audit Trail

- Todas las operaciones CRUD registradas en `audit_log`
- Contexto de usuario automático mediante `configureAuditContext`
- IP address tracking
- Timestamps precisos con zona horaria

## 🔄 Integration Points

### Frontend Integration

**API Consumption**:
- Axios interceptors para token refresh automático
- Error handling centralizado con boom.js
- File upload con progress tracking
- WebSocket para notificaciones real-time (futuro)

### Third-party Services

**TMDB Integration**:
- Metadata fetching automático para películas/series
- Descarga de poster/backdrop con `imageDownloader.js`
- Enriquecimiento de información de lanzamiento

**Email Service**:
- Password recovery emails
- Notificaciones de usuario
- Alertas de administrador

## 🛠️ Patrones de Desarrollo Comunes

### Service Creation Pattern

```javascript
// Instanciación de servicios
const MoviesService = require('./MoviesService');
const moviesService = new MoviesService();
```

### Service Inheritance Pattern ✅

```javascript
// Todos los servicios extienden BaseService
class NewService extends BaseService {
  constructor() {
    super('NewService'); // Logger contextual automático
  }
  
  async create(data) {
    return await this.withTransaction(async (client) => {
      // Lógica de creación con transacción automática
    }, 'create_resource');
  }
}
```

### Error Handling Pattern

```javascript
// Usando ErrorFactory para errores consistentes
throw ErrorFactory.notFound('MOVIE', movieId);
throw ErrorFactory.badRequest('INVALID_DATA', { field: 'title' });
throw ErrorFactory.conflict('DUPLICATE_FILE', { hash: fileHash });
```

### Authentication Pattern

```javascript
// En rutas protegidas
router.post('/protected-route',
  authenticateJwt,          // Validar JWT
  checkRoles(['admin']),    // Verificar rol
  validatorHandler(schema), // Validar datos
  async (req, res, next) => {
    // req.user disponible con datos del token
  }
);
```

### Transaction Pattern ✅

```javascript
// Nuevo patrón con BaseService
async methodWithTransaction(data) {
  const result = await this.withTransaction(async (client) => {
    // Todas las operaciones de BD aquí
    // BEGIN/COMMIT/ROLLBACK automático
    return result;
  }, 'operation_name');
  
  return result;
}
```

### JSON Parsing Pattern ✅

```javascript
// Parsing seguro con BaseService
const episodes = result.rows.map(episode => ({
  ...episode,
  available_resolutions: this.parseJsonSafely(episode.available_resolutions, []),
  available_subtitles: this.parseJsonSafely(episode.available_subtitles, [])
}));
```

## 📈 Code Quality Metrics

### Refactorización Completada ✅ (Diciembre 2024)

**Mejoras implementadas**:
- **Eliminación de código duplicado**: -442 líneas removidas
- **BaseService creado**: Sistema de herencia para funcionalidades comunes
- **EpisodesService separado**: Single Responsibility Principle aplicado
- **Sistema de errores centralizado**: ErrorFactory + Logger estructurado
- **Transacciones refactorizadas**: `withTransaction()` wrapper automático
- **JSON parsing robusto**: `parseJsonSafely()` para manejo de errores

**Métricas del proyecto**:
- **Archivos refactorizados**: 4 servicios principales
- **Servicios creados**: BaseService + EpisodesService
- **Métodos mejorados**: 14 métodos con nuevos patrones
- **Duplicaciones eliminadas**: 100%
- **Errores de linting**: 0
- **Principios aplicados**: DRY, Single Responsibility, Inheritance

## 🎯 Best Practices

### Al trabajar con este backend:

1. **SIEMPRE** extender `BaseService` para nuevos servicios
2. **USAR** `withTransaction()` para operaciones de BD complejas
3. **APLICAR** `ErrorFactory` para errores consistentes  
4. **VALIDAR** con esquemas Joi en todas las rutas
5. **AUTENTICAR** con JWT + roles apropiados
6. **CONFIGURAR** audit context con `configureAuditContext`
7. **PROCESAR** archivos de forma asíncrona con progress tracking
8. **LOGGING** contextual usando `this.logger` del servicio

### Comandos importantes:

```bash
# Desarrollo con hot reload
npm run dev

# Linting OBLIGATORIO antes de commits  
npm run lint
npm run lint:fix

# Producción
npm run start

# Base de datos (usar pg-kik)
pg-kik query "SELECT * FROM movies LIMIT 5"
pg-kik tables
pg-kik describe users
```

---

**🔄 Estado**: Arquitectura refactorizada y documentada ✅  
**📝 Última actualización**: Enero 2025  
**👥 Mantenido por**: Equipo de Desarrollo

Este contexto debe mantenerse actualizado con cada cambio significativo en la arquitectura del backend.