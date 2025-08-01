// ===== AUTH CONTEXT - GESTIÓN CENTRALIZADA DE AUTENTICACIÓN =====
// src/app/context/AuthContext.jsx

/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// ===== CONTEXTO =====
const AuthContext = createContext();

/**
 * AuthProvider - Proveedor del contexto de autenticación
 * 
 * Centraliza toda la lógica de autenticación:
 * - Estado del usuario autenticado actual
 * - Funciones de login/logout
 * - Verificación de permisos
 * - Manejo de sesión expirada
 */
function AuthProvider({ children }) {
  // ✅ Reducido log para evitar spam en consola
  
  // ===== ESTADOS PRINCIPALES =====
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ===== FUNCIONES AUXILIARES =====

  /**
   * Obtener usuario de sessionStorage
   */
  const getSessionUser = useCallback(() => {
    try {
      const sessionUser = sessionStorage.getItem('sessionUser');
      if (!sessionUser) return null;
      
      const parsedUser = JSON.parse(sessionUser);
      
      // Validar que tenga datos mínimos requeridos
      if (!parsedUser.sub && !parsedUser.id) return null;
      
      // Normalizar estructura de usuario
      return {
        id: parsedUser.sub || parsedUser.id,
        username: parsedUser.username || parsedUser.userName || parsedUser.user_name,
        email: parsedUser.email,
        role: parsedUser.role,
        roleId: parsedUser.roleId || parsedUser.role_id,
        // Campos adicionales si existen
        exp: parsedUser.exp, // Token expiration
        iat: parsedUser.iat, // Token issued at
        // Datos originales para compatibilidad
        ...parsedUser
      };
    } catch {
      return null;
    }
  }, []);

  /**
   * Verificar si el token ha expirado
   */
  const isTokenExpired = useCallback((userData) => {
    if (!userData || !userData.exp) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return userData.exp < currentTime;
  }, []);

  /**
   * Verificar si el usuario es administrador
   */
  const isAdmin = useCallback((userData = user) => {
    if (!userData) return false;
    return userData.roleId === 1 || userData.role === 'admin';
  }, [user]);

  /**
   * Verificar si el usuario es editor o admin
   */
  const isEditor = useCallback((userData = user) => {
    if (!userData) return false;
    return userData.roleId === 2 || userData.roleId === 1 || userData.role === 'editor' || userData.role === 'admin';
  }, [user]);

  /**
   * Obtener nombre del rol
   */
  const getRoleName = useCallback((userData = user) => {
    if (!userData) return 'No autenticado';
    
    const roleMap = {
      1: 'Administrador',
      2: 'Editor',
      3: 'Usuario Regular',
      'admin': 'Administrador',
      'editor': 'Editor',
      'user': 'Usuario Regular'
    };
    
    return roleMap[userData.roleId] || roleMap[userData.role] || 'Usuario';
  }, [user]);

  // ===== FUNCIONES PRINCIPALES =====

  /**
   * Cargar usuario desde sessionStorage
   */
  const loadUser = useCallback(() => {
    try {
      setLoading(true);
      
      // Función inline para obtener usuario
      const getUser = () => {
        try {
          const sessionUser = sessionStorage.getItem('sessionUser');
          if (!sessionUser) return null;
          
          const parsedUser = JSON.parse(sessionUser);
          if (!parsedUser.sub && !parsedUser.id) return null;
          
          return {
            id: parsedUser.sub || parsedUser.id,
            username: parsedUser.username || parsedUser.userName || parsedUser.user_name,
            email: parsedUser.email,
            role: parsedUser.role,
            roleId: parsedUser.roleId || parsedUser.role_id,
            exp: parsedUser.exp,
            iat: parsedUser.iat,
            ...parsedUser
          };
        } catch {
              return null;
        }
      };
      
      const sessionUser = getUser();

      if (!sessionUser) {

        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Verificar si el token ha expirado
      if (sessionUser.exp && sessionUser.exp < Math.floor(Date.now() / 1000)) {

        sessionStorage.removeItem('sessionUser');
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      setUser(sessionUser);
      setIsAuthenticated(true);
    } catch {

      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []); // Sin dependencias para evitar bucles

  /**
   * Login - guardar usuario en sessionStorage y estado
   */
  const login = useCallback((userData) => {
    try {

      // Guardar en sessionStorage
      sessionStorage.setItem('sessionUser', JSON.stringify(userData));
      
      // Normalizar y guardar en estado
      const normalizedUser = getSessionUser();
      setUser(normalizedUser);
      setIsAuthenticated(true);

      return true;
    } catch {

      return false;
    }
  }, [getSessionUser]);

  /**
   * Logout - limpiar sesión
   */
  const logout = useCallback(() => {
    try {

      // Limpiar sessionStorage
      sessionStorage.removeItem('sessionUser');
      
      // Limpiar estado
      setUser(null);
      setIsAuthenticated(false);

      return true;
    } catch {

      return false;
    }
  }, []);

  /**
   * Refrescar usuario (útil tras cambios de perfil)
   */
  const refreshUser = useCallback(() => {

    loadUser();
  }, [loadUser]);

  /**
   * Verificar permisos específicos
   */
  const hasPermission = useCallback((permission) => {
    if (!isAuthenticated || !user) return false;
    
    switch (permission) {
      case 'admin':
        return isAdmin();
      case 'editor':
        return isEditor();
      case 'create_content':
        return isEditor(); // Editores y admins pueden crear contenido
      case 'manage_users':
        return isAdmin(); // Solo admins pueden gestionar usuarios
      default:
        return isAuthenticated; // Usuario autenticado básico
    }
  }, [isAuthenticated, user, isAdmin, isEditor]);

  // ===== EFECTOS =====

  /**
   * Cargar usuario al montar el componente
   */
  useEffect(() => {

    loadUser();
  }, [loadUser]); // Incluir loadUser en dependencias

  /**
   * Escuchar cambios en sessionStorage (para logout desde otras pestañas)
   */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sessionUser') {
        if (!e.newValue) {
          // SessionUser fue eliminado en otra pestaña

          setUser(null);
          setIsAuthenticated(false);
        } else {
          // SessionUser fue actualizado en otra pestaña

          loadUser();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadUser]);

  // ===== VALOR DEL CONTEXTO =====
  const value = {
    // Estados
    user,
    loading,
    isAuthenticated,

    // Información del usuario
    userId: user?.id || null,
    username: user?.username || null,
    email: user?.email || null,
    role: user?.role || null,
    roleId: user?.roleId || null,
    roleName: getRoleName(),

    // Funciones principales
    login,
    logout,
    refreshUser,
    loadUser,

    // Verificaciones de permisos
    isAdmin: isAdmin(),
    isEditor: isEditor(),
    hasPermission,

    // Utilidades
    getRoleName,
    isTokenExpired: user ? isTokenExpired(user) : false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de autenticación
 */
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

// PropTypes para validación
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { AuthContext, AuthProvider, useAuth };