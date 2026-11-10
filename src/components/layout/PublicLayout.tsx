import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import FloatingContact from './FloatingContact';
import Footer from './Footer';
import Header from './Header';

export default function PublicLayout() {
  const { pathname, hash } = useLocation();

  // 라우트 이동 시 해시 위치 또는 최상단으로 스크롤
  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div id="top">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
