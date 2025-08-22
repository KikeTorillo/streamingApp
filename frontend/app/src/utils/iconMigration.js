// iconMigration.js - Utilidades para Migración al Sistema IconProvider V2
// ✅ FASE 1: Herramientas para migración gradual sin breaking changes

/**
 * ✅ MAPPING DE MIGRACIÓN - Icon.jsx → IconV2.jsx
 * Mapeo automático de iconos del sistema actual al nuevo sistema universal
 */
export const ICON_MIGRATION_MAP = {
  // Navigation & Media
  'play': 'play',
  'pause': 'pause', 
  'stop': 'stop',
  'skip-back': 'skip-back',
  'skip-forward': 'skip-forward',
  'refresh': 'refresh',
  'home': 'home',
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',
  'arrow-up': 'arrow-up',
  'arrow-down': 'arrow-down',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  'chevron-up': 'chevron-up',
  'chevron-down': 'chevron-down',
  
  // Actions & Interface
  'plus': 'plus',
  'add': 'plus',
  'minus': 'minus',
  'close': 'close',
  'x': 'close',
  'check': 'check',
  'edit': 'edit',
  'delete': 'delete',
  'trash': 'delete',
  'save': 'save',
  'copy': 'copy',
  'download': 'download',
  'upload': 'upload',
  'share': 'share',
  'external-link': 'external-link',
  
  // User & Social  
  'user': 'user',
  'users': 'users',
  'heart': 'heart',
  'favorite': 'heart',
  'star': 'star',
  'rating': 'star',
  'message': 'message',
  'mail': 'mail',
  'user-plus': 'user-plus',
  'user-minus': 'user-minus',
  'user-check': 'user-check',
  
  // Content & Media
  'image': 'image',
  'video': 'video',
  'film': 'film',
  'movie': 'film',
  'music': 'music',
  'file': 'file',
  'folder': 'folder',
  'camera': 'camera',
  'mic': 'mic',
  'volume': 'volume',
  'volume-off': 'volume-off',
  'mute': 'volume-off',
  
  // System & Settings
  'settings': 'settings',
  'config': 'settings',
  'sliders': 'sliders',
  'toggle-off': 'toggle-off',
  'toggle-on': 'toggle-on',
  'eye': 'eye',
  'eye-off': 'eye-off',
  'show': 'eye',
  'hide': 'eye-off',
  'lock': 'lock',
  'unlock': 'unlock',
  'shield': 'shield',
  'security': 'shield',
  
  // Communication & Status
  'search': 'search',
  'filter': 'filter',
  'notification': 'notification',
  'bell': 'notification',
  'info': 'info',
  'alert': 'warning',
  'warning': 'warning',
  'success': 'success',
  'check-circle': 'success',
  'error': 'error',
  'x-circle': 'error',
  'help-circle': 'help-circle',
  'trash-2': 'delete',
  'loading': 'loading',
  'spinner': 'loading',
  
  // Theme & Visual
  'sun': 'sun',
  'light': 'sun',
  'moon': 'moon',
  'dark': 'moon',
  'droplet': 'droplet',
  'ocean': 'droplet',
  'globe': 'globe',
  'world': 'globe',
  'tierra': 'globe',
  'nature': 'circle',
  'circle': 'circle',
  'zap': 'zap',
  'trending': 'trending',
  
  // Navigation & Layout
  'menu': 'menu',
  'hamburger': 'menu',
  'more': 'more',
  'more-horizontal': 'more',
  'more-vertical': 'more-vertical',
  'grid': 'grid',
  'list': 'list',
  'columns': 'columns',
  'maximize': 'maximize',
  'minimize': 'minimize',
  'fullscreen': 'maximize',
  
  // Sorting & Organization
  'sort': 'sort',
  'sort-asc': 'arrow-up',
  'sort-desc': 'arrow-down',
  
  // Time & Calendar
  'clock': 'clock',
  'time': 'clock',
  'calendar': 'calendar',
  'date': 'calendar',
  'watch': 'watch',
  
  // Technical
  'wifi': 'wifi',
  'wifi-off': 'wifi-off',
  'database': 'database',
  'server': 'server',
  'monitor': 'monitor',
  'desktop': 'monitor'
};

/**
 * ✅ FUNCIÓN PARA MIGRAR ICONOS AUTOMÁTICAMENTE
 * Convierte nombres del Icon original al nuevo sistema universal
 */
export function migrateIconName(oldIconName) {
  if (!oldIconName || typeof oldIconName !== 'string') {
    return oldIconName;
  }
  
  // Buscar en el mapping de migración
  const newIconName = ICON_MIGRATION_MAP[oldIconName];
  
  if (newIconName) {
    return newIconName;
  }
  
  // Si no hay mapping directo, intentar usar el mismo nombre
  // (puede funcionar si es un nombre universal)
  return oldIconName;
}

/**
 * ✅ FUNCIÓN PARA MIGRAR PROPS AUTOMÁTICAMENTE
 * Convierte props del Icon original al IconV2
 */
