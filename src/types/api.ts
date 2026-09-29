import type { Article } from './article';

export type ArticleListResponse = { articles: Article[]; total?: number };
