import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { getAuthenticatedAdminServer } from '@/lib/serverAuth';

export async function GET() {
  try {
    const admin = await getAuthenticatedAdminServer();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const changelogPath = path.join(process.cwd(), '..', 'CHANGELOG.md');
    let content = '';

    if (fs.existsSync(changelogPath)) {
      content = fs.readFileSync(changelogPath, 'utf-8');
    } else {
      const localPath = path.join(process.cwd(), 'CHANGELOG.md');
      if (fs.existsSync(localPath)) {
        content = fs.readFileSync(localPath, 'utf-8');
      }
    }

    let latestCommit = 'main';
    try {
      latestCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    } catch {
      latestCommit = 'latest';
    }

    return NextResponse.json({
      success: true,
      content: content || '# No CHANGELOG.md found.',
      latestCommit,
      branch: 'main',
    });
  } catch (err: any) {
    console.error('Failed to read CHANGELOG.md:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
