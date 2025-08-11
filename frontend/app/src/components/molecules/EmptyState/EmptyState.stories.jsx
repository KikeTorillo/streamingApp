// EmptyState.stories.jsx
import React from 'react';
import { EmptyState } from './EmptyState';
import { Button } from '../../atoms/Button/Button';
import './EmptyState.css';

export default {
  title: 'Components/Molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# EmptyState Molecule

El componente **EmptyState** muestra un estado vacío cuando no hay contenido que mostrar. 
Es fundamental para mejorar la UX cuando listas, búsquedas o filtros no devuelven resultados.

## 🎯 Características principales

- **Flexible**: Ícono, título, descripción y acción personalizables
- **3 tamaños**: SM, MD, LG para diferentes contextos
- **4 variantes**: Default, Info, Warning, Error
- **Accesible**: Semántica correcta y reducción de movimiento
- **Responsive**: Se adapta automáticamente a pantallas móviles
- **Integrado**: Usa Card como base para consistencia visual

## 🔧 Uso básico

\`\`\`jsx
import { EmptyState } from './molecules/EmptyState';
import { Button } from './atoms/Button';

// Básico
<EmptyState 
  icon="🎬"
  title="No hay películas"
  description="No se encontraron películas en esta categoría"
/>

// Con acción
<EmptyState 
  icon="🔍"
  title="Sin resultados"
  description="Intenta con otros términos de búsqueda"
  action={<Button variant="primary">Limpiar filtros</Button>}
  variant="info"
  size="lg"
/>
\`\`\`

## 📱 Casos de uso comunes

- **Listas vacías**: Cuando no hay elementos que mostrar
- **Búsquedas sin resultados**: Para términos que no devuelven datos
- **Filtros restrictivos**: Cuando los filtros eliminan todo el contenido
- **Estados de carga fallidos**: Cuando no se puede cargar el contenido
- **Funcionalidades nuevas**: Para explicar características próximas

## ♿ Accesibilidad

- Usa estructura semántica con h3 y p
- Respeta prefers-reduced-motion
- Focus visible en acciones interactivas
- Colores con contraste adecuado
        `
      }
    }
  },
  argTypes: {
    // Contenido específico
    icon: {
      name: 'Ícono',
      description: 'Emoji, nombre de ícono Feather o elemento React',
      control: 'text'
    },
    title: {
      name: 'Título',
      description: 'Título principal del estado vacío',
      control: 'text'
    },
    description: {
      name: 'Descripción',
      description: 'Texto descriptivo del estado',
      control: 'text'
    },
    action: {
      name: 'Acción',
      description: 'Elemento React para acción (botón, enlace)',
      control: false
    },
    
    // Props estándar del sistema (5 tamaños)
    size: {
      name: 'Tamaño',
      description: 'Tamaño del componente (sistema estándar)',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    variant: {
      name: 'Variante',
      description: 'Variante semántica (sistema estándar)',
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']
    },
    rounded: {
      name: 'Rounded',
      description: 'Radio de borde del componente',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full']
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Deshabilita la interacción con el componente',
      control: 'boolean'
    },
    loading: {
      name: 'Cargando',
      description: 'Muestra estado de carga con overlay',
      control: 'boolean'
    }
  }
};

// ========== HISTORIA DEFAULT ==========
export const Default = {
  args: {
    icon: '📭',
    title: 'No hay contenido',
    description: 'No se encontraron elementos para mostrar.',
    variant: 'neutral',
    size: 'md'
  }
};

// ========== TAMAÑOS ==========
export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Pequeño (SM)</h4>
      <EmptyState
        icon="🔍"
        title="Sin resultados"
        description="No se encontraron elementos."
        size="sm"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Mediano (MD)</h4>
      <EmptyState
        icon="📝"
        title="Lista vacía"
        description="Aún no has agregado elementos a esta lista."
        size="md"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Grande (LG)</h4>
      <EmptyState
        icon="🚀"
        title="¡Comencemos!"
        description="Esta sección está lista para que agregues tu primer elemento."
        size="lg"
      />
    </div>
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Tres tamaños disponibles: SM para espacios compactos, MD para uso general, LG para páginas principales.'
    }
  }
};

// ========== VARIANTES ==========
export const Variants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Default</h4>
      <EmptyState
        icon="📄"
        title="Sin contenido"
        description="No hay elementos que mostrar."
        variant="default"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Info</h4>
      <EmptyState
        icon="💡"
        title="Información"
        description="Esta funcionalidad estará disponible próximamente."
        variant="info"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Warning</h4>
      <EmptyState
        icon="⚠️"
        title="Filtros muy restrictivos"
        description="Los filtros actuales no devuelven resultados."
        variant="warning"
      />
    </div>
    
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Error</h4>
      <EmptyState
        icon="❌"
        title="Error de carga"
        description="No se pudo cargar el contenido solicitado."
        variant="error"
      />
    </div>
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Variantes visuales para diferentes contextos: default, info, warning y error.'
    }
  }
};

