import { Label } from './Label';

export default {
  title: 'Components/Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Label Atom

El átomo **Label** es una etiqueta standalone versátil para formularios y elementos de interfaz.

## 🎯 Características principales

- **6 variantes semánticas**: default, primary, secondary, success, warning, danger
- **5 tamaños estándar**: xs, sm, md, lg, xl
- **Indicadores visuales**: required (*), optional (opcional)
- **Iconos opcionales**: Izquierdo/derecho con Feather Icons
- **Tooltip informativo**: Icono de información con texto explicativo
- **Estados interactivos**: hover, focus, disabled, clickeable
- **Integración HTML**: htmlFor para asociar con inputs
- **Accesibilidad completa**: ARIA labels, navegación por teclado
- **Responsive**: Adaptación automática a móvil
- **Casos de uso específicos**: checkboxes, radios, secciones

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { Label } from './atoms/Label';

// Label simple
<Label text="Nombre de usuario" />

// Label requerido con icono
<Label 
  text="Email" 
  required 
  leftIcon="mail"
  htmlFor="email-input"
/>

// Label con tooltip
<Label 
  text="Contraseña" 
  tooltip="Mínimo 8 caracteres, incluye mayúsculas y números"
  variant="primary"
/>

// Label opcional
<Label 
  text="Teléfono" 
  optional 
  rightIcon="phone"
/>
\\\`\\\`\\\`

## 🚀 Casos de uso avanzados

### Formularios complejos
\\\`\\\`\\\`jsx
<div className="form-field">
  <Label 
    htmlFor="username"
    text="Nombre de usuario" 
    required
    tooltip="Solo letras, números y guiones"
    variant="primary"
  />
  <input id="username" type="text" />
</div>
\\\`\\\`\\\`

### Checkboxes y radios
\\\`\\\`\\\`jsx
<Label 
  htmlFor="accept-terms"
  text="Acepto los términos y condiciones"
  className="label--checkbox"
  rightIcon="external-link"
/>
\\\`\\\`\\\`

### Secciones de formulario
\\\`\\\`\\\`jsx
<Label 
  text="Información Personal"
  variant="primary"
  size="lg"
  className="label--section"
/>
\\\`\\\`\\\`

## 💡 Mejores prácticas

- Usar **htmlFor** para asociar con inputs
- **required** para campos obligatorios
- **tooltip** para información adicional
- **variant="danger"** para errores
- **variant="success"** para validación exitosa
- **disabled** cuando el campo no está disponible
        `
      }
    }
  },
  argTypes: {
    children: {
      name: 'Contenido',
      description: 'Contenido de la etiqueta (React nodes)',
      control: { type: 'text' },
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content'
      }
    },
    text: {
      name: 'Texto',
      description: 'Alternativa a children para texto simple',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Content'
      }
    },
    htmlFor: {
      name: 'HTML For',
      description: 'ID del elemento asociado (input)',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Association'
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño de la etiqueta',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: "'md'" },
        category: 'Appearance'
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante visual de la etiqueta',
      control: { type: 'select' },
      options: ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'],
      table: {
        type: { summary: "'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'" },
        defaultValue: { summary: "'neutral'" },
        category: 'Appearance'
      }
    },
    required: {
      name: 'Requerido',
      description: 'Marca como campo requerido (asterisco rojo)',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State'
      }
    },
    optional: {
      name: 'Opcional',
      description: 'Marca como campo opcional (texto "opcional")',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State'
      }
    },
    leftIcon: {
      name: 'Icono izquierdo',
      description: 'Nombre del icono Feather para mostrar a la izquierda',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Icons'
      }
    },
    rightIcon: {
      name: 'Icono derecho',
      description: 'Nombre del icono Feather para mostrar a la derecha',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Icons'
      }
    },
    tooltip: {
      name: 'Tooltip',
      description: 'Texto de tooltip informativo',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Content'
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Estado deshabilitado',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State'
      }
    },
    bold: {
      name: 'Negrita',
      description: 'Texto en negrita',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Appearance'
      }
    },
    ariaLabel: {
      name: 'Etiqueta ARIA',
      description: 'Etiqueta de accesibilidad',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Accessibility'
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Styling'
      }
    }
  }
};

