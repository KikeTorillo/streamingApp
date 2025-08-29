// ===== DATA TABLE STORIES =====

import { useState } from 'react';
import { DataTable } from './DataTable';
import { Button } from '../atoms/Button/Button';
import './DataTable.css';

export default {
  title: 'Components/Organism/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# DataTable Organism ✅ MIGRADO

Organismo completo para mostrar datos tabulares con funcionalidades avanzadas. **Migrado al sistema estándar** con props, tokens y hooks unificados.

## ✅ Sistema Estándar Implementado

- **✅ Props estándar**: size, variant, rounded, loading, disabled
- **✅ Hook especializado**: useDataTableProps() integrado  
- **✅ Tokens automáticos**: Spacing, colores, tipografía del sistema
- **✅ Iconos unificados**: renderIcon() con sistema Feather
- **✅ Componentes migrados**: Button, TextInput, Select, EmptyState
- **✅ Backward compatibility**: variant legacy → tableVariant con warnings

## 🎯 Características heredadas

- **✅ TanStack React Table**: Funcionalidades avanzadas de tabla
- **✅ Estados completos**: Loading, empty, error con componentes del sistema
- **✅ Responsive design**: Mobile, tablet, desktop
- **✅ Accesibilidad**: ARIA, navegación por teclado, lectores de pantalla
- **✅ Búsqueda global**: Con debounce para performance
- **✅ Paginación**: Configurable con múltiples tamaños
- **✅ Ordenamiento**: Por columnas clickeables
- **✅ Acciones CRUD**: Ver, editar, eliminar por fila
- **✅ Variantes**: Default, striped, bordered, compact

## 🏗️ Arquitectura (Organismo correcto)

\`\`\`
DataTable (Organism) 🧬
├── Controls
│   ├── TextInput (Molécula) 🧬 - Búsqueda
│   └── Select (Átomo) ⚛️ - Tamaño de página
├── Table
│   ├── Header con ordenamiento
│   ├── Body con datos/skeleton
│   └── ActionsDropdown (sin dependencias)
├── Footer
│   ├── Info de resultados
│   └── Pagination con Button (Átomo) ⚛️
└── Estados especiales
    └── EmptyState (Molécula) 🧬
\`\`\`

## 🔧 Uso básico

\`\`\`jsx
import { DataTable } from './organisms/DataTable';

// Columnas para usuarios
const userColumns = [
  { accessorKey: 'id', header: 'ID', size: 80 },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Rol', size: 120 },
  { accessorKey: 'createdAt', header: 'Creado', size: 150 }
];

// Datos de ejemplo
const users = [
  { id: 1, email: 'admin@app.com', role: 'Admin', createdAt: '2024-01-15' },
  { id: 2, email: 'user@app.com', role: 'Usuario', createdAt: '2024-01-16' }
];

// Uso básico
<DataTable
  data={users}
  columns={userColumns}
/>
\`\`\`

## 📊 Uso avanzado con estados

\`\`\`jsx
// Con todos los estados y configuraciones
<DataTable
  data={data}
  columns={columns}
  loading={isLoading}
  error={errorMessage}
  searchPlaceholder="Buscar usuarios..."
  pageSizeOptions={[10, 25, 50, 100]}
  pageSize={25}
  variant="striped"
  emptyTitle="No hay usuarios"
  emptyDescription="Crea tu primer usuario"
  emptyIcon="👥"
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
/>
\`\`\`

## 🎨 Variantes disponibles

- **Default**: Tabla estándar con hover
- **Striped**: Filas alternadas con color
- **Bordered**: Bordes en todas las celdas
- **Compact**: Espaciado reducido para más datos

## 📱 Responsive

- **Desktop**: Tabla completa con todas las funcionalidades
- **Tablet**: Controles apilados, tabla scrolleable
- **Mobile**: Menú de acciones adaptado, paginación centrada

## ♿ Accesibilidad

- **ARIA**: Roles de tabla, labels descriptivos
- **Navegación por teclado**: Tab, Enter, Escape
- **Lectores de pantalla**: Anuncios de ordenamiento y paginación
- **Reduced motion**: Respeta preferencias del usuario
        `
      }
    }
  },
  argTypes: {
    // ===== PROPS ESTÁNDAR =====
    size: {
      name: 'Tamaño',
      description: 'Tamaño del DataTable (afecta fuente, espaciado, controles)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Sistema Estándar'
      }
    },
    variant: {
      name: 'Variante Semántica',
      description: 'Variante semántica del DataTable (afecta colores de borde)',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'neutral'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'neutral' },
        category: 'Sistema Estándar'
      }
    },
    rounded: {
      name: 'Redondeado',
      description: 'Radio de esquinas del DataTable',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lg' },
        category: 'Sistema Estándar'
      }
    },
    loading: {
      name: 'Cargando',
      description: 'Muestra skeleton loading en lugar de datos',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Sistema Estándar'
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita toda la interacción con el DataTable',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Sistema Estándar'
      }
    },
    
    // ===== PROPS ESPECÍFICAS =====
    data: {
      name: 'Datos',
      description: 'Array de objetos con los datos a mostrar',
      control: 'object',
      table: {
        type: { summary: 'Array<Object>' },
        category: 'Datos'
      }
    },
    columns: {
      name: 'Columnas',
      description: 'Configuración de columnas compatible con TanStack React Table',
      control: 'object',
      table: {
        type: { summary: 'Array<ColumnDef>' },
        category: 'Datos'
      }
    },
    error: {
      name: 'Error',
      description: 'Mensaje de error a mostrar',
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Estados'
      }
    },
    tableVariant: {
      name: 'Variante de Tabla',
      description: 'Estilo visual específico de la tabla',
      control: 'select',
      options: ['default', 'striped', 'bordered', 'compact'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Tabla'
      }
    },
    searchPlaceholder: {
      name: 'Placeholder búsqueda',
      description: 'Texto del campo de búsqueda',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Buscar...' }
      }
    },
    pageSizeOptions: {
      name: 'Opciones de paginación',
      description: 'Array con los tamaños de página disponibles',
      control: 'object',
      table: {
        type: { summary: 'Array<number>' },
        defaultValue: { summary: '[10, 25, 50, 100]' }
      }
    },
    showActions: {
      name: 'Mostrar acciones',
      description: 'Muestra la columna de acciones',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    onEdit: {
      name: 'Función editar',
      description: 'Callback cuando se hace click en editar',
      action: 'edit',
      table: {
        type: { summary: 'function' }
      }
    },
    onDelete: {
      name: 'Función eliminar',
      description: 'Callback cuando se hace click en eliminar',
      action: 'delete',
      table: {
        type: { summary: 'function' }
      }
    },
    onView: {
      name: 'Función ver',
      description: 'Callback cuando se hace click en ver',
      action: 'view',
      table: {
        type: { summary: 'function' }
      }
    }
  }
};

