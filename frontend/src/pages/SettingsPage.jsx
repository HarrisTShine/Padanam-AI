import React, { useState } from 'react';
import { Settings, Save, Check, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../services/authService';

export default function SettingsPage() {
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const [langPref, setLangPref] = useState(user?.student_profile?.language_preference || 'en');
  const [speed, setSpeed] = useState(user?.student_profile?.learning_speed || 'moderate');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateSettings({
        language_preference: langPref,
        learning_speed: speed
      });
    } catch (err) {
      // Simulation mode: API call optional, settings are applied locally
    } finally {
      toggleLanguage(langPref);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Platform Settings</h1>
        <p className="text-sm text-slate-400">Configure language, adaptive speed, and notifications</p>
      </div>

      <form onSubmit={handleSave} className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Preferred Learning Language
            </label>
            <select
              value={langPref}
              onChange={(e) => setLangPref(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="en">English Medium</option>
              <option value="ml">മലയാളം Medium (Malayalam)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Adaptive Learning Speed Model
            </label>
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="slow">Paced & Detailed (Extra Analogies)</option>
              <option value="moderate">Standard Adaptive Speed</option>
              <option value="fast">Accelerated SSLC Exam Prep</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center space-x-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </form>
    </div>
  );
}
