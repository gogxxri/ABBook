import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import App from './App.tsx';
import Toast from './components/common/Toast.tsx';
import { toErrorMessage } from './lib/supabase.ts';
import { toast } from './stores/toastStore.ts';
import { GlobalStyle } from './styles/GlobalStyle.ts';
import { theme } from './styles/theme.ts';

// 서버 에러는 전역 토스트로 표시 (화면별 중복 표시 금지)
const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: (error) => toast.error(toErrorMessage(error)) }),
  mutationCache: new MutationCache({ onError: (error) => toast.error(toErrorMessage(error)) }),
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 30, refetchOnWindowFocus: false },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
          <Toast />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
