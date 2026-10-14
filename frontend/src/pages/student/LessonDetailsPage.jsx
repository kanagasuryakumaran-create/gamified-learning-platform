import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { BookOpen, CheckCircle2, HelpCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export const LessonDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentId = user?.student_id || 1;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    api.getLesson(id, studentId)
      .then((data) => {
        setLesson(data);
        setCompleted(data.completed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, studentId]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await api.completeLesson(id, studentId);
      setCompleted(true);
      setXpEarned(res.xp_earned);
    } catch (err) {
      console.error('Completion failed:', err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
        <span>Loading lesson content...</span>
      </div>
    );
  }

  if (!lesson) {
    return <div className="p-10 text-center text-slate-400">Lesson content not found.</div>;
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
      {/* Lesson Header */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <Link to={`/student/subjects/${lesson.subject_id}`} className="text-xs text-indigo-400 font-semibold hover:underline">
            ← Back to Subject
          </Link>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> +{lesson.xp_reward} XP Reward
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-white">{lesson.title}</h1>
      </div>

      {/* Lesson Markdown Content Display */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 text-slate-300 leading-relaxed font-sans text-sm md:text-base">
        {lesson.content.split('\n\n').map((block, i) => {
          if (block.startsWith('# ')) {
            return <h2 key={i} className="text-2xl font-bold font-heading text-white mt-4">{block.replace('# ', '')}</h2>;
          } else if (block.startsWith('### ')) {
            return <h3 key={i} className="text-xl font-bold font-heading text-indigo-300 mt-4">{block.replace('### ', '')}</h3>;
          } else if (block.startsWith('```')) {
            const cleanCode = block.replace(/```[a-z]*/g, '').trim();
            return (
              <pre key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto my-4">
                <code>{cleanCode}</code>
              </pre>
            );
          } else {
            return <p key={i}>{block}</p>;
          }
        })}
      </div>

      {/* Completion Action Box */}
      <div className="p-6 rounded-2xl glass-panel-glow border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">Finished Reading this Lesson?</h4>
          <p className="text-xs text-slate-400">Click complete to claim your +{lesson.xp_reward} XP reward and update your streak.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleComplete}
            disabled={completed || completing}
            className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${
              completed
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-600/30 hover:scale-[1.02]'
            }`}
          >
            {completed ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> Completed (+{xpEarned || lesson.xp_reward} XP)
              </>
            ) : completing ? (
              <span>Completing...</span>
            ) : (
              <>
                <span>Complete Lesson</span>
                <Zap className="w-4 h-4 fill-current" />
              </>
            )}
          </button>

          {lesson.quiz_id && (
            <Link
              to={`/student/quiz/${lesson.quiz_id}`}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2"
            >
              <span>Take Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
