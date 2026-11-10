import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import styled from 'styled-components';

import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import { Field, Input } from '../../components/common/Field';
import Modal from '../../components/common/Modal';
import { StatusMessage } from '../../components/common/StatusMessage';
import { toast } from '../../stores/toastStore';
import { useDeleteReviewMutation, useReviewsQuery, useSaveReviewMutation } from '../../queries/reviews';
import type { Review } from '../../types/db';
import { ListButton, ListCard, PageHead } from './adminStyles';

type EditTarget = Review | 'new' | null;

export default function AdminReviewsPage() {
  // 상태
  const [editTarget, setEditTarget] = useState<EditTarget>(null); // 작성·수정 모달 대상

  // 조회 (관리자는 비공개 후기 포함)
  const { data: reviews = [], isLoading } = useReviewsQuery();

  return (
    <>
      <PageHead>
        <h1>매입후기</h1>
        <Button icon={<Plus size={16} />} onClick={() => setEditTarget('new')}>
          후기 작성
        </Button>
      </PageHead>

      {isLoading ? (
        <StatusMessage>후기를 불러오는 중이에요.</StatusMessage>
      ) : reviews.length === 0 ? (
        <StatusMessage>등록된 후기가 없어요.</StatusMessage>
      ) : (
        <ListCard>
          {reviews.map((review) => (
            <li key={review.id}>
              <ListButton type="button" onClick={() => setEditTarget(review)}>
                <Chip $tone={review.is_published ? 'primary' : 'neutral'}>{review.is_published ? '공개' : '비공개'}</Chip>
                <div>
                  <strong>{review.title}</strong>
                  <p>{review.items}</p>
                </div>
                <span className="side">
                  {review.region} · {review.created_at.slice(0, 10)}
                </span>
              </ListButton>
            </li>
          ))}
        </ListCard>
      )}

      {editTarget && (
        <ReviewModal key={editTarget === 'new' ? 'new' : editTarget.id} review={editTarget === 'new' ? null : editTarget} onClose={() => setEditTarget(null)} />
      )}
    </>
  );
}

interface ReviewModalProps {
  review: Review | null;
  onClose: () => void;
}

function ReviewModal({ review, onClose }: ReviewModalProps) {
  // 상태
  const [title, setTitle] = useState(review?.title ?? '');
  const [items, setItems] = useState(review?.items ?? '');
  const [region, setRegion] = useState(review?.region ?? '');
  const [isPublished, setIsPublished] = useState(review?.is_published ?? true); // 메인 노출 여부

  // 변경
  const saveMutation = useSaveReviewMutation(); // 후기 작성·수정
  const deleteMutation = useDeleteReviewMutation(); // 후기 삭제

  // 파생 데이터
  const canSave = title.trim() && !saveMutation.isPending;

  // 핸들러
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    saveMutation.mutate(
      { id: review?.id, title: title.trim(), items: items.trim(), region: region.trim(), is_published: isPublished },
      {
        onSuccess: () => {
          toast.success(review ? '후기를 수정했어요.' : '후기를 등록했어요.');
          onClose();
        },
      },
    );
  };

  const handleDelete = () => {
    if (!review || !window.confirm('이 후기를 삭제할까요?')) return;
    deleteMutation.mutate(review.id, {
      onSuccess: () => {
        toast.success('후기를 삭제했어요.');
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen
      title={review ? '후기 수정' : '후기 작성'}
      onClose={onClose}
      footer={
        <>
          {review && (
            <Button $variant="ghost" onClick={handleDelete} disabled={deleteMutation.isPending} style={{ marginRight: 'auto' }}>
              삭제
            </Button>
          )}
          <Button $variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" form="review-form" disabled={!canSave}>
            {saveMutation.isPending ? '저장 중…' : '저장'}
          </Button>
        </>
      }
    >
      <Form id="review-form" onSubmit={handleSubmit}>
        <Field label="제목" htmlFor="review-title" required>
          <Input id="review-title" value={title} placeholder="예) 판교 스타트업 사무실 정리" onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field label="매입 품목" htmlFor="review-items">
          <Input id="review-items" value={items} placeholder="예) 노트북 12대 · 모니터 20대" onChange={(event) => setItems(event.target.value)} />
        </Field>
        <Field label="지역" htmlFor="review-region">
          <Input id="review-region" value={region} placeholder="예) 경기 성남" onChange={(event) => setRegion(event.target.value)} />
        </Field>
        <Toggle>
          <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
          메인 화면에 공개
        </Toggle>
      </Form>
    </Modal>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const Toggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
  cursor: pointer;

  & > input {
    width: 1rem;
    height: 1rem;
    margin: 0;
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;
