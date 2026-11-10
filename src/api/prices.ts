import { supabase } from '../lib/supabase';
import type { PriceCategory, PriceItem, PriceItemInput } from '../types/db';

export const fetchPriceCategories = async (): Promise<PriceCategory[]> => {
  const { data, error } = await supabase.from('price_categories').select('*').order('sort_order');
  if (error) throw error;
  return data ?? [];
};

export const fetchPriceItems = async (): Promise<PriceItem[]> => {
  const { data, error } = await supabase.from('price_items').select('*').order('category_id').order('price', { ascending: false });
  if (error) throw error;
  return data ?? [];
};

// 관리자 전용
export const savePriceItem = async (input: PriceItemInput & { id?: number }) => {
  const { id, ...values } = input;
  const payload = { ...values, updated_at: new Date().toISOString() };
  const { error } = id
    ? await supabase.from('price_items').update(payload).eq('id', id)
    : await supabase.from('price_items').insert(payload);
  if (error) throw error;
};

export const deletePriceItem = async (id: number) => {
  const { error } = await supabase.from('price_items').delete().eq('id', id);
  if (error) throw error;
};
