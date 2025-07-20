// ===== CATEGORIES CONTEXT - GESTIÓN CENTRALIZADA DE CATEGORÍAS =====
// src/app/context/CategoriesContext.jsx

import { createContext, useContext, useState, useCallback } from 'react';

// Servicios de categorías
import { getCategoriesService } from '../../services/Categories/getCategoriesService';
import { deleteCategoryService } from '../../services/Categories/deleteCategoryService';
import { updateCategoryService } from '../../services/Categories/updateCategoryService';
import { createCategoryService } from '../../services/Categories/createCategoryService';

// Hook para alerts
import { useAlertContext } from './AlertContext';

// ===== CONTEXTO =====
const CategoriesContext = createContext();

/**
 * CategoriesProvider - Proveedor del contexto de categorías
 * 
 * Centraliza toda la lógica de gestión de categorías:
 * - Estados de categorías, loading, errores
 * - Funciones CRUD principales
 * - Utilidades de formato y validación
 * - Manejo de sesión expirada
 * - Estadísticas de contenido
 */
function CategoriesProvider({ children }) {
  // ===== HOOKS =====
  const { showDeleteConfirm, showSuccess, showError } = useAlertContext();
  
  // ===== ESTADOS PRINCIPALES =====
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ===== ESTADOS DE EDICIÓN =====
  const [editing, setEditing] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, category: null });
  const [editError, setEditError] = useState(null);

  // ===== ESTADOS DE CREACIÓN =====
  const [creating, setCreating] = useState(false);

  // ===== FUNCIONES AUXILIARES =====

  /**
   * Formatear fecha de categoría en formato español
   */
  const formatCategoryDate = useCallback((dateString) => {
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
  }, []);

  // ===== FUNCIONES PRINCIPALES =====

  /**
   * Cargar categorías desde el backend
   */
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 [CategoriesContext] Cargando categorías...');
      const response = await getCategoriesService();
      
      console.log('📋 [CategoriesContext] Respuesta del servicio:', response);
      
      // El servicio existente devuelve directamente un array o lanza error
      const categoriesArray = Array.isArray(response) ? response : [];
      
      // Normalizar datos de categorías
      const normalizedCategories = categoriesArray.map(category => ({
        id: category.id,
        name: category.name || 'Sin nombre',
        createdAt: category.created_at || category.createdAt || null,
        updatedAt: category.updated_at || category.updatedAt || null
      }));

      console.log('✅ [CategoriesContext] Categorías normalizadas:', normalizedCategories);
      
      setCategories(normalizedCategories);
      
      console.log(`✅ [CategoriesContext] ${normalizedCategories.length} categorías cargadas`);
      
    } catch (error) {
      console.error('💥 [CategoriesContext] Error al cargar categorías:', error);
      
      // Manejar sesión expirada
      if (error.response?.status === 401) {
        console.log('🔒 [CategoriesContext] Sesión expirada');
        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
      }
      
      setError(error.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refrescar lista de categorías
   */
  const refreshCategories = useCallback(() => {
    console.log('🔄 [CategoriesContext] Refrescando categorías...');
    loadCategories();
  }, [loadCategories]);

  /**
   * Limpiar estado de categorías
   */
  const clearCategories = useCallback(() => {
    console.log('🧹 [CategoriesContext] Limpiando estado de categorías');
    setCategories([]);
    setError(null);
    setDeleting(null);
  }, []);

  /**
   * Eliminar categoría con validaciones completas
   */
  const deleteCategory = (category) => {
    console.log('🗑️ [CategoriesContext] Iniciando eliminación de categoría:', category);

    // ===== CONFIRMACIÓN CON ALERT PROVIDER =====
    // Usar AlertProvider en lugar de window.confirm
    showDeleteConfirm(
      category.name,
      async () => {
        await performDeleteCategory(category);
      },
      {
        title: 'Confirmar eliminación',
        confirmText: 'Eliminar categoría',
        cancelText: 'Cancelar'
      }
    );
  };

  /**
   * Ejecutar eliminación de categoría (función interna)
   */
  const performDeleteCategory = async (category) => {
    try {

      // ===== PROCESO DE ELIMINACIÓN =====
      setDeleting(category.id);
      console.log('🔄 [CategoriesContext] Eliminando categoría del backend:', category.id);

      const response = await deleteCategoryService(category.id);
      
      console.log('📥 [CategoriesContext] Respuesta del servicio de eliminación:', response);
      
      // ✅ VERIFICAR RESPUESTA ESTRUCTURADA
      if (!response.success) {
        throw new Error(response.error || 'Error al eliminar categoría');
      }
      
      console.log('✅ [CategoriesContext] Categoría eliminada exitosamente');
      
      // ===== ACTUALIZAR ESTADO LOCAL =====
      setCategories(prevCategories => {
        const updatedCategories = prevCategories.filter(c => c.id !== category.id);
        console.log(`✅ [CategoriesContext] Categoría eliminada. Categorías restantes: ${updatedCategories.length}`);
        return updatedCategories;
      });

      // Mostrar mensaje de éxito con AlertProvider
      showSuccess(`Categoría "${category.name}" eliminada exitosamente.`);

      return { 
        success: true, 
        message: `Categoría "${category.name}" eliminada exitosamente.` 
      };
      
    } catch (error) {
      console.error('💥 [CategoriesContext] Error al eliminar categoría:', error);
      
      let errorMessage = `Error al eliminar la categoría "${category.name}".`;
      
      if (error.response?.status === 401) {
        console.log('🔒 [CategoriesContext] Sesión expirada');
        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
      } else if (error.response?.status === 404) {
        errorMessage = 'La categoría no existe o ya fue eliminada.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tienes permisos para eliminar esta categoría.';
      } else if (error.response?.status === 409) {
        errorMessage = 'No se puede eliminar la categoría porque tiene contenido asociado.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setDeleting(null);
    }
  };

  /**
   * Actualizar categoría existente
   */
  const updateCategory = async (categoryId, newName) => {
    try {
      console.log('✏️ [CategoriesContext] Iniciando actualización de categoría:', { id: categoryId, name: newName });
      setEditing(true);
      setEditError(null);
      
      const response = await updateCategoryService(categoryId, newName);
      
      console.log('📥 [CategoriesContext] Respuesta del servicio de actualización:', response);
      
      // ===== ACTUALIZAR ESTADO LOCAL =====
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId 
            ? { ...cat, name: newName, updatedAt: new Date().toISOString() }
            : cat
        )
      );
      
      console.log('✅ [CategoriesContext] Categoría actualizada exitosamente');
      
      return { 
        success: true, 
        message: 'Categoría actualizada exitosamente' 
      };
      
    } catch (error) {
      console.error('💥 [CategoriesContext] Error al actualizar categoría:', error);
      
      let errorMessage = 'Error al actualizar la categoría.';
      
      if (error.response?.status === 401) {
        console.log('🔒 [CategoriesContext] Sesión expirada');
        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
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
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setEditing(false);
    }
  };

  /**
   * Crear nueva categoría
   */
  const createCategory = async (categoryData) => {
    try {
      console.log('🏗️ [CategoriesContext] Iniciando creación de categoría:', categoryData);
      setCreating(true);
      setError(null);

      // Validar que el nombre no esté vacío
      if (!categoryData.name || categoryData.name.trim() === '') {
        const error = 'El nombre de la categoría es requerido';
        console.warn('❌ [CategoriesContext] Validación fallida:', error);
        throw new Error(error);
      }

      // Validar que no exista una categoría con el mismo nombre
      const existingCategory = categories.find(cat => 
        cat.name.toLowerCase() === categoryData.name.toLowerCase().trim()
      );
      if (existingCategory) {
        const error = 'Ya existe una categoría con este nombre';
        console.warn('❌ [CategoriesContext] Validación fallida:', error);
        throw new Error(error);
      }

      const response = await createCategoryService(categoryData);
      
      console.log('📥 [CategoriesContext] Respuesta del servicio de creación:', response);

      // ===== ACTUALIZAR ESTADO LOCAL =====
      const newCategory = {
        id: response.id || response.data?.id,
        name: categoryData.name.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...response.data
      };

      setCategories(prevCategories => {
        const updatedCategories = [...prevCategories, newCategory];
        console.log(`✅ [CategoriesContext] Categoría agregada. Total categorías: ${updatedCategories.length}`);
        return updatedCategories;
      });

      console.log('✅ [CategoriesContext] Categoría creada exitosamente');
      return { 
        success: true, 
        data: newCategory,
        message: `Categoría "${categoryData.name}" creada exitosamente.` 
      };

    } catch (error) {
      console.error('💥 [CategoriesContext] Error al crear categoría:', error);
      
      let errorMessage = 'Error al crear la categoría.';
      
      if (error.response?.status === 401) {
        console.log('🔒 [CategoriesContext] Sesión expirada');
        sessionStorage.clear();
        throw new Error('SESSION_EXPIRED');
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Datos inválidos en el formulario.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Ya existe una categoría con este nombre.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setCreating(false);
    }
  };

  /**
   * Obtener estadísticas de categorías
   */
  const getCategoriesStats = useCallback(() => {
    const total = categories.length;
    const withLongNames = categories.filter(cat => cat.name && cat.name.length > 10).length;
    const withShortNames = categories.filter(cat => cat.name && cat.name.length <= 10).length;
    const recentlyCreated = categories.filter(cat => {
      if (!cat.createdAt) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(cat.createdAt) > weekAgo;
    }).length;

    return { 
      total, 
      withLongNames, 
      withShortNames, 
      recentlyCreated 
    };
  }, [categories]);

  /**
   * Obtener categoría por ID desde estado local
   */
  const getCategoryById = useCallback((categoryId) => {
    console.log('🔍 [CategoriesContext] Buscar categoría por ID:', categoryId);
    return categories.find(category => category.id.toString() === categoryId.toString()) || null;
  }, [categories]);

  // ===== FUNCIONES DE MODAL =====

  /**
   * Abrir modal de edición
   */
  const openEditModal = useCallback((category) => {
    console.log('✏️ [CategoriesContext] Abrir modal de edición:', category);
    setEditModal({ isOpen: true, category });
    setEditError(null);
  }, []);

  /**
   * Cerrar modal de edición
   */
  const closeEditModal = useCallback(() => {
    console.log('❌ [CategoriesContext] Cerrar modal de edición');
    setEditModal({ isOpen: false, category: null });
    setEditError(null);
  }, []);

  /**
   * Guardar cambios desde modal
   */
  const saveFromModal = async (newName) => {
    if (!editModal.category) return { success: false, error: 'No hay categoría seleccionada' };
    
    const result = await updateCategory(editModal.category.id, newName);
    
    if (result.success) {
      closeEditModal();
    }
    
    return result;
  };

  // ===== VALOR DEL CONTEXTO =====
  const value = {
    // Estados principales
    categories,
    loading,
    error,
    deleting,

    // Estados de edición
    editing,
    editModal,
    editError,

    // Estados de creación
    creating,

    // Funciones principales
    loadCategories,
    refreshCategories,
    clearCategories,
    deleteCategory,

    // Funciones CRUD
    createCategory,
    updateCategory,
    getCategoryById,

    // Funciones de modal
    openEditModal,
    closeEditModal,
    saveFromModal,

    // Utilidades
    formatCategoryDate,
    getCategoriesStats,

    // Estados internos para funciones futuras
    setCategories,
    setDeleting,
    setError,
    setEditing,
    setEditModal,
    setEditError,
    setCreating
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de categorías
 */
function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories debe usarse dentro de CategoriesProvider');
  }
  return context;
}

export { CategoriesContext, CategoriesProvider, useCategories };