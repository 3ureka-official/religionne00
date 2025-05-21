// microcms-js-sdkをインポート
import { createClient } from "microcms-js-sdk";

// 環境変数から取得するように設定
const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN || "",
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY || "",
});

// カテゴリの型定義
export interface Category {
  id: string;
  name: string;
}

// すべてのカテゴリーを取得
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await client.get({
      endpoint: "categories", // エンドポイント名（CMS側の設定による）
      queries: { limit: 100 }, // 取得上限
    });

    return response.contents;
  } catch (error) {
    console.error("カテゴリー取得エラー:", error);
    // エラー時は空の配列を返す
    return [];
  }
};

// バックアップ用のカテゴリーリスト（CMSから取得できない場合）
export const fallbackCategories: Category[] = [
  { id: "tops", name: "トップス" },
  { id: "bottoms", name: "ボトムス" },
  { id: "outerwear", name: "アウター" },
  { id: "shoes", name: "シューズ" },
  { id: "accessory", name: "アクセサリー" },
  { id: "bag", name: "バッグ" },
  { id: "other", name: "その他" },
]; 