export default function ArticleShare({ url, title }: { url: string; title: string }) {
	return <div aria-label="Share article" data-url={url} data-title={title} />;
}
