import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { HelpCircle, Clock, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Zap } from 'lucide-react';

export const QuizPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentId = user?.student_id || 1;

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // {question_id: 'A' | 'B' | 'C' | 'D'}
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getQuiz(id)
      .then(setQuiz)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (questionId, optionKey) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const res = await api.submitQuiz(id, studentId, answers, secondsSpent);
      // Navigate to Quiz Result page with result payload in state
      navigate(`/student/quiz/${id}/result`, { state: { result: res, quizTitle: quiz.title } });
    } catch (err) {
      console.error('Quiz submit failed:', err);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
        <span>Loading quiz questions...</span>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div className="p-10 text-center text-slate-400">Quiz has no questions available.</div>;
  }

  const currentQ = quiz.questions[currentQIndex];
  const isLastQuestion = currentQIndex === quiz.questions.length - 1;

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
      {/* Quiz Top Bar */}
      <div className="flex items-center justify-between p-6 rounded-3xl glass-panel border border-slate-800">
        <div>
          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Assessment Quiz</span>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-white">{quiz.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{formatTimer(secondsSpent)}</span>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> +{quiz.xp_reward} XP
          </span>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2">
        {quiz.questions.map((q, idx) => (
          <div
            key={q.id}
            onClick={() => setCurrentQIndex(idx)}
            className={`flex-1 h-2 rounded-full cursor-pointer transition-all ${
              answers[q.id] 
                ? 'bg-indigo-500' 
                : idx === currentQIndex 
                ? 'bg-cyan-400' 
                : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="p-8 rounded-3xl glass-panel-glow border border-indigo-500/30 space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Question {currentQIndex + 1} of {quiz.questions.length}</span>
          <span className="text-indigo-400 font-semibold">Passing Mark: {quiz.passing_score}%</span>
        </div>

        <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
          {currentQ.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {Object.entries(currentQ.options).map(([optKey, optText]) => {
            const isSelected = answers[currentQ.id] === optKey;
            return (
              <button
                key={optKey}
                onClick={() => handleSelectOption(currentQ.id, optKey)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {optKey}
                  </span>
                  <span className="text-sm font-medium">{optText}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQIndex === 0}
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition-all"
        >
          Previous Question
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            {submitting ? 'Submitting to PyTorch DNN...' : 'Submit Quiz & View AI Analysis'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
