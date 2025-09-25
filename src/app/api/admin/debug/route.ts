import { NextResponse } from 'next/server'

export async function GET() {
  // 本番環境でのみ動作（セキュリティのため）
  if (process.env.NODE_ENV !== 'production' && process.env.VERCEL_ENV !== 'production') {
    return NextResponse.json(
      { error: 'このエンドポイントは本番環境でのみ利用可能です' },
      { status: 403 }
    )
  }

  const debugInfo = {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    adminUsername: process.env.ADMIN_USERNAME,
    // セキュリティのため、パスワードの最初の3文字のみ表示
    passwordPrefix: process.env.ADMIN_PASSWORD?.substring(0, 3) + '***',
    timestamp: new Date().toISOString(),
  }

  console.log('🔍 Admin Debug Info:', debugInfo)
  
  return NextResponse.json(debugInfo)
}

// 本番環境でのみ使用するため、一定時間後に削除することを推奨
export async function DELETE() {
  return NextResponse.json({ message: 'このエンドポイントは削除してください' })
} 