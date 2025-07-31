// molecules/SeasonSelector/SeasonSelector.jsx
import { Select } from '../../atoms/Select/Select';
import { Badge } from '../../atoms/Badge/Badge';
import './SeasonSelector.css';

/**
 * Componente SeasonSelector - Selector de temporadas con información adicional
 * Optimizado para navegación rápida entre temporadas de series
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.seasons - Array de temporadas disponibles
 * @param {number} props.seasons[].number - Número de temporada
 * @param {number} props.seasons[].episodeCount - Cantidad de episodios
 * @param {string} [props.seasons[].title] - Título de la temporada (opcional)
 * @param {number} props.selectedSeason - Temporada actualmente seleccionada
 * @param {function} props.onSeasonChange - Callback cuando cambia la temporada
 * @param {boolean} [props.showEpisodeCount=true] - Mostrar contador de episodios
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {'compact'|'normal'|'detailed'} [props.variant='normal'] - Variante visual
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Tamaño del selector
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
const SeasonSelector = ({
  seasons = [],
  selectedSeason,
  onSeasonChange,
  showEpisodeCount = true,
  loading = false,
  disabled = false,
  variant = 'normal',
  size = 'md',
  className = '',
  ...restProps
}) => {
  // Validación de datos requeridos
  if (!seasons || seasons.length === 0) {

    return null;
  }

  if (typeof onSeasonChange !== 'function') {

    return null;
  }

  // Construir clases CSS
  const selectorClasses = [
    'season-selector',
    `season-selector--${variant}`,
    `season-selector--${size}`,
    loading && 'season-selector--loading',
    disabled && 'season-selector--disabled',
    className
  ].filter(Boolean).join(' ');

  // Encontrar la temporada seleccionada para mostrar información
  const currentSeason = seasons.find(season => season.number === selectedSeason);
  const totalEpisodes = seasons.reduce((total, season) => total + (season.episodeCount || 0), 0);

  // Preparar opciones para el Select
  const selectOptions = seasons.map(season => ({
    value: season.number,
    label: season.title 
      ? `Temporada ${season.number}: ${season.title}`
      : `Temporada ${season.number}`,
    subtitle: showEpisodeCount 
      ? `${season.episodeCount} episodio${season.episodeCount !== 1 ? 's' : ''}`
      : undefined
  }));

  // Handler para el cambio de temporada
  const handleSeasonChange = (event) => {
    if (disabled || loading) return;
    const seasonNumber = parseInt(event.target.value, 10);
    onSeasonChange(seasonNumber);
  };

  return (
    <div className={selectorClasses} {...restProps}>
      {/* Título del selector */}
      <div className="season-selector__header">
        <h3 className="season-selector__title">
          Temporadas
        </h3>
        
        {/* Información general */}
        {variant !== 'compact' && (
          <div className="season-selector__info">
            <Badge
              variant="secondary"
              size="sm"
              style="soft"
            >
              {seasons.length} temporada{seasons.length !== 1 ? 's' : ''}
            </Badge>
            
            {showEpisodeCount && totalEpisodes > 0 && (
              <Badge
                variant="primary"
                size="sm"
                style="soft"
              >
                {totalEpisodes} episodios totales
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Selector principal */}
      <div className="season-selector__control">
        <Select
          value={selectedSeason}
          onChange={handleSeasonChange}
          options={selectOptions}
          placeholder="Seleccionar temporada"
          disabled={disabled || loading}
          size={size}
          variant="default"
          className="season-selector__select"
        />
        
        {/* Información de la temporada actual */}
        {currentSeason && showEpisodeCount && variant === 'detailed' && (
          <div className="season-selector__current-info">
            <span className="season-selector__current-title">
              {currentSeason.title && `"${currentSeason.title}"`}
            </span>
            <span className="season-selector__current-count">
              {currentSeason.episodeCount} episodio{currentSeason.episodeCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export { SeasonSelector };