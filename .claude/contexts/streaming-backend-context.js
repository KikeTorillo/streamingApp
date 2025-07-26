/**
 * CONTEXTO: Streaming Media Backend Architecture
 * 
 * Este contexto proporciona información esencial sobre la arquitectura del backend
 * de la aplicación de streaming, incluyendo patrones, estructura y lógica de negocio.
 * 
 * Usar cuando: Se trabaje con servicios backend, APIs, procesamiento de archivos,
 * autenticación, o cualquier funcionalidad del lado servidor.
 */

const streamingBackendContext = {
  // ==========================================
  // ARQUITECTURA GENERAL
  // ==========================================
  architecture: {
    pattern: "MVC (Model-View-Controller)",
    structure: "Express.js + PostgreSQL + MinIO S3",
    authentication: "JWT + Passport.js + Role-based access",
    fileStorage: "MinIO S3-compatible",
    videoProcessing: "FFmpeg transcoding pipeline"
  },

  // ==========================================
  // ESTRUCTURA DE DIRECTORIOS
  // ==========================================
  directories: {
    "config/": "Configuración de la aplicación",
    "middleware/": "Middlewares (auth, validation, upload, errors)",
    "routes/": "Definición de rutas API REST",
    "services/": "Lógica de negocio - REFACTORIZADO ✅ (BaseService, Movies, Series, Episodes separado, Auth, Users, Categories)",
    "schemas/": "Validaciones Joi para requests",
    "utils/": "Utilidades organizadas funcionalmente",
    "temp_downloads/": "Archivos temporales descargados (imágenes URL)",
    "tempProcessinDir/": "Directorio temporal para procesamiento de video",
    "uploads/": "Archivos subidos por usuarios"
  },

  // ==========================================
  // ESTRUCTURA UTILS/ REORGANIZADA
  // ==========================================
  utilsStructure: {
    "auth/": {
      description: "Autenticación y estrategias",
      files: {
        "index.js": "Configuración de estrategias Passport",
        "strategies/jwtStrategy.js": "Estrategia JWT",
        "strategies/localStrategy.js": "Estrategia de usuario/contraseña"
      }
    },
    "database/": {
      description: "Utilidades de base de datos",
      files: {
        "configureAuditContext.js": "Contexto de auditoría para PostgreSQL",
        "updateAbtraction.js": "Query builder genérico para UPDATE"
      }
    },
    "media/": {
      description: "Procesamiento de archivos multimedia",
      subdirectories: {
        "config/": {
          "configMediaQualities.js": "Configuración de calidades y formatos"
        },
        "image/": {
          "imageDownloader.js": "Descarga de imágenes desde URLs",
          "imageProcessor.js": "Procesamiento con Sharp (optimización)"
        },
        "video/": {
          "mp4-transcoder.js": "Pipeline completo de transcodificación",
          "ffmpegOptions.js": "Opciones específicas de FFmpeg",
          "transcodeSettings.js": "Configuración de transcodificación",
          "subtitleProcessor.js": "Procesamiento de subtítulos",
          "videoValidator.js": "Validación de archivos de video"
        }
      }
    },
    "storage/": {
      description: "Almacenamiento y operaciones de archivos",
      files: {
        "aws.js": "Cliente MinIO S3 y operaciones",
        "fileHelpers.js": "Operaciones básicas de archivos/directorios",
        "getPresignedUrl.js": "URLs prefirmadas para MinIO"
      }
    },
    "streaming/": {
      description: "Funcionalidades específicas de streaming",
      files: {
        "vod-unique-url.js": "URLs únicas para video on demand"
      }
    }
  },

  // ==========================================
  // SERVICIOS PRINCIPALES - ARQUITECTURA REFACTORIZADA ✅
  // ==========================================
  services: {
    // ✅ NUEVA ARQUITECTURA: BaseService + Herencia
    BaseService: {
      location: "services/BaseService.js",
      purpose: "Clase base con funcionalidades comunes para todos los servicios",
      commonMethods: [
        "calculateFileHash(filePath)", // SHA256 de archivos
        "checkIfFileExistsInDatabase(hash)", // Verificación en BD
        "withTransaction(callback)", // Wrapper para transacciones BEGIN/COMMIT/ROLLBACK
        "parseJsonSafely(jsonData, defaultValue)" // Parseo JSON robusto
      ],
      benefits: [
        "Eliminación de código duplicado",
        "Manejo de transacciones centralizado", 
        "Parseo JSON consistente",
        "Patrón de herencia establecido"
      ]
    },

    // Patrón común para todos los servicios
    servicePattern: {
      inheritance: "extends BaseService", // ✅ ACTUALIZADO
      methods: ["find()", "findOne(id)", "create(data)", "update(id, data)", "delete(id)"],
      errorHandling: "Boom.js para errores HTTP estructurados",
      database: "PostgreSQL pool connection via BaseService",
      validation: "Joi schemas en middleware",
      transactions: "this.withTransaction() wrapper automático", // ✅ NUEVO
      commonUtilities: "Heredadas de BaseService (hash, JSON parsing, etc.)" // ✅ NUEVO
    },

    MoviesService: {
      description: "Gestión de películas con procesamiento de video - REFACTORIZADO ✅",
      inheritance: "extends BaseService", // ✅ ACTUALIZADO
      specialMethods: [
        "findByHash(fileHash)", 
        "findByName(title)",
        "searchByYearRange(fromYear, toYear)"
      ],
      refactoredMethods: [ // ✅ NUEVO
        "create() - usa withTransaction()",
        "update() - usa withTransaction()", 
        "delete() - usa withTransaction()"
      ],
      processes: "Video transcoding + cover image processing",
      codeImprovement: "-37 líneas duplicadas eliminadas" // ✅ NUEVO
    },

    SeriesService: {
      description: "Gestión de series de TV - REFACTORIZADO ✅ + SEPARADO",
      inheritance: "extends BaseService", // ✅ ACTUALIZADO
      relationships: "Serie -> Episodes (1:N) - Episodios gestionados por EpisodesService",
      coverHandling: "URL externa o archivo subido",
      refactoredMethods: [ // ✅ NUEVO
        "create() - usa withTransaction()",
        "update() - usa withTransaction()",
        "delete() - usa withTransaction() + CASCADE automático"
      ],
      episodeMethodsMigration: [ // ✅ MIGRADOS A EpisodesService
        "findEpisode() → EpisodesService.find()",
        "findOneEpisode() → EpisodesService.findOne()",
        "findEpisodeByFileHash() → EpisodesService.findByFileHash()",
        "createEpisode() → EpisodesService.create()",
        "updateEpisode() → EpisodesService.update()",
        "deleteEpisode() → EpisodesService.delete()"
      ],
      codeImprovement: "-35 líneas duplicadas eliminadas + JSON parsing mejorado + 370 líneas migradas a EpisodesService", // ✅ ACTUALIZADO
      singleResponsibility: "Ahora se enfoca únicamente en gestión de series" // ✅ NUEVO
    },

    EpisodesService: {
      description: "Gestión de episodios individuales - SERVICIO INDEPENDIENTE ✅",
      inheritance: "extends BaseService", // ✅ NUEVO
      location: "services/EpisodesService.js", // ✅ NUEVO
      parentRelation: "Pertenece a una Serie (validación automática)",
      videoProcessing: "Transcodificación completa + procesamiento MinIO",
      methods: [ // ✅ NUEVO
        "find(serieId, season?, episodeNumber?) - Búsqueda flexible por serie/temporada/episodio",
        "findOne(id) - Obtiene episodio por ID con datos completos",
        "findByFileHash(fileHash) - Búsqueda por hash de video",
        "create(episodeInfo, onProgress) - Creación con transcodificación",
        "update(id, changes) - Actualización con validaciones",
        "delete(id) - Eliminación + cleanup de archivos MinIO",
        "validateSerieExists(serieId) - Validación auxiliar"
      ],
      refactoredFeatures: [ // ✅ NUEVO
        "Usa withTransaction() para operaciones de BD",
        "Usa parseJsonSafely() para JSON parsing robusto",
        "Validación automática de existencia de series",
        "Cleanup automático de archivos temporales",
        "Manejo de errores con boom.js consistente"
      ],
      benefits: [ // ✅ NUEVO
        "Single Responsibility Principle aplicado",
        "Servicio más enfocado y testeable",
        "Reutilización de BaseService",
        "Separación clara de responsabilidades"
      ]
    },

    AuthService: {
      description: "Autenticación y autorización",
      methods: [
        "signToken(user)",
        "getUser(userName, password)", 
        "sendRecoveryLink(email)",
        "changePassword(token, newPassword)"
      ],
      security: "bcrypt hashing + JWT tokens"
    },

    UsersService: {
      description: "Gestión de usuarios del sistema",
      roles: ["admin", "editor", "user"],
      methods: ["findByUserName()", "findByEmail()"]
    },

    CategoriesService: {
      description: "Gestión de categorías de contenido",
      usage: "Clasificación de movies/series"
    }
  },

  // ==========================================
  // ESQUEMAS DE BASE DE DATOS
  // ==========================================
  database: {
    tables: {
      users: {
        columns: ["id", "user_name", "email", "password", "role_id", "recovery_token"],
        relations: "belongs_to roles"
      },
      roles: {
        columns: ["id", "name", "description"],
        defaultRoles: ["admin", "editor", "user"]
      },
      categories: {
        columns: ["id", "name"],
        usage: "Clasificación de contenido"
      },
      movies: {
        columns: ["id", "title", "description", "release_year", "category_id", "video_id", "cover_image"],
        relations: "belongs_to categories, has_one videos"
      },
      series: {
        columns: ["id", "title", "description", "release_year", "category_id", "cover_image"],
        relations: "belongs_to categories, has_many episodes"
      },
      episodes: {
        columns: ["id", "title", "description", "episode_number", "season_number", "series_id", "video_id", "cover_image"],
        relations: "belongs_to series, has_one videos"
      },
      videos: {
        columns: ["id", "file_hash", "original_filename", "file_size", "duration", "available_resolutions", "available_subtitles"],
        purpose: "Metadatos de archivos de video procesados"
      }
    },
    
    auditFields: ["created_at", "updated_at", "created_by", "updated_by", "ip_address"],
    triggers: "update_updated_at_column() - Actualización automática de timestamps"
  },

  // ==========================================
  // PATRONES DE VALIDACIÓN
  // ==========================================
  validation: {
    library: "Joi",
    pattern: "Schemas separados por entidad (moviesSchemas.js, seriesSchemas.js, etc.)",
    
    commonValidations: {
      id: "Joi.number().integer().positive()",
      title: "Joi.string().required()",
      categoryId: "Joi.number().integer().positive().required()",
      releaseYear: "Joi.number().integer().min(1900).max(currentYear)",
      description: "Joi.string().allow('')",
      coverImage: "Joi.string().optional()", // Archivo subido
      coverImageUrl: "Joi.string().uri().optional()" // URL externa (TMDB)
    },

    customValidations: {
      coverImageRequired: "Al menos coverImage O coverImageUrl debe estar presente",
      fileHash: "SHA256 de 64 caracteres hexadecimales",
      temporaryFiles: "Campo isTemporaryCoverImage para archivos temp"
    }
  },

  // ==========================================
  // MIDDLEWARE STACK
  // ==========================================
  middleware: {
    order: [
      "express.json()",
      "cookieParser()",
      "cors(whitelist)",
      "authenticateJwt", // Para rutas protegidas
      "checkRoles(['admin'])", // Para rutas admin
      "multiUpload", // Para archivos
      "validatorHandler(schema)", // Validación Joi
      "errorHandlers" // boom, logErrors, errorHandler
    ],

    authentication: {
      jwt: "Token en cookies 'access_token'",
      roles: "Array de roles permitidos por ruta",
      strategies: "LocalStrategy + JwtStrategy (Passport.js)"
    }
  },

  // ==========================================
  // PROCESAMIENTO DE ARCHIVOS
  // ==========================================
  fileProcessing: {
    videoTranscoding: {
      tool: "FFmpeg",
      resolutions: "Múltiples calidades (configMediaQualities.js)",
      format: "MP4 con H.264",
      storage: "MinIO S3 bucket 'media/videos/'"
    },

    imageProcessing: {
      covers: "Redimensionamiento y optimización",
      sources: "Archivo subido O URL externa (TMDB)",
      storage: "MinIO S3 bucket 'media/covers/'"
    },

    duplicateDetection: {
      method: "SHA256 hash del archivo original",
      check: "videos.file_hash antes de procesar",
      benefit: "Evita procesamiento innecesario"
    }
  },

  // ==========================================
  // PATRONES DE RUTAS API
  // ==========================================
  apiRoutes: {
    base: "/api/v1",
    structure: {
      "/auth": "login, logout, recovery, reset password",
      "/movies": "CRUD + búsqueda por hash/título",
      "/series": "CRUD + búsqueda",
      "/episodes": "CRUD + búsqueda por serie",
      "/category": "CRUD categorías",
      "/users": "CRUD usuarios (admin only)"
    },

    responseFormat: {
      success: "{ success: true, data: result }",
      error: "Boom.js structured errors",
      async: "Task ID para operaciones largas (transcoding)"
    }
  },

  // ==========================================
  // CONFIGURACIÓN Y ENTORNO
  // ==========================================
  configuration: {
    required_env_vars: [
      "JWT_SECRET",
      "DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD",
      "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "S3_BUCKET_NAME",
      "CORS_WHITELIST"
    ],

    docker: {
      services: "PostgreSQL + MinIO + Backend App",
      environments: "dev:local, dev:host, prod"
    }
  },

  // ==========================================
  // UTILIDADES IMPORTANTES (PATHS ACTUALIZADOS)
  // ==========================================
  utilities: {
    "utils/database/configureAuditContext.js": "Agrega user/IP a requests para auditoría",
    "utils/database/updateAbtraction.js": "Query builder genérico para UPDATE SQL",
    "utils/storage/fileHelpers.js": "Operaciones de archivos y temp directories",
    "utils/storage/aws.js": "Integración con MinIO S3",
    "utils/media/video/mp4-transcoder.js": "Pipeline de transcodificación de video",
    "utils/media/image/imageProcessor.js": "Procesamiento de imágenes de portada",
    "utils/media/image/imageDownloader.js": "Descarga de imágenes desde URLs externas",
    "utils/streaming/vod-unique-url.js": "URLs únicas para video on demand",
    "utils/media/config/configMediaQualities.js": "Configuración de calidades de video/imagen"
  },

  // ==========================================
  // PATRONES COMUNES - REFACTORIZADOS ✅
  // ==========================================
  commonPatterns: {
    serviceCreation: "const service = new ServiceClass()",
    serviceInheritance: "class ServiceClass extends BaseService", // ✅ NUEVO
    errorThrow: "throw boom.notFound('Message')",
    validation: "validatorHandler(schema, 'body')",
    authentication: "authenticateJwt + checkRoles(['role'])",
    auditContext: "configureAuditContext(req.user, req.ip)",
    asyncProcessing: "Task ID + progress map para operaciones largas",
    transactionWrapper: "await this.withTransaction(async (client) => { ... })", // ✅ NUEVO
    jsonParsing: "this.parseJsonSafely(jsonData, defaultValue)" // ✅ NUEVO
  },

  // ==========================================
  // REFACTORIZACIÓN COMPLETADA - DICIEMBRE 2024 ✅
  // ==========================================
  codeRefactoring: {
    status: "COMPLETADO ✅ + SINGLE RESPONSIBILITY ACHIEVED",
    date: "Diciembre 2024",
    
    improvements: {
      duplicateCodeElimination: {
        description: "Eliminación completa de código duplicado entre servicios",
        impact: "-72 líneas de código duplicado removidas",
        files: ["MoviesService.js", "SeriesService.js"],
        methods: ["calculateFileHash", "checkIfFileExistsInDatabase", "transaction patterns"]
      },
      
      baseServiceCreation: {
        description: "Creación de clase base con funcionalidades comunes",
        location: "services/BaseService.js",
        provides: [
          "calculateFileHash() - SHA256 de archivos",
          "checkIfFileExistsInDatabase() - verificación en BD", 
          "withTransaction() - wrapper para transacciones",
          "parseJsonSafely() - parseo JSON robusto"
        ]
      },
      
      transactionRefactoring: {
        description: "Refactorización de patrones de transacción duplicados",
        before: "BEGIN/COMMIT/ROLLBACK manual en cada método",
        after: "this.withTransaction() wrapper automático",
        methodsRefactored: [
          "MoviesService: create(), update(), delete()",
          "SeriesService: create(), update(), delete()",
          "EpisodesService: create(), update(), delete()" // ✅ NUEVO
        ],
        benefits: ["Código más limpio", "Manejo de errores consistente", "Menos propenso a errores"]
      },
      
      jsonParsingImprovement: {
        description: "Mejora del parseo JSON con manejo de errores robusto", 
        before: "try/catch manual repetido para JSON.parse()",
        after: "this.parseJsonSafely() con manejo centralizado",
        appliedIn: [
          "EpisodesService.find()", // ✅ MIGRADO
          "EpisodesService.findByFileHash()" // ✅ MIGRADO
        ]
      },
      
      singleResponsibilityPrinciple: { // ✅ NUEVO
        description: "Separación de EpisodesService para aplicar Single Responsibility Principle",
        before: "SeriesService manejaba tanto series como episodios (violaba SRP)",
        after: "SeriesService (solo series) + EpisodesService (solo episodios)",
        migration: {
          linesRemoved: 370,
          methodsMigrated: 6,
          newServiceCreated: "services/EpisodesService.js",
          routesUpdated: "routes/episodesRouter.js"
        },
        benefits: [
          "Separación clara de responsabilidades",
          "Servicios más enfocados y mantenibles",
          "Mejor testabilidad individual",
          "Código más modular y escalable"
        ]
      }
    },
    
    metrics: {
      linesReduced: 442, // ✅ ACTUALIZADO: 72 + 370 migradas
      filesRefactored: 4, // ✅ ACTUALIZADO: +1 (EpisodesService)
      servicesCreated: 2, // ✅ NUEVO: BaseService + EpisodesService
      methodsImproved: 14, // ✅ ACTUALIZADO: 8 + 6 migrados
      duplicationsEliminated: "100%",
      lintingErrors: 0,
      architecturalPrinciples: ["DRY", "Single Responsibility", "Inheritance"] // ✅ NUEVO
    },
    
    completedRecommendations: [ // ✅ NUEVO
      "✅ Separar EpisodesService de SeriesService (Single Responsibility) - COMPLETADO",
      "✅ Crear BaseService con herencia - COMPLETADO",
      "✅ Eliminar código duplicado - COMPLETADO",
      "✅ Refactorizar transacciones - COMPLETADO"
    ],
    
    futureRecommendations: [
      "Estandarizar manejo de errores (solo boom.* vs mix Error/boom)",
      "Crear constants file para mensajes de error centralizados",
      "Implementar logging estructurado con diferentes niveles",
      "Crear tests unitarios para cada servicio separado"
    ]
  },

  // ==========================================
  // PATRONES DE IMPORTS ACTUALIZADOS
  // ==========================================
  importPatterns: {
    description: "Paths actualizados después de reorganización funcional",
    examples: {
      // ✅ NUEVO: BaseService inheritance
      serviceInheritance: "const BaseService = require('./BaseService'); class MoviesService extends BaseService {}",
      
      // ✅ NUEVO: EpisodesService usage
      episodesServiceUsage: "const EpisodesService = require('./EpisodesService'); const episodesService = new EpisodesService();",
      
      // ✅ NUEVO: Transaction wrapper usage
      transactionUsage: "const result = await this.withTransaction(async (client) => { /* DB operations */ });",
      
      // ✅ NUEVO: JSON parsing
      jsonParsing: "const parsed = this.parseJsonSafely(jsonString, defaultValue);",
      
      // Database utilities
      updateQuery: "const { updateTable } = require('../utils/database/updateAbtraction');",
      auditContext: "const { configureAuditContext } = require('../utils/database/configureAuditContext');",
      
      // Storage utilities
      awsOperations: "const { deleteFilesByPrefix } = require('../utils/storage/aws');",
      fileHelpers: "const { fileExists, deleteTempDir } = require('../utils/storage/fileHelpers');",
      
      // Media processing
      videoTranscode: "const { transcode } = require('../utils/media/video/mp4-transcoder');",
      imageProcess: "const { processAndUploadCover } = require('../utils/media/image/imageProcessor');",
      imageDownload: "const { downloadImageFromUrl, isValidImageUrl } = require('../utils/media/image/imageDownloader');",
      
      // Auth
      authStrategies: "require('./utils/auth');"
    },
    
    // ✅ NUEVOS PATRONES REFACTORIZADOS
    refactoredPatterns: {
      description: "Nuevos patrones después de refactorización",
      
      serviceTemplate: `
        // ✅ TEMPLATE para nuevos servicios
        const BaseService = require('./BaseService');
        
        class NewService extends BaseService {
          constructor() {
            super(); // Hereda pool, calculateFileHash, withTransaction, etc.
          }
          
          async create(data) {
            return await this.withTransaction(async (client) => {
              // Lógica de creación
              return result;
            });
          }
        }
      `,
      
      transactionPattern: `
        // ✅ PATRÓN de transacciones refactorizado
        async methodWithTransaction(data) {
          try {
            const result = await this.withTransaction(async (client) => {
              // Toda la lógica de BD aquí
              // BEGIN/COMMIT/ROLLBACK automático
              return result;
            });
            return result;
          } catch (error) {
            // Error handling
            throw new Error('Error específico: ' + error.message);
          }
        }
      `,
      
      jsonParsingPattern: `
        // ✅ PATRÓN de parseo JSON seguro
        const episodes = result.rows.map(episode => ({
          ...episode,
          available_resolutions: this.parseJsonSafely(episode.available_resolutions),
          available_subtitles: this.parseJsonSafely(episode.available_subtitles)
        }));
      `,
      
      episodesServicePattern: `
        // ✅ PATRÓN de uso de EpisodesService separado
        const EpisodesService = require('./EpisodesService');
        const episodesService = new EpisodesService();
        
        // Buscar todos los episodios de una serie
        const allEpisodes = await episodesService.find(serieId);
        
        // Buscar episodios de una temporada específica
        const seasonEpisodes = await episodesService.find(serieId, seasonNumber);
        
        // Buscar episodio específico
        const episode = await episodesService.find(serieId, seasonNumber, episodeNumber);
        
        // Crear nuevo episodio con transcodificación
        const result = await episodesService.create(episodeInfo, progressCallback);
      `
    },
    
    organizationPrinciple: "Los imports reflejan la estructura funcional: utils/{domain}/{functionality}",
    tempFolders: {
      "temp_downloads/": "Para imágenes descargadas desde URLs (root level)",
      "tempProcessinDir/": "Para procesamiento de video (root level)", 
      "uploads/": "Para archivos subidos por usuarios (root level)"
    }
  }
};

module.exports = streamingBackendContext;