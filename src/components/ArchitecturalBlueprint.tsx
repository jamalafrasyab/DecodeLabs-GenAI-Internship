import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Workflow, 
  Boxes, 
  FileCode, 
  Server, 
  Table, 
  Compass, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const ArchitecturalBlueprint: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<string>('blueprint');

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-slate-200">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
              <span>DecodeLabs Industrial Training Kit</span>
              <span>•</span>
              <span>Project 1 Specification</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Engineering Stateful Conversational Agents
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              From local in-memory RAM loops to enterprise-scale relational persistence. Explore the architectural mechanisms that transform stateless LLMs into stateful conversational engines.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSlide('blueprint')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                activeSlide === 'blueprint'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              The Completed Blueprint
            </button>
            <button
              onClick={() => setActiveSlide('loop')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                activeSlide === 'loop'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Memory Loop & Schema
            </button>
            <button
              onClick={() => setActiveSlide('matrix')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                activeSlide === 'matrix'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Stateless vs Stateful
            </button>
            <button
              onClick={() => setActiveSlide('storage')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                activeSlide === 'storage'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Storage Tier Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Main View Port */}
      {activeSlide === 'blueprint' && (
        <div className="space-y-6">
          {/* Interactive Slide 19: The Completed Blueprint */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-emerald-400" />
                  The Completed Blueprint (Slide 19)
                </h3>
                <p className="text-xs text-slate-400">
                  End-to-end data pipeline from user dispatch to relational persistence
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                End-to-End Orchestration
              </span>
            </div>

            {/* Visual Interactive Pipeline Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1: Input & Caliper Validation Gate */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-emerald-500/50 transition">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
                    <span>STAGE 01</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase">Caliper Validation Gate</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Evaluates incoming transaction $M_t$. Blocks empty strings and whitespace payloads before reaching GenAI API to prevent 400 Bad Request crashes.
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                  <code>if (!input.trim()) reject(400);</code>
                </div>
              </div>

              {/* Step 2: Sliding Window Box (FIFO) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-cyan-500/50 transition">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                    <span>STAGE 02</span>
                    <Boxes className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase">Sliding Window Box</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Monitors in-memory array size. As turns accumulate, oldest message pairs are truncated via FIFO pruning to prevent token budget exhaustion.
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                  <code>history.slice(-windowLimit);</code>
                </div>
              </div>

              {/* Step 3: GenAI SDK Transmission */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-emerald-500/50 transition">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
                    <span>STAGE 03</span>
                    <Cpu className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase">Cloud SDK Transmission</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Transmits complete (M_t ∪ H_t-1) structured payload array to frontier model endpoint (<code className="text-emerald-400">gemini-3.8-flash</code>) and generates R_t.
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                  <code>ai.models.generateContent()</code>
                </div>
              </div>

              {/* Step 4: Relational Persistence Grid */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-amber-500/50 transition">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1">
                    <span>STAGE 04</span>
                    <Database className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase">Relational Grid (Postgres)</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Appends updated history $(H_t)$ into durable storage keyed by UUID <code className="text-amber-300">session_id</code> with <code className="text-amber-300">JSONB</code> payload, surviving host redeployments.
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                  <code>session_id: UUID, message: JSONB</code>
                </div>
              </div>
            </div>

            {/* Slide 4 Sub-blocks: Context State, Query History, Session Metadata */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Slide 4: Core Architectural Blocks
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-emerald-400 font-bold text-[11px]">BLOCK 001: CONTEXT STATE</div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    Active working memory representation containing validated user queries and AI assistant outputs.
                  </div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-cyan-400 font-bold text-[11px]">BLOCK 002: QUERY HISTORY</div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    Chronological serialization of turns structured under SDK schema specifications.
                  </div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-amber-400 font-bold text-[11px]">BLOCK 003: SESSION METADATA</div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    Session identifiers, timestamps, token counts, and sliding window capacity metrics.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSlide === 'loop' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Constructing the Artificial Memory Loop (Slide 7 & 10) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              The Artificial Memory Loop (Slide 7 & 10)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every conversational turn executes exactly two fundamental steps before calling the GenAI API:
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">1. Ingest & Append</div>
                <div className="text-slate-300">
                  Append user's validated input $M_t$ to the local history list as a structured user content object:
                </div>
                <div className="mt-2 p-2 bg-slate-900 rounded text-[11px] text-cyan-300">
                  <code>H_t = [...H_{'{'}t-1{'}'}, {'{'} role: 'user', parts: [M_t] {'}'}]</code>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">2. Transmit & Record</div>
                <div className="text-slate-300">
                  Pass the entire updated history list as the payload to the GenAI client, and append the model's generated response $R_t$ to that same list:
                </div>
                <div className="mt-2 p-2 bg-slate-900 rounded text-[11px] text-emerald-300">
                  <code>H_final = [...H_t, {'{'} role: 'model', parts: [R_t] {'}'}]</code>
                </div>
              </div>
            </div>
          </div>

          {/* Anatomy of a Chat Session Schema (Slide 8) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              Anatomy of Chat Session Schema (Slide 8)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern generative AI SDKs manage conversation data using serialized lists of objects, moving away from legacy raw text prompt concatenation.
            </p>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
              <div className="text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                STRUCTURAL SCHEMA DEFINITION:
              </div>
              <pre className="text-emerald-300 text-[11px] leading-relaxed overflow-x-auto">
{`interface ChatTurnPayload {
  role: 'user' | 'model'; // Source categorizer
  parts: [
    {
      text: string; // Payload string
    }
  ];
}`}
              </pre>
              <div className="text-[10px] text-slate-400 space-y-1">
                <div>• <strong className="text-white">user:</strong> The human conversational partner providing prompts.</div>
                <div>• <strong className="text-white">model:</strong> The generative model providing responses.</div>
                <div>• <strong className="text-white">parts:</strong> Array housing text, multimodal elements, or tool calls.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSlide === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-emerald-400" />
                The Paradigm Shift: Stateless vs. Stateful (Slide 6)
              </h3>
              <p className="text-xs text-slate-400">
                Architectural comparison between legacy completions and stateful conversational sessions
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
              Slide 6 Reference
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-300 font-mono text-[11px]">
                  <th className="p-3">Architectural Vector</th>
                  <th className="p-3 text-slate-400">Stateless API Completion</th>
                  <th className="p-3 text-emerald-400">Stateful Chat Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                <tr className="hover:bg-slate-950/30">
                  <td className="p-3 font-semibold text-white font-mono text-[11px]">API Endpoint Type</td>
                  <td className="p-3 text-slate-400">Legacy freeform text completion prompt</td>
                  <td className="p-3 text-emerald-300">Structured chat completions / active sessions</td>
                </tr>
                <tr className="hover:bg-slate-950/30">
                  <td className="p-3 font-semibold text-white font-mono text-[11px]">State Location</td>
                  <td className="p-3 text-slate-400">Server treats each request as a total stranger</td>
                  <td className="p-3 text-emerald-300">Client-side or database-managed historical array</td>
                </tr>
                <tr className="hover:bg-slate-950/30">
                  <td className="p-3 font-semibold text-white font-mono text-[11px]">Context Assembly</td>
                  <td className="p-3 text-slate-400">Manual text concatenation via custom strings</td>
                  <td className="p-3 text-emerald-300">Array of structured role-content objects</td>
                </tr>
                <tr className="hover:bg-slate-950/30">
                  <td className="p-3 font-semibold text-white font-mono text-[11px]">Network Overhead</td>
                  <td className="p-3 text-slate-400">Low for single requests</td>
                  <td className="p-3 text-emerald-300">High; the entire historical array is sent with every turn</td>
                </tr>
                <tr className="hover:bg-slate-950/30">
                  <td className="p-3 font-semibold text-white font-mono text-[11px]">Downstream Failure Risks</td>
                  <td className="p-3 text-slate-400">Minimal session-level crashes</td>
                  <td className="p-3 text-rose-300">Potential context window overflow or token budget exhaustion</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSlide === 'storage' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                The Enterprise Architecture Matrix (Slide 14 - 18)
              </h3>
              <p className="text-xs text-slate-400">
                Comparing storage tier trade-offs from local RAM to PostgreSQL and Firebase SQL Connect
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-amber-300">
              Slide 18 Matrix
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PostgreSQL */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span className="font-bold">POSTGRESQL</span>
                <Database className="w-4 h-4" />
              </div>
              <ul className="text-xs space-y-2 text-slate-300">
                <li><strong className="text-white">Data Schema:</strong> Structured tables with JSONB payload</li>
                <li><strong className="text-white">Session Isolation:</strong> Primary/foreign keys via UUID session_id</li>
                <li><strong className="text-white">Scale Constraints:</strong> Disk space & connection pools</li>
                <li><strong className="text-white">Billing Model:</strong> Flat rate allocated server instance</li>
              </ul>
              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900">
                Slide 16: Optimal for enterprise stateful chat loops.
              </div>
            </div>

            {/* Cloud Firestore */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <span className="font-bold">FIRESTORE (NoSQL)</span>
                <Server className="w-4 h-4" />
              </div>
              <ul className="text-xs space-y-2 text-slate-300">
                <li><strong className="text-white">Data Schema:</strong> Schemaless hierarchical documents</li>
                <li><strong className="text-white">Session Isolation:</strong> Unique document identifiers</li>
                <li><strong className="text-rose-400">Scale Bottleneck:</strong> Strict 1MB document cap; subcollections incur high per-op read/write costs</li>
                <li><strong className="text-white">Billing Model:</strong> Pay-per-use read/write ops</li>
              </ul>
              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900">
                Slide 15: Single document crashes when array exceeds 1MB.
              </div>
            </div>

            {/* Firebase SQL Connect */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span className="font-bold">SQL CONNECT</span>
                <Cpu className="w-4 h-4" />
              </div>
              <ul className="text-xs space-y-2 text-slate-300">
                <li><strong className="text-white">Data Schema:</strong> Managed relational schemas via GraphQL</li>
                <li><strong className="text-white">Session Isolation:</strong> SQL row-level security / GraphQL filters</li>
                <li><strong className="text-white">Scale Constraints:</strong> Scaled horizontally via managed Cloud SQL</li>
                <li><strong className="text-white">Billing Model:</strong> Tiered pricing based on Cloud SQL usage</li>
              </ul>
              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900">
                Slide 17: Enterprise-grade managed persistent layer.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
