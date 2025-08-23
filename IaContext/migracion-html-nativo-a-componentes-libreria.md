# PLAN DE MIGRACIÓN: HTML NATIVO → COMPONENTES SISTEMA DE DISEÑO

## 🎯 OBJETIVO
Migrar todos los elementos HTML nativos a componentes del sistema de diseño para completar la extracción de la librería `@kike-dev/contextual-ui`.

## 📊 ANÁLISIS INICIAL COMPLETADO

### ✅ Estado Actual Identificado
- **1,604 ocurrencias** de `style={{}}` en 68 archivos
- **10+ páginas** con HTML nativo identificadas
- **68% son .stories.jsx** (documentación - OK)
- **32% son componentes de producción** (requieren migración)

### 🔍 Archivos Críticos Identificados
```
📁 Páginas con HTML nativo (Prioridad ALTA):
├── MoviesDetailPage/MoviesDetailPage.jsx          # img, div con styles inline
├── SeriesDetailPage/SeriesDetailPage.jsx          # div con styles inline  
├── Login/Login.jsx                                # div con styles inline
├── MainPage/MainPage.jsx                          # div con styles inline
├── VideoPlayerOverlay/VideoPlayerOverlay.jsx     # div con styles inline
└── TMDBSearchView/TMDBSearchView.jsx              # div con styles inline

📁 Páginas Admin con HTML nativo (Prioridad MEDIA):
├── Movies/MovieCreatePage/components/MovieFormView.jsx
├── Series/SeriesCreatePage/components/SeriesFormView.jsx  
├── Episodes/EpisodesCreatePage/EpisodesCreatePage.jsx
├── Episodes/EpisodesListPage/EpisodesListPage.jsx
├── Categories/CategoryCreatePage/CategoryCreatePage.jsx
└── Episodes/EpisodeEditPage/EpisodeEditPage.jsx
```

## 🔄 MAPEO HTML NATIVO → COMPONENTES SISTEMA

### **Elementos HTML Nativos Encontrados**
| HTML Nativo | Componente Sistema | Ubicación Más Crítica |
|-------------|-------------------|----------------------|
| `<img>` | `<ContentImage>` | MoviesDetailPage.jsx:220-230 |
| `<div style={{}}>` | `<Container>`, `<FlexContainer>` | Múltiples ubicaciones |
| `<button>` (si existe) | `<Button>` | - |
| `<input>` (si existe) | `<Input>` | - |
| `<span style={{}}>` | `<Typography>` | MoviesDetailPage.jsx:255-320 |

### **Casos Especiales Identificados**
```javascript
// ❌ PROBLEMA: MoviesDetailPage.jsx:220-230
<img
    src={movie.cover_image ? `${CDN_URL}/covers/${movie.cover_image}/cover.jpg` : placeholder}
    alt={`Carátula de ${movie.title}`}
    style={{
        width: '200px',
        height: '300px', 
        objectFit: 'cover',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)'
    }}
    onError={...}
/>

// ✅ SOLUCIÓN: Migrar a ContentImage
<ContentImage
    src={movie.cover_image}
    alt={`Carátula de ${movie.title}`}
    aspectRatio="2/3"
    size="lg"
    rounded="lg"
    shadow="lg"
    contentType="movie"
    placeholder="film"
    onError={...}
/>
```

## 📋 PLAN DE EJECUCIÓN POR FASES

### **FASE 1: AUDITORÍA DETALLADA (30 min)**
- [ ] **Ejecutar búsquedas específicas** por cada tipo de elemento HTML
- [ ] **Generar lista completa** de archivos afectados con líneas exactas  
- [ ] **Priorizar por impacto** (páginas públicas vs admin vs stories)
- [ ] **Verificar disponibilidad** de componentes del sistema para cada caso

### **FASE 2: MIGRACIÓN PÁGINAS CRÍTICAS (2 horas)**
**Orden de prioridad:**

#### **2.1 MoviesDetailPage.jsx** ⭐ MÁS CRÍTICO
```javascript
Migraciones requeridas:
- img → ContentImage (línea 220-230)
- div styles inline → FlexContainer + Container (línea 214-350)
- span con styles → Typography (línea 255-320)
- div con background/padding → Card o Badge (línea 255-290)
```

#### **2.2 SeriesDetailPage.jsx** ⭐ CRÍTICO
```javascript
Migraciones similares a MoviesDetailPage:
- img → ContentImage 
- div layouts → FlexContainer/Container
- span info → Typography + Badge
```

#### **2.3 Login.jsx** ⭐ CRÍTICO
```javascript
Verificar si existen:
- div containers → Container/FlexContainer
- Posibles inputs no usando sistema
```

#### **2.4 MainPage.jsx** 🔶 IMPORTANTE
```javascript
Layout y containers:
- div layouts → Layout components
- Posibles grids → GridContainer
```

### **FASE 3: MIGRACIÓN COMPONENTES ESPECIALIZADOS (1.5 horas)**

#### **3.1 VideoPlayerOverlay.jsx**
```javascript
Elementos de overlay y UI:
- div posicionamiento → FlexContainer con props específicos
- Posibles botones custom → Button del sistema
```

#### **3.2 TMDBSearchView.jsx**
```javascript
UI de búsqueda:
- div containers → Container/FlexContainer
- Posibles inputs → Input del sistema
```

