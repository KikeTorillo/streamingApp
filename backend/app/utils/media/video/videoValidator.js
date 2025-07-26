const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * Promisifica ffprobe para usar async/await
 */
const ffprobeAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

/**
 * Valida si un video tiene características óptimas para una calidad específica
 * @param {string} filePath - Ruta del archivo de video
 * @param {Object} targetQuality - Calidad objetivo {h, vbr, abr}
 * @returns {Promise<Object>} Resultado de validación
 */
const validateVideoForQuality = async (filePath, targetQuality) => {
  try {
    const data = await ffprobeAsync(filePath);
    
    // Buscar stream de video principal
    const videoStream = data.streams.find(
      stream => stream.codec_type === 'video' && 
                stream.codec_name !== 'mjpeg'
    );
    
    // Buscar stream de audio principal
    const audioStream = data.streams.find(
      stream => stream.codec_type === 'audio'
    );
    
    if (!videoStream) {
      return {
        isValid: false,
        reason: 'No video stream found',
        needsTranscoding: true
      };
    }
    
    const validation = {
      isValid: true,
      needsTranscoding: false,
      checks: {},
      videoStream,
      audioStream
    };
    
    // 1. Validar codec de video
    const validVideoCodecs = ['h264', 'libx264'];
    validation.checks.videoCodec = validVideoCodecs.includes(videoStream.codec_name);
    
    // 2. Validar resolución (exacta o muy cercana)
    const heightDifference = Math.abs(videoStream.height - targetQuality.h);
    const widthDifference = targetQuality.w ? Math.abs(videoStream.width - targetQuality.w) : 0;
    
    // Permitir diferencias pequeñas en resolución (hasta 2 píxeles por redondeo de aspect ratio)
    validation.checks.resolution = heightDifference <= 2 && widthDifference <= 2;
    
    // 3. Validar formato de contenedor
    validation.checks.container = data.format.format_name.includes('mp4');
    
    // 4. Validar bitrate de video (permisivo para videos sin bitrate info)
    const videoBitrate = parseInt(videoStream.bit_rate) || 0;
    
    // Definir variables para debug (necesarias fuera del scope)
    let audioBitrate = 0;
    
    // Si el video no tiene bitrate info pero tiene las otras características correctas,
    // lo consideramos válido (común en videos procesados por FFmpeg)
    if (videoBitrate === 0) {
      // Sin bitrate info: válido si codec y resolución son correctos
      validation.checks.videoBitrate = true;
    } else {
      // Con bitrate info: validar con tolerancia muy amplia
      const targetBitrate = targetQuality.vbr * 1000; // Convertir a bps
      
      // Tolerancia extremadamente permisiva para videos bien optimizados
      const bitrateToleranceLower = Math.min(targetBitrate * 0.2, 1000000); // Mínimo 1Mbps o 20% del target
      const bitrateToleranceUpper = targetBitrate * 3.0; // 300% más (muy permisivo)
      
      validation.checks.videoBitrate = 
        (videoBitrate >= bitrateToleranceLower && videoBitrate <= bitrateToleranceUpper);
        
      // Log para debug
      console.log(`🔍 Bitrate check: ${videoBitrate} bps vs range [${bitrateToleranceLower}-${bitrateToleranceUpper}] bps`);
    }
    
    // 5. Validar codec de audio (si existe)
    if (audioStream) {
      const validAudioCodecs = ['aac', 'mp3'];
      validation.checks.audioCodec = validAudioCodecs.includes(audioStream.codec_name);
      
      // Validar bitrate de audio (permisivo para audio sin bitrate info)
      audioBitrate = parseInt(audioStream.bit_rate) || 0;
      
      if (audioBitrate === 0) {
        // Sin bitrate info: válido si codec es correcto
        validation.checks.audioBitrate = true;
      } else {
        // Con bitrate info: validar con tolerancia amplia
        const targetAudioBitrate = targetQuality.abr * 1000;
        const audioToleranceLower = targetAudioBitrate * 0.5; // 50% menos
        const audioToleranceUpper = targetAudioBitrate * 2.0; // 100% más
        
        validation.checks.audioBitrate = 
          (audioBitrate >= audioToleranceLower && audioBitrate <= audioToleranceUpper);
      }
    } else {
      validation.checks.audioCodec = true; // No audio is OK
      validation.checks.audioBitrate = true;
    }
    
    // Separar validación de video y audio
    const videoChecks = ['videoCodec', 'resolution', 'container', 'videoBitrate'];
    const audioChecks = ['audioCodec', 'audioBitrate'];
    
    const videoValid = videoChecks.every(check => validation.checks[check] === true);
    const audioValid = audioChecks.every(check => validation.checks[check] === true);
    
    validation.videoValid = videoValid;
    validation.audioValid = audioValid;
    validation.isValid = videoValid && audioValid;
    validation.needsTranscoding = !validation.isValid;
    
    // Información adicional para optimización
    validation.canCopyVideo = videoValid && validation.checks.container; // Video válido y contenedor MP4
    validation.needsAudioTranscoding = !audioValid;
    validation.needsVideoTranscoding = !videoValid;
    
    // Razón específica si falla con detalles
    if (!validation.isValid) {
      const failedChecks = Object.entries(validation.checks)
        .filter(([_, passed]) => !passed)
        .map(([check, _]) => check);
      
      // Agregar información de debug
      const debugInfo = {
        codec: videoStream.codec_name,
        resolution: `${videoStream.width}x${videoStream.height}`,
        targetResolution: `${targetQuality.w || 'auto'}x${targetQuality.h}`,
        resolutionDiff: `w:${widthDifference || 0}, h:${heightDifference}`,
        bitrate: videoBitrate ? `${Math.round(videoBitrate/1000)}k` : 'no info',
        targetBitrate: `${targetQuality.vbr}k`,
        bitrateRange: videoBitrate ? `${Math.round((Math.min(targetQuality.vbr * 1000 * 0.2, 1000000))/1000)}k-${Math.round((targetQuality.vbr * 1000 * 3.0)/1000)}k` : 'n/a',
        container: data.format.format_name,
        canCopyVideo: validation.canCopyVideo,
        needsAudioTranscoding: validation.needsAudioTranscoding,
        needsVideoTranscoding: validation.needsVideoTranscoding
      };
      
      validation.reason = `Failed checks: ${failedChecks.join(', ')}. Debug: ${JSON.stringify(debugInfo)}`;
    }
    
    return validation;
    
  } catch (error) {
    return {
      isValid: false,
      reason: `Error analyzing video: ${error.message}`,
      needsTranscoding: true
    };
  }
};

