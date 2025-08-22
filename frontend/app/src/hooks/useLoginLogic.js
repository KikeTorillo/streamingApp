// ===== HOOK PARA LÓGICA DE LOGIN =====
// src/hooks/useLoginLogic.js

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Servicios de autenticación
import { loginService } from "../services/Auth/loginService";
import { recoveryService } from "../services/Auth/recoveryService";

// Hook de autenticación
import { useAuth } from "../app/context/AuthContext";

/**
 * Hook personalizado para manejar toda la lógica de autenticación
 * Separa la lógica de negocio de los componentes UI
 * 
 * @returns {Object} Funciones y estados para manejo de login
 */
export const useLoginLogic = () => {
  // Estados de la UI
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Manejo del envío del formulario de login
   * @param {Object} formData - Datos del formulario {username, password}
   */
  const handleLoginSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginService(formData.username, formData.password);
      
      if (response.success && response.user?.sub) {
        // Guardar datos del usuario en sessionStorage
        sessionStorage.setItem('sessionUser', JSON.stringify(response.user));
        
        // Actualizar el AuthContext
        login(response.user);
        
        // Navegar a la página principal
        navigate('/main-page');
        
      } else {
        const errorMessage = response.message || response.error || 'Credenciales incorrectas';
        setError(errorMessage);
      }
      
    } catch (err) {
      console.error('Error en login:', err);
      
      const errorMessage = err.message || 'Error de conexión. Inténtalo de nuevo.';
      setError(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejo de recuperación de contraseña
   * @param {string} username - Usuario para recuperar contraseña
   */
  const handleForgotPassword = async (username) => {
    if (!username || username.trim() === '') {
      setError('Ingresa tu usuario para recuperar la contraseña.');
      return;
    }

    // Validación básica del username
    const userNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!userNameRegex.test(username)) {
      setError('Usuario inválido. Solo letras, números, puntos, guiones y guiones bajos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await recoveryService(username);
      setError('✅ Email de recuperación enviado. Revisa tu bandeja de entrada.');
      
    } catch (err) {
      console.error('Error en recovery:', err);
      setError('❌ Error al enviar email de recuperación.');
      
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verificar si el usuario ya está logueado al cargar el componente
   */
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('sessionUser');
    if (sessionUser) {
      try {
        const user = JSON.parse(sessionUser);
        if (user?.sub) {
          navigate('/main-page');
        }
      } catch {
        sessionStorage.removeItem('sessionUser');
      }
    }
  }, [navigate]);

  /**
   * Limpiar error manualmente
   */
  const clearError = () => {
    setError(null);
  };

  return {
    // Estados
    error,
    isLoading,
    
    // Funciones de acción
    handleLoginSubmit,
    handleForgotPassword,
    clearError
  };
};