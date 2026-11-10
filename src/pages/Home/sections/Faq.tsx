import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Container, Section } from '../../../components/common/Container';
import SectionHeader from '../../../components/common/SectionHeader';
import { FAQ_ITEMS } from '../../../constants/home';

export default function Faq() {
  // 상태
  const [openIndex, setOpenIndex] = useState<number | null>(null); // 펼친 질문 (한 번에 하나)

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
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <li key={item.question}>
                  <button
                    type="button"
                    id={`faq-q-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>Q</span>
                    {item.question}
                    <ChevronDown size={18} aria-hidden="true" />
                  </button>
                  <div id={`faq-a-${index}`} role="region" aria-labelledby={`faq-q-${index}`} className="answer" data-open={isOpen}>
                    <div>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </List>
        </Layout>
      </Container>
    </Section>
  );
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.7fr);
  gap: 3rem;

  /* 질문 목록 스크롤 동안 제목 고정 */
  & > header {
    position: sticky;
    top: calc(${({ theme }) => theme.layout.headerHeight} + 2rem);
    align-self: start;
  }

  & header p a {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    text-underline-offset: 0.1875rem;
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

  & li > button {
    display: flex;
    width: 100%;
    text-align: left;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 0.25rem;
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.ink};
  }

  & li > button > span {
    flex-shrink: 0;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
  }

  & li > button > svg {
    flex-shrink: 0;
    margin-left: auto;
    color: ${({ theme }) => theme.colors.subtle};
    transition: transform 0.2s ease;
  }

  & li > button[aria-expanded='true'] > svg { transform: rotate(180deg); }

  /* 높이 애니메이션: grid 0fr → 1fr */
  & .answer {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.25s ease;
  }

  & .answer[data-open='true'] { grid-template-rows: 1fr; }
  & .answer > div { overflow: hidden; }

  & p {
    padding: 0 0.25rem 1.25rem 1.75rem;
    font-size: 0.9375rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.muted};
  }

  ${({ theme }) => theme.media.mobile} {
    & li > button { padding: 1rem 2px; font-size: 0.9375rem; }
    & p { padding: 0 2px 1rem 1.5rem; font-size: 0.875rem; }
  }
`;
