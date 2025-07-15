// src/components/molecules/ImageCropField/ImageCropField.stories.jsx
import React, { useState } from 'react';
import { ImageCropField } from './ImageCropField';
import './ImageCropField.css';

export default {
  title: 'Components/Molecules/ImageCropField',
  component: ImageCropField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# ImageCropField - Molécula Especializada para Recorte de Imágenes

**ImageCropField** es una molécula avanzada que combina FileInput + ImagePreview + ImageCropper usando el hook useImageCropper.

## 🏗️ Arquitectura Atomic Design

\`\`\`
ImageCropField (Molécula) 🧬
├── Label (elemento)
├── Preview Container
│   ├── Image Preview (elemento)
│   └── Action Buttons (Button átomos) ⚛️
├── FileInput (Átomo) ⚛️
├── ImageCropperModal (Molécula) 🧬
└── Footer
    └── Messages (helper/error/info con live regions)
\`\`\`

## 🎯 Características principales

- **Hook Integration**: Usa useImageCropper para encapsular lógica compleja
- **Preview automático**: Muestra vista previa de imagen seleccionada
- **Crop on demand**: Abre modal de recorte automáticamente
- **Estados semánticos**: Default, Success, Warning, Danger
- **Tamaños responsive**: XS, SM, MD, LG, XL
- **Accesibilidad completa**: ARIA, keyboard navigation, screen readers
- **Mobile-first**: Optimizado para touch y diferentes resoluciones
- **Memory management**: Previene memory leaks con URLs de blob

## 🎨 Integración con DynamicForm

Diseñado para integración perfecta con DynamicForm:

\`\`\`jsx
<ImageCropField
  name="coverImage"
  value={formData.coverImage}
  onChange={(file) => updateField('coverImage', file)}
  aspect={16/9}
  showPreview={true}
/>
\`\`\`

## 🔧 Props especializadas

- **aspect**: Relación de aspecto del recorte (16/9, 1/1, etc.)
- **showPreview**: Mostrar/ocultar vista previa
- **acceptedFormats**: Formatos de imagen permitidos
- **previewDimensions**: Tamaño del preview customizable
- **cropButtonText/changeButtonText**: Textos personalizables

## 📱 Responsive Design

- **Desktop**: Layout horizontal con preview a la izquierda
- **Tablet**: Layout vertical compacto
- **Mobile**: Layout optimizado para touch, botones apilados

## 🎪 Casos de uso

Perfecto para:
- Formularios de creación de películas/series
- Perfiles de usuario con avatares
- Galerías de imágenes con recorte uniforme
- Upload de imágenes con preview inmediato
        `
      }
    }
  },
  argTypes: {
    // Props de control de formulario
    name: {
      name: 'Nombre',
      description: 'Nombre del campo para formularios',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    value: {
      name: 'Archivo actual',
      description: 'Archivo File actual (controlado)',
      control: false,
      table: {
        type: { summary: 'File|null' }
      }
    },
    onChange: {
      name: 'Handler de cambio',
      description: 'Función que recibe el archivo cuando cambia',
      control: false,
      table: {
        type: { summary: '(file: File|null) => void' }
      }
    },
    
    // Props de estructura
    label: {
      name: 'Etiqueta',
      description: 'Etiqueta descriptiva del campo',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    helperText: {
      name: 'Texto de ayuda',
      description: 'Mensaje informativo debajo del campo',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    errorText: {
      name: 'Mensaje de error',
      description: 'Mensaje de error (sobrescribe helperText)',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    required: {
      name: 'Requerido',
      description: 'Marca el campo como obligatorio',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita el campo',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    
    // Props específicas de ImageCropField
    aspect: {
      name: 'Relación de aspecto',
      description: 'Relación de aspecto para el recorte',
      control: 'select',
      options: [16/9, 4/3, 1/1, 3/2, 2/1],
      mapping: {
        '16:9 (Video)': 16/9,
        '4:3 (Clásico)': 4/3,
        '1:1 (Cuadrado)': 1/1,
        '3:2 (Foto)': 3/2,
        '2:1 (Banner)': 2/1
      },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '16/9' }
      }
    },
    showPreview: {
      name: 'Mostrar preview',
      description: 'Mostrar vista previa de imagen',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    acceptedFormats: {
      name: 'Formatos aceptados',
      description: 'Array de formatos de imagen permitidos',
      control: 'object',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: "['jpg','png','webp']" }
      }
    },
    
    // Props heredadas
    size: {
      name: 'Tamaño',
      description: 'Tamaño del componente',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante visual semántica',
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'default'" }
      }
    }
  }
};

