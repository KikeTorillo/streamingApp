import { UsersProvider } from "../context/UserContext";
import { EpisodesProvider } from "../context/EpisodesContext";
import { ContentProviders } from "./ContentProviders";

/**
 * AdminProviders - Contextos específicos del panel de administración
 * 
 * Incluye:
 * - ContentProviders: Movies, Series, Categories (reutilizando componente)
 * - UsersProvider: CRUD de usuarios (solo admin)
 * - EpisodesProvider: CRUD de episodios (solo admin)
 * 
 * Estos providers solo se cargan en rutas de administración (/admin/*)
 * para optimizar el rendimiento en rutas públicas.
 */
export function AdminProviders({ children }) {
  return (
    <ContentProviders>
      <UsersProvider>
        <EpisodesProvider>
          {children}
        </EpisodesProvider>
      </UsersProvider>
    </ContentProviders>
  );
}