namespace NodeJS {
  interface ProcessEnv {
    // Firebase (クライアント側)
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;
    
    // Firebase (サーバー側)
    FIREBASE_API_KEY?: string;
    FIREBASE_AUTH_DOMAIN?: string;
    FIREBASE_PROJECT_ID?: string;
    FIREBASE_STORAGE_BUCKET?: string;
    FIREBASE_MESSAGING_SENDER_ID?: string;
    FIREBASE_APP_ID?: string;
    
    // Stripe
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    
    // microCMS
    MICROCMS_SERVICE_DOMAIN: string;
    MICROCMS_API_KEY: string;

    // email
    ADMIN_EMAIL: string; // 送信元メールアドレス
    GMAIL_APP_PASSWORD: string; // Gmailアプリパスワード
    
    // Admin Auth (カンマ区切りで複数指定可)
    NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS?: string; // 例: "admin@example.com, manager@example.com"
    
    // App URL
    NEXT_PUBLIC_APP_URL: string;
  }
} 