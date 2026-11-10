import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Camera, CheckCircle2, ImagePlus, MessageCircle, Sparkles, X } from 'lucide-react';
import styled from 'styled-components';

import Button from '../../../components/common/Button';
import { Container } from '../../../components/common/Container';
import PurchaseRequestModal from '../../../components/purchase/PurchaseRequestModal';
import { usePriceItemsQuery } from '../../../queries/prices';
import { estimateFromText } from '../../../utils/estimate';
import { formatWon } from '../../../utils/format';

type QuoteMode = 'text' | 'photo';

const QUOTE_TABS: { key: QuoteMode; label: string }[] = [
  { key: 'text', label: '사양 입력' },
  { key: 'photo', label: '사진으로 입력' },
];

const HERO_POINTS = ['단가표 기준 즉시 계산', '검수 후 당일 입금', '전국 출장·택배 가능'];

const SPEC_PLACEHOLDER = `모델명을 한 줄에 하나씩 입력하세요\n예) RTX 4070 x 1\n    i7-13700\n    DDR5 16GB 2개`;

export default function QuoteHero() {
  // 상태
  const [mode, setMode] = useState<QuoteMode>('text'); // 견적 입력 방식
  const [specText, setSpecText] = useState(''); // 사양 입력값
  const [photo, setPhoto] = useState<File | null>(null); // 업로드한 사양 사진
  const [isRequestOpen, setIsRequestOpen] = useState(false); // 매입신청 모달 노출
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 조회
  const { data: priceItems = [] } = usePriceItemsQuery(); // 견적 계산 기준 단가표

  // 파생 데이터
  const estimate = useMemo(() => estimateFromText(specText, priceItems), [specText, priceItems]); // 입력 사양 기준 예상 매입가
  const requestItemsText = mode === 'text' ? specText.trim() : ''; // 신청서에 담을 품목 원문
  const photoPreviewUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]); // 사진 미리보기 주소
  const canApply = mode === 'text' ? Boolean(specText.trim()) : Boolean(photo); // 매입신청 가능 여부

  // 미리보기 URL 해제
  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

  // 핸들러
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoto(event.target.files?.[0] ?? null);
    event.target.value = '';
  };

  // 신청 완료 후 입력값 초기화
  const handleRequestSubmitted = () => {
    setIsRequestOpen(false);
    setSpecText('');
    setPhoto(null);
  };

  return (
    <Hero id="quote">
      <Inner>
        <Copy>
          <span className="badge">
            <Sparkles size={14} aria-hidden="true" />
            빠른 견적
          </span>
          <h2>
            팔기 전에,
            <br />
            <em>얼마 받을지</em> 먼저 확인하세요
          </h2>
          <p>모델명을 적거나 사양 사진을 올리면 매입 단가표 기준으로 예상 금액을 바로 알려드려요.</p>
          <ul>
            {HERO_POINTS.map((point) => (
              <li key={point}>
                <CheckCircle2 size={18} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </Copy>

        <QuoteCard aria-label="빠른 견적">
          <Tabs role="tablist">
            {QUOTE_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={mode === tab.key}
                className={mode === tab.key ? 'active' : undefined}
                onClick={() => setMode(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </Tabs>

          {mode === 'text' ? (
            <SpecField>
              <label htmlFor="spec-input" className="sr-only">
                사양 입력
              </label>
              <textarea
                id="spec-input"
                value={specText}
                placeholder={SPEC_PLACEHOLDER}
                onChange={(event) => setSpecText(event.target.value)}
              />
            </SpecField>
          ) : (
            <PhotoField>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} hidden />
              {photoPreviewUrl ? (
                <div className="preview">
                  <img src={photoPreviewUrl} alt="업로드한 사양 사진" />
                  <button type="button" aria-label="사진 삭제" onClick={() => setPhoto(null)}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button type="button" className="dropzone" onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus size={28} aria-hidden="true" />
                  <strong>사양 사진 올리기</strong>
                  <span>본체 스티커, 시스템 정보 화면 캡처 등</span>
                </button>
              )}
            </PhotoField>
          )}

          <Result>
            <div>
              <span>예상 매입금액</span>
              <small>단가표 기준 · 검수 후 확정</small>
            </div>
            <strong>{mode === 'text' ? formatWon(estimate.total) : photo ? '사진 확인 후 안내' : '0원'}</strong>
          </Result>

          {mode === 'text' && estimate.lines.length > 0 && (
            <Lines>
              {estimate.lines.map((line, index) => (
                <li key={`${line.label}-${index}`}>
                  <span title={line.itemName}>{line.label}</span>
                  <span>{formatWon(line.price * line.quantity)}</span>
                </li>
              ))}
            </Lines>
          )}

          <ActionRow>
            <Button $size="lg" $block disabled={!canApply} onClick={() => setIsRequestOpen(true)} icon={mode === 'photo' ? <Camera size={16} /> : undefined}>
              이 견적으로 매입신청
            </Button>
            <Button $size="lg" $variant="kakao" icon={<MessageCircle size={16} />}>
              카톡 상담
            </Button>
          </ActionRow>
        </QuoteCard>
      </Inner>

      <PurchaseRequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        onSubmitted={handleRequestSubmitted}
        itemsText={requestItemsText}
        estimateTotal={mode === 'text' ? estimate.total : 0}
        photo={mode === 'photo' ? photo : null}
      />
    </Hero>
  );
}

const Hero = styled.section`
  padding: 5rem 0 6rem;
  background: ${({ theme }) => theme.colors.background};

  ${({ theme }) => theme.media.tablet} {
    padding: 3.5rem 0 4.5rem;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 2rem 0 3rem;
  }
`;

const Inner = styled(Container)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 32.5rem);
  align-items: center;
  gap: 4rem;

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.5rem;
  }

  ${({ theme }) => theme.media.mobile} {
    gap: 1.75rem;
  }
`;

const Copy = styled.div`
  & > .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    height: 1.875rem;
    padding: 0 0.75rem;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.8125rem;
    font-weight: 700;
  }

  & > h2 {
    margin-top: 1.25rem;
    font-size: 2.75rem;
    line-height: 1.22;
    font-weight: 800;
    letter-spacing: -0.035em;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > h2 > em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > p {
    max-width: 28.75rem;
    margin-top: 1.25rem;
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem 1.25rem;
    margin-top: 2rem;
  }

  & > ul > li {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  & > ul svg { color: ${({ theme }) => theme.colors.primary}; }

  ${({ theme }) => theme.media.tablet} {
    & > h2 { font-size: 2.25rem; }
  }

  ${({ theme }) => theme.media.mobile} {
    & > h2 { margin-top: 0.875rem; font-size: 1.75rem; }
    & > p { margin-top: 0.75rem; font-size: 0.9375rem; }
    & > ul { margin-top: 1.25rem; gap: 0.5rem 0.875rem; }
    & > ul > li { font-size: 0.8125rem; }
  }

  ${({ theme }) => theme.media.small} {
    & > h2 { font-size: 1.5625rem; }
  }
`;

const QuoteCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};

  ${({ theme }) => theme.media.mobile} {
    gap: 0.75rem;
    padding: 1rem;
  }
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};

  & > button {
    height: 2.25rem;
    border-radius: 0.4375rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > button.active {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.ink};
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.1);
  }
`;

const SpecField = styled.div`
  & > textarea {
    display: block;
    width: 100%;
    height: 10.5rem;
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surface};
    font-size: 0.9375rem;
    line-height: 1.6;
    resize: none;
  }

  & > textarea::placeholder { color: ${({ theme }) => theme.colors.subtle}; }

  & > textarea:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }

  ${({ theme }) => theme.media.mobile} {
    & > textarea { height: 9.25rem; padding: 0.875rem; font-size: 0.875rem; }
  }
`;

const PhotoField = styled.div`
  & > .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    width: 100%;
    height: 10.5rem;
    padding: 1rem;
    border: 1.5px dashed ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radius.md};
    color: ${({ theme }) => theme.colors.muted};
    text-align: center;
    transition: border-color 0.15s ease, background 0.15s ease;
  }

  & > .dropzone:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }

  & > .dropzone > strong {
    font-size: 0.9375rem;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > .dropzone > span { font-size: 0.8125rem; }

  & > .preview {
    position: relative;
    height: 10.5rem;
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.background};
  }

  & > .preview > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  & > .preview > button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: grid;
    place-items: center;
    width: 1.875rem;
    height: 1.875rem;
    border-radius: 50%;
    background: rgba(17, 24, 39, 0.7);
    color: #fff;
  }

  ${({ theme }) => theme.media.mobile} {
    & > .dropzone, & > .preview { height: 9.25rem; }
  }
`;

const Result = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.125rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.dark};
  color: #fff;

  & > div { display: flex; flex-direction: column; min-width: 0; }
  & > div > span { font-size: 0.875rem; font-weight: 600; }
  & > div > small { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); }

  & > strong {
    font-size: 1.625rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-align: right;
    word-break: break-all;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 0.875rem 1rem;
    & > strong { font-size: 1.25rem; }
  }

  ${({ theme }) => theme.media.small} {
    flex-direction: column;
    align-items: flex-start;
    & > strong { text-align: left; }
  }
`;

const Lines = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  max-height: 7rem;
  overflow-y: auto;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.muted};

  & > li {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
  }

  & > li > span:first-child {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > li > span:last-child {
    flex-shrink: 0;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.ink};
  }
`;

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.5rem;

  ${({ theme }) => theme.media.small} {
    grid-template-columns: minmax(0, 1fr);
  }
`;
