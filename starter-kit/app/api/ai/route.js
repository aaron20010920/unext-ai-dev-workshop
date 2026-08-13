// 這支檔案就是「你的網站怎麼跟 AI 說話」的地方
//
// 現在支援多輪對話：前端把整段對話紀錄（messages 陣列）一起送過來，
// 這支 route 接在 system prompt 後面，一起丟給 Groq

const SYSTEM_PROMPT = `你是一位友善的助理。
用繁體中文回答，講重點，不要長篇大論。
不確定的事情老實說不知道，不要編。`;

// 一次最多留幾則歷史訊息 —— 太長的對話只留最近幾則，
// 一方面省 token，一方面 Groq 免費額度每分鐘 token 數有限
const MAX_HISTORY = 20;

// 單則訊息最多幾個字
const MAX_MSG_CHARS = 2000;

export async function POST(request) {
  const { messages } = await request.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: '沒有輸入內容' }, { status: 400 });
  }

  for (const m of messages) {
    if (!m?.content || typeof m.content !== 'string') {
      return Response.json({ error: '訊息格式錯誤' }, { status: 400 });
    }
    if (m.content.length > MAX_MSG_CHARS) {
      return Response.json(
        { error: `單則訊息最多 ${MAX_MSG_CHARS} 個字` },
        { status: 413 }
      );
    }
  }

  const trimmed = messages.slice(-MAX_HISTORY);

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: '還沒設定 GROQ_API_KEY。到 Vercel 專案 → Settings → Environment Variables 加上它，然後 Redeploy' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'unext-ai-dev-workshop/1.0',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...trimmed.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_completion_tokens: 1200,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return Response.json(
        { error: `Groq 回了 ${res.status}`, detail: detail.slice(0, 500) },
        { status: 502 }
      );
    }

    const data = await res.json();
    const output = data.choices?.[0]?.message?.content ?? '(AI 沒有回傳內容)';
    return Response.json({ output });
  } catch (err) {
    return Response.json({ error: `呼叫失敗：${err.message}` }, { status: 500 });
  }
}
