import { NextResponse } from 'next/server';
import { generateFormToken } from '@/lib/security';

export async function GET() {
  return NextResponse.json({ token: generateFormToken() });
}