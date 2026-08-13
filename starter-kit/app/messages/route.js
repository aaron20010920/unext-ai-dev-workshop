// 這支檔案負責跟 Supabase 說話 —— key 只在這裡（伺服器端），前端看不到
//
// GET  /api/messages?device_id=xxx   → 讀出這個裝置的歷史對話
// POST /api/messages                 → 寫入一則新訊息

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

function checkEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return Response.json(
      { error: '還沒設定 SUPABASE_URL / SUPABASE_ANON_KEY，去 Vercel 環境變數確認名字對不對' },
      { status: 500 }
    );
  }
  return null;
}

export async function GET(request) {
  const envError = checkEnv();
  if (envError) return envError;

  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('device_id');
  if (!deviceId) {
    return Response.json({ error: '缺少 device_id' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?device_id=eq.${encodeURIComponent(deviceId)}&order=created_at.asc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) {
      const detail = await res.text();
      return Response.json({ error: `Supabase 回了 ${res.status}`, detail }, { status: 502 });
    }
    const data = await res.json();
    return Response.json({ messages: data });
  } catch (err) {
    return Response.json({ error: `讀取失敗：${err.message}` }, { status: 500 });
  }
}

export async function POST(request) {
  const envError = checkEnv();
  if (envError) return envError;

  const { device_id, role, content } = await request.json();
  if (!device_id || !role || !content) {
    return Response.json({ error: '缺少必要欄位' }, { status: 400 });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ device_id, role, content }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return Response.json({ error: `Supabase 回了 ${res.status}`, detail }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: `寫入失敗：${err.message}` }, { status: 500 });
  }
}
