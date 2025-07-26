// services/EpisodesService.js
const BaseService = require('./BaseService');
const boom = require('@hapi/boom');
const { updateTable } = require('../utils/database/updateAbtraction');
const { transcode } = require('../utils/media/video/mp4-transcoder');
const { config } = require('../config/config');
const { deleteFilesByPrefix } = require('../utils/storage/aws');
const { configureAuditContext } = require('../utils/database/configureAuditContext');
const { fileExists, deleteTempDir } = require('../utils/storage/fileHelpers');

/**
 * Servicio para gestión de episodios de series
 * Maneja CRUD de episodios, transcodificación de video y relación con series
 */
class EpisodesService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Obtiene episodios de una serie por ID, temporada y/o número de episodio
   * @param {number} serieId - ID de la serie
   * @param {number} season - Temporada (opcional)
   * @param {number} episodeNumber - Número de episodio (opcional)
   * @returns {Promise<Array>} Lista de episodios
   */
  async find(serieId, season = null, episodeNumber = null) {
    try {
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

      const result = await this.pool.query(query, arrayValues);

      // Procesar los resultados usando el método seguro de BaseService
      const episodes = result.rows.map(episode => ({
        ...episode,
        available_resolutions: this.parseJsonSafely(episode.available_resolutions),
        available_subtitles: this.parseJsonSafely(episode.available_subtitles)
      }));

      return episodes;

    } catch (error) {
      throw new Error('Error al obtener los episodios: ' + error.message);
    }
  }

  /**
   * Obtiene un episodio por su ID
   * @param {number} id - ID del episodio
   * @returns {Object} Datos del episodio
   */
  async findOne(id) {
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
    const result = await this.pool.query(query, [id]);
    
    if (!result.rows.length) {
      throw boom.notFound('Episodio no encontrado');
    }

    const episode = result.rows[0];
    
    // Parseo seguro usando método de BaseService
    episode.available_resolutions = this.parseJsonSafely(episode.available_resolutions);
    episode.available_subtitles = this.parseJsonSafely(episode.available_subtitles);
    
    return episode;
  }

  /**
   * Obtiene un episodio por su hash de archivo
   * @param {string} fileHash - Hash del archivo de video
   * @returns {Object} Datos del episodio
   */
  async findByFileHash(fileHash) {
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
    const result = await this.pool.query(query, [fileHash]);
    
    if (!result.rows.length) {
      throw boom.notFound('Episodio no encontrado');
    }
    
    const episode = result.rows[0];
    
    // Parseo seguro usando método de BaseService
    episode.available_resolutions = this.parseJsonSafely(episode.available_resolutions);
    episode.available_subtitles = this.parseJsonSafely(episode.available_subtitles);
    
    return episode;
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

    // Validaciones previas fuera de la transacción
    if (!(await fileExists(video))) {
      throw new Error('Archivo de video no encontrado');
    }

    // Calcular el hash del video para identificarlo de forma única
    const videoFileHash = await this.calculateFileHash(video);

    if (await this.checkIfFileExistsInDatabase(videoFileHash)) {
      throw new Error(
        'Contenido duplicado. Hash de video ya existe en la BD'
      );
    }

    // Verificar que la serie existe
    await this.validateSerieExists(serieId);

    // Verificar que el episodio no existe
    const existingEpisodes = await this.find(serieId, season, episodeNumber);
    if (existingEpisodes.length > 0) {
      throw new Error(
        `El episodio para la serie ${serieId}, temporada ${season} y episodio ${episodeNumber} ya existe.`
      );
    }

    try {
      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {
        configureAuditContext(client, user.id, ip);

        // Transcodificar el video para generar resoluciones y subtítulos
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
        const videoResult = await client.query(insertVideoQuery, [
          videoFileHash,
          JSON.stringify(availableResolutions),
          JSON.stringify(availableSubtitles),
          duration,
        ]);
        
        if (videoResult.rows.length === 0) {
          throw new Error('No se pudo insertar el video.');
        }
        
        const videoId = videoResult.rows[0].id;

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
          throw new Error(
            'El episodio no pudo ser insertado. Operación abortada.'
          );
        }

        return { 
          episodeId: episodeResult.rows[0].id,
          message: 'Episodio subido y procesado exitosamente' 
        };
      });

      return result;
    } catch (error) {
      console.error('Error al subir el episodio:', error.message);
      throw new Error('Error al subir el episodio: ' + error.message);
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
    const { serieId, season, episodeNumber } = changes;

    try {
      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {
        const episode = await this.findOne(id);

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
        const episodeWithSameDataExist = await this.find(
          newSerie,
          newSeason,
          newEpisodeNumber
        );

        if (
          episodeWithSameDataExist.length > 0 &&
          episodeWithSameDataExist[0].id !== episode.id
        ) {
          throw new Error(
            `El episodio para la serie ${newSerie}, temporada ${newSeason} y episodio ${newEpisodeNumber} ya existe.`
          );
        }

        return await updateTable(client, 'episodes', episode.id, changes);
      });

      return result;
    } catch (error) {
      console.error('Error al actualizar el episodio:', error.message);
      throw new Error('Error al actualizar el episodio: ' + error.message);
    }
  }

  /**
   * Elimina un episodio y sus archivos asociados
   * @param {number} id - ID del episodio a eliminar
   * @returns {Object} Confirmación de eliminación
   */
  async delete(id) {
    try {
      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {
        const episode = await this.findOne(id);

        // Consulta la tabla de videos para obtener el file_hash
        const videoResult = await client.query(
          'SELECT file_hash FROM videos WHERE id = $1',
          [episode.video_id]
        );
        
        if (videoResult.rowCount === 0) {
          throw new Error('Video asociado no encontrado');
        }

        const { file_hash } = videoResult.rows[0];

        // Elimina el episodio de la base de datos
        const deleteEpisodeQuery = `DELETE FROM episodes WHERE id = $1`;
        await client.query(deleteEpisodeQuery, [episode.id]);

        // Elimina el video de la base de datos
        const deleteVideoQuery = `DELETE FROM videos WHERE id = $1`;
        await client.query(deleteVideoQuery, [episode.video_id]);

        // Eliminar archivos de MinIO
        const remoteVideoPaths = `${config.videoDir}/${file_hash}`;
        await deleteFilesByPrefix(remoteVideoPaths);

        return { 
          message: 'Episodio eliminado exitosamente', 
          episodeId: id,
          serieId: episode.serie_id
        };
      });

      return result;
    } catch (error) {
      console.error('Error al eliminar el episodio:', error.message);
      throw new Error('Error al eliminar el episodio: ' + error.message);
    }
  }

  /**
   * Valida que una serie existe
   * @param {number} serieId - ID de la serie
   * @throws {Error} Si la serie no existe
   */
  async validateSerieExists(serieId) {
    const query = 'SELECT id FROM series WHERE id = $1';
    const result = await this.pool.query(query, [serieId]);
    
    if (result.rows.length === 0) {
      throw boom.notFound(`Serie con ID ${serieId} no encontrada`);
    }
  }
}

module.exports = EpisodesService;