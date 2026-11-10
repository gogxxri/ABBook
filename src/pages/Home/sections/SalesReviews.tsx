import { MapPin } from 'lucide-react';
import styled from 'styled-components';

import { StatusMessage } from '../../../components/common/StatusMessage';
import { useReviewsQuery } from '../../../queries/reviews';
import { Panel, PanelHead } from './InquiryBoard';

const PREVIEW_SIZE = 3;

export default function SalesReviews() {
  // 조회
  const { data: reviews = [], isLoading } = useReviewsQuery(PREVIEW_SIZE); // 최신 공개 후기

  return (
    <Panel id="reviews">
      <PanelHead>
        <h3>매입 후기</h3>
      </PanelHead>
      {isLoading ? (
        <StatusMessage>후기를 불러오는 중이에요.</StatusMessage>
      ) : reviews.length === 0 ? (
        <StatusMessage>등록된 매입 후기가 없어요.</StatusMessage>
      ) : (
      <List>
        {reviews.map((review) => (
          <li key={review.id}>
            <div>
              <strong>{review.title}</strong>
              <p>{review.items}</p>
              <span>
                <MapPin size={13} aria-hidden="true" />
                {review.region}
                <time dateTime={review.created_at}>{review.created_at.slice(0, 10)}</time>
              </span>
            </div>
          </li>
        ))}
      </List>
      )}
    </Panel>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  & li > div {
    display: block;
    padding: 1rem;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.background};
    transition: background 0.15s ease;
  }


  & strong {
    display: block;
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.ink};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & p {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & span {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.subtle};
  }

  & time { margin-left: 0.375rem; }

  ${({ theme }) => theme.media.mobile} {
    & li > div { padding: 0.875rem; }
    & p { font-size: 0.8125rem; }
  }
`;
