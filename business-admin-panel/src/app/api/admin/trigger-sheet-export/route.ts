import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGoogleJwt } from '@/lib/googleJwt';

export async function POST(req: NextRequest) {
  try {
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

    const googleEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const googleKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!googleEmail || !googleKey || !spreadsheetId) {
      // Record failed export log in sheet_exports
      await prisma.sheetExport.create({
        data: {
          status: 'FAILED',
          type: 'MANUAL_TRIGGER',
          errorMessage: 'Google Service Account credentials missing in environment variables.',
        },
      });

      return NextResponse.json(
        { success: false, error: 'Google Service Account credentials not configured in environment.' },
        { status: 400 }
      );
    }

    // 3. Generate Service Account JWT Token for Google Sheets API
    const accessToken = await createGoogleJwt(
      googleEmail,
      googleKey,
      'https://www.googleapis.com/auth/spreadsheets'
    );

    // 4. Update Google Sheet via REST API
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:I${rows.length}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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

    // 5. Record Successful Manual Export Log
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
      message: `Manual sync completed successfully! Exported ${enquiries.length} rows to Google Sheet.`,
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
