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
# Toast Atom

Componente de notificación flotante para mostrar mensajes de éxito, error, información o advertencia.

## 🎯 Características

- **✅ Tipos**: success, error, info, warning
- **✅ Auto-dismiss**: Desaparece automáticamente
- **✅ Acciones**: Botón opcional para redirecciones
- **✅ Posicionamiento**: Fixed, no afecta el layout
- **✅ Animaciones**: Entrada y salida suaves
- **✅ Responsive**: Adaptable a móviles

## 🚀 Uso básico

\`\`\`jsx
<Toast
  isOpen={true}
  type="success"
  message="¡Operación completada exitosamente!"
  onClose={() => console.log('Toast cerrado')}
/>
\`\`\`

## 🔧 Casos de uso

- **Success**: Confirmación de acciones exitosas
- **Error**: Notificación de errores
- **Info**: Información general
- **Warning**: Advertencias importantes
        `
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
      description: 'Tipo de toast'
    },
    message: {
      control: 'text',
      description: 'Mensaje principal'
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
    }
  }
};

// Historia base interactiva
export const Playground = {
  args: {
    type: 'success',
    message: 'Esta es una notificación de ejemplo',
    title: '',
    autoClose: true,
    autoCloseDelay: 4000,
    showCloseButton: true,
    position: 'top-right'
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
          type="success"
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
          type="error"
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
          type="info"
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
          type="warning"
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
          type="success"
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
          type="success"
          message="Usuario creado exitosamente"
          autoClose={false}
          action={{
            text: "Ver usuario",
            onClick: () => {
              console.log('Navegando a usuario...');
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
            type="info"
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