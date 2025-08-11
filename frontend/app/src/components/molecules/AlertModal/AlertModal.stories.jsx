// ===== ALERT MODAL MOLECULE STORIES - MIGRADO AL SISTEMA ESTÁNDAR =====
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
# AlertModal - Sistema Estándar

Componente para confirmaciones y alertas críticas usando el sistema de diseño estándar.

## ✅ Migrado al Sistema Estándar

- **Props estándar**: size, variant, rounded, loading, disabled
- **Design tokens**: Spacing, colores, tipografía automáticos
- **Sistema de iconos**: Feather icons automáticos por tipo
- **6 variantes**: primary, secondary, success, warning, danger, neutral
- **Accesibilidad**: ARIA completo, navegación por teclado
- **Responsive**: Mobile-first design

## 🎯 Casos de Uso

- **Confirmaciones críticas**: Delete operations, cambios importantes
- **Alertas de sistema**: Errores, éxitos, información
- **Permisos insuficientes**: Cuando el usuario no puede realizar acción

## 🚀 API Nueva (Sistema Estándar)

\`\`\`jsx
<AlertModal
  isOpen={true}
  type="delete"
  title="Confirmar eliminación"
  message="¿Eliminar este elemento?"
  size="sm"
  variant="danger" // Auto por type, o manual override
  onConfirm={() => handleDelete()}
  onClose={() => setShowModal(false)}
/>
\`\`\`

## 🔄 Backward Compatibility

La API legacy sigue funcionando con deprecation warnings automáticos.
        `
      }
    }
  },
  argTypes: {
    // ✅ Props estándar del sistema
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño estándar del modal'
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante semántica (auto por type si no se especifica)'
    },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes estándar'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de loading con spinner'
    },
    
    // ✅ Props específicas de AlertModal
    type: {
      control: 'select',
      options: ['info', 'success', 'error', 'confirm', 'delete', 'permission'],
      description: 'Tipo de alerta (determina icono y variante automática)'
    },
    message: {
      control: 'text',
      description: 'Mensaje principal de la alerta'
    },
    title: {
      control: 'text',
      description: 'Título personalizado (opcional, auto por type)'
    },
    confirmText: {
      control: 'text',
      description: 'Texto del botón confirmar'
    },
    cancelText: {
      control: 'text',
      description: 'Texto del botón cancelar'
    }
  }
};

// ✅ PLAYGROUND - Nueva API con props estándar
export const Playground = {
  args: {
    type: 'info',
    size: 'sm',
    variant: undefined, // Auto por type
    rounded: 'xl',
    disabled: false,
    loading: false,
    message: 'Este es un mensaje de información con la nueva API',
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
            console.log('Confirmado');
            setIsOpen(false);
          }}
        />
      </div>
    );
  }
};

// ✅ TIPOS DE ALERTA - Casos reales
export const AlertTypes = {
  render: () => {
    const [openModal, setOpenModal] = useState(null);
    
    const alerts = [
      { type: 'info', message: 'Información importante para el usuario' },
      { type: 'success', message: '¡La operación se completó exitosamente!' },
      { type: 'error', message: 'Ha ocurrido un error. Por favor, intenta de nuevo.' },
      { type: 'confirm', message: '¿Estás seguro de que quieres continuar?' },
      { type: 'delete', message: '¿Eliminar este elemento permanentemente?' },
      { type: 'permission', message: 'No tienes permisos para realizar esta acción' }
    ];
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {alerts.map((alert) => (
            <Button
              key={alert.type}
              variant={alert.type === 'delete' ? 'danger' : alert.type === 'success' ? 'success' : 'primary'}
              onClick={() => setOpenModal(alert.type)}
            >
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
            </Button>
          ))}
        </div>
        
        {alerts.map((alert) => (
          <AlertModal
            key={alert.type}
            isOpen={openModal === alert.type}
            onClose={() => setOpenModal(null)}
            type={alert.type}
            message={alert.message}
            onConfirm={() => {
              console.log(`${alert.type} confirmado`);
              setOpenModal(null);
            }}
          />
        ))}
      </div>
    );
  }
};

// ✅ TAMAÑOS ESTÁNDAR
export const StandardSizes = {
  render: () => {
    const [openSize, setOpenSize] = useState(null);
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {sizes.map((size) => (
            <Button
              key={size}
              size={size}
              onClick={() => setOpenSize(size)}
            >
              Size {size.toUpperCase()}
            </Button>
          ))}
        </div>
        
        {sizes.map((size) => (
          <AlertModal
            key={size}
            isOpen={openSize === size}
            onClose={() => setOpenSize(null)}
            type="confirm"
            size={size}
            title={`Modal tamaño ${size.toUpperCase()}`}
            message={`Este modal usa el tamaño estándar "${size}" del sistema de diseño.`}
            onConfirm={() => setOpenSize(null)}
          />
        ))}
      </div>
    );
  }
};

