// src/services/Movies/createMovieService.js
import axios from "axios";
import { environmentService } from "../environmentService";
import { processCoverImage, isValidFile, isValidImageUrl } from "../../utils/imageUtils";

/**
 * Crear nueva película - VERSIÓN SIN DESCARGA CORS
 * Maneja Files locales y URLs (que el backend descargará)
 * 
 * @param {Object} movieData - Datos de la película
 * @param {string} movieData.title - Título de la película
 * @param {number} movieData.categoryId - ID de categoría
 * @param {number} movieData.releaseYear - Año de lanzamiento  
 * @param {string} movieData.description - Descripción
 * @param {File} movieData.video - Archivo de video (requerido)
 * @param {File|string} movieData.coverImage - Imagen de portada (File o URL)
 * @returns {Promise<Object>} - Respuesta del servidor
 */
const createMovieService = async (movieData) => {
  const { urlBackend } = environmentService();
  
  try {
    // Validaciones básicas
    if (!movieData.title?.trim()) {
      throw new Error('El título es requerido');
    }
    
    if (!movieData.video || !isValidFile(movieData.video)) {
      throw new Error('El archivo de video es requerido');
    }
    
    if (!movieData.coverImage) {
      throw new Error('La imagen de portada es requerida');
    }
    
    // Procesar la imagen de portada (valida pero NO descarga URLs)

    const processedCoverImage = await processCoverImage(movieData.coverImage);
    
    // Crear FormData
    const formData = new FormData();
    formData.append("title", movieData.title.trim());
    formData.append("categoryId", movieData.categoryId);
    formData.append("releaseYear", movieData.releaseYear);
    formData.append("description", movieData.description || "");
    formData.append("video", movieData.video);
    
    // Manejar coverImage según el tipo (File vs URL)
    if (isValidFile(processedCoverImage)) {
      // Es un archivo local - enviarlo como File
      formData.append("coverImage", processedCoverImage);

    } else if (isValidImageUrl(processedCoverImage)) {
      // Es una URL - enviarla como string en un campo separado
      formData.append("coverImageUrl", processedCoverImage);

    } else {
      throw new Error('Error interno: imagen procesada no es válida');
    }

    // Realizar petición al backend con progreso de upload
    const response = await axios.post(`${urlBackend}/api/v1/movies`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      },
      withCredentials: true,
      timeout: 5 * 60 * 1000, // 5 minutos para videos grandes
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

          // Trigger custom event para actualizar progreso
          window.dispatchEvent(new CustomEvent('uploadProgress', { 
            detail: { progress: percentCompleted } 
          }));
        }
      }
    });

    return response.data;
    
  } catch (error) {

    // Mejorar mensajes de error para el usuario
    if (error.response?.status === 413) {
      throw new Error('El archivo de video es demasiado grande');
    }
    
    if (error.response?.status === 409) {
      throw new Error('Esta película ya existe en el sistema');
    }
    
    // Manejar errores específicos de descarga de imagen del backend
    if (error.response?.status === 500 && error.response?.data?.error === 'IMAGE_DOWNLOAD_FAILED') {
      const errorMsg = error.response.data.message || 'Error al descargar la imagen';

      throw new Error(errorMsg);
    }
    
    if (error.response?.status === 400 && error.response?.data?.error === 'INVALID_IMAGE_URL') {
      throw new Error('La URL de la imagen no es válida o no está permitida');
    }
    
    if (error.response?.status === 500 && error.response?.data?.error === 'UNEXPECTED_DOWNLOAD_ERROR') {
      throw new Error('Error inesperado al procesar la imagen. Intenta nuevamente.');
    }
    
    if (error.response?.status === 400 && error.response?.data?.message?.includes('imagen')) {
      throw new Error('Error al procesar la imagen: ' + error.response.data.message);
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('La subida tardó demasiado tiempo. Inténtalo con un archivo más pequeño');
    }
    
    // Si es un error que ya lanzamos nosotros, mantenerlo
    if (error.message.includes('requerido') || 
        error.message.includes('URL de imagen no es válida') ||
        error.message.includes('archivo seleccionado no es una imagen')) {
      throw error;
    }
    
    // Error genérico del backend
    const backendMessage = error.response?.data?.message || error.message || 'Error al crear la película';
    throw new Error(backendMessage);
  }
};

export { createMovieService };