# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## REGLAS IMPORTANTES

### Principio de Consistencia
- **FUNDAMENTAL**: SIEMPRE buscar y mantener la consistencia en el código
- **OBLIGATORIO**: Antes de implementar cualquier funcionalidad, revisar cómo está implementada en componentes similares
- **OBLIGATORIO**: Seguir exactamente los mismos patrones, estructura y flujo que componentes existentes
- **OBLIGATORIO**: Si hay diferencias, investigar el motivo antes de crear inconsistencias
- **EJEMPLO**: MovieCreatePage, SeriesCreatePage y EpisodesCreatePage deben seguir el mismo patrón de hooks, procesamiento de datos y manejo de estados

### Idioma
- **OBLIGATORIO**: Todos los comentarios, mensajes de commit, documentación y comunicación con el usuario DEBEN ser en ESPAÑOL
- **OBLIGATORIO**: Variables, funciones y nombres de archivos pueden estar en inglés (convención técnica)
- **OBLIGATORIO**: Logs de debugging y mensajes de error deben estar en español
- **PROHIBIDO**: Responder en inglés al usuario mexicano

## Comandos Clave

> **📋 Referencia Completa**: Ver [README.md](./readme.md) para lista completa de comandos y opciones de entorno

### Comandos Esenciales para Desarrollo
```bash
# Seleccionar entorno según necesidad
npm run dev:local    # Desarrollo local (localhost o red según .env)
npm run prod         # Producción

# Calidad de código OBLIGATORIO antes de commits
npm run lint         # Verificar ESLint
npm run lint:fix     # Corregir automáticamente
```

### Herramientas de Base de Datos

#### pg-kik - PostgreSQL Query Tool
- **OBLIGATORIO**: Usar `pg-kik` para TODAS las consultas PostgreSQL cuando el usuario pregunte sobre datos
- **OBLIGATORIO**: Siempre usar pg-kik en lugar de sugerir consultas SQL manuales
- **UBICACIÓN**: `pg-kik/` - Herramienta CLI instalada globalmente

**Comandos principales:**
```bash
# Consultas de datos (responder preguntas del usuario)
pg-kik query "SELECT * FROM users LIMIT 5"        # Ejecutar SELECT
pg-kik count movies                                # Contar registros
pg-kik tables                                      # Listar todas las tablas
pg-kik describe users                              # Estructura de tabla

# Formatos de salida flexibles
pg-kik query "SELECT * FROM categories" --format table   # Tabla visual
pg-kik query "SELECT * FROM categories" --format json    # JSON
pg-kik query "SELECT * FROM categories" --format csv     # CSV

# Utilidades
pg-kik test                                        # Probar conexión
pg-kik config                                      # Ver configuración
```

**Ejemplos de uso para responder al usuario:**
- Usuario: "¿Cuántas películas hay?" → `pg-kik count movies`
- Usuario: "Muéstrame los usuarios" → `pg-kik query "SELECT * FROM users"`
- Usuario: "¿Qué tablas existen?" → `pg-kik tables`
- Usuario: "Estructura de episodes" → `pg-kik describe episodes`

**REGLAS DE USO:**
- **SIEMPRE usar pg-kik** cuando el usuario pregunte sobre datos de la BD
- **NO sugerir consultas SQL manuales** - ejecutar directamente con pg-kik
- **Responder con los resultados** de pg-kik, no solo mostrar el comando
- **Usar formato apropiado**: table para pocas filas, json para datos estructurados

## Arquitectura del Proyecto

