// PageLayout.jsx - REFACTORIZADO CON SISTEMA DE DISEÑO
import PropTypes from 'prop-types';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Container } from '../../atoms/Container/Container';
import './PageLayout.css';

/**
 * PageLayout - TEMPLATE SIMPLIFICADO CON CONTENEDORES PUROS
 * 
 * ✅ COMPOSICIÓN PURA: 100% FlexContainer + Container del sistema
 * ✅ ZERO CSS: Sin estilos custom, solo contenedores
 * ✅ RESPONSIVE: Automático desde tokens del sistema
 * ✅ SIMPLE: Solo props de estructura y tamaño
 * 
 * Layout base para organizar páginas: Header + Filters + Content
 * Sin variants - La variación visual viene de los contenidos, no del layout
 */
function PageLayout({
  // Secciones del layout
  header = null,
  filters = null,
  children,

  // Configuración del contenido
  contentSize = 'xl',           // xs, sm, md, lg, xl, full
  contentPadding = 'xl',        // xs, sm, md, lg, xl, 2xl

  // Props adicionales
  className = '',
  ...restProps
}) {

  return (
    <FlexContainer
      {...restProps}
      direction="column"
      gap="none"
      variant="neutral"
    >
      {/* Header Section */}
      {header && (
        <Container
          size="full"
          padding="none"
        >
          {header}
        </Container>
      )}

      {/* Filters Section */}
      {filters && (
        <>{filters}</>
      )}

      {/* Main Content */}
      <Container
        as="main"
        size="full"
        padding={contentPadding}
      >
        {children}
      </Container>
    </FlexContainer>
  );
}

PageLayout.propTypes = {
  // Secciones del layout
  header: PropTypes.node,
  filters: PropTypes.node,
  children: PropTypes.node,

  // Configuración del contenido
  contentSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  contentPadding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']),

  // Props adicionales
  className: PropTypes.string
};

export { PageLayout };