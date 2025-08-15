// molecules/DynamicForm/DynamicForm.stories.jsx
import { useState } from 'react';
import { DynamicForm } from './DynamicForm';
import './DynamicForm.css';

export default {
  title: 'Components/Molecules/DynamicForm',
  component: DynamicForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# DynamicForm - ✅ Migrado al Sistema Estándar

**Sistema de formularios dinámicos totalmente integrado con el sistema de diseño**

## ✅ **Migración Completa:**
- Props estándar (size, variant, rounded, disabled, loading)
- Validación automática con validateStandardProps
- Tokens automáticos de spacing y sizing
- Integración con TextInput y TextSelect migrados
- Herencia de props a todos los campos hijos
- Backward compatibility con deprecation warnings

## 🎯 **Características principales**
- **Props estándar:** size, variant, rounded aplicadas a todos los campos
- **Generación automática:** Crea formularios completos desde configuración
- **Tipos de campo:** text, email, password, number, tel, url, date, select, textarea, checkbox, radio, file, image-crop
- **Layout responsive:** 1-4 columnas que se adaptan automáticamente
- **Validación:** Por tipo de campo y validación personalizada
- **Tokens automáticos:** Spacing, sizing y colores del sistema

## 🔧 **API Estándar del Sistema**
\`\`\`jsx
<DynamicForm
  size="md"              // Tamaño aplicado a todos los campos
  variant="primary"      // Variante aplicada a campos
  rounded="md"           // Border radius aplicado a campos
  disabled={false}       // Deshabilita todo el formulario
  loading={false}        // Estado de carga
  spacing="lg"           // Espaciado entre campos
  fields={fields}
  onSubmit={handleSubmit}
/>
\`\`\`

## 📝 **Configuración de campos con sistema estándar**
\`\`\`jsx
const fields = [
  {
    name: 'email',
    type: 'email',
    label: 'Correo electrónico',
    placeholder: 'tu@ejemplo.com',
    required: true,
    leftIcon: 'mail',      // Iconos del sistema
    helperText: 'Te enviaremos confirmaciones aquí'
  },
  {
    name: 'country',
    type: 'select',
    label: 'País',
    leftIcon: 'globe',     // Sistema de iconos unificado
    options: [
      { value: 'mx', label: 'México' },
      { value: 'us', label: 'Estados Unidos' }
    ]
  }
];
\`\`\`

## 📋 Props del formulario

- \`fields\`: Array de configuración de campos
- \`columnsPerRow\`: Número de columnas (1-4)
- \`fieldSize\`: Tamaño aplicado a todos los campos
- \`onSubmit\`: Función ejecutada al enviar
- \`validateOnChange\`: Validar mientras se escribe
        `
      }
    }
  },
  argTypes: {
    // Props estándar del sistema
    size: {
      name: 'Tamaño',
      description: 'Tamaño aplicado a todos los campos',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    variant: {
      name: 'Variante',
      description: 'Variante aplicada a campos',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'neutral']
    },
    rounded: {
      name: 'Border radius',
      description: 'Border radius aplicado a campos',
      control: 'select', 
      options: ['sm', 'md', 'lg', 'xl', 'full']
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita todo el formulario',
      control: 'boolean'
    },
    loading: {
      name: 'Cargando',
      description: 'Estado de carga del formulario',
      control: 'boolean'
    },
    spacing: {
      name: 'Espaciado',
      description: 'Espaciado entre campos',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    
    // Props específicas del formulario
    fields: {
      name: 'Campos',
      description: 'Array de configuración de campos',
      control: 'object'
    },
    columnsPerRow: {
      name: 'Columnas',
      description: 'Número de columnas en desktop (1-4)',
      control: { type: 'range', min: 1, max: 4, step: 1 }
    },
    compact: {
      name: 'Compacto',
      description: 'Versión compacta del formulario',
      control: 'boolean'
    },
    validateOnChange: {
      name: 'Validar al escribir',
      description: 'Validar campos al cambiar',
      control: 'boolean'
    },
    
    // Props del botón
    submitVariant: {
      name: 'Estilo del botón',
      description: 'Variante del botón de envío',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'neutral']
    },
    submitSize: {
      name: 'Tamaño del botón',
      description: 'Tamaño del botón de envío',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    submitFullWidth: {
      name: 'Botón ancho completo',
      description: 'Hacer el botón de envío ancho completo',
      control: 'boolean'
    }
  }
};

