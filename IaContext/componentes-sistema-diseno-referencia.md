# 🎯 Referencia Rápida - Componentes del Sistema de Diseño

**📁 Ubicación:** `/frontend/app/src/components/`  
**🎨 Sistema:** `@kike-dev/contextual-ui`  
**📅 Actualizado:** Agosto 14, 2025  

---

## 🔍 **BÚSQUEDA RÁPIDA POR FUNCIÓN**

### **📝 Formularios & Inputs**
- `Input` - Texto básico → `/atoms/Input/Input.jsx`
- `TextInput` - Texto con label integrado → `/molecules/TextInput/TextInput.jsx`
- `TextSelect` - Select con label → `/molecules/TextSelect/TextSelect.jsx`
- `Select` - Dropdown básico → `/atoms/Select/Select.jsx`
- `FileInput` - Selector archivos → `/atoms/FileInput/FileInput.jsx`
- `FileInputField` - FileInput con label → `/molecules/FileInputField/FileInputField.jsx`
- `Checkbox` - Casilla verificación → `/atoms/Checkbox/Checkbox.jsx`
- `Label` - Etiquetas formulario → `/atoms/Label/Label.jsx`
- `DynamicForm` - Formularios dinámicos → `/molecules/DynamicForm/DynamicForm.jsx`

### **🖱️ Interacción & Navegación**
- `Button` - Botón base → `/atoms/Button/Button.jsx`
- `Link` - Enlaces Router → `/atoms/Link/Link.jsx`
- `Breadcrumb` - Navegación jerárquica → `/molecules/Breadcrumb/Breadcrumb.jsx`
- `Pagination` - Paginación → `/molecules/Pagination/Pagination.jsx`
- `Tabs` - Pestañas → `/molecules/Tabs/Tabs.jsx`
- `Accordion` - Contenido colapsable → `/molecules/Accordion/Accordion.jsx`

### **🖼️ Display & Contenido**
- `Card` - Tarjeta base → `/atoms/Card/Card.jsx`
- `ContentCard` - Tarjeta contenido → `/molecules/ContentCard/ContentCard.jsx`
- `Container` - Contenedor layout → `/atoms/Container/Container.jsx`
- `ContentSection` - Sección contenido → `/molecules/ContentSection/ContentSection.jsx`
- `Avatar` - Imagen usuario → `/atoms/Avatar/Avatar.jsx`
- `ContentImage` - Imagen contenido → `/atoms/ContentImage/ContentImage.jsx`
- `Badge` - Etiquetas estado → `/atoms/Badge/Badge.jsx`
- `Divider` - Separador visual → `/atoms/Divider/Divider.jsx`

### **⚡ Estados & Feedback**
- `Spinner` - Loading básico → `/atoms/Spinner/Spinner.jsx`
- `Skeleton` - Loading placeholders → `/atoms/Skeleton/Skeleton.jsx`
- `Toast` - Notificaciones → `/atoms/Toast/Toast.jsx`
- `ToastContainer` - Contenedor toasts → `/molecules/ToastContainer/ToastContainer.jsx`
- `EmptyState` - Estados vacíos → `/molecules/EmptyState/EmptyState.jsx`
- `ProgressModal` - Modal progreso → `/molecules/ProgressModal/ProgressModal.jsx`
- `UploadProgress` - Progreso subida → `/atoms/UploadProgress/UploadProgress.jsx`

### **🔍 Búsqueda & Filtrado**
- `SearchBar` - Barra búsqueda → `/molecules/SearchBar/SearchBar.jsx`
- `FilterBar` - Filtros → `/molecules/FilterBar/FilterBar.jsx`

### **📊 Data Display**
- `StatsCard` - Tarjeta estadísticas → `/molecules/StatsCard/StatsCard.jsx`

### **🎨 Interfaz & Tema**
- `Icon` - Iconos Feather → `/atoms/Icon/Icon.jsx`
- `ThemeSelector` - Selector tema → `/atoms/ThemeSelector/ThemeSelector.jsx`

### **🪟 Modales & Overlays**
- `Modal` - Modal base → `/molecules/Modal/Modal.jsx`
- `AlertModal` - Confirmaciones → `/molecules/AlertModal/AlertModal.jsx`

---

