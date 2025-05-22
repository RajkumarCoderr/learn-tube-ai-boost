import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TimeStamp } from '@/types';
import { generateSummary } from '@/services/apiService';
import { seekToTime } from '@/services/youtubeDetector';
import { DownloadCloud, ExternalLink, Eye } from 'lucide-react';
import { ExportDialog } from './ExportDialog';

export const SummaryTab = () => {
  const { videoSummary, isLoading, setIsLoading, setVideoSummary, currentVideoId, setIsFocusMode, isFocusMode } = useApp();
  const [exportOpen, setExportOpen] = useState(false);

  const handleGenerateSummary = async () => {
    if (!currentVideoId) return;
    
    setIsLoading(true);
    try {
      const result = await generateSummary(currentVideoId);
      if (result.success && result.data) {
        setVideoSummary(result.data);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimestampClick = (seconds: number) => {
    // Navigate to specific timestamp in YouTube player
    seekToTime(seconds);
  };

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
  };

  const handleOpenChatGPT = () => {
    if (!videoSummary) return;
    
    const prompt = encodeURIComponent(
      `The following is a summary of a YouTube video titled "${videoSummary.title}":
      
      ${videoSummary.summary}
      
      Key points:
      ${videoSummary.keyPoints.join('\n')}
      
      Highlight the key topics and help me understand the concept better with examples.`
    );
    
    window.open(`https://chat.openai.com/share?prompt=${prompt}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  if (!videoSummary) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-xl font-semibold mb-3">Video Summary</h3>
        <p className="text-muted-foreground mb-4">Generate a summary of the current video to start learning more effectively.</p>
        <Button onClick={handleGenerateSummary} disabled={!currentVideoId}>
          Generate Summary
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{videoSummary.title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleFocusMode}>
            <Eye size={16} className="mr-1" />
            {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <DownloadCloud size={16} className="mr-1" />
            Export
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-card">
        <h3 className="font-semibold mb-2">Summary</h3>
        <p className="text-sm leading-relaxed whitespace-pre-line">{videoSummary.summary}</p>
      </Card>

      <div>
        <h3 className="font-semibold mb-2">Key Points</h3>
        <ul className="list-disc list-inside space-y-1">
          {videoSummary.keyPoints.map((point, index) => (
            <li key={index} className="text-sm">{point}</li>
          ))}
        </ul>
      </div>

      {videoSummary.timestamps && videoSummary.timestamps.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Important Timestamps</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {videoSummary.timestamps.map((timestamp: TimeStamp, index: number) => (
              <div 
                key={index}
                onClick={() => handleTimestampClick(timestamp.seconds)}
                className="flex items-start gap-2 p-2 bg-secondary/50 rounded cursor-pointer hover:bg-secondary"
              >
                <span className="text-primary font-mono whitespace-nowrap">{timestamp.time}</span>
                <span className="text-sm">{timestamp.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex gap-2"
          onClick={handleOpenChatGPT}
        >
          <span>💬</span> Ask ChatGPT
          <ExternalLink size={16} />
        </Button>
      </div>
      
      <ExportDialog 
        open={exportOpen} 
        onOpenChange={setExportOpen} 
        summary={videoSummary} 
      />
    </div>
  );
};
