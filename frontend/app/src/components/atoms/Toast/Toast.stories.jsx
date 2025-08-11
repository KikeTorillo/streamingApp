// ===== TOAST ATOM STORIES =====
// src/components/atoms/Toast/Toast.stories.jsx

import { useState } from 'react';
import { Toast } from './Toast';
import { Button } from '../Button/Button';

export default {
  title: 'Components/Atoms/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Toast Atom - Sistema de Diseño Estándar

Componente de notificación flotante completamente integrado con el sistema de diseño estándar.

## 🎯 Características

- **✅ 6 Variantes Semánticas**: primary, secondary, success, danger, warning, neutral
- **✅ 5 Tamaños**: xs, sm, md, lg, xl con tokens automáticos
- **✅ Props Estándar**: Consistente con Button, Badge, Card, etc.
- **✅ Iconos Feather**: Sistema unificado con renderizado automático
- **✅ Auto-dismiss**: Desaparece automáticamente
- **✅ Estados**: disabled, loading con overlays visuales
- **✅ Backward Compatibility**: Soporte para props legacy con warnings

## 🚀 Uso básico

\`\`\`jsx
<Toast
  isOpen={true}
  variant="success"
  size="md"
  message="¡Operación completada exitosamente!"
/>
\`\`\`

## 🔧 Casos de uso

- **Success**: Confirmación de acciones exitosas  
- **Danger**: Notificación de errores
- **Primary**: Información general
- **Warning**: Advertencias importantes
- **Secondary**: Notificaciones secundarias
- **Neutral**: Información neutra
        `
      }
    }
  },
  argTypes: {
    // Props estándar del sistema
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del toast'
    },
    variant: {
      control: 'select', 
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'neutral'],
      description: 'Variante semántica'
    },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'], 
      description: 'Radio de bordes'
    },
    disabled: {
      control: 'boolean',
      description: 'Toast deshabilitado'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga'
    },
    
    // Props específicas de Toast
    message: {
      control: 'text',
      description: 'Mensaje principal (requerido)'
    },
    title: {
      control: 'text',
      description: 'Título opcional'
    },
    autoClose: {
      control: 'boolean',
      description: 'Auto-cerrar después de un tiempo'
    },
    autoCloseDelay: {
      control: 'number',
      description: 'Tiempo en ms para auto-cerrar'
    },
    
    // Props legacy (deprecated)
    type: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
      description: '⚠️ DEPRECADO: Usar variant'
    }
  }
};

// Historia base interactiva con sistema estándar
export const Playground = {
  args: {
    variant: 'success',
    size: 'md',
    rounded: 'md',
    message: 'Esta es una notificación de ejemplo con sistema estándar',
    title: '',
    autoClose: true,
    autoCloseDelay: 4000,
    showCloseButton: true,
    position: 'top-right',
    disabled: false,
    loading: false
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px', position: 'relative', height: '200px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Mostrar Toast
        </Button>
        
        <Toast
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  }
};

// Éxito
export const Success = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px', position: 'relative', height: '200px' }}>
        <Button 
          variant="primary" 
          onClick={() => setIsOpen(true)}
        >
          Mostrar Éxito
        </Button>
        
        <Toast
          isOpen={isOpen}
          variant="success"
          message="¡Categoría eliminada exitosamente!"
          autoClose={true}
          autoCloseDelay={3000}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  }
};

// Error
export const Error = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px', position: 'relative', height: '200px' }}>
        <Button 
          variant="danger" 
          onClick={() => setIsOpen(true)}
        >
          Mostrar Error
        </Button>
        
        <Toast
          isOpen={isOpen}
          variant="danger"
          message="Error al eliminar la categoría. Por favor, intenta de nuevo."
          autoClose={false}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  }
};

// Información
export const Info = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px', position: 'relative', height: '200px' }}>
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(true)}
        >
          Mostrar Info
        </Button>
        
        <Toast
          isOpen={isOpen}
          variant="primary"
          message="La categoría ha sido actualizada en el sistema."
          autoClose={true}
          autoCloseDelay={4000}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  }
};

// Advertencia
export const Warning = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px', position: 'relative', height: '200px' }}>
        <Button 
          variant="warning" 
          onClick={() => setIsOpen(true)}
        >
          Mostrar Advertencia
        </Button>
        
        <Toast
          isOpen={isOpen}
          variant="warning"
          message="Esta acción no se puede deshacer. ¿Estás seguro?"
          autoClose={true}
          autoCloseDelay={5000}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  }
};

// Con título
export const WithTitle = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px', position: 'relative', height: '200px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Toast con Título
        </Button>
        
        <Toast
          isOpen={isOpen}
          variant="success"
          title="Operación Exitosa"
          message="La categoría 'Acción' ha sido eliminada correctamente del sistema."
          autoClose={true}
          autoCloseDelay={4000}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  }
};

// Con acción
export const WithAction = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px', position: 'relative', height: '200px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Toast con Acción
        </Button>
        
        <Toast
          isOpen={isOpen}
          variant="success"
          message="Usuario creado exitosamente"
          autoClose={false}
          action={{
            text: "Ver usuario",
            onClick: () => {

              setIsOpen(false);
            }
          }}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  }
};

