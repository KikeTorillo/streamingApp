# PLAN DE MIGRACIÓN V2 - CONTINUACIÓN POST ATOMS CRÍTICOS

**Fecha:** 24 Agosto 2025  
**Estado:** 4/43 componentes migrados (Button, Input, Select, Badge)  
**Siguiente Prioridad:** GridContainer (problema fondo gris detectado)

## 📊 PROGRESO ACTUAL

### ✅ COMPLETADOS (4)
- **Button V2** - Template de referencia perfecto
- **Input V2** - JSX + CSS, compatible con Sistema V2
- **Select V2** - JSX + CSS, compatible con Sistema V2  
- **Badge V2** - JSX + CSS, compatible con Sistema V2

### 🎯 PRÓXIMOS OBJETIVOS

## FASE 1: CONTAINERS CRÍTICOS (Prioridad Alta)

### 1. **GridContainer** - URGENTE ⚠️
**Problema Detectado:** Fondo gris no homologado al sistema de diseño

**Tareas:**
- [ ] Investigar implementación actual de GridContainer
- [ ] Identificar origen del fondo gris problemático
- [ ] Migrar a Sistema V2 usando `useContainerProps` hook
- [ ] Homologar colores al sistema centralizado de variables
- [ ] Verificar que use tokens de color correctos (`--bg-primary`, `--bg-secondary`, etc.)
- [ ] Asegurar compatibilidad responsive
- [ ] Testing en modo claro/oscuro

**Archivos esperados:**
- `/frontend/app/src/components/molecules/GridContainer/GridContainer.jsx`
- `/frontend/app/src/components/molecules/GridContainer/GridContainer.css`

### 2. **FlexContainer** (Si existe)
**Tareas:**
- [ ] Localizar y revisar implementación actual
- [ ] Migrar siguiendo patrón GridContainer V2
- [ ] Homologar al sistema de diseño

### 3. **Container Base** (Si existe)
**Tareas:**
- [ ] Verificar si existe contenedor base genérico
- [ ] Migrar a Sistema V2 con tokens centralizados

## FASE 2: MOLECULES CRÍTICOS (Después de Containers)

### 4. **Card Component**
**Importancia:** Usado en toda la aplicación para mostrar contenido
- [ ] Migrar a Sistema V2
- [ ] Verificar elevación y sombras correctas
- [ ] Homologar colores de fondo y borde

### 5. **Modal Component**
**Importancia:** Interacciones críticas del usuario
- [ ] Migrar a Sistema V2
- [ ] Verificar overlay y z-index
- [ ] Homologar colores de backdrop

### 6. **DynamicForm Component**
**Importancia:** Formularios principales de la aplicación
- [ ] Migrar a Sistema V2
- [ ] Verificar compatibilidad con Input/Select V2 migrados

## FASE 3: ATOMS FALTANTES

### 7. **Typography Component**
- [ ] Migrar usando `useTypographyProps`
- [ ] Verificar escalas tipográficas V2

### 8. **Icon Component**
- [ ] Verificar compatibilidad con sistema de iconos V2
- [ ] Asegurar renderizado correcto con `renderIcon`

### 9. **Textarea Component** (Crear si no existe)
- [ ] Implementar siguiendo patrón Input V2
- [ ] JSX + CSS completo

## FASE 4: ORGANISMS Y TEMPLATES

### 10-15. **Páginas Admin**
- [ ] UsersListPage
- [ ] MoviesListPage  
- [ ] SeriesListPage
- [ ] EpisodesListPage
- [ ] CategoriesListPage

### 16. **AdminLayout Template**
- [ ] Verificar compatibilidad con containers V2

## METODOLOGÍA DE TRABAJO

### Para cada componente:
1. **Investigación** (5 min)
   - Localizar archivos JSX + CSS
   - Entender implementación actual
   - Identificar problemas (como el fondo gris de GridContainer)

2. **Migración** (15-20 min)
   - Aplicar patrón V2 correspondiente:
     - Containers: `useContainerProps`
     - Interactivos: `useInteractiveProps` 
     - Tipografía: `useTypographyProps`
   - Actualizar CSS con tokens centralizados
   - Mantener 100% backward compatibility

3. **Verificación** (5 min)
   - Testing visual básico
   - Verificar que funcione en modo claro/oscuro
   - Confirmar no regresiones

### Patrones V2 de Referencia:
- **Button V2**: Template para interactivos
- **Input V2**: Template para forms
- **GridContainer V2**: Template para containers (próximo)

## PROBLEMAS CONOCIDOS A RESOLVER

### 1. **GridContainer - Fondo Gris**
**Síntoma:** Fondo gris que no respeta sistema de diseño
**Posibles Causas:**
- CSS hardcodeado (`background: #gray`)
- Variable incorrecta (`--bg-gray` en lugar de `--bg-primary`)
- Falta de tokens centralizados
**Solución Esperada:** Usar `--bg-primary`, `--bg-secondary` del sistema

### 2. **Consistencia de Colores**
**Objetivo:** Todos los containers deben usar variables centralizadas:
```css
/* ❌ INCORRECTO */
background-color: #f5f5f5;

/* ✅ CORRECTO */
background-color: var(--bg-primary);
```

## CRITERIOS DE ÉXITO

### Por Componente:
- ✅ Usa hooks V2 correspondientes
- ✅ CSS con tokens centralizados únicamente
- ✅ 100% backward compatibility
- ✅ Zero regresiones funcionales
- ✅ Funciona en modo claro/oscuro

### General:
- ✅ **GridContainer**: Fondo homologado al sistema
- ✅ **Containers**: Colores consistentes con design system
- ✅ **Performance**: Igual o mejor que V1
- ✅ **Documentación**: Cada componente V2 documentado

## MÉTRICAS DE PROGRESO

### Target por Sesión:
- **Sesión Containers:** GridContainer + FlexContainer (2 componentes)
- **Sesión Molecules:** Card + Modal + DynamicForm (3 componentes)  
- **Sesión Atoms:** Typography + Icon + Textarea (3 componentes)
- **Sesión Organisms:** 5 páginas admin (5 componentes)

### Objetivo Final:
**43 componentes migrados al Sistema V2 perfecto**
- Listos para extracción a `@kike-dev/contextual-ui`
- Librería comercial completa y consistente
- Zero deuda técnica de migración

## SIGUIENTE ACCIÓN INMEDIATA

**🎯 PRÓXIMA SESIÓN:** Investigar y migrar **GridContainer**
1. Localizar archivos actuales
2. Identificar origen del problema de fondo gris
3. Migrar a Sistema V2 con tokens correctos
4. Verificar funcionamiento correcto

---

**📝 Notas:**
- Mantener este documento actualizado con progreso
- Cada componente migrado añadirlo a sección "COMPLETADOS"
- Documentar problemas encontrados para referencia futura