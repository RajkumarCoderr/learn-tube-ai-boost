
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateCommentVariations } from '@/services/apiService';
import { Copy, Check } from 'lucide-react';

export const CommentsTab = () => {
  const { commentVariations, setCommentVariations, isLoading, setIsLoading, videoSummary } = useApp();
  const [customPrompt, setCustomPrompt] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerateComments = async () => {
    if (!videoSummary) return;
    
    setIsLoading(true);
    try {
      const result = await generateCommentVariations(
        videoSummary.videoId, 
        videoSummary.title, 
        videoSummary.summary,
        customPrompt
      );
      
      if (result.success && result.data) {
        setCommentVariations(result.data);
      }
    } catch (error) {
      console.error('Error generating comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <div className="space-y-3 mt-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in">
      <div>
        <h3 className="text-lg font-semibold mb-2">Comment Generator</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Generate engaging comment variations based on the video content that you can copy and paste.
        </p>
        
        <div className="mb-4">
          <Label htmlFor="comment-prompt" className="text-sm font-medium mb-1 block">
            Custom prompt (optional)
          </Label>
          <Textarea 
            id="comment-prompt" 
            placeholder="E.g., Make it sound enthusiastic, ask a question, etc."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="resize-none h-24"
          />
        </div>
        
        <Button 
          onClick={handleGenerateComments} 
          disabled={!videoSummary}
          className="w-full mb-6"
        >
          Generate Comment Variations
        </Button>
      </div>

      {commentVariations.length > 0 ? (
        <div className="space-y-3">
          {commentVariations.map((comment, index) => (
            <Card key={comment.id} className="p-3 relative group">
              <p className="text-sm mb-2 pr-8">{comment.text}</p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(comment.text, index)}
              >
                {copiedIndex === index ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} />
                )}
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg">
          {videoSummary ? (
            <p>Click "Generate Comment Variations" to create comments you can post.</p>
          ) : (
            <p>Generate a video summary first to create comment variations.</p>
          )}
        </div>
      )}
    </div>
  );
};
