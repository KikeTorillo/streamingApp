// IconSystemV2Example.jsx - Ejemplo de Uso del Nuevo Sistema de Iconos Universal
// ✅ FASE 1: Demostración del IconProvider configurable

import React, { useState } from 'react';
import { IconProvider, useIconContext } from '../providers/IconProvider';
import { IconV2 } from '../components/atoms/Icon/IconV2';
import { Button } from '../components/atoms/Button/Button';
import { Card } from '../components/atoms/Card/Card';

// ✅ ICONOS CUSTOM DEL PROYECTO STREAMING
const CustomStreamingIcons = {
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
  'quality-hd': () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <text x="12" y="12" textAnchor="middle" fontSize="8" fill="white">HD</text>
    </svg>
  )
};

/**
 * ✅ CONFIGURACIONES DE EJEMPLO
 * Demostración de diferentes setups del IconProvider
 */
const EXAMPLE_CONFIGS = {
  // Zero-config (usa Feather Icons por defecto)
  default: {
    name: 'Default (Feather)',
    config: {}
  },
  
  // Lucide Icons con iconos custom
  lucide: {
    name: 'Lucide + Custom',
    config: {
      library: 'lucide',
      customIcons: CustomStreamingIcons,
      fallback: 'help-circle'
    }
  },
  
  // Heroicons v2 con tamaños custom
  heroicons: {
    name: 'Heroicons v2',
    config: {
      library: 'heroicons',
      sizes: {
        xs: '10px',
        sm: '14px',
        md: '18px',
        lg: '22px',
        xl: '30px'
      }
    }
  },
  
  // Phosphor Icons con auto-mapping deshabilitado
  phosphor: {
    name: 'Phosphor (Manual)',
    config: {
      library: 'phosphor',
      enableAutoMapping: false,
      enableFallback: false
    }
  },
  
  // Streaming App setup completo
  streaming: {
    name: 'Streaming App Setup',
    config: {
      library: 'feather',
      customIcons: CustomStreamingIcons,
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
    }
  }
};

/**
 * ✅ LISTA DE ICONOS PARA TESTING
 * Mezcla de iconos universales, específicos y custom
 */
const TEST_ICONS = [
  // Universales (funcionan en todas las librerías)
  'home', 'search', 'user', 'settings', 'play', 'heart',
  
  // Específicos de Feather
  'FiHome', 'FiSearch', 'FiUser',
  
  // Custom del proyecto
  'brand-logo', 'streaming-play', 'quality-hd',
  
  // No existentes (para probar fallback)
  'non-existent-icon', 'missing-icon'
];

/**
 * ✅ COMPONENT PARA MOSTRAR INFORMACIÓN DE LA LIBRERÍA ACTUAL
 */
function LibraryInfo() {
  const { currentLibrary, availableIcons, config } = useIconContext();
  
  return (
    <Card variant="neutral" className="library-info">
      <h3>📚 Librería Actual: {currentLibrary}</h3>
      <p><strong>Iconos disponibles:</strong> {availableIcons.length}</p>
      <p><strong>Auto-mapping:</strong> {config.enableAutoMapping ? '✅' : '❌'}</p>
      <p><strong>Fallback:</strong> {config.enableFallback ? '✅' : '❌'}</p>
      <p><strong>Iconos custom:</strong> {Object.keys(config.customIcons || {}).length}</p>
    </Card>
  );
}

/**
 * ✅ COMPONENT PARA TESTING DE ICONOS
 */
