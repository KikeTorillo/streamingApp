// molecules/ToastContainer/ToastContainer.stories.jsx
import { useState } from 'react';
import { ToastContainer } from './ToastContainer';
import { Button } from '../atoms/Button/Button';

export default {
  title: 'Components/Molecules/ToastContainer',
  component: ToastContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ToastContainer Molecule

Contenedor para gestionar múltiples toasts **migrado al sistema estándar**.

## 🎯 Características del Sistema Estándar

- **✅ Props Estándar**: size, variant, rounded, loading, disabled
- **✅ Toast Migrado**: Usa Toast del sistema estándar como base
- **✅ Tokens Automáticos**: Spacing, colores, y tamaños del design system
- **✅ Backward Compatibility**: Mapeo gap→spacing con deprecation warnings
- **✅ Estados Avanzados**: Loading/disabled con overlays visuales
- **✅ Stacking**: Apila múltiples toasts correctamente
- **✅ Posicionamiento**: Esquinas de pantalla configurables
- **✅ Límites**: Control de máximo número de toasts
- **✅ Animaciones**: Entrada y salida coordinadas con sistema de tokens
- **✅ Responsive**: Adaptable a móviles con breakpoints estándar

## 🚀 Uso con useToast

\`\`\`jsx
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/molecules/ToastContainer/ToastContainer';

function App() {
  const { toasts, showSuccess, removeToast } = useToast();
  
  return (
    <div>
      <Button onClick={() => showSuccess('¡Éxito!')}>
        Mostrar Toast
      </Button>
      
      <ToastContainer
        toasts={toasts}
        position="top-right"
        onRemoveToast={removeToast}
      />
    </div>
  );
}
\`\`\`
        `
      }
    }
  },
  argTypes: {
    // Props estándar del sistema
    size: {
      name: 'Tamaño',
      description: 'Tamaño estándar aplicado a todos los toasts',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante semántica estándar por defecto',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'neutral'" }
      }
    },
    loading: {
      name: 'Cargando',
      description: 'Estado de carga con overlay',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita interacciones con toasts',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    spacing: {
      name: 'Espaciado',
      description: 'Espaciado entre toasts (sistema estándar)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'md'" }
      }
    },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Posición del contenedor'
    },
    maxToasts: {
      control: 'number',
      description: 'Máximo número de toasts visibles'
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Espaciado entre toasts'
    }
  }
};

// Hook simulado para las stories
function useSimulatedToasts() {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (type, message, options = {}) => {
    const newToast = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isOpen: true,
      type,
      message,
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      autoCloseDelay: options.autoCloseDelay || 4000,
      action: options.action || null,
      showCloseButton: true,
      onAutoClose: options.onAutoClose || null,
      createdAt: Date.now()
    };
    
    setToasts(prev => [newToast, ...prev].slice(0, 5));
    return newToast.id;
  };
  
  const removeToast = (toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };
  
  const clearToasts = () => {
    setToasts([]);
  };
  
  return {
    toasts,
    addToast,
    removeToast,
    clearToasts
  };
}

