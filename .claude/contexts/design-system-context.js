#!/usr/bin/env node

/**
 * Design System Context - Sistema de diseño reutilizable
 * 
 * Este contexto documenta completamente el sistema de diseño para facilitar:
 * 1. Consistencia en componentes nuevos
 * 2. Reutilización en proyectos futuros
 * 3. Onboarding de nuevos desarrolladores
 * 4. Guías de implementación automáticas
 */

const fs = require('fs');

function getDesignSystemContext(prompt) {
  // Detectar si el prompt está relacionado con diseño/componentes/estilos
  const designKeywords = [
    'component', 'button', 'input', 'style', 'css', 'design', 'color',
    'spacing', 'typography', 'theme', 'responsive', 'mobile'
  ];
  
  const isDesignRelated = designKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword.toLowerCase())
  );

  return {
    context: 'design-system',
    type: 'reusable-framework',
    isActive: isDesignRelated,
    
    // === SISTEMA DE TOKENS ===
    designTokens: {
      colors: {
        primary: 'Sistema de azules (blue-50 a blue-900)',
        secondary: 'Sistema de grises (gray-50 a gray-900)', 
        semantic: 'danger (red), success (green), warning (yellow)',
        customPalettes: 'ocean, forest, sunset, purple (intercambiables)',
        darkMode: 'Automático con clase .dark',
        
        usage: {
          primary: 'var(--color-primary) para botones principales',
          text: 'var(--text-primary) para texto principal',
          background: 'var(--bg-primary) para fondos',
          borders: 'var(--border-default) para bordes'
        }
      },
      
      spacing: {
        scale: 'xs(4px) → sm(8px) → md(12px) → lg(16px) → xl(24px) → 2xl(32px) → 3xl(48px) → 4xl(64px)',
        components: 'Padding estándar por tamaño de componente',
        forms: 'Gap entre campos (--form-field-gap: 16px)',
        sections: 'Gap entre secciones (--form-section-gap: 24px)'
      },
      
      typography: {
        family: 'Inter para UI, Fira Code para código',
        sizes: 'xs(12px) → sm(14px) → base(16px) → md(18px) → lg(20px) → xl(24px) → 2xl(30px) → 3xl(36px) → 4xl(48px)',
        weights: 'normal(400), medium(500), semibold(600), bold(700)',
        lineHeights: 'tight(1.25), normal(1.5), relaxed(1.75)'
      },
      
      components: {
        heights: {
          xs: '28px', sm: '32px', md: '40px', 
          lg: '56px (TAMAÑO ESTÁNDAR)', xl: '56px'
        },
        radii: 'sm(4px), md(8px), lg(12px), xl(16px), full(circle)',
        shadows: 'sm, md, lg, xl con opacidad automática por tema',
        transitions: 'fast(0.15s), normal(0.2s), slow(0.3s)'
      }
    },
    
    // === REGLAS DE IMPLEMENTACIÓN ===
    implementationRules: {
      variables: {
        rule: 'SIEMPRE usar variables CSS del sistema',
        good: 'color: var(--text-primary)',
        bad: 'color: #374151',
        why: 'Garantiza consistencia y modo oscuro automático'
      },
      
      componentHeight: {
        rule: 'Todos los inputs/botones deben usar --component-height-lg (56px)',
        good: 'height: var(--component-height-lg)',
        bad: 'height: 40px',
        utility: 'Usar .force-input-height-lg para casos de emergencia'
      },
      
      responsive: {
        rule: 'Mobile-first con min-width media queries',
        good: '@media (min-width: 768px) { ... }',
        bad: '@media (max-width: 767px) { ... }',
        touchTargets: 'Mínimo 44px (--touch-target-min) en móvil'
      },
      
      accessibility: {
        contrast: 'Alto contraste automático con @media (prefers-contrast: high)',
        motion: 'Reducir animaciones con @media (prefers-reduced-motion: reduce)',
        focus: 'Focus visible en todos los elementos interactivos'
      }
    },
    
    // === PATRONES DE COMPONENTES ===
    componentPatterns: {
      atomicDesign: {
        atoms: 'Button, Input, Card, Badge, Avatar, etc.',
        molecules: 'FilterBar, ContentCard, TextInput (con label)',
        organisms: 'DataTable, AdminSidebar, forms complejos',
        rule: 'Cada nivel debe usar elementos del nivel anterior'
      },
      
      cssConventions: {
        naming: 'BEM: .component__element--modifier',
        structure: 'ComponentName/ComponentName.jsx + .css + .stories.jsx',
        exports: 'function ComponentName() {} + export { ComponentName }',
        variables: 'Prefijo con nombre del componente'
      },
      
      commonProps: {
        sizes: "xs, sm, md, lg, xl (lg=56px es estándar)",
        variants: "primary, secondary, danger, success, warning",
        states: "disabled, loading, error, etc.", 
        styling: "className, rounded, fullWidth"
      }
    },
    
    // === HERRAMIENTAS DE DESARROLLO ===
    developmentTools: {
      debugging: {
        heightGrid: 'Usar .height-grid para verificar alturas de 56px',
        outlines: 'Usar .debug-heights en body para mostrar bordes',
        utilities: 'Clases .component-height-* para forzar alturas'
      },
      
      themeSystem: {
        default: 'Tema azul por defecto',
        alternatives: '.palette-ocean, .palette-forest, .palette-sunset, .palette-purple',
        darkMode: 'Agregar .dark al body/html',
        customization: 'Sobrescribir variables CSS en :root'
      },
      
      validation: {
        storybook: 'Todos los átomos necesitan 6 stories',
        linting: 'ESLint debe pasar antes de commits',
        consistency: 'Revisar componentes similares antes de crear nuevos'
      }
    },
    
    // === GUÍAS DE MIGRACIÓN ===
    migrationGuides: {
      newProject: {
        step1: 'Copiar App.css completo al nuevo proyecto',
        step2: 'Configurar estructura: atoms/ molecules/ organisms/ templates/',
        step3: 'Crear componentes base: Button, Input, Card, etc.',
        step4: 'Configurar Storybook con sistema de variables',
        step5: 'Implementar tema personalizado si es necesario'
      },
      
      existingProject: {
        audit: 'Identificar hardcoded values (colores, espaciado, etc.)',
        replace: 'Reemplazar valores fijos con variables CSS',
        components: 'Migrar componentes uno por uno usando patrones',
        testing: 'Verificar modo oscuro y responsive en cada componente'
      }
    },
    
    // === EXTENSIONES RECOMENDADAS ===
    futureEnhancements: {
      animations: 'Sistema de animaciones (enter/exit, micro-interactions)',
      icons: 'Sistema de iconos unificado (react-icons o custom)',
      layouts: 'Grid system y contenedores responsivos',
      forms: 'Validation system integrado con el design system',
      dataDisplay: 'Patrones para tablas, listas, cards complejos'
    },
    
    // === CASOS DE USO ESPECÍFICOS ===
    useCases: {
      streaming: 'VideoPlayer, contenido multimedia, grids de contenido',
      admin: 'DataTables, forms CRUD, dashboards, sidebar navigation',
      ecommerce: 'Product cards, checkout flows, user profiles',
      blog: 'Article layouts, comment systems, author profiles',
      saas: 'Settings panels, billing, usage metrics, team management'
    }
  };
}

module.exports = { getDesignSystemContext };