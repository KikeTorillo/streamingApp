// FlexContainer.stories.jsx - DOCUMENTACIÓN STORYBOOK

import { FlexContainer, FLEX_DIRECTIONS, FLEX_ALIGNS, FLEX_JUSTIFIES } from './FlexContainer.jsx';
import { Button } from '../Button/Button.jsx';
import { Badge } from '../Badge/Badge.jsx';

export default {
  title: 'Atoms/FlexContainer',
  component: FlexContainer,
  parameters: {
    docs: {
      description: {
        component: `
**FlexContainer** - Átomo para layouts flexbox estandarizados

✅ **Objetivo principal**: Eliminar 40+ usos repetitivos de \`display: flex\` en el proyecto  
✅ **Sistema estándar**: Props unificadas con otros componentes del sistema  
✅ **Tokens automáticos**: Gap, spacing y alignment usando design tokens  
✅ **Responsive**: Adaptación automática por breakpoints  

### Casos de uso principales:
- Headers y barras de navegación
- Formularios en línea
- Botones de acciones  
- Cards con contenido alineado
- Layouts de página

### Reemplaza patrones como:
\`\`\`css
/* ANTES */
style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}

/* DESPUÉS */
<FlexContainer gap="lg" align="center">
\`\`\`
        `
      }
    }
  },
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: Object.values(FLEX_DIRECTIONS),
      description: 'Dirección del flex (flex-direction)'
    },
    align: {
      control: { type: 'select' },
      options: Object.values(FLEX_ALIGNS),
      description: 'Alineación en eje transversal (align-items)'
    },
    justify: {
      control: { type: 'select' },
      options: Object.values(FLEX_JUSTIFIES), 
      description: 'Alineación en eje principal (justify-content)'
    },
    gap: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
      description: 'Espaciado entre elementos usando tokens'
    },
    wrap: {
      control: { type: 'select' },
      options: ['nowrap', 'wrap', 'wrap-reverse'],
      description: 'Comportamiento de wrap (flex-wrap)'
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del contenedor (padding y min-height)'
    },
    variant: {
      control: { type: 'select' },
      options: ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Variante visual (neutral = sin estilos de card)'
    },
    inline: {
      control: { type: 'boolean' },
      description: 'Usar display: inline-flex'
    },
    grow: {
      control: { type: 'boolean' },
      description: 'Aplicar flex-grow: 1'
    },
    shrink: {
      control: { type: 'boolean' },
      description: 'Aplicar flex-shrink: 1'
    }
  }
};

// Contenido de ejemplo para las stories
const SampleContent = () => (
  <>
    <Button variant="primary" size="sm">Botón 1</Button>
    <Button variant="secondary" size="sm">Botón 2</Button>
    <Badge variant="success">Badge</Badge>
  </>
);

const TextContent = () => (
  <>
    <span>Elemento 1</span>
    <span>Elemento 2</span>
    <span>Elemento 3</span>
  </>
);

// ===== STORIES BÁSICAS =====

export const Default = {
  args: {
    children: <SampleContent />
  }
};

export const AllDirections = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <h3>Row (default)</h3>
      <FlexContainer direction="row" gap="md" variant="primary">
        <SampleContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Column</h3>
      <FlexContainer direction="column" gap="md" variant="secondary">
        <SampleContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Row Reverse</h3>
      <FlexContainer direction="row-reverse" gap="md" variant="success">
        <SampleContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Column Reverse</h3>
      <FlexContainer direction="column-reverse" gap="md" variant="warning">
        <SampleContent />
      </FlexContainer>
    </div>
  </div>
);

export const AllAlignments = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <h3>Flex Start</h3>
      <FlexContainer 
        align="flex-start" 
        gap="md" 
        variant="primary" 
        style={{ height: '100px' }}
      >
        <TextContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Center</h3>
      <FlexContainer 
        align="center" 
        gap="md" 
        variant="secondary" 
        style={{ height: '100px' }}
      >
        <TextContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Flex End</h3>
      <FlexContainer 
        align="flex-end" 
        gap="md" 
        variant="success" 
        style={{ height: '100px' }}
      >
        <TextContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Stretch</h3>
      <FlexContainer 
        align="stretch" 
        gap="md" 
        variant="warning" 
        style={{ height: '100px' }}
      >
        <div style={{ background: 'var(--color-primary-light)', padding: 'var(--space-sm)' }}>Elemento estirado</div>
        <div style={{ background: 'var(--color-secondary-light)', padding: 'var(--space-sm)' }}>Elemento estirado</div>
      </FlexContainer>
    </div>
  </div>
);

