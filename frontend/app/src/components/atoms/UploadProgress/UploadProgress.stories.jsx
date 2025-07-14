// ===== UPLOAD PROGRESS STORIES =====
// src/components/atoms/UploadProgress/UploadProgress.stories.jsx

import { useState } from 'react';
import { UploadProgress } from './UploadProgress';

export default {
  title: 'Components/Atoms/UploadProgress',
  component: UploadProgress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# UploadProgress Atom

Componente para mostrar el progreso de carga y procesamiento de archivos.

## Caracteristicas

- **Estados multiples**: processing, transcoding, completed, failed
- **Animaciones**: Barras shimmer y dots animados
- **Responsive**: Se adapta al contenedor
- **Accesibilidad**: ARIA y reduced motion
- **Tamaños**: sm, md, lg

## Uso basico

\`\`\`jsx
import { UploadProgress } from './atoms/UploadProgress';

<UploadProgress 
  progress={45}
  status="processing"
  message="Procesando archivo..."
  showPercentage={true}
  size="md"
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Porcentaje de progreso (0-100)'
    },
    status: {
      control: 'select',
      options: ['processing', 'transcoding', 'completed', 'failed'],
      description: 'Estado del progreso'
    },
    message: {
      control: 'text',
      description: 'Mensaje a mostrar'
    },
    showPercentage: {
      control: 'boolean',
      description: 'Mostrar porcentaje'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del componente'
    }
  }
};

// ===== HISTORIAS B�SICAS =====

export const Default = {
  args: {
    progress: 45,
    status: 'processing',
    message: 'Procesando archivo...',
    showPercentage: true,
    size: 'md'
  }
};

export const Processing = {
  args: {
    progress: 25,
    status: 'processing',
    message: 'Preparando archivo...',
    showPercentage: true,
    size: 'md'
  }
};

export const Transcoding = {
  args: {
    progress: 75,
    status: 'transcoding',
    message: 'Transcodificando video...',
    showPercentage: true,
    size: 'md'
  }
};

export const Completed = {
  args: {
    progress: 100,
    status: 'completed',
    message: 'Proceso completado!',
    showPercentage: true,
    size: 'md'
  }
};

export const Failed = {
  args: {
    progress: 60,
    status: 'failed',
    message: 'Error en el procesamiento',
    showPercentage: true,
    size: 'md'
  }
};

// ===== TAMA�OS =====

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
    <div>
      <h4>Pequeño (sm)</h4>
      <UploadProgress progress={30} status="processing" message="Tamaño pequeño" size="sm" />
    </div>
    <div>
      <h4>Mediano (md)</h4>
      <UploadProgress progress={60} status="transcoding" message="Tamaño mediano" size="md" />
    </div>
    <div>
      <h4>Grande (lg)</h4>
      <UploadProgress progress={90} status="processing" message="Tamaño grande" size="lg" />
    </div>
  </div>
);

// ===== EJEMPLO SIMPLE =====

export const SimpleTest = () => {
  const [progress, setProgress] = useState(25);
  
  return (
    <div style={{ padding: 'var(--space-lg)', maxWidth: '500px' }}>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
          Progreso: {progress}%
        </label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      
      <UploadProgress 
        progress={progress}
        status="processing"
        message={`Procesando ${progress}%...`}
        showPercentage={true}
        size="md"
      />
    </div>
  );
};

// ===== EJEMPLO INTERACTIVO =====

export const Interactive = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('processing');
  const [isRunning, setIsRunning] = useState(false);

  const startProgress = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    setStatus('processing');
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        
        if (newProgress >= 100) {
          setStatus('completed');
          setIsRunning(false);
          clearInterval(interval);
          return 100;
        } else if (newProgress >= 60) {
          setStatus('transcoding');
        }
        
        return newProgress;
      });
    }, 50);
  };

  const resetProgress = () => {
    setProgress(0);
    setStatus('processing');
    setIsRunning(false);
  };

  const simulateError = () => {
    setStatus('failed');
    setIsRunning(false);
  };

  const getMessage = () => {
    switch (status) {
      case 'processing': return 'Preparando archivo...';
      case 'transcoding': return 'Transcodificando video...';
      case 'completed': return 'Proceso completado exitosamente!';
      case 'failed': return 'Error en el procesamiento';
      default: return 'Procesando...';
    }
  };

  return (
    <div style={{ 
      padding: 'var(--space-lg)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{ 
        textAlign: 'center',
        marginBottom: 'var(--space-lg)'
      }}>
        <h3 style={{ margin: '0 0 var(--space-sm) 0' }}>Simulador de Progreso</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Progreso: {progress}% | Estado: {status}
        </p>
      </div>
      
      <UploadProgress 
        progress={progress}
        status={status}
        message={getMessage()}
        showPercentage={true}
        size="lg"
      />
      
      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-md)',
        justifyContent: 'center',
        marginTop: 'var(--space-lg)',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={startProgress}
          disabled={isRunning}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: isRunning ? '#999' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {isRunning ? 'Procesando...' : '� Iniciar'}
        </button>
        
        <button 
          onClick={resetProgress}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          =Reset
        </button>
        
        <button 
          onClick={simulateError}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          L Error
        </button>
      </div>
      
      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-tertiary)',
        marginTop: 'var(--space-md)',
        fontStyle: 'italic'
      }}>
        Haz clic en "Iniciar" para ver la animacion automatica
      </div>
    </div>
  );
};

Interactive.parameters = {
  docs: { 
    description: { 
      story: 'Ejemplo interactivo que simula un progreso real con cambios automaticos de estado.' 
    } 
  }
};