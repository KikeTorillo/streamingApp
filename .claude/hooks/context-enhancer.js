#!/usr/bin/env node

/**
 * Context Enhancer Hook para VideoPlayer debugging
 * Se ejecuta antes de enviar prompts a Claude para enriquecer el contexto
 */

const fs = require('fs');
const path = require('path');

// Detectar si el prompt está relacionado con VideoPlayer
function isVideoPlayerRelated(prompt) {
  const videoPlayerKeywords = [
    'videoplayer', 'video player', 'video.js', 'videojs',
    'hls', 'streaming', 'subtitulos', 'playlist', 'episodios',
    'calidad', 'buffer', 'autoplay', 'fullscreen', 'hotkeys',
    'safari', 'chrome', 'firefox', 'cross-browser', 'codec'
  ];
  
  return videoPlayerKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Auto-discovery para componentes internos
function detectInternalComponents(prompt) {
  const componentMappings = {
    // ATOMS - Auto-documentados con Storybook
    'button': { level: 'atoms', type: 'auto-documented' },
    'input': { level: 'atoms', type: 'auto-documented' },
    'select': { level: 'atoms', type: 'auto-documented' },
    'checkbox': { level: 'atoms', type: 'auto-documented' },
    'card': { level: 'atoms', type: 'auto-documented' },
    'badge': { level: 'atoms', type: 'auto-documented' },
    'avatar': { level: 'atoms', type: 'auto-documented' },
    'spinner': { level: 'atoms', type: 'auto-documented' },
    'toast': { level: 'atoms', type: 'auto-documented' },
    'container': { level: 'atoms', type: 'auto-documented' },
    
    // MOLECULES - Requieren más contexto
    'dynamicform': { level: 'molecules', type: 'complex-context-needed', hasSpecificContext: true },
    'datatable': { level: 'organisms', type: 'complex-context-needed' },
    'modal': { level: 'molecules', type: 'semi-complex' },
    'textinput': { level: 'molecules', type: 'auto-documented' },
    'textselect': { level: 'molecules', type: 'auto-documented' },
    'contentcard': { level: 'molecules', type: 'auto-documented' },
    'statscard': { level: 'molecules', type: 'auto-documented' },
    'filterbar': { level: 'molecules', type: 'semi-complex' },
    
    // ORGANISMS - Contexto específico necesario
    'adminsidebar': { level: 'organisms', type: 'complex-context-needed' },
    'appheader': { level: 'organisms', type: 'complex-context-needed' },
    'logincard': { level: 'organisms', type: 'complex-context-needed' },
    'tmdbsearchview': { level: 'organisms', type: 'complex-context-needed' },
    
    // PAGES - Componentes de página complejos
    'videoplayer': { level: 'page', type: 'complex-context-needed', hasSpecificContext: true }
  };

  const detectedComponents = [];
  const lowerPrompt = prompt.toLowerCase().replace(/\s+/g, '');

  for (const [keyword, config] of Object.entries(componentMappings)) {
    if (lowerPrompt.includes(keyword)) {
      detectedComponents.push({
        name: keyword,
        ...config
      });
    }
  }

  return detectedComponents;
}

// Obtener información del navegador desde user agent (si está disponible)
function getBrowserInfo() {
  // En un entorno real, esto vendría del navegador del usuario
  // Por ahora, retornamos info genérica
  return {
    name: 'Unknown',
    version: 'Unknown',
    engine: 'Unknown',
    supportsHLS: 'Unknown',
    autoplayPolicy: 'Unknown'
  };
}

// Verificar estado del CDN
async function checkCDNStatus() {
  try {
    // En un entorno real, haríamos un ping al CDN
    // Por ahora, simulamos
    return {
      status: 'up',
      latency: '< 100ms',
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'down',
      error: error.message,
      lastCheck: new Date().toISOString()
    };
  }
}

// Leer logs recientes si existen
function getRecentLogs() {
  try {
    const logPaths = [
      'frontend/app/logs/console.log',
      'backend/app/logs/server.log'
    ];
    
    const logs = {};
    logPaths.forEach(logPath => {
      if (fs.existsSync(logPath)) {
        const content = fs.readFileSync(logPath, 'utf8');
        const lines = content.split('\n').slice(-20); // Últimas 20 líneas
        logs[logPath] = lines.filter(line => 
          line.includes('VideoPlayer') || 
          line.includes('video.js') ||
          line.includes('HLS')
        );
      }
    });
    
    return logs;
  } catch (error) {
    return { error: error.message };
  }
}

// Buscar en documentación oficial de Video.js
async function getVideoJSDocumentation(prompt) {
  const videoJSKeywords = {
    'overlay': 'https://docs.videojs.com/tutorial-plugins.html#overlay-plugin',
    'events': 'https://docs.videojs.com/tutorial-events.html',
    'useractive': 'https://docs.videojs.com/Player.html#event:useractive',
    'userinactive': 'https://docs.videojs.com/Player.html#event:userinactive',
    'controls': 'https://docs.videojs.com/tutorial-controls.html',
    'plugins': 'https://docs.videojs.com/tutorial-plugins.html',
    'playlist': 'https://github.com/videojs/videojs-playlist',
    'quality': 'https://github.com/videojs/videojs-contrib-quality-levels'
  };

  const relevantDocs = [];
  const lowerPrompt = prompt.toLowerCase();
  
  for (const [keyword, url] of Object.entries(videoJSKeywords)) {
    if (lowerPrompt.includes(keyword)) {
      relevantDocs.push({
        keyword,
        documentation: url,
        searchInstructions: `Buscar específicamente sobre "${keyword}" en la documentación oficial de Video.js`
      });
    }
  }

  return relevantDocs;
}

// Función principal
async function enhanceContext(originalPrompt) {
  const isVideoPlayerPrompt = isVideoPlayerRelated(originalPrompt);
  const detectedComponents = detectInternalComponents(originalPrompt);
  
  // Si no hay nada relevante, no agregar contexto
  if (!isVideoPlayerPrompt && detectedComponents.length === 0) {
    return {
      prompt: originalPrompt,
      additionalContext: null
    };
  }

  console.log('🔍 Contexto detectado:', {
    videoPlayer: isVideoPlayerPrompt,
    components: detectedComponents.map(c => `${c.name} (${c.level})`)
  });
  
  // Obtener documentación relevante para VideoPlayer
  const relevantDocs = isVideoPlayerPrompt ? await getVideoJSDocumentation(originalPrompt) : [];
  
  // Cargar contexto específico para componentes que lo tienen
  let specificContexts = {};
  for (const component of detectedComponents) {
    if (component.hasSpecificContext) {
      try {
        if (component.name === 'dynamicform') {
          const { getDynamicFormContext } = require('../contexts/dynamicform-context.js');
          specificContexts.dynamicForm = getDynamicFormContext(originalPrompt);
        } else if (component.name === 'videoplayer') {
          const { getVideoPlayerContext } = require('../contexts/videoplayer-context.js');
          specificContexts.videoPlayer = getVideoPlayerContext(originalPrompt);
        }
        // Aquí se pueden agregar más contextos específicos en el futuro
        // if (component.name === 'datatable') { ... }
      } catch (error) {
        console.warn(`⚠️ Error cargando contexto específico para ${component.name}:`, error.message);
      }
    }
  }

  const additionalContext = {
    timestamp: new Date().toISOString(),
    projectType: 'streaming-app',
    detectedContexts: {
      videoPlayer: isVideoPlayerPrompt,
      components: detectedComponents
    },
    
    // Información técnica actual
    technical: {
      framework: 'React + Video.js',
      streamingProtocol: 'HLS',
      supportedFormats: ['mp4', 'm3u8'],
      plugins: [
        'videojs-contrib-quality-levels',
        'jb-videojs-hls-quality-selector', 
        'videojs-overlay',
        'videojs-hotkeys',
        'videojs-playlist'
      ]
    },
    
    // Estado del entorno
    environment: {
      browser: getBrowserInfo(),
      cdn: await checkCDNStatus(),
      ports: {
        frontend: 8080,
        backend: 3000,
        cdn: 8082
      }
    },
    
    // Logs recientes relacionados
    recentLogs: getRecentLogs(),
    
    // Problemas comunes y soluciones
    commonIssues: {
      'video no carga': {
        checkList: [
          'Verificar que CDN esté activo (localhost:8082)',
          'Confirmar que el hash del video existe',
          'Validar parámetro resolutions en URL',
          'Revisar console.log para errores de red'
        ]
      },
      'cross-browser': {
        knownIssues: {
          safari: ['Autoplay restrictions', 'HLS native support conflicts'],
          firefox: ['Audio codec compatibility', 'Fullscreen API differences'],
          chrome: ['CORS policies', 'Hardware acceleration']
        }
      },
      'playlist/episodes': {
        debuggingSteps: [
          'Verificar sessionStorage con playlist key',
          'Confirmar currentEpisodeIndex en estado',
          'Revisar configuración autoadvance delay',
          'Validar que playlist plugin esté cargado'
        ]
      }
    },
    
    // Contexto de la sesión actual
    sessionContext: {
      lastModified: fs.existsSync('./frontend/app/src/Pages/VideoPlayer/VideoPlayer.jsx') 
        ? fs.statSync('./frontend/app/src/Pages/VideoPlayer/VideoPlayer.jsx').mtime
        : null,
      workingDirectory: process.cwd(),
      nodeEnv: process.env.NODE_ENV || 'development'
    },
    
    // Contexto para componentes internos detectados
    internalComponents: detectedComponents.length > 0 ? {
      detected: detectedComponents,
      instructions: {
        'auto-documented': 'IMPORTANTE: Leer primero el archivo .jsx y .stories.jsx del componente. Tienen documentación completa con JSDoc y ejemplos en Storybook.',
        'semi-complex': 'IMPORTANTE: Leer .jsx, .stories.jsx y revisar casos de uso comunes. Puede requerir contexto adicional del proyecto.',
        'complex-context-needed': 'IMPORTANTE: Estos componentes requieren contexto específico adicional. Leer archivos relacionados y entender la integración con el sistema.'
      },
      storybookUrl: 'http://localhost:6006',
      atomicDesignStructure: {
        atoms: 'Componentes básicos reutilizables con documentación completa',
        molecules: 'Combinaciones de átomos, pueden requerir contexto del dominio',
        organisms: 'Secciones complejas con lógica de negocio específica',
        templates: 'Layouts y estructuras de página'
      },
      projectPaths: {
        components: 'frontend/app/src/components/',
        atoms: 'frontend/app/src/components/atoms/',
        molecules: 'frontend/app/src/components/molecules/',
        organisms: 'frontend/app/src/components/organisms/',
        templates: 'frontend/app/src/components/templates/'
      }
    } : null,
    
    // Contextos específicos para componentes complejos
    specificComponentContexts: Object.keys(specificContexts).length > 0 ? specificContexts : null,
    
    // Documentación oficial relevante (VideoPlayer)
    officialDocumentation: isVideoPlayerPrompt ? {
      relevantLinks: relevantDocs,
      instructions: relevantDocs.length > 0 
        ? "IMPORTANTE: Consultar la documentación oficial de Video.js antes de proponer soluciones. Usar WebFetch para obtener información actualizada de los enlaces proporcionados."
        : "Considerar buscar en docs.videojs.com para obtener información oficial sobre el problema.",
      searchSuggestions: [
        "WebFetch con https://docs.videojs.com/tutorial-events.html para eventos useractive/userinactive",
        "WebFetch con https://docs.videojs.com/tutorial-plugins.html#overlay-plugin para problemas de overlay",
        "WebFetch con https://github.com/videojs/videojs-playlist para issues de playlist"
      ]
    } : null
  };

  return {
    prompt: originalPrompt,
    additionalContext: additionalContext
  };
}

// Si se ejecuta directamente
if (require.main === module) {
  const prompt = process.argv[2] || 'Test prompt about video player issues';
  
  enhanceContext(prompt).then(result => {
    console.log('Original prompt:', result.prompt);
    console.log('\nAdditional context:', JSON.stringify(result.additionalContext, null, 2));
  });
}

module.exports = { enhanceContext };