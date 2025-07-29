import React from "react";
import { useRoutes } from "react-router-dom";

// Páginas del panel de administración
import { AdminDashboard } from "../../Pages/AdminDashboard/AdminDashboard";

// Users
import { UsersListPage } from "../../Pages/Admin/Users/UsersListPage/UsersListPage";
import { UserCreatePage } from "../../Pages/Admin/Users/UserCreatePage/UserCreatePage";
import { UserEditPage } from "../../Pages/Admin/Users/UserEditPage/UserEditPage";

// Categories
import { CategoryCreatePage } from "../../Pages/Admin/Categories/CategoryCreatePage/CategoryCreatePage";
import { CategoriesListPage } from "../../Pages/Admin/Categories/CategoriesListPage/CategoriesListPage";

// Movies
import { MoviesListPage } from "../../Pages/Admin/Movies/MoviesListPage/MoviesListPage";
import { MovieCreatePage } from "../../Pages/Admin/Movies/MovieCreatePage/MovieCreatePage";
import { MovieEditPage } from "../../Pages/Admin/Movies/MovieEditPage/MovieEditPage";

// Series
import { SeriesListPage } from '../../Pages/Admin/Series/SeriesListPage/SeriesListPage';
import { SeriesCreatePage } from '../../Pages/Admin/Series/SeriesCreatePage/SeriesCreatePage';
import { SeriesEditPage } from '../../Pages/Admin/Series/SeriesEditPage/SeriesEditPage';

// Episodes
import { EpisodesListPage } from '../../Pages/Admin/Episodes/EpisodesListPage/EpisodesListPage';
import { EpisodesCreatePage } from '../../Pages/Admin/Episodes/EpisodesCreatePage/EpisodesCreatePage';
import { EpisodeEditPage } from '../../Pages/Admin/Episodes/EpisodeEditPage/EpisodeEditPage';

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
 * AdminRoutes - Configuración de todas las rutas del panel de administración
 * 
 * Este componente maneja todas las rutas que empiezan con /admin/*
 * y está protegido por AdminRoute para verificar permisos.
 */
export function AdminRoutes() {
  const routes = useRoutes([
    // Dashboard principal
    {
      path: "/",
      element: (
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE USUARIOS =====
    {
      path: "/users",
      element: (
        <AdminRoute>
          <UsersListPage />
        </AdminRoute>
      )
    },
    {
      path: "/users/create",
      element: (
        <AdminRoute>
          <UserCreatePage />
        </AdminRoute>
      )
    },
    {
      path: "/users/edit/:id",
      element: (
        <AdminRoute>
          <UserEditPage />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE CATEGORÍAS =====
    {
      path: "/categories",
      element: (
        <AdminRoute>
          <CategoriesListPage />
        </AdminRoute>
      )
    },
    {
      path: "/categories/create",
      element: (
        <AdminRoute>
          <CategoryCreatePage />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE PELÍCULAS =====
    {
      path: "/movies",
      element: (
        <AdminRoute>
          <MoviesListPage />
        </AdminRoute>
      )
    },
    {
      path: "/movies/create",
      element: (
        <AdminRoute>
          <MovieCreatePage />
        </AdminRoute>
      )
    },
    {
      path: "/movies/edit/:id",
      element: (
        <AdminRoute>
          <MovieEditPage />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE SERIES =====
    {
      path: "/series",
      element: (
        <AdminRoute>
          <SeriesListPage />
        </AdminRoute>
      )
    },
    {
      path: "/series/create",
      element: (
        <AdminRoute>
          <SeriesCreatePage />
        </AdminRoute>
      )
    },
    {
      path: "/series/edit/:id",
      element: (
        <AdminRoute>
          <SeriesEditPage />
        </AdminRoute>
      )
    },

    // ===== GESTIÓN DE EPISODES =====
    {
      path: "/episodes",
      element: (
        <AdminRoute>
          <EpisodesListPage />
        </AdminRoute>
      )
    },
    {
      path: "/episodes/create",
      element: (
        <AdminRoute>
          <EpisodesCreatePage />
        </AdminRoute>
      )
    },
    {
      path: "/episodes/edit/:id",
      element: (
        <AdminRoute>
          <EpisodeEditPage />
        </AdminRoute>
      )
    }
  ]);

  return routes;
}