// src/utils/imageUtils.js

/**
 * Utilidades para manejo de imágenes - VERSIÓN SIN DESCARGA CORS
 * Funciones para validación de URLs e imágenes locales
 */

/**
 * Validar si un valor es un archivo File válido
 * @param {any} value - Valor a validar
 * @returns {boolean} - True si es un File válido
 */
export const isValidFile = (value) => {
  return value instanceof File && value.size > 0;
};

/**
 * Validar si un valor es una URL válida de imagen
 * @param {any} value - Valor a validar
 * @returns {boolean} - True si es una URL válida
 */
export const isValidImageUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return false;
  
  try {
    const url = new URL(value);
    
    // Solo permitir HTTP y HTTPS
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }
    
    // Verificar que sea una URL de imagen común
    const pathname = url.pathname.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    
    // Si tiene extensión de imagen, es válida
    if (imageExtensions.some(ext => pathname.endsWith(ext))) {
      return true;
    }
    
    // Si es de TMDB, asumimos que es válida
    if (url.hostname.includes('tmdb.org')) {
      return true;
    }
    
    // Para otras URLs, ser más estricto
    return false;
    
  } catch {
    return false;
  }
};

/**
 * Validar si un archivo File es una imagen válida
 * @param {File} file - Archivo a validar
 * @returns {boolean} - True si es una imagen válida
 */
export const isValidImageFile = (file) => {
  if (!isValidFile(file)) return false;
  
  // Verificar tipo MIME
  if (!file.type.startsWith('image/')) return false;
  
  // Verificar tamaño (máximo 10MB para imágenes)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) return false;
  
  return true;
};

/**
 * Procesar imagen de portada (URL o File) - SIN DESCARGA
 * Esta función ya NO descarga URLs, solo las valida
 * 
 * @param {string|File} coverImage - URL de imagen o archivo File
 * @returns {Promise<File|string>} - Archivo File o URL validada
 */
export const processCoverImage = async (coverImage) => {
  // Si ya es un archivo válido, validarlo y retornarlo
  if (isValidFile(coverImage)) {

    if (!isValidImageFile(coverImage)) {
      throw new Error('El archivo seleccionado no es una imagen válida o es demasiado grande (máx. 10MB)');
    }

    return coverImage; // Retorna el File
  }
  
  // Si es una URL válida, solo validarla (NO descargar)
  if (isValidImageUrl(coverImage)) {

    return coverImage; // Retorna la URL como string
  }
  
  // Si no es ni File ni URL válida, lanzar error descriptivo
  if (typeof coverImage === 'string') {
    throw new Error('La URL de imagen no es válida. Debe ser una URL completa (https://...)');
  }
  
  throw new Error('La imagen de portada debe ser un archivo válido o una URL de imagen');
};

/**
 * Obtener información de una imagen (File o URL)
 * @param {string|File} image - Imagen a analizar
 * @returns {Object} - Información de la imagen
 */
export const getImageInfo = (image) => {
  if (isValidFile(image)) {
    return {
      type: 'file',
      name: image.name,
      size: image.size,
      sizeFormatted: `${Math.round(image.size / 1024)}KB`,
      mimeType: image.type,
      isValid: isValidImageFile(image)
    };
  }
  
  if (isValidImageUrl(image)) {
    try {
      const url = new URL(image);
      return {
        type: 'url',
        name: url.pathname.split('/').pop() || 'imagen',
        url: image,
        hostname: url.hostname,
        isValid: true,
        isTMDB: url.hostname.includes('tmdb.org')
      };
    } catch {
      return {
        type: 'url',
        name: 'URL inválida',
        url: image,
        isValid: false
      };
    }
  }
  
  return {
    type: 'unknown',
    isValid: false
  };
};

/**
 * Crear una URL de vista previa para una imagen
 * @param {string|File} image - Imagen para crear preview
 * @returns {Promise<string>} - URL de vista previa
 */
export const createImagePreview = async (image) => {
  if (isValidFile(image)) {
    return URL.createObjectURL(image);
  }
  
  if (isValidImageUrl(image)) {
    return image; // Para URLs, usar directamente (el navegador manejará la carga)
  }
  
  throw new Error('No se puede crear vista previa de esta imagen');
};

