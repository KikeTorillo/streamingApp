// ===== @kike-dev/contextual-ui - SISTEMA DE DISEÑO REUTILIZABLE =====
// Export principal para la futura librería

// ===== ÁTOMOS =====
export { Avatar } from './atoms/Avatar/Avatar';
export { Badge } from './atoms/Badge/Badge';
export { Button } from './atoms/Button/Button';
export { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  CardMedia, 
  CardTitle, 
  CardSubtitle, 
  CardDescription 
} from './atoms/Card/Card';
export { Checkbox } from './atoms/Checkbox/Checkbox';
export { Container } from './atoms/Container/Container';
export { Divider } from './atoms/Divider/Divider';
export { FileInput } from './atoms/FileInput/FileInput';
export { FlexContainer } from './atoms/FlexContainer/FlexContainer';
export { GridContainer } from './atoms/GridContainer/GridContainer';
export { Icon } from './atoms/Icon/Icon';
export { Image } from './atoms/Image/Image';
export { Input } from './atoms/Input/Input';
export { Label } from './atoms/Label/Label';
export { Link } from './atoms/Link/Link';
export { ProgressBar } from './atoms/ProgressBar/ProgressBar';
export { Radio } from './atoms/Radio/Radio';
export { Select } from './atoms/Select/Select';
export { Skeleton } from './atoms/Skeleton/Skeleton';
export { Spinner } from './atoms/Spinner/Spinner';
export { TextArea } from './atoms/TextArea/TextArea';
export { Toast } from './atoms/Toast/Toast';
export { Typography } from './atoms/Typography/Typography';

// ===== MOLÉCULAS =====
export { Accordion } from './molecules/Accordion/Accordion';
export { ActionsDropdown } from './molecules/ActionsDropdown/ActionsDropdown';
export { AlertModal } from './molecules/AlertModal/AlertModal';
export { Breadcrumb } from './molecules/Breadcrumb/Breadcrumb';
export { DynamicForm } from './molecules/DynamicForm/DynamicForm';
export { EmptyState } from './molecules/EmptyState/EmptyState';
export { Modal } from './molecules/Modal/Modal';
export { Pagination } from './molecules/Pagination/Pagination';
export { Tabs } from './molecules/Tabs/Tabs';
export { TextInput } from './molecules/TextInput/TextInput';
export { TextSelect } from './molecules/TextSelect/TextSelect';
export { ToastContainer } from './molecules/ToastContainer/ToastContainer';

// ===== ORGANISMOS =====
export { DataTable } from './organisms/DataTable/DataTable';

// ===== HOOKS =====
export { 
  useStandardPropsV2,
  useInteractiveProps,
  useTypographyProps,
  useContainerProps,
  useBreakpoint,
  useResponsiveValue
} from './hooks/useStandardProps';

// ===== TOKENS =====
// ✅ FUENTE ÚNICA: Todo desde propHelpers.js
export {
  // PropTypes principales
  STANDARD_PROP_TYPES,
  ICON_PROP_TYPES,
  SPACING_PROP_TYPES,
  TYPOGRAPHY_PROP_TYPES,
  INTERACTIVE_PROP_TYPES,
  CONTENT_PROP_TYPES,
  TEXT_PROP_TYPES,
  LAYOUT_COMPONENT_PROP_TYPES as CONTAINER_PROP_TYPES,
  
  // Funciones utilitarias
  extractDOMPropsV2,
  validateStandardProps,
  
  // Aliases para compatibilidad
  LAYOUT_COMPONENT_PROP_TYPES as LAYOUT_PROP_TYPES,
  INTERACTIVE_PROP_TYPES as COMPONENT_PROP_TYPES
} from './tokens/propHelpers.js';

// ===== PROVIDERS =====
export { IconProvider } from './providers/IconProvider'; // Si existe