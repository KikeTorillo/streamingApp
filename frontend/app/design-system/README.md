# 📊 Design System - @kike-dev/contextual-ui

> **Documentación Completa para Desarrolladores y Agentes IA**  
> API exhaustiva de todos los componentes, props y patrones del sistema V2.0

---

## 🎯 **ESTRUCTURA DEL SISTEMA**

### Arquitectura V2.0 Especializada
El design system utiliza **hooks especializados** que proporcionan APIs diferentes según el tipo de componente:

- **🎪 Interactive** (Button, Input, Badge) - Elementos con interacción
- **📝 Typography** (Typography) - Elementos tipográficos con escala editorial  
- **📦 Container** (Container, FlexContainer, GridContainer) - Elementos de layout

### Hooks Disponibles
- **`useInteractiveProps()`** - Para componentes interactivos
- **`useTypographyProps()`** - Para componentes tipográficos
- **`useContainerProps()`** - Para componentes contenedores
- **`useBreakpoint()`** - Utilidad para responsive
- **`useResponsiveValue()`** - Utilidad para valores responsive

---

## 📦 **COMPONENTES ÁTOMOS**

### 1. Container
**Contenedor base para layouts**

```javascript
<Container 
  size="xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|full|screen"  // Tamaño máximo
  variant="neutral|primary|secondary|success|warning|danger"  // Variante semántica
  padding="xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl"  // Padding interno
  width="auto|full|fit-content"                 // Ancho del contenedor
  as="div|section|main|article|header|footer"   // Elemento HTML
  rounded="none|xs|sm|md|lg|xl|2xl|3xl|full"    // Radio de bordes
  shadow="none|xs|sm|md|lg|xl|2xl|3xl"          // Elevación
  style={objeto}                                // ✅ Para valores no disponibles como props
/>
```

**❗ Props NO disponibles como props directas:**
- `minHeight` → usar `style={{ minHeight: '100vh' }}`
- `maxWidth` → usar `style={{ maxWidth: '400px' }}` (override del size)

---

### 2. FlexContainer
**Contenedor Flexbox con API completa**

```javascript
<FlexContainer 
  direction="row|column|row-reverse|column-reverse"       // Dirección flex
  align="flex-start|center|flex-end|stretch|baseline"     // align-items
  justify="flex-start|center|flex-end|space-between|space-around|space-evenly"  // justify-content
  wrap="nowrap|wrap|wrap-reverse"                         // flex-wrap
  gap="xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl"              // Gap entre elementos
  padding="xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl"          // Padding interno
  width="auto|full|fit-content"                          // Ancho del contenedor
  grow={boolean}                                         // ✅ flex-grow: 1
  shrink={boolean}                                       // flex-shrink: 1
  inline={boolean}                                       // display: inline-flex
  distribute={boolean}                                   // flex: 1 para cada hijo
  // Props estándar del sistema
  size="xs|sm|md|lg|xl"                    
  variant="neutral|primary|secondary|success|warning|danger"
  rounded="none|xs|sm|md|lg|xl|2xl|3xl|full"
  shadow="none|xs|sm|md|lg|xl|2xl|3xl"
  style={objeto}                                         // Para overrides
/>
```

**✅ Props especiales disponibles:**
- `grow={true}` → aplica `flex-grow: 1` al contenedor
- `maxWidth="400px"` → **NO disponible**, usar `style={{ maxWidth: '400px' }}`
- `minHeight="100vh"` → **NO disponible**, usar `style={{ minHeight: '100vh' }}`

---

### 3. GridContainer
**Sistema de Grid CSS completo**

```javascript
<GridContainer
  columns="1fr 1fr|repeat(3, 1fr)|repeat(auto-fill, minmax(280px, 1fr))"  // Template columns
  rows="auto|1fr 2fr|repeat(3, minmax(10rem, auto))"     // Template rows
  gap="xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl"              // Gap entre elementos
  columnGap="xs|sm|md|lg|xl|2xl"                         // Gap específico columnas
  rowGap="xs|sm|md|lg|xl|2xl"                            // Gap específico filas
  areas='"header header" "sidebar main"'                 // Grid template areas
  autoRows="auto|min-content|max-content|1fr"            // Grid auto rows
  minColumnWidth="20rem|300px"                           // Ancho mínimo columnas
  dense={boolean}                                        // Grid auto-flow dense
  inline={boolean}                                       // display: inline-grid
  // Props estándar del sistema
  size="xs|sm|md|lg|xl"
  padding="xs|sm|md|lg|xl|2xl"
  variant="neutral|primary|secondary|success|warning|danger"
  rounded="none|xs|sm|md|lg|xl|2xl|3xl|full"
  shadow="none|xs|sm|md|lg|xl|2xl|3xl"
/>

// Para hijos con área específica
<Container area="header">Content</Container>
```

