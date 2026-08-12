# 五分鐘上線（走命令列）

目標：先讓一個網站活著，之後才改它。

全部用命令列 —— 指令可以直接複製，不用在網頁上到處找按鈕。

---

## 事前準備（各一分鐘）

| 要什麼 | 去哪拿 |
|---|---|
| GitHub 帳號 | [github.com](https://github.com) |
| Vercel 帳號 | [vercel.com](https://vercel.com) → Continue with **GitHub** |
| Groq API key | [console.groq.com](https://console.groq.com) → API Keys → Create（**只出現一次，馬上複製**） |
| Node.js | [nodejs.org](https://nodejs.org) 下載 LTS（`node -v` 有版本號就行了） |

> ⚠️ Groq 那串等於你的密碼。**不要貼進 GitHub、不要傳給同學。** 它只會進 Vercel 的環境變數。

---

## Step 1 — Fork（在網頁上做，只有這一步）

到 [github.com/young-ai-courses/unext-ai-dev-workshop](https://github.com/young-ai-courses/unext-ai-dev-workshop)
→ 右上角 **Fork** → **Create fork**。

現在 `github.com/你的帳號/unext-ai-dev-workshop` 是你的了。

---

## Step 2 — 剩下全部在命令列

```bash
# 一次裝好，之後都不用再做
npm i -g vercel
vercel login                 # 會開瀏覽器，選 Continue with GitHub

# 把你 fork 的那份抓下來
git clone https://github.com/你的帳號/unext-ai-dev-workshop.git
cd unext-ai-dev-workshop/starter-kit
npm install
```

🔴 **`cd` 進 `starter-kit` 這步不能漏。** `vercel` 只看你現在站在哪個目錄——
在 repo 根目錄跑，它會「成功」部署一個空的東西給你，打開網址是 404，而且不會有任何錯誤訊息告訴你為什麼。

---

## Step 3 — 部署

```bash
vercel --prod
```

第一次會問幾題，**全部按 Enter 用預設就好**（要不要 set up、專案叫什麼、目錄在哪、要不要改設定）。

跑完會給你一個網址，長得像 `https://starter-kit-xxxx.vercel.app`。
打開它 —— 頁面在，但按送出會說「還沒設定 GROQ_API_KEY」，因為還沒給它 key。

---

## Step 4 — 把 key 給它

```bash
vercel env add GROQ_API_KEY production
# 貼上你的 key → Enter

vercel --prod                # 環境變數不會自動生效，要再部署一次
```

**再打開網址，輸入「用一句話說明什麼是 API」，按送出。**

看到 AI 回你話了 → 你的第一個 AI 應用已經上線，全世界都連得到。

---

## Step 5 — 本機也跑得起來（選配）

```bash
vercel env pull .env.local   # 把線上的環境變數拉下來
npm run dev                  # 打開 http://localhost:3000
```

改 code 的時候用這個看效果比較快，不用每次都部署。

---

## Step 6 — 讓 AI 照你的規格改

到 [chatgpt.com](https://chatgpt.com) 的 **Codex** → 連上你的 GitHub → 選你 fork 的 repo，然後：

```
這是我的需求單：

（貼上你 review 過的 PRD 全文）

請照這份需求單改 starter-kit：
- 頁面：starter-kit/app/page.jsx
- AI 的人格與規則：starter-kit/app/api/ai/route.js 的 SYSTEM_PROMPT

規則：
1. 先跟我複述一次你理解的需求，等我說「開始」你才動手
2. 一次只改這兩個檔，不要新增其他檔案
3. 不要加登入、資料庫、檔案上傳
4. 不要動 package.json
```

它改完開 PR → 你在 GitHub 按 **Merge** → Vercel 自動重新部署 → 30 秒後重新整理網址。

**這就是 CI/CD**：你只做「按 merge」這一個動作，剩下每一步都是自動的。

---

## ⚠️ Codex 免費額度大約一天 10 次，省著用

一個 task = 它完整跑一輪（讀專案、改檔、開 PR）。**一次講清楚一件事**，
不要問「幫我看看哪裡怪怪的」讓它到處翻 —— 那也算一次。

**用完了不影響你今天做完**，改走這條（完全沒有次數限制）：

1. 開 [chatgpt.com](https://chatgpt.com) 或 [claude.ai](https://claude.ai) 的**普通對話**（不是 Codex）
2. 把 `starter-kit/app/page.jsx` **全文**貼給它 + 你的需求，
   最後加一句「回我完整的檔案內容，不要只給片段」
3. 複製它回的內容 → 回 GitHub 點進那個檔案 → 鉛筆 ✏️ → 全選貼上 → **Commit changes**
4. Vercel 自動重新部署，30 秒後重新整理

差別只在「它看不到你的專案，所以你要自己把檔案貼給它」。

---

## 一定會遇到的三件事

**① 打開網址是 404**
忘了 `cd starter-kit`。刪掉重來最快：`vercel project rm <專案名>`，
或到 Vercel → Settings → General → Root Directory 填 `starter-kit` → Redeploy。

**② 按送出說「還沒設定 GROQ_API_KEY」**
`vercel env add` 之後**沒有再跑一次 `vercel --prod`**。環境變數不會自己生效。

**③ 出現「Groq 回了 401」**
key 貼錯或貼到不完整。回 console.groq.com 產一把新的，`vercel env rm` 再 `add` 一次。

其他錯誤 → [`docs/03-troubleshooting.md`](docs/03-troubleshooting.md)

---

## 存資料（晚場才會用到）

```bash
vercel install supabase      # 舊版 CLI 是 vercel integration add supabase
                             # 互動式問方案時挑 Free
vercel env pull .env.local   # 憑證自動下來，不用自己複製連線字串
```

表在 Supabase 後台點一下就好，不用寫 SQL：**Table Editor → New table → `history`**，
欄位 `input(text)` · `output(text)` · `created_at(timestamp)`。

🔴 **建完表一定要開 RLS**，否則任何人拿到你的網址就能讀寫整張表 →
見 [`docs/03-troubleshooting.md`](docs/03-troubleshooting.md) 的 RLS 那一節。
