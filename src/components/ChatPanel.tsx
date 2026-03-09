import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trash2, Zap, Code2, Bug, Lightbulb } from 'lucide-react';
import type { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSend: (content: string) => Promise<void>;
  onStop: () => void;
  onClear: () => void;
  onUpdateAction?: (messageId: string, actionId: string, status: 'accepted' | 'rejected') => void;
}

function WelcomeScreen({ onSend }: { onSend: (s: string) => Promise<void> }) {
  const suggestions = [
    { icon: Bug, text: 'Find bugs in my code', prompt: '[DEBUG] Review this code and identify any bugs, edge cases, or potential issues:\n\n' },
    { icon: Code2, text: 'Write a React component', prompt: '[CODE] Write a modern React TypeScript component for:\n\n' },
    { icon: Lightbulb, text: 'Explain this algorithm', prompt: '[SUGGEST] Explain how this algorithm works step by step:\n\n' },
    { icon: Zap, text: 'Optimize performance', prompt: '[SUGGEST] Analyze and suggest performance optimizations for:\n\n' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: '24px 16px', gap: 20,
    }}>
      {/* Logo area */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(14,122,254,0.2) 0%, rgba(14,122,254,0.05) 100%)',
          border: '1px solid rgba(14,122,254,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(14,122,254,0.1)',
        }}>
          <Sparkles size={20} style={{ color: 'var(--accent)' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
            COUCOU AI
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
            Your intelligent coding agent
          </p>
        </div>
      </div>

      {/* Suggestion cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
        <p style={{ fontSize: 10, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
          Suggestions
        </p>
        {suggestions.map(({ icon: Icon, text, prompt }) => (
          <button
            key={text}
            onClick={() => onSend(prompt)}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-dim)',
              borderRadius: 6, padding: '8px 10px',
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-mid)';
              e.currentTarget.style.background = 'var(--bg-hover)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-dim)';
              e.currentTarget.style.background = 'var(--bg-elevated)';
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: 'var(--bg-active)',
              border: '1px solid var(--border-mid)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={12} style={{ color: 'var(--text-2)' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.3 }}>{text}</span>
          </button>
        ))}
      </div>

      <p style={{ fontSize: 10, color: 'var(--text-4)', textAlign: 'center' }}>
        Supports Gemini · DeepSeek · Ollama · LM Studio
      </p>
    </div>
  );
}

export function ChatPanel({ messages, isLoading, error, onSend, onStop, onClear, onUpdateAction }: ChatPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstMessage = messages.length <= 1 && messages[0]?.role === 'assistant';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: messages.length > 2 ? 'smooth' : 'auto' });
  }, [messages, isLoading]);

  const showWelcome = messages.length === 0 || isFirstMessage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Message area */}
      <div
        ref={containerRef}
        style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          paddingTop: 4,
        }}
      >
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ height: '100%' }}
            >
              <WelcomeScreen onSend={onSend} />
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {messages.map(msg => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onUpdateAction={onUpdateAction}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              margin: '6px 12px',
              background: 'var(--red-muted)',
              border: '1px solid rgba(248,81,73,0.25)',
              borderRadius: 6, padding: '7px 10px',
              fontSize: 11, color: 'var(--red)',
            }}
          >
            {error}
          </motion.div>
        )}

        <div ref={endRef} style={{ height: 8 }} />
      </div>

      {/* Clear button — top right overlay */}
      {!showWelcome && !isLoading && (
        <div style={{ position: 'absolute', top: 6, right: 8, zIndex: 10 }}>
          <button
            onClick={onClear}
            title="Clear conversation"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 10, color: 'var(--text-4)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-dim)',
              borderRadius: 5, padding: '3px 7px',
              cursor: 'pointer', transition: 'all 0.15s',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--red)';
              e.currentTarget.style.borderColor = 'rgba(248,81,73,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-4)';
              e.currentTarget.style.borderColor = 'var(--border-dim)';
            }}
          >
            <Trash2 size={10} />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* Input */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid var(--border-dim)',
        background: 'var(--bg-panel)',
      }}>
        <ChatInput
          onSend={onSend}
          onStop={onStop}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
