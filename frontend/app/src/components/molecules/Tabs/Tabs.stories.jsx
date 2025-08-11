// Tabs.stories.jsx
import { useState } from 'react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Tabs - Sistema de Pestañas Avanzado

Componente de pestañas completo para organizar contenido en secciones navegables con múltiples variantes y orientaciones.

## 🎯 **Casos de Uso Principales**

### ✅ **Series Detail Page:**
- **Temporadas**: Temporada 1, Temporada 2, Temporada 3
- **Información**: Sinopsis, Reparto, Trailer, Reviews

### ✅ **User Profile:**
- **Secciones**: Información Personal, Configuración, Historial de Visualización
- **Preferencias**: General, Notificaciones, Privacidad

### ✅ **Admin Panel:**
- **Gestión**: Usuarios, Películas, Series, Estadísticas
- **Configuración**: General, Seguridad, Integraciones

### ✅ **Settings Page:**
- **Categorías**: Perfil, Cuenta, Privacidad, Notificaciones

## 🚀 **Características Principales**

### **📐 Variantes Visuales:**
- **\`line\`**: Línea inferior (default) - Estilo clásico web
- **\`pills\`**: Estilo pastillas - Moderno y llamativo  
- **\`card\`**: Estilo tarjetas - Elevado y profesional

### **📱 Orientaciones:**
- **\`horizontal\`**: Tabs en fila horizontal (default)
- **\`vertical\`**: Tabs en columna vertical (sidebar style)

### **⌨️ Navegación por Teclado:**
- **Arrow keys**: Navegar entre tabs
- **Home/End**: Ir al primer/último tab
- **Enter/Space**: Activar tab seleccionado
- **Tab**: Navegar fuera del componente

### **🔧 Funcionalidades Avanzadas:**
- **Scroll automático**: Maneja overflow con botones de scroll
- **Equal width**: Tabs de ancho igual (grid layout)
- **Lazy loading**: Contenido se carga solo cuando es necesario
- **Estados disabled**: Tabs no disponibles
- **Badges/Counters**: Mostrar números o indicadores
- **Iconos**: Iconos opcionales en cada tab

## 🔧 **API Completa**

\`\`\`jsx
<Tabs
  // Configuración básica (requerida)
  tabs={[
    {
      id: 'tab1',                    // ID único (requerido)
      label: 'Información',         // Texto del tab (requerido)
      content: <TabContent />,      // Contenido o función
      icon: 'info',                 // Icono opcional
      badge: '5',                   // Badge/counter opcional
      disabled: false               // Estado deshabilitado
    },
    // ... más tabs
  ]}
  
  // Control de estado
  activeTab={activeTab}             // Tab activo (controlado)
  onTabChange={(tabId, tab) => {}}  // Callback de cambio
  
  // Personalización visual
  variant="line"                    // line, pills, card
  size="md"                        // sm, md, lg
  orientation="horizontal"          // horizontal, vertical
  
  // Comportamiento
  scrollable={true}                // Habilitar scroll en overflow
  equalWidth={false}               // Tabs de ancho igual
  lazy={false}                     // Lazy loading de contenido
  
  // Estados
  disabled={false}                 // Deshabilitado general
  loading={false}                  // Estado de carga
  
  // Clases CSS personalizadas
  className=""                     // Clase del container
  tabsClassName=""                 // Clase de la lista de tabs
  contentClassName=""              // Clase del contenido
/>
\`\`\`

## 🔄 **Estados del Componente**

### **Controlado vs No Controlado:**
\`\`\`jsx
// No controlado (maneja su propio estado)
<Tabs tabs={tabs} onTabChange={handleChange} />

// Controlado (estado externo)
const [activeTab, setActiveTab] = useState('tab1');
<Tabs 
  tabs={tabs} 
  activeTab={activeTab}
  onTabChange={(tabId) => setActiveTab(tabId)} 
/>
\`\`\`

### **Contenido Dinámico:**
\`\`\`jsx
const tabs = [
  {
    id: 'dynamic',
    label: 'Dinámico',
    content: (tabData) => (
      <div>
        <h3>Contenido para: {tabData.label}</h3>
        <p>Este contenido se genera dinámicamente</p>
      </div>
    )
  }
];
\`\`\`
        `
      }
    }
  },
  argTypes: {
    // Props estándar del sistema de diseño
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño estándar del componente'
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante semántica estándar para colores'
    },
    rounded: {
      control: 'select', 
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes estándar'
    },
    tabsVariant: {
      control: 'select',
      options: ['line', 'pills', 'card'],
      description: 'Variante funcional específica de tabs'
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientación de las pestañas'
    },
    scrollable: {
      control: 'boolean',
      description: 'Habilitar scroll automático en overflow'
    },
    equalWidth: {
      control: 'boolean',
      description: 'Pestañas de ancho igual'
    },
    lazy: {
      control: 'boolean',
      description: 'Lazy loading del contenido'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado general'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga (icono en tab activo)'
    }
  }
};

