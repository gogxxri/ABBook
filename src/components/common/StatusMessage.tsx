import styled from 'styled-components';

// 로딩·빈 목록 안내 문구
export const StatusMessage = styled.p`
  padding: 1.75rem 0.75rem;
  font-size: 0.875rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;
