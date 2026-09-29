interface AdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

export default function AdBanner({ format = 'horizontal', className = '' }: AdBannerProps) {
  return (
    <div className={`bg-gray-100 dark:bg-gray-800/60 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-3 text-center overflow-hidden my-6 ${format === 'horizontal' ? 'h-24 sm:h-28 w-full' : 'h-64 w-full'} ${className}`}>
      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Advertisement</span>
      <span className="text-xs text-gray-400 dark:text-gray-500">Responsive Ad Banner Slot ({format === 'horizontal' ? '728x90' : '300x250'})</span>
    </div>
  );
}
