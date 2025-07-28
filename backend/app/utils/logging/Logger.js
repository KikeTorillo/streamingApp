/**
 * @file Logger.js
 * @description Sistema de logging centralizado usando Winston
 * con múltiples transportes, niveles y formatos estructurados.
 * 
 * CARACTERÍSTICAS:
 * - Logs estructurados en JSON para producción
 * - Logs legibles con colores para desarrollo
 * - Rotación automática de archivos
 * - Diferentes niveles de logging
 * - Metadata contextual automática
 * - Integración con sistema de errores
 */

const winston = require('winston');
const path = require('path');
const { config } = require('../../config/config');

// Crear directorio de logs si no existe
const logDir = path.join(process.cwd(), 'logs');
require('fs').mkdirSync(logDir, { recursive: true });

/**
 * Formato personalizado para logs de desarrollo
 * Incluye colores, timestamps y formato legible
 */
const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    let logMessage = `${timestamp} [${level}]: ${message}`;
    
    // Agregar metadata si existe
    if (Object.keys(meta).length > 0) {
      logMessage += `\n   Meta: ${JSON.stringify(meta, null, 2)}`;
    }
    
    return logMessage;
  })
);

/**
 * Formato para producción
 * JSON estructurado para facilitar parsing y análisis
 */
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf((info) => {
    // Agregar información del entorno y aplicación
    return JSON.stringify({
      ...info,
      service: 'streaming-app-backend',
      environment: config.env || 'production',
      version: process.env.npm_package_version || '1.0.0',
      pid: process.pid,
      hostname: require('os').hostname()
    });
  })
);

/**
 * Configuración de transportes según el entorno
 */
const getTransports = () => {
  const transports = [
    // Console siempre disponible
    new winston.transports.Console({
      level: config.isDevelopment ? 'debug' : 'info',
      format: config.isDevelopment ? developmentFormat : productionFormat,
      handleExceptions: true,
      handleRejections: true
    })
  ];

  // En producción, agregar archivos de log
  if (!config.isDevelopment) {
    // Log general (info y superior)
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, 'app.log'),
        level: 'info',
        format: productionFormat,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
        tailable: true
      })
    );

    // Log de errores (error y superior)
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, 'errors.log'),
        level: 'error',
        format: productionFormat,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 10,
        tailable: true
      })
    );

    // Log combinado (todo)
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, 'combined.log'),
        format: productionFormat,
        maxsize: 50 * 1024 * 1024, // 50MB
        maxFiles: 3,
        tailable: true
      })
    );
  }

  return transports;
};

/**
 * Crear instancia principal del logger
 */
const logger = winston.createLogger({
  level: config.isDevelopment ? 'debug' : 'info',
  levels: winston.config.npm.levels,
  transports: getTransports(),
  exitOnError: false,
  
  // Configuración por defecto para metadata
  defaultMeta: {
    service: 'streaming-app-backend',
    environment: config.env || 'development'
  }
});

/**
 * Clase Logger con métodos adicionales y contexto automático
 */
class StreamingLogger {
  constructor() {
    this.winston = logger;
  }

  /**
   * Crea un child logger con contexto específico
   * @param {Object} context - Contexto a agregar a todos los logs
   * @returns {StreamingLogger} Nueva instancia con contexto
   */
  child(context = {}) {
    const childLogger = new StreamingLogger();
    childLogger.winston = logger.child(context);
    return childLogger;
  }

  /**
   * Log de información general
   * @param {string} message - Mensaje principal
   * @param {Object} meta - Metadata adicional
   */
  info(message, meta = {}) {
    this.winston.info(message, this._enrichMeta(meta));
  }

  /**
   * Log de advertencias
   * @param {string} message - Mensaje principal
   * @param {Object} meta - Metadata adicional
   */
  warn(message, meta = {}) {
    this.winston.warn(message, this._enrichMeta(meta));
  }

  /**
   * Log de errores
   * @param {string} message - Mensaje principal
   * @param {Error|Object} meta - Error o metadata adicional
   */
  error(message, meta = {}) {
    if (meta instanceof Error) {
      meta = {
        error: {
          message: meta.message,
          name: meta.name,
          stack: meta.stack,
          ...meta
        }
      };
    }
    this.winston.error(message, this._enrichMeta(meta));
  }

  /**
   * Log de debugging (solo en desarrollo)
   * @param {string} message - Mensaje principal
   * @param {Object} meta - Metadata adicional
   */
  debug(message, meta = {}) {
    this.winston.debug(message, this._enrichMeta(meta));
  }

  /**
   * Log de eventos HTTP/API
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {number} duration - Duración en ms
   */
  http(req, res, duration = 0) {
    const meta = {
      http: {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection?.remoteAddress,
        userId: req.user?.id || 'anonymous'
      }
    };

    const level = res.statusCode >= 400 ? 'warn' : 'info';
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    
    this.winston[level](message, this._enrichMeta(meta));
  }

  /**
   * Log de operaciones de base de datos
   * @param {string} operation - Tipo de operación (SELECT, INSERT, etc.)
   * @param {string} table - Tabla afectada
   * @param {number} duration - Duración en ms
   * @param {Object} meta - Metadata adicional
   */
  database(operation, table, duration = 0, meta = {}) {
    const enrichedMeta = this._enrichMeta({
      database: {
        operation,
        table,
        duration: `${duration}ms`
      },
      ...meta
    });

    this.winston.info(`DB ${operation} on ${table} - ${duration}ms`, enrichedMeta);
  }

  /**
   * Log de operaciones de archivos/media
   * @param {string} operation - Operación realizada
   * @param {string} filename - Nombre del archivo
   * @param {Object} meta - Metadata adicional
   */
  media(operation, filename, meta = {}) {
    const enrichedMeta = this._enrichMeta({
      media: {
        operation,
        filename,
        ...meta
      }
    });

    this.winston.info(`Media ${operation}: ${filename}`, enrichedMeta);
  }

  /**
   * Log de seguridad y autenticación
   * @param {string} event - Evento de seguridad
   * @param {Object} meta - Metadata adicional
   */
  security(event, meta = {}) {
    const enrichedMeta = this._enrichMeta({
      security: {
        event,
        timestamp: new Date().toISOString(),
        ...meta
      }
    });

    this.winston.warn(`Security Event: ${event}`, enrichedMeta);
  }

  /**
   * Enriquece la metadata con información contextual
   * @param {Object} meta - Metadata base
   * @returns {Object} Metadata enriquecida
   */
  _enrichMeta(meta = {}) {
    return {
      ...meta,
      timestamp: new Date().toISOString(),
      requestId: this._getRequestId(),
      memoryUsage: this._getMemoryUsage()
    };
  }

  /**
   * Obtiene el ID de request del contexto (si está disponible)
   * @returns {string|null} Request ID
   */
  _getRequestId() {
    // Implementar con cls-hooked o similar en el futuro
    return null;
  }

  /**
   * Obtiene información básica de uso de memoria
   * @returns {Object} Información de memoria
   */
  _getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`
    };
  }
}

// Crear instancia global del logger
const streamingLogger = new StreamingLogger();

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  streamingLogger.error('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  streamingLogger.error('Unhandled Rejection', {
    reason: reason?.message || reason,
    promise: promise.toString()
  });
});

module.exports = streamingLogger;