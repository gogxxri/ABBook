import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}

// 라벨 + 입력 요소 묶음
export function Field({ label, htmlFor, required, hint, children }: FieldProps) {
  return (
    <FieldWrapper>
      <label htmlFor={htmlFor}>
        {label}
        {required && <em aria-hidden="true">*</em>}
      </label>
      {children}
      {hint && <small>{hint}</small>}
    </FieldWrapper>
  );
}

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;

  & > label {
    font-size: 0.875rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > label > em {
    margin-left: 2px;
    font-style: normal;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > small {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const controlStyle = css`
  width: 100%;
  min-width: 0;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.ink};

  &::placeholder { color: ${({ theme }) => theme.colors.subtle}; }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }

  &:disabled { background: ${({ theme }) => theme.colors.background}; }
`;

export const Input = styled.input<InputHTMLAttributes<HTMLInputElement>>`
  ${controlStyle};
  height: 2.5rem;
  padding: 0 0.75rem;
`;

export const Textarea = styled.textarea<TextareaHTMLAttributes<HTMLTextAreaElement>>`
  ${controlStyle};
  min-height: 7.5rem;
  padding: 0.625rem 0.75rem;
  line-height: 1.6;
  resize: vertical;
`;

export const Select = styled.select<SelectHTMLAttributes<HTMLSelectElement>>`
  ${controlStyle};
  height: 2.5rem;
  padding: 0 2rem 0 0.75rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236B7280' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.625rem center;
`;

// 폼 에러 메시지
export const FormError = styled.p`
  padding: 0.625rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: #FEF2F2;
  font-size: 0.8125rem;
  color: #B91C1C;
`;
