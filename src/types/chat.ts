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

export interface GenAiPayloadItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AuditPhase {
  phase: number;
  title: string;
  userInput: string;
  modelResponse: string;
  durationMs: number;
  tokenUsage?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  historyLength: number;
  extractedKey?: string;
  passed?: boolean;
  status: 'SUCCESS' | 'PASSED' | 'FAILED';
  description: string;
}

export interface AuditResult {
  auditPassed: boolean;
  evaluatedName: string;
  phases: AuditPhase[];
  finalHistory: ChatMessage[];
  totalTurns: number;
  timestamp: number;
}

export interface SessionRecord {
  sessionId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  turnCount: number;
  storageType: string;
  messages?: ChatMessage[];
}

export interface TurnMetrics {
  latencyMs: number;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  totalTurns: number;
  effectiveTurns: number;
  prunedCount: number;
  slidingWindowApplied: boolean;
  caliperGatePassed: boolean;
}
