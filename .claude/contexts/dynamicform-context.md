# DynamicForm Context - Streaming App

> 🔧 **Propósito**: Este documento proporciona el contexto completo del componente DynamicForm, el generador de formularios más complejo del proyecto, para facilitar su uso correcto, debugging y extensión.

## 🎯 Visión General

### Qué es DynamicForm
DynamicForm es un **generador automático de formularios** basado en configuración JSON que:
- ✅ **Orquesta componentes** del design system (TextInput, TextSelect, Button, Checkbox)
- ✅ **Genera layouts responsivos** automáticamente (1-4 columnas)
- ✅ **Maneja validación** por tipo de campo y personalizada
- ✅ **Integra funciones avanzadas** como file upload, image cropping, TMDB search

### Nivel de Complejidad
- **Atomic Design**: Molecule (orquesta atoms y otras molecules)
- **Complejidad**: Alta - 9 tipos de campo, validación compleja, responsive grid
- **Ubicación**: `/frontend/app/src/components/molecules/DynamicForm/`

## 📋 Tipos de Campo Soportados

### **text** - Input básico de texto
```jsx
{
  name: "title",
  type: "text",
  label: "Título",
  placeholder: "Ingresa el título",
  required: true,
  leftIcon: "🎬",
  rightIcon: "📝",
  helperText: "Mínimo 3 caracteres"
}
```

### **email** - Input con validación de email
```jsx
{
  name: "email",
  type: "email",
  label: "Correo Electrónico",
  placeholder: "usuario@dominio.com",
  required: true,
  leftIcon: "📧"
}
// Validación automática de formato email
```

### **password** - Input de contraseña con toggle
```jsx
{
  name: "password",
  type: "password",
  label: "Contraseña",
  placeholder: "Mínimo 8 caracteres",
  required: true,
  minLength: 8,
  leftIcon: "🔒"
}
// Toggle automático de visibilidad
```

### **number** - Input numérico con validación
```jsx
{
  name: "year",
  type: "number",
  label: "Año de Lanzamiento",
  placeholder: "2023",
  required: true,
  min: 1900,
  max: 2030,
  leftIcon: "📅"
}
// Validación automática de rango
```

### **select** - Dropdown usando TextSelect
```jsx
{
  name: "genre",
  type: "select",
  label: "Género",
  required: true,
  leftIcon: "🎭",
  placeholder: "Selecciona un género",
  options: [
    { value: "action", label: "Acción" },
    { value: "comedy", label: "Comedia" },
    { value: "drama", label: "Drama" }
  ]
}
// OBLIGATORIO: Array de options con value/label
```

### **textarea** - Área de texto multilínea
```jsx
{
  name: "overview",
  type: "textarea",
  label: "Descripción",
  placeholder: "Describe la película...",
  required: true,
  rows: 4,
  maxLength: 500
}
```

### **checkbox** - Casilla de verificación
```jsx
{
  name: "featured",
  type: "checkbox",
  label: "Contenido destacado",
  required: false
}
// Usa el componente Checkbox atom
```

### **file** - Upload de archivos
```jsx
{
  name: "poster",
  type: "file",
  label: "Poster",
  required: true,
  accept: "image/*",
  multiple: false
}
// Se integra con FileInputField molecule
```

### **imagecrop** - Upload + recorte de imágenes
```jsx
{
  name: "poster",
  type: "imagecrop",
  label: "Poster (será recortado)",
  required: true,
  cropAspectRatio: 2/3,
  accept: "image/*"
}
// Se integra con ImageCropField molecule
```

## 🏗️ Props del Componente

### **Props Obligatorias**
```jsx
// Configuración de campos (OBLIGATORIO)
fields: Array // Array de objetos de configuración de campos

// Callback de envío (OBLIGATORIO)  
onSubmit: Function // (formData) => { /* manejar datos */ }
```

### **Props de Layout**
```jsx
// Control de columnas
columnsPerRow: number = 1        // Columnas en desktop (1-4)
tabletColumns: number = 2        // Columnas en tablet (768px+)
mobileColumns: number = 1        // Columnas en móvil (<768px)
responsive: boolean = true       // Si adapta automáticamente

// Estado del formulario
loading: boolean = false         // Estado de carga
disabled: boolean = false        // Todo el formulario deshabilitado
compact: boolean = false         // Versión compacta
```

### **Props de Validación**
```jsx
// Control de validación
validateOnChange: boolean = false  // Validar al escribir
validateOnBlur: boolean = true     // Validar al perder foco
initialData: Object = {}           // Datos iniciales del formulario

// Callbacks
onChange: Function = () => {}      // (formData) => { /* al cambiar */ }
```

