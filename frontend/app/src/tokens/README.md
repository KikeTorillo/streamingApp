# 🎯 Standard Props System

## 📋 Resumen

Este directorio contiene la **definición centralizada de todas las props estándar** que deben usar los componentes del sistema de diseño.

## 🎯 Objetivo

- ✅ **Consistencia**: Mismas props en todos los componentes
- ✅ **Predictibilidad**: Developers saben qué esperar
- ✅ **Mantenibilidad**: Un solo lugar para cambiar APIs
- ✅ **Migración gradual**: Soporte para props deprecadas con warnings

## 🔧 Uso Básico

### En un componente nuevo:

```javascript
import PropTypes from 'prop-types';
import { 
  validateStandardProps, 
  extractStandardProps,
  STANDARD_PROP_TYPES,
  DEFAULT_PROPS 
} from '../tokens';

function MyComponent(props) {
  // Validar y extraer props estándar
  const validatedProps = validateStandardProps(props, 'MyComponent');
  const { size, variant, rounded, disabled, loading, className, leftIcon, ...rest } = validatedProps;

  // Usar las props...
  return (
    <div className={`my-component my-component--${size} my-component--${variant}`}>
      {/* contenido */}
    </div>
  );
}

MyComponent.propTypes = {
  ...STANDARD_PROP_TYPES,
  // Props específicas del componente
  specialProp: PropTypes.string
};

MyComponent.defaultProps = {
  ...DEFAULT_PROPS,
  specialProp: 'default'
};
```

### En un componente existente (migración):

```javascript
// Antes
function Button({ size, variant, icon, iconPosition, ...props }) {
  // lógica existente
}

// Después (con backward compatibility)
import { validateStandardProps, DEPRECATED_PROPS } from '../tokens';

function Button(props) {
  // Validar props (mostrará warnings para props deprecadas)
  const validatedProps = validateStandardProps(props, 'Button');
  
  // Mantener backward compatibility temporalmente
  const { leftIcon, rightIcon, icon, iconPosition, ...rest } = validatedProps;
  
  // Mapear props legacy a nueva API
  const finalLeftIcon = leftIcon || (icon && iconPosition === 'left' ? icon : null);
  const finalRightIcon = rightIcon || (icon && iconPosition === 'right' ? icon : null);
  
  // Usar nueva API internamente
  return (
    <button>
      {finalLeftIcon && <span>{/* render icon */}</span>}
      {/* contenido */}
    </button>
  );
}
```

## 📊 Props Estándar Disponibles

### ⚖️ Tamaños (5 opciones)
- `xs` - Extra pequeño
- `sm` - Pequeño  
- `md` - Mediano (por defecto)
- `lg` - Grande
- `xl` - Extra grande

### 🎨 Variantes (6 opciones)
- `primary` - Acción principal (azul oceánico)
- `secondary` - Acción secundaria (naranja/dorado)  
- `success` - Éxito (verde o azul success)
- `warning` - Advertencia (amarillo/dorado)
- `danger` - Error/eliminar (rojo)
- `neutral` - Neutro (gris)

### ⭕ Bordes redondeados (5 opciones)
- `sm` - 0.6rem
- `md` - 1.2rem (por defecto)
- `lg` - 1.8rem  
- `xl` - 2.4rem
- `full` - Circular

### 🔄 Estados
- `disabled` - boolean
- `loading` - boolean

### 🎨 Personalización  
- `className` - string
- `style` - object (uso limitado)

### 🧪 Testing & Accesibilidad
- `testId` - string (para data-testid)
- `ariaLabel` - string

### ⭐ Iconos (nueva API unificada)
- `leftIcon` - string | ReactNode
- `rightIcon` - string | ReactNode  
- `iconOnly` - boolean (solo Button)

## ❌ Props Deprecadas

Estas props mostrarán warnings y serán eliminadas gradualmente:

- `icon` → usar `leftIcon` o `rightIcon`
- `iconPosition` → usar `leftIcon`/`rightIcon` específicos
- `variant="default"` → usar `variant="primary"`
- `variant="info"` → usar `variant="primary"` o `variant="neutral"`
- `variant="outline"` → usar `appearance="outline"` (Badge)
- `variant="ghost"` → usar `appearance="ghost"`

## 🔧 Funciones Utilitarias

### `validateStandardProps(props, componentName, allowedProps)`
Valida props en desarrollo y muestra warnings útiles.

### `extractStandardProps(props)`  
Extrae solo las props estándar del objeto completo.

### `extractDOMProps(props)`
Filtra props que son seguros pasar al DOM (elimina props del design system).

## 🚀 Próximos Pasos

1. **Sprint 1**: Migrar Button, Badge, Input con este sistema
2. **Sprint 2**: Crear design tokens centralizados  
3. **Sprint 3**: Crear HOCs y hooks que usen este sistema
4. **Sprint 4**: Documentación completa con ejemplos

## 📝 Notas de Desarrollo

- Las validaciones **solo corren en development** (performance)
- Props deprecadas **funcionan pero muestran warnings**
- Usar `STANDARD_PROP_TYPES` para consistencia en PropTypes
- Todos los valores están basados en variables CSS existentes