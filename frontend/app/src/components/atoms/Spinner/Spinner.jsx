// src/components/atoms/Spinner/Spinner.jsx
// ✅ MIGRADO AL SISTEMA ESTÁNDAR DE DISEÑO
import PropTypes from 'prop-types';
import { validateStandardProps, STANDARD_PROP_TYPES } from '../../../tokens/standardProps';
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
  // ===== PROPS ESTÁNDAR DEL SISTEMA =====
  size = 'md',           // 'xs', 'sm', 'md', 'lg', 'xl' - Tamaño del spinner
  variant = 'primary',   // 'primary', 'secondary', 'success', 'warning', 'danger', 'neutral' - Esquema de colores
  rounded = 'full',      // 'sm', 'md', 'lg', 'xl', 'full' - Radio de bordes (aplicable en pulse mode)
  loading = true,        // Boolean - Si está activo (permite control externo)
  disabled = false,      // Boolean - Si está deshabilitado
  className = '',        // String - Clases CSS adicionales
  
  // ===== PROPS ESPECÍFICOS DEL SPINNER =====
  spinnerVariant = 'circle', // 'circle', 'dots', 'pulse', 'bars' - Tipo de animación
  message = 'Cargando...', // Texto del mensaje
  overlay = false,       // Si debe mostrar overlay de fondo
  
  // ===== PROPS LEGACY (BACKWARD COMPATIBILITY) =====
  color,                 // ⚠️ DEPRECADO: Usar variant en su lugar
  
  // Props adicionales
  ...restProps
}) {
  // ===== VALIDAR PROPS ESTÁNDAR =====
  validateStandardProps({
    size, variant, rounded, loading, disabled, className,
    spinnerVariant, message, overlay, color,
    ...restProps
  }, 'Spinner');
  
  // ===== MAPEAR PROPS LEGACY CON DEPRECATION WARNINGS =====
  let finalVariant = variant;
  
  // Mapeo de color legacy → variant estándar
  if (color) {
    console.warn('Spinner: prop "color" está deprecada. Usar "variant" en su lugar.');
    const colorToVariantMap = {
      'primary': 'primary',
      'secondary': 'secondary', 
      'success': 'success',
      'danger': 'danger',
      'warning': 'warning'
    };
    finalVariant = colorToVariantMap[color] || 'primary';
  }
  
  // Si está disabled o loading=false, no mostrar
  if (disabled || !loading) {
    return null;
  }
  // ===== CLASES CSS CON SISTEMA ESTÁNDAR =====
  const spinnerClasses = [
    'spinner',
    `spinner--size-${size}`,
    `spinner--variant-${finalVariant}`,
    `spinner--rounded-${rounded}`,
    loading ? 'spinner--loading' : '',
    disabled ? 'spinner--disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
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

  // Si es overlay, usar estructura específica
  if (overlay) {
    return (
      <div {...restProps} className={`spinner-overlay`}>
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

  // Modo inline normal
  return (
    <div {...restProps} className={`spinner-inline ${spinnerClasses}`}>
      {renderSpinnerVariant()}
      {message && (
        <div className={`spinner-inline__message spinner__message--size-${size}`}>
          {message}
        </div>
      )}
    </div>
  );
}

Spinner.propTypes = {
  // ===== PROPS ESTÁNDAR DEL SISTEMA =====
  ...STANDARD_PROP_TYPES,
  
  // ===== PROPS ESPECÍFICOS DEL SPINNER =====
  spinnerVariant: PropTypes.oneOf(['circle', 'dots', 'pulse', 'bars']),
  message: PropTypes.string,
  overlay: PropTypes.bool,
  
  // ===== PROPS LEGACY (DEPRECADOS) =====
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning']) // ⚠️ DEPRECADO
};

export { Spinner };