// SearchBar.jsx - Componente avanzado de búsqueda
import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '../TextInput/TextInput';
import { Icon } from '../../atoms/Icon/Icon';
import './SearchBar.css';

/**
 * 
 * DISEÑO:
 * ✅ Delega TODA la funcionalidad de input al TextInput
 * ✅ Solo maneja funcionalidad específica de búsqueda
 * ✅ Elimina duplicación de código
 * ✅ Mantiene retrocompatibilidad completa
 * 
 * Variantes:
 * - simple: Solo input de búsqueda (retrocompatibilidad)
 * - advanced: Con sugerencias, historial y shortcuts
 * 
 * Features específicas de búsqueda:
 * ✅ Búsqueda con debounce optimizado
 * ✅ Sugerencias inteligentes
 * ✅ Historial persistente
 * ✅ Navegación con teclado
 * ✅ Shortcuts globales
 */
function SearchBar({
  // Props específicas de búsqueda
  variant = 'simple',
  onSearch = () => {},
  onClear = () => {},
  debounceMs = 300,
  
  // Sugerencias
  suggestions = [],
  onSuggestionSelect = () => {},
  maxSuggestions = 5,
  loadingSuggestions = false,
  
  // Historial
  enableHistory = false,
  historyKey = 'searchbar-history',
  maxHistoryItems = 10,
  
  // Shortcuts
  enableShortcuts = false,
  shortcutKey = 'k',
  shortcutModifier = 'ctrl',
  
  // Estado específico de búsqueda
  loading = false,
  error = null,
  
  // TODAS las demás props se delegan al TextInput
  value = '',
  onChange = () => {},
  placeholder = 'Buscar contenido...',
  onFocus = () => {},
  onBlur = () => {},
  onKeyDown = () => {},
  ...textInputProps // Todo lo demás va al TextInput
}) {
  // Estados internos - Solo para funcionalidad de búsqueda
  const [internalValue, setInternalValue] = useState(value);
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
  
  // Handle value change - Solo lógica específica de búsqueda
  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(e); // Delegamos al prop original
    
    // Funcionalidad específica de búsqueda
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
  
  // Handle focus - Solo lógica de búsqueda
  const handleFocus = (e) => {
    if (variant === 'advanced' && (suggestions.length > 0 || (enableHistory && searchHistory.length > 0))) {
      setShowDropdown(true);
    }
    
    onFocus(e); // Delegamos al prop original
  };
  
  // Handle blur - Solo lógica de búsqueda
  const handleBlur = (e) => {
    // Delay para permitir clicks en sugerencias
    setTimeout(() => {
      setShowDropdown(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
    
    onBlur(e); // Delegamos al prop original
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
  
  // Construir clases CSS - Solo para funcionalidad de búsqueda
  const searchBarClasses = [
    'search-bar',
    `search-bar--variant-${variant}`,
    showDropdown && 'search-bar--dropdown-open',
    loading && 'search-bar--loading',
    error && 'search-bar--error'
  ].filter(Boolean).join(' ');
  
  // Lógica de iconos - Delegamos la mayor parte al TextInput
  const currentLeftIcon = loading ? 'loader' : 'search';
  const shouldShowClearIcon = (variant === 'advanced' || variant === 'simple') && internalValue && !loading;
  const currentRightIcon = shouldShowClearIcon ? 'x' : undefined;
  
  // Renderizar sugerencias y historial
  const renderDropdownContent = () => {
    const hasContent = suggestions.length > 0 || (enableHistory && searchHistory.length > 0);
    
    if (!hasContent && !loadingSuggestions) {
      return (
        <div className="search-bar__dropdown-empty">
          <Icon name="search" size="sm" />
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
              <Icon name="zap" size="sm" />
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
                  <Icon name="search" size="sm" />
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
              <Icon name="clock" size="sm" />
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
                  <Icon name="clock" size="sm" />
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
        type="text"
        value={internalValue}
        onChange={handleValueChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        leftIcon={currentLeftIcon}
        rightIcon={currentRightIcon}
        onRightIconClick={shouldShowClearIcon ? handleClear : undefined}
        className="search-bar__input"
        // DELEGAR TODO lo demás al TextInput
        {...textInputProps}
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
          <Icon name="alert" size="sm" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  // Props específicas de SearchBar
  variant: PropTypes.oneOf(['simple', 'advanced']),
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  debounceMs: PropTypes.number,
  
  // Sugerencias
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
  maxSuggestions: PropTypes.number,
  loadingSuggestions: PropTypes.bool,
  
  // Historial
  enableHistory: PropTypes.bool,
  historyKey: PropTypes.string,
  maxHistoryItems: PropTypes.number,
  
  // Shortcuts
  enableShortcuts: PropTypes.bool,
  shortcutKey: PropTypes.string,
  shortcutModifier: PropTypes.oneOf(['ctrl', 'alt', 'shift']),
  
  // Estados específicos de búsqueda
  loading: PropTypes.bool,
  error: PropTypes.string,
  
  // Props básicas (el resto se delegan al TextInput)
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func
};

export { SearchBar };