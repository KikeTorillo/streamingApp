#!/usr/bin/env node

/**
 * VideoPlayer Context - Contexto específico para el reproductor de video
 * Proporciona información detallada sobre el componente VideoPlayer interno,
 * su integración con Video.js y casos de uso específicos del proyecto
 */

const fs = require('fs');

function getVideoPlayerContext(prompt) {
  return {
    component: 'VideoPlayer',
    type: 'complex-page-component',
    level: 'page',
    filePath: 'frontend/app/src/Pages/VideoPlayer/VideoPlayer.jsx',
    relatedComponents: [
      'VideoPlayerOverlay: frontend/app/src/components/organisms/VideoPlayerOverlay/',
      'Button: frontend/app/src/components/atoms/Button/ (para botón regresar)'
    ],
    
    // Arquitectura del componente
    architecture: {
      coreLibrary: 'Video.js v8+ con plugins',
      plugins: [
        'videojs-contrib-quality-levels: Detección de calidades HLS',
        'jb-videojs-hls-quality-selector: Selector visual de calidad',
        'videojs-overlay: Sistema de overlays personalizado',
        'videojs-hotkeys: Controles de teclado (space, arrows, J/L)',
        'videojs-playlist: Gestión de listas de episodios'
      ],
      streamingProtocol: 'HLS (HTTP Live Streaming)',
      videoFormats: ['mp4 transcoded to HLS', 'm3u8 playlists'],
      subtitleFormat: 'WebVTT (.vtt files)'
    },
    
    // Estados principales del componente
    componentStates: {
      loading: {
        description: 'Cargando datos del contenido (película/episodio)',
        triggers: ['componentDidMount', 'movieId change', 'playlist change'],
        displays: 'Mensaje "Cargando episodio..." o "Cargando película..."'
      },
      movieData: {
        description: 'Datos del contenido actual (metadata)',
        structure: '{ title, overview, available_subtitles, poster_path, etc. }',
        sources: ['getMovieByHashService', 'getEpisodeByHashService']
      },
      playlistData: {
        description: 'Datos de la serie y episodios para auto-advance',
        structure: '{ serie: {...}, episodes: [...], totalEpisodes: number }',
        sources: ['sessionStorage', 'getSerieByIdService + getEpisodesBySerieService']
      },
      playerStates: {
        isPlaying: 'boolean - Estado de reproducción',
        currentQuality: 'string - Calidad actual (Auto, 720p, 1080p, etc.)',
        bufferPercentage: 'number - % de buffer cargado',
        currentEpisodeIndex: 'number - Índice del episodio actual en playlist'
      }
    },
    
    // Funcionalidades principales
    mainFeatures: {
      videoPlayback: {
        description: 'Reproducción básica de video con HLS',
        implementation: 'Video.js player con configuración optimizada',
        urls: 'CDN_URL/hls/HASH/_,resolutions,p.mp4.play/master.m3u8',
        qualityLevels: 'Auto-detected from HLS manifest'
      },
      subtitles: {
        description: 'Subtítulos múltiples con selector nativo',
        implementation: 'TextTracks de Video.js + setupTextTracks()',
        formats: 'WebVTT files from CDN_URL/subs/HASH/subtitle.vtt',
        languages: 'Detectados automáticamente (spa, eng, forced)'
      },
      playlist: {
        description: 'Auto-advance entre episodios de series',
        implementation: 'videojs-playlist plugin + fallback manual',
        triggers: 'Video ended + hasNextEpisode',
        debugging: 'Console logs con prefijo [DEBUG]'
      },
      overlay: {
        description: 'Controles personalizados sobre el video',
        implementation: 'VideoPlayerOverlay component via createPortal',
        controls: 'Skip back/forward (10s), play/pause toggle',
        visibility: 'Controlado por eventos useractive/userinactive de Video.js'
      },
      hotkeys: {
        description: 'Controles de teclado para navegación',
        implementation: 'videojs-hotkeys plugin + custom handlers',
        mappings: {
          'Space': 'Play/Pause toggle',
          'Left Arrow / J': 'Skip backward 10 seconds',
          'Right Arrow / L': 'Skip forward 10 seconds',
          'F': 'Toggle fullscreen'
        }
      },
      fullscreen: {
        description: 'Pantalla completa automática al iniciar',
        implementation: 'player.requestFullscreen() en evento canplay',
        timing: 'Se activa automáticamente, luego se ocultan controles'
      }
    },
    
    // Casos de uso reales del proyecto
    realWorldUsage: [
      {
        scenario: 'Reproducción de película',
        url: '/player/MOVIE_HASH?type=movie&resolutions=720,1080',
        behavior: 'Video único, sin playlist, fullscreen automático',
        features: ['Quality selector', 'Subtitles', 'Hotkeys', 'Custom overlay']
      },
      {
        scenario: 'Reproducción de episodio individual',
        url: '/player/EPISODE_HASH?type=episode&resolutions=720,1080',
        behavior: 'Video único, sin auto-advance',
        features: ['Same as movie', 'Episode metadata']
      },
      {
        scenario: 'Reproducción de serie (playlist)',
        url: '/player/EPISODE_HASH?type=episode&resolutions=720,1080&playlist=PLAYLIST_KEY',
        behavior: 'Auto-advance al siguiente episodio, playlist completa',
        features: ['All features + playlist navigation', 'Auto-advance', 'Episode tracking']
      },
      {
        scenario: 'Continuación desde posición guardada',
        behavior: 'loadPlayerPreferences() restaura posición, volumen, subtítulos',
        storage: 'localStorage: playerPreferences + contentPositions',
        conditions: 'Solo si posición > 10s y < 90% del video'
      }
    ],
    
    // Problemas comunes y debugging
    commonIssues: {
      videoNotLoading: {
        problem: 'El video no carga o aparece pantalla negra',
        causes: [
          'CDN no disponible (localhost:8082 down)',
          'Hash del video inválido o no existe',
          'Parámetro resolutions faltante o inválido',
          'Manifest HLS corrupto o inaccesible'
        ],
        debugging: [
          'Verificar que CDN responda: curl localhost:8082/health',
          'Comprobar URL completa en Network tab',
          'Revisar console para errores de Video.js',
          'Probar URL del manifest directamente en navegador'
        ],
        locations: 'líneas 842-881 (error handling), líneas 454-456 (URL generation)'
      },
      overlayTiming: {
        problem: 'Overlay no aparece/desaparece correctamente',
        causes: [
          'Eventos useractive/userinactive en conflicto',
          'overlayRef.current null o no disponible',
          'VideoPlayerOverlay no montado correctamente'
        ],
        debugging: [
          'Verificar overlayRef.current en DevTools',
          'Comprobar que VideoPlayerOverlay esté en DOM',
          'Revisar eventos Video.js en console',
          'Testear showControls/hideControls manualmente'
        ],
        locations: 'líneas 893-903 (eventos), líneas 1064-1084 (portal)'
      },
      playlistAdvance: {
        problem: 'Auto-advance no funciona entre episodios',
        causes: [
          'Playlist plugin no cargado correctamente',
          'sessionStorage playlist key missing/corrupted',
          'currentEpisodeIndex desincronizado',
          'autoadvance delay no configurado'
        ],
        debugging: [
          'Verificar sessionStorage[playlistKey] exists',
          'Comprobar player.playlist() y player.playlist.currentIndex()',
          'Revisar logs con prefijo [DEBUG] en console',
          'Testear player.playlist.next() manualmente'
        ],
        locations: 'líneas 213-270 (auto-advance logic), líneas 543-675 (playlist setup)'
      },
      subtitlesNotShowing: {
        problem: 'Subtítulos no aparecen o no se pueden seleccionar',
        causes: [
          'Archivos VTT no disponibles en CDN',
          'setupTextTracks no ejecutado correctamente',
          'TextTracks preferences no cargadas',
          'Browser text track support issues'
        ],
        debugging: [
          'Verificar URLs de subtítulos: CDN_URL/subs/HASH/subtitle.vtt',
          'Comprobar player.textTracks() en console',
          'Revisar playerPreferences en localStorage',
          'Testear en diferentes navegadores'
        ],
        locations: 'líneas 164-190 (setupTextTracks), líneas 679-707 (subtitle config)'
      },
      crossBrowserIssues: {
        problem: 'Comportamiento diferente entre navegadores',
        knownIssues: {
          safari: [
            'Autoplay restrictions más estrictas',
            'HLS support nativo conflicta con Video.js',
            'Fullscreen API differences',
            'Audio codec compatibility'
          ],
          firefox: [
            'Hardware acceleration issues',
            'CORS policies más restrictivas',
            'CSS transitions performance',
            'Audio/video sync problems'
          ],
          chrome: [
            'Memory leaks con videos largos',
            'Autoplay policy changes',
            'Hardware acceleration bugs',
            'Mobile Chrome specific issues'
          ]
        },
        debugging: [
          'Testear en modo incógnito',
          'Verificar user agent detection',
          'Comprobar codec support: canPlayType()',
          'Revisar autoplay policies del navegador'
        ],
        solutions: [
          'Usar muted=true para autoplay',
          'Fallback para browsers sin HLS nativo',
          'Detect browser capabilities dinámicamente'
        ]
      },
      performanceIssues: {
        problem: 'Video laggy, memory leaks, o crashes',
        causes: [
          'Player no disposed correctamente',
          'Event listeners no limpiados',
          'Large video files sin optimización',
          'Too many concurrent streams'
        ],
        debugging: [
          'Monitorear memory usage en DevTools',
          'Verificar event listeners count',
          'Comprobar network usage',
          'Testear con videos más pequeños'
        ],
        locations: 'líneas 334-359 (cleanup), líneas 956-964 (disposal)'
      }
    },
    
    // Integración con el ecosistema
    integrationPoints: {
      services: [
        'getMovieByHashService: Obtener metadata de películas',
        'getEpisodeByHashService: Obtener metadata de episodios',
        'getEpisodesBySerieService: Obtener lista completa de episodios',
        'getSerieByIdService: Obtener información de la serie'
      ],
      routing: [
        'useParams: movieId (hash del contenido)',
        'useSearchParams: type, resolutions, playlist',
        'useNavigate: handleGoBack() navigation'
      ],
      storage: [
        'localStorage.playerPreferences: Volumen, subtítulos, posición',
        'localStorage.contentPositions: Posición específica por contenido',
        'sessionStorage[playlistKey]: Datos de playlist temporal'
      ],
      hooks: [
        'useMovieNavigation: Para navegación entre contenidos (si existe)',
        'Custom analytics tracking via analyticsRef'
      ]
    },
    
    // Configuración y personalización
    configuration: {
      videoJsOptions: {
        controls: true,
        autoplay: true,
        muted: true,
        preload: 'auto',
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2]
      },
      hlsConfiguration: {
        overrideNative: true,
        enableLowInitialPlaylist: true,
        limitRenditionByPlayerDimensions: true,
        bandwidth: 4194304,
        initialBandwidth: 2000000,
        maxBufferLength: 30
      },
      customization: {
        overlay: 'VideoPlayerOverlay component con controles personalizados',
        quality: 'HLS Quality Selector plugin integrado',
        hotkeys: 'Custom key mappings con videojs-hotkeys',
        analytics: 'Custom tracking: watchTime, rebufferCount, qualityChanges'
      }
    },
    
    // URLs y endpoints críticos
    criticalUrls: {
      hlsStream: 'CDN_URL/hls/HASH/_,RESOLUTIONS,p.mp4.play/master.m3u8',
      subtitles: 'CDN_URL/subs/HASH/SUBTITLE.vtt',
      images: 'CDN_URL/images/IMAGE_PATH',
      cdnDefault: 'http://localhost:8082 (development)'
    },
    
    // Métricas y analytics
    analytics: {
      tracked: [
        'watchTime: Tiempo total visto (excluyendo pausas)',
        'rebufferCount: Número de rebuffering events',
        'qualityChanges: Cambios de calidad durante reproducción',
        'sessionStartTime: Timestamp de inicio de sesión'
      ],
      events: [
        'timeupdate: Para tracking de progreso',
        'waiting: Para contar rebuffering',
        'ended: Para marcar contenido completado'
      ],
      storage: 'analyticsRef (no persisted, session only)'
    },
    
    // Mejores prácticas de debugging
    debuggingWorkflow: {
      step1: 'Verificar que el contenido existe y es accesible',
      step2: 'Comprobar que CDN está funcionando (localhost:8082)',
      step3: 'Revisar console logs, especialmente [DEBUG] prefixed',
      step4: 'Testear componentes individuales (overlay, playlist, etc.)',
      step5: 'Verificar browser compatibility y codec support',
      step6: 'Analizar network requests y response codes'
    },
    
    // Instrucciones específicas para Claude
    instructions: {
      primary: 'IMPORTANTE: VideoPlayer es el componente más complejo del proyecto (1090+ líneas). SIEMPRE leer VideoPlayer.jsx completo y VideoPlayerOverlay.jsx antes de diagnosticar problemas.',
      debugging: 'Para debugging: 1) Verificar CDN connectivity, 2) Comprobar datos de contenido, 3) Revisar configuración de Video.js, 4) Testear en diferentes browsers, 5) Analizar console logs.',
      performance: 'Para problemas de performance: verificar disposal correcto, memory leaks, y event listener cleanup.',
      crossBrowser: 'Para issues cross-browser: siempre testear en Safari, Chrome, Firefox. Cada uno tiene quirks específicos con video.',
      playlist: 'Para problemas de playlist: verificar sessionStorage, playlist plugin status, y auto-advance configuration.',
      integration: 'Recordar que VideoPlayer integra Video.js + plugins + overlay custom + analytics. Cada layer puede fallar independientemente.'
    }
  };
}

