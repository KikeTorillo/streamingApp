# Contexto de Base de Datos - Streaming App

> 📋 **Propósito**: Este documento proporciona un contexto completo de la estructura de la base de datos para evitar errores al realizar consultas y mantener consistencia en el desarrollo.

## 🗄️ Tablas Principales y Estructura

### 👥 **users** - Usuarios del sistema
```sql
id (integer, PK, autoincrement)     -- ID único del usuario
user_name (varchar(255), UNIQUE)    -- Nombre de usuario (NO se puede editar)
email (varchar(255), nullable)      -- Email del usuario
password (varchar(255))             -- Contraseña encriptada
role_id (integer, FK → roles.id)    -- Rol del usuario
recovery_token (varchar, nullable)  -- Token para recuperación de contraseña
created_at (timestamptz, DEFAULT NOW)
updated_at (timestamptz, DEFAULT NOW)

-- IMPORTANTE: user_name NO se puede modificar por reglas de negocio
```

### 🎬 **movies** - Películas
```sql
id (integer, PK, autoincrement)     -- ID único de la película
cover_image (varchar(64))           -- Hash de imagen de portada
title (varchar(255))                -- Título de la película
title_normalized (varchar(255))     -- Título normalizado para búsquedas
description (text, nullable)        -- Descripción de la película
category_id (integer, FK → categories.id) -- Categoría
video_id (integer, FK → videos.id)  -- Video asociado
release_year (integer)              -- Año de lanzamiento
created_at (timestamptz, DEFAULT NOW)
updated_at (timestamptz, DEFAULT NOW)
```

### 📺 **series** - Series de TV
```sql
id (integer, PK, autoincrement)     -- ID único de la serie
cover_image (varchar(64))           -- Hash de imagen de portada
title (varchar(255))                -- Título de la serie
title_normalized (varchar(255))     -- Título normalizado para búsquedas
description (text, nullable)        -- Descripción de la serie
category_id (integer, FK → categories.id) -- Categoría
release_year (integer)              -- Año de lanzamiento
created_at (timestamptz, DEFAULT NOW)
updated_at (timestamptz, DEFAULT NOW)
```

### 📼 **episodes** - Episodios de series
```sql
id (integer, PK, autoincrement)     -- ID único del episodio
serie_id (integer, FK → series.id)  -- Serie a la que pertenece
season (integer)                    -- Número de temporada
episode_number (integer)            -- Número de episodio
title (varchar(255), nullable)      -- Título del episodio
title_normalized (varchar(255))     -- Título normalizado
description (text, nullable)        -- Descripción del episodio
video_id (integer, FK → videos.id)  -- Video asociado
created_at (timestamptz, DEFAULT NOW)
updated_at (timestamptz, DEFAULT NOW)
```

### 🎞️ **videos** - Información técnica de videos
```sql
id (integer, PK, autoincrement)     -- ID único del video
file_hash (varchar(64), UNIQUE)     -- Hash SHA256 del archivo
available_resolutions (jsonb)       -- Resoluciones disponibles
available_subtitles (jsonb)         -- Subtítulos disponibles
duration (interval, nullable)       -- Duración del video
views (bigint, DEFAULT 0)           -- Número de visualizaciones
created_at (timestamptz, DEFAULT NOW)
updated_at (timestamptz, DEFAULT NOW)
```

### 🏷️ **categories** - Categorías de contenido
```sql
id (integer, PK, autoincrement)     -- ID único de la categoría
name (varchar(100), UNIQUE)         -- Nombre de la categoría
updated_at (timestamptz, DEFAULT NOW)
```

### ⚙️ **user_preferences** - Preferencias del reproductor
```sql
id (integer, PK, autoincrement)     -- ID único
user_id (integer, FK → users.id)    -- Usuario propietario
volume (numeric, DEFAULT 1.0)       -- Volumen (0.0-1.0)
playback_rate (numeric, DEFAULT 1.0) -- Velocidad reproducción
autoplay (boolean, DEFAULT false)   -- Reproducción automática
muted (boolean, DEFAULT false)      -- Silenciado por defecto
default_quality (varchar(10), DEFAULT 'auto') -- Calidad preferida
preferred_language (varchar(5), DEFAULT 'es') -- Idioma preferido
subtitles_enabled (boolean, DEFAULT true)     -- Subtítulos habilitados
forced_subtitles_only (boolean, DEFAULT false) -- Solo subtítulos forzados
auto_fullscreen (boolean, DEFAULT false)      -- Pantalla completa auto
picture_in_picture_enabled (boolean, DEFAULT true) -- PiP habilitado
hotkey_enabled (boolean, DEFAULT true)        -- Teclas rápidas
watch_progress (jsonb, DEFAULT '{}')          -- Progreso de reproducción
created_at (timestamptz, DEFAULT NOW)
updated_at (timestamptz, DEFAULT NOW)
```

### 👤 **roles** - Roles de usuario
```sql
id (integer, PK, autoincrement)     -- ID único del rol
name (varchar)                      -- Nombre del rol (admin, user, etc.)
-- (Estructura completa pendiente de verificar)
```

### 📝 **audit_log** - Log de auditoría
```sql
-- (Estructura pendiente de verificar)
-- Tabla para registro de actividades y cambios
```

## 🔗 Relaciones Principales

### Relaciones FK (Foreign Keys)
```
users.role_id → roles.id
movies.category_id → categories.id
movies.video_id → videos.id
series.category_id → categories.id
episodes.serie_id → series.id
episodes.video_id → videos.id
user_preferences.user_id → users.id
```

