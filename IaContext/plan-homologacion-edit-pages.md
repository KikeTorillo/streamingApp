# 📋 Plan de Homologación - Páginas de Edición con Layout de 2 Columnas

## 🎯 Objetivo
Homologar todas las páginas de edición del sistema admin para que tengan el mismo layout moderno de 2 columnas, mejorando la experiencia de usuario y manteniendo consistencia visual.

## ✅ Estado Actual

### **COMPLETADO:**
- ✅ **MovieEditPage** - Layout de 2 columnas implementado con Container del sistema de diseño
- ✅ **UserEditPage** - Homologado con MovieEditPage, incluye avatar circular personalizado
- ✅ **SeriesEditPage** - Homologado con patrón de 2 columnas
- ✅ **EpisodeEditPage** - Homologado con patrón de 2 columnas

---

## 🎨 Patrón Estándar Establecido

### **🏗️ Estructura Base (Aplicar a todas las páginas Edit):**

```jsx
<AdminLayout>
  <div className="[entity]-edit">
    
    {/* Notificaciones */}
    {success && <Container variant="success" className="edit-notification">...}
    {error && <Container variant="danger" className="edit-notification">...}

    {/* Layout Principal de 2 Columnas */}
    <div className="[entity]-edit__layout">
      
      {/* Columna Izquierda - Información Actual */}
      <div className="[entity]-edit__sidebar">
        <Container variant="neutral" size="lg" className="info-panel">
          <div className="info-panel__header">
            <h3 className="info-panel__title">📋 Información Actual</h3>
            <Badge variant="primary" size="sm">ID: {currentEntity?.id}</Badge>
          </div>
          
          <Divider variant="neutral" size="sm" />
          
          {/* Imagen/Avatar específico por entidad */}
          <div className="info-panel__[media-type]">...</div>

          <Divider variant="neutral" size="sm" />

          {/* Detalles específicos por entidad */}
          <div className="info-panel__details">
            <h4 className="info-panel__subtitle">Detalles</h4>
            {/* info-detail items específicos */}
          </div>
        </Container>
      </div>

      {/* Columna Derecha - Formulario de Edición */}
      <div className="[entity]-edit__main">
        <Container variant="neutral" size="xl" className="edit-form-container">
          <div className="edit-form-container__header">
            <h3 className="edit-form-container__title">✏️ Editar Información</h3>
            <p className="edit-form-container__subtitle">Descripción específica...</p>
          </div>

          <Divider variant="neutral" size="md" />

          <div className="edit-form-container__form">
            <DynamicForm ... />
          </div>
        </Container>
      </div>
    </div>
  </div>
</AdminLayout>
```

### **📱 CSS Base Reutilizable:**

```css
/* Layout Principal */
.[entity]-edit__layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  align-items: start;
  min-height: 600px;
}

/* Sidebar Sticky */
.[entity]-edit__sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 1024px) {
  .[entity]-edit__layout {
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .[entity]-edit__layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .[entity]-edit__sidebar {
    position: static;
    max-height: none;
  }
}
```

---

## 📋 Plan de Implementación

### **🎬 FASE 1: SeriesEditPage**

#### **📁 Archivos a Modificar:**
- `/Pages/Admin/Series/SeriesEditPage/SeriesEditPage.jsx`
- `/Pages/Admin/Series/SeriesEditPage/SeriesEditPage.css`

#### **🔍 Análisis Previo Requerido:**
1. **Revisar estructura actual** de SeriesEditPage
2. **Identificar campos editables** específicos de series
3. **Verificar contextos y hooks** utilizados (SeriesContext)
4. **Analizar diferencias** con MovieEditPage

#### **🎯 Adaptaciones Específicas para Series:**

**Información del Sidebar:**
- **Imagen**: Portada de la serie (como MovieEditPage)
- **Detalles específicos**:
  - Título de la serie
  - Categoría
  - Año de estreno
  - Estado (En emisión, Finalizada, etc.)
  - Número de temporadas
  - Número total de episodios
  - Descripción (truncada)

**Formulario de Edición:**
- Campos específicos de series según el backend
- Validaciones propias de series
- Manejo de estados específicos (activa, finalizada, etc.)

#### **📝 Campos de Información Esperados:**
```jsx
<div className="info-detail">
  <span className="info-detail__label">Título:</span>
  <span className="info-detail__value">{currentSeries?.title}</span>
</div>
<div className="info-detail">
  <span className="info-detail__label">Categoría:</span>
  <span className="info-detail__value">{categories.find(...)?.name}</span>
</div>
<div className="info-detail">
  <span className="info-detail__label">Año:</span>
  <span className="info-detail__value">{currentSeries?.release_year}</span>
</div>
<div className="info-detail">
  <span className="info-detail__label">Estado:</span>
  <span className="info-detail__value">{currentSeries?.status}</span>
</div>
<div className="info-detail">
  <span className="info-detail__label">Temporadas:</span>
  <span className="info-detail__value">{currentSeries?.total_seasons || 0}</span>
</div>
<div className="info-detail">
  <span className="info-detail__label">Episodios:</span>
  <span className="info-detail__value">{currentSeries?.total_episodes || 0}</span>
</div>
```

### **📺 FASE 2: EpisodeEditPage**

#### **📁 Archivos a Modificar:**
- `/Pages/Admin/Episodes/EpisodeEditPage/EpisodeEditPage.jsx`
- `/Pages/Admin/Episodes/EpisodeEditPage/EpisodeEditPage.css`

#### **🎯 Adaptaciones Específicas para Episodes:**