export function migrateIconProps(oldProps) {
  const {
    color,
    name,
    ...restProps
  } = oldProps;
  
  const newProps = { ...restProps };
  
  // Migrar prop 'color' a 'variant'
  if (color && color !== 'current') {
    newProps.variant = color === 'muted' ? 'neutral' : color;
    
    // Warning en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `🔄 Icon Migration: color="${color}" → variant="${newProps.variant}"`
      );
    }
  }
  
  // Migrar nombre de icono
  if (name) {
    newProps.name = migrateIconName(name);
    
    if (newProps.name !== name && process.env.NODE_ENV === 'development') {
      console.warn(
        `🔄 Icon Migration: name="${name}" → name="${newProps.name}"`
      );
    }
  }
  
  return newProps;
}

/**
 * ✅ WRAPPER COMPONENT PARA MIGRACIÓN GRADUAL
 * Permite usar Icon con API legacy pero renderiza con IconV2
 */
import React from 'react';
import { IconV2 } from '../components/atoms/Icon/IconV2';

export function IconMigrationWrapper(props) {
  const migratedProps = migrateIconProps(props);
  
  return <IconV2 {...migratedProps} />;
}

/**
 * ✅ HOOK PARA ANÁLISIS DE MIGRACIÓN
 * Ayuda a identificar qué iconos necesitan migración manual
 */
export function useIconMigrationAnalysis() {
  const [usedIcons] = React.useState(new Set());
  const [unmappedIcons] = React.useState(new Set());
  
  const analyzeIcon = React.useCallback((iconName) => {
    if (!iconName || typeof iconName !== 'string') return;
    
    usedIcons.add(iconName);
    
    if (!ICON_MIGRATION_MAP[iconName]) {
      unmappedIcons.add(iconName);
    }
  }, [usedIcons, unmappedIcons]);
  
  const getAnalysis = React.useCallback(() => {
    return {
      totalUsed: usedIcons.size,
      mapped: usedIcons.size - unmappedIcons.size,
      unmapped: unmappedIcons.size,
      unmappedList: Array.from(unmappedIcons),
      coverage: usedIcons.size > 0 ? ((usedIcons.size - unmappedIcons.size) / usedIcons.size * 100).toFixed(1) : 0
    };
  }, [usedIcons, unmappedIcons]);
  
  return { analyzeIcon, getAnalysis };
}

/**
 * ✅ CONFIGURACIÓN RECOMENDADA PARA STREAMING APP
 * Setup optimizado para el proyecto actual
 */
export const STREAMING_APP_ICON_CONFIG = {
  library: 'feather', // Mantener Feather como base para compatibilidad
  customIcons: {
    // Iconos específicos del dominio streaming
    'brand-logo': () => (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    'streaming-play': () => (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,3 19,12 5,21"/>
      </svg>
    ),
    'video-quality': () => (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <text x="12" y="12" textAnchor="middle" fontSize="6" fill="white">HD</text>
      </svg>
    ),
    'subtitle': () => (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="8" width="20" height="8" rx="1"/>
        <line x1="6" y1="12" x2="18" y2="12" stroke="white" strokeWidth="1"/>
      </svg>
    )
  },
  fallback: 'help-circle',
  sizes: {
    xs: '12px',
    sm: '16px', 
    md: '20px',
    lg: '24px',
    xl: '32px'
  },
  enableAutoMapping: true,
  enableFallback: true
};

/**
 * ✅ UTILITY PARA CREAR SCRIPT DE MIGRACIÓN AUTOMÁTICA
 * Genera comandos para migrar archivos de Icon a IconV2
 */
export function generateMigrationScript(projectPath = '/home/kike/Documentos/streamingApp/frontend/app/src') {
  const script = `
#!/bin/bash
# Script de Migración Automática - Icon → IconV2
# Generado automáticamente por iconMigration.js

echo "🔄 Iniciando migración de Icon a IconV2..."

# 1. Backup de archivos originales
echo "📦 Creando backup..."
cp -r ${projectPath}/components/atoms/Icon ${projectPath}/components/atoms/Icon.backup

# 2. Reemplazar imports automáticamente
echo "🔧 Migrando imports..."

# Buscar y reemplazar imports de Icon
find ${projectPath} -name "*.jsx" -o -name "*.js" | xargs sed -i 's/from.*Icon.*Icon/from ..\/..\/..\/components\/atoms\/Icon\/IconV2/g'

# 3. Actualizar prop color → variant
echo "🎨 Migrando props..."

# Reemplazar color="primary" → variant="primary"  
find ${projectPath} -name "*.jsx" -o -name "*.js" | xargs sed -i 's/color="primary"/variant="primary"/g'
find ${projectPath} -name "*.jsx" -o -name "*.js" | xargs sed -i 's/color="secondary"/variant="secondary"/g'
find ${projectPath} -name "*.jsx" -o -name "*.js" | xargs sed -i 's/color="success"/variant="success"/g'
find ${projectPath} -name "*.jsx" -o -name "*.js" | xargs sed -i 's/color="warning"/variant="warning"/g'
find ${projectPath} -name "*.jsx" -o -name "*.js" | xargs sed -i 's/color="danger"/variant="danger"/g'
find ${projectPath} -name "*.jsx" -o -name "*.js" | xargs sed -i 's/color="muted"/variant="neutral"/g'

echo "✅ Migración completada!"
echo "📋 Siguiente paso: Añadir IconProvider al root de la app"
echo "🧪 Probar componentes individualmente para verificar funcionamiento"
  `;
  
  return script.trim();
}

export default {
  migrateIconName,
  migrateIconProps,
  IconMigrationWrapper,
  useIconMigrationAnalysis,
  STREAMING_APP_ICON_CONFIG,
  generateMigrationScript
};