import type { Article } from '@/types/article';

export default function ArticleHeader({ article }: { article: Article }) {
	return <header><h1>{article.title}</h1></header>;
}
