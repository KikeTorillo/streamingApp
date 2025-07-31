// ===== USER EDIT PAGE - SIGUIENDO SISTEMA DE DISEÑO (CORREGIDO) =====
// src/Pages/Admin/Users/UserEditPage/UserEditPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { useUsers } from '../../../../app/context/UserContext';
import './UserEditPage.css';

/**
 * UserEditPage - REFACTORIZADO CON USERCONTEXT
 * 
 * ✅ MIGRADO: Usa UserContext para gestión de estado
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ SIMPLIFICADO: Lógica centralizada en el contexto
 * ✅ BACKEND: Homologado con campos reales del backend
 */
function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ===== CONTEXTO DE USUARIOS =====
  const { 
    loading, 
    error, 
    updateUser,
    loadUserById,
    isCurrentUser,
    getRoleName,
    setError 
  } = useUsers();

  // ===== ESTADOS LOCALES =====
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [userData, setUserData] = useState(null);
  const [initialData, setInitialData] = useState(null);

  // ===== MANEJO DE SESIÓN EXPIRADA =====
  useEffect(() => {
    if (error === 'SESSION_EXPIRED') {
      navigate('/login');
    }
  }, [error, navigate]);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * Verificar si es usuario actual - Usa función del contexto
   */
  const isEditingSelf = () => {
    return isCurrentUser(id);
  };

  // ===== CONFIGURACIÓN DEL FORMULARIO =====
  
  /**
   * Campos de edición - Solo email, rol y contraseña (username NO se puede editar)
   * Según requerimientos: email, roleId, password
   */
  const getEditFormFields = () => {
    const editingSelf = isEditingSelf();
    
    return [
      {
        name: 'email',
        type: 'email',
        label: 'Correo Electrónico',
        placeholder: 'usuario@ejemplo.com',
        required: false,
        leftIcon: '📧',
        helperText: 'Opcional: para notificaciones y recuperación de cuenta',
        width: 'half'
      },
      {
        name: 'password',
        type: 'password',
        label: 'Nueva Contraseña',
        placeholder: 'Dejar vacío para mantener la actual',
        required: false,
        leftIcon: '🔒',
        helperText: 'Mínimo 6 caracteres. Dejar vacío para no cambiar',
        width: 'half',
        validation: (value) => {
          if (value && value.trim() !== '' && value.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
          }
          return true;
        }
      },
      {
        name: 'roleId',
        type: 'select',
        label: 'Rol del Usuario',
        required: true,
        leftIcon: '👥',
        disabled: editingSelf, // No permitir cambiar su propio rol
        helperText: editingSelf 
          ? 'No puedes cambiar tu propio rol por seguridad'
          : 'Define los permisos del usuario en el sistema',
        options: [
          { value: 1, label: '👑 Administrador', disabled: false },
          { value: 2, label: '✏️ Editor', disabled: false },
          { value: 3, label: '👤 Usuario', disabled: false }
        ],
        width: 'full'
      }
    ];
  };

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * Cargar datos del usuario - Usa función del contexto
   */
  const loadUserData = async () => {

    try {
      const result = await loadUserById(id);

      if (result.success) {
        const normalizedUserData = result.data;

        setUserData(normalizedUserData);
        setInitialData({ 
          email: normalizedUserData.email,
          password: '', // La contraseña siempre empieza vacía
          roleId: normalizedUserData.roleId
        });
      } else {

        // El error ya se maneja en el contexto
      }
    } catch (error) {

      // El error ya se maneja en el contexto
    }
  };

  // ===== FUNCIONES DE MANEJO =====
  
  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = (formData) => {

    // Verificar si hay cambios comparando con datos iniciales
    const hasRealChanges = initialData && (
      formData.email !== initialData.email ||
      (formData.password && formData.password.trim() !== '') || // Contraseña nueva si no está vacía
      parseInt(formData.roleId) !== initialData.roleId
    );
    
    setHasChanges(hasRealChanges);

  };

  /**
   * Manejar envío del formulario - Usa función del contexto
   */
  const handleSubmit = async (formData) => {

    try {
      const result = await updateUser(id, formData, initialData);

      if (result.success) {

        setSuccess(true);
        setHasChanges(false);

        // Recargar datos actualizados
        setTimeout(() => {
          loadUserData();
        }, 1000);

        // Redirigir después de un delay
        setTimeout(() => {
          navigate('/admin/users');
        }, 2500);
      } else {

        // El error ya se maneja en el contexto
      }
    } catch (error) {

      // El error ya se maneja en el contexto
    }
  };

  /**
   * Manejar cancelación
   */
  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm(
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir? ' +
        'Se perderán los cambios no guardados.'
      );
      if (!confirmCancel) return;
    }
    
    navigate('/admin/users');
  };

  // ===== EFECTOS =====
  useEffect(() => {
    if (id) {
      loadUserData();
    } else {
      setError('ID de usuario no proporcionado');
      setLoading(false);
    }
  }, [id]);

  // ===== RENDER =====
  
  if (loading) {
    return (
      <AdminLayout
        title="Editar Usuario"
        subtitle="Cargando datos del usuario..."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Usuarios', href: '/admin/users' },
          { label: 'Editar' }
        ]}
      >
        <div className="user-edit__loading">
          <div className="user-edit__loading-spinner">⏳</div>
          <p>Cargando información del usuario...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !userData) {
    return (
      <AdminLayout
        title="Error"
        subtitle="No se pudo cargar el usuario"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Usuarios', href: '/admin/users' },
          { label: 'Error' }
        ]}
      >
        <div className="user-edit__error">
          <div className="user-edit__error-icon">❌</div>
          <h2>Error al cargar usuario</h2>
          <p>{error}</p>
          <Button onClick={() => navigate('/admin/users')} variant="primary">
            Volver a la lista
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Editar Usuario: ${userData?.username || 'Usuario'}`}
      subtitle={`${userData?.roleName || 'Rol'} • Creado ${userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}`}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Usuarios', href: '/admin/users' },
        { label: userData?.username || 'Editar' }
      ]}
      headerActions={
        <div className="user-edit__header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => document.getElementById('user-edit-form')?.requestSubmit()}
            loading={loading}
            disabled={!hasChanges || loading}
            leftIcon="💾"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      }
    >
      <div className="user-edit">
        
        {/* ===== NOTIFICACIONES ===== */}
        {success && (
          <div className="user-edit__success">
            <div className="user-edit__success-icon">✅</div>
            <div className="user-edit__success-content">
              <h3>¡Usuario actualizado exitosamente!</h3>
              <p>Los cambios se han guardado correctamente. Redirigiendo...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="user-edit__error-message">
            <div className="user-edit__error-icon">⚠️</div>
            <div className="user-edit__error-content">
              <h4>Error al guardar</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* ===== INFORMACIÓN ACTUAL (ANTES DEL FORMULARIO) ===== */}
        <div className="user-edit__current-info">
          <div className="user-edit__current-info-section">
            <h3 className="user-edit__info-title">📋 Información Actual del Usuario</h3>
            <div className="user-edit__current-info-grid">
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">ID:</span>
                <span className="user-edit__current-info-value">{userData?.id}</span>
              </div>
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">Usuario:</span>
                <span className="user-edit__current-info-value">{userData?.username}</span>
              </div>
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">Email:</span>
                <span className="user-edit__current-info-value">{userData?.email || 'Sin email'}</span>
              </div>
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">Rol:</span>
                <span className="user-edit__current-info-value">{userData?.roleName}</span>
              </div>
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">Creado:</span>
                <span className="user-edit__current-info-value">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              <div className="user-edit__current-info-item">
                <span className="user-edit__current-info-label">Actualizado:</span>
                <span className="user-edit__current-info-value">
                  {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric', 
                    month: 'short',
                    day: 'numeric'
                  }) : 'Nunca'}
                </span>
              </div>
            </div>
            
            {isEditingSelf() && (
              <div className="user-edit__warning">
                <span className="user-edit__warning-icon">⚠️</span>
                <span>Estás editando tu propia cuenta. Ten cuidado con los cambios.</span>
              </div>
            )}
          </div>
        </div>

        {/* ===== FORMULARIO DE EDICIÓN (MISMO ESTILO QUE CREATE) ===== */}
        <div className="user-edit__form-container">
          <div className="user-edit__form-header">
            <h2 className="user-edit__form-title">Información del Usuario</h2>
            <p className="user-edit__form-description">
              Modifica los campos necesarios. Solo se enviarán los campos que cambies y que existen en la base de datos.
            </p>
          </div>

          {userData && (
            <DynamicForm
              id="user-edit-form"
              fields={getEditFormFields()}
              initialData={{
                email: userData.email || '',
                password: '', // Siempre vacía inicialmente
                roleId: userData.roleId || 3
              }}
              onSubmit={handleSubmit}
              onChange={handleFormChange}
              loading={loading}
              disabled={loading || success}
              columnsPerRow={2}
              tabletColumns={1}
              mobileColumns={1}
              fieldSize="md"
              fieldRounded="md"
              submitText={loading ? 'Guardando...' : 'Guardar Cambios'}
              submitVariant="primary"
              submitSize="md"
              submitIcon="💾"
              validateOnBlur={true}
              validateOnChange={false}
              showSubmit={!success} // Ocultar botón cuando hay éxito
              className={`user-edit__form ${success ? 'user-edit__form--success' : ''}`}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export { UserEditPage };