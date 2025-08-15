// src/components/molecules/FileInputField/FileInputField.stories.jsx
import { useState } from 'react';
import { FileInputField } from './FileInputField';
import './FileInputField.css';

export default {
  title: 'Components/Molecules/FileInputField',
  component: FileInputField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# FileInputField - Molécula del Sistema de Diseño Estándar

**FileInputField** migrado al sistema de diseño estándar, extiende el átomo FileInput siguiendo el patrón arquitectural de TextInput.

## ✅ MIGRADO AL SISTEMA ESTÁNDAR - Enero 2025

### 🏗️ Arquitectura Atomic Design

\`\`\`
FileInputField (Molécula) 🧬
├── Label (elemento) + validateStandardProps
├── FileInput (Átomo) ⚛️ ← Sistema de diseño estándar completo
└── Footer
    └── Messages (helper/error con live regions)
\`\`\`

### 🎯 Sistema de Diseño Estándar

- **Props estándar**: size, variant, rounded, disabled, loading, leftIcon, rightIcon
- **6 variantes semánticas**: primary, secondary, success, warning, danger, neutral
- **Backward compatibility**: Mapeo automático default → primary, error → danger
- **validateStandardProps**: Validación unificada con deprecation warnings
- **STANDARD_PROP_TYPES**: PropTypes del sistema integrados
- **Hook especializado**: useFileInputProps automático del átomo

### 🎨 Consistencia 100% con TextInput

\`\`\`jsx
// Misma API que TextInput
<FileInputField
  size="md"                    // xs, sm, md, lg, xl
  variant="primary"            // primary, secondary, success, warning, danger, neutral  
  loading={true}               // Estado loading con spinner
  leftIcon="upload"            // Sistema de iconos Feather
  label="Subir archivo"
  helperText="Formatos permitidos"
  errorText="Archivo requerido"
/>
\`\`\`

### 📱 Migración Automática

\`\`\`jsx
// ANTES (legacy) - sigue funcionando
<FileInputField variant="default" />

// DESPUÉS (estándar) - recomendado
<FileInputField variant="primary" />

// Auto-mapping: 'default' → 'primary', 'error' → 'danger'
\`\`\`
        `
      }
    }
  },
  argTypes: {
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
      description: 'Variante semántica del sistema de diseño estándar',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral', 'default', 'error'],
      table: {
        type: { summary: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'" },
        defaultValue: { summary: "'primary'" }
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
    fullWidth: {
      name: 'Ancho completo',
      description: 'Ocupa todo el ancho disponible',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    compact: {
      name: 'Compacto',
      description: 'Versión compacta con spacing reducido',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    accept: {
      name: 'Tipos aceptados',
      description: 'Tipos MIME de archivos permitidos',
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
    text: {
      name: 'Texto del botón',
      description: 'Texto del botón de selección',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Seleccionar archivo'" }
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
    }
  }
};

// Template base
const Template = (args) => (
  <FileInputField 
    {...args} 
    onChange={() => {
      // Handle file change
    }}
  />
);

// ===== STORIES PRINCIPALES =====

export const Default = Template.bind({});
Default.args = {
  label: 'Subir archivo',
  helperText: 'Selecciona un archivo de tu dispositivo',
  text: 'Seleccionar archivo',
  size: 'md',
  variant: 'primary'
};

Default.parameters = {
  docs: {
    description: {
      story: 'Configuración por defecto de FileInputField con sistema de diseño estándar. Variante primary, tamaño medium, estructura consistente con TextInput.'
    }
  }
};

// ===== COMPARACIÓN CON TEXTINPUT =====

export const VisualConsistency = () => {
  const [textValue, setTextValue] = useState('');
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--space-lg)',
      maxWidth: '500px' 
    }}>
      <h3 style={{ margin: '0', color: 'var(--text-primary)' }}>
        🎨 Consistencia Visual con TextInput
      </h3>
      
      {/* Simulación de TextInput para comparar */}
      <div>
        <label style={{
          display: 'block',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-sm)',
          marginBottom: 'var(--space-xs)'
        }}>
          Campo de texto
        </label>
        <input
          type="text"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Escribe algo..."
          style={{
            width: '100%',
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)',
            fontFamily: 'var(--font-family-base)',
            minHeight: '4.0rem'
          }}
        />
        <div style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
          marginTop: 'var(--space-xs)'
        }}>
          Texto de ayuda para el campo
        </div>
      </div>
      
      {/* FileInputField */}
      <FileInputField
        label="Campo de archivo"
        helperText="Texto de ayuda para el archivo"
        text="Seleccionar archivo"
        accept="image/*"
      />
      
      <div style={{
        padding: 'var(--space-md)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)'
      }}>
        ✅ <strong>Misma estructura visual:</strong> Label, Campo, Helper Text<br/>
        ✅ <strong>Mismo espaciado:</strong> Variables CSS idénticas<br/>
        ✅ <strong>Mismas alturas:</strong> Alineación perfecta
      </div>
    </div>
  );
};

