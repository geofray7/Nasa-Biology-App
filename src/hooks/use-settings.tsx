
'use client';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface Settings {
  // General
  language: string;
  temperatureUnit: 'celsius' | 'fahrenheit' | 'kelvin';
  timeFormat: '12h' | '24h';
  autoSave: boolean;
  typingIndicator: boolean;
  
  // Appearance
  theme: 'cosmic_dark' | 'mission_control' | 'deep_space' | 'solar_flare';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  animationIntensity: number;
  reduceMotion: boolean;
  showGraphsInline: boolean;
  
  // Audio
  voiceResponses: boolean;
  soundEffects: boolean;
  voiceStyle: 'mission_control' | 'scientific' | 'astronaut';
  speechRate: number;
  volume: number;
  
  // Notifications
  desktopNotifications: boolean;
  soundNotifications: boolean;
  notifyNewResearch: boolean;
  notifyMissionUpdates: boolean;
  notifyCollaborations: boolean;
  
  // Data
  storageLocation: 'local' | 'cloud';
  autoDelete: 'never' | '30days' | '90days' | '1year';
  
  // Privacy
  analytics: boolean;
  autoUpdate: boolean;
  dataRetention: 'minimal' | 'standard' | 'extended';
}

const defaultSettings: Settings = {
  // General
  language: 'en',
  temperatureUnit: 'celsius',
  timeFormat: '24h',
  autoSave: true,
  typingIndicator: true,
  
  // Appearance
  theme: 'cosmic_dark',
  fontSize: 'medium',
  animationIntensity: 75,
  reduceMotion: false,
  showGraphsInline: true,
  
  // Audio
  voiceResponses: false,
  soundEffects: true,
  voiceStyle: 'mission_control',
  speechRate: 1.0,
  volume: 80,
  
  // Notifications
  desktopNotifications: true,
  soundNotifications: true,
  notifyNewResearch: true,
  notifyMissionUpdates: false,
  notifyCollaborations: true,
  
  // Data
  storageLocation: 'local',
  autoDelete: 'never',
  
  // Privacy
  analytics: true,
  autoUpdate: true,
  dataRetention: 'standard'
};

interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Settings) => void;
    resetSettings: () => void;
    isLoaded: boolean;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (isOpen: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettingsContext must be used within a SettingsProvider');
    }
    return context;
}

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedSettings = localStorage.getItem('nasa_chatbot_settings');
        if (savedSettings) {
            try {
            const parsed = JSON.parse(savedSettings);
            setSettings({ ...defaultSettings, ...parsed });
            } catch (error) {
            console.error('Error loading settings:', error);
            }
        }
        setIsLoaded(true);
    }
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
        localStorage.setItem('nasa_chatbot_settings', JSON.stringify(newSettings));
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    if (typeof window !== 'undefined') {
        localStorage.setItem('nasa_chatbot_settings', JSON.stringify(defaultSettings));
    }
  };

  const value = {
      settings,
      updateSettings,
      resetSettings,
      isLoaded,
      isSettingsOpen,
      setIsSettingsOpen
  }

  return (
    <SettingsContext.Provider value={value}>
        {children}
    </SettingsContext.Provider>
  );
};
