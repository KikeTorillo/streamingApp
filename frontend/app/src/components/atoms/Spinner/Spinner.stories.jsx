import { useState } from 'react';
import { Spinner } from './Spinner';

export default {
  title: 'Components/Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Spinner Atom

El átomo **Spinner** proporciona indicadores de carga elegantes y versátiles para operaciones rápidas como subida de imágenes.

## 🎯 Características principales

- **4 variantes**: circle, dots, pulse, bars
- **3 tamaños**: sm, md, lg
- **4 colores**: primary, secondary, success, danger
- **Overlay opcional**: Para bloquear la interfaz durante cargas
- **CSS externo**: Estilos organizados en archivo separado
- **Funcionalidad completa**: Inline y overlay modes

## 🔧 Uso básico

\`\`\`jsx
import { Spinner } from './atoms/Spinner';

// Spinner simple inline
<Spinner variant="circle" size="md" color="primary" />

// Con mensaje
<Spinner 
  variant="dots" 
  message="Subiendo imagen..." 
/>

// Overlay completo (bloquea UI)
<Spinner 
  variant="circle" 
  size="lg"
  overlay={true} 
  message="Creando serie..." 
/>
\`\`\`

## 💡 Casos de uso

- **Series**: Spinner overlay durante subida de imagen de portada
- **Formularios**: Loading states en envío de datos
- **Listas**: Carga de contenido
- **Operaciones rápidas**: Procesos que no requieren progreso detallado
        `
      }
    }
  },
  argTypes: {
    variant: {
      name: 'Variante',
      description: 'Tipo de animación del spinner',
      control: 'select',
      options: ['circle', 'dots', 'pulse', 'bars'],
      table: { 
        type: { summary: "'circle' | 'dots' | 'pulse' | 'bars'" },
        defaultValue: { summary: 'circle' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del spinner',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { 
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' }
      }
    },
    color: {
      name: 'Color',
      description: 'Color del spinner',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger'],
      table: { 
        type: { summary: "'primary' | 'secondary' | 'success' | 'danger'" },
        defaultValue: { summary: 'primary' }
      }
    },
    message: {
      name: 'Mensaje',
      description: 'Texto descriptivo opcional',
      control: 'text',
      table: { 
        type: { summary: 'string' },
        defaultValue: { summary: 'Cargando...' }
      }
    },
    overlay: {
      name: 'Overlay',
      description: 'Si debe mostrar overlay de fondo',
      control: 'boolean',
      table: { 
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    className: {
      name: 'Clase CSS',
      description: 'Clases CSS adicionales',
      control: 'text',
      table: { 
        type: { summary: 'string' }
      }
    }
  }
};

// ========== 1. DEFAULT ==========
export const Default = {
  args: {
    variant: 'circle',
    size: 'md',
    color: 'primary',
    message: 'Cargando...'
  }
};

// ========== 2. VARIANTS ==========
export const Variants = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '2rem',
    padding: '1rem',
    textAlign: 'center'
  }}>
    {['circle', 'dots', 'pulse', 'bars'].map((variant) => (
      <div key={variant} style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '2rem',
        backgroundColor: '#f9fafb'
      }}>
        <h4 style={{ 
          margin: '0 0 1rem 0',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#374151',
          textTransform: 'capitalize'
        }}>
          {variant}
        </h4>
        <Spinner variant={variant} size="lg" color="primary" />
      </div>
    ))}
  </div>
);
Variants.parameters = {
  docs: { 
    description: { 
      story: 'Las 4 variantes disponibles: circle, dots, pulse, bars.' 
    } 
  }
};

// ========== 3. SIZES ==========
export const Sizes = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    padding: '1rem',
    textAlign: 'center',
    alignItems: 'center'
  }}>
    {['sm', 'md', 'lg'].map((size) => (
      <div key={size} style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: '#f9fafb'
      }}>
        <h4 style={{ 
          margin: '0 0 1rem 0',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#6b7280',
          textTransform: 'uppercase'
        }}>
          {size}
        </h4>
        <Spinner variant="circle" size={size} color="primary" />
      </div>
    ))}
  </div>
);
Sizes.parameters = {
  docs: { 
    description: { 
      story: 'Los 3 tamaños disponibles: sm, md, lg.' 
    } 
  }
};

