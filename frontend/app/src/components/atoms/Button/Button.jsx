// src/components/atoms/Button/Button.jsx
import PropTypes from 'prop-types';
import { createStandardIconRenderer } from '../../../utils/iconHelpers';
import { validateStandardProps, STANDARD_PROP_TYPES } from '../../../tokens';
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
function Button(props) {
  // ✅ VALIDAR PROPS ESTÁNDAR - Muestra deprecation warnings automáticamente
  const validatedProps = validateStandardProps(props, 'Button');
  
  const {
    children,
    text,
    size = 'md',
    variant = 'primary',
    rounded = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    iconOnly = false,
    type = 'button',
    onClick,
    ariaLabel,
    className = '',
    // Props legacy (para backward compatibility temporal)
    icon,
    iconPosition = 'left',
    ...domProps
  } = validatedProps;

  // ❌ DEPRECATION WARNINGS para props legacy
  if (icon || iconPosition !== 'left') {
    console.warn(
      `Button: Las props "icon" e "iconPosition" están deprecadas y serán eliminadas en la próxima versión mayor. 
      En su lugar usar:
      - Para iconos izquierda: leftIcon="${icon || 'nombre-icono'}"
      - Para iconos derecha: rightIcon="${icon || 'nombre-icono'}"
      
      Ejemplo de migración:
      ❌ <Button icon="user" iconPosition="left" />
      ✅ <Button leftIcon="user" />
      
      ❌ <Button icon="arrow" iconPosition="right" />  
      ✅ <Button rightIcon="arrow" />`
    );
  }
  // Determinar el contenido del botón
  const buttonContent = children || text;

  // ✅ LÓGICA DE COMPATIBILIDAD - Nueva API tiene prioridad sobre legacy
  let finalLeftIcon = leftIcon;
  let finalRightIcon = rightIcon;
  
  // ⚠️ BACKWARD COMPATIBILITY: Mapear props legacy a nueva API
  if (icon && !leftIcon && !rightIcon) {
    if (iconPosition === 'right') {
      finalRightIcon = icon;
    } else {
      finalLeftIcon = icon; // left es default
    }
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
      {finalLeftIcon && !iconOnly && (
        <span className="btn__icon btn__icon--left">
          {renderIcon(finalLeftIcon)}
        </span>
      )}
      
      {/* Contenido principal */}
      {!iconOnly && (
        <span className="btn__content">
          {buttonContent}
        </span>
      )}
      
      {/* Solo icono (para botones icon-only) */}
      {iconOnly && (finalLeftIcon || finalRightIcon) && (
        <span className="btn__icon">
          {renderIcon(finalLeftIcon || finalRightIcon)}
        </span>
      )}
      
      {/* Icono derecho */}
      {finalRightIcon && !iconOnly && (
        <span className="btn__icon btn__icon--right">
          {renderIcon(finalRightIcon)}
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
  // ✅ PROPS ESTÁNDAR DEL SISTEMA
  ...STANDARD_PROP_TYPES,
  
  // ✅ PROPS ESPECÍFICAS DE BUTTON
  children: PropTypes.node,
  text: PropTypes.string,
  fullWidth: PropTypes.bool,
  iconOnly: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
  
  // ❌ PROPS LEGACY (temporales para backward compatibility)
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconPosition: PropTypes.oneOf(['left', 'right'])
};

export { Button };