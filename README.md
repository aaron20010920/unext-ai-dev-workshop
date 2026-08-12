# AI 開發實戰 — 打造第一個 AI 應用

> UNEXT 見習生職涯沙龍｜2026-08-13（四）13:30–17:00｜講師：蔡子揚（Young）

今天結束的時候，你會有一個**別人打得開、能操作、真的有 AI 在裡面**的網站。
不是投影片、不是截圖、不是「等回家再做」。是一個網址。

而且你不會寫一行程式。

---

## 今天走的路

```
你腦中那件煩事  →  問成一句話  →  變成需求單  →  交給 AI 工程師  →  上線
   (痛點)          (裸問)        (SPEC)        (Codex)        (Vercel)
```

六個階段，每一階都有可複製的 prompt：

| 階段 | 你在做什麼 | 產出 |
|---|---|---|
| **0 定錨** | 認清 3.5 小時能做出什麼、做不出什麼 | 一個現實的目標 |
| **1 裸問** | 什麼脈絡都不給，直接叫 AI 做 → 看它噴什麼 | 知道「為什麼要寫需求單」 |
| **2 需求單** | 讓 AI 訪談你 → 產出 SPEC，用 🟢🟡🔴 切野心 | [`SPEC.md`](SPEC-TEMPLATE.md) |
| **3 五層** | 你手上有哪些積木（說明書／招式／分身／記憶／自己跑） | 知道每塊要用哪個 |
| **4 開工** | Fork → 上線 → 讓 Codex 照 SPEC 改 → push | **你的網址** |
| **5 收斂** | Demo + 標出今天做到哪、剩下的怎麼長 | 路線圖 |

---

## 你需要準備的（全部免費，不用信用卡）

| 帳號 | 去哪申請 | 用來做什麼 |
|---|---|---|
| **GitHub** | [github.com](https://github.com) | 放你的程式碼 |
| **Vercel** | [vercel.com](https://vercel.com)（用 GitHub 登入） | 把它變成網址 |
| **Groq** | [console.groq.com](https://console.groq.com) → API Keys | 網站裡的那個 AI |
| **ChatGPT** | [chatgpt.com](https://chatgpt.com) | Codex（幫你寫程式的那位） |

一台能上網的筆電。**不需要任何程式基礎，不需要安裝任何軟體**（全程在瀏覽器）。

---

## 五分鐘先上線

先讓網站活起來，再想要做什麼 — 因為「已經活著的東西」改起來比「從零開始」容易一百倍。

```bash
npm i -g vercel && vercel login
git clone https://github.com/你的帳號/unext-ai-dev-workshop.git
cd unext-ai-dev-workshop/starter-kit && npm install
vercel --prod                             # 第一次會問幾題，全部 Enter
vercel env add GROQ_API_KEY production    # 貼上 console.groq.com 拿的 key
vercel --prod                             # 再跑一次讓 key 生效
```

🔴 `cd starter-kit` 不能漏 —— 在根目錄跑會「成功」部署一個打開是 404 的東西。

**→ 完整步驟看 [QUICKSTART.md](QUICKSTART.md)**

---

## 這個 repo 裡有什麼

| 路徑 | 是什麼 |
|---|---|
| [`QUICKSTART.md`](QUICKSTART.md) | 五分鐘上線的逐步操作 |
| [`SPEC-TEMPLATE.md`](SPEC-TEMPLATE.md) | 需求單模板（第 2 階要填的） |
| [`docs/01-spec-method.md`](docs/01-spec-method.md) | 怎麼把一句抱怨變成 AI 做得出來的需求單 |
| [`docs/02-prompts.md`](docs/02-prompts.md) | 每一階可以直接複製的 prompt |
| [`docs/03-troubleshooting.md`](docs/03-troubleshooting.md) | 卡住了看這裡（每種錯誤怎麼修） |
| `starter-kit/` | 你的網站本體。**改這裡** |
| `.github/workflows/ci.yml` | CI：每次 push 自動檢查有沒有改壞 |

---

## starter-kit 只有五個檔

不是省略版，是真的只有五個 — 這樣你才看得懂它。

| 檔 | 做什麼 | 你會改它嗎 |
|---|---|---|
| `app/page.jsx` | 你看到的那個頁面 | **會，這是主戰場** |
| `app/api/ai/route.js` | 網站怎麼跟 AI 說話 | 換 AI 的個性時會 |
| `app/layout.jsx` | 網頁標題、外框 | 偶爾 |
| `package.json` | 用了哪些套件 | 不用 |
| `next.config.mjs` | 設定檔 | 不用 |

---

## 兩個原則（今天請守住）

**① 一次只做一件事**

跟 Codex 說「幫我做一個能上傳檔案、會分析、有登入、還能寄信的系統」→ 它會做出一個四處都壞掉的東西。
說「把首頁的標題改成 X，輸入框的提示文字改成 Y」→ 它會做對。

**② 壞了就回上一步，不要硬修**

`git` 幫你記得每一個版本。改壞了不用慌，也不用叫 AI「修好它」（越修越壞）。
回到上一個能動的版本，重講一次需求就好。

---

## 課後

這個 repo 不會消失，fork 走的那份是你自己的。
今天做到 🟢 那塊，🟡🔴 的部分照你的路線圖慢慢長。

有問題 → 先問 Codex，它看得到你的程式碼。
