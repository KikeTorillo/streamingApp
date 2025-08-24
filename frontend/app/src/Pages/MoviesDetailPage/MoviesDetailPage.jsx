// src/Pages/MoviesDetailPage/MoviesDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { Button } from '../../components/atoms/Button/Button';
import { AppHeader } from '../../components/organisms/AppHeader/AppHeader';
import { FlexContainer } from '../../components/atoms/FlexContainer/FlexContainer';
import { Typography } from '../../components/atoms/Typography/Typography';
import { Container } from '../../components/atoms/Container/Container';
import { ContentImage } from '../../components/atoms/ContentImage/ContentImage';

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
            <>
                <AppHeader
                        appTitle="🎬 StreamApp"
                        onTitleClick={handleBackToMain}
                        userName={user?.userName || user?.username || user?.name || user?.email || 'Usuario'}
                        showSearch={false}
                        onLogout={handleLogout}
                        variant="primary"
                        size="lg"
                    />
                <FlexContainer justify="center" align="center">
                    <Container size="sm" textAlign="center">
                        <Typography variant="h2" size="lg" weight="semibold" color="danger">Error al cargar la película</Typography>
                        <Typography variant="body" size="md" color="muted">
                            {movieError}
                        </Typography>
                        <Button variant="primary" onClick={handleRetry}>
                            Reintentar
                        </Button>
                    </Container>
                </FlexContainer>
            </>
        );
    }

    // ===== LOADING =====
    if (loadingMovie) {
        return (
            <>
            <AppHeader
                        appTitle="🎬 StreamApp"
                        onTitleClick={handleBackToMain}
                        userName={user?.userName || user?.username || user?.name || user?.email || 'Usuario'}
                        showSearch={false}
                        onLogout={handleLogout}
                        variant="primary"
                        size="lg"
                    />
                <FlexContainer justify="center" align="center">
                    <Typography variant="body" size="lg" color="muted">Cargando película...</Typography>
                </FlexContainer>
            </>
        );
    }

    return (
        <>
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
            <Container size="lg"  padding="lg">
                {/* ===== INFORMACIÓN DE LA PELÍCULA ===== */}
                {movie && (
                    <FlexContainer 
                        spacing="lg"
                        align="start"
                        wrap="wrap"
                    >
                        <ContentImage
                            src={movie.cover_image}
                            alt={`Carátula de ${movie.title}`}
                            aspectRatio="2/3"
                            size="lg"
                            rounded="lg"
                            shadow="lg"
                            contentType="movie"
                            placeholder="film"
                            showFallback={true}
                            fallbackUrl="https://via.placeholder.com/300x450?text=Película"
                        />
                        <FlexContainer flex="1" minWidth="300px" direction="column">
                            <Typography 
                                variant="h1" 
                                size="4xl"
                            >
                                {movie.title}
                            </Typography>
                            <Typography 
                                variant="body" 
                                size="md" 
                                color="muted"
                            >
                                {movie.description || 'Sin descripción disponible'}
                            </Typography>
                            
                            {/* Información adicional */}
                            <FlexContainer 
                                spacing="md"
                                wrap="wrap"
                                align="center"
                            >
                                {movie.release_year && (
                                    <Typography 
                                        variant="span" 
                                        size="sm" 
                                        weight="medium"
                                    >
                                        {movie.release_year}
                                    </Typography>
                                )}
                                {movie.category_id && (
                                    <Typography 
                                        variant="span" 
                                        size="sm" 
                                        weight="medium"
                                    >
                                        Categoría {movie.category_id}
                                    </Typography>
                                )}
                                {movie.rating && (
                                    <Typography 
                                        variant="span" 
                                        size="sm" 
                                        weight="semibold"
                                    >
                                        ⭐ {movie.rating}
                                    </Typography>
                                )}
                                {movie.video_duration && (
                                    <Typography 
                                        variant="span" 
                                        size="sm" 
                                        weight="medium"
                                    >
                                        🕐 {typeof movie.video_duration === 'string' ? movie.video_duration : 'N/A'}
                                    </Typography>
                                )}
                            </FlexContainer>

                            {/* Botón de reproducir */}
                            <FlexContainer spacing="md" wrap="wrap">
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
                            </FlexContainer>
                        </FlexContainer>
                    </FlexContainer>
                )}
            </Container>
        </>
    );
}

export { MoviesDetailPage };