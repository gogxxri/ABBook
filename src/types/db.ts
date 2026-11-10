// Supabase 테이블·RPC 응답 타입 (supabase/schema.sql 기준)

export type InquiryStatus = 'waiting' | 'answered';
export type SellMethodKey = 'visit' | 'parcel' | 'store' | 'quick';
export type RequestStatus = 'received' | 'inspecting' | 'completed' | 'canceled';

export interface InquiryListItem {
  id: number;
  title: string;
  author_masked: string;
  status: InquiryStatus;
  created_at: string;
}

export interface InquiryDetail {
  id: number;
  title: string;
  content: string;
  author_name: string;
  status: InquiryStatus;
  answer: string | null;
  answered_at: string | null;
  photo_paths: string[];
  created_at: string;
}

export interface InquiryCreateInput {
  title: string;
  content: string;
  author: string;
  password: string;
  photos: File[];
}

export interface PriceCategory {
  id: number;
  key: string;
  label: string;
  sort_order: number;
}

export interface PriceItem {
  id: number;
  category_id: number;
  name: string;
  keywords: string;
  price: number;
  updated_at: string;
}

export type PriceItemInput = Pick<PriceItem, 'category_id' | 'name' | 'keywords' | 'price'>;

export interface PurchaseRequest {
  id: number;
  customer_name: string;
  phone: string;
  method: SellMethodKey;
  items_text: string;
  estimate_total: number;
  photo_path: string | null;
  memo: string | null;
  status: RequestStatus;
  admin_memo: string | null;
  created_at: string;
}

export interface PurchaseRequestInput {
  customer_name: string;
  phone: string;
  method: SellMethodKey;
  items_text: string;
  estimate_total: number;
  memo: string;
  photo: File | null;
}

export interface Review {
  id: number;
  title: string;
  items: string;
  region: string;
  is_published: boolean;
  created_at: string;
}

export type ReviewInput = Pick<Review, 'title' | 'items' | 'region' | 'is_published'>;

export interface PageResult<T> {
  content: T[];
  totalCount: number;
  totalPages: number;
}
