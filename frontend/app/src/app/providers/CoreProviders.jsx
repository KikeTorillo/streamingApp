import { AuthProvider } from "../context/AuthContext";
import { AlertProvider } from "../context/AlertContext";
import { IconProvider } from "../../../design-system";
import PropTypes from 'prop-types';

/**
 * CoreProviders - Contextos esenciales que necesita toda la aplicación
 * 
 * Incluye:
 * - IconProvider: Sistema de iconos del design-system
 * - AuthProvider: Autenticación y usuario actual
 * - AlertProvider: Sistema de notificaciones
 * 
 * Estos providers se cargan en todas las rutas porque son fundamentales
 * para el funcionamiento básico de la aplicación.
 */
export function CoreProviders({ children }) {
  return (
    <IconProvider>
      <AuthProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </AuthProvider>
    </IconProvider>
  );
}

// PropTypes para validación
CoreProviders.propTypes = {
  children: PropTypes.node.isRequired
};