// ===== MAIN PAGE - REFACTORIZADA CON DESIGN SYSTEM V2 =====
// src/Pages/MainPage/MainPage.jsx
// ✅ ATOMS ONLY - Prueba definitiva del Design System
// ❌ NO molecules/organisms - Solo composición de atoms

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { useAlertContext } from '../../app/context/AlertContext';
import { useMovies } from '../../app/context/MoviesContext';
import { useSeries } from '../../app/context/SeriesContext';
import { useCategories } from '../../app/context/CategoriesContext';
import { transformMovieData } from '../../utils/movieDataTransformer';
import { logoutService } from '../../services/Auth/logoutService';

// ✅ ATOMS ONLY - Design System V2 completo
import { Button } from '../../components/atoms/Button/Button';
import { Container } from '../../components/atoms/Container/Container';
import { Typography } from '../../components/atoms/Typography/Typography';
import { FlexContainer } from '../../components/atoms/FlexContainer/FlexContainer';
import { GridContainer } from '../../components/atoms/GridContainer/GridContainer';
import { Card } from '../../components/atoms/Card/Card';
import { Icon } from '../../components/atoms/Icon/Icon';
import { Input } from '../../components/atoms/Input/Input';
import { Image } from '../../components/atoms/Image/Image';
import { Badge } from '../../components/atoms/Badge/Badge';

