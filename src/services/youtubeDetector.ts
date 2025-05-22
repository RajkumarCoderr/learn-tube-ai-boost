
export const isYouTubeVideo = (): boolean => {
  const url = window.location.href;
  return url.includes('youtube.com/watch');
};

export const getCurrentVideoId = (): string | null => {
  const url = new URL(window.location.href);
  return url.searchParams.get('v');
};

export const getCurrentVideoTitle = (): string | null => {
  // YouTube's DOM structure - find the video title
  const titleElement = document.querySelector('h1.title.ytd-video-primary-info-renderer, h1.title');
  if (titleElement) {
    return titleElement.textContent?.trim() || null;
  }
  return null;
};

export const getCurrentChannel = (): string | null => {
  // Try to get the channel name
  const channelElement = document.querySelector('#owner-name a, #channel-name a');
  if (channelElement) {
    return channelElement.textContent?.trim() || null;
  }
  return null;
};

export const setupMutationObserver = (callback: (videoId: string | null) => void): MutationObserver => {
  // This observer detects when YouTube's SPA navigation changes pages
  // It's needed because YouTube doesn't fully reload the page when navigating between videos
  
  const observer = new MutationObserver((mutations) => {
    // Check if the URL has changed
    if (window.location.href !== observer.lastUrl) {
      observer.lastUrl = window.location.href;
      
      if (isYouTubeVideo()) {
        const videoId = getCurrentVideoId();
        callback(videoId);
      } else {
        callback(null);
      }
    }
  });
  
  // Save the current URL for comparison
  observer.lastUrl = window.location.href;
  
  // Observe the document for title changes, which often happen on navigation
  observer.observe(document.querySelector('title')!, {
    subtree: true,
    characterData: true,
    childList: true
  });
  
  return observer;
};

// Extension to the MutationObserver interface for our custom property
declare global {
  interface MutationObserver {
    lastUrl?: string;
  }
}

// Function to get the YouTube player element
export const getYouTubePlayer = (): HTMLElement | null => {
  return document.querySelector('#movie_player');
};

// Function to seek to specific time in video
export const seekToTime = (seconds: number): void => {
  const player = getYouTubePlayer();
  if (player && typeof player.seekTo === 'function') {
    // @ts-ignore - YouTube player API
    player.seekTo(seconds);
  } else if (document.querySelector('video')) {
    // Fallback - try to seek the HTML5 video directly
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.currentTime = seconds;
    }
  }
};

// Apply focus mode to the page
export const applyFocusMode = (enable: boolean): void => {
  if (enable) {
    document.body.classList.add('youtube-focus-mode');
  } else {
    document.body.classList.remove('youtube-focus-mode');
  }
};

// Listen for messages from the background script
chrome.runtime.onMessage?.addListener((message) => {
  if (message.type === 'NEW_VIDEO') {
    // Dispatch a custom event that our app can listen for
    window.dispatchEvent(
      new CustomEvent('youtube-video-changed', { 
        detail: { videoId: message.videoId }
      })
    );
  }
  return true;
});
