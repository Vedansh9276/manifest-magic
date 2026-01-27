import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileScoutPopup from '@/components/ProfileScoutPopup';
import { Radar, Github, Zap, Database, Search, Users, ChevronRight, Sparkles, Code2, Layers, ArrowRight } from 'lucide-react';

const Index = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 200, 
        damping: 20 
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-5, 5, -5],
      rotateZ: [-1, 1, -1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const glowPulse = {
    animate: {
      boxShadow: [
        "0 0 20px hsl(174 84% 40% / 0.2), 0 0 40px hsl(174 84% 40% / 0.1)",
        "0 0 40px hsl(174 84% 40% / 0.4), 0 0 80px hsl(174 84% 40% / 0.2)",
        "0 0 20px hsl(174 84% 40% / 0.2), 0 0 40px hsl(174 84% 40% / 0.1)"
      ],
      transition: { duration: 3, repeat: Infinity }
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
    <div className="min-h-screen bg-background dark overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Hero Section */}
      <motion.div 
        className="border-b border-border relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container max-w-5xl mx-auto px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="flex items-center gap-4 mb-8"
              variants={itemVariants}
            >
              <motion.div 
                className="w-16 h-16 rounded-2xl gradient-border flex items-center justify-center relative"
                variants={glowPulse}
                animate="animate"
                whileHover={{ 
                  rotate: 360, 
                  scale: 1.1,
                  transition: { duration: 0.6 }
                }}
              >
                <Radar className="w-8 h-8 text-primary-foreground relative z-10" />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-primary/30"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-foreground flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  Profile Scout
                  <motion.span
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </motion.span>
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground text-lg mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Manifest V3 Chrome Extension
                </motion.p>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
              variants={itemVariants}
            >
              A browser extension that fetches real profile data from the{' '}
              <motion.span 
                className="text-primary font-semibold inline-flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <Github className="w-5 h-5" />
                GitHub API
              </motion.span>, 
              displays it in a clean popup, and demonstrates API integration in browser extensions.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              {[
                { icon: Github, text: 'GitHub API', delay: 0 },
                { icon: Zap, text: 'Manifest V3', delay: 0.1 },
                { icon: Database, text: 'Real-time Data', delay: 0.2 },
              ].map((badge, i) => (
                <motion.div
                  key={badge.text}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary/80 text-secondary-foreground border border-border/50 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.6 + badge.delay, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -3,
                    boxShadow: "0 10px 30px -10px hsl(var(--primary) / 0.3)",
                    borderColor: "hsl(var(--primary) / 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <badge.icon className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Extension Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          >
            <motion.h2 
              className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.span>
              Live Preview
            </motion.h2>
            <motion.p 
              className="text-sm text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Try searching for GitHub users below. In preview mode, demo data is shown. 
              Install the extension for real API calls.
            </motion.p>
            
            <motion.div 
              className="relative"
              variants={floatingVariants}
              animate="animate"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {/* Glow effect behind the popup */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl"
                animate={{
                  opacity: isHovered ? 0.8 : 0.4,
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div 
                className="rounded-2xl overflow-hidden shadow-2xl border-2 border-border relative bg-card"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 30px 60px -15px hsl(var(--primary) / 0.3), 0 0 100px -30px hsl(var(--primary) / 0.4)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="bg-card border-b border-border px-4 py-3 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex gap-2">
                    {['destructive', 'warning', 'success'].map((color, i) => (
                      <motion.div 
                        key={color}
                        className={`w-3 h-3 rounded-full bg-${color}/60`}
                        style={{
                          backgroundColor: color === 'destructive' ? 'hsl(0 84% 60% / 0.6)' : 
                                          color === 'warning' ? 'hsl(38 92% 50% / 0.6)' : 
                                          'hsl(142 71% 45% / 0.6)'
                        }}
                        whileHover={{ scale: 1.3 }}
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          delay: i * 0.1,
                          duration: 2,
                          repeat: Infinity 
                        }}
                      />
                    ))}
                  </div>
                  <motion.span 
                    className="text-xs text-muted-foreground ml-2 flex items-center gap-2"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Profile Scout Popup
                    <motion.div
                      className="w-2 h-2 rounded-full bg-success"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.span>
                </motion.div>
                <ProfileScoutPopup />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features & Instructions */}
          <motion.div 
            className="space-y-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          >
            {/* What it does */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.h2 
                className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                What it does
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </motion.span>
              </motion.h2>
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-4 text-muted-foreground group cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                    onHoverStart={() => setActiveFeature(i)}
                    onHoverEnd={() => setActiveFeature(null)}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} shrink-0`}
                      animate={{ 
                        scale: activeFeature === i ? 1.1 : 1,
                        rotate: activeFeature === i ? 10 : 0
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <feature.icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <motion.span
                      animate={{ 
                        color: activeFeature === i ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"
                      }}
                    >
                      {feature.text}
                    </motion.span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* API Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.h2 
                className="text-xl font-semibold text-foreground mb-6"
                whileHover={{ x: 5 }}
              >
                API Details
              </motion.h2>
              <motion.div 
                className="bg-card/80 backdrop-blur-sm border-2 border-border rounded-xl p-5 space-y-4"
                whileHover={{ 
                  borderColor: "hsl(var(--primary) / 0.3)",
                  boxShadow: "0 20px 40px -20px hsl(var(--primary) / 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Endpoint</p>
                  <motion.code 
                    className="text-sm text-primary bg-secondary px-3 py-1.5 rounded-lg inline-block font-mono"
                    whileHover={{ scale: 1.02 }}
                  >
                    https://api.github.com/users/:username
                  </motion.code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Auth Required</p>
                  <p className="text-sm text-foreground">No (public API, 60 requests/hour)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Try these usernames</p>
                  <div className="flex flex-wrap gap-2">
                    {['octocat', 'torvalds', 'gaearon', 'sindresorhus', 'tj'].map((name, i) => (
                      <motion.code 
                        key={name} 
                        className="text-xs bg-secondary px-3 py-1.5 rounded-lg text-foreground cursor-pointer border border-transparent"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.05 }}
                        whileHover={{ 
                          scale: 1.1, 
                          borderColor: "hsl(var(--primary))",
                          color: "hsl(var(--primary))"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {name}
                      </motion.code>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Installation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.h2 
                className="text-xl font-semibold text-foreground mb-6"
                whileHover={{ x: 5 }}
              >
                Installation
              </motion.h2>
              <motion.div 
                className="bg-card/80 backdrop-blur-sm border-2 border-border rounded-xl p-5"
                whileHover={{ 
                  borderColor: "hsl(var(--primary) / 0.3)",
                  boxShadow: "0 20px 40px -20px hsl(var(--primary) / 0.2)"
                }}
              >
                <ol className="space-y-4 text-sm text-muted-foreground">
                  {[
                    { step: 1, text: 'Build:', code: 'npm run build' },
                    { step: 2, text: 'Open', code: 'chrome://extensions' },
                    { step: 3, text: 'Enable "Developer mode"', code: null },
                    { step: 4, text: 'Click "Load unpacked" → Select', code: 'dist' },
                  ].map((item, i) => (
                    <motion.li 
                      key={item.step}
                      className="flex gap-4 items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + i * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <motion.span 
                        className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ type: "spring" }}
                      >
                        {item.step}
                      </motion.span>
                      <span className="flex items-center gap-2 flex-wrap">
                        {item.text}
                        {item.code && (
                          <motion.code 
                            className="bg-secondary px-2.5 py-1 rounded-lg text-foreground font-mono text-xs"
                            whileHover={{ scale: 1.05 }}
                          >
                            {item.code}
                          </motion.code>
                        )}
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            </motion.div>

            {/* Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.h2 
                className="text-xl font-semibold text-foreground mb-6"
                whileHover={{ x: 5 }}
              >
                Architecture
              </motion.h2>
              <motion.div 
                className="bg-card/80 backdrop-blur-sm border-2 border-border rounded-xl p-5 space-y-3"
                whileHover={{ 
                  borderColor: "hsl(var(--primary) / 0.3)",
                  boxShadow: "0 20px 40px -20px hsl(var(--primary) / 0.2)"
                }}
              >
                {architectureItems.map((item, i) => (
                  <motion.div 
                    key={item.name}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    whileHover={{ x: 10, backgroundColor: "hsl(var(--secondary) / 0.8)" }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="w-4 h-4 text-primary" />
                    </motion.div>
                    <code className="bg-secondary px-2.5 py-1 rounded-lg text-primary font-mono text-xs">
                      {item.name}
                    </code>
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </motion.span>
                    <span className="text-muted-foreground text-sm">{item.desc}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
