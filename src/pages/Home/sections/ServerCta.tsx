import { Check, Server } from 'lucide-react';
import styled from 'styled-components';

import Button from '../../../components/common/Button';
import { Container } from '../../../components/common/Container';
import { SERVER_FEATURES } from '../../../constants/home';

export default function ServerCta() {
  return (
    <Container>
      <Banner>
        <div className="copy">
          <span className="icon">
            <Server size={24} aria-hidden="true" />
          </span>
          <h2>서버·전산 장비, 한 번에 정리하세요</h2>
          <p>실사부터 반출, 데이터 파기까지 전담 매니저가 처리합니다.</p>
          <ul>
            {SERVER_FEATURES.map((feature) => (
              <li key={feature}>
                <Check size={16} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <Button $size="lg">서버 매입 견적 요청</Button>
      </Banner>
    </Container>
  );
}

const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 48px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: linear-gradient(135deg, #0A43C2 0%, #062C82 100%);
  color: #fff;

  & .icon {
    display: inline-grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.radius.md};
    background: rgba(255, 255, 255, 0.14);
  }

  & h2 {
    margin-top: 20px;
    font-size: 28px;
    line-height: 1.35;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  & p {
    margin-top: 8px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
  }

  & ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    margin-top: 20px;
  }

  & li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
  }

  & > button {
    flex-shrink: 0;
    background: #fff;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > button:hover { background: ${({ theme }) => theme.colors.primarySoft}; }

  ${({ theme }) => theme.media.tablet} {
    flex-direction: column;
    align-items: stretch;
  }

  ${({ theme }) => theme.media.mobile} {
    gap: 24px;
    padding: 28px 20px;
    border-radius: ${({ theme }) => theme.radius.md};

    & .icon { width: 40px; height: 40px; }
    & h2 { margin-top: 16px; font-size: 21px; }
    & p { font-size: 14px; }
    & ul { flex-direction: column; margin-top: 16px; }
    & li { font-size: 13px; }
  }
`;
