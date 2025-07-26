// molecules/SeasonSelector/SeasonSelector.stories.jsx
import { SeasonSelector } from './SeasonSelector';

export default {
  title: 'Molecules/SeasonSelector',
  component: SeasonSelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Componente selector de temporadas con información de episodios y diseño optimizado para navegación.'
      }
    }
  },
  argTypes: {
    seasons: {
      description: 'Array de temporadas disponibles',
      control: 'object'
    },
    selectedSeason: {
      description: 'Temporada actualmente seleccionada',
      control: 'number'
    },
    onSeasonChange: {
      description: 'Callback cuando cambia la temporada',
      action: 'onSeasonChange'
    },
    variant: {
      description: 'Variante visual del componente',
      control: 'select',
      options: ['compact', 'normal', 'detailed']
    },
    size: {
      description: 'Tamaño del selector',
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    showEpisodeCount: {
      description: 'Mostrar contador de episodios',
      control: 'boolean'
    },
    loading: {
      description: 'Estado de carga',
      control: 'boolean'
    },
    disabled: {
      description: 'Estado deshabilitado',
      control: 'boolean'
    }
  }
};

// Datos de ejemplo
const sampleSeasons = [
  {
    number: 1,
    episodeCount: 10,
    title: "El Origen"
  },
  {
    number: 2,
    episodeCount: 12,
    title: "La Revelación"
  },
  {
    number: 3,
    episodeCount: 8,
    title: "El Final"
  }
];

const manySeasonsData = [
  { number: 1, episodeCount: 22, title: "Temporada de Inicio" },
  { number: 2, episodeCount: 24, title: "Desarrollo de Personajes" },
  { number: 3, episodeCount: 20, title: "Giros Argumentales" },
  { number: 4, episodeCount: 18, title: "Conflictos Internos" },
  { number: 5, episodeCount: 16, title: "Revelaciones" },
  { number: 6, episodeCount: 12, title: "El Clímax Final" }
];

const seasonsWithoutTitles = [
  { number: 1, episodeCount: 8 },
  { number: 2, episodeCount: 10 },
  { number: 3, episodeCount: 6 }
];

// Template base
const Template = (args) => (
  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
    <SeasonSelector {...args} />
  </div>
);

// Stories principales
export const Default = Template.bind({});
Default.args = {
  seasons: sampleSeasons,
  selectedSeason: 1,
  showEpisodeCount: true,
  variant: 'normal',
  size: 'md'
};

export const Compact = Template.bind({});
Compact.args = {
  seasons: sampleSeasons,
  selectedSeason: 2,
  variant: 'compact',
  size: 'sm',
  showEpisodeCount: true
};

export const Detailed = Template.bind({});
Detailed.args = {
  seasons: sampleSeasons,
  selectedSeason: 1,
  variant: 'detailed',
  size: 'lg',
  showEpisodeCount: true
};

export const WithoutTitles = Template.bind({});
WithoutTitles.args = {
  seasons: seasonsWithoutTitles,
  selectedSeason: 1,
  showEpisodeCount: true,
  variant: 'normal',
  size: 'md'
};

export const WithoutEpisodeCount = Template.bind({});
WithoutEpisodeCount.args = {
  seasons: sampleSeasons,
  selectedSeason: 1,
  showEpisodeCount: false,
  variant: 'normal',
  size: 'md'
};

export const ManySeasons = Template.bind({});
ManySeasons.args = {
  seasons: manySeasonsData,
  selectedSeason: 3,
  showEpisodeCount: true,
  variant: 'normal',
  size: 'md'
};

export const SingleSeason = Template.bind({});
SingleSeason.args = {
  seasons: [{ number: 1, episodeCount: 12, title: "Temporada Única" }],
  selectedSeason: 1,
  showEpisodeCount: true,
  variant: 'normal',
  size: 'md'
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  seasons: sampleSeasons,
  selectedSeason: 2,
  size: 'sm',
  showEpisodeCount: true,
  variant: 'normal'
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  seasons: sampleSeasons,
  selectedSeason: 2,
  size: 'lg',
  showEpisodeCount: true,
  variant: 'normal'
};

export const Loading = Template.bind({});
Loading.args = {
  seasons: sampleSeasons,
  selectedSeason: 1,
  loading: true,
  showEpisodeCount: true,
  variant: 'normal',
  size: 'md'
};

export const Disabled = Template.bind({});
Disabled.args = {
  seasons: sampleSeasons,
  selectedSeason: 1,
  disabled: true,
  showEpisodeCount: true,
  variant: 'normal',
  size: 'md'
};

// Template para comparar variantes
const VariantComparisonTemplate = (args) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: '800px', margin: '0 auto' }}>
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)' }}>Variante Compact</h3>
      <SeasonSelector {...args} variant="compact" />
    </div>
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)' }}>Variante Normal</h3>
      <SeasonSelector {...args} variant="normal" />
    </div>
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)' }}>Variante Detailed</h3>
      <SeasonSelector {...args} variant="detailed" />
    </div>
  </div>
);

export const VariantComparison = VariantComparisonTemplate.bind({});
VariantComparison.args = {
  seasons: sampleSeasons,
  selectedSeason: 2,
  showEpisodeCount: true,
  size: 'md'
};