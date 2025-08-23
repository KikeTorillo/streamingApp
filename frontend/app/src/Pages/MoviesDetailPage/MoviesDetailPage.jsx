// src/Pages/MoviesDetailPage/MoviesDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { Button } from '../../components/atoms/Button/Button';
import { PageLayout } from '../../components/templates/PageLayout/PageLayout';
import { AppHeader } from '../../components/organisms/AppHeader/AppHeader';
import { FlexContainer } from '../../components/atoms/FlexContainer/FlexContainer';
import { Typography } from '../../components/atoms/Typography/Typography';
import { Container } from '../../components/atoms/Container/Container';

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
        } catch {

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
                console.error('Error al cargar película:', error);
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
        } catch {

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
                        variant="primary"
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
                        <Typography variant="h2" size="lg" weight="semibold" color="danger">Error al cargar la película</Typography>
                        <Typography 
                            variant="body" 
                            size="md" 
                            color="muted"
                            style={{
                                marginBottom: 'var(--space-lg)'
                            }}
                        >
                            {movieError}
                        </Typography>
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
                        variant="primary"
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
                    <Typography variant="body" size="lg" color="muted">Cargando película...</Typography>
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
                    variant="primary"
                    size="lg"
                />
            }
        >
            <Container size="lg"  padding="lg">
                {/* ===== INFORMACIÓN DE LA PELÍCULA ===== */}
                {movie && (
                    <FlexContainer 
                        spacing="lg"
                        align="start"
                        wrap="wrap"
                        style={{ marginBottom: 'var(--space-xl)' }}
                    >
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
                            <Typography 
                                variant="h1" 
                                size="2xl"
                                style={{ marginBottom: 'var(--space-md)' }}
                            >
                                {movie.title}
                            </Typography>
                            <Typography 
                                variant="body" 
                                size="md" 
                                color="muted"
                                style={{ 
                                    marginBottom: 'var(--space-md)',
                                    lineHeight: 'var(--line-height-relaxed)'
                                }}
                            >
                                {movie.description || 'Sin descripción disponible'}
                            </Typography>
                            
                            {/* Información adicional */}
                            <div style={{ 
                                display: 'flex', 
                                spacing: 'var(--space-md)', 
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                marginBottom: 'var(--space-lg)'
                            }}>
                                {movie.release_year && (
                                    <Typography 
                                        variant="span" 
                                        size="sm" 
                                        weight="medium"
                                        style={{ 
                                            background: 'var(--bg-accent)', 
                                            padding: 'var(--space-xs) var(--space-sm)',
                                            borderRadius: 'var(--radius-sm)'
                                        }}
                                    >
                                        {movie.release_year}
                                    </Typography>
                                )}
                                {movie.category_id && (
                                    <Typography 
                                        variant="span" 
                                        size="sm" 
                                        weight="medium"
                                        style={{ 
                                            background: 'var(--bg-primary-light)', 
                                            color: 'var(--color-primary)',
                                            padding: 'var(--space-xs) var(--space-sm)',
                                            borderRadius: 'var(--radius-sm)'
                                        }}
                                    >
                                        Categoría {movie.category_id}
                                    </Typography>
                                )}
                                {movie.rating && (
                                    <Typography 
                                        variant="span" 
                                        size="sm" 
                                        weight="semibold"
                                        style={{ 
                                            background: 'var(--bg-success-light)', 
                                            color: 'var(--color-success)',
                                            padding: 'var(--space-xs) var(--space-sm)',
                                            borderRadius: 'var(--radius-sm)'
                                        }}
                                    >
                                        ⭐ {movie.rating}
                                    </Typography>
                                )}
                                {movie.video_duration && (
                                    <Typography 
                                        variant="span" 
                                        size="sm" 
                                        weight="medium"
                                        style={{ 
                                            background: 'var(--bg-secondary)', 
                                            color: 'var(--text-secondary)',
                                            padding: 'var(--space-xs) var(--space-sm)',
                                            borderRadius: 'var(--radius-sm)'
                                        }}
                                    >
                                        🕐 {typeof movie.video_duration === 'string' ? movie.video_duration : 'N/A'}
                                    </Typography>
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
                                    leftIcon="play"
                                    onClick={handlePlayMovie}
                                    disabled={!movie.file_hash}
                                >
                                    {movie.file_hash ? 'Reproducir Película' : 'No disponible'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    leftIcon="arrow-left"
                                    onClick={handleBackToMain}
                                >
                                    Volver a Películas
                                </Button>
                            </div>
                        </div>
                    </FlexContainer>
                )}
            </Container>
        </PageLayout>
    );
}

export { MoviesDetailPage };