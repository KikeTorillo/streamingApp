// src/components/atoms/TextArea/TextArea.stories.jsx
import { TextArea } from './TextArea';

export default {
  title: 'Components/Atoms/TextArea',
  component: TextArea,
  parameters: {
    docs: {
      description: {
        component: 'Campo de texto multi-línea con sistema V2.0 completo. Incluye auto-resize, contador de caracteres, iconos, y todas las características del sistema de diseño.'
      }
    }
  },
  argTypes: {
    value: {
      description: 'Valor controlado del campo',
      control: { type: 'text' }
    },
    placeholder: {
      description: 'Texto placeholder',
      control: { type: 'text' }
    },
    rows: {
      description: 'Número de filas iniciales',
      control: { type: 'range', min: 1, max: 20, step: 1 }
    },
    minRows: {
      description: 'Mínimo de filas (con autoResize)',
      control: { type: 'range', min: 1, max: 10, step: 1 }
    },
    maxRows: {
      description: 'Máximo de filas (con autoResize)',
      control: { type: 'range', min: 3, max: 20, step: 1 }
    },
    autoResize: {
      description: 'Expansión automática de altura',
      control: { type: 'boolean' }
    },
    maxLength: {
      description: 'Límite de caracteres',
      control: { type: 'number', min: 0, step: 10 }
    },
    showCharCount: {
      description: 'Mostrar contador de caracteres',
      control: { type: 'boolean' }
    },
    resize: {
      description: 'Control de redimensionamiento',
      control: { type: 'select' },
      options: ['both', 'horizontal', 'vertical', 'none']
    },
    size: {
      description: 'Tamaño del campo',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    variant: {
      description: 'Variante semántica',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']
    },
    readOnly: {
      description: 'Campo de solo lectura',
      control: { type: 'boolean' }
    },
    required: {
      description: 'Campo requerido',
      control: { type: 'boolean' }
    },
    disabled: {
      description: 'Estado deshabilitado',
      control: { type: 'boolean' }
    },
    loading: {
      description: 'Estado de loading con spinner',
      control: { type: 'boolean' }
    }
  }
};

// Historia base/default
export const Default = {
  args: {
    placeholder: 'Escribe tu mensaje aquí...',
    rows: 4,
    size: 'md',
    variant: 'primary'
  }
};

// ===== TAMAÑOS =====

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Extra Small (xs)</h3>
      <TextArea 
        placeholder="Campo muy compacto..." 
        size="xs" 
        variant="primary"
        rows={2}
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Small (sm)</h3>
      <TextArea 
        placeholder="Campo compacto para formularios..." 
        size="sm" 
        variant="primary"
        rows={3}
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Medium (md) - Default</h3>
      <TextArea 
        placeholder="Tamaño estándar para uso general..." 
        size="md" 
        variant="primary"
        rows={4}
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Large (lg)</h3>
      <TextArea 
        placeholder="Campo prominente para contenido importante..." 
        size="lg" 
        variant="primary"
        rows={5}
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Extra Large (xl)</h3>
      <TextArea 
        placeholder="Campo muy visible para editores principales..." 
        size="xl" 
        variant="primary"
        rows={6}
      />
    </div>
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Cinco tamaños estándar con altura y padding apropiados. Mobile optimizado con tamaños aumentados automáticamente.'
    }
  }
};

// ===== VARIANTES SEMÁNTICAS =====

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Primary - Campo principal</h3>
      <TextArea 
        placeholder="Mensaje principal..." 
        variant="primary" 
        defaultValue="Este es un campo de entrada principal."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Secondary - Campo secundario</h3>
      <TextArea 
        placeholder="Información adicional..." 
        variant="secondary" 
        defaultValue="Campo para información opcional o secundaria."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Success - Contenido validado</h3>
      <TextArea 
        placeholder="Mensaje exitoso..." 
        variant="success" 
        defaultValue="¡Excelente! Tu comentario ha sido validado correctamente."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Warning - Requiere atención</h3>
      <TextArea 
        placeholder="Mensaje de advertencia..." 
        variant="warning" 
        defaultValue="Por favor, revisa el contenido antes de enviar."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Danger - Error o contenido problemático</h3>
      <TextArea 
        placeholder="Mensaje de error..." 
        variant="danger" 
        defaultValue="Error: el contenido contiene información sensible."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Neutral - Técnico o neutral</h3>
      <TextArea 
        placeholder="Código o configuración..." 
        variant="neutral" 
        defaultValue="function validateInput(data) {\n  return data.length > 0;\n}"
      />
    </div>
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Seis variantes semánticas con colores de borde y fondo apropiados para cada contexto.'
    }
  }
};

// ===== AUTO-RESIZE =====

export const AutoResize = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Tamaño fijo (sin auto-resize)</h3>
      <TextArea 
        placeholder="Escribe varias líneas para ver la diferencia..." 
        rows={3}
        autoResize={false}
        defaultValue="Esta es la primera línea.
