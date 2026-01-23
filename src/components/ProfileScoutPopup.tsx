import { useState, useEffect } from 'react';
import { 
  Radar, 
  Send, 
  RefreshCw, 
  Trash2, 
  User, 
  Globe, 
  Mail,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Chrome API declaration
declare const chrome: {
  runtime?: {
    id?: string;
    sendMessage: (message: unknown, callback?: (response: unknown) => void) => void;
  };
};

interface ProfileData {
  pageTitle: string;
  pageUrl: string;
  domain: string;
  metaDescription: string;
  metaAuthor: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  profileData: {
    name?: string;
    bio?: string;
    avatar?: string;
    emails?: string[];
  };
  socialLinks: Record<string, string>;
  extractedAt: string;
}

interface ExtractedProfile {
  data: ProfileData;
  url: string;
  timestamp: string;
}

interface Stats {
  extractionCount: number;
  apiSendCount: number;
}

type Status = 'idle' | 'extracting' | 'sending' | 'success' | 'error';

const ProfileScoutPopup = () => {
  const [profile, setProfile] = useState<ExtractedProfile | null>(null);
  const [stats, setStats] = useState<Stats>({ extractionCount: 0, apiSendCount: 0 });
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const isExtension = typeof chrome !== 'undefined' && chrome.runtime?.id;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (isExtension) {
      chrome.runtime.sendMessage({ type: 'GET_PROFILE_DATA' }, (response: unknown) => {
        const res = response as { profile: ExtractedProfile | null; stats: Stats };
        if (res) {
          setProfile(res.profile);
          setStats(res.stats);
        }
        setIsLoading(false);
      });
    } else {
      // Demo data for preview
      setProfile({
        data: {
          pageTitle: 'John Doe - Software Engineer',
          pageUrl: 'https://example.com/johndoe',
          domain: 'example.com',
          metaDescription: 'Full-stack developer specializing in React and Node.js',
          metaAuthor: 'John Doe',
          ogTitle: 'John Doe | Developer',
          ogDescription: 'Building awesome web applications',
          ogImage: 'https://example.com/avatar.jpg',
          profileData: {
            name: 'John Doe',
            bio: 'Passionate developer with 5+ years of experience building scalable web applications.',
            emails: ['john@example.com']
          },
          socialLinks: {
            twitter: 'https://twitter.com/johndoe',
            github: 'https://github.com/johndoe',
            linkedin: 'https://linkedin.com/in/johndoe'
          },
          extractedAt: new Date().toISOString()
        },
        url: 'https://example.com/johndoe',
        timestamp: new Date().toISOString()
      });
      setStats({ extractionCount: 12, apiSendCount: 8 });
      setIsLoading(false);
    }
  };

  const handleExtract = () => {
    setStatus('extracting');
    setMessage('');
    
    if (isExtension) {
      chrome.runtime.sendMessage({ type: 'EXTRACT_NOW' }, (response: unknown) => {
        const res = response as { success: boolean; error?: string; data?: ProfileData };
        if (res?.success) {
          setStatus('success');
          setMessage('Profile extracted successfully');
          loadData();
        } else {
          setStatus('error');
          setMessage(res?.error || 'Extraction failed');
        }
        setTimeout(() => setStatus('idle'), 2000);
      });
    } else {
      setTimeout(() => {
        setStatus('success');
        setMessage('Demo: Extraction simulated');
        setTimeout(() => setStatus('idle'), 2000);
      }, 1000);
    }
  };

  const handleSendToApi = () => {
    if (!profile) return;
    
    setStatus('sending');
    setMessage('');
    
    if (isExtension) {
      chrome.runtime.sendMessage({ type: 'SEND_TO_API', data: profile.data }, (response: unknown) => {
        const res = response as { success: boolean; id?: string; error?: string };
        if (res?.success) {
          setStatus('success');
          setMessage(`Sent! ID: ${res.id}`);
          loadData();
        } else {
          setStatus('error');
          setMessage(res?.error || 'Send failed');
        }
        setTimeout(() => setStatus('idle'), 3000);
      });
    } else {
      setTimeout(() => {
        setStatus('success');
        setMessage('Demo: Sent to mock API');
        setStats(prev => ({ ...prev, apiSendCount: prev.apiSendCount + 1 }));
        setTimeout(() => setStatus('idle'), 2000);
      }, 800);
    }
  };

  const handleClear = () => {
    if (isExtension) {
      chrome.runtime.sendMessage({ type: 'CLEAR_DATA' }, () => {
        setProfile(null);
        setMessage('Data cleared');
        setTimeout(() => setMessage(''), 2000);
      });
    } else {
      setProfile(null);
      setMessage('Demo: Data cleared');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="extension-popup flex items-center justify-center bg-background dark">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

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
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {stats.extractionCount} scanned
            </Badge>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-b border-border">
        <div className="flex gap-2">
          <Button 
            onClick={handleExtract} 
            className="flex-1"
            disabled={status === 'extracting' || status === 'sending'}
          >
            {status === 'extracting' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Extract
          </Button>
          <Button 
            onClick={handleSendToApi} 
            variant="secondary"
            className="flex-1"
            disabled={!profile || status === 'extracting' || status === 'sending'}
          >
            {status === 'sending' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send to API
          </Button>
          <Button 
            onClick={handleClear} 
            variant="outline" 
            size="icon"
            disabled={!profile}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Status Message */}
        {message && (
          <div className={`mt-3 flex items-center gap-2 text-sm ${
            status === 'success' ? 'text-success' : 
            status === 'error' ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            {status === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {status === 'error' && <AlertCircle className="w-4 h-4" />}
            {message}
          </div>
        )}
      </div>

      {/* Profile Data */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {profile ? (
            <>
              {/* Basic Info Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Profile Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.data.profileData?.name && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Name</p>
                      <p className="data-field">{profile.data.profileData.name}</p>
                    </div>
                  )}
                  {profile.data.profileData?.bio && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bio</p>
                      <p className="data-field text-xs leading-relaxed">
                        {profile.data.profileData.bio.substring(0, 150)}
                        {profile.data.profileData.bio.length > 150 && '...'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Page Info Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Page Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Title</p>
                    <p className="data-field truncate">{profile.data.pageTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Domain</p>
                    <p className="data-field">{profile.data.domain}</p>
                  </div>
                  {profile.data.metaDescription && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="data-field text-xs">
                        {profile.data.metaDescription.substring(0, 100)}...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Emails */}
              {profile.data.profileData?.emails && profile.data.profileData.emails.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Emails Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {profile.data.profileData.emails.map((email, i) => (
                        <p key={i} className="data-field">{email}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Social Links */}
              {Object.keys(profile.data.socialLinks).length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-primary" />
                      Social Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(profile.data.socialLinks).map(([platform, url]) => (
                        <Badge 
                          key={platform} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => window.open(url, '_blank')}
                        >
                          {platform}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timestamp */}
              <p className="text-xs text-muted-foreground text-center">
                Extracted: {new Date(profile.data.extractedAt).toLocaleString()}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Radar className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-sm">No profile data yet</p>
              <p className="text-muted-foreground/70 text-xs mt-1">
                Click "Extract" to scan the current page
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{isExtension ? 'Extension Mode' : 'Preview Mode'}</span>
          <span>{stats.apiSendCount} sent to API</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileScoutPopup;
