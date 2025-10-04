
'use client';
import type { Settings } from '@/hooks/use-settings.tsx';
import { Download, Upload } from 'lucide-react';

interface DataSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export const DataSettings = ({ settings, onChange }: DataSettingsProps) => {
  const handleExportData = () => {
    // Export conversations and settings
    const data = {
      conversations: localStorage.getItem('nasa_conversations'),
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nasa-chatbot-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const data = JSON.parse(result);
            if (data.settings) {
              onChange(data.settings);
            }
            if(data.conversations) {
              localStorage.setItem('nasa_conversations', data.conversations);
            }
            alert('Data imported successfully! The page will now reload.');
            window.location.reload();
          }
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="settings-section">
      <h3 className="font-bold text-lg mb-4">💾 Data Management</h3>

      <div className="setting-item">
        <label>Conversation Storage</label>
        <select 
          value={settings.storageLocation} 
          onChange={(e) => onChange({...settings, storageLocation: e.target.value})}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
        >
          <option value="local">Local Browser</option>
          <option value="cloud">Cloud Sync</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Auto-delete After</label>
        <select 
          value={settings.autoDelete} 
          onChange={(e) => onChange({...settings, autoDelete: e.target.value})}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground"
        >
          <option value="never">Never</option>
          <option value="30days">30 Days</option>
          <option value="90days">90 Days</option>
          <option value="1year">1 Year</option>
        </select>
      </div>

      <div className="setting-actions">
        <button onClick={handleExportData} className="btn-secondary">
          <Download size={16} />
          Export All Data
        </button>
        
        <label className="btn-secondary file-upload">
          <Upload size={16} />
          Import Data
          <input 
            type="file" 
            accept=".json" 
            onChange={handleImportData}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="setting-item danger-zone">
        <h4 className="text-destructive font-bold">🚨 Danger Zone</h4>
        <button 
          onClick={() => {
            if (confirm('This will permanently delete all your conversations. Continue?')) {
              localStorage.removeItem('nasa_conversations');
              window.location.reload();
            }
          }}
          className="btn-danger"
        >
          Delete All Conversations
        </button>
      </div>
    </div>
  );
};
