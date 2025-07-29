// UsersService.js

const bcrypt = require('bcrypt'); // Biblioteca para encriptación de contraseñas
const { updateTable } = require('./../utils/database/updateAbtraction'); // Función genérica para actualización de tablas

// Sistema centralizado de errores y logging
const BaseService = require('./BaseService');
const ErrorFactory = require('../utils/errors/ErrorFactory');

/**
 * Clase que gestiona las operaciones relacionadas con los usuarios.
 * Extiende BaseService para usar el sistema centralizado de errores y logging.
 */
class UsersService extends BaseService {
  constructor() {
    super('UsersService'); // Inicializar BaseService con nombre del servicio
    
    this.logger.info('UsersService inicializado correctamente');
  }

  /**
   * Obtiene todos los usuarios ordenados por ID.
   * @returns {Array} Lista de usuarios.
   */
  async find() {
    try {
      this.logger.debug('Iniciando búsqueda de todos los usuarios');
      
      const query =
        'SELECT id, user_name, email, role_id, created_at, updated_at FROM users ORDER BY id';
      
      const result = await this.executeQuery(query, [], 'find_all_users');
      
      this.logger.info('Usuarios obtenidos exitosamente', { 
        count: result.rows.length 
      });
      
      return result.rows;
    } catch (error) {
      this.logger.error('Error al obtener usuarios', { error: error.message });
      throw error;
    }
  }

