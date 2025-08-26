// src/components/atoms/Card/Card.stories.jsx
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  CardMedia, 
  CardTitle, 
  CardSubtitle, 
  CardDescription 
} from './Card';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

export default {
  title: 'Components/Atoms/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: 'Componente Card universal con 8 sub-componentes para composición flexible. Soporte completo para aspect ratios, interactividad, estados y variantes semánticas del sistema V2.0.'
      }
    }
  },
  argTypes: {
    size: {
      description: 'Tamaño estándar del sistema',
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    variant: {
      description: 'Variante semántica estándar',
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']
    },
    rounded: {
      description: 'Radio de bordes estándar',
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full']
    },
    aspectRatio: {
      description: 'Aspect ratio predefinido o personalizado',
      control: { type: 'select' },
      options: ['square', 'portrait', 'landscape', 'wide', 'ultrawide', 'golden', 'card', 'mobile']
    },
    clickable: {
      description: 'Hacer la card clickeable',
      control: { type: 'boolean' }
    },
    loading: {
      description: 'Estado de carga con overlay',
      control: { type: 'boolean' }
    },
    disabled: {
      description: 'Estado deshabilitado',
      control: { type: 'boolean' }
    }
  }
};

// Historia base/default
export const Default = {
  args: {
    size: 'md',
    variant: 'neutral',
    rounded: 'md'
  },
  render: (args) => (
    <Card {...args}>
      <CardBody>
        <p>Contenido básico de una card. Puedes agregar cualquier elemento aquí.</p>
      </CardBody>
    </Card>
  )
};

// ===== TAMAÑOS =====

export const Sizes = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem' }}>
    <Card size="xs">
      <CardBody>
        <CardTitle as="h4">Extra Small</CardTitle>
        <CardDescription>Card compacta para espacios reducidos</CardDescription>
      </CardBody>
    </Card>
    
    <Card size="sm">
      <CardBody>
        <CardTitle as="h4">Small</CardTitle>
        <CardDescription>Card pequeña para layouts densos</CardDescription>
      </CardBody>
    </Card>
    
    <Card size="md">
      <CardBody>
        <CardTitle as="h4">Medium (Default)</CardTitle>
        <CardDescription>Tamaño estándar para uso general</CardDescription>
      </CardBody>
    </Card>
    
    <Card size="lg">
      <CardBody>
        <CardTitle as="h4">Large</CardTitle>
        <CardDescription>Card prominente para contenido importante</CardDescription>
      </CardBody>
    </Card>
    
    <Card size="xl">
      <CardBody>
        <CardTitle as="h4">Extra Large</CardTitle>
        <CardDescription>Card muy visible para contenido hero</CardDescription>
      </CardBody>
    </Card>
  </div>
);

Sizes.parameters = {
  docs: {
    description: {
      story: 'Cinco tamaños estándar con padding y tipografía apropiados para cada contexto.'
    }
  }
};

// ===== VARIANTES SEMÁNTICAS =====

export const Variants = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', padding: '1rem' }}>
    <Card variant="primary">
      <CardBody>
        <CardTitle>Primary Card</CardTitle>
        <CardDescription>Para contenido principal o destacado</CardDescription>
      </CardBody>
    </Card>
    
    <Card variant="secondary">
      <CardBody>
        <CardTitle>Secondary Card</CardTitle>
        <CardDescription>Para contenido secundario o de apoyo</CardDescription>
      </CardBody>
    </Card>
    
    <Card variant="success">
      <CardBody>
        <CardTitle>Success Card</CardTitle>
        <CardDescription>Para mostrar estados exitosos o confirmaciones</CardDescription>
      </CardBody>
    </Card>
    
    <Card variant="warning">
      <CardBody>
        <CardTitle>Warning Card</CardTitle>
        <CardDescription>Para advertencias o información que requiere atención</CardDescription>
      </CardBody>
    </Card>
    
    <Card variant="danger">
      <CardBody>
        <CardTitle>Danger Card</CardTitle>
        <CardDescription>Para errores o contenido crítico</CardDescription>
      </CardBody>
    </Card>
    
    <Card variant="neutral">
      <CardBody>
        <CardTitle>Neutral Card</CardTitle>
        <CardDescription>Variante neutral por defecto, sin connotación semántica</CardDescription>
      </CardBody>
    </Card>
  </div>
);

