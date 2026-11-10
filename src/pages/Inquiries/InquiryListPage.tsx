import { PenLine } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { StatusMessage } from '../../components/common/StatusMessage';
import InquiryRow from '../../components/inquiry/InquiryRow';
import { useInquiryPageQuery } from '../../queries/inquiries';
import InquiryLayout from './InquiryLayout';

const PAGE_SIZE = 10;

export default function InquiryListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 상태
  const page = Math.max(1, Number(searchParams.get('page')) || 1); // URL 기준 현재 페이지 (1부터)

  // 조회
  const { data: inquiryPage, isLoading } = useInquiryPageQuery(page, PAGE_SIZE);

  // 파생 데이터
  const inquiries = inquiryPage?.content ?? []; // 현재 페이지 문의 목록
  const totalPages = inquiryPage?.totalPages ?? 0;

  // 핸들러
  const handlePageChange = (nextPage: number) => {
    setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {});
    window.scrollTo(0, 0);
  };

  return (
    <InquiryLayout
      title="매입문의"
      description="모든 문의는 비밀글로 등록되며, 작성 시 입력한 비밀번호로 확인할 수 있어요."
      action={
        <Button icon={<PenLine size={16} />} onClick={() => navigate('/inquiries/new')}>
          문의하기
        </Button>
      }
    >
      {isLoading ? (
        <StatusMessage>문의를 불러오는 중이에요.</StatusMessage>
      ) : inquiries.length === 0 ? (
        <StatusMessage>등록된 문의가 없어요.</StatusMessage>
      ) : (
        <ul>
          {inquiries.map((inquiry) => (
            <InquiryRow key={inquiry.id} inquiry={inquiry} />
          ))}
        </ul>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
    </InquiryLayout>
  );
}
