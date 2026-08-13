// 這支檔案集中管理「怎麼連上 Supabase」
//
// 為什麼獨立出來一個檔案：等一下登入頁、主頁都需要用到 Supabase，
// 讓大家都從這裡 import，換帳號設定時只要改這一個地方

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ⚠️ 這裡用的是 anon/public key，設計上本來就會出現在前端（瀏覽器看得到）
// 真正擋住別人資料的是資料庫那邊的 RLS（Row Level Security），不是這把 key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