// ========== EJEMPLOS PRINCIPALES ==========

export const Playground = {
  args: {
    // Props estándar del sistema
    size: 'md',
    variant: 'primary',
    rounded: 'md',
    disabled: false,
    loading: false,
    spacing: 'lg',
    
    // Props del formulario
    fields: [
      { 
        name: 'name', 
        label: 'Nombre completo', 
        placeholder: 'Tu nombre...',
        leftIcon: 'user',
        required: true 
      },
      { 
        name: 'email', 
        type: 'email', 
        label: 'Email', 
        placeholder: 'tu@ejemplo.com',
        leftIcon: 'mail',
        required: true 
      },
      {
        name: 'country',
        type: 'select',
        label: 'País',
        placeholder: 'Selecciona tu país',
        leftIcon: 'globe',
        options: [
          { value: 'mx', label: 'México' },
          { value: 'us', label: 'Estados Unidos' },
          { value: 'ca', label: 'Canadá' }
        ]
      }
    ],
    columnsPerRow: 1,
    compact: false,
    validateOnChange: false,
    
    // Props del botón
    submitVariant: 'primary',
    submitSize: 'md',
    submitText: 'Enviar formulario',
    submitFullWidth: false
  }
};

// ========== SISTEMA ESTÁNDAR DEMOS ==========

