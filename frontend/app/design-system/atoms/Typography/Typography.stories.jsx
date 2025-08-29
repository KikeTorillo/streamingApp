// Typography.stories.jsx - DOCUMENTACIÓN STORYBOOK

import { Typography, TYPOGRAPHY_SIZES, TYPOGRAPHY_WEIGHTS, TYPOGRAPHY_COLORS } from './Typography.jsx';

export default {
  title: 'Atoms/Typography',
  component: Typography,
  parameters: {
    docs: {
      description: {
        component: `
**Typography** - Átomo para tipografía semántica estandarizada

✅ **Objetivo principal**: Eliminar 13+ usos repetitivos de \`fontSize\` inline en el proyecto  
✅ **Sistema estándar**: Props unificadas con otros componentes del sistema  
✅ **Tokens automáticos**: Font sizes, weights y line heights usando design tokens  
✅ **Semántica**: Elementos HTML correctos según contexto  
✅ **Accesibilidad**: Jerarquía visual y semántica correcta  

### Casos de uso principales:
- Headings y títulos de página
- Texto de cuerpo y párrafos
- Captions y texto secundario
- Elementos semánticos (h1-h6, p, span, etc.)

### Reemplaza patrones como:
\`\`\`css
/* ANTES */
style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)' }}

/* DESPUÉS */
<Typography size="xl" weight="semibold">
\`\`\`

### Mapeo semántico automático:
- \`size=&quot;3xl&quot; | size=&quot;2xl&quot;\` → \`&lt;h1&gt;\`
- \`size=&quot;xl&quot;\` → \`&lt;h2&gt;\`
- \`size=&quot;lg&quot;\` → \`&lt;h3&gt;\`
- \`size=&quot;md&quot;\` → \`&lt;p&gt;\` (default)
- \`size=&quot;sm&quot;\` → \`&lt;span&gt;\`
- \`size=&quot;xs&quot;\` → \`&lt;small&gt;\`
        `
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: Object.values(TYPOGRAPHY_SIZES),
      description: 'Tamaño de la fuente (mapeo semántico automático)'
    },
    weight: {
      control: { type: 'select' },
      options: Object.values(TYPOGRAPHY_WEIGHTS),
      description: 'Peso de la fuente'
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: 'Alineación del texto'
    },
    color: {
      control: { type: 'select' },
      options: Object.values(TYPOGRAPHY_COLORS),
      description: 'Color semántico del texto'
    },
    lineHeight: {
      control: { type: 'select' },
      options: ['tight', 'normal', 'relaxed', 'loose'],
      description: 'Altura de línea usando tokens'
    },
    as: {
      control: { type: 'text' },
      description: 'Elemento HTML específico (sobrescribe mapeo automático)'
    },
    variant: {
      control: { type: 'select' },
      options: ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Variante visual del sistema'
    },
    truncate: {
      control: { type: 'boolean' },
      description: 'Truncar texto con ellipsis'
    },
    maxLines: {
      control: { type: 'number' },
      description: 'Limitar número de líneas visible'
    },
    italic: {
      control: { type: 'boolean' },
      description: 'Aplicar estilo italic'
    },
    underline: {
      control: { type: 'boolean' },
      description: 'Aplicar subrayado'
    },
    uppercase: {
      control: { type: 'boolean' },
      description: 'Transformar a mayúsculas'
    },
    lowercase: {
      control: { type: 'boolean' },
      description: 'Transformar a minúsculas'
    }
  }
};

// ===== STORIES BÁSICAS =====

export const Default = {
  args: {
    children: 'Este es un texto de ejemplo usando el componente Typography.'
  }
};

export const AllSizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
    <Typography size="3xl">Tamaño 3XL - Display heading (H1 automático)</Typography>
    <Typography size="2xl">Tamaño 2XL - Large heading (H1 automático)</Typography>
    <Typography size="xl">Tamaño XL - Heading (H2 automático)</Typography>
    <Typography size="lg">Tamaño LG - Subheading (H3 automático)</Typography>
    <Typography size="md">Tamaño MD - Body text (P automático - default)</Typography>
    <Typography size="sm">Tamaño SM - Secondary text (SPAN automático)</Typography>
    <Typography size="xs">Tamaño XS - Caption text (SMALL automático)</Typography>
  </div>
);

export const AllWeights = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
    <Typography weight="light">Weight Light (300)</Typography>
    <Typography weight="normal">Weight Normal (400) - Default</Typography>
    <Typography weight="medium">Weight Medium (500)</Typography>
    <Typography weight="semibold">Weight Semibold (600)</Typography>
    <Typography weight="bold">Weight Bold (700)</Typography>
    <Typography weight="extrabold">Weight Extrabold (800)</Typography>
  </div>
);