### **Props del Design System**
```jsx
// Para todos los campos (hereda a TextInput, TextSelect, etc.)
fieldSize: 'xs'|'sm'|'md'|'lg'|'xl' = 'md'
fieldRounded: 'sm'|'md'|'lg'|'xl'|'full' = 'md'

// Para el botón de submit
submitVariant: 'primary'|'secondary'|'success'|'danger'|'outline'|'ghost'|'warning' = 'primary'
submitSize: 'xs'|'sm'|'md'|'lg'|'xl' = 'md'
submitRounded: 'sm'|'md'|'lg'|'xl'|'full' = 'md'
submitText: string = 'Enviar'
submitIcon: ReactNode
submitFullWidth: boolean = false
```

## 🎨 Layout Responsivo

### **Sistema de Columnas**
```jsx
// Mobile First - Se adapta automáticamente
const responsiveConfig = {
  mobileColumns: 1,     // < 768px
  tabletColumns: 2,     // 768px - 1024px  
  columnsPerRow: 3,     // > 1024px
  responsive: true      // Activa adaptación automática
};

// CSS Grid automático
.dynamic-form {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: var(--space-lg);
}
```

### **Breakpoints del Sistema**
```css
/* Mobile: < 768px */
@media (max-width: 767px) {
  grid-template-columns: repeat(1, 1fr);
}

/* Tablet: 768px - 1024px */
@media (min-width: 768px) and (max-width: 1023px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop: > 1024px */
@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);
}
```

## 🔍 Validación Avanzada

### **Validación por Tipo**
```jsx
// Automática según tipo de campo
const fieldValidations = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : "Email inválido";
  },
  
  number: (value, field) => {
    const num = Number(value);
    if (field.min && num < field.min) return `Mínimo ${field.min}`;
    if (field.max && num > field.max) return `Máximo ${field.max}`;
    return null;
  },
  
  password: (value, field) => {
    if (field.minLength && value.length < field.minLength) {
      return `Mínimo ${field.minLength} caracteres`;
    }
    return null;
  }
};
```

### **Validación Personalizada**
```jsx
// Función de validación personalizada en el campo
{
  name: "username",
  type: "text",
  label: "Nombre de Usuario",
  validation: (value, allFormData) => {
    // Validación custom
    if (value.length < 3) return "Mínimo 3 caracteres";
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Solo letras, números y guión bajo";
    return null; // Sin error
  }
}

// Validación async (para checks de disponibilidad)
{
  name: "email",
  type: "email", 
  validation: async (value) => {
    if (!value) return null;
    const isAvailable = await checkEmailAvailability(value);
    return isAvailable ? null : "Email ya está en uso";
  }
}
```

## 🏭 Casos de Uso Reales

### **MovieCreatePage** - Complejo (15+ campos)
```jsx
const movieFields = [
  { name: "title", type: "text", label: "Título", required: true },
  { name: "overview", type: "textarea", label: "Descripción", rows: 4 },
  { name: "release_date", type: "date", label: "Fecha de Lanzamiento" },
  { 
    name: "genre_ids", 
    type: "select", 
    label: "Géneros", 
    multiple: true,
    options: genreOptions 
  },
  { 
    name: "poster", 
    type: "imagecrop", 
    label: "Poster", 
    cropAspectRatio: 2/3 
  }
];

// Funciones especiales: TMDB integration, Image cropping
```

### **SeriesCreatePage** - Complejo (Serie + temporadas)
```jsx
const seriesFields = [
  { name: "name", type: "text", label: "Nombre de la Serie" },
  { name: "first_air_date", type: "date", label: "Primera Emisión" },
  { name: "number_of_seasons", type: "number", label: "Temporadas", min: 1 },
  { name: "number_of_episodes", type: "number", label: "Episodios", min: 1 }
];

// Funciones especiales: Season management, Episode association
```

### **UserCreatePage** - Medio (Usuario + roles)
```jsx
const userFields = [
  { name: "username", type: "text", label: "Usuario", required: true },
  { name: "email", type: "email", label: "Correo" },
  { name: "password", type: "password", label: "Contraseña", minLength: 8 },
  { 
    name: "role", 
    type: "select", 
    label: "Rol", 
    options: [
      { value: "admin", label: "Administrador" },
      { value: "user", label: "Usuario" }
    ]
  },
  { name: "active", type: "checkbox", label: "Usuario Activo" }
];
```

