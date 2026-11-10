// 기능별 query key
export const queryKeys = {
  inquiries: {
    all: ['inquiries'] as const,
    page: (page: number, size: number) => ['inquiries', 'page', page, size] as const,
    admin: (status: string) => ['inquiries', 'admin', status] as const,
    photos: (id: number) => ['inquiries', 'photos', id] as const,
  },
  requests: {
    all: ['requests'] as const,
    admin: (status: string) => ['requests', 'admin', status] as const,
    photo: (path: string) => ['requests', 'photo', path] as const,
  },
  prices: {
    categories: ['prices', 'categories'] as const,
    items: ['prices', 'items'] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    list: (limit?: number) => ['reviews', 'list', limit ?? 'all'] as const,
  },
};