/**
 * Valida si el archivo original puede ser usado directamente para alguna calidad
 * @param {string} filePath - Ruta del archivo de video
 * @param {Array} targetQualities - Array de calidades objetivo
 * @returns {Promise<Object>} Mapa de calidades y su estado de validación
 */
const validateVideoForMultipleQualities = async (filePath, targetQualities) => {
  const results = {};
  
  for (const quality of targetQualities) {
    try {
      const validation = await validateVideoForQuality(filePath, quality);
      results[quality.h] = validation;
    } catch (error) {
      results[quality.h] = {
        isValid: false,
        reason: error.message,
        needsTranscoding: true
      };
    }
  }
  
  return results;
};

/**
 * Obtiene información detallada del video para logging
 * @param {string} filePath - Ruta del archivo de video
 * @returns {Promise<Object>} Información del video
 */
const getVideoInfo = async (filePath) => {
  try {
    const data = await ffprobeAsync(filePath);
    const videoStream = data.streams.find(s => s.codec_type === 'video');
    const audioStream = data.streams.find(s => s.codec_type === 'audio');
    
    return {
      format: data.format.format_name,
      duration: data.format.duration,
      video: videoStream ? {
        codec: videoStream.codec_name,
        width: videoStream.width,
        height: videoStream.height,
        bitrate: videoStream.bit_rate,
        fps: videoStream.r_frame_rate
      } : null,
      audio: audioStream ? {
        codec: audioStream.codec_name,
        bitrate: audioStream.bit_rate,
        channels: audioStream.channels
      } : null
    };
  } catch (error) {
    return {
      error: error.message
    };
  }
};

module.exports = {
  validateVideoForQuality,
  validateVideoForMultipleQualities,
  getVideoInfo
};