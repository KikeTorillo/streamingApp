/**
 * @file BaseService.js
 * @description Clase base mejorada para servicios con manejo centralizado de errores,
 * logging estructurado y métodos comunes optimizados.
 * 
 * MEJORAS IMPLEMENTADAS:
 * - ErrorFactory integrado para errores consistentes
 * - Logger con contexto específico por servicio
 * - Métodos de manejo de errores de BD
 * - Validaciones comunes centralizadas
 * - Transacciones con mejor error handling
 */

const fs = require('fs');
const crypto = require('crypto');
const pool = require('../libs/postgresPool');

// Sistema de errores y logging mejorado
const ErrorFactory = require('../utils/errors/ErrorFactory');
const logger = require('../utils/logging/Logger');

/**
 * Clase base para servicios que proporciona funcionalidades comunes
 * mejoradas con sistema de errores centralizado y logging estructurado
 */
class BaseService {
  constructor(serviceName = 'UnknownService') {
    this.pool = pool;
    this.serviceName = serviceName;
    this.logger = logger.child({ service: serviceName });
    
    // Configurar manejador de errores del pool
    this.pool.on('error', (err) => {
      this.logger.error('Error en pool de conexiones PostgreSQL', {
        error: err.message,
        code: err.code,
        stack: err.stack
      });
    });
  }

  /**
   * Calcula el hash SHA256 de un archivo
   * @param {string} filePath - Ruta del archivo
   * @returns {Promise<string>} Hash SHA256 del archivo
   * @throws {Error} Error si no se puede calcular el hash
   */
  async calculateFileHash(filePath) {
    try {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      for await (const chunk of stream) {
        hash.update(chunk);
      }

      return hash.digest('hex');
    } catch (error) {
      throw new Error(
        `Error al calcular el hash del archivo: ${error.message}`
      );
    }
  }

  /**
   * Verifica si un archivo con el hash especificado ya existe en la base de datos
   * @param {string} fileHash - Hash del archivo a verificar
   * @returns {Promise<boolean>} true si el archivo existe, false si no
   */
  async checkIfFileExistsInDatabase(fileHash) {
    const query = 'SELECT id FROM videos WHERE file_hash = $1 LIMIT 1';
    const result = await this.pool.query(query, [fileHash]);
    return result.rows.length > 0;
  }

  /**
   * Ejecuta una función dentro de una transacción de base de datos
   * Maneja automáticamente BEGIN, COMMIT y ROLLBACK con logging mejorado
   * @param {function} callback - Función a ejecutar dentro de la transacción
   * @param {string} operation - Nombre de la operación para logging
   * @returns {Promise<any>} Resultado de la función callback
   */
  async withTransaction(callback, operation = 'unknown_transaction') {
    const transactionId = this._generateTransactionId();
    const transactionLogger = this.logger.child({ 
      operation, 
      transactionId 
    });
    
    const client = await this.pool.connect();
    const startTime = Date.now();
    
    try {
      transactionLogger.debug('Iniciando transacción');
      await client.query('BEGIN');
      
      const result = await callback(client);
      
      await client.query('COMMIT');
      const duration = Date.now() - startTime;
      
      transactionLogger.info('Transacción completada exitosamente', { 
        duration: `${duration}ms` 
      });
      
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      try {
        await client.query('ROLLBACK');
        transactionLogger.warn('Transacción revertida debido a error', { 
          duration: `${duration}ms`,
          error: error.message 
        });
      } catch (rollbackError) {
        transactionLogger.error('Error durante ROLLBACK de transacción', {
          originalError: error.message,
          rollbackError: rollbackError.message,
          duration: `${duration}ms`
        });
      }
      
      // Convertir error de BD a error de nuestro sistema
      throw this.handleDatabaseError(error, operation);
      
    } finally {
      client.release();
    }
  }

