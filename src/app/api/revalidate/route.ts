import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-revalidate-secret') || request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.REVALIDATE_SECRET && secret !== 'news_portal_secret_123') {
      return NextResponse.json({ message: 'Invalid Secret Token' }, { status: 401 });
    }

    const path = request.nextUrl.searchParams.get('path') || '/';
    const category = request.nextUrl.searchParams.get('category');
    const slug = request.nextUrl.searchParams.get('slug');
    revalidatePath('/');
    if (category) revalidatePath(`/category/${category}`);
    if (slug) revalidatePath(`/news/${slug}`);

    return NextResponse.json({ revalidated: true, path, timestamp: new Date().toISOString() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error revalidating', error: message }, { status: 500 });
  }
}
