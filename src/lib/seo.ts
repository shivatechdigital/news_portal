import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export function articleMetadata(title: string, description?: string): Metadata {
  return { title: `${title} | ${siteConfig.name}`, description: description ?? siteConfig.description };
}
