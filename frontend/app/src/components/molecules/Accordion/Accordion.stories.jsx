// Accordion.stories.jsx - Documentación y ejemplos del componente Accordion
import { Accordion, AccordionItem } from './Accordion';
import { Icon } from '../../atoms/Icon/Icon';

export default {
  title: 'Components/Molecules/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: `
## Accordion - Componente de Acordeón

Sistema de acordeón completo para organizar contenido colapsable de manera elegante y accesible.

### Casos de Uso
- **FAQ sections** en páginas de ayuda
- **Series Detail** con información adicional colapsable  
- **Admin Panel** con secciones de configuración avanzada
- **Settings Page** para agrupar opciones relacionadas

### Características
- ✅ Single/multiple items abiertos
- ✅ Animaciones smooth con CSS transitions  
- ✅ Iconos personalizables
- ✅ Estados disabled
- ✅ Contenido anidado
- ✅ Keyboard navigation completa
- ✅ Accesibilidad WCAG 2.1 AA
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'separated', 'minimal'],
      description: 'Variante visual del acordeón'
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del acordeón'
    },
    allowMultiple: {
      control: 'boolean',
      description: 'Permite múltiples items abiertos simultáneamente'
    },
    animated: {
      control: 'boolean',
      description: 'Habilita animaciones de expand/collapse'
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita todo el acordeón'
    },
    expandIcon: {
      control: 'text',
      description: 'Icono para expandir (Feather icon name)'
    },
    collapseIcon: {
      control: 'text',
      description: 'Icono para colapsar (Feather icon name)'
    }
  }
};

// Datos de ejemplo para las stories
const sampleFAQItems = [
  {
    id: 'password',
    title: '¿Cómo cambio mi contraseña?',
    icon: 'lock',
    content: (
      <div>
        <p>Para cambiar tu contraseña:</p>
        <ol>
          <li>Ve a Configuración → Seguridad</li>
          <li>Haz clic en "Cambiar contraseña"</li>
          <li>Ingresa tu contraseña actual</li>
          <li>Ingresa tu nueva contraseña</li>
          <li>Confirma los cambios</li>
        </ol>
        <p><strong>Recomendación:</strong> Usa una contraseña fuerte con al menos 8 caracteres.</p>
      </div>
    )
  },
  {
    id: 'subscription', 
    title: '¿Cómo cancelo mi suscripción?',
    subtitle: 'Gestión de cuenta',
    icon: 'user',
    badge: 'Popular',
    content: (
      <div>
        <p>Para cancelar tu suscripción:</p>
        <ul>
          <li>Accede a tu perfil de usuario</li>
          <li>Ve a "Gestionar suscripción"</li>
          <li>Selecciona "Cancelar suscripción"</li>
          <li>Confirma la cancelación</li>
        </ul>
        <p><em>Nota: Mantendrás acceso hasta el final del período de facturación.</em></p>
      </div>
    )
  },
  {
    id: 'streaming',
    title: '¿Por qué el video no se reproduce?',
    icon: 'video',
    badge: 3,
    content: (
      <div>
        <p>Posibles causas y soluciones:</p>
        <ul>
          <li><strong>Conexión lenta:</strong> Verifica tu velocidad de internet</li>
          <li><strong>Browser obsoleto:</strong> Actualiza tu navegador</li>
          <li><strong>Ad blockers:</strong> Desactiva extensiones que bloqueen contenido</li>
          <li><strong>Caché:</strong> Limpia el caché del navegador</li>
        </ul>
        <p>Si el problema persiste, contacta soporte técnico.</p>
      </div>
    )
  },
  {
    id: 'devices',
    title: '¿En cuántos dispositivos puedo ver contenido?',
    icon: 'monitor',
    disabled: true,
    content: (
      <div>
        <p>El número de dispositivos depende de tu plan:</p>
        <ul>
          <li><strong>Plan Básico:</strong> 1 dispositivo</li>
          <li><strong>Plan Estándar:</strong> 2 dispositivos</li>
          <li><strong>Plan Premium:</strong> 4 dispositivos</li>
        </ul>
      </div>
    )
  }
];

const configurationItems = [
  {
    id: 'general',
    title: 'Configuración General',
    icon: 'settings',
    content: (
      <div>
        <h4>Opciones generales del sistema</h4>
        <p>Personaliza la experiencia básica de la aplicación.</p>
        <ul>
          <li>Idioma de la interfaz</li>
          <li>Zona horaria</li>
          <li>Formato de fecha</li>
          <li>Tema visual</li>
        </ul>
      </div>
    )
  },
  {
    id: 'privacy',
    title: 'Privacidad y Datos',
    icon: 'shield',
    badge: 'Nuevo',
    content: (
      <div>
        <h4>Gestión de privacidad</h4>
        <p>Controla cómo se manejan tus datos personales.</p>
        <ul>
          <li>Configuración de cookies</li>
          <li>Datos de navegación</li>
          <li>Historial de visualización</li>
          <li>Compartir datos de uso</li>
        </ul>
      </div>
    )
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    icon: 'bell',
    content: (
      <div>
        <h4>Preferencias de notificaciones</h4>
        <p>Decide qué notificaciones quieres recibir.</p>
        <ul>
          <li>Nuevos episodios</li>
          <li>Recomendaciones</li>
          <li>Actualizaciones del sistema</li>
          <li>Recordatorios de pago</li>
        </ul>
      </div>
    )
  }
];

