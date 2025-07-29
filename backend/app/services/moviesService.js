// services/moviesService.js

// Sistema centralizado de errores y logging
const BaseService = require('./BaseService');
const ErrorFactory = require('../utils/errors/ErrorFactory');
const { updateTable } = require('../utils/database/updateAbtraction'); // Función genérica para actualización de tablas
const { transcode } = require('../utils/media/video/mp4-transcoder');
const { config } = require('../config/config');
const { processAndUploadCover } = require('../utils/media/image/imageProcessor');
const { deleteFilesByPrefix } = require('../utils/storage/aws');
const { configureAuditContext } = require('../utils/database/configureAuditContext');
const { fileExists, deleteTempDir } = require('../utils/storage/fileHelpers');

/**
 * Clase que gestiona las operaciones relacionadas con las películas.
 * Extiende BaseService para usar el sistema centralizado de errores y logging.
 */
class MoviesService extends BaseService {
  constructor() {
    super('MoviesService'); // Inicializar BaseService con nombre del servicio
    
    this.logger.info('MoviesService inicializado correctamente');
  }

  // Los métodos calculateFileHash y checkIfFileExistsInDatabase 
  // ahora se heredan de BaseService

  /**
   * Obtiene todas las películas, incluyendo algunos datos del video asociado.
   * @returns {Promise<Array>} Lista de películas.
   */
  async find() {
    try {
      this.logger.debug('Iniciando búsqueda de todas las películas');
      
      const query = `
      SELECT 
        m.*,
        vi.file_hash, 
        vi.available_resolutions,
        c.name as category_name
      FROM movies m
      LEFT JOIN videos vi ON vi.id = m.video_id
      LEFT JOIN categories c ON c.id = m.category_id
      ORDER BY m.release_year DESC
    `;
      
      const result = await this.executeQuery(query, [], 'find_all_movies');
      
      this.logger.info('Películas obtenidas exitosamente', { 
        count: result.rows.length 
      });
      
      return result.rows;
    } catch (error) {
      this.logger.error('Error al obtener películas', { error: error.message });
      throw error;
    }
  }

