import { VideoPlayerOverlay } from './VideoPlayerOverlay';
import { useState } from 'react';

export default {
  title: 'Organisms/VideoPlayerOverlay',
  component: VideoPlayerOverlay,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'video', value: '#1a1a1a' },
      ],
    },
  },
  argTypes: {
    onSkipBack: { action: 'skip-back' },
    onPlayPause: { action: 'play-pause' },
    onSkipForward: { action: 'skip-forward' },
    isPlaying: {
      control: 'boolean',
      description: 'Estado de reproducción del video'
    },
    skipSeconds: {
      control: { type: 'number', min: 5, max: 60, step: 5 },
      description: 'Segundos para adelantar/retroceder'
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales'
    }
  }
};

// Wrapper para simular el contexto de un video player
const VideoPlayerWrapper = ({ children, showOverlay = true }) => (
  <div style={{
    position: 'relative',
    width: '100%',
    height: '500px',
    backgroundColor: '#000',
    backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    overflow: 'hidden',
    borderRadius: '8px'
  }}>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      opacity: 0.5,
      zIndex: 1
    }}>
      🎬 Video Player Simulado
      <br />
      <small style={{ fontSize: '0.8rem' }}>Hover para ver controles</small>
    </div>
    {showOverlay && (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2
      }}>
        {children}
      </div>
    )}
  </div>
);

// Template base
const Template = (args) => {
  const [isPlaying, setIsPlaying] = useState(args.isPlaying || false);
  
  return (
    <VideoPlayerWrapper>
      <VideoPlayerOverlay
        {...args}
        isPlaying={isPlaying}
        onSkipBack={() => {
          args.onSkipBack();

        }}
        onPlayPause={() => {
          setIsPlaying(!isPlaying);
          args.onPlayPause();

        }}
        onSkipForward={() => {
          args.onSkipForward();

        }}
      />
    </VideoPlayerWrapper>
  );
};

// Historia por defecto
export const Default = Template.bind({});
Default.args = {
  isPlaying: false,
  skipSeconds: 10,
  className: ''
};

// Historia con video reproduciéndose
export const Playing = Template.bind({});
Playing.args = {
  isPlaying: true,
  skipSeconds: 10,
  className: ''
};

// Historia con diferentes segundos de skip
export const CustomSkipSeconds = Template.bind({});
CustomSkipSeconds.args = {
  isPlaying: false,
  skipSeconds: 30,
  className: ''
};

// Historia con controles siempre visibles (para testing)
export const AlwaysVisible = (args) => {
  const [isPlaying, setIsPlaying] = useState(args.isPlaying || false);
  
  return (
    <VideoPlayerWrapper>
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'all'
      }}>
        <VideoPlayerOverlay
          {...args}
          isPlaying={isPlaying}
          onSkipBack={() => {
            args.onSkipBack();

          }}
          onPlayPause={() => {
            setIsPlaying(!isPlaying);
            args.onPlayPause();

          }}
          onSkipForward={() => {
            args.onSkipForward();

          }}
        />
      </div>
    </VideoPlayerWrapper>
  );
};

AlwaysVisible.args = {
  isPlaying: false,
  skipSeconds: 10,
  className: ''
};

// Historia interactiva para testing
export const Interactive = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [skipSeconds, setSkipSeconds] = useState(10);
  
  return (
    <div>
      <div style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        marginBottom: '20px',
        borderRadius: '8px'
      }}>
        <h3>Controles de prueba</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <label>
            <input
              type="checkbox"
              checked={isPlaying}
              onChange={(e) => setIsPlaying(e.target.checked)}
            />
            Reproduciendo
          </label>
          <label>
            Skip segundos:
            <input
              type="number"
              value={skipSeconds}
              onChange={(e) => setSkipSeconds(parseInt(e.target.value))}
              min="5"
              max="60"
              step="5"
              style={{ marginLeft: '10px', width: '60px' }}
            />
          </label>
        </div>
      </div>
      
      <VideoPlayerWrapper>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          opacity: 1,
          visibility: 'visible',
          pointerEvents: 'all'
        }}>
          <VideoPlayerOverlay
            isPlaying={isPlaying}
            skipSeconds={skipSeconds}
            onPlayPause={() => {
              setIsPlaying(!isPlaying);

            }}
          />
        </div>
      </VideoPlayerWrapper>
    </div>
  );
};

// Historia con tema claro (si se implementa)
export const LightTheme = Template.bind({});
LightTheme.args = {
  isPlaying: false,
  skipSeconds: 10,
  className: 'video-player-overlay--light'
};

LightTheme.parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'gray', value: '#f0f0f0' },
    ],
  },
};

// Historia responsive - Mobile
export const Mobile = Template.bind({});
Mobile.args = {
  isPlaying: false,
  skipSeconds: 10,
  className: ''
};

Mobile.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
};

// Historia responsive - Tablet
export const Tablet = Template.bind({});
Tablet.args = {
  isPlaying: false,
  skipSeconds: 10,
  className: ''
};

Tablet.parameters = {
  viewport: {
    defaultViewport: 'tablet',
  },
};