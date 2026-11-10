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
  padding: 80px 0 96px;
  background: ${({ theme }) => theme.colors.background};

  ${({ theme }) => theme.media.tablet} {
    padding: 56px 0 72px;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 32px 0 48px;
  }
`;

const Inner = styled(Container)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 520px);
  align-items: center;
  gap: 64px;

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
  }

  ${({ theme }) => theme.media.mobile} {
    gap: 28px;
  }
`;

const Copy = styled.div`
  & > .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 12px;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 13px;
    font-weight: 700;
  }

  & > h2 {
    margin-top: 20px;
    font-size: 44px;
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
    max-width: 460px;
    margin-top: 20px;
    font-size: 18px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > ul {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
    margin-top: 32px;
  }

  & > ul > li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  & > ul svg { color: ${({ theme }) => theme.colors.primary}; }

  ${({ theme }) => theme.media.tablet} {
    & > h2 { font-size: 36px; }
  }

  ${({ theme }) => theme.media.mobile} {
    & > h2 { margin-top: 14px; font-size: 28px; }
    & > p { margin-top: 12px; font-size: 15px; }
    & > ul { margin-top: 20px; gap: 8px 14px; }
    & > ul > li { font-size: 13px; }
  }

  ${({ theme }) => theme.media.small} {
    & > h2 { font-size: 25px; }
  }
`;

const QuoteCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};

  ${({ theme }) => theme.media.mobile} {
    gap: 12px;
    padding: 16px;
  }
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};

  & > button {
    height: 36px;
    border-radius: 7px;
    font-size: 14px;
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
    height: 168px;
    padding: 16px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surface};
    font-size: 15px;
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
    & > textarea { height: 148px; padding: 14px; font-size: 14px; }
  }
`;

const PhotoField = styled.div`
  & > .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    height: 168px;
    padding: 16px;
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
    font-size: 15px;
    color: ${({ theme }) => theme.colors.ink};
  }

  & > .dropzone > span { font-size: 13px; }

  & > .preview {
    position: relative;
    height: 168px;
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
    top: 8px;
    right: 8px;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(17, 24, 39, 0.7);
    color: #fff;
  }

  ${({ theme }) => theme.media.mobile} {
    & > .dropzone, & > .preview { height: 148px; }
  }
`;

const Result = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.dark};
  color: #fff;

  & > div { display: flex; flex-direction: column; min-width: 0; }
  & > div > span { font-size: 14px; font-weight: 600; }
  & > div > small { font-size: 12px; color: rgba(255, 255, 255, 0.6); }

  & > strong {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-align: right;
    word-break: break-all;
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 14px 16px;
    & > strong { font-size: 20px; }
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
  gap: 6px;
  max-height: 112px;
  overflow-y: auto;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};

  & > li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
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
  gap: 8px;

  ${({ theme }) => theme.media.small} {
    grid-template-columns: minmax(0, 1fr);
  }
`;
