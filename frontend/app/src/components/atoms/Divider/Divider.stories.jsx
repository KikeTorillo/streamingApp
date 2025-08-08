import { Divider } from './Divider';

export default {
  title: 'Components/Atoms/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Divider Atom

El átomo **Divider** es un separador versátil para organizar y estructurar contenido visualmente.

## 🎯 Características principales

- **2 orientaciones**: horizontal (ancho completo), vertical (altura completa)
- **4 variantes visuales**: solid, dashed, dotted, gradient
- **6 niveles de espaciado**: none, xs, sm, md, lg, xl
- **3 grosores**: thin (1px), normal (1px), thick (2px)
- **5 colores semánticos**: muted, light, primary, secondary, danger
- **Texto opcional**: En dividers horizontales con alineación configurable
- **Longitud personalizada**: Control preciso del tamaño
- **Responsive**: Adaptación automática a móvil
- **Accesibilidad**: Roles ARIA apropiados

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { Divider } from './atoms/Divider';

// Divider simple horizontal
<Divider />

// Divider vertical
<Divider orientation="vertical" />

// Con texto en el medio
<Divider text="o continúa con" />

// Con estilo personalizado
<Divider 
  variant="dashed" 
  color="primary" 
  spacing="lg" 
/>
\\\`\\\`\\\`

## 🎨 Casos de uso comunes

### Separación de secciones
\\\`\\\`\\\`jsx
<section>Contenido 1</section>
<Divider spacing="xl" />
<section>Contenido 2</section>
\\\`\\\`\\\`

### Login forms con "o"
\\\`\\\`\\\`jsx
<button>Iniciar con Google</button>
<Divider text="o" spacing="md" />
<form><!-- Login form --></form>
\\\`\\\`\\\`

### Sidebar separators
\\\`\\\`\\\`jsx
<nav>
  <MenuItem>Dashboard</MenuItem>
  <Divider orientation="vertical" spacing="sm" />
  <MenuItem>Settings</MenuItem>
</nav>
\\\`\\\`\\\`

## 🔄 Variantes visuales

- **solid**: Línea continua (default)
- **dashed**: Línea discontinua
- **dotted**: Línea punteada
- **gradient**: Degradado que se desvanece

## 🎯 Colores semánticos

- **muted**: Separación sutil (default)
- **light**: Separación muy suave
- **primary**: Separación destacada
- **secondary**: Separación alternativa
- **danger**: Separación de advertencia
        `
      }
    }
  },
  argTypes: {
    orientation: {
      name: 'Orientación',
      description: 'Orientación del divider',
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" },
        category: 'Layout'
      }
    },
    variant: {
      name: 'Variante',
      description: 'Estilo visual del divider',
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted', 'gradient'],
      table: {
        type: { summary: "'solid' | 'dashed' | 'dotted' | 'gradient'" },
        defaultValue: { summary: "'solid'" },
        category: 'Appearance'
      }
    },
    spacing: {
      name: 'Espaciado',
      description: 'Espaciado alrededor del divider',
      control: { type: 'select' },
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: "'md'" },
        category: 'Layout'
      }
    },
    thickness: {
      name: 'Grosor',
      description: 'Grosor de la línea',
      control: { type: 'select' },
      options: ['thin', 'normal', 'thick'],
      table: {
        type: { summary: "'thin' | 'normal' | 'thick'" },
        defaultValue: { summary: "'normal'" },
        category: 'Appearance'
      }
    },
    color: {
      name: 'Color',
      description: 'Color del divider',
      control: { type: 'select' },
      options: ['muted', 'light', 'primary', 'secondary', 'danger'],
      table: {
        type: { summary: "'muted' | 'light' | 'primary' | 'secondary' | 'danger'" },
        defaultValue: { summary: "'muted'" },
        category: 'Appearance'
      }
    },
    text: {
      name: 'Texto',
      description: 'Texto opcional en el medio (solo horizontal)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | ReactNode' },
        category: 'Content'
      }
    },
    textAlign: {
      name: 'Alineación del texto',
      description: 'Alineación del texto en el divider',
      control: { type: 'select' },
      options: ['center', 'left', 'right'],
      table: {
        type: { summary: "'center' | 'left' | 'right'" },
        defaultValue: { summary: "'center'" },
        category: 'Content'
      }
    },
    length: {
      name: 'Longitud',
      description: 'Longitud personalizada (CSS value)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number' },
        category: 'Layout'
      }
    },
    ariaLabel: {
      name: 'Etiqueta ARIA',
      description: 'Etiqueta de accesibilidad',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Accessibility'
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Styling'
      }
    }
  }
};

// Story principal
export const Default = {
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    spacing: 'md',
    color: 'muted'
  }
};

