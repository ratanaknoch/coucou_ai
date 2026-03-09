import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Square, Zap, Code2, Bug, FileText, Lightbulb, Mic } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const QUICK_ACTIONS = [
  { icon: Bug,      label: 'Find bugs',     prompt: '[DEBUG] Find and explain any bugs in this code:' },
  { icon: Code2,    label: 'Refactor',      prompt: '[CODE] Refactor this code to be cleaner and more efficient:' },
  { icon: FileText, label: 'Document',      prompt: '[WRITE] Write documentation and JSDoc comments for:' },
  { icon: Lightbulb,label: 'Optimize',      prompt: '[SUGGEST] Suggest performance optimizations for:' },
];

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isLoading, disabled }: ChatInputProps) {
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, []);

  useEffect(() => { resize(); }, [content, resize]);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async () => {
    const text = content.trim();
    if (!text || isLoading || disabled) return;
    setContent('');
    await onSend(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const setPrompt = (prompt: string) => {
    setContent(prompt + '\n');
    textareaRef.current?.focus();
  };

  const canSend = content.trim().length > 0 && !isLoading && !disabled;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Quick actions */}
      <AnimatePresence>
        {!content && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              display: 'flex', gap: 4, flexWrap: 'wrap',
              padding: '8px 10px 6px',
              borderBottom: '1px solid var(--border-dim)',
            }}
          >
            {QUICK_ACTIONS.map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => setPrompt(prompt)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, color: 'var(--text-3)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: 4, padding: '3px 7px',
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontWeight: 500,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--text-2)';
                  e.currentTarget.style.borderColor = 'var(--border-mid)';
                  e.currentTarget.style.background = 'var(--bg-hover)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-3)';
                  e.currentTarget.style.borderColor = 'var(--border-dim)';
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }}
              >
                <Icon size={10} />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div style={{
        position: 'relative',
        background: 'var(--bg-input)',
        border: `1px solid ${focused ? 'rgba(14,122,254,0.5)' : 'var(--border-mid)'}`,
        borderRadius: 8,
        margin: '8px 10px 6px',
        transition: 'border-color 0.2s',
        boxShadow: focused ? '0 0 0 2px rgba(14,122,254,0.08)' : 'none',
      }}>
        {/* Top toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '5px 8px 4px',
          borderBottom: content ? '1px solid var(--border-dim)' : 'none',
        }}>
          <Zap size={11} style={{ color: isLoading ? 'var(--accent)' : 'var(--text-4)', flexShrink: 0, transition: 'color 0.2s' }} />
          <span style={{ fontSize: 10, color: 'var(--text-4)', fontWeight: 500 }}>
            {isLoading ? 'Generating...' : 'Ask BLAST AI'}
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={isLoading || disabled}
          placeholder={isLoading ? '' : 'Ask a question, paste code, or describe what you need...'}
          rows={1}
          style={{
            display: 'block',
            width: '100%',
            minHeight: 36,
            maxHeight: 180,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: 13,
            color: isLoading ? 'var(--text-3)' : 'var(--text-1)',
            lineHeight: 1.55,
            padding: '6px 10px 8px',
            fontFamily: 'inherit',
          }}
        />

        {/* Bottom action bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '3px 6px 5px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 3,
                fontSize: 10, color: 'var(--text-4)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '2px 4px', borderRadius: 3,
                transition: 'color 0.15s',
              }}
              title="Voice input (coming soon)"
              disabled
            >
              <Mic size={11} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-4)' }}>
              {content ? <><kbd style={{ fontSize: 9, color: 'var(--text-3)', background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)', borderRadius: 2, padding: '1px 3px' }}>↵</kbd> send</> : null}
            </span>

            {isLoading ? (
              <button
                onClick={onStop}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, color: 'var(--red)',
                  background: 'var(--red-muted)',
                  border: '1px solid rgba(248,81,73,0.3)',
                  borderRadius: 5, padding: '4px 8px',
                  cursor: 'pointer', fontWeight: 600,
                  transition: 'all 0.15s',
                }}
                title="Stop generation"
              >
                <Square size={10} fill="currentColor" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSend}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28,
                  background: canSend ? 'var(--accent)' : 'var(--bg-elevated)',
                  border: `1px solid ${canSend ? 'transparent' : 'var(--border-mid)'}`,
                  borderRadius: 6, cursor: canSend ? 'pointer' : 'not-allowed',
                  color: canSend ? '#fff' : 'var(--text-4)',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
                title="Send message"
              >
                <Send size={12} style={{ transform: canSend ? 'translateX(1px)' : 'none', transition: 'transform 0.15s' }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hint */}
      <p style={{ fontSize: 10, color: 'var(--text-4)', textAlign: 'center', paddingBottom: 4 }}>
        ⇧ Enter for new line
      </p>
    </div>
  );
}
