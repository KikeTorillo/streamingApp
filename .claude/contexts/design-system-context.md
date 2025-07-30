# Design System Context - Streaming App

> 🎨 **Propósito**: Este documento proporciona el contexto completo del sistema de diseño para garantizar consistencia en componentes nuevos, reutilización entre proyectos y facilitar el desarrollo.

## 🎯 Filosofía del Design System

### Principios Fundamentales
- **Mobile-First**: Diseñar primero para móvil, expandir a desktop
- **Variables CSS**: SIEMPRE usar variables del sistema, nunca valores hardcoded
- **Atomic Design**: Estructura jerárquica (atoms → molecules → organisms → templates)
- **Accesibilidad**: Cumplir WCAG 2.1 AA como estándar mínimo
- **Consistencia**: Misma altura, espaciado y comportamiento en componentes similares

## 🎨 Sistema de Tokens

### Colores - Paleta Moderna (Inspirada en Tailwind)

#### **Colores Base**
```css
/* Azules - Primary */
--blue-50: #eff6ff   --blue-500: #3b82f6 (Primary)
--blue-100: #dbeafe  --blue-600: #2563eb (Primary Hover)
--blue-200: #bfdbfe  --blue-700: #1d4ed8
--blue-300: #93c5fd  --blue-800: #1e40af
--blue-400: #60a5fa  --blue-900: #1e3a8a

/* Grises - Secondary */
--gray-50: #f9fafb   --gray-500: #6b7280 (Secondary)
--gray-100: #f3f4f6  --gray-600: #4b5563 (Secondary Hover)
--gray-200: #e5e7eb  --gray-700: #374151
--gray-300: #d1d5db  --gray-800: #1f2937
--gray-400: #9ca3af  --gray-900: #111827

/* Semánticos */
--red-500: #ef4444 (Danger)     --red-600: #dc2626 (Danger Hover)
--green-500: #22c55e (Success)  --green-600: #16a34a (Success Hover)
--yellow-500: #f59e0b (Warning) --yellow-600: #d97706 (Warning Hover)
```

#### **Variables Semánticas**
```css
--color-primary: var(--blue-500)
--color-primary-hover: var(--blue-600)
--color-secondary: var(--gray-500)
--color-secondary-hover: var(--gray-600)
--color-danger: var(--red-500)
--color-success: var(--green-500)
--color-warning: var(--yellow-500)
```

#### **Modo Oscuro**
- Activación: Clase `.dark` en `<body>` o `<html>`
- Inversión automática de variables semánticas
- Alto contraste para accesibilidad

### Espaciado - Escala Consistente
```css
--space-xs: 0.4rem  (4px)   /* Pequeños gaps internos */
--space-sm: 0.8rem  (8px)   /* Padding de componentes pequeños */
--space-md: 1.2rem  (12px)  /* Espaciado estándar */
--space-lg: 1.6rem  (16px)  /* Padding de componentes medianos */
--space-xl: 2.4rem  (24px)  /* Espaciado entre secciones */
--space-2xl: 3.2rem (32px)  /* Espaciado grande */
--space-3xl: 4.8rem (48px)  /* Espaciado muy grande */
--space-4xl: 6.4rem (64px)  /* Separación de secciones principales */
```

### Tipografía
```css
/* Familias */
--font-family-base: 'Inter', sans-serif    /* UI general */
--font-family-mono: 'Fira Code', monospace /* Código */

/* Tamaños */
--font-size-xs: 1.2rem   (12px)
--font-size-sm: 1.4rem   (14px)
--font-size-base: 1.6rem (16px) /* Base estándar */
--font-size-md: 1.8rem   (18px)
--font-size-lg: 2.0rem   (20px)
--font-size-xl: 2.4rem   (24px)
--font-size-2xl: 3.0rem  (30px)
--font-size-3xl: 3.6rem  (36px)
--font-size-4xl: 4.8rem  (48px)

/* Pesos */
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700

/* Line Heights */
--line-height-tight: 1.25
--line-height-normal: 1.5
--line-height-relaxed: 1.75
```

### Radios y Sombras
```css
/* Bordes redondeados */
--radius-sm: 0.4rem   (4px)
--radius-md: 0.8rem   (8px)  /* Estándar */
--radius-lg: 1.2rem   (12px)
--radius-xl: 1.6rem   (16px)
--radius-full: 50%    /* Circular */

/* Sombras */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 25px 50px rgba(0, 0, 0, 0.25)

/* Transiciones */
--transition-fast: 0.15s ease
--transition-normal: 0.2s ease
--transition-slow: 0.3s ease
```

## 🧩 Componentes y Patrones

### Atomic Design - Estructura
```
atoms/          - Button, Input, Badge, Avatar, Icon
molecules/      - FilterBar, ContentCard, TextInput (con label)
organisms/      - DataTable, AdminSidebar, VideoPlayer
templates/      - AdminLayout, PlayerLayout, AuthLayout
pages/          - Composición final usando templates
```

### Button - Átomo Principal
```jsx
// Tamaños (5 opciones)
size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
// Altura mínima: xs(24px) sm(32px) md(40px) lg(48px) xl(56px)

// Variantes (7 opciones)
variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 
         'danger' | 'success' | 'warning'

// Estados
disabled: boolean
loading: boolean (con spinner)
fullWidth: boolean

// Iconos
icon: ReactNode
iconPosition: 'left' | 'right'
iconOnly: boolean

// Bordes
rounded: 'sm' | 'md' | 'lg' | 'xl' | 'full'
```

