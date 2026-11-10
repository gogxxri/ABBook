// 금액·수치 표시 형식
export const formatNumber = (value: number) => value.toLocaleString('ko-KR');

export const formatWon = (value: number) => `${formatNumber(value)}원`;
