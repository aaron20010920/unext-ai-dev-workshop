'use client';

// 主頁 —— LINE 風格聊天介面
// 這一版加了：進頁面先檢查有沒有登入，沒登入就導去 /login；右上角加登出按鈕

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

const APP_TITLE = '我的第一個 AI 應用';
const PLACEHOLDER = '輸入訊息⋯⋯';

const LINE_GREEN = '#06C755';
const BG = '#e5ede3';
const STORAGE_KEY = 'chat-messages';

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
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

    // 登入狀態改變時（例如另一頁登出）也會同步
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  // 讀回之前的對話紀錄（目前還是存瀏覽器，下一步才會改成存資料庫）
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch (e) {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  // 還在確認登入狀態時，先不要顯示聊天畫面（避免閃一下又跳走）
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
              {loading ? '正在輸入⋯⋯' : user?.email || '線上'}
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
