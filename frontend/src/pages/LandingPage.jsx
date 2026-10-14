import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, Sparkles, Award, Target, Zap, ShieldCheck, 
  ArrowRight, BookOpen, Layers, CheckCircle2, TrendingUp, ChevronRight
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0d1322]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-heading bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
              LearnQuest AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all border border-slate-700/50"
            >
              Log In
            </Link>
            <Link 
              to="/register"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            PyTorch Deep Neural Network (DNN) Powered Learning
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight leading-tight mb-6">
            Personalized Education Powered by <br />
            <span className="gradient-text">Deep Neural Networks</span> & Gamification
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            LearnQuest AI continuous evaluates your quiz metrics, topic-wise score, study duration, and historical performance using a multi-layer PyTorch Deep Neural Network to accurately predict performance and recommend custom learning pathways.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.03] transition-all flex items-center justify-center gap-3"
            >
              <span>Start Learning Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all"
            >
              Demo Student Login
            </Link>
          </div>

          {/* Real Working MVP Badge Container */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl glass-panel border border-slate-800">
              <Zap className="w-6 h-6 text-amber-400 mb-2" />
              <div className="text-2xl font-extrabold text-white">4-Layer DNN</div>
              <p className="text-xs text-slate-400">Real PyTorch inference</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800">
              <Award className="w-6 h-6 text-emerald-400 mb-2" />
              <div className="text-2xl font-extrabold text-white">Gamified XP</div>
              <p className="text-xs text-slate-400">Levels 1 to 5 + Badges</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800">
              <Target className="w-6 h-6 text-cyan-400 mb-2" />
              <div className="text-2xl font-extrabold text-white">Weak Topics</div>
              <p className="text-xs text-slate-400">Automated AI detection</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800">
              <ShieldCheck className="w-6 h-6 text-indigo-400 mb-2" />
              <div className="text-2xl font-extrabold text-white">Supabase / REST</div>
              <p className="text-xs text-slate-400">FastAPI backend engine</p>
            </div>
          </div>
        </div>
      </section>

      {/* How PyTorch DNN Works */}
      <section className="py-20 border-t border-slate-800/60 bg-[#0b0f19]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              How the Deep Neural Network Model Works
            </h2>
            <p className="text-slate-400">
              Real PyTorch neural net architecture processing multi-dimensional student performance vectors in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-xl flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Student Performance Vector</h3>
              <p className="text-sm text-slate-400 mb-4">
                Collects average quiz score, total attempts, study duration, lessons completed, and topic-wise mastery.
              </p>
              <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-cyan-300 border border-slate-800">
                average_score = 65<br/>
                quiz_attempts = 4<br/>
                time_spent = 120m<br/>
                topic_score = 45%
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 font-bold text-xl flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-2">PyTorch DNN Inference</h3>
              <p className="text-sm text-slate-400 mb-4">
                Feeds data through 6 input features into hidden layers (64 & 32 units) with ReLU activations & BatchNorm.
              </p>
              <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-purple-300 border border-slate-800">
                Input(6) → Dense(64) → Dense(32) → Dense(16) → Output(1)
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xl flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Recommendation</h3>
              <p className="text-sm text-slate-400 mb-4">
                Detects weak topics, predicts overall mastery score, and assigns difficulty (Beginner, Intermediate, Advanced).
              </p>
              <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-emerald-300 border border-slate-800">
                Weak Topic: Arrays<br/>
                Predicted Score: 58%<br/>
                Difficulty: Beginner
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Highlights */}
      <section className="py-20 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-4 border border-amber-500/20">
                <Award className="w-4 h-4" /> Real Gamification System
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                Earn XP, Unlock Badges & Level Up Your Skills
              </h2>
              <div className="space-y-4 text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-white">XP Rewards:</strong> Complete lessons (+10 XP), pass quizzes (+20 XP), score 80%+ bonus (+30 XP).
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-white">5 Progression Levels:</strong> Advance from Level 1 Beginner → Explorer → Learner → Achiever → Level 5 Master.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-white">Collectible Badges:</strong> Earn First Lesson, Quiz Master, 100 XP Pioneer, 500 XP Master, and Streak badges.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl glass-panel-glow border border-indigo-500/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-white font-heading">Student Progress Demo</h4>
                  <p className="text-xs text-slate-400">Explorer • Level 2</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  ⚡ 320 / 500 XP
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-3 mb-6 overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full w-[64%]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-2xl font-bold text-white">65%</div>
                  <div className="text-xs text-slate-400">Quiz Average</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-2xl font-bold text-white">6 Lessons</div>
                  <div className="text-xs text-slate-400">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 LearnQuest AI. Powered by PyTorch Deep Neural Networks, FastAPI & Supabase PostgreSQL.</p>
      </footer>
    </div>
  );
};