// ========== CON ACCIONES ==========
export const WithActions = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    padding: 'var(--space-md)'
  }}>
    <EmptyState
      icon="🎬"
      title="No hay películas"
      description="No se encontraron películas en esta categoría."
      action={
        <Button variant="primary" size="md">
          Ver todas las categorías
        </Button>
      }
    />
    
    <EmptyState
      icon="🔍"
      title="Sin resultados de búsqueda"
      description="Intenta con términos diferentes o más generales."
      action={
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <Button variant="outline" size="sm">
            Limpiar búsqueda
          </Button>
          <Button variant="primary" size="sm">
            Ver populares
          </Button>
        </div>
      }
      variant="info"
    />
    
    <EmptyState
      icon="📺"
      title="Error de conexión"
      description="No se pudo cargar el contenido. Verifica tu conexión."
      action={
        <Button 
          variant="primary" 
          size="md"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      }
      variant="error"
      size="lg"
    />
  </div>
);

WithActions.parameters = {
  docs: {
    description: {
      story: 'EmptyState con botones de acción para guiar al usuario hacia la siguiente acción posible.'
    }
  }
};

// ========== CASOS DE USO PARA MAINPAGE ==========
export const MainPageUseCases = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-xl)',
    padding: 'var(--space-md)'
  }}>
    <div>
      <h3 style={{ 
        marginBottom: 'var(--space-lg)', 
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-default)',
        paddingBottom: 'var(--space-sm)'
      }}>
        🎯 Casos de uso específicos para MainPage
      </h3>
      
      <div style={{
        display: 'grid',
        gap: 'var(--space-xl)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {/* Caso 1: No hay películas */}
        <EmptyState
          icon="🎬"
          title="No hay películas disponibles"
          description="El catálogo de películas está siendo actualizado. Vuelve pronto para ver el nuevo contenido."
          action={
            <Button variant="primary">
              Ver series disponibles
            </Button>
          }
          size="md"
        />
        
        {/* Caso 2: Búsqueda sin resultados */}
        <EmptyState
          icon="🔍"
          title="Sin resultados para tu búsqueda"
          description="No encontramos contenido que coincida con 'batman'. Intenta con otros términos."
          action={
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <Button variant="outline" size="sm">
                Limpiar búsqueda
              </Button>
              <Button variant="primary" size="sm">
                Ver populares
              </Button>
            </div>
          }
          variant="info"
        />
        
        {/* Caso 3: Categoría vacía */}
        <EmptyState
          icon="🏷️"
          title="Categoría sin contenido"
          description="La categoría 'Documentales' no tiene contenido disponible en este momento."
          action={
            <Button variant="primary">
              Explorar otras categorías
            </Button>
          }
          variant="warning"
        />
        
        {/* Caso 4: Error de carga */}
        <EmptyState
          icon="⚠️"
          title="Error al cargar contenido"
          description="Hubo un problema al cargar las películas y series. Verifica tu conexión a internet."
          action={
            <Button variant="primary">
              Reintentar carga
            </Button>
          }
          variant="error"
        />
      </div>
    </div>
    
    <div style={{ 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--color-primary-light)', 
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--text-primary)'
    }}>
      <strong>💡 Implementación en MainPage:</strong>
      <br />
      Estos estados se mostrarán automáticamente según la situación: sin películas, sin series, búsqueda fallida, o error de API.
    </div>
  </div>
);

MainPageUseCases.parameters = {
  docs: {
    description: {
      story: 'Casos de uso específicos de EmptyState para la página MainPage de la aplicación de streaming.'
    }
  }
};

// ========== INTERACTIVIDAD ==========
export const Interactive = () => {
  const [currentState, setCurrentState] = React.useState('default');
  
  const states = {
    default: {
      icon: '📭',
      title: 'Estado por defecto',
      description: 'Este es el estado vacío estándar.',
      variant: 'default'
    },
    search: {
      icon: '🔍',
      title: 'Sin resultados',
      description: 'Tu búsqueda no devolvió resultados.',
      variant: 'info'
    },
    error: {
      icon: '❌',
      title: 'Error de carga',
      description: 'Algo salió mal al cargar el contenido.',
      variant: 'error'
    },
    success: {
      icon: '✅',
      title: '¡Todo listo!',
      description: 'La configuración se completó exitosamente.',
      variant: 'info'
    }
  };
  
  return (
    <div style={{ padding: 'var(--space-md)' }}>
      <div style={{ 
        marginBottom: 'var(--space-lg)',
        display: 'flex',
        gap: 'var(--space-sm)',
        flexWrap: 'wrap'
      }}>
        {Object.keys(states).map(state => (
          <Button
            key={state}
            variant={currentState === state ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setCurrentState(state)}
          >
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </Button>
        ))}
      </div>
      
      <EmptyState
        icon={states[currentState].icon}
        title={states[currentState].title}
        description={states[currentState].description}
        variant={states[currentState].variant}
        action={
          <Button variant="primary">
            Acción para {currentState}
          </Button>
        }
        size="lg"
      />
    </div>
  );
};

