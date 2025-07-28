# 🔥 Sistema de Manejo de Errores Centralizado

## 📋 Descripción General

Este documento describe el sistema centralizado de manejo de errores implementado en el backend de Streaming App. El sistema proporciona errores homologados en español, logging estructurado y debugging eficiente.

---

## 🎯 Componentes del Sistema

### 1. **ErrorMessages.js** - Diccionario de Mensajes
- **Ubicación**: `backend/app/constants/ErrorMessages.js`
- **Propósito**: Centralizar todos los mensajes de error en español
- **Categorías**: AUTH, VALIDATION, USERS, MOVIES, SERIES, EPISODES, etc.

```javascript
const { ERROR_MESSAGES } = require('../constants/ErrorMessages');
console.log(ERROR_MESSAGES.AUTH.USER_NOT_FOUND); // "Usuario no encontrado"
```

### 2. **ErrorFactory.js** - Fábrica de Errores
- **Ubicación**: `backend/app/utils/errors/ErrorFactory.js`
- **Propósito**: Crear errores consistentes con contexto enriquecido
- **Integración**: Compatible con `@hapi/boom`

```javascript
const ErrorFactory = require('../utils/errors/ErrorFactory');

// Error 404 con contexto
throw ErrorFactory.notFound('USERS', userId, { operation: 'getUserById' });

// Error de validación
throw ErrorFactory.badRequest('INVALID_EMAIL', { email: 'invalid-email' });
```

### 3. **Logger.js** - Sistema de Logging
- **Ubicación**: `backend/app/utils/logging/Logger.js`
- **Propósito**: Logging estructurado con Winston
- **Características**: Logs por entorno, rotación de archivos, contexto automático

```javascript
const logger = require('../utils/logging/Logger');

logger.info('Usuario creado exitosamente', { userId: 123 });
logger.error('Error en base de datos', error);
logger.security('failed_login_attempt', { userId, ip });
```

### 4. **ResponseHelpers.js** - Respuestas Estandarizadas
- **Ubicación**: `backend/app/utils/responses/ResponseHelpers.js`
- **Propósito**: API responses consistentes
- **Métodos**: success, created, updated, deleted, paginated, etc.

```javascript
const ResponseHelpers = require('../utils/responses/ResponseHelpers');

// Respuesta de éxito
ResponseHelpers.success(res, userData, 'Usuario obtenido exitosamente');

// Respuesta con paginación
ResponseHelpers.paginated(res, users, { page: 1, limit: 20, total: 100 });
```

### 5. **BaseService.js** - Servicio Base Mejorado
- **Ubicación**: `backend/app/services/BaseService.js`
- **Propósito**: Funcionalidades comunes con error handling
- **Métodos**: executeQuery, withTransaction, handleDatabaseError, etc.

---

## 🛠️ Guía de Uso

### Para Servicios (Services)

```javascript
const ErrorFactory = require('../utils/errors/ErrorFactory');
const logger = require('../utils/logging/Logger');
const BaseService = require('./BaseService');

class UsersService extends BaseService {
  constructor() {
    super('UsersService'); // Nombre del servicio para logging
  }

  async findOne(id) {
    try {
      // Validar ID
      const validId = this.validateId(id, 'usuario');
      
      // Ejecutar query con logging automático
      const result = await this.executeQuery(
        'SELECT * FROM users WHERE id = $1',
        [validId],
        'find_user_by_id'
      );

      // Validar que el recurso exista
      const user = this.validateResourceExists(
        result.rows[0], 
        'USERS', 
        validId
      );

      return user;
      
    } catch (error) {
      // Los errores de BaseService ya están manejados
      if (error.isBoom) throw error;
      
      // Error inesperado
      throw ErrorFactory.internal('FIND_USER', error, { id });
    }
  }
}
```

### Para Controladores (Routes)

```javascript
const ResponseHelpers = require('../utils/responses/ResponseHelpers');
const ErrorFactory = require('../utils/errors/ErrorFactory');

router.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await usersService.findOne(id);
    
    // Respuesta estandarizada
    ResponseHelpers.single(res, user, 'usuario');
    
  } catch (error) {
    next(error); // El middleware de errores se encarga del resto
  }
});
```

