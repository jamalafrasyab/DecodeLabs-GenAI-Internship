import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatTerminal } from './components/ChatTerminal';
import { MemoryInspector } from './components/MemoryInspector';
import { MemoryExamModal } from './components/MemoryExamModal';
import { ArchitecturalBlueprint } from './components/ArchitecturalBlueprint';
import { PersistenceLab } from './components/PersistenceLab';
import { ChatMessage, TurnMetrics } from './types/chat';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'exam' | 'blueprint' | 'persistence'>('chat');
  const [sessionId, setSessionId] = useState<string>(() => `sess-${Math.random().toString(36).substring(2, 8)}`);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [storageMode, setStorageMode] = useState<'ram' | 'postgres'>('ram');
  const [slidingWindowEnabled, setSlidingWindowEnabled] = useState<boolean>(true);
  const [slidingWindowSize, setSlidingWindowSize] = useState<number>(10);
  const [bypassCaliper, setBypassCaliper] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [caliperWarning, setCaliperWarning] = useState<string | null>(null);
  const [lastMetrics, setLastMetrics] = useState<TurnMetrics | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState({
    online: true,
    hasKey: true,
    model: 'gemini-3.8-flash',
  });

  // Health check on boot
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setSystemStatus({
          online: data.status === 'online',
          hasKey: data.hasApiKey,
          model: data.model || 'gemini-3.8-flash',
        });
      })
      .catch((err) => {
        console.warn('Health check unreachable:', err);
      });
  }, []);

  // Send conversational turn to backend API
  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    setCaliperWarning(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          sessionId,
          storageMode,
          slidingWindowEnabled,
          slidingWindowSize,
          bypassCaliper,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'CALIPER_GATE_REJECTION') {
          setCaliperWarning(data.message || 'Caliper Validation Gate blocked empty transaction.');
        } else if (data.error === 'UNPROTECTED_API_FAILURE') {
          setCaliperWarning(data.explanation || data.message);
        } else {
          setCaliperWarning(data.message || 'An error occurred during turn generation.');
        }
        return;
      }

      setHistory(data.updatedHistory || []);
      setLastMetrics(data.metrics || null);
    } catch (err: any) {
      console.error('Chat error:', err);
      setCaliperWarning(err.message || 'Failed to communicate with stateful server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setLastMetrics(null);
    setCaliperWarning(null);
  };

  const handleSwitchSession = (newSessionId: string, newMode: 'ram' | 'postgres') => {
    setSessionId(newSessionId);
    setStorageMode(newMode);
    handleClearHistory();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Universal Header with DecodeLabs Brand and Status */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
        totalTurns={history.length}
        slidingWindowEnabled={slidingWindowEnabled}
      />

      {/* Main View Container */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Conversational Terminal */}
            <div className="lg:col-span-7">
              <ChatTerminal
                history={history}
                onSendMessage={handleSendMessage}
                onClearHistory={handleClearHistory}
                isLoading={isLoading}
                caliperWarning={caliperWarning}
                setCaliperWarning={setCaliperWarning}
                bypassCaliper={bypassCaliper}
                setBypassCaliper={setBypassCaliper}
                lastMetrics={lastMetrics}
                onOpenExam={() => setIsExamModalOpen(true)}
              />
            </div>

            {/* Right 5 Columns: Memory Loop Inspector & Controls */}
            <div className="lg:col-span-5 h-[740px]">
              <MemoryInspector
                history={history}
                slidingWindowEnabled={slidingWindowEnabled}
                setSlidingWindowEnabled={setSlidingWindowEnabled}
                slidingWindowSize={slidingWindowSize}
                setSlidingWindowSize={setSlidingWindowSize}
                bypassCaliper={bypassCaliper}
                setBypassCaliper={setBypassCaliper}
                lastMetrics={lastMetrics}
                storageMode={storageMode}
                setStorageMode={setStorageMode}
              />
            </div>
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">System Audit: The Memory Exam (Slide 13)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Run the 3-phase automated memory exam test suite to verify context extraction through the active in-memory loop.
                </p>
              </div>
              <button
                onClick={() => setIsExamModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Launch Exam Suite
              </button>
            </div>
            {/* Embed direct modal/suite view */}
            <MemoryExamModal
              isOpen={true}
              onClose={() => setActiveTab('chat')}
              onApplyHistory={(newHist) => {
                setHistory(newHist);
                setActiveTab('chat');
              }}
            />
          </div>
        )}

        {activeTab === 'blueprint' && <ArchitecturalBlueprint />}

        {activeTab === 'persistence' && (
          <PersistenceLab
            currentSessionId={sessionId}
            onSwitchSession={handleSwitchSession}
            activeHistory={history}
            storageMode={storageMode}
            setStorageMode={setStorageMode}
          />
        )}
      </main>

      {/* Floating System Audit Modal when in chat view */}
      {activeTab === 'chat' && (
        <MemoryExamModal
          isOpen={isExamModalOpen}
          onClose={() => setIsExamModalOpen(false)}
          onApplyHistory={(newHist) => {
            setHistory(newHist);
            setIsExamModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
