// Container.stories.jsx - MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
import PropTypes from 'prop-types';
import { Container, CONTAINER_SIZES, CONTAINER_VARIANTS } from './Container';

export default {
  title: 'Components/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Container Component

Sistema unificado de contenedores que estandariza todos los tamaños y variantes de layout.

## 🎯 Reemplaza a

- \`.page-container\` → \`<Container size="md" />\`
- \`.page-container--wide\` → \`<Container size="lg" />\`
- PageLayout containers → \`<Container size="xl" />\`

## 📐 Jerarquía de Tamaños

| Tamaño | Ancho | Uso Recomendado |
|--------|-------|-----------------|
| XS     | 480px | Modales, formularios login |
| SM     | 640px | Artículos, detalles de contenido |
| MD     | 800px | Páginas estándar |
| LG     | 1200px | Dashboards, admin panels |
| XL     | 1440px | Layout principal |
| FULL   | Sin límite | Páginas sin restricción |

## 🎨 Variantes

- **Default**: Con estilos de card (fondo, borde, sombra)
- **Simple**: Sin estilos de card (fondo transparente)
- **Compact**: Menos padding interno

## 📱 Responsive Automático

Todos los contenedores se adaptan automáticamente:
- **Desktop**: Tamaño completo
- **Tablet**: Padding reducido, márgenes ajustados
- **Mobile**: Padding mínimo, bordes redondeados

## 🛠️ Debugging

Activa \`debug={true}\` para visualizar los límites del contenedor.
        `
      }
    }
  },
  argTypes: {
    // ✅ Props estándar del sistema
    size: {
      control: 'select',
      options: Object.values(CONTAINER_SIZES),
      description: 'Tamaño del contenedor (tokens automáticos)'
    },
    variant: {
      control: 'select',
      options: Object.values(CONTAINER_VARIANTS),
      description: '6 variantes semánticas del sistema'
    },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes (tokens automáticos)'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga con spinner'
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales'
    },
    // Props específicas de Container
    as: {
      control: 'text',
      description: 'Elemento HTML (div, section, main, etc.)'
    },
    spacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Espaciado entre elementos hijos (gap)'
    },
    // Props legacy
    debug: {
      control: 'boolean',
      description: '⚠️ DEPRECATED: Usar className="debug-containers"'
    }
  }
};

// Contenido de ejemplo reutilizable
const ExampleContent = ({ title, description }) => (
  <div style={{ 
    padding: 'var(--space-lg)',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center'
  }}>
    <h3 style={{ 
      margin: '0 0 var(--space-sm) 0',
      color: 'var(--text-primary)',
      fontSize: 'var(--font-size-xl)'
    }}>
      {title}
    </h3>
    <p style={{ 
      margin: '0',
      color: 'var(--text-secondary)',
      fontSize: 'var(--font-size-sm)'
    }}>
      {description}
    </p>
  </div>
);

ExampleContent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

// ========== DEFAULT ==========
export const Default = {
  args: {
    size: 'md',
    variant: 'primary', // ✅ CORREGIDO: default → primary
    debug: false
  },
  render: (args) => (
    <Container {...args}>
      <ExampleContent 
        title="Container Default" 
        description="Tamaño MD (800px) con estilos de card por defecto"
      />
    </Container>
  )
};

// ========== TODOS LOS TAMAÑOS ==========
export const AllSizes = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <Container size="xs" debug>
      <ExampleContent 
        title="XS - 480px" 
        description="Para modales y formularios simples"
      />
    </Container>
    
    <Container size="sm" debug>
      <ExampleContent 
        title="SM - 640px" 
        description="Para artículos y detalles de contenido"
      />
    </Container>
    
    <Container size="md" debug>
      <ExampleContent 
        title="MD - 800px" 
        description="Para páginas estándar (equivale a .page-container)"
      />
    </Container>
    
    <Container size="lg" debug>
      <ExampleContent 
        title="LG - 1200px" 
        description="Para dashboards y admin panels (equivale a .page-container--wide)"
      />
    </Container>
    
    <Container size="xl" debug>
      <ExampleContent 
        title="XL - 1440px" 
        description="Para layout principal (equivale a PageLayout default)"
      />
    </Container>
    
    <Container size="full" debug>
      <ExampleContent 
        title="FULL - Sin límite" 
        description="Para páginas sin restricción de ancho"
      />
    </Container>
  </div>
);

AllSizes.parameters = {
  docs: {
    description: {
      story: 'Comparación visual de todos los tamaños disponibles con modo debug activado.'
    }
  }
};

