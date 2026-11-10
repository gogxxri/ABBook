import { Check } from 'lucide-react';
import styled from 'styled-components';

import { Container, Section } from '../../../components/common/Container';
import SectionHeader from '../../../components/common/SectionHeader';
import { GRADE_GUIDES, type ConditionGrade } from '../../../constants/home';

// 등급별 강조 색 (S → C 로 갈수록 옅게)
const GRADE_OPACITY: Record<ConditionGrade, number> = { S: 1, A: 0.78, B: 0.56, C: 0.34 };

export default function GradeGuide() {
  return (
    <Section id="grades">
      <Container>
        <SectionHeader
          eyebrow="GRADE"
          title="상태 등급 기준"
          description="검수 시 아래 기준으로 등급을 매겨요. 금액은 모델과 시세에 따라 달라질 수 있어요."
        />
        <Grid>
          {GRADE_GUIDES.map((guide) => (
            <li key={guide.grade}>
              <div className="head">
                <Badge $opacity={GRADE_OPACITY[guide.grade]}>{guide.grade}</Badge>
                <div>
                  <h3>{guide.name}</h3>
                  <strong>{guide.priceRate}</strong>
                </div>
              </div>
              <ul>
                {guide.criteria.map((criterion) => (
                  <li key={criterion}>
                    <Check size={15} aria-hidden="true" />
                    {criterion}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  & > li {
    padding: 24px 20px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radius.lg};
    background: ${({ theme }) => theme.colors.surface};
  }

  & .head {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 18px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  }

  & h3 {
    font-size: 17px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
  }

  & strong {
    font-size: 13px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > li > ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
  }

  & > li > ul > li {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
  }

  & > li > ul svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.subtle};
  }

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${({ theme }) => theme.media.mobile} {
    gap: 10px;

    & > li { padding: 18px 16px; border-radius: ${({ theme }) => theme.radius.md}; }
    & .head { padding-bottom: 14px; }
    & > li > ul { margin-top: 12px; }
    & > li > ul > li { font-size: 13px; }
  }

  ${({ theme }) => theme.media.small} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Badge = styled.span<{ $opacity: number }>`
  position: relative;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 22px;
  font-weight: 900;
  color: ${({ $opacity, theme }) => ($opacity > 0.5 ? '#fff' : theme.colors.primary)};
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: ${({ theme }) => theme.colors.primary};
    opacity: ${({ $opacity }) => $opacity};
  }
`;