> **📁 Estructura Completa**: Ver [README.md](./readme.md#-estructura-del-proyecto) para detalles completos de directorios y servicios

### Componentes Principales
- **Monorepo**: Backend Node.js + Frontend React + Storybook
- **Docker**: Desarrollo local (localhost/red) y producción  
- **Base de Datos**: PostgreSQL con datos iniciales
- **Almacenamiento**: MinIO S3-compatible
- **CDN**: NGINX personalizado para streaming

## Arquitectura de Código

### Patrones de Desarrollo
- **Backend**: MVC Pattern (Routes → Services → Models) + JWT Auth
- **Frontend**: Atomic Design (atoms → molecules → organisms → templates)
- **Estado**: React Context API organizado por dominio
- **Estilos**: CSS modules + Design System variables
- **APIs**: Servicios organizados por dominio

## Contextos Especializados para Claude

### 🔧 Backend - Contexto Completo
> **📋 Referencia Principal**: [.claude/contexts/streaming-backend-context.md](./.claude/contexts/streaming-backend-context.md)

**OBLIGATORIO**: Cuando trabajes con backend, servicios, APIs, base de datos, autenticación, o procesamiento de archivos, consultar este contexto que incluye:

- **BaseService Pattern**: Clase base con herencia para todos los servicios
- **Sistema de Errores**: ErrorFactory + Logger estructurado en español
- **Middleware Stack**: Orden de ejecución y configuración JWT + roles
- **Esquemas Joi**: Validación en camelCase para todos los endpoints
- **Arquitectura MVC**: Routes → Services → Models documentada
- **File Processing**: Pipeline FFmpeg + MinIO + detección de duplicados
- **Database Layer**: PostgreSQL con auditoría automática y optimizaciones
- **API Structure**: 40+ endpoints documentados con /api/v1 base URL
- **Security**: CORS, JWT cookies, validación MIME, roles de usuario
- **Performance**: Connection pooling, transacciones automáticas, logging contextual

**Servicios disponibles** (todos heredan de BaseService):
- authService, moviesService, seriesService, EpisodesService
- categoriesService, usersService, userPreferencesService

### 🎨 Frontend - Contextos Adicionales
- **Design System**: [.claude/contexts/design-system-context.md](./.claude/contexts/design-system-context.md)
- **Dynamic Forms**: [.claude/contexts/dynamicform-context.md](./.claude/contexts/dynamicform-context.md)
- **Database Schema**: [.claude/contexts/database-context.md](./.claude/contexts/database-context.md)

## Flujo de Desarrollo

> **🚀 Setup Completo**: Ver [README.md](./readme.md#-inicio-rápido) para configuración inicial detallada

1. **Setup**: Seleccionar entorno y configurar variables
2. **Desarrollo**: Hot reload automático en todos los servicios  
3. **Storybook**: Desarrollo y documentación de componentes
4. **Linting**: `npm run lint` antes de commits

## Principio de Simplicidad

**REGLA DE ORO**: SIEMPRE PRIORIZAR LA SIMPLICIDAD
- **KISS (Keep It Simple, Stupid)**: La solución más simple es generalmente la correcta
- **Evitar over-engineering**: No crear complejidad innecesaria
- **Lógica directa**: Preferir código claro sobre código "inteligente"
- **Una responsabilidad**: Cada función/componente debe hacer una sola cosa bien
- **Debugging fácil**: Si es difícil de debuggear, probablemente es muy complejo

## Configuración de Entorno

> **⚙️ Setup Detallado**: Ver [README.md](./readme.md#-configuración-inicial-rápida) para configuración completa de entornos

### Variables Clave Requeridas
- `VITE_TMDB_API_KEY`: API de The Movie Database (requerida)
- `JWT_SECRET`: Clave secreta para JWT (recomendado cambiar)
- Configuración de IP para acceso en red local (modo `dev:host`)

## Archivos Clave del Proyecto

> **📁 Lista Completa**: Ver [README.md](./readme.md#-estructura-del-proyecto) para estructura detallada

### Configuración Principal
- `package.json`: Scripts centralizados del monorepo 
- `docker-compose.*.yml`: Orquestación de servicios por entorno
- `.env.*example`: Templates de variables por entorno
- `CLAUDE.md`: Este archivo - reglas de desarrollo

## Tareas Comunes de Desarrollo

> **🔧 Workflow Completo**: Ver [README.md](./readme.md) para comandos específicos y troubleshooting

### Workflow Esencial
1. **CONSISTENCIA PRIMERO**: Revisar componentes similares antes de implementar
2. **Seleccionar entorno**: `dev:local`, `dev:host`, o `prod`
3. **Desarrollo**: Hot reload automático, Storybook para componentes
4. **Linting**: `npm run lint:fix` antes de commits
5. **Debug**: Usar logs específicos por servicio

## Convenciones de Nomenclatura (Frontend ↔ Backend)

### **REGLA FUNDAMENTAL**: camelCase en Frontend/Backend, snake_case solo en DB

**PATRÓN OBLIGATORIO** del proyecto:
1. **Frontend → Backend**: **camelCase** (`playbackRate`, `preferredLanguage`, `subtitlesEnabled`)
2. **Joi Schemas**: **camelCase** (valida la entrada del API)
3. **Service Logic**: **Mapeo automático** camelCase → snake_case para DB
4. **Database**: **snake_case** (`playback_rate`, `preferred_language`, `subtitles_enabled`)

### Ejemplos de Conversión Correcta
```javascript
// ✅ CORRECTO: Frontend envía camelCase
const preferences = {
  playbackRate: 1.5,           // Frontend
  preferredLanguage: 'es',     // Frontend  
  subtitlesEnabled: true       // Frontend
};

// ✅ Backend Service mapea automáticamente:
// playbackRate → playback_rate (DB)
// preferredLanguage → preferred_language (DB)
// subtitlesEnabled → subtitles_enabled (DB)
```

### Ubicaciones del Patrón
- **Joi Schemas**: `/backend/app/schemas/*` - **camelCase**
- **Service Mapping**: `/backend/app/services/*Service.js` - **fieldMapping object**
- **Frontend Services**: `/frontend/app/src/services/*` - **camelCase**
- **React Hooks**: `/frontend/app/src/hooks/*` - **camelCase**

**❌ PROHIBIDO**: Usar snake_case en frontend o mixing de convenciones

## Principio de "Crear vs Usar" (Build vs Buy)

### Framework de Evaluación para Dependencias Externas

**FILOSOFÍA**: Priorizar creaciones propias para el design system y componentes base reutilizables entre proyectos, pero ser pragmático con librerías complejas.

### Matriz de Decisión
```
              │ Complejo │ Simple  
──────────────┼─────────┼────────
Crítico       │  Usar   │ Crear  
              │         │        
No Crítico    │  Usar   │ Crear  
```

### 🟢 SIEMPRE crear propio (Prioridad Alta)
- **Design System & Componentes Base**: Button, Input, Card, Modal, Layout
- **Business Logic específico**: Hooks (useAuth, useMovies), Services del dominio
- **Templates reutilizables**: AdminLayout, PlayerLayout, componentes del proyecto
- **RAZÓN**: Base para todos los futuros proyectos, control total, ventaja competitiva

### 🟡 EVALUAR y consultar (Pregunta: "¿Qué opinas?")
- **Criterios para evaluar**:
  - ¿Cuánto tiempo tomaría crear vs usar?
  - ¿Es crítico para el negocio?
  - ¿Qué tan complejo es mantenerlo?
  - ¿Se puede integrar con nuestro design system?

### 🔴 USAR librerías existentes (Cuando Claude recomienda)
- **Video players**: Video.js, HLS.js (años de optimización, cross-browser)
- **Date/time**: dayjs, date-fns (timezone, localization complexity)
- **Crypto/security**: bcrypt, JWT libraries (security-critical)
- **File processing**: FFmpeg, Sharp (performance-critical)
- **Complex animations**: Framer Motion (physics, timing)

### Proceso de Evaluación (5 minutos)
1. **Investigación**: ¿Existe librería madura? (GitHub stars, mantenimiento)
2. **Proof of Concept**: ¿Funciona básico en 30 min?
3. **Integración**: ¿Se integra con nuestro design system?
4. **Decisión**: Si los 3 pasos funcionan → Usar librería

### Señales para Consultar a Claude
- ⏰ "Esto me está tomando más tiempo del esperado"
- 🤔 "Siento que estoy reinventando algo"
- 🔥 "Hay muchas librerías para esto, no sé cuál usar"
- 🎯 "¿Vale la pena el esfuerzo vs el resultado?"

### Red Flags para NO reinventar
- **"Es solo un div que..."** → Probablemente es más complejo
- **"En 2 días lo hago"** → Probablemente tomará 2 semanas  
- **"Total, es solo JavaScript"** → Cross-browser compatibility
- **"Así tenemos control total"** → Y responsabilidad total de bugs

### Golden Rule
> **"Crear design system propio + usar librerías inteligentemente = máxima productividad"**

### Roadmap Evolutivo
1. **MVP**: Usar librerías + componentes básicos propios
2. **Optimización**: Extraer design system reutilizable
3. **Maduración**: Sistema de componentes entre proyectos
4. **Especialización**: Componentes custom solo cuando sea necesario

## Frontend Specialist - Contexto Específico del Proyecto

### Contextos React Disponibles
- **AuthContext**: Autenticación (user, isAuthenticated, login/logout)
- **UserContext**: Gestión de usuarios CRUD
- **MoviesContext**: Gestión de películas
- **SeriesContext**: Gestión de series  
- **EpisodesContext**: Gestión de episodios
- **CategoriesContext**: Gestión de categorías
- **AlertContext**: Sistema de notificaciones
- **ThemeContext**: Tema claro/oscuro

### Servicios por Dominio (Patrón actionResourceService.js)
- **Auth/**: loginService, logoutService, registrationService, recoveryService
- **Users/**: getUsersService, createUserService, updateUserService, deleteUserService
- **Movies/**: getMoviesService, createMovieService, updateMovieService, deleteMovieService
- **Series/**: getSeriesService, createSeriesService, updateSeriesService, deleteSeriesService
- **Episodes/**: getEpisodesService, createEpisodeService, updateEpisodeService, deleteEpisodeService
- **Categories/**: getCategoriesService, createCategoryService, updateCategoryService, deleteCategoryService
- **UserPreferences/**: getUserPreferencesService, updateWatchProgressService

### Hooks Personalizados Disponibles
- **useAuth()**: Hook principal de autenticación
- **useUsers()**: CRUD completo de usuarios
- **useMovies()**: CRUD completo de películas
- **useSeries()**: CRUD completo de series
- **useEpisodes()**: CRUD completo de episodios
- **useCategories()**: CRUD completo de categorías
- **useAlert()**: Sistema de notificaciones

### Patrones de Páginas CRUD Existentes
- **UsersListPage + UsersCreatePage**: Patrón maestro para CRUD
- **MoviesListPage + MoviesCreatePage**: Sigue mismo patrón
- **SeriesListPage + SeriesCreatePage**: Consistencia mantenida
- **EpisodesListPage + EpisodesCreatePage**: Mismo flujo

### Componentes Storybook Verificados
**OBLIGATORIO**: Solo usar componentes con .stories.jsx:
- Verificar en http://localhost:6006 antes de usar cualquier componente
- Todos los componentes nuevos DEBEN tener stories antes de ser usables

### Para Frontend Specialist - Flujo de Trabajo

1. **ANTES de crear componentes**: Buscar patrones similares existentes
2. **ANTES de usar contextos**: Verificar hooks disponibles (useAuth, useUsers, etc.)
3. **ANTES de crear servicios**: Revisar servicios existentes en misma carpeta
4. **ANTES de definir estilos**: Usar variables CSS del design system

### Ejemplos de Consistencia Requerida
- Si trabajas en UsersCreatePage, revisar MoviesCreatePage y SeriesCreatePage
- Si creates un nuevo contexto, seguir patrón de AuthContext y UserContext
- Si agregas un servicio, seguir patrón actionResourceService.js

## Estructura Real de Archivos del Proyecto

### Páginas Admin (PascalCase con mayúsculas)
**IMPORTANTE**: Las rutas usan PascalCase, NO minúsculas
- `/frontend/app/src/Pages/Admin/Users/UsersListPage/UsersListPage.jsx`
- `/frontend/app/src/Pages/Admin/Users/UsersCreatePage/UsersCreatePage.jsx`
- `/frontend/app/src/Pages/Admin/Movies/MoviesListPage/MoviesListPage.jsx`
- `/frontend/app/src/Pages/Admin/Movies/MoviesCreatePage/MoviesCreatePage.jsx`
- `/frontend/app/src/Pages/Admin/Series/SeriesListPage/SeriesListPage.jsx`
- `/frontend/app/src/Pages/Admin/Series/SeriesCreatePage/SeriesCreatePage.jsx`
- `/frontend/app/src/Pages/Admin/Episodes/EpisodesListPage/EpisodesListPage.jsx`
- `/frontend/app/src/Pages/Admin/Episodes/EpisodesCreatePage/EpisodesCreatePage.jsx`
- `/frontend/app/src/Pages/Admin/Categories/CategoriesListPage/CategoriesListPage.jsx`
- `/frontend/app/src/Pages/Admin/Categories/CategoriesCreatePage/CategoriesCreatePage.jsx`

### Contextos (en subcarpeta app/)
- `/frontend/app/src/app/context/AuthContext.jsx`
- `/frontend/app/src/app/context/UserContext.jsx`
- `/frontend/app/src/app/context/MoviesContext.jsx`
- `/frontend/app/src/app/context/SeriesContext.jsx`
- `/frontend/app/src/app/context/EpisodesContext.jsx`
- `/frontend/app/src/app/context/CategoriesContext.jsx`
- `/frontend/app/src/app/context/AlertContext.jsx`
- `/frontend/app/src/app/context/ThemeContext.jsx`

### Hooks (wrappers de contextos)
- `/frontend/app/src/hooks/useAuth.js`
- `/frontend/app/src/hooks/useUsers.js`
- `/frontend/app/src/hooks/useMovies.js`
- `/frontend/app/src/hooks/useSeries.js`
- `/frontend/app/src/hooks/useEpisodes.js`
- `/frontend/app/src/hooks/useCategories.js`

### Servicios (organizados por dominio)
- `/frontend/app/src/services/Auth/loginService.js`
- `/frontend/app/src/services/Users/getUsersService.js`
- `/frontend/app/src/services/Movies/getMoviesService.js`
- `/frontend/app/src/services/Series/getSeriesService.js`
- `/frontend/app/src/services/Episodes/getEpisodesService.js`
- `/frontend/app/src/services/Categories/getCategoriesService.js`

### Componentes (Atomic Design)
- `/frontend/app/src/components/atoms/Button/Button.jsx`
- `/frontend/app/src/components/molecules/DynamicForm/DynamicForm.jsx`
- `/frontend/app/src/components/organisms/DataTable/DataTable.jsx`
- `/frontend/app/src/components/templates/AdminLayout/AdminLayout.jsx`

## Metodología de Exploración para Frontend Specialist

### PASO 1: EXPLORAR ANTES DE MODIFICAR
**OBLIGATORIO**: Usar herramientas de exploración antes de asumir rutas

```bash
# Encontrar archivos por patrón
Glob pattern="**/*EpisodesListPage*"
Glob pattern="**/*Context*"

# Buscar por contenido específico  
Grep pattern="useEpisodes" path="frontend/app/src"
Grep pattern="selectedSerieId" output_mode="files_with_matches"
```

### PASO 2: VERIFICAR ESTRUCTURA REAL
1. **Siempre usar Glob primero** para encontrar archivos existentes
2. **Leer archivos completos** para entender la implementación actual
3. **Identificar patrones** en archivos similares (Movies, Series, Users)
4. **Verificar imports** para confirmar rutas reales

### PASO 3: IMPLEMENTAR SIGUIENDO PATRONES
1. **Buscar implementaciones similares** en otros contextos
2. **Mantener consistencia** con patrones existentes
3. **Verificar que los cambios funcionan** con la estructura real

### Ejemplos de Exploración Correcta

#### ✅ **CORRECTO - Explorar primero:**
```bash
Glob pattern="**/*EpisodesContext*"
# Resultado: /frontend/app/src/app/context/EpisodesContext.jsx

Read path="/frontend/app/src/app/context/EpisodesContext.jsx"
# Verificar estructura antes de modificar
```

#### ❌ **INCORRECTO - Asumir rutas:**
```bash
Edit path="/pages/admin/episodes/EpisodesListPage.jsx"
# Error: archivo no existe en esa ruta
```

### Rutas Comunes que Causan Errores
- ❌ `/pages/` → ✅ `/Pages/` (PascalCase)
- ❌ `/context/` → ✅ `/app/context/` (subcarpeta app)
- ❌ `/hooks/` → ✅ `/hooks/` (correcto, pero verificar imports)
- ❌ Minúsculas → ✅ PascalCase en nombres de componentes

## Compatibilidad Móvil y Progressive Web App (PWA)

### Mobile-First Design Principles
- **REGLA FUNDAMENTAL**: Diseñar primero para móvil
- **Media Queries**: Usar `min-width` (mobile-first) NO `max-width` (desktop-first)
- **Touch Targets**: Mínimo 44px (4.4rem) para elementos interactivos
- **Breakpoints**: Base móvil → Tablet (768px) → Desktop (1024px) → Large (1200px)

### Progressive Web App (PWA) Implementation
- **Service Workers**: Funcionamiento offline y cache inteligente
- **Web App Manifest**: Configuración para instalación como app nativa
- **HTTPS obligatorio**: Service Workers requieren conexión segura
- **Touch Events**: Soporte para gestos táctiles (swipe, pinch, tap)
- **App-like Experience**: Navegación fluida sin recargas de página

### Mobile Browser Compatibility
- **iOS Safari**: Limitaciones específicas de WebKit móvil
- **Android Chrome**: Soporte completo de estándares web modernos
- **Samsung Internet**: Consideraciones para dispositivos Samsung
- **Cross-Platform**: Feature detection, polyfills, graceful degradation

### Mobile Performance & UX
- **Touch-Friendly**: Optimizar para thumbs en pantallas pequeñas
- **Fast Loading**: Tiempo de carga inicial < 3 segundos
- **Lazy Loading**: Cargar contenido bajo demanda
- **Battery Optimization**: Minimizar consumo en animaciones
- **Responsive Components**: DataTable → Cards, Navigation → Hamburger