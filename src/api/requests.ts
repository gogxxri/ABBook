import { supabase } from '../lib/supabase';
import type { PurchaseRequest, PurchaseRequestInput, RequestStatus } from '../types/db';

const PHOTO_BUCKET = 'request-photos';

export const createPurchaseRequest = async ({ photo, ...input }: PurchaseRequestInput) => {
  let photoPath: string | null = null;

  if (photo) {
    const extension = photo.name.split('.').pop() ?? 'jpg';
    photoPath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from(PHOTO_BUCKET).upload(photoPath, photo);
    if (uploadError) throw uploadError;
  }

  // 일반 사용자는 조회 권한이 없어 insert 결과를 반환받지 않음
  const { error } = await supabase.from('purchase_requests').insert({ ...input, memo: input.memo || null, photo_path: photoPath });
  if (error) throw error;
};

// 관리자 전용
export const fetchPurchaseRequests = async (status: RequestStatus | 'all'): Promise<PurchaseRequest[]> => {
  let query = supabase.from('purchase_requests').select('*').order('created_at', { ascending: false });
  if (status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

export const updatePurchaseRequest = async (id: number, values: Pick<PurchaseRequest, 'status' | 'admin_memo'>) => {
  const { error } = await supabase.from('purchase_requests').update(values).eq('id', id);
  if (error) throw error;
};

export const createPhotoSignedUrl = async (path: string) => {
  const { data, error } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrl(path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
};
