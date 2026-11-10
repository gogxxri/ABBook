import styled from 'styled-components';

import { Container } from '../common/Container';
import Logo from './Logo';
import { COMPANY_INFO, FOOTER_LINKS } from '../../constants/home';

export default function Footer() {
  return (
    <Wrapper>
      <Container>
        <Top>
          <Logo />
          <ul>
            {FOOTER_LINKS.map((link) => (
              <li key={link}>
                <a href="#top">{link}</a>
              </li>
            ))}
          </ul>
        </Top>
        <Info>
          <p>
            <span>{COMPANY_INFO.name}</span>
            <span>대표 {COMPANY_INFO.ceo}</span>
            <span>사업자등록번호 {COMPANY_INFO.businessNumber}</span>
          </p>
          <p>
            <span>{COMPANY_INFO.address}</span>
          </p>
          <p>
            <span>대표전화 {COMPANY_INFO.phone}</span>
            <span>이메일 {COMPANY_INFO.email}</span>
          </p>
        </Info>
        <small>© 2026 ABBook Inc. All rights reserved.</small>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  padding: 3rem 0 6rem;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.line};

  & small {
    display: block;
    margin-top: 1.5rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.subtle};
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  & > ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
  }

  & > ul a {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 1.5rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.muted};

  & > p {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
  }
`;
