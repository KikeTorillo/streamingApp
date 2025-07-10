const ffmpegStatic = require('ffmpeg-static'); // Importa el binario estático de FFmpeg para usarlo en Node.js.
const ffmpeg = require('fluent-ffmpeg'); // Importa la biblioteca fluent-ffmpeg para interactuar con FFmpeg.
const fs = require('fs'); // Módulo de Node.js para interactuar con el sistema de archivos.
const { uploadFileIfNotExists, copyFileToMinIO } = require('../utils/aws');
const { createTempDir, deleteTempDir } = require('../utils/fileHelpers');
const {
  calculateResolutions,
  determineMaxQuality,
  getProcessingMode,
  getConfigInfo,
} = require('../utils/transcodeSettings');
const { generateOutputOptions } = require('../utils/ffmpegOptions');
const { processSubtitles } = require('../utils/subtitleProcessor');
const { config } = require('../config/config');
const { validateVideoForMultipleQualities, getVideoInfo } = require('../utils/videoValidator');
// Configura la ruta del binario de FFmpeg usando el módulo `ffmpeg-static`.
ffmpeg.setFfmpegPath(ffmpegStatic);

/**
 * Promisifica ffprobe para usar async/await en lugar de callbacks.
 * @param {string} filePath - Ruta del video.
 * @returns {Promise<Object>} - Datos de ffprobe.
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
 * Detecta todas las pistas de audio compatibles con el contenedor MP4.
 * Se incluyen los codecs más usados: aac, mp3, opus y ac3.
 */
const detectCompatibleAudioStreams = async (filePath) => {
  const data = await ffprobeAsync(filePath);
  return data.streams.filter(
    (stream) =>
      stream.codec_type === 'audio' &&
      ['aac', 'mp3', 'opus', 'ac3'].includes(stream.codec_name)
  );
};

/**
 * Función principal de transcodificación:
 * - Transcodifica un video en varias calidades y lo sube a MinIO.
 * - Se selecciona el stream de video principal (excluyendo MJPEG).
 * - Soporta múltiples pistas de audio y subtítulos.
 * - Extrae las pistas de subtítulos (no forzadas) a archivos WebVTT externos y los sube a MinIO.
 * - Informa el progreso mediante un callback `onProgress`.
 */
