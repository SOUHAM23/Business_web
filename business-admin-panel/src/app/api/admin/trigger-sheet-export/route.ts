import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processBatchSheetSync, BATCH_SIZE } from '@/lib/sheetBatchSync';
import { getAuthenticatedAdminServer } from '@/lib/serverAuth';

export async function GET(req: NextRequest) {
  try {
    // Authorize admin session
    const admin = await getAuthenticatedAdminServer();
    const internalSecret = req.headers.get('x-internal-secret');
    const isInternal = internalSecret && internalSecret === process.env.REVALIDATION_SECRET;

    if (!admin && !isInternal) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const pendingCount = await prisma.enquiry.count({
      where: { syncedToSheet: false } as any,
    });

    const lastExport = await prisma.sheetExport.findFirst({
      where: { status: 'SUCCESS' },
      orderBy: { completedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      pendingCount,
      batchSize: BATCH_SIZE,
      lastSyncedAt: lastExport?.completedAt || null,
      isConnected: true,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authorize admin session or internal website batch trigger
    const admin = await getAuthenticatedAdminServer();
    const internalSecret = req.headers.get('x-internal-secret');
    const isInternal = internalSecret && internalSecret === process.env.REVALIDATION_SECRET;

    if (!admin && !isInternal) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const userAccessToken = body.userAccessToken || req.headers.get('x-google-user-token');
    const forceSync = body.forceSync !== undefined ? body.forceSync : true;

    // Run batch sync processor
    const result = await processBatchSheetSync({
      userAccessToken,
      forceSync,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        syncedCount: result.syncedCount,
        remainingPending: result.remainingPending,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || result.message || 'Synchronization failed.',
          pendingCount: result.pendingCount,
        },
        { status: result.reason === 'BELOW_BATCH_THRESHOLD' ? 200 : 400 }
      );
    }
  } catch (error: any) {
    console.error('Trigger Sheet Export API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
