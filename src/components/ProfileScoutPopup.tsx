import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9, rotateX: -15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: { 
      type: "spring" as const, 
      stiffness: 300, 
      damping: 24 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

const cardHoverVariants = {
  rest: { 
    scale: 1, 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    borderColor: "hsl(var(--border))"
  },
  hover: { 
    scale: 1.02, 
    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 60px -15px hsl(var(--primary) / 0.3)",
    borderColor: "hsl(var(--primary) / 0.5)",
    transition: { type: "spring" as const, stiffness: 400, damping: 17 }
  },
  tap: { scale: 0.98 }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
  }
};

const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 20px hsl(var(--primary) / 0.3)",
      "0 0 40px hsl(var(--primary) / 0.5)",
      "0 0 20px hsl(var(--primary) / 0.3)"
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
  }
};

const floatingVariants = {
  animate: {
    y: [-2, 2, -2],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
  }
};

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
    <div className="extension-popup bg-background dark flex flex-col overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div 
        className="p-4 border-b border-border relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-lg gradient-border flex items-center justify-center relative"
              variants={glowVariants}
              animate="animate"
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Radar className="w-5 h-5 text-primary-foreground" />
              <motion.div
                className="absolute inset-0 rounded-lg bg-primary/20"
                variants={pulseVariants}
                animate="animate"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="font-semibold text-foreground flex items-center gap-2">
                Profile Scout
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.span>
              </h1>
              <p className="text-xs text-muted-foreground">GitHub API Connected</p>
            </motion.div>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant="secondary" className="text-xs cursor-pointer">
              <Zap className="w-3 h-3 mr-1 text-primary" />
              {stats.apiCallCount} calls
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4" style={{ width: 'calc(100% - 32px)' }}>
            <TabsTrigger value="search" asChild>
              <motion.button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                data-state={activeTab === 'search' ? 'active' : 'inactive'}
                onClick={() => setActiveTab('search')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </motion.button>
            </TabsTrigger>
            <TabsTrigger value="history" asChild>
              <motion.button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                data-state={activeTab === 'history' ? 'active' : 'inactive'}
                onClick={() => setActiveTab('history')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <History className="w-4 h-4 mr-2" />
                History ({history.length})
              </motion.button>
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'search' && (
            <TabsContent value="search" className="flex-1 flex flex-col mt-0" asChild>
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -100, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: 100, rotateY: 15 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Search Input */}
                <motion.div 
                  className="p-4 border-b border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex gap-2">
                    <motion.div 
                      className="flex-1"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Input
                        placeholder="Enter GitHub username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button onClick={fetchProfile} disabled={status === 'loading'} className="relative overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/20 to-primary/0"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                        {status === 'loading' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div 
                        className="mt-2 flex items-center gap-2 text-sm text-destructive"
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <AlertCircle className="w-4 h-4" />
                        </motion.div>
                        {error}
                      </motion.div>
                    )}
                    
                    {status === 'success' && (
                      <motion.div 
                        className="mt-2 flex items-center gap-2 text-sm text-success"
                        initial={{ opacity: 0, height: 0, scale: 0.8 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ duration: 0.4 }}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </motion.div>
                        Profile fetched from GitHub API
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Profile Display */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    <AnimatePresence mode="wait">
                      {profile ? (
                        <motion.div
                          key="profile"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="space-y-4"
                        >
                          {/* Profile Header */}
                          <motion.div variants={itemVariants}>
                            <motion.div
                              variants={cardHoverVariants}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Card className="overflow-hidden border-2">
                                <CardContent className="pt-4 relative">
                                  {/* Animated gradient background */}
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
                                    animate={{
                                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                                    }}
                                    transition={{ duration: 8, repeat: Infinity }}
                                  />
                                  <div className="flex items-start gap-4 relative z-10">
                                    <motion.div
                                      variants={floatingVariants}
                                      animate="animate"
                                    >
                                      <Avatar className="w-16 h-16 ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
                                        <AvatarImage src={profile.avatar} />
                                        <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                    </motion.div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <h2 className="font-semibold text-foreground truncate">
                                          {profile.name || profile.username}
                                        </h2>
                                        {profile.hireable && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", delay: 0.3 }}
                                          >
                                            <Badge variant="outline" className="text-xs text-success border-success">
                                              Hireable
                                            </Badge>
                                          </motion.div>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground">@{profile.username}</p>
                                      {profile.bio && (
                                        <motion.p 
                                          className="text-sm text-foreground mt-2 line-clamp-2"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ delay: 0.4 }}
                                        >
                                          {profile.bio}
                                        </motion.p>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </motion.div>

                          {/* Stats Grid */}
                          <motion.div 
                            className="grid grid-cols-4 gap-2"
                            variants={itemVariants}
                          >
                            {[
                              { label: 'Repos', value: profile.publicRepos, icon: BookOpen, color: 'from-blue-500/20 to-cyan-500/20' },
                              { label: 'Gists', value: profile.publicGists, icon: BookOpen, color: 'from-purple-500/20 to-pink-500/20' },
                              { label: 'Followers', value: profile.followers, icon: Users, color: 'from-green-500/20 to-emerald-500/20' },
                              { label: 'Following', value: profile.following, icon: Users, color: 'from-orange-500/20 to-yellow-500/20' },
                            ].map((stat, index) => (
                              <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 400 }}
                                whileHover={{ 
                                  scale: 1.1, 
                                  y: -5,
                                  transition: { type: "spring", stiffness: 400 }
                                }}
                              >
                                <Card className={`text-center overflow-hidden relative cursor-pointer`}>
                                  <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${stat.color}`}
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                  />
                                  <CardContent className="p-3 relative z-10">
                                    <motion.p 
                                      className="text-lg font-bold text-primary"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                                    >
                                      {formatNumber(stat.value)}
                                    </motion.p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Details */}
                          <motion.div variants={itemVariants}>
                            <motion.div
                              variants={cardHoverVariants}
                              initial="rest"
                              whileHover="hover"
                            >
                              <Card className="border-2">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    Details
                                    <motion.div
                                      animate={{ opacity: [0.5, 1, 0.5] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      <Sparkles className="w-3 h-3 text-primary" />
                                    </motion.div>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  {[
                                    { icon: Building, value: profile.company, label: 'company' },
                                    { icon: MapPin, value: profile.location, label: 'location' },
                                    { icon: Mail, value: profile.email, label: 'email' },
                                  ].filter(item => item.value).map((item, index) => (
                                    <motion.div
                                      key={item.label}
                                      className="flex items-center gap-2 text-sm"
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.6 + index * 0.1 }}
                                      whileHover={{ x: 5 }}
                                    >
                                      <item.icon className="w-4 h-4 text-muted-foreground" />
                                      <span>{item.value}</span>
                                    </motion.div>
                                  ))}
                                  {profile.blog && (
                                    <motion.div 
                                      className="flex items-center gap-2 text-sm"
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.9 }}
                                      whileHover={{ x: 5 }}
                                    >
                                      <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                      <a href={profile.blog} target="_blank" rel="noopener noreferrer" 
                                         className="text-primary hover:underline truncate">
                                        {profile.blog}
                                      </a>
                                    </motion.div>
                                  )}
                                  {profile.twitter && (
                                    <motion.div 
                                      className="flex items-center gap-2 text-sm"
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 1 }}
                                      whileHover={{ x: 5 }}
                                    >
                                      <Twitter className="w-4 h-4 text-muted-foreground" />
                                      <a href={`https://twitter.com/${profile.twitter}`} target="_blank" 
                                         rel="noopener noreferrer" className="text-primary hover:underline">
                                        @{profile.twitter}
                                      </a>
                                    </motion.div>
                                  )}
                                  <motion.div 
                                    className="flex items-center gap-2 text-sm"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.1 }}
                                    whileHover={{ x: 5 }}
                                  >
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Joined {formatDate(profile.createdAt)}</span>
                                  </motion.div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </motion.div>

                          {/* View on GitHub */}
                          <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              variant="outline" 
                              className="w-full relative overflow-hidden group"
                              onClick={() => window.open(profile.profileUrl, '_blank')}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.6 }}
                              />
                              <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                              View on GitHub
                            </Button>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="empty"
                          className="flex flex-col items-center justify-center py-12 text-center"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ type: "spring" }}
                        >
                          <motion.div
                            animate={{ 
                              y: [0, -10, 0],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                          >
                            <User className="w-12 h-12 text-muted-foreground/50 mb-4" />
                          </motion.div>
                          <p className="text-muted-foreground text-sm">Search for a GitHub user</p>
                          <motion.p 
                            className="text-muted-foreground/70 text-xs mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            Try: octocat, torvalds, gaearon
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </motion.div>
            </TabsContent>
          )}

          {activeTab === 'history' && (
            <TabsContent value="history" className="flex-1 flex flex-col mt-0" asChild>
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 100, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: -15 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div 
                  className="p-4 border-b border-border flex justify-between items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-sm text-muted-foreground">Recent searches</span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" size="sm" onClick={clearHistory} disabled={history.length === 0}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </motion.div>
                </motion.div>
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-2">
                    <AnimatePresence mode="popLayout">
                      {history.length > 0 ? (
                        history.map((item, index) => (
                          <motion.div
                            key={`${item.username}-${index}`}
                            layout
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.9 }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 400 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className="cursor-pointer hover:bg-secondary/50 transition-all duration-300 border-2 hover:border-primary/30"
                              onClick={() => selectFromHistory(item)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage src={item.avatar} />
                                      <AvatarFallback>{item.username[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{item.name || item.username}</p>
                                    <p className="text-xs text-muted-foreground">@{item.username}</p>
                                  </div>
                                  <div className="text-right">
                                    <motion.p 
                                      className="text-xs text-muted-foreground"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.2 + index * 0.1 }}
                                    >
                                      {formatNumber(item.followers)}
                                    </motion.p>
                                    <p className="text-xs text-muted-foreground">followers</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div 
                          className="flex flex-col items-center justify-center py-12 text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <motion.div
                            animate={{ 
                              rotate: [0, 360],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                          >
                            <History className="w-12 h-12 text-muted-foreground/50 mb-4" />
                          </motion.div>
                          <p className="text-muted-foreground text-sm">No search history</p>
                          <p className="text-muted-foreground/70 text-xs mt-1">
                            Searched profiles will appear here
                          </p>
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

      {/* Footer */}
      <motion.div 
        className="p-3 border-t border-border relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <motion.span 
            className="flex items-center gap-1"
            whileHover={{ scale: 1.1, color: "hsl(var(--primary))" }}
          >
            <motion.div
              className="status-dot bg-success"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Connected
          </motion.span>
          <span>•</span>
          <motion.span whileHover={{ scale: 1.05 }}>
            API: GitHub REST v3
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileScoutPopup;
