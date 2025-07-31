// ===== CATEGORY CREATE PAGE - MIGRADO A CONTAINER COMPONENT =====
// src/Pages/Admin/Categories/CategoryCreatePage/CategoryCreatePage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../components/templates/AdminLayout/AdminLayout';
import { Container } from '../../../../components/atoms/Container/Container';
import { DynamicForm } from '../../../../components/molecules/DynamicForm/DynamicForm';
import { Button } from '../../../../components/atoms/Button/Button';
import { useSuccessRedirect } from '../../../../hooks/useSuccessRedirect';
import './CategoryCreatePage.css';

// Contexto de categorías
import { useCategories } from '../../../../app/context/CategoriesContext';
import { filterEmptyFields } from '../../../../utils/formUtils';

/**
 * CategoryCreatePage - MIGRADO A CONTAINER COMPONENT
 * 
 * ✅ CONTAINER: Usa <Container size="sm" /> para formularios
 * ✅ EQUIVALENCIA: Container SM = optimal para formularios simples
 * ✅ CONSISTENCIA: Homologado con MovieCreatePage y UserCreatePage  
 * ✅ SISTEMA: 100% componentes con stories de Storybook
 * ✅ BACKEND: Campos según schema del backend (solo name)
 */
function CategoryCreatePage() {
  const navigate = useNavigate();

  // ===== CONTEXTO DE CATEGORÍAS =====
  const {
    creating,
    error: contextError,
    createCategory
  } = useCategories();

  // ===== ESTADOS LOCALES =====
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // ===== HOOK DE ÉXITO HOMOLOGADO =====
  const { triggerSuccess } = useSuccessRedirect('/admin/categories');

  // Usar loading del contexto
  const loading = creating;

  // ===== CONFIGURACIÓN HOMOLOGADA CON BACKEND =====
  
  /**
   * Campos según schema del backend: solo `name` (string, max 100 chars)
   */
  const categoryFormFields = [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre de la Categoría',
      placeholder: 'Ej: Acción, Drama, Comedia, Documental...',
      required: true,
      leftIcon: '🎭',
      helperText: 'Máximo 100 caracteres. Debe ser único y descriptivo para facilitar la organización del contenido.',
      maxLength: 100,
      validation: {
        minLength: { value: 2, message: 'Mínimo 2 caracteres' },
        maxLength: { value: 100, message: 'Máximo 100 caracteres' },
        required: { value: true, message: 'El nombre es obligatorio' },
        pattern: {
          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-&()]{2,100}$/,
          message: 'Solo letras, espacios, guiones, & y paréntesis'
        }
      },
      width: 'full',
      autoFocus: true
    }
  ];

  /**
   * Datos iniciales vacíos
   */
  const initialData = {
    name: ''
  };

  // ===== FUNCIONES =====

  /**
   * Limpiar errores
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Navegar de vuelta
   */
  const handleGoBack = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }
    
    navigate('/admin/categories');
  };

  /**
   * Detectar cambios en el formulario
   */
  const handleFormChange = (formData) => {
    const hasData = Object.values(formData).some(value => 
      value && value.toString().trim() !== ''
    );
    setHasChanges(hasData);
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      clearError();
    }
  };

  /**
   * Enviar formulario - USANDO CONTEXTO
   */
  const handleSubmit = async (formData) => {
    // Limpiar estados previos
    setError(null);

    try {

      // Preparar datos para el backend usando utility
      const categoryData = filterEmptyFields(formData);

      const result = await createCategory(categoryData);

      if (result.success) {

        // Usar hook homologado de éxito
        triggerSuccess('¡Categoría creada exitosamente!');
        setHasChanges(false);

      } else if (result.error === 'SESSION_EXPIRED') {

        navigate('/login');
        return;
      } else {
        // Error del contexto
        throw new Error(result.error || 'Error inesperado al crear la categoría');
      }

    } catch (err) {

      if (err.message === 'SESSION_EXPIRED') {

        navigate('/login');
        return;
      }
      
      // Formatear error para el usuario
      let errorMessage = 'Error inesperado al crear la categoría';
      
      if (err.message) {
        errorMessage = err.message;
      }

      // Manejo específico de errores comunes
      if (errorMessage.includes('duplicate') || errorMessage.includes('ya existe')) {
        errorMessage = 'Ya existe una categoría con ese nombre. Elige un nombre diferente.';
      } else if (errorMessage.includes('validation')) {
        errorMessage = 'Los datos ingresados no son válidos. Revisa el formulario.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu internet e inténtalo de nuevo.';
      }
      
      setError(errorMessage);
    }
  };

  // ===== RENDER =====
  return (
    <AdminLayout
      title="Crear Nueva Categoría"
      subtitle="Agregar una nueva categoría para organizar el contenido multimedia"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Categorías', href: '/admin/categories' },
        { label: 'Crear Categoría' }
      ]}
    >
      {/* 🎯 CONTENEDOR PRINCIPAL - MIGRADO A CONTAINER COMPONENT */}
      <Container 
        size="lg" 
        variant="default"
      >
        
        {/* Header Actions */}
          <Button
            variant="outline"
            size="sm"
            leftIcon="←"
            onClick={handleGoBack}
            disabled={loading}
          >
            Volver a Categorías
          </Button>

        {/* Mensaje de Error */}
        {(error || contextError) && (
          <div className="status-message status-message--error">
            <span className="status-message__icon">⚠️</span>
            <div className="status-message__content">
              <strong>Error al crear categoría</strong>
              <span>{error || contextError}</span>
            </div>
          </div>
        )}

        {/* Header del Formulario */}
        <div className="form-header">
          <h2 className="form-title">
            🎭 Nueva Categoría
          </h2>
          <p className="form-description">
            Las categorías ayudan a organizar y clasificar el contenido multimedia. 
            Elige un nombre descriptivo que represente claramente el tipo de contenido 
            que agrupará (Ej: Acción, Drama, Comedia, Documental).
          </p>
        </div>

        {/* Formulario Dinámico */}
        <DynamicForm
          id="category-create-form"
          fields={categoryFormFields}
          initialData={initialData}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
          loading={loading}
          disabled={loading}
          columnsPerRow={1}
          tabletColumns={1}
          mobileColumns={1}
          fieldSize="lg"
          fieldRounded="md"
          submitText={loading ? "Creando Categoría..." : "Crear Categoría"}
          submitVariant="primary"
          submitSize="md"
          submitIcon="🎭"
          validateOnBlur={true}
          validateOnChange={false}
          className="category-form"
        />

        {/* Información adicional sobre categorías */}
        <div className="form-footer">
          <div className="info-card">
            <h4>💡 Consejos para crear categorías</h4>
            <ul>
              <li><strong>Nombres claros:</strong> Usa términos conocidos como &quot;Acción&quot;, &quot;Drama&quot;, &quot;Comedia&quot;</li>
              <li><strong>Evita duplicados:</strong> Revisa las categorías existentes antes de crear nuevas</li>
              <li><strong>Sé específico:</strong> &quot;Documentales de Naturaleza&quot; es mejor que solo &quot;Documentales&quot;</li>
              <li><strong>Mantén consistencia:</strong> Usa un criterio similar al nombrar categorías relacionadas</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h4>📊 Datos técnicos</h4>
            <ul>
              <li>Longitud mínima: 2 caracteres</li>
              <li>Longitud máxima: 100 caracteres</li>
              <li>Caracteres permitidos: letras, espacios, guiones, & y paréntesis</li>
              <li>Los nombres deben ser únicos en el sistema</li>
            </ul>
          </div>
        </div>

      </Container>
    </AdminLayout>
  );
}

export { CategoryCreatePage };