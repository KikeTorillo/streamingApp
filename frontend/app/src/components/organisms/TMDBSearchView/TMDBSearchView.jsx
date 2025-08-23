// ===== TMDB SEARCH VIEW - VERSIÓN ACTUALIZADA CON API REAL =====

import { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { Container } from '../../atoms/Container/Container';
import { Divider } from '../../atoms/Divider/Divider';
import { DynamicForm } from '../../molecules/DynamicForm/DynamicForm';
import { ContentCard } from '../../molecules/ContentCard/ContentCard';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Typography } from '../../atoms/Typography/Typography';
import { Spinner } from '../../atoms/Spinner/Spinner';
import { tmdbService } from '../../../services/tmdb/TMDBService';

/**
 * TMDBSearchView - 100% MIGRADO AL SISTEMA DE DISEÑO
 * 
 * ✅ ZERO CSS CUSTOM: Usa únicamente componentes del sistema de diseño
 * ✅ LAYOUT PURO: FlexContainer, Container, Typography - sin estilos adicionales
 * ✅ SERVICIO REAL: Conecta con la API de TMDB usando VITE_TMDB_API_KEY
 * ✅ BÚSQUEDA FUNCIONAL: Películas, series o contenido mixto
 * ✅ SISTEMA DE DISEÑO: Solo componentes del sistema homologado
 * ✅ MANEJO DE ERRORES: Errores de red, API key inválida, etc.
 * ✅ UX OPTIMIZADA: Loading states, debouncing, validaciones
 * ✅ RESPONSIVE AUTOMÁTICO: Sin media queries, usando props del sistema
 * ✅ LIBRERÍA READY: Listo para extracción NPM sin dependencias CSS
 */
