# Plan de Revisión: Orden de Props en Componentes del Sistema de Diseño

## 🎯 Objetivo
Revisar todos los componentes del sistema de diseño para asegurar el orden correcto de props, evitando que `domProps` sobrescriba clases CSS importantes.

## 🔍 Problema Identificado
**Patrón incorrecto encontrado en FilterBar:**
```jsx
❌ INCORRECTO:
<div
  className={componentClasses}  // Se aplica primero
  {...domProps}                 // Sobrescribe className
>

✅ CORRECTO:
<div
  {...domProps}                 // Se aplica primero  
  className={componentClasses}  // Tiene prioridad final
>
```

## 📋 Componentes a Revisar

### 🔴 Prioridad Alta - Átomos Base
- [ ] **Button/Button.jsx** - Componente crítico más usado
- [ ] **Card/Card.jsx** - Base para muchos otros componentes  
- [ ] **Input/Input.jsx** - Componente de formularios crítico
- [ ] **Badge/Badge.jsx** - Usado en muchos lugares
- [ ] **ContentImage/ContentImage.jsx** - Recientemente modificado

### 🟡 Prioridad Media - Moléculas
- [ ] **ContentCard/ContentCard.jsx** - Ya revisado pero confirmar
- [ ] **FilterBar/FilterBar.jsx** - ✅ YA CORREGIDO
- [ ] **DynamicForm/DynamicForm.jsx** - Componente complejo
- [ ] **DataTable/DataTable.jsx** - Componente de tablas
- [ ] **Modal/Modal.jsx** - Componente de overlays

### 🟢 Prioridad Baja - Organismos y Templates  
- [ ] **AppHeader/AppHeader.jsx** - Header de aplicación
- [ ] **PageLayout/PageLayout.jsx** - Layout principal
- [ ] **AdminLayout/AdminLayout.jsx** - Layout admin
- [ ] **ContentSection/ContentSection.jsx** - Secciones de contenido

## 🔧 Patrón de Revisión por Componente

### 1. Localizar el return JSX
```bash
# Buscar archivos con potencial problema
grep -r "className.*{.*}" frontend/app/src/components/ --include="*.jsx"
```

### 2. Identificar el patrón problemático
```jsx
// BUSCAR este patrón:
<elemento
  className={clases}
  {...domProps}
>

// O este patrón:
<elemento
  className={clases}
  {...restProps}
  {...validDOMProps}
>
```

### 3. Aplicar corrección estándar
```jsx
// CAMBIAR A:
<elemento  
  {...domProps}           // Primero: props genéricas
  className={clases}      // Después: props específicas
  style={estilos}         // Después: estilos específicos
  onClick={handler}       // Después: handlers específicos
>
```

## 📁 Estructura de Archivos a Revisar

```
frontend/app/src/components/
├── atoms/
│   ├── Button/Button.jsx           🔴 CRÍTICO
│   ├── Card/Card.jsx               🔴 CRÍTICO  
│   ├── Input/Input.jsx             🔴 CRÍTICO
│   ├── Badge/Badge.jsx             🔴 CRÍTICO
│   └── ContentImage/ContentImage.jsx 🔴 CRÍTICO
├── molecules/
│   ├── ContentCard/ContentCard.jsx  🟡 REVISAR
│   ├── FilterBar/FilterBar.jsx      ✅ CORREGIDO
│   ├── DynamicForm/DynamicForm.jsx  🟡 REVISAR
│   ├── DataTable/DataTable.jsx      🟡 REVISAR
│   └── Modal/Modal.jsx              🟡 REVISAR
├── organisms/
│   ├── AppHeader/AppHeader.jsx      🟢 BAJA PRIORIDAD
│   └── [otros organismos]           🟢 BAJA PRIORIDAD
└── templates/
    ├── PageLayout/PageLayout.jsx    🟢 BAJA PRIORIDAD
    ├── AdminLayout/AdminLayout.jsx  🟢 BAJA PRIORIDAD
    └── [otros templates]            🟢 BAJA PRIORIDAD
```

## 🎯 Comandos de Búsqueda Útiles

### Buscar patrones problemáticos:
```bash
# Buscar className seguido de spread operator
grep -rn "className.*{.*}.*\.\.\." frontend/app/src/components/ --include="*.jsx"

# Buscar {...domProps} o {...restProps} después de className
grep -rn -A2 "className.*{" frontend/app/src/components/ --include="*.jsx" | grep "\.\.\."

# Buscar componentes que usan extractDOMProps
grep -rn "extractDOMProps" frontend/app/src/components/ --include="*.jsx"
```

### Verificar componentes corregidos:
```bash
# Verificar que className esté después de spread
grep -rn -B2 "className.*{" frontend/app/src/components/ --include="*.jsx" | grep "\.\.\."
```

## 📝 Lista de Verificación por Componente

Para cada componente revisar:

- [ ] **Localizar JSX return** - Encontrar donde se renderiza el elemento principal
- [ ] **Identificar props spread** - Buscar `{...domProps}`, `{...restProps}`, `{...validDOMProps}`
- [ ] **Verificar orden** - Asegurar que spread esté ANTES de props específicas
- [ ] **Probar funcionamiento** - Verificar que las clases CSS se apliquen correctamente
- [ ] **Documentar cambio** - Marcar como revisado en este plan

## 🔄 Metodología de Trabajo

### Fase 1: Búsqueda y Identificación
1. Usar comandos grep para encontrar patrones problemáticos
2. Listar todos los componentes afectados
3. Priorizar por criticidad (átomos > moléculas > organismos)

### Fase 2: Corrección Sistemática  
1. Empezar por átomos críticos (Button, Card, Input)
2. Aplicar patrón estándar en cada componente
3. Probar cada corrección individualmente

### Fase 3: Validación
1. Verificar que las clases CSS se apliquen correctamente
2. Probar componentes en Storybook si está disponible
3. Verificar que no haya regresiones visuales

## ⚠️ Consideraciones Especiales

### Casos edge que pueden requerir atención especial:
- **Componentes con múltiples elementos JSX** - Verificar cada elemento
- **Componentes con conditional rendering** - Revisar todas las ramas
- **Componentes que extienden otros** - Verificar herencia de props
- **Componentes con forwarded refs** - Mantener compatibilidad

### Props que SIEMPRE deben ir después del spread:
- `className` - Para que las clases específicas no se sobrescriban
- `style` - Para que estilos específicos tengan prioridad  
- `onClick`, `onKeyDown` - Para que handlers específicos funcionen
- `aria-*` attributes - Para accesibilidad específica
- `data-*` attributes - Para datos específicos

## 📊 Progreso de Revisión

**Estado Actual:**
- ✅ FilterBar.jsx - CORREGIDO
- 🔄 En progreso: [componente actual]
- ⏳ Pendientes: ~15-20 componentes estimados

**Progreso:** 1/20 (5%) completado

## 🎯 Resultado Esperado

Al finalizar esta revisión:
1. **Todos los componentes** tendrán el orden correcto de props
2. **Las clases CSS** se aplicarán consistentemente  
3. **No habrá sobrescritura** accidental de className por domProps
4. **El sistema de diseño** funcionará de manera más confiable
5. **Los estilos inline** no interferirán con las clases CSS

## 📚 Referencias

- **Problema identificado:** FilterBar con orden incorrecto de props
- **Solución aplicada:** Mover spread operator antes de props específicas  
- **Patrón estándar:** `{...domProps}` → `className={clases}` → props específicas