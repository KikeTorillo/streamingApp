// hocs/index.js - Barrel export para Higher-Order Components

export {
  // HOC principal
  withStandardProps,
  
  // HOCs especializados por tipo de componente
  withButtonProps,
  withBadgeProps,
  withInputProps,
  withCardProps,
  withModalProps,
  
  // Utilidades
  createStandardHOC,
  getOriginalComponent,
  isStandardPropsComponent
} from './withStandardProps.jsx';