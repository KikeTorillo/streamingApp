// Pagination.stories.jsx
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Design System/Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Pagination - Componente Standalone

Componente de paginación **independiente de TanStack Table**, diseñado para casos de uso no-tabulares como grids, listas y resultados de búsqueda.

## 🎯 **Casos de Uso Principales**

### ✅ **Para usar con Pagination:**
- 🏠 **MainPage** - Grid de películas/series
- 🔍 **SearchResults** - Lista de resultados de búsqueda
- 📂 **CategoryPage** - Películas por categoría
- ❤️ **UserFavorites** - Lista de favoritos del usuario
- 📱 **Cualquier contenido paginado** NO tabular

### ❌ **NO usar para:**
- 📊 **DataTable** - Ya tiene paginación TanStack optimizada
- 📋 **Tablas existentes** - Mantener TanStack pagination

## 🚀 **Características Principales**

### **📐 Variantes Disponibles:**
- **\`full\`**: Información completa + selector de tamaño + navegación completa
- **\`simple\`**: Solo información + navegación (sin selector de tamaño)
- **\`compact\`**: Solo navegación esencial (ideal para mobile)

### **📱 Mobile-First Responsive:**
- **Automático**: \`variant="full"\` se convierte en \`compact\` en mobile
- **Touch-friendly**: Botones de 44px mínimo para touch
- **Adaptativo**: Layout optimizado para diferentes pantallas

### **⌨️ Accesibilidad Completa:**
- **ARIA labels** en todos los botones
- **Focus visible** mejorado
- **Alto contraste** compatible
- **Screen reader** optimizado

## 🔧 **API Completa**

\`\`\`jsx
<Pagination
  // Navegación básica (requerida)
  currentPage={page}           // 1-based (más intuitivo que TanStack)
  totalPages={totalPages}      // Total de páginas calculadas
  onPageChange={setPage}       // Callback simple (page) => void
  
  // Información detallada (opcional)
  totalItems={movies.length}   // Total de elementos
  itemsPerPage={pageSize}      // Elementos por página actual
  onItemsPerPageChange={setPageSize}  // Callback (newSize) => void
  itemsPerPageOptions={[10, 25, 50, 100]}  // Opciones selector
  
  // Personalización
  variant="full"               // full, simple, compact
  size="md"                   // sm, md, lg
  showInfo={true}             // Mostrar "Mostrando X de Y"
  showSizeSelector={true}     // Mostrar selector de tamaño
  showFirstLast={true}        // Mostrar botones Primera/Última
  
  // Estados
  disabled={loading}          // Deshabilitar durante loading
  loading={isFetching}        // Mostrar icono de loading
  
  // Responsive
  breakpoint={768}            // Punto de cambio a mobile
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['full', 'simple', 'compact'],
      description: 'Variante de funcionalidad del componente'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño general del componente'
    },
    currentPage: {
      control: 'number',
      description: 'Página actual (1-based, más intuitivo)'
    },
    totalPages: {
      control: 'number',
      description: 'Total de páginas disponibles'
    },
    totalItems: {
      control: 'number',
      description: 'Total de elementos (para información detallada)'
    },
    itemsPerPage: {
      control: 'number',
      description: 'Elementos por página actual'
    },
    showInfo: {
      control: 'boolean',
      description: 'Mostrar información "Mostrando X de Y resultados"'
    },
    showSizeSelector: {
      control: 'boolean',
      description: 'Mostrar selector de elementos por página'
    },
    showFirstLast: {
      control: 'boolean',
      description: 'Mostrar botones Primera/Última página'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga (muestra icono animado)'
    }
  }
};

export default meta;

// ========================================
// 🎯 CASOS DE USO REALES
// ========================================

export const MainPageUseCase = {
  name: '🏠 Caso: MainPage Grid',
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    
    // Simular datos de películas
    const totalMovies = 156;
    const totalPages = Math.ceil(totalMovies / pageSize);
    
    return (
      <div style={{ padding: '2rem', background: 'var(--color-surface-primary)' }}>
        <h3 style={{ marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
          🎬 Películas Populares
        </h3>
        
        {/* Simulación de grid de películas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {Array.from({ length: Math.min(pageSize, totalMovies - (page - 1) * pageSize) }).map((_, index) => (
            <div
              key={index}
              style={{
                height: '300px',
                background: 'var(--color-surface-secondary)',
                borderRadius: 'var(--border-radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-subtle)'
              }}
            >
              Película {(page - 1) * pageSize + index + 1}
            </div>
          ))}
        </div>
        
        <Pagination
          variant="full"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalMovies}
          itemsPerPage={pageSize}
          onPageChange={setPage}
          onItemsPerPageChange={setPageSize}
          itemsPerPageOptions={[12, 20, 36, 48]}
          size="lg"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🏠 **Implementación en MainPage**

**Características específicas:**
- **Grid responsive** de películas
- **Paginación completa** con selector de tamaño
- **Elementos por página** optimizados para grids (12, 20, 36, 48)
- **Información detallada** de elementos mostrados

**Código de implementación:**
\`\`\`jsx
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(20);

const totalMovies = movies.length;
const totalPages = Math.ceil(totalMovies / pageSize);
const currentMovies = movies.slice((page - 1) * pageSize, page * pageSize);

return (
  <>
    <MoviesGrid movies={currentMovies} />
    <Pagination
      variant="full"
      currentPage={page}
      totalPages={totalPages}
      totalItems={totalMovies}
      itemsPerPage={pageSize}
      onPageChange={setPage}
      onItemsPerPageChange={setPageSize}
    />
  </>
);
\`\`\`
        `
      }
    }
  }
};

