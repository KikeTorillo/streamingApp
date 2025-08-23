// GridContainer.stories.jsx - DOCUMENTACIÓN STORYBOOK

import PropTypes from 'prop-types';
import { GridContainer, GRID_ALIGNS, GRID_JUSTIFIES } from './GridContainer.jsx';
import { Card } from '../Card/Card.jsx';
import { Button } from '../Button/Button.jsx';

export default {
  title: 'Atoms/GridContainer',
  component: GridContainer,
  parameters: {
    docs: {
      description: {
        component: `
**GridContainer** - Átomo para layouts CSS Grid estandarizados

✅ **Objetivo principal**: Eliminar 31+ usos repetitivos de \`display: grid\` en el proyecto  
✅ **Sistema estándar**: Props unificadas con otros componentes del sistema  
✅ **Tokens automáticos**: Spacing y columnas usando design tokens  
✅ **Responsive**: Adaptación automática por breakpoints  

### Casos de uso principales:
- Dashboards con tarjetas estadísticas
- Galerías de contenido (películas, series)
- Formularios en grid
- Layouts de página principales

### Reemplaza patrones como:
\`\`\`css
/* ANTES */
style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', 
  gap: 'var(--space-lg)' 
}}

/* DESPUÉS */
<GridContainer columns="auto-fit" minColumnWidth="20rem" spacing="lg">
\`\`\`
        `
      }
    }
  },
  argTypes: {
    columns: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6, 'auto-fit', 'auto-fill'],
      description: 'Configuración de columnas'
    },
    minColumnWidth: {
      control: { type: 'text' },
      description: 'Ancho mínimo para auto-fit/auto-fill'
    },
    rows: {
      control: { type: 'select' },
      options: ['auto', 1, 2, 3, 4],
      description: 'Configuración de filas'
    },
    gap: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
      description: 'Gap general usando tokens (deprecado, usar spacing)'
    },
    spacing: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
      description: 'Espaciado general usando tokens'
    },
    columnGap: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
      description: 'Gap específico para columnas'
    },
    rowGap: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
      description: 'Gap específico para filas'
    },
    align: {
      control: { type: 'select' },
      options: Object.values(GRID_ALIGNS),
      description: 'Alineación de elementos (align-items)'
    },
    justify: {
      control: { type: 'select' },
      options: Object.values(GRID_JUSTIFIES),
      description: 'Justificación de elementos (justify-items)'
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del contenedor (padding)'
    },
    variant: {
      control: { type: 'select' },
      options: ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Variante visual (neutral = sin estilos de card)'
    },
    dense: {
      control: { type: 'boolean' },
      description: 'Activar grid-auto-flow: dense'
    },
    inline: {
      control: { type: 'boolean' },
      description: 'Usar display: inline-grid'
    }
  }
};

// Contenido de ejemplo para las stories
const SampleCard = ({ title, content }) => (
  <Card variant="primary" size="sm" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
    <h4 style={{ margin: '0 0 var(--space-xs) 0' }}>{title}</h4>
    <p style={{ margin: '0', fontSize: 'var(--font-size-sm)' }}>{content}</p>
  </Card>
);

SampleCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};

const SampleStats = ({ number, label, color = 'primary' }) => (
  <div style={{ 
    textAlign: 'center', 
    padding: 'var(--space-md)',
    backgroundColor: `var(--color-${color}-light)`,
    borderRadius: 'var(--radius-md)',
    border: `1px solid var(--color-${color})`
  }}>
    <h3 style={{ margin: '0 0 var(--space-xs) 0', fontSize: 'var(--font-size-xl)' }}>{number}</h3>
    <p style={{ margin: '0', fontSize: 'var(--font-size-sm)' }}>{label}</p>
  </div>
);

SampleStats.propTypes = {
  number: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string
};

// ===== STORIES BÁSICAS =====

