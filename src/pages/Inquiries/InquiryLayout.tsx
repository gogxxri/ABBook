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
  min-height: calc(100vh - 300px);
  padding: 56px 0 96px;

  ${({ theme }) => theme.media.mobile} {
    padding: 28px 0 64px;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  max-width: 880px;
  margin: 0 auto 20px;

  & h1 {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.ink};
  }

  & p {
    margin-top: 6px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.muted};
  }

  ${({ theme }) => theme.media.mobile} {
    & h1 { font-size: 22px; }
  }
`;

const Card = styled.div`
  max-width: 880px;
  margin: 0 auto;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};

  ${({ theme }) => theme.media.mobile} {
    padding: 16px;
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;
