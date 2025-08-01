import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { AlertProvider } from "../context/AlertContext";
import PropTypes from 'prop-types';

/**
 * CoreProviders - Contextos esenciales que necesita toda la aplicación
 * 
 * Incluye:
 * - ThemeProvider: Tema claro/oscuro
 * - AuthProvider: Autenticación y usuario actual
 * - AlertProvider: Sistema de notificaciones
 * 
 * Estos providers se cargan en todas las rutas porque son fundamentales
 * para el funcionamiento básico de la aplicación.
 */
export function CoreProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// PropTypes para validación
CoreProviders.propTypes = {
  children: PropTypes.node.isRequired
};