export default meta;

// ========================================
// 🎯 CASOS DE USO REALES
// ========================================

export const SeriesDetailUseCase = {
  name: '📺 Caso: Series Detail',
  render: () => {
    const [activeTab, setActiveTab] = useState('season1');
    
    const seriesTabs = [
      {
        id: 'season1',
        label: 'Temporada 1',
        icon: 'play',
        badge: '10',
        content: (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              🎬 Breaking Bad - Temporada 1
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'var(--color-surface-secondary)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--color-border-subtle)'
                  }}
                >
                  <div style={{
                    width: '120px',
                    height: '80px',
                    background: 'var(--color-surface-tertiary)',
                    borderRadius: 'var(--border-radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    ▶️
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                      Episodio {index + 1}: "Pilot"
                    </h4>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      Un profesor de química se convierte en fabricante de drogas...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        id: 'season2',
        label: 'Temporada 2',
        icon: 'play',
        badge: '13',
        content: (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              🎬 Breaking Bad - Temporada 2
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Contenido de la segunda temporada con 13 episodios...
            </p>
          </div>
        )
      },
      {
        id: 'info',
        label: 'Información',
        icon: 'info',
        content: (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              📋 Información de la Serie
            </h3>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '200px 1fr' }}>
              <div style={{
                background: 'var(--color-surface-secondary)',
                borderRadius: 'var(--border-radius-md)',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                🎭
              </div>
              <div>
                <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                  Breaking Bad (2008-2013)
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  <strong>Género:</strong> Drama, Crimen<br />
                  <strong>Creador:</strong> Vince Gilligan<br />
                  <strong>Reparto:</strong> Bryan Cranston, Aaron Paul<br />
                  <strong>Rating:</strong> ⭐⭐⭐⭐⭐ (9.5/10)
                </p>
              </div>
            </div>
          </div>
        )
      }
    ];
    
    return (
      <div style={{ padding: '2rem', background: 'var(--color-surface-primary)' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
          📺 Breaking Bad - Detail Page
        </h2>
        
        <Tabs
          tabs={seriesTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsVariant="line"
          size="md"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📺 **Series Detail Page Implementation**

**Perfect para mostrar:**
- **Temporadas** con contador de episodios (badges)
- **Información** general de la serie
- **Reviews**, **Reparto**, **Trailers** (tabs adicionales)

**Código de implementación:**
\`\`\`jsx
const seriesTabs = [
  {
    id: 'season1',
    label: 'Temporada 1', 
    icon: 'play',
    badge: '10', // Número de episodios
    content: <SeasonEpisodesList season={1} />
  },
  {
    id: 'info',
    label: 'Información',
    icon: 'info', 
    content: <SeriesInfo series={series} />
  }
];
\`\`\`

**Beneficios:**
- ✅ **Organización clara** - Episodios separados por temporada
- ✅ **Navegación intuitiva** - Tabs con iconos y badges
- ✅ **Performance** - Solo carga contenido del tab activo
        `
      }
    }
  }
};

export const UserProfileUseCase = {
  name: '👤 Caso: User Profile',
  render: () => {
    const [activeTab, setActiveTab] = useState('profile');
    
    const profileTabs = [
      {
        id: 'profile',
        label: 'Mi Perfil',
        icon: 'user',
        content: (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>
              👤 Información Personal
            </h3>
            <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Nombre:</span>
                <span style={{ color: 'var(--color-text-primary)' }}>Juan Pérez</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Email:</span>
                <span style={{ color: 'var(--color-text-primary)' }}>juan@example.com</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Miembro desde:</span>
                <span style={{ color: 'var(--color-text-primary)' }}>Enero 2023</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Plan:</span>
                <span style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-weight-semibold)' }}>Premium</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'settings',
        label: 'Configuración',
        icon: 'settings',
        content: (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>
              ⚙️ Configuración de Cuenta
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { label: 'Notificaciones por email', enabled: true },
                { label: 'Reproducción automática', enabled: false },
                { label: 'Calidad de video HD', enabled: true },
                { label: 'Subtítulos automáticos', enabled: false }
              ].map(({ label, enabled }) => (
                <div key={label} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'var(--color-surface-secondary)',
                  borderRadius: 'var(--border-radius-sm)'
                }}>
                  <span style={{ color: 'var(--color-text-primary)' }}>{label}</span>
                  <span style={{ 
                    color: enabled ? 'var(--color-success-600)' : 'var(--color-text-subtle)',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    {enabled ? '✅ Activado' : '❌ Desactivado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        id: 'history',
        label: 'Historial',
        icon: 'clock',
        badge: '12',
        content: (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>
              🕒 Historial de Visualización
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { title: 'Breaking Bad - S01E01', date: 'Hace 2 horas', progress: 85 },
                { title: 'Avatar: The Way of Water', date: 'Ayer', progress: 100 },
                { title: 'Stranger Things - S04E09', date: 'Hace 3 días', progress: 45 }
              ].map(({ title, date, progress }) => (
                <div key={title} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'var(--color-surface-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-border-subtle)'
                }}>
                  <div>
                    <div style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                      {title}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      {date}
                    </div>
                  </div>
                  <div style={{ color: 'var(--color-primary-600)', fontSize: 'var(--font-size-sm)' }}>
                    {progress}% visto
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    ];
    
    return (
      <div style={{ padding: '2rem', background: 'var(--color-surface-primary)' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
          👤 Mi Perfil de Usuario
        </h2>
        
        <Tabs
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsVariant="pills"
          size="md"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 👤 **User Profile Implementation**

**Perfect para secciones de usuario:**
- **Mi Perfil** - Información personal
- **Configuración** - Preferencias de cuenta
- **Historial** - Contenido visualizado con badge

**Usando variant="pills"** para un look más moderno y friendly.
        `
      }
    }
  }
};

export const AdminPanelUseCase = {
  name: '⚙️ Caso: Admin Panel',
  render: () => {
    const [activeTab, setActiveTab] = useState('users');
    
    const adminTabs = [
      {
        id: 'users',
        label: 'Usuarios',
        icon: 'users',
        badge: '1,234',
        content: (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>
              👥 Gestión de Usuarios
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {[
                { label: 'Total Usuarios', value: '1,234', color: 'var(--color-primary-600)' },
                { label: 'Activos', value: '987', color: 'var(--color-success-600)' },
                { label: 'Nuevos (mes)', value: '45', color: 'var(--color-warning-600)' },
                { label: 'Inactivos', value: '202', color: 'var(--color-danger-600)' }
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  padding: '1rem',
                  background: 'var(--color-surface-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-border-subtle)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color, marginBottom: '0.5rem' }}>
                    {value}
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Panel de gestión de usuarios con estadísticas en tiempo real.
            </p>
          </div>
        )
      },
      {
        id: 'movies',
        label: 'Películas',
        icon: 'film',
        badge: '856',
        content: (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              🎬 Gestión de Películas
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Administración del catálogo de películas: 856 películas en total.
            </p>
          </div>
        )
      },
      {
        id: 'analytics',
        label: 'Estadísticas',
        icon: 'trending-up',
        content: (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              📊 Dashboard de Estadísticas
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Métricas de uso, visualizaciones, y performance de la plataforma.
            </p>
          </div>
        )
      },
      {
        id: 'settings',
        label: 'Configuración',
        icon: 'settings',
        content: (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              ⚙️ Configuración del Sistema
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Configuraciones generales, integraciones y parámetros del sistema.
            </p>
          </div>
        )
      }
    ];
    
    return (
      <div style={{ padding: '2rem', background: 'var(--color-surface-primary)' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
          ⚙️ StreamApp Admin Panel
        </h2>
        
        <Tabs
          tabs={adminTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsVariant="card"
          size="md"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### ⚙️ **Admin Panel Implementation**

**Perfect para dashboards administrativos:**
- **Múltiples secciones** con badges informativos
- **Variant="card"** para look profesional
- **Iconos descriptivos** para identificación rápida

**Casos típicos:**
- Gestión de entidades (usuarios, contenido)
- Estadísticas y métricas
- Configuraciones del sistema
        `
      }
    }
  }
};

// ========================================
// 📐 VARIANTES VISUALES
// ========================================

export const VariantLine = {
  name: '📐 Variante: Line',
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    const tabs = [
      { id: 'tab1', label: 'Información', icon: 'info', content: <div style={{ padding: '2rem' }}>Contenido de Información</div> },
      { id: 'tab2', label: 'Configuración', icon: 'settings', content: <div style={{ padding: '2rem' }}>Contenido de Configuración</div> },
      { id: 'tab3', label: 'Historial', icon: 'clock', badge: '5', content: <div style={{ padding: '2rem' }}>Contenido de Historial</div> }
    ];
    
    return (
      <div style={{ padding: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          Variant: Line - Estilo clásico con línea inferior
        </h4>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsVariant="line"
          size="md"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📐 **Variante Line (Default)**

**Características:**
- ✅ **Línea inferior** en tab activo
- ✅ **Estilo clásico** familiar para usuarios
- ✅ **Perfect para contenido serio** (admin, settings)
- ✅ **Border bottom** en toda la lista de tabs
        `
      }
    }
  }
};

export const VariantPills = {
  name: '📐 Variante: Pills',
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    const tabs = [
      { id: 'tab1', label: 'Perfil', icon: 'user', content: <div style={{ padding: '2rem' }}>Mi perfil personal</div> },
      { id: 'tab2', label: 'Favoritos', icon: 'heart', badge: '12', content: <div style={{ padding: '2rem' }}>Mis películas favoritas</div> },
      { id: 'tab3', label: 'Configuración', icon: 'settings', content: <div style={{ padding: '2rem' }}>Ajustes de la cuenta</div> }
    ];
    
    return (
      <div style={{ padding: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          Variant: Pills - Estilo moderno con pastillas
        </h4>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsVariant="pills"
          size="md"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📐 **Variante Pills**

**Características:**
- ✅ **Background redondeado** tipo pastilla
- ✅ **Estilo moderno** y llamativo
- ✅ **Perfect para user-facing** (profiles, settings)
- ✅ **Hover effects** elegantes
        `
      }
    }
  }
};

export const VariantCard = {
  name: '📐 Variante: Card',
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    const tabs = [
      { id: 'tab1', label: 'Dashboard', icon: 'trending-up', content: <div style={{ padding: '2rem' }}>Panel de control principal</div> },
      { id: 'tab2', label: 'Reportes', icon: 'file', badge: '3', content: <div style={{ padding: '2rem' }}>Reportes y estadísticas</div> },
      { id: 'tab3', label: 'Configuración', icon: 'settings', content: <div style={{ padding: '2rem' }}>Configuración avanzada</div> }
    ];
    
    return (
      <div style={{ padding: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          Variant: Card - Estilo elevado profesional
        </h4>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsVariant="card"
          size="md"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📐 **Variante Card**

**Características:**
- ✅ **Bordes y sombras** sutiles
- ✅ **Look profesional** elevado
- ✅ **Perfect para dashboards** admin
- ✅ **Tab activo destacado** con sombra
        `
      }
    }
  }
};

// ========================================
// 📱 ORIENTACIONES Y RESPONSIVE
// ========================================

export const VerticalOrientation = {
  name: '📱 Orientación: Vertical',
  render: () => {
    const [activeTab, setActiveTab] = useState('profile');
    
    const tabs = [
      { 
        id: 'profile', 
        label: 'Mi Perfil', 
        icon: 'user', 
        content: (
          <div style={{ padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              👤 Información Personal
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Gestiona tu información personal y preferencias de cuenta.
            </p>
          </div>
        ) 
      },
      { 
        id: 'security', 
        label: 'Seguridad', 
        icon: 'shield', 
        content: (
          <div style={{ padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              🔒 Configuración de Seguridad
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Contraseñas, autenticación de dos factores y sesiones activas.
            </p>
          </div>
        ) 
      },
      { 
        id: 'notifications', 
        label: 'Notificaciones', 
        icon: 'bell', 
        badge: '3',
        content: (
          <div style={{ padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              🔔 Preferencias de Notificación
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Controla cómo y cuándo recibes notificaciones.
            </p>
          </div>
        ) 
      },
      { 
        id: 'privacy', 
        label: 'Privacidad', 
        icon: 'eye-off', 
        content: (
          <div style={{ padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              🔐 Configuración de Privacidad
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Controla quién puede ver tu información y actividad.
            </p>
          </div>
        ) 
      }
    ];
    
    return (
      <div style={{ padding: '2rem', height: '500px' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          Orientation: Vertical - Sidebar style
        </h4>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsVariant="line"
          orientation="vertical"
          size="md"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📱 **Orientación Vertical**

**Perfect para:**
- ✅ **Sidebar navigation** - Settings complejos
- ✅ **Dashboard layouts** - Navegación lateral
- ✅ **Desktop applications** - Espacios amplios
- ✅ **Multi-section content** - Muchas categorías

**Nota:** En mobile automáticamente se convierte a horizontal para mejor UX.
        `
      }
    }
  }
};

export const ScrollableTabs = {
  name: '📱 Tabs con Scroll',
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    // Muchos tabs para demostrar scroll
    const manyTabs = Array.from({ length: 12 }, (_, index) => ({
      id: `tab${index + 1}`,
      label: `Tab Largo ${index + 1}`,
      icon: index % 4 === 0 ? 'star' : index % 4 === 1 ? 'heart' : index % 4 === 2 ? 'zap' : 'circle',
      badge: index > 5 ? `${index}` : undefined,
      content: (
        <div style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--color-text-primary)' }}>
            Contenido del Tab {index + 1}
          </h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Este es el contenido dinámico para el tab número {index + 1}.
          </p>
        </div>
      )
    }));
    
    return (
      <div style={{ padding: '2rem' }}>
        <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
          💡 <strong>Scroll automático:</strong> Usa los botones de scroll o arrastra horizontalmente.
          El tab activo se centra automáticamente.
        </p>
        
        <Tabs
          tabs={manyTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsVariant="pills"
          size="md"
          scrollable={true}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📱 **Scroll Automático**

**Funcionalidades:**
- ✅ **Botones de scroll** automáticos cuando hay overflow
- ✅ **Scroll suave** con animaciones
- ✅ **Auto-center** del tab activo
- ✅ **Touch/drag support** en mobile
- ✅ **Keyboard navigation** completa

**Perfect para:**
- Muchas categorías o secciones
- Espacios horizontales limitados
- Mobile responsive
        `
      }
    }
  }
};

// ========================================
// 🔧 ESTADOS Y CONFIGURACIONES
// ========================================

export const DisabledTabs = {
  name: '🚫 Tabs Disabled',
  render: () => {
    const [activeTab, setActiveTab] = useState('available');
    
    const tabs = [
      { 
        id: 'available', 
        label: 'Disponible', 
        icon: 'check', 
        content: <div style={{ padding: '2rem' }}>Este tab está disponible</div> 
      },
      { 
        id: 'disabled1', 
        label: 'Premium Only', 
        icon: 'lock', 
        disabled: true,
        content: <div style={{ padding: '2rem' }}>Requiere suscripción Premium</div> 
      },
      { 
        id: 'available2', 
        label: 'Otro Disponible', 
        icon: 'heart', 
        content: <div style={{ padding: '2rem' }}>Otro tab disponible</div> 
      },
      { 
        id: 'disabled2', 
        label: 'En Desarrollo', 
        icon: 'zap', 
        disabled: true,
        content: <div style={{ padding: '2rem' }}>Próximamente</div> 
      }
    ];
    
    return (
      <div style={{ padding: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          Estados disabled - Tabs no disponibles
        </h4>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
          Algunos tabs están deshabilitados (Premium, En desarrollo, etc.)
        </p>
        
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsVariant="card"
          size="md"
        />
      </div>
    );
  }
};

export const LoadingState = {
  name: '⏳ Estado Loading',
  render: () => {
    const [activeTab, setActiveTab] = useState('loading-tab');
    
    const tabs = [
      { 
        id: 'loading-tab', 
        label: 'Cargando Datos...', 
        icon: 'trending-up', 
        content: (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>⏳</div>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Los datos se están cargando, por favor espera...
            </p>
          </div>
        )
      },
      { 
        id: 'normal-tab', 
        label: 'Tab Normal', 
        icon: 'info', 
        content: <div style={{ padding: '2rem' }}>Contenido normal sin loading</div> 
      }
    ];
    
    return (
      <div style={{ padding: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          loading={true} - Estado de carga
        </h4>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
          El tab activo muestra un icono de loading animado
        </p>
        
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsVariant="line"
          size="md"
          loading={true}
        />
      </div>
    );
  }
};

// ========================================
// 📏 TAMAÑOS
// ========================================

export const AllSizes = {
  name: '📏 Todos los Tamaños',
  render: () => {
    const createTabs = (size) => [
      { id: `${size}-1`, label: 'Inicio', icon: 'home', content: <div style={{ padding: '1rem' }}>Contenido {size}</div> },
      { id: `${size}-2`, label: 'Configuración', icon: 'settings', badge: '2', content: <div style={{ padding: '1rem' }}>Settings {size}</div> }
    ];
    
    return (
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Size: Small
          </h4>
          <Tabs tabs={createTabs('sm')} tabsVariant="line" size="sm" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Size: Medium (Default)
          </h4>
          <Tabs tabs={createTabs('md')} tabsVariant="line" size="md" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Size: Large
          </h4>
          <Tabs tabs={createTabs('lg')} tabsVariant="line" size="lg" />
        </div>
      </div>
    );
  }
};

// ========================================
// 🧪 PLAYGROUND
// ========================================

// ========================================
// 🎯 NUEVAS STORIES SISTEMA ESTÁNDAR
// ========================================

export const SystemStandardVariants = {
  name: '🎨 Sistema: Variantes Semánticas',
  render: () => {
    const createTabs = (variant) => [
      { id: `${variant}-1`, label: 'Configuración', icon: 'settings', content: <div style={{ padding: '2rem' }}>Contenido {variant}</div> },
      { id: `${variant}-2`, label: 'Notificaciones', icon: 'bell', badge: '3', content: <div style={{ padding: '2rem' }}>Notificaciones {variant}</div> }
    ];
    
    return (
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Primary (Default)</h4>
          <Tabs tabs={createTabs('primary')} variant="primary" tabsVariant="line" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Secondary</h4>
          <Tabs tabs={createTabs('secondary')} variant="secondary" tabsVariant="pills" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Success</h4>
          <Tabs tabs={createTabs('success')} variant="success" tabsVariant="line" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Warning</h4>
          <Tabs tabs={createTabs('warning')} variant="warning" tabsVariant="pills" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Danger</h4>
          <Tabs tabs={createTabs('danger')} variant="danger" tabsVariant="line" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Neutral</h4>
          <Tabs tabs={createTabs('neutral')} variant="neutral" tabsVariant="card" />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🎨 **Variantes Semánticas del Sistema Estándar**

**Nueva funcionalidad:** Cada tab puede tener una variante semántica que cambia los colores del tab activo.

**Casos de uso:**
- **Primary**: Navegación principal, acciones importantes
- **Secondary**: Navegación secundaria, información adicional  
- **Success**: Confirmaciones, estados exitosos
- **Warning**: Advertencias, acciones que requieren atención
- **Danger**: Eliminaciones, acciones destructivas
- **Neutral**: Información general, estados neutros

**Combinaciones recomendadas:**
- Primary + line: Dashboard principal
- Secondary + pills: User settings
- Success/Warning/Danger + line: Status indicators
- Neutral + card: Documentation tabs
      `
      }
    }
  }
};

export const SystemStandardSizes = {
  name: '📏 Sistema: Tamaños Estándar',
  render: () => {
    const createTabs = (size) => [
      { id: `${size}-1`, label: 'Configuración', icon: 'settings', content: <div style={{ padding: '1rem' }}>Contenido {size}</div> },
      { id: `${size}-2`, label: 'Historial', icon: 'clock', badge: '5', content: <div style={{ padding: '1rem' }}>Historial {size}</div> }
    ];
    
    return (
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Extra Small (xs)</h4>
          <Tabs tabs={createTabs('xs')} size="xs" tabsVariant="pills" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Small (sm)</h4>
          <Tabs tabs={createTabs('sm')} size="sm" tabsVariant="line" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Medium (md) - Default</h4>
          <Tabs tabs={createTabs('md')} size="md" tabsVariant="card" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Large (lg)</h4>
          <Tabs tabs={createTabs('lg')} size="lg" tabsVariant="pills" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Extra Large (xl)</h4>
          <Tabs tabs={createTabs('xl')} size="xl" tabsVariant="line" />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 📏 **Tamaños Estándar del Sistema**

**5 tamaños estándar** disponibles en todos los componentes:

- **xs**: Extra small - Para interfaces compactas, mobile
- **sm**: Small - Para sidebars, contenido secundario  
- **md**: Medium - Tamaño por defecto, la mayoría de casos
- **lg**: Large - Para interfaces principales, desktop
- **xl**: Extra large - Para dashboards, pantallas grandes

**Tokens automáticos:** Cada tamaño usa automáticamente los design tokens apropiados para padding, font-size, y spacing.
      `
      }
    }
  }
};

export const SystemStandardStates = {
  name: '⚡ Sistema: Estados Estándar',
  render: () => {
    const baseTabs = [
      { id: 'tab1', label: 'Normal', icon: 'info', content: <div style={{ padding: '2rem' }}>Estado normal</div> },
      { id: 'tab2', label: 'Con Badge', icon: 'bell', badge: '12', content: <div style={{ padding: '2rem' }}>Con notificaciones</div> },
      { id: 'tab3', label: 'Premium', icon: 'star', content: <div style={{ padding: '2rem' }}>Contenido premium</div> }
    ];
    
    return (
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Estado Normal</h4>
          <Tabs tabs={baseTabs} tabsVariant="line" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Estado Loading</h4>
          <Tabs tabs={baseTabs} tabsVariant="pills" loading={true} />
          <p style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            ⏳ El tab activo muestra spinner de loading
          </p>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Estado Disabled</h4>
          <Tabs tabs={baseTabs} tabsVariant="card" disabled={true} />
          <p style={{ marginTop: '0.5rem', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            🚫 Componente completo deshabilitado con overlay
          </p>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Tabs Individuales Disabled</h4>
          <Tabs tabs={[
            { id: 'available', label: 'Disponible', icon: 'check', content: <div style={{ padding: '2rem' }}>Contenido disponible</div> },
            { id: 'premium', label: 'Premium Only', icon: 'lock', disabled: true, content: <div style={{ padding: '2rem' }}>Requiere premium</div> },
            { id: 'coming', label: 'Próximamente', icon: 'zap', disabled: true, content: <div style={{ padding: '2rem' }}>En desarrollo</div> }
          ]} tabsVariant="pills" />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### ⚡ **Estados Estándar del Sistema**

**Estados globales:**
- **loading={true}**: Muestra spinner en tab activo, otros tabs con opacity reducida
- **disabled={true}**: Deshabilita todo el componente con overlay

**Estados individuales:**
- **tab.disabled**: Tabs específicos deshabilitados (ej: premium features)
- **Iconos contextuales**: lock, zap, check para indicar estado

**UX Notes:**
- Loading no bloquea navegación entre tabs
- Disabled tabs mantienen accesibilidad (aria-disabled) 
- Visual feedback claro para cada estado
      `
      }
    }
  }
};

export const SystemRoundedVariants = {
  name: '🔄 Sistema: Variantes Rounded',
  render: () => {
    const tabs = [
      { id: 'tab1', label: 'Configuración', icon: 'settings', content: <div style={{ padding: '2rem' }}>Contenido 1</div> },
      { id: 'tab2', label: 'Notificaciones', icon: 'bell', badge: '3', content: <div style={{ padding: '2rem' }}>Contenido 2</div> }
    ];
    
    return (
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Small (sm)</h4>
          <Tabs tabs={tabs} tabsVariant="card" rounded="sm" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Medium (md) - Default</h4>
          <Tabs tabs={tabs} tabsVariant="card" rounded="md" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Large (lg)</h4>
          <Tabs tabs={tabs} tabsVariant="card" rounded="lg" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Extra Large (xl)</h4>
          <Tabs tabs={tabs} tabsVariant="card" rounded="xl" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Full (circular)</h4>
          <Tabs tabs={tabs} tabsVariant="pills" rounded="full" />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🔄 **Variantes Rounded del Sistema**

**Radio de bordes estándar** aplicado a todos los tabs:

- **sm**: Esquinas suaves (0.6rem)
- **md**: Default equilibrado (1.2rem)  
- **lg**: Esquinas redondeadas (1.8rem)
- **xl**: Muy redondeado (2.4rem)
- **full**: Completamente redondeado/circular (9999px)

**Ajustes automáticos:**
- Line variant: Solo rounded en parte superior
- Pills/Card: Rounded completo  
- Tokens automáticos de design system
      `
      }
    }
  }
};

export const BackwardCompatibilityDemo = {
  name: '🔄 Backward Compatibility',
  render: () => {
    const tabs = [
      { id: 'tab1', label: 'Información', icon: 'info', content: <div style={{ padding: '2rem' }}>Contenido legacy</div> },
      { id: 'tab2', label: 'Configuración', icon: 'settings', content: <div style={{ padding: '2rem' }}>Settings legacy</div> }
    ];
    
    return (
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>✅ Nueva API (Recomendada)</h4>
          <Tabs tabs={tabs} tabsVariant="line" variant="primary" />
          <pre style={{ 
            background: 'var(--color-surface-secondary)', 
            padding: '1rem', 
            borderRadius: 'var(--border-radius-sm)',
            marginTop: '0.5rem',
            fontSize: 'var(--font-size-xs)'
          }}>
{`<Tabs 
  tabs={tabs} 
  tabsVariant="line"    // Funcionalidad de tabs
  variant="primary"     // Variante semántica
  size="md"
  rounded="md" 
/>`}
          </pre>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-warning-600)' }}>⚠️ API Legacy (Funciona pero deprecada)</h4>
          <Tabs tabs={tabs} variant="pills" />
          <pre style={{ 
            background: 'var(--color-surface-secondary)', 
            padding: '1rem', 
            borderRadius: 'var(--border-radius-sm)',
            marginTop: '0.5rem',
            fontSize: 'var(--font-size-xs)'
          }}>
{`<Tabs 
  tabs={tabs} 
  variant="pills"       // ⚠️ DEPRECADO - usa tabsVariant
/>`}
          </pre>
          <p style={{ color: 'var(--color-warning-600)', fontSize: 'var(--font-size-sm)', marginTop: '0.5rem' }}>
            💡 <strong>Console Warning:</strong> "variant='pills' está deprecado. Usar tabsVariant='pills'"
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 🔄 **Backward Compatibility Garantizada**

**⚠️ Props deprecadas pero funcionales:**
- \`variant="line|pills|card"\` → \`tabsVariant="line|pills|card"\`

**✅ Migración sin breaking changes:**
1. API legacy sigue funcionando exactamente igual
2. Console warnings informativos en desarrollo  
3. Transición gradual recomendada
4. Zero downtime en producción

**🎯 Plan de migración:**
1. **Ahora**: API legacy funciona perfectamente
2. **Próximas semanas**: Migrar gradualmente a nueva API
3. **Futuro**: Eventual eliminación de props deprecadas (con aviso previo)

**Beneficios nueva API:**
- Consistencia con todo el sistema de diseño
- Variantes semánticas (colors) separadas de funcionales (layout)
- Props estándar: size, rounded, loading, disabled
- Mejor DX y autocompletado
      `
      }
    }
  }
};

export const Playground = {
  name: '🧪 Playground Interactivo',
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab || 'tab1');
    
    const tabs = [
      {
        id: 'tab1',
        label: 'Información',
        icon: 'info',
        content: (
          <div style={{ padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              📋 Tab de Información
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Este es el contenido del primer tab con información general.
            </p>
          </div>
        )
      },
      {
        id: 'tab2',
        label: 'Configuración',
        icon: 'settings',
        badge: '3',
        content: (
          <div style={{ padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              ⚙️ Configuraciones
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Panel de configuraciones con 3 opciones pendientes.
            </p>
          </div>
        )
      },
      {
        id: 'tab3',
        label: 'Historial',
        icon: 'clock',
        badge: '12',
        content: (
          <div style={{ padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              🕒 Historial de Actividad
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Registro de las últimas 12 actividades realizadas.
            </p>
          </div>
        )
      },
      {
        id: 'tab4',
        label: 'Premium',
        icon: 'star',
        disabled: args.disabled || false,
        content: (
          <div style={{ padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              ⭐ Contenido Premium
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Funcionalidades exclusivas para usuarios premium.
            </p>
          </div>
        )
      }
    ];
    
    return (
      <Tabs
        {...args}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    );
  },
  args: {
    // Props estándar del sistema
    size: 'md',
    variant: 'primary', 
    rounded: 'md',
    
    // Props específicas de Tabs
    tabsVariant: 'line',
    orientation: 'horizontal',
    scrollable: true,
    equalWidth: false,
    lazy: false,
    
    // Estados
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
2. **Prueba diferentes variantes** (line, pills, card)
3. **Experimenta con orientaciones** y tamaños
4. **Activa estados** (loading, disabled)

**Keyboard Navigation:**
- **Arrow keys** - Navegar entre tabs
- **Home/End** - Primer/último tab
- **Enter/Space** - Activar tab seleccionado

**Todas las propiedades son interactivas** - los cambios se ven inmediatamente.
        `
      }
    }
  }
};