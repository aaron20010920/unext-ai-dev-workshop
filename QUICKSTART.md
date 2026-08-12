# 五分鐘上線

目標：先讓一個網站活著，之後才改它。

全程在瀏覽器，不用安裝任何東西。

---

## Step 1 — Fork 這個 repo（30 秒）

1. 到 **[github.com/young-ai-courses/unext-ai-dev-workshop](https://github.com/young-ai-courses/unext-ai-dev-workshop)**
2. 右上角綠色的 **Fork** → **Create fork**
3. 現在網址變成 `github.com/你的帳號/unext-ai-dev-workshop` — 這份是你的了

> Fork 是「複製一份到自己名下」。之後你怎麼改都不會動到別人的。

---

## Step 2 — 拿一把 Groq API Key（1 分鐘）

這把 key 是「你的網站可以用 AI」的憑證。

1. 到 **[console.groq.com](https://console.groq.com)** → 用 Google 登入（免費，不用信用卡）
2. 左邊選 **API Keys** → **Create API Key** → 隨便取個名字
3. **它只會出現一次**，馬上複製起來，先貼在記事本

> ⚠️ 這串東西等於你的密碼。**不要**貼進 GitHub、不要貼進聊天室、不要傳給同學。
> 等一下只會貼進 Vercel 的設定頁（那裡是安全的）。

---

## Step 3 — 部署到 Vercel（2 分鐘）

1. 到 **[vercel.com](https://vercel.com)** → **Continue with GitHub**（免費）
2. 進去後點 **Add New...** → **Project**
3. 找到你剛 fork 的 `unext-ai-dev-workshop` → 點 **Import**
4. 🔴 **這一步最容易錯**：把 **Root Directory** 改成 `starter-kit`
   （點 Edit → 選 `starter-kit` 資料夾。**不要**留在根目錄，留在根目錄一定失敗）
5. 展開 **Environment Variables**，加一個：
   - Name：`GROQ_API_KEY`（一字不差，全大寫，中間是底線）
   - Value：貼上 Step 2 拿到的那串
6. 點 **Deploy** → 等 30–60 秒

成功的話你會看到一個網址，長得像：

```
https://unext-ai-dev-workshop-你的帳號.vercel.app
```

**打開它。在輸入框打「用一句話說明什麼是 API」，按送出。**

看到 AI 回你話了 → 你的第一個 AI 應用已經上線，而且全世界都連得到。

---

## Step 4 — 讓 Codex 幫你改（剩下的時間都在這）

1. 到 **[chatgpt.com](https://chatgpt.com)** → 側邊欄找 **Codex**
2. 連上你的 GitHub（第一次會問你授權）→ 選你 fork 的那個 repo
3. 把你的需求單（[`SPEC-TEMPLATE.md`](SPEC-TEMPLATE.md) 填好的那份）貼給它，然後說：

> 照這份 SPEC 改 `starter-kit/app/page.jsx`。
> 先跟我複述一次你理解的需求，等我說「開始」你才動手。

4. 它改完會開一個 PR（Pull Request）→ 你到 GitHub 上按 **Merge**
5. Vercel 會**自動**重新部署。等 30 秒，重新整理你的網址

> 這就是 CI/CD：你 merge，剩下的自動發生。
> 每次 push GitHub 也會自動幫你檢查 build 過不過（`.github/workflows/ci.yml` 在做這件事）。

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

**① Vercel 說 build failed**
九成是 Root Directory 沒改成 `starter-kit`。回 Settings → General 改掉 → Redeploy。

**② 網站上按送出，出現「還沒設定 GROQ_API_KEY」**
環境變數沒設，或名字打錯，或**設完沒有 Redeploy**（設定完一定要重新部署一次才生效）。

**③ 出現「Groq 回了 401」**
key 貼錯或貼到不完整。回 console.groq.com 重新產一把。

其他錯誤 → [`docs/03-troubleshooting.md`](docs/03-troubleshooting.md)

---

## 想在自己電腦上跑（選配，今天不需要）

```bash
git clone https://github.com/你的帳號/unext-ai-dev-workshop.git
cd unext-ai-dev-workshop/starter-kit
npm install
cp .env.example .env.local     # 然後把 key 填進 .env.local
npm run dev                    # 打開 http://localhost:3000
```
