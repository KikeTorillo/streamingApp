// utils/transcodeSettings.js
const { videoConfig } = require('./configMediaQualities');

/**
 * Calcula las resoluciones basadas en la proporción del video original y
 * en las calidades definidas en config.
 *
 * @param {number} originalWidth - Ancho original del video.
 * @param {number} originalHeight - Alto original del video.
 * @returns {Array} Array de objetos con { w, h, vbr, abr }.
 */
const calculateResolutions = (originalWidth, originalHeight) => {
  const aspectRatio = originalWidth / originalHeight;
  
  // Si está en modo 'original', solo devolver la resolución original
  if (videoConfig.transcode.processingMode === 'original') {
    // Buscar la calidad que más se acerque a la original, o usar parámetros por defecto
    const closestQuality = videoConfig.transcode.baseQualities.find(q => q.h === originalHeight) ||
                          videoConfig.transcode.baseQualities.find(q => q.h >= originalHeight) ||
                          videoConfig.transcode.baseQualities[videoConfig.transcode.baseQualities.length - 1];
    
    return [{
      w: originalWidth,
      h: originalHeight,
      vbr: closestQuality.vbr,
      abr: closestQuality.abr
    }];
  }
  
  // Modo 'multiple': generar resoluciones inferiores + original
  const resolutions = [];
  
  // Agregar resoluciones inferiores solamente
  videoConfig.transcode.baseQualities.forEach((q) => {
    if (q.h < originalHeight) {
      let newWidth = Math.round(q.h * aspectRatio);
      if (newWidth % 2 !== 0) {
        newWidth += 1;
      }
      resolutions.push({ w: newWidth, h: q.h, vbr: q.vbr, abr: q.abr });
    }
  });
  
  // Agregar la resolución original al final (siempre se incluye)
  const originalQuality = videoConfig.transcode.baseQualities.find(q => q.h === originalHeight) ||
                          videoConfig.transcode.baseQualities.find(q => q.h >= originalHeight) ||
                          videoConfig.transcode.baseQualities[videoConfig.transcode.baseQualities.length - 1];
  
  resolutions.push({
    w: originalWidth,
    h: originalHeight,
    vbr: originalQuality.vbr,
    abr: originalQuality.abr
  });
  
  return resolutions;
};

/**
 * Determina la calidad máxima (número de niveles) según la altura original.
 *
 * @param {number} originalHeight - Alto original del video.
 * @returns {number} Número de niveles de calidad.
 */
const determineMaxQuality = (originalHeight) => {
  // Si está en modo 'original', solo procesar 1 calidad
  if (videoConfig.transcode.processingMode === 'original') {
    return 1;
  }
  
  // Modo 'multiple': contar resoluciones inferiores + original
  const inferiorQualities = videoConfig.transcode.baseQualities.filter(q => q.h < originalHeight);
  return inferiorQualities.length + 1; // +1 para la resolución original
};

/**
 * Obtiene el modo de procesamiento actual
 * @returns {string} 'original' o 'multiple'
 */
const getProcessingMode = () => {
  return videoConfig.transcode.processingMode;
};

/**
 * Obtiene información sobre la configuración actual
 * @returns {Object} Información de configuración
 */
const getConfigInfo = () => {
  const mode = videoConfig.transcode.processingMode;
  return {
    mode,
    description: mode === 'original' 
      ? 'Solo procesa la calidad original del video'
      : 'Procesa múltiples calidades para streaming adaptativo',
    availableQualities: videoConfig.transcode.baseQualities.map(q => `${q.h}p`),
    howToChange: {
      toOriginal: "Cambiar processingMode a 'original' en configMediaQualities.js",
      toMultiple: "Cambiar processingMode a 'multiple' en configMediaQualities.js"
    }
  };
};

module.exports = {
  calculateResolutions,
  determineMaxQuality,
  getProcessingMode,
  getConfigInfo,
};