// Template base con estado
const Template = (args) => {
  const [value, setValue] = useState(null);
  
  return (
    <ImageCropField 
      {...args} 
      value={value}
      onChange={(file) => {
        console.log('📁 Archivo recortado:', file?.name || 'null');
        setValue(file);
      }}
    />
  );
};

// ===== STORIES PRINCIPALES =====

export const Playground = Template.bind({});
Playground.args = {
  label: 'Imagen de portada',
  helperText: 'Selecciona una imagen para recortar',
  aspect: 16/9,
  showPreview: true,
  size: 'md',
  variant: 'default'
};

// ===== ASPECTOS Y PROPORCIONES =====

export const AspectRatios = () => {
  const [values, setValues] = useState({
    video: null,
    square: null,
    photo: null,
    banner: null
  });
  
  const handleChange = (key) => (file) => {
    setValues(prev => ({ ...prev, [key]: file }));
  };
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 'var(--space-xl)',
      maxWidth: '1200px'
    }}>
      <ImageCropField
        label="Formato Video (16:9)"
        aspect={16/9}
        value={values.video}
        onChange={handleChange('video')}
        helperText="Ideal para videos y pantallas"
        showPreview={true}
        previewDimensions={{ width: 320, height: 180 }}
      />
      
      <ImageCropField
        label="Formato Cuadrado (1:1)"
        aspect={1/1}
        value={values.square}
        onChange={handleChange('square')}
        helperText="Perfecto para avatares y logos"
        showPreview={true}
        previewDimensions={{ width: 200, height: 200 }}
      />
      
      <ImageCropField
        label="Formato Foto (3:2)"
        aspect={3/2}
        value={values.photo}
        onChange={handleChange('photo')}
        helperText="Proporción clásica de fotografía"
        showPreview={true}
        previewDimensions={{ width: 300, height: 200 }}
      />
      
      <ImageCropField
        label="Formato Banner (2:1)"
        aspect={2/1}
        value={values.banner}
        onChange={handleChange('banner')}
        helperText="Ideal para headers y banners"
        showPreview={true}
        previewDimensions={{ width: 300, height: 150 }}
      />
    </div>
  );
};

// ===== ESTADOS Y VARIANTES =====

export const StatesAndVariants = () => {
  const [values, setValues] = useState({
    normal: null,
    success: null,
    warning: null,
    error: null,
    required: null
  });
  
  const handleChange = (key) => (file) => {
    setValues(prev => ({ ...prev, [key]: file }));
  };
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 'var(--space-lg)',
      maxWidth: '1000px'
    }}>
      <ImageCropField
        label="Estado normal"
        value={values.normal}
        onChange={handleChange('normal')}
        helperText="Campo en estado por defecto"
        showPreview={true}
      />
      
      <ImageCropField
        label="Campo requerido"
        value={values.required}
        onChange={handleChange('required')}
        helperText="Este campo es obligatorio"
        required
        showPreview={true}
      />
      
      <ImageCropField
        label="Estado de éxito"
        value={values.success}
        onChange={handleChange('success')}
        helperText="Imagen validada correctamente"
        variant="success"
        showPreview={true}
      />
      
      <ImageCropField
        label="Estado de advertencia"
        value={values.warning}
        onChange={handleChange('warning')}
        helperText="Revisa la calidad de la imagen"
        variant="warning"
        showPreview={true}
      />
      
      <ImageCropField
        label="Estado de error"
        value={values.error}
        onChange={handleChange('error')}
        errorText="Formato de imagen no válido"
        variant="danger"
        showPreview={true}
      />
      
      <ImageCropField
        label="Campo deshabilitado"
        helperText="No se puede modificar"
        disabled
        showPreview={true}
      />
    </div>
  );
};

