/**
 * Google Drive & Sheets User OAuth Auto-Provisioning & Sync Service
 * 
 * Flow:
 * 1. Sukanta Dutta (Friend's father) signs in via Google OAuth with `drive.file` and `spreadsheets` scope.
 * 2. This module uses his user access token to inspect/create in HIS Google Drive:
 *    ├── 📁 Sanchay Business folder
 *    ├── 📊 Business Leads Google Sheet (inside Sanchay Business)
 *    └── 🔒 Backups folder (inside Sanchay Business)
 * 3. Exports leads directly into HIS Google Sheet.
 */

export interface ProvisionedDriveAssets {
  folderId: string;
  spreadsheetId: string;
  backupsFolderId: string;
}

/**
 * Ensures the 'Sanchay Business' root folder, 'Sanchaypath Business Lead' sheet, and 'Backups' subfolder exist in User Drive.
 */
export async function autoProvisionUserDrive(userAccessToken: string): Promise<ProvisionedDriveAssets> {
  const headers = {
    'Authorization': `Bearer ${userAccessToken}`,
    'Content-Type': 'application/json',
  };

  // 1. Check or Create 'Sanchay Business' Folder
  let folderId = await findDriveItem(
    userAccessToken,
    "name = 'Sanchay Business' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
  );

  if (!folderId) {
    const createFolderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Sanchay Business',
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });
    const folderData = await createFolderRes.json();
    folderId = folderData.id;
  }

  // 2. Check or Create 'Sanchaypath Business Lead' Google Sheet inside 'Sanchay Business' folder
  let spreadsheetId = await findDriveItem(
    userAccessToken,
    `name = 'Sanchaypath Business Lead' and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
  );

  if (!spreadsheetId) {
    // Check if old 'Business Leads' sheet exists and rename it
    const oldSheetId = await findDriveItem(
      userAccessToken,
      `name = 'Business Leads' and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
    );

    if (oldSheetId) {
      spreadsheetId = oldSheetId;
      // Rename to 'Sanchaypath Business Lead'
      await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ name: 'Sanchaypath Business Lead' }),
      });
    } else {
      // Create new sheet with title 'Sanchaypath Business Lead'
      const createSheetRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          properties: {
            title: 'Sanchaypath Business Lead',
          },
        }),
      });
      const sheetData = await createSheetRes.json();
      spreadsheetId = sheetData.spreadsheetId;

      // Move created sheet into 'Sanchay Business' folder
      await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${folderId}&fields=id,parents`, {
        method: 'PATCH',
        headers,
      });
    }
  }

  // 3. Check or Create 'Backups' subfolder inside 'Sanchay Business' folder
  let backupsFolderId = await findDriveItem(
    userAccessToken,
    `name = 'Backups' and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );

  if (!backupsFolderId) {
    const createBackupsRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Backups',
        mimeType: 'application/vnd.google-apps.folder',
        parents: [folderId],
      }),
    });
    const backupsData = await createBackupsRes.json();
    backupsFolderId = backupsData.id;
  }

  return {
    folderId: folderId || '',
    spreadsheetId: spreadsheetId || '',
    backupsFolderId: backupsFolderId || '',
  };
}

/**
 * Helper to query items in User Google Drive
 */
async function findDriveItem(accessToken: string, query: string): Promise<string | null> {
  try {
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  } catch (err) {
    console.error('Error finding drive item:', err);
    return null;
  }
}

/**
 * Appends / updates rows in the user's Sanchaypath Business Lead Google Sheet
 */
export async function syncLeadsToUserSheet(
  userAccessToken: string,
  spreadsheetId: string,
  rows: (string | number)[][]
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:J${rows.length}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `Sheet1!A1:J${rows.length}`,
          majorDimension: 'ROWS',
          values: rows,
        }),
      }
    );

    if (res.ok) {
      // Apply beautiful styling & column formatting
      await formatGoogleSheet(userAccessToken, spreadsheetId, rows.length);
    }

    return res.ok;
  } catch (err) {
    console.error('Error syncing leads to user sheet:', err);
    return false;
  }
}

/**
 * Formats the Google Sheet with dark header background, white bold text, text wrapping, and custom column widths.
 */
export async function formatGoogleSheet(accessToken: string, spreadsheetId: string, totalRows: number): Promise<void> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          // 1. Freeze Header Row 1
          {
            updateSheetProperties: {
              properties: {
                sheetId: 0,
                gridProperties: { frozenRowCount: 1 },
              },
              fields: 'gridProperties.frozenRowCount',
            },
          },
          // 2. Format Header Row 1 (Dark Navy #0B1329, Bold White text, Middle alignment)
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 9,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.043, green: 0.075, blue: 0.161 },
                  textFormat: {
                    foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                    bold: true,
                    fontSize: 11,
                  },
                  horizontalAlignment: 'LEFT',
                  verticalAlignment: 'MIDDLE',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)',
            },
          },
          // 3. Set Header Row Height (36px)
          {
            updateDimensionProperties: {
              range: { sheetId: 0, dimension: 'ROWS', startIndex: 0, endIndex: 1 },
              properties: { pixelSize: 36 },
              fields: 'pixelSize',
            },
          },
          // 4. Format Data Rows (Text wrapping, Middle alignment, Font size 10)
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 1,
                endRowIndex: Math.max(totalRows + 5, 100),
                startColumnIndex: 0,
                endColumnIndex: 9,
              },
              cell: {
                userEnteredFormat: {
                  textFormat: { fontSize: 10 },
                  verticalAlignment: 'MIDDLE',
                  wrapStrategy: 'WRAP',
                },
              },
              fields: 'userEnteredFormat(textFormat,verticalAlignment,wrapStrategy)',
            },
          },
          // 5. Column Widths
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 165 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 185 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 135 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, properties: { pixelSize: 220 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 }, properties: { pixelSize: 165 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 5, endIndex: 6 }, properties: { pixelSize: 210 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 6, endIndex: 7 }, properties: { pixelSize: 125 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 7, endIndex: 8 }, properties: { pixelSize: 110 }, fields: 'pixelSize' } },
          { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 8, endIndex: 9 }, properties: { pixelSize: 320 }, fields: 'pixelSize' } },
        ],
      }),
    });
  } catch (err) {
    console.error('Error formatting Google Sheet:', err);
  }
}
