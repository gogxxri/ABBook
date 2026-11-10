import styled, { css } from 'styled-components';

type ChipTone = 'primary' | 'warning' | 'neutral';

// 상태·라벨 표시용 칩
const Chip = styled.span<{ $tone?: ChipTone }>`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  height: 1.625rem;
  padding: 0 0.625rem;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;

  ${({ theme, $tone = 'neutral' }) => {
    if ($tone === 'primary') {
      return css`background: ${theme.colors.primarySoft}; color: ${theme.colors.primary};`;
    }
    if ($tone === 'warning') {
      return css`background: ${theme.colors.warningSoft}; color: ${theme.colors.warning};`;
    }
    return css`background: ${theme.colors.background}; color: ${theme.colors.muted};`;
  }}
`;

export default Chip;
