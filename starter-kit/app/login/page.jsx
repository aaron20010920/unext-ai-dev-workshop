'use client';

// 登入 / 註冊頁 —— 這是網站的第一道門
// 用 email + 密碼登入，沒有帳號的人可以直接在這頁註冊

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('註冊成功！請檢查信箱完成驗證後再登入（若沒收到信，看垃圾信匣）');
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setMessage(`出錯了：${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.outer}>
      <div style={S.card}>
        <h1 style={S.title}>{mode === 'login' ? '登入' : '註冊帳號'}</h1>
        <p style={S.sub}>我的第一個 AI 應用</p>

        <form onSubmit={handleSubmit} style={S.form}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={S.input}
          />
          <input
            type="password"
            placeholder="密碼（至少 6 碼）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={S.input}
          />
          <button type="submit" disabled={loading} style={S.button}>
            {loading ? '處理中⋯⋯' : mode === 'login' ? '登入' : '註冊'}
          </button>
        </form>

        {message && <div style={S.message}>{message}</div>}

        <div style={S.switchRow}>
          {mode === 'login' ? (
            <>
              還沒有帳號？
              <button onClick={() => { setMode('signup'); setMessage(''); }} style={S.linkButton}>
                點此註冊
              </button>
            </>
          ) : (
            <>
              已經有帳號？
              <button onClick={() => { setMode('login'); setMessage(''); }} style={S.linkButton}>
                點此登入
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const LINE_GREEN = '#06C755';

const S = {
  outer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100dvh',
    background: '#f2f0ec',
    fontFamily: 'system-ui, -apple-system, "Noto Sans TC", sans-serif',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    background: '#fff',
    borderRadius: 20,
    padding: '2rem 1.75rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  title: { fontSize: '1.5rem', marginBottom: 4, textAlign: 'center' },
  sub: { color: '#888', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: 12,
    outline: 'none',
  },
  button: {
    marginTop: 4,
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    background: LINE_GREEN,
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
  },
  message: {
    marginTop: 14,
    padding: '0.6rem 0.8rem',
    background: '#fafaf5',
    border: '1px solid #eee',
    borderRadius: 10,
    fontSize: '0.85rem',
    color: '#555',
    lineHeight: 1.5,
  },
  switchRow: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#888',
  },
  linkButton: {
    marginLeft: 6,
    background: 'none',
    border: 'none',
    color: LINE_GREEN,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.85rem',
    textDecoration: 'underline',
  },
};
