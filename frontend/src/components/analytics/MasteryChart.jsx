import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts';

export default function MasteryChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No topic mastery data recorded yet. Take a quiz to visualize progress!
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.topic_title.length > 18 ? `${item.topic_title.substring(0, 18)}...` : item.topic_title,
    fullTitle: item.topic_title,
    mastery: Math.round(item.mastery_score * 100),
    isWeak: item.is_weak_topic
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
          <YAxis stroke="#94a3b8" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            formatter={(val) => [`${val}% Mastery`, 'Score']}
            labelFormatter={(label, payload) => payload[0]?.payload?.fullTitle || label}
          />
          <Bar dataKey="mastery" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isWeak ? '#f59e0b' : entry.mastery >= 80 ? '#10b981' : '#06b6d4'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