// ===== DATOS MOCK PARA DEMOS =====
const MOCK_USERS = [
  { 
    id: 1, 
    email: 'admin@streamapp.com', 
    role: 'Administrador', 
    status: 'Activo',
    createdAt: '2024-01-15',
    lastLogin: '2024-06-20'
  },
  { 
    id: 2, 
    email: 'editor@streamapp.com', 
    role: 'Editor', 
    status: 'Activo',
    createdAt: '2024-01-20',
    lastLogin: '2024-06-19'
  },
  { 
    id: 3, 
    email: 'user1@example.com', 
    role: 'Usuario', 
    status: 'Inactivo',
    createdAt: '2024-02-01',
    lastLogin: '2024-05-15'
  },
  { 
    id: 4, 
    email: 'user2@example.com', 
    role: 'Usuario', 
    status: 'Activo',
    createdAt: '2024-02-10',
    lastLogin: '2024-06-18'
  },
  { 
    id: 5, 
    email: 'moderator@streamapp.com', 
    role: 'Moderador', 
    status: 'Activo',
    createdAt: '2024-03-01',
    lastLogin: '2024-06-21'
  }
];

const MOCK_MOVIES = [
  {
    id: 1,
    title: 'Spider-Man: No Way Home',
    category: 'Acción',
    year: 2021,
    duration: '148 min',
    rating: 8.4,
    status: 'Publicado'
  },
  {
    id: 2,
    title: 'Dune',
    category: 'Sci-Fi',
    year: 2021,
    duration: '155 min',
    rating: 8.0,
    status: 'Publicado'
  },
  {
    id: 3,
    title: 'The Batman',
    category: 'Acción',
    year: 2022,
    duration: '176 min',
    rating: 7.8,
    status: 'Borrador'
  },
  {
    id: 4,
    title: 'Top Gun: Maverick',
    category: 'Acción',
    year: 2022,
    duration: '130 min',
    rating: 8.3,
    status: 'Publicado'
  }
];

