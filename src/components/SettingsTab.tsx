
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { AlertCircle } from 'lucide-react';

export const SettingsTab = () => {
  const { apiKey, setApiKey, isFocusMode, setIsFocusMode } = useApp();
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);

  const saveApiKey = () => {
    setApiKey(tempApiKey.trim() || null);
  };

  return (
    <div className="space-y-6 animate-in">
      <h2 className="text-xl font-semibold">Settings</h2>
      
      <Card className="p-4 space-y-4">
        <h3 className="font-medium text-lg">API Keys</h3>
        
        <div className="space-y-2">
          <Label htmlFor="openai-key" className="flex items-center gap-1">
            OpenAI API Key
          </Label>
          <div className="flex gap-2">
            <Input
              id="openai-key"
              type={showApiKey ? "text" : "password"}
              placeholder="sk-..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="font-mono"
            />
            <Button variant="outline" type="button" onClick={() => setShowApiKey(!showApiKey)}>
              {showApiKey ? 'Hide' : 'Show'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Your API key is stored locally and never shared.
          </p>
        </div>
        
        <Button onClick={saveApiKey} className="mt-2">
          Save API Key
        </Button>
        
        {!apiKey && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle size={18} className="text-amber-500 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">API Key Required</p>
              <p className="mt-1">An OpenAI API key is required for generating summaries, quizzes, and comments.</p>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="font-medium text-lg">Display Options</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="focus-mode" className="block">Focus Mode</Label>
            <p className="text-sm text-muted-foreground">
              Hide distracting elements on YouTube
            </p>
          </div>
          <Switch
            id="focus-mode"
            checked={isFocusMode}
            onCheckedChange={setIsFocusMode}
          />
        </div>
      </Card>
      
      <Card className="p-4">
        <h3 className="font-medium text-lg mb-3">About</h3>
        <p className="text-sm text-muted-foreground">
          YouTube Learner Extension v1.0
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Created with Lovable.dev
        </p>
      </Card>
    </div>
  );
};
