'use client';

import useSWR from 'swr';
import type { ArticleListResponse } from '@/types/api';
import api from '@/lib/api';

export function useArticles() {
  return useSWR<ArticleListResponse>('/search', (url: string) => api.get<ArticleListResponse>(url).then(({ data }) => data));
}
