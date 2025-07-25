// ===== MAIN PAGE - CAMBIO BOTÓN ADMIN =====
// src/Pages/MainPage/MainPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { useAlertContext } from '../../app/context/AlertContext';
import { transformMovieData } from '../../utils/movieDataTransformer';
import { Button } from '../../components/atoms/Button/Button';
import { PageLayout } from '../../components/templates/PageLayout/PageLayout';
import { AppHeader } from '../../components/organisms/AppHeader/AppHeader';
import { FilterBar } from '../../components/molecules/FilterBar/FilterBar';
import { ContentSection } from '../../components/molecules/ContentSection/ContentSection';
import { ContentCard } from '../../components/molecules/ContentCard/ContentCard';
import { EmptyState } from '../../components/molecules/EmptyState/EmptyState';

// Servicios
import { getMoviesService } from '../../services/Movies/getMoviesService';
import { searchMoviesService } from '../../services/Movies/searchMoviesService';
import { getSeriesService } from '../../services/Series/getSeriesService';
import { searchSeriesService } from '../../services/Series/searchSeriesService';
import { getCategoriesService } from '../../services/Categories/getCategoriesService';
import { logoutService } from '../../services/Auth/logoutService';

function MainPage() {
    const navigate = useNavigate();
    const { handleContentCardClick, handleContentCardPlay } = useMovieNavigation();
    const { showPermissionError, showConfirm } = useAlertContext();

    // Estados
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [user, setUser] = useState(null);

    // Estados de datos
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [categories, setCategories] = useState([]);

    // Estados de carga
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingSeries, setLoadingSeries] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [searching, setSearching] = useState(false);

    // Estados de error
    const [moviesError, setMoviesError] = useState(null);
    const [seriesError, setSeriesError] = useState(null);
    const [categoriesError, setCategoriesError] = useState(null);

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
        } catch (err) {
            console.error('Error parsing user data:', err);
            navigate('/login');
        }
    }, [navigate]);

    /**
     * ✅ AÑADIDO: Función para iconos de categorías
     */
    const getCategoryIcon = (categoryName) => {
        if (!categoryName) return '🎞️';

        const icons = {
            'Acción': '💥',
            'Drama': '🎭',
            'Comedia': '😂',
            'Terror': '👻',
            'Horror': '👻',
            'Fantasía': '🧙‍♂️',
            'Ciencia Ficción': '🚀',
            'Sci-Fi': '🚀',
            'Romance': '💕',
            'Animación': '🎨',
            'Documental': '📋',
            'Thriller': '🔪',
            'Aventura': '🗺️',
            'Misterio': '🕵️',
            'Crimen': '🚔',
            'Familia': '👨‍👩‍👧‍👦'
        };

        // Buscar coincidencia exacta o parcial
        const exactMatch = icons[categoryName];
        if (exactMatch) return exactMatch;

        // Buscar coincidencia parcial (case insensitive)
        const lowerName = categoryName.toLowerCase();
        for (const [key, icon] of Object.entries(icons)) {
            if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
                return icon;
            }
        }

        return '🎞️'; // Icono por defecto
    };
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
            console.log('🚪 Usuario solicitando logout...');
            
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
        } catch (error) {
            console.error('❌ Error en handleLogout:', error);
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
        console.log('🎬 Click movie:', movie.title);
        // Redirigir a página de detalle de película
        navigate(`/movies/${movie.id}`);
    };

    /**
     * Manejar click en serie - usa navegación inteligente
     */
    const handleSeriesClick = (series) => {
        console.log('📺 Click series:', series.title);
        handleContentCardClick(series); // ✅ Usa el método inteligente
    };

    /**
     * Reintentar carga de películas
     */
    const handleRetryMovies = () => {
        setMoviesError(null);
        loadMovies();
    };

    /**
     * Reintentar carga de series
     */
    const handleRetrySeries = () => {
        setSeriesError(null);
        loadSeries();
    };

    // ===== FUNCIONES DE DATOS =====

    const loadMovies = async () => {
        try {
            setLoadingMovies(true);
            setMoviesError(null);
            const response = await getMoviesService();

            console.log('🎬 Respuesta movies:', response); // Debug

            const movieData = Array.isArray(response) ? response : response?.data || [];
            const mappedMovies = movieData.map((movie) =>
                transformMovieData(movie, categories)
            );

            console.log('🎬 Movies mapeadas:', mappedMovies); // Debug
            setMovies(mappedMovies);
        } catch (error) {
            console.error('Error loading movies:', error);
            setMoviesError('Error al cargar películas');
        } finally {
            setLoadingMovies(false);
        }
    };

    const loadSeries = async () => {
        try {
            setLoadingSeries(true);
            setSeriesError(null);
            const response = await getSeriesService();

            console.log('📺 Respuesta series:', response); // Debug

            const seriesData = Array.isArray(response) ? response : response?.data || [];
            const mappedSeries = seriesData.map(serie => ({
                id: serie.id,
                title: serie.title,
                category: serie.category || 'Sin categoría', // Para mostrar
                categoryId: serie.categoryId, // Para filtrar
                year: serie.releaseYear || serie.year || new Date().getFullYear(),
                cover: `${import.meta.env.VITE_CDN_URL || 'http://localhost:8082'}/covers/${serie.cover_image}/cover.jpg`,
                type: 'series',
                rating: serie.rating || 0,
                seasons: serie.seasons || 1
            }));

            console.log('📺 Series mapeadas:', mappedSeries); // Debug
            setSeries(mappedSeries);
        } catch (error) {
            console.error('Error loading series:', error);
            setSeriesError('Error al cargar series');
        } finally {
            setLoadingSeries(false);
        }
    };

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            setCategoriesError(null);
            const response = await getCategoriesService();

            console.log('📋 Respuesta categorías:', response); // Debug

            const categoryData = Array.isArray(response) ? response : response?.data || [];

            // ✅ CORREGIDO: Mapear al formato que espera FilterBar
            const mappedCategories = [
                { value: 'all', label: 'Todas', icon: '🎬' }, // Categoría por defecto
                ...categoryData.map(cat => ({
                    value: cat.id ? cat.id.toString() : 'unknown', // FilterBar espera string
                    label: cat.name || 'Sin nombre',
                    icon: getCategoryIcon(cat.name),
                    id: cat.id // Mantener ID original para filtros
                }))
            ];

            console.log('📋 Categorías mapeadas:', mappedCategories); // Debug
            setCategories(mappedCategories);

        } catch (error) {
            console.error('Error loading categories:', error);
            setCategoriesError('Error al cargar categorías');

            // ✅ FALLBACK: Categorías por defecto si falla
            setCategories([
                { value: 'all', label: 'Todas', icon: '🎬' },
                { value: '1', label: 'Acción', icon: '💥' },
                { value: '2', label: 'Drama', icon: '🎭' },
                { value: '3', label: 'Comedia', icon: '😂' }
            ]);
        } finally {
            setLoadingCategories(false);
        }
    };

    // ===== EFECTOS =====
    useEffect(() => {
        if (user) {
            loadMovies();
            loadSeries();
            loadCategories();
        }
    }, [user]);

    // ===== FILTRADO CORREGIDO =====
    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());

        // ✅ CORREGIDO: Comparar con categoryId del contenido
        const matchesCategory = selectedCategory === 'all' ||
            movie.categoryId?.toString() === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const filteredSeries = series.filter(serie => {
        const matchesSearch = serie.title.toLowerCase().includes(searchTerm.toLowerCase());

        // ✅ CORREGIDO: Comparar con categoryId del contenido  
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
                    appTitle="🎬 StreamApp"
                    userName={user.userName || user.username || user.name || user.email || 'Usuario'}
                    searchValue={searchTerm}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Buscar películas y series..."
                    onLogout={handleLogout}
                    variant="default"
                    size="lg"
                />
            }
            filters={
                <FilterBar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    loading={loadingCategories}
                    actions={
                        // ✅ CAMBIO: Botón condicional según permisos
                        isAdmin ? (
                            <Button
                                variant="primary"
                                size="md"
                                leftIcon="⚙️"
                                onClick={handleGoToAdmin}
                            >
                                Admin Panel
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="md"
                                leftIcon="📤"
                                onClick={() => showPermissionError('Solo los administradores pueden subir contenido')}
                            >
                                Solicitar Acceso
                            </Button>
                        )
                    }
                />
            }
            variant="default"
        >
            {/* ===== SECCIÓN DE PELÍCULAS ===== */}
            <ContentSection
                title={`Películas ${searchTerm ? `- "${searchTerm}"` : selectedCategory !== 'all' ? '- Filtradas' : 'Populares'}`}
                icon="🎬"
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
                variant="default"
                size="md"
                gridColumns="repeat(auto-fit, minmax(200px, 1fr))"
                gridGap="var(--space-md)"
            >
                {filteredMovies.map(movie => (
                    <ContentCard
                        key={`movie-${movie.id}`}
                        content={movie}
                        onClick={() => handleMovieClick(movie)}
                        size="md"
                        showRating={true}
                        variant="elevated"
                    />
                ))}
            </ContentSection>

            {/* ===== SECCIÓN DE SERIES ===== */}
            <ContentSection
                title={`Series ${searchTerm ? `- "${searchTerm}"` : selectedCategory !== 'all' ? '- Filtradas' : 'Populares'}`}
                icon="📺"
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
                variant="default"
                size="md"
                gridColumns="repeat(auto-fit, minmax(200px, 1fr))"
                gridGap="var(--space-md)"
            >
                {filteredSeries.map(serie => (
                    <ContentCard
                        key={`series-${serie.id}`}
                        content={serie}
                        onClick={() => handleSeriesClick(serie)}
                        size="md"
                        showRating={true}
                        variant="elevated"
                    />
                ))}
            </ContentSection>
        </PageLayout>
    );
}

export { MainPage };