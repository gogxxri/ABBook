import type { PriceItem } from '../types/db';

export interface EstimateLine {
  label: string;
  itemName: string;
  quantity: number;
  price: number;
}

export interface EstimateResult {
  lines: EstimateLine[];
  total: number;
}

// "x 2", "2개", "2대" 형태의 수량 추출
const parseQuantity = (line: string) => {
  const match = line.match(/(?:^|\s)[x×]\s?(\d+)\b|(\d+)\s?(?:개|대|장|세트)/i);
  const quantity = Number(match?.[1] ?? match?.[2] ?? 1);
  return quantity > 0 ? quantity : 1;
};

// 비교용 정규화 (공백·대소문자 무시)
const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, '');

// 단가표 품목의 키워드(쉼표 구분) + 품목명으로 매칭 키 생성
const toMatchKeys = (item: PriceItem) =>
  [item.name, ...item.keywords.split(',')].map((keyword) => normalize(keyword)).filter((keyword) => keyword.length >= 2);

// 입력 줄마다 가장 길게 일치하는 단가표 품목을 찾아 합산
export const estimateFromText = (text: string, priceItems: PriceItem[]): EstimateResult => {
  const candidates = priceItems.map((item) => ({ item, keys: toMatchKeys(item) }));

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap<EstimateLine>((line) => {
      const target = normalize(line);
      let best: { item: PriceItem; length: number } | null = null;

      for (const { item, keys } of candidates) {
        const matched = keys.filter((key) => target.includes(key)).sort((a, b) => b.length - a.length)[0];
        if (matched && (!best || matched.length > best.length)) best = { item, length: matched.length };
      }

      if (!best) return [];
      return [{ label: line, itemName: best.item.name, quantity: parseQuantity(line), price: best.item.price }];
    });

  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  return { lines, total };
};
