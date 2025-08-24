// molecules/TextSelect/TextSelect.jsx
import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './TextSelect.css';
import { Select } from '../../atoms/Select/Select';
import { Label } from '../../atoms/Label/Label';
import { validateStandardProps, STANDARD_PROP_TYPES } from '../../../tokens/standardProps';
import { createStandardIconRenderer } from '../../../utils/iconHelpers';

/**
 * TextSelect - Molécula que extiende el átomo Select con etiquetas y mensajes
 * 
 * ✅ **MIGRADO AL SISTEMA ESTÁNDAR**
 * 
 * Características:
 * - ✅ Hook useStandardProps() integrado
 * - ✅ Props estándar (size, variant, rounded, loading, disabled)
 * - ✅ Sistema de iconos unificado (leftIcon/rightIcon)
 * - ✅ Integración con Label y Select migrados
 * - ✅ Estados loading, error, success con iconos automáticos
 * - ✅ Tokens de design system automáticos
 * - ✅ Backward compatibility con deprecation warnings
 * - ✅ Accesibilidad completa ARIA + navegación teclado
 * 
 * @param {Array} [options=[]] - Array de opciones {value, label, disabled?}
 * @param {string} [placeholder='Selecciona una opción'] - Texto placeholder
 * @param {string} [value] - Valor controlado del select
 * @param {string} [defaultValue] - Valor por defecto (no controlado)
 * @param {function} [onChange] - Handler para cambios de valor
 * @param {function} [onBlur] - Handler para pérdida de foco
 * @param {function} [onFocus] - Handler para obtención de foco
 * @param {string} [name] - Nombre del campo (necesario para formularios)
 * @param {string} [id] - ID único del select
 * @param {boolean} [required=false] - Si el campo es obligatorio
 * @param {boolean} [autoFocus=false] - Si obtiene foco automáticamente
 * @param {boolean} [fullWidth=false] - Si ocupa todo el ancho disponible
 * @param {boolean} [compact=false] - Versión compacta con spacing reducido
 * @param {string} [label] - Etiqueta del campo
 * @param {string} [helperText] - Texto de ayuda debajo del select
 * @param {string} [errorText] - Mensaje de error (sobrescribe helperText y variant)
 * @param {function} [onLeftIconClick] - Handler para click en icono izquierdo
 * @param {function} [onRightIconClick] - Handler para click en icono derecho
 * @param {boolean} [searchable=false] - Si permite búsqueda (funcionalidad futura)
 * @param {string} [ariaDescribedBy] - ID del elemento que describe el select
 * @param {React.Ref} ref - Referencia al elemento select
 * 
 * **Props estándar del sistema:**
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño estándar
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [variant='primary'] - Variante semántica estándar
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [rounded='md'] - Radio de bordes estándar
 * @param {boolean} [disabled=false] - Estado deshabilitado estándar
 * @param {boolean} [loading=false] - Estado de carga estándar
 * @param {string|React.ReactNode} [leftIcon] - Icono izquierdo estándar
 * @param {string|React.ReactNode} [rightIcon] - Icono derecho estándar
 * @param {string} [className=''] - Clases CSS adicionales
 * @param {string} [ariaLabel] - Label para accesibilidad
 * @param {string} [testId] - ID para testing (data-testid)
 */
