# 🎬 StreamingApp - Plataforma Integral de Streaming

Plataforma completa de streaming que combina un backend Node.js, frontend React+Vite, Storybook para componentes, y servicios de infraestructura orquestados con Docker Compose.

## 📋 Prerequisitos

### 🐳 **Opción 1: Docker (Recomendado)**
- **Docker**: 20.10+ 
- **Docker Compose**: 2.0+
- **Git**: Para clonar el repositorio
- **Navegador**: Chrome, Firefox, Safari, Edge

### 💻 **Opción 2: Desarrollo Local**
- **Node.js**: 18.x o superior
- **npm**: 8.x o superior
- **PostgreSQL**: 13+ (si no usas Docker)
- **Git**: Para clonar el repositorio

### 🔧 **Verificar Instalación**
```bash
# Verificar Docker
docker --version
docker-compose --version

# Verificar Node.js (solo para desarrollo local)
node --version
npm --version
```

## 🚀 Inicio Rápido

### 🎯 **Selecciona tu Entorno de Desarrollo**

El proyecto soporta **2 modos de desarrollo** principales:

#### 🏠 **Desarrollo Local**
```bash
# 1. Configurar variables según tu necesidad:
# Para localhost: cp .env.local.example .env
# Para red local: cp .env.host.example .env (editar IP)

# 2. Iniciar servicios
npm run dev:local
```
- **Localhost**: Solo accesible desde tu máquina local
- **Red local**: Accesible desde dispositivos en tu red (configurar IP en .env)
- **Ideal para**: Desarrollo, testing móvil, demos

#### 🚀 **Producción**
```bash
# 1. Configurar variables de entorno
cp .env.prod.example .env
# ⚠️ IMPORTANTE: Editar .env con valores de producción

# 2. Iniciar servicios
npm run prod
```
- **Acceso**: Configuración de producción
- **Ideal para**: Despliegue en servidor

### 📋 Configuración Inicial Rápida

#### 🎯 **Configuración Automática (Recomendado)**
```bash
# 1. Clonar el repositorio
git clone https://github.com/KikeTorillo/streamingApp.git
cd streamingApp

# 2. Mostrar opciones de configuración
npm run env:setup

# 3. Seleccionar y copiar el archivo de entorno apropiado
# Para localhost: cp .env.local.example .env
# Para red local: cp .env.host.example .env  
# Para producción: cp .env.prod.example .env

# 4. Editar variables requeridas en .env

# 5. Levantar la plataforma según tu entorno
npm run dev:local    # o prod
```

#### ⚙️ **Variables de Entorno Requeridas**
Después de copiar `.env.prod.example` a `.env`, **debes configurar**:

```bash
# 🔑 REQUERIDO: API key de TMDB (gratuita)
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# 🔐 RECOMENDADO: Cambiar JWT secret
JWT_SECRET=your_unique_jwt_secret_here

# 📧 OPCIONAL: Email para notificaciones
EMAIL=your_email@gmail.com
PASS_EMAIL=your_app_password
```

**➡️ Obtener API Key de TMDB:**
1. Ve a https://www.themoviedb.org/
2. Crea una cuenta gratuita
3. Ve a Configuración → API → Crear
4. Copia la API key a tu archivo `.env`

#### 🔧 **Configuración Manual**
```bash
# 1. Clonar repositorio
git clone https://github.com/KikeTorillo/streamingApp.git
cd streamingApp

# 2. Configurar variables de entorno
cp .env.prod.example .env
# Editar .env con tus valores

# 3. Instalar dependencias (opcional)
npm run install:all

# 4. Levantar servicios
npm run dev
```

## 🛠️ Scripts Principales Disponibles

### 🏠 **Desarrollo Local**
```bash
npm run dev:local         # Inicia toda la plataforma (localhost o red según .env)
npm run dev:local:up      # Solo levantar servicios (sin rebuild)
npm run dev:local:logs    # Ver logs de todos los servicios
npm run dev:local:status  # Estado de servicios
npm run dev:local:restart # Reiniciar servicios
npm run stop:local        # Detener servicios de desarrollo
```

### 🚀 **Producción**
```bash
npm run prod         # Inicia toda la plataforma en modo producción
npm run prod:up      # Solo levantar servicios (sin rebuild)
npm run prod:logs    # Ver logs de producción
npm run prod:status  # Estado de servicios de producción
npm run prod:restart # Reiniciar servicios de producción
npm run stop:prod    # Detener servicios de producción
```