// ✅ ESTADOS ESTÁNDAR
export const StandardStates = {
  render: () => {
    const [openState, setOpenState] = useState(null);
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={() => setOpenState('normal')}>
            Normal
          </Button>
          <Button onClick={() => setOpenState('loading')}>
            Loading
          </Button>
          <Button onClick={() => setOpenState('disabled')}>
            Disabled
          </Button>
        </div>
        
        <AlertModal
          isOpen={openState === 'normal'}
          onClose={() => setOpenState(null)}
          type="confirm"
          message="Modal en estado normal con iconos Feather"
          onConfirm={() => setOpenState(null)}
        />
        
        <AlertModal
          isOpen={openState === 'loading'}
          onClose={() => setOpenState(null)}
          type="confirm"
          message="Modal con estado loading - botones deshabilitados"
          loading={true}
          onConfirm={() => setOpenState(null)}
        />
        
        <AlertModal
          isOpen={openState === 'disabled'}
          onClose={() => setOpenState(null)}
          type="confirm"
          message="Modal deshabilitado - toda la interfaz inactiva"
          disabled={true}
          onConfirm={() => setOpenState(null)}
        />
      </div>
    );
  }
};

// ✅ VARIANTES SEMÁNTICAS
export const SemanticVariants = {
  render: () => {
    const [openVariant, setOpenVariant] = useState(null);
    const variants = [
      { variant: 'primary', label: 'Primary' },
      { variant: 'secondary', label: 'Secondary' },
      { variant: 'success', label: 'Success' },
      { variant: 'warning', label: 'Warning' },
      { variant: 'danger', label: 'Danger' },
      { variant: 'neutral', label: 'Neutral' }
    ];
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
          {variants.map(({ variant, label }) => (
            <Button
              key={variant}
              variant={variant}
              onClick={() => setOpenVariant(variant)}
            >
              {label}
            </Button>
          ))}
        </div>
        
        {variants.map(({ variant }) => (
          <AlertModal
            key={variant}
            isOpen={openVariant === variant}
            onClose={() => setOpenVariant(null)}
            type="confirm"
            variant={variant}
            title={`Variante ${variant}`}
            message={`Modal usando la variante semántica "${variant}" del sistema.`}
            onConfirm={() => setOpenVariant(null)}
          />
        ))}
      </div>
    );
  }
};

// ✅ CASOS DE USO REALES
export const RealWorldExamples = {
  render: () => {
    const [activeExample, setActiveExample] = useState(null);
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', maxWidth: '300px' }}>
          <Button 
            variant="danger" 
            onClick={() => setActiveExample('deleteUser')}
          >
            Eliminar Usuario
          </Button>
          
          <Button 
            variant="warning" 
            onClick={() => setActiveExample('unsavedChanges')}
          >
            Cambios sin Guardar
          </Button>
          
          <Button 
            variant="success" 
            onClick={() => setActiveExample('uploadComplete')}
          >
            Upload Completado
          </Button>
          
          <Button 
            variant="danger" 
            onClick={() => setActiveExample('permissionDenied')}
          >
            Acceso Denegado
          </Button>
        </div>
        
        {/* Delete User */}
        <AlertModal
          isOpen={activeExample === 'deleteUser'}
          onClose={() => setActiveExample(null)}
          type="delete"
          title="Eliminar Usuario"
          message="¿Estás seguro de que deseas eliminar a <strong>Juan Pérez</strong>?<br><br>Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={() => {
            console.log('Usuario eliminado');
            setActiveExample(null);
          }}
        />
        
        {/* Unsaved Changes */}
        <AlertModal
          isOpen={activeExample === 'unsavedChanges'}
          onClose={() => setActiveExample(null)}
          type="confirm"
          variant="warning"
          title="Cambios sin Guardar"
          message="Tienes cambios sin guardar. ¿Deseas salir sin guardar?"
          confirmText="Salir sin Guardar"
          cancelText="Continuar Editando"
          onConfirm={() => {
            console.log('Salir sin guardar');
            setActiveExample(null);
          }}
        />
        
        {/* Upload Complete */}
        <AlertModal
          isOpen={activeExample === 'uploadComplete'}
          onClose={() => setActiveExample(null)}
          type="success"
          message="¡El archivo se subió correctamente!<br><br>Ya puedes verlo en tu biblioteca."
        />
        
        {/* Permission Denied */}
        <AlertModal
          isOpen={activeExample === 'permissionDenied'}
          onClose={() => setActiveExample(null)}
          type="permission"
          message="No tienes permisos suficientes para acceder a esta sección.<br><br>Contacta al administrador si necesitas acceso."
        />
      </div>
    );
  }
};

// ✅ BACKWARD COMPATIBILITY
export const BackwardCompatibility = {
  parameters: {
    docs: {
      description: {
        story: `
### Backward Compatibility

La migración mantiene 100% de compatibilidad con la API legacy. 
Las props antiguas se mapean automáticamente y muestran warnings informativos en desarrollo.

**API Legacy sigue funcionando:**
- Todas las props existentes funcionan igual
- Sin breaking changes en producción
- Deprecation warnings solo en desarrollo
- Migración gradual sin prisa
        `
      }
    }
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          API Legacy (con deprecation warnings)
        </Button>
        
        {/* Usando API legacy - sigue funcionando */}
        <AlertModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          type="info"
          message="Esta API legacy funciona perfectamente. Check la consola para ver deprecation warnings informativos."
          size="sm"
          // Props legacy que se mapean automáticamente
          className="custom-alert-class"
        />
      </div>
    );
  }
};