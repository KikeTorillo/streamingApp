// ===== USER CREATE PAGE - MIGRADO A CONTAINER COMPONENT =====
// src/Pages/Admin/Users/UserCreatePage/UserCreatePage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { useUsers } from '../../../../app/context/UserContext';
import { useSuccessRedirect } from '../../../../hooks/useSuccessRedirect';
import './UserCreatePage.css';

/**
 * UserCreatePage - REFACTORIZADO CON USERCONTEXT
 * 
 * ✅ MIGRADO: Usa UserContext para gestión de estado
 * ✅ CONTAINER: Usa <Container size="md" /> en lugar de layout personalizado
 * ✅ SIMPLIFICADO: Lógica centralizada en el contexto
 * ✅ BACKEND: Campos reales según esquemas del backend
 */
function UserCreatePage() {
  const navigate = useNavigate();

  // ===== CONTEXTO DE USUARIOS =====
  const { 
    loading, 
    error, 
    createUser,
    setError 
  } = useUsers();

  // ===== ESTADOS LOCALES =====
  const [hasChanges, setHasChanges] = useState(false);

  // ===== HOOK DE ÉXITO HOMOLOGADO =====
  const { triggerSuccess } = useSuccessRedirect('/admin/users');

  // ===== MANEJO DE SESIÓN EXPIRADA =====
  useEffect(() => {
    if (error === 'SESSION_EXPIRED') {
      navigate('/login');
    }
  }, [error, navigate]);

  // ===== CONFIGURACIÓN HOMOLOGADA CON BACKEND =====

  /**
   * Campos según schema del backend: solo campos que existen en DB
   */
  const userFormFields = [
    {
      name: 'username',
      type: 'text',
      label: 'Nombre de Usuario',
      placeholder: 'Ej: juan_perez',
      required: true,
      leftIcon: '👤',
      helperText: 'Único, 3-30 caracteres, solo letras/números/guiones bajos',
      width: 'half'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Correo Electrónico',
      placeholder: 'usuario@ejemplo.com',
      required: false, // Email es OPCIONAL en backend
      leftIcon: '📧',
      helperText: 'Opcional. Para recuperación de contraseña',
      width: 'half'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Mínimo 6 caracteres',
      required: true,
      leftIcon: '🔐',
      helperText: 'Mínimo 6 caracteres para seguridad',
      width: 'half'
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirmar Contraseña',
      placeholder: 'Repetir contraseña',
      required: true,
      leftIcon: '🔒',
      helperText: 'Debe coincidir exactamente',
      width: 'half'
    },
    {
      name: 'roleId',
      type: 'select',
      label: 'Rol del Usuario',
      placeholder: 'Selecciona un rol',
      required: true,
      leftIcon: '🎭',
      options: [
        { value: 1, label: 'Administrador' },
        { value: 2, label: 'Usuario Regular' }
      ],
      helperText: 'Define los permisos del usuario',
      width: 'half'
    }
  ];

  // ===== HANDLERS =====

  /**
   * Manejar envío del formulario - Usa función del contexto
   */
  const handleSubmit = async (formData) => {

    try {
      const result = await createUser(formData);

      if (result.success) {

        triggerSuccess('¡Usuario creado exitosamente!');
        setHasChanges(false);
      } else {

        // El error ya se maneja en el contexto
      }
    } catch (error) {

      // El error ya se maneja en el contexto
    }
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = () => {
    setHasChanges(true);
    if (error) setError(null);
  };

  /**
   * Navegar de vuelta
   */
  const handleGoBack = () => {
    if (hasChanges && !success) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }
    navigate('/admin/users');
  };

  /**
   * Limpiar error del contexto
   */
  const handleClearError = () => {
    setError(null);
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Crear Nuevo Usuario"
      subtitle="Agregar un usuario al sistema con permisos específicos"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Usuarios', href: '/admin/users' },
        { label: 'Crear Usuario' }
      ]}
    >
      {/* 🎯 CONTENEDOR PRINCIPAL - MIGRADO A CONTAINER COMPONENT */}
      <Container
        size="lg"
        className={`${loading ? 'user-create--loading' : ''}`}
      >

        <Button
          variant="outline"
          size="md"
          leftIcon="←"
          onClick={handleGoBack}
          disabled={loading}
        >
          Volver a Usuarios
        </Button>

        {/* ❌ MENSAJE DE ERROR - SISTEMA DE DISEÑO */}
        {error && (
          <div className="status-message status-message--error">
            <span className="status-message__icon">⚠️</span>
            <div className="status-message__content">
              <strong>Error al crear usuario</strong>
              <span>{error}</span>
            </div>
            <button
              className="status-message__close"
              onClick={handleClearError}
              aria-label="Cerrar mensaje de error"
            >
              ×
            </button>
          </div>
        )}

        {/* Header del formulario */}
        <div className="form-header">
          <h2 className="form-title">Información del Usuario</h2>
          <p className="form-description">
            Completa todos los campos requeridos para crear el nuevo usuario.
            La información de rol define los permisos de acceso al sistema.
          </p>
        </div>

        {/* Formulario */}
        <DynamicForm
          fields={userFormFields}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
          submitText={loading ? "Creando Usuario..." : "Crear Usuario"}
          submitVariant="primary"
          submitSize="lg"
          loading={loading}
          disabled={loading}
          columnsPerRow={2}
          tabletColumns={1}
          mobileColumns={1}
          validateOnChange={true}
          validateOnBlur={true}
          className=""
        />

        {/* Información adicional */}
        <div className="form-footer">
          <div className="info-card">
            <h4>💡 Información sobre Roles</h4>
            <ul>
              <li><strong>Administrador:</strong> Acceso completo a todas las funciones</li>
              <li><strong>Usuario Regular:</strong> Acceso limitado a contenido y perfil</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>🔒 Seguridad</h4>
            <ul>
              <li>Las contraseñas deben tener mínimo 6 caracteres</li>
              <li>El email es opcional pero recomendado para recuperación</li>
              <li>Los nombres de usuario deben ser únicos en el sistema</li>
            </ul>
          </div>
        </div>
      </Container>
    </AdminLayout>
  );
}

export { UserCreatePage };