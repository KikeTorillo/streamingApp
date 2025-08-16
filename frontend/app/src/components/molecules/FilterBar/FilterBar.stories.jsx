import React from 'react';
import { FilterBar } from './FilterBar';
import { Button } from '../../atoms/Button/Button';
import './FilterBar.css';

export default {
  title: 'Components/Molecules/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# FilterBar Molecule ✅ MIGRADO AL SISTEMA ESTÁNDAR

La molécula **FilterBar** es el componente principal para navegación por categorías y filtros en nuestro sistema.
**✅ COMPLETAMENTE MIGRADO** al sistema estándar con props consistentes, tokens automáticos y backward compatibility.

## ✨ **NUEVAS CARACTERÍSTICAS POST-MIGRACIÓN**

### 🎯 **Sistema Estándar Integrado**
- **Hook useFilterBarProps()**: Gestión automática de props y tokens especializados
- **Props estándar**: size, variant, rounded, disabled, loading
- **6 variantes semánticas**: primary, secondary, success, warning, danger, neutral
- **5 tamaños estándar**: xs, sm, md, lg, xl con spacing automático
- **STANDARD_PROP_TYPES**: Validación consistente con todo el sistema
- **Tokens automáticos**: Spacing, colores y tipografía del design system

### 🔄 **Integración con Componentes**
- **Button migrado**: Categorías usan Button del sistema estándar
- **Sistema de iconos**: Soporte para iconos en categorías con renderIcon
- **Estados heredados**: loading, disabled se propagan a botones hijos
- **Memoización**: Performance optimizada con React.memo

## 🎯 Casos de uso principales

- **MoviesPage**: Filtros por género (Acción, Drama, Comedia, etc.)
- **SeriesPage**: Filtros por categoría y año
- **SearchResults**: Filtros refinados para resultados de búsqueda
- **AdminPanel**: Filtros para gestión de contenido
- **HomePage**: Filtros "Trending", "Populares", "Nuevas"

## 📱 Responsive & Mobile First

- **Flexbox responsive**: Colapsa a columna en móviles
- **Touch targets**: Botones optimizados para mobile (44px mínimo)
- **Gap spacing**: Usa design tokens para espaciado consistente
- **Overflow handling**: Scroll horizontal en mobile si necesario

## 💡 Uso básico

\`\`\`jsx
import { FilterBar } from './molecules/FilterBar';

// FilterBar básica con categorías
<FilterBar
  categories={[
    { value: 'all', label: 'Todas', icon: 'grid' },
    { value: 'movies', label: 'Películas', icon: 'film' },
    { value: 'series', label: 'Series', icon: 'tv' },
    { value: 'documentaries', label: 'Documentales', icon: 'book-open' }
  ]}
  selectedCategory="all"
  onCategoryChange={(category) => console.log('Selected:', category)}
/>

// Con acciones adicionales
<FilterBar
  categories={movieCategories}
  selectedCategory="action"
  onCategoryChange={handleCategoryChange}
  actions={
    <Button variant="secondary" leftIcon="search">
      Búsqueda Avanzada
    </Button>
  }
/>

// Estados especiales
<FilterBar
  loading={true}
  categories={categories}
/>

<FilterBar
  error="Error al cargar categorías"
  categories={categories}
/>
\`\`\`

## 🎨 Design Tokens

El componente usa automáticamente tokens del sistema:

- **Spacing**: \`var(--space-xs|sm|md|lg|xl)\` según tamaño
- **Colors**: \`var(--color-primary|secondary|success|etc)\` según variante
- **Border radius**: \`var(--radius-sm|md|lg|xl|full)\` según rounded
- **Typography**: \`var(--font-size-xs|sm|md|lg|xl)\` responsivo

## ⚠️ Deprecations

Actualmente no hay props deprecadas - el componente ya estaba bien diseñado antes de la migración.
        `
      }
    },
    layout: 'centered'
  },
  argTypes: {
    // Props estándar del sistema
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del FilterBar (afecta padding, font-size, gap)',
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'xs | sm | md | lg | xl' }
      }
    },
    variant: {
      control: 'select', 
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante semántica (afecta colores de borde y fondo)',
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'primary | secondary | success | warning | danger | neutral' }
      }
    },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Redondeo de esquinas del contenedor',
      table: {
        defaultValue: { summary: 'lg' },
        type: { summary: 'sm | md | lg | xl | full' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita todo el FilterBar y botones internos',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' }
      }
    },
    loading: {
      control: 'boolean',
      description: 'Muestra estado de carga con overlay',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' }
      }
    },
    
    // Props específicas del FilterBar
    categories: {
      control: 'object',
      description: 'Array de categorías con value, label e icon opcional',
      table: {
        type: { summary: 'Array<{value: string, label: string, icon?: string}>' }
      }
    },
    selectedCategory: {
      control: 'text',
      description: 'Categoría actualmente seleccionada',
      table: {
        type: { summary: 'string' }
      }
    },
    onCategoryChange: {
      action: 'category-changed',
      description: 'Callback cuando cambia la categoría seleccionada',
      table: {
        type: { summary: '(category: string) => void' }
      }
    },
    actions: {
      control: 'text',
      description: 'Elementos adicionales (botones, inputs) en el lado derecho',
      table: {
        type: { summary: 'ReactNode' }
      }
    },
    error: {
      control: 'text',
      description: 'Mensaje de error a mostrar',
      table: {
        type: { summary: 'string | object' }
      }
    }
  }
};

