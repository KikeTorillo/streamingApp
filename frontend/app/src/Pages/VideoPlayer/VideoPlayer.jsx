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
  
  // ===== IMPLEMENTACIÓN OFICIAL ROBUSTA BASADA EN DOCUMENTACIÓN VIDEO.JS =====
  
  const handleSkipGlobal = (player, seconds, direction) => {
    if (!player) return;
    
    const currentTime = player.currentTime();
    const duration = player.duration();
    
    let newTime;
    if (direction === 'backward') {
      newTime = Math.max(0, currentTime - seconds);
    } else {
      newTime = Math.min(duration, currentTime + seconds);
    }
    
    // Usar API oficial de Video.js para seeking optimizado
    player.currentTime(newTime);
    
    // Mostrar indicador visual usando eventos oficiales
    const overlay = player.el().querySelector('.vjs-overlay');
    if (overlay) {
      const skipIndicator = document.createElement('div');
      skipIndicator.className = 'skip-indicator';
      skipIndicator.style.cssText = `
        position: absolute;
        top: 50%;
        ${direction === 'backward' ? 'left: 20%' : 'right: 20%'};
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
      skipIndicator.textContent = direction === 'backward' ? `⏪ ${seconds}s` : `${seconds}s ⏩`;
      
      overlay.appendChild(skipIndicator);
      
      // Usar eventos oficiales en lugar de setTimeout
      player.one('seeked', () => {
        if (skipIndicator.parentNode) {
          skipIndicator.parentNode.removeChild(skipIndicator);
        }
      });
    }
    
    console.log('🎬 Skip optimizado iniciado:', direction, seconds, 'segundos - usando eventos oficiales');
  };

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
        
        // Esperar a que el DOM esté listo sin setTimeout arbitrario
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
              // Configuración oficial según documentación Video.js VHS
              overrideNative: true,
              nativeAudioTracks: false,
              nativeVideoTracks: false,
              
              // Opciones oficiales documentadas
              enableLowInitialPlaylist: true,
              limitRenditionByPlayerDimensions: true,
              useDevicePixelRatio: true,
              
              // Buffer optimization oficial
              fastQualityChange: true,
              maxPlaylistRetries: 3,
              
              // Configuración de bandwidth oficial
              bandwidth: 4194304,
              playlistExclusionDuration: 60
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
        
        // Variables de estado para manejo robusto según documentación oficial
        let isSeekingInProgress = false;
        
        // Función interna que usa el patrón oficial
        const handleSkipAction = (seconds, direction) => {
          handleSkipGlobal(player, seconds, direction);
        };
        
        // ===== IMPLEMENTACIÓN OFICIAL DEL PATRÓN SEEKING/SEEKED =====
        
        // Manejo robusto de seeking según documentación oficial
        player.on('seeking', function() {
          isSeekingInProgress = true;
          console.log('🎬 Seeking iniciado - bloqueando operaciones dependientes');
        });
        
        player.on('seeked', function() {
          isSeekingInProgress = false;
          console.log('🎬 Seeked completado - sincronizando text tracks');
          
          // Re-sincronizar text tracks usando API oficial
          const textTracks = player.textTracks();
          for (let i = 0; i < textTracks.length; i++) {
            const track = textTracks[i];
            if (track.mode === 'showing') {
              // Forzar recálculo de cues activos (patrón oficial)
              track.activeCues; // Acceso dispara recálculo interno
              console.log('🎬 Text track re-sincronizado:', track.label);
              break;
            }
          }
        });
        
        // Actualizar UI solo cuando sea seguro (patrón oficial)
        player.on('timeupdate', function() {
          if (!isSeekingInProgress) {
            // UI updates seguros durante reproducción normal
            // Cualquier update de UI personalizado iría aquí
          }
        });
        
        // Manejo de cambios de text tracks
        player.on('texttrackchange', function() {
          console.log('🎬 Text track changed - sin interferencia con seeking');
          if (!isSeekingInProgress) {
            console.log('🎬 Seguro para actualizar subtítulos');
          }
        });
        
        // Sincronización inicial
        player.on('loadeddata', function() {
          console.log('🎬 Video data loaded - patrón oficial activo');
        });
        
        player.on('playing', function() {
          console.log('🎬 Video playing - sistema robusto funcionando');
        });
        
        // Configuración unificada de text tracks usando patrón oficial
        player.ready(() => {
          if (subtitleTracks.length > 0) {
            subtitleTracks.forEach((track) => {
              console.log('🎬 Añadiendo text track:', track.label);
              const textTrack = player.addRemoteTextTrack(track, false);
              
              // Configuración oficial de eventos para text tracks
              if (textTrack && textTrack.track) {
                textTrack.track.addEventListener('load', () => {
                  console.log('🎬 Text track cargado:', track.label);
                });
                
                // Evento oficial para cambios de cues - sin interferencia con seeking
                textTrack.track.addEventListener('cuechange', () => {
                  if (!isSeekingInProgress) {
                    console.log('🎬 Cue actualizado naturalmente:', track.label);
                  }
                });
              }
            });
            
            // Configuración inicial de subtítulos usando eventos oficiales
            player.on('loadedmetadata', () => {
              // Configurar subtítulos después de que metadata esté lista
              const textTracks = player.textTracks();
              
              // Deshabilitar todos primero
              for (let i = 0; i < textTracks.length; i++) {
                textTracks[i].mode = 'disabled';
              }
              
              // Activar primer subtítulo español no forzado
              for (let i = 0; i < textTracks.length; i++) {
                const track = textTracks[i];
                if (track.kind === 'subtitles' && track.language === 'es' && !track.label.includes('Forzado')) {
                  track.mode = 'showing';
                  console.log('🎬 Subtítulos activados:', track.label);
                  break;
                }
              }
            });
          }
        });
        
        // Entrar automáticamente a pantalla completa usando eventos oficiales
        player.ready(() => {
          // Usar evento oficial canplay para pantalla completa
          player.one('canplay', () => {
            if (player.requestFullscreen) {
              player.requestFullscreen()
                .then(() => {
                  console.log('✅ Pantalla completa activada con evento oficial');
                })
                .catch((err) => {
                  console.warn('⚠️ No se pudo activar pantalla completa automáticamente:', err.message);
                });
            }
          });
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
                  handleSkipAction(10, 'backward');
                }
              },
              rightArrow: {
                key: function(event) {
                  return (event.which === 39);
                },
                handler: function() {
                  handleSkipAction(10, 'forward');
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

        // ===== EVENT LISTENERS =====

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

        // Usar la función unificada handleSkipAction ya definida arriba
        
        // ===== CONTROLES PERSONALIZADOS COMO ALTERNATIVA =====
        // Si los botones nativos no funcionan, agregamos controles personalizados
        player.ready(() => {
          // Verificar botones nativos después de que el player esté completamente listo
          player.one('loadeddata', () => {
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
                
                createEl() {
                  const el = super.createEl('button', {
                    innerHTML: '⏪ 10s',
                    className: 'vjs-control vjs-button custom-skip-backward'
                  });
                  return el;
                }
                
                handleClick() {
                  handleSkipAction(10, 'backward');
                }
              }
              
              // Botón de avanzar 10 segundos
              class SkipForwardButton extends Button {
                constructor(player, options) {
                  super(player, options);
                  this.controlText('Avanzar 10 segundos');
                }
                
                createEl() {
                  const el = super.createEl('button', {
                    innerHTML: '10s ⏩',
                    className: 'vjs-control vjs-button custom-skip-forward'
                  });
                  return el;
                }
                
                handleClick() {
                  handleSkipAction(10, 'forward');
                }
              }
              
              // Registrar los componentes
              videojs.registerComponent('SkipBackwardButton', SkipBackwardButton);
              videojs.registerComponent('SkipForwardButton', SkipForwardButton);
              
              // Agregar los botones a la barra de controles
              const controlBar = player.getChild('controlBar');
              
              const skipBackward = new SkipBackwardButton(player, {});
              
              const skipForward = new SkipForwardButton(player, {});
              
              // Insertar después del botón de play
              controlBar.addChild(skipBackward, {}, 1);
              controlBar.addChild(skipForward, {}, 2);
            }
          });
        });




        // Add listeners for subtitle events
        player.on('texttrackchange', () => {
          console.log('Text track changed');
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
              onSkipBack={() => handleSkipGlobal(playerRef.current, 10, 'backward')}
              onPlayPause={() => {
                if (playerRef.current) {
                  if (playerRef.current.paused()) {
                    playerRef.current.play();
                  } else {
                    playerRef.current.pause();
                  }
                }
              }}
              onSkipForward={() => handleSkipGlobal(playerRef.current, 10, 'forward')}
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