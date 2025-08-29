// Accordion.stories.jsx - Documentación y ejemplos del componente Accordion
// 🎯 MIGRADO AL SISTEMA ESTÁNDAR - V2.0 ✅
import { Accordion, AccordionItem } from './Accordion';
// import { Icon } from '../atoms/Icon/Icon'; // Removido - no usado

export default {
  title: 'Components/Molecules/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: `
## Accordion - Componente de Acordeón 🎯 MIGRADO V2.0

Sistema de acordeón completo integrado al sistema de diseño estándar.

### 🚀 Nuevas Características V2.0
- ✅ **Sistema estándar integrado**: size, variant, rounded, loading, disabled
- ✅ **Tokens automáticos**: espaciado, colores y tipografía dinámicos
- ✅ **6 variantes semánticas**: primary, secondary, success, warning, danger, neutral
- ✅ **5 tamaños estándar**: xs, sm, md, lg, xl
- ✅ **Estados loading**: spinner y overlay automáticos
- ✅ **Backward compatibility**: soporte legacy con warnings

### Casos de Uso
- **FAQ sections** en páginas de ayuda
- **Series Detail** con información adicional colapsable  
- **Admin Panel** con secciones de configuración avanzada
- **Settings Page** para agrupar opciones relacionadas

### Características Conservadas
- ✅ Single/multiple items abiertos
- ✅ Animaciones smooth con CSS transitions  
- ✅ Iconos personalizables
- ✅ Contenido anidado dinámico
- ✅ Keyboard navigation completa
- ✅ Accesibilidad WCAG 2.1 AA
        `
      }
    }
  },
  argTypes: {
    // Props del sistema estándar
    size: {
      control: 'select', 
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del acordeón (sistema estándar)'
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante semántica del acordeón (sistema estándar)'
    },
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de bordes (sistema estándar)'
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita todo el acordeón'
    },
    loading: {
      control: 'boolean',
      description: 'Muestra estado de carga con spinner'
    },
    // Props específicas de Accordion
    allowMultiple: {
      control: 'boolean',
      description: 'Permite múltiples items abiertos simultáneamente'
    },
    animated: {
      control: 'boolean',
      description: 'Habilita animaciones de expand/collapse'
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
          <li>Haz clic en &ldquo;Cambiar contraseña&rdquo;</li>
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
          <li>Ve a &ldquo;Gestionar suscripción&rdquo;</li>
          <li>Selecciona &ldquo;Cancelar suscripción&rdquo;</li>
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
  variant: 'neutral', // Nuevo sistema estándar
  size: 'md',
  rounded: 'md',
  allowMultiple: false,
  animated: true
};

// Story: FAQ Completo
export const FAQExample = Template.bind({});
FAQExample.args = {
  items: sampleFAQItems,
  variant: 'primary', // Mapeado de separated -> primary
  size: 'md',
  rounded: 'md',
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

// Story: Sistema de variantes estándar
export const SystemStandardVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h3>Primary - Acordeón principal/importante</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} variant="primary" size="md" />
    </div>
    
    <div>
      <h3>Secondary - Acordeón secundario</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} variant="secondary" size="md" />
    </div>
    
    <div>
      <h3>Success - Estado positivo/completado</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} variant="success" size="md" />
    </div>
    
    <div>
      <h3>Warning - Advertencias/precaución</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} variant="warning" size="md" />
    </div>
    
    <div>
      <h3>Danger - Errores/crítico</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} variant="danger" size="md" />
    </div>
    
    <div>
      <h3>Neutral - Por defecto/minimalista</h3>
      <Accordion items={sampleFAQItems.slice(0, 2)} variant="neutral" size="md" />
    </div>
  </div>
);
SystemStandardVariants.parameters = {
  docs: {
    description: {
      story: 'Las 6 variantes semánticas del sistema estándar con significado especifico para cada caso de uso.'
    }
  }
};

// Story: Tamaños estándar del sistema
export const SystemStandardSizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h3>Extra Small (xs)</h3>
      <Accordion items={sampleFAQItems.slice(0, 1)} size="xs" variant="neutral" />
    </div>
    
    <div>
      <h3>Small (sm)</h3>
      <Accordion items={sampleFAQItems.slice(0, 1)} size="sm" variant="neutral" />
    </div>
    
    <div>
      <h3>Medium (md) - Por defecto</h3>
      <Accordion items={sampleFAQItems.slice(0, 1)} size="md" variant="neutral" />
    </div>
    
    <div>
      <h3>Large (lg)</h3>
      <Accordion items={sampleFAQItems.slice(0, 1)} size="lg" variant="neutral" />
    </div>
    
    <div>
      <h3>Extra Large (xl)</h3>
      <Accordion items={sampleFAQItems.slice(0, 1)} size="xl" variant="neutral" />
    </div>
  </div>
);
SystemStandardSizes.parameters = {
  docs: {
    description: {
      story: 'Los 5 tamaños estándar del sistema de diseño con espaciado y tipografía automáticos.'
    }
  }
};

// Story: Configuración de Admin Panel
export const AdminConfiguration = Template.bind({});
AdminConfiguration.args = {
  items: configurationItems,
  variant: 'primary', // Mapeado de bordered -> primary
  size: 'md',
  rounded: 'md',
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

// Story: Estados del sistema estándar
export const SystemStandardStates = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
    <div>
      <h3>Estado Normal - Interactivo</h3>
      <Accordion 
        items={sampleFAQItems.slice(0, 2)} 
        variant="primary" 
        size="md" 
        defaultOpenItems={['password']}
      />
    </div>
    
    <div>
      <h3>Estado Disabled - No interactivo</h3>
      <Accordion 
        items={sampleFAQItems.slice(0, 2)} 
        variant="primary" 
        size="md" 
        disabled={true}
        defaultOpenItems={['password']}
      />
    </div>
    
    <div>
      <h3>Estado Loading - Con spinner</h3>
      <Accordion 
        items={sampleFAQItems.slice(0, 2)} 
        variant="primary" 
        size="md" 
        loading={true}
      />
    </div>
    
    <div>
      <h3>Sin animaciones - Para accesibilidad</h3>
      <Accordion 
        items={sampleFAQItems.slice(0, 2)} 
        variant="primary" 
        size="md" 
        animated={false}
        defaultOpenItems={['password']}
      />
    </div>
  </div>
);
SystemStandardStates.parameters = {
  docs: {
    description: {
      story: 'Estados estándar del sistema: normal, disabled, loading y sin animaciones.'
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
  variant: 'neutral', // Actualizado al sistema estándar
  size: 'md',
  rounded: 'md',
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
  variant: 'primary',
  size: 'md',
  rounded: 'md',
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
  variant: 'secondary', // Mapeado de separated -> secondary
  size: 'md',
  rounded: 'md'
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
  variant: 'secondary',
  size: 'md',
  defaultOpenItems: ['stats']
};
DynamicContent.parameters = {
  docs: {
    description: {
      story: 'Acordeón con contenido dinámico que recibe props del item y estado de apertura.'
    }
  }
};

// Story: Backward Compatibility
export const BackwardCompatibility = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h3>Legacy: variant=&ldquo;default&rdquo; (funciona, con warning)</h3>
      <Accordion items={sampleFAQItems.slice(0, 1)} variant="default" size="md" />
    </div>
    
    <div>
      <h3>Legacy: variant=&ldquo;bordered&rdquo; (funciona, con warning)</h3>
      <Accordion items={sampleFAQItems.slice(0, 1)} variant="bordered" size="md" />
    </div>
    
    <div>
      <h3>Legacy: variant=&ldquo;separated&rdquo; (funciona, con warning)</h3>
      <Accordion items={sampleFAQItems.slice(0, 1)} variant="separated" size="md" />
    </div>
    
    <div>
      <h3>Legacy: variant=&ldquo;minimal&rdquo; (funciona, con warning)</h3>
      <Accordion items={sampleFAQItems.slice(0, 1)} variant="minimal" size="md" />
    </div>
  </div>
);
BackwardCompatibility.parameters = {
  docs: {
    description: {
      story: 'Demostración de backward compatibility con props legacy. Verifica la consola para warnings de deprecación.'
    }
  }
};