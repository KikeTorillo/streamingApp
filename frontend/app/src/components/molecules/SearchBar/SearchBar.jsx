// SearchBar.jsx - Componente avanzado de búsqueda migrado al sistema estándar
import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '../TextInput/TextInput';
import { Icon } from '../../atoms/Icon/Icon';
import { validateStandardProps, STANDARD_PROP_TYPES } from '../../../tokens';
import './SearchBar.css';

/**
 * SearchBar - Componente avanzado de búsqueda del sistema de diseño
 * 
 * ✅ MIGRADO AL SISTEMA ESTÁNDAR - Enero 2025
 * 
 * ARQUITECTURA:
 * ✅ Usa TextInput (molécula migrada) del sistema estándar como base
 * ✅ Props estándar: size, variant, rounded, disabled, loading
 * ✅ Validación automática con validateStandardProps
 * ✅ STANDARD_PROP_TYPES integrado
 * ✅ Backward compatibility con deprecation warnings
 * 
 * VARIANTES DE BÚSQUEDA:
 * - simple: Solo input de búsqueda (retrocompatibilidad 100%)
 * - advanced: Con sugerencias, historial y shortcuts
 * 
 * FUNCIONALIDADES DE BÚSQUEDA:
 * ✅ Búsqueda con debounce optimizado
 * ✅ Sugerencias inteligentes con categorías
 * ✅ Historial persistente (localStorage)
 * ✅ Navegación por teclado (arrows, enter, escape)
 * ✅ Shortcuts globales (Ctrl+K)
 * ✅ Estados elegantes (loading, error, empty)
 * 
 * @param {Object} props - Props del componente
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño estándar del sistema
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante estándar
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='md'] - Radio de bordes estándar
 * @param {boolean} [props.disabled=false] - Estado deshabilitado estándar
 * @param {boolean} [props.loading=false] - Estado loading estándar
 * @param {'simple'|'advanced'} [props.searchVariant='simple'] - Variante de funcionalidad de búsqueda
 */
function SearchBar(props) {
  // ✅ VALIDAR PROPS ESTÁNDAR - Sistema unificado con deprecation warnings
  const validatedProps = validateStandardProps(props, 'SearchBar');
  
  const {
    // ✅ PROPS ESTÁNDAR DEL SISTEMA
    size = 'md',
    variant = 'primary',
    rounded = 'md',
    disabled = false,
    loading: loadingProp = false,
    className = '',
    
    // ✅ PROPS ESPECÍFICAS DE BÚSQUEDA
    searchVariant = 'simple', // Renamed para evitar conflicto con variant estándar
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
    error = null,
    
    // Props básicas del input
    value = '',
    onChange = () => {},
    placeholder = 'Buscar contenido...',
    onFocus = () => {},
    onBlur = () => {},
    onKeyDown = () => {},
    
    // Resto de props para TextInput
    ...textInputProps
  } = validatedProps;

  // ⚠️ BACKWARD COMPATIBILITY WARNING
  if (props.variant && !['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'].includes(props.variant)) {
    console.warn(
      `SearchBar: La prop 'variant="${props.variant}"' ya no se usa para variantes de búsqueda.
      Migración requerida:
      - variant="${props.variant}" → searchVariant="${props.variant}" (funcionalidad de búsqueda)
      - variant="primary" (nuevo prop estándar para colores)
      
      Ejemplo:
      // ANTES
      <SearchBar variant="advanced" />
      
      // DESPUÉS  
      <SearchBar searchVariant="advanced" variant="primary" size="md" />
      `
    );
  }
  
  // Determinar loading state combinado
  const loading = loadingProp || loadingSuggestions;
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
    if (searchVariant === 'advanced') {
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
    if (searchVariant === 'advanced' && (suggestions.length > 0 || (enableHistory && searchHistory.length > 0))) {
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
  
  // ✅ CONSTRUIR CLASES CSS - Sistema estándar + funcionalidad de búsqueda
  const searchBarClasses = [
    'search-bar',
    `search-bar--search-variant-${searchVariant}`,
    `search-bar--size-${size}`, // Clase estándar
    variant !== 'primary' && `search-bar--variant-${variant}`, // Clase estándar 
    rounded !== 'md' && `search-bar--rounded-${rounded}`, // Clase estándar
    showDropdown && 'search-bar--dropdown-open',
    loading && 'search-bar--loading',
    error && 'search-bar--error',
    disabled && 'search-bar--disabled',
    className
  ].filter(Boolean).join(' ');
  
  // ✅ LÓGICA DE ICONOS - Delegados al TextInput migrado
  const currentLeftIcon = loading ? 'loader' : 'search';
  const shouldShowClearIcon = (searchVariant === 'advanced' || searchVariant === 'simple') && internalValue && !loading;
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
      {/* ✅ TEXTINPUT DEL SISTEMA ESTÁNDAR */}
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
        
        // ✅ PROPS ESTÁNDAR DELEGADAS AL TEXTINPUT MIGRADO
        size={size}
        variant={error ? 'danger' : variant}
        rounded={rounded}
        disabled={disabled}
        loading={loading}
        
        // Props específicas de TextInput
        errorText={error}
        // className="search-bar__input" // Temporalmente removido para debug
        
        // Resto de props para TextInput
        {...textInputProps}
      />
      
      {/* Dropdown para variantes avanzadas */}
      {searchVariant === 'advanced' && showDropdown && (
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
      
      {/* ✅ ERROR MESSAGE - Ahora manejado por TextInput con errorText */}
      {/* No necesitamos renderizar error aquí, TextInput ya lo maneja */}
    </div>
  );
}

// ✅ PROPTYPES CON SISTEMA ESTÁNDAR
SearchBar.propTypes = {
  // ✅ PROPS ESTÁNDAR DEL SISTEMA
  ...STANDARD_PROP_TYPES,
  
  // ✅ PROPS ESPECÍFICAS DE SEARCHBAR
  searchVariant: PropTypes.oneOf(['simple', 'advanced']),
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
  error: PropTypes.string,
  
  // Props básicas (el resto se delegan al TextInput migrado)
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func
};

export { SearchBar };