// ===== CONFIGURACIONES DE COLUMNAS =====
const userColumns = [
  { 
    accessorKey: 'id', 
    header: 'ID', 
    size: 80,
    cell: ({ getValue }) => (
      <span className="data-table__cell--center">#{getValue()}</span>
    )
  },
  { 
    accessorKey: 'email', 
    header: 'Correo Electrónico',
    cell: ({ getValue }) => (
      <span className="data-table__cell--truncate">{getValue()}</span>
    )
  },
  { 
    accessorKey: 'role', 
    header: 'Rol',
    size: 120,
    cell: ({ getValue }) => {
      const role = getValue();
      const variant = role === 'Administrador' ? 'primary' : 
                    role === 'Editor' ? 'warning' : 'success';
      return (
        <span className={`data-table__badge data-table__badge--${variant}`}>
          {role}
        </span>
      );
    }
  },
  { 
    accessorKey: 'status', 
    header: 'Estado',
    size: 100,
    cell: ({ getValue }) => {
      const status = getValue();
      const variant = status === 'Activo' ? 'success' : 'danger';
      return (
        <span className={`data-table__badge data-table__badge--${variant}`}>
          {status}
        </span>
      );
    }
  },
  { 
    accessorKey: 'createdAt', 
    header: 'Fecha de Registro',
    size: 150,
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString('es-ES')
  }
];

const movieColumns = [
  { 
    accessorKey: 'id', 
    header: 'ID', 
    size: 60,
    cell: ({ getValue }) => `#${getValue()}`
  },
  { 
    accessorKey: 'title', 
    header: 'Título',
    cell: ({ getValue }) => (
      <span className="data-table__cell--truncate">{getValue()}</span>
    )
  },
  { 
    accessorKey: 'category', 
    header: 'Categoría',
    size: 120
  },
  { 
    accessorKey: 'year', 
    header: 'Año',
    size: 80,
    cell: ({ getValue }) => (
      <span className="data-table__cell--center">{getValue()}</span>
    )
  },
  { 
    accessorKey: 'duration', 
    header: 'Duración',
    size: 100,
    cell: ({ getValue }) => (
      <span className="data-table__cell--center">{getValue()}</span>
    )
  },
  { 
    accessorKey: 'rating', 
    header: 'Rating',
    size: 80,
    cell: ({ getValue }) => (
      <span className="data-table__cell--center">⭐ {getValue()}</span>
    )
  },
  { 
    accessorKey: 'status', 
    header: 'Estado',
    size: 100,
    cell: ({ getValue }) => {
      const status = getValue();
      const variant = status === 'Publicado' ? 'success' : 'warning';
      return (
        <span className={`data-table__badge data-table__badge--${variant}`}>
          {status}
        </span>
      );
    }
  }
];

// ===== TEMPLATE BASE =====
const Template = (args) => {
  const [data, setData] = useState(args.data);

  const handleEdit = (row) => {

    args.onEdit?.(row);
  };

  const handleDelete = (row) => {

    if (window.confirm(`¿Eliminar el elemento con ID ${row.id}?`)) {
      setData(prevData => prevData.filter(item => item.id !== row.id));
    }
    args.onDelete?.(row);
  };

  const handleView = (row) => {

    args.onView?.(row);
  };

  return (
    <DataTable
      {...args}
      data={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
    />
  );
};

// ========== HISTORIAS PRINCIPALES ==========

export const Playground = Template.bind({});
Playground.args = {
  data: MOCK_USERS,
  columns: userColumns,
  size: 'md',
  variant: 'neutral',
  rounded: 'lg',
  tableVariant: 'default',
  loading: false,
  disabled: false,
  searchPlaceholder: 'Buscar usuarios...',
  pageSizeOptions: [10, 25, 50],
  pageSize: 10
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Usa los controles para experimentar con todas las opciones del DataTable migrado al sistema estándar. Incluye props estándar (size, variant, rounded) y específicas (tableVariant).'
    }
  }
};

// ========== GESTIÓN DE USUARIOS ==========
export const UsersTable = () => (
  <div style={{ padding: 'var(--space-lg)' }}>
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <h2 style={{ 
        margin: '0 0 var(--space-sm) 0',
        fontSize: 'var(--font-size-xl)',
        color: 'var(--text-primary)'
      }}>
        Gestión de Usuarios
      </h2>
      <p style={{ 
        margin: 0,
        color: 'var(--text-secondary)',
        fontSize: 'var(--font-size-sm)'
      }}>
        Administra las cuentas de usuario y sus permisos
      </p>
    </div>
    
    <DataTable
      data={MOCK_USERS}
      columns={userColumns}
      searchPlaceholder="Buscar por email o rol..."
      emptyTitle="No hay usuarios registrados"
      emptyDescription="Crea tu primer usuario para comenzar"
      emptyIcon="👥"
    />
  </div>
);

