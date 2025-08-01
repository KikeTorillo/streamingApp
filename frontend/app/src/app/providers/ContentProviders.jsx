import { MoviesProvider } from "../context/MoviesContext";
import { SeriesProvider } from "../context/SeriesContext";
import { CategoriesProvider } from "../context/CategoriesContext";
import PropTypes from 'prop-types';

/**
 * ContentProviders - Contextos de contenido para páginas que necesitan datos de movies/series
 * 
 * Incluye:
 * - MoviesProvider: CRUD de películas  
 * - SeriesProvider: CRUD de series
 * - CategoriesProvider: CRUD de categorías
 * 
 * Usado por páginas públicas que muestran contenido (MainPage) pero no necesitan
 * contextos administrativos como Users o Episodes.
 */
export function ContentProviders({ children }) {
  return (
    <CategoriesProvider>
      <MoviesProvider>
        <SeriesProvider>
          {children}
        </SeriesProvider>
      </MoviesProvider>
    </CategoriesProvider>
  );
}

// PropTypes para validación
ContentProviders.propTypes = {
  children: PropTypes.node.isRequired
};