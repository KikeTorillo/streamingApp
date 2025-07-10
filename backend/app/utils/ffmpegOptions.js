// utils/ffmpegOptions.js
const { videoConfig } = require('./configMediaQualities');

/**
 * Genera las opciones de FFmpeg para la parte de video.
 */
const generateVideoOptions = (q, index, maxQuality, primaryVideoIndex, originalVideoInfo = null, isOriginalResolution = false) => {
  let opts = [];
  
  // Si es la resolución original y el video ya tiene características válidas, usar copy
  if (isOriginalResolution && originalVideoInfo && canCopyVideo(originalVideoInfo, q)) {
    opts.push('-c:v', 'copy');
    opts.push('-map', `0:v:${primaryVideoIndex}`);
    return opts;
  }
  
  // Transcodificación normal
  opts.push('-c:v', 'h264');
  
  // Usar el perfil configurado desde variables de entorno
  const activeProfile = videoConfig.transcode.activeQualityProfile;
  const profileToUse = index === maxQuality - 1 && activeProfile === 'high'
    ? videoConfig.transcode.profile.high
    : videoConfig.transcode.profile.standard;
  
  opts.push('-profile:v', profileToUse);
  opts.push('-map', `0:v:${primaryVideoIndex}`);
  opts.push('-vf', `scale=${q.w}:${q.h}`);
  opts.push('-pix_fmt', 'yuv420p');
  
  // Usar el CRF configurado desde variables de entorno
  const crfToUse = activeProfile === 'high'
    ? videoConfig.transcode.crf.high
    : videoConfig.transcode.crf.standard;
  
  opts.push('-crf', crfToUse);
  
  // Si es la resolución original, mantener el bitrate original si es menor que el target
  if (isOriginalResolution && originalVideoInfo && originalVideoInfo.bitrate) {
    const originalBitrate = Math.round(originalVideoInfo.bitrate / 1000);
    const targetBitrate = q.vbr;
    const bitrateToUse = originalBitrate < targetBitrate ? originalBitrate : targetBitrate;
    opts.push('-maxrate', `${bitrateToUse}k`);
    opts.push('-bufsize', `${bitrateToUse}k`);
  } else {
    opts.push('-maxrate', `${q.vbr}k`);
    opts.push('-bufsize', `${q.vbr}k`);
  }
  
  return opts;
};

/**
 * Verifica si el video puede ser copiado sin transcodificar
 */
const canCopyVideo = (originalVideoInfo, targetQuality) => {
  if (!originalVideoInfo) return false;
  
  // CRÍTICO: Verificar que el codec sea h264
  const validCodecs = ['h264', 'libx264'];
  if (!validCodecs.includes(originalVideoInfo.codec)) return false;
  
  // Verificar resolución (exacta o muy cercana)
  const heightDiff = Math.abs(originalVideoInfo.height - targetQuality.h);
  const widthDiff = targetQuality.w ? Math.abs(originalVideoInfo.width - targetQuality.w) : 0;
  if (heightDiff > 2 || widthDiff > 2) return false;
  
  // Verificar bitrate si está disponible
  if (originalVideoInfo.bitrate) {
    const originalBitrate = originalVideoInfo.bitrate / 1000; // Convertir a kbps
    const targetBitrate = targetQuality.vbr;
    const minBitrate = Math.min(targetBitrate * 0.2, 1000);
    const maxBitrate = targetBitrate * 3.0;
    
    if (originalBitrate < minBitrate || originalBitrate > maxBitrate) return false;
  }
  
  return true;
};

/**
 * Genera las opciones de FFmpeg para la parte de audio.
 */
const generateAudioOptions = (audioStreams, q) => {
  let opts = [];
  if (audioStreams.length > 0) {
    opts.push('-map', '0:a');
    opts.push('-c:a', 'aac', '-ac', '2', '-b:a', `${q.abr}k`);
  }
  return opts;
};

/**
 * Genera las opciones de FFmpeg para la parte de subtítulos.
 */
const generateSubtitleOptions = (subtitleStreams) => {
  let opts = [];
  if (subtitleStreams.length > 0) {
    opts.push('-map', '0:s');
    opts.push('-c:s', 'mov_text');
  } else {
    opts.push('-sn');
  }
  return opts;
};

/**
 * Combina las opciones de video, audio y subtítulos.
 */
const generateOutputOptions = (
  q,
  index,
  maxQuality,
  primaryVideoIndex,
  audioStreams,
  subtitleStreams,
  originalVideoInfo = null,
  isOriginalResolution = false
) => {
  const videoOpts = generateVideoOptions(
    q,
    index,
    maxQuality,
    primaryVideoIndex,
    originalVideoInfo,
    isOriginalResolution
  );
  const audioOpts = generateAudioOptions(audioStreams, q);
  const subtitleOpts = generateSubtitleOptions(subtitleStreams);
  return [...videoOpts, ...audioOpts, ...subtitleOpts];
};

module.exports = {
  generateOutputOptions,
};
