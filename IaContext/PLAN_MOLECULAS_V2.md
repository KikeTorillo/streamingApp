# Plan de Desarrollo Moléculas V2.0

Documento: PLAN_MOLECULAS_V2.md
Fecha: 26-08-2025
Scope: frontend/app/src/components/molecules/ - Sistema de Diseño V2.0
Base: Átomos V2.0 completados con extractDOMPropsV2 y hooks estándar

## Resumen ejecutivo

Con los Átomos V2.0 completados y estabilizados, iniciamos el desarrollo de Moléculas siguiendo la metodología de Atomic Design y los patrones establecidos. Las Moléculas combinan átomos para crear componentes más complejos pero manteniendo la simplicidad y reutilización.

- **Objetivo**: Crear capa de Moléculas V2.0 consistente con Átomos V2.0
- **Metodología**: Atomic Design + Props API unificada + extractDOMPropsV2
- **Arquitectura**: Composición explícita + hooks estándar + design tokens
- **Timeline estimado**: 2-3 sprints (depende del scope final)

## Principios fundamentales para Moléculas

### 1. Composición de Átomos
- **OBLIGATORIO**: Usar solo átomos del sistema de diseño (`@kike-dev/contextual-ui`)
- **PROHIBIDO**: HTML nativo (div, input, button) - siempre usar componentes del sistema
- **PATRÓN**: Molécula = composición inteligente de 2+ átomos

### 2. Props API Consistente  
- **HEREDAR**: Props estándar de átomos (size, variant, disabled, etc.)
- **EXTENDER**: Props específicas del dominio de la molécula
- **USAR**: extractDOMPropsV2 en el nodo raíz siempre

### 3. Hooks Estándar
- **useInteractiveProps** para moléculas interactivas (formularios, botones)
- **useContainerProps** para moléculas de layout
- **useTypographyProps** para moléculas de contenido de texto

## Análisis de Moléculas Existentes

### ✅ Moléculas ya creadas (verificar compliance V2)
- **DynamicForm**: Sistema de formularios dinámicos
- **DataTable**: Tabla de datos con paginación
- **ContentCard**: Tarjetas de contenido multimedia
- **SearchBar**: Barra de búsqueda con filtros
- **ActionsDropdown**: Menú desplegable de acciones
- **Breadcrumb**: Navegación breadcrumb
- **Pagination**: Componente de paginación
- **Modal**: Sistema modal base
- **Tabs**: Pestañas de navegación
- **TextInput**: Input con label y validación
- **ToastContainer**: Contenedor de notificaciones
- **Accordion**: Componente acordeón

### 🎯 Moléculas propuestas (nuevas)
**Fundacionales del sistema:**
- **InputField**: Label + Input + Help + Error (composición estándar)
- **SelectField**: Label + Select + Help + Error
- **CheckboxGroup**: Grupo de checkboxes con estado unificado
- **RadioGroup**: Grupo de radio buttons
- **CardMedia**: Card + Image + Typography (media cards)
- **ModalBase**: Modal + Button + Typography (base configurable)
- **Tooltip**: Overlay posicionado con contenido
- **ButtonGroup**: Conjunto de botones relacionados

## Estrategia de Implementación

### Fase 1 - Auditoría y Migración (P0)
**Objetivo**: Verificar que moléculas existentes usen patterns V2

#### Checklist de compliance V2 por molécula:
- [ ] Usa únicamente átomos del sistema (no HTML nativo)
- [ ] Implementa extractDOMPropsV2 en nodo raíz
- [ ] Usa hook estándar apropiado (useInteractiveProps/useContainerProps)
- [ ] Props API consistente con sistema V2
- [ ] PropTypes definidos con helpers del sistema
- [ ] Storybook con casos principales

#### Prioridad de auditoría:
1. ✅ **DynamicForm** - **COMPLETADO V2** (100% compliance)
   - ✅ extractDOMPropsV2 integrado en nodo raíz
   - ✅ Reemplazado HTML nativo por átomos (Radio, TextArea, Label)
   - ✅ Props API V2 estándar implementada
   - ✅ 0 warnings de React por props DOM inválidas
