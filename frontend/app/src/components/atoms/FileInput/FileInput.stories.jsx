// src/components/atoms/FileInput/FileInput.stories.jsx
import { FileInput } from './FileInput';

export default {
  title: 'Components/Atoms/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# FileInput Atom - Sistema de Diseño Estándar

El átomo **FileInput** migrado al sistema de diseño estándar para selección de archivos.

## ✨ Sistema de Diseño Estándar

- **Hook especializado**: \`useFileInputProps()\` con configuración óptima
- **Props estándar**: \`size\`, \`variant\`, \`rounded\`, \`loading\`, \`disabled\`
- **6 variantes semánticas**: primary, secondary, success, warning, danger, neutral
- **Sistema de iconos**: Iconos Feather automáticos (upload, check-circle, loader, etc.)
- **Estados avanzados**: loading con spinner, disabled con overlays
- **Design tokens**: Aplicación automática de tokens del sistema
- **Backward compatibility**: Mapeo automático de variantes legacy

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { FileInput } from './atoms/FileInput';

<FileInput 
  size="md"
  variant="neutral"
  rounded="md"
  onChange={handleChange}
  text="Seleccionar archivo"
/>
\\\`\\\`\\\`

## 🔄 Migración desde API legacy

\\\`\\\`\\\`jsx
// ANTES (legacy)
<FileInput variant="default" />

// DESPUÉS (estándar)
<FileInput variant="neutral" />

// Auto-mapping: 'default' → 'neutral', 'error' → 'danger'
\\\`\\\`\\\`
        `
      }
    }
  },
  argTypes: {
    text: {
      name: 'Texto',
      description: 'Texto mostrado en el botón',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Seleccionar archivo'" }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del componente',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'md' }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante semántica del sistema de diseño estándar',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral', 'default', 'error'],
      table: {
        type: { summary: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'" },
        defaultValue: { summary: 'primary' }
      }
    },
    rounded: {
      name: 'Radio de bordes',
      description: 'Radio de bordes según design system',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl' | 'full'" },
        defaultValue: { summary: 'md' }
      }
    },
    loading: {
      name: 'Loading',
      description: 'Estado de carga con spinner',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    leftIcon: {
      name: 'Icono izquierdo',
      description: 'Icono del sistema Feather o componente React',
      control: 'text',
      table: {
        type: { summary: 'string | ReactNode' }
      }
    },
    rightIcon: {
      name: 'Icono derecho',
      description: 'Icono del sistema Feather o componente React',
      control: 'text',
      table: {
        type: { summary: 'string | ReactNode' }
      }
    },
    accept: {
      name: 'Tipos aceptados',
      description: 'Tipos de archivo permitidos',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    multiple: {
      name: 'Múltiples archivos',
      description: 'Permite seleccionar múltiples archivos',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Si el input está deshabilitado',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    required: {
      name: 'Requerido',
      description: 'Si el campo es obligatorio',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    helperText: {
      name: 'Texto de ayuda',
      description: 'Texto de ayuda descriptivo',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    errorText: {
      name: 'Texto de error',
      description: 'Mensaje de error',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    onChange: {
      name: 'Función onChange',
      description: 'Función ejecutada al seleccionar archivo',
      action: 'changed',
      table: {
        type: { summary: 'function' }
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

// ========== 1. DEFAULT STORY (OBLIGATORIA) ==========
export const Default = {
  args: {
    text: 'Seleccionar archivo',
    size: 'md',
    variant: 'primary',
    rounded: 'md'
  }
};

Default.parameters = {
  docs: {
    description: {
      story: 'Configuración por defecto del FileInput con sistema de diseño estándar. Variante primary, tamaño medium, con iconos automáticos del sistema.'
    }
  }
};

// ========== 2. SIZES STORY (OBLIGATORIA) ==========
export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>XS</h4>
      <FileInput size="xs" text="Extra small" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>SM</h4>
      <FileInput size="sm" text="Small" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>MD</h4>
      <FileInput size="md" text="Medium" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>LG</h4>
      <FileInput size="lg" text="Large" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>XL</h4>
      <FileInput size="xl" text="Extra large" />
    </div>
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Los 5 tamaños estándar del sistema de diseño. XS para contextos compactos, MD para uso general, XL para destacar.'
    }
  }
};

// ========== 3. SYSTEM STANDARD VARIANTS STORY (OBLIGATORIA) ==========
export const SystemStandardVariants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Primary</h4>
      <FileInput variant="primary" text="Acción principal" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Secondary</h4>
      <FileInput variant="secondary" text="Acción secundaria" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Success</h4>
      <FileInput variant="success" text="Campo válido" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Warning</h4>
      <FileInput variant="warning" text="Advertencia" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Danger</h4>
      <FileInput variant="danger" text="Error crítico" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Neutral</h4>
      <FileInput variant="neutral" text="Campo neutro" />
    </div>
  </div>
);

SystemStandardVariants.parameters = {
  docs: {
    description: {
      story: '6 variantes semánticas del sistema de diseño estándar: Primary (acción principal), Secondary (acción secundaria), Success (confirmación), Warning (advertencia), Danger (error), Neutral (neutro).'
    }
  }
};

// ========== 4. SYSTEM STANDARD STATES STORY (OBLIGATORIA) ==========
export const SystemStandardStates = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Normal</h4>
      <FileInput size="lg" text="Estado normal" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Loading</h4>
      <FileInput loading size="lg" text="Cargando archivo..." />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Disabled</h4>
      <FileInput disabled size="lg" text="Deshabilitado" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Required</h4>
      <FileInput required size="lg" text="Campo requerido" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>With Error</h4>
      <FileInput 
        size="lg" 
        text="Campo con error"
        errorText="Este campo es obligatorio"
      />
    </div>
  </div>
);

SystemStandardStates.parameters = {
  docs: {
    description: {
      story: 'Estados estándar del sistema de diseño: Normal, Loading (con spinner automático), Disabled (con overlay), Required (asterisco), Error (con icono automático).'
    }
  }
};

// ========== 5. SYSTEM ICONS INTEGRATION STORY (NUEVA) ==========
export const SystemIconsIntegration = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Default Upload</h4>
      <FileInput size="lg" text="Archivo general" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Custom Left Icon</h4>
      <FileInput leftIcon="image" size="lg" text="Solo imágenes" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Video Files</h4>
      <FileInput leftIcon="video" size="lg" text="Archivos de video" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Documents</h4>
      <FileInput leftIcon="file-text" size="lg" text="Documentos PDF" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>With Right Icon</h4>
      <FileInput leftIcon="folder" rightIcon="chevron-down" size="lg" text="Explorar carpeta" />
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Success State</h4>
      <FileInput variant="success" leftIcon="check-circle" size="lg" text="Archivo subido" />
    </div>
  </div>
);

SystemIconsIntegration.parameters = {
  docs: {
    description: {
      story: 'Integración completa del sistema de iconos Feather. Iconos automáticos por contexto y estados personalizables con leftIcon/rightIcon.'
    }
  }
};

// ========== 6. INTERACTIVE STORY (OBLIGATORIA) ==========
export const Interactive = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <FileInput 
      size="lg"
      variant="neutral"
      text="Seleccionar cualquier archivo"
      helperText="Haz click para seleccionar un archivo"
      leftIcon="upload"
    />
    
    <FileInput 
      accept="image/*"
      size="lg"
      text="Solo imágenes"
      helperText="JPG, PNG, GIF, WebP"
      variant="success"
      leftIcon="image"
    />
    
    <FileInput 
      multiple
      accept=".pdf,.doc,.docx"
      size="lg"
      text="Múltiples documentos"
      helperText="Selecciona varios archivos PDF o Word"
      variant="primary"
      leftIcon="file-text"
    />
    
    <FileInput 
      accept="video/*"
      size="lg"
      text="Seleccionar video"
      helperText="MP4, WebM, AVI, MOV"
      variant="warning"
      leftIcon="video"
    />
    
    <FileInput 
      loading
      size="lg"
      text="Procesando archivo..."
      helperText="El archivo se está procesando"
      variant="primary"
    />
  </div>
);

