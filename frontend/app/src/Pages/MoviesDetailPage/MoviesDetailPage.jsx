// src/Pages/MoviesDetailPage/MoviesDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { Button } from '../../components/atoms/Button/Button';
import { PageLayout } from '../../components/templates/PageLayout/PageLayout';
import { AppHeader } from '../../components/organisms/AppHeader/AppHeader';

// Servicios
import { getMovieByIdService } from '../../services/Movies/getMovieByIdService';

function MoviesDetailPage() {
    const { id } = useParams(); // ID de la película
    const navigate = useNavigate();
    const { navigateToPlayer } = useMovieNavigation();
    
    // Estados
    const [movie, setMovie] = useState(null);
    const [user, setUser] = useState(null);
    
    // Estados de carga
    const [loadingMovie, setLoadingMovie] = useState(true);
    
    // Estados de error
    const [movieError, setMovieError] = useState(null);

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

            navigate('/login');
        }
    }, [navigate]);

    // ===== CARGAR DATOS DE LA PELÍCULA =====
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoadingMovie(true);
                setMovieError(null);
                
                const response = await getMovieByIdService(id);
                
                if (response.success) {
                    setMovie(response.data);

                } else {
                    throw new Error(response.message || 'Error al cargar la película');
                }
            } catch (error) {

                setMovieError(error.message);
            } finally {
                setLoadingMovie(false);
            }
        };

        if (id && user) {
            fetchMovie();
        }
    }, [id, user]);

    // ===== HANDLERS =====
    const handlePlayMovie = () => {

        // Verificar si tiene file_hash
        if (!movie.file_hash) {

            alert('Error: La película no tiene archivo de video asociado. Verifica que la película esté correctamente subida.');
            return;
        }
        
        // Transformar datos de la película para que funcione con navigateToPlayer
        const movieData = {
            ...movie,
            _original: movie,
            type: 'movie',
            // Asegurar que tenga los campos necesarios
            file_hash: movie.file_hash,
            available_resolutions: movie.available_resolutions || [480, 720, 1080]
        };

        navigateToPlayer(movieData);
    };

    const handleBackToMain = () => {
        navigate('/main-page');
    };

    const handleLogout = async () => {
        try {
            // Limpiar sesión y redirigir
            sessionStorage.removeItem('sessionUser');
            navigate('/login');
        } catch (error) {

            window.location.href = '/login';
        }
    };

    const handleRetry = () => {
        window.location.reload();
    };

    // ===== VERIFICAR ERRORES =====
    if (movieError) {
        return (
            <PageLayout
                header={
                    <AppHeader
                        appTitle="🎬 StreamApp"
                        onTitleClick={handleBackToMain}
                        userName={user?.userName || user?.username || user?.name || user?.email || 'Usuario'}
                        showSearch={false}
                        onLogout={handleLogout}
                        variant="default"
                        size="lg"
                    />
                }
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '50vh',
                        textAlign: 'center',
                        padding: 'var(--space-xl)'
                    }}
                >
                    <div>
                        <h2>Error al cargar la película</h2>
                        <p
                            style={{
                                color: 'var(--text-secondary)',
                                marginBottom: 'var(--space-lg)'
                            }}
                        >
                            {movieError}
                        </p>
                        <Button variant="primary" onClick={handleRetry}>
                            Reintentar
                        </Button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    // ===== LOADING =====
    if (loadingMovie) {
        return (
            <PageLayout
                header={
                    <AppHeader
                        appTitle="🎬 StreamApp"
                        onTitleClick={handleBackToMain}
                        userName={user?.userName || user?.username || user?.name || user?.email || 'Usuario'}
                        showSearch={false}
                        onLogout={handleLogout}
                        variant="default"
                        size="lg"
                    />
                }
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '50vh',
                        fontSize: 'var(--font-size-lg)'
                    }}
                >
                    Cargando película...
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            header={
                <AppHeader
                    appTitle="🎬 StreamApp"
                    onTitleClick={handleBackToMain}
                    userName={user?.userName || user?.username || user?.name || user?.email || 'Usuario'}
                    showSearch={false}
                    showBackButton
                    onBackClick={handleBackToMain}
                    onLogout={handleLogout}
                    variant="default"
                    size="lg"
                />
            }
        >
            <div style={{ padding: 'var(--space-lg)' }}>
                {/* ===== INFORMACIÓN DE LA PELÍCULA ===== */}
                {movie && (
                    <div style={{ 
                        marginBottom: 'var(--space-xl)',
                        display: 'flex',
                        gap: 'var(--space-lg)',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap'
                    }}>
                        <img
                            src={movie.cover_image ? `${import.meta.env.VITE_CDN_URL || 'http://localhost:8082'}/covers/${movie.cover_image}/cover.jpg` : 'https://via.placeholder.com/300x450?text=Película'}
                            alt={`Carátula de ${movie.title}`}
                            style={{
                                width: '200px',
                                height: '300px',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x450?text=Película';
                            }}
                        />
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <h1 style={{ 
                                fontSize: 'var(--font-size-2xl)', 
                                marginBottom: 'var(--space-md)',
                                color: 'var(--text-primary)'
                            }}>
                                {movie.title}
                            </h1>
                            <p style={{ 
                                color: 'var(--text-secondary)', 
                                marginBottom: 'var(--space-md)',
                                lineHeight: 'var(--line-height-relaxed)',
                                fontSize: 'var(--font-size-md)'
                            }}>
                                {movie.description || 'Sin descripción disponible'}
                            </p>
                            
                            {/* Información adicional */}
                            <div style={{ 
                                display: 'flex', 
                                gap: 'var(--space-md)', 
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                marginBottom: 'var(--space-lg)'
                            }}>
                                {movie.release_year && (
                                    <span style={{ 
                                        background: 'var(--bg-accent)', 
                                        padding: 'var(--space-xs) var(--space-sm)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 'var(--font-size-sm)'
                                    }}>
                                        {movie.release_year}
                                    </span>
                                )}
                                {movie.category_id && (
                                    <span style={{ 
                                        background: 'var(--bg-primary-light)', 
                                        color: 'var(--color-primary)',
                                        padding: 'var(--space-xs) var(--space-sm)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 'var(--font-size-sm)'
                                    }}>
                                        Categoría {movie.category_id}
                                    </span>
                                )}
                                {movie.rating && (
                                    <span style={{ 
                                        background: 'var(--bg-success-light)', 
                                        color: 'var(--color-success)',
                                        padding: 'var(--space-xs) var(--space-sm)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 'var(--font-size-sm)',
                                        fontWeight: 'var(--font-weight-semibold)'
                                    }}>
                                        ⭐ {movie.rating}
                                    </span>
                                )}
                                {movie.video_duration && (
                                    <span style={{ 
                                        background: 'var(--bg-secondary)', 
                                        color: 'var(--text-secondary)',
                                        padding: 'var(--space-xs) var(--space-sm)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 'var(--font-size-sm)'
                                    }}>
                                        🕐 {typeof movie.video_duration === 'string' ? movie.video_duration : 'N/A'}
                                    </span>
                                )}
                            </div>

                            {/* Botón de reproducir */}
                            <div style={{ 
                                display: 'flex', 
                                gap: 'var(--space-md)', 
                                flexWrap: 'wrap' 
                            }}>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    leftIcon="▶️"
                                    onClick={handlePlayMovie}
                                    disabled={!movie.file_hash}
                                >
                                    {movie.file_hash ? 'Reproducir Película' : 'No disponible'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    leftIcon="📋"
                                    onClick={handleBackToMain}
                                >
                                    Volver a Películas
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}

export { MoviesDetailPage };