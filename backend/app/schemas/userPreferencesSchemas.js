// userPreferencesSchemas.js
// Esquemas de validación para preferencias de usuario del video player
const Joi = require('joi');

/**
 * Definición de tipos de datos reutilizables para validación de preferencias.
 */
const userId = Joi.number().positive(); // ID del usuario
const volume = Joi.number().min(0).max(1); // Volumen entre 0.0 y 1.0
const playbackRate = Joi.number().valid(0.5, 1.0, 1.25, 1.5, 2.0); // Velocidades permitidas
const autoplay = Joi.boolean(); // Reproducción automática
const muted = Joi.boolean(); // Silenciado
const defaultQuality = Joi.string().valid('auto', '480p', '720p', '1080p', '4k'); // Calidades disponibles
const preferredLanguage = Joi.string().valid('es', 'en'); // Idiomas soportados
const subtitlesEnabled = Joi.boolean(); // Subtítulos habilitados
const forcedSubtitlesOnly = Joi.boolean(); // Solo subtítulos forzados
const autoFullscreen = Joi.boolean(); // Pantalla completa automática
const pictureInPictureEnabled = Joi.boolean(); // Picture-in-picture habilitado
const hotkeyEnabled = Joi.boolean(); // Teclas rápidas habilitadas

// Esquema para el progreso de reproducción individual
const watchProgressItem = Joi.object({
  position: Joi.number().min(0).required(), // Posición en segundos
  type: Joi.string().valid('movie', 'series').required(), // Tipo de contenido
  currentEpisode: Joi.number().positive().optional(), // Episodio actual (solo para series)
  timestamp: Joi.number().positive().required(), // Timestamp de cuando se guardó
  completed: Joi.boolean().default(false) // Si se completó la reproducción
});

// Esquema para todo el objeto de progreso de reproducción
const watchProgress = Joi.object().pattern(
  Joi.string(), // contentId (string o número como string)
  watchProgressItem
);

/**
 * Esquema para obtener preferencias de usuario por ID.
 * Valida que el userId sea proporcionado y sea un número válido.
 */
const getUserPreferencesSchema = Joi.object({
  userId: userId.required().messages({
    'any.required': 'El userId es obligatorio',
    'number.base': 'El userId debe ser un número',
    'number.positive': 'El userId debe ser un número positivo',
  }),
});

/**
 * Esquema para obtener progreso de reproducción específico.
 * Valida que tanto userId como contentId sean proporcionados y válidos.
 */
const getWatchProgressSchema = Joi.object({
  userId: userId.required().messages({
    'any.required': 'El userId es obligatorio',
    'number.base': 'El userId debe ser un número',
    'number.positive': 'El userId debe ser un número positivo',
  }),
  contentId: Joi.string().required().messages({
    'any.required': 'El contentId es obligatorio',
    'string.base': 'El contentId debe ser un string',
  }),
});

/**
 * Esquema para crear preferencias de usuario.
 * Valida los datos necesarios para crear preferencias iniciales.
 */
const createUserPreferencesSchema = Joi.object({
  userId: userId.required().messages({
    'any.required': 'El userId es obligatorio',
    'number.base': 'El userId debe ser un número',
    'number.positive': 'El userId debe ser un número positivo',
  }),
  volume: volume.default(1.0).messages({
    'number.base': 'El volumen debe ser un número',
    'number.min': 'El volumen debe ser mayor o igual a 0',
    'number.max': 'El volumen debe ser menor o igual a 1',
  }),
  playbackRate: playbackRate.default(1.0).messages({
    'any.only': 'La velocidad de reproducción debe ser una de: 0.5, 1.0, 1.25, 1.5, 2.0',
  }),
  autoplay: autoplay.default(false),
  muted: muted.default(false),
  defaultQuality: defaultQuality.default('auto').messages({
    'any.only': 'La calidad por defecto debe ser una de: auto, 480p, 720p, 1080p, 4k',
  }),
  preferredLanguage: preferredLanguage.default('es').messages({
    'any.only': 'El idioma preferido debe ser: es o en',
  }),
  subtitlesEnabled: subtitlesEnabled.default(true),
  forcedSubtitlesOnly: forcedSubtitlesOnly.default(false),
  autoFullscreen: autoFullscreen.default(false),
  pictureInPictureEnabled: pictureInPictureEnabled.default(true),
  hotkeyEnabled: hotkeyEnabled.default(true),
  watchProgress: watchProgress.default({})
});

/**
 * Esquema para actualizar preferencias de usuario.
 * Todos los campos son opcionales para permitir actualizaciones parciales.
 */
const updateUserPreferencesSchema = Joi.object({
  volume: volume.optional().messages({
    'number.base': 'El volumen debe ser un número',
    'number.min': 'El volumen debe ser mayor o igual a 0',
    'number.max': 'El volumen debe ser menor o igual a 1',
  }),
  playbackRate: playbackRate.optional().messages({
    'any.only': 'La velocidad de reproducción debe ser una de: 0.5, 1.0, 1.25, 1.5, 2.0',
  }),
  autoplay: autoplay.optional(),
  muted: muted.optional(),
  defaultQuality: defaultQuality.optional().messages({
    'any.only': 'La calidad por defecto debe ser una de: auto, 480p, 720p, 1080p, 4k',
  }),
  preferredLanguage: preferredLanguage.optional().messages({
    'any.only': 'El idioma preferido debe ser: es o en',
  }),
  subtitlesEnabled: subtitlesEnabled.optional(),
  forcedSubtitlesOnly: forcedSubtitlesOnly.optional(),
  autoFullscreen: autoFullscreen.optional(),
  pictureInPictureEnabled: pictureInPictureEnabled.optional(),
  hotkeyEnabled: hotkeyEnabled.optional(),
  watchProgress: watchProgress.optional()
});

/**
 * Esquema para actualizar progreso de reproducción específico.
 * Para uso en endpoints dedicados al progreso de watch.
 */
const updateWatchProgressSchema = Joi.object({
  contentId: Joi.string().required().messages({
    'any.required': 'El contentId es obligatorio',
    'string.base': 'El contentId debe ser un string',
  }),
  position: Joi.number().min(0).required().messages({
    'any.required': 'La posición es obligatoria',
    'number.base': 'La posición debe ser un número',
    'number.min': 'La posición debe ser mayor o igual a 0',
  }),
  type: Joi.string().valid('movie', 'series').required().messages({
    'any.required': 'El tipo es obligatorio',
    'any.only': 'El tipo debe ser: movie o series',
  }),
  currentEpisode: Joi.number().positive().optional().messages({
    'number.base': 'El episodio actual debe ser un número',
    'number.positive': 'El episodio actual debe ser un número positivo',
  }),
  completed: Joi.boolean().default(false)
});

// Exportación de los esquemas para su uso en validaciones
module.exports = {
  getUserPreferencesSchema,
  getWatchProgressSchema,
  createUserPreferencesSchema,
  updateUserPreferencesSchema,
  updateWatchProgressSchema
};