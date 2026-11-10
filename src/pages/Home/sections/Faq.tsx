import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Container, Section } from '../../../components/common/Container';
import SectionHeader from '../../../components/common/SectionHeader';
import { FAQ_ITEMS } from '../../../constants/home';

export default function Faq() {
  return (
    <Section id="faq">
      <Container>
        <Layout>
          <SectionHeader
            eyebrow="FAQ"
            title="자주 묻는 질문"
            description={
              <>
                찾는 내용이 없다면 <Link to="/inquiries/new">매입문의</Link>로 남겨주세요.
              </>
            }
          />
          <List>
            {FAQ_ITEMS.map((item) => (
              <li key={item.question}>
                <details>
                  <summary>
                    <span>Q</span>
                    {item.question}
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              </li>
            ))}
          </List>
        </Layout>
      </Container>
    </Section>
  );
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.7fr);
  gap: 48px;

  /* 질문 목록 스크롤 동안 제목 고정 */
  & > header {
    position: sticky;
    top: calc(${({ theme }) => theme.layout.headerHeight} + 32px);
    align-self: start;
  }

  & header p a {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;

    & > header { position: static; }
  }
`;

const List = styled.ul`
  border-top: 1px solid ${({ theme }) => theme.colors.ink};

  & > li { border-bottom: 1px solid ${({ theme }) => theme.colors.line}; }

  & summary {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 4px;
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.ink};
    list-style: none;
    cursor: pointer;
  }

  & summary::-webkit-details-marker { display: none; }

  & summary > span {
    flex-shrink: 0;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
  }

  & summary > svg {
    flex-shrink: 0;
    margin-left: auto;
    color: ${({ theme }) => theme.colors.subtle};
    transition: transform 0.2s ease;
  }

  & details[open] summary > svg { transform: rotate(180deg); }

  & p {
    padding: 0 4px 20px 28px;
    font-size: 15px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.muted};
  }

  ${({ theme }) => theme.media.mobile} {
    & summary { padding: 16px 2px; font-size: 15px; }
    & p { padding: 0 2px 16px 24px; font-size: 14px; }
  }
`;
