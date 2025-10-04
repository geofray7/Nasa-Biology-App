
'use client';
import type { Settings } from '@/hooks/use-settings.tsx';

interface PrivacySettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export const PrivacySettings = ({ settings, onChange }: PrivacySettingsProps) => {
  return (
    <div className="settings-section">
      <h3 className="font-bold text-lg mb-4">🛡️ Privacy & Security</h3>

      <div className="setting-item">
        <label className="toggle-label">
          <span className="toggle-slider"></span>
          <input 
            type="checkbox" 
            className="hidden"
            checked={settings.analytics}
            onChange={(e) => onChange({...settings, analytics: e.target.checked})}
          />
          <span>Allow anonymous usage analytics</span>
        </label>
        <small className="text-muted-foreground text-xs">Help improve NASA chatbot by sharing usage data</small>
      </div>

      <div className="setting-item">
        <label className="toggle-label">
          <span className="toggle-slider"></span>
          <input 
            type="checkbox" 
            className="hidden"
            checked={settings.autoUpdate}
            onChange={(e) => onChange({...settings, autoUpdate: e.target.checked})}
          />
          <span>Automatic updates</span>
        </label>
      </div>

      <div className="setting-item">
        <label>Data Retention</label>
        <select 
          value={settings.dataRetention} 
          onChange={(e) => onChange({...settings, dataRetention: e.target.value})}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
        >
          <option value="minimal">Minimal (7 days)</option>
          <option value="standard">Standard (30 days)</option>
          <option value="extended">Extended (1 year)</option>
        </select>
      </div>

      <div className="privacy-links">
        <a href="/privacy-policy" target="_blank" className="text-accent hover:underline">Privacy Policy</a>
        <a href="/terms-of-service" target="_blank" className="text-accent hover:underline">Terms of Service</a>
        <a href="/data-export" target="_blank" className="text-accent hover:underline">Data Export Request</a>
      </div>
    </div>
  );
};
