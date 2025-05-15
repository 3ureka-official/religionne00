import { fetchCategories } from '@/lib/microcms';
import CategoryListClient from './CategoryListClient';

export default async function CategoryListPage() {
  // サーバー側でカテゴリーデータを取得
  const categories = await fetchCategories();

  return <CategoryListClient categories={categories} />;
}
