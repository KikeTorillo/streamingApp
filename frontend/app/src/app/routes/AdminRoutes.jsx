import { useRoutes } from "react-router-dom";
import PropTypes from 'prop-types';

// Páginas del panel de administración - TEMPORALMENTE COMENTADAS PARA DEBUG
// import { AdminDashboard } from "../../Pages/AdminDashboard/AdminDashboard";

// Users - COMENTADO
// import { UsersListPage } from "../../Pages/Admin/Users/UsersListPage/UsersListPage";
// import { UserCreatePage } from "../../Pages/Admin/Users/UserCreatePage/UserCreatePage";
// import { UserEditPage } from "../../Pages/Admin/Users/UserEditPage/UserEditPage";

// Categories - COMENTADO
// import { CategoryCreatePage } from "../../Pages/Admin/Categories/CategoryCreatePage/CategoryCreatePage";
// import { CategoriesListPage } from "../../Pages/Admin/Categories/CategoriesListPage/CategoriesListPage";

// Movies - COMENTADO
// import { MoviesListPage } from "../../Pages/Admin/Movies/MoviesListPage/MoviesListPage";
// import { MovieCreatePage } from "../../Pages/Admin/Movies/MovieCreatePage/MovieCreatePage";
// import { MovieEditPage } from "../../Pages/Admin/Movies/MovieEditPage/MovieEditPage";

// Series - COMENTADO
// import { SeriesListPage } from '../../Pages/Admin/Series/SeriesListPage/SeriesListPage';
// import { SeriesCreatePage } from '../../Pages/Admin/Series/SeriesCreatePage/SeriesCreatePage';
// import { SeriesEditPage } from '../../Pages/Admin/Series/SeriesEditPage/SeriesEditPage';

// Episodes - COMENTADO
// import { EpisodesListPage } from '../../Pages/Admin/Episodes/EpisodesListPage/EpisodesListPage';
// import { EpisodesCreatePage } from '../../Pages/Admin/Episodes/EpisodesCreatePage/EpisodesCreatePage';
// import { EpisodeEditPage } from '../../Pages/Admin/Episodes/EpisodeEditPage/EpisodeEditPage';

/**
 * Componente de protección de rutas admin
 */
function AdminRoute({ children }) {
  const user = JSON.parse(sessionStorage.getItem('sessionUser') || '{}');
  const isAdmin = user?.roleId === 1 || user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'var(--font-family-base)'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>🔒</div>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: 'var(--text-primary)'
        }}>
          Acceso Restringido
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '2rem'
        }}>
          Necesitas permisos de administrador para acceder a esta área.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '1rem 2rem',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer'
          }}
        >
          Ir a Login
        </button>
      </div>
    );
  }

  return children;
}

// PropTypes para validación
AdminRoute.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * AdminRoutes - TEMPORALMENTE DESHABILITADO PARA DEBUG
 * 
 * Todas las rutas admin están comentadas para aislar errores del design-system.
 * Solo se muestran Login y MainPage hasta resolver el problema de Avatar.
 */
export function AdminRoutes() {
  const routes = useRoutes([
    // Placeholder temporal para debug
    {
      path: "*",
      element: (
        <AdminRoute>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'var(--font-family-base)'
          }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              🚧 Área Admin Temporalmente Deshabilitada
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Las páginas de administración están comentadas para debugging del sistema de diseño.
            </p>
            <button
              onClick={() => window.location.href = '/main-page'}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Volver a Inicio
            </button>
          </div>
        </AdminRoute>
      )
    }
  ]);

  return routes;
}