### Para Middleware de Validación

```javascript
const ErrorFactory = require('../utils/errors/ErrorFactory');

function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    
    if (error) {
      // Usar ErrorFactory para errores de validación
      const validationError = ErrorFactory.validationError(error, {
        property,
        originalData: data
      });
      return next(validationError);
    }
    
    next();
  };
}
```

---

## 📊 Tipos de Errores Disponibles

### 1. **Errores de Autenticación (401)**
```javascript
ErrorFactory.unauthorized('USER_NOT_FOUND', { userName });
ErrorFactory.unauthorized('INVALID_PASSWORD', { userName });
ErrorFactory.unauthorized('TOKEN_EXPIRED');
```

### 2. **Errores de Validación (400)**
```javascript
ErrorFactory.badRequest('INVALID_EMAIL', { email });
ErrorFactory.validationError(joiError, { field: 'user_name' });
```

### 3. **Errores de Recurso No Encontrado (404)**
```javascript
ErrorFactory.notFound('USERS', userId);
ErrorFactory.notFound('MOVIES', movieId);
```

### 4. **Errores de Conflicto (409)**
```javascript
ErrorFactory.conflict('USERS', 'email', userEmail);
ErrorFactory.conflict('MOVIES', 'title', movieTitle);
```

### 5. **Errores Internos (500)**
```javascript
ErrorFactory.internal('DATABASE_OPERATION', originalError, context);
ErrorFactory.databaseError('INSERT_USER', pgError, context);
```

### 6. **Errores de Archivos**
```javascript
ErrorFactory.fileError('UPLOAD_FAILED', filename, originalError);
ErrorFactory.fileError('INVALID_FORMAT', filename);
```

---

## 🎨 Formato de Respuestas de Error

### Estructura Estándar
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "El correo electrónico no es válido",
  "statusCode": 400,
  "errorCode": "VALIDATION.INVALID_EMAIL",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/v1/users",
  "method": "POST",
  "validationErrors": [
    {
      "field": "email",
      "message": "El correo electrónico no es válido",
      "value": "invalid-email",
      "type": "string.email"
    }
  ]
}
```

### Headers de Error
```
X-Error-Code: VALIDATION.INVALID_EMAIL
X-Error-Timestamp: 2024-01-01T12:00:00.000Z
```

---

## 📈 Sistema de Logging

### Niveles de Log
- **ERROR**: Errores que requieren atención
- **WARN**: Advertencias (ej: intentos de login fallidos)
- **INFO**: Información general de operaciones
- **DEBUG**: Información detallada (solo en desarrollo)

### Logs Estructurados
```json
{
  "level": "ERROR",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "message": "Error de autenticación",
  "errorCode": "AUTH.INVALID_PASSWORD",
  "statusCode": 401,
  "service": "AuthService",
  "request": {
    "method": "POST",
    "url": "/api/v1/auth/login",
    "ip": "192.168.1.1",
    "userId": "anonymous"
  },
  "context": {
    "userName": "john_doe",
    "operation": "user_authentication"
  }
}
```

### Logs de Seguridad
```javascript
logger.security('failed_login_attempt', {
  userId: user.id,
  userName,
  ip: req.ip,
  reason: 'invalid_password'
});
```

---

## 🔧 Configuración e Instalación

### 1. Instalar Dependencias
```bash
npm install winston @hapi/boom
```

### 2. Configurar en index.js
```javascript
// Importar middleware de errores mejorado
const { logErrors, boomErrorHandler, errorHandler } = require('./middleware/errorHandler');

// Usar middleware de respuestas (opcional)
const ResponseHelpers = require('./utils/responses/ResponseHelpers');
app.use(ResponseHelpers.middleware);

// Configurar middleware de errores (DEBE ir al final)
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
```

### 3. Actualizar Servicios Existentes
```javascript
// Cambiar de boom directo a ErrorFactory
// ANTES:
throw boom.notFound('Usuario no encontrado');

