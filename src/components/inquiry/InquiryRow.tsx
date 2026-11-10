import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Chip from '../common/Chip';
import { INQUIRY_STATUS_LABEL } from '../../constants/home';
import type { InquiryListItem } from '../../types/db';

interface InquiryRowProps {
  inquiry: InquiryListItem;
}

// 비밀글 문의 목록 한 줄
export default function InquiryRow({ inquiry }: InquiryRowProps) {
  const createdDate = inquiry.created_at.slice(0, 10); // YYYY-MM-DD

  return (
    <Row>
      <Chip $tone={inquiry.status === 'waiting' ? 'warning' : 'primary'}>{INQUIRY_STATUS_LABEL[inquiry.status]}</Chip>
      <Link to={`/inquiries/${inquiry.id}`} className="title">
        <Lock size={13} aria-label="비밀글" />
        <span>{inquiry.title}</span>
      </Link>
      <span className="meta">
        {inquiry.author_masked}
        <time dateTime={createdDate}>{createdDate}</time>
      </span>
    </Row>
  );
}

const Row = styled.li`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.line};

  & > .title {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > .title > svg { flex-shrink: 0; color: ${({ theme }) => theme.colors.subtle}; }

  & > .title > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > .title:hover > span { text-decoration: underline; }

  & > .meta {
    display: flex;
    gap: 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.subtle};
    white-space: nowrap;
  }

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 6px 10px;

    & > .title { font-size: 14px; }
    & > .meta { grid-column: 2; font-size: 12px; }
  }
`;
