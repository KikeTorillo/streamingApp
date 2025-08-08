import { Skeleton } from './Skeleton';

export default {
  title: 'Components/Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Skeleton Atom

El átomo **Skeleton** proporciona estados de carga elegantes que mejoran la experiencia del usuario durante el loading.

## 🎯 Características principales

- **4 variantes predefinidas**: text, avatar, image, card
- **5 tamaños estándar**: xs, sm, md, lg, xl
- **3 formas configurables**: rectangular, rounded, circular
- **Múltiples líneas**: Para simular párrafos de texto
- **Animación shimmer**: Efecto de carga suave y moderno
- **Aspect ratio**: Configuración precisa para imágenes
- **Componentes de conveniencia**: Skeleton.Text, Skeleton.Avatar, etc.
- **Composición flexible**: Para layouts complejos
- **Responsive**: Adaptación automática a móvil
- **Accesibilidad**: ARIA roles y labels apropiados

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { Skeleton } from './atoms/Skeleton';

// Skeleton simple de texto
<Skeleton variant="text" />

// Múltiples líneas
<Skeleton variant="text" lines={3} />

// Avatar circular
<Skeleton variant="avatar" size="lg" />

// Imagen con aspect ratio
<Skeleton variant="image" aspectRatio="16/9" />

// Componentes de conveniencia
<Skeleton.Text lines={2} />
<Skeleton.Avatar size="md" />
<Skeleton.Image aspectRatio="4/3" />
\\\`\\\`\\\`

## 🎨 Casos de uso comunes

### Loading de listas
\\\`\\\`\\\`jsx
<div className="skeleton-list">
  {Array(3).fill(0).map((_, i) => (
    <div key={i} className="skeleton-list-item">
      <Skeleton.Avatar />
      <div className="skeleton-content">
        <Skeleton.Text width="60%" />
        <Skeleton.Text width="40%" size="sm" />
      </div>
    </div>
  ))}
</div>
\\\`\\\`\\\`

### Loading de cards
\\\`\\\`\\\`jsx
<div className="skeleton-grid">
  {Array(6).fill(0).map((_, i) => (
    <div key={i}>
      <Skeleton.Image aspectRatio="16/9" />
      <div className="skeleton-card-content">
        <Skeleton.Text lines={2} />
        <Skeleton.Text width="30%" size="sm" />
      </div>
    </div>
  ))}
</div>
\\\`\\\`\\\`

## 🚀 Variantes y personalización

- **variant="text"**: Para títulos, párrafos, labels
- **variant="avatar"**: Para fotos de perfil, iconos circulares
- **variant="image"**: Para thumbnails, portadas, banners
- **variant="card"**: Para contenedores completos
- **variant="custom"**: Base sin estilos predefinidos

## 💡 Mejores prácticas

- Usar el mismo aspect ratio que el contenido final
- Mantener las proporciones similares al contenido real
- Combinar diferentes variantes para layouts complejos
- Usar animación consistente en toda la aplicación
        `
      }
    }
  },
  argTypes: {
    variant: {
      name: 'Variante',
      description: 'Tipo de skeleton',
      control: { type: 'select' },
      options: ['text', 'avatar', 'image', 'card', 'custom'],
      table: {
        type: { summary: "'text' | 'avatar' | 'image' | 'card' | 'custom'" },
        defaultValue: { summary: "'text'" },
        category: 'Appearance'
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño base del skeleton',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: "'md'" },
        category: 'Appearance'
      }
    },
    lines: {
      name: 'Líneas',
      description: 'Número de líneas (solo para variant="text")',
      control: { type: 'number', min: 1, max: 10 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: 'Content'
      }
    },
    shape: {
      name: 'Forma',
      description: 'Forma del skeleton',
      control: { type: 'select' },
      options: ['rectangular', 'rounded', 'circular'],
      table: {
        type: { summary: "'rectangular' | 'rounded' | 'circular'" },
        defaultValue: { summary: "'rounded'" },
        category: 'Appearance'
      }
    },
    width: {
      name: 'Ancho',
      description: 'Ancho personalizado (CSS value)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number' },
        category: 'Layout'
      }
    },
    height: {
      name: 'Alto',
      description: 'Alto personalizado (CSS value)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number' },
        category: 'Layout'
      }
    },
    aspectRatio: {
      name: 'Aspect Ratio',
      description: 'Proporción de aspecto (ej: "16/9", "4/3")',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Layout'
      }
    },
    animate: {
      name: 'Animación',
      description: 'Habilitar animación shimmer',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Animation'
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
    variant: 'text',
    size: 'md',
    animate: true
  }
};