---

### 4. Button
**Botón interactivo con iconos y estados**

```javascript
<Button 
  size="xs|sm|md|lg|xl"                                  // Tamaño interactivo
  variant="primary|secondary|success|warning|danger|neutral"  // Variante semántica
  rounded="none|xs|sm|md|lg|xl|2xl|3xl|full"            // Radio de bordes
  width="auto|full|fit-content|min-content|max-content"  // Ancho del botón
  leftIcon="plus|edit|delete|search|user"               // ✅ String del sistema o ReactNode
  rightIcon="arrow-right|external|chevron-down"         // ✅ String del sistema o ReactNode
  iconOnly={boolean}                                     // Solo mostrar icono
  loading={boolean}                                      // Estado de carga con spinner
  disabled={boolean}                                     // Estado deshabilitado
  type="button|submit|reset"                             // Tipo HTML
  onClick={function}                                     // Handler de click
  shadow="none|xs|sm|md|lg|xl|2xl|3xl"                  // Elevación
>
  Texto del botón
</Button>
```

**Ejemplo común:**
```javascript
<Button 
  variant="primary" 
  size="lg" 
  leftIcon="plus" 
  onClick={handleCreate}
>
  Crear Nuevo
</Button>
```

---

### 5. Input
**Campo de entrada con iconos, validación y sistema de tamaños fijos estándar**

```javascript
<Input 
  type="text|password|email|number|tel|url|search|date|time|datetime-local"
  size="xs|sm|md|lg|xl"                                  // ✅ Tamaño del input (altura fija, padding, font-size)
  variant="primary|secondary|success|warning|danger|neutral"  // Variante semántica
  rounded="none|xs|sm|md|lg|xl|2xl|3xl|full"            // Radio de bordes
  width="xs|sm|md|lg|xl|auto|full|fit-content|min-content|max-content" // ✅ Ancho: tamaños fijos + semánticos
  leftIcon="search|user|email|lock"                     // ✅ Icono izquierdo
  rightIcon="eye|eye-off|x|check"                       // ✅ Icono derecho
  loading={boolean}                                      // Spinner en input
  disabled={boolean}                                     // Estado deshabilitado
  placeholder="Texto placeholder"                       
  value={string}                                         // Valor controlado
  onChange={function}                                    // Handler de cambio
  onFocus={function}                                     // Handler de focus
  onBlur={function}                                      // Handler de blur
  required={boolean}                                     // Campo requerido
  readOnly={boolean}                                     // Solo lectura
  autoFocus={boolean}                                    // Focus automático
  maxLength={number}                                     // Longitud máxima
  pattern={string}                                       // Patrón de validación
  shadow="none|xs|sm|md|lg|xl|2xl|3xl"                  // Elevación
/>
```

**🎯 Sistema de Tamaños (size) - ALTURAS FIJAS:**
- **`size="xs"`** - 32px altura, ideal para interfaces densas
- **`size="sm"`** - 40px altura, inputs compactos  
- **`size="md"`** - 48px altura, estándar recomendado (DEFAULT)
- **`size="lg"`** - 56px altura, destacar campos importantes
- **`size="xl"`** - 64px altura, inputs hero y CTAs

**📏 Sistema de Anchos (width) - TAMAÑOS FIJOS + SEMÁNTICOS:**

**Tamaños fijos estándar (predecibles):**
- **`width="xs"`** - 120px, ideal para códigos, IDs cortos
- **`width="sm"`** - 200px, campos como teléfono, código postal  
- **`width="md"`** - 300px, email, nombre, campos estándar
- **`width="lg"`** - 400px, direcciones, campos largos
- **`width="xl"`** - 500px, descripciones, comentarios

**Tamaños semánticos (flexibles):**
- **`width="auto"`** - Se ajusta al contenido, con mínimos usables
- **`width="full"`** - 100% del contenedor padre
- **`width="fit-content"`** - Solo el ancho necesario
- **`width="min-content"`** - Ancho mínimo posible
- **`width="max-content"`** - Ancho del contenido completo

