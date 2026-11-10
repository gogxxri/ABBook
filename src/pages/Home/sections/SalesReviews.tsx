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
  gap: 10px;

  & li > div {
    display: block;
    padding: 16px;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.background};
    transition: background 0.15s ease;
  }


  & strong {
    display: block;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.ink};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & p {
    margin-top: 4px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & span {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 8px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.subtle};
  }

  & time { margin-left: 6px; }

  ${({ theme }) => theme.media.mobile} {
    & li > div { padding: 14px; }
    & p { font-size: 13px; }
  }
`;
