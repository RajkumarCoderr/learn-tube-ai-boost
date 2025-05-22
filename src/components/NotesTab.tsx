
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { seekToTime } from '@/services/youtubeDetector';
import { Label } from '@/components/ui/label';
import { UserNote } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { Clock } from 'lucide-react';

export const NotesTab = () => {
  const { videoSummary, userNotes, setUserNotes } = useApp();
  const [noteText, setNoteText] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState('00:00');
  const [currentSeconds, setCurrentSeconds] = useState(0);
  
  // Get current video time
  const getCurrentTime = () => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      const seconds = Math.floor(videoElement.currentTime);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      
      setCurrentTimestamp(formattedTime);
      setCurrentSeconds(seconds);
    }
  };
  
  // Add a new note
  const addNote = () => {
    if (noteText.trim() && videoSummary) {
      const newNote: UserNote = {
        id: uuidv4(),
        videoId: videoSummary.videoId,
        timestamp: currentTimestamp,
        seconds: currentSeconds,
        text: noteText,
        createdAt: new Date()
      };
      
      setUserNotes([...userNotes, newNote]);
      setNoteText('');
      
      // In a real extension, you'd save this to Chrome Storage
      localStorage.setItem('youtube-learner-notes', JSON.stringify([...userNotes, newNote]));
    }
  };
  
  // Delete a note
  const deleteNote = (noteId: string) => {
    const updatedNotes = userNotes.filter(note => note.id !== noteId);
    setUserNotes(updatedNotes);
    
    // In a real extension, you'd save this to Chrome Storage
    localStorage.setItem('youtube-learner-notes', JSON.stringify(updatedNotes));
  };
  
  // Jump to timestamp in video
  const jumpToTimestamp = (seconds: number) => {
    seekToTime(seconds);
  };
  
  // Filter notes for current video
  const currentVideoNotes = userNotes.filter(
    note => videoSummary && note.videoId === videoSummary.videoId
  );
  
  return (
    <div className="space-y-4 animate-in">
      <h2 className="text-xl font-semibold">Video Notes</h2>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex gap-2 items-center"
            onClick={getCurrentTime}
          >
            <Clock size={16} />
            Get Current Time
          </Button>
          <Input 
            value={currentTimestamp}
            onChange={(e) => setCurrentTimestamp(e.target.value)}
            className="w-20 font-mono"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="note-text">Your note</Label>
          <Textarea
            id="note-text"
            placeholder="Add your note here..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="resize-none min-h-24"
          />
        </div>
        
        <Button 
          onClick={addNote}
          disabled={!videoSummary || !noteText.trim()}
          className="w-full"
        >
          Add Note
        </Button>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Your Notes</h3>
        
        {currentVideoNotes.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {currentVideoNotes.map((note) => (
              <Card key={note.id} className="p-3 relative">
                <div className="flex justify-between items-start mb-1">
                  <button
                    className="text-xs font-mono text-primary"
                    onClick={() => jumpToTimestamp(note.seconds)}
                  >
                    {note.timestamp}
                  </button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => deleteNote(note.id)}
                  >
                    ×
                  </Button>
                </div>
                <p className="text-sm">{note.text}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-6 border border-dashed rounded-lg">
            {videoSummary ? (
              <p>No notes yet. Add your first note above.</p>
            ) : (
              <p>Generate a video summary first to add notes.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
