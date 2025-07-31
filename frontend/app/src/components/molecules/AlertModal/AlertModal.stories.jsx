// ===== ALERT MODAL MOLECULE STORIES =====
// src/components/molecules/AlertModal/AlertModal.stories.jsx

import { useState } from 'react';
import { AlertModal } from './AlertModal';
import { Button } from '../../atoms/Button/Button';

export default {
  title: 'Components/Molecules/AlertModal',
  component: AlertModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# AlertModal Molecule

Componente para reemplazar \`alert()\` nativo con mejor UX usando nuestro Modal.

## 🎯 Características

- **✅ Migración**: Reemplaza \`alert()\` con mejor UX
- **✅ Tipos**: info, success, error, confirm
- **✅ Consistencia**: Basado en Modal existente
- **✅ Responsive**: Adaptable a móviles
- **✅ Accesibilidad**: Hereda de Modal

## 🚀 Uso básico

\`\`\`jsx
// Reemplazar esto:
alert('¡Operación exitosa!');

// Por esto:
<AlertModal
  isOpen={showAlert}
  onClose={() => setShowAlert(false)}
  type="success"
  message="¡Operación exitosa!"
/>
\`\`\`

## 🔧 Tipos disponibles

- **info**: Información general (azul)
- **success**: Operación exitosa (verde)  
- **error**: Error o problema (rojo)
- **confirm**: Confirmación con botones (azul)
        `
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'error', 'confirm'],
      description: 'Tipo de alerta'
    },
    message: {
      control: 'text',
      description: 'Mensaje principal'
    },
    title: {
      control: 'text',
      description: 'Título personalizado (opcional)'
    }
  }
};

// Historia base interactiva
export const Playground = {
  args: {
    type: 'info',
    message: 'Este es un mensaje de información',
    title: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Mostrar AlertModal
        </Button>
        
        <AlertModal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {

            setIsOpen(false);
          }}
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
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Mostrar Info
        </Button>
        
        <AlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type="info"
          message="Esta es información importante para el usuario"
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
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Mostrar Éxito
        </Button>
        
        <AlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type="success"
          message="¡La operación se completó exitosamente!"
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
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Mostrar Error
        </Button>
        
        <AlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type="error"
          message="Ha ocurrido un error. Por favor, intenta de nuevo."
        />
      </div>
    );
  }
};

// Confirmación
export const Confirm = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Mostrar Confirmación
        </Button>
        
        <AlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type="confirm"
          message="¿Estás seguro de que quieres continuar?"
          onConfirm={() => {

            setIsOpen(false);
          }}
        />
      </div>
    );
  }
};

// Ejemplo de migración
export const MigrationExample = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOldWay = () => {
      alert('¡Operación exitosa!'); // ❌ Forma antigua
    };
    
    const handleNewWay = () => {
      setIsOpen(true); // ✅ Forma nueva
    };
    
    return (
      <div style={{ padding: '20px', display: 'flex', gap: '1rem' }}>
        <Button variant="outline" onClick={handleOldWay}>
          ❌ Forma antigua (alert)
        </Button>
        
        <Button variant="primary" onClick={handleNewWay}>
          ✅ Forma nueva (AlertModal)
        </Button>
        
        <AlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type="success"
          message="¡Operación exitosa!"
        />
      </div>
    );
  }
};