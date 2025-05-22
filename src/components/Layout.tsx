
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummaryTab } from './SummaryTab';
import { QuizTab } from './QuizTab';
import { NotesTab } from './NotesTab';
import { CommentsTab } from './CommentsTab';
import { SettingsTab } from './SettingsTab';
import { useApp } from '@/contexts/AppContext';
import { ChevronLeft, ChevronRight, BookOpen, PenSquare, MessageSquare, Settings } from 'lucide-react';

export const Layout = () => {
  const { currentTab, setCurrentTab, isLoading } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`bg-background h-full flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-12' : 'w-96'
      }`}
    >
      <div className="flex items-center justify-between p-2 border-b">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="font-bold text-primary text-lg">YT Learner</div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleCollapse}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {!isCollapsed ? (
        <div className="flex-1 overflow-y-auto p-4">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="summary" disabled={isLoading}>
                <BookOpen size={16} className="mr-1" /> Summary
              </TabsTrigger>
              <TabsTrigger value="quiz" disabled={isLoading}>
                <PenSquare size={16} className="mr-1" /> Quiz
              </TabsTrigger>
              <TabsTrigger value="comments" disabled={isLoading}>
                <MessageSquare size={16} className="mr-1" /> Comments
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings size={16} className="mr-1" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-0">
              <SummaryTab />
            </TabsContent>

            <TabsContent value="quiz" className="mt-0">
              <QuizTab />
            </TabsContent>

            <TabsContent value="comments" className="mt-0">
              <CommentsTab />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6 mt-6">
          <Button
            variant="ghost"
            size="icon"
            className={`${currentTab === 'summary' ? 'bg-primary/10 text-primary' : ''}`}
            onClick={() => setCurrentTab('summary')}
          >
            <BookOpen size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`${currentTab === 'quiz' ? 'bg-primary/10 text-primary' : ''}`}
            onClick={() => setCurrentTab('quiz')}
          >
            <PenSquare size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`${currentTab === 'comments' ? 'bg-primary/10 text-primary' : ''}`}
            onClick={() => setCurrentTab('comments')}
          >
            <MessageSquare size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`${currentTab === 'settings' ? 'bg-primary/10 text-primary' : ''}`}
            onClick={() => setCurrentTab('settings')}
          >
            <Settings size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};
