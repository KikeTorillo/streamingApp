# 📚 Documentación del Backend - Streaming App

## 🎯 Bienvenida

Esta es la documentación completa del backend de la **Streaming App**, un sistema de streaming de video construido con **Node.js**, **Express**, **PostgreSQL** y **MinIO**.

## 📖 Índice de Documentación

### 🚀 **Fase 1: Documentación Técnica Fundamental** ✅

#### 1. **[📋 Swagger UI - Documentación Interactiva](http://localhost:3000/api-docs/)**
Documentación completa e interactiva de todos los endpoints de la API REST.

**🚀 Acceso directo:** http://localhost:3000/api-docs/

**Contenido:**
- ✅ **40+ endpoints documentados** con ejemplos completos
- ✅ **Interfaz interactiva** para probar endpoints directamente
- ✅ **Esquemas de request/response** para cada endpoint  
- ✅ **Códigos de error estandarizados** con descripciones
- ✅ **Sistema de autenticación JWT** integrado
- ✅ **Roles y permisos** por endpoint
- ✅ **Ejemplos en vivo** y testeo directo

**Secciones principales:**
- 🔐 Autenticación (`/auth/*`)
- 🎬 Películas (`/movies/*`)
- 📺 Series (`/series/*`) 
- 📼 Episodios (`/episodes/*`)
- 🏷️ Categorías (`/category/*`)
- 👤 Usuarios (`/users/*`)
- ⚙️ Preferencias (`/user-preferences/*`)

---

#### 2. **[🏗️ Architecture Guide](./ARCHITECTURE.md)**
Documentación completa de la arquitectura y patrones del sistema.

**Contenido:**
- ✅ **Arquitectura MVC** con diagramas Mermaid
- ✅ **Flujo de autenticación JWT + cookies** detallado
- ✅ **Patrón BaseService** y herencia de servicios
- ✅ **Sistema de middleware** y orden de ejecución
- ✅ **Esquema de base de datos** con relaciones
- ✅ **Pipeline de procesamiento** de archivos multimedia
- ✅ **Configuración de seguridad** y CORS
- ✅ **Arquitectura de deployment** con Docker

**Diagramas incluidos:**
- 📊 Flujo de Request/Response
- 🗃️ Esquema de Base de Datos (ERD)
- 🎬 Pipeline de Procesamiento de Media
- 🔐 Flujo de Autenticación
- 🏗️ Arquitectura de Servicios

---

## 🎯 **Próximas Fases**

### **Fase 2: Guías de Desarrollo** (Pendiente)
- [ ] **Database Schema Documentation** - Esquemas visuales y guías de migración
- [ ] **Service Layer Guide** - Patrones de desarrollo y mejores prácticas  
- [ ] **Testing Guide** - Estrategias de testing y ejemplos

### **Fase 3: Operaciones y Deployment** (Pendiente)
- [ ] **Environment Configuration** - Guía completa de variables de entorno
- [ ] **Docker & Production Setup** - Deployment y scaling
- [ ] **Monitoring & Logging** - Observabilidad y debugging

---

## 🔧 Cómo Usar Esta Documentación

