import type { InquiryStatus, RequestStatus, SellMethodKey } from '../types/db';

// 메인 화면 고정 문구 (회사 정보는 실제 값으로 교체 필요)

export interface SellMethod {
  key: SellMethodKey;
  title: string;
  description: string;
  badge?: string;
}

export interface SellStep {
  title: string;
  description: string;
  meta: string;
}

export type ConditionGrade = 'S' | 'A' | 'B' | 'C';

export interface GradeGuide {
  grade: ConditionGrade;
  name: string;
  priceRate: string;
  criteria: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const NAV_ITEMS = [
  { label: 'AI 견적', href: '/#quote' },
  { label: '판매 과정', href: '/#process' },
  { label: '등급 기준', href: '/#grades' },
  { label: '단가표', href: '/#prices' },
  { label: '매입문의', href: '/inquiries' },
  { label: 'FAQ', href: '/#faq' },
] as const;

export const SELL_METHODS: SellMethod[] = [
  { key: 'visit', title: '출장 매입', description: '담당자가 직접 방문해 포장부터 운반까지 처리해요', badge: '대량' },
  { key: 'parcel', title: '택배 매입', description: '전국 어디서나 박스에 담아 보내기만 하면 끝' },
  { key: 'store', title: '방문 매입', description: '매장에서 바로 테스트하고 그 자리에서 정산해요' },
  { key: 'quick', title: '퀵 매입', description: '급하게 처분해야 할 때 당일 퀵으로 빠르게' },
];

export const SELL_STEPS: SellStep[] = [
  { title: '예상가 확인', description: 'AI 견적이나 단가표로 받을 금액을 먼저 확인해요.', meta: '1분' },
  { title: '매입 신청', description: '연락처와 희망 방법(택배·출장·방문·퀵)을 남기면 담당자가 연락드려요.', meta: '3분' },
  { title: '정밀 검수', description: '입고 후 성능·외관을 점검하고, 견적과 차이가 있으면 사진과 함께 안내해요.', meta: '입고 당일' },
  { title: '당일 입금', description: '최종 금액에 동의하시면 그날 바로 계좌로 입금해요.', meta: '승인 후 즉시' },
];

export const GRADE_GUIDES: GradeGuide[] = [
  { grade: 'S', name: '미개봉급', priceRate: '단가표 100%', criteria: ['사용 흔적 거의 없음', '배터리 성능 90% 이상', '구성품 모두 보유'] },
  { grade: 'A', name: '깨끗함', priceRate: '단가표 85~95%', criteria: ['생활 기스 약간', '모든 기능 정상', '충전기 보유'] },
  { grade: 'B', name: '사용감 있음', priceRate: '단가표 65~80%', criteria: ['눈에 띄는 찍힘·기스', '배터리 효율 저하', '키보드 번들거림'] },
  { grade: 'C', name: '부품용', priceRate: '단가표 30~60%', criteria: ['액정 파손·멍', '부팅 불량 등 기능 이상', '침수·개조 이력'] },
];

export const FAQ_ITEMS: FaqItem[] = [
  { question: 'AI 견적 금액 그대로 받을 수 있나요?', answer: 'AI 견적은 단가표 기준 예상 금액이에요. 입고 후 검수에서 상태 등급이 확정되며, 차이가 생기면 사진과 함께 먼저 안내드리고 동의하신 경우에만 진행해요.' },
  { question: '고장 나거나 액정이 깨진 제품도 매입하나요?', answer: '네, C등급(부품용)으로 매입해요. 부팅이 안 되거나 액정이 파손된 제품도 부품 가치를 기준으로 금액을 안내드려요.' },
  { question: '저장된 데이터는 어떻게 처리되나요?', answer: '판매 전 초기화를 권장드리지만, 입고된 모든 저장장치는 전용 도구로 완전 삭제한 뒤 재판매하거나 폐기해요.' },
  { question: '입금은 언제 되나요?', answer: '검수 결과에 동의하시면 당일 입금이 원칙이에요. 영업시간 이후 입고분은 다음 영업일 오전에 입금돼요.' },
  { question: '택배비는 누가 부담하나요?', answer: '매입이 확정되면 택배비는 저희가 부담해요. 금액에 동의하지 않아 반송하는 경우에만 왕복 택배비가 발생해요.' },
  { question: '대량 매입도 가능한가요?', answer: '사무실·PC방·학교 등 대량 장비는 출장 매입으로 현장에서 검수하고 일괄 정산해 드려요. 매입문의로 수량과 지역을 남겨주세요.' },
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
