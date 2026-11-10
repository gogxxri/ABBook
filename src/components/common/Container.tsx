import styled from 'styled-components';

// 페이지 공통 최대 폭·좌우 여백
export const Container = styled.div`
  width: 100%;
  max-width: calc(${({ theme }) => theme.layout.maxWidth} + 48px);
  margin: 0 auto;
  padding: 0 24px;

  ${({ theme }) => theme.media.mobile} {
    padding: 0 16px;
  }
`;

// 섹션 공통 상하 여백
export const Section = styled.section<{ $tone?: 'default' | 'white' }>`
  padding: 96px 0;
  background: ${({ theme, $tone }) => ($tone === 'white' ? theme.colors.surface : 'transparent')};

  ${({ theme }) => theme.media.tablet} {
    padding: 72px 0;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 56px 0;
  }
`;
