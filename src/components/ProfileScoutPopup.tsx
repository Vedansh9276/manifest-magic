import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, 
  Search,
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
  Twitter,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

// Optimized animation variants - simpler, more performant
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 28 }
  },
  exit: { opacity: 0, y: -8 }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 350, damping: 30 }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
    transition: { duration: 0.15 }
  })
};

const ProfileScoutPopup = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [history, setHistory] = useState<GitHubProfile[]>([]);
  const [stats, setStats] = useState<Stats>({ extractionCount: 0, apiCallCount: 0, historyCount: 0 });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [[page, direction], setPage] = useState([0, 0]);

  const isExtension = typeof chrome !== 'undefined' && chrome.runtime?.id;

  useEffect(() => {
    loadStats();
    loadHistory();
  }, []);

  const paginate = (newTab: string) => {
    const newDirection = newTab === 'history' ? 1 : -1;
    setPage([page + newDirection, newDirection]);
    setActiveTab(newTab);
  };

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
      }, 800);
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
    paginate('search');
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
    <div className="w-full min-h-[480px] max-w-[400px] mx-auto bg-background flex flex-col overflow-hidden relative">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="px-4 py-3 border-b border-border relative z-10 bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div 
              className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 8 }}
              whileTap={{ scale: 0.95 }}
            >
              <Radar className="w-4.5 h-4.5 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                Profile Scout
                <motion.span
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </motion.span>
              </h1>
              <p className="text-[11px] text-muted-foreground">GitHub API Connected</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
              <Zap className="w-3 h-3 mr-1 text-primary" />
              {stats.apiCallCount} calls
            </Badge>
          </motion.div>
        </div>
      </motion.header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={paginate} className="flex-1 flex flex-col relative z-10">
        <motion.div
          className="px-3 pt-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="search" className="text-xs gap-1.5 data-[state=active]:shadow-sm">
              <Search className="w-3.5 h-3.5" />
              Search
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs gap-1.5 data-[state=active]:shadow-sm">
              <History className="w-3.5 h-3.5" />
              History ({history.length})
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait" custom={direction}>
          {activeTab === 'search' && (
            <TabsContent value="search" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden" asChild>
              <motion.div
                key="search"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex-1 flex flex-col"
              >
                {/* Search Input */}
                <div className="px-3 py-3 border-b border-border">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter GitHub username..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-9 text-sm"
                    />
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button onClick={fetchProfile} disabled={status === 'loading'} size="sm" className="h-9 px-3">
                        {status === 'loading' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.p 
                        className="mt-2 flex items-center gap-1.5 text-xs text-destructive"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        {error}
                      </motion.p>
                    )}
                    {status === 'success' && (
                      <motion.p 
                        className="mt-2 flex items-center gap-1.5 text-xs text-success"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Profile fetched successfully
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Display */}
                <ScrollArea className="flex-1">
                  <div className="p-3 space-y-3">
                    <AnimatePresence mode="wait">
                      {profile ? (
                        <motion.div
                          key="profile"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="space-y-3"
                        >
                          {/* Profile Header Card */}
                          <motion.div variants={itemVariants}>
                            <Card className="overflow-hidden border">
                              <CardContent className="p-3">
                                <div className="flex items-start gap-3">
                                  <motion.div
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                  >
                                    <Avatar className="w-14 h-14 ring-2 ring-primary/20 ring-offset-1 ring-offset-background">
                                      <AvatarImage src={profile.avatar} />
                                      <AvatarFallback className="text-sm">{profile.username[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <h2 className="font-semibold text-sm text-foreground truncate">
                                        {profile.name || profile.username}
                                      </h2>
                                      {profile.hireable && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-success border-success/50">
                                          Hireable
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">@{profile.username}</p>
                                    {profile.bio && (
                                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{profile.bio}</p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>

                          {/* Stats Grid - 2x2 on mobile */}
                          <motion.div 
                            className="grid grid-cols-4 sm:grid-cols-4 gap-2"
                            variants={itemVariants}
                          >
                            {[
                              { label: 'Repos', value: profile.publicRepos, icon: BookOpen },
                              { label: 'Gists', value: profile.publicGists, icon: BookOpen },
                              { label: 'Followers', value: profile.followers, icon: Users },
                              { label: 'Following', value: profile.following, icon: Users },
                            ].map((stat, index) => (
                              <motion.div
                                key={stat.label}
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <Card className="text-center cursor-pointer hover:border-primary/30 transition-colors">
                                  <CardContent className="p-2.5">
                                    <p className="text-base font-bold text-primary">{formatNumber(stat.value)}</p>
                                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Details Card */}
                          <motion.div variants={itemVariants}>
                            <Card className="border">
                              <CardHeader className="pb-2 pt-3 px-3">
                                <CardTitle className="text-xs flex items-center gap-1.5">
                                  Details
                                  <Sparkles className="w-3 h-3 text-primary" />
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="px-3 pb-3 space-y-1.5">
                                {[
                                  { icon: Building, value: profile.company },
                                  { icon: MapPin, value: profile.location },
                                  { icon: Mail, value: profile.email },
                                ].filter(item => item.value).map((item, index) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-center gap-2 text-xs"
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                  >
                                    <item.icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    <span className="truncate">{item.value}</span>
                                  </motion.div>
                                ))}
                                {profile.blog && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    <a href={profile.blog} target="_blank" rel="noopener noreferrer" 
                                       className="text-primary hover:underline truncate">{profile.blog}</a>
                                  </div>
                                )}
                                {profile.twitter && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <Twitter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    <a href={`https://twitter.com/${profile.twitter}`} target="_blank" 
                                       rel="noopener noreferrer" className="text-primary hover:underline">@{profile.twitter}</a>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                                  <span>Joined {formatDate(profile.createdAt)}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>

                          {/* GitHub Button */}
                          <motion.div variants={itemVariants}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full h-8 text-xs"
                              onClick={() => window.open(profile.profileUrl, '_blank')}
                            >
                              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                              View on GitHub
                            </Button>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="empty"
                          className="flex flex-col items-center justify-center py-16 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <User className="w-10 h-10 text-muted-foreground/40 mb-3" />
                          </motion.div>
                          <p className="text-sm text-muted-foreground">Search for a GitHub user</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">Try: octocat, torvalds, gaearon</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </motion.div>
            </TabsContent>
          )}

          {activeTab === 'history' && (
            <TabsContent value="history" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden" asChild>
              <motion.div
                key="history"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex-1 flex flex-col"
              >
                <div className="px-3 py-2.5 border-b border-border flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Recent searches</span>
                  <Button variant="ghost" size="sm" onClick={clearHistory} disabled={history.length === 0} className="h-7 text-xs">
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Clear
                  </Button>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-3 space-y-2">
                    <AnimatePresence mode="popLayout">
                      {history.length > 0 ? (
                        history.map((item, index) => (
                          <motion.div
                            key={`${item.username}-${index}`}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.05, type: "spring", stiffness: 400 }}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className="cursor-pointer hover:bg-secondary/30 transition-colors border hover:border-primary/30"
                              onClick={() => selectFromHistory(item)}
                            >
                              <CardContent className="p-2.5">
                                <div className="flex items-center gap-2.5">
                                  <Avatar className="w-9 h-9">
                                    <AvatarImage src={item.avatar} />
                                    <AvatarFallback className="text-xs">{item.username[0].toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {item.name || item.username}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">@{item.username}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-xs font-medium text-primary">{formatNumber(item.followers)}</p>
                                    <p className="text-[10px] text-muted-foreground">followers</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div 
                          className="flex flex-col items-center justify-center py-16 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <History className="w-10 h-10 text-muted-foreground/40 mb-3" />
                          </motion.div>
                          <p className="text-sm text-muted-foreground">No search history</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">Search for users to build history</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default ProfileScoutPopup;
