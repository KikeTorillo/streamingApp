/**
 * @file swagger.js
 * @description Configuración de Swagger/OpenAPI para la documentación interactiva de la API
 */

const swaggerJSDoc = require('swagger-jsdoc');
const { config } = require('./config');

// Configuración básica de OpenAPI
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Streaming App API',
    version: '1.0.0',
    description: `
    **API REST completa para plataforma de streaming de video**
    
    Esta API proporciona endpoints para la gestión completa de una plataforma de streaming, incluyendo:
    - 🔐 Autenticación y autorización con JWT + cookies
    - 🎬 Gestión de películas con transcodificación automática
    - 📺 Administración de series y episodios
    - 👤 Sistema de usuarios con roles (admin, editor, user)
    - 🏷️ Categorización de contenido
    - ⚙️ Preferencias de usuario y progreso de visualización
    - 📁 Upload y procesamiento de archivos multimedia
    
    ## 🔐 Autenticación
    La API utiliza **JWT tokens** almacenados en **HTTP-only cookies** para la autenticación.
    Todas las rutas protegidas requieren autenticación previa mediante \`/auth/login\`.
    
    ## 👥 Roles de Usuario
    - **admin**: Acceso completo a todos los endpoints
    - **editor**: Gestión de contenido (películas, series, episodios)
    - **user**: Solo lectura de contenido
    
    ## 🎬 Procesamiento de Media
    Los archivos de video se procesan de forma asíncrona. Los endpoints de creación retornan un \`taskId\`
    que puede usarse para monitorear el progreso via \`/movies/progress/:taskId\`.
    `,
    contact: {
      name: 'Equipo de Desarrollo',
      email: 'dev@streamingapp.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.backPort || 3001}/api/v1`,
      description: 'Servidor de Desarrollo Local'
    },
    {
      url: 'https://api.streamingapp.com/api/v1',
      description: 'Servidor de Producción'
    }
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
        description: 'JWT token almacenado en HTTP-only cookie'
      }
    },
    schemas: {
      // Esquemas de datos comunes
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único del usuario'
          },
          userName: {
            type: 'string',
            description: 'Nombre de usuario único'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email del usuario'
          },
          roleId: {
            type: 'integer',
            description: 'ID del rol asignado'
          },
          roleName: {
            type: 'string',
            enum: ['admin', 'editor', 'user'],
            description: 'Nombre del rol'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización'
          }
        }
      },
      Movie: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único de la película'
          },
          title: {
            type: 'string',
            description: 'Título de la película'
          },
          description: {
            type: 'string',
            description: 'Descripción de la película'
          },
          categoryId: {
            type: 'integer',
            description: 'ID de la categoría'
          },
          categoryName: {
            type: 'string',
            description: 'Nombre de la categoría'
          },
          coverImage: {
            type: 'string',
            description: 'Hash de la imagen de portada'
          },
          releaseYear: {
            type: 'integer',
            minimum: 1900,
            maximum: 2030,
            description: 'Año de lanzamiento'
          },
          videoId: {
            type: 'integer',
            description: 'ID del video asociado'
          },
          fileHash: {
            type: 'string',
            description: 'Hash SHA256 del archivo de video'
          },
          duration: {
            type: 'string',
            description: 'Duración en formato HH:MM:SS'
          },
          views: {
            type: 'integer',
            description: 'Número de visualizaciones'
          },
          availableResolutions: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['480p', '720p', '1080p', '4k']
            },
            description: 'Resoluciones disponibles'
          },
          availableSubtitles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['es', 'en']
            },
            description: 'Subtítulos disponibles'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Series: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único de la serie'
          },
          title: {
            type: 'string',
            description: 'Título de la serie'
          },
          description: {
            type: 'string',
            description: 'Descripción de la serie'
          },
          categoryId: {
            type: 'integer',
            description: 'ID de la categoría'
          },
          categoryName: {
            type: 'string',
            description: 'Nombre de la categoría'
          },
          coverImage: {
            type: 'string',
            description: 'Hash de la imagen de portada'
          },
          releaseYear: {
            type: 'integer',
            minimum: 1900,
            maximum: 2030,
            description: 'Año de lanzamiento'
          },
          totalEpisodes: {
            type: 'integer',
            description: 'Total de episodios'
          },
          totalSeasons: {
            type: 'integer',
            description: 'Total de temporadas'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Episode: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único del episodio'
          },
          serieId: {
            type: 'integer',
            description: 'ID de la serie padre'
          },
          serieTitle: {
            type: 'string',
            description: 'Título de la serie'
          },
          season: {
            type: 'integer',
            minimum: 1,
            description: 'Número de temporada'
          },
          episodeNumber: {
            type: 'integer',
            minimum: 1,
            description: 'Número de episodio'
          },
          title: {
            type: 'string',
            description: 'Título del episodio'
          },
          description: {
            type: 'string',
            description: 'Descripción del episodio'
          },
          videoId: {
            type: 'integer',
            description: 'ID del video asociado'
          },
          fileHash: {
            type: 'string',
            description: 'Hash SHA256 del archivo de video'
          },
          duration: {
            type: 'string',
            description: 'Duración en formato HH:MM:SS'
          },
          views: {
            type: 'integer',
            description: 'Número de visualizaciones'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Category: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único de la categoría'
          },
          name: {
            type: 'string',
            description: 'Nombre de la categoría'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización'
          }
        }
      },
      UserPreferences: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único de las preferencias'
          },
          userId: {
            type: 'integer',
            description: 'ID del usuario'
          },
          volume: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            description: 'Volumen predeterminado (0.0-1.0)'
          },
          playbackRate: {
            type: 'number',
            enum: [0.5, 1.0, 1.25, 1.5, 2.0],
            description: 'Velocidad de reproducción'
          },
          autoplay: {
            type: 'boolean',
            description: 'Reproducción automática'
          },
          muted: {
            type: 'boolean',
            description: 'Silenciado por defecto'
          },
          defaultQuality: {
            type: 'string',
            enum: ['auto', '480p', '720p', '1080p', '4k'],
            description: 'Calidad de video predeterminada'
          },
          preferredLanguage: {
            type: 'string',
            enum: ['es', 'en'],
            description: 'Idioma preferido'
          },
          subtitlesEnabled: {
            type: 'boolean',
            description: 'Subtítulos habilitados'
          },
          watchProgress: {
            type: 'object',
            description: 'Progreso de visualización por contenido'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      TaskProgress: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['processing', 'transcoding', 'completed', 'failed'],
            description: 'Estado actual de la tarea'
          },
          progress: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
            description: 'Porcentaje de progreso (0-100)'
          },
          error: {
            type: 'string',
            nullable: true,
            description: 'Mensaje de error si status = failed'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Descripción del error'
          },
          message: {
            type: 'string',
            description: 'Mensaje detallado del error'
          },
          statusCode: {
            type: 'integer',
            description: 'Código de estado HTTP'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Momento en que ocurrió el error'
          }
        }
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'Token de autenticación inválido o faltante',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              error: 'Unauthorized',
              message: 'Token JWT inválido o expirado',
              statusCode: 401,
              timestamp: '2024-01-01T00:00:00.000Z'
            }
          }
        }
      },
      ForbiddenError: {
        description: 'Permisos insuficientes para esta operación',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              error: 'Forbidden',
              message: 'Permisos insuficientes',
              statusCode: 403,
              timestamp: '2024-01-01T00:00:00.000Z'
            }
          }
        }
      },
      NotFoundError: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              error: 'Not Found',
              message: 'El recurso solicitado no existe',
              statusCode: 404,
              timestamp: '2024-01-01T00:00:00.000Z'
            }
          }
        }
      },
      ValidationError: {
        description: 'Error de validación en los datos de entrada',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              error: 'Bad Request',
              message: 'Datos de entrada inválidos',
              statusCode: 400,
              timestamp: '2024-01-01T00:00:00.000Z'
            }
          }
        }
      }
    }
  },
  security: [
    {
      cookieAuth: []
    }
  ],
  tags: [
    {
      name: 'Autenticación',
      description: 'Endpoints para login, registro y gestión de sesiones'
    },
    {
      name: 'Películas',
      description: 'CRUD completo de películas con transcodificación automática'
    },
    {
      name: 'Series',
      description: 'Gestión de series de TV'
    },
    {
      name: 'Episodios',
      description: 'Gestión de episodios de series'
    },
    {
      name: 'Categorías',
      description: 'Administración de categorías de contenido'
    },
    {
      name: 'Usuarios',
      description: 'Gestión de usuarios del sistema'
    },
    {
      name: 'Preferencias',
      description: 'Configuraciones y progreso de usuario'
    }
  ]
};

// Opciones para swagger-jsdoc
const options = {
  definition: swaggerDefinition,
  apis: [
    './routes/*.js',  // Archivos de rutas con comentarios JSDoc
    './schemas/*.js'  // Archivos de esquemas si tienen documentación
  ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;