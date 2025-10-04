
'use client';
import type { Settings } from '@/hooks/use-settings.tsx';

interface AudioSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export const AudioSettings = ({ settings, onChange }: AudioSettingsProps) => {
  const voices = [
    { id: 'mission_control', name: 'Mission Control' },
    { id: 'scientific', name: 'Scientific Assistant' },
    { id: 'astronaut', name: 'Astronaut' }
  ];

  return (
    <div className="settings-section">
      <h3 className="font-bold text-lg mb-4">🔊 Audio Preferences</h3>

      <div className="setting-item">
        <label className="toggle-label">
          <span className="toggle-slider"></span>
          <input 
            type="checkbox" 
            className="hidden"
            checked={settings.voiceResponses}
            onChange={(e) => onChange({...settings, voiceResponses: e.target.checked})}
          />
          <span>Enable voice responses</span>
        </label>
      </div>

      <div className="setting-item">
        <label className="toggle-label">
          <span className="toggle-slider"></span>
          <input 
            type="checkbox" 
            className="hidden"
            checked={settings.soundEffects}
            onChange={(e) => onChange({...settings, soundEffects: e.target.checked})}
          />
          <span>Enable sound effects</span>
        </label>
      </div>

      {settings.voiceResponses && (
        <>
          <div className="setting-item">
            <label>Voice Style</label>
            <select 
              value={settings.voiceStyle} 
              onChange={(e) => onChange({...settings, voiceStyle: e.target.value})}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
            >
              {voices.map(voice => (
                <option key={voice.id} value={voice.id}>{voice.name}</option>
              ))}
            </select>
          </div>

          <div className="setting-item">
            <label>Speech Rate</label>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1"
              value={settings.speechRate}
              onChange={(e) => onChange({...settings, speechRate: parseFloat(e.target.value)})}
            />
            <div className="range-labels">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          <div className="setting-item">
            <label>Volume</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={settings.volume}
              onChange={(e) => onChange({...settings, volume: parseInt(e.target.value)})}
            />
            <div className="range-labels">
              <span>Mute</span>
              <span>Max</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
