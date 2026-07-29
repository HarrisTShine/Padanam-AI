import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, TrendingUp, Award, Search, RefreshCw } from 'lucide-react';
import { agentService } from '../services/agentService';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await agentService.getTeacherAnalytics();
        setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-cyan-400 flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Loading Teacher Portal Class Analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Teacher Class Monitoring Dashboard</h1>
        <p className="text-sm text-slate-400">SCERT Class 10 Physics & Mathematics Class Progress Heatmap</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Assigned Class</span>
          <div className="text-2xl font-black text-slate-100">Grade 10 - Section A</div>
          <p className="text-xs text-slate-500">SCERT Model High School</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Class Average Mastery</span>
          <div className="text-2xl font-black text-teal-400">75.0%</div>
          <p className="text-xs text-slate-500">Exponential Moving Average</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Students Needing Support</span>
          <div className="text-2xl font-black text-amber-400">1 Student</div>
          <p className="text-xs text-amber-400/80">Flagged by AI Tutor</p>
        </div>
      </div>

      {/* Student Heatmap Table */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100">Class Topic Mastery Roster</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Overall Mastery</th>
                <th className="py-3 px-4">Weak Topics</th>
                <th className="py-3 px-4">Recent Quiz Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {students.map((st) => (
                <tr key={st.student_id} className="hover:bg-slate-900/60 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-100">{st.full_name}</td>
                  <td className="py-3.5 px-4">Class {st.grade}</td>
                  <td className="py-3.5 px-4 font-extrabold text-teal-400">
                    {Math.round(st.overall_mastery * 100)}%
                  </td>
                  <td className="py-3.5 px-4">
                    {st.weak_topics_count > 0 ? (
                      <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                        {st.weak_topics_count} Weak
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">None</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{st.recent_quiz_score}%</td>
                  <td className="py-3.5 px-4">
                    {st.overall_mastery < 0.6 ? (
                      <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                        Intervention Recommended
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                        On Track
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
