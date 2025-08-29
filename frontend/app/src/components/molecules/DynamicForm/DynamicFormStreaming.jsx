// molecules/DynamicForm/DynamicFormStreaming.jsx
import React from 'react';
import PropTypes from 'prop-types';
// ✅ DESIGN SYSTEM - VERSIÓN BASE
import { DynamicForm } from '../../../../design-system';

// ✅ COMPONENTES ESPECÍFICOS STREAMING
import { FileInputField } from '../FileInputField/FileInputField';
import { ImageCropField } from '../ImageCropField/ImageCropField';

/**
 * DynamicFormStreaming - Extensión de DynamicForm con componentes específicos del streaming
 * 
 * Esta versión extiende DynamicForm del design-system agregando:
 * - FileInputField (específico para uploads de archivos de video)
 * - ImageCropField (específico para manejo de carátulas y posters)
 * 
 * Mantiene toda la funcionalidad de DynamicForm base pero agrega tipos de campo
 * específicos para la aplicación de streaming.
 */
export function DynamicFormStreaming(props) {
  const { fields = [], ...restProps } = props;

  // Procesar campos para agregar renderizadores personalizados
  const processedFields = fields.map(field => {
    if (typeof field !== 'object') return field;

    // Si es un campo de tipo 'file-advanced', usar FileInputField
    if (field.type === 'file-advanced') {
      return {
        ...field,
        type: 'custom',
        render: (fieldProps, index, formData, handleFieldChange, handleFieldBlur, errors) => {
          const fieldName = field.name;
          const hasError = Boolean(errors[fieldName]);
          const fieldError = errors[fieldName];

          return (
            <FileInputField
              key={index}
              label={field.label}
              name={fieldName}
              accept={field.accept}
              multiple={field.multiple || false}
              text={field.text || field.placeholder || 'Seleccionar archivo'}
              helperText={!hasError ? field.helperText : ''}
              errorText={hasError ? fieldError : ''}
              required={field.required}
              disabled={field.disabled || fieldProps.disabled}
              size={fieldProps.size}
              rounded={fieldProps.rounded}
              variant={hasError ? 'danger' : (field.variant || fieldProps.variant)}
              width="full"
              compact={fieldProps.compact}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const value = field.multiple ? files : files[0] || null;
                handleFieldChange(fieldName, value);
              }}
              onBlur={() => handleFieldBlur(fieldName)}
            />
          );
        }
      };
    }

    // Si es un campo de tipo 'image-crop', usar ImageCropField
    if (field.type === 'image-crop') {
      return {
        ...field,
        type: 'custom',
        render: (fieldProps, index, formData, handleFieldChange, handleFieldBlur, errors) => {
          const fieldName = field.name;
          const hasError = Boolean(errors[fieldName]);
          const fieldError = errors[fieldName];

          return (
            <ImageCropField
              key={index}
              name={fieldName}
              label={field.label}
              value={formData[fieldName] || null}
              onChange={(file) => handleFieldChange(fieldName, file)}
              helperText={!hasError ? field.helperText : ''}
              errorText={hasError ? fieldError : ''}
              required={field.required}
              disabled={field.disabled || fieldProps.disabled}
              size={fieldProps.size}
              rounded={fieldProps.rounded}
              variant={hasError ? 'danger' : (field.variant || fieldProps.variant)}
              width="full"
              compact={fieldProps.compact}
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
          );
        }
      };
    }

    // Otros campos se procesan normalmente
    return field;
  });

  // Usar DynamicForm base con campos procesados
  return (
    <DynamicForm
      {...restProps}
      fields={processedFields}
    />
  );
}

DynamicFormStreaming.propTypes = {
  // Hereda todos los PropTypes de DynamicForm
  fields: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])).isRequired,
  
  // Resto de props se pasan directamente a DynamicForm
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  initialData: PropTypes.object,
  
  // Props del sistema de diseño
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'neutral']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

DynamicFormStreaming.defaultProps = {
  initialData: {},
  onChange: () => {},
  size: 'md',
  variant: 'primary',
  disabled: false,
  loading: false
};

export default DynamicFormStreaming;