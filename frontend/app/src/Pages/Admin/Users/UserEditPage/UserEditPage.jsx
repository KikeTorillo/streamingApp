// ===== USER EDIT PAGE - SIGUIENDO SISTEMA DE DISEÑO (CORREGIDO) =====
// src/Pages/Admin/Users/UserEditPage/UserEditPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button, Container, Divider, Badge, Typography } from '../../../../../design-system';
import { useUsers } from '../../../../app/context/UserContext';

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
        leftIcon: 'mail',
        helperText: 'Opcional: para notificaciones y recuperación de cuenta',
        width: 'half'
      },
      {
        name: 'password',
        type: 'password',
        label: 'Nueva Contraseña',
        placeholder: 'Dejar vacío para mantener la actual',
        required: false,
        leftIcon: 'lock',
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
        leftIcon: 'users',
        disabled: editingSelf, // No permitir cambiar su propio rol
        helperText: editingSelf 
          ? 'No puedes cambiar tu propio rol por seguridad'
          : 'Define los permisos del usuario en el sistema',
        options: [
          { value: 1, label: 'Administrador', disabled: false },
          { value: 2, label: 'Editor', disabled: false },
          { value: 3, label: 'Usuario', disabled: false }
        ],
        width: 'full'
      }
    ];
  };

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * Cargar datos del usuario - Usa función del contexto
   */
  const loadUserData = useCallback(async () => {

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
    } catch {
      // El error ya se maneja en el contexto
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // ✅ CORREGIDO: Solo 'id' en dependencias, loadUserById es estable

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
    } catch {
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
      // Error: ID no proporcionado
    }
  }, [id, loadUserData, setError]);

  // ===== RENDER =====
  
  if (loading) {
    return (
      <AdminLayout
        title="Editar Usuario"
        subtitle="Cargando datos del usuario..."
        breadcrumbs={[
          { label: 'Usuarios', to: '/admin/users' },
          { label: 'Editar' }
        ]}
      >
        <div className="user-edit__loading">
          <div className="user-edit__loading-spinner">⏳</div>
          <Typography variant="body" size="md" color="muted">Cargando información del usuario...</Typography>
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
          { label: 'Usuarios', to: '/admin/users' },
          { label: 'Error' }
        ]}
      >
        <div className="user-edit__error">
          <div className="user-edit__error-icon">❌</div>
          <Typography variant="h2" size="lg" weight="semibold" color="danger">Error al cargar usuario</Typography>
          <Typography variant="body" size="md" color="muted">{error}</Typography>
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
        { label: 'Usuarios', to: '/admin/users' },
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
            leftIcon="save"
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
              <Typography variant="h3" size="md" weight="semibold" color="success">¡Usuario actualizado exitosamente!</Typography>
              <Typography variant="body" size="md" color="muted">Los cambios se han guardado correctamente. Redirigiendo...</Typography>
            </div>
          </div>
        )}

        {error && (
          <div className="user-edit__error-message">
            <div className="user-edit__error-icon">⚠️</div>
            <div className="user-edit__error-content">
              <Typography variant="h4" size="sm" weight="semibold" color="danger">Error al guardar</Typography>
              <Typography variant="body" size="md" color="muted">{error}</Typography>
            </div>
          </div>
        )}

        {/* ===== LAYOUT PRINCIPAL DE 2 COLUMNAS ===== */}
        <div className="user-edit__layout">
          
          {/* ===== COLUMNA IZQUIERDA - INFORMACIÓN ACTUAL ===== */}
          <div className="user-edit__sidebar">
            
            {/* Panel de información */}
            <Container variant="neutral" size="lg" className="info-panel">
              <div className="info-panel__header">
                <Typography variant="h3" size="md" weight="semibold" className="info-panel__title">
                  📋 Información Actual
                </Typography>
                <Badge variant="primary" size="sm">
                  ID: {userData?.id}
                </Badge>
              </div>
              <Divider variant="neutral" size="sm" />
              {/* Detalles actuales */}
              <div className="info-panel__details">
                <Typography variant="h4" size="sm" weight="medium" className="info-panel__subtitle">Detalles</Typography>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Usuario:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{userData?.username}</Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Email:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{userData?.email || 'Sin email'}</Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Rol:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">{userData?.roleName}</Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Creado:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </Typography>
                </div>
                
                <div className="info-detail">
                  <Typography variant="span" size="xs" weight="medium" color="muted" className="info-detail__label">Actualizado:</Typography>
                  <Typography variant="span" size="sm" weight="normal" className="info-detail__value">
                    {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric', 
                      month: 'short',
                      day: 'numeric'
                    }) : 'Nunca'}
                  </Typography>
                </div>
              </div>
              
              {/* Advertencia para auto-edición */}
              {isEditingSelf() && (
                <>
                  <Divider variant="warning" size="sm" />
                  <div className="info-panel__warning">
                    <span className="info-panel__warning-icon">⚠️</span>
                    <Typography variant="span" size="sm" weight="medium" color="warning" className="info-panel__warning-text">
                      Estás editando tu propia cuenta. Ten cuidado con los cambios.
                    </Typography>
                  </div>
                </>
              )}
            </Container>
          </div>

          {/* ===== COLUMNA DERECHA - FORMULARIO DE EDICIÓN ===== */}
          <div className="user-edit__main">
            <Container variant="neutral" size="xl" className="edit-form-container">
              <div className="edit-form-container__header">
                <Typography variant="h3" size="md" weight="semibold" className="edit-form-container__title">
                  ✏️ Editar Información
                </Typography>
                <Typography variant="body" size="md" color="muted" className="edit-form-container__subtitle">
                  Modifica los campos necesarios. Solo se enviarán los campos que cambies y que existen en la base de datos.
                </Typography>
              </div>

              <Divider variant="neutral" size="md" />

              {/* Formulario principal */}
              <div className="edit-form-container__form">

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
              submitIcon="save"
              validateOnBlur={true}
              validateOnChange={false}
              showSubmit={!success} // Ocultar botón cuando hay éxito
                    className={`user-edit__form ${success ? 'user-edit__form--success' : ''}`}
                  />
                )}
              </div>
            </Container>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export { UserEditPage };