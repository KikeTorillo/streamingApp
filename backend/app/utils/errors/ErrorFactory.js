/**
 * @file ErrorFactory.js
 * @description Factory centralizado para crear errores consistentes y estructurados
 * en toda la aplicación. Integra con @hapi/boom y el sistema de mensajes.
 * 
 * BENEFICIOS:
 * - Errores homologados en toda la app
 * - Logging automático con contexto
 * - Mensajes en español consistentes
 * - Fácil debugging y monitoreo
 * - Stack traces enriquecidos
 */

const boom = require('@hapi/boom');
const { ERROR_MESSAGES, getErrorMessage, getValidationMessage } = require('../../constants/ErrorMessages');

/**
 * Clase factory para crear errores estandarizados
 */
class ErrorFactory {
  /**
   * Crea un error de autenticación (401)
   * @param {string} messageKey - Clave del mensaje en ERROR_MESSAGES.AUTH
   * @param {Object} context - Contexto adicional para debugging
   * @param {Object} replacements - Reemplazos dinámicos para el mensaje
   * @returns {Error} Error boom formateado
   */
  static unauthorized(messageKey = 'UNAUTHORIZED', context = {}, replacements = {}) {
    const message = getErrorMessage('AUTH', messageKey, replacements);
    const error = boom.unauthorized(message);
    
    // Agregar contexto para debugging
    error.output.payload.context = context;
    error.output.payload.errorCode = `AUTH.${messageKey}`;
    error.output.payload.timestamp = new Date().toISOString();
    
    return error;
  }

  /**
   * Crea un error de validación (400)
   * @param {string} messageKey - Clave del mensaje en ERROR_MESSAGES.VALIDATION
   * @param {Object} validationDetails - Detalles específicos de validación
   * @param {Object} context - Contexto adicional
   * @returns {Error} Error boom formateado
   */
  static badRequest(messageKey = 'INVALID_FORMAT', validationDetails = {}, context = {}) {
    const message = getErrorMessage('VALIDATION', messageKey);
    const error = boom.badRequest(message);
    
    error.output.payload.context = context;
    error.output.payload.errorCode = `VALIDATION.${messageKey}`;
    error.output.payload.timestamp = new Date().toISOString();
    error.output.payload.validationDetails = validationDetails;
    
    return error;
  }

  /**
   * Crea un error de recurso no encontrado (404)
   * @param {string} resource - Tipo de recurso ('USERS', 'MOVIES', 'SERIES', etc.)
   * @param {string|number} resourceId - ID del recurso no encontrado
   * @param {Object} context - Contexto adicional
   * @returns {Error} Error boom formateado
   */
  static notFound(resource = 'USERS', resourceId = null, context = {}) {
    const message = getErrorMessage(resource, 'NOT_FOUND');
    const error = boom.notFound(message);
    
    error.output.payload.context = { ...context, resourceId };
    error.output.payload.errorCode = `${resource}.NOT_FOUND`;
    error.output.payload.timestamp = new Date().toISOString();
    error.output.payload.resource = resource.toLowerCase();
    
    return error;
  }

  /**
   * Crea un error de conflicto/duplicado (409)
   * @param {string} resource - Tipo de recurso
   * @param {string} conflictField - Campo que genera el conflicto
   * @param {any} conflictValue - Valor que genera el conflicto
   * @param {Object} context - Contexto adicional
   * @returns {Error} Error boom formateado
   */
  static conflict(resource = 'USERS', conflictField = 'email', conflictValue = null, context = {}) {
    // Mapear campos comunes a mensajes específicos
    const conflictMessages = {
      email: getErrorMessage('USERS', 'EMAIL_EXISTS'),
      user_name: getErrorMessage('USERS', 'USERNAME_EXISTS'),
      title: getErrorMessage(resource, 'TITLE_EXISTS'),
      name: getErrorMessage(resource, 'NAME_EXISTS')
    };

    const message = conflictMessages[conflictField] || 
                   getErrorMessage('DATABASE', 'DUPLICATE_ENTRY');
    
    const error = boom.conflict(message);
    
    error.output.payload.context = { ...context, conflictField, conflictValue };
    error.output.payload.errorCode = `${resource}.CONFLICT`;
    error.output.payload.timestamp = new Date().toISOString();
    error.output.payload.conflictDetails = { field: conflictField, value: conflictValue };
    
    return error;
  }

  /**
   * Crea un error interno del servidor (500)
   * @param {string} operation - Operación que falló
   * @param {Error} originalError - Error original capturado
   * @param {Object} context - Contexto adicional
   * @returns {Error} Error boom formateado
   */
  static internal(operation = 'UNKNOWN_OPERATION', originalError = null, context = {}) {
    const message = getErrorMessage('SYSTEM', 'INTERNAL_ERROR');
    const error = boom.internal(message);
    
    error.output.payload.context = { 
      ...context, 
      operation,
      originalMessage: originalError?.message,
      originalStack: originalError?.stack
    };
    error.output.payload.errorCode = 'SYSTEM.INTERNAL_ERROR';
    error.output.payload.timestamp = new Date().toISOString();
    
    // Log del error original para debugging
    if (originalError) {
      console.error(`🔥 Error interno en operación "${operation}":`, {
        message: originalError.message,
        stack: originalError.stack,
        context
      });
    }
    
    return error;
  }

