import type { ReactNode } from 'react';
import styled from 'styled-components';

import { Container } from '../../components/common/Container';

interface InquiryLayoutProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

// 매입문의 하위 페이지 공통 틀
export default function InquiryLayout({ title, description, action, children }: InquiryLayoutProps) {
  return (
    <Wrapper>
      <Container>
        <Head>
          <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
          {action}
        </Head>
        <Card>{children}</Card>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  min-height: calc(100vh - 18.75rem);
  padding: 3.5rem 0 6rem;

  ${({ theme }) => theme.media.mobile} {
    padding: 1.75rem 0 4rem;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  max-width: 55rem;
  margin: 0 auto 1.25rem;

  & h1 {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.ink};
  }

  & p {
    margin-top: 0.375rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.muted};
  }

  ${({ theme }) => theme.media.mobile} {
    & h1 { font-size: 1.375rem; }
  }
`;

const Card = styled.div`
  max-width: 55rem;
  margin: 0 auto;
  padding: 1.75rem;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};

  ${({ theme }) => theme.media.mobile} {
    padding: 1rem;
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;
