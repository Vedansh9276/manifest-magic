import ExtensionPopup from '@/components/ExtensionPopup';

const Index = () => {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Extension Preview</h1>
          <p className="text-muted-foreground text-sm max-w-md">
            This is how your extension popup will look. Build and load the extension in your browser to test the full functionality.
          </p>
        </div>
        
        {/* Extension popup preview with browser chrome styling */}
        <div className="rounded-xl overflow-hidden shadow-2xl border border-border">
          <div className="bg-card border-b border-border px-3 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <span className="text-xs text-muted-foreground ml-2">Extension Popup</span>
          </div>
          <ExtensionPopup />
        </div>

        <div className="bg-card border border-border rounded-lg p-4 max-w-md">
          <h2 className="font-medium text-foreground mb-2">How to load the extension:</h2>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Build the project: <code className="bg-muted px-1 rounded">npm run build</code></li>
            <li>Open Chrome and go to <code className="bg-muted px-1 rounded">chrome://extensions</code></li>
            <li>Enable "Developer mode"</li>
            <li>Click "Load unpacked" and select the <code className="bg-muted px-1 rounded">dist</code> folder</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
