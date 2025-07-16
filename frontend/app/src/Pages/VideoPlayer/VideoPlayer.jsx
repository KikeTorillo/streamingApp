import { useEffect, useRef, useState } from "react";
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
  const contentType = searchParams.get('type') || 'movie'; // Default a movie
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const overlayContainerRef = useRef(null);
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const cdnUrl = import.meta.env.VITE_CDN_URL || 'http://localhost:8082';
  const baseUrl = `${cdnUrl}/hls/${movieId}/`;
  const subsUrl = `${cdnUrl}/subs/${movieId}/`;
  
  const urlComplete = `${baseUrl}_,${resolutions},p.mp4.play/master.m3u8`;

  // Función para manejar el botón de regresar
  const handleGoBack = () => {
    // Si el reproductor está en pantalla completa, salir primero
    if (playerRef.current && playerRef.current.isFullscreen()) {
      playerRef.current.exitFullscreen();
    }
    
    if (playerRef.current) {
      playerRef.current.pause();
    }
    navigate(-1);
  };



  // Load content data (movie or episode)
  useEffect(() => {
    const loadContentData = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadContentData();
    }
  }, [movieId, contentType]);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        if (!movieData || loading) {
          return;
        }
        
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        if (!videoRef.current) {
          console.error("El elemento <video> no está disponible en el DOM.");
          return;
        }
        
        if (playerRef.current) {
          playerRef.current.dispose();
        }
        
        // Prepare subtitles
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
            
            const track = {
              kind: 'subtitles',
              src: `${subsUrl}${subtitle}.vtt`,
              srclang: language,
              label: label,
              default: false
            };
            
            subtitleTracks.push(track);
          });
        }

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
              smoothSeekingEnabled: true,
              enableLowInitialPlaylist: true,
              fastQualityChange: true,
              maxPlaylistRetries: 3,
              seekingEnabled: true,
              seekingTimeMargin: 2,
              bandwidth: 4194304,
              playlistExclusionDuration: 60,
              maxBufferLength: 30,
              maxMaxBufferLength: 120,
              audioBufferLength: 30,
              bufferBasedABR: true,
              experimentalBufferBasedABR: false,
              experimentalLLHLS: false,
              allowSeeksWithinUnsafeLiveWindow: true,
              useBandwidthFromLocalStorage: false,
            },
            nativeControlsForTouch: false,
            playsinline: true,
            nativeTextTracks: false,
            preloadTextTracks: true,
          },
          pip: true,
          controlBar: {
            // ===== SKIP BUTTONS NATIVOS DE VIDEOJS 8.x =====
            skipButtons: {
              forward: 10,
              backward: 10
            },
            children: [
              "playToggle",
              "skipBackward",
              "skipForward",
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
          },
        });
        
        // Variables para tracking de seeking y sincronización
        let seekStart = null;
        let previousTime = 0;
        let seekingTimeout = null;
        let syncCheckInterval = null;
        let isProcessingSeek = false;
        let subtitleOffset = 0; // Offset en segundos para subtítulos
        let lastSyncTime = 0; // Timestamp de la última sincronización para cooldown
        let lastCorrectionTime = 0; // Timestamp de la última corrección
        
        const resyncSubtitles = () => {
          const textTracks = player.textTracks();
          
          for (let i = 0; i < textTracks.length; i++) {
            const track = textTracks[i];
            if (track.getAttribute && track.getAttribute('data-resync') === 'true') {
              const wasShowing = track.mode === 'showing';
              track.mode = 'disabled';
              
              setTimeout(() => {
                if (wasShowing) {
                  track.mode = 'showing';
                  // Aplicar offset de subtítulos si existe
                  if (subtitleOffset !== 0) {
                    console.log('🎬 Aplicando offset de subtítulos:', subtitleOffset, 'segundos');
                    const currentTime = player.currentTime();
                    player.trigger('timeupdate', { target: { currentTime: currentTime + subtitleOffset } });
                  }
                }
                if (track.removeAttribute) {
                  track.removeAttribute('data-resync');
                }
              }, 50);
            }
          }
        };
        
        // Función para forzar sincronización audio-video
        const forceSyncronization = () => {
          if (isProcessingSeek) return;
          
          const videoElement = player.el().querySelector('video');
          if (!videoElement) return;
          
          const playerTime = player.currentTime();
          const videoTime = videoElement.currentTime;
          const timeDiff = Math.abs(videoTime - playerTime);
          
          // Ajustar umbral de tolerancia para HLS (500ms es más apropiado)
          if (timeDiff > 0.8) {
            console.log('⚠️ Sincronizando audio-video. Diferencia:', timeDiff.toFixed(3), 'segundos');
            videoElement.currentTime = playerTime;
            
            // Esperar a que se complete el ajuste
            setTimeout(() => {
              if (Math.abs(videoElement.currentTime - playerTime) > 0.2) {
                videoElement.currentTime = playerTime;
              }
            }, 100);
          }
        };
        
        // Manejar eventos de seeking para sincronización mejorada
        player.on('timeupdate', function() {
          if (!isProcessingSeek) {
            previousTime = player.currentTime();
          }
        });
        
        player.on('seeking', function() {
          isProcessingSeek = true;
          
          if (seekStart === null) {
            seekStart = previousTime;
          }
          
          // Marcar subtítulos para re-sincronización
          const textTracks = player.textTracks();
          for (let i = 0; i < textTracks.length; i++) {
            const track = textTracks[i];
            if (track.mode === 'showing' && track.setAttribute) {
              track.setAttribute('data-resync', 'true');
            }
          }
          
          // Limpiar timeout anterior
          if (seekingTimeout) {
            clearTimeout(seekingTimeout);
          }
        });
        
        player.on('seeked', function() {
          const currentTime = player.currentTime();
          const seekDistance = Math.abs(currentTime - (seekStart || 0));
          
          // Re-sincronizar después de seek
          seekingTimeout = setTimeout(() => {
            isProcessingSeek = false;
            
            // Forzar sincronización inmediata después del seek
            forceSyncronization();
            
            // Re-sincronizar subtítulos si es necesario
            if (seekDistance > 0.8) {
              resyncSubtitles();
            }
            
            player.trigger('timeupdate');
          }, 200);
          
          seekStart = null;
        });
        
        // Manejar cambios de text tracks con monitoreo de sincronización
        player.on('texttrackchange', function() {
          const currentTime = player.currentTime();
          console.log('Text track changed at time:', currentTime);
          
          // Verificar sincronización cada vez que cambian los subtítulos
          setTimeout(() => {
            const textTracks = player.textTracks();
            for (let i = 0; i < textTracks.length; i++) {
              const track = textTracks[i];
              if (track.mode === 'showing') {
                console.log('Subtítulo activo sincronizado a:', currentTime, 'segundos');
                break;
              }
            }
          }, 50);
        });
        
        // Monitoreo periódico de sincronización (optimizado con cooldown)
        syncCheckInterval = setInterval(() => {
          // Solo verificar si no estamos procesando un seek
          if (!isProcessingSeek && !player.paused()) {
            forceSyncronization();
            
            const now = Date.now();
            // Cooldown de 3 segundos entre correcciones para evitar parpadeo
            if (now - lastCorrectionTime < 3000) {
              return;
            }
            
            // Verificar sincronización de subtítulos con corrección más inteligente
            const textTracks = player.textTracks();
            for (let i = 0; i < textTracks.length; i++) {
              const track = textTracks[i];
              if (track.mode === 'showing' && track.cues) {
                const currentTime = player.currentTime();
                const activeCues = track.activeCues;
                
                // Si hay subtítulos activos pero parecen estar desincronizados
                if (activeCues && activeCues.length > 0) {
                  const cue = activeCues[0];
                  const cueTime = cue.startTime;
                  const timeDiff = Math.abs(currentTime - cueTime);
                  
                  // Detectar retraso con umbral más alto para evitar correcciones excesivas
                  const isSubtitleLate = currentTime > cueTime;
                  if (timeDiff > 0.3 && isSubtitleLate) {
                    console.log('🎬 Detectado desajuste de subtítulos en monitoreo:', {
                      expected: cueTime,
                      actual: currentTime,
                      diff: timeDiff,
                      text: cue.text.substring(0, 30) + '...'
                    });
                    
                    // Aplicar corrección con cooldown
                    lastCorrectionTime = now;
                    setTimeout(() => {
                      const textTracks = player.textTracks();
                      for (let j = 0; j < textTracks.length; j++) {
                        const textTrack = textTracks[j];
                        if (textTrack.mode === 'showing') {
                          textTrack.mode = 'disabled';
                          setTimeout(() => {
                            textTrack.mode = 'showing';
                            console.log('🎬 Subtítulos re-sincronizados (umbral 0.3s con cooldown)');
                          }, 100);
                        }
                      }
                    }, 50);
                  }
                }
              }
            }
          }
        }, 3000); // Verificar cada 3 segundos
        
        // Eventos para forzar sincronización en momentos críticos (optimizados)
        player.on('loadeddata', function() {
          console.log('🎬 Video data loaded, iniciando sincronización');
          setTimeout(() => {
            forceSyncronization();
          }, 250);
        });
        
        player.on('canplay', function() {
          console.log('🎬 Video can play, verificando sincronización');
          setTimeout(() => {
            forceSyncronization();
          }, 100);
        });
        
        player.on('playing', function() {
          console.log('🎬 Video playing, sincronizando audio/video');
          setTimeout(() => {
            forceSyncronization();
          }, 50);
        });
        
        // Limpiar intervalo cuando se destruya el player
        const originalDispose = player.dispose;
        player.dispose = function() {
          if (syncCheckInterval) {
            clearInterval(syncCheckInterval);
          }
          if (seekingTimeout) {
            clearTimeout(seekingTimeout);
          }
          originalDispose.call(this);
        };
        
        // Wait for video metadata to load before adding subtitles
        player.ready(() => {
          if (subtitleTracks.length > 0) {
            subtitleTracks.forEach((track) => {
              console.log('Adding subtitle track:', track.label, 'URL:', track.src);
              const textTrack = player.addRemoteTextTrack(track, false);
              
              // Monitorear la carga de subtítulos para ajustar sincronización
              if (textTrack && textTrack.track) {
                textTrack.track.addEventListener('load', () => {
                  console.log('🎬 Subtítulos cargados para:', track.label);
                  
                  // Aplicar offset si se ha detectado desincronización
                  if (subtitleOffset !== 0) {
                    console.log('🎬 Aplicando offset de', subtitleOffset, 'segundos a subtítulos');
                    const cues = textTrack.track.cues;
                    if (cues) {
                      for (let i = 0; i < cues.length; i++) {
                        const cue = cues[i];
                        cue.startTime += subtitleOffset;
                        cue.endTime += subtitleOffset;
                      }
                    }
                  }
                });
              }
            });
          }
          
          // Entrar automáticamente a pantalla completa cuando el reproductor esté listo
          setTimeout(() => {
            if (player.requestFullscreen) {
              player.requestFullscreen()
                .then(() => {
                  console.log('✅ Pantalla completa activada automáticamente');
                })
                .catch((err) => {
                  console.warn('⚠️ No se pudo activar pantalla completa automáticamente:', err.message);
                });
            }
          }, 500);
        });

        // Enable quality selection - VideoJS 8.x compatible
        if (player.hlsQualitySelector) {
          player.hlsQualitySelector({
            displayCurrentQuality: true,
          });
        }

        // ===== CONFIGURAR PLUGINS =====
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
                handler: function() {
                  handleSkip(10, 'backward');
                }
              },
              rightArrow: {
                key: function(event) {
                  return (event.which === 39);
                },
                handler: function() {
                  handleSkip(10, 'forward');
                }
              }
            }
          });
        });

        // Configurar overlay para controles centrales usando React Portal
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
          
          // Usar la API de overlay de Video.js para montar el contenedor
          player.overlay({
            overlays: [{
              content: overlayContainer,
              start: 0,
              end: 'end'
            }]
          });
        });

        // ===== FUNCIONES AUXILIARES =====
        
        // Función para mostrar overlay de skip
        const showSkipOverlay = (player, text, direction) => {
          const overlay = player.el().querySelector('.vjs-overlay');
          if (overlay) {
            const skipIndicator = document.createElement('div');
            skipIndicator.className = 'skip-indicator';
            skipIndicator.style.cssText = `
              position: absolute;
              top: 50%;
              ${direction === 'left' ? 'left: 20%' : 'right: 20%'};
              transform: translateY(-50%);
              background-color: rgba(0, 0, 0, 0.8);
              color: var(--text-on-primary);
              padding: var(--space-md) var(--space-lg);
              border-radius: var(--radius-lg);
              font-size: var(--font-size-lg);
              font-weight: var(--font-weight-bold);
              z-index: 2000;
              animation: skipFade 1s ease-out forwards;
            `;
            skipIndicator.textContent = text;
            
            overlay.appendChild(skipIndicator);
            
            // Remover después de 1 segundo
            setTimeout(() => {
              if (skipIndicator.parentNode) {
                skipIndicator.parentNode.removeChild(skipIndicator);
              }
            }, 1000);
          }
        };

        player.on('play', () => {
          setIsPlaying(true);
        });
        
        player.on('pause', () => {
          setIsPlaying(false);
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
        
        // Mostrar overlay al hacer click en el video
        player.el().addEventListener('click', (e) => {
          if (e.target === player.el().querySelector('video')) {
            const overlay = overlayContainerRef.current?.querySelector('.video-player-overlay');
            if (overlay && overlay.showControls) {
              overlay.showControls();
            }
          }
        });

        const handleSkip = (seconds, direction) => {
          const currentTime = player.currentTime();
          const duration = player.duration();
          
          if (direction === 'backward') {
            player.currentTime(Math.max(0, currentTime - seconds));
          } else {
            player.currentTime(Math.min(duration, currentTime + seconds));
          }
          
          // Mostrar overlay de skip
          const text = direction === 'backward' ? `⏪ ${seconds}s` : `${seconds}s ⏩`;
          showSkipOverlay(player, text, direction === 'backward' ? 'left' : 'right');
        };
        
        // ===== CONTROLES PERSONALIZADOS COMO ALTERNATIVA =====
        // Si los botones nativos no funcionan, agregamos controles personalizados
        setTimeout(() => {
          const skipBackwardButton = player.getChild('controlBar').getChild('skipBackward');
          const skipForwardButton = player.getChild('controlBar').getChild('skipForward');
          
          if (!skipBackwardButton || !skipForwardButton) {
            console.log('⚠️ Botones nativos de skip no encontrados, usando controles personalizados');
            
            // Crear botones personalizados usando la API de VideoJS
            const Button = videojs.getComponent('Button');
            
            // Botón de retroceder 10 segundos
            class SkipBackwardButton extends Button {
              constructor(player, options) {
                super(player, options);
                this.controlText('Retroceder 10 segundos');
              }
              
              handleClick() {
                handleSkip(10, 'backward');
              }
            }
            
            // Botón de avanzar 10 segundos
            class SkipForwardButton extends Button {
              constructor(player, options) {
                super(player, options);
                this.controlText('Avanzar 10 segundos');
              }
              
              handleClick() {
                handleSkip(10, 'forward');
              }
            }
            
            // Registrar los componentes
            videojs.registerComponent('SkipBackwardButton', SkipBackwardButton);
            videojs.registerComponent('SkipForwardButton', SkipForwardButton);
            
            // Agregar los botones a la barra de controles
            const controlBar = player.getChild('controlBar');
            
            const skipBackward = new SkipBackwardButton(player, {
              text: '⏪10',
              className: 'custom-skip-backward'
            });
            
            const skipForward = new SkipForwardButton(player, {
              text: '10⏩',
              className: 'custom-skip-forward'
            });
            
            // Insertar después del botón de play
            controlBar.addChild(skipBackward, {}, 1);
            controlBar.addChild(skipForward, {}, 2);
          }
        }, 1000);




        // Add listeners for subtitle events
        player.on('texttrackchange', () => {
          console.log('Text track changed');
        });



        // Handle subtitle activation and audio tracks after video loads
        player.on("loadedmetadata", () => {
          // Configure subtitles after metadata is loaded with better timing
          player.ready(() => {
            setTimeout(() => {
              const textTracks = player.textTracks();
              for (let i = 0; i < textTracks.length; i++) {
                const track = textTracks[i];
                if (track.kind === 'subtitles') {
                  track.mode = 'disabled';
                }
              }
              
              // Enable the first Spanish subtitle track (non-forced)
              for (let i = 0; i < textTracks.length; i++) {
                const track = textTracks[i];
                console.log('Text track found:', track.label, 'Mode:', track.mode, 'Language:', track.language);
                if (track.kind === 'subtitles' && track.language === 'es' && !track.label.includes('Forzado')) {
                  track.mode = 'showing';
                  console.log('Subtítulos activados:', track.label);
                  
                  // Configurar listener para cues cargadas
                  track.addEventListener('cuechange', () => {
                    const currentTime = player.currentTime();
                    const activeCues = track.activeCues;
                    
                    if (activeCues && activeCues.length > 0) {
                      const cue = activeCues[0];
                      console.log('🎬 Cue activa:', cue.text, 'en tiempo:', cue.startTime, 'video en:', currentTime);
                      
                      // Detectar desincronización automáticamente con cooldown
                      const timeDiff = Math.abs(currentTime - cue.startTime);
                      const isSubtitleLate = currentTime > cue.startTime;
                      const now = Date.now();
                      
                      // Detectar retraso solo si hay un retraso significativo y no hay cooldown activo
                      if (timeDiff > 0.4 && isSubtitleLate && subtitleOffset === 0 && (now - lastSyncTime > 2000)) {
                        subtitleOffset = currentTime - cue.startTime;
                        lastSyncTime = now;
                        console.log('🎬 Detectado retraso de subtítulos:', subtitleOffset, 'segundos');
                        
                        // Aplicar corrección inmediata re-sincronizando el track con cooldown
                        setTimeout(() => {
                          const wasShowing = track.mode === 'showing';
                          track.mode = 'disabled';
                          setTimeout(() => {
                            if (wasShowing) {
                              track.mode = 'showing';
                              console.log('🎬 Subtítulos re-sincronizados en cuechange');
                            }
                          }, 100);
                        }, 50);
                      }
                      
                      // Log solo para retrasos significativos
                      if (timeDiff > 0.2) {
                        console.log('🎬 Sync check:', {
                          text: cue.text.substring(0, 20) + '...',
                          expected: cue.startTime,
                          actual: currentTime,
                          diff: timeDiff,
                          late: isSubtitleLate
                        });
                      }
                    }
                  });
                  
                  // Forzar sincronización inmediata con el audio
                  player.trigger('texttrackchange');
                  player.trigger('timeupdate');
                  break;
                }
              }
            }, 200); // Aumentar timeout para mejor carga
          });
        });



        // Error handling
        player.on('error', (e) => {
          console.error('VideoJS Error:', e);
          const error = player.error();
          if (error) {
            console.error('Error details:', error);
          }
        });

        playerRef.current = player;
        
      } catch (error) {
        console.error("Error initializing player:", error);
      }
    };

    initializePlayer();
    
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [urlComplete, movieData, loading, subsUrl]);


  // Validate required parameters
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
          <h2>Cargando película...</h2>
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
              onSkipBack={() => {
                if (playerRef.current) {
                  // Usar la función handleSkip para mantener consistencia con la sincronización
                  const currentTime = playerRef.current.currentTime();
                  
                  // Aplicar el cambio usando el método del player para activar eventos
                  playerRef.current.currentTime(Math.max(0, currentTime - 10));
                  
                  // Activar manualmente los eventos de seeking para sincronización
                  playerRef.current.trigger('seeking');
                  setTimeout(() => {
                    playerRef.current.trigger('seeked');
                  }, 50);
                  
                  const overlay = playerRef.current.el().querySelector('.vjs-overlay');
                  if (overlay) {
                    const skipIndicator = document.createElement('div');
                    skipIndicator.className = 'skip-indicator';
                    skipIndicator.style.cssText = `
                      position: absolute;
                      top: 50%;
                      left: 20%;
                      transform: translateY(-50%);
                      background-color: rgba(0, 0, 0, 0.8);
                      color: var(--text-on-primary);
                      padding: var(--space-md) var(--space-lg);
                      border-radius: var(--radius-lg);
                      font-size: var(--font-size-lg);
                      font-weight: var(--font-weight-bold);
                      z-index: 2000;
                      animation: skipFade 1s ease-out forwards;
                    `;
                    skipIndicator.textContent = '⏪ 10s';
                    
                    overlay.appendChild(skipIndicator);
                    
                    setTimeout(() => {
                      if (skipIndicator.parentNode) {
                        skipIndicator.parentNode.removeChild(skipIndicator);
                      }
                    }, 1000);
                  }
                }
              }}
              onPlayPause={() => {
                if (playerRef.current) {
                  if (playerRef.current.paused()) {
                    playerRef.current.play();
                  } else {
                    playerRef.current.pause();
                  }
                }
              }}
              onSkipForward={() => {
                if (playerRef.current) {
                  // Usar la función handleSkip para mantener consistencia con la sincronización
                  const currentTime = playerRef.current.currentTime();
                  const duration = playerRef.current.duration();
                  
                  // Aplicar el cambio usando el método del player para activar eventos
                  playerRef.current.currentTime(Math.min(duration, currentTime + 10));
                  
                  // Activar manualmente los eventos de seeking para sincronización
                  playerRef.current.trigger('seeking');
                  setTimeout(() => {
                    playerRef.current.trigger('seeked');
                  }, 50);
                  
                  const overlay = playerRef.current.el().querySelector('.vjs-overlay');
                  if (overlay) {
                    const skipIndicator = document.createElement('div');
                    skipIndicator.className = 'skip-indicator';
                    skipIndicator.style.cssText = `
                      position: absolute;
                      top: 50%;
                      right: 20%;
                      transform: translateY(-50%);
                      background-color: rgba(0, 0, 0, 0.8);
                      color: var(--text-on-primary);
                      padding: var(--space-md) var(--space-lg);
                      border-radius: var(--radius-lg);
                      font-size: var(--font-size-lg);
                      font-weight: var(--font-weight-bold);
                      z-index: 2000;
                      animation: skipFade 1s ease-out forwards;
                    `;
                    skipIndicator.textContent = '10s ⏩';
                    
                    overlay.appendChild(skipIndicator);
                    
                    setTimeout(() => {
                      if (skipIndicator.parentNode) {
                        skipIndicator.parentNode.removeChild(skipIndicator);
                      }
                    }, 1000);
                  }
                }
              }}
              isPlaying={isPlaying}
              skipSeconds={10}
            />,
            overlayContainerRef.current
          )}
        </div>
      </div>
    </div>
  );
};

export { VideoPlayer };