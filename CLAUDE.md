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

## Principio Mobile-First

**REGLA FUNDAMENTAL**: DISEÑAR PRIMERO PARA MÓVIL
- **OBLIGATORIO**: Comenzar siempre con estilos móvil como base
- **OBLIGATORIO**: Usar `min-width` en media queries (mobile-first) NO `max-width` (desktop-first)
- **OBLIGATORIO**: Touch targets mínimo 44px (4.4rem) para elementos interactivos
- **OBLIGATORIO**: Optimizar para thumbs (pulgares) en pantallas pequeñas
- **OBLIGATORIO**: Priorizar contenido esencial en móvil

## Metodología de Resolución de Problemas CSS

**PRINCIPIO FUNDAMENTAL**: Investigar → Entender → Solucionar Simple e Inteligente

### Proceso de Resolución (Ejemplo: DataTable Scroll)

#### 1. **INVESTIGACIÓN PROFUNDA**
- **OBLIGATORIO**: Investigar la librería/framework antes de escribir CSS
- **OBLIGATORIO**: Entender cómo funciona internamente (ej: TanStack Table)
- **OBLIGATORIO**: Identificar la causa raíz, no solo los síntomas
- **EJEMPLO**: TanStack Table aplica `style={{ width: header.getSize() }}` inline que sobrescribe CSS

#### 2. **IDENTIFICAR EL PROBLEMA REAL**
- **OBLIGATORIO**: Distinguir entre problemas de CSS vs configuración de librería
- **OBLIGATORIO**: Verificar si hay estilos inline que sobrescriben
- **OBLIGATORIO**: Revisar contenedores padre que puedan limitar
- **EJEMPLO**: `overflow-x: hidden` en AdminLayout bloqueaba scroll del DataTable

#### 3. **SOLUCIÓN SIMPLE E INTELIGENTE**
- **PREFERIR**: Soluciones que trabajen CON la librería, no contra ella
- **PREFERIR**: CSS inteligente vs fuerza bruta con `!important`
- **PREFERIR**: Contenido natural + contenedor limitado vs anchos fijos
- **EJEMPLO**: `max-width: 100vw` + `width: max-content` = scroll automático

### Reglas de CSS Inteligente

#### ✅ **HACER (Smart CSS)**
```css
/* Contenido natural + límites inteligentes */
.wrapper {
  max-width: 100vw; /* Limita a pantalla */
}

.content {
  width: max-content; /* Respeta contenido natural */
  min-width: 100%; /* Mínimo del contenedor */
}
```

#### ❌ **EVITAR (Brute Force CSS)**
```css
/* Anchos fijos que rompen flexibilidad */
.content {
  width: 100rem !important; /* Demasiado rígido */
  table-layout: fixed !important; /* Pierde adaptabilidad */
}
```

### Metodología de Debugging

#### 1. **Orden de Investigación**
1. Revisar documentación de librería/framework
2. Inspeccionar DOM para estilos inline inesperados
3. Verificar contenedores padre (AdminLayout, etc.)
4. Verificar viewport y meta tags
5. Probar en dispositivos reales vs simulados

#### 2. **Preguntas Clave**
- ¿La librería está aplicando estilos que no esperamos?
- ¿Hay un contenedor padre limitando el comportamiento?
- ¿Estamos peleando contra el comportamiento natural?
- ¿Podemos trabajar CON la librería en lugar de contra ella?

#### 3. **Validación de Solución**
- **OBLIGATORIO**: La solución debe funcionar en TODOS los casos (users, movies, series, etc.)
- **OBLIGATORIO**: Debe ser mantenible y no frágil
- **OBLIGATORIO**: Debe seguir principios mobile-first
- **OBLIGATORIO**: Menos código CSS = mejor (simplicidad > complejidad)

### Ejemplo de Éxito: DataTable Scroll
```css
/* ❌ ANTES: Fuerza bruta */
.data-table__table {
  width: 100rem !important; /* Rígido */
  table-layout: fixed !important; /* Pierde flexibilidad */
}

/* ✅ DESPUÉS: Inteligente */
.data-table {
  max-width: 100vw; /* Límite inteligente */
}

.data-table__table {
  width: max-content; /* Contenido natural */
  min-width: 100%; /* Mínimo del contenedor */
}
```

**Resultado**: Scroll automático cuando es necesario, tabla normal cuando no.

### Reglas de CSS Mobile-First
```css
/* ✅ CORRECTO: Base móvil */
.component {
  /* Estilos móvil por defecto */
  font-size: var(--font-size-sm);
  padding: var(--space-sm);
}

/* ✅ CORRECTO: Tablet (min-width) */
@media (min-width: 768px) {
  .component {
    font-size: var(--font-size-base);
    padding: var(--space-md);
  }
}

/* ✅ CORRECTO: Desktop (min-width) */
@media (min-width: 1024px) {
  .component {
    font-size: var(--font-size-lg);
    padding: var(--space-lg);
  }
}

/* ❌ INCORRECTO: Desktop-first */
@media (max-width: 767px) {
  .component {
    /* Esto es un parche, no mobile-first */
  }
}
```

### Breakpoints Estándar Mobile-First
- **Base**: Móvil (320px - 767px) - ESTILOS POR DEFECTO
- **Tablet**: `@media (min-width: 768px)` 
- **Desktop**: `@media (min-width: 1024px)`
- **Large Desktop**: `@media (min-width: 1200px)`

