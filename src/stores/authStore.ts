import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import { checkIsAdmin } from '../api/auth';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  isAdmin: boolean;
  isReady: boolean; // 최초 세션 확인 완료 여부
  init: () => () => void;
}

// 세션 변경 시 관리자 여부 재확인
const resolveAdmin = async (session: Session | null) => {
  if (!session) return false;
  try {
    return await checkIsAdmin();
  } catch {
    return false;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isAdmin: false,
  isReady: false,

  init: () => {
    if (!isSupabaseConfigured) {
      set({ isReady: true });
      return () => undefined;
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // 콜백 안에서 Supabase 호출 시 교착을 피하기 위해 다음 틱에서 처리
      setTimeout(async () => {
        const isAdmin = await resolveAdmin(session);
        set({ session, isAdmin, isReady: true });
      }, 0);
    });

    return () => data.subscription.unsubscribe();
  },
}));
