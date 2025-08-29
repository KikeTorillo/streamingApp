// ===== ACTIONS DROPDOWN STORIES - V2.0 UNIVERSAL =====
import { ActionsDropdown } from './ActionsDropdown';
import { useState } from 'react';
import './ActionsDropdown.css';

export default {
  title: 'Components/Molecules/ActionsDropdown',
  component: ActionsDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# ActionsDropdown Molecule ✅ V2.0 UNIVERSAL

Menú desplegable universal de acciones completamente configurable. **Migrado al sistema estándar** con props, tokens y hooks unificados.

## ✅ Sistema Estándar V2.0 Implementado

- **✅ Props estándar**: size, variant, rounded, loading, disabled
- **✅ Hook obligatorio**: useInteractiveProps() integrado  
- **✅ Props DOM filtering**: extractDOMPropsV2() automático
- **✅ CSS tokens**: Spacing, colores, tipografía del sistema
- **✅ Iconos unificados**: renderIcon() con sistema estándar
- **✅ Accesibilidad completa**: ARIA, navegación por teclado, focus management
- **✅ Auto-posicionamiento**: Detección inteligente de espacio disponible

## 🎯 Configuración Universal

### Acciones completamente configurables:
\`\`\`javascript
const actions = [
  {
    label: 'Ver detalles',
    icon: 'eye',
    onClick: (data) => console.log('Ver:', data),
    variant: 'neutral'
  },
  {
    label: 'Editar',
    icon: 'edit',
    onClick: (data) => console.log('Editar:', data),
    variant: 'primary'
  },
  {
    label: 'Eliminar',
    icon: 'trash',
    onClick: (data) => console.log('Eliminar:', data),
    variant: 'danger',
    shortcut: '⌫'
  }
];
\`\`\`

### Casos de uso universales:
- **Tablas de datos**: Acciones CRUD por fila
- **Listas de elementos**: Opciones contextuales
- **Cards de contenido**: Menús de acciones rápidas
- **Barras de herramientas**: Agrupación de acciones
- **Formularios**: Opciones adicionales

## 🏗️ Arquitectura (Molecule correcto)

\`\`\`
ActionsDropdown (Molecule) 🧬
├── Button (Atom) ⚛️ - Trigger
├── Backdrop - Control de clicks externos
└── Menu Items
    └── Individual action buttons
\`\`\`

**Justificación Molecule**: Combina Button atom con lógica de posicionamiento, estados y accesibilidad.
        `
      }
    }
  },
  argTypes: {
    // Props estándar del sistema
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Tamaño del trigger y elementos del menú'
    },
    variant: {
      control: 'select', 
      options: ['ghost', 'outline', 'primary', 'secondary'],
      description: 'Variante visual del trigger'
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: 'Border radius del trigger'
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilitar todo el dropdown'
    },
    loading: {
      control: 'boolean', 
      description: 'Estado de carga del trigger'
    },
    
    // Props específicas
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'auto'],
      description: 'Posición del menú (auto = inteligente)'
    },
    closeOnAction: {
      control: 'boolean',
      description: 'Cerrar menú automáticamente al ejecutar acción'
    },
    triggerIcon: {
      control: 'text',
      description: 'Ícono del botón trigger'
    },
    triggerLabel: {
      control: 'text',
      description: 'Label accesible del trigger'
    }
  }
};

// ===== MOCK DATA =====
const createMockUser = (id) => ({
  id,
  name: `Usuario ${id}`,
  email: `user${id}@example.com`,
  role: id % 2 === 0 ? 'Admin' : 'User',
  status: id % 3 === 0 ? 'Inactivo' : 'Activo'
});

// ===== ACTIONS UNIVERSALES =====
const createUniversalActions = (showAll = true) => {
  const actions = [
    {
      label: 'Ver detalles',
      icon: 'eye',
      onClick: (data) => alert(`Ver detalles de: ${data.name || data.title || 'Item'}`),
      variant: 'neutral',
      description: 'Ver información completa'
    },
    {
      label: 'Editar',
      icon: 'edit',
      onClick: (data) => alert(`Editar: ${data.name || data.title || 'Item'}`),
      variant: 'primary',
      description: 'Modificar este elemento',
      shortcut: '⌘E'
    }
  ];

  if (showAll) {
    actions.push(
      {
        label: 'Duplicar',
        icon: 'copy',
        onClick: (data) => alert(`Duplicar: ${data.name || data.title || 'Item'}`),
        variant: 'secondary',
        description: 'Crear una copia',
        shortcut: '⌘D'
      },
      {
        label: 'Compartir',
        icon: 'share',
        onClick: (data) => alert(`Compartir: ${data.name || data.title || 'Item'}`),
        variant: 'neutral',
        description: 'Compartir con otros usuarios'
      },
      {
        label: 'Archivar',
        icon: 'archive',
        onClick: (data) => alert(`Archivar: ${data.name || data.title || 'Item'}`),
        variant: 'warning',
        description: 'Mover a archivo'
      },
      {
        label: 'Eliminar',
        icon: 'trash',
        onClick: (data) => alert(`Eliminar: ${data.name || data.title || 'Item'}`),
        variant: 'danger',
        description: 'Eliminar permanentemente',
        shortcut: '⌫'
      }
    );
  }

  return actions;
};

