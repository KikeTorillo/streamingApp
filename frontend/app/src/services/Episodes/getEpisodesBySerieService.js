// src/services/Episodes/getEpisodesBySerieService.js
// ✅ REUTILIZAR el servicio existente
import { getEpisodesService } from './getEpisodesService'; // Asumiendo que ya lo tienes

const getEpisodesBySerieService = async (serieId) => {
  try {

    // ✅ Usar el servicio existente con el filtro de serieId
    const episodes = await getEpisodesService({ serieId });

    return {
      success: true,
      data: Array.isArray(episodes) ? episodes : episodes.data || [],
      message: 'Episodios obtenidos exitosamente'
    };
    
  } catch (error) {

    return {
      success: false,
      data: [],
      message: error.message || 'Error al obtener episodios'
    };
  }
};

export { getEpisodesBySerieService };