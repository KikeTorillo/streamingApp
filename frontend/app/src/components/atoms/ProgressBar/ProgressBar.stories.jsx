// src/components/atoms/ProgressBar/ProgressBar.stories.jsx
import { ProgressBar } from './ProgressBar';

export default {
  title: 'Components/Atoms/ProgressBar',
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component: 'Indicadores de progreso universales con soporte completo para estados, animaciones y accesibilidad. Incluye modos determinado e indeterminado con variantes semánticas.'
      }
    }
  },
  argTypes: {
    value: {
      description: 'Valor actual del progreso (0-100)',
      control: { type: 'range', min: 0, max: 100, step: 1 }
    },
    max: {
      description: 'Valor máximo del progreso',
      control: { type: 'number', min: 1, step: 1 }
    },
    size: {
      description: 'Tamaño del indicador',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    variant: {
      description: 'Variante semántica del progreso',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']
    },
    showLabel: {
      description: 'Mostrar porcentaje como texto',
      control: { type: 'boolean' }
    },
    animate: {
      description: 'Habilitar animaciones suaves',
      control: { type: 'boolean' }
    },
    striped: {
      description: 'Patrón de rayas animadas',
      control: { type: 'boolean' }
    },
    pulse: {
      description: 'Efecto de pulso en la barra',
      control: { type: 'boolean' }
    },
    indeterminate: {
      description: 'Progreso indeterminado (loading infinito)',
      control: { type: 'boolean' }
    },
    loading: {
      description: 'Estado de loading con overlay',
      control: { type: 'boolean' }
    },
    disabled: {
      description: 'Estado deshabilitado',
      control: { type: 'boolean' }
    }
  }
};

// Historia base/default
export const Default = {
  args: {
    value: 47,
    size: 'md',
    variant: 'primary',
    showLabel: false
  }
};

// ===== TAMAÑOS =====

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Extra Small (xs)</h3>
      <ProgressBar value={25} size="xs" variant="primary" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Small (sm)</h3>
      <ProgressBar value={35} size="sm" variant="primary" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Medium (md) - Default</h3>
      <ProgressBar value={50} size="md" variant="primary" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Large (lg)</h3>
      <ProgressBar value={65} size="lg" variant="primary" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Extra Large (xl)</h3>
      <ProgressBar value={80} size="xl" variant="primary" showLabel />
    </div>
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Cinco tamaños estándar disponibles. Mobile optimizado - tamaños xs/sm se incrementan automáticamente en pantallas pequeñas.'
    }
  }
};

// ===== VARIANTES SEMÁNTICAS =====

export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Primary - Progreso general</h3>
      <ProgressBar value={45} variant="primary" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Secondary - Procesos secundarios</h3>
      <ProgressBar value={60} variant="secondary" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Success - Completación exitosa</h3>
      <ProgressBar value={85} variant="success" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Warning - Procesos con precaución</h3>
      <ProgressBar value={30} variant="warning" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Danger - Procesos críticos</h3>
      <ProgressBar value={15} variant="danger" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Neutral - Sin connotación semántica</h3>
      <ProgressBar value={70} variant="neutral" showLabel />
    </div>
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Seis variantes semánticas con colores y significados específicos. Cada variante incluye gradientes sutiles y sombras contextuales.'
    }
  }
};

// ===== CON ETIQUETAS =====

export const WithLabels = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Sin etiqueta</h3>
      <ProgressBar value={42} variant="primary" />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Con porcentaje</h3>
      <ProgressBar value={42} variant="primary" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Valor personalizado (max: 200)</h3>
      <ProgressBar value={84} max={200} variant="success" showLabel />
    </div>
  </div>
);

WithLabels.parameters = {
  docs: {
    description: {
      story: 'Control de visibilidad de etiquetas de progreso. Las etiquetas incluyen font-variant-numeric para alineación consistente de números.'
    }
  }
};

// ===== EFECTOS Y ANIMACIONES =====

export const Effects = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Animación estándar</h3>
      <ProgressBar value={55} variant="primary" animate showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Rayas animadas</h3>
      <ProgressBar value={70} variant="secondary" striped showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Efecto pulse</h3>
      <ProgressBar value={45} variant="success" pulse showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Combinado: rayas + pulse</h3>
      <ProgressBar value={65} variant="warning" striped pulse showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Sin animaciones</h3>
      <ProgressBar value={30} variant="neutral" animate={false} showLabel />
    </div>
  </div>
);

Effects.parameters = {
  docs: {
    description: {
      story: 'Efectos visuales disponibles: rayas animadas, pulso y combinaciones. Respeta prefers-reduced-motion automáticamente.'
    }
  }
};