Esta es la segunda línea.
Esta es la tercera línea.
Esta línea desborda el área visible..."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Auto-resize habilitado</h3>
      <TextArea 
        placeholder="Escribe y el campo crecerá automáticamente..." 
        minRows={2}
        maxRows={8}
        autoResize={true}
        defaultValue="Esta es la primera línea.
Esta es la segunda línea.
Esta es la tercera línea.
El campo se expande automáticamente.
¡Puedes seguir escribiendo!
Y el área de texto crecerá hasta el máximo."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Auto-resize con límites personalizados</h3>
      <TextArea 
        placeholder="Mínimo 3 líneas, máximo 6 líneas..." 
        minRows={3}
        maxRows={6}
        autoResize={true}
      />
    </div>
  </div>
);

AutoResize.parameters = {
  docs: {
    description: {
      story: 'Funcionalidad de auto-resize que expande el campo automáticamente según el contenido, con límites mínimos y máximos configurables.'
    }
  }
};

// ===== CONTADOR DE CARACTERES =====

export const CharacterCount = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Sin contador</h3>
      <TextArea 
        placeholder="Campo sin límite de caracteres..." 
        defaultValue="Puedes escribir tanto como quieras aquí."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Con contador (máximo 100 caracteres)</h3>
      <TextArea 
        placeholder="Máximo 100 caracteres..." 
        maxLength={100}
        showCharCount={true}
        defaultValue="Este campo tiene un límite de 100 caracteres y muestra un contador en tiempo real."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Cerca del límite (500 caracteres)</h3>
      <TextArea 
        placeholder="Máximo 500 caracteres..." 
        maxLength={500}
        showCharCount={true}
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis."
      />
    </div>
  </div>
);

CharacterCount.parameters = {
  docs: {
    description: {
      story: 'Sistema de contador de caracteres con estados visuales: normal, advertencia (>80%) y error (límite excedido).'
    }
  }
};

// ===== CON ICONOS =====

export const WithIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Icono izquierdo</h3>
      <TextArea 
        placeholder="Escribe tu comentario..." 
        leftIcon="message-circle"
        rows={3}
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Icono derecho</h3>
      <TextArea 
        placeholder="Escribe una descripción..." 
        rightIcon="file-text"
        rows={4}
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Ambos iconos</h3>
      <TextArea 
        placeholder="Campo con iconos en ambos lados..." 
        leftIcon="edit"
        rightIcon="check-circle"
        rows={3}
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Con contador e icono</h3>
      <TextArea 
        placeholder="Mensaje con límite..." 
        leftIcon="message-square"
        maxLength={200}
        showCharCount={true}
        rows={4}
        defaultValue="Campo que combina iconos con contador de caracteres para una experiencia completa."
      />
    </div>
  </div>
);

WithIcons.parameters = {
  docs: {
    description: {
      story: 'Soporte completo para iconos izquierdo y derecho, compatibles con el sistema de iconos universal.'
    }
  }
};

// ===== CONTROL DE RESIZE =====

export const ResizeControl = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Resize vertical (default)</h3>
      <TextArea 
        placeholder="Puedes redimensionar verticalmente..." 
        resize="vertical"
        defaultValue="Arrastra desde la esquina inferior derecha para cambiar la altura."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Resize horizontal</h3>
      <TextArea 
        placeholder="Puedes redimensionar horizontalmente..." 
        resize="horizontal"
        defaultValue="Arrastra desde la esquina inferior derecha para cambiar el ancho."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Resize en ambas direcciones</h3>
      <TextArea 
        placeholder="Puedes redimensionar en ambas direcciones..." 
        resize="both"
        defaultValue="Arrastra desde la esquina inferior derecha para cambiar tanto ancho como altura."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Sin resize</h3>
      <TextArea 
        placeholder="Tamaño fijo..." 
        resize="none"
        defaultValue="Este campo tiene un tamaño fijo y no puede redimensionarse."
      />
    </div>
  </div>
);

ResizeControl.parameters = {
  docs: {
    description: {
      story: 'Control de redimensionamiento manual: vertical (default), horizontal, ambos, o ninguno.'
    }
  }
};

// ===== ESTADOS =====

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Estado normal</h3>
      <TextArea 
        placeholder="Campo en estado normal..." 
        defaultValue="Este es un campo en estado normal, completamente interactivo."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Campo requerido</h3>
      <TextArea 
        placeholder="Este campo es obligatorio..." 
        required={true}
        variant="primary"
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Solo lectura</h3>
      <TextArea 
        readOnly={true}
        defaultValue="Este contenido es de solo lectura y no puede modificarse."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Estado loading</h3>
      <TextArea 
        loading={true}
        placeholder="Cargando contenido..." 
        defaultValue="Campo en estado de carga con spinner."
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Estado disabled</h3>
      <TextArea 
        disabled={true}
        placeholder="Campo deshabilitado..." 
        defaultValue="Este campo está deshabilitado y no puede usarse."
      />
    </div>
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Estados disponibles: normal, requerido, solo lectura, loading y deshabilitado.'
    }
  }
};

