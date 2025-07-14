// Cropped.jsx
import React, { useState } from "react";
import Cropper from "react-easy-crop";

// Función auxiliar para cargar la imagen
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

// Función auxiliar para obtener la imagen recortada
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject(new Error("Canvas is empty"));
      }
      resolve(blob);
    }, "image/jpeg");
  });
}

const Cropped = ({ imageSrc, aspect = 16 / 9, onComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Guarda las coordenadas del recorte
  const onCropCompleteHandler = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Maneja la confirmación del recorte
  const handleCropConfirm = async () => {
    try {
      console.log('🔧 Iniciando recorte...', { croppedAreaPixels });
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      console.log('✅ Imagen recortada exitosamente:', croppedBlob);
      if (onComplete) {
        onComplete(croppedBlob);
      } else {
        console.warn('⚠️ No hay callback onComplete definido');
      }
    } catch (error) {
      console.error("❌ Error al recortar la imagen:", error);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: 400 }}>
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropCompleteHandler}
      />
      <button
        onClick={handleCropConfirm}
        style={{ marginTop: "10px", padding: "8px 12px", position: "relative", zIndex: 1000 }}
      >
        Confirmar recorte
      </button>
    </div>
  );
};

export { Cropped };
