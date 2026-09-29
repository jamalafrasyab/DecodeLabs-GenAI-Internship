import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google GenAI client according to AI Studio guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface MessagePart {
  text: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model';
  parts: MessagePart[];
  timestamp?: number;
  pruned?: boolean;
}

interface ChatSessionRecord {
  sessionId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

// In-Memory RAM Store (Slide 14: Ephemeral Nature of Local RAM)
const inMemoryRamSessions = new Map<string, ChatSessionRecord>();

// Simulated PostgreSQL JSONB Store (Slide 16: Relational Persistence)
const relationalDbSessions = new Map<string, ChatSessionRecord>();

// Helper to seed initial session if needed
const getOrCreateSession = (sessionId: string, storageType: 'ram' | 'postgres' = 'ram'): ChatSessionRecord => {
  const store = storageType === 'ram' ? inMemoryRamSessions : relationalDbSessions;
  if (!store.has(sessionId)) {
    store.set(sessionId, {
      sessionId,
      name: `Session-${sessionId.substring(0, 8)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    });
  }
  return store.get(sessionId)!;
};

// Caliper Validation Gate (Slide 9 & 19)
function validateCaliperGate(input: unknown): { isValid: boolean; reason?: string } {
  if (typeof input !== 'string') {
    return { isValid: false, reason: 'Payload is not a valid text string' };
  }
  if (input.length === 0) {
    return { isValid: false, reason: 'Empty string detected. Caliper Validation Gate blocked payload to prevent 400 Bad Request crash.' };
  }
  if (input.trim().length === 0) {
    return { isValid: false, reason: 'Whitespace-only payload detected. Caliper Validation Gate blocked payload.' };
  }
  return { isValid: true };
}

// Sliding Window FIFO Pruning Logic (Slide 12)
function applySlidingWindow(
  history: ChatMessage[],
  windowTurnLimit: number,
  enabled: boolean = true
): { effectiveHistory: ChatMessage[]; prunedCount: number } {
  if (!enabled || !windowTurnLimit || windowTurnLimit <= 0 || history.length <= windowTurnLimit) {
    return { effectiveHistory: history, prunedCount: 0 };
  }

  // Pruning logic: keep the latest `windowTurnLimit` messages.
  // Ensure the history doesn't start with a 'model' reply orphaned from its prompt if possible
  let startIndex = history.length - windowTurnLimit;
  if (startIndex > 0 && history[startIndex]?.role === 'model') {
    // shift by 1 to include user prompt or start on clean user turn
    startIndex = Math.max(0, startIndex - 1);
  }

  const effectiveHistory = history.slice(startIndex);
  const prunedCount = startIndex;

  return { effectiveHistory, prunedCount };
}

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: 'gemini-3.8-flash',
    uptime: process.uptime(),
    activeRamSessions: inMemoryRamSessions.size,
    activePostgresSessions: relationalDbSessions.size,
    timestamp: Date.now(),
  });
});

// Chat Endpoint: The Stateful Memory Loop (Slide 7, 8, 10, 12)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      message,
      history = [],
      sessionId = 'default-session',
      storageMode = 'ram', // 'ram' | 'postgres'
      slidingWindowEnabled = false,
      slidingWindowSize = 10,
      bypassCaliper = false, // When true, passes raw input to test API crash
      systemInstruction = 'You are an AI conversational companion created for the DecodeLabs Industrial Training Kit (Project 1). You have a stateful memory loop. You remember facts shared earlier in the conversation accurately and concisely.',
    } = req.body;

    // 1. Structural Validation Gate (Slide 9)
    if (!bypassCaliper) {
      const validation = validateCaliperGate(message);
      if (!validation.isValid) {
        return res.status(400).json({
          error: 'CALIPER_GATE_REJECTION',
          message: validation.reason,
          gateStatus: 'BLOCKED',
          mitigation: 'Input blocked at application level before reaching Gemini API endpoint.',
        });
      }
    }

    // 2. Sliding Window FIFO Pruning (Slide 12)
    const { effectiveHistory, prunedCount } = applySlidingWindow(
      history,
      slidingWindowSize,
      slidingWindowEnabled
    );

    // 3. Format contents according to the GenAI SDK Schema (Slide 8 & 10)
    // anatomy of a chat session schema: Array of { role: 'user' | 'model', parts: [{ text }] }
    const userMessagePart: ChatMessage = {
      role: 'user',
      parts: [{ text: message || '' }],
      timestamp: Date.now(),
    };

    const contentsPayload = [
      ...effectiveHistory.map((m: ChatMessage) => ({
        role: m.role,
        parts: m.parts.map((p) => ({ text: p.text })),
      })),
      {
        role: 'user' as const,
        parts: [{ text: message || '' }],
      },
    ];

    // 4. Dispatch to frontier LLM (Slide 7)
    const startTime = Date.now();
    let responseText = '';
    let usageMetadata: any = null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contentsPayload,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      // Extract text directly via .text property
      responseText = response.text || '';
      usageMetadata = response.usageMetadata || null;
    } catch (genAiError: any) {
      // If bypass caliper was active and error occurred, highlight the vulnerability
      if (bypassCaliper && (!message || message.trim().length === 0)) {
        return res.status(400).json({
          error: 'UNPROTECTED_API_FAILURE',
          message: `GenAI API rejected empty transaction: ${genAiError.message || '400 Bad Request'}`,
          explanation: 'As demonstrated in Slide 9, without the Caliper Validation Gate, an empty prompt triggers an API crash.',
          rawError: genAiError.toString(),
        });
      }
      throw genAiError;
    }

    const latencyMs = Date.now() - startTime;

    const modelMessagePart: ChatMessage = {
      role: 'model',
      parts: [{ text: responseText }],
      timestamp: Date.now(),
    };

    // Update full history
    const updatedHistory: ChatMessage[] = [
      ...history,
      userMessagePart,
      modelMessagePart,
    ];

    // Persist to selected tier (Slide 14 vs Slide 16)
    const session = getOrCreateSession(sessionId, storageMode);
    session.messages = updatedHistory;
    session.updatedAt = Date.now();

    return res.json({
      reply: responseText,
      updatedHistory,
      payloadSent: contentsPayload,
      metrics: {
        latencyMs,
        usageMetadata,
        totalTurns: updatedHistory.length,
        effectiveTurns: contentsPayload.length,
        prunedCount,
        slidingWindowApplied: slidingWindowEnabled && prunedCount > 0,
        caliperGatePassed: true,
      },
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({
      error: 'SERVER_GENERATION_ERROR',
      message: err.message || 'Failed to process conversational turn',
    });
  }
});

// System Audit: The Memory Exam Runner (Slide 13)
app.post('/api/audit/memory-exam', async (req: Request, res: Response) => {
  try {
    const { customName = 'Vipin' } = req.body;
    const auditLogs: any[] = [];
    const conversationHistory: ChatMessage[] = [];

    // Phase 1: State Initialization
    // User inputs: "My name is Vipin"
    const p1Input = `My name is ${customName}.`;
    conversationHistory.push({
      role: 'user',
      parts: [{ text: p1Input }],
      timestamp: Date.now(),
    });

    const p1Start = Date.now();
    const p1Res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationHistory.map((m) => ({
        role: m.role,
        parts: [{ text: m.parts[0].text }],
      })),
      config: {
        systemInstruction: 'You are a precise conversational agent with memory. Always acknowledge names directly and politely.',
      },
    });

    const p1Reply = p1Res.text || '';
    conversationHistory.push({
      role: 'model',
      parts: [{ text: p1Reply }],
      timestamp: Date.now(),
    });

    auditLogs.push({
      phase: 1,
      title: 'State Initialization',
      userInput: p1Input,
      modelResponse: p1Reply,
      durationMs: Date.now() - p1Start,
      tokenUsage: p1Res.usageMetadata,
      historyLength: conversationHistory.length,
      status: 'SUCCESS',
      description: `Injected state: user name "${customName}". Model generated acknowledgment.`,
    });

    // Phase 2: Context Distraction
    // User inputs: "Write a poem about tech". Forces large-volume generation to test memory retention.
    const p2Input = 'Write a 4-stanza poem about artificial intelligence, cloud infrastructure, and stateful conversational memory.';
    conversationHistory.push({
      role: 'user',
      parts: [{ text: p2Input }],
      timestamp: Date.now(),
    });

    const p2Start = Date.now();
    const p2Res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationHistory.map((m) => ({
        role: m.role,
        parts: [{ text: m.parts[0].text }],
      })),
    });

    const p2Reply = p2Res.text || '';
    conversationHistory.push({
      role: 'model',
      parts: [{ text: p2Reply }],
      timestamp: Date.now(),
    });

    auditLogs.push({
      phase: 2,
      title: 'Context Distraction',
      userInput: p2Input,
      modelResponse: p2Reply,
      durationMs: Date.now() - p2Start,
      tokenUsage: p2Res.usageMetadata,
      historyLength: conversationHistory.length,
      status: 'SUCCESS',
      description: 'Dispatched high-token distraction payload to stress the context window.',
    });

    // Phase 3: State Extraction
    // User inputs: "What is my name?"
    const p3Input = 'What is my name?';
    conversationHistory.push({
      role: 'user',
      parts: [{ text: p3Input }],
      timestamp: Date.now(),
    });

    const p3Start = Date.now();
    const p3Res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationHistory.map((m) => ({
        role: m.role,
        parts: [{ text: m.parts[0].text }],
      })),
      config: {
        systemInstruction: 'Answer concisely based strictly on prior conversational history.',
      },
    });

    const p3Reply = p3Res.text || '';
    conversationHistory.push({
      role: 'model',
      parts: [{ text: p3Reply }],
      timestamp: Date.now(),
    });

    // Verify extraction
    const targetLower = customName.toLowerCase();
    const passed = p3Reply.toLowerCase().includes(targetLower);

    auditLogs.push({
      phase: 3,
      title: 'State Extraction',
      userInput: p3Input,
      modelResponse: p3Reply,
      durationMs: Date.now() - p3Start,
      tokenUsage: p3Res.usageMetadata,
      historyLength: conversationHistory.length,
      extractedKey: customName,
      passed,
      status: passed ? 'PASSED' : 'FAILED',
      description: passed
        ? `Successfully extracted target "${customName}" across ${conversationHistory.length} turns through active in-memory payload.`
        : `Extraction failed to find "${customName}" in response.`,
    });

    return res.json({
      auditPassed: passed,
      evaluatedName: customName,
      phases: auditLogs,
      finalHistory: conversationHistory,
      totalTurns: conversationHistory.length,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    console.error('Audit failed:', err);
    return res.status(500).json({
      error: 'AUDIT_EXECUTION_FAILURE',
      message: err.message,
    });
  }
});

// Session Management Endpoints (demonstrating Slide 14 & 16)
app.get('/api/sessions', (req: Request, res: Response) => {
  const ramSessions = Array.from(inMemoryRamSessions.values()).map((s) => ({
    ...s,
    turnCount: s.messages.length,
    storageType: 'RAM (Ephemeral)',
  }));

  const pgSessions = Array.from(relationalDbSessions.values()).map((s) => ({
    ...s,
    turnCount: s.messages.length,
    storageType: 'PostgreSQL (Persistent JSONB)',
  }));

  res.json({
    ram: ramSessions,
    postgres: pgSessions,
  });
});

// Reset Server RAM (Slide 14: Simulating Server Restart / Redeploy Trigger)
app.post('/api/sessions/simulate-restart', (_req: Request, res: Response) => {
  const wipedCount = inMemoryRamSessions.size;
  inMemoryRamSessions.clear(); // RAM disappears on server restart!
  // PostgreSQL remains untouched!
  res.json({
    status: 'SERVER_RESTARTED',
    wipedRamSessions: wipedCount,
    persistedPostgresSessions: relationalDbSessions.size,
    message: 'Server process restarted. Local in-memory RAM wiped to 0. Relational PostgreSQL records intact.',
  });
});

// Save or load session
app.post('/api/sessions/sync', (req: Request, res: Response) => {
  const { sessionId, name, messages, storageMode = 'ram' } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const store = storageMode === 'ram' ? inMemoryRamSessions : relationalDbSessions;
  store.set(sessionId, {
    sessionId,
    name: name || `Session ${sessionId.substring(0, 6)}`,
    createdAt: store.get(sessionId)?.createdAt || Date.now(),
    updatedAt: Date.now(),
    messages: messages || [],
  });

  return res.json({ success: true, count: messages?.length || 0 });
});

// Serve frontend in production or integrate Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
