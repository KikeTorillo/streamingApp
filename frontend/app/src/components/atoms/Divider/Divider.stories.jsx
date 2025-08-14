import { Divider } from './Divider';

export default {
  title: 'Components/Atoms/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Divider Atom - MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR

El átomo **Divider** es un separador versátil para organizar y estructurar contenido visualmente, ahora completamente integrado al sistema de diseño estándar.

## 🎯 Características principales

✅ **Props estándar**: size, variant, rounded, loading, disabled  
✅ **Hook especializado**: useDividerProps() para configuración óptima  
✅ **Sistema de iconos**: Feather Icons integrado con leftIcon/rightIcon  
✅ **Backward compatibility**: Mapeo automático de props legacy  

- **2 orientaciones**: horizontal (ancho completo), vertical (altura completa)
- **4 variantes visuales**: solid, dashed, dotted, gradient
- **5 tamaños estándar**: xs, sm, md, lg, xl (grosor + espaciado)
- **6 variantes semánticas**: primary, secondary, success, warning, danger, neutral
- **Estados avanzados**: loading con spinner, disabled con overlay
- **Texto opcional**: En dividers horizontales con iconos y alineación
- **Longitud personalizada**: Control preciso del tamaño
- **Responsive**: Adaptación automática a móvil
- **Accesibilidad**: ARIA completo, navegación teclado

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { Divider } from './atoms/Divider';

// Divider simple horizontal
<Divider />

// Divider vertical
<Divider orientation="vertical" />

// Con texto en el medio
<Divider text="o continúa con" />

// Con estilo personalizado y sistema estándar
<Divider 
  dividerVariant="dashed" 
  variant="primary" 
  size="lg" 
/>

// Con iconos y loading
<Divider 
  text="Cargando datos" 
  leftIcon="database"
  loading 
  variant="primary"
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
    dividerVariant: {
      name: 'Variante visual',
      description: 'Estilo visual del divider (separado de variant semántica)',
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted', 'gradient'],
      table: {
        type: { summary: "'solid' | 'dashed' | 'dotted' | 'gradient'" },
        defaultValue: { summary: "'solid'" },
        category: 'Appearance'
      }
    },
    variant: {
      name: 'Variante semántica',
      description: 'Variante semántica del sistema estándar',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      table: {
        type: { summary: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'" },
        defaultValue: { summary: "'neutral'" },
        category: 'Standard Props'
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del componente (grosor + espaciado)',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: "'md'" },
        category: 'Standard Props'
      }
    },
    rounded: {
      name: 'Bordes redondeados',
      description: 'Radio de bordes para el texto',
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'" },
        defaultValue: { summary: "'none'" },
        category: 'Standard Props'
      }
    },
    loading: {
      name: 'Estado loading',
      description: 'Mostrar spinner de carga',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Standard Props'
      }
    },
    disabled: {
      name: 'Estado disabled',
      description: 'Estado deshabilitado del divider',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Standard Props'
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
    leftIcon: {
      name: 'Icono izquierdo',
      description: 'Nombre del icono Feather para mostrar a la izquierda del texto',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | ReactNode' },
        category: 'Icons'
      }
    },
    rightIcon: {
      name: 'Icono derecho',
      description: 'Nombre del icono Feather para mostrar a la derecha del texto',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | ReactNode' },
        category: 'Icons'
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
    dividerVariant: 'solid',
    size: 'md',
    variant: 'neutral'
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
        <Divider orientation="vertical" dividerVariant="dashed" variant="secondary" />
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
        <Divider dividerVariant={variant} variant="primary" />
      </div>
    ))}
  </div>
);

// Variantes semánticas estándar
export const SystemStandardVariants = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <h3 style={{ 
      color: 'var(--color-primary)',
      fontSize: 'var(--font-size-lg)',
      marginBottom: 'var(--space-md)'
    }}>
      Variantes Semánticas Estándar
    </h3>
    {[
      { variant: 'primary', desc: 'Separación principal', usage: 'Secciones importantes' },
      { variant: 'secondary', desc: 'Separación secundaria', usage: 'Contenido alternativo' },
      { variant: 'success', desc: 'Separación de éxito', usage: 'Secciones completadas' },
      { variant: 'warning', desc: 'Separación de advertencia', usage: 'Avisos importantes' },
      { variant: 'danger', desc: 'Separación de peligro', usage: 'Zonas críticas' },
      { variant: 'neutral', desc: 'Separación neutral (default)', usage: 'Uso general' }
    ].map(({ variant, desc, usage }) => (
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
            color: `var(--color-${variant === 'neutral' ? 'primary' : variant})`,
            minWidth: '100px'
          }}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
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
        <Divider variant={variant} size="md" />
      </div>
    ))}
  </div>
);