export const SearchResultsUseCase = {
  name: '🔍 Caso: Resultados de Búsqueda',
  render: () => {
    const [page, setPage] = useState(1);
    
    // Simular resultados de búsqueda
    const searchTerm = "avatar";
    const totalResults = 23;
    const resultsPerPage = 5;
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    
    return (
      <div style={{ padding: '2rem', background: 'var(--color-surface-primary)' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          🔍 Resultados para "{searchTerm}"
        </h3>
        
        {/* Simulación de lista de resultados */}
        <div style={{ marginBottom: '2rem' }}>
          {Array.from({ length: Math.min(resultsPerPage, totalResults - (page - 1) * resultsPerPage) }).map((_, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                marginBottom: '1rem',
                background: 'var(--color-surface-secondary)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '80px',
                height: '120px',
                background: 'var(--color-surface-tertiary)',
                borderRadius: 'var(--border-radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🎬
              </div>
              <div>
                <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                  Avatar: Resultado {(page - 1) * resultsPerPage + index + 1}
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  Descripción del resultado de búsqueda...
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <Pagination
          variant="simple"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalResults}
          itemsPerPage={resultsPerPage}
          onPageChange={setPage}
          showSizeSelector={false}
          size="md"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🔍 **Resultados de Búsqueda**

**Características específicas:**
- **Variant simple** - Sin selector de tamaño (fijo a 5 resultados)
- **Información detallada** - "Mostrando X de Y resultados"
- **Navegación esencial** - Anterior/Siguiente + página actual

**Perfecto para:**
- Resultados de búsqueda de contenido
- Listas filtradas
- Resultados de APIs externas
        `
      }
    }
  }
};

// ========================================
// 📐 VARIANTES Y ESTADOS
// ========================================

export const VariantsFull = {
  name: '📐 Variante: Full',
  render: () => {
    const [page, setPage] = useState(3);
    const [pageSize, setPageSize] = useState(25);
    
    return (
      <Pagination
        variant="full"
        currentPage={page}
        totalPages={10}
        totalItems={250}
        itemsPerPage={pageSize}
        onPageChange={setPage}
        onItemsPerPageChange={setPageSize}
        size="md"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📐 **Variante Full - Funcionalidad Completa**

**Incluye:**
- ✅ **Información detallada** - "Mostrando X de Y resultados"
- ✅ **Selector de tamaño** - Dropdown con opciones
- ✅ **Navegación completa** - Primera/Anterior/Siguiente/Última
- ✅ **Página actual** - "Página X de Y"

**Ideal para:**
- Páginas principales (MainPage)
- Interfaces de administración
- Casos con muchos datos
        `
      }
    }
  }
};

export const VariantsSimple = {
  name: '📐 Variante: Simple',
  render: () => {
    const [page, setPage] = useState(2);
    
    return (
      <Pagination
        variant="simple"
        currentPage={page}
        totalPages={7}
        totalItems={89}
        itemsPerPage={15}
        onPageChange={setPage}
        size="md"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📐 **Variante Simple - Esencial**

**Incluye:**
- ✅ **Información detallada** - "Mostrando X de Y resultados"
- ❌ **Sin selector de tamaño** - Tamaño fijo
- ✅ **Navegación básica** - Anterior/Siguiente
- ✅ **Página actual** - "Página X de Y"

**Ideal para:**
- Resultados de búsqueda
- Listas con tamaño fijo
- Interfaces más limpias
        `
      }
    }
  }
};

export const VariantsCompact = {
  name: '📐 Variante: Compact',
  render: () => {
    const [page, setPage] = useState(5);
    
    return (
      <Pagination
        variant="compact"
        currentPage={page}
        totalPages={12}
        onPageChange={setPage}
        size="md"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📐 **Variante Compact - Mínimo Espacio**

**Incluye:**
- ❌ **Sin información detallada** - Solo navegación
- ❌ **Sin selector de tamaño** - Espacio mínimo
- ✅ **Navegación compacta** - Iconos + números
- ✅ **Formato corto** - "5/12"

**Ideal para:**
- Mobile (automático cuando variant="full")
- Espacios muy reducidos
- Modales pequeños
- Sidebars
        `
      }
    }
  }
};

// ========================================
// 📱 RESPONSIVE Y TAMAÑOS
// ========================================

export const ResponsiveExample = {
  name: '📱 Responsive Automático',
  render: () => {
    const [page, setPage] = useState(2);
    const [pageSize, setPageSize] = useState(20);
    
    return (
      <div>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
          💡 <strong>Tip:</strong> Cambia el tamaño de la ventana para ver cómo se adapta automáticamente.
          En mobile (&lt;768px), variant="full" se convierte en "compact".
        </p>
        
        <Pagination
          variant="full"
          currentPage={page}
          totalPages={8}
          totalItems={160}
          itemsPerPage={pageSize}
          onPageChange={setPage}
          onItemsPerPageChange={setPageSize}
          size="md"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📱 **Responsive Automático**

**Comportamiento adaptativo:**
- **Desktop (≥768px)**: Muestra la variante seleccionada
- **Mobile (<768px)**: variant="full" se convierte automáticamente en "compact"
- **Touch targets**: Botones de mínimo 44px en mobile
- **Layout adaptativo**: Información se reorganiza verticalmente

**Breakpoint customizable:**
\`\`\`jsx
<Pagination
  breakpoint={1024}  // Personalizar punto de cambio
  // ... resto de props
/>
\`\`\`
        `
      }
    }
  }
};

export const AllSizes = {
  name: '📏 Todos los Tamaños',
  render: () => {
    const [page] = useState(2);
    const handlePageChange = () => {};
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Size: Small</h4>
          <Pagination
            variant="simple"
            currentPage={page}
            totalPages={5}
            totalItems={50}
            itemsPerPage={10}
            onPageChange={handlePageChange}
            size="sm"
          />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Size: Medium (Default)</h4>
          <Pagination
            variant="simple"
            currentPage={page}
            totalPages={5}
            totalItems={50}
            itemsPerPage={10}
            onPageChange={handlePageChange}
            size="md"
          />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Size: Large</h4>
          <Pagination
            variant="simple"
            currentPage={page}
            totalPages={5}
            totalItems={50}
            itemsPerPage={10}
            onPageChange={handlePageChange}
            size="lg"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📏 **Sistema de Tamaños**

- **sm**: Compacto, para espacios reducidos
- **md**: Default, uso general
- **lg**: Prominente, para páginas principales
        `
      }
    }
  }
};

// ========================================
// 🔧 ESTADOS Y EDGE CASES
// ========================================

export const LoadingState = {
  name: '⏳ Estado: Loading',
  render: () => {
    const [page, setPage] = useState(3);
    
    return (
      <Pagination
        variant="full"
        currentPage={page}
        totalPages={10}
        totalItems={200}
        itemsPerPage={20}
        onPageChange={setPage}
        loading={true}
        size="md"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### ⏳ **Estado de Carga**

**Características:**
- ✅ **Icono animado** en página actual
- ✅ **Botones habilitados** - Usuario puede navegar
- ✅ **Feedback visual** - Indica que hay operación en progreso

**Uso recomendado:**
\`\`\`jsx
const [loading, setLoading] = useState(false);

const handlePageChange = async (newPage) => {
  setLoading(true);
  await fetchData(newPage);
  setLoading(false);
  setPage(newPage);
};
\`\`\`
        `
      }
    }
  }
};

