import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-revalidate-token') || req.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.REVALIDATION_SECRET || 'sanchay_revalidate_secret_key';

    if (secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized secret token' }, { status: 401 });
    }

    const path = req.nextUrl.searchParams.get('path') || '/';
    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
