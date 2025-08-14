// Breadcrumb.stories.jsx
import { Breadcrumb } from './Breadcrumb';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Components/Molecules/Breadcrumb',
  component: Breadcrumb,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Breadcrumb Navigation - Navegación Jerárquica

Componente para mostrar la ruta jerárquica del usuario en la aplicación, facilitando la navegación y orientación.

## 🍞 **¿Qué es un Breadcrumb?**

Un breadcrumb muestra la **ruta de navegación** desde la página inicial hasta la página actual, como las migajas que dejaba Hansel y Gretel.

### **Ejemplo Visual:**
\`\`\`
🏠 Inicio > ⚙️ Admin > 👥 Usuarios > ➕ Crear Usuario
   ↑        ↑        ↑           ↑
clickable clickable clickable  current (no clickable)
\`\`\`

## 🎯 **Casos de Uso en StreamingApp**

### ✅ **Admin Panel:**
- **Users**: Admin > Usuarios > Crear Usuario
- **Movies**: Admin > Películas > Editar Película
- **Series**: Admin > Series > Temporada 1 > Episodios

### ✅ **Content Pages:**
- **Movie Detail**: Inicio > Películas > Acción > Avatar
- **Series Detail**: Inicio > Series > Drama > Breaking Bad
- **Category**: Inicio > Películas > Acción

### ✅ **Settings:**
- **Profile**: Configuración > Perfil > Cambiar Contraseña
- **Privacy**: Configuración > Privacidad > Gestión de Datos

## 🚀 **Características Principales**

### **📐 Variantes:**
- **\`default\`**: Con fondos suaves y hover effects
- **\`simple\`**: Solo texto, sin fondos
- **\`compact\`**: Espaciado mínimo

### **📱 Responsive Automático:**
- **Desktop**: Muestra todos los items
- **Mobile**: Colapsa automáticamente con dropdown
- **Overflow**: Maneja rutas largas inteligentemente

### **🔧 Integración React Router:**
- **Navegación automática** con \`Link\` component
- **Custom link component** compatible
- **Click handlers** personalizables

### **⌨️ Accesibilidad Completa:**
- **ARIA navigation** landmarks
- **Screen reader** optimizado  
- **Keyboard navigation** completa
- **Focus management** proper

## 🔧 **API Completa**

\`\`\`jsx
<Breadcrumb
  // Items de navegación (requerido)
  items={[
    { label: 'Admin', to: '/admin', icon: 'settings' },
    { label: 'Usuarios', to: '/admin/users', icon: 'users' },
    { label: 'Crear Usuario' } // Página actual (sin 'to')
  ]}
  
  // Personalización visual
  variant="default"           // default, simple, compact
  size="md"                  // sm, md, lg
  separator=">"              // Separador entre items
  showHome={true}            // Mostrar item de inicio automático
  showIcons={true}           // Mostrar iconos de items
  
  // Comportamiento responsive  
  maxItems={4}               // Máximo items antes de colapsar
  collapseAt={768}           // Breakpoint para mobile
  alwaysShowCurrent={true}   // Siempre mostrar página actual
  
  // Navegación
  onItemClick={handleClick}  // Callback personalizado
  linkComponent={Link}       // Componente de link (React Router)
  
  // Estados
  disabled={loading}         // Deshabilitar durante loading
  loading={isFetching}       // Mostrar icono de loading
  
  // Personalización del item Home
  homeItem={{
    label: 'Inicio',
    to: '/',
    icon: 'home'
  }}
/>
\`\`\`

## 🔄 **Generación Automática**

Para generar breadcrumbs automáticamente desde la ruta:

\`\`\`jsx
import { useLocation } from 'react-router-dom';

const generateBreadcrumbs = (pathname) => {
  const routes = {
    '/admin': { label: 'Admin', icon: 'settings' },
    '/admin/users': { label: 'Usuarios', icon: 'users' },
    '/admin/movies': { label: 'Películas', icon: 'film' }
  };
  
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    return routes[path] || { label: segment };
  });
};

// En tu componente
const location = useLocation();
const breadcrumbItems = generateBreadcrumbs(location.pathname);

<Breadcrumb items={breadcrumbItems} />
\`\`\`
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'simple', 'compact'],
      description: 'Variante visual del componente'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño general del componente'
    },
    separator: {
      control: 'text',
      description: 'Carácter separador entre items'
    },
    maxItems: {
      control: 'number',
      description: 'Máximo items antes de colapsar'
    },
    showHome: {
      control: 'boolean',
      description: 'Mostrar item Home automáticamente'
    },
    showIcons: {
      control: 'boolean',
      description: 'Mostrar iconos en los items'
    },
    collapseAt: {
      control: 'number',
      description: 'Breakpoint (px) para colapsar en mobile'
    },
    alwaysShowCurrent: {
      control: 'boolean',
      description: 'Siempre mostrar página actual cuando colapse'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga (icono en página actual)'
    }
  }
};

export default meta;

// ========================================
// 🎯 CASOS DE USO REALES
// ========================================

export const AdminPanelUseCase = {
  name: '⚙️ Caso: Admin Panel',
  render: () => (
    <div style={{ padding: '2rem', background: 'var(--color-surface-primary)' }}>
      <h3 style={{ marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
        👥 Crear Usuario - Admin Panel
      </h3>
      
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin', icon: 'settings' },
          { label: 'Usuarios', to: '/admin/users', icon: 'users' },
          { label: 'Crear Usuario' } // Página actual (sin link)
        ]}
        variant="default"
        size="md"
      />
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: 'var(--color-surface-secondary)', 
        borderRadius: 'var(--border-radius-md)',
        border: '1px solid var(--color-border-subtle)'
      }}>
        <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
          📋 Formulario de Creación de Usuario
        </h4>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          El usuario sabe exactamente dónde está: <strong>Admin → Usuarios → Crear Usuario</strong>
          <br />
          Puede hacer click en "Admin" o "Usuarios" para navegar hacia atrás.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### ⚙️ **Admin Panel Navigation**

**Implementación típica en páginas de admin:**
\`\`\`jsx
// En UsersCreatePage.jsx
<Breadcrumb
  items={[
    { label: 'Admin', to: '/admin', icon: 'settings' },
    { label: 'Usuarios', to: '/admin/users', icon: 'users' },
    { label: 'Crear Usuario' } // Sin 'to' = página actual
  ]}
/>
\`\`\`

**Beneficios:**
- ✅ Usuario siempre sabe dónde está
- ✅ Navegación rápida a secciones anteriores
- ✅ Menos clicks para volver atrás
        `
      }
    }
  }
};

