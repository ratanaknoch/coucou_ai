import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Check, Copy } from 'lucide-react';

function CodeBlock({ language, children }: { language?: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {language || 'text'}
        </span>
        <button
          onClick={copy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            color: copied ? 'var(--green)' : 'var(--text-3)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: 3,
            transition: 'color 0.15s',
          }}
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  const components: Components = {
    code(props) {
      const { className, children } = props;
      const match = /language-(\w+)/.exec(className || '');
      const str = String(children).replace(/\n$/, '');
      const isBlock = str.includes('\n') || !!match;
      if (isBlock) return <CodeBlock language={match?.[1]}>{str}</CodeBlock>;
      return (
        <code style={{
          background: '#262626',
          color: '#ce9178',
          padding: '1px 5px',
          borderRadius: 3,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11.5px',
          border: '1px solid #333',
        }}>
          {children}
        </code>
      );
    },
    p: ({ children }) => <p className="md" style={{ marginBottom: 7, lineHeight: 1.65 }}>{children}</p>,
    ul: ({ children }) => <ul className="md ul" style={{ margin: '5px 0 8px', paddingLeft: 0, listStyle: 'none' }}>{children}</ul>,
    ol: ({ children }) => <ol style={{ margin: '5px 0 8px', paddingLeft: 18 }}>{children}</ol>,
    li: ({ children }) => (
      <li style={{ position: 'relative', paddingLeft: 13, marginBottom: 3, color: 'var(--text-1)', fontSize: 13 }}>
        <span style={{ position: 'absolute', left: 2, color: 'var(--text-3)', fontWeight: 700 }}>·</span>
        {children}
      </li>
    ),
    strong: ({ children }) => <strong style={{ fontWeight: 600, color: '#fff' }}>{children}</strong>,
    em: ({ children }) => <em style={{ fontStyle: 'italic', color: 'var(--text-2)' }}>{children}</em>,
    h1: ({ children }) => <h1 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '14px 0 6px', paddingBottom: 4, borderBottom: '1px solid var(--border-mid)' }}>{children}</h1>,
    h2: ({ children }) => <h2 style={{ fontSize: 14, fontWeight: 600, color: '#ebebeb', margin: '12px 0 5px' }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ fontSize: 13, fontWeight: 600, color: '#d8d8d8', margin: '10px 0 4px' }}>{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote style={{ borderLeft: '2px solid var(--accent)', background: 'var(--accent-muted)', padding: '6px 10px', margin: '8px 0', borderRadius: '0 4px 4px 0', color: 'var(--text-2)' }}>
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
        {children}
      </a>
    ),
    hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border-mid)', margin: '12px 0' }} />,
    table: ({ children }) => (
      <div style={{ overflowX: 'auto', margin: '8px 0', border: '1px solid var(--border-mid)', borderRadius: 4 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead style={{ background: 'var(--bg-elevated)' }}>{children}</thead>,
    th: ({ children }) => <th style={{ padding: '5px 8px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)', borderBottom: '1px solid var(--border-mid)' }}>{children}</th>,
    td: ({ children }) => <td style={{ padding: '5px 8px', borderBottom: '1px solid var(--border-dim)', color: 'var(--text-1)' }}>{children}</td>,
  };

  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}