// Diferentes posiciones
export const Positions = {
  render: () => {
    const [position, setPosition] = useState(null);
    
    const positions = [
      { key: 'top-right', label: 'Top Right' },
      { key: 'top-left', label: 'Top Left' },
      { key: 'bottom-right', label: 'Bottom Right' },
      { key: 'bottom-left', label: 'Bottom Left' }
    ];
    
    return (
      <div style={{ 
        padding: '20px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '1rem',
        height: '200px'
      }}>
        {positions.map(pos => (
          <Button 
            key={pos.key}
            variant="outline"
            size="sm"
            onClick={() => setPosition(pos.key)}
          >
            {pos.label}
          </Button>
        ))}
        
        {position && (
          <Toast
            isOpen={true}
            variant="primary"
            message={`Toast en posición ${position}`}
            position={position}
            autoClose={true}
            autoCloseDelay={3000}
            onClose={() => setPosition(null)}
          />
        )}
      </div>
    );
  }
};

// ===== NUEVAS STORIES SISTEMA ESTÁNDAR =====

// Variantes semánticas estándar
export const SystemStandardVariants = {
  render: () => {
    const [openVariants, setOpenVariants] = useState({});
    
    const variants = [
      { key: 'primary', label: 'Primary', message: 'Información general del sistema' },
      { key: 'secondary', label: 'Secondary', message: 'Notificación secundaria' },
      { key: 'success', label: 'Success', message: '¡Operación completada exitosamente!' },
      { key: 'danger', label: 'Danger', message: 'Error crítico en el sistema' },
      { key: 'warning', label: 'Warning', message: 'Advertencia importante' },
      { key: 'neutral', label: 'Neutral', message: 'Información neutra' }
    ];
    
    return (
      <div style={{ 
        padding: '20px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '1rem',
        height: '300px'
      }}>
        {variants.map(variant => (
          <Button 
            key={variant.key}
            variant={variant.key}
            size="sm"
            onClick={() => setOpenVariants(prev => ({
              ...prev,
              [variant.key]: true
            }))}
          >
            {variant.label}
          </Button>
        ))}
        
        {variants.map(variant => 
          openVariants[variant.key] && (
            <Toast
              key={variant.key}
              isOpen={true}
              variant={variant.key}
              message={variant.message}
              position="top-right"
              autoClose={true}
              autoCloseDelay={3000}
              onClose={() => setOpenVariants(prev => ({
                ...prev,
                [variant.key]: false
              }))}
            />
          )
        )}
      </div>
    );
  }
};

// Tamaños estándar
export const SystemStandardSizes = {
  render: () => {
    const [openSizes, setOpenSizes] = useState({});
    
    const sizes = [
      { key: 'xs', label: 'Extra Small' },
      { key: 'sm', label: 'Small' },
      { key: 'md', label: 'Medium (Default)' },
      { key: 'lg', label: 'Large' },
      { key: 'xl', label: 'Extra Large' }
    ];
    
    return (
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        gap: '1rem',
        height: '200px',
        flexWrap: 'wrap'
      }}>
        {sizes.map(size => (
          <Button 
            key={size.key}
            size={size.key}
            onClick={() => setOpenSizes(prev => ({
              ...prev,
              [size.key]: true
            }))}
          >
            {size.label}
          </Button>
        ))}
        
        {sizes.map(size => 
          openSizes[size.key] && (
            <Toast
              key={size.key}
              isOpen={true}
              variant="primary"
              size={size.key}
              message={`Toast tamaño ${size.key.toUpperCase()}`}
              title={`Tamaño ${size.label}`}
              position="top-right"
              autoClose={true}
              autoCloseDelay={4000}
              onClose={() => setOpenSizes(prev => ({
                ...prev,
                [size.key]: false
              }))}
            />
          )
        )}
      </div>
    );
  }
};

// Estados estándar
export const SystemStandardStates = {
  render: () => {
    const [openStates, setOpenStates] = useState({});
    
    return (
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        gap: '1rem',
        height: '200px'
      }}>
        <Button 
          variant="neutral"
          onClick={() => setOpenStates(prev => ({ ...prev, disabled: true }))}
        >
          Toast Disabled
        </Button>
        
        <Button 
          variant="secondary"
          onClick={() => setOpenStates(prev => ({ ...prev, loading: true }))}
        >
          Toast Loading
        </Button>
        
        {openStates.disabled && (
          <Toast
            isOpen={true}
            variant="neutral"
            message="Toast en estado disabled"
            disabled={true}
            position="top-right"
            autoClose={true}
            autoCloseDelay={5000}
            onClose={() => setOpenStates(prev => ({ ...prev, disabled: false }))}
          />
        )}
        
        {openStates.loading && (
          <Toast
            isOpen={true}
            variant="secondary"
            message="Toast con estado loading"
            loading={true}
            position="top-left"
            autoClose={true}
            autoCloseDelay={5000}
            onClose={() => setOpenStates(prev => ({ ...prev, loading: false }))}
          />
        )}
      </div>
    );
  }
};

// Backward compatibility con deprecation warnings
export const BackwardCompatibility = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px', position: 'relative', height: '200px' }}>
        <Button 
          variant="warning"
          onClick={() => setIsOpen(true)}
        >
          Toast Legacy (type prop)
        </Button>
        <p style={{ 
          fontSize: '0.875rem', 
          color: '#666', 
          marginTop: '0.5rem' 
        }}>
          ⚠️ Abre la consola para ver deprecation warnings
        </p>
        
        <Toast
          isOpen={isOpen}
          type="success" // Prop legacy - generará warning
          message="Toast usando prop 'type' legacy (deprecated)"
          title="Backward Compatibility"
          autoClose={true}
          autoCloseDelay={4000}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  }
};