Variants.parameters = {
  docs: {
    description: {
      story: 'Seis variantes semánticas con colores de fondo, bordes y texto apropriados para cada contexto.'
    }
  }
};

// ===== COMPOSICIÓN CON SUB-COMPONENTES =====

export const WithComposition = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', padding: '1rem' }}>
    {/* Card completa con todos los sub-componentes */}
    <Card size="md">
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle>Producto Premium</CardTitle>
          <Badge variant="success" size="sm">Nuevo</Badge>
        </div>
        <CardSubtitle>Tecnología de vanguardia</CardSubtitle>
      </CardHeader>
      
      <CardMedia 
        src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=200&fit=crop"
        alt="Producto tecnológico"
        aspectRatio="wide"
      />
      
      <CardBody>
        <CardDescription>
          Descubre la última innovación en tecnología con características avanzadas 
          que transformarán tu experiencia digital.
        </CardDescription>
      </CardBody>
      
      <CardFooter>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="primary" size="sm">Comprar</Button>
          <Button variant="neutral" size="sm">Ver detalles</Button>
        </div>
      </CardFooter>
    </Card>
    
    {/* Card simple con header y body */}
    <Card size="md" variant="primary">
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
      </CardHeader>
      <CardBody>
        <CardDescription>
          Personaliza tu experiencia ajustando las preferencias del sistema.
        </CardDescription>
        <Button variant="secondary" size="sm" style={{ marginTop: '1rem' }}>
          Configurar
        </Button>
      </CardBody>
    </Card>
    
    {/* Card con media y descripción */}
    <Card size="md">
      <CardMedia 
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"
        alt="Desarrollo web"
        aspectRatio="landscape"
      />
      <CardBody>
        <CardTitle>Desarrollo Web</CardTitle>
        <CardDescription>
          Aprende las últimas tecnologías y frameworks para crear aplicaciones modernas.
        </CardDescription>
      </CardBody>
    </Card>
  </div>
);

WithComposition.parameters = {
  docs: {
    description: {
      story: 'Ejemplos de composición usando los 8 sub-componentes: CardHeader, CardBody, CardFooter, CardMedia, CardTitle, CardSubtitle, CardDescription.'
    }
  }
};

// ===== ASPECT RATIOS =====

export const AspectRatios = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', padding: '1rem' }}>
    <Card aspectRatio="square" size="sm">
      <CardMedia 
        src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=300&fit=crop"
        alt="Paisaje cuadrado"
        aspectRatio="square"
      />
      <CardBody>
        <CardTitle as="h4">Square (1:1)</CardTitle>
        <CardDescription>Perfecto para perfiles y avatars</CardDescription>
      </CardBody>
    </Card>
    
    <Card aspectRatio="portrait" size="sm">
      <CardMedia 
        src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=300&h=450&fit=crop"
        alt="Retrato"
        aspectRatio="portrait"
      />
      <CardBody>
        <CardTitle as="h4">Portrait (2:3)</CardTitle>
        <CardDescription>Ideal para posters y libros</CardDescription>
      </CardBody>
    </Card>
    
    <Card aspectRatio="landscape" size="sm">
      <CardMedia 
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=450&h=300&fit=crop"
        alt="Paisaje horizontal"
        aspectRatio="landscape"
      />
      <CardBody>
        <CardTitle as="h4">Landscape (3:2)</CardTitle>
        <CardDescription>Clásico para fotografías</CardDescription>
      </CardBody>
    </Card>
    
    <Card aspectRatio="wide" size="sm">
      <CardMedia 
        src="https://images.unsplash.com/photo-1518792952055-facd7d1ee95a?w=500&h=281&fit=crop"
        alt="Vista amplia"
        aspectRatio="wide"
      />
      <CardBody>
        <CardTitle as="h4">Wide (16:9)</CardTitle>
        <CardDescription>Formato video y banners</CardDescription>
      </CardBody>
    </Card>
    
    <Card aspectRatio="golden" size="sm">
      <CardMedia 
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=247&fit=crop"
        alt="Proporción áurea"
        aspectRatio="golden"
      />
      <CardBody>
        <CardTitle as="h4">Golden (φ:1)</CardTitle>
        <CardDescription>Proporción áurea natural</CardDescription>
      </CardBody>
    </Card>
    
    <Card aspectRatio="card" size="sm">
      <CardMedia 
        src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&h=420&fit=crop"
        alt="Tarjeta tradicional"
        aspectRatio="card"
      />
      <CardBody>
        <CardTitle as="h4">Card (5:7)</CardTitle>
        <CardDescription>Tarjetas tradicionales</CardDescription>
      </CardBody>
    </Card>
  </div>
);