// Story principal
export const Default = {
  args: {
    text: 'Nombre de usuario',
    size: 'md',
    variant: 'neutral'
  }
};

// Tamaños
export const Sizes = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { size: 'xs', desc: 'Extra pequeño - para formularios compactos' },
      { size: 'sm', desc: 'Pequeño - para interfaces densas' },
      { size: 'md', desc: 'Medio - tamaño estándar (default)' },
      { size: 'lg', desc: 'Grande - para títulos de sección' },
      { size: 'xl', desc: 'Extra grande - para encabezados principales' }
    ].map(({ size, desc }) => (
      <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <Label 
          text={`Label ${size.toUpperCase()}`} 
          size={size} 
          leftIcon="tag"
          required
        />
        <span style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--text-muted)'
        }}>
          {desc}
        </span>
      </div>
    ))}
  </div>
);

// Variantes
export const Variants = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { variant: 'neutral', desc: 'Color por defecto, uso general', icon: 'tag' },
      { variant: 'primary', desc: 'Campos importantes o principales', icon: 'star' },
      { variant: 'secondary', desc: 'Campos secundarios o alternativos', icon: 'circle' },
      { variant: 'success', desc: 'Validación exitosa o confirmación', icon: 'check' },
      { variant: 'warning', desc: 'Advertencias o campos con precaución', icon: 'alert' },
      { variant: 'danger', desc: 'Errores o campos críticos', icon: 'x' }
    ].map(({ variant, desc, icon }) => (
      <div key={variant} style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 'var(--space-xs)'
      }}>
        <Label 
          text={`Label ${variant}`} 
          variant={variant} 
          leftIcon={icon}
          size="lg"
        />
        <span style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--text-muted)',
          marginLeft: 'var(--space-lg)'
        }}>
          {desc}
        </span>
      </div>
    ))}
  </div>
);

// Indicadores requerido/opcional
export const RequiredOptional = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Campos Requeridos
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Label text="Nombre completo" required leftIcon="user" />
        <Label text="Email" required leftIcon="mail" variant="primary" />
        <Label text="Contraseña" required leftIcon="lock" variant="danger" />
        <Label text="Confirmar contraseña" required leftIcon="shield" />
      </div>
    </div>

    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-secondary)'
      }}>
        Campos Opcionales
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Label text="Teléfono" optional rightIcon="phone" />
        <Label text="Fecha de nacimiento" optional leftIcon="calendar" variant="secondary" />
        <Label text="Sitio web" optional rightIcon="external-link" />
        <Label text="Biografía" optional leftIcon="edit" />
      </div>
    </div>
  </div>
);

// Con iconos
export const WithIcons = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--space-lg)',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Iconos Izquierdos
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Label text="Usuario" leftIcon="user" />
        <Label text="Email" leftIcon="mail" required />
        <Label text="Configuración" leftIcon="settings" variant="primary" />
        <Label text="Búsqueda" leftIcon="search" />
      </div>
    </div>

    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Iconos Derechos
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Label text="Enlace externo" rightIcon="external-link" />
        <Label text="Descargar" rightIcon="download" variant="success" />
        <Label text="Compartir" rightIcon="share" />
        <Label text="Más opciones" rightIcon="more-horizontal" />
      </div>
    </div>

    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Sin Iconos
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Label text="Nombre" required />
        <Label text="Apellido" />
        <Label text="Dirección" optional />
        <Label text="Ciudad" />
      </div>
    </div>
  </div>
);

