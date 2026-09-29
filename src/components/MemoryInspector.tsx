import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Sliders, 
  ShieldAlert, 
  ShieldCheck, 
  Code, 
  Sparkles, 
  Database, 
  Copy, 
  Check, 
  Clock, 
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, TurnMetrics } from '../types/chat';

interface MemoryInspectorProps {
  history: ChatMessage[];
  slidingWindowEnabled: boolean;
  setSlidingWindowEnabled: (enabled: boolean) => void;
  slidingWindowSize: number;
  setSlidingWindowSize: (size: number) => void;
  bypassCaliper: boolean;
  setBypassCaliper: (bypass: boolean) => void;
  lastMetrics: TurnMetrics | null;
  storageMode: 'ram' | 'postgres';
  setStorageMode: (mode: 'ram' | 'postgres') => void;
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({
  history,
  slidingWindowEnabled,
  setSlidingWindowEnabled,
  slidingWindowSize,
  setSlidingWindowSize,
  bypassCaliper,
  setBypassCaliper,
  lastMetrics,
  storageMode,
  setStorageMode,
}) => {
  const [activeTab, setActiveTab] = useState<'payload' | 'buffer' | 'settings'>('payload');
  const [copied, setCopied] = useState(false);

  // Compute effective history and pruned items
  const isPruningActive = slidingWindowEnabled && history.length > slidingWindowSize;
  const prunedCount = isPruningActive ? Math.max(0, history.length - slidingWindowSize) : 0;
  const activeWindowMessages = isPruningActive ? history.slice(prunedCount) : history;
  const prunedMessages = isPruningActive ? history.slice(0, prunedCount) : [];

  // Approximate token calculation (1 token ~ 4 chars for rough estimation)
  const totalCharacters = history.reduce(
    (acc, m) => acc + m.parts.reduce((pAcc, p) => pAcc + p.text.length, 0),
    0
  );
  const estimatedTokens = Math.round(totalCharacters / 4);
  const activeCharacters = activeWindowMessages.reduce(
    (acc, m) => acc + m.parts.reduce((pAcc, p) => pAcc + p.text.length, 0),
    0
  );
  const activeTokens = Math.round(activeCharacters / 4);

  // Payload format matching Slide 8
  const currentPayloadJson = JSON.stringify(
    activeWindowMessages.map((m) => ({
      role: m.role,
      parts: m.parts.map((p) => ({ text: p.text })),
    })),
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPayloadJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden shadow-xl text-slate-200">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              Memory Loop Inspector
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              (M_t ∪ H_t-1) → Cloud SDK → R_t
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('payload')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'payload'
                ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Payload
          </button>
          <button
            onClick={() => setActiveTab('buffer')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'buffer'
                ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FIFO Buffer
            {prunedCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'settings'
                ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Controls
          </button>
        </div>
      </div>

      {/* Real-time State Indicators Bar */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/40 border-b border-slate-800/80 text-[11px] font-mono">
        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-400 flex items-center justify-between">
            <span>In-Memory RAM</span>
            <Database className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white mt-1">
            {history.length} <span className="text-xs font-normal text-slate-400">turns</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {storageMode === 'ram' ? 'Ephemeral RAM' : 'PostgreSQL JSONB'}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-400 flex items-center justify-between">
            <span>Token Budget</span>
            <Flame className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-amber-300 mt-1">
            ~{slidingWindowEnabled ? activeTokens : estimatedTokens} <span className="text-xs font-normal text-slate-400">tkns</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {lastMetrics?.usageMetadata?.totalTokenCount 
              ? `API reported: ${lastMetrics.usageMetadata.totalTokenCount}`
              : 'Context window safe'}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-400 flex items-center justify-between">
            <span>Caliper Gate</span>
            {bypassCaliper ? (
              <ShieldAlert className="w-3 h-3 text-rose-400" />
            ) : (
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            )}
          </div>
          <div className={`text-sm font-bold mt-1 ${bypassCaliper ? 'text-rose-400' : 'text-emerald-400'}`}>
            {bypassCaliper ? 'BYPASSED' : 'ACTIVE'}
          </div>
          <div className="text-[10px] text-slate-500">
            {bypassCaliper ? 'Empty crashes API' : 'Guards HTTP 400'}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'payload' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                Active Serialized Schema (Slide 8)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-emerald-400 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Payload'}</span>
              </button>
            </div>

            {history.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs">
                <p>History array is currently empty.</p>
                <p className="mt-1 font-mono text-[11px] text-slate-600">
                  Send a message to initialize the in-memory array.
                </p>
              </div>
            ) : (
              <div className="relative">
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-96 leading-relaxed selection:bg-emerald-900">
                  {currentPayloadJson}
                </pre>
              </div>
            )}

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-200">Session Schema Anatomy:</div>
              <p>
                Each element strictly implements <code className="text-emerald-300 font-mono">role: 'user' | 'model'</code> and a <code className="text-emerald-300 font-mono">parts: [{'{'} text {'}'}]</code> array to satisfy frontier LLM schema standards without raw text string concatenation.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'buffer' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-white">
                  The Sliding Window Algorithm (Slide 12)
                </h3>
                <p className="text-[11px] text-slate-400">
                  First-In-First-Out (FIFO) pruning logic drops oldest message pairs
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                slidingWindowEnabled ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-500'
              }`}>
                {slidingWindowEnabled ? `Limit: ${slidingWindowSize} Turns` : 'Unbounded RAM'}
              </span>
            </div>

            {/* Visual Box Diagram of the Rolling Window */}
            <div className="border border-slate-800 bg-slate-950 p-4 rounded-xl space-y-3 font-mono text-xs">
              <div className="text-[11px] text-slate-400 flex items-center justify-between pb-1 border-b border-slate-800">
                <span>BUFFER CAPACITY & PRUNING STATUS</span>
                <span>{history.length} Total Messages</span>
              </div>

              {prunedMessages.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-rose-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Truncated Messages (FIFO Dropped)
                    </span>
                    <span>{prunedMessages.length} items dropped</span>
                  </div>
                  <div className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-lg space-y-1 max-h-32 overflow-y-auto">
                    {prunedMessages.map((msg, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-[10px] text-rose-300/80 line-through">
                        <span className="uppercase font-bold w-12 shrink-0">{msg.role}:</span>
                        <span className="truncate">{msg.parts[0]?.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-emerald-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Active Rolling Window (Transmitted to LLM)
                  </span>
                  <span>{activeWindowMessages.length} / {slidingWindowSize} capacity</span>
                </div>
                <div className="p-2.5 bg-emerald-950/20 border border-emerald-800/40 rounded-lg space-y-1 max-h-48 overflow-y-auto">
                  {activeWindowMessages.length === 0 ? (
                    <div className="text-slate-600 text-center py-2">No messages in window</div>
                  ) : (
                    activeWindowMessages.map((msg, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-[11px]">
                        <span className={`uppercase font-bold w-12 shrink-0 ${
                          msg.role === 'user' ? 'text-cyan-400' : 'text-emerald-400'
                        }`}>
                          {msg.role}:
                        </span>
                        <span className="text-slate-300 truncate">{msg.parts[0]?.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-white">Why FIFO Pruning is Mandatory:</span>
              <p>
                As conversations expand, token overhead scales aggressively ($O(N)$ network payload increase per turn). FIFO pruning caps memory at the most recent $K$ turns to prevent token budget exhaustion.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 text-xs">
            {/* Sliding Window Toggle & Slider */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Sliding Window Pruning (Slide 12)</div>
                  <div className="text-[11px] text-slate-400">Enforce FIFO truncation on old turns</div>
                </div>
                <button
                  onClick={() => setSlidingWindowEnabled(!slidingWindowEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    slidingWindowEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      slidingWindowEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {slidingWindowEnabled && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">Max Window Size:</span>
                    <span className="font-mono text-cyan-300 font-bold">{slidingWindowSize} messages</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="2"
                    value={slidingWindowSize}
                    onChange={(e) => setSlidingWindowSize(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>2 turns (Ultra aggressive)</span>
                    <span>10 turns</span>
                    <span>20 turns</span>
                  </div>
                </div>
              )}
            </div>

            {/* Caliper Validation Gate Bypass (Slide 9 test) */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>Caliper Gate Security Guard (Slide 9)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Intercept empty/whitespace payloads before LLM dispatch
                  </div>
                </div>
                <button
                  onClick={() => setBypassCaliper(!bypassCaliper)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition ${
                    bypassCaliper
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {bypassCaliper ? 'Vulnerability Mode (Bypassed)' : 'Protected'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                {bypassCaliper ? (
                  <span className="text-rose-400">
                    ⚠️ Guard disabled! An empty message will hit the GenAI API directly, triggering a live 400 Bad Request error.
                  </span>
                ) : (
                  <span>
                    ✓ Protected: Empty and whitespace strings will be blocked gracefully at application layer.
                  </span>
                )}
              </p>
            </div>

            {/* Storage Mode Selector (Slide 14 vs 16) */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="font-semibold text-white">Active Persistence Tier (Slide 14-16)</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  onClick={() => setStorageMode('ram')}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    storageMode === 'ram'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <Database className="w-3 h-3 text-cyan-400" />
                    Local RAM
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Ephemeral memory, wiped on server restart</div>
                </button>

                <button
                  onClick={() => setStorageMode('postgres')}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    storageMode === 'postgres'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <Database className="w-3 h-3 text-emerald-400" />
                    PostgreSQL JSONB
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Structured relational persistence by session_id</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      {lastMetrics && (
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            Turn Latency: <strong className="text-white">{lastMetrics.latencyMs}ms</strong>
          </span>
          <span className="flex items-center gap-1">
            Effective Context: <strong className="text-emerald-400">{lastMetrics.effectiveTurns}</strong> turns
          </span>
        </div>
      )}
    </div>
  );
};