// Orientaciones
export const Orientations = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)',
    height: '400px'
  }}>
    {/* Horizontal */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)',
        fontSize: 'var(--font-size-lg)'
      }}>
        Horizontal
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <p>Contenido antes del divider</p>
        <Divider />
        <p>Contenido después del divider</p>
        <Divider variant="dashed" color="primary" />
        <p>Más contenido</p>
      </div>
    </div>
    
    {/* Vertical */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)',
        fontSize: 'var(--font-size-lg)'
      }}>
        Vertical
      </h3>
      <div style={{ 
        display: 'flex', 
        alignItems: 'stretch',
        height: '200px',
        gap: 'var(--space-md)'
      }}>
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--bg-secondary)', 
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)'
        }}>
          Columna 1
        </div>
        <Divider orientation="vertical" />
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--bg-secondary)', 
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)'
        }}>
          Columna 2
        </div>
        <Divider orientation="vertical" variant="dashed" color="secondary" />
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--bg-secondary)', 
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)'
        }}>
          Columna 3
        </div>
      </div>
    </div>
  </div>
);

// Variantes visuales
export const Variants = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { variant: 'solid', desc: 'Línea continua (default)' },
      { variant: 'dashed', desc: 'Línea discontinua' },
      { variant: 'dotted', desc: 'Línea punteada' },
      { variant: 'gradient', desc: 'Degradado que se desvanece' }
    ].map(({ variant, desc }) => (
      <div key={variant}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center', 
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-sm)'
        }}>
          <h4 style={{ 
            margin: 0,
            fontSize: 'var(--font-size-md)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)',
            minWidth: '80px'
          }}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </h4>
          <span style={{ 
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-muted)'
          }}>
            {desc}
          </span>
        </div>
        <Divider variant={variant} color="primary" />
      </div>
    ))}
  </div>
);

// Colores
export const Colors = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { color: 'muted', desc: 'Separación sutil (default)', usage: 'Uso general' },
      { color: 'light', desc: 'Separación muy suave', usage: 'Contenido delicado' },
      { color: 'primary', desc: 'Separación destacada', usage: 'Secciones importantes' },
      { color: 'secondary', desc: 'Separación alternativa', usage: 'Contenido secundario' },
      { color: 'danger', desc: 'Separación de advertencia', usage: 'Zonas de peligro' }
    ].map(({ color, desc, usage }) => (
      <div key={color}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center', 
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-sm)'
        }}>
          <h4 style={{ 
            margin: 0,
            fontSize: 'var(--font-size-md)',
            fontWeight: 'var(--font-weight-semibold)',
            color: `var(--color-${color === 'muted' || color === 'light' ? 'primary' : color})`,
            minWidth: '100px'
          }}>
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)'
            }}>
              {desc}
            </span>
            <span style={{ 
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-muted)'
            }}>
              {usage}
            </span>
          </div>
        </div>
        <Divider color={color} thickness="normal" />
      </div>
    ))}
  </div>
);

// Espaciado
export const Spacing = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { spacing: 'none', desc: 'Sin espaciado' },
      { spacing: 'xs', desc: 'Espaciado extra pequeño' },
      { spacing: 'sm', desc: 'Espaciado pequeño' },
      { spacing: 'md', desc: 'Espaciado medio (default)' },
      { spacing: 'lg', desc: 'Espaciado grande' },
      { spacing: 'xl', desc: 'Espaciado extra grande' }
    ].map(({ spacing, desc }) => (
      <div key={spacing}>
        <h4 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
          {spacing.toUpperCase()} - {desc}
        </h4>
        <div style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          padding: 'var(--space-sm)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>Contenido antes</p>
          <Divider spacing={spacing} color="primary" />
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>Contenido después</p>
        </div>
      </div>
    ))}
  </div>
);

// Grosores
export const Thickness = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { thickness: 'thin', desc: 'Línea fina (1px)' },
      { thickness: 'normal', desc: 'Línea normal (1px, default)' },
      { thickness: 'thick', desc: 'Línea gruesa (2px)' }
    ].map(({ thickness, desc }) => (
      <div key={thickness}>
        <div style={{ 
          marginBottom: 'var(--space-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)'
        }}>
          <h4 style={{ 
            margin: 0,
            fontSize: 'var(--font-size-md)',
            color: 'var(--text-primary)',
            minWidth: '80px'
          }}>
            {thickness.charAt(0).toUpperCase() + thickness.slice(1)}
          </h4>
          <span style={{ 
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-muted)'
          }}>
            {desc}
          </span>
        </div>
        <Divider thickness={thickness} color="primary" />
      </div>
    ))}
  </div>
);

