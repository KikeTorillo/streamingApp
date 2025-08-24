// src/components/atoms/Image/Image.stories.jsx
import { Image } from './Image';

export default {
  title: 'Components/Atoms/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Image Atom

El átomo **Image** es el componente base para mostrar imágenes en nuestro sistema de diseño. Migrado y renombrado desde UniversalImage.

## 🎯 Características principales

- **6 variantes semánticas**: Primary, Secondary, Success, Warning, Danger, Neutral
- **5 tamaños estándar**: xs, sm, md, lg, xl
- **7 aspect ratios**: square, portrait, landscape, wide, ultrawide, golden, auto
- **Estados completos**: loading, loaded, error, disabled
- **Accesibilidad**: ARIA labels, alt text, lazy loading
- **Sistema estándar**: useInteractiveProps, nomenclatura limpia

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { Image } from './atoms/Image';

<Image 
  src="https://example.com/image.jpg"
  alt="Descripción de la imagen"
  size="md"
  aspectRatio="landscape"
  rounded="md"
/>
\\\`\\\`\\\`

## 🖼️ Aspect Ratios disponibles

- **square**: 1:1 (cuadrada)
- **portrait**: 2:3 (vertical)
- **landscape**: 3:2 (horizontal)
- **wide**: 16:9 (pantalla ancha)
- **ultrawide**: 21:9 (ultrawide)
- **golden**: 1.618:1 (proporción áurea)
- **auto**: automático según imagen

## 🎨 Estados y fallbacks

- **Loading**: Spinner durante la carga
- **Error**: Fallback cuando la imagen falla
- **Placeholder**: Contenido mientras carga
- **Lazy loading**: Carga diferida activada por defecto
        `
      }
    }
  },
  argTypes: {
    src: {
      name: 'URL de imagen',
      description: 'URL de la imagen a mostrar (requerida)',
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Contenido'
      }
    },
    alt: {
      name: 'Texto alternativo',
      description: 'Texto alternativo para accesibilidad',
      control: 'text',
      table: {
        type: { summary: 'string' },
        category: 'Accesibilidad'
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del componente',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'xs | sm | md | lg | xl' },
        defaultValue: { summary: 'md' },
        category: 'Apariencia'
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante visual del componente',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      table: {
        type: { summary: 'primary | secondary | success | warning | danger | neutral' },
        defaultValue: { summary: 'neutral' },
        category: 'Apariencia'
      }
    },
    rounded: {
      name: 'Radio de bordes',
      description: 'Radio de los bordes del componente',
      control: { type: 'select' },
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
      table: {
        type: { summary: 'none | xs | sm | md | lg | xl | 2xl | 3xl | full' },
        defaultValue: { summary: 'md' },
        category: 'Apariencia'
      }
    },
    aspectRatio: {
      name: 'Proporción de aspecto',
      description: 'Relación de aspecto de la imagen',
      control: { type: 'select' },
      options: ['square', 'portrait', 'landscape', 'wide', 'ultrawide', 'golden', 'auto'],
      table: {
        type: { summary: 'square | portrait | landscape | wide | ultrawide | golden | auto' },
        defaultValue: { summary: 'auto' },
        category: 'Dimensiones'
      }
    },
    objectFit: {
      name: 'Ajuste de imagen',
      description: 'Cómo se ajusta la imagen al contenedor',
      control: { type: 'select' },
      options: ['fill', 'cover', 'contain', 'scale-down', 'none'],
      table: {
        type: { summary: 'fill | cover | contain | scale-down | none' },
        defaultValue: { summary: 'cover' },
        category: 'Dimensiones'
      }
    },
    objectPosition: {
      name: 'Posición de imagen',
      description: 'Posición de la imagen dentro del contenedor',
      control: { type: 'select' },
      options: ['top', 'center', 'bottom', 'left', 'right'],
      table: {
        type: { summary: 'top | center | bottom | left | right' },
        defaultValue: { summary: 'center' },
        category: 'Dimensiones'
      }
    },
    lazy: {
      name: 'Carga diferida',
      description: 'Activar lazy loading',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Performance'
      }
    },
    loading: {
      name: 'Estado de carga',
      description: 'Mostrar estado de carga del sistema',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Estados'
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Estado deshabilitado del componente',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Estados'
      }
    },
    onClick: {
      name: 'Función onClick',
      description: 'Función ejecutada al hacer clic (hace la imagen interactiva)',
      action: 'clicked',
      table: {
        type: { summary: 'function' },
        category: 'Eventos'
      }
    },
    fallback: {
      name: 'Contenido fallback',
      description: 'Contenido a mostrar si la imagen falla al cargar',
      control: 'text',
      table: {
        type: { summary: 'React.ReactNode' },
        category: 'Contenido'
      }
    },
    placeholder: {
      name: 'Placeholder',
      description: 'Contenido a mostrar mientras la imagen carga',
      control: 'text',
      table: {
        type: { summary: 'React.ReactNode' },
        category: 'Contenido'
      }
    }
  }
};