export const Default = {
  args: {
    children: (
      <>
        <SampleCard title="Card 1" content="Contenido de ejemplo" />
        <SampleCard title="Card 2" content="Contenido de ejemplo" />
        <SampleCard title="Card 3" content="Contenido de ejemplo" />
        <SampleCard title="Card 4" content="Contenido de ejemplo" />
      </>
    )
  }
};

export const FixedColumns = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <h3>2 Columnas</h3>
      <GridContainer columns={2} spacing="md">
        <SampleCard title="Card 1" content="Columna 1" />
        <SampleCard title="Card 2" content="Columna 2" />
        <SampleCard title="Card 3" content="Columna 1" />
        <SampleCard title="Card 4" content="Columna 2" />
      </GridContainer>
    </div>
    
    <div>
      <h3>3 Columnas</h3>
      <GridContainer columns={3} spacing="md">
        <SampleCard title="Card 1" content="Col 1" />
        <SampleCard title="Card 2" content="Col 2" />
        <SampleCard title="Card 3" content="Col 3" />
        <SampleCard title="Card 4" content="Col 1" />
        <SampleCard title="Card 5" content="Col 2" />
        <SampleCard title="Card 6" content="Col 3" />
      </GridContainer>
    </div>
    
    <div>
      <h3>4 Columnas</h3>
      <GridContainer columns={4} spacing="sm">
        {[1,2,3,4,5,6,7,8].map(i => (
          <SampleCard key={i} title={`Card ${i}`} content={`Col ${((i-1) % 4) + 1}`} />
        ))}
      </GridContainer>
    </div>
  </div>
);

export const AutoFitColumns = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <h3>Auto-fit (20rem min-width)</h3>
      <GridContainer columns="auto-fit" minColumnWidth="20rem" spacing="lg">
        <SampleCard title="Card 1" content="Se adapta automáticamente" />
        <SampleCard title="Card 2" content="Mín 20rem de ancho" />
        <SampleCard title="Card 3" content="Responsive" />
        <SampleCard title="Card 4" content="Sin media queries" />
      </GridContainer>
    </div>
    
    <div>
      <h3>Auto-fit (15rem min-width)</h3>
      <GridContainer columns="auto-fit" minColumnWidth="15rem" spacing="md">
        <SampleCard title="Card 1" content="Mín 15rem" />
        <SampleCard title="Card 2" content="Más columnas" />
        <SampleCard title="Card 3" content="En desktop" />
        <SampleCard title="Card 4" content="Misma altura" />
      </GridContainer>
    </div>
    
    <div>
      <h3>Auto-fill (25rem min-width)</h3>
      <GridContainer columns="auto-fill" minColumnWidth="25rem" spacing="xl">
        <SampleCard title="Card 1" content="Fill en lugar de fit" />
        <SampleCard title="Card 2" content="Espacio vacío posible" />
      </GridContainer>
    </div>
  </div>
);

export const AllSpacings = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <h3>Spacing: xs</h3>
      <GridContainer columns={3} spacing="xs">
        <SampleCard title="Card 1" content="Spacing xs" />
        <SampleCard title="Card 2" content="Spacing xs" />
        <SampleCard title="Card 3" content="Spacing xs" />
      </GridContainer>
    </div>
    
    <div>
      <h3>Spacing: sm</h3>
      <GridContainer columns={3} spacing="sm">
        <SampleCard title="Card 1" content="Spacing sm" />
        <SampleCard title="Card 2" content="Spacing sm" />
        <SampleCard title="Card 3" content="Spacing sm" />
      </GridContainer>
    </div>
    
    <div>
      <h3>Spacing: md</h3>
      <GridContainer columns={3} spacing="md">
        <SampleCard title="Card 1" content="Spacing md" />
        <SampleCard title="Card 2" content="Spacing md" />
        <SampleCard title="Card 3" content="Spacing md" />
      </GridContainer>
    </div>
    
    <div>
      <h3>Spacing: lg</h3>
      <GridContainer columns={3} spacing="lg">
        <SampleCard title="Card 1" content="Spacing lg" />
        <SampleCard title="Card 2" content="Spacing lg" />
        <SampleCard title="Card 3" content="Spacing lg" />
      </GridContainer>
    </div>
    
    <div>
      <h3>Spacing: xl</h3>
      <GridContainer columns={3} spacing="xl">
        <SampleCard title="Card 1" content="Spacing xl" />
        <SampleCard title="Card 2" content="Spacing xl" />
        <SampleCard title="Card 3" content="Spacing xl" />
      </GridContainer>
    </div>
    
    <div>
      <h3>Spacing: 2xl</h3>
      <GridContainer columns={3} spacing="2xl">
        <SampleCard title="Card 1" content="Spacing 2xl" />
        <SampleCard title="Card 2" content="Spacing 2xl" />
        <SampleCard title="Card 3" content="Spacing 2xl" />
      </GridContainer>
    </div>
    
    <div>
      <h3>Spacing: 3xl</h3>
      <GridContainer columns={3} spacing="3xl">
        <SampleCard title="Card 1" content="Spacing 3xl" />
        <SampleCard title="Card 2" content="Spacing 3xl" />
        <SampleCard title="Card 3" content="Spacing 3xl" />
      </GridContainer>
    </div>
  </div>
);