const TextSelect = forwardRef(({
    // Props específicas del componente
    options = [],
    placeholder = 'Selecciona una opción',
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    name,
    id,
    required = false,
    autoFocus = false,
    fullWidth = false,
    compact = false,
    label,
    helperText,
    errorText,
    onLeftIconClick,
    onRightIconClick,
    // searchable = false,
    ariaDescribedBy,
    
    // Backward compatibility - mapeo automático
    variant: legacyVariant,
    
    ...restProps
}, ref) => {
    // Backward compatibility: mapear variantes legacy
    const propsWithCompatibility = { ...restProps };
    
    // Mapear variantes legacy al sistema estándar
    if (legacyVariant === 'default') {
        console.warn('⚠️ TextSelect: variant="default" está deprecado. Usa variant="primary" o "neutral" en su lugar.');
        propsWithCompatibility.variant = 'neutral';
    } else if (legacyVariant === 'error') {
        console.warn('⚠️ TextSelect: variant="error" está deprecado. Usa variant="danger" en su lugar.');
        propsWithCompatibility.variant = 'danger';
    } else if (legacyVariant) {
        propsWithCompatibility.variant = legacyVariant;
    }
    
    // ✅ VALIDAR PROPS ESTÁNDAR - Muestra deprecation warnings automáticamente  
    const validatedProps = validateStandardProps(propsWithCompatibility, 'TextSelect');

    const {
        // Props estándar del sistema
        size = 'md',
        variant = 'neutral',
        rounded = 'md',
        disabled = false,
        loading = false,
        className = '',
        leftIcon,
        rightIcon,
        ariaLabel,
        testId,
        ...restValidatedProps
    } = validatedProps;
    
    // Función para renderizar iconos usando el sistema centralizado
    const renderIcon = createStandardIconRenderer('textselect', size);

    // Determinar si necesitamos iconos
    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon);
    
    // Marcar variables como utilizadas para evitar warnings
    // (rightIcon ahora se usa)
    
    // Estado interno para manejar focus (igual que TextInput)
    const [isFocused, setIsFocused] = useState(false);
    
    // Determinar variante basada en error (error tiene prioridad)
    const currentVariant = errorText ? 'danger' : variant;
    
    // Construir clases CSS dinámicamente con sistema estándar
    const wrapperClasses = [
        'text-select-wrapper',
        `text-select-wrapper--${size}`,
        currentVariant !== 'primary' && `text-select-wrapper--${currentVariant}`,
        rounded !== 'md' && `text-select-wrapper--rounded-${rounded}`,
        isFocused && 'text-select-wrapper--focused',
        fullWidth && 'text-select-wrapper--full-width',
        disabled && 'text-select-wrapper--disabled',
        loading && 'text-select-wrapper--loading',
        compact && 'text-select-wrapper--compact',
        hasLeftIcon && 'text-select-wrapper--has-left-icon',
        hasRightIcon && 'text-select-wrapper--has-right-icon',
        className
    ].filter(Boolean).join(' ');

    // Clases adicionales para el Select del átomo
    const selectAdditionalClasses = [
        `text-select--variant-${currentVariant}`,
        hasLeftIcon && 'text-select--with-left-icon',
        hasRightIcon && 'text-select--with-right-icon'
    ].filter(Boolean).join(' ');

    // Handlers de eventos (igual que TextInput)
    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    // Generar IDs únicos para accesibilidad
    const selectId = id || `text-select-${Math.random().toString(36).substring(2, 9)}`;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    // Determinar iconos automáticos según estado
    const statusIcon = errorText 
        ? 'alert-circle' // Icono de error automático
        : currentVariant === 'success' 
        ? 'check-circle' // Icono de éxito automático
        : currentVariant === 'warning'
        ? 'alert-triangle' // Icono de advertencia automático
        : null;
    
    // Icono izquierdo final (props o automático por estado)
    const finalLeftIcon = leftIcon || statusIcon;
    
    // Texto a mostrar en footer
    const footerText = errorText || helperText;
    const isError = !!errorText;

    // ARIA describedby dinámico
    const describedBy = [
        ariaDescribedBy,
        footerText && (isError ? errorId : helperId)
    ].filter(Boolean).join(' ');
    
    // Props DOM directos (consistente con Select)
    const domProps = restValidatedProps;

    return (
        <div 
            className={wrapperClasses}
            {...domProps}
        >
            {/* Label usando componente migrado del sistema estándar */}
            {label && (
                <Label
                    htmlFor={selectId}
                    size={size}
                    variant={currentVariant}
                    disabled={disabled}
                    loading={loading}
                    required={required}
                    className="text-select__label"
                >
                    {label}
                </Label>
            )}

            {/* Container con iconos del sistema estándar */}
            <div className={`text-select__container ${loading ? 'text-select__container--loading' : ''}`}>
                {/* Icono izquierdo usando sistema estándar */}
                {hasLeftIcon && (
                    <div 
                        className={`text-select__icon text-select__icon--left ${
                            onLeftIconClick ? 'text-select__icon--clickable' : ''
                        }`}
                        onClick={disabled || loading ? undefined : onLeftIconClick}
                        role={onLeftIconClick ? 'button' : undefined}
                        tabIndex={onLeftIconClick && !disabled && !loading ? 0 : undefined}
                        aria-hidden={!onLeftIconClick}
                    >
                        {renderIcon(finalLeftIcon)}
                    </div>
                )}

                {/* Icono derecho usando sistema estándar */}
                {hasRightIcon && (
                    <div 
                        className={`text-select__icon text-select__icon--right ${
                            onRightIconClick ? 'text-select__icon--clickable' : ''
                        }`}
                        onClick={disabled || loading ? undefined : onRightIconClick}
                        role={onRightIconClick ? 'button' : undefined}
                        tabIndex={onRightIconClick && !disabled && !loading ? 0 : undefined}
                        aria-hidden={!onRightIconClick}
                    >
                        {renderIcon(rightIcon)}
                    </div>
                )}

                {/* Select base migrado con props estándar */}
                <Select
                    ref={ref}
                    id={selectId}
                    name={name}
                    options={options}
                    placeholder={placeholder}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    size={size}
                    variant={currentVariant}
                    rounded={rounded}
                    style={{
                        borderRadius: 'var(--text-select-border-radius, var(--radius-md))'
                    }}
                    disabled={disabled}
                    loading={loading}
                    required={required}
                    autoFocus={autoFocus}
                    compact={compact}
                    className={selectAdditionalClasses}
                    ariaLabel={ariaLabel}
                    ariaDescribedBy={describedBy || undefined}
                    testId={testId}
                    onLeftIconClick={onLeftIconClick}
                    onRightIconClick={onRightIconClick}
                />
            </div>

            {/* Footer con mensajes usando sistema estándar */}
            {footerText && (
                <div className="text-select__footer">
                    <div 
                        id={isError ? errorId : helperId}
                        className={`text-select__message text-select__message--${isError ? 'error' : 'helper'} text-select__message--size-${size}`}
                        aria-live={isError ? 'polite' : undefined}
                        aria-atomic={isError ? 'true' : undefined}
                    >
                        {footerText}
                    </div>
                </div>
            )}
            
            {/* Overlay de loading usando sistema estándar */}
            {loading && (
                <div className="text-select__loading-overlay">
                    {renderIcon('loading')}
                </div>
            )}
        </div>
    );
});

