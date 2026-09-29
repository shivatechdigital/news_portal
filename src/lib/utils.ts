export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length).trim()}...` : value;
}
