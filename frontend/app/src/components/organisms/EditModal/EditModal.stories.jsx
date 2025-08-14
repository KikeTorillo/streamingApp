// ===== EDIT MODAL STORIES - SISTEMA DE DISEÑO MIGRADO =====
// src/components/organisms/EditModal/EditModal.stories.jsx

import { useState } from 'react';
import { EditModal } from './EditModal';
import { Button } from '../../atoms/Button/Button';

/**
 * ✅ EDIT MODAL MIGRADO - Stories completas
 * 
 * Casos de uso reales:
 * - Estados estándar (size, variant, rounded, loading, disabled)
 * - Sistema de iconos automático
 * - Validación en tiempo real
 * - Backward compatibility
 * - Responsive design
 * - Estados loading/disabled con overlays
 */

export default {
  title: 'Organisms/EditModal',
  component: EditModal,
  parameters: {
    docs: {
      description: {
        component: 'Organismo EditModal migrado del sistema de diseño. Modal especializado para edición CRUD con props estándar, sistema de iconos automático y validación integrada.'
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del modal'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante semántica que determina colores e iconos automáticos'
    },
    rounded: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes'
    },
    leftIcon: {
      control: { type: 'text' },
      description: 'Icono izquierdo (Feather icon name)'
    },
    rightIcon: {
      control: { type: 'text' },
      description: 'Icono derecho (Feather icon name)'
    }
  }
};

// ===== TEMPLATE BASE =====
const Template = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentValue, setCurrentValue] = useState(args.initialValue || 'Valor inicial');

  const handleOpen = () => {
    setIsOpen(true);
    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setLoading(false);
  };

  const handleSave = async (newValue) => {
    setLoading(true);
    
    // Simular delay de guardado
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCurrentValue(newValue);
    setLoading(false);
    setIsOpen(false);
    console.log('✅ Valor guardado:', newValue);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '0.5rem' }}>
        <strong>Valor actual:</strong> {currentValue}
      </div>
      
      <Button variant="primary" onClick={handleOpen}>
        Abrir EditModal
      </Button>
      
      <EditModal
        {...args}
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        loading={loading}
        initialValue={currentValue}
      />
    </div>
  );
};

// ===== SISTEMA ESTÁNDAR - VARIANTES SEMÁNTICAS =====
export const SystemStandardVariants = Template.bind({});
SystemStandardVariants.args = {
  title: 'Editar Elemento',
  fieldLabel: 'Nombre del Elemento',
  fieldPlaceholder: 'Ingresa el nombre...',
  size: 'md',
  variant: 'primary',
  rounded: 'xl'
};
SystemStandardVariants.storyName = '🎨 Variantes Estándar';

// ===== VARIANTES INDIVIDUALES =====
export const VariantPrimary = Template.bind({});
VariantPrimary.args = {
  ...SystemStandardVariants.args,
  variant: 'primary',
  title: 'Editar (Primary)',
  fieldLabel: 'Elemento Principal'
};

export const VariantSecondary = Template.bind({});
VariantSecondary.args = {
  ...SystemStandardVariants.args,
  variant: 'secondary',
  title: 'Editar (Secondary)',
  fieldLabel: 'Elemento Secundario'
};

export const VariantSuccess = Template.bind({});
VariantSuccess.args = {
  ...SystemStandardVariants.args,
  variant: 'success',
  title: 'Confirmar Cambio',
  fieldLabel: 'Valor Confirmado'
};

export const VariantWarning = Template.bind({});
VariantWarning.args = {
  ...SystemStandardVariants.args,
  variant: 'warning',
  title: 'Editar con Precaución',
  fieldLabel: 'Valor Sensible'
};

export const VariantDanger = Template.bind({});
VariantDanger.args = {
  ...SystemStandardVariants.args,
  variant: 'danger',
  title: 'Editar Crítico',
  fieldLabel: 'Valor Crítico'
};

export const VariantNeutral = Template.bind({});
VariantNeutral.args = {
  ...SystemStandardVariants.args,
  variant: 'neutral',
  title: 'Editar (Neutro)',
  fieldLabel: 'Valor General'
};

// ===== TAMAÑOS ESTÁNDAR =====
export const SystemStandardSizes = () => {
  const [openModals, setOpenModals] = useState({});
  
  const toggleModal = (size) => {
    setOpenModals(prev => ({ ...prev, [size]: !prev[size] }));
  };

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Tamaños Estándar del Sistema</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {sizes.map(size => (
          <Button 
            key={size} 
            size={size} 
            variant="primary" 
            onClick={() => toggleModal(size)}
          >
            Modal {size.toUpperCase()}
          </Button>
        ))}
      </div>

      {sizes.map(size => (
        <EditModal
          key={size}
          isOpen={openModals[size] || false}
          onClose={() => toggleModal(size)}
          onSave={(value) => {
            console.log(`✅ ${size}:`, value);
            toggleModal(size);
          }}
          title={`Modal ${size.toUpperCase()}`}
          fieldLabel={`Campo ${size}`}
          size={size}
          variant="primary"
          initialValue={`Valor ${size}`}
        />
      ))}
    </div>
  );
};
SystemStandardSizes.storyName = '📏 Tamaños Estándar';

