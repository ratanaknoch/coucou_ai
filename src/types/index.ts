export type Provider = 'cloud-gemini' | 'cloud-deepseek' | 'ollama' | 'lmstudio';

export type MessageRole = 'user' | 'assistant' | 'system';

export type ActionType = 'code' | 'debug' | 'write' | 'suggest';

export interface CodeAction {
  id: string;
  type: ActionType;
  label: string;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  actions?: CodeAction[];
  agentMode?: ActionType;
}

export interface Settings {
  provider: Provider;
  localEndpoint: string;
  localModelName: string;
  geminiApiKey: string;
  deepseekApiKey: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export type TabId = 'chat' | 'settings';
