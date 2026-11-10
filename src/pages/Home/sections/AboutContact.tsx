import { ArrowRight, Clock, Phone } from 'lucide-react';
import styled from 'styled-components';

import { Container, Section } from '../../../components/common/Container';
import { COMPANY_INFO } from '../../../constants/home';

export default function AboutContact() {
  return (
    <Section id="about" $tone="white">
      <Container>
        <Grid>
          <div className="about">
            <span>ABOUT ABBOOK</span>
            <h2>
              믿고 맡기는
              <br />
              중고 IT기기 매입 전문
            </h2>
            <p>
              에이비북은 노트북·컴퓨터·태블릿·메모리·저장장치를 출장, 택배, 방문, 퀵으로 매입합니다. 투명한 단가표와 꼼꼼한 검수로
              공정한 가격을 약속드려요.
            </p>
            <a href="#about">
              회사 소개 보기
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <ContactCard aria-label="상담 연결">
            <h3>지금 바로 상담하세요</h3>
            <p>
              <Clock size={14} aria-hidden="true" />
              {COMPANY_INFO.hours}
            </p>
            <ul>
              {[COMPANY_INFO.phone, ...COMPANY_INFO.directPhones].map((phone, index) => (
                <li key={phone}>
                  <a href={`tel:${phone}`}>
                    <span>{index === 0 ? '대표번호' : `다이렉트 상담 ${index}`}</span>
                    <strong>
                      <Phone size={16} aria-hidden="true" />
                      {phone}
                    </strong>
                  </a>
                </li>
              ))}
            </ul>
          </ContactCard>
        </Grid>
      </Container>
    </Section>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 27.5rem);
  align-items: center;
  gap: 4rem;

  & > .about > span {
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > .about > h2 {
    margin-top: 0.625rem;
    font-size: 2.125rem;
    line-height: 1.3;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > .about > p {
    max-width: 32.5rem;
    margin-top: 1rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .about > a {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 1.5rem;
    font-size: 0.9375rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }

  ${({ theme }) => theme.media.mobile} {
    & > .about > h2 { font-size: 1.5rem; }
    & > .about > p { font-size: 0.9375rem; }
  }
`;

const ContactCard = styled.div`
  padding: 1.75rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};

  & > h3 {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > p {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.375rem;
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > ul {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1.25rem;
  }

  & a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.25rem 0.75rem;
    padding: 0.875rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radius.md};
    transition: border-color 0.15s ease;
  }

  & a:hover { border-color: ${({ theme }) => theme.colors.primary}; }

  & a > span {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.muted};
  }

  & a > strong {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 1.0625rem;
    color: ${({ theme }) => theme.colors.ink};
  }

  & a > strong > svg { color: ${({ theme }) => theme.colors.primary}; }

  ${({ theme }) => theme.media.mobile} {
    padding: 1.25rem 1rem;
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;