// Variantes
export const Variants = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { variant: 'text', desc: 'Para títulos y párrafos' },
      { variant: 'avatar', desc: 'Para fotos de perfil' },
      { variant: 'image', desc: 'Para thumbnails e imágenes' },
      { variant: 'card', desc: 'Para contenedores completos' }
    ].map(({ variant, desc }) => (
      <div key={variant} style={{ 
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)'
      }}>
        <h4 style={{ 
          marginBottom: 'var(--space-md)',
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-md)',
          fontWeight: 'var(--font-weight-semibold)',
          textTransform: 'capitalize'
        }}>
          {variant}
        </h4>
        <div style={{ marginBottom: 'var(--space-sm)' }}>
          <Skeleton variant={variant} size="lg" />
        </div>
        <p style={{ 
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-muted)',
          margin: 0
        }}>
          {desc}
        </p>
      </div>
    ))}
  </div>
);

// Tamaños
export const Sizes = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { size: 'xs', desc: 'Extra pequeño' },
      { size: 'sm', desc: 'Pequeño' },
      { size: 'md', desc: 'Medio (default)' },
      { size: 'lg', desc: 'Grande' },
      { size: 'xl', desc: 'Extra grande' }
    ].map(({ size, desc }) => (
      <div key={size}>
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
          <span style={{ 
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-muted)'
          }}>
            {desc}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
          <Skeleton variant="text" size={size} width="200px" />
          <Skeleton variant="avatar" size={size} />
          <Skeleton variant="image" size={size} width="120px" />
        </div>
      </div>
    ))}
  </div>
);

// Formas
export const Shapes = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { shape: 'rectangular', desc: 'Sin bordes redondeados' },
      { shape: 'rounded', desc: 'Bordes redondeados (default)' },
      { shape: 'circular', desc: 'Completamente circular' }
    ].map(({ shape, desc }) => (
      <div key={shape} style={{ textAlign: 'center' }}>
        <h4 style={{ 
          marginBottom: 'var(--space-md)',
          color: 'var(--text-primary)',
          textTransform: 'capitalize'
        }}>
          {shape}
        </h4>
        <div style={{ marginBottom: 'var(--space-sm)' }}>
          <Skeleton variant="custom" shape={shape} width="80px" height="80px" />
        </div>
        <p style={{ 
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-muted)',
          margin: 0
        }}>
          {desc}
        </p>
      </div>
    ))}
  </div>
);

// Múltiples líneas
export const MultipleLines = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)',
    maxWidth: '600px'
  }}>
    {[1, 2, 3, 4, 5].map(lines => (
      <div key={lines}>
        <h4 style={{ 
          marginBottom: 'var(--space-md)',
          color: 'var(--text-primary)'
        }}>
          {lines} línea{lines > 1 ? 's' : ''}
        </h4>
        <Skeleton variant="text" lines={lines} />
      </div>
    ))}
  </div>
);

// Aspect ratios
export const AspectRatios = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 'var(--space-lg)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { ratio: '1/1', desc: 'Cuadrado' },
      { ratio: '4/3', desc: 'Clásico' },
      { ratio: '16/9', desc: 'Widescreen' },
      { ratio: '21/9', desc: 'Ultra-wide' }
    ].map(({ ratio, desc }) => (
      <div key={ratio}>
        <h4 style={{ 
          marginBottom: 'var(--space-sm)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          {ratio}
        </h4>
        <Skeleton variant="image" aspectRatio={ratio} />
        <p style={{ 
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: 'var(--space-xs)'
        }}>
          {desc}
        </p>
      </div>
    ))}
  </div>
);