// ========== 4. COLORS ==========
export const Colors = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1.5rem',
    padding: '1rem',
    textAlign: 'center'
  }}>
    {[
      { color: 'primary', label: 'Primary' },
      { color: 'secondary', label: 'Secondary' },
      { color: 'success', label: 'Success' },
      { color: 'danger', label: 'Danger' }
    ].map((item) => (
      <div key={item.color} style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: '#f9fafb'
      }}>
        <h4 style={{ 
          margin: '0 0 1rem 0',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#6b7280'
        }}>
          {item.label}
        </h4>
        <Spinner variant="circle" size="md" color={item.color} />
      </div>
    ))}
  </div>
);
Colors.parameters = {
  docs: { 
    description: { 
      story: 'Los 4 colores disponibles siguiendo el sistema de diseño.' 
    } 
  }
};

// ========== 5. WITH MESSAGE ==========
export const WithMessage = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    padding: '1rem',
    textAlign: 'center'
  }}>
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '2rem',
      backgroundColor: '#f9fafb'
    }}>
      <Spinner 
        variant="dots" 
        size="md" 
        color="primary" 
        message="Subiendo imagen..." 
      />
    </div>
    
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '2rem',
      backgroundColor: '#f9fafb'
    }}>
      <Spinner 
        variant="circle" 
        size="lg" 
        color="success" 
        message="Creando serie..." 
      />
    </div>
    
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '2rem',
      backgroundColor: '#f9fafb'
    }}>
      <Spinner 
        variant="pulse" 
        size="md" 
        color="secondary" 
        message="Procesando datos..." 
      />
    </div>
  </div>
);
WithMessage.parameters = {
  docs: { 
    description: { 
      story: 'Spinners con mensajes descriptivos para contexto adicional.' 
    } 
  }
};

// ========== 6. OVERLAY DEMO ==========
export const OverlayDemo = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  
  const handleShowOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  return (
    <div style={{ 
      padding: '2rem',
      textAlign: 'center'
    }}>
      <button 
        onClick={handleShowOverlay}
        disabled={showOverlay}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: showOverlay ? '#6b7280' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: showOverlay ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}
      >
        {showOverlay ? 'Mostrando overlay...' : '🎭 Mostrar Overlay'}
      </button>
      
      <p style={{
        margin: '1rem 0',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        El overlay se mostrará por 3 segundos y luego desaparecerá automáticamente.
      </p>

      {showOverlay && (
        <Spinner 
          variant="circle" 
          size="lg" 
          color="primary" 
          message="Subiendo imagen de portada..."
          overlay={true}
        />
      )}
    </div>
  );
};
OverlayDemo.parameters = {
  docs: { 
    description: { 
      story: 'Demostración del overlay que bloquea toda la interfaz durante el proceso.' 
    } 
  }
};

// ========== 7. SERIES USE CASE ==========
export const SeriesUseCase = () => (
  <div style={{
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem'
  }}>
    <h3 style={{
      margin: '0 0 2rem 0',
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#111827',
      textAlign: 'center'
    }}>
      🎬 Caso de Uso: Creación de Series
    </h3>
    
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '2rem',
      backgroundColor: '#f9fafb',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Spinner 
          variant="circle" 
          size="lg" 
          color="primary" 
          message="Subiendo imagen de portada..." 
        />
      </div>
      
      <div style={{
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#374151',
        lineHeight: '1.6'
      }}>
        <strong>💡 Perfecto para Series:</strong><br />
        Las series solo suben imagen de portada (proceso rápido), 
        por lo que un spinner overlay es más apropiado que un modal de progreso completo.
        El overlay bloquea la interfaz evitando acciones duplicadas.
      </div>
    </div>
  </div>
);
SeriesUseCase.parameters = {
  docs: { 
    description: { 
      story: 'Ejemplo específico de cómo usar el Spinner en la creación de series.' 
    } 
  }
};