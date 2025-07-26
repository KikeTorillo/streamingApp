const sharp = require('sharp');
const { imageconfig } = require('../config/configMediaQualities');
const { config } = require('../../../config/config');
const { uploadFileIfNotExists } = require('../../storage/aws');
const { createTempDir, deleteTempDir } = require('../../storage/fileHelpers');

/**
 * Optimiza una imagen de portada manteniendo dimensiones originales.
 * Solo convierte a JPEG para optimización web, SIN redimensionar.
 * @param {string} inputPath - Ruta de la imagen original.
 * @param {string} outputPath - Ruta donde se guardará la imagen optimizada.
 */
const processCoverImage = async (inputPath, outputPath) => {
  const { format, quality } = imageconfig;

  try {
    // ✅ Solo convertir a JPEG con calidad optimizada, mantener dimensiones originales
    await sharp(inputPath)
      .jpeg({ quality: quality })
      .toFormat(format)
      .toFile(outputPath);
    console.log(`Imagen optimizada a JPEG (dimensiones originales): ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error procesando la imagen:', error);
    throw error;
  }
};

// Función auxiliar específica para películas
const processAndUploadCover = async (coverImagePath, fileHash) => {
  const fileName = fileHash;
  const localDir = `${config.tempProcessingDir}/${fileName}`;
  try {
    await createTempDir(localDir);
    const processedCoverPath = `${localDir}/cover.jpg`;

    // Procesa la imagen (por ejemplo, redimensionarla o formatearla)
    await processCoverImage(coverImagePath, processedCoverPath);

    const remoteCoverPath = `${config.coversDir}/${fileName}/cover.jpg`;
    await uploadFileIfNotExists(processedCoverPath, remoteCoverPath);

    return remoteCoverPath;
  } catch (error) {
    throw new Error('Error en el procesamiento de la portada: ' + error);
  } finally {
    await deleteTempDir(localDir);
  }
};

module.exports = {
  processAndUploadCover
};