/**
 * Limpiar URLs de vista previa creadas con createImagePreview
 * @param {string} previewUrl - URL de vista previa a limpiar
 */
export const cleanupImagePreview = (previewUrl) => {
  if (previewUrl && previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl);
  }
};

// ===== NUEVAS FUNCIONES PARA FORMULARIOS =====

/**
 * Obtiene información sobre el tipo de imagen y su presentación visual
 * 
 * ✅ REUTILIZABLE: Para cualquier componente que maneje imágenes
 * ✅ CONFIGURABLE: Prefijo CSS personalizable por componente
 * ✅ CONSISTENTE: Misma lógica para todos los tipos de imagen
 * ✅ ESCALABLE: Fácil agregar nuevos tipos de imagen
 * 
 * @param {string|null} imageType - Tipo de imagen: 'file', 'tmdb', 'url', o null
 * @param {string} [cssPrefix=''] - Prefijo para las clases CSS (ej: 'movie-form-view')
 * @returns {Object|null} Información del tipo de imagen o null si no hay tipo
 * 
 * @example
 * // Uso básico
 * const info = getImageTypeInfo('file');
 * // Resultado: { badge: '📁 Archivo Recortado', description: '...', bgClass: '__image-info--file' }
 * 
 * @example
 * // Con prefijo CSS personalizado
 * const info = getImageTypeInfo('tmdb', 'movie-form-view');
 * // Resultado: { badge: '🌐 TMDB', description: '...', bgClass: 'movie-form-view__image-info--tmdb' }
 */
export const getImageTypeInfo = (imageType, cssPrefix = '') => {
  if (!imageType) return null;

  const baseClass = cssPrefix ? `${cssPrefix}__image-info` : '__image-info';

  switch (imageType) {
    case 'file':
      return {
        badge: '📁 Archivo Recortado',
        description: 'Imagen subida y recortada manualmente',
        bgClass: `${baseClass}--file`
      };
    case 'tmdb':
      return {
        badge: '🌐 TMDB',
        description: 'Imagen de alta calidad desde TMDB',
        bgClass: `${baseClass}--tmdb`
      };
    case 'url':
      return {
        badge: '🔗 URL Externa',
        description: 'Imagen desde enlace externo',
        bgClass: `${baseClass}--url`
      };
    default:
      return null;
  }
};

/**
 * Determina el tipo de imagen basado en su fuente
 * 
 * @param {string} imageSrc - URL o fuente de la imagen
 * @returns {string} Tipo de imagen: 'tmdb', 'url', o 'unknown'
 */
export const detectImageType = (imageSrc) => {
  if (!imageSrc || typeof imageSrc !== 'string') return 'unknown';
  
  if (imageSrc.includes('image.tmdb.org')) return 'tmdb';
  if (imageSrc.startsWith('http')) return 'url';
  if (imageSrc.startsWith('blob:')) return 'file';
  
  return 'unknown';
};

/**
 * Selecciona la imagen final con prioridad: File > URL externa > Cover Image
 * 
 * @param {Object} imageData - Objeto con las diferentes fuentes de imagen
 * @param {File|null} imageData.coverImageFile - Archivo recortado
 * @param {string|null} imageData.coverImageUrl - URL externa
 * @param {string|null} imageData.coverImage - Imagen de cobertura (TMDB)
 * @returns {File|string|null} La imagen final seleccionada
 */
export const selectFinalImage = ({ coverImageFile, coverImageUrl, coverImage }) => {
  // Prioridad: 1. Archivo recortado (SIEMPRE tiene prioridad)
  if (coverImageFile && coverImageFile instanceof File) {
    return coverImageFile;
  }
  
  // 2. URL externa
  if (coverImageUrl && typeof coverImageUrl === 'string' && coverImageUrl.trim()) {
    return coverImageUrl;
  }
  
  // 3. Cover Image (TMDB)
  if (coverImage && typeof coverImage === 'string' && coverImage.trim()) {
    return coverImage;
  }
  
  return null;
};