export const ColumnRowGaps = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <h3>Column Gap: lg, Row Gap: sm</h3>
      <GridContainer 
        columns={3} 
        columnGap="lg" 
        rowGap="sm"
      >
        <SampleCard title="Card 1" content="Col gap lg, Row gap sm" />
        <SampleCard title="Card 2" content="Col gap lg, Row gap sm" />
        <SampleCard title="Card 3" content="Col gap lg, Row gap sm" />
        <SampleCard title="Card 4" content="Col gap lg, Row gap sm" />
        <SampleCard title="Card 5" content="Col gap lg, Row gap sm" />
        <SampleCard title="Card 6" content="Col gap lg, Row gap sm" />
      </GridContainer>
    </div>
    
    <div>
      <h3>Column Gap: sm, Row Gap: xl</h3>
      <GridContainer 
        columns={3} 
        columnGap="sm" 
        rowGap="xl"
      >
        <SampleCard title="Card 1" content="Col gap sm, Row gap xl" />
        <SampleCard title="Card 2" content="Col gap sm, Row gap xl" />
        <SampleCard title="Card 3" content="Col gap sm, Row gap xl" />
        <SampleCard title="Card 4" content="Col gap sm, Row gap xl" />
        <SampleCard title="Card 5" content="Col gap sm, Row gap xl" />
        <SampleCard title="Card 6" content="Col gap sm, Row gap xl" />
      </GridContainer>
    </div>
  </div>
);

export const AllVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    {['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'].map(variant => (
      <div key={variant}>
        <h3>Variant: {variant}</h3>
        <GridContainer variant={variant} columns={3} gap="md">
          <SampleCard title="Card 1" content={`Variant ${variant}`} />
          <SampleCard title="Card 2" content={`Variant ${variant}`} />
          <SampleCard title="Card 3" content={`Variant ${variant}`} />
        </GridContainer>
      </div>
    ))}
  </div>
);

// ===== CASOS DE USO REALES =====

export const DashboardPattern = () => (
  <div>
    <h3>Dashboard Pattern (auto-fit con 22rem min)</h3>
    <GridContainer 
      columns="auto-fit" 
      minColumnWidth="22rem" 
      gap="lg"
      className="grid-container--dashboard"
    >
      <SampleStats number="150" label="Películas" color="primary" />
      <SampleStats number="75" label="Series" color="secondary" />
      <SampleStats number="1,200" label="Usuarios" color="success" />
      <SampleStats number="5,400" label="Reproducciones" color="warning" />
    </GridContainer>
  </div>
);

export const GalleryPattern = () => (
  <div>
    <h3>Gallery Pattern (auto-fill con 16rem min)</h3>
    <GridContainer 
      columns="auto-fill" 
      minColumnWidth="16rem" 
      gap="md"
      className="grid-container--gallery"
    >
      {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
        <div key={i} style={{
          aspectRatio: '2/3',
          backgroundColor: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--color-primary)'
        }}>
          <span>Item {i}</span>
        </div>
      ))}
    </GridContainer>
  </div>
);

