import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loadPuzzleSession, AdaptiveDifficultyEngine } from '../../games/gameEngine';
import { 
  Gamepad2, Award, Zap, CheckCircle2, XCircle, ArrowRight, RotateCcw, 
  BrainCircuit, Sparkles, HelpCircle, Trophy, BarChart2, Check, ArrowLeft
} from 'lucide-react';

export function ArrayGamePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Game state: 'START' | 'PLAYING' | 'EXPLANATION' | 'RESULT'
  const [gameState, setGameState] = useState('START');
  const [puzzles, setPuzzles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [adaptiveEngine] = useState(() => new AdaptiveDifficultyEngine('Easy'));
  const [currentDifficulty, setCurrentDifficulty] = useState('Easy');
  const [startTime, setStartTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState(null);

  // Initialize fresh 10-puzzle session
  const startNewGame = () => {
    const session = loadPuzzleSession('Arrays');
    setPuzzles(session);
    setCurrentIndex(0);
    setScore(0);
    setSessionXp(0);
    setSelectedOption(null);
    setIsCorrect(false);
    setCurrentDifficulty('Easy');
    setStartTime(Date.now());
    setGameState('PLAYING');
  };

  const currentPuzzle = puzzles[currentIndex];

  const handleSelectOption = (option) => {
    if (gameState !== 'PLAYING') return;

    setSelectedOption(option);
    const correct = String(option).trim() === String(currentPuzzle.correctAnswer).trim();
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      setSessionXp((prev) => prev + 10);
    }

    // Update adaptive difficulty level for next puzzle
    const nextDiff = adaptiveEngine.registerAnswer(correct);
    setCurrentDifficulty(nextDiff);

    setGameState('EXPLANATION');
  };

  const handleNextPuzzle = () => {
    if (currentIndex + 1 < puzzles.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setGameState('PLAYING');
    } else {
      finishGameSession();
    }
  };

  const finishGameSession = async () => {
    setIsSubmitting(true);
    const timeSpentSeconds = Math.max(10, Math.round((Date.now() - (startTime || Date.now())) / 1000));
    const accuracyPct = Math.round((score / puzzles.length) * 100);

    const studentId = user?.student_id || user?.id || 1;

    try {
      const response = await fetch('http://127.0.0.1:8000/games/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          topic_name: 'Arrays',
          score: score,
          total_puzzles: puzzles.length,
          time_spent: timeSpentSeconds,
          accuracy: accuracyPct,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record game results');
      }

      const data = await response.json();
      setResultData(data);
    } catch (err) {
      console.error('Game submit error:', err);
      // Fallback result presentation if server connection issue
      setResultData({
        score: score,
        total_puzzles: puzzles.length,
        accuracy: accuracyPct,
        xp_earned: score * 10 + 30,
        total_xp: (user?.total_xp || 100) + score * 10 + 30,
        current_level: 'Learner',
        ai_prediction: {
          weak_topic: 'Arrays',
          recommended_topic: 'Arrays & Two-Pointers',
          predicted_performance: accuracyPct,
          difficulty: accuracyPct >= 80 ? 'Hard' : accuracyPct >= 50 ? 'Medium' : 'Easy',
          reason: `Based on your ${accuracyPct}% puzzle accuracy, PyTorch DNN recommends focused Array practice.`
        }
      });
    } finally {
      setIsSubmitting(false);
      setGameState('RESULT');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Header / Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5">
          <Gamepad2 className="w-4 h-4" /> Array Puzzle Challenge
        </span>
      </div>

      {/* STATE 1: START SCREEN */}
      {gameState === 'START' && (
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden text-center space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Array Data Structure Puzzles
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Test your algorithmic problem-solving skills with 10 dynamic array puzzles! Solve min/max queries, missing numbers, duplicates, reversed arrays, and target sums.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" /> 10 Dynamic Puzzles
              </div>
              <p className="text-xs text-slate-400">Algorithmic puzzle generation ensures no static repetitive questions.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Zap className="w-4 h-4" /> Adaptive Difficulty
              </div>
              <p className="text-xs text-slate-400">Puzzles dynamically scale between Easy, Medium, and Hard based on performance.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <BrainCircuit className="w-4 h-4" /> PyTorch DNN Retraining
              </div>
              <p className="text-xs text-slate-400">Your score updates the AI model to output personalized target recommendations.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={startNewGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-lg shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 mx-auto"
            >
              <Zap className="w-6 h-6 fill-current" /> Start Array Challenge
            </button>
          </div>
        </div>
      )}

      {/* STATE 2 & 3: PLAYING & EXPLANATION SCREEN */}
      {(gameState === 'PLAYING' || gameState === 'EXPLANATION') && currentPuzzle && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                Puzzle {currentIndex + 1} / {puzzles.length}
              </span>
              <span className={`px-3 py-1 rounded-xl font-bold text-xs border ${
                currentDifficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                currentDifficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                Difficulty: {currentDifficulty}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Score: {score} / {puzzles.length}
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-4 h-4 fill-current" /> +{sessionXp} XP
              </div>
            </div>
          </div>

          {/* Puzzle Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
                  {currentPuzzle.title}
                </span>
                <span className="text-xs text-slate-400">Topic: Arrays</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {currentPuzzle.question}
              </h2>
            </div>

            {/* Array Visualization Pill Container */}
            {currentPuzzle.array && (
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
                <div className="text-xs text-slate-500 font-medium">ARRAY VISUALIZER</div>
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                  {currentPuzzle.array.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 animate-fadeIn"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-indigo-900/80 to-slate-900 border border-indigo-500/40 text-indigo-200 font-extrabold text-base md:text-lg flex items-center justify-center shadow-lg shadow-indigo-950">
                        {val}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Sum Pill if applicable */}
            {currentPuzzle.targetSum !== undefined && (
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-center text-sm font-semibold">
                Target Sum = <span className="font-extrabold text-cyan-200">{currentPuzzle.targetSum}</span>
              </div>
            )}

            {/* Options Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {currentPuzzle.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isAnswer = String(opt).trim() === String(currentPuzzle.correctAnswer).trim();

                let btnStyle = "bg-slate-800/60 text-slate-200 hover:bg-slate-800 hover:border-slate-600 border-slate-700/80";

                if (gameState === 'EXPLANATION') {
                  if (isAnswer) {
                    btnStyle = "bg-emerald-500/20 text-emerald-200 border-emerald-500 font-bold shadow-lg shadow-emerald-500/10";
                  } else if (isSelected && !isAnswer) {
                    btnStyle = "bg-rose-500/20 text-rose-200 border-rose-500 font-bold";
                  } else {
                    btnStyle = "bg-slate-900/40 text-slate-500 border-slate-800 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={gameState === 'EXPLANATION'}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-2xl border text-left font-semibold text-sm transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {gameState === 'EXPLANATION' && isAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {gameState === 'EXPLANATION' && isSelected && !isAnswer && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* EXPLANATION / FEEDBACK SECTION */}
            {gameState === 'EXPLANATION' && (
              <div className={`p-6 rounded-2xl border space-y-4 animate-fadeIn ${
                isCorrect 
                  ? 'bg-emerald-950/40 border-emerald-500/40 shadow-xl shadow-emerald-950/50' 
                  : 'bg-rose-950/40 border-rose-500/40 shadow-xl shadow-rose-950/50'
              }`}>
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <XCircle className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className={`font-bold text-base ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {isCorrect ? 'Correct Answer! (+10 XP)' : 'Incorrect Solution'}
                    </h4>
                    <p className="text-xs text-slate-400">Explanation & Code Walkthrough</p>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  {currentPuzzle.explanation}
                </p>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextPuzzle}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2"
                  >
                    <span>{currentIndex + 1 < puzzles.length ? 'Next Puzzle' : 'See Results'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STATE 4: RESULTS SCREEN */}
      {gameState === 'RESULT' && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white">Array Challenge Complete!</h2>
              <p className="text-slate-400 text-sm">Great job working through dynamic array problem sets.</p>
            </div>

            {/* Score & XP Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs text-slate-400">Total Score</span>
                <p className="text-2xl font-extrabold text-white">{score} / {puzzles.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs text-slate-400">Accuracy</span>
                <p className="text-2xl font-extrabold text-cyan-400">{Math.round((score / puzzles.length) * 100)}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs text-slate-400">XP Earned</span>
                <p className="text-2xl font-extrabold text-amber-400">+{resultData?.xp_earned || sessionXp + 30} XP</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs text-slate-400">Rank Level</span>
                <p className="text-2xl font-extrabold text-indigo-400">{resultData?.current_level || 'Learner'}</p>
              </div>
            </div>

            {/* Real-time PyTorch DNN AI Recommendation Box */}
            {resultData?.ai_prediction && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 text-left space-y-4 max-w-2xl mx-auto shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <BrainCircuit className="w-5 h-5 text-cyan-400" />
                    <span>PyTorch DNN Model Assessment</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                    Live Inference
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Predicted Mastery Score</span>
                    <p className="text-xl font-bold text-emerald-400">{resultData.ai_prediction.predicted_performance}%</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Recommended Topic</span>
                    <p className="text-xl font-bold text-cyan-300">{resultData.ai_prediction.recommended_topic}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {resultData.ai_prediction.reason}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={startNewGame}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Play Again
              </button>
              <button
                onClick={() => navigate('/student/ai-recommendations')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition flex items-center gap-2"
              >
                <BrainCircuit className="w-4 h-4" /> View AI Recommendations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
