# 🎨 Design Tokens System

## 📋 Resumen

Sistema completo de design tokens centralizado que permite el uso programático de variables CSS desde JavaScript. Extrae todas las variables CSS del sistema (290+) y las organiza en categorías lógicas.

## 🎯 Objetivos

- ✅ **Centralización**: Todas las variables CSS accesibles desde JavaScript
- ✅ **Programático**: Uso dinámico de tokens en componentes
- ✅ **Consistencia**: Mapeo directo con variables CSS existentes
- ✅ **IntelliSense**: Soporte completo para autocompletado
- ✅ **Escalabilidad**: Fácil agregar nuevos tokens

## 🚀 Uso Básico

### Importar tokens

```javascript
// Importar todo el sistema
import { DESIGN_TOKENS } from '../tokens';

// Importar categorías específicas
import { 
  COMPONENT_SIZES, 
  COLOR_VARIANTS, 
  SPACING,
  getSizeTokens,
  getCombinedTokens 
} from '../tokens';
```

### Usar tokens en componentes

```javascript
import { DESIGN_TOKENS, getCombinedTokens, tokensToStyles } from '../tokens';

function MyButton({ size = 'md', variant = 'primary', rounded = 'md' }) {
  // Opción 1: Acceso directo a tokens
  const sizeTokens = DESIGN_TOKENS.sizes[size];
  const variantTokens = DESIGN_TOKENS.variants[variant];
  
  const buttonStyle = {
    height: sizeTokens.height,              // 'var(--component-height-md)'
    padding: sizeTokens.padding,            // 'var(--component-padding-md)'
    backgroundColor: variantTokens.bg,      // 'var(--color-primary)'
    color: variantTokens.text,              // 'var(--text-on-primary)'
    borderRadius: DESIGN_TOKENS.rounded[rounded]
  };
  
  // Opción 2: Usar helper function
  const tokens = getCombinedTokens(size, variant, rounded);
  const styles = tokensToStyles(tokens);
  
  return (
    <button style={buttonStyle}>
      {children}
    </button>
  );
}
```

## 📊 Categorías de Tokens

### ⚖️ COMPONENT_SIZES
Tamaños estándar para todos los componentes:

```javascript
const sizes = DESIGN_TOKENS.sizes;

// Todos los tamaños disponibles
sizes.xs // { height: '2.8rem', padding: '0.6rem 1.2rem', fontSize: '1.3rem', ... }
sizes.sm // { height: '3.2rem', padding: '1.2rem 1.8rem', fontSize: '1.5rem', ... }
sizes.md // { height: '4.0rem', padding: '1.2rem 1.8rem', fontSize: '1.7rem', ... }
sizes.lg // { height: '5.6rem', padding: '1.8rem 2.4rem', fontSize: '2.1rem', ... }
sizes.xl // { height: '5.6rem', padding: '1.8rem 4.8rem', fontSize: '2.5rem', ... }

// Cada tamaño incluye:
// - height: Altura del componente
// - padding: Espaciado interno
// - fontSize: Tamaño de fuente
// - borderRadius: Radio de bordes por defecto
// - iconSize: Tamaño de icono recomendado
```

### 🎨 COLOR_VARIANTS
Variantes de color semánticas:

```javascript
const variants = DESIGN_TOKENS.variants;

// Variantes disponibles
variants.primary   // Azul oceánico - acción principal
variants.secondary // Naranja/dorado - acción secundaria
variants.success   // Verde/azul - éxito
variants.warning   // Amarillo/dorado - advertencia
variants.danger    // Rojo - error/eliminar
variants.neutral   // Gris - neutro

// Cada variante incluye:
// - bg: Color de fondo
// - bgHover: Color de fondo en hover
// - bgLight: Versión clara
// - bgDark: Versión oscura
// - text: Color de texto
// - border: Color de borde
// - borderHover: Color de borde en hover

// Ejemplo de uso
const primaryVariant = variants.primary;
// → { bg: 'var(--color-primary)', text: 'var(--text-on-primary)', ... }
```

### ⭕ BORDER_RADIUS
Radios de borde estandarizados:

```javascript
const rounded = DESIGN_TOKENS.rounded;

rounded.sm   // 'var(--radius-sm)'   - 0.6rem (6px)
rounded.md   // 'var(--radius-md)'   - 1.2rem (12px) - ESTÁNDAR
rounded.lg   // 'var(--radius-lg)'   - 1.8rem (18px)
rounded.xl   // 'var(--radius-xl)'   - 2.4rem (24px)
rounded.full // 'var(--radius-full)' - 9999px (círculo)
```

