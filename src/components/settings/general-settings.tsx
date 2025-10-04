
'use client';
import type { Settings } from '@/hooks/use-settings.tsx';

interface GeneralSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export const GeneralSettings = ({ settings, onChange }: GeneralSettingsProps) => {
  return (
    <div className="settings-section">
      <h3 className="font-bold text-lg mb-4">🌐 General Preferences</h3>
      
      <div className="setting-item">
        <label>Language</label>
        <select 
          value={settings.language} 
          onChange={(e) => onChange({...settings, language: e.target.value})}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
        >
          <option value="en">English (Mission Control)</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Temperature Units</label>
        <select 
          value={settings.temperatureUnit} 
          onChange={(e) => onChange({...settings, temperatureUnit: e.target.value})}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
        >
          <option value="celsius">Celsius (°C)</option>
          <option value="fahrenheit">Fahrenheit (°F)</option>
          <option value="kelvin">Kelvin (K)</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Time Format</label>
        <select 
          value={settings.timeFormat} 
          onChange={(e) => onChange({...settings, timeFormat: e.target.value})}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
        >
          <option value="24h">24-Hour (Mission Time)</option>
          <option value="12h">12-Hour</option>
        </select>
      </div>

      <div className="setting-item">
        <label className="toggle-label">
          <span className="toggle-slider"></span>
          <input 
            type="checkbox" 
            className="hidden"
            checked={settings.autoSave}
            onChange={(e) => onChange({...settings, autoSave: e.target.checked})}
          />
          <span>Auto-save conversations</span>
        </label>
      </div>

      <div className="setting-item">
        <label className="toggle-label">
          <span className="toggle-slider"></span>
          <input 
            type="checkbox" 
            className="hidden"
            checked={settings.typingIndicator}
            onChange={(e) => onChange({...settings, typingIndicator: e.target.checked})}
          />
          <span>Show typing indicators</span>
        </label>
      </div>
    </div>
  );
};
