import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';

import { Container, Section } from '../../../components/common/Container';
import SectionHeader from '../../../components/common/SectionHeader';
import { SELL_STEPS } from '../../../constants/home';
import { useInView } from '../../../hooks/useInView';

// 단계별 색칠 간격(ms)
const STEP_DELAY = 450;

export default function SellProcess() {
  const { ref, isInView } = useInView<HTMLOListElement>({ threshold: 0.4, once: false }); // 화면에 들어올 때마다 순차 색칠

  return (
    <Section id="process" $tone="white">
      <Container>
        <SectionHeader eyebrow="PROCESS" title="네 단계면 판매 끝" description="신청부터 입금까지, 진행 상황을 단계마다 알려드려요." />
        <Steps ref={ref} $active={isInView}>
          {SELL_STEPS.map((step, index) => (
            <li key={step.title} style={{ '--step-delay': `${index * STEP_DELAY}ms` } as CSSProperties}>
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

// 진입 시에만 지연 transition 적용 → 화면을 벗어나면 즉시 초기화
const activeStyle = css`
  & > li:not(:last-child)::before {
    transition: transform ${STEP_DELAY}ms ease calc(var(--step-delay) + 250ms);
  }

  & .number {
    transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
    transition-delay: var(--step-delay);
  }

  & h3 { transition: color 0.3s ease var(--step-delay); }

  & small { transition: background 0.3s ease var(--step-delay), color 0.3s ease var(--step-delay); }

  & .number {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }

  & > li:not(:last-child)::before { transform: scale(1); }

  & h3 { color: ${({ theme }) => theme.colors.ink}; }

  & small {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Steps = styled.ol<{ $active: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  & > li {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* 단계 연결선: 회색 점선 + 채워지는 실선 */
  & > li:not(:last-child)::after,
  & > li:not(:last-child)::before {
    content: '';
    position: absolute;
    top: 22px;
    left: 56px;
    right: -8px;
    height: 2px;
  }

  & > li:not(:last-child)::after {
    background: repeating-linear-gradient(90deg, ${({ theme }) => theme.colors.line} 0 6px, transparent 6px 12px);
  }

  & > li:not(:last-child)::before {
    z-index: 1;
    background: ${({ theme }) => theme.colors.primary};
    transform: scale(0, 1);
    transform-origin: left center;
  }

  & .number {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 2px solid ${({ theme }) => theme.colors.line};
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.surface};
    font-size: 14px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.subtle};
  }

  & h3 {
    font-size: 18px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.muted};
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
    background: ${({ theme }) => theme.colors.background};
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.subtle};
  }

  ${({ $active }) => $active && activeStyle}

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;

    & > li {
      flex-direction: row;
      gap: 16px;
      padding-bottom: 28px;
    }

    & > li:not(:last-child)::after,
    & > li:not(:last-child)::before {
      top: 48px;
      bottom: 4px;
      left: 21px;
      right: auto;
      width: 2px;
      height: auto;
    }

    & > li:not(:last-child)::after {
      background: repeating-linear-gradient(180deg, ${({ theme }) => theme.colors.line} 0 6px, transparent 6px 12px);
    }

    & > li:not(:last-child)::before {
      transform: scale(1, 0);
      transform-origin: center top;
    }

    ${({ $active }) => $active && css`& > li:not(:last-child)::before { transform: scale(1); }`}

    & .number { flex-shrink: 0; }
    & > li > div { padding-top: 10px; }
  }

  ${({ theme }) => theme.media.mobile} {
    & .number { width: 40px; height: 40px; font-size: 13px; }
    & > li:not(:last-child)::after,
    & > li:not(:last-child)::before { left: 19px; top: 44px; }
    & > li > div { padding-top: 8px; }
    & h3 { font-size: 16px; }
    & p { font-size: 14px; }
  }

  /* 움직임 최소화 설정 시 즉시 완료 상태로 */
  @media (prefers-reduced-motion: reduce) {
    & *, & > li::before { transition: none !important; }
  }
`;
