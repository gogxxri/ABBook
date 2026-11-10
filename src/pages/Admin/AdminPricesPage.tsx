import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import styled from 'styled-components';

import Button from '../../components/common/Button';
import { Field, Input, Select } from '../../components/common/Field';
import Modal from '../../components/common/Modal';
import { StatusMessage } from '../../components/common/StatusMessage';
import { toast } from '../../stores/toastStore';
import { useDeletePriceItemMutation, usePriceCategoriesQuery, usePriceItemsQuery, useSavePriceItemMutation } from '../../queries/prices';
import type { PriceCategory, PriceItem } from '../../types/db';
import { formatWon } from '../../utils/format';
import { FilterTabs, ListCard, PageHead } from './adminStyles';

type EditTarget = PriceItem | 'new' | null;

export default function AdminPricesPage() {
  // 상태
  const [categoryId, setCategoryId] = useState<number | null>(null); // 선택 카테고리
  const [editTarget, setEditTarget] = useState<EditTarget>(null); // 등록·수정 모달 대상

  // 조회
  const { data: categories = [] } = usePriceCategoriesQuery();
  const { data: priceItems = [], isLoading } = usePriceItemsQuery();

  // 변경
  const deleteMutation = useDeletePriceItemMutation(); // 품목 삭제

  // 파생 데이터
  const activeCategoryId = categoryId ?? categories[0]?.id ?? null; // 미선택 시 첫 카테고리
  const activeItems = priceItems.filter((item) => item.category_id === activeCategoryId); // 선택 카테고리 품목

  // 핸들러
  const handleDelete = (item: PriceItem) => {
    if (!window.confirm(`'${item.name}' 품목을 삭제할까요?`)) return;
    deleteMutation.mutate(item.id, { onSuccess: () => toast.success('품목을 삭제했어요.') });
  };

  return (
    <>
      <PageHead>
        <h1>단가표</h1>
        <Button icon={<Plus size={16} />} onClick={() => setEditTarget('new')} disabled={categories.length === 0}>
          품목 추가
        </Button>
      </PageHead>
      <FilterTabs>
        {categories.map((category) => (
          <button key={category.id} type="button" aria-pressed={activeCategoryId === category.id} onClick={() => setCategoryId(category.id)}>
            {category.label}
          </button>
        ))}
      </FilterTabs>

      {isLoading ? (
        <StatusMessage>단가표를 불러오는 중이에요.</StatusMessage>
      ) : activeItems.length === 0 ? (
        <StatusMessage>이 카테고리에 등록된 품목이 없어요.</StatusMessage>
      ) : (
        <ListCard>
          {activeItems.map((item) => (
            <ItemRow key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>{item.keywords ? `키워드: ${item.keywords}` : '키워드 없음 (품목명으로 매칭)'}</p>
              </div>
              <span className="price">{formatWon(item.price)}</span>
              <div className="actions">
                <Button $size="sm" $variant="secondary" onClick={() => setEditTarget(item)}>
                  수정
                </Button>
                <Button $size="sm" $variant="ghost" onClick={() => handleDelete(item)} disabled={deleteMutation.isPending}>
                  삭제
                </Button>
              </div>
            </ItemRow>
          ))}
        </ListCard>
      )}

      {editTarget && (
        <PriceItemModal
          key={editTarget === 'new' ? 'new' : editTarget.id}
          item={editTarget === 'new' ? null : editTarget}
          categories={categories}
          defaultCategoryId={activeCategoryId ?? categories[0].id}
          onClose={() => setEditTarget(null)}
        />
      )}
    </>
  );
}

interface PriceItemModalProps {
  item: PriceItem | null;
  categories: PriceCategory[];
  defaultCategoryId: number;
  onClose: () => void;
}

function PriceItemModal({ item, categories, defaultCategoryId, onClose }: PriceItemModalProps) {
  // 상태
  const [categoryId, setCategoryId] = useState(item?.category_id ?? defaultCategoryId);
  const [name, setName] = useState(item?.name ?? '');
  const [keywords, setKeywords] = useState(item?.keywords ?? '');
  const [price, setPrice] = useState(item ? String(item.price) : '');

  // 변경
  const saveMutation = useSavePriceItemMutation(); // 품목 등록·수정

  // 파생 데이터
  const priceNumber = Number(price.replace(/,/g, '')); // 입력 단가 숫자값
  const canSave = name.trim() && Number.isFinite(priceNumber) && priceNumber >= 0 && price !== '' && !saveMutation.isPending;

  // 핸들러
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    saveMutation.mutate(
      { id: item?.id, category_id: categoryId, name: name.trim(), keywords: keywords.trim(), price: Math.round(priceNumber) },
      {
        onSuccess: () => {
          toast.success(item ? '품목을 수정했어요.' : '품목을 추가했어요.');
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen
      title={item ? '품목 수정' : '품목 추가'}
      onClose={onClose}
      footer={
        <>
          <Button $variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" form="price-item-form" disabled={!canSave}>
            {saveMutation.isPending ? '저장 중…' : '저장'}
          </Button>
        </>
      }
    >
      <Form id="price-item-form" onSubmit={handleSubmit}>
        <Field label="카테고리" htmlFor="price-category" required>
          <Select id="price-category" value={categoryId} onChange={(event) => setCategoryId(Number(event.target.value))}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="품목명" htmlFor="price-name" required>
          <Input id="price-name" value={name} placeholder="예) 맥북 프로 14 M3" onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label="견적 매칭 키워드" htmlFor="price-keywords" hint="쉼표로 구분 · 고객이 입력한 사양에 포함되면 이 단가로 계산돼요.">
          <Input id="price-keywords" value={keywords} placeholder="예) macbook pro 14, m3 pro, 맥북프로14" onChange={(event) => setKeywords(event.target.value)} />
        </Field>
        <Field label="매입 단가(원)" htmlFor="price-value" required>
          <Input id="price-value" inputMode="numeric" value={price} placeholder="0" onChange={(event) => setPrice(event.target.value.replace(/[^\d,]/g, ''))} />
        </Field>
      </Form>
    </Modal>
  );
}

const ItemRow = styled.li`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;

  & > div:first-child { min-width: 0; }

  & strong {
    display: block;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.ink};
  }

  & p {
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .price {
    font-size: 15px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.ink};
    white-space: nowrap;
  }

  & > .actions {
    display: flex;
    gap: 4px;
  }

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px 12px;
    padding: 12px;

    & > .actions { grid-column: 1 / -1; justify-content: flex-end; }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