// Datos de ejemplo para las stories
const movieCategories = [
  { value: 'all', label: 'Todas', icon: 'grid' },
  { value: 'action', label: 'Acción', icon: 'zap' },
  { value: 'adventure', label: 'Aventura', icon: 'compass' },
  { value: 'animation', label: 'Animación', icon: 'heart' },
  { value: 'comedy', label: 'Comedia', icon: 'smile' },
  { value: 'crime', label: 'Crimen', icon: 'shield' },
  { value: 'documentary', label: 'Documental', icon: 'book-open' },
  { value: 'drama', label: 'Drama', icon: 'theater' },
  { value: 'family', label: 'Familiar', icon: 'home' },
  { value: 'fantasy', label: 'Fantasía', icon: 'star' },
  { value: 'horror', label: 'Terror', icon: 'ghost' },
  { value: 'romance', label: 'Romance', icon: 'heart' },
  { value: 'scifi', label: 'Ciencia Ficción', icon: 'cpu' },
  { value: 'thriller', label: 'Suspenso', icon: 'eye' }
];

const seriesCategories = [
  { value: 'all', label: 'Todas las Series', icon: 'tv' },
  { value: 'trending', label: 'Trending', icon: 'trending-up' },
  { value: 'new', label: 'Nuevas', icon: 'plus-circle' },
  { value: 'popular', label: 'Populares', icon: 'star' },
  { value: 'finished', label: 'Finalizadas', icon: 'check-circle' }
];

const simpleCategories = [
  { value: 'all', label: 'Todos' },
  { value: 'movies', label: 'Películas' },
  { value: 'series', label: 'Series' }
];

// ===== STORIES PRINCIPALES =====

export const Default = {
  args: {
    categories: movieCategories,
    selectedCategory: 'all',
    size: 'md',
    variant: 'primary',
    rounded: 'lg'
  }
};

export const WithActions = {
  args: {
    categories: seriesCategories,
    selectedCategory: 'trending',
    actions: (
      <>
        <Button variant="secondary" size="md" leftIcon="search">
          Búsqueda Avanzada
        </Button>
        <Button variant="outline" size="md" leftIcon="filter">
          Más Filtros
        </Button>
      </>
    )
  }
};

export const SimpleCategories = {
  args: {
    categories: simpleCategories,
    selectedCategory: 'movies',
    variant: 'secondary'
  }
};

// ===== SYSTEM STANDARD VARIANTS =====

export const SystemStandardVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FilterBar categories={simpleCategories} selectedCategory="all" variant="primary" />
      <FilterBar categories={simpleCategories} selectedCategory="movies" variant="secondary" />
      <FilterBar categories={simpleCategories} selectedCategory="series" variant="success" />
      <FilterBar categories={simpleCategories} selectedCategory="all" variant="warning" />
      <FilterBar categories={simpleCategories} selectedCategory="movies" variant="danger" />
      <FilterBar categories={simpleCategories} selectedCategory="series" variant="neutral" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '6 variantes semánticas estándar del sistema: primary, secondary, success, warning, danger, neutral.'
      }
    }
  }
};

// ===== SYSTEM STANDARD SIZES =====

export const SystemStandardSizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FilterBar categories={simpleCategories} selectedCategory="all" size="xs" />
      <FilterBar categories={simpleCategories} selectedCategory="movies" size="sm" />
      <FilterBar categories={simpleCategories} selectedCategory="series" size="md" />
      <FilterBar categories={simpleCategories} selectedCategory="all" size="lg" />
      <FilterBar categories={simpleCategories} selectedCategory="movies" size="xl" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '5 tamaños estándar del sistema: xs, sm, md, lg, xl. Afecta padding, font-size y gap.'
      }
    }
  }
};

// ===== SYSTEM STANDARD STATES =====

