import { ClipboardList, LogOut, MessageSquareText, Star, Tags } from 'lucide-react';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { signOutAdmin } from '../../api/auth';
import { StatusMessage } from '../../components/common/StatusMessage';
import Logo from '../../components/layout/Logo';
import { useAuthStore } from '../../stores/authStore';

const ADMIN_MENUS = [
  { to: 'requests', label: '매입신청', icon: ClipboardList },
  { to: 'inquiries', label: '매입문의', icon: MessageSquareText },
  { to: 'prices', label: '단가표', icon: Tags },
  { to: 'reviews', label: '매입후기', icon: Star },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const isReady = useAuthStore((state) => state.isReady);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const email = useAuthStore((state) => state.session?.user.email);

  // 핸들러
  const handleSignOut = async () => {
    await signOutAdmin();
    useAuthStore.setState({ session: null, isAdmin: false });
    navigate('/admin/login', { replace: true });
  };

  if (!isReady) return <StatusMessage>로그인 상태를 확인하는 중이에요.</StatusMessage>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <Shell>
      <Side>
        <div className="brand">
          <Logo $height={30} />
          <span>관리자</span>
        </div>
        <nav aria-label="관리자 메뉴">
          {ADMIN_MENUS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="account">
          <span>{email}</span>
          <button type="button" onClick={handleSignOut}>
            <LogOut size={16} aria-hidden="true" />
            로그아웃
          </button>
        </div>
      </Side>
      <Content>
        <Outlet />
      </Content>
    </Shell>
  );
}

const Shell = styled.div`
  display: grid;
  grid-template-columns: 15rem minmax(0, 1fr);
  min-height: 100dvh;

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Side = styled.aside`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  padding: 1.25rem 0.75rem;
  border-right: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surface};

  & > .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.5rem 1.25rem;
  }

  & > .brand > span {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  & > nav > a {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    height: 2.5rem;
    padding: 0 0.75rem;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
  }

  & > nav > a:hover { background: ${({ theme }) => theme.colors.background}; }

  & > nav > a.active {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }

  & > .account {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: auto;
    padding: 0.75rem 0.5rem 0;
    border-top: 1px solid ${({ theme }) => theme.colors.line};
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .account > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > .account > button {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  ${({ theme }) => theme.media.tablet} {
    z-index: 10;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.75rem;
    height: auto;
    padding: 0.625rem 1rem;
    border-right: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};

    & > .brand { padding: 0; }

    & > nav {
      order: 3;
      flex-direction: row;
      width: 100%;
      overflow-x: auto;
    }

    & > nav > a { height: 2.125rem; padding: 0 0.625rem; font-size: 0.8125rem; }
    & > nav > a > svg { display: none; }

    & > .account {
      flex-direction: row;
      align-items: center;
      margin: 0 0 0 auto;
      padding: 0;
      border-top: 0;
    }

    & > .account > span { display: none; }
  }
`;

const Content = styled.main`
  min-width: 0;
  padding: 2rem;

  ${({ theme }) => theme.media.mobile} {
    padding: 1rem;
  }
`;