// ===== ESTADOS ESTÁNDAR =====
export const SystemStandardStates = () => {
  const [activeState, setActiveState] = useState(null);
  
  const states = [
    { key: 'loading', label: 'Loading', props: { loading: true } },
    { key: 'disabled', label: 'Disabled', props: { disabled: true } },
    { key: 'error', label: 'Con Error', props: { error: 'Error del servidor' } },
    { key: 'validation', label: 'Validación', props: { required: true, minLength: 10 } }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Estados Estándar del Sistema</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {states.map(state => (
          <Button 
            key={state.key}
            variant="primary" 
            onClick={() => setActiveState(state)}
          >
            {state.label}
          </Button>
        ))}
      </div>

      {activeState && (
        <EditModal
          isOpen={true}
          onClose={() => setActiveState(null)}
          onSave={(value) => {
            console.log(`✅ Estado ${activeState.label}:`, value);
            setActiveState(null);
          }}
          title={`Estado: ${activeState.label}`}
          fieldLabel="Campo de Prueba"
          initialValue="Valor de prueba"
          {...activeState.props}
        />
      )}
    </div>
  );
};
SystemStandardStates.storyName = '⚡ Estados Estándar';

// ===== SISTEMA DE ICONOS =====
export const SystemIconsIntegration = Template.bind({});
SystemIconsIntegration.args = {
  title: 'Modal con Iconos Personalizados',
  fieldLabel: 'Valor con Iconos',
  fieldPlaceholder: 'Escribe algo...',
  leftIcon: 'star',
  rightIcon: 'arrow-right',
  size: 'md',
  variant: 'primary'
};
SystemIconsIntegration.storyName = '🎯 Sistema de Iconos';

// ===== CASOS DE USO REALES =====
export const UseCaseUserName = Template.bind({});
UseCaseUserName.args = {
  title: 'Editar Nombre de Usuario',
  fieldLabel: 'Nombre de Usuario',
  fieldPlaceholder: 'Ingresa tu nombre...',
  fieldType: 'text',
  required: true,
  minLength: 3,
  maxLength: 50,
  variant: 'primary',
  initialValue: 'Juan Pérez'
};
UseCaseUserName.storyName = '👤 Caso: Nombre Usuario';

export const UseCaseCategoryName = Template.bind({});
UseCaseCategoryName.args = {
  title: 'Editar Categoría',
  fieldLabel: 'Nombre de la Categoría',
  fieldPlaceholder: 'Ej: Películas de Acción',
  fieldType: 'text',
  required: true,
  minLength: 2,
  maxLength: 100,
  variant: 'secondary',
  initialValue: 'Drama'
};
UseCaseCategoryName.storyName = '📂 Caso: Categoría';

export const UseCaseDescription = Template.bind({});
UseCaseDescription.args = {
  title: 'Editar Descripción',
  fieldLabel: 'Descripción',
  fieldPlaceholder: 'Escribe una descripción...',
  fieldType: 'textarea',
  required: false,
  maxLength: 500,
  variant: 'neutral',
  initialValue: 'Descripción existente del elemento'
};
UseCaseDescription.storyName = '📝 Caso: Descripción';

// ===== BACKWARD COMPATIBILITY =====
export const BackwardCompatibilityDemo = Template.bind({});
BackwardCompatibilityDemo.args = {
  // Props legacy que deben funcionar
  title: 'Modal Legacy',
  fieldLabel: 'Campo Legacy',
  icon: 'edit', // ✅ Mapeado automáticamente a leftIcon
  size: 'md',
  // ✅ No variant especificado = 'primary' por defecto
  loading: false,
  initialValue: 'Valor legacy'
};
BackwardCompatibilityDemo.storyName = '🔄 Backward Compatibility';

// ===== RESPONSIVE DESIGN =====
export const ResponsiveBehavior = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Comportamiento Responsive</h3>
      <p>Prueba redimensionando la ventana del navegador</p>
      
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Probar Responsive
      </Button>
      
      <EditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(value) => {
          console.log('✅ Responsive:', value);
          setIsOpen(false);
        }}
        title="Modal Responsive"
        fieldLabel="Campo que se adapta"
        fieldPlaceholder="Prueba en móvil..."
        variant="primary"
        initialValue="Valor responsive"
      />
    </div>
  );
};
ResponsiveBehavior.storyName = '📱 Responsive Design';