// components/atoms/Checkbox/Checkbox.stories.jsx
import { useState } from 'react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Components/Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Checkbox - MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR ✅

## ✅ MIGRACIÓN COMPLETADA
- **Hook useStandardProps()**: Integrado ✅
- **Props estándar**: size, variant, rounded, loading, disabled ✅  
- **6 Variantes semánticas**: primary, secondary, success, warning, danger, neutral ✅
- **5 Tamaños estándar**: xs, sm, md, lg, xl ✅
- **Estados loading/disabled**: Spinner integrado + overlays ✅
- **Sistema de iconos**: leftIcon, rightIcon con renderIcon ✅
- **Design tokens**: Automáticos con CSS custom properties ✅
- **Backward compatibility**: 100% mantenida ✅

## 🎯 Características Avanzadas

- **Estados especializados**: checked, indeterminate, error
- **Accesibilidad completa**: ARIA, navegación teclado, screen readers
- **Responsive**: Área táctil optimizada móvil (44px mínimo)
- **Performance**: Memoización automática + lazy loading
- **Personalización**: Iconos personalizados + helper text
        `
      }
    }
  },
  argTypes: {
    // Props estándar del sistema
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del checkbox (5 tamaños estándar)'
    },
    variant: {
      control: 'select', 
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante semántica del checkbox (6 variantes)'
    },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes del checkbox'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carga con spinner'
    },
    disabled: {
      control: 'boolean',
      description: 'Si está deshabilitado'
    },
    leftIcon: {
      control: 'select',
      options: [null, 'star', 'heart', 'check', 'user'],
      description: 'Icono izquierdo en el label'
    },
    rightIcon: {
      control: 'select', 
      options: [null, 'star', 'heart', 'check', 'user'],
      description: 'Icono derecho en el label'
    },
    // Props específicas del Checkbox
    checked: {
      control: 'boolean',
      description: 'Estado del checkbox'
    },
    indeterminate: {
      control: 'boolean',
      description: 'Estado indeterminado (línea)'
    },
    label: {
      control: 'text',
      description: 'Texto del label'
    },
    helperText: {
      control: 'text',
      description: 'Texto de ayuda'
    },
    error: {
      control: 'text',
      description: 'Mensaje de error'
    },
    required: {
      control: 'boolean',
      description: 'Si es requerido'
    }
  }
};

// Hook para estados controlados
const useCheckboxState = (initialValue = false) => {
  const [checked, setChecked] = useState(initialValue);
  return [checked, (e) => setChecked(e.target.checked)];
};

// ===== HISTORIA BÁSICA =====
export const Default = {
  args: {
    label: 'Acepto los términos y condiciones',
    size: 'md',
    variant: 'primary',
    rounded: 'sm',
    checked: false,
    loading: false,
    disabled: false
  },
  render: (args) => {
    const [checked, handleChange] = useCheckboxState(args.checked);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={handleChange}
      />
    );
  }
};

// ===== PROPS ESTÁNDAR DEL SISTEMA =====
export const SystemStandardProps = {
  name: '✅ Props Estándar del Sistema',
  render: () => {
    const [xs, setXs] = useCheckboxState(false);
    const [sm, setSm] = useCheckboxState(true);
    const [md, setMd] = useCheckboxState(false);
    const [lg, setLg] = useCheckboxState(true);
    const [xl, setXl] = useCheckboxState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ margin: 0, color: '#059669' }}>✅ 5 Tamaños Estándar</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Checkbox size="xs" label="Extra pequeño (xs)" checked={xs} onChange={setXs} />
          <Checkbox size="sm" label="Pequeño (sm)" checked={sm} onChange={setSm} />
          <Checkbox size="md" label="Mediano (md) - por defecto" checked={md} onChange={setMd} />
          <Checkbox size="lg" label="Grande (lg)" checked={lg} onChange={setLg} />
          <Checkbox size="xl" label="Extra grande (xl)" checked={xl} onChange={setXl} />
        </div>
      </div>
    );
  }
};

export const SystemVariants = {
  name: '✅ 6 Variantes Semánticas',
  render: () => {
    const [primary, setPrimary] = useCheckboxState(true);
    const [secondary, setSecondary] = useCheckboxState(true);
    const [success, setSuccess] = useCheckboxState(true);
    const [warning, setWarning] = useCheckboxState(true);
    const [danger, setDanger] = useCheckboxState(true);
    const [neutral, setNeutral] = useCheckboxState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ margin: 0, color: '#059669' }}>✅ Variantes Semánticas</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Checkbox variant="primary" label="Primary - Acción principal" checked={primary} onChange={setPrimary} />
          <Checkbox variant="secondary" label="Secondary - Acción secundaria" checked={secondary} onChange={setSecondary} />
          <Checkbox variant="success" label="Success - Estado exitoso" checked={success} onChange={setSuccess} />
          <Checkbox variant="warning" label="Warning - Advertencia" checked={warning} onChange={setWarning} />
          <Checkbox variant="danger" label="Danger - Acción destructiva" checked={danger} onChange={setDanger} />
          <Checkbox variant="neutral" label="Neutral - Estado neutro" checked={neutral} onChange={setNeutral} />
        </div>
      </div>
    );
  }
};

export const SystemStates = {
  name: '✅ Estados del Sistema',
  render: () => {
    const [loading1, setLoading1] = useCheckboxState(false);
    const [loading2, setLoading2] = useCheckboxState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ margin: 0, color: '#059669' }}>✅ Estados Loading & Disabled</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Checkbox label="Estado normal" checked={false} onChange={() => {}} />
          <Checkbox label="Estado loading (unchecked)" checked={loading1} onChange={setLoading1} loading />
          <Checkbox label="Estado loading (checked)" checked={loading2} onChange={setLoading2} loading />
          <Checkbox label="Estado disabled (unchecked)" checked={false} disabled />
          <Checkbox label="Estado disabled (checked)" checked={true} disabled />
          <Checkbox label="Estado indeterminate" indeterminate onChange={() => {}} />
        </div>
      </div>
    );
  }
};

export const SystemIcons = {
  name: '✅ Sistema de Iconos',
  render: () => {
    const [left, setLeft] = useCheckboxState(true);
    const [right, setRight] = useCheckboxState(false);
    const [both, setBoth] = useCheckboxState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ margin: 0, color: '#059669' }}>✅ Iconos Personalizados</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Checkbox
            label="Con icono izquierdo"
            leftIcon="star"
            checked={left}
            onChange={setLeft}
          />
          <Checkbox
            label="Con icono derecho"
            rightIcon="heart" 
            checked={right}
            onChange={setRight}
          />
          <Checkbox
            label="Con ambos iconos"
            leftIcon="check"
            rightIcon="user"
            checked={both}
            onChange={setBoth}
          />
        </div>
      </div>
    );
  }
};

// ===== CASOS DE USO COMUNES =====
export const CommonUseCases = {
  name: 'Casos de Uso Comunes',
  render: () => {
    const [terms, setTerms] = useCheckboxState(false);
    const [marketing, setMarketing] = useCheckboxState(true);
    const [notifications, setNotifications] = useCheckboxState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Casos de Uso Típicos</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Checkbox
            label="Acepto términos y condiciones"
            variant="success"
            required
            checked={terms}
            onChange={setTerms}
            helperText="Requerido para continuar"
            leftIcon="check"
          />
          <Checkbox
            label="Recibir emails marketing"
            variant="primary" 
            checked={marketing}
            onChange={setMarketing}
            helperText="Promociones y ofertas especiales"
            leftIcon="star"
          />
          <Checkbox
            label="Notificaciones push"
            variant="warning"
            checked={notifications}
            onChange={setNotifications}
            error={notifications ? '' : 'Se recomienda activar notificaciones'}
            rightIcon="heart"
          />
        </div>
      </div>
    );
  }
};

// ===== BACKWARD COMPATIBILITY =====
export const BackwardCompatibility = {
  name: '✅ Backward Compatibility',
  render: () => {
    const [old1, setOld1] = useCheckboxState(true);
    const [old2, setOld2] = useCheckboxState(false);
    const [old3, setOld3] = useCheckboxState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ margin: 0, color: '#059669' }}>✅ 100% Backward Compatible</h3>
        <p style={{ margin: 0, color: '#6b7280' }}>
          El componente mantiene total compatibilidad con la API anterior.
          <br />Nuevas props estándar están disponibles sin romper código existente.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Checkbox
            label="API legacy funciona perfectamente"
            checked={old1}
            onChange={setOld1}
          />
          <Checkbox
            label="Con helper text legacy"
            helperText="Texto de ayuda como antes"
            checked={old2}
            onChange={setOld2}
          />
          <Checkbox
            label="Con estados legacy + nuevos"
            variant="success"
            size="lg"
            checked={old3}
            onChange={setOld3}
            rightIcon="star"
          />
        </div>
        <div style={{ 
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #16a34a',
          borderRadius: '0.5rem'
        }}>
          <strong style={{ color: '#16a34a' }}>✅ Sin breaking changes:</strong>
          <br />• API anterior funciona sin cambios
          <br />• Nuevas props opcionales disponibles
          <br />• Deprecation warnings solo informativos
        </div>
      </div>
    );
  }
};

// ===== EJEMPLO COMPLEJO - FORMULARIO =====
export const ComplexForm = {
  name: 'Ejemplo Complejo - Formulario',
  render: () => {
    const [selectedItems, setSelectedItems] = useState(['react']);
    const [loading, setLoading] = useState(false);

    const handleItemChange = (value) => (e) => {
      if (e.target.checked) {
        setSelectedItems([...selectedItems, value]);
      } else {
        setSelectedItems(selectedItems.filter(item => item !== value));
      }
    };

    const technologies = [
      { value: 'react', label: 'React', variant: 'primary', icon: 'star' },
      { value: 'vue', label: 'Vue.js', variant: 'success', icon: 'heart' },
      { value: 'angular', label: 'Angular', variant: 'danger', icon: 'check' },
      { value: 'svelte', label: 'Svelte', variant: 'warning', icon: 'user' }
    ];

    const handleSubmit = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>
          🚀 Formulario con Sistema de Diseño Completo
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {technologies.map(tech => (
            <Checkbox
              key={tech.value}
              label={tech.label}
              variant={tech.variant}
              size="lg"
              leftIcon={tech.icon}
              checked={selectedItems.includes(tech.value)}
              onChange={handleItemChange(tech.value)}
              value={tech.value}
              loading={loading}
              helperText={`Tecnología ${tech.label.toLowerCase()}`}
            />
          ))}
        </div>

        <div style={{ 
          marginTop: '1rem', 
          padding: '1.5rem', 
          backgroundColor: '#f8fafc', 
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <strong>📊 Resumen:</strong>
          <br />• <strong>Seleccionadas:</strong> {selectedItems.join(', ') || 'Ninguna'}
          <br />• <strong>Cantidad:</strong> {selectedItems.length}/4
          <br />• <strong>Estado:</strong> {loading ? '⏳ Procesando...' : '✅ Listo'}
          
          <button
            onClick={handleSubmit}
            disabled={loading || selectedItems.length === 0}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Enviando...' : '🚀 Enviar Selección'}
          </button>
        </div>
      </div>
    );
  }
};

// ===== PLAYGROUND INTERACTIVO =====
export const Playground = {
  name: 'Playground Interactivo',
  args: {
    label: 'Checkbox interactivo del sistema',
    helperText: 'Prueba todas las props estándar del sistema',
    size: 'md',
    variant: 'primary',
    rounded: 'sm',
    required: false,
    disabled: false,
    loading: false,
    leftIcon: null,
    rightIcon: null
  },
  render: (args) => {
    const [checked, handleChange] = useCheckboxState(false);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>🎮 Playground - Prueba todas las props</h4>
          <Checkbox
            {...args}
            checked={checked}
            onChange={handleChange}
          />
        </div>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: checked ? '#dcfce7' : '#fef3c7',
          borderRadius: '0.5rem',
          border: `2px solid ${checked ? '#16a34a' : '#d97706'}`,
          transition: 'all 0.2s ease'
        }}>
          <strong>Estado:</strong> {checked ? '✅ Marcado' : '⬜ No marcado'}
          <br />
          <strong>Variante:</strong> {args.variant}
          <br />
          <strong>Tamaño:</strong> {args.size}
          <br />
          <strong>Props activas:</strong> {[
            args.loading && 'loading',
            args.disabled && 'disabled', 
            args.required && 'required',
            args.leftIcon && `leftIcon(${args.leftIcon})`,
            args.rightIcon && `rightIcon(${args.rightIcon})`
          ].filter(Boolean).join(', ') || 'ninguna'}
        </div>
      </div>
    );
  }
};

// ===== DOCUMENTACIÓN TÉCNICA =====
export const TechnicalDocs = {
  name: '📚 Documentación Técnica',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <h3 style={{ margin: 0, color: '#059669' }}>📚 Checkbox - Documentación Técnica Completa</h3>
      
      <div style={{ 
        padding: '1.5rem',
        backgroundColor: '#f0fdf4',
        border: '1px solid #16a34a',
        borderRadius: '0.5rem'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#16a34a' }}>✅ MIGRACIÓN COMPLETADA</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li><strong>Hook useStandardProps():</strong> Integrado completamente</li>
          <li><strong>Props estándar:</strong> size, variant, rounded, loading, disabled</li>
          <li><strong>Variantes:</strong> 6 semánticas (primary → neutral)</li>
          <li><strong>Tamaños:</strong> 5 estándar (xs → xl)</li>
          <li><strong>Design tokens:</strong> CSS custom properties automáticas</li>
        </ul>
      </div>

      <div style={{ 
        padding: '1rem',
        backgroundColor: '#fef3c7',
        border: '1px solid #d97706',
        borderRadius: '0.5rem'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#d97706' }}>🎯 Props Específicas del Checkbox</h4>
        <code style={{ display: 'block', backgroundColor: '#fff', padding: '1rem', borderRadius: '0.25rem' }}>
          checked: boolean - Estado del checkbox<br />
          indeterminate: boolean - Estado indeterminado<br />
          onChange: function - Callback al cambiar<br />
          label: string - Texto del label<br />
          helperText: string - Texto de ayuda<br />
          error: string - Mensaje de error<br />
          required: boolean - Si es requerido
        </code>
      </div>

      <div style={{ 
        padding: '1rem',
        backgroundColor: '#ddd6fe',
        border: '1px solid #8b5cf6',
        borderRadius: '0.5rem'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#8b5cf6' }}>🔧 Uso en Código</h4>
        <code style={{ display: 'block', backgroundColor: '#fff', padding: '1rem', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
          {`// Uso básico
<Checkbox
  label="Acepto términos"
  checked={checked}
  onChange={handleChange}
/>

// Con sistema completo
<Checkbox
  size="lg"
  variant="success"
  rounded="md"
  leftIcon="check"
  label="Confirmación"
  helperText="Requerido"
  loading={isSubmitting}
  checked={accepted}
  onChange={setAccepted}
/>`}
        </code>
      </div>
    </div>
  )
};

// ===== MIGRACIÓN COMPLETADA ===== 
// ✅ Hook useStandardProps() integrado
// ✅ Props estándar implementadas  
// ✅ 6 variantes + 5 tamaños estándar
// ✅ Estados loading/disabled/error
// ✅ Sistema de iconos unificado
// ✅ Design tokens automáticos
// ✅ Backward compatibility 100%
// ✅ Storybook actualizado completamente