import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deletePriceItem, fetchPriceCategories, fetchPriceItems, savePriceItem } from '../api/prices';
import { isSupabaseConfigured } from '../lib/supabase';
import { queryKeys } from './keys';

// 단가표는 자주 바뀌지 않아 5분 캐시
const PRICE_STALE_TIME = 1000 * 60 * 5;

export const usePriceCategoriesQuery = () =>
  useQuery({
    queryKey: queryKeys.prices.categories,
    queryFn: fetchPriceCategories,
    staleTime: PRICE_STALE_TIME,
    enabled: isSupabaseConfigured,
  });

export const usePriceItemsQuery = () =>
  useQuery({
    queryKey: queryKeys.prices.items,
    queryFn: fetchPriceItems,
    staleTime: PRICE_STALE_TIME,
    enabled: isSupabaseConfigured,
  });

export const useSavePriceItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: savePriceItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.prices.items }),
  });
};

export const useDeletePriceItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePriceItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.prices.items }),
  });
};
