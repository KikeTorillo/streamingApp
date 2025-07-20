// App.jsx - Actualizado con rutas completas del panel de administración + Episodes
import React from "react";
import { useRoutes, BrowserRouter } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { UsersProvider } from "./context/UserContext";
import { MoviesProvider } from "./context/MoviesContext";
import { SeriesProvider } from "./context/SeriesContext";
import { EpisodesProvider } from "./context/EpisodesContext";
import { CategoriesProvider } from "./context/CategoriesContext";
import { AlertProvider } from "./context/AlertContext";
import { Button } from "../components/atoms/Button/Button";

// Páginas existentes
import { Login } from "../Pages/Login/Login";
import { VideoPlayer } from "../Pages/VideoPlayer/VideoPlayer";
import { MainPage } from "../Pages/MainPage/MainPage";

// ===== PÁGINAS DEL ADMIN PANEL =====
import { AdminDashboard } from "../Pages/AdminDashboard/AdminDashboard";

// Users
import { UsersListPage } from "../Pages/Admin/Users/UsersListPage/UsersListPage";
import { UserCreatePage } from "../Pages/Admin/Users/UserCreatePage/UserCreatePage";
import { UserEditPage } from "../Pages/Admin/Users/UserEditPage/UserEditPage";

// Categories
import { CategoryCreatePage } from "../Pages/Admin/Categories/CategoryCreatePage/CategoryCreatePage";
import { CategoriesListPage } from "../Pages/Admin/Categories/CategoriesListPage/CategoriesListPage";

// ===== RUTAS DE MOVIES =====
import { MoviesListPage } from "../Pages/Admin/Movies/MoviesListPage/MoviesListPage";
import { MovieCreatePage } from "../Pages/Admin/Movies/MovieCreatePage/MovieCreatePage";
import { MovieEditPage } from "../Pages/Admin/Movies/MovieEditPage/MovieEditPage";

// ===== RUTAS DE SERIES - ACTIVADAS =====
import { SeriesListPage } from '../Pages/Admin/Series/SeriesListPage/SeriesListPage';
import { SeriesCreatePage } from '../Pages/Admin/Series/SeriesCreatePage/SeriesCreatePage';
import { SeriesEditPage } from '../Pages/Admin/Series/SeriesEditPage/SeriesEditPage';

// ===== 🆕 RUTAS DE EPISODES - NUEVAS =====
import { EpisodesListPage } from '../Pages/Admin/Episodes/EpisodesListPage/EpisodesListPage';
import { EpisodesCreatePage } from '../Pages/Admin/Episodes/EpisodesCreatePage/EpisodesCreatePage';
import { EpisodeEditPage } from '../Pages/Admin/Episodes/EpisodeEditPage/EpisodeEditPage';

import { SeriesDetailPage } from "../Pages/SeriesDetailPage/SeriesDetailPage";
import { MoviesDetailPage } from "../Pages/MoviesDetailPage/MoviesDetailPage";

import "./App.css";

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

/**
 * Configuración de rutas principales
 */
function AppRoutes() {
  const routes = useRoutes([
    // ===== RUTA RAÍZ - REDIRIGE A MAIN-PAGE =====
    {
      path: "/",
      element: <MainPage />
    },
    {
      path: "/main-page",
      element: <MainPage />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/player/:movieId",
      element: <VideoPlayer />
    },
    {
      path: "/series/:id",
      element: <SeriesDetailPage />
    },
    {
      path: "/movies/:id",
      element: <MoviesDetailPage />
    },

    // ===== RUTAS ADMIN PROTEGIDAS =====
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE USUARIOS =====
    {
      path: "/admin/users",
      element: (
        <AdminRoute>
          <UsersListPage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/users/create",
      element: (
        <AdminRoute>
          <UserCreatePage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/users/edit/:id",
      element: (
        <AdminRoute>
          <UserEditPage />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE CATEGORÍAS =====
    {
      path: "/admin/categories",
      element: (
        <AdminRoute>
          <CategoriesListPage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/categories/create",
      element: (
        <AdminRoute>
          <CategoryCreatePage />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE PELÍCULAS =====
    {
      path: "/admin/movies",
      element: (
        <AdminRoute>
          <MoviesListPage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/movies/create",
      element: (
        <AdminRoute>
          <MovieCreatePage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/movies/edit/:id",
      element: (
        <AdminRoute>
          <MovieEditPage />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE SERIES - ACTIVADAS ✅ =====
    {
      path: "/admin/series",
      element: (
        <AdminRoute>
          <SeriesListPage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/series/create",
      element: (
        <AdminRoute>
          <SeriesCreatePage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/series/edit/:id",
      element: (
        <AdminRoute>
          <SeriesEditPage />
        </AdminRoute>
      )
    },

    // ===== 🆕 GESTIÓN DE EPISODES - NUEVAS RUTAS =====
    {
      path: "/admin/episodes",
      element: (
        <AdminRoute>
          <EpisodesListPage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/episodes/create", // ← RUTA ACTIVADA
      element: (
        <AdminRoute>
          <EpisodesCreatePage />
        </AdminRoute>
      )
    },
    {
      path: "/admin/episodes/edit/:id",
      element: (
        <AdminRoute>
          <EpisodeEditPage />
        </AdminRoute>
      )
    },
    // 🔮 RUTAS FUTURAS - Descomenta cuando implementes las páginas
    /*
    {
      path: "/admin/episodes/view/:id",
      element: (
        <AdminRoute>
          <EpisodeViewPage />
        </AdminRoute>
      )
    },
    */

    // ===== RUTA DE FALLBACK =====
    {
      path: "*",
      element: (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}>
          <h1>404 - Página no encontrada</h1>
          <p>La página que buscas no existe.</p>
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
            Volver al Inicio
          </button>
        </div>
      )
    }
  ]);

  return routes;
}

function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <UsersProvider>
          <CategoriesProvider>
            <MoviesProvider>
              <SeriesProvider>
                <EpisodesProvider>
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </EpisodesProvider>
              </SeriesProvider>
            </MoviesProvider>
          </CategoriesProvider>
        </UsersProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export { App };