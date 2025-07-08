// config.js

const imageconfig = {
  width: 640,
  height: 360,
  format: 'jpeg',
  quality: 80,
};

const { config } = require('../config/config');

const videoConfig = {
  transcode: {
    // ===== MODO DE PROCESAMIENTO =====
    // Configurado desde variables de entorno (VIDEO_PROCESSING_MODE)
    // 'original' - Solo procesa la calidad original del video
    // 'multiple' - Procesa múltiples calidades para streaming adaptativo
    processingMode: config.videoProcessingMode,
    
    // ===== CONFIGURACIÓN DE CALIDADES =====
    baseQualities: [
      { h: 480, vbr: 1400, abr: 128 }, // 480p
      { h: 720, vbr: 2800, abr: 160 }, // 720p
      { h: 1080, vbr: 5000, abr: 192 }, // 1080p
      { h: 1440, vbr: 8000, abr: 256 }, // 2K (1440p)
      { h: 2160, vbr: 12000, abr: 320 }, // 4K (2160p)
    ],
    
    // ===== CONFIGURACIÓN DE CODIFICACIÓN =====
    // Configurado desde variables de entorno (VIDEO_QUALITY_PROFILE)
    crf: {
      high: 18,      // Calidad alta (menor compresión)
      standard: 24,  // Calidad estándar (mayor compresión)
    },
    profile: {
      high: 'high',     // Perfil H.264 alto
      standard: 'main', // Perfil H.264 estándar
    },
    // Perfil actual seleccionado desde variables de entorno
    activeQualityProfile: config.videoQualityProfile,
  },
};

module.exports = { videoConfig, imageconfig };
