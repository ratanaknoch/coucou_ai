import { motion } from 'motion/react';
import { Sparkles, Bug, Code2, FileText, Lightbulb, AlertTriangle } from 'lucide-react';
import coucouLogo from '../../assets/coucou.png';
import type { Message, ActionType } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AgentActionBar } from './AgentActionBar';

const modeConfig: Record<ActionType, { label: string; icon: typeof Code2; color: string }> = {
  code: { label: 'Writing Code', icon: Code2, color: 'var(--accent)' },
  debug: { label: 'Debugging', icon: Bug, color: 'var(--red)' },
  suggest: { label: 'Suggesting', icon: Lightbulb, color: 'var(--yellow)' },
  write: { label: 'Writing Docs', icon: FileText, color: 'var(--teal)' },
};

function ThinkingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-mid)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Sparkles size={11} style={{ color: 'var(--accent)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-3)', marginRight: 4 }}>Thinking</span>
        <span className="thinking-dot" />
        <span className="thinking-dot" />
        <span className="thinking-dot" />
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: Message;
  onUpdateAction?: (messageId: string, actionId: string, status: 'accepted' | 'rejected') => void;
}

export function ChatMessage({ message, onUpdateAction }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isError = message.content.startsWith('❌ Error:') || message.content.startsWith('Error:');

  if (message.isStreaming && !message.content) {
    return <ThinkingDots />;
  }

  const mode = message.agentMode ? modeConfig[message.agentMode] : null;
  const ModeIcon = mode?.icon;

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '6px 12px',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          maxWidth: '88%',
          gap: 3,
        }}>
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-mid)',
            borderRadius: '12px 12px 3px 12px',
            padding: '8px 12px',
            fontSize: 13,
            color: 'var(--text-1)',
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {message.content}
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </motion.div>
    );
  }

  // Assistant message
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      style={{ padding: '4px 0' }}
    >
      {/* AI label row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '6px 12px 4px',
      }}>
        <div style={{
          width: 20, height: 20,
          borderRadius: 5,
          background: 'linear-gradient(135deg, rgba(14,122,254,0.25), rgba(14,122,254,0.08))',
          border: '1px solid rgba(14,122,254,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Sparkles size={10} style={{ color: 'var(--accent)' }} />
        </div>

        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.03em' }}>
          COUCOU AI
        </span>

        {mode && ModeIcon && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-mid)',
            borderRadius: 10, padding: '1px 7px',
            marginLeft: 2,
          }}>
            <ModeIcon size={9} style={{ color: mode.color }} />
            <span style={{ fontSize: 10, color: mode.color, fontWeight: 500 }}>{mode.label}</span>
            {message.isStreaming && (
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: mode.color, marginLeft: 2,
                display: 'inline-block',
                animation: 'thinking-pulse 1.2s ease-in-out infinite',
              }} />
            )}
          </div>
        )}

        {!mode && message.isStreaming && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 10, color: 'var(--text-3)',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--accent)', display: 'inline-block',
              animation: 'thinking-pulse 1.2s ease-in-out infinite',
            }} />
            Generating
          </div>
        )}

        <div style={{ flex: 1 }} />

        <span style={{ fontSize: 10, color: 'var(--text-4)' }}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '0 12px 8px' }}>
        {isError ? (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            background: 'var(--red-muted)', border: '1px solid rgba(248,81,73,0.25)',
            borderRadius: 6, padding: '8px 10px', fontSize: 12, color: 'var(--red)',
          }}>
            <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ lineHeight: 1.5 }}>{message.content.replace('❌ Error: ', '')}</span>
          </div>
        ) : (
          <div>
            <MarkdownRenderer content={message.content} />
            {message.isStreaming && <span className="cursor-blink" />}
          </div>
        )}

        {!isError && !message.isStreaming && message.actions && message.actions.length > 0 && onUpdateAction && (
          <AgentActionBar
            actions={message.actions}
            messageId={message.id}
            onUpdateStatus={onUpdateAction}
          />
        )}
      </div>

      {/* Subtle bottom separator */}
      <div style={{
        height: 1,
        background: 'linear-gradient(to right, transparent, var(--border-dim) 20%, var(--border-dim) 80%, transparent)',
        margin: '0 12px',
        opacity: 0.5,
      }} />
    </motion.div>
  );
}
