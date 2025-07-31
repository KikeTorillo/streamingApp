// ===== USERS LIST PAGE - HOMOLOGADO CON BACKEND =====
// src/Pages/Admin/Users/UsersListPage/UsersListPage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organisms/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { useUsers } from '../../../../app/context/UserContext';
import { useAlertContext } from '../../../../app/context/AlertContext';
import './UsersListPage.css';

// Servicios de usuarios
// deleteUserService ahora se maneja en UserContext

/**
 * UsersListPage - Página de gestión de usuarios REFACTORIZADA
 * 
 * ✅ MIGRADO: Usa UserContext para gestión de estado
 * ✅ SIMPLIFICADO: Lógica centralizada en el contexto
 * ✅ MANTENIDO: Funcionalidad completa
 */
function UsersListPage() {
  const navigate = useNavigate();
  
  // ===== CONTEXTO DE USUARIOS =====
  const {
    users,
    loading,
    error,
    deleting,
    loadUsers,
    refreshUsers,
    deleteUser,
    formatUserDate,
    isCurrentUser,
    getUserStats
  } = useUsers();

  const { showInfo } = useAlertContext();

  // ===== EFECTOS =====
  useEffect(() => {
    loadUsers();
  }, []);

  // ===== MANEJO DE SESIÓN EXPIRADA =====
  useEffect(() => {
    if (error === 'SESSION_EXPIRED') {
      navigate('/login');
    }
  }, [error, navigate]);

  // ===== FUNCIONES DE MANEJO =====

  /**
   * Ver usuario - TODO: Implementar modal de detalles
   */
  const handleViewUser = (user) => {

    showInfo(
      `<strong>ID:</strong> ${user.id}<br/>` +
      `<strong>Email:</strong> ${user.email}<br/>` +
      `<strong>Rol:</strong> ${user.roleName}`,
      {
        title: `Detalles de ${user.userName}`,
        size: 'md'
      }
    );
  };

  /**
   * Editar usuario
   */
  const handleEditUser = (user) => {

    navigate(`/admin/users/edit/${user.id}`);
  };

  /**
   * Eliminar usuario - Usa función del contexto
   */
  const handleDeleteUser = (user) => {

    // El contexto maneja toda la lógica de confirmación y mensajes
    deleteUser(user);
  };

  /**
   * Crear nuevo usuario
   */
  const handleCreateUser = () => {
    navigate('/admin/users/create');
  };

  /**
   * Refrescar lista - Usa función del contexto
   */
  const handleRefresh = () => {
    refreshUsers();
  };

  // ===== CONFIGURACIÓN DE COLUMNAS (SOLO CAMPOS REALES) =====
  const userColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ getValue }) => (
        <span>
          #{getValue()}
        </span>
      )
    },
    {
      accessorKey: 'userName',
      header: 'Usuario',
      cell: ({ getValue }) => (
        <span title={getValue()}>
          {getValue()}
        </span>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => (
        <span title={getValue() || 'Sin email'}>
          {getValue() || <em style={{ color: 'var(--text-muted)' }}>Sin email</em>}
        </span>
      )
    },
    {
      accessorKey: 'roleName',
      header: 'Rol',
      cell: ({ getValue, row }) => {
        const role = getValue();
        const roleId = row.original.roleId;
        const badgeVariant =
          roleId === 1 ? 'info' :     // Administrador
            roleId === 2 ? 'warning' :  // Editor
              'success';                  // Usuario

        return (
          <Badge 
            variant={badgeVariant}
            size="sm"
            text={role}
            style='soft'
          />
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Registro',
      cell: ({ getValue }) => (
        <span>
          {formatUserDate(getValue())}
        </span>
      )
    },
  ];

  // ===== ESTADÍSTICAS - USA FUNCIÓN DEL CONTEXTO =====
  const stats = getUserStats();

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Usuarios"
      headerActions={
        <div className="users-list__header-actions">
          <Button
            variant="outline"
            size="sm"
            leftIcon="🔄"
            onClick={handleRefresh}
            loading={loading}
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon="➕"
            onClick={handleCreateUser}
          >
            Crear Usuario
          </Button>
        </div>
      }
    >
      <div className="users-list">
        {/* ===== TABLA DE USUARIOS ===== */}
        <div className="users-list__table">
          <DataTable
            data={users}
            columns={userColumns}
            loading={loading}
            error={error}
            searchPlaceholder="Buscar por usuario, email o rol..."
            pageSizeOptions={[10, 25, 50, 100]}
            pageSize={10}
            variant="default"
            emptyTitle="No hay usuarios registrados"
            emptyDescription="Crea tu primer usuario para comenzar a gestionar tu plataforma"
            emptyIcon="👥"
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            className={deleting ? 'users-list__table--deleting' : ''}
            rowClassName={(row) => {
              const classes = [];
              if (deleting === row.original.id) classes.push('users-list__row--deleting');
              if (isCurrentUser(row.original.id)) classes.push('users-list__row--current');
              return classes.join(' ');
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export { UsersListPage };