// Tamaños estándar
export const SystemStandardSizes = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <h3 style={{ 
      color: 'var(--color-primary)',
      fontSize: 'var(--font-size-lg)',
      marginBottom: 'var(--space-md)'
    }}>
      Tamaños Estándar (size = grosor + espaciado)
    </h3>
    {[
      { size: 'xs', desc: 'Extra pequeño', usage: 'Separaciones sutiles' },
      { size: 'sm', desc: 'Pequeño', usage: 'Contenido denso' },
      { size: 'md', desc: 'Medio (default)', usage: 'Uso general' },
      { size: 'lg', desc: 'Grande', usage: 'Secciones principales' },
      { size: 'xl', desc: 'Extra grande', usage: 'Separaciones prominentes' }
    ].map(({ size, desc, usage }) => (
      <div key={size} style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center', 
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-sm)'
        }}>
          <h4 style={{ 
            margin: 0,
            fontSize: 'var(--font-size-md)',
            color: 'var(--text-primary)',
            minWidth: '80px'
          }}>
            {size.toUpperCase()}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              {desc}
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              {usage}
            </span>
          </div>
        </div>
        <p style={{ margin: '0 0 var(--space-sm) 0', fontSize: 'var(--font-size-sm)' }}>Contenido antes</p>
        <Divider size={size} variant="primary" />
        <p style={{ margin: 'var(--space-sm) 0 0 0', fontSize: 'var(--font-size-sm)' }}>Contenido después</p>
      </div>
    ))}
  </div>
);

// Estados estándar
export const SystemStandardStates = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <h3 style={{ 
      color: 'var(--color-primary)',
      fontSize: 'var(--font-size-lg)',
      marginBottom: 'var(--space-md)'
    }}>
      Estados Estándar del Sistema
    </h3>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estado Loading
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Divider loading variant="primary" text="Cargando datos..." />
        <Divider loading variant="secondary" />
        <Divider loading variant="warning" text="Procesando" leftIcon="database" />
      </div>
    </div>

    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estado Disabled
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Divider disabled variant="primary" text="Función deshabilitada" />
        <Divider disabled variant="danger" />
        <Divider disabled text="No disponible" leftIcon="x-circle" />
      </div>
    </div>

    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Con Iconos del Sistema
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Divider text="Datos guardados" leftIcon="check-circle" variant="success" />
        <Divider text="Configuración avanzada" rightIcon="settings" variant="secondary" />
        <Divider text="Zona de peligro" leftIcon="alert-triangle" rightIcon="shield" variant="danger" />
      </div>
    </div>
  </div>
);

// Colores legacy (backward compatibility)
export const BackwardCompatibilityColors = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <h3 style={{ 
      color: 'var(--color-warning)',
      fontSize: 'var(--font-size-lg)',
      marginBottom: 'var(--space-md)'
    }}>
      ⚠️ Props Legacy (Backward Compatibility)
    </h3>
    <div style={{
      padding: 'var(--space-md)',
      backgroundColor: 'var(--bg-warning)',
      border: '1px solid var(--border-warning)',
      borderRadius: 'var(--radius-md)',
      marginBottom: 'var(--space-lg)'
    }}>
      <p style={{ 
        margin: 0, 
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-warning)'
      }}>
        <strong>Nota:</strong> Las props <code>color</code>, <code>spacing</code> y <code>thickness</code> están deprecated. 
        Usar <code>variant</code> y <code>size</code> en su lugar.
      </p>
    </div>
    {[
      { color: 'muted', newVariant: 'neutral', desc: 'muted → neutral' },
      { color: 'light', newVariant: 'neutral', desc: 'light → neutral' },
      { color: 'primary', newVariant: 'primary', desc: 'primary → primary' },
      { color: 'secondary', newVariant: 'secondary', desc: 'secondary → secondary' },
      { color: 'danger', newVariant: 'danger', desc: 'danger → danger' }
    ].map(({ color, newVariant, desc }) => (
      <div key={color} style={{ marginBottom: 'var(--space-lg)' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>
          {desc}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              Legacy: color="{color}"
            </span>
            <Divider color={color} thickness="normal" />
          </div>
          <div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)' }}>
              Nuevo: variant="{newVariant}"
            </span>
            <Divider variant={newVariant} size="md" />
          </div>
        </div>
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