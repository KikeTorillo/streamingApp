import { Link } from './Link';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Components/Atoms/Link',
  component: Link,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
# Link Atom

El átomo **Link** es el componente unificado de enlaces para nuestro sistema de diseño.

## 🎯 Características principales

- **Integración React Router**: Navegación interna automática con \`to\` prop
- **Enlaces externos**: Auto-detección y configuración segura (\`target="_blank"\`, \`rel="noopener"\`)
- **5 tamaños**: xs (12px), sm (14px), md (16px), lg (18px), xl (20px)
- **5 variantes**: primary, secondary, danger, muted, inherit
- **Iconos opcionales**: Soporte para iconos izquierdo/derecho con Feather Icons
- **Estados interactivos**: hover, focus, active, disabled
- **Accesibilidad**: ARIA completo, navegación por teclado, high contrast
- **Auto-detección**: Enlaces externos automáticamente configurados

## 🔧 Uso básico

\\\`\\\`\\\`jsx
import { Link } from './atoms/Link';

// Enlace interno (React Router)
<Link to="/dashboard">
  Ir al Dashboard
</Link>

// Enlace externo
<Link href="https://google.com">
  Buscar en Google
</Link>

// Con iconos
<Link to="/profile" leftIcon="user">
  Mi Perfil
</Link>

// Con variante
<Link href="/delete" variant="danger" rightIcon="trash">
  Eliminar
</Link>
\\\`\\\`\\\`

## 🔗 Tipos de enlaces

### Enlaces Internos (React Router)
- Usar prop \`to\` para rutas internas
- Navegación SPA sin recarga de página
- Integración completa con React Router

### Enlaces Externos
- Usar prop \`href\` para URLs externas
- Auto-detección de URLs externas (http://, https://, mailto:, tel:)
- Configuración automática de \`target="_blank"\` y \`rel="noopener noreferrer"\`
- Icono de enlace externo automático

## 🚀 Ejemplos avanzados

\\\`\\\`\\\`jsx
// Enlace con icono y estado hover
<Link 
  to="/settings" 
  leftIcon="settings" 
  variant="secondary"
  size="lg"
>
  Configuración
</Link>

// Enlace externo con icono personalizado
<Link 
  href="https://github.com/proyecto" 
  rightIcon="external-link"
  variant="primary"
>
  Ver en GitHub
</Link>

// Enlace deshabilitado
<Link 
  to="/premium" 
  disabled
  leftIcon="star"
>
  Función Premium (Próximamente)
</Link>
\\\`\\\`\\\`

## 📱 Responsive y Accesibilidad

- **Touch targets**: Mínimo 44px en móvil para fácil interacción
- **Navegación por teclado**: Focus visible y navegación completa
- **Lectores de pantalla**: ARIA labels y roles apropiados
- **High contrast**: Soporte para modo de alto contraste
- **Reduced motion**: Respeta preferencias de animación reducida
        `
      }
    }
  },
  argTypes: {
    to: {
      name: 'Ruta interna (to)',
      description: 'Ruta para navegación interna con React Router',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Navigation'
      }
    },
    href: {
      name: 'URL externa (href)',
      description: 'URL externa o absoluta',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Navigation'
      }
    },
    children: {
      name: 'Contenido',
      description: 'Contenido del enlace (React nodes)',
      control: { type: 'text' },
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content'
      }
    },
    text: {
      name: 'Texto',
      description: 'Alternativa a children para texto simple',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Content'
      }
    },
    size: {
      name: 'Tamaño',
      description: 'Tamaño del enlace',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: "'md'" },
        category: 'Appearance'
      }
    },
    variant: {
      name: 'Variante',
      description: 'Variante visual del enlace',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'muted', 'inherit'],
      table: {
        type: { summary: "'primary' | 'secondary' | 'danger' | 'muted' | 'inherit'" },
        defaultValue: { summary: "'primary'" },
        category: 'Appearance'
      }
    },
    leftIcon: {
      name: 'Icono izquierdo',
      description: 'Nombre del icono Feather para mostrar a la izquierda',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Icons'
      }
    },
    rightIcon: {
      name: 'Icono derecho',
      description: 'Nombre del icono Feather para mostrar a la derecha',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Icons'
      }
    },
    external: {
      name: 'Forzar externo',
      description: 'Forzar comportamiento de enlace externo',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Behavior'
      }
    },
    underline: {
      name: 'Subrayado',
      description: 'Mostrar subrayado en el texto',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Appearance'
      }
    },
    disabled: {
      name: 'Deshabilitado',
      description: 'Estado deshabilitado del enlace',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State'
      }
    },
    ariaLabel: {
      name: 'Etiqueta ARIA',
      description: 'Etiqueta de accesibilidad para lectores de pantalla',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Accessibility'
      }
    },
    className: {
      name: 'Clases CSS',
      description: 'Clases CSS adicionales',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        category: 'Styling'
      }
    }
  }
};

