import { ArrowDown, BadgeCheck, Clock3, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '../../../components/common/Container';

const VISUAL_POINTS = [
  { icon: Clock3, label: '검수 당일 입금' },
  { icon: ShieldCheck, label: '데이터 완전 삭제' },
  { icon: BadgeCheck, label: '투명한 등급 기준' },
];

export default function MainVisual() {
  return (
    <Visual aria-labelledby="main-visual-title">
      <Inner>
        <Copy>
          <span className="eyebrow">중고 노트북 · IT기기 매입</span>
          <h1 id="main-visual-title">
            쓰던 노트북,
            <br />
            <em>제값 받고</em> 파세요
          </h1>
          <p>모델명만 알면 예상가가 바로 나와요. 신청부터 입금까지 하루면 충분합니다.</p>
          <div className="actions">
            <a href="#quote" className="primary">
              예상가 확인하기
              <ArrowDown size={16} aria-hidden="true" />
            </a>
            <Link to="/inquiries/new" className="secondary">
              매입 문의하기
            </Link>
          </div>
          <ul>
            {VISUAL_POINTS.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon size={16} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </Copy>

        <Illustration aria-hidden="true">
          <LaptopSvg />
          <div className="float float-top">
            <span>S</span>
            <div>
              <strong>미개봉급</strong>
              <small>단가표 100%</small>
            </div>
          </div>
          <div className="float float-bottom">
            <Clock3 size={18} />
            <div>
              <strong>당일 입금</strong>
              <small>검수 승인 후 즉시</small>
            </div>
          </div>
        </Illustration>
      </Inner>
    </Visual>
  );
}

// 장식용 노트북 일러스트
function LaptopSvg() {
  return (
    <svg viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mv-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E7ECF5" />
          <stop offset="1" stopColor="#B9C3D6" />
        </linearGradient>
      </defs>
      <rect x="64" y="16" width="352" height="232" rx="16" fill="#202A40" />
      <rect x="78" y="30" width="324" height="204" rx="6" fill="#0A43C2" />
      <rect x="102" y="58" width="120" height="12" rx="6" fill="#FFFFFF" fillOpacity="0.85" />
      <rect x="102" y="80" width="180" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.35" />
      <rect x="102" y="96" width="150" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.35" />
      <rect x="102" y="128" width="276" height="76" rx="10" fill="#FFFFFF" fillOpacity="0.12" />
      <rect x="118" y="146" width="70" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.5" />
      <rect x="118" y="166" width="130" height="18" rx="6" fill="#FFFFFF" />
      <circle cx="342" cy="166" r="20" fill="#FEE500" />
      <path d="M333 166l6 6 12-12" stroke="#191919" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 256h432l-18 32a12 12 0 0 1-10.5 6H52.5A12 12 0 0 1 42 288l-18-32z" fill="url(#mv-body)" />
      <rect x="200" y="256" width="80" height="8" rx="4" fill="#9AA6BD" />
    </svg>
  );
}

const Visual = styled.section`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.ink};
`;

const Inner = styled(Container)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 520px);
  align-items: center;
  gap: 48px;
  min-height: 560px;
  padding-top: 72px;
  padding-bottom: 72px;

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    padding-top: 56px;
    padding-bottom: 56px;
  }

  ${({ theme }) => theme.media.mobile} {
    gap: 32px;
    padding-top: 40px;
    padding-bottom: 44px;
  }
`;

const Copy = styled.div`
  & > .eyebrow {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > h1 {
    margin-top: 16px;
    font-size: 56px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -0.035em;
  }

  & > h1 > em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.primary};
  }

  & > p {
    max-width: 440px;
    margin-top: 20px;
    font-size: 18px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 32px;
  }

  & > .actions > a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 46px;
    padding: 0 20px;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
    transition: background 0.15s ease;
  }

  & > .actions > .primary {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }

  & > .actions > .primary:hover { background: ${({ theme }) => theme.colors.primaryHover}; }

  & > .actions > .secondary {
    border: 1px solid ${({ theme }) => theme.colors.line};
    color: ${({ theme }) => theme.colors.ink};
  }

  & > .actions > .secondary:hover { border-color: ${({ theme }) => theme.colors.subtle}; }

  & > ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    margin-top: 36px;
  }

  & > ul > li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
  }

  & > ul svg { color: ${({ theme }) => theme.colors.primary}; }

  ${({ theme }) => theme.media.tablet} {
    & > h1 { font-size: 44px; }
  }

  ${({ theme }) => theme.media.mobile} {
    & > .eyebrow { font-size: 13px; }
    & > h1 { margin-top: 12px; font-size: 32px; }
    & > p { margin-top: 14px; font-size: 15px; }
    & > .actions { margin-top: 24px; }
    & > .actions > a { flex: 1; height: 44px; padding: 0 14px; font-size: 14px; }
    & > ul { margin-top: 24px; gap: 8px 14px; }
    & > ul > li { font-size: 13px; }
  }

  ${({ theme }) => theme.media.small} {
    & > h1 { font-size: 28px; }
    & > .actions { flex-direction: column; }
    & > .actions > a { flex: none; width: 100%; }
  }
`;

const Illustration = styled.div`
  position: relative;
  width: 100%;
  max-width: 520px;
  justify-self: center;

  padding: 48px 32px 40px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primarySoft};

  & > svg {
    display: block;
    width: 100%;
    height: auto;
  }

  & > .float {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.line};
    box-shadow: ${({ theme }) => theme.shadow.card};
    color: ${({ theme }) => theme.colors.ink};
  }

  & > .float strong {
    display: block;
    font-size: 14px;
    font-weight: 800;
  }

  & > .float small {
    display: block;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.muted};
  }

  & > .float-top {
    top: 20px;
    right: -16px;
  }

  & > .float-top > span {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.primary};
    font-size: 16px;
    font-weight: 900;
    color: #fff;
  }

  & > .float-bottom {
    bottom: 20px;
    left: -16px;
  }

  & > .float-bottom > svg { color: ${({ theme }) => theme.colors.primary}; }

  ${({ theme }) => theme.media.tablet} {
    max-width: 440px;

    & > .float-top { right: 12px; }
    & > .float-bottom { left: 12px; }
  }

  ${({ theme }) => theme.media.mobile} {
    padding: 36px 20px 28px;
    border-radius: ${({ theme }) => theme.radius.md};

    & > .float { gap: 8px; padding: 8px 10px; }
    & > .float-top { top: 10px; right: 8px; }
    & > .float-bottom { bottom: 10px; left: 8px; }
    & > .float strong { font-size: 12px; }
    & > .float small { font-size: 11px; }
    & > .float-top > span { width: 28px; height: 28px; font-size: 14px; }
  }
`;
