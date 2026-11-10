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
  gap: 16px;
  margin-bottom: 40px;

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
