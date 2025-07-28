/**
 * @file ErrorMessages.js
 * @description Diccionario centralizado de mensajes de error en español
 * para mantener consistencia en toda la aplicación.
 * 
 * REGLAS DE USO:
 * - Todos los mensajes deben estar en español
 * - Usar términos consistentes: "usuario" no "user", "correo" no "email"
 * - Incluir contexto cuando sea necesario
 * - Mantener tono profesional pero amigable
 */

const ERROR_MESSAGES = {
  // ===== ERRORES DE AUTENTICACIÓN =====
  AUTH: {
    USER_NOT_FOUND: 'Usuario no encontrado',
    INVALID_CREDENTIALS: 'Credenciales incorrectas',
    INVALID_PASSWORD: 'Contraseña incorrecta',
    UNAUTHORIZED: 'No autorizado para realizar esta acción',
    TOKEN_EXPIRED: 'El token ha expirado',
    TOKEN_INVALID: 'Token inválido o malformado',
    TOKEN_REQUIRED: 'Token de autorización requerido',
    RECOVERY_TOKEN_INVALID: 'Token de recuperación inválido o expirado',
    RECOVERY_TOKEN_EXPIRED: 'El token de recuperación ha expirado',
    SESSION_EXPIRED: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
    ACCESS_DENIED: 'Acceso denegado - permisos insuficientes'
  },

  // ===== ERRORES DE VALIDACIÓN =====
  VALIDATION: {
    REQUIRED_FIELD: 'Este campo es obligatorio',
    INVALID_EMAIL: 'El formato del correo electrónico no es válido',
    INVALID_FORMAT: 'El formato del campo no es válido',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
    PASSWORD_TOO_WEAK: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
    INVALID_ID: 'El ID proporcionado no es válido',
    INVALID_DATE: 'La fecha proporcionada no es válida',
    INVALID_URL: 'La URL proporcionada no es válida',
    FIELD_TOO_LONG: 'El campo excede la longitud máxima permitida',
    FIELD_TOO_SHORT: 'El campo no cumple con la longitud mínima requerida',
    INVALID_ENUM_VALUE: 'El valor proporcionado no está dentro de las opciones válidas'
  },

  // ===== ERRORES DE USUARIOS =====
  USERS: {
    NOT_FOUND: 'Usuario no encontrado',
    EMAIL_EXISTS: 'Ya existe un usuario registrado con este correo electrónico',
    USERNAME_EXISTS: 'El nombre de usuario ya está en uso',
    CREATE_FAILED: 'Error al crear el usuario',
    UPDATE_FAILED: 'Error al actualizar el usuario',
    DELETE_FAILED: 'Error al eliminar el usuario',
    CANNOT_DELETE_SELF: 'No puedes eliminar tu propia cuenta',
    INACTIVE_USER: 'La cuenta de usuario está inactiva',
    PROFILE_UPDATE_FAILED: 'Error al actualizar el perfil de usuario'
  },

  // ===== ERRORES DE PELÍCULAS =====
  MOVIES: {
    NOT_FOUND: 'Película no encontrada',
    CREATE_FAILED: 'Error al crear la película',
    UPDATE_FAILED: 'Error al actualizar la película',
    DELETE_FAILED: 'Error al eliminar la película',
    TITLE_EXISTS: 'Ya existe una película con este título',
    INVALID_YEAR: 'El año de lanzamiento no es válido',
    INVALID_DURATION: 'La duración de la película no es válida',
    VIDEO_PROCESSING_FAILED: 'Error al procesar el archivo de video',
    COVER_UPLOAD_FAILED: 'Error al subir la imagen de portada'
  },

  // ===== ERRORES DE SERIES =====
  SERIES: {
    NOT_FOUND: 'Serie no encontrada',
    CREATE_FAILED: 'Error al crear la serie',
    UPDATE_FAILED: 'Error al actualizar la serie',
    DELETE_FAILED: 'Error al eliminar la serie',
    TITLE_EXISTS: 'Ya existe una serie con este título',
    INVALID_YEAR: 'El año de lanzamiento no es válido',
    SEASON_NOT_FOUND: 'Temporada no encontrada',
    EPISODE_NOT_FOUND: 'Episodio no encontrado'
  },

  // ===== ERRORES DE EPISODIOS =====
  EPISODES: {
    NOT_FOUND: 'Episodio no encontrado',
    CREATE_FAILED: 'Error al crear el episodio',
    UPDATE_FAILED: 'Error al actualizar el episodio',
    DELETE_FAILED: 'Error al eliminar el episodio',
    SERIES_REQUIRED: 'Debe especificar una serie para el episodio',
    EPISODE_NUMBER_EXISTS: 'Ya existe un episodio con este número en la temporada',
    INVALID_EPISODE_NUMBER: 'El número de episodio no es válido',
    INVALID_SEASON_NUMBER: 'El número de temporada no es válido',
    VIDEO_PROCESSING_FAILED: 'Error al procesar el archivo de video del episodio'
  },

  // ===== ERRORES DE CATEGORÍAS =====
  CATEGORIES: {
    NOT_FOUND: 'Categoría no encontrada',
    CREATE_FAILED: 'Error al crear la categoría',
    UPDATE_FAILED: 'Error al actualizar la categoría',
    DELETE_FAILED: 'Error al eliminar la categoría',
    NAME_EXISTS: 'Ya existe una categoría con este nombre',
    HAS_CONTENT: 'No se puede eliminar la categoría porque tiene contenido asociado',
    INVALID_NAME: 'El nombre de la categoría no es válido'
  },

  // ===== ERRORES DE ARCHIVOS Y MEDIA =====
  FILES: {
    NOT_FOUND: 'Archivo no encontrado',
    UPLOAD_FAILED: 'Error al subir el archivo',
    INVALID_FORMAT: 'Formato de archivo no válido',
    FILE_TOO_LARGE: 'El archivo excede el tamaño máximo permitido',
    PROCESSING_FAILED: 'Error al procesar el archivo',
    TRANSCODING_FAILED: 'Error en el proceso de transcodificación',
    STORAGE_ERROR: 'Error en el sistema de almacenamiento',
    DUPLICATE_FILE: 'Ya existe un archivo idéntico en el sistema',
    CORRUPTED_FILE: 'El archivo está corrupto o dañado'
  },

  // ===== ERRORES DE BASE DE DATOS =====
  DATABASE: {
    CONNECTION_ERROR: 'Error de conexión con la base de datos',
    QUERY_FAILED: 'Error al ejecutar la consulta en la base de datos',
    TRANSACTION_FAILED: 'Error en la transacción de la base de datos',
    CONSTRAINT_VIOLATION: 'Violación de restricción en la base de datos',
    DUPLICATE_ENTRY: 'Ya existe un registro con estos datos',
    FOREIGN_KEY_VIOLATION: 'Referencia no válida a otro registro',
    DATA_INTEGRITY_ERROR: 'Error de integridad de datos'
  },

  // ===== ERRORES DEL SISTEMA =====
  SYSTEM: {
    INTERNAL_ERROR: 'Error interno del servidor. Por favor, inténtalo más tarde',
    SERVICE_UNAVAILABLE: 'El servicio no está disponible temporalmente',
    MAINTENANCE_MODE: 'El sistema está en modo de mantenimiento',
    RATE_LIMIT_EXCEEDED: 'Has excedido el límite de peticiones. Inténtalo más tarde',
    TIMEOUT: 'La operación ha superado el tiempo límite',
    CONFIGURATION_ERROR: 'Error de configuración del sistema',
    EXTERNAL_SERVICE_ERROR: 'Error en servicio externo',
    RESOURCE_EXHAUSTED: 'Recursos del sistema agotados'
  },

  // ===== ERRORES DE RED Y CORS =====
  NETWORK: {
    CORS_ERROR: 'Error CORS: origen no permitido',
    INVALID_ORIGIN: 'Origen de la petición no autorizado',
    CONNECTION_TIMEOUT: 'Tiempo de conexión agotado',
    NETWORK_ERROR: 'Error de red',
    DNS_ERROR: 'Error de resolución DNS'
  },

  // ===== MENSAJES DE ÉXITO (para consistencia) =====
  SUCCESS: {
    USER_CREATED: 'Usuario creado exitosamente',
    USER_UPDATED: 'Usuario actualizado exitosamente',
    USER_DELETED: 'Usuario eliminado exitosamente',
    MOVIE_CREATED: 'Película creada exitosamente',
    MOVIE_UPDATED: 'Película actualizada exitosamente',
    MOVIE_DELETED: 'Película eliminada exitosamente',
    SERIES_CREATED: 'Serie creada exitosamente',
    SERIES_UPDATED: 'Serie actualizada exitosamente',
    SERIES_DELETED: 'Serie eliminada exitosamente',
    EPISODE_CREATED: 'Episodio creado exitosamente',
    EPISODE_UPDATED: 'Episodio actualizado exitosamente',
    EPISODE_DELETED: 'Episodio eliminado exitosamente',
    CATEGORY_CREATED: 'Categoría creada exitosamente',
    CATEGORY_UPDATED: 'Categoría actualizada exitosamente',
    CATEGORY_DELETED: 'Categoría eliminada exitosamente',
    PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
    EMAIL_SENT: 'Correo enviado exitosamente',
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGOUT_SUCCESS: 'Cierre de sesión exitoso',
    FILE_UPLOADED: 'Archivo subido exitosamente',
    OPERATION_COMPLETED: 'Operación completada exitosamente'
  }
};

