import type { InquiryStatus, RequestStatus, SellMethodKey } from '../types/db';

// 메인 화면 고정 문구 (통계·회사 정보는 실제 값으로 교체 필요)

export interface SellMethod {
  key: SellMethodKey;
  title: string;
  description: string;
  badge?: string;
}

export interface TrustStat {
  label: string;
  value: number;
  unit: string;
}

export const NAV_ITEMS = [
  { label: 'AI 견적', href: '/#quote' },
  { label: '매입 방법', href: '/#methods' },
  { label: '단가표', href: '/#prices' },
  { label: '매입문의', href: '/inquiries' },
  { label: '매입 후기', href: '/#reviews' },
  { label: '회사 소개', href: '/#about' },
] as const;

export const SELL_METHODS: SellMethod[] = [
  { key: 'visit', title: '출장 매입', description: '담당자가 직접 방문해 포장부터 운반까지 처리해요', badge: '대량' },
  { key: 'parcel', title: '택배 매입', description: '전국 어디서나 박스에 담아 보내기만 하면 끝' },
  { key: 'store', title: '방문 매입', description: '매장에서 바로 테스트하고 그 자리에서 정산해요' },
  { key: 'quick', title: '퀵 매입', description: '급하게 처분해야 할 때 당일 퀵으로 빠르게' },
];

export const TRUST_STATS: TrustStat[] = [
  { label: '누적 방문자', value: 1250000, unit: '명' },
  { label: '매입 완료', value: 38420, unit: '건' },
  { label: '누적 매입액', value: 12.8, unit: '억 원' },
];

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  waiting: '답변대기',
  answered: '답변완료',
};

export const SELL_METHOD_LABEL: Record<SellMethodKey, string> = {
  visit: '출장 매입',
  parcel: '택배 매입',
  store: '방문 매입',
  quick: '퀵 매입',
};

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  received: '접수',
  inspecting: '검수중',
  completed: '완료',
  canceled: '취소',
};

export const SERVER_FEATURES = ['IDC 철수·전산실 이전', '현장 실사 및 견적', '데이터 완전 파기 인증서 발급'];

export const COMPANY_INFO = {
  name: '(주)에이비북',
  ceo: '홍길동',
  businessNumber: '000-00-00000',
  address: '서울특별시 OO구 OO로 00, 0층',
  phone: '1588-0000',
  directPhones: ['010-0000-0000', '010-1111-1111'],
  email: 'help@abbook.example',
  hours: '평일 09:00 – 18:00 · 토요일 10:00 – 15:00',
};

export const FOOTER_LINKS = ['회사소개', '전국지점', '가맹문의', '이용약관', '개인정보처리방침'];
