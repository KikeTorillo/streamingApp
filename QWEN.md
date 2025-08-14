# StreamingApp - Qwen Code Context

Este documento proporciona contexto para que Qwen Code pueda asistir de manera efectiva con el proyecto StreamingApp, una plataforma integral de streaming.

## Reglas Importantes

### Principio de Consistencia
- **FUNDAMENTAL**: SIEMPRE buscar y mantener la consistencia en el código.
- **OBLIGATORIO**: Antes de implementar cualquier funcionalidad, revisar cómo está implementada en componentes similares.
- **OBLIGATORIO**: Seguir exactamente los mismísimos patrones, estructura y flujo que componentes existentes.
- **OBLIGATORIO**: Si hay diferencias, investigar el motivo antes de crear inconsistencias.

### Idioma
- **OBLIGATORIO**: Todos los comentarios, mensajes de commit, documentación y comunicación con el usuario DEBEN ser en ESPAÑOL.
- **OBLIGATORIO**: Variables, funciones y nombres de archivos pueden estar en inglés (convención técnica).
- **OBLIGATORIO**: Logs de debugging y mensajes de error deben estar en español.
- **PROHIBIDO**: Responder en inglés al usuario mexicano.

## Visión General del Proyecto

StreamingApp es una plataforma completa de streaming de medios construida con tecnologías modernas. Sus características principales son:

- **Backend**: Node.js con Express
- **Frontend**: React con Vite
- **Biblioteca de Componentes**: Storybook para desarrollo de UI
- **Infraestructura**: Docker Compose para orquestación
- **Base de Datos**: PostgreSQL
- **Almacenamiento**: Almacenamiento compatible con S3 de MinIO
- **Entrega de Contenido**: CDN personalizado con NGINX
- **Procesamiento de Video**: Transcodificación basada en FFmpeg

## Tecnologías Utilizadas

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL (`pg` driver)
- **Autenticación**: JWT (`jsonwebtoken`), Passport.js
- **Validación**: Joi
- **Cliente de Almacenamiento**: MinIO JavaScript SDK
- **Procesamiento de Video**: FFmpeg (`ffmpeg-static`, `fluent-ffmpeg`)
- **Procesamiento de Imágenes**: Sharp
- **Documentación de API**: Swagger (`swagger-jsdoc`, `swagger-ui-express`)
- **Correo Electrónico**: Nodemailer
- **Registro**: Winston
- **Librerías de Utilidad**: axios, bcrypt, cors, cookie-parser, dotenv, moment, multer

### Frontend
- **Framework**: React (v18+)
- **Herramienta de Compilación**: Vite
- **Componentes UI**: Sistema de Diseño Atómico personalizado
- **Gestión de Estado**: React Context API
- **Enrutamiento**: React Router
- **Biblioteca de Componentes**: Storybook
- **Reproductor de Video**: Video.js con HLS.js
- **Utilidades UI**: @headlessui/react, react-icons, react-dropzone, react-easy-crop
- **Cliente HTTP**: axios
- **Estilizado**: CSS Modules, Variables CSS

### Infraestructura y DevOps
- **Contenerización**: Docker
- **Orquestación**: Docker Compose
- **GUI de Base de Datos**: pgAdmin
- **Almacenamiento**: MinIO
- **CDN**: NGINX
- **Monitoreo/Depuración**: Logs y estadísticas de Docker

## Arquitectura

La aplicación está estructurada como un monorepo con directorios separados para las aplicaciones backend y frontend.

### Arquitectura Backend (MVC)
- **Routes**: Manejo de endpoints API
- **Services**: Implementación de lógica de negocio
- **Middleware**: Autenticación, validación, manejo de errores
- **Schemas**: Validación de datos usando Joi
- **Utils**: Funciones de utilidad para autenticación, procesamiento de medios, almacenamiento, streaming
- **Config**: Configuración centralizada de entorno
- **Libs**: Integraciones de librerías externas (ej., pool de PostgreSQL)

### Arquitectura Frontend (Diseño Atómico)
- **Átomos**: Componentes UI básicos (Button, Input)
- **Moléculas**: Combinaciones de átomos (SearchBar, Card)
- **Organismos**: Secciones UI complejas (DataTable, Sidebar)
- **Plantillas**: Diseños de página
- **Páginas**: Vistas específicas de la aplicación
- **Hooks**: Hooks personalizados de React para estado y lógica
- **Servicios**: Capa de interacción con API
- **Contextos**: Gestión de estado global

### Arquitectura de Infraestructura
Los servicios están orquestados usando Docker Compose:
- **Desarrollo**: `docker-compose.local.yml`
- **Producción**: `docker-compose.yml`

Los servicios principales incluyen:
- `frontend`: Aplicación React
- `backend`: API Node.js
- `storybook`: Entorno de desarrollo de componentes
- `postgres`: Base de datos
- `pgadmin`: Administración de base de datos
- `minio`: Almacenamiento compatible con S3
- `cdn1`: Entrega de contenido
- `transcoder1`, `transcoder2`: Procesamiento de video

