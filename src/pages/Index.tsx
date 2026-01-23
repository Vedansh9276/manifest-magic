import ProfileScoutPopup from '@/components/ProfileScoutPopup';
import { Radar, Github, FileCode, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark">
      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="container max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-border flex items-center justify-center">
              <Radar className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile Scout</h1>
              <p className="text-muted-foreground">Manifest V3 Chrome Extension</p>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            A lightweight browser extension that extracts profile data from web pages, 
            displays it in a clean popup, and sends it to backend systems via API.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
              <FileCode className="w-4 h-4" />
              <span className="text-sm font-medium">JavaScript</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Manifest V3</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">DOM Manipulation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Extension Preview */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Extension Preview</h2>
            <div className="rounded-xl overflow-hidden shadow-2xl border border-border inline-block">
              <div className="bg-card border-b border-border px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">Profile Scout Popup</span>
              </div>
              <ProfileScoutPopup />
            </div>
          </div>

          {/* Features & Instructions */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Features</h2>
              <ul className="space-y-3">
                {[
                  'Extracts profile metadata from any webpage',
                  'Detects social links (Twitter, LinkedIn, GitHub, etc.)',
                  'Finds email addresses on the page',
                  'Parses Open Graph and Twitter Card data',
                  'Reads Schema.org JSON-LD structured data',
                  'Sends extracted data to mock API endpoint'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Installation</h2>
              <div className="bg-card border border-border rounded-lg p-4">
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">1</span>
                    <span>Build the project: <code className="bg-secondary px-2 py-0.5 rounded text-foreground">npm run build</code></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">2</span>
                    <span>Open Chrome → <code className="bg-secondary px-2 py-0.5 rounded text-foreground">chrome://extensions</code></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">3</span>
                    <span>Enable "Developer mode" toggle</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">4</span>
                    <span>Click "Load unpacked" → Select the <code className="bg-secondary px-2 py-0.5 rounded text-foreground">dist</code> folder</span>
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Architecture</h2>
              <div className="bg-card border border-border rounded-lg p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <code className="bg-secondary px-2 py-0.5 rounded text-primary">manifest.json</code>
                  <span className="text-muted-foreground">Extension config</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-secondary px-2 py-0.5 rounded text-primary">background.js</code>
                  <span className="text-muted-foreground">Service worker & API</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-secondary px-2 py-0.5 rounded text-primary">content.js</code>
                  <span className="text-muted-foreground">DOM extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-secondary px-2 py-0.5 rounded text-primary">popup (React)</code>
                  <span className="text-muted-foreground">User interface</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
