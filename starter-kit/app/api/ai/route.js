// 這支檔案就是「你的網站怎麼跟 AI 說話」的地方
//
// 前端（page.jsx）把使用者打的字送到這裡 → 這裡轉送給 Groq 的 AI → 把答案送回前端
//
// 為什麼不能讓前端直接打 Groq：API key 會被所有人看到（打開瀏覽器的原始碼就有）
// 所以 key 只放在這一層（伺服器端），前端永遠看不到它

export async function POST(request) {
  // 1. 拿到前端送來的東西
  const { input, systemPrompt } = await request.json();

  if (!input || !input.trim()) {
    return Response.json({ error: '沒有輸入內容' }, { status: 400 });
  }

  // 2. 拿 API key —— 這個值來自 Vercel 的環境變數，不在程式碼裡
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: '還沒設定 GROQ_API_KEY。到 Vercel 專案 → Settings → Environment Variables 加上它，然後 Redeploy' },
      { status: 500 }
    );
  }

  // 3. 呼叫 Groq
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // ⚠️ 這行不能拿掉 —— 少了 User-Agent，Groq 會回 403
        'User-Agent': 'unext-ai-dev-workshop/1.0',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            // 這段就是你的「AI 助手人格」。改這裡 = 換一個助手
            content: systemPrompt || '你是一位友善的助理。用繁體中文回答，不要用句號結尾的長篇大論，講重點。',
          },
          { role: 'user', content: input },
        ],
        max_tokens: 1200,
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