export const CardsPattern = () => (
  <div>
    <h3>Cards Pattern (auto-fit con 25rem min)</h3>
    <GridContainer 
      columns="auto-fit" 
      minColumnWidth="25rem" 
      gap="xl"
      className="grid-container--cards"
    >
      <Card variant="primary" size="lg">
        <h4>Configuración General</h4>
        <p>Ajusta las preferencias básicas del sistema</p>
        <Button variant="primary" size="sm">Configurar</Button>
      </Card>
      
      <Card variant="secondary" size="lg">
        <h4>Usuarios</h4>
        <p>Gestiona cuentas de usuario y permisos</p>
        <Button variant="secondary" size="sm">Gestionar</Button>
      </Card>
      
      <Card variant="success" size="lg">
        <h4>Contenido</h4>
        <p>Administra películas, series y categorías</p>
        <Button variant="success" size="sm">Administrar</Button>
      </Card>
    </GridContainer>
  </div>
);

export const FormPattern = () => (
  <div>
    <h3>Form Pattern (2 columnas adaptativas)</h3>
    <GridContainer 
      columns="auto-fit" 
      minColumnWidth="20rem" 
      gap="lg"
      align="start"
      className="grid-container--form"
    >
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Nombre</label>
        <input 
          type="text" 
          style={{ 
            width: '100%', 
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }} 
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Email</label>
        <input 
          type="email" 
          style={{ 
            width: '100%', 
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }} 
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Teléfono</label>
        <input 
          type="tel" 
          style={{ 
            width: '100%', 
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }} 
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>País</label>
        <select 
          style={{ 
            width: '100%', 
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)'
          }}
        >
          <option>Seleccionar país</option>
          <option>México</option>
          <option>España</option>
          <option>Argentina</option>
        </select>
      </div>
    </GridContainer>
  </div>
);

export const StatsPattern = () => (
  <div>
    <h3>Stats Pattern (4 columnas adaptativas)</h3>
    <GridContainer 
      columns="auto-fit" 
      minColumnWidth="15rem" 
      gap="md"
      className="grid-container--stats"
    >
      <SampleStats number="1,234" label="Total Usuarios" color="primary" />
      <SampleStats number="567" label="Activos Hoy" color="success" />
      <SampleStats number="89%" label="Retención" color="secondary" />
      <SampleStats number="4.8" label="Rating" color="warning" />
    </GridContainer>
  </div>
);

// ===== ESTADOS =====

export const LoadingState = {
  args: {
    loading: true,
    columns: 3,
    gap: 'md',
    children: (
      <>
        <SampleCard title="Card 1" content="Loading..." />
        <SampleCard title="Card 2" content="Loading..." />
        <SampleCard title="Card 3" content="Loading..." />
      </>
    )
  }
};

export const DisabledState = {
  args: {
    disabled: true,
    columns: 2,
    gap: 'lg',
    variant: 'primary',
    children: (
      <>
        <SampleCard title="Card 1" content="Disabled" />
        <SampleCard title="Card 2" content="Disabled" />
      </>
    )
  }
};

// ===== RESPONSIVE =====

export const ResponsiveExample = () => (
  <div>
    <h3>Responsive GridContainer</h3>
    <p>En móvil, los spacings grandes se reducen automáticamente</p>
    <GridContainer 
      columns="auto-fit" 
      minColumnWidth="15rem" 
      spacing="3xl"
      style={{ resize: 'horizontal', overflow: 'auto', border: '1px dashed var(--border-default)' }}
    >
      <SampleCard title="Card 1" content="Responsive" />
      <SampleCard title="Card 2" content="Auto-fit" />
      <SampleCard title="Card 3" content="Mobile adapt" />
      <SampleCard title="Card 4" content="Spacing 3xl" />
    </GridContainer>
  </div>
);