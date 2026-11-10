import { useState } from 'react';
import styled from 'styled-components';

import { Container, Section } from '../../../components/common/Container';
import SectionHeader from '../../../components/common/SectionHeader';
import { StatusMessage } from '../../../components/common/StatusMessage';
import { usePriceCategoriesQuery, usePriceItemsQuery } from '../../../queries/prices';
import { formatWon } from '../../../utils/format';

export default function PriceCategories() {
  // 상태
  const [selectedId, setSelectedId] = useState<number | null>(null); // 선택한 단가표 카테고리

  // 조회
  const { data: categories = [], isLoading: isCategoryLoading } = usePriceCategoriesQuery();
  const { data: priceItems = [], isLoading: isItemLoading } = usePriceItemsQuery();

  // 파생 데이터
  const activeId = selectedId ?? categories[0]?.id ?? null; // 미선택 시 첫 카테고리
  const activeItems = priceItems.filter((item) => item.category_id === activeId); // 선택 카테고리 품목

  return (
    <Section id="prices" $tone="white">
      <Container>
        <SectionHeader eyebrow="PRICE LIST" title="품목별 매입 단가표" description="매일 시세를 반영해 업데이트합니다." />

        {isCategoryLoading ? (
          <StatusMessage>단가표를 불러오는 중이에요.</StatusMessage>
        ) : categories.length === 0 ? (
          <StatusMessage>등록된 단가표가 없어요.</StatusMessage>
        ) : (
          <>
            <Grid>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    className={activeId === category.id ? 'active' : undefined}
                    aria-pressed={activeId === category.id}
                    onClick={() => setSelectedId(category.id)}
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </Grid>

            <Items>
              {isItemLoading ? (
                <StatusMessage>품목을 불러오는 중이에요.</StatusMessage>
              ) : activeItems.length === 0 ? (
                <StatusMessage>이 카테고리에 등록된 품목이 없어요. 상담으로 문의해 주세요.</StatusMessage>
              ) : (
                <ul>
                  {activeItems.map((item) => (
                    <li key={item.id}>
                      <span>{item.name}</span>
                      <strong>{formatWon(item.price)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </Items>
          </>
        )}
      </Container>
    </Section>
  );
}

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.625rem;

  & button {
    width: 100%;
    height: 2.75rem;
    padding: 0 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.surface};
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.15s ease;
  }

  & button:hover { border-color: ${({ theme }) => theme.colors.primary}; }

  & button.active {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;

    & button { height: 2.5rem; font-size: 0.8125rem; }
  }
`;

const Items = styled.div`
  margin-top: 1.25rem;
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};

  & > ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 2.5rem;
  }

  & li {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    font-size: 0.875rem;
  }

  & li > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.text};
  }

  & li > strong {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.ink};
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 0.25rem 0.875rem;

    & > ul { grid-template-columns: minmax(0, 1fr); }
    & li { font-size: 0.8125rem; }
  }
`;