### **FASE 4: MIGRACIÓN PÁGINAS ADMIN (2 horas)**
**Orden por facilidad:**

#### **4.1 CategoryCreatePage.jsx** (más simple)
#### **4.2 MovieFormView.jsx** 
#### **4.3 SeriesFormView.jsx**
#### **4.4 EpisodesCreatePage.jsx**
#### **4.5 EpisodesListPage.jsx**
#### **4.6 EpisodeEditPage.jsx**

### **FASE 5: VERIFICACIÓN Y LIMPIEZA (30 min)**
- [ ] **Ejecutar búsquedas de verificación** para HTML nativo restante
- [ ] **Probar funcionamiento** de páginas migradas
- [ ] **Verificar estilos** se mantienen correctamente
- [ ] **Documentar cambios** realizados

## 🔧 COMANDOS DE AUDITORÍA

### **Búsquedas Específicas por Ejecutar**
```bash
# 1. Elementos img nativos
grep -r "<img" frontend/app/src/Pages/ --include="*.jsx"

# 2. Divs con style inline  
grep -r "<div.*style=" frontend/app/src/Pages/ --include="*.jsx"

# 3. Spans con style inline
grep -r "<span.*style=" frontend/app/src/Pages/ --include="*.jsx"

# 4. Buttons nativos (si existen)
grep -r "<button" frontend/app/src/Pages/ --include="*.jsx"

# 5. Inputs nativos (si existen)
grep -r "<input" frontend/app/src/Pages/ --include="*.jsx"
```

### **Verificaciones Post-Migración**
```bash
# Verificar no quedan elementos nativos críticos
grep -r -E "<(img|button|input)(?![^>]*/>)" frontend/app/src/Pages/ --include="*.jsx"

# Verificar reducción de styles inline
grep -c "style={{" frontend/app/src/Pages/**/*.jsx

# Verificar uso correcto de componentes del sistema
grep -r "from.*components.*atoms" frontend/app/src/Pages/ --include="*.jsx"
```

## 📝 PLANTILLA DE MIGRACIÓN

### **Patrón de Migración Estándar**
```javascript
// ❌ ANTES: HTML nativo
<img 
    src={imageSrc}
    alt={imageAlt}
    style={{
        width: '200px',
        height: '300px',
        objectFit: 'cover',
        borderRadius: 'var(--radius-lg)'
    }}
/>

// ✅ DESPUÉS: Componente del sistema  
<ContentImage
    src={imageSrc}
    alt={imageAlt}
    size="lg"           // Equivale a width/height
    aspectRatio="2/3"   // Equivale a objectFit
    rounded="lg"        // Equivale a borderRadius
    contentType="movie" // Contexto específico
    placeholder="film"  // Fallback
/>
```

### **Patrón para Layouts**
```javascript
// ❌ ANTES: Divs con flexbox inline
<div style={{
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center',
    gap: 'var(--space-lg)',
    padding: 'var(--space-xl)'
}}>
    {content}
</div>

// ✅ DESPUÉS: Componentes de layout
<Container size="lg" padding="xl">
    <FlexContainer 
        justify="space-between"
        align="center" 
        spacing="lg"
    >
        {content}
    </FlexContainer>
</Container>
```

## 🎯 CRITERIOS DE ÉXITO

### **Métricas Objetivo Post-Migración**
- [ ] **0 elementos `<img>` nativos** en páginas de producción
- [ ] **<50 ocurrencias `style={{}}`** fuera de .stories.jsx
- [ ] **100% uso componentes sistema** en páginas críticas
- [ ] **0 regresiones visuales** en funcionalidad
- [ ] **Rendimiento mantenido** o mejorado

### **Validaciones Finales**
- [ ] **Storybook funciona** sin errores
- [ ] **Páginas cargan correctamente** con nuevos componentes
- [ ] **Estilos se mantienen** equivalentes
- [ ] **Responsive design** sigue funcionando
- [ ] **Props API consistente** en todos los componentes

## ⚡ SIGUIENTES PASOS

Una vez completada esta migración:

### **Inmediato (Fase 6)**
- [ ] **Generar reporte final** de migración completada
- [ ] **Actualizar documentación** de componentes utilizados
- [ ] **Preparar extracción librería** con componentes limpios

### **Próximo (Post-Migración)**
- [ ] **Configurar build librería** @kike-dev/contextual-ui
- [ ] **Extraer componentes genéricos** del proyecto
- [ ] **Configurar distribución npm** de la librería
- [ ] **Migrar StreamingApp** a usar librería externa

---

## 📅 ESTIMACIÓN TEMPORAL TOTAL

| Fase | Tiempo Estimado | Descripción |
|------|----------------|-------------|
| Fase 1 | 30 minutos | Auditoría detallada |
| Fase 2 | 2 horas | Páginas críticas |
| Fase 3 | 1.5 horas | Componentes especializados |
| Fase 4 | 2 horas | Páginas admin |
| Fase 5 | 30 minutos | Verificación final |
| **TOTAL** | **6.5 horas** | **Migración completa** |

---

*Documento creado el 2025-08-23 para planificar la migración de HTML nativo a componentes del sistema de diseño como prerrequisito para la extracción de la librería @kike-dev/contextual-ui.*