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
  grid-template-columns: 240px minmax(0, 1fr);
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
  padding: 20px 12px;
  border-right: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surface};

  & > .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px 20px;
  }

  & > .brand > span {
    font-size: 12px;
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
    gap: 10px;
    height: 40px;
    padding: 0 12px;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: 14px;
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
    gap: 8px;
    margin-top: auto;
    padding: 12px 8px 0;
    border-top: 1px solid ${({ theme }) => theme.colors.line};
    font-size: 12px;
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
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  ${({ theme }) => theme.media.tablet} {
    z-index: 10;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    height: auto;
    padding: 10px 16px;
    border-right: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};

    & > .brand { padding: 0; }

    & > nav {
      order: 3;
      flex-direction: row;
      width: 100%;
      overflow-x: auto;
    }

    & > nav > a { height: 34px; padding: 0 10px; font-size: 13px; }
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
  padding: 32px;

  ${({ theme }) => theme.media.mobile} {
    padding: 16px;
  }
`;
