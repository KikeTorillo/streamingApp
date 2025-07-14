import { useState } from 'react';
import { ProgressModal } from './ProgressModal';

export default {
  title: 'Components/Molecules/ProgressModal',
  component: ProgressModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# ProgressModal Molecule

La molécula **ProgressModal** combina el átomo UploadProgress con un modal overlay para mostrar el progreso de operaciones de larga duración de manera elegante y consistente.

## 🎯 Características principales

- **Modal overlay unificado**: Consistencia visual entre Movies, Series y Episodes
- **Estados completos**: uploading, processing, transcoding, completed, failed
- **Accesibilidad**: ARIA modal, navegación por teclado, reduced motion
- **Responsive**: Adaptable a diferentes dispositivos
- **Animaciones elegantes**: Entrada suave y backdrop blur

## 🔧 Uso básico

\`\`\`jsx
import { ProgressModal } from './molecules/ProgressModal';

<ProgressModal 
  isVisible={status !== 'idle'}
  progress={progress}
  status={status}
  message={message}
  onClose={handleClose}
/>
\`\`\`

## 🎨 Casos de uso

- **Movies**: Modal durante upload y transcodificación de películas
- **Series**: Modal durante creación de series (sin video)
- **Episodes**: Modal durante upload y transcodificación de episodios
        `
      }
    }
  },
  argTypes: {
    isVisible: {
      name: 'Visible',
      description: 'Si el modal está visible',
      control: 'boolean',
      table: { 
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    progress: {
      name: 'Progreso',
      description: 'Porcentaje de progreso (0-100)',
      control: { type: 'range', min: 0, max: 100, step: 1 },
      table: { 
        type: { summary: 'number' },
        defaultValue: { summary: '0' }
      }
    },
    status: {
      name: 'Estado',
      description: 'Estado actual del progreso',
      control: 'select',
      options: ['uploading', 'processing', 'transcoding', 'completed', 'failed'],
      table: { 
        type: { summary: "'uploading' | 'processing' | 'transcoding' | 'completed' | 'failed'" },
        defaultValue: { summary: 'processing' }
      }
    },
    message: {
      name: 'Mensaje',
      description: 'Texto descriptivo del estado actual',
      control: 'text',
      table: { 
        type: { summary: 'string' },
        defaultValue: { summary: 'Procesando...' }
      }
    },
    showPercentage: {
      name: 'Mostrar porcentaje',
      description: 'Si se muestra el porcentaje numérico',
      control: 'boolean',
      table: { 
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del componente UploadProgress interno',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { 
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' }
      }
    },
    onClose: {
      name: 'Al cerrar',
      description: 'Función llamada al cerrar el modal (solo disponible en completed/failed)',
      action: 'closed',
      table: { 
        type: { summary: 'function' }
      }
    }
  }
};

// ========== 1. DEFAULT ==========
export const Default = {
  args: {
    isVisible: true,
    progress: 65,
    status: 'transcoding',
    message: 'Transcodificando video...',
    showPercentage: true,
    size: 'md'
  }
};

// ========== 2. UPLOADING ==========
export const Uploading = () => (
  <ProgressModal
    isVisible={true}
    progress={25}
    status="uploading"
    message="Subiendo archivo al servidor..."
    showPercentage={true}
    size="md"
  />
);
Uploading.parameters = {
  docs: { 
    description: { 
      story: 'Modal mostrando el estado de subida de archivo con progreso del 25%.' 
    } 
  }
};

// ========== 3. PROCESSING ==========
export const Processing = () => (
  <ProgressModal
    isVisible={true}
    progress={50}
    status="processing"
    message="Validando y preparando el contenido..."
    showPercentage={true}
    size="md"
  />
);
Processing.parameters = {
  docs: { 
    description: { 
      story: 'Modal mostrando el estado de procesamiento con validación de contenido.' 
    } 
  }
};

// ========== 4. TRANSCODING ==========
export const Transcoding = () => (
  <ProgressModal
    isVisible={true}
    progress={80}
    status="transcoding"
    message="Generando diferentes calidades de video..."
    showPercentage={true}
    size="md"
  />
);
Transcoding.parameters = {
  docs: { 
    description: { 
      story: 'Modal mostrando transcodificación avanzada del video.' 
    } 
  }
};

// ========== 5. COMPLETED ==========
export const Completed = () => (
  <ProgressModal
    isVisible={true}
    progress={100}
    status="completed"
    message="¡Proceso completado exitosamente!"
    showPercentage={true}
    size="md"
    onClose={() => console.log('Modal cerrado')}
  />
);
Completed.parameters = {
  docs: { 
    description: { 
      story: 'Modal mostrando éxito con botón de cerrar disponible.' 
    } 
  }
};

// ========== 6. FAILED ==========
export const Failed = () => (
  <ProgressModal
    isVisible={true}
    progress={35}
    status="failed"
    message="Error durante el procesamiento del video"
    showPercentage={true}
    size="md"
    onClose={() => console.log('Modal cerrado tras error')}
  />
);
Failed.parameters = {
  docs: { 
    description: { 
      story: 'Modal mostrando estado de error con botón de cerrar.' 
    } 
  }
};

// ========== 7. SIZES ==========
export const Sizes = () => {
  const [size, setSize] = useState('md');
  
  return (
    <div style={{ padding: 'var(--space-md)' }}>
      <div style={{ 
        marginBottom: 'var(--space-lg)',
        textAlign: 'center'
      }}>
        <label style={{ 
          fontSize: 'var(--font-size-md)',
          marginRight: 'var(--space-sm)'
        }}>
          Tamaño:
        </label>
        <select 
          value={size} 
          onChange={(e) => setSize(e.target.value)}
          style={{
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}
        >
          <option value="sm">Pequeño (sm)</option>
          <option value="md">Mediano (md)</option>
          <option value="lg">Grande (lg)</option>
        </select>
      </div>
      
      <ProgressModal
        isVisible={true}
        progress={70}
        status="transcoding"
        message={`Transcodificando en tamaño ${size}...`}
        showPercentage={true}
        size={size}
      />
    </div>
  );
};
Sizes.parameters = {
  docs: { 
    description: { 
      story: 'Diferentes tamaños del componente interno UploadProgress.' 
    } 
  }
};

// ========== 8. INTERACTIVE SIMULATION ==========
export const InteractiveSimulation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('uploading');
  const [isRunning, setIsRunning] = useState(false);

  const startProcess = () => {
    if (isRunning) return;
    
    setIsVisible(true);
    setIsRunning(true);
    setProgress(0);
    setStatus('uploading');
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setStatus('completed');
          setIsRunning(false);
          clearInterval(interval);
          return 100;
        } else if (prev >= 60) {
          setStatus('transcoding');
        } else if (prev >= 30) {
          setStatus('processing');
        }
        return prev + 2;
      });
    }, 150);
  };

  const simulateError = () => {
    setStatus('failed');
    setIsRunning(false);
  };

  const resetProcess = () => {
    setIsVisible(false);
    setProgress(0);
    setStatus('uploading');
    setIsRunning(false);
  };

  const getMessage = () => {
    switch (status) {
      case 'uploading': return `Subiendo archivo... ${progress}%`;
      case 'processing': return 'Validando y preparando contenido...';
      case 'transcoding': return `Transcodificando video... ${progress}%`;
      case 'completed': return '¡Proceso completado exitosamente!';
      case 'failed': return 'Error durante el procesamiento';
      default: return 'Procesando...';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--space-lg)', 
      alignItems: 'center', 
      padding: 'var(--space-md)'
    }}>
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-sm)',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button 
          onClick={startProcess}
          disabled={isRunning}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: isRunning ? '#6b7280' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500'
          }}
        >
          {isRunning ? 'Procesando...' : '🚀 Iniciar Proceso'}
        </button>
        
        <button 
          onClick={simulateError}
          disabled={!isRunning}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: !isRunning ? '#6b7280' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: !isRunning ? 'not-allowed' : 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500'
          }}
        >
          💥 Simular Error
        </button>
        
        <button 
          onClick={resetProcess}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500'
          }}
        >
          🔄 Reset
        </button>
      </div>
      
      <div style={{
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        💡 Simula el flujo completo: Upload → Processing → Transcoding → Completed
      </div>

      <ProgressModal
        isVisible={isVisible}
        progress={progress}
        status={status}
        message={getMessage()}
        showPercentage={true}
        size="md"
        onClose={status === 'completed' || status === 'failed' ? resetProcess : null}
      />
    </div>
  );
};
InteractiveSimulation.parameters = {
  docs: { 
    description: { 
      story: 'Simulación interactiva completa del flujo de procesamiento con todos los estados.' 
    } 
  }
};