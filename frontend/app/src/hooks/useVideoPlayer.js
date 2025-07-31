// ===== USE VIDEO PLAYER HOOK - HOOK PRINCIPAL DEL REPRODUCTOR =====
// src/hooks/useVideoPlayer.js

import { useVideoPlayerContext } from '../app/context/VideoPlayerContext';

/**
 * useVideoPlayer - Hook principal para interactuar con el VideoPlayer
 * 
 * Hook personalizado que proporciona acceso a todos los estados y acciones
 * del VideoPlayer desde cualquier componente hijo.
 * 
 * Sigue el patrón establecido del proyecto:
 * - useAuth() para AuthContext
 * - useUsers() para UserContext  
 * - useMovies() para MoviesContext
 * - useVideoPlayer() para VideoPlayerContext
 * 
 * @returns {Object} Estados y acciones del VideoPlayer
 */
export const useVideoPlayer = () => {
  const context = useVideoPlayerContext();
  
  if (!context) {
    throw new Error('useVideoPlayer debe ser usado dentro de VideoPlayerProvider');
  }
  
  const {
    playerState,
    contentState,
    subtitleState,
    actions,
    playerRef,
    videoRef,
    analyticsRef
  } = context;
  
  // Los estados ya están disponibles directamente en los objetos playerState, contentState, subtitleState
  // No es necesario desestructurarlos aquí para evitar warnings de ESLint
  
  // ===== HELPER FUNCTIONS =====
  
  /**
   * Verificar si hay una playlist activa
   */
  const hasPlaylist = () => {
    return contentState.playlistData && contentState.playlistData.episodes && contentState.playlistData.episodes.length > 0;
  };
  
  /**
   * Obtener episodio actual de la playlist
   */
  const getCurrentEpisode = () => {
    if (!hasPlaylist()) return null;
    return contentState.playlistData.episodes[contentState.currentEpisodeIndex];
  };
  
  /**
   * Verificar si hay episodio siguiente
   */
  const hasNextEpisode = () => {
    if (!hasPlaylist()) return false;
    return contentState.currentEpisodeIndex < contentState.playlistData.episodes.length - 1;
  };
  
  /**
   * Verificar si hay episodio anterior
   */
  const hasPreviousEpisode = () => {
    if (!hasPlaylist()) return false;
    return contentState.currentEpisodeIndex > 0;
  };
  
  /**
   * Obtener información de la serie actual
   */
  const getCurrentSeries = () => {
    if (!hasPlaylist()) return null;
    return contentState.playlistData.serie;
  };
  
  /**
   * Obtener progreso de la playlist
   */
  const getPlaylistProgress = () => {
    if (!hasPlaylist()) return null;
    
    return {
      currentIndex: contentState.currentEpisodeIndex,
      totalEpisodes: contentState.playlistData.episodes.length,
      currentEpisode: getCurrentEpisode(),
      hasNext: hasNextEpisode(),
      hasPrevious: hasPreviousEpisode()
    };
  };
  
  /**
   * Obtener hash del contenido actual
   */
  const getCurrentHash = () => {
    if (hasPlaylist()) {
      const currentEpisode = getCurrentEpisode();
      return currentEpisode?.file_hash;
    }
    return contentState.movieData?.file_hash;
  };
  
  /**
   * Obtener resoluciones disponibles del contenido actual
   */
  const getCurrentResolutions = () => {
    if (hasPlaylist()) {
      const currentEpisode = getCurrentEpisode();
      return currentEpisode?.available_resolutions?.sort((a, b) => a - b).join(',');
    }
    return contentState.movieData?.available_resolutions?.sort((a, b) => a - b).join(',');
  };
  
  /**
   * Obtener información de analytics
   */
  const getAnalytics = () => {
    return {
      ...analyticsRef.current,
      sessionDuration: Date.now() - analyticsRef.current.sessionStartTime
    };
  };
  
  // ===== RETURN OBJECT - ESTRUCTURA COMPATIBLE CON CONTEXTO =====
  return {
    // Estados directos del contexto
    playerState,
    contentState,
    subtitleState,
    actions,
    playerRef,
    videoRef,
    analyticsRef,
    
    // 🛠️ Utilidades adicionales
    utils: {
      hasPlaylist,
      getCurrentEpisode,
      hasNextEpisode,
      hasPreviousEpisode,
      getCurrentSeries,
      getPlaylistProgress,
      getCurrentHash,
      getCurrentResolutions,
      getAnalytics
    }
  };
};