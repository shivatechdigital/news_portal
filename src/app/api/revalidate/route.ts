import { NextResponse } from 'next/server';

export function POST() {
  return NextResponse.json({ revalidated: false, message: 'Configure revalidation before use.' });
}
