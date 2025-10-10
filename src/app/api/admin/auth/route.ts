import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // 環境変数から管理者認証情報を取得
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { success: false, message: '管理者認証情報が環境変数に設定されていません' },
        { status: 500 }
      )
    }

    // ユーザー名の検証
    if (username !== adminUsername) {
      return NextResponse.json(
        { success: false, message: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // パスワードの検証（プレーンテキスト）
    const isPasswordValid = password === adminPassword

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // 認証成功
    return NextResponse.json({
      success: true,
      message: 'ログイン成功'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: '認証処理中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 