// ===== CATEGORIES LIST PAGE - HOMOLOGADO CON BACKEND Y USERS LIST =====
// src/Pages/Admin/Categories/CategoriesListPage/CategoriesListPage.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organisms/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { EditModal } from '../../../../components/organisms/EditModal/EditModal';
import { AlertProvider, useAlertContext } from '../../../../app/context/AlertContext';
import './CategoriesListPage.css';

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
  const { showInfo, showSuccess, showError } = useAlertContext();

  // ===== CONTEXTO DE CATEGORÍAS =====
  const {
    categories,
    loading,
    error,
    deleting,
    editing,
    editModal,
    editError,
    loadCategories,
    deleteCategory,
    openEditModal,
    closeEditModal,
    saveFromModal,
    formatCategoryDate
    // getCategoriesStats - disponible para uso futuro
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
      size: 80,
      cell: ({ row }) => (
        <span>
          {row.original.id}
        </span>
      )
    },
    {
      accessorKey: 'name',
      header: 'Nombre de Categoría',
      cell: ({ row }) => (
        <div>
          <div>
            {row.original.name}
          </div>
          <div>
            🎭 Categoría
          </div>
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      size: 180,
      cell: ({ row }) => (
        <span>
          {formatCategoryDate(row.original.createdAt)}
        </span>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: 'Última Actualización',
      size: 180,
      cell: ({ row }) => (
        <span>
          {formatCategoryDate(row.original.updatedAt)}
        </span>
      )
    }
  ];

  // ===== ESTADÍSTICAS CALCULADAS =====
  
  // Estadísticas se obtienen del contexto (disponible para uso futuro)
  // const stats = getCategoriesStats();

  // ===== FUNCIONES DE DATOS =====
  
  // loadCategories se obtiene del contexto

  // ===== FUNCIONES DE ACCIONES =====
  
  /**
   * Ver detalles de categoría
   */
  const handleViewCategory = (category) => {
    console.log('👁️ Ver categoría:', category);
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
    console.log('✏️ Editar categoría:', category);
    openEditModal(category);
  };
  
  /**
   * Guardar cambios en categoría
   */
  const handleSaveCategory = async (newName) => {
    try {
      const result = await saveFromModal(newName);
      
      if (result.success) {
        console.log('✅ Categoría actualizada exitosamente');
      } else if (result.error === 'SESSION_EXPIRED') {
        console.log('🔒 Sesión expirada, redirigiendo...');
        navigate('/login');
      }
      
    } catch (error) {
      if (error.message === 'SESSION_EXPIRED') {
        console.log('🔒 Sesión expirada, redirigiendo...');
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
        console.log('🔒 Sesión expirada, redirigiendo...');
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
  const handleRefresh = () => {
    loadCategories();
  };

  // ===== EFECTOS =====
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // ===== RENDER =====
  
  return (
    <AdminLayout
      title="Gestión de Categorías"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Categorías' }
      ]}
      headerActions={
        <div className="categories-list__header-actions">
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
            leftIcon="🎭"
            onClick={handleCreateCategory}
          >
            Crear Categoría
          </Button>
        </div>
      }
    >
      <div className="categories-list">
        {/* ===== TABLA DE CATEGORÍAS ===== */}
        <div className="categories-list__table">
          <DataTable
            data={categories}
            columns={categoryColumns}
            loading={loading}
            error={error}
            searchPlaceholder="Buscar categorías por nombre..."
            pageSizeOptions={[10, 25, 50, 100]}
            pageSize={10}
            variant="default"
            emptyTitle="No hay categorías registradas"
            emptyDescription="Crea tu primera categoría para organizar el contenido multimedia"
            emptyIcon="🎭"
            onView={handleViewCategory}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            deleting={deleting}
            editing={editing}
            className={deleting ? 'categories-list__table--deleting' : ''}
            rowClassName={(row) => {
              const classes = [];
              if (deleting === row.original.id) {
                classes.push('categories-list__row--deleting');
              }
              return classes.join(' ');
            }}
          />
        </div>
      </div>
      
      {/* Modal de edición */}
      <EditModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        onSave={handleSaveCategory}
        title="Editar Categoría"
        fieldLabel="Nombre de la Categoría"
        fieldPlaceholder="Ej: Acción, Comedia, Drama..."
        initialValue={editModal.category?.name || ''}
        loading={editing}
        error={editError}
        icon="📂"
        required
        minLength={2}
        maxLength={50}
        size="md"
      />
    </AdminLayout>
  );
}

export { CategoriesListPage };