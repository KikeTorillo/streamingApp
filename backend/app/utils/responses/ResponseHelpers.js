/**
 * @file ResponseHelpers.js
 * @description Helpers para respuestas API estandarizadas y consistentes
 * en toda la aplicación. Proporciona formatos homologados para éxito,
 * error, paginación y metadata.
 * 
 * BENEFICIOS:
 * - Respuestas consistentes en toda la API
 * - Metadata automática (timestamps, versión, etc.)
 * - Soporte para paginación estandarizada
 * - Headers HTTP apropiados
 * - Logging automático de respuestas
 */

const { ERROR_MESSAGES } = require('../../constants/ErrorMessages');
const logger = require('../logging/Logger');

/**
 * Clase con helpers estáticos para respuestas API
 */
class ResponseHelpers {
  /**
   * Respuesta de éxito estándar
   * @param {Object} res - Objeto de respuesta Express
   * @param {any} data - Datos a devolver
   * @param {string} message - Mensaje de éxito opcional
   * @param {Object} metadata - Metadata adicional
   * @param {number} statusCode - Código de estado (default: 200)
   */
  static success(res, data = null, message = null, metadata = {}, statusCode = 200) {
    const response = {
      success: true,
      message: message || 'Operación realizada exitosamente',
      data: data,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    // Headers estándar
    res.set({
      'X-Response-Time': new Date().toISOString(),
      'X-API-Version': '1.0.0'
    });

    // Log de respuesta exitosa (solo en desarrollo para evitar spam)
    if (process.env.NODE_ENV === 'development' && statusCode === 201) {
      logger.info(`Success Response: ${res.req.method} ${res.req.originalUrl}`, {
        statusCode,
        dataType: Array.isArray(data) ? 'array' : typeof data,
        dataCount: Array.isArray(data) ? data.length : null
      });
    }

    res.status(statusCode).json(response);
  }

  /**
   * Respuesta de éxito para operaciones de creación
   * @param {Object} res - Objeto de respuesta Express
   * @param {any} data - Datos del recurso creado
   * @param {string} resourceType - Tipo de recurso creado
   * @param {Object} metadata - Metadata adicional
   */
  static created(res, data, resourceType = 'recurso', metadata = {}) {
    const message = ERROR_MESSAGES.SUCCESS[`${resourceType.toUpperCase()}_CREATED`] || 
                   `${resourceType} creado exitosamente`;
    
    this.success(res, data, message, {
      ...metadata,
      operation: 'create',
      resourceType: resourceType.toLowerCase()
    }, 201);
  }

  /**
   * Respuesta de éxito para operaciones de actualización
   * @param {Object} res - Objeto de respuesta Express
   * @param {any} data - Datos del recurso actualizado
   * @param {string} resourceType - Tipo de recurso actualizado
   * @param {Object} metadata - Metadata adicional
   */
  static updated(res, data, resourceType = 'recurso', metadata = {}) {
    const message = ERROR_MESSAGES.SUCCESS[`${resourceType.toUpperCase()}_UPDATED`] || 
                   `${resourceType} actualizado exitosamente`;
    
    this.success(res, data, message, {
      ...metadata,
      operation: 'update',
      resourceType: resourceType.toLowerCase()
    });
  }

  /**
   * Respuesta de éxito para operaciones de eliminación
   * @param {Object} res - Objeto de respuesta Express
   * @param {string} resourceType - Tipo de recurso eliminado
   * @param {string|number} resourceId - ID del recurso eliminado
   * @param {Object} metadata - Metadata adicional
   */
  static deleted(res, resourceType = 'recurso', resourceId = null, metadata = {}) {
    const message = ERROR_MESSAGES.SUCCESS[`${resourceType.toUpperCase()}_DELETED`] || 
                   `${resourceType} eliminado exitosamente`;
    
    this.success(res, { deletedId: resourceId }, message, {
      ...metadata,
      operation: 'delete',
      resourceType: resourceType.toLowerCase(),
      resourceId
    });
  }

  /**
   * Respuesta con paginación estándar
   * @param {Object} res - Objeto de respuesta Express
   * @param {Array} data - Datos paginados
   * @param {Object} pagination - Información de paginación
   * @param {string} message - Mensaje opcional
   * @param {Object} metadata - Metadata adicional
   */
  static paginated(res, data, pagination, message = null, metadata = {}) {
    const {
      page = 1,
      limit = 20,
      total = 0,
      totalPages = 0
    } = pagination;

    const response = {
      success: true,
      message: message || 'Datos obtenidos exitosamente',
      data: data,
      pagination: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalItems: parseInt(total),
        totalPages: parseInt(totalPages),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? parseInt(page) + 1 : null,
        prevPage: page > 1 ? parseInt(page) - 1 : null
      },
      timestamp: new Date().toISOString(),
      ...metadata
    };

    // Headers de paginación
    res.set({
      'X-Total-Count': total.toString(),
      'X-Total-Pages': totalPages.toString(),
      'X-Current-Page': page.toString(),
      'X-Items-Per-Page': limit.toString()
    });

    res.json(response);
  }

  /**
   * Respuesta de lista sin paginación
   * @param {Object} res - Objeto de respuesta Express
   * @param {Array} data - Array de datos
   * @param {string} resourceType - Tipo de recurso
   * @param {Object} metadata - Metadata adicional
   */
  static list(res, data, resourceType = 'elementos', metadata = {}) {
    const count = Array.isArray(data) ? data.length : 0;
    
    this.success(res, data, `Lista de ${resourceType} obtenida exitosamente`, {
      ...metadata,
      count,
      resourceType: resourceType.toLowerCase(),
      operation: 'list'
    });
  }