// ===== TAMAÑOS =====

export const Sizes = () => {
  const [values, setValues] = useState({
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null
  });
  
  const handleChange = (key) => (file) => {
    setValues(prev => ({ ...prev, [key]: file }));
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--space-lg)',
      maxWidth: '600px'
    }}>
      <ImageCropField
        label="Extra pequeño (XS)"
        size="xs"
        value={values.xs}
        onChange={handleChange('xs')}
        helperText="Tamaño mínimo"
        previewDimensions={{ width: 150, height: 100 }}
        showPreview={true}
      />
      
      <ImageCropField
        label="Pequeño (SM)"
        size="sm"
        value={values.sm}
        onChange={handleChange('sm')}
        helperText="Tamaño pequeño"
        previewDimensions={{ width: 200, height: 133 }}
        showPreview={true}
      />
      
      <ImageCropField
        label="Mediano (MD)"
        size="md"
        value={values.md}
        onChange={handleChange('md')}
        helperText="Tamaño por defecto"
        previewDimensions={{ width: 250, height: 167 }}
        showPreview={true}
      />
      
      <ImageCropField
        label="Grande (LG)"
        size="lg"
        value={values.lg}
        onChange={handleChange('lg')}
        helperText="Tamaño grande"
        previewDimensions={{ width: 300, height: 200 }}
        showPreview={true}
      />
      
      <ImageCropField
        label="Extra grande (XL)"
        size="xl"
        value={values.xl}
        onChange={handleChange('xl')}
        helperText="Tamaño máximo"
        previewDimensions={{ width: 350, height: 233 }}
        showPreview={true}
      />
    </div>
  );
};

// ===== CONFIGURACIONES AVANZADAS =====

export const AdvancedConfigurations = () => {
  const [values, setValues] = useState({
    custom: null,
    noPreview: null,
    restrictive: null,
    fullWidth: null
  });
  
  const handleChange = (key) => (file) => {
    setValues(prev => ({ ...prev, [key]: file }));
  };
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 'var(--space-xl)',
      maxWidth: '1200px'
    }}>
      <ImageCropField
        label="Configuración personalizada"
        value={values.custom}
        onChange={handleChange('custom')}
        aspect={21/9}
        acceptedFormats={['png', 'webp']}
        maxFileSize="2MB"
        previewDimensions={{ width: 315, height: 135 }}
        helperText="Solo PNG/WebP, máx 2MB"
        cropButtonText="Ajustar recorte"
        changeButtonText="Cambiar imagen"
        selectButtonText="Elegir imagen"
        showPreview={true}
      />
      
      <ImageCropField
        label="Sin vista previa"
        value={values.noPreview}
        onChange={handleChange('noPreview')}
        showPreview={false}
        helperText="El preview está deshabilitado"
      />
      
      <ImageCropField
        label="Formatos restrictivos"
        value={values.restrictive}
        onChange={handleChange('restrictive')}
        acceptedFormats={['jpg']}
        maxFileSize="1MB"
        helperText="Solo JPG, máximo 1MB"
        variant="warning"
        showPreview={true}
      />
      
      <div style={{ gridColumn: '1 / -1' }}>
        <ImageCropField
          label="Ancho completo"
          value={values.fullWidth}
          onChange={handleChange('fullWidth')}
          fullWidth={true}
          helperText="Campo que ocupa todo el ancho disponible"
          previewDimensions={{ width: 400, height: 225 }}
          showPreview={true}
        />
      </div>
    </div>
  );
};

// ===== EJEMPLO INTEGRADO CON FORMULARIO =====

