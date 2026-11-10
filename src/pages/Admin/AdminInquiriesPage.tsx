import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import styled from 'styled-components';

import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import { Field, Textarea } from '../../components/common/Field';
import Modal from '../../components/common/Modal';
import PhotoGallery from '../../components/common/PhotoGallery';
import { StatusMessage } from '../../components/common/StatusMessage';
import { toast } from '../../stores/toastStore';
import {
  useAdminDeleteInquiryMutation,
  useAdminInquiriesQuery,
  useAdminInquiryPhotosQuery,
  useAnswerInquiryMutation,
} from '../../queries/inquiries';
import { INQUIRY_STATUS_LABEL } from '../../constants/home';
import type { InquiryDetail, InquiryStatus } from '../../types/db';
import { FilterTabs, ListButton, ListCard, PageHead } from './adminStyles';

type StatusFilter = InquiryStatus | 'all';

const STATUS_FILTERS: StatusFilter[] = ['waiting', 'answered', 'all'];

export default function AdminInquiriesPage() {
  // 상태
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('waiting'); // 기본: 답변대기
  const [selected, setSelected] = useState<InquiryDetail | null>(null); // 답변 모달 대상

  // 조회
  const { data: inquiries = [], isLoading } = useAdminInquiriesQuery(statusFilter);

  return (
    <>
      <PageHead>
        <h1>매입문의</h1>
      </PageHead>
      <FilterTabs>
        {STATUS_FILTERS.map((status) => (
          <button key={status} type="button" aria-pressed={statusFilter === status} onClick={() => setStatusFilter(status)}>
            {status === 'all' ? '전체' : INQUIRY_STATUS_LABEL[status]}
          </button>
        ))}
      </FilterTabs>

      {isLoading ? (
        <StatusMessage>문의를 불러오는 중이에요.</StatusMessage>
      ) : inquiries.length === 0 ? (
        <StatusMessage>해당 상태의 문의가 없어요.</StatusMessage>
      ) : (
        <ListCard>
          {inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <ListButton type="button" onClick={() => setSelected(inquiry)}>
                <Chip $tone={inquiry.status === 'waiting' ? 'warning' : 'primary'}>{INQUIRY_STATUS_LABEL[inquiry.status]}</Chip>
                <div>
                  <strong>
                    {inquiry.title}
                    {inquiry.photo_paths.length > 0 && (
                      <ImageIcon size={14} aria-label={`사진 ${inquiry.photo_paths.length}장`} style={{ marginLeft: 6, verticalAlign: -2 }} />
                    )}
                  </strong>
                  <p>{inquiry.content}</p>
                </div>
                <span className="side">
                  {inquiry.author_name} · {inquiry.created_at.slice(0, 10)}
                </span>
              </ListButton>
            </li>
          ))}
        </ListCard>
      )}

      {selected && <AnswerModal key={selected.id} inquiry={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

interface AnswerModalProps {
  inquiry: InquiryDetail;
  onClose: () => void;
}

function AnswerModal({ inquiry, onClose }: AnswerModalProps) {
  // 상태
  const [answer, setAnswer] = useState(inquiry.answer ?? ''); // 답변 입력값

  // 조회
  const { data: photoUrls = [], isLoading: isPhotoLoading } = useAdminInquiryPhotosQuery(inquiry.id, inquiry.photo_paths); // 첨부 사진 임시 URL

  // 변경
  const answerMutation = useAnswerInquiryMutation(); // 답변 저장 (비우면 답변대기로)
  const deleteMutation = useAdminDeleteInquiryMutation(); // 문의 삭제

  // 핸들러
  const handleSave = () => {
    answerMutation.mutate(
      { id: inquiry.id, answer },
      {
        onSuccess: () => {
          toast.success(answer.trim() ? '답변을 등록했어요.' : '답변을 비워 답변대기로 바꿨어요.');
          onClose();
        },
      },
    );
  };

  const handleDelete = () => {
    if (!window.confirm('이 문의를 삭제할까요? 되돌릴 수 없어요.')) return;
    deleteMutation.mutate(inquiry.id, {
      onSuccess: () => {
        toast.success('문의를 삭제했어요.');
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen
      title="문의 답변"
      onClose={onClose}
      width={640}
      footer={
        <>
          <Button $variant="ghost" onClick={handleDelete} disabled={deleteMutation.isPending} style={{ marginRight: 'auto' }}>
            삭제
          </Button>
          <Button $variant="secondary" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={handleSave} disabled={answerMutation.isPending}>
            {answerMutation.isPending ? '저장 중…' : '답변 저장'}
          </Button>
        </>
      }
    >
      <Question>
        <strong>{inquiry.title}</strong>
        <span>
          {inquiry.author_name} · {new Date(inquiry.created_at).toLocaleString('ko-KR')}
        </span>
        <p>{inquiry.content}</p>
        {inquiry.photo_paths.length > 0 && (
          <div className="photos">
            <PhotoGallery urls={photoUrls} isLoading={isPhotoLoading} count={inquiry.photo_paths.length} />
          </div>
        )}
      </Question>
      <Field label="답변" htmlFor="inquiry-answer">
        <Textarea id="inquiry-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} style={{ minHeight: 180 }} />
      </Field>
    </Modal>
  );
}

const Question = styled.div`
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};

  & > strong {
    display: block;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.ink};
    word-break: break-all;
  }

  & > span {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > p {
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.7;
    white-space: pre-wrap;
    word-break: break-all;
  }

  & > .photos { margin-top: 14px; }
`;
