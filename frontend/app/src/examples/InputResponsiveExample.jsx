// Ejemplo del NUEVO SISTEMA DE INPUT - Tamaños fijos + Semánticos
import React, { useState } from 'react';
import { Container, FlexContainer, Input, Typography } from '../../design-system';

export function InputResponsiveExample() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container size="xl" padding="xl">
      <Typography size="2xl" weight="bold" style={{ marginBottom: '2rem' }}>
        🎯 NUEVO Sistema Input: Tamaños Fijos + Alturas Estándar
      </Typography>

      {/* Ejemplo 1: Tamaños fijos estándar */}
      <div style={{ marginBottom: '2rem' }}>
        <Typography size="lg" weight="semibold" style={{ marginBottom: '1rem' }}>
          1. ✅ Tamaños fijos estándar (width) - PREDECIBLES
        </Typography>
        <FlexContainer direction="column" gap="md" style={{ border: '2px dashed #28a745', padding: '1rem' }}>
          <div>
            <Typography size="sm" style={{ marginBottom: '0.5rem' }}>
              width="xs" (120px) - Ideal para códigos, IDs
            </Typography>
            <Input placeholder="ABC123" width="xs" size="md" />
          </div>
          <div>
            <Typography size="sm" style={{ marginBottom: '0.5rem' }}>
              width="sm" (200px) - Teléfono, código postal
            </Typography>
            <Input placeholder="+1 (555) 123-4567" width="sm" size="md" />
          </div>
          <div>
            <Typography size="sm" style={{ marginBottom: '0.5rem' }}>
              width="md" (300px) - Email, nombre (ESTÁNDAR)
            </Typography>
            <Input placeholder="usuario@ejemplo.com" width="md" size="md" />
          </div>
          <div>
            <Typography size="sm" style={{ marginBottom: '0.5rem' }}>
              width="lg" (400px) - Direcciones, campos largos
            </Typography>
            <Input placeholder="123 Calle Principal, Ciudad, Estado" width="lg" size="md" />
          </div>
          <div>
            <Typography size="sm" style={{ marginBottom: '0.5rem' }}>
              width="xl" (500px) - Descripciones, comentarios
            </Typography>
            <Input placeholder="Describe tu experiencia con el producto..." width="xl" size="md" />
          </div>
        </FlexContainer>
      </div>

      {/* Ejemplo 2: Alturas fijas (size) */}
      <div style={{ marginBottom: '2rem' }}>
        <Typography size="lg" weight="semibold" style={{ marginBottom: '1rem' }}>
          2. ✅ Alturas fijas (size) - CONSISTENTES
        </Typography>
        <FlexContainer direction="column" gap="sm" style={{ border: '2px dashed #6f42c1', padding: '1rem' }}>
          <div>
            <Typography size="xs" style={{ marginBottom: '0.25rem' }}>size="xs" (32px) - Interfaces densas</Typography>
            <Input placeholder="Compacto" size="xs" width="md" />
          </div>
          <div>
            <Typography size="xs" style={{ marginBottom: '0.25rem' }}>size="sm" (40px) - Inputs compactos</Typography>
            <Input placeholder="Pequeño" size="sm" width="md" />
          </div>
          <div>
            <Typography size="xs" style={{ marginBottom: '0.25rem' }}>size="md" (48px) - Estándar recomendado</Typography>
            <Input placeholder="Estándar" size="md" width="md" />
          </div>
          <div>
            <Typography size="xs" style={{ marginBottom: '0.25rem' }}>size="lg" (56px) - Campos importantes</Typography>
            <Input placeholder="Grande" size="lg" width="md" />
          </div>
          <div>
            <Typography size="xs" style={{ marginBottom: '0.25rem' }}>size="xl" (64px) - Hero, CTAs</Typography>
            <Input placeholder="Extra grande" size="xl" width="md" />
          </div>
        </FlexContainer>
      </div>

      {/* Ejemplo 3: Combinaciones prácticas */}
      <div style={{ marginBottom: '2rem' }}>
        <Typography size="lg" weight="semibold" style={{ marginBottom: '1rem' }}>
          3. 🎯 Combinaciones prácticas reales
        </Typography>
        <FlexContainer direction="column" gap="lg" style={{ border: '2px dashed #17a2b8', padding: '1rem' }}>
          <div>
            <Typography size="sm" weight="semibold" style={{ marginBottom: '0.5rem' }}>
              Login form - Tamaños estándar
            </Typography>
            <FlexContainer direction="column" gap="sm">
              <Input 
                placeholder="Email" 
                type="email"
                leftIcon="email"
                size="md" 
                width="lg" 
                variant="primary"
              />
              <Input 
                placeholder="Contraseña" 
                type="password"
                leftIcon="lock"
                rightIcon="eye"
                size="md" 
                width="lg" 
                variant="primary"
              />
            </FlexContainer>
          </div>
          
          <div>
            <Typography size="sm" weight="semibold" style={{ marginBottom: '0.5rem' }}>
              Search hero - Destacado
            </Typography>
            <Input 
              placeholder="Buscar películas, series, documentales..." 
              leftIcon="search"
              rightIcon="microphone"
              size="xl" 
              width="xl" 
              variant="neutral"
            />
          </div>
          
          <div>
            <Typography size="sm" weight="semibold" style={{ marginBottom: '0.5rem' }}>
              Formulario compacto - Optimizado para espacio
            </Typography>
            <FlexContainer gap="sm" wrap="wrap">
              <Input placeholder="Código" size="xs" width="xs" />
              <Input placeholder="Teléfono" size="xs" width="sm" />
              <Input placeholder="Email" size="xs" width="md" />
            </FlexContainer>
          </div>
        </FlexContainer>
      </div>

      {/* Ejemplo 4: Semánticos para casos especiales */}
      <div style={{ marginBottom: '2rem' }}>
        <Typography size="lg" weight="semibold" style={{ marginBottom: '1rem' }}>
          4. 🔧 Anchos semánticos para casos especiales
        </Typography>
        <div style={{ border: '2px dashed #dc3545', padding: '1rem' }}>
          <FlexContainer direction="column" gap="sm">
            <div>
              <Typography size="xs" style={{ marginBottom: '0.25rem' }}>width="auto" - Se ajusta al contenido</Typography>
              <Input placeholder="Ajustable" width="auto" size="sm" />
            </div>
            <div>
              <Typography size="xs" style={{ marginBottom: '0.25rem' }}>width="full" - 100% del contenedor</Typography>
              <Input placeholder="Ancho completo" width="full" size="sm" />
            </div>
            <div>
              <Typography size="xs" style={{ marginBottom: '0.25rem' }}>width="fit-content" - Solo lo necesario</Typography>
              <Input placeholder="Mínimo" width="fit-content" size="sm" />
            </div>
          </FlexContainer>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
        <Typography size="sm" variant="secondary">
          ✅ <strong>SISTEMA MEJORADO:</strong> Inspirado en Material-UI y Ant Design. 
          Tamaños fijos predecibles + Alturas consistentes + Responsive automático.
          No más problemas de desbordamiento.
        </Typography>
      </div>
    </Container>
  );
}