**✅ Ventajas del nuevo sistema:**
- ✅ **Predecible**: Tamaños fijos estándar de las mejores librerías
- ✅ **Consistente**: Mismo ancho en toda la aplicación para `width="md"`
- ✅ **Flexible**: Combinación de fijos + semánticos según necesidad
- ✅ **Responsive**: Área táctil mínima 44px en móviles automática
- ✅ **No desbordamiento**: `max-width: 100%` en todos los casos
```

**Ejemplo común:**
```javascript
<Input 
  type="text"
  placeholder="Buscar películas y series..."
  leftIcon="search"
  variant="neutral"
  size="md"
  width="full"
  value={searchTerm}
  onChange={handleSearch}
/>
```

---

### 6. Typography
**Componente tipográfico con escala editorial**

```javascript
<Typography 
  size="xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl"             // ✅ Escala tipográfica completa
  variant="primary|secondary|success|warning|danger|neutral"  // Variante semántica
  weight="light|normal|medium|semibold|bold"             // Peso de fuente
  width="auto|full|fit-content"                          // Ancho del contenedor
  spacing={{                                             // ✅ Espaciado responsive
    top: "xs|sm|md|lg|xl|2xl", 
    bottom: "xs|sm|md|lg|xl|2xl",
    left: "xs|sm|md|lg|xl|2xl",
    right: "xs|sm|md|lg|xl|2xl"
  }}
  as="h1|h2|h3|h4|h5|h6|p|span|div"                     // Elemento HTML semántico
  align="left|center|right|justify"                      // Alineación de texto
  truncate={boolean}                                     // Truncar con ellipsis
  italic={boolean}                                       // Texto en cursiva
  underline={boolean}                                    // Texto subrayado
  rounded="none|xs|sm|md|lg|xl|2xl|3xl|full"            // Para fondos
/>
```

**Ejemplos comunes:**
```javascript
// Título principal
<Typography as="h1" size="4xl" weight="bold" variant="primary">
  StreamApp
</Typography>

// Subtítulo
<Typography as="h2" size="2xl" weight="semibold" spacing={{ bottom: 'lg' }}>
  Películas Destacadas
</Typography>

// Texto de ayuda
<Typography size="sm" variant="neutral" align="center">
  ¡Hola, {userName}!
</Typography>
```

---

### 7. Icon
**Sistema de iconos universal con fallbacks**

```javascript
<Icon 
  name="plus|edit|delete|search|user|settings|film|video|loading|warning|success|error"  // ✅ Nombre del icono del sistema
  size="xs|sm|md|lg|xl"                                 // Tamaño del icono
  variant="primary|secondary|success|warning|danger|neutral"  // Variante semántica
  contextSize="xs|sm|md|lg|xl"                          // Tamaño contextual automático
  spinning={boolean}                                     // Animación de rotación (para loading)
  disabled={boolean}                                     // Estado deshabilitado
/>
```

**Iconos disponibles garantizados:**
- **Navegación**: `home`, `search`, `menu`, `close`, `x`, `plus`, `settings`
- **Usuario**: `user`, `users`, `lock`
- **Media**: `play`, `pause`, `video`, `image`, `film`
- **Estados**: `success`, `warning`, `error`, `info`, `loading`
- **Acciones**: `edit`, `delete`, `save`, `trash-2`

**Ejemplo común:**
```javascript
<Icon name="loading" size="md" spinning />
```

---

### 8. Skeleton
**Placeholder de carga con formas personalizables**

```javascript
<Skeleton 
  skeletonVariant="text|avatar|image|card|custom"        // Tipo funcional
  size="xs|sm|md|lg|xl"                                 // Tamaño estándar
  variant="neutral|primary|secondary"                    // Variante semántica
  rounded="none|xs|sm|md|lg|xl|2xl|3xl|full"           // Radio de bordes
  lines={number}                                        // Para skeletonVariant="text"
  width="100px|50%|10rem|full"                          // ✅ Ancho personalizado
  height="100px|50%|10rem|200px"                       // ✅ Alto personalizado
  aspectRatio="16/9|4/3|1/1|2/3"                       // Para imágenes
  loading={boolean}                                     // Controla animación
  disabled={boolean}                                    // Estado deshabilitado
