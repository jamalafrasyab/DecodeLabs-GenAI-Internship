import React from 'react';
import { 
  Terminal, 
  Cpu, 
  Database, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  BookOpen,
  Activity
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'exam' | 'blueprint' | 'persistence';
  setActiveTab: (tab: 'chat' | 'exam' | 'blueprint' | 'persistence') => void;
  systemStatus: {
    online: boolean;
    hasKey: boolean;
    model: string;
  };
  totalTurns: number;
  slidingWindowEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  systemStatus,
  totalTurns,
  slidingWindowEnabled,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      {/* Top Industrial Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border-b border-emerald-900/40 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between text-slate-300">
        <div className="flex items-center space-x-2 font-mono">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            Batch: 2026
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-emerald-400 font-medium tracking-wide">
            Powered by DecodeLabs
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Industrial Training Kit: Generative AI</span>
        </div>

        <div className="flex items-center space-x-3 font-mono">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className={`w-2 h-2 rounded-full ${systemStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-slate-300 text-xs">
              {systemStatus.model || 'gemini-3.8-flash'}
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 border border-slate-700 text-cyan-300">
            Turns: <strong className="text-white">{totalTurns}</strong>
          </span>
          {slidingWindowEnabled && (
            <span className="px-2 py-0.5 rounded text-[11px] bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
              FIFO Active
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <Terminal className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Project 1: Custom AI Chatbot with Memory
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
                Stateful Architecture
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Transforming stateless frontier LLMs via active in-memory payloads, Caliper gate & FIFO pruning
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Live Terminal & Loop</span>
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'exam'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Memory Exam (Slide 13)</span>
          </button>

          <button
            onClick={() => setActiveTab('blueprint')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'blueprint'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Blueprint & Slides</span>
          </button>

          <button
            onClick={() => setActiveTab('persistence')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'persistence'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Persistence Lab</span>
          </button>
        </div>
      </div>
    </header>
  );
};