// ========== VARIANTES ==========
export const Variants = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Primary</h4>
      <Container size="md" variant="primary">
        <ExampleContent 
          title="Variante Primary" 
          description="Con estilos de card: fondo, borde y sombra"
        />
      </Container>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Neutral</h4>
      <Container size="md" variant="neutral">
        <ExampleContent 
          title="Variante Neutral" 
          description="Sin estilos de card: fondo transparente"
        />
      </Container>
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Secondary</h4>
      <Container size="md" variant="secondary">
        <ExampleContent 
          title="Variante Secondary" 
          description="Variante naranja/dorado del sistema"
        />
      </Container>
    </div>
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Las tres variantes visuales disponibles. Simple quita los estilos de card, Compact reduce el padding.'
    }
  }
};

// ========== CASOS DE USO REALES ==========
export const RealWorldExamples = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 'var(--space-2xl)',
    padding: 'var(--space-lg)'
  }}>
    {/* Modal/Login Form */}
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>
        🔐 Formulario de Login (XS)
      </h4>
      <Container size="xs">
        <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
          <h3 style={{ margin: '0 0 var(--space-md) 0' }}>Iniciar Sesión</h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--space-sm)',
            maxWidth: '30rem',
            margin: '0 auto'
          }}>
            <input 
              type="email" 
              placeholder="Email"
              style={{ 
                padding: 'var(--space-md)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)'
              }}
            />
            <input 
              type="password" 
              placeholder="Contraseña"
              style={{ 
                padding: 'var(--space-md)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)'
              }}
            />
            <button style={{ 
              padding: 'var(--space-md)',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              marginTop: 'var(--space-sm)'
            }}>
              Entrar
            </button>
          </div>
        </div>
      </Container>
    </div>

    {/* Artículo */}
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>
        📄 Detalle de Artículo (SM)
      </h4>
      <Container size="sm">
        <article style={{ padding: 'var(--space-lg)' }}>
          <h2 style={{ margin: '0 0 var(--space-md) 0' }}>
            Título del Artículo
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: 'var(--space-lg)',
            lineHeight: '1.6'
          }}>
            Este es un ejemplo de cómo se vería un artículo o detalle de contenido 
            en un contenedor SM. El ancho está optimizado para lectura cómoda 
            sin que las líneas sean demasiado largas.
          </p>
          <p style={{ lineHeight: '1.6' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </article>
      </Container>
    </div>

    {/* Dashboard */}
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>
        📊 Dashboard Admin (LG)
      </h4>
      <Container size="lg" variant="neutral">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-lg)',
          padding: 'var(--space-lg)'
        }}>
          {['Usuarios', 'Películas', 'Categorías', 'Reports'].map(item => (
            <div key={item} style={{
              padding: 'var(--space-md)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 var(--space-sm) 0' }}>{item}</h4>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                {Math.floor(Math.random() * 1000)}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  </div>
);

RealWorldExamples.parameters = {
  docs: {
    description: {
      story: 'Ejemplos prácticos de uso en diferentes contextos: login, artículos y dashboards.'
    }
  }
};

// ========== MODO DEBUG ==========
export const DebugMode = () => (
  <div style={{ padding: 'var(--space-lg)' }}>
    <p style={{ 
      marginBottom: 'var(--space-lg)', 
      textAlign: 'center',
      background: 'var(--color-warning-light)',
      padding: 'var(--space-md)',
      borderRadius: 'var(--radius-md)'
    }}>
      🛠️ Modo Debug activado: Los bordes punteados muestran los límites de cada contenedor
    </p>
    
    <Container size="md" debug>
      <ExampleContent 
        title="Container con Debug" 
        description="Los bordes punteados azules muestran exactamente dónde termina el contenedor"
      />
    </Container>
  </div>
);

DebugMode.parameters = {
  docs: {
    description: {
      story: 'Utiliza debug={true} durante el desarrollo para visualizar los límites exactos de los contenedores.'
    }
  }
};

// ========== RESPONSIVE DEMO ==========
export const ResponsiveDemo = () => (
  <div style={{ padding: 'var(--space-lg)' }}>
    <p style={{ 
      marginBottom: 'var(--space-lg)', 
      textAlign: 'center',
      background: 'var(--color-primary-light)',
      padding: 'var(--space-md)',
      borderRadius: 'var(--radius-md)'
    }}>
      📱 Cambia el ancho del viewport para ver cómo se adaptan automáticamente
    </p>
    
    <Container size="lg" debug>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 'var(--space-md)',
        padding: 'var(--space-lg)'
      }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            padding: 'var(--space-md)',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            Item {i}
          </div>
        ))}
      </div>
    </Container>
  </div>
);

ResponsiveDemo.parameters = {
  docs: {
    description: {
      story: 'Demostración del comportamiento responsive automático. El padding y márgenes se ajustan según el viewport.'
    }
  }
};