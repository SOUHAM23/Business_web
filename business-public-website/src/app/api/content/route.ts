import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany({
      where: { isPublished: true },
    });

    const contentMap: Record<string, string> = {};
    for (const item of contents) {
      contentMap[item.contentKey] = item.contentValue;
    }

    return NextResponse.json({ success: true, content: contentMap });
  } catch (err: any) {
    console.error('Error fetching site_content:', err);
    return NextResponse.json({ success: false, content: {} }, { status: 500 });
  }
}
