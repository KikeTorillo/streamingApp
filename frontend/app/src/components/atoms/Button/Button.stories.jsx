// src/components/atoms/Button/Button.stories.jsx
import { Button } from './Button';

export default {
  title: 'Components/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Button Atom

El átomo **Button** es el componente base para botones en nuestro sistema de diseño.

## 🎯 Características principales

- **7 variantes visuales**: Primary, Secondary, Outline, Ghost, Danger, Success, Warning
- **5 tamaños**: xs, sm, md, lg, xl
- **Estados completos**: normal, hover, focus, disabled, loading
- **Accesibilidad**: ARIA labels, navegación por teclado
- **Theming**: Variables CSS del sistema

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { Button } from './atoms/Button';

<Button 
  size="md"
  variant="primary"
  onClick={handleClick}
>
  Texto del botón
</Button>
\\\`\\\`\\\`
        `
      }
    }
  },
  argTypes: {
    children: {
      name: 'Contenido',
      description: 'Contenido del botón (texto o elementos React)',
      control: 'text',
      table: {
        type: { summary: 'React.ReactNode' }
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del botón',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'md' }
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante visual del botón',
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning'],
      table: {
        type: { summary: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning'" },
        defaultValue: { summary: 'primary' }
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Si el botón está deshabilitado',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    loading: {
      name: 'Cargando',
      description: 'Muestra spinner y deshabilita el botón',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    leftIcon: {
      name: 'Icono Izquierdo',
      description: 'Icono a la izquierda del texto (reemplaza icon)',
      control: 'text',
      table: {
        type: { summary: 'string | React.ReactNode' }
      }
    },
    rightIcon: {
      name: 'Icono Derecho', 
      description: 'Icono a la derecha del texto',
      control: 'text',
      table: {
        type: { summary: 'string | React.ReactNode' }
      }
    },
    rounded: {
      name: 'Bordes Redondeados',
      description: 'Radio de bordes del botón',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl' | 'full'" },
        defaultValue: { summary: 'md' }
      }
    },
    iconOnly: {
      name: 'Solo icono',
      description: 'Muestra únicamente el icono',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    fullWidth: {
      name: 'Ancho completo',
      description: 'El botón ocupa todo el ancho del contenedor',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    onClick: {
      name: 'Función onClick',
      description: 'Función a ejecutar al hacer clic',
      action: 'clicked',
      table: {
        type: { summary: 'function' }
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales',
      control: 'text',
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

// ========== 1. DEFAULT STORY (OBLIGATORIA) ==========
export const Default = {
  args: {
    children: 'Botón primario',
    size: 'md',
    variant: 'primary'
  }
};

Default.parameters = {
  docs: {
    description: {
      story: 'Configuración por defecto del botón. Tamaño medio, variante primary, interactivo.'
    }
  }
};

// ========== 2. SIZES STORY (OBLIGATORIA) ==========
export const Sizes = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>XS</h4>
      <Button size="xs">Extra small</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>SM</h4>
      <Button size="sm">Small</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>MD</h4>
      <Button size="md">Medium</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>LG</h4>
      <Button size="lg">Large</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>XL</h4>
      <Button size="xl">Extra large</Button>
    </div>
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Los 5 tamaños estándar del sistema de diseño. XS para contextos compactos, MD para uso general, XL para destacar.'
    }
  }
};

// ========== 3. VARIANTS STORY (OBLIGATORIA) ==========
export const Variants = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Primary</h4>
      <Button variant="primary">Botón primario</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Secondary</h4>
      <Button variant="secondary">Botón secundario</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Outline</h4>
      <Button variant="outline">Outline</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Ghost</h4>
      <Button variant="ghost">Ghost</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Success</h4>
      <Button variant="success">Success</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Warning</h4>
      <Button variant="warning">Warning</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Danger</h4>
      <Button variant="danger">Danger</Button>
    </div>
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Las 7 variantes visuales disponibles: Primary/Secondary para jerarquía, Outline/Ghost para estilos, Success/Warning/Danger para semántica.'
    }
  }
};

// ========== 4. STATES STORY (OBLIGATORIA) ==========
export const States = () => (
  <div style={{
    display: 'grid',
    gap: 'var(--space-lg)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Normal</h4>
      <Button size="lg">Estado normal</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Hover</h4>
      <Button className="pseudo-hover" size="lg">Estado hover</Button>
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Simulated)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Focus</h4>
      <Button className="pseudo-focus" size="lg">Estado focus</Button>
      <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
        (Simulated)
      </small>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Loading</h4>
      <Button loading size="lg">Cargando</Button>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)' }}>Disabled</h4>
      <Button disabled size="lg">Deshabilitado</Button>
    </div>
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Estados interactivos del componente. Loading muestra spinner, disabled previene interacciones.'
    }
  }
};

// ========== 5. INTERACTIVE STORY (OBLIGATORIA) ==========
export const Interactive = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <Button 
      size="lg"
      onClick={() => alert('¡Botón clickeado!')}
    >
      Hacer click aquí
    </Button>
    
    <Button 
      variant="success"
      leftIcon="zap"
      onClick={() => alert('¡Lanzamiento exitoso!')}
    >
      Lanzar cohete
    </Button>
    
    <Button 
      iconOnly
      leftIcon="heart"
      ariaLabel="Me gusta"
      size="lg"
      onClick={() => alert('¡Te gusta!')}
    />
    
    <Button 
      fullWidth
      variant="warning"
      onClick={() => alert('¡Acción de advertencia!')}
    >
      Botón de ancho completo
    </Button>
  </div>
);

