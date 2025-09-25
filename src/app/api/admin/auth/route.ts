import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    console.log('🔐 認証リクエスト受信:', { username, passwordLength: password?.length })

    // 環境変数から管理者認証情報を取得
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    console.log('📋 環境変数確認:', { 
      hasUsername: !!adminUsername, 
      hasPassword: !!adminPassword,
      adminUsername,
      passwordPrefix: adminPassword?.substring(0, 10)
    })

    if (!adminUsername || !adminPassword) {
      console.error('❌ 管理者認証情報が環境変数に設定されていません')
      return NextResponse.json(
        { success: false, message: '認証設定エラー' },
        { status: 500 }
      )
    }

    // ユーザー名とパスワードの検証
    if (username !== adminUsername) {
      console.log('❌ ユーザー名が一致しません:', { input: username, expected: adminUsername })
      return NextResponse.json(
        { success: false, message: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // パスワードがハッシュ化されているかチェック
    const isPasswordHashed = adminPassword.startsWith('$2a$') || adminPassword.startsWith('$2b$') || adminPassword.startsWith('$2y$')
    
    console.log('🔑 パスワード検証:', { isPasswordHashed })
    
    let isPasswordValid = false
    if (isPasswordHashed) {
      // ハッシュ化されたパスワードと比較
      isPasswordValid = await bcrypt.compare(password, adminPassword)
      console.log('🔍 ハッシュ比較結果:', isPasswordValid)
    } else {
      // プレーンテキストのパスワードと直接比較（開発用）
      isPasswordValid = password === adminPassword
      console.log('🔍 プレーンテキスト比較結果:', isPasswordValid)
      console.warn('⚠️  管理者パスワードがプレーンテキストです。本番環境ではハッシュ化してください。')
    }

    if (!isPasswordValid) {
      console.log('❌ パスワードが一致しません')
      return NextResponse.json(
        { success: false, message: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // 認証成功
    console.log('✅ 認証成功')
    return NextResponse.json({
      success: true,
      message: 'ログイン成功'
    })

  } catch (error) {
    console.error('💥 認証エラー:', error)
    return NextResponse.json(
      { success: false, message: '認証処理中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 