### **EpisodeCreatePage** - Complejo (Metadata + video)
```jsx
const episodeFields = [
  { name: "name", type: "text", label: "Nombre del Episodio" },
  { name: "episode_number", type: "number", label: "Número", min: 1 },
  { name: "season_number", type: "number", label: "Temporada", min: 1 },
  { name: "overview", type: "textarea", label: "Sinopsis" },
  { name: "video_file", type: "file", label: "Archivo de Video", accept: "video/*" }
];

// Funciones especiales: Video file upload, Series association
```

## 🐛 Problemas Comunes y Soluciones

### **❌ Problema: Validación no funciona**
```jsx
// INCORRECTO
{
  name: "email",
  validation: (value) => {
    return value.includes("@"); // ❌ Retorna boolean
  }
}

// CORRECTO  
{
  name: "email",
  validation: (value) => {
    return value.includes("@") ? null : "Email inválido"; // ✅ null o string
  }
}

// DEBUGGING
// 1. Verificar que validation retorna null (sin error) o string (con error)
// 2. Comprobar validateOnChange/validateOnBlur están habilitados
// 3. Testear con validación simple primero
```

### **❌ Problema: Columnas responsivas no funcionan**
```jsx
// INCORRECTO
<DynamicForm
  fields={fields}
  columnsPerRow={3}
  responsive={false} // ❌ Deshabilitado
/>

// CORRECTO
<DynamicForm
  fields={fields}
  columnsPerRow={3}
  tabletColumns={2}
  mobileColumns={1}
  responsive={true} // ✅ Habilitado
/>

// DEBUGGING
// 1. Verificar responsive=true
// 2. Comprobar que no hay CSS custom sobreescribiendo
// 3. Testear en diferentes tamaños de pantalla
```

### **❌ Problema: Props no pasan a TextInput/TextSelect**
```jsx
// INCORRECTO - Props mezclados
<DynamicForm
  fieldSize="lg"        // ✅ Component-level: afecta TODOS los campos
  fields={[
    { 
      name: "title", 
      size: "sm"          // ❌ Field-level: no funciona así
    }
  ]}
/>

// CORRECTO - Estructura apropiada
<DynamicForm
  fieldSize="lg"        // ✅ Todos los campos lg por defecto
  fields={[
    { 
      name: "title",
      // Field-level props van en el objeto field directamente
      leftIcon: "🎬",
      placeholder: "Título personalizado"
    }
  ]}
/>

// DEBUGGING
// 1. Component-level props afectan TODOS los campos
// 2. Field-level props afectan solo ese campo específico
// 3. Verificar nombres de props según design system
```

### **❌ Problema: File uploads no funcionan**
```jsx
// INCORRECTO
{
  name: "poster",
  type: "text",          // ❌ Tipo incorrecto
  accept: "image/*"
}

// CORRECTO
{
  name: "poster", 
  type: "file",          // ✅ o "imagecrop" para recorte
  accept: "image/*",
  required: true
}

// En onSubmit - manejar archivos
const handleSubmit = (formData) => {
  const file = formData.poster; // File object
  const formDataToSend = new FormData();
  formDataToSend.append('poster', file);
  // ... enviar al servidor
};

// DEBUGGING
// 1. Verificar type="file" o type="imagecrop"
// 2. Comprobar que onSubmit maneja File objects
// 3. Testear FileInputField por separado
```

### **❌ Problema: Estado del formulario no sincroniza**
```jsx
// INCORRECTO - Nombres inconsistentes
const [formData, setFormData] = useState({
  movieTitle: "Ejemplo"  // ❌ Nombre no coincide
});

const fields = [
  { name: "title" }      // ❌ Diferente a "movieTitle"
];

// CORRECTO - Nombres coincidentes
const [formData, setFormData] = useState({
  title: "Ejemplo"       // ✅ Coincide con field.name
});

const fields = [
  { name: "title" }      // ✅ Coincide con initialData
];

// DEBUGGING
// 1. Verificar que field.name coincide con keys de initialData
// 2. Comprobar onChange callback se ejecuta
// 3. Testear con formulario simple primero
```

## 🔗 Integración con Design System

### **Componentes Internos Utilizados**
```jsx
// DynamicForm actúa como orquestador, NO reimplementa funcionalidad
import { TextInput } from '../TextInput/TextInput';      // text, email, password, number, url, tel, date
import { TextSelect } from '../TextSelect/TextSelect';   // select con options
import { Checkbox } from '../../atoms/Checkbox/Checkbox'; // checkbox
import { Button } from '../../atoms/Button/Button';      // submit button
import { FileInputField } from '../FileInputField/FileInputField';     // file uploads  
import { ImageCropField } from '../ImageCropField/ImageCropField';     // image cropping
```