// Función helper para obtener mensajes con reemplazos dinámicos
const getErrorMessage = (category, key, replacements = {}) => {
  if (!ERROR_MESSAGES[category] || !ERROR_MESSAGES[category][key]) {
    console.warn(`⚠️ Mensaje de error no encontrado: ${category}.${key}`);
    return ERROR_MESSAGES.SYSTEM.INTERNAL_ERROR;
  }

  let message = ERROR_MESSAGES[category][key];
  
  // Reemplazar placeholders dinámicos
  Object.keys(replacements).forEach(placeholder => {
    const regex = new RegExp(`{${placeholder}}`, 'g');
    message = message.replace(regex, replacements[placeholder]);
  });

  return message;
};

// Función helper para obtener mensajes de validación específicos
const getValidationMessage = (field, type, value = null) => {
  const baseMessages = {
    required: `El campo "${field}" es obligatorio`,
    invalid_format: `El formato del campo "${field}" no es válido`,
    too_short: `El campo "${field}" es demasiado corto`,
    too_long: `El campo "${field}" es demasiado largo`,
    min_value: `El valor de "${field}" debe ser mayor a ${value}`,
    max_value: `El valor de "${field}" debe ser menor a ${value}`,
    invalid_email: `El correo electrónico "${field}" no tiene un formato válido`,
    already_exists: `El ${field} ya está en uso`
  };

  return baseMessages[type] || `Error de validación en el campo "${field}"`;
};

module.exports = {
  ERROR_MESSAGES,
  getErrorMessage,
  getValidationMessage
};