import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Sparkles, HelpCircle, ArrowLeft, CheckCircle2, Languages, RefreshCw } from 'lucide-react';
import { curriculumService } from '../services/curriculumService';
import { useLanguage } from '../context/LanguageContext';
import QuizRunner from '../components/quiz/QuizRunner';

export default function LessonViewPage({ onOpenChat }) {
  const { topicId } = useParams();
  const { language } = useLanguage();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('read'); // 'read' or 'quiz'

  useEffect(() => {
    const fetchTopic = async () => {
      setLoading(true);
      try {
        const data = await curriculumService.getTopicDetail(Number(topicId) || 1);
        setTopic(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicId]);

  if (loading) {
    return (
      <div className="py-16 text-center text-cyan-400 flex items-center justify-center space-x-2">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span>Loading SCERT Lesson Content...</span>
      </div>
    );
  }

  const topicTitle = language === 'ml' && topic?.title_ml ? topic.title_ml : (topic?.title || 'Wave Motion');
  const content = language === 'ml' && topic?.content_summary_ml ? topic.content_summary_ml : (topic?.content_summary || '');

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Back Link */}
      <Link to="/courses" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to SCERT Course Browser</span>
      </Link>

      {/* Lesson Header */}
      <div className="p-8 rounded-3xl glass-panel space-y-4 border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-400">
            SCERT Kerala Class 10 Lesson
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
            Bilingual English / Malayalam
          </span>
        </div>

        <h1 className="text-3xl font-black text-slate-100">{topicTitle}</h1>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => setActiveTab('read')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'read' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Curriculum Breakdown
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'quiz' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Diagnostic Quiz
          </button>
          <button
            onClick={onOpenChat}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center space-x-1.5 transition ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {activeTab === 'read' ? (
        <div className="space-y-6">
          {/* Main Content Card */}
          <div className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Core Textbook Concept</span>
            </h3>
            <div className="text-slate-300 leading-relaxed text-sm whitespace-pre-line bg-slate-900/60 p-6 rounded-xl border border-slate-800">
              {content}
            </div>
          </div>

          {/* Learning Outcomes */}
          {topic?.learning_outcomes && topic.learning_outcomes.length > 0 && (
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-slate-100">SCERT Learning Outcomes</h3>
              <div className="space-y-2">
                {topic.learning_outcomes.map((lo) => (
                  <div key={lo.id} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-cyan-400 mr-2">{lo.code}:</span>
                      {lo.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <QuizRunner topicId={Number(topicId) || 1} topicTitle={topicTitle} />
      )}
    </div>
  );
}