Interactive.parameters = {
  docs: {
    description: {
      story: 'Ejemplos interactivos con sistema de iconos integrado. Iconos automáticos según el tipo de archivo y estado. Incluye estados loading con spinner.'
    }
  }
};

// ========== 7. BACKWARD COMPATIBILITY DEMO STORY (NUEVA) ==========
export const BackwardCompatibilityDemo = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
        Legacy: variant=&quot;default&quot;
      </h4>
      <FileInput variant="default" text="Auto-mapping a neutral" />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Auto-mapped to neutral)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
        New: variant=&quot;neutral&quot;
      </h4>
      <FileInput variant="neutral" text="Estándar neutro" />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Standard neutral)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
        Legacy: variant=&quot;error&quot;
      </h4>
      <FileInput variant="error" text="Auto-mapping a danger" />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Auto-mapped to danger)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
        New: variant=&quot;danger&quot;
      </h4>
      <FileInput variant="danger" text="Estándar danger" />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Standard danger)
      </small>
    </div>
  </div>
);

BackwardCompatibilityDemo.parameters = {
  docs: {
    description: {
      story: 'Demostración de backward compatibility. Las variantes legacy se mapean automáticamente: "default" → "neutral", "error" → "danger". Sin breaking changes.'
    }
  }
};

// ========== 8. ACCESSIBILITY STORY (OBLIGATORIA) ==========
export const Accessibility = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <FileInput 
      ariaLabel="Seleccionar archivo de currículum"
      accept=".pdf,.doc,.docx"
      size="lg"
      text="Subir currículum"
      helperText="Formatos permitidos: PDF, Word"
      leftIcon="file-text"
      variant="primary"
    />
    
    <FileInput 
      ariaLabel="Seleccionar foto de perfil"
      accept="image/*"
      size="lg"
      text="Foto de perfil"
      helperText="Imagen para tu perfil público"
      leftIcon="user"
      required
      variant="success"
    />
    
    <FileInput 
      ariaLabel="Archivo no disponible actualmente"
      disabled
      size="lg"
      text="No disponible"
      helperText="Esta función está temporalmente deshabilitada"
      leftIcon="lock"
    />
    
    <FileInput 
      ariaLabel="Campo con error de validación"
      size="lg"
      text="Campo con error"
      errorText="Este campo es obligatorio"
      variant="danger"
    />
    
    <div style={{ 
      marginTop: 'var(--space-md)', 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--bg-secondary)', 
      borderRadius: 'var(--radius-md)',
      textAlign: 'center'
    }}>
      <h4 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--text-primary)' }}>
        Características de accesibilidad:
      </h4>
      <ul style={{ 
        margin: 0, 
        padding: 0, 
        listStyle: 'none', 
        fontSize: 'var(--text-sm)', 
        color: 'var(--text-muted)' 
      }}>
        <li>✅ ARIA labels para screen readers</li>
        <li>✅ Estados aria-required y aria-invalid</li>
        <li>✅ Navegación por teclado (Tab, Enter, Space)</li>
        <li>✅ Focus visible con outline</li>
        <li>✅ Mensajes de error con role=&quot;alert&quot;</li>
        <li>✅ Área táctil mínima de 44px</li>
        <li>✅ Iconos automáticos con semántica clara</li>
      </ul>
    </div>
  </div>
);

Accessibility.parameters = {
  docs: {
    description: {
      story: 'Configuración de accesibilidad completa con sistema de iconos integrado. Todos los FileInput son navegables por teclado y compatibles con screen readers. Iconos proporcionan contexto visual adicional.'
    }
  }
};