2. ✅ **DataTable** - **COMPLETADO V2** (90% compliance + excepción justificada)
   - ✅ Migrado a hooks V2 (useContainerProps + extractDOMPropsV2)
   - ✅ PropTypes V2 (CONTAINER_PROP_TYPES)
   - ✅ Usa átomos V2 para controles (Button, Typography, FlexContainer)
   - ⚠️ Excepción HTML: table/thead/tbody por necesidad semántica (React-Table)
   - ✅ Documentación de excepción justificada técnicamente
3. **Modal** (crítico - usado en toda la app)
4. ✅ **ActionsDropdown** - **IMPORTS CORREGIDOS** (imports V2 arreglados)
5. **ContentCard** (importante - home y listas)
6. **SearchBar** (importante - funcionalidad core)

### Fase 2 - Creación Moléculas Nuevas (P1)
**Objetivo**: Implementar moléculas fundacionales faltantes

#### Orden de implementación sugerido:
1. **InputField** - Base para todos los formularios
2. **SelectField** - Complemento de InputField
3. **ButtonGroup** - Usado en toolbars y acciones
4. **CheckboxGroup / RadioGroup** - Formularios de opciones
5. **CardMedia** - Contenido multimedia
6. **ModalBase** - Variantes específicas de Modal
7. **Tooltip** - UX helpers

### Fase 3 - Optimización y Polish (P2)
**Objetivo**: Pulir experiencia y performance

#### Tareas:
- Optimización de re-renders
- Accesibilidad avanzada (focus management, ARIA)
- Responsive behavior refinado
- Storybook documentation completa

## Arquitectura Técnica

### Pattern Base para Moléculas
```javascript
// Estructura base de cualquier molécula V2
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import { Button, Input, Typography } from '../../atoms/';

function MoleculeName(props) {
  // 1. Hook estándar V2
  const {
    size, variant, disabled, loading,
    className, tokens, renderIcon
  } = useInteractiveProps(props, {
    componentName: 'MoleculeName',
    defaultSize: 'md',
    defaultVariant: 'primary'
  });

  // 2. Props específicas de la molécula
  const { specificProp, onAction, ...restProps } = props;

  // 3. Lógica de composición
  const compositionLogic = () => {
    // Lógica específica de cómo se combinan los átomos
  };

  // 4. Clases CSS combinadas
  const moleculeClasses = [
    'molecule-name',
    `molecule-name--${size}`,
    `molecule-name--${variant}`,
    disabled && 'molecule-name--disabled',
    className
  ].filter(Boolean).join(' ');

  // 5. Props DOM seguras
  const finalClassName = [moleculeClasses, className].filter(Boolean).join(' ');
  const propsWithFinalClassName = { ...props, className: finalClassName };
  const domProps = extractDOMPropsV2(propsWithFinalClassName);

  // 6. Render con composición de átomos
  return (
    <div {...domProps} data-component="MoleculeName">
      <Input size={size} disabled={disabled} {...inputProps} />
      <Button size={size} variant={variant} {...buttonProps} />
      <Typography size="sm" variant="neutral" {...helpProps} />
    </div>
  );
}

// 7. PropTypes estándar + específicos
MoleculeName.propTypes = {
  ...INTERACTIVE_PROP_TYPES,
  specificProp: PropTypes.string,
  onAction: PropTypes.func
};
```

### Hooks Especializados por Tipo

#### Para Moléculas Interactivas (formularios, controles)
```javascript
const props = useInteractiveProps(rawProps, {
  componentName: 'InputField',
  defaultSize: 'md',
  defaultVariant: 'primary'
});
```

#### Para Moléculas de Layout (contenedores, grids)
```javascript
const props = useContainerProps(rawProps, {
  componentName: 'CardGrid',
  defaultSize: 'lg',
  defaultPadding: 'md'
});
```

#### Para Moléculas de Contenido (cards, media)
```javascript
const props = useTypographyProps(rawProps, {
  componentName: 'ContentCard',
  defaultSize: 'md',
  defaultWeight: 'normal'
});
```