const transcode = async (filePath, fileHash, onProgress) => {
  const fileName = fileHash;
  // Arrays y objetos para manejar la nomenclatura de los archivos de subtítulos
  const availableSubtitles = [];
  let availableResolutions = [];
  const localDir = `${config.tempProcessingDir}/${fileName}`;
  try {
    await createTempDir(localDir);

    // Usamos ffprobeAsync en lugar de ffmpeg.ffprobe con callbacks
    let data;
    try {
      data = await ffprobeAsync(filePath);
    } catch (err) {
      console.error(`Error al analizar el video: ${err.message}`);
      throw err;
    }

    const validCodecs = [
      'h264',
      'hevc',
      'vp9',
      'av1', // Códecs de video modernos
      'mpeg4',
      'theora', // Códecs de video antiguos
    ];

    const primaryVideoStream = data.streams.find(
      (item) =>
        item.codec_type === 'video' && validCodecs.includes(item.codec_name)
    );

    if (!primaryVideoStream) {
      console.error(
        'No se encontró un stream de video principal (no MJPEG) en el archivo.'
      );
      throw new Error(
        'No se encontró un stream de video principal en el archivo.'
      );
    }

    const primaryVideoIndex = primaryVideoStream.index;
    const originalWidth = primaryVideoStream.width;
    const originalHeight = primaryVideoStream.height;
    // Get duration from format instead of video stream (more reliable)
    const duration = data.format.duration;

    // Detecta las pistas de audio compatibles.
    const audioStreams = await detectCompatibleAudioStreams(filePath);
    if (audioStreams.length === 0) {
      console.warn(
        'No se encontraron pistas de audio compatibles. El video no tendrá audio.'
      );
    }

    // Detecta las pistas de subtítulos.
    const subtitleStreams = data.streams.filter(
      (stream) => stream.codec_type === 'subtitle'
    );
    if (subtitleStreams.length > 0) {
      console.log('Pistas de subtítulos encontradas:', subtitleStreams.length);
    } else {
      console.warn('No se encontraron pistas de subtítulos.');
    }

    // Calcula las resoluciones y determina la máxima calidad usando el módulo extraído.
    let qualities = calculateResolutions(originalWidth, originalHeight);
    const maxQuality = determineMaxQuality(originalHeight);

    // Para la máxima calidad se preserva la resolución original.
    qualities[maxQuality - 1] = {
      w: originalWidth,
      h: originalHeight,
      vbr: qualities[maxQuality - 1].vbr,
      abr: qualities[maxQuality - 1].abr,
    };

    // Se arma un array solo con las alturas disponibles para las resoluciones
    availableResolutions = qualities.slice(0, maxQuality).map((q) => q.h);

    // Mostrar información de configuración
    const configInfo = getConfigInfo();
    console.log(`\x1b[36m📋 Modo de procesamiento: ${configInfo.mode.toUpperCase()}\x1b[0m`);
    console.log(`\x1b[36m📋 ${configInfo.description}\x1b[0m`);
    console.log(`Generando ${maxQuality} calidades para el video.`);

    // Validar características del video para optimización
    console.log(`\x1b[36m🔍 Analizando archivo: ${filePath}\x1b[0m`);
    const videoInfo = await getVideoInfo(filePath);
    console.log('📊 Información del video original:', JSON.stringify(videoInfo, null, 2));
    
    console.log(`\x1b[36m🧪 Validando para ${maxQuality} calidades...\x1b[0m`);
    const validationResults = await validateVideoForMultipleQualities(filePath, qualities.slice(0, maxQuality));
    console.log('🔍 Resultados de validación completos:', JSON.stringify(validationResults, null, 2));

    // Procesa cada calidad (con optimización inteligente)
    for (let [index, q] of qualities.slice(0, maxQuality).entries()) {
      console.log(`\x1b[35m┌─ Procesando calidad ${index + 1}/${maxQuality}: ${q.h}p\x1b[0m`);
      
      const outputFile = `${localDir}/_${q.h}p.mp4`;
      const remotePath = `${config.videoDir}/${fileName}/_${q.h}p.mp4`;
      const validation = validationResults[q.h];

      console.log(`\x1b[35m├─ Output: ${outputFile}\x1b[0m`);
      console.log(`\x1b[35m├─ Remote: ${remotePath}\x1b[0m`);
      console.log(`\x1b[35m├─ Validación para ${q.h}p:`, validation ? validation : 'NO ENCONTRADA');

      // Calcular progreso base para esta calidad
      const progressBase = (index / maxQuality) * 100;
      const progressNext = ((index + 1) / maxQuality) * 100;

      if (validation && validation.isValid && !validation.needsTranscoding) {
        console.log(`\x1b[32m✓ Calidad ${q.h}p: Video ya tiene características óptimas, copiando directamente\x1b[0m`);
        
        try {
          // Copiar archivo directamente sin transcodificación
          await copyFileToMinIO(filePath, remotePath);
          
          // Actualizar progreso instantáneamente
          onProgress(Math.round(progressNext));
          
          console.log(`\x1b[32m✓ Calidad ${q.h}p: Copiado exitosamente\x1b[0m`);
        } catch (err) {
          console.error(`\x1b[31m✗ Error copiando ${q.h}p: ${err.message}\x1b[0m`);
          throw new Error(`Falló copia de ${remotePath}: ${err.message}`);
        }
      } else {
        // Verificar si es la resolución original
        const isOriginalResolution = (q.w === originalWidth && q.h === originalHeight);
        
        // Preparar información del video original para optimización
        const originalVideoInfo = videoInfo.video ? {
          codec: videoInfo.video.codec,
          width: videoInfo.video.width,
          height: videoInfo.video.height,
          bitrate: videoInfo.video.bitrate
        } : null;
        
        // Determinar qué necesita procesamiento
        const needsVideoTranscoding = validation && validation.needsVideoTranscoding;
        const needsAudioTranscoding = validation && validation.needsAudioTranscoding;
        const canCopyVideo = validation && validation.canCopyVideo;
        
        // Mensaje más claro sobre qué se va a hacer
        if (canCopyVideo && needsAudioTranscoding && !needsVideoTranscoding) {
          console.log(`\x1b[36m🎯 Calidad ${q.h}p: Optimización inteligente\x1b[0m`);
          console.log(`   📹 Video: COPIADO sin pérdida (${Math.round(originalVideoInfo?.bitrate/1000 || 0)}k mantenido)`);
          console.log(`   🎵 Audio: TRANSCODIFICADO (${validation.audioStream?.codec_name || 'unknown'} → AAC 192k)`);
        } else if (needsVideoTranscoding && needsAudioTranscoding) {
          console.log(`\x1b[33m⚡ Calidad ${q.h}p: Transcodificación completa\x1b[0m`);
          console.log(`   📹 Video: TRANSCODIFICADO (${validation.videoStream?.codec_name || 'unknown'} → h264)`);
          console.log(`   🎵 Audio: TRANSCODIFICADO (${validation.audioStream?.codec_name || 'unknown'} → AAC 192k)`);
        } else if (needsVideoTranscoding && !needsAudioTranscoding) {
          console.log(`\x1b[33m⚡ Calidad ${q.h}p: Transcodificación de video\x1b[0m`);
          console.log(`   📹 Video: TRANSCODIFICADO (${validation.videoStream?.codec_name || 'unknown'} → h264)`);
          console.log(`   🎵 Audio: COPIADO sin cambios`);
        } else {
          console.log(`\x1b[33m⚡ Calidad ${q.h}p: Requiere procesamiento\x1b[0m`);
          console.log(`   Razón: ${validation ? validation.reason : 'Validación fallida'}`);
        }
        
        // Usar generateOutputOptions para obtener las opciones de salida
        const opts = generateOutputOptions(
          q,
          index,
          maxQuality,
          primaryVideoIndex,
          audioStreams,
          subtitleStreams,
          originalVideoInfo,
          isOriginalResolution
        );

        await new Promise((resolveTranscode, rejectTranscode) => {
          ffmpeg(filePath)
            .output(outputFile)
            .outputOptions(opts)
            .on('start', (commandLine) => {
              console.log(`\x1b[90m🔧 Comando FFmpeg ejecutado:\x1b[0m`);
              console.log(`   ${commandLine}`);
              
              // Mostrar qué optimizaciones se aplicaron
              if (commandLine.includes('-c:v copy')) {
                console.log(`   \x1b[32m✅ Video: Copiado sin pérdida\x1b[0m`);
              } else {
                console.log(`   \x1b[33m⚡ Video: Transcodificado\x1b[0m`);
              }
              
              if (commandLine.includes('-c:a aac')) {
                console.log(`   \x1b[36m🎵 Audio: Convertido a AAC\x1b[0m`);
              }
            })
            .on('progress', (progress) => {
              // Calcula el progreso global teniendo en cuenta todas las calidades
              const qualityProgress = progressBase + ((progress.percent / 100) * (progressNext - progressBase));
              onProgress(Math.round(qualityProgress));
            })
            .on('end', () => {
              console.log(`\x1b[32m✅ ${outputFile} procesado correctamente\x1b[0m`);
              
              // Mostrar resumen de optimizaciones aplicadas
              if (canCopyVideo && needsAudioTranscoding && !needsVideoTranscoding) {
                console.log(`   \x1b[36m🎯 Resultado: Video sin pérdida + Audio optimizado\x1b[0m`);
              } else if (needsVideoTranscoding && needsAudioTranscoding) {
                console.log(`   \x1b[33m⚡ Resultado: Video y Audio transcodificados\x1b[0m`);
              } else if (needsVideoTranscoding && !needsAudioTranscoding) {
                console.log(`   \x1b[33m⚡ Resultado: Video transcodificado + Audio copiado\x1b[0m`);
              }
              
              resolveTranscode();
            })
            .on('error', (err) => {
              console.error(`Error al procesar el archivo: ${outputFile}`, err);
              rejectTranscode(err);
            })
            .run();
        });
        
        try {
          await uploadFileIfNotExists(outputFile, remotePath);
        } catch (err) {
          throw new Error(`Falló subida de ${remotePath}: ${err.message}`);
        }
      }
    }

    // --- Extracción y subida de pistas de subtítulos ---
    // Procesa los subtítulos usando el módulo subtitleProcessor
    if (subtitleStreams.length > 0) {
      const processedSubtitles = await processSubtitles(
        filePath,
        subtitleStreams,
        localDir,
        fileName
      );
      availableSubtitles.push(...processedSubtitles);
    } else {
      console.warn('No se encontraron pistas de subtítulos para extraer.');
    }

    const dataReturn = {
      availableResolutions,
      availableSubtitles,
      duration,
    };
    return dataReturn;
  } catch (error) {
    throw new Error('Error en el proceso de transcodificación: '+ error);
  } finally {
    deleteTempDir(localDir);
  }
};

module.exports = { transcode };
