import type { ReactNode } from 'react';
import styled from 'styled-components';

import { useInView } from '../../hooks/useInView';

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export default function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  const { ref, isInView } = useInView<HTMLElement>(0.2); // 화면 진입 시 페이드업

  return (
    <Wrapper ref={ref} $visible={isInView}>
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </Wrapper>
  );
}

const Wrapper = styled.header<{ $visible: boolean }>`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 40px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? 0 : 16)}px);
  transition: opacity 0.6s ease, transform 0.6s ease;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }

  & > div > span {
    display: block;
    margin-bottom: 10px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > div > h2 {
    font-size: 34px;
    line-height: 1.3;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > div > p {
    margin-top: 12px;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.muted};
  }

  ${({ theme }) => theme.media.mobile} {
    margin-bottom: 28px;

    & > div > h2 { font-size: 24px; }
    & > div > p { font-size: 15px; }
  }
`;
