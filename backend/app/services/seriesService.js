// services/seriesService.js

// Sistema centralizado de errores y logging
const BaseService = require('./BaseService');
const ErrorFactory = require('../utils/errors/ErrorFactory');
const { updateTable } = require('../utils/database/updateAbtraction'); // Función genérica para actualización de tablas
const { config } = require('../config/config');
const { processAndUploadCover } = require('../utils/media/image/imageProcessor');
const { deleteFilesByPrefix } = require('../utils/storage/aws');
const { configureAuditContext } = require('../utils/database/configureAuditContext');
const { fileExists, deleteTempDir } = require('../utils/storage/fileHelpers');

/**
 * Clase que gestiona las operaciones relacionadas con las series.
 * Extiende BaseService para usar el sistema centralizado de errores y logging.
 */
class SeriesService extends BaseService {
  constructor() {
    super('SeriesService'); // Inicializar BaseService con nombre del servicio
    
    this.logger.info('SeriesService inicializado correctamente');
  }

  // Los métodos calculateFileHash y checkIfFileExistsInDatabase 
  // ahora se heredan de BaseService

  async checkIfCoverExistsInDatabase(fileHash) {
    try {
      this.logger.debug('Verificando si la portada ya existe en la base de datos', { fileHash });
      
      const query = 'SELECT id FROM series WHERE cover_image = $1 LIMIT 1';
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

  /**
   * Obtiene todas las series ordenadas por año de lanzamiento.
   * @returns {Promise<Array>} Lista de series.
   */
  async find() {
    try {
      this.logger.debug('Iniciando búsqueda de todas las series');
      
      const query = `
      SELECT 
        se.*,
        c.name as category_name,
        COUNT(ep.id) as episodes_count
      FROM series se
      LEFT JOIN categories c ON c.id = se.category_id  
      LEFT JOIN episodes ep ON ep.serie_id = se.id
      GROUP BY se.id, c.name
      ORDER BY se.release_year DESC
    `;
      
      const result = await this.executeQuery(query, [], 'find_all_series');
      
      this.logger.info('Series obtenidas exitosamente', { 
        count: result.rows.length 
      });
      
      return result.rows;
    } catch (error) {
      this.logger.error('Error al obtener series', { error: error.message });
      throw error;
    }
  }

  /**
   * Busca una serie por su ID.
   * @param {number} id - ID de la serie a buscar.
   * @returns {Object} Datos de la serie encontrada.
   * @throws {Error} Error si la serie no existe.
   */
  async findOne(id) {
    try {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'serie');
      
      this.logger.debug('Buscando serie por ID', { serieId: validId });
      
      const query = 'SELECT * FROM series WHERE id = $1';
      const result = await this.executeQuery(query, [validId], 'find_serie_by_id');
      
      // Validar que la serie exists usando BaseService
      const serie = this.validateResourceExists(result.rows[0], 'SERIES', validId);
      
      this.logger.info('Serie encontrada exitosamente', { 
        serieId: validId,
        serieTitle: serie.title 
      });
      
      return serie;
    } catch (error) {
      this.logger.error('Error al buscar serie por ID', { 
        serieId: id,
        error: error.message 
      });
      throw error;
    }
  }

  async checkExistByTitleAndYear(title, releaseYear) {
    try {
      this.logger.debug('Verificando duplicado por título y año', { title, releaseYear });
      
      const query = `
      SELECT * FROM series 
      WHERE title_normalized = $1
      AND release_year = $2
      `;

      const result = await this.executeQuery(query, [
        title.toLowerCase(),
        releaseYear,
      ], 'check_serie_duplicate');

      const exists = result.rows.length > 0;
      this.logger.debug('Verificación de duplicado completada', { title, releaseYear, exists });
      
      return exists;
    } catch (error) {
      this.logger.error('Error al verificar duplicado de serie', { 
        title,
        releaseYear,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Busca series por nombre.
   * @param {string} title - Nombre (o parte del nombre) de la serie a buscar.
   * @returns {Promise<Array>} - Lista de series que coinciden con la consulta.
   */
  async findByName(title) {
    try {
      if (!title) {
        this.logger.warn('Intento de búsqueda con título vacío');
        return [];
      }
      
      this.logger.debug('Buscando serie por nombre', { title });
      
      const query = `
        SELECT s.*
        FROM series s
        WHERE title_normalized LIKE $1
      `;

      const params = [`%${title.toLowerCase()}%`];
      const result = await this.executeQuery(query, params, 'find_serie_by_name');
      
      this.logger.info('Búsqueda por nombre completada', { 
        title,
        count: result.rows.length 
      });
      
      return result.rows;
    } catch (error) {
      this.logger.error('Error al buscar serie por nombre', { 
        title,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Crea una nueva serie.
   * - Verifica existencia de archivos (portada).
   * - Procesa la portada y la sube a MinIO.
   * - Inserta registro en la tabla series.
   * @param {Object} serieInfo - Información de la serie.
   * @returns {Object} Confirmación de creación.
   * @throws {Error} Error si la serie ya existe o hay problemas con archivos.
   */
  async create(serieInfo) {
    const {
      title,
      description,
      categoryId,
      releaseYear,
      coverImage,
      user,
      ip,
    } = serieInfo;

    try {
      this.logger.info('Iniciando creación de nueva serie', { 
        title,
        releaseYear,
        categoryId 
      });

      const coverFileHash = await this.calculateFileHash(coverImage);
      
      // Validaciones previas fuera de la transacción
      if (!(await fileExists(coverImage))) {
        this.logger.warn('Imagen de portada no encontrada', { coverImage });
        throw ErrorFactory.badRequest('SERIES', 'COVER_NOT_FOUND', {
          operation: 'create_serie',
          coverPath: coverImage
        });
      }

      if (await this.checkIfCoverExistsInDatabase(coverFileHash)) {
        this.logger.warn('Intento de creación con portada duplicada', { 
          title,
          coverFileHash 
        });
        throw ErrorFactory.conflict('SERIES', 'cover_image', coverFileHash, {
          operation: 'create_serie',
          attemptedTitle: title
        });
      }

      if (await this.checkExistByTitleAndYear(title, releaseYear)) {
        this.logger.warn('Intento de creación con serie duplicada', { 
          title,
          releaseYear 
        });
        throw ErrorFactory.conflict('SERIES', 'title_and_year', `${title} (${releaseYear})`, {
          operation: 'create_serie',
          title,
          releaseYear
        });
      }

      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {
        await configureAuditContext(client, user.id, ip);

        this.logger.debug('Procesando y subiendo portada', { coverFileHash });
        await processAndUploadCover(coverImage, coverFileHash);

        // Insertar la serie en la tabla "series"
        const insertQuery = `
          INSERT INTO series (
            title,
            cover_image,
            description,
            category_id,
            release_year
          ) VALUES ($1, $2, $3, $4, $5)
          RETURNING id
        `;
        
        const seriesResult = await client.query(insertQuery, [
          title, 
          coverFileHash, 
          description, 
          categoryId, 
          releaseYear
        ]);

        if (seriesResult.rowCount === 0) {
          throw ErrorFactory.internal('SERIES', 'CREATE_FAILED', {
            operation: 'create_serie',
            title
          });
        }

        const newSerie = {
          serieId: seriesResult.rows[0].id,
          title,
          message: 'Serie creada exitosamente',
        };
        
        this.logger.info('Serie creada exitosamente', { 
          serieId: newSerie.serieId,
          title,
          releaseYear 
        });

        return newSerie;
      }, 'create_serie');

      return result;
    } catch (error) {
      this.logger.error('Error al crear serie', { 
        title,
        releaseYear,
        error: error.message 
      });
      throw error;
    } finally {
      // Cleanup se ejecuta siempre, sin importar si la transacción falló
      await deleteTempDir(coverImage);
    }
  }

  /**
   * Actualiza una serie existente.
   * @param {number} id - ID de la serie a actualizar.
   * @param {Object} changes - Datos a actualizar { title, categoryId, releaseYear, description, coverImage }.
   * @returns {Object} Confirmación de actualización.
   */
  async update(id, changes) {
    return await this.withTransaction(async (client) => {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'serie');
      
      this.logger.info('Iniciando actualización de serie', { 
        serieId: validId,
        changes: Object.keys(changes) 
      });
      
      const { title, releaseYear, coverImage } = changes;
      
      // Obtener serie actual
      const serie = await this.findOne(validId);

      // Validar duplicados solo si título o año han cambiado
      if ((title && title !== serie.title) || (releaseYear && releaseYear !== serie.release_year)) {
        const checkTitle = title || serie.title;
        const checkYear = releaseYear || serie.release_year;
        
        this.logger.debug('Validando nuevo título y año únicos', { 
          checkTitle,
          checkYear,
          currentTitle: serie.title,
          currentYear: serie.release_year 
        });
        
        if (await this.checkExistByTitleAndYear(checkTitle, checkYear)) {
          this.logger.warn('Intento de actualización con serie duplicada', { 
            serieId: validId,
            attemptedTitle: checkTitle,
            attemptedYear: checkYear 
          });
          throw ErrorFactory.conflict('SERIES', 'title_and_year', `${checkTitle} (${checkYear})`, {
            operation: 'update_serie',
            serieId: validId,
            title: checkTitle,
            releaseYear: checkYear
          });
        }
      }

      if (coverImage) {
        this.logger.debug('Procesando nueva portada', { serieId: validId });
        
        const coverFileHash = await this.calculateFileHash(coverImage);

        if (await this.checkIfCoverExistsInDatabase(coverFileHash)) {
          this.logger.warn('Intento de actualización con portada duplicada', { 
            serieId: validId,
            coverFileHash 
          });
          throw ErrorFactory.conflict('SERIES', 'cover_image', coverFileHash, {
            operation: 'update_serie',
            serieId: validId
          });
        }

        // Eliminar portada anterior
        const remoteCoverPath = `${config.coversDir}/${serie.cover_image}`;
        await deleteFilesByPrefix(remoteCoverPath);

        // Procesa y sube la nueva portada
        await processAndUploadCover(changes.coverImage, coverFileHash);
        await deleteTempDir(changes.coverImage);
        changes.coverImage = coverFileHash;
        
        this.logger.debug('Nueva portada procesada exitosamente', { 
          serieId: validId,
          newCoverHash: coverFileHash 
        });
      }

      const result = await updateTable(client, 'series', serie.id, changes);
      
      this.logger.info('Serie actualizada exitosamente', { 
        serieId: validId,
        updatedFields: Object.keys(changes) 
      });
      
      return result;
    }, 'update_serie');
  }

  /**
   * Elimina una serie por su ID.
   * - Elimina archivos relacionados de MinIO (videos y portada)
   * - PostgreSQL elimina automáticamente episodios y videos por CASCADE/TRIGGERS
   * @param {number} id - ID de la serie a eliminar.
   * @returns {Object} Confirmación de eliminación con estadísticas.
   * @throws {Error} Error si la serie no existe.
   */
  async delete(id) {
    return await this.withTransaction(async (client) => {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'serie');
      
      this.logger.info('Iniciando eliminación de serie', { serieId: validId });
      
      // PASO 1: Obtener información ANTES de eliminar (para MinIO y estadísticas)
      const serieInfoQuery = `
        SELECT 
          s.id, 
          s.title, 
          s.cover_image,
          COUNT(ep.id) as total_episodes,
          array_agg(DISTINCT vi.file_hash) FILTER (WHERE vi.file_hash IS NOT NULL) as video_hashes
        FROM series s
        LEFT JOIN episodes ep ON s.id = ep.serie_id
        LEFT JOIN videos vi ON ep.video_id = vi.id
        WHERE s.id = $1
        GROUP BY s.id, s.title, s.cover_image
      `;

      const infoResult = await client.query(serieInfoQuery, [validId]);

      // Validar que la serie existe usando BaseService
      const serieInfo = this.validateResourceExists(infoResult.rows[0], 'SERIES', validId);
      const videoHashes = serieInfo.video_hashes && serieInfo.video_hashes[0] !== null ? serieInfo.video_hashes : [];

      this.logger.info('Serie encontrada para eliminación', { 
        serieId: validId,
        title: serieInfo.title,
        totalEpisodes: serieInfo.total_episodes,
        videoCount: videoHashes.length 
      });

      // PASO 2: Eliminar archivos de MinIO (lo único que no puede hacer PostgreSQL)
      if (videoHashes.length > 0) {
        this.logger.info('Eliminando archivos de video de MinIO', { 
          serieId: validId,
          videoCount: videoHashes.length 
        });

        for (const hash of videoHashes) {
          if (hash) {
            const remotePath = `${config.videoDir}/${hash}`;
            try {
              await deleteFilesByPrefix(remotePath);
              this.logger.debug('Video eliminado de MinIO', { serieId: validId, videoHash: hash });
            } catch (error) {
              this.logger.warn('Error eliminando video de MinIO', { 
                serieId: validId,
                videoHash: hash,
                error: error.message 
              });
              // Continuar con otros archivos aunque uno falle
            }
          }
        }
      }

      // Eliminar portada de MinIO
      if (serieInfo.cover_image) {
        const remoteCoverPath = `${config.coversDir}/${serieInfo.cover_image}`;
        try {
          await deleteFilesByPrefix(remoteCoverPath);
          this.logger.debug('Portada eliminada de MinIO', { 
            serieId: validId,
            coverHash: serieInfo.cover_image 
          });
        } catch (error) {
          this.logger.warn('Error eliminando portada de MinIO', { 
            serieId: validId,
            coverHash: serieInfo.cover_image,
            error: error.message 
          });
        }
      }

      // PASO 3: Eliminar serie de la base de datos (CASCADE elimina episodios y triggers eliminan videos)
      this.logger.debug('Eliminando serie de la base de datos', { serieId: validId });
      const deleteResult = await client.query('DELETE FROM series WHERE id = $1', [validId]);

      if (deleteResult.rowCount === 0) {
        throw ErrorFactory.internal('SERIES', 'DELETE_FAILED', {
          operation: 'delete_serie',
          serieId: validId
        });
      }

      const result = {
        message: 'Serie eliminada exitosamente',
        serieId: validId,
        serieTitle: serieInfo.title,
        statistics: {
          episodesDeleted: parseInt(serieInfo.total_episodes) || 0,
          videosDeleted: videoHashes.length,
          coverDeleted: !!serieInfo.cover_image
        },
        automaticDeletion: {
          episodesCascade: true,
          videosTrigger: true,
          minioFiles: true
        }
      };

      this.logger.info('Serie eliminada exitosamente', { 
        serieId: validId,
        title: serieInfo.title,
        statistics: result.statistics 
      });
      
      return result;
    }, 'delete_serie');
  }
}

module.exports = SeriesService;
