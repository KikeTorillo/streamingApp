# PROMPT DE CONTINUACIÓN - MOLECULES ROADMAP

## CONTEXTO DE LA SESIÓN ANTERIOR

### ✅ LOGROS COMPLETADOS:
- **Modal System**: 100% funcional y homologado con sistema de diseño V2.0
- **Patrón Props Extraction**: Establecido como regla arquitectural obligatoria  
- **TextInput**: 100% homologado tras eliminar generateStyles() y corregir 4 problemas críticos
- **Arquitectura Input System**: Definida división Input (átomo) vs TextInput (molécula)
- **DataTable Organism**: ✅ **AUDITADO Y APROBADO** - 100% conforme, listo para librería universal

### 🎯 PATRÓN MOLECULES V2.0 CONSOLIDADO:
```javascript
// ✅ REGLA OBLIGATORIA establecida y probada
const standardProps = useInteractiveProps(props, { ... });
const { size, variant, tokens, ...restProps } = standardProps;
const { isOpen, onClose, children } = props; // Props específicos desde props originales
const domProps = extractDOMPropsV2(restProps);
```

### ✅ DATATABLE ORGANISM - COMPLETADO
**Fecha:** 24 de agosto de 2025  
**Estado:** ✅ **100% CONFORME - Sin correcciones requeridas**  
**Resultado:** Organism perfecto, listo para @kike-dev/contextual-ui

**Métricas de éxito:**
- ✅ 0 generateStyles() utilizados
- ✅ 100% composición con átomos/moléculas del sistema  
- ✅ 5+ casos de uso reales funcionando idénticamente
- ✅ API universal probada en múltiples dominios
- ✅ Arquitectura organismo justificada por complejidad (574 líneas)

## PRÓXIMA FASE: CONTINUACIÓN MOLECULES ROADMAP

## PRÓXIMA FASE: CONTINUACIÓN MOLECULES ROADMAP

### 📊 **ESTADO ACTUAL MOLECULES - SESIÓN 25 AGOSTO 2025**

**✅ MOLECULES COMPLETADAS (10/14 auditadas - 71% PROGRESO):**
- **Modal**: Patrón base establecido (100% conforme) ✅
- **AlertModal**: Homologado con sistema V2.0 (100% conforme) ✅
- **TextInput**: Corregido completamente (100% conforme) ✅
- **Accordion**: generateStyles() eliminado (100% conforme) ✅
- **Tabs**: generateStyles() eliminado (100% conforme) ✅
- **Pagination**: 100% V2.0 desde cero (100% conforme) ✅
- **Breadcrumb**: generateStyles() eliminado (100% conforme) ✅
- **EmptyState**: generateStyles() eliminado (100% conforme) ✅
- **SearchBar**: ✅ **COMPLETADO HOY** - generateStyles() eliminado, useInteractiveProps V2.0 (100% conforme)
- **ContentCard**: ✅ **COMPLETADO HOY** - useCardProps eliminado, useInteractiveProps V2.0 estándar (100% conforme)

**🎯 MOLECULES PENDIENTES (4/14 restantes - 29%):**

#### **🔥 PRÓXIMA PRIORIDAD CRÍTICA:**

#### **🟢 PRIORIDAD MEDIA - Layout System**
4. **ClusterLayout** - Sistema de clustering responsive (necesita corrección)
5. **StackLayout** - Sistema de stacking vertical (necesita corrección) 
6. **ToastContainer** - Container de notificaciones (necesita corrección)

### 🎯 **PRÓXIMA RECOMENDACIÓN: EMPTYSTATE MOLECULE**

**¿Por qué EmptyState?**

#### **🔍 Uso intensivo identificado:**
- **DataTable**: Usado en estados vacíos de tabla
- **MainPage**: Estados sin contenido
- **SearchResults**: Sin resultados de búsqueda  
- **Categories/Movies/Series**: Listas vacías

#### **📋 Casos de uso EmptyState Molecule:**
- **Estados vacíos**: Listas sin elementos
- **Búsquedas sin resultados**: No hay matches
- **Errores de carga**: Contenido no disponible
- **Onboarding**: Primeros pasos

#### **🏗️ Arquitectura esperada EmptyState:**
```jsx
// ✅ MOLECULE SIMPLE esperada
<EmptyState
  icon="inbox"
  title="No hay elementos"
  description="Crea tu primer elemento para comenzar"
  action={<Button>Crear</Button>}
  variant="neutral"
  size="md"
/>
```

### 📁 **ANÁLISIS REQUERIDO PARA EMPTYSTATE:**

#### **PASO 1: Auditar EmptyState Existente**
```bash
# Confirmar implementación actual
read_file EmptyState.jsx → Revisar implementación V2.0
get_errors EmptyState.jsx → Verificar errores
```

#### **PASO 2: Corregir generateStyles()**
- Eliminar generateStyles() del hook
- Implementar CSS manual con design tokens
- Mantener composición con atoms (Icon, Typography, Button)

#### **PASO 3: Validar Universalidad**
- Verificar casos de uso universales vs específicos
- Confirmar API reutilizable en cualquier proyecto
- Validar props estándar (size, variant, rounded)

### 🎯 **OBJETIVO MOLECULES ROADMAP:**

Completar **5-8 molecules universales** más para tener una librería robusta:
- **Funcionalidad**: Cubrir casos desde simples hasta medios
- **Consistencia**: Patrón V2.0 en todas las molecules
- **Universalidad**: Útiles en cualquier proyecto, no solo streaming
- **Calidad**: Mantener estándar 10/10 establecido

