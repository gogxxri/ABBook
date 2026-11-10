import { supabase } from '../lib/supabase';
import type { Review, ReviewInput } from '../types/db';

// 공개 후기 (RLS: 일반 사용자는 공개 글만, 관리자는 전체)
export const fetchReviews = async (limit?: number): Promise<Review[]> => {
  let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

// 관리자 전용
export const saveReview = async (input: ReviewInput & { id?: number }) => {
  const { id, ...values } = input;
  const { error } = id ? await supabase.from('reviews').update(values).eq('id', id) : await supabase.from('reviews').insert(values);
  if (error) throw error;
};

export const deleteReview = async (id: number) => {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
};
