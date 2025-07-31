// src/services/Series/createSeriesService.js
import axios from "axios";
import { environmentService } from "../environmentService";
import { processCoverImage, isValidFile, isValidImageUrl } from "../../utils/imageUtils";

/**
 * Crear nueva serie - VERSIÓN SIN DESCARGA CORS
 * Maneja Files locales y URLs (que el backend descargará)
 * 
 * @param {Object} seriesData - Datos de la serie
 * @param {string} seriesData.title - Título de la serie
 * @param {number} seriesData.categoryId - ID de categoría
 * @param {number} seriesData.releaseYear - Año de lanzamiento
 * @param {string} seriesData.description - Descripción/sinopsis
 * @param {File|string} seriesData.coverImage - Imagen de portada (File o URL)
 * @returns {Promise<Object>} - Respuesta del servidor
 */
const createSeriesService = async (seriesData) => {
  const { urlBackend } = environmentService();
  
  try {
    // Validaciones básicas
    if (!seriesData.title?.trim()) {
      throw new Error('El título es requerido');
    }
    
    if (!seriesData.coverImage) {
      throw new Error('La imagen de portada es requerida');
    }
    
    // Procesar la imagen de portada (valida pero NO descarga URLs)

    const processedCoverImage = await processCoverImage(seriesData.coverImage);
    
    // Crear FormData
    const formData = new FormData();
    formData.append("title", seriesData.title.trim());
    formData.append("categoryId", seriesData.categoryId);
    formData.append("releaseYear", seriesData.releaseYear);
    formData.append("description", seriesData.description || "");
    
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

    // Realizar petición al backend
    const response = await axios.post(`${urlBackend}/api/v1/series`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      },
      withCredentials: true,
      timeout: 2 * 60 * 1000, // 2 minutos para imágenes
    });

    return response.data;
    
  } catch (error) {

    // Mejorar mensajes de error para el usuario
    if (error.response?.status === 413) {
      throw new Error('La imagen es demasiado grande');
    }
    
    if (error.response?.status === 409) {
      throw new Error('Esta serie ya existe en el sistema');
    }
    
    if (error.response?.status === 400 && error.response?.data?.message?.includes('imagen')) {
      throw new Error('Error al procesar la imagen: ' + error.response.data.message);
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('La subida tardó demasiado tiempo. Inténtalo de nuevo');
    }
    
    // Si es un error que ya lanzamos nosotros, mantenerlo
    if (error.message.includes('requerido') || 
        error.message.includes('URL de imagen no es válida') ||
        error.message.includes('archivo seleccionado no es una imagen')) {
      throw error;
    }
    
    // Error genérico del backend
    throw new Error(error.response?.data?.message || 'Error al crear la serie');
  }
};

export { createSeriesService };