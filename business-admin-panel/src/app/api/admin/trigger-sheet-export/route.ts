import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGoogleJwt } from '@/lib/googleJwt';
import { autoProvisionUserDrive, syncLeadsToUserSheet, formatGoogleSheet } from '@/lib/googleDriveUserSync';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userAccessToken = body.userAccessToken || req.headers.get('x-google-user-token');

    // 1. Fetch Enquiries from Supabase via Prisma ORM
    const enquiries = await prisma.enquiry.findMany({
      take: 500,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
      },
    });

    // 2. Format Sanitized Rows for Business Sheet
    const rows = [
      ['Date', 'Customer Name', 'Mobile', 'Email', 'Location', 'Service', 'Source', 'Status', 'Message'],
      ...enquiries.map((e) => [
        e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN') : '',
        e.customer?.name || 'N/A',
        e.customer?.phone || 'N/A',
        e.customer?.email || 'N/A',
        e.customer?.location || 'N/A',
        e.service || 'N/A',
        e.source || 'N/A',
        e.status || 'NEW',
        e.message || '',
      ]),
    ];

    // 3. User Google OAuth Auto-Provisioning Flow
    if (userAccessToken) {
      const assets = await autoProvisionUserDrive(userAccessToken);
      const synced = await syncLeadsToUserSheet(userAccessToken, assets.spreadsheetId, rows);

      if (!synced) {
        await prisma.sheetExport.create({
          data: {
            status: 'FAILED',
            type: 'MANUAL_TRIGGER',
            errorMessage: 'Failed to sync leads to User Google Sheet via User OAuth access token.',
          },
        });
        return NextResponse.json(
          { success: false, error: 'Google Sheet sync failed via User OAuth.' },
          { status: 500 }
        );
      }

      const exportRecord = await prisma.sheetExport.create({
        data: {
          completedAt: new Date(),
          status: 'SUCCESS',
          type: 'MANUAL_TRIGGER',
          rowCount: enquiries.length,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Manual sync completed! Exported ${enquiries.length} rows to User Google Sheet in Sanchay Business folder.`,
        exportId: exportRecord.id,
        spreadsheetId: assets.spreadsheetId,
        folderId: assets.folderId,
        rows: enquiries.length,
      });
    }

    // 4. Fallback: Service Account Flow (if configured)
    const googleEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const googleKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!googleEmail || !googleKey || !spreadsheetId) {
      await prisma.sheetExport.create({
        data: {
          status: 'FAILED',
          type: 'MANUAL_TRIGGER',
          errorMessage: 'User Google OAuth token missing and no Service Account key configured.',
        },
      });

      return NextResponse.json(
        { success: false, error: 'Please sign in with Google OAuth to auto-provision and sync your Google Sheet.' },
        { status: 400 }
      );
    }

    const accessToken = await createGoogleJwt(
      googleEmail,
      googleKey,
      'https://www.googleapis.com/auth/spreadsheets'
    );

    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:I${rows.length}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `Sheet1!A1:I${rows.length}`,
          majorDimension: 'ROWS',
          values: rows,
        }),
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      await prisma.sheetExport.create({
        data: {
          status: 'FAILED',
          type: 'MANUAL_TRIGGER',
          errorMessage: errText,
        },
      });
      return NextResponse.json({ success: false, error: errText }, { status: 500 });
    }

    // Apply beautiful formatting to Service Account sheet as well
    await formatGoogleSheet(accessToken, spreadsheetId, rows.length);

    const exportRecord = await prisma.sheetExport.create({
      data: {
        completedAt: new Date(),
        status: 'SUCCESS',
        type: 'MANUAL_TRIGGER',
        rowCount: enquiries.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Manual sync completed! Exported ${enquiries.length} rows to Google Sheet.`,
      exportId: exportRecord.id,
      rows: enquiries.length,
    });
  } catch (err: any) {
    console.error('Manual Sheet Export Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server error triggering export' },
      { status: 500 }
    );
  }
}