export const DisabledState = {
  name: '🚫 Estado: Disabled',
  render: () => {
    const [page] = useState(2);
    
    return (
      <Pagination
        variant="full"
        currentPage={page}
        totalPages={8}
        totalItems={160}
        itemsPerPage={20}
        onPageChange={() => {}}
        disabled={true}
        size="md"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🚫 **Estado Deshabilitado**

**Características:**
- ❌ **Todos los controles deshabilitados**
- ⚫ **Opacidad reducida** (0.6)
- 🚫 **No pointer events** - No se puede interactuar

**Casos de uso:**
- Durante operaciones críticas
- Cuando no se debe permitir navegación
- Estados de error que requieren atención
        `
      }
    }
  }
};

export const EdgeCaseSinglePage = {
  name: '🔢 Edge Case: Una Sola Página',
  render: () => {
    const [page] = useState(1);
    
    return (
      <div>
        <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
          Cuando solo hay 1 página, el componente se oculta automáticamente (excepto variant="full").
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <h4>Variant Full (siempre visible):</h4>
          <Pagination
            variant="full"
            currentPage={page}
            totalPages={1}
            totalItems={15}
            itemsPerPage={20}
            onPageChange={() => {}}
          />
        </div>
        
        <div>
          <h4>Variant Simple (se oculta):</h4>
          <Pagination
            variant="simple"
            currentPage={page}
            totalPages={1}
            totalItems={15}
            itemsPerPage={20}
            onPageChange={() => {}}
          />
          <p style={{ color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
            ↑ No se muestra porque solo hay 1 página
          </p>
        </div>
      </div>
    );
  }
};

// ========================================
// 🧪 PLAYGROUND INTERACTIVO
// ========================================

export const Playground = {
  name: '🧪 Playground Interactivo',
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.itemsPerPage || 25);
    
    return (
      <Pagination
        {...args}
        currentPage={page}
        itemsPerPage={pageSize}
        onPageChange={setPage}
        onItemsPerPageChange={setPageSize}
      />
    );
  },
  args: {
    variant: 'full',
    currentPage: 3,
    totalPages: 12,
    totalItems: 287,
    itemsPerPage: 25,
    itemsPerPageOptions: [10, 25, 50, 100],
    size: 'md',
    showInfo: true,
    showSizeSelector: true,
    showFirstLast: true,
    disabled: false,
    loading: false
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🧪 **Playground - Prueba Todas las Opciones**

**Cómo usar:**
1. **Cambia los controles** abajo ⬇️
2. **Prueba la navegación** haciendo click en los botones
3. **Modifica el tamaño** de página con el selector
4. **Experimenta** con diferentes variantes y estados

**Todas las propiedades son interactivas** - los cambios se ven en tiempo real.
        `
      }
    }
  }
};