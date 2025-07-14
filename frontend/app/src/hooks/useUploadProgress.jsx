// src/hooks/useUploadProgress.jsx
import { useState } from "react";
import axios from "axios";
import { environmentService } from "../services/environmentService";

const useUploadProgress = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'processing', 'transcoding', 'completed', 'failed'
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const monitorProgress = (taskId, contentType, onStatusChange, onFinish) => {
    // ✅ ACTUALIZADO: Usar environmentService en lugar de URL hardcodeada
    const { urlBackend } = environmentService();
    
    let progressEndpoint;
    if (contentType === 'movies') {
      progressEndpoint = `${urlBackend}/api/v1/movies/progress/${taskId}`;
    } else if (contentType === 'episodes') {
      // ✅ NUEVO: Endpoint específico para episodios
      progressEndpoint = `${urlBackend}/api/v1/episodes/progress/${taskId}`;
    } else {
      // Para series y otros tipos
      progressEndpoint = `${urlBackend}/api/v1/series/progress/${taskId}`;
    }

    console.log('🔄 Iniciando monitoreo de progreso:', {
      taskId,
      contentType,
      endpoint: progressEndpoint
    });

    // No resetear progreso si ya está en curso
    if (status === 'idle') {
      setProgress(0);
      setStatus('processing');
      setMessage('Preparando archivos...');
    } else {
      // Continuar desde donde estaba
      setStatus('processing');
      setMessage('Conectando con servidor...');
    }
    setError(null);

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(progressEndpoint, {
          withCredentials: true,
          timeout: 10000 // 10 segundos timeout
        });
        
        const { status: taskStatus, progress: currentProgress, error: taskError } = response.data;
        
        console.log('📊 Progreso actualizado:', {
          status: taskStatus,
          progress: currentProgress,
          error: taskError
        });

        // Ajustar progreso para continuidad (50-100%)
        const backendProgress = currentProgress || 0;
        let adjustedProgress;
        
        if (taskStatus === 'processing') {
          // Processing: 50-60%
          adjustedProgress = 50 + (backendProgress * 0.1);
        } else if (taskStatus === 'transcoding') {
          // Transcoding: 60-100%
          adjustedProgress = 60 + (backendProgress * 0.4);
        } else {
          adjustedProgress = backendProgress;
        }
        
        setProgress(Math.round(adjustedProgress));
        setStatus(taskStatus);

        // Actualizar mensaje según estado y progreso
        if (taskStatus === 'processing') {
          if (backendProgress === 0) {
            setMessage('Validando formato y codificación...');
          } else {
            setMessage('Preparando para procesamiento...');
          }
        } else if (taskStatus === 'transcoding') {
          const progressPercent = backendProgress || 0;
          if (progressPercent === 0) {
            setMessage('Analizando características del video...');
          } else if (progressPercent === 100) {
            setMessage('Finalizando y guardando archivo...');
          } else {
            // Mensajes más realistas basados en los logs del backend
            if (progressPercent < 20) {
              setMessage('Verificando codificación y calidad...');
            } else if (progressPercent < 80) {
              setMessage('Copiando archivo al almacenamiento...');
            } else {
              setMessage('Procesando subtítulos y metadatos...');
            }
          }
        } else if (taskStatus === 'completed') {
          setMessage('¡Video procesado y agregado al catálogo!');
          setProgress(100);
          clearInterval(interval);
          
          console.log('✅ Procesamiento completado');
          onStatusChange?.('Video procesado exitosamente');
          onFinish?.(true, null);
          
        } else if (taskStatus === 'failed') {
          const errorMessage = taskError || 'Error desconocido en el procesamiento';
          setMessage(`Error: ${errorMessage}`);
          setError(errorMessage);
          clearInterval(interval);
          
          console.error('❌ Procesamiento falló:', errorMessage);
          onStatusChange?.(`Error: ${errorMessage}`);
          onFinish?.(false, errorMessage);
        }

        // Callback opcional para cambios de estado
        onStatusChange?.(taskStatus);

      } catch (error) {
        console.error('❌ Error consultando progreso:', error);
        
        const errorMessage = error.response?.status === 404 
          ? 'Tarea no encontrada' 
          : 'Error de conexión consultando progreso';
          
        setMessage(errorMessage);
        setError(errorMessage);
        setStatus('failed');
        clearInterval(interval);
        
        onStatusChange?.(errorMessage);
        onFinish?.(false, errorMessage);
      }
    }, 1000); // Consultar cada segundo

    // Retornar función para cancelar monitoreo
    return () => {
      clearInterval(interval);
      console.log('🛑 Monitoreo de progreso cancelado');
    };
  };

  // Función para resetear estados
  const resetProgress = () => {
    setProgress(0);
    setStatus('idle');
    setMessage('');
    setError(null);
  };

  // ✅ NUEVO: Funciones para controlar manualmente el estado
  const setProgressManually = (value) => setProgress(value);
  const setStatusManually = (value) => setStatus(value);
  const setMessageManually = (value) => setMessage(value);

  return { 
    progress, 
    status, 
    message, 
    error,
    monitorProgress,
    resetProgress,
    setProgress: setProgressManually,
    setStatus: setStatusManually, 
    setMessage: setMessageManually
  };
};

export { useUploadProgress };