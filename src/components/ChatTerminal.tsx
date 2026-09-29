import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  Terminal as TerminalIcon, 
  User, 
  Bot, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw,
  HelpCircle,
  Play
} from 'lucide-react';
import { ChatMessage, TurnMetrics } from '../types/chat';

interface ChatTerminalProps {
  history: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearHistory: () => void;
  isLoading: boolean;
  caliperWarning: string | null;
  setCaliperWarning: (msg: string | null) => void;
  bypassCaliper: boolean;
  setBypassCaliper: (bypass: boolean) => void;
  lastMetrics: TurnMetrics | null;
  onOpenExam: () => void;
}

export const ChatTerminal: React.FC<ChatTerminalProps> = ({
  history,
  onSendMessage,
  onClearHistory,
  isLoading,
  caliperWarning,
  setCaliperWarning,
  bypassCaliper,
  setBypassCaliper,
  lastMetrics,
  onOpenExam,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    // Check Caliper Gate conditions on client side if not bypassed
    if (!bypassCaliper) {
      if (input.length === 0) {
        setCaliperWarning('Structural Validation Gate blocked empty string. Prevented 400 Bad Request error.');
        return;
      }
      if (input.trim().length === 0) {
        setCaliperWarning('Structural Validation Gate blocked whitespace-only input.');
        return;
      }
    }

    setCaliperWarning(null);
    const textToSend = input;
    setInput('');
    await onSendMessage(textToSend);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[740px] overflow-hidden shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>decode@stateful-terminal:~$ ./run_chat_loop.sh</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenExam}
            className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-medium transition"
            title="Run Slide 13 Memory Exam"
          >
            <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span className="hidden sm:inline">Memory Exam</span>
          </button>

          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1 text-xs px-2 py-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
            title="Clear active in-memory array"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Loop</span>
          </button>
        </div>
      </div>

      {/* Caliper Validation Gate Notification Alert */}
      {caliperWarning && (
        <div className="bg-rose-950/40 border-b border-rose-900/60 px-4 py-2 text-xs flex items-center justify-between text-rose-300 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span><strong>Caliper Gate:</strong> {caliperWarning}</span>
          </div>
          <button
            onClick={() => setCaliperWarning(null)}
            className="text-rose-400 hover:text-rose-200 text-xs px-2 py-0.5 rounded border border-rose-800/40"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-inner">
              <TerminalIcon className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-base font-semibold text-white">
                Conversational Memory Array Initialized
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                As detailed in DecodeLabs Project 1, every conversational exchange is ingested and appended to an in-memory history array <code className="font-mono text-emerald-400">M_t ∪ H_t-1</code> and transmitted to the LLM to preserve context.
              </p>
            </div>

            <div className="w-full max-w-lg pt-4">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                Quick Test Prompts (Slide 13 Memory Exam Steps):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => handleQuickPrompt('My name is Vipin.')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 text-left transition"
                >
                  <div className="font-semibold text-emerald-400 text-[11px]">1. Init State</div>
                  <div className="truncate text-slate-400 text-xs">"My name is Vipin."</div>
                </button>
                <button
                  onClick={() => handleQuickPrompt('Write a 3-stanza poem about tech.')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 text-left transition"
                >
                  <div className="font-semibold text-cyan-400 text-[11px]">2. Distraction</div>
                  <div className="truncate text-slate-400 text-xs">"Write a poem..."</div>
                </button>
                <button
                  onClick={() => handleQuickPrompt('What is my name?')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 text-left transition"
                >
                  <div className="font-semibold text-amber-400 text-[11px]">3. State Extract</div>
                  <div className="truncate text-slate-400 text-xs">"What is my name?"</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          history.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed space-y-1.5 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75 font-mono mb-1">
                  <span className="uppercase font-bold tracking-wider">
                    {msg.role === 'user' ? 'USER_01' : 'MODEL_AGENT'}
                  </span>
                  <span>Turn #{index + 1}</span>
                </div>
                <div className="whitespace-pre-wrap font-sans text-xs">
                  {msg.parts.map((part, pIdx) => (
                    <span key={pIdx}>{part.text}</span>
                  ))}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start gap-3 justify-start animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Ingesting into array and querying frontier model...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-1.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
        <span className="text-slate-500 shrink-0">Quick inject:</span>
        <button
          onClick={() => handleQuickPrompt('My name is Vipin')}
          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 shrink-0 transition"
        >
          "My name is Vipin"
        </button>
        <button
          onClick={() => handleQuickPrompt('What is my name?')}
          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 shrink-0 transition"
        >
          "What is my name?"
        </button>
        <button
          onClick={() => handleQuickPrompt('Remember my favorite programming language is TypeScript')}
          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 shrink-0 transition"
        >
          "Remember language is TypeScript"
        </button>
        <button
          onClick={() => handleQuickPrompt('What was my favorite language?')}
          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 shrink-0 transition"
        >
          "What was my favorite language?"
        </button>
        <button
          onClick={() => {
            setInput('');
            setCaliperWarning('Testing Caliper Gate with empty payload: Input evaluated and blocked.');
          }}
          className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-900/60 text-rose-300 hover:bg-rose-900/40 shrink-0 transition"
        >
          Test Empty String
        </button>
      </div>

      {/* Input Form with Caliper Guard Indicator */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (caliperWarning) setCaliperWarning(null);
            }}
            placeholder="Type a message to append to the active conversational history..."
            disabled={isLoading}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans disabled:opacity-60"
          />
          {input.trim().length === 0 && input.length > 0 && (
            <span className="absolute right-3 top-2.5 text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
              Whitespace detected
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition disabled:opacity-50 shadow-md shrink-0 cursor-pointer"
        >
          {isLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <span>Send Turn</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