function IconTester() {
  const [selectedSize, setSelectedSize] = useState('md');
  const [selectedVariant, setSelectedVariant] = useState('neutral');
  
  return (
    <Card variant="neutral" className="icon-tester">
      <h3>🧪 Icon Tester</h3>
      
      {/* Controles */}
      <div className="controls">
        <label>
          Tamaño:
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="xs">XS (12px)</option>
            <option value="sm">SM (16px)</option>
            <option value="md">MD (20px)</option>
            <option value="lg">LG (24px)</option>
            <option value="xl">XL (32px)</option>
          </select>
        </label>
        
        <label>
          Variante:
          <select value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value)}>
            <option value="neutral">Neutral</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
          </select>
        </label>
      </div>
      
      {/* Grid de iconos */}
      <div className="icon-grid">
        {TEST_ICONS.map((iconName) => (
          <div key={iconName} className="icon-item">
            <IconV2 
              name={iconName} 
              size={selectedSize} 
              variant={selectedVariant}
              title={iconName}
            />
            <span className="icon-name">{iconName}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * ✅ COMPONENT PARA CAMBIO DINÁMICO DE LIBRERÍA
 */
function LibrarySwitcher() {
  const { setLibrary, currentLibrary } = useIconContext();
  
  return (
    <Card variant="primary" className="library-switcher">
      <h3>🔄 Runtime Library Switching</h3>
      <p>Cambiar librería de iconos dinámicamente sin reload:</p>
      
      <div className="button-group">
        <Button 
          variant={currentLibrary === 'feather' ? 'primary' : 'secondary'}
          onClick={() => setLibrary('feather')}
          leftIcon="FiFeather"
        >
          Feather Icons
        </Button>
        
        <Button 
          variant={currentLibrary === 'lucide' ? 'primary' : 'secondary'}
          onClick={() => setLibrary('lucide')}
          leftIcon="LuSparkles"
        >
          Lucide Icons
        </Button>
        
        <Button 
          variant={currentLibrary === 'heroicons' ? 'primary' : 'secondary'}
          onClick={() => setLibrary('heroicons')}
          leftIcon="Hi2StarIcon"
        >
          Heroicons v2
        </Button>
        
        <Button 
          variant={currentLibrary === 'phosphor' ? 'primary' : 'secondary'}
          onClick={() => setLibrary('phosphor')}
          leftIcon="PhPhosphor"
        >
          Phosphor Icons
        </Button>
      </div>
    </Card>
  );
}

/**
 * ✅ EXAMPLE PRINCIPAL
 * Demostración completa del sistema IconProvider
 */
function IconSystemV2Example() {
  const [currentConfig, setCurrentConfig] = useState('default');
  
  const activeConfig = EXAMPLE_CONFIGS[currentConfig];
  
  return (
    <div className="icon-system-example">
      <header>
        <h1>🎨 Icon System V2 - Universal Icon Provider</h1>
        <p>Sistema configurable que soporta múltiples librerías de iconos</p>
      </header>
      
      {/* Selector de configuración */}
      <Card variant="primary">
        <h2>⚙️ Configuración del IconProvider</h2>
        <div className="config-selector">
          {Object.entries(EXAMPLE_CONFIGS).map(([key, config]) => (
            <Button
              key={key}
              variant={currentConfig === key ? 'primary' : 'secondary'}
              onClick={() => setCurrentConfig(key)}
              size="sm"
            >
              {config.name}
            </Button>
          ))}
        </div>
      </Card>
      
      {/* Provider con configuración seleccionada */}
      <IconProvider config={activeConfig.config}>
        <div className="provider-content">
          
          {/* Información de la librería */}
          <LibraryInfo />
          
          {/* Switcher dinámico */}
          <LibrarySwitcher />
          
          {/* Tester de iconos */}
          <IconTester />
          
          {/* Ejemplos de uso en componentes */}
          <Card variant="success">
            <h3>✅ Uso en Componentes del Sistema</h3>
            <div className="component-examples">
              <Button leftIcon="play" variant="primary">
                Reproducir
              </Button>
              
              <Button leftIcon="brand-logo" variant="secondary">
                StreamingApp
              </Button>
              
              <Button leftIcon="quality-hd" variant="success" rightIcon="arrow-right">
                Ver en HD
              </Button>
            </div>
          </Card>
          
        </div>
      </IconProvider>
      
      {/* Código de ejemplo */}
      <Card variant="neutral">
        <h3>💻 Código de Ejemplo</h3>
        <pre><code>{`
// Setup básico
<IconProvider config={{ library: 'lucide' }}>
  <App />
</IconProvider>

// Setup avanzado para Streaming App
<IconProvider config={{
  library: 'feather',
  customIcons: {
    'brand-logo': BrandLogoComponent,
    'streaming-play': StreamingPlayComponent
  },
  fallback: 'help-circle',
  enableAutoMapping: true
}}>
  <App />
</IconProvider>

// Uso en componentes
<IconV2 name="play" size="lg" variant="primary" />
<IconV2 name="brand-logo" size="md" />
<Button leftIcon="streaming-play">Reproducir</Button>
        `}</code></pre>
      </Card>
      
    </div>
  );
}

export default IconSystemV2Example;