// src/components/atoms/Spinner/Spinner.stories.jsx - SISTEMA DE DISE�O 100% COMPATIBLE
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

El �tomo **Spinner** proporciona indicadores de carga elegantes completamente integrado al sistema de dise�o.

## <� Caracter�sticas principales

- **6 variantes sem�nticas**: primary, secondary, success, warning, danger, neutral
- **5 tama�os est�ndar**: xs(24px), sm(32px), md(40px), lg(56px), xl(56px)
- **4 tipos de animaci�n**: circle, dots, pulse, bars
- **Overlay opcional**: Para bloquear la interfaz durante cargas
- **Control externo**: loading={false} oculta el spinner
- **Tokens del sistema**: Usa 100% variables CSS del sistema de dise�o
- **Responsive**: Adaptaci�n autom�tica para m�viles
- **Accessibility**: WCAG 2.1 AA compatible con prefers-reduced-motion

## =' Uso b�sico con sistema est�ndar

\`\`\`jsx
import { Spinner } from './atoms/Spinner';

// Spinner b�sico
<Spinner size="md" variant="primary" />

// Spinner con mensaje
<Spinner 
  size="lg" 
  variant="success" 
  message="Cargando datos..."
/>

// Spinner con animaci�n espec�fica
<Spinner 
  size="lg" 
  variant="primary"
  spinnerVariant="pulse"
  rounded="xl"
  message="Procesando..."
/>

// Overlay para bloquear interfaz
<Spinner 
  overlay={true}
  variant="primary"
  size="lg"
  message="Creando serie..."
/>
\`\`\`

## <� Integraci�n con el sistema

Usado autom�ticamente en:
- **Button**: Estados de loading
- **Modal**: Overlays de carga
- **AdminLayout**: Estados de loading global
- **P�ginas CRUD**: Procesos de creaci�n/edici�n

## = Tipos de animaci�n

- **circle**: C�rculo con arco giratorio (por defecto)
- **dots**: Tres puntos con escala secuencial
- **pulse**: C�rculo que pulsa expandi�ndose
- **bars**: Barras verticales oscillantes

## =� Mobile-First

- Tama�os autom�ticamente optimizados para m�vil
- Overlay responsive con m�rgenes de seguridad
- Texto adaptativo seg�n breakpoints
        `
      }
    }
  },
  argTypes: {
    // ===== PROPS EST�NDAR DEL SISTEMA =====
    size: {
      name: 'Tama�o',
      description: 'Tama�o del spinner seg�n sistema est�ndar',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'md' }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante sem�ntica que determina colores seg�n sistema',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      table: {
        type: { summary: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'" },
        defaultValue: { summary: 'primary' }
      }
    },
    rounded: {
      name: 'Radio de bordes',
      description: 'Radio de bordes para pulse mode seg�n sistema',
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl' | 'full'" },
        defaultValue: { summary: 'full' }
      }
    },
    loading: {
      name: 'Activo',
      description: 'Si est� activo (permite control externo)',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Si est� deshabilitado',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    },
    
    // ===== PROPS ESPEC�FICOS DEL SPINNER =====
    spinnerVariant: {
      name: 'Tipo de animaci�n',
      description: 'Tipo de animaci�n del spinner',
      control: { type: 'select' },
      options: ['circle', 'dots', 'pulse', 'bars'],
      table: {
        type: { summary: "'circle' | 'dots' | 'pulse' | 'bars'" },
        defaultValue: { summary: 'circle' }
      }
    },
    message: {
      name: 'Mensaje',
      description: 'Texto del mensaje',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Cargando...' }
      }
    },
    overlay: {
      name: 'Overlay',
      description: 'Si debe mostrar overlay de fondo',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  }
};

// ===== STORIES =====

/**
 * Configuraci�n b�sica del Spinner con props por defecto del sistema est�ndar
 */
export const Default = {
  args: {
    variant: 'primary',
    size: 'md',
    spinnerVariant: 'circle',
    message: 'Cargando...',
    loading: true
  }
};

/**
 * Todas las variantes sem�nticas del sistema est�ndar
 */
export const AllVariants = {
  name: 'Variantes del Sistema',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '3rem', 
      padding: '2rem',
      alignItems: 'center' 
    }}>
      {['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].map(variant => (
        <div key={variant} style={{ textAlign: 'center' }}>
          <h4 style={{ 
            textTransform: 'capitalize', 
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-base)'
          }}>
            {variant}
          </h4>
          <Spinner 
            variant={variant} 
            size="md"
            spinnerVariant="circle"
            message={
              variant === 'primary' ? 'Cargando...' :
              variant === 'secondary' ? 'Procesando...' :
              variant === 'success' ? 'Completando...' :
              variant === 'warning' ? 'Validando...' :
              variant === 'danger' ? 'Eliminando...' :
              'Esperando...'
            }
          />
        </div>
      ))}
    </div>
  )
};

/**
 * Todos los tama�os del sistema est�ndar
 */
