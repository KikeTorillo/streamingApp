// services/seriesService.js
const BaseService = require('./BaseService');
const boom = require('@hapi/boom'); // Biblioteca para manejo de errores HTTP estructurados
const { updateTable } = require('../utils/database/updateAbtraction'); // Función genérica para actualización de tablas
const { config } = require('../config/config');
const { processAndUploadCover } = require('../utils/media/image/imageProcessor');
const { deleteFilesByPrefix } = require('../utils/storage/aws');
const { configureAuditContext } = require('../utils/database/configureAuditContext');
const { fileExists, deleteTempDir } = require('../utils/storage/fileHelpers');

class SeriesService extends BaseService {
  constructor() {
    super(); // Llama al constructor de BaseService
  }

  // Los métodos calculateFileHash y checkIfFileExistsInDatabase 
  // ahora se heredan de BaseService

  async checkIfCoverExistsInDatabase(fileHash) {
    const query = 'SELECT id FROM series WHERE cover_image = $1 LIMIT 1';
    const result = await this.pool.query(query, [fileHash]);
    return result.rows.length > 0;
  }

  /**
   * Obtiene todas las series.
   * @returns {Promise<Array>} Lista de series.
   */
  async find() {
    try {
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
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener las series: ' + error.message);
    }
  }

  /**
   * Obtiene una categoría por su ID.
   * @param {number} id - ID de la categoría a buscar.
   * @returns {Object} Datos de la categoría encontrada.
   * @throws {Error} Error si la categoría no existe.
   */
  async findOne(id) {
    const query = 'SELECT * FROM series WHERE id = $1;';
    const result = await this.pool.query(query, [id]);
    if (!result.rows.length) {
      throw boom.notFound('Serie no encontrada');
    }
    const serie = result.rows[0];
    return serie;
  }

  async checkExistByTitleAndYear(title, releaseYear) {
    const query = `
    SELECT * FROM series 
    WHERE title_normalized = $1
    and release_year = $2;
    `;

    const result = await this.pool.query(query, [
      title.toLowerCase(),
      releaseYear,
    ]);

    return result.rows.length > 0;
  }

  /**
   * Busca series por nombre.
   * @param {string} title - Nombre (o parte del nombre) del video a buscar.
   * @returns {Promise<Array>} - Lista de videos que coinciden con la consulta.
   */
  async findByName(title) {
    try {
      const query = `
          SELECT s.*
          FROM series s
          WHERE title_normalized LIKE $1
        `;

      const params = [`%${title.toLowerCase()}%`];
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error al buscar serie por nombre:', error.message);
      throw new Error('Error al buscar serie por nombre: ' + error.message);
    }
  }

