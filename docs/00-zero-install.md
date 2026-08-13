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

## 步驟 3 — 改東西

你已經有一個能動的網站了。要改它，用**任何免費對話**都可以：
ChatGPT、Claude、Gemini。

它看不到你的專案，所以你要把檔案貼給它：

```
這是我專案裡的一個檔案，路徑是 ＿＿＿＿，內容如下：

（把整個檔案貼上）

我要改成：＿＿＿＿＿＿＿

請回我「完整的檔案內容」，不要只給片段，也不要省略沒改到的部分。
```

拿到它回的內容之後：

1. 回到你的 GitHub repo → 點進那個檔案
2. 右上角鉛筆 ✏️ → 全選原本的內容 → 貼上新的
3. 頁面最下面 **Commit changes**
4. Vercel 會自己重新部署，約 30 秒後重新整理你的網址

**想改什麼 → 貼哪個檔**

| 你想改 | 貼這個檔給它 |
|---|---|
| 畫面上的字、按鈕、顏色 | `starter-kit/app/page.jsx` |
| AI 回答的內容、格式、語氣 | `starter-kit/app/api/ai/route.js` |

---

## 這條路少了什麼（老實說）

- AI 不會直接動你的檔案，所以每次改都要複製貼上一輪
- 沒有本機環境，不能在自己電腦先跑起來看

**沒少的**：規格怎麼寫、怎麼 review AI 的產出、怎麼判斷該改哪一層、
key 為什麼只能放伺服器端、上線之後怎麼驗收 —— 今天真正要帶走的都在這裡。
