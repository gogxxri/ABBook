import { useState, type FormEvent } from 'react';
import styled from 'styled-components';

import Button from '../common/Button';
import { Field, Input, Select, Textarea } from '../common/Field';
import Modal from '../common/Modal';
import { useCreatePurchaseRequestMutation } from '../../queries/requests';
import { SELL_METHOD_LABEL } from '../../constants/home';
import { toast } from '../../stores/toastStore';
import type { SellMethodKey } from '../../types/db';
import { formatWon } from '../../utils/format';

interface PurchaseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  itemsText: string;
  estimateTotal: number;
  photo: File | null;
}

const PHONE_PATTERN = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;

export default function PurchaseRequestModal({ isOpen, onClose, onSubmitted, itemsText, estimateTotal, photo }: PurchaseRequestModalProps) {
  // 상태
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<SellMethodKey>('parcel'); // 희망 매입 방법
  const [memo, setMemo] = useState('');
  const [agreed, setAgreed] = useState(false); // 개인정보 수집 동의

  // 변경
  const createRequestMutation = useCreatePurchaseRequestMutation(); // 매입신청 등록

  // 파생 데이터
  const isPhoneValid = PHONE_PATTERN.test(phone.trim()); // 연락처 형식 확인
  const canSubmit = customerName.trim() && isPhoneValid && agreed && !createRequestMutation.isPending;

  // 핸들러
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    createRequestMutation.mutate(
      { customer_name: customerName.trim(), phone: phone.trim(), method, memo: memo.trim(), items_text: itemsText, estimate_total: estimateTotal, photo },
      {
        onSuccess: () => {
          toast.success('매입신청이 접수됐어요. 담당자가 곧 연락드릴게요.');
          setCustomerName('');
          setPhone('');
          setMemo('');
          setAgreed(false);
          onSubmitted();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title="매입신청"
      onClose={onClose}
      footer={
        <>
          <Button $variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" form="purchase-request-form" disabled={!canSubmit}>
            {createRequestMutation.isPending ? '접수 중…' : '신청하기'}
          </Button>
        </>
      }
    >
      <Summary>
        <div>
          <span>신청 품목</span>
          <p>{itemsText || (photo ? `사진 첨부 (${photo.name})` : '-')}</p>
        </div>
        <div>
          <span>예상 매입금액</span>
          <strong>{estimateTotal > 0 ? formatWon(estimateTotal) : '검수 후 안내'}</strong>
        </div>
      </Summary>

      <Form id="purchase-request-form" onSubmit={handleSubmit}>
        <Field label="이름" htmlFor="request-name" required>
          <Input id="request-name" value={customerName} maxLength={30} onChange={(event) => setCustomerName(event.target.value)} />
        </Field>
        <Field label="연락처" htmlFor="request-phone" required hint={phone && !isPhoneValid ? '010-0000-0000 형식으로 입력해 주세요.' : undefined}>
          <Input id="request-phone" type="tel" inputMode="tel" placeholder="010-0000-0000" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </Field>
        <Field label="희망 매입 방법" htmlFor="request-method" required>
          <Select id="request-method" value={method} onChange={(event) => setMethod(event.target.value as SellMethodKey)}>
            {Object.entries(SELL_METHOD_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="요청사항" htmlFor="request-memo">
          <Textarea id="request-memo" value={memo} maxLength={1000} placeholder="방문 희망 일시, 주소, 제품 상태 등" onChange={(event) => setMemo(event.target.value)} />
        </Field>
        <Agree>
          <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
          <span>매입 상담을 위한 개인정보(이름, 연락처) 수집·이용에 동의합니다.</span>
        </Agree>
      </Form>
    </Modal>
  );
}

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};

  & > div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;
  }

  & span {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.muted};
  }

  & p {
    min-width: 0;
    text-align: right;
    white-space: pre-line;
    color: ${({ theme }) => theme.colors.ink};
  }

  & strong { color: ${({ theme }) => theme.colors.primary}; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Agree = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  & > input {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin: 2px 0 0;
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;
