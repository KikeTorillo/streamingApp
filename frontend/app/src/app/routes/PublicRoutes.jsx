import { useRoutes } from "react-router-dom";
import { ContentProviders } from "../providers/ContentProviders";

// Páginas públicas
import { Login } from "../../Pages/Login/Login";
import { MainPage } from "../../Pages/MainPage/MainPage";
// Páginas temporalmente comentadas para debug
// import { VideoPlayer } from "../../Pages/VideoPlayer/VideoPlayer";
// import { SeriesDetailPage } from "../../Pages/SeriesDetailPage/SeriesDetailPage";
// import { MoviesDetailPage } from "../../Pages/MoviesDetailPage/MoviesDetailPage";

// Componentes del sistema de diseño
import { FlexContainer, Typography, Button } from "../../../design-system";

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
    // Rutas temporalmente comentadas para debug
    /*
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
    */

    // ===== RUTAS SIMPLES (Solo CoreProviders) =====
    {
      path: "/login",
      element: <Login />
    },
    /*
    {
      path: "/player/:movieId",
      element: <VideoPlayer />
    },
    */

    // ===== RUTA DE FALLBACK =====
    {
      path: "*",
      element: (
        <FlexContainer
          direction="column"
          align="center"
          justify="center"
          spacing="lg"
          padding="xl"
          style={{ minHeight: '100vh', textAlign: 'center' }}
        >
          <Typography 
            variant="h1" 
            size="xl" 
            weight="bold"
            color="primary"
          >
            404 - Página no encontrada
          </Typography>
          
          <Typography 
            variant="body" 
            size="lg" 
            color="muted"
          >
            La página que buscas no existe.
          </Typography>
          
          <Button
            variant="primary"
            size="lg"
            leftIcon="home"
            onClick={() => window.location.href = '/main-page'}
          >
            Volver al Inicio
          </Button>
        </FlexContainer>
      )
    }
  ]);

  return routes;
}