export const AllJustifications = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <h3>Flex Start</h3>
      <FlexContainer justify="flex-start" gap="md" variant="primary">
        <TextContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Center</h3>
      <FlexContainer justify="center" gap="md" variant="secondary">
        <TextContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Flex End</h3>
      <FlexContainer justify="flex-end" gap="md" variant="success">
        <TextContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Space Between</h3>
      <FlexContainer justify="space-between" variant="warning">
        <TextContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Space Around</h3>
      <FlexContainer justify="space-around" variant="danger">
        <TextContent />
      </FlexContainer>
    </div>
    
    <div>
      <h3>Space Evenly</h3>
      <FlexContainer justify="space-evenly" variant="primary">
        <TextContent />
      </FlexContainer>
    </div>
  </div>
);

export const AllGaps = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map(gap => (
      <div key={gap}>
        <h3>Gap: {gap}</h3>
        <FlexContainer gap={gap} variant="primary">
          <TextContent />
        </FlexContainer>
      </div>
    ))}
  </div>
);

export const AllSizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
      <div key={size}>
        <h3>Size: {size}</h3>
        <FlexContainer size={size} gap="md" variant="primary">
          <SampleContent />
        </FlexContainer>
      </div>
    ))}
  </div>
);

export const AllVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    {['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'].map(variant => (
      <div key={variant}>
        <h3>Variant: {variant}</h3>
        <FlexContainer variant={variant} gap="md" align="center">
          <SampleContent />
        </FlexContainer>
      </div>
    ))}
  </div>
);

// ===== CASOS DE USO REALES =====

export const HeaderPattern = () => (
  <FlexContainer 
    align="center" 
    justify="space-between" 
    gap="lg" 
    variant="primary"
    className="flex-container--header"
  >
    <h2>Título de Página</h2>
    <FlexContainer gap="sm">
      <Button variant="secondary" size="sm">Filtros</Button>
      <Button variant="primary" size="sm" leftIcon="plus">Crear</Button>
    </FlexContainer>
  </FlexContainer>
);

export const NavigationPattern = () => (
  <FlexContainer 
    align="center" 
    gap="md" 
    wrap="wrap"
    variant="secondary"
    className="flex-container--nav"
  >
    <Button variant="primary" size="sm">Inicio</Button>
    <Button variant="neutral" size="sm">Películas</Button>
    <Button variant="neutral" size="sm">Series</Button>
    <Button variant="neutral" size="sm">Categorías</Button>
    <Button variant="neutral" size="sm">Configuración</Button>
  </FlexContainer>
);

export const FormRowPattern = () => (
  <FlexContainer 
    align="flex-end" 
    gap="md" 
    wrap="wrap"
    className="flex-container--form-row"
  >
    <div style={{ flex: '1', minWidth: '200px' }}>
      <label>Nombre</label>
      <input type="text" style={{ width: '100%', padding: 'var(--space-sm)' }} />
    </div>
    <div style={{ flex: '1', minWidth: '200px' }}>
      <label>Email</label>
      <input type="email" style={{ width: '100%', padding: 'var(--space-sm)' }} />
    </div>
    <Button variant="primary" size="md">Guardar</Button>
  </FlexContainer>
);

export const CardActionsPattern = () => (
  <div style={{ 
    border: '1px solid var(--border-default)', 
    borderRadius: 'var(--radius-md)', 
    padding: 'var(--space-lg)' 
  }}>
    <h3>Configuraciones de Usuario</h3>
    <p>Personaliza tu experiencia en la plataforma</p>
    
    <FlexContainer 
      align="center" 
      justify="flex-end" 
      gap="sm"
      className="flex-container--card-actions"
    >
      <Button variant="neutral" size="sm">Cancelar</Button>
      <Button variant="primary" size="sm">Guardar</Button>
    </FlexContainer>
  </div>
);

export const CenterAllPattern = () => (
  <FlexContainer 
    align="center" 
    justify="center" 
    style={{ height: '200px' }}
    variant="neutral"
    className="flex-container--center-all"
  >
    <div style={{ textAlign: 'center' }}>
      <h2>Contenido Centrado</h2>
      <p>Perfecto para estados vacíos o loading</p>
      <Button variant="primary">Acción Principal</Button>
    </div>
  </FlexContainer>
);

// ===== ESTADOS =====

export const LoadingState = {
  args: {
    loading: true,
    children: <SampleContent />,
    gap: 'md',
    variant: 'primary'
  }
};

export const DisabledState = {
  args: {
    disabled: true,
    children: <SampleContent />,
    gap: 'md',
    variant: 'secondary'
  }
};

// ===== RESPONSIVE =====

export const ResponsiveExample = () => (
  <div>
    <h3>Responsive FlexContainer</h3>
    <p>En móvil, los gaps grandes se reducen automáticamente y los contenedores row hacen wrap</p>
    <FlexContainer 
      gap="3xl" 
      wrap="nowrap" 
      variant="primary"
      style={{ resize: 'horizontal', overflow: 'auto', border: '1px dashed var(--border-default)' }}
    >
      <Button variant="primary">Botón Largo 1</Button>
      <Button variant="secondary">Botón Largo 2</Button>
      <Button variant="success">Botón Largo 3</Button>
      <Button variant="warning">Botón Largo 4</Button>
    </FlexContainer>
  </div>
);