import { create } from 'zustand';

type ToastTone = 'success' | 'error';

interface ToastState {
  message: string | null;
  tone: ToastTone;
  show: (message: string, tone?: ToastTone) => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

// 화면 어디서든 띄우는 전역 토스트
export const useToastStore = create<ToastState>((set) => ({
  message: null,
  tone: 'success',
  show: (message, tone = 'success') => {
    clearTimeout(timer);
    set({ message, tone });
    timer = setTimeout(() => set({ message: null }), 2600);
  },
}));

export const toast = {
  success: (message: string) => useToastStore.getState().show(message, 'success'),
  error: (message: string) => useToastStore.getState().show(message, 'error'),
};
