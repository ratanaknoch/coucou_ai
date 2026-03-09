import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe, HardDrive, Eye, EyeOff, CheckCircle2, ExternalLink,
  Terminal, ChevronDown, ChevronUp, Cpu, Wifi, WifiOff,
  Info, AlertCircle,
} from 'lucide-react';
import type { Settings, Provider } from '../types';

const PROVIDERS = [
  {
    id: 'cloud-gemini' as Provider,
    name: 'Google Gemini',
    sub: 'Cloud · Fast & multimodal',
    icon: Globe,
    cloud: true,
    badge: 'Recommended',
    badgeColor: 'var(--accent)',
  },
  {
    id: 'cloud-deepseek' as Provider,
    name: 'DeepSeek',
    sub: 'Cloud · Code-focused',
    icon: Globe,
    cloud: true,
  },
  {
    id: 'ollama' as Provider,
    name: 'Ollama',
    sub: 'Local · Privacy-first',
    icon: HardDrive,
    cloud: false,
  },
  {
    id: 'lmstudio' as Provider,
    name: 'LM Studio',
    sub: 'Local · OpenAI-compatible',
    icon: HardDrive,
    cloud: false,
  },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 600, color: 'var(--text-3)',
      textTransform: 'uppercase', letterSpacing: '0.07em',
      marginBottom: 6,
    }}>
      {children}
    </p>
  );
}

function SecretInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  const set = value.length > 0;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'var(--bg-input)', border: `1px solid ${set ? 'rgba(63,185,80,0.35)' : 'var(--border-mid)'}`,
      borderRadius: 5, padding: '6px 8px',
      transition: 'border-color 0.2s',
    }}>
      {set && <CheckCircle2 size={11} style={{ color: 'var(--green)', flexShrink: 0 }} />}
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, background: 'none', border: 'none', outline: 'none',
          fontSize: 12, color: 'var(--text-1)', fontFamily: '"JetBrains Mono", monospace',
        }}
      />
      <button
        onClick={() => setShow(v => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', alignItems: 'center' }}
      >
        {show ? <EyeOff size={12} /> : <Eye size={12} />}
      </button>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, mono }: { value: string; onChange: (v: string) => void; placeholder: string; mono?: boolean }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', background: 'var(--bg-input)',
        border: '1px solid var(--border-mid)', borderRadius: 5,
        padding: '6px 8px', fontSize: 12,
        color: 'var(--text-1)', outline: 'none',
        fontFamily: mono ? '"JetBrains Mono", monospace' : 'inherit',
        transition: 'border-color 0.2s',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(14,122,254,0.5)'; }}
      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-mid)'; }}
    />
  );
}

