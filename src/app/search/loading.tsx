export default function SearchLoading() {
  return <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse"><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-6" /><div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl w-full" />)}</div></div>;
}