// ===== STORY DEFAULT =====
export const Default = {
  args: {
    actions: createUniversalActions(false),
    triggerData: createMockUser(1),
    size: 'sm',
    variant: 'ghost',
    position: 'bottom-right',
    triggerIcon: 'more-vertical',
    triggerLabel: 'Opciones',
    closeOnAction: true
  }
};

// ===== STORY COMPLETO =====
export const AllActions = {
  args: {
    actions: createUniversalActions(true),
    triggerData: createMockUser(2),
    size: 'md',
    variant: 'outline',
    position: 'bottom-right',
    triggerIcon: 'more-horizontal',
    triggerLabel: 'Todas las opciones'
  }
};

// ===== STORY TAMAÑOS =====
export const Sizes = () => {
  const actions = createUniversalActions(false);
  const data = createMockUser(3);

  return (
    <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', padding: 'var(--space-xl)' }}>
      <div>
        <h4>Extra Small</h4>
        <ActionsDropdown actions={actions} triggerData={data} size="xs" />
      </div>
      <div>
        <h4>Small</h4>
        <ActionsDropdown actions={actions} triggerData={data} size="sm" />
      </div>
      <div>
        <h4>Medium</h4>
        <ActionsDropdown actions={actions} triggerData={data} size="md" />
      </div>
      <div>
        <h4>Large</h4>
        <ActionsDropdown actions={actions} triggerData={data} size="lg" />
      </div>
    </div>
  );
};

// ===== STORY VARIANTES =====
export const Variants = () => {
  const actions = createUniversalActions(false);
  const data = createMockUser(4);

  return (
    <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', padding: 'var(--space-xl)' }}>
      <div>
        <h4>Ghost</h4>
        <ActionsDropdown actions={actions} triggerData={data} variant="ghost" />
      </div>
      <div>
        <h4>Outline</h4>
        <ActionsDropdown actions={actions} triggerData={data} variant="outline" />
      </div>
      <div>
        <h4>Primary</h4>
        <ActionsDropdown actions={actions} triggerData={data} variant="primary" />
      </div>
      <div>
        <h4>Secondary</h4>
        <ActionsDropdown actions={actions} triggerData={data} variant="secondary" />
      </div>
    </div>
  );
};

// ===== STORY POSICIONES =====
export const Positions = () => {
  const actions = createUniversalActions(true);
  const data = createMockUser(5);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: 'var(--space-xl)', 
      padding: 'var(--space-xxl)',
      minHeight: '400px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <div>
          <h4>Bottom Right</h4>
          <ActionsDropdown actions={actions} triggerData={data} position="bottom-right" />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
        <div>
          <h4>Bottom Left</h4>
          <ActionsDropdown actions={actions} triggerData={data} position="bottom-left" />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
        <div>
          <h4>Top Right</h4>
          <ActionsDropdown actions={actions} triggerData={data} position="top-right" />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <div>
          <h4>Top Left</h4>
          <ActionsDropdown actions={actions} triggerData={data} position="top-left" />
        </div>
      </div>
    </div>
  );
};

// ===== STORY AUTO POSITIONING =====
export const AutoPositioning = () => {
  const actions = createUniversalActions(true);
  const data = createMockUser(6);

  return (
    <div style={{ 
      height: '400px', 
      padding: 'var(--space-lg)',
      border: '1px dashed var(--border-default)',
      position: 'relative',
      overflow: 'auto'
    }}>
      <h4>Auto Positioning (inteligente)</h4>
      <p>El dropdown detecta automáticamente la mejor posición según el espacio disponible.</p>
      
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <ActionsDropdown actions={actions} triggerData={data} position="auto" triggerLabel="Esquina superior izquierda" />
      </div>
      
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <ActionsDropdown actions={actions} triggerData={data} position="auto" triggerLabel="Esquina superior derecha" />
      </div>
      
      <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
        <ActionsDropdown actions={actions} triggerData={data} position="auto" triggerLabel="Esquina inferior izquierda" />
      </div>
      
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
        <ActionsDropdown actions={actions} triggerData={data} position="auto" triggerLabel="Esquina inferior derecha" />
      </div>
      
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <ActionsDropdown actions={actions} triggerData={data} position="auto" triggerLabel="Centro" />
      </div>
    </div>
  );
};

