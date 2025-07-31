// ===== VIDEO PLAYER CONTEXT - GESTIÓN CENTRALIZADA DEL REPRODUCTOR =====
// src/app/context/VideoPlayerContext.jsx

import { createContext, useContext, useState, useRef, useCallback } from 'react';

// ===== CONTEXTO =====
const VideoPlayerContext = createContext();

/**
 * VideoPlayerProvider - Proveedor del contexto del reproductor de video
 * 
 * Centraliza toda la lógica compartida del VideoPlayer:
 * - Estado del player (reproducción, calidad, buffer)
 * - Estado del contenido (película/episodio, playlist)
 * - Estado de subtítulos y sincronización
 * - Acciones principales compartidas entre componentes
 * - Referencias críticas del player
 */
function VideoPlayerProvider({ children }) {
  
  // ===== ESTADOS DEL PLAYER (compartidos entre componentes) =====
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    currentQuality: 'Auto',
    bufferPercentage: 0,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isLoading: false,
    hasError: false
  });
  
  // ===== ESTADOS DE CONTENIDO =====
  const [contentState, setContentState] = useState({
    movieData: null,
    playlistData: null,
    currentEpisodeIndex: 0,
    loading: true,
    error: null,
    contentType: 'movie'
  });
  
  // ===== ESTADOS DE SUBTÍTULOS =====
  const [subtitleState, setSubtitleState] = useState({
    subtitleOffset: 0,
    showOffsetIndicator: false,
    activeTrack: null,
    availableTracks: []
  });
  
  // ===== REFERENCIAS CRÍTICAS =====
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const analyticsRef = useRef({
    watchTime: 0,
    lastTime: 0,
    rebufferCount: 0,
    qualityChanges: 0,
    sessionStartTime: Date.now()
  });

  // ===== ACCIONES PRINCIPALES (que necesitan múltiples componentes) =====
  
  /**
   * Manejar skip (salto hacia adelante/atrás)
   */
  const handleSkip = useCallback((seconds, direction) => {
    if (!playerRef.current || playerRef.current.readyState() < 1) {
      return;
    }
    
    const currentTime = playerRef.current.currentTime();
    const duration = playerRef.current.duration();
    
    if (!duration || duration === Infinity) {
      return;
    }
    
    let newTime;
    if (direction === 'backward') {
      newTime = Math.max(0, currentTime - seconds);
    } else {
      newTime = Math.min(duration, currentTime + seconds);
    }
    
    try {
      playerRef.current.currentTime(newTime);

    } catch (error) {

    }
  }, []);

  /**
   * Toggle play/pause
   */
  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) return;
    
    if (playerRef.current.paused()) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  }, []);

  /**
   * Ajustar sincronización de subtítulos
   */
  const adjustSubtitleSync = useCallback((adjustment) => {
    const newOffset = subtitleState.subtitleOffset + adjustment;
    
    setSubtitleState(prev => ({
      ...prev,
      subtitleOffset: newOffset,
      showOffsetIndicator: true
    }));
    
    // Ocultar indicador después de 2 segundos
    setTimeout(() => {
      setSubtitleState(prev => ({
        ...prev,
        showOffsetIndicator: false
      }));
    }, 2000);

    return newOffset;
  }, [subtitleState.subtitleOffset]);

  /**
   * Resetear sincronización de subtítulos
   */
  const resetSubtitleSync = useCallback(() => {
    setSubtitleState(prev => ({
      ...prev,
      subtitleOffset: 0,
      showOffsetIndicator: true
    }));
    
    // Ocultar indicador después de 2 segundos
    setTimeout(() => {
      setSubtitleState(prev => ({
        ...prev,
        showOffsetIndicator: false
      }));
    }, 2000);

  }, []);

  /**
   * Actualizar estado del player
   */
  const updatePlayerState = useCallback((updates) => {
    setPlayerState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  /**
   * Actualizar estado del contenido
   */
  const updateContentState = useCallback((updates) => {
    setContentState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  /**
   * Actualizar estado de subtítulos
   */
  const updateSubtitleState = useCallback((updates) => {
    setSubtitleState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  /**
   * Actualizar analytics
   */
  const updateAnalytics = useCallback((updates) => {
    analyticsRef.current = {
      ...analyticsRef.current,
      ...updates
    };
  }, []);

  /**
   * Resetear analytics
   */
  const resetAnalytics = useCallback(() => {
    analyticsRef.current = {
      watchTime: 0,
      lastTime: 0,
      rebufferCount: 0,
      qualityChanges: 0,
      sessionStartTime: Date.now()
    };
  }, []);

  // ===== VALOR DEL CONTEXTO =====
  const contextValue = {
    // 📊 ESTADOS DEL PLAYER (compartidos entre componentes)
    playerState,
    
    // 🎬 ESTADOS DE CONTENIDO
    contentState,
    
    // 📝 ESTADOS DE SUBTÍTULOS
    subtitleState,
    
    // 🎮 ACCIONES PRINCIPALES (que necesitan múltiples componentes)
    actions: {
      handleSkip,
      togglePlayPause,
      adjustSubtitleSync,
      resetSubtitleSync,
      updatePlayerState,
      updateContentState,
      updateSubtitleState,
      updateAnalytics,
      resetAnalytics
    },
    
    // 🔗 REFERENCIAS CRÍTICAS
    playerRef,
    videoRef,
    analyticsRef
  };

  return (
    <VideoPlayerContext.Provider value={contextValue}>
      {children}
    </VideoPlayerContext.Provider>
  );
}

// ===== HOOK PERSONALIZADO =====
/**
 * useVideoPlayerContext - Hook para acceder al contexto del VideoPlayer
 * 
 * @returns {Object} Contexto completo del VideoPlayer
 */
function useVideoPlayerContext() {
  const context = useContext(VideoPlayerContext);
  
  if (!context) {
    throw new Error('useVideoPlayerContext debe ser usado dentro de VideoPlayerProvider');
  }
  
  return context;
}

// ===== EXPORTS =====
export { VideoPlayerProvider, useVideoPlayerContext };
export default VideoPlayerContext;