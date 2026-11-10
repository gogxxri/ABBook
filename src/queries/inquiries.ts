import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  answerInquiry,
  createInquiry,
  deleteInquiryByAdmin,
  deleteInquiryWithPassword,
  fetchAdminInquiries,
  fetchInquiryPage,
  fetchInquiryPhotoUrlsForAdmin,
  fetchInquiryPhotoUrlsWithPassword,
  fetchInquiryWithPassword,
} from '../api/inquiries';
import { isSupabaseConfigured } from '../lib/supabase';
import type { InquiryStatus } from '../types/db';
import { queryKeys } from './keys';

export const useInquiryPageQuery = (page: number, size: number) =>
  useQuery({
    queryKey: queryKeys.inquiries.page(page, size),
    queryFn: () => fetchInquiryPage(page, size),
    placeholderData: keepPreviousData,
    enabled: isSupabaseConfigured,
  });

export const useCreateInquiryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInquiry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.all }),
  });
};

// 비밀번호 확인은 캐시하지 않도록 mutation 으로 처리
export const useVerifyInquiryMutation = () =>
  useMutation({ mutationFn: ({ id, password }: { id: number; password: string }) => fetchInquiryWithPassword(id, password) });

// 사진 임시 URL 은 10분 유효 → 9분 캐시, 비밀번호는 key 에 넣지 않음
const PHOTO_URL_STALE_TIME = 1000 * 60 * 9;

export const useInquiryPhotosQuery = (id: number, password: string, enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.inquiries.photos(id),
    queryFn: () => fetchInquiryPhotoUrlsWithPassword(id, password),
    enabled,
    staleTime: PHOTO_URL_STALE_TIME,
    retry: false,
  });

export const useAdminInquiryPhotosQuery = (id: number, paths: string[]) =>
  useQuery({
    queryKey: [...queryKeys.inquiries.photos(id), 'admin'],
    queryFn: () => fetchInquiryPhotoUrlsForAdmin(paths),
    enabled: paths.length > 0,
    staleTime: PHOTO_URL_STALE_TIME,
  });

export const useDeleteInquiryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) => deleteInquiryWithPassword(id, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.all }),
  });
};

export const useAdminInquiriesQuery = (status: InquiryStatus | 'all') =>
  useQuery({ queryKey: queryKeys.inquiries.admin(status), queryFn: () => fetchAdminInquiries(status) });

export const useAnswerInquiryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, answer }: { id: number; answer: string }) => answerInquiry(id, answer),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.all }),
  });
};

export const useAdminDeleteInquiryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInquiryByAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.all }),
  });
};
