export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10">
        <div className="lg:col-span-7 bg-gray-200 dark:bg-gray-800 rounded-2xl aspect-[16/10] sm:aspect-[16/11]" />
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl min-h-[170px]" />)}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-72" />)}
        </div>
        <div className="lg:col-span-4 space-y-4"><div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-80" /><div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-60" /></div>
      </div>
    </div>
  );
}
