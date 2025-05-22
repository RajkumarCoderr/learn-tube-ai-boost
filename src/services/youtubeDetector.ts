
export const isYouTubeVideo = (): boolean => {
  const url = window.location.href;
  return url.includes('youtube.com/watch');
};

export const getCurrentVideoId = (): string | null => {
  const url = new URL(window.location.href);
  return url.searchParams.get('v');
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
