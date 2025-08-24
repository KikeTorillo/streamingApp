// tokens/animationTokens.js - SISTEMA DE ANIMACIONES AUTOMÁTICAS
// Recomendación #2 del Plan Optimización Final: 94% → 100%

/**
 * 🎨 ANIMATION SYSTEM - MICRO-INTERACTIONS DE CLASE MUNDIAL
 * 
 * PROBLEMA RESUELTO:
 * - ❌ Componentes estáticos sin feedback visual
 * - ❌ Cada developer define sus propias transiciones
 * - ❌ Inconsistencia en timing y easing
 * 
 * SOLUCIÓN:
 * - ✅ Micro-animaciones automáticas y contextuales
 * - ✅ Sistema de timing científicamente optimizado
 * - ✅ Transiciones suaves tipo iOS/Material Design
 * 
 * INTEGRACIÓN:
 * - Automático en useInteractiveProps V2
 * - CSS automático con tokens CSS
 * - Zero configuración para developer
 */

// ===== DURACIONES OPTIMIZADAS CIENTÍFICAMENTE =====
export const ANIMATION_TOKENS = {
  duration: {
    instant: '0ms',        // Sin animación - disable animations
    fast: '150ms',         // ⚡ Hover, focus, active states
    normal: '250ms',       // 🎯 DEFAULT - transiciones estándar
    slow: '350ms',         // 📱 Modales, drawers, dropdowns
    slower: '500ms',       // 📄 Page transitions, route changes
    slowest: '750ms'       // 🌊 Complex animations, loading states
  },
  
  // ===== EASING CURVES PROFESIONALES =====
  easing: {
    // Linear - Raramente usado
    linear: 'linear',
    
    // Standard CSS easings
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    
    // ✅ RECOMENDADOS: Cubic bezier optimizados
    natural: 'cubic-bezier(0, 0, 0.2, 1)',           // DEFAULT - Suave, natural
    snappy: 'cubic-bezier(0.4, 0, 0.2, 1)',          // Material Design estándar
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Efecto bounce sutil
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',           // Entrada rápida, salida suave
    emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1)',   // Material Design emphasized
    
    // Especializados por contexto
    hover: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',   // Hover states
    focus: 'cubic-bezier(0.16, 1, 0.3, 1)',          // Focus states
    slide: 'cubic-bezier(0.22, 1, 0.36, 1)',         // Slide animations
    scale: 'cubic-bezier(0.34, 1.56, 0.64, 1)'       // Scale/zoom effects
  }
};