// ===== MODO INDETERMINADO =====

export const IndeterminateMode = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Indeterminado básico</h3>
      <ProgressBar indeterminate variant="primary" />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Con etiqueta de carga</h3>
      <ProgressBar indeterminate variant="primary" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Indeterminado + pulse</h3>
      <ProgressBar indeterminate variant="secondary" pulse showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Tamaño grande</h3>
      <ProgressBar indeterminate variant="success" size="lg" showLabel />
    </div>
  </div>
);

IndeterminateMode.parameters = {
  docs: {
    description: {
      story: 'Modo indeterminado para procesos sin progreso medible. Usa animación de barrido continuo con etiquetas contextuales.'
    }
  }
};

// ===== ESTADOS =====

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Estado normal</h3>
      <ProgressBar value={60} variant="primary" showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Estado loading</h3>
      <ProgressBar value={40} variant="primary" loading showLabel />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Estado disabled</h3>
      <ProgressBar value={75} variant="primary" disabled showLabel />
    </div>
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Estados disponibles: normal, loading (con spinner overlay) y disabled (con reducción de opacidad).'
    }
  }
};

// ===== CASOS DE USO REALES =====

export const UseCases = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
    {/* File Upload */}
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>📁 Subida de Archivo</h3>
      <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
        video-presentation.mp4 (47.2 MB)
      </div>
      <ProgressBar value={73} size="lg" variant="primary" showLabel striped />
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
        34.5 MB de 47.2 MB • Tiempo restante: 2 min
      </div>
    </div>

    {/* Form Progress */}
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>📋 Progreso de Formulario</h3>
      <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
        Paso 3 de 4 completados
      </div>
      <ProgressBar value={75} max={4} size="md" variant="success" showLabel />
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
        Información personal • Verificación • Configuración • <strong>Finalizar</strong>
      </div>
    </div>

    {/* Data Processing */}
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>⚙️ Procesamiento de Datos</h3>
      <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
        Procesando 2,847 registros...
      </div>
      <ProgressBar value={45} size="md" variant="secondary" showLabel pulse striped />
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
        1,281 procesados • 1,566 pendientes
      </div>
    </div>

    {/* Loading State */}
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>🔄 Estado de Carga</h3>
      <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
        Inicializando aplicación...
      </div>
      <ProgressBar indeterminate size="lg" variant="primary" showLabel pulse />
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
        Conectando con servidor • Cargando configuración
      </div>
    </div>

    {/* Error/Warning State */}
    <div style={{ padding: '1rem', border: '1px solid #fecaca', borderRadius: '8px', backgroundColor: '#fef2f2' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>⚠️ Proceso con Advertencias</h3>
      <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#7f1d1d' }}>
        Sincronización con errores no críticos
      </div>
      <ProgressBar value={89} size="md" variant="warning" showLabel />
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#7f1d1d' }}>
        127 elementos sincronizados • 15 con advertencias
      </div>
    </div>
  </div>
);

UseCases.parameters = {
  docs: {
    description: {
      story: 'Ejemplos de casos de uso reales: subida de archivos, formularios multi-paso, procesamiento de datos, estados de carga y manejo de errores.'
    }
  }
};

// ===== ACCESSIBILITY SHOWCASE =====

export const Accessibility = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Con ARIA label personalizado</h3>
      <ProgressBar 
        value={65} 
        variant="primary" 
        showLabel 
        ariaLabel="Progreso de instalación del software"
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Modo indeterminado accesible</h3>
      <ProgressBar 
        indeterminate 
        variant="secondary" 
        showLabel 
        ariaLabel="Conectando con el servidor, por favor espere"
      />
    </div>
    <div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>Valor personalizado con contexto</h3>
      <ProgressBar 
        value={3} 
        max={5} 
        variant="success" 
        showLabel 
        ariaLabel="Calificación del usuario: 3 de 5 estrellas"
      />
    </div>
  </div>
);

Accessibility.parameters = {
  docs: {
    description: {
      story: 'Características de accesibilidad: ARIA labels contextuales, valores para screen readers, y anuncios de estado automáticos.'
    }
  }
};

// ===== INTERACTIVE PLAYGROUND =====

export const InteractivePlayground = {
  args: {
    value: 42,
    max: 100,
    size: 'md',
    variant: 'primary',
    showLabel: true,
    animate: true,
    striped: false,
    pulse: false,
    indeterminate: false,
    loading: false,
    disabled: false,
    ariaLabel: ''
  }
};

InteractivePlayground.parameters = {
  docs: {
    description: {
      story: 'Playground interactivo para experimentar con todas las propiedades del ProgressBar. Usa los controles de abajo para probar diferentes combinaciones.'
    }
  }
};