function SetupGuide({ provider }: { provider: Provider }) {
  const [open, setOpen] = useState(false);
  const isOllama = provider === 'ollama';

  return (
    <div style={{
      border: '1px solid var(--border-dim)', borderRadius: 6,
      overflow: 'hidden', marginTop: 8,
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '7px 10px', background: 'var(--bg-elevated)',
          border: 'none', cursor: 'pointer', transition: 'background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Info size={11} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>
            Setup Guide — Enable CORS
          </span>
        </div>
        {open ? <ChevronUp size={11} style={{ color: 'var(--text-4)' }} /> : <ChevronDown size={11} style={{ color: 'var(--text-4)' }} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '10px', background: 'var(--bg-base)', borderTop: '1px solid var(--border-dim)' }}>
              {isOllama ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Terminal size={11} style={{ color: 'var(--green)' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }}>Enable CORS for Ollama</span>
                  </div>
                  <div style={{
                    background: '#0a0a0a', border: '1px solid var(--border-dim)',
                    borderRadius: 5, padding: '8px 10px',
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                  }}>
                    <div style={{ color: 'var(--text-3)', marginBottom: 4 }}># macOS / Linux</div>
                    <div style={{ color: 'var(--green)' }}>OLLAMA_ORIGINS=* ollama serve</div>
                    <div style={{ color: 'var(--text-3)', marginTop: 8, marginBottom: 4 }}># Windows PowerShell</div>
                    <div style={{ color: '#dcdcaa' }}>$env:OLLAMA_ORIGINS="*"</div>
                    <div style={{ color: 'var(--green)' }}>ollama serve</div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 6,
                    background: 'var(--accent-muted)', border: '1px solid var(--accent-border)',
                    borderRadius: 5, padding: '6px 8px',
                  }}>
                    <AlertCircle size={11} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 10, color: '#9cdcfe', lineHeight: 1.5 }}>
                      Default endpoint: <code style={{ color: '#ce9178' }}>http://localhost:11434</code>
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Terminal size={11} style={{ color: 'var(--teal)' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }}>Enable CORS for LM Studio</span>
                  </div>
                  <ol style={{ paddingLeft: 16, fontSize: 11, color: 'var(--text-3)', lineHeight: 1.8 }}>
                    <li>Open LM Studio → Local Server tab</li>
                    <li>Enable the <strong style={{ color: 'var(--text-2)' }}>CORS</strong> toggle</li>
                    <li>Start server on port <code style={{ color: '#ce9178', background: '#1e1e1e', padding: '0 3px', borderRadius: 2 }}>1234</code></li>
                    <li>Load a model and paste the endpoint below</li>
                  </ol>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 6,
                    background: 'var(--accent-muted)', border: '1px solid var(--accent-border)',
                    borderRadius: 5, padding: '6px 8px',
                  }}>
                    <AlertCircle size={11} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 10, color: '#9cdcfe', lineHeight: 1.5 }}>
                      Default endpoint: <code style={{ color: '#ce9178' }}>http://localhost:1234</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SettingsPanel({ settings, onUpdate }: { settings: Settings; onUpdate: (p: Partial<Settings>) => void }) {
  const isLocal = settings.provider === 'ollama' || settings.provider === 'lmstudio';
  const isGemini = settings.provider === 'cloud-gemini';
  const isDeepseek = settings.provider === 'cloud-deepseek';
  const activeProvider = PROVIDERS.find(p => p.id === settings.provider);

  const ollamaModels = ['deepseek-coder', 'codellama', 'llama3.1', 'llama3.2', 'mistral', 'phi3', 'qwen2.5-coder'];
  const lmModels = ['deepseek-coder-v2', 'codestral-22b', 'phi-3-medium', 'mistral-7b-instruct', 'qwen2.5-coder-7b'];

  return (
    <div style={{
      height: '100%', overflowY: 'auto',
      padding: '12px 12px 24px',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      {/* Header */}
      <div style={{ paddingTop: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>Configuration</p>
        <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Choose your AI provider and configure settings</p>
      </div>

      {/* ── Provider Selector ── */}
      <div>
        <Label>AI Provider</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {PROVIDERS.map(p => {
            const active = settings.provider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onUpdate({ provider: p.id })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', width: '100%', textAlign: 'left',
                  background: active ? 'rgba(14,122,254,0.08)' : 'var(--bg-elevated)',
                  border: `1px solid ${active ? 'rgba(14,122,254,0.35)' : 'var(--border-dim)'}`,
                  borderRadius: 6, cursor: 'pointer',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-mid)'; e.currentTarget.style.background = 'var(--bg-hover)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.background = 'var(--bg-elevated)'; } }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 7,
                  background: active ? 'rgba(14,122,254,0.15)' : 'var(--bg-active)',
                  border: `1px solid ${active ? 'rgba(14,122,254,0.3)' : 'var(--border-mid)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s',
                }}>
                  {p.cloud
                    ? <Wifi size={13} style={{ color: active ? 'var(--accent)' : 'var(--text-3)' }} />
                    : <Cpu size={13} style={{ color: active ? 'var(--teal)' : 'var(--text-3)' }} />
                  }
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: active ? 'var(--text-1)' : 'var(--text-2)' }}>
                      {p.name}
                    </span>
                    {p.badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 600,
                        color: 'var(--accent)', background: 'var(--accent-muted)',
                        border: '1px solid var(--accent-border)',
                        borderRadius: 10, padding: '1px 5px',
                        letterSpacing: '0.04em',
                      }}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 1 }}>{p.sub}</p>
                </div>

                {active && (
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--accent)', flexShrink: 0,
                    boxShadow: '0 0 6px rgba(14,122,254,0.5)',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Provider-specific config ── */}
      <AnimatePresence mode="wait">
        {isGemini && (
          <motion.div key="gemini"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
          >
            <Label>Gemini Configuration</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>API Key</p>
                <SecretInput
                  value={settings.geminiApiKey}
                  onChange={v => onUpdate({ geminiApiKey: v })}
                  placeholder="AIzaSy..."
                />
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}
              >
                <ExternalLink size={10} />
                Get your Gemini API key
              </a>
            </div>
          </motion.div>
        )}

        {isDeepseek && (
          <motion.div key="deepseek"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
          >
            <Label>DeepSeek Configuration</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>API Key</p>
                <SecretInput
                  value={settings.deepseekApiKey}
                  onChange={v => onUpdate({ deepseekApiKey: v })}
                  placeholder="sk-..."
                />
              </div>
              <a
                href="https://platform.deepseek.com"
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}
              >
                <ExternalLink size={10} />
                Get your DeepSeek API key
              </a>
            </div>
          </motion.div>
        )}

        {isLocal && (
          <motion.div key="local"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
          >
            <Label>Local Configuration</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>Endpoint URL</p>
                <TextInput
                  value={settings.localEndpoint}
                  onChange={v => onUpdate({ localEndpoint: v })}
                  placeholder={settings.provider === 'ollama' ? 'http://localhost:11434' : 'http://localhost:1234'}
                  mono
                />
              </div>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>Model Name</p>
                <TextInput
                  value={settings.localModelName}
                  onChange={v => onUpdate({ localModelName: v })}
                  placeholder="deepseek-coder"
                  mono
                />
              </div>

              {/* Quick model chips */}
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 5 }}>Quick select:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {(settings.provider === 'ollama' ? ollamaModels : lmModels).map(m => (
                    <button
                      key={m}
                      onClick={() => onUpdate({ localModelName: m })}
                      style={{
                        fontSize: 10, padding: '3px 7px', borderRadius: 4,
                        fontFamily: '"JetBrains Mono", monospace',
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: settings.localModelName === m ? 'rgba(57,197,207,0.12)' : 'var(--bg-elevated)',
                        border: `1px solid ${settings.localModelName === m ? 'rgba(57,197,207,0.35)' : 'var(--border-dim)'}`,
                        color: settings.localModelName === m ? 'var(--teal)' : 'var(--text-3)',
                        fontWeight: settings.localModelName === m ? 600 : 400,
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <SetupGuide provider={settings.provider} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Status card ── */}
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)',
        borderRadius: 6, padding: '10px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          {activeProvider?.cloud
            ? <Wifi size={11} style={{ color: 'var(--accent)' }} />
            : <WifiOff size={11} style={{ color: 'var(--teal)' }} />
          }
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Active Config
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { k: 'Provider', v: activeProvider?.name ?? '—' },
            { k: 'Mode', v: isLocal ? 'Local' : 'Cloud', color: isLocal ? 'var(--teal)' : 'var(--accent)' },
            ...(isLocal
              ? [
                { k: 'Endpoint', v: settings.localEndpoint || '—', mono: true },
                { k: 'Model', v: settings.localModelName || '—', mono: true, color: '#dcdcaa' },
              ]
              : [
                {
                  k: 'API Key',
                  v: (isGemini ? settings.geminiApiKey : settings.deepseekApiKey) ? '●●●●●●●●' : 'Not set',
                  mono: true,
                  color: (isGemini ? settings.geminiApiKey : settings.deepseekApiKey) ? 'var(--green)' : 'var(--red)',
                },
              ]),
          ].map(({ k, v, mono, color }) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{k}</span>
              <span
                title={String(v)}
                style={{
                  fontSize: 10, color: color ?? 'var(--text-2)',
                  fontFamily: mono ? '"JetBrains Mono", monospace' : 'inherit',
                  maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
              >
                {String(v)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', paddingTop: 4 }}>
        <p style={{ fontSize: 10, color: 'var(--text-4)' }}>COUCOU AI v1.0.0</p>
        <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 2 }}>VS Code Extension Sidebar</p>
      </div>
    </div>
  );
}
