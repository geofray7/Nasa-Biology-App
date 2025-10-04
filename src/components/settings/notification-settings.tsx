
'use client';
import type { Settings } from '@/hooks/use-settings.tsx';

interface NotificationSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export const NotificationSettings = ({ settings, onChange }: NotificationSettingsProps) => {
  return (
    <div className="settings-section">
      <h3 className="font-bold text-lg mb-4">🔔 Notifications</h3>

      <div className="setting-item">
        <label className="toggle-label">
          <span>Desktop notifications</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="hidden"
              id="desktopNotifications"
              checked={settings.desktopNotifications}
              onChange={(e) => onChange({...settings, desktopNotifications: e.target.checked})}
            />
            <label htmlFor="desktopNotifications" className="toggle-slider"></label>
          </div>
        </label>
      </div>

      <div className="setting-item">
        <label className="toggle-label">
          <span>Sound notifications</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="hidden"
              id="soundNotifications"
              checked={settings.soundNotifications}
              onChange={(e) => onChange({...settings, soundNotifications: e.target.checked})}
            />
            <label htmlFor="soundNotifications" className="toggle-slider"></label>
          </div>
        </label>
      </div>

      <div className="setting-item">
        <label>Notification Types</label>
        <div className="checkbox-group">
          <label>
            <input 
              type="checkbox" 
              checked={settings.notifyNewResearch}
              onChange={(e) => onChange({...settings, notifyNewResearch: e.target.checked})}
            />
            New research alerts
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={settings.notifyMissionUpdates}
              onChange={(e) => onChange({...settings, notifyMissionUpdates: e.target.checked})}
            />
            Mission updates
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={settings.notifyCollaborations}
              onChange={(e) => onChange({...settings, notifyCollaborations: e.target.checked})}
            />
            Collaboration requests
          </label>
        </div>
      </div>
    </div>
  );
};
