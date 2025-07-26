const { videoConfig } = require('../config/configMediaQualities');

/**
 * Genera las opciones de FFmpeg para la parte de video.
 */
const generateVideoOptions = (q, index, maxQuality, primaryVideoIndex, originalVideoInfo = null, isOriginalResolution = false, needsVideoTranscoding = true) => {
  let opts = [];
  
  // Si el video no necesita transcodificación según la validación principal, usar copy
  if (!needsVideoTranscoding && isOriginalResolution && originalVideoInfo) {
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
  isOriginalResolution = false,
  needsVideoTranscoding = true
) => {
  const videoOpts = generateVideoOptions(
    q,
    index,
    maxQuality,
    primaryVideoIndex,
    originalVideoInfo,
    isOriginalResolution,
    needsVideoTranscoding
  );
  const audioOpts = generateAudioOptions(audioStreams, q);
  const subtitleOpts = generateSubtitleOptions(subtitleStreams);
  return [...videoOpts, ...audioOpts, ...subtitleOpts];
};

module.exports = {
  generateOutputOptions,
};
