import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/firebase/config';

// 許可するメールアドレスのリスト（環境変数から取得）
const getAllowedEmails = (): string[] => {
  const allowedEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS;
  if (!allowedEmailsEnv) {
    console.warn('NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS is not set');
    return [];
  }

  return allowedEmailsEnv
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
};

// メールアドレスが許可リストに含まれているかチェック
export const isEmailAllowed = (email: string | null): boolean => {
  if (!email) return false;
  const allowedEmails = getAllowedEmails();
  return allowedEmails.includes(email.trim().toLowerCase());
};

// Googleログイン
export const signInWithGoogle = async (): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // メールアドレスのチェック
    if (!isEmailAllowed(user.email)) {
      // 許可されていない場合はログアウト
      await firebaseSignOut(auth);
      return {
        success: false,
        error: 'このメールアドレスは管理者権限がありません'
      };
    }

    return {
      success: true,
      user
    };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    
    // エラーメッセージを日本語化
    let errorMessage = 'ログインに失敗しました';
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'ログインがキャンセルされました';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'ポップアップがブロックされました。ブラウザの設定を確認してください';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'ログインがキャンセルされました';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// ログアウト
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    sessionStorage.removeItem('adminAuth');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// 認証状態の監視
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// 現在のユーザーを取得
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

