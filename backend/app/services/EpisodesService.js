// services/EpisodesService.js

// Sistema centralizado de errores y logging
const BaseService = require('./BaseService');
const ErrorFactory = require('../utils/errors/ErrorFactory');
const { updateTable } = require('../utils/database/updateAbtraction');
const { transcode } = require('../utils/media/video/mp4-transcoder');
const { config } = require('../config/config');
const { deleteFilesByPrefix } = require('../utils/storage/aws');
const { configureAuditContext } = require('../utils/database/configureAuditContext');
const { fileExists, deleteTempDir } = require('../utils/storage/fileHelpers');

/**
 * Clase que gestiona las operaciones relacionadas con los episodios.
 * Extiende BaseService para usar el sistema centralizado de errores y logging.
 */
class EpisodesService extends BaseService {
  constructor() {
    super('EpisodesService'); // Inicializar BaseService con nombre del servicio
    
    this.logger.info('EpisodesService inicializado correctamente');
  }

  // Los métodos calculateFileHash y checkIfFileExistsInDatabase 
  // ahora se heredan de BaseService

  /**
   * Obtiene episodios de una serie por ID, temporada y/o número de episodio
   * @param {number} serieId - ID de la serie
   * @param {number} season - Temporada (opcional)
   * @param {number} episodeNumber - Número de episodio (opcional)
   * @returns {Promise<Array>} Lista de episodios
   */
  async find(serieId, season = null, episodeNumber = null) {
    try {
      this.logger.debug('Iniciando búsqueda de episodios', { 
        serieId, 
        season, 
        episodeNumber 
      });

      // Verificar que la serie existe
      await this.validateSerieExists(serieId);

      let query;
      const arrayValues = [];
      arrayValues.push(serieId);

      if (season && episodeNumber) {
        query = `
          SELECT 
            ep.*,
            s.title as serie_name,
            v.file_hash,
            v.available_resolutions,
            v.available_subtitles,
            v.duration as video_duration
          FROM episodes ep
          LEFT JOIN series s ON s.id = ep.serie_id
          LEFT JOIN videos v ON ep.video_id = v.id
          WHERE ep.serie_id = $1 AND ep.season = $2 AND ep.episode_number = $3;
        `;
        arrayValues.push(season);
        arrayValues.push(episodeNumber);
      } else if (season) {
        query = `
          SELECT 
            ep.*,
            s.title as serie_name,    
            v.file_hash,
            v.available_resolutions,
            v.available_subtitles,
            v.duration as video_duration
          FROM episodes ep
          LEFT JOIN series s ON s.id = ep.serie_id
          LEFT JOIN videos v ON ep.video_id = v.id
          WHERE ep.serie_id = $1 AND ep.season = $2
          ORDER BY ep.episode_number;
        `;
        arrayValues.push(season);
      } else {
        query = `
          SELECT 
            ep.*,
            s.title as serie_name,
            v.file_hash,
            v.available_resolutions,
            v.available_subtitles,
            v.duration as video_duration
          FROM episodes ep
          LEFT JOIN series s ON s.id = ep.serie_id
          LEFT JOIN videos v ON ep.video_id = v.id
          WHERE ep.serie_id = $1
          ORDER BY ep.season, ep.episode_number;
        `;
      }

      const result = await this.executeQuery(query, arrayValues, 'find_episodes');

      // Procesar los resultados usando el método seguro de BaseService
      const episodes = result.rows.map(episode => ({
        ...episode,
        available_resolutions: this.parseJsonSafely(episode.available_resolutions),
        available_subtitles: this.parseJsonSafely(episode.available_subtitles)
      }));

      this.logger.info('Episodios obtenidos exitosamente', { 
        serieId,
        season,
        episodeNumber,
        count: episodes.length 
      });

      return episodes;

    } catch (error) {
      this.logger.error('Error al obtener episodios', { 
        serieId,
        season,
        episodeNumber,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Obtiene un episodio por su ID
   * @param {number} id - ID del episodio
   * @returns {Object} Datos del episodio
   * @throws {Error} Error si el episodio no existe
   */
  async findOne(id) {
    try {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'episodio');
      
      this.logger.debug('Buscando episodio por ID', { episodeId: validId });
      
      const query = `
        SELECT 
          ep.*,
          s.title as serie_name,
          v.file_hash,
          v.available_resolutions,
          v.available_subtitles,
          v.duration as video_duration
        FROM episodes ep
        LEFT JOIN series s ON s.id = ep.serie_id
        LEFT JOIN videos v ON ep.video_id = v.id
        WHERE ep.id = $1;
      `;
      
      const result = await this.executeQuery(query, [validId], 'find_episode_by_id');
      
      // Validar que el episodio existe usando BaseService
      const episode = this.validateResourceExists(result.rows[0], 'EPISODES', validId);
      
      // Parseo seguro usando método de BaseService
      episode.available_resolutions = this.parseJsonSafely(episode.available_resolutions);
      episode.available_subtitles = this.parseJsonSafely(episode.available_subtitles);
      
      this.logger.info('Episodio encontrado exitosamente', { 
        episodeId: validId,
        episodeTitle: episode.title,
        serieName: episode.serie_name 
      });
      
      return episode;
    } catch (error) {
      this.logger.error('Error al buscar episodio por ID', { 
        episodeId: id,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Obtiene un episodio por su hash de archivo
   * @param {string} fileHash - Hash del archivo de video
   * @returns {Object} Datos del episodio
   * @throws {Error} Error si el episodio no existe
   */
  async findByFileHash(fileHash) {
    try {
      if (!fileHash) {
        this.logger.warn('Intento de búsqueda con fileHash vacío');
        return null;
      }
      
      this.logger.debug('Buscando episodio por fileHash', { fileHash });
      
      const query = `
        SELECT 
          ep.*,
          s.title as serie_name,
          s.id as serie_id,
          vi.file_hash, 
          vi.available_resolutions,
          vi.available_subtitles,
          vi.duration as video_duration
        FROM episodes ep
        LEFT JOIN series s ON s.id = ep.serie_id
        LEFT JOIN videos vi ON vi.id = ep.video_id
        WHERE vi.file_hash = $1
      `;
      
      const result = await this.executeQuery(query, [fileHash], 'find_episode_by_hash');
      
      // Validar que el episodio existe usando BaseService
      const episode = this.validateResourceExists(result.rows[0], 'EPISODES', fileHash);
      
      // Parseo seguro usando método de BaseService
      episode.available_resolutions = this.parseJsonSafely(episode.available_resolutions);
      episode.available_subtitles = this.parseJsonSafely(episode.available_subtitles);
      
      this.logger.info('Episodio encontrado por fileHash', { 
        fileHash,
        episodeId: episode.id,
        episodeTitle: episode.title,
        serieName: episode.serie_name 
      });
      
      return episode;
    } catch (error) {
      this.logger.error('Error al buscar episodio por fileHash', { 
        fileHash,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Crea un nuevo episodio con procesamiento de video
   * @param {Object} episodeInfo - Información del episodio
   * @param {function} onProgress - Callback para progreso de transcodificación
   * @returns {Object} Mensaje de éxito
   */
  async create(episodeInfo, onProgress) {
    const {
      serieId,
      season,
      episodeNumber,
      title,
      description,
      video,
      user,
      ip,
    } = episodeInfo;

    try {
      this.logger.info('Iniciando creación de nuevo episodio', { 
        title,
        serieId,
        season,
        episodeNumber 
      });

      const videoFileHash = await this.calculateFileHash(video);
      
      // Validaciones previas fuera de la transacción
      if (!(await fileExists(video))) {
        this.logger.warn('Archivo de video no encontrado', { video });
        throw ErrorFactory.badRequest('EPISODES', 'VIDEO_NOT_FOUND', {
          operation: 'create_episode',
          videoPath: video
        });
      }

      if (await this.checkIfFileExistsInDatabase(videoFileHash)) {
        this.logger.warn('Intento de creación con video duplicado', { 
          title,
          videoFileHash 
        });
        throw ErrorFactory.conflict('EPISODES', 'video_hash', videoFileHash, {
          operation: 'create_episode',
          attemptedTitle: title
        });
      }

      // Verificar que la serie existe
      await this.validateSerieExists(serieId);

      // Verificar que el episodio no existe
      const existingEpisodes = await this.find(serieId, season, episodeNumber);
      if (existingEpisodes.length > 0) {
        this.logger.warn('Intento de creación con episodio duplicado', { 
          serieId,
          season,
          episodeNumber 
        });
        throw ErrorFactory.conflict('EPISODES', 'episode_duplicate', `Serie ${serieId}, T${season}E${episodeNumber}`, {
          operation: 'create_episode',
          serieId,
          season,
          episodeNumber
        });
      }

      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {
        await configureAuditContext(client, user.id, ip);

        // Transcodificar el video para generar resoluciones y subtítulos
        this.logger.debug('Iniciando transcodificación de video', { videoFileHash });
        const { availableResolutions, availableSubtitles, duration } =
          await transcode(video, videoFileHash, onProgress);

        // Insertar el registro del video en la tabla "videos"
        const insertVideoQuery = `
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
        
        const videoResult = await client.query(insertVideoQuery, [
          videoFileHash,
          JSON.stringify(availableResolutions),
          JSON.stringify(availableSubtitles),
          validDuration,
        ]);
        
        if (videoResult.rows.length === 0) {
          throw ErrorFactory.internal('EPISODES', 'VIDEO_INSERT_FAILED', {
            operation: 'create_episode',
            videoFileHash
          });
        }
        
        const videoId = videoResult.rows[0].id;
        this.logger.debug('Video insertado exitosamente', { videoId, videoFileHash });

        const insertEpisodeQuery = `
        INSERT INTO episodes (
          serie_id,
          season,
          episode_number,
          title,
          description,
          video_id
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`;

        // Insertar el registro del episodio en la tabla "episodes"
        const episodeResult = await client.query(insertEpisodeQuery, [
          serieId,
          season,
          episodeNumber,
          title,
          description,
          videoId,
        ]);

        if (episodeResult.rowCount === 0) {
          throw ErrorFactory.internal('EPISODES', 'CREATE_FAILED', {
            operation: 'create_episode',
            title
          });
        }

        const newEpisode = {
          episodeId: episodeResult.rows[0].id,
          title,
          message: 'Episodio creado exitosamente',
        };
        
        this.logger.info('Episodio creado exitosamente', { 
          episodeId: newEpisode.episodeId,
          title,
          serieId,
          season,
          episodeNumber 
        });

        return newEpisode;
      }, 'create_episode');

      return result;
    } catch (error) {
      this.logger.error('Error al crear episodio', { 
        title,
        serieId,
        season,
        episodeNumber,
        error: error.message 
      });
      throw error;
    } finally {
      // Cleanup se ejecuta siempre
      await deleteTempDir(video);
    }
  }

  /**
   * Actualiza un episodio
   * @param {number} id - ID del episodio a actualizar
   * @param {Object} changes - Datos a actualizar
   * @returns {Object} Registro actualizado
   */
  async update(id, changes) {
    return await this.withTransaction(async (client) => {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'episodio');
      
      this.logger.info('Iniciando actualización de episodio', { 
        episodeId: validId,
        changes: Object.keys(changes) 
      });
      
      const { serieId, season, episodeNumber } = changes;
      
      // Obtener episodio actual
      const episode = await this.findOne(validId);

      let newSerie;
      if (serieId) {
        await this.validateSerieExists(serieId);
        newSerie = serieId;
      } else {
        newSerie = episode.serie_id;
      }

      let newSeason;
      if (season) {
        newSeason = season;
      } else {
        newSeason = episode.season;
      }

      let newEpisodeNumber;
      if (episodeNumber) {
        newEpisodeNumber = episodeNumber;
      } else {
        newEpisodeNumber = episode.episode_number;
      }

      // Verificar que no exista otro episodio con los mismos datos
      if ((serieId && serieId !== episode.serie_id) || 
          (season && season !== episode.season) || 
          (episodeNumber && episodeNumber !== episode.episode_number)) {
        
        this.logger.debug('Validando nuevo episodio único', { 
          newSerie,
          newSeason,
          newEpisodeNumber,
          currentSerieId: episode.serie_id,
          currentSeason: episode.season,
          currentEpisodeNumber: episode.episode_number 
        });
        
        const episodeWithSameDataExist = await this.find(
          newSerie,
          newSeason,
          newEpisodeNumber
        );

        if (
          episodeWithSameDataExist.length > 0 &&
          episodeWithSameDataExist[0].id !== episode.id
        ) {
          this.logger.warn('Intento de actualización con episodio duplicado', { 
            episodeId: validId,
            attemptedSerieId: newSerie,
            attemptedSeason: newSeason,
            attemptedEpisodeNumber: newEpisodeNumber 
          });
          throw ErrorFactory.conflict('EPISODES', 'episode_duplicate', `Serie ${newSerie}, T${newSeason}E${newEpisodeNumber}`, {
            operation: 'update_episode',
            episodeId: validId,
            serieId: newSerie,
            season: newSeason,
            episodeNumber: newEpisodeNumber
          });
        }
      }

      const result = await updateTable(client, 'episodes', episode.id, changes);
      
      this.logger.info('Episodio actualizado exitosamente', { 
        episodeId: validId,
        updatedFields: Object.keys(changes) 
      });
      
      return result;
    }, 'update_episode');
  }

  /**
   * Elimina un episodio y sus archivos asociados
   * @param {number} id - ID del episodio a eliminar
   * @returns {Object} Confirmación de eliminación
   */
  async delete(id) {
    return await this.withTransaction(async (client) => {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'episodio');
      
      this.logger.info('Iniciando eliminación de episodio', { episodeId: validId });
      
      // Obtener información ANTES de eliminar (para MinIO y estadísticas)
      const episode = await this.findOne(validId);

      // Consulta la tabla de videos para obtener el file_hash
      const videoResult = await client.query(
        'SELECT file_hash FROM videos WHERE id = $1',
        [episode.video_id]
      );
      
      if (videoResult.rowCount === 0) {
        this.logger.warn('Video asociado no encontrado', { 
          episodeId: validId,
          videoId: episode.video_id 
        });
        throw ErrorFactory.notFound('VIDEOS', episode.video_id, {
          operation: 'delete_episode',
          episodeId: validId
        });
      }
      
      const { file_hash } = videoResult.rows[0];

      this.logger.info('Episodio encontrado para eliminación', { 
        episodeId: validId,
        title: episode.title,
        videoHash: file_hash,
        serieId: episode.serie_id 
      });

      // Eliminar archivos de MinIO primero
      this.logger.info('Eliminando archivos de MinIO', { 
        episodeId: validId,
        videoHash: file_hash 
      });

      const remoteVideoPaths = `${config.videoDir}/${file_hash}`;
      const remoteSubtitlesPath = `${config.subsDir}/${file_hash}`;

      try {
        await deleteFilesByPrefix(remoteVideoPaths);
        this.logger.debug('Videos eliminados de MinIO', { 
          episodeId: validId,
          videoHash: file_hash 
        });
      } catch (error) {
        this.logger.warn('Error eliminando videos de MinIO', { 
          episodeId: validId,
          videoHash: file_hash,
          error: error.message 
        });
      }

      try {
        await deleteFilesByPrefix(remoteSubtitlesPath);
        this.logger.debug('Subtítulos eliminados de MinIO', { 
          episodeId: validId,
          videoHash: file_hash 
        });
      } catch (error) {
        this.logger.warn('Error eliminando subtítulos de MinIO', { 
          episodeId: validId,
          videoHash: file_hash,
          error: error.message 
        });
      }

      // Eliminar de la base de datos
      this.logger.debug('Eliminando episodio de la base de datos', { episodeId: validId });
      
      const deleteEpisodeQuery = `DELETE FROM episodes WHERE id = $1`;
      const deleteEpisodeResult = await client.query(deleteEpisodeQuery, [validId]);

      if (deleteEpisodeResult.rowCount === 0) {
        throw ErrorFactory.internal('EPISODES', 'DELETE_FAILED', {
          operation: 'delete_episode',
          episodeId: validId
        });
      }

      // Eliminar el video de la base de datos
      const deleteVideoQuery = `DELETE FROM videos WHERE id = $1`;
      await client.query(deleteVideoQuery, [episode.video_id]);

      const result = {
        message: 'Episodio eliminado exitosamente',
        episodeId: validId,
        episodeTitle: episode.title,
        serieId: episode.serie_id,
        statistics: {
          videoDeleted: true,
          subtitlesDeleted: true
        },
        automaticDeletion: {
          minioFiles: true,
          minioVideos: true,
          minioSubtitles: true
        }
      };

      this.logger.info('Episodio eliminado exitosamente', { 
        episodeId: validId,
        title: episode.title,
        serieId: episode.serie_id,
        statistics: result.statistics 
      });
      
      return result;
    }, 'delete_episode');
  }

  /**
   * Valida que una serie existe
   * @param {number} serieId - ID de la serie
   * @throws {Error} Si la serie no existe
   */
  async validateSerieExists(serieId) {
    try {
      // Validar ID usando BaseService
      const validId = this.validateId(serieId, 'serie');
      
      this.logger.debug('Validando existencia de serie', { serieId: validId });
      
      const query = 'SELECT id FROM series WHERE id = $1';
      const result = await this.executeQuery(query, [validId], 'validate_serie_exists');
      
      // Validar que la serie existe usando BaseService
      this.validateResourceExists(result.rows[0], 'SERIES', validId);
      
      this.logger.debug('Serie validada exitosamente', { serieId: validId });
    } catch (error) {
      this.logger.error('Error al validar serie', { 
        serieId,
        error: error.message 
      });
      throw error;
    }
  }
}

module.exports = EpisodesService;