### 📋 **Compatibilidad (Comando Legacy)**
```bash
npm run dev          # ⚠️ Muestra mensaje y redirige a dev:local
```

### 🔧 **Herramientas y Utilidades**
```bash
npm run build        # Compilar frontend para producción
npm run install:all  # Instalar dependencias en backend y frontend
npm run status       # Ver estado de contenedores Docker
npm run health       # Verificar salud de todos los servicios
npm run ports        # Mostrar puertos en uso
npm run env:setup    # Mostrar opciones de configuración de entorno
```

### 📊 **Monitoreo y Debug**
```bash
npm run logs:backend   # Ver logs del backend
npm run logs:frontend  # Ver logs del frontend  
npm run logs:storybook # Ver logs de Storybook
npm run logs:database  # Ver logs de PostgreSQL
npm run monitor        # Monitorear recursos de contenedores
npm run check:services # Verificar salud de servicios principales
```

### 🐚 **Acceso a Consolas**
```bash
npm run shell:backend  # Acceder al contenedor del backend
npm run shell:frontend # Acceder al contenedor del frontend
npm run shell:storybook # Acceder al contenedor de Storybook
npm run shell:db       # Acceder a PostgreSQL CLI
```

### 🧹 **Limpieza y Mantenimiento**
```bash
npm run clean      # Limpiar contenedores básico
npm run clean:full # Limpieza completa (imágenes, volúmenes, redes)
```

## 🌐 URLs de Acceso

### 🏠 **Desarrollo Local** (`npm run dev:local`)

**Modo Localhost** (con .env.local.example):
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **Storybook:** http://localhost:6006
- **pgAdmin:** http://localhost:5050 (admin@gmail.com / root)
- **MinIO Panel:** http://localhost:9001 (admin / admin123)
- **CDN:** http://localhost:8082

**Modo Red Local** (con .env.host.example):
- **Frontend:** http://TU_IP:8080 (ej: http://192.168.0.179:8080)
- **Backend API:** http://TU_IP:3000
- **Storybook:** http://TU_IP:6006
- **pgAdmin:** http://TU_IP:5050 (admin@gmail.com / root)
- **MinIO Panel:** http://TU_IP:9001 (admin / admin123)
- **CDN:** http://TU_IP:8082

> **Nota**: El modo depende del archivo .env que uses. Reemplaza `TU_IP` con la IP configurada en tu archivo .env

## 📁 Estructura del Proyecto

```
streamingApp/
├── package.json                    # 🎯 Scripts centralizados del monorepo
├── docker-compose.yml              # 🚀 Producción
├── docker-compose.local.yml        # 🏠 Desarrollo localhost
├── docker-compose.host.yml         # 🌐 Desarrollo red local
├── docker-compose.dev.yml          # 🔧 Desarrollo legacy
├── .env.prod.example               # 🚀 Variables para producción
├── .env.local.example             # 🏠 Variables para localhost
├── .env.host.example              # 🌐 Variables para red local
├── .env                           # Variables activas (copiar desde ejemplo)
├── clean.js                       # Script de limpieza Docker
│
├── backend/app/                    # 🔙 Backend Node.js + Express
│   ├── package.json               # Dependencias y scripts del backend
│   ├── index.js                   # Punto de entrada del servidor
│   ├── routes/                    # Rutas API (authRouter, moviesRoutes, etc.)
│   ├── services/                  # Lógica de negocio
│   ├── middleware/                # Middleware (auth, validation, upload)
│   ├── schemas/                   # Validación de datos
│   ├── utils/                     # Utilidades (video, auth, AWS)
│   └── libs/                      # Librerías (PostgreSQL pool)
│
├── frontend/app/                   # 🎨 Frontend React + Vite + Storybook
│   ├── package.json               # Dependencias y scripts del frontend
│   ├── vite.config.js             # Configuración Vite + path aliases
│   ├── src/                       # Código fuente React
│   │   ├── components/            # Atomic Design
│   │   │   ├── atoms/             # Button, Input, Card, Avatar...
│   │   │   ├── molecules/         # FilterBar, ContentCard, StatsCard...
│   │   │   ├── organisms/         # DataTable, AdminSidebar, TMDBSearchView...
│   │   │   └── templates/         # AdminLayout, PageLayout
│   │   ├── Pages/                 # Páginas principales
│   │   ├── services/              # APIs organizadas por dominio
│   │   │   ├── Auth/              # loginService, registrationService...
│   │   │   ├── Movies/            # createMovieService, getMoviesService...
│   │   │   ├── Series/            # createSeriesService, getSeriesService...
│   │   │   └── Users/             # createUserService, getUsersService...
│   │   ├── hooks/                 # Custom hooks (useAuth, useMovies...)
│   │   └── app/context/           # React contexts por dominio
│   └── .storybook/                # Configuración Storybook
│
├── servers/                        # 🏗️ Infraestructura
│   ├── cdn/                       # NGINX CDN + configuración
│   ├── transcoderServers/         # Transcodificación de video
│   │   ├── transcoder1/           # Servidor 1 de transcodificación  
│   │   └── transcoder2/           # Servidor 2 de transcodificación
│   ├── minio/                     # MinIO S3-compatible storage
│   └── postgresQl/                # PostgreSQL + datos iniciales
│
└── documentation/                  # 📖 Documentación técnica
    ├── videojs-player-configuration.html
    ├── comandosServerNgix.html
    └── vodKaltura.html
```