function MainPage() {
    const navigate = useNavigate();
    const { handleContentCardClick } = useMovieNavigation();
    const { showPermissionError, showConfirm } = useAlertContext();

    // ✅ CONTEXTOS - Usar datos centralizados en lugar de llamadas directas
    const { movies, loading: loadingMovies, error: moviesError, loadMovies } = useMovies();
    const { series, loading: loadingSeries, error: seriesError, loadSeries } = useSeries();
    const { categories, loading: loadingCategories, loadCategories } = useCategories();

    // Estados locales reducidos
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [user, setUser] = useState(null);
    const [searching] = useState(false);

    // ===== TODOS LOS HOOKS AQUÍ AL INICIO =====

    // ===== TRANSFORMACIONES OPTIMIZADAS CON MEMOS =====
    // Mapear movies con memo para evitar recálculos
    const mappedMovies = useMemo(() =>
        movies?.map((movie) => transformMovieData(movie, categories)) || []
        , [movies, categories]);

    // Mapear series con memo
    const mappedSeries = useMemo(() =>
        series?.map(serie => ({
            id: serie.id,
            title: serie.title,
            category: serie.category || 'Sin categoría',
            categoryId: serie.categoryId,
            year: serie.releaseYear || serie.year || new Date().getFullYear(),
            cover: `${import.meta.env.VITE_CDN_URL || 'http://localhost:8082'}/covers/${serie.cover_image}/cover.jpg`,
            type: 'series',
            rating: serie.rating || 0,
            seasons: serie.seasons || 1
        })) || []
        , [series]);

    // Mapear categorías con memo
    const mappedCategories = useMemo(() => [
        { value: 'all', label: 'Todas' },
        ...(categories?.map(cat => ({
            value: cat.id?.toString() || 'unknown',
            label: cat.name || 'Sin nombre',
            id: cat.id
        })) || [])
    ], [categories]);

    // ===== FILTRADO OPTIMIZADO CON MEMOS =====
    const filteredMovies = useMemo(() =>
        mappedMovies.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' ||
                movie.categoryId?.toString() === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        , [mappedMovies, searchTerm, selectedCategory]);

    const filteredSeries = useMemo(() =>
        mappedSeries.filter(serie => {
            const matchesSearch = serie.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' ||
                serie.categoryId?.toString() === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        , [mappedSeries, searchTerm, selectedCategory]);

    // ===== VERIFICAR SI ES ADMIN OPTIMIZADO =====
    const isAdmin = useMemo(() =>
        user?.roleId === 1 || user?.role === 'admin'
        , [user]);    // ===== VERIFICAR AUTENTICACIÓN =====
    useEffect(() => {
        const sessionUser = sessionStorage.getItem('sessionUser');
        if (!sessionUser) {
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(sessionUser);
            setUser(userData);
        } catch {

            navigate('/login');
        }
    }, [navigate]);

    // ===== FUNCIONES DE MANEJO =====

    /**
     * Ir al Admin Panel (solo se ejecuta si el usuario es admin)
     */
    const handleGoToAdmin = () => {
        navigate('/admin');
    };

    /**
     * Manejar logout
     * Ejecuta el servicio de logout que limpia sesión y redirige
     */
  const handleLogout = () => {
    showConfirm(
      '¿Estás seguro de que quieres cerrar sesión?',
      () => {
        logoutService();
      },
      {
        title: 'Confirmar logout',
        confirmText: 'Cerrar sesión',
        cancelText: 'Cancelar'
      }
    );
  };    /**
     * Manejar búsqueda
     */
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    /**
     * Manejar cambio de categoría
     */
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    /**
     * Manejar click en película - redirige a página de detalle
     */
    const handleMovieClick = (movie) => {
        // Redirigir a página de detalle de película
        navigate(`/movies/${movie.id}`);
    };

    /**
     * Manejar click en serie - usa navegación inteligente
     */
    const handleSeriesClick = (series) => {
        handleContentCardClick(series); // ✅ Usa el método inteligente
    };

    /**
     * Reintentar carga usando contextos
     */
    const handleRetryMovies = () => {
        loadMovies(); // Método del contexto
    };

    const handleRetrySeries = () => {
        loadSeries(); // Método del contexto
    };

    // ===== ATOMS-ONLY RENDER FUNCTIONS =====
    
    /**
     * ✅ REEMPLAZA AppHeader - Solo atoms del design system
     */
    const renderHeader = () => (
        <Container
            as="header"
            size="full"
            padding="lg"
            variant="primary"
            style={{
                background: 'var(--color-primary)',
                borderBottom: '1px solid var(--border-color)'
            }}
        >
            <FlexContainer
                align="center"
                justify="space-between"
                gap="lg"
                width="full"
            >
                {/* Brand/Logo */}
                <Typography
                    variant="brand"
                    as="h1"
                    size="2xl"
                    weight="bold"
                    color="light"
                >
                    StreamApp
                </Typography>

                {/* Búsqueda - Reemplaza SearchBar con Input atom */}
                <FlexContainer align="center" gap="md" style={{ flex: 1, maxWidth: '400px' }}>
                    <Icon name="search" size="sm" variant="light" />
                    <Input
                        type="text"
                        placeholder="Buscar películas y series..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        variant="neutral"
                        size="md"
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white'
                        }}
                    />
                </FlexContainer>

                {/* Usuario y Logout */}
                <FlexContainer align="center" gap="md">
                    {user && (
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="light"
                        >
                            ¡Hola, {user.userName || user.username || user.name || user.email || 'Usuario'}!
                        </Typography>
                    )}
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleLogout}
                    >
                        Cerrar Sesión
                    </Button>
                </FlexContainer>
            </FlexContainer>
        </Container>
    );

    /**
     * ✅ REEMPLAZA FilterBar - Solo atoms del design system
     */
    const renderFilterBar = () => (
        <Container
            variant="neutral"
            size="full" 
            padding="lg"
        >
            <FlexContainer justify="space-between" align="center" gap="lg" width="full">
                {/* Estados de loading */}
                {loadingCategories && (
                    <FlexContainer
                        align="center"
                        justify="center"
                        width="full"
                    >
                        <Typography>Cargando filtros...</Typography>
                    </FlexContainer>
                )}

                {/* Contenido normal cuando no hay loading */}
                {!loadingCategories && (
                    <>
                        {/* Categorías */}
                        <FlexContainer
                            wrap="wrap"
                            gap="sm"
                            grow={true}
                            align="center"
                        >
                            {mappedCategories.map(category => (
                                <Button
                                    key={category.value}
                                    variant={selectedCategory === category.value ? 'primary' : 'secondary'}
                                    size="md"
                                    rounded="lg"
                                    onClick={() => handleCategoryChange(category.value)}
                                    disabled={loadingCategories}
                                >
                                    {category.label}
                                </Button>
                            ))}
                        </FlexContainer>

                        {/* Acciones - Botón condicional según permisos */}
                        <FlexContainer shrink={false}>
                            {isAdmin ? (
                                <Button
                                    variant="primary"
                                    leftIcon="settings"
                                    onClick={handleGoToAdmin}
                                    rounded="lg"
                                >
                                    Admin Panel
                                </Button>
                            ) : (
                                <Button
                                    variant="secondary"
                                    size="md"
                                    leftIcon="upload"
                                    onClick={() => showPermissionError('Solo los administradores pueden subir contenido')}
                                    rounded="lg"
                                >
                                    Solicitar Acceso
                                </Button>
                            )}
                        </FlexContainer>
                    </>
                )}
            </FlexContainer>
        </Container>
    );

    /**
     * ✅ REEMPLAZA ContentCard - Solo atoms del design system
     */
    const renderContentCard = ({ content, onClick }) => {
        const { title, cover, category, year, rating, type, duration, seasons } = content;

        const getMetaText = () => {
            if (type === 'movie' && duration) return duration;
            if (type === 'series' && seasons) {
                return `${seasons} temporada${seasons > 1 ? 's' : ''}`;
            }
            return year.toString();
        };

        return (
            <Card
                variant="neutral"
                size="lg"
                rounded="lg"
                hoverable
                clickable
                onClick={() => onClick(content)}
                style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid var(--border-color)'
                }}
            >
                {/* Imagen del contenido */}
                <Container padding="none" style={{ position: 'relative' }}>
                    <Image
                        src={cover}
                        alt={`Carátula de ${title}`}
                        aspectRatio="portrait"
                        loading="lazy"
                        rounded="md"
                        style={{ width: '100%', maxWidth: '100%' }}
                        fallback={
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 'var(--space-lg)',
                                color: 'var(--text-muted)',
                                textAlign: 'center'
                            }}>
                                <Icon name="film" size="lg" variant="muted" />
                                <Typography variant="body" size="sm" color="muted" style={{ marginTop: 'var(--space-sm)' }}>
                                    Imagen no disponible
                                </Typography>
                            </div>
                        }
                    />
                    
                    {/* Badge de tipo */}
                    <div style={{
                        position: 'absolute',
                        top: 'var(--space-sm)',
                        right: 'var(--space-sm)'
                    }}>
                        <Badge
                            variant={type === 'movie' ? 'primary' : 'secondary'}
                            size="sm"
                            leftIcon={type === 'movie' ? 'film' : 'video'}
                        >
                            {type === 'movie' ? 'Película' : 'Serie'}
                        </Badge>
                    </div>
                </Container>

                {/* Información del contenido */}
                <Container padding="md">
                    <FlexContainer direction="column" gap="xs">
                        {/* Título */}
                        <Typography
                            variant="h3"
                            size="md"
                            weight="semibold"
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {title}
                        </Typography>
                        
                        {/* Categoría y año */}
                        {category && (
                            <Typography
                                variant="body"
                                size="sm"
                                color="muted"
                            >
                                {category} • {year}
                            </Typography>
                        )}

                        {/* Metadatos y rating */}
                        <FlexContainer align="center" justify="space-between" gap="xs">
                            <Typography
                                variant="body"
                                size="xs"
                                color="muted"
                            >
                                {getMetaText()}
                            </Typography>
                            
                            {rating && (
                                <FlexContainer align="center" gap="2xs">
                                    <Icon name="star" size="xs" variant="warning" />
                                    <Typography
                                        variant="body"
                                        size="xs"
                                        color="warning"
                                        weight="medium"
                                    >
                                        {rating}
                                    </Typography>
                                </FlexContainer>
                            )}
                        </FlexContainer>
                    </FlexContainer>
                </Container>
            </Card>
        );
    };

    /**
     * ✅ REEMPLAZA EmptyState - Solo atoms del design system
     */
    const renderEmptyState = ({ 
        icon = 'film', 
        title = 'No hay contenido', 
        description = 'No se encontraron elementos para mostrar.',
        action = null 
    }) => (
        <Container
            size="full"
            padding="xl"
            variant="neutral"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: '300px'
            }}
        >
            <FlexContainer direction="column" align="center" gap="md">
                {/* Ícono */}
                <Icon
                    name={icon}
                    size="xl"
                    variant="muted"
                    style={{ marginBottom: 'var(--space-md)' }}
                />
                
                {/* Título */}
                <Typography
                    variant="h3"
                    size="lg"
                    weight="semibold"
                >
                    {title}
                </Typography>
                
                {/* Descripción */}
                <Typography
                    variant="body"
                    size="md"
                    color="muted"
                    style={{ maxWidth: '32rem' }}
                >
                    {description}
                </Typography>
                
                {/* Acción opcional */}
                {action && (
                    <Container padding="sm">
                        {action}
                    </Container>
                )}
            </FlexContainer>
        </Container>
    );

    // ===== FUNCIÓN HELPER PARA RENDERIZAR SECCIONES =====
    const renderContentSection = ({
        title,
        icon = 'grid',
        loading = false,
        error = null,
        empty = false,
        emptyTitle = 'No hay contenido',
        emptyDescription = 'No se encontraron elementos en esta sección.',
        emptyAction = null,
        containerVariant = 'neutral', // ✅ NEUTRAL es transparente
        children
    }) => (
        <Container
            as="section"
            size="full"
            padding="lg"
            variant={containerVariant}
            style={{ marginBottom: 'var(--space-xl)' }}
        >
            {/* Header de la sección */}
            <FlexContainer align="center" gap="md" style={{ marginBottom: 'var(--space-lg)' }}>
                <Icon name={icon} size="md" />
                <Typography variant="h2" size="xl" weight="semibold">
                    {title}
                </Typography>
            </FlexContainer>

            {/* Estado de error */}
            {error && (
                <Card variant="danger" size="lg" rounded="lg">
                    <FlexContainer align="start" gap="md" padding="lg">
                        <Icon name="alert" size="md" variant="danger" />
                        <Container padding="none">
                            <Typography variant="h3" size="md" weight="semibold" color="danger">
                                Error al cargar contenido
                            </Typography>
                            <Typography variant="body" size="md" color="muted">
                                {error}
                            </Typography>
                        </Container>
                    </FlexContainer>
                </Card>
            )}

            {/* Estado de carga */}
            {loading && (
                <GridContainer
                    columns="repeat(auto-fill, minmax(280px, 320px))"
                    gap="lg"
                >
                    {Array.from({ length: 6 }, (_, i) => (
                        <Card key={i} variant="neutral" size="lg" rounded="lg">
                            <FlexContainer direction="column" gap="sm" padding="md">
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '2/3',
                                    backgroundColor: 'var(--bg-muted)',
                                    borderRadius: 'var(--border-radius-md)'
                                }} />
                                <div style={{
                                    height: '1.5rem',
                                    backgroundColor: 'var(--bg-muted)',
                                    borderRadius: 'var(--border-radius-sm)'
                                }} />
                                <div style={{
                                    height: '1rem',
                                    width: '60%',
                                    backgroundColor: 'var(--bg-muted)',
                                    borderRadius: 'var(--border-radius-sm)'
                                }} />
                            </FlexContainer>
                        </Card>
                    ))}
                </GridContainer>
            )}

            {/* Estado vacío - usando renderEmptyState */}
            {empty && !loading && !error && 
                renderEmptyState({
                    icon: 'film',
                    title: emptyTitle,
                    description: emptyDescription,
                    action: emptyAction
                })
            }

            {/* Contenido normal */}
            {!loading && !error && !empty && (
                <GridContainer
                    columns="repeat(auto-fill, minmax(280px, 320px))"
                    gap="lg"
                >
                    {children}
                </GridContainer>
            )}
        </Container>
    );

    // ===== INICIALIZAR CARGA DE DATOS =====
    useEffect(() => {
        if (user) {
            // Disparar carga usando métodos de los contextos
            loadCategories(); // Necesario para FilterBar
            loadMovies();     // Solo se dispara si no hay datos
            loadSeries();     // Solo se dispara si no hay datos
        }
    }, [user, loadCategories, loadMovies, loadSeries]);

    // ===== LOADING INICIAL OPTIMIZADO =====
    if (!user) {
        return (
            <Container
                size="full"
                padding="xl"
                variant="primary"
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                Cargando...
            </Container>
        );
    }

    return (
        <>
            {/* ===== HEADER USANDO SOLO ATOMS ===== */}
            {renderHeader()}

            {/* ===== FILTER BAR USANDO SOLO ATOMS ===== */}
            {renderFilterBar()}

            {/* ===== SECCIÓN DE PELÍCULAS USANDO SOLO ATOMS ===== */}
            {renderContentSection({
                title: `Películas ${searchTerm ? `- "${searchTerm}"` : selectedCategory !== 'all' ? '- Filtradas' : 'Destacadas'}`,
                icon: 'film',
                loading: loadingMovies || searching,
                error: moviesError,
                empty: filteredMovies.length === 0 && !loadingMovies,
                emptyTitle: searchTerm
                    ? `Sin películas para "${searchTerm}"`
                    : selectedCategory !== 'all'
                        ? "No hay películas en esta categoría"
                        : "No hay películas disponibles",
                emptyDescription: searchTerm
                    ? "No encontramos películas que coincidan con tu búsqueda."
                    : "Las películas están siendo actualizadas. Vuelve pronto para ver nuevo contenido.",
                emptyAction: moviesError ? (
                    <Button variant="secondary" onClick={handleRetryMovies}>
                        Reintentar
                    </Button>
                ) : searchTerm ? (
                    <Button variant="secondary" onClick={() => setSearchTerm('')}>
                        Limpiar búsqueda
                    </Button>
                ) : isAdmin ? (
                    <Button variant="primary" onClick={handleGoToAdmin}>
                        Ir al Admin Panel
                    </Button>
                ) : null,
                children: filteredMovies.map(movie => (
                    <div key={`movie-${movie.id}`}>
                        {renderContentCard({
                            content: movie,
                            onClick: handleMovieClick
                        })}
                    </div>
                ))
            })}

            {/* ===== SECCIÓN DE SERIES USANDO SOLO ATOMS ===== */}
            {renderContentSection({
                title: `Series ${searchTerm ? `- "${searchTerm}"` : selectedCategory !== 'all' ? '- Filtradas' : 'Tendencias'}`,
                icon: 'video',
                loading: loadingSeries || searching,
                error: seriesError,
                empty: filteredSeries.length === 0 && !loadingSeries,
                emptyTitle: searchTerm
                    ? `Sin series para "${searchTerm}"`
                    : selectedCategory !== 'all'
                        ? "No hay series en esta categoría"
                        : "No hay series disponibles",
                emptyDescription: searchTerm
                    ? "No encontramos series que coincidan con tu búsqueda."
                    : "Las series están siendo actualizadas. Vuelve pronto para ver nuevo contenido.",
                emptyAction: seriesError ? (
                    <Button variant="secondary" onClick={handleRetrySeries}>
                        Reintentar
                    </Button>
                ) : searchTerm ? (
                    <Button variant="secondary" onClick={() => setSearchTerm('')}>
                        Limpiar búsqueda
                    </Button>
                ) : isAdmin ? (
                    <Button variant="primary" onClick={handleGoToAdmin}>
                        Ir al Admin Panel
                    </Button>
                ) : null,
                children: filteredSeries.map(serie => (
                    <div key={`series-${serie.id}`}>
                        {renderContentCard({
                            content: serie,
                            onClick: handleSeriesClick
                        })}
                    </div>
                ))
            })}
        </>
    );
}

export { MainPage };