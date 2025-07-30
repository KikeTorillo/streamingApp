# Contexto del VideoPlayer - Streaming App

> **Propósito**: Contexto específico para el componente VideoPlayer interno, su integración con Video.js y casos de uso específicos del proyecto de streaming.
> 
> **Cuándo usar**: Debugging de video, problemas de reproducción, playlist, subtítulos, cross-browser issues, performance de video, o cualquier funcionalidad relacionada con el reproductor.

## 🎬 Información General del Componente

### Ubicación y Tipo
- **Archivo**: `frontend/app/src/Pages/VideoPlayer/VideoPlayer.jsx`
- **Tipo**: `complex-page-component` (1090+ líneas)
- **Nivel**: Page-level component (más complejo del proyecto)

### Componentes Relacionados
- **VideoPlayerOverlay**: `frontend/app/src/components/organisms/VideoPlayerOverlay/`
- **Button**: `frontend/app/src/components/atoms/Button/` (para botón regresar)

## 🏗️ Arquitectura del Componente

### Biblioteca Principal
**Video.js v8+** con plugins especializados

### Plugins Integrados
- **videojs-contrib-quality-levels** - Detección de calidades HLS
- **jb-videojs-hls-quality-selector** - Selector visual de calidad
- **videojs-overlay** - Sistema de overlays personalizado
- **videojs-hotkeys** - Controles de teclado (space, arrows, J/L)
- **videojs-playlist** - Gestión de listas de episodios

### Protocolos y Formatos
- **Streaming Protocol**: HLS (HTTP Live Streaming)
- **Video Formats**: MP4 transcoded to HLS, m3u8 playlists
- **Subtitle Format**: WebVTT (.vtt files)

## 📊 Estados Principales del Componente

### Estado de Carga
```javascript
loading: {
  description: 'Cargando datos del contenido (película/episodio)',
  triggers: ['componentDidMount', 'movieId change', 'playlist change'],
  displays: 'Mensaje "Cargando episodio..." o "Cargando película..."'
}
```

### Datos del Contenido
```javascript
movieData: {
  description: 'Datos del contenido actual (metadata)',
  structure: '{ title, overview, available_subtitles, poster_path, etc. }',
  sources: ['getMovieByHashService', 'getEpisodeByHashService']
}
```

### Datos de Playlist
```javascript
playlistData: {
  description: 'Datos de la serie y episodios para auto-advance',
  structure: '{ serie: {...}, episodes: [...], totalEpisodes: number }',
  sources: ['sessionStorage', 'getSerieByIdService + getEpisodesBySerieService']
}
```

### Estados del Player
- **isPlaying**: `boolean` - Estado de reproducción
- **currentQuality**: `string` - Calidad actual (Auto, 720p, 1080p, etc.)
- **bufferPercentage**: `number` - % de buffer cargado
- **currentEpisodeIndex**: `number` - Índice del episodio actual en playlist

## 🎯 Funcionalidades Principales

### 1. Video Playback
- **Descripción**: Reproducción básica de video con HLS
- **Implementación**: Video.js player con configuración optimizada
- **URLs**: `CDN_URL/hls/HASH/_,resolutions,p.mp4.play/master.m3u8`
- **Quality Levels**: Auto-detected from HLS manifest

### 2. Subtítulos
- **Descripción**: Subtítulos múltiples con selector nativo
- **Implementación**: TextTracks de Video.js + `setupTextTracks()`
- **Formatos**: WebVTT files from `CDN_URL/subs/HASH/subtitle.vtt`
- **Idiomas**: Detectados automáticamente (spa, eng, forced)

### 3. Playlist (Series)
- **Descripción**: Auto-advance entre episodios de series
- **Implementación**: videojs-playlist plugin + fallback manual
- **Triggers**: Video ended + hasNextEpisode
- **Debugging**: Console logs con prefijo [DEBUG]

### 4. Overlay Personalizado
- **Descripción**: Controles personalizados sobre el video
- **Implementación**: VideoPlayerOverlay component via createPortal
- **Controles**: Skip back/forward (10s), play/pause toggle
- **Visibilidad**: Controlado por eventos useractive/userinactive de Video.js

