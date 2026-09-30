'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.shivatechdigital.com';
type CategoryResponse = { name: string; is_active: number | boolean };

export function useActiveCategories() {
  const [categories, setCategories] = useState([...siteConfig.categories]);

  useEffect(() => {
    fetch(`${API_URL}/api/categories`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((payload: { categories?: CategoryResponse[] }) => {
        const active = new Set((payload.categories || []).filter((category) => Boolean(Number(category.is_active))).map((category) => category.name));
        setCategories(siteConfig.categories.filter((category) => active.has(category.slug)));
      })
      .catch(() => undefined);
  }, []);

  return categories;
}