  /**
   * Respuesta para un recurso individual
   * @param {Object} res - Objeto de respuesta Express
   * @param {any} data - Datos del recurso
   * @param {string} resourceType - Tipo de recurso
   * @param {Object} metadata - Metadata adicional
   */
  static single(res, data, resourceType = 'elemento', metadata = {}) {
    this.success(res, data, `${resourceType} obtenido exitosamente`, {
      ...metadata,
      resourceType: resourceType.toLowerCase(),
      operation: 'get'
    });
  }

  /**
   * Respuesta vacía exitosa (para endpoints que no devuelven datos)
   * @param {Object} res - Objeto de respuesta Express
   * @param {string} message - Mensaje de éxito
   * @param {Object} metadata - Metadata adicional
   */
  static noContent(res, message = 'Operación completada exitosamente', metadata = {}) {
    res.set({
      'X-Response-Time': new Date().toISOString(),
      'X-API-Version': '1.0.0'
    });

    res.status(204).json({
      success: true,
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }

  /**
   * Respuesta para operaciones de archivo/upload
   * @param {Object} res - Objeto de respuesta Express
   * @param {Object} fileInfo - Información del archivo
   * @param {string} operation - Tipo de operación (upload, delete, etc.)
   * @param {Object} metadata - Metadata adicional
   */
  static file(res, fileInfo, operation = 'upload', metadata = {}) {
    const operationMessages = {
      upload: 'Archivo subido exitosamente',
      delete: 'Archivo eliminado exitosamente',
      process: 'Archivo procesado exitosamente',
      transcode: 'Archivo transcodificado exitosamente'
    };

    this.success(res, fileInfo, operationMessages[operation] || 'Operación de archivo completada', {
      ...metadata,
      operation: `file_${operation}`,
      fileType: fileInfo?.mimetype || 'unknown',
      fileSize: fileInfo?.size || 0
    });
  }

  /**
   * Respuesta para operaciones de autenticación
   * @param {Object} res - Objeto de respuesta Express
   * @param {Object} authData - Datos de autenticación (sin token por seguridad)
   * @param {string} operation - Tipo de operación (login, logout, register, etc.)
   * @param {Object} metadata - Metadata adicional
   */
  static auth(res, authData, operation = 'login', metadata = {}) {
    const operationMessages = {
      login: ERROR_MESSAGES.SUCCESS.LOGIN_SUCCESS,
      logout: ERROR_MESSAGES.SUCCESS.LOGOUT_SUCCESS,
      register: ERROR_MESSAGES.SUCCESS.USER_CREATED,
      password_change: ERROR_MESSAGES.SUCCESS.PASSWORD_CHANGED,
      email_sent: ERROR_MESSAGES.SUCCESS.EMAIL_SENT
    };

    // Log de seguridad
    logger.security(`Auth operation: ${operation}`, {
      userId: authData?.id || authData?.sub,
      operation,
      ...metadata
    });

    this.success(res, authData, operationMessages[operation] || 'Operación de autenticación exitosa', {
      ...metadata,
      operation: `auth_${operation}`
    });
  }

  /**
   * Respuesta de error personalizada (para casos especiales)
   * Nota: En general se debe usar ErrorFactory, este método es para casos excepcionales
   * @param {Object} res - Objeto de respuesta Express
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código de estado HTTP
   * @param {string} errorCode - Código de error interno
   * @param {Object} details - Detalles adicionales del error
   */
  static error(res, message, statusCode = 500, errorCode = 'CUSTOM_ERROR', details = {}) {
    const response = {
      success: false,
      error: this._getErrorTypeFromStatus(statusCode),
      message,
      statusCode,
      errorCode,
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
      method: res.req.method,
      ...details
    };

    res.set({
      'X-Error-Code': errorCode,
      'X-Error-Timestamp': response.timestamp
    });

    res.status(statusCode).json(response);
  }

  /**
   * Helper para obtener tipo de error basado en status code
   * @param {number} statusCode - Código de estado HTTP
   * @returns {string} Tipo de error
   */
  static _getErrorTypeFromStatus(statusCode) {
    if (statusCode >= 500) return 'Internal Server Error';
    if (statusCode >= 400) return 'Client Error';
    return 'Unknown Error';
  }

  /**
   * Middleware para agregar helpers a todas las respuestas
   * Uso: app.use(ResponseHelpers.middleware);
   */
  static middleware(req, res, next) {
    // Agregar métodos helper directamente al objeto res
    res.success = (data, message, metadata, statusCode) => 
      ResponseHelpers.success(res, data, message, metadata, statusCode);
    
    res.created = (data, resourceType, metadata) => 
      ResponseHelpers.created(res, data, resourceType, metadata);
    
    res.updated = (data, resourceType, metadata) => 
      ResponseHelpers.updated(res, data, resourceType, metadata);
    
    res.deleted = (resourceType, resourceId, metadata) => 
      ResponseHelpers.deleted(res, resourceType, resourceId, metadata);
    
    res.paginated = (data, pagination, message, metadata) => 
      ResponseHelpers.paginated(res, data, pagination, message, metadata);
    
    res.list = (data, resourceType, metadata) => 
      ResponseHelpers.list(res, data, resourceType, metadata);
    
    res.single = (data, resourceType, metadata) => 
      ResponseHelpers.single(res, data, resourceType, metadata);
    
    res.noContent = (message, metadata) => 
      ResponseHelpers.noContent(res, message, metadata);
    
    res.file = (fileInfo, operation, metadata) => 
      ResponseHelpers.file(res, fileInfo, operation, metadata);
    
    res.auth = (authData, operation, metadata) => 
      ResponseHelpers.auth(res, authData, operation, metadata);

    next();
  }
}

module.exports = ResponseHelpers;