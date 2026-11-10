import styled, { css } from 'styled-components';

type ChipTone = 'primary' | 'warning' | 'neutral';

// 상태·라벨 표시용 칩
const Chip = styled.span<{ $tone?: ChipTone }>`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  height: 26px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12px;
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
