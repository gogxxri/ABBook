import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/Home';
import InquiryDetailPage from './pages/Inquiries/InquiryDetailPage';
import InquiryListPage from './pages/Inquiries/InquiryListPage';
import InquiryWritePage from './pages/Inquiries/InquiryWritePage';
import { useAuthStore } from './stores/authStore';

// 관리자 화면은 일반 사용자 번들에서 분리
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const AdminLoginPage = lazy(() => import('./pages/Admin/AdminLoginPage'));
const AdminRequestsPage = lazy(() => import('./pages/Admin/AdminRequestsPage'));
const AdminInquiriesPage = lazy(() => import('./pages/Admin/AdminInquiriesPage'));
const AdminPricesPage = lazy(() => import('./pages/Admin/AdminPricesPage'));
const AdminReviewsPage = lazy(() => import('./pages/Admin/AdminReviewsPage'));

export default function App() {
  const initAuth = useAuthStore((state) => state.init);

  // 관리자 세션 구독
  useEffect(() => initAuth(), [initAuth]);

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="inquiries" element={<InquiryListPage />} />
          <Route path="inquiries/new" element={<InquiryWritePage />} />
          <Route path="inquiries/:id" element={<InquiryDetailPage />} />
        </Route>

        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="requests" replace />} />
          <Route path="requests" element={<AdminRequestsPage />} />
          <Route path="inquiries" element={<AdminInquiriesPage />} />
          <Route path="prices" element={<AdminPricesPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
