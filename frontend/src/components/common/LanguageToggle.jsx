import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={() => toggleLanguage()}
      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition duration-200 text-sm font-medium shadow-sm"
      title="Toggle Language / ഭാഷ മാറ്റുക"
    >
      <Languages className="w-4 h-4 text-cyan-400" />
      <span>{language === 'en' ? 'EN | മലയാളം' : 'മലയാളം | EN'}</span>
    </button>
  );
}
