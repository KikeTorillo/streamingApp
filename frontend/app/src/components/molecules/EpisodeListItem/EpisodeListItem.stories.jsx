// molecules/EpisodeListItem/EpisodeListItem.stories.jsx
import { EpisodeListItem } from './EpisodeListItem';

export default {
  title: 'Molecules/EpisodeListItem',
  component: EpisodeListItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Componente para mostrar episodios en formato de lista compacta con botón de reproducción.'
      }
    }
  },
  argTypes: {
    episode: {
      description: 'Datos del episodio a mostrar',
      control: 'object'
    },
    onPlay: {
      description: 'Callback cuando se hace click en reproducir',
      action: 'onPlay'
    },
    onClick: {
      description: 'Callback cuando se hace click en el item',
      action: 'onClick'
    },
    variant: {
      description: 'Variante visual del componente',
      control: 'select',
      options: ['compact', 'normal', 'detailed']
    },
    showThumbnail: {
      description: 'Mostrar thumbnail del episodio',
      control: 'boolean'
    },
    showDescription: {
      description: 'Mostrar descripción del episodio',
      control: 'boolean'
    },
    showRating: {
      description: 'Mostrar rating del episodio',
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
const sampleEpisode = {
  id: 1,
  title: "El Comienzo del Fin",
  season: 1,
  episode_number: 5,
  description: "Un episodio épico donde los protagonistas descubren la verdad sobre el misterioso mundo que los rodea. Las revelaciones cambiarán todo lo que creían saber.",
  cover: "https://via.placeholder.com/320x180?text=Episode+Thumbnail",
  duration: "45:30",
  rating: 8.7,
  watched: false
};

const sampleEpisodeWatched = {
  ...sampleEpisode,
  id: 2,
  title: "La Venganza",
  episode_number: 6,
  watched: true
};

const sampleEpisodeLongTitle = {
  ...sampleEpisode,
  id: 3,
  title: "Un Título Muy Largo Que Debería Truncarse Correctamente en la Interface de Usuario",
  episode_number: 7
};

// Template base
const Template = (args) => (
  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
    <EpisodeListItem {...args} />
  </div>
);

// Stories principales
export const Default = Template.bind({});
Default.args = {
  episode: sampleEpisode,
  showThumbnail: true,
  showDescription: true,
  showRating: true
};

export const Watched = Template.bind({});
Watched.args = {
  episode: sampleEpisodeWatched,
  showThumbnail: true,
  showDescription: true,
  showRating: true
};

export const Compact = Template.bind({});
Compact.args = {
  episode: sampleEpisode,
  variant: 'compact',
  showThumbnail: true,
  showDescription: false,
  showRating: true
};

export const Detailed = Template.bind({});
Detailed.args = {
  episode: sampleEpisode,
  variant: 'detailed',
  showThumbnail: true,
  showDescription: true,
  showRating: true
};

export const WithoutThumbnail = Template.bind({});
WithoutThumbnail.args = {
  episode: sampleEpisode,
  showThumbnail: false,
  showDescription: true,
  showRating: true
};

export const WithoutDescription = Template.bind({});
WithoutDescription.args = {
  episode: sampleEpisode,
  showThumbnail: true,
  showDescription: false,
  showRating: true
};

export const WithoutRating = Template.bind({});
WithoutRating.args = {
  episode: { ...sampleEpisode, rating: null },
  showThumbnail: true,
  showDescription: true,
  showRating: false
};

export const LongTitle = Template.bind({});
LongTitle.args = {
  episode: sampleEpisodeLongTitle,
  showThumbnail: true,
  showDescription: true,
  showRating: true
};

export const Loading = Template.bind({});
Loading.args = {
  episode: sampleEpisode,
  loading: true,
  showThumbnail: true,
  showDescription: true,
  showRating: true
};

export const Disabled = Template.bind({});
Disabled.args = {
  episode: sampleEpisode,
  disabled: true,
  showThumbnail: true,
  showDescription: true,
  showRating: true
};

// Lista de episodios
const ListTemplate = (args) => (
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      <EpisodeListItem {...args} episode={{ ...sampleEpisode, episode_number: 1, title: "Piloto" }} />
      <EpisodeListItem {...args} episode={{ ...sampleEpisode, episode_number: 2, title: "El Despertar", watched: true }} />
      <EpisodeListItem {...args} episode={{ ...sampleEpisode, episode_number: 3, title: "Secretos Revelados" }} />
      <EpisodeListItem {...args} episode={{ ...sampleEpisode, episode_number: 4, title: "La Traición" }} />
      <EpisodeListItem {...args} episode={{ ...sampleEpisode, episode_number: 5, title: "El Comienzo del Fin" }} />
    </div>
  </div>
);

export const EpisodeList = ListTemplate.bind({});
EpisodeList.args = {
  showThumbnail: true,
  showDescription: true,
  showRating: true
};

export const CompactList = ListTemplate.bind({});
CompactList.args = {
  variant: 'compact',
  showThumbnail: true,
  showDescription: false,
  showRating: true
};