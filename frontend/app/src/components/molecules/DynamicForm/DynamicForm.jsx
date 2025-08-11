// molecules/DynamicForm/DynamicForm.jsx
import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '../TextInput/TextInput';
import { TextSelect } from '../TextSelect/TextSelect';
import { Button } from '../../atoms/Button/Button';
import { FileInputField } from '../FileInputField/FileInputField';
import { ImageCropField } from '../ImageCropField/ImageCropField';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { validateStandardProps, STANDARD_PROP_TYPES } from '../../../tokens/standardProps';
import './DynamicForm.css';

/**
 * DynamicForm - Sistema de formularios dinámicos con integración completa al sistema de diseño
 * 
 * ✅ MIGRADO AL SISTEMA ESTÁNDAR:
 * - Props estándar (size, variant, rounded, disabled, loading)
 * - Validación automática con validateStandardProps
 * - Tokens automáticos de spacing y sizing
 * - Integración con TextInput y TextSelect migrados
 * - Herencia de props a todos los campos hijos
 * - Backward compatibility con deprecation warnings
 * 
 * **Props estándar del sistema:**
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño aplicado a todos los campos
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'neutral'} [variant='primary'] - Variante aplicada a campos
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [rounded='md'] - Border radius aplicado a campos
 * @param {boolean} [disabled=false] - Deshabilita todo el formulario
 * @param {boolean} [loading=false] - Estado de carga del formulario
 * @param {string} [className=''] - Clases CSS adicionales
 * 
 * **Props específicas del formulario:**
 * @param {Array} fields - Array de configuración de campos
 * @param {function} onSubmit - Función llamada al enviar el formulario
 * @param {function} [onChange] - Función llamada cuando cambian los datos
 * @param {Object} [initialData={}] - Datos iniciales del formulario
 * @param {number} [columnsPerRow=1] - Número de columnas en desktop
 * @param {number} [tabletColumns=2] - Columnas en tablet
 * @param {number} [mobileColumns=1] - Columnas en móvil
 * @param {boolean} [responsive=true] - Si adapta columnas según pantalla
 * @param {boolean} [validateOnChange=false] - Validar al cambiar
 * @param {boolean} [validateOnBlur=true] - Validar al perder foco
 * @param {boolean} [compact=false] - Versión compacta
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [spacing='lg'] - Espaciado entre campos
 * 
 * **Props del botón de submit:**
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'neutral'} [submitVariant='primary'] - Variante del botón
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [submitSize='md'] - Tamaño del botón
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [submitRounded='md'] - Border radius del botón
 * @param {string} [submitText='Enviar'] - Texto del botón
 * @param {string|React.ReactNode} [submitLeftIcon] - Icono izquierdo del botón
 * @param {string|React.ReactNode} [submitRightIcon] - Icono derecho del botón
 * @param {boolean} [submitFullWidth=false] - Botón ancho completo
 * @param {Array} [actions] - Array de botones de acción personalizados
 */
