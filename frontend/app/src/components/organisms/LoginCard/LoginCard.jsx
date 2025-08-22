// components/organisms/LoginCard/LoginCard.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, CardFooter, CardTitle } from '../../atoms/Card/Card';
import { TextInput } from '../../molecules/TextInput/TextInput';
import { Button } from '../../atoms/Button/Button';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Typography } from '../../atoms/Typography/Typography';

/**
 * Componente de inicio de sesión usando el sistema de diseño
 * @param {Object} props - Propiedades del componente
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {string} [props.error] - Mensaje de error global
 * @param {function} props.onSubmit - Función ejecutada al enviar (data) => {}
 * @param {function} [props.onForgotPassword] - Función para recuperar contraseña
 * @param {boolean} [props.showRegisterLink=false] - Mostrar enlace de registro
 * @param {function} [props.onRegisterClick] - Función para ir a registro
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='lg'] - Tamaño de los campos
 * @param {'sm'|'md'|'lg'|'xl'} [props.rounded='lg'] - Border radius
 * @param {string} [props.title] - Título personalizado del card
 * @param {string} [props.subtitle] - Subtítulo personalizado del card
 * @param {boolean} [props.showHeader=true] - Mostrar/ocultar header del card
 */
const LoginCard = ({
  loading = false,
  error,
  onSubmit,
  onForgotPassword,
  showRegisterLink = false,
  onRegisterClick,
  size = 'lg',
  rounded = 'lg',
  
  // Nuevas props de configuración
  title = 'Iniciar Sesión',
  subtitle = null,
  showHeader = true,
  
  ...cardProps
}) => {
  // Estado local del formulario
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validaciones
  const validateUsername = (value) => {
    if (!value) return 'Usuario es requerido';
    if (value.length < 3) return 'Mínimo 3 caracteres';
    if (!/^[a-zA-Z0-9._-]+$/.test(value)) return 'Solo letras, números, puntos, guiones y guiones bajos';
    return null;
  };

  const validatePassword = (value) => {
    if (!value) return 'Contraseña es requerida';
    if (value.length < 6) return 'Mínimo 6 caracteres';
    return null;
  };

  // Handlers
  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error si existe
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFieldBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const value = formData[field];
    let error = null;
    
    if (field === 'username') {
      error = validateUsername(value);
    } else if (field === 'password') {
      error = validatePassword(value);
    }
    
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const usernameError = validateUsername(formData.username);
    const passwordError = validatePassword(formData.password);
    
    const errors = {
      username: usernameError,
      password: passwordError
    };
    
    setFormErrors(errors);
    setTouched({ username: true, password: true });
    
    // Si no hay errores, enviar
    if (!usernameError && !passwordError) {
      onSubmit(formData);
    }
  };

  const handleForgotPassword = () => {
    const usernameError = validateUsername(formData.username);
    
    if (usernameError) {
      setFormErrors(prev => ({ ...prev, username: usernameError }));
      setTouched(prev => ({ ...prev, username: true }));
      return;
    }
    
    onForgotPassword?.(formData.username);
  };

  return (
    <Card
      size="xl"
      shadow="lg"
      rounded={rounded}
      {...cardProps}
    >
      {showHeader && (
        <CardHeader>
          <CardTitle as="h1">{title}</CardTitle>
          {subtitle && (
            <Typography
              variant="body"
              size="md"
              color="muted"
              align="center"
            >
              {subtitle}
            </Typography>
          )}
        </CardHeader>
      )}

      <CardBody>
        <FlexContainer
          as="form"
          onSubmit={handleSubmit}
          direction="column"
          gap="lg"
          width="full"
        >
          <TextInput
            label="Usuario"
            name="username"
            type="text"
            placeholder="Ingresa tu usuario"
            value={formData.username}
            onChange={handleFieldChange('username')}
            onBlur={handleFieldBlur('username')}
            errorText={touched.username ? formErrors.username : ''}
            helperText={!touched.username || !formErrors.username ? 'Nombre de usuario o email' : ''}
            leftIcon="user"
            size={size}
            rounded={rounded}
            width="full"
            required
            disabled={loading}
            variant={touched.username && formErrors.username ? 'danger' : 'primary'}
            autoComplete="username"
          />

          <TextInput
            label="Contraseña"
            name="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={handleFieldChange('password')}
            onBlur={handleFieldBlur('password')}
            errorText={touched.password ? formErrors.password : ''}
            autoComplete="current-password"
            helperText={!touched.password || !formErrors.password ? 'Tu contraseña secreta' : ''}
            leftIcon="lock"
            size={size}
            rounded={rounded}
            width="full"
            required
            disabled={loading}
            variant={touched.password && formErrors.password ? 'danger' : 'primary'}
          />

          {/* Mensaje de error global */}
          {error && (
            <FlexContainer
              direction="row"
              align="center"
              gap="sm"
              padding="md"
              role="alert"
            >
              <Typography
                variant="danger"
                size="sm"
                weight="medium"
              >
                {error}
              </Typography>
            </FlexContainer>
          )}

          {/* Botón de envío */}
          <Button
            type="submit"
            variant="primary"
            size={size}
            rounded={rounded}
            loading={loading}
            disabled={loading}
            width="full"
            leftIcon="lock"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </FlexContainer>
      </CardBody>

      <CardFooter>
        <FlexContainer
          direction="column"
          gap="md"
          align="center"
        >
          {/* Enlace de contraseña olvidada */}
          {onForgotPassword && (
            <Button
              variant="neutral"
              size="sm"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          )}

          {/* Enlace de registro */}
          {showRegisterLink && onRegisterClick && (
            <FlexContainer
              direction="row"
              gap="sm"
              align="center"
            >
              <Typography
                size="sm"
                color="muted"
              >
                ¿No tienes cuenta?
              </Typography>
              <Button
                variant="neutral"
                size="sm"
                onClick={onRegisterClick}
                disabled={loading}
              >
                Crear cuenta
              </Button>
            </FlexContainer>
          )}
        </FlexContainer>
      </CardFooter>
    </Card>
  );
};

LoginCard.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  onSubmit: PropTypes.func,
  onForgotPassword: PropTypes.func,
  showRegisterLink: PropTypes.bool,
  onRegisterClick: PropTypes.func,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  rounded: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  
  // Nuevas props
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showHeader: PropTypes.bool
};

export { LoginCard };