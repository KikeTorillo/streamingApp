import { ContentCard } from './ContentCard';
import './ContentCard.css';

export default {
  title: 'Components/Molecules/ContentCard',
  component: ContentCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# ContentCard Molecule  MIGRADO AL SISTEMA EST�NDAR

La mol�cula **ContentCard** es el componente principal para mostrar car�tulas de pel�culas y series en nuestro sistema.
**<� COMPLETAMENTE MIGRADO** al sistema est�ndar con props consistentes, tokens autom�ticos y backward compatibility.

## =� NUEVAS CARACTER�STICAS POST-MIGRACI�N

###  **Sistema Est�ndar Integrado**
- **Hook useContentCardProps()**: Gesti�n autom�tica de props y tokens
- **Props est�ndar**: size, variant, rounded, disabled, loading
- **6 variantes sem�nticas**: primary, secondary, success, warning, danger, neutral
- **5 tama�os est�ndar**: xs, sm, md, lg, xl con aspect ratio optimizado
- **STANDARD_PROP_TYPES**: Validaci�n consistente con todo el sistema
- **Tokens autom�ticos**: Spacing, colores y tipograf�a del design system

### =� **Backward Compatibility**
- **cardVariant prop**: Para variantes funcionales (elevated, outlined, default)
- **Legacy props**: onPlay, onFavorite (deprecados pero funcionales)
- **Deprecation warnings**: En desarrollo para guiar migraci�n gradual

## <� Casos de uso principales

- **Grids de pel�culas**: HomePage, CategoryPage, SearchResults
- **Listas de series**: SeriesPage, SeasonView
- **Recommendations**: Related content, "Porque viste X"
- **Favorites**: User favorites grid
- **Search Results**: Resultados de b�squeda con metadatos

## =� Responsive & Mobile First

- **Aspect ratio**: 2:3 optimizado para car�tulas de pel�culas/series
- **Touch targets**: 44px m�nimo en m�viles para �rea clickeable
- **Hover effects**: Deshabilitados en touch devices
- **Progressive enhancement**: Core functionality sin JavaScript
- **Loading states**: Skeleton con shimmer effect

## =' Uso b�sico

\`\`\`jsx
import { ContentCard } from './molecules/ContentCard';

// Card b�sica de pel�cula
<ContentCard
  content={{
    id: 1,
    title: "Matrix",
    cover: "/covers/matrix.jpg",
    category: "Ciencia Ficci�n",
    year: 1999,
    rating: 8.7,
    type: "movie",
    duration: "2h 16m"
  }}
  onClick={(content) => console.log('Clicked:', content)}
/>

// Card de serie con metadatos
<ContentCard
  content={{
    id: 2,
    title: "Breaking Bad",
    cover: "/covers/breaking-bad.jpg",
    category: "Drama",
    year: 2008,
    rating: 9.5,
    type: "series",
    seasons: 5,
    episodes: 62
  }}
  size="lg"
  variant="primary"
  cardVariant="elevated"
/>

// Grid de contenido (uso t�pico)
<div className="content-grid">
  {movies.map(movie => (
    <ContentCard
      key={movie.id}
      content={movie}
      size="md"
      onClick={handleContentClick}
      showRating={true}
      showMeta={true}
      showCategory={true}
    />
  ))}
</div>
\`\`\`

## <� Design Tokens

Utiliza autom�ticamente las variables del sistema:
\`\`\`css
:root {
  --content-card-size: var(--font-size-md);
  --content-card-spacing: var(--space-md);
  --content-card-padding: var(--space-md);
  --content-card-rounded: var(--radius-lg);
}
\`\`\`
`
      }
    }
  },
  argTypes: {
    // Props est�ndar del sistema
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tama�o est�ndar del componente'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante sem�ntica para bordes y estados hover'
    },
    rounded: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Border radius est�ndar'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado deshabilitado'
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carga con skeleton'
    },
    
    // Props espec�ficos de ContentCard
    cardVariant: {
      control: { type: 'select' },
      options: ['elevated', 'outlined', 'default'],
      description: 'Variante funcional de la card (separada de variant sem�ntica)'
    },
    showRating: {
      control: { type: 'boolean' },
      description: 'Mostrar badge de rating'
    },
    showMeta: {
      control: { type: 'boolean' },
      description: 'Mostrar metadatos (duraci�n, temporadas)'
    },
    showCategory: {
      control: { type: 'boolean' },
      description: 'Mostrar categor�a en subtitle'
    },
    
    // Props de eventos
    onClick: {
      action: 'clicked',
      description: 'Callback al hacer click en la card'
    }
  }
};

// Datos de ejemplo para las stories
const movieContent = {
  id: 1,
  title: "The Matrix",
  cover: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  category: "Ciencia Ficci�n",
  year: 1999,
  rating: 8.7,
  type: "movie",
  duration: "2h 16m"
};