### 📐 SPACING
Espaciado consistente:

```javascript
const spacing = DESIGN_TOKENS.spacing;

spacing.xs   // 'var(--space-xs)'  - 0.6rem (6px)
spacing.sm   // 'var(--space-sm)'  - 1.2rem (12px)
spacing.md   // 'var(--space-md)'  - 1.8rem (18px)
spacing.lg   // 'var(--space-lg)'  - 2.4rem (24px)
spacing.xl   // 'var(--space-xl)'  - 3.6rem (36px)
spacing['2xl'] // 'var(--space-2xl)' - 4.8rem (48px)
// ... hasta 4xl

// Uso en componentes
const cardStyle = {
  padding: spacing.lg,        // Espaciado interno
  marginBottom: spacing.md,   // Separación entre cards
  gap: spacing.sm             // Espacio entre elementos
};
```

### 🌑 SHADOWS
Sombras predefinidas:

```javascript
const shadows = DESIGN_TOKENS.shadows;

shadows.none // Sin sombra
shadows.sm   // Sombra suave - cards pequeños
shadows.md   // Sombra media - ESTÁNDAR para cards
shadows.lg   // Sombra grande - modales, dropdowns
shadows.xl   // Sombra extra - overlays importantes
```

### ⏱️ TRANSITIONS
Transiciones consistentes:

```javascript
const transitions = DESIGN_TOKENS.transitions;

transitions.fast   // 0.15s - micro-interacciones
transitions.normal // 0.2s  - ESTÁNDAR para la mayoría
transitions.slow   // 0.3s  - transiciones complejas
```

### 📝 TYPOGRAPHY
Sistema tipográfico completo:

```javascript
const typography = DESIGN_TOKENS.typography;

// Familias de fuente
typography.fontFamily.base // Fuente principal
typography.fontFamily.mono // Fuente monospace (código)

// Tamaños
typography.fontSize.xs     // 1.3rem (13px)
typography.fontSize.base   // 1.7rem (17px) - ESTÁNDAR
typography.fontSize.lg     // 2.1rem (21px)
// ... hasta 4xl

// Pesos
typography.fontWeight.normal   // 400 - ESTÁNDAR
typography.fontWeight.medium   // 500 - destacado
typography.fontWeight.bold     // 700 - títulos

// Alturas de línea
typography.lineHeight.normal   // 1.5 - ESTÁNDAR
typography.lineHeight.relaxed  // 1.75 - párrafos largos
```

### 🎨 SEMANTIC_COLORS
Colores por contexto:

```javascript
const colors = DESIGN_TOKENS.colors;

// Fondos
colors.background.primary    // Fondo principal de la app
colors.background.secondary  // Fondos de secciones
colors.background.muted     // Fondos deshabilitados

// Textos
colors.text.primary    // Texto principal - alta legibilidad
colors.text.secondary  // Texto secundario - menos prominente
colors.text.muted      // Texto deshabilitado

// Bordes
colors.border.default  // Bordes por defecto
colors.border.focus    // Bordes en focus - accesibilidad
```

## 🔧 Funciones Helper

### getSizeTokens(size)
Obtiene tokens de tamaño con fallback:

```javascript
import { getSizeTokens } from '../tokens';

const tokens = getSizeTokens('lg');
// → { height: 'var(--component-height-lg)', padding: '...', ... }

const fallback = getSizeTokens('invalid-size');
// → devuelve tokens de 'md' (fallback)
```

### getVariantTokens(variant)
Obtiene tokens de variante con fallback:

```javascript
import { getVariantTokens } from '../tokens';

const tokens = getVariantTokens('danger');
// → { bg: 'var(--color-danger)', text: 'var(--text-on-danger)', ... }
```

### getCombinedTokens(size, variant, rounded)
Combina múltiples categorías de tokens:

```javascript
import { getCombinedTokens } from '../tokens';

const tokens = getCombinedTokens('lg', 'primary', 'xl');
// → {
//     size: { height: '...', padding: '...', ... },
//     variant: { bg: '...', text: '...', ... },
//     rounded: 'var(--radius-xl)'
//   }
```

### tokensToStyles(tokens)
Convierte tokens a objeto de estilos CSS:

```javascript
import { getCombinedTokens, tokensToStyles } from '../tokens';

const tokens = getCombinedTokens('md', 'primary', 'lg');
const styles = tokensToStyles(tokens);
// → {
//     height: 'var(--component-height-md)',
//     padding: 'var(--component-padding-md)',
//     fontSize: 'var(--component-font-md)',
//     backgroundColor: 'var(--color-primary)',
//     color: 'var(--text-on-primary)',
//     borderRadius: 'var(--radius-lg)',
//     border: '1px solid var(--color-primary)',
//     transition: 'var(--transition-normal)'
//   }

// Usar directamente en componentes
<button style={styles}>Mi Botón</button>
```

## 🎯 Patrones de Uso Recomendados

### Patrón 1: Tokens Estáticos (Performance)
Para props que no cambian frecuentemente:

```javascript
function StaticButton() {
  const buttonStyles = {
    height: DESIGN_TOKENS.sizes.md.height,
    backgroundColor: DESIGN_TOKENS.variants.primary.bg,
    borderRadius: DESIGN_TOKENS.rounded.lg
  };
  
  return <button style={buttonStyles}>Static</button>;
}
```

### Patrón 2: Tokens Dinámicos (Flexibilidad)
Para componentes con props variables:

```javascript
function DynamicButton({ size, variant, rounded }) {
  const tokens = getCombinedTokens(size, variant, rounded);
  const styles = tokensToStyles(tokens);
  
  return <button style={styles}>Dynamic</button>;
}
```

### Patrón 3: Tokens con CSS Classes (Híbrido)
Combinar tokens con clases CSS:

```javascript
function HybridButton({ size, variant }) {
  const sizeTokens = getSizeTokens(size);
  
  const dynamicStyles = {
    height: sizeTokens.height,
    padding: sizeTokens.padding
  };
  
  return (
    <button 
      className={`btn btn--${variant}`} 
      style={dynamicStyles}
    >
      Hybrid
    </button>
  );
}
```

## 🏗️ Integración con Componentes Existentes

### Migrar Button Component
```javascript
// Antes
function Button({ size, variant }) {
  return (
    <button className={`btn btn--${size} btn--${variant}`}>
      {children}
    </button>
  );
}

// Después (con tokens)
import { getSizeTokens, getVariantTokens } from '../tokens';

function Button({ size, variant, children }) {
  const sizeTokens = getSizeTokens(size);
  const variantTokens = getVariantTokens(variant);
  
  const buttonStyles = {
    height: sizeTokens.height,
    padding: sizeTokens.padding,
    fontSize: sizeTokens.fontSize,
    backgroundColor: variantTokens.bg,
    color: variantTokens.text
  };
  
  return (
    <button 
      className={`btn btn--${size} btn--${variant}`}
      style={buttonStyles}
    >
      {children}
    </button>
  );
}
```

## 🎨 Theming Support

Los tokens soportan automáticamente el sistema de temas existente:

```javascript
// Los tokens cambian automáticamente con el theme
const primaryColor = DESIGN_TOKENS.variants.primary.bg;
// Tema claro: '#219ebc' (matcha-400)
// Tema oscuro: automáticamente se adapta
// Tema tierra: automáticamente se adapta

// No es necesario hacer nada especial - las variables CSS se encargan
```

## 📱 Responsive Design

```javascript
import { DESIGN_TOKENS } from '../tokens';

const ResponsiveCard = () => {
  const cardStyles = {
    padding: DESIGN_TOKENS.spacing.md,
    borderRadius: DESIGN_TOKENS.rounded.lg,
    boxShadow: DESIGN_TOKENS.shadows.md,
    
    // Media queries con tokens
    [`@media (min-width: ${DESIGN_TOKENS.breakpoints.md})`]: {
      padding: DESIGN_TOKENS.spacing.lg
    }
  };
  
  return <div style={cardStyles}>Responsive Card</div>;
};
```

## 🚀 Next Steps

### Sprint 2 Continuación
1. ✅ **Tarea 2.1 COMPLETADA**: Design Tokens System
2. 🔄 **Tarea 2.2**: Implementar HOC `withStandardProps`
3. 🔄 **Tarea 2.3**: Crear hook `useStandardProps`
4. 🔄 **Tarea 2.4**: Migrar Button, Badge, Input

### Beneficios del Sistema
- **Consistencia automática** - tokens garantizan coherencia visual
- **Performance** - variables CSS nativas (no recálculo JS)
- **Theming dinámico** - soporte automático para temas
- **Developer Experience** - IntelliSense y autocompletado
- **Mantenibilidad** - cambios centralizados se propagan automáticamente

---

*Documentación del Design Tokens System - Sprint 2, Tarea 2.1*
*Actualizado: Enero 2025*