export const MovieDetailUseCase = {
  name: '🎬 Caso: Movie Detail',
  render: () => (
    <div style={{ padding: '2rem', background: 'var(--color-surface-primary)' }}>
      <h3 style={{ marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
        🎬 Avatar: The Way of Water
      </h3>
      
      <Breadcrumb
        items={[
          { label: 'Películas', to: '/movies', icon: 'film' },
          { label: 'Ciencia Ficción', to: '/movies/sci-fi', icon: 'zap' },
          { label: 'Avatar: The Way of Water' } // Página actual
        ]}
        variant="default"
        size="md"
      />
      
      <div style={{ 
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        <div style={{
          width: '200px',
          height: '300px',
          background: 'var(--color-surface-secondary)',
          borderRadius: 'var(--border-radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem'
        }}>
          🎬
        </div>
        <div>
          <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            Avatar: The Way of Water (2022)
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            El usuario llegó navegando: <strong>Inicio → Películas → Ciencia Ficción → Avatar</strong>
            <br />
            Puede regresar fácilmente a ver más películas de Ciencia Ficción o todas las películas.
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 🎬 **Movie Detail Navigation**

**Perfect para content discovery:**
\`\`\`jsx
// En MoviesDetailPage.jsx
<Breadcrumb
  items={[
    { label: 'Películas', to: '/movies', icon: 'film' },
    { label: movie.category, to: \`/movies/\${movie.categorySlug}\`, icon: 'tag' },
    { label: movie.title } // Página actual
  ]}
/>
\`\`\`

**Mejora la experiencia:**
- 🔍 **Content discovery** - Fácil explorar más del mismo género
- 🔄 **Navigation patterns** - Usuarios entienden la jerarquía
- 📱 **Mobile friendly** - Colapsa automáticamente
        `
      }
    }
  }
};

export const SettingsUseCase = {
  name: '⚙️ Caso: Settings Deep',
  render: () => (
    <div style={{ padding: '2rem', background: 'var(--color-surface-primary)' }}>
      <h3 style={{ marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
        🔒 Gestión de Datos Personales
      </h3>
      
      <Breadcrumb
        items={[
          { label: 'Configuración', to: '/settings', icon: 'settings' },
          { label: 'Privacidad', to: '/settings/privacy', icon: 'shield' },
          { label: 'Gestión de Datos' } // Página actual
        ]}
        variant="default"
        size="md"
      />
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: 'var(--color-surface-secondary)', 
        borderRadius: 'var(--border-radius-md)',
        border: '1px solid var(--color-border-subtle)'
      }}>
        <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
          🔒 Configuración de Privacidad
        </h4>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Navegación profunda en settings: <strong>Configuración → Privacidad → Gestión de Datos</strong>
          <br />
          Sin breadcrumb, el usuario se perdería fácilmente en esta jerarquía de 3 niveles.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### ⚙️ **Settings Deep Navigation**

**Esencial para configuraciones complejas:**
\`\`\`jsx
// En SettingsDataManagementPage.jsx
<Breadcrumb
  items={[
    { label: 'Configuración', to: '/settings', icon: 'settings' },
    { label: 'Privacidad', to: '/settings/privacy', icon: 'shield' },
    { label: 'Gestión de Datos' }
  ]}
/>
\`\`\`

**Crítico para UX:**
- 🗺️ **Orientación** - Usuarios no se pierden en configuraciones profundas  
- ⚡ **Navegación rápida** - Volver a sección de privacidad o configuración general
- 🧠 **Mental model** - Entender estructura de configuraciones
        `
      }
    }
  }
};

