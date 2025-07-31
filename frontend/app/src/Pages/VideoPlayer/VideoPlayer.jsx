import "./VideoPlayer.css";

// Context Provider y Container
import { VideoPlayerProvider } from '../../app/context/VideoPlayerContext';
import { VideoPlayerContainer } from './components/VideoPlayerContainer';

/**
 * VideoPlayer - Entry point del reproductor refactorizado
 * 
 * Responsabilidades:
 * - Proporcionar el contexto global del VideoPlayer
 * - Delegar toda la lógica y validaciones al VideoPlayerContainer
 * 
 * ✅ Funcionalidades mantenidas:
 * - Subtítulos y sincronización manual
 * - Playlist y autoadvance  
 * - Preferencias de usuario
 * - Analytics y métricas
 * - Hotkeys personalizados
 * - Manejo de errores (centralizado en Container)
 */
const VideoPlayer = () => {
  // ===== RENDERIZADO PRINCIPAL CON CONTEXTO =====
  return (
    <VideoPlayerProvider>
      <VideoPlayerContainer />
    </VideoPlayerProvider>
  );
};

export { VideoPlayer };