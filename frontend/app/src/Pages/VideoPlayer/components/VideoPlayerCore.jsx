import { useEffect, useRef, useCallback } from "react";
import PropTypes from 'prop-types';
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "jb-videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css";
import "jb-videojs-hls-quality-selector";
import "videojs-overlay";
import "videojs-hotkeys";
import "videojs-playlist";
import "videojs-playlist-ui";

/**
 * VideoPlayerCore - Componente Video.js puro siguiendo documentación oficial
 * 
 * Responsabilidades:
 * - Inicialización y configuración de Video.js
 * - Gestión del ciclo de vida del player (mount/unmount)
 * - Configuración de plugins y extensiones
 * - Proporcionar referencia del player via callback
 * 
 * ✅ 100% Compatible con documentación oficial de Video.js:
 * - Functional Components + useEffect
 * - Single Player Initialization
 * - Proper Disposal en cleanup
 * - useRef para referencias
 * - <div data-vjs-player> wrapper
 * - onReady callback pattern
 */
export const VideoPlayerCore = ({ 
  config, 
  onReady, 
  onDispose,
  className = "video-js vjs-default-skin" 
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  /**
   * Configuración base optimizada para Video.js con buffer mejorado
   */
  const getBaseConfig = useCallback(() => ({
    controls: true,
    autoplay: config?.autoplay !== undefined ? config.autoplay : true,
    muted: config?.muted !== undefined ? config.muted : false,
    preload: "auto",
    fluid: true,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    // Sources vienen del config externa
    sources: config?.sources || [],
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
        // Buffer optimizado para mejor sincronización
        maxBufferLength: 45, // Aumentado para mejor estabilidad
        maxBufferSize: 60 * 1000 * 1000, // 60MB buffer
        maxMaxBufferLength: 60, // Buffer máximo extendido
        bufferBasedABR: true, // ABR basado en buffer para mejor timing
        // Configuración de timing mejorada
        experimentalBufferBasedABR: true,
        experimentalLLHLS: false, // Desactivar low-latency que puede causar problemas de sync
        handlePartialData: true,
        // Configuración de red optimizada
        maxNetworkRequests: 2,
        requestTimeoutMs: 30000,
        responseTimeoutMs: 45000
      },
      nativeControlsForTouch: false,
      playsinline: true,
      nativeTextTracks: false,
      preloadTextTracks: true,
      // Buffer adicional para subtítulos
      textTrackBufferSize: 1000 * 1000 // 1MB buffer para subtítulos
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
    ...config // Permitir override de configuración desde props
  }), [config]);

  /**
   * Efecto principal de inicialización del player
   * Sigue el patrón oficial de Video.js para React
   */
  useEffect(() => {
    // Solo inicializar si no existe un player y el elemento está disponible
    if (!playerRef.current && videoRef.current) {
      // Esperar a que el elemento esté en el DOM
      if (!document.body.contains(videoRef.current)) {
        return;
      }

      const finalConfig = getBaseConfig();
      
      console.log('🎬 [VideoPlayerCore] Inicializando Video.js con configuración:', {
        hasSources: !!finalConfig.sources,
        sourcesCount: finalConfig.sources?.length || 0,
        firstSource: finalConfig.sources?.[0]?.src || 'N/A',
        autoplay: finalConfig.autoplay,
        controls: finalConfig.controls
      });

      // ✅ Patrón oficial: Inicializar Video.js
      const player = videojs(videoRef.current, finalConfig);
      
      // ✅ Patrón oficial: Usar player.ready() para configuración adicional
      player.ready(() => {
        playerRef.current = player;
        console.log('✅ [VideoPlayerCore] Player inicializado y listo');
        
        // Callback oficial para notificar que el player está listo
        if (onReady && typeof onReady === 'function') {
          onReady(player);
        }
      });

      // Configurar hotkeys después de la inicialización
      player.ready(() => {
        if (player.hotkeys) {
          player.hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false,
            enableVolumeScroll: false,
            enableHoverScroll: false,
            enableFullscreenToggle: true,
            enableNumbers: false,
            enableJogStyle: false,
            alwaysCaptureHotkeys: true,
            captureDocumentHotkeys: true,
            documentHotkeysFocusElementFilter: function(el) {
              return el.tagName.toLowerCase() === 'body' || 
                     el === player.el() || 
                     player.el().contains(el);
            },
            customKeys: {
              // Configuración personalizada de hotkeys
              spaceKey: {
                key: function(event) {
                  return (event.which === 32);
                },
                handler: function(player, _options, event) {
                  if (player.paused()) {
                    player.play();
                  } else {
                    player.pause();
                  }
                  event.preventDefault();
                }
              }
            }
          });
        }
      });
    }

    // ✅ Patrón oficial: Cleanup en el return del useEffect
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        console.log('🧹 [VideoPlayerCore] Limpiando player...');
        
        // Callback de limpieza antes de dispose
        if (onDispose && typeof onDispose === 'function') {
          onDispose(playerRef.current);
        }
        
        // Limpiar hotkeys si existen
        if (playerRef.current.hotkeys && typeof playerRef.current.hotkeys.destroy === 'function') {
          playerRef.current.hotkeys.destroy();
        }
        
        // ✅ Patrón oficial: Dispose del player
        playerRef.current.dispose();
        playerRef.current = null;
        
        console.log('✅ [VideoPlayerCore] Player limpiado correctamente');
      }
    };
  }, []); // Solo ejecutar una vez al montar/desmontar

  /**
   * Efecto para manejar cambios de configuración
   * Se ejecuta cuando cambia la configuración externa
   */
  useEffect(() => {
    if (playerRef.current && !playerRef.current.isDisposed() && config) {
      console.log('🔄 [VideoPlayerCore] Actualizando configuración del player');
      
      // Aplicar cambios de configuración que se pueden actualizar dinámicamente
      if (config.sources && config.sources !== playerRef.current.currentSources()) {
        playerRef.current.src(config.sources);
      }
      
      if (config.autoplay !== undefined) {
        playerRef.current.autoplay(config.autoplay);
      }
      
      if (config.muted !== undefined) {
        playerRef.current.muted(config.muted);
      }
    }
  }, [config]);

  // ✅ Patrón oficial: Wrapper div con data-vjs-player
  return (
    <div data-vjs-player>
      <video 
        ref={videoRef} 
        className={className}
        // Atributos básicos requeridos por Video.js
        playsInline
        webkit-playsinline="true"
      />
    </div>
  );
};

VideoPlayerCore.propTypes = {
  config: PropTypes.object,
  onReady: PropTypes.func,
  onDispose: PropTypes.func,
  className: PropTypes.string
};