const seriesContent = {
  id: 2,
  title: "Breaking Bad",
  cover: "https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg",
  category: "Drama",
  year: 2008,
  rating: 9.5,
  type: "series",
  seasons: 5,
  episodes: 62
};

const longTitleContent = {
  id: 3,
  title: "The Lord of the Rings: The Fellowship of the Ring",
  cover: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
  category: "Fantas�a",
  year: 2001,
  rating: 8.8,
  type: "movie",
  duration: "2h 58m"
};

// Story por defecto
export const Default = {
  args: {
    content: movieContent,
    size: 'md',
    variant: 'neutral',
    cardVariant: 'elevated',
    rounded: 'lg',
    showRating: true,
    showMeta: true,
    showCategory: true,
    disabled: false,
    loading: false
  }
};

// Variantes sem�nticas est�ndar (para bordes y hover)
export const SystemStandardVariants = {
  name: '<� Variantes Sem�nticas Est�ndar',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '2rem',
      padding: '2rem',
      background: 'var(--bg-muted)'
    }}>
      {['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].map(variant => (
        <div key={variant} style={{ textAlign: 'center' }}>
          <ContentCard
            content={movieContent}
            variant={variant}
            size="sm"
            cardVariant="elevated"
          />
          <p style={{ 
            marginTop: '1rem', 
            fontSize: '1.4rem', 
            color: 'var(--text-muted)',
            textTransform: 'capitalize' 
          }}>
            {variant}
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Las 6 variantes sem�nticas est�ndar afectan el color de borde y efectos hover de la card.'
      }
    }
  }
};

// Variantes funcionales (apariencia de la card)
export const CardVariants = {
  name: '=� Variantes Funcionales (cardVariant)',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '2rem',
      padding: '2rem',
      background: 'var(--bg-muted)'
    }}>
      {['elevated', 'outlined', 'default'].map(cardVariant => (
        <div key={cardVariant} style={{ textAlign: 'center' }}>
          <ContentCard
            content={movieContent}
            cardVariant={cardVariant}
            variant="primary"
            size="sm"
          />
          <p style={{ 
            marginTop: '1rem', 
            fontSize: '1.4rem', 
            color: 'var(--text-muted)',
            textTransform: 'capitalize' 
          }}>
            {cardVariant}
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Las variantes funcionales (cardVariant) controlan la apariencia visual de la card: sombra, borde, etc.'
      }
    }
  }
};

// Tama�os est�ndar
export const SystemStandardSizes = {
  name: '=� Tama�os Est�ndar',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
      gap: '2rem',
      padding: '2rem',
      background: 'var(--bg-muted)',
      alignItems: 'start'
    }}>
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
        <div key={size} style={{ textAlign: 'center' }}>
          <ContentCard
            content={movieContent}
            size={size}
            variant="primary"
            cardVariant="elevated"
          />
          <p style={{ 
            marginTop: '1rem', 
            fontSize: '1.4rem', 
            color: 'var(--text-muted)',
            textTransform: 'uppercase' 
          }}>
            {size}
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Los 5 tama�os est�ndar controlan el ancho m�ximo de la card y el padding interno.'
      }
    }
  }
};

// Estados del sistema
export const SystemStandardStates = {
  name: '� Estados del Sistema',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '2rem',
      padding: '2rem',
      background: 'var(--bg-muted)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={movieContent}
          size="sm"
          variant="primary"
        />
        <p style={{ marginTop: '1rem', fontSize: '1.4rem', color: 'var(--text-muted)' }}>
          Normal
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={movieContent}
          size="sm"
          variant="primary"
          loading={true}
        />
        <p style={{ marginTop: '1rem', fontSize: '1.4rem', color: 'var(--text-muted)' }}>
          Loading
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={movieContent}
          size="sm"
          variant="primary"
          disabled={true}
        />
        <p style={{ marginTop: '1rem', fontSize: '1.4rem', color: 'var(--text-muted)' }}>
          Disabled
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estados est�ndar del sistema: normal, loading (con skeleton), y disabled.'
      }
    }
  }
};

// Tipos de contenido
export const ContentTypes = {
  name: '<� Tipos de Contenido',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '2rem',
      padding: '2rem',
      background: 'var(--bg-muted)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={movieContent}
          size="md"
          variant="primary"
          cardVariant="elevated"
        />
        <p style={{ 
          marginTop: '1rem', 
          fontSize: '1.4rem', 
          color: 'var(--text-muted)' 
        }}>
          Pel�cula
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={seriesContent}
          size="md"
          variant="secondary"
          cardVariant="elevated"
        />
        <p style={{ 
          marginTop: '1rem', 
          fontSize: '1.4rem', 
          color: 'var(--text-muted)' 
        }}>
          Serie
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={longTitleContent}
          size="md"
          variant="success"
          cardVariant="elevated"
        />
        <p style={{ 
          marginTop: '1rem', 
          fontSize: '1.4rem', 
          color: 'var(--text-muted)' 
        }}>
          T�tulo largo
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tipos de contenido con sus metadatos espec�ficos y badges autom�ticos.'
      }
    }
  }
};