// URL de imagen demo
const demoImage = 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop&crop=focalpoint&auto=format';
const portraitImage = 'https://images.unsplash.com/photo-1494790108755-2616b332b77b?w=400&h=600&fit=crop&crop=face&auto=format';
const squareImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format';

// Historia por defecto
export const Default = {
  args: {
    src: demoImage,
    alt: 'Imagen de demostración',
    size: 'md',
    variant: 'neutral',
    aspectRatio: 'landscape',
    objectFit: 'cover'
  }
};

// Galería de tamaños
export const Sizes = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
      <Image {...args} size="xs" />
      <Image {...args} size="sm" />
      <Image {...args} size="md" />
      <Image {...args} size="lg" />
      <Image {...args} size="xl" />
    </div>
  ),
  args: {
    src: squareImage,
    alt: 'Imagen en diferentes tamaños',
    aspectRatio: 'square'
  }
};

// Galería de variantes
export const Variants = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Image {...args} variant="primary" />
      <Image {...args} variant="secondary" />
      <Image {...args} variant="success" />
      <Image {...args} variant="warning" />
      <Image {...args} variant="danger" />
      <Image {...args} variant="neutral" />
    </div>
  ),
  args: {
    src: demoImage,
    alt: 'Imagen en diferentes variantes',
    size: 'lg',
    aspectRatio: 'square'
  }
};

// Aspect Ratios
export const AspectRatios = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Square (1:1)</h4>
        <Image {...args} aspectRatio="square" src={squareImage} />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Portrait (2:3)</h4>
        <Image {...args} aspectRatio="portrait" src={portraitImage} />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Landscape (3:2)</h4>
        <Image {...args} aspectRatio="landscape" src={demoImage} />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Wide (16:9)</h4>
        <Image {...args} aspectRatio="wide" src={demoImage} />
      </div>
    </div>
  ),
  args: {
    alt: 'Imagen con diferentes aspect ratios',
    size: 'md',
    objectFit: 'cover'
  }
};

// Diferentes Object Fit
export const ObjectFit = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Cover</h4>
        <Image {...args} objectFit="cover" />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Contain</h4>
        <Image {...args} objectFit="contain" />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Fill</h4>
        <Image {...args} objectFit="fill" />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Scale Down</h4>
        <Image {...args} objectFit="scale-down" />
      </div>
    </div>
  ),
  args: {
    src: portraitImage,
    alt: 'Imagen con diferentes object-fit',
    aspectRatio: 'square',
    size: 'lg'
  }
};

// Estados
export const States = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'start' }}>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Normal</h4>
        <Image {...args} />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Loading</h4>
        <Image {...args} loading={true} />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Disabled</h4>
        <Image {...args} disabled={true} />
      </div>
      <div>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Error (URL inválida)</h4>
        <Image {...args} src="invalid-url" />
      </div>
    </div>
  ),
  args: {
    alt: 'Imagen en diferentes estados',
    size: 'lg',
    aspectRatio: 'square'
  }
};

// Imagen interactiva (clickeable)
export const Interactive = {
  args: {
    src: demoImage,
    alt: 'Imagen interactiva - haz clic',
    size: 'lg',
    aspectRatio: 'landscape',
    onClick: () => alert('¡Imagen clickeada!'),
    rounded: 'lg'
  }
};

// Con fallback personalizado
export const WithFallback = {
  args: {
    src: 'invalid-url-to-trigger-fallback',
    alt: 'Imagen con fallback personalizado',
    size: 'lg',
    aspectRatio: 'square',
    fallback: (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>🖼️</span>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
          Fallback personalizado
        </p>
      </div>
    )
  }
};

// Con placeholder mientras carga
export const WithPlaceholder = {
  args: {
    src: demoImage + '?slow=true', // URL que demora en cargar
    alt: 'Imagen con placeholder',
    size: 'lg',
    aspectRatio: 'landscape',
    placeholder: (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        backgroundColor: '#e5e7eb',
        borderRadius: '8px'
      }}>
        <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>⏳</span>
        <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.875rem' }}>
          Cargando imagen...
        </p>
      </div>
    )
  }
};

// Galería de rounded corners
export const Rounded = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem' }}>none</p>
        <Image {...args} rounded="none" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem' }}>sm</p>
        <Image {...args} rounded="sm" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem' }}>md</p>
        <Image {...args} rounded="md" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem' }}>lg</p>
        <Image {...args} rounded="lg" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem' }}>full</p>
        <Image {...args} rounded="full" />
      </div>
    </div>
  ),
  args: {
    src: squareImage,
    alt: 'Imagen con diferentes rounded corners',
    size: 'md',
    aspectRatio: 'square'
  }
};