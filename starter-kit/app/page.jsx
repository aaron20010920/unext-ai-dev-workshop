'use client';

// 主頁 —— LINE 風格聊天介面
// 這一版：訊息不再存 localStorage，改存進 Supabase 的 messages 表
// 每則訊息都綁 user_id，RLS 會確保你只讀得到自己的訊息

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

const APP_TITLE = '我的第一個 AI 應用';
const PLACEHOLDER = '輸入訊息⋯⋯';

const LINE_GREEN = '#06C755';
const BG = '#e5ede3';

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  const [messages, setMessages] = useState([]); // [{ id, role, content }]
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  // 進頁面先確認有沒有登入
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login');
      } else {
        setUser(session.user);
        setCheckingAuth(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  // 登入確認完成後，去資料庫讀回這個使用者之前的對話紀錄
  useEffect(() => {
    if (!user) return;

    async function loadHistory() {
      setLoadingHistory(true);
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('id, role, content')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) {
        setError(`讀取歷史紀錄失敗：${fetchError.message}`);
      } else {
        setMessages(data || []);
      }
      setLoadingHistory(false);
    }

    loadHistory();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || !user) return;

    setInput('');
    setError('');
    setSending(true);

    // 1. 把使用者的訊息存進資料庫，同時顯示在畫面上
    const { data: userMsg, error: insertError } = await supabase
      .from('messages')
      .insert({ user_id: user.id, role: 'user', content: text })
      .select('id, role, content')
      .single();

    if (insertError) {
      setError(`存訊息失敗：${insertError.message}`);
      setSending(false);
      return;
    }

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    // 2. 把整段對話紀錄送給 AI
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        // 3. 把 AI 的回覆也存進資料庫
        const { data: aiMsg, error: aiInsertError } = await supabase
          .from('messages')
          .insert({ user_id: user.id, role: 'assistant', content: data.output })
          .select('id, role, content')
          .single();

        if (aiInsertError) {
          setError(`存 AI 回覆失敗：${aiInsertError.message}`);
        } else {
          setMessages((prev) => [...prev, aiMsg]);
        }
      }
    } catch (err) {
      setError(`送出失敗：${err.message}`);
    } finally {
      setSending(false);
    }
  }

  async function handleClear() {
    if (!confirm('確定要清空對話紀錄嗎？這會刪掉資料庫裡的紀錄，無法復原。')) return;

    const { error: deleteError } = await supabase
      .from('messages')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      setError(`清空失敗：${deleteError.message}`);
    } else {
      setMessages([]);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  if (checkingAuth) {
    return (
      <div style={S.outer}>
        <div style={S.checking}>確認登入狀態中⋯⋯</div>
      </div>
    );
  }

  return (
    <div style={S.outer}>
      <div style={S.phone}>
        <header style={S.header}>
          <div style={S.headerAvatar}>AI</div>
          <div style={{ flex: 1 }}>
            <div style={S.headerTitle}>{APP_TITLE}</div>
            <div style={S.headerSub}>
              {sending ? '正在輸入⋯⋯' : user?.email || '線上'}
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={handleClear} style={S.clearButton} title="清空對話">
              清空
            </button>
          )}
          <button onClick={handleLogout} style={S.clearButton} title="登出">
            登出
          </button>
        </header>

        <main style={S.chatArea}>
          {loadingHistory && <div style={S.emptyHint}>讀取對話紀錄中⋯⋯</div>}
          {!loadingHistory && messages.length === 0 && (
            <div style={S.emptyHint}>開始對話吧</div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
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

          {sending && (
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
          <button type="submit" disabled={sending || !input.trim()} style={S.sendButton}>
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
  checking: { color: '#888', fontSize: 15 },
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
    gap: 8,
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
    flexShrink: 0,
  },
  headerTitle: { fontWeight: 700, fontSize: 16 },
  headerSub: {
    fontSize: 12,
    opacity: 0.85,
    maxWidth: 160,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  clearButton: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 12,
    cursor: 'pointer',
    flexShrink: 0,
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
