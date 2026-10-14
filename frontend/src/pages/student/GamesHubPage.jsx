import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_CATALOG } from '../../games/gameEngine';
import { Gamepad2, Sparkles, ArrowRight, Lock, Code2, Layers, GitCommit, Type, Network, Zap } from 'lucide-react';

export function GamesHubPage() {
  const navigate = useNavigate();

  const getIcon = (topic) => {
    switch (topic) {
      case 'Arrays': return Code2;
      case 'Strings': return Type;
      case 'Linked Lists': return GitCommit;
      case 'Stacks & Queues': return Layers;
      case 'Trees': return Network;
      default: return Gamepad2;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Arcade
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Data Structure & Algorithm Puzzle Games
            </h1>
          </div>
        </div>
        <p className="text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
          Level up your coding skills through interactive, adaptive puzzle games. Earn XP, rank up your student profile, and train your PyTorch DNN AI engine with real-time performance tracking!
        </p>
      </div>

      {/* Catalog Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400 fill-current" /> Select a Learning Challenge
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAME_CATALOG.map((game) => {
            const Icon = getIcon(game.topic);
            const isActive = game.active;

            return (
              <div
                key={game.id}
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
                  isActive 
                    ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10' 
                    : 'bg-slate-900/40 border-slate-800/60 opacity-70'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {game.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Difficulty: <span className="text-slate-300">{game.difficulty}</span>
                  </span>

                  {isActive ? (
                    <button
                      onClick={() => navigate(game.route)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
                    >
                      <span>Play Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-500 font-semibold text-xs flex items-center gap-1 border border-slate-700/50">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
