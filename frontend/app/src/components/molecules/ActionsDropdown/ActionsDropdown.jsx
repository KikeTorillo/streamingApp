// ===== ACTIONS DROPDOWN COMPONENT - V2.0 UNIVERSAL =====
// src/components/molecules/ActionsDropdown/ActionsDropdown.jsx

import { useState, useEffect, useRef, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import './ActionsDropdown.css';

/**
 * ActionsDropdown - Menú desplegable universal de acciones
 * 
 * ✅ SISTEMA V2.0: Hook estándar + Props API universal + CSS tokens
 * ✅ UNIVERSAL: Configurable para cualquier conjunto de acciones
 * ✅ ACCESIBLE: ARIA completo + navegación por teclado + focus management
 * ✅ RESPONSIVE: Auto-posicionamiento inteligente
 * 
 * @param {Object} props - Props del componente
 * @param {Array} props.actions - Array de acciones [{label, icon, onClick, variant, disabled, key, description, shortcut}]
 * @param {Object} props.triggerData - Datos pasados a callbacks (onOpen, onClose, action.onClick)
 * @param {string} props.triggerIcon - Ícono del trigger button
 * @param {string} props.triggerLabel - Label del trigger button (para accesibilidad)
 * @param {string} props.position - Posición del menu ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'auto']
 * @param {function} props.onOpen - Callback cuando se abre el menu
 * @param {function} props.onClose - Callback cuando se cierra el menu
 * @param {boolean} props.closeOnAction - Si cerrar automáticamente al hacer click en acción
 * @param {string} props.menuClassName - Clase CSS adicional para el menú
 * @param {Object} props.menuStyle - Estilos inline adicionales para el menú
 */
function ActionsDropdown(props) {
  // ===== HOOK ESTÁNDAR V2.0 =====
  const standardProps = useInteractiveProps(props, {
    componentName: 'ActionsDropdown',
    defaultSize: 'sm',
    defaultVariant: 'ghost'
  });

  const {
    size, variant, rounded, disabled, loading, className,
    tokens, renderIcon, ...restProps
  } = standardProps;

  // ===== PROPS ESPECÍFICAS (desde props originales) =====
  const {
    actions = [],
    triggerData = {},
    triggerIcon = 'more-vertical',
    triggerLabel = 'Acciones',
    position = 'bottom-right',
    onOpen,
    onClose,
    closeOnAction = true,
    menuClassName = '',
    menuStyle = {},
    children
  } = props;

  // ===== DOM PROPS FILTERING =====
  const domProps = extractDOMPropsV2(restProps);
  
  // ===== ESTADOS =====
  const [isOpen, setIsOpen] = useState(false);
  
  // ===== REFS =====
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // ===== CSS CLASES MANUALES =====
  const dropdownClasses = [
    'actions-dropdown',
    `actions-dropdown--${size}`,
    `actions-dropdown--${variant}`,
    isOpen && 'actions-dropdown--open',
    disabled && 'actions-dropdown--disabled',
    loading && 'actions-dropdown--loading',
    className
  ].filter(Boolean).join(' ');

  const menuClasses = [
    'actions-dropdown__menu',
    `actions-dropdown__menu--${position}`,
    `actions-dropdown__menu--${size}`,
    menuClassName
  ].filter(Boolean).join(' ');

  // ===== FUNCIONES DE MANEJO =====
  
  /**
   * Auto-posicionamiento inteligente
   */
  const calculatePosition = useCallback(() => {
    const menu = menuRef.current;
    const trigger = triggerRef.current;
    
    if (!menu || !trigger) return;

    // Detectar si está dentro de una tabla o contenedor con overflow
    const isInTable = trigger.closest('table, .data-table, .users-list__table');
    const hasOverflowParent = trigger.closest('.overflow-hidden, .overflow-auto, .overflow-x-auto, .overflow-y-auto');
    
    if (isInTable || hasOverflowParent || position === 'auto') {
      // Usar position fixed y calcular posición automáticamente
      const triggerRect = trigger.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      // Calcular espacios disponibles
      const spaces = {
        top: triggerRect.top,
        bottom: viewport.height - triggerRect.bottom,
        left: triggerRect.left,
        right: viewport.width - triggerRect.right
      };
      
      // Reset estilos previos
      menu.style.position = 'fixed';
      menu.style.zIndex = tokens.zIndex || '1002';
      menu.style.top = 'auto';
      menu.style.bottom = 'auto';
      menu.style.left = 'auto';
      menu.style.right = 'auto';
      
      // Determinar posición vertical (auto o respetando posición)
      const preferBottom = position.includes('bottom') || position === 'auto';
      const useBottom = preferBottom ? 
        (spaces.bottom >= menuRect.height || spaces.bottom >= spaces.top) :
        (spaces.top < menuRect.height && spaces.bottom >= spaces.top);
      
      if (useBottom) {
        menu.style.top = `${triggerRect.bottom + 4}px`;
      } else {
        menu.style.bottom = `${viewport.height - triggerRect.top + 4}px`;
      }
      
      // Determinar posición horizontal (auto o respetando posición)
      const preferRight = position.includes('right') || position === 'auto';
      const useRight = preferRight ?
        (spaces.right >= menuRect.width || spaces.right >= spaces.left) :
        (spaces.left < menuRect.width && spaces.right >= spaces.left);
      
      if (useRight) {
        menu.style.right = `${viewport.width - triggerRect.right}px`;
      } else {
        menu.style.left = `${triggerRect.left}px`;
      }
    }
  }, [position, tokens.zIndex]);

  /**
   * Abrir el menú
   */
  const handleOpen = useCallback(() => {
    if (disabled || loading || isOpen) return;
    
    setIsOpen(true);
    onOpen?.(triggerData);
    
    // Calcular posición después del render
    setTimeout(() => {
      calculatePosition();
      
      // Focus al primer item habilitado
      const firstItem = menuRef.current?.querySelector('.actions-dropdown__item:not(:disabled)');
      firstItem?.focus();
    }, 10);
  }, [disabled, loading, isOpen, onOpen, triggerData, calculatePosition]);

  /**
   * Cerrar el menú
   */
  const handleClose = useCallback(() => {
    if (!isOpen) return;
    
    setIsOpen(false);
    onClose?.(triggerData);
    
    // Retornar focus al trigger
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 50);
  }, [isOpen, onClose, triggerData]);

  /**
   * Toggle del menú
   */
  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleClose, handleOpen]);

  /**
   * Ejecutar acción y cerrar menú (si closeOnAction es true)
   */
  const handleActionClick = useCallback((action) => {
    try {
      action.onClick?.(triggerData);
    } catch (error) {
      console.error('Error al ejecutar acción:', error);
    }
    
    if (closeOnAction) {
      handleClose();
    }
  }, [triggerData, closeOnAction, handleClose]);

  // ===== EFECTOS =====
  
  /**
   * Manejo de clicks fuera del componente
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  /**
   * Manejo de teclas (ESC para cerrar, flechas para navegar)
   */
  useEffect(() => {
    function handleKeyDown(event) {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          handleClose();
          break;
        
        case 'ArrowDown': {
          event.preventDefault();
          const items = menuRef.current?.querySelectorAll('.actions-dropdown__item:not(:disabled)');
          const currentIndex = Array.from(items || []).indexOf(document.activeElement);
          const nextIndex = currentIndex < (items?.length || 0) - 1 ? currentIndex + 1 : 0;
          items?.[nextIndex]?.focus();
          break;
        }
        
        case 'ArrowUp': {
          event.preventDefault();
          const items = menuRef.current?.querySelectorAll('.actions-dropdown__item:not(:disabled)');
          const currentIndex = Array.from(items || []).indexOf(document.activeElement);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : (items?.length || 1) - 1;
          items?.[prevIndex]?.focus();
          break;
        }

        case 'Enter':
        case ' ':
          if (document.activeElement?.classList.contains('actions-dropdown__item')) {
            event.preventDefault();
            document.activeElement.click();
          }
          break;
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // ===== RENDER =====
  
  // Si no hay acciones, no renderizar nada
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div 
      className={dropdownClasses}
      style={{
        '--dropdown-z-index': tokens.zIndex,
        '--dropdown-border-radius': tokens.rounded,
        '--dropdown-shadow': tokens.shadow
      }}
      ref={dropdownRef}
      {...domProps}
    >
      {/* ===== TRIGGER BUTTON ===== */}
      <Button
        ref={triggerRef}
        size={size}
        variant={variant}
        rounded={rounded}
        disabled={disabled || loading}
        loading={loading}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={triggerLabel}
        className="actions-dropdown__trigger"
        iconOnly={true}
        leftIcon={triggerIcon}
      />

      {/* ===== BACKDROP (Solo cuando está abierto) ===== */}
      {isOpen && (
        <div 
          className="actions-dropdown__backdrop"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* ===== MENU DESPLEGABLE ===== */}
      {isOpen && (
        <div
          ref={menuRef}
          className={menuClasses}
          style={menuStyle}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="actions-dropdown-trigger"
        >
          {actions.map((action, index) => {
            // Validación de acción
            if (!action || typeof action !== 'object') {
              console.warn(`ActionsDropdown: Acción inválida en índice ${index}`, action);
              return null;
            }

            // Props de la acción
            const {
              label = 'Acción sin nombre',
              icon,
              onClick,
              variant: actionVariant,
              disabled: actionDisabled = false,
              loading: actionLoading = false,
              key: actionKey,
              description,
              shortcut,
              className: actionClassName = ''
            } = action;

            // ID único para la acción
            const actionId = actionKey || `action-${index}`;
            
            // Clases del item
            const itemClasses = [
              'actions-dropdown__item',
              `actions-dropdown__item--${size}`,
              actionVariant && `actions-dropdown__item--${actionVariant}`,
              (actionDisabled || actionLoading) && 'actions-dropdown__item--disabled',
              actionLoading && 'actions-dropdown__item--loading',
              actionClassName
            ].filter(Boolean).join(' ');
            
            return (
              <button
                key={actionId}
                className={itemClasses}
                disabled={actionDisabled || actionLoading}
                onClick={() => handleActionClick(action)}
                role="menuitem"
                tabIndex={actionDisabled || actionLoading ? -1 : 0}
                title={description || label}
                aria-label={description || label}
              >
                {/* Ícono */}
                {(icon || actionLoading) && (
                  <span className="actions-dropdown__icon">
                    {actionLoading ? renderIcon('loading') : (icon && renderIcon(icon))}
                  </span>
                )}
                
                {/* Label */}
                <span className="actions-dropdown__label">
                  {actionLoading ? 'Cargando...' : label}
                </span>
                
                {/* Shortcut (opcional) */}
                {shortcut && !actionLoading && (
                  <span className="actions-dropdown__shortcut">
                    {shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== PROP TYPES =====
ActionsDropdown.propTypes = {
  // ===== PROPS ESTÁNDAR V2.0 =====
  ...INTERACTIVE_PROP_TYPES,

  // ===== PROPS ESPECÍFICAS =====
  // Configuración de acciones
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    key: PropTypes.string,
    description: PropTypes.string,
    shortcut: PropTypes.string,
    className: PropTypes.string
  })).isRequired,
  
  // Configuración del trigger
  triggerData: PropTypes.object,
  triggerIcon: PropTypes.string,
  triggerLabel: PropTypes.string,
  
  // Configuración del menú
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'top-left', 'auto']),
  closeOnAction: PropTypes.bool,
  menuClassName: PropTypes.string,
  menuStyle: PropTypes.object,
  
  // Callbacks
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

// ===== DEFAULT PROPS =====
ActionsDropdown.defaultProps = {
  triggerIcon: 'more-vertical',
  triggerLabel: 'Acciones',
  position: 'bottom-right',
  closeOnAction: true,
  triggerData: {},
  menuClassName: '',
  menuStyle: {}
};

// Memoizar ActionsDropdown - optimización para uso en listas/tablas
const MemoizedActionsDropdown = memo(ActionsDropdown);

// ===== EXPORT =====
export { MemoizedActionsDropdown as ActionsDropdown };