  /**
   * Busca un usuario por su ID.
   * @param {number} id - ID del usuario a buscar.
   * @returns {Object} Datos del usuario encontrado.
   * @throws {Error} Error si el usuario no existe.
   */
  async findOne(id) {
    try {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'usuario');
      
      this.logger.debug('Buscando usuario por ID', { userId: validId });
      
      const query =
        'SELECT id, user_name, email, role_id, recovery_token, created_at, updated_at FROM users WHERE id = $1';

      const result = await this.executeQuery(query, [validId], 'find_user_by_id');

      // Validar que el usuario existe usando BaseService
      const user = this.validateResourceExists(result.rows[0], 'USERS', validId);
      
      this.logger.info('Usuario encontrado exitosamente', { 
        userId: validId,
        userName: user.user_name 
      });
      
      return user;
    } catch (error) {
      this.logger.error('Error al buscar usuario por ID', { 
        userId: id,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Busca un usuario por su email.
   * @param {string} email - Email del usuario a buscar.
   * @returns {Object} Datos del usuario encontrado.
   */
  async findByEmail(email) {
    try {
      if (!email) {
        this.logger.warn('Intento de búsqueda con email vacío');
        return null;
      }
      
      this.logger.debug('Buscando usuario por email', { email });
      
      const query =
        'SELECT us.*, ro.name AS role FROM users us JOIN roles ro ON us.role_id = ro.id WHERE email = $1';
      
      const result = await this.executeQuery(query, [email], 'find_user_by_email');
      
      const user = result.rows[0];
      
      if (user) {
        this.logger.info('Usuario encontrado por email', { 
          userId: user.id,
          userName: user.user_name 
        });
      } else {
        this.logger.debug('No se encontró usuario con el email proporcionado', { email });
      }
      
      return user;
    } catch (error) {
      this.logger.error('Error al buscar usuario por email', { 
        email,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Busca un usuario por su nombre de usuario.
   * @param {string} userName - Nombre de usuario a buscar.
   * @returns {Object} Datos del usuario encontrado.
   */
  async findByUserName(userName) {
    try {
      if (!userName) {
        this.logger.warn('Intento de búsqueda con userName vacío');
        return null;
      }
      
      this.logger.debug('Buscando usuario por userName', { userName });
      
      const query =
        'SELECT us.*, ro.name AS role FROM users us JOIN roles ro ON us.role_id = ro.id WHERE user_name = $1';
      
      const result = await this.executeQuery(query, [userName], 'find_user_by_username');
      
      const user = result.rows[0];
      
      if (user) {
        this.logger.info('Usuario encontrado por userName', { 
          userId: user.id,
          userName: user.user_name 
        });
      } else {
        this.logger.debug('No se encontró usuario con el userName proporcionado', { userName });
      }
      
      return user;
    } catch (error) {
      this.logger.error('Error al buscar usuario por userName', { 
        userName,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario.
   * @param {Object} body - Datos del usuario a crear (email, password, role).
   * @returns {Object} Confirmación de creación.
   * @throws {Error} Error si el email ya está registrado.
   */
  async create(body) {
    return await this.withTransaction(async (client) => {
      this.logger.info('Iniciando creación de nuevo usuario', { 
        userName: body.userName,
        email: body.email 
      });

      // Verificar userName único
      const existingUserName = await this.findByUserName(body.userName);
      if (existingUserName) {
        this.logger.warn('Intento de registro con userName duplicado', { 
          userName: body.userName 
        });
        throw ErrorFactory.conflict('USERS', 'user_name', body.userName, {
          operation: 'create_user',
          attemptedValue: body.userName
        });
      }

      // Verificar email único
      const existingEmail = await this.findByEmail(body.email);
      if (existingEmail) {
        this.logger.warn('Intento de registro con email duplicado', { 
          email: body.email 
        });
        throw ErrorFactory.conflict('USERS', 'email', body.email, {
          operation: 'create_user',
          attemptedValue: body.email
        });
      }

      // Encriptar contraseña
      this.logger.debug('Encriptando contraseña del usuario');
      const hash = await bcrypt.hash(body.password, 10);

      // Insertar usuario con parámetros seguros
      const insertQuery = `
       INSERT INTO users (user_name, email, password, role_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, user_name, email, role_id`;

      const result = await client.query(insertQuery, [
        body.userName,
        body.email,
        hash,
        body.roleId,
      ]);

      const newUser = result.rows[0];
      
      this.logger.info('Usuario creado exitosamente', { 
        userId: newUser.id,
        userName: newUser.user_name,
        email: newUser.email 
      });

      return newUser;
    }, 'create_user');
  }

  /**
   * Actualiza un usuario existente.
   * @param {number} id - ID del usuario a actualizar.
   * @param {Object} changes - Datos a actualizar (email, password, roleId).
   * @returns {Object} Confirmación de actualización.
   */
  async update(id, changes) {
    return await this.withTransaction(async (client) => {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'usuario');
      
      this.logger.info('Iniciando actualización de usuario', { 
        userId: validId,
        changes: Object.keys(changes) 
      });
      
      // Obtener usuario actual
      const user = await this.findOne(validId);

      // Validar email solo si se está cambiando y no es el mismo usuario
      if (changes.email && changes.email !== user.email) {
        this.logger.debug('Validando nuevo email único', { 
          newEmail: changes.email,
          currentEmail: user.email 
        });
        
        const existingEmailUser = await this.findByEmail(changes.email);
        if (existingEmailUser && existingEmailUser.id !== user.id) {
          this.logger.warn('Intento de actualizar con email duplicado', { 
            userId: validId,
            attemptedEmail: changes.email,
            conflictingUserId: existingEmailUser.id 
          });
          throw ErrorFactory.conflict('USERS', 'email', changes.email, {
            operation: 'update_user',
            userId: validId,
            conflictingUserId: existingEmailUser.id
          });
        }
      }

      // Validar userName solo si se está cambiando y no es el mismo usuario
      if (changes.userName && changes.userName !== user.user_name) {
        this.logger.debug('Validando nuevo userName único', { 
          newUserName: changes.userName,
          currentUserName: user.user_name 
        });
        
        const existingUserNameUser = await this.findByUserName(changes.userName);
        if (existingUserNameUser && existingUserNameUser.id !== user.id) {
          this.logger.warn('Intento de actualizar con userName duplicado', { 
            userId: validId,
            attemptedUserName: changes.userName,
            conflictingUserId: existingUserNameUser.id 
          });
          throw ErrorFactory.conflict('USERS', 'user_name', changes.userName, {
            operation: 'update_user',
            userId: validId,
            conflictingUserId: existingUserNameUser.id
          });
        }
      }

      // Encriptar contraseña si se proporciona
      if (changes.password) {
        this.logger.debug('Encriptando nueva contraseña', { userId: validId });
        const hashedPassword = await bcrypt.hash(changes.password, 10);
        changes.password = hashedPassword;
      }

      const result = await updateTable(client, 'users', user.id, changes);
      
      this.logger.info('Usuario actualizado exitosamente', { 
        userId: validId,
        updatedFields: Object.keys(changes) 
      });
      
      return result;
    }, 'update_user');
  }

  /**
   * Elimina un usuario por su ID.
   * @param {number} id - ID del usuario a eliminar.
   * @returns {Object} Datos del usuario eliminado.
   * @throws {Error} Error si el usuario no existe.
   */
  async delete(id) {
    return await this.withTransaction(async (client) => {
      // Validar ID usando BaseService
      const validId = this.validateId(id, 'usuario');
      
      this.logger.info('Iniciando eliminación de usuario', { userId: validId });
      
      // Verificar que el usuario existe
      const user = await this.findOne(validId);
      
      this.logger.warn('Eliminando usuario', { 
        userId: validId,
        userName: user.user_name,
        email: user.email 
      });
      
      const query = 'DELETE FROM users WHERE id = $1';
      await client.query(query, [validId]);
      
      this.logger.info('Usuario eliminado exitosamente', { 
        userId: validId,
        userName: user.user_name 
      });
      
      return user;
    }, 'delete_user');
  }
}

module.exports = UsersService;
