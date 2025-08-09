// src/components/atoms/Button/Button.jsx
import PropTypes from 'prop-types';
import { createStandardIconRenderer } from '../../../utils/iconHelpers';
import './Button.css';

/**
 * Button - ÁTOMO CORREGIDO PARA CUMPLIR REGLAS DEL PROYECTO
 * 
 * ✅ EXPORT CONVENTION: Patrón function + export { Name }
 * ✅ PROPS ESTÁNDAR: 5 tamaños + 4 variantes + props obligatorias
 * ✅ SISTEMA DE DISEÑO: Variables CSS + iconos centralizados con createIconRenderer
 * ✅ ACCESIBILIDAD: ARIA completo, focus management
 * ✅ ATOMIC DESIGN: Átomo independiente y reutilizable
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} [props.children] - Contenido del botón
 * @param {string} [props.text] - Alternativa a children para texto simple
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del botón
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'|'warning'} [props.variant='primary'] - Variante visual
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.loading=false] - Estado de carga con spinner
 * @param {boolean} [props.fullWidth=false] - Ocupa todo el ancho
 * @param {string|React.ReactNode} [props.icon] - Icono del botón (string: nombre del icono del sistema de diseño | node: componente React custom)
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo (string: nombre del icono | node: componente custom)
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho (string: nombre del icono | node: componente custom)
 * @param {'left'|'right'} [props.iconPosition='left'] - Posición del icono (usado con prop icon)
 * @param {boolean} [props.iconOnly=false] - Solo muestra el icono
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Tipo HTML
 * @param {function} [props.onClick] - Handler de click
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
function Button({
  children,
  text,
  size = 'md',
  variant = 'primary',
  rounded = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  leftIcon, // ← PROP NUEVA para compatibilidad
  rightIcon, // ← PROP NUEVA para compatibilidad
  iconPosition = 'left',
  iconOnly = false,
  type = 'button',
  onClick,
  ariaLabel,
  className = '',
  ...restProps
}) {
  // ✅ EXTRAER PROPS PERSONALIZADAS para evitar pasarlas al DOM
  const { leftIcon: leftIconFromRest, rightIcon: rightIconFromRest, ...domProps } = restProps;
  // Variables no usadas pero necesarias para filtrar del DOM
  void leftIconFromRest; void rightIconFromRest;
  // Determinar el contenido del botón
  const buttonContent = children || text;

  // ✅ LÓGICA DE COMPATIBILIDAD - Determinar icono y posición
  let finalIcon = icon;
  let finalIconPosition = iconPosition;
  
  // Si se proporciona leftIcon, usar como icono izquierdo
  if (leftIcon) {
    finalIcon = leftIcon;
    finalIconPosition = 'left';
  }
  
  // Si se proporciona rightIcon, usar como icono derecho
  if (rightIcon) {
    finalIcon = rightIcon;
    finalIconPosition = 'right';
  }

  // Generar clases CSS
  const buttonClasses = [
    'btn',
    `btn--${size}`,
    `btn--${variant}`,
    `btn--rounded-${rounded}`,
    fullWidth && 'btn--full-width',
    iconOnly && 'btn--icon-only',
    loading && 'btn--loading',
    disabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ');

  // Props de accesibilidad
  const finalAriaLabel = ariaLabel || (iconOnly && typeof buttonContent === 'string' ? buttonContent : undefined);

  // Función para renderizar iconos usando el sistema centralizado
  const renderIcon = createStandardIconRenderer('button', size);

  // Handler de click
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button 
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-label={finalAriaLabel}
      {...domProps}
    >
      {/* Icono izquierdo */}
      {finalIcon && finalIconPosition === 'left' && !iconOnly && (
        <span className="btn__icon btn__icon--left">
          {renderIcon(finalIcon)}
        </span>
      )}
      
      {/* Contenido principal */}
      {!iconOnly && (
        <span className="btn__content">
          {buttonContent}
        </span>
      )}
      
      {/* Solo icono (para botones icon-only) */}
      {iconOnly && finalIcon && (
        <span className="btn__icon">
          {renderIcon(finalIcon)}
        </span>
      )}
      
      {/* Icono derecho */}
      {finalIcon && finalIconPosition === 'right' && !iconOnly && (
        <span className="btn__icon btn__icon--right">
          {renderIcon(finalIcon)}
        </span>
      )}
      
      {/* Spinner de loading */}
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg className="btn__spinner-svg" viewBox="0 0 24 24">
            <circle 
              className="btn__spinner-circle" 
              cx="12" 
              cy="12" 
              r="10" 
              strokeWidth="2"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning']),
  rounded: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  leftIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // ✅ NUEVA PROP
  rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // ✅ NUEVA PROP
  iconPosition: PropTypes.oneOf(['left', 'right']),
  iconOnly: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
  className: PropTypes.string
};

export { Button };