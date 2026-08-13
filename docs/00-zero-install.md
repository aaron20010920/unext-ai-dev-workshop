# Ⓑ 零安裝路線 — 全程瀏覽器

**這不是備案，是一條正規路線。** 終點跟 Ⓐ 完全一樣：一個別人打得開、
裡面有 AI 在跑的網址。差別只有一個 —— AI 不會直接改你電腦上的檔案，
所以改 code 的時候你要自己複製貼上。

適合：沒有付費 AI 助手、公司或學校筆電鎖權限、不想在自己電腦裝東西的人。

你需要的只有兩個：**GitHub 帳號** ＋ **Groq key**（[console.groq.com](https://console.groq.com)，免費）。

---

## 步驟 1 — Fork

到 [github.com/young-ai-courses/unext-ai-dev-workshop](https://github.com/young-ai-courses/unext-ai-dev-workshop)
→ 右上角 **Fork** → **Create fork**。

現在這份專案是你的了。

---

## 步驟 2 — 上線

1. 到 [vercel.com/new](https://vercel.com/new) → 用 **GitHub 登入**（不用另外註冊）
2. **Import Git Repository** → 選你剛 fork 的那個
3. 🔴 **Root Directory 選 `starter-kit`**
   —— 這是這條路唯一會死的地方。漏了它，部署會顯示「成功」、也給你網址，
   但打開是一頁 404，而且沒有任何錯誤訊息指向原因
4. 展開 **Environment Variables** → 新增
   - Name：`GROQ_API_KEY`（一字不差）
   - Value：貼上你從 console.groq.com 拿到的 key
5. **Deploy** → 等 30 秒 → 你有網址了

> 🔴 那串 key 等於你的密碼：**只由你本人貼進 Vercel**。
> 不要貼進任何 AI 對話、不要進 GitHub、不要傳到群組。

**過關**：打開網址，貼一段會議筆記，按送出，AI 真的回話。

| 你看到 | 意思 |
|---|---|
| 打開是 404 | 第 3 步漏了，Root Directory 沒選 `starter-kit` |
| 「還沒設定 GROQ_API_KEY」 | 環境變數沒加，或加完沒有重新部署（Deployments → ⋯ → Redeploy） |
| 回 429 | 碰到 Groq 的 rate limit，稍等再試，不是你弄壞了 |

---

## 步驟 3 — 改東西（七步，全程在瀏覽器）

你已經有一個能動的網站了。要改它，用**任何免費對話**都可以：ChatGPT、Claude、Gemini。
它看不到你的專案，所以你要把檔案貼給它。

**不用先判斷要改哪個檔 —— 兩個都貼給它就好**

| 檔案 | 管什麼 |
|---|---|
| `starter-kit/app/page.jsx` | 畫面上的字、按鈕、顏色 |
| `starter-kit/app/api/ai/route.js` | AI 回答的內容、格式、語氣 |

兩個加起來約 240 行，任何免費對話一次都貼得下。讓它自己判斷該動哪一個。

**七步**

1. 在**你 fork 的那份** GitHub 點進 `starter-kit/app/page.jsx`
2. 檔案內容右上角有一排小 icon，按 **Copy raw file**
   —— 也可以按 **Raw** 再全選複製
3. 打開 ChatGPT／Claude／Gemini **貼上**；回 GitHub 對
   `starter-kit/app/api/ai/route.js` 做一樣的事，**貼進同一個對話**
4. 加一句「我要改成 ＿＿＿＿」，再補一句
   🔴「**只回你有改到的那個檔，給我完整檔案，不要片段，也不要省略沒改到的部分**」
   —— 少了前半句它會兩個檔都回；少了後半句它會回你「把第 12 行改成…」
5. 它回完之後**複製整份**，回 GitHub 點進**它說它改的那個檔**，右上角鉛筆 ✏️
6. 🔴 **全選舊的刪掉** → 貼上新的 → 頁面最下面 **Commit changes**
7. 等 30 秒，重新整理你的網址 —— 改動就上去了

**整段可以直接複製的講法**

```
這是我專案的兩個檔案。

--- starter-kit/app/page.jsx ---
（貼上）

--- starter-kit/app/api/ai/route.js ---
（貼上）

我要改成：＿＿＿＿＿＿＿

請只回你有改到的那個檔，給我完整的檔案內容，
不要只給片段，也不要省略沒改到的部分，並告訴我那是哪一個檔。
```

### 最常見的死法：白畫面

第 6 步**沒有先刪掉舊的就貼**，變成兩份程式疊在一起 → 網站會白畫面。

怎麼救：

- GitHub 那個檔案 → **History** → 點上一個版本 → 複製回來，重貼一次
- 真的救不回來：把你的 fork 刪掉，重新 fork 一份（你只損失剛才那次修改）

## 這條路少了什麼（老實說）

- AI 不會直接動你的檔案，所以每次改都要複製貼上一輪
- 沒有本機環境，不能在自己電腦先跑起來看

**沒少的**：規格怎麼寫、怎麼 review AI 的產出、怎麼判斷該改哪一層、
key 為什麼只能放伺服器端、上線之後怎麼驗收 —— 今天真正要帶走的都在這裡。
