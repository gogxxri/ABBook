import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import styled from 'styled-components';

import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import { Field, Select, Textarea } from '../../components/common/Field';
import Modal from '../../components/common/Modal';
import { StatusMessage } from '../../components/common/StatusMessage';
import { toast } from '../../stores/toastStore';
import { usePurchaseRequestsQuery, useRequestPhotoUrlQuery, useUpdatePurchaseRequestMutation } from '../../queries/requests';
import { REQUEST_STATUS_LABEL, SELL_METHOD_LABEL } from '../../constants/home';
import type { PurchaseRequest, RequestStatus } from '../../types/db';
import { formatWon } from '../../utils/format';
import { FilterTabs, InfoList, ListButton, ListCard, PageHead } from './adminStyles';

type StatusFilter = RequestStatus | 'all';

const STATUS_FILTERS: StatusFilter[] = ['all', 'received', 'inspecting', 'completed', 'canceled'];

const STATUS_TONE: Record<RequestStatus, 'primary' | 'warning' | 'neutral'> = {
  received: 'warning',
  inspecting: 'primary',
  completed: 'neutral',
  canceled: 'neutral',
};

const formatDateTime = (value: string) => new Date(value).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' });

export default function AdminRequestsPage() {
  // 상태
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all'); // 목록 상태 필터
  const [selected, setSelected] = useState<PurchaseRequest | null>(null); // 상세 모달 대상

  // 조회
  const { data: requests = [], isLoading } = usePurchaseRequestsQuery(statusFilter);

  return (
    <>
      <PageHead>
        <h1>매입신청</h1>
      </PageHead>
      <FilterTabs>
        {STATUS_FILTERS.map((status) => (
          <button key={status} type="button" aria-pressed={statusFilter === status} onClick={() => setStatusFilter(status)}>
            {status === 'all' ? '전체' : REQUEST_STATUS_LABEL[status]}
          </button>
        ))}
      </FilterTabs>

      {isLoading ? (
        <StatusMessage>신청 목록을 불러오는 중이에요.</StatusMessage>
      ) : requests.length === 0 ? (
        <StatusMessage>해당 상태의 매입신청이 없어요.</StatusMessage>
      ) : (
        <ListCard>
          {requests.map((request) => (
            <li key={request.id}>
              <ListButton type="button" onClick={() => setSelected(request)}>
                <Chip $tone={STATUS_TONE[request.status]}>{REQUEST_STATUS_LABEL[request.status]}</Chip>
                <div>
                  <strong>
                    {request.customer_name} · {SELL_METHOD_LABEL[request.method]}
                    {request.photo_path && <ImageIcon size={14} aria-label="사진 첨부" style={{ marginLeft: '0.375rem', verticalAlign: '-2px' }} />}
                  </strong>
                  <p>{request.items_text || '사진 견적'}</p>
                </div>
                <time dateTime={request.created_at}>{formatDateTime(request.created_at)}</time>
              </ListButton>
            </li>
          ))}
        </ListCard>
      )}

      {selected && <RequestDetailModal key={selected.id} request={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

interface RequestDetailModalProps {
  request: PurchaseRequest;
  onClose: () => void;
}

function RequestDetailModal({ request, onClose }: RequestDetailModalProps) {
  // 상태 (선택 항목이 바뀌면 key 로 재생성되어 초기화)
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [adminMemo, setAdminMemo] = useState(request.admin_memo ?? '');

  // 조회·변경
  const { data: photoUrl } = useRequestPhotoUrlQuery(request.photo_path); // 첨부 사진 임시 URL
  const updateMutation = useUpdatePurchaseRequestMutation(); // 진행 상태·메모 저장

  // 핸들러
  const handleSave = () => {
    updateMutation.mutate(
      { id: request.id, status, admin_memo: adminMemo.trim() || null },
      {
        onSuccess: () => {
          toast.success('매입신청을 저장했어요.');
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen
      title={`매입신청 #${request.id}`}
      onClose={onClose}
      width={600}
      footer={
        <>
          <Button $variant="secondary" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? '저장 중…' : '저장'}
          </Button>
        </>
      }
    >
      <InfoList>
        <dt>신청일시</dt>
        <dd>{formatDateTime(request.created_at)}</dd>
        <dt>이름</dt>
        <dd>{request.customer_name}</dd>
        <dt>연락처</dt>
        <dd>
          <a href={`tel:${request.phone}`}>{request.phone}</a>
        </dd>
        <dt>매입 방법</dt>
        <dd>{SELL_METHOD_LABEL[request.method]}</dd>
        <dt>신청 품목</dt>
        <dd>{request.items_text || '-'}</dd>
        <dt>예상 금액</dt>
        <dd>{request.estimate_total > 0 ? formatWon(request.estimate_total) : '-'}</dd>
        <dt>요청사항</dt>
        <dd>{request.memo || '-'}</dd>
      </InfoList>

      {request.photo_path && (
        <Photo>{photoUrl ? <img src={photoUrl} alt="신청 첨부 사진" /> : <span>사진을 불러오는 중이에요.</span>}</Photo>
      )}

      <Field label="진행 상태" htmlFor="request-status">
        <Select id="request-status" value={status} onChange={(event) => setStatus(event.target.value as RequestStatus)}>
          {Object.entries(REQUEST_STATUS_LABEL).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="관리자 메모" htmlFor="request-admin-memo" hint="고객에게 노출되지 않아요.">
        <Textarea id="request-admin-memo" value={adminMemo} onChange={(event) => setAdminMemo(event.target.value)} style={{ minHeight: '5.625rem' }} />
      </Field>
    </Modal>
  );
}

const Photo = styled.div`
  display: grid;
  place-items: center;
  min-height: 7.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  overflow: hidden;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.muted};

  & > img {
    width: 100%;
    max-height: 22.5rem;
    object-fit: contain;
  }
`;
