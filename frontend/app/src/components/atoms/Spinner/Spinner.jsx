// src/components/atoms/Spinner/Spinner.jsx
import "./Spinner.css";

/**
 * Spinner - Componente átomo para indicadores de carga
 * Tamaños aumentados: sm(32px), md(48px), lg(64px)
 */
function Spinner({
  variant = "circle", // 'circle', 'dots', 'pulse', 'bars'
  size = "md", // 'sm', 'md', 'lg'
  color = "primary", // 'primary', 'secondary', 'success', 'danger'
  message = "Cargando...",
  overlay = false, // Si debe mostrar overlay de fondo
  className = ""
}) {
  // Renderizado de diferentes variantes
  const renderSpinnerVariant = () => {
    const sizeClass = `spinner--${size}`;

    switch (variant) {
      case 'dots':
        return (
          <div className="spinner-dots">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`spinner-dot spinner-dot--${color}`}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`spinner-pulse spinner-pulse--${color} ${sizeClass}`} />
        );

      case 'bars':
        return (
          <div className={`spinner-bars ${sizeClass}`}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`spinner-bar spinner-bar--${color}`}
              />
            ))}
          </div>
        );

      case 'circle':
      default:
        return (
          <div className={`spinner-circle spinner-circle--${color} ${sizeClass}`} />
        );
    }
  };

  // Si es overlay, usar estructura específica
  if (overlay) {
    return (
      <div className={`spinner-overlay ${className}`}>
        <div className="spinner-overlay__container">
          <div className="spinner-overlay__spinner">
            {renderSpinnerVariant()}
          </div>
          <div className={`spinner-overlay__message spinner__message--${size}`}>
            {message}
          </div>
        </div>
      </div>
    );
  }

  // Modo inline normal
  return (
    <div className={`spinner-inline ${className}`}>
      {renderSpinnerVariant()}
      {message && (
        <div className={`spinner-inline__message spinner__message--${size}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export { Spinner };