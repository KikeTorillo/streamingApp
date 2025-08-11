// Spinner.stories.jsx - MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from './Spinner';
import { Button } from '../Button/Button';

export default {
  title: 'Components/Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Spinner Atom

El átomo **Spinner** proporciona indicadores de carga elegantes completamente migrado al sistema estándar de diseño.

## ✅ Migración Completada

- **Props estándar**: size, variant, rounded, loading, disabled
- **validateStandardProps**: Con deprecation warnings integradas  
- **STANDARD_PROP_TYPES**: Para consistencia total
- **Backward compatibility**: color → variant automático
- **6 variantes semánticas**: primary, secondary, success, warning, danger, neutral
- **5 tamaños estándar**: xs, sm, md, lg, xl

## 🎯 Características principales

- **4 tipos de animación**: circle, dots, pulse, bars
- **5 tamaños estándar**: xs(24px), sm(32px), md(48px), lg(64px), xl(80px)
- **6 variantes semánticas**: primary, secondary, success, warning, danger, neutral
- **Bordes redondeados**: sm, md, lg, xl, full (aplicable en pulse)
- **Estados del sistema**: loading, disabled
- **Overlay opcional**: Para bloquear la interfaz durante cargas
- **Control externo**: loading={false} oculta el spinner

## 🔧 Uso básico con sistema estándar

\`\`\`jsx
import { Spinner } from './atoms/Spinner';

// Spinner con props estándar
<Spinner size="md" variant="primary" />

// Spinner con animación específica
<Spinner 
  size="lg" 
  variant="success" 
  spinnerVariant="pulse"
  rounded="xl"
/>

// Control condicional
<Spinner loading={isLoading} disabled={!isActive} />
\`\`\`

## 🎨 Integración con otros componentes

Usado automáticamente en:
- **Button**: Estados de loading
- **Input**: Estados de loading
- **Modal**: Overlays de carga
- **AdminLayout**: Estados de loading global
        `
      }
    }
  },
  argTypes: {
    // Props del sistema estándar
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del spinner'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante semántica que determina colores'
    },
    rounded: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes (aplicable en pulse mode)'
    },
    loading: {
      control: 'boolean',
      description: 'Si está activo (permite control externo)'
    },
    disabled: {
      control: 'boolean',
      description: 'Si está deshabilitado'
    },
    
    // Props específicos del spinner
    spinnerVariant: {
      control: { type: 'select' },
      options: ['circle', 'dots', 'pulse', 'bars'],
      description: 'Tipo de animación del spinner'
    },
    message: {
      control: 'text',
      description: 'Texto del mensaje'
    },
    overlay: {
      control: 'boolean',
      description: 'Si debe mostrar overlay de fondo'
    },
    
    // Props legacy (deprecados)
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'warning'],
      description: '⚠️ DEPRECADO: Usar variant en su lugar'
    }
  }
};

// ===== STORIES =====

/**
 * Configuración básica del Spinner con props por defecto del sistema estándar
 */
export const Default = {
  args: {}
};

/**
 * Todas las variantes del sistema estándar
 */
export const StandardVariants = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h4>Primary</h4>
        <Spinner variant="primary" message="Cargando..." />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Secondary</h4>
        <Spinner variant="secondary" message="Procesando..." />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Success</h4>
        <Spinner variant="success" message="Completando..." />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Warning</h4>
        <Spinner variant="warning" message="Validando..." />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Danger</h4>
        <Spinner variant="danger" message="Eliminando..." />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Neutral</h4>
        <Spinner variant="neutral" message="Esperando..." />
      </div>
    </div>
  )
};

/**
 * Todos los tamaños del sistema estándar
 */
export const StandardSizes = {
  render: () => (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
        <div key={size} style={{ textAlign: 'center' }}>
          <h4>{size.toUpperCase()}</h4>
          <Spinner size={size} variant="primary" />
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
            {size === 'xs' && '24px'}
            {size === 'sm' && '32px'}
            {size === 'md' && '48px'}
            {size === 'lg' && '64px'}
            {size === 'xl' && '80px'}
          </p>
        </div>
      ))}
    </div>
  )
};

/**
 * Diferentes tipos de animación (spinnerVariant)
 */
export const SpinnerVariants = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h4>Circle</h4>
        <Spinner spinnerVariant="circle" variant="primary" message="Cargando..." />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Dots</h4>
        <Spinner spinnerVariant="dots" variant="secondary" message="Procesando..." />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Pulse</h4>
        <Spinner spinnerVariant="pulse" variant="success" message="Pulsando..." />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4>Bars</h4>
        <Spinner spinnerVariant="bars" variant="warning" message="Cargando datos..." />
      </div>
    </div>
  )
};

/**
 * Diferentes bordes redondeados (aplicable en pulse mode)
 */
export const RoundedVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      {['sm', 'md', 'lg', 'xl', 'full'].map(rounded => (
        <div key={rounded} style={{ textAlign: 'center' }}>
          <h4>Rounded {rounded.toUpperCase()}</h4>
          <Spinner 
            spinnerVariant="pulse" 
            variant="primary" 
            rounded={rounded} 
            size="lg"
            message={`Rounded ${rounded}`}
          />
        </div>
      ))}
    </div>
  )
};

