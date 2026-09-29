type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
	return <nav aria-label="Breadcrumb">{items.map((item) => item.label).join(' > ')}</nav>;
}
