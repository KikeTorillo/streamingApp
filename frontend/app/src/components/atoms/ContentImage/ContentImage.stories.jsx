// ContentImage.stories.jsx - Stories del Sistema de Diseño
import { ContentImage } from './ContentImage';

export default {
  title: 'Atoms/ContentImage',
  component: ContentImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# ContentImage - Átomo del Sistema de Diseño

Componente especializado para imágenes de contenido multimedia con fallbacks inteligentes, estados de loading y optimizaciones de performance.

## ✅ Características del Sistema de Diseño

- **Props Estándar**: size, variant, rounded, loading, disabled
- **Tokens CSS**: Usa variables del sistema de diseño
- **Accesibilidad**: ARIA attributes y navegación por teclado
- **Responsive**: Adaptativo a diferentes tamaños de pantalla
- **Performance**: Lazy loading y optimizaciones integradas

## 🎯 Casos de Uso

- Carátulas de películas/series (aspect 2/3)
- Thumbnails de video (aspect 16/9) 
- Avatares de usuario (aspect 1/1 + rounded full)
- Banners promocionales (aspect 16/9)
- Cualquier imagen con fallbacks automáticos

## 🔧 Props Específicas

- **aspectRatio**: Proporción de la imagen (2/3 para carátulas)
- **objectFit**: Comportamiento de ajuste (cover, contain, etc.)
- **contentType**: Tipo de contenido para fallbacks (movie, series, generic)
- **showFallback**: Si mostrar imagen de fallback en errores
- **placeholder**: Icono o emoji personalizado para loading
        `
      }
    }
  },
  argTypes: {
    // Props estándar del sistema
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del componente según el sistema de diseño'
    },
    variant: {
      control: 'select', 
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante de color según el sistema de diseño'
    },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes según el sistema de diseño'
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilitar el componente'
    },
    loading: {
      control: 'boolean', 
      description: 'Estado de loading del sistema'
    },
    
    // Props específicas de imagen
    src: {
      control: 'text',
      description: 'URL de la imagen'
    },
    alt: {
      control: 'text',
      description: 'Texto alternativo para accesibilidad'
    },
    aspectRatio: {
      control: 'select',
      options: ['1/1', '4/3', '3/2', '16/9', '2/3', '3/4', 'auto'],
      description: 'Proporción de aspecto de la imagen'
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'scale-down', 'none'],
      description: 'Comportamiento de ajuste de la imagen'
    },
    contentType: {
      control: 'select',
      options: ['movie', 'series', 'generic'],
      description: 'Tipo de contenido para fallbacks automáticos'
    },
    showFallback: {
      control: 'boolean',
      description: 'Mostrar imagen de fallback en errores'
    },
    placeholder: {
      control: 'text',
      description: 'Icono o emoji para estados de loading'
    },
    blur: {
      control: 'boolean',
      description: 'Aplicar efecto blur (loading progresivo)'
    },
    imageLoading: {
      control: 'select',
      options: ['eager', 'lazy'],
      description: 'Estrategia de carga de la imagen'
    }
  },
  args: {
    // Props por defecto
    src: 'https://via.placeholder.com/300x450/4f46e5/ffffff?text=Película',
    alt: 'Imagen de ejemplo',
    aspectRatio: '2/3',
    objectFit: 'cover',
    size: 'md',
    variant: 'primary',
    rounded: 'md',
    contentType: 'movie',
    showFallback: true,
    imageLoading: 'lazy'
  }
};

// ===== HISTORIAS PRINCIPALES =====

export const Default = {
  name: '📖 Por Defecto',
  args: {}
};

export const MoviePoster = {
  name: '🎬 Carátula de Película',
  args: {
    src: 'https://via.placeholder.com/300x450/dc2626/ffffff?text=🎬%0AAvengers',
    alt: 'Carátula de Avengers',
    aspectRatio: '2/3',
    contentType: 'movie',
    placeholder: 'film'
  }
};

export const SeriesPoster = {
  name: '📺 Carátula de Serie', 
  args: {
    src: 'https://via.placeholder.com/300x450/7c3aed/ffffff?text=📺%0ABreaking%20Bad',
    alt: 'Carátula de Breaking Bad',
    aspectRatio: '2/3',
    contentType: 'series',
    placeholder: 'video'
  }
};

export const VideoThumbnail = {
  name: '🖼️ Thumbnail de Video',
  args: {
    src: 'https://via.placeholder.com/640x360/059669/ffffff?text=▶️%0AVideo%20Thumbnail',
    alt: 'Thumbnail de video',
    aspectRatio: '16/9',
    contentType: 'generic'
  }
};

export const UserAvatar = {
  name: '👤 Avatar de Usuario',
  args: {
    src: 'https://via.placeholder.com/200x200/f59e0b/ffffff?text=👤',
    alt: 'Avatar de usuario',
    aspectRatio: '1/1',
    rounded: 'full',
    contentType: 'generic',
    placeholder: 'user'
  }
};

// ===== VARIANTES DEL SISTEMA =====

export const Variants = {
  name: '🎨 Variantes del Sistema',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].map(variant => (
        <div key={variant} style={{ textAlign: 'center' }}>
          <ContentImage
            src={`https://via.placeholder.com/150x225/4f46e5/ffffff?text=${variant}`}
            alt={`Variante ${variant}`}
            variant={variant}
            size="sm"
            aspectRatio="2/3"
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{variant}</p>
        </div>
      ))}
    </div>
  )
};