### 5. Hotkeys (Controles de Teclado)
- **Descripción**: Controles de teclado para navegación
- **Implementación**: videojs-hotkeys plugin + custom handlers

**Mapeo de teclas**:
- **Space**: Play/Pause toggle
- **Left Arrow / J**: Skip backward 10 seconds
- **Right Arrow / L**: Skip forward 10 seconds
- **F**: Toggle fullscreen

### 6. Fullscreen Automático
- **Descripción**: Pantalla completa automática al iniciar
- **Implementación**: `player.requestFullscreen()` en evento canplay
- **Timing**: Se activa automáticamente, luego se ocultan controles

## 🎬 Casos de Uso Reales del Proyecto

### Caso 1: Reproducción de Película
```
URL: /player/MOVIE_HASH?type=movie&resolutions=720,1080
Comportamiento: Video único, sin playlist, fullscreen automático
Features: Quality selector, Subtitles, Hotkeys, Custom overlay
```

### Caso 2: Reproducción de Episodio Individual
```
URL: /player/EPISODE_HASH?type=episode&resolutions=720,1080
Comportamiento: Video único, sin auto-advance
Features: Same as movie + Episode metadata
```

### Caso 3: Reproducción de Serie (Playlist)
```
URL: /player/EPISODE_HASH?type=episode&resolutions=720,1080&playlist=PLAYLIST_KEY
Comportamiento: Auto-advance al siguiente episodio, playlist completa
Features: All features + playlist navigation, Auto-advance, Episode tracking
```

### Caso 4: Continuación desde Posición Guardada
```
Comportamiento: loadPlayerPreferences() restaura posición, volumen, subtítulos
Storage: localStorage: playerPreferences + contentPositions
Condiciones: Solo si posición > 10s y < 90% del video
```

## 🐛 Problemas Comunes y Debugging

### 1. Video No Carga
**Problema**: El video no carga o aparece pantalla negra

**Causas Posibles**:
- CDN no disponible (localhost:8082 down)
- Hash del video inválido o no existe
- Parámetro resolutions faltante o inválido
- Manifest HLS corrupto o inaccesible

**Pasos de Debugging**:
1. Verificar que CDN responda: `curl localhost:8082/health`
2. Comprobar URL completa en Network tab
3. Revisar console para errores de Video.js
4. Probar URL del manifest directamente en navegador

**Ubicaciones en código**: líneas 842-881 (error handling), líneas 454-456 (URL generation)

### 2. Overlay Timing Issues
**Problema**: Overlay no aparece/desaparece correctamente

**Causas Posibles**:
- Eventos useractive/userinactive en conflicto
- overlayRef.current null o no disponible
- VideoPlayerOverlay no montado correctamente

**Pasos de Debugging**:
1. Verificar overlayRef.current en DevTools
2. Comprobar que VideoPlayerOverlay esté en DOM
3. Revisar eventos Video.js en console
4. Testear showControls/hideControls manualmente

**Ubicaciones en código**: líneas 893-903 (eventos), líneas 1064-1084 (portal)

### 3. Playlist Auto-Advance
**Problema**: Auto-advance no funciona entre episodios

**Causas Posibles**:
- Playlist plugin no cargado correctamente
- sessionStorage playlist key missing/corrupted
- currentEpisodeIndex desincronizado
- autoadvance delay no configurado

**Pasos de Debugging**:
1. Verificar sessionStorage[playlistKey] exists
2. Comprobar player.playlist() y player.playlist.currentIndex()
3. Revisar logs con prefijo [DEBUG] en console
4. Testear player.playlist.next() manualmente

**Ubicaciones en código**: líneas 213-270 (auto-advance logic), líneas 543-675 (playlist setup)

### 4. Subtítulos No Aparecen
**Problema**: Subtítulos no aparecen o no se pueden seleccionar

**Causas Posibles**:
- Archivos VTT no disponibles en CDN
- setupTextTracks no ejecutado correctamente
- TextTracks preferences no cargadas
- Browser text track support issues

**Pasos de Debugging**:
1. Verificar URLs de subtítulos: `CDN_URL/subs/HASH/subtitle.vtt`
2. Comprobar player.textTracks() en console
3. Revisar playerPreferences en localStorage
4. Testear en diferentes navegadores

