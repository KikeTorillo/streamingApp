// ===== CATEGORIES LIST PAGE - HOMOLOGADO CON BACKEND Y USERS LIST =====
// src/Pages/Admin/Categories/CategoriesListPage/CategoriesListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { DataTable } from '../../../../components/organisms/DataTable/DataTable';
import { Button } from '../../../../components/atoms/Button/Button';
import { EditModal } from '../../../../components/organisms/EditModal/EditModal';
import './CategoriesListPage.css';

// Servicios de categorías
import { getCategoriesService } from '../../../../services/Categories/getCategoriesService';
import { deleteCategoryService } from '../../../../services/Categories/deleteCategoryService';
import { updateCategoryService } from '../../../../services/Categories/updateCategoryService';

/**
 * CategoriesListPage - Página de gestión de categorías COMPLETA
 * 
 * ✅ SISTEMA DE DISEÑO: Solo componentes con stories de Storybook
 * ✅ BACKEND: Homologado con servicios existentes
 * ✅ PATRÓN: Sigue exactamente el mismo patrón que UsersListPage
 * ✅ UX: Estados de loading, error y success consistentes
 * ✅ CRUD: Operaciones de Ver, Editar y Eliminar implementadas
 */
function CategoriesListPage() {
  const navigate = useNavigate();

  // ===== ESTADOS =====
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  
  // Estados para el modal de edición
  const [editModal, setEditModal] = useState({ isOpen: false, category: null });
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState(null);

  // ===== FUNCIONES AUXILIARES =====
  
  /**
   * ✅ Formatear fechas (adaptado para categorías)
   */
  const formatDate = (dateString) => {
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
    } catch (error) {
      return 'Fecha inválida';
    }
  };

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
          {formatDate(row.original.createdAt)}
        </span>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: 'Última Actualización',
      size: 180,
      cell: ({ row }) => (
        <span>
          {formatDate(row.original.updatedAt)}
        </span>
      )
    }
  ];

  // ===== ESTADÍSTICAS CALCULADAS =====
  
  /**
   * ✅ Calcular estadísticas de categorías
   */
  const stats = {
    total: categories.length,
    // Agregar más estadísticas específicas de categorías si es necesario
    withLongNames: categories.filter(cat => cat.name && cat.name.length > 10).length,
    withShortNames: categories.filter(cat => cat.name && cat.name.length <= 10).length,
    recentlyCreated: categories.filter(cat => {
      if (!cat.createdAt) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(cat.createdAt) > weekAgo;
    }).length
  };

  // ===== FUNCIONES DE DATOS =====
  
  /**
   * ✅ Cargar categorías usando el servicio existente
   */
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Cargando categorías...');
      const response = await getCategoriesService();
      
      console.log('📋 Respuesta del servicio:', response);
      
      // ✅ El servicio existente devuelve directamente un array o lanza error
      const categoriesArray = Array.isArray(response) ? response : [];
      
      // ✅ Normalizar datos de categorías
      const normalizedCategories = categoriesArray.map(category => ({
        id: category.id,
        name: category.name || 'Sin nombre',
        createdAt: category.created_at || category.createdAt || null,
        updatedAt: category.updated_at || category.updatedAt || null
      }));

      console.log('✅ Categorías normalizadas:', normalizedCategories);
      
      setCategories(normalizedCategories);
      
    } catch (error) {
      console.error('💥 Error al cargar categorías:', error);
      
      // ✅ Manejar sesión expirada
      if (error.response?.status === 401) {
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      }
      
      setError(error.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNCIONES DE ACCIONES =====
  
  /**
   * Ver detalles de categoría
   */
  const handleViewCategory = (category) => {
    console.log('👁️ Ver categoría:', category);
    // TODO: Implementar modal de detalles o navegar a página de detalles
    alert(`Ver detalles de categoría: ${category.name}`);
  };

  /**
   * Editar categoría - Abrir modal de edición
   */
  const handleEditCategory = (category) => {
    console.log('✏️ Editar categoría:', category);
    setEditModal({ isOpen: true, category });
    setEditError(null);
  };
  
  /**
   * Guardar cambios en categoría
   */
  const handleSaveCategory = async (newName) => {
    setEditing(true);
    setEditError(null);
    
    try {
      console.log('📝 Actualizando categoría:', { id: editModal.category.id, name: newName });
      
      const response = await updateCategoryService(editModal.category.id, newName);
      
      console.log('📥 Respuesta del servicio de actualización:', response);
      
      // Actualizar la categoría en el estado local
      setCategories(prev => 
        prev.map(cat => 
          cat.id === editModal.category.id 
            ? { ...cat, name: newName }
            : cat
        )
      );
      
      // Cerrar modal
      setEditModal({ isOpen: false, category: null });
      
      console.log('✅ Categoría actualizada exitosamente');
      
    } catch (error) {
      console.error('💥 Error al actualizar categoría:', error);
      
      let errorMessage = 'Error al actualizar la categoría.';
      
      if (error.response?.status === 401) {
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      } else if (error.response?.status === 404) {
        errorMessage = 'La categoría no existe.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para editar esta categoría.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Ya existe una categoría con este nombre.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setEditError(errorMessage);
      
    } finally {
      setEditing(false);
    }
  };

  /**
   * ✅ Eliminar categoría - IMPLEMENTADO CON SERVICIO REAL
   */
  const handleDeleteCategory = async (category) => {
    // Confirmación con información detallada
    const confirmMessage = 
      `¿Estás seguro de que quieres eliminar la categoría "${category.name}"?\n\n` +
      `⚠️ ADVERTENCIA: Esta acción no se puede deshacer y puede afectar contenido multimedia asociado.`;
      
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setDeleting(category.id);
      
      console.log('🗑️ Eliminando categoría:', category);
      
      // ✅ USAR SERVICIO REAL
      const response = await deleteCategoryService(category.id);
      
      console.log('📥 Respuesta del servicio de eliminación:', response);
      
      // ✅ El servicio devuelve directamente la data o lanza error
      // Si llegamos aquí, la eliminación fue exitosa
      
      console.log('✅ Categoría eliminada exitosamente');
      
      // Mostrar notificación de éxito
      alert(`✅ Categoría "${category.name}" eliminada exitosamente`);
      
      // Recargar lista para reflejar los cambios
      await loadCategories();
      
    } catch (error) {
      console.error('💥 Error al eliminar categoría:', error);
      
      // ✅ Manejar errores específicos del backend
      let errorMessage = `Error al eliminar la categoría "${category.name}".`;
      
      if (error.response?.status === 401) {
        // Sesión expirada
        console.log('🔒 Sesión expirada, redirigiendo...');
        sessionStorage.clear();
        navigate('/login');
        return;
      } else if (error.response?.status === 404) {
        errorMessage = 'La categoría no existe o ya fue eliminada.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar esta categoría.';
      } else if (error.response?.status === 409) {
        errorMessage = 'No se puede eliminar la categoría porque tiene contenido asociado.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Mostrar error al usuario
      alert(`❌ ${errorMessage}`);
      
    } finally {
      setDeleting(null);
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
  }, []);

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
        onClose={() => setEditModal({ isOpen: false, category: null })}
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