// Story para demostrar todas las variantes del sistema
export const StandardVariants = () => (
  <div style={{ display: 'grid', gap: 'var(--space-xl)', padding: 'var(--space-lg)' }}>
    <h2>Variantes del Sistema Estándar</h2>
    
    {['primary', 'secondary', 'success', 'danger', 'warning', 'neutral'].map(variant => (
      <div key={variant} style={{ border: '1px solid var(--border-default)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ marginTop: 0, textTransform: 'capitalize' }}>Variant: {variant}</h3>
        <DynamicForm
          variant={variant}
          size="md"
          spacing="md"
          fields={[
            { name: 'input1', label: `Input ${variant}`, placeholder: 'Escribe algo...', leftIcon: 'user' },
            { name: 'select1', type: 'select', label: `Select ${variant}`, leftIcon: 'globe', options: [
              { value: '1', label: 'Opción 1' },
              { value: '2', label: 'Opción 2' }
            ]}
          ]}
          submitVariant={variant}
          submitText={`Botón ${variant}`}
          onSubmit={() => console.log(`Submit ${variant}`)}
        />
      </div>
    ))}
  </div>
);

// Story para demostrar tamaños
export const StandardSizes = () => (
  <div style={{ display: 'grid', gap: 'var(--space-xl)', padding: 'var(--space-lg)' }}>
    <h2>Tamaños del Sistema Estándar</h2>
    
    {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
      <div key={size} style={{ border: '1px solid var(--border-default)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ marginTop: 0 }}>Size: {size}</h3>
        <DynamicForm
          size={size}
          variant="primary"
          spacing="md"
          fields={[
            { name: `input_${size}`, label: `Input ${size}`, placeholder: 'Escribe algo...', leftIcon: 'user' },
            { name: `select_${size}`, type: 'select', label: `Select ${size}`, leftIcon: 'globe', options: [
              { value: '1', label: 'Opción 1' },
              { value: '2', label: 'Opción 2' }
            ]}
          ]}
          submitSize={size}
          submitText={`Botón ${size}`}
          onSubmit={() => console.log(`Submit ${size}`)}
        />
      </div>
    ))}
  </div>
);

// Story para demostrar espaciado
export const StandardSpacing = () => (
  <div style={{ display: 'grid', gap: 'var(--space-xl)', padding: 'var(--space-lg)' }}>
    <h2>Espaciado del Sistema Estándar</h2>
    
    {['xs', 'sm', 'md', 'lg', 'xl'].map(spacing => (
      <div key={spacing} style={{ border: '1px solid var(--border-default)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ marginTop: 0 }}>Spacing: {spacing}</h3>
        <DynamicForm
          size="md"
          variant="primary"
          spacing={spacing}
          fields={[
            { name: `input1_${spacing}`, label: 'Campo 1', placeholder: 'Primer campo', leftIcon: 'user' },
            { name: `input2_${spacing}`, label: 'Campo 2', placeholder: 'Segundo campo', leftIcon: 'mail' },
            { name: `input3_${spacing}`, label: 'Campo 3', placeholder: 'Tercer campo', leftIcon: 'phone' }
          ]}
          submitText={`Espaciado ${spacing}`}
          onSubmit={() => console.log(`Submit spacing ${spacing}`)}
        />
      </div>
    ))}
  </div>
);

// Story para demostrar estados
export const StandardStates = () => (
  <div style={{ display: 'grid', gap: 'var(--space-xl)', padding: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
    <div style={{ border: '1px solid var(--border-default)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ marginTop: 0 }}>Estado Normal</h3>
      <DynamicForm
        size="md"
        variant="primary"
        fields={[
          { name: 'normal1', label: 'Campo normal', placeholder: 'Escribe algo...', leftIcon: 'user' },
          { name: 'normal2', type: 'select', label: 'Select normal', leftIcon: 'globe', options: [{ value: '1', label: 'Opción 1' }] }
        ]}
        submitText="Enviar normal"
        onSubmit={() => console.log('Submit normal')}
      />
    </div>
    
    <div style={{ border: '1px solid var(--border-default)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ marginTop: 0 }}>Estado Loading</h3>
      <DynamicForm
        size="md"
        variant="primary"
        loading={true}
        fields={[
          { name: 'loading1', label: 'Campo loading', placeholder: 'Escribe algo...', leftIcon: 'user' },
          { name: 'loading2', type: 'select', label: 'Select loading', leftIcon: 'globe', options: [{ value: '1', label: 'Opción 1' }] }
        ]}
        submitText="Cargando..."
        onSubmit={() => console.log('Submit loading')}
      />
    </div>
    
    <div style={{ border: '1px solid var(--border-default)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ marginTop: 0 }}>Estado Disabled</h3>
      <DynamicForm
        size="md"
        variant="neutral"
        disabled={true}
        fields={[
          { name: 'disabled1', label: 'Campo disabled', placeholder: 'Escribe algo...', leftIcon: 'user' },
          { name: 'disabled2', type: 'select', label: 'Select disabled', leftIcon: 'globe', options: [{ value: '1', label: 'Opción 1' }] }
        ]}
        submitText="Deshabilitado"
        onSubmit={() => console.log('Submit disabled')}
      />
    </div>
    
    <div style={{ border: '1px solid var(--border-default)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ marginTop: 0 }}>Estado Compact</h3>
      <DynamicForm
        size="sm"
        variant="primary"
        compact={true}
        spacing="sm"
        fields={[
          { name: 'compact1', label: 'Campo compacto', placeholder: 'Escribe algo...', leftIcon: 'user' },
          { name: 'compact2', type: 'select', label: 'Select compacto', leftIcon: 'globe', options: [{ value: '1', label: 'Opción 1' }] }
        ]}
        submitText="Compacto"
        submitSize="sm"
        onSubmit={() => console.log('Submit compact')}
      />
    </div>
  </div>
);

// ========== FORMULARIO DE CONTACTO ==========

export const ContactForm = () => {
  const [, setFormData] = useState({});

  const contactFields = [
    {
      name: 'name',
      label: 'Nombre completo',
      placeholder: 'Tu nombre',
      leftIcon: 'user',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'correo@ejemplo.com',
      leftIcon: 'mail',
      required: true
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Teléfono',
      placeholder: '+52 555 123 4567',
      leftIcon: 'info'
    },
    {
      name: 'subject',
      type: 'select',
      label: 'Asunto',
      placeholder: 'Selecciona un tema',
      leftIcon: 'file',
      required: true,
      options: [
        { value: 'support', label: 'Soporte técnico' },
        { value: 'sales', label: 'Ventas' },
        { value: 'general', label: 'Consulta general' },
        { value: 'feedback', label: 'Comentarios' }
      ]
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Prioridad',
      leftIcon: 'zap',
      options: ['Baja', 'Media', 'Alta', 'Urgente']
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Mensaje',
      placeholder: 'Describe tu consulta...',
      helperText: 'Proporciona todos los detalles relevantes',
      maxLength: 500,
      showCharCount: true,
      width: 'full'
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      label: 'Suscribirse al newsletter',
      helperText: 'Recibe actualizaciones y noticias'
    }
  ];

  return (
    <div style={{ maxWidth: '700px' }}>
      <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-primary)' }}>
        Formulario de Contacto
      </h3>
      
      <DynamicForm
        fields={contactFields}
        columnsPerRow={2}
        mobileColumns={1}
        fieldSize="md"
        fieldRounded="lg"
        onSubmit={(data) => {
          console.log('Datos del formulario:', data);
          alert('¡Mensaje enviado correctamente!');
        }}
        onChange={setFormData}
        validateOnChange
        submitText="Enviar mensaje"
        submitVariant="primary"
        submitSize="lg"
        submitIcon="📤"
      />
    </div>
  );
};

ContactForm.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de formulario de contacto completo con campos de texto, select, textarea y checkbox.'
    }
  }
};

// ========== FORMULARIO DE REGISTRO ==========

export const RegistrationForm = () => {
  const registrationFields = [
    {
      name: 'firstName',
      label: 'Nombre',
      placeholder: 'Tu nombre',
      leftIcon: 'user',
      required: true
    },
    {
      name: 'lastName',
      label: 'Apellido',
      placeholder: 'Tu apellido',
      leftIcon: 'user',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Correo electrónico',
      placeholder: 'tu@ejemplo.com',
      leftIcon: 'mail',
      helperText: 'Será tu usuario de acceso',
      required: true
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Mínimo 8 caracteres',
      leftIcon: 'lock',
      helperText: 'Debe contener mayúsculas, minúsculas y números',
      maxLength: 50,
      showCharCount: true,
      required: true,
      validation: (value) => {
        if (value.length < 8) return 'Mínimo 8 caracteres';
        if (!/(?=.*[a-z])/.test(value)) return 'Necesita una minúscula';
        if (!/(?=.*[A-Z])/.test(value)) return 'Necesita una mayúscula';
        if (!/(?=.*\d)/.test(value)) return 'Necesita un número';
        return true;
      }
    },
    {
      name: 'birthdate',
      type: 'date',
      label: 'Fecha de nacimiento',
      leftIcon: 'date',
      required: true
    },
    {
      name: 'country',
      type: 'select',
      label: 'País',
      placeholder: 'Selecciona tu país',
      leftIcon: 'globe',
      required: true,
      options: [
        { value: 'mx', label: 'México' },
        { value: 'us', label: 'Estados Unidos' },
        { value: 'ca', label: 'Canadá' },
        { value: 'es', label: 'España' },
        { value: 'br', label: 'Brasil' }
      ]
    },
    {
      name: 'profession',
      type: 'select',
      label: 'Profesión',
      placeholder: 'Tu área profesional',
      leftIcon: 'file',
      options: [
        { value: 'developer', label: 'Desarrollador' },
        { value: 'designer', label: 'Diseñador' },
        { value: 'manager', label: 'Gerente' },
        { value: 'student', label: 'Estudiante' },
        { value: 'other', label: 'Otro' }
      ]
    },
    {
      name: 'experience',
      type: 'select',
      label: 'Experiencia',
      leftIcon: 'trending',
      options: ['Sin experiencia', '1-2 años', '3-5 años', '5+ años']
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biografía',
      placeholder: 'Cuéntanos sobre ti...',
      helperText: 'Opcional: una breve descripción personal',
      maxLength: 300,
      showCharCount: true,
      width: 'full'
    },
    {
      name: 'terms',
      type: 'checkbox',
      label: 'Acepto los términos y condiciones',
      required: true
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      label: 'Quiero recibir el newsletter'
    }
  ];

  return (
    <div style={{ maxWidth: '800px' }}>
      <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-primary)' }}>
        Crear Cuenta
      </h3>
      
      <DynamicForm
        fields={registrationFields}
        columnsPerRow={2}
        fieldSize="md"
        fieldRounded="lg"
        onSubmit={(data) => {
          console.log('Datos de registro:', data);
          alert('¡Cuenta creada exitosamente!');
        }}
        validateOnChange
        submitText="Crear cuenta"
        submitVariant="success"
        submitSize="lg"
        submitIcon="🚀"
      />
    </div>
  );
};

RegistrationForm.parameters = {
  docs: {
    description: {
      story: 'Formulario de registro completo con validación personalizada, múltiples tipos de campo y layout de 2 columnas.'
    }
  }
};

// ========== FORMULARIO SIMPLE ==========

export const SimpleForm = () => (
  <div style={{ maxWidth: '400px' }}>
    <DynamicForm
      fields={[
        {
          name: 'search',
          label: 'Buscar',
          placeholder: 'Escribe para buscar...',
          leftIcon: 'search'
        },
        {
          name: 'category',
          type: 'select',
          label: 'Categoría',
          leftIcon: 'folder',
          options: ['Todos', 'Documentos', 'Imágenes', 'Videos']
        }
      ]}
      columnsPerRow={1}
      fieldSize="sm"
      fieldRounded="full"
      submitText="Buscar"
      submitVariant="outline"
      submitSize="sm"
      submitIcon="🔍"
    />
  </div>
);

SimpleForm.parameters = {
  docs: {
    description: {
      story: 'Formulario simple de búsqueda con 2 campos y estilo compacto.'
    }
  }
};

// ========== CONFIGURACIÓN AVANZADA ==========

export const AdvancedConfiguration = () => {
  const [formData, setFormData] = useState({});

  const advancedFields = [
    {
      name: 'projectName',
      label: 'Nombre del proyecto',
      placeholder: 'Mi proyecto increíble',
      leftIcon: 'edit',
      rightIcon: '✅',
      helperText: 'Será visible para todo el equipo',
      maxLength: 100,
      showCharCount: true,
      required: true,
      width: 'full'
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Prioridad',
      leftIcon: 'zap',
      helperText: 'Nivel de urgencia del proyecto',
      required: true,
      options: [
        { value: 'low', label: '🟢 Baja' },
        { value: 'medium', label: '🟡 Media' },
        { value: 'high', label: '🟠 Alta' },
        { value: 'critical', label: '🔴 Crítica' }
      ]
    },
    {
      name: 'assignee',
      type: 'select',
      label: 'Asignado a',
      leftIcon: 'users',
      options: [
        { value: 'juan', label: 'Juan Pérez' },
        { value: 'maria', label: 'María García' },
        { value: 'carlos', label: 'Carlos López' }
      ]
    },
    {
      name: 'dueDate',
      type: 'date',
      label: 'Fecha límite',
      leftIcon: 'date',
      helperText: 'Fecha de entrega esperada'
    },
    {
      name: 'budget',
      type: 'number',
      label: 'Presupuesto',
      placeholder: '10000',
      leftIcon: 'star',
      helperText: 'Presupuesto en pesos mexicanos'
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Describe los objetivos y alcance del proyecto...',
      helperText: 'Detalla los requerimientos y expectativas',
      maxLength: 1000,
      showCharCount: true,
      width: 'full'
    }
  ];

  return (
    <div style={{ maxWidth: '900px' }}>
      <h3 style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-primary)' }}>
        Configuración de Proyecto
      </h3>
      
      <DynamicForm
        fields={advancedFields}
        columnsPerRow={3}
        tabletColumns={2}
        mobileColumns={1}
        fieldSize="lg"
        fieldRounded="xl"
        onSubmit={(data) => {
          console.log('Datos del proyecto:', data);
          alert('¡Proyecto creado exitosamente!');
        }}
        onChange={setFormData}
        validateOnChange
        submitText="Crear proyecto"
        submitVariant="success"
        submitSize="xl"
        submitIcon="🎯"
      />
      
      {Object.keys(formData).length > 0 && (
        <div style={{ 
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-md)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)'
        }}>
          <strong style={{ color: 'var(--text-primary)' }}>Configuración actual:</strong>
          <pre style={{ 
            marginTop: 'var(--space-xs)', 
            color: 'var(--text-secondary)',
            overflow: 'auto'
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

AdvancedConfiguration.parameters = {
  docs: {
    description: {
      story: 'Configuración avanzada con layout de 3 columnas, validación en tiempo real y vista previa de datos.'
    }
  }
};

// Agregar esta story al final del archivo DynamicForm.stories.jsx

// ========== FORMULARIO CON FILEINPUT ==========

export const FormWithFileInputs = () => {
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const movieFormFields = [
    {
      name: 'title',
      type: 'text',
      label: 'Título de la película',
      placeholder: 'Ej: Avatar, Inception, etc.',
      required: true,
      leftIcon: 'film',
      helperText: 'Título original o traducido'
    },
    {
      name: 'year',
      type: 'number',
      label: 'Año de estreno',
      placeholder: '2024',
      required: true,
      leftIcon: 'date',
      helperText: 'Año de lanzamiento original'
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      placeholder: 'Sinopsis de la película...',
      required: true,
      helperText: 'Descripción detallada del contenido',
      maxLength: 500,
      showCharCount: true
    },
    {
      name: 'video',                    // ← NUEVO: Campo de video con FileInput
      type: 'file',
      label: 'Archivo de video',
      accept: 'video/*',
      required: true,
      text: 'Seleccionar archivo de video',
      helperText: 'MP4, WebM, AVI (máx. 100MB)',
      variant: 'default'
    },
    {
      name: 'poster',                   // ← NUEVO: Campo de poster con FileInput
      type: 'file',
      label: 'Poster de la película',
      accept: 'image/*',
      required: false,
      text: 'Subir poster personalizado',
      helperText: 'JPG, PNG, WebP (máx. 5MB)',
      variant: 'default'
    },
    {
      name: 'subtitles',                // ← NUEVO: Múltiples archivos
      type: 'file',
      label: 'Archivos de subtítulos',
      accept: '.srt,.vtt,.ass',
      multiple: true,
      required: false,
      text: 'Seleccionar subtítulos',
      helperText: 'Archivos .srt, .vtt o .ass (opcional)',
      variant: 'default'
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoría',
      required: true,
      leftIcon: 'folder',
      options: [
        { value: 'action', label: 'Acción' },
        { value: 'comedy', label: 'Comedia' },
        { value: 'drama', label: 'Drama' },
        { value: 'horror', label: 'Terror' },
        { value: 'scifi', label: 'Ciencia Ficción' }
      ],
      helperText: 'Selecciona la categoría principal'
    },
    {
      name: 'rating',
      type: 'select',
      label: 'Clasificación',
      required: true,
      leftIcon: 'shield',
      options: [
        { value: 'G', label: 'G - Audiencia General' },
        { value: 'PG', label: 'PG - Guía Parental' },
        { value: 'PG-13', label: 'PG-13 - Mayores de 13' },
        { value: 'R', label: 'R - Restringida' },
        { value: 'NC-17', label: 'NC-17 - Solo Adultos' }
      ],
      helperText: 'Clasificación por edad'
    }
  ];

  const handleSubmit = (data) => {

    // Mostrar información detallada de archivos
    if (data.video) {
      console.log('Video seleccionado:', data.video.name);
    }
    
    if (data.poster) {
      console.log('Poster seleccionado:', data.poster.name);
    }
    
    if (data.subtitles && data.subtitles.length > 0) {
      console.log('Subtítulos seleccionados:', data.subtitles.length);
    }

    // Simular creación de FormData para backend
    const formDataToSend = new FormData();
    
    // Agregar campos regulares
    Object.keys(data).forEach(key => {
      if (data[key] && !['video', 'poster', 'subtitles'].includes(key)) {
        formDataToSend.append(key, data[key]);
      }
    });
    
    // Agregar archivos
    if (data.video) {
      formDataToSend.append('video', data.video);
    }
    
    if (data.poster) {
      formDataToSend.append('poster', data.poster);
    }
    
    if (data.subtitles && data.subtitles.length > 0) {
      data.subtitles.forEach((file, index) => {
        formDataToSend.append(`subtitle_${index}`, file);
      });
    }

    setSubmittedData(data);
  };

  const handleChange = (data) => {
    setFormData(data);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        marginBottom: 'var(--space-xl)',
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)'
      }}>
        <h3 style={{ 
          margin: '0 0 var(--space-md) 0', 
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-xl)'
        }}>
          🎬 Formulario de Película con FileInput
        </h3>
        <p style={{ 
          margin: '0', 
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-base)',
          lineHeight: 'var(--line-height-relaxed)'
        }}>
          Este ejemplo demuestra la integración de <strong>FileInput</strong> en <strong>DynamicForm</strong>. 
          Incluye campos para video, poster e múltiples subtítulos, todos manejados automáticamente por la configuración.
        </p>
      </div>

      <DynamicForm
        fields={movieFormFields}
        onSubmit={handleSubmit}
        onChange={handleChange}
        columnsPerRow={2}
        tabletColumns={1}
        mobileColumns={1}
        fieldSize="lg"
        fieldRounded="md"
        submitText="Crear Película"
        submitVariant="primary"
        submitSize="lg"
        validateOnBlur={true}
        validateOnChange={false}
      />

      {/* Información en tiempo real */}
      {Object.keys(formData).length > 0 && (
        <div style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-lg)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)'
        }}>
          <h4 style={{ 
            margin: '0 0 var(--space-md) 0',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-lg)'
          }}>
            📊 Estado actual del formulario
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-md)'
          }}>
            {/* Info de archivos */}
            {formData.video && (
              <div style={{
                padding: 'var(--space-sm)',
                backgroundColor: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-primary)'
              }}>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  📹 Video: {formData.video.name}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                  {(formData.video.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            )}
            
            {formData.poster && (
              <div style={{
                padding: 'var(--space-sm)',
                backgroundColor: 'var(--color-success-light)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-success)'
              }}>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  🖼️ Poster: {formData.poster.name}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                  {(formData.poster.size / 1024).toFixed(1)} KB
                </div>
              </div>
            )}
            
            {formData.subtitles && formData.subtitles.length > 0 && (
              <div style={{
                padding: 'var(--space-sm)',
                backgroundColor: 'var(--color-warning-light)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-warning)'
              }}>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  📝 Subtítulos: {formData.subtitles.length} archivos
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                  {formData.subtitles.map(f => f.name).join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* JSON del formulario */}
          <details style={{ marginTop: 'var(--space-md)' }}>
            <summary style={{ 
              cursor: 'pointer', 
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-sm)'
            }}>
              🔍 Ver datos JSON completos
            </summary>
            <pre style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-primary)',
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(
                Object.fromEntries(
                  Object.entries(formData).map(([key, value]) => [
                    key,
                    value instanceof File 
                      ? `[File: ${value.name}]`
                      : Array.isArray(value) && value.every(v => v instanceof File)
                      ? `[${value.length} Files: ${value.map(f => f.name).join(', ')}]`
                      : value
                  ])
                ),
                null,
                2
              )}
            </pre>
          </details>
        </div>
      )}

      {/* Resultado de envío */}
      {submittedData && (
        <div style={{
          marginTop: 'var(--space-lg)',
          padding: 'var(--space-lg)',
          backgroundColor: 'var(--color-success-light)',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--color-success)'
        }}>
          <h4 style={{ 
            margin: '0 0 var(--space-sm) 0',
            color: 'var(--color-success-dark)',
            fontSize: 'var(--font-size-lg)'
          }}>
            ✅ Película enviada correctamente
          </h4>
          <p style={{ 
            margin: '0',
            color: 'var(--color-success-dark)',
            fontSize: 'var(--font-size-sm)'
          }}>
            Revisa la consola del navegador para ver los detalles completos del envío, 
            incluyendo la información de archivos y el FormData preparado.
          </p>
        </div>
      )}
    </div>
  );
};

