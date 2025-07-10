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

### ⚡ Comando Principal (TODO EN UNO)
```bash
# Desde la raíz del proyecto
npm run dev
```
Este comando ejecuta automáticamente:
- Backend API (puerto 3000)
- Frontend React+Vite (puerto 8080) 
- Storybook (puerto 6006)
- PostgreSQL + pgAdmin
- MinIO S3 + Panel
- CDN y Transcodificadores

### 📋 Configuración Inicial

#### 🎯 **Configuración Automática (Recomendado)**
```bash
# 1. Clonar el repositorio
git clone https://github.com/KikeTorillo/streamingApp.git
cd streamingApp

# 2. Copiar y configurar variables de entorno
cp example.env .env
# ⚠️ IMPORTANTE: Editar .env y configurar las variables marcadas con ⚠️

# 3. Levantar toda la plataforma
npm run dev
```

#### ⚙️ **Variables de Entorno Requeridas**
Después de copiar `example.env` a `.env`, **debes configurar**:

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
cp example.env .env
# Editar .env con tus valores

# 3. Instalar dependencias (opcional)
npm run install:all

# 4. Levantar servicios
npm run dev
```

## 🛠️ Scripts Principales Disponibles

### 🐳 **Gestión Docker (Recomendado para desarrollo)**
```bash
npm run dev          # Inicia toda la plataforma (Backend + Frontend + Storybook + Servicios)
npm run stop         # Detiene todos los servicios
npm run restart      # Reinicia todos los servicios
npm run clean        # Limpia contenedores, volúmenes e imágenes
npm run status       # Muestra el estado de todos los servicios
```

### 💻 **Desarrollo Local (Sin Docker)**
```bash
npm run dev:local    # Ejecuta backend, frontend y storybook en paralelo
npm run dev:backend  # Solo backend (requiere DB externa)
npm run dev:frontend # Solo frontend
npm run dev:storybook # Solo Storybook
```

### 🔧 **Servicios Individuales**
```bash
npm run up:backend   # Solo backend + base de datos + almacenamiento
npm run up:frontend  # Solo frontend
npm run up:storybook # Solo Storybook
npm run up:database  # Solo PostgreSQL + pgAdmin
npm run up:storage   # Solo MinIO
npm run up:cdn       # Solo CDN y transcodificadores
```

### 📊 **Monitoreo y Debug**
```bash
npm run logs         # Ver logs de todos los servicios
npm run logs:backend # Ver logs solo del backend
npm run logs:frontend # Ver logs solo del frontend
npm run monitor      # Monitorear recursos de contenedores
npm run health       # Verificar que todos los servicios respondan
npm run ports        # Ver qué puertos están en uso
```

### 🐚 **Acceso a Consolas**
```bash
npm run shell:backend  # Acceder al contenedor del backend
npm run shell:frontend # Acceder al contenedor del frontend
npm run shell:db      # Acceder a PostgreSQL CLI
```

## 🌐 URLs de Acceso

Una vez ejecutado `npm run dev`, acceder a:

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **Storybook:** http://localhost:6006
- **pgAdmin:** http://localhost:5050 (admin@gmail.com / root)
- **MinIO Panel:** http://localhost:9001 (admin / admin123)
- **CDN:** http://localhost:8082

## 📁 Estructura del Proyecto

```
streamingAppBack/
├── package.json              # 🎯 NUEVO: Scripts centralizados
├── docker-compose.yml        # Orquestación de servicios
├── example.env               # Variables de entorno de ejemplo
├── .env                      # Variables de entorno (crear desde example.env)
│
├── backend/app/              # 🔙 Backend Node.js + Express
│   ├── package.json         # Scripts específicos del backend
│   ├── index.js             # Punto de entrada del servidor
│   ├── routes/              # Rutas de la API
│   ├── models/              # Modelos de datos
│   └── middleware/          # Middleware personalizado
│
├── frontend/app/             # 🎨 Frontend React + Vite
│   ├── package.json         # Scripts específicos del frontend
│   ├── src/                 # Código fuente React
│   │   ├── components/      # Componentes siguiendo Atomic Design
│   │   │   ├── atoms/       # Componentes básicos
│   │   │   ├── molecules/   # Combinaciones de átomos
│   │   │   └── organisms/   # Componentes complejos
│   │   ├── pages/           # Páginas de la aplicación
│   │   └── services/        # Servicios y APIs
│   └── .storybook/          # Configuración de Storybook
│
└── servers/                  # 🏗️ Configuración de infraestructura
    ├── cdn/                 # Configuración del CDN
    ├── transcoderServers/   # Servidores de transcodificación
    ├── minio/               # Almacenamiento S3
    └── postgresQl/          # Base de datos
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
- **Uso:** `npm run dev` y listo
- **Hot Reload:** Automático en todos los servicios

### 💻 **Local (Desarrollo avanzado)**
- **Requisitos:** Node.js 18+, PostgreSQL, MinIO local
- **Configuración:** Ajustar variables en `.env`
- **Uso:** `npm run dev:local`

## 🚨 Resolución de Problemas

### ❌ **Error "Puerto en uso"**
```bash
# Solución rápida
npm run stop     # Detener todos los servicios
npm run clean    # Limpiar completamente
npm run dev      # Reiniciar

# Verificar qué proceso usa el puerto
lsof -i :8080    # Frontend
lsof -i :3000    # Backend  
lsof -i :5432    # PostgreSQL
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
cp example.env .env
# Editar .env con tus valores reales

# Verificar que las variables se cargan
npm run env:validate  # (si existe)
# o manualmente:
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
npm run health    # Verificar que todos los servicios respondan
npm run logs      # Ver logs para identificar errores
npm run ports     # Verificar que los puertos estén disponibles
npm run status    # Estado de contenedores Docker
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

### 🔄 Actualizar dependencias
```bash
npm run update:all      # Actualizar todas las dependencias
npm run update:backend  # Solo backend
npm run update:frontend # Solo frontend
```

### 🧹 Linting y formato
```bash
npm run lint          # Verificar calidad de código
npm run lint:fix      # Corregir problemas automáticamente
```

## 🧪 Testing

### 🔬 **Comandos de Testing**
```bash
# Frontend tests (Vitest)
npm run test                # Ejecutar todos los tests del frontend
npm run test:watch          # Ejecutar tests en modo watch
npm run test:ui             # Interfaz gráfica para tests
npm run test:coverage       # Generar reporte de cobertura

# Storybook tests
npm run test:storybook      # Tests de componentes en Storybook
npm run storybook:build     # Build de Storybook para producción
```

### 📊 **Estructura de Testing**
```
frontend/app/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   └── Button/
│   │   │       ├── Button.jsx
│   │   │       ├── Button.test.jsx     # ✅ Tests unitarios
│   │   │       └── Button.stories.jsx  # ✅ Stories de Storybook
│   │   └── molecules/
│   └── __tests__/              # Tests globales
└── vitest.config.js
```

### 🎯 **Filosofía de Testing**
- **Componentes Atoms**: Tests unitarios obligatorios
- **Componentes Molecules**: Tests de integración
- **Storybook**: Tests visuales y de interacción
- **API**: Tests de endpoints (pendiente implementar)
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
4. **Testing:** Ejecutar `npm run test` y `npm run lint`
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
- Verificar que los tests pasen: `npm run test`
- Verificar que el código pase el linting: `npm run lint`
- Probar que la aplicación funcione: `npm run dev`

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