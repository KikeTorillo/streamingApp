// molecules/SearchBar/SearchBar.jsx - SISTEMA V2 COMPLETO
import { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '../TextInput/TextInput';
import { Icon } from '../../atoms/Icon/Icon';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Typography } from '../../atoms/Typography/Typography';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { INTERACTIVE_PROP_TYPES, extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import './SearchBar.css';

/**
 * SearchBar - Componente avanzado de b�squeda - SISTEMA V2 COMPLETO
 * 
 *  SISTEMA V2 COMPLETO:
 * - useInteractiveProps con componentName
 * - INTERACTIVE_PROP_TYPES y extractDOMPropsV2
 * - Composici�n pura usando TextInput migrado V2
 * - Typography, Icon, FlexContainer del sistema
 * 
 * <� Funcionalidades:
 * - B�squeda con debounce optimizado
 * - Sugerencias inteligentes con categor�as
 * - Historial persistente (localStorage)
 * - Navegaci�n por teclado (arrows, enter, escape)
 * - Shortcuts globales (Ctrl+K)
 * - Estados elegantes (loading, error, empty)
 * 
 * @param {Object} props - Props del componente
 * @param {'simple'|'advanced'} [props.searchVariant='simple'] - Variante de funcionalidad
 * @param {function} [props.onSearch] - Callback de b�squeda
 * @param {function} [props.onClear] - Callback de limpiar
 * @param {number} [props.debounceMs=300] - Delay de debounce
 * @param {Array} [props.suggestions] - Array de sugerencias
 * @param {function} [props.onSuggestionSelect] - Callback de selecci�n
 * @param {boolean} [props.enableHistory=false] - Habilitar historial
 * @param {boolean} [props.enableShortcuts=false] - Habilitar shortcuts
 */
function SearchBar(props) {
  //  V2: Extraer props espec�ficas antes del hook
  const {
    // Props espec�ficas de SearchBar
    searchVariant = 'simple',
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
    
    // Estado espec�fico
    error = null,
    
    // Props b�sicas del input
    value = '',
    onChange = () => {},
    placeholder = 'Buscar contenido...',
    onFocus = () => {},
    onBlur = () => {},
    onKeyDown = () => {},
    
    // Props restantes para el hook V2
    ...restProps
  } = props;
  
  //  V2: Hook del sistema de dise�o
  const {
    size, variant, rounded, disabled, loading: loadingProp, className,
    generateStyles,
    ...standardProps
  } = useInteractiveProps(restProps, {
    componentName: 'SearchBar',
    defaultSize: 'md',
    defaultVariant: 'primary',
    defaultRounded: 'md'
  });
  
  //  V2: Props DOM v�lidas
  const domProps = extractDOMPropsV2(standardProps);
  
  // Estados internos
  const [internalValue, setInternalValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Referencias
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  
  // Estados combinados
  const loading = loadingProp || loadingSuggestions;
  
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
    onChange(e);
    
    // Funcionalidad espec�fica de b�squeda
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
    const searchValue = suggestion.value || suggestion.title || suggestion;
    setInternalValue(searchValue);
    setShowDropdown(false);
    setSelectedSuggestionIndex(-1);
    
    // Agregar al historial
    if (enableHistory) {
      addToHistory(searchValue);
    }
    
    onSuggestionSelect(suggestion, index);
    onSearch(searchValue);
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
    if (searchVariant === 'advanced' && (suggestions.length > 0 || (enableHistory && searchHistory.length > 0))) {
      setShowDropdown(true);
    }
    
    onFocus(e);
  };
  
  // Handle blur
  const handleBlur = (e) => {
    setTimeout(() => {
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
  
  // Iconos din�micos
  const currentLeftIcon = loading ? 'loader' : 'search';
  const shouldShowClearIcon = internalValue && !loading;
  const currentRightIcon = shouldShowClearIcon ? 'x' : undefined;
  
  //  V2: Construir clases CSS
  const searchBarClasses = [
    'search-bar',
    `search-bar--search-variant-${searchVariant}`,
    `search-bar--size-${size}`,
    variant !== 'primary' && `search-bar--variant-${variant}`,
    rounded !== 'md' && `search-bar--rounded-${rounded}`,
    showDropdown && 'search-bar--dropdown-open',
    loading && 'search-bar--loading',
    error && 'search-bar--error',
    disabled && 'search-bar--disabled',
    className
  ].filter(Boolean).join(' ');
  
  // Renderizar dropdown content
  const renderDropdownContent = () => {
    const hasContent = suggestions.length > 0 || (enableHistory && searchHistory.length > 0);
    
    if (!hasContent && !loadingSuggestions) {
      return (
        <div className="search-bar__dropdown-empty">
          {renderIcon('search')}
          <Typography size="sm" variant="neutral">
            Comienza a escribir para buscar
          </Typography>
        </div>
      );
    }
    
    if (loadingSuggestions) {
      return (
        <div className="search-bar__dropdown-loading">
          {renderIcon('loader')}
          <Typography size="sm" variant="neutral">
            Buscando sugerencias...
          </Typography>
        </div>
      );
    }
    
    let itemIndex = 0;
    
    return (
      <div className="search-bar__dropdown-content">
        {/* Sugerencias */}
        {suggestions.length > 0 && (
          <div className="search-bar__suggestions-section">
            <FlexContainer direction="row" align="center" gap="xs" className="search-bar__section-title">
              {renderIcon('zap')}
              <Typography size="sm" weight="medium" variant="neutral">
                Sugerencias
              </Typography>
            </FlexContainer>
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
                  {renderIcon('search')}
                  <Typography size="sm" className="search-bar__suggestion-text">
                    {suggestion.title || suggestion.value || suggestion}
                  </Typography>
                  {suggestion.category && (
                    <Typography size="xs" variant="neutral" className="search-bar__suggestion-category">
                      en {suggestion.category}
                    </Typography>
                  )}
                </button>
              );
            })}
          </div>
        )}
        
        {/* Historial */}
        {enableHistory && searchHistory.length > 0 && (
          <div className="search-bar__history-section">
            <FlexContainer direction="row" align="center" gap="xs" className="search-bar__section-title">
              {renderIcon('clock')}
              <Typography size="sm" weight="medium" variant="neutral">
                Búsquedas recientes
              </Typography>
            </FlexContainer>
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
                  {renderIcon('clock')}
                  <Typography size="sm">{historyItem}</Typography>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div 
      className={searchBarClasses} 
      ref={dropdownRef}
      style={generateStyles()}
      {...domProps}
    >
      {/*  V2: TextInput del sistema */}
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
        
        // Props est�ndar delegadas
        size={size}
        variant={error ? 'danger' : variant}
        rounded={rounded}
        disabled={disabled}
        loading={loading}
        
        // Props espec�ficas
        errorText={error}
        className="search-bar__input"
      />
      
      {/* Dropdown para variantes avanzadas */}
      {searchVariant === 'advanced' && showDropdown && (
        <div className="search-bar__dropdown">
          {renderDropdownContent()}
          
          {/* Shortcuts hint */}
          {enableShortcuts && (
            <div className="search-bar__shortcuts-hint">
              <Typography size="xs" variant="neutral">
                Presiona{' '}
                <kbd className="search-bar__kbd">
                  {shortcutModifier === 'ctrl' ? 'Ctrl' : shortcutModifier} + {shortcutKey.toUpperCase()}
                </kbd>
                {' '}para buscar
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  //  V2: Props est�ndar del sistema
  ...INTERACTIVE_PROP_TYPES,
  
  // Props espec�ficas de SearchBar
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
  
  // Estados espec�ficos
  error: PropTypes.string,
  
  // Props b�sicas
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func
};

export { SearchBar };