import { useState } from 'react';
import { MessageSquare, Settings as SettingsIcon, Sparkles, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ChatPanel } from './components/ChatPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { useChat } from './hooks/useChat';
import { useSettings } from './hooks/useSettings';
import type { TabId } from './types';

const PROVIDER_LABEL: Record<string, string> = {
  'cloud-gemini': 'Gemini',
  'cloud-deepseek': 'DeepSeek',
  'ollama': 'Ollama',
  'lmstudio': 'LM Studio',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const { settings, updateSettings } = useSettings();
  const chatProps = useChat(settings);

  const providerLabel = PROVIDER_LABEL[settings.provider] ?? settings.provider;
  const isLocal = settings.provider === 'ollama' || settings.provider === 'lmstudio';

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-base)',
      color: 'var(--text-1)',
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      {/* ── Header ────────────────────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 44,
        padding: '0 10px',
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border-dim)',
        flexShrink: 0,
        gap: 6,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: 'linear-gradient(135deg, rgba(14,122,254,0.3), rgba(14,122,254,0.1))',
            border: '1px solid rgba(14,122,254,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={11} style={{ color: 'var(--accent)' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
            COUCOU AI
          </span>
        </div>

        {/* Center — Provider indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)',
          borderRadius: 10, padding: '2px 8px',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
          onClick={() => setActiveTab('settings')}
          title="Change provider"
        >
          <Zap size={9} style={{ color: isLocal ? 'var(--teal)' : 'var(--accent)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>{providerLabel}</span>
        </div>

        {/* Tab controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {(['chat', 'settings'] as TabId[]).map(tab => {
            const Icon = tab === 'chat' ? MessageSquare : SettingsIcon;
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                title={tab === 'chat' ? 'Chat' : 'Settings'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 6,
                  background: active ? 'var(--bg-elevated)' : 'transparent',
                  border: `1px solid ${active ? 'var(--border-mid)' : 'transparent'}`,
                  color: active ? 'var(--text-1)' : 'var(--text-4)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--text-2)';
                    e.currentTarget.style.background = 'var(--bg-elevated)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--text-4)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={13} />
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Tab indicator ─────────────────────────── */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border-dim)',
        flexShrink: 0,
        padding: '0 10px',
      }}>
        {(['chat', 'settings'] as TabId[]).map(tab => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: 11, fontWeight: 500, padding: '5px 10px',
                color: active ? 'var(--text-1)' : 'var(--text-4)',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                textTransform: 'capitalize', transition: 'all 0.15s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text-2)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-4)'; }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Main Content ────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <ChatPanel
                messages={chatProps.messages}
                isLoading={chatProps.isLoading}
                error={chatProps.error}
                onSend={chatProps.sendMessage}
                onStop={chatProps.stopGeneration}
                onClear={chatProps.clearMessages}
                onUpdateAction={chatProps.updateActionStatus}
              />
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.14 }}
              style={{ height: '100%' }}
            >
              <SettingsPanel settings={settings} onUpdate={updateSettings} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Status bar (VS Code-style) ──────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 20, padding: '0 10px',
        background: chatProps.isLoading ? 'rgba(14,122,254,0.25)' : 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-dim)',
        flexShrink: 0, transition: 'background 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: chatProps.isLoading ? 'var(--accent)' : 'var(--green)',
            boxShadow: chatProps.isLoading ? '0 0 6px var(--accent)' : '0 0 4px var(--green)',
            animation: chatProps.isLoading ? 'thinking-pulse 1.4s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>
            {chatProps.isLoading ? 'Generating response...' : 'Ready'}
          </span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-4)' }}>
          {chatProps.messages.filter(m => m.role !== 'system').length} msgs
        </span>
      </div>
    </div>
  );
}