const DynamicForm = ({
  // Props estándar del sistema
  size = 'md',
  variant = 'primary', 
  rounded = 'md',
  disabled = false,
  loading = false,
  className = '',
  
  // Props específicas del formulario
  fields = [],
  onSubmit,
  onChange = () => { },
  initialData = {},
  columnsPerRow = 1,
  tabletColumns = 2,
  mobileColumns = 1,
  responsive = true,
  validateOnChange = false,
  validateOnBlur = true,
  compact = false,
  spacing = 'lg',

  // Props del botón de submit
  submitVariant = 'primary',
  submitSize = 'md',
  submitRounded = 'md',
  submitText = 'Enviar',
  submitLeftIcon,
  submitRightIcon,
  submitFullWidth = false,

  // Props múltiples acciones
  actions = null,
  
  // DEPRECATED PROPS - Backward compatibility
  fieldSize,
  fieldRounded,
  submitIcon
}) => {
  // Validar props estándar
  validateStandardProps({ 
    size, variant, rounded, disabled, loading, className 
  }, 'DynamicForm');
  
  // Backward compatibility warnings
  React.useEffect(() => {
    // eslint-disable-next-line no-undef
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      if (fieldSize) {
        console.warn('DynamicForm: prop "fieldSize" está deprecada. Usar "size" en su lugar.');
      }
      if (fieldRounded) {
        console.warn('DynamicForm: prop "fieldRounded" está deprecada. Usar "rounded" en su lugar.');
      }
      if (submitIcon) {
        console.warn('DynamicForm: prop "submitIcon" está deprecada. Usar "submitLeftIcon" o "submitRightIcon" en su lugar.');
      }
    }
  }, [fieldSize, fieldRounded, submitIcon]);
  
  // Resolver props finales con backward compatibility
  const finalSize = fieldSize || size;
  const finalRounded = fieldRounded || rounded;
  const finalSubmitLeftIcon = submitIcon || submitLeftIcon;
  // Estado del formulario con datos iniciales
  const [formData, setFormData] = useState(() => {
    const initialFormData = { ...initialData };

    fields.forEach(field => {
      const fieldName = typeof field === 'string' ? field : field.name;
      const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
      const defaultValue = typeof field === 'string' ? '' : (field.defaultValue || '');

      // Solo usar defaultValue si no hay dato inicial
      if (!(fieldName in initialFormData)) {
        switch (fieldType) {
          case 'checkbox':
            initialFormData[fieldName] = defaultValue || false;
            break;
          default:
            initialFormData[fieldName] = defaultValue;
        }
      }
    });

    return initialFormData;
  });

  // Estados para validación
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Detectar tamaño de pantalla usando breakpoints del sistema
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) { // Mobile breakpoint del sistema
        setScreenSize('mobile');
      } else if (width < 1024) { // Tablet breakpoint del sistema
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mantener la última referencia de onChange para evitar loops
  const onChangeRef = React.useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Efecto para notificar cambios en los datos sin provocar ciclos infinitos
  useEffect(() => {
    onChangeRef.current(formData);
  }, [formData]);

  // Función para obtener el número de columnas según el tamaño de pantalla
  const getResponsiveColumns = () => {
    if (!responsive) return columnsPerRow;

    switch (screenSize) {
      case 'mobile':
        return mobileColumns;
      case 'tablet':
        return tabletColumns;
      default:
        return columnsPerRow;
    }
  };

  // Función para validar un campo
  const validateField = (field, value) => {
    const fieldRequired = typeof field === 'string' ? false : (field.required || false);
    const fieldValidation = typeof field === 'string' ? null : field.validation;
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');

    if (fieldRequired && (!value || value.toString().trim() === '')) {
      return 'Este campo es requerido';
    }

    // Validaciones por tipo usando las mismas que TextInput
    if (value && value.toString().trim() !== '') {
      switch (fieldType) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Por favor ingresa un email válido';
          }
          break;
        case 'tel':
          if (!/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-()]/g, ''))) {
            return 'Por favor ingresa un teléfono válido';
          }
          break;
        case 'url':
          try {
            new URL(value);
          } catch {
            return 'Por favor ingresa una URL válida';
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            return 'Por favor ingresa un número válido';
          }
          break;
      }
    }

    // Validación personalizada
    if (fieldValidation && typeof fieldValidation === 'function') {
      const customError = fieldValidation(value);
      if (customError !== true) {
        return customError;
      }
    }

    return null;
  };

  // Manejar cambios en los campos
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Validar si está habilitado
    if (validateOnChange) {
      const field = fields.find(f => (typeof f === 'string' ? f : f.name) === fieldName);
      const error = validateField(field, value);

      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  // Manejar pérdida de foco
  const handleFieldBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    if (validateOnBlur) {
      const field = fields.find(f => (typeof f === 'string' ? f : f.name) === fieldName);
      const error = validateField(field, formData[fieldName]);

      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const allTouched = {};

    // Validar todos los campos
    fields.forEach(field => {
      const fieldName = typeof field === 'string' ? field : field.name;
      const value = formData[fieldName];
      const error = validateField(field, value);

      allTouched[fieldName] = true;
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    setTouched(allTouched);

    // Si no hay errores, enviar
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  // Función para obtener clases de grid column
  const getFieldGridClasses = (field) => {
    const fieldWidth = typeof field === 'string' ? 'auto' : (field.width || 'auto');
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');

    const classes = ['dynamic-form__field'];

    // Agregar clase de tipo
    classes.push(`dynamic-form__field--${fieldType}`);

    // Agregar clase de ancho
    if (fieldWidth !== 'auto') {
      classes.push(`dynamic-form__field--${fieldWidth}`);
    }

    return classes;
  };

  // Función para normalizar opciones (compatible con TextSelect)
  const normalizeOptions = (options) => {
    if (!options || !Array.isArray(options)) return [];

    return options.map(option => {
      if (typeof option === 'string') {
        return { value: option, label: option };
      }

      // Si tiene 'id' y 'name' (formato actual), convertir a 'value' y 'label'
      if (option.id && option.name) {
        return {
          value: option.id,
          label: option.name,
          disabled: option.disabled
        };
      }

      // Si ya tiene 'value' y 'label', mantener como está
      if (option.value && option.label) {
        return option;
      }

      // Fallback
      return {
        value: option.value || option.id || option,
        label: option.label || option.name || option.toString(),
        disabled: option.disabled
      };
    });
  };

  // Función para renderizar cada campo
  const renderField = (field, index) => {
    const fieldName = typeof field === 'string' ? field : field.name;
    const fieldLabel = typeof field === 'string' ? field : (field.label || field.name);
    const fieldType = typeof field === 'string' ? 'text' : (field.type || 'text');
    const fieldPlaceholder = typeof field === 'string' ? '' : (field.placeholder || '');
    const fieldRequired = typeof field === 'string' ? false : (field.required || false);
    const fieldOptions = typeof field === 'string' ? [] : (field.options || []);
    const fieldDisabled = typeof field === 'string' ? false : (field.disabled || disabled);
    const fieldHelperText = typeof field === 'string' ? null : field.helperText;
    const fieldLeftIcon = typeof field === 'string' ? null : field.leftIcon;
    const fieldRightIcon = typeof field === 'string' ? null : field.rightIcon;
    const fieldMaxLength = typeof field === 'string' ? null : field.maxLength;
    const fieldShowCharCount = typeof field === 'string' ? false : field.showCharCount;

    const fieldError = errors[fieldName];
    const fieldTouched = touched[fieldName];
    const hasError = fieldError && fieldTouched;

    const fieldClasses = getFieldGridClasses(field);

    // Para campos que TextInput puede manejar directamente
    if (['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'].includes(fieldType)) {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <TextInput
            type={fieldType}
            name={fieldName}
            label={fieldLabel}
            placeholder={fieldPlaceholder}
            value={formData[fieldName] || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            onBlur={() => handleFieldBlur(fieldName)}
            required={fieldRequired}
            disabled={fieldDisabled}
            errorText={hasError ? fieldError : ''}
            helperText={!hasError ? fieldHelperText : ''}
            leftIcon={fieldLeftIcon}
            rightIcon={fieldRightIcon}
            maxLength={fieldMaxLength}
            showCharCount={fieldShowCharCount}
            size={finalSize}
            rounded={finalRounded}
            compact={compact}
            fullWidth
            variant={hasError ? 'danger' : variant}
            autoComplete={fieldType === 'email' ? 'email' : fieldType === 'tel' ? 'tel' : undefined}
          />
        </div>
      );
    }

    // Para campos de tipo file
    if (fieldType === 'file') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <FileInputField
            label={fieldLabel}
            name={fieldName}
            accept={field.accept}
            multiple={field.multiple || false}
            text={field.text || fieldPlaceholder || 'Seleccionar archivo'}
            helperText={!hasError ? fieldHelperText : ''}
            errorText={hasError ? fieldError : ''}
            required={fieldRequired}
            disabled={fieldDisabled}
            size={finalSize}
            rounded={finalRounded}
            variant={hasError ? 'danger' : (field.variant || variant)}
            fullWidth={true}
            compact={compact}
            onChange={(e) => {
              // Manejar archivos de manera especial
              const files = Array.from(e.target.files || []);
              const value = field.multiple ? files : files[0] || null;
              handleFieldChange(fieldName, value);
            }}
            onBlur={() => handleFieldBlur(fieldName)}
          />
        </div>
      );
    }

    // ✨ NUEVO: Para campos de tipo image-crop
    if (fieldType === 'image-crop') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <ImageCropField
            name={fieldName}
            label={fieldLabel}
            value={formData[fieldName] || null}
            onChange={(file) => handleFieldChange(fieldName, file)}
            helperText={!hasError ? fieldHelperText : ''}
            errorText={hasError ? fieldError : ''}
            required={fieldRequired}
            disabled={fieldDisabled}
            size={finalSize}
            rounded={finalRounded}
            variant={hasError ? 'danger' : (field.variant || variant)}
            fullWidth={true}
            compact={compact}
            // Props específicas de ImageCropField
            aspect={field.aspect || 16/9}
            showPreview={field.showPreview !== false}
            acceptedFormats={field.acceptedFormats}
            maxFileSize={field.maxFileSize || '5MB'}
            previewDimensions={field.previewDimensions || { width: 300, height: 200 }}
            cropButtonText={field.cropButtonText || 'Volver a recortar'}
            changeButtonText={field.changeButtonText || 'Cambiar imagen'}
            selectButtonText={field.selectButtonText || 'Seleccionar imagen'}
            previewAlt={field.previewAlt || 'Vista previa de imagen'}
          />
        </div>
      );
    }

    // ✨ NUEVO: Para campos select - USAR TEXTSELECT
    if (fieldType === 'select') {
      const normalizedOptions = normalizeOptions(fieldOptions);

      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <TextSelect
            name={fieldName}
            label={fieldLabel}
            placeholder={fieldPlaceholder || 'Selecciona una opción'}
            options={normalizedOptions}
            value={formData[fieldName] || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            onBlur={() => handleFieldBlur(fieldName)}
            required={fieldRequired}
            disabled={fieldDisabled}
            errorText={hasError ? fieldError : ''}
            helperText={!hasError ? fieldHelperText : ''}
            leftIcon={fieldLeftIcon}
            size={finalSize}
            rounded={finalRounded}
            compact={compact}
            fullWidth
            variant={hasError ? 'danger' : variant}
          />
        </div>
      );
    }

    if (fieldType === 'checkbox') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <Checkbox
            id={fieldName}
            name={fieldName}
            value={fieldName}
            checked={Boolean(formData[fieldName])}
            onChange={(e) => handleFieldChange(fieldName, e.target.checked)}
            onBlur={() => handleFieldBlur(fieldName)}
            disabled={fieldDisabled}
            required={fieldRequired}
            label={fieldLabel}
            helperText={!hasError ? fieldHelperText : ''}
            error={hasError ? fieldError : ''}
            size={field.size || fieldSize} // Permitir override por campo
            className={field.className || ''}
          />
        </div>
      );
    }

    // Para campos radio
    if (fieldType === 'radio') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <label className="dynamic-form__label">
            {fieldLabel}
            {fieldRequired && <span style={{ color: 'var(--color-danger)' }}> *</span>}
          </label>
          <div className="dynamic-form__radio-container">
            {fieldOptions.map((option, optIndex) => (
              <div key={optIndex} className="dynamic-form__radio-item">
                <input
                  id={`${fieldName}_${optIndex}`}
                  type="radio"
                  name={fieldName}
                  className="dynamic-form__radio"
                  value={typeof option === 'string' ? option : option.value}
                  checked={formData[fieldName] === (typeof option === 'string' ? option : option.value)}
                  onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                  onBlur={() => handleFieldBlur(fieldName)}
                  required={fieldRequired}
                  disabled={fieldDisabled}
                />
                <label
                  htmlFor={`${fieldName}_${optIndex}`}
                  className="dynamic-form__radio-label"
                >
                  {typeof option === 'string' ? option : option.label}
                </label>
              </div>
            ))}
          </div>
          {hasError && (
            <span className="dynamic-form__error-message" role="alert">
              {fieldError}
            </span>
          )}
          {!hasError && fieldHelperText && (
            <span className="dynamic-form__helper-text">
              {fieldHelperText}
            </span>
          )}
        </div>
      );
    }

    // Para campos textarea - mantener como está por ahora
    if (fieldType === 'textarea') {
      return (
        <div key={index} className={fieldClasses.join(' ')}>
          <label htmlFor={fieldName} className="dynamic-form__label">
            {fieldLabel}
            {fieldRequired && <span style={{ color: 'var(--color-danger)' }}> *</span>}
          </label>
          <textarea
            id={fieldName}
            className="dynamic-form__textarea"
            value={formData[fieldName] || ''}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            onBlur={() => handleFieldBlur(fieldName)}
            placeholder={fieldPlaceholder}
            required={fieldRequired}
            disabled={fieldDisabled}
            rows={4}
            maxLength={fieldMaxLength}
          />
          {fieldMaxLength && fieldShowCharCount && (
            <div className="dynamic-form__char-count">
              {(formData[fieldName] || '').length}/{fieldMaxLength}
            </div>
          )}
          {hasError && (
            <span className="dynamic-form__error-message" role="alert">
              {fieldError}
            </span>
          )}
          {!hasError && fieldHelperText && (
            <span className="dynamic-form__helper-text">
              {fieldHelperText}
            </span>
          )}
        </div>
      );
    }

    // Fallback para tipos no reconocidos
    return null;
  };

  const currentColumns = getResponsiveColumns();
  const formClasses = [
    'dynamic-form',
    `dynamic-form--size-${finalSize}`,
    `dynamic-form--variant-${variant}`,
    `dynamic-form--rounded-${finalRounded}`,
    `dynamic-form--spacing-${spacing}`,
    loading && 'dynamic-form--loading',
    disabled && 'dynamic-form--disabled',
    compact && 'dynamic-form--compact',
    className
  ].filter(Boolean).join(' ');

  const gridClasses = [
    'dynamic-form__grid',
    `dynamic-form__grid--${currentColumns}-cols`,
    `dynamic-form__grid--spacing-${spacing}`
  ].join(' ');

  return (
    <div className={formClasses}>
      {fields.length === 0 ? (
        <div className="dynamic-form__empty-message">
          No hay campos definidos para este formulario.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div
            className={gridClasses}
            style={{
              gridTemplateColumns: `repeat(${currentColumns}, 1fr)`
            }}
          >
            {fields.map(renderField)}
          </div>

          <div className="dynamic-form__submit-container">
            {actions ? (
              // Renderizar botones personalizados
              actions.map((action, index) => {
                // Verificar si el botón debe mostrarse
                if (action.show === false) return null;
                
                return (
                  <Button
                    key={action.key || index}
                    type={action.type || 'button'}
                    variant={action.variant || 'primary'}
                    size={action.size || submitSize}
                    rounded={action.rounded || submitRounded}
                    leftIcon={action.leftIcon}
                    rightIcon={action.rightIcon}
                    loading={action.loading || loading}
                    disabled={action.disabled || disabled}
                    fullWidth={action.fullWidth || submitFullWidth}
                    onClick={action.onClick}
                  >
                    {action.text || action.children}
                  </Button>
                );
              })
            ) : (
              // Comportamiento original (backward compatibility)
              <Button
                type="submit"
                variant={submitVariant}
                size={submitSize}
                rounded={submitRounded}
                leftIcon={finalSubmitLeftIcon}
                rightIcon={submitRightIcon}
                loading={loading}
                disabled={disabled}
                fullWidth={submitFullWidth}
              >
                {submitText}
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

// Definir PropTypes con integración del sistema estándar
DynamicForm.propTypes = {
  // Props estándar del sistema
  ...STANDARD_PROP_TYPES,
  
  // Props específicas de DynamicForm
  fields: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
        options: PropTypes.array,
        validation: PropTypes.func,
        defaultValue: PropTypes.any,
        helperText: PropTypes.string,
        leftIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        variant: PropTypes.string,
        size: PropTypes.string,
        rounded: PropTypes.string,
        fullWidth: PropTypes.bool,
        maxLength: PropTypes.number,
        showCharCount: PropTypes.bool,
        aspect: PropTypes.number,
        showPreview: PropTypes.bool,
        acceptedFormats: PropTypes.array,
        maxFileSize: PropTypes.string,
        previewDimensions: PropTypes.object,
        cropButtonText: PropTypes.string,
        changeButtonText: PropTypes.string,
        selectButtonText: PropTypes.string,
        previewAlt: PropTypes.string,
        className: PropTypes.string
      })
    ])
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  initialData: PropTypes.object,
  columnsPerRow: PropTypes.number,
  tabletColumns: PropTypes.number,
  mobileColumns: PropTypes.number,
  responsive: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  validateOnBlur: PropTypes.bool,
  compact: PropTypes.bool,
  spacing: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  
  // Props del botón de submit
  submitVariant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'neutral']),
  submitSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  submitRounded: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  submitText: PropTypes.string,
  submitLeftIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  submitRightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  submitFullWidth: PropTypes.bool,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      type: PropTypes.string,
      variant: PropTypes.string,
      size: PropTypes.string,
      rounded: PropTypes.string,
      leftIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      loading: PropTypes.bool,
      disabled: PropTypes.bool,
      fullWidth: PropTypes.bool,
      onClick: PropTypes.func,
      text: PropTypes.string,
      children: PropTypes.node,
      show: PropTypes.bool
    })
  ),
  
  // DEPRECATED PROPS - Backward compatibility
  fieldSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fieldRounded: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  submitIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

// Memoizar DynamicForm - formularios complejos con muchos campos
const MemoizedDynamicForm = memo(DynamicForm);

export { MemoizedDynamicForm as DynamicForm };