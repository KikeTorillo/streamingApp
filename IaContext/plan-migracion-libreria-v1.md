# 🚀 Plan de Migración a Librería Reutilizable - Contextual UI Design System

**Estado Actual:** El sistema de diseño está 95% listo para extracción  
**Objetivo:** Crear `@kike-dev/contextual-ui` como librería NPM independiente  
**Timeline Estimado:** 2-3 semanas  
**Esfuerzo:** Medio (la mayoría del trabajo ya está hecho)

---

## 📊 **Estado Actual - Assessment Completo**

### ✅ **YA IMPLEMENTADO (95% del trabajo)**
- **Sistema de Tokens**: Completo y funcional (`tokens/designTokens.js`)
- **Sistema de Hooks**: 24+ hooks especializados (`hooks/useStandardProps.jsx`)
- **Componentes Base**: 88 componentes siguiendo Atomic Design
- **Sistema de Iconos**: Contextual y automático (`utils/iconHelpers.js`)
- **PropTypes Sistema**: API unificada (`tokens/standardProps.js`)
- **Storybook**: 35+ stories documentadas
- **CSS Variables**: Sistema completo de variables CSS
- **Validación**: Props validation en desarrollo

### 🟡 **NECESITA LIMPIEZA (5% del trabajo)**
- Eliminar props deprecadas en 3-4 componentes
- Completar migración de algunos componentes legacy
- Agregar stories faltantes (3-4 componentes)
- Limpiar dependencias específicas del proyecto StreamingApp

---

## 🎯 **FASE 1: Preparación del Código Base (Semana 1)**

### **1.1 Auditoría y Limpieza**
```bash
# Identificar componentes no migrados completamente
find frontend/app/src/components -name "*.jsx" | xargs grep -l "icon\|iconPosition" 

# Encontrar dependencias hardcoded del proyecto
find frontend/app/src/components -name "*.jsx" | xargs grep -l "streaming\|movie\|series"

# Verificar props deprecadas
find frontend/app/src/components -name "*.jsx" | xargs grep -l "variant.*default\|variant.*info"
```

### **1.2 Migración de Componentes Legacy**
- **ActionsDropdown**: Migrar a `useStandardProps`
- **ContentImage**: Completar stories de Storybook
- **UploadProgress**: Finalizar sistema de props estándar
- **StatsCard**: Completar documentación Storybook
- **EpisodeCountdown**: Revisar si es específico del dominio

### **1.3 Eliminación de Props Deprecadas**
```javascript
// ANTES: Props legacy en algunos componentes
<Button icon="user" iconPosition="left" variant="default" />

// DESPUÉS: Props estándar
<Button leftIcon="user" variant="primary" />
```

### **1.4 Revisión de Dependencias**
- Eliminar imports específicos del proyecto StreamingApp (contextos de negocio)
- Asegurar que componentes base no dependan de lógica de dominio streaming
- Verificar que todos los componentes usen solo tokens del sistema
- Cambiar referencias internas a `@kike-dev/contextual-ui`

---

## 🏗️ **FASE 2: Extracción de la Librería (Semana 2)**

### **2.1 Estructura del Paquete NPM**
```
@kike-dev/contextual-ui/
├── src/
│   ├── components/          # Todos los componentes extraídos
│   │   ├── atoms/          # 23 componentes
│   │   ├── molecules/      # 19 componentes  
│   │   ├── organisms/      # 6 componentes (filtrar domain-specific)
│   │   └── templates/      # 2 layouts base
│   ├── tokens/             # Sistema de tokens completo
│   │   ├── designTokens.js
│   │   ├── standardProps.js
│   │   └── index.js
│   ├── hooks/              # 24+ hooks especializados  
│   │   ├── useStandardProps.jsx
│   │   └── index.js
│   ├── utils/              # Utilidades del sistema
│   │   ├── iconHelpers.js
│   │   └── index.js
│   └── styles/             # CSS base del sistema
│       ├── tokens.css      # Variables CSS
│       ├── reset.css       # Reset base
│       └── components.css  # Estilos de componentes
├── dist/                   # Build output
├── stories/               # Storybook exportado
├── docs/                  # Documentación
└── package.json
```

### **2.2 Build Configuration**
```json
{
  "name": "@kike-dev/contextual-ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js", 
  "types": "dist/index.d.ts",
  "files": ["dist/", "styles/"],
  "exports": {
    ".": "./dist/index.js",
    "./styles": "./styles/index.css",
    "./tokens": "./dist/tokens.js",
    "./hooks": "./dist/hooks.js"
  },
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  }
}
```

### **2.3 Scripts de Build**
```bash
# Rollup/Vite para build optimizado
npm run build:esm         # ES Modules
npm run build:cjs         # CommonJS  
npm run build:types       # TypeScript definitions
npm run build:css         # CSS standalone
npm run build:storybook   # Storybook estático
```

