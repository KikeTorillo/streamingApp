// src/components/atoms/Spinner/Spinner.jsx
// ✅ MIGRADO AL SISTEMA ESTÁNDAR DE DISEÑO V2
import PropTypes from 'prop-types';
import { useStandardPropsV2, STANDARD_PROP_TYPES, extractDOMPropsV2 } from '../../index.js';
import './Spinner.css';

/**
 * Spinner - Componente átomo para indicadores de carga
 * 
 * ✅ MIGRADO AL SISTEMA ESTÁNDAR DE DISEÑO ✅
 * 
 * Características:
 * - ✅ Props estándar del sistema (size, variant, rounded, loading, disabled)
 * - ✅ validateStandardProps con deprecation warnings integradas
 * - ✅ STANDARD_PROP_TYPES para consistencia
 * - ✅ 6 variantes semánticas estándar
 * - ✅ 5 tamaños estándar (xs, sm, md, lg, xl)
 * - ✅ 4 tipos de animación (circle, dots, pulse, bars)
 * - ✅ Modo overlay y inline
 * - ✅ Backward compatibility con mapeo automático de colores
 * - ✅ Tokens automáticos integrados
 * 
 * Tamaños del sistema: xs(24px), sm(32px), md(48px), lg(64px), xl(80px)
 */
function Spinner({
  // ===== PROPS ESPECÍFICOS DEL SPINNER =====
  spinnerVariant = 'circle', // 'circle', 'dots', 'pulse', 'bars' - Tipo de animación
  message = 'Cargando...', // Texto del mensaje
  overlay = true,        // Siempre overlay (modo inline eliminado)
  storybookPreview = false, // Modo preview para Storybook (sin overlay completo)
  
  // ===== PROPS LEGACY (BACKWARD COMPATIBILITY) =====
  color,                 // ⚠️ DEPRECADO: Usar variant en su lugar
  
  // Props adicionales
  ...restProps
}) {
  // ===== HOOK ESTÁNDAR V2 =====
  const {
    size,
    variant,
    rounded,
    loading,
    disabled,
    className,
    tokens
  } = useStandardPropsV2(restProps, {
    componentName: 'Spinner',
    componentType: 'container',
    defaultSize: 'md',
    defaultVariant: 'primary',
    defaultRounded: 'full'
  });
  
  // Mapear props legacy con deprecation warnings
  let finalVariant = variant;
  
  // Mapeo de color legacy → variant estándar
  if (color && import.meta.env?.DEV) {
    console.warn('Spinner: prop "color" está deprecada. Usar "variant" en su lugar.');
  }
  if (color) {
    const colorToVariantMap = {
      'primary': 'primary',
      'secondary': 'secondary', 
      'success': 'success',
      'danger': 'danger',
      'warning': 'warning'
    };
    finalVariant = colorToVariantMap[color] || 'primary';
  }
  
  // ✅ FILTRAR PROPS ESPECÍFICAS - No van al DOM
  const {
    spinnerVariant: _spinnerVariant,
    message: _message,
    overlay: _overlay,
    storybookPreview: _storybookPreview,
    color: _color,
    ...domSafeProps
  } = restProps;

  // ✅ EXTRAER PROPS DOM VÁLIDAS
  const safeDOMProps = extractDOMPropsV2(domSafeProps);

  // Si está disabled o loading=false, no mostrar
  if (disabled || !loading) {
    return null;
  }
  
  // Renderizado de diferentes variantes
  const renderSpinnerVariant = () => {
    const sizeClass = `spinner--size-${size}`;  // Actualizado para sistema estándar

    switch (spinnerVariant) {
      case 'dots':
        return (
          <div className={`spinner-dots ${sizeClass}`}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`spinner-dot spinner-dot--${finalVariant}`}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`spinner-pulse spinner-pulse--${finalVariant} spinner-pulse--rounded-${rounded} ${sizeClass}`} />
        );

      case 'bars':
        return (
          <div className={`spinner-bars ${sizeClass}`}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`spinner-bar spinner-bar--${finalVariant}`}
              />
            ))}
          </div>
        );

      case 'circle':
      default:
        return (
          <div className={`spinner-circle spinner-circle--${finalVariant} ${sizeClass}`} />
        );
    }
  };

  // Modo Storybook Preview (sin overlay completo)
  if (storybookPreview) {
    return (
      <div {...safeDOMProps} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
        <div>
          {renderSpinnerVariant()}
        </div>
        {message && (
          <div className={`spinner-overlay__message spinner__message--size-${size}`}>
            {message}
          </div>
        )}
      </div>
    );
  }

  // Modo normal - overlay completo
  return (
    <div {...safeDOMProps} className={`spinner-overlay`}>
      <div className={`spinner-overlay__container spinner-overlay__container--variant-${finalVariant}`}>
        <div className="spinner-overlay__spinner">
          {renderSpinnerVariant()}
        </div>
        {message && (
          <div className={`spinner-overlay__message spinner__message--size-${size}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

Spinner.propTypes = {
  // ===== PROPS ESTÁNDAR DEL SISTEMA =====
  ...STANDARD_PROP_TYPES,
  
  // ===== PROPS ESPECÍFICOS DEL SPINNER =====
  spinnerVariant: PropTypes.oneOf(['circle', 'dots', 'pulse', 'bars']),
  message: PropTypes.string,
  storybookPreview: PropTypes.bool, // Modo preview para Storybook
  
  // ===== PROPS LEGACY (DEPRECADOS) =====
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning']) // ⚠️ DEPRECADO
};

export { Spinner };