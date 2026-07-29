import React from 'react';
import QuizRunner from '../components/quiz/QuizRunner';

export default function QuizPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-100">SCERT Diagnostic Quiz Center</h1>
        <p className="text-sm text-slate-400">Test your understanding and receive instant misconception diagnosis</p>
      </div>

      <QuizRunner topicId={1} topicTitle="Wave Motion & Energy Transmission" />
    </div>
  );
}