// ===== SISTEMA DE DISEÑO ESTÁNDAR - VARIANTES =====

export const SystemStandardVariants = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'var(--space-lg)',
    maxWidth: '900px'
  }}>
    <FileInputField
      label="Primary (Principal)"
      helperText="Acción principal del formulario"
      text="Seleccionar archivo"
      variant="primary"
      leftIcon="upload"
    />
    
    <FileInputField
      label="Secondary (Secundaria)"
      helperText="Acción secundaria opcional"
      text="Archivo opcional"
      variant="secondary"
      leftIcon="file"
    />
    
    <FileInputField
      label="Success (Éxito)"
      helperText="Archivo validado correctamente"
      text="Archivo válido"
      variant="success"
      leftIcon="check-circle"
    />
    
    <FileInputField
      label="Warning (Advertencia)"
      helperText="Revisa el tipo de archivo"
      text="Revisar archivo"
      variant="warning"
      leftIcon="alert-triangle"
    />
    
    <FileInputField
      label="Danger (Error)"
      errorText="Tipo de archivo no permitido"
      text="Archivo inválido"
      variant="danger"
      leftIcon="alert-circle"
    />
    
    <FileInputField
      label="Neutral (Neutro)"
      helperText="Campo neutro sin semántica"
      text="Seleccionar archivo"
      variant="neutral"
      leftIcon="folder"
    />
  </div>
);

SystemStandardVariants.parameters = {
  docs: {
    description: {
      story: '6 variantes semánticas del sistema de diseño estándar con iconos automáticos. Cada variante tiene colores y semántica específica.'
    }
  }
};

// ===== ESTADOS ESTÁNDAR =====

export const SystemStandardStates = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--space-lg)',
    maxWidth: '800px'
  }}>
    <FileInputField
      label="Estado normal"
      helperText="Campo en estado normal"
      text="Seleccionar archivo"
      size="lg"
    />
    
    <FileInputField
      label="Campo requerido"
      helperText="Este campo es obligatorio"
      text="Archivo requerido"
      required
      size="lg"
    />
    
    <FileInputField
      label="Estado loading"
      helperText="Procesando archivo..."
      text="Cargando..."
      loading
      size="lg"
    />
    
    <FileInputField
      label="Campo deshabilitado"
      helperText="No se puede modificar"
      text="Archivo bloqueado"
      disabled
      size="lg"
    />
    
    <FileInputField
      label="Con error"
      errorText="Este campo es obligatorio"
      text="Seleccionar archivo"
      size="lg"
    />
    
    <FileInputField
      label="Ancho completo"
      helperText="Ocupa todo el ancho disponible"
      text="Archivo completo"
      fullWidth
      size="lg"
    />
  </div>
);

SystemStandardStates.parameters = {
  docs: {
    description: {
      story: 'Estados estándar del sistema: Normal, Required, Loading (con spinner), Disabled, Error, FullWidth. Todos con iconos automáticos.'
    }
  }
};

// ===== TAMAÑOS =====

export const Sizes = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'var(--space-lg)',
    maxWidth: '600px'
  }}>
    <FileInputField
      label="Extra pequeño (XS)"
      helperText="Tamaño mínimo"
      size="xs"
      text="Archivo XS"
    />
    
    <FileInputField
      label="Pequeño (SM)"
      helperText="Tamaño pequeño"
      size="sm"
      text="Archivo SM"
    />
    
    <FileInputField
      label="Mediano (MD)"
      helperText="Tamaño por defecto"
      size="md"
      text="Archivo MD"
    />
    
    <FileInputField
      label="Grande (LG)"
      helperText="Tamaño grande"
      size="lg"
      text="Archivo LG"
    />
    
    <FileInputField
      label="Extra grande (XL)"
      helperText="Tamaño máximo"
      size="xl"
      text="Archivo XL"
    />
  </div>
);

// ===== BACKWARD COMPATIBILITY DEMO =====

export const BackwardCompatibilityDemo = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'var(--space-lg)',
    maxWidth: '900px'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
        Legacy: variant="default"
      </h4>
      <FileInputField 
        label="Archivo legacy" 
        variant="default" 
        text="Auto-mapping a primary" 
        helperText="Mapeo automático legacy → estándar"
      />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Auto-mapped to primary)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
        New: variant="primary"
      </h4>
      <FileInputField 
        label="Archivo estándar" 
        variant="primary" 
        text="Estándar primary" 
        helperText="Sistema de diseño estándar"
      />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Standard primary)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
        Legacy: variant="error"
      </h4>
      <FileInputField 
        label="Error legacy" 
        variant="error" 
        text="Auto-mapping a danger" 
        helperText="Mapeo automático error → danger"
      />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Auto-mapped to danger)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
        New: variant="danger"
      </h4>
      <FileInputField 
        label="Error estándar" 
        variant="danger" 
        text="Estándar danger" 
        helperText="Sistema de diseño estándar"
      />
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Standard danger)
      </small>
    </div>
  </div>
);