Interactive.parameters = {
  docs: {
    description: {
      story: 'Demostración interactiva de diferentes estados del EmptyState. Cambia entre estados para ver las variaciones.'
    }
  }
};

// ========== SISTEMA ESTÁNDAR - NUEVAS FUNCIONALIDADES ==========

export const SystemStandardProps = () => (
  <div style={{ padding: 'var(--space-md)' }}>
    <h3 style={{ 
      marginBottom: 'var(--space-lg)', 
      color: 'var(--text-primary)',
      borderBottom: '1px solid var(--border-default)',
      paddingBottom: 'var(--space-sm)'
    }}>
      🎨 Sistema Estándar - Props Migradas
    </h3>
    
    <div style={{
      display: 'grid',
      gap: 'var(--space-xl)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    }}>
      {/* Tamaños estándar (5) */}
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
          📏 5 Tamaños: XS → XL
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
            <EmptyState
              key={size}
              icon="📦"
              title={`Tamaño ${size.toUpperCase()}`}
              description="Tokens automáticos"
              size={size}
              variant="neutral"
            />
          ))}
        </div>
      </div>
      
      {/* Variantes estándar (6) */}
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
          🎨 6 Variantes Semánticas
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {[
            { variant: 'primary', icon: '🔵' },
            { variant: 'secondary', icon: '🟠' },
            { variant: 'success', icon: '✅' },
            { variant: 'warning', icon: '⚠️' },
            { variant: 'danger', icon: '❌' },
            { variant: 'neutral', icon: '⚪' }
          ].map(({ variant, icon }) => (
            <EmptyState
              key={variant}
              icon={icon}
              title={`${variant.charAt(0).toUpperCase() + variant.slice(1)}`}
              description="Colores semánticos automáticos"
              variant={variant}
              size="sm"
            />
          ))}
        </div>
      </div>
      
      {/* Estados especiales */}
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
          🔧 Estados Loading/Disabled
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <EmptyState
            icon="loader-2"
            title="Estado Loading"
            description="Con overlay automático"
            loading={true}
            action={<Button variant="primary">Cancelar</Button>}
          />
          <EmptyState
            icon="ban"
            title="Estado Disabled"
            description="Interacción deshabilitada"
            disabled={true}
            action={<Button variant="primary">No clickeable</Button>}
          />
        </div>
      </div>
    </div>
  </div>
);

SystemStandardProps.parameters = {
  docs: {
    description: {
      story: '🎯 **MIGRACIÓN COMPLETA** - EmptyState ahora usa el sistema de diseño estándar con 5 tamaños, 6 variantes semánticas, tokens automáticos, sistema de iconos integrado y estados loading/disabled.'
    }
  }
};

// ========== BACKWARD COMPATIBILITY ==========
export const BackwardCompatibility = () => (
  <div style={{ padding: 'var(--space-md)' }}>
    <h3 style={{ 
      marginBottom: 'var(--space-lg)', 
      color: 'var(--text-primary)',
      borderBottom: '1px solid var(--border-default)',
      paddingBottom: 'var(--space-sm)'
    }}>
      🔄 Backward Compatibility - Variantes Legacy
    </h3>
    
    <div style={{
      display: 'grid',
      gap: 'var(--space-xl)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
    }}>
      {/* Variantes legacy con warnings */}
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
          ⚠️ Props Legacy (con warnings)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <EmptyState
            icon="📄"
            title="variant='default'"
            description="Se mapea automáticamente a 'neutral'"
            variant="default" // Legacy
          />
          <EmptyState
            icon="💡"
            title="variant='info'"
            description="Se mapea automáticamente a 'primary'"
            variant="info" // Legacy
          />
          <EmptyState
            icon="❌"
            title="variant='error'"
            description="Se mapea automáticamente a 'danger'"
            variant="error" // Legacy
          />
        </div>
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
          ✅ Props Nuevas Recomendadas
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <EmptyState
            icon="⚪"
            title="variant='neutral'"
            description="Nueva API estándar"
            variant="neutral"
          />
          <EmptyState
            icon="🔵"
            title="variant='primary'"
            description="Nueva API estándar"
            variant="primary"
          />
          <EmptyState
            icon="🔴"
            title="variant='danger'"
            description="Nueva API estándar"
            variant="danger"
          />
        </div>
      </div>
    </div>
    
    <div style={{ 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--color-warning-light)', 
      borderRadius: 'var(--radius-md)',
      marginTop: 'var(--space-lg)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--text-primary)'
    }}>
      <strong>💡 Desarrollo:</strong> Abre DevTools Console para ver deprecation warnings de variantes legacy. 
      <br />
      <strong>🚀 Migración:</strong> Usa las 6 variantes estándar: primary, secondary, success, warning, danger, neutral.
    </div>
  </div>
);

BackwardCompatibility.parameters = {
  docs: {
    description: {
      story: '🛡️ **CERO BREAKING CHANGES** - Las props legacy funcionan perfectamente con mapping automático y deprecation warnings informativos en desarrollo.'
    }
  }
};