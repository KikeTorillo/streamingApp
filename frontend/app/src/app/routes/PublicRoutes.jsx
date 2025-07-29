import React from "react";
import { useRoutes } from "react-router-dom";
import { ContentProviders } from "../providers/ContentProviders";

// Páginas públicas
import { Login } from "../../Pages/Login/Login";
import { VideoPlayer } from "../../Pages/VideoPlayer/VideoPlayer";
import { MainPage } from "../../Pages/MainPage/MainPage";
import { SeriesDetailPage } from "../../Pages/SeriesDetailPage/SeriesDetailPage";
import { MoviesDetailPage } from "../../Pages/MoviesDetailPage/MoviesDetailPage";

/**
 * PublicRoutes - Configuración de todas las rutas públicas
 * 
 * Estrategia optimizada:
 * - Login y 404: Solo CoreProviders (Theme, Auth, Alert)
 * - MainPage y páginas de detalle: CoreProviders + ContentProviders
 * - VideoPlayer: Solo CoreProviders
 */
export function PublicRoutes() {
  const routes = useRoutes([
    // ===== RUTAS QUE NECESITAN CONTENIDO (Movies/Series/Categories) =====
    {
      path: "/",
      element: (
        <ContentProviders>
          <MainPage />
        </ContentProviders>
      )
    },
    {
      path: "/main-page",
      element: (
        <ContentProviders>
          <MainPage />
        </ContentProviders>
      )
    },
    {
      path: "/series/:id",
      element: (
        <ContentProviders>
          <SeriesDetailPage />
        </ContentProviders>
      )
    },
    {
      path: "/movies/:id",
      element: (
        <ContentProviders>
          <MoviesDetailPage />
        </ContentProviders>
      )
    },

    // ===== RUTAS SIMPLES (Solo CoreProviders) =====
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/player/:movieId",
      element: <VideoPlayer />
    },

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