AspectRatios.parameters = {
  docs: {
    description: {
      story: '8 aspect ratios predefinidos: square, portrait, landscape, wide, ultrawide, golden, card, mobile. También soporta valores personalizados como "4/3".'
    }
  }
};

// ===== ESTADOS =====

export const States = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', padding: '1rem' }}>
    <Card>
      <CardBody>
        <CardTitle>Estado Normal</CardTitle>
        <CardDescription>Card en estado normal, completamente interactiva</CardDescription>
      </CardBody>
    </Card>
    
    <Card clickable onClick={() => alert('Card clickeada!')}>
      <CardBody>
        <CardTitle>Clickeable</CardTitle>
        <CardDescription>Card interactiva que responde a clicks y navegación por teclado</CardDescription>
      </CardBody>
    </Card>
    
    <Card loading>
      <CardBody>
        <CardTitle>Estado Loading</CardTitle>
        <CardDescription>Card con overlay de carga y spinner</CardDescription>
      </CardBody>
    </Card>
    
    <Card disabled>
      <CardBody>
        <CardTitle>Estado Disabled</CardTitle>
        <CardDescription>Card deshabilitada, no responde a interacciones</CardDescription>
      </CardBody>
    </Card>
  </div>
);

States.parameters = {
  docs: {
    description: {
      story: 'Estados disponibles: normal, clickeable (con keyboard support), loading (con overlay), y disabled.'
    }
  }
};

// ===== CASOS DE USO REALES - E-COMMERCE =====