UsersTable.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de uso real para gestión de usuarios con columnas personalizadas, badges de estado y acciones CRUD.'
    }
  }
};

// ========== GESTIÓN DE PELÍCULAS ==========
export const MoviesTable = () => (
  <div style={{ padding: 'var(--space-lg)' }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: 'var(--space-lg)',
      flexWrap: 'wrap',
      gap: 'var(--space-md)'
    }}>
      <div>
        <h2 style={{ 
          margin: '0 0 var(--space-sm) 0',
          fontSize: 'var(--font-size-xl)',
          color: 'var(--text-primary)'
        }}>
          Catálogo de Películas
        </h2>
        <p style={{ 
          margin: 0,
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-sm)'
        }}>
          {MOCK_MOVIES.length} películas en total
        </p>
      </div>
      
      <Button variant="primary" size="sm">
        ➕ Agregar Película
      </Button>
    </div>
    
    <DataTable
      data={MOCK_MOVIES}
      columns={movieColumns}
      variant="striped"
      searchPlaceholder="Buscar películas..."
      pageSize={25}
      emptyTitle="No hay películas en el catálogo"
      emptyDescription="Agrega tu primera película al catálogo"
      emptyIcon="🎬"
    />
  </div>
);

MoviesTable.parameters = {
  docs: {
    description: {
      story: 'Ejemplo para gestión de películas con variante striped, headers contextuales y acciones específicas del dominio.'
    }
  }
};

// ========== VARIANTES ==========
export const VariantDefault = Template.bind({});
VariantDefault.args = {
  data: MOCK_USERS.slice(0, 3),
  columns: userColumns,
  variant: 'default'
};

export const VariantStriped = Template.bind({});
VariantStriped.args = {
  data: MOCK_USERS.slice(0, 3),
  columns: userColumns,
  variant: 'striped'
};

export const VariantBordered = Template.bind({});
VariantBordered.args = {
  data: MOCK_USERS.slice(0, 3),
  columns: userColumns,
  variant: 'bordered'
};

export const VariantCompact = Template.bind({});
VariantCompact.args = {
  data: MOCK_USERS,
  columns: userColumns,
  variant: 'compact'
};

// ========== ESTADOS ==========
export const LoadingState = () => (
  <DataTable
    data={MOCK_USERS}
    columns={userColumns}
    loading={true}
    searchPlaceholder="Cargando datos..."
  />
);

LoadingState.parameters = {
  docs: {
    description: {
      story: 'Estado de loading con skeleton rows animados mientras se cargan los datos del servidor.'
    }
  }
};

export const EmptyState = () => (
  <DataTable
    data={[]}
    columns={userColumns}
    emptyTitle="No hay usuarios registrados"
    emptyDescription="Crea tu primer usuario para comenzar a gestionar tu plataforma"
    emptyIcon="👥"
  />
);

EmptyState.parameters = {
  docs: {
    description: {
      story: 'Estado vacío cuando no hay datos para mostrar, con mensaje personalizable.'
    }
  }
};

export const ErrorState = () => (
  <DataTable
    data={[]}
    columns={userColumns}
    error="Error al conectar con el servidor. Verifica tu conexión a internet."
  />
);

ErrorState.parameters = {
  docs: {
    description: {
      story: 'Estado de error con mensaje personalizable y botón de reintento.'
    }
  }
};

// ========== SIN ACCIONES ==========
export const WithoutActions = Template.bind({});
WithoutActions.args = {
  data: MOCK_USERS.slice(0, 3),
  columns: userColumns,
  showActions: false
};

WithoutActions.parameters = {
  docs: {
    description: {
      story: 'Tabla sin columna de acciones para casos donde solo se muestra información.'
    }
  }
};