### Relaciones de Contenido
```
movies ←→ videos (1:1) - Cada película tiene un video
series ←→ episodes (1:N) - Una serie tiene múltiples episodios
episodes ←→ videos (1:1) - Cada episodio tiene un video
categories ←→ movies (1:N) - Una categoría tiene múltiples películas
categories ←→ series (1:N) - Una categoría tiene múltiples series
users ←→ user_preferences (1:1) - Cada usuario tiene sus preferencias
```

## 📊 Estructura de Datos JSONB

### **videos.available_resolutions**
```json
{
  "480p": "/path/to/video_480p.m3u8",
  "720p": "/path/to/video_720p.m3u8",
  "1080p": "/path/to/video_1080p.m3u8"
}
```

### **videos.available_subtitles**
```json
{
  "es": "/path/to/subtitles_es.vtt",
  "en": "/path/to/subtitles_en.vtt"
}
```

### **user_preferences.watch_progress**
```json
{
  "movie_123": {
    "position": 1800,
    "type": "movie",
    "timestamp": 1640995200,
    "completed": false
  },
  "episode_456": {
    "position": 900,
    "type": "episode",
    "seriesId": "45",
    "seasonNumber": 1,
    "episodeNumber": 3,
    "timestamp": 1640995200,
    "completed": false
  }
}
```

## 🛡️ Convenciones de Nomenclatura

### **REGLA FUNDAMENTAL**
- **Base de Datos**: `snake_case` (user_name, category_id, created_at)
- **Frontend/Backend**: `camelCase` (userName, categoryId, createdAt)
- **Mapeo automático**: Los servicios convierten automáticamente entre ambos

### Ejemplos de Conversión
```javascript
// ✅ Frontend/Backend (camelCase)
{
  userName: "john_doe",
  categoryId: 5,
  releaseYear: 2023,
  createdAt: "2023-01-01T00:00:00Z"
}

// ✅ Base de Datos (snake_case)  
{
  user_name: "john_doe",
  category_id: 5,
  release_year: 2023,
  created_at: "2023-01-01T00:00:00Z"
}
```

## 🔍 Consultas Comunes con pg-kik

### Comandos Esenciales
```bash
# Listar todas las tablas
pg-kik tables

# Ver estructura de una tabla
pg-kik describe [tabla]

# Contar registros
pg-kik count [tabla]

# Consultas de datos
pg-kik query "SELECT * FROM movies LIMIT 5"
pg-kik query "SELECT m.title, c.name as category FROM movies m JOIN categories c ON m.category_id = c.id"
```

### Consultas Frecuentes
```bash
# Ver todas las películas con su categoría
pg-kik query "SELECT m.title, c.name as category, m.release_year FROM movies m JOIN categories c ON m.category_id = c.id ORDER BY m.created_at DESC"

# Ver series con conteo de episodios
pg-kik query "SELECT s.title, COUNT(e.id) as episode_count FROM series s LEFT JOIN episodes e ON s.id = e.serie_id GROUP BY s.id, s.title"

# Ver preferencias de usuario específico
pg-kik query "SELECT * FROM user_preferences WHERE user_id = 1"

# Ver progreso de reproducción de un usuario
pg-kik query "SELECT watch_progress FROM user_preferences WHERE user_id = 1"
```

## 🚨 Validaciones Importantes (Joi Schemas)

### **Campos Obligatorios por Tabla**
- **users**: userName, password, roleId
- **movies**: title, categoryId, releaseYear, description, video, (coverImage O coverImageUrl)
- **series**: title, categoryId, releaseYear  
- **episodes**: serieId, season, episodeNumber, videoId
- **categories**: name
- **user_preferences**: userId (otros tienen defaults)

### **Campos con Validaciones Especiales**
- **userName**: alfanumérico, 3-30 caracteres, NO editable
- **email**: formato email válido
- **password**: alfanumérico
- **releaseYear**: entre 1900 y año actual
- **playbackRate**: valores válidos [0.5, 1.0, 1.25, 1.5, 2.0]
- **defaultQuality**: valores válidos ['auto', '480p', '720p', '1080p', '4k']
- **preferredLanguage**: valores válidos ['es', 'en']

## 🎯 Tips para Evitar Errores

### ✅ **HACER**
- Usar `pg-kik` para todas las consultas de datos
- Respetar las FK y relaciones existentes
- Usar camelCase en frontend/backend, snake_case en consultas SQL
- Validar con los schemas Joi antes de insertar/actualizar
- Usar los campos obligatorios según el schema correspondiente

### ❌ **NO HACER**
- Intentar editar `user_name` (está prohibido por reglas de negocio)
- Insertar datos sin validar FK (causará errores de integridad)
- Mezclar convenciones de nomenclatura
- Ignorar los campos obligatorios definidos en schemas
- Realizar consultas SQL manuales (usar pg-kik)

## 🔧 Herramientas de Desarrollo

### **pg-kik** - Herramienta Principal
```bash
# Instalada globalmente, usar para TODAS las consultas
pg-kik query "TU_CONSULTA_AQUI"
pg-kik count tabla_name
pg-kik describe tabla_name
pg-kik tables
```

### **Schemas de Validación**
- Ubicación: `/backend/app/schemas/`
- Archivos: `usersSchemas.js`, `moviesSchemas.js`, `seriesSchemas.js`, etc.
- Uso: Validación automática en endpoints del API

---

> ⚡ **Nota**: Este contexto se actualiza conforme evoluciona la estructura de la base de datos. Siempre usar `pg-kik tables` y `pg-kik describe [tabla]` para verificar la estructura más reciente.