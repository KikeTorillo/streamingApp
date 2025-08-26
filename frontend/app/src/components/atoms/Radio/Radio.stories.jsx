// components/atoms/Radio/Radio.stories.jsx
import { useState } from 'react';
import { Radio } from './Radio';

export default {
  title: 'Components/Atoms/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Radio - SISTEMA DE DISEÑO V2.0 ✅

## 🎯 CARACTERÍSTICAS V2.0
- **Hook useInteractiveProps()**: Integrado ✅
- **Props estándar**: size, variant, rounded, loading, disabled ✅  
- **6 Variantes semánticas**: primary, secondary, success, warning, danger, neutral ✅
- **5 Tamaños estándar**: xs, sm, md, lg, xl ✅
- **Estados loading/disabled**: Spinner integrado + overlays ✅
- **Sistema de iconos**: leftIcon, rightIcon con renderIcon ✅
- **Design tokens**: Automáticos con CSS custom properties ✅
- **Formularios**: Integración completa con name/value/grupos ✅

## 🔘 Características Específicas de Radio

- **Agrupación**: Soporte completo para grupos de radio con name común
- **Accesibilidad completa**: ARIA, navegación teclado, screen readers
- **Responsive**: Área táctil optimizada móvil (44px mínimo)
- **Performance**: Memoización automática + CSS optimizado
- **Validación**: Estados de error con mensajes y helper text
- **Círculo perfecto**: Border-radius 50% automático para forma circular

## 🎨 Estados Visuales Únicos

- **Loading state**: Spinner animado reemplaza el dot interno
- **Error state**: Bordes rojos y mensajes de error elegantes
- **Hover effects**: Escala y sombras suaves para mejor feedback
- **Focus management**: Outlines claros para navegación por teclado
        `
      }
    }
  },
  argTypes: {
    // Props estándar del sistema
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del radio button (5 tamaños estándar)'
    },
    variant: {
      control: 'select', 
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante semántica del radio button (6 variantes)'
    },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes (full por defecto para círculo perfecto)'
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita el radio button'
    },
    loading: {
      control: 'boolean',
      description: 'Muestra spinner de carga'
    },
    
    // Props específicas de Radio
    checked: {
      control: 'boolean',
      description: 'Estado seleccionado del radio'
    },
    label: {
      control: 'text',
      description: 'Texto del label asociado'
    },
    helperText: {
      control: 'text',
      description: 'Texto de ayuda debajo del radio'
    },
    error: {
      control: 'text',
      description: 'Mensaje de error (sobrescribe helperText)'
    },
    name: {
      control: 'text',
      description: 'Nombre del grupo de radio buttons (requerido)'
    },
    value: {
      control: 'text',
      description: 'Valor único del radio button (requerido)'
    },
    required: {
      control: 'boolean',
      description: 'Marca el radio como requerido'
    },
    leftIcon: {
      control: 'text',
      description: 'Icono a la izquierda del label'
    },
    rightIcon: {
      control: 'text',
      description: 'Icono a la derecha del label'
    }
  }
};

// ===== HISTORIAS BÁSICAS =====

export const Default = {
  args: {
    name: 'default-group',
    value: 'option1',
    label: 'Opción por defecto',
    checked: false
  }
};

export const Checked = {
  args: {
    name: 'checked-group', 
    value: 'option1',
    label: 'Opción seleccionada',
    checked: true
  }
};

// ===== TAMAÑOS ESTÁNDAR =====

export const Sizes = () => {
  const [selected, setSelected] = useState('md');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Tamaños Estándar (5 opciones)</h3>
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
        <Radio
          key={size}
          name="size-demo"
          value={size}
          size={size}
          label={`Tamaño ${size.toUpperCase()}`}
          checked={selected === size}
          onChange={() => setSelected(size)}
        />
      ))}
    </div>
  );
};

// ===== VARIANTES SEMÁNTICAS =====

export const Variants = () => {
  const [selected, setSelected] = useState('primary');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Variantes Semánticas (6 opciones)</h3>
      {[
        { key: 'primary', label: 'Primary - Acción principal' },
        { key: 'secondary', label: 'Secondary - Acción secundaria' },
        { key: 'success', label: 'Success - Confirmación exitosa' },
        { key: 'warning', label: 'Warning - Advertencia importante' },
        { key: 'danger', label: 'Danger - Acción destructiva' },
        { key: 'neutral', label: 'Neutral - Opción neutral' }
      ].map(({ key, label }) => (
        <Radio
          key={key}
          name="variant-demo"
          value={key}
          variant={key}
          label={label}
          checked={selected === key}
          onChange={() => setSelected(key)}
        />
      ))}
    </div>
  );
};

// ===== ESTADOS ESPECIALES =====

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <h3>Estados Especiales</h3>
    
    <div>
      <h4>Loading State</h4>
      <Radio
        name="loading-demo"
        value="loading"
        label="Radio con spinner de carga"
        loading={true}
        checked={true}
      />
    </div>
    
    <div>
      <h4>Disabled States</h4>
      <Radio
        name="disabled-demo-1"
        value="disabled-unchecked"
        label="Radio deshabilitado (sin seleccionar)"
        disabled={true}
        checked={false}
      />
      <Radio
        name="disabled-demo-2"
        value="disabled-checked"
        label="Radio deshabilitado (seleccionado)"
        disabled={true}
        checked={true}
      />
    </div>
    
    <div>
      <h4>Error State</h4>
      <Radio
        name="error-demo"
        value="error"
        label="Radio con error"
        error="Este campo tiene un error"
        variant="danger"
      />
    </div>
    
    <div>
      <h4>Required Field</h4>
      <Radio
        name="required-demo"
        value="required"
        label="Campo requerido"
        required={true}
        helperText="Este campo es obligatorio"
      />
    </div>
  </div>
);

// ===== CON ICONOS =====

export const WithIcons = () => {
  const [selected, setSelected] = useState('email');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>Radio Buttons con Iconos</h3>
      
      <Radio
        name="contact-method"
        value="email"
        label="Contactar por email"
        leftIcon="mail"
        checked={selected === 'email'}
        onChange={() => setSelected('email')}
        helperText="Recibirás notificaciones por email"
      />
      
      <Radio
        name="contact-method"
        value="sms"
        label="Contactar por SMS"
        leftIcon="message-circle"
        checked={selected === 'sms'}
        onChange={() => setSelected('sms')}
        helperText="Recibirás mensajes de texto"
      />
      
      <Radio
        name="contact-method"
        value="phone"
        label="Llamada telefónica"
        leftIcon="phone"
        rightIcon="external-link"
        checked={selected === 'phone'}
        onChange={() => setSelected('phone')}
        helperText="Te llamaremos directamente"
      />
    </div>
  );
};

// ===== CASOS DE USO REALES =====

export const PaymentMethods = () => {
  const [selectedPayment, setSelectedPayment] = useState('card');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <h3>Métodos de Pago</h3>
      
      <Radio
        name="payment-method"
        value="card"
        label="Tarjeta de crédito/débito"
        leftIcon="credit-card"
        variant="primary"
        checked={selectedPayment === 'card'}
        onChange={() => setSelectedPayment('card')}
        helperText="Visa, MasterCard, American Express"
      />
      
      <Radio
        name="payment-method" 
        value="paypal"
        label="PayPal"
        leftIcon="dollar-sign"
        variant="secondary"
        checked={selectedPayment === 'paypal'}
        onChange={() => setSelectedPayment('paypal')}
        helperText="Pago seguro con tu cuenta PayPal"
      />
      
      <Radio
        name="payment-method"
        value="transfer"
        label="Transferencia bancaria"
        leftIcon="arrow-right-circle"
        variant="neutral"
        checked={selectedPayment === 'transfer'}
        onChange={() => setSelectedPayment('transfer')}
        helperText="Procesamiento en 1-3 días hábiles"
      />
      
      <Radio
        name="payment-method"
        value="crypto"
        label="Criptomonedas"
        leftIcon="trending-up"
        variant="warning"
        checked={selectedPayment === 'crypto'}
        onChange={() => setSelectedPayment('crypto')}
        helperText="Bitcoin, Ethereum (experimental)"
      />
    </div>
  );
};

export const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '450px' }}>
      <h3>Planes de Suscripción</h3>
      
      <Radio
        name="subscription-plan"
        value="free"
        label="Plan Gratuito"
        variant="neutral"
        size="lg"
        checked={selectedPlan === 'free'}
        onChange={() => setSelectedPlan('free')}
        helperText="Acceso limitado • Sin soporte técnico"
      />
      
      <Radio
        name="subscription-plan"
        value="basic"
        label="Plan Básico - $9.99/mes"
        variant="primary"
        size="lg"
        leftIcon="user"
        checked={selectedPlan === 'basic'}
        onChange={() => setSelectedPlan('basic')}
        helperText="Funciones básicas • Soporte por email"
      />
      
      <Radio
        name="subscription-plan"
        value="pro"
        label="Plan Pro - $19.99/mes"
        variant="success"
        size="lg"
        leftIcon="star"
        rightIcon="trending-up"
        checked={selectedPlan === 'pro'}
        onChange={() => setSelectedPlan('pro')}
        helperText="Todas las funciones • Soporte prioritario • Más recomendado"
      />
      
      <Radio
        name="subscription-plan"
        value="enterprise"
        label="Plan Enterprise - Contactar"
        variant="warning"
        size="lg"
        leftIcon="briefcase"
        checked={selectedPlan === 'enterprise'}
        onChange={() => setSelectedPlan('enterprise')}
        helperText="Solución personalizada • Soporte 24/7 • SLA garantizado"
      />
    </div>
  );
};

export const UserPreferences = () => {
  const [theme, setTheme] = useState('auto');
  const [notifications, setNotifications] = useState('important');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '400px' }}>
      <div>
        <h3>Tema de la aplicación</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Radio
            name="theme-preference"
            value="light"
            label="Tema claro"
            leftIcon="sun"
            variant="warning"
            checked={theme === 'light'}
            onChange={() => setTheme('light')}
          />
          
          <Radio
            name="theme-preference"
            value="dark"
            label="Tema oscuro"
            leftIcon="moon"
            variant="neutral"
            checked={theme === 'dark'}
            onChange={() => setTheme('dark')}
          />
          
          <Radio
            name="theme-preference"
            value="auto"
            label="Automático (seguir sistema)"
            leftIcon="monitor"
            variant="primary"
            checked={theme === 'auto'}
            onChange={() => setTheme('auto')}
            helperText="Cambia según la configuración del sistema"
          />
        </div>
      </div>
      
      <div>
        <h3>Frecuencia de notificaciones</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Radio
            name="notification-preference"
            value="all"
            label="Todas las notificaciones"
            leftIcon="bell"
            variant="primary"
            checked={notifications === 'all'}
            onChange={() => setNotifications('all')}
            helperText="Recibir todas las actualizaciones"
          />
          
          <Radio
            name="notification-preference"
            value="important"
            label="Solo importantes"
            leftIcon="bell-ring"
            variant="success"
            checked={notifications === 'important'}
            onChange={() => setNotifications('important')}
            helperText="Solo notificaciones críticas y actualizaciones importantes"
          />
          
          <Radio
            name="notification-preference"
            value="none"
            label="Sin notificaciones"
            leftIcon="bell-off"
            variant="neutral"
            checked={notifications === 'none'}
            onChange={() => setNotifications('none')}
            helperText="No recibir ninguna notificación"
          />
        </div>
      </div>
    </div>
  );
};

// ===== PLAYGROUND INTERACTIVO =====

export const InteractivePlayground = {
  args: {
    name: 'playground-group',
    value: 'playground-option',
    label: 'Radio button de prueba',
    helperText: 'Texto de ayuda personalizable',
    size: 'md',
    variant: 'primary',
    rounded: 'full',
    checked: false,
    disabled: false,
    loading: false,
    required: false,
    leftIcon: '',
    rightIcon: '',
    error: ''
  },
  parameters: {
    docs: {
      description: {
        story: `
### Playground Interactivo

Utiliza los controles debajo para probar todas las combinaciones de props disponibles en el componente Radio.

**Casos de prueba sugeridos:**
- Cambia entre diferentes tamaños (xs a xl)
- Prueba todas las variantes semánticas
- Activa loading para ver el spinner
- Agrega iconos como "user", "star", "check"
- Activa error para ver el estado de validación
        `
      }
    }
  }
};