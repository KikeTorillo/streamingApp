// SearchBar.stories.jsx
import { SearchBar } from './SearchBar';

const meta = {
  title: 'Design System/Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# SearchBar - Componente Avanzado de Búsqueda

El SearchBar es una molécula del design system que ofrece múltiples variantes para diferentes necesidades:

## 🔄 **Estrategia de Migración Gradual**

### Variantes Disponibles:
- **\`simple\`**: Equivalente al TextInput actual (100% retrocompatible con AppHeader)
- **\`advanced\`**: Con todas las funciones nuevas (autocomplete, historial, filtros)
- **\`compact\`**: Para espacios reducidos

### ✨ **Nuevas Funcionalidades** (solo variant="advanced"):
- ✅ **Búsqueda en tiempo real** con debounce optimizado
- ✅ **Autocomplete inteligente** con sugerencias de contenido  
- ✅ **Historial persistente** de búsquedas del usuario
- ✅ **Shortcuts de teclado** (Ctrl+K para abrir, Escape para cerrar)
- ✅ **Navegación por teclado** en sugerencias (arrow keys, enter)
- ✅ **Estados elegantes** (loading, empty, error)

## 🎯 **Casos de Uso:**
- **MainPage**: Búsqueda principal de contenido
- **AppHeader**: Búsqueda en header (migración gradual)  
- **Admin Panel**: Búsqueda de usuarios, movies, series
- **Futuras páginas**: Cualquier página que necesite búsqueda

## 🔧 **Migration Path:**
1. **Fase 2A**: Implementar SearchBar con variantes ✅
2. **Fase 2B**: Migrar AppHeader gradualmente (mantener retrocompatibilidad)
3. **Fase 2C**: Actualizar MainPage para usar nueva lógica
4. **Fase 2D**: 100% retrocompatibilidad garantizada
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['simple', 'advanced', 'compact'],
      description: 'Variante del SearchBar para migración gradual'
    },
    size: {
      control: 'select', 
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del componente'
    },
    value: {
      control: 'text',
      description: 'Valor controlado del input (retrocompatibilidad)'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder del input'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado'
    },
    loading: {
      control: 'boolean', 
      description: 'Estado de carga'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa todo el ancho disponible'
    },
    enableHistory: {
      control: 'boolean',
      description: 'Activar historial persistente (solo advanced)'
    },
    enableShortcuts: {
      control: 'boolean', 
      description: 'Activar shortcuts de teclado (solo advanced)'
    },
    showSuggestions: {
      control: 'boolean',
      description: 'Mostrar dropdown de sugerencias (solo advanced)'
    },
    loadingSuggestions: {
      control: 'boolean',
      description: 'Estado de carga de sugerencias'
    },
    debounceMs: {
      control: 'number',
      description: 'Tiempo de debounce para búsqueda automática (ms)'
    },
    maxSuggestions: {
      control: 'number', 
      description: 'Máximo número de sugerencias a mostrar'
    },
    error: {
      control: 'text',
      description: 'Mensaje de error'
    }
  }
};

export default meta;

// Story base
const Template = (args) => <SearchBar {...args} />;

// ========================================
// 🔄 MIGRACIÓN GRADUAL - Retrocompatibilidad
// ========================================

export const Simple = {
  name: '🔄 Simple (Retrocompatible)',
  args: {
    variant: 'simple',
    placeholder: 'Buscar películas, series...',
    size: 'md'
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🎯 **Equivalente Exact al AppHeader Actual**

Esta variante mantiene **100% retrocompatibilidad** con el uso actual en AppHeader:

\`\`\`jsx
// ✅ ANTES (AppHeader actual)
<TextInput
  type="search"
  placeholder="Buscar películas, series..."
  value={searchValue}
  onChange={onSearchChange}
  leftIcon="🔍"
  size="md"
/>

// ✅ DESPUÉS (Migration compatible)
<SearchBar
  variant="simple"
  placeholder="Buscar películas, series..."
  value={searchValue}
  onChange={onSearchChange}
  size="md"
/>
\`\`\`

**No hay cambios en el API** - Solo reemplazar el componente.
        `
      }
    }
  }
};

