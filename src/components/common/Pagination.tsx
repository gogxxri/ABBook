import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

interface PaginationProps {
  page: number; // 1부터 시작
  totalPages: number;
  onChange: (page: number) => void;
}

const VISIBLE_COUNT = 5;

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // 현재 페이지 기준 노출 범위
  const start = Math.max(1, Math.min(page - Math.floor(VISIBLE_COUNT / 2), totalPages - VISIBLE_COUNT + 1));
  const pages = Array.from({ length: Math.min(VISIBLE_COUNT, totalPages) }, (_, index) => start + index);

  return (
    <Nav aria-label="페이지">
      <button type="button" aria-label="이전 페이지" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} />
      </button>
      {pages.map((item) => (
        <button key={item} type="button" aria-current={item === page ? 'page' : undefined} onClick={() => onChange(item)}>
          {item}
        </button>
      ))}
      <button type="button" aria-label="다음 페이지" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <ChevronRight size={16} />
      </button>
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 1.5rem;

  & > button {
    display: grid;
    place-items: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.375rem;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  & > button:hover:not(:disabled) { background: ${({ theme }) => theme.colors.background}; }
  & > button:disabled { opacity: 0.35; cursor: not-allowed; }

  & > button[aria-current='page'] {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;
