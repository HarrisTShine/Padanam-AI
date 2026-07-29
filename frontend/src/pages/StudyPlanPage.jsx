import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { agentService } from '../services/agentService';

export default function StudyPlanPage() {
  const [timeframe, setTimeframe] = useState('7_days');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = async (tf = timeframe) => {
    setLoading(true);
    try {
      const data = await agentService.generateStudyPlan(tf);
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleTimeframeChange = (tf) => {
    setTimeframe(tf);
    fetchPlan(tf);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100">SCERT AI Personalized Study Roadmap</h1>
          <p className="text-sm text-slate-400">Structured daily study schedule prioritized by weak topics and SSLC exam targets</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTimeframeChange('7_days')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              timeframe === '7_days' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
            }`}
          >
            7-Day Schedule
          </button>
          <button
            onClick={() => handleTimeframeChange('30_days')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              timeframe === '30_days' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
            }`}
          >
            30-Day Master Plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-cyan-400 flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Generating AI Study Schedule...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/20 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Active Roadmap</span>
              <h3 className="text-xl font-bold text-slate-100">{plan?.title}</h3>
            </div>
            <button
              onClick={() => fetchPlan()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Regenerate with AI</span>
            </button>
          </div>

          <div className="space-y-3">
            {plan?.daily_schedule?.map((item) => (
              <div key={item.day} className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between hover:border-slate-700 transition">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-sm">
                    D{item.day}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">{item.focus}</h4>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Target Session: {item.duration}</span>
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-slate-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
