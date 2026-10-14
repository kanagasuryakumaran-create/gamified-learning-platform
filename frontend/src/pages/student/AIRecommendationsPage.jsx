import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { BrainCircuit, Sparkles, Target, Zap, ArrowRight, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';

export const AIRecommendationsPage = () => {
  const { user } = useAuth();
  const studentId = user?.student_id;

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive DNN Model Simulator State
  const [simParams, setSimParams] = useState({
    average_score: 65,
    quiz_attempts: 4,
    time_spent: 120,
    lessons_completed: 8,
    previous_performance: 60,
    topic_score: 45,
    topic_name: 'Arrays'
  });
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (studentId) {
      api.getAIRecommendations(studentId)
        .then(setRecommendation)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  const runSim = async () => {
    setSimulating(true);
    try {
      const res = await api.predictPerformance(simParams);
      setSimResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
        <span>Loading AI recommendations engine...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-panel-glow border border-indigo-500/30 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
          <Sparkles className="w-4 h-4 text-cyan-400" /> PyTorch Deep Neural Network Engine
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-white">
          AI Personalized Recommendations
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          LearnQuest AI connects directly to a trained PyTorch Deep Neural Network (DNN) model to analyze multi-dimensional student performance vectors, identify weak topics, predict mastery, and dynamically assign practice difficulty.
        </p>
      </div>

      {/* Active Student Recommendation */}
      {recommendation && (
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-indigo-400" /> Current Profile DNN Recommendation
            </h3>
            <span className="text-xs text-slate-500">Updated: {recommendation.updated_at}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Recommended Topic</span>
              <h4 className="text-lg font-bold text-white mt-1">{recommendation.recommended_topic}</h4>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Predicted Score</span>
              <h4 className="text-lg font-bold text-indigo-400 mt-1">{recommendation.predicted_performance}%</h4>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Detected Weak Topic</span>
              <h4 className="text-lg font-bold text-amber-400 mt-1">{recommendation.weak_topic}</h4>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Assigned Difficulty</span>
              <h4 className="text-lg font-bold text-emerald-400 mt-1">{recommendation.difficulty}</h4>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 italic">
            "{recommendation.reason}"
          </div>
        </div>
      )}

      {/* Interactive PyTorch DNN Simulator */}
      <div className="p-8 rounded-3xl glass-panel-glow border border-purple-500/30 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-purple-400" /> Interactive PyTorch DNN Model Simulator
            </h3>
            <p className="text-xs text-slate-400">Modify input parameters below to test real-time neural network inference</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            Live DNN Endpoint (`POST /ai/predict`)
          </span>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Average Score: {simParams.average_score}%</label>
            <input 
              type="range" min="20" max="100" 
              value={simParams.average_score} 
              onChange={(e) => setSimParams({...simParams, average_score: Number(e.target.value)})}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Topic Score: {simParams.topic_score}%</label>
            <input 
              type="range" min="10" max="100" 
              value={simParams.topic_score} 
              onChange={(e) => setSimParams({...simParams, topic_score: Number(e.target.value)})}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quiz Attempts: {simParams.quiz_attempts}</label>
            <input 
              type="range" min="1" max="15" 
              value={simParams.quiz_attempts} 
              onChange={(e) => setSimParams({...simParams, quiz_attempts: Number(e.target.value)})}
              className="w-full accent-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Time Spent: {simParams.time_spent} mins</label>
            <input 
              type="range" min="10" max="360" step="10"
              value={simParams.time_spent} 
              onChange={(e) => setSimParams({...simParams, time_spent: Number(e.target.value)})}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Lessons Completed: {simParams.lessons_completed}</label>
            <input 
              type="range" min="1" max="25" 
              value={simParams.lessons_completed} 
              onChange={(e) => setSimParams({...simParams, lessons_completed: Number(e.target.value)})}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Topic Name</label>
            <select
              value={simParams.topic_name}
              onChange={(e) => setSimParams({...simParams, topic_name: e.target.value})}
              className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Arrays">Arrays</option>
              <option value="Loops">Loops</option>
              <option value="Java Basics">Java Basics</option>
              <option value="OOP">Object-Oriented Programming</option>
              <option value="Python Functions">Python Functions</option>
            </select>
          </div>
        </div>

        <button
          onClick={runSim}
          disabled={simulating}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
        >
          {simulating ? 'Running PyTorch DNN Model...' : 'Execute Live PyTorch DNN Prediction'}
        </button>

        {/* Simulator Output Box */}
        {simResult && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between text-xs text-cyan-300 font-bold uppercase tracking-wider">
              <span>PyTorch Model Output Received</span>
              <span>200 OK</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Predicted Mastery</span>
                <p className="text-lg font-extrabold text-indigo-400">{simResult.predicted_performance}%</p>
              </div>
              <div>
                <span className="text-slate-400">Weak Topic</span>
                <p className="text-lg font-extrabold text-amber-400">{simResult.weak_topic}</p>
              </div>
              <div>
                <span className="text-slate-400">Recommended Topic</span>
                <p className="text-lg font-extrabold text-cyan-400">{simResult.recommended_topic}</p>
              </div>
              <div>
                <span className="text-slate-400">Recommended Difficulty</span>
                <p className="text-lg font-extrabold text-emerald-400">{simResult.difficulty}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 pt-2 border-t border-slate-900 italic">
              "{simResult.reason}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
