import { useState, useRef } from 'react';

/**
 * Hook personalizado para manejar todo el estado del VideoPlayer
 * Centraliza todas las variables de estado y proporciona métodos para actualizarlas
 * 
 * NOTA: Este hook será refactorizado gradualmente en las siguientes fases.
 * Por ahora se mueve a /hooks/ para seguir el patrón del proyecto.
 */
export const useVideoPlayerState = () => {
  // ===== ESTADO DE SUBTÍTULOS =====
  const [subtitleOffset, setSubtitleOffset] = useState(0); // en segundos
  const [showOffsetIndicator, setShowOffsetIndicator] = useState(false);

  // ===== ESTADO DE CONTENIDO =====
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== ESTADO DE REPRODUCTOR =====
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('Auto');
  const [bufferPercentage, setBufferPercentage] = useState(0);

  // ===== ESTADO DE PLAYLIST =====
  const [playlistData, setPlaylistData] = useState(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  // ===== REFERENCIAS DEL PLAYER =====
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const overlayContainerRef = useRef(null);
  const overlayRef = useRef(null);

  // ===== REFERENCIA DE ANALYTICS =====
  const analyticsRef = useRef({
    watchTime: 0,
    lastTime: 0,
    rebufferCount: 0,
    qualityChanges: 0,
    sessionStartTime: Date.now()
  });

  // ===== MÉTODOS DE ACTUALIZACIÓN AGRUPADOS =====
  
  /**
   * Métodos para manejo de subtítulos
   */
  const subtitleActions = {
    setOffset: setSubtitleOffset,
    showIndicator: () => {
      setShowOffsetIndicator(true);
      setTimeout(() => setShowOffsetIndicator(false), 2000);
    },
    hideIndicator: () => setShowOffsetIndicator(false),
    adjustOffset: (adjustment) => {
      const newOffset = subtitleOffset + adjustment;
      setSubtitleOffset(newOffset);
      setShowOffsetIndicator(true);
      setTimeout(() => setShowOffsetIndicator(false), 2000);
      return newOffset;
    },
    resetOffset: () => {
      setSubtitleOffset(0);
      setShowOffsetIndicator(true);
      setTimeout(() => setShowOffsetIndicator(false), 2000);
    }
  };

  /**
   * Métodos para manejo de contenido
   */
  const contentActions = {
    setMovieData,
    setLoading,
    setError,
    clearError: () => setError(null),
    reset: () => {
      setMovieData(null);
      setLoading(true);
      setError(null);
    }
  };

  /**
   * Métodos para manejo del reproductor
   */
  const playerActions = {
    setIsPlaying,
    setCurrentQuality,
    setBufferPercentage,
    updateAnalytics: (updates) => {
      analyticsRef.current = {
        ...analyticsRef.current,
        ...updates
      };
    },
    resetAnalytics: () => {
      analyticsRef.current = {
        watchTime: 0,
        lastTime: 0,
        rebufferCount: 0,
        qualityChanges: 0,
        sessionStartTime: Date.now()
      };
    }
  };

  /**
   * Métodos para manejo de playlist
   */
  const playlistActions = {
    setPlaylistData,
    setCurrentEpisodeIndex,
    goToNextEpisode: () => {
      if (playlistData && currentEpisodeIndex < playlistData.episodes.length - 1) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        return currentEpisodeIndex + 1;
      }
      return currentEpisodeIndex;
    },
    goToPreviousEpisode: () => {
      if (currentEpisodeIndex > 0) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        return currentEpisodeIndex - 1;
      }
      return currentEpisodeIndex;
    },
    goToEpisode: (index) => {
      if (playlistData && index >= 0 && index < playlistData.episodes.length) {
        setCurrentEpisodeIndex(index);
        return index;
      }
      return currentEpisodeIndex;
    },
    hasNextEpisode: () => {
      return playlistData && currentEpisodeIndex < playlistData.episodes.length - 1;
    },
    hasPreviousEpisode: () => {
      return currentEpisodeIndex > 0;
    }
  };

  /**
   * Métodos de utilidad
   */
  const utils = {
    getCurrentEpisode: () => {
      if (playlistData && playlistData.episodes[currentEpisodeIndex]) {
        return playlistData.episodes[currentEpisodeIndex];
      }
      return null;
    },
    getCurrentHash: () => {
      const currentEpisode = utils.getCurrentEpisode();
      return currentEpisode ? currentEpisode.file_hash : null;
    },
    getCurrentResolutions: () => {
      const currentEpisode = utils.getCurrentEpisode();
      return currentEpisode?.available_resolutions?.sort((a, b) => a - b).join(',') || null;
    },
    isPlaylistMode: () => {
      return playlistData && playlistData.episodes && playlistData.episodes.length > 0;
    },
    getPlaylistProgress: () => {
      if (!playlistData) return { current: 0, total: 0, percentage: 0 };
      
      return {
        current: currentEpisodeIndex + 1,
        total: playlistData.episodes.length,
        percentage: ((currentEpisodeIndex + 1) / playlistData.episodes.length) * 100
      };
    }
  };

  // ===== ESTADO COMPLETO PARA DEBUG =====
  const getCompleteState = () => ({
    subtitle: {
      offset: subtitleOffset,
      showIndicator: showOffsetIndicator
    },
    content: {
      movieData,
      loading,
      error
    },
    player: {
      isPlaying,
      currentQuality,
      bufferPercentage,
      analytics: analyticsRef.current
    },
    playlist: {
      data: playlistData,
      currentIndex: currentEpisodeIndex,
      progress: utils.getPlaylistProgress()
    },
    refs: {
      video: videoRef.current,
      player: playerRef.current,
      overlayContainer: overlayContainerRef.current,
      overlay: overlayRef.current
    }
  });

  return {
    // Estado actual
    state: {
      // Subtítulos
      subtitleOffset,
      showOffsetIndicator,
      
      // Contenido
      movieData,
      loading,
      error,
      
      // Reproductor
      isPlaying,
      currentQuality,
      bufferPercentage,
      
      // Playlist
      playlistData,
      currentEpisodeIndex
    },
    
    // Referencias
    refs: {
      videoRef,
      playerRef,
      overlayContainerRef,
      overlayRef,
      analyticsRef
    },
    
    // Métodos de acción agrupados
    actions: {
      subtitle: subtitleActions,
      content: contentActions,
      player: playerActions,
      playlist: playlistActions
    },
    
    // Utilidades
    utils,
    
    // Debug
    getCompleteState
  };
};