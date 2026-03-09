import { useState, useCallback, useRef } from 'react';
import type { Message, Settings, CodeAction, ActionType } from '../types';
import { streamAIResponse } from '../services/aiService';

function detectAgentMode(content: string): ActionType | undefined {
  if (content.includes('[DEBUG]')) return 'debug';
  if (content.includes('[CODE]')) return 'code';
  if (content.includes('[SUGGEST]')) return 'suggest';
  if (content.includes('[WRITE]')) return 'write';
  return undefined;
}

function extractCodeBlocks(content: string): CodeAction[] {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const actions: CodeAction[] = [];
  let match;
  let index = 0;
  while ((match = regex.exec(content)) !== null) {
    const language = match[1] || 'plaintext';
    const code = match[2].trim();
    if (code.length > 0) {
      actions.push({
        id: `action-${Date.now()}-${index++}`,
        type: 'code',
        label: `Code block (${language})`,
        code,
        language,
        status: 'pending',
      });
    }
  }
  return actions;
}

const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useChat(settings: Settings) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<boolean>(false);

  const sendMessage = useCallback(
    async (userContent: string) => {
      if (!userContent.trim() || isLoading) return;
      setError(null);
      abortRef.current = false;

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: userContent.trim(),
        timestamp: new Date(),
      };

      const assistantId = generateId();
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setIsLoading(true);

      let fullContent = '';

      try {
        const allMessages = [...messages, userMessage];
        const stream = streamAIResponse(allMessages, settings);

        for await (const chunk of stream) {
          if (abortRef.current) break;
          fullContent += chunk;
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId ? { ...m, content: fullContent, isStreaming: true } : m
            )
          );
        }

        const agentMode = detectAgentMode(fullContent);
        const actions = extractCodeBlocks(fullContent);

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? {
                  ...m,
                  content: fullContent,
                  isStreaming: false,
                  agentMode,
                  actions: actions.length > 0 ? actions : undefined,
                }
              : m
          )
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMsg);
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: `❌ Error: ${errorMsg}`, isStreaming: false }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, settings, isLoading]
  );

  const stopGeneration = useCallback(() => {
    abortRef.current = true;
    setIsLoading(false);
    setMessages(prev => prev.map(m => (m.isStreaming ? { ...m, isStreaming: false } : m)));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const updateActionStatus = useCallback(
    (messageId: string, actionId: string, status: 'accepted' | 'rejected') => {
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? { ...m, actions: m.actions?.map(a => (a.id === actionId ? { ...a, status } : a)) }
            : m
        )
      );
    },
    []
  );

  return { messages, isLoading, error, sendMessage, stopGeneration, clearMessages, updateActionStatus };
}
