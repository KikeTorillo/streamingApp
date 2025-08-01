// ===== USER CONTEXT - GESTI�N CENTRALIZADA DE USUARIOS =====
// src/app/context/UserContext.jsx

import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Servicios de usuarios
import { getUsersService } from '../../services/Users/getUsersService';
import { deleteUserService } from '../../services/Users/deleteUserService';
import { createUserService } from '../../services/Users/createUserService';
import { getUserByIdService } from '../../services/Users/getUserByIdService';
import { updateUserService } from '../../services/Users/updateUserService';

// Utilidades de formularios
import { validatePasswordsMatch, prepareUserData } from '../../utils/formUtils';

// Hook para alerts
import { useAlertContext } from './AlertContext';

// ===== CONTEXTO =====
const UserContext = createContext();

/**
 * UsersProvider - Proveedor del contexto de usuarios
 * 
 * Centraliza toda la l�gica de gesti�n de usuarios:
 * - Estados de usuarios, loading, errores
 * - Funciones CRUD principales
 * - Utilidades de validaci�n y formato
 * - Manejo de sesi�n expirada
 */
function UsersProvider({ children }) {
  // ===== HOOKS =====
  const { showDeleteConfirm, showSuccess, showError } = useAlertContext();
  
  // ===== ESTADOS PRINCIPALES =====
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ===== FUNCIONES AUXILIARES =====

  /**
   * Formatear fechas en formato espa�ol
   */
  const formatUserDate = (dateString) => {
    if (!dateString) return 'No disponible';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inv�lida';
    }
  };

  /**
   * Verificar si es el usuario actual
   */
  const isCurrentUser = (userId) => {
    try {
      const sessionUser = JSON.parse(sessionStorage.getItem('sessionUser') || '{}');
      return sessionUser.sub === userId;
    } catch {
      return false;
    }
  };

  /**
   * Obtener nombre del rol por ID
   */
  const getRoleName = (roleId) => {
    const roles = {
      1: 'Administrador',
      2: 'Editor', 
      3: 'Usuario Regular'
    };
    return roles[roleId] || 'Desconocido';
  };

  // ===== FUNCIONES PRINCIPALES =====

  /**
   * Cargar usuarios desde el backend
   */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUsersService();

      // Manejar sesi�n expirada
      if (response.message === 'session expired' && response.error) {

        sessionStorage.clear();
        // Nota: La navegaci�n se manejar� en el componente que use el hook
        throw new Error('SESSION_EXPIRED');
      }

      if (!response.success) {
        throw new Error(response.error || 'Error al cargar usuarios');
      }

      const rawUsers = Array.isArray(response.data) ? response.data : [];
      
      // Mapear campos del backend
      const mappedUsers = rawUsers.map(user => ({
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        roleId: user.roleId,
        roleName: user.roleName,
        updatedAt: user.updated_at,
        userName: user.userName,
      }));

      setUsers(mappedUsers);

    } catch (error) {

      setError(error.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refrescar lista de usuarios
   */
  const refreshUsers = () => {

    loadUsers();
  };

  /**
   * Limpiar estado de usuarios (�til para logout)
   */
  const clearUsers = () => {

    setUsers([]);
    setError(null);
    setDeleting(null);
  };

  /**
   * Obtener estad�sticas de usuarios
   */
  const getUserStats = () => {
    return {
      total: users.length,
      admins: users.filter(u => u.roleId === 1).length,
      editors: users.filter(u => u.roleId === 2).length,
      regularUsers: users.filter(u => u.roleId === 3).length,
      withEmail: users.filter(u => u.email).length,
      withoutEmail: users.filter(u => !u.email).length
    };
  };

  /**
   * Eliminar usuario con validaciones completas
   */
  const deleteUser = (user) => {

    // ===== VALIDACIONES DE NEGOCIO =====
    try {
      // Validación 1: No eliminar usuario actual
      if (isCurrentUser(user.id)) {
        const error = 'No puedes eliminar tu propia cuenta.';

        throw new Error(error);
      }

      // Validación 2: No eliminar último administrador
      const adminCount = users.filter(u => u.roleId === 1).length;
      if (user.roleId === 1 && adminCount <= 1) {
        const error = 'No puedes eliminar el último administrador del sistema.';

        throw new Error(error);
      }
    } catch (error) {
      setError(error.message);
      showError(error.message);
      return;
    }

    // ===== CONFIRMACIÓN CON ALERT PROVIDER =====
    // Usar AlertProvider en lugar de window.confirm

    showDeleteConfirm(
      user.userName,
      async () => {

        await performDeleteUser(user);
      },
      {
        title: 'Confirmar eliminación',
        confirmText: 'Eliminar usuario',
        cancelText: 'Cancelar'
      }
    );

  };

  /**
   * Ejecutar eliminación de usuario (función interna)
   */
  const performDeleteUser = async (user) => {
    try {

      // ===== PROCESO DE ELIMINACIÓN =====
      setDeleting(user.id);

      const response = await deleteUserService(user.id);

      // Manejar sesión expirada
      if (response.message === 'session expired' && response.error) {

        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
      }

      if (!response.success) {
        throw new Error(response.error || 'Error al eliminar usuario');
      }

      // ===== ACTUALIZAR ESTADO LOCAL =====
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.filter(u => u.id !== user.id);

        return updatedUsers;
      });

      // Mostrar mensaje de éxito con AlertProvider
      showSuccess(`Usuario "${user.userName}" eliminado correctamente.`);

    } catch (error) {

      setError(error.message || 'Error al eliminar usuario');
      
      // Mostrar mensaje de error con AlertProvider
      showError(error.message || 'Error al eliminar usuario');
    } finally {
      setDeleting(null);
    }
  };

  // ===== FUNCIONES CRUD FUTURAS =====

  /**
   * Crear nuevo usuario con validaciones completas
   */
  const createUser = async (formData) => {
    try {

      setLoading(true);
      setError(null);

      // ===== VALIDACIONES DE NEGOCIO =====
      
      // Validación 1: Contraseñas coinciden
      if (!validatePasswordsMatch(formData.password, formData.confirmPassword)) {
        const error = 'Las contraseñas no coinciden';

        throw new Error(error);
      }

      // Validación 2: Username único (verificar en lista actual)
      const existingUser = users.find(user => 
        user.userName.toLowerCase() === formData.username.toLowerCase()
      );
      if (existingUser) {
        const error = 'El nombre de usuario ya está registrado';

        throw new Error(error);
      }

      // Validación 3: Email único si se proporciona
      if (formData.email && formData.email.trim() !== '') {
        const existingEmail = users.find(user => 
          user.email && user.email.toLowerCase() === formData.email.toLowerCase()
        );
        if (existingEmail) {
          const error = 'El email ya está registrado';

          throw new Error(error);
        }
      }

      // ===== PREPARAR DATOS =====
      const userData = prepareUserData(formData);

      // ===== PROCESO DE CREACIÓN =====
      const response = await createUserService(userData);

      // Manejar sesión expirada
      if (response.message === 'session expired' && response.error) {

        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
      }

      if (!response.success) {
        throw new Error(response.error || 'Error al crear usuario');
      }

      // ===== ACTUALIZAR ESTADO LOCAL =====
      // Agregar nuevo usuario al estado local para evitar recarga
      const newUser = {
        id: response.data.id,
        userName: response.data.userName,
        email: response.data.email || null,
        roleId: response.data.roleId,
        roleName: response.data.roleId === 1 ? 'Administrador' : 'Usuario Regular',
        createdAt: response.data.createdAt || new Date().toISOString(),
        updatedAt: response.data.updatedAt || new Date().toISOString()
      };

      setUsers(prevUsers => {
        const updatedUsers = [...prevUsers, newUser];

        return updatedUsers;
      });

      return { 
        success: true, 
        data: newUser,
        message: `Usuario "${userData.username}" creado correctamente.` 
      };

    } catch (error) {

      setError(error.message || 'Error al crear usuario');
      return { 
        success: false, 
        error: error.message || 'Error al crear usuario' 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar usuario existente con validaciones completas
   */
  const updateUser = async (userId, formData, initialData) => {
    try {

      setLoading(true);
      setError(null);

      // ===== VALIDACIONES DE NEGOCIO =====
      
      // Validación 1: Usuario existe en la lista local
      const existingUser = users.find(user => user.id.toString() === userId.toString());
      if (!existingUser) {
        const error = 'Usuario no encontrado';

        throw new Error(error);
      }

      // Validación 2: Email único si se cambió
      if (formData.email && formData.email !== initialData.email) {
        const emailExists = users.find(user => 
          user.id.toString() !== userId.toString() && 
          user.email && 
          user.email.toLowerCase() === formData.email.toLowerCase()
        );
        if (emailExists) {
          const error = 'El email ya está registrado por otro usuario';

          throw new Error(error);
        }
      }

      // ===== PREPARAR DATOS =====
      // Solo enviar campos que realmente cambiaron
      const updateData = {};
      
      if (formData.email !== initialData.email) {
        updateData.email = formData.email?.trim() || null;
      }
      
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password.trim();
      }
      
      if (parseInt(formData.roleId) !== initialData.roleId) {
        updateData.roleId = parseInt(formData.roleId);
      }

      // Validación 3: Debe haber al menos un cambio
      if (Object.keys(updateData).length === 0) {
        const error = 'No hay cambios para guardar';

        throw new Error(error);
      }

      // ===== PROCESO DE ACTUALIZACIÓN =====
      const response = await updateUserService(userId, updateData);

      // Manejar sesión expirada
      if (response.message === 'session expired' && response.error) {

        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
      }

      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar usuario');
      }

      // ===== ACTUALIZAR ESTADO LOCAL =====
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => {
          if (user.id.toString() === userId.toString()) {
            // Crear usuario actualizado con los nuevos datos
            const updatedUser = {
              ...user,
              ...updateData,
              updatedAt: new Date().toISOString()
            };
            
            // Si se cambió el rol, actualizar el roleName
            if (updateData.roleId) {
              updatedUser.roleName = updateData.roleId === 1 ? 'Administrador' : 
                                    updateData.roleId === 2 ? 'Editor' : 'Usuario Regular';
            }

            return updatedUser;
          }
          return user;
        });

        return updatedUsers;
      });

      return { 
        success: true, 
        data: response.data,
        message: `Usuario actualizado correctamente.` 
      };

    } catch (error) {

      setError(error.message || 'Error al actualizar usuario');
      return { 
        success: false, 
        error: error.message || 'Error al actualizar usuario' 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener usuario por ID desde estado local
   */
  const getUserById = (userId) => {

    return users.find(user => user.id.toString() === userId.toString()) || null;
  };

  /**
   * Cargar usuario individual desde backend (para edición)
   */
  const loadUserById = async (userId) => {
    try {

      setLoading(true);
      setError(null);

      const response = await getUserByIdService(userId);

      // Manejar sesión expirada
      if (response.message === 'session expired' && response.error) {

        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
      }

      // Manejar errores estructurados
      if (!response.success && response.error) {
        throw new Error(response.error);
      }

      // Normalizar datos del usuario (misma lógica que UserEditPage)
      let rawUser = null;
      
      if (response.data) {
        rawUser = response.data;
      } else if (response.success === undefined && response.id) {
        rawUser = response;
      } else {
        throw new Error('Formato de respuesta inesperado del backend');
      }

      const normalizedUser = {
        id: rawUser.id,
        username: rawUser.userName || rawUser.username || rawUser.user_name || '',
        email: rawUser.email || '',
        roleId: rawUser.roleId || rawUser.role_id || 3,
        roleName: rawUser.roleName || getRoleName(rawUser.roleId || rawUser.role_id || 3),
        createdAt: rawUser.createdAt || rawUser.created_at || null,
        updatedAt: rawUser.updatedAt || rawUser.updated_at || null
      };

      // Validación de datos mínimos
      if (!normalizedUser.id || !normalizedUser.username) {
        throw new Error('Datos de usuario incompletos recibidos del backend');
      }

      return { 
        success: true, 
        data: normalizedUser 
      };

    } catch (error) {

      setError(error.message || 'Error al cargar usuario');
      return { 
        success: false, 
        error: error.message || 'Error al cargar usuario' 
      };
    } finally {
      setLoading(false);
    }
  };

  // ===== VALOR DEL CONTEXTO =====
  const value = {
    // Estados
    users,
    loading,
    error,
    deleting,

    // Funciones principales
    loadUsers,
    refreshUsers,
    clearUsers,
    deleteUser,

    // Funciones CRUD futuras
    createUser,
    updateUser,
    getUserById,
    loadUserById,

    // Utilidades
    formatUserDate,
    isCurrentUser,
    getRoleName,
    getUserStats,

    // Estados internos para funciones futuras
    setUsers,
    setDeleting,
    setError
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de usuarios
 */
function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers debe usarse dentro de UsersProvider');
  }
  return context;
}

// PropTypes para validaci�n
UsersProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { UserContext, UsersProvider, useUsers };