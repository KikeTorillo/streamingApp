// ===== FORM UTILITIES - FUNCIONES REUTILIZABLES PARA FORMULARIOS =====
// src/utils/formUtils.js

/**
 * Filtra campos vacíos, nulos o undefined de datos de formulario
 * 
 * ✅ REUTILIZABLE: Para cualquier formulario en la aplicación
 * ✅ CONFIGURABLE: Puede excluir campos específicos
 * ✅ ROBUSTO: Maneja diferentes tipos de datos (File, string, number, boolean, array)
 * ✅ LIMPIO: Aplica trim() a strings automáticamente
 * 
 * @param {Object} formData - Datos del formulario a filtrar
 * @param {string[]} [excludeFields=[]] - Array de nombres de campos a excluir del resultado
 * @returns {Object} Objeto filtrado solo con campos que tienen valores válidos
 * 
 * @example
 * // Uso básico
 * const cleanData = filterEmptyFields({
 *   name: 'Juan',
 *   email: '',
 *   age: 25,
 *   avatar: null
 * });
 * // Resultado: { name: 'Juan', age: 25 }
 * 
 * @example
 * // Excluyendo campos específicos
 * const userData = filterEmptyFields(formData, ['confirmPassword']);
 * // No incluirá confirmPassword en el resultado
 */
export const filterEmptyFields = (formData, excludeFields = []) => {
  const filteredData = {};
  
  Object.keys(formData).forEach(key => {
    // Excluir campos específicos (como confirmPassword)
    if (excludeFields.includes(key)) return;
    
    const value = formData[key];
    
    // Solo incluir el campo si tiene un valor válido
    if (value !== null && value !== undefined && value !== '') {
      // Para archivos, verificar que sea un File válido
      if (value instanceof File) {
        filteredData[key] = value;
      }
      // Para strings, verificar que no estén vacíos después de trim
      else if (typeof value === 'string' && value.trim() !== '') {
        filteredData[key] = value.trim();
      }
      // Para números, verificar que sean válidos
      else if (typeof value === 'number' && !isNaN(value)) {
        filteredData[key] = value;
      }
      // Para booleans y arrays (siempre válidos)
      else if (typeof value === 'boolean' || Array.isArray(value)) {
        filteredData[key] = value;
      }
    }
  });
  
  return filteredData;
};

/**
 * Valida que las contraseñas coincidan
 * 
 * @param {string} password - Contraseña principal
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} true si coinciden, false si no
 */
export const validatePasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Prepara datos de usuario para envío (elimina confirmPassword y filtra campos vacíos)
 * 
 * @param {Object} formData - Datos del formulario de usuario
 * @returns {Object} Datos limpios para envío al backend
 */
export const prepareUserData = (formData) => {
  return filterEmptyFields(formData, ['confirmPassword']);
};