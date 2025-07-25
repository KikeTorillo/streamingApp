#!/usr/bin/env node

/**
 * DynamicForm Context - Contexto específico para el generador de formularios
 * Proporciona información detallada sobre configuración, casos de uso y debugging
 */

const fs = require('fs');

function getDynamicFormContext(prompt) {
  return {
    component: 'DynamicForm',
    type: 'complex-form-generator',
    level: 'molecules',
    filePath: 'frontend/app/src/components/molecules/DynamicForm/DynamicForm.jsx',
    storiesPath: 'frontend/app/src/components/molecules/DynamicForm/DynamicForm.stories.jsx',
    
    // Tipos de campo soportados con configuración completa
    fieldTypes: {
      text: {
        description: 'Input básico de texto',
        props: ['name', 'label', 'placeholder', 'required', 'leftIcon', 'rightIcon', 'helperText'],
        example: '{ name: "title", type: "text", label: "Título", required: true }'
      },
      email: {
        description: 'Input con validación automática de email',
        props: ['name', 'label', 'placeholder', 'required', 'leftIcon'],
        validation: 'Automática: formato de email válido',
        example: '{ name: "email", type: "email", label: "Correo", leftIcon: "📧" }'
      },
      password: {
        description: 'Input de contraseña con toggle de visibilidad',
        props: ['name', 'label', 'placeholder', 'required', 'minLength'],
        validation: 'minLength automático',
        example: '{ name: "password", type: "password", label: "Contraseña", minLength: 8 }'
      },
      number: {
        description: 'Input numérico con validación',
        props: ['name', 'label', 'placeholder', 'required', 'min', 'max'],
        validation: 'Rango numérico automático',
        example: '{ name: "year", type: "number", label: "Año", min: 1900, max: 2030 }'
      },
      select: {
        description: 'Dropdown usando TextSelect del design system',
        props: ['name', 'label', 'required', 'options', 'leftIcon', 'placeholder'],
        required: 'options array: [{ value: "key", label: "Display" }]',
        example: '{ name: "genre", type: "select", label: "Género", options: [{ value: "action", label: "Acción" }] }'
      },
      textarea: {
        description: 'Área de texto multilínea',
        props: ['name', 'label', 'placeholder', 'required', 'rows', 'maxLength'],
        example: '{ name: "overview", type: "textarea", label: "Descripción", rows: 4 }'
      },
      checkbox: {
        description: 'Casilla de verificación usando Checkbox atom',
        props: ['name', 'label', 'required'],
        example: '{ name: "featured", type: "checkbox", label: "Contenido destacado" }'
      },
      file: {
        description: 'Upload de archivos usando FileInputField',
        props: ['name', 'label', 'required', 'accept', 'multiple'],
        integration: 'Se integra con FileInputField molecule',
        example: '{ name: "poster", type: "file", label: "Poster", accept: "image/*" }'
      },
      imagecrop: {
        description: 'Upload + crop de imágenes usando ImageCropField',
        props: ['name', 'label', 'required', 'cropAspectRatio'],
        integration: 'Se integra con ImageCropField molecule',
        example: '{ name: "poster", type: "imagecrop", label: "Poster", cropAspectRatio: 2/3 }'
      }
    },
    
    // Props principales del componente
    mainProps: {
      required: [
        'fields: Array - Configuración de campos del formulario',
        'onSubmit: Function - Callback al enviar formulario'
      ],
      layout: [
        'columnsPerRow: number (1-4) - Columnas en desktop',
        'tabletColumns: number - Columnas en tablet (768px+)',
        'mobileColumns: number - Columnas en móvil (<768px)',
        'responsive: boolean - Si adapta automáticamente'
      ],
      validation: [
        'validateOnChange: boolean - Validar al escribir',
        'validateOnBlur: boolean - Validar al perder foco',
        'initialData: Object - Datos iniciales del formulario'
      ],
      styling: [
        'fieldSize: "xs"|"sm"|"md"|"lg"|"xl" - Tamaño de campos',
        'fieldRounded: "sm"|"md"|"lg"|"xl"|"full" - Border radius',
        'submitVariant: "primary"|"secondary"|"success" - Estilo botón',
        'submitText: string - Texto del botón submit'
      ]
    },
    
    // Casos de uso reales en el proyecto
    realWorldExamples: [
      {
        component: 'MovieCreatePage',
        location: 'frontend/app/src/Pages/Admin/Movies/MovieCreatePage/',
        complexity: 'Alto - 15+ campos, TMDB integration, file uploads',
        fields: ['title', 'overview', 'release_date', 'genre_ids', 'poster', 'backdrop'],
        specialFeatures: ['TMDB search integration', 'Image cropping', 'Multiple selects']
      },
      {
        component: 'SeriesCreatePage', 
        location: 'frontend/app/src/Pages/Admin/Series/SeriesCreatePage/',
        complexity: 'Alto - Similar a movies + season management',
        fields: ['name', 'overview', 'first_air_date', 'genre_ids', 'number_of_seasons'],
        specialFeatures: ['Season/episode management', 'TMDB integration']
      },
      {
        component: 'UserCreatePage',
        location: 'frontend/app/src/Pages/Admin/Users/',
        complexity: 'Medio - User data + roles',
        fields: ['username', 'email', 'password', 'role', 'active'],
        specialFeatures: ['Role selection', 'Password validation']
      },
      {
        component: 'EpisodeCreatePage',
        location: 'frontend/app/src/Pages/Admin/Episodes/',
        complexity: 'Alto - Metadata + file processing',
        fields: ['name', 'overview', 'episode_number', 'season_number', 'video_file'],
        specialFeatures: ['Video file upload', 'Series association']
      }
    ],
    
    // Problemas comunes y soluciones
    commonIssues: {
      validation: {
        problem: 'Custom validation not working',
        causes: ['Field config missing validation prop', 'Validation function not returning string/null', 'validateOnChange/validateOnBlur disabled'],
        debugging: ['Check field.validation function', 'Verify validation props', 'Test with simple required validation first'],
        example: '{ name: "email", validation: (value) => !value.includes("@") ? "Email inválido" : null }'
      },
      layout: {
        problem: 'Responsive columns not working',
        causes: ['responsive prop disabled', 'Custom CSS overriding', 'Breakpoints not matching system'],
        debugging: ['Check responsive=true', 'Verify CSS grid implementation', 'Test different screen sizes'],
        solution: 'Use system breakpoints: mobile <768px, tablet 768-1024px, desktop >1024px'
      },
      integration: {
        problem: 'TextInput/TextSelect props not passing through',
        causes: ['Field config missing props', 'Component prop conflicts', 'fieldSize/fieldRounded not set'],
        debugging: ['Check field-level props vs component-level props', 'Verify design system prop names', 'Test with basic field first'],
        example: 'Component-level: fieldSize="lg" affects all fields. Field-level: { size: "sm" } affects single field'
      },
      state: {
        problem: 'Form data not syncing or onChange not firing',
        causes: ['Missing onChange callback', 'initialData structure mismatch', 'Field name conflicts'],
        debugging: ['Check field names match data keys', 'Verify onChange callback', 'Test with simple form first'],
        solution: 'Ensure field.name matches initialData keys exactly'
      },
      files: {
        problem: 'File uploads not working',
        causes: ['Wrong field type (use "file" or "imagecrop")', 'Missing accept prop', 'FileInputField not integrated'],
        debugging: ['Check field type configuration', 'Verify file handling in onSubmit', 'Test FileInputField separately'],
        example: '{ name: "poster", type: "imagecrop", accept: "image/*", cropAspectRatio: 2/3 }'
      }
    },
    
    // Integración con Design System
    designSystemIntegration: {
      components: [
        'TextInput: Para text, email, password, number, url, tel, date',
        'TextSelect: Para select con options',
        'Checkbox: Para checkbox fields',
        'Button: Para submit button con todas sus variantes',
        'FileInputField: Para file uploads',
        'ImageCropField: Para image cropping'
      ],
      consistency: [
        'Todos los campos heredan fieldSize, fieldRounded del componente',
        'Submit button usa submitVariant, submitSize, submitRounded',
        'CSS Grid automático con breakpoints del sistema',
        'Spacing y colores usando variables CSS del design system'
      ],
      customization: [
        'Field-level props override component-level props',
        'Custom CSS classes via className prop',
        'Individual field styling via field.className',
        'Custom validation messages'
      ]
    },
    
    // Mejores prácticas
    bestPractices: {
      fieldConfiguration: [
        'Usar nombres descriptivos para fields (no genéricos como "field1")',
        'Siempre especificar label y placeholder apropiados',
        'Usar leftIcon para mejorar UX (📧 email, 🔒 password, etc.)',
        'Configurar validation apropiada para cada tipo de campo'
      ],
      layout: [
        'Empezar con 1 columna en móvil siempre',
        'Usar 2 columnas en tablet para formularios complejos',
        'Máximo 3-4 columnas en desktop para legibilidad',
        'Agrupar campos relacionados visualmente'
      ],
      validation: [
        'Usar validateOnBlur=true para mejor UX',
        'validateOnChange=false para evitar validación agresiva',
        'Mensajes de error claros y en español',
        'Validación async para checks de disponibilidad'
      ],
      performance: [
        'Usar initialData para forms de edición',
        'Implementar debounce en onChange si es necesario',
        'Lazy load options para selects con muchas opciones',
        'Memoizar validation functions complejas'
      ]
    },
    
    // Instrucciones específicas para Claude
    instructions: {
      primary: 'IMPORTANTE: DynamicForm es el generador de formularios más complejo del proyecto. SIEMPRE leer DynamicForm.jsx y DynamicForm.stories.jsx antes de dar consejos.',
      debugging: 'Para debugging: 1) Revisar configuración de fields, 2) Verificar props del componente, 3) Comprobar integración con design system, 4) Testear con configuración simple primero.',
      examples: 'Buscar ejemplos reales en MovieCreatePage, SeriesCreatePage para entender patrones de uso complejos.',
      validation: 'Para problemas de validación, siempre verificar la función validation del field y los props validateOnChange/validateOnBlur.',
      integration: 'Recordar que DynamicForm es un orquestador - usa componentes del design system internamente, no reimplementa funcionalidad.'
    }
  };
}

// Obtener casos de uso específicos según el contexto del prompt
function getSpecificUseCases(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('movie') || lowerPrompt.includes('pelicula')) {
    return ['MovieCreatePage', 'TMDB integration', 'Image cropping'];
  }
  
  if (lowerPrompt.includes('series') || lowerPrompt.includes('serie')) {
    return ['SeriesCreatePage', 'Season management', 'Episode association'];
  }
  
  if (lowerPrompt.includes('user') || lowerPrompt.includes('usuario')) {
    return ['UserCreatePage', 'Role management', 'Authentication'];
  }
  
  if (lowerPrompt.includes('validation') || lowerPrompt.includes('validacion')) {
    return ['Custom validators', 'Real-time validation', 'Error handling'];
  }
  
  if (lowerPrompt.includes('layout') || lowerPrompt.includes('responsive')) {
    return ['Responsive columns', 'Mobile-first', 'Grid system'];
  }
  
  return ['General form generation', 'Design system integration'];
}

module.exports = { getDynamicFormContext, getSpecificUseCases };