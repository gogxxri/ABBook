import styled from 'styled-components';

import { Container } from '../../../components/common/Container';
import { TRUST_STATS } from '../../../constants/home';
import { formatNumber } from '../../../utils/format';

export default function TrustStats() {
  return (
    <Wrapper aria-label="거래 실적">
      <Container>
        <Inner>
          <div className="title">
            <span>TRUST</span>
            <h2>
              숫자로 증명하는
              <br />
              IT기기 매입 파트너
            </h2>
          </div>
          <dl>
            {TRUST_STATS.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>
                  {formatNumber(stat.value)}
                  <small>{stat.unit}</small>
                </dd>
              </div>
            ))}
          </dl>
        </Inner>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  background: ${({ theme }) => theme.colors.dark};
  color: #fff;
`;

const Inner = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  align-items: center;
  gap: 48px;
  padding: 72px 0;

  & > .title > span {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #8DB0FF;
  }

  & > .title > h2 {
    margin-top: 10px;
    font-size: 28px;
    line-height: 1.35;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  & > dl {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  & > dl > div {
    padding: 0 28px;
    border-left: 1px solid rgba(255, 255, 255, 0.12);
  }

  & dt {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }

  & dd {
    margin-top: 8px;
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  & dd > small {
    margin-left: 4px;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
  }

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
    padding: 56px 0;

    & > dl > div:first-child { padding-left: 0; border-left: 0; }
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 44px 0;

    & > .title > h2 { font-size: 22px; }

    & > dl { grid-template-columns: minmax(0, 1fr); gap: 0; }

    & > dl > div {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 0;
      border-left: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
    }

    & dd { margin-top: 0; font-size: 22px; }
    & dd > small { font-size: 13px; }
  }
`;
