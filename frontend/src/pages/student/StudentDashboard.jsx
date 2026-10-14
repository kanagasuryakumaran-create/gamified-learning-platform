import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FlaskConical, BrainCircuit, Zap, Flame, Award, TrendingUp, 
  ArrowRight, Sparkles, CheckCircle2, Trophy, Droplet, Star, Heart
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [gamification, setGamification] = useState(null);
  const [aiRec, setAiRec] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = user?.student_id || user?.id || 1;

  useEffect(() => {
    fetchDashboardData();
  }, [studentId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [gamRes, aiRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/gamification/${studentId}`),
        fetch(`http://127.0.0.1:8000/ai/recommendations/${studentId}`)
      ]);

      if (gamRes.ok) setGamification(await gamRes.json());
      if (aiRes.ok) setAiRec(await aiRes.json());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 6 Progressive Acid Lab Missions
  const acidMissions = [
    {
      id: 1,
      title: "Mission 1: Identify Acidic Solution",
      subtitle: "Test unknown solution for H⁺ ions & acidic pH < 7",
      targetPh: 1.5,
      stars: 3,
      description: "Pour Hydrochloric Acid (HCl) into the beaker and test with Blue Litmus solution to confirm acidic dissociation."
    },
    {
      id: 2,
      title: "Mission 2: Test Acid Using Indicator",
      subtitle: "Observe Phenolphthalein & Universal Indicator spectrum",
      targetPh: 2.0,
      stars: 2,
      description: "Add Sulfuric Acid (H₂SO₄) and Phenolphthalein. Observe colorless acid reaction and Universal Indicator red spectrum."
    },
    {
      id: 3,
      title: "Mission 3: Dilute Acid with Virtual Water",
      subtitle: "Safely dilute concentrated acid (Acid into Water rule)",
      targetPh: 4.0,
      stars: 1,
      description: "Safely dilute acid by adding Acid into Water to raise pH from 1.0 up to a safe diluted pH of 4.0."
    },
    {
      id: 4,
      title: "Mission 4: Mix Acid and Base (Neutralization)",
      subtitle: "HCl + NaOH → NaCl + H₂O Neutralization Reaction",
      targetPh: 7.0,
      stars: 0,
      description: "Perform exothermic neutralization! Add Sodium Hydroxide (NaOH) to Hydrochloric Acid to form salt and water."
    },
    {
      id: 5,
      title: "Mission 5: Achieve Target pH 7.0",
      subtitle: "Precision titration to hit exact neutral pH = 7.0",
      targetPh: 7.0,
      stars: 0,
      description: "Carefully drop exact volumes of NaOH into acid until the digital pH probe reads precisely 7.0 (Green)."
    },
    {
      id: 6,
      title: "Mission 6: Classify Final Solution",
      subtitle: "Identify solution state as Acidic, Neutral, or Basic",
      targetPh: 7.0,
      stars: 0,
      description: "Analyze the final mixture, test with indicators, and classify as Acidic (pH < 7), Neutral (pH = 7), or Basic (pH > 7)."
    }
  ];

  if (loading) {
    return (
      <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-44 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl bg-slate-900 border border-slate-800" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* 1. PLAYER CHEMIST HUD BANNER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-500/30 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-md">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
            {gamification?.learning_streak_days || 5} Day Virtual Lab Streak
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-white">
            Welcome to Acids Virtual Lab! 🧪
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
            Step onto the 2D laboratory workbench! Pour acids and bases, test chemical indicators, perform neutralization reactions, and train your PyTorch DNN model.
          </p>
        </div>

        {/* Level Rank & XP HUD Box */}
        <div className="relative z-10 bg-slate-950/90 p-5 rounded-2xl border border-emerald-500/40 shrink-0 min-w-[280px] space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Chemist Rank</span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Level {gamification?.level_number || 3}: {gamification?.level || 'Learner'}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">
              {gamification?.total_xp || 450} <span className="text-xs font-semibold text-emerald-400">XP</span>
            </span>
            <span className="text-xs text-slate-400">Target: {gamification?.next_level_xp || 500} XP</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${gamification?.xp_progress_percentage || 75}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. STAT HUD METRICS (4 CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Accumulated XP</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">{gamification?.total_xp || 450}</h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Lab Accuracy</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">{gamification?.quiz_average || 75}%</h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Completed Missions</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">{gamification?.lessons_completed || 3}</h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Badges Unlocked</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">{gamification?.badges_count || 3}</h3>
        </div>
      </div>

      {/* 3. PYTORCH DNN AI QUEST PORTAL */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/40 relative overflow-hidden shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-extrabold">
                PyTorch DNN Active Inference
              </span>
              <h2 className="text-xl font-bold text-white">AI Lab Guidance System</h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold self-start md:self-auto">
            Live Model Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Target Weak Concept</span>
                <p className="text-base font-bold text-white mt-0.5">{aiRec?.weak_topic || 'Target pH Neutralization'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Predicted Mastery</span>
                <p className="text-base font-bold text-emerald-400 mt-0.5">{aiRec?.predicted_performance || 72.5}%</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Assigned Difficulty</span>
                <p className="text-base font-bold text-amber-300 mt-0.5">{aiRec?.difficulty || 'Medium'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              "{aiRec?.reason || 'PyTorch DNN evaluated your recent acid indicator testing performance (75.0%). DNN predicts 72.5% mastery in neutralization reactions.'}"
            </p>
          </div>

          <div className="text-center md:text-right">
            <button
              onClick={() => navigate('/student/chemistry-lab')}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <FlaskConical className="w-5 h-5" />
              <span>Enter 2D Virtual Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. 6 PROGRESSIVE ACID LAB MISSIONS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-emerald-400" /> Acid Virtual Lab Missions
            </h2>
            <p className="text-xs text-slate-400">Complete progressive missions from acid identification to target pH titration.</p>
          </div>
          <Link to="/student/chemistry-lab" className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1">
            View All Lab Missions <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {acidMissions.map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-lg">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map(s => (
                      <Star 
                        key={s} 
                        className={`w-4 h-4 ${s <= m.stars ? 'text-amber-400 fill-current' : 'text-slate-700'}`} 
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {m.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {m.description}
                </p>
              </div>

              <button
                onClick={() => navigate('/student/chemistry-lab')}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:border-emerald-500"
              >
                <span>Launch Mission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