FormWithFileInputs.parameters = {
  docs: {
    description: {
      story: `
**Formulario avanzado con FileInput integrado**

Este ejemplo demuestra cómo usar FileInput dentro de DynamicForm para crear formularios complejos con subida de archivos.

**Características:**
- **Video**: Archivo individual requerido (video/*)
- **Poster**: Imagen opcional (image/*)  
- **Subtítulos**: Múltiples archivos (.srt, .vtt, .ass)
- **Validación**: Automática por tipo de archivo
- **Preview**: Información en tiempo real de archivos seleccionados
- **Backend ready**: FormData preparado para envío

**Configuración de campo file:**
\`\`\`javascript
{
  name: 'video',
  type: 'file',           // ← Tipo especial
  accept: 'video/*',      // ← Tipos MIME
  multiple: false,        // ← Archivo único
  required: true,         // ← Validación
  text: 'Seleccionar video',
  helperText: 'MP4, WebM (máx. 100MB)'
}
\`\`\`
      `
    }
  }
};

export const WithCheckboxes = () => {
  const [formData, setFormData] = useState({});

  const checkboxFields = [
    {
      name: 'email',
      type: 'email',
      label: 'Correo electrónico',
      placeholder: 'tu@ejemplo.com',
      required: true,
      helperText: 'Te enviaremos confirmaciones aquí'
    },
    {
      name: 'acceptTerms',
      type: 'checkbox',
      label: 'Acepto los términos y condiciones',
      helperText: 'Es necesario para continuar',
      required: true
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      label: 'Suscribirse al newsletter',
      helperText: 'Recibe actualizaciones semanales',
      required: false,
      defaultValue: false
    },
    {
      name: 'marketing',
      type: 'checkbox',
      label: 'Comunicaciones de marketing',
      helperText: 'Ofertas y promociones especiales',
      required: false,
      defaultValue: true
    },
    {
      name: 'notifications',
      type: 'checkbox',
      label: 'Notificaciones push',
      helperText: 'Alertas en tiempo real',
      required: false,
      size: 'sm' // Tamaño específico
    }
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <DynamicForm
        fields={checkboxFields}
        onSubmit={(data) => {
          console.log('Datos del checkbox:', data);
          alert('Formulario enviado! Revisa la consola.');
        }}
        onChange={setFormData}
        fieldSize="md"
        submitText="Crear cuenta"
        submitVariant="primary"
      />
      
      <div style={{ 
        marginTop: 'var(--space-xl)', 
        padding: 'var(--space-md)', 
        backgroundColor: 'var(--bg-secondary)', 
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)'
      }}>
        <strong>Estado actual:</strong>
        <pre style={{ 
          marginTop: 'var(--space-xs)', 
          color: 'var(--text-muted)',
          fontSize: 'var(--font-size-xs)'
        }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

WithCheckboxes.parameters = {
  docs: {
    description: {
      story: `
### Formulario con Checkboxes

Demuestra el uso del nuevo componente Checkbox integrado en DynamicForm:

- ✅ **Componente Checkbox**: Usa el átomo Checkbox del sistema de diseño
- ✅ **Diferentes configuraciones**: required, helperText, defaultValue
- ✅ **Tamaños**: Se puede especificar tamaño por campo o heredar del formulario
- ✅ **Estados**: Error, focus, disabled según configuración
- ✅ **Validación**: Campos requeridos con mensajes de error

**Configuración de ejemplo:**
\`\`\`jsx
{
  name: 'acceptTerms',
  type: 'checkbox',
  label: 'Acepto los términos y condiciones',
  helperText: 'Es necesario para continuar',
  required: true,
  size: 'md' // Opcional: override del tamaño global
}
\`\`\`
      `
    }
  }
};

// ===== STORY PARA DIFERENTES TAMAÑOS DE CHECKBOX =====
export const CheckboxSizes = () => {
  const sizeFields = [
    {
      name: 'xs_checkbox',
      type: 'checkbox',
      label: 'Checkbox Extra Pequeño (xs)',
      size: 'xs',
      helperText: 'Tamaño xs'
    },
    {
      name: 'sm_checkbox',
      type: 'checkbox',
      label: 'Checkbox Pequeño (sm)',
      size: 'sm',
      helperText: 'Tamaño sm'
    },
    {
      name: 'md_checkbox',
      type: 'checkbox',
      label: 'Checkbox Mediano (md)',
      size: 'md',
      helperText: 'Tamaño md (por defecto)'
    },
    {
      name: 'lg_checkbox',
      type: 'checkbox',
      label: 'Checkbox Grande (lg)',
      size: 'lg',
      helperText: 'Tamaño lg'
    }
  ];

  return (
    <div style={{ maxWidth: '500px' }}>
      <DynamicForm
        fields={sizeFields}
        columnsPerRow={1}
        submitText="Probar tamaños"
      />
    </div>
  );
};

// ===== STORY PARA ESTADOS DE ERROR =====
export const CheckboxValidation = () => {
  const validationFields = [
    {
      name: 'required_checkbox',
      type: 'checkbox',
      label: 'Campo requerido',
      required: true,
      helperText: 'Debes marcar esta opción'
    },
    {
      name: 'optional_checkbox',
      type: 'checkbox',
      label: 'Campo opcional',
      required: false,
      helperText: 'Esta opción es opcional'
    }
  ];

  return (
    <div style={{ maxWidth: '500px' }}>
      <DynamicForm
        fields={validationFields}
        validateOnBlur={true}
        submitText="Validar campos"
      />
      
      <div style={{ 
        marginTop: 'var(--space-lg)',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--bg-warning-light)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)'
      }}>
        💡 <strong>Prueba la validación:</strong><br/>
        Intenta enviar sin marcar el campo requerido para ver el mensaje de error.
      </div>
    </div>
  );
};