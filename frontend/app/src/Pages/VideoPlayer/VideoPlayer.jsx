import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "jb-videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css";
import "jb-videojs-hls-quality-selector";
import "videojs-overlay";
import "videojs-hotkeys";
import "videojs-playlist";
import "videojs-playlist-ui";
import "./VideoPlayer.css";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getMovieByHashService } from '../../services/Movies/getMovieByIdService';
import { getEpisodeByHashService } from '../../services/Episodes/getEpisodeByHashService';
import { getEpisodesBySerieService } from '../../services/Episodes/getEpisodesBySerieService';
import { getSerieByIdService } from '../../services/Series/getSerieByIdService';
import { Button } from '../../components/atoms/Button/Button';
import { VideoPlayerOverlay } from '../../components/organisms/VideoPlayerOverlay/VideoPlayerOverlay';

const VideoPlayer = () => {
  const {movieId} = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resolutions = searchParams.get('resolutions');
  const contentType = searchParams.get('type') || 'movie';
  const playlistKey = searchParams.get('playlist');
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const overlayContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const analyticsRef = useRef({
    watchTime: 0,
    lastTime: 0,
    rebufferCount: 0,
    qualityChanges: 0,
    sessionStartTime: Date.now()
  });
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('Auto');
  const [bufferPercentage, setBufferPercentage] = useState(0);
  const [error, setError] = useState(null);
  
  // ===== ESTADOS PARA PLAYLIST =====
  const [playlistData, setPlaylistData] = useState(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  const cdnUrl = import.meta.env.VITE_CDN_URL || 'http://localhost:8082';
  // URLs dinámicas que se actualizan según el episodio actual
  const getCurrentHash = () => {
    if (playlistData && playlistData.episodes[currentEpisodeIndex]) {
      return playlistData.episodes[currentEpisodeIndex].file_hash;
    }
    return movieId;
  };
  
  const getCurrentResolutions = () => {
    if (playlistData && playlistData.episodes[currentEpisodeIndex]) {
      const episode = playlistData.episodes[currentEpisodeIndex];
      return episode.available_resolutions?.sort((a, b) => a - b).join(',') || resolutions;
    }
    return resolutions;
  };
  
  const currentHash = getCurrentHash();
  const currentResolutions = getCurrentResolutions();
  const baseUrl = `${cdnUrl}/hls/${currentHash}/`;
  const subsUrl = `${cdnUrl}/subs/${currentHash}/`;
  const urlComplete = `${baseUrl}_,${currentResolutions},p.mp4.play/master.m3u8`;


  // ===== FUNCIÓN DE SKIP SIMPLIFICADA =====
  const handleSkip = useCallback((player, seconds, direction) => {
    if (!player || player.readyState() < 1) {
      return;
    }
    
    const currentTime = player.currentTime();
    const duration = player.duration();
    
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
      player.currentTime(newTime);
    } catch (error) {
      console.error('Error en seeking:', error);
    }
  }, []);

  // ===== GUARDAR Y CARGAR PREFERENCIAS =====
  const savePlayerPreferences = useCallback(() => {
    if (playerRef.current && !playerRef.current.isDisposed()) {
      const textTracks = playerRef.current.textTracks();
      const activeTrack = Array.from(textTracks).find(track => track.mode === 'showing');
      
      const preferences = {
        volume: playerRef.current.volume(),
        selectedTextTrack: activeTrack ? {
          language: activeTrack.language,
          label: activeTrack.label
        } : null,
        playbackRate: playerRef.current.playbackRate(),
        lastPosition: playerRef.current.currentTime(),
        movieId: movieId
      };
      
      localStorage.setItem('playerPreferences', JSON.stringify(preferences));
      
      // Guardar posición específica del contenido
      const contentPositions = JSON.parse(localStorage.getItem('contentPositions') || '{}');
      contentPositions[movieId] = {
        position: playerRef.current.currentTime(),
        duration: playerRef.current.duration(),
        timestamp: Date.now()
      };
      localStorage.setItem('contentPositions', JSON.stringify(contentPositions));
    }
  }, [movieId]);

  const loadPlayerPreferences = useCallback((player) => {
    try {
      const saved = localStorage.getItem('playerPreferences');
      if (saved && player) {
        const preferences = JSON.parse(saved);
        
        // Aplicar volumen
        if (preferences.volume !== undefined) {
          player.volume(preferences.volume);
        }
        
        // Aplicar velocidad de reproducción
        if (preferences.playbackRate) {
          player.playbackRate(preferences.playbackRate);
        }
        
        // Cargar posición guardada para este contenido
        const contentPositions = JSON.parse(localStorage.getItem('contentPositions') || '{}');
        if (contentPositions[movieId]) {
          const savedPosition = contentPositions[movieId];
          // Solo restaurar si la posición es mayor a 10 segundos y menor al 90% del video
          if (savedPosition.position > 10 && 
              savedPosition.position < savedPosition.duration * 0.9) {
            player.currentTime(savedPosition.position);
            // Posición restaurada correctamente
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
    }
  }, [movieId]);

  // ===== CONFIGURACIÓN SIMPLIFICADA DE TEXT TRACKS =====
  const setupTextTracks = useCallback((player, subtitleTracks) => {
    player.ready(() => {
      // Esperar a que el metadata esté cargado
      player.one('loadedmetadata', () => {
        // Agregar tracks con configuración estándar
        subtitleTracks.forEach((track, index) => {
          
          const textTrack = player.addRemoteTextTrack({
            ...track,
            mode: index === 0 ? 'showing' : 'disabled' // Primer track activo
          }, false);
          
          // Configurar listeners básicos
          if (textTrack && textTrack.track) {
            textTrack.track.addEventListener('error', (error) => {
              console.error('Error cargando subtítulo:', track.label, error);
            });
          }
        });
        
        // Cargar preferencias después de configurar tracks
        setTimeout(() => {
          loadPlayerPreferences(player);
        }, 200);
      });
    });
  }, [loadPlayerPreferences]);

  // ===== FUNCIONES DE PLAYLIST SIMPLIFICADAS =====
  // La lógica de avance automático es manejada por el plugin oficial videojs-playlist
  // Ya no necesitamos lógica manual compleja

  // handlePlaylistItemChange ya no es necesario - el plugin maneja los cambios automáticamente

  // ===== ANALYTICS Y MÉTRICAS =====
  const initializeAnalytics = useCallback((player) => {
    // Tracking de tiempo visto
    player.on('timeupdate', () => {
      const currentTime = player.currentTime();
      if (currentTime > analyticsRef.current.lastTime && !player.paused()) {
        analyticsRef.current.watchTime += currentTime - analyticsRef.current.lastTime;
      }
      analyticsRef.current.lastTime = currentTime;
    });
    
    // Tracking de completado
    player.on('ended', () => {
      // Video completado - analytics registradas
      
      // AUTO-ADVANCE HÍBRIDO: PLUGIN + FALLBACK MANUAL
      if (playlistData) {
        const currentIdx = player.playlist.currentIndex();
        const totalItems = player.playlist().length;
        const hasNextEpisode = currentIdx < totalItems - 1;
        
        console.log('🔍 [DEBUG] Video ended - Estado inicial:', {
          currentIndex: currentIdx,
          totalItems: totalItems,
          hasNextEpisode: hasNextEpisode,
          autoadvanceDelay: typeof player.playlist.autoadvance === 'function' ? player.playlist.autoadvance() : 'no disponible'
        });
        
        // Verificar si el plugin avanza automáticamente
        setTimeout(() => {
          const newIndex = player.playlist.currentIndex();
          
          console.log('🔍 [DEBUG] 2 segundos después:', {
            indexAnterior: currentIdx,
            indexActual: newIndex,
            pluginAvanzó: newIndex !== currentIdx,
            currentSrc: player.currentSrc()
          });
          
          // FALLBACK: Si el plugin no avanzó y hay siguiente episodio, avanzar manualmente
          if (newIndex === currentIdx && hasNextEpisode) {
            console.log('🚨 USANDO FALLBACK MANUAL - Plugin nativo no avanzó');
            
            try {
              // Avanzar manualmente usando el método next()
              if (player.playlist.next) {
                player.playlist.next();
                console.log('✅ Avance manual con playlist.next()');
              } else {
                // Alternativa: cambiar al siguiente ítem directamente
                player.playlist.currentItem(currentIdx + 1);
                console.log('✅ Avance manual con currentItem(' + (currentIdx + 1) + ')');
              }
              
              // Reproducir el nuevo video
              setTimeout(() => {
                if (!player.isDisposed() && player.paused()) {
                  player.play().catch(error => {
                    console.error('Error reproduciendo siguiente episodio:', error);
                  });
                }
              }, 500);
              
            } catch (error) {
              console.error('Error en fallback manual:', error);
            }
          } else if (newIndex !== currentIdx) {
            console.log('✅ PLUGIN NATIVO FUNCIONÓ CORRECTAMENTE');
          } else if (!hasNextEpisode) {
            console.log('📋 Serie completada - último episodio');
          }
        }, 2000);
      }
    });
    
    // Tracking de rebuffering
    player.on('waiting', () => {
      analyticsRef.current.rebufferCount++;
    });
    
    // Tracking de pausas
    player.on('pause', () => {
      // Video pausado
    });
    
    // ===== EVENTOS OFICIALES DE PLAYLIST =====
    if (playlistData) {
      
      // Evento disparado cuando cambia el item de la playlist
      player.on('playlistitem', () => {
        const currentIndex = player.playlist.currentIndex();
        
        console.log('🔍 [DEBUG] Evento playlistitem - Índice actual:', currentIndex);
        
        // Actualizar URL del navegador sin cambiar estado React para evitar re-renders
        if (currentIndex !== currentEpisodeIndex && currentIndex >= 0) {
          if (playlistData.episodes[currentIndex]) {
            const currentEpisode = playlistData.episodes[currentIndex];
            const newUrl = `/player/${currentEpisode.file_hash}?type=episode&resolutions=${currentEpisode.available_resolutions?.join(',') || resolutions}&playlist=${playlistKey}`;
            window.history.replaceState(null, '', newUrl);
            console.log('🔍 [DEBUG] URL actualizada:', newUrl);
          }
        }
      });
      
      // Evento cuando la playlist termina completamente
      player.on('playlistend', () => {
        console.log('🔍 [DEBUG] Evento playlistend - Todos los episodios completados');
      });
      
      // Eventos adicionales para debugging
      player.on('loadstart', () => {
        console.log('🔍 [DEBUG] loadstart - Nuevo video cargando, índice:', player.playlist.currentIndex());
      });
      
      player.on('play', () => {
        console.log('🔍 [DEBUG] play - Reprodución iniciada, índice:', player.playlist.currentIndex());
      });
    }
  }, [playlistData, currentEpisodeIndex, resolutions, playlistKey]);


  // ===== MANEJO DEL BOTÓN DE REGRESAR =====
  const handleGoBack = useCallback(() => {
    savePlayerPreferences();
    
    if (playerRef.current && !playerRef.current.isDisposed()) {
      if (playerRef.current.isFullscreen()) {
        playerRef.current.exitFullscreen();
      }
      playerRef.current.pause();
    }
    
    navigate(-1);
  }, [navigate, savePlayerPreferences]);

  // ===== CLEANUP MEJORADO =====
  useEffect(() => {
    const handleBeforeUnload = () => {
      savePlayerPreferences();
      if (playerRef.current && !playerRef.current.isDisposed()) {
        if (playerRef.current._cleanupSeeking) {
          playerRef.current._cleanupSeeking();
        }
        playerRef.current.dispose();
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        savePlayerPreferences();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [savePlayerPreferences]);

  // ===== CARGAR DATOS DEL CONTENIDO =====
  useEffect(() => {
    const loadContentData = async () => {
      try {
        setLoading(true);
        setError(null);
        let contentData;
        if (contentType === 'episode') {
          contentData = await getEpisodeByHashService(movieId);
        } else {
          contentData = await getMovieByHashService(movieId);
        }
        
        setMovieData(contentData);

        // ===== CARGAR PLAYLIST SI EXISTE PLAYLIST KEY =====
        if (playlistKey && contentType === 'episode') {
          try {
            const savedPlaylistData = sessionStorage.getItem(playlistKey);
            
            if (savedPlaylistData) {
              const parsedPlaylistData = JSON.parse(savedPlaylistData);
              
              // Adaptar la estructura de datos del hook a nuestro componente
              const adaptedPlaylistData = {
                serie: { 
                  id: parsedPlaylistData.seriesId,
                  title: `Serie ${parsedPlaylistData.seriesId}` // Título temporal
                },
                episodes: parsedPlaylistData.episodes,
                totalEpisodes: parsedPlaylistData.episodes.length
              };
              
              setPlaylistData(adaptedPlaylistData);
              setCurrentEpisodeIndex(parsedPlaylistData.currentIndex || 0);
              
              // Playlist cargada desde sessionStorage
              
            } else {
              console.warn('📋 No se encontró playlist en sessionStorage con key:', playlistKey);
              
              // Fallback: cargar desde API si no está en sessionStorage
              if (contentData.serie_id) {
                // Fallback: cargando playlist desde API
                
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
                  
                  setPlaylistData({
                    serie: serieResponse.data,
                    episodes: sortedEpisodes,
                    totalEpisodes: sortedEpisodes.length
                  });
                  
                  setCurrentEpisodeIndex(currentIndex >= 0 ? currentIndex : 0);
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
        setError('Error al cargar el contenido. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadContentData();
    }
  }, [movieId, contentType, playlistKey]);

  // ===== INICIALIZAR PLAYER =====
  useEffect(() => {
    const initializePlayer = async () => {
      try {
        if (!movieData || loading) {
          return;
        }
        
        if (!document.body.contains(videoRef.current)) {
          await new Promise((resolve) => {
            const observer = new MutationObserver(() => {
              if (document.body.contains(videoRef.current)) {
                observer.disconnect();
                resolve();
              }
            });
            observer.observe(document.body, { childList: true, subtree: true });
          });
        }
        
        if (!videoRef.current) {
          console.error("El elemento <video> no está disponible en el DOM.");
          return;
        }
        
        if (playerRef.current) {
          if (playerRef.current._cleanupSeeking) {
            playerRef.current._cleanupSeeking();
          }
          playerRef.current.dispose();
        }
        
        // ===== CONFIGURACIÓN OPTIMIZADA DEL PLAYER =====
        const player = videojs(videoRef.current, {
          controls: true,
          autoplay: true,
          muted: true, // Necesario para autoplay en navegadores modernos
          preload: "auto",
          fluid: true,
          playbackRates: [0.5, 1, 1.25, 1.5, 2],
          // NO configurar sources aquí si tenemos playlist - let playlist handle it
          ...(playlistData && playlistData.episodes.length > 0 ? {} : {
            sources: [
              {
                src: urlComplete,
                type: "application/x-mpegURL",
              },
            ]
          }),
          html5: {
            vhs: {
              overrideNative: true,
              enableLowInitialPlaylist: true,
              limitRenditionByPlayerDimensions: true,
              useDevicePixelRatio: true,
              fastQualityChange: true,
              smoothQualityChange: true,
              maxPlaylistRetries: 3,
              bandwidth: 4194304,
              initialBandwidth: 2000000,
              allowSeeksWithinUnsafeLiveWindow: true,
              playlistExclusionDuration: 60,
              maxBufferLength: 30
            },
            nativeControlsForTouch: false,
            playsinline: true,
            nativeTextTracks: false,
            preloadTextTracks: true
          },
          pip: true,
          controlBar: {
            children: [
              "playToggle",
              "skipButtons",
              "volumePanel",
              "currentTimeDisplay",
              "timeDivider", 
              "durationDisplay",
              "progressControl",
              "remainingTimeDisplay",
              "playbackRateMenuButton",
              "audioTrackButton",
              "subsCapsButton",
              "pictureInPictureToggle",
              "fullscreenToggle",
            ],
            skipButtons: {
              backward: 10, 
              forward: 10
            }
          },
        });
        
        // ===== CONFIGURAR PLAYLIST SI ESTÁ DISPONIBLE =====
        if (playlistData && playlistData.episodes.length > 0) {
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
          
          console.log('🔍 [DEBUG] Playlist configurada:', {
            totalItems: playlistItems.length,
            currentItemIndex: currentEpisodeIndex,
            playlistMethods: Object.getOwnPropertyNames(player.playlist).filter(name => typeof player.playlist[name] === 'function'),
            hasAutoadvance: typeof player.playlist.autoadvance === 'function',
            hasSetAutoadvanceDelay: typeof player.playlist.setAutoadvanceDelay === 'function',
            hasSetDelay: typeof player.playlist.setDelay === 'function',
            hasGetDelay: typeof player.playlist.getDelay === 'function'
          });
          
          // Configurar autoadvance una vez que el player esté listo
          player.ready(() => {
            // Intentar configurar autoadvance con reintentos
            let attempts = 0;
            const maxAttempts = 5;
            
            const configureAutoadvance = () => {
              attempts++;
              
              try {
                if (!player.playlist) {
                  if (attempts < maxAttempts) {
                    setTimeout(configureAutoadvance, 200);
                  }
                  return;
                }
                
                // Probar múltiples APIs disponibles
                let configSuccess = false;
                
                if (typeof player.playlist.setDelay === 'function') {
                  // API del AutoAdvance class (más probable)
                  player.playlist.setDelay(0);
                  const currentDelay = typeof player.playlist.getDelay === 'function' ? player.playlist.getDelay() : 'no verificable';
                  console.log('🔍 [DEBUG] setDelay(0) ejecutado, delay actual:', currentDelay);
                  configSuccess = true;
                } else if (typeof player.playlist.setAutoadvanceDelay === 'function') {
                  // API documentado
                  player.playlist.setAutoadvanceDelay(0);
                  console.log('🔍 [DEBUG] setAutoadvanceDelay(0) ejecutado');
                  configSuccess = true;
                } else if (typeof player.playlist.autoadvance === 'function') {
                  // API anterior/fallback
                  player.playlist.autoadvance(0);
                  const verifyDelay = player.playlist.autoadvance();
                  console.log('🔍 [DEBUG] autoadvance(0) ejecutado, valor:', verifyDelay);
                  configSuccess = verifyDelay !== undefined;
                }
                
                if (!configSuccess && attempts < maxAttempts) {
                  console.log('🔍 [DEBUG] Ningun API de autoadvance disponible, reintentando...');
                  setTimeout(configureAutoadvance, 200);
                  return;
                }
                
                // Verificar que se configuró correctamente
                let verifyDelay = 'configurado';
                if (typeof player.playlist.getDelay === 'function') {
                  verifyDelay = player.playlist.getDelay();
                } else if (typeof player.playlist.autoadvance === 'function') {
                  verifyDelay = player.playlist.autoadvance();
                }
                console.log('🔍 [DEBUG] Autoadvance configurado, valor:', verifyDelay);
                
                if ((verifyDelay === undefined || verifyDelay === 'configurado') && attempts < maxAttempts && !configSuccess) {
                  console.log('⚠️ Autoadvance no verificable, reintento', attempts, '/', maxAttempts);
                  setTimeout(configureAutoadvance, 200);
                } else {
                  console.log('✅ Autoadvance configurado con delay:', verifyDelay, 'success:', configSuccess);
                }
              } catch (error) {
                console.error('Error configurando autoadvance:', error);
                if (attempts < maxAttempts) {
                  setTimeout(configureAutoadvance, 200);
                }
              }
            };
            
            // Iniciar configuración
            configureAutoadvance();
          });
          
          // Verificación más completa del estado
          setTimeout(() => {
            const currentIdx = player.playlist.currentIndex();
            console.log('📋 VERIFICACIÓN FINAL después de configurar:', {
              currentIndex: currentIdx,
              currentItem: player.playlist.currentItem(),
              autoadvanceDelay: player.playlist.autoadvance(),
              playlistLength: player.playlist().length,
              currentSrc: player.currentSrc(),
              isPlaylistVideo: currentIdx !== -1 ? 'SÍ' : 'NO - PROBLEMA!'
            });
            
            // Si aún está en -1, forzar sincronización
            if (currentIdx === -1) {
              console.log('🚨 PROBLEMA: currentIndex sigue en -1, intentando sincronización forzada');
              player.playlist.currentItem(currentEpisodeIndex);
              
              // Verificar de nuevo
              setTimeout(() => {
                console.log('📋 DESPUÉS DE SINCRONIZACIÓN FORZADA:', {
                  currentIndex: player.playlist.currentIndex(),
                  autoadvanceDelay: player.playlist.autoadvance()
                });
              }, 200);
            }
          }, 500);
          
          console.log('📋 Playlist configurada con', playlistItems.length, 'episodios');
        }

        // Configurar subtítulos si están disponibles
        if (movieData.available_subtitles && movieData.available_subtitles.length > 0) {
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
            
            return {
              kind: 'subtitles',
              src: `${subsUrl}${subtitle}.vtt`,
              srclang: language,
              label: label,
              default: false
            };
          });
          
          setupTextTracks(player, subtitleTracks);
        }
        
        // ===== MANEJO DE CALIDAD Y BUFFER =====
        player.ready(() => {
          // Monitorear cambios de calidad
          const qualityLevels = player.qualityLevels();
          
          qualityLevels.on('change', () => {
            analyticsRef.current.qualityChanges++;
            const activeLevel = qualityLevels.levels_.find(level => level.enabled);
            if (activeLevel) {
              const quality = activeLevel.height ? `${activeLevel.height}p` : 'Auto';
              setCurrentQuality(quality);
            }
          });
          
          // Monitorear progreso de buffer
          player.on('progress', () => {
            const bufferedEnd = player.bufferedEnd();
            const duration = player.duration();
            if (duration > 0) {
              const percentage = (bufferedEnd / duration) * 100;
              setBufferPercentage(percentage);
            }
          });
        });
        
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

        // Configurar quality selector
        if (player.hlsQualitySelector) {
          player.hlsQualitySelector({
            displayCurrentQuality: true,
          });
        }

        // ===== CONFIGURACIÓN DE HOTKEYS =====
        player.ready(() => {
          player.hotkeys({
            volumeStep: 0.1,
            seekStep: 10,
            enableModifiersForNumbers: false,
            enableVolumeScroll: false,
            enableHoverScroll: false,
            enableFullscreenToggle: true,
            enableNumbers: false,
            customKeys: {
              spaceKey: {
                key: function(event) {
                  return (event.which === 32);
                },
                handler: function(player, _options, event) {
                  event.preventDefault();
                  if (player.paused()) {
                    player.play();
                  } else {
                    player.pause();
                  }
                }
              },
              leftArrow: {
                key: function(event) {
                  return (event.which === 37);
                },
                handler: function(player) {
                  handleSkip(player, 10, 'backward');
                }
              },
              rightArrow: {
                key: function(event) {
                  return (event.which === 39);
                },
                handler: function(player) {
                  handleSkip(player, 10, 'forward');
                }
              },
              // Agregar teclas J y L para skip de 10s
              jKey: {
                key: function(event) {
                  return (event.which === 74); // J
                },
                handler: function(player) {
                  handleSkip(player, 10, 'backward');
                }
              },
              lKey: {
                key: function(event) {
                  return (event.which === 76); // L
                },
                handler: function(player) {
                  handleSkip(player, 10, 'forward');
                }
              }
            }
          });
        });

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

        // ===== MANEJO DE ERRORES MEJORADO =====
        let retryCount = 0;
        const maxRetries = 3;
        
        player.on('error', () => {
          const error = player.error();
          console.error('VideoJS Error:', error);
          
          // Retry logic para errores de red
          if (error && error.code === 2 && retryCount < maxRetries) {
            retryCount++;
            console.log(`🔄 Reintentando conexión (${retryCount}/${maxRetries})...`);
            
            setTimeout(() => {
              if (!player.isDisposed()) {
                player.src({ src: urlComplete, type: 'application/x-mpegURL' });
                player.load();
                player.play().catch(playError => {
                  console.error('Error al reintentar reproducción:', playError);
                });
              }
            }, 3000);
          } else if (error && error.code === 4) {
            // Error de medios
            setError('Error al cargar el video. El formato puede no ser compatible.');
            player.errorDisplay.content('Error al cargar el video. Por favor, intenta más tarde.');
          } else {
            // Otros errores
            setError('Ha ocurrido un error. Por favor, recarga la página.');
          }
        });
        
        // Reset retry count en reproducción exitosa
        player.on('playing', () => {
          if (retryCount > 0) {
            console.log('✅ Conexión reestablecida exitosamente');
            retryCount = 0;
          }
        });

        // ===== EVENT LISTENERS ADICIONALES =====
        player.on('play', () => {
          setIsPlaying(true);
        });
        
        player.on('pause', () => {
          setIsPlaying(false);
          savePlayerPreferences();
        });
        
        // Usar eventos oficiales de Video.js según documentación
        player.on('useractive', () => {
          if (overlayRef.current) {
            overlayRef.current.showControls();
          }
        });
        
        player.on('userinactive', () => {
          if (overlayRef.current) {
            overlayRef.current.hideControls();
          }
        });
        
        // ===== PICTURE-IN-PICTURE MEJORADO =====
        player.on('enterpictureinpicture', () => {
          console.log('📺 Entered PiP mode');
        });

        player.on('leavepictureinpicture', () => {
          console.log('📺 Left PiP mode');
        });
        
        // Guardar preferencias periódicamente
        const saveInterval = setInterval(() => {
          try {
            if (!player.isDisposed() && player.paused && typeof player.paused === 'function' && !player.paused()) {
              savePlayerPreferences();
            }
          } catch (error) {
            console.warn('⚠️ Error en saveInterval:', error);
            // Si hay error, limpiar el intervalo
            clearInterval(saveInterval);
          }
        }, 30000); // Cada 30 segundos
        
        // Inicializar analytics
        initializeAnalytics(player);

        playerRef.current = player;
        
        // Cleanup del intervalo
        return () => {
          clearInterval(saveInterval);
        };
        
      } catch (error) {
        console.error("Error initializing player:", error);
        setError('Error al inicializar el reproductor. Por favor, recarga la página.');
      }
    };

    initializePlayer();
    
    return () => {
      savePlayerPreferences();
      if (playerRef.current && !playerRef.current.isDisposed()) {
        if (playerRef.current._cleanupSeeking) {
          playerRef.current._cleanupSeeking();
        }
        playerRef.current.dispose();
      }
    };
  }, [urlComplete, movieData, loading, subsUrl, handleSkip, savePlayerPreferences, setupTextTracks, initializeAnalytics, playlistData, resolutions, cdnUrl, currentEpisodeIndex]);

  // ===== SINCRONIZAR ESTADO CON PLAYLIST - DESHABILITADO TEMPORALMENTE =====
  // useEffect(() => {
  //   // NOTA: Deshabilitado porque puede interferir con el cambio manual de episodios
  //   console.log('📋 Sincronización de playlist deshabilitada');
  // }, [playlistData, playlistKey, resolutions]);

  // ===== VALIDACIONES =====
  if (!movieId) {
    return (
      <div className="video-player-container">
        <div className="video-info">
          <h2>Error: ID de video no encontrado</h2>
          <p>Verifica que la URL sea correcta</p>
        </div>
      </div>
    );
  }

  if (!resolutions) {
    return (
      <div className="video-player-container">
        <div className="video-info">
          <h2>Error: Resoluciones no encontradas</h2>
          <p>Verifica que la URL contenga parámetros de resolución</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="video-player-container">
        <div className="video-info">
          <h2>Cargando {contentType === 'episode' ? 'episodio' : 'película'}...</h2>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="video-player-container">
        <div className="video-info">
          <h2>Error</h2>
          <p>{error}</p>
          <Button 
            onClick={handleGoBack}
            variant="primary"
            size="md"
          >
            Regresar
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="video-player-container">
      <Button 
        className="back-button"
        onClick={handleGoBack}
        ariaLabel="Regresar"
        variant="secondary"
        size="md"
        icon="←"
        iconPosition="left"
      >
        Regresar
      </Button>

      <div className="video-wrapper">
        <div className="video-container">
          {/* Indicadores de estado */}
          <div className="video-status-indicators">
            {currentQuality && (
              <span className="quality-indicator">
                📺 {currentQuality}
              </span>
            )}
            {bufferPercentage > 0 && (
              <span className="buffer-indicator">
                ⏳ Buffer: {bufferPercentage.toFixed(0)}%
              </span>
            )}
          </div>
          
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-default-skin vjs-big-play-centered"
              controls
              playsInline
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
          
          {/* Portal para el overlay de controles */}
          {overlayContainerRef.current && movieData && createPortal(
            <VideoPlayerOverlay
              ref={overlayRef}
              onSkipBack={() => handleSkip(playerRef.current, 10, 'backward')}
              onPlayPause={() => {
                if (playerRef.current) {
                  if (playerRef.current.paused()) {
                    playerRef.current.play();
                  } else {
                    playerRef.current.pause();
                  }
                }
              }}
              onSkipForward={() => handleSkip(playerRef.current, 10, 'forward')}
              isPlaying={isPlaying}
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

export { VideoPlayer };