### **Herencia de Props**
```jsx
// Props de componente se heredan a todos los campos
<DynamicForm
  fieldSize="lg"        // → TextInput, TextSelect heredan size="lg"
  fieldRounded="xl"     // → TextInput, TextSelect heredan rounded="xl"
  submitVariant="success" // → Button hereda variant="success"
/>

// Field-level props sobreescriben component-level
{
  name: "title",
  leftIcon: "🎬",       // Solo este campo tiene icono
  placeholder: "Custom" // Solo este campo tiene placeholder custom
}
```

### **Consistencia Visual**
```css
/* Spacing automático usando variables del sistema */
.dynamic-form {
  gap: var(--space-lg);                /* Entre campos */
}

.dynamic-form__field {
  margin-bottom: var(--space-md);      /* Entre campo y label */
}

.dynamic-form__submit {
  margin-top: var(--space-xl);         /* Separación del botón */
}

/* Colores y tipografía heredados del design system */
```

## 🚀 Mejores Prácticas

### **Configuración de Campos**
```jsx
// ✅ HACER
const fields = [
  {
    name: "movieTitle",           // Nombres descriptivos
    type: "text", 
    label: "Título de la Película", // Labels claros
    placeholder: "Ej: Avatar",    // Placeholders útiles
    leftIcon: "🎬",              // Iconos para UX
    required: true,
    helperText: "Título original o traducido"
  }
];

// ❌ NO HACER
const fields = [
  {
    name: "field1",               // ❌ Nombre genérico
    type: "text",
    label: "Título"               // ❌ Label ambiguo
    // ❌ Sin placeholder, sin icono, sin helper
  }
];
```

### **Layout Responsivo**
```jsx
// ✅ HACER - Mobile First
<DynamicForm
  mobileColumns={1}      // Siempre 1 en móvil
  tabletColumns={2}      // 2 en tablet para forms complejos
  columnsPerRow={3}      // Máximo 3-4 en desktop
  responsive={true}      // Siempre activado
/>

// ❌ NO HACER
<DynamicForm
  columnsPerRow={5}      // ❌ Demasiadas columnas
  responsive={false}     // ❌ Sin adaptación
/>
```

### **Validación UX-Friendly**
```jsx
// ✅ HACER
<DynamicForm
  validateOnBlur={true}      // Validar al salir del campo
  validateOnChange={false}   // No validar agresivamente
  fields={[
    {
      name: "email",
      validation: (value) => {
        // Mensajes claros en español
        if (!value) return "El email es obligatorio";
        if (!value.includes("@")) return "Formato de email inválido";
        return null;
      }
    }
  ]}
/>

// ❌ NO HACER  
<DynamicForm
  validateOnChange={true}    // ❌ Validación muy agresiva
  fields={[
    {
      validation: (value) => {
        return value.length > 0; // ❌ Retorna boolean, no string
      }
    }
  ]}
/>
```

### **Performance y Escalabilidad**
```jsx
// ✅ HACER - Memoización para forms complejos
const fields = useMemo(() => [
  // Configuración de campos...
], [dependencies]);

const handleSubmit = useCallback((formData) => {
  // Lógica de envío...
}, []);

// ✅ HACER - initialData para edición
<DynamicForm
  fields={fields}
  initialData={existingMovie}  // Pre-llenar formulario
  onSubmit={handleSubmit}
/>

// ✅ HACER - Lazy loading para selects grandes
{
  name: "genre",
  type: "select",
  options: useMemo(() => 
    categories.map(cat => ({ value: cat.id, label: cat.name })), 
    [categories]
  )
}
```

## 📚 Referencias y Recursos

### **Archivos Importantes**
- **Componente**: `/frontend/app/src/components/molecules/DynamicForm/DynamicForm.jsx`
- **Stories**: `/frontend/app/src/components/molecules/DynamicForm/DynamicForm.stories.jsx`
- **Estilos**: `/frontend/app/src/components/molecules/DynamicForm/DynamicForm.css`

### **Ejemplos Reales de Uso**
- **MovieCreatePage**: Formulario más complejo con TMDB integration
- **SeriesCreatePage**: Similar a movies + season management  
- **UserCreatePage**: CRUD de usuarios con roles
- **EpisodeCreatePage**: Metadata + video file upload

### **Componentes Relacionados**
- **TextInput**: Atom base para campos de texto
- **TextSelect**: Molecule para selects
- **FileInputField**: Molecule para file uploads
- **ImageCropField**: Molecule para image cropping
- **Button**: Atom para submit

---

> ⚡ **Regla de Oro**: DynamicForm es un orquestador, no un reimplementador. Siempre usa componentes existentes del design system y mantiene la consistencia visual y funcional.