TextSelect.displayName = 'TextSelect';

TextSelect.propTypes = {
    /** Array de opciones para el select */
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool
    })),
    
    /** Texto placeholder */
    placeholder: PropTypes.string,
    
    /** Valor controlado */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    
    /** Valor por defecto (no controlado) */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    
    /** Handlers de eventos */
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    
    /** Props del campo */
    name: PropTypes.string,
    id: PropTypes.string,
    required: PropTypes.bool,
    autoFocus: PropTypes.bool,
    fullWidth: PropTypes.bool,
    compact: PropTypes.bool,
    
    /** Etiqueta y mensajes */
    label: PropTypes.string,
    helperText: PropTypes.string,
    errorText: PropTypes.string,
    
    /** Handlers para iconos clickeables */
    onLeftIconClick: PropTypes.func,
    onRightIconClick: PropTypes.func,
    
    /** Funcionalidades futuras */
    searchable: PropTypes.bool,
    
    /** Accesibilidad */
    ariaDescribedBy: PropTypes.string,
    
    /** Props legacy con backward compatibility */
    variant: PropTypes.oneOf(['default', 'success', 'warning', 'error', 'primary', 'secondary', 'danger', 'neutral']),
    
    // Props estándar del sistema de diseño
    ...STANDARD_PROP_TYPES
};

export { TextSelect };