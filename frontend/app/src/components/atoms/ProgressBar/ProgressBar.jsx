// src/components/atoms/ProgressBar/ProgressBar.jsx - SISTEMA V2.0 COMPLETO
import PropTypes from 'prop-types';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import './ProgressBar.css';

/**
 * ProgressBar V2.0 - Indicadores de progreso universales
 * 
 * ✅ SISTEMA V2.0: useInteractiveProps + extractDOMPropsV2
 * ✅ VARIANTES: 6 semánticas (primary, secondary, success, warning, danger, neutral) 
 * ✅ TAMAÑOS: 5 estándar (xs, sm, md, lg, xl) con alturas apropiadas
 * ✅ ANIMACIONES: Smooth transition + striped animation + pulse effect
 * ✅ ESTADOS: Loading, indeterminate, disabled con overlays
 * ✅ ACCESIBILIDAD: ARIA completo + screen reader announcements
 * ✅ MOBILE: Touch-friendly con indicadores visuales claros
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} [props.value=0] - Valor actual del progreso (0-100)
 * @param {number} [props.max=100] - Valor máximo del progreso
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del indicador
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante visual
 * @param {boolean} [props.showLabel=false] - Mostrar porcentaje como texto
 * @param {boolean} [props.animate=true] - Animaciones suaves habilitadas
 * @param {boolean} [props.striped=false] - Patrón de rayas animadas
 * @param {boolean} [props.pulse=false] - Efecto de pulso en la barra
 * @param {boolean} [props.indeterminate=false] - Progreso indeterminado (loading infinito)
 * @param {boolean} [props.loading=false] - Estado de loading con overlay
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
function ProgressBar(props) {
  // ✅ V2 HOOK: Procesamiento completo de props estándar
  const {
    // Props procesadas con defaults
    size, variant, rounded, 
    
    // Tokens especializados
    tokens,
    
    // Helpers de estado  
    isDisabled, isLoading, isInteractive,
    
    // Debugging (solo desarrollo)
    _debug
  } = useInteractiveProps(props, {
    componentName: 'ProgressBar',
    defaultSize: 'md',
    defaultVariant: 'primary',
    defaultRounded: 'lg' // ProgressBar se ve mejor con esquinas más redondeadas
  });

  // Props específicas de ProgressBar (no procesadas por hook)
  const {
    value = 0,
    max = 100,
    showLabel = false,
    animate = true,
    striped = false,
    pulse = false,
    indeterminate = false,
    ariaLabel
  } = props;

  // ===== CÁLCULOS DE PROGRESO =====
  
  // Normalizar valor entre 0 y max
  const normalizedValue = Math.min(Math.max(Number(value) || 0, 0), max);
  
  // Calcular porcentaje
  const percentage = max > 0 ? Math.round((normalizedValue / max) * 100) : 0;
  
  // Para modo indeterminate, ignorar valor específico
  const displayPercentage = indeterminate ? 0 : percentage;
  
  // ===== ARIA LABELS INTELIGENTES =====
  
  // Label principal
  const progressLabel = ariaLabel || `Progreso: ${displayPercentage}%`;
  
  // Valor actual para screen readers
  const ariaValueNow = indeterminate ? undefined : normalizedValue;
  const ariaValueText = indeterminate 
    ? 'Cargando...' 
    : `${displayPercentage}% completado`;

  // ===== GENERACIÓN DE CLASES CSS =====
  
  const progressBarClasses = [
    'progress-bar',
    `progress-bar--${size}`,
    `progress-bar--${variant}`,
    rounded !== 'lg' && `progress-bar--rounded-${rounded}`,
    animate && 'progress-bar--animated',
    striped && 'progress-bar--striped',
    pulse && 'progress-bar--pulse',
    indeterminate && 'progress-bar--indeterminate',
    isLoading && 'progress-bar--loading',
    isDisabled && 'progress-bar--disabled',
    showLabel && 'progress-bar--with-label'
  ].filter(Boolean).join(' ');

  // ✅ COMBINAR CLASES: Sistema + Usuario
  const finalClassName = [progressBarClasses, props.className]
    .filter(Boolean).join(' ');

  // ✅ PROPS MODIFICADAS: reemplazar className original con combinada
  const propsWithFinalClassName = { 
    ...props, 
    className: finalClassName 
  };

  // ===== V2 DEBUGGING =====
  if (import.meta.env?.DEV && _debug) {
    console.log('ProgressBar V2 Debug:', {
      size, variant, value, percentage, indeterminate, tokens
    });
  }

  return (
    <div
      {...extractDOMPropsV2(propsWithFinalClassName)}
      role="progressbar"
      aria-label={progressLabel}
      aria-valuenow={ariaValueNow}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={ariaValueText}
      data-testid="progress-bar"
    >
      {/* Contenedor de la barra */}
      <div className="progress-bar__track">
        {/* Barra de progreso */}
        <div 
          className="progress-bar__fill"
          style={{
            width: indeterminate ? '100%' : `${displayPercentage}%`,
            // Aplicar tokens específicos si es necesario
            ...props.style
          }}
        >
          {/* Patrón de rayas (solo si striped está habilitado) */}
          {striped && (
            <div className="progress-bar__stripes" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Label de porcentaje */}
      {showLabel && !indeterminate && (
        <div className="progress-bar__label" aria-hidden="true">
          <span className="progress-bar__percentage">
            {displayPercentage}%
          </span>
        </div>
      )}

      {/* Label de modo indeterminate */}
      {showLabel && indeterminate && (
        <div className="progress-bar__label progress-bar__label--indeterminate" aria-hidden="true">
          <span className="progress-bar__loading-text">
            Cargando...
          </span>
        </div>
      )}

      {/* Overlay de loading */}
      {isLoading && (
        <div className="progress-bar__loading-overlay" aria-hidden="true">
          <div className="progress-bar__loading-spinner">
            <svg viewBox="0 0 24 24" className="progress-bar__spinner-svg">
              <circle 
                cx="12" cy="12" r="10" 
                strokeWidth="2"
                className="progress-bar__spinner-circle" 
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ V2 PROPTYPES: Sistema de props helpers
ProgressBar.propTypes = {
  // ✅ PROPS HELPERS: Sistema centralizado
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas de ProgressBar
  value: PropTypes.number,
  max: PropTypes.number,
  showLabel: PropTypes.bool,
  animate: PropTypes.bool,
  striped: PropTypes.bool,
  pulse: PropTypes.bool,
  indeterminate: PropTypes.bool,
  ariaLabel: PropTypes.string
};

// ✅ V2 DEFAULT PROPS: Mínimos (hook maneja la mayoría)
ProgressBar.defaultProps = {
  value: 0,
  max: 100,
  showLabel: false,
  animate: true,
  striped: false,
  pulse: false,
  indeterminate: false
};

// ===== METADATA PARA DESARROLLO Y AI =====

/**
 * 🎯 PROGRESS BAR META - CONTEXTO SEMÁNTICO
 */
export const ProgressBarMeta = {
  componentName: 'ProgressBar',
  componentType: 'feedback',
  category: 'atoms',
  
  // Casos de uso principales
  useCases: [
    {
      name: 'File Upload',
      description: 'Mostrar progreso de subida de archivos',
      examples: ['Subiendo archivo (47%)', 'Procesando video (23%)'],
      recommendedProps: { size: 'md', variant: 'primary', showLabel: true, animate: true }
    },
    {
      name: 'Form Progress',
      description: 'Pasos completados en formularios multi-paso',
      examples: ['Paso 2 de 4', 'Completado 75%'],
      recommendedProps: { size: 'sm', variant: 'success', showLabel: true }
    },
    {
      name: 'Loading States',
      description: 'Procesos indefinidos o muy largos',
      examples: ['Cargando datos...', 'Inicializando aplicación...'],
      recommendedProps: { indeterminate: true, variant: 'primary', pulse: true }
    },
    {
      name: 'Data Processing',
      description: 'Procesamiento batch o análisis de datos',
      examples: ['Procesando 1,000 registros', 'Generando reporte'],
      recommendedProps: { size: 'lg', variant: 'secondary', striped: true, showLabel: true }
    }
  ],
  
  // Guidelines por variante
  variantGuidelines: {
    primary: 'Progreso general, acciones principales, neutral',
    secondary: 'Procesos secundarios, menos críticos',
    success: 'Completación exitosa, confirmaciones',
    warning: 'Procesos con advertencias, precaución',
    danger: 'Procesos críticos, errores potenciales',
    neutral: 'Utilidad, sin connotación semántica'
  },
  
  // Guidelines por tamaño
  sizeGuidelines: {
    xs: 'Indicadores mínimos, barras de estado compactas',
    sm: 'Formularios, componentes pequeños, tablas',
    md: 'Uso general, modales, páginas estándar (DEFAULT)',
    lg: 'Procesos importantes, páginas principales',
    xl: 'Hero sections, procesos críticos muy visibles'
  }
};

export { ProgressBar };