/**
 * Middleware para completar información del usuario y procesar archivos
 * 
 * Centraliza la lógica común de:
 * - Obtención de IP del cliente
 * - Procesamiento de archivos de video
 * - Procesamiento de imágenes de portada (archivo o URL)
 * - Configuración de datos de usuario para auditoría
 * 
 * Migrado desde: moviesRoutes.js, seriesRoutes.js, episodesRouter.js
 */

/**
 * Middleware principal para completar información del usuario y archivos
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express  
 * @param {Function} next - Next middleware function
 */
async function completeInfoUser(req, res, next) {
  try {
    console.log('📥 Iniciando procesamiento de upload...');
    
    // ==========================================
    // PROCESAMIENTO DE IP DEL CLIENTE
    // ==========================================
    let clientIp = req.socket.remoteAddress || '';
    
    // Si X-Forwarded-For contiene múltiples IPs, tomar la primera
    if (Array.isArray(clientIp)) {
      clientIp = clientIp[0];
    } else if (typeof clientIp === 'string') {
      clientIp = clientIp.split(',')[0].trim();
    }
    
    // Normalizar la IP (eliminar ::ffff: para IPv6)
    clientIp = clientIp.replace(/^::ffff:/, '');
    
    // ==========================================
    // CONFIGURACIÓN DE DATOS DE USUARIO
    // ==========================================
    const user = { id: 'anonymous' };
    const ip = clientIp || 'unknown';
    const data = req.body;
    
    data.user = user;
    data.ip = ip;
    
    // ==========================================
    // PROCESAMIENTO DE ARCHIVOS DE VIDEO
    // ==========================================
    if (req.files && req.files['video']) {
      data.video = req.files['video'][0].path;
      
      // Para movies: mostrar estadísticas detalladas del archivo
      try {
        const videoStats = require('fs').statSync(data.video);
        console.log('📹 Video archivo recibido:', {
          path: data.video,
          size: `${(videoStats.size / 1024 / 1024 / 1024).toFixed(2)} GB`,
          sizeBytes: videoStats.size
        });
      } catch (statsError) {
        // Si no se pueden obtener stats, solo mostrar path básico
        console.log('📹 Video archivo recibido:', data.video);
      }
    }
    
    // ==========================================
    // PROCESAMIENTO DE IMÁGENES DE PORTADA
    // ==========================================
    if (req.files && req.files['coverImage']) {
      // PRIORIDAD 1: Archivo subido
      data.coverImage = req.files['coverImage'][0].path;
      console.log('🖼️ Imagen archivo recibida:', data.coverImage);
      
      // Si también viene coverImageUrl, eliminarla (priorizar archivo)
      if (data.coverImageUrl) {
        console.log('⚠️ Se recibió tanto archivo como URL. Priorizando archivo subido.');
        delete data.coverImageUrl;
      }
      
    } else if (data.coverImageUrl) {
      // PRIORIDAD 2: URL externa (descargar como archivo temporal)
      console.log('🌐 URL de imagen recibida, descargando...:', data.coverImageUrl);
      
      try {
        const { downloadImageFromUrl, isValidImageUrl } = require('../utils/media/image/imageDownloader');
        
        // Validar URL
        if (!isValidImageUrl(data.coverImageUrl)) {
          return res.status(400).json({
            success: false,
            message: 'URL de imagen no válida o dominio no permitido',
            error: 'INVALID_IMAGE_URL'
          });
        }
        
        // Descargar imagen con sistema de reintentos
        console.log('🔄 Iniciando descarga de imagen con reintentos...');
        const downloadResult = await downloadImageFromUrl(data.coverImageUrl);
        
        if (!downloadResult.success) {
          // Error definitivo después de todos los reintentos
          console.error('💥 Error definitivo descargando imagen:', downloadResult.error);
          
          return res.status(500).json({
            success: false,
            message: `No se pudo descargar la imagen: ${downloadResult.error}`,
            error: 'IMAGE_DOWNLOAD_FAILED',
            details: {
              url: data.coverImageUrl,
              reason: downloadResult.error
            }
          });
        }
        
        // Éxito en la descarga
        data.coverImage = downloadResult.filePath;
        data.isTemporaryCoverImage = true; // Flag para limpieza posterior
        
        console.log('✅ Imagen descargada exitosamente con reintentos:', downloadResult.filePath);
        
        // Limpiar coverImageUrl ya que ahora tenemos el archivo
        delete data.coverImageUrl;
        
      } catch (error) {
        console.error('💥 Error inesperado en descarga de imagen:', error);
        return res.status(500).json({
          success: false,
          message: 'Error inesperado al procesar la descarga de imagen',
          error: 'UNEXPECTED_DOWNLOAD_ERROR',
          details: error.message
        });
      }
    } else {
      // Si no hay ninguno de los dos, será manejado por la validación
      console.log('⚠️ No se recibió imagen (ni archivo ni URL)');
    }
    
    // ==========================================
    // LOG DE DATOS PROCESADOS
    // ==========================================
    console.log('📦 Datos procesados en middleware:', {
      title: data.title,
      hasVideo: !!data.video,
      hasCoverImage: !!data.coverImage,
      isTemporary: !!data.isTemporaryCoverImage,
      userIp: ip
    });
    
    next();
    
  } catch (error) {
    console.error('❌ Error en completeInfoUser middleware:', error);
    next(error);
  }
}

module.exports = {
  completeInfoUser
};