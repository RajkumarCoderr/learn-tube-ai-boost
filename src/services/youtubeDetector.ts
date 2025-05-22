
export const isYouTubeVideo = (): boolean => {
  const url = window.location.href;
  return url.includes('youtube.com/watch');
};

export const getCurrentVideoId = (): string | null => {
  const url = new URL(window.location.href);
  return url.searchParams.get('v');
};

export const getCurrentVideoTitle = (): string | null => {
  // Try to get the video title from YouTube's page
  const titleElement = document.querySelector('h1.title.ytd-video-primary-info-renderer');
  if (titleElement) {
    return titleElement.textContent?.trim() || null;
  }
  return null;
};

export const getCurrentChannel = (): string | null => {
  // Try to get the channel name
  const channelElement = document.querySelector('#owner-name a');
  if (channelElement) {
    return channelElement.textContent?.trim() || null;
  }
  return null;
};

export const setupMutationObserver = (callback: (videoId: string | null) => void): MutationObserver => {
  // This observer will detect when YouTube's SPA navigation changes pages
  // It's needed because YouTube doesn't fully reload the page when navigating between videos
  
  const observer = new MutationObserver(() => {
    if (isYouTubeVideo()) {
      const videoId = getCurrentVideoId();
      callback(videoId);
    } else {
      callback(null);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
};

// Function to get the YouTube player element
export const getYouTubePlayer = (): HTMLElement | null => {
  return document.querySelector('#movie_player');
};

// Function to seek to specific time in video
export const seekToTime = (seconds: number): void => {
  const player = getYouTubePlayer();
  if (player && player.hasOwnProperty('seekTo')) {
    // @ts-ignore - YouTube player API
    player.seekTo(seconds);
  }
};
