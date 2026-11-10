import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'kakao';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $block?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export default function Button({ icon, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <StyledButton type={type} {...rest}>
      {icon}
      {children}
    </StyledButton>
  );
}

const SIZE_STYLE: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`height: 32px; padding: 0 12px; font-size: 13px;`,
  md: css`height: 40px; padding: 0 16px; font-size: 14px;`,
  lg: css`height: 46px; padding: 0 20px; font-size: 15px;`,
};

const StyledButton = styled.button<Omit<ButtonProps, 'icon' | 'children'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: ${({ $block }) => ($block ? '100%' : 'auto')};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  ${({ $size = 'md' }) => SIZE_STYLE[$size]};

  ${({ theme, $variant = 'primary' }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background: ${theme.colors.surface};
          color: ${theme.colors.ink};
          border: 1px solid ${theme.colors.line};
          &:hover { border-color: ${theme.colors.subtle}; }
        `;
      case 'ghost':
        return css`
          color: ${theme.colors.text};
          &:hover { background: ${theme.colors.background}; }
        `;
      case 'kakao':
        return css`
          background: ${theme.colors.kakao};
          color: ${theme.colors.kakaoText};
          &:hover { filter: brightness(0.96); }
        `;
      default:
        return css`
          background: ${theme.colors.primary};
          color: #fff;
          &:hover { background: ${theme.colors.primaryHover}; }
        `;
    }
  }}

  &:active { transform: translateY(1px); }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;