function TMDBSearchView({
  // Handlers principales
  onSelectItem = () => { },
  onManualCreate = () => { },

  // Configuración
  contentType = "all",
  title = "🎬 Buscar en TMDB",
  description = "Busca películas y series en la base de datos de TMDB para agregar al catálogo",
  placeholder = "Ej: Avatar, Breaking Bad, Inception...",
  helperText = "Busca por título, año o palabras clave",
  showManualCreate = true,

  // Opciones de ordenamiento
  sortOptions = [
    { value: "popularity", label: "Más populares" },
    { value: "year-desc", label: "Más recientes" },
    { value: "year-asc", label: "Más antiguos" },
    { value: "rating-desc", label: "Mejor puntuados" }
  ]
}) {

  // ===== ESTADOS LOCALES =====
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState(true);

  // ===== VALIDACIONES DE SEGURIDAD =====
  const safeSearchQuery = typeof searchQuery === 'string' ? searchQuery.trim() : "";
  const safeResults = Array.isArray(results) ? results : [];

  // ===== VERIFICAR API KEY AL CARGAR =====
  useEffect(() => {
    const checkApiKey = () => {
      const hasApiKey = !!import.meta.env.VITE_TMDB_API_KEY;
      setIsApiKeyValid(hasApiKey);

      if (!hasApiKey) {
        setError('⚠️ API Key de TMDB no configurada. Asegúrate de tener VITE_TMDB_API_KEY en tu archivo .env');
      }
    };

    checkApiKey();
  }, []);

  // ===== FUNCIÓN DE BÚSQUEDA REAL =====
  const performSearch = useCallback(async () => {
    if (!safeSearchQuery || safeSearchQuery.length < 2) {
      setError('Por favor ingresa al menos 2 caracteres para buscar');
      return;
    }

    if (!isApiKeyValid) {
      setError('No se puede realizar la búsqueda: API Key de TMDB no configurada');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {

      // Usar el servicio real de TMDB
      const searchResults = await tmdbService.searchContent(
        safeSearchQuery,
        contentType,
        { sortBy }
      );

      setResults(searchResults);

      if (searchResults.length === 0) {
        setError(`No se encontraron resultados para "${safeSearchQuery}". Intenta con otros términos.`);
      }

    } catch (err) {

      // Manejar diferentes tipos de errores
      let errorMessage = 'Error desconocido al buscar en TMDB.';

      if (err.message.includes('API Key')) {
        errorMessage = '🔑 Error de autenticación con TMDB. Verifica tu API Key.';
        setIsApiKeyValid(false);
      } else if (err.message.includes('HTTP 429')) {
        errorMessage = '⏱️ Demasiadas solicitudes. Espera un momento e intenta de nuevo.';
      } else if (err.message.includes('HTTP 5')) {
        errorMessage = '🛠️ Error del servidor de TMDB. Intenta más tarde.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = '🌐 Error de conexión. Verifica tu internet e intenta de nuevo.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }

      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [safeSearchQuery, contentType, sortBy, isApiKeyValid]);

  // ===== CAMPOS DEL FORMULARIO DE BÚSQUEDA =====
  const searchFields = useMemo(() => [
    {
      name: 'searchQuery',
      type: 'text',
      label: 'Buscar por titulo',
      placeholder: placeholder,
      helperText: isApiKeyValid ? helperText : '⚠️ Configura VITE_TMDB_API_KEY para habilitar búsqueda',
      leftIcon: 'search',
      value: searchQuery,
      required: true,
      minLength: 2,
      disabled: !isApiKeyValid
    },
    {
      name: 'sortBy',
      type: 'select',
      label: 'Ordenar por',
      leftIcon: 'sort',
      value: sortBy,
      options: sortOptions,
      disabled: !isApiKeyValid
    }
  ], [placeholder, helperText, searchQuery, sortBy, sortOptions, isApiKeyValid]);

  // ===== HANDLERS =====
  const handleSearchFormChange = useCallback((formData) => {
    if (formData.searchQuery !== undefined) {
      setSearchQuery(formData.searchQuery);
    }

    if (formData.sortBy !== undefined) {
      const newSort = formData.sortBy;
      setSortBy(newSort);

      // Reordenar resultados actuales si ya se ha buscado
      setResults(prevResults =>
        tmdbService.sortResults(Array.from(prevResults), newSort)
      );
    }
  }, []);

  const handleSearchSubmit = useCallback(() => {
    performSearch();
  }, [performSearch]);

  const handleClearResults = useCallback(() => {
    setResults([]);
    setSearchQuery("");
    setError(null);
    setHasSearched(false);
  }, []);

  const handleItemClick = useCallback((item) => {

    onSelectItem(item);
  }, [onSelectItem]);

  // ===== FUNCIONES DE RENDERIZADO =====
  const renderResultItem = useCallback(
    (item) => {
      const {
        id,
        title = item.name || 'Sin título',
        type = 'movie',
        year = 'N/A',
        rating = 'N/A',
        poster_path = null,
      } = item;

      const content = {
        id,
        title,
        cover: poster_path,
        year,
        rating,
        type: type === 'tv' ? 'series' : type,
      };

      return (
        <ContentCard
          key={`tmdb-${id}-${type}`}
          content={content}
          size="md"
          showCategory={false}
          showMeta={false}
          showRating={rating !== 'N/A'}
          onClick={() => handleItemClick(item)}
          style={{ width: '100%' }}
        />
      );
    },
    [handleItemClick]
  );

  // ===== ESTADOS DE LA INTERFAZ =====
  const renderWelcomeState = () => (
    <EmptyState
      icon="film"
      title="Buscar en The Movie Database"
      description="Ingresa el nombre de una película o serie para buscar en la base de datos más completa del mundo."
    />
  );

  const renderLoadingState = () => (
    <EmptyState
      icon={<Spinner size="lg" variant="primary" />}
      title="Buscando en TMDB..."
      description="Consultando la base de datos de The Movie Database"
    />
  );

  const renderErrorState = () => (
    <EmptyState
      icon="alert-circle"
      title="Error en la búsqueda"
      description={error}
      action={(
        <FlexContainer spacing="sm" justify="center" wrap="wrap">
          <Button
            variant="secondary"
            size="sm"
            leftIcon="refresh-cw"
            onClick={performSearch}
            disabled={!isApiKeyValid}
          >
            Intentar de nuevo
          </Button>
          <Button
            variant="neutral"
            size="sm"
            leftIcon="trash-2"
            onClick={handleClearResults}
          >
            Limpiar
          </Button>
        </FlexContainer>
      )}
      variant="danger"
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="search"
      title="Sin resultados"
      description={`No se encontraron resultados para "${safeSearchQuery}".`}
      action={(
        <FlexContainer spacing="sm" justify="center" wrap="wrap">
          <Button
            variant="secondary"
            size="sm"
            leftIcon="refresh-cw"
            onClick={handleClearResults}
          >
            Nueva búsqueda
          </Button>
          {showManualCreate && (
            <Button
              variant="primary"
              size="sm"
              leftIcon="plus"
              onClick={onManualCreate}
            >
              Crear manualmente
            </Button>
          )}
        </FlexContainer>
      )}
    />
  );

  // ===== RENDER PRINCIPAL =====
  return (
    <Container variant="neutral" size="full" padding="lg">
      <FlexContainer direction="column" spacing="lg">
        {/* Header */}
        <FlexContainer direction="column" spacing="sm">
          <Typography as="h3" size="xl" weight="bold" color="primary">
            {title}
          </Typography>
          {description && (
            <Typography size="sm" color="muted">
              {description}
            </Typography>
          )}
        </FlexContainer>

        <Divider variant="neutral" size="md" />
        
        {/* Formulario de búsqueda */}
        <DynamicForm
          fields={searchFields}
          onSubmit={handleSearchSubmit}
          onChange={handleSearchFormChange}
          size="md"
          variant="primary"
          rounded="md"
          actions={[
            {
              key: 'search',
              type: 'submit',
              text: loading ? 'Buscando...' : 'Buscar',
              variant: 'primary',
              leftIcon: 'search',
              loading: loading,
              disabled: !safeSearchQuery || safeSearchQuery.length < 2 || !isApiKeyValid,
              onClick: performSearch
            },
            {
              key: 'clear',
              text: 'Limpiar',
              variant: 'neutral',
              leftIcon: 'trash-2',
              onClick: handleClearResults,
              disabled: loading,
              show: hasSearched
            },
            {
              key: 'manual',
              text: 'Crear manualmente',
              variant: 'secondary',
              leftIcon: 'plus',
              onClick: onManualCreate,
              disabled: loading,
              show: showManualCreate
            }
          ]}
        />

        <Divider variant="neutral" size="sm" />

        {/* Estados de contenido */}
        {loading && renderLoadingState()}

        {error && !loading && renderErrorState()}

        {!loading && !error && !hasSearched && renderWelcomeState()}

        {!loading && !error && hasSearched && safeResults.length === 0 && renderEmptyState()}

        {/* Resultados en grid responsive */}
        {!loading && !error && safeResults.length > 0 && (
          <FlexContainer direction="column" spacing="md">
            <Typography size="md" weight="medium" color="primary">
              Resultados encontrados: {safeResults.length}
            </Typography>
            <FlexContainer 
              direction="row" 
              spacing="lg" 
              wrap="wrap"
              justify="flex-start"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                spacing: 'lg'
              }}
            >
              {safeResults.map(renderResultItem)}
            </FlexContainer>
          </FlexContainer>
        )}
      </FlexContainer>
    </Container>
  );
}

TMDBSearchView.propTypes = {
  onSelectItem: PropTypes.func,
  onManualCreate: PropTypes.func,
  contentType: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  showManualCreate: PropTypes.bool,
  sortOptions: PropTypes.array
};

export { TMDBSearchView };