// ===== MAIN PAGE - REFACTORIZADA CON CONTEXTOS =====
// src/Pages/MainPage/MainPage.jsx

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { useAlertContext } from '../../app/context/AlertContext';
import { useMovies } from '../../app/context/MoviesContext';
import { useSeries } from '../../app/context/SeriesContext';
import { useCategories } from '../../app/context/CategoriesContext';
import { transformMovieData } from '../../utils/movieDataTransformer';
import { Button } from '../../components/atoms/Button/Button';
import { AppHeader } from '../../components/organisms/AppHeader/AppHeader';
import { FilterBar } from '../../components/molecules/FilterBar/FilterBar';
import { ContentCard } from '../../components/molecules/ContentCard/ContentCard';
import { Container } from '../../components/atoms/Container/Container';
import { Typography } from '../../components/atoms/Typography/Typography';
import { FlexContainer } from '../../components/atoms/FlexContainer/FlexContainer';
import { GridContainer } from '../../components/atoms/GridContainer/GridContainer';
import { EmptyState } from '../../components/molecules/EmptyState/EmptyState';
import { Card } from '../../components/atoms/Card/Card';
import { Icon } from '../../components/atoms/Icon/Icon';
import { logoutService } from '../../services/Auth/logoutService';

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
    const handleLogout = async () => {
        try {

            // Mostrar mensaje de confirmación usando nuestro sistema
            showConfirm(
                '¿Estás seguro de que quieres cerrar sesión?',
                async () => {
                    await logoutService();
                    // logoutService ya maneja la redirección automáticamente
                },
                {
                    title: 'Confirmar logout',
                    confirmText: 'Cerrar sesión',
                    cancelText: 'Cancelar'
                }
            );
        } catch {

            // En caso de error, forzar limpieza y redirigir
            sessionStorage.removeItem('sessionUser');
            window.location.href = '/login';
        }
    };

    /**
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
                            <Typography variant="strong" size="md" weight="semibold" color="danger">
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
                    gap="var(--space-lg)"
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

            {/* Estado vacío */}
            {empty && !loading && !error && (
                <EmptyState
                    leftIcon="folder"
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                    size="lg"
                    variant="primary"
                />
            )}

            {/* Contenido normal */}
            {!loading && !error && !empty && (
                <GridContainer
                    columns="repeat(auto-fill, minmax(280px, 320px))"
                    gap="var(--space-lg)"
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
            <AppHeader
                appTitle="StreamApp"
                userName={user.userName || user.username || user.name || user.email || 'Usuario'}
                searchValue={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Buscar películas y series..."
                onLogout={handleLogout}
                size="lg"
            />

            <FilterBar
                categories={mappedCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                loading={loadingCategories}
                actions={
                    // ✅ CAMBIO: Botón condicional según permisos
                    isAdmin ? (
                        <Button
                            variant="primary"
                            size="md"
                            leftIcon="settings"
                            onClick={handleGoToAdmin}
                        >
                            Admin Panel
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="md"
                            leftIcon="upload"
                            onClick={() => showPermissionError('Solo los administradores pueden subir contenido')}
                        >
                            Solicitar Acceso
                        </Button>
                    )
                }
            />

            {/* ===== SECCIÓN DE PELÍCULAS INTEGRADA ===== */}
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
                    <Button variant="outline" onClick={handleRetryMovies}>
                        Reintentar
                    </Button>
                ) : searchTerm ? (
                    <Button variant="outline" onClick={() => setSearchTerm('')}>
                        Limpiar búsqueda
                    </Button>
                ) : isAdmin ? (
                    <Button variant="primary" onClick={handleGoToAdmin}>
                        Ir al Admin Panel
                    </Button>
                ) : null,
                children: filteredMovies.map(movie => (
                    <ContentCard
                        key={`movie-${movie.id}`}
                        content={movie}
                        onClick={() => handleMovieClick(movie)}
                        size="lg"
                        showRating
                        cardVariant="elevated"
                    />
                ))
            })}

            {/* ===== SECCIÓN DE SERIES INTEGRADA ===== */}
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
                    <Button variant="outline" onClick={handleRetrySeries}>
                        Reintentar
                    </Button>
                ) : searchTerm ? (
                    <Button variant="outline" onClick={() => setSearchTerm('')}>
                        Limpiar búsqueda
                    </Button>
                ) : isAdmin ? (
                    <Button variant="primary" onClick={handleGoToAdmin}>
                        Ir al Admin Panel
                    </Button>
                ) : null,
                children: filteredSeries.map(serie => (
                    <ContentCard
                        key={`series-${serie.id}`}
                        content={serie}
                        onClick={() => handleSeriesClick(serie)}
                        size="lg"
                        showRating
                        variant="secondary"
                        cardVariant="elevated"
                    />
                ))
            })}
        </>
    );
}

export { MainPage };