// ===== CASOS DE USO REALES =====

export const UseCases = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
    {/* Comentario de Producto */}
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>💬 Comentario de Producto</h3>
      <TextArea 
        placeholder="Comparte tu opinión sobre este producto..." 
        leftIcon="star"
        maxLength={500}
        showCharCount={true}
        autoResize={true}
        minRows={3}
        maxRows={6}
        size="md"
        variant="primary"
      />
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
        Comparte tu experiencia para ayudar a otros usuarios
      </div>
    </div>

    {/* Descripción de Proyecto */}
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>📝 Descripción de Proyecto</h3>
      <TextArea 
        placeholder="Describe los objetivos, alcance y detalles del proyecto..." 
        leftIcon="folder"
        maxLength={2000}
        showCharCount={true}
        rows={6}
        size="lg"
        variant="secondary"
        defaultValue="Este proyecto tiene como objetivo desarrollar una plataforma moderna que permita a los usuarios gestionar sus tareas de forma eficiente."
      />
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
        Información detallada sobre el proyecto para el equipo
      </div>
    </div>

    {/* Mensaje de Soporte */}
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>🆘 Mensaje de Soporte</h3>
      <TextArea 
        placeholder="Describe tu problema con el mayor detalle posible..." 
        leftIcon="help-circle"
        rightIcon="send"
        maxLength={1000}
        showCharCount={true}
        autoResize={true}
        minRows={4}
        maxRows={8}
        size="md"
        variant="primary"
      />
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
        Incluye pasos para reproducir el problema y capturas si es necesario
      </div>
    </div>

    {/* Código de Configuración */}
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>⚙️ Configuración JSON</h3>
      <TextArea 
        placeholder="Ingresa la configuración en formato JSON..." 
        leftIcon="settings"
        rows={8}
        resize="both"
        size="md"
        variant="neutral"
        style={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: '0.875rem' }}
        defaultValue={`{
  "apiUrl": "https://api.example.com",
  "timeout": 5000,
  "retries": 3,
  "features": {
    "authentication": true,
    "caching": false
  }
}`}
      />
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
        Configuración técnica en formato JSON válido
      </div>
    </div>

    {/* Feedback con Estados */}
    <div style={{ padding: '1rem', border: '1px solid #fecaca', borderRadius: '8px', backgroundColor: '#fef2f2' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>⚠️ Reporte de Error</h3>
      <TextArea 
        placeholder="Describe el error encontrado..." 
        leftIcon="alert-triangle"
        maxLength={800}
        showCharCount={true}
        rows={4}
        size="md"
        variant="danger"
        defaultValue="Error crítico detectado en el módulo de autenticación. Los usuarios no pueden iniciar sesión."
      />
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#7f1d1d' }}>
        Error crítico que requiere atención inmediata
      </div>
    </div>
  </div>
);

UseCases.parameters = {
  docs: {
    description: {
      story: 'Ejemplos de casos de uso reales: comentarios de productos, descripciones de proyectos, mensajes de soporte, configuración técnica y reportes de errores.'
    }
  }
};

// ===== ACCESSIBILITY SHOWCASE =====

export const Accessibility = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Con ARIA label personalizado</h3>
      <TextArea 
        placeholder="Escribe tu mensaje..." 
        ariaLabel="Campo para mensaje personal al equipo de desarrollo"
        rows={3}
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Campo requerido con contexto</h3>
      <TextArea 
        placeholder="Descripción obligatoria..." 
        required={true}
        ariaLabel="Descripción del problema (obligatorio), máximo 300 caracteres"
        maxLength={300}
        showCharCount={true}
        variant="primary"
        rows={4}
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Con límite de caracteres accesible</h3>
      <TextArea 
        placeholder="Comentario breve..." 
        maxLength={150}
        showCharCount={true}
        ariaLabel="Comentario breve, máximo 150 caracteres"
        autoResize={true}
        minRows={2}
        maxRows={5}
        defaultValue="El contador se anuncia automáticamente a lectores de pantalla."
      />
    </div>
  </div>
);

Accessibility.parameters = {
  docs: {
    description: {
      story: 'Características de accesibilidad: ARIA labels contextuales, anuncios automáticos para screen readers, y soporte completo de navegación por teclado.'
    }
  }
};

// ===== INTERACTIVE PLAYGROUND =====

export const InteractivePlayground = {
  args: {
    placeholder: 'Escribe tu contenido aquí...',
    rows: 4,
    minRows: 2,
    maxRows: 10,
    autoResize: false,
    maxLength: 500,
    showCharCount: true,
    resize: 'vertical',
    size: 'md',
    variant: 'primary',
    readOnly: false,
    required: false,
    disabled: false,
    loading: false,
    leftIcon: '',
    rightIcon: ''
  }
};

InteractivePlayground.parameters = {
  docs: {
    description: {
      story: 'Playground interactivo para experimentar con todas las propiedades del TextArea. Usa los controles de abajo para probar diferentes combinaciones.'
    }
  }
};