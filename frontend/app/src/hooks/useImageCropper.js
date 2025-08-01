// ===== USE IMAGE CROPPER HOOK =====
// src/hooks/useImageCropper.js

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook para manejar el recorte de imágenes de manera reutilizable
 * 
 * ✅ BENEFICIOS:
 * - Encapsula toda la lógica de cropping
 * - Reutilizable en múltiples formularios
 * - Testeable de manera aislada
 * - Manejo automático de memory leaks
 * - Estado predecible y controlable
 * 
 * @param {Object} options - Configuración del cropper
 * @param {number} options.aspect - Relación de aspecto (default: 16/9)
 * @param {string} options.croppedFilePrefix - Prefijo para archivos recortados (default: 'cropped_')
 * @param {Function} options.onCropComplete - Callback cuando se completa el recorte
 * @param {Function} options.onCropCancel - Callback cuando se cancela el recorte
 * 
 * @returns {Object} Estado y funciones del cropper
 */
function useImageCropper(options = {}) {
  const {
    aspect = 16 / 9,
    croppedFilePrefix = 'cropped_',
    onCropComplete,
    onCropCancel
  } = options;

  // ===== ESTADOS DEL CROPPER =====
  const [isOpen, setIsOpen] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [processedFiles] = useState(new Set());

  // Ref para cleanup de URLs
  const urlsToCleanup = useRef(new Set());

  // ===== FUNCIONES AUXILIARES =====

  /**
   * Limpiar URL de objeto para evitar memory leaks
   */
  const cleanupUrl = useCallback((url) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      urlsToCleanup.current.delete(url);
    }
  }, []);

  /**
   * Limpiar todas las URLs pendientes
   */
  const cleanupAllUrls = useCallback(() => {
    urlsToCleanup.current.forEach(url => {
      URL.revokeObjectURL(url);
    });
    urlsToCleanup.current.clear();
  }, []);

  /**
   * Crear clave única para archivo (para evitar reprocesamiento)
   */
  const getFileKey = useCallback((file) => {
    if (!file) return null;
    return `${file.name}-${file.size}-${file.lastModified}`;
  }, []);

  /**
   * Verificar si un archivo ya fue procesado
   */
  const isFileProcessed = useCallback((file) => {
    const fileKey = getFileKey(file);
    return fileKey ? processedFiles.has(fileKey) : false;
  }, [getFileKey, processedFiles]);

  /**
   * Marcar archivo como procesado
   */
  const markFileAsProcessed = useCallback((file) => {
    const fileKey = getFileKey(file);
    if (fileKey) {
      processedFiles.add(fileKey);
    }
  }, [getFileKey, processedFiles]);

  // ===== FUNCIONES PRINCIPALES =====

  /**
   * Abrir cropper con un archivo
   */
  const openCropper = useCallback((file) => {
    if (!file || !(file instanceof File)) {

      return;
    }

    // Verificar si ya fue procesado
    if (isFileProcessed(file)) {

      return;
    }

    try {
      const url = URL.createObjectURL(file);
      urlsToCleanup.current.add(url);
      
      setOriginalFile(file);
      setImageUrl(url);
      setIsOpen(true);
    } catch (error) {
      console.error('Error processing image file:', error);
    }
  }, [isFileProcessed]);

  /**
   * Cerrar cropper y limpiar estado
   */
  const closeCropper = useCallback(() => {

    // Marcar archivo como procesado (tanto si se confirmó como si se canceló)
    if (originalFile) {
      markFileAsProcessed(originalFile);
    }

    // Limpiar estado
    setIsOpen(false);
    setOriginalFile(null);
    
    if (imageUrl) {
      cleanupUrl(imageUrl);
      setImageUrl(null);
    }

    // Callback de cancelación
    onCropCancel?.();
  }, [originalFile, imageUrl, markFileAsProcessed, cleanupUrl, onCropCancel]);

  /**
   * Manejar imagen recortada
   */
  const handleCroppedImage = useCallback((croppedBlob) => {
    if (!croppedBlob || !originalFile) {

      return;
    }

    try {
      // Crear archivo desde el blob
      const fileName = `${croppedFilePrefix}${originalFile.name}`;
      const newCroppedFile = new File([croppedBlob], fileName, {
        type: 'image/jpeg'
      });

      // Actualizar estado
      setCroppedFile(newCroppedFile);

      // Cerrar cropper
      const currentOriginalFile = originalFile;
      closeCropper();

      // Callback de completado (después de cerrar para evitar interferencias)
      setTimeout(() => {
        onCropComplete?.(newCroppedFile, currentOriginalFile);
      }, 50);

    } catch (error) {
      console.error('Error handling cropped image:', error);
    }
  }, [originalFile, croppedFilePrefix, closeCropper, onCropComplete]);

  /**
   * Resetear todo el estado del cropper
   */
  const resetCropper = useCallback(() => {

    setIsOpen(false);
    setOriginalFile(null);
    setCroppedFile(null);
    
    if (imageUrl) {
      cleanupUrl(imageUrl);
      setImageUrl(null);
    }
    
    cleanupAllUrls();
    processedFiles.clear();
  }, [imageUrl, cleanupUrl, cleanupAllUrls, processedFiles]);

  /**
   * Verificar si un archivo necesita cropping
   */
  const shouldOpenCropper = useCallback((file) => {
    if (!file || !(file instanceof File)) return false;
    if (!file.type.startsWith('image/')) return false;
    if (isFileProcessed(file)) return false;
    if (isOpen) return false; // Ya hay un cropping en proceso
    
    return true;
  }, [isFileProcessed, isOpen]);

  // ===== CLEANUP AL DESMONTAR =====
  useEffect(() => {
    return () => {
      cleanupAllUrls();
    };
  }, [cleanupAllUrls]);

  // ===== RETURN DEL HOOK =====
  return {
    // Estado
    isOpen,
    originalFile,
    imageUrl,
    croppedFile,
    
    // Funciones principales
    openCropper,
    closeCropper,
    handleCroppedImage,
    resetCropper,
    
    // Utilidades
    shouldOpenCropper,
    isFileProcessed,
    
    // Configuración
    aspect,
    
    // Info para debugging
    debug: {
      processedFilesCount: processedFiles.size,
      urlsToCleanupCount: urlsToCleanup.current.size
    }
  };
}

export { useImageCropper };