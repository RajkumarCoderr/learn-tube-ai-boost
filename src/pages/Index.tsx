
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { isYouTubeVideo, getCurrentVideoId, setupMutationObserver } from '@/services/youtubeDetector';

const ExtensionContent = () => {
  const { setCurrentVideoId } = useApp();
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
    
    return () => {
      observer.disconnect();
    };
  }, [setCurrentVideoId]);

  // Toggle extension visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // For the demo in Lovable, we'll show even if not on YouTube
  // In a real extension, you would check isYouTube here
  const shouldShowExtension = true; // isYouTube for real extension

  if (!shouldShowExtension) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">YouTube Learner</h1>
          <p className="text-muted-foreground mb-6">
            Please navigate to a YouTube video to use this extension.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="youtube-learner-extension"
      className={`${isVisible ? '' : 'youtube-learner-hidden'}`}
    >
      <Layout />
    </div>
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
