// ===== MODAL MOLECULE STORIES =====
// src/components/molecules/Modal/Modal.stories.jsx

import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../atoms/Button/Button';
import { TextInput } from '../TextInput/TextInput';

export default {
  title: 'Components/Molecules/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Modal Molecule

Componente base para modales usando la etiqueta \`<dialog>\` nativa. Proporciona funcionalidad completa de modal con accesibilidad automática.

## 🎯 Características

- **✅ HTML Semántico**: Usa \`<dialog>\` nativo
- **✅ Accesibilidad**: Focus trap, ESC key, ARIA automático
- **✅ Responsive**: Adaptable a diferentes tamaños
- **✅ Backdrop**: Con blur y animaciones
- **✅ Reutilizable**: Base para otros modales
- **✅ Customizable**: Tamaños, callbacks, estilos

## 🚀 Uso básico

\`\`\`jsx
import { Modal } from './molecules/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Modal
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Mi Modal"
        size="md"
      >
        <p>Contenido del modal</p>
      </Modal>
    </>
  );
}
\`\`\`

## 📐 Tamaños disponibles

- **sm**: 384px máximo
- **md**: 512px máximo (por defecto)
- **lg**: 768px máximo
- **xl**: 1024px máximo
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controla si el modal está abierto'
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del modal'
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante semántica del modal'
    },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes del modal'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de loading con spinner'
    },
    disabled: {
      control: 'boolean',
      description: 'Modal deshabilitado'
    },
    title: {
      control: 'text',
      description: 'Título del modal (opcional)'
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: 'Cerrar al hacer clic en el backdrop'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Cerrar con la tecla ESC'
    },
    onClose: {
      action: 'close',
      description: 'Función llamada al cerrar el modal'
    }
  }
};

// ===== TEMPLATE BASE =====
const Template = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Modal
      </Button>
      
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {args.children}
      </Modal>
    </div>
  );
};

// ===== HISTORIAS PRINCIPALES =====

export const Default = Template.bind({});
Default.args = {
  title: 'Modal por Defecto',
  size: 'md',
  closeOnBackdrop: true,
  closeOnEscape: true,
  children: (
    <div>
      <p>Este es el contenido del modal por defecto.</p>
      <p>Puedes cerrar este modal haciendo clic en el backdrop, presionando ESC, o usando el botón X.</p>
    </div>
  )
};

export const WithForm = Template.bind({});
WithForm.args = {
  title: 'Modal con Formulario',
  size: 'md',
  children: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <TextInput
        label="Nombre"
        placeholder="Ingresa tu nombre"
        required
      />
      <TextInput
        label="Email"
        type="email"
        placeholder="correo@ejemplo.com"
        required
      />
      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
        <Button variant="outline">Cancelar</Button>
        <Button variant="primary">Guardar</Button>
      </div>
    </div>
  )
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  title: 'Modal Pequeño',
  size: 'sm',
  children: (
    <div>
      <p>Este es un modal pequeño, ideal para confirmaciones o alertas.</p>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
        <Button variant="outline" size="sm">Cancelar</Button>
        <Button variant="primary" size="sm">Confirmar</Button>
      </div>
    </div>
  )
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  title: 'Modal Grande',
  size: 'lg',
  children: (
    <div>
      <p>Este es un modal grande que puede contener más contenido.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
        <TextInput label="Nombre" placeholder="Tu nombre" />
        <TextInput label="Apellido" placeholder="Tu apellido" />
        <TextInput label="Email" type="email" placeholder="correo@ejemplo.com" />
        <TextInput label="Teléfono" type="tel" placeholder="123-456-7890" />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-lg)' }}>
        <Button variant="outline">Cancelar</Button>
        <Button variant="primary">Guardar</Button>
      </div>
    </div>
  )
};

export const NoTitle = Template.bind({});
NoTitle.args = {
  size: 'md',
  children: (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-md)' }}>
        🎉
      </div>
      <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--text-primary)' }}>
        ¡Éxito!
      </h3>
      <p style={{ margin: '0 0 var(--space-lg) 0', color: 'var(--text-secondary)' }}>
        La operación se completó exitosamente.
      </p>
      <Button variant="primary">Continuar</Button>
    </div>
  )
};

export const NoBackdropClose = Template.bind({});
NoBackdropClose.args = {
  title: 'Modal sin Cierre por Backdrop',
  size: 'md',
  closeOnBackdrop: false,
  children: (
    <div>
      <p>Este modal NO se puede cerrar haciendo clic en el backdrop.</p>
      <p>Solo puedes cerrarlo con el botón X o la tecla ESC.</p>
    </div>
  )
};

export const NoEscapeClose = Template.bind({});
NoEscapeClose.args = {
  title: 'Modal sin Cierre por ESC',
  size: 'md',
  closeOnEscape: false,
  children: (
    <div>
      <p>Este modal NO se puede cerrar con la tecla ESC.</p>
      <p>Solo puedes cerrarlo con el botón X o haciendo clic en el backdrop.</p>
    </div>
  )
};

// ===== DEMO INTERACTIVO =====
export const InteractiveDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState('md');
  const [title, setTitle] = useState('Modal Interactivo');
  
  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '300px', marginBottom: 'var(--space-lg)' }}>
        <h3>Configuración del Modal</h3>
        
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 'var(--font-weight-medium)' }}>
            Tamaño:
          </label>
          <select 
            value={size} 
            onChange={(e) => setSize(e.target.value)}
            style={{ width: '100%', padding: 'var(--space-xs)' }}
          >
            <option value="sm">Pequeño</option>
            <option value="md">Mediano</option>
            <option value="lg">Grande</option>
            <option value="xl">Extra Grande</option>
          </select>
        </div>
        
        <TextInput
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del modal"
        />
        
        <Button onClick={() => setIsOpen(true)}>
          Abrir Modal ({size})
        </Button>
      </div>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        size={size}
      >
        <div>
          <p>Este es un modal de tamaño <strong>{size}</strong>.</p>
          <p>Puedes experimentar cambiando la configuración arriba.</p>
          <div style={{ marginTop: 'var(--space-md)' }}>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

InteractiveDemo.parameters = {
  docs: {
    description: {
      story: 'Demo interactivo donde puedes cambiar el tamaño y título del modal dinámicamente.'
    }
  }
};

// ===== NUEVAS STORIES: SISTEMA ESTÁNDAR =====

export const Variants = () => {
  const [openModal, setOpenModal] = useState(null);
  const variants = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'];
  
  return (
    <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
      {variants.map(variant => (
        <Button 
          key={variant} 
          variant={variant} 
          onClick={() => setOpenModal(variant)}
        >
          Modal {variant}
        </Button>
      ))}
      
      {variants.map(variant => (
        <Modal
          key={variant}
          isOpen={openModal === variant}
          onClose={() => setOpenModal(null)}
          variant={variant}
          title={`Modal ${variant.charAt(0).toUpperCase() + variant.slice(1)}`}
          size="md"
        >
          <p>Este es un modal con variante <strong>{variant}</strong>.</p>
          <p>Los colores de fondo, borde y título cambian automáticamente según la variante seleccionada.</p>
          <Button variant={variant}>Botón {variant}</Button>
        </Modal>
      ))}
    </div>
  );
};

Variants.parameters = {
  docs: {
    description: {
      story: 'Las 6 variantes semánticas estándar del sistema: Primary (neutral), Secondary (alternativo), Success (confirmaciones), Warning (advertencias), Danger (errores), Neutral (gris).'
    }
  }
};

export const LoadingState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleAction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(false);
    }, 3000);
  };
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Modal con Loading
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Procesando..."
        size="md"
        loading={loading}
        variant="primary"
      >
        <div style={{ textAlign: 'center' }}>
          <p>Este modal puede entrar en estado de loading.</p>
          <p>Cuando está en loading, aparece un spinner y se bloquean las interacciones.</p>
          <Button 
            variant="primary" 
            onClick={handleAction}
            loading={loading}
          >
            {loading ? 'Procesando...' : 'Iniciar Proceso'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

LoadingState.parameters = {
  docs: {
    description: {
      story: 'Estado de loading con spinner que bloquea todas las interacciones del modal mientras está activo.'
    }
  }
};

export const AllSizes = () => {
  const [openModal, setOpenModal] = useState(null);
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  
  return (
    <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
      {sizes.map(size => (
        <Button 
          key={size} 
          size={size === 'xs' ? 'sm' : size} 
          onClick={() => setOpenModal(size)}
        >
          Modal {size.toUpperCase()}
        </Button>
      ))}
      
      {sizes.map(size => (
        <Modal
          key={size}
          isOpen={openModal === size}
          onClose={() => setOpenModal(null)}
          size={size}
          title={`Modal tamaño ${size.toUpperCase()}`}
        >
          <p>Este modal tiene tamaño <strong>{size}</strong>.</p>
          <p>Los tamaños controlan el ancho máximo del modal:</p>
          <ul style={{ paddingLeft: 'var(--space-lg)' }}>
            <li><strong>xs:</strong> 320px - Para alertas simples</li>
            <li><strong>sm:</strong> 384px - Para confirmaciones</li>
            <li><strong>md:</strong> 512px - Uso general</li>
            <li><strong>lg:</strong> 768px - Formularios amplios</li>
            <li><strong>xl:</strong> 1024px - Contenido complejo</li>
          </ul>
        </Modal>
      ))}
    </div>
  );
};

AllSizes.parameters = {
  docs: {
    description: {
      story: 'Los 5 tamaños estándar del sistema de diseño aplicados a modales, desde alertas simples hasta contenido complejo.'
    }
  }
};