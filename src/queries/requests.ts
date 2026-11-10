import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPhotoSignedUrl, createPurchaseRequest, fetchPurchaseRequests, updatePurchaseRequest } from '../api/requests';
import type { PurchaseRequest, RequestStatus } from '../types/db';
import { queryKeys } from './keys';

export const useCreatePurchaseRequestMutation = () => useMutation({ mutationFn: createPurchaseRequest });

export const usePurchaseRequestsQuery = (status: RequestStatus | 'all') =>
  useQuery({ queryKey: queryKeys.requests.admin(status), queryFn: () => fetchPurchaseRequests(status) });

export const useUpdatePurchaseRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...values }: Pick<PurchaseRequest, 'id' | 'status' | 'admin_memo'>) => updatePurchaseRequest(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.requests.all }),
  });
};

// 서명 URL 은 10분 유효 → 9분 동안 캐시
export const useRequestPhotoUrlQuery = (path: string | null) =>
  useQuery({
    queryKey: queryKeys.requests.photo(path ?? ''),
    queryFn: () => createPhotoSignedUrl(path!),
    enabled: Boolean(path),
    staleTime: 1000 * 60 * 9,
  });
