// useVideoPreferences.jsx
// Hook personalizado para manejar preferencias de video del usuario

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../app/context/AuthContext';
import { getUserPreferencesService } from '../services/UserPreferences/getUserPreferencesService';
import { updateUserPreferencesService } from '../services/UserPreferences/updateUserPreferencesService';
import { updateWatchProgressService } from '../services/UserPreferences/updateWatchProgressService';
import { getWatchProgressService } from '../services/UserPreferences/getWatchProgressService';
import { 
    migrateLocalStorageService, 
    getLocalStorageDataForMigration, 
    clearLocalStorageAfterMigration 
} from '../services/UserPreferences/migrateLocalStorageService';

/**
 * Hook personalizado para manejar preferencias de video del usuario
 * Incluye fallback a localStorage y migración automática
 * @returns {Object} Objeto con preferencias, funciones y estados
 */
function useVideoPreferences() {
    // Contexto del usuario autenticado
    const { user, isAuthenticated, userId } = useAuth();
    
    // Debug del estado del usuario (solo una vez por mount)
    useEffect(() => {

    }, [user?.id, isAuthenticated, userId]); // Solo log cuando cambia realmente
    
    // Estados del hook
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUsingFallback, setIsUsingFallback] = useState(false);

    // Preferencias por defecto - IMPORTANTE: usar camelCase para consistencia con backend
    const defaultPreferences = {
        volume: 1.0,
        playbackRate: 1.0, // camelCase para backend Joi schema
        autoplay: false,
        muted: false,
        defaultQuality: 'auto', // camelCase para backend Joi schema
        preferredLanguage: 'es', // camelCase para backend Joi schema
        subtitlesEnabled: true, // camelCase para backend Joi schema
        forcedSubtitlesOnly: false, // camelCase para backend Joi schema
        autoFullscreen: false, // camelCase para backend Joi schema
        pictureInPictureEnabled: true, // camelCase para backend Joi schema
        hotkeyEnabled: true, // camelCase para backend Joi schema
        watchProgress: {} // camelCase para backend Joi schema
    };

    /**
     * Obtener progreso de localStorage como fallback
     */
    const getLocalStorageFallback = useCallback(() => {
        try {
            const watchProgress = localStorage.getItem('watchProgress');
            const parsedProgress = watchProgress ? JSON.parse(watchProgress) : {};
            
            return {
                ...defaultPreferences,
                watch_progress: parsedProgress
            };
        } catch (error) {

            return defaultPreferences;
        }
    }, [defaultPreferences]);

    /**
     * Guardar en localStorage como fallback
     */
    const saveToLocalStorageFallback = useCallback((updatedPreferences) => {
        try {
            if (updatedPreferences.watch_progress) {
                localStorage.setItem('watchProgress', JSON.stringify(updatedPreferences.watch_progress));
            }
        } catch (error) {

        }
    }, []);

    /**
     * Intentar migrar datos de localStorage al backend
     */
    const attemptMigration = useCallback(async () => {
        if (!userId || !isAuthenticated || isUsingFallback) return;

        try {
            const localData = getLocalStorageDataForMigration();
            
            // Solo migrar si hay datos en localStorage
            if (Object.keys(localData.watchProgress).length > 0) {

                const result = await migrateLocalStorageService(userId, localData);
                
                if (result.success) {

                    setPreferences(result.data);
                    clearLocalStorageAfterMigration();
                } else {

                }
            }
        } catch (error) {

        }
    }, [userId, isAuthenticated, isUsingFallback]);

    /**
     * Cargar preferencias del usuario
     */
    const loadPreferences = useCallback(async () => {
        if (!userId || !isAuthenticated) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await getUserPreferencesService(userId);
            
            if (result.success) {
                setPreferences(result.data);
                setIsUsingFallback(false);
                
                // Intentar migrar datos de localStorage si existen
                await attemptMigration();
            } else {
                // Si falla, usar localStorage como fallback

                const fallbackPrefs = getLocalStorageFallback();
                setPreferences(fallbackPrefs);
                setIsUsingFallback(true);
            }
        } catch (error) {

            // Usar localStorage como fallback en caso de error
            const fallbackPrefs = getLocalStorageFallback();
            setPreferences(fallbackPrefs);
            setIsUsingFallback(true);
            setError('Error de conexión. Usando datos locales.');
        } finally {
            setLoading(false);
        }
    }, [userId, isAuthenticated, getLocalStorageFallback, attemptMigration]);

    /**
     * Actualizar preferencias del usuario
     */
    const updatePreferences = useCallback(async (newPreferences) => {
        if (!userId || !isAuthenticated) {

            return false;
        }

        try {
            if (isUsingFallback) {
                // Si estamos en modo fallback, solo actualizar localStorage
                const updatedPrefs = { ...preferences, ...newPreferences };
                setPreferences(updatedPrefs);
                saveToLocalStorageFallback(updatedPrefs);
                return true;
            }

            // Intentar actualizar en el backend
            const result = await updateUserPreferencesService(userId, newPreferences);
            
            if (result.success) {
                // Solo actualizar estado si hay cambios reales del servidor
                // Para evitar re-renderizados innecesarios del VideoPlayer
                if (JSON.stringify(result.data) !== JSON.stringify(preferences)) {
                    setPreferences(result.data);
                }
                return true;
            } else {
                // Si falla, usar fallback

                const updatedPrefs = { ...preferences, ...newPreferences };
                setPreferences(updatedPrefs);
                saveToLocalStorageFallback(updatedPrefs);
                setIsUsingFallback(true);
                return true;
            }
        } catch (error) {

            // Fallback a localStorage en caso de error
            const updatedPrefs = { ...preferences, ...newPreferences };
            setPreferences(updatedPrefs);
            saveToLocalStorageFallback(updatedPrefs);
            setIsUsingFallback(true);
            return true;
        }
    }, [userId, isAuthenticated, preferences, isUsingFallback, saveToLocalStorageFallback]);

    /**
     * Actualizar progreso de reproducción
     */
    const updateWatchProgress = useCallback(async (contentId, progressData) => {
        if (!userId || !isAuthenticated) {

            return false;
        }

        try {
            if (isUsingFallback) {
                // Actualizar en localStorage
                const updatedProgress = {
                    ...preferences.watch_progress,
                    [contentId]: {
                        position: progressData.position,
                        type: progressData.type,
                        ...(progressData.type === 'series' && { currentEpisode: progressData.currentEpisode }),
                        timestamp: Date.now(),
                        completed: progressData.completed || false
                    }
                };
                
                const updatedPrefs = { ...preferences, watch_progress: updatedProgress };
                setPreferences(updatedPrefs);
                saveToLocalStorageFallback(updatedPrefs);
                return true;
            }

            // Intentar actualizar en el backend
            const result = await updateWatchProgressService(userId, contentId, progressData);
            
            if (result.success) {
                // Solo actualizar estado si hay cambios reales del servidor
                // Para evitar re-renderizados innecesarios del VideoPlayer
                if (JSON.stringify(result.data) !== JSON.stringify(preferences)) {
                    setPreferences(result.data);
                }
                return true;
            } else {
                // Fallback a localStorage

                const updatedProgress = {
                    ...preferences.watch_progress,
                    [contentId]: {
                        position: progressData.position,
                        type: progressData.type,
                        ...(progressData.type === 'series' && { currentEpisode: progressData.currentEpisode }),
                        timestamp: Date.now(),
                        completed: progressData.completed || false
                    }
                };
                
                const updatedPrefs = { ...preferences, watch_progress: updatedProgress };
                setPreferences(updatedPrefs);
                saveToLocalStorageFallback(updatedPrefs);
                setIsUsingFallback(true);
                return true;
            }
        } catch (error) {

            // Seguir con fallback...
            return false;
        }
    }, [userId, isAuthenticated, preferences, isUsingFallback, saveToLocalStorageFallback]);

    /**
     * Obtener progreso de un contenido específico
     * Prioriza la API dedicada, con fallback al cache local
     */
    const getWatchProgress = useCallback(async (contentId) => {

        if (!userId || !isAuthenticated || !contentId) {

            return null;
        }

        try {
            // Si no estamos usando fallback, intentar obtener desde API
            if (!isUsingFallback) {

                const result = await getWatchProgressService(userId, contentId);

                if (result.success && result.data) {
                    return result.data;
                }
            }
            
            // Fallback: obtener desde cache local (preferencias ya cargadas)

            if (preferences?.watch_progress) {
                const progressData = preferences.watch_progress[contentId] || null;

                return progressData;
            }
            
            return null;
        } catch (error) {

            // Fallback silencioso al cache local
            if (preferences?.watch_progress) {
                return preferences.watch_progress[contentId] || null;
            }
            return null;
        }
    }, [userId, isAuthenticated, preferences, isUsingFallback]);

    /**
     * Obtener progreso de contenido de forma síncrona (solo cache local)
     * Para casos donde necesitas acceso inmediato sin await
     */
    const getWatchProgressSync = useCallback((contentId) => {
        if (!preferences?.watch_progress) return null;
        return preferences.watch_progress[contentId] || null;
    }, [preferences]);

    /**
     * Reintentar conexión al backend (salir del modo fallback)
     */
    const retryBackendConnection = useCallback(async () => {
        if (!isUsingFallback || !userId || !isAuthenticated) return;

        await loadPreferences();
    }, [isUsingFallback, userId, isAuthenticated, loadPreferences]);

    // Cargar preferencias al montar el componente o cambiar usuario
    useEffect(() => {
        loadPreferences();
    }, [userId, isAuthenticated]); // Solo dependencias primitivas

    return {
        // Estados
        preferences,
        loading,
        error,
        isUsingFallback,
        
        // Funciones principales
        updatePreferences,
        updateWatchProgress,
        getWatchProgress, // Versión async con API
        getWatchProgressSync, // Versión sync solo cache
        
        // Utilidades
        retryBackendConnection,
        reloadPreferences: loadPreferences,
        
        // Información del sistema
        isAuthenticated,
        userId
    };
}

export { useVideoPreferences };