**Ubicaciones en código**: líneas 164-190 (setupTextTracks), líneas 679-707 (subtitle config)

### 5. Cross-Browser Issues
**Problema**: Comportamiento diferente entre navegadores

#### Problemas Conocidos por Browser:

**Safari**:
- Autoplay restrictions más estrictas
- HLS support nativo conflicta con Video.js
- Fullscreen API differences
- Audio codec compatibility

**Firefox**:
- Hardware acceleration issues
- CORS policies más restrictivas
- CSS transitions performance
- Audio/video sync problems

**Chrome**:
- Memory leaks con videos largos
- Autoplay policy changes
- Hardware acceleration bugs
- Mobile Chrome specific issues

**Pasos de Debugging**:
1. Testear en modo incógnito
2. Verificar user agent detection
3. Comprobar codec support: canPlayType()
4. Revisar autoplay policies del navegador

**Soluciones**:
- Usar muted=true para autoplay
- Fallback para browsers sin HLS nativo
- Detect browser capabilities dinámicamente

### 6. Performance Issues
**Problema**: Video laggy, memory leaks, o crashes

**Causas Posibles**:
- Player no disposed correctamente
- Event listeners no limpiados
- Large video files sin optimización
- Too many concurrent streams

**Pasos de Debugging**:
1. Monitorear memory usage en DevTools
2. Verificar event listeners count
3. Comprobar network usage
4. Testear con videos más pequeños

**Ubicaciones en código**: líneas 334-359 (cleanup), líneas 956-964 (disposal)

## 🔗 Puntos de Integración

### Servicios del Backend
- **getMovieByHashService**: Obtener metadata de películas
- **getEpisodeByHashService**: Obtener metadata de episodios  
- **getEpisodesBySerieService**: Obtener lista completa de episodios
- **getSerieByIdService**: Obtener información de la serie

### Routing
- **useParams**: movieId (hash del contenido)
- **useSearchParams**: type, resolutions, playlist
- **useNavigate**: handleGoBack() navigation

### Storage
- **localStorage.playerPreferences**: Volumen, subtítulos, posición
- **localStorage.contentPositions**: Posición específica por contenido
- **sessionStorage[playlistKey]**: Datos de playlist temporal

### Hooks Personalizados
- **useMovieNavigation**: Para navegación entre contenidos (si existe)
- **Custom analytics tracking**: via analyticsRef

## ⚙️ Configuración y Personalización

### Video.js Options
```javascript
const videoJsOptions = {
  controls: true,
  autoplay: true,
  muted: true,
  preload: 'auto',
  fluid: true,
  playbackRates: [0.5, 1, 1.25, 1.5, 2]
}
```

### HLS Configuration
```javascript
const hlsConfiguration = {
  overrideNative: true,
  enableLowInitialPlaylist: true,
  limitRenditionByPlayerDimensions: true,
  bandwidth: 4194304,
  initialBandwidth: 2000000,
  maxBufferLength: 30
}
```

### Customización
- **Overlay**: VideoPlayerOverlay component con controles personalizados
- **Quality**: HLS Quality Selector plugin integrado
- **Hotkeys**: Custom key mappings con videojs-hotkeys
- **Analytics**: Custom tracking: watchTime, rebufferCount, qualityChanges

## 🌐 URLs y Endpoints Críticos

```javascript
const criticalUrls = {
  hlsStream: 'CDN_URL/hls/HASH/_,RESOLUTIONS,p.mp4.play/master.m3u8',
  subtitles: 'CDN_URL/subs/HASH/SUBTITLE.vtt',  
  images: 'CDN_URL/images/IMAGE_PATH',
  cdnDefault: 'http://localhost:8082 (development)'
}
```

### Parámetros de URL
- **movieId**: Hash del video (requerido)
- **resolutions**: Resoluciones disponibles (requerido)
- **type**: movie|episode (opcional, default: movie)
- **playlist**: Key de playlist en sessionStorage (opcional)

## 📈 Métricas y Analytics