// ========================================
// 📐 VARIANTES VISUALES
// ========================================

export const VariantDefault = {
  name: '📐 Variante: Default',
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
        Default - Con fondos y hover effects
      </h4>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin', icon: 'settings' },
          { label: 'Películas', to: '/admin/movies', icon: 'film' },
          { label: 'Editar Película' }
        ]}
        variant="default"
        size="md"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 📐 **Variante Default**

**Características:**
- ✅ **Fondos suaves** en items
- ✅ **Hover effects** elegantes  
- ✅ **Item activo destacado** con background
- ✅ **Perfect para interfaces principales**
        `
      }
    }
  }
};

export const VariantSimple = {
  name: '📐 Variante: Simple',
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
        Simple - Solo texto, sin fondos
      </h4>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin', icon: 'settings' },
          { label: 'Películas', to: '/admin/movies', icon: 'film' },
          { label: 'Editar Película' }
        ]}
        variant="simple"
        size="md"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 📐 **Variante Simple**

**Características:**
- ❌ **Sin fondos** - Solo texto
- ✅ **Hover color change** - Cambia a color primario
- ✅ **Más minimalista** 
- ✅ **Perfect para interfaces limpias**
        `
      }
    }
  }
};

export const VariantCompact = {
  name: '📐 Variante: Compact',
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
        Compact - Espaciado mínimo
      </h4>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin', icon: 'settings' },
          { label: 'Películas', to: '/admin/movies', icon: 'film' },
          { label: 'Editar Película' }
        ]}
        variant="compact"
        size="md"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 📐 **Variante Compact**

**Características:**
- 📦 **Espaciado mínimo** entre elementos
- 📱 **Perfect para mobile**
- 🏠 **Espacios reducidos** como modales
- ✅ **Funcionalidad completa** en menos espacio
        `
      }
    }
  }
};

// ========================================
// 📱 RESPONSIVE Y COLAPSO
// ========================================

export const ResponsiveCollapse = {
  name: '📱 Responsive Collapse',
  render: () => (
    <div style={{ padding: '2rem' }}>
      <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
        💡 <strong>Tip:</strong> Cambia el ancho de la ventana o usa las dev tools para ver cómo colapsa automáticamente.
        <br />
        En mobile (&lt;768px) o cuando hay más de 4 items, se activa el collapse inteligente.
      </p>
      
      <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
        Ruta larga (6 niveles) - Se colapsa automáticamente:
      </h4>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin', icon: 'settings' },
          { label: 'Contenido', to: '/admin/content', icon: 'folder' },
          { label: 'Series', to: '/admin/content/series', icon: 'film' },
          { label: 'Breaking Bad', to: '/admin/content/series/breaking-bad', icon: 'star' },
          { label: 'Temporada 1', to: '/admin/content/series/breaking-bad/season-1', icon: 'list' },
          { label: 'Episodio 1' }
        ]}
        variant="default"
        size="md"
        maxItems={4}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
### 📱 **Responsive Collapse Automático**

**Comportamiento inteligente:**
- **Desktop**: Muestra hasta \`maxItems\` (default: 4)
- **Overflow**: Colapsa a "Primera ... Penúltima Actual"
- **Mobile**: Colapsa automáticamente en \`collapseAt\` (default: 768px)
- **Dropdown**: Items colapsados accesibles via dropdown

**Ejemplo de colapso:**
\`\`\`
// Antes (6 items)
Admin > Contenido > Series > Breaking Bad > Temporada 1 > Episodio 1

// Después (collapsed)
Admin > ... > Temporada 1 > Episodio 1
       ↑
   [dropdown con: Contenido, Series, Breaking Bad]
\`\`\`
        `
      }
    }
  }
};

