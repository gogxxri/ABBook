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
  sm: css`height: 2rem; padding: 0 0.75rem; font-size: 0.8125rem;`,
  md: css`height: 2.5rem; padding: 0 1rem; font-size: 0.875rem;`,
  lg: css`height: 2.875rem; padding: 0 1.25rem; font-size: 0.9375rem;`,
};

const StyledButton = styled.button<Omit<ButtonProps, 'icon' | 'children'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
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
