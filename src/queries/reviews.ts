import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deleteReview, fetchReviews, saveReview } from '../api/reviews';
import { isSupabaseConfigured } from '../lib/supabase';
import { queryKeys } from './keys';

export const useReviewsQuery = (limit?: number) =>
  useQuery({
    queryKey: queryKeys.reviews.list(limit),
    queryFn: () => fetchReviews(limit),
    enabled: isSupabaseConfigured,
  });

export const useSaveReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all }),
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all }),
  });
};
