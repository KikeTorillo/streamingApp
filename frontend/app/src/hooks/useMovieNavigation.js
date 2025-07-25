// src/hooks/useMovieNavigation.js
import { useNavigate } from 'react-router-dom';

function formatResolutions(resolutions = []) {
  // ✅ No dividir por 10, usar las resoluciones tal como vienen
  return resolutions
    .sort((a, b) => a - b)
    .join(',');
}

function useMovieNavigation() {
  const navigate = useNavigate();

  const buildPlayerParams = (contentData, playlistData = null) => {
    const original = contentData?._original || contentData;
    const fileHash = original?.file_hash;
    const contentType = contentData?.type || 'movie';
    
    if (!fileHash) {
      console.error('[useMovieNavigation] Error: file_hash no encontrado en contentData:', original);
      return null;
    }
    
    const formatted = formatResolutions(original?.available_resolutions || []);
    
    let searchParams = `resolutions=${formatted}&type=${contentType}`;
    
    // ✅ NUEVA: Agregar parámetros de playlist para episodios
    if (playlistData && contentType === 'episode') {
      // Guardar playlist completa en sessionStorage para evitar URLs muy largas
      const playlistKey = `playlist_${playlistData.seriesId}_${Date.now()}`;
      sessionStorage.setItem(playlistKey, JSON.stringify(playlistData));
      
      searchParams += `&playlist=${playlistKey}`;
    }
    
    return { 
      path: `/player/${fileHash}`, 
      search: searchParams
    };
  };

  // ✅ NAVEGACIÓN AL REPRODUCTOR (películas y episodios)
  const navigateToPlayer = (contentData, playlistData = null) => {
    const params = buildPlayerParams(contentData, playlistData);
    
    if (!params) {
      console.error('[useMovieNavigation] No se pudo generar URL para:', contentData);
      return;
    }
    
    const { path, search } = params;
    const url = `${path}?${search}`;
    navigate(url);
  };

  // ✅ NUEVA: NAVEGACIÓN CON PLAYLIST DE EPISODIOS
  const navigateToPlayerWithPlaylist = (episode, allEpisodes, seriesId) => {
    // Encontrar índice del episodio actual
    const currentIndex = allEpisodes.findIndex(ep => ep.id === episode.id);
    
    if (currentIndex === -1) {
      console.error('[useMovieNavigation] Episodio no encontrado en la lista:', episode.id);
      return navigateToPlayer(episode);
    }
    
    const playlistData = {
      seriesId: seriesId,
      currentIndex: currentIndex,
      episodes: allEpisodes.map(ep => ({
        id: ep.id,
        title: ep.title || `Episodio ${ep.episode_number}`,
        file_hash: ep.file_hash,
        available_resolutions: ep.available_resolutions,
        season: ep.season,
        episode_number: ep.episode_number,
        duration: ep.video_duration,
        available_subtitles: ep.available_subtitles,
        _original: ep
      }))
    };
    
    return navigateToPlayer(episode, playlistData);
  };

  // ✅ NAVEGACIÓN A DETALLES (diferente para movies y series)
  const navigateToDetails = (contentData) => {
    const contentType = contentData.type;
    
    if (contentType === 'series') {
      navigate(`/series/${contentData.id}`);
    } else if (contentType === 'movie') {
      navigate(`/movies/${contentData.id}`);
    } else {
      console.warn('[useMovieNavigation] Unknown content type:', contentType);
      navigate(`/movies/${contentData.id}`);
    }
  };

  // ✅ NUEVA: NAVEGACIÓN ESPECÍFICA PARA SERIES
  const navigateToSeries = (seriesData) => {
    navigate(`/series/${seriesData.id}`);
  };

  // ✅ NUEVA: MANEJO INTELIGENTE DE CONTENT CARDS
  const handleContentCardClick = (contentData) => {
    const contentType = contentData.type;
    
    if (contentType === 'series') {
      // Series van a la página de episodios
      navigateToSeries(contentData);
    } else if (contentType === 'movie') {
      // Películas van a detalles (si existe) o directo al reproductor
      navigateToDetails(contentData);
    } else if (contentType === 'episode') {
      // Episodios van directo al reproductor
      navigateToPlayer(contentData);
    } else {
      console.warn('[useMovieNavigation] Unknown content type for click:', contentType);
      // Fallback: intentar ir a detalles
      navigateToDetails(contentData);
    }
  };

  // ✅ NUEVA: MANEJO INTELIGENTE DE BOTÓN PLAY
  const handleContentCardPlay = (contentData) => {
    const contentType = contentData.type;
    
    if (contentType === 'series') {
      // Series: ir a la página de episodios (no tiene play directo)
      navigateToSeries(contentData);
    } else {
      // Movies y episodes: ir al reproductor
      navigateToPlayer(contentData);
    }
  };

  return { 
    // Métodos básicos
    buildPlayerParams, 
    navigateToPlayer, 
    navigateToDetails,
    navigateToSeries,
    
    // Nuevos métodos para playlist
    navigateToPlayerWithPlaylist,
    
    // Métodos inteligentes para ContentCard
    handleContentCardClick,
    handleContentCardPlay
  };
}

export { useMovieNavigation };