Interactive.parameters = {
  docs: {
    description: {
      story: 'Ejemplos interactivos del botón. Haz click en cualquiera para ver su funcionalidad.'
    }
  }
};

// ========== 6. ACCESSIBILITY STORY (OBLIGATORIA) ==========
export const Accessibility = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    padding: 'var(--space-md)'
  }}>
    <Button 
      ariaLabel="Guardar documento actual"
      leftIcon="save"
      size="lg"
    >
      Guardar
    </Button>
    
    <Button 
      iconOnly
      leftIcon="trash"
      ariaLabel="Eliminar elemento seleccionado"
      variant="danger"
      size="lg"
    />
    
    <Button 
      disabled
      ariaLabel="Función no disponible"
      size="lg"
    >
      No disponible
    </Button>
    
    <Button 
      loading
      ariaLabel="Procesando solicitud"
      size="lg"
    >
      Procesando...
    </Button>
    
    <div style={{ 
      marginTop: 'var(--space-md)', 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--bg-secondary)', 
      borderRadius: 'var(--radius-md)',
      textAlign: 'center'
    }}>
      <h4 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--text-primary)' }}>
        Características de accesibilidad:
      </h4>
      <ul style={{ 
        margin: 0, 
        padding: 0, 
        listStyle: 'none', 
        fontSize: 'var(--text-sm)', 
        color: 'var(--text-muted)' 
      }}>
        <li>✅ ARIA labels para screen readers</li>
        <li>✅ Estados aria-disabled y aria-busy</li>
        <li>✅ Navegación por teclado (Tab, Enter, Space)</li>
        <li>✅ Focus visible con outline</li>
        <li>✅ Área táctil mínima de 44px</li>
      </ul>
    </div>
  </div>
);

Accessibility.parameters = {
  docs: {
    description: {
      story: 'Configuración de accesibilidad completa. Todos los botones son navegables por teclado y compatibles con screen readers.'
    }
  }
};

// ========== 7. NUEVA API DE ICONOS ==========
export const IconSystem = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-md)'
  }}>
    <div>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        ✅ Nueva API de iconos (Recomendada)
      </h3>
      <div style={{
        display: 'grid',
        gap: 'var(--space-md)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        alignItems: 'center'
      }}>
        <Button leftIcon="user" size="lg">
          Icono izquierdo
        </Button>
        
        <Button rightIcon="arrow-right" size="lg">
          Icono derecho
        </Button>
        
        <Button leftIcon="save" rightIcon="check" size="lg">
          Ambos iconos
        </Button>
        
        <Button leftIcon="heart" iconOnly ariaLabel="Me gusta" size="lg" />
        
        <Button leftIcon="download" variant="success" rounded="full" size="lg">
          Descargar
        </Button>
        
        <Button rightIcon="external-link" variant="outline" size="lg">
          Abrir enlace
        </Button>
      </div>
    </div>

    <div style={{ 
      padding: 'var(--space-md)', 
      backgroundColor: 'var(--bg-warning-soft)', 
      border: '1px solid var(--border-warning)',
      borderRadius: 'var(--radius-md)'
    }}>
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-warning)' }}>
        ⚠️ API Legacy (Deprecada - Abre consola para ver warnings)
      </h3>
      <div style={{
        display: 'grid',
        gap: 'var(--space-md)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        alignItems: 'center'
      }}>
        <Button icon="user" iconPosition="left" size="lg">
          Legacy izquierdo
        </Button>
        
        <Button icon="arrow" iconPosition="right" size="lg">
          Legacy derecho
        </Button>
        
        <Button icon="settings" size="lg">
          Legacy (sin position)
        </Button>
      </div>
      
      <div style={{ 
        marginTop: 'var(--space-md)', 
        fontSize: 'var(--text-sm)', 
        color: 'var(--text-muted)' 
      }}>
        <p style={{ margin: '0 0 var(--space-sm) 0' }}>
          <strong>Migración:</strong>
        </p>
        <code style={{ 
          display: 'block', 
          padding: 'var(--space-sm)', 
          backgroundColor: 'var(--bg-code)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'monospace',
          fontSize: 'var(--text-xs)'
        }}>
          {`// ❌ Deprecado
<Button icon="user" iconPosition="left">Texto</Button>

// ✅ Nueva API  
<Button leftIcon="user">Texto</Button>`}
        </code>
      </div>
    </div>
  </div>
);

IconSystem.parameters = {
  docs: {
    description: {
      story: `
Nueva API unificada de iconos con soporte para iconos izquierda/derecha simultáneos.

**Ventajas de la nueva API:**
- \`leftIcon\` y \`rightIcon\` explícitos y claros
- Soporte para ambos iconos al mismo tiempo
- Mejor integración con sistema de iconos
- Props más predictibles y fáciles de usar

**Migración automática:** Las props legacy (\`icon\`, \`iconPosition\`) siguen funcionando pero muestran warnings de deprecación.
      `
    }
  }
};