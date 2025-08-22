// ===== USERS LIST PAGE - HOMOLOGADO CON BACKEND =====
// src/Pages/Admin/Users/UsersListPage/UsersListPage.jsx

import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organisms/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { Badge } from '../../../../components/atoms/Badge/Badge';
import { Typography } from '../../../../components/atoms/Typography/Typography';
import { useUsers } from '../../../../app/context/UserContext';
import { useAlertContext } from '../../../../app/context/AlertContext';

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
    deleteUser,
    formatUserDate
  } = useUsers();

  const { showInfo } = useAlertContext();

  // ===== EFECTOS =====
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ===== MANEJO DE SESIÓN EXPIRADA =====
  useEffect(() => {
    if (error === 'SESSION_EXPIRED') {
      navigate('/login');
    }
  }, [error, navigate]);

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

  // ===== CONFIGURACIÓN DE COLUMNAS (SOLO CAMPOS REALES) =====
  const userColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ getValue }) => (
        <Typography variant="span" size="xs" weight="medium" color="muted">
          #{getValue()}
        </Typography>
      )
    },
    {
      accessorKey: 'userName',
      header: 'Usuario',
      cell: ({ getValue }) => (
        <Typography variant="span" size="sm" weight="medium" title={getValue()}>
          {getValue()}
        </Typography>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => (
        <Typography variant="span" size="sm" weight="normal" title={getValue() || 'Sin email'}>
          {getValue() || <Typography variant="body" color="muted" italic>Sin email</Typography>}
        </Typography>
      )
    },
    {
      accessorKey: 'roleName',
      header: 'Rol',
      cell: ({ getValue, row }) => {
        const role = getValue();
        const roleId = row.original.roleId;
        const badgeVariant =
          roleId === 1 ? 'primary' :   // Administrador
            roleId === 2 ? 'warning' :  // Editor
              'success';                // Usuario

        return (
          <Badge
            variant={badgeVariant}
            size="sm"
            text={role}
            appearance="soft"
          />
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Registro',
      cell: ({ getValue }) => (
        <Typography variant="span" size="sm" weight="normal">
          {formatUserDate(getValue())}
        </Typography>
      )
    },
  ];

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Gestión de Usuarios"
      subtitle="Administración completa de usuarios del sistema"
      breadcrumbs={[
        { label: 'Usuarios' }
      ]}
      headerActions={
        <div className="users-list__header-actions">
          <Button
            variant="primary"
            size="sm"
            leftIcon="plus"
            onClick={handleCreateUser}
          >
            Crear Usuario
          </Button>
        </div>
      }
    >
      <DataTable
        data={users}
        columns={userColumns}
        loading={loading}
        error={error}
        searchPlaceholder="Buscar por usuario, email o rol..."
        pageSizeOptions={[10, 25, 50, 100]}
        pageSize={10}
        variant="primary"
        emptyTitle="No hay usuarios registrados"
        emptyDescription="Crea tu primer usuario para comenzar a gestionar tu plataforma"
        emptyIcon="👥"
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        className={deleting ? 'users-list__table--deleting' : ''}
      />

    </AdminLayout>
  );
}

const MemoizedUsersListPage = memo(UsersListPage);

export { MemoizedUsersListPage as UsersListPage };