export const Compact = {
  name: '🔄 Compact (Espacios Reducidos)',
  args: {
    variant: 'compact',
    placeholder: 'Buscar...',
    size: 'sm',
    fullWidth: false
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📱 **Para Espacios Reducidos**

Ideal para:
- **Mobile headers**  
- **Sidebars**
- **Modales pequeños**
- **Formularios compactos**
        `
      }
    }
  }
};

// ========================================
// ✨ NUEVAS FUNCIONALIDADES - Advanced
// ========================================

export const Advanced = {
  name: '✨ Advanced (Todas las funciones)',
  args: {
    variant: 'advanced',
    placeholder: 'Buscar películas, series, actores...',
    size: 'lg',
    enableHistory: true,
    enableShortcuts: true,
    showSuggestions: true,
    suggestions: [
      { title: 'Avatar: The Way of Water', category: 'Películas', value: 'avatar-2' },
      { title: 'The Batman', category: 'Películas', value: 'batman-2022' },
      { title: 'Stranger Things', category: 'Series', value: 'stranger-things' },
      { title: 'House of the Dragon', category: 'Series', value: 'house-dragon' },
      { title: 'Top Gun: Maverick', category: 'Películas', value: 'top-gun-2' }
    ],
    debounceMs: 300,
    maxSuggestions: 5
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🚀 **Todas las Funciones Avanzadas**

**Nuevas funcionalidades:**
- ⌨️  **Shortcuts**: \`Ctrl + K\` para abrir búsqueda
- 🕒 **Historial persistente** (localStorage)  
- 💡 **Sugerencias inteligentes** con categorías
- ⏱️  **Debounce** optimizado (300ms default)
- 🎹 **Navegación por teclado** (arrows, enter, escape)
- 🎯 **Búsqueda múltiple** (título, actores, director)

**Keyboard Navigation:**
- \`↑ ↓\` - Navegar sugerencias
- \`Enter\` - Seleccionar/buscar
- \`Escape\` - Cerrar dropdown
- \`Ctrl + K\` - Abrir búsqueda
        `
      }
    }
  }
};

export const AdvancedWithLoading = {
  name: '✨ Advanced con Loading',
  args: {
    variant: 'advanced',
    placeholder: 'Buscando contenido...',
    loading: true,
    loadingSuggestions: true,
    showSuggestions: true,
    enableHistory: true
  },
  parameters: {
    docs: {
      description: {
        story: `
### ⏳ **Estados de Carga Elegantes**

- **Input loading**: Icono animado en lugar de search
- **Suggestions loading**: Mensaje en dropdown
- **Debounce optimizado**: No busca en cada keystroke
        `
      }
    }
  }
};

export const AdvancedWithError = {
  name: '✨ Advanced con Error',
  args: {
    variant: 'advanced', 
    placeholder: 'Buscar contenido...',
    error: 'Error al conectar con el servidor. Verifica tu conexión.',
    showSuggestions: true
  },
  parameters: {
    docs: {
      description: {
        story: `
### ❌ **Manejo de Errores**

- **Error message**: Debajo del input con icono
- **Estado visual**: Border rojo en error
- **Accesibilidad**: Mensaje con \`role="alert"\`
        `
      }
    }
  }
};

// ========================================
// 📱 RESPONSIVE Y TAMAÑOS
// ========================================

export const Sizes = {
  name: '📏 Todos los Tamaños',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SearchBar variant="simple" size="xs" placeholder="Extra Small (xs)" />
      <SearchBar variant="simple" size="sm" placeholder="Small (sm)" />
      <SearchBar variant="simple" size="md" placeholder="Medium (md) - Default" />
      <SearchBar variant="simple" size="lg" placeholder="Large (lg)" />
      <SearchBar variant="simple" size="xl" placeholder="Extra Large (xl)" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 📐 **Sistema de Tamaños Consistente**

- **xs**: 200px max - Para mobile compacto
- **sm**: 280px max - Para sidebars
- **md**: 400px max - Default, uso general  
- **lg**: 500px max - Headers principales
- **xl**: 600px max - Páginas de búsqueda dedicadas
        `
      }
    }
  }
};

export const FullWidth = {
  name: '📱 Full Width (Responsive)',
  args: {
    variant: 'advanced',
    placeholder: 'Búsqueda full width...',
    fullWidth: true,
    size: 'md',
    showSuggestions: true,
    suggestions: [
      { title: 'Resultado de prueba', category: 'Películas' }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📱 **Responsive Full Width**

- **fullWidth**: Ocupa 100% del contenedor
- **Mobile optimized**: Dropdown se ajusta a pantalla
- **Touch friendly**: Tamaños optimizados para touch
        `
      }
    }
  }
};

// ========================================
// 🎨 CASOS DE USO REALES
// ========================================