// Grid de contenido (caso de uso real)
export const ContentGrid = {
  name: '=� Grid de Contenido (Uso Real)',
  render: () => {
    const gridContent = [
      movieContent,
      seriesContent,
      longTitleContent,
      {
        id: 4,
        title: "Stranger Things",
        cover: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
        category: "Drama",
        year: 2016,
        rating: 8.7,
        type: "series",
        seasons: 4,
        episodes: 34
      },
      {
        id: 5,
        title: "Inception",
        cover: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        category: "Thriller",
        year: 2010,
        rating: 8.8,
        type: "movie",
        duration: "2h 28m"
      },
      {
        id: 6,
        title: "The Office",
        cover: "https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
        category: "Comedia",
        year: 2005,
        rating: 8.9,
        type: "series",
        seasons: 9,
        episodes: 201
      }
    ];

    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '2rem',
        padding: '2rem',
        background: 'var(--bg-muted)'
      }}>
        {gridContent.map(content => (
          <ContentCard
            key={content.id}
            content={content}
            size="md"
            variant="neutral"
            cardVariant="elevated"
            onClick={(content) => console.log('Clicked:', content.title)}
          />
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Ejemplo de uso real: grid de contenido como se ver�a en HomePage, CategoryPage o SearchResults.'
      }
    }
  }
};

// Casos de configuración
export const ConfigurationCases = {
  name: '🔧 Casos de Configuración',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '2rem',
      padding: '2rem',
      background: 'var(--bg-muted)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={movieContent}
          size="sm"
          showRating={false}
          showMeta={false}
          showCategory={false}
        />
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Solo t�tulo
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={seriesContent}
          size="sm"
          showRating={true}
          showMeta={false}
          showCategory={true}
        />
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Con rating y categor�a
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={seriesContent}
          size="sm"
          showRating={false}
          showMeta={true}
          showCategory={false}
        />
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Solo metadatos
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={movieContent}
          size="sm"
          showRating={true}
          showMeta={true}
          showCategory={true}
        />
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Informaci�n completa
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes configuraciones de informaci�n mostrada seg�n el contexto de uso.'
      }
    }
  }
};

// Backward Compatibility Demo
export const BackwardCompatibilityDemo = {
  name: '= Backward Compatibility',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '2rem',
      padding: '2rem',
      background: 'var(--bg-muted)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={movieContent}
          cardVariant="elevated"
          size="sm"
        />
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Nueva API
        </p>
        <code style={{ fontSize: '1rem', color: 'var(--text-success)' }}>
          cardVariant=&quot;elevated&quot;
        </code>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <ContentCard
          content={movieContent}
          cardVariant="outlined"
          size="sm"
        />
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Variante outlined
        </p>
        <code style={{ fontSize: '1rem', color: 'var(--text-success)' }}>
          cardVariant=&quot;outlined&quot;
        </code>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demostraci�n de backward compatibility. Las props legacy funcionan con deprecation warnings en desarrollo.'
      }
    }
  }
};

// Responsive behavior
export const ResponsiveBehavior = {
  name: '=� Comportamiento Responsive',
  render: () => (
    <div style={{ padding: '2rem', background: 'var(--bg-muted)' }}>
      <h3 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>
        Redimensiona la ventana para ver el comportamiento responsive
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
        gap: '1.5rem',
        maxWidth: '120rem',
        margin: '0 auto'
      }}>
        {[movieContent, seriesContent, longTitleContent].map((content, index) => (
          <ContentCard
            key={index}
            content={content}
            size="md"
            variant="primary"
            cardVariant="elevated"
          />
        ))}
      </div>
      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        background: 'var(--bg-secondary)', 
        borderRadius: 'var(--radius-lg)',
        fontSize: '1.4rem',
        color: 'var(--text-muted)'
      }}>
        <strong>Breakpoints:</strong>
        <ul style={{ marginTop: '1rem' }}>
          <li><strong>Desktop (1024px+):</strong> Hover effects, animaciones completas</li>
          <li><strong>Tablet (768px-1023px):</strong> Tama�os ajustados, menos padding</li>
          <li><strong>Mobile (480px-767px):</strong> Sin hover effects, overlay siempre visible</li>
          <li><strong>Small Mobile (320px-479px):</strong> Layout vertical, texto truncado</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'El componente se adapta autom�ticamente a diferentes tama�os de pantalla con breakpoints optimizados.'
      }
    }
  }
};