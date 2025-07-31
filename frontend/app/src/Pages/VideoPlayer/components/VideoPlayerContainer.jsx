import { useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { createPortal } from "react-dom";
import { getMovieByHashService } from '../../../services/Movies/getMovieByIdService';
import { getEpisodeByHashService } from '../../../services/Episodes/getEpisodeByHashService';
import { getEpisodesBySerieService } from '../../../services/Episodes/getEpisodesBySerieService';
import { getSerieByIdService } from '../../../services/Series/getSerieByIdService';
import { VideoPlayerOverlay } from '../../../components/organisms/VideoPlayerOverlay/VideoPlayerOverlay';
import { useVideoPreferences } from '../../../hooks/useVideoPreferences';
import { environmentService } from '../../../services/environmentService';
import { useAuth } from '../../../app/context/AuthContext';

// Componentes extraídos
import { VideoPlayerLoadingScreen } from './VideoPlayerLoadingScreen';
import { VideoPlayerErrorScreen } from './VideoPlayerErrorScreen';
import { VideoPlayerBackButton } from './VideoPlayerBackButton';
import { VideoPlayerStatusBar } from './VideoPlayerStatusBar';
import { VideoPlayerCore } from './VideoPlayerCore';

// Hook del contexto global
import { useVideoPlayer } from '../../../hooks/useVideoPlayer';

/**
 * VideoPlayerContainer - Orquestador principal del VideoPlayer
 * 
 * Responsabilidades:
 * - Coordinar la carga de datos de contenido
 * - Manejar el estado de la aplicación
 * - Integrar todos los componentes visuales
 * - Preparar datos para el VideoPlayerCore
 */
export const VideoPlayerContainer = () => {
  const {movieId} = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resolutions = searchParams.get('resolutions');
  const contentType = searchParams.get('type') || 'movie';
  const playlistKey = searchParams.get('playlist');
  
  // Hook para manejar preferencias de usuario con backend + localStorage fallback
  const { 
    preferences, 
    updateWatchProgress, 
    getWatchProgress,
    updatePreferences,
    loading: preferencesLoading
  } = useVideoPreferences();
  
  // Hook de autenticación
  const { isAuthenticated, user } = useAuth();
  const userId = user?.id;
  
  // Referencias para el overlay
  const overlayContainerRef = useRef(null);
  const overlayRef = useRef(null);
  
  // Hook del contexto global del VideoPlayer
  const {
    playerState,
    contentState,
    subtitleState,
    playerRef,
    actions: {
      updateContentState,
      updatePlayerState,
      handleSkip,
      togglePlayPause
    },
    actions
  } = useVideoPlayer();

  // Extraer estados individuales para mayor claridad
  const {
    currentQuality,
    bufferPercentage
  } = playerState;

  const {
    movieData,
    playlistData,
    currentEpisodeIndex,
    loading,
    error
  } = contentState;

  const {
    subtitleOffset,
    showOffsetIndicator
  } = subtitleState;

  const cdnUrl = import.meta.env.VITE_CDN_URL || 'http://localhost:8082';
  
  // ===== OBTENER HASH Y RESOLUCIONES ACTUALES =====
  const getCurrentHash = useCallback(() => {
    if (playlistData && contentType === 'episode') {
      const currentEpisode = playlistData.episodes[currentEpisodeIndex];
      return currentEpisode?.file_hash || movieId;
    }
    return movieId;
  }, [playlistData, contentType, currentEpisodeIndex, movieId]);

  const getCurrentResolutions = useCallback(() => {
    if (playlistData && contentType === 'episode') {
      const currentEpisode = playlistData.episodes[currentEpisodeIndex];
      return currentEpisode?.available_resolutions || resolutions;
    }
    return resolutions;
  }, [playlistData, contentType, currentEpisodeIndex, resolutions]);

  // URLs dinámicas que se actualizan según el episodio actual
  const currentHash = getCurrentHash();
  const currentResolutions = getCurrentResolutions();
  const baseUrl = `${cdnUrl}/hls/${currentHash}/`;
  const urlComplete = `${baseUrl}_,${currentResolutions},p.mp4.play/master.m3u8`;

  // ===== CONFIGURACIÓN DE SUBTÍTULOS =====
  const setupTextTracks = useCallback((player, subtitleTracks) => {
    // Precarga inteligente de subtítulos
    const preloadSubtitles = async () => {
      const preloadPromises = subtitleTracks.map(async (track) => {
        try {
          const response = await fetch(track.src, { 
            cache: 'force-cache',
            mode: 'cors'
          });
          if (response.ok) {
            console.log('✅ Subtítulo precargado:', track.label);
          }
        } catch (error) {
          console.warn('⚠️ Error precargando subtítulo:', track.label, error);
        }
      });
      
      await Promise.allSettled(preloadPromises);
      console.log('📂 Precarga de subtítulos completada');
    };

    player.ready(() => {
      // Iniciar precarga inmediatamente
      preloadSubtitles();
      
      // Esperar a que el metadata esté cargado con timeout de seguridad
      const setupTracksWithTimeout = () => {
        const setupTracks = () => {
          // Buffer de sincronización: pequeño delay para estabilizar timing
          setTimeout(() => {
            subtitleTracks.forEach((track, index) => {
              const textTrack = player.addRemoteTextTrack({
                ...track,
                mode: index === 0 ? 'showing' : 'disabled'
              }, false);
              
              // Configurar listeners mejorados
              if (textTrack && textTrack.track) {
                const trackElement = textTrack.track;
                
                trackElement.addEventListener('load', () => {
                  console.log('✅ Subtítulo cargado:', track.label);
                });
                
                trackElement.addEventListener('error', (error) => {
                  console.error('❌ Error cargando subtítulo:', track.label, error);
                });
              }
            });
            
            console.log('🔍 [DEBUG] setupTextTracks - Subtítulos configurados');
          }, 50); // Buffer de sincronización de 50ms
        };

        if (player.readyState() >= 1) {
          setupTracks();
        } else {
          player.one('loadedmetadata', setupTracks);
          // Timeout de seguridad
          setTimeout(() => {
            if (player.readyState() < 1) {
              console.warn('⚠️ Timeout esperando metadata, configurando tracks anyway');
              setupTracks();
            }
          }, 3000);
        }
      };

      setupTracksWithTimeout();
    });
  }, []);

  // ===== FUNCIÓN PARA OBTENER ID CORRECTO DE PROGRESO =====
  const getContentProgressId = useCallback(() => {
    if (contentType === 'episode') {
      return getCurrentHash();
    }
    return movieId;
  }, [contentType, getCurrentHash, movieId]);

  // ===== GUARDAR PREFERENCIAS =====
  const savePlayerPreferences = useCallback(async () => {
    if (!playerRef.current || playerRef.current.isDisposed()) {
      return;
    }

    try {
      const textTracks = playerRef.current.textTracks();
      const activeTrack = Array.from(textTracks).find(track => track.mode === 'showing');
      const currentTime = playerRef.current.currentTime();
      const duration = playerRef.current.duration();
      
      // 1. Guardar preferencias generales del player
      const playerPrefs = {
        volume: playerRef.current.volume(),
        playbackRate: playerRef.current.playbackRate(),
        preferredLanguage: activeTrack?.language || 'es',
        subtitlesEnabled: activeTrack ? true : false,
      };
      
      // Solo actualizar si hay cambios significativos
      if (preferences) {
        const hasChanges = 
          Math.abs((preferences.volume || 1) - playerPrefs.volume) > 0.05 ||
          (preferences.playbackRate || 1) !== playerPrefs.playbackRate ||
          (preferences.preferredLanguage || 'es') !== playerPrefs.preferredLanguage ||
          (preferences.subtitlesEnabled || false) !== playerPrefs.subtitlesEnabled;
          
        if (hasChanges) {
          console.log('🔄 Guardando preferencias del player en backend...');
          await updatePreferences(playerPrefs);
        }
      }
      
      // 2. Guardar progreso de reproducción
      if (currentTime > 0 && duration > 0) {
        const contentId = getContentProgressId();
        
        const progressData = {
          position: currentTime,
          type: contentType === 'episode' ? 'episode' : 'movie',
          ...(contentType === 'episode' && { 
            seriesId: movieId,
            ...(playlistData && {
              episodeIndex: currentEpisodeIndex,
              seasonNumber: playlistData.episodes[currentEpisodeIndex]?.season_number,
              episodeNumber: playlistData.episodes[currentEpisodeIndex]?.episode_number
            })
          }),
          completed: currentTime >= duration * 0.9
        };
        
        console.log('🔄 Guardando progreso de reproducción...', { contentId, progressData });
        await updateWatchProgress(contentId, progressData);
      }
      
      // 3. Mantener fallback en localStorage
      const contentPositions = JSON.parse(localStorage.getItem('contentPositions') || '{}');
      const contentId = getContentProgressId();
      contentPositions[contentId] = {
        position: currentTime,
        duration: duration,
        timestamp: Date.now()
      };
      localStorage.setItem('contentPositions', JSON.stringify(contentPositions));
      
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
    }
  }, [getContentProgressId, updatePreferences, updateWatchProgress, preferences, contentType, playlistData, currentEpisodeIndex, movieId, playerRef]);

  // ===== CARGAR PREFERENCIAS =====
  const loadPlayerPreferences = useCallback(async (player) => {
    if (!player) return;
    
    try {
      console.log('🔄 Cargando preferencias del usuario desde backend...');
      
      // 1. Cargar preferencias generales
      if (preferences) {
        console.log('✅ Aplicando preferencias del usuario:', preferences);
        
        if (preferences.volume !== undefined) {
          player.volume(preferences.volume);
          console.log('✅ Volumen aplicado:', preferences.volume);
        }
        
        if (preferences.playbackRate) {
          player.playbackRate(preferences.playbackRate);
          console.log('✅ Velocidad de reproducción aplicada:', preferences.playbackRate);
        }
      }
      
      // 2. Cargar progreso específico del contenido
      const contentId = getContentProgressId();
      console.log('🔄 Obteniendo progreso de reproducción para:', contentId);
      const watchProgress = await getWatchProgress(contentId);
      
      if (watchProgress && watchProgress.position > 0) {
        const { position } = watchProgress;
        console.log('📊 Progreso encontrado en backend:', watchProgress);
        
        const setVideoPosition = () => {
          const duration = player.duration();
          if (position > 10 && position < duration * 0.9) {
            player.currentTime(position);
            console.log('✅ Posición restaurada desde backend:', position, 'de', duration);
          } else {
            console.log('⏭️ Posición no restaurada (muy cerca del inicio/final):', position);
          }
        };

        if (player.readyState() >= 1) {
          setVideoPosition();
        } else {
          player.one('loadedmetadata', setVideoPosition);
        }
      } else {
        // Fallback: localStorage
        console.log('📁 No hay progreso en backend, intentando localStorage...');
        const contentPositions = JSON.parse(localStorage.getItem('contentPositions') || '{}');
        if (contentPositions[contentId]) {
          const savedPosition = contentPositions[contentId];
          console.log('📁 Progreso encontrado en localStorage:', savedPosition);
          
          const setLocalStoragePosition = () => {
            const duration = player.duration();
            if (savedPosition.position > 10 && 
                savedPosition.position < duration * 0.9) {
              player.currentTime(savedPosition.position);
              console.log('✅ Posición restaurada desde localStorage:', savedPosition.position);
            }
          };

          if (player.readyState() >= 1) {
            setLocalStoragePosition();
          } else {
            player.one('loadedmetadata', setLocalStoragePosition);
          }
        }
      }
      
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
    }
  }, [getContentProgressId, preferences, getWatchProgress]);

  // ===== CONFIGURACIÓN DEL VIDEO PLAYER =====
  const playerConfig = useMemo(() => {
    console.log('🎬 [VideoPlayerContainer] Configurando player...');

    const baseConfig = {
      autoplay: true,
      muted: false,
      volume: preferences?.volume || 1,
      playbackRate: preferences?.playbackRate || 1,
      textTrackSettings: {
        backgroundColor: '#000000',
        color: '#FFFFFF',
        edgeStyle: 'raised',
        fontFamily: 'Arial',
        fontSize: '16px'
      }
    };

    // Si hay playlist, NO configurar sources individuales
    if (playlistData && playlistData.episodes.length > 0) {
      console.log('📋 Configuración para playlist con', playlistData.episodes.length, 'episodios');
      return baseConfig;
    }

    // Si es contenido individual, configurar source normal
    if (urlComplete) {
      console.log('🎬 Configuración para contenido individual:', urlComplete);
      return {
        ...baseConfig,
        sources: [{
          src: urlComplete,
          type: 'application/x-mpegURL'
        }]
      };
    }

    return null;
  }, [urlComplete, preferences?.volume, preferences?.playbackRate, playlistData]);

  // ===== CALLBACK CUANDO EL PLAYER ESTÁ LISTO =====
  const handlePlayerReady = useCallback((player) => {
    console.log('🎬 [VideoPlayerContainer] Player listo, configurando...');
    
    // Establecer referencia del player en el hook de estado
    if (playerRef) {
      playerRef.current = player;
    }

    // ===== CONFIGURAR OVERLAY =====
    player.ready(() => {
      const overlayContainer = document.createElement('div');
      overlayContainer.className = 'video-overlay-container';
      overlayContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100% - 8rem);
        pointer-events: none;
        z-index: 500;
      `;
      
      overlayContainerRef.current = overlayContainer;
      
      player.overlay({
        overlays: [{
          content: overlayContainer,
          start: 0,
          end: 'end'
        }]
      });
    });

    // ===== EVENTOS DEL PLAYER =====
    player.on('play', () => updatePlayerState({ isPlaying: true }));
    player.on('pause', () => updatePlayerState({ isPlaying: false }));
    
    // Usar eventos oficiales de Video.js según documentación
    player.on('useractive', () => {
      if (overlayRef.current && overlayRef.current.showControls) {
        overlayRef.current.showControls();
      }
    });
    
    player.on('userinactive', () => {
      if (overlayRef.current && overlayRef.current.hideControls) {
        overlayRef.current.hideControls();
      }
    });

    // ===== CARGAR PREFERENCIAS Y PROGRESO =====
    console.log('🔄 Cargando preferencias del usuario...');
    loadPlayerPreferences(player);

    // ===== PANTALLA COMPLETA AUTOMÁTICA =====
    player.ready(() => {
      player.one('canplay', () => {
        if (player.requestFullscreen) {
          player.requestFullscreen()
            .then(() => {
              console.log('✅ Pantalla completa activada automáticamente');
            })
            .catch((err) => {
              console.warn('⚠️ No se pudo activar pantalla completa:', err.message);
            });
        }
      });
    });

    // ===== CONFIGURAR SUBTÍTULOS =====
    if (movieData.available_subtitles && movieData.available_subtitles.length > 0) {
      console.log('🔍 [DEBUG] Configurando subtítulos:', movieData.available_subtitles.length);
      
      const subtitleTracks = movieData.available_subtitles.map(subtitle => {
        let language = 'es';
        let label = 'Español';
        
        if (subtitle.includes('eng')) {
          language = 'en';
          label = 'English';
        } else if (subtitle.includes('spa')) {
          language = 'es';
          label = 'Español';
        }
        
        if (subtitle.includes('forced')) {
          label += ' (Forzado)';
        }
        
        const subsUrl = `${cdnUrl}/subs/${currentHash}/`;
        
        return {
          kind: 'subtitles',
          src: `${subsUrl}${subtitle}.vtt`,
          srclang: language,
          label: label,
          default: false
        };
      });
      
      // Configurar subtítulos con precarga
      setupTextTracks(player, subtitleTracks);
    } else {
      console.log('🔍 [DEBUG] Sin subtítulos disponibles');
    }

    // ===== EVENTOS PARA GUARDAR PROGRESO =====
    player.on('pause', () => {
      console.log('⏸️ Video pausado - guardando progreso...');
      savePlayerPreferences();
    });

    // ===== CONFIGURAR PLAYLIST NATIVA DE VIDEO.JS =====
    if (playlistData && playlistData.episodes.length > 0) {
      console.log('📋 Configurando playlist nativa de Video.js...');
      
      // Crear array de items para la playlist con URLs absolutas completas
      const playlistItems = playlistData.episodes.map((episode) => {
        const episodeHash = episode.file_hash;
        const episodeResolutions = episode.available_resolutions?.sort((a, b) => a - b).join(',') || resolutions;
        
        const episodeUrl = `${cdnUrl}/hls/${episodeHash}/_,${episodeResolutions},p.mp4.play/master.m3u8`;
        
        return {
          sources: [{
            src: episodeUrl,
            type: 'application/x-mpegURL'
          }],
          name: `T${episode.season_number}E${episode.episode_number} - ${episode.title || 'Sin título'}`,
          description: episode.overview || '',
          thumbnail: episode.poster_path ? `${cdnUrl}/images/${episode.poster_path}` : null
        };
      });
      
      // Configurar playlist y navegar al episodio correcto
      player.playlist(playlistItems);
      player.playlist.currentItem(currentEpisodeIndex);
      
      // Configurar autoadvance con delay 0 (inmediato)
      player.ready(() => {
        if (typeof player.playlist.autoadvance === 'function') {
          player.playlist.autoadvance(0);
          console.log('✅ Autoadvance configurado con delay 0');
        }
      });
      
      // Eventos de playlist
      player.on('playlistitem', () => {
        const currentIndex = player.playlist.currentIndex();
        console.log('🔍 [DEBUG] Evento playlistitem - Índice actual:', currentIndex);
        
        // Actualizar URL del navegador sin navegar (solo history)
        if (currentIndex !== currentEpisodeIndex && currentIndex >= 0) {
          if (playlistData.episodes[currentIndex]) {
            const currentEpisode = playlistData.episodes[currentIndex];
            const newUrl = `/player/${currentEpisode.file_hash}?type=episode&resolutions=${currentEpisode.available_resolutions?.join(',') || resolutions}&playlist=${playlistKey}`;
            window.history.replaceState(null, '', newUrl);
            
            // Actualizar sessionStorage con el nuevo índice
            try {
              const playlistDataToSave = {
                seriesId: playlistData.serie.id,
                episodes: playlistData.episodes,
                currentIndex: currentIndex
              };
              sessionStorage.setItem(playlistKey, JSON.stringify(playlistDataToSave));
              console.log('💾 Playlist actualizada en sessionStorage con índice:', currentIndex);
            } catch (error) {
              console.error('Error actualizando playlist en sessionStorage:', error);
            }
            
            console.log('🔍 [DEBUG] URL actualizada:', newUrl);
          }
        }
      });
      
      player.on('playlistend', () => {
        console.log('🔍 [DEBUG] Evento playlistend - Todos los episodios completados');
      });
      
      console.log('📋 Playlist configurada con', playlistItems.length, 'episodios');
    }

    player.on('ended', () => {
      console.log('🏁 Video terminado - guardando progreso final...');
      savePlayerPreferences();
      // El autoadvance lo maneja automáticamente la playlist de Video.js
    });
    
    console.log('✅ [VideoPlayerContainer] Player configurado correctamente');
  }, [playerRef, updatePlayerState, movieData, cdnUrl, currentHash, setupTextTracks, loadPlayerPreferences, savePlayerPreferences, playlistData, currentEpisodeIndex, resolutions, playlistKey, navigate]);

  // ===== CALLBACK CUANDO SE DISPONE EL PLAYER =====
  const handlePlayerDispose = useCallback(() => {
    console.log('🧹 [VideoPlayerContainer] Limpiando player...');
    
    // Guardar preferencias finales antes de limpiar
    savePlayerPreferences();
    
    if (playerRef) {
      playerRef.current = null;
    }
    
    console.log('✅ [VideoPlayerContainer] Player limpiado');
  }, [playerRef, savePlayerPreferences]);

  // ===== CLEANUP PARA BEFOREUNLOAD =====
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        // Guardado síncrono para beforeunload
        const currentTime = playerRef.current.currentTime();
        const duration = playerRef.current.duration();
        
        if (currentTime > 0 && duration > 0) {
          const contentPositions = JSON.parse(localStorage.getItem('contentPositions') || '{}');
          const contentId = getContentProgressId();
          contentPositions[contentId] = {
            position: currentTime,
            duration: duration,
            timestamp: Date.now()
          };
          localStorage.setItem('contentPositions', JSON.stringify(contentPositions));
          console.log('📡 Progreso guardado síncronamente antes de cerrar');
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [playerRef, getContentProgressId]);

  // ===== CARGAR DATOS DEL CONTENIDO =====
  useEffect(() => {
    const loadContentData = async () => {
      try {
        updateContentState({ loading: true, error: null });
        
        let contentData;
        if (contentType === 'episode') {
          contentData = await getEpisodeByHashService(movieId);
        } else {
          contentData = await getMovieByHashService(movieId);
        }
        
        updateContentState({ 
          movieData: contentData,
          contentType: contentType
        });
        
        console.log('🔍 [DEBUG] Datos del contenido cargados - contentType:', contentType, 'contentData:', {
          id: contentData.id,
          title: contentData.title || contentData.name,
          file_hash: contentData.file_hash,
          serie_id: contentData.serie_id
        });

        // ===== CARGAR PLAYLIST SI EXISTE PLAYLIST KEY =====
        if (playlistKey && contentType === 'episode') {
          try {
            const savedPlaylistData = sessionStorage.getItem(playlistKey);
            
            if (savedPlaylistData) {
              const parsedPlaylistData = JSON.parse(savedPlaylistData);
              
              // Adaptar la estructura de datos del contexto
              const adaptedPlaylistData = {
                serie: { 
                  id: parsedPlaylistData.seriesId,
                  title: `Serie ${parsedPlaylistData.seriesId}` // Título temporal
                },
                episodes: parsedPlaylistData.episodes,
                totalEpisodes: parsedPlaylistData.episodes.length
              };
              
              updateContentState({
                playlistData: adaptedPlaylistData,
                currentEpisodeIndex: parsedPlaylistData.currentIndex || 0
              });
              
            } else {
              console.warn('📋 No se encontró playlist en sessionStorage con key:', playlistKey);
              
              // Fallback: cargar desde API si no está en sessionStorage
              if (contentData.serie_id) {
                const serieResponse = await getSerieByIdService(contentData.serie_id);
                const episodesResponse = await getEpisodesBySerieService(contentData.serie_id);
                
                if (serieResponse.success && episodesResponse.success) {
                  const episodesList = episodesResponse.data;
                  
                  const sortedEpisodes = episodesList.sort((a, b) => {
                    if (a.season_number !== b.season_number) {
                      return a.season_number - b.season_number;
                    }
                    return a.episode_number - b.episode_number;
                  });
                  
                  const currentIndex = sortedEpisodes.findIndex(ep => ep.file_hash === movieId);
                  
                  updateContentState({
                    playlistData: {
                      serie: serieResponse.data,
                      episodes: sortedEpisodes,
                      totalEpisodes: sortedEpisodes.length
                    },
                    currentEpisodeIndex: currentIndex >= 0 ? currentIndex : 0
                  });
                }
              }
            }
          } catch (playlistError) {
            console.error('❌ Error cargando playlist:', playlistError);
            // No fallar la carga del video, solo log del error
          }
        }
        
      } catch (error) {
        console.error(`❌ Error loading ${contentType} data:`, error);
        updateContentState({ 
          error: 'Error al cargar el contenido. Por favor, intenta de nuevo.' 
        });
      } finally {
        updateContentState({ loading: false });
      }
    };

    if (movieId) {
      loadContentData();
    }
  }, [movieId, contentType, playlistKey, updateContentState]);

  // ===== RENDERIZADO CONDICIONAL =====
  
  // ===== VALIDACIONES INICIALES (centralizadas) =====
  if (!movieId) {
    return (
      <VideoPlayerErrorScreen 
        error="ID de video no encontrado. Verifica que la URL sea correcta."
        onGoBack={() => navigate(-1)}
      />
    );
  }

  if (!resolutions) {
    return (
      <VideoPlayerErrorScreen 
        resolutionsError={true} 
        onGoBack={() => navigate(-1)}
      />
    );
  }

  // Pantalla de carga inicial
  if (loading || preferencesLoading) {
    return (
      <VideoPlayerLoadingScreen 
        contentType={contentType}
        preferencesLoading={preferencesLoading}
      />
    );
  }

  // Pantalla de error de carga de datos
  if (error) {
    return (
      <VideoPlayerErrorScreen
        error={error}
        onRetry={() => {
          updateContentState({ error: null });
          // TODO: Implementar lógica de reintento
        }}
        onGoBack={() => navigate(-1)}
      />
    );
  }

  // ===== RENDERIZADO PRINCIPAL =====
  return (
    <div className="video-player-container">
      {/* Botón de navegación */}
      <VideoPlayerBackButton onGoBack={() => navigate(-1)} />
      
      <div className="video-wrapper">
        <div className="video-container">
          {/* Barra de estado con información del reproductor */}
          <VideoPlayerStatusBar
            currentQuality={currentQuality}
            bufferPercentage={bufferPercentage}
            subtitleOffset={subtitleOffset}
            showOffsetIndicator={showOffsetIndicator}
            playlistData={playlistData}
            currentEpisodeIndex={currentEpisodeIndex}
          />
          
          <div data-vjs-player>
            {movieData && urlComplete && playerConfig && (
              <VideoPlayerCore
                config={playerConfig}
                onReady={handlePlayerReady}
                onDispose={handlePlayerDispose}
                className="video-js vjs-default-skin vjs-big-play-centered"
              />
            )}
          </div>
          
          {/* Portal para el overlay de controles */}
          {overlayContainerRef.current && movieData && createPortal(
            <VideoPlayerOverlay
              ref={overlayRef}
              onSkipBack={() => {
                const { handleSkip } = actions;
                handleSkip(10, 'backward');
              }}
              onPlayPause={() => {
                const { togglePlayPause } = actions;
                togglePlayPause();
              }}
              onSkipForward={() => {
                const { handleSkip } = actions;
                handleSkip(10, 'forward');
              }}
              isPlaying={playerState.isPlaying}
              skipSeconds={10}
              movieTitle={movieData.title || movieData.name}
              currentQuality={currentQuality}
            />,
            overlayContainerRef.current
          )}
        </div>
      </div>
    </div>
  );
};