export const AllColors = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
    <Typography color="primary">Color Primary - Azul principal del tema</Typography>
    <Typography color="secondary">Color Secondary - Naranja secundario</Typography>
    <Typography color="success">Color Success - Verde para éxito</Typography>
    <Typography color="warning">Color Warning - Amarillo para advertencia</Typography>
    <Typography color="danger">Color Danger - Rojo para peligro</Typography>
    <Typography color="muted">Color Muted - Gris para texto secundario</Typography>
    <Typography color="light">Color Light - Para fondos oscuros</Typography>
    <Typography color="dark">Color Dark - Para fondos claros</Typography>
  </div>
);

export const AllVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
    <Typography variant="neutral">Variant Neutral - Sin color específico</Typography>
    <Typography variant="primary">Variant Primary - Color + weight medium</Typography>
    <Typography variant="secondary">Variant Secondary - Color + weight medium</Typography>
    <Typography variant="success">Variant Success - Color + weight medium</Typography>
    <Typography variant="warning">Variant Warning - Color + weight medium</Typography>
    <Typography variant="danger">Variant Danger - Color + weight medium</Typography>
  </div>
);

export const AllAlignments = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <Typography size="sm" color="muted">Align Left (default):</Typography>
      <Typography align="left">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
    </div>
    
    <div>
      <Typography size="sm" color="muted">Align Center:</Typography>
      <Typography align="center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
    </div>
    
    <div>
      <Typography size="sm" color="muted">Align Right:</Typography>
      <Typography align="right">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
    </div>
    
    <div>
      <Typography size="sm" color="muted">Align Justify:</Typography>
      <Typography align="justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </Typography>
    </div>
  </div>
);

export const LineHeights = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <Typography size="sm" color="muted">Line Height Tight (1.25):</Typography>
      <Typography lineHeight="tight">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
      </Typography>
    </div>
    
    <div>
      <Typography size="sm" color="muted">Line Height Normal (1.5) - Default:</Typography>
      <Typography lineHeight="normal">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
      </Typography>
    </div>
    
    <div>
      <Typography size="sm" color="muted">Line Height Relaxed (1.625):</Typography>
      <Typography lineHeight="relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
      </Typography>
    </div>
    
    <div>
      <Typography size="sm" color="muted">Line Height Loose (2):</Typography>
      <Typography lineHeight="loose">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
      </Typography>
    </div>
  </div>
);

export const TextModifiers = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
    <Typography italic>Texto en italic</Typography>
    <Typography underline>Texto con subrayado</Typography>
    <Typography uppercase>texto en mayúsculas</Typography>
    <Typography lowercase>TEXTO EN MINÚSCULAS</Typography>
    <Typography italic underline>Combinación: italic + underline</Typography>
    <Typography weight="bold" uppercase color="primary">Combinación: bold + uppercase + color</Typography>
  </div>
);

export const TruncateAndMaxLines = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div style={{ width: '300px' }}>
      <Typography size="sm" color="muted">Truncate (ellipsis en una línea):</Typography>
      <Typography truncate>
        Este es un texto muy largo que debería ser truncado con ellipsis cuando exceda el ancho del contenedor
      </Typography>
    </div>
    
    <div style={{ width: '300px' }}>
      <Typography size="sm" color="muted">Max Lines 2:</Typography>
      <Typography maxLines={2}>
        Este es un texto más largo que debería cortarse después de exactamente dos líneas con ellipsis al final. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
    </div>
    
    <div style={{ width: '300px' }}>
      <Typography size="sm" color="muted">Max Lines 3:</Typography>
      <Typography maxLines={3}>
        Este es un texto aún más largo que debería cortarse después de tres líneas. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
    </div>
  </div>
);

// ===== MAPEO SEMÁNTICO AUTOMÁTICO =====

export const SemanticMapping = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
    <div>
      <Typography size="sm" color="muted">Mapeo automático por tamaño:</Typography>
    </div>
    
    <Typography size="3xl">H1 - Size 3xl (automático)</Typography>
    <Typography size="2xl">H1 - Size 2xl (automático)</Typography>
    <Typography size="xl">H2 - Size xl (automático)</Typography>
    <Typography size="lg">H3 - Size lg (automático)</Typography>
    <Typography size="md">P - Size md (automático, default)</Typography>
    <Typography size="sm">SPAN - Size sm (automático)</Typography>
    <Typography size="xs">SMALL - Size xs (automático)</Typography>
    
    <div style={{ marginTop: 'var(--space-lg)' }}>
      <Typography size="sm" color="muted">Override manual con prop &apos;as&apos;:</Typography>
      <Typography size="md" as="h4">H4 - Size md pero elemento H4 forzado</Typography>
      <Typography size="lg" as="p">P - Size lg pero elemento P forzado</Typography>
    </div>
  </div>
);

