// ContentSection.jsx
import PropTypes from 'prop-types';
import { Card } from '../../atoms/Card/Card';
import { Icon } from '../../atoms/Icon/Icon';
import { Typography } from '../../atoms/Typography/Typography';
import { Container } from '../../atoms/Container/Container';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { GridContainer } from '../../atoms/GridContainer/GridContainer';
import { EmptyState } from '../EmptyState/EmptyState';
import { useStandardProps } from '../../../hooks/useStandardProps';
import { STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens/standardProps';
import './ContentSection.css';

/**
 * Componente ContentSection - Molecule
 * 
 * Contenedor para secciones de contenido con título, ícono y área de contenido.
 * Maneja automáticamente estados de carga, vacío y error.
 * Usa componentes del sistema de diseño migrado al sistema estándar.
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.title - Título de la sección
 * @param {string|React.ReactNode} props.icon - Icono de la sección (nombre del sistema de iconos o componente)
 * @param {React.ReactNode} props.children - Contenido de la sección
 * @param {boolean} props.error - Mensaje de error si falla la carga
 * @param {boolean} props.empty - Si la sección no tiene contenido
 * @param {string} props.emptyIcon - Icono para estado vacío
 * @param {string} props.emptyTitle - Título para estado vacío
 * @param {string} props.emptyDescription - Descripción para estado vacío
 * @param {React.ReactNode} props.emptyAction - Acción para estado vacío
 * @param {boolean} props.showDivider - Si mostrar línea divisoria
 * @param {string} props.gridColumns - CSS grid-template-columns
 * @param {string} props.gridGap - CSS gap del grid
 */
function ContentSection(props) {
  // Extraer props específicas del componente
  const {
    // Contenido de la sección
    title = 'Sección de contenido',
    icon = 'grid',
    children,

    // Estados específicos (error se maneja por el sistema estándar)
    error = null,
    empty = false,

    // Configuración del estado vacío
    emptyIcon = 'folder',
    emptyTitle = 'No hay contenido',
    emptyDescription = 'No se encontraron elementos en esta sección.',
    emptyAction = null,

    // Configuración específica
    showDivider = true,

    // Configuración del grid
    gridColumns = 'repeat(auto-fit, minmax(200px, 1fr))',
    gridGap = 'var(--space-md)',

    // Props adicionales
    id,
    ...restProps
  } = props;

  // Hook estándar - ContentSection es tipo container/section
  const {
    size,
    variant,
    rounded,
    disabled,
    loading,
    className,
    tokens,
    // renderIcon, // del hook pero no implementada actualmente
    ...standardProps
  } = useStandardProps(restProps, {
    componentType: 'section',
    defaultSize: 'md',
    defaultVariant: 'neutral',
    defaultRounded: 'lg'
  });

  // Props seguros para DOM
  const domProps = extractDOMProps({
    ...standardProps,
    id,
    disabled,
    className
  });

  // Manejo de backward compatibility para variants legacy
  const normalizedVariant = (() => {
    switch (variant) {
      case 'default':
        if (import.meta.env?.DEV) {

          console.warn('⚠️ ContentSection: variant="default" está deprecada. Usar variant="neutral"');
        }
        return 'neutral';
      case 'featured':
        return 'primary';
      case 'compact':
        return 'secondary';
      default:
        return variant;
    }
  })();

  // Clases CSS dinámicas usando sistema estándar
  const sectionClasses = [
    'content-section',
    `content-section--size-${size}`,
    `content-section--variant-${normalizedVariant}`,
    loading && 'content-section--loading',
    error && 'content-section--error',
    disabled && 'content-section--disabled',
    className
  ].filter(Boolean).join(' ');

  // Determinar si mostrar estado vacío
  const shouldShowEmpty = empty || (!loading && !error && !children);

  return (
    <section
      {...domProps}
      className={sectionClasses}
      style={{
        borderRadius: tokens.rounded,
        ...domProps.style
      }}
    >
      {/* Header de la sección */}
      <FlexContainer align="center" gap="md">
        {typeof icon === 'string' ? (
          <Icon name={icon} size="md" />
        ) : (
          icon
        )}
        <Typography variant="h2" size="lg" weight="semibold">
          {title}
        </Typography>
      </FlexContainer>

      {/* Contenido de la sección */}
      {/* Estado de error */}
      {error && (
        <Container padding="md">
          <Card variant="danger" size={size} rounded={rounded}>
            <FlexContainer align="start" gap="md">
              <Icon name="alert" size="md" variant="danger" />
              <Container padding="none">
                <Typography variant="strong" size="md" weight="semibold" color="danger">
                  Error al cargar contenido
                </Typography>
                <Typography variant="body" size="md" color="muted">
                  {error}
                </Typography>
              </Container>
            </FlexContainer>
          </Card>
        </Container>
      )}

      {/* Estado de carga */}
      {loading && (
        <GridContainer columns={gridColumns} gap={gridGap}>
          {/* Skeletons de carga */}
          {Array.from({ length: 6 }, (_, i) => (
            <Container key={i} padding="none">
              <Card variant="neutral" size={size} rounded={rounded}>
                <FlexContainer direction="column" gap="sm" padding="md">
                  <div className="skeleton-image" />
                  <div className="skeleton-text skeleton-text--title" />
                  <div className="skeleton-text skeleton-text--subtitle" />
                </FlexContainer>
              </Card>
            </Container>
          ))}
        </GridContainer>
      )}

      {/* Estado vacío */}
      {shouldShowEmpty && !loading && !error && (
        <Container padding="lg">
          <EmptyState
            leftIcon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
            size={size}
            variant={variant}
            disabled={disabled}
          />
        </Container>
      )}

      {/* Contenido normal */}
      {!loading && !error && !shouldShowEmpty && (
        <GridContainer columns={gridColumns} gap={gridGap}>
          {children}
        </GridContainer>
      )}
    </section>
  );
}

ContentSection.propTypes = {
  // Props estándar del sistema de diseño
  ...STANDARD_PROP_TYPES,

  // Props específicas del componente
  title: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  error: PropTypes.string,
  empty: PropTypes.bool,
  emptyIcon: PropTypes.string,
  emptyTitle: PropTypes.string,
  emptyDescription: PropTypes.string,
  emptyAction: PropTypes.node,
  showDivider: PropTypes.bool,
  gridColumns: PropTypes.string,
  gridGap: PropTypes.string,
  id: PropTypes.string
};

export { ContentSection };