// atoms/Card.jsx - ADAPTER DE RETROCOMPATIBILIDAD
import PropTypes from 'prop-types';
import { UniversalCard } from '../UniversalCard/UniversalCard.jsx';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';

/**
 * Card - ADAPTER DE RETROCOMPATIBILIDAD PARA UniversalCard
 * 
 * ⚠️ DEPRECATED: Usar UniversalCard directamente para nuevos desarrollos
 * ✅ BACKWARD COMPATIBILITY: Mantiene API existente del proyecto
 * 🔄 ADAPTER PATTERN: Convierte props streaming → props universales
 * 📦 LIBRERÍA: UniversalCard estará en la librería universal
 * 
 * MIGRACIÓN RECOMENDADA:
 * - Card actual → UniversalCard (librería universal)
 * - contentType → aspectRatio directo
 * - props streaming → props genéricas
 */
const Card = (props) => {
  // ✅ EXTRAER PROPS ESPECÍFICAS DEL PROYECTO STREAMING
  const {
    // Props streaming específicas que necesitan adaptación
    contentType = 'movie',
    cardVariant = 'elevated',
    
    // Props legacy del proyecto
    padding,
    shadow = 'md',
    
    // Props estándar que pasan directamente
    children,
    size,
    variant = 'neutral',
    disabled,
    loading,
    hoverable,
    clickable,
    onClick,
    className,
    style,
    ...restProps
  } = props;

  // ✅ DEPRECATION WARNINGS PARA DESARROLLO
  if (import.meta.env?.DEV) {
    if (contentType !== 'movie') {
      console.warn(
        `⚠️ Card DEPRECATED: contentType="${contentType}" es específico streaming. ` +
        `Migrar a UniversalCard con aspectRatio directamente.`
      );
    }
    
    if (padding) {
      console.warn(
        `⚠️ Card DEPRECATED: prop "padding" está deprecada. Usar size="${padding}" en su lugar.`
      );
    }
    
    if (cardVariant !== 'elevated') {
      console.warn(
        `⚠️ Card DEPRECATED: cardVariant="${cardVariant}" es específico proyecto. ` +
        `Usar UniversalCard variant="${cardVariant}" directamente.`
      );
    }
  }

  // ✅ MAPPING CONTENTTYPE → ASPECTRATIO UNIVERSAL
  const contentTypeToAspectRatio = {
    'movie': 'portrait',      // 2:3
    'series': 'portrait',     // 2:3  
    'episode': 'wide',        // 16:9
    'profile': 'square',      // 1:1
    'banner': 'ultrawide'     // 21:9
  };

  // ✅ MAPPING CARDVARIANT → VARIANT UNIVERSAL  
  const cardVariantToVariant = {
    'default': 'flat',
    'elevated': 'elevated',
    'outlined': 'outlined', 
    'soft': 'soft'
  };

  // ✅ DETERMINAR PROPS UNIVERSALES
  const universalAspectRatio = contentTypeToAspectRatio[contentType] || 'portrait';
  const universalVariant = cardVariantToVariant[cardVariant] || 'elevated';
  const universalSize = padding || size || 'md'; // padding como fallback legacy

  // ✅ ESTILOS ADICIONALES DEL PROYECTO (shadow custom)
  const projectStyles = {
    '--card-shadow-override': `var(--shadow-${shadow})`,
    ...style
  };

  // ✅ CLASES ADICIONALES DEL PROYECTO
  const projectClassName = [
    'card-adapter',  // Identificar como adapter
    shadow !== 'md' && `card-adapter--shadow-${shadow}`,
    className
  ].filter(Boolean).join(' ');

  // ✅ RENDERIZAR UniversalCard CON PROPS ADAPTADAS
  return (
    <UniversalCard
      // Props universales adaptadas
      size={universalSize}
      variant={universalVariant} 
      aspectRatio={universalAspectRatio}
      
      // Props de interactividad (pasan directo)
      disabled={disabled}
      loading={loading}
      clickable={clickable || hoverable} // hoverable → clickable universal
      onClick={onClick}
      
      // Props de personalización combinadas
      className={projectClassName}
      style={projectStyles}
      
      // Props DOM restantes
      {...restProps}
    >
      {children}
    </UniversalCard>
  );
};

// ✅ PROPTYPES ADAPTER (incluye props streaming para backward compatibility)
Card.propTypes = {
  // Props universales básicas
  children: PropTypes.node,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  
  // Props de interactividad 
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  
  // ⚠️ PROPS ESPECÍFICAS STREAMING (DEPRECADAS - Solo para backward compatibility)
  contentType: PropTypes.oneOf(['movie', 'series', 'episode', 'profile', 'banner']),
  cardVariant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'soft']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  
  // Props legacy deprecadas
  padding: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
};

// ✅ DEFAULT PROPS ADAPTER
Card.defaultProps = {
  // Defaults universales
  size: 'md',
  variant: 'neutral',
  disabled: false,
  loading: false,
  hoverable: false,
  clickable: false,
  
  // Defaults específicos streaming (backward compatibility)
  contentType: 'movie',
  cardVariant: 'elevated',
  shadow: 'md'
};

// ✅ SUB-COMPONENTS ADAPTER - Re-export de UniversalCard sub-components
import { 
  UniversalCardHeader, 
  UniversalCardBody, 
  UniversalCardFooter, 
  UniversalCardTitle, 
  UniversalCardDescription,
  UniversalCardMedia 
} from '../UniversalCard/UniversalCard.jsx';

// Aliases para backward compatibility del proyecto
const CardHeader = UniversalCardHeader;
const CardBody = UniversalCardBody; 
const CardFooter = UniversalCardFooter;
const CardTitle = UniversalCardTitle;
const CardSubtitle = UniversalCardDescription; // Alias
const CardMedia = UniversalCardMedia; // Nuevo

// PropTypes (heredados de UniversalCard)
CardHeader.propTypes = UniversalCardHeader.propTypes;
CardBody.propTypes = UniversalCardBody.propTypes;
CardFooter.propTypes = UniversalCardFooter.propTypes;
CardTitle.propTypes = UniversalCardTitle.propTypes;
CardSubtitle.propTypes = UniversalCardDescription.propTypes;
CardMedia.propTypes = UniversalCardMedia.propTypes;

// ✅ EXPORTS ADAPTER - Mantiene API existente del proyecto
export { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  CardTitle, 
  CardSubtitle,
  CardMedia // Nuevo componente disponible
};

export default Card;
