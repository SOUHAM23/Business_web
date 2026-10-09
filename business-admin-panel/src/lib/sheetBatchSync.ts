import { prisma } from '@/lib/prisma';
import { autoProvisionUserDrive, syncLeadsToUserSheet } from '@/lib/googleDriveUserSync';

export const BATCH_SIZE = 4;

interface SyncOptions {
  userAccessToken?: string | null;
  forceSync?: boolean; // If true (e.g. Admin clicks "Sync Now"), sync ALL pending leads even if < 4
}

export async function processBatchSheetSync(options: SyncOptions = {}) {
  const { userAccessToken, forceSync = false } = options;

  // 1. Fetch pending unsynced enquiries from Supabase
  const pendingEnquiries = await prisma.enquiry.findMany({
    where: { syncedToSheet: false } as any,
    orderBy: { createdAt: 'asc' },
    include: {
      customer: true,
    },
  });

  const pendingCount = pendingEnquiries.length;

  // 2. Check threshold condition if not manually forced
  if (!forceSync && pendingCount < BATCH_SIZE) {
    return {
      success: false,
      reason: 'BELOW_BATCH_THRESHOLD',
      pendingCount,
      message: `Pending leads (${pendingCount}) is less than batch size (${BATCH_SIZE}). Leads remain safely pending in Supabase.`,
    };
  }

  if (pendingCount === 0) {
    return {
      success: true,
      reason: 'NO_PENDING_LEADS',
      pendingCount: 0,
      message: 'All leads are already synchronized with Google Sheets.',
    };
  }

  // 3. Determine leads to sync in this batch
  const batchToSync = forceSync ? pendingEnquiries : pendingEnquiries.slice(0, BATCH_SIZE);

  // 4. Build complete formatted rows for Google Sheets
  const allEnquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'asc' },
    include: { customer: true },
  });

  const rows = [
    ['Date', 'Customer Name', 'Mobile', 'Email', 'Age', 'Location', 'Service', 'Source', 'Status', 'Message'],
    ...allEnquiries.map((e: any) => [
      e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN') : '',
      e.customer?.name || 'N/A',
      e.customer?.phone || 'N/A',
      e.customer?.email || 'N/A',
      (e.age || e.customer?.age) ? String(e.age || e.customer?.age) : 'N/A',
      e.customer?.location || 'N/A',
      e.service || 'N/A',
      e.source || 'N/A',
      e.status || 'NEW',
      e.message || '',
    ]),
  ];

  // 5. Attempt Google Sheets Update via User OAuth Token
  if (userAccessToken) {
    try {
      const assets = await autoProvisionUserDrive(userAccessToken);
      const ok = await syncLeadsToUserSheet(userAccessToken, assets.spreadsheetId, rows);

      if (ok) {
        // Mark synced enquiries as syncedToSheet = true
        const syncedIds = batchToSync.map((e) => e.id);
        await prisma.enquiry.updateMany({
          where: { id: { in: syncedIds } } as any,
          data: {
            syncedToSheet: true,
            syncedAt: new Date(),
          } as any,
        });

        // Log export run
        await prisma.sheetExport.create({
          data: {
            completedAt: new Date(),
            status: 'SUCCESS',
            type: forceSync ? 'MANUAL_SYNC_NOW' : 'BATCH_SYNC',
            rowCount: batchToSync.length,
          },
        });

        const remainingPending = Math.max(0, pendingCount - batchToSync.length);

        return {
          success: true,
          syncedCount: batchToSync.length,
          remainingPending,
          spreadsheetId: assets.spreadsheetId,
          message: `Successfully synchronized ${batchToSync.length} lead(s) to Google Sheets! (${remainingPending} pending)`,
        };
      }
    } catch (err: any) {
      console.error('Batch sync Google Sheets API error:', err);
    }
  }

  // 6. On failure or missing token, DO NOT mark as synced. Keep leads pending!
  await prisma.sheetExport.create({
    data: {
      status: 'FAILED',
      type: forceSync ? 'MANUAL_SYNC_NOW' : 'BATCH_SYNC',
      errorMessage: 'Sync failed or user OAuth token missing. Leads remain safely pending in Supabase for retry.',
    },
  });

  return {
    success: false,
    syncedCount: 0,
    pendingCount,
    error: 'Google Sheet synchronization failed. Leads remain pending in Supabase.',
  };
}
