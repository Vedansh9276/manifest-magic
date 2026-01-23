import { useState, useEffect } from 'react';
import { Power, MousePointerClick, Settings, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Declare chrome as a global for extension API
declare const chrome: {
  runtime?: {
    id?: string;
    sendMessage: (message: unknown, callback?: (response: ExtensionState) => void) => void;
  };
  storage?: {
    local: {
      get: (keys: string[], callback: (result: Record<string, unknown>) => void) => void;
      set: (items: Record<string, unknown>, callback?: () => void) => void;
    };
  };
};

interface ExtensionState {
  enabled: boolean;
  clickCount: number;
}

const ExtensionPopup = () => {
  const [state, setState] = useState<ExtensionState>({ enabled: true, clickCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Check if running in extension context
  const isExtension = typeof chrome !== 'undefined' && chrome.runtime?.id;

  useEffect(() => {
    if (isExtension) {
      chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
        if (response) {
          setState(response);
        }
        setIsLoading(false);
      });
    } else {
      // Demo mode for preview
      setIsLoading(false);
    }
  }, [isExtension]);

  const handleToggle = () => {
    if (isExtension) {
      chrome.runtime.sendMessage({ type: 'TOGGLE_STATUS' }, (response) => {
        if (response) {
          setState(prev => ({ ...prev, enabled: response.enabled }));
        }
      });
    } else {
      setState(prev => ({ ...prev, enabled: !prev.enabled }));
    }
  };

  const handleClick = () => {
    if (isExtension) {
      chrome.runtime.sendMessage({ type: 'INCREMENT_CLICK' }, (response) => {
        if (response) {
          setState(prev => ({ ...prev, clickCount: response.clickCount }));
        }
      });
    } else {
      setState(prev => ({ ...prev, clickCount: prev.clickCount + 1 }));
    }
  };

  if (isLoading) {
    return (
      <div className="extension-popup flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="extension-popup bg-background p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Power className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">My Extension</h1>
            <p className="text-xs text-muted-foreground">v1.0.0</p>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${state.enabled ? 'bg-success' : 'bg-muted-foreground'}`} />
      </div>

      <Separator />

      {/* Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Extension Status
            <Switch checked={state.enabled} onCheckedChange={handleToggle} />
          </CardTitle>
          <CardDescription>
            {state.enabled ? 'Extension is active and running' : 'Extension is currently disabled'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Click Counter Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MousePointerClick className="w-4 h-4" />
            Click Counter
          </CardTitle>
          <CardDescription>
            Track your interactions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-primary">{state.clickCount}</div>
            <Button onClick={handleClick} size="sm">
              Click Me
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          About
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-2">
        <p className="text-xs text-center text-muted-foreground">
          {isExtension ? 'Running in extension mode' : 'Preview mode (demo)'}
        </p>
      </div>
    </div>
  );
};

export default ExtensionPopup;
