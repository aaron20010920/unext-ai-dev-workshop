'use client';

// 這是你的網站首頁 —— LINE 風格的多輪聊天介面
// 這一版加了：對話紀錄存在瀏覽器的 localStorage，重新整理頁面不會消失
// （限制：只存在「這一台瀏覽器」，換裝置或清瀏覽器資料就會不見）

import { useState, useRef, useEffect } from 'react';

const APP_TITLE = '我的第一個 AI 應用';
const PLACEHOLDER = '輸入訊息⋯⋯';

const LINE_GREEN = '#06C755';
const BG = '#e5ede3';

// localStorage 存的 key 名稱
const STORAGE_KEY = 'chat-messages';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false); // 避免第一次渲染就把空陣列存回去蓋掉舊資料
  const bottomRef = useRef(null);

  // 網頁一打開，先從 localStorage 讀回之前的對話紀錄
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch (e) {
      // 讀取失敗（例如資料壞掉）就當作沒有歷史紀錄，不影響使用
    }
    setLoaded(true);
  }, []);

  // 每次對話有變化，就存回 localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      // 存不進去（例如容量滿了）就略過，不影響對話功能
    }
  }, [messages, loaded]);

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

  function handleClear() {
    if (!confirm('確定要清空對話紀錄嗎？')) return;
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div style={S.outer}>
      <div style={S.phone}>
        <header style={S.header}>
          <div style={S.headerAvatar}>AI</div>
          <div style={{ flex: 1 }}>
            <div style={S.headerTitle}>{APP_TITLE}</div>
            <div style={S.headerSub}>{loading ? '正在輸入⋯⋯' : '線上'}</div>
          </div>
          {messages.length > 0 && (
            <button onClick={handleClear} style={S.clearButton} title="清空對話">
              清空
            </button>
          )}
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
  outer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100dvh',
    background: '#d8d8d8',
    fontFamily: 'system-ui, -apple-system, "Noto Sans TC", sans-serif',
  },
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
  clearButton: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 12,
    cursor: 'pointer',
  },
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
