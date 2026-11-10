import styled from 'styled-components';

// 관리자 페이지 상단 (제목 + 액션)
export const PageHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;

  & > h1 {
    font-size: 22px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
  }

  ${({ theme }) => theme.media.mobile} {
    & > h1 { font-size: 19px; }
  }
`;

// 상태 필터 탭
export const FilterTabs = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  overflow-x: auto;

  & > button {
    flex-shrink: 0;
    height: 32px;
    padding: 0 12px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.surface};
    font-size: 13px;
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
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  text-align: left;

  &:hover { background: ${({ theme }) => theme.colors.background}; }

  & > div { min-width: 0; }

  & > div > strong {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > div > p {
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > time, & > span.side {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.subtle};
    white-space: nowrap;
  }

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: auto minmax(0, 1fr);
    padding: 12px;

    & > time, & > span.side { grid-column: 2; }
  }
`;

// 상세 모달 내 정보 목록
export const InfoList = styled.dl`
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 10px 12px;
  font-size: 14px;

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
