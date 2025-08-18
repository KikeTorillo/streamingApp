// PageLayout.stories.jsx
import { PageLayout } from './PageLayout';
import { AppHeader } from '../../organisms/AppHeader/AppHeader';
import { FilterBar } from '../../molecules/FilterBar/FilterBar';
import { ContentSection } from '../../molecules/ContentSection/ContentSection';
import { ContentCard } from '../../molecules/ContentCard/ContentCard';
import './PageLayout.css';

export default {
  title: 'Components/Templates/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# PageLayout Template

Template simplificado que estructura páginas usando 100% Container + FlexContainer del sistema.

## Características
- **Zero CSS**: Sin estilos custom, solo contenedores del sistema
- **Composición pura**: FlexContainer + Container únicamente
- **Responsive automático**: Desde tokens del sistema
- **Sin variants**: La variación viene del contenido, no del layout

## Uso básico
\`\`\`jsx
<PageLayout
  header={<AppHeader />}
  filters={<FilterBar />}
  contentPadding="xl"
>
  <ContentSection title="Películas">
    {movies.map(movie => <ContentCard key={movie.id} content={movie} />)}
  </ContentSection>
</PageLayout>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    contentSize: { 
      control: 'select', 
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Tamaño del contenedor principal'
    },
    contentPadding: { 
      control: 'select', 
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Padding interno del contenido'
    }
  }
};

// Datos de ejemplo
const SAMPLE_MOVIES = [
  {
    id: 1,
    title: "Spider-Man",
    category: "Acción",
    year: 2021,
    type: "movie",
    cover: "https://images.unsplash.com/photo-1635863138275-d9864d29a8d5?w=300&h=450&fit=crop",
    rating: 8.4
  },
  {
    id: 2,
    title: "Dune",
    category: "Sci-Fi",
    year: 2021,
    type: "movie",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop",
    rating: 8.0
  }
];

const CATEGORIES = [
  { value: 'all', label: 'Todo', icon: '🎬' },
  { value: 'movies', label: 'Películas', icon: '🎞️' },
  { value: 'series', label: 'Series', icon: '📺' }
];

// ========== DEFAULT ==========
export const Default = {
  args: {
    contentPadding: 'xl'
  },
  render: (args) => (
    <PageLayout {...args}>
      <ContentSection title="Contenido de Ejemplo" icon="📄">
        <div style={{ 
          padding: 'var(--space-lg)', 
          background: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-md)' 
        }}>
          <p>Este es el contenido principal de la página.</p>
        </div>
      </ContentSection>
    </PageLayout>
  )
};

// ========== CON HEADER ==========
export const WithHeader = {
  render: () => (
    <PageLayout
      header={
        <AppHeader
          appTitle="StreamFlix"
          userName="Usuario"
          searchPlaceholder="Buscar contenido..."
        />
      }
    >
      <ContentSection title="Películas Populares" icon="🎬">
        {SAMPLE_MOVIES.map(movie => (
          <ContentCard key={movie.id} content={movie} />
        ))}
      </ContentSection>
    </PageLayout>
  )
};

// ========== CON FILTROS ==========
export const WithFilters = {
  render: () => (
    <PageLayout
      filters={
        <FilterBar
          categories={CATEGORIES}
          selectedCategory="all"
        />
      }
    >
      <ContentSection title="Contenido Filtrado" icon="🔍">
        {SAMPLE_MOVIES.map(movie => (
          <ContentCard key={movie.id} content={movie} />
        ))}
      </ContentSection>
    </PageLayout>
  )
};

// ========== LAYOUT COMPLETO ==========
export const CompleteLayout = {
  render: () => (
    <PageLayout
      header={
        <AppHeader
          appTitle="StreamFlix"
          userName="María García"
          searchPlaceholder="Buscar películas, series..."
        />
      }
      filters={
        <FilterBar
          categories={CATEGORIES}
          selectedCategory="movies"
        />
      }
    >
      <ContentSection title="🎬 Películas Populares" icon="🎬">
        {SAMPLE_MOVIES.map(movie => (
          <ContentCard key={movie.id} content={movie} />
        ))}
      </ContentSection>
      
      <ContentSection title="📺 Series en Tendencia" icon="📺">
        {SAMPLE_MOVIES.slice(0, 1).map(movie => (
          <ContentCard key={movie.id} content={{...movie, type: 'series'}} />
        ))}
      </ContentSection>
    </PageLayout>
  )
};

// ========== CONFIGURACIONES DE PADDING ==========
export const PaddingOptions = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
    <div>
      <h3>Padding None</h3>
      <PageLayout contentPadding="none">
        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          Sin padding interno - contenido pegado a los bordes
        </div>
      </PageLayout>
    </div>
    
    <div>
      <h3>Padding MD (estándar)</h3>
      <PageLayout contentPadding="md">
        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          Padding medio - para páginas estándar
        </div>
      </PageLayout>
    </div>
    
    <div>
      <h3>Padding XL (generoso)</h3>
      <PageLayout contentPadding="xl">
        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          Padding extra grande - para páginas con mucho contenido
        </div>
      </PageLayout>
    </div>
    
    <div>
      <h3>Padding 2XL (máximo)</h3>
      <PageLayout contentPadding="2xl">
        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
          Padding máximo - para páginas especiales
        </div>
      </PageLayout>
    </div>
  </div>
);

// ========== MAINPAGE SIMULADO ==========
export const MainPageSimulation = {
  render: () => (
    <PageLayout
      header={
        <AppHeader
          appTitle="StreamFlix"
          userName="Alex Rivera"
          searchPlaceholder="Buscar películas, series, documentales..."
          contentPadding="xl"
          size="lg"
        />
      }
      filters={
        <FilterBar
          categories={[
            { value: 'all', label: 'Todo', icon: '🎬' },
            { value: 'movies', label: 'Películas', icon: '🎞️' },
            { value: 'series', label: 'Series', icon: '📺' },
            { value: 'documentaries', label: 'Documentales', icon: '📋' }
          ]}
          selectedCategory="all"
        />
      }
      contentPadding="xl"
    >
      <ContentSection 
        title="🎬 Películas Populares" 
        icon="🎬"
        variant="featured"
        size="lg"
      >
        {SAMPLE_MOVIES.map(movie => (
          <ContentCard key={movie.id} content={movie} />
        ))}
      </ContentSection>
      
      <ContentSection title="📺 Series en Tendencia" icon="📺">
        {SAMPLE_MOVIES.slice(0, 1).map(movie => (
          <ContentCard key={movie.id} content={{...movie, type: 'series', title: 'Breaking Bad'}} />
        ))}
      </ContentSection>
      
      <ContentSection 
        title="🆕 Recién Agregadas" 
        icon="🆕"
        loading={true}
      />
    </PageLayout>
  )
};