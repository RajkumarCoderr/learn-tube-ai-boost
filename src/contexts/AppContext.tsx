
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VideoSummary, Quiz, UserNote, CommentVariation } from '../types';

interface AppContextType {
  videoSummary: VideoSummary | null;
  quiz: Quiz | null;
  userNotes: UserNote[];
  commentVariations: CommentVariation[];
  isLoading: boolean;
  isFocusMode: boolean;
  currentVideoId: string | null;
  currentTab: string;
  apiKey: string | null;
  
  setVideoSummary: (summary: VideoSummary | null) => void;
  setQuiz: (quiz: Quiz | null) => void;
  setUserNotes: (notes: UserNote[]) => void;
  addUserNote: (note: UserNote) => void;
  removeUserNote: (noteId: string) => void;
  setCommentVariations: (comments: CommentVariation[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsFocusMode: (mode: boolean) => void;
  setCurrentVideoId: (videoId: string | null) => void;
  setCurrentTab: (tab: string) => void;
  setApiKey: (key: string | null) => void;
  clearData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videoSummary, setVideoSummary] = useState<VideoSummary | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [commentVariations, setCommentVariations] = useState<CommentVariation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('summary');
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Load saved data from localStorage
    const savedApiKey = localStorage.getItem('yt-learner-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    // Apply focus mode if it was active
    const focusMode = localStorage.getItem('yt-learner-focus-mode') === 'true';
    if (focusMode) {
      setIsFocusMode(true);
    }
  }, []);

  useEffect(() => {
    // Save focus mode preference
    if (isFocusMode) {
      document.body.classList.add('youtube-focus-mode');
      localStorage.setItem('yt-learner-focus-mode', 'true');
    } else {
      document.body.classList.remove('youtube-focus-mode');
      localStorage.setItem('yt-learner-focus-mode', 'false');
    }
  }, [isFocusMode]);

  useEffect(() => {
    // Save API key to localStorage
    if (apiKey) {
      localStorage.setItem('yt-learner-api-key', apiKey);
    } else {
      localStorage.removeItem('yt-learner-api-key');
    }
  }, [apiKey]);

  const addUserNote = (note: UserNote) => {
    setUserNotes((prev) => [...prev, note]);
  };

  const removeUserNote = (noteId: string) => {
    setUserNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const clearData = () => {
    setVideoSummary(null);
    setQuiz(null);
    setUserNotes([]);
    setCommentVariations([]);
    setCurrentVideoId(null);
  };

  return (
    <AppContext.Provider
      value={{
        videoSummary,
        quiz,
        userNotes,
        commentVariations,
        isLoading,
        isFocusMode,
        currentVideoId,
        currentTab,
        apiKey,
        setVideoSummary,
        setQuiz,
        setUserNotes,
        addUserNote,
        removeUserNote,
        setCommentVariations,
        setIsLoading,
        setIsFocusMode,
        setCurrentVideoId,
        setCurrentTab,
        setApiKey,
        clearData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
