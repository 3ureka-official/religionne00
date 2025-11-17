import { NextResponse } from 'next/server';
import { createClient } from 'microcms-js-sdk';
import { MicroCMSCategory } from '@/lib/microcms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// サーバー側でのみmicroCMSクライアントを作成
const getMicroCMSClient = () => {
  return createClient({
    serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN ?? '',
    apiKey: process.env.MICROCMS_API_KEY ?? '',
  });
};

export async function GET() {
  try {
    const client = getMicroCMSClient();
    const data = await client.getList<MicroCMSCategory>({
      endpoint: 'categories',
    });
    
    return NextResponse.json({ categories: data.contents });
  } catch (error) {
    console.error('カテゴリー取得エラー:', error);
    const errorMessage = error instanceof Error ? error.message : 'カテゴリーの取得に失敗しました';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

