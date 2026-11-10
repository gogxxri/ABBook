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
  grid-template-columns: minmax(0, 1fr) minmax(0, 440px);
  align-items: center;
  gap: 64px;

  & > .about > span {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > .about > h2 {
    margin-top: 10px;
    font-size: 34px;
    line-height: 1.3;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > .about > p {
    max-width: 520px;
    margin-top: 16px;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .about > a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 24px;
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }

  ${({ theme }) => theme.media.mobile} {
    & > .about > h2 { font-size: 24px; }
    & > .about > p { font-size: 15px; }
  }
`;

const ContactCard = styled.div`
  padding: 28px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};

  & > h3 {
    font-size: 20px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > p {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 20px;
  }

  & a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 4px 12px;
    padding: 14px 16px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radius.md};
    transition: border-color 0.15s ease;
  }

  & a:hover { border-color: ${({ theme }) => theme.colors.primary}; }

  & a > span {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & a > strong {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 17px;
    color: ${({ theme }) => theme.colors.ink};
  }

  & a > strong > svg { color: ${({ theme }) => theme.colors.primary}; }

  ${({ theme }) => theme.media.mobile} {
    padding: 20px 16px;
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;
