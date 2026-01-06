import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudioContextType, VideoProject, Notification, UserSettings, ProjectStatus, UserProfile, BatchJob, BatchTemplateId } from '../types';

const defaultSettings: UserSettings = {
  // API
  veoKey: '',
  soraKey: '',
  klingKey: '',
  grokKey: '',
  
  // UI
  uiTheme: 'multipolar',
  contentLanguage: 'Auto',
  
  // Render
  defaultAspectRatio: '9:16',
  defaultResolution: '1080p',
  defaultFrameRate: '30fps',
  outputFormat: 'MP4',
  renderQuality: 'High',
  
  // AI
  creativityLevel: 0.7,
  safetyFilter: 'Moderate',
  
  // Automation
  downloadPath: '/Downloads/StudioAI',
  autoDownload: false,
  autoPostTikTok: false,
  autoPostYoutube: false,
};

const StudioContext = createContext<StudioContextType & { removeNotification: (id: string) => void } | undefined>(undefined);

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};

export const StudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with lazy loading from localStorage
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    const saved = localStorage.getItem('studio_projects');
    return saved ? JSON.parse(saved) : [
      { 
        id: '101', 
        title: 'Tech Review Clone #42', 
        thumbnail: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80', 
        status: ProjectStatus.GENERATING, 
        progress: 78, 
        engine: 'Veo3', 
        date: '2m ago',
        script: 'Reviewing the latest AI gadget...',
        optimizedPrompt: 'Cinematic product shot, 8k resolution...'
      },
      { 
        id: '102', 
        title: 'Cyberpunk City Flythrough', 
        thumbnail: 'https://images.unsplash.com/photo-1515630278258-407f66498911?w=800&q=80',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
        status: ProjectStatus.COMPLETED, 
        progress: 100, 
        engine: 'Sora2', 
        date: '1h ago',
        duration: '0:14'
      },
      { 
        id: '103', 
        title: 'Nature Documentary Style', 
        thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        status: ProjectStatus.COMPLETED, 
        progress: 100, 
        engine: 'KlingAI', 
        date: '3h ago',
        duration: '0:22'
      }
    ];
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'System Ready', message: 'All AI Engines are online.', type: 'success', time: 'Just now', read: false },
    { id: '2', title: 'Batch Uploading', message: 'Importing 50 videos from folder...', type: 'process', time: '1m ago', read: false, progress: 45 }
  ]);

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('studio_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [userCredits, setUserCredits] = useState(() => {
    const saved = localStorage.getItem('studio_credits');
    return saved ? parseInt(saved) : 1402;
  });
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('studio_user');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Creator',
      plan: 'Pro',
      avatar: 'https://picsum.photos/150/150',
      email: 'alex@studio.ai'
    };
  });

  const [batches, setBatches] = useState<BatchJob[]>(() => {
    const saved = localStorage.getItem('studio_batches');
    return saved ? JSON.parse(saved) : [
      { id: 'b1', name: 'TikTok_Trend_Import', totalVideos: 10, processedVideos: 4, status: 'Processing', engine: 'Grok', template: 'cinematic_story' }
    ];
  });

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // --- Persistence Effects ---
  useEffect(() => { localStorage.setItem('studio_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('studio_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('studio_credits', userCredits.toString()); }, [userCredits]);
  useEffect(() => { localStorage.setItem('studio_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('studio_batches', JSON.stringify(batches)); }, [batches]);

  // --- Actions ---

  const addProject = (project: VideoProject) => {
    setProjects(prev => [project, ...prev]);
    addNotification({
      title: 'Project Created',
      message: `"${project.title}" has been added to the pipeline.`,
      type: 'info',
      time: 'Now'
    });
  };

  const updateProject = (id: string, updates: Partial<VideoProject>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    
    if (updates.status === ProjectStatus.COMPLETED) {
      addNotification({
        title: 'Render Complete',
        message: `Project is ready for download.`,
        type: 'success',
        time: 'Now'
      });
    }
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now().toString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addNotification({ title: 'Settings Saved', message: 'Configuration updated successfully.', type: 'success', time: 'Now' });
  };

  const deductCredits = (amount: number) => {
    setUserCredits(prev => Math.max(0, prev - amount));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    addNotification({ title: 'Profile Updated', message: 'User information saved.', type: 'success', time: 'Now' });
  };

  // --- Batch Logic ---
  const addBatch = (name: string, count: number, engine: any, template: BatchTemplateId = 'cinematic_story') => {
    const newBatch: BatchJob = {
      id: Date.now().toString(),
      name,
      totalVideos: count,
      processedVideos: 0,
      status: 'Queued',
      engine,
      template
    };
    setBatches(prev => [newBatch, ...prev]);
    addNotification({ title: 'Batch Created', message: `${count} videos added to queue.`, type: 'info', time: 'Now' });
  };

  const toggleBatchStatus = (id: string) => {
    setBatches(prev => prev.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'Processing' ? 'Paused' : 'Processing';
        return { ...b, status: nextStatus as any };
      }
      return b;
    }));
  };

  const removeBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
  };

  // --- Player Logic ---
  const playVideo = (id: string) => setActiveVideoId(id);
  const closeVideo = () => setActiveVideoId(null);

  // --- Automations (Workers) ---

  // 1. Worker: Advance Projects
  useEffect(() => {
    const interval = setInterval(() => {
      setProjects(prevProjects => {
        let changed = false;
        const next = prevProjects.map(p => {
          if (p.status === ProjectStatus.GENERATING && p.progress < 100) {
            changed = true;
            const newProgress = Math.min(100, p.progress + 5);
            // Simulate adding a real result when done
            const isFinished = newProgress === 100;
            return {
              ...p,
              progress: newProgress,
              status: isFinished ? ProjectStatus.COMPLETED : ProjectStatus.GENERATING,
              duration: isFinished ? '0:15' : p.duration,
              // Fallback video for generated content
              videoUrl: isFinished && !p.videoUrl ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' : p.videoUrl
            };
          }
          return p;
        });
        return changed ? next : prevProjects;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 2. Worker: Process Batches (Spawn projects)
  useEffect(() => {
    const batchInterval = setInterval(() => {
      setBatches(prevBatches => {
        let projectsToSpawn: VideoProject[] = [];
        let changed = false;
        
        const updatedBatches = prevBatches.map(batch => {
          if (batch.status === 'Processing' && batch.processedVideos < batch.totalVideos) {
            // Randomly finish a video in the batch
            if (Math.random() > 0.7) {
               changed = true;
               const newCount = batch.processedVideos + 1;
               const isDone = newCount >= batch.totalVideos;
               
               // Spawn a project into the main list
               projectsToSpawn.push({
                 id: `batch-${batch.id}-${newCount}-${Date.now()}`,
                 title: `${batch.name} #${newCount}`,
                 thumbnail: `https://picsum.photos/400/225?random=${batch.id}${newCount}${Date.now()}`,
                 status: ProjectStatus.QUEUED,
                 progress: 0,
                 engine: batch.engine,
                 date: 'Just now',
                 script: 'Batch generated script...',
                 optimizedPrompt: 'Batch generated prompt...',
                 scriptStructure: {
                    hook: 'Batch Hook',
                    body: 'Batch content generated by AI',
                    cta: 'Follow for more'
                 }
               });

               return { 
                 ...batch, 
                 processedVideos: newCount,
                 status: isDone ? 'Completed' : 'Processing'
               } as BatchJob;
            }
          }
          return batch;
        });

        // Effect: Add spawned projects to main list
        if (projectsToSpawn.length > 0) {
          setProjects(prev => [...projectsToSpawn, ...prev]);
        }

        return changed ? updatedBatches : prevBatches;
      });
    }, 3000); 

    return () => clearInterval(batchInterval);
  }, []);

  return (
    <StudioContext.Provider value={{
      projects,
      addProject,
      updateProject,
      notifications,
      addNotification,
      removeNotification,
      settings,
      updateSettings,
      userCredits,
      deductCredits,
      user,
      updateUser,
      batches,
      addBatch,
      toggleBatchStatus,
      removeBatch,
      activeVideoId,
      playVideo,
      closeVideo
    }}>
      {children}
    </StudioContext.Provider>
  );
};