#!/usr/bin/env node

const bcrypt = require('bcryptjs');

// コマンドライン引数からパスワードを取得
const password = process.argv[2];

if (!password) {
  console.error('使用方法: node scripts/hash-password.js <password>');
  console.error('例: node scripts/hash-password.js mySecurePassword123');
  process.exit(1);
}

// パスワードをハッシュ化
const saltRounds = 12; // セキュリティレベル（高いほど安全だが処理時間が長くなる）
const hashedPassword = bcrypt.hashSync(password, saltRounds);

console.log('🔐 パスワードハッシュが生成されました:');
console.log('');
console.log(`ADMIN_PASSWORD=${hashedPassword}`);
console.log('');
console.log('このハッシュを .env.local ファイルに設定してください。');
console.log('⚠️  元のパスワードは安全に保管し、このターミナル履歴は削除してください。'); 