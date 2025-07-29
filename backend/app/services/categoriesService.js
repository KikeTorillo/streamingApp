// services/categoriesService.js

// Sistema centralizado de errores y logging
const BaseService = require('./BaseService');
const ErrorFactory = require('../utils/errors/ErrorFactory');
const { updateTable } = require('../utils/database/updateAbtraction'); // Función genérica para actualización de tablas

/**
 * Clase que gestiona las operaciones relacionadas con las categorías.
 * Extiende BaseService para usar el sistema centralizado de errores y logging.
 */
class CategoryService extends BaseService {
  constructor() {
    super('CategoryService'); // Inicializar BaseService con nombre del servicio
    
    this.logger.info('CategoryService inicializado correctamente');
  }

  /**
   * Obtiene la lista de todas las categorías.
   * @returns {Array} Lista de categorías.
   */
  async find() {
    try {
      this.logger.debug('Iniciando búsqueda de todas las categorías');
      
      const query = 'SELECT * FROM categories ORDER BY name;';
      const result = await this.executeQuery(query, [], 'find_all_categories');
      
      this.logger.info('Categorías obtenidas exitosamente', { 
        count: result.rows.length 
      });
      
      return result.rows;
    } catch (error) {
      this.logger.error('Error al obtener categorías', { error: error.message });
      throw error;
    }
  }

  /**
   * Obtiene una categoría por su ID.
   * @param {number} id - ID de la categoría a buscar.
   * @returns {Object} Datos de la categoría encontrada.
   * @throws {Error} Error si la categoría no existe.
   */
  async findOne(id) {
    try {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'categoría');
      
      this.logger.debug('Buscando categoría por ID', { categoryId: validId });
      
      const query = 'SELECT * FROM categories WHERE id = $1;';
      const result = await this.executeQuery(query, [validId], 'find_category_by_id');
      
      // Validar que la categoría existe usando BaseService
      const category = this.validateResourceExists(result.rows[0], 'CATEGORIES', validId);
      
      this.logger.info('Categoría encontrada exitosamente', { 
        categoryId: validId,
        categoryName: category.name 
      });
      
      return category;
    } catch (error) {
      this.logger.error('Error al buscar categoría por ID', { 
        categoryId: id,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Crea una nueva categoría.
   * @param {Object} body - Datos de la categoría a crear (por ejemplo, { name }).
   * @returns {Object} Categoría creada.
   * @throws {Error} Error si la categoría ya existe.
   */
  async create(body) {
    return await this.withTransaction(async (client) => {
      this.logger.info('Iniciando creación de nueva categoría', { 
        categoryName: body.name 
      });

      // Verificar si ya existe una categoría con el mismo nombre
      const checkQuery = 'SELECT * FROM categories WHERE name = $1;';
      const checkResult = await client.query(checkQuery, [body.name]);

      if (checkResult.rows.length > 0) {
        this.logger.warn('Intento de creación con categoría duplicada', { 
          categoryName: body.name 
        });
        throw ErrorFactory.conflict('CATEGORIES', 'name', body.name, {
          operation: 'create_category',
          attemptedName: body.name
        });
      }

      // Insertar la nueva categoría en la base de datos
      const insertQuery = 'INSERT INTO categories (name) VALUES ($1) RETURNING *;';
      const insertResult = await client.query(insertQuery, [body.name]);

      if (insertResult.rowCount === 0) {
        throw ErrorFactory.internal('CATEGORIES', 'CREATE_FAILED', {
          operation: 'create_category',
          name: body.name
        });
      }

      const newCategory = insertResult.rows[0];
      
      this.logger.info('Categoría creada exitosamente', { 
        categoryId: newCategory.id,
        categoryName: newCategory.name 
      });

      return newCategory;
    }, 'create_category');
  }

  /**
   * Actualiza una categoría existente.
   * @param {number} id - ID de la categoría a actualizar.
   * @param {Object} changes - Datos a actualizar (por ejemplo, { name }).
   * @returns {Object} Categoría actualizada.
   */
  async update(id, changes) {
    return await this.withTransaction(async (client) => {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'categoría');
      
      this.logger.info('Iniciando actualización de categoría', { 
        categoryId: validId,
        changes: Object.keys(changes) 
      });
      
      // Obtener categoría actual
      const category = await this.findOne(validId);

      // Validar nombre único solo si se está cambiando
      if (changes.name && changes.name !== category.name) {
        this.logger.debug('Validando nuevo nombre único', { 
          newName: changes.name,
          currentName: category.name 
        });
        
        const checkQuery = 'SELECT * FROM categories WHERE name = $1;';
        const checkResult = await client.query(checkQuery, [changes.name]);
        
        if (checkResult.rows.length > 0) {
          this.logger.warn('Intento de actualización con nombre duplicado', { 
            categoryId: validId,
            attemptedName: changes.name,
            conflictingCategoryId: checkResult.rows[0].id 
          });
          throw ErrorFactory.conflict('CATEGORIES', 'name', changes.name, {
            operation: 'update_category',
            categoryId: validId,
            conflictingCategoryId: checkResult.rows[0].id
          });
        }
      }

      const result = await updateTable(client, 'categories', category.id, changes);
      
      this.logger.info('Categoría actualizada exitosamente', { 
        categoryId: validId,
        updatedFields: Object.keys(changes) 
      });
      
      return result;
    }, 'update_category');
  }

  /**
   * Elimina una categoría por su ID.
   * @param {number} id - ID de la categoría a eliminar.
   * @returns {Object} Datos de la categoría eliminada.
   * @throws {Error} Error si la categoría no existe.
   */
  async delete(id) {
    return await this.withTransaction(async (client) => {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'categoría');
      
      this.logger.info('Iniciando eliminación de categoría', { categoryId: validId });
      
      // Verificar que la categoría existe
      const category = await this.findOne(validId);
      
      this.logger.warn('Eliminando categoría', { 
        categoryId: validId,
        categoryName: category.name 
      });
      
      const query = 'DELETE FROM categories WHERE id = $1;';
      const deleteResult = await client.query(query, [validId]);
      
      if (deleteResult.rowCount === 0) {
        throw ErrorFactory.internal('CATEGORIES', 'DELETE_FAILED', {
          operation: 'delete_category',
          categoryId: validId
        });
      }
      
      this.logger.info('Categoría eliminada exitosamente', { 
        categoryId: validId,
        categoryName: category.name 
      });
      
      return category;
    }, 'delete_category');
  }
}

module.exports = CategoryService;
