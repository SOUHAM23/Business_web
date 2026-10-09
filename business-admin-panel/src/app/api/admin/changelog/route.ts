import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      content: content || '# No CHANGELOG.md found.',
      latestCommit: '3799309',
      branch: 'main',
    });
  } catch (err: any) {
    console.error('Failed to read CHANGELOG.md:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
