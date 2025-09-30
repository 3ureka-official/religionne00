/**
 * 日付をフォーマットする
 * @param date 日付オブジェクト
 * @returns YYYY-MM-DD形式のフォーマットされた日付文字列
 */
export function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '不明な日付';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 価格を日本円フォーマットで表示
 * @param price 価格(数値)
 * @returns ¥付きの価格文字列
 */
export function formatPrice(price: number): string {
  const formattedPrice = price.toLocaleString('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return formattedPrice;
} 