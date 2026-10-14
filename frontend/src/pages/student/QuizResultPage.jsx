import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Trophy, BrainCircuit, Zap, Award, CheckCircle2, 
  XCircle, ArrowRight, RotateCcw, Sparkles 
} from 'lucide-react';

export const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;
  const quizTitle = location.state?.quizTitle || 'Quiz Result';

  if (!result) {
    return (
      <div className="p-10 text-center text-slate-400 space-y-4">
        <p>No quiz submission result found.</p>
        <Link to="/student/dashboard" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { score, max_score, percentage, passed, xp_earned, breakdown, ai_prediction, newly_awarded_badges } = result;

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/30 mb-2">
          <Trophy className="w-8 h-8 text-amber-300" />
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-white">{quizTitle} Completed!</h1>
        <p className="text-sm text-slate-400">Here is your detailed score breakdown and PyTorch DNN performance prediction.</p>
      </div>

      {/* Newly Awarded Badges Pop-up Banner */}
      {newly_awarded_badges && newly_awarded_badges.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border border-amber-500/40 animate-pulse-glow flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">🎉 New Badge Unlocked!</span>
              <h4 className="text-base font-bold text-white">{newly_awarded_badges[0].title}</h4>
              <p className="text-xs text-slate-300">{newly_awarded_badges[0].description}</p>
            </div>
          </div>
          <Link to="/student/badges" className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
            View All Badges
          </Link>
        </div>
      )}

      {/* Score & XP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-400 font-medium">Final Percentage</span>
          <div className={`text-4xl font-extrabold ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
            {percentage}%
          </div>
          <span className="text-xs text-slate-400">{score} of {max_score} Questions Correct</span>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-400 font-medium">Status</span>
          <div className={`text-2xl font-extrabold mt-1 ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
            {passed ? 'Passed ✓' : 'Needs Review'}
          </div>
          <span className="text-xs text-slate-400">Passing Threshold: 70%</span>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-400 font-medium">XP Reward Earned</span>
          <div className="text-4xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
            <Zap className="w-7 h-7 fill-current" /> +{xp_earned}
          </div>
          <span className="text-xs text-slate-400">Added to total profile XP</span>
        </div>
      </div>

      {/* PyTorch DNN Analysis & Recommendation Section */}
      {ai_prediction && (
        <div className="p-8 rounded-3xl glass-panel-glow border border-cyan-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">PyTorch DNN AI Evaluation</h3>
                <p className="text-xs text-slate-400">Real-time model inference output</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              Live Prediction
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400">Predicted Score</span>
              <div className="text-xl font-bold text-indigo-400 mt-0.5">{ai_prediction.predicted_performance}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400">Weak Topic</span>
              <div className="text-xl font-bold text-amber-400 mt-0.5">{ai_prediction.weak_topic}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400">Assigned Difficulty</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{ai_prediction.difficulty}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
            "{ai_prediction.reason}"
          </div>
        </div>
      )}

      {/* Detailed Question Review */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-heading text-white">Question Review & Explanations</h3>

        <div className="space-y-4">
          {breakdown.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {item.is_correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">Q{idx + 1}. {item.question_text}</h4>
                    <div className="mt-2 text-xs space-y-1">
                      <p className="text-slate-400">
                        Your Answer: <span className={item.is_correct ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold'}>{item.user_answer || 'None'}</span>
                      </p>
                      {!item.is_correct && (
                        <p className="text-slate-400">Correct Answer: <span className="text-emerald-400 font-semibold">Option {item.correct_option}</span></p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {item.explanation && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400">
                  <strong className="text-indigo-300">Explanation: </strong>{item.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all"
        >
          Return to Dashboard
        </button>

        <button
          onClick={() => navigate('/student/subjects')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
