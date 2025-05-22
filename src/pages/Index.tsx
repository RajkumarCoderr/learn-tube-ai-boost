
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { 
  isYouTubeVideo, 
  getCurrentVideoId, 
  setupMutationObserver,
  applyFocusMode
} from '@/services/youtubeDetector';
import { Youtube } from 'lucide-react';

const ExtensionContent = () => {
  const { setCurrentVideoId, isFocusMode } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const [isYouTube, setIsYouTube] = useState(false);
  
  useEffect(() => {
    // Check if we're on YouTube and get the current video ID
    const checkYouTube = () => {
      const onYouTube = isYouTubeVideo();
      setIsYouTube(onYouTube);
      
      if (onYouTube) {
        const videoId = getCurrentVideoId();
        setCurrentVideoId(videoId);
      } else {
        setCurrentVideoId(null);
      }
    };
    
    // Initial check
    checkYouTube();
    
    // Set up observer to detect page navigation on YouTube
    const observer = setupMutationObserver((videoId) => {
      setCurrentVideoId(videoId);
      setIsYouTube(!!videoId);
    });
    
    // Listen for events from the background script
    const handleVideoChanged = (event: CustomEvent) => {
      const { videoId } = event.detail;
      setCurrentVideoId(videoId);
      setIsYouTube(!!videoId);
    };
    
    window.addEventListener('youtube-video-changed', handleVideoChanged as EventListener);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('youtube-video-changed', handleVideoChanged as EventListener);
    };
  }, [setCurrentVideoId]);

  // Apply focus mode effect
  useEffect(() => {
    applyFocusMode(isFocusMode);
    return () => applyFocusMode(false); // Clean up on unmount
  }, [isFocusMode]);

  // Toggle extension visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // In a real extension, we'd only show when on YouTube
  // For development, we'll show even if not on YouTube
  const shouldShowExtension = isYouTube || process.env.NODE_ENV === 'development';

  if (!shouldShowExtension) {
    return null;
  }

  return (
    <>
      {!isVisible && (
        <button 
          onClick={toggleVisibility}
          className="fixed top-4 right-0 z-[10000] bg-primary text-white p-2 rounded-l-lg shadow-lg"
        >
          <Youtube size={24} />
        </button>
      )}
      <div 
        id="youtube-learner-extension"
        className={`fixed top-0 right-0 bottom-0 w-96 z-[9999] shadow-lg transition-transform duration-300 ease-in-out ${isVisible ? '' : 'translate-x-full'}`}
      >
        <Layout />
      </div>
    </>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <ExtensionContent />
    </AppProvider>
  );
};

export default Index;
