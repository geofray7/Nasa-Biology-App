
'use client';
import type { Settings } from '@/hooks/use-settings.tsx';

interface AppearanceSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export const AppearanceSettings = ({ settings, onChange }: AppearanceSettingsProps) => {
  const themes = [
    { id: 'cosmic_dark', name: 'Cosmic Dark', preview: '🌌' },
    { id: 'mission_control', name: 'Mission Control', preview: '🚀' },
    { id: 'deep_space', name: 'Deep Space', preview: '🛸' },
    { id: 'solar_flare', name: 'Solar Flare', preview: '☀️' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' }
  ];

  return (
    <div className="settings-section">
      <h3 className="font-bold text-lg mb-4">🎨 Visual Theme</h3>

      <div className="setting-item">
        <label>Theme</label>
        <div className="theme-grid">
          {themes.map(theme => (
            <div 
              key={theme.id}
              className={`theme-option ${settings.theme === theme.id ? 'active' : ''}`}
              onClick={() => onChange({...settings, theme: theme.id})}
            >
              <div className="theme-preview">{theme.preview}</div>
              <span>{theme.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="setting-item">
        <label>Font Size</label>
        <select 
          value={settings.fontSize} 
          onChange={(e) => onChange({...settings, fontSize: e.target.value})}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
        >
          {fontSizes.map(size => (
            <option key={size.value} value={size.value}>{size.label}</option>
          ))}
        </select>
      </div>

      <div className="setting-item">
        <label>Animation Intensity</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={settings.animationIntensity}
          onChange={(e) => onChange({...settings, animationIntensity: parseInt(e.target.value)})}
        />
        <div className="range-labels">
          <span>Minimal</span>
          <span>Cinematic</span>
        </div>
      </div>

      <div className="setting-item">
        <label className="toggle-label">
          <span>Reduce motion (accessibility)</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="hidden"
              id="reduceMotion"
              checked={settings.reduceMotion}
              onChange={(e) => onChange({...settings, reduceMotion: e.target.checked})}
            />
            <label htmlFor="reduceMotion" className="toggle-slider"></label>
          </div>
        </label>
      </div>

      <div className="setting-item">
        <label className="toggle-label">
           <span>Show graphs in messages</span>
           <div className="relative">
            <input 
              type="checkbox" 
              className="hidden"
              id="showGraphsInline"
              checked={settings.showGraphsInline}
              onChange={(e) => onChange({...settings, showGraphsInline: e.target.checked})}
            />
            <label htmlFor="showGraphsInline" className="toggle-slider"></label>
           </div>
        </label>
      </div>
    </div>
  );
};