// Con texto
export const WithText = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    {/* Alineaciones */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)',
        fontSize: 'var(--font-size-lg)'
      }}>
        Alineaciones de Texto
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div>
          <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>
            Izquierda
          </h4>
          <Divider text="Sección importante" textAlign="left" color="primary" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>
            Centro (default)
          </h4>
          <Divider text="o continúa con" textAlign="center" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>
            Derecha
          </h4>
          <Divider text="Fin de sección" textAlign="right" color="secondary" />
        </div>
      </div>
    </div>

    {/* Casos de uso comunes */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)',
        fontSize: 'var(--font-size-lg)'
      }}>
        Casos de Uso Comunes
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <Divider text="Nuevas funciones" variant="gradient" color="primary" />
        <Divider text="⭐ Premium" color="secondary" />
        <Divider text="o" spacing="sm" />
        <Divider text="Configuración avanzada" variant="dashed" color="muted" />
        <Divider text="⚠️ Zona de peligro" color="danger" />
      </div>
    </div>
  </div>
);

// Casos de uso prácticos
export const PracticalExamples = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    {/* Login Form */}
    <div style={{ 
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)'
    }}>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)',
        textAlign: 'center'
      }}>
        Login Form
      </h3>
      <button style={{ 
        width: '100%',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        marginBottom: 'var(--space-md)'
      }}>
        Continuar con Google
      </button>
      <Divider text="o" spacing="md" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <input 
          type="email" 
          placeholder="Email"
          style={{ 
            padding: 'var(--space-md)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)'
          }}
        />
        <input 
          type="password" 
          placeholder="Contraseña"
          style={{ 
            padding: 'var(--space-md)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)'
          }}
        />
        <button style={{ 
          padding: 'var(--space-md)',
          backgroundColor: 'var(--color-secondary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer'
        }}>
          Iniciar Sesión
        </button>
      </div>
    </div>

    {/* Sidebar Navigation */}
    <div style={{ 
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)',
      height: 'fit-content'
    }}>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Sidebar Navigation
      </h3>
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        <a href="#" style={{ 
          padding: 'var(--space-md)',
          color: 'var(--color-primary)',
          textDecoration: 'none',
          borderRadius: 'var(--radius-sm)'
        }}>
          Dashboard
        </a>
        <a href="#" style={{ 
          padding: 'var(--space-md)',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          borderRadius: 'var(--radius-sm)'
        }}>
          Usuarios
        </a>
        <Divider spacing="sm" />
        <a href="#" style={{ 
          padding: 'var(--space-md)',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          borderRadius: 'var(--radius-sm)'
        }}>
          Películas
        </a>
        <a href="#" style={{ 
          padding: 'var(--space-md)',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          borderRadius: 'var(--radius-sm)'
        }}>
          Series
        </a>
        <Divider text="Admin" spacing="md" color="primary" />
        <a href="#" style={{ 
          padding: 'var(--space-md)',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          borderRadius: 'var(--radius-sm)'
        }}>
          Configuración
        </a>
        <a href="#" style={{ 
          padding: 'var(--space-md)',
          color: 'var(--color-danger)',
          textDecoration: 'none',
          borderRadius: 'var(--radius-sm)'
        }}>
          Cerrar Sesión
        </a>
      </nav>
    </div>

    {/* Content Sections */}
    <div style={{ 
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)'
    }}>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Content Sections
      </h3>
      <div>
        <h4 style={{ color: 'var(--text-primary)' }}>Información Personal</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Datos básicos del usuario y configuración de perfil.
        </p>
        <Divider spacing="lg" />
        
        <h4 style={{ color: 'var(--text-primary)' }}>Preferencias</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Configuración de idioma, tema y notificaciones.
        </p>
        <Divider text="⚠️ Zona de Peligro" color="danger" spacing="lg" />
        
        <h4 style={{ color: 'var(--color-danger)' }}>Eliminar Cuenta</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Esta acción no se puede deshacer.
        </p>
      </div>
    </div>
  </div>
);

// Longitudes personalizadas
export const CustomLengths = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Longitudes Personalizadas
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div>
          <h4 style={{ marginBottom: 'var(--space-sm)' }}>50% de ancho</h4>
          <Divider length="50%" color="primary" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: 'var(--space-sm)' }}>200px fijos</h4>
          <Divider length="200px" color="secondary" variant="dashed" />
        </div>
        
        <div>
          <h4 style={{ marginBottom: 'var(--space-sm)' }}>75% con texto</h4>
          <Divider length="75%" text="Sección corta" color="muted" />
        </div>
      </div>
    </div>

    <div style={{ 
      display: 'flex',
      gap: 'var(--space-lg)',
      height: '200px'
    }}>
      <div style={{ 
        flex: 1,
        backgroundColor: 'var(--bg-secondary)',
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h4>Columna 1</h4>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
          Contenido de la primera columna
        </p>
      </div>
      
      <Divider 
        orientation="vertical" 
        length="150px" 
        color="primary" 
        variant="gradient"
      />
      
      <div style={{ 
        flex: 1,
        backgroundColor: 'var(--bg-secondary)',
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h4>Columna 2</h4>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
          Contenido de la segunda columna
        </p>
      </div>
    </div>
  </div>
);