// Historia base interactiva
export const Playground = {
  args: {
    position: 'top-right',
    maxToasts: 5,
    gap: 'md'
  },
  render: (args) => {
    const { toasts, addToast, removeToast, clearToasts } = useSimulatedToasts();
    
    return (
      <div style={{ 
        padding: '20px', 
        minHeight: '100vh',
        background: 'var(--color-background-secondary)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <Button 
            variant="primary"
            onClick={() => addToast('success', '¡Operación exitosa!')}
          >
            Success Toast
          </Button>
          
          <Button 
            variant="danger"
            onClick={() => addToast('error', 'Error al procesar la solicitud')}
          >
            Error Toast
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => addToast('info', 'Información importante para el usuario')}
          >
            Info Toast
          </Button>
          
          <Button 
            variant="warning"
            onClick={() => addToast('warning', 'Esta acción requiere confirmación')}
          >
            Warning Toast
          </Button>
          
          <Button 
            variant="outline"
            onClick={clearToasts}
          >
            Limpiar Todos
          </Button>
        </div>
        
        <p>Toasts activos: {toasts.length}</p>
        
        <ToastContainer
          {...args}
          toasts={toasts}
          onRemoveToast={removeToast}
        />
      </div>
    );
  }
};

// Múltiples toasts
export const MultipleToasts = {
  render: () => {
    const { toasts, addToast, removeToast } = useSimulatedToasts();
    
    const addMultipleToasts = () => {
      const messages = [
        { type: 'success', message: 'Categoría creada exitosamente' },
        { type: 'info', message: 'Configuración actualizada' },
        { type: 'warning', message: 'Revisa la configuración de usuario' },
        { type: 'error', message: 'Error en la conexión' }
      ];
      
      messages.forEach((msg, index) => {
        setTimeout(() => {
          addToast(msg.type, msg.message);
        }, index * 500);
      });
    };
    
    return (
      <div style={{ 
        padding: '20px', 
        minHeight: '100vh',
        background: 'var(--color-background-secondary)'
      }}>
        <Button 
          variant="primary"
          onClick={addMultipleToasts}
        >
          Agregar Múltiples Toasts
        </Button>
        
        <ToastContainer
          toasts={toasts}
          position="top-right"
          onRemoveToast={removeToast}
        />
      </div>
    );
  }
};

// Diferentes posiciones
export const Positions = {
  render: () => {
    const { toasts, addToast, removeToast } = useSimulatedToasts();
    const [currentPosition, setCurrentPosition] = useState('top-right');
    
    const positions = [
      { key: 'top-right', label: 'Top Right' },
      { key: 'top-left', label: 'Top Left' },
      { key: 'bottom-right', label: 'Bottom Right' },
      { key: 'bottom-left', label: 'Bottom Left' }
    ];
    
    return (
      <div style={{ 
        padding: '20px', 
        minHeight: '100vh',
        background: 'var(--color-background-secondary)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3>Posición actual: {currentPosition}</h3>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {positions.map(pos => (
              <Button 
                key={pos.key}
                variant={currentPosition === pos.key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCurrentPosition(pos.key)}
              >
                {pos.label}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="primary"
            onClick={() => addToast('success', `Toast en posición ${currentPosition}`)}
          >
            Agregar Toast
          </Button>
        </div>
        
        <ToastContainer
          toasts={toasts}
          position={currentPosition}
          onRemoveToast={removeToast}
        />
      </div>
    );
  }
};

// ========== SISTEMA ESTÁNDAR - NUEVAS STORIES ==========

// Sistema estándar - Tamaños
export const SystemStandardSizes = {
  render: () => {
    const { toasts, addToast, removeToast } = useSimulatedToasts();
    
    const addSizeToast = (size) => {
      addToast('success', `Toast tamaño ${size}`, { size });
    };
    
    return (
      <div style={{ 
        padding: '20px', 
        minHeight: '100vh',
        background: 'var(--color-background-secondary)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
            <Button 
              key={size}
              size={size}
              onClick={() => addSizeToast(size)}
            >
              {size.toUpperCase()}
            </Button>
          ))}
        </div>
        
        <ToastContainer
          toasts={toasts}
          position="top-right"
          onRemoveToast={removeToast}
        />
      </div>
    );
  }
};

// Sistema estándar - Estados
export const SystemStandardStates = {
  render: () => {
    const { toasts, addToast, removeToast } = useSimulatedToasts();
    
    return (
      <div style={{ 
        padding: '20px', 
        minHeight: '100vh',
        background: 'var(--color-background-secondary)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Button onClick={() => addToast('success', 'Estado Normal')}>
            Normal
          </Button>
          <Button onClick={() => addToast('success', 'Estado Loading', { loading: true })}>
            Con Loading
          </Button>
          <Button onClick={() => addToast('warning', 'Estado Disabled', { disabled: true })}>
            Disabled
          </Button>
        </div>
        
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Container normal */}
          <ToastContainer
            toasts={toasts}
            position="top-right"
            onRemoveToast={removeToast}
          />
          
          {/* Container loading */}
          <ToastContainer
            toasts={toasts.filter(t => t.loading)}
            position="top-left"
            loading={true}
            onRemoveToast={removeToast}
          />
          
          {/* Container disabled */}
          <ToastContainer
            toasts={toasts.filter(t => t.disabled)}
            position="bottom-right"
            disabled={true}
            onRemoveToast={removeToast}
          />
        </div>
      </div>
    );
  }
};

// Backward Compatibility
export const BackwardCompatibility = {
  render: () => {
    const { toasts, addToast, removeToast } = useSimulatedToasts();
    
    return (
      <div style={{ 
        padding: '20px', 
        minHeight: '100vh',
        background: 'var(--color-background-secondary)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3>Propiedades Legacy con Deprecation Warnings</h3>
          <p>Abre la consola para ver los warnings</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Button onClick={() => addToast('success', 'Toast con type legacy')}>
            Type Legacy
          </Button>
        </div>
        
        {/* Usando prop gap legacy (deprecado) */}
        <ToastContainer
          toasts={toasts}
          position="top-right"
          gap="lg" // ⚠️ Deprecado - debe usar spacing
          onRemoveToast={removeToast}
        />
      </div>
    );
  }
};

// Con acciones
export const WithActions = {
  render: () => {
    const { toasts, addToast, removeToast } = useSimulatedToasts();
    
    const addActionToast = () => {
      addToast('success', 'Usuario creado exitosamente', {
        action: {
          text: 'Ver usuario',
        },
        autoClose: false
      });
    };
    
    const addRedirectToast = () => {
      addToast('success', 'Categoría eliminada', {
        autoClose: true,
        autoCloseDelay: 2500,
      });
    };
    
    return (
      <div style={{ 
        padding: '20px', 
        minHeight: '100vh',
        background: 'var(--color-background-secondary)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Button 
            variant="primary"
            onClick={addActionToast}
          >
            Toast con Botón
          </Button>
          
          <Button 
            variant="primary"
            onClick={addRedirectToast}
          >
            Toast con Auto-redirect
          </Button>
        </div>
        
        <ToastContainer
          toasts={toasts}
          position="top-right"
          onRemoveToast={removeToast}
        />
      </div>
    );
  }
};