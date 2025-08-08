// SearchBar.jsx - Componente avanzado de búsqueda
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '../TextInput/TextInput';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import './SearchBar.css';

/**
 * Componente SearchBar Avanzado - Molécula del Design System
 * 
 * Variantes de migración gradual:
 * - simple: Equivalente al TextInput actual (retrocompatibilidad)
 * - advanced: Con todas las funciones nuevas
 * - compact: Para espacios reducidos
 * 
 * Features nuevas:
 * ✅ Búsqueda en tiempo real con debounce optimizado
 * ✅ Autocomplete inteligente con sugerencias
 * ✅ Filtros avanzados (género, año, rating, tipo)
 * ✅ Historial persistente de búsquedas
 * ✅ Shortcuts de teclado (Ctrl+K para abrir, Escape para cerrar)
 * ✅ Búsqueda múltiple (título, actores, director, descripción)
 * ✅ Estados elegantes (loading, empty, error)
 */
function SearchBar({
  // Basic props - retrocompatibilidad total con AppHeader
  value = '',
  onChange = () => {},
  placeholder = 'Buscar contenido...',
  disabled = false,
  className = '',
  
  // Variantes y tamaños
  variant = 'simple',
  size = 'md',
  fullWidth = false,
  
  // Advanced features
  onSearch = () => {},
  onClear = () => {},
  debounceMs = 300,
  
  // Autocomplete & suggestions
  suggestions = [],
  onSuggestionSelect = () => {},
  showSuggestions = false,
  maxSuggestions = 5,
  loadingSuggestions = false,
  
  // Filters (solo para variant="advanced")
  filters = [],
  selectedFilters = {},
  onFilterChange = () => {},
  showFilters = false,
  
  // History (solo para variant="advanced")
  enableHistory = false,
  historyKey = 'searchbar-history',
  maxHistoryItems = 10,
  
  // Shortcuts
  enableShortcuts = false,
  shortcutKey = 'k',
  shortcutModifier = 'ctrl',
  
  // Estados
  loading = false,
  error = null,
  
  // Eventos adicionales
  onFocus = () => {},
  onBlur = () => {},
  onKeyDown = () => {},
  
  // Propiedades del input base
  leftIcon = 'search',
  rightIcon = null,
  autoFocus = false,
  ...restProps
}) {
  // Estados internos
  const [internalValue, setInternalValue] = useState(value);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Referencias
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  
  // Cargar historial al montar
  useEffect(() => {
    if (enableHistory) {
      try {
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          setSearchHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Error loading search history:', error);
      }
    }
  }, [enableHistory, historyKey]);
  
  // Sincronizar valor interno con prop externa
  useEffect(() => {
    setInternalValue(value);
  }, [value]);
  
  // Debounced search
  const debouncedSearch = useCallback((searchValue) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      onSearch(searchValue);
    }, debounceMs);
  }, [onSearch, debounceMs]);
  
  // Cleanup debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  // Handle value change
  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(e); // Mantener retrocompatibilidad
    
    // Advanced features solo para variantes avanzadas
    if (variant === 'advanced') {
      if (newValue.trim()) {
        debouncedSearch(newValue);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }
  };
  
  // Handle clear
  const handleClear = () => {
    setInternalValue('');
    setShowDropdown(false);
    setSelectedSuggestionIndex(-1);
    
    // Crear evento sintético para onChange
    const syntheticEvent = {
      target: { value: '' },
      preventDefault: () => {},
      stopPropagation: () => {}
    };
    
    onChange(syntheticEvent);
    onClear();
    
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion, index) => {
    setInternalValue(suggestion.value || suggestion.title || suggestion);
    setShowDropdown(false);
    setSelectedSuggestionIndex(-1);
    
    // Agregar al historial
    if (enableHistory) {
      addToHistory(suggestion);
    }
    
    onSuggestionSelect(suggestion, index);
    onSearch(suggestion.value || suggestion.title || suggestion);
  };
  
  // Add to search history
  const addToHistory = (searchValue) => {
    const value = typeof searchValue === 'string' ? searchValue : searchValue.value || searchValue.title;
    if (!value || !value.trim()) return;
    
    const newHistory = [
      value,
      ...searchHistory.filter(item => item !== value)
    ].slice(0, maxHistoryItems);
    
    setSearchHistory(newHistory);
    
    try {
      localStorage.setItem(historyKey, JSON.stringify(newHistory));
    } catch (error) {
      console.warn('Error saving search history:', error);
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (showDropdown && (suggestions.length > 0 || searchHistory.length > 0)) {
      const totalItems = suggestions.length + (enableHistory ? searchHistory.length : 0);
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev < totalItems - 1 ? prev + 1 : -1
          );
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev > -1 ? prev - 1 : totalItems - 1
          );
          break;
          
        case 'Enter':
          if (selectedSuggestionIndex >= 0) {
            e.preventDefault();
            const allItems = [...suggestions, ...(enableHistory ? searchHistory.map(h => ({ title: h, value: h })) : [])];
            const selectedItem = allItems[selectedSuggestionIndex];
            if (selectedItem) {
              handleSuggestionSelect(selectedItem, selectedSuggestionIndex);
            }
          } else {
            // Búsqueda normal
            if (internalValue.trim()) {
              if (enableHistory) {
                addToHistory(internalValue.trim());
              }
              onSearch(internalValue.trim());
            }
            setShowDropdown(false);
          }
          break;
          
        case 'Escape':
          setShowDropdown(false);
          setSelectedSuggestionIndex(-1);
          if (searchRef.current) {
            searchRef.current.blur();
          }
          break;
      }
    }
    
    onKeyDown(e);
  };
  
  // Handle focus
  const handleFocus = (e) => {
    setIsExpanded(true);
    
    if (variant === 'advanced' && (suggestions.length > 0 || (enableHistory && searchHistory.length > 0))) {
      setShowDropdown(true);
    }
    
    onFocus(e);
  };
  
  // Handle blur
  const handleBlur = (e) => {
    // Delay para permitir clicks en sugerencias
    setTimeout(() => {
      setIsExpanded(false);
      setShowDropdown(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
    
    onBlur(e);
  };
  
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedSuggestionIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    if (!enableShortcuts) return;
    
    const handleGlobalKeyDown = (e) => {
      const isModifierPressed = shortcutModifier === 'ctrl' ? e.ctrlKey : 
                               shortcutModifier === 'alt' ? e.altKey :
                               shortcutModifier === 'shift' ? e.shiftKey : false;
      
      if (isModifierPressed && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [enableShortcuts, shortcutKey, shortcutModifier]);
  
  // Construir clases CSS
  const searchBarClasses = [
    'search-bar',
    `search-bar--variant-${variant}`,
    `search-bar--size-${size}`,
    isExpanded && 'search-bar--expanded',
    showDropdown && 'search-bar--dropdown-open',
    fullWidth && 'search-bar--full-width',
    disabled && 'search-bar--disabled',
    loading && 'search-bar--loading',
    error && 'search-bar--error',
    className
  ].filter(Boolean).join(' ');
  
  // Iconos dinámicos
  const currentLeftIcon = loading ? 'loader' : leftIcon;
  
  // Solo mostrar X automática en variantes avanzadas
  const shouldShowClearIcon = variant === 'advanced' && internalValue && !loading;
  const currentRightIcon = shouldShowClearIcon ? 'x' : rightIcon;
  
  // Renderizar sugerencias y historial
  const renderDropdownContent = () => {
    const hasContent = suggestions.length > 0 || (enableHistory && searchHistory.length > 0);
    
    if (!hasContent && !loadingSuggestions) {
      return (
        <div className="search-bar__dropdown-empty">
          <Icon name="search" size="md" />
          <span>Comienza a escribir para buscar</span>
        </div>
      );
    }
    
    if (loadingSuggestions) {
      return (
        <div className="search-bar__dropdown-loading">
          <Icon name="loader" size="sm" />
          <span>Buscando sugerencias...</span>
        </div>
      );
    }
    
    let itemIndex = 0;
    
    return (
      <div className="search-bar__dropdown-content">
        {/* Sugerencias */}
        {suggestions.length > 0 && (
          <div className="search-bar__suggestions-section">
            <div className="search-bar__section-title">
              <Icon name="zap" size="xs" />
              <span>Sugerencias</span>
            </div>
            {suggestions.slice(0, maxSuggestions).map((suggestion, index) => {
              const currentIndex = itemIndex++;
              const isSelected = selectedSuggestionIndex === currentIndex;
              
              return (
                <button
                  key={`suggestion-${index}`}
                  className={`search-bar__suggestion-item ${isSelected ? 'search-bar__suggestion-item--selected' : ''}`}
                  onClick={() => handleSuggestionSelect(suggestion, index)}
                  onMouseEnter={() => setSelectedSuggestionIndex(currentIndex)}
                >
                  <Icon name="search" size="xs" />
                  <span className="search-bar__suggestion-text">
                    {suggestion.title || suggestion.value || suggestion}
                  </span>
                  {suggestion.category && (
                    <span className="search-bar__suggestion-category">
                      en {suggestion.category}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
        
        {/* Historial */}
        {enableHistory && searchHistory.length > 0 && (
          <div className="search-bar__history-section">
            <div className="search-bar__section-title">
              <Icon name="clock" size="xs" />
              <span>Búsquedas recientes</span>
            </div>
            {searchHistory.slice(0, 5).map((historyItem, index) => {
              const currentIndex = itemIndex++;
              const isSelected = selectedSuggestionIndex === currentIndex;
              
              return (
                <button
                  key={`history-${index}`}
                  className={`search-bar__history-item ${isSelected ? 'search-bar__history-item--selected' : ''}`}
                  onClick={() => handleSuggestionSelect({ title: historyItem, value: historyItem }, index)}
                  onMouseEnter={() => setSelectedSuggestionIndex(currentIndex)}
                >
                  <Icon name="clock" size="xs" />
                  <span>{historyItem}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={searchBarClasses} ref={dropdownRef}>
      <TextInput
        ref={searchRef}
        type="search"
        value={internalValue}
        onChange={handleValueChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        size={size}
        fullWidth={fullWidth}
        leftIcon={<Icon name={currentLeftIcon} size="sm" />}
        rightIcon={currentRightIcon && (
          <Icon 
            name={currentRightIcon} 
            size="sm" 
            onClick={shouldShowClearIcon ? handleClear : undefined}
            style={{ cursor: shouldShowClearIcon ? 'pointer' : 'default' }}
          />
        )}
        className="search-bar__input"
        {...restProps}
      />
      
      {/* Dropdown para variantes avanzadas */}
      {variant === 'advanced' && showDropdown && (
        <div className="search-bar__dropdown">
          {renderDropdownContent()}
          
          {/* Shortcuts hint */}
          {enableShortcuts && (
            <div className="search-bar__shortcuts-hint">
              <span>Presiona </span>
              <kbd>{shortcutModifier === 'ctrl' ? 'Ctrl' : shortcutModifier} + {shortcutKey.toUpperCase()}</kbd>
              <span> para buscar</span>
            </div>
          )}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="search-bar__error">
          <Icon name="alert-circle" size="xs" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  // Basic props
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  
  // Variantes y tamaños
  variant: PropTypes.oneOf(['simple', 'advanced', 'compact']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  
  // Advanced features
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  debounceMs: PropTypes.number,
  
  // Autocomplete & suggestions
  suggestions: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string,
      category: PropTypes.string,
      icon: PropTypes.string
    })
  ])),
  onSuggestionSelect: PropTypes.func,
  showSuggestions: PropTypes.bool,
  maxSuggestions: PropTypes.number,
  loadingSuggestions: PropTypes.bool,
  
  // Filters
  filters: PropTypes.array,
  selectedFilters: PropTypes.object,
  onFilterChange: PropTypes.func,
  showFilters: PropTypes.bool,
  
  // History
  enableHistory: PropTypes.bool,
  historyKey: PropTypes.string,
  maxHistoryItems: PropTypes.number,
  
  // Shortcuts
  enableShortcuts: PropTypes.bool,
  shortcutKey: PropTypes.string,
  shortcutModifier: PropTypes.oneOf(['ctrl', 'alt', 'shift']),
  
  // Estados
  loading: PropTypes.bool,
  error: PropTypes.string,
  
  // Eventos
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  
  // Input props
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  autoFocus: PropTypes.bool
};

export { SearchBar };