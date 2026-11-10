import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { StatusMessage } from '../../../components/common/StatusMessage';
import InquiryRow from '../../../components/inquiry/InquiryRow';
import { useInquiryPageQuery } from '../../../queries/inquiries';

const PREVIEW_SIZE = 5;

export default function InquiryBoard() {
  // 조회
  const { data: inquiryPage, isLoading } = useInquiryPageQuery(1, PREVIEW_SIZE); // 최신 문의 미리보기

  // 파생 데이터
  const inquiries = inquiryPage?.content ?? []; // 메인에 표시할 최신 문의

  return (
    <Panel id="inquiries">
      <PanelHead>
        <h3>매입문의</h3>
        <Link to="/inquiries">
          전체보기
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </PanelHead>
      {isLoading ? (
        <StatusMessage>문의를 불러오는 중이에요.</StatusMessage>
      ) : inquiries.length === 0 ? (
        <StatusMessage>
          아직 등록된 문의가 없어요. <Link to="/inquiries/new">첫 문의 남기기</Link>
        </StatusMessage>
      ) : (
        <ul>
          {inquiries.map((inquiry) => (
            <InquiryRow key={inquiry.id} inquiry={inquiry} />
          ))}
        </ul>
      )}
    </Panel>
  );
}

export const Panel = styled.article`
  min-width: 0;
  padding: 1.75rem;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};

  & ${StatusMessage} a {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 1.25rem 1rem;
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;

export const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;

  & > h3 {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > a {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.muted};
  }

  ${({ theme }) => theme.media.mobile} {
    & > h3 { font-size: 1.125rem; }
  }
`;
