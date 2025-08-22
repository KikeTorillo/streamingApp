// test-iconprovider.jsx - Test Básico del IconProvider
// ✅ FASE 1: Verificación del sistema IconProvider antes de migración completa

import React from 'react';
import { IconProvider } from './providers/IconProvider';
import { IconV2 } from './components/atoms/Icon/IconV2';

// Configuración de prueba
const testConfig = {
  library: 'feather',
  customIcons: {
    'test-icon': () => (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <text x="12" y="16" textAnchor="middle" fontSize="8" fill="white">TEST</text>
      </svg>
    )
  },
  fallback: 'help-circle'
};

function TestIconProvider() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🧪 Test IconProvider V2</h1>
      
      <IconProvider config={testConfig}>
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          
          <section>
            <h2>✅ Iconos Universales (deberían funcionar en cualquier librería)</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <IconV2 name="home" size="md" />
              <IconV2 name="search" size="md" />
              <IconV2 name="user" size="md" />
              <IconV2 name="settings" size="md" />
              <IconV2 name="play" size="md" />
            </div>
          </section>
          
          <section>
            <h2>🎨 Iconos Custom</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <IconV2 name="test-icon" size="md" />
              <span>← Este es un icono custom</span>
            </div>
          </section>
          
          <section>
            <h2>📐 Diferentes Tamaños</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <IconV2 name="star" size="xs" />
              <IconV2 name="star" size="sm" />
              <IconV2 name="star" size="md" />
              <IconV2 name="star" size="lg" />
              <IconV2 name="star" size="xl" />
            </div>
          </section>
          
          <section>
            <h2>🎨 Diferentes Variantes</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <IconV2 name="heart" variant="primary" size="md" />
              <IconV2 name="heart" variant="secondary" size="md" />
              <IconV2 name="heart" variant="success" size="md" />
              <IconV2 name="heart" variant="warning" size="md" />
              <IconV2 name="heart" variant="danger" size="md" />
              <IconV2 name="heart" variant="neutral" size="md" />
            </div>
          </section>
          
          <section>
            <h2>🚨 Test de Fallback</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <IconV2 name="icono-que-no-existe" size="md" />
              <span>← Debería mostrar el icono fallback</span>
            </div>
          </section>
          
        </div>
      </IconProvider>
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>📋 Resultado Esperado:</h3>
        <ul>
          <li>✅ Iconos universales se muestran correctamente</li>
          <li>✅ Icono custom "TEST" aparece</li>
          <li>✅ Diferentes tamaños son progresivamente más grandes</li>
          <li>✅ Diferentes variantes tienen colores distintos</li>
          <li>✅ Icono inexistente muestra fallback (help-circle)</li>
        </ul>
      </div>
      
    </div>
  );
}

export default TestIconProvider;