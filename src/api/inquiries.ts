import { supabase } from '../lib/supabase';
import { resizeImage } from '../utils/image';
import type { InquiryCreateInput, InquiryDetail, InquiryListItem, InquiryStatus, PageResult } from '../types/db';

// page: 1부터 시작 (Supabase range 는 0-based offset 으로 변환)
export const fetchInquiryPage = async (page: number, size: number): Promise<PageResult<InquiryListItem>> => {
  const from = (page - 1) * size;
  const { data, error, count } = await supabase
    .from('inquiry_list')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + size - 1);
  if (error) throw error;
  const totalCount = count ?? 0;
  return { content: data ?? [], totalCount, totalPages: Math.ceil(totalCount / size) };
};

const PHOTO_BUCKET = 'inquiry-photos';

// 사진을 비공개 버킷에 올리고 경로 목록 반환
const uploadInquiryPhotos = async (photos: File[]) => {
  const folder = `inquiries/${new Date().toISOString().slice(0, 10)}`;
  return Promise.all(
    photos.map(async (photo) => {
      const blob = await resizeImage(photo);
      const path = `${folder}/${crypto.randomUUID()}.jpg`;
      const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: blob.type || 'image/jpeg' });
      if (error) throw error;
      return path;
    }),
  );
};

export const createInquiry = async ({ photos, ...input }: InquiryCreateInput) => {
  const photoPaths = await uploadInquiryPhotos(photos);
  const { data, error } = await supabase.rpc('create_inquiry', {
    p_title: input.title,
    p_content: input.content,
    p_author: input.author,
    p_password: input.password,
    p_photo_paths: photoPaths,
  });
  if (error) throw error;
  return data as number;
};

export const fetchInquiryWithPassword = async (id: number, password: string) => {
  const { data, error } = await supabase.rpc('get_inquiry', { p_id: id, p_password: password });
  if (error) throw error;
  return (data as InquiryDetail[])[0];
};

// 작성자: Edge Function 에서 비밀번호 확인 후 사진 임시 URL 발급
export const fetchInquiryPhotoUrlsWithPassword = async (id: number, password: string) => {
  const { data, error } = await supabase.functions.invoke<{ urls: string[] }>('inquiry-photos', { body: { id, password } });
  if (error) throw error;
  return data?.urls ?? [];
};

export const deleteInquiryWithPassword = async (id: number, password: string) => {
  const { error } = await supabase.rpc('delete_inquiry', { p_id: id, p_password: password });
  if (error) throw error;
};

// 관리자 전용
export const fetchAdminInquiries = async (status: InquiryStatus | 'all'): Promise<InquiryDetail[]> => {
  let query = supabase
    .from('inquiries')
    .select('id, title, content, author_name, status, answer, answered_at, photo_paths, created_at')
    .order('created_at', { ascending: false });
  if (status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

// 관리자: 직접 서명 URL 발급 (storage RLS 로 관리자만 허용)
export const fetchInquiryPhotoUrlsForAdmin = async (paths: string[]) => {
  const { data, error } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrls(paths, 60 * 10);
  if (error) throw error;
  return data.map((item) => item.signedUrl).filter((url): url is string => Boolean(url));
};

export const answerInquiry = async (id: number, answer: string) => {
  const trimmed = answer.trim();
  const { error } = await supabase
    .from('inquiries')
    .update({
      answer: trimmed || null,
      status: trimmed ? 'answered' : 'waiting',
      answered_at: trimmed ? new Date().toISOString() : null,
    })
    .eq('id', id);
  if (error) throw error;
};

export const deleteInquiryByAdmin = async (id: number) => {
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw error;
};