export const Sizes = {
  name: '📏 Tamaños del Sistema',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
        <div key={size} style={{ textAlign: 'center' }}>
          <ContentImage
            src={`https://via.placeholder.com/150x225/4f46e5/ffffff?text=${size.toUpperCase()}`}
            alt={`Tamaño ${size}`}
            size={size}
            aspectRatio="2/3"
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{size}</p>
        </div>
      ))}
    </div>
  )
};

export const Rounded = {
  name: '🔘 Bordes Redondeados',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {['sm', 'md', 'lg', 'xl', 'full'].map(rounded => (
        <div key={rounded} style={{ textAlign: 'center' }}>
          <ContentImage
            src={`https://via.placeholder.com/120x120/4f46e5/ffffff?text=${rounded}`}
            alt={`Rounded ${rounded}`}
            rounded={rounded}
            aspectRatio="1/1"
            size="sm"
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{rounded}</p>
        </div>
      ))}
    </div>
  )
};

// ===== ASPECT RATIOS =====

export const AspectRatios = {
  name: '📐 Proporciones de Aspecto',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {[
        { ratio: '1/1', label: 'Cuadrado (1:1)' },
        { ratio: '4/3', label: 'Landscape (4:3)' },
        { ratio: '16/9', label: 'Widescreen (16:9)' },
        { ratio: '2/3', label: 'Poster (2:3)' },
        { ratio: '3/4', label: 'Portrait (3:4)' }
      ].map(({ ratio, label }) => (
        <div key={ratio} style={{ textAlign: 'center', maxWidth: '150px' }}>
          <ContentImage
            src={`https://via.placeholder.com/300x300/4f46e5/ffffff?text=${ratio}`}
            alt={label}
            aspectRatio={ratio}
            size="sm"
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{label}</p>
        </div>
      ))}
    </div>
  )
};

// ===== ESTADOS =====

export const LoadingState = {
  name: '⏳ Estado de Carga',
  args: {
    src: '', // URL vacía para forzar loading
    placeholder: 'loader',
    loading: true
  }
};

export const ErrorState = {
  name: '❌ Estado de Error',
  args: {
    src: 'invalid-url-to-force-error',
    alt: 'Imagen con error',
    showFallback: true,
    contentType: 'movie'
  }
};

export const ErrorWithoutFallback = {
  name: '⚠️ Error Sin Fallback',
  args: {
    src: 'invalid-url-to-force-error',
    alt: 'Imagen con error sin fallback',
    showFallback: false
  }
};