## INSTRUCCIONES PARA CLAUDE:

1. **Buscar Table molecule existente** en el workspace
2. **Evaluar arquitectura actual** vs necesidades
3. **Aplicar patrón Molecules V2.0** establecido
4. **Mantener diferenciación clara** Table (simple) vs DataTable (complex)
5. **Preservar calidad 10/10** establecida en molecules anteriores

**PREGUNTA ESPECÍFICA**: ¿Existe Table molecule en el proyecto o necesitamos crearlo desde cero?

---

**� CONTEXTO**: Después de Table, continuar con Accordion, Tabs, Pagination según prioridades definidas para completar la librería molecules universal.
```bash
---

**💡 CONTEXTO**: Después de Table, continuar con Accordion, Tabs, Pagination según prioridades definidas para completar la librería molecules universal.
```

#### PASO 2: Análisis de Uso Real
- **MoviesListPage**: ¿Cómo usa DataTable? ¿Qué props específicas?
- **UsersListPage**: ¿Diferencias en implementación vs movies?
- **SeriesListPage**: ¿Patrones comunes o específicos?
- **EpisodesListPage**: ¿Complejidad adicional por relaciones?

#### PASO 3: Decisión de Migración
Evaluar 3 opciones:
1. **Mantener DataTable**: Auditar y limpiar código específico
2. **Refactor**: Separar DataTable universal + Streaming-específico
3. **Crear nuevo**: Table universal + mantener DataTable específico

### 🎯 OBJETIVO FINAL:
Definir la **arquitectura óptima** para tablas en el sistema de diseño, siguiendo los principios:
- **Atomic Design**: Clasificación correcta según complejidad
- **Reutilización**: Útil en cualquier dominio, no solo streaming
- **Consistencia**: Patrón coherente con Modal, AlertModal, TextInput
- **Funcionalidad**: Cubrir casos desde simples hasta complejos

### 📁 ARCHIVOS CLAVE A REVISAR:
- `/frontend/app/src/components/organisms/DataTable/DataTable.jsx` (confirmado que existe)
- `/frontend/app/src/components/organisms/DataTable/DataTable.css`
- `/frontend/app/src/components/organisms/DataTable/DataTable.stories.jsx` (si existe)
- **Páginas que lo usan**: MoviesListPage, UsersListPage, SeriesListPage, EpisodesListPage

### 🔄 CONTEXTO DEL PROYECTO:
- **Sistema de Diseño V2.0**: Props estándar (size, variant, rounded, disabled, loading)
- **Patrón Organisms V2.0**: Necesita ser definido basado en Molecules V2.0
- **Modal System**: Referencia arquitectural para componentes complejos
- **Streaming App**: DataTable usado intensivamente en todas las páginas de listas CRUD

## CRITERIOS DE EVALUACIÓN DATATABLE:

### ✅ MANTENER como ORGANISMO si:
- Funcionalidades avanzadas (filtros, paginación, ordenamiento, CRUD)
- Integración con múltiples molecules y atoms
- Más de 300 líneas de código
- Lógica compleja pero separable de dominio específico

### ✅ REFACTOR a UNIVERSAL si:
- Tiene lógica específica de streaming que puede separarse
- Core funcional es genérico (tablas, filtros, paginación)
- Puede mantenerse como organismo pero con API universal
- Vale la pena el esfuerzo de generalización

### ❌ ELIMINAR DE LIBRERÍA si:
- Demasiado acoplado al dominio streaming
- Imposible de generalizar sin romper funcionalidad
- API muy específica para movies/series/episodes
- No aporta valor a otros proyectos

### 🎯 RESULTADO ESPERADO:
- **Auditoría completa** de DataTable actual
- **Identificación** de código específico vs universal  
- **Decisión justificada** sobre inclusión en librería
- **Plan de acción** para limpieza o refactoring si aplica

## INSTRUCCIONES PARA CLAUDE:

1. **Auditar DataTable existente** como arquitecto de software experimentado
2. **Separar concerns** - identificar qué es universal vs dominio-específico
3. **Evaluar reutilización** - ¿sirve para proyectos más allá de streaming?
4. **Aplicar principios de librería** - generalización sin perder funcionalidad
5. **Mantener calidad 10/10** establecida en molecules anteriores

**PREGUNTA ESPECÍFICA**: ¿DataTable puede ser parte de la librería universal @kike-dev/contextual-ui o debe quedarse como componente específico del proyecto streaming?

## ESTADO ACTUAL DEL PROYECTO:

### ✅ COMPLETADO 100%:
- **20 Atoms**: Todos conformes con sistema V2.0
- **3 Molecules**: Modal, AlertModal, TextInput - arquitectura perfecta
- **Patrón V2.0**: Consolidado y probado

### 🎯 PRÓXIMO TARGET:
- **DataTable**: Auditar organismo existente y evaluar universalidad
- **Objetivo**: Decidir inclusión en librería o mantenerlo proyecto-específico
- **Meta**: Preservar arquitectura limpia en @kike-dev/contextual-ui

---

**💡 HINT**: DataTable es usado intensivamente en MoviesListPage, UsersListPage, SeriesListPage y EpisodesListPage. Analizar si la funcionalidad core (paginación, ordenamiento, filtros) es separable de la lógica específica de streaming (columnas de movies, series, etc.).