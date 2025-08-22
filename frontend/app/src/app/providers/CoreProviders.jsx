import { AuthProvider } from "../context/AuthContext";
import { AlertProvider } from "../context/AlertContext";
import { ContextualUIProvider } from "../../providers/ContextualUIProvider";
import PropTypes from 'prop-types';

/**
 * CoreProviders - Contextos esenciales que necesita toda la aplicación
 * 
 * Incluye:
 * - ContextualUIProvider: Sistema de diseño (IconProvider + ThemeProvider V2)
 * - AuthProvider: Autenticación y usuario actual
 * - AlertProvider: Sistema de notificaciones
 * 
 * Estos providers se cargan en todas las rutas porque son fundamentales
 * para el funcionamiento básico de la aplicación.
 */
export function CoreProviders({ children }) {
  return (
    <ContextualUIProvider preset="streaming">
      <AuthProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </AuthProvider>
    </ContextualUIProvider>
  );
}

// PropTypes para validación
CoreProviders.propTypes = {
  children: PropTypes.node.isRequired
};