import { fetchProductsByCategory, fetchCategories } from '@/lib/microcms';
import ClientCategoryPage from './ClientCategoryPage';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categoryId = params.category;

  // カテゴリ一覧を取得してカテゴリ名を取得
  const categories = await fetchCategories();
  const matchedCategory = categories.find((cat) => cat.id === categoryId);
  const displayCategory = matchedCategory ? matchedCategory.category : 'Unknown Category';

  // カテゴリに一致する商品を取得
  const products = await fetchProductsByCategory(categoryId);

  const categoryDescription =
    categoryId === 'original'
      ? 'オリジナル商品のコレクションです。当店だけで購入できる限定アイテムを多数取り揃えています。'
      : 'さまざまなスタイルとデザインをご用意しております。ぜひお気に入りの商品をお探しください。';

  return (
    <ClientCategoryPage
      category={categoryId}
      displayCategory={displayCategory}
      products={products}
      categoryDescription={categoryDescription}
    />
  );
}