---

## 🔄 **FASE 3: Migración del Proyecto StreamingApp (Semana 3)**

### **3.1 Instalación de la Librería**
```bash
# En el proyecto StreamingApp
npm install @kike-dev/contextual-ui
```

### **3.2 Configuración del Proyecto**
```javascript
// frontend/app/src/main.jsx
import '@kike-dev/contextual-ui/styles';
import { DesignSystemProvider } from '@kike-dev/contextual-ui';

// Tokens personalizados para StreamingApp (opcional)
const streamingTokens = {
  colors: {
    primary: '#219ebc',    // Azul oceánico específico
    secondary: '#fb8500'   // Naranja específico
  }
};

ReactDOM.render(
  <DesignSystemProvider tokens={streamingTokens}>
    <App />
  </DesignSystemProvider>,
  document.getElementById('root')
);
```

### **3.3 Migración Incremental**
```javascript
// ANTES: Import local
import { Button } from '../components/atoms/Button/Button';

// DESPUÉS: Import de la librería
import { Button } from '@kike-dev/contextual-ui';

// Codemod automático para migración masiva
npx @kike-dev/contextual-ui-migrate ./src
```

### **3.4 Eliminación del Código Local**
Una vez verificado que todo funciona:
```bash
# Eliminar components/ local gradualmente
rm -rf frontend/app/src/components/atoms/
rm -rf frontend/app/src/components/molecules/
# Mantener organisms/ y templates/ específicos del dominio
```

---

## 📦 **COMPONENTES A INCLUIR EN LA LIBRERÍA**

### **🟢 INCLUIR COMPLETO (Base Components)**

#### **Atoms (23 componentes)**
- Avatar, Badge, Button, Card, Checkbox, Container
- Divider, FileInput, Icon, Input, Label, Link
- Select, Skeleton, Spinner, ThemeSelector, Toast

#### **Molecules (15 componentes - filtrados)**
- Accordion, AlertModal, Breadcrumb, DynamicForm
- EmptyState, FilterBar, Modal, Pagination
- SearchBar, Tabs, TextInput, TextSelect, ToastContainer

#### **Templates (2 componentes)**
- PageLayout (genérico)
- AdminLayout (adaptable)

### **🟡 REVISAR ANTES DE INCLUIR**

#### **Molecules (4 componentes específicos)**
- **ContentCard**: ¿Es suficientemente genérico?
- **ContentSection**: ¿Útil para otros proyectos?
- **FileInputField**: ¿Muy específico del upload de videos?
- **StatsCard**: ¿Genérico o muy específico del dashboard?

#### **Organisms (2-3 componentes genéricos)**
- **DataTable**: ✅ Incluir (genérico y reutilizable)
- **EditModal**: ✅ Incluir (CRUD genérico)
- **AppHeader**: 🟡 Adaptar para ser más genérico

### **🔴 NO INCLUIR (Domain Specific)**

#### **Organisms específicos del dominio**
- **AdminSidebar**: Específico del dashboard de streaming
- **LoginCard**: Muy específico del flujo de auth
- **TMDBSearchView**: API específica de TMDB
- **VideoPlayerOverlay**: Específico del reproductor

#### **Pages (todas)**
- Todas las páginas son específicas del proyecto StreamingApp
- No tienen sentido en una librería de componentes

---

## 🧪 **TESTING STRATEGY**

### **Tests a Migrar**
```bash
# Tests unitarios de componentes base
components/atoms/**/*.test.jsx
components/molecules/**/*.test.jsx

# Tests de hooks
hooks/**/*.test.jsx

# Tests de tokens y utilidades  
tokens/**/*.test.js
utils/**/*.test.js
```

### **Tests Nuevos Requeridos**
```javascript
// Test de integración de la librería
describe('@kike-dev/contextual-ui', () => {
  test('exports all components correctly', () => {
    expect(Button).toBeDefined();
    expect(Badge).toBeDefined();
    // ... todos los componentes
  });

  test('CSS variables are loaded', () => {
    expect(getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary')).toBeTruthy();
  });
});
```

---

## 📚 **DOCUMENTACIÓN REQUERIDA**

### **README.md de la Librería**
```markdown
# @kike-dev/contextual-ui

Sistema de diseño completo con componentes React reutilizables.

## Instalación
npm install @kike-dev/contextual-ui

## Uso Básico
import { Button, Badge } from '@kike-dev/contextual-ui';
import '@kike-dev/contextual-ui/styles';

## Componentes Disponibles
- 23 Atoms, 15 Molecules, 3 Organisms, 2 Templates
- Sistema de tokens centralizados
- 24+ hooks especializados
- Storybook completo
```