// ===== PRESETS DE ANIMACIONES LISTAS PARA USAR =====
export const ANIMATION_PRESETS = {
  // ===== INTERACTIONS (hover, focus, active) =====
  buttonHover: {
    property: 'all',
    duration: ANIMATION_TOKENS.duration.fast,      // 150ms
    easing: ANIMATION_TOKENS.easing.hover,         // hover curve
    description: 'Button hover effect'
  },
  
  buttonFocus: {
    property: 'box-shadow, border-color',
    duration: ANIMATION_TOKENS.duration.normal,    // 250ms  
    easing: ANIMATION_TOKENS.easing.focus,         // focus curve
    description: 'Button focus ring animation'
  },
  
  buttonActive: {
    property: 'transform',
    duration: ANIMATION_TOKENS.duration.instant,   // 0ms (immediate)
    easing: ANIMATION_TOKENS.easing.natural,
    description: 'Button press effect'
  },
  
  // ===== MICRO-INTERACTIONS =====
  fadeIn: {
    property: 'opacity',
    duration: ANIMATION_TOKENS.duration.normal,    // 250ms
    easing: ANIMATION_TOKENS.easing.natural,
    keyframes: {
      from: { opacity: 0 },
      to: { opacity: 1 }
    },
    description: 'Smooth fade in effect'
  },
  
  slideIn: {
    property: 'transform',
    duration: ANIMATION_TOKENS.duration.normal,    // 250ms
    easing: ANIMATION_TOKENS.easing.slide,
    keyframes: {
      from: { transform: 'translateY(10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 }
    },
    description: 'Slide in from bottom'
  },
  
  scaleIn: {
    property: 'transform',
    duration: ANIMATION_TOKENS.duration.fast,      // 150ms
    easing: ANIMATION_TOKENS.easing.scale,         // bounce effect
    keyframes: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 }
    },
    description: 'Scale in with bounce'
  },
  
  // ===== LOADING STATES =====
  pulse: {
    property: 'opacity',
    duration: '1200ms',                             // Slower for loading
    easing: ANIMATION_TOKENS.easing.easeInOut,
    infinite: true,
    direction: 'alternate',
    keyframes: {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.4 },
      '100%': { opacity: 1 }
    },
    description: 'Pulsing loading effect'
  },
  
  spinner: {
    property: 'transform',
    duration: '1000ms',
    easing: ANIMATION_TOKENS.easing.linear,
    infinite: true,
    keyframes: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    },
    description: 'Spinning loading indicator'
  },
  
  // ===== MODAL & OVERLAY ANIMATIONS =====
  modalEnter: {
    property: 'opacity, transform',
    duration: ANIMATION_TOKENS.duration.slow,      // 350ms
    easing: ANIMATION_TOKENS.easing.emphasized,
    keyframes: {
      from: { 
        opacity: 0, 
        transform: 'scale(0.9) translateY(-10px)' 
      },
      to: { 
        opacity: 1, 
        transform: 'scale(1) translateY(0)' 
      }
    },
    description: 'Modal entrance animation'
  },
  
  backdropEnter: {
    property: 'opacity',
    duration: ANIMATION_TOKENS.duration.normal,    // 250ms
    easing: ANIMATION_TOKENS.easing.natural,
    keyframes: {
      from: { opacity: 0 },
      to: { opacity: 1 }
    },
    description: 'Modal backdrop fade in'
  },
  
  // ===== TOAST & NOTIFICATION ANIMATIONS =====
  slideInRight: {
    property: 'transform, opacity',
    duration: ANIMATION_TOKENS.duration.slow,      // 350ms
    easing: ANIMATION_TOKENS.easing.snappy,
    keyframes: {
      from: { 
        transform: 'translateX(100%)', 
        opacity: 0 
      },
      to: { 
        transform: 'translateX(0)', 
        opacity: 1 
      }
    },
    description: 'Toast slide in from right'
  }
};

// ===== CONTEXT-AWARE ANIMATION MAPPING =====
export const ANIMATION_CONTEXT_MAP = {
  // Por tipo de componente
  Button: {
    hover: ANIMATION_PRESETS.buttonHover,
    focus: ANIMATION_PRESETS.buttonFocus,
    active: ANIMATION_PRESETS.buttonActive,
    enter: ANIMATION_PRESETS.fadeIn
  },
  
  Input: {
    focus: ANIMATION_PRESETS.buttonFocus,
    enter: ANIMATION_PRESETS.fadeIn
  },
  
  Modal: {
    enter: ANIMATION_PRESETS.modalEnter,
    backdrop: ANIMATION_PRESETS.backdropEnter
  },
  
  Toast: {
    enter: ANIMATION_PRESETS.slideInRight,
    exit: { ...ANIMATION_PRESETS.slideInRight, reverse: true }
  },
  
  Card: {
    hover: {
      property: 'transform, box-shadow',
      duration: ANIMATION_TOKENS.duration.normal,
      easing: ANIMATION_TOKENS.easing.natural
    },
    enter: ANIMATION_PRESETS.slideIn
  }
};

