import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Server, 
  RefreshCw, 
  Zap, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  HardDrive,
  Cpu
} from 'lucide-react';
import { SessionRecord, ChatMessage } from '../types/chat';

interface PersistenceLabProps {
  currentSessionId: string;
  onSwitchSession: (sessionId: string, storageMode: 'ram' | 'postgres') => void;
  activeHistory: ChatMessage[];
  storageMode: 'ram' | 'postgres';
  setStorageMode: (mode: 'ram' | 'postgres') => void;
}

export const PersistenceLab: React.FC<PersistenceLabProps> = ({
  currentSessionId,
  onSwitchSession,
  activeHistory,
  storageMode,
  setStorageMode,
}) => {
  const [ramSessions, setRamSessions] = useState<SessionRecord[]>([]);
  const [postgresSessions, setPostgresSessions] = useState<SessionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [restartLog, setRestartLog] = useState<string | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      setRamSessions(data.ram || []);
      setPostgresSessions(data.postgres || []);
    } catch (err) {
      console.error('Failed to load sessions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [activeHistory]);

  const handleSimulateRestart = async () => {
    setIsLoading(true);
    setRestartLog(null);
    try {
      const res = await fetch('/api/sessions/simulate-restart', {
        method: 'POST',
      });
      const data = await res.json();
      setRestartLog(data.message);
      await fetchSessions();
    } catch (err) {
      console.error('Restart failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = (type: 'ram' | 'postgres') => {
    const newId = `session-${Math.random().toString(36).substring(2, 9)}`;
    onSwitchSession(newId, type);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-slate-200">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
              <span>Slide 14 & 16 Interactive Lab</span>
              <span>•</span>
              <span>Persistence & Ephemeral RAM</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Local RAM vs. Relational PostgreSQL Persistence
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Understand why in-memory RAM arrays are fatally flawed for production SaaS deployments, and how relational PostgreSQL with JSONB columns guarantees session isolation.
            </p>
          </div>

          {/* Simulate Server Restart Button (Slide 14) */}
          <button
            onClick={handleSimulateRestart}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold transition shadow-lg shrink-0 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Simulate Redeploy / Server Crash (Slide 14)</span>
          </button>
        </div>

        {/* Restart Log Banner */}
        {restartLog && (
          <div className="p-3 bg-amber-950/40 border border-amber-900/60 rounded-xl text-xs text-amber-200 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{restartLog}</span>
            </div>
            <button
              onClick={() => setRestartLog(null)}
              className="text-amber-400 hover:text-white text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tier 1: Local RAM (Slide 14) */}
        <div className={`p-5 rounded-2xl border transition-all ${
          storageMode === 'ram'
            ? 'bg-slate-900 border-cyan-500/50 shadow-xl'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Tier A: Local In-Memory RAM</h3>
                <span className="text-[10px] text-rose-400 font-mono">
                  Ephemeral • Lost on Server Restart
                </span>
              </div>
            </div>

            <button
              onClick={() => createNewSession('ram')}
              className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <Plus className="w-3 h-3" />
              <span>New RAM Session</span>
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintains an active in-memory JavaScript array (<code className="text-cyan-300 font-mono">Map&lt;string, Turn[]&gt;</code>). Ultra fast, but completely wiped when the host server restarts or scales to zero.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>ACTIVE RAM SESSIONS</span>
                <span className="text-cyan-400 font-bold">{ramSessions.length} sessions</span>
              </div>

              {ramSessions.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  RAM is currently empty (or was wiped by server restart).
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {ramSessions.map((s) => (
                    <div
                      key={s.sessionId}
                      onClick={() => onSwitchSession(s.sessionId, 'ram')}
                      className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition ${
                        currentSessionId === s.sessionId && storageMode === 'ram'
                          ? 'bg-cyan-950/40 border border-cyan-500/50 text-white'
                          : 'bg-slate-900 border border-slate-800/80 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <div className="font-mono truncate">{s.sessionId}</div>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300 font-mono">
                        {s.turnCount} turns
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2: Relational PostgreSQL (Slide 16) */}
        <div className={`p-5 rounded-2xl border transition-all ${
          storageMode === 'postgres'
            ? 'bg-slate-900 border-emerald-500/50 shadow-xl'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Tier B: Relational PostgreSQL (JSONB)</h3>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Durable • Survives Server Restarts
                </span>
              </div>
            </div>

            <button
              onClick={() => createNewSession('postgres')}
              className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <Plus className="w-3 h-3" />
              <span>New Postgres Session</span>
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Stores serialized role-content arrays inside structured <code className="text-emerald-300 font-mono">JSONB</code> columns keyed by UUID <code className="text-emerald-300 font-mono">session_id</code>. Survives redeployments.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>DURABLE POSTGRES SESSIONS</span>
                <span className="text-emerald-400 font-bold">{postgresSessions.length} sessions</span>
              </div>

              {postgresSessions.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  No sessions in PostgreSQL table yet. Switch mode to start writing.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {postgresSessions.map((s) => (
                    <div
                      key={s.sessionId}
                      onClick={() => onSwitchSession(s.sessionId, 'postgres')}
                      className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition ${
                        currentSessionId === s.sessionId && storageMode === 'postgres'
                          ? 'bg-emerald-950/40 border border-emerald-500/50 text-white'
                          : 'bg-slate-900 border border-slate-800/80 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <div className="font-mono truncate">{s.sessionId}</div>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-300 font-mono">
                        {s.turnCount} turns
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SQL Schema Inspector (Slide 16) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
          <span className="text-white font-bold flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-400" />
            Slide 16 Schema Specification (DDL)
          </span>
          <span className="text-[11px] text-cyan-300">langchain-postgres schema pattern</span>
        </div>

        <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-300 overflow-x-auto text-[11px] leading-relaxed">
{`CREATE TABLE chat_message_history (
    id SERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    message JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_session ON chat_message_history(session_id);`}
        </pre>
      </div>
    </div>
  );
};