/>
```

**✅ Props especiales confirmadas:**
- `width` → Acepta cualquier valor CSS (`"100px"`, `"50%"`, `"full"`)
- `height` → Acepta cualquier valor CSS (`"200px"`, `"1.5rem"`)
- `rounded` → Usa sistema estándar de border-radius

**Componentes de conveniencia:**
```javascript
<Skeleton.Text lines={3} />
<Skeleton.Avatar size="lg" />
<Skeleton.Image aspectRatio="16/9" />
<Skeleton.Card />
```

**Ejemplo para loading cards:**
```javascript
<Container padding="md" rounded="lg" variant="neutral">
  <FlexContainer direction="column" gap="sm">
    <Skeleton width="full" height="200px" rounded="md" />
    <Skeleton width="full" height="1.5rem" rounded="sm" />
    <Skeleton width="60%" height="1rem" rounded="sm" />
  </FlexContainer>
</Container>
```

---

### 9. Card
**Contenedor elevado para contenido agrupado**

```javascript
<Card
  size="xs|sm|md|lg|xl"                                 // Tamaño de la card
  variant="primary|secondary|success|warning|danger|neutral"  // Variante semántica
  rounded="none|xs|sm|md|lg|xl|2xl|3xl"                // Radio de bordes
  shadow="none|xs|sm|md|lg|xl|2xl|3xl"                 // ✅ Elevación de la card
  width="auto|full|fit-content"                         // Ancho de la card
  loading={boolean}                                     // Estado de carga
  disabled={boolean}                                    // Estado deshabilitado
  padding="xs|sm|md|lg|xl|2xl"                         // Padding interno
/>
```

**Componentes de conveniencia:**
```javascript
<Card variant="neutral" shadow="md" rounded="lg">
  <CardHeader>
    <CardTitle>Título de la Card</CardTitle>
    <CardSubtitle>Subtítulo opcional</CardSubtitle>
  </CardHeader>
  <CardMedia>
    <Image src="..." alt="..." />
  </CardMedia>
  <CardBody>
    <CardDescription>Descripción del contenido</CardDescription>
  </CardBody>
  <CardFooter>
    <Button size="sm">Acción</Button>
  </CardFooter>
</Card>
```

---

### 10. Badge
**Indicador compacto de estado o categoría**

```javascript
<Badge
  size="xs|sm|md|lg|xl"                                 // Tamaño del badge
  variant="primary|secondary|success|warning|danger|neutral"  // Variante semántica
  rounded="none|xs|sm|md|lg|xl|full"                   // full para badges circulares
  width="auto|fit-content"                              // Ancho del badge
  leftIcon="check|warning|error|info"                  // Icono izquierdo
  rightIcon="close|arrow|x"                            // Icono derecho
  loading={boolean}                                     // Estado de carga
  disabled={boolean}                                    // Estado deshabilitado
>
  Texto del badge
</Badge>
```

**Ejemplos comunes:**
```javascript
<Badge variant="success" size="sm" leftIcon="check">Completado</Badge>
<Badge variant="warning" size="xs">En Proceso</Badge>
<Badge variant="danger" rounded="full">!</Badge>
```

---

## 🧬 **COMPONENTES MOLÉCULAS**

### 1. Modal
**Ventana modal con overlay y controles**

```javascript
<Modal
  isOpen={boolean}                                      // ✅ Control de visibilidad
  onClose={function}                                    // ✅ Handler de cierre
  size="xs|sm|md|lg|xl|full"                           // Tamaño del modal
  variant="primary|secondary|neutral"                   // Variante semántica
  closeOnBackdrop={boolean}                             // Cerrar al hacer click fuera
  closeOnEscape={boolean}                               // Cerrar con tecla Escape
  title="Título del modal"                              // Título automático
  showCloseButton={boolean}                             // Mostrar botón X
  rounded="none|xs|sm|md|lg|xl|2xl|3xl"                // Radio de bordes
  shadow="lg|xl|2xl|3xl"                               // Elevación del modal
>
  <Modal.Header>
    <Typography size="xl" weight="semibold">Título</Typography>
  </Modal.Header>
  <Modal.Body>
    Contenido del modal
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary">Confirmar</Button>
    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
  </Modal.Footer>
