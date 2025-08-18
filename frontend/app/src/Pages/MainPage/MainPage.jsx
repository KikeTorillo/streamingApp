// ===== MAIN PAGE - REFACTORIZADA CON CONTEXTOS =====
// src/Pages/MainPage/MainPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { useAlertContext } from '../../app/context/AlertContext';
import { useMovies } from '../../app/context/MoviesContext';
import { useSeries } from '../../app/context/SeriesContext';
import { useCategories } from '../../app/context/CategoriesContext';
import { transformMovieData } from '../../utils/movieDataTransformer';
import { Button } from '../../components/atoms/Button/Button';
import { PageLayout } from '../../components/templates/PageLayout/PageLayout';
import { AppHeader } from '../../components/organisms/AppHeader/AppHeader';
import { FilterBar } from '../../components/molecules/FilterBar/FilterBar';
import { ContentSection } from '../../components/molecules/ContentSection/ContentSection';
import { ContentCard } from '../../components/molecules/ContentCard/ContentCard';
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

    // ===== VERIFICAR AUTENTICACIÓN =====
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

    // ===== FUNCIONES DE TRANSFORMACIÓN DE DATOS =====
    
    /**
     * Mapear movies del contexto para mostrar en UI
     */
    const getMappedMovies = () => {
        if (!movies || !Array.isArray(movies)) return [];
        return movies.map((movie) => transformMovieData(movie, getMappedCategories()));
    };
    
    /**
     * Mapear series del contexto para mostrar en UI
     */
    const getMappedSeries = () => {
        if (!series || !Array.isArray(series)) return [];
        return series.map(serie => ({
            id: serie.id,
            title: serie.title,
            category: serie.category || 'Sin categoría',
            categoryId: serie.categoryId,
            year: serie.releaseYear || serie.year || new Date().getFullYear(),
            cover: `${import.meta.env.VITE_CDN_URL || 'http://localhost:8082'}/covers/${serie.cover_image}/cover.jpg`,
            type: 'series',
            rating: serie.rating || 0,
            seasons: serie.seasons || 1
        }));
    };

    /**
     * Mapear categorías del contexto al formato que espera FilterBar
     */
    const getMappedCategories = () => {
        if (!categories || !Array.isArray(categories)) return [{ value: 'all', label: 'Todas'}];
        
        return [
            { value: 'all', label: 'Todas'},
            ...categories.map(cat => ({
                value: cat.id ? cat.id.toString() : 'unknown',
                label: cat.name || 'Sin nombre',
                id: cat.id
            }))
        ];
    };

    // ===== INICIALIZAR CARGA DE DATOS =====
    useEffect(() => {
        if (user) {

            // Disparar carga usando métodos de los contextos
            loadCategories(); // Necesario para FilterBar
            loadMovies();     // Solo se dispara si no hay datos
            loadSeries();     // Solo se dispara si no hay datos
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // ===== FILTRADO CON DATOS DE CONTEXTOS =====
    const mappedMovies = getMappedMovies();
    const mappedSeries = getMappedSeries();
    const mappedCategories = getMappedCategories();
    
    const filteredMovies = mappedMovies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' ||
            movie.categoryId?.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredSeries = mappedSeries.filter(serie => {
        const matchesSearch = serie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' ||
            serie.categoryId?.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // ===== LOADING INICIAL =====
    if (!user) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontSize: 'var(--font-size-lg)'
            }}>
                Cargando...
            </div>
        );
    }

    // ===== VERIFICAR SI ES ADMIN =====
    const isAdmin = user?.roleId === 1 || user?.role === 'admin';

    return (
        <PageLayout
            header={
                <AppHeader
                    appTitle="StreamApp"
                    userName={user.userName || user.username || user.name || user.email || 'Usuario'}
                    searchValue={searchTerm}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Buscar películas y series..."
                    onLogout={handleLogout}
                    variant="primary"
                    size="lg"
                />
            }
            filters={
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
            }
        >
            {/* ===== SECCIÓN DE PELÍCULAS ===== */}
            <ContentSection
                title={`Películas ${searchTerm ? `- "${searchTerm}"` : selectedCategory !== 'all' ? '- Filtradas' : 'Populares'}`}
                icon="film"
                loading={loadingMovies || searching}
                error={moviesError}
                empty={filteredMovies.length === 0 && !loadingMovies}
                emptyTitle={
                    searchTerm
                        ? `Sin películas para "${searchTerm}"`
                        : selectedCategory !== 'all'
                            ? "No hay películas en esta categoría"
                            : "No hay películas disponibles"
                }
                emptyDescription={
                    searchTerm
                        ? "No encontramos películas que coincidan con tu búsqueda."
                        : "Las películas están siendo actualizadas. Vuelve pronto para ver nuevo contenido."
                }
                emptyAction={
                    moviesError ? (
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
                    ) : null
                }
                variant="primary"
                size="lg"
                gridColumns="repeat(auto-fit, minmax(400px, 1fr))"
                gridGap="var(--space-md)"
            >
                {filteredMovies.map(movie => (
                    <ContentCard
                        key={`movie-${movie.id}`}
                        content={movie}
                        onClick={() => handleMovieClick(movie)}
                        size="lg"
                        showRating={true}
                        variant="primary"
                    />
                ))}
            </ContentSection>

            {/* ===== SECCIÓN DE SERIES ===== */}
            <ContentSection
                title={`Series ${searchTerm ? `- "${searchTerm}"` : selectedCategory !== 'all' ? '- Filtradas' : 'Populares'}`}
                icon="video"
                loading={loadingSeries || searching}
                error={seriesError}
                empty={filteredSeries.length === 0 && !loadingSeries}
                emptyTitle={
                    searchTerm
                        ? `Sin series para "${searchTerm}"`
                        : selectedCategory !== 'all'
                            ? "No hay series en esta categoría"
                            : "No hay series disponibles"
                }
                emptyDescription={
                    searchTerm
                        ? "No encontramos series que coincidan con tu búsqueda."
                        : "Las series están siendo actualizadas. Vuelve pronto para ver nuevo contenido."
                }
                emptyAction={
                    seriesError ? (
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
                    ) : null
                }
                variant="neutral"
                size="md"
                gridColumns="repeat(auto-fit, minmax(280px, 1fr))"
                gridGap="var(--space-md)"
            >
                {filteredSeries.map(serie => (
                    <ContentCard
                        key={`series-${serie.id}`}
                        content={serie}
                        onClick={() => handleSeriesClick(serie)}
                        size="lg"
                        showRating={true}
                        variant="primary"
                    />
                ))}
            </ContentSection>
        </PageLayout>
    );
}

export { MainPage };