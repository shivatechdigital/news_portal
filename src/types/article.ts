export interface Article {
  id: number;
  slug: string;
  title: string;
  meta_description: string;
  content: string;
  summary: string;
  source_name: string;
  source_url: string;
  category: string;
  image_url: string;
  status: 'draft' | 'published';
  views: number;
  published_at: string;
  created_at: string;
}

export interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}
