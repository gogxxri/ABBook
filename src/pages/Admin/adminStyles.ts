import styled from 'styled-components';

// 관리자 페이지 상단 (제목 + 액션)
export const PageHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  & > h1 {
    font-size: 1.375rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
  }

  ${({ theme }) => theme.media.mobile} {
    & > h1 { font-size: 1.1875rem; }
  }
`;

// 상태 필터 탭
export const FilterTabs = styled.div`
  display: flex;
  gap: 0.375rem;
  margin-bottom: 1rem;
  overflow-x: auto;

  & > button {
    flex-shrink: 0;
    height: 2rem;
    padding: 0 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.surface};
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  & > button[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.colors.ink};
    background: ${({ theme }) => theme.colors.ink};
    color: #fff;
  }
`;

// 목록 카드 묶음
export const ListCard = styled.ul`
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;

  & > li + li { border-top: 1px solid ${({ theme }) => theme.colors.line}; }
`;

// 목록 한 줄 (클릭 가능한 버튼)
export const ListButton = styled.button`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  text-align: left;

  &:hover { background: ${({ theme }) => theme.colors.background}; }

  & > div { min-width: 0; }

  & > div > strong {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > div > p {
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > time, & > span.side {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.subtle};
    white-space: nowrap;
  }

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: auto minmax(0, 1fr);
    padding: 0.75rem;

    & > time, & > span.side { grid-column: 2; }
  }
`;

// 상세 모달 내 정보 목록
export const InfoList = styled.dl`
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr);
  gap: 0.625rem 0.75rem;
  font-size: 0.875rem;

  & > dt { color: ${({ theme }) => theme.colors.muted}; }

  & > dd {
    min-width: 0;
    color: ${({ theme }) => theme.colors.ink};
    white-space: pre-wrap;
    word-break: break-all;
  }

  & a {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }
`;