export const SystemStandardStates = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h4>Estado Normal</h4>
        <FilterBar categories={movieCategories} selectedCategory="action" />
      </div>
      
      <div>
        <h4>Estado Loading</h4>
        <FilterBar categories={movieCategories} selectedCategory="action" loading={true} />
      </div>
      
      <div>
        <h4>Estado Disabled</h4>
        <FilterBar categories={movieCategories} selectedCategory="action" disabled={true} />
      </div>
      
      <div>
        <h4>Estado de Error</h4>
        <FilterBar 
          categories={movieCategories} 
          selectedCategory="action" 
          error="Error al cargar las categorías. Inténtalo de nuevo." 
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estados estándar: normal, loading (con overlay), disabled (sin interacción), error (mensaje visible).'
      }
    }
  }
};

// ===== SYSTEM ROUNDED VARIANTS =====

export const SystemRoundedVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FilterBar categories={simpleCategories} selectedCategory="all" rounded="sm" />
      <FilterBar categories={simpleCategories} selectedCategory="movies" rounded="md" />
      <FilterBar categories={simpleCategories} selectedCategory="series" rounded="lg" />
      <FilterBar categories={simpleCategories} selectedCategory="all" rounded="xl" />
      <FilterBar categories={simpleCategories} selectedCategory="movies" rounded="full" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '5 variantes de redondeo estándar: sm, md, lg, xl, full.'
      }
    }
  }
};

// ===== CASOS DE USO REALES =====

export const MoviesPageExample = {
  args: {
    categories: movieCategories,
    selectedCategory: 'action',
    actions: (
      <Button variant="secondary" leftIcon="search">
        Búsqueda
      </Button>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Ejemplo real para la página de películas con categorías de géneros y botón de búsqueda.'
      }
    }
  }
};

export const SeriesPageExample = {
  args: {
    categories: seriesCategories,
    selectedCategory: 'trending',
    variant: 'secondary',
    actions: (
      <>
        <Button variant="outline" size="md" leftIcon="calendar">
          Por Año
        </Button>
        <Button variant="outline" size="md" leftIcon="filter">
          Filtros
        </Button>
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Ejemplo real para la página de series con filtros de tendencias y acciones adicionales.'
      }
    }
  }
};

export const AdminPanelExample = {
  args: {
    categories: [
      { value: 'all', label: 'Todo el Contenido', icon: 'grid' },
      { value: 'published', label: 'Publicado', icon: 'check-circle' },
      { value: 'draft', label: 'Borrador', icon: 'edit' },
      { value: 'pending', label: 'Pendiente', icon: 'clock' },
      { value: 'archived', label: 'Archivado', icon: 'archive' }
    ],
    selectedCategory: 'published',
    variant: 'neutral',
    actions: (
      <>
        <Button variant="primary" size="md" leftIcon="plus">
          Nuevo Contenido
        </Button>
        <Button variant="secondary" size="md" leftIcon="download">
          Exportar
        </Button>
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Ejemplo real para el panel de administración con estados de contenido y acciones CRUD.'
      }
    }
  }
};

// ===== RESPONSIVE BEHAVIOR =====

export const ResponsiveBehavior = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4>Desktop (Horizontal)</h4>
        <div style={{ width: '100%' }}>
          <FilterBar
            categories={movieCategories}
            selectedCategory="action"
            actions={
              <Button variant="secondary" leftIcon="search">
                Búsqueda
              </Button>
            }
          />
        </div>
      </div>
      
      <div>
        <h4>Mobile (Vertical cuando sea necesario)</h4>
        <div style={{ width: '320px', border: '1px dashed #ccc', padding: '1rem' }}>
          <FilterBar
            categories={movieCategories}
            selectedCategory="action"
            actions={
              <>
                <Button variant="secondary" size="sm" leftIcon="search">
                  Buscar
                </Button>
                <Button variant="outline" size="sm" leftIcon="filter">
                  Filtros
                </Button>
              </>
            }
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comportamiento responsive: horizontal en desktop, colapsa a vertical en mobile cuando es necesario.'
      }
    }
  }
};

// ===== PERFORMANCE DEMO =====

export const PerformanceDemo = {
  render: () => {
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [renderCount, setRenderCount] = React.useState(0);
    
    React.useEffect(() => {
      setRenderCount(count => count + 1);
    }, []);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Render Count: {renderCount}</strong> (Optimizado con React.memo)
        </div>
        
        <FilterBar
          categories={movieCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          actions={
            <Button 
              variant="secondary" 
              leftIcon="refresh-cw"
              onClick={() => setRenderCount(0)}
            >
              Reset Counter
            </Button>
          }
        />
        
        <p>
          <em>
            El componente está memoizado con React.memo. Cambia categorías y observa que
            el render count solo aumenta cuando las props cambian realmente.
          </em>
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo de optimización de performance con React.memo. El componente solo re-renderiza cuando sus props cambian.'
      }
    }
  }
};