  /**
   * Obtiene una película por su ID, incluyendo información del video asociado.
   * @param {number} id - ID de la película a buscar.
   * @returns {Object} Datos de la película encontrada con información del video.
   * @throws {Error} Error si la película no existe.
   */
  async findOne(id) {
    try {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'película');
      
      this.logger.debug('Buscando película por ID', { movieId: validId });
      
      const query = `
        SELECT 
          m.*,
          vi.file_hash, 
          vi.available_resolutions,
          vi.available_subtitles,
          vi.duration,
          c.name as category_name
        FROM movies m
        LEFT JOIN videos vi ON vi.id = m.video_id
        LEFT JOIN categories c ON c.id = m.category_id
        WHERE m.id = $1
      `;
      
      const result = await this.executeQuery(query, [validId], 'find_movie_by_id');
      
      // Validar que la película existe usando BaseService
      const movie = this.validateResourceExists(result.rows[0], 'MOVIES', validId);
      
      this.logger.info('Película encontrada exitosamente', { 
        movieId: validId,
        movieTitle: movie.title 
      });
      
      return movie;
    } catch (error) {
      this.logger.error('Error al buscar película por ID', { 
        movieId: id,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Obtiene una película por su hash de archivo, incluyendo información del video asociado.
   * @param {string} fileHash - Hash del archivo de video.
   * @returns {Object} Datos de la película encontrada con información del video.
   * @throws {Error} Error si la película no existe.
   */
  async findByFileHash(fileHash) {
    try {
      if (!fileHash) {
        this.logger.warn('Intento de búsqueda con fileHash vacío');
        return null;
      }
      
      this.logger.debug('Buscando película por fileHash', { fileHash });
      
      const query = `
        SELECT 
          m.*,
          vi.file_hash, 
          vi.available_resolutions,
          vi.available_subtitles,
          vi.duration,
          c.name as category_name
        FROM movies m
        LEFT JOIN videos vi ON vi.id = m.video_id
        LEFT JOIN categories c ON c.id = m.category_id
        WHERE vi.file_hash = $1
      `;
      
      const result = await this.executeQuery(query, [fileHash], 'find_movie_by_hash');
      
      // Validar que la película existe usando BaseService
      const movie = this.validateResourceExists(result.rows[0], 'MOVIES', fileHash);
      
      this.logger.info('Película encontrada por fileHash', { 
        fileHash,
        movieId: movie.id,
        movieTitle: movie.title 
      });
      
      return movie;
    } catch (error) {
      this.logger.error('Error al buscar película por fileHash', { 
        fileHash,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Busca películas por nombre.
   * @param {string} title - Nombre (o parte del nombre) del video a buscar.
   * @returns {Promise<Array>} Lista de películas que coinciden.
   */
  async findByName(title) {
    try {
      if (!title) {
        this.logger.warn('Intento de búsqueda con título vacío');
        return [];
      }
      
      this.logger.debug('Buscando película por nombre', { title });
      
      const query = `
        SELECT m.*
        FROM movies m
        WHERE title_normalized LIKE $1
      `;
      const params = [`%${title.toLowerCase()}%`];
      
      const result = await this.executeQuery(query, params, 'find_movie_by_name');
      
      this.logger.info('Búsqueda por nombre completada', { 
        title,
        count: result.rows.length 
      });
      
      return result.rows;
    } catch (error) {
      this.logger.error('Error al buscar película por nombre', { 
        title,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Busca películas por rango de años de lanzamiento.
   * @param {number} fromYear - Año inicial del rango.
   * @param {number} toYear - Año final del rango.
   * @returns {Promise<Array>} Lista de películas en el rango de años especificado.
   */
  async searchByYearRange(fromYear, toYear) {
    try {
      this.logger.debug('Buscando películas por rango de años', { fromYear, toYear });
      
      const query = `
        SELECT 
          m.*,
          vi.file_hash, 
          vi.available_resolutions,
          c.name as category_name
        FROM movies m
        LEFT JOIN videos vi ON vi.id = m.video_id
        LEFT JOIN categories c ON c.id = m.category_id
        WHERE m.release_year >= $1 AND m.release_year <= $2
        ORDER BY m.release_year DESC, m.title ASC
      `;
      const params = [fromYear, toYear];
      
      const result = await this.executeQuery(query, params, 'find_movies_by_year_range');
      
      this.logger.info('Búsqueda por rango de años completada', { 
        fromYear,
        toYear,
        count: result.rows.length 
      });
      
      return result.rows;
    } catch (error) {
      this.logger.error('Error al buscar películas por rango de años', { 
        fromYear,
        toYear,
        error: error.message 
      });
      throw error;
    }
  }

  async checkIfCoverExistsInDatabase(fileHash) {
    try {
      this.logger.debug('Verificando si la portada ya existe en la base de datos', { fileHash });
      
      const query = 'SELECT id FROM movies WHERE cover_image = $1 LIMIT 1';
      const result = await this.executeQuery(query, [fileHash], 'check_cover_exists');
      
      const exists = result.rows.length > 0;
      this.logger.debug('Verificación de portada completada', { fileHash, exists });
      
      return exists;
    } catch (error) {
      this.logger.error('Error al verificar existencia de portada', { 
        fileHash,
        error: error.message 
      });
      throw error;
    }
  }

  async checkExistByTitleAndYear(title, releaseYear) {
    try {
      this.logger.debug('Verificando duplicado por título y año', { title, releaseYear });
      
      const query = `
      SELECT * FROM movies 
      WHERE title_normalized = $1
      AND release_year = $2
      `;

      const result = await this.executeQuery(query, [
        title.toLowerCase(),
        releaseYear,
      ], 'check_movie_duplicate');

      const exists = result.rows.length > 0;
      this.logger.debug('Verificación de duplicado completada', { title, releaseYear, exists });
      
      return exists;
    } catch (error) {
      this.logger.error('Error al verificar duplicado de película', { 
        title,
        releaseYear,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Sube una película:
   * - Verifica existencia de archivos (video y portada).
   * - Procesa la portada y la sube a MinIO.
   * - Transcodifica el video en varias calidades y sube cada resultado.
   * - Inserta registros en las tablas videos y movies.
   * @param {Object} movieInfo - Información de la película.
   * @param {function} onProgress - Callback para el progreso de transcodificación.
   * @returns {Object} Mensaje de éxito.
   */
  async create(movieInfo, onProgress) {
    const {
      title,
      description,
      categoryId,
      releaseYear,
      video,
      coverImage,
      user,
      ip,
    } = movieInfo;

    try {
      this.logger.info('Iniciando creación de nueva película', { 
        title,
        releaseYear,
        categoryId 
      });

      const videoFileHash = await this.calculateFileHash(video);
      const coverFileHash = await this.calculateFileHash(coverImage);
      
      // Validaciones previas fuera de la transacción
      if (!(await fileExists(video))) {
        this.logger.warn('Archivo de video no encontrado', { video });
        throw ErrorFactory.badRequest('MOVIES', 'VIDEO_NOT_FOUND', {
          operation: 'create_movie',
          videoPath: video
        });
      }
      
      if (!(await fileExists(coverImage))) {
        this.logger.warn('Imagen de portada no encontrada', { coverImage });
        throw ErrorFactory.badRequest('MOVIES', 'COVER_NOT_FOUND', {
          operation: 'create_movie',
          coverPath: coverImage
        });
      }
      
      if (await this.checkIfFileExistsInDatabase(videoFileHash)) {
        this.logger.warn('Intento de creación con video duplicado', { 
          title,
          videoFileHash 
        });
        throw ErrorFactory.conflict('MOVIES', 'video_hash', videoFileHash, {
          operation: 'create_movie',
          attemptedTitle: title
        });
      }

      if (await this.checkIfCoverExistsInDatabase(coverFileHash)) {
        this.logger.warn('Intento de creación con portada duplicada', { 
          title,
          coverFileHash 
        });
        throw ErrorFactory.conflict('MOVIES', 'cover_image', coverFileHash, {
          operation: 'create_movie',
          attemptedTitle: title
        });
      }

      if (await this.checkExistByTitleAndYear(title, releaseYear)) {
        this.logger.warn('Intento de creación con película duplicada', { 
          title,
          releaseYear 
        });
        throw ErrorFactory.conflict('MOVIES', 'title_and_year', `${title} (${releaseYear})`, {
          operation: 'create_movie',
          title,
          releaseYear
        });
      }

      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {
        await configureAuditContext(client, user.id, ip);

        this.logger.debug('Procesando y subiendo portada', { coverFileHash });
        await processAndUploadCover(coverImage, coverFileHash);

        // Transcodifica el video y sube cada calidad a MinIO
        this.logger.debug('Iniciando transcodificación de video', { videoFileHash });
        const { availableResolutions, availableSubtitles, duration } =
          await transcode(video, videoFileHash, onProgress);

        // Inserta registro en la tabla videos
        const insertQuery = `
          INSERT INTO videos (
            file_hash,
            available_resolutions,
            available_subtitles,
            duration
          ) VALUES ($1, $2, $3, $4)
          RETURNING id
        `;
        
        // Validate duration before inserting
        let validDuration = null;
        if (duration && !isNaN(parseFloat(duration)) && isFinite(duration)) {
          validDuration = `${duration} seconds`;
        }
        
        const videoResult = await client.query(insertQuery, [
          videoFileHash,
          JSON.stringify(availableResolutions),
          JSON.stringify(availableSubtitles),
          validDuration,
        ]);

        if (videoResult.rows.length === 0) {
          throw ErrorFactory.internal('MOVIES', 'VIDEO_INSERT_FAILED', {
            operation: 'create_movie',
            videoFileHash
          });
        }

        const videoId = videoResult.rows[0].id;
        this.logger.debug('Video insertado exitosamente', { videoId, videoFileHash });

        const insertQueryMovie = `
        INSERT INTO movies (
          title,
          cover_image,
          description,
          category_id,
          video_id,
          release_year
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (title_normalized, release_year) DO NOTHING
        RETURNING id
        `;

        // Inserta registro en la tabla movies
        const movieResult = await client.query(insertQueryMovie, [
          title,
          coverFileHash,
          description,
          categoryId,
          videoId,
          releaseYear,
        ]);

        if (movieResult.rowCount === 0) {
          throw ErrorFactory.conflict('MOVIES', 'title_and_year', `${title} (${releaseYear})`, {
            operation: 'create_movie',
            title,
            releaseYear
          });
        }

        const newMovie = {
          movieId: movieResult.rows[0].id,
          title,
          message: 'Película creada exitosamente',
        };
        
        this.logger.info('Película creada exitosamente', { 
          movieId: newMovie.movieId,
          title,
          releaseYear 
        });

        return newMovie;
      }, 'create_movie');

      return result;
    } catch (error) {
      this.logger.error('Error al crear película', { 
        title,
        releaseYear,
        error: error.message 
      });
      throw error;
    } finally {
      // Cleanup se ejecuta siempre, sin importar si la transacción falló
      await deleteTempDir(video);
      await deleteTempDir(coverImage);
      if (movieInfo.isTemporaryCoverImage && coverImage) {
        try {
          const { cleanupTempFile } = require('../utils/media/image/imageDownloader');
          cleanupTempFile(coverImage);
        } catch (error) {
          this.logger.warn('Error limpiando imagen temporal', { 
            coverImage,
            error: error.message 
          });
        }
      }
    }
  }

  /**
   * Actualiza una película cambiando el título, categoría, año de lanzamiento, descripción y portada.
   * @param {number} id - ID de la película a actualizar.
   * @param {Object} changes - Datos a actualizar { title, categoryId, releaseYear, description, coverImage }.
   * @returns {Object} Registro actualizado.
   */
  async update(id, changes) {
    return await this.withTransaction(async (client) => {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'película');
      
      this.logger.info('Iniciando actualización de película', { 
        movieId: validId,
        changes: Object.keys(changes) 
      });
      
      const { title, releaseYear, coverImage } = changes;
      
      // Obtener película actual
      const movie = await this.findOne(validId);

      // Validar duplicados solo si título o año han cambiado
      if ((title && title !== movie.title) || (releaseYear && releaseYear !== movie.release_year)) {
        const checkTitle = title || movie.title;
        const checkYear = releaseYear || movie.release_year;
        
        this.logger.debug('Validando nuevo título y año únicos', { 
          checkTitle,
          checkYear,
          currentTitle: movie.title,
          currentYear: movie.release_year 
        });
        
        if (await this.checkExistByTitleAndYear(checkTitle, checkYear)) {
          this.logger.warn('Intento de actualización con película duplicada', { 
            movieId: validId,
            attemptedTitle: checkTitle,
            attemptedYear: checkYear 
          });
          throw ErrorFactory.conflict('MOVIES', 'title_and_year', `${checkTitle} (${checkYear})`, {
            operation: 'update_movie',
            movieId: validId,
            title: checkTitle,
            releaseYear: checkYear
          });
        }
      }

      if (coverImage) {
        this.logger.debug('Procesando nueva portada', { movieId: validId });
        
        const coverFileHash = await this.calculateFileHash(coverImage);

        if (await this.checkIfCoverExistsInDatabase(coverFileHash)) {
          this.logger.warn('Intento de actualización con portada duplicada', { 
            movieId: validId,
            coverFileHash 
          });
          throw ErrorFactory.conflict('MOVIES', 'cover_image', coverFileHash, {
            operation: 'update_movie',
            movieId: validId
          });
        }

        // Eliminar portada anterior
        const remoteCoverPath = `${config.coversDir}/${movie.cover_image}`;
        await deleteFilesByPrefix(remoteCoverPath);

        // Procesa y sube la nueva portada
        await processAndUploadCover(changes.coverImage, coverFileHash);
        await deleteTempDir(changes.coverImage);
        changes.coverImage = coverFileHash;
        
        this.logger.debug('Nueva portada procesada exitosamente', { 
          movieId: validId,
          newCoverHash: coverFileHash 
        });
      }

      const result = await updateTable(client, 'movies', movie.id, changes);
      
      this.logger.info('Película actualizada exitosamente', { 
        movieId: validId,
        updatedFields: Object.keys(changes) 
      });
      
      return result;
    }, 'update_movie');
  }

  /**
   * Elimina una película por su ID y remueve los archivos asociados en MinIO.
   * @param {number} id - ID de la película a eliminar.
   * @returns {Object} Confirmación de eliminación.
   */
  async delete(id) {
    return await this.withTransaction(async (client) => {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'película');
      
      this.logger.info('Iniciando eliminación de película', { movieId: validId });
      
      // Obtener información ANTES de eliminar (para MinIO y estadísticas)
      const movie = await this.findOne(validId);

      // Consulta la tabla de videos para obtener el file_hash
      const videoResult = await client.query(
        'SELECT file_hash FROM videos WHERE id = $1',
        [movie.video_id]
      );
      
      if (videoResult.rowCount === 0) {
        this.logger.warn('Video asociado no encontrado', { 
          movieId: validId,
          videoId: movie.video_id 
        });
        throw ErrorFactory.notFound('VIDEOS', movie.video_id, {
          operation: 'delete_movie',
          movieId: validId
        });
      }
      
      const { file_hash } = videoResult.rows[0];

      this.logger.info('Película encontrada para eliminación', { 
        movieId: validId,
        title: movie.title,
        videoHash: file_hash 
      });

      // Eliminar archivos de MinIO primero
      this.logger.info('Eliminando archivos de MinIO', { 
        movieId: validId,
        videoHash: file_hash 
      });

      // Rutas remotas a eliminar en MinIO
      const remoteCoverPath = `${config.coversDir}/${movie.cover_image}`;
      const remoteVideoPaths = `${config.videoDir}/${file_hash}`;

      try {
        await deleteFilesByPrefix(remoteCoverPath);
        this.logger.debug('Portada eliminada de MinIO', { 
          movieId: validId,
          coverHash: movie.cover_image 
        });
      } catch (error) {
        this.logger.warn('Error eliminando portada de MinIO', { 
          movieId: validId,
          coverHash: movie.cover_image,
          error: error.message 
        });
      }

      try {
        await deleteFilesByPrefix(remoteVideoPaths);
        this.logger.debug('Video eliminado de MinIO', { 
          movieId: validId,
          videoHash: file_hash 
        });
      } catch (error) {
        this.logger.warn('Error eliminando video de MinIO', { 
          movieId: validId,
          videoHash: file_hash,
          error: error.message 
        });
      }

      // Eliminar de la base de datos
      this.logger.debug('Eliminando película de la base de datos', { movieId: validId });
      
      const deleteMovieQuery = `DELETE FROM movies WHERE id = $1`;
      const deleteMovieResult = await client.query(deleteMovieQuery, [validId]);

      if (deleteMovieResult.rowCount === 0) {
        throw ErrorFactory.internal('MOVIES', 'DELETE_FAILED', {
          operation: 'delete_movie',
          movieId: validId
        });
      }

      // Eliminar el video de la base de datos
      const deleteVideoQuery = `DELETE FROM videos WHERE id = $1`;
      await client.query(deleteVideoQuery, [movie.video_id]);

      const result = {
        message: 'Película eliminada exitosamente',
        movieId: validId,
        movieTitle: movie.title,
        statistics: {
          videoDeleted: true,
          coverDeleted: !!movie.cover_image
        },
        automaticDeletion: {
          minioFiles: true
        }
      };

      this.logger.info('Película eliminada exitosamente', { 
        movieId: validId,
        title: movie.title,
        statistics: result.statistics 
      });
      
      return result;
    }, 'delete_movie');
  }
}

module.exports = MoviesService;