## 🎨 Sistema de Diseño y Storybook

### 📚 Filosofía: Atomic Design + Simplicidad
- **Átomos:** Componentes básicos (Button, Input, Card)
- **Moléculas:** Combinaciones funcionales (SearchBar, LoginForm)
- **Organismos:** Secciones complejas (Header, MovieGrid)

### ✅ Convenciones de Código OBLIGATORIAS
```javascript
// ✅ ÚNICO export permitido
function ComponentName() {
  return <div>...</div>;
}
export { ComponentName };

// ❌ PROHIBIDO
export const ComponentName = () => {}
export default ComponentName
```

### 🎯 Variables CSS del Sistema
```css
/* Usar SIEMPRE variables del sistema */
style={{ 
  padding: 'var(--space-md)',
  color: 'var(--color-primary)',
  borderRadius: 'var(--radius-lg)'
}}

/* ❌ PROHIBIDO hardcodear valores */
style={{ padding: '20px', color: '#ff0000' }}
```

### 📖 Stories de Storybook
**Para Átomos:** 6 stories obligatorias
- Default, Sizes, Variants, States, Interactive, Accessibility

**Para Moléculas:** Mínimo 5 stories
- Playground, Default, States + 2 específicas de funcionalidad

## 🔧 Configuración de Desarrollo

### 🐳 **Docker (Recomendado)**
- **Ventajas:** Todo configurado automáticamente, mismo entorno para todos
- **Localhost:** `npm run dev:local` - Solo accesible desde tu máquina
- **Red Local:** `npm run dev:host` - Accesible desde dispositivos en red
- **Hot Reload:** Automático en todos los servicios

### 💻 **Calidad de Código**
```bash
npm run lint           # Verificar ESLint en backend y frontend
npm run lint:fix       # Corregir problemas automáticamente
```

## 🚨 Resolución de Problemas

### ❌ **Error "Puerto en uso"**
```bash
# Solución rápida según tu entorno
npm run stop:local   # Si usas desarrollo local
npm run stop:prod    # Si usas producción
npm run clean        # Limpiar completamente
npm run clean:full   # Limpieza profunda

# Reiniciar según tu entorno
npm run dev:local    # Localhost
npm run dev:host     # Red local
npm run prod         # Producción

# Verificar qué proceso usa el puerto
npm run ports       # Ver puertos del proyecto
lsof -i :8080      # Frontend
lsof -i :3000      # Backend  
lsof -i :5432      # PostgreSQL
```

### ❌ **Error de permisos Docker**
```bash
# Linux/Mac
sudo usermod -aG docker $USER
# Cerrar sesión y volver a iniciar

# Windows
# Ejecutar Docker Desktop como administrador
```

### ❌ **Variables de entorno**
```bash
# Problema: Variables no encontradas
# Seleccionar archivo según tu entorno:
cp .env.local.example .env    # Para desarrollo localhost
cp .env.host.example .env     # Para desarrollo red local
cp .env.prod.example .env     # Para producción

# Usar helper para seleccionar
npm run env:setup            # Muestra opciones disponibles

# Verificar que las variables se cargan
cat .env | grep VITE_TMDB_API_KEY
```

