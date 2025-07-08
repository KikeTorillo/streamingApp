// utils/subtitleProcessor.js
const ffmpeg = require('fluent-ffmpeg');
const { uploadFileIfNotExists } = require('./aws');
const { config } = require('../config/config');

/**
 * Extrae una pista de subtítulos en formato WebVTT y la guarda en un archivo.
 * @param {string} filePath - Ruta del video.
 * @param {number} subtitleStreamIndex - Índice relativo del stream de subtítulos (0, 1, 2, etc.).
 * @param {string} outputPath - Ruta donde se guardará el archivo de subtítulos.
 * @returns {Promise<void>}
 */
const extractSubtitle = (filePath, subtitleStreamIndex, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(outputPath)
      .outputOptions([
        '-map', `0:s:${subtitleStreamIndex}`, 
        '-c:s', 'webvtt',
        '-avoid_negative_ts', 'disabled'
      ])
      .on('start', (commandLine) => {
        console.log(`Extrayendo subtítulos (stream s:${subtitleStreamIndex}) con comando: ${commandLine}`);
      })
      .on('end', () => {
        console.log(`Subtítulos (stream s:${subtitleStreamIndex}) extraídos correctamente: ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error al extraer subtítulos (stream s:${subtitleStreamIndex}): ${err.message}`);
        reject(err);
      })
      .run();
  });
};

/**
 * Procesa todas las pistas de subtítulos: extrae cada pista, genera un nombre de archivo basado en el idioma y
 * sube el archivo a MinIO.
 * @param {string} filePath - Ruta del video.
 * @param {Array} subtitleStreams - Array de pistas de subtítulos (obtenidas de ffprobe).
 * @param {string} localDir - Directorio temporal donde se guardarán los archivos.
 * @param {string} fileName - Identificador único del video (por ejemplo, su hash).
 * @returns {Promise<Array>} - Retorna un arreglo con los nombres de los subtítulos procesados (sin extensión).
 */
const processSubtitles = async (filePath, subtitleStreams, localDir, fileName) => {
  const availableSubtitles = [];
  let normalLangCount = {};
  let forcedLangCount = {};

  for (let i = 0; i < subtitleStreams.length; i++) {
    const subtitle = subtitleStreams[i];
    // Determina el idioma o asigna 'und' (indefinido) si no está especificado.
    const language = (subtitle.tags && subtitle.tags.language) || 'und';
    const isForced = subtitle.disposition && subtitle.disposition.forced === 1;
    
    console.log(`Procesando subtítulo ${i}: idioma=${language}, forced=${isForced}, index=${subtitle.index}`);
    
    let fileNameSubtitle;
    if (isForced) {
      forcedLangCount[language] = (forcedLangCount[language] || 0) + 1;
      fileNameSubtitle =
        forcedLangCount[language] > 1
          ? `forced-${language}_${forcedLangCount[language]}.vtt`
          : `forced-${language}.vtt`;
      availableSubtitles.push(fileNameSubtitle.replace('.vtt', ''));
    } else {
      normalLangCount[language] = (normalLangCount[language] || 0) + 1;
      fileNameSubtitle =
        normalLangCount[language] > 1
          ? `${language}_${normalLangCount[language]}.vtt`
          : `${language}.vtt`;
      availableSubtitles.push(fileNameSubtitle.replace('.vtt', ''));
    }

    const outputPath = `${localDir}/${fileNameSubtitle}`;
    // Extrae la pista de subtítulos usando el índice relativo (i)
    await extractSubtitle(filePath, i, outputPath);
    // Sube el archivo a MinIO usando la ruta de subtítulos configurada
    const remoteSubtitlePath = `${config.subsDir}/${fileName}/${fileNameSubtitle}`;
    await uploadFileIfNotExists(outputPath, remoteSubtitlePath);
  }

  return availableSubtitles;
};

module.exports = {
  processSubtitles
};
