// ===== MAIN PAGE - MIGRADA COMPLETAMENTE AL SISTEMA DE DISEÑO V2.0 =====
// src/Pages/MainPage/MainPage.jsx
// ✅ SISTEMA DE DISEÑO V2.0 COMPLETO - Átomos + Moléculas + Composición Universal
// ✅ 100% TOKENS - Sin estilos inline, solo tokens del sistema
// ✅ COMPONENTES REUTILIZABLES - ContentCard, EmptyState
// ✅ API ESTÁNDAR - Props unificadas en todos los componentes

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { useAlertContext } from '../../app/context/AlertContext';
import { useMovies } from '../../app/context/MoviesContext';
import { useSeries } from '../../app/context/SeriesContext';
import { useCategories } from '../../app/context/CategoriesContext';
import { transformMovieData } from '../../utils/movieDataTransformer';
import { logoutService } from '../../services/Auth/logoutService';

// ✅ DESIGN SYSTEM - LIBRERÍA REUTILIZABLE
import {
    Button,
    Container,
    Typography,
    FlexContainer,
    GridContainer,
    Input,
    Icon,
    EmptyState,
    Skeleton
} from '../../../design-system';

// ✅ COMPONENTES ESPECÍFICOS STREAMING
import { ContentCard } from '../../components/molecules/ContentCard/ContentCard';

/**
 * ✅ AppHeader ESTABLE - Componente fuera para evitar re-creación
 * Se mantiene estable entre renders de MainPage
 */