  /**
   * Ejecuta una query con manejo de errores y logging
   * @param {string} query - Query SQL a ejecutar
   * @param {Array} params - Parámetros de la query
   * @param {string} operation - Nombre de la operación para logging
   * @returns {Promise<Object>} Resultado de la query
   */
  async executeQuery(query, params = [], operation = 'unknown_query') {
    const queryLogger = this.logger.child({ operation });
    const startTime = Date.now();
    
    try {
      queryLogger.debug('Ejecutando query', { 
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        paramsCount: params.length 
      });
      
      const result = await this.pool.query(query, params);
      const duration = Date.now() - startTime;
      
      queryLogger.info('Query ejecutada exitosamente', { 
        duration: `${duration}ms`,
        rowCount: result.rowCount,
        affectedRows: result.rows?.length || 0
      });
      
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      queryLogger.error('Error ejecutando query', {
        error: error.message,
        code: error.code,
        duration: `${duration}ms`,
        query: query.substring(0, 200)
      });
      
      throw this.handleDatabaseError(error, operation);
    }
  }

  /**
   * Maneja errores de base de datos y los convierte a errores de nuestro sistema
   * @param {Error} error - Error original de la BD
   * @param {string} operation - Operación que causó el error
   * @param {Object} context - Contexto adicional
   * @returns {Error} Error de nuestro sistema
   */
  handleDatabaseError(error, operation = 'database_operation', context = {}) {
    // Mapear códigos de error de PostgreSQL más comunes
    const errorMap = {
      '23505': 'DUPLICATE_ENTRY',      // unique_violation
      '23503': 'FOREIGN_KEY_VIOLATION', // foreign_key_violation
      '23514': 'CONSTRAINT_VIOLATION',  // check_violation
      '23502': 'NOT_NULL_VIOLATION',    // not_null_violation
      '08000': 'CONNECTION_ERROR',      // connection_exception
      '08006': 'CONNECTION_ERROR',      // connection_failure
      '57014': 'TIMEOUT',              // query_canceled
      '53300': 'RESOURCE_EXHAUSTED'    // too_many_connections
    };

    const errorType = errorMap[error.code] || 'QUERY_FAILED';
    
    return ErrorFactory.databaseError(operation, error, {
      ...context,
      serviceName: this.serviceName,
      pgCode: error.code,
      pgMessage: error.message,
      pgDetail: error.detail,
      pgHint: error.hint
    });
  }

  /**
   * Valida que un ID sea válido (entero positivo)
   * @param {any} id - ID a validar
   * @param {string} resourceType - Tipo de recurso para el mensaje de error
   * @returns {number} ID validado
   * @throws {Error} Error si el ID no es válido
   */
  validateId(id, resourceType = 'recurso') {
    const numId = parseInt(id);
    
    if (isNaN(numId) || numId <= 0) {
      throw ErrorFactory.badRequest('INVALID_ID', {}, { 
        providedId: id, 
        resourceType 
      });
    }
    
    return numId;
  }

  /**
   * Valida que un recurso exista y lo devuelve
   * @param {any} resource - Recurso a validar
   * @param {string} resourceType - Tipo de recurso
   * @param {string|number} resourceId - ID del recurso
   * @returns {any} Recurso validado
   * @throws {Error} Error si el recurso no existe
   */
  validateResourceExists(resource, resourceType = 'RESOURCE', resourceId = null) {
    if (!resource) {
      throw ErrorFactory.notFound(resourceType, resourceId);
    }
    
    return resource;
  }

  /**
   * Genera un ID único para transacciones (para logging)
   * @returns {string} ID único de transacción
   */
  _generateTransactionId() {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Parsea JSON de forma segura, manejando errores y tipos
   * @param {string|object} jsonData - Datos JSON a parsear
   * @param {any} defaultValue - Valor por defecto si el parseo falla
   * @returns {any} Datos parseados o valor por defecto
   */
  parseJsonSafely(jsonData, defaultValue = null) {
    if (!jsonData) {
      return defaultValue;
    }

    // Si ya es un objeto/array, devolverlo tal como está
    if (typeof jsonData !== 'string') {
      return jsonData;
    }

    try {
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('❌ Error parsing JSON:', error.message);
      console.error('❌ Raw value:', jsonData);
      return defaultValue;
    }
  }
}

module.exports = BaseService;