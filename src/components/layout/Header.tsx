import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import styled from 'styled-components';

import { Container } from '../common/Container';
import Logo from './Logo';
import { COMPANY_INFO, NAV_ITEMS } from '../../constants/home';

export default function Header() {
  // 상태
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // 모바일 메뉴 드로어 노출

  // 드로어 열림 동안 배경 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!isDrawerOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  // 핸들러
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <Bar>
        <Inner>
          <Logo />
          <Nav aria-label="주요 메뉴">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </Nav>
          <Actions>
            <a href={`tel:${COMPANY_INFO.phone}`} className="phone">
              <Phone size={16} aria-hidden="true" />
              {COMPANY_INFO.phone}
            </a>
            <MenuButton type="button" aria-label="메뉴 열기" aria-expanded={isDrawerOpen} onClick={() => setIsDrawerOpen(true)}>
              <Menu size={22} />
            </MenuButton>
          </Actions>
        </Inner>
      </Bar>

      <Dim $open={isDrawerOpen} onClick={closeDrawer} aria-hidden="true" />
      <Drawer $open={isDrawerOpen} aria-label="전체 메뉴" aria-hidden={!isDrawerOpen}>
        <DrawerHead>
          <Logo />
          <MenuButton type="button" aria-label="메뉴 닫기" onClick={closeDrawer}>
            <X size={22} />
          </MenuButton>
        </DrawerHead>
        <DrawerNav>
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={closeDrawer} tabIndex={isDrawerOpen ? 0 : -1}>
              {item.label}
            </a>
          ))}
        </DrawerNav>
        <DrawerFoot>
          <p>
            고객센터 <a href={`tel:${COMPANY_INFO.phone}`}>{COMPANY_INFO.phone}</a>
            <br />
            {COMPANY_INFO.hours}
          </p>
        </DrawerFoot>
      </Drawer>
    </>
  );
}

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
`;

const Inner = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: ${({ theme }) => theme.layout.headerHeight};
`;

const Nav = styled.nav`
  display: flex;
  gap: 28px;

  & > a {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    transition: color 0.15s ease;
  }

  & > a:hover { color: ${({ theme }) => theme.colors.primary}; }

  ${({ theme }) => theme.media.tablet} {
    display: none;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & > .phone {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-right: 8px;
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.ink};
    white-space: nowrap;
  }

  ${({ theme }) => theme.media.mobile} {
    & > .phone { display: none; }
  }
`;

const MenuButton = styled.button`
  display: none;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.ink};

  &:hover { background: ${({ theme }) => theme.colors.background}; }

  ${({ theme }) => theme.media.tablet} {
    display: grid;
  }
`;

const Dim = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(17, 24, 39, 0.45);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 0.2s ease;
`;

const Drawer = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  width: min(360px, 100%);
  background: ${({ theme }) => theme.colors.surface};
  transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transition: transform 0.25s ease, visibility 0.25s;
`;

const DrawerHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.layout.headerHeight};
  padding: 0 16px 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  & > button { display: grid; }
`;

const DrawerNav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px;

  & > a {
    display: block;
    padding: 14px 12px;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: 17px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > a:hover { background: ${({ theme }) => theme.colors.background}; }
`;

const DrawerFoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};

  & > p {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > p > a {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.ink};
  }
`;
