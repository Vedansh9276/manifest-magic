import { useState, useEffect } from 'react';
import { 
  Radar, 
  Search,
  RefreshCw, 
  Trash2, 
  User, 
  MapPin,
  Mail,
  Link as LinkIcon,
  Building,
  Calendar,
  Users,
  BookOpen,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
  History,
  Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Chrome API declaration
declare const chrome: {
  runtime?: {
    id?: string;
    sendMessage: (message: unknown, callback?: (response: unknown) => void) => void;
  };
};

interface GitHubProfile {
  username: string;
  name: string | null;
  avatar: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  twitter: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
  profileUrl: string;
  hireable: boolean | null;
  type: string;
  fetchedAt?: string;
}

interface Stats {
  extractionCount: number;
  apiCallCount: number;
  historyCount: number;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const ProfileScoutPopup = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [history, setHistory] = useState<GitHubProfile[]>([]);
  const [stats, setStats] = useState<Stats>({ extractionCount: 0, apiCallCount: 0, historyCount: 0 });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  const isExtension = typeof chrome !== 'undefined' && chrome.runtime?.id;

  useEffect(() => {
    loadStats();
    loadHistory();
  }, []);

  const loadStats = () => {
    if (isExtension) {
      chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response: unknown) => {
        const res = response as Stats;
        if (res) setStats(res);
      });
    }
  };

  const loadHistory = () => {
    if (isExtension) {
      chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (response: unknown) => {
        const res = response as { history: GitHubProfile[] };
        if (res?.history) setHistory(res.history);
      });
    } else {
      // Demo history
      setHistory([
        {
          username: 'torvalds',
          name: 'Linus Torvalds',
          avatar: 'https://avatars.githubusercontent.com/u/1024025',
          bio: null,
          company: 'Linux Foundation',
          location: 'Portland, OR',
          email: null,
          blog: null,
          twitter: null,
          publicRepos: 7,
          publicGists: 0,
          followers: 200000,
          following: 0,
          createdAt: '2011-09-03T15:26:22Z',
          updatedAt: '2024-01-01T00:00:00Z',
          profileUrl: 'https://github.com/torvalds',
          hireable: null,
          type: 'User',
          fetchedAt: new Date().toISOString()
        }
      ]);
      setStats({ extractionCount: 5, apiCallCount: 12, historyCount: 1 });
    }
  };

  const fetchProfile = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setStatus('loading');
    setError('');
    setProfile(null);

    if (isExtension) {
      chrome.runtime.sendMessage(
        { type: 'FETCH_GITHUB_PROFILE', username: username.trim() },
        (response: unknown) => {
          const res = response as { success: boolean; profile?: GitHubProfile; error?: string };
          if (res?.success && res.profile) {
            setProfile(res.profile);
            setStatus('success');
            loadStats();
            loadHistory();
          } else {
            setError(res?.error || 'Failed to fetch profile');
            setStatus('error');
          }
        }
      );
    } else {
      // Demo mode - simulate API call
      setTimeout(() => {
        if (username.toLowerCase() === 'notfound') {
          setError('User not found');
          setStatus('error');
        } else {
          setProfile({
            username: username,
            name: 'Demo User',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            bio: 'This is a demo profile. In extension mode, real GitHub data is fetched!',
            company: 'Demo Company',
            location: 'San Francisco, CA',
            email: 'demo@example.com',
            blog: 'https://example.com',
            twitter: 'demouser',
            publicRepos: 42,
            publicGists: 5,
            followers: 1234,
            following: 567,
            createdAt: '2020-01-01T00:00:00Z',
            updatedAt: new Date().toISOString(),
            profileUrl: `https://github.com/${username}`,
            hireable: true,
            type: 'User'
          });
          setStatus('success');
          setStats(prev => ({ ...prev, apiCallCount: prev.apiCallCount + 1 }));
        }
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchProfile();
  };

  const clearHistory = () => {
    if (isExtension) {
      chrome.runtime.sendMessage({ type: 'CLEAR_HISTORY' }, () => {
        setHistory([]);
        setProfile(null);
        loadStats();
      });
    } else {
      setHistory([]);
      setProfile(null);
    }
  };

  const selectFromHistory = (historyProfile: GitHubProfile) => {
    setProfile(historyProfile);
    setUsername(historyProfile.username);
    setActiveTab('search');
    setStatus('success');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="extension-popup bg-background dark flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-border flex items-center justify-center">
              <Radar className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Profile Scout</h1>
              <p className="text-xs text-muted-foreground">GitHub API Connected</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {stats.apiCallCount} API calls
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4" style={{ width: 'calc(100% - 32px)' }}>
          <TabsTrigger value="search">
            <Search className="w-4 h-4 mr-2" />
            Search
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            History ({history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={fetchProfile} disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {error && (
              <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            {status === 'success' && (
              <div className="mt-2 flex items-center gap-2 text-sm text-success">
                <CheckCircle2 className="w-4 h-4" />
                Profile fetched from GitHub API
              </div>
            )}
          </div>

          {/* Profile Display */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {profile ? (
                <>
                  {/* Profile Header */}
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-foreground truncate">
                              {profile.name || profile.username}
                            </h2>
                            {profile.hireable && (
                              <Badge variant="outline" className="text-xs text-success border-success">
                                Hireable
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">@{profile.username}</p>
                          {profile.bio && (
                            <p className="text-sm text-foreground mt-2 line-clamp-2">{profile.bio}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Repos', value: profile.publicRepos, icon: BookOpen },
                      { label: 'Gists', value: profile.publicGists, icon: BookOpen },
                      { label: 'Followers', value: profile.followers, icon: Users },
                      { label: 'Following', value: profile.following, icon: Users },
                    ].map((stat) => (
                      <Card key={stat.label} className="text-center">
                        <CardContent className="p-3">
                          <p className="text-lg font-bold text-primary">{formatNumber(stat.value)}</p>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Details */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {profile.company && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span>{profile.company}</span>
                        </div>
                      )}
                      {profile.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-xs">{profile.email}</span>
                        </div>
                      )}
                      {profile.blog && (
                        <div className="flex items-center gap-2 text-sm">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          <a href={profile.blog} target="_blank" rel="noopener noreferrer" 
                             className="text-primary hover:underline truncate">
                            {profile.blog}
                          </a>
                        </div>
                      )}
                      {profile.twitter && (
                        <div className="flex items-center gap-2 text-sm">
                          <Twitter className="w-4 h-4 text-muted-foreground" />
                          <a href={`https://twitter.com/${profile.twitter}`} target="_blank" 
                             rel="noopener noreferrer" className="text-primary hover:underline">
                            @{profile.twitter}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Joined {formatDate(profile.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* View on GitHub */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(profile.profileUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <User className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-sm">Search for a GitHub user</p>
                  <p className="text-muted-foreground/70 text-xs mt-1">
                    Try: octocat, torvalds, gaearon
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="history" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Recent searches</span>
            <Button variant="ghost" size="sm" onClick={clearHistory} disabled={history.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <Card 
                    key={`${item.username}-${index}`} 
                    className="cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() => selectFromHistory(item)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback>{item.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name || item.username}</p>
                          <p className="text-xs text-muted-foreground">@{item.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{formatNumber(item.followers)}</p>
                          <p className="text-xs text-muted-foreground">followers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <History className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-sm">No search history</p>
                  <p className="text-muted-foreground/70 text-xs mt-1">
                    Searched profiles will appear here
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{isExtension ? 'Extension Mode' : 'Preview Mode (Demo)'}</span>
          <span>Powered by GitHub API</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileScoutPopup;
