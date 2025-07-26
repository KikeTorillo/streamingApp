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
    "services/": "Lógica de negocio (Movies, Series, Episodes, Auth, Users, Categories)",
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
  // SERVICIOS PRINCIPALES
  // ==========================================
  services: {
    // Patrón común para todos los servicios
    servicePattern: {
      methods: ["find()", "findOne(id)", "create(data)", "update(id, data)", "delete(id)"],
      errorHandling: "Boom.js para errores HTTP estructurados",
      database: "PostgreSQL pool connection",
      validation: "Joi schemas en middleware"
    },

    MoviesService: {
      description: "Gestión de películas con procesamiento de video",
      specialMethods: [
        "findByHash(fileHash)", 
        "calculateFileHash(filePath)",
        "checkIfFileExistsInDatabase(fileHash)"
      ],
      processes: "Video transcoding + cover image processing"
    },

    SeriesService: {
      description: "Gestión de series de TV",
      relationships: "Serie -> Episodes (1:N)",
      coverHandling: "URL externa o archivo subido"
    },

    EpisodesService: {
      description: "Gestión de episodios individuales",
      parentRelation: "Pertenece a una Serie",
      videoProcessing: "Similar a Movies pero con metadata de serie"
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
  // PATRONES COMUNES
  // ==========================================
  commonPatterns: {
    serviceCreation: "const service = new ServiceClass()",
    errorThrow: "throw boom.notFound('Message')",
    validation: "validatorHandler(schema, 'body')",
    authentication: "authenticateJwt + checkRoles(['role'])",
    auditContext: "configureAuditContext(req.user, req.ip)",
    asyncProcessing: "Task ID + progress map para operaciones largas"
  },

  // ==========================================
  // PATRONES DE IMPORTS ACTUALIZADOS
  // ==========================================
  importPatterns: {
    description: "Paths actualizados después de reorganización funcional",
    examples: {
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
    
    organizationPrinciple: "Los imports reflejan la estructura funcional: utils/{domain}/{functionality}",
    tempFolders: {
      "temp_downloads/": "Para imágenes descargadas desde URLs (root level)",
      "tempProcessinDir/": "Para procesamiento de video (root level)", 
      "uploads/": "Para archivos subidos por usuarios (root level)"
    }
  }
};

module.exports = streamingBackendContext;