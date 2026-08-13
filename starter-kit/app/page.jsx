'use client';

// 這是你的網站首頁 —— LINE 風格的多輪聊天介面
// 這一版加了「手機外框」：電腦上看起來像手機置中，手機上自然就是滿版

import { useState, useRef, useEffect } from 'react';

const APP_TITLE = '我的第一個 AI 應用';
const PLACEHOLDER = '輸入訊息⋯⋯';

const LINE_GREEN = '#06C755';
const BG = '#e5ede3';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.output }]);
      }
    } catch (err) {
      setError(`送出失敗：${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    // 👇 外層灰底：讓手機框在電腦上有「桌面背景」的感覺
    <div style={S.outer}>
      {/* 👇 手機外框：固定寬度、置中、圓角、陰影 —— 手機瀏覽時會自動變滿版 */}
      <div style={S.phone}>
        <header style={S.header}>
          <div style={S.headerAvatar}>AI</div>
          <div>
            <div style={S.headerTitle}>{APP_TITLE}</div>
            <div style={S.headerSub}>{loading ? '正在輸入⋯⋯' : '線上'}</div>
          </div>
        </header>

        <main style={S.chatArea}>
          {messages.length === 0 && <div style={S.emptyHint}>開始對話吧</div>}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...S.bubbleRow,
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...S.bubble,
                  ...(m.role === 'user' ? S.bubbleUser : S.bubbleAI),
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ ...S.bubbleRow, justifyContent: 'flex-start' }}>
              <div style={{ ...S.bubble, ...S.bubbleAI, ...S.typing }}>
                <span style={S.dot} />
                <span style={{ ...S.dot, animationDelay: '0.15s' }} />
                <span style={{ ...S.dot, animationDelay: '0.3s' }} />
              </div>
            </div>
          )}

          {error && (
            <div style={S.error}>
              <strong>出錯了：</strong> {error}
            </div>
          )}

          <div ref={bottomRef} />
        </main>

        <form onSubmit={handleSubmit} style={S.inputBar}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={PLACEHOLDER}
            rows={1}
            style={S.textarea}
          />
          <button type="submit" disabled={loading || !input.trim()} style={S.sendButton}>
            送出
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const S = {
  // 外層：滿版灰底，讓手機框置中
  outer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    background: '#d8d8d8',
    fontFamily: 'system-ui, -apple-system, "Noto Sans TC", sans-serif',
  },
  // 手機外框：電腦上固定寬度＋圓角＋陰影；手機上（螢幕本身就窄）自動滿版
  phone: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 430,
    height: '100dvh',
    maxHeight: 900,
    background: BG,
    boxShadow: '0 0 40px rgba(0,0,0,0.25)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    background: LINE_GREEN,
    color: '#fff',
    flexShrink: 0,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
  },
  headerTitle: { fontWeight: 700, fontSize: 16 },
  headerSub: { fontSize: 12, opacity: 0.85 },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  emptyHint: { textAlign: 'center', color: '#8a9a86', marginTop: 40, fontSize: 14 },
  bubbleRow: { display: 'flex' },
  bubble: {
    maxWidth: '75%',
    padding: '10px 14px',
    fontSize: 15,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    boxShadow: '0 1px 1px rgba(0,0,0,0.06)',
  },
  bubbleUser: {
    background: LINE_GREEN,
    color: '#fff',
    borderRadius: '16px 16px 4px 16px',
  },
  bubbleAI: {
    background: '#fff',
    color: '#1a1a1a',
    borderRadius: '16px 16px 16px 4px',
  },
  typing: { display: 'flex', gap: 4, padding: '14px 16px' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#aaa',
    display: 'inline-block',
    animation: 'bounce 1s infinite',
  },
  error: {
    alignSelf: 'center',
    marginTop: 8,
    padding: '8px 14px',
    background: '#fff5f5',
    border: '1px solid #ffd0d0',
    borderRadius: 10,
    fontSize: 13,
    color: '#a33',
  },
  inputBar: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
    padding: '10px 12px',
    background: '#fff',
    borderTop: '1px solid #ddd',
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    resize: 'none',
    border: '1px solid #ddd',
    borderRadius: 20,
    padding: '10px 16px',
    fontSize: 15,
    fontFamily: 'inherit',
    maxHeight: 120,
    outline: 'none',
  },
  sendButton: {
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    background: LINE_GREEN,
    border: 'none',
    borderRadius: 20,
    cursor: 'pointer',
    flexShrink: 0,
  },
};