// Story principal
export const Default = {
  args: {
    to: '/dashboard',
    children: 'Ir al Dashboard',
    size: 'md',
    variant: 'primary'
  }
};

// Tamaños
export const Sizes = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { size: 'xs', px: '12px' },
      { size: 'sm', px: '14px' },
      { size: 'md', px: '16px' },
      { size: 'lg', px: '18px' },
      { size: 'xl', px: '20px' }
    ].map(({ size, px }) => (
      <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <Link to="/example" size={size} leftIcon="arrow-right">
          Enlace {size.toUpperCase()}
        </Link>
        <span style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-family-mono)'
        }}>
          {px}
        </span>
      </div>
    ))}
  </div>
);

// Variantes de color
export const Variants = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    gap: 'var(--space-lg)',
    padding: 'var(--space-lg)'
  }}>
    {[
      { variant: 'primary', desc: 'Enlaces principales y acciones importantes' },
      { variant: 'secondary', desc: 'Enlaces secundarios y navegación' },
      { variant: 'danger', desc: 'Acciones destructivas como eliminar' },
      { variant: 'muted', desc: 'Enlaces de baja importancia' },
      { variant: 'inherit', desc: 'Hereda color del elemento padre' }
    ].map(({ variant, desc }) => (
      <div key={variant} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-xs)'
      }}>
        <Link to="/example" variant={variant} size="lg">
          Enlace {variant}
        </Link>
        <span style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--text-muted)'
        }}>
          {desc}
        </span>
      </div>
    ))}
  </div>
);

// Enlaces internos vs externos
export const InternalVsExternal = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    {/* Enlaces internos */}
    <div style={{ 
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)'
    }}>
      <h3 style={{ 
        marginBottom: 'var(--space-md)',
        color: 'var(--color-primary)',
        fontSize: 'var(--font-size-lg)'
      }}>
        Enlaces Internos (React Router)
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Link to="/dashboard" leftIcon="home">
          Dashboard
        </Link>
        <Link to="/profile" leftIcon="user">
          Mi Perfil
        </Link>
        <Link to="/settings" leftIcon="settings" variant="secondary">
          Configuración
        </Link>
        <Link to="/help" leftIcon="info" variant="muted">
          Ayuda
        </Link>
      </div>
      <div style={{ 
        marginTop: 'var(--space-md)',
        padding: 'var(--space-sm)',
        backgroundColor: 'var(--bg-muted)',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-muted)'
      }}>
        💡 Usan prop <code>to</code> para navegación SPA
      </div>
    </div>

    {/* Enlaces externos */}
    <div style={{ 
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)'
    }}>
      <h3 style={{ 
        marginBottom: 'var(--space-md)',
        color: 'var(--color-primary)',
        fontSize: 'var(--font-size-lg)'
      }}>
        Enlaces Externos
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <Link href="https://google.com" leftIcon="search">
          Buscar en Google
        </Link>
        <Link href="https://github.com" leftIcon="external-link">
          Ver en GitHub
        </Link>
        <Link href="mailto:contacto@ejemplo.com" leftIcon="mail" variant="secondary">
          Enviar Email
        </Link>
        <Link href="tel:+1234567890" leftIcon="phone" variant="muted">
          Llamar Teléfono
        </Link>
      </div>
      <div style={{ 
        marginTop: 'var(--space-md)',
        padding: 'var(--space-sm)',
        backgroundColor: 'var(--bg-muted)',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-muted)'
      }}>
        💡 Usan prop <code>href</code> y abren en nueva pestaña
      </div>
    </div>
  </div>
);