## ⚛️ **ÁTOMOS (Componentes Base)**

| Componente | Ruta | Props Clave | Usa renderIcon | Casos de Uso |
|------------|------|-------------|----------------|--------------|
| **Avatar** | `/atoms/Avatar/Avatar.jsx` | `src, size, variant, fallback` | ✅ | Perfiles usuario, comentarios |
| **Badge** | `/atoms/Badge/Badge.jsx` | `variant, size, leftIcon, rightIcon` | ✅ | Estados, contadores, categorías |
| **Button** | `/atoms/Button/Button.jsx` | `variant, size, leftIcon, rightIcon, loading` | ✅ | Acciones primarias, formularios |
| **Card** | `/atoms/Card/Card.jsx` | `variant, size, rounded, padding` | ✅ | Contenedores básicos |
| **Checkbox** | `/atoms/Checkbox/Checkbox.jsx` | `checked, disabled, size, variant` | ✅ | Formularios, selecciones |
| **Container** | `/atoms/Container/Container.jsx` | `size, variant, maxWidth` | ❌ | Layout, espaciado |
| **ContentImage** | `/atoms/ContentImage/ContentImage.jsx` | `src, alt, fallback, loading` | ✅ | Posters, thumbnails |
| **Divider** | `/atoms/Divider/Divider.jsx` | `variant, size, orientation` | ❌ | Separadores visuales |
| **FileInput** | `/atoms/FileInput/FileInput.jsx` | `accept, multiple, maxSize` | ✅ | Subida archivos |
| **Icon** | `/atoms/Icon/Icon.jsx` | `name, size, variant, spinning` | ❌ | Sistema iconos base |
| **Input** | `/atoms/Input/Input.jsx` | `type, placeholder, leftIcon, rightIcon` | ✅ | Campos texto básicos |
| **Label** | `/atoms/Label/Label.jsx` | `required, optional, leftIcon` | ✅ | Etiquetas formularios |
| **Link** | `/atoms/Link/Link.jsx` | `to, variant, leftIcon, rightIcon` | ✅ | Navegación React Router |
| **Select** | `/atoms/Select/Select.jsx` | `options, placeholder, variant` | ✅ | Dropdowns básicos |
| **Skeleton** | `/atoms/Skeleton/Skeleton.jsx` | `width, height, variant, animated` | ❌ | Loading placeholders |
| **Spinner** | `/atoms/Spinner/Spinner.jsx` | `size, variant, message` | ❌ | Loading states |
| **ThemeSelector** | `/atoms/ThemeSelector/ThemeSelector.jsx` | `themes, current, onChange` | ✅ | Selector tema app |
| **Toast** | `/atoms/Toast/Toast.jsx` | `variant, title, message, onClose` | ✅ | Notificaciones |
| **UploadProgress** | `/atoms/UploadProgress/UploadProgress.jsx` | `progress, filename, onCancel` | ✅ | Progreso subidas |

---

## 🧬 **MOLÉCULAS (Componentes Compuestos)**

