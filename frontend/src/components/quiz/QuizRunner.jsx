import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Award, AlertTriangle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { agentService } from '../../services/agentService';

export default function QuizRunner({ topicId, topicTitle, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const data = await agentService.generateQuiz(topicId || 1, 'medium', 3);
      setQuizData(data);
      setSelectedAnswers({});
      setResult(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, key) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: key
    }));
  };

  const handleSubmit = async () => {
    if (!quizData || !quizData.questions) return;
    
    setSubmitting(true);
    try {
      const answersPayload = quizData.questions.map(q => ({
        question_id: q.id,
        question_text: q.question_text,
        student_answer: selectedAnswers[q.id] || 'N/A',
        correct_answer: q.correct_answer
      }));

      const resData = await agentService.submitQuiz(topicId || 1, answersPayload, 90);
      setResult(resData);
      if (onComplete) onComplete(resData);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!quizData && !result) {
    return (
      <div className="p-8 rounded-2xl glass-panel text-center space-y-4 border border-cyan-500/20">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-100">Ready for a Diagnostic Quiz?</h3>
          <p className="text-sm text-slate-400 mt-1">
            Test your understanding of {topicTitle || 'this topic'} with AI-generated SCERT questions.
          </p>
        </div>
        <button
          onClick={startQuiz}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition flex items-center space-x-2 mx-auto"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? 'Generating Quiz...' : 'Start Quiz Now'}</span>
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="p-6 rounded-2xl glass-panel space-y-6 border border-slate-800 animate-in fade-in duration-300">
        {/* Results Header */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Quiz Diagnostic Summary</span>
            <h3 className="text-2xl font-black text-slate-100">
              Score: {result.score_percentage}%
            </h3>
            <p className="text-sm text-slate-400">
              Correct: {result.correct_count} / {result.total_questions} Questions
            </p>
          </div>
          <div className="text-right space-y-1">
            <span className="text-xs text-slate-400">Updated Topic Mastery</span>
            <div className="text-xl font-extrabold text-teal-400">
              {(result.new_mastery_score * 100).toFixed(0)}%
            </div>
            {result.is_weak_topic && (
              <span className="inline-flex items-center space-x-1 text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-3 h-3" />
                <span>Weak Topic Flagged</span>
              </span>
            )}
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-sm font-medium flex items-center space-x-3">
          <Award className="w-6 h-6 text-cyan-400 flex-shrink-0" />
          <span>{result.motivational_feedback}</span>
        </div>

        {/* Question Diagnostics & Misconceptions */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-200 text-base">Misconception & Answer Diagnostic Breakdown</h4>
          {result.diagnostics.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-sm space-y-2 ${
                item.is_correct
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="font-semibold text-slate-100">{idx + 1}. {item.question_text}</p>
                {item.is_correct ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                )}
              </div>
              <div className="text-xs space-y-1">
                <p>Your choice: <span className="font-bold">{item.student_answer}</span> | Correct choice: <span className="font-bold">{item.correct_answer}</span></p>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 mt-2">
                  <span className="font-bold text-cyan-400 block mb-0.5">AI Diagnostic Analysis:</span>
                  <p className="whitespace-pre-line">{item.misconception_analysis}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={startQuiz}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold transition border border-slate-700"
        >
          Retake Quiz with New Questions
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl glass-panel space-y-6 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">SCERT Class 10 Quiz</span>
          <h3 className="text-lg font-bold text-slate-100">{quizData.topic_title}</h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {quizData.questions.length} Questions
        </span>
      </div>

      <div className="space-y-6">
        {quizData.questions.map((q, idx) => (
          <div key={q.id} className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="font-semibold text-slate-200 text-sm">{idx + 1}. {q.question_text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.options.map((opt) => {
                const isSelected = selectedAnswers[q.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(q.id, opt.key)}
                    className={`p-3 rounded-xl text-left text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="font-bold mr-2 text-cyan-400">{opt.key}.</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || Object.keys(selectedAnswers).length === 0}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {submitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
        <span>{submitting ? 'Analyzing Misconceptions...' : 'Submit Answers for AI Feedback'}</span>
      </button>
    </div>
  );
}