export const DisabledState = {
  name: '🚫 Estado Deshabilitado',
  args: {
    disabled: true
  }
};

// ===== CASOS DE USO MULTIMEDIA =====

export const MovieCatalog = {
  name: '🎬 Catálogo de Películas',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', maxWidth: '600px' }}>
      {[
        { title: 'Acción', color: 'dc2626' },
        { title: 'Drama', color: '7c3aed' },
        { title: 'Comedia', color: 'f59e0b' },
        { title: 'Thriller', color: '059669' },
        { title: 'Sci-Fi', color: '0891b2' },
        { title: 'Terror', color: '1f2937' }
      ].map((movie, index) => (
        <ContentImage
          key={index}
          src={`https://via.placeholder.com/300x450/${movie.color}/ffffff?text=🎬%0A${movie.title}`}
          alt={`Película ${movie.title}`}
          aspectRatio="2/3"
          contentType="movie"
          size="sm"
          rounded="md"
        />
      ))}
    </div>
  )
};

export const SeriesCatalog = {
  name: '📺 Catálogo de Series',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', maxWidth: '600px' }}>
      {[
        { title: 'Breaking Bad', color: '059669' },
        { title: 'Stranger Things', color: 'dc2626' },
        { title: 'The Office', color: 'f59e0b' },
        { title: 'Game of Thrones', color: '1f2937' },
        { title: 'Friends', color: '7c3aed' },
        { title: 'Lost', color: '0891b2' }
      ].map((serie, index) => (
        <ContentImage
          key={index}
          src={`https://via.placeholder.com/300x450/${serie.color}/ffffff?text=📺%0A${serie.title.replace(' ', '%20')}`}
          alt={`Serie ${serie.title}`}
          aspectRatio="2/3"
          contentType="series"
          size="sm"
          rounded="md"
        />
      ))}
    </div>
  )
};

// ===== PERFORMANCE Y TÉCNICAS =====

export const LazyLoading = {
  name: '🚀 Carga Diferida (Lazy)',
  args: {
    imageLoading: 'lazy',
    placeholder: 'loader'
  }
};

export const EagerLoading = {
  name: '⚡ Carga Inmediata (Eager)',
  args: {
    imageLoading: 'eager'
  }
};

export const BlurEffect = {
  name: '🌫️ Efecto Blur (Progressive)',
  args: {
    blur: true,
    placeholder: 'image'
  }
};

// ===== ACCESIBILIDAD =====

export const Accessibility = {
  name: '♿ Accesibilidad',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
      <div>
        <h3>✅ Con Alt Text Descriptivo</h3>
        <ContentImage
          src="https://via.placeholder.com/200x300/4f46e5/ffffff?text=🎬%0AAvengers%0AEndgame"
          alt="Carátula de la película Avengers Endgame, mostrando los superhéroes en acción"
          aspectRatio="2/3"
          size="sm"
        />
      </div>
      
      <div>
        <h3>🚫 Estado Deshabilitado (aria-disabled)</h3>
        <ContentImage
          src="https://via.placeholder.com/200x300/6b7280/ffffff?text=🚫%0ADeshabilitado"
          alt="Imagen deshabilitada"
          disabled={true}
          aspectRatio="2/3"
          size="sm"
        />
      </div>
    </div>
  )
};

// ===== PLAYGROUND INTERACTIVO =====

export const Playground = {
  name: '🎮 Playground Interactivo',
  args: {
    src: 'https://via.placeholder.com/300x450/4f46e5/ffffff?text=🎬%0ACustomizable',
    alt: 'Imagen personalizable',
    aspectRatio: '2/3',
    objectFit: 'cover',
    size: 'md',
    variant: 'primary',
    rounded: 'md',
    contentType: 'movie',
    showFallback: true,
    imageLoading: 'lazy',
    placeholder: 'film',
    blur: false,
    disabled: false,
    loading: false
  }
};