BackwardCompatibilityDemo.parameters = {
  docs: {
    description: {
      story: 'Demostración de backward compatibility. Las variantes legacy se mapean automáticamente: "default" → "primary", "error" → "danger". Sin breaking changes en el código existente.'
    }
  }
};

// ===== TIPOS DE ARCHIVO =====

export const FileTypes = () => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'var(--space-lg)',
    maxWidth: '900px'
  }}>
    <FileInputField
      label="Solo imágenes"
      accept="image/*"
      helperText="JPG, PNG, GIF, WebP"
      text="Seleccionar imagen"
    />
    
    <FileInputField
      label="Solo videos"
      accept="video/*"
      helperText="MP4, WebM, AVI, MOV"
      text="Seleccionar video"
    />
    
    <FileInputField
      label="Documentos"
      accept=".pdf,.doc,.docx,.txt"
      helperText="PDF, Word, Texto"
      text="Seleccionar documento"
    />
    
    <FileInputField
      label="Múltiples archivos"
      accept="image/*"
      multiple
      helperText="Selecciona varias imágenes"
      text="Seleccionar imágenes"
    />
  </div>
);

// ===== EJEMPLO COMPLETO FUNCIONAL =====

export const CompleteExample = () => {
  const [formData, setFormData] = useState({
    profilePhoto: null,
    documents: [],
    resume: null
  });
  
  const [errors, setErrors] = useState({});
  
  const handleFileChange = (fieldName) => (event) => {
    const files = Array.from(event.target.files || []);
    const value = event.target.multiple ? files : files[0] || null;
    
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
    
    const newErrors = {};
    
    // Validaciones
    if (!formData.profilePhoto) {
      newErrors.profilePhoto = 'La foto de perfil es obligatoria';
    }
    
    if (!formData.resume) {
      newErrors.resume = 'El currículum es obligatorio';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {

      alert('¡Formulario enviado correctamente!');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '600px',
      padding: 'var(--space-xl)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)'
    }}>
      <h3 style={{ 
        margin: '0 0 var(--space-xl) 0',
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-xl)'
      }}>
        📋 Perfil de Usuario
      </h3>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-lg)' 
      }}>
        <FileInputField
          label="Foto de perfil"
          accept="image/*"
          required
          text="Subir foto"
          helperText="JPG, PNG (máx. 2MB)"
          errorText={errors.profilePhoto}
          variant={errors.profilePhoto ? 'danger' : formData.profilePhoto ? 'success' : 'primary'}
          onChange={handleFileChange('profilePhoto')}
        />
        
        <FileInputField
          label="Documentos adicionales"
          accept=".pdf,.doc,.docx"
          multiple
          text="Seleccionar documentos"
          helperText="PDF, Word (opcional)"
          onChange={handleFileChange('documents')}
        />
        
        <FileInputField
          label="Currículum Vitae"
          accept=".pdf"
          required
          text="Subir CV"
          helperText="Solo archivos PDF"
          errorText={errors.resume}
          variant={errors.resume ? 'danger' : formData.resume ? 'success' : 'primary'}
          onChange={handleFileChange('resume')}
        />
        
        <button
          type="submit"
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--text-on-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
            marginTop: 'var(--space-md)'
          }}
        >
          📤 Enviar Perfil
        </button>
      </div>
      
      {/* Preview de archivos seleccionados */}
      {(formData.profilePhoto || formData.documents.length > 0 || formData.resume) && (
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
            fontSize: 'var(--font-size-lg)'
          }}>
            📎 Archivos seleccionados
          </h4>
          
          {formData.profilePhoto && (
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>📸 Foto:</strong> {formData.profilePhoto.name} 
              ({(formData.profilePhoto.size / 1024).toFixed(1)} KB)
            </div>
          )}
          
          {formData.documents.length > 0 && (
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <strong>📄 Documentos:</strong> {formData.documents.length} archivo(s)
              <ul style={{ margin: '0.5rem 0', paddingLeft: '2rem' }}>
                {formData.documents.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          {formData.resume && (
            <div>
              <strong>📋 CV:</strong> {formData.resume.name} 
              ({(formData.resume.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      )}
    </form>
  );
};

CompleteExample.parameters = {
  docs: {
    description: {
      story: 'Ejemplo completo de formulario con validación, múltiples tipos de archivo y preview funcional.'
    }
  }
};