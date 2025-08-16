// AdminLayout.stories.jsx - MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
import PropTypes from 'prop-types';
import { AdminLayout } from './AdminLayout';
import { Button } from '../../atoms/Button/Button';
import { DataTable } from '../../organisms/DataTable/DataTable';

export default {
  title: 'Templates/AdminLayout',
  component: AdminLayout,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# AdminLayout Template

Template base para el panel de administración completamente migrado al sistema estándar de diseño.

## ✅ Migración Completada

- **Props estándar**: size, variant, rounded, loading, disabled
- **validateStandardProps**: Con deprecation warnings integradas  
- **STANDARD_PROP_TYPES**: Para consistencia total
- **Backward compatibility**: variant="default" → "primary" automático
- **Container del sistema**: Integrado internamente
- **Breadcrumbs**: Sistema completo implementado
- **Estados loading/disabled**: Integrados

## 🎯 Props del Sistema Estándar

- **size**: xs, sm, md, lg, xl (afecta padding del contenido)
- **variant**: primary, secondary, success, warning, danger, neutral (esquema de colores)
- **rounded**: sm, md, lg, xl, full (bordes del header y contenido)  
- **loading**: Estado de loading global
- **disabled**: Deshabilita interacciones

## 🏗️ Arquitectura

- **Sidebar**: AdminSidebar con contadores dinámicos
- **Header**: Título, subtitle, breadcrumbs, actions
- **Content**: Container del sistema estándar integrado
- **Authentication**: Verificación automática de admin
- **Responsive**: Mobile-first design

## 📱 Responsive Design

- **Desktop**: Sidebar expandido (280px)
- **Tablet**: Sidebar compacto (240px) 
- **Mobile**: Sidebar overlay + botón hamburguesa

## 🎨 Variantes de Layout (Legacy)

- **default**: Comportamiento estándar
- **compact**: Contenido centrado (max-width: 1200px)
- **full**: Sin restricciones de ancho
        `
      }
    },
    layout: 'fullscreen',
    // Mock del entorno de autenticación para Storybook
    mockAdminAuth: true
  },
  argTypes: {
    // Props del sistema estándar
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del padding interno del contenido'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Esquema de colores del layout'
    },
    rounded: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes del header y contenido'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de loading global'
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita interacciones'
    },
    
    // Props específicos del layout
    title: {
      control: 'text',
      description: 'Título principal de la página'
    },
    subtitle: {
      control: 'text', 
      description: 'Subtítulo descriptivo'
    },
    breadcrumbs: {
      control: 'object',
      description: 'Array de breadcrumbs { label, href }'
    },
    layoutVariant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'full'],
      description: 'Variante de layout (legacy)'
    },
    sidebarCollapsed: {
      control: 'boolean',
      description: 'Si el sidebar está colapsado'
    }
  },
  decorators: [
    (Story) => {
      // Mock sessionStorage para Storybook
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem('sessionUser', JSON.stringify({
          id: 1,
          name: 'Admin User',
          email: 'admin@streamingapp.com',
          role: 'admin',
          roleId: 1,
          isAdmin: true
        }));
      }
      return <Story />;
    }
  ]
};

// ===== MOCK DATA =====
const mockUsers = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', createdAt: '2024-01-15' },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'editor', createdAt: '2024-01-20' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'user', createdAt: '2024-01-25' }
];

const mockColumns = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Rol' }
];

const sampleBreadcrumbs = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Usuarios', href: '/admin/users' },
  { label: 'Lista' }
];

const headerActions = (
  <div style={{ display: 'flex', gap: '1rem' }}>
    <Button variant="outline" size="sm" leftIcon="refresh-cw">
      Actualizar
    </Button>
    <Button variant="primary" size="sm" leftIcon="plus">
      Crear Usuario
    </Button>
  </div>
);

// ===== STORIES =====

/**
 * Configuración básica del AdminLayout con props por defecto
 */
export const Default = {
  args: {
    title: 'Gestión de Usuarios',
    subtitle: 'Administra usuarios del sistema',
    children: (
      <div style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
        <h3>Contenido de la página</h3>
        <p>Este sería el contenido principal de la página administrativa.</p>
      </div>
    )
  }
};

/**
 * Layout completo con todas las funcionalidades
 */
export const Complete = {
  args: {
    title: 'Gestión de Usuarios',
    subtitle: 'Panel completo de administración de usuarios',
    breadcrumbs: sampleBreadcrumbs,
    headerActions: headerActions,
    children: (
      <DataTable
        data={mockUsers}
        columns={mockColumns}
        loading={false}
        onView={(user) => console.log('Ver:', user)}
        onEdit={(user) => console.log('Editar:', user)}
        onDelete={(user) => console.log('Eliminar:', user)}
      />
    )
  }
};

/**
 * Todas las variantes del sistema estándar
 */
export const StandardVariants = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h4>Primary (Default)</h4>
        <AdminLayout 
          variant="primary" 
          title="Variant Primary" 
          size="sm"
          style={{ height: '300px' }}
        >
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
            Contenido con variant primary
          </div>
        </AdminLayout>
      </div>
      
      <div>
        <h4>Secondary</h4>
        <AdminLayout 
          variant="secondary" 
          title="Variant Secondary" 
          size="sm"
          style={{ height: '300px' }}
        >
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
            Contenido con variant secondary
          </div>
        </AdminLayout>
      </div>
      
      <div>
        <h4>Success</h4>
        <AdminLayout 
          variant="success" 
          title="Variant Success" 
          size="sm"
          style={{ height: '300px' }}
        >
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
            Contenido con variant success
          </div>
        </AdminLayout>
      </div>
    </div>
  )
};

/**
 * Diferentes tamaños del sistema estándar
 */
export const StandardSizes = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
        <div key={size}>
          <h4>Size: {size}</h4>
          <AdminLayout 
            size={size}
            title={`Layout ${size.toUpperCase()}`}
            style={{ height: '200px' }}
          >
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', minHeight: '100px' }}>
              <p>Padding: {size}</p>
            </div>
          </AdminLayout>
        </div>
      ))}
    </div>
  )
};

/**
 * Diferentes bordes redondeados del sistema estándar
 */
export const StandardRounded = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {['sm', 'md', 'lg', 'xl'].map(rounded => (
        <div key={rounded}>
          <h4>Rounded: {rounded}</h4>
          <AdminLayout 
            rounded={rounded}
            title={`Rounded ${rounded.toUpperCase()}`}
            size="sm"
            style={{ height: '200px' }}
          >
            <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100px' }}>
              <p>Border radius: {rounded}</p>
            </div>
          </AdminLayout>
        </div>
      ))}
    </div>
  )
};

/**
 * Estados del sistema estándar
 */
export const StandardStates = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h4>Loading State</h4>
        <AdminLayout 
          loading={true}
          title="Estado de Loading"
          size="sm"
        />
      </div>
      
      <div>
        <h4>Disabled State</h4>
        <AdminLayout 
          disabled={true}
          title="Estado Disabled"
          size="sm"
          style={{ height: '300px' }}
        >
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
            Contenido deshabilitado
          </div>
        </AdminLayout>
      </div>
    </div>
  )
};

/**
 * Variantes de layout legacy (compatibilidad)
 */
export const LegacyLayoutVariants = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h4>Default Layout</h4>
        <AdminLayout 
          layoutVariant="default"
          title="Layout Default" 
          size="sm"
          style={{ height: '200px' }}
        >
          <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100px' }}>
            Layout estándar sin restricciones
          </div>
        </AdminLayout>
      </div>
      
      <div>
        <h4>Compact Layout</h4>
        <AdminLayout 
          layoutVariant="compact"
          title="Layout Compact" 
          size="sm"
          style={{ height: '200px' }}
        >
          <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100px' }}>
            Layout compacto (max-width: 1200px)
          </div>
        </AdminLayout>
      </div>
      
      <div>
        <h4>Full Layout</h4>
        <AdminLayout 
          layoutVariant="full"
          title="Layout Full" 
          size="sm"
          style={{ height: '200px' }}
        >
          <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100px' }}>
            Layout completo sin restricciones
          </div>
        </AdminLayout>
      </div>
    </div>
  )
};

/**
 * Con breadcrumbs completos
 */
export const WithBreadcrumbs = {
  args: {
    title: 'Editar Usuario',
    subtitle: 'Modificar información del usuario seleccionado',
    breadcrumbs: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Usuarios', href: '/admin/users' },
      { label: 'Lista', href: '/admin/users/list' },
      { label: 'Juan Pérez' } // Último sin href (current page)
    ],
    headerActions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="outline" size="sm" leftIcon="arrow-left">
          Volver
        </Button>
        <Button variant="primary" size="sm" leftIcon="save">
          Guardar
        </Button>
      </div>
    ),
    children: (
      <div style={{ 
        padding: '2rem', 
        backgroundColor: 'var(--bg-secondary)', 
        borderRadius: '8px',
        display: 'grid',
        gap: '1rem'
      }}>
        <div>
          <label>Nombre:</label>
          <input type="text" value="Juan Pérez" style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value="juan@example.com" style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
        </div>
        <div>
          <label>Rol:</label>
          <select style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
            <option>Administrador</option>
            <option>Editor</option>
            <option>Usuario</option>
          </select>
        </div>
      </div>
    )
  }
};

/**
 * Sidebar colapsado 
 */
export const CollapsedSidebar = {
  args: {
    title: 'Vista Compacta',
    subtitle: 'Layout con sidebar colapsado',
    sidebarCollapsed: true,
    children: (
      <div style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
        <h3>Más espacio para contenido</h3>
        <p>Con el sidebar colapsado, hay más espacio disponible para el contenido principal.</p>
      </div>
    )
  }
};

// Backward compatibility stories
/**
 * Migración: variant="default" → variant="primary" (con warning)
 */
export const BackwardCompatibility = {
  args: {
    variant: 'default', // ⚠️ Deprecation warning esperado
    title: 'Backward Compatibility',
    subtitle: 'Muestra deprecation warning en consola',
    children: (
      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-warning-subtle)', borderRadius: '4px' }}>
        <p>⚠️ Esta story usa <code>variant=&quot;default&quot;</code> que está deprecado.</p>
        <p>Verifica la consola para ver el deprecation warning.</p>
        <p>Se mapea automáticamente a <code>variant=&quot;primary&quot;</code>.</p>
      </div>
    )
  }
};

// ===== PROPTYPES (PARA STORYBOOK) =====
Default.propTypes = {
  args: PropTypes.object
};

Complete.propTypes = {
  args: PropTypes.object
};

WithBreadcrumbs.propTypes = {
  args: PropTypes.object  
};

CollapsedSidebar.propTypes = {
  args: PropTypes.object
};

BackwardCompatibility.propTypes = {
  args: PropTypes.object
};