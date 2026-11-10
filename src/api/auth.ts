import { supabase } from '../lib/supabase';

export const signInAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
};

export const signOutAdmin = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// admins 테이블 등록 여부로 관리자 판별
export const checkIsAdmin = async () => {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) throw error;
  return Boolean(data);
};
