import { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileScoutPopup from '@/components/ProfileScoutPopup';
import { Radar, Github, Zap, Database, Search, Users, ChevronRight, Sparkles, Code2, Layers, ArrowRight } from 'lucide-react';

const Index = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  };

  const features = [
    { icon: Search, text: 'Search any GitHub user by username', color: 'from-blue-500 to-cyan-400' },
    { icon: Users, text: 'View followers, repos, and profile details', color: 'from-purple-500 to-pink-400' },
    { icon: Database, text: 'Real-time data from GitHub REST API', color: 'from-green-500 to-emerald-400' },
    { icon: Zap, text: 'Search history with local storage', color: 'from-orange-500 to-yellow-400' },
  ];

  const architectureItems = [
    { name: 'background.js', desc: 'GitHub API calls', icon: Code2 },
    { name: 'content.js', desc: 'Page extraction', icon: Layers },
    { name: 'popup (React)', desc: 'User interface', icon: Sparkles },
    { name: 'chrome.storage', desc: 'Persistent history', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Animated Background - Simplified for mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid - hidden on mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px] hidden sm:block" />
      </div>

      {/* Hero Section */}
      <motion.div 
        className="border-b border-border relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Logo + Title */}
            <motion.div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8" variants={itemVariants}>
              <motion.div 
                className="w-12 h-12 sm:w-14 lg:w-16 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center"
                whileHover={{ rotate: 12, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Radar className="w-6 h-6 sm:w-7 lg:w-8 sm:h-7 lg:h-8 text-primary-foreground" />
              </motion.div>
              <div>
                <motion.h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                  Profile Scout
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 sm:w-6 lg:w-8 sm:h-6 lg:h-8 text-primary" />
                  </motion.span>
                </motion.h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-0.5">Manifest V3 Chrome Extension</p>
              </div>
            </motion.div>
            
            {/* Description */}
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mb-6 sm:mb-8 lg:mb-10 leading-relaxed"
              variants={itemVariants}
            >
              A browser extension that fetches real profile data from the{' '}
              <span className="text-primary font-semibold inline-flex items-center gap-1">
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                GitHub API
              </span>, 
              displays it in a clean popup, and demonstrates API integration in browser extensions.
            </motion.p>

            {/* Badges */}
            <motion.div className="flex flex-wrap gap-2 sm:gap-3" variants={itemVariants}>
              {[
                { icon: Github, text: 'GitHub API' },
                { icon: Zap, text: 'Manifest V3' },
                { icon: Database, text: 'Real-time Data' },
              ].map((badge, i) => (
                <motion.div
                  key={badge.text}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-secondary/80 text-secondary-foreground border border-border/50"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <badge.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Extension Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Live Preview
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              Try searching for GitHub users below. In preview mode, demo data is shown. 
              Install the extension for real API calls.
            </p>
            
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-2 sm:-inset-4 bg-primary/10 rounded-2xl sm:rounded-3xl blur-2xl"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Popup container */}
              <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border border-border relative bg-card">
                {/* Browser chrome */}
                <div className="bg-card border-b border-border px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {['hsl(0 84% 60%)', 'hsl(38 92% 50%)', 'hsl(142 71% 45%)'].map((color, i) => (
                      <motion.div 
                        key={i}
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                        style={{ backgroundColor: color }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground ml-2 flex items-center gap-1.5">
                    Profile Scout Popup
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-success"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </span>
                </div>
                <ProfileScoutPopup />
              </div>
            </motion.div>
          </motion.div>

          {/* Features & Info */}
          <motion.div 
            className="space-y-6 sm:space-y-8 lg:space-y-10 order-1 lg:order-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            {/* What it does */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-5 flex items-center gap-2">
                What it does
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                {features.map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3 text-muted-foreground cursor-pointer"
                    onHoverStart={() => setActiveFeature(i)}
                    onHoverEnd={() => setActiveFeature(null)}
                    whileHover={{ x: 6 }}
                  >
                    <motion.div
                      className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-gradient-to-br ${feature.color} shrink-0`}
                      animate={{ scale: activeFeature === i ? 1.1 : 1 }}
                    >
                      <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </motion.div>
                    <span className="text-sm sm:text-base">{feature.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* API Details */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-5">API Details</h2>
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg sm:rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5">Endpoint</p>
                  <code className="text-xs sm:text-sm text-primary bg-secondary px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg inline-block font-mono break-all">
                    https://api.github.com/users/:username
                  </code>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5">Auth Required</p>
                  <p className="text-xs sm:text-sm text-foreground">No (public API, 60 requests/hour)</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5">Try these usernames</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {['octocat', 'torvalds', 'gaearon', 'sindresorhus'].map((name) => (
                      <motion.code 
                        key={name} 
                        className="text-[10px] sm:text-xs bg-secondary px-2 sm:px-2.5 py-1 rounded-md text-foreground cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {name}
                      </motion.code>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Installation */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-5">Installation</h2>
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg sm:rounded-xl p-4 sm:p-5">
                <ol className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground">
                  {[
                    { step: 1, text: 'Build:', code: 'npm run build' },
                    { step: 2, text: 'Open', code: 'chrome://extensions' },
                    { step: 3, text: 'Enable "Developer mode"', code: null },
                    { step: 4, text: 'Click "Load unpacked" → Select', code: 'dist' },
                  ].map((item) => (
                    <motion.li 
                      key={item.step}
                      className="flex gap-3 items-center"
                      whileHover={{ x: 4 }}
                    >
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                        {item.step}
                      </span>
                      <span className="flex items-center gap-1.5 flex-wrap">
                        {item.text}
                        {item.code && (
                          <code className="bg-secondary px-2 py-0.5 sm:py-1 rounded-md text-foreground font-mono text-[10px] sm:text-xs">
                            {item.code}
                          </code>
                        )}
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </motion.div>

            {/* Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-5">Architecture</h2>
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg sm:rounded-xl p-4 sm:p-5 space-y-2 sm:space-y-3">
                {architectureItems.map((item, i) => (
                  <motion.div 
                    key={item.name}
                    className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-secondary/50 cursor-pointer"
                    whileHover={{ x: 6, backgroundColor: "hsl(var(--secondary) / 0.8)" }}
                  >
                    <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                    <code className="bg-secondary px-2 py-0.5 sm:py-1 rounded-md text-primary font-mono text-[10px] sm:text-xs">
                      {item.name}
                    </code>
                    <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-xs sm:text-sm">{item.desc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