// ===== CASOS DE USO REALES =====

export const PageHeader = () => (
  <div>
    <Typography size="3xl" weight="bold" color="primary">Configuración de Usuario</Typography>
    <Typography size="lg" color="muted" style={{ marginTop: 'var(--space-sm)' }}>
      Personaliza tu experiencia en la plataforma
    </Typography>
  </div>
);

export const ArticleContent = () => (
  <div style={{ maxWidth: '600px' }}>
    <Typography size="2xl" weight="bold">Introducción a los Sistemas de Diseño</Typography>
    
    <Typography size="lg" weight="medium" color="muted" style={{ marginTop: 'var(--space-md)' }}>
      Los sistemas de diseño son fundamentales para mantener la consistencia visual en aplicaciones modernas.
    </Typography>
    
    <Typography style={{ marginTop: 'var(--space-lg)' }}>
      Un sistema de diseño bien implementado permite a los equipos trabajar de manera más eficiente 
      y mantener una experiencia de usuario coherente en todos los puntos de contacto.
    </Typography>
    
    <Typography style={{ marginTop: 'var(--space-md)' }}>
      Los componentes como Typography aseguran que la tipografía siga patrones consistentes 
      y utilice tokens de diseño centralizados para tamaños, pesos y colores.
    </Typography>
    
    <Typography size="sm" color="muted" style={{ marginTop: 'var(--space-lg)' }}>
      Última actualización: Agosto 2025
    </Typography>
  </div>
);

export const CardWithTypography = () => (
  <div style={{ 
    border: '1px solid var(--border-default)', 
    borderRadius: 'var(--radius-lg)', 
    padding: 'var(--space-lg)',
    maxWidth: '400px'
  }}>
    <Typography size="xl" weight="semibold">Película Destacada</Typography>
    
    <Typography size="md" weight="medium" color="secondary" style={{ marginTop: 'var(--space-xs)' }}>
      Ciencia Ficción • 2024
    </Typography>
    
    <Typography style={{ marginTop: 'var(--space-md)' }} maxLines={3}>
      Una épica aventura espacial que explora los límites de la humanidad en un futuro distante. 
      Con efectos visuales impresionantes y una narrativa cautivadora que mantiene al espectador 
      en tensión durante toda la película.
    </Typography>
    
    <Typography size="sm" color="muted" style={{ marginTop: 'var(--space-md)' }}>
      Duración: 148 min • Rating: 8.7/10
    </Typography>
  </div>
);

export const FormLabels = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: '300px' }}>
    <div>
      <Typography as="label" size="sm" weight="medium">Nombre completo</Typography>
      <input 
        type="text" 
        style={{ 
          width: '100%', 
          padding: 'var(--space-sm)', 
          marginTop: 'var(--space-xs)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)'
        }} 
      />
    </div>
    
    <div>
      <Typography as="label" size="sm" weight="medium">Email</Typography>
      <Typography size="xs" color="muted">Usaremos este email para contactarte</Typography>
      <input 
        type="email" 
        style={{ 
          width: '100%', 
          padding: 'var(--space-sm)', 
          marginTop: 'var(--space-xs)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)'
        }} 
      />
    </div>
  </div>
);

// ===== ESTADOS =====

export const LoadingState = {
  args: {
    loading: true,
    children: 'Este texto está en estado de carga'
  }
};

export const DisabledState = {
  args: {
    disabled: true,
    children: 'Este texto está deshabilitado'
  }
};

// ===== UTILIDADES ESPECIALES =====

export const SpecialUtilities = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <Typography size="sm" color="muted">Caption utility:</Typography>
      <Typography className="typography--caption">
        Esta es una caption con estilos predefinidos
      </Typography>
    </div>
    
    <div>
      <Typography size="sm" color="muted">Lead paragraph utility:</Typography>
      <Typography className="typography--lead">
        Este es un párrafo principal con mayor tamaño y espaciado para introducir contenido importante.
      </Typography>
    </div>
    
    <div>
      <Typography size="sm" color="muted">Code utility:</Typography>
      <Typography>
        Para ejecutar el comando usa <Typography as="code" className="typography--code">npm run dev</Typography> en la terminal.
      </Typography>
    </div>
    
    <div>
      <Typography size="sm" color="muted">Quote utility:</Typography>
      <Typography className="typography--quote">
        &quot;Los sistemas de diseño son la base de productos digitales escalables y consistentes.&quot;
      </Typography>
    </div>
  </div>
);