### ❌ **Error "TMDB API Key inválida"**
```bash
# Síntoma: No se cargan películas/series
# Solución:
1. Verificar que VITE_TMDB_API_KEY esté configurada en .env
2. Verificar que la API key sea válida en https://www.themoviedb.org/
3. Reiniciar el frontend: npm run dev:frontend
```

### ❌ **Error de conexión a la base de datos**
```bash
# Síntoma: Error al conectar con PostgreSQL
npm run logs:db          # Ver logs de la base de datos
npm run up:database      # Levantar solo la base de datos
docker ps | grep postgres # Verificar que PostgreSQL esté corriendo
```

### ❌ **Problemas de conectividad**
```bash
npm run health         # Verificar que todos los servicios respondan
npm run check:services # Verificar salud de servicios principales
npm run ports          # Verificar que los puertos estén disponibles
npm run status         # Estado de contenedores Docker

# Ver logs específicos según el problema
npm run logs:backend   # Solo backend
npm run logs:frontend  # Solo frontend
npm run logs:database  # Solo base de datos
npm run monitor        # Monitorear recursos
```

### ❌ **Error "Cannot connect to Docker daemon"**
```bash
# Verificar que Docker esté corriendo
docker --version
sudo systemctl start docker    # Linux
# o iniciar Docker Desktop      # Windows/Mac
```

### ❌ **Frontend carga pero no hay datos**
```bash
# Verificar conexión Backend ↔ Frontend
curl http://localhost:3000/health  # ¿Responde el backend?
npm run logs:backend              # Ver logs del backend
# Verificar CORS en .env: WHITE_LIST debe incluir http://localhost:8080
```

## 📦 Gestión de Dependencias

### 🔧 **Instalación de Dependencias**
```bash
npm run install:all    # Instalar dependencias en monorepo, backend y frontend
```

### 🧹 **Linting y Calidad de Código**
```bash
npm run lint           # Verificar ESLint en backend y frontend
npm run lint:backend   # Solo backend
npm run lint:frontend  # Solo frontend
npm run lint:fix       # Corregir problemas automáticamente
npm run lint:fix:backend   # Corregir solo backend
npm run lint:fix:frontend  # Corregir solo frontend
```

## 🎬 Procesamiento de Video

### ⚙️ **Configuración de Calidades**

El sistema ofrece dos modos de procesamiento de video configurables:

#### 📺 **Modo Actual: Solo Calidad Original** (`VIDEO_PROCESSING_MODE=original`)
```bash
# .env
VIDEO_PROCESSING_MODE=original  # ✅ Configuración actual
```

**Comportamiento:**
- ✅ **Solo procesa 1 calidad**: La resolución original del video
- ✅ **Optimización inteligente**: Si el video ya está en H.264 MP4, solo copia el archivo
- ✅ **Transcodificación selectiva**: Solo transcodifica si el codec no es compatible
- ✅ **Máximo rendimiento**: 60-80% más rápido que el modo múltiple

**Ejemplo:**
```
Video entrada: 1080p H.264 AAC MP4
Resultado: ✅ Copia directa (30 segundos)

Video entrada: 1080p H.265 AAC MP4  
Resultado: ⚡ Transcodifica a H.264 (5-8 minutos)
```

#### 🎯 **Modo Múltiples Calidades** (`VIDEO_PROCESSING_MODE=multiple`)
```bash
# .env
VIDEO_PROCESSING_MODE=multiple  # Para habilitar streaming adaptativo
```

**Comportamiento:**
- ✅ **Múltiples calidades**: 480p, 720p, 1080p, 2K, 4K según resolución original
- ✅ **Streaming adaptativo**: Diferentes calidades según conexión del usuario
- ✅ **Optimización por calidad**: Cada resolución se valida individualmente

**Calidades disponibles:**
```javascript
baseQualities: [
  { h: 480, vbr: 1400, abr: 128 },  // 480p
  { h: 720, vbr: 2800, abr: 160 },  // 720p
  { h: 1080, vbr: 5000, abr: 192 }, // 1080p
  { h: 1440, vbr: 8000, abr: 256 }, // 2K (1440p)
  { h: 2160, vbr: 12000, abr: 320 }, // 4K (2160p)
]
```

### 🔧 **Cómo Cambiar el Modo**

