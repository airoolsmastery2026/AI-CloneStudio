import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { StudioContextType, VideoProject, Notification, UserSettings, ProjectStatus, UserProfile, BatchJob, BatchTemplateId } from '../types';

const defaultSettings: UserSettings = {
  veoKey: '',
  soraKey: '',
  klingKey: '',
  grokKey: '',
  uiTheme: 'multipolar',
  contentLanguage: 'Auto',
  defaultAspectRatio: '9:16',
  defaultResolution: '1080p',
  defaultFrameRate: '30fps',
  outputFormat: 'MP4',
  renderQuality: 'High',
  creativityLevel: 0.7,
  safetyFilter: 'Moderate',
  downloadPath: '/Downloads/StudioAI',
  autoDownload: false,
  autoPostTikTok: false,
  autoPostYoutube: false,
};

const StudioContext = createContext<StudioContextType & { removeNotification: (id: string) => void } | undefined>(undefined);

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) throw new Error('useStudio must be used within a StudioProvider');
  return context;
};

export const StudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    const saved = localStorage.getItem('studio_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('studio_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [userCredits, setUserCredits] = useState(() => {
    const saved = localStorage.getItem('studio_credits');
    return saved ? parseInt(saved) : 5000;
  });
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('studio_user');
    return saved ? JSON.parse(saved) : {
      name: 'Professional Creator',
      plan: 'Pro',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Studio',
      email: 'creator@studio.ai'
    };
  });

  const [batches, setBatches] = useState<BatchJob[]>(() => {
    const saved = localStorage.getItem('studio_batches');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem('studio_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('studio_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('studio_credits', userCredits.toString()); }, [userCredits]);
  useEffect(() => { localStorage.setItem('studio_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('studio_batches', JSON.stringify(batches)); }, [batches]);

  const addNotification = (notif: Omit<Notification, 'id' | 'read'>) => {
    const newNotif: Notification = { ...notif, id: Date.now().toString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const removeNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const addProject = (project: VideoProject) => setProjects(prev => [project, ...prev]);

  const updateProject = (id: string, updates: Partial<VideoProject>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deductCredits = (amount: number) => setUserCredits(prev => Math.max(0, prev - amount));

  const addBatch = (name: string, count: number, engine: any, template: BatchTemplateId = 'cinematic_story') => {
    const newBatch: BatchJob = {
      id: Date.now().toString(),
      name,
      totalVideos: count,
      processedVideos: 0,
      status: 'Processing',
      engine,
      template
    };
    setBatches(prev => [newBatch, ...prev]);
  };

  const toggleBatchStatus = (id: string) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Processing' ? 'Paused' : 'Processing' } : b));
  };

  const removeBatch = (id: string) => setBatches(prev => prev.filter(b => b.id !== id));

  // Logic Render Video thực tế (Giả lập tích hợp Veo API)
  useEffect(() => {
    const renderWorker = setInterval(() => {
      setProjects(prev => {
        let hasChanges = false;
        const next = prev.map(p => {
          if (p.status === ProjectStatus.GENERATING) {
            hasChanges = true;
            const newProgress = Math.min(100, p.progress + (Math.random() * 5 + 2));
            const isDone = newProgress >= 100;
            
            if (isDone) {
              addNotification({
                title: 'Render Complete',
                message: `Video "${p.title}" is ready.`,
                type: 'success',
                time: 'Just now'
              });
            }

            return {
              ...p,
              progress: Math.floor(newProgress),
              status: isDone ? ProjectStatus.COMPLETED : ProjectStatus.GENERATING,
              videoUrl: isDone ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' : p.videoUrl
            };
          }
          return p;
        });
        return hasChanges ? next : prev;
      });
    }, 3000);
    return () => clearInterval(renderWorker);
  }, []);

  return (
    <StudioContext.Provider value={{
      projects, addProject, updateProject, notifications, addNotification, removeNotification,
      settings, updateSettings: (s) => setSettings(prev => ({ ...prev, ...s })),
      userCredits, deductCredits, user, updateUser: (u) => setUser(prev => ({ ...prev, ...u })),
      batches, addBatch, toggleBatchStatus, removeBatch,
      activeVideoId, playVideo: (id) => setActiveVideoId(id), closeVideo: () => setActiveVideoId(null)
    }}>
      {children}
    </StudioContext.Provider>
  );
};