export const AllSizes = {
  name: 'Tama�os del Sistema',
  render: () => (
    <div style={{ 
      display: 'flex', 
      gap: '4rem', 
      alignItems: 'flex-end',
      padding: '2rem',
      justifyContent: 'center'
    }}>
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
        <div key={size} style={{ textAlign: 'center' }}>
          <h4 style={{ 
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-sm)'
          }}>
            {size.toUpperCase()}
          </h4>
          <Spinner 
            size={size} 
            variant="primary" 
            spinnerVariant="circle"
            message={`Tama�o ${size}`}
          />
          <p style={{ 
            fontSize: 'var(--font-size-xs)', 
            marginTop: '0.8rem', 
            color: 'var(--text-secondary)',
            fontWeight: 'var(--font-weight-normal)'
          }}>
            {size === 'xs' && '24px'}
            {size === 'sm' && '32px'}
            {size === 'md' && '40px'}
            {size === 'lg' && '56px'}
            {size === 'xl' && '56px'}
          </p>
        </div>
      ))}
    </div>
  )
};

/**
 * Diferentes tipos de animaci�n (spinnerVariant)
 */
export const SpinnerTypes = {
  name: 'Tipos de Animaci�n',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '3rem',
      padding: '2rem'
    }}>
      {[
        { type: 'circle', variant: 'primary', description: 'C�rculo con arco giratorio' },
        { type: 'dots', variant: 'secondary', description: 'Tres puntos con escala secuencial' },
        { type: 'pulse', variant: 'success', description: 'C�rculo pulsante que se expande' },
        { type: 'bars', variant: 'warning', description: 'Barras verticales oscillantes' }
      ].map(({ type, variant, description }) => (
        <div key={type} style={{ textAlign: 'center' }}>
          <h4 style={{ 
            textTransform: 'capitalize', 
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-base)'
          }}>
            {type}
          </h4>
          <p style={{ 
            fontSize: 'var(--font-size-xs)', 
            marginBottom: '1.5rem', 
            color: 'var(--text-secondary)',
            minHeight: '2.4rem'
          }}>
            {description}
          </p>
          <Spinner 
            spinnerVariant={type} 
            variant={variant} 
            size="lg"
            message={`Animaci�n ${type}`}
          />
        </div>
      ))}
    </div>
  )
};

/**
 * Diferentes bordes redondeados (aplicable en pulse mode)
 */
export const RoundedVariants = {
  name: 'Bordes Redondeados (Pulse)',
  render: () => (
    <div style={{ 
      display: 'flex', 
      gap: '3rem', 
      alignItems: 'center',
      padding: '2rem',
      justifyContent: 'center'
    }}>
      {['sm', 'md', 'lg', 'xl', 'full'].map(rounded => (
        <div key={rounded} style={{ textAlign: 'center' }}>
          <h4 style={{ 
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-sm)'
          }}>
            Rounded {rounded.toUpperCase()}
          </h4>
          <Spinner 
            spinnerVariant="pulse" 
            variant="primary" 
            rounded={rounded} 
            size="lg"
            message={`Border ${rounded}`}
          />
        </div>
      ))}
    </div>
  )
};

/**
 * Estados del sistema est�ndar
 */
