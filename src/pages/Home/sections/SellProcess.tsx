import styled from 'styled-components';

import { Container, Section } from '../../../components/common/Container';
import SectionHeader from '../../../components/common/SectionHeader';
import { SELL_STEPS } from '../../../constants/home';

export default function SellProcess() {
  return (
    <Section id="process" $tone="white">
      <Container>
        <SectionHeader eyebrow="PROCESS" title="네 단계면 판매 끝" description="신청부터 입금까지, 진행 상황을 단계마다 알려드려요." />
        <Steps>
          {SELL_STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <small>{step.meta}</small>
              </div>
            </li>
          ))}
        </Steps>
      </Container>
    </Section>
  );
}

const Steps = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  counter-reset: step;

  & > li {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* 단계 연결선 */
  & > li:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 22px;
    left: 56px;
    right: -20px;
    height: 2px;
    background: repeating-linear-gradient(90deg, ${({ theme }) => theme.colors.line} 0 6px, transparent 6px 12px);
  }

  & .number {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
    font-weight: 800;
    color: #fff;
  }

  & h3 {
    font-size: 18px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
  }

  & p {
    margin-top: 6px;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & small {
    display: inline-block;
    margin-top: 12px;
    padding: 2px 8px;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.primarySoft};
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;

    & > li {
      flex-direction: row;
      gap: 16px;
      padding-bottom: 28px;
    }

    & > li:not(:last-child)::after {
      top: 48px;
      bottom: 4px;
      left: 21px;
      right: auto;
      width: 2px;
      height: auto;
      background: repeating-linear-gradient(180deg, ${({ theme }) => theme.colors.line} 0 6px, transparent 6px 12px);
    }

    & .number { flex-shrink: 0; }
    & > li > div { padding-top: 10px; }
  }

  ${({ theme }) => theme.media.mobile} {
    & .number { width: 40px; height: 40px; font-size: 13px; }
    & > li:not(:last-child)::after { left: 19px; top: 44px; }
    & > li > div { padding-top: 8px; }
    & h3 { font-size: 16px; }
    & p { font-size: 14px; }
  }
`;
