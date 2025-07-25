// app/utils/imageDownloader.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

/**
 * Descargar imagen desde URL y guardar como archivo temporal con sistema de reintentos
 * @param {string} imageUrl - URL de la imagen a descargar
 * @param {string} tempDir - Directorio temporal (default: /tmp o directorio temp del sistema)
 * @param {number} maxRetries - Número máximo de reintentos (default: 3)
 * @param {number} baseDelay - Delay base en ms para exponential backoff (default: 1000)
 * @returns {Promise<{success: boolean, filePath?: string, error?: string}>} - Resultado de la descarga
 */
async function downloadImageFromUrl(imageUrl, tempDir = null, maxRetries = 3, baseDelay = 1000) {
  if (!tempDir) {
    tempDir = path.join(__dirname, '..', 'temp_downloads');
  }

  // Crear directorio temporal si no existe
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Función auxiliar para realizar un intento de descarga
  async function attemptDownload(attempt = 1) {
    try {
      console.log(`🌐 Descargando imagen desde URL (intento ${attempt}/${maxRetries + 1}):`, imageUrl);

      // Realizar solicitud HTTP para descargar la imagen
      const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'stream',
        timeout: 30000, // 30 segundos de timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StreamingApp/1.0)',
          'Accept': 'image/*'
        }
      });

      // Verificar que la respuesta sea exitosa
      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Generar nombre único para el archivo temporal
      const urlHash = crypto.createHash('md5').update(imageUrl).digest('hex');
      const timestamp = Date.now();
      
      // Determinar extensión basada en Content-Type
      const contentType = response.headers['content-type'] || '';
      let extension = 'jpg'; // default
      
      if (contentType.includes('png')) {
        extension = 'png';
      } else if (contentType.includes('webp')) {
        extension = 'webp';
      } else if (contentType.includes('gif')) {
        extension = 'gif';
      } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
        extension = 'jpg';
      }

      const fileName = `tmdb_image_${urlHash}_${timestamp}.${extension}`;
      const filePath = path.join(tempDir, fileName);

      // Crear stream de escritura
      const writer = fs.createWriteStream(filePath);

      // Configurar manejo de errores del stream
      return new Promise((resolve, reject) => {
        writer.on('error', (error) => {
          console.error('❌ Error escribiendo archivo:', error);
          reject(new Error(`Error escribiendo archivo: ${error.message}`));
        });

        writer.on('finish', () => {
          // Verificar que el archivo se creó correctamente
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            
            if (stats.size === 0) {
              reject(new Error('El archivo descargado está vacío'));
            } else {
              console.log('✅ Imagen descargada exitosamente:', {
                file: fileName,
                size: `${Math.round(stats.size / 1024)}KB`,
                path: filePath,
                attempt: attempt
              });
              resolve(filePath);
            }
          } else {
            reject(new Error('El archivo no se creó correctamente'));
          }
        });

        // Pipe del response al archivo
        response.data.pipe(writer);
      });

    } catch (error) {
      console.error(`❌ Error en intento ${attempt}:`, error.message);
      
      // Determinar si el error es recuperable
      const isRecoverableError = 
        error.code === 'EAI_AGAIN' ||  // DNS temporal
        error.code === 'ENOTFOUND' ||  // DNS issue
        error.code === 'ETIMEDOUT' ||  // Timeout
        error.code === 'ECONNABORTED' || // Connection aborted
        error.code === 'ECONNRESET' ||   // Connection reset
        error.response?.status >= 500;    // Server errors
      
      // Si no es recuperable o es el último intento, lanzar error
      if (!isRecoverableError || attempt > maxRetries) {
        let userMessage = '';
        
        if (error.code === 'EAI_AGAIN' || error.code === 'ENOTFOUND') {
          userMessage = 'No se pudo conectar con el servidor de imágenes. Verifica tu conexión a internet.';
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
          userMessage = 'La descarga de la imagen tomó demasiado tiempo. Intenta nuevamente.';
        } else if (error.response?.status === 404) {
          userMessage = 'La imagen no está disponible en el servidor.';
        } else if (error.response?.status === 403) {
          userMessage = 'No tienes permisos para acceder a esta imagen.';
        } else {
          userMessage = 'Error al descargar la imagen. Intenta nuevamente más tarde.';
        }
        
        throw new Error(userMessage);
      }
      
      // Calcular delay con exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`);
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Intentar nuevamente
      return attemptDownload(attempt + 1);
    }
  }

  // Realizar el primer intento
  try {
    const filePath = await attemptDownload(1);
    return {
      success: true,
      filePath: filePath
    };
  } catch (error) {
    console.error('❌ Error final descargando imagen después de todos los reintentos:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Limpiar archivo temporal
 * @param {string} filePath - Ruta del archivo a eliminar
 */
function cleanupTempFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Archivo temporal eliminado:', filePath);
    }
  } catch (error) {
    console.error('⚠️ Error eliminando archivo temporal:', error);
  }
}

/**
 * Validar si una URL es válida para descarga
 * @param {string} url - URL a validar
 * @returns {boolean} - True si es válida
 */
function isValidImageUrl(url) {
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    
    // Solo HTTP/HTTPS
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Verificar que sea de un dominio confiable (opcional)
    const allowedDomains = [
      'image.tmdb.org',
      'images.justwatch.com',
      'cdn.pixabay.com',
      // Agregar más dominios confiables según necesidad
    ];
    
    const isAllowedDomain = allowedDomains.some(domain => 
      urlObj.hostname.includes(domain)
    );
    
    if (!isAllowedDomain) {
      console.warn('⚠️ Dominio no permitido para descarga:', urlObj.hostname);
      return false;
    }
    
    return true;
    
  } catch {
    return false;
  }
}

module.exports = {
  downloadImageFromUrl,
  cleanupTempFile,
  isValidImageUrl
};