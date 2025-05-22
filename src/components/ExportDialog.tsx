
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VideoSummary, Quiz, ExportFormat } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { FileText, FileDown } from 'lucide-react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: VideoSummary;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  summary,
}) => {
  const { quiz } = useApp();
  const [format, setFormat] = useState<ExportFormat>('pdf');
  
  const handleExport = async () => {
    // In a real implementation, this would generate the document
    // For now, we'll simulate a download with a setTimeout
    
    // Prepare the export data
    const exportData = {
      title: summary.title,
      summary: summary.summary,
      keyPoints: summary.keyPoints,
      quiz: quiz ? quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        answer: q.correctAnswer
      })) : [],
      timestamp: new Date().toISOString()
    };
    
    // For demonstration purposes, we'll create a JSON file download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.title.substring(0, 30)}_notes.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Notes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Choose a format to export your video notes and summary.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={format === 'pdf' ? 'default' : 'outline'}
              onClick={() => setFormat('pdf')}
              className="flex flex-col items-center justify-center h-24 p-3"
            >
              <FileText size={24} className="mb-2" />
              <span>PDF Document</span>
            </Button>
            
            <Button
              variant={format === 'docx' ? 'default' : 'outline'}
              onClick={() => setFormat('docx')}
              className="flex flex-col items-center justify-center h-24 p-3"
            >
              <FileDown size={24} className="mb-2" />
              <span>Word Document</span>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>The export will include:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Video title and summary</li>
              <li>Key points</li>
              {quiz && <li>Generated quiz questions</li>}
              <li>Timestamps with descriptions</li>
            </ul>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleExport}>
              Export Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
