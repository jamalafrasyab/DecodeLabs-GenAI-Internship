import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RefreshCw, 
  Bot, 
  User, 
  Sparkles, 
  FileText, 
  Clock, 
  ArrowRight,
  Database
} from 'lucide-react';
import { AuditResult, AuditPhase, ChatMessage } from '../types/chat';

interface MemoryExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyHistory: (history: ChatMessage[]) => void;
}

export const MemoryExamModal: React.FC<MemoryExamModalProps> = ({
  isOpen,
  onClose,
  onApplyHistory,
}) => {
  const [customName, setCustomName] = useState('Vipin');
  const [isRunning, setIsRunning] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentRunningPhase, setCurrentRunningPhase] = useState<number | null>(null);

  if (!isOpen) return null;

  const runExam = async () => {
    setIsRunning(true);
    setError(null);
    setAuditResult(null);
    setCurrentRunningPhase(1);

    try {
      const response = await fetch('/api/audit/memory-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customName: customName.trim() || 'Vipin' }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Audit execution failed');
      }

      const data: AuditResult = await response.json();
      setAuditResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to complete Memory Exam');
    } finally {
      setIsRunning(false);
      setCurrentRunningPhase(null);
    }
  };

  const handleImportToTerminal = () => {
    if (auditResult && auditResult.finalHistory) {
      onApplyHistory(auditResult.finalHistory);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">System Audit: The Memory Exam</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  Slide 13 Specification
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verifies state initialization, context distraction tolerance, and state extraction
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Configuration Form */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Entity Name (Phase 1 Injection):
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                disabled={isRunning}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono w-48"
                placeholder="e.g. Vipin"
              />
            </div>

            <button
              onClick={runExam}
              disabled={isRunning}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition disabled:opacity-50 shadow-md cursor-pointer self-end sm:self-auto"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing 3-Phase Audit...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Run Memory Exam</span>
                </>
              )}
            </button>
          </div>

          {/* Test Description Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className={`p-3 rounded-xl border ${currentRunningPhase === 1 ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-800 bg-slate-950/60'}`}>
              <div className="text-emerald-400 font-bold text-[11px] mb-1">Phase 1: State Init</div>
              <div className="text-slate-300 text-[11px]">User: "My name is {customName || 'Vipin'}"</div>
              <div className="text-[10px] text-slate-500 mt-1">Expected: Model acknowledges identity into memory array</div>
            </div>

            <div className={`p-3 rounded-xl border ${currentRunningPhase === 2 ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-800 bg-slate-950/60'}`}>
              <div className="text-cyan-400 font-bold text-[11px] mb-1">Phase 2: Distraction</div>
              <div className="text-slate-300 text-[11px]">User: "Write a poem about tech..."</div>
              <div className="text-[10px] text-slate-500 mt-1">Forces large-volume token generation to stress context window</div>
            </div>

            <div className={`p-3 rounded-xl border ${currentRunningPhase === 3 ? 'border-amber-500 bg-amber-950/20' : 'border-slate-800 bg-slate-950/60'}`}>
              <div className="text-amber-400 font-bold text-[11px] mb-1">Phase 3: State Extraction</div>
              <div className="text-slate-300 text-[11px]">User: "What is my name?"</div>
              <div className="text-[10px] text-slate-500 mt-1">Expected: Successfully extracts "{customName || 'Vipin'}" from history</div>
            </div>
          </div>

          {/* Execution Results */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {auditResult && (
            <div className="space-y-4">
              {/* Verdict Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                auditResult.auditPassed
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {auditResult.auditPassed ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold">
                      {auditResult.auditPassed
                        ? `AUDIT PASSED: Stateful Memory Retained "${auditResult.evaluatedName}"`
                        : `AUDIT FAILED: Memory Extraction Failed`}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Completed 3 turns with continuous in-memory appending across {auditResult.totalTurns} transactions.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleImportToTerminal}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white hover:border-emerald-500 transition"
                >
                  Import to Live Chat
                </button>
              </div>

              {/* Detailed Phase Logs */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Audit Execution Sequence:
                </h4>
                {auditResult.phases.map((phase: AuditPhase) => (
                  <div
                    key={phase.phase}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-mono flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center text-[10px]">
                          P{phase.phase}
                        </span>
                        {phase.title}
                      </span>
                      <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {phase.durationMs}ms
                        </span>
                        {phase.tokenUsage && (
                          <span className="text-amber-400">
                            {phase.tokenUsage.totalTokenCount} tokens
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          phase.status === 'PASSED' || phase.status === 'SUCCESS'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {phase.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="text-cyan-400 flex items-start gap-1">
                        <span className="text-slate-500">USER:</span>
                        <span>{phase.userInput}</span>
                      </div>
                      <div className="text-slate-300 flex items-start gap-1">
                        <span className="text-slate-500">MODEL:</span>
                        <span className="font-sans line-clamp-3">{phase.modelResponse}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      {phase.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