// Obtener casos específicos según el contexto del prompt
function getSpecificVideoPlayerContext(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('overlay') || lowerPrompt.includes('controls')) {
    return {
      focus: 'overlay',
      relevantSections: ['overlayTiming', 'VideoPlayerOverlay integration'],
      debuggingPriority: ['overlayRef', 'useractive events', 'portal mounting']
    };
  }
  
  if (lowerPrompt.includes('playlist') || lowerPrompt.includes('episode') || lowerPrompt.includes('advance')) {
    return {
      focus: 'playlist',
      relevantSections: ['playlistAdvance', 'sessionStorage', 'auto-advance logic'],
      debuggingPriority: ['playlist plugin', 'sessionStorage data', 'episode indexing']
    };
  }
  
  if (lowerPrompt.includes('subtitle') || lowerPrompt.includes('subtitulo')) {
    return {
      focus: 'subtitles',
      relevantSections: ['subtitlesNotShowing', 'setupTextTracks', 'VTT files'],
      debuggingPriority: ['VTT availability', 'TextTracks setup', 'browser support']
    };
  }
  
  if (lowerPrompt.includes('quality') || lowerPrompt.includes('calidad')) {
    return {
      focus: 'quality',
      relevantSections: ['HLS quality levels', 'quality selector plugin'],
      debuggingPriority: ['HLS manifest', 'quality plugin', 'bandwidth detection']
    };
  }
  
  if (lowerPrompt.includes('safari') || lowerPrompt.includes('firefox') || lowerPrompt.includes('chrome')) {
    return {
      focus: 'cross-browser',
      relevantSections: ['crossBrowserIssues', 'browser-specific solutions'],
      debuggingPriority: ['browser detection', 'codec support', 'autoplay policies']
    };
  }
  
  if (lowerPrompt.includes('not loading') || lowerPrompt.includes('no carga')) {
    return {
      focus: 'loading',
      relevantSections: ['videoNotLoading', 'CDN connectivity', 'HLS streams'],
      debuggingPriority: ['CDN status', 'URL construction', 'manifest validity']
    };
  }
  
  return {
    focus: 'general',
    relevantSections: ['All sections relevant'],
    debuggingPriority: ['CDN', 'console logs', 'browser compatibility']
  };
}

module.exports = { getVideoPlayerContext, getSpecificVideoPlayerContext };