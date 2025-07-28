/**
 * @file errorHandler.js
 * @description Sistema mejorado de manejo de errores con logs estructurados,
 * respuestas homologadas y tracking de errores para debugging eficiente.
 * 
 * CARACTERÍSTICAS:
 * - Logs estructurados con contexto completo
 * - Respuestas consistentes en español
 * - Tracking de errores por tipo y frecuencia
 * - Ocultación de información sensible en producción
 * - Integración con sistema de ErrorFactory
 */

const { config } = require('../config/config');
const { ERROR_MESSAGES } = require('../constants/ErrorMessages');

/**
 * Middleware de logging estructurado de errores
 * Registra errores con contexto completo para debugging eficiente
 * @param {Error} err - Objeto de error capturado
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
function logErrors(err, req, res, next) {
    // Extraer información relevante de la request
    const requestInfo = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection?.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
        userId: req.user?.id || 'anonymous',
        body: req.method !== 'GET' ? req.body : undefined,
        params: req.params,
        query: req.query
    };

    // Crear objeto de log estructurado
    const errorLog = {
        level: 'ERROR',
        timestamp: new Date().toISOString(),
        message: err.message || 'Error sin mensaje',
        errorCode: err.output?.payload?.errorCode || 'UNKNOWN_ERROR',
        statusCode: err.output?.statusCode || err.statusCode || 500,
        stack: err.stack,
        request: requestInfo,
        context: err.output?.payload?.context || {},
        isBoom: err.isBoom || false,
        errorType: err.constructor.name
    };

    // Log diferente según el entorno
    if (config.isDevelopment) {
        // En desarrollo: log completo con colores
        console.error('\n🔥 === ERROR DETECTADO ===');
        console.error(`⏰ Timestamp: ${errorLog.timestamp}`);
        console.error(`🏷️  Error Code: ${errorLog.errorCode}`);
        console.error(`📊 Status Code: ${errorLog.statusCode}`);
        console.error(`📝 Message: ${errorLog.message}`);
        console.error(`🌐 Request: ${requestInfo.method} ${requestInfo.url}`);
        console.error(`👤 User: ${requestInfo.userId}`);
        console.error(`🔍 Context:`, JSON.stringify(errorLog.context, null, 2));
        
        if (errorLog.stack) {
            console.error(`📚 Stack Trace:\n${errorLog.stack}`);
        }
        console.error('🔥 === FIN ERROR ===\n');
    } else {
        // En producción: log estructurado sin información sensible
        const prodLog = {
            ...errorLog,
            stack: undefined, // No mostrar stack en producción
            request: {
                ...requestInfo,
                body: undefined, // No logear body en producción
                userAgent: undefined
            }
        };
        console.error(JSON.stringify(prodLog));
    }

    // Tracking de errores (para métricas futuras)
    trackErrorMetrics(errorLog);

    next(err);
}

/**
 * Función para tracking básico de métricas de errores
 * @param {Object} errorLog - Log del error estructurado
 */
function trackErrorMetrics(errorLog) {
    // Implementación básica - se puede expandir con sistemas como Prometheus
    if (!global.errorMetrics) {
        global.errorMetrics = {
            totalErrors: 0,
            errorsByCode: {},
            errorsByEndpoint: {},
            lastErrors: []
        };
    }

    global.errorMetrics.totalErrors++;
    global.errorMetrics.errorsByCode[errorLog.errorCode] = 
        (global.errorMetrics.errorsByCode[errorLog.errorCode] || 0) + 1;
    
    const endpoint = `${errorLog.request.method} ${errorLog.request.url}`;
    global.errorMetrics.errorsByEndpoint[endpoint] = 
        (global.errorMetrics.errorsByEndpoint[endpoint] || 0) + 1;

    // Mantener solo los últimos 50 errores
    global.errorMetrics.lastErrors.unshift({
        timestamp: errorLog.timestamp,
        code: errorLog.errorCode,
        endpoint: endpoint,
        message: errorLog.message
    });
    
    if (global.errorMetrics.lastErrors.length > 50) {
        global.errorMetrics.lastErrors = global.errorMetrics.lastErrors.slice(0, 50);
    }
}