### Alturas Estándar de Componentes
```css
/* REGLA FUNDAMENTAL: Componentes principales usan 56px (lg) */
--component-height-xs: 2.8rem  (28px)
--component-height-sm: 3.2rem  (32px)
--component-height-md: 4.0rem  (40px)
--component-height-lg: 5.6rem  (56px) ← ESTÁNDAR
--component-height-xl: 5.6rem  (56px)

/* Clase utilitaria para emergencias */
.force-input-height-lg {
  min-height: var(--component-height-lg) !important;
}
```

## 📱 Responsive & Mobile

### Breakpoints
```css
/* Mobile First - usar min-width */
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1200px) { /* Large Desktop */ }
```

### Touch Targets
```css
--touch-target-min: 4.4rem; /* 44px mínimo en móvil */
```

### Reglas Mobile
- **Touch targets**: Mínimo 44px para elementos interactivos
- **Botones grandes**: En móvil, lg/xl se ajustan a 44px mínimo
- **Espaciado generoso**: Usar space-md o mayor entre elementos táctiles
- **Texto legible**: Mínimo 16px (font-size-base) para evitar zoom

## 🎨 Sistema de Temas

### Tema Por Defecto
- **Primary**: Azul (blue-500)
- **Activación**: Automática, no requiere clases

### Temas Alternativos
```css
/* Aplicar clase en <body> */
.palette-ocean    /* Azul-teal */
.palette-forest   /* Verde-esmeralda */
.palette-sunset   /* Naranja-rojo */
.palette-purple   /* Morado-magenta */
```

### Modo Oscuro
```css
/* Aplicar clase en <body> */
.dark {
  /* Inversión automática de variables */
  --text-primary: var(--gray-100);
  --bg-primary: var(--gray-900);
  /* etc... */
}
```

## 🛠️ Herramientas de Desarrollo

### Debugging Visual
```css
/* Mostrar bordes para verificar alturas */
.debug-heights * {
  outline: 1px solid red;
}

/* Grid de alturas para verificar 56px */
.height-grid {
  background: linear-gradient(
    transparent 5.5rem, 
    red 5.5rem, 
    red 5.6rem, 
    transparent 5.6rem
  );
}
```

### Utilidades de Desarrollo
```css
/* Forzar altura estándar en emergencias */
.component-height-xs { min-height: var(--component-height-xs); }
.component-height-sm { min-height: var(--component-height-sm); }
.component-height-md { min-height: var(--component-height-md); }
.component-height-lg { min-height: var(--component-height-lg); }
.component-height-xl { min-height: var(--component-height-xl); }
```

## 📋 Convenciones de Código

### Nomenclatura CSS
```css
/* BEM Methodology */
.component { }                    /* Bloque */
.component__element { }           /* Elemento */
.component--modifier { }          /* Modificador */
.component__element--state { }    /* Estado del elemento */
```

### Estructura de Archivos
```
ComponentName/
├── ComponentName.jsx       # Componente principal
├── ComponentName.css       # Estilos específicos
├── ComponentName.stories.jsx  # Documentación Storybook
└── index.js               # Export barrel (opcional)
```

### Patrón de Export
```jsx
// ✅ CORRECTO
function ComponentName(props) {
  return <div>...</div>;
}

export { ComponentName };

// ❌ INCORRECTO
export default ComponentName;
```

## 🔍 Validación y Testing

### Stories Obligatorias para Atoms
Cada átomo debe tener estas 6 stories mínimas:
1. **Default** - Estado por defecto
2. **All Sizes** - Todos los tamaños disponibles
3. **All Variants** - Todas las variantes visuales
4. **Interactive States** - Hover, focus, disabled
5. **With Icons** - Con iconos (si aplica)
6. **Responsive** - Comportamiento móvil

### Checklist de Linting
- ✅ ESLint debe pasar sin errores
- ✅ Variables CSS, no valores hardcoded
- ✅ Altura mínima de 44px en móvil para interactivos
- ✅ Contraste mínimo AA (4.5:1)
- ✅ Focus visible en todos los elementos interactivos

## 🚀 Migración a Nuevos Proyectos

### Setup Inicial
1. **Copiar App.css completo** al nuevo proyecto
2. **Configurar estructura atómica** (atoms, molecules, organisms, templates)
3. **Instalar dependencias** (React, Storybook si se usa)
4. **Crear componentes base** (Button, Input, Card)
5. **Configurar tema personalizado** (opcional)

### Componentes Esenciales para Migrar
```
Prioridad Alta:
- Button (átomo principal)
- Input, TextArea (formularios)
- Card (contenedor base)
- Badge (etiquetas)

Prioridad Media:
- DataTable (listas de datos)
- Modal (overlays)
- AdminLayout (estructura)

Prioridad Baja:
- Componentes específicos del dominio
```

## 📈 Extensiones Futuras

### Roadmap del Sistema
- **Animaciones**: Sistema de micro-interacciones y transiciones
- **Iconos**: Librería unificada (react-icons o custom)
- **Layouts**: Grid system responsivo
- **Forms**: Sistema de validación integrado
- **Data Display**: Patrones avanzados para tablas y listas

### Casos de Uso Específicos
- **Streaming**: VideoPlayer, grids de contenido, controles multimedia
- **Admin**: DataTables, formularios CRUD, dashboards
- **E-commerce**: Product cards, checkout flows, user profiles
- **Blog**: Article layouts, comment systems
- **SaaS**: Settings panels, billing, metrics

---

> 🎯 **Regla de Oro**: Si dudas entre crear algo nuevo o usar una variable existente, usa la variable. La consistencia es más valiosa que la perfección individual.