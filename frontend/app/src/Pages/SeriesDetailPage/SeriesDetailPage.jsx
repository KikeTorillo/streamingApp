// src/Pages/SeriesDetail/SeriesDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { Button } from '../../components/atoms/Button/Button';
import { AppHeader } from '../../components/organisms/AppHeader/AppHeader';
import { EpisodeListItem } from '../../components/molecules/EpisodeListItem/EpisodeListItem';
import { SeasonSelector } from '../../components/molecules/SeasonSelector/SeasonSelector';
import { EmptyState } from '../../components/molecules/EmptyState/EmptyState';
import { Container } from '../../components/atoms/Container/Container';
import { Typography } from '../../components/atoms/Typography/Typography';
import { FlexContainer } from '../../components/atoms/FlexContainer/FlexContainer';
import { ContentImage } from '../../components/atoms/ContentImage/ContentImage';

// Servicios (necesitarás crearlos)
import { getSerieByIdService } from '../../services/Series/getSerieByIdService';
import { getEpisodesBySerieService } from '../../services/Episodes/getEpisodesBySerieService';

function SeriesDetailPage() {
    const { id } = useParams(); // ID de la serie
    const navigate = useNavigate();
    const { navigateToPlayer, navigateToPlayerWithPlaylist } = useMovieNavigation();
    
    // Estados
    const [serie, setSerie] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [user, setUser] = useState(null);
    
    // Estados de carga
    const [, setLoadingSerie] = useState(true);
    const [loadingEpisodes, setLoadingEpisodes] = useState(true);
    
    // Estados de error
    const [serieError, setSerieError] = useState(null);
    const [episodesError, setEpisodesError] = useState(null);

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

    // ===== CARGAR DATOS DE LA SERIE =====
    useEffect(() => {
        const fetchSerie = async () => {
            try {
                setLoadingSerie(true);
                setSerieError(null);
                
                const response = await getSerieByIdService(id);
                
                if (response.success) {
                    setSerie(response.data);

                } else {
                    throw new Error(response.message || 'Error al cargar la serie');
                }
            } catch (error) {
                setSerieError(error.message);
            } finally {
                setLoadingSerie(false);
            }
        };

        if (id && user) {
            fetchSerie();
        }
    }, [id, user]);

    // ===== CARGAR EPISODIOS =====
    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setLoadingEpisodes(true);
                setEpisodesError(null);
                
                const response = await getEpisodesBySerieService(id);
                
                if (response.success) {
                    setEpisodes(response.data || []);
                } else {
                    throw new Error(response.message || 'Error al cargar episodios');
                }
            } catch (error) {
                setEpisodesError(error.message);
            } finally {
                setLoadingEpisodes(false);
            }
        };

        if (id && user) {
            fetchEpisodes();
        }
    }, [id, user]);

    // ===== HANDLERS =====
    const handlePlayEpisode = (episode) => {

        // Verificar si tiene file_hash
        if (!episode.file_hash) {

            alert('Error: El episodio no tiene archivo de video asociado. Verifica que el episodio esté correctamente subido.');
            return;
        }
        
        // Transformar datos del episodio para que funcione con navigateToPlayer
        const episodeData = {
            ...episode,
            _original: episode,
            type: 'episode',
            // Asegurar que tenga los campos necesarios
            file_hash: episode.file_hash,
            available_resolutions: episode.available_resolutions || [480, 720, 1080]
        };
        
        // ===== NUEVA: USAR PLAYLIST PARA CONTINUACIÓN AUTOMÁTICA =====
        if (episodes && episodes.length > 1) {

            navigateToPlayerWithPlaylist(episodeData, episodes, id);
        } else {

            navigateToPlayer(episodeData);
        }
    };

    const handleEpisodeClick = (episode) => {
        // Por ahora, mismo comportamiento que play
        handlePlayEpisode(episode);
    };

    const handleBackToSeries = () => {
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

    // ===== PREPARAR DATOS DE TEMPORADAS PARA SEASONELECTOR =====
    const episodesBySeason = episodes.reduce((acc, episode) => {
        const season = episode.season || 1;
        if (!acc[season]) acc[season] = [];
        acc[season].push(episode);
        return acc;
    }, {});

    const seasonsData = Object.keys(episodesBySeason)
        .map(Number)
        .sort((a, b) => a - b)
        .map(seasonNumber => ({
            number: seasonNumber,
            episodeCount: episodesBySeason[seasonNumber].length,
            title: undefined // Las series no tienen títulos de temporada por defecto
        }));

    const currentSeasonEpisodes = episodesBySeason[selectedSeason] || [];
    
    // ✅ DEBUGGING: Verificar datos antes del render

    // ===== TRANSFORMAR EPISODIOS PARA EPISODELISTITEM =====
    const transformEpisodeForList = (episode) => {
        // ✅ FORMATEAR DURACIÓN correctamente
        let durationText = '45:00';
        if (episode.video_duration) {
            if (typeof episode.video_duration === 'object' && episode.video_duration.seconds) {
                const totalSeconds = episode.video_duration.seconds;
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            } else if (typeof episode.video_duration === 'string') {
                durationText = episode.video_duration;
            }
        }

        // ✅ FORMATEAR URL DE THUMBNAIL correctamente
        const coverUrl = episode.cover_image
            ? `${import.meta.env.VITE_CDN_URL || 'http://localhost:8082'}/covers/${episode.cover_image}/cover.jpg`
            : serie?.cover_image
                ? `${import.meta.env.VITE_CDN_URL || 'http://localhost:8082'}/covers/${serie.cover_image}/cover.jpg`
                : 'https://via.placeholder.com/320x180?text=Episodio';

        return {
            ...episode, // Mantener todos los datos originales
            title: episode.title || `Episodio ${episode.episode_number}`,
            cover: coverUrl,
            duration: durationText,
            rating: episode.rating || serie?.rating
        };
    };

    // ===== VERIFICAR ERRORES =====
    if (serieError) {
        return (
            <>
            <AppHeader
                        appTitle="🎬 StreamApp"
                        onTitleClick={handleBackToSeries}
                        userName={user?.userName || user?.username || user?.name || user?.email || 'Usuario'}
                        showSearch={false}
                        onLogout={handleLogout}
                        variant="primary"
                        size="lg"
                    />
                <FlexContainer justify="center" align="center">
                    <Container size="sm" textAlign="center">
                        <Typography variant="h2" size="lg" weight="semibold" color="danger">Error al cargar la serie</Typography>
                        <Typography variant="body" size="md" color="muted">
                            {serieError}
                        </Typography>
                        <Button variant="primary" onClick={handleRetry}>
                            Reintentar
                        </Button>
                    </Container>
                </FlexContainer>
            </>
        );
    }

    return (
        <>
        <AppHeader
                    appTitle="🎬 StreamApp"
                    onTitleClick={handleBackToSeries}
                    userName={user?.userName || user?.username || user?.name || user?.email || 'Usuario'}
                    showSearch={false}
                    showBackButton
                    onBackClick={handleBackToSeries}
                    onLogout={handleLogout}
                    variant="primary"
                    size="lg"
                />
            <Container size="lg" padding="lg">
                    {/* ===== INFORMACIÓN DE LA SERIE ===== */}
                    {serie && (
                        <FlexContainer 
                            spacing="lg"
                            align="start"
                            wrap="wrap"
                        >
                            <ContentImage
                                src={serie.cover_image}
                                alt={`Carátula de ${serie.title}`}
                                aspectRatio="2/3"
                                size="lg"
                                rounded="lg"
                                shadow="lg"
                                contentType="series"
                                placeholder="film"
                                showFallback={true}
                                fallbackUrl="https://via.placeholder.com/300x450?text=Serie"
                            />
                            <FlexContainer flex="1" minWidth="300px" direction="column">
                                <Typography 
                                    variant="h1" 
                                    size="4xl" 
                                    weight="bold"
                                >
                                    {serie.title}
                                </Typography>
                                <Typography 
                                    variant="body" 
                                    size="md" 
                                    color="muted"
                                >
                                    {serie.description || 'Sin descripción disponible'}
                                </Typography>
                                <FlexContainer 
                                    spacing="md"
                                    wrap="wrap"
                                    align="center"
                                >
                                    <Typography 
                                        variant="span" 
                                        size="sm" 
                                        weight="medium"
                                    >
                                        {serie.release_year}
                                    </Typography>
                                    <Typography 
                                        variant="span" 
                                        size="sm" 
                                        weight="medium"
                                    >
                                        Categoría {serie.category_id}
                                    </Typography>
                                    {serie.rating && (
                                        <Typography 
                                            variant="span" 
                                            size="sm" 
                                            weight="semibold"
                                        >
                                            ⭐ {serie.rating}
                                        </Typography>
                                    )}
                                </FlexContainer>
                            </FlexContainer>
                        </FlexContainer>
                    )}

                    {/* ===== SELECTOR DE TEMPORADAS ===== */}
                    {seasonsData.length > 1 && (
                        <Container>
                            <SeasonSelector
                                seasons={seasonsData}
                                selectedSeason={selectedSeason}
                                onSeasonChange={setSelectedSeason}
                                showEpisodeCount={true}
                                variant="normal"
                                size="md"
                            />
                        </Container>
                    )}

                    {/* ===== LISTA DE EPISODIOS ===== */}
                    <Container>
                        <Typography 
                            variant="h2" 
                            size="xl" 
                            weight="semibold"
                        >
                            🎬 Episodios{seasonsData.length > 1 ? ` - Temporada ${selectedSeason}` : ''}
                        </Typography>

                        {loadingEpisodes ? (
                            <FlexContainer 
                                justify="center"
                                align="center"
                            >
                                <Typography variant="body" size="md" color="muted">Cargando episodios...</Typography>
                            </FlexContainer>
                        ) : episodesError ? (
                            <EmptyState
                                title="Error al cargar episodios"
                                description={episodesError}
                                action={
                                    <Button variant="outline" onClick={handleRetry}>
                                        Reintentar
                                    </Button>
                                }
                            />
                        ) : currentSeasonEpisodes.length === 0 ? (
                            <EmptyState
                                title="No hay episodios disponibles"
                                description={
                                    seasonsData.length > 1 
                                        ? `No se encontraron episodios para la temporada ${selectedSeason}`
                                        : "Esta serie aún no tiene episodios disponibles"
                                }
                                action={
                                    <Button variant="outline" onClick={handleBackToSeries}>
                                        Volver a series
                                    </Button>
                                }
                            />
                        ) : (
                            <FlexContainer 
                                direction="column"
                                spacing="sm"
                            >
                                {currentSeasonEpisodes.map(episode => {
                                    const transformedEpisode = transformEpisodeForList(episode);

                                    return (
                                        <EpisodeListItem
                                            key={`episode-${episode.id}`}
                                            episode={transformedEpisode}
                                            onClick={() => handleEpisodeClick(episode)}
                                            showThumbnail={true}
                                            showDescription={true}
                                            showRating={true}
                                            variant="normal"
                                        />
                                    );
                                })}
                            </FlexContainer>
                        )}
                    </Container>
                </Container>
            </>
        );
}

export { SeriesDetailPage };