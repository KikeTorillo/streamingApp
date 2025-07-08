import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css";
import hlsQualitySelector from "videojs-hls-quality-selector";
import "./VideoPlayer.css";
import { useParams, useSearchParams } from 'react-router-dom';
import { getMovieByHashService } from '../../services/Movies/getMovieByIdService';

// Registra los plugins si aún no están registrados
if (typeof videojs.getPlugin("hlsQualitySelector") !== "function") {
  videojs.registerPlugin("hlsQualitySelector", hlsQualitySelector);
}

const VideoPlayer = () => {
  const {movieId} = useParams();
  const [searchParams] = useSearchParams();
  const resolutions = searchParams.get('resolutions');
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);

  const cdnUrl = import.meta.env.VITE_CDN_URL || 'http://localhost:8082';
  const baseUrl = `${cdnUrl}/hls/${movieId}/`;
  const subsUrl = `${cdnUrl}/subs/${movieId}/`;
  
  // Validate required parameters
  if (!movieId) {
    return (
      <div className="video-player-container">
        <div className="video-info">
          <h2>Error: ID de video no encontrado</h2>
          <p>Verifica que la URL sea correcta</p>
        </div>
      </div>
    );
  }

  if (!resolutions) {
    return (
      <div className="video-player-container">
        <div className="video-info">
          <h2>Error: Resoluciones no encontradas</h2>
          <p>Verifica que la URL contenga parámetros de resolución</p>
        </div>
      </div>
    );
  }

  const urlComplete = `${baseUrl}_,${resolutions},p.mp4.play/master.m3u8`;

  // Load movie data
  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);
        const movie = await getMovieByHashService(movieId);
        setMovieData(movie);
      } catch (error) {
        console.error('Error loading movie data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadMovieData();
    }
  }, [movieId]);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        if (!movieData || loading) {
          return;
        }
        
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        if (!videoRef.current) {
          console.error("El elemento <video> no está disponible en el DOM.");
          return;
        }
        
        if (playerRef.current) {
          playerRef.current.dispose();
        }
        
        // Prepare subtitles
        const subtitleTracks = [];
        if (movieData.available_subtitles && movieData.available_subtitles.length > 0) {
          movieData.available_subtitles.forEach(subtitle => {
            // Determine language and label
            let language = 'es';
            let label = 'Español';
            
            if (subtitle.includes('eng')) {
              language = 'en';
              label = 'English';
            } else if (subtitle.includes('spa')) {
              language = 'es';
              label = 'Español';
            }
            
            if (subtitle.includes('forced')) {
              label += ' (Forzado)';
            }
            
            const track = {
              kind: 'subtitles',
              src: `${subsUrl}${subtitle}.vtt`,
              srclang: language,
              label: label,
              default: false
            };
            
            subtitleTracks.push(track);
          });
        }

        const player = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          preload: "auto",
          fluid: true,
          sources: [
            {
              src: urlComplete,
              type: "application/x-mpegURL",
            },
          ],
          html5: {
            vhs: {
              overrideNative: true,
            },
            nativeControlsForTouch: false,
            playsinline: true,
          },
          pip: true,
          controlBar: {
            children: [
              "playToggle",
              "volumePanel",
              "currentTimeDisplay",
              "timeDivider",
              "durationDisplay",
              "progressControl",
              "remainingTimeDisplay",
              "audioTrackButton",
              "subsCapsButton",
              "pictureInPictureToggle",
              "fullscreenToggle",
            ],
          },
        });
        
        // Wait for video metadata to load before adding subtitles
        player.ready(() => {
          // Add subtitles after player is ready and video metadata is loaded
          if (subtitleTracks.length > 0) {
            subtitleTracks.forEach((track) => {
              console.log('Adding subtitle track:', track.label, 'URL:', track.src);
              player.addRemoteTextTrack(track, false);
            });
          }
        });

        // Enable quality selection
        player.hlsQualitySelector({
          displayCurrentQuality: true,
        });

        // Add listeners for subtitle events
        player.on('texttrackchange', () => {
          console.log('Text track changed');
        });

        // Handle subtitle activation and audio tracks after video loads
        player.on("loadedmetadata", () => {
          // Configure subtitles after metadata is loaded
          setTimeout(() => {
            const textTracks = player.textTracks();
            
            // Disable all subtitle tracks first
            for (let i = 0; i < textTracks.length; i++) {
              const track = textTracks[i];
              if (track.kind === 'subtitles') {
                track.mode = 'disabled';
              }
            }
            
            // Enable the first Spanish subtitle track (non-forced)
            for (let i = 0; i < textTracks.length; i++) {
              const track = textTracks[i];
              console.log('Text track found:', track.label, 'Mode:', track.mode, 'Language:', track.language);
              if (track.kind === 'subtitles' && track.language === 'es' && !track.label.includes('Forzado')) {
                track.mode = 'showing';
                console.log('Subtítulos activados:', track.label);
                player.trigger('texttrackchange');
                break;
              }
            }
          }, 500);
        });


        // Error handling
        player.on('error', (e) => {
          console.error('VideoJS Error:', e);
          const error = player.error();
          if (error) {
            console.error('Error details:', error);
          }
        });

        playerRef.current = player;
        
      } catch (error) {
        console.error("Error initializing player:", error);
      }
    };

    initializePlayer();
    
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [urlComplete, movieData, loading]);

  if (loading) {
    return (
      <div className="video-player-container">
        <div className="video-info">
          <h2>Cargando película...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <div className="video-info">
          <h2>Reproduciendo: {movieData?.title || 'Video'}</h2>
          <p>Movie ID: {movieId}</p>
          <p>Resoluciones: {resolutions}</p>
          {movieData?.available_subtitles && movieData.available_subtitles.length > 0 && (
            <p>Subtítulos: {movieData.available_subtitles.join(', ')}</p>
          )}
        </div>
        
        <div className="video-container">
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-default-skin vjs-big-play-centered"
              controls
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export { VideoPlayer };