function AppHeaderComponent({
    searchTerm,
    onSearchChange,
    user,
    onLogout
}) {
    return (
        <Container
            as="header"
            size="full"
            padding="lg"
            variant="primary"
        >
            <FlexContainer
                align="center"
                justify="space-between"
                gap="lg"
            >
                {/* Brand/Logo */}
                <Typography
                    as="h1"
                    size="2xl"
                    weight="bold"
                    variant="primary"
                >
                    StreamApp
                </Typography>

                {/* Búsqueda Universal - Input estable */}
                <Input
                    type="text"
                    placeholder="Buscar películas y series..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    variant="warning"
                    size="xs"
                    width="lg"
                    leftIcon="search"
                    rounded="2xl"
                />
                {/* Usuario y Acciones */}
                <FlexContainer align="center" spacing="xl" gap="md">
                    {user && (
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="neutral"
                        >
                            ¡Hola, {user.userName || user.username || user.name || user.email || 'Usuario'}!
                        </Typography>
                    )}
                    <Button
                        variant="secondary"
                        size="sm"
                        leftIcon="user"
                        onClick={onLogout}
                    >
                        Cerrar Sesión
                    </Button>
                </FlexContainer>
            </FlexContainer>
        </Container>
    );
}

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

    // ===== COMPONENTES V2.0 CON COMPOSICIÓN UNIVERSAL =====


    /**
     * ✅ Barra de Filtros - Composición Universal V2.0
     * FlexContainer + Button array con estados automáticos
     * Memorizado para evitar re-renders innecesarios
     */
    const FilterBar = useCallback(() => (
        <Container
            variant="neutral"
            size="full"
            padding="lg"
        >
            <FlexContainer justify="space-between" align="center" gap="lg">
                {/* Estado de loading */}
                {loadingCategories ? (
                    <FlexContainer align="center" justify="center" width="full">
                        <Icon name="loading" size="md" spinning />
                        <Typography size="md" variant="neutral">Cargando filtros...</Typography>
                    </FlexContainer>
                ) : (
                    <>
                        {/* Filtros de Categorías */}
                        <FlexContainer
                            wrap="wrap"
                            gap="sm"
                            grow
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

                        {/* Acciones Principales */}
                        <FlexContainer shrink={false}>
                            {isAdmin ? (
                                <Button
                                    variant="primary"
                                    size="md"
                                    leftIcon="settings"
                                    onClick={handleGoToAdmin}
                                    rounded="lg"
                                >
                                    Admin Panel
                                </Button>
                            ) : (
                                <Button
                                    variant="neutral"
                                    size="md"
                                    leftIcon="plus"
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
    ), [loadingCategories, mappedCategories, selectedCategory, handleCategoryChange, isAdmin, handleGoToAdmin, showPermissionError]);

    // ✅ ELIMINADO: renderContentCard - Ahora usamos ContentCard molecular V2.0

    // ✅ ELIMINADO: renderEmptyState - Ahora usamos EmptyState molecular V2.0

    /**
     * ✅ Sección de Contenido - Composición Universal V2.0
     * GridContainer + Estados + EmptyState molecular
     */
    const ContentSection = ({
        title,
        icon = 'grid',
        loading = false,
        error = null,
        empty = false,
        emptyTitle = 'No hay contenido',
        emptyDescription = 'No se encontraron elementos en esta sección.',
        emptyAction = null,
        children
    }) => (
        <Container
            as="section"
            size="full"
            padding="lg"
            variant="neutral"
        >
            {/* Header de la sección */}
            <FlexContainer align="center" gap="md" padding="md">
                <Icon name={icon} size="md" variant="primary" />
                <Typography as="h2" size="xl" weight="semibold" variant="primary">
                    {title}
                </Typography>
            </FlexContainer>

            {/* Estado de error */}
            {error && (
                <EmptyState
                    icon="warning"
                    title="Error al cargar contenido"
                    description={error}
                    variant="danger"
                    action={
                        <Button
                            variant="danger"
                            leftIcon="settings"
                            onClick={() => window.location.reload()}
                        >
                            Reintentar
                        </Button>
                    }
                />
            )}

            {/* Estado de carga */}
            {loading && (
                <GridContainer
                    columns="repeat(auto-fill, minmax(280px, 320px))"
                    gap="lg"
                >
                    {Array.from({ length: 6 }, (_, i) => (
                        <Container key={i} padding="md" rounded="lg" variant="neutral">
                            <FlexContainer direction="column" gap="sm">
                                <Skeleton
                                    width="full"
                                    height="200px"
                                    rounded="md"
                                />
                                <Skeleton
                                    width="full"
                                    height="1.5rem"
                                    rounded="sm"
                                />
                                <Skeleton
                                    width="60%"
                                    height="1rem"
                                    rounded="sm"
                                />
                            </FlexContainer>
                        </Container>
                    ))}
                </GridContainer>
            )}

            {/* Estado vacío - EmptyState molecular */}
            {empty && !loading && !error && (
                <EmptyState
                    icon="search"
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                    variant="neutral"
                />
            )}

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

    // ===== LOADING INICIAL CON SISTEMA V2.0 =====
    if (!user) {
        return (
            <Container
                size="full"
                padding="xl"
                variant="primary"
                style={{ minHeight: '100vh' }}
            >
                <FlexContainer
                    align="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}
                >
                    <FlexContainer align="center" gap="md">
                        <Icon name="loading" size="lg" spinning variant="primary" />
                        <Typography size="lg" variant="primary" weight="medium">
                            Cargando aplicación...
                        </Typography>
                    </FlexContainer>
                </FlexContainer>
            </Container>
        );
    }

    return (
        <>
            {/* ===== HEADER - COMPOSICIÓN UNIVERSAL V2.0 ===== */}
            <AppHeaderComponent
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                user={user}
                onLogout={handleLogout}
            />

            {/* ===== FILTER BAR - COMPOSICIÓN UNIVERSAL V2.0 ===== */}
            <FilterBar />

            {/* ===== SECCIÓN DE PELÍCULAS - SISTEMA COMPLETO V2.0 ===== */}
            <ContentSection
                title={`Películas ${searchTerm ? `- "${searchTerm}"` : selectedCategory !== 'all' ? '- Filtradas' : 'Destacadas'}`}
                icon="film"
                loading={loadingMovies || searching}
                error={moviesError}
                empty={filteredMovies.length === 0 && !loadingMovies}
                emptyTitle={searchTerm
                    ? `Sin películas para "${searchTerm}"`
                    : selectedCategory !== 'all'
                        ? "No hay películas en esta categoría"
                        : "No hay películas disponibles"}
                emptyDescription={searchTerm
                    ? "No encontramos películas que coincidan con tu búsqueda."
                    : "Las películas están siendo actualizadas. Vuelve pronto para ver nuevo contenido."}
                emptyAction={moviesError ? (
                    <Button variant="secondary" leftIcon="settings" onClick={handleRetryMovies}>
                        Reintentar
                    </Button>
                ) : searchTerm ? (
                    <Button variant="secondary" leftIcon="x" onClick={() => setSearchTerm('')}>
                        Limpiar búsqueda
                    </Button>
                ) : isAdmin ? (
                    <Button variant="primary" leftIcon="settings" onClick={handleGoToAdmin}>
                        Ir al Admin Panel
                    </Button>
                ) : null}
            >
                {filteredMovies.map(movie => (
                    <ContentCard
                        key={`movie-${movie.id}`}
                        content={movie}
                        onClick={handleMovieClick}
                        variant="neutral"
                        size="md"
                        rounded="lg"
                    />
                ))}
            </ContentSection>

            {/* ===== SECCIÓN DE SERIES - SISTEMA COMPLETO V2.0 ===== */}
            <ContentSection
                title={`Series ${searchTerm ? `- "${searchTerm}"` : selectedCategory !== 'all' ? '- Filtradas' : 'Tendencias'}`}
                icon="video"
                loading={loadingSeries || searching}
                error={seriesError}
                empty={filteredSeries.length === 0 && !loadingSeries}
                emptyTitle={searchTerm
                    ? `Sin series para "${searchTerm}"`
                    : selectedCategory !== 'all'
                        ? "No hay series en esta categoría"
                        : "No hay series disponibles"}
                emptyDescription={searchTerm
                    ? "No encontramos series que coincidan con tu búsqueda."
                    : "Las series están siendo actualizadas. Vuelve pronto para ver nuevo contenido."}
                emptyAction={seriesError ? (
                    <Button variant="secondary" leftIcon="settings" onClick={handleRetrySeries}>
                        Reintentar
                    </Button>
                ) : searchTerm ? (
                    <Button variant="secondary" leftIcon="x" onClick={() => setSearchTerm('')}>
                        Limpiar búsqueda
                    </Button>
                ) : isAdmin ? (
                    <Button variant="primary" leftIcon="settings" onClick={handleGoToAdmin}>
                        Ir al Admin Panel
                    </Button>
                ) : null}
            >
                {filteredSeries.map(serie => (
                    <ContentCard
                        key={`series-${serie.id}`}
                        content={serie}
                        onClick={handleSeriesClick}
                        variant="neutral"
                        size="md"
                        rounded="lg"
                    />
                ))}
            </ContentSection>
        </>
    );
}

export { MainPage };