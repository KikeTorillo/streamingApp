// ===== IMAGE CROPPER MODAL STORIES =====
// src/components/molecules/ImageCropperModal/ImageCropperModal.stories.jsx

import { useState } from 'react';
import { ImageCropperModal } from './ImageCropperModal';
import { Button } from '../../atoms/Button/Button';

// ===== CONFIGURACIÓN =====
export default {
  title: 'Molecules/ImageCropperModal',
  component: ImageCropperModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente reutilizable para recortar imágenes con modal. Usado en formularios de Movies, Series y otros contenidos multimedia.'
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Si el modal está abierto'
    },
    imageSrc: {
      control: 'text',
      description: 'URL de la imagen a recortar'
    },
    aspect: {
      control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
      description: 'Relación de aspecto para el recorte'
    },
    title: {
      control: 'text',
      description: 'Título del modal'
    },
    description: {
      control: 'text',
      description: 'Descripción del cropper'
    },
    helpText: {
      control: 'text',
      description: 'Texto de ayuda'
    },
    cancelText: {
      control: 'text',
      description: 'Texto del botón cancelar'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Tamaño del modal'
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: 'Cerrar al hacer clic en el backdrop'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Cerrar con la tecla ESC'
    }
  }
};

// ===== TEMPLATE BASE =====
const Template = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen || false);
  const [result, setResult] = useState(null);

  const handleOpen = () => {
    setIsOpen(true);
    setResult(null);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleComplete = (croppedBlob) => {

    setResult(`Imagen recortada: ${croppedBlob.size} bytes`);
    setIsOpen(false);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Button onClick={handleOpen} variant="primary" size="md">
        🖼️ Abrir Cropper
      </Button>
      
      {result && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#f0f9ff', 
          border: '1px solid #0ea5e9',
          borderRadius: '0.5rem',
          color: '#0c4a6e'
        }}>
          ✅ {result}
        </div>
      )}
      
      <ImageCropperModal
        {...args}
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleComplete}
      />
    </div>
  );
};

// ===== HISTORIAS =====

// 1. Por defecto
export const Default = Template.bind({});
Default.args = {
  imageSrc: 'https://picsum.photos/800/600',
  aspect: 16 / 9,
  title: '✂️ Recortar Imagen',
  description: 'Ajusta el área de recorte para tu imagen. Se recomienda usar una proporción de 16:9.',
  helpText: 'Ajusta el área de recorte y haz clic en "Confirmar recorte" para proceder.',
  cancelText: '❌ Cancelar',
  size: 'lg',
  closeOnBackdrop: false,
  closeOnEscape: true
};

// 2. Para portadas de películas (16:9)
export const MoviePoster = Template.bind({});
MoviePoster.args = {
  imageSrc: 'https://picsum.photos/800/450',
  aspect: 16 / 9,
  title: '🎬 Recortar Portada de Película',
  description: 'Ajusta el área de recorte para la portada de tu película. Usa proporción 16:9 para mejor visualización.',
  helpText: 'La portada se mostrará en la página principal y catálogo.',
  cancelText: '🚫 Cancelar',
  size: 'lg'
};

// 3. Para avatares cuadrados (1:1)
export const SquareAvatar = Template.bind({});
SquareAvatar.args = {
  imageSrc: 'https://picsum.photos/600/600',
  aspect: 1,
  title: '👤 Recortar Avatar',
  description: 'Recorta tu imagen de perfil en formato cuadrado (1:1).',
  helpText: 'El avatar se mostrará en tu perfil y comentarios.',
  cancelText: '❌ Cancelar',
  size: 'md'
};

// 4. Para banners horizontales (3:1)
export const Banner = Template.bind({});
Banner.args = {
  imageSrc: 'https://picsum.photos/1200/400',
  aspect: 3,
  title: '🖼️ Recortar Banner',
  description: 'Ajusta el área de recorte para tu banner horizontal (3:1).',
  helpText: 'El banner se mostrará en la parte superior de la página.',
  cancelText: '🔙 Cancelar',
  size: 'xl'
};

// 5. Modal pequeño
export const SmallModal = Template.bind({});
SmallModal.args = {
  imageSrc: 'https://picsum.photos/400/300',
  aspect: 4 / 3,
  title: '✂️ Recorte Rápido',
  description: 'Recorte rápido en modal pequeño.',
  helpText: 'Ajusta y confirma.',
  cancelText: '❌ Salir',
  size: 'sm'
};

// 6. Sin imagen (estado de error)
export const NoImage = Template.bind({});
NoImage.args = {
  imageSrc: null,
  aspect: 16 / 9,
  title: '⚠️ Sin Imagen',
  description: 'No se ha proporcionado una imagen para recortar.',
  helpText: 'Selecciona una imagen válida primero.',
  cancelText: '🔙 Volver',
  size: 'md'
};