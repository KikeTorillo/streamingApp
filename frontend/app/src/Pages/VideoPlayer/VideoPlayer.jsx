import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "jb-videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css";
import "jb-videojs-hls-quality-selector";
import "videojs-overlay";
import "videojs-hotkeys";
import "./VideoPlayer.css";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getMovieByHashService } from '../../services/Movies/getMovieByIdService';
import { getEpisodeByHashService } from '../../services/Episodes/getEpisodeByHashService';
import { Button } from '../../components/atoms/Button/Button';
import { VideoPlayerOverlay } from '../../components/organisms/VideoPlayerOverlay/VideoPlayerOverlay';

const VideoPlayer = () => {
  const {movieId} = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resolutions = searchParams.get('resolutions');
  const contentType = searchParams.get('type') || 'movie';
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const overlayContainerRef = useRef(null);
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

  const cdnUrl = import.meta.env.VITE_CDN_URL || 'http://localhost:8082';
  const baseUrl = `${cdnUrl}/hls/${movieId}/`;
  const subsUrl = `${cdnUrl}/subs/${movieId}/`;
  const urlComplete = `${baseUrl}_,${resolutions},p.mp4.play/master.m3u8`;
  
  // ===== FUNCIÓN DE SKIP OPTIMIZADA =====
  const handleSkipOptimized = useCallback((player, seconds, direction) => {
    if (!player || player.readyState() < 1) {
      console.warn('🎬 Player no está listo para seeking');
      return;
    }
    
    const currentTime = player.currentTime();
    const duration = player.duration();
    
    if (!duration || duration === Infinity) {
      console.warn('🎬 Duración no disponible para seeking');
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
      console.log(`🎬 Skip ${direction} ${seconds}s: ${currentTime.toFixed(2)}s → ${newTime.toFixed(2)}s`);
    } catch (error) {
      console.error('🎬 Error en seeking:', error);
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
            console.log(`📍 Posición restaurada: ${savedPosition.position}s`);
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
    }
  }, [movieId]);

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
      const sessionDuration = (Date.now() - analyticsRef.current.sessionStartTime) / 1000;
      const completionRate = (analyticsRef.current.watchTime / player.duration()) * 100;
      
      console.log('📊 Analytics - Video completado:', {
        watchTime: analyticsRef.current.watchTime.toFixed(2) + 's',
        sessionDuration: sessionDuration.toFixed(2) + 's',
        completionRate: completionRate.toFixed(2) + '%',
        rebufferCount: analyticsRef.current.rebufferCount,
        qualityChanges: analyticsRef.current.qualityChanges
      });
      
      // Aquí puedes enviar estos datos a tu servicio de analytics
    });
    
    // Tracking de rebuffering
    player.on('waiting', () => {
      analyticsRef.current.rebufferCount++;
      console.log(`⏳ Rebuffering #${analyticsRef.current.rebufferCount}`);
    });
    
    // Tracking de pausas
    player.on('pause', () => {
      if (!player.seeking()) {
        console.log('⏸️ Video pausado en:', player.currentTime().toFixed(2) + 's');
      }
    });
  }, []);

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
        console.log(`🎬 Loading ${contentType} with hash:`, movieId);
        
        let contentData;
        if (contentType === 'episode') {
          contentData = await getEpisodeByHashService(movieId);
        } else {
          contentData = await getMovieByHashService(movieId);
        }
        
        setMovieData(contentData);
        console.log(`✅ ${contentType} data loaded:`, contentData);
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
  }, [movieId, contentType]);

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
          playerRef.current.dispose();
        }
        
        // Configurar subtítulos
        const subtitleTracks = [];
        if (movieData.available_subtitles && movieData.available_subtitles.length > 0) {
          movieData.available_subtitles.forEach(subtitle => {
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
            
            subtitleTracks.push({
              kind: 'subtitles',
              src: `${subsUrl}${subtitle}.vtt`,
              srclang: language,
              label: label,
              default: false
            });
          });
        }

        // ===== CONFIGURACIÓN OPTIMIZADA DEL PLAYER =====
        const player = videojs(videoRef.current, {
          controls: true,
          autoplay: true,
          preload: "auto",
          fluid: true,
          sources: [
            {
              src: urlComplete,
              type: "application/x-mpegURL",
            },
          ],
          html5: {
            vhs: {
              overrideNative: true,
              nativeAudioTracks: false,
              nativeVideoTracks: false,
              enableLowInitialPlaylist: true,
              limitRenditionByPlayerDimensions: true,
              useDevicePixelRatio: true,
              fastQualityChange: true,
              smoothQualityChange: true,
              maxPlaylistRetries: 3,
              bandwidth: 4194304,
              playlistExclusionDuration: 60,
              // Mejoras de buffering
              experimentalBufferBasedABR: true,
              experimentalLLHLS: true,
              allowSeeksWithinUnsafeLiveWindow: true,
              handlePartialData: true,
              useBandwidthFromLocalStorage: true,
              maxBufferLength: 30,
              bufferBasedABR: true,
              startLevel: -1,
            },
            nativeControlsForTouch: false,
            playsinline: true,
            nativeTextTracks: false,
            preloadTextTracks: true,
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
        
        // ===== MANEJO ROBUSTO DE EVENTOS SEEKING/SEEKED =====
        let isSeekingInProgress = false;
        
        player.on('seeking', function() {
          isSeekingInProgress = true;
          console.log('🎬 Seeking iniciado');
        });
        
        player.on('seeked', function() {
          isSeekingInProgress = false;
          console.log('🎬 Seeked completado');
          
          // Re-sincronizar text tracks mejorado
          const textTracks = player.textTracks();
          const currentTime = player.currentTime();
          
          for (let i = 0; i < textTracks.length; i++) {
            const track = textTracks[i];
            if (track.mode === 'showing' && track.cues) {
              // Forzar actualización de cues
              track.oncuechange = null;
              track.oncuechange = () => {
                if (!isSeekingInProgress) {
                  console.log('🎬 Cue actualizado:', track.label);
                }
              };
              
              // Buscar cue activo manualmente
              for (let j = 0; j < track.cues.length; j++) {
                const cue = track.cues[j];
                if (currentTime >= cue.startTime && currentTime <= cue.endTime) {
                  console.log('🎬 Cue activo encontrado:', cue.text);
                  break;
                }
              }
            }
          }
        });
        
        // ===== CONFIGURACIÓN DE TEXT TRACKS =====
        player.ready(() => {
          if (subtitleTracks.length > 0) {
            subtitleTracks.forEach((track) => {
              console.log('🎬 Añadiendo text track:', track.label);
              const textTrack = player.addRemoteTextTrack(track, false);
              
              if (textTrack && textTrack.track) {
                textTrack.track.addEventListener('load', () => {
                  console.log('🎬 Text track cargado:', track.label);
                });
                
                textTrack.track.addEventListener('error', (e) => {
                  console.error('❌ Error cargando subtítulo:', track.label, e);
                });
              }
            });
            
            // Configurar subtítulos por defecto después de cargar metadata
            player.on('loadedmetadata', () => {
              const textTracks = player.textTracks();
              const preferences = JSON.parse(localStorage.getItem('playerPreferences') || '{}');
              
              // Deshabilitar todos primero
              for (let i = 0; i < textTracks.length; i++) {
                textTracks[i].mode = 'disabled';
              }
              
              // Intentar restaurar subtítulo preferido
              if (preferences.selectedTextTrack) {
                for (let i = 0; i < textTracks.length; i++) {
                  const track = textTracks[i];
                  if (track.language === preferences.selectedTextTrack.language &&
                      track.label === preferences.selectedTextTrack.label) {
                    track.mode = 'showing';
                    console.log('🎬 Subtítulos preferidos restaurados:', track.label);
                    return;
                  }
                }
              }
              
              // Si no hay preferencia, activar primer subtítulo español no forzado
              for (let i = 0; i < textTracks.length; i++) {
                const track = textTracks[i];
                if (track.kind === 'subtitles' && track.language === 'es' && !track.label.includes('Forzado')) {
                  track.mode = 'showing';
                  console.log('🎬 Subtítulos activados por defecto:', track.label);
                  break;
                }
              }
            });
          }
          
          // Cargar preferencias del usuario
          loadPlayerPreferences(player);
        });
        
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
              console.log(`📺 Calidad activa: ${quality}`);
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
                  handleSkipOptimized(player, 10, 'backward');
                }
              },
              rightArrow: {
                key: function(event) {
                  return (event.which === 39);
                },
                handler: function(player) {
                  handleSkipOptimized(player, 10, 'forward');
                }
              },
              // Agregar teclas J y L para skip de 10s
              jKey: {
                key: function(event) {
                  return (event.which === 74); // J
                },
                handler: function(player) {
                  handleSkipOptimized(player, 10, 'backward');
                }
              },
              lKey: {
                key: function(event) {
                  return (event.which === 76); // L
                },
                handler: function(player) {
                  handleSkipOptimized(player, 10, 'forward');
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
        
        player.on('error', (e) => {
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
        
        player.on('useractive', () => {
          const overlay = overlayContainerRef.current?.querySelector('.video-player-overlay');
          if (overlay && overlay.showControls) {
            overlay.showControls();
          }
        });
        
        player.on('userinactive', () => {
          const overlay = overlayContainerRef.current?.querySelector('.video-player-overlay');
          if (overlay && overlay.hideControls) {
            overlay.hideControls();
          }
        });
        
        // Click handler para overlay
        player.el().addEventListener('click', (e) => {
          if (e.target === player.el().querySelector('video')) {
            const overlay = overlayContainerRef.current?.querySelector('.video-player-overlay');
            if (overlay && overlay.showControls) {
              overlay.showControls();
            }
          }
        });
        
        // ===== PICTURE-IN-PICTURE MEJORADO =====
        player.on('enterpictureinpicture', () => {
          console.log('📺 Entered PiP mode');
          // Puedes ajustar controles o UI para PiP aquí
        });

        player.on('leavepictureinpicture', () => {
          console.log('📺 Left PiP mode');
          // Restaurar controles normales
        });
        
        // Guardar preferencias periódicamente
        const saveInterval = setInterval(() => {
          if (!player.paused() && !player.isDisposed()) {
            savePlayerPreferences();
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
        playerRef.current.dispose();
      }
    };
  }, [urlComplete, movieData, loading, subsUrl, handleSkipOptimized, savePlayerPreferences, loadPlayerPreferences, initializeAnalytics]);

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
              onSkipBack={() => handleSkipOptimized(playerRef.current, 10, 'backward')}
              onPlayPause={() => {
                if (playerRef.current) {
                  if (playerRef.current.paused()) {
                    playerRef.current.play();
                  } else {
                    playerRef.current.pause();
                  }
                }
              }}
              onSkipForward={() => handleSkipOptimized(playerRef.current, 10, 'forward')}
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