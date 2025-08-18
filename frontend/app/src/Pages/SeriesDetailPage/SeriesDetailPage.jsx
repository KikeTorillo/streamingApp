// src/Pages/SeriesDetail/SeriesDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieNavigation } from '../../hooks/useMovieNavigation';
import { Button } from '../../components/atoms/Button/Button';
import { PageLayout } from '../../components/templates/PageLayout/PageLayout';
import { AppHeader } from '../../components/organisms/AppHeader/AppHeader';
import { EpisodeListItem } from '../../components/molecules/EpisodeListItem/EpisodeListItem';
import { SeasonSelector } from '../../components/molecules/SeasonSelector/SeasonSelector';
import { EmptyState } from '../../components/molecules/EmptyState/EmptyState';
import { Container } from '../../components/atoms/Container/Container';
import { Typography } from '../../components/atoms/Typography/Typography';

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
            <PageLayout
                header={
                    <AppHeader
                        appTitle="🎬 StreamApp"
                        onTitleClick={handleBackToSeries}
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
                        <Typography variant="h2" size="lg" weight="semibold" color="danger">Error al cargar la serie</Typography>
                        <Typography 
                            variant="body" 
                            size="md" 
                            color="muted"
                            style={{
                                marginBottom: 'var(--space-lg)'
                            }}
                        >
                            {serieError}
                        </Typography>
                        <Button variant="primary" onClick={handleRetry}>
                            Reintentar
                        </Button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            header={
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
            }
        >
            <Container size="lg" padding="lg">
                    {/* ===== INFORMACIÓN DE LA SERIE ===== */}
                    {serie && (
                        <div style={{ 
                            marginBottom: 'var(--space-xl)',
                            display: 'flex',
                            gap: 'var(--space-lg)',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap'
                        }}>
                            <img
                                src={serie.cover_image ? `${import.meta.env.VITE_CDN_URL || 'http://localhost:8082'}/covers/${serie.cover_image}/cover.jpg` : 'https://via.placeholder.com/300x450?text=Serie'}
                                alt={`Carátula de ${serie.title}`}
                                style={{
                                    width: '200px',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: 'var(--shadow-lg)'
                                }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x450?text=Serie';
                                }}
                            />
                            <div style={{ flex: '1', minWidth: '300px' }}>
                                <Typography 
                                    variant="h1" 
                                    size="2xl" 
                                    weight="bold"
                                    style={{ 
                                        marginBottom: 'var(--space-md)'
                                    }}
                                >
                                    {serie.title}
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
                                    {serie.description || 'Sin descripción disponible'}
                                </Typography>
                                <div style={{ 
                                    display: 'flex', 
                                    gap: 'var(--space-md)', 
                                    flexWrap: 'wrap',
                                    alignItems: 'center'
                                }}>
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
                                        {serie.release_year}
                                    </Typography>
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
                                        Categoría {serie.category_id}
                                    </Typography>
                                    {serie.rating && (
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
                                            ⭐ {serie.rating}
                                        </Typography>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== SELECTOR DE TEMPORADAS ===== */}
                    {seasonsData.length > 1 && (
                        <div style={{ marginBottom: 'var(--space-xl)' }}>
                            <SeasonSelector
                                seasons={seasonsData}
                                selectedSeason={selectedSeason}
                                onSeasonChange={setSelectedSeason}
                                showEpisodeCount={true}
                                variant="normal"
                                size="md"
                            />
                        </div>
                    )}

                    {/* ===== LISTA DE EPISODIOS ===== */}
                    <div style={{ marginBottom: 'var(--space-xl)' }}>
                        <Typography 
                            variant="h2" 
                            size="xl" 
                            weight="semibold"
                            style={{ 
                                marginBottom: 'var(--space-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)'
                            }}
                        >
                            🎬 Episodios{seasonsData.length > 1 ? ` - Temporada ${selectedSeason}` : ''}
                        </Typography>

                        {loadingEpisodes ? (
                            <div style={{ 
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '200px'
                            }}>
                                <Typography variant="body" size="md" color="muted">Cargando episodios...</Typography>
                            </div>
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
                            <div style={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-sm)'
                            }}>
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
                            </div>
                        )}
                    </div>
                </Container>
            </PageLayout>
        );
}

export { SeriesDetailPage };