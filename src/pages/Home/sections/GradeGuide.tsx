import styled from 'styled-components';

import { Container, Section } from '../../../components/common/Container';
import SectionHeader from '../../../components/common/SectionHeader';
import { GRADE_GUIDES } from '../../../constants/home';

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
              <li key={guide.grade}>
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

const COLUMNS = '72px 140px minmax(0, 1fr) 160px';

const Table = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.ink};

  & > .head,
  & li {
    display: grid;
    grid-template-columns: ${COLUMNS};
    align-items: center;
    gap: 16px;
    padding: 0 8px;
  }

  & > .head {
    height: 44px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .head > span:last-child,
  & .rate { text-align: right; }

  & li {
    min-height: 76px;
    padding-top: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    transition: background 0.15s ease;
  }

  & li:hover { background: ${({ theme }) => theme.colors.surface}; }

  & .grade {
    font-size: 28px;
    font-weight: 900;
    line-height: 1;
    color: ${({ theme }) => theme.colors.ink};
  }

  & .name {
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.ink};
  }

  & .criteria {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.text};
  }

  & .rate {
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    white-space: nowrap;
  }

  ${({ theme }) => theme.media.mobile} {
    & > .head { display: none; }

    & li {
      grid-template-columns: 36px minmax(0, 1fr) auto;
      grid-template-areas:
        'grade name rate'
        'grade criteria criteria';
      align-items: start;
      gap: 4px 12px;
      min-height: 0;
      padding: 16px 4px;
    }

    & .grade { grid-area: grade; font-size: 24px; }
    & .name { grid-area: name; font-size: 15px; }
    & .rate { grid-area: rate; font-size: 13px; }
    & .criteria { grid-area: criteria; font-size: 13px; color: ${({ theme }) => theme.colors.muted}; }
  }
`;