| Componente | Ruta | Props Clave | Usa Icon directo | Casos de Uso |
|------------|------|-------------|------------------|--------------|
| **Accordion** | `/molecules/Accordion/Accordion.jsx` | `items, multiple, variant` | ✅ | FAQ, contenido colapsable |
| **AlertModal** | `/molecules/AlertModal/AlertModal.jsx` | `type, title, message, onConfirm` | ✅ | Confirmaciones críticas |
| **Breadcrumb** | `/molecules/Breadcrumb/Breadcrumb.jsx` | `items, separator, maxItems` | ✅ | Navegación jerárquica |
| **ContentCard** | `/molecules/ContentCard/ContentCard.jsx` | `title, image, actions` | ✅ | Películas, series |
| **ContentSection** | `/molecules/ContentSection/ContentSection.jsx` | `title, subtitle, actions` | ✅ | Secciones contenido |
| **DynamicForm** | `/molecules/DynamicForm/DynamicForm.jsx` | `fields, onSubmit, loading` | ✅ | Formularios configurables |
| **EmptyState** | `/molecules/EmptyState/EmptyState.jsx` | `title, description, actions` | ✅ | Estados sin datos |
| **FileInputField** | `/molecules/FileInputField/FileInputField.jsx` | `label, accept, multiple` | ✅ | Upload con label |
| **FilterBar** | `/molecules/FilterBar/FilterBar.jsx` | `filters, onFilterChange` | ✅ | Filtrado datos |
| **Modal** | `/molecules/Modal/Modal.jsx` | `isOpen, onClose, title, size` | ❌ | Base para modales |
| **Pagination** | `/molecules/Pagination/Pagination.jsx` | `currentPage, totalPages, onPageChange` | ✅ | Paginación datos |
| **ProgressModal** | `/molecules/ProgressModal/ProgressModal.jsx` | `isOpen, progress, title` | ✅ | Progreso operaciones |
| **SearchBar** | `/molecules/SearchBar/SearchBar.jsx` | `placeholder, onSearch, filters` | ✅ | Búsqueda completa |
| **StatsCard** | `/molecules/StatsCard/StatsCard.jsx` | `title, value, icon, trend` | ✅ | Dashboard estadísticas |
| **Tabs** | `/molecules/Tabs/Tabs.jsx` | `tabs, activeTab, onChange` | ✅ | Navegación pestañas |
| **TextInput** | `/molecules/TextInput/TextInput.jsx` | `label, error, helper, leftIcon` | ✅ | Input completo |
| **TextSelect** | `/molecules/TextSelect/TextSelect.jsx` | `label, options, error` | ✅ | Select completo |
| **ToastContainer** | `/molecules/ToastContainer/ToastContainer.jsx` | `toasts, position, maxToasts` | ✅ | Contenedor notificaciones |

---

## 📋 **REGLAS DE USO RÁPIDAS**

### **🔧 Iconos - Regla Fundamental**
```javascript
// ✅ COMPONENTES BASE (átomos/moléculas) = renderIcon
const Button = ({ leftIcon }) => {
  const renderIcon = createStandardIconRenderer('button', size);
  return renderIcon(leftIcon);
};

// ✅ COMPONENTES APLICACIÓN (páginas/organismos) = Icon directo
<Icon name="warning" size="lg" variant="danger" />
```

### **📐 Props Estándar (Todos los componentes)**
```javascript
// Props universales del sistema
size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
rounded: 'sm' | 'md' | 'lg' | 'xl' | 'full'
disabled: boolean
loading: boolean
className: string
```

### **🎯 Importación Recomendada**
```javascript
// ✅ Import específico desde átomos/moléculas
import { Button, Input, Badge } from '../components/atoms/';
import { Modal, AlertModal, SearchBar } from '../components/molecules/';

// ❌ Evitar imports absolutos largos
import { Button } from '../../../components/atoms/Button/Button';
```

---

## 🚀 **COMPONENTES LISTO PARA USAR**

### **🟢 Producción Ready (Storybook completo)**
- Button, Input, Badge, Card, Modal, AlertModal
- Icon, Label, Container, Divider, Spinner
- Breadcrumb, Pagination, SearchBar, FilterBar
- Toast, EmptyState, StatsCard, ContentCard

### **🟡 En Desarrollo (Storybook parcial)**
- ContentImage, ThemeSelector, FileInputField
- ImageCropField, ProgressModal, Accordion

### **🔴 Específicos del Dominio (No reutilizables)**
- SeasonSelector, EpisodeListItem, ActionsDropdown
- ImageCropperModal

---

## 🔍 **COMANDOS DE BÚSQUEDA ÚTILES**

```bash
# Buscar componente por nombre
find . -name "*Button*" -type f

# Buscar uso de renderIcon (componentes BASE)
grep -r "renderIcon" frontend/app/src/components/atoms/
grep -r "renderIcon" frontend/app/src/components/molecules/

# Buscar uso de Icon directo (componentes APLICACIÓN)
grep -r "<Icon name" frontend/app/src/Pages/
grep -r "<Icon name" frontend/app/src/components/organisms/

# Ver Storybook de componente
ls frontend/app/src/components/atoms/Button/Button.stories.jsx
```

---

**💡 TIP:** Antes de crear un componente nuevo, verificar:
1. ¿Existe en esta lista?
2. ¿Se puede componer con componentes existentes?
3. ¿Es específico del dominio streaming o genérico?
4. ¿Tiene Storybook completo?