### **Para Desarrolladores Frontend:**
1. Inicia con **[Swagger UI](http://localhost:3000/api-docs/)** para entender los endpoints
2. Revisa la sección de **Autenticación** para implementar login
3. Consulta los **esquemas de respuesta** para el tipado
4. **Prueba los endpoints** directamente desde el navegador

### **Para Desarrolladores Backend:**
1. Lee **[Architecture Guide](./ARCHITECTURE.md)** para entender la estructura
2. Estudia el **patrón BaseService** antes de crear nuevos servicios
3. Sigue las **convenciones de middleware** para nuevos endpoints

### **Para DevOps/Deployment:**
1. Consulta **Architecture Guide > Deployment** para la configuración Docker
2. Revisa las **variables de entorno** requeridas
3. Implementa **monitoring** según las especificaciones

### **Para QA/Testing:**
1. Usa **[Swagger UI](http://localhost:3000/api-docs/)** para entender casos de prueba
2. **Ejecuta pruebas manuales** directamente desde la interfaz
3. Consulta **códigos de error** para validación
4. Verifica **roles y permisos** en cada endpoint

---

## 🚀 Quick Start

### Configuración Inicial
```bash
# 1. Instalar dependencias
cd backend/app
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Levantar servicios con Docker
cd ../..
npm run dev:local

# 4. Verificar que el backend esté funcionando
curl http://localhost:3000/api/v1/
# Respuesta: "Hola mi server en express"

# 5. Acceder a la documentación interactiva
# Abrir en navegador: http://localhost:3000/api-docs/
```

### Estructura de Desarrollo
```bash
backend/app/
├── 📂 routes/      # Controladores REST (MVC)
├── 📂 services/    # Lógica de negocio
├── 📂 middleware/  # Validación y seguridad
├── 📂 schemas/     # Validación Joi
├── 📂 utils/       # Utilidades (auth, media, storage)
└── 📂 config/      # Configuración centralizada
```

### Endpoints Principales
```bash
# Autenticación
POST /api/v1/auth/login
POST /api/v1/auth/logout

# Contenido
GET  /api/v1/movies
POST /api/v1/movies
GET  /api/v1/series
POST /api/v1/episodes

# Administración
GET  /api/v1/users
POST /api/v1/category
```

---

## 🛡️ Seguridad

### Consideraciones Importantes
- **JWT Tokens** almacenados en **HTTP-only cookies**
- **CORS** configurado para orígenes específicos
- **Validación Joi** en todos los endpoints
- **Roles de usuario** (`admin`, `editor`, `user`)
- **File upload** con validación de tipos MIME

### Variables Sensibles (NO commitear)
```env
JWT_SECRET=your-super-secret-key
DB_PASSWORD=secure-database-password  
MINIO_ROOT_PASSWORD=secure-storage-password
```

---

## 📊 Métricas del Proyecto

### Documentación Completada ✅
- **📋 API Reference:** 50+ endpoints documentados
- **🏗️ Architecture:** Diagramas y patrones completos
- **🔐 Security:** Autenticación y autorización
- **📁 File Processing:** Pipeline multimedia completo
- **🗃️ Database:** Esquema con 11 tablas + auditoría

### Cobertura de Funcionalidades
- ✅ **CRUD completo** para todos los recursos
- ✅ **Sistema de roles** y permisos granulares  
- ✅ **Procesamiento asíncrono** de archivos multimedia
- ✅ **Búsquedas avanzadas** con full-text search
- ✅ **Sistema de auditoría** automático
- ✅ **Preferencias de usuario** y progreso de visualización

---

## 🤝 Contribución

### Patrón de Desarrollo
1. **Consistencia:** Seguir los patrones existentes documentados
2. **Validación:** Usar esquemas Joi para toda entrada de datos
3. **Seguridad:** Implementar autenticación y autorización apropiadas
4. **Testing:** Escribir tests para nuevas funcionalidades
5. **Documentación:** Actualizar documentación con cambios

### Comandos de Desarrollo
```bash
# Linting (OBLIGATORIO antes de commits)
npm run lint
npm run lint:fix

# Desarrollo con hot reload
npm run dev

# Producción
npm run start
```

---

## 📞 Soporte

### Recursos Adicionales
- **[CLAUDE.md](../CLAUDE.md)** - Instrucciones para desarrollo con Claude
- **[README Principal](../readme.md)** - Configuración completa del proyecto
- **[Docker Compose](../docker-compose.local.yml)** - Configuración de servicios

### Problemas Comunes
- **CORS errors:** Verificar configuración en `config.js`
- **JWT expiration:** Tokens duran 24 horas, implementar refresh
- **File upload fails:** Verificar límites de tamaño y tipos MIME
- **Database connection:** Verificar variables de entorno PostgreSQL

---

**📝 Última actualización:** Enero 2025  
**🔄 Estado:** Fase 1 Completada ✅  
**👥 Mantenido por:** Equipo de Desarrollo

---

## 📋 Checklist de Documentación

### ✅ **Completado - Fase 1**
- [x] API Reference con 50+ endpoints
- [x] Códigos de error estandarizados  
- [x] Arquitectura MVC documentada
- [x] Flujo de autenticación JWT + cookies
- [x] Patrón BaseService y middleware
- [x] Diagramas de arquitectura (Mermaid)
- [x] Configuración de seguridad
- [x] Pipeline de procesamiento multimedia

### 🟡 **Pendiente - Fase 2**
- [ ] Guía detallada de esquemas de base de datos
- [ ] Patrones de desarrollo y mejores prácticas
- [ ] Guía de testing y ejemplos
- [ ] Migraciones de base de datos

### 🟡 **Pendiente - Fase 3**  
- [ ] Guía completa de deployment
- [ ] Configuración de monitoring y logging
- [ ] Guía de escalabilidad y performance
- [ ] Integración con servicios externos

---

Esta documentación es un **trabajo vivo** que debe actualizarse con cada cambio significativo en el backend. Mantener la documentación actualizada es responsabilidad de todo el equipo de desarrollo.