// ========================================
// 🔧 ESTADOS Y CONFIGURACIÓN
// ========================================

export const CustomSeparator = {
  name: '🔧 Separadores Personalizados',
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {[
        { separator: '>', label: 'Default (>)' },
        { separator: '/', label: 'Slash (/)' },
        { separator: '•', label: 'Bullet (•)' },
        { separator: '→', label: 'Arrow (→)' },
        { separator: '|', label: 'Pipe (|)' }
      ].map(({ separator, label }) => (
        <div key={separator}>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
            {label}
          </h4>
          <Breadcrumb
            items={[
              { label: 'Inicio', to: '/', icon: 'home' },
              { label: 'Películas', to: '/movies', icon: 'film' },
              { label: 'Avatar' }
            ]}
            separator={separator}
            variant="default"
          />
        </div>
      ))}
    </div>
  )
};

export const WithoutHome = {
  name: '🏠 Sin Home Automático',
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
        showHome={false} - Sin item Home automático
      </h4>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin', icon: 'settings' },
          { label: 'Usuarios', to: '/admin/users', icon: 'users' },
          { label: 'Crear Usuario' }
        ]}
        showHome={false} // ← No agrega Home automáticamente
        variant="default"
      />
      
      <h4 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
        showHome={true} - Con Home automático (default)
      </h4>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin', icon: 'settings' },
          { label: 'Usuarios', to: '/admin/users', icon: 'users' },
          { label: 'Crear Usuario' }
        ]}
        showHome={true} // ← Agrega 🏠 Inicio automáticamente
        variant="default"
      />
    </div>
  )
};

export const LoadingState = {
  name: '⏳ Estado Loading',
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
        loading={true} - Icono animado en página actual
      </h4>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin', icon: 'settings' },
          { label: 'Películas', to: '/admin/movies', icon: 'film' },
          { label: 'Guardando Película...' } // Página actual con loading
        ]}
        loading={true} // ← Muestra icono loader en página actual
        variant="default"
      />
    </div>
  )
};

export const DisabledState = {
  name: '🚫 Estado Disabled',
  render: () => (
    <div style={{ padding: '2rem' }}>
      <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
        disabled={true} - No se puede interactuar
      </h4>
      <Breadcrumb
        items={[
          { label: 'Admin', to: '/admin', icon: 'settings' },
          { label: 'Películas', to: '/admin/movies', icon: 'film' },
          { label: 'Editar Película' }
        ]}
        disabled={true} // ← Todos los links deshabilitados
        variant="default"
      />
    </div>
  )
};

// ========================================
// 📏 TAMAÑOS
// ========================================

export const AllSizes = {
  name: '📏 Todos los Tamaños',
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          Size: Small
        </h4>
        <Breadcrumb
          items={[
            { label: 'Admin', to: '/admin', icon: 'settings' },
            { label: 'Usuarios', to: '/admin/users', icon: 'users' },
            { label: 'Lista' }
          ]}
          size="sm"
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          Size: Medium (Default)
        </h4>
        <Breadcrumb
          items={[
            { label: 'Admin', to: '/admin', icon: 'settings' },
            { label: 'Usuarios', to: '/admin/users', icon: 'users' },
            { label: 'Lista' }
          ]}
          size="md"
        />
      </div>
      
      <div>
        <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          Size: Large
        </h4>
        <Breadcrumb
          items={[
            { label: 'Admin', to: '/admin', icon: 'settings' },
            { label: 'Usuarios', to: '/admin/users', icon: 'users' },
            { label: 'Lista' }
          ]}
          size="lg"
        />
      </div>
    </div>
  )
};

// ========================================
// 🧪 PLAYGROUND
// ========================================

export const Playground = {
  name: '🧪 Playground Interactivo',
  args: {
    items: [
      { label: 'Admin', to: '/admin', icon: 'settings' },
      { label: 'Películas', to: '/admin/movies', icon: 'film' },
      { label: 'Ciencia Ficción', to: '/admin/movies/sci-fi', icon: 'zap' },
      { label: 'Avatar: The Way of Water' }
    ],
    variant: 'default',
    size: 'md',
    separator: '>',
    maxItems: 4,
    showHome: true,
    showIcons: true,
    collapseAt: 768,
    alwaysShowCurrent: true,
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
2. **Prueba diferentes variantes** y tamaños
3. **Modifica los items** en el código de la story
4. **Experimenta** con separadores y configuraciones

**Todas las propiedades son interactivas** - los cambios se ven inmediatamente.
        `
      }
    }
  }
};