## Flujo de Trabajo de Desarrollo

### Configuración del Entorno
1. Copiar un archivo de entorno de ejemplo (por ejemplo, `.env.local.example`) a `.env` en el directorio raíz.
2. Configurar las variables de entorno requeridas, especialmente `VITE_TMDB_API_KEY`.
3. Usar `npm run dev:local` para iniciar el entorno de desarrollo.

### Comandos Clave de Desarrollo
- `npm run dev:local`: Iniciar el entorno completo de desarrollo local.
- `npm run prod`: Iniciar el entorno de producción.
- `npm run lint`: Ejecutar ESLint para verificaciones de calidad de código en frontend y backend.
- `npm run lint:fix`: Corregir automáticamente problemas de ESLint.
- `npm run build`: Compilar el frontend para producción.

### Acceso al Contenedor y Depuración
- `npm run logs:backend`: Ver registros del servicio backend.
- `npm run logs:frontend`: Ver registros del servicio frontend.
- `npm run shell:backend`: Acceder a la terminal del contenedor backend.
- `npm run shell:frontend`: Acceder a la terminal del contenedor frontend.
- `npm run monitor`: Monitorear el uso de recursos del contenedor.

## Configuración

Las variables de entorno se utilizan ampliamente para la configuración. Archivos clave:
- `.env.local.example`: Configuración de desarrollo local
- `.env.prod.example`: Configuración de producción

Las variables importantes incluyen credenciales de base de datos, secretos JWT, configuración de MinIO y clave API de TMDB.

## Pruebas

Las pruebas se gestionan por separado para frontend y backend dentro de sus respectivos directorios. El proyecto utiliza Vitest para pruebas de frontend.

## Compilación y Ejecución

### Prerrequisitos
- Docker y Docker Compose (recomendado)
- Node.js (v18+) y npm para desarrollo local

### Ejecución de la Aplicación
1. Configurar las variables de entorno en un archivo `.env`.
2. Ejecutar `npm run dev:local` para desarrollo local o `npm run prod` para producción.

## Convenciones de Desarrollo

### Estilo de Código
- Se utilizan ESLint y Prettier para formateo y linting de código.
- Se aplican convenciones específicas para exportaciones de componentes React y uso de variables CSS.

### Mensajes de Commit
- Se recomiendan commits convencionales.

### Desarrollo de Componentes
- Los componentes siguen los principios de Diseño Atómico.
- Todos los componentes deben tener historias en Storybook.

### Diseño de API Backend
- Diseño de API RESTful.
- Autenticación basada en JWT con control de acceso basado en roles.
- Documentación completa de API a través de Swagger en `/api-docs`.

### Procesamiento de Archivos
- Los archivos de video se procesan usando FFmpeg.
- Los archivos se almacenan en MinIO.
- Se utiliza hashing SHA256 para detectar cargas duplicadas.

## Principio de Simplicidad

**REGLA DE ORO**: SIEMPRE PRIORIZAR LA SIMPLICIDAD
- **KISS (Keep It Simple, Stupid)**: La solución más simple es generalmente la correcta
- **Evitar over-engineering**: No crear complejidad innecesaria
- **Lógica directa**: Preferir código claro sobre código "inteligente"
- **Una responsabilidad**: Cada función/componente debe hacer una sola cosa bien
- **Depuración fácil**: Si es difícil de depurar, probablemente es muy complejo

## Convenciones de Nomenclatura (Frontend ↔ Backend)

### **REGLA FUNDAMENTAL**: camelCase en Frontend/Backend, snake_case solo en DB

**PATRÓN OBLIGATORIO** del proyecto:
1. **Frontend → Backend**: **camelCase** (`playbackRate`, `preferredLanguage`, `subtitlesEnabled`)
2. **Esquemas Joi**: **camelCase** (valida la entrada del API)
3. **Lógica de Servicio**: **Mapeo automático** camelCase → snake_case para DB
4. **Base de Datos**: **snake_case** (`playback_rate`, `preferred_language`, `subtitles_enabled`)

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
- **Esquemas Joi**: `/backend/app/schemas/*` - **camelCase**
- **Mapeo de Servicio**: `/backend/app/services/*Service.js` - **objeto fieldMapping**
- **Servicios Frontend**: `/frontend/app/src/services/*` - **camelCase**
- **Hooks React**: `/frontend/app/src/hooks/*` - **camelCase**

**❌ PROHIBIDO**: Usar snake_case en frontend o mezclar convenciones

## Herramientas de Base de Datos

### pg-kik - Herramienta de Consulta PostgreSQL
- **OBLIGATORIO**: Usar `pg-kik` para TODAS las consultas PostgreSQL cuando el usuario pregunte sobre datos
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