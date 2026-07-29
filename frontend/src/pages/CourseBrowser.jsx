import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Zap, Calculator, FlaskConical, Layers, ChevronRight, RefreshCw } from 'lucide-react';
import { curriculumService } from '../services/curriculumService';
import { useLanguage } from '../context/LanguageContext';

const iconMap = {
  Zap: Zap,
  Calculator: Calculator,
  FlaskConical: FlaskConical
};

export default function CourseBrowser() {
  const { language } = useLanguage();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const data = await curriculumService.getSubjects('SCERT_KERALA', 10);
        setSubjects(data);
        if (data.length > 0) {
          setSelectedSubject(data[0]);
          const chData = await curriculumService.getChapters(data[0].id);
          setChapters(chData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSelectSubject = async (subj) => {
    setSelectedSubject(subj);
    setLoading(true);
    try {
      const chData = await curriculumService.getChapters(subj.id);
      setChapters(chData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100">SCERT Kerala Course Browser</h1>
          <p className="text-sm text-slate-400">Class 10 State Board Curriculum Chapters & Learning Outcomes</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search chapters or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {subjects.map((subj) => {
          const IconComponent = iconMap[subj.icon_name] || BookOpen;
          const isSelected = selectedSubject?.id === subj.id;
          return (
            <button
              key={subj.id}
              onClick={() => handleSelectSubject(subj)}
              className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'glass-panel text-slate-300 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span>{language === 'ml' && subj.name_ml ? subj.name_ml : subj.name}</span>
            </button>
          );
        })}
      </div>

      {/* Chapters Grid */}
      {loading ? (
        <div className="py-12 text-center text-cyan-400 flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Fetching SCERT Curriculum Data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapters.map((ch) => (
            <div key={ch.id} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-400">
                  Chapter {ch.chapter_number}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {ch.topics?.length || 1} Topics
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-100">
                  {language === 'ml' && ch.title_ml ? ch.title_ml : ch.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ch.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <p className="text-xs font-semibold text-slate-300">Topics in this chapter:</p>
                {ch.topics && ch.topics.map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">
                        {language === 'ml' && t.title_ml ? t.title_ml : t.title}
                      </h4>
                    </div>
                    <Link
                      to={`/lesson/${t.id}`}
                      className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center space-x-1 transition"
                    >
                      <span>Study</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
