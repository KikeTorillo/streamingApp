// components/atoms/UniversalImage/UniversalImage.stories.jsx
import { UniversalImage } from './UniversalImage';
import { UNIVERSAL_ASPECT_RATIOS } from '../../../tokens/cardTokens-universal';

export default {
  title: 'Atoms/UniversalImage',
  component: UniversalImage,
  parameters: {
    docs: {
      description: {
        component: `
# UniversalImage - Componente Universal 100% Reutilizable

Componente de imagen completamente universal, sin acoplamientos a dominios específicos.
Perfecto para cualquier tipo de proyecto: e-commerce, social media, streaming, corporativo, etc.

## 🎯 Casos de Uso Universales

- **E-commerce**: Productos con \`aspectRatio="portrait"\`
- **Social Media**: Avatares con \`aspectRatio="square"\`
- **Corporativo**: Banners con \`aspectRatio="wide"\`
- **Blog**: Fotos con \`aspectRatio="landscape"\`
- **Apps móviles**: Stories con \`aspectRatio="mobile"\`

## ✅ Ventajas vs ContentImage

- ✅ **API limpia**: aspectRatio directo vs contentType mapeado
- ✅ **100% universal**: Sin lógica específica de dominio
- ✅ **Flexible**: Aspect ratios predefinidos + personalizados
- ✅ **Reutilizable**: Mismo componente para cualquier proyecto
        `
      }
    }
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'URL de la imagen (requerida)'
    },
    alt: {
      control: 'text', 
      description: 'Texto alternativo (requerido)'
    },
    aspectRatio: {
      control: { type: 'select' },
      options: Object.keys(UNIVERSAL_ASPECT_RATIOS),
      description: 'Proporción de aspecto universal'
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Tamaño del componente'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante visual'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder personalizado (emoji o texto)'
    },
    objectFit: {
      control: { type: 'select' },
      options: ['cover', 'contain', 'fill', 'scale-down', 'none'],
      description: 'Comportamiento de ajuste de la imagen'
    },
    showFallback: {
      control: 'boolean',
      description: 'Mostrar fallback en caso de error'
    },
    blur: {
      control: 'boolean',
      description: 'Efecto blur durante carga progresiva'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado'
    }
  }
};

// URL de ejemplo para stories
const EXAMPLE_IMAGE = 'https://picsum.photos/400/600';
const EXAMPLE_LANDSCAPE = 'https://picsum.photos/600/400';
const EXAMPLE_SQUARE = 'https://picsum.photos/400/400';

export const Default = {
  args: {
    src: EXAMPLE_IMAGE,
    alt: 'Imagen de ejemplo',
    aspectRatio: 'portrait',
    size: 'md',
    variant: 'neutral',
    placeholder: '🖼️'
  }
};

export const AllAspectRatios = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '2rem' }}>
      {Object.entries(UNIVERSAL_ASPECT_RATIOS).map(([name, ratio]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <UniversalImage
            src={name === 'square' ? EXAMPLE_SQUARE : name.includes('wide') || name === 'landscape' ? EXAMPLE_LANDSCAPE : EXAMPLE_IMAGE}
            alt={`Ejemplo ${name}`}
            aspectRatio={name}
            size="sm"
            placeholder={`📐 ${ratio}`}
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
            {name} ({ratio})
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todos los aspect ratios universales disponibles'
      }
    }
  }
};

export const AllSizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'end', gap: '2rem', padding: '2rem' }}>
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
        <div key={size} style={{ textAlign: 'center' }}>
          <UniversalImage
            src={EXAMPLE_IMAGE}
            alt={`Tamaño ${size}`}
            aspectRatio="portrait"
            size={size}
            placeholder="📏"
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
            {size}
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todos los tamaños disponibles manteniendo aspect ratio'
      }
    }
  }
};

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', padding: '2rem', flexWrap: 'wrap' }}>
      {['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].map(variant => (
        <div key={variant} style={{ textAlign: 'center' }}>
          <UniversalImage
            src={EXAMPLE_SQUARE}
            alt={`Variante ${variant}`}
            aspectRatio="square"
            size="sm"
            variant={variant}
            placeholder="🎨"
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
            {variant}
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes variantes visuales con bordes de colores'
      }
    }
  }
};

export const CustomPlaceholders = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <UniversalImage
          src="https://invalid-url.jpg"
          alt="E-commerce producto"
          aspectRatio="portrait"
          size="sm"
          placeholder="🛍️"
        />
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>E-commerce</p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <UniversalImage
          src="https://invalid-url.jpg"
          alt="Avatar usuario"
          aspectRatio="square"
          size="sm"
          placeholder="👤"
        />
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Avatar</p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <UniversalImage
          src="https://invalid-url.jpg"
          alt="Imagen de blog"
          aspectRatio="landscape"
          size="sm"
          placeholder="📝"
        />
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Blog</p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <UniversalImage
          src="https://invalid-url.jpg"
          alt="Banner promocional"
          aspectRatio="wide"
          size="sm"
          placeholder="🎯"
        />
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Banner</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Placeholders personalizados para diferentes tipos de contenido (con URLs inválidas para mostrar fallback)'
      }
    }
  }
};

export const ObjectFitComparison = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '2rem' }}>
      {['cover', 'contain', 'fill', 'scale-down'].map(objectFit => (
        <div key={objectFit} style={{ textAlign: 'center' }}>
          <UniversalImage
            src={EXAMPLE_LANDSCAPE}
            alt={`Object fit ${objectFit}`}
            aspectRatio="square"
            size="md"
            objectFit={objectFit}
            placeholder="🔄"
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
            object-fit: {objectFit}
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparación de diferentes valores de object-fit usando imagen landscape en contenedor square'
      }
    }
  }
};

export const LoadingStates = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <UniversalImage
          src=""
          alt="Estado de carga"
          aspectRatio="portrait"
          size="sm"
          placeholder="⏳"
        />
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Loading</p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <UniversalImage
          src="https://invalid-url.jpg"
          alt="Estado de error"
          aspectRatio="portrait"
          size="sm"
          placeholder="❌"
          showFallback={true}
        />
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Error con fallback</p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <UniversalImage
          src={EXAMPLE_IMAGE}
          alt="Estado deshabilitado"
          aspectRatio="portrait"
          size="sm"
          disabled={true}
          placeholder="🚫"
        />
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Disabled</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes estados: loading, error y disabled'
      }
    }
  }
};

export const CustomAspectRatio = {
  args: {
    src: EXAMPLE_IMAGE,
    alt: 'Aspect ratio personalizado',
    aspectRatio: '4/3',
    size: 'md',
    placeholder: '📐'
  },
  parameters: {
    docs: {
      description: {
        story: 'Ejemplo con aspect ratio personalizado (4/3) que no está en los presets'
      }
    }
  }
};

export const FullWidth = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <UniversalImage
        src={EXAMPLE_LANDSCAPE}
        alt="Imagen ancho completo"
        aspectRatio="wide"
        size="full"
        placeholder="↔️"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Imagen con tamaño "full" que ocupa todo el ancho del contenedor'
      }
    }
  }
};

export const BlurEffect = {
  args: {
    src: EXAMPLE_IMAGE,
    alt: 'Imagen con blur durante carga',
    aspectRatio: 'portrait',
    size: 'md',
    blur: true,
    placeholder: '🌫️'
  },
  parameters: {
    docs: {
      description: {
        story: 'Efecto blur durante la carga progresiva de la imagen'
      }
    }
  }
};