</Modal>
```

---

### 2. AlertModal
**Modal especializado para confirmaciones**

```javascript
<AlertModal
  isOpen={boolean}                                      // Control de visibilidad
  onClose={function}                                    // Handler de cancelar
  onConfirm={function}                                  // ✅ Handler de confirmación
  title="Confirmar acción"                              // Título del modal
  message="¿Estás seguro de realizar esta acción?"     // Mensaje descriptivo
  variant="danger|warning|success|primary|neutral"     // ✅ Tipo de alerta
  confirmText="Confirmar"                               // Texto botón confirmar
  cancelText="Cancelar"                                 // Texto botón cancelar
  loading={boolean}                                     // Estado de carga en confirmación
  size="sm|md|lg"                                      // Tamaño del modal
/>
```

**Ejemplo común:**
```javascript
<AlertModal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Eliminar película"
  message="Esta acción no se puede deshacer. ¿Estás seguro?"
  variant="danger"
  confirmText="Eliminar"
  cancelText="Cancelar"
  loading={deleting}
/>
```

---

### 3. EmptyState
**Estado vacío con mensaje y acciones**

```javascript
<EmptyState
  icon="inbox|search|warning|info"                     // Icono del estado
  title="No hay contenido"                             // Título del estado
  description="No se encontraron elementos."           // Descripción
  variant="neutral|primary|warning|danger"             // Variante semántica
  size="sm|md|lg"                                      // Tamaño del componente
  action={                                             // ✅ Botón de acción opcional
    <Button variant="primary" leftIcon="plus">
      Agregar Contenido
    </Button>
  }
/>
```

**Ejemplo común para búsquedas:**
```javascript
<EmptyState
  icon="search"
  title={`Sin resultados para "${searchTerm}"`}
  description="No encontramos elementos que coincidan con tu búsqueda."
  action={
    <Button variant="secondary" leftIcon="x" onClick={clearSearch}>
      Limpiar búsqueda
    </Button>
  }
/>
```

---

### 4. TextInput (Molécula completa)
**Input con label, error y ayuda**

```javascript
<TextInput
  label="Nombre del campo"                              // ✅ Label del input
  placeholder="Ingresa tu nombre"                       // Placeholder
  error="Campo requerido"                               // ✅ Mensaje de error
  helperText="Texto de ayuda"                           // Texto de ayuda
  required={boolean}                                    // Campo requerido
  // Props del Input átomo
  size="xs|sm|md|lg|xl"
  variant="primary|danger"                              // danger automático con error
  leftIcon="user|email|search|lock"
  rightIcon="eye|eye-off|check"
  loading={boolean}
  disabled={boolean}
  type="text|email|password|number"
  value={string}
  onChange={function}
/>
```

---

### 5. Pagination
**Controles de paginación completos**

```javascript
<Pagination
  currentPage={1}                                       // ✅ Página actual (1-indexed)
  totalPages={10}                                       // ✅ Total de páginas
  onPageChange={function}                               // ✅ Handler de cambio (page) => void
  size="sm|md|lg"                                      // Tamaño de controles
  variant="primary|secondary|neutral"                   // Variante semántica
  showFirstLast={boolean}                               // Mostrar botones primera/última
  showPrevNext={boolean}                                // Mostrar botones prev/next
  maxVisiblePages={5}                                   // Páginas visibles máximo
  disabled={boolean}                                    // Estado deshabilitado
/>
```

---

## 🏢 **ORGANISMO PRINCIPAL**

### DataTable
**Tabla completa con paginación, filtros y ordenamiento**

```javascript
<DataTable
  data={array}                                          // ✅ Datos de la tabla
  columns={[                                            // ✅ Definición de columnas
    {
      id: 'name',
      header: 'Nombre',
      accessorKey: 'name',
      cell: ({ value, row }) => <Typography>{value}</Typography>
    }
  ]}
  loading={boolean}                                     // Estado de carga
  error="Mensaje de error"                              // Mensaje de error
  emptyState={<EmptyState />}                           // Componente estado vacío
  pagination={boolean}                                  // Habilitar paginación
  sorting={boolean}                                     // Habilitar ordenamiento
  filtering={boolean}                                   // Habilitar filtros
  selection={boolean}                                   // Habilitar selección
  size="sm|md|lg"                                      // Tamaño de la tabla
  variant="primary|neutral|secondary"                   // Variante semántica
  onRowClick={function}                                 // Handler de click en fila
  onSelectionChange={function}                          // Handler de cambio selección
