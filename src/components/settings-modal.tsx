
'use client';
import { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  Palette, 
  Database, 
  Bell, 
  Shield,
  Globe,
} from 'lucide-react';
import { useSettingsContext } from '@/hooks/use-settings.tsx';
import { GeneralSettings } from './settings/general-settings';
import { AppearanceSettings } from './settings/appearance-settings';
import { AudioSettings } from './settings/audio-settings';
import { NotificationSettings } from './settings/notification-settings';
import { DataSettings } from './settings/data-settings';
import { PrivacySettings } from './settings/privacy-settings';

export const SettingsModal = () => {
  const { settings: userSettings, updateSettings, isSettingsOpen, setIsSettingsOpen } = useSettingsContext();
  const [settings, setSettings] = useState(userSettings);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    setSettings(userSettings);
  }, [userSettings]);

  const handleSave = () => {
    updateSettings(settings);
    setIsSettingsOpen(false);
  };

  const onClose = () => setIsSettingsOpen(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  if (!isSettingsOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal cosmic-panel">
        {/* Header */}
        <div className="settings-header">
          <h2 className="text-xl font-headline font-bold">🚀 Mission Control Settings</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="settings-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="settings-content">
          {activeTab === 'general' && <GeneralSettings settings={settings} onChange={setSettings} />}
          {activeTab === 'appearance' && <AppearanceSettings settings={settings} onChange={setSettings} />}
          {activeTab === 'audio' && <AudioSettings settings={settings} onChange={setSettings} />}
          {activeTab === 'notifications' && <NotificationSettings settings={settings} onChange={setSettings} />}
          {activeTab === 'data' && <DataSettings settings={settings} onChange={setSettings} />}
          {activeTab === 'privacy' && <PrivacySettings settings={settings} onChange={setSettings} />}
        </div>

        {/* Footer */}
        <div className="settings-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary nasa-glow">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