### Datos Tracked
- **watchTime**: Tiempo total visto (excluyendo pausas)
- **rebufferCount**: Número de rebuffering events
- **qualityChanges**: Cambios de calidad durante reproducción
- **sessionStartTime**: Timestamp de inicio de sesión

### Eventos Monitoreados
- **timeupdate**: Para tracking de progreso
- **waiting**: Para contar rebuffering
- **ended**: Para marcar contenido completado

### Storage
- **analyticsRef**: (no persisted, session only)

## 🔧 Workflow de Debugging Recomendado

### Paso 1: Verificar Contenido
Verificar que el contenido existe y es accesible

### Paso 2: CDN Status
Comprobar que CDN está funcionando (`localhost:8082`)

### Paso 3: Console Logs
Revisar console logs, especialmente los con prefijo [DEBUG]

### Paso 4: Componentes Individuales
Testear componentes individuales (overlay, playlist, etc.)

### Paso 5: Browser Compatibility
Verificar browser compatibility y codec support

### Paso 6: Network Analysis
Analizar network requests y response codes

## 🎯 Métodos Clave (Líneas de Código)

- **initializePlayer()** - línea 452: Setup principal del player
- **setupTextTracks()** - línea 164: Configuración de subtítulos
- **initializeAnalytics()** - línea 199: Setup de métricas
- **handleSkip()** - línea 74: Navegación de video
- **savePlayerPreferences()** - línea 101: Persistencia de configuración
- **loadPlayerPreferences()** - línea 130: Carga de configuración guardada

## 🚨 Instrucciones Críticas para Claude

### ❗ **IMPORTANTE - Lectura Obligatoria**
VideoPlayer es el componente más complejo del proyecto (1090+ líneas). **SIEMPRE** leer `VideoPlayer.jsx` completo y `VideoPlayerOverlay.jsx` antes de diagnosticar problemas.

### 🔍 **Para Debugging**
1. Verificar CDN connectivity
2. Comprobar datos de contenido
3. Revisar configuración de Video.js
4. Testear en diferentes browsers
5. Analizar console logs

### ⚡ **Para Performance**
Verificar disposal correcto, memory leaks, y event listener cleanup.

### 🌐 **Para Cross-Browser**
Siempre testear en Safari, Chrome, Firefox. Cada uno tiene quirks específicos con video.

### 📺 **Para Playlist**
Verificar sessionStorage, playlist plugin status, y auto-advance configuration.

### 🔗 **Para Integración**
Recordar que VideoPlayer integra Video.js + plugins + overlay custom + analytics. Cada layer puede fallar independientemente.

## 🎯 Contexto Específico por Tipo de Problema

### Focus: Overlay Issues
- **Secciones relevantes**: overlayTiming, VideoPlayerOverlay integration
- **Prioridad debugging**: overlayRef, useractive events, portal mounting

### Focus: Playlist Issues  
- **Secciones relevantes**: playlistAdvance, sessionStorage, auto-advance logic
- **Prioridad debugging**: playlist plugin, sessionStorage data, episode indexing

### Focus: Subtitle Issues
- **Secciones relevantes**: subtitlesNotShowing, setupTextTracks, VTT files
- **Prioridad debugging**: VTT availability, TextTracks setup, browser support

### Focus: Quality Issues
- **Secciones relevantes**: HLS quality levels, quality selector plugin
- **Prioridad debugging**: HLS manifest, quality plugin, bandwidth detection

### Focus: Cross-Browser Issues
- **Secciones relevantes**: crossBrowserIssues, browser-specific solutions
- **Prioridad debugging**: browser detection, codec support, autoplay policies

### Focus: Loading Issues
- **Secciones relevantes**: videoNotLoading, CDN connectivity, HLS streams
- **Prioridad debugging**: CDN status, URL construction, manifest validity

---

**🔄 Estado**: Contexto completo y detallado ✅  
**📝 Última actualización**: Enero 2025  
**🎬 Componente**: VideoPlayer (1090+ líneas) - El más complejo del proyecto  
**👥 Mantenido por**: Equipo de Frontend

Este contexto debe usarse siempre que se trabaje con el VideoPlayer o se debuggeen problemas de reproducción de video.