// services/moviesService.js
const BaseService = require('./BaseService');
const boom = require('@hapi/boom'); // Biblioteca para manejo de errores HTTP estructurados
const { updateTable } = require('../utils/database/updateAbtraction'); // Función genérica para actualización de tablas
const { transcode } = require('../utils/media/video/mp4-transcoder');
const { config } = require('../config/config');
const { processAndUploadCover } = require('../utils/media/image/imageProcessor');
const { deleteFilesByPrefix } = require('../utils/storage/aws');
const { configureAuditContext } = require('../utils/database/configureAuditContext');
const { fileExists, deleteTempDir } = require('../utils/storage/fileHelpers');

class MoviesService extends BaseService {
  constructor() {
    super(); // Llama al constructor de BaseService
  }

  // Los métodos calculateFileHash y checkIfFileExistsInDatabase 
  // ahora se heredan de BaseService

  /**
   * Obtiene todas las películas, incluyendo algunos datos del video asociado.
   * @returns {Promise<Array>} Lista de películas.
   */
  async find() {
    try {
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
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener las películas: ' + error.message);
    }
  }

  /**
   * Obtiene una película por su ID, incluyendo información del video asociado.
   * @param {number} id - ID de la película a buscar.
   * @returns {Object} Datos de la película encontrada con información del video.
   * @throws {Error} Error si la película no existe.
   */
  async findOne(id) {
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
    const result = await this.pool.query(query, [id]);
    if (!result.rows.length) {
      throw boom.notFound('Pelicula no encontrada');
    }
    const movie = result.rows[0];
    return movie;
  }

  /**
   * Obtiene una película por su hash de archivo, incluyendo información del video asociado.
   * @param {string} fileHash - Hash del archivo de video.
   * @returns {Object} Datos de la película encontrada con información del video.
   * @throws {Error} Error si la película no existe.
   */
  async findByFileHash(fileHash) {
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
    const result = await this.pool.query(query, [fileHash]);
    if (!result.rows.length) {
      throw boom.notFound('Pelicula no encontrada');
    }
    const movie = result.rows[0];
    return movie;
  }

  /**
   * Busca películas por nombre.
   * @param {string} title - Nombre (o parte del nombre) del video a buscar.
   * @returns {Promise<Array>} Lista de películas que coinciden.
   */
  async findByName(title) {
    try {
      const query = `
        SELECT m.*
        FROM movies m
        WHERE title_normalized LIKE $1
      `;
      const params = [`%${title.toLowerCase()}%`];
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error al buscar película por nombre:', error.message);
      throw new Error('Error al buscar película por nombre: ' + error.message);
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
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error al buscar películas por rango de años:', error.message);
      throw new Error('Error al buscar películas por rango de años: ' + error.message);
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

    const videoFileHash = await this.calculateFileHash(video);

    // Validaciones previas fuera de la transacción
    if (!(await fileExists(video))) {
      throw new Error('Archivo de video no encontrado');
    }
    if (!(await fileExists(coverImage))) {
      throw new Error('Imagen de portada no encontrada');
    }
    if (await this.checkIfFileExistsInDatabase(videoFileHash)) {
      throw new Error(
        'Contenido duplicado. Hash de video ya existe en la BD'
      );
    }

    try {
      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {
        configureAuditContext(client, user.id, ip);

        const coverFileHash = await this.calculateFileHash(coverImage);

        await processAndUploadCover(coverImage, coverFileHash);

        // Transcodifica el video y sube cada calidad a MinIO
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
          throw new Error('No se pudo insertar el video.');
        }

        const videoId = videoResult.rows[0].id;

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
          throw new Error('La película ya existe. Operación abortada.');
        }

        return { message: 'Película subida y procesada exitosamente' };
      });

      return result;
    } catch (error) {
      console.error('Error al subir la película:', error.message);
      throw new Error('Error al subir la película: ' + error.message);
    } finally {
      // Cleanup se ejecuta siempre, sin importar si la transacción falló
      await deleteTempDir(video);
      await deleteTempDir(coverImage);
      if (movieInfo.isTemporaryCoverImage && coverImage) {
        try {
          const { cleanupTempFile } = require('../utils/media/image/imageDownloader');
          cleanupTempFile(coverImage);
        } catch (error) {
          console.error('⚠️ Error limpiando imagen temporal:', error);
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
    try {
      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {
        const movie = await this.findOne(id);

        if (changes.coverImage) {
          const coverFileHash = await this.calculateFileHash(changes.coverImage);
          const remoteCoverPath = `${config.coversDir}/${movie.cover_image}`;
          await deleteFilesByPrefix(remoteCoverPath);

          // Procesa y sube la nueva portada
          await processAndUploadCover(changes.coverImage, coverFileHash);
          await deleteTempDir(changes.coverImage);
          changes.coverImage = coverFileHash;
        }

        return await updateTable(client, 'movies', movie.id, changes);
      });

      return result;
    } catch (error) {
      console.error('Error al actualizar la película:', error.message);
      throw new Error('Error al actualizar la película: ' + error.message);
    }
  }

  /**
   * Elimina una película por su ID y remueve los archivos asociados en MinIO.
   * @param {number} id - ID de la película a eliminar.
   * @returns {Object} Confirmación de eliminación.
   */
  async delete(id) {
    try {
      // Usar withTransaction para manejar la transacción automáticamente  
      const result = await this.withTransaction(async (client) => {
        const movie = await this.findOne(id);

        // Consulta la tabla de videos para obtener el file_hash
        const videoResult = await client.query(
          'SELECT file_hash FROM videos WHERE id = $1',
          [movie.video_id]
        );
        if (videoResult.rowCount === 0) {
          throw new Error('Video asociado no encontrado');
        }
        const { file_hash } = videoResult.rows[0];

        // Elimina la película de la base de datos
        const deleteMovieQuery = `DELETE FROM movies WHERE id = $1`;
        await client.query(deleteMovieQuery, [id]);

        // Elimina el video de la base de datos
        const deleteVideoQuery = `DELETE FROM videos WHERE id = $1`;
        await client.query(deleteVideoQuery, [movie.video_id]);

        // Rutas remotas a eliminar en MinIO
        const remoteCoverPath = `${config.coversDir}/${movie.cover_image}`;
        const remoteVideoPaths = `${config.videoDir}/${file_hash}`;

        await deleteFilesByPrefix(remoteCoverPath);
        await deleteFilesByPrefix(remoteVideoPaths);

        return { message: 'Película eliminada exitosamente', id };
      });

      return result;
    } catch (error) {
      console.error('Error al eliminar la película:', error.message);
      throw new Error('Error al eliminar la película: ' + error.message);
    }
  }
}

module.exports = MoviesService;
