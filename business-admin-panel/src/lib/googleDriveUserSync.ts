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
 * Ensures the 'Sanchay Business' root folder, 'Business Leads' sheet, and 'Backups' subfolder exist in User Drive.
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

  // 2. Check or Create 'Business Leads' Google Sheet inside 'Sanchay Business' folder
  let spreadsheetId = await findDriveItem(
    userAccessToken,
    `name = 'Business Leads' and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
  );

  if (!spreadsheetId) {
    const createSheetRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        properties: {
          title: 'Business Leads',
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
 * Appends / updates rows in the user's Business Leads Google Sheet
 */
export async function syncLeadsToUserSheet(
  userAccessToken: string,
  spreadsheetId: string,
  rows: (string | number)[][]
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:I${rows.length}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `Sheet1!A1:I${rows.length}`,
          majorDimension: 'ROWS',
          values: rows,
        }),
      }
    );
    return res.ok;
  } catch (err) {
    console.error('Error syncing leads to user sheet:', err);
    return false;
  }
}
