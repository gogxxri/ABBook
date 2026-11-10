import type { ReactNode } from 'react';
import styled from 'styled-components';

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export default function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <Wrapper>
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2.5rem;

  & > div > span {
    display: block;
    margin-bottom: 0.625rem;
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > div > h2 {
    font-size: 2.125rem;
    line-height: 1.3;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > div > p {
    margin-top: 0.75rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.muted};
  }

  ${({ theme }) => theme.media.mobile} {
    margin-bottom: 1.75rem;

    & > div > h2 { font-size: 1.5rem; }
    & > div > p { font-size: 0.9375rem; }
  }
`;
