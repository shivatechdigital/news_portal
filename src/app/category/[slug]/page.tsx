type CategoryPageProps = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <main><h1>{slug} news</h1></main>;
}