## Convenciones de Naming y Estructura

### Estructura de archivos
```
molecules/
├── InputField/
│   ├── InputField.jsx
│   ├── InputField.css
│   ├── InputField.stories.jsx
│   └── index.js
├── DataTable/
│   ├── DataTable.jsx
│   ├── DataTable.css
│   ├── DataTable.stories.jsx
│   ├── components/        # Sub-componentes específicos
│   │   ├── TableRow.jsx
│   │   └── TableHeader.jsx
│   └── index.js
```

### Convenciones CSS
```css
/* Molécula base */
.input-field { }

/* Variantes de size (heredadas de átomos) */
.input-field--xs { }
.input-field--sm { }
.input-field--md { }
.input-field--lg { }
.input-field--xl { }

/* Variantes semánticas (heredadas de átomos) */
.input-field--primary { }
.input-field--secondary { }
.input-field--success { }
.input-field--warning { }
.input-field--danger { }
.input-field--neutral { }

/* Estados específicos de la molécula */
.input-field--error { }
.input-field--required { }

/* Elementos internos */
.input-field__label { }
.input-field__input { }
.input-field__help { }
.input-field__error { }
```

## Métricas y DoD

### Definition of Done por Molécula
- [ ] Implementa pattern base V2 (hooks + extractDOMPropsV2)
- [ ] Usa únicamente átomos del sistema (0% HTML nativo)
- [ ] Props API consistente con sistema estándar
- [ ] PropTypes definidos con helpers
- [ ] CSS con tokens y clases estándar
- [ ] Storybook con casos principales (normal, error, disabled, loading)
- [ ] 0 warnings de React por props inválidas DOM
- [ ] Accesibilidad básica (ARIA, focus, teclado)
- [ ] Responsive behavior apropiado

### Métricas de Calidad
- **Consistencia**: 100% de moléculas usan pattern V2
- **Performance**: 0 re-renders innecesarios detectados
- **Bundle Size**: Medición por molécula y total
- **Accesibilidad**: WCAG AA compliance mínimo
- **Developer Experience**: API predecible y documentada

## Cronograma Propuesto

### Sprint 1 (Auditoría Core)
- [x] **DynamicForm compliance V2** - ✅ COMPLETADO
  - [x] extractDOMPropsV2 integrado
  - [x] HTML nativo → átomos (Radio, TextArea, Label)
  - [x] Props filtering correcto
  - [x] 100% V2 compliance
- [x] **DataTable compliance V2** - ✅ COMPLETADO  
  - [x] Hooks V2 migrados (useContainerProps + extractDOMPropsV2)
  - [x] PropTypes V2 implementados
  - [x] Átomos V2 para controles (Button, Typography, etc.)
  - [x] Excepción HTML documentada y justificada técnicamente
  - [x] 90% V2 compliance (máximo posible)
- [x] **ActionsDropdown imports V2** - ✅ COMPLETADO
- [ ] **Modal compliance V2** - Próximo

### Sprint 2 (Moléculas Nuevas P1)
- [ ] InputField implementación
- [ ] SelectField implementación
- [ ] ButtonGroup implementación
- [ ] CheckboxGroup / RadioGroup implementación

### Sprint 3 (Completar y Pulir)
- [ ] CardMedia, ModalBase, Tooltip
- [ ] Auditoría completa moléculas restantes
- [ ] Storybook documentation completa
- [ ] Performance audit y optimización

## Próximos Pasos Inmediatos

1. ✅ **DynamicForm V2 COMPLETADO**: 100% compliance V2 implementado
2. ✅ **DataTable V2 COMPLETADO**: 90% compliance V2 + excepción justificada
3. **Auditar Modal**: Próximo componente crítico usado en toda la aplicación
4. **Crear InputField**: Molécula fundacional nueva (cuando termine auditoría core)

## Estado Actual del Progreso

### ✅ Completados (Sprint 1) - 75% del Sprint
- **DynamicForm**: Migración completa a V2 (100% compliance)
  - extractDOMPropsV2 + reemplazo HTML nativo por átomos + props API V2
