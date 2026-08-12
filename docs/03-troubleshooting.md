# 卡住了看這裡

按「你看到什麼」找，不是按「你以為是什麼問題」找。

---

## Vercel 部署失敗

### 部署顯示成功，但打開網址是 `404: NOT_FOUND`

**這是最常見的一個，而且它不會報錯 —— 所以最難查。**

**原因**：Root Directory 沒設成 `starter-kit`。Vercel 在 repo 根目錄找不到網站，
就把根目錄當一堆靜態檔案部署掉，然後跟你說成功。

**修**：Vercel 專案 → **Settings** → **General** → **Root Directory** → 填 `starter-kit` →
存檔 → 回 **Deployments** → 最新那筆右邊 **⋯** → **Redeploy**。

> 實測過：設錯的時候 CLI 跟畫面都顯示 Production 部署完成、也給你網址，
> 打開卻是一頁純文字的 `NOT_FOUND`。**部署成功不等於網站活著** ——
> 這跟「AI 說它做好了不等於它做對了」是同一件事，只是換到基礎設施這一層。

### `Command "npm install" exited with 254`

同一個原因（Root Directory 沒設對），只是這次它在安裝階段就死了 ——
根目錄沒有 `package.json`，`npm install` 無事可做而報錯。

修法同上。

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

## Codex 說我到使用上限了

ChatGPT **免費方案的 Codex 大約每天 10 個 task**（一個 task = 它完整跑一輪：讀你的專案、改檔、開 PR），
而且本機與雲端共用同一個五小時窗口。反覆試錯很容易在一個下午用完。

**省著用的方法**：一次講清楚一件事（見下面「一次只改一件事」），
不要用「幫我看看哪裡怪」這種讓它到處翻的問法 —— 那也算一個 task。

### Plan B：不用 Codex 也能改（完全沒有 task 限制）

改用**普通對話** + **GitHub 網頁編輯**，一樣不必安裝任何東西：

1. 打開 [chatgpt.com](https://chatgpt.com) 或 [claude.ai](https://claude.ai) 開一般對話（不是 Codex）
2. 貼上你要改的那個檔案**全文** + 你的需求，請它「回我完整的檔案內容，不要只給片段」
3. 複製它給的完整內容
4. 回到你的 GitHub repo → 點進 `starter-kit/app/page.jsx` → 右上角鉛筆 ✏️
5. 全選原本的內容、貼上新的 → 頁面最下面 **Commit changes**
6. Vercel 會自動重新部署，30 秒後重新整理你的網址

> 這條路唯一的差別是「它看不到你的專案，所以你要自己把檔案貼給它」。
> 普通對話的額度比 Codex task 寬鬆得多，撞到上限就走這條。

---

## AI 回「Groq 回了 429」

**免費方案每把 key**：每分鐘 30 次請求、**每分鐘 12,000 tokens**、每天 100,000 tokens。

一次問答大約用掉 1,400 tokens，所以**一分鐘內連打 8 次以上就會撞到**。
自己操作不會這麼快，會撞到通常是：

- 連續猛按送出 → 等 60 秒就好
- 很多人同時打**同一個網站**（例如大家一起去打講師的示範網址）→ 那把 key 是共用的，會一起卡

**修法**：等一分鐘。不是你的 code 壞了，也不用改任何東西。

> 每個人用自己的 key，額度就是自己的 —— 這也是為什麼一開始要你各自申請一把。

---

## 接了 Supabase 之後：存進去了但讀不回來

九成是 **RLS**（Row Level Security）。它是 Supabase 的權限機制，**預設是關的**，
而你一旦打開、卻沒寫規則，就會變成「全部擋住」。

三種症狀對應三種狀況：

| 你看到 | 實際狀況 | 怎麼修 |
|---|---|---|
| 寫得進去、讀回來是空陣列 `[]` | RLS 開了，但沒有 select 的 policy | 加一條 select policy |
| `new row violates row-level security policy` | RLS 開了，但沒有 insert 的 policy | 加一條 insert policy |
| 什麼都正常，讀寫都通 | 🔴 **RLS 沒開** —— 這不是好事，見下面 | 立刻開起來 |

在 Supabase 後台 → **SQL Editor** 跑：

```sql
-- 建完表就該跑這行
alter table history enable row level security;

-- 然後至少給一條規則，否則連你自己也讀不到
create policy "允許寫入" on history
  for insert to anon with check (true);

create policy "允許讀取" on history
  for select to anon using (true);
```

> ⚠️ 上面這兩條 policy 是「**誰都可以讀、誰都可以寫**」——
> 對今天的練習夠用，但那表示任何人都能看到別人存的東西。
> 真的要分使用者，policy 要改成比對 `auth.uid()`，那需要先做登入。

### 🔴 為什麼「都正常」反而是問題

你的 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 開頭是 `NEXT_PUBLIC_` —— 它在前端，
**任何人打開瀏覽器的原始碼就看得到**。這是 Supabase 的設計，不是你設錯。

所以安全邊界不在那把 key，而在 RLS。沒開 RLS 的意思是：
拿到你網址的人可以讀走整張表、也可以清空它。

**驗證方法**：開一個無痕視窗（沒有你的登入狀態），試著讀你的資料。
讀得到 = RLS 沒生效。

---

## ⚠️ 你剛把一個「能花你錢的東西」放到公開網路上

這不是錯誤，是你該知道的事實。

你的網址是**公開的**。任何拿到它的人都能打開、按送出 —— 用的是**你的** Groq key。

今天這樣沒問題（10 個人的課、額度是免費的、用完就用完）。
但如果你把網址貼到社群、或這個專案以後真的要給不特定的人用，就要處理。

**這支 API 現在只有一道防線**：一次最多 4000 字（`route.js` 的 `MAX_INPUT_CHARS`）。
它擋掉「有人貼 10 萬字一次燒掉你額度」，但擋不掉「有人寫程式一秒打 100 次」。

**真的要對外開放，最少要加這三樣**（今天不做，但你該記住名字）：

| 要加什麼 | 它擋掉什麼 |
|---|---|
| **限流** rate limit | 同一個人一分鐘打幾百次 |
| **認證** auth | 不特定的人隨便用 |
| **用量上限** quota | 一天最多花多少，超過就停 |

> 這三個字之後你在職場上會一直聽到。今天先知道「為什麼需要它們」就夠了 ——
> 因為你剛親手做了一個沒有它們的東西，而且它現在真的活在網路上。

---

## 一般原則

**看到錯誤訊息，先全部複製下來再問。**
只講「它壞了」，AI 只能猜；貼完整錯誤訊息，它一次就修對。

**不確定改壞了什麼 → 回上一版。** 版本控制的整個意義就是讓你敢改。

**現場卡超過 5 分鐘 → 舉手。** 今天只有 10 個人，講師走過去看比你自己卡半小時快。
