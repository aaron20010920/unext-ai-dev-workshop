'use client';

// 這是你的網站首頁
//
// 它現在長得很樸素，那是刻意的 —— 你要把它改成「你的那個應用」
// 改法：把這整個檔案貼給 Codex，跟它說你要做什麼（見 repo 根目錄的 SPEC-TEMPLATE.md）

import { useState } from 'react';

// 👇 改這兩行就換了一個應用（先改這裡，再改介面）
// AI 的人格不在這裡 —— 它在 app/api/ai/route.js 的 SYSTEM_PROMPT（伺服器端）
const APP_TITLE = '我的第一個 AI 應用';
const PLACEHOLDER = '在這裡輸入你要問的東西⋯⋯';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setOutput(data.output);
    } catch (err) {
      setError(`送出失敗：${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={S.main}>
      <h1 style={S.h1}>{APP_TITLE}</h1>
      <p style={S.sub}>輸入內容 → 按送出 → AI 幫你處理</p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={6}
          style={S.textarea}
        />
        <button type="submit" disabled={loading || !input.trim()} style={S.button}>
          {loading ? 'AI 正在想⋯⋯' : '送出'}
        </button>
      </form>

      {error && (
        <div style={S.error}>
          <strong>出錯了：</strong> {error}
          <div style={S.errorHint}>看 repo 的 docs/03-troubleshooting.md，裡面有每一種錯誤怎麼修</div>
        </div>
      )}

      {output && (
        <section style={S.result}>
          <div style={S.resultLabel}>AI 的回覆</div>
          <div style={S.resultBody}>{output}</div>
        </section>
      )}

      <footer style={S.footer}>
        改這個頁面：把 <code>app/page.jsx</code> 貼給 Codex，跟它說你要什麼
        <br />
        換 AI 的個性：改 <code>app/api/ai/route.js</code> 的 <code>SYSTEM_PROMPT</code>
      </footer>
    </main>
  );
}

// 樣式集中放這裡，改配色只改這一塊
const S = {
  main: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '3rem 1.5rem 5rem',
    fontFamily: 'system-ui, -apple-system, "Noto Sans TC", sans-serif',
    color: '#1a1a1a',
    lineHeight: 1.7,
  },
  h1: { fontSize: '2rem', marginBottom: '0.5rem' },
  sub: { color: '#666', marginBottom: '2rem', fontSize: '1.05rem' },
  textarea: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.05rem',
    fontFamily: 'inherit',
    border: '1px solid #ddd',
    borderRadius: 10,
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  button: {
    marginTop: '1rem',
    padding: '0.8rem 2rem',
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#fff',
    background: '#1a1a1a',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },
  error: {
    marginTop: '1.5rem',
    padding: '1rem 1.2rem',
    background: '#fff5f5',
    border: '1px solid #ffd0d0',
    borderRadius: 10,
    fontSize: '0.98rem',
  },
  errorHint: { marginTop: '0.5rem', color: '#888', fontSize: '0.9rem' },
  result: {
    marginTop: '2rem',
    padding: '1.2rem 1.4rem',
    background: '#fafaf8',
    border: '1px solid #eee',
    borderRadius: 12,
  },
  resultLabel: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '0.6rem',
    letterSpacing: '0.05em',
  },
  resultBody: { whiteSpace: 'pre-wrap', fontSize: '1.05rem' },
  footer: {
    marginTop: '3rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #eee',
    color: '#888',
    fontSize: '0.9rem',
  },
};
