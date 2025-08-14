// PageLayout.jsx
import PropTypes from 'prop-types';
import { extractDOMProps } from '../../../tokens/standardProps';
import './PageLayout.css';

/**
 * Componente PageLayout - Template
 * 
 * Layout principal para páginas de la aplicación.
 * Estructura: Header + Filters + Content
 */
function PageLayout({
  // Secciones del layout
  header = null,
  filters = null,
  children,
  
  // Configuración del contenido
  containerMaxWidth = '144rem', // 1440px
  contentPadding = 'var(--space-xl)',
  
  // Estilos
  variant = 'default',
  
  // Props adicionales
  className = '',
  ...restProps
}) {
  
  // Clases CSS dinámicas
  const layoutClasses = [
    'page-layout',
    `page-layout--variant-${variant}`,
    className
  ].filter(Boolean).join(' ');

  // Extraer solo props válidas para DOM
  const validDOMProps = extractDOMProps(restProps);

  return (
    <div {...validDOMProps} className={layoutClasses}>
      {/* Header */}
      {header && (
        <div className="page-layout__header">
          {header}
        </div>
      )}

      {/* Filters */}
      {filters && (
        <div className="page-layout__filters">
          {filters}
        </div>
      )}

      {/* Main Content */}
      <main 
        className="page-layout__content"
        style={{
          maxWidth: containerMaxWidth,
          padding: contentPadding
        }}
      >
        {children}
      </main>
    </div>
  );
}

PageLayout.propTypes = {
  // Secciones del layout
  header: PropTypes.node,
  filters: PropTypes.node,
  children: PropTypes.node,
  
  // Configuración del contenido  
  containerMaxWidth: PropTypes.string,
  contentPadding: PropTypes.string,
  
  // Estilos
  variant: PropTypes.string,
  
  // Props adicionales
  className: PropTypes.string
};

export { PageLayout };