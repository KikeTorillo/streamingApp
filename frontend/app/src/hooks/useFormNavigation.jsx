// hooks/useFormNavigation.jsx
import { useState } from 'react';

/**
 * Hook para manejar la navegación entre vista de búsqueda y formulario
 * Centraliza la lógica común entre MovieCreatePage y SeriesCreatePage
 */
const useFormNavigation = () => {
  const [currentView, setCurrentView] = useState('search'); // 'search' | 'form'
  const [selectedItem, setSelectedItem] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Manejar selección desde TMDB
  const handleSelectFromTMDB = (item, contentType = 'movie') => {
    // Emoji para logging futuro
    const emoji = contentType === 'movie' ? '🎬' : '📺';
    console.log(`${emoji} Selected item from TMDB:`, item);

    setSelectedItem(item);
    setCurrentView('form');
    setHasChanges(false);
  };

  // Manejar creación manual
  const handleManualCreate = () => {

    setSelectedItem(null);
    setCurrentView('form');
    setHasChanges(false);
  };

  // Manejar vuelta a búsqueda
  const handleBackToSearch = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        '⚠️ Hay cambios sin guardar. ¿Estás seguro de que quieres volver? Se perderán los cambios no guardados.'
      );
      if (!confirmLeave) return;
    }

    setSelectedItem(null);
    setCurrentView('search');
    setHasChanges(false);
  };

  // Marcar que hay cambios en el formulario
  const markAsChanged = () => {
    setHasChanges(true);
  };

  // Resetear estado tras éxito
  const resetNavigation = () => {
    setHasChanges(false);
  };

  return {
    // Estados
    currentView,
    selectedItem,
    hasChanges,
    
    // Handlers
    handleSelectFromTMDB,
    handleManualCreate,
    handleBackToSearch,
    markAsChanged,
    resetNavigation
  };
};

export { useFormNavigation };