### **Migration Guide**
```markdown
# Migración desde Código Local

## Automated Migration (Recomendado)
npx @kike-dev/contextual-ui-migrate ./src

## Manual Migration
ANTES: import { Button } from '../components/atoms/Button/Button'
DESPUÉS: import { Button } from '@kike-dev/contextual-ui'
```

### **Storybook Público**
```bash
# Deploy de Storybook como documentación
npm run build:storybook
# Deploy a: https://contextual-ui.kike-dev.com
```

---

## ⚡ **OPTIMIZACIONES INCLUIDAS**

### **Tree Shaking**
```javascript
// Import específico (bundle más pequeño)
import { Button } from '@kike-dev/contextual-ui/button';

// Import por categoría
import { Button, Badge } from '@kike-dev/contextual-ui/atoms';

// Import completo
import { Button, Badge } from '@kike-dev/contextual-ui';
```

### **CSS Optimization**
```css
/* Solo incluir CSS de componentes usados */
@import '@kike-dev/contextual-ui/atoms/button.css';
@import '@kike-dev/contextual-ui/atoms/badge.css';

/* O incluir CSS completo */
@import '@kike-dev/contextual-ui/styles';
```

### **Bundle Analysis**
```json
{
  "bundlewatch": {
    "files": [
      { "path": "dist/index.js", "maxSize": "100kb" },
      { "path": "dist/atoms/*.js", "maxSize": "10kb" },
      { "path": "styles/index.css", "maxSize": "50kb" }
    ]
  }
}
```

---

## 🎯 **CRITERIOS DE ÉXITO**

### **Métricas de Adopción**
- ✅ StreamingApp usa 100% la librería en lugar de código local
- ✅ Bundle size de componentes ≤ 100KB gzipped
- ✅ Storybook funcional con todos los componentes
- ✅ Tests pasando al 90%+
- ✅ TypeScript definitions completas

### **Métricas de Calidad**
- ✅ Zero breaking changes para el proyecto actual
- ✅ Backward compatibility completa durante migración
- ✅ Performance igual o mejor que implementación actual
- ✅ Documentación completa y clara

### **Métricas de Reutilización**
- ✅ Componentes 100% independientes del dominio streaming
- ✅ Configurables vía tokens/props
- ✅ Utilizables en otros proyectos sin modificaciones
- ✅ API consistente en todos los componentes

---

## 🔄 **TIMELINE DETALLADO**

### **Semana 1: Preparación (40 horas)**
- **Día 1-2**: Auditoría completa y lista de componentes legacy (16h)
- **Día 3-4**: Migración de componentes pendientes (16h)
- **Día 5**: Cleanup de props deprecadas y testing (8h)

### **Semana 2: Extracción (40 horas)**
- **Día 1-2**: Setup del proyecto NPM y build config (16h)
- **Día 3-4**: Extracción de componentes y testing (16h)
- **Día 5**: Documentación y Storybook export (8h)

### **Semana 3: Migración (40 horas)**
- **Día 1-2**: Migración del proyecto StreamingApp (16h)
- **Día 3-4**: Testing integración y ajustes (16h)  
- **Día 5**: Cleanup final y documentación (8h)

**Total: 120 horas (3 semanas de desarrollo completo)**

---

## 🚀 **NEXT STEPS INMEDIATOS**

### **Paso 1: Verificar Estado Actual (Hoy)**
```bash
# Ejecutar estos comandos para verificar estado
npm run storybook  # Verificar stories existentes
npm run lint       # Ver componentes con warnings
npm run test       # Verificar tests actuales
```

### **Paso 2: Preparar Migración (Esta Semana)**
1. Decidir qué componentes específicos incluir/excluir
2. Definir naming para la librería (`@kike-dev/contextual-ui`)
3. Crear repositorio para la librería
4. Setup inicial del proyecto NPM

### **Paso 3: Ejecución (Próximas 3 Semanas)**
1. **Semana 1**: Cleanup y preparación
2. **Semana 2**: Extracción y build
3. **Semana 3**: Migración y testing

---

## 🎉 **RESULTADO ESPERADO**

Al finalizar estas 3 semanas:

✅ **Librería NPM funcional**: `@kike-dev/contextual-ui`  
✅ **StreamingApp migrado**: Usando 100% la librería  
✅ **Documentación completa**: Storybook + guides  
✅ **Base para futuros proyectos**: Sistema reutilizable  
✅ **Ventaja competitiva**: Design system superior a librerías populares

El sistema estará listo para ser la base de todos los futuros proyectos frontend de la organización, estableciendo un nuevo estándar de calidad y productividad en desarrollo de interfaces.

---

*Plan creado: Agosto 14, 2025*  
*StreamingApp Design System Migration Plan v1.0*  
*Status: 🟢 Ready to Execute - 95% Preparado*