// DESPUÉS:
throw ErrorFactory.notFound('USERS', userId, { operation: 'findUser' });
```

---

## 📋 Mejores Prácticas

### ✅ **DO - Hacer**

1. **Usar ErrorFactory** para todos los errores
2. **Incluir contexto** relevante en los errores
3. **Validar IDs** con `BaseService.validateId()`
4. **Logear eventos de seguridad** (login, logout, cambios de password)
5. **Usar transacciones** con `BaseService.withTransaction()`
6. **Respuestas consistentes** con `ResponseHelpers`

### ❌ **DON'T - No Hacer**

1. **NO usar `boom` directamente** - usar ErrorFactory
2. **NO hacer `console.log`** - usar el logger estructurado
3. **NO exponer información sensible** en errores de producción
4. **NO ignorar errores** - siempre manejarlos apropiadamente
5. **NO crear mensajes de error inline** - usar ErrorMessages.js

---

## 🚀 Beneficios del Sistema

### 🎯 **Para Desarrollo**
- Debugging más eficiente con logs estructurados
- Errores consistentes en toda la aplicación
- Contexto completo para resolver problemas
- Desarrollo más rápido con helpers reutilizables

### 🛡️ **Para Seguridad**
- Logging de eventos de seguridad
- Información sensible oculta en producción
- Tracking de intentos de acceso fallidos
- Headers de error para análisis

### 👥 **Para Usuarios**
- Mensajes de error claros en español
- Respuestas consistentes en toda la API
- Mejor experiencia de usuario
- Información útil para resolver problemas

### 📊 **Para Monitoreo**
- Métricas de errores automáticas
- Logs estructurados para análisis
- Tracking de performance de queries
- Información para alertas automáticas

---

## 🔄 Migración desde Sistema Anterior

### Paso 1: Reemplazar boom directo
```javascript
// ANTES
throw boom.notFound('Usuario no encontrado');

// DESPUÉS  
throw ErrorFactory.notFound('USERS', userId);
```

### Paso 2: Agregar logging estructurado
```javascript
// ANTES
console.log('Usuario creado:', user);

// DESPUÉS
logger.info('Usuario creado exitosamente', { userId: user.id });
```

### Paso 3: Usar respuestas estandarizadas
```javascript
// ANTES
res.status(200).json({ user });

// DESPUÉS
ResponseHelpers.single(res, user, 'usuario');
```

---

## 📞 Soporte y Troubleshooting

### Debugging de Errores
1. **Revisar logs estructurados** en consola/archivos
2. **Verificar errorCode** en respuesta de API
3. **Examinar contexto** en logs de error
4. **Usar métricas de errores** para patrones

### Logs de Archivos (Producción)
- `logs/app.log` - Logs generales (info+)
- `logs/errors.log` - Solo errores
- `logs/combined.log` - Todos los logs

### Endpoint de Métricas
```
GET /api/v1/system/error-metrics
```

---

## ✅ Checklist de Implementación

- [x] ErrorMessages.js creado y poblado
- [x] ErrorFactory.js implementado
- [x] Logger.js configurado con Winston
- [x] ResponseHelpers.js creado
- [x] BaseService.js mejorado con error handling
- [x] errorHandler.js actualizado
- [x] Ejemplo de refactorización en AuthService
- [x] Documentación completa creada
- [ ] Migrar servicios restantes (MoviesService, SeriesService, etc.)
- [ ] Agregar tests unitarios para sistema de errores
- [ ] Configurar alertas de monitoreo basadas en logs
- [ ] Implementar dashboard de métricas de errores

---

## 📚 Referencias Adicionales

- [Winston Logger Documentation](https://github.com/winstonjs/winston)
- [Boom Error Library](https://hapi.dev/module/boom/)
- [PostgreSQL Error Codes](https://www.postgresql.org/docs/current/errcodes-appendix.html)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

*Última actualización: 2024-01-01*
*Versión del sistema: 1.0.0*