import Image, { type ImageProps } from 'next/image';
export function ImageOptimized({ alt, ...props }: ImageProps) { return <Image alt={alt} {...props} />; }