export const FormIntegration = () => {
  const [formData, setFormData] = useState({
    coverImage: null,
    posterImage: null,
    backgroundImage: null
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  const updateField = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Limpiar error al seleccionar archivo
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    const newErrors = {};
    
    // Validaciones
    if (!formData.coverImage) {
      newErrors.coverImage = 'La imagen de portada es obligatoria';
    }
    
    if (!formData.posterImage) {
      newErrors.posterImage = 'El póster es obligatorio';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('📤 Formulario de película enviado:', formData);
      alert('¡Película creada correctamente! 🎬');
      
      // Reset form
      setFormData({
        coverImage: null,
        posterImage: null,
        backgroundImage: null
      });
      setSubmitted(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '800px',
      padding: 'var(--space-xl)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)'
    }}>
      <h3 style={{ 
        margin: '0 0 var(--space-xl) 0',
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-2xl)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)'
      }}>
        🎬 Crear Nueva Película
      </h3>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-xl)' 
      }}>
        {/* Imagen de portada - Formato video */}
        <ImageCropField
          name="coverImage"
          label="Imagen de portada"
          value={formData.coverImage}
          onChange={(file) => updateField('coverImage', file)}
          aspect={16/9}
          required
          helperText="Imagen principal para la portada (16:9)"
          errorText={errors.coverImage}
          variant={errors.coverImage ? 'danger' : formData.coverImage ? 'success' : 'default'}
          acceptedFormats={['jpg', 'png', 'webp']}
          maxFileSize="5MB"
          previewDimensions={{ width: 400, height: 225 }}
          showPreview={true}
        />
        
        {/* Póster - Formato retrato */}
        <ImageCropField
          name="posterImage"
          label="Póster de la película"
          value={formData.posterImage}
          onChange={(file) => updateField('posterImage', file)}
          aspect={2/3}
          required
          helperText="Póster vertical para promoción (2:3)"
          errorText={errors.posterImage}
          variant={errors.posterImage ? 'danger' : formData.posterImage ? 'success' : 'default'}
          acceptedFormats={['jpg', 'png']}
          maxFileSize="3MB"
          previewDimensions={{ width: 200, height: 300 }}
          showPreview={true}
        />
        
        {/* Imagen de fondo - Formato panorámico */}
        <ImageCropField
          name="backgroundImage"
          label="Imagen de fondo (opcional)"
          value={formData.backgroundImage}
          onChange={(file) => updateField('backgroundImage', file)}
          aspect={21/9}
          helperText="Imagen de fondo para detalles (21:9)"
          variant={formData.backgroundImage ? 'success' : 'default'}
          acceptedFormats={['jpg', 'webp']}
          maxFileSize="8MB"
          previewDimensions={{ width: 420, height: 180 }}
          showPreview={true}
        />
        
        {/* Botón de envío */}
        <button
          type="submit"
          disabled={submitted}
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            backgroundColor: submitted ? 'var(--color-secondary)' : 'var(--color-primary)',
            color: 'var(--text-on-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: submitted ? 'not-allowed' : 'pointer',
            marginTop: 'var(--space-md)',
            transition: 'all var(--transition-normal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)'
          }}
        >
          {submitted ? '⏳ Procesando...' : '🎬 Crear Película'}
        </button>
      </div>
      
      {/* Resumen de archivos seleccionados */}
      {(formData.coverImage || formData.posterImage || formData.backgroundImage) && (
        <div style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-lg)',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)'
        }}>
          <h4 style={{ 
            margin: '0 0 var(--space-md) 0',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)'
          }}>
            📎 Imágenes seleccionadas
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {formData.coverImage && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-sm)',
                fontSize: 'var(--font-size-sm)'
              }}>
                <span>🖼️</span>
                <strong>Portada:</strong> {formData.coverImage.name} 
                <span style={{ color: 'var(--text-secondary)' }}>
                  ({(formData.coverImage.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
            
            {formData.posterImage && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-sm)',
                fontSize: 'var(--font-size-sm)'
              }}>
                <span>🎭</span>
                <strong>Póster:</strong> {formData.posterImage.name}
                <span style={{ color: 'var(--text-secondary)' }}>
                  ({(formData.posterImage.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
            
            {formData.backgroundImage && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-sm)',
                fontSize: 'var(--font-size-sm)'
              }}>
                <span>🌅</span>
                <strong>Fondo:</strong> {formData.backgroundImage.name}
                <span style={{ color: 'var(--text-secondary)' }}>
                  ({(formData.backgroundImage.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

FormIntegration.parameters = {
  docs: {
    description: {
      story: 'Ejemplo completo de integración con formulario de película, mostrando diferentes aspectos y validaciones.'
    }
  }
};