export const MainPageUseCase = {
  name: '🎯 Caso: MainPage',
  args: {
    variant: 'advanced',
    placeholder: 'Buscar películas y series...',
    size: 'lg',
    fullWidth: true,
    enableHistory: true,
    enableShortcuts: true,
    showSuggestions: true,
    suggestions: [
      { title: 'Avatar: The Way of Water', category: 'Películas' },
      { title: 'Stranger Things 4', category: 'Series' },
      { title: 'The Batman', category: 'Películas' },
      { title: 'House of the Dragon', category: 'Series' }
    ],
    debounceMs: 250
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🏠 **Implementación en MainPage**

**Características:**
- **Búsqueda en tiempo real** con debounce 250ms
- **Historial persistente** para UX mejorada
- **Sugerencias de contenido** basadas en catálogo
- **Shortcuts Ctrl+K** para acceso rápido
- **Full width** en mobile, tamaño controlado en desktop

**Integración:**
\`\`\`jsx
<SearchBar
  variant="advanced"
  value={searchTerm}
  onChange={handleSearchChange}
  onSearch={handleSearch}
  placeholder="Buscar películas y series..."
  suggestions={contentSuggestions}
  enableHistory
  enableShortcuts
  size="lg"
  fullWidth
/>
\`\`\`
        `
      }
    }
  }
};

export const AppHeaderMigration = {
  name: '🔄 Caso: AppHeader (Migración)',
  args: {
    variant: 'simple',
    placeholder: 'Buscar películas, series...',
    size: 'md'
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🔄 **Migración de AppHeader**

**Paso 1 - Reemplazo directo (0 breaking changes):**
\`\`\`jsx
// ANTES
<TextInput
  type="search"
  placeholder={searchPlaceholder}
  value={searchValue}
  onChange={onSearchChange}
  leftIcon="🔍"
  size="md"
/>

// DESPUÉS - Mismo API, mejores features
<SearchBar
  variant="simple"
  placeholder={searchPlaceholder}
  value={searchValue} 
  onChange={onSearchChange}
  size="md"
/>
\`\`\`

**Paso 2 - Upgrade gradual (futuro):**
\`\`\`jsx
<SearchBar
  variant="advanced"  // Upgrade cuando esté listo
  // ... resto de props iguales
  enableShortcuts
  showSuggestions
/>
\`\`\`

✅ **100% retrocompatibilidad garantizada**
        `
      }
    }
  }
};

export const AdminPanelUseCase = {
  name: '🎯 Caso: Admin Panel',
  args: {
    variant: 'advanced',
    placeholder: 'Buscar usuarios, películas, series...',
    size: 'md',
    enableHistory: true,
    showSuggestions: true,
    suggestions: [
      { title: 'Juan Pérez', category: 'Usuarios' },
      { title: 'Avatar 2', category: 'Películas' },
      { title: 'Breaking Bad', category: 'Series' }
    ],
    debounceMs: 500 // Más lento para admin
  },
  parameters: {
    docs: {
      description: {
        story: `
### ⚙️ **Admin Panel - Búsqueda Universal**

**Características específicas:**
- **Debounce 500ms** (más lento, menos requests)
- **Búsqueda multi-entidad** (users, movies, series)
- **Historial de búsquedas** admin
- **Categorización** por tipo de contenido

**Casos de uso:**
- Buscar usuarios por nombre/email
- Buscar contenido para editar
- Filtrado rápido en listas grandes
        `
      }
    }
  }
};

// ========================================  
// 🧪 PLAYGROUND INTERACTIVO
// ========================================

export const Playground = {
  name: '🧪 Playground Interactivo',
  args: {
    variant: 'advanced',
    placeholder: 'Prueba todas las funciones...',
    size: 'lg',
    enableHistory: true,
    enableShortcuts: true, 
    showSuggestions: true,
    suggestions: [
      { title: 'Avatar: The Way of Water', category: 'Películas' },
      { title: 'Stranger Things', category: 'Series' }, 
      { title: 'The Batman', category: 'Películas' },
      { title: 'House of the Dragon', category: 'Series' },
      { title: 'Top Gun: Maverick', category: 'Películas' }
    ],
    debounceMs: 300,
    maxSuggestions: 5,
    loading: false,
    loadingSuggestions: false,
    disabled: false,
    fullWidth: false,
    error: ''
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🧪 **Playground - Prueba Todas las Funciones**

**Cómo probar:**
1. **Escribe** para ver sugerencias
2. **Usa ↑↓** para navegar 
3. **Presiona Enter** para seleccionar
4. **Prueba Ctrl+K** (shortcuts)
5. **Cambia los controles** abajo ⬇️

**Todas las propiedades son interactivas** - cambia los valores en "Controls" para ver el efecto en tiempo real.
        `
      }
    }
  }
};