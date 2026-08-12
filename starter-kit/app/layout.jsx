export const metadata = {
  title: '我的第一個 AI 應用',
  description: 'UNEXT AI 開發實戰 — 學員專案',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body style={{ margin: 0, background: '#fff' }}>{children}</body>
    </html>
  );
}