// Con tooltips
export const WithTooltips = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)',
    maxWidth: '600px'
  }}>
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Labels con Información Adicional
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        
        <Label 
          text="Nombre de usuario" 
          required
          leftIcon="user"
          tooltip="Solo letras, números y guiones. Mínimo 3 caracteres."
        />
        
        <Label 
          text="Contraseña segura" 
          required
          leftIcon="lock"
          variant="primary"
          tooltip="Mínimo 8 caracteres, incluye mayúsculas, minúsculas, números y símbolos."
        />
        
        <Label 
          text="Email de recuperación" 
          optional
          leftIcon="mail"
          variant="secondary"
          tooltip="Se usará para recuperar tu cuenta en caso de olvido de contraseña."
        />
        
        <Label 
          text="Configuración avanzada" 
          leftIcon="settings"
          variant="warning"
          tooltip="Solo modificar si sabes lo que estás haciendo. Puede afectar el funcionamiento."
        />
        
        <Label 
          text="Zona de peligro" 
          leftIcon="alert"
          variant="danger"
          tooltip="Esta acción no se puede deshacer. Todos los datos se perderán permanentemente."
        />
      </div>
    </div>
  </div>
);

// Estados especiales
export const SpecialStates = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estado Normal
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Label text="Campo normal" leftIcon="edit" />
        <Label text="Campo requerido" required leftIcon="star" />
        <Label text="Campo opcional" optional leftIcon="circle" />
      </div>
    </div>

    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estado Deshabilitado
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Label text="Campo deshabilitado" disabled leftIcon="edit" />
        <Label text="Requerido deshabilitado" required disabled leftIcon="star" />
        <Label text="Opcional deshabilitado" optional disabled leftIcon="circle" />
      </div>
    </div>

    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Texto en Negrita
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Label text="Título de sección" bold variant="primary" size="lg" />
        <Label text="Campo importante" bold required leftIcon="star" />
        <Label text="Énfasis especial" bold variant="warning" />
      </div>
    </div>
  </div>
);