// Template base
const Template = (args) => <Accordion {...args} />;

// Story: Ejemplo básico
export const Default = Template.bind({});
Default.args = {
  items: sampleFAQItems.slice(0, 2),
  variant: 'default',
  size: 'md',
  allowMultiple: false,
  animated: true
};

// Story: FAQ Completo
export const FAQExample = Template.bind({});
FAQExample.args = {
  items: sampleFAQItems,
  variant: 'separated',
  size: 'md',
  allowMultiple: true,
  defaultOpenItems: ['password'],
  animated: true
};
FAQExample.parameters = {
  docs: {
    description: {
      story: 'Ejemplo completo de FAQ con múltiples items, iconos, badges y estados disabled.'
    }
  }
};

// Story: Múltiples variantes
export const Variants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h3>Default</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} variant="default" />
    </div>
    
    <div>
      <h3>Bordered</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} variant="bordered" />
    </div>
    
    <div>
      <h3>Separated</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} variant="separated" />
    </div>
    
    <div>
      <h3>Minimal</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} variant="minimal" />
    </div>
  </div>
);

// Story: Tamaños diferentes
export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h3>Small</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} size="sm" />
    </div>
    
    <div>
      <h3>Medium (Default)</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} size="md" />
    </div>
    
    <div>
      <h3>Large</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} size="lg" />
    </div>
  </div>
);

// Story: Configuración de Admin Panel
export const AdminConfiguration = Template.bind({});
AdminConfiguration.args = {
  items: configurationItems,
  variant: 'bordered',
  size: 'md',
  allowMultiple: true,
  defaultOpenItems: ['general'],
  animated: true
};
AdminConfiguration.parameters = {
  docs: {
    description: {
      story: 'Ejemplo de uso en panel de administración con secciones de configuración.'
    }
  }
};

// Story: Single Item (AccordionItem)
export const SingleItem = () => (
  <AccordionItem
    title="¿Qué es el streaming?"
    subtitle="Conceptos básicos"
    icon="video"
    defaultOpen={true}
    content={
      <div>
        <p>El streaming es una tecnología que permite reproducir contenido multimedia en tiempo real sin necesidad de descargarlo completamente.</p>
        <h4>Ventajas del streaming:</h4>
        <ul>
          <li>Reproducción instantánea</li>
          <li>No ocupa espacio en el dispositivo</li>
          <li>Acceso a gran variedad de contenido</li>
          <li>Disponible en múltiples dispositivos</li>
        </ul>
      </div>
    }
  />
);
SingleItem.parameters = {
  docs: {
    description: {
      story: 'Componente AccordionItem para uso individual sin necesidad del array completo.'
    }
  }
};

// Story: Sin animaciones
export const NoAnimation = Template.bind({});
NoAnimation.args = {
  items: sampleFAQItems.slice(0, 2),
  variant: 'default', 
  animated: false,
  defaultOpenItems: ['password']
};
NoAnimation.parameters = {
  docs: {
    description: {
      story: 'Acordeón sin animaciones para usuarios que prefieren reducir el movimiento o para mejor rendimiento.'
    }
  }
};

// Story: Estado disabled
export const DisabledState = Template.bind({});
DisabledState.args = {
  items: sampleFAQItems.slice(0, 2),
  disabled: true,
  defaultOpenItems: ['password']
};
DisabledState.parameters = {
  docs: {
    description: {
      story: 'Estado disabled del acordeón completo.'
    }
  }
};

// Story: Iconos personalizados
export const CustomIcons = Template.bind({});
CustomIcons.args = {
  items: sampleFAQItems.slice(0, 2),
  expandIcon: 'plus',
  collapseIcon: 'minus',
  variant: 'separated'
};
CustomIcons.parameters = {
  docs: {
    description: {
      story: 'Acordeón con iconos personalizados para expand/collapse.'
    }
  }
};

// Story: Contenido dinámico
export const DynamicContent = Template.bind({});
DynamicContent.args = {
  items: [
    {
      id: 'stats',
      title: 'Estadísticas de Usuario',
      icon: 'trending',
      content: (item, isOpen) => (
        <div>
          <p>Estado: {isOpen ? 'Expandido' : 'Colapsado'}</p>
          <p>Tiempo de carga: {new Date().toLocaleTimeString()}</p>
          <div style={{ 
            padding: '1rem', 
            background: 'var(--color-bg-secondary)', 
            borderRadius: '8px',
            marginTop: '0.5rem'
          }}>
            <h4>Datos en tiempo real:</h4>
            <ul>
              <li>Videos vistos: {Math.floor(Math.random() * 100)}</li>
              <li>Tiempo total: {Math.floor(Math.random() * 500)} horas</li>
              <li>Género favorito: Acción</li>
            </ul>
          </div>
        </div>
      )
    }
  ],
  defaultOpenItems: ['stats']
};
DynamicContent.parameters = {
  docs: {
    description: {
      story: 'Acordeón con contenido dinámico que recibe props del item y estado de apertura.'
    }
  }
};