/>
```

---

## 🎨 **SISTEMA DE PROPS UNIVERSAL**

### Props Estándar (Todos los componentes)
```javascript
{
  // ✅ Variante semántica (6 opciones estandarizadas)
  variant: "primary|secondary|success|warning|danger|neutral",
  
  // ✅ Radio de bordes (9 opciones + responsive)  
  rounded: "none|xs|sm|md|lg|xl|2xl|3xl|full",
  
  // ✅ Nivel de sombra/elevación
  shadow: "none|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl",
  
  // ✅ Estados de interacción
  loading: boolean,
  disabled: boolean,
  
  // ✅ Personalización
  className: "string",
  style: objeto,  // Para valores no disponibles como props
  
  // ✅ Accesibilidad
  ariaLabel: "string",
  testId: "string"
}
```

### Props por Tipo de Componente

#### 🎪 Interactive (Button, Input, Badge, etc.)
```javascript
{
  size: "xs|sm|md|lg|xl",                               // Tamaños interactivos
  width: "auto|full|fit-content|min-content|max-content",
  leftIcon: "string|ReactNode",                         // ✅ Sistema de iconos
  rightIcon: "string|ReactNode",                        // ✅ Sistema de iconos
  iconOnly: boolean                                     // Solo para Button
}
```

#### 📝 Typography 
```javascript
{
  size: "xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl",          // Escala tipográfica completa
  weight: "light|normal|medium|semibold|bold",
  width: "auto|full|fit-content",
  spacing: {                                            // Margin responsive
    top: "xs|sm|md|lg|xl|2xl",
    bottom: "xs|sm|md|lg|xl|2xl", 
    left: "xs|sm|md|lg|xl|2xl",
    right: "xs|sm|md|lg|xl|2xl"
  }
}
```

#### 📦 Container (Container, FlexContainer, GridContainer)
```javascript
{
  size: "xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|full|screen",
  padding: "xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl",
  gap: "xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl",
  margin: "xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl"
}
```

---

## 📱 **SOPORTE RESPONSIVE**

Todas las props principales soportan **responsive objects**:

```javascript
// ✅ Ejemplo responsive en diferentes componentes
<Button size={{ base: 'sm', md: 'md', lg: 'lg' }} />

<Typography size={{ base: 'lg', md: '2xl', lg: '4xl' }} />

<Container size={{ base: 'full', md: 'lg', lg: 'xl' }} />

<FlexContainer 
  direction={{ base: 'column', md: 'row' }}
  gap={{ base: 'sm', md: 'md', lg: 'lg' }}
/>
```

**Breakpoints disponibles:**
- `base`: 0px+ (móvil)
- `sm`: 640px+
- `md`: 768px+ (tablets) 
- `lg`: 1024px+ (desktop pequeño)
- `xl`: 1280px+ (desktop estándar)
- `2xl`: 1536px+ (desktop grande)

---

## ⚠️ **PROPS NO DISPONIBLES COMO PROPS DIRECTAS**

### Usar `style={{}}` para:

#### Container & FlexContainer:
```javascript
// ❌ NO disponible como prop
<Container minHeight="100vh" />
<FlexContainer maxWidth="400px" />

// ✅ Usar style object
<Container style={{ minHeight: '100vh' }} />
<FlexContainer style={{ maxWidth: '400px' }} />
```

#### Valores custom no tokenizados:
```javascript
// ❌ NO disponible
<Container customPadding="25px" />

// ✅ Usar style object  
<Container style={{ padding: '25px' }} />
```

---

## 🎯 **PATRONES RECOMENDADOS**

### ✅ Layout Básico
```javascript
<Container size="lg" padding="lg">
  <FlexContainer direction="column" gap="xl">
    <Typography as="h1" size="3xl" weight="bold">Título Principal</Typography>
    <FlexContainer justify="space-between" gap="md">
      <Button variant="primary" size="lg" leftIcon="plus">Crear</Button>
      <Button variant="secondary" size="lg">Cancelar</Button>
    </FlexContainer>
  </FlexContainer>
</Container>
```

### ✅ Grid Responsivo
```javascript
<GridContainer 
  columns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
  gap="lg"
  padding="lg"
>
  {items.map(item => (
    <Card key={item.id} variant="neutral" shadow="md" rounded="lg">
      <CardBody padding="md">
        <Typography size="lg" weight="semibold">{item.title}</Typography>
        <Typography size="md" variant="neutral">{item.description}</Typography>
      </CardBody>
    </Card>
  ))}