**Información del Sidebar:**
- **Imagen**: Thumbnail del episodio o placeholder 📺
- **Detalles específicos**:
  - Título del episodio
  - Serie a la que pertenece
  - Temporada y número de episodio
  - Duración
  - Fecha de estreno
  - Estado de disponibilidad

**Casos Especiales:**
- **Relación con Serie**: Mostrar información de la serie padre
- **Navegación contextual**: Posibles enlaces a la serie y temporada
- **Validaciones específicas**: Número de episodio único por temporada

#### **📝 Campos de Información Esperados:**
```jsx
<div className="info-detail">
  <span className="info-detail__label">Título:</span>
  <span className="info-detail__value">{currentEpisode?.title}</span>
</div>
<div className="info-detail">
  <span className="info-detail__label">Serie:</span>
  <span className="info-detail__value">{currentEpisode?.series_title}</span>
</div>
<div className="info-detail">
  <span className="info-detail__label">Temporada:</span>
  <span className="info-detail__value">T{currentEpisode?.season_number}</span>
</div>
<div className="info-detail">
  <span className="info-detail__label">Episodio:</span>
  <span className="info-detail__value">E{currentEpisode?.episode_number}</span>
</div>
<div className="info-detail">
  <span className="info-detail__label">Duración:</span>
  <span className="info-detail__value">{currentEpisode?.duration} min</span>
</div>
```

---

## 🚫 Reglas de Implementación

### **❌ NO HACER:**
1. **No agregar funcionalidades extras** (botones, acciones) que no estén en la versión original
2. **No cambiar la lógica existente** de formularios o validaciones
3. **No modificar los campos editables** definidos en el backend
4. **No agregar navegación adicional** sin consultar primero

### **✅ SÍ HACER:**
1. **Mantener toda la funcionalidad existente**
2. **Usar únicamente componentes del sistema de diseño**
3. **Seguir exactamente el patrón de MovieEditPage/UserEditPage**
4. **Respetar responsive design established**
5. **Mantener consistencia en naming conventions**

---

## 🔧 Herramientas y Componentes a Utilizar

### **🎨 Componentes del Sistema de Diseño:**
- `Container` - Para panels y secciones principales
- `Divider` - Para separar secciones (variant="neutral")
- `Badge` - Para mostrar IDs (variant="primary", size="sm")
- `ContentImage` - Para portadas de series/episodes

### **📱 Clases CSS Estándar:**
- `info-panel` - Panel de información lateral
- `info-panel__header` - Header con título y badge
- `info-panel__title` - Título del panel
- `info-panel__subtitle` - Subtítulos de secciones
- `info-detail` - Container de cada detalle
- `info-detail__label` - Label del detalle
- `info-detail__value` - Valor del detalle
- `edit-form-container` - Container del formulario
- `edit-form-container__header` - Header del formulario
- `edit-form-container__title` - Título del formulario
- `edit-form-container__subtitle` - Descripción del formulario

---

## 📊 Criterios de Éxito

### **✅ Criterios de Aceptación:**

1. **Layout Homologado**: Misma estructura de 2 columnas que MovieEditPage/UserEditPage
2. **Responsive Funcional**: Se adapta correctamente a mobile/tablet/desktop
3. **Sistema de Diseño**: Usa únicamente componentes del sistema (`Container`, `Divider`, `Badge`)
4. **Funcionalidad Preservada**: Todo funciona igual que antes, solo cambia el layout
5. **Información Contextual**: Sidebar muestra información relevante y específica para cada entidad
6. **Consistencia Visual**: Mismo look & feel entre todas las páginas Edit

### **🧪 Testing Checklist:**

- [ ] **Desktop (1024px+)**: Layout de 2 columnas funciona correctamente
- [ ] **Tablet (768px-1024px)**: Layout de 2 columnas ajustado funciona
- [ ] **Mobile (<768px)**: Layout de 1 columna funciona, orden natural
- [ ] **Sticky Sidebar**: Se mantiene visible al hacer scroll en desktop
- [ ] **Formulario**: Mantiene toda la funcionalidad original
- [ ] **Navegación**: Breadcrumbs y botones funcionan igual
- [ ] **Estados**: Loading, error y success se muestran correctamente

---

## 📅 Cronograma Sugerido

### **Fase 1 - SeriesEditPage (Prioridad 1):**
- **Estimación**: 2-3 horas
- **Tareas**:
  1. Análisis de estructura actual (30 min)
  2. Implementación del layout (90 min)
  3. Testing y ajustes responsive (60 min)

### **Fase 2 - EpisodeEditPage (Prioridad 2):**
- **Estimación**: 2-3 horas 
- **Tareas**:
  1. Análisis de estructura actual (30 min)
  2. Implementación del layout (90 min)
  3. Testing y ajustes responsive (60 min)

### **Total Estimado**: 4-6 horas para completar la homologación completa

---

## 🎯 Resultado Final Esperado

Al completar este plan, tendremos **4 páginas de edición homologadas**:

1. ✅ **MovieEditPage** - Completa
2. ✅ **UserEditPage** - Completa  
3. 🔄 **SeriesEditPage** - Por implementar
4. 🔄 **EpisodeEditPage** - Por implementar

Todas con:
- **Layout consistente de 2 columnas**
- **Información contextual en sidebar sticky**
- **Formularios espaciosos en columna principal**
- **Responsive design optimizado**
- **Sistema de diseño respetado al 100%**

## 📝 Notas de Implementación

- **Seguir exactamente** el patrón establecido en MovieEditPage/UserEditPage
- **No inventar nuevos componentes** o patrones
- **Preguntar antes** de agregar funcionalidades no solicitadas
- **Probar exhaustivamente** en diferentes tamaños de pantalla
- **Mantener nomenclatura consistente** entre todas las páginas