// ========== RESPONSIVE DEMO ==========
export const ResponsiveDemo = () => (
  <div>
    <div style={{ 
      marginBottom: 'var(--space-lg)',
      padding: 'var(--space-md)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)'
    }}>
      <h3 style={{ 
        margin: '0 0 var(--space-sm) 0',
        fontSize: 'var(--font-size-base)',
        color: 'var(--text-primary)'
      }}>
        📱 Responsive Design
      </h3>
      <p style={{ 
        margin: 0,
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)'
      }}>
        Cambia el tamaño de la ventana para ver cómo se adapta la tabla en diferentes dispositivos.
      </p>
    </div>
    
    <DataTable
      data={MOCK_MOVIES}
      columns={movieColumns}
      variant="bordered"
      searchPlaceholder="Prueba la búsqueda responsive..."
      pageSize={5}
    />
  </div>
);

ResponsiveDemo.parameters = {
  docs: {
    description: {
      story: 'Demostración del comportamiento responsive del DataTable en diferentes tamaños de pantalla.'
    }
  }
};

// ========== SISTEMA ESTÁNDAR ==========

// Tamaños estándar
export const SystemStandardSizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-lg)' }}>
        Tamaño XS (Extra Small)
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        size="xs"
        pageSize={5}
        showActions={false}
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-lg)' }}>
        Tamaño SM (Small)
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        size="sm"
        pageSize={5}
        showActions={false}
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-lg)' }}>
        Tamaño MD (Medium) - Por defecto
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        size="md"
        pageSize={5}
        showActions={false}
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-lg)' }}>
        Tamaño LG (Large)
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        size="lg"
        pageSize={5}
        showActions={false}
      />
    </div>
  </div>
);

SystemStandardSizes.parameters = {
  docs: {
    description: {
      story: 'Demostración de todos los tamaños estándar del DataTable. El tamaño afecta la tipografía, espaciado y controles.'
    }
  }
};

// Variantes semánticas estándar
export const SystemStandardVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--color-primary-500)' }}>
        Primary - Tablas principales
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        variant="primary"
        pageSize={5}
        showActions={false}
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--color-success-500)' }}>
        Success - Datos confirmados
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        variant="success"
        pageSize={5}
        showActions={false}
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--color-danger-500)' }}>
        Danger - Datos críticos
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        variant="danger"
        pageSize={5}
        showActions={false}
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--color-warning-500)' }}>
        Warning - Datos de atención
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        variant="warning"
        pageSize={5}
        showActions={false}
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
        Neutral - Por defecto
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        variant="neutral"
        pageSize={5}
        showActions={false}
      />
    </div>
  </div>
);

SystemStandardVariants.parameters = {
  docs: {
    description: {
      story: 'Variantes semánticas estándar del DataTable. La variante afecta el color del borde y tema visual general.'
    }
  }
};

// Estados estándar
export const SystemStandardStates = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)' }}>
        Estado Normal
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        pageSize={5}
        showActions={false}
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)' }}>
        Estado Loading
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        loading={true}
        pageSize={5}
        showActions={false}
      />
    </div>
    
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)' }}>
        Estado Disabled
      </h3>
      <DataTable
        data={MOCK_USERS.slice(0, 2)}
        columns={userColumns.slice(0, 3)}
        disabled={true}
        pageSize={5}
        showActions={false}
      />
    </div>
  </div>
);

SystemStandardStates.parameters = {
  docs: {
    description: {
      story: 'Estados estándar del DataTable: normal, loading (con skeletons) y disabled (sin interacción).'
    }
  }
};

// Backward Compatibility Demo
export const BackwardCompatibilityDemo = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div style={{
      padding: 'var(--space-md)',
      backgroundColor: 'var(--color-warning-50)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-warning-300)'
    }}>
      <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--color-warning-700)' }}>
        ⚠️ Demostración Backward Compatibility
      </h3>
      <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-warning-600)' }}>
        Este DataTable usa la prop legacy <code>variant=&quot;striped&quot;</code> que ahora debería ser <code>tableVariant=&quot;striped&quot;</code>. 
        Revisa la consola para ver el deprecation warning.
      </p>
    </div>
    
    <DataTable
      data={MOCK_USERS.slice(0, 3)}
      columns={userColumns}
      variant="striped"  // ← Legacy prop, debería ser tableVariant
      size="md"          // ← Nueva prop estándar
      searchPlaceholder="Buscar con legacy variant..."
      pageSize={5}
    />
  </div>
);

BackwardCompatibilityDemo.parameters = {
  docs: {
    description: {
      story: 'Demostración de backward compatibility. El DataTable mantiene compatibilidad con la prop legacy `variant` mapeándola automáticamente a `tableVariant`, pero muestra un deprecation warning en consola.'
    }
  }
};