**Para activar múltiples calidades:**
```bash
# Editar .env
VIDEO_PROCESSING_MODE=multiple

# Reiniciar servicios
npm run restart
```

**Para mantener solo calidad original:**
```bash
# Editar .env
VIDEO_PROCESSING_MODE=original

# Reiniciar servicios
npm run restart
```

### ⚙️ **Variables de Entorno de Video**

```bash
# === CONFIGURACIÓN DE PROCESAMIENTO DE VIDEO ===

# Modo de procesamiento (obligatorio)
VIDEO_PROCESSING_MODE=original    # 'original' | 'multiple'

# Perfil de calidad (opcional, por defecto 'standard')
VIDEO_QUALITY_PROFILE=standard   # 'standard' | 'high'
```

**VIDEO_QUALITY_PROFILE explicado:**
- **`standard`**: CRF 24, menor tamaño de archivo, calidad buena
- **`high`**: CRF 18, mayor tamaño de archivo, calidad excelente

### 📊 **Comparación de Rendimiento**

| Aspecto | Modo Original | Modo Múltiple |
|---------|---------------|---------------|
| **Archivos generados** | 1 archivo | 3-5 archivos |
| **Tiempo (video optimizado)** | ~30 segundos | ~15-30 minutos |
| **Tiempo (requiere transcodificación)** | ~5-8 minutos | ~15-30 minutos |
| **Espacio en disco** | Mínimo | 3-5x más |
| **Streaming adaptativo** | No | Sí |
| **Mejor para** | Almacenamiento eficiente | Experiencia de usuario |

## 🏗️ Arquitectura de Servicios

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Frontend   │    │ Storybook   │    │   Backend   │
│   :8080     │    │   :6006     │    │   :3000     │
└─────┬───────┘    └─────────────┘    └─────┬───────┘
      │                                      │
      │              ┌─────────────┐        │
      └──────────────┤    CDN      ├────────┘
                     │   :8082     │
                     └─────┬───────┘
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
┌─────▼───────┐    ┌─────▼───────┐    ┌─────▼───────┐
│Transcoder1  │    │Transcoder2  │    │   MinIO     │
│             │    │             │    │ :9000/:9001 │
└─────────────┘    └─────────────┘    └─────┬───────┘
                                           │
                                     ┌─────▼───────┐
                                     │ PostgreSQL  │
                                     │ :5432/:5050 │
                                     └─────────────┘
```

## 🤝 Contribución

### 🔄 **Proceso de Contribución**
1. **Fork** del repositorio
2. **Crear rama:** `git checkout -b feature/nueva-funcionalidad`
3. **Seguir convenciones:** Ver guía de reglas del proyecto
4. **Linting:** Ejecutar `npm run lint` y `npm run lint:fix`
5. **Commit:** Usar [conventional commits](https://www.conventionalcommits.org/es/v1.0.0/)
6. **Pull Request:** Descripción clara de los cambios

### 📝 **Convenciones de Commit**
```bash
# Ejemplos de commits válidos:
feat: add video quality selector component
fix: resolve CORS issue with frontend API calls
docs: update README with new environment variables
style: improve button component styling
refactor: reorganize video processing utilities
test: add unit tests for authentication service
```

### 🎯 **Antes de Contribuir**
- Leer `CLAUDE.md` para entender la arquitectura
- Verificar que el código pase el linting: `npm run lint`
- Probar que la aplicación funcione según tu entorno:
  - `npm run dev:local` (desarrollo local)
  - `npm run prod` (producción)

## 📄 Licencia

**ISC** - Ver archivo LICENSE para más detalles.

## 👨‍💻 Autor

**Kike Torillo**
- GitHub: [@KikeTorillo](https://github.com/KikeTorillo)
- Email: [arellanestorillo@yahoo.com](mailto:arellanestorillo@yahoo.com)

---

## 🚀 **¿Necesitas ayuda?**

Si tienes problemas con la configuración:
1. Revisa la sección [🚨 Resolución de Problemas](#-resolución-de-problemas)
2. Verifica que cumples todos los [📋 Prerequisitos](#-prerequisitos)
3. Asegúrate de haber configurado las [variables de entorno](#️-variables-de-entorno-requeridas)
4. Crea un [issue](https://github.com/KikeTorillo/streamingApp/issues) si el problema persiste

**¡Gracias por usar StreamingApp!** 🎬