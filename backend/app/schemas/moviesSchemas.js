// app/schemas/moviesSchemas.js
const Joi = require('joi');

/**
 * Definición de tipos de datos reutilizables para validación.
 */
const id = Joi.number().integer().positive();
const fileHash = Joi.string().alphanum().length(64); // Hash SHA256 de 64 caracteres
const title = Joi.string();
const categoryId = Joi.number().integer().positive();
const releaseYear = Joi.number()
  .integer()
  .min(1900)
  .max(new Date().getFullYear());
const description = Joi.string().allow('');
const video = Joi.string();
const coverImage = Joi.string();
const coverImageUrl = Joi.string().uri(); // Nueva validación para URLs
const user = Joi.object();
const ip = Joi.string();

// Esquema para crear películas - ACTUALIZADO para manejar Files y URLs
const createMovieSchema = Joi.object({
  // Nombre del contenido (película, serie o episodio)
  title: title.required().messages({
    'any.required': 'El nombre de la pelicula es obligatorio',
    'string.empty': 'El nombre no puede estar vacío',
  }),
  
  // ID de la categoría
  categoryId: categoryId.required().messages({
    'any.required': 'La categoría es obligatoria',
    'number.empty': 'La categoria no puede estar vacia',
    'number.base': 'La categoría debe ser un ID numérico válido',
  }),

  // Año de lanzamiento
  releaseYear: releaseYear.required().messages({
    'any.required': 'El año de lanzamiento es obligatorio',
    'number.base': 'El año debe ser un número válido',
    'number.min': 'El año no puede ser menor a 1900',
    'number.max': `El año no puede ser mayor a ${new Date().getFullYear()}`,
  }),

  description: description.required().messages({
    'any.required': 'La descripcion de la pelicula es obligatoria',
    'string.empty': 'La descripcion de la pelicula es obligatoria',
  }),

  video: video.required().messages({
    'any.required': 'La ruta de la pelicula es obligatoria',
    'string.empty': 'La ruta de la pelicula es obligatoria',
  }),

  // CAMBIO IMPORTANTE: Ahora coverImage es opcional porque puede venir coverImageUrl
  coverImage: coverImage.optional().messages({
    'string.empty': 'La ruta de la portada no puede estar vacía',
  }),

  // NUEVO: Campo para URLs de imágenes (TMDB, etc.)
  coverImageUrl: coverImageUrl.optional().messages({
    'string.uri': 'La URL de la imagen debe ser válida',
    'string.empty': 'La URL de la imagen no puede estar vacía',
  }),

  // ✅ NUEVO: Campo interno para marcar archivos temporales
  isTemporaryCoverImage: Joi.boolean().optional(),

  user: user.required(),
  ip: ip.required(),
})
// VALIDACIÓN PERSONALIZADA: Al menos uno de los dos campos debe estar presente
.custom((value, helpers) => {
  const { coverImage, coverImageUrl } = value;
  
  // Si no hay archivo subido Y no hay URL, es error
  if (!coverImage && !coverImageUrl) {
    return helpers.error('custom.coverImageRequired');
  }
  
  // Si hay ambos, priorizar el archivo subido
  if (coverImage && coverImageUrl) {
    // Eliminar coverImageUrl si hay archivo
    delete value.coverImageUrl;
  }
  
  return value;
})
.messages({
  'custom.coverImageRequired': 'Se requiere una imagen de portada (archivo o URL)',
});

// Esquema para búsqueda por ID
const getMovieSchema = Joi.object({
  id: id.required().messages({
    'any.required': 'El id es obligatorio',
    'number.empty': 'El id no puede estar vacio',
    'number.base': 'El id debe ser un número',
    'number.positive': 'El id debe ser un número positivo',
  }),
});

// Esquema para búsqueda por hash
const getMovieByHashSchema = Joi.object({
  hash: fileHash.required().messages({
    'any.required': 'El hash es obligatorio',
    'string.empty': 'El hash no puede estar vacío',
    'string.alphanum': 'El hash debe contener solo caracteres alfanuméricos',
    'string.length': 'El hash debe tener exactamente 64 caracteres',
  }),
});

// Esquema para búsqueda por título
const getMovieByTitleSchema = Joi.object({
  title: title.required().messages({
    'any.required': 'El titulo es obligatorio',
    'string.empty': 'El titulo no puede estar vacío',
  }),
});

// Esquema para búsqueda por rango de años
const searchMoviesByYearRangeSchema = Joi.object({
  from: releaseYear.required().messages({
    'any.required': 'El año inicial es obligatorio',
    'number.base': 'El año inicial debe ser un número válido',
    'number.min': 'El año inicial no puede ser menor a 1900',
    'number.max': `El año inicial no puede ser mayor a ${new Date().getFullYear()}`,
  }),
  to: releaseYear.required().messages({
    'any.required': 'El año final es obligatorio',
    'number.base': 'El año final debe ser un número válido',
    'number.min': 'El año final no puede ser menor a 1900',
    'number.max': `El año final no puede ser mayor a ${new Date().getFullYear()}`,
  }),
})
// VALIDACIÓN PERSONALIZADA: from debe ser menor o igual a to
.custom((value, helpers) => {
  const { from, to } = value;
  
  if (from > to) {
    return helpers.error('custom.invalidYearRange');
  }
  
  return value;
})
.messages({
  'custom.invalidYearRange': 'El año inicial no puede ser mayor al año final',
});

// Esquema para actualizar una película
const updateMovieSchema = Joi.object({
  title: title.optional().messages({
    'string.empty': 'El nombre no puede estar vacío',
  }),
  
  categoryId: categoryId.optional().messages({
    'number.base': 'La categoría debe ser un ID numérico válido',
  }),

  releaseYear: releaseYear.optional().messages({
    'number.base': 'El año debe ser un número válido',
    'number.min': 'El año no puede ser menor a 1900',
    'number.max': `El año no puede ser mayor a ${new Date().getFullYear()}`,
  }),

  description: description.optional().messages({
    'string.empty': 'La descripcion no puede estar vacía',
  }),

  coverImage: coverImage.optional().messages({
    'string.empty': 'La ruta de la portada no puede estar vacía',
  }),

  coverImageUrl: coverImageUrl.optional().messages({
    'string.uri': 'La URL de la imagen debe ser válida',
  }),

  // ✅ NUEVO: Campo interno para marcar archivos temporales
  isTemporaryCoverImage: Joi.boolean().optional(),

  user: user.required(),
  ip: ip.required(),
});

module.exports = {
  createMovieSchema,
  getMovieSchema,
  getMovieByHashSchema,
  getMovieByTitleSchema,
  searchMoviesByYearRangeSchema,
  updateMovieSchema,
};