export const SystemStates = {
  name: 'Estados del Sistema',
  render: () => {
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h4 style={{ 
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-lg)'
          }}>
            Control de Estados
          </h4>
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            marginBottom: '3rem',
            flexWrap: 'wrap'
          }}>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setLoading(!loading)}
              leftIcon={loading ? "pause" : "play"}
            >
              {loading ? 'Detener' : 'Iniciar'} Loading
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setDisabled(!disabled)}
              leftIcon={disabled ? "eye" : "eye-off"}
            >
              {disabled ? 'Habilitar' : 'Deshabilitar'}
            </Button>
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '3rem'
        }}>
          <div style={{ 
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            <h4 style={{ 
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Loading: {loading ? 'true' : 'false'}
            </h4>
            <Spinner 
              variant="primary" 
              loading={loading}
              size="md"
              message={loading ? 'Cargando datos...' : 'Detenido'}
            />
          </div>
          
          <div style={{ 
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            <h4 style={{ 
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Disabled: {disabled ? 'true' : 'false'}
            </h4>
            <Spinner 
              variant="secondary" 
              disabled={disabled}
              size="md"
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
  name: 'Modo Overlay',
  render: () => {
    const [showOverlay, setShowOverlay] = useState(false);
    
    return (
      <div style={{ position: 'relative', minHeight: '400px' }}>
        <div style={{ 
          padding: '2rem',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <h4 style={{ 
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-lg)'
          }}>
            Overlay Demo
          </h4>
          
          <div style={{ marginBottom: '2rem' }}>
            <Button 
              variant="primary"
              onClick={() => setShowOverlay(!showOverlay)}
              leftIcon={showOverlay ? "eye-off" : "eye"}
            >
              {showOverlay ? 'Ocultar' : 'Mostrar'} Overlay
            </Button>
          </div>
          
          <div style={{ 
            minHeight: '200px',
            padding: '2rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Contenido de la p�gina</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Este contenido se bloquea cuando se muestra el overlay del spinner.
            </p>
            <Button 
              variant="outline" 
              disabled={showOverlay}
              leftIcon="settings"
            >
              Bot�n de ejemplo
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
      </div>
    );
  }
};

/**
 * Diferentes variantes de overlay con colores
 */
export const OverlayVariants = {
  name: 'Variantes de Overlay',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '2rem',
      padding: '2rem'
    }}>
      {[
        { variant: 'primary', message: 'Creando contenido...' },
        { variant: 'success', message: 'Guardando cambios...' },
        { variant: 'warning', message: 'Validando datos...' }
      ].map(({ variant, message }) => (
        <div key={variant} style={{
          position: 'relative',
          height: '200px',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}>
          <h4 style={{ 
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            textTransform: 'capitalize'
          }}>
            Overlay {variant}
          </h4>
          <p style={{ color: 'var(--text-secondary)' }}>Contenido de fondo</p>
          
          <Spinner 
            overlay={true}
            variant={variant}
            spinnerVariant="circle"
            message={message}
            size="md"
          />
        </div>
      ))}
    </div>
  )
};

/**
 * Casos de uso reales del sistema
 */
export const UseCases = {
  name: 'Casos de Uso Reales',
  render: () => (
    <div style={{ 
      display: 'grid', 
      gap: '3rem',
      padding: '2rem'
    }}>
      {[
        {
          title: 'Carga de P�gina',
          description: 'Spinner principal para carga inicial',
          variant: 'primary',
          spinnerVariant: 'circle',
          size: 'lg',
          message: 'Cargando p�gina...',
          bg: 'var(--bg-primary)'
        },
        {
          title: 'Procesando Formulario',
          description: 'Estado de env�o de formularios',
          variant: 'success',
          spinnerVariant: 'pulse',
          size: 'md',
          message: 'Guardando informaci�n...',
          bg: 'var(--bg-secondary)'
        },
        {
          title: 'Eliminando Datos',
          description: 'Confirmaci�n de eliminaci�n',
          variant: 'danger',
          spinnerVariant: 'bars',
          size: 'md',
          message: 'Eliminando archivo...',
          bg: 'var(--color-danger-light)'
        },
        {
          title: 'Cargando Lista',
          description: 'Inline spinner para listas',
          variant: 'neutral',
          spinnerVariant: 'dots',
          size: 'sm',
          message: '',
          bg: 'var(--bg-muted)',
          inline: true
        }
      ].map(({ title, description, variant, spinnerVariant, size, message, bg, inline }) => (
        <div key={title}>
          <h4 style={{ 
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-base)'
          }}>
            {title}
          </h4>
          <p style={{ 
            marginBottom: '1.5rem',
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-sm)'
          }}>
            {description}
          </p>
          
          <div style={{ 
            padding: inline ? '1rem' : '2rem',
            backgroundColor: bg,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            textAlign: inline ? 'left' : 'center',
            display: inline ? 'flex' : 'block',
            alignItems: inline ? 'center' : 'normal',
            gap: inline ? '1rem' : 'normal'
          }}>
            <Spinner 
              variant={variant} 
              spinnerVariant={spinnerVariant}
              size={size}
              message={message}
            />
            {inline && <span style={{ color: 'var(--text-primary)' }}>Cargando usuarios...</span>}
          </div>
        </div>
      ))}
    </div>
  )
};

/**
 * Integraci�n con Button (loading states)
 */
export const ButtonIntegration = {
  name: 'Integraci�n con Button',
  render: () => {
    const [loading, setLoading] = useState(false);
    
    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 3000);
    };
    
    return (
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        padding: '2rem',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ 
            marginBottom: '1.5rem',
            color: 'var(--text-primary)'
          }}>
            Button con Loading
          </h4>
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onClick={handleClick}
            leftIcon="save"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ 
            marginBottom: '1.5rem',
            color: 'var(--text-primary)'
          }}>
            Spinner Independiente
          </h4>
          <Spinner 
            variant="primary"
            loading={loading}
            size="md"
            spinnerVariant="circle"
            message={loading ? 'Guardando cambios...' : 'Listo para guardar'}
          />
        </div>
      </div>
    );
  }
};

/**
 * Sin mensaje (solo spinner)
 */
export const WithoutMessage = {
  name: 'Solo Spinner (Sin Mensaje)',
  args: {
    variant: 'primary',
    spinnerVariant: 'dots',
    message: '',
    size: 'lg'
  }
};

// ===== PROPTYPES PARA STORYBOOK =====
AllVariants.propTypes = {
  render: PropTypes.func
};

AllSizes.propTypes = {
  render: PropTypes.func
};

SpinnerTypes.propTypes = {
  render: PropTypes.func
};

RoundedVariants.propTypes = {
  render: PropTypes.func
};

SystemStates.propTypes = {
  render: PropTypes.func
};

OverlayMode.propTypes = {
  render: PropTypes.func
};

OverlayVariants.propTypes = {
  render: PropTypes.func
};

UseCases.propTypes = {
  render: PropTypes.func
};

ButtonIntegration.propTypes = {
  render: PropTypes.func
};

WithoutMessage.propTypes = {
  args: PropTypes.object
};