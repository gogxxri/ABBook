import styled from 'styled-components';

// 페이지 공통 최대 폭·좌우 여백
export const Container = styled.div`
  width: 100%;
  max-width: calc(${({ theme }) => theme.layout.maxWidth} + 3rem);
  margin: 0 auto;
  padding: 0 1.5rem;

  ${({ theme }) => theme.media.mobile} {
    padding: 0 1rem;
  }
`;

// 섹션 공통 상하 여백
export const Section = styled.section<{ $tone?: 'default' | 'white' }>`
  padding: 6rem 0;
  background: ${({ theme, $tone }) => ($tone === 'white' ? theme.colors.surface : 'transparent')};

  ${({ theme }) => theme.media.tablet} {
    padding: 4.5rem 0;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 3.5rem 0;
  }
`;
