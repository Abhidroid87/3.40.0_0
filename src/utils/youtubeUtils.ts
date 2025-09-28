export interface VideoTimestamp {
  time: number;
  text: string;
}

export const formatTimestamp = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const getCurrentVideoTime = (): number => {
  const video = document.querySelector('video');
  return video ? video.currentTime : 0;
};

export const setVideoTime = (time: number): void => {
  const video = document.querySelector('video');
  if (video) {
    video.currentTime = time;
  }
};

export const saveLastPlaybackPosition = (videoId: string, time: number): void => {
  const positions = JSON.parse(localStorage.getItem('videoPositions') || '{}');
  positions[videoId] = {
    time,
    lastSeen: new Date().toISOString(),
  };
  localStorage.setItem('videoPositions', JSON.stringify(positions));
};

export const getLastPlaybackPosition = (videoId: string): number => {
  const positions = JSON.parse(localStorage.getItem('videoPositions') || '{}');
  return positions[videoId]?.time || 0;
};

export const getVideoId = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
};