// Componentes de conveniencia
export const ConvenienceComponents = () => (
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
        Componentes de Conveniencia
      </h3>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-lg)'
      }}>
        <div style={{ 
          padding: 'var(--space-md)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Skeleton.Text</h4>
          <Skeleton.Text lines={3} />
          <div style={{ 
            marginTop: 'var(--space-sm)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-family-mono)'
          }}>
            {'<Skeleton.Text lines={3} />'}
          </div>
        </div>

        <div style={{ 
          padding: 'var(--space-md)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          textAlign: 'center'
        }}>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Skeleton.Avatar</h4>
          <Skeleton.Avatar size="lg" />
          <div style={{ 
            marginTop: 'var(--space-sm)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-family-mono)'
          }}>
            {'<Skeleton.Avatar size="lg" />'}
          </div>
        </div>

        <div style={{ 
          padding: 'var(--space-md)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Skeleton.Image</h4>
          <Skeleton.Image aspectRatio="16/9" />
          <div style={{ 
            marginTop: 'var(--space-sm)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-family-mono)'
          }}>
            {'<Skeleton.Image aspectRatio="16/9" />'}
          </div>
        </div>

        <div style={{ 
          padding: 'var(--space-md)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Skeleton.Card</h4>
          <Skeleton.Card size="md" />
          <div style={{ 
            marginTop: 'var(--space-sm)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-family-mono)'
          }}>
            {'<Skeleton.Card size="md" />'}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Casos de uso prácticos
export const PracticalExamples = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2xl)',
    padding: 'var(--space-lg)'
  }}>
    {/* Lista de usuarios */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Lista de Usuarios
      </h3>
      <div className="skeleton-list">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="skeleton-list-item" style={{
            display: 'flex',
            gap: 'var(--space-md)',
            padding: 'var(--space-md)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            <Skeleton.Avatar size="md" />
            <div className="skeleton-content" style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)'
            }}>
              <Skeleton.Text width="60%" />
              <Skeleton.Text width="40%" size="sm" />
              <Skeleton.Text width="80%" size="xs" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Grid de películas */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Grid de Películas
      </h3>
      <div className="skeleton-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 'var(--space-lg)'
      }}>
        {Array(6).fill(0).map((_, i) => (
          <div key={i}>
            <Skeleton.Image aspectRatio="2/3" />
            <div className="skeleton-card-content" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
              padding: 'var(--space-sm) 0'
            }}>
              <Skeleton.Text lines={2} />
              <Skeleton.Text width="30%" size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Dashboard stats */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Dashboard de Estadísticas
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-lg)'
      }}>
        {Array(4).fill(0).map((_, i) => (
          <div key={i} style={{
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)'
          }}>
            <div className="skeleton-card-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-md)'
            }}>
              <Skeleton.Text width="60%" />
              <Skeleton variant="custom" width="24px" height="24px" shape="rounded" />
            </div>
            <div className="skeleton-card-body">
              <Skeleton.Text width="40%" size="xl" />
              <Skeleton.Text width="80%" size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Estados de animación
export const AnimationStates = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <div style={{ 
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)'
    }}>
      <h4 style={{ 
        marginBottom: 'var(--space-md)',
        color: 'var(--text-primary)'
      }}>
        Con Animación (default)
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Skeleton.Text lines={3} animate={true} />
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <Skeleton.Avatar size="md" animate={true} />
          <div style={{ flex: 1 }}>
            <Skeleton.Text animate={true} />
            <Skeleton.Text width="60%" size="sm" animate={true} />
          </div>
        </div>
      </div>
    </div>

    <div style={{ 
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)'
    }}>
      <h4 style={{ 
        marginBottom: 'var(--space-md)',
        color: 'var(--text-primary)'
      }}>
        Sin Animación
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Skeleton.Text lines={3} animate={false} />
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <Skeleton.Avatar size="md" animate={false} />
          <div style={{ flex: 1 }}>
            <Skeleton.Text animate={false} />
            <Skeleton.Text width="60%" size="sm" animate={false} />
          </div>
        </div>
      </div>
    </div>
  </div>
);