// Iconos
export const WithIcons = () => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--space-lg)',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Iconos Izquierdos
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Link to="/home" leftIcon="home">Inicio</Link>
        <Link to="/profile" leftIcon="user">Perfil</Link>
        <Link to="/settings" leftIcon="settings">Configuración</Link>
        <Link to="/downloads" leftIcon="download">Descargas</Link>
      </div>
    </div>

    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Iconos Derechos
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Link to="/next" rightIcon="arrow-right">Siguiente</Link>
        <Link href="https://example.com" rightIcon="external-link">Sitio Web</Link>
        <Link to="/upload" rightIcon="upload">Subir Archivo</Link>
        <Link to="/share" rightIcon="share">Compartir</Link>
      </div>
    </div>

    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Sin Iconos
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Link to="/about">Acerca de</Link>
        <Link to="/contact">Contacto</Link>
        <Link to="/terms">Términos</Link>
        <Link to="/privacy">Privacidad</Link>
      </div>
    </div>
  </div>
);

// Estados especiales
export const SpecialStates = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Con Subrayado
      </h4>
      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <Link to="/example" underline variant="primary">
          Enlace subrayado
        </Link>
        <Link to="/example" underline={false} variant="secondary">
          Sin subrayado
        </Link>
      </div>
    </div>

    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Estado Deshabilitado
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Link to="/premium" disabled leftIcon="star">
          Función Premium (Próximamente)
        </Link>
        <Link href="https://example.com" disabled rightIcon="external-link">
          Enlace deshabilitado
        </Link>
        <Link to="/admin" disabled variant="danger" leftIcon="shield">
          Acceso restringido
        </Link>
      </div>
    </div>

    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Variante Inherit
      </h4>
      <div style={{ 
        color: 'var(--color-success)',
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-semibold)'
      }}>
        Texto con color personalizado: <Link to="/example" variant="inherit">enlace heredado</Link>
      </div>
    </div>
  </div>
);

// Casos de uso en navegación
export const NavigationExamples = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    {/* Breadcrumbs */}
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Breadcrumbs
      </h4>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Link to="/admin" variant="muted" size="sm">Admin</Link>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <Link to="/admin/users" variant="muted" size="sm">Usuarios</Link>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)' }}>
          Juan Pérez
        </span>
      </nav>
    </div>

    {/* Menú de navegación */}
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Menú de Navegación
      </h4>
      <nav style={{ 
        display: 'flex', 
        gap: 'var(--space-lg)',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)'
      }}>
        <Link to="/dashboard" leftIcon="home" variant="primary">
          Dashboard
        </Link>
        <Link to="/movies" leftIcon="film" variant="secondary">
          Películas
        </Link>
        <Link to="/series" leftIcon="tv" variant="secondary">
          Series
        </Link>
        <Link to="/users" leftIcon="users" variant="secondary">
          Usuarios
        </Link>
        <Link to="/settings" leftIcon="settings" variant="muted">
          Configuración
        </Link>
      </nav>
    </div>

    {/* Enlaces de acción */}
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Enlaces de Acción
      </h4>
      <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
        <Link to="/create" leftIcon="plus" variant="primary" size="lg">
          Crear Nuevo
        </Link>
        <Link to="/edit" leftIcon="edit" variant="secondary">
          Editar
        </Link>
        <Link to="/delete" leftIcon="trash" variant="danger">
          Eliminar
        </Link>
        <Link href="/export" leftIcon="download" variant="muted">
          Exportar
        </Link>
      </div>
    </div>
  </div>
);

// Accesibilidad
export const AccessibilityExamples = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    padding: 'var(--space-lg)'
  }}>
    <div>
      <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
        Con ARIA Labels
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Link 
          to="/profile" 
          leftIcon="user" 
          ariaLabel="Ir a mi perfil de usuario"
        >
          Perfil
        </Link>
        <Link 
          href="mailto:soporte@empresa.com" 
          leftIcon="mail"
          ariaLabel="Enviar email al equipo de soporte"
        >
          Contactar Soporte
        </Link>
        <Link 
          href="https://docs.empresa.com" 
          rightIcon="external-link"
          ariaLabel="Abrir documentación en nueva pestaña"
        >
          Documentación
        </Link>
      </div>
    </div>

    <div style={{ 
      padding: 'var(--space-md)',
      backgroundColor: 'var(--bg-muted)',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--text-muted)'
    }}>
      💡 <strong>Navegación por teclado:</strong> Usa Tab para navegar, Enter/Espacio para activar
    </div>
  </div>
);