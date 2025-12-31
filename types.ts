export type Language = 'EN' | 'VN';

export enum ProjectStatus {
  QUEUED = 'Queued',
  ANALYZING = 'Analyzing',
  WRITING = 'Writing Script',
  PROMPTING = 'Optimizing Prompt',
  GENERATING = 'Generating',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

export interface ScriptStructure {
  hook: string;
  body: string;
  cta: string;
}

export interface VoiceConfig {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  style: 'News' | 'Story' | 'Hype' | 'Calm';
  lang: Language;
}

export interface VideoProject {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl?: string;
  status: ProjectStatus;
  progress: number;
  engine: 'Veo3' | 'Sora2' | 'KlingAI' | 'Grok';
  date: string;
  sourceUrl?: string;
  script?: string; // Legacy string support
  scriptStructure?: ScriptStructure; // New structured support
  optimizedPrompt?: string;
  viralHooks?: string[];
  duration?: string;
  voiceId?: string;
  referenceImage?: string; // URL for style cloning
}

export interface ViralVideo {
  id: string;
  title: string;
  views: string;
  viralScore: number;
  thumbnail: string;
  platform: 'TikTok' | 'YouTube' | 'Facebook';
  description: string;
  url: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'process';
  time: string;
  read: boolean;
  progress?: number;
}

export interface UserSettings {
  // API & Connections
  veoKey: string;
  soraKey: string;
  klingKey: string;
  grokKey: string;
  
  // Interface
  uiTheme: 'matte' | 'metallic' | 'multipolar';
  contentLanguage: Language | 'Auto';
  
  // Render Configuration
  defaultAspectRatio: '16:9' | '9:16' | '1:1' | '21:9';
  defaultResolution: '720p' | '1080p' | '2K' | '4K';
  defaultFrameRate: '24fps' | '30fps' | '60fps';
  outputFormat: 'MP4' | 'MOV' | 'WEBM';
  renderQuality: 'Draft' | 'Standard' | 'High' | 'Ultra';
  
  // AI Behavior
  creativityLevel: number; // 0.0 to 1.0
  safetyFilter: 'Strict' | 'Moderate' | 'Off';
  
  // Workflow & Automation
  downloadPath: string;
  autoDownload: boolean;
  autoPostTikTok: boolean;
  autoPostYoutube: boolean;
}

export interface UserProfile {
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  avatar: string;
  email: string;
}

export type BatchTemplateId = 'gameplay_split' | 'fake_podcast' | 'cinematic_story' | 'news_flash';

export interface BatchJob {
  id: string;
  name: string;
  totalVideos: number;
  processedVideos: number;
  status: 'Queued' | 'Processing' | 'Paused' | 'Completed';
  engine: 'Veo3' | 'Sora2' | 'KlingAI' | 'Grok';
  template?: BatchTemplateId;
}

export interface StudioContextType {
  projects: VideoProject[];
  addProject: (project: VideoProject) => void;
  updateProject: (id: string, updates: Partial<VideoProject>) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  userCredits: number;
  deductCredits: (amount: number) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  batches: BatchJob[];
  addBatch: (name: string, count: number, engine: any, template?: BatchTemplateId) => void;
  toggleBatchStatus: (id: string) => void;
  removeBatch: (id: string) => void;
  activeVideoId: string | null;
  playVideo: (id: string) => void;
  closeVideo: () => void;
}