export const ECommerceCards = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', padding: '1rem' }}>
    {/* Producto en oferta */}
    <Card clickable onClick={() => console.log('Ver producto')}>
      <div style={{ position: 'relative' }}>
        <CardMedia 
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
          alt="Auriculares inalámbricos"
          aspectRatio="landscape"
        />
        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
          <Badge variant="danger" size="sm">-30%</Badge>
        </div>
      </div>
      
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <CardTitle as="h3">Auriculares Pro</CardTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ color: '#facc15' }}>★</span>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>4.8</span>
          </div>
        </div>
        <CardSubtitle>Cancelación de ruido activa</CardSubtitle>
        <CardDescription>
          Experimenta un audio excepcional con cancelación de ruido líder en la industria.
        </CardDescription>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ef4444' }}>$179.99</span>
          <span style={{ fontSize: '1rem', color: '#6b7280', textDecoration: 'line-through' }}>$259.99</span>
        </div>
      </CardBody>
      
      <CardFooter>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="primary" size="sm" style={{ flex: 1 }}>
            Añadir al carrito
          </Button>
          <Button variant="neutral" size="sm">♡</Button>
        </div>
      </CardFooter>
    </Card>

    {/* Producto agotado */}
    <Card disabled>
      <div style={{ position: 'relative' }}>
        <CardMedia 
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
          alt="Zapatos deportivos"
          aspectRatio="landscape"
        />
        <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
          <Badge variant="neutral" size="sm">Agotado</Badge>
        </div>
      </div>
      
      <CardBody>
        <CardTitle as="h3">Zapatos Running Elite</CardTitle>
        <CardSubtitle>Tecnología de amortiguación avanzada</CardSubtitle>
        <CardDescription>
          Comodidad y rendimiento para tus entrenamientos más intensos.
        </CardDescription>
        <div style={{ marginTop: '1rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>$129.99</span>
        </div>
      </CardBody>
      
      <CardFooter>
        <Button variant="neutral" size="sm" disabled style={{ width: '100%' }}>
          Notificarme cuando esté disponible
        </Button>
      </CardFooter>
    </Card>

    {/* Producto premium */}
    <Card variant="primary">
      <div style={{ position: 'relative' }}>
        <CardMedia 
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
          alt="Reloj inteligente"
          aspectRatio="landscape"
        />
        <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
          <Badge variant="warning" size="sm">Premium</Badge>
        </div>
      </div>
      
      <CardBody>
        <CardTitle as="h3">SmartWatch Pro</CardTitle>
        <CardSubtitle>Seguimiento de salud integral</CardSubtitle>
        <CardDescription>
          Monitor avanzado de salud con GPS, resistencia al agua y batería de 7 días.
        </CardDescription>
        <div style={{ marginTop: '1rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>$399.99</span>
        </div>
      </CardBody>
      
      <CardFooter>
        <Button variant="primary" size="sm" style={{ width: '100%' }}>
          Comprar ahora
        </Button>
      </CardFooter>
    </Card>
  </div>
);

ECommerceCards.parameters = {
  docs: {
    description: {
      story: 'Ejemplos reales de e-commerce: producto en oferta con descuento, producto agotado, y producto premium con badges contextuales.'
    }
  }
};

// ===== CASOS DE USO REALES - BLOG/CMS =====

export const BlogCards = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', padding: '1rem' }}>
    {/* Artículo destacado */}
    <Card size="lg" clickable onClick={() => console.log('Leer artículo')}>
      <CardMedia 
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=250&fit=crop"
        alt="Desarrollo web moderno"
        aspectRatio="wide"
      />
      
      <CardBody>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Badge variant="primary" size="xs">Desarrollo</Badge>
          <Badge variant="secondary" size="xs">React</Badge>
        </div>
        
        <CardTitle as="h2">El Futuro del Desarrollo Web en 2024</CardTitle>
        <CardSubtitle style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Por María González • 15 min de lectura
        </CardSubtitle>
        <CardDescription>
          Descubre las tendencias y tecnologías que están revolucionando el desarrollo web. 
          Desde nuevos frameworks hasta herramientas de IA que cambiarán nuestra forma de programar.
        </CardDescription>
      </CardBody>
      
      <CardFooter>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
          <span>12 Enero 2024</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>👁 2.3k</span>
            <span>💬 47</span>
            <span>❤️ 156</span>
          </div>
        </div>
      </CardFooter>
    </Card>

    {/* Artículo normal */}
    <Card clickable onClick={() => console.log('Leer artículo')}>
      <CardMedia 
        src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop"
        alt="Diseño UX/UI"
        aspectRatio="wide"
      />
      
      <CardBody>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Badge variant="success" size="xs">Diseño</Badge>
          <Badge variant="warning" size="xs">UX</Badge>
        </div>
        
        <CardTitle as="h3">Principios de Diseño para Interfaces Modernas</CardTitle>
        <CardSubtitle style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Por Carlos Ruiz • 8 min de lectura
        </CardSubtitle>
        <CardDescription>
          Aprende los fundamentos del diseño de interfaces que crean experiencias memorables y funcionales.
        </CardDescription>
      </CardBody>
      
      <CardFooter>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
          <span>10 Enero 2024</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>👁 1.8k</span>
            <span>💬 23</span>
            <span>❤️ 89</span>
          </div>
        </div>
      </CardFooter>
    </Card>

    {/* Tutorial */}
    <Card variant="secondary">
      <CardBody>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Badge variant="danger" size="xs">Tutorial</Badge>
          <Badge variant="neutral" size="xs">Principiante</Badge>
        </div>
        
        <CardTitle as="h3">Guía Completa: Tu Primera App React</CardTitle>
        <CardSubtitle style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Por Ana López • Tutorial paso a paso
        </CardSubtitle>
        <CardDescription>
          Tutorial completo para crear tu primera aplicación React desde cero. 
          Incluye setup, componentes, estado y deployment.
        </CardDescription>
        
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Progreso del tutorial:</div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px' }}>
            <div style={{ width: '65%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Lección 7 de 10</div>
        </div>
      </CardBody>
      
      <CardFooter>
        <Button variant="primary" size="sm" style={{ width: '100%' }}>
          Continuar tutorial
        </Button>
      </CardFooter>
    </Card>
  </div>
);

BlogCards.parameters = {
  docs: {
    description: {
      story: 'Casos de uso para blog/CMS: artículo destacado con métricas, artículo estándar, y tutorial con progreso.'
    }
  }
};

// ===== CASOS DE USO REALES - DASHBOARD =====

export const DashboardCards = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', padding: '1rem' }}>
    {/* Widget de métricas */}
    <Card variant="success">
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <CardSubtitle style={{ color: '#059669', fontSize: '0.875rem', fontWeight: '500' }}>
              Ventas del mes
            </CardSubtitle>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#047857' }}>$47,329</div>
            <div style={{ fontSize: '0.75rem', color: '#065f46' }}>+12.5% vs mes anterior</div>
          </div>
          <div style={{ fontSize: '2rem', color: '#10b981' }}>📈</div>
        </div>
      </CardBody>
    </Card>

    {/* Widget de alerta */}
    <Card variant="warning">
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <CardSubtitle style={{ color: '#d97706', fontSize: '0.875rem', fontWeight: '500' }}>
              Stock bajo
            </CardSubtitle>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#b45309' }}>23</div>
            <div style={{ fontSize: '0.75rem', color: '#92400e' }}>productos requieren restock</div>
          </div>
          <div style={{ fontSize: '2rem', color: '#f59e0b' }}>⚠️</div>
        </div>
      </CardBody>
    </Card>

    {/* Widget de usuarios */}
    <Card variant="primary">
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <CardSubtitle style={{ color: '#1d4ed8', fontSize: '0.875rem', fontWeight: '500' }}>
              Usuarios activos
            </CardSubtitle>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af' }}>1,247</div>
            <div style={{ fontSize: '0.75rem', color: '#1e3a8a' }}>+8.2% esta semana</div>
          </div>
          <div style={{ fontSize: '2rem', color: '#3b82f6' }}>👥</div>
        </div>
      </CardBody>
    </Card>

    {/* Widget de tareas pendientes */}
    <Card clickable onClick={() => console.log('Ver tareas')}>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle as="h3">Tareas Pendientes</CardTitle>
          <Badge variant="danger" size="sm">5</Badge>
        </div>
      </CardHeader>
      
      <CardBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem' }}>Revisar reportes financieros</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem' }}>Actualizar inventario</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.875rem' }}>Llamar a proveedor</span>
          </div>
        </div>
      </CardBody>
    </Card>

    {/* Widget de gráfico simple */}
    <Card size="lg" style={{ gridColumn: 'span 2' }}>
      <CardHeader>
        <CardTitle as="h3">Rendimiento Semanal</CardTitle>
        <CardSubtitle>Comparación vs semana anterior</CardSubtitle>
      </CardHeader>
      
      <CardBody>
        <div style={{ height: '120px', display: 'flex', alignItems: 'end', gap: '8px', justifyContent: 'center' }}>
          {[65, 78, 82, 95, 88, 92, 100].map((height, index) => (
            <div
              key={index}
              style={{
                width: '24px',
                height: `${height}%`,
                backgroundColor: '#3b82f6',
                borderRadius: '2px 2px 0 0',
                opacity: 0.8
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
          <span>Lun</span>
          <span>Mar</span>
          <span>Mié</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sáb</span>
          <span>Dom</span>
        </div>
      </CardBody>
    </Card>
  </div>
);

DashboardCards.parameters = {
  docs: {
    description: {
      story: 'Widgets para dashboard: métricas con iconos, alertas con estados, tareas pendientes, y gráficos simples.'
    }
  }
};

// ===== PLAYGROUND INTERACTIVO =====

export const InteractivePlayground = {
  args: {
    size: 'md',
    variant: 'neutral',
    rounded: 'md',
    aspectRatio: undefined,
    clickable: false,
    loading: false,
    disabled: false
  },
  render: (args) => (
    <Card {...args} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <CardHeader>
        <CardTitle>Card Interactiva</CardTitle>
        <CardSubtitle>Experimenta con las propiedades</CardSubtitle>
      </CardHeader>
      
      <CardMedia 
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
        alt="Imagen de ejemplo"
        aspectRatio="wide"
      />
      
      <CardBody>
        <CardDescription>
          Usa los controles de abajo para experimentar con todas las propiedades 
          disponibles del componente Card.
        </CardDescription>
      </CardBody>
      
      <CardFooter>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="primary" size="sm">Acción</Button>
          <Button variant="neutral" size="sm">Cancelar</Button>
        </div>
      </CardFooter>
    </Card>
  )
};

InteractivePlayground.parameters = {
  docs: {
    description: {
      story: 'Playground interactivo para experimentar con todas las propiedades del Card. Usa los controles para probar diferentes configuraciones.'
    }
  }
};