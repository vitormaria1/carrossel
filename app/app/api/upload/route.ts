import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join('/tmp', filename);

    fs.writeFileSync(filepath, buffer);

    const uploadResponse = await client.beta.files.upload(
      {
        file: new File([buffer], file.name, { type: file.type })
      },
      { headers: { 'anthropic-beta': 'files-api-2025-04-14' } } as any
    );

    fs.unlinkSync(filepath);

    return NextResponse.json({
      id: uploadResponse.id,
      name: file.name,
      type: file.type,
      size: file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