</GridContainer>
```

### ✅ Loading States
```javascript
{loading ? (
  <Container padding="md" rounded="lg" variant="neutral">
    <FlexContainer direction="column" gap="sm">
      <Skeleton width="full" height="200px" rounded="md" />
      <Skeleton width="full" height="1.5rem" rounded="sm" />
      <Skeleton width="60%" height="1rem" rounded="sm" />
    </FlexContainer>
  </Container>
) : (
  <ContentCard content={item} />
)}
```

### ✅ Search Header
```javascript
<Container as="header" size="full" padding="lg" variant="primary">
  <FlexContainer align="center" justify="space-between" gap="lg">
    <Typography as="h1" size="2xl" weight="bold">App Name</Typography>
    <FlexContainer grow style={{ maxWidth: '400px' }}>
      <Input
        placeholder="Buscar..."
        leftIcon="search"
        variant="neutral"
        width="full"
        value={searchTerm}
        onChange={handleSearch}
      />
    </FlexContainer>
    <Button variant="secondary" leftIcon="user" onClick={handleLogout}>
      Cerrar Sesión
    </Button>
  </FlexContainer>
</Container>
```

---

## ❌ **PATRONES A EVITAR**

```javascript
// ❌ No usar HTML nativo cuando existe componente del sistema
<button className="custom-btn">Usar <Button> en su lugar</button>
<div style={{ display: 'flex' }}>Usar <FlexContainer> en su lugar</div>

// ❌ No usar estilos inline para valores que tienen tokens
<div style={{ padding: '20px' }}>Usar padding="lg" en su lugar</div>
<div style={{ gap: '16px' }}>Usar gap="md" en su lugar</div>

// ❌ No usar iconos externos  
<FaUser />  // Usar leftIcon="user" en su lugar
<SomeIcon /> // Usar Icon name="iconName" en su lugar

// ❌ No duplicar funcionalidad del sistema
<div className="custom-card">Usar <Card> en su lugar</div>
<input type="text" />  // Usar <Input> en su lugar
```

---

## 🔍 **RESPUESTAS RÁPIDAS PARA CASOS ESPECÍFICOS**

### "¿Puedo usar minHeight en Container?"
❌ **NO disponible como prop**  
✅ **Solución**: `<Container style={{ minHeight: '100vh' }} />`

### "¿FlexContainer acepta maxWidth?"
❌ **NO disponible como prop**  
✅ **Solución**: `<FlexContainer style={{ maxWidth: '400px' }} />`

### "¿Skeleton acepta width y height custom?"
✅ **SÍ disponible**  
✅ **Uso**: `<Skeleton width="300px" height="200px" />`

### "¿Cómo hago un input de búsqueda?"
✅ **Patrón estándar**:
```javascript
<Input
  type="search"
  placeholder="Buscar..."
  leftIcon="search"
  variant="neutral" 
  width="full"
  value={searchTerm}
  onChange={handleSearch}
/>
```

### "¿Cómo hago un loading screen completo?"
✅ **Patrón estándar**:
```javascript
<Container size="full" padding="xl" variant="primary" style={{ minHeight: '100vh' }}>
  <FlexContainer align="center" justify="center" style={{ minHeight: '100vh' }}>
    <FlexContainer align="center" gap="md">
      <Icon name="loading" size="lg" spinning />
      <Typography size="lg" weight="medium">Cargando...</Typography>
    </FlexContainer>
  </FlexContainer>
</Container>
```

---

## 📚 **IMPORTACIONES Y EXPORTS**

### Importación recomendada
```javascript
// ✅ Import individual para tree shaking
import { Button, Typography, Container, FlexContainer } from '../design-system';

// ✅ Import por categoría
import { Button } from '../design-system/atoms';
import { Modal } from '../design-system/molecules'; 
import { DataTable } from '../design-system/organisms';

// ✅ Import de hooks
import { useInteractiveProps, useBreakpoint } from '../design-system';
```

### ❌ **NO importar desde src/components si existe en design-system**
```javascript
// ❌ PROHIBIDO
import { Button } from '../components/atoms/Button'; // Si existe en design-system

// ✅ CORRECTO
import { Button } from '../design-system';
```

---

**🎉 Con esta documentación completa, cualquier desarrollador o agente IA puede usar el design system de manera consistente y aprovechar todas sus capacidades V2.0.**