  /**
   * Crea un error de validación de Joi más descriptivo
   * @param {Object} joiError - Error de validación de Joi
   * @param {Object} context - Contexto adicional
   * @returns {Error} Error boom formateado
   */
  static validationError(joiError, context = {}) {
    const details = joiError.details || [];
    
    // Traducir mensajes de Joi al español
    const translatedDetails = details.map(detail => ({
      field: detail.path?.join('.') || 'unknown',
      message: this.translateJoiMessage(detail),
      value: detail.context?.value,
      type: detail.type
    }));

    const primaryError = translatedDetails[0];
    const message = primaryError?.message || getErrorMessage('VALIDATION', 'INVALID_FORMAT');
    
    const error = boom.badRequest(message);
    
    error.output.payload.context = context;
    error.output.payload.errorCode = 'VALIDATION.JOI_ERROR';
    error.output.payload.timestamp = new Date().toISOString();
    error.output.payload.validationErrors = translatedDetails;
    error.output.payload.totalErrors = translatedDetails.length;
    
    return error;
  }

  /**
   * Crea un error de base de datos
   * @param {string} operation - Operación de BD que falló
   * @param {Error} dbError - Error original de la BD
   * @param {Object} context - Contexto adicional
   * @returns {Error} Error boom formateado
   */
  static databaseError(operation = 'QUERY', dbError = null, context = {}) {
    // Mapear códigos de error de PostgreSQL a mensajes amigables
    const pgErrorMap = {
      '23505': getErrorMessage('DATABASE', 'DUPLICATE_ENTRY'),
      '23503': getErrorMessage('DATABASE', 'FOREIGN_KEY_VIOLATION'),
      '23514': getErrorMessage('DATABASE', 'CONSTRAINT_VIOLATION'),
      '08000': getErrorMessage('DATABASE', 'CONNECTION_ERROR')
    };

    const pgCode = dbError?.code;
    const message = pgErrorMap[pgCode] || getErrorMessage('DATABASE', 'QUERY_FAILED');
    
    const error = boom.internal(message);
    
    error.output.payload.context = { 
      ...context, 
      operation,
      pgCode,
      pgMessage: dbError?.message,
      pgDetail: dbError?.detail
    };
    error.output.payload.errorCode = `DATABASE.${operation.toUpperCase()}_FAILED`;
    error.output.payload.timestamp = new Date().toISOString();
    
    return error;
  }

  /**
   * Crea un error de archivo/media
   * @param {string} operation - Operación que falló
   * @param {string} filename - Nombre del archivo
   * @param {Error} originalError - Error original
   * @param {Object} context - Contexto adicional
   * @returns {Error} Error boom formateado
   */
  static fileError(operation = 'UPLOAD_FAILED', filename = null, originalError = null, context = {}) {
    const message = getErrorMessage('FILES', operation);
    const error = boom.badRequest(message);
    
    error.output.payload.context = { 
      ...context, 
      filename,
      originalMessage: originalError?.message
    };
    error.output.payload.errorCode = `FILES.${operation}`;
    error.output.payload.timestamp = new Date().toISOString();
    
    return error;
  }

  /**
   * Traduce mensajes de error de Joi al español
   * @param {Object} joiDetail - Detalle del error de Joi
   * @returns {string} Mensaje traducido
   */
  static translateJoiMessage(joiDetail) {
    const { type, context } = joiDetail;
    const field = context?.label || context?.key || 'campo';
    
    const translations = {
      'any.required': `El campo "${field}" es obligatorio`,
      'string.empty': `El campo "${field}" no puede estar vacío`,
      'string.min': `El campo "${field}" debe tener al menos ${context?.limit} caracteres`,
      'string.max': `El campo "${field}" no puede exceder ${context?.limit} caracteres`,
      'string.email': `El campo "${field}" debe ser un correo electrónico válido`,
      'number.base': `El campo "${field}" debe ser un número`,
      'number.min': `El campo "${field}" debe ser mayor o igual a ${context?.limit}`,
      'number.max': `El campo "${field}" debe ser menor o igual a ${context?.limit}`,
      'date.base': `El campo "${field}" debe ser una fecha válida`,
      'boolean.base': `El campo "${field}" debe ser verdadero o falso`,
      'array.base': `El campo "${field}" debe ser una lista`,
      'object.base': `El campo "${field}" debe ser un objeto válido`
    };

    return translations[type] || `Error de validación en el campo "${field}"`;
  }

  /**
   * Crea un error personalizado con información completa
   * @param {number} statusCode - Código de estado HTTP
   * @param {string} message - Mensaje de error
   * @param {string} errorCode - Código de error interno
   * @param {Object} context - Contexto adicional
   * @returns {Error} Error boom formateado
   */
  static custom(statusCode = 500, message = 'Error desconocido', errorCode = 'CUSTOM_ERROR', context = {}) {
    const error = boom.create(statusCode, message);
    
    error.output.payload.context = context;
    error.output.payload.errorCode = errorCode;
    error.output.payload.timestamp = new Date().toISOString();
    
    return error;
  }
}

module.exports = ErrorFactory;