### UX Mobile-First para Componentes
- **DataTable**: Cards en móvil, tabla en desktop
- **Navigation**: Hamburger menu en móvil, horizontal en desktop
- **Forms**: Stack vertical en móvil, grid en desktop
- **Modals**: Full-screen en móvil, centered en desktop


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

## Development Rules & Constraints

### Regla de Consistencia Global
- **OBLIGATORIO**: Buscar y revisar implementaciones existentes antes de escribir código nuevo
- **OBLIGATORIO**: Usar exactamente los mismos patrones que componentes similares (hooks, estados, procesamiento)
- **OBLIGATORIO**: Si hay diferencias entre componentes similares, normalizarlas para mantener consistencia
- **EJEMPLO CRÍTICO**: CreatePages (Movie, Series, Episodes) deben usar mismos hooks, misma estructura, mismo flujo

### Component Usage Rules
- **MANDATORY**: Only use components that have Storybook stories when building UI
- **MANDATORY**: Before using any component, verify it exists in Storybook by checking for a `.stories.jsx` file
- **MANDATORY**: All new components MUST have Storybook stories before they can be used elsewhere
- **MANDATORY**: SIEMPRE usar componentes del proyecto en lugar de elementos HTML nativos (usar Button en lugar de `<button>`, etc.)
- **MANDATORY**: Proponer nuevos componentes cuando sea necesario en lugar de crear elementos HTML customizados
- **FORBIDDEN**: Using third-party UI libraries or components not documented in Storybook
- **FORBIDDEN**: Creating custom styled HTML elements instead of using existing components
- **FORBIDDEN**: Usar elementos HTML nativos cuando existe un componente equivalente (button, input, select, etc.)

### Code Quality Enforcement
- **MANDATORY**: Run `npm run lint` before any commit
- **MANDATORY**: All components must follow atomic design pattern
- **MANDATORY**: Use named exports only: `export { ComponentName }`
- **MANDATORY**: CSS variables must be used: `var(--color-primary)`, `var(--space-md)`
- **FORBIDDEN**: Inline styles or style objects in JSX
- **FORBIDDEN**: Default exports

### Component Development Process
1. Create component in appropriate atomic design folder
2. Create `.jsx`, `.css`, and `.stories.jsx` files
3. Add component to Storybook with proper stories
4. Test component in Storybook before using in pages
5. Only then use component in other parts of the application

### Pre-Development Checks
- Always check existing components in `frontend/app/src/components/` before creating new ones
- Review Storybook at http://localhost:6006 to see available components
- Verify component has required stories before using it

### Service Layer Rules
- **MANDATORY**: Organize services by domain in separate folders (Auth, Movies, Users, etc.)
- **MANDATORY**: Use `actionResourceService.js` naming pattern (e.g., `createMovieService.js`)
- **MANDATORY**: All services must return structured format: `{ success, data, error, message }`
- **MANDATORY**: Include proper error handling with user-friendly messages
- **FORBIDDEN**: Direct API calls from components - always use service layer

### Context & State Management Rules
- **MANDATORY**: Use custom hooks like `useAuth()`, `useUsers()` with context validation
- **MANDATORY**: Include loading states for all async operations
- **MANDATORY**: Separate contexts by domain (UserAuthContext, UsersContext, etc.)
- **FORBIDDEN**: Using contexts without proper validation hooks

### CSS & Styling Rules
- **MANDATORY**: Use BEM methodology: `.block__element--modifier`
- **MANDATORY**: CSS classes must start with component name as prefix
- **MANDATORY**: Use design system variables for all colors, spacing, and sizes
- **FORBIDDEN**: Hardcoded values in CSS - use `var(--variable-name)`
- **FORBIDDEN**: Inline styles or style objects in JSX

### Import/Export Organization
- **MANDATORY**: Import order: React first → Components by atomic level → CSS last
- **MANDATORY**: Use function declarations followed by named exports
- **MANDATORY**: Group imports logically with blank lines between groups
- **FORBIDDEN**: Default exports anywhere in the project

### File & Folder Structure Rules
- **MANDATORY**: Component folder structure: `ComponentName/ComponentName.jsx`, `.css`, `.stories.jsx`
- **MANDATORY**: Use PascalCase for component folders and files
- **MANDATORY**: Admin pages must end with `Page` suffix (e.g., `UsersListPage`)
- **MANDATORY**: Use absolute paths starting from project root
- **FORBIDDEN**: Relative paths for imports

### Backend API Rules
- **MANDATORY**: Follow RESTful conventions with standard HTTP methods
- **MANDATORY**: Middleware order: Authentication → Authorization → Validation → Handler
- **MANDATORY**: All routes must use `authenticateJwt` except public endpoints
- **MANDATORY**: Use `checkRoles` middleware for admin routes
- **MANDATORY**: Include JSDoc documentation for all endpoints

### Error Handling Standards
- **MANDATORY**: Use structured error responses with consistent format
- **MANDATORY**: Convert technical errors to user-readable messages
- **MANDATORY**: Handle common HTTP status codes (400, 401, 403, 409, 413, 500)
- **FORBIDDEN**: Exposing raw error messages to users

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