export default function RelatedArticles({ category, currentSlug }: { category: string; currentSlug: string }) {
	return <section aria-label="Related articles" data-category={category} data-current-slug={currentSlug} />;
}
