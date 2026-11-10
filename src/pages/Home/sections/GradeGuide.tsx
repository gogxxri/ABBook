import type { CSSProperties } from 'react';
import styled from 'styled-components';

import { Container, Section } from '../../../components/common/Container';
import SectionHeader from '../../../components/common/SectionHeader';
import { GRADE_GUIDES, type ConditionGrade } from '../../../constants/home';

// 등급별 파랑 (S 진함 → C 옅음)
const GRADE_BLUE: Record<ConditionGrade, string> = {
  S: '#0A2E86',
  A: '#0A43C2',
  B: '#4F7FE0',
  C: '#93AFEA',
};

export default function GradeGuide() {
  return (
    <Section id="grades">
      <Container>
        <SectionHeader
          eyebrow="GRADE"
          title="상태 등급 기준"
          description="검수 시 아래 기준으로 등급을 매겨요. 금액은 모델과 시세에 따라 달라질 수 있어요."
        />
        <Table>
          <div className="head" aria-hidden="true">
            <span>등급</span>
            <span>상태</span>
            <span>판단 기준</span>
            <span>매입가</span>
          </div>
          <ul>
            {GRADE_GUIDES.map((guide) => (
              <li key={guide.grade} style={{ '--grade-color': GRADE_BLUE[guide.grade] } as CSSProperties}>
                <strong className="grade">{guide.grade}</strong>
                <span className="name">{guide.name}</span>
                <p className="criteria">{guide.criteria.join(' · ')}</p>
                <span className="rate">{guide.priceRate}</span>
              </li>
            ))}
          </ul>
        </Table>
      </Container>
    </Section>
  );
}

const COLUMNS = '4.5rem 8.75rem minmax(0, 1fr) 10rem';

const Table = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.ink};

  & > .head,
  & li {
    display: grid;
    grid-template-columns: ${COLUMNS};
    align-items: center;
    gap: 1rem;
    padding: 0 0.5rem;
  }

  & > .head {
    height: 2.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .head > span:last-child,
  & .rate { text-align: right; }

  & li {
    min-height: 4.75rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    transition: background 0.15s ease;
  }

  & li:hover { background: ${({ theme }) => theme.colors.surface}; }

  & .grade {
    font-size: 1.75rem;
    font-weight: 900;
    line-height: 1;
    color: var(--grade-color);
  }

  & .name {
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.ink};
  }

  & .criteria {
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.text};
  }

  & .rate {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--grade-color);
    white-space: nowrap;
  }

  ${({ theme }) => theme.media.mobile} {
    & > .head { display: none; }

    & li {
      grid-template-columns: 2.25rem minmax(0, 1fr) auto;
      grid-template-areas:
        'grade name rate'
        'grade criteria criteria';
      align-items: start;
      gap: 0.25rem 0.75rem;
      min-height: 0;
      padding: 1rem 0.25rem;
    }

    & .grade { grid-area: grade; font-size: 1.5rem; }
    & .name { grid-area: name; font-size: 0.9375rem; }
    & .rate { grid-area: rate; font-size: 0.8125rem; }
    & .criteria { grid-area: criteria; font-size: 0.8125rem; color: ${({ theme }) => theme.colors.muted}; }
  }
`;
