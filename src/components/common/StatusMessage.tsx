import styled from 'styled-components';

// 로딩·빈 목록 안내 문구
export const StatusMessage = styled.p`
  padding: 28px 12px;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;
