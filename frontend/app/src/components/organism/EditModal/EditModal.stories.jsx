// ===== EDIT MODAL ORGANISM STORIES =====
// src/components/organisms/EditModal/EditModal.stories.jsx

import { useState } from 'react';
import { EditModal } from './EditModal';
import { Button } from '../../atoms/Button/Button';

export default {
  title: 'Components/Organisms/EditModal',
  component: EditModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# EditModal Organism

Organismo para editar campos de texto simples con validación y manejo de estados. Perfecto para editar nombres, títulos, descripciones cortas.

## 🎯 Características

- **✅ Modal base reutilizable**: Usa Modal molecule con <dialog>
- **✅ Validación en tiempo real**: Requerido, longitud, patrón
- **✅ Estados de carga**: Loading, error, éxito
- **✅ Detección de cambios**: Alerta antes de cerrar con cambios
- **✅ Accesibilidad**: ARIA, labels, descripciones
- **✅ Responsive**: Adaptable a móviles

## 🚀 Uso básico

\`\`\`jsx
import { EditModal } from './organisms/EditModal';

function CategoryList() {
  const [editModal, setEditModal] = useState({ isOpen: false, category: null });
  const [saving, setSaving] = useState(false);
  
  const handleEdit = (category) => {
    setEditModal({ isOpen: true, category });
  };
  
  const handleSave = async (newName) => {
    setSaving(true);
    try {
      await updateCategoryService(editModal.category.id, newName);
      setEditModal({ isOpen: false, category: null });
      // Recargar datos...
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <>
      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, category: null })}
        onSave={handleSave}
        title="Editar Categoría"
        fieldLabel="Nombre de la Categoría"
        initialValue={editModal.category?.name || ''}
        loading={saving}
        icon="📂"
        required
        minLength={2}
        maxLength={50}
      />
    </>
  );
}
\`\`\`

## 🔧 Casos de uso

- **Editar nombres**: Categorías, usuarios, etc.
- **Editar títulos**: Artículos, páginas, etc.
- **Editar descripciones**: Breves, con límite de caracteres
- **Campos simples**: Cualquier input de texto
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controla si el modal está abierto'
    },
    title: {
      control: 'text',
      description: 'Título del modal'
    },
    fieldLabel: {
      control: 'text',
      description: 'Label del campo de entrada'
    },
    fieldPlaceholder: {
      control: 'text',
      description: 'Placeholder del campo'
    },
    initialValue: {
      control: 'text',
      description: 'Valor inicial del campo'
    },
    required: {
      control: 'boolean',
      description: 'Campo obligatorio'
    },
    minLength: {
      control: 'number',
      description: 'Longitud mínima'
    },
    maxLength: {
      control: 'number',
      description: 'Longitud máxima'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga'
    },
    error: {
      control: 'text',
      description: 'Mensaje de error'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del modal'
    },
    onSave: {
      action: 'save',
      description: 'Función llamada al guardar'
    },
    onClose: {
      action: 'close',
      description: 'Función llamada al cerrar'
    }
  }
};

// ===== TEMPLATE BASE =====
const Template = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedValue, setSavedValue] = useState(args.initialValue);
  
  const handleSave = async (value) => {
    setLoading(true);
    setError(null);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular error ocasional
    if (Math.random() > 0.8) {
      setError('Error al guardar. Inténtalo de nuevo.');
      setLoading(false);
      return;
    }
    
    setSavedValue(value);
    setIsOpen(false);
    setLoading(false);
    args.onSave?.(value);
  };
  
  return (
    <div>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <p><strong>Valor actual:</strong> {savedValue}</p>
        <Button onClick={() => setIsOpen(true)}>
          Editar Valor
        </Button>
      </div>
      
      <EditModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        loading={loading}
        error={error}
        initialValue={savedValue}
      />
    </div>
  );
};

// ===== HISTORIAS PRINCIPALES =====

export const CategoryEdit = Template.bind({});
CategoryEdit.args = {
  title: 'Editar Categoría',
  fieldLabel: 'Nombre de la Categoría',
  fieldPlaceholder: 'Ej: Acción, Comedia, Drama...',
  initialValue: 'Acción',
  icon: '📂',
  required: true,
  minLength: 2,
  maxLength: 50,
  size: 'md'
};

export const UserNameEdit = Template.bind({});
UserNameEdit.args = {
  title: 'Editar Nombre de Usuario',
  fieldLabel: 'Nombre de Usuario',
  fieldPlaceholder: 'Ej: juan_perez',
  initialValue: 'admin_user',
  icon: '👤',
  required: true,
  minLength: 3,
  maxLength: 20,
  pattern: '^[a-zA-Z0-9_]+$',
  size: 'md'
};

export const TitleEdit = Template.bind({});
TitleEdit.args = {
  title: 'Editar Título',
  fieldLabel: 'Título del Artículo',
  fieldPlaceholder: 'Ingresa el título...',
  initialValue: 'Cómo crear componentes React reutilizables',
  icon: '📝',
  required: true,
  minLength: 5,
  maxLength: 100,
  size: 'lg'
};

export const ShortDescription = Template.bind({});
ShortDescription.args = {
  title: 'Editar Descripción',
  fieldLabel: 'Descripción Breve',
  fieldPlaceholder: 'Describe brevemente...',
  initialValue: 'Una descripción corta pero informativa',
  icon: '📄',
  required: false,
  maxLength: 200,
  size: 'md'
};

export const WithError = Template.bind({});
WithError.args = {
  title: 'Editar con Error',
  fieldLabel: 'Campo con Error',
  fieldPlaceholder: 'Este campo fallará...',
  initialValue: 'Valor que causará error',
  required: true,
  minLength: 5,
  maxLength: 30,
  size: 'md'
};

export const Loading = Template.bind({});
Loading.args = {
  title: 'Estado de Carga',
  fieldLabel: 'Campo en Carga',
  fieldPlaceholder: 'Guardando...',
  initialValue: 'Valor siendo guardado',
  loading: true,
  required: true,
  size: 'md'
};

export const SmallModal = Template.bind({});
SmallModal.args = {
  title: 'Modal Pequeño',
  fieldLabel: 'Código',
  fieldPlaceholder: 'ABC123',
  initialValue: 'XYZ789',
  icon: '🔑',
  required: true,
  minLength: 6,
  maxLength: 6,
  size: 'sm'
};

// ===== DEMO COMPLETO =====
export const CompleteDemo = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Acción' },
    { id: 2, name: 'Comedia' },
    { id: 3, name: 'Drama' }
  ]);
  
  const [editModal, setEditModal] = useState({ isOpen: false, category: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const handleEdit = (category) => {
    setEditModal({ isOpen: true, category });
    setError(null);
  };
  
  const handleSave = async (newName) => {
    setSaving(true);
    setError(null);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular error ocasional
      if (Math.random() > 0.8) {
        throw new Error('Error de conexión');
      }
      
      // Actualizar categoría
      setCategories(prev => 
        prev.map(cat => 
          cat.id === editModal.category.id 
            ? { ...cat, name: newName }
            : cat
        )
      );
      
      setEditModal({ isOpen: false, category: null });
      
    } catch (err) {
      setError('Error al guardar la categoría. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h3>Lista de Categorías</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {categories.map(category => (
          <div
            key={category.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-md)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <span>📂 {category.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(category)}
            >
              Editar
            </Button>
          </div>
        ))}
      </div>
      
      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, category: null })}
        onSave={handleSave}
        title="Editar Categoría"
        fieldLabel="Nombre de la Categoría"
        fieldPlaceholder="Ej: Acción, Comedia, Drama..."
        initialValue={editModal.category?.name || ''}
        loading={saving}
        error={error}
        icon="📂"
        required
        minLength={2}
        maxLength={50}
      />
    </div>
  );
};

CompleteDemo.parameters = {
  docs: {
    description: {
      story: 'Demostración completa del EditModal integrado con una lista de categorías, incluyendo estados de carga y manejo de errores.'
    }
  }
};