// ===== CSS CUSTOM PROPERTIES PARA FÁCIL USO =====
export const ANIMATION_CSS_VARS = {
  // Duraciones
  '--animation-instant': ANIMATION_TOKENS.duration.instant,
  '--animation-fast': ANIMATION_TOKENS.duration.fast,
  '--animation-normal': ANIMATION_TOKENS.duration.normal,
  '--animation-slow': ANIMATION_TOKENS.duration.slow,
  '--animation-slower': ANIMATION_TOKENS.duration.slower,
  '--animation-slowest': ANIMATION_TOKENS.duration.slowest,
  
  // Easing curves
  '--easing-natural': ANIMATION_TOKENS.easing.natural,
  '--easing-snappy': ANIMATION_TOKENS.easing.snappy,
  '--easing-bounce': ANIMATION_TOKENS.easing.bounce,
  '--easing-hover': ANIMATION_TOKENS.easing.hover,
  '--easing-focus': ANIMATION_TOKENS.easing.focus,
  
  // Presets más usados
  '--animation-button-hover': `all ${ANIMATION_TOKENS.duration.fast} ${ANIMATION_TOKENS.easing.hover}`,
  '--animation-button-focus': `box-shadow ${ANIMATION_TOKENS.duration.normal} ${ANIMATION_TOKENS.easing.focus}`,
  '--animation-fade-in': `opacity ${ANIMATION_TOKENS.duration.normal} ${ANIMATION_TOKENS.easing.natural}`,
  '--animation-slide-in': `transform ${ANIMATION_TOKENS.duration.normal} ${ANIMATION_TOKENS.easing.slide}`
};

// ===== HELPER FUNCTIONS =====

/**
 * Genera string de transición CSS completo
 * @param {string} componentName - Nombre del componente
 * @param {string} state - Estado (hover, focus, active)
 * @returns {string} CSS transition string
 */
export function getAnimationForComponent(componentName, state = 'hover') {
  const context = ANIMATION_CONTEXT_MAP[componentName];
  if (!context || !context[state]) {
    return ANIMATION_PRESETS.fadeIn; // Fallback
  }
  
  const animation = context[state];
  return `${animation.property} ${animation.duration} ${animation.easing}`;
}

/**
 * Genera keyframes CSS para animaciones complejas
 * @param {string} name - Nombre de la animación
 * @returns {Object} Keyframes CSS-in-JS
 */
export function generateKeyframes(name) {
  const preset = ANIMATION_PRESETS[name];
  if (!preset || !preset.keyframes) {
    return {};
  }
  
  return preset.keyframes;
}

/**
 * Crea configuración de animación para styled-components o CSS-in-JS
 * @param {string} presetName - Nombre del preset
 * @returns {Object} Configuración completa
 */
export function createAnimationConfig(presetName) {
  const preset = ANIMATION_PRESETS[presetName];
  if (!preset) {
    return {};
  }
  
  return {
    transition: `${preset.property} ${preset.duration} ${preset.easing}`,
    ...(preset.keyframes && { keyframes: preset.keyframes }),
    ...(preset.infinite && { animationIterationCount: 'infinite' }),
    ...(preset.direction && { animationDirection: preset.direction })
  };
}

// ===== ANIMATION UTILITIES =====
export const ANIMATION_UTILS = {
  // Disable animations para usuarios con preferencias de accesibilidad
  respectReducedMotion: `
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `,
  
  // Base para todos los elementos animados
  baseAnimationClass: {
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    perspective: '1000px'
  }
};

// ===== EJEMPLO DE INTEGRACIÓN =====
/*
// EN useInteractiveProps V2:
const animationTokens = {
  hover: getAnimationForComponent(componentName, 'hover'),
  focus: getAnimationForComponent(componentName, 'focus'),
  enter: getAnimationForComponent(componentName, 'enter')
};

// EN CSS:
.button {
  transition: var(--animation-button-hover);
}

.button:hover {
  transform: translateY(-1px);
}

.button:focus {
  transition: var(--animation-button-focus);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
}

// RESULTADO:
// ✅ Micro-interactions automáticas
// ✅ Transiciones suaves y naturales  
// ✅ Performance optimizada
// ✅ Accesibilidad respetada (prefers-reduced-motion)
// ✅ Zero configuración para developer
*/