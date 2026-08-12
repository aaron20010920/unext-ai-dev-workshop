# 卡住了看這裡

按「你看到什麼」找，不是按「你以為是什麼問題」找。

---

## Vercel 部署失敗

### `No Next.js version detected` / `Couldn't find package.json`

**原因**：Root Directory 沒設成 `starter-kit`。

**修**：Vercel 專案 → **Settings** → **General** → **Root Directory** → 改成 `starter-kit` →
存檔 → 回 **Deployments** → 最新那筆右邊 **⋯** → **Redeploy**。

> 這是最常見的一個，九成的部署失敗都是它。

### `Module not found` / build 中途紅字

**原因**：Codex 改 code 時裝了一個沒安裝的套件，或改壞了語法。

**修**：把 Vercel 那一大段紅字**全部**複製（不要只複製最後一行），
用 [`02-prompts.md`](02-prompts.md) 的 **Prompt 9** 貼給 AI。

修不好就用 **Prompt 8** 還原到上一版。

---

## 網站打得開，但按送出出錯

### 「還沒設定 GROQ_API_KEY」

三種可能，依序檢查：

1. **環境變數沒加**：Vercel → Settings → Environment Variables → 有沒有 `GROQ_API_KEY`
2. **名字打錯**：必須一字不差 `GROQ_API_KEY`（全大寫、底線、沒有空格）
3. 🔴 **加了但沒重新部署**：環境變數不會自動生效。加完一定要 **Redeploy** 一次

> 第 3 點最容易漏 — 加完覺得應該好了，其實還在跑舊的那版。

### 「Groq 回了 401」

key 本身有問題：貼的時候少了字、複製到空白、或這把 key 被刪了。

**修**：回 [console.groq.com](https://console.groq.com) → API Keys → **Create API Key**
產一把新的 → 回 Vercel 換掉 → **Redeploy**。

### 「Groq 回了 403」

`User-Agent` 那行被拿掉了（`route.js` 裡面那行有註解說不能刪）。

**修**：用 Prompt 8 還原，或請 AI 把那行加回去：

```
starter-kit/app/api/ai/route.js 的 fetch headers 裡
要有 'User-Agent': 'unext-ai-dev-workshop/1.0' 這一行，
幫我加回去。其他不要動。
```

### 「Groq 回了 429」

太多人同時打（現場 20 個人）或你連續按太快。

**修**：等 30 秒再試。不是你的 code 壞了。

### 轉圈圈很久然後沒反應

AI 在想（有時要 10-20 秒），或網路慢。

> ⚠️ 8/13 下午 **14:30–15:00** 全國有網路降速演習，那半小時網路會很慢。
> 那段時間的課程設計成不需要連網，不要在那時候硬試。

---

## Codex 相關

### 它一次改了五個檔，我不知道它改了什麼

**預防**：用 Prompt 5，裡面有「先複述再動手」和「一次只改這兩個檔」。

**已經發生**：不要接受那個 PR。到 GitHub 的 PR 頁面 → **Close pull request** →
重新用 Prompt 6 一次講一件事。

### 它說改好了，但網站沒變

檢查這條鏈，看斷在哪：

1. Codex 開的 PR **merge 了嗎**（沒 merge = 沒進你的 repo）
2. GitHub 的 **Actions** 那個勾勾是綠的嗎（紅叉 = build 壞了）
3. Vercel 的 **Deployments** 最上面那筆是不是 Ready、時間是不是剛剛
4. 瀏覽器**強制重新整理**（Mac：Cmd+Shift+R）

### 它越改越壞

停。不要再叫它修。

用 Prompt 8 還原，或到 GitHub → **Commits** → 找最後一個綠勾的 commit →
**⋯** → **Revert**。

> 「叫 AI 修它自己改壞的東西」是今天最貴的坑 — 它會一直加東西來補，
> 每次都更複雜、更難救。回上一版重講一次，五分鐘就解決。

---

## GitHub 相關

### Actions 那裡是紅叉

點進去看紅字那一段，複製，用 Prompt 9 問 AI。

**紅叉的意思**：這份 code build 不起來 → Vercel 也一定會失敗。
先修好再管網站。

### 我 fork 的 repo 看不到 Actions 在跑

Fork 過來的 repo，GitHub 預設會停用 Actions。

**修**：你的 repo → **Actions** 分頁 → 如果有一個綠色按鈕
「I understand my workflows, go ahead and enable them」→ 點它。

---

## 一般原則

**看到錯誤訊息，先全部複製下來再問。**
只講「它壞了」，AI 只能猜；貼完整錯誤訊息，它一次就修對。

**不確定改壞了什麼 → 回上一版。** 版本控制的整個意義就是讓你敢改。

**現場卡超過 5 分鐘 → 舉手。** 今天只有 10 個人，講師走過去看比你自己卡半小時快。
