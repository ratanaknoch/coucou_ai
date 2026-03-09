import { useState } from 'react';
import { Check, X, Copy, CheckCheck, ChevronDown, ChevronUp, GitMerge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { CodeAction } from '../types';

function ActionCard({
  action,
  onAccept,
  onReject,
}: {
  action: CodeAction;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const lines = action.code.split('\n');
  const preview = expanded ? lines : lines.slice(0, 8);
  const hasMore = !expanded && lines.length > 8;

  const copy = () => {
    navigator.clipboard.writeText(action.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isPending = action.status === 'pending';
  const isAccepted = action.status === 'accepted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        border: `1px solid ${isAccepted ? 'rgba(63,185,80,0.3)' : action.status === 'rejected' ? 'var(--border-dim)' : 'var(--border-mid)'}`,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 6,
        opacity: action.status === 'rejected' ? 0.45 : 1,
        background: isAccepted ? 'rgba(63,185,80,0.04)' : 'var(--bg-panel)',
        transition: 'opacity 0.2s, border-color 0.2s',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 8px',
        background: 'var(--bg-elevated)',
        borderBottom: `1px solid var(--border-dim)`,
      }}>
        <GitMerge size={11} style={{ color: isPending ? 'var(--accent)' : isAccepted ? 'var(--green)' : 'var(--text-3)', flexShrink: 0 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: isPending ? 'var(--text-2)' : isAccepted ? 'var(--green)' : 'var(--text-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {isAccepted ? 'Applied' : action.status === 'rejected' ? 'Dismissed' : 'Suggested Change'}
          </span>
          <span style={{
            fontSize: 10,
            color: 'var(--text-3)',
            fontFamily: 'monospace',
            background: 'var(--bg-active)',
            padding: '0 4px',
            borderRadius: 3,
            border: '1px solid var(--border-dim)',
          }}>
            {action.language}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          {isPending && (
            <>
              <button
                onClick={copy}
                style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: 10, color: copied ? 'var(--green)' : 'var(--text-3)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '3px 5px', borderRadius: 3,
                  transition: 'color 0.15s',
                }}
                title="Copy"
              >
                {copied ? <CheckCheck size={10} /> : <Copy size={10} />}
              </button>
              <div style={{ width: 1, height: 12, background: 'var(--border-mid)', margin: '0 2px' }} />
              <button
                onClick={() => onReject(action.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: 10, color: 'var(--text-3)',
                  background: 'none', border: '1px solid transparent', cursor: 'pointer',
                  padding: '3px 6px', borderRadius: 3,
                  fontWeight: 500,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).closest('button')!.style.color = 'var(--red)'; (e.target as HTMLElement).closest('button')!.style.borderColor = 'rgba(248,81,73,0.3)'; (e.target as HTMLElement).closest('button')!.style.background = 'var(--red-muted)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).closest('button')!.style.color = 'var(--text-3)'; (e.target as HTMLElement).closest('button')!.style.borderColor = 'transparent'; (e.target as HTMLElement).closest('button')!.style.background = 'none'; }}
                title="Reject"
              >
                <X size={10} />
              </button>
              <button
                onClick={() => onAccept(action.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: 10, color: 'var(--green)',
                  background: 'var(--green-muted)', border: '1px solid rgba(63,185,80,0.3)', cursor: 'pointer',
                  padding: '3px 8px', borderRadius: 3,
                  fontWeight: 600,
                  transition: 'all 0.15s',
                }}
                title="Accept"
              >
                <Check size={10} />
                <span>Apply</span>
              </button>
            </>
          )}

          {!isPending && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              fontSize: 10, fontWeight: 600,
              color: isAccepted ? 'var(--green)' : 'var(--text-3)',
            }}>
              {isAccepted ? <><CheckCheck size={10} /><span>Applied</span></> : <><X size={10} /><span>Dismissed</span></>}
            </div>
          )}

          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              display: 'flex', alignItems: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-3)', padding: '3px',
              borderRadius: 3, marginLeft: 2,
              transition: 'color 0.15s',
            }}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>
      </div>

      {/* Code preview */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ overflowX: 'auto', background: '#0e0e0e' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: 11 }}>
                <tbody>
                  {preview.map((line, i) => (
                    <tr key={i} style={{ transition: 'background 0.1s' }}>
                      <td style={{
                        width: 28, textAlign: 'right', paddingRight: 8, paddingLeft: 4,
                        color: '#3a3a3a', userSelect: 'none', borderRight: '1px solid #1e1e1e',
                        fontSize: 10, verticalAlign: 'top', paddingTop: 1, paddingBottom: 1,
                      }}>
                        {i + 1}
                      </td>
                      <td style={{
                        paddingLeft: 10, paddingRight: 8, paddingTop: 1, paddingBottom: 1,
                        color: '#c9d1d9', whiteSpace: 'pre', lineHeight: '1.6',
                      }}>
                        {line || ' '}
                      </td>
                    </tr>
                  ))}
                  {hasMore && (
                    <tr>
                      <td colSpan={2} style={{ padding: '4px 10px' }}>
                        <button
                          onClick={() => setExpanded(true)}
                          style={{ fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          +{lines.length - 8} more lines — expand
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {isPending && (
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: 6,
                padding: '6px 8px', borderTop: '1px solid var(--border-dim)',
                background: 'var(--bg-elevated)',
              }}>
                <button
                  onClick={() => onReject(action.id)}
                  style={{
                    fontSize: 11, color: 'var(--text-3)',
                    background: 'none', border: '1px solid var(--border-mid)',
                    cursor: 'pointer', padding: '4px 10px', borderRadius: 4,
                    transition: 'all 0.15s', fontWeight: 500,
                  }}
                  onMouseEnter={e => { const b = e.currentTarget; b.style.color='var(--red)'; b.style.borderColor='rgba(248,81,73,0.4)'; }}
                  onMouseLeave={e => { const b = e.currentTarget; b.style.color='var(--text-3)'; b.style.borderColor='var(--border-mid)'; }}
                >
                  Discard
                </button>
                <button
                  onClick={() => onAccept(action.id)}
                  style={{
                    fontSize: 11, color: '#fff',
                    background: 'var(--accent)', border: '1px solid transparent',
                    cursor: 'pointer', padding: '4px 12px', borderRadius: 4,
                    fontWeight: 600, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1a8ad4'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
                >
                  Apply Change
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface AgentActionBarProps {
  actions: CodeAction[];
  messageId: string;
  onUpdateStatus: (messageId: string, actionId: string, status: 'accepted' | 'rejected') => void;
}

export function AgentActionBar({ actions, messageId, onUpdateStatus }: AgentActionBarProps) {
  if (!actions.length) return null;
  const pending = actions.filter(a => a.status === 'pending');

  return (
    <div style={{ marginTop: 10 }}>
      {pending.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, padding: '0 2px' }}>
          <span style={{ fontSize: 10, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              background: 'var(--accent-muted)', color: 'var(--accent)',
              borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 600,
            }}>
              {pending.length}
            </span>
            change{pending.length !== 1 ? 's' : ''} pending review
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => pending.forEach(a => onUpdateStatus(messageId, a.id, 'accepted'))}
              style={{ fontSize: 10, color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Accept all
            </button>
            <span style={{ color: 'var(--text-4)' }}>·</span>
            <button
              onClick={() => pending.forEach(a => onUpdateStatus(messageId, a.id, 'rejected'))}
              style={{ fontSize: 10, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Reject all
            </button>
          </div>
        </div>
      )}
      {actions.map(action => (
        <ActionCard
          key={action.id}
          action={action}
          onAccept={id => onUpdateStatus(messageId, id, 'accepted')}
          onReject={id => onUpdateStatus(messageId, id, 'rejected')}
        />
      ))}
    </div>
  );
}
