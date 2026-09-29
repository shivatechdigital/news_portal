type SearchPageProps = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  return <main><h1>Search results</h1><p>{q ? `Results for ${q}` : 'Search the latest news.'}</p></main>;
}