- **DataTable**: Migración a V2 con excepción justificada (90% compliance)
  - Hooks V2 + PropTypes V2 + átomos V2 + excepción HTML documentada
- **ActionsDropdown**: Corrección de imports V2

### 🚧 En Progreso
- **Plan de Moléculas V2**: Documento maestro creado y actualizado

### ⏳ Próximos
- **Modal**: Auditoría de compliance V2 (último componente crítico del Sprint 1)
- **ContentCard**: Auditoría de compliance V2
- **SearchBar**: Auditoría de compliance V2

## Lecciones Aprendidas

### 📋 **DynamicForm V2 (100% compliance)**

### 🎯 **Patrón de Corrección Exitoso:**
1. **Import correcto**: `extractDOMPropsV2` desde `standardProps-v2.js`, `INTERACTIVE_PROP_TYPES` desde `propHelpers.js`
2. **Imports de átomos**: Agregar Radio, TextArea, Label del sistema
3. **ExtractDOMPropsV2**: Solo pasar props estándar del sistema (size, variant, etc.), NO props específicas del componente
4. **Reemplazo HTML → Átomos**: Sistemático, manteniendo funcionalidad
5. **Props API**: Usar props estándar V2 en todos los átomos hijos

### ❌ **Errores Comunes Identificados:**
- **Props leakage**: Pasar props específicas (submitFullWidth, fields) a extractDOMPropsV2
- **Import desde archivo incorrecto**: INTERACTIVE_PROP_TYPES desde standardProps-v2 en lugar de propHelpers
- **HTML nativo**: input[type="radio"], textarea, label en lugar de átomos

### ✅ **Patrón V2 Correcto para Moléculas:**
```javascript
// 1. Imports correctos
import { extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import { Radio, TextArea, Label } from '../../atoms/';

// 2. Props DOM safe (solo props estándar)
const propsWithFinalClassName = { 
  size, variant, rounded, disabled, loading, className: finalClassName
};
const baseDOMProps = extractDOMPropsV2(propsWithFinalClassName);

// 3. Usar átomos del sistema
<Radio size={finalSize} variant={hasError ? 'danger' : sysVariant} />
<TextArea width="full" size={finalSize} variant={sysVariant} />
<Label required={fieldRequired} size={finalSize} />
```

### 🗂️ **DataTable V2 (90% compliance + excepción)**

#### **🎯 Patrón de Migración V2:**
1. **Hooks V1 → V2**: `useDataTableProps` → `useContainerProps`
2. **Props V1 → V2**: `extractDOMProps` → `extractDOMPropsV2` 
3. **PropTypes V1 → V2**: `STANDARD_PROP_TYPES` → `CONTAINER_PROP_TYPES`
4. **Documentar excepciones**: HTML necesario por dependencias externas

#### **✅ Excepción HTML Justificada:**
```javascript
// ✅ ACEPTABLE: HTML semánticamente necesario
<table className="data-table__table">
  <thead><tr><th>Headers</th></tr></thead>
  <tbody><tr><td>Data</td></tr></tbody>
</table>

// RAZÓN: React-Table requiere estructura HTML específica
// ALTERNATIVA: No existe - es estándar de la industria
```

#### **🔧 Criterios para Excepciones HTML:**
- **Dependencia externa** requiere HTML específico (React-Table, etc.)
- **Semánticamente necesario** para accesibilidad (table, form)
- **Estándar de industria** (Material-UI, Ant Design usan HTML nativo para tablas)
- **Todo lo demás V2** (hooks, props, átomos para controles)

#### **📋 Template de Excepción:**
```javascript
/**
 * ComponentName - Descripción V2
 * 
 * ✅ SISTEMA V2: Hooks + Props + átomos V2
 * ⚠️ EXCEPCIÓN HTML: elemento nativo por [razón específica]
 */
```

---

**Responsable**: Frontend Core  
**Revisión**: Diseño y Accesibilidad  
**Stakeholders**: Product Team