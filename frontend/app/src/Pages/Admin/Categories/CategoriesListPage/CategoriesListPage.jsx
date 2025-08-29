// ===== CATEGORIES LIST PAGE - HOMOLOGADO CON BACKEND Y USERS LIST =====
// src/Pages/Admin/Categories/CategoriesListPage/CategoriesListPage.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable, Button, Typography } from '../../../../../design-system';
import { EditModal } from '../../../../components/organisms/EditModal/EditModal';
import { AlertProvider, useAlertContext } from '../../../../app/context/AlertContext';

// Contexto de categorías
import { useCategories } from '../../../../app/context/CategoriesContext';

/**
 * CategoriesListPage - Página de gestión de categorías COMPLETA
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con servicios existentes
 * ✅ PATRÓN: Sigue exactamente el mismo patrón que UsersListPage
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ CRUD: Operaciones de Ver, Editar y Eliminar implementadas
 * ✅ MIGRACIÓN: Usa AlertProvider en lugar de alert() nativo
 */
function CategoriesListPage() {
  return (
    <AlertProvider>
      <CategoriesListContent />
    </AlertProvider>
  );
}

function CategoriesListContent() {
  const navigate = useNavigate();

  // ===== HOOKS DE ALERTAS =====
  const { showInfo, showError } = useAlertContext();

  // ===== CONTEXTO DE CATEGORÍAS =====
  const {
    categories,
    loading,
    error,
    deleting,
    editModal,
    editError,
    loadCategories,
    deleteCategory,
    openEditModal,
    closeEditModal,
    saveFromModal,
    formatCategoryDate
  } = useCategories();

  // ===== FUNCIONES AUXILIARES =====

  // Formatear fechas se obtiene del contexto como formatCategoryDate

  // ===== CONFIGURACIÓN DE COLUMNAS =====

  /**
   * ✅ Columnas de la tabla - SIN columna de acciones personalizada (usa DataTable integrado)
   */
  const categoryColumns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <Typography variant="span" size="xs" weight="medium" color="muted">
          {row.original.id}
        </Typography>
      )
    },
    {
      accessorKey: 'name',
      header: 'Nombre de Categoría',
      cell: ({ row }) => (
        <div>
          <Typography variant="div" size="sm" weight="medium">
            {row.original.name}
          </Typography>
          <Typography variant="div" size="xs" color="muted">
            Categoría
          </Typography>
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      cell: ({ row }) => (
        <Typography variant="span" size="sm" weight="normal">
          {formatCategoryDate(row.original.createdAt)}
        </Typography>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: 'Última Actualización',
      cell: ({ row }) => (
        <Typography variant="span" size="sm" weight="normal">
          {formatCategoryDate(row.original.updatedAt)}
        </Typography>
      )
    }
  ];

  // ===== FUNCIONES DE ACCIONES =====

  /**
   * Ver detalles de categoría
   */
  const handleViewCategory = (category) => {

    // TODO: Implementar modal de detalles o navegar a página de detalles
    showInfo(`
      <strong>Detalles de categoría: ${category.name}</strong><br/>
      <br/>
      <strong>ID:</strong> ${category.id}<br/>
      <strong>Nombre:</strong> ${category.name}<br/>
      <strong>Creado:</strong> ${formatCategoryDate(category.createdAt)}<br/>
      <strong>Actualizado:</strong> ${formatCategoryDate(category.updatedAt)}
    `, { title: 'Información de Categoría' });
  };

  /**
   * Editar categoría - Abrir modal de edición
   */
  const handleEditCategory = (category) => {

    openEditModal(category);
  };

  /**
   * Guardar cambios en categoría
   */
  const handleSaveCategory = async (newName) => {
    try {
      const result = await saveFromModal(newName);

      if (result.success) {
        // Éxito - no se requiere acción, el contexto ya actualizó la lista
      } else if (result.error === 'SESSION_EXPIRED') {

        navigate('/login');
      }

    } catch (error) {
      if (error.message === 'SESSION_EXPIRED') {

        navigate('/login');
      }
    }
  };

  /**
   * Eliminar categoría usando el contexto
   */
  const handleDeleteCategory = (category) => {
    try {
      // deleteCategory maneja su propia confirmación y resultado
      deleteCategory(category);
    } catch (error) {
      if (error.message === 'SESSION_EXPIRED') {

        navigate('/login');
      } else {
        showError(`Error inesperado: ${error.message}`);
      }
    }
  };

  /**
   * Crear nueva categoría
   */
  const handleCreateCategory = () => {
    navigate('/admin/categories/create');
  };

  /**
   * Actualizar lista
   */
  // const handleRefresh = () => {
  //   loadCategories();
  // };

  // ===== EFECTOS =====
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // ===== RENDER =====

  return (
    <AdminLayout
      title="Gestión de Categorías"
      subtitle="Administración completa de categorías para organizar contenido"
      breadcrumbs={[
        { label: 'Categorías' }
      ]}
      headerActions={
        <Button
          variant="primary"
          size="sm"
          leftIcon="grid"
          onClick={handleCreateCategory}
        >
          Crear Categoría
        </Button>

      }
    >

      <DataTable
        data={categories}
        columns={categoryColumns}
        loading={loading}
        error={error}
        searchPlaceholder="Buscar categorías por nombre..."
        pageSizeOptions={[10, 25, 50, 100]}
        pageSize={10}
        variant="primary"
        emptyTitle="No hay categorías registradas"
        emptyDescription="Crea tu primera categoría para organizar el contenido multimedia"
        emptyIcon="grid"
        onView={handleViewCategory}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        deleting={deleting}
        className={deleting ? 'categories-list__table--deleting' : ''}
      />

      {/* Modal de edición */}
      <EditModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        onSave={handleSaveCategory}
        title="Editar Categoría"
        fieldLabel="Nombre de la Categoría"
        fieldPlaceholder="Ej: Acción, Comedia, Drama..."
        initialValue={editModal.category?.name || ''}
        loading={false}
        error={editError}
        leftIcon="folder"
        required
        minLength={2}
        maxLength={50}
        size="md"
        variant="primary"
        rounded="xl"
      />
    </AdminLayout>
  );
}

export { CategoriesListPage };