// Casos de uso prácticos
export const PracticalExamples = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2xl)',
    padding: 'var(--space-lg)'
  }}>
    {/* Formulario de registro */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Formulario de Registro
      </h3>
      <div style={{ 
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        maxWidth: '400px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          
          <div className="form-field">
            <Label 
              htmlFor="reg-username"
              text="Nombre de usuario" 
              required
              leftIcon="user"
              tooltip="Solo letras, números y guiones"
            />
            <input 
              id="reg-username" 
              type="text" 
              placeholder="tu-usuario"
              style={{ 
                width: '100%',
                padding: 'var(--space-md)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--space-xs)'
              }}
            />
          </div>

          <div className="form-field">
            <Label 
              htmlFor="reg-email"
              text="Email" 
              required
              leftIcon="mail"
              variant="primary"
            />
            <input 
              id="reg-email" 
              type="email" 
              placeholder="tu@email.com"
              style={{ 
                width: '100%',
                padding: 'var(--space-md)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--space-xs)'
              }}
            />
          </div>

          <div className="form-field">
            <Label 
              htmlFor="reg-password"
              text="Contraseña" 
              required
              leftIcon="lock"
              tooltip="Mínimo 8 caracteres, incluye mayúsculas y números"
            />
            <input 
              id="reg-password" 
              type="password" 
              placeholder="••••••••"
              style={{ 
                width: '100%',
                padding: 'var(--space-md)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--space-xs)'
              }}
            />
          </div>

          <div className="form-field">
            <Label 
              htmlFor="reg-phone"
              text="Teléfono" 
              optional
              rightIcon="phone"
              variant="secondary"
            />
            <input 
              id="reg-phone" 
              type="tel" 
              placeholder="+52 55 1234 5678"
              style={{ 
                width: '100%',
                padding: 'var(--space-md)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--space-xs)'
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Configuración con secciones */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Configuración por Secciones
      </h3>
      <div style={{ 
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        maxWidth: '500px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          
          {/* Sección de perfil */}
          <div>
            <Label 
              text="Información de Perfil"
              variant="primary"
              size="lg"
              bold
              leftIcon="user"
              className="label--section"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <Label text="Nombre público" leftIcon="edit" />
              <Label text="Biografía" optional leftIcon="message" />
              <Label text="Sitio web" optional rightIcon="external-link" />
            </div>
          </div>

          {/* Sección de notificaciones */}
          <div>
            <Label 
              text="Notificaciones"
              variant="secondary"
              size="lg"
              bold
              leftIcon="bell"
              className="label--section"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <Label text="Email de notificaciones" leftIcon="mail" />
              <Label text="Notificaciones push" leftIcon="smartphone" />
              <Label text="Resumen semanal" optional leftIcon="calendar" />
            </div>
          </div>

          {/* Sección de peligro */}
          <div>
            <Label 
              text="Zona de Peligro"
              variant="danger"
              size="lg"
              bold
              leftIcon="alert"
              className="label--section"
              tooltip="Estas acciones no se pueden deshacer"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <Label text="Eliminar cuenta" variant="danger" leftIcon="trash" />
              <Label text="Exportar datos" variant="warning" leftIcon="download" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Checkbox y radio examples */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Checkboxes y Radio Buttons
      </h3>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-xl)',
        maxWidth: '600px'
      }}>
        <div>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Checkboxes</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <input type="checkbox" id="terms" />
              <Label 
                htmlFor="terms"
                text="Acepto los términos y condiciones"
                className="label--checkbox"
                rightIcon="external-link"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <input type="checkbox" id="newsletter" />
              <Label 
                htmlFor="newsletter"
                text="Recibir newsletter"
                optional
                className="label--checkbox"
                leftIcon="mail"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Radio Buttons</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <input type="radio" name="plan" id="basic" />
              <Label 
                htmlFor="basic"
                text="Plan Básico"
                className="label--radio"
                leftIcon="circle"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <input type="radio" name="plan" id="premium" />
              <Label 
                htmlFor="premium"
                text="Plan Premium"
                className="label--radio"
                leftIcon="star"
                variant="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Estados del sistema migrado
export const SystemStates = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2xl)',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-primary)'
      }}>
        Estados Estándar del Sistema Migrado
      </h3>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-xl)'
      }}>
        {/* Estado normal */}
        <div>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Estado Normal</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <Label text="Label neutral" variant="neutral" leftIcon="tag" />
            <Label text="Label primary" variant="primary" leftIcon="star" />
            <Label text="Label secondary" variant="secondary" leftIcon="circle" />
          </div>
        </div>

        {/* Estados semánticos */}
        <div>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Estados Semánticos</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <Label text="Validación exitosa" variant="success" leftIcon="check" />
            <Label text="Advertencia importante" variant="warning" leftIcon="alert-triangle" />
            <Label text="Error en campo" variant="danger" leftIcon="alert-circle" />
          </div>
        </div>

        {/* Estados especiales */}
        <div>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Estados del Sistema</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <Label text="Label deshabilitado" variant="primary" disabled leftIcon="lock" />
            <Label text="Estado loading" variant="secondary" loading leftIcon="loader" />
            <Label text="Con tooltip" variant="neutral" tooltip="Información adicional" leftIcon="info" />
          </div>
        </div>
      </div>
    </div>

    {/* Migración y backward compatibility */}
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)',
        color: 'var(--color-warning)'
      }}>
        Migración y Backward Compatibility
      </h3>
      <div style={{ 
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)'
      }}>
        <p style={{ 
          marginBottom: 'var(--space-md)',
          color: 'var(--text-secondary)'
        }}>
          ✅ <strong>Componente migrado al sistema estándar</strong>
        </p>
        <ul style={{ 
          marginLeft: 'var(--space-lg)',
          color: 'var(--text-muted)',
          lineHeight: '1.6'
        }}>
          <li>Hook <code>useLabelProps()</code> integrado</li>
          <li>Props estándar: size, variant, rounded, loading, disabled</li>
          <li>Sistema de iconos unificado (leftIcon/rightIcon)</li>
          <li>Tokens automáticos del design system</li>
          <li>Estados semánticos mejorados</li>
          <li>Backward compatibility con variant=&quot;default&quot; → &quot;neutral&quot;</li>
        </ul>
      </div>
    </div>
  </div>
);