  /**
   * Sube una serie:
   * - Verifica existencia de archivos (video y portada).
   * - Procesa la portada y la sube a MinIO.
   * - Transcodifica el video en varias calidades y sube cada resultado.
   * - Inserta registros en las tablas series.
   * @param {Object} serieInfo - Información de la serie.
   * @param {function} onProgress - Callback para el progreso de transcodificación.
   * @returns {Object} Mensaje de éxito.
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

    const coverFileHash = await this.calculateFileHash(coverImage);
    
    // Validaciones previas fuera de la transacción
    if (!(await fileExists(coverImage))) {
      throw new Error('Imagen de portada no encontrada');
    }

    if (await this.checkIfCoverExistsInDatabase(coverFileHash)) {
      throw new Error(
        'Contenido duplicado. Hash de portada ya existe en la BD'
      );
    }

    if (await this.checkExistByTitleAndYear(title, releaseYear)) {
      throw new Error(
        'La serie ya existe. Nombre y anio de lanzamiento ya existen en la BD.'
      );
    }

    try {
      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {
        await configureAuditContext(client, user.id, ip);

        await processAndUploadCover(coverImage, coverFileHash);

        // Insertar la serie en la tabla "series"
        const seriesResult = await client.query(
          `INSERT INTO series (
            title,
            cover_image,
            description,
            category_id,
            release_year
          ) VALUES ($1, $2, $3, $4, $5)
          RETURNING id`,
          [title, coverFileHash, description, categoryId, releaseYear]
        );

        if (seriesResult.rowCount === 0) {
          throw new Error('La serie ya existe. Operación abortada.');
        }

        return {
          serieId: seriesResult.rows[0].id,
          message: 'Serie creada exitosamente',
        };
      });

      return result;
    } catch (error) {
      console.error('Error al crear la serie:', error.message);
      throw new Error('Error al crear la serie: ' + error.message);
    } finally {
      // Cleanup se ejecuta siempre, sin importar si la transacción falló
      await deleteTempDir(coverImage);
    }
  }

  /**
   * Actualiza una serie cambiando el título, categoría, año de lanzamiento, descripción y portada.
   * @param {number} id - ID de la serie a actualizar.
   * @param {Object} changes - Datos a actualizar { title, categoryId, releaseYear, description, coverImage }.
   * @returns {Object} Registro actualizado.
   */
  async update(id, changes) {
    const { title, releaseYear, coverImage } = changes;

    try {
      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {
        // ✅ CORREGIDO: Solo validar duplicados si título o año han cambiado
        const serie = await this.findOne(id);
        
        if ((title && title !== serie.title) || (releaseYear && releaseYear !== serie.release_year)) {
          const checkTitle = title || serie.title;
          const checkYear = releaseYear || serie.release_year;
          
          if (await this.checkExistByTitleAndYear(checkTitle, checkYear)) {
            throw new Error(
              'La serie ya existe. Nombre y año de lanzamiento ya existen en la BD.'
            );
          }
        }

        if (coverImage) {
          const coverFileHash = await this.calculateFileHash(coverImage);

          if (await this.checkIfCoverExistsInDatabase(coverFileHash)) {
            throw new Error(
              'Contenido duplicado. Hash de portada ya existe en la BD'
            );
          }

          const remoteCoverPath = `${config.coversDir}/${serie.cover_image}`;
          await deleteFilesByPrefix(remoteCoverPath);

          // Procesa y sube la nueva portada
          await processAndUploadCover(changes.coverImage, coverFileHash);
          await deleteTempDir(changes.coverImage);
          changes.coverImage = coverFileHash;
        }

        return await updateTable(client, 'series', serie.id, changes);
      });

      return result;
    } catch (error) {
      console.error('Error al actualizar la serie:', error.message);
      throw new Error('Error al actualizar la serie: ' + error.message);
    }
  }

  /**
 * 🗑️ Elimina una serie y todos sus episodios relacionados
 * ✅ VERSIÓN SIMPLIFICADA - PostgreSQL + Triggers manejan todo automáticamente
 * @param {number} id - ID de la serie a eliminar
 * @returns {Object} Confirmación de eliminación con estadísticas
 */
  async delete(id) {
    try {
      console.log(`🎬 Eliminando serie ID: ${id}`);
      
      // Usar withTransaction para manejar la transacción automáticamente
      const result = await this.withTransaction(async (client) => {

      // ✅ PASO 1: Obtener información ANTES de eliminar (para MinIO y estadísticas)
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
      GROUP BY s.id, s.title, s.cover_image;
    `;

      const infoResult = await client.query(serieInfoQuery, [id]);

      if (infoResult.rowCount === 0) {
        throw new Error(`Serie con ID ${id} no encontrada`);
      }

      const serieInfo = infoResult.rows[0];
      const videoHashes = serieInfo.video_hashes && serieInfo.video_hashes[0] !== null ? serieInfo.video_hashes : [];

      console.log(`📺 Serie: "${serieInfo.title}" con ${serieInfo.total_episodes} episodios`);

      // ✅ PASO 2: Eliminar archivos de MinIO (lo único que no puede hacer PostgreSQL)
      if (videoHashes.length > 0) {
        console.log(`☁️ Eliminando ${videoHashes.length} archivos de video de MinIO...`);

        for (const hash of videoHashes) {
          if (hash) {
            const remotePath = `${config.videoDir}/${hash}`;
            try {
              await deleteFilesByPrefix(remotePath);
              console.log(`✅ Video eliminado de MinIO: ${hash}`);
            } catch (error) {
              console.warn(`⚠️ Error eliminando video ${hash}:`, error.message);
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
          console.log(`✅ Portada eliminada de MinIO: ${serieInfo.cover_image}`);
        } catch (error) {
          console.warn(`⚠️ Error eliminando portada:`, error.message);
        }
      }

      // ✅ PASO 3: ⚡ LA MAGIA - Una consulta elimina TODO automáticamente
      console.log(`🗑️ Eliminando serie de la base de datos...`);
      const deleteResult = await client.query('DELETE FROM series WHERE id = $1', [id]);

      if (deleteResult.rowCount === 0) {
        throw new Error('No se pudo eliminar la serie');
      }

      // 🎉 En este punto PostgreSQL ya eliminó automáticamente:
      // - ✅ La serie (obviamente)
      // - ✅ Todos los episodios (por CASCADE: serie_id REFERENCES series(id) ON DELETE CASCADE)
      // - ✅ Todos los videos (por TRIGGER: auto_delete_video_on_episode_delete)

      await client.query('COMMIT');

      const result = {
        message: 'Serie eliminada exitosamente',
        serieId: id,
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

      console.log(`🎉 Eliminación completada automáticamente:`, result);
      return result;

      });

      return result;
    } catch (error) {
      console.error(`❌ Error al eliminar serie ${id}:`, error.message);
      throw new Error(`Error al eliminar la serie: ${error.message}`);
    }
  }
}

module.exports = SeriesService;
