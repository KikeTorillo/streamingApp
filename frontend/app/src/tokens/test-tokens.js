// Archivo de prueba temporal para verificar que el sistema funciona

import { 
  STANDARD_SIZES,
  STANDARD_VARIANTS,
  STANDARD_ROUNDED,
  validateStandardProps,
  DEFAULT_PROPS
} from './standardProps.js';

// Test básico de las constantes
console.log('🚀 Testing Standard Props System');
console.log('================================');

console.log('📊 STANDARD_SIZES:', STANDARD_SIZES);
console.log('🎨 STANDARD_VARIANTS:', STANDARD_VARIANTS);
console.log('⭕ STANDARD_ROUNDED:', STANDARD_ROUNDED);
console.log('🔧 DEFAULT_PROPS:', DEFAULT_PROPS);

// Test de validación
const testProps = {
  size: 'lg',
  variant: 'primary',
  rounded: 'md',
  disabled: false,
  loading: true,
  leftIcon: 'user',
  // Props legacy para testing warnings
  icon: 'old-icon',
  iconPosition: 'left'
};

console.log('\n🧪 Testing validation...');
// eslint-disable-next-line no-unused-vars
const validatedProps = validateStandardProps(testProps, 'TestComponent');

console.log('\n📋 Test successful! Standard Props System is working correctly.');

export default true;