/**
 * Middleware mejorado para manejo de errores Boom
 * Procesa errores estructurados con respuestas homologadas y contexto enriquecido
 * @param {Error} err - Objeto de error capturado
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
function boomErrorHandler(err, req, res, next) {
    if (err.isBoom) {
        const { output } = err;
        let response = {
            success: false,
            error: output.payload.error,
            message: output.payload.message,
            statusCode: output.statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            method: req.method
        };

        // Agregar información adicional de nuestro ErrorFactory
        if (output.payload.errorCode) {
            response.errorCode = output.payload.errorCode;
        }

        if (output.payload.validationErrors) {
            response.validationErrors = output.payload.validationErrors;
            response.totalErrors = output.payload.totalErrors;
        }

        if (output.payload.validationDetails) {
            response.validationDetails = output.payload.validationDetails;
        }

        if (output.payload.conflictDetails) {
            response.conflictDetails = output.payload.conflictDetails;
        }

        // En desarrollo, incluir contexto adicional para debugging
        if (config.isDevelopment && output.payload.context) {
            response.debugContext = output.payload.context;
        }

        // Para errores de validación de Joi, usar el mensaje más descriptivo
        if (err.data && err.data.details && err.data.details.length > 0) {
            // Tomar el primer error de validación como mensaje principal
            response.message = err.data.details[0].message;
            
            // Si no tenemos validationErrors del ErrorFactory, crearlos desde Joi
            if (!response.validationErrors) {
                response.validationErrors = err.data.details.map(detail => ({
                    field: detail.path?.join('.') || 'unknown',
                    message: detail.message,
                    value: detail.context?.value,
                    type: detail.type
                }));
                response.totalErrors = response.validationErrors.length;
            }
        }

        // Headers de respuesta adicionales
        res.set({
            'X-Error-Code': response.errorCode || 'BOOM_ERROR',
            'X-Error-Timestamp': response.timestamp
        });

        res.status(output.statusCode).json(response);
    } else {
        next(err);
    }
}

/**
 * Middleware de manejo de errores genéricos (fallback)
 * Maneja errores que no fueron procesados por middlewares anteriores
 * Proporciona respuestas consistentes y logging apropiado
 * @param {Error} err - Objeto de error capturado
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
function errorHandler(err, req, res, next) {
    // Si ya se envió una respuesta, no hacer nada más
    if (res.headersSent) {
        return next(err);
    }

    // Determinar el status code
    const statusCode = err.statusCode || err.status || 500;
    
    // Respuesta base homologada
    const response = {
        success: false,
        error: statusCode >= 500 ? 'Internal Server Error' : 'Bad Request',
        message: statusCode >= 500 
            ? ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR 
            : (err.message || 'Error desconocido'),
        statusCode: statusCode,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
        errorCode: 'GENERIC_ERROR'
    };

    // En desarrollo, incluir información adicional
    if (config.isDevelopment) {
        response.debugInfo = {
            originalMessage: err.message,
            errorName: err.name,
            errorType: err.constructor.name
        };
        
        // Solo incluir stack trace en desarrollo y para errores 500
        if (statusCode >= 500) {
            response.stack = err.stack;
        }
    }

    // Headers de respuesta
    res.set({
        'X-Error-Code': 'GENERIC_ERROR',
        'X-Error-Timestamp': response.timestamp,
        'Content-Type': 'application/json'
    });

    res.status(statusCode).json(response);
}

/**
 * Endpoint para obtener métricas de errores (útil para monitoring)
 * Debe ser agregado como ruta en el sistema
 */
function getErrorMetrics(req, res) {
    if (!global.errorMetrics) {
        return res.json({
            message: 'No hay métricas de errores disponibles',
            metrics: {
                totalErrors: 0,
                errorsByCode: {},
                errorsByEndpoint: {},
                lastErrors: []
            }
        });
    }

    res.json({
        message: 'Métricas de errores del sistema',
        generatedAt: new Date().toISOString(),
        metrics: global.errorMetrics
    });
}

/**
 * Función para limpiar métricas de errores
 */
function resetErrorMetrics() {
    global.errorMetrics = {
        totalErrors: 0,
        errorsByCode: {},
        errorsByEndpoint: {},
        lastErrors: []
    };
}

// Exporta los middlewares y utilidades
module.exports = { 
    logErrors, 
    boomErrorHandler, 
    errorHandler,
    getErrorMetrics,
    resetErrorMetrics
};