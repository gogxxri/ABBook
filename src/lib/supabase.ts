import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// .env 설정 여부 (미설정 시 화면에서 안내)
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl ?? 'http://localhost', supabaseAnonKey ?? 'missing-key', {
  auth: { persistSession: true, autoRefreshToken: true },
});

// Supabase 에러를 사용자 메시지로 변환
export const toErrorMessage = (error: unknown) => {
  if (!isSupabaseConfigured) return 'Supabase 환경변수(.env)가 설정되지 않았어요.';
  if (error && typeof error === 'object' && 'message' in error) return String(error.message);
  return '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.';
};
