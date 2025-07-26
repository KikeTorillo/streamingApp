// services/BaseService.js
const fs = require('fs');
const crypto = require('crypto');
const pool = require('../libs/postgresPool');

/**
 * Clase base para servicios que proporciona funcionalidades comunes
 * para evitar duplicación de código entre MoviesService, SeriesService, etc.
 */
class BaseService {
  constructor() {
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  /**
   * Calcula el hash SHA256 de un archivo
   * @param {string} filePath - Ruta del archivo
   * @returns {Promise<string>} Hash SHA256 del archivo
   * @throws {Error} Error si no se puede calcular el hash
   */
  async calculateFileHash(filePath) {
    try {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      for await (const chunk of stream) {
        hash.update(chunk);
      }

      return hash.digest('hex');
    } catch (error) {
      throw new Error(
        `Error al calcular el hash del archivo: ${error.message}`
      );
    }
  }

  /**
   * Verifica si un archivo con el hash especificado ya existe en la base de datos
   * @param {string} fileHash - Hash del archivo a verificar
   * @returns {Promise<boolean>} true si el archivo existe, false si no
   */
  async checkIfFileExistsInDatabase(fileHash) {
    const query = 'SELECT id FROM videos WHERE file_hash = $1 LIMIT 1';
    const result = await this.pool.query(query, [fileHash]);
    return result.rows.length > 0;
  }

  /**
   * Ejecuta una función dentro de una transacción de base de datos
   * Maneja automáticamente BEGIN, COMMIT y ROLLBACK
   * @param {function} callback - Función a ejecutar dentro de la transacción
   * @returns {Promise<any>} Resultado de la función callback
   */
  async withTransaction(callback) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Parsea JSON de forma segura, manejando errores y tipos
   * @param {string|object} jsonData - Datos JSON a parsear
   * @param {any} defaultValue - Valor por defecto si el parseo falla
   * @returns {any} Datos parseados o valor por defecto
   */
  parseJsonSafely(jsonData, defaultValue = null) {
    if (!jsonData) {
      return defaultValue;
    }

    // Si ya es un objeto/array, devolverlo tal como está
    if (typeof jsonData !== 'string') {
      return jsonData;
    }

    try {
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('❌ Error parsing JSON:', error.message);
      console.error('❌ Raw value:', jsonData);
      return defaultValue;
    }
  }
}

module.exports = BaseService;