// ===== STORY ESTADOS =====
export const States = () => {
  const actions = createUniversalActions(false);
  const data = createMockUser(7);

  return (
    <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', padding: 'var(--space-xl)' }}>
      <div>
        <h4>Normal</h4>
        <ActionsDropdown actions={actions} triggerData={data} />
      </div>
      <div>
        <h4>Disabled</h4>
        <ActionsDropdown actions={actions} triggerData={data} disabled />
      </div>
      <div>
        <h4>Loading</h4>
        <ActionsDropdown actions={actions} triggerData={data} loading />
      </div>
    </div>
  );
};

// ===== STORY CON ACCIONES DISABLED/LOADING =====
export const ActionStates = () => {
  const data = createMockUser(8);
  
  const actionsWithStates = [
    {
      label: 'Acción normal',
      icon: 'check',
      onClick: (data) => alert(`Normal: ${data.name}`),
      variant: 'success'
    },
    {
      label: 'Acción deshabilitada',
      icon: 'ban',
      onClick: (data) => alert(`Disabled: ${data.name}`),
      variant: 'neutral',
      disabled: true,
      description: 'Esta acción no está disponible'
    },
    {
      label: 'Acción cargando',
      icon: 'loading',
      onClick: (data) => alert(`Loading: ${data.name}`),
      variant: 'primary',
      loading: true,
      description: 'Procesando...'
    },
    {
      label: 'Acción peligrosa',
      icon: 'alert-triangle',
      onClick: (data) => alert(`Danger: ${data.name}`),
      variant: 'danger',
      description: 'Esta acción es irreversible'
    }
  ];

  return (
    <div style={{ padding: 'var(--space-xl)' }}>
      <h4>Estados de acciones individuales</h4>
      <ActionsDropdown actions={actionsWithStates} triggerData={data} />
    </div>
  );
};

// ===== STORY TABLA SIMULATION =====
export const TableSimulation = () => {
  const users = Array.from({ length: 5 }, (_, i) => createMockUser(i + 1));
  const actions = createUniversalActions(false);

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <h4>Simulación en tabla (uso típico)</h4>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        border: '1px solid var(--border-default)'
      }}>
        <thead>
          <tr style={{ background: 'var(--bg-muted)' }}>
            <th style={{ padding: 'var(--space-md)', textAlign: 'left', border: '1px solid var(--border-default)' }}>ID</th>
            <th style={{ padding: 'var(--space-md)', textAlign: 'left', border: '1px solid var(--border-default)' }}>Nombre</th>
            <th style={{ padding: 'var(--space-md)', textAlign: 'left', border: '1px solid var(--border-default)' }}>Email</th>
            <th style={{ padding: 'var(--space-md)', textAlign: 'left', border: '1px solid var(--border-default)' }}>Rol</th>
            <th style={{ padding: 'var(--space-md)', textAlign: 'center', border: '1px solid var(--border-default)' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ padding: 'var(--space-md)', border: '1px solid var(--border-default)' }}>{user.id}</td>
              <td style={{ padding: 'var(--space-md)', border: '1px solid var(--border-default)' }}>{user.name}</td>
              <td style={{ padding: 'var(--space-md)', border: '1px solid var(--border-default)' }}>{user.email}</td>
              <td style={{ padding: 'var(--space-md)', border: '1px solid var(--border-default)' }}>{user.role}</td>
              <td style={{ padding: 'var(--space-md)', border: '1px solid var(--border-default)', textAlign: 'center' }}>
                <ActionsDropdown actions={actions} triggerData={user} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ===== STORY INTERACTIVE =====
export const Interactive = () => {
  const [logs, setLogs] = useState([]);
  const data = createMockUser(9);
  
  const addLog = (message) => {
    setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const interactiveActions = [
    {
      label: 'Log Simple',
      icon: 'file-text',
      onClick: (data) => addLog(`Acción simple ejecutada para ${data.name}`),
      variant: 'neutral'
    },
    {
      label: 'Log con Delay',
      icon: 'clock',
      onClick: async (data) => {
        addLog(`Iniciando acción con delay para ${data.name}...`);
        setTimeout(() => {
          addLog(`Acción con delay completada para ${data.name}`);
        }, 1000);
      },
      variant: 'primary'
    },
    {
      label: 'Log Error',
      icon: 'alert-circle',
      onClick: (data) => {
        addLog(`Error simulado para ${data.name}`);
        throw new Error('Error simulado');
      },
      variant: 'danger'
    }
  ];

  return (
    <div style={{ padding: 'var(--space-xl)' }}>
      <h4>Componente interactivo</h4>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <ActionsDropdown 
          actions={interactiveActions} 
          triggerData={data}
          onOpen={(data) => addLog(`Menú abierto para ${data.name}`)}
          onClose={(data) => addLog(`Menú cerrado para ${data.name}`)}
        />
      </div>
      
      <div style={{ 
        padding: 'var(--space-md)', 
        background: 'var(--bg-muted)', 
        borderRadius: 'var(--radius-md)',
        minHeight: '120px'
      }}>
        <h5>Log de eventos:</h5>
        {logs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay eventos aún...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xs)' }}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