/**
 * Estados del sistema estándar
 */
export const StandardStates = {
  render: () => {
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    
    return (
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div>
          <h4>Control de Estados</h4>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setLoading(!loading)}
            >
              {loading ? 'Detener' : 'Iniciar'} Loading
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setDisabled(!disabled)}
            >
              {disabled ? 'Habilitar' : 'Deshabilitar'}
            </Button>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h4>Loading: {loading ? 'true' : 'false'}</h4>
            <Spinner 
              variant="primary" 
              loading={loading}
              message={loading ? 'Cargando...' : 'Detenido'}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4>Disabled: {disabled ? 'true' : 'false'}</h4>
            <Spinner 
              variant="secondary" 
              disabled={disabled}
              message={disabled ? 'Deshabilitado' : 'Habilitado'}
            />
          </div>
        </div>
      </div>
    );
  }
};

/**
 * Modo overlay para bloquear interfaz
 */
export const OverlayMode = {
  render: () => {
    const [showOverlay, setShowOverlay] = useState(false);
    
    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <Button 
            variant="primary"
            onClick={() => setShowOverlay(!showOverlay)}
          >
            {showOverlay ? 'Ocultar' : 'Mostrar'} Overlay
          </Button>
        </div>
        
        <div style={{ 
          position: 'relative',
          height: '300px',
          padding: '2rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <h3>Contenido de la página</h3>
          <p>Este contenido se bloquea cuando se muestra el overlay.</p>
          <Button variant="outline" disabled={showOverlay}>
            Botón de ejemplo
          </Button>
          
          {showOverlay && (
            <Spinner 
              overlay={true}
              variant="primary"
              spinnerVariant="circle"
              message="Procesando solicitud..."
              size="lg"
            />
          )}
        </div>
      </div>
    );
  }
};

/**
 * Diferentes variantes de overlay con colores
 */
export const OverlayVariants = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      {['primary', 'success', 'warning'].map(variant => (
        <div key={variant} style={{
          position: 'relative',
          height: '200px',
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <h4>Overlay {variant}</h4>
          <p>Contenido de fondo</p>
          <Spinner 
            overlay={true}
            variant={variant}
            spinnerVariant="pulse"
            message={`Procesando ${variant}...`}
            size="md"
          />
        </div>
      ))}
    </div>
  )
};

/**
 * Integración con Button (loading states)
 */
export const ButtonIntegration = {
  render: () => {
    const [loading, setLoading] = useState(false);
    
    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };
    
    return (
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Button
          variant="primary"
          loading={loading}
          onClick={handleClick}
          leftIcon="save"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
        
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem' }}>Spinner independiente:</p>
          <Spinner 
            variant="primary"
            loading={loading}
            size="sm"
            message={loading ? 'Guardando...' : 'Listo'}
          />
        </div>
      </div>
    );
  }
};

/**
 * Backward Compatibility: color prop (deprecado)
 */
export const BackwardCompatibility = {
  args: {
    color: 'success', // ⚠️ Deprecation warning esperado
    spinnerVariant: 'circle',
    message: 'Usando prop deprecada'
  },
  parameters: {
    docs: {
      description: {
        story: `
⚠️ Esta story usa la prop \`color\` que está **deprecada**.  
Verifica la consola para ver el deprecation warning.  
Se mapea automáticamente a \`variant\`.

**Migración:**
- \`color="success"\` → \`variant="success"\`
- \`color="primary"\` → \`variant="primary"\`
- \`color="danger"\` → \`variant="danger"\`
        `
      }
    }
  }
};

/**
 * Sin mensaje (solo spinner)
 */
export const WithoutMessage = {
  args: {
    variant: 'primary',
    spinnerVariant: 'dots',
    message: '', // Sin mensaje
    size: 'lg'
  }
};

/**
 * Casos de uso reales
 */
export const UseCases = {
  render: () => (
    <div style={{ display: 'grid', gap: '3rem' }}>
      <div>
        <h4>Carga de Página</h4>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner 
            variant="primary" 
            spinnerVariant="circle"
            size="lg"
            message="Cargando página..."
          />
        </div>
      </div>
      
      <div>
        <h4>Procesando Formulario</h4>
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-secondary)' }}>
          <Spinner 
            variant="success" 
            spinnerVariant="pulse"
            size="md"
            message="Guardando información..."
          />
        </div>
      </div>
      
      <div>
        <h4>Eliminando Datos</h4>
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-danger-subtle)' }}>
          <Spinner 
            variant="danger" 
            spinnerVariant="bars"
            size="md"
            message="Eliminando archivo..."
          />
        </div>
      </div>
      
      <div>
        <h4>Cargando Lista</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <Spinner 
            variant="neutral" 
            spinnerVariant="dots"
            size="sm"
            message=""
          />
          <span>Cargando usuarios...</span>
        </div>
      </div>
    </div>
  )
};

// ===== PROPTYPES (PARA STORYBOOK) =====
StandardStates.propTypes = {
  render: PropTypes.func
};

OverlayMode.propTypes = {
  render: PropTypes.func
};

ButtonIntegration.propTypes = {
  render: PropTypes.func
};

BackwardCompatibility.propTypes = {
  args: PropTypes.object
};

WithoutMessage.propTypes = {
  args: PropTypes.object
};