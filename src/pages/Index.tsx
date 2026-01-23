import ProfileScoutPopup from '@/components/ProfileScoutPopup';
import { Radar, Github, Zap, Database, Search, Users } from 'lucide-react';

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
            A browser extension that fetches real profile data from the <span className="text-primary font-medium">GitHub API</span>, 
            displays it in a clean popup, and demonstrates API integration in browser extensions.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">GitHub API</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Manifest V3</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">Real-time Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Extension Preview */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Live Preview</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Try searching for GitHub users below. In preview mode, demo data is shown. 
              Install the extension for real API calls.
            </p>
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
              <h2 className="text-lg font-semibold text-foreground mb-4">What it does</h2>
              <ul className="space-y-3">
                {[
                  { icon: Search, text: 'Search any GitHub user by username' },
                  { icon: Users, text: 'View followers, repos, and profile details' },
                  { icon: Database, text: 'Real-time data from GitHub REST API' },
                  { icon: Zap, text: 'Search history with local storage' },
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <feature.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">API Details</h2>
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Endpoint</p>
                  <code className="text-sm text-primary bg-secondary px-2 py-1 rounded">
                    https://api.github.com/users/:username
                  </code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Auth Required</p>
                  <p className="text-sm text-foreground">No (public API, 60 requests/hour)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Try these usernames</p>
                  <div className="flex flex-wrap gap-2">
                    {['octocat', 'torvalds', 'gaearon', 'sindresorhus', 'tj'].map(name => (
                      <code key={name} className="text-xs bg-secondary px-2 py-1 rounded text-foreground">
                        {name}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Installation</h2>
              <div className="bg-card border border-border rounded-lg p-4">
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">1</span>
                    <span>Build: <code className="bg-secondary px-2 py-0.5 rounded text-foreground">npm run build</code></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">2</span>
                    <span>Open <code className="bg-secondary px-2 py-0.5 rounded text-foreground">chrome://extensions</code></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">3</span>
                    <span>Enable "Developer mode"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">4</span>
                    <span>Click "Load unpacked" → Select <code className="bg-secondary px-2 py-0.5 rounded text-foreground">dist</code></span>
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Architecture</h2>
              <div className="bg-card border border-border rounded-lg p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <code className="bg-secondary px-2 py-0.5 rounded text-primary">background.js</code>
                  <span className="text-muted-foreground">GitHub API calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-secondary px-2 py-0.5 rounded text-primary">content.js</code>
                  <span className="text-muted-foreground">Page extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-secondary px-2 py-0.5 rounded text-primary">popup (React)</code>
                  <span className="text-muted-foreground">User interface</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-secondary px-2